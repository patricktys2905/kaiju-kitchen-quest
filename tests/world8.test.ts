// World 8 (The Garden, the Mystery Meatloaf) and its locals Sloba (12) and Minturtle (16).
import { describe, expect, it } from 'vitest';
import { GEAR } from '../src/sim/gear';
import { BASES, UNIQUES } from '../src/sim/items';
import { SKILLS, ULTS } from '../src/sim/skills';
import { STAGES } from '../src/sim/stages';
import { MAX_LEVEL, derive, newProfile } from '../src/sim/stats';
import { NO_INPUT, type StageDef } from '../src/sim/types';
import { World } from '../src/sim/world';

const flat: StageDef = { id: 't', world: 1, num: 't', name: 't', bg: 'bg-far', mid: '', tile: 'tile-ground', platTint: 0xffffff, width: 2400, groundY: 470, lv: [5, 5], par: 60, rec: 5, platforms: [], ladders: [], mobs: [] };
function world(sp: number, st: StageDef = flat) {
  const p = newProfile(sp); p.level = 20;
  for (const a of SKILLS[sp]?.actives ?? []) p.skills[a.id] = 1;
  const w = new World(st, derive(p), 3);
  w.hero.x = 500; w.hero.face = 1;
  return w;
}
const cast = (w: World, slot: 1 | 2 | 3) => w.step({ ...NO_INPUT, [`skill${slot}`]: true });
const tank = (w: World, x: number) => { const m = w.spawnMob('bun', x, 5); m.hp = m.maxHp = 1e6; return m; };

describe('World 8: The Garden', () => {
  it('ten stages ending with the Mystery Meatloaf; the level cap reaches it', () => {
    const w8 = STAGES.filter(s => s.world === 8);
    expect(w8.length).toBe(10);
    expect(w8[9].mobs[0].kind).toBe('meatloaf');
    expect(MAX_LEVEL).toBeGreaterThanOrEqual(w8[9].rec);
  });
  it('a pollen cloud stings and leaves sticky pollen', () => {
    const w = world(0, { ...flat, hazards: [{ kind: 'pollen', x: 600, w: 100, period: 3.8, on: 1.2, offset: 0 }] });
    w.hero.x = 600;
    const hp = w.hero.hp;
    for (let i = 0; i < 30; i++) w.step(NO_INPUT);
    expect(w.hero.hp).toBeLessThan(hp);
    expect(w.puddles.some(p => p.kind === 'slow')).toBe(true);
  });
});

describe('Sloba', () => {
  it('Vine Swing arcs up and lands, hitting on the way', () => {
    const w = world(12);
    const m = tank(w, 600);
    cast(w, 1);
    let air = false;
    for (let i = 0; i < 50; i++) { w.step(NO_INPUT); air ||= !w.hero.ground; }
    expect(air).toBe(true);
    expect(m.hp).toBeLessThan(1e6);
  });
  it('Power Nap heals, then wakes with a shockwave', () => {
    const w = world(12);
    w.hero.hp = w.hero.d.maxHp / 2;
    cast(w, 2);
    let shock = false;
    for (let i = 0; i < 100; i++) shock ||= w.step(NO_INPUT).some(e => e.t === 'shock');
    expect(w.hero.hp).toBeGreaterThan(w.hero.d.maxHp * 0.6);
    expect(shock).toBe(true);
  });
  it('Sloth Time slows monsters around her and speeds her up', () => {
    const w = world(12);
    const m = tank(w, 650);
    cast(w, 3);
    for (let i = 0; i < 20; i++) w.step(NO_INPUT);
    expect(m.slow).toBeGreaterThan(2);
    expect(w.hero.buff?.speed).toBeGreaterThan(0);
  });
});

describe('Minturtle', () => {
  it('Scoop Lob freezes what it lands on', () => {
    const w = world(16);
    const m = tank(w, 700);
    cast(w, 1);
    let frozen = false;
    for (let i = 0; i < 80 && !frozen; i++) { w.step(NO_INPUT); frozen = m.frozen > 0; }
    expect(frozen).toBe(true);
  });
  it('Waffle Wall stops monsters and their shots', () => {
    const w = world(16);
    cast(w, 2);
    const wall = w.walls[0];
    expect(wall).toBeTruthy();
    const m = w.spawnMob('bun', wall.x + 200, 5); m.hp = m.maxHp = 1e6;
    for (let i = 0; i < 60 * 3; i++) w.step(NO_INPUT);
    expect(m.x).toBeGreaterThan(wall.x);
  });
  it('Chip Storm rains chips on both sides', () => {
    const w = world(16);
    cast(w, 3);
    for (let i = 0; i < 5; i++) w.step(NO_INPUT);
    const xs = w.shots.filter(s => s.kind === 'chocchip').map(s => s.x - w.hero.x);
    expect(xs.some(x => x < 0) && xs.some(x => x > 0)).toBe(true);
  });
});

describe('the garden locals are complete', () => {
  it('skills, ultimate, gear with gear skills and two signature legendaries each', () => {
    for (const sp of [12, 16]) {
      expect(SKILLS[sp].actives.length).toBe(3);
      expect(ULTS[sp]).toBeTruthy();
      const gear = Object.entries(BASES).filter(([, b]) => b.for === sp);
      expect(gear.filter(([, b]) => b.slot === 'weapon').length).toBe(7); // 5 tiers + 2 extra weapon types
      for (const [k, b] of gear) if (b.slot === 'weapon') expect(GEAR[k], k).toBeTruthy();
      expect(Object.values(UNIQUES).filter(u => u.for === sp).length).toBe(2);
    }
  });
});
