// Side-scrolling brawler simulation: hero physics (ground, one-way platforms, ladders), combos, 3 skill
// slots, buffs, monsters with levels and brains (walker/hopper/ranged/brute/boss), loot boxes, stage clear.
// Fixed timestep (call step(input) at DT).
import type { AttackDef } from './classes';
import { rollTier } from './loot';
import { type BoostKind, CONSUMABLES, type ConsumableId, QUICK_CD } from './consumables';
import { ELITE, MOBS, TUNE, dropLevel, mobAtk, mobCrumbs, mobHp, mobXp } from './mobs';
import { type SkillDef, skillScale, skillsOf } from './skills';
import { WORLDS } from './stages';
import type { Derived } from './stats';
import { type BoxTier, type Input, type LootBox, type MobKind, NO_INPUT, type SimEvent, type StageDef } from './types';

export const DT = 1 / 60;
export const GRAVITY = 1900;
const MAX_FALL = 900;
const CLIMB_SPEED = 150;
const COYOTE = 0.08;
const BUFFER = 0.12;   // jump / attack input buffer
const HERO_W = 34;
const COMBO_WINDOW = 1.6;
export const HARD_LV = 6; // Hard mode: monsters this many levels higher
const DOUBLE_TAP = 0.28;  // seconds between two taps of a direction for a dodge roll
const DODGE_T = 0.32, DODGE_INV = 0.3, DODGE_CD = 0.55;

export type HeroState = 'move' | 'attack' | 'air' | 'skill' | 'climb' | 'hurt' | 'down' | 'dodge';

export interface Buff { atk: number; def: number; speed: number; armor: boolean; t: number }

export interface Hero {
  d: Derived;
  x: number; y: number; vx: number; vy: number;
  face: 1 | -1;
  ground: boolean;
  on: number | null;   // platform index we stand on (-1 = ground, null = air)
  state: HeroState;
  t: number;
  step: number;        // combo step (0..2), -1 = air attack
  queued: boolean;
  hitIds: Set<number>;
  hp: number;
  inv: number;
  cds: [number, number, number];
  skill: SkillDef | null; // active skill while state === 'skill'
  skillMul: number;
  ticks: number;       // multi-hit counter for spin skills
  coyote: number;
  jumpBuf: number; atkBuf: number;
  dropT: number;
  prev: Input;
  gliding: boolean;
  buff: Buff | null;
  /** consumable boosts: kind → [value, seconds left] */
  boosts: Partial<Record<BoostKind, [number, number]>>;
  /** quick bag: 4 slots of { id, count } (the stage keeps its own copy; the scene writes it back) */
  bag: ({ id: ConsumableId; n: number } | null)[];
  revives: number;
  quickCd: number;
  lastTap: { dir: number; t: number };
  dodgeCd: number;
}

export interface Mob {
  id: number; kind: MobKind; lv: number;
  x: number; y: number; vx: number; vy: number;
  face: 1 | -1;
  hp: number; maxHp: number; atk: number;
  state: 'walk' | 'windup' | 'attack' | 'hurt' | 'dead' | 'stagger';
  move: string;        // which attack (boss patterns)
  t: number;
  ground: boolean;
  on: number | null;
  home: number;
  deadT: number;
  flash: number;
  hurtShown: number;   // seconds to show the HP bar
  stagger: number;     // boss stagger meter
  summoned: number;
  hitDone: boolean;
  elite: boolean;
  homeY: number;       // flyers hover above this floor
}

export interface Box { id: number; tier: BoxTier; ilvl: number; x: number; y: number; vy: number; ground: boolean; t: number }
export interface Shot { id: number; x: number; y: number; vx: number; vy: number; t: number; dmg: number; hit: Set<number>; from: 'hero' | 'mob'; kx: number; ky: number; pierce: boolean; g?: number; kind?: string }
export interface Mine { id: number; x: number; y: number; t: number; dmg: number; kx: number; ky: number }

export interface RunStats { time: number; hitsTaken: number; dmgTaken: number; maxCombo: number; kills: number; crumbs: number; revived: number }

let nextId = 1;

export class World {
  hero: Hero;
  mobs: Mob[] = [];
  boxes: Box[] = [];
  shots: Shot[] = [];
  mines: Mine[] = [];
  loot: LootBox[] = [];
  events: SimEvent[] = [];
  time = 0;
  combo = 0; comboT = 0;
  run: RunStats = { time: 0, hitsTaken: 0, dmgTaken: 0, maxCombo: 0, kills: 0, crumbs: 0, revived: 0 };
  portal = false;
  cleared = false;
  failed = false;
  /** x of the exit plate (appears when every monster is beaten) */
  exitX: number;
  rand: () => number;

  constructor(public stage: StageDef, d: Derived, seed = 1, bag: Hero['bag'] = [], revives = 0, hard = false) {
    let s = seed >>> 0 || 1;
    this.rand = () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
    this.exitX = stage.width - 90;
    this.hero = {
      d, x: 100, y: stage.groundY, vx: 0, vy: 0, face: 1, ground: true, on: -1, state: 'move', t: 0, step: 0, queued: false,
      hitIds: new Set(), hp: d.maxHp, inv: 0, cds: [0, 0, 0], skill: null, skillMul: 1, ticks: 0,
      coyote: 0, jumpBuf: 0, atkBuf: 0, dropT: 0, prev: { ...NO_INPUT }, gliding: false, buff: null,
      boosts: {}, bag: bag.map(b => b && { ...b }), revives, quickCd: 0, lastTap: { dir: 0, t: -9 }, dodgeCd: 0,
    };
    // Hard mode: every monster +HARD_LV levels
    for (const m of stage.mobs) this.spawnMob(m.kind, m.x, m.lv + (hard ? HARD_LV : 0), m.y, m.elite);
  }

  /** New stats (level up mid-stage, or a different hero). Keeps the HP fraction. */
  setDerived(d: Derived): void {
    const f = this.hero.hp / this.hero.d.maxHp;
    this.hero.d = d;
    this.hero.hp = Math.max(1, Math.round(d.maxHp * f));
  }

  spawnMob(kind: MobKind, x: number, lv: number, y?: number, elite = false): Mob {
    const pow = WORLDS.find(x => x.id === this.stage.world)?.power ?? 1;
    const hp = Math.round(mobHp(kind, lv) * (elite ? ELITE.hp : 1) * pow);
    const m: Mob = {
      id: nextId++, kind, lv, x, y: y ?? this.stage.groundY, vx: 0, vy: 0, face: -1, hp, maxHp: hp, atk: Math.round(mobAtk(kind, lv) * (elite ? ELITE.atk : 1) * pow),
      state: 'walk', move: '', t: this.rand() * 2, ground: true, on: y === undefined ? -1 : null, home: x, deadT: 0, flash: 0,
      hurtShown: 0, stagger: 0, summoned: 0, hitDone: false, elite, homeY: y ?? this.stage.groundY,
    };
    if (y !== undefined) { m.on = this.platformAt(x, y); m.ground = m.on !== null; }
    this.mobs.push(m);
    return m;
  }

  get boss(): Mob | undefined { return this.mobs.find(m => MOBS[m.kind].brain === 'boss'); }
  get alive(): number { return this.mobs.filter(m => m.state !== 'dead').length; }

  step(inp: Input, dt = DT): SimEvent[] {
    this.events = [];
    if (this.cleared) return this.events;
    this.time += dt;
    if (!this.failed) this.run.time += dt;
    this.comboT -= dt;
    if (this.comboT <= 0) this.combo = 0;
    this.stepHero(inp, dt);
    for (const m of this.mobs) this.stepMob(m, dt);
    this.stepShots(dt);
    this.stepMines(dt);
    this.stepBoxes(dt);
    this.mobs = this.mobs.filter(m => !(m.state === 'dead' && m.deadT > 0.7));
    if (!this.portal && this.alive === 0) { this.portal = true; this.events.push({ t: 'portal' }); }
    const h = this.hero;
    if (this.portal && h.state !== 'down' && Math.abs(h.x - this.exitX) < 40 && Math.abs(h.y - this.stage.groundY) < 4) {
      // boxes still lying around are swept up for you
      for (const b of this.boxes) { this.loot.push({ tier: b.tier, ilvl: b.ilvl }); this.events.push({ t: 'pickup', id: b.id, tier: b.tier }); }
      this.boxes = [];
      this.cleared = true; this.events.push({ t: 'clear' });
    }
    return this.events;
  }

  // ---------- hero ----------
  private stepHero(inp: Input, dt: number): void {
    const h = this.hero, c = h.d.cls;
    const pressed = (k: keyof Input) => inp[k] && !h.prev[k];
    if (pressed('jump')) h.jumpBuf = BUFFER;
    if (pressed('attack')) h.atkBuf = BUFFER;
    h.jumpBuf -= dt; h.atkBuf -= dt;
    h.inv = Math.max(0, h.inv - dt);
    const cdRate = 1 + (h.boosts.speed ? 0.25 : 0);
    for (let i = 0; i < 3; i++) h.cds[i] = Math.max(0, h.cds[i] - dt * cdRate);
    for (const k of Object.keys(h.boosts) as BoostKind[]) { const b = h.boosts[k]!; if ((b[1] -= dt) <= 0) delete h.boosts[k]; }
    h.quickCd = Math.max(0, h.quickCd - dt);
    h.dodgeCd = Math.max(0, h.dodgeCd - dt);
    const items = ['item1', 'item2', 'item3', 'item4'] as const;
    for (let i = 0; i < 4; i++) if (pressed(items[i])) this.useItem(i);
    h.dropT = Math.max(0, h.dropT - dt);
    if (h.buff && (h.buff.t -= dt) <= 0) h.buff = null;
    h.t += dt;
    const dir = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
    const speed = c.speed * h.d.speed * (1 + (h.buff?.speed ?? 0) + (h.boosts.speed?.[0] ?? 0));
    // dodge roll: tap the same direction twice quickly
    const tapDir = pressed('left') ? -1 : pressed('right') ? 1 : 0;
    if (tapDir) {
      const canDodge = h.dodgeCd <= 0 && (h.state === 'move' || h.state === 'air' || (h.state === 'attack' && h.t > this.atkDef(h).hit[1]));
      if (canDodge && h.lastTap.dir === tapDir && this.time - h.lastTap.t < DOUBLE_TAP) {
        h.face = tapDir as 1 | -1;
        this.enter(h, 'dodge');
        h.inv = Math.max(h.inv, DODGE_INV); h.dodgeCd = DODGE_CD; h.lastTap = { dir: 0, t: -9 };
        this.events.push({ t: 'dodge' });
      } else h.lastTap = { dir: tapDir, t: this.time };
    }

    // skills (ground or air; can cancel the end of an attack)
    const free = h.state === 'move' || h.state === 'air' || (h.state === 'attack' && h.t > this.atkDef(h).hit[1]);
    const slots = ['skill1', 'skill2', 'skill3'] as const;
    for (let i = 0; i < 3 && free; i++) {
      if (!pressed(slots[i])) continue;
      const sk = skillsOf(c.species).actives[i];
      const lv = h.d.skillLv[sk.id] ?? 0;
      if (!lv || h.cds[i] > 0) continue;
      if (dir) h.face = dir > 0 ? 1 : -1;
      const sc = skillScale(lv);
      h.cds[i] = sk.cd * sc.cd * (1 - h.d.cdr);
      h.skill = sk; h.skillMul = sc.dmg * h.d.skillDmg; h.ticks = 0;
      this.enter(h, 'skill');
      h.hitIds = new Set();
      this.events.push({ t: 'skill', slot: i, kind: sk.kind, id: sk.id });
      this.startSkill(h, sk);
      break;
    }

    switch (h.state) {
      case 'move':
      case 'air': {
        const lad = this.ladderAt(h.x, h.y);
        if (lad && ((inp.up && !(h.ground && h.y <= lad.top + 2)) || (inp.down && h.ground && h.y <= lad.top + 2 && h.on !== -1))) {
          this.enter(h, 'climb');
          h.x = lad.x; h.vx = 0; h.vy = 0; h.ground = false; h.on = null;
          if (inp.down) h.y += 6;
          break;
        }
        h.vx = approach(h.vx, dir * speed, (h.ground ? 2400 : 1500) * dt);
        if (dir) h.face = dir > 0 ? 1 : -1;
        h.coyote = h.ground ? COYOTE : h.coyote - dt;
        if (h.jumpBuf > 0) {
          if (h.ground && inp.down && h.on !== null && h.on >= 0 && !this.stage.platforms[h.on].solid) {
            h.dropT = 0.25; h.ground = false; h.on = null; h.y += 2; h.jumpBuf = 0;
          } else if (h.coyote > 0) {
            h.vy = -c.jump; h.ground = false; h.on = null; h.coyote = 0; h.jumpBuf = 0;
            this.events.push({ t: 'jump' });
          }
        }
        if (!inp.jump && h.vy < -250) h.vy = -250;
        h.gliding = !!c.glide && !h.ground && inp.jump && h.vy > 0;
        if (h.atkBuf > 0) {
          h.atkBuf = 0;
          h.step = h.ground ? 0 : -1;
          this.enter(h, 'attack');
          h.hitIds = new Set();
          this.events.push({ t: 'swing', step: h.step });
          break;
        }
        h.state = h.ground ? 'move' : 'air';
        break;
      }
      case 'attack': {
        const atk = this.atkDef(h);
        const lunging = h.t < atk.hit[1];
        h.vx = h.ground ? (lunging ? h.face * atk.lunge : approach(h.vx, 0, 2400 * dt)) : approach(h.vx, dir * speed, 1200 * dt);
        if (h.atkBuf > 0 && h.step >= 0 && h.step < c.combo.length - 1 && h.t > atk.hit[0]) { h.queued = true; h.atkBuf = 0; }
        if (h.t >= atk.hit[0] && h.t <= atk.hit[1]) this.hitBox(h.x + h.face * atk.reach / 2, h.y, atk.reach, atk.h, atk.dmg, false, atk, h.hitIds);
        if (h.t >= atk.dur || (h.step < 0 && h.ground && h.t > atk.hit[1])) {
          if (h.queued) {
            h.queued = false; h.step++;
            if (dir) h.face = dir > 0 ? 1 : -1;
            h.t = 0; h.hitIds = new Set();
            this.events.push({ t: 'swing', step: h.step });
          } else this.enter(h, h.ground ? 'move' : 'air');
        }
        break;
      }
      case 'skill': this.stepSkill(h, dir, speed, dt); break;
      case 'dodge':
        h.vx = h.face * 560 * (1 - h.t / DODGE_T * 0.6);
        if (h.t >= DODGE_T) this.enter(h, h.ground ? 'move' : 'air');
        break;
      case 'climb': {
        const lad = this.ladderAt(h.x, h.y + 1);
        const vdir = (inp.down ? 1 : 0) - (inp.up ? 1 : 0);
        h.vx = 0; h.vy = 0;
        h.y += vdir * CLIMB_SPEED * dt;
        if (!lad) { this.enter(h, 'air'); break; }
        if (h.y <= lad.top) { h.y = lad.top; this.land(h, this.platformAt(lad.x, lad.top) ?? -1); this.enter(h, 'move'); break; }
        if (h.y >= lad.bottom) { h.y = lad.bottom; this.land(h, lad.bottom >= this.stage.groundY ? -1 : (this.platformAt(lad.x, lad.bottom) ?? -1)); this.enter(h, 'move'); break; }
        if (h.jumpBuf > 0 && dir) { h.jumpBuf = 0; h.vy = -c.jump * 0.6; h.vx = dir * speed; h.face = dir > 0 ? 1 : -1; this.enter(h, 'air'); }
        h.prev = { ...inp };
        return;
      }
      case 'hurt':
        h.vx = approach(h.vx, 0, (h.ground ? 1600 : 300) * dt);
        if (h.t > 0.35 && h.ground) this.enter(h, 'move');
        break;
      case 'down':
        h.vx = 0;
        if (h.t > 1.6 && !this.failed) { this.failed = true; this.events.push({ t: 'down' }); }
        break;
    }

    this.physics(h, dt, h.gliding ? 120 : MAX_FALL, h.dropT > 0);
    h.prev = { ...inp };
  }

  private startSkill(h: Hero, sk: SkillDef): void {
    const atk = h.d.atk * h.skillMul;
    switch (sk.kind) {
      case 'bolt':
        this.shots.push({ id: nextId++, x: h.x + h.face * 40, y: h.y - 40, vx: h.face * 620, vy: 0, t: 0, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: true });
        break;
      case 'fan':
        for (let i = 0; i < (sk.n ?? 5); i++) {
          const a = (i / ((sk.n ?? 5) - 1) - 0.5) * 0.7;
          this.shots.push({ id: nextId++, x: h.x + h.face * 30, y: h.y - 44, vx: h.face * 560 * Math.cos(a), vy: 560 * Math.sin(a), t: 0, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: false });
        }
        break;
      case 'mines':
        for (let i = 0; i < (sk.n ?? 3); i++) this.mines.push({ id: nextId++, x: h.x + h.face * (40 + i * 45), y: this.stage.groundY, t: 0, dmg: atk * sk.dmg, kx: sk.kx, ky: sk.ky });
        // mines land on the floor below each spot
        for (const m of this.mines.slice(-(sk.n ?? 3))) { const f = this.floorBelow(m.x, h.y - 2, h.y + 2000, false); if (f) m.y = f.y; }
        break;
      case 'buff':
        h.buff = { atk: sk.buff?.atk ?? 0, def: sk.buff?.def ?? 0, speed: sk.buff?.speed ?? 0, armor: !!sk.buff?.armor, t: sk.buff?.t ?? 5 };
        break;
      case 'uppercut':
        if (h.ground) { h.vy = -760; h.ground = false; h.on = null; }
        break;
      case 'heal': {
        const lv = h.d.skillLv[sk.id] ?? 1;
        h.hp = Math.min(h.d.maxHp, h.hp + h.d.maxHp * (sk.heal ?? 0.2) * (1 + 0.2 * (lv - 1)));
        break;
      }
    }
  }

  private stepSkill(h: Hero, dir: number, speed: number, dt: number): void {
    const sk = h.skill!;
    const q = h.t / sk.dur;
    const mk = (cx: number, w: number, hh: number, y = h.y) => this.hitBox(cx, y, w, hh, sk.dmg * h.skillMul, true, { kx: sk.kx, ky: sk.ky, stun: 0.7 }, h.hitIds);
    switch (sk.kind) {
      case 'cone':
        h.vx = approach(h.vx, 0, 2400 * dt);
        if (q > 0.2 && q < 0.65) mk(h.x + h.face * sk.reach / 2, sk.reach, sk.h);
        break;
      case 'slam':
        h.vx = 0;
        if (h.t < 0.2 && h.ground) { h.vy = -280; h.ground = false; h.on = null; }
        if (h.t > 0.25 && h.ground && !h.ticks) { h.ticks = 1; this.events.push({ t: 'shock', x: h.x, y: h.y, r: sk.reach }); mk(h.x, sk.reach * 2, sk.h); }
        break;
      case 'dash':
        h.vx = q < 0.8 ? h.face * 760 : approach(h.vx, 0, 3000 * dt);
        if (q < 0.8) mk(h.x + h.face * 20, sk.reach, sk.h);
        break;
      case 'uppercut':
        h.vx = approach(h.vx, h.face * 120, 2000 * dt);
        if (q < 0.6) mk(h.x + h.face * 30, sk.reach, sk.h, h.y + 30);
        break;
      case 'spin': {
        h.vx = approach(h.vx, dir * speed * 0.7, 1800 * dt);
        if (dir) h.face = dir > 0 ? 1 : -1;
        const tick = Math.floor(h.t * (sk.n ?? 6) / sk.dur);
        if (tick > h.ticks) { h.ticks = tick; h.hitIds = new Set(); }
        mk(h.x, sk.reach * 2, sk.h);
        break;
      }
      case 'nova':
        h.vx = 0; if (!h.ground) h.vy = Math.min(h.vy, 60);
        if (q > 0.55 && !h.ticks) { h.ticks = 1; this.events.push({ t: 'shock', x: h.x, y: h.y - 40, r: sk.reach }); mk(h.x, sk.reach * 2, sk.h, h.y + sk.h / 3); }
        break;
      default:
        h.vx = approach(h.vx, 0, 2400 * dt);
    }
    if (h.t >= sk.dur && (sk.kind !== 'slam' || h.ground)) this.enter(h, h.ground ? 'move' : 'air');
  }

  /** Quick-bag item: heal or boost (shared cooldown). */
  useItem(slot: number): boolean {
    const h = this.hero, it = h.bag[slot];
    if (!it || it.n <= 0 || h.quickCd > 0 || h.state === 'down' || this.cleared) return false;
    const def = CONSUMABLES[it.id];
    if (!def.quick) return false;
    if (def.heal && h.hp >= h.d.maxHp) return false;
    if (def.heal) h.hp = Math.min(h.d.maxHp, h.hp + h.d.maxHp * def.heal);
    if (def.boost) h.boosts[def.boost.kind] = [def.boost.v, def.boost.t];
    it.n--; h.quickCd = QUICK_CD;
    this.events.push({ t: 'use', slot, id: it.id });
    return true;
  }

  private atkDef(h: Hero): AttackDef { return h.step < 0 ? h.d.cls.air : h.d.cls.combo[h.step]; }

  private enter(h: Hero, s: HeroState): void { h.state = s; h.t = 0; if (s !== 'attack') h.queued = false; }

  /** Hero damage into an area. Box = centre x, feet y, width, height up from feet. */
  private hitBox(cx: number, y: number, w: number, hh: number, mult: number, skill: boolean, k: { kx: number; ky: number; stun: number }, ids: Set<number>): void {
    const h = this.hero;
    for (const m of this.mobs) {
      if (m.state === 'dead' || ids.has(m.id)) continue;
      const def = MOBS[m.kind];
      if (Math.abs(m.x - cx) > w / 2 + def.w / 2) continue;
      if (m.y - def.h > y || m.y < y - hh) continue;
      ids.add(m.id);
      this.damageMob(m, h.d.atk * mult, Math.sign(m.x - h.x) || h.face, k, skill);
    }
  }

  private damageMob(m: Mob, raw: number, dir: number, k: { kx: number; ky: number; stun: number }, heavy: boolean): void {
    const def = MOBS[m.kind], h = this.hero;
    const crit = this.rand() * 100 < h.d.crit;
    const gap = m.lv - h.d.level; // fighting above your level hurts
    const lvMul = gap > 2 ? Math.max(0.4, 1 - 0.07 * (gap - 2)) : 1;
    const buff = 1 + (h.buff?.atk ?? 0) + (h.boosts.atk?.[0] ?? 0);
    const dmg = Math.max(1, Math.round(raw * buff * lvMul * (crit ? h.d.critDmg : 1) * (0.9 + this.rand() * 0.2)));
    m.hp -= dmg; m.flash = 0.12; m.hurtShown = 3;
    this.combo++; this.comboT = COMBO_WINDOW; this.run.maxCombo = Math.max(this.run.maxCombo, this.combo);
    this.events.push({ t: 'hit', x: m.x, y: m.y - def.h * 0.6, dmg, crit, target: 'mob' });

    const flinch = !(def.armor || m.elite) || (def.brain !== 'boss' && (heavy || k.stun >= 0.6)) || m.state === 'stagger';
    if (def.brain === 'boss' && m.state !== 'stagger' && m.hp > 0) {
      m.stagger += dmg;
      if (m.stagger > m.maxHp * 0.12) { m.stagger = 0; m.state = 'stagger'; m.t = 0; m.vx = 0; this.events.push({ t: 'stagger' }); }
    }
    if (flinch && m.hp > 0) {
      m.vx = dir * k.kx * def.knock;
      if (k.ky < 0 || !m.ground) { m.vy = Math.min(m.vy, k.ky < 0 ? k.ky * def.knock : -220); m.ground = false; m.on = null; }
      if (m.state !== 'stagger') { m.state = 'hurt'; m.t = -k.stun + 0.35; }
      m.face = dir > 0 ? -1 : 1;
    }
    if (m.hp <= 0) this.killMob(m);
  }

  private killMob(m: Mob): void {
    const def = MOBS[m.kind], h = this.hero;
    m.hp = 0; m.state = 'dead'; m.deadT = 0; m.vy = Math.min(m.vy, -300); m.ground = false; m.on = null;
    this.run.kills++;
    this.events.push({ t: 'mobDie', x: m.x, y: m.y, boss: def.brain === 'boss' });
    this.events.push({ t: 'xp', n: Math.round(mobXp(m.kind, m.lv) * (m.elite ? ELITE.xp : 1)) });
    const cr = Math.round(mobCrumbs(m.lv, def.brain) * (m.elite ? 4 : 1) * (0.8 + this.rand() * 0.4));
    this.run.crumbs += cr;
    this.events.push({ t: 'crumbs', n: cr, x: m.x, y: m.y - def.h });
    if (h.d.lifeOnKill > 0) h.hp = Math.min(h.d.maxHp, h.hp + h.d.maxHp * h.d.lifeOnKill);
    const drops = def.brain === 'boss' ? 3 : m.elite ? 2 : this.rand() < def.dropChance ? 1 : 0;
    for (let i = 0; i < drops; i++) {
      const big = def.brain === 'boss' || m.elite;
      const tier = Math.max(def.brain === 'boss' ? 3 : m.elite ? 2 : 1, rollTier(dropLevel(m.lv) + (big ? 2 : 0), this.rand)) as BoxTier;
      const b: Box = { id: nextId++, tier, ilvl: m.lv, x: m.x + (i - (drops - 1) / 2) * 50, y: m.y - 20, vy: -420 - i * 60, ground: false, t: 0 };
      this.boxes.push(b);
      this.events.push({ t: 'drop', id: b.id, tier, x: b.x, y: b.y });
    }
  }

  // ---------- monsters ----------
  private stepMob(m: Mob, dt: number): void {
    const def = MOBS[m.kind], h = this.hero;
    m.t += dt; m.flash = Math.max(0, m.flash - dt); m.hurtShown = Math.max(0, m.hurtShown - dt);
    if (m.state === 'dead') { m.deadT += dt; m.vx *= 0.96; this.physics(m, dt, MAX_FALL, false); return; }
    if (def.brain === 'flyer') { this.stepFlyer(m, dt); return; }
    const dx = h.x - m.x;
    const sameLevel = Math.abs(h.y - m.y) < (def.brain === 'ranged' ? 70 : 40);
    const heroOk = h.state !== 'down';
    const chase = heroOk && (def.brain === 'boss' || (sameLevel && Math.abs(dx) < def.aggro));

    switch (m.state) {
      case 'walk': {
        let dir: number;
        if (chase) {
          dir = Math.sign(dx);
          if (def.brain === 'ranged' && Math.abs(dx) < 150) dir = -dir; // keep its distance
        } else {
          dir = Math.sin(m.t * 0.7 + m.id) > 0 ? 1 : -1;
          if (Math.abs(m.x - m.home) > def.patrol) dir = Math.sign(m.home - m.x);
        }
        if (m.on !== null && m.on >= 0) {
          const p = this.stage.platforms[m.on];
          if ((dir < 0 && m.x - 20 < p.x) || (dir > 0 && m.x + 20 > p.x + p.w)) dir = 0;
        }
        m.vx = approach(m.vx, dir * (chase ? def.speed * 1.4 : def.speed), 800 * dt);
        if (chase) m.face = dx > 0 ? 1 : -1; else if (dir) m.face = dir > 0 ? 1 : -1;
        if (chase && m.ground && m.t > 0.4) {
          const near = Math.abs(dx) < def.range;
          if (def.brain === 'boss') this.bossThink(m, dx);
          else if (near && (def.brain !== 'ranged' || Math.abs(dx) > 90 || m.t > 2)) { m.state = 'windup'; m.t = 0; m.vx = 0; m.move = def.brain; }
        }
        // the boss calls helpers at 66% and 33% HP
        if (def.brain === 'boss' && m.summoned < 2 && m.hp < m.maxHp * (m.summoned ? 0.33 : 0.66)) {
          m.summoned++;
          this.events.push({ t: 'summon' });
          for (const off of [-260, 260]) this.spawnMob(m.summoned === 1 ? 'bun' : 'pepper', clamp(h.x + off, 60, this.stage.width - 60), Math.max(1, m.lv - 3));
        }
        break;
      }
      case 'windup': {
        m.vx = approach(m.vx, 0, 1200 * dt);
        const wind = (m.move === 'charge' ? 0.8 : m.move === 'leap' ? 0.55 : m.move === 'rain' ? 0.8 : def.windup) * TUNE.windup;
        if (m.t > wind) { m.state = 'attack'; m.t = 0; m.hitDone = false; this.beginAttack(m); }
        break;
      }
      case 'attack': this.stepAttack(m, dt); break;
      case 'hurt':
        if (m.ground) m.vx = approach(m.vx, 0, 900 * dt);
        if (m.t > 0.35 && m.ground) { m.state = 'walk'; m.t = 0; }
        break;
      case 'stagger':
        m.vx = approach(m.vx, 0, 900 * dt);
        if (m.t > 1.6) { m.state = 'walk'; m.t = 0; }
        break;
    }
    this.physics(m, dt, MAX_FALL, false);
    m.x = clamp(m.x, 20, this.stage.width - 20);
  }

/** Flyers hover ~80px above their floor, drift near the hero, then swoop at it and float back up. */
  private stepFlyer(m: Mob, dt: number): void {
    const def = MOBS[m.kind], h = this.hero;
    const hoverY = m.homeY - 80 + Math.sin(this.time * 2 + m.id) * 8;
    const dx = h.x - m.x;
    const chase = h.state !== 'down' && Math.abs(dx) < def.aggro && Math.abs(h.y - m.homeY) < 170;
    switch (m.state) {
      case 'walk': {
        const tx = chase ? h.x - Math.sign(dx || 1) * 110 : m.home + Math.sin(m.t * 0.6 + m.id) * def.patrol;
        m.vx = approach(m.vx, clamp((tx - m.x) * 2, -def.speed, def.speed), 600 * dt);
        m.vy = approach(m.vy, (hoverY - m.y) * 3, 900 * dt);
        if (chase) m.face = dx > 0 ? 1 : -1; else if (Math.abs(m.vx) > 5) m.face = m.vx > 0 ? 1 : -1;
        if (chase && m.t > 1.3 && Math.abs(dx) < def.range) { m.state = 'windup'; m.t = 0; m.move = 'swoop'; }
        break;
      }
      case 'windup':
        m.vx = approach(m.vx, 0, 800 * dt); m.vy = approach(m.vy, -40, 400 * dt);
        if (m.t > def.windup) {
          m.state = 'attack'; m.t = 0; m.hitDone = false;
          const tx = h.x, ty = h.y - 30, d = Math.hypot(tx - m.x, ty - m.y) || 1;
          m.vx = (tx - m.x) / d * 430; m.vy = (ty - m.y) / d * 430;
        }
        break;
      case 'attack':
        if (!m.hitDone && Math.abs(h.x - m.x) < 32 && m.y > h.y - 80 && m.y < h.y + 10) { m.hitDone = true; this.hurtHero(m.atk, Math.sign(m.vx) || 1); }
        if (m.t > 0.75) { m.state = 'walk'; m.t = 0; }
        break;
      default:
        m.vx = approach(m.vx, 0, 600 * dt); m.vy = approach(m.vy, 0, 900 * dt);
        if (m.t > 0.4) { m.state = 'walk'; m.t = 0; }
    }
    m.x = clamp(m.x + m.vx * dt, 20, this.stage.width - 20);
    m.y = Math.min(m.y + m.vy * dt, m.homeY - 16);
    m.ground = false; m.on = null;
  }

  private bossThink(m: Mob, dx: number): void {
    const r = this.rand();
    const moves = MOBS[m.kind].moves ?? ['slash'];
    const close = Math.abs(dx) < 150;
    let move = close ? (r < 0.6 ? 'slash' : 'leap') : r < 0.45 ? 'charge' : r < 0.85 ? 'leap' : 'slash';
    if (moves.includes('rain') && this.rand() < (m.hp < m.maxHp / 2 ? 0.4 : 0.25)) move = 'rain';
    if (!moves.includes(move)) move = moves[Math.floor(this.rand() * moves.length)];
    if (move === 'slash' && Math.abs(dx) > 170) return; // walk closer first
    m.state = 'windup'; m.t = 0; m.vx = 0; m.move = move;
    m.face = dx > 0 ? 1 : -1;
    this.events.push({ t: 'mobAttack', id: m.id, kind: move });
  }

  private beginAttack(m: Mob): void {
    const h = this.hero;
    switch (m.move) {
      case 'walker': m.vx = m.face * 260; break;
      case 'hopper': m.vx = m.face * Math.min(380, Math.abs(h.x - m.x) * 2 + 120); m.vy = -520; m.ground = false; m.on = null; break;
      case 'ranged':
        this.shots.push({ id: nextId++, x: m.x + m.face * 24, y: m.y - 40, vx: m.face * 380, vy: -60, t: 0, dmg: m.atk, hit: new Set(), from: 'mob', kx: 200, ky: -200, pierce: false });
        this.events.push({ t: 'mobAttack', id: m.id, kind: 'throw' });
        break;
      case 'brute': break;
      case 'charge': m.vx = m.face * 560; break;
      case 'leap': m.vx = clamp((h.x - m.x) * 1.4, -520, 520); m.vy = -760; m.ground = false; m.on = null; break;
      case 'slash': break;
      case 'rain': // icicles fall over the hero
        for (let i = 0; i < 5; i++) {
          const x = clamp(h.x + (i - 2) * 90 + (this.rand() - 0.5) * 40, 30, this.stage.width - 30);
          this.shots.push({ id: nextId++, x, y: h.y - 330 - i * 30, vx: 0, vy: 120, t: 0, dmg: m.atk, hit: new Set(), from: 'mob', kx: 120, ky: -160, pierce: false, g: 900, kind: 'icicle' });
        }
        break;
    }
  }

  private stepAttack(m: Mob, dt: number): void {
    const h = this.hero, def = MOBS[m.kind];
    const touch = (reach: number, hgt = 60) => Math.abs(h.x - (m.x + m.face * reach / 2)) < reach / 2 + HERO_W / 2 && h.y > m.y - def.h - 10 && h.y - hgt < m.y + 4;
    switch (m.move) {
      case 'walker':
        m.vx = approach(m.vx, 0, 900 * dt);
        if (m.t < 0.2 && touch(56)) this.hurtHero(m.atk, m.face);
        if (m.t > 0.5) this.endAttack(m);
        break;
      case 'hopper':
        if (!m.ground && touch(40)) this.hurtHero(m.atk, m.face);
        if (m.ground && m.t > 0.15) { m.vx = approach(m.vx, 0, 1600 * dt); if (m.t > 0.6) this.endAttack(m); }
        break;
      case 'ranged':
        if (m.t > 0.5) this.endAttack(m);
        break;
      case 'brute':
        if (!m.hitDone && m.t > 0.1) { m.hitDone = true; this.events.push({ t: 'shock', x: m.x + m.face * 50, y: m.y, r: 70 }); if (touch(110, 80)) this.hurtHero(m.atk, m.face); }
        if (m.t > 0.7) this.endAttack(m);
        break;
      case 'charge':
        if (touch(def.w * 0.6, 100)) this.hurtHero(m.atk, m.face);
        if (m.t > 1.3 || m.x <= 40 || m.x >= this.stage.width - 40) { m.vx = approach(m.vx, 0, 2400 * dt); if (Math.abs(m.vx) < 5) this.endAttack(m); }
        break;
      case 'leap':
        if (m.ground && !m.hitDone && m.t > 0.1) {
          m.hitDone = true; m.vx = 0;
          this.events.push({ t: 'shock', x: m.x, y: m.y, r: 170 });
          if (Math.abs(h.x - m.x) < 170 && h.ground) this.hurtHero(Math.round(m.atk * 1.2), Math.sign(h.x - m.x) || 1);
        }
        if (m.hitDone && m.t > 0.9) this.endAttack(m);
        break;
      case 'rain':
        if (m.t > 0.9) this.endAttack(m);
        break;
      case 'slash':
        if (!m.hitDone && m.t > 0.08) { m.hitDone = true; if (touch(def.range + 20, 120)) this.hurtHero(Math.round(m.atk * 1.1), m.face); }
        if (m.t > 0.7) this.endAttack(m);
        break;
    }
  }

  private endAttack(m: Mob): void { m.state = 'walk'; m.t = 0; m.move = ''; }

  private hurtHero(raw: number, dir: number): void {
    const h = this.hero;
    if (h.inv > 0 || h.state === 'down') return;
    const dr = 1 - (1 - h.d.dr) * (1 - (h.buff?.def ?? 0)) * (1 - (h.boosts.def?.[0] ?? 0));
    const dmg = Math.max(1, Math.round(raw * (1 - dr) * (0.9 + this.rand() * 0.2)));
    h.hp -= dmg; h.inv = 0.9;
    this.run.hitsTaken++; this.run.dmgTaken += dmg;
    this.events.push({ t: 'hit', x: h.x, y: h.y - 60, dmg, crit: false, target: 'hero' });
    if (h.hp <= 0 && h.revives > 0) { // Second Helping
      h.revives--; this.run.revived++;
      h.hp = Math.round(h.d.maxHp * 0.5); h.inv = 2.5;
      this.events.push({ t: 'revive' });
      return;
    }
    if (h.hp <= 0) { h.hp = 0; this.enter(h, 'down'); h.buff = null; return; }
    if (h.state === 'skill' || h.buff?.armor) return; // super armour
    this.enter(h, 'hurt');
    h.vx = dir * 220; h.vy = -260; h.ground = false; h.on = null;
  }

  private stepShots(dt: number): void {
    const h = this.hero;
    for (const s of this.shots) {
      s.t += dt; s.x += s.vx * dt; s.y += s.vy * dt;
      if (s.from === 'mob') {
        s.vy += (s.g ?? 300) * dt;
        if (Math.abs(h.x - s.x) < 22 && s.y > h.y - 70 && s.y < h.y + 4 && h.inv <= 0) { this.hurtHero(s.dmg, Math.sign(s.vx)); s.t = 99; }
        continue;
      }
      for (const m of this.mobs) {
        if (m.state === 'dead' || s.hit.has(m.id)) continue;
        const def = MOBS[m.kind];
        if (Math.abs(m.x - s.x) < def.w / 2 + 14 && s.y < m.y + 10 && s.y > m.y - def.h - 10) {
          s.hit.add(m.id);
          this.damageMob(m, s.dmg, Math.sign(s.vx), { kx: s.kx, ky: s.ky, stun: 0.6 }, true);
          if (!s.pierce) { s.t = 99; break; }
        }
      }
    }
    this.shots = this.shots.filter(s => s.t < (s.from === 'mob' ? 2.5 : 0.9) && s.x > 0 && s.x < this.stage.width && s.y < this.stage.groundY + 20);
  }

  private stepMines(dt: number): void {
    for (const mi of this.mines) {
      mi.t += dt;
      if (mi.t < 0.3) continue;
      const hit = this.mobs.some(m => m.state !== 'dead' && Math.abs(m.x - mi.x) < MOBS[m.kind].w / 2 + 16 && Math.abs(m.y - mi.y) < 30);
      if (hit || mi.t > 10) {
        mi.t = 99;
        this.events.push({ t: 'boom', x: mi.x, y: mi.y });
        const ids = new Set<number>();
        for (const m of this.mobs) {
          if (m.state === 'dead' || ids.has(m.id)) continue;
          if (Math.abs(m.x - mi.x) < 70 && Math.abs(m.y - mi.y) < 60) { ids.add(m.id); this.damageMob(m, mi.dmg, Math.sign(m.x - mi.x) || 1, { kx: mi.kx, ky: mi.ky, stun: 0.7 }, true); }
        }
      }
    }
    this.mines = this.mines.filter(m => m.t < 99);
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
        b.t = -1e9;
        this.loot.push({ tier: b.tier, ilvl: b.ilvl });
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

  private platformAt(x: number, y: number): number | null {
    const i = this.stage.platforms.findIndex(p => Math.abs(p.y - y) < 3 && x >= p.x && x <= p.x + p.w);
    return i >= 0 ? i : null;
  }

  ladderAt(x: number, y: number) {
    return this.stage.ladders.find(l => Math.abs(l.x - x) < 22 && y >= l.top - 2 && y <= l.bottom + 2) ?? null;
  }
}

/** Stage rank from time, hits taken and best combo. */
export function rankOf(run: RunStats, par: number): { rank: 'S' | 'A' | 'B' | 'C' | 'D'; score: number } {
  const timeScore = Math.max(0, Math.min(40, 40 * (1.6 - run.time / par) / 0.6));
  const hitScore = Math.max(0, 35 - run.hitsTaken * 3);
  const comboScore = Math.min(25, run.maxCombo * 1.2);
  const score = Math.round(timeScore + hitScore + comboScore);
  const rank = score >= 85 ? 'S' : score >= 70 ? 'A' : score >= 50 ? 'B' : score >= 30 ? 'C' : 'D';
  return { rank, score };
}

function approach(v: number, target: number, step: number): number {
  return v < target ? Math.min(v + step, target) : Math.max(v - step, target);
}
function clamp(v: number, a: number, b: number): number { return Math.max(a, Math.min(b, v)); }
