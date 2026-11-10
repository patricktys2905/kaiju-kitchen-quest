// Avocadrake (13) and Tacowl (19): their one-of-a-kind skills do what they say.
import { describe, expect, it } from 'vitest';
import { CLASSES } from '../src/sim/classes';
import { GEAR } from '../src/sim/gear';
import { BASES, UNIQUES } from '../src/sim/items';
import { SKILLS, ULTS } from '../src/sim/skills';
import { derive, newProfile } from '../src/sim/stats';
import { NO_INPUT, type StageDef } from '../src/sim/types';
import { World } from '../src/sim/world';

const flat: StageDef = { id: 't', world: 1, num: 't', name: 't', bg: 'bg-far', mid: '', tile: 'tile-ground', platTint: 0xffffff, width: 2400, groundY: 470, lv: [5, 5], par: 60, rec: 5, platforms: [], ladders: [], mobs: [] };
function world(sp: number) {
  const p = newProfile(sp); p.level = 20;
  for (const a of SKILLS[sp].actives) p.skills[a.id] = 1;
  const w = new World(flat, derive(p), 3);
  w.hero.x = 500; w.hero.face = 1;
  return w;
}
const cast = (w: World, slot: 1 | 2 | 3) => w.step({ ...NO_INPUT, [`skill${slot}`]: true });
const tank = (w: World, x: number, kind: 'egg' | 'bun' = 'egg') => { const m = w.spawnMob(kind, x, 5); m.hp = m.maxHp = 1e6; return m; };

describe('Avocadrake', () => {
  it('Pit Hurl bounces along the ground, hitting again at each bounce', () => {
    const w = world(13);
    const m = tank(w, 760);
    cast(w, 1);
    let bounces = 0;
    for (let i = 0; i < 120; i++) bounces += w.step(NO_INPUT).filter(e => e.t === 'bounce').length;
    expect(bounces).toBeGreaterThanOrEqual(2);
    expect(m.hp).toBeLessThan(1e6);
  });
  it('Guac Pool slows monsters in it and heals the hero standing in it', () => {
    const w = world(13);
    w.hero.hp = w.hero.d.maxHp / 2;
    const m = tank(w, 600, 'bun');
    cast(w, 2);
    w.hero.x = 600; // step into the pool
    for (let i = 0; i < 90; i++) w.step(NO_INPUT);
    expect(w.hero.hp).toBeGreaterThan(w.hero.d.maxHp / 2);
    expect(m.slow).toBeGreaterThan(0);
  });
  it('Wing Gust throws monsters far back', () => {
    const w = world(13);
    const m = tank(w, 600, 'bun');
    cast(w, 3);
    for (let i = 0; i < 40; i++) w.step(NO_INPUT);
    expect(m.x).toBeGreaterThan(700);
  });
});

describe('Tacowl', () => {
  it('Salsa Bombs burst and set monsters burning', () => {
    const w = world(19);
    const m = tank(w, 560, 'bun');
    cast(w, 1);
    let burned = false;
    for (let i = 0; i < 90 && !burned; i++) { w.step(NO_INPUT); burned = m.burn > 0; }
    expect(burned).toBe(true);
  });
  it('Night Screech stuns everything in front', () => {
    const w = world(19);
    const a = tank(w, 600, 'bun'), b = tank(w, 680, 'bun');
    cast(w, 2);
    let stunned = 0;
    for (let i = 0; i < 40; i++) { w.step(NO_INPUT); stunned = Math.max(stunned, [a, b].filter(m => m.state === 'hurt' || m.state === 'stagger').length); }
    expect(stunned).toBe(2);
  });
  it('Chip Volley sprays several chips', () => {
    const w = world(19);
    cast(w, 3);
    for (let i = 0; i < 12; i++) w.step(NO_INPUT);
    expect(w.shots.filter(s => s.kind === 'chip').length).toBeGreaterThanOrEqual(5);
  });
});

describe('the newcomers are complete', () => {
  it('stats, skills, ultimate, gear with gear skills and two signature legendaries each', () => {
    for (const sp of [13, 19]) {
      expect(CLASSES.some(c => c.species === sp)).toBe(true);
      expect(SKILLS[sp].actives.length).toBe(3);
      expect(ULTS[sp]).toBeTruthy();
      const gear = Object.entries(BASES).filter(([, b]) => b.for === sp);
      expect(gear.filter(([, b]) => b.slot === 'weapon').length).toBe(5); // 3 tiers + 2 extra weapon types
      expect(gear.filter(([, b]) => b.slot === 'armor').length).toBe(3);
      for (const [k, b] of gear) if (b.slot === 'weapon') expect(GEAR[k], k).toBeTruthy();
      expect(Object.values(UNIQUES).filter(u => u.for === sp).length).toBe(2);
    }
  });
});
