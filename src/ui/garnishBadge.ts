// How a drop icon is fitted into the Garnish badge (a small disc with a ring, by a kaiju's name). Pure maths, shared by
// the HTML badges (src/hud.ts, src/ui/garnish.ts, the lobby) and the Phaser name tags (GameScene), and by the review
// sheet (scripts/garnish-sheet.ts). The icon is fitted to its real SHAPE (src/ui/garnishBounds.ts, measured by scripts/garnish-bounds.mjs
// from the badge sprite it derives from the drop art: the main body only), not to its square image:
//   - a compact shape is centred on its own centre and scaled until 90% of it lies inside the disc (the ring may clip
//     the last corners), so nothing is "small in its square" any more;
//   - a slender shape (fork, straw, noodle, spoon, stinger...) lies along the disc's diagonal and is drawn LONGER than
//     the disc, its two tips clipped by the ring, so that its stroke is thick enough to see at 18 px;
//   - BADGE_TWEAK holds the few per-icon corrections made by eye from the sheet.
import { GARNISH_BOUNDS } from './garnishBounds';

/** The disc's colours: a light grey-lilac that both dark and pale icons read on, a thin dark edge outside the ring, and
 *  the dark line drawn round the icon's own shape so pale ones separate from the disc. */
export const BADGE_DISC = '#968ab4', BADGE_EDGE = '#1a1020', BADGE_WHITE = '#ffffff', BADGE_GOLD = '#ffc83c';
/** A shape counts as slender when it is this much longer than its own average stroke is thick (length² / area) and at
 *  least SLENDER_LONG times longer than it is wide. */
const SLENDER = 3, SLENDER_LONG = 1.5;
/** A slender shape is drawn this many disc diameters long (its tips go under the ring). */
const SLENDER_LEN = 1.4;
/** A compact shape: the radius holding 90% of it becomes this share of the disc's radius. */
const COMPACT_FILL = 0.97;

/** By eye, from shots/garnish/badges-4x.png: scale = a multiplier on the fitted size, rot = extra degrees, dx / dy = a
 *  nudge in disc diameters, slender = force the long-and-clipped fit on or off. */
export const BADGE_TWEAK: Record<string, { scale?: number; rot?: number; dx?: number; dy?: number; slender?: boolean }> = {
  // a wrapped sweet: with its twisted ends clipped it is just a white blob
  flour: { slender: false },
  // spoons: the bowl is the part that reads, so it comes nearer the middle and the handle runs off under the ring
  pudding: { dx: 0.1, dy: -0.1 }, ladle: { slender: false, scale: 1.2, dx: 0.1, dy: -0.12 },
};

export interface BadgeFit {
  /** disc diameters per image pixel */ k: number;
  /** the image's size, and the point of it that sits on the disc's centre (image px) */ w: number; h: number; cx: number; cy: number;
  /** rotation about that point, degrees clockwise */ rot: number;
  /** nudge of that point from the disc's centre, in disc diameters */ dx: number; dy: number;
  slender: boolean;
}

/** The fit for one drop kind. `maxLen` caps how long a slender shape may be drawn, in disc diameters (the Phaser name
 *  tags cannot clip to the ring, so they keep the tips just inside it). */
export function badgeFit(kind: string, maxLen = SLENDER_LEN): BadgeFit {
  const b = GARNISH_BOUNDS[kind], t = BADGE_TWEAK[kind] ?? {};
  // an icon nobody measured: its whole image inside the disc, as before
  if (!b) return { k: 0.84 / 64, w: 64, h: 64, cx: 32, cy: 32, rot: t.rot ?? 0, dx: t.dx ?? 0, dy: t.dy ?? 0, slender: false };
  const [w, h, cx, cy, ang, len, thick, area, r90] = b;
  const compact = COMPACT_FILL * 0.5 / Math.max(1, r90);
  const slender = t.slender ?? (len * len / Math.max(1, area) > SLENDER && len / Math.max(1, thick) > SLENDER_LONG);
  let k = compact, rot = 0;
  if (slender) {
    k = Math.max(compact, Math.min(SLENDER_LEN, maxLen) / len);
    // onto the nearer diagonal, unless it already lies near one
    const a = ((ang % 180) + 180) % 180, target = a < 90 ? 45 : 135, off = target - a;
    if (Math.abs(off) > 15) rot = off;
  }
  return { k: k * (t.scale ?? 1), w, h, cx, cy, rot: rot + (t.rot ?? 0), dx: t.dx ?? 0, dy: t.dy ?? 0, slender };
}

const pc = (v: number): string => `${(v * 100).toFixed(1)}%`;
/** Inline CSS for the badge's <img> (absolutely placed inside the disc, which clips it): size, place, tilt. */
export function badgeImgStyle(kind: string): string {
  const f = badgeFit(kind);
  return `width:${pc(f.k * f.w)};height:${pc(f.k * f.h)};left:${pc(0.5 + f.dx - f.k * f.cx)};top:${pc(0.5 + f.dy - f.k * f.cy)};transform-origin:${pc(f.cx / f.w)} ${pc(f.cy / f.h)};transform:rotate(${f.rot.toFixed(0)}deg)`;
}
/** The dark line round the icon's shape, as an SVG filter (one hidden <svg> per page; ensureBadgeFilter adds it). It
 *  draws a thin dark line round the sprite (the badge sprites are already clean: scripts/garnish-bounds.mjs keeps the
 *  drop's main body only, so there is no haze or spark left to outline). */
export const BADGE_FILTER_SVG = `<svg id="gnline-svg" width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="gnline" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feMorphology in="SourceAlpha" operator="dilate" radius="0.7" result="fat"/><feFlood flood-color="${BADGE_EDGE}"/><feComposite in2="fat" operator="in" result="line"/><feMerge><feMergeNode in="line"/><feMergeNode in="SourceGraphic"/></feMerge></filter></svg>`;
/** Put the filter into the page once (every place that draws an HTML badge calls this). */
export function ensureBadgeFilter(): void {
  if (typeof document === 'undefined' || document.getElementById('gnline-svg')) return;
  document.body.insertAdjacentHTML('beforeend', BADGE_FILTER_SVG);
}
/** 'drop-ant' → 'ant' (the badge is keyed by drop kind; looks carry the art key). */
export const badgeKind = (icon: string): string => icon.replace(/^(drop|gb)-/, '');
/** The badge's own sprite for a drop kind: its main body only, sparks and puddles removed (public/art/gb-<kind>.webp,
 *  derived from the drop icon by scripts/garnish-bounds.mjs). */
export const badgeArt = (kind: string): string => `gb-${badgeKind(kind)}`;

/** The badge's CSS, shared by every HTML place it shows (`sel` = the disc's selector, `size` = its CSS size). The icon
 *  gets a thin dark line round its own shape (a stack of drop-shadows) and is clipped by the disc. */
export function badgeCss(sel: string, size: string, ring: string): string {
  const line = 'url(#gnline)';
  return `${sel} { position: relative; overflow: hidden; width: ${size}; height: ${size}; border-radius: 50%; background: ${BADGE_DISC}; box-shadow: 0 0 0 ${ring} ${BADGE_WHITE}, 0 0 0 calc(${ring} + 1px) ${BADGE_EDGE}; flex-shrink: 0; line-height: 0; }
${sel}.gold { box-shadow: 0 0 0 ${ring} ${BADGE_GOLD}, 0 0 0 calc(${ring} + 1px) ${BADGE_EDGE}, 0 0 0.4em 1px #ffd23c; }
${sel} > img { position: absolute !important; display: block; max-width: none !important; max-height: none !important; margin: 0 !important; object-fit: fill; filter: ${line} !important; }
`;
}
