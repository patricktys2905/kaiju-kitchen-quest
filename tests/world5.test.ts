// World 5, The Sink: the Act 1 finale (faucets, the Mold Crown, the endings, credits and the Leftovers tease).
import { describe, expect, it } from 'vitest';
import { CLASSES } from '../src/sim/classes';
import { MOBS } from '../src/sim/mobs';
import { STAGES, stageById } from '../src/sim/stages';
import { derive, newProfile } from '../src/sim/stats';
import { NO_INPUT, type StageDef } from '../src/sim/types';
import { World } from '../src/sim/world';
import { STORIES, beatAfter, stillFor } from '../src/story/stories';

const hero = (lv = 55) => { const p = newProfile(0); p.level = lv; return derive(p); };
const flat: StageDef = { id: 't', world: 5, num: 't', name: 't', bg: 'bg-far', mid: '', tile: 'tile-ground', platTint: 0xffffff, width: 2400, groundY: 400, lv: [50, 50], par: 60, rec: 50, platforms: [], ladders: [], mobs: [] };

describe('World 5: The Sink', () => {
  it('ten stages ending with the Mold Crown', () => {
    const w5 = STAGES.filter(s => s.world === 5);
    expect(w5.length).toBe(10);
    expect(w5[9].boss).toBe(true);
    expect(w5[9].mobs[0].kind).toBe('moldking');
    expect(w5.some(s => (s.hazards ?? []).some(h => h.kind === 'tap'))).toBe(true);
  });
  it('a faucet pours on you: it hurts and washes you sideways', () => {
    const w = new World({ ...flat, hazards: [{ kind: 'tap', x: 600, w: 70, period: 3.4, on: 1.1, offset: 0 }] }, hero(), 1);
    w.hero.x = 610;
    const hp = w.hero.hp;
    for (let i = 0; i < 30; i++) w.step(NO_INPUT);
    expect(w.hero.hp).toBeLessThan(hp);
    expect(Math.abs(w.hero.x - 610)).toBeGreaterThan(20);
  });
  it('the Mold Crown calls Sporelings, but never more than four at a time', () => {
    const w = new World(flat, hero(), 1);
    w.hero.hp = w.hero.d.maxHp = 1e8; w.hero.x = 200;
    const boss = w.spawnMob('moldking', 900, 55); boss.hp = boss.maxHp = 1e8;
    let most = 0;
    for (let i = 0; i < 60 * 60; i++) { w.step(NO_INPUT); most = Math.max(most, w.mobs.filter(m => m.kind === 'sporeling' && m.state !== 'dead').length); }
    expect(most).toBeGreaterThan(0);
    expect(most).toBeLessThanOrEqual(4);
    expect(MOBS.sporeling.brain).not.toBe('boss');
  });
  it('after the final boss: the ending, the credits, then the Leftovers tease', () => {
    expect(beatAfter('5-10')).toEqual(['w5-after', 'credits', 'w5-hook']);
    for (const c of CLASSES) {
      const end = STORIES[c.species].beats['w5-after'];
      expect(end.length, c.name).toBeGreaterThanOrEqual(5);
      const stills = end.map((_, i) => stillFor(c.species, 'w5-after', i));
      expect(stills[0], c.name).toBe('still-w5-cure');
      expect(stills[stills.length - 1], c.name).toBe(`still-${c.species}-end`);
      expect(STORIES[c.species].beats['w5-hook'].some(([who]) => who === 'lo'), c.name).toBe(true);
      expect(stillFor(c.species, 'w5-hook', 0)).toBe('still-w5-hook');
      for (const b of ['w5-open', 'w5-boss', 'w5-elite']) expect(STORIES[c.species].beats[b]?.length, `${c.name} ${b}`).toBeGreaterThan(0);
    }
  });
  it('failing an objective ends the stage straight away (it used to leave you stuck on the ground)', () => {
    const st = stageById('5-6');
    const w = new World(st, hero(), 1);
    w.objArmed = true; w.objTimer = 0.05; // (on a long stage the race starts near the end: start it now)
    let down = false;
    for (let i = 0; i < 30 && !w.failed; i++) down ||= w.step(NO_INPUT).some(e => e.t === 'down');
    expect(w.failed).toBe(true);
    expect(down).toBe(true);
  });
});
