// Does anything alive ever leave the boss room (into the wall / the gap between maps) during a room fight? Prints the first
// time each monster's x is outside the room: npx vite-node scripts/room-escape.ts <stage> [kaiju=20] [seconds=300]
import { Bot, SKILLED } from '../src/sim/bot';
import { CLASSES } from '../src/sim/classes';
import { nemesisOf } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive } from '../src/sim/stats';
import { World } from '../src/sim/world';
import { heroFor } from './hero-at';
const st = STAGES.find(s => s.id === process.argv[2])!, secs = +(process.argv[4] ?? 300);
const b = st.maps!.length - 1, room = st.maps![b];
let n = 0;
for (const c of CLASSES.slice(0, +(process.argv[3] ?? 20))) {
  const w = new World(st, derive(heroFor(c.species, st.rec, 1)), 100, [{ id: 'jam', n: 8 }, null, null, null], 0, false, undefined, [], nemesisOf(c.species));
  w.skipToBoss();
  const bot = new Bot(w, SKILLED, 7), seen = new Set<number>(), inRoom = new Set<number>([w.mobs[0].id]);
  let prev = new Map<number, string>();
  for (let i = 0; i < 60 * secs && !w.cleared && !w.failed; i++) {
    w.step(bot.think());
    const now = new Map<number, string>();
    for (const m of w.mobs) {
      if (m.state === 'dead') continue;
      now.set(m.id, `${m.state}${m.move ? ':' + m.move : ''} x=${Math.round(m.x - room.x0)} vx=${Math.round(m.vx)}`);
      if (w.mapAt(m.x) === b) { inRoom.add(m.id); continue; }
      const born = !prev.has(m.id);
      if (seen.has(m.id) || (!inRoom.has(m.id) && !born)) continue; // other maps' monsters
      if (m.x < room.x0 - 700 && !inRoom.has(m.id)) continue;
      seen.add(m.id); n++;
      console.log(`${st.id} ${c.name} t=${(i / 60).toFixed(1)}s ${m.kind}#${m.id}${m.roomBoss ? ' (ROOM FOE)' : ''} ${born ? 'SPAWNED' : 'LEFT'} outside the room at x=${Math.round(m.x - room.x0)} (room 0..${room.x1 - room.x0}) y=${Math.round(m.y)}; before: ${prev.get(m.id) ?? '-'}; portal=${w.portal}`);
    }
    prev = now;
  }
}
console.log(`${st.id}: ${n} escapes`);
