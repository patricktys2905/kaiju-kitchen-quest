// Monster drops: every monster kind has its own; map exits want a mix of monsters' drops (handed in as you go
// through); extras stay in the bag; a stage's whole set skips straight to the boss room. Maps respawn their monsters.
import { describe, expect, it } from 'vitest';
import { DROPS } from '../src/sim/drops';
import { MOBS } from '../src/sim/mobs';
import { STAGES, WORLDS } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { NO_INPUT } from '../src/sim/types';
import { World } from '../src/sim/world';

const hero = () => { const p = newProfile(0); p.level = 20; return derive(p); };
const wantsOf = (id: string, k = 0) => { const g = STAGES.find(s => s.id === id)!.maps![k].goal!; if (g.kind !== 'collect') throw new Error('collect'); return g.wants; };

describe('monster drops', () => {
  it('every monster that lives in a world has its own drop', () => {
    for (const w of WORLDS) for (const [, k] of w.pool) expect(DROPS[k]?.[0], k).toBeTruthy();
    expect(new Set(Object.values(DROPS).map(d => d![0])).size).toBe(Object.keys(DROPS).length);
  });

  it('exits want a mix: 2-3 different monsters per map, and a stage asks for several kinds', () => {
    for (const s of STAGES) {
      for (const m of s.maps!.filter(q => q.kind === 'zone')) { const g = m.goal!; if (g.kind !== 'collect') throw new Error(); expect(g.wants.length, s.id).toBeGreaterThanOrEqual(Math.min(2, new Set(m.spawns!.kinds).size)); }
      const kinds = new Set(s.maps!.flatMap(m => m.goal?.kind === 'collect' ? m.goal.wants.map(q => q.mob) : []));
      expect(kinds.size, s.id).toBeGreaterThanOrEqual(2);
    }
  });

  it('a wanted monster drops its item on the floor, and walking over it picks it up', () => {
    const st = STAGES.find(s => s.id === '2-3')!, mob = wantsOf('2-3')[0].mob;
    const w = new World(st, hero(), 3);
    w.hero.x = st.maps![0].x0 + 600; w.hero.y = st.groundY; w.hero.ground = true;
    for (let i = 0; i < 6; i++) { const m = w.spawnMob(mob, w.hero.x + 60, 5); m.hp = 1; w.step({ ...NO_INPUT, attack: true }); for (let k = 0; k < 30; k++) w.step(NO_INPUT); }
    expect(w.drops[mob] ?? 0).toBeGreaterThan(0); // never 3 misses in a row
    expect(w.runDrops[mob]).toBe(w.drops[mob]);
  });

  it('a map exit stays shut without every drop it wants, takes them when you go through, and the rest stay in the bag', () => {
    const st = STAGES.find(s => s.id === '2-3')!, m0 = st.maps![0], wants = wantsOf('2-3'), exit = m0.portals.find(p => p.need)!;
    const w = new World(st, hero(), 3);
    for (const m of w.mobs) { m.hp = 0; m.state = 'dead'; }
    const press = () => { w.hero.x = exit.x; w.hero.y = st.groundY; w.hero.ground = true; w.step(NO_INPUT); return w.step({ ...NO_INPUT, up: true }); };
    for (const q of wants) w.drops[q.mob] = q.n;
    w.drops[wants[1].mob] = wants[1].n - 1;
    expect(press().some(e => e.t === 'needDrops')).toBe(true);
    expect(w.mapAt(w.hero.x)).toBe(0);
    for (const q of wants) w.drops[q.mob] = q.n + 3;
    expect(press().some(e => e.t === 'warp')).toBe(true);
    expect(w.mapAt(w.hero.x)).toBe(1);
    for (const q of wants) expect(w.drops[q.mob]).toBe(3);
  });

  it('monsters come back at the spawn points while you are in the map', () => {
    const st = STAGES.find(s => s.id === '1-1')!;
    const w = new World(st, hero(), 3);
    w.hero.inv = 1e9;
    const inMap = () => w.mobs.filter(m => m.state !== 'dead' && w.mapAt(m.x) === 0).length;
    for (const m of w.mobs) if (w.mapAt(m.x) === 0) { m.hp = 0; m.state = 'dead'; }
    for (let i = 0; i < 60 * 30; i++) w.step(NO_INPUT);
    expect(inMap()).toBeGreaterThan(4);
  });

  it('skipping to the boss starts you in the boss room', () => {
    const st = STAGES.find(s => s.id === '3-5')!;
    const w = new World(st, hero(), 3);
    w.skipToBoss();
    expect(w.mapAt(w.hero.x)).toBe(st.maps!.length - 1);
    expect(MOBS[w.mobs[0].kind]).toBeTruthy();
  });
});
