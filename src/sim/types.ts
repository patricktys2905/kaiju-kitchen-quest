// Shared sim types. The sim is Phaser-free so it can be unit-tested and (later) run host-side online.

export interface Input {
  left: boolean; right: boolean; up: boolean; down: boolean;
  jump: boolean;   // held
  attack: boolean; // held
  skill1: boolean; skill2: boolean; skill3: boolean; // held
  /** quick-bag slots 1-4 (held) */
  item1: boolean; item2: boolean; item3: boolean; item4: boolean;
  ult: boolean;
}
export const NO_INPUT: Input = { left: false, right: false, up: false, down: false, jump: false, attack: false, skill1: false, skill2: false, skill3: false, item1: false, item2: false, item3: false, item4: false, ult: false };

/** One-way platform: you can jump up through it and drop down with DOWN + JUMP. */
export interface Platform { x: number; y: number; w: number; solid?: boolean }
export interface Ladder { x: number; top: number; bottom: number }
export interface MobSpawn { kind: MobKind; x: number; y?: number; lv: number; elite?: boolean }
/** Stage hazard on the ground floor. burner = flame pillar, vent = steam launch, drop = falling can, ice = slippery.
 *  Timed hazards cycle: on for `on` s, off, then glow a warning for the last 0.9 s before the next burst. */
export type HazardKind = 'burner' | 'vent' | 'drop' | 'ice';
export interface Hazard { kind: HazardKind; x: number; w: number; period: number; on: number; offset: number; /** boss arenas: only after the boss enrages */ phase2?: boolean }
/** Optional "Spicy" challenges chosen before a stage (each adds loot). */
export type Spicy = 'nopots' | 'glass' | 'clock';

export interface StageDef {
  id: string;
  world: number;
  num: string;       // "1-1"
  name: string;
  bg: string;        // far background key
  mid: string;       // mid parallax layer key ('' = none)
  tile: string;      // ground tile key
  platTint: number;  // tint for the platform boards
  width: number;
  groundY: number;   // top of the ground slab
  platforms: Platform[];
  ladders: Ladder[];
  mobs: MobSpawn[];
  hazards?: Hazard[];
  /** monster level shown on the map */
  lv: [number, number];
  boss?: boolean;
  /** par time (s) for an S rank */
  par: number;
  /** level the hero should be (for the map hint) */
  rec: number;
}

export type MobKind = 'bun' | 'worm' | 'pepper' | 'egg' | 'toast' | 'pea' | 'yogurt' | 'icebat' | 'pickle' | 'golem'
  | 'popcorn' | 'imp' | 'bacon' | 'meatball' | 'dragon'
  | 'can' | 'cheerio' | 'minicheerio' | 'soda' | 'flour' | 'jar'
  | 'garlic' | 'ant' | 'mimic' | 'carrot' | 'milk' | 'jelly' | 'jellybit' | 'kettle' | 'sausage' | 'marsh' | 'noodle' | 'raisin' | 'cereal';

export type BoxTier = 1 | 2 | 3 | 4 | 5;
export interface LootBox { tier: BoxTier; ilvl: number }

export type SimEvent =
  | { t: 'hit'; x: number; y: number; dmg: number; crit: boolean; target: 'mob' | 'hero' }
  | { t: 'swing'; step: number }
  | { t: 'skill'; slot: number; kind: string; id: string }
  | { t: 'jump' }
  | { t: 'land' }
  | { t: 'mobDie'; x: number; y: number; boss: boolean; elite: boolean; kind: MobKind }
  | { t: 'xp'; n: number }
  | { t: 'drop'; id: number; tier: BoxTier; x: number; y: number }
  | { t: 'pickup'; id: number; tier: BoxTier }
  | { t: 'mobAttack'; id: number; kind: string }
  | { t: 'shock'; x: number; y: number; r: number }
  | { t: 'boom'; x: number; y: number }
  | { t: 'summon' }
  | { t: 'stagger' }
  | { t: 'portal' }
  | { t: 'clear' }
  | { t: 'down' }
  | { t: 'dodge' }
  | { t: 'use'; slot: number; id: import('./consumables').ConsumableId }
  | { t: 'revive' }
  | { t: 'crumbs'; n: number; x: number; y: number }
  | { t: 'stone'; n: number; x: number; y: number }
  | { t: 'ult'; name: string }
  | { t: 'block'; x: number; y: number }
  /** dodged through an attack at the last moment: slow-mo + a guaranteed crit counter */
  | { t: 'perfect'; x: number; y: number }
  /** hit a monster during its wind-up: its attack is cancelled */
  | { t: 'interrupt'; x: number; y: number }
  /** a guard-break smash broke a shield / armour */
  | { t: 'guardBreak'; x: number; y: number }
  /** a boss reached its second phase */
  | { t: 'enrage'; name: string }
  | { t: 'heal'; x: number; y: number; n: number }
  | { t: 'burrow'; x: number; y: number; up: boolean }
  | { t: 'mimic'; id: number }
  | { t: 'style'; rank: string }
  | { t: 'hazard'; i: number; on: boolean };
