// Equipment: rolled from loot boxes (gacha). Slot base + rarity + random stat lines.
// Epic/Legendary can roll "+N to a skill" for any kaiju; Legendary can roll "+1 all skills".
import type { Stat } from './classes';
import type { BoxTier } from './types';

export type Slot = 'weapon' | 'armor' | 'charm';
export type Rarity = 1 | 2 | 3 | 4 | 5;
export type LineKind = Stat | 'atk' | 'hp' | 'def' | 'crit' | 'critDmg' | 'skillDmg' | 'cdr' | 'speed';

export interface Line { k: LineKind; v: number }
export interface Item {
  id: number;
  base: string;     // key into BASES
  rarity: Rarity;
  ilvl: number;     // item level (from the monsters / stage it came from)
  plus: number;     // fortification +0..+15
  /** grade index into GRADES (D..S); missing on old saves = C */
  grade?: number;
  lines: Line[];
  /** skill id → bonus levels; 'all' = every skill */
  skill?: { id: string; n: number };
  /** set piece (SETS key) */
  set?: string;
  /** named legendary (UNIQUES key) */
  unique?: string;
}

export interface BaseDef { slot: Slot; name: string; icon: string; main: Line[]; minLv?: number }
/** main = guaranteed stat at ilvl 1 (scaled by ilvl and rarity) */
export const BASES: Record<string, BaseDef> = {
  spoon: { slot: 'weapon', name: 'Wooden Spoon', icon: 'eq-spoon', main: [{ k: 'atk', v: 4 }] },
  fork: { slot: 'weapon', name: 'Fork Trident', icon: 'eq-fork', main: [{ k: 'atk', v: 3 }, { k: 'crit', v: 2 }] },
  whisk: { slot: 'weapon', name: 'Whisk Wand', icon: 'eq-whisk', main: [{ k: 'atk', v: 3 }, { k: 'skillDmg', v: 0.04 }] },
  pin: { slot: 'weapon', name: 'Rolling Pin', icon: 'eq-pin', main: [{ k: 'atk', v: 5 }] },
  apron: { slot: 'armor', name: 'Checkered Apron', icon: 'eq-apron', main: [{ k: 'hp', v: 20 }, { k: 'def', v: 2 }] },
  mitt: { slot: 'armor', name: 'Oven Mitt', icon: 'eq-mitt', main: [{ k: 'def', v: 3 }, { k: 'atk', v: 1 }] },
  lid: { slot: 'armor', name: 'Pot Lid', icon: 'eq-lid', main: [{ k: 'def', v: 4 }] },
  cookie: { slot: 'charm', name: 'Fortune Cookie', icon: 'eq-cookie', main: [{ k: 'crit', v: 3 }] },
  bell: { slot: 'charm', name: 'Timer Bell', icon: 'eq-bell', main: [{ k: 'cdr', v: 0.04 }] },
  salt: { slot: 'charm', name: 'Salt Crystal', icon: 'eq-salt', main: [{ k: 'skillDmg', v: 0.06 }] },
  // World 2 gear (only drops from item level 12 up)
  icepick: { slot: 'weapon', name: 'Ice Pick', icon: 'eq-icepick', main: [{ k: 'atk', v: 4 }, { k: 'crit', v: 3 }], minLv: 12 },
  fish: { slot: 'weapon', name: 'Frozen Fish', icon: 'eq-fish', main: [{ k: 'atk', v: 6 }], minLv: 12 },
  cozy: { slot: 'armor', name: 'Tea Cozy Vest', icon: 'eq-cozy', main: [{ k: 'hp', v: 30 }, { k: 'def', v: 3 }], minLv: 12 },
  snow: { slot: 'charm', name: 'Snowflake Charm', icon: 'eq-snow', main: [{ k: 'cdr', v: 0.05 }, { k: 'crit', v: 2 }], minLv: 12 },
  // World 3 gear (item level 24 up)
  spatula: { slot: 'weapon', name: 'Flaming Spatula', icon: 'eq-spatula', main: [{ k: 'atk', v: 7 }], minLv: 24 },
  skewer: { slot: 'weapon', name: 'Kebab Skewer', icon: 'eq-skewer', main: [{ k: 'atk', v: 5 }, { k: 'crit', v: 4 }], minLv: 24 },
  foil: { slot: 'armor', name: 'Foil Plate', icon: 'eq-foil', main: [{ k: 'def', v: 5 }, { k: 'hp', v: 20 }], minLv: 24 },
  ember: { slot: 'charm', name: 'Ember Chili', icon: 'eq-ember', main: [{ k: 'skillDmg', v: 0.06 }, { k: 'atk', v: 2 }], minLv: 24 },
};

export const RARITY_NAMES: Record<Rarity, string> = { 1: 'Common', 2: 'Uncommon', 3: 'Rare', 4: 'Epic', 5: 'Legendary' };
export const RARITY_CSS: Record<Rarity, string> = { 1: '#d8d0c8', 2: '#7ee87e', 3: '#6ab8ff', 4: '#c88aff', 5: '#ffb02e' };
const PREFIX: Record<Rarity, string[]> = {
  1: ['Plain', 'Sturdy', 'Trusty'],
  2: ['Polished', 'Zesty', 'Toasty'],
  3: ['Gleaming', 'Spiced', 'Glazed'],
  4: ['Royal', 'Molten', 'Candied'],
  5: ["Grand Chef's", 'Mythic', 'Golden'],
};

export const LINE_NAMES: Record<LineKind, string> = {
  str: 'STR', dex: 'DEX', int: 'INT', vit: 'VIT', atk: 'Attack', hp: 'Max HP', def: 'Defence',
  crit: 'Crit chance', critDmg: 'Crit damage', skillDmg: 'Skill damage', cdr: 'Cooldowns', speed: 'Move speed',
};
const PCT: LineKind[] = ['critDmg', 'skillDmg', 'cdr', 'speed'];

export function lineText(l: Line): string {
  if (PCT.includes(l.k)) return `${l.k === 'cdr' ? '-' : '+'}${Math.round(l.v * 100)}% ${LINE_NAMES[l.k]}`;
  if (l.k === 'crit') return `+${l.v}% ${LINE_NAMES[l.k]}`;
  return `+${l.v} ${LINE_NAMES[l.k]}`;
}

/** Random extra lines: value at item level 1, rounded by kind. */
const EXTRA: { k: LineKind; v: number; w: number }[] = [
  { k: 'str', v: 2, w: 10 }, { k: 'dex', v: 2, w: 10 }, { k: 'int', v: 2, w: 10 }, { k: 'vit', v: 2, w: 10 },
  { k: 'atk', v: 2, w: 8 }, { k: 'hp', v: 12, w: 8 }, { k: 'def', v: 2, w: 6 }, { k: 'crit', v: 2, w: 5 },
  { k: 'critDmg', v: 0.08, w: 4 }, { k: 'skillDmg', v: 0.05, w: 4 }, { k: 'cdr', v: 0.03, w: 3 }, { k: 'speed', v: 0.03, w: 3 },
];

/** Box tier → rarity weights (Common..Legendary). */
const RARITY_WEIGHTS: Record<BoxTier, number[]> = {
  1: [70, 25, 5, 0, 0],
  2: [35, 45, 17, 3, 0],
  3: [5, 35, 45, 13, 2],
  4: [0, 10, 45, 37, 8],
  5: [0, 0, 20, 55, 25],
};

export function rarityFor(tier: BoxTier, rand: () => number): Rarity {
  const w = RARITY_WEIGHTS[tier];
  let r = rand() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < 5; i++) { r -= w[i]; if (r < 0) return (i + 1) as Rarity; }
  return 1;
}

function pick<T>(arr: T[], rand: () => number): T { return arr[Math.floor(rand() * arr.length) % arr.length]; }

const scaleV = (k: LineKind, v: number) => PCT.includes(k) ? Math.round(v * 100) / 100 : Math.max(1, Math.round(v));

/** Roll a piece of equipment. skillIds = every skill id in the game (for skill-boost lines). */
export function rollItem(id: number, tier: BoxTier, ilvl: number, rand: () => number, skillIds: string[]): Item {
  const rarity = rarityFor(tier, rand);
  const base = pick(Object.keys(BASES).filter(k => (BASES[k].minLv ?? 0) <= ilvl), rand);
  const lvlMul = 1 + 0.15 * (ilvl - 1);
  const rarMul = [1, 1.25, 1.55, 1.9, 2.4][rarity - 1];
  const lines: Line[] = BASES[base].main.map(l => ({ k: l.k, v: scaleV(l.k, l.v * (PCT.includes(l.k) || l.k === 'crit' ? rarMul : lvlMul * rarMul)) }));
  // rarity 1 → 0 extra lines … rarity 5 → 4 extra lines
  for (let i = 0; i < rarity - 1; i++) {
    const tot = EXTRA.reduce((a, e) => a + e.w, 0);
    let r = rand() * tot;
    const e = EXTRA.find(e => (r -= e.w) < 0) ?? EXTRA[0];
    const pct = PCT.includes(e.k) || e.k === 'crit';
    const v = scaleV(e.k, e.v * (pct ? 1 : lvlMul) * (0.8 + rand() * 0.6) * (1 + 0.15 * (rarity - 2)));
    const same = lines.find(l => l.k === e.k);
    if (same) same.v = scaleV(e.k, same.v + v); else lines.push({ k: e.k, v });
  }
  const it: Item = { id, base, rarity, ilvl, plus: 0, lines, grade: rollGrade(rand, rarity) };
  if (rarity === 5 && rand() < 0.3) it.skill = { id: 'all', n: 1 };
  else if (rarity >= 4 && rand() < 0.6) it.skill = { id: pick(skillIds, rand), n: rarity === 5 ? 2 : 1 };
  // set pieces (Rare+), from the set of the world this item level belongs to
  if (rarity >= 3 && rand() < 0.25) it.set = setForLevel(ilvl);
  // named legendaries
  if (rarity === 5 && rand() < 0.35) {
    const u = Object.keys(UNIQUES).filter(k => UNIQUES[k].slot === BASES[base].slot);
    if (u.length) it.unique = pick(u, rand);
  }
  return it;
}

export function itemName(it: Item): string {
  if (it.unique) return `${UNIQUES[it.unique].name}${it.plus ? ` +${it.plus}` : ''}`;
  const pre = PREFIX[it.rarity][it.id % PREFIX[it.rarity].length];
  return `${pre} ${BASES[it.base].name}${it.plus ? ` +${it.plus}` : ''}`;
}

export function gradeOf(it: Item): number { return it.grade ?? 1; }

/** Lines including grade and fortification. */
export function itemLines(it: Item): Line[] {
  const m = fortMul(it.plus) * GRADE_MUL[gradeOf(it)];
  return it.lines.map(l => ({ k: l.k, v: scaleV(l.k, l.v * m) }));
}

/** Crumbs (currency) from salvaging an item, and the cost of the next enhancement. */
export function salvageValue(it: Item): number { return Math.round((4 + it.ilvl) * [1, 2, 5, 12, 30][it.rarity - 1] * (1 + it.plus * 0.5) * GRADE_MUL[gradeOf(it)]); }

// ---------- grading ----------
/** Grades scale every stat line of an item. */
export const GRADES = ['D', 'C', 'B', 'A', 'S'];
export const GRADE_MUL = [0.85, 1, 1.12, 1.25, 1.4];
export const GRADE_CSS = ['#a89898', '#e0e0e0', '#7ee87e', '#7ac0ff', '#ffb02e'];
/** Grade odds when an item is found or re-graded; rarer items lean higher. */
export function gradeWeights(rarity: Rarity): number[] { return [30, 36, 22, 9, 3].map((w, i) => w * Math.pow(1 + 0.12 * (rarity - 1), i)); }
export function rollGrade(rand: () => number, rarity: Rarity, floor = 0): number {
  const w = gradeWeights(rarity).map((x, i) => (i < floor ? 0 : x));
  let r = rand() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < w.length; i++) { r -= w[i]; if (r < 0) return i; }
  return floor;
}

// ---------- fortification ----------
export const MAX_PLUS = 15;
/** Stat multiplier from fortification: +6% per level to +10, then +10% per level. */
export function fortMul(plus: number): number { return 1 + 0.06 * Math.min(plus, 10) + 0.1 * Math.max(0, plus - 10); }
/** Success chance of going from +plus to +plus+1. */
export function fortChance(plus: number): number { return [1, 1, 1, 1, 1, 0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.28, 0.22, 0.16, 0.1][plus] ?? 0; }
/** Failing from +7 or higher drops one level (a Safety Charm prevents it). */
export function fortRisky(plus: number): boolean { return plus >= 7; }
export function fortCost(it: Item): { crumbs: number; stones: number } {
  return { crumbs: Math.round((10 + it.ilvl * 2) * (1 + it.plus * 0.8) * [1, 1.3, 1.7, 2.2, 3][it.rarity - 1]), stones: 1 + Math.floor(it.plus / 5) };
}
/** kept for older callers */
export function enhanceCost(it: Item): number { return fortCost(it).crumbs; }

// ---------- sets ----------
export interface SetDef { name: string; world: number; two: string; three: string; b2: SetBonus; b3: SetBonus }
export interface SetBonus { atkPct?: number; hpPct?: number; critDmg?: number; speed?: number; skillDmg?: number; cdr?: number; dr?: number }
export const SETS: Record<string, SetDef> = {
  champ: { name: 'Countertop Champion', world: 1, two: '+8% attack', three: '+25% crit damage, +8% speed', b2: { atkPct: 0.08 }, b3: { critDmg: 0.25, speed: 0.08 } },
  frost: { name: 'Frostbite Guard', world: 2, two: '+12% max HP', three: '-15% damage taken, +10% skill damage', b2: { hpPct: 0.12 }, b3: { dr: 0.15, skillDmg: 0.1 } },
  inferno: { name: 'Inferno Chef', world: 3, two: '+10% skill damage', three: '-12% cooldowns, +12% attack', b2: { skillDmg: 0.1 }, b3: { cdr: 0.12, atkPct: 0.12 } },
};
export function setForLevel(ilvl: number): string { return ilvl >= 25 ? 'inferno' : ilvl >= 13 ? 'frost' : 'champ'; }

// ---------- named legendaries ----------
export interface UniqueDef { name: string; slot: Slot; effect: string }
export const UNIQUES: Record<string, UniqueDef> = {
  momspoon: { name: "Grandma's Spoon", slot: 'weapon', effect: 'Combo finishers heal 4% max HP' },
  excalifork: { name: 'Excalifork', slot: 'weapon', effect: 'Critical hits fire a bonus seed bolt' },
  frostfish: { name: 'Brain-Freeze Fish', slot: 'weapon', effect: 'Hits slow monsters by 40% for 2s' },
  phoenix: { name: 'Phoenix Apron', slot: 'armor', effect: 'Once per stage, survive a knockout at 1 HP' },
  thornlid: { name: 'Thornshell Lid', slot: 'armor', effect: 'Reflects 30% of damage taken back at the attacker' },
  lucky: { name: 'Lucky Fortune Cookie', slot: 'charm', effect: '+50% crumbs from monsters' },
  hourglass: { name: 'Egg-Timer Hourglass', slot: 'charm', effect: 'Each kill cuts skill cooldowns by 1s' },
};
