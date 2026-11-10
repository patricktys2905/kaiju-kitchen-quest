// World 7 (The Backyard BBQ, Baron Brussels) and its locals Bubblegumbo (9) and Velvaroo (18).
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

describe('World 7: The Backyard BBQ', () => {
  it('ten stages ending with Baron Brussels; the level cap reaches it', () => {
    const w7 = STAGES.filter(s => s.world === 7);
    expect(w7.length).toBe(10);
    expect(w7[9].mobs[0].kind).toBe('brussels');
    expect(MAX_LEVEL).toBeGreaterThanOrEqual(w7[9].rec);
  });
  it('a sprinkler launches you and leaves a slippery puddle', () => {
    const w = world(0, { ...flat, hazards: [{ kind: 'sprinkler', x: 600, w: 80, period: 3.4, on: 0.7, offset: 0 }] });
    w.hero.x = 600;
    let flew = false;
    for (let i = 0; i < 30; i++) { w.step(NO_INPUT); flew ||= w.hero.vy < -300; }
    expect(flew).toBe(true);
    expect(w.puddles.some(p => p.kind === 'slick')).toBe(true);
  });
});

describe('Bubblegumbo', () => {
  it('Bubble Trap seals monsters (they stop moving), then they pop for damage', () => {
    const w = world(9);
    const m = tank(w, 640);
    cast(w, 1);
    for (let i = 0; i < 30; i++) w.step(NO_INPUT);
    expect(w.bubbles.some(b => b.id === m.id)).toBe(true);
    const x = m.x;
    for (let i = 0; i < 60; i++) w.step(NO_INPUT);
    expect(Math.abs(m.x - x)).toBeLessThan(5);
    for (let i = 0; i < 120; i++) w.step(NO_INPUT);
    expect(m.hp).toBeLessThan(1e6);
    expect(w.bubbles.length).toBe(0);
  });
  it('gumballs ricochet off monsters', () => {
    const w = world(9);
    tank(w, 640);
    cast(w, 2);
    let bounces = 0;
    for (let i = 0; i < 90; i++) bounces += w.step(NO_INPUT).filter(e => e.t === 'bounce').length;
    expect(bounces).toBeGreaterThanOrEqual(2);
  });
  it('Trumpet Blast launches monsters on both sides', () => {
    const w = world(9);
    const a = tank(w, 400), b = tank(w, 600);
    cast(w, 3);
    let up = 0;
    for (let i = 0; i < 40; i++) { w.step(NO_INPUT); up = Math.max(up, [a, b].filter(m => m.vy < -200).length); }
    expect(up).toBe(2);
  });
});

describe('Velvaroo', () => {
  it('Triple Hop makes three landings with shockwaves', () => {
    const w = world(18);
    cast(w, 1);
    let shocks = 0;
    for (let i = 0; i < 90; i++) shocks += w.step(NO_INPUT).filter(e => e.t === 'shock').length;
    expect(shocks).toBe(3);
  });
  it('One-Two Flurry lands several punches', () => {
    const w = world(18);
    const m = tank(w, 560);
    cast(w, 2);
    let hits = 0;
    for (let i = 0; i < 50; i++) hits += w.step(NO_INPUT).filter(e => e.t === 'hit' && e.target === 'mob').length;
    expect(hits).toBeGreaterThanOrEqual(5);
    void m;
  });
  it('Cupcake Bomb bursts into a slowing patch', () => {
    const w = world(18);
    cast(w, 3);
    for (let i = 0; i < 70; i++) w.step(NO_INPUT);
    expect(w.zones.some(z => z.kind === 'ice')).toBe(true);
  });
});

describe('the backyard locals are complete', () => {
  it('skills, ultimate, gear with gear skills and two signature legendaries each', () => {
    for (const sp of [9, 18]) {
      expect(SKILLS[sp].actives.length).toBe(3);
      expect(ULTS[sp]).toBeTruthy();
      const gear = Object.entries(BASES).filter(([, b]) => b.for === sp);
      expect(gear.filter(([, b]) => b.slot === 'weapon').length).toBe(5); // 3 tiers + 2 extra weapon types
      for (const [k, b] of gear) if (b.slot === 'weapon') expect(GEAR[k], k).toBeTruthy();
      expect(Object.values(UNIQUES).filter(u => u.for === sp).length).toBe(2);
    }
  });
});
