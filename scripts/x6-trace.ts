// Trace one bot run on a scroll stage: npx vite-node scripts/x6-trace.ts <stage> <species> [run=1] [every=5s]
import { Bot, SKILLED } from '../src/sim/bot';
import { nemesisOf } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';
import fs from 'node:fs';
console.log = (...a: unknown[]) => { fs.writeSync(1, a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' ') + String.fromCharCode(10)); };
const st = STAGES.find(s => s.id === process.argv[2])!, sp = +process.argv[3], r = +(process.argv[4] ?? 1) - 1, every = +(process.argv[5] ?? 5);
const m = st.maps![1];
console.log('scroll', st.objective, 'map2', m.x0, m.x1, 'exit', m.portals[0].x);
console.log('plats', st.platforms.filter(p => p.x >= m.x0 && p.x < m.x1).map(p => `${p.x}-${p.x + p.w}@${p.y}${p.move ? 'M' : ''}`).join(' '));
console.log('ladders', st.ladders.filter(l => l.x >= m.x0 && l.x < m.x1).map(l => `${l.x}:${l.top}`).join(' '));
const w = new World(st, derive(heroFor(sp, st.rec, r + 1)), 100 + r, [{ id: 'jam', n: 8 }, null, null, null], 0, false, undefined, [], nemesisOf(sp), false);
const bot = new Bot(w, SKILLED, 7 + r);
let next = -1;
for (let i = 0; i < 60 * 60 * 15 && !w.cleared && !w.failed; i++) {
  const inp = bot.think(); w.step(inp);
  for (const e of w.events) if (e.t === 'objFail' || e.t === 'objective') console.log(w.time.toFixed(1), JSON.stringify(e));
  if (w.objArmed && w.scroll && !w.scroll.got && w.time >= next) { next = w.time + every; const h = w.hero; console.log(w.time.toFixed(1), 'hero', Math.round(h.x), Math.round(h.y), h.state, 'on', h.on, 'hp', Math.round(h.hp), 'timer', Math.round(w.objTimer), Object.entries(inp).filter(([, v]) => v).map(([k]) => k).join('+')); }
}
console.log('end', w.time.toFixed(1), w.cleared ? 'CLEARED' : w.failed ? 'FAILED' : 'TIMEOUT', 'hero', Math.round(w.hero.x), Math.round(w.hero.y));
