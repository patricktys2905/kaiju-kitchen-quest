// Skill + challenge mechanics: perfect dodge, interrupts, red attacks, guard break, launcher, style,
// new monster brains, elite modifiers, boss phase 2, hazards, Spicy challenges.
import { describe, expect, it } from 'vitest';
import { MOBS } from '../src/sim/mobs';
import { skillsOf } from '../src/sim/skills';
import { STAGES, WORLDS } from '../src/sim/stages';
import { type HeroProfile, derive, newProfile } from '../src/sim/stats';
import { type Input, type MobKind, NO_INPUT, type Spicy, type StageDef } from '../src/sim/types';
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
const mk = (st: StageDef = flat, spicy: Spicy[] = [], hard = false, level = 10) => new World(st, derive(prof(0, level)), 1, [{ id: 'jam', n: 2 }, null, null, null], 0, hard, undefined, spicy);
function run(w: World, inp: Partial<Input>, frames: number) {
  const evs = [];
  for (let i = 0; i < frames; i++) evs.push(...w.step({ ...NO_INPUT, ...inp }));
  return evs;
}
/** press a button for one frame, then release it */
const tap = (w: World, inp: Partial<Input>) => [...run(w, inp, 1), ...run(w, {}, 1)];
const spawn = (w: World, kind: MobKind, x: number, elite = false) => { const m = w.spawnMob(kind, x, 3, undefined, elite); m.face = -1; return m; };

describe('skill: perfect dodge', () => {
  it('a hit early in a dodge roll is a PERFECT dodge: no damage, slow motion, guaranteed crit counter', () => {
    const w = mk(); const h = w.hero; h.x = 500;
    const m = spawn(w, 'bun', 530);
    m.state = 'attack'; m.move = 'walker'; m.t = 0; m.hitDone = false;
    h.state = 'dodge'; h.t = 0.02; h.perfectDone = false;
    const hp = h.hp;
    const evs = run(w, {}, 2);
    expect(evs.some(e => e.t === 'perfect')).toBe(true);
    expect(h.hp).toBe(hp);
    expect(w.slowmo).toBeGreaterThan(0);
    expect(h.counter).toBeGreaterThan(0);
    expect(w.run.perfects).toBe(1);
  });
  it('a hit late in the roll is just dodged (no perfect)', () => {
    const w = mk(); const h = w.hero; h.x = 500;
    const m = spawn(w, 'bun', 530);
    m.state = 'attack'; m.move = 'walker'; m.t = 0;
    h.state = 'dodge'; h.t = 0.25; h.inv = 0.2; h.perfectDone = false;
    const evs = run(w, {}, 2);
    expect(evs.some(e => e.t === 'perfect')).toBe(false);
  });
});

describe('skill: interrupts and red attacks', () => {
  it('hitting a monster during its wind-up cancels the attack', () => {
    const w = mk(); w.hero.x = 500;
    const m = spawn(w, 'bun', 545);
    m.state = 'windup'; m.move = 'walker'; m.t = 0;
    const evs = [...tap(w, { attack: true }), ...run(w, {}, 12)];
    expect(evs.some(e => e.t === 'interrupt')).toBe(true);
    expect(['hurt', 'walk']).toContain(m.state as string);
    expect(w.run.interrupts).toBe(1);
  });
  it('an elite brute slam glows red (danger) and cannot be interrupted', () => {
    const w = mk(); w.hero.x = 500;
    const m = spawn(w, 'egg', 550, true);
    m.state = 'windup'; m.move = 'brute'; m.t = 0;
    expect(w.isDanger(m)).toBe(true);
    const evs = [...tap(w, { attack: true }), ...run(w, {}, 10)];
    expect(evs.some(e => e.t === 'interrupt')).toBe(false);
    expect(evs.some(e => e.t === 'hit' && e.target === 'mob')).toBe(true);
  });
  it('boss charges and leaps are red; a normal walker bite is not', () => {
    const w = mk();
    const b = spawn(w, 'toast', 900); b.state = 'windup'; b.move = 'charge';
    const n = spawn(w, 'bun', 700); n.state = 'windup'; n.move = 'walker';
    expect(w.isDanger(b)).toBe(true);
    expect(w.isDanger(n)).toBe(false);
  });
});

describe('skill: combo routes', () => {
  it('DOWN+attack is a Guard Break that gets through a shield; a plain hit is blocked', () => {
    const plain = mk(); plain.hero.x = 500;
    const a = spawn(plain, 'can', 550); a.face = -1;
    const e1 = [...tap(plain, { attack: true }), ...run(plain, {}, 15)];
    expect(e1.some(e => e.t === 'block')).toBe(true);
    const gb = mk(); gb.hero.x = 500;
    const b = spawn(gb, 'can', 550); b.face = -1;
    const e2 = [...tap(gb, { attack: true, down: true }), ...run(gb, {}, 30)];
    expect(e2.some(e => e.t === 'guardBreak')).toBe(true);
    expect(e2.some(e => e.t === 'block')).toBe(false);
  });
  it('UP+attack launches a monster into the air', () => {
    const w = mk(); w.hero.x = 500;
    const m = spawn(w, 'bun', 540);
    tap(w, { attack: true, up: true });
    let minY = m.y;
    for (let i = 0; i < 30; i++) { w.step(NO_INPUT); minY = Math.min(minY, m.y); }
    expect(400 - minY).toBeGreaterThan(80);
  });
  it('you can dodge-cancel out of an attack once it starts hitting', () => {
    const w = mk(); w.hero.x = 500;
    tap(w, { attack: true });
    run(w, {}, 8); // into the hit window
    expect(w.hero.state).toBe('attack');
    tap(w, { right: true }); tap(w, { right: true });
    expect(w.hero.state).toBe('dodge');
  });
  it('varied moves raise the style meter, getting hit halves it', () => {
    const w = mk(); w.hero.x = 500;
    for (let i = 0; i < 6; i++) spawn(w, 'bun', 540 + i * 4);
    tap(w, { attack: true }); run(w, {}, 20);
    tap(w, { attack: true, up: true }); run(w, {}, 20);
    expect(w.style).toBeGreaterThan(5);
    const before = w.style;
    const m = spawn(w, 'bun', w.hero.x + 20); m.state = 'attack'; m.move = 'walker'; m.t = 0; w.hero.inv = 0; w.hero.state = 'move';
    run(w, {}, 2);
    expect(w.style).toBeLessThan(before);
  });
});

describe('new monsters', () => {
  it('a mimic sits disguised as a loot box until you come close', () => {
    const w = mk(); w.hero.x = 300;
    const m = spawn(w, 'mimic', 700);
    run(w, {}, 30);
    expect(m.disguised).toBe(true);
    w.hero.x = 640;
    const evs = run(w, {}, 3);
    expect(evs.some(e => e.t === 'mimic')).toBe(true);
    expect(m.disguised).toBe(false);
  });
  it('a burrower is untouchable underground, then pops up under you', () => {
    const w = mk(); w.hero.x = 500;
    const m = spawn(w, 'ant', 520);
    expect(m.under).toBe(true);
    const hp = m.hp;
    let popped = false;
    for (let i = 0; i < 200 && !popped; i++) popped = w.step(NO_INPUT).some(e => e.t === 'burrow' && e.up);
    expect(popped).toBe(true);
    expect(m.under).toBe(false);
    expect(m.hp).toBe(hp);
  });
  it('a charger that misses is left dizzy', () => {
    const w = mk(); w.hero.x = 500;
    const m = spawn(w, 'milk', 900);
    m.state = 'attack'; m.move = 'rush'; m.t = 0; m.face = 1; m.vx = 540; // running away from the hero: a miss
    run(w, {}, 80);
    expect(['stagger', 'walk', 'windup']).toContain(m.state);
    expect(m.hitDone).toBe(false);
  });
  it('a healer mends hurt allies; a summoner calls little ones', () => {
    const w = mk(); w.hero.x = 200;
    const healer = spawn(w, 'garlic', 600);
    const hurt = spawn(w, 'bun', 650); hurt.hp = Math.round(hurt.maxHp * 0.4);
    healer.state = 'windup'; healer.move = 'heal'; healer.t = 5;
    run(w, {}, 2);
    expect(hurt.hp).toBeGreaterThan(Math.round(hurt.maxHp * 0.4));
    const s = spawn(w, 'jelly', 800); s.state = 'windup'; s.move = 'call'; s.t = 5;
    run(w, {}, 2);
    expect(w.mobs.filter(o => o.parent === s.id).length).toBe(2);
  });
  it('a sniper fires along its locked laser line', () => {
    const w = mk(); w.hero.x = 300;
    const m = spawn(w, 'carrot', 700);
    m.state = 'windup'; m.move = 'snipe'; m.t = 0; m.aimX = 300; m.aimY = 360;
    run(w, {}, 80);
    expect(w.shots.some(s => s.kind === 'laser') || w.hero.hp < w.hero.d.maxHp).toBe(true);
  });
  it('every world has 3 new monsters in its pool, a mimic in stages 3/7/9 and hazards from stage 2', () => {
    const fresh: MobKind[] = ['garlic', 'ant', 'carrot', 'milk', 'jelly', 'kettle', 'sausage', 'marsh', 'noodle', 'raisin'];
    for (const k of fresh) expect(STAGES.some(s => s.mobs.some(m => m.kind === k)), k).toBe(true);
    for (const w of WORLDS) {
      for (const n of [3, 7, 9]) expect(STAGES.find(s => s.id === `${w.id}-${n}`)!.mobs.some(m => MOBS[m.kind].brain === 'mimic'), `${w.id}-${n}`).toBe(true);
      expect(STAGES.find(s => s.id === `${w.id}-1`)!.hazards ?? []).toEqual([]);
      for (let n = 2; n <= 9; n++) expect((STAGES.find(s => s.id === `${w.id}-${n}`)!.hazards ?? []).length).toBeGreaterThan(0);
      expect(STAGES.find(s => s.id === `${w.id}-10`)!.hazards!.every(h => h.phase2)).toBe(true);
    }
  });
});

describe('challenge', () => {
  it('elites get one modifier (two in Hard), bosses never change', () => {
    const w = mk(); spawn(w, 'egg', 600, true);
    const n = new World({ ...flat, mobs: [{ kind: 'egg', x: 600, lv: 3, elite: true }, { kind: 'toast', x: 900, lv: 3 }] }, derive(prof(0)), 3);
    expect(n.mobs[0].mods.length).toBe(1);
    expect(n.mobs[1].mods).toEqual([]);
    const h = new World({ ...flat, mobs: [{ kind: 'egg', x: 600, lv: 3, elite: true }] }, derive(prof(0)), 3, [], 0, true);
    expect(h.mobs[0].mods.length).toBe(2);
    expect(n.mobName(n.mobs[0])).toMatch(/ Rotten Egg$/);
  });
  it('a boss enrages at half HP and switches on its arena hazards', () => {
    const boss = STAGES.find(s => s.id === '1-10')!;
    const w = new World(boss, derive(prof(0, 12)), 2);
    const b = w.boss!;
    b.hp = Math.round(b.maxHp * 0.52);
    w.hero.x = b.x - 60; w.hero.face = 1;
    let evs = run(w, {}, 1);
    expect(w.hazards.every(z => z.state === 'off')).toBe(true);
    for (let i = 0; i < 40 && !b.enraged; i++) evs = [...evs, ...tap(w, { attack: true }), ...run(w, {}, 10)];
    expect(b.enraged).toBe(true);
    expect(evs.some(e => e.t === 'enrage')).toBe(true);
    run(w, {}, 300);
    expect(w.hazards.some(z => z.state !== 'off')).toBe(true);
  });
  it('a burner hurts you for a fixed share of your HP when it flares', () => {
    const st: StageDef = { ...flat, hazards: [{ kind: 'burner', x: 500, w: 90, period: 3.6, on: 1.2, offset: 0 }] };
    const w = mk(st); w.hero.x = 500;
    run(w, {}, 2);
    expect(w.hero.hp).toBe(w.hero.d.maxHp - Math.round(w.hero.d.maxHp * 0.12));
  });
  it('ice makes you slide', () => {
    const st: StageDef = { ...flat, hazards: [{ kind: 'ice', x: 600, w: 400, period: 1, on: 1, offset: 0 }] };
    const ice = mk(st), dry = mk();
    for (const w of [ice, dry]) { w.hero.x = 600; run(w, { right: true }, 30); run(w, {}, 6); }
    expect(ice.hero.vx).toBeGreaterThan(dry.hero.vx + 50);
  });
  it('Spicy: glass jaw doubles damage, no-potions locks the bag, the clock ends the stage at par', () => {
    const hits = (sp: Spicy[]) => { const w = mk(flat, sp); w.hero.x = 500; const m = spawn(w, 'bun', 530); m.state = 'attack'; m.move = 'walker'; m.t = 0; run(w, {}, 2); return w.hero.d.maxHp - w.hero.hp; };
    expect(hits(['glass'])).toBeGreaterThan(hits([]) * 1.6);
    const np = mk(flat, ['nopots']); np.hero.hp = 10;
    expect(np.useItem(0)).toBe(false);
    const cl = mk({ ...flat, par: 1 }, ['clock']); spawn(cl, 'bun', 1500);
    run(cl, {}, 61 + 60 * 2);
    expect(cl.hero.state).toBe('down');
  });
});
