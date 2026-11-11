// Monster drops: every monster kind has its own; map exits want a number of one monster's drop (handed in as you go
// through); extras stay in the bag; a stage's whole set skips straight to the boss room.
import { describe, expect, it } from 'vitest';
import { DROPS } from '../src/sim/drops';
import { MOBS } from '../src/sim/mobs';
import { STAGES, WORLDS } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { NO_INPUT } from '../src/sim/types';
import { World } from '../src/sim/world';

const hero = () => { const p = newProfile(0); p.level = 20; return derive(p); };

describe('monster drops', () => {
  it('every monster that lives in a world has its own drop', () => {
    for (const w of WORLDS) for (const [, k] of w.pool) expect(DROPS[k]?.[0], k).toBeTruthy();
    expect(new Set(Object.values(DROPS).map(d => d![0])).size).toBe(Object.keys(DROPS).length);
  });

  it('the quest monster drops its item on the floor, and walking over it picks it up', () => {
    const st = STAGES.find(s => s.id === '2-3')!, g = st.maps![0].goal!;
    if (g.kind !== 'collect') throw new Error('map 1 hunts');
    const w = new World(st, hero(), 3);
    w.hero.x = st.maps![0].x0 + 600;
    let dropped = 0;
    for (let i = 0; i < 6; i++) { const m = w.spawnMob(g.mob, w.hero.x + 60, 5); m.hp = 1; w.step({ ...NO_INPUT, attack: true }); for (let k = 0; k < 30; k++) w.step(NO_INPUT); dropped = w.drops[g.mob] ?? 0; }
    expect(dropped).toBeGreaterThan(0); // never 3 misses in a row
    expect(w.runDrops[g.mob]).toBe(dropped);
  });

  it('a map exit stays shut without enough drops, takes them when you go through, and the rest stay in the bag', () => {
    const st = STAGES.find(s => s.id === '2-3')!, m0 = st.maps![0], g = m0.goal!, exit = m0.portals.find(p => p.need)!;
    if (g.kind !== 'collect') throw new Error('map 1 hunts');
    const w = new World(st, hero(), 3);
    for (const m of w.mobs) { m.hp = 0; m.state = 'dead'; }
    const press = () => { w.hero.x = exit.x; w.hero.ground = true; w.step(NO_INPUT); return w.step({ ...NO_INPUT, up: true }); };
    w.drops[g.mob] = g.need - 1;
    expect(press().some(e => e.t === 'needDrops')).toBe(true);
    expect(w.mapAt(w.hero.x)).toBe(0);
    w.drops[g.mob] = g.need + 3;
    expect(press().some(e => e.t === 'warp')).toBe(true);
    expect(w.mapAt(w.hero.x)).toBe(1);
    expect(w.drops[g.mob]).toBe(3);
  });

  it('skipping to the boss starts you in the boss room', () => {
    const st = STAGES.find(s => s.id === '3-5')!;
    const w = new World(st, hero(), 3);
    w.skipToBoss();
    expect(w.mapAt(w.hero.x)).toBe(st.maps!.length - 1);
    expect(MOBS[w.mobs[0].kind]).toBeTruthy();
  });
});
