// Builds a pile of random and deliberately odd saves for scripts/save-fuzz.mjs to open every screen with.
// npx vite-node scripts/save-fuzz-gen.ts [count=60] → shots/fuzz-saves.json
import fs from 'node:fs';
import { CLASSES } from '../src/sim/classes';
import { rollItem, BASES } from '../src/sim/items';
import { BONUS_STAGES, STAGES } from '../src/sim/stages';
import { MAX_LEVEL, newProfile } from '../src/sim/stats';
import { STORIES } from '../src/story/stories';
import { CONSUMABLES } from '../src/sim/consumables';
import type { BoxTier } from '../src/sim/types';
import { DROPS } from '../src/sim/drops';
import { cardNeeds, cookbook } from '../src/sim/cookbook';

const COUNT = Number(process.argv[2] ?? 60);
let s = 12345;
const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
const pick = <T>(a: T[]) => a[Math.floor(r() * a.length)];
const RANKS = ['D', 'C', 'B', 'A', 'S'] as const;
const CONS = Object.keys(CONSUMABLES);
const ids = [...STAGES, ...BONUS_STAGES].map(x => x.id);
const DROP_KINDS = Object.keys(DROPS);
// Monster Cookbook fields (drops, cookbook, cookbookPaid, title) that no real game would write: load must repair every one
const ODD_BOOKS: Record<string, unknown>[] = [
  { drops: null, cookbook: null, cookbookPaid: null, title: null },
  { drops: 'lots', cookbook: 'full', cookbookPaid: 'yes', title: 7 },
  { drops: [3, 4, 5], cookbook: [1, 2], cookbookPaid: [2], title: ['all'] },
  { drops: { bun: -4, worm: 2.5, ant: 'six', salt: null, egg: 1e12, 'no-such-monster': 9, toast: 3 }, cookbook: { bun: -1, worm: 3.7, ant: '5', salt: null, egg: 1e9, 'no-such-monster': 12, toast: 12, kbun: 5 }, cookbookPaid: { 1: 9, 2: -1, 3: 'two', 99: 2, all: 5, x: 1 }, title: 'w99' },
  { cookbook: { bun: 12 }, cookbookPaid: {}, title: 'all' }, // a title that was never earned
  { cookbookPaid: { 1: 2, all: 1 }, title: 'w1' }, // paid marks with an empty book (titles stay earned)
  { drops: {}, cookbook: {}, cookbookPaid: {}, title: '' },
];

// Garnish fields (save.garnishes, each hero's garnish) that no real game would write: load must repair every one
const ODD_GARNISHES: unknown[] = [null, 'bun', 7, {}, { bun: true }, [], ['no-such-monster', 'bun', 'bun', 5, null, ['ant'], 'kbun', 'ant'], [null, undefined, 3.5], ['bun'], DROP_KINDS];
const ODD_WORN: unknown[] = [null, 7, '', 'no-such-monster', ['bun'], { kind: 'bun' }, 'kbun', 'bun', 'ant', true];

function save(kind: string) {
  const heroes: Record<number, ReturnType<typeof newProfile>> = {};
  let nextId = 1;
  const extreme = kind === 'max', empty = kind === 'empty';
  for (const c of CLASSES) {
    const p = newProfile(c.species);
    if (!empty) {
      p.level = extreme ? MAX_LEVEL : 1 + Math.floor(r() * r() * MAX_LEVEL);
      const upto = extreme ? ids.length : Math.floor(r() * ids.length);
      for (const id of ids.slice(0, upto)) if (extreme || r() < 0.8) p.cleared[id] = pick([...RANKS]);
      if (r() < 0.4 || extreme) for (const id of Object.keys(p.cleared)) if (r() < 0.5) p.hardCleared[id] = pick([...RANKS]);
      p.statPts = Math.floor(r() * 40); p.skillPts = Math.floor(r() * 10);
      const beats = Object.keys(STORIES[c.species]?.beats ?? {});
      p.seen = beats.filter(() => r() < 0.5);
      for (const slot of ['weapon', 'armor', 'charm'] as const) if (r() < 0.8) {
        let it; do { it = rollItem(nextId++, (1 + Math.floor(r() * 5)) as BoxTier, Math.max(1, p.level - 2), r, [], c.species); } while (BASES[it.base].slot !== slot || (BASES[it.base].for !== undefined && BASES[it.base].for !== c.species));
        it.plus = Math.floor(r() * 16); p.equip[slot] = it;
      }
    }
    heroes[c.species] = p;
  }
  const bag = empty ? [] : Array.from({ length: extreme ? 300 : Math.floor(r() * 60) }, () => rollItem(nextId++, (1 + Math.floor(r() * 5)) as BoxTier, 1 + Math.floor(r() * 110), r, []));
  const out: Record<string, unknown> = {
    v: 1, heroes, bag, boxes: Array.from({ length: extreme ? 99 : Math.floor(r() * 12) }, () => ({ tier: 1 + Math.floor(r() * 5), ilvl: 1 + Math.floor(r() * 110) })),
    crumbs: extreme ? 9_999_999 : Math.floor(r() * 50000), cleared: {}, selected: pick(CLASSES).species, nextId,
    items: Object.fromEntries(CONS.map(k => [k, Math.floor(r() * (extreme ? 999 : 12))])), quick: [pick(CONS), r() < 0.5 ? pick(CONS) : null, null, null],
    locked: bag.filter(() => r() < 0.1).map(i => i.id), hard: r() < 0.3, hardCleared: {}, shop: { day: 'old', stock: [] },
    unlocked: empty ? [0, 10, 11, 4] : CLASSES.filter(() => extreme || r() < 0.6).map(c => c.species).concat([0, 10, 11, 4]),
    spicy: r() < 0.3 ? ['nopots'] : [], keys: Array.from({ length: Math.floor(r() * 11) }, (_, i) => i + 1), storyMode: r() < 0.5 ? 'full' : 'key',
    nightmare: r() < 0.2, buddy: r() < 0.3 ? pick(CLASSES).species : null, netName: r() < 0.5 ? 'Tester <b>&amp;</b>' : undefined,
    free: r() < 0.6 ? { daily: 20261110, endless: { 0: 12 }, rush: { 10: 300 } } : undefined,
  };
  // drops and the Cookbook: empty and old saves have none of the fields; max has a finished book; the rest are part-way
  if (extreme) {
    out.drops = Object.fromEntries(DROP_KINDS.map(k => [k, 99]));
    out.cookbook = Object.fromEntries(DROP_KINDS.map(k => [k, cardNeeds(k)[2]]));
    out.cookbookPaid = { ...Object.fromEntries(cookbook().pages.map(p => [p.id, 2])), all: 1 }; out.title = 'all';
  } else if (!empty) {
    if (r() < 0.8) out.drops = Object.fromEntries(DROP_KINDS.filter(() => r() < 0.5).map(k => [k, Math.floor(r() * 30)]));
    if (r() < 0.7) {
      const done = r() < 0.3; // some saves with whole pages done, so stamps and titles get drawn
      out.cookbook = Object.fromEntries(DROP_KINDS.filter(() => done || r() < 0.6).map(k => [k, done && r() < 0.8 ? cardNeeds(k)[2] : Math.floor(r() * 14)]));
      out.cookbookPaid = Object.fromEntries(cookbook().pages.filter(() => r() < (done ? 0.7 : 0.15)).map(p => [p.id, 1 + Math.floor(r() * 2)]));
      if (r() < 0.5) out.title = pick(['w1', 'w4', 'w10', 'all']); // earned or not: an unearned one is cleared on load
    }
    if (r() < 0.25) Object.assign(out, pick(ODD_BOOKS));
  }
  // garnishes: max owns and wears them all over; random saves own some (mostly from one-star cards, as the game would), and
  // one in four gets odd lists and odd worn values (unowned, unknown, not even text) plus the online-only gold flag
  const wearing = heroes as Record<number, { garnish?: unknown; garnishGold?: unknown }>;
  if (extreme) { out.garnishes = [...DROP_KINDS]; for (const c of CLASSES) wearing[c.species].garnish = pick(DROP_KINDS); }
  else if (!empty) {
    if (r() < 0.6) { const own = DROP_KINDS.filter(() => r() < 0.3); out.garnishes = own; for (const c of CLASSES) if (own.length && r() < 0.5) wearing[c.species].garnish = pick(own); }
    if (r() < 0.25) { out.garnishes = pick(ODD_GARNISHES); for (const c of CLASSES) if (r() < 0.6) { wearing[c.species].garnish = pick(ODD_WORN); if (r() < 0.3) wearing[c.species].garnishGold = pick([true, 'yes', 1]); } }
    if (r() < 0.1) { delete out.garnishes; wearing[pick(CLASSES).species].garnish = 'bun'; } // worn with no owned list at all
  }
  out.unlocked = [...new Set(out.unlocked as number[])];
  if (!(out.unlocked as number[]).includes(out.selected as number)) out.selected = 0;
  // deliberately odd versions of real saves
  if (kind === 'old') { delete out.garnishes; for (const c of CLASSES) { delete wearing[c.species].garnish; delete wearing[c.species].garnishGold; } delete out.drops; delete out.cookbook; delete out.cookbookPaid; delete out.title; delete out.free; delete out.keys; delete out.spicy; delete out.storyMode; for (const it of bag) { delete (it as { grade?: number }).grade; delete (it as { twist?: unknown }).twist; } }
  if (kind === 'broken') {
    (out.boxes as { ilvl: number | null }[]).push({ tier: 3, ilvl: null }, { tier: 2, ilvl: null });
    (out.bag as unknown[]).push({ id: nextId++, base: 'no-such-thing', rarity: 2, ilvl: 5, plus: 0, lines: [] }, { id: nextId++, base: 'pin', rarity: 3, ilvl: null, plus: 0, lines: [{ k: 'atk', v: 4 }] });
    out.shop = { day: 'x', stock: [{ id: 1, base: 'gone-item', rarity: 2, ilvl: 3, plus: 0, lines: [] }] };
    out.quick = ['jam', 'not-a-potion', null];
    Object.assign(out, ODD_BOOKS[3]);
    out.garnishes = ODD_GARNISHES[6]; CLASSES.forEach((c, i) => { wearing[c.species].garnish = ODD_WORN[i % ODD_WORN.length]; wearing[c.species].garnishGold = true; });
  }
  return out;
}

const kinds = ['empty', 'max', 'old', 'broken', ...Array.from({ length: Math.max(0, COUNT - 4) }, () => 'random')];
fs.mkdirSync('shots', { recursive: true });
fs.writeFileSync('shots/fuzz-saves.json', JSON.stringify(kinds.map(k => ({ kind: k, save: save(k) }))));
console.log(`${kinds.length} saves → shots/fuzz-saves.json`);
