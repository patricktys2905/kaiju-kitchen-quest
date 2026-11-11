// Where does the balance bot get stuck on long stages? Runs every kaiju once on the given stages and, for any run where
// the hero makes no progress for 40 s, prints the hero, the nearest things around it, arenas and what's still alive.
// npx vite-node scripts/stuck-check.ts <stagePrefix> [runs=1]
import { AVERAGE, Bot } from '../src/sim/bot';
import { CLASSES } from '../src/sim/classes';
import { MOBS, nemesisOf } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';

const pre = process.argv[2] ?? '6-5', RUNS = Number(process.argv[3] ?? 1);
for (const st of STAGES.filter(s => s.id === pre || s.id.startsWith(pre + '-') || (pre.includes('-') ? s.id === pre : s.id.startsWith(pre)))) {
  for (const c of CLASSES) for (let r = 0; r < RUNS; r++) {
    const w = new World(st, derive(heroFor(c.species, st.rec, r + 1)), 100 + r, [{ id: 'jam', n: 3 }, null, null, null], 0, false, undefined, [], nemesisOf(c.species));
    const bot = new Bot(w, AVERAGE, 7 + r);
    let best = 0, bestT = 0, i = 0;
    for (; i < 60 * 60 * 15 && !w.cleared && !w.failed; i++) {
      w.step(bot.think());
      const prog = w.hero.x + (60 - w.alive) * 1000; // moving right or killing things is progress
      if (prog > best + 30) { best = prog; bestT = w.time; }
      if (w.time - bestT > 40) break;
    }
    if (w.cleared || w.failed) continue;
    const h = w.hero;
    const near = (x: number) => Math.abs(x - h.x) < 500;
    console.log(`\n${st.id} ${c.name}: STUCK at ${Math.round(h.x)},${Math.round(h.y)} ${h.state} ground=${h.ground} on=${h.on} alive=${w.alive} portal=${w.portal} t=${Math.round(w.time)}s`);
    console.log('  alive:', w.mobs.filter(m => m.state !== 'dead').sort((a, b) => b.arena - a.arena).map(m => `${m.kind}@${Math.round(m.x)},${Math.round(m.y)}${m.arena >= 0 ? ' arena' + m.arena : ''}${m.wake ? ' asleep' : ''}${m.under ? ' under' : ''}`).slice(0, 8).join(' | '));
    console.log('  arenas:', w.arenas.map((a, k) => `${k}:${a.x0}-${a.x1} ${a.locked ? 'LOCKED' : ''}${a.done ? 'done' : ''} wave${a.wave}`).join(' | '));
    console.log('  platforms:', w.stage.platforms.filter(p => near(p.x) || near(p.x + p.w)).map(p => `${Math.round(p.x)}+${p.w}@${p.y}${p.move ? 'm' : ''}${p.secret ? 's' : ''}`).join(' '));
    console.log('  ladders:', w.stage.ladders.filter(l => near(l.x)).map(l => `${l.x}:${l.top}`).join(' '), ' props:', w.props.filter(p => near(p.x)).map(p => `${p.kind}@${p.x},${p.y}`).join(' '));
    console.log('  hazards:', w.hazards.filter(z => near(z.x)).map(z => `${z.kind}@${z.x}`).join(' '), ' belts:', JSON.stringify(w.stage.belts ?? []), ' chase:', JSON.stringify(w.chase), ' exit', w.exitX, MOBS ? '' : '');
  }
}
