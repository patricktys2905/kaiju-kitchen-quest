// Crumb income per stage clear vs the Market re-season price: npx vite-node scripts/weak-income.ts [runs per kaiju=2] [kaiju list=0,6,11,17] [stage numbers=3,7,10]
// Per world (stages 3, 7 and the boss): crumbs picked up in the stage (RunStats.crumbs, banked on clear), the crumbs inside the
// loot boxes it hands out ((3 + ilvl) x tier each, save.ts openBox), the salvage value of the gear in those boxes if all of it
// were scrapped (an upper bound: items.ts salvageValue, rarity odds sampled), and reseasonCost at that item level.
import { Bot, SKILLED } from '../src/sim/bot';
import { reseasonCost } from '../src/sim/elements';
import { rollItem, salvageValue, type Item } from '../src/sim/items';
import { nemesisOf } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';
const RUNS = Number(process.argv[2] ?? 2), SP = (process.argv[3] ?? '0,6,11,17').split(',').map(Number);
let seed = 12345; const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const price = (ilvl: number, rarity: number) => reseasonCost({ ilvl, rarity } as Item);
console.log('stage rec  clears  crumbs/clear  +box crumbs  +salvage(all)  boxes | re-season Common / Uncommon / Rare / Epic / Legendary | Rare price in clears (crumbs only .. with boxes)');
for (let wd = 1; wd <= 10; wd++) for (const n of (process.argv[4] ?? '3,7,10').split(',').map(Number)) {
  const st = STAGES.find(s => s.id === `${wd}-${n}`)!;
  let c = 0, cr = 0, box = 0, sal = 0, nb = 0;
  for (const sp of SP) for (let r = 0; r < RUNS; r++) {
    const w = new World(st, derive(heroFor(sp, st.rec, r + 1)), 100 + r, [{ id: 'jam', n: 8 }, null, null, null], 0, false, undefined, [], nemesisOf(sp));
    const bot = new Bot(w, SKILLED, 7 + r);
    for (let i = 0; i < 60 * 900 && !w.cleared && !w.failed; i++) w.step(bot.think());
    if (!w.cleared) continue;
    c++; cr += w.run.crumbs;
    for (const b of [...w.lootOf.flat(), ...w.loot]) { nb++; box += (3 + b.ilvl) * b.tier; sal += salvageValue(rollItem(1, b.tier, b.ilvl, rand, [], sp)); }
  }
  const a = (x: number) => Math.round(x / Math.max(1, c));
  const p = [1, 2, 3, 4, 5].map(q => price(st.rec, q));
  console.log(`${st.id.padEnd(5)} ${String(st.rec).padStart(3)}  ${c}/${SP.length * RUNS}  ${String(a(cr)).padStart(6)}  ${String(a(box)).padStart(6)}  ${String(a(sal)).padStart(6)}  ${(nb / Math.max(1, c)).toFixed(1)} | ${p.join(' / ')} | ${(p[2] / Math.max(1, a(cr))).toFixed(2)} .. ${(p[2] / Math.max(1, a(cr) + a(box))).toFixed(2)}`);
}
