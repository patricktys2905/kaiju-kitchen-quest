// Difficulty check: an average bot plays every stage with every hero at the recommended level and
// ordinary gear (Uncommon/Rare at that item level, stats auto-spent, skills levelled, 3 Jam Jars).
// Usage: npx vite-node scripts/balance.ts [stageFilter] [runsPerHero]
import { AVERAGE, Bot, SKILLED } from '../src/sim/bot';
import { CLASSES, type Stat } from '../src/sim/classes';
import { rollItem, BASES, type Slot } from '../src/sim/items';
import { MOBS, nemesisOf } from '../src/sim/mobs';
import { skillsOf, MAX_SKILL, rankLv } from '../src/sim/skills';
import { STAGES } from '../src/sim/stages';
import { type HeroProfile, derive, newProfile } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { ELEMENT_TUNE } from '../src/sim/elementTune';
import { heroFor } from './hero-at';

const filter = process.argv[2] ?? '';
const RUNS = Number(process.argv[3] ?? 3);
const NIGHTMARE = process.argv[4] === 'nightmare'; // npx vite-node scripts/balance.ts 2- 2 nightmare
const HARD = NIGHTMARE || process.argv[4] === 'hard'; // Hard: monsters +6 levels; the hero comes back a little over-levelled
const OVER = NIGHTMARE ? 6 : HARD ? 3 : 0;
const SKILL = process.argv[5] === 'skilled' ? SKILLED : AVERAGE;
const JAMS = Number(process.argv[6] ?? 3); // jam jars carried // npx vite-node scripts/balance.ts 3- 2 normal skilled
// what-if sweeps without editing elementTune.ts: ELTUNE=off (all six at 1 = the game before weaknesses) or
// ELTUNE=weakDmg,weakStatus,resistDmg,resistStatus,bossWeakDmg,bossResistDmg (e.g. ELTUNE=1.3,1.5,0.8,0.5,1.25,0.85)
if (process.env.ELTUNE) {
  const v = process.env.ELTUNE === 'off' ? [1, 1, 1, 1, 1, 1] : process.env.ELTUNE.split(',').map(Number);
  if (v.length !== 6 || v.some(x => !(x > 0))) throw new Error('ELTUNE needs "off" or six positive numbers');
  [ELEMENT_TUNE.weakDmg, ELEMENT_TUNE.weakStatus, ELEMENT_TUNE.resistDmg, ELEMENT_TUNE.resistStatus, ELEMENT_TUNE.bossWeakDmg, ELEMENT_TUNE.bossResistDmg] = v;
}
// PREPARED=1 (or a 7th argument 'prepared'): the build of a player who read the stage card (hero-at.ts prepare): weapon
// re-seasoned and buttons matched to the boss-room foe. PREPARED=weapon: the re-season only. The bot plays the same.
const PREPARED = process.argv[7] === 'prepared' || process.env.PREPARED === '1' ? 'full' as const : process.env.PREPARED === 'weapon' ? 'weapon' as const : undefined;

function heroAt(species: number, level: number, seed: number): HeroProfile {
  const p = newProfile(species);
  p.level = level;
  const cls = CLASSES.find(c => c.species === species)!;
  const order = (Object.keys(cls.grow) as Stat[]).sort((a, b) => cls.grow[b] - cls.grow[a]);
  for (let i = 0; i < (level - 1) * 3; i++) p.alloc[order[i % 2]]++;
  const sk = skillsOf(species);
  let pts = level - 1;
  const all = [...sk.actives, sk.passive];
  for (let round = 0; round < MAX_SKILL && pts > 0; round++) for (const s of all) if (level >= rankLv(s.unlock, (p.skills[s.id] ?? 0) + 1) && pts > 0 && (p.skills[s.id] ?? 0) < MAX_SKILL) { p.skills[s.id] = (p.skills[s.id] ?? 0) + 1; if (round > 0 || s.id !== sk.actives[0].id) pts--; }
  let s = seed * 7919 + species;
  const rand = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (const slot of ['weapon', 'armor', 'charm'] as Slot[]) {
    let it; do { it = rollItem(1, rand() < 0.5 ? 2 : 3, level, rand, [], species); } while (BASES[it.base].slot !== slot || (BASES[it.base].for !== undefined && BASES[it.base].for !== species));
    it.rarity = Math.min(it.rarity, 3) as 1 | 2 | 3; p.equip[slot] = it;
  }
  return p;
}

console.log('stage  hero          clear  hpLeft  time   (boss: time to kill)');
const summary: string[] = [];
for (const st of STAGES.filter(s => s.id.startsWith(filter))) {
  let clears = 0, total = 0, hpSum = 0, tSum = 0, potions = 0;
  const per: string[] = [];
  for (const c of CLASSES.filter(k => !process.env.KAIJU || process.env.KAIJU.split(',').includes(String(k.species)))) {
    let hc = 0;
    for (let r = 0; r < RUNS; r++) {
      const p = heroFor(c.species, st.rec + OVER, r + 1, PREPARED ? st : undefined, PREPARED); void heroAt; // the shared bot build (skills, gear, skill tree)
      const w = new World(st, derive(p), 100 + r, [{ id: 'jam', n: JAMS }, null, null, null], 0, HARD, undefined, [], nemesisOf(c.species), NIGHTMARE);
      const bot = new Bot(w, SKILL, 7 + r);
      const LIMIT = 60 * 60 * 15;
      let i = 0;
      for (; i < LIMIT && !w.cleared && !w.failed; i++) w.step(bot.think());
      total++;
      if (w.cleared) { clears++; hc++; hpSum += w.hero.hp / w.hero.d.maxHp; tSum += w.run.time; }
      potions += JAMS - (w.hero.bag[0]?.n ?? 0);
      if (!w.cleared && !w.failed) per.push(`${c.name}:TIMEOUT(${w.alive} left${w.boss ? `, boss ${Math.round(w.boss.hp / w.boss.maxHp * 100)}%` : ''} hero ${Math.round(w.hero.x)},${Math.round(w.hero.y)} ${w.hero.state}${w.alive ? '' : ` exit ${w.exitX}`})`);
    }
    per.push(`${c.name.split(' ')[0]} ${hc}/${RUNS}`);
  }
  const line = `${st.id.padEnd(5)} rec Lv${String(st.rec).padEnd(3)} clear ${String(Math.round(clears / total * 100)).padStart(3)}%  hpLeft ${clears ? Math.round(hpSum / clears * 100) : '-'}%  time ${clears ? Math.round(tSum / clears) : '-'}s  jams ${(potions / total).toFixed(1)}${st.boss ? `  BOSS ${MOBS[st.mobs[0].kind].name}` : ''}`;
  console.log(line + '\n      ' + per.join(' | '));
  summary.push(line);
}
