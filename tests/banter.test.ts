// More story: a short scene before every stage for every kaiju, in-stage quips, monster taunts.
import { describe, expect, it } from 'vitest';
import { CLASSES } from '../src/sim/classes';
import { MOBS } from '../src/sim/mobs';
import type { MobKind } from '../src/sim/types';
import { TAUNTS } from '../src/story/banter';
import { QUIPS } from '../src/story/more';
import { STORIES, beatBefore } from '../src/story/stories';

const SPEAKERS = new Set<unknown>(['me', 'n', 'foe', 'mold', 'lo', 'lo2', ...CLASSES.map(c => c.species)]);

describe('story everywhere', () => {
  it('every kaiju has a short scene before stages 2-4 and 6-9 of every world (1-3 lines, sensible length, valid speakers)', () => {
    for (const c of CLASSES) for (const w of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) for (const n of [2, 3, 4, 6, 7, 8, 9]) {
      const key = `w${w}-s${n}`, lines = STORIES[c.species].beats[key];
      expect(lines, `${c.name} ${key}`).toBeDefined();
      expect(lines.length, `${c.name} ${key}`).toBeGreaterThanOrEqual(1);
      expect(lines.length, `${c.name} ${key}`).toBeLessThanOrEqual(3);
      for (const [who, text] of lines) {
        expect(SPEAKERS.has(who), `${c.name} ${key} speaker ${String(who)}`).toBe(true);
        expect(text.length, `${c.name} ${key}: ${text}`).toBeLessThanOrEqual(130);
        expect(text.trim().length).toBeGreaterThan(3);
      }
      expect(beatBefore(`${w}-${n}`, false)).toContain(key);
    }
  });
  it('every kaiju has 3 quips for every moment, short enough for a bubble', () => {
    for (const c of CLASSES) {
      const q = QUIPS[c.species];
      for (const kind of ['combo', 'lowhp', 'perfect', 'levelup', 'secret', 'boom', 'mimic', 'objective'] as const) {
        expect(q?.[kind]?.length, `${c.name} ${kind}`).toBeGreaterThanOrEqual(3);
        for (const line of q[kind]) expect(line.length, `${c.name}: ${line}`).toBeLessThanOrEqual(55);
      }
    }
  });
  it('every normal monster has a taunt', () => {
    for (const k of Object.keys(MOBS) as MobKind[]) {
      if (MOBS[k].brain === 'boss' || MOBS[k].brain === 'nemesis') continue;
      expect(TAUNTS[k]?.length, MOBS[k].name).toBeGreaterThan(0);
    }
  });
});
