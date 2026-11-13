// Does a monster standing on the boss room's top ledge ever come down by itself? Puts one of every kind up there (room foe
// removed), with the hero waiting under it / on the side ledge for 60 s each: npx vite-node scripts/room-perch.ts [stage=4-3] [species=1]
import { MOBS } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { type MobKind, NO_INPUT } from '../src/sim/types';
import { World } from '../src/sim/world';

const st = STAGES.find(s => s.id === (process.argv[2] ?? '4-3'))!, species = +(process.argv[3] ?? 1);
const room = st.maps![st.maps!.length - 1];
const top = st.platforms.filter(p => p.x >= room.x0 && p.x < room.x1).sort((a, b) => a.y - b.y)[0];
const stays: string[] = [], leaves: string[] = [];
for (const kind of Object.keys(MOBS) as MobKind[]) {
  const def = MOBS[kind];
  if (def.brain === 'boss' || def.brain === 'nemesis') continue;
  let down = false;
  for (const [hx, hy] of [[top.x + top.w / 2, st.groundY], [top.x - 110, top.y + 88]] as const) {
    const w = new World({ ...st, mobs: [] }, derive(newProfile(species)), 3);
    w.skipToBoss();
    const h = w.hero; h.x = hx; h.y = hy - 1; h.ground = false; h.on = null; h.inv = 1e9;
    const m = w.spawnMob(kind, top.x + top.w / 2, st.lv[0], top.y);
    for (let i = 0; i < 60 * 60 && !down; i++) { w.step({ ...NO_INPUT }); if (def.brain === 'flyer' ? m.y > top.y + 20 : m.ground && m.y > top.y + 20) down = true; }
  }
  (down ? leaves : stays).push(`${kind}(${def.brain})`);
}
console.log(`${st.id} top ledge ${Math.round(top.x - room.x0)}-${Math.round(top.x + top.w - room.x0)}@${top.y}`);
console.log(`STAY up there for ever (${stays.length}):`, stays.join(' '));
console.log(`come down (${leaves.length}):`, leaves.join(' '));
