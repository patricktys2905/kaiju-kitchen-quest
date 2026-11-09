// A simple AI player for balance testing (scripts/balance.ts): chases the nearest monster across platforms
// and ladders, combos, uses skills, dodges wind-ups (with a human-ish reaction delay and miss chance),
// drinks jam when low, then walks to the exit.
import { MOBS } from './mobs';
import { type Input, NO_INPUT } from './types';
import { type Mob, World } from './world';

export interface BotOpts { dodgeSkill: number; reaction: number; potionAt: number }
export const AVERAGE: BotOpts = { dodgeSkill: 0.45, reaction: 0.18, potionAt: 0.35 };

export class Bot {
  private seen = new Map<number, number>(); // mob id → time its wind-up was noticed
  private tap = 0;          // dodge double-tap sequencer
  private tapDir = 0;
  private stuck = 0; private lastX = 0;
  private r: () => number;
  constructor(private w: World, private o: BotOpts = AVERAGE, seed = 1) {
    let s = seed;
    this.r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  }

  think(): Input {
    const w = this.w, h = w.hero, inp: Input = { ...NO_INPUT };
    const pulse = (w.time * 6 | 0) % 2 === 0; // jump presses must be fresh: pulse the button
    if (h.state === 'down') return inp;
    // dodge sequencer in progress: right, release, right
    if (this.tap > 0) {
      this.tap--;
      const k = this.tapDir > 0 ? 'right' : 'left';
      if (this.tap === 1) inp[k] = true; // press, release, press
      return inp;
    }
    // potion
    if (h.hp < h.d.maxHp * this.o.potionAt && h.quickCd <= 0) {
      const i = h.bag.findIndex(b => b && b.n > 0 && (b.id === 'jam' || b.id === 'bigjam'));
      if (i >= 0) { (inp as unknown as Record<string, boolean>)[`item${i + 1}`] = true; return inp; }
    }
    const alive = w.mobs.filter(m => m.state !== 'dead');
    // dodge an attack that is winding up close by
    for (const m of alive) {
      if (m.state !== 'windup' || Math.abs(m.x - h.x) > (MOBS[m.kind].brain === 'boss' ? 200 : 110)) { this.seen.delete(m.id); continue; }
      if (!this.seen.has(m.id)) this.seen.set(m.id, w.time + this.o.reaction);
      const at = this.seen.get(m.id)!;
      if (w.time >= at && w.time < at + 0.05 && h.dodgeCd <= 0 && h.state !== 'skill') {
        // red (danger) attacks are hard to miss: players learn to always dodge those
        if (this.r() < (w.isDanger(m) ? Math.min(0.9, this.o.dodgeSkill + 0.25) : this.o.dodgeSkill)) { this.tapDir = m.x > h.x ? -1 : 1; this.tap = 3; const k = this.tapDir > 0 ? 'right' : 'left'; inp[k] = true; return inp; }
        this.seen.set(m.id, 1e9); // missed it
      }
    }
    if (!alive.length) { // go to the exit
      if (h.state === 'climb') { inp.down = true; return inp; } // finished the last monster mid-ladder: climb down first
      if (Math.abs(h.y - w.stage.groundY) > 2 && h.ground) { inp.down = true; inp.jump = (w.time * 10 | 0) % 2 === 0; return inp; }
      inp[w.exitX > h.x ? 'right' : 'left'] = true;
      return inp;
    }
    // nearest target, preferring ones on our level
    const cost = (m: Mob) => Math.abs(m.x - h.x) + Math.abs(m.y - h.y) * (MOBS[m.kind].brain === 'flyer' ? 0.5 : 3);
    const t = alive.reduce((a, b) => cost(a) < cost(b) ? a : b);
    const def = MOBS[t.kind];
    const dx = t.x - h.x, dy = t.y - h.y;
    const flyer = def.brain === 'flyer';
    const sameLevel = flyer ? dy > -110 : Math.abs(dy) < 12;
    const reach = (h.d.cls.combo[0].reach) * 0.8 + def.w / 2;
    // stuck detection: jump
    if (Math.abs(h.x - this.lastX) < 0.5 && h.state === 'move') this.stuck++; else this.stuck = 0;
    this.lastX = h.x;
    if (h.state === 'climb') { inp[dy < 0 ? 'up' : 'down'] = true; return inp; }
    if (sameLevel || (flyer && Math.abs(dx) < reach + 20)) {
      if (Math.abs(dx) > reach * 0.85) {
        inp[dx > 0 ? 'right' : 'left'] = true;
        // same height but on another platform: jump the gap at our edge
        if (h.on !== null && h.on >= 0 && t.on !== h.on) {
          const p = w.stage.platforms[h.on];
          if ((dx > 0 && h.x > p.x + p.w - 40) || (dx < 0 && h.x < p.x + 40)) inp.jump = pulse;
        }
      }
      else {
        if ((dx > 0 ? 1 : -1) !== h.face) inp[dx > 0 ? 'right' : 'left'] = true;
        inp.attack = (w.time * 12 | 0) % 2 === 0;
        if (flyer && dy < -50) inp.jump = pulse;
        // skills when ready
        const keys = ['skill1', 'skill2', 'skill3'] as const;
        for (let i = 0; i < 3; i++) if (h.cds[i] <= 0 && (h.d.skillLv[Object.keys(h.d.skillLv)[i]] ?? 0) > 0 && this.r() < 0.05) inp[keys[i]] = true;
      }
      return inp;
    }
    if (dy < 0) { // target above: ladder if one leads there, else jump toward it
      const lad = w.stage.ladders.find(l => Math.abs(l.top - t.y) < 4 && t.x > l.x - 400 && t.x < l.x + 400);
      if (lad) {
        if (Math.abs(lad.x - h.x) > 8) inp[lad.x > h.x ? 'right' : 'left'] = true;
        else inp.up = true;
        return inp;
      }
      const plat = w.stage.platforms.find(p => Math.abs(p.y - t.y) < 4 && t.x >= p.x && t.x <= p.x + p.w);
      // stepping stone: the closest platform between us and the target's height, near the target
      const ty = MOBS[t.kind].brain === 'flyer' ? t.homeY : t.y;
      const near = (p: { x: number; w: number }) => Math.max(0, p.x - t.x, t.x - (p.x + p.w));
      const under = w.stage.platforms.filter(p => p.y > ty + 4 && p.y < h.y - 4 && h.y - p.y < 100 && near(p) < 450).sort((a, b) => near(a) - near(b))[0];
      const goal = (!plat || h.y - plat.y > 100) && under ? under : plat;
      if (goal) {
        const edge = h.x < goal.x ? goal.x + 30 : h.x > goal.x + goal.w ? goal.x + goal.w - 30 : h.x;
        inp[edge > h.x ? 'right' : 'left'] = Math.abs(edge - h.x) > 6;
        if (Math.abs(edge - h.x) < 70 || this.stuck > 20) inp.jump = pulse;
      } else { inp[dx > 0 ? 'right' : 'left'] = true; inp.jump = pulse; }
      return inp;
    }
    // target below: drop down
    if (h.ground && h.on !== null && h.on >= 0) { inp.down = true; inp.jump = (w.time * 10 | 0) % 2 === 0; }
    else inp[dx > 0 ? 'right' : 'left'] = true;
    return inp;
  }
}
