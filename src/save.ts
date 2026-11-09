// Save data (localStorage 'kkq-save-v1'): every hero's progress, the shared bag, unopened boxes, crumbs, stage ranks.
import { CLASSES, type Stat } from './sim/classes';
import { type Item, MAX_PLUS, type Slot, BASES, enhanceCost, rollItem, salvageValue } from './sim/items';
import { clearRewards } from './sim/loot';
import { SKILLS } from './sim/skills';
import { type HeroProfile, canLevelSkill, gainXp, newProfile } from './sim/stats';
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
}

const KEY = 'kkq-save-v1';
export const RANK_ORDER: Rank[] = ['D', 'C', 'B', 'A', 'S'];

function fresh(): Save {
  const heroes: Record<number, HeroProfile> = {};
  for (const c of CLASSES) heroes[c.species] = newProfile(c.species);
  return { v: 1, heroes, bag: [], boxes: [{ tier: 2, ilvl: 1 }], crumbs: 0, cleared: {}, selected: 0, nextId: 1 };
}

export let save: Save = load();

function load(): Save {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as Save;
      const f = fresh();
      for (const c of CLASSES) if (!s.heroes[c.species]) s.heroes[c.species] = f.heroes[c.species];
      return { ...f, ...s };
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

export function levelSkill(species: number, id: string): boolean {
  const p = save.heroes[species];
  if (!canLevelSkill(p, id)) return false;
  p.skillPts--; p.skills[id] = (p.skills[id] ?? 0) + 1; persist(); return true;
}

export function equip(species: number, itemId: number): void {
  const i = save.bag.findIndex(x => x.id === itemId);
  if (i < 0) return;
  const it = save.bag[i];
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
  if (i < 0) return 0;
  const v = salvageValue(save.bag[i]);
  save.bag.splice(i, 1);
  save.crumbs += v; persist();
  return v;
}

/** Enhance an item (bag or equipped) by +1 for crumbs. */
export function enhance(it: Item): boolean {
  const cost = enhanceCost(it);
  if (it.plus >= MAX_PLUS || save.crumbs < cost) return false;
  save.crumbs -= cost; it.plus++; persist(); return true;
}

const ALL_SKILLS = Object.values(SKILLS).flatMap(s => s.actives.map(a => a.id).concat(s.passive.id));

/** Open the box at index i: one piece of gear + some crumbs. */
export function openBox(i: number): { item: Item; crumbs: number; box: LootBox } | null {
  const box = save.boxes[i];
  if (!box) return null;
  save.boxes.splice(i, 1);
  const item = rollItem(save.nextId++, box.tier, box.ilvl, Math.random, ALL_SKILLS);
  const crumbs = Math.round((3 + box.ilvl) * box.tier * (0.8 + Math.random() * 0.4));
  save.bag.push(item);
  save.crumbs += crumbs;
  persist();
  return { item, crumbs, box };
}

export interface ClearResult { rank: Rank; boxes: LootBox[]; upgraded: number; firstClear: boolean }

/** Stage finished: rank upgrades some boxes, adds the clear reward, records the best rank. */
export function finishStage(stageId: string, rank: Rank, found: LootBox[], stageLv: number, boss: boolean): ClearResult {
  const up = { S: 0.5, A: 0.3, B: 0.15, C: 0, D: 0 }[rank];
  let upgraded = 0;
  const boxes = found.map(b => {
    if (b.tier < 5 && Math.random() < up) { upgraded++; return { tier: (b.tier + 1) as BoxTier, ilvl: b.ilvl }; }
    return { ...b };
  });
  const firstClear = !save.cleared[stageId];
  for (const tier of clearRewards(stageLv, rank, boss, firstClear, Math.random)) boxes.push({ tier, ilvl: stageLv });
  const prev = save.cleared[stageId];
  if (!prev || RANK_ORDER.indexOf(rank) > RANK_ORDER.indexOf(prev)) save.cleared[stageId] = rank;
  save.boxes.push(...boxes);
  persist();
  return { rank, boxes, upgraded, firstClear };
}
