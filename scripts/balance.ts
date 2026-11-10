// Difficulty check: an average bot plays every stage with every hero at the recommended level and
// ordinary gear (Uncommon/Rare at that item level, stats auto-spent, skills levelled, 3 Jam Jars).
// Usage: npx vite-node scripts/balance.ts [stageFilter] [runsPerHero]
import { AVERAGE, Bot } from '../src/sim/bot';
import { CLASSES, type Stat } from '../src/sim/classes';
import { rollItem, BASES, type Slot } from '../src/sim/items';
import { MOBS, nemesisOf } from '../src/sim/mobs';
import { skillsOf, MAX_SKILL } from '../src/sim/skills';
import { STAGES } from '../src/sim/stages';
import { type HeroProfile, derive, newProfile } from '../src/sim/stats';
import { World } from '../src/sim/world';

const filter = process.argv[2] ?? '';
const RUNS = Number(process.argv[3] ?? 3);

function heroAt(species: number, level: number, seed: number): HeroProfile {
  const p = newProfile(species);
  p.level = level;
  const cls = CLASSES.find(c => c.species === species)!;
  const order = (Object.keys(cls.grow) as Stat[]).sort((a, b) => cls.grow[b] - cls.grow[a]);
  for (let i = 0; i < (level - 1) * 3; i++) p.alloc[order[i % 2]]++;
  const sk = skillsOf(species);
  let pts = level - 1;
  const all = [...sk.actives, sk.passive];
  for (let round = 0; round < MAX_SKILL && pts > 0; round++) for (const s of all) if (level >= s.unlock && pts > 0 && (p.skills[s.id] ?? 0) < MAX_SKILL) { p.skills[s.id] = (p.skills[s.id] ?? 0) + 1; if (round > 0 || s.id !== sk.actives[0].id) pts--; }
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
  for (const c of CLASSES) {
    let hc = 0;
    for (let r = 0; r < RUNS; r++) {
      const p = heroAt(c.species, st.rec, r + 1);
      const w = new World(st, derive(p), 100 + r, [{ id: 'jam', n: 3 }, null, null, null], 0, false, undefined, [], nemesisOf(c.species));
      const bot = new Bot(w, AVERAGE, 7 + r);
      const LIMIT = 60 * 60 * 6;
      let i = 0;
      for (; i < LIMIT && !w.cleared && !w.failed; i++) w.step(bot.think());
      total++;
      if (w.cleared) { clears++; hc++; hpSum += w.hero.hp / w.hero.d.maxHp; tSum += w.run.time; }
      potions += 3 - (w.hero.bag[0]?.n ?? 0);
      if (!w.cleared && !w.failed) per.push(`${c.name}:TIMEOUT(${w.alive} left${w.boss ? `, boss ${Math.round(w.boss.hp / w.boss.maxHp * 100)}%` : ''} hero ${Math.round(w.hero.x)},${Math.round(w.hero.y)} ${w.hero.state}${w.alive ? '' : ` exit ${w.exitX}`})`);
    }
    per.push(`${c.name.split(' ')[0]} ${hc}/${RUNS}`);
  }
  const line = `${st.id.padEnd(5)} rec Lv${String(st.rec).padEnd(3)} clear ${String(Math.round(clears / total * 100)).padStart(3)}%  hpLeft ${clears ? Math.round(hpSum / clears * 100) : '-'}%  time ${clears ? Math.round(tSum / clears) : '-'}s  jams ${(potions / total).toFixed(1)}${st.boss ? `  BOSS ${MOBS[st.mobs[0].kind].name}` : ''}`;
  console.log(line + '\n      ' + per.join(' | '));
  summary.push(line);
}
