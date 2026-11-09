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

export type RankLetter = 'S' | 'A' | 'B' | 'C' | 'D';
const RANK_BONUS: Record<RankLetter, number> = { S: 1, A: 0.5, B: 0, C: -0.5, D: -1 };

/** Odds level for a stage's clear boxes: the stage's monster level, your rank, and +1.5 on boss stages. */
export function clearLevel(stageLv: number, rank: RankLetter, boss: boolean): number {
  // tuned so the usual (rank A) reward climbs: Lv2 → Lunchbox, Lv7 → Bento, boss Lv10 → Golden Cloche
  // after World 1 the odds keep improving, but more slowly
  const lv = Math.min(stageLv - 1, 9) * 0.55 + Math.max(0, stageLv - 10) * 0.15;
  return Math.max(1, 3.5 + lv + RANK_BONUS[rank] + (boss ? 1.5 : 0));
}

/** How many boxes clearing a stage gives: more on higher-level stages. */
export function clearCount(stageLv: number): number { return Math.min(4, 1 + Math.floor((stageLv - 1) / 6)); }

/** Boxes for clearing a stage (higher stage level / better rank / boss → more and better boxes). */
export function clearRewards(stageLv: number, rank: RankLetter, boss: boolean, firstClear: boolean, rand: () => number): BoxTier[] {
  const lvl = clearLevel(stageLv, rank, boss);
  const min = boss ? 3 : rank === 'S' ? 2 : 1;
  const out: BoxTier[] = [];
  for (let i = 0; i < clearCount(stageLv); i++) out.push(Math.max(min, rollTier(lvl, rand)) as BoxTier);
  if (firstClear) out.push(Math.min(5, 2 + Math.floor(stageLv / 4) + (boss ? 1 : 0)) as BoxTier);
  return out;
}

/** The tier you'd most often get (for the stage map). */
export function likelyTier(stageLv: number, rank: RankLetter, boss: boolean): BoxTier {
  const w = tierWeights(clearLevel(stageLv, rank, boss));
  const t = (w.indexOf(Math.max(...w)) + 1) as BoxTier;
  return (boss ? Math.max(3, t) : t) as BoxTier;
}
