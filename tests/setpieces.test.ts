import { MOBS } from '../src/sim/mobs';
// Arena rooms, the rolling-pin chase, conveyor belts.
import { describe, expect, it } from 'vitest';
import { STAGES } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { NO_INPUT, type StageDef } from '../src/sim/types';
import { World } from '../src/sim/world';

const flat: StageDef = {
  id: 't', world: 1, num: 't', name: 't', bg: 'bg-far', mid: '', tile: 'tile-ground', platTint: 0xffffff, width: 2400, groundY: 400, lv: [3, 3], par: 60, rec: 1,
  platforms: [], ladders: [], mobs: [],
};
const hero = (sp = 0) => { const p = newProfile(sp); p.level = 12; return derive(p); };

describe('arena rooms', () => {
  it('every story stage has at least one, with three waves (one-wave rooms are miniboss rooms)', () => {
    for (const s of STAGES.filter(x => !x.boss)) {
      const rooms = (s.arenas ?? []).filter(a => a.waves.length > 1);
      expect(rooms.length, s.id).toBeGreaterThanOrEqual(1);
      for (const a of rooms) expect(a.waves.length).toBe(3);
      for (const a of (s.arenas ?? []).filter(a => a.waves.length === 1)) expect(MOBS[a.waves[0][0].kind].mini, s.id).toBe(true);
    }
  });
  it('the gates shut, the waves come one after another, then the gates open and the exit can open', () => {
    const st: StageDef = { ...flat, arenas: [{ x0: 800, x1: 1440, waves: [[{ kind: 'bun', x: 900, lv: 1 }], [{ kind: 'bun', x: 1300, lv: 1 }, { kind: 'worm', x: 1350, lv: 1 }]] }] };
    const w = new World(st, hero(), 1);
    w.hero.hp = w.hero.d.maxHp = 1e7;
    w.step(NO_INPUT);
    expect(w.portal).toBe(false); // no monsters yet, but the arena isn't done
    w.hero.x = 1100;
    const evs = [...w.step(NO_INPUT), ...w.step(NO_INPUT)];
    expect(evs.some(e => e.t === 'arenaLock')).toBe(true);
    expect(w.mobs.filter(m => m.arena === 0).length).toBe(1);
    // can't walk out
    for (let i = 0; i < 120; i++) w.step({ ...NO_INPUT, right: true });
    expect(w.hero.x).toBeLessThan(1440);
    for (const m of w.mobs) { m.hp = 0; m.state = 'dead'; }
    w.step(NO_INPUT);
    expect(w.mobs.filter(m => m.arena === 0 && m.state !== 'dead').length).toBe(2); // wave 2
    for (const m of w.mobs) { m.hp = 0; m.state = 'dead'; }
    const end = [...w.step(NO_INPUT), ...w.step(NO_INPUT)];
    expect(end.some(e => e.t === 'arenaClear')).toBe(true);
    for (let i = 0; i < 60; i++) w.step(NO_INPUT);
    expect(w.portal).toBe(true);
  });
});

describe('rolling-pin chase', () => {
  it('standing still gets you flattened; running keeps you ahead', () => {
    const st: StageDef = { ...flat, width: 5000, chase: { x0: 500, x1: 1900 } }; // long enough that you don't reach the exit first
    const still = new World(st, hero(10), 1); // Bluebeary, the slowest
    still.hero.x = 560;
    const hp = still.hero.hp;
    for (let i = 0; i < 60 * 4; i++) still.step(NO_INPUT);
    expect(still.hero.hp).toBeLessThan(hp);
    const run = new World(st, hero(10), 1);
    run.hero.x = 560;
    const hp2 = run.hero.hp;
    for (let i = 0; i < 60 * 13; i++) run.step({ ...NO_INPUT, right: true });
    expect(run.hero.hp).toBe(hp2);
    expect(run.chase!.done).toBe(true);
  });
});

describe('conveyor belts', () => {
  it('carry you along while you stand on them', () => {
    const w = new World({ ...flat, belts: [{ x: 600, w: 300, v: 90 }] }, hero(), 1);
    w.hero.x = 560;
    for (let i = 0; i < 60; i++) w.step(NO_INPUT);
    expect(w.hero.x).toBeGreaterThan(620);
    expect(STAGES.some(s => s.belts?.length)).toBe(true);
  });
});
