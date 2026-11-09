// Every kaiju's skills are its own: no two kaiju share a skill mechanic, an ultimate or a passive.
import { describe, expect, it } from 'vitest';
import { SKILLS, ULTS, skillsOf } from '../src/sim/skills';
import { derive, newProfile, type HeroProfile } from '../src/sim/stats';
import { type Input, NO_INPUT, type StageDef } from '../src/sim/types';
import { World } from '../src/sim/world';

const flat: StageDef = {
  id: 't', world: 1, num: 't', name: 't', bg: 'bg-far', mid: '', tile: 'tile-ground', platTint: 0xffffff, width: 2000, groundY: 400, lv: [1, 1], par: 60, rec: 1,
  platforms: [], ladders: [], mobs: [],
};
function prof(species: number, level = 10): HeroProfile {
  const p = newProfile(species); p.level = level;
  for (const s of [...skillsOf(species).actives, skillsOf(species).passive]) if (level >= s.unlock) p.skills[s.id] = 1;
  return p;
}
const run = (w: World, inp: Partial<Input>, n: number) => { const evs = []; for (let i = 0; i < n; i++) evs.push(...w.step({ ...NO_INPUT, ...inp })); return evs; };
/** cast the skill with this id */
function cast(species: number, id: string, setup?: (w: World) => void): World {
  const w = new World(flat, derive(prof(species)), 1);
  w.hero.x = 500; w.hero.face = 1;
  setup?.(w);
  const i = skillsOf(species).actives.findIndex(s => s.id === id);
  run(w, { [(['skill1', 'skill2', 'skill3'] as const)[i]]: true }, 1);
  return w;
}
const buffSig = (b: object | undefined) => JSON.stringify(Object.keys(b ?? {}).filter(k => k !== 't').sort());

describe('no copycat skills', () => {
  it('no two active skills share a mechanic (buffs must boost different things)', () => {
    const seen = new Map<string, string>();
    for (const [sp, s] of Object.entries(SKILLS)) for (const a of s.actives) {
      const key = a.kind === 'buff' ? `buff:${buffSig(a.buff)}` : a.kind === 'mines' ? `mines:${!!a.toss}` : a.kind;
      expect(seen.get(key), `${a.name} (kaiju ${sp}) copies ${seen.get(key)}`).toBeUndefined();
      seen.set(key, a.name);
    }
  });
  it('every ultimate is different', () => {
    const kinds = Object.values(ULTS).map(u => u.kind);
    expect(new Set(kinds).size).toBe(kinds.length);
  });
  it('every passive boosts something different', () => {
    const sigs = Object.values(SKILLS).map(s => JSON.stringify(Object.keys(s.passive.per).sort()));
    expect(new Set(sigs).size).toBe(sigs.length);
  });
  it('skill names are unique', () => {
    const names = [...Object.values(SKILLS).flatMap(s => [...s.actives, s.passive].map(a => a.name)), ...Object.values(ULTS).map(u => u.name)];
    expect(new Set(names).size).toBe(names.length);
  });
});

describe('new skill mechanics', () => {
  it('Tentacle Grab yanks monsters in', () => {
    let far = 0;
    const w = cast(1, 'whirl', w => { far = w.spawnMob('bun', 760, 1).id; });
    run(w, {}, 2);
    expect(Math.abs(w.mobs.find(m => m.id === far)!.x - 500)).toBeLessThan(80);
  });
  it('Claw Counter blocks a hit and strikes back', () => {
    const w = cast(2, 'snap');
    const m = w.spawnMob('bun', 530, 1); m.face = -1; m.state = 'attack'; m.move = 'walker'; m.t = 0;
    const hp = w.hero.hp;
    const evs = run(w, {}, 3);
    expect(w.hero.hp).toBe(hp);
    expect(evs.some(e => e.t === 'block')).toBe(true);
    expect(m.hp).toBeLessThan(m.maxHp);
  });
  it('Shadow Toast reappears behind the nearest monster with a crit', () => {
    let id = 0;
    const w = cast(5, 'butter', w => { const m = w.spawnMob('bun', 700, 1); m.face = -1; id = m.id; });
    const m = w.mobs.find(x => x.id === id)!;
    expect(w.hero.x).toBeGreaterThan(m.x); // behind it (it faces left)
  });
  it('Deep Freeze freezes monsters solid', () => {
    let id = 0;
    const w = cast(17, 'freeze', w => { id = w.spawnMob('bun', 580, 1).id; });
    run(w, {}, 30);
    expect(w.mobs.find(m => m.id === id)!.frozen).toBeGreaterThan(1.5);
  });
  it('Pizza Cutter Toss comes back', () => {
    const w = cast(11, 'pspin');
    const s = w.shots.find(x => x.kind === 'boomerang')!;
    let maxX = 0;
    for (let i = 0; i < 90 && w.shots.includes(s); i++) { w.step(NO_INPUT); maxX = Math.max(maxX, s.x); }
    expect(maxX).toBeGreaterThan(650);
    expect(w.shots.includes(s)).toBe(false); // caught again
  });
  it('Rice Ball Ring circles and bonks', () => {
    const w = cast(7, 'roll');
    const m = w.spawnMob('bun', 560, 1);
    run(w, {}, 60);
    expect(w.hero.orbs).not.toBeNull();
    expect(m.hp).toBeLessThan(m.maxHp);
  });
  it('Soup Slurp heals Dumplord for part of the damage', () => {
    const w = cast(6, 'soup', w => { w.hero.hp = 50; for (let i = 0; i < 4; i++) w.spawnMob('bun', 520 + i * 30, 1); });
    run(w, {}, 40);
    expect(w.hero.hp).toBeGreaterThan(50);
  });
  it('Choco Suplex throws the monster behind', () => {
    let id = 0;
    const w = cast(8, 'chocoslam', w => { id = w.spawnMob('bun', 560, 1).id; });
    expect(w.mobs.find(m => m.id === id)!.x).toBeLessThan(500);
  });
  it('Wasabi Breath leaves monsters burning', () => {
    let id = 0;
    const w = cast(7, 'wasabi', w => { id = w.spawnMob('egg', 600, 1).id; });
    run(w, {}, 20);
    expect(w.mobs.find(m => m.id === id)!.burn).toBeGreaterThan(0);
  });
  it('Leaf Shell bounces shots back', () => {
    const w = new World(flat, derive(prof(2)), 1);
    w.hero.x = 500;
    w.hero.buff = { atk: 0, def: 0.35, speed: 0, armor: true, reflect: true, t: 5 };
    w.shots.push({ id: 999, x: 540, y: 360, vx: -300, vy: 0, t: 0, dmg: 10, hit: new Set(), from: 'mob', kx: 0, ky: 0, pierce: false, g: 0 });
    run(w, {}, 6);
    expect(w.shots.find(s => s.id === 999)?.from).toBe('hero');
  });
});
