// Enemy definitions. w/h = body size in px (feet at y). knock scales knockback taken.
import type { MobKind } from './types';

export interface MobDef {
  name: string; hp: number; atk: number; speed: number;
  w: number; h: number; knock: number;
  aggro: number; range: number; windup: number; patrol: number;
  xp: number; dropChance: number; dropLevel: number;
}

export const MOBS: Record<MobKind, MobDef> = {
  bun: { name: 'Moldy Bun', hp: 60, atk: 8, speed: 60, w: 50, h: 46, knock: 1, aggro: 260, range: 60, windup: 0.55, patrol: 120, xp: 8, dropChance: 0.45, dropLevel: 1 },
};
