// Enemy definitions. w/h = body size in px (feet at y). Stats are for level 1; levels scale them.
// Elites (stage 5 mini-bosses) are a normal kind with ELITE multipliers.
import type { MobKind } from './types';

export type Brain = 'walker' | 'hopper' | 'ranged' | 'brute' | 'flyer' | 'bomber' | 'boss'
  /** heals hurt monsters nearby, keeps away from you */
  | 'healer'
  /** travels underground, pops up under you */
  | 'burrower'
  /** long telegraphed rush; stunned if it misses and hits a wall or runs out */
  | 'charger'
  /** aims a laser line, then a fast shot */
  | 'sniper'
  /** never moves; lobs steam over platforms */
  | 'turret'
  /** pretends to be a loot box until you come close */
  | 'mimic'
  /** keeps a few little ones around */
  | 'summoner';

export interface MobDef {
  name: string; brain: Brain; art: string;
  hp: number; atk: number; speed: number;
  w: number; h: number; knock: number;
  aggro: number; range: number; windup: number; patrol: number;
  xp: number; dropChance: number;
  /** super armour: only finishers / skills make it flinch (boss: stagger meter) */
  armor?: boolean;
  /** boss attack patterns */
  moves?: string[];
  /** blocks 75% of damage from the front until a finisher or skill breaks its guard */
  shield?: boolean;
  /** splits into two of these when it dies */
  split?: MobKind;
  /** drawn smaller than its art (splitter children) */
  scale?: number;
  /** summoner: what it calls */
  calls?: MobKind;
}

export const MOBS: Record<MobKind, MobDef> = {
  // World 1: The Countertop
  bun: { name: 'Moldy Bun', brain: 'walker', art: 'mob-bun', hp: 60, atk: 8, speed: 60, w: 50, h: 46, knock: 1, aggro: 260, range: 60, windup: 0.55, patrol: 120, xp: 8, dropChance: 0.3 },
  worm: { name: 'Sour Worm', brain: 'hopper', art: 'mob-worm', hp: 50, atk: 10, speed: 80, w: 44, h: 44, knock: 1.1, aggro: 300, range: 190, windup: 0.45, patrol: 140, xp: 10, dropChance: 0.3 },
  pepper: { name: 'Pepper Grunt', brain: 'ranged', art: 'mob-pepper', hp: 55, atk: 9, speed: 70, w: 40, h: 58, knock: 1, aggro: 340, range: 300, windup: 0.6, patrol: 100, xp: 11, dropChance: 0.35 },
  egg: { name: 'Rotten Egg', brain: 'brute', art: 'mob-egg', hp: 200, atk: 16, speed: 45, w: 70, h: 78, knock: 0.5, aggro: 260, range: 80, windup: 0.9, patrol: 90, xp: 30, dropChance: 0.6, armor: true },
  toast: { name: 'Burnt Toast King', brain: 'boss', art: 'boss-toast', hp: 1250, atk: 16, speed: 90, w: 120, h: 170, knock: 0.25, aggro: 2000, range: 140, windup: 0.7, patrol: 0, xp: 300, dropChance: 1, armor: true, moves: ['charge', 'leap', 'slash'] },
  // World 2: The Fridge
  pea: { name: 'Frost Pea', brain: 'ranged', art: 'mob-pea', hp: 50, atk: 9, speed: 65, w: 44, h: 50, knock: 1, aggro: 360, range: 320, windup: 0.5, patrol: 100, xp: 10, dropChance: 0.3 },
  yogurt: { name: 'Yogurt Slime', brain: 'walker', art: 'mob-yogurt', hp: 85, atk: 9, speed: 55, w: 56, h: 50, knock: 0.9, aggro: 260, range: 64, windup: 0.6, patrol: 120, xp: 10, dropChance: 0.3 },
  icebat: { name: 'Brain-Freeze Bat', brain: 'flyer', art: 'mob-icebat', hp: 45, atk: 10, speed: 120, w: 46, h: 40, knock: 1.2, aggro: 340, range: 220, windup: 0.5, patrol: 160, xp: 12, dropChance: 0.3 },
  pickle: { name: 'Pickle Knight', brain: 'brute', art: 'mob-pickle', hp: 190, atk: 15, speed: 55, w: 50, h: 82, knock: 0.5, aggro: 280, range: 90, windup: 0.75, patrol: 90, xp: 28, dropChance: 0.55, armor: true },
  // World 3: The Oven
  popcorn: { name: 'Popcorn Popper', brain: 'hopper', art: 'mob-popcorn', hp: 45, atk: 11, speed: 90, w: 42, h: 42, knock: 1.2, aggro: 320, range: 210, windup: 0.35, patrol: 150, xp: 11, dropChance: 0.3 },
  imp: { name: 'Hot Sauce Imp', brain: 'ranged', art: 'mob-imp', hp: 55, atk: 10, speed: 75, w: 40, h: 56, knock: 1, aggro: 380, range: 330, windup: 0.5, patrol: 110, xp: 12, dropChance: 0.35 },
  bacon: { name: 'Sizzle Bacon', brain: 'walker', art: 'mob-bacon', hp: 70, atk: 10, speed: 110, w: 60, h: 40, knock: 1, aggro: 300, range: 70, windup: 0.4, patrol: 160, xp: 11, dropChance: 0.3 },
  meatball: { name: 'Meatball Brute', brain: 'brute', art: 'mob-meatball', hp: 210, atk: 16, speed: 50, w: 72, h: 76, knock: 0.45, aggro: 280, range: 90, windup: 0.8, patrol: 90, xp: 30, dropChance: 0.6, armor: true },
  dragon: { name: 'Grease Dragon', brain: 'boss', art: 'boss-dragon', hp: 1800, atk: 19, speed: 95, w: 150, h: 170, knock: 0.2, aggro: 2000, range: 160, windup: 0.75, patrol: 0, xp: 340, dropChance: 1, armor: true, moves: ['slash', 'leap', 'breath', 'charge', 'rain'] },
  // World 4: The Pantry
  can: { name: 'Can Crusher', brain: 'walker', art: 'mob-can', hp: 110, atk: 12, speed: 55, w: 52, h: 60, knock: 0.6, aggro: 280, range: 70, windup: 0.6, patrol: 100, xp: 18, dropChance: 0.4, shield: true },
  cheerio: { name: 'Cheerio Blob', brain: 'walker', art: 'mob-cheerio', hp: 90, atk: 11, speed: 70, w: 58, h: 52, knock: 0.9, aggro: 280, range: 66, windup: 0.5, patrol: 130, xp: 14, dropChance: 0.3, split: 'minicheerio' },
  minicheerio: { name: 'Cheerio Bit', brain: 'hopper', art: 'mob-cheerio', hp: 28, atk: 7, speed: 100, w: 30, h: 28, knock: 1.3, aggro: 320, range: 180, windup: 0.3, patrol: 120, xp: 4, dropChance: 0.08, scale: 0.55 },
  soda: { name: 'Baking Soda Bomb', brain: 'bomber', art: 'mob-soda', hp: 40, atk: 22, speed: 150, w: 40, h: 46, knock: 1.2, aggro: 340, range: 60, windup: 0.7, patrol: 140, xp: 12, dropChance: 0.25 },
  flour: { name: 'Flour Ghost', brain: 'flyer', art: 'mob-flour', hp: 55, atk: 11, speed: 110, w: 46, h: 50, knock: 1.1, aggro: 340, range: 230, windup: 0.5, patrol: 160, xp: 13, dropChance: 0.3 },
  jar: { name: 'Cookie Jar Mimic', brain: 'boss', art: 'boss-jar', hp: 1650, atk: 19, speed: 85, w: 130, h: 170, knock: 0.2, aggro: 2000, range: 150, windup: 0.75, patrol: 0, xp: 360, dropChance: 1, armor: true, moves: ['slash', 'leap', 'rain', 'charge'] },
  // ---- new monsters, 3 per world ----
  garlic: { name: 'Garlic Cleric', brain: 'healer', art: 'mob-garlic', hp: 55, atk: 7, speed: 60, w: 44, h: 56, knock: 1, aggro: 320, range: 260, windup: 0.9, patrol: 100, xp: 14, dropChance: 0.4 },
  ant: { name: 'Sugar Ant Digger', brain: 'burrower', art: 'mob-ant', hp: 60, atk: 11, speed: 95, w: 50, h: 42, knock: 1, aggro: 340, range: 40, windup: 0.6, patrol: 120, xp: 13, dropChance: 0.3 },
  mimic: { name: 'Lunchbox Mimic', brain: 'mimic', art: 'mob-mimic', hp: 130, atk: 13, speed: 105, w: 58, h: 54, knock: 0.7, aggro: 300, range: 72, windup: 0.4, patrol: 0, xp: 30, dropChance: 1 },
  carrot: { name: 'Carrot Sniper', brain: 'sniper', art: 'mob-carrot', hp: 45, atk: 14, speed: 55, w: 36, h: 64, knock: 1.1, aggro: 560, range: 540, windup: 1.1, patrol: 80, xp: 14, dropChance: 0.35 },
  milk: { name: 'Milk Carton Rammer', brain: 'charger', art: 'mob-milk', hp: 110, atk: 14, speed: 60, w: 64, h: 62, knock: 0.6, aggro: 380, range: 360, windup: 0.8, patrol: 100, xp: 18, dropChance: 0.4 },
  jelly: { name: 'Jelly Mother', brain: 'summoner', art: 'mob-jelly', hp: 140, atk: 9, speed: 40, w: 70, h: 66, knock: 0.6, aggro: 340, range: 320, windup: 1.0, patrol: 80, xp: 22, dropChance: 0.5, calls: 'jellybit' },
  jellybit: { name: 'Jelly Baby', brain: 'hopper', art: 'mob-jelly', hp: 24, atk: 7, speed: 100, w: 28, h: 26, knock: 1.3, aggro: 340, range: 180, windup: 0.35, patrol: 120, xp: 3, dropChance: 0.04, scale: 0.45 },
  kettle: { name: 'Kettle Turret', brain: 'turret', art: 'mob-kettle', hp: 80, atk: 8, speed: 0, w: 54, h: 52, knock: 0, aggro: 400, range: 400, windup: 0.9, patrol: 0, xp: 16, dropChance: 0.4 },
  sausage: { name: 'Sausage Ram', brain: 'charger', art: 'mob-sausage', hp: 120, atk: 15, speed: 70, w: 64, h: 46, knock: 0.6, aggro: 400, range: 380, windup: 0.7, patrol: 110, xp: 18, dropChance: 0.4 },
  marsh: { name: 'Marshmallow Medic', brain: 'healer', art: 'mob-marsh', hp: 70, atk: 9, speed: 65, w: 48, h: 60, knock: 1, aggro: 320, range: 260, windup: 0.8, patrol: 100, xp: 16, dropChance: 0.4 },
  noodle: { name: 'Noodle Lurker', brain: 'burrower', art: 'mob-noodle', hp: 90, atk: 13, speed: 100, w: 56, h: 50, knock: 0.9, aggro: 360, range: 40, windup: 0.55, patrol: 120, xp: 18, dropChance: 0.35 },
  raisin: { name: 'Raisin Sniper', brain: 'sniper', art: 'mob-raisin', hp: 60, atk: 16, speed: 60, w: 38, h: 46, knock: 1.1, aggro: 580, range: 560, windup: 1.0, patrol: 80, xp: 18, dropChance: 0.35 },
  cereal: { name: 'Cereal Box Mimic', brain: 'mimic', art: 'mob-cereal', hp: 165, atk: 16, speed: 110, w: 60, h: 70, knock: 0.7, aggro: 300, range: 74, windup: 0.4, patrol: 0, xp: 34, dropChance: 1 },
  golem: { name: 'Freezer Golem', brain: 'boss', art: 'boss-golem', hp: 1700, atk: 18, speed: 80, w: 130, h: 180, knock: 0.2, aggro: 2000, range: 150, windup: 0.75, patrol: 0, xp: 320, dropChance: 1, armor: true, moves: ['slash', 'leap', 'rain', 'charge'] },
};

/** Stage-5 mini-boss multipliers. */
export const ELITE = { hp: 4, atk: 1.2, xp: 5, scale: 1.45 };

/** Elite modifiers: every elite rolls one (two in Hard mode). The name gets the prefix. */
export type EliteMod = 'spiky' | 'hasty' | 'vampiric' | 'shielded' | 'moldy' | 'splitting';
export const ELITE_MODS: Record<EliteMod, { name: string; desc: string; color: string }> = {
  spiky: { name: 'Spiky', desc: 'Hitting it with plain attacks pricks you', color: '#ff7a3a' },
  hasty: { name: 'Hasty', desc: 'Moves and winds up much faster', color: '#ffe14a' },
  vampiric: { name: 'Vampiric', desc: 'Heals when it hits you', color: '#e0306a' },
  shielded: { name: 'Shielded', desc: 'Guards from the front: use a Guard Break or a skill', color: '#7ab8ff' },
  moldy: { name: 'Moldy', desc: 'Leaves slowing mould puddles', color: '#7ad04a' },
  splitting: { name: 'Splitting', desc: 'Splits into two smaller copies', color: '#c87aff' },
};
/** Attacks that glow red: they can't be interrupted, only dodged. */
export const DANGER_MOVES = new Set(['charge', 'leap', 'rush', 'brute']);

/** Global difficulty knobs (tuned with scripts/balance.ts). */
export const TUNE = { hp: 2.5, atk: 1.8, bossHp: 1.15, bossAtk: 0.6, windup: 0.85 };
export function mobHp(kind: MobKind, lv: number): number { return Math.round(MOBS[kind].hp * TUNE.hp * (MOBS[kind].brain === 'boss' ? TUNE.bossHp : 1) * (1 + 0.32 * (lv - 1))); }
export function mobAtk(kind: MobKind, lv: number): number { return Math.round(MOBS[kind].atk * TUNE.atk * (1 + 0.2 * (lv - 1))); }
export function mobXp(kind: MobKind, lv: number): number { return Math.round(MOBS[kind].xp * (1 + 0.3 * (lv - 1))); }
/** Box odds level for a monster level (see loot.ts) */
export function dropLevel(lv: number): number { return 1 + (lv - 1) / 4; }
/** Crumbs a monster drops. */
export function mobCrumbs(lv: number, brain: Brain): number { return Math.round((2 + lv * 0.8) * (brain === 'boss' ? 25 : brain === 'brute' ? 3 : 1)); }
