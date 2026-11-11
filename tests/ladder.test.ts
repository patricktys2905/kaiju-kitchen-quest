// Ladders: jumping off (or doing anything) mid-climb must never leave a kaiju standing or walking on air.
import { describe, expect, it } from 'vitest';
import { CLASSES } from '../src/sim/classes';
import { STAGES } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { NO_INPUT } from '../src/sim/types';
import { World } from '../src/sim/world';

describe('ladders', () => {
  const st = STAGES.find(s => s.ladders.length > 0)!, l = st.ladders[0];
  const climbing = (sp: number) => {
    const w = new World({ ...st, mobs: [], arenas: [], hazards: [], chase: undefined }, derive(newProfile(sp)), 1);
    const h = w.hero; h.x = l.x; h.y = st.groundY;
    for (let i = 0; i < 400 && h.state !== 'climb'; i++) w.step({ ...NO_INPUT, up: true });
    for (let i = 0; i < 20; i++) w.step({ ...NO_INPUT, up: true }); // part way up
    return { w, h };
  };
  it('climbing never counts as standing on the floor', () => {
    const { h } = climbing(0);
    expect(h.state).toBe('climb');
    expect(h.ground).toBe(false);
  });
  it('jumping off sideways falls back to the floor for every kaiju', () => {
    for (const c of CLASSES) for (const right of [true, false]) {
      const { w, h } = climbing(c.species);
      w.step({ ...NO_INPUT, jump: true, right, left: !right });
      for (let i = 0; i < 120; i++) w.step({ ...NO_INPUT, right, left: !right });
      const under = w.floorBelow(h.x, h.y - 2, h.y + 4, false);
      expect(!!under || h.y >= st.groundY - 1, `${c.name} floats at ${Math.round(h.x)},${Math.round(h.y)}`).toBe(true);
    }
  });
});
