// Climb every ladder in every stage, step off the top both ways and walk on: the hero must never stay up in the air.
// npx vite-node scripts/ladder-probe.ts
import { STAGES, BONUS_STAGES } from '../src/sim/stages';
import { World } from '../src/sim/world';
import { derive, newProfile } from '../src/sim/stats';
import { NO_INPUT } from '../src/sim/types';
let bad = 0, n = 0;
for (const st of [...STAGES, ...BONUS_STAGES]) {
  for (const [li, l] of st.ladders.entries()) {
    for (const dir of [-1, 1]) {
      const w = new World({ ...st, mobs: [], arenas: [], hazards: [], chase: undefined }, derive(newProfile(0)), 1);
      const h = w.hero; h.x = l.x; h.y = st.groundY;
      let i = 0;
      for (; i < 600 && h.state !== 'climb'; i++) w.step({ ...NO_INPUT, up: true });
      for (; i < 1200 && h.state === 'climb'; i++) w.step({ ...NO_INPUT, up: true });
      for (let k = 0; k < 150; k++) w.step({ ...NO_INPUT, left: dir < 0, right: dir > 0 });
      n++;
      const under = w.floorBelow(h.x, h.y - 2, h.y + 4, false);
      if (h.ground && h.y < st.groundY - 2 && !under) { bad++; console.log(`AIR ${st.id} ladder ${li} x${Math.round(l.x)} top ${l.top} dir ${dir} → hero ${Math.round(h.x)},${Math.round(h.y)} on ${h.on} state ${h.state}`); }
    }
  }
}
console.log(`${n} ladder exits, ${bad} left the hero walking in the air`);
