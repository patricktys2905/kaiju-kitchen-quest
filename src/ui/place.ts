// Where things go on the screen: pure arithmetic (no DOM), so it can be tested. Used by the story player (paintings)
// and the stage HUD (the Wheel of Misfortune).

/** Where a 16:9 painting goes on a w×h screen whose dialogue box starts `sb` px above the bottom: [width, height, top].
 *  It stands on the box's top edge (tucked 1.5vmin behind it) and is as large as fits above it, giving up at most a
 *  3vmin strip of sky off the top of the screen: so the ground, where the scene happens, is always in view. */
export function stillRect(w: number, h: number, sb: number, vmin: number): [number, number, number] {
  const bottom = h - sb + 1.5 * vmin;
  const ph = Math.max(0, Math.min(bottom + 3 * vmin, w * 9 / 16));
  return [ph * 16 / 9, ph, bottom - ph];
}


/** Where the wheel's centre may be, in screen px [left, top, right, bottom]: below the boss bar, clear of the hero card
 *  and style meter on the left and of the combo counter and touch buttons on the right, with room under it for its
 *  name plate. */
export function wheelSafe(w: number, h: number): [number, number, number, number] {
  const v = Math.min(w, h) / 100;
  return [38 * v, 29 * v, w - 50 * v, Math.max(29 * v, h * 0.62 - 17 * v)];
}
/** Wheel centre for a boss whose head top is at (bx, by) on screen and who is `half` px wide either side: beside his
 *  head on `side` (the far side from the player), on the other side if that is off the safe area, then held inside
 *  it. `far`: it had to move well away from him, so a dotted pointer joins the two. */
export function wheelSpot(bx: number, by: number, half: number, side: 1 | -1, w: number, h: number): { x: number; y: number; far: boolean } {
  const v = Math.min(w, h) / 100, r = 8 * v, [l, t, rt, b] = wheelSafe(w, h);
  const at = (sd: number) => bx + sd * (half + r + 2 * v);
  let x = at(side); if (x < l || x > rt) { const o = at(-side); if (o >= l && o <= rt) x = o; }
  const wantY = by + r;
  const cx = Math.max(l, Math.min(rt, x)), cy = Math.max(t, Math.min(b, wantY));
  return { x: cx, y: cy, far: Math.hypot(cx - x, cy - wantY) > 2.5 * r };
}
