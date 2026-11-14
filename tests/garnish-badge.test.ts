// The Garnish badge fits each drop icon to its real shape, measured from the art into src/ui/garnishBounds.ts by
// scripts/garnish-bounds.mjs. A drop without a badge sprite (public/art/gb-<kind>.webp) or an entry would fall back to a small whole-image fit, so a new world's
// drops must not be forgotten: add the art, run `node scripts/garnish-bounds.mjs`.
import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DROPS } from '../src/sim/drops';
import { GARNISH_BOUNDS } from '../src/ui/garnishBounds';
import { BADGE_TWEAK, badgeFit, badgeImgStyle } from '../src/ui/garnishBadge';

describe('garnish badge', () => {
  it('every drop has measured bounds (run node scripts/garnish-bounds.mjs after adding drop art)', () => {
    expect(Object.keys(DROPS).filter(k => !GARNISH_BOUNDS[k])).toEqual([]);
  });
  it('the bounds match the art on disk', () => {
    const stale = Object.keys(DROPS).filter(k => { const b = GARNISH_BOUNDS[k]; return !b || !fs.existsSync(`public/art/drop-${k}.webp`) || !fs.existsSync(`public/art/gb-${k}.webp`) || Math.max(b[0], b[1]) !== 64 || b[2] > b[0] || b[3] > b[1] || b[5] < 1 || b[7] < 1 || b[8] < 1; });
    expect(stale).toEqual([]);
  });
  it('every drop gets a sane fit: the shape fills the disc, centred, and only slender ones run past the ring', () => {
    const bad: string[] = [];
    for (const k of Object.keys(DROPS)) {
      const f = badgeFit(k), b = GARNISH_BOUNDS[k], len = f.k * b[5], r90 = f.k * b[8];
      if (![f.k, f.cx, f.cy, f.rot, f.dx, f.dy].every(Number.isFinite)) bad.push(`${k}: not a number`);
      // 90% of the shape within the disc for compact ones (a tweak may push it a little); never tiny
      if (r90 < 0.36) bad.push(`${k}: small in the disc (${r90.toFixed(2)} of its diameter)`);
      if (!f.slender && r90 > 0.68) bad.push(`${k}: too big for the disc`);
      if (f.slender && (len < 1.15 || len > 1.5)) bad.push(`${k}: slender but ${len.toFixed(2)} discs long`);
      if (Math.abs(f.dx) > 0.3 || Math.abs(f.dy) > 0.3) bad.push(`${k}: nudged off the disc`);
      if (!/^width:[\d.]+%;height:[\d.]+%;left:-?[\d.]+%;top:-?[\d.]+%;/.test(badgeImgStyle(k))) bad.push(`${k}: bad style`);
    }
    expect(bad).toEqual([]);
  });
  it('the Phaser name tags keep slender shapes inside the ring', () => {
    for (const k of Object.keys(DROPS)) { const f = badgeFit(k, 1); if (f.slender && !BADGE_TWEAK[k]?.scale) expect(f.k * GARNISH_BOUNDS[k][5], k).toBeLessThanOrEqual(Math.max(1.001, 0.97 * GARNISH_BOUNDS[k][5] / (2 * GARNISH_BOUNDS[k][8]) + 0.001)); }
  });
  it('tweaks name real drops', () => {
    expect(Object.keys(BADGE_TWEAK).filter(k => !Object.prototype.hasOwnProperty.call(DROPS, k))).toEqual([]);
  });
});

describe('garnish badge sprites', () => {
  it('every drop has its badge sprite, and the art manifest lists it (run node scripts/garnish-bounds.mjs)', () => {
    const manifest = new Set<string>(JSON.parse(fs.readFileSync('public/art/manifest.json', 'utf8')));
    expect(Object.keys(DROPS).filter(k => !fs.existsSync(`public/art/gb-${k}.webp`) || !manifest.has(`gb-${k}`))).toEqual([]);
  });
});
