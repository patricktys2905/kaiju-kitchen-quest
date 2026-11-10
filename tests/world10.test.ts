// World 10, the Act 2 finale: Old Fruitcake, the ending, the Act 2 credits and the teaser.
import { describe, expect, it } from 'vitest';
import { CLASSES } from '../src/sim/classes';
import { STAGES, BONUS_STAGES } from '../src/sim/stages';
import { MAX_LEVEL } from '../src/sim/stats';
import { STORIES, beatAfter, beatBefore, isMinorBeat, stillFor } from '../src/story/stories';

describe('World 10: The Feast of the Forgotten', () => {
  it('ten stages ending with Old Fruitcake; the level cap reaches him', () => {
    const w10 = STAGES.filter(s => s.world === 10);
    expect(w10.length).toBe(10);
    expect(w10[9].mobs[0].kind).toBe('fruitcake');
    expect(MAX_LEVEL).toBeGreaterThanOrEqual(w10[9].rec);
  });
  it('two-digit worlds work everywhere: beats, minor scenes, stills, the bonus stage name', () => {
    expect(beatBefore('10-1', false)).toContain('w10-open');
    expect(beatBefore('10-3', false)).toContain('w10-s3');
    expect(isMinorBeat('w10-s3')).toBe(true);
    expect(stillFor(0, 'w10-open', 0)).toBe('still-w10-open');
    expect(BONUS_STAGES.every(s => !s.name.includes('undefined'))).toBe(true);
  });
  it('after the final boss: the ending, the Act 2 credits, then the teaser', () => {
    expect(beatAfter('10-10')).toEqual(['w10-after', 'credits2', 'w10-hook']);
    for (const c of CLASSES) {
      const end = STORIES[c.species].beats['w10-after'];
      expect(end?.length, c.name).toBeGreaterThanOrEqual(5);
      // Old Fruitcake speaks first (beaten), then the feast painting with the kaiju's resolution
      const stills = end.map((_, i) => stillFor(c.species, 'w10-after', i));
      expect(stills[0], c.name).toBe('still-w10-cure');
      expect(stills[stills.length - 1], c.name).toBe('still-w10-end');
      const lastBoss = end.map(([w]) => w).lastIndexOf('boss');
      expect(end.slice(0, lastBoss).some(([w]) => w === 'me') ? 'me before boss ends' : 'ok', c.name).toBe('ok');
      for (const b of ['w10-open', 'w10-boss', 'w10-elite']) expect(STORIES[c.species].beats[b]?.length, `${c.name} ${b}`).toBeGreaterThan(0);
      expect(stillFor(c.species, 'w10-hook', 0)).toBe('still-w10-hook');
    }
  });
});
