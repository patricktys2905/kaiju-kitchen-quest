// The Monster Cookbook screen's pure parts: the wording of rewards and toasts (src/ui/cookbookText.ts), and source checks
// that its buttons can be tapped: the camp's one click handler finds them by data-cb, and every data-cb action the
// screens draw has a branch in cookbookClick (a button with no branch draws fine and does nothing).
import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { type CookSave, cardNeeds, cardReward, cookbook, handIn, handInSpares, pageReward, BOOK_REWARD } from '../src/sim/cookbook';
import { DROPS } from '../src/sim/drops';
import { listText, paidSummary, rewardLine, starText } from '../src/ui/cookbookText';

const read = (f: string) => fs.readFileSync(new URL(f, import.meta.url), 'utf8');
const ui = read('../src/ui/cookbook.ts'), camp = read('../src/ui/camp.ts');

describe('Cookbook wording', () => {
  it('stars and lists', () => {
    expect(starText(0)).toBe('☆☆'); expect(starText(1)).toBe('★☆'); expect(starText(2)).toBe('★★'); expect(starText(5)).toBe('★★');
    expect(listText([])).toBe(''); expect(listText(['1-4'])).toBe('1-4'); expect(listText(['1-4', '1-5'])).toBe('1-4 and 1-5');
    expect(listText(['1-2', '1-3', '1-4'])).toBe('1-2, 1-3 and 1-4');
  });
  it('a reward line names crumbs, stamps, borders and titles, and nothing else exists to name', () => {
    expect(rewardLine(cardReward(1, 1))).toBe('🍪 30');
    expect(rewardLine(cardReward(2, 3))).toBe('🍪 300 + gold border');
    expect(rewardLine(pageReward(3, 1))).toBe('🍪 1500 + chef stamp');
    expect(rewardLine(pageReward(1, 2))).toBe('🍪 1000 + gold stamp + title Countertop Cook');
    expect(rewardLine(BOOK_REWARD)).toBe('title Head Chef');
    for (const p of cookbook().pages) for (const r of [cardReward(p.world, 1), cardReward(p.world, 2), cardReward(p.world, 3), pageReward(p.world, 1), pageReward(p.world, 2)]) {
      expect(Object.keys(r).filter(k => !['crumbs', 'stamp', 'border', 'title'].includes(k))).toEqual([]);
      expect(rewardLine(r)).not.toMatch(/undefined|NaN/);
    }
  });
  it('the toast adds up one hand-in', () => {
    const k = cookbook().pages[0].kinds[0], n = cardNeeds(k), s: CookSave = { crumbs: 0, drops: { [k]: 50 } };
    const r = handIn(s, k, n[1]);
    const sum = paidSummary([r]);
    expect(sum.handed).toBe(n[1]); expect(sum.crumbs).toBe(s.crumbs); expect(sum.crumbs).toBe(cardReward(1, 1).crumbs + cardReward(1, 2).crumbs);
    expect(sum.text).toContain(`Handed in ${n[1]} ${DROPS[k]![0]}`); expect(sum.text).toContain(`+🍪 ${s.crumbs}`); expect(sum.text).toContain('★');
    expect(sum.pages).toEqual([]); expect(sum.book).toBe(false);
    // nothing handed in: no toast
    expect(paidSummary([handIn({ crumbs: 0, drops: {} }, k)]).text).toBe('');
    expect(paidSummary([]).text).toBe('');
  });
  it('the toast for a finished page names the stamp and the title, and the totals match the save', () => {
    const page = cookbook().pages[0], s: CookSave = { crumbs: 0, drops: Object.fromEntries(page.kinds.map(k => [k, 99])) };
    const sum = paidSummary(handInSpares(s, page.id, []));
    expect(sum.crumbs).toBe(s.crumbs);
    expect(sum.handed).toBe(page.kinds.reduce((a, k) => a + cardNeeds(k)[2], 0));
    expect(sum.pages.map(p => p.level)).toEqual([1, 2]);
    expect(sum.titles).toEqual(['Countertop Cook']);
    expect(sum.text).toContain('gold stamp'); expect(sum.text).toContain('new title: Countertop Cook'); expect(sum.text).toContain(`${page.kinds.length} cards up`);
    expect(sum.book).toBe(false);
  });
  it('finishing the last page finishes the book', () => {
    const book = cookbook(), s: CookSave = { crumbs: 0, drops: Object.fromEntries(Object.keys(DROPS).map(k => [k, 99])) };
    const sum = paidSummary(handInSpares(s, 'all', []));
    expect(sum.book).toBe(true); expect(sum.titles).toContain('Head Chef'); expect(sum.pages.length).toBe(book.pages.length * 2);
  });
});

describe('Cookbook buttons can be tapped', () => {
  const handler = ui.slice(ui.indexOf('export function cookbookClick('), ui.indexOf('export const COOKBOOK_CSS'));
  const cases = new Set([...handler.matchAll(/case '([a-z]+)'/g)].map(m => m[1]));
  it('the camp finds data-cb and hands it to the Cookbook', () => {
    expect(camp).toMatch(/const CLICKABLE = '[^']*\[data-cb\][^']*'/);
    expect(camp).toMatch(/if \(ds\.cb\) \{ const r = cookbookClick\(ds\.cb\)/);
  });
  it('every data-cb action drawn by the Cookbook, the stage card and the Hero tab has a branch', () => {
    const drawn = new Set([...(ui + camp).matchAll(/data-cb(?:\^)?="([a-z]+)/g)].map(m => m[1]));
    expect(drawn.size).toBeGreaterThanOrEqual(10);
    for (const a of ['page', 'card', 'back', 'open', 'hand', 'yes', 'safe', 'no', 'spares', 'titles', 'title']) expect(drawn.has(a), a).toBe(true);
    expect([...drawn].filter(a => !cases.has(a))).toEqual([]);
  });
  it('the Cookbook lists no worlds by hand and offers nothing but crumbs, stamps, borders and titles', () => {
    expect(ui).not.toMatch(/WORLDS\b/);
    expect(ui).toMatch(/cookbookView\(\)/);
    expect(ui).not.toMatch(/save\.(boxes|items|bag)\b/);
    expect(ui).not.toMatch(/\b(openBox|buyBox|LootBox)\b/);
  });
  it('camp.ts keeps no skip sum of its own', () => {
    expect(camp).toMatch(/canSkipWith\(save\.drops, s\)/);
    expect(camp).toMatch(/stageUnlocked\(s: StageDef\): boolean \{ return stageOpen\(s\); \}/);
    expect(camp).not.toMatch(/function dropsHtml/);
  });
});
