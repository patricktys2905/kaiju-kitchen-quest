// Secret bonus stages (ids S-1..S-10) must not break anything that reads stage ids (the Market crashed after one).
import { describe, expect, it } from 'vitest';
import { BASES, rollItem } from '../src/sim/items';
import { BONUS_STAGES } from '../src/sim/stages';
import { beatAfter, beatBefore } from '../src/story/stories';

describe('secret bonus stages', () => {
  it('have no story scenes', () => {
    for (const b of BONUS_STAGES) { expect(beatBefore(b.id, false)).toEqual([]); expect(beatAfter(b.id)).toEqual([]); }
  });
  it('a broken item level still rolls real gear', () => {
    let s = 3; const rand = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    for (const lv of [NaN, 0, -5, Infinity]) for (let i = 0; i < 50; i++) {
      const it = rollItem(i, 3, lv, rand, [], 10);
      expect(BASES[it.base], `ilvl ${lv}`).toBeDefined();
      expect(Number.isFinite(it.ilvl)).toBe(true);
    }
  });
});
