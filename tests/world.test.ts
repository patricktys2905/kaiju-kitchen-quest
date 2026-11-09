import { describe, expect, it } from 'vitest';
import { CLASSES } from '../src/sim/classes';
import { rollTier } from '../src/sim/loot';
import { STAGES } from '../src/sim/stages';
import { type Input, NO_INPUT, type StageDef } from '../src/sim/types';
import { DT, World } from '../src/sim/world';

const flat: StageDef = { id: 't', name: 't', width: 2000, groundY: 400, platforms: [{ x: 300, y: 300, w: 200 }], ladders: [{ x: 600, top: 300, bottom: 400 }], mobs: [], respawn: 0 };
const flatWithLadderPlat: StageDef = { ...flat, platforms: [{ x: 300, y: 300, w: 200 }, { x: 560, y: 300, w: 120 }] };

function run(w: World, inp: Partial<Input>, frames: number) {
  const evs = [];
  for (let i = 0; i < frames; i++) evs.push(...w.step({ ...NO_INPUT, ...inp }));
  return evs;
}
const tap = (w: World, k: keyof Input) => { run(w, { [k]: true }, 1); run(w, {}, 1); };

describe('hero movement', () => {
  it('runs, jumps onto a one-way platform and drops back through', () => {
    const w = new World(flat);
    w.hero.x = 250;
    run(w, { right: true }, 5);
    expect(w.hero.x).toBeGreaterThan(250);
    run(w, { right: true, jump: true }, 30);
    run(w, {}, 60);
    expect(w.hero.ground).toBe(true);
    expect(w.hero.y).toBe(300); // landed on the platform (jumped up through it)
    run(w, { down: true, jump: true }, 1);
    run(w, {}, 60);
    expect(w.hero.y).toBe(400);
  });

  it('climbs a ladder up onto a platform', () => {
    const w = new World(flatWithLadderPlat);
    w.hero.x = 600;
    run(w, { up: true }, 1);
    expect(w.hero.state).toBe('climb');
    run(w, { up: true }, 60);
    expect(w.hero.y).toBe(300);
    expect(w.hero.ground).toBe(true);
    expect(w.hero.state).toBe('move');
  });
});

describe('combat', () => {
  it('chains a 3-hit combo when attack is pressed in rhythm', () => {
    const w = new World(flat);
    const steps: number[] = [];
    for (let i = 0; i < 90; i++) {
      const evs = w.step({ ...NO_INPUT, attack: i % 10 === 0 });
      for (const e of evs) if (e.t === 'swing') steps.push(e.step);
    }
    expect(steps.slice(0, 3)).toEqual([0, 1, 2]);
  });

  it('kills a mob, gains xp and may drop a box that can be picked up', () => {
    let dropped = false;
    for (let seed = 1; seed < 40 && !dropped; seed++) {
      const w = new World(flat, 0, seed);
      const m = w.spawnMob('bun', 200);
      m.hp = 1;
      w.hero.x = 150;
      const evs = run(w, { attack: true }, 20);
      expect(evs.some(e => e.t === 'mobDie')).toBe(true);
      expect(w.hero.xp).toBeGreaterThan(0);
      if (evs.some(e => e.t === 'drop')) {
        dropped = true;
        const box = w.boxes[0];
        w.hero.x = box.x;
        run(w, {}, 60);
        expect(w.loot.length).toBe(1);
      }
    }
    expect(dropped).toBe(true);
  });

  it('every class can use its skill and it goes on cooldown', () => {
    for (const c of CLASSES) {
      const w = new World(flat, c.species);
      w.spawnMob('bun', w.hero.x + 60);
      const evs = run(w, { skill: true }, 1);
      const first = evs.some(e => e.t === "hit" && e.target === "mob");
      expect(evs.some(e => e.t === 'skill')).toBe(true);
      expect(w.hero.skillCd).toBeGreaterThan(0);
      const hit = first || run(w, {}, 60).some(e => e.t === "hit" && e.target === "mob");
      expect(hit, c.name).toBe(true);
    }
  });

  it('mobs bite the hero when standing still', () => {
    const w = new World(flat);
    w.spawnMob('bun', 220);
    w.hero.x = 150;
    run(w, {}, 180);
    expect(w.hero.hp).toBeLessThan(w.hero.maxHp);
  });
});

describe('loot', () => {
  it('higher drop level gives better boxes on average', () => {
    let s = 7;
    const rand = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const avg = (lvl: number) => { let t = 0; for (let i = 0; i < 4000; i++) t += rollTier(lvl, rand); return t / 4000; };
    expect(avg(4)).toBeGreaterThan(avg(1) + 0.3);
  });
});

describe('stages', () => {
  it('every ladder bottom is a floor and its top a platform', () => {
    for (const st of STAGES) for (const l of st.ladders) {
      expect(l.bottom).toBe(st.groundY);
      expect(st.platforms.some(p => p.y === l.top && l.x >= p.x && l.x <= p.x + p.w)).toBe(true);
    }
  });
});

void tap; void DT;
