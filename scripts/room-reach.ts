// Can every kaiju get onto every ledge of every boss room by walking, jumping and ladders alone (real hero physics)?
// npx vite-node scripts/room-reach.ts [minWindow=6]
import { CLASSES } from '../src/sim/classes';
import { dailyStage, endlessFloor } from '../src/sim/free';
import { BONUS_STAGES, STAGES, bossRoom } from '../src/sim/stages';
import { type Room, roomKey, roomOf, roomReach } from './reach-lib';

const minWindow = +(process.argv[2] ?? 6);
const rooms = new Map<string, { room: Room; ids: string[] }>();
const add = (id: string, room: Room) => { const k = roomKey(room); (rooms.get(k) ?? rooms.set(k, { room, ids: [] }).get(k)!).ids.push(id); };
for (const st of [...STAGES, ...BONUS_STAGES]) add(st.id, roomOf(st));
for (let d = 0; d < 60; d++) add('daily', roomOf(dailyStage(20261101 + d, 30)));
for (let w = 1; w <= 10; w++) add('rush', roomOf(bossRoom(w)));
for (let f = 1; f <= 30; f++) add('endless', roomOf(endlessFloor(f, 30, 5)));

for (const { room, ids } of rooms.values()) {
  const names = [...new Set(ids)];
  console.log(`\nROOM used by ${ids.length} stages (${names.slice(0, 6).join(' ')}${names.length > 6 ? ' ...' : ''}): width ${room.x1 - room.x0}`);
  console.log('  platforms', room.platforms.map(p => `${p.x}-${p.x + p.w}@${p.y}`).join('  '), ' ladders', room.ladders.map(l => `${l.x}:${l.top}-${l.bottom}`).join('  ') || 'none');
  for (const c of CLASSES) {
    const res = roomReach(room, c.species, minWindow);
    const bad = res.filter(v => v.how === 'none');
    console.log(`  ${c.name.padEnd(12)} speed ${c.speed} jump ${c.jump}  ` + res.map(v => `${v.plat.x}@${v.plat.y}:${v.how}${v.how === 'ladder' ? '' : `(${v.window}f)`}`).join('  ') + (bad.length ? '   <-- UNREACHABLE' : ''));
  }
}
