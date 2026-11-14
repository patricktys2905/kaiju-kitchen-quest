// Trace a balance-bot run that timed out: npx vite-node scripts/fy-stuck.ts <stage> <kaiju name prefix> <run 1..> [from=sec] [every=sec]
import fs from 'node:fs';
import { Bot, SKILLED } from '../src/sim/bot';
import { CLASSES } from '../src/sim/classes';
import { MOBS, nemesisOf } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';
const out = (...a: unknown[]) => { fs.writeSync(1, a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' ') + String.fromCharCode(10)); };
const st = STAGES.find(s => s.id === process.argv[2])!, c = CLASSES.find(q => q.name.startsWith(process.argv[3]))!, r = +(process.argv[4] ?? 1) - 1, from = +(process.argv[5] ?? 0), every = +(process.argv[6] ?? 30);
const w = new World(st, derive(heroFor(c.species, st.rec, r + 1)), 100 + r, [{ id: 'jam', n: 8 }, null, null, null], 0, false, undefined, [], nemesisOf(c.species), false);
const bot = new Bot(w, SKILLED, 7 + r);
out('maps', st.maps!.map(m => `${m.kind} ${m.x0}-${m.x1} exit ${m.portals[0]?.x}`).join(' | '));
let next = from;
for (let i = 0; i < 60 * 60 * 15 && !w.cleared && !w.failed; i++) {
  const inp = bot.think(); w.step(inp);
  if (w.time >= next) {
    next = w.time + every; const h = w.hero, mi = w.mapAt(h.x), m = st.maps![mi];
    const near = w.mobs.filter(q => q.state !== 'dead' && Math.abs(q.x - h.x) < 500).map(q => `${q.kind}@${Math.round(q.x)},${Math.round(q.y)}:${q.state}:${Math.round(q.hp)}${q.wake ? ':asleep' : ''}${q.under ? ':under' : ''}`).join(' ');
    out(w.time.toFixed(0), 'hero', Math.round(h.x), Math.round(h.y), h.state, 'on', h.on, 'hp', Math.round(h.hp), 'map', mi, 'drops', w.drops, 'wants', m.goal?.kind === 'collect' ? m.goal.wants.map(q => q.mob + q.n).join('+') : '-', 'done', w.zones2?.[mi]?.done, 'inp', Object.entries(inp).filter(([, v]) => v).map(([k]) => k).join('+'), '| near:', near);
  }
}
out('end', w.time.toFixed(1), w.cleared ? 'CLEARED' : w.failed ? 'FAILED' : 'TIMEOUT', MOBS[st.mobs[0].kind].name);
