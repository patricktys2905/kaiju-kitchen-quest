// Free mode balance: npx vite-node scripts/free-balance.ts [runs]
// Daily Dungeon at several levels, how deep the bot gets in the Endless Pantry (random perks), and Boss Rush clears.
import { AVERAGE, Bot } from '../src/sim/bot';
import { CLASSES } from '../src/sim/classes';
import { dailyStage, endlessFloor, perkChoices, rushStages, withPerks } from '../src/sim/free';
import { derive } from '../src/sim/stats';
import type { StageDef } from '../src/sim/types';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';

const RUNS = Number(process.argv[2] ?? 4);
const SP = CLASSES.map(c => c.species);
function run(st: StageDef, sp: number, lv: number, r: number, perks: string[] = [], hpFrac = 1) {
  const w = new World(st, withPerks(derive(heroFor(sp, lv, r + 1)), perks), 100 + r, [{ id: 'jam', n: 3 }, null, null, null]);
  w.hero.hp = Math.max(1, Math.round(w.hero.d.maxHp * hpFrac));
  const bot = new Bot(w, AVERAGE, 7 + r);
  for (let i = 0; i < 60 * 60 * 5 && !w.cleared && !w.failed; i++) w.step(bot.think());
  return { cleared: w.cleared, hp: w.hero.hp / w.hero.d.maxHp };
}
for (const lv of [10, 25, 40, 55]) {
  let c = 0, hp = 0, n = 0;
  for (const day of [20261110, 20261111, 20261112, 20261113, 20261114]) for (const sp of SP) for (let r = 0; r < RUNS; r++) { const o = run(dailyStage(day, lv), sp, lv, r); n++; if (o.cleared) { c++; hp += o.hp; } }
  console.log(`daily Lv${lv}: clear ${Math.round(c / n * 100)}%  hpLeft ${Math.round(hp / Math.max(1, c) * 100)}%`);
}
for (const lv of [15, 40]) {
  const depth: number[] = [];
  for (const sp of SP) for (let r = 0; r < RUNS; r++) {
    let floor = 1, perks: string[] = [], hpFrac = 1;
    for (; floor <= 30; floor++) {
      const o = run(endlessFloor(floor, lv, 11 + r), sp, lv, r, perks, hpFrac);
      if (!o.cleared) break;
      const p = perkChoices(floor, 11 + r)[r % 3];
      perks = [...perks, p.id]; hpFrac = Math.min(1, o.hp + (p.id === 'heal' ? 0.6 : 0.1));
    }
    depth.push(floor - 1);
  }
  depth.sort((a, b) => a - b);
  console.log(`endless Lv${lv}: floors cleared median ${depth[depth.length >> 1]}, best ${depth[depth.length - 1]}, worst ${depth[0]}`);
}
for (const lv of [30, 58]) {
  let c = 0, n = 0;
  for (const sp of SP) for (let r = 0; r < RUNS; r++) {
    let hpFrac = 1, ok = true;
    for (const st of rushStages(lv > 50 ? [1, 2, 3, 4, 5] : [1, 2], lv)) { const o = run(st, sp, lv, r, [], hpFrac); if (!o.cleared) { ok = false; break; } hpFrac = Math.min(1, o.hp + 0.5); }
    n++; if (ok) c++;
  }
  console.log(`rush Lv${lv}: clear ${Math.round(c / n * 100)}%`);
}
