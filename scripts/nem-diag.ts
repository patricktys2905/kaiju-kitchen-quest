// What hurts a kaiju on a stage (with its nemesis)? npx vite-node scripts/nem-diag.ts <stage> <Kaiju name> [runs]
import { AVERAGE, Bot } from '../src/sim/bot';
import { CLASSES, type Stat } from '../src/sim/classes';
import { rollItem, BASES, type Slot } from '../src/sim/items';
import { nemesisOf, MOBS } from '../src/sim/mobs';
import { skillsOf, MAX_SKILL } from '../src/sim/skills';
import { STAGES } from '../src/sim/stages';
import { type HeroProfile, derive, newProfile } from '../src/sim/stats';
import { World } from '../src/sim/world';
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
const [sid, name, runs = '3'] = process.argv.slice(2);
const c = CLASSES.find(x => x.name.startsWith(name))!, st = STAGES.find(s => s.id === sid)!;
for (let r = 0; r < Number(runs); r++) {
  const w = new World(st, derive(heroAt(c.species, st.rec, r + 1)), 100 + r, [{ id: 'jam', n: 3 }, null, null, null], 0, false, undefined, [], nemesisOf(c.species));
  const bot = new Bot(w, AVERAGE, 7 + r);
  const src: Record<string, number> = {};
  let i = 0;
  for (; i < 60 * 360 && !w.cleared && !w.failed; i++) {
    const before = w.hero.hp;
    w.step(bot.think());
    if (w.hero.hp < before) { const n = w.mobs.filter(m => m.state !== 'dead').reduce((a, m) => Math.abs(m.x - w.hero.x) < Math.abs(a.x - w.hero.x) ? m : a, w.mobs[0]); const k = n ? n.kind + ':' + (n.move || n.state) : 'hazard'; src[k] = (src[k] ?? 0) + before - w.hero.hp; }
  }
  const nem = w.mobs.find(m => MOBS[m.kind].brain === 'nemesis');
  console.log(c.name, sid, r, w.cleared ? 'clear' : w.failed ? 'died' : 'timeout', Math.round(i / 60) + 's', 'nemesis', nem ? Math.round(nem.hp / nem.maxHp * 100) + '%' : 'beaten', JSON.stringify(Object.fromEntries(Object.entries(src).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => [k, Math.round(v)]))));
}
