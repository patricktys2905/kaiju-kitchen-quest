// How many loot boxes a stage hands out (a skilled bot clearing it), by tier: npx vite-node scripts/loot-count.ts [stages...]
import { Bot, SKILLED } from '../src/sim/bot';
import { nemesisOf } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';
for (const id of process.argv.slice(2).length ? process.argv.slice(2) : ['1-2', '3-5', '6-7', '9-10']) {
  const st = STAGES.find(s => s.id === id)!;
  const w = new World(st, derive(heroFor(0, st.rec, 1)), 3, [{ id: 'jam', n: 8 }, null, null, null], 0, false, undefined, [], nemesisOf(0));
  const bot = new Bot(w, SKILLED, 5);
  for (let i = 0; i < 60 * 900 && !w.cleared && !w.failed; i++) w.step(bot.think());
  const all = [...w.lootOf.flat(), ...w.loot];
  const by = [1, 2, 3, 4, 5].map(t => all.filter(b => b.tier === t).length);
  console.log(id, w.cleared ? 'clear' : 'fail', `${Math.round(w.time)}s`, 'boxes in stage', all.length, 'by tier', by.join('/'), 'chests', st.props?.filter(p => p.kind === 'chest').length, 'crates', st.props?.filter(p => p.kind === 'crate').length);
}
