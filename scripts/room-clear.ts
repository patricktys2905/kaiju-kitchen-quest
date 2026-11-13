// Like room-duel, but fights on until the boss room is CLEAR (the exit opens), not just until the foe falls: a summon left
// on a ledge the kaiju can't reach shows up as STUCK. npx vite-node scripts/room-clear.ts <stage> [kaiju=20] [seconds=300]
import { Bot, SKILLED } from '../src/sim/bot';
import { CLASSES } from '../src/sim/classes';
import { nemesisOf } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';
const st = STAGES.find(s => s.id === process.argv[2])!, secs = +(process.argv[4] ?? 300);
const x0 = st.maps![st.maps!.length - 1].x0;
let killed = 0, clear = 0, stuck = 0, died = 0, climbs = 0;
for (const c of CLASSES.slice(0, +(process.argv[3] ?? 20))) {
  const w = new World(st, derive(heroFor(c.species, st.rec, 1)), 100, [{ id: 'jam', n: 8 }, null, null, null], 0, false, undefined, [], nemesisOf(c.species));
  w.skipToBoss();
  const bot = new Bot(w, SKILLED, 7), f = w.mobs[0];
  let i = 0, tKill = -1, onLadder = 0;
  for (; i < 60 * secs && !w.portal && !w.failed; i++) {
    w.step(bot.think());
    if (w.hero.state === 'climb') onLadder++;
    if (tKill < 0 && f.state === 'dead') tKill = i / 60;
  }
  const left = w.mobs.filter(m => m.state !== 'dead' && w.mapAt(m.x) === st.maps!.length - 1);
  if (tKill >= 0) killed++;
  if (w.portal) clear++; else if (w.failed) died++; else if (tKill >= 0) stuck++;
  if (onLadder) climbs++;
  console.log(c.name.padEnd(12), f.kind, tKill >= 0 ? `foe down ${Math.round(tKill)}s` : 'foe alive', w.portal ? `CLEAR ${Math.round(i / 60)}s` : w.failed ? 'DIED' : tKill >= 0 ? 'STUCK (foe dead, room never clear)' : 'TIMEOUT',
    `ladder ${(onLadder / 60).toFixed(1)}s`, left.length ? ' left: ' + left.map(m => `${m.kind}@${Math.round(m.x - x0)},${Math.round(m.y)}`).join(' ') + ` hero@${Math.round(w.hero.x - x0)},${Math.round(w.hero.y)}` : '');
}
console.log(`${st.id}: foe killed ${killed}/20, room clear ${clear}, stuck after the kill ${stuck}, died ${died}, used a ladder ${climbs}`);
