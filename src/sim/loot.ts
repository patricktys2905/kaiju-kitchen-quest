// Box tiers: Paper Bag (1) → Lunchbox → Bento → Golden Cloche → Rainbow Cake Box (5).
// Higher dropLevel (tougher mobs, harder stages, better rank) shifts the odds up.
import type { BoxTier } from './types';

export const TIER_NAMES: Record<BoxTier, string> = { 1: 'Paper Bag', 2: 'Lunchbox', 3: 'Bento', 4: 'Golden Cloche', 5: 'Rainbow Cake Box' };
export const TIER_COLORS: Record<BoxTier, number> = { 1: 0xc8a27a, 2: 0x6ed36e, 3: 0x4fa8ff, 4: 0xffc83c, 5: 0xff6ef0 };

/** Base weights per tier at dropLevel 1. */
const BASE = [600, 280, 90, 25, 5];

export function tierWeights(level: number): number[] {
  // each level above 1 moves weight from the lower tiers up
  return BASE.map((w, i) => w * Math.pow(1 + 0.35 * (level - 1), i));
}

export function rollTier(level: number, rand: () => number): BoxTier {
  const w = tierWeights(level);
  let r = rand() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < w.length; i++) { r -= w[i]; if (r < 0) return (i + 1) as BoxTier; }
  return 1;
}
