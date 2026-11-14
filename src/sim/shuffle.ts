// A seeded shuffle that is the same in every JavaScript engine.
// NEVER shuffle with `arr.sort(() => r() - 0.5)`: the order AND the number of RNG calls depend on the engine's sort
// algorithm (Node, Chrome/Edge, Firefox and Safari all differ), so everything generated afterwards differs too.

/** Fisher-Yates: shuffles `a` in place with exactly `max(0, a.length - 1)` calls of `r` (0 <= r() < 1) and returns it. */
export function shuffle<T>(a: T[], r: () => number): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.floor(r() * (i + 1)));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}
