// Shared sim types. The sim is Phaser-free so it can be unit-tested and (later) run host-side online.

export interface Input {
  left: boolean; right: boolean; up: boolean; down: boolean;
  jump: boolean;   // held
  attack: boolean; // held
  skill: boolean;  // held
}
export const NO_INPUT: Input = { left: false, right: false, up: false, down: false, jump: false, attack: false, skill: false };

/** One-way platform: you can jump up through it and drop down with DOWN + JUMP. */
export interface Platform { x: number; y: number; w: number; solid?: boolean }
export interface Ladder { x: number; top: number; bottom: number }
export interface MobSpawn { kind: MobKind; x: number; y?: number }

export interface StageDef {
  id: string;
  name: string;
  width: number;
  groundY: number; // top of the ground slab
  platforms: Platform[];
  ladders: Ladder[];
  mobs: MobSpawn[];
  /** Respawn mobs this long after death (seconds); 0 = never. */
  respawn: number;
}

export type MobKind = 'bun';

export type BoxTier = 1 | 2 | 3 | 4 | 5;

export type SimEvent =
  | { t: 'hit'; x: number; y: number; dmg: number; crit: boolean; target: 'mob' | 'hero' }
  | { t: 'swing'; step: number }
  | { t: 'skill' }
  | { t: 'jump' }
  | { t: 'land' }
  | { t: 'mobDie'; x: number; y: number }
  | { t: 'drop'; id: number; tier: BoxTier; x: number; y: number }
  | { t: 'pickup'; id: number; tier: BoxTier }
  | { t: 'levelUp'; level: number };
