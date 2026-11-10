// Mid-ladder actions for every kaiju: does anything leave the hero standing/walking in the air afterwards?
// npx vite-node scripts/ladder-probe2.ts
import { STAGES } from '../src/sim/stages';
import { World } from '../src/sim/world';
import { derive } from '../src/sim/stats';
import { CLASSES } from '../src/sim/classes';
import { NO_INPUT, type Input } from '../src/sim/types';
import { heroFor } from './hero-at';
const st = STAGES.find(s => s.ladders.length && s.ladders[0].top <= 290)!;
const l = st.ladders[0];
const acts: Record<string, Partial<Input>[]> = {
  attack: [{ attack: true }], skill1: [{ skill1: true }], skill2: [{ skill2: true }], skill3: [{ skill3: true }], ult: [{ ult: true }], gear: [{ gear: true }],
  jump: [{ jump: true }], jumpSide: [{ jump: true, right: true }], dodge: [{ right: true }, {}, { right: true }], item: [{ item1: true }],
};
let bad = 0;
for (const c of CLASSES) for (const [name, seq] of Object.entries(acts)) for (const dir of [-1, 1]) {
  const w = new World({ ...st, mobs: [], arenas: [], hazards: [], chase: undefined }, derive(heroFor(c.species, 40, 1)), 1, [{ id: 'jam', n: 3 }, null, null, null]);
  const h = w.hero; h.x = l.x; h.y = st.groundY; h.ult = 100; h.hp = h.d.maxHp * 0.5;
  for (let i = 0; i < 400 && h.state !== 'climb'; i++) w.step({ ...NO_INPUT, up: true });
  for (let i = 0; i < 20; i++) w.step({ ...NO_INPUT, up: true }); // part way up
  for (const s of seq) { w.step({ ...NO_INPUT, ...s }); w.step({ ...NO_INPUT }); }
  for (let i = 0; i < 120; i++) w.step({ ...NO_INPUT });
  for (let i = 0; i < 90; i++) w.step({ ...NO_INPUT, left: dir < 0, right: dir > 0 });
  for (let i = 0; i < 60; i++) w.step({ ...NO_INPUT });
  const under = w.floorBelow(h.x, h.y - 2, h.y + 4, false);
  const ladder = w.stage.ladders.some(q => Math.abs(q.x - h.x) < 20 && h.y >= q.top - 2 && h.y <= q.bottom);
  if (h.y < st.groundY - 2 && !under && !(h.state === 'climb' && ladder)) { bad++; console.log(`AIR ${c.name} ${name} dir ${dir}: ${Math.round(h.x)},${Math.round(h.y)} ${h.state} ground ${h.ground} on ${h.on} (ladder x ${Math.round(l.x)})`); }
}
console.log(`stage ${st.id}: ${bad} cases left a kaiju in the air`);
