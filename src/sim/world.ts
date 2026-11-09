// Side-scrolling brawler simulation: hero physics (ground, one-way platforms, ladders), combos, skills,
// mobs with hitstun/juggles, loot boxes. Fixed timestep (call step(dt) with DT).
import { type AttackDef, type HeroClass, classOf } from './classes';
import { MOBS } from './mobs';
import { rollTier } from './loot';
import { type BoxTier, type Input, type MobKind, NO_INPUT, type SimEvent, type StageDef } from './types';

export const DT = 1 / 60;
export const GRAVITY = 1900;
const MAX_FALL = 900;
const CLIMB_SPEED = 150;
const COYOTE = 0.08;
const BUFFER = 0.12;   // jump / attack input buffer
const HERO_W = 34;     // half-width used for ladders and pickups

export type HeroState = 'move' | 'attack' | 'air' | 'skill' | 'climb' | 'hurt' | 'down';

export interface Hero {
  cls: HeroClass;
  x: number; y: number; vx: number; vy: number;
  face: 1 | -1;
  ground: boolean;
  /** Index into stage.platforms that we stand on (-1 = ground, null = air). */
  on: number | null;
  state: HeroState;
  t: number;          // time in current state
  step: number;       // combo step (0..2) while attacking
  queued: boolean;    // next combo step requested
  hitIds: Set<number>;
  hp: number; maxHp: number;
  inv: number;        // invulnerable time left
  skillCd: number;
  coyote: number;
  jumpBuf: number; atkBuf: number;
  dropT: number;      // ignore one-way platforms while dropping through
  prev: Input;
  xp: number; level: number;
  gliding: boolean;
}

export interface Mob {
  id: number; kind: MobKind;
  x: number; y: number; vx: number; vy: number;
  face: 1 | -1;
  hp: number; maxHp: number;
  state: 'walk' | 'windup' | 'bite' | 'hurt' | 'dead';
  t: number;
  ground: boolean;
  on: number | null;
  home: number;        // patrol centre
  hitIds: Set<number>; // unused for mobs but keeps hit bookkeeping uniform
  deadT: number;
  flash: number;
}

export interface Box { id: number; tier: BoxTier; x: number; y: number; vy: number; ground: boolean; t: number }
export interface Bolt { id: number; x: number; y: number; vx: number; t: number; dmg: number; hit: Set<number> }

let nextId = 1;

export class World {
  hero: Hero;
  mobs: Mob[] = [];
  boxes: Box[] = [];
  bolts: Bolt[] = [];
  loot: BoxTier[] = [];
  events: SimEvent[] = [];
  time = 0;
  private swingId = 0;
  private rand: () => number;
  private pendingRespawn: { kind: MobKind; x: number; t: number }[] = [];

  constructor(public stage: StageDef, species = 0, seed = 1) {
    let s = seed >>> 0 || 1;
    this.rand = () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
    const cls = classOf(species);
    this.hero = {
      cls, x: 120, y: stage.groundY, vx: 0, vy: 0, face: 1, ground: true, on: -1, state: 'move', t: 0, step: 0, queued: false,
      hitIds: new Set(), hp: cls.hp, maxHp: cls.hp, inv: 0, skillCd: 0, coyote: 0, jumpBuf: 0, atkBuf: 0, dropT: 0,
      prev: { ...NO_INPUT }, xp: 0, level: 1, gliding: false,
    };
    for (const m of stage.mobs) this.spawnMob(m.kind, m.x, m.y);
  }

  spawnMob(kind: MobKind, x: number, y?: number): Mob {
    const def = MOBS[kind];
    const m: Mob = {
      id: nextId++, kind, x, y: y ?? this.stage.groundY, vx: 0, vy: 0, face: -1, hp: def.hp, maxHp: def.hp,
      state: 'walk', t: this.rand() * 2, ground: true, on: y === undefined ? -1 : null, home: x, hitIds: new Set(), deadT: 0, flash: 0,
    };
    this.mobs.push(m);
    return m;
  }

  step(inp: Input, dt = DT): SimEvent[] {
    this.events = [];
    this.time += dt;
    this.stepHero(inp, dt);
    for (const m of this.mobs) this.stepMob(m, dt);
    this.stepBolts(dt);
    this.stepBoxes(dt);
    this.mobs = this.mobs.filter(m => !(m.state === 'dead' && m.deadT > 0.6));
    for (const r of this.pendingRespawn) r.t -= dt;
    for (const r of this.pendingRespawn.filter(r => r.t <= 0)) this.spawnMob(r.kind, r.x);
    this.pendingRespawn = this.pendingRespawn.filter(r => r.t > 0);
    return this.events;
  }

  // ---------- hero ----------
  private stepHero(inp: Input, dt: number): void {
    const h = this.hero, c = h.cls;
    const pressed = (k: keyof Input) => inp[k] && !h.prev[k];
    if (pressed('jump')) h.jumpBuf = BUFFER;
    if (pressed('attack')) h.atkBuf = BUFFER;
    h.jumpBuf -= dt; h.atkBuf -= dt;
    h.inv = Math.max(0, h.inv - dt);
    h.skillCd = Math.max(0, h.skillCd - dt);
    h.dropT = Math.max(0, h.dropT - dt);
    h.t += dt;
    const dir = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);

    // skill (from the ground or the air, not while hurt/climbing)
    if (pressed('skill') && h.skillCd <= 0 && (h.state === 'move' || h.state === 'air' || (h.state === 'attack' && h.t > c.combo[h.step].hit[1]))) {
      if (dir) h.face = dir > 0 ? 1 : -1;
      this.enter(h, 'skill');
      h.skillCd = c.skill.cd;
      h.hitIds = new Set();
      this.swingId++;
      this.events.push({ t: 'skill' });
      if (c.skill.kind === 'bolt') {
        this.bolts.push({ id: nextId++, x: h.x + h.face * 40, y: h.y - 40, vx: h.face * 620, t: 0, dmg: c.atk * c.skill.dmg, hit: new Set() });
      }
    }

    switch (h.state) {
      case 'move':
      case 'air': {
        // ladder grab
        const lad = this.ladderAt(h.x, h.y);
        if (lad && ((inp.up && !(h.ground && h.y <= lad.top + 2)) || (inp.down && h.ground && h.y <= lad.top + 2 && h.on !== -1))) {
          this.enter(h, 'climb');
          h.x = lad.x; h.vx = 0; h.vy = 0; h.ground = false; h.on = null;
          if (inp.down) h.y += 6;
          break;
        }
        const target = dir * c.speed;
        const accel = h.ground ? 2400 : 1500;
        h.vx = approach(h.vx, target, accel * dt);
        if (dir) h.face = dir > 0 ? 1 : -1;
        h.coyote = h.ground ? COYOTE : h.coyote - dt;
        if (h.jumpBuf > 0) {
          if (h.ground && inp.down && h.on !== null && h.on >= 0 && !this.stage.platforms[h.on].solid) {
            h.dropT = 0.25; h.ground = false; h.on = null; h.y += 2; h.jumpBuf = 0; // drop through
          } else if (h.coyote > 0) {
            h.vy = -c.jump; h.ground = false; h.on = null; h.coyote = 0; h.jumpBuf = 0;
            this.events.push({ t: 'jump' });
          }
        }
        if (!inp.jump && h.vy < -250) h.vy = -250; // short hop when released early
        h.gliding = !!c.glide && !h.ground && inp.jump && h.vy > 0;
        if (h.atkBuf > 0) {
          h.atkBuf = 0;
          h.step = 0;
          this.enter(h, 'attack');
          h.hitIds = new Set(); this.swingId++;
          this.events.push({ t: 'swing', step: h.ground ? 0 : -1 });
          if (!h.ground) h.step = -1; // air attack
          break;
        }
        h.state = h.ground ? 'move' : 'air';
        break;
      }
      case 'attack': {
        const atk = this.atkDef(h);
        const lunging = h.t < atk.hit[1];
        h.vx = h.ground ? (lunging ? h.face * atk.lunge : approach(h.vx, 0, 2400 * dt)) : approach(h.vx, dir * c.speed, 1200 * dt);
        if (h.atkBuf > 0 && h.step >= 0 && h.step < c.combo.length - 1 && h.t > atk.hit[0]) { h.queued = true; h.atkBuf = 0; }
        if (h.t >= atk.hit[0] && h.t <= atk.hit[1]) this.hitMobs(h, atk, h.x + h.face * atk.reach / 2, atk.reach, atk.h);
        if (h.t >= atk.dur || (h.step < 0 && h.ground && h.t > atk.hit[1])) {
          if (h.queued) {
            h.queued = false; h.step++;
            if (dir) h.face = dir > 0 ? 1 : -1;
            h.t = 0; h.hitIds = new Set(); this.swingId++;
            this.events.push({ t: 'swing', step: h.step });
          } else {
            this.enter(h, h.ground ? 'move' : 'air');
          }
        }
        break;
      }
      case 'skill': {
        const sk = c.skill;
        if (sk.kind === 'dash') h.vx = h.t < sk.dur * 0.8 ? h.face * 760 : approach(h.vx, 0, 3000 * dt);
        else if (sk.kind === 'slam') { h.vx = 0; if (h.t < 0.2 && h.ground) h.vy = -260; }
        else h.vx = approach(h.vx, 0, 2400 * dt);
        const active = sk.kind === 'dash' ? h.t < sk.dur * 0.8 : sk.kind === 'slam' ? h.t > 0.3 && h.ground : sk.kind === 'cone' ? h.t > 0.1 && h.t < 0.3 : false;
        if (active) {
          const cx = sk.kind === 'slam' ? h.x : sk.kind === 'dash' ? h.x + h.face * 20 : h.x + h.face * sk.reach / 2;
          this.hitMobs(h, { dur: sk.dur, hit: [0, 1], reach: sk.reach, h: sk.h, dmg: sk.dmg, kx: sk.kx, ky: sk.ky, lunge: 0, stun: 0.7 }, cx, sk.reach, sk.h);
        }
        if (h.t >= sk.dur) this.enter(h, h.ground ? 'move' : 'air');
        break;
      }
      case 'climb': {
        const lad = this.ladderAt(h.x, h.y + 1);
        const vdir = (inp.down ? 1 : 0) - (inp.up ? 1 : 0);
        h.vx = 0; h.vy = 0;
        h.y += vdir * CLIMB_SPEED * dt;
        if (!lad) { this.enter(h, 'air'); break; }
        if (h.y <= lad.top) { h.y = lad.top; this.land(h, this.platformAtTop(lad.x, lad.top)); this.enter(h, 'move'); break; }
        if (h.y >= lad.bottom) { h.y = lad.bottom; this.land(h, lad.bottom >= this.stage.groundY ? -1 : this.platformAtTop(lad.x, lad.bottom)); this.enter(h, 'move'); break; }
        if (h.jumpBuf > 0 && dir) { h.jumpBuf = 0; h.vy = -c.jump * 0.6; h.vx = dir * c.speed; h.face = dir > 0 ? 1 : -1; this.enter(h, 'air'); }
        return void (h.prev = { ...inp });
      }
      case 'hurt': {
        h.vx = approach(h.vx, 0, (h.ground ? 1600 : 300) * dt);
        if (h.t > 0.35 && h.ground) this.enter(h, 'move');
        break;
      }
      case 'down':
        h.vx = 0;
        if (h.t > 2) { h.hp = h.maxHp; h.inv = 2; this.enter(h, 'move'); }
        break;
    }

    this.physics(h, dt, h.gliding ? 120 : MAX_FALL, h.dropT > 0);
    h.prev = { ...inp };
  }

  private atkDef(h: Hero): AttackDef { return h.step < 0 ? h.cls.air : h.cls.combo[h.step]; }

  private enter(h: Hero, s: HeroState): void { h.state = s; h.t = 0; if (s !== 'attack') h.queued = false; }

  private hitMobs(h: Hero, atk: AttackDef, cx: number, w: number, hh: number): void {
    for (const m of this.mobs) {
      if (m.state === 'dead' || h.hitIds.has(m.id)) continue;
      const def = MOBS[m.kind];
      if (Math.abs(m.x - cx) > w / 2 + def.w / 2) continue;
      if (m.y - def.h > h.y || m.y < h.y - hh) continue;
      h.hitIds.add(m.id);
      const crit = this.rand() < 0.12;
      const dmg = Math.round(h.cls.atk * atk.dmg * (crit ? 1.6 : 1) * (0.9 + this.rand() * 0.2));
      this.damageMob(m, dmg, crit, Math.sign(m.x - h.x) || h.face, atk);
    }
  }

  private damageMob(m: Mob, dmg: number, crit: boolean, dir: number, atk: { kx: number; ky: number; stun: number }): void {
    const def = MOBS[m.kind];
    m.hp -= dmg; m.flash = 0.12;
    this.events.push({ t: 'hit', x: m.x, y: m.y - def.h * 0.6, dmg, crit, target: 'mob' });
    m.vx = dir * atk.kx * def.knock;
    // juggles: launches stack, and an airborne mob keeps getting lifted a little
    if (atk.ky < 0 || !m.ground) { m.vy = Math.min(m.vy, atk.ky < 0 ? atk.ky * def.knock : -220); m.ground = false; m.on = null; }
    m.state = 'hurt'; m.t = -atk.stun + 0.35;
    m.face = dir > 0 ? -1 : 1;
    if (m.hp <= 0) {
      m.state = 'dead'; m.deadT = 0;
      m.vy = Math.min(m.vy, -300);
      this.events.push({ t: 'mobDie', x: m.x, y: m.y });
      const h = this.hero;
      h.xp += def.xp;
      const need = xpFor(h.level);
      if (h.xp >= need) { h.xp -= need; h.level++; h.maxHp += 12; h.hp = h.maxHp; this.events.push({ t: 'levelUp', level: h.level }); }
      if (this.rand() < def.dropChance) {
        const tier = rollTier(def.dropLevel, this.rand);
        const b: Box = { id: nextId++, tier, x: m.x, y: m.y - 20, vy: -420, ground: false, t: 0 };
        this.boxes.push(b);
        this.events.push({ t: 'drop', id: b.id, tier, x: b.x, y: b.y });
      }
      if (this.stage.respawn > 0) this.pendingRespawn.push({ kind: m.kind, x: m.home, t: this.stage.respawn });
    }
  }

  // ---------- mobs ----------
  private stepMob(m: Mob, dt: number): void {
    const def = MOBS[m.kind], h = this.hero;
    m.t += dt; m.flash = Math.max(0, m.flash - dt);
    if (m.state === 'dead') { m.deadT += dt; m.vx *= 0.96; this.physics(m, dt, MAX_FALL, false); return; }
    const dx = h.x - m.x;
    const sameLevel = Math.abs(h.y - m.y) < 40;
    switch (m.state) {
      case 'walk': {
        const chase = sameLevel && Math.abs(dx) < def.aggro && h.state !== 'down';
        let dir: number;
        if (chase) dir = Math.sign(dx);
        else {
          dir = Math.sin(m.t * 0.7 + m.id) > 0 ? 1 : -1;
          if (Math.abs(m.x - m.home) > def.patrol) dir = Math.sign(m.home - m.x);
        }
        // never walk off a platform edge
        if (m.on !== null && m.on >= 0) {
          const p = this.stage.platforms[m.on];
          if ((dir < 0 && m.x - 20 < p.x) || (dir > 0 && m.x + 20 > p.x + p.w)) dir = 0;
        }
        m.vx = approach(m.vx, dir * (chase ? def.speed * 1.4 : def.speed), 800 * dt);
        if (dir) m.face = dir > 0 ? 1 : -1;
        if (chase && Math.abs(dx) < def.range && m.ground) { m.state = 'windup'; m.t = 0; m.vx = 0; m.face = dx > 0 ? 1 : -1; }
        break;
      }
      case 'windup':
        m.vx = approach(m.vx, 0, 1200 * dt);
        if (m.t > def.windup) { m.state = 'bite'; m.t = 0; m.vx = m.face * 260; }
        break;
      case 'bite':
        m.vx = approach(m.vx, 0, 900 * dt);
        if (m.t < 0.2 && h.inv <= 0 && h.state !== 'down' && Math.abs(h.x - (m.x + m.face * 24)) < 40 && Math.abs(h.y - m.y) < 50) this.hurtHero(def.atk, m.face);
        if (m.t > 0.5) { m.state = 'walk'; m.t = 0; }
        break;
      case 'hurt':
        if (m.ground) m.vx = approach(m.vx, 0, 900 * dt);
        if (m.t > 0.35 && m.ground) { m.state = 'walk'; m.t = 0; }
        break;
    }
    this.physics(m, dt, MAX_FALL, false);
    m.x = clamp(m.x, 20, this.stage.width - 20);
  }

  private hurtHero(dmg: number, dir: number): void {
    const h = this.hero;
    h.hp -= dmg; h.inv = 1;
    this.events.push({ t: 'hit', x: h.x, y: h.y - 60, dmg, crit: false, target: 'hero' });
    if (h.hp <= 0) { h.hp = 0; this.enter(h, 'down'); return; }
    if (h.state === 'skill') return; // skills have super armour
    this.enter(h, 'hurt');
    h.vx = dir * 220; h.vy = -260; h.ground = false; h.on = null;
  }

  private stepBolts(dt: number): void {
    for (const b of this.bolts) {
      b.t += dt; b.x += b.vx * dt;
      for (const m of this.mobs) {
        if (m.state === 'dead' || b.hit.has(m.id)) continue;
        const def = MOBS[m.kind];
        if (Math.abs(m.x - b.x) < def.w / 2 + 16 && b.y < m.y + 10 && b.y > m.y - def.h - 10) {
          b.hit.add(m.id);
          const sk = this.hero.cls.skill;
          this.damageMob(m, Math.round(b.dmg * (0.9 + this.rand() * 0.2)), false, Math.sign(b.vx), { kx: sk.kx, ky: sk.ky, stun: 0.6 });
        }
      }
    }
    this.bolts = this.bolts.filter(b => b.t < 0.9 && b.x > 0 && b.x < this.stage.width);
  }

  private stepBoxes(dt: number): void {
    const h = this.hero;
    for (const b of this.boxes) {
      b.t += dt;
      if (!b.ground) {
        b.vy = Math.min(b.vy + GRAVITY * dt, MAX_FALL);
        const ny = b.y + b.vy * dt;
        const floor = this.floorBelow(b.x, b.y, ny, false);
        if (floor !== null) { b.y = floor.y; b.ground = true; b.vy = 0; } else b.y = ny;
      }
      if (b.t > 0.5 && Math.abs(b.x - h.x) < HERO_W + 10 && Math.abs(b.y - h.y) < 60 && h.state !== 'down') {
        b.t = -1e9; // mark collected
        this.loot.push(b.tier);
        this.events.push({ t: 'pickup', id: b.id, tier: b.tier });
      }
    }
    this.boxes = this.boxes.filter(b => b.t >= 0);
  }

  // ---------- physics ----------
  private physics(e: { x: number; y: number; vx: number; vy: number; ground: boolean; on: number | null }, dt: number, maxFall: number, dropping: boolean): void {
    e.x += e.vx * dt;
    e.x = clamp(e.x, 20, this.stage.width - 20);
    if (e.ground) {
      // walked off the platform?
      if (e.on !== null && e.on >= 0) {
        const p = this.stage.platforms[e.on];
        if (e.x < p.x - 4 || e.x > p.x + p.w + 4) { e.ground = false; e.on = null; }
      }
      if (e.ground) { e.vy = 0; return; }
    }
    e.vy = Math.min(e.vy + GRAVITY * dt, maxFall);
    const ny = e.y + e.vy * dt;
    if (e.vy >= 0) {
      const floor = this.floorBelow(e.x, e.y, ny, dropping);
      if (floor !== null) {
        e.y = floor.y; e.vy = 0; e.ground = true; e.on = floor.on;
        if (e === this.hero) this.events.push({ t: 'land' });
        return;
      }
    }
    e.y = ny;
  }

  /** First floor crossed when moving from y0 down to y1 at x. */
  floorBelow(x: number, y0: number, y1: number, ignoreOneWay: boolean): { y: number; on: number } | null {
    let best: { y: number; on: number } | null = null;
    this.stage.platforms.forEach((p, i) => {
      if (ignoreOneWay && !p.solid) return;
      if (x < p.x || x > p.x + p.w) return;
      if (y0 <= p.y + 0.5 && y1 >= p.y && (!best || p.y < best.y)) best = { y: p.y, on: i };
    });
    if (!best && y1 >= this.stage.groundY) return { y: this.stage.groundY, on: -1 };
    return best;
  }

  private land(h: Hero, on: number): void { h.ground = true; h.on = on; h.vy = 0; }

  private platformAtTop(x: number, y: number): number {
    const i = this.stage.platforms.findIndex(p => Math.abs(p.y - y) < 3 && x >= p.x && x <= p.x + p.w);
    return i >= 0 ? i : y >= this.stage.groundY ? -1 : -1;
  }

  ladderAt(x: number, y: number) {
    return this.stage.ladders.find(l => Math.abs(l.x - x) < 22 && y >= l.top - 2 && y <= l.bottom + 2) ?? null;
  }
}

export function xpFor(level: number): number { return 20 + level * 15; }

function approach(v: number, target: number, step: number): number {
  return v < target ? Math.min(v + step, target) : Math.max(v - step, target);
}
function clamp(v: number, a: number, b: number): number { return Math.max(a, Math.min(b, v)); }
