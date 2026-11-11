// World 9 (The Supermarket, the Tupperwraith) and its locals Bloblin (3) and Salmonster (14).
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

describe('World 9: The Supermarket', () => {
  it('ten stages ending with the Tupperwraith; the level cap reaches it', () => {
    const w9 = STAGES.filter(s => s.world === 9);
    expect(w9.length).toBe(10);
    expect(w9[9].mobs[0].kind).toBe('tupper');
    expect(MAX_LEVEL).toBeGreaterThanOrEqual(w9[9].rec);
  });
  it('a freezer door blast pushes you back and leaves ice', () => {
    const w = world(0, { ...flat, hazards: [{ kind: 'chill', x: 600, w: 90, period: 3.6, on: 0.9, offset: 0 }] });
    w.hero.x = 620;
    for (let i = 0; i < 30; i++) w.step(NO_INPUT);
    expect(w.hero.x).toBeGreaterThan(640);
    expect(w.puddles.some(p => p.kind === 'slick')).toBe(true);
  });
});

describe('Bloblin', () => {
  it('Jiggle Splat bounces up and glues monsters where it lands', () => {
    const w = world(3);
    const m = tank(w, 560);
    cast(w, 1);
    for (let i = 0; i < 70; i++) w.step(NO_INPUT);
    expect(m.hp).toBeLessThan(1e6);
    expect(m.glued).toBeGreaterThan(0);
  });
  it('Jelly Clones bounce along the floor', () => {
    const w = world(3);
    cast(w, 2);
    let bounces = 0;
    for (let i = 0; i < 120; i++) bounces += w.step(NO_INPUT).filter(e => e.t === 'bounce').length;
    expect(bounces).toBeGreaterThanOrEqual(4);
  });
  it('Wobble Shield halves the hurt and reflects', () => {
    const w = world(3);
    cast(w, 3);
    expect(w.hero.buff?.def).toBeGreaterThan(0.3);
    expect(w.hero.buff?.reflect).toBe(true);
  });
});

describe('Salmonster', () => {
  it('Upstream Leap flies forward and up through monsters', () => {
    const w = world(14);
    const m = tank(w, 620);
    cast(w, 1);
    let air = false;
    for (let i = 0; i < 40; i++) { w.step(NO_INPUT); air ||= !w.hero.ground; }
    expect(air).toBe(true);
    expect(w.hero.x).toBeGreaterThan(700);
    expect(m.hp).toBeLessThan(1e6);
  });
  it('Tidal Push carries monsters along', () => {
    const w = world(14);
    const m = tank(w, 620);
    cast(w, 2);
    for (let i = 0; i < 40; i++) w.step(NO_INPUT);
    expect(m.x).toBeGreaterThan(700);
  });
  it('Salmon Swarm sends several salmon', () => {
    const w = world(14);
    cast(w, 3);
    for (let i = 0; i < 20; i++) w.step(NO_INPUT);
    expect(w.shots.filter(s => s.kind === 'salmon').length).toBeGreaterThanOrEqual(3);
  });
});

describe('the supermarket locals are complete', () => {
  it('skills, ultimate, gear with gear skills and two signature legendaries each', () => {
    for (const sp of [3, 14]) {
      expect(SKILLS[sp].actives.length).toBe(3);
      expect(ULTS[sp]).toBeTruthy();
      const gear = Object.entries(BASES).filter(([, b]) => b.for === sp);
      expect(gear.filter(([, b]) => b.slot === 'weapon').length).toBe(7); // 5 tiers + 2 extra weapon types
      for (const [k, b] of gear) if (b.slot === 'weapon') expect(GEAR[k], k).toBeTruthy();
      expect(Object.values(UNIQUES).filter(u => u.for === sp).length).toBe(2);
    }
  });
});
