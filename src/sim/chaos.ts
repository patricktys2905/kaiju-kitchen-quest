// Chaos testing: a bot that mashes random (but plausible) inputs, while checking rules that must ALWAYS hold. It hunts the
// kind of bug a balance bot never finds: walking on air after a ladder, being trapped on a ledge, NaN creeping into
// numbers, monsters falling through the floor, runaway shot lists, crashes. Used by tests/chaos.test.ts (a quick slice on
// every push) and scripts/chaos.ts (every stage x every kaiju, overnight).
import { type Input, NO_INPUT, type StageDef } from './types';
import { World } from './world';
import type { Derived } from './stats';

export interface Violation { rule: string; t: number; detail: string }

/** Random-input player. Holds a "plan" for a few frames, biased toward things that break games: ladders, ledges, jumps,
 *  dropping through floors, dodging, skills mid-air, gear. */
export class ChaosBot {
  private plan: Partial<Input> = {};
  private left = 0;
  private r: () => number;
  constructor(private w: World, seed: number) {
    let s = seed >>> 0 || 1;
    this.r = () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
  }
  think(): Input {
    const w = this.w, h = w.hero, r = this.r;
    if (--this.left <= 0) {
      this.left = 4 + Math.floor(r() * 40);
      const dir = r() < 0.5 ? { left: true } : { right: true };
      const near = w.ladderAt(h.x, h.y);
      const pick = r();
      this.plan =
        near && pick < 0.35 ? { up: r() < 0.6, down: r() >= 0.6, ...(r() < 0.4 ? { ...dir, jump: true } : {}) } // ladder games
        : pick < 0.25 ? { ...dir }
        : pick < 0.45 ? { ...dir, jump: true }
        : pick < 0.55 ? { down: true, jump: true } // drop through a platform
        : pick < 0.65 ? { attack: true, ...(r() < 0.5 ? dir : {}) }
        : pick < 0.75 ? { [(['skill1', 'skill2', 'skill3'] as const)[Math.floor(r() * 3)]]: true, ...(r() < 0.5 ? { jump: true } : {}) }
        : pick < 0.8 ? { gear: true }
        : pick < 0.84 ? { ult: true }
        : pick < 0.87 ? { item1: true }
        : pick < 0.95 ? { up: true, ...dir }
        : {}; // stand still
    }
    // buttons are pressed in pulses (held jump/attack is a different input from tapping)
    const pulse = (w.time * 8 | 0) % 2 === 0;
    const inp: Input = { ...NO_INPUT, ...this.plan };
    if (this.plan.jump) inp.jump = pulse;
    if (this.plan.attack) inp.attack = pulse;
    return inp;
  }
}

/** Rules every frame must satisfy. Returns the broken ones (empty = fine). */
export function checkWorld(w: World, prev: { stuckT: number; lastY: number; lastX: number }, dt: number): Violation[] {
  const out: Violation[] = [];
  const st = w.stage, G = st.groundY, t = Math.round(w.time * 10) / 10;
  const bad = (rule: string, detail: string) => out.push({ rule, t, detail });
  for (const h of w.heroes) {
    const at = `${Math.round(h.x)},${Math.round(h.y)} ${h.state}`;
    if (![h.x, h.y, h.vx, h.vy, h.hp].every(Number.isFinite)) bad('hero NaN', at);
    if (h.y > G + 6) bad('hero below floor', at);
    if (h.x < 0 || h.x > st.width) bad('hero off stage', at);
    // standing on nothing: on the ground but no floor, platform (with physics' 4px edge grace) or ladder under the feet
    if (h.ground && h.state !== 'climb' && h.y < G - 2) {
      const plat = st.platforms.some(p => Math.abs(p.y - h.y) < 3 && h.x >= p.x - 6 && h.x <= p.x + p.w + 6);
      if (!plat && !w.ladderAt(h.x, h.y)) bad('standing on air', `${at} on ${h.on}`);
    }
  }
  // the player trapped up high: hasn't come below its height or moved sideways for ages (a ledge it can't leave, a bounce loop)
  const h = w.hero;
  if (h.y < G - 40 && Math.abs(h.y - prev.lastY) < 30 && Math.abs(h.x - prev.lastX) < 140) prev.stuckT += dt; else { prev.stuckT = 0; prev.lastY = h.y; prev.lastX = h.x; }
  if (prev.stuckT > 40) { bad('trapped up high', `${Math.round(h.x)},${Math.round(h.y)} for 40 s`); prev.stuckT = -1e9; }
  for (const m of w.mobs) {
    if (m.state === 'dead') continue;
    if (![m.x, m.y, m.hp].every(Number.isFinite)) bad('monster NaN', `${m.kind} #${m.id}`);
    if (m.y > G + 40 && !m.under) bad('monster below floor', `${m.kind} ${Math.round(m.x)},${Math.round(m.y)}`);
    if (m.x < -200 || m.x > st.width + 200) bad('monster off stage', `${m.kind} ${Math.round(m.x)}`);
  }
  if (w.shots.length > 600) bad('runaway shots', `${w.shots.length}`);
  if (w.mines.length > 120) bad('runaway mines', `${w.mines.length}`);
  if (w.mobs.length > 250) bad('runaway monsters', `${w.mobs.length}`);
  return out;
}

/** Plays one stage with the chaos bot for `seconds`, the hero kept alive (so it explores). Collects rule breaks and crashes. */
export function chaosRun(stage: StageDef, d: Derived, seed: number, seconds: number, startX?: number): Violation[] {
  const w = new World(stage, d, seed, [{ id: 'jam', n: 99 }, null, null, null], 0);
  if (startX !== undefined) w.hero.x = startX;
  const bot = new ChaosBot(w, seed * 7 + 1);
  const prev = { stuckT: 0, lastY: w.hero.y, lastX: w.hero.x };
  const found: Violation[] = [];
  const seen = new Set<string>();
  const dt = 1 / 60;
  for (let i = 0; i < seconds * 60; i++) {
    w.hero.hp = w.hero.d.maxHp; w.hero.revives = 9; // immortal: keep exploring
    try { w.step(bot.think()); } catch (e) { found.push({ rule: 'crash', t: Math.round(w.time * 10) / 10, detail: (e as Error).stack?.split('\n').slice(0, 3).join(' | ') ?? String(e) }); break; }
    for (const v of checkWorld(w, prev, dt)) if (!seen.has(v.rule)) { seen.add(v.rule); found.push(v); }
    if (w.cleared || w.failed) break;
  }
  return found;
}
