// Save data (localStorage 'kkq-save-v1'): every hero's progress, the shared bag, unopened boxes, crumbs, stage ranks.
import type { Spicy } from './sim/types';
import { CLASSES, type Stat } from './sim/classes';
import { CONSUMABLES, type ConsumableId } from './sim/consumables';
import { type Item, MAX_PLUS, type Slot, BASES, canWear, fortChance, fortCost, fortRisky, gradeOf, rollGrade, rollItem, salvageValue } from './sim/items';
import { clearRewards } from './sim/loot';
import { SKILLS } from './sim/skills';
import { type Derived, type HeroProfile, canLevelSkill, derive, gainXp, newProfile } from './sim/stats';
import type { BoxTier, LootBox } from './sim/types';

export type Rank = 'S' | 'A' | 'B' | 'C' | 'D';
export interface Save {
  v: 1;
  heroes: Record<number, HeroProfile>;
  bag: Item[];
  boxes: LootBox[];
  crumbs: number;
  cleared: Record<string, Rank>;
  selected: number;
  nextId: number;
  /** consumables owned */
  items: Partial<Record<ConsumableId, number>>;
  /** the 4 quick-bag slots */
  quick: (ConsumableId | null)[];
  /** locked items can't be salvaged */
  locked: number[];
  /** Hard mode: unlocked per world after its boss; best ranks on Hard */
  hard: boolean;
  hardCleared: Record<string, Rank>;
  /** today's market stock */
  shop: { day: string; stock: Item[] };
  /** kaiju you can play (others are unlocked by challenges) */
  unlocked: number[];
  /** Spicy challenges switched on for the next stages */
  spicy?: Spicy[];
}

// v2: per-kaiju progress, 4 starters, story (older v1 saves are not carried over)
const KEY = 'kkq-save-v2';
export const RANK_ORDER: Rank[] = ['D', 'C', 'B', 'A', 'S'];

function fresh(): Save {
  const heroes: Record<number, HeroProfile> = {};
  for (const c of CLASSES) heroes[c.species] = newProfile(c.species);
  return { v: 1, heroes, bag: [], boxes: [{ tier: 2, ilvl: 1 }], crumbs: 0, cleared: {}, selected: 0, nextId: 1,
    items: { jam: 3, pepper: 1, fstone: 3, gstone: 1 }, quick: ['jam', 'pepper', null, null], locked: [], hard: false, hardCleared: {}, shop: { day: '', stock: [] }, unlocked: [...STARTERS] };
}

/** The four kaiju you start with. */
export const STARTERS = [0, 10, 11, 4];

export let save: Save = load();

function load(): Save {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as Save;
      const f = fresh();
      for (const c of CLASSES) if (!s.heroes[c.species]) s.heroes[c.species] = f.heroes[c.species];
      const out = { ...f, ...s };
      for (const c of CLASSES) out.heroes[c.species] = { ...newProfile(c.species), ...out.heroes[c.species] };
      if (!out.unlocked.includes(out.selected)) out.selected = STARTERS[0];
      return out;
    }
  } catch { /* corrupted: start fresh */ }
  return fresh();
}

export function persist(): void {
  try { localStorage.setItem(KEY, JSON.stringify(save)); } catch { /* storage full / private mode */ }
}

export function resetSave(): void { save = fresh(); persist(); }

export const hero = (species = save.selected): HeroProfile => save.heroes[species];

export function addXp(species: number, xp: number): number { const n = gainXp(save.heroes[species], xp); persist(); return n; }

export function spendStat(species: number, s: Stat): boolean {
  const p = save.heroes[species];
  if (p.statPts <= 0) return false;
  p.statPts--; p.alloc[s]++; persist(); return true;
}

/** Auto-spend: puts points into the class's two strongest growth stats. */
export function autoStats(species: number): void {
  const p = save.heroes[species];
  const cls = CLASSES.find(c => c.species === species)!;
  const order = (Object.keys(cls.grow) as Stat[]).sort((a, b) => cls.grow[b] - cls.grow[a]);
  let i = 0;
  while (p.statPts > 0) { p.alloc[order[i % 2 === 0 ? 0 : 1]]++; p.statPts--; i++; }
  persist();
}

export function resetStats(species: number): void {
  const p = save.heroes[species];
  for (const k of Object.keys(p.alloc) as Stat[]) { p.statPts += p.alloc[k]; p.alloc[k] = 0; }
  persist();
}

export function chooseBranch(species: number, id: string, b: 'a' | 'b'): boolean {
  const p = save.heroes[species];
  if ((p.skills[id] ?? 0) < 3 || p.branch?.[id]) return false;
  p.branch = { ...(p.branch ?? {}), [id]: b }; persist(); return true;
}

export function levelSkill(species: number, id: string): boolean {
  const p = save.heroes[species];
  if (!canLevelSkill(p, id)) return false;
  p.skillPts--; p.skills[id] = (p.skills[id] ?? 0) + 1; persist(); return true;
}

export function equip(species: number, itemId: number): void {
  const i = save.bag.findIndex(x => x.id === itemId);
  if (i < 0) return;
  const it = save.bag[i];
  if (!canWear(it, species)) return;
  const slot: Slot = BASES[it.base].slot;
  const p = save.heroes[species];
  save.bag.splice(i, 1);
  if (p.equip[slot]) save.bag.push(p.equip[slot]!);
  p.equip[slot] = it;
  persist();
}

export function unequip(species: number, slot: Slot): void {
  const p = save.heroes[species];
  if (!p.equip[slot]) return;
  save.bag.push(p.equip[slot]!);
  delete p.equip[slot];
  persist();
}

export function salvage(itemId: number): number {
  const i = save.bag.findIndex(x => x.id === itemId);
  if (i < 0 || isLocked(itemId)) return 0;
  const v = salvageValue(save.bag[i]);
  save.bag.splice(i, 1);
  save.crumbs += v; persist();
  return v;
}

export type FortResult = { ok: boolean; from: number; to: number; saved: boolean } | null;
/** Fortify an item (bag or equipped): costs crumbs + Fortify Stones; may fail. From +7 a failure drops a
 *  level unless a Safety Charm is used (consumed only when it saves you). */
export function fortify(it: Item, useSafety: boolean): FortResult {
  const c = fortCost(it);
  if (it.plus >= MAX_PLUS || save.crumbs < c.crumbs || (save.items.fstone ?? 0) < c.stones) return null;
  save.crumbs -= c.crumbs; save.items.fstone = (save.items.fstone ?? 0) - c.stones;
  const from = it.plus;
  let saved = false;
  if (Math.random() < fortChance(it.plus)) it.plus++;
  else if (fortRisky(it.plus)) {
    if (useSafety && (save.items.safety ?? 0) > 0) { save.items.safety!--; saved = true; } else it.plus--;
  }
  persist();
  return { ok: it.plus > from, from, to: it.plus, saved };
}
export function canFortify(it: Item): boolean { const c = fortCost(it); return it.plus < MAX_PLUS && save.crumbs >= c.crumbs && (save.items.fstone ?? 0) >= c.stones; }

/** Re-roll an item's grade with a Grading Stone (can go down) or a Golden one (never down). */
export function regrade(it: Item, golden: boolean): { from: number; to: number } | null {
  const key = golden ? 'ggstone' : 'gstone';
  if ((save.items[key] ?? 0) <= 0) return null;
  save.items[key]!--;
  const from = gradeOf(it);
  it.grade = rollGrade(Math.random, it.rarity, golden ? from : 0);
  persist();
  return { from, to: it.grade };
}
/** kept for old callers */
export function enhance(it: Item): boolean { return !!fortify(it, false)?.ok; }

const ALL_SKILLS = Object.values(SKILLS).flatMap(s => s.actives.map(a => a.id).concat(s.passive.id));

/** Open the box at index i: one piece of gear + some crumbs. */
export function openBox(i: number): { item: Item; crumbs: number; box: LootBox; extra: string[] } | null {
  const box = save.boxes[i];
  if (!box) return null;
  save.boxes.splice(i, 1);
  const item = rollItem(save.nextId++, box.tier, box.ilvl, Math.random, ALL_SKILLS, save.selected);
  const crumbs = Math.round((3 + box.ilvl) * box.tier * (0.8 + Math.random() * 0.4));
  save.bag.push(item);
  save.crumbs += crumbs;
  const extra: string[] = [];
  const stones = Math.random() < 0.35 + box.tier * 0.1 ? 1 + Math.floor(Math.random() * box.tier) : 0;
  if (stones) { save.items.fstone = (save.items.fstone ?? 0) + stones; extra.push(`+${stones} Fortify Stone${stones > 1 ? 's' : ''}`); }
  if (Math.random() < 0.06 * box.tier) { save.items.gstone = (save.items.gstone ?? 0) + 1; extra.push('+1 Grading Stone'); }
  if (box.tier >= 4 && Math.random() < 0.15) { save.items.ggstone = (save.items.ggstone ?? 0) + 1; extra.push('+1 Golden Grading Stone'); }
  persist();
  return { item, crumbs, box, extra };
}

export interface ClearResult { rank: Rank; boxes: LootBox[]; upgraded: number; firstClear: boolean; spicy: number }

/** Stage finished: rank upgrades some boxes, adds the clear reward, records the best rank. */
export function finishStage(stageId: string, rank: Rank, found: LootBox[], stageLv: number, boss: boolean, hard = false, spicy = 0): ClearResult {
  const up = { S: 0.5, A: 0.3, B: 0.15, C: 0, D: 0 }[rank];
  let upgraded = 0;
  const boxes = found.map(b => {
    if (b.tier < 5 && Math.random() < up) { upgraded++; return { tier: (b.tier + 1) as BoxTier, ilvl: b.ilvl }; }
    return { ...b };
  });
  const hp = save.heroes[save.selected];
  const table = hard ? hp.hardCleared : hp.cleared;
  const firstClear = !table[stageId];
  for (const tier of clearRewards(stageLv, rank, boss, firstClear, Math.random)) boxes.push({ tier, ilvl: stageLv });
  // each Spicy chilli adds a bonus box (better with more chillies)
  for (let i = 0; i < spicy; i++) boxes.push({ tier: Math.min(5, 2 + spicy) as BoxTier, ilvl: stageLv });
  const prev = table[stageId];
  if (!prev || RANK_ORDER.indexOf(rank) > RANK_ORDER.indexOf(prev)) table[stageId] = rank;
  // boss first clears drop a Golden Sugar Cube (permanent stat point)
  if (boss && firstClear) { save.items.sugar = (save.items.sugar ?? 0) + 1; save.items.ggstone = (save.items.ggstone ?? 0) + 1; }
  save.boxes.push(...boxes);
  persist();
  return { rank, boxes, upgraded, firstClear, spicy };
}

// ---------- consumables ----------
export function addConsumable(id: ConsumableId, n = 1): void { save.items[id] = (save.items[id] ?? 0) + n; persist(); }

/** Quick bag for a stage: the 4 slots with how many of each you own. */
export function quickBag(): ({ id: ConsumableId; n: number } | null)[] {
  return save.quick.map(id => id && (save.items[id] ?? 0) > 0 ? { id, n: save.items[id]! } : null);
}

/** After a stage: write back what was used. */
export function syncQuickBag(after: ({ id: ConsumableId; n: number } | null)[], revivesLeft: number): void {
  for (const b of after) if (b) save.items[b.id] = b.n;
  save.items.revive = revivesLeft;
  persist();
}

export function setQuick(slot: number, id: ConsumableId | null): void {
  const old = id ? save.quick.indexOf(id) : -1;
  if (old >= 0) save.quick[old] = save.quick[slot]; // swap
  save.quick[slot] = id;
  persist();
}

/** Camp-only items. */
export function useSugar(species: number, s: Stat): boolean {
  if (!save.items.sugar) return false;
  save.items.sugar--; save.heroes[species].alloc[s]++; persist(); return true;
}
export function useScroll(species: number): boolean {
  const p = save.heroes[species];
  if (!save.items.scroll) return false;
  const first = SKILLS[species]?.actives[0].id ?? Object.keys(p.skills)[0];
  let refund = 0;
  for (const [id, lv] of Object.entries(p.skills)) refund += id === first ? lv - 1 : lv;
  p.skills = { [first]: 1 };
  p.branch = {};
  p.skillPts += refund;
  save.items.scroll--; persist(); return true;
}

// ---------- gear helpers ----------
export function isLocked(id: number): boolean { return save.locked.includes(id); }
export function toggleLock(id: number): void {
  save.locked = isLocked(id) ? save.locked.filter(x => x !== id) : [...save.locked, id];
  persist();
}

/** One number for "how strong is this hero" (attack side × survival side), used to compare gear. */
export function power(d: Derived): number {
  const skillLv = Object.values(d.skillLv).reduce((a, b) => a + b, 0);
  const offence = d.atk * (1 + d.crit / 100 * (d.critDmg - 1)) * (0.6 + 0.4 * d.skillDmg) / (1 - d.cdr * 0.5) * Math.pow(d.speed, 0.3) * (1 + skillLv * 0.04);
  const defence = d.maxHp / (1 - d.dr);
  return offence * 10 + defence;
}

export interface Diff { k: string; v: number; pct?: boolean }
/** How equipping item it on a hero changes its numbers (pct > 0 = stronger overall). */
export function compare(species: number, it: Item): { pct: number; diff: Diff[] } {
  const p = save.heroes[species];
  if (!canWear(it, species)) return { pct: -Infinity, diff: [] };
  const slot = BASES[it.base].slot;
  const cur = p.equip[slot];
  if (cur?.id === it.id) return { pct: 0, diff: [] };
  const now = derive(p);
  const withIt = derive({ ...p, equip: { ...p.equip, [slot]: it } });
  const pct = (power(withIt) / power(now) - 1) * 100;
  const diff: Diff[] = [];
  const add = (k: string, a: number, b: number, isPct = false) => { const v = isPct ? Math.round((b - a) * 1000) / 10 : Math.round(b - a); if (v) diff.push({ k, v, pct: isPct }); };
  add('Attack', now.atk, withIt.atk); add('Max HP', now.maxHp, withIt.maxHp); add('Defence', now.def, withIt.def);
  add('Crit', now.crit / 100, withIt.crit / 100, true); add('Crit dmg', now.critDmg, withIt.critDmg, true);
  add('Skill dmg', now.skillDmg, withIt.skillDmg, true); add('Cooldown cut', now.cdr, withIt.cdr, true); add('Speed', now.speed, withIt.speed, true);
  for (const k of Object.keys(withIt.skillLv)) add(`${k} Lv`, now.skillLv[k] ?? 0, withIt.skillLv[k] ?? 0);
  return { pct, diff };
}

/** Equip the strongest bag item per slot for this hero. Returns how many were swapped. */
export function equipBest(species: number): number {
  let n = 0;
  for (const slot of ['weapon', 'armor', 'charm'] as Slot[]) {
    let best: Item | null = null, bestPct = 0.05;
    for (const it of save.bag) if (BASES[it.base].slot === slot) { const c = compare(species, it).pct; if (c > bestPct) { best = it; bestPct = c; } }
    if (best) { equip(species, best.id); n++; }
  }
  return n;
}

/** Salvage unlocked bag items that are worse than what EVERY hero currently wears in that slot. */
export function salvageWorse(): { n: number; crumbs: number } {
  let n = 0, crumbs = 0;
  for (const it of [...save.bag]) {
    if (isLocked(it.id)) continue;
    const wearers = CLASSES.filter(c => canWear(it, c.species));
    if (wearers.every(c => compare(c.species, it).pct < 0)) { crumbs += salvage(it.id); n++; }
  }
  return { n, crumbs };
}

// ---------- market ----------
export const SHOP_ITEMS: ConsumableId[] = ['jam', 'bigjam', 'pepper', 'ice', 'bean', 'revive', 'fstone', 'gstone', 'safety', 'scroll'];
export const SHOP_BOXES: { tier: BoxTier; price: number }[] = [{ tier: 2, price: 120 }, { tier: 3, price: 380 }];
export function today(): string { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
/** Furthest stage level cleared → item level of shop stock and bought boxes. */
export function progressLv(): number {
  let lv = 1;
  for (const h of Object.values(save.heroes)) for (const id of Object.keys(h.cleared ?? {})) { const [w, n] = id.split('-').map(Number); lv = Math.max(lv, (w - 1) * 12 + n + 1); }
  return lv;
}
export function gearPrice(it: Item): number { return Math.round((40 + it.ilvl * 12) * [1, 1.6, 3, 6, 12][it.rarity - 1]); }

/** Today's 3 pieces of gear (the first is always Rare or better), regenerated each day. */
export function shopStock(): Item[] {
  if (save.shop.day !== today()) {
    let seed = [...today()].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) || 1;
    const rand = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return ((seed >>> 0) % 100000) / 100000; };
    const lv = progressLv();
    const ids = Object.values(SKILLS).flatMap(x => x.actives.map(a => a.id));
    // the market leans toward the hero you're playing (re-rolls each day)
    const stock = [rollItem(save.nextId++, 4, lv, rand, ids, save.selected), rollItem(save.nextId++, 3, lv, rand, ids, save.selected), rollItem(save.nextId++, 3, lv, rand, ids)];
    if (stock[0].rarity < 3) stock[0].rarity = 3;
    save.shop = { day: today(), stock };
    persist();
  }
  return save.shop.stock;
}

export function buyConsumable(id: ConsumableId): boolean {
  const price = CONSUMABLES[id].price;
  if (save.crumbs < price) return false;
  save.crumbs -= price; addConsumable(id); return true;
}
export function buyBox(i: number): boolean {
  const b = SHOP_BOXES[i];
  if (!b || save.crumbs < b.price) return false;
  save.crumbs -= b.price; save.boxes.push({ tier: b.tier, ilvl: progressLv() }); persist(); return true;
}
export function buyGear(id: number): boolean {
  const i = save.shop.stock.findIndex(x => x.id === id);
  if (i < 0) return false;
  const it = save.shop.stock[i], price = gearPrice(it);
  if (save.crumbs < price) return false;
  save.crumbs -= price; save.shop.stock.splice(i, 1); save.bag.push(it); persist(); return true;
}
