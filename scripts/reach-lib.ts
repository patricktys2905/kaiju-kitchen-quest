// Boss-room reachability with the real hero physics (no skills: walking, jumping, ladders only).
// Used by tests/room-reach.test.ts and scripts/room-reach.ts.
import { derive, newProfile } from '../src/sim/stats';
import { type Ladder, NO_INPUT, type Platform, type StageDef } from '../src/sim/types';
import { World } from '../src/sim/world';

export interface Room { x0: number; x1: number; groundY: number; platforms: Platform[]; ladders: Ladder[] }

/** The boss room of a map stage (or the whole stage when it has no maps: the bare boss rooms of Boss Rush / Endless). */
export function roomOf(st: StageDef): Room {
  const m = st.maps?.[st.maps.length - 1], x0 = m ? m.x0 : 0, x1 = m ? m.x1 : st.width;
  return {
    x0, x1, groundY: st.groundY,
    platforms: st.platforms.filter(p => p.x + p.w > x0 && p.x < x1).map(p => ({ ...p, x: p.x - x0 })),
    ladders: st.ladders.filter(l => l.x > x0 && l.x < x1).map(l => ({ ...l, x: l.x - x0 })),
  };
}
/** Rooms with the same floors and ladders share a key (every story stage uses the same room, so it is simulated once). */
export const roomKey = (r: Room): string => JSON.stringify([r.x1 - r.x0, r.groundY, r.platforms, r.ladders]);

/** An empty stage holding just the room, and a level-1 hero with no gear (the slowest that kaiju can be). */
function world(r: Room, species: number): World {
  const st: StageDef = {
    id: 'reach', world: 1, num: 'reach', name: 'reach', bg: 'bg-far', mid: '', tile: 'tile-ground', platTint: 0xffffff, width: r.x1 - r.x0, groundY: r.groundY,
    lv: [1, 1], par: 999, rec: 1, platforms: r.platforms.map(p => ({ ...p })), ladders: r.ladders.map(l => ({ ...l })), mobs: [],
  };
  return new World(st, derive(newProfile(species)), 1);
}
function stand(w: World, x: number, y: number): void {
  const h = w.hero; h.x = x; h.y = y - 1; h.vx = 0; h.vy = 0; h.ground = false; h.on = null;
  for (let i = 0; i < 4; i++) w.step({ ...NO_INPUT });
}
const onFloor = (w: World, y: number) => w.hero.ground && Math.abs(w.hero.y - y) < 0.5;

/** Climbs the ladder from its foot: true when the hero ends up standing on the floor at its top. */
export function climbs(r: Room, species: number, l: Ladder): boolean {
  const w = world(r, species);
  stand(w, l.x, l.bottom);
  if (!onFloor(w, l.bottom)) return false;
  for (let i = 0; i < 60 * 6; i++) { w.step({ ...NO_INPUT, up: true }); if (onFloor(w, l.top) && w.hero.state === 'move') break; }
  for (let i = 0; i < 10; i++) w.step({ ...NO_INPUT }); // and stays there
  return onFloor(w, l.top);
}

/** How forgiving the jump from floor `from` (a platform, or the ground when null) up onto platform `to` is: the most
 *  frames in a row at which pressing (and holding) jump during a run-up lands on it. 0 = it can't be done at all;
 *  1-2 = only with a frame-perfect press at the very edge. */
export function jumpWindow(r: Room, species: number, from: Platform | null, to: Platform): number {
  const fy = from ? from.y : r.groundY, f0 = from ? from.x : 20, f1 = from ? from.x + from.w : r.x1 - r.x0 - 20;
  if (fy <= to.y || fy - to.y > 140) return 0;
  // run-ups: from 160 px back toward the target's near edge (both sides), and standing right under it
  const runs: { x: number; dir: -1 | 0 | 1 }[] = [];
  const clampX = (x: number) => Math.max(f0 + 2, Math.min(f1 - 2, x));
  if (f0 < to.x) runs.push({ x: clampX(Math.min(f1, to.x) - 160), dir: 1 });
  if (f1 > to.x + to.w) runs.push({ x: clampX(Math.max(f0, to.x + to.w) + 160), dir: -1 });
  const o0 = Math.max(f0, to.x), o1 = Math.min(f1, to.x + to.w);
  if (o1 - o0 > 10) runs.push({ x: (o0 + o1) / 2, dir: 0 });
  let best = 0;
  for (const run of runs) {
    let streak = 0;
    for (let k = 0; k < 80; k++) {
      const w = world(r, species), h = w.hero;
      stand(w, run.x, fy);
      const inp = { ...NO_INPUT, right: run.dir > 0, left: run.dir < 0 };
      let fell = false;
      for (let i = 0; i < k; i++) { w.step(inp); if (!h.ground && h.y > fy + 30) { fell = true; break; } }
      if (fell) break; // already walked off the edge and dropped: later presses can't help
      let ok = false;
      for (let i = 0; i < 80 && !ok; i++) { w.step({ ...inp, jump: true }); ok = onFloor(w, to.y) && h.x >= to.x && h.x <= to.x + to.w; }
      streak = ok ? streak + 1 : 0;
      best = Math.max(best, streak);
      if (run.dir === 0 && k > 2) break; // standing still: every press is the same
    }
  }
  return best;
}

export interface Reach { plat: Platform; how: 'ladder' | 'jump' | 'none'; /** best jump window in frames (0 when only a ladder / nothing) */ window: number }

/** Every upper floor of the room and how this kaiju gets onto it from floors it can already reach.
 *  A jump only counts when its window is at least `minWindow` frames. */
export function roomReach(r: Room, species: number, minWindow = 6): Reach[] {
  const out = new Map<Platform, Reach>();
  const reached = (y: number, x: number) => Math.abs(y - r.groundY) < 1 || [...out.entries()].some(([p, v]) => v.how !== 'none' && Math.abs(p.y - y) < 1 && x >= p.x && x <= p.x + p.w);
  for (const p of r.platforms) out.set(p, { plat: p, how: 'none', window: 0 });
  for (let grew = true; grew;) {
    grew = false;
    for (const p of r.platforms) {
      const v = out.get(p)!;
      if (v.how !== 'none') continue;
      if (r.ladders.some(l => Math.abs(l.top - p.y) < 1 && l.x >= p.x && l.x <= p.x + p.w && reached(l.bottom, l.x) && climbs(r, species, l))) { v.how = 'ladder'; grew = true; continue; }
      const froms: (Platform | null)[] = [null, ...r.platforms.filter(q => out.get(q)!.how !== 'none')];
      for (const q of froms) v.window = Math.max(v.window, jumpWindow(r, species, q, p));
      if (v.window >= minWindow) { v.how = 'jump'; grew = true; }
    }
  }
  return [...out.values()];
}
