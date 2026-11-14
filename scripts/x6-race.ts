// The Recipe Scroll race (stage 6 of every world): where the scroll lies, and how the skilled bot does on it.
//   npx vite-node scripts/x6-race.ts [stage=all x-6] [runs=2]        20 kaiju x runs per stage
//   GROUND=1 ...   the scroll back on the ground at the right end of the top floor's x (the old, wrong placement: "before")
//   T=<seconds>    what-if race timer
// Per stage: clear %, time, jams, RACE LOST % (the "Too slow" fail), seconds from the timer starting to the grab
// (mean / p90 / max) and how many grabs came with under 20 s to spare.
import { Bot, SKILLED } from '../src/sim/bot';
import { CLASSES } from '../src/sim/classes';
import { nemesisOf } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';

const only = process.argv[2] && process.argv[2] !== 'all' ? process.argv[2] : '', RUNS = +(process.argv[3] ?? 2), GROUND = !!process.env.GROUND;
for (const st0 of STAGES.filter(s => s.objective?.kind === 'fetch' && (!only || s.id === only))) {
  const ob = st0.objective!, m = st0.maps![1], exit = m.portals[0].x;
  const floor = st0.platforms.find(p => p.y === ob.y && ob.x! >= p.x && ob.x! <= p.x + p.w)!;
  const st = { ...st0, objective: { ...ob, ...(process.env.T ? { t: +process.env.T } : {}), ...(GROUND ? { y: undefined, x: Math.round(floor.x + floor.w - 50) } : {}) } };
  let n = 0, clear = 0, lost = 0, down = 0, timeout = 0, tSum = 0, jams = 0; const grabs: number[] = [];
  for (const c of CLASSES) for (let r = 0; r < RUNS; r++) {
    const p = heroFor(c.species, st.rec, r + 1);
    const w = new World(st, derive(p), 100 + r, [{ id: 'jam', n: 8 }, null, null, null], 0, false, undefined, [], nemesisOf(c.species), false);
    const bot = new Bot(w, SKILLED, 7 + r);
    let armedAt = -1, grabAt = -1, slow = false;
    for (let i = 0; i < 60 * 60 * 15 && !w.cleared && !w.failed; i++) {
      w.step(bot.think());
      if (armedAt < 0 && w.objArmed) armedAt = w.time;
      if (grabAt < 0 && w.scroll?.got) grabAt = w.time;
      for (const e of w.events) if (e.t === 'objFail' && /Too slow/.test(e.why)) slow = true;
    }
    n++; jams += 8 - (w.hero.bag[0]?.n ?? 0);
    if (w.cleared) { clear++; tSum += w.run.time; } else if (slow) lost++; else if (w.failed) down++; else timeout++;
    if (grabAt >= 0) grabs.push(grabAt - armedAt);
  }
  grabs.sort((a, b) => a - b);
  const pc = (k: number) => Math.round(k / n * 100), q = (f: number) => grabs.length ? Math.round(grabs[Math.min(grabs.length - 1, Math.floor(grabs.length * f))]) : -1;
  console.log(`${st.id.padEnd(5)} scroll x ${st.objective.x} y ${st.objective.y ?? st.groundY} (${st.groundY - (st.objective.y ?? st.groundY)} px up, ${exit - st.objective.x!} px before the exit, map ${Math.round(m.x1 - m.x0)} wide)  clear ${String(pc(clear)).padStart(3)}%  time ${clear ? Math.round(tSum / clear) : '-'}s  jams ${(jams / n).toFixed(1)}  RACE LOST ${pc(lost)}%  downed ${pc(down)}%  timeout ${timeout}  grab after ${grabs.length ? Math.round(grabs.reduce((a, b) => a + b, 0) / grabs.length) : '-'}s (p90 ${q(0.9)}s, max ${q(1)}s; ${grabs.filter(g => g > st.objective.t! - 20).length} of ${grabs.length} with <20 s to spare; timer ${st.objective.t}s)`);
}
