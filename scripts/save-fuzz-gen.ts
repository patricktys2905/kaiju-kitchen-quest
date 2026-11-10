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

const COUNT = Number(process.argv[2] ?? 60);
let s = 12345;
const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
const pick = <T>(a: T[]) => a[Math.floor(r() * a.length)];
const RANKS = ['D', 'C', 'B', 'A', 'S'] as const;
const CONS = Object.keys(CONSUMABLES);
const ids = [...STAGES, ...BONUS_STAGES].map(x => x.id);

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
  out.unlocked = [...new Set(out.unlocked as number[])];
  if (!(out.unlocked as number[]).includes(out.selected as number)) out.selected = 0;
  // deliberately odd versions of real saves
  if (kind === 'old') { delete out.free; delete out.keys; delete out.spicy; delete out.storyMode; for (const it of bag) { delete (it as { grade?: number }).grade; delete (it as { twist?: unknown }).twist; } }
  if (kind === 'broken') {
    (out.boxes as { ilvl: number | null }[]).push({ tier: 3, ilvl: null }, { tier: 2, ilvl: null });
    (out.bag as unknown[]).push({ id: nextId++, base: 'no-such-thing', rarity: 2, ilvl: 5, plus: 0, lines: [] }, { id: nextId++, base: 'pin', rarity: 3, ilvl: null, plus: 0, lines: [{ k: 'atk', v: 4 }] });
    out.shop = { day: 'x', stock: [{ id: 1, base: 'gone-item', rarity: 2, ilvl: 3, plus: 0, lines: [] }] };
    out.quick = ['jam', 'not-a-potion', null];
  }
  return out;
}

const kinds = ['empty', 'max', 'old', 'broken', ...Array.from({ length: Math.max(0, COUNT - 4) }, () => 'random')];
fs.mkdirSync('shots', { recursive: true });
fs.writeFileSync('shots/fuzz-saves.json', JSON.stringify(kinds.map(k => ({ kind: k, save: save(k) }))));
console.log(`${kinds.length} saves → shots/fuzz-saves.json`);
