// Shared sim types. The sim is Phaser-free so it can be unit-tested and (later) run host-side online.

export interface Input {
  left: boolean; right: boolean; up: boolean; down: boolean;
  jump: boolean;   // held
  attack: boolean; // held
  skill1: boolean; skill2: boolean; skill3: boolean; // held
}
export const NO_INPUT: Input = { left: false, right: false, up: false, down: false, jump: false, attack: false, skill1: false, skill2: false, skill3: false };

/** One-way platform: you can jump up through it and drop down with DOWN + JUMP. */
export interface Platform { x: number; y: number; w: number; solid?: boolean }
export interface Ladder { x: number; top: number; bottom: number }
export interface MobSpawn { kind: MobKind; x: number; y?: number; lv: number }

export interface StageDef {
  id: string;
  world: number;
  num: string;       // "1-1"
  name: string;
  bg: string;        // far background key
  width: number;
  groundY: number;   // top of the ground slab
  platforms: Platform[];
  ladders: Ladder[];
  mobs: MobSpawn[];
  /** monster level shown on the map */
  lv: [number, number];
  boss?: boolean;
  /** par time (s) for an S rank */
  par: number;
  /** level the hero should be (for the map hint) */
  rec: number;
}

export type MobKind = 'bun' | 'worm' | 'pepper' | 'egg' | 'toast';

export type BoxTier = 1 | 2 | 3 | 4 | 5;
export interface LootBox { tier: BoxTier; ilvl: number }

export type SimEvent =
  | { t: 'hit'; x: number; y: number; dmg: number; crit: boolean; target: 'mob' | 'hero' }
  | { t: 'swing'; step: number }
  | { t: 'skill'; slot: number; kind: string; id: string }
  | { t: 'jump' }
  | { t: 'land' }
  | { t: 'mobDie'; x: number; y: number; boss: boolean }
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
  | { t: 'down' };
