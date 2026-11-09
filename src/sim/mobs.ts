// Enemy definitions. w/h = body size in px (feet at y). Stats are for level 1; levels scale them.
import type { MobKind } from './types';

export type Brain = 'walker' | 'hopper' | 'ranged' | 'brute' | 'boss';

export interface MobDef {
  name: string; brain: Brain; art: string;
  hp: number; atk: number; speed: number;
  w: number; h: number; knock: number;
  aggro: number; range: number; windup: number; patrol: number;
  xp: number; dropChance: number;
  /** super armour: only finishers / skills make it flinch (boss: stagger meter) */
  armor?: boolean;
}

export const MOBS: Record<MobKind, MobDef> = {
  bun: { name: 'Moldy Bun', brain: 'walker', art: 'mob-bun', hp: 60, atk: 8, speed: 60, w: 50, h: 46, knock: 1, aggro: 260, range: 60, windup: 0.55, patrol: 120, xp: 8, dropChance: 0.35 },
  worm: { name: 'Sour Worm', brain: 'hopper', art: 'mob-worm', hp: 50, atk: 10, speed: 80, w: 44, h: 44, knock: 1.1, aggro: 300, range: 190, windup: 0.45, patrol: 140, xp: 10, dropChance: 0.35 },
  pepper: { name: 'Pepper Grunt', brain: 'ranged', art: 'mob-pepper', hp: 55, atk: 9, speed: 70, w: 40, h: 58, knock: 1, aggro: 340, range: 300, windup: 0.6, patrol: 100, xp: 11, dropChance: 0.4 },
  egg: { name: 'Rotten Egg', brain: 'brute', art: 'mob-egg', hp: 200, atk: 16, speed: 45, w: 70, h: 78, knock: 0.5, aggro: 260, range: 80, windup: 0.9, patrol: 90, xp: 30, dropChance: 0.7, armor: true },
  toast: { name: 'Burnt Toast King', brain: 'boss', art: 'boss-toast', hp: 1600, atk: 20, speed: 90, w: 120, h: 170, knock: 0.25, aggro: 2000, range: 140, windup: 0.7, patrol: 0, xp: 300, dropChance: 1, armor: true },
};

export function mobHp(kind: MobKind, lv: number): number { return Math.round(MOBS[kind].hp * (1 + 0.32 * (lv - 1))); }
export function mobAtk(kind: MobKind, lv: number): number { return Math.round(MOBS[kind].atk * (1 + 0.2 * (lv - 1))); }
export function mobXp(kind: MobKind, lv: number): number { return Math.round(MOBS[kind].xp * (1 + 0.3 * (lv - 1))); }
/** Box odds level for a monster level (see loot.ts) */
export function dropLevel(lv: number): number { return 1 + (lv - 1) / 4; }
