// Learnable bosses: fixed attack strings, a tired window after each, armour to crack, three phases.
import { describe, expect, it } from 'vitest';
import { BOSS_PATTERNS, MOBS } from '../src/sim/mobs';
import { STAGES } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { NO_INPUT, type StageDef } from '../src/sim/types';
import { World } from '../src/sim/world';

const hero = (lv = 12) => { const p = newProfile(0); p.level = lv; return derive(p); };
const arena = (id: string): StageDef => ({ ...STAGES.find(s => s.id === id)!, hazards: [] });
/** the moves a boss starts, in order, while the hero stands still at a distance */
function moves(id: string, seed: number, n = 6): string[] {
  const w = new World(arena(id), hero(), seed);
  w.hero.hp = w.hero.d.maxHp = 1e8; w.hero.x = w.boss!.x - 120;
  const out: string[] = [];
  for (let i = 0; i < 60 * 60 && out.length < n; i++) for (const e of w.step(NO_INPUT)) if (e.t === 'mobAttack' && e.id === w.boss!.id) out.push(e.kind);
  return out;
}

describe('learnable bosses', () => {
  it('every world boss has close and far strings for three phases', () => {
    for (const w of ['toast', 'golem', 'dragon', 'jar'] as const) {
      const p = BOSS_PATTERNS[w]!;
      expect(p.length, w).toBe(3);
      for (const ph of p) { expect(ph.near.length).toBeGreaterThan(0); expect(ph.far.length).toBeGreaterThan(0); }
    }
  });
  it('a boss fights the same way every time (not random): you can learn it', () => {
    for (const id of ['1-10', '2-10', '3-10', '4-10']) expect(moves(id, 1), id).toEqual(moves(id, 999));
  });
  it('after each string it is tired for a moment and takes extra damage', () => {
    const w = new World(arena('1-10'), hero(), 3);
    w.hero.hp = w.hero.d.maxHp = 1e8; w.hero.x = w.boss!.x - 120;
    let tired = false;
    for (let i = 0; i < 60 * 30 && !tired; i++) tired = w.step(NO_INPUT).some(e => e.t === 'tired');
    expect(tired).toBe(true);
    expect(w.boss!.tired).toBeGreaterThan(0);
  });
  it('armour softens hits until it cracks (heavy hits crack it faster), then the boss is weak', () => {
    const crack = (heavy: boolean) => {
      const w = new World(arena('1-10'), hero(40), 3);
      w.hero.hp = w.hero.d.maxHp = 1e8;
      const b = w.boss!; b.x = 800; w.hero.x = 750; w.hero.face = 1; b.t = -999; b.hp = 1e8; // a punching bag (armour still sized from its real max HP)
      let swings = 0;
      for (let i = 0; i < 60 * 60 && b.armor > 0; i++) { const inp = { ...NO_INPUT, attack: i % 20 < 2, down: heavy }; if (inp.attack && i % 20 === 0) swings++; w.step(inp); w.hero.x = b.x - 50; }
      return { swings, weak: b.weak };
    };
    const plain = crack(false), gb = crack(true);
    expect(gb.weak).toBeGreaterThan(0);
    expect(gb.swings).toBeLessThan(plain.swings);
  });
  it('a final phase starts at a quarter HP', () => {
    const w = new World(arena('2-10'), hero(30), 3);
    const b = w.boss!; w.hero.x = b.x - 60; w.hero.face = 1; w.hero.hp = w.hero.d.maxHp = 1e8;
    b.hp = Math.round(b.maxHp * 0.26);
    let phase3 = false;
    for (let i = 0; i < 60 * 30 && !phase3; i++) { phase3 = w.step({ ...NO_INPUT, attack: i % 20 < 2 }).some(e => e.t === 'phase' && e.n === 3); w.hero.x = b.x - 60; }
    expect(phase3).toBe(true);
    expect(b.bossPhase).toBe(3);
  });
  it('nemeses go through their moves in order, then catch their breath', () => {
    const st = { ...STAGES.find(s => s.id === '4-5')!, mobs: [], hazards: [] };
    const w = new World(st, hero(45), 3);
    w.hero.hp = w.hero.d.maxHp = 1e8; w.hero.x = 600;
    const m = w.spawnMob('nbeet', 760, 45, undefined, true); m.phase = 4; m.hp = m.maxHp = 1e8;
    const seen: string[] = []; let tired = false;
    for (let i = 0; i < 60 * 40 && !tired; i++) for (const e of w.step(NO_INPUT)) { if (e.t === 'mobAttack' && e.id === m.id) seen.push(e.kind); if (e.t === 'tired') tired = true; }
    expect(tired).toBe(true);
    expect(new Set(seen).size).toBeGreaterThanOrEqual(2);
    expect(MOBS.nbeet.nem!.moves).toEqual(expect.arrayContaining(seen));
  });
});
