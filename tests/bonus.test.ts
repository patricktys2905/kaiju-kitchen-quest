// Secret bonus stages (ids S-1..S-10) must not break anything that reads stage ids (the Market crashed after one).
import { describe, expect, it, vi } from 'vitest';
import { BASES, rollItem } from '../src/sim/items';
import { BONUS_STAGES, STAGES, WORLDS } from '../src/sim/stages';
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

// The Market's item level (shop gear, bought boxes) follows the furthest stage cleared. It used to count 12 levels a world
// from the stage id: right for Worlds 1-6, but Worlds 7+ are 10 levels apart, so it ran ahead (item level 131 for a Lv 120
// kaiju after 11-10). Now it reads the stage data.
describe('Market item level (progressLv)', () => {
  const fresh = async () => { vi.resetModules(); const mod = await import('../src/save'); for (const h of Object.values(mod.save.heroes)) h.cleared = {}; return mod; };
  const after = async (...ids: string[]) => { const mod = await fresh(); const h = mod.save.heroes[mod.save.selected]; for (const id of ids) h.cleared[id] = 'A'; return mod.progressLv(); };

  it('a fresh save is item level 1; a story stage gives one above its recommended level', async () => {
    expect(await after()).toBe(1);
    expect(await after('1-1')).toBe(2);
    for (const st of STAGES) expect(await after(st.id), st.id).toBe(st.rec + 1);
  });

  it('the end of every world: one above the boss stage\'s recommended level (11-10: 121, not 131)', async () => {
    const got: number[] = [];
    for (const w of WORLDS) got.push(await after(`${w.id}-10`));
    expect(got).toEqual([11, 23, 35, 47, 59, 71, 81, 91, 101, 111, 121]);
    expect(got).toEqual(WORLDS.map(w => w.baseLv + 10));
    // never more than one level past what the furthest stage asks of the kaiju
    for (const w of WORLDS) expect(await after(`${w.id}-10`) - STAGES.find(s => s.id === `${w.id}-10`)!.rec).toBe(1);
  });

  it('secret stages S-n count as late in their world and never break it (S-n ids once made it NaN and crashed the Market)', async () => {
    for (const b of BONUS_STAGES) {
      const lv = await after(b.id), w = WORLDS[b.world - 1];
      expect(Number.isInteger(lv), b.id).toBe(true);
      expect(lv, b.id).toBe(w.baseLv + 8); // as late as that world's stage 8
      expect(lv, b.id).toBeLessThanOrEqual(await after(`${w.id}-10`));
    }
    expect(await after('S-11')).toBe(119);
    expect(await after('S-1')).toBe(9);
    expect(await after('11-10', 'S-11')).toBe(121);
    expect(await after('S-11', '3-2')).toBe(119);
  });

  it('Free Play ids, stages that do not exist and junk say nothing about progress', async () => {
    for (const id of ['D-20261114', 'E-12', 'E-40', 'R-11', 'R-1', 'S-12', 'S-0', 'S-', '12-1', '0-1', '11-11', '99-99', '1-0', '', 'x', '-', '1-', '-1', 'NaN-NaN', '1e3-1', ' 11-10', '11-10 ', '__proto__', 'constructor']) {
      const lv = await after(id);
      expect(lv, JSON.stringify(id)).toBe(1); expect(Number.isFinite(lv)).toBe(true);
    }
    expect(await after('D-20261114', 'E-99', 'R-11', '4-3', 'garbage')).toBe(STAGES.find(s => s.id === '4-3')!.rec + 1);
  });

  it('the furthest stage of ANY kaiju counts, the shop stock and bought boxes use it, and it is always a real item level', async () => {
    const mod = await fresh();
    const ids = Object.keys(mod.save.heroes).map(Number);
    mod.save.heroes[ids[0]].cleared['2-3'] = 'B'; mod.save.heroes[ids[ids.length - 1]].cleared['11-10'] = 'S'; mod.save.heroes[ids[1]].cleared['S-11'] = 'A';
    expect(mod.progressLv()).toBe(121);
    mod.save.shop.day = ''; // a new day: fresh stock
    for (const it of mod.shopStock()) expect(it.ilvl).toBe(121);
    mod.save.crumbs = 1e6; const n = mod.save.boxes.length;
    expect(mod.buyBox(0)).toBe(true);
    expect(mod.save.boxes[n].ilvl).toBe(121);
    expect(mod.stageMarketLv('11-10')).toBe(121); expect(mod.stageMarketLv('S-11')).toBe(119); expect(mod.stageMarketLv('E-5')).toBe(0);
  });
});
