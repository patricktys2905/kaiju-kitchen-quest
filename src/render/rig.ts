// Draws a hero as a cutout puppet (parts sheet + RIGS) and animates it procedurally from sim state.
// Natural motion: poses give TARGET angles; tails, wings and idle arms follow on springs (follow-through),
// landing and turning squash the body, legs either swing (walkers), shuffle (Bluebeary) or dangle (Mothball hovers).
import * as Phaser from 'phaser';
import type { Hero } from '../sim/world';
import { RIGS, type PartDef, type RigDef, type Role } from './rigs';

export interface Pose {
  y: number;        // body lift (world px, negative = up)
  lean: number;     // body rotation about the hips
  sx: number; sy: number; // squash & stretch
  whole: number;    // whole-character rotation (knocked down)
  r: Partial<Record<Role, number>>; // limb rotations (added to rest)
  lift: [number, number]; // legA / legB raise (px)
  step: [number, number]; // legA / legB forward offset (px, shuffle walkers)
  snap: boolean;    // attack/skill: arms follow the pose exactly (no spring lag)
}

const ease = (p: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, p)), 3);

/** Procedural animation: everything comes from the hero's state, its timer and speed. */
export function poseFor(h: Hero, time: number, walkPhase: number, rig: RigDef | null): Pose {
  const p: Pose = { y: 0, lean: 0, sx: 1, sy: 1, whole: 0, r: {}, lift: [0, 0], step: [0, 0], snap: false };
  const cls = h.d.cls;
  const run = Math.min(1, Math.abs(h.vx) / cls.speed);
  const shuffle = rig?.legs === 'shuffle';
  const hopper = rig?.legs === 'none';
  const flap = Math.sin(time * (rig?.hover ? 14 : 4));
  switch (h.state) {
    case 'move': {
      if (run > 0.1 && hopper) {
        // legless: bounce along in little hops, squashing on each landing
        const hp = Math.abs(Math.sin(walkPhase));
        const contact = 1 - Math.min(1, hp / 0.3);
        p.y = -hp * 13 * run;
        p.sy = 1 + (hp * 0.06 - contact * 0.13) * run; p.sx = 1 + (contact * 0.1 - hp * 0.04) * run;
        p.lean = (0.05 + Math.cos(walkPhase * 2) * 0.04) * run;
        p.r = { arm: -0.3 - hp * 0.9 * run, armBack: -0.2 - hp * 0.7 * run, tail: hp * 0.2 };
      } else if (run > 0.1) {
        const s = Math.sin(walkPhase), c = Math.cos(walkPhase);
        p.y = -Math.abs(c) * 4 * run;
        p.lean = 0.07 * run;
        p.sy = 1 - Math.abs(s) * 0.025 * run; p.sx = 1 + Math.abs(s) * 0.02 * run;
        const legSwing = shuffle ? 0.15 : 0.55;
        p.r = { legA: s * legSwing * run, legB: -s * legSwing * run, arm: -s * 0.55 * run, armBack: s * 0.45 * run, tail: s * 0.12, wing: flap * 0.3, wingBack: -flap * 0.25 };
        p.lift = [Math.max(0, -c) * 5 * run, Math.max(0, c) * 5 * run];
        if (shuffle) p.step = [s * 7 * run, -s * 7 * run];
      } else {
        const b = Math.sin(time * 2.6);
        p.y = b * 1.2; p.sy = 1 + b * 0.018; p.sx = 1 - b * 0.012;
        p.r = { arm: 0.05 + b * 0.06, armBack: -b * 0.05, tail: Math.sin(time * 1.7) * 0.1, wing: flap * 0.18, wingBack: -flap * 0.14 };
      }
      break;
    }
    case 'air': {
      const up = h.vy < 0;
      p.sy = up ? 1.06 : 0.98; p.sx = up ? 0.95 : 1.02;
      p.lean = up ? -0.04 : 0.06;
      const glide = h.gliding;
      p.r = { legA: shuffle ? 0.1 : -0.45, legB: shuffle ? -0.1 : 0.4, arm: up ? -1.3 : -0.7, armBack: up ? -1.0 : -0.5, tail: up ? 0.3 : -0.15,
        wing: glide ? -0.6 + Math.sin(time * 9) * 0.15 : -0.3 + Math.sin(time * 22) * 0.45, wingBack: glide ? -0.5 : -0.2 + Math.sin(time * 22) * 0.35 };
      p.lift = [4, 2];
      break;
    }
    case 'attack': {
      p.snap = true;
      const atk = h.step < 0 ? cls.air : cls.combo[h.step];
      const [a, b] = atk.hit;
      const wind = ease(h.t / a), strike = ease((h.t - a) / Math.max(0.01, b - a)), rec = ease((h.t - b) / Math.max(0.01, atk.dur - b));
      const phase = h.t < a ? 0 : h.t < b ? 1 : 2;
      // jab, backhand, big uppercut finisher; air = downward swipe. Kept inside ±1.6 rad so arms stay attached.
      const shape = h.step < 0 ? [-1.5, 1.1] : h.step === 0 ? [-1.1, 1.0] : h.step === 1 ? [1.0, -0.8] : [1.2, -1.6];
      const arm = phase === 0 ? shape[0] * wind : phase === 1 ? shape[0] + (shape[1] - shape[0]) * strike : shape[1] * (1 - rec);
      const leanTo = h.step === 2 ? -0.12 : 0.16;
      p.lean = phase === 0 ? -0.08 * wind : phase === 1 ? leanTo * strike : leanTo * (1 - rec);
      p.sx = phase === 1 ? 1.06 : 1; p.sy = phase === 1 ? 0.96 : 1;
      if (h.step === 2 && phase >= 1) { p.y = -8 * (phase === 1 ? strike : 1 - rec); p.sy = 1.06; p.sx = 0.95; }
      p.r = { arm, armBack: -arm * 0.35, legA: phase === 1 ? 0.35 : 0.15, legB: phase === 1 ? -0.3 : -0.15, tail: phase === 1 ? -0.3 : 0.1, wing: -arm * 0.25, wingBack: arm * 0.2 };
      if (shuffle) { p.step = [phase === 1 ? 6 : 0, phase === 1 ? -4 : 0]; p.r.legA = 0; p.r.legB = 0; }
      if (!h.ground) { p.r.legA = shuffle ? 0 : -0.45; p.r.legB = shuffle ? 0 : 0.4; }
      break;
    }
    case 'skill': {
      p.snap = true;
      const sk = h.skill!, q = h.t / sk.dur;
      switch (sk.kind) {
        case 'cone': {
          const k = q < 0.2 ? -ease(q / 0.2) : Math.sin(Math.min(1, (q - 0.2) / 0.5) * Math.PI);
          p.lean = k * 0.2; p.sx = 1 + Math.max(0, k) * 0.1; p.sy = 1 - Math.max(0, k) * 0.05;
          p.r = { arm: -0.5 - Math.max(0, k) * 0.5, tail: -k * 0.4 };
          break;
        }
        case 'slam': {
          const k = q < 0.45 ? ease(q / 0.45) : 1 - ease((q - 0.45) / 0.55);
          p.sy = q < 0.45 ? 1 + k * 0.08 : 0.84 + (1 - k) * 0.16; p.sx = q < 0.45 ? 0.95 : 1.12 - (1 - k) * 0.12;
          p.r = { arm: q < 0.45 ? -1.5 : 1.0, armBack: q < 0.45 ? -1.4 : 0.8 };
          break;
        }
        case 'dash': p.lean = 0.35; p.sx = 1.12; p.sy = 0.92; p.y = -2; p.r = { legA: 0.7, legB: -0.7, arm: 1.1, armBack: 0.9, tail: -0.25 }; break;
        case 'uppercut': p.lean = -0.2; p.sy = 1.1; p.sx = 0.92; p.r = { arm: -1.6, armBack: -0.6, legA: -0.4, legB: 0.5, tail: 0.4 }; break;
        case 'spin': p.whole = (h.t * 18) % (Math.PI * 2); p.r = { arm: 1.3, armBack: 1.1, tail: -0.4 }; break;
        case 'nova': { const k = Math.min(1, q / 0.55); p.sy = 1 + 0.12 * k * (q < 0.55 ? 1 : -0.5); p.sx = 1 - 0.06 * k; p.r = { arm: -1.5 * k, armBack: -1.3 * k, wing: -0.9 * k, wingBack: -0.8 * k }; break; }
        case 'buff': { const k = Math.sin(Math.min(1, q) * Math.PI); p.sy = 1 + 0.08 * k; p.r = { arm: -1.4 * k, armBack: -1.4 * k, wing: -0.6 * k }; break; }
        default: { const k = Math.sin(Math.min(1, q) * Math.PI); p.lean = -0.08 * k; p.r = { arm: -1.3 * k, wing: -0.6 * k, wingBack: -0.5 * k }; }
      }
      break;
    }
    case 'climb': {
      const s = Math.sin(h.y * 0.12);
      p.r = { arm: -1.6 + s * 0.35, armBack: -1.5 - s * 0.35, legA: s * 0.35, legB: -s * 0.35, tail: 0.15 };
      p.lift = [Math.max(0, s) * 5, Math.max(0, -s) * 5];
      break;
    }
    case 'hurt':
      p.lean = -0.25; p.sx = 0.93; p.sy = 1.05;
      p.r = { arm: -1.0, armBack: -0.8, legA: -0.3, legB: 0.25, tail: 0.4 };
      break;
    case 'down':
      p.whole = -1.45 * ease(h.t / 0.3);
      p.r = { arm: -0.4, legA: 0.3, legB: 0.5 };
      break;
  }
  if (rig?.hover && h.state !== 'down' && h.state !== 'climb') p.y += rig.fly ? -16 + Math.sin(time * 3) * 4 : -6 + Math.sin(time * 3) * 3;
  if (rig?.fly && h.state !== 'down') { // wings never stop
    const f = Math.sin(time * 16);
    p.r.wing = (p.r.wing ?? 0) * 0.5 - 0.25 + f * 0.45; p.r.wingBack = (p.r.wingBack ?? 0) * 0.5 - 0.15 + f * 0.35;
  }
  return p;
}

/** What the hero is wearing (icons from the item bases), for the paper-doll look. */
export interface GearLook {
  weapon?: { icon: string; base: string; rarity: number; plus?: number };
  armor?: { icon: string; base: string; rarity: number };
  charm?: { icon: string; rarity: number };
}
type Anchor = 'hand' | 'chest' | 'neck' | 'back';
interface Attach { img: Phaser.GameObjects.Image; glow?: Phaser.GameObjects.Image; outline: Phaser.GameObjects.Image[]; strong: boolean; anchor: Anchor; rot: number; swing: boolean; a: number; v: number }
const RARITY_GLOW = [0, 0, 0, 0x6ab8ff, 0xc88aff, 0xffb02e];
/** Where each weapon icon's handle is (0..1 in the icon). All icons point their head to the top-left (~-133°). */
const GRIP: Record<string, [number, number]> = { spoon: [0.76, 0.8], fork: [0.8, 0.82], whisk: [0.63, 0.76], pin: [0.84, 0.84], icepick: [0.82, 0.82], fish: [0.84, 0.84] };
const ICON_ANGLE = -2.33;
/** Weapon direction at rest relative to the arm: forward and a little up. */
const HOLD_ANGLE = -0.55;

interface Built { def: PartDef; img: Phaser.GameObjects.Image; x: number; y: number; a: number; v: number }

export class HeroView {
  readonly root: Phaser.GameObjects.Container;
  private parts: Built[] = [];
  private body: Built | null = null;
  private single: Phaser.GameObjects.Image | null = null;
  private rig: RigDef | null;
  private scale = 1;
  private walk = 0;
  private squash = 0;   // landing squash timer
  private turn = 0;     // turn-around squash timer
  private lastFace = 1;
  private wasGround = true;
  private lean = 0;
  private gear: Attach[] = [];
  private arm: Built | null = null;

  constructor(scene: Phaser.Scene, species: number, has: (k: string) => boolean, height = 84, look: GearLook = {}) {
    this.root = scene.add.container(0, 0);
    const rig = RIGS[species];
    this.rig = rig && has(`parts-${species}-0`) ? rig : null;
    if (this.rig) {
      const r = this.rig;
      this.scale = r.scale;
      const order: { d: number; o: Phaser.GameObjects.GameObject }[] = [];
      for (const def of r.parts) {
        const img = scene.add.image(0, 0, `parts-${species}-${def.piece}`).setOrigin(def.pivot[0], def.pivot[1]).setScale(r.scale);
        if (def.flip) img.setFlipX(true);
        if (def.tint) img.setTint(def.tint);
        const b: Built = { def, img, x: (def.joint[0] - r.root[0]) * r.scale, y: (def.joint[1] - r.root[1]) * r.scale, a: 0, v: 0 };
        this.parts.push(b);
        if (def.role === 'body') this.body = b;
        order.push({ d: def.depth, o: img });
      }
      this.arm = this.parts.find(b => b.def.role === (r.holder ?? 'arm')) ?? null;
      // gear: weapon in the paw, apron on the belly / mitt on the paw / pot lid on the back, charm at the neck
      const armD = this.arm?.def.depth ?? 1;
      const add = (key: string, anchor: Anchor, px: number, origin: [number, number], depth: number, rot = 0, rarity = 0, swing = false, glowColor = 0) => {
        if (!has(key) || (anchor === 'hand' && !this.arm)) return;
        const img = scene.add.image(0, 0, key).setOrigin(origin[0], origin[1]);
        img.setScale(px * r.gear.size / img.height);
        let glow: Phaser.GameObjects.Image | undefined;
        const gc = glowColor || RARITY_GLOW[rarity];
        if (gc) {
          glow = scene.add.image(0, 0, key).setOrigin(origin[0], origin[1]).setScale(img.scaleX * (glowColor ? 1.5 : 1.25)).setTint(gc).setTintMode(Phaser.TintModes.FILL).setAlpha(0.5).setBlendMode(Phaser.BlendModes.ADD);
          order.push({ d: depth - 0.01, o: glow });
        }
        order.push({ d: depth, o: img });
        // fortify glow: an even coloured outline from 8 offset copies behind the item
        const outline: Phaser.GameObjects.Image[] = [];
        if (glowColor) {
          if (glow) { const gi = order.findIndex(e => e.o === glow); if (gi >= 0) order.splice(gi, 1); glow.destroy(); glow = undefined; }
          for (let k = 0; k < 8; k++) {
            const o = scene.add.image(0, 0, key).setOrigin(origin[0], origin[1]).setScale(img.scaleX).setTint(glowColor).setTintMode(Phaser.TintModes.FILL);
            o.setData('a', (k / 8) * Math.PI * 2);
            outline.push(o); order.push({ d: depth - 0.02, o });
          }
        }
        this.gear.push({ img, glow, outline, strong: !!glowColor, anchor, rot, swing, a: 0, v: 0 });
      };
      if (look.armor?.base === 'lid') add(look.armor.icon, 'back', 32, [0.5, 0.5], -3.6, -0.35);
      if (look.armor?.base === 'apron') add(look.armor.icon, 'chest', 30, [0.5, 0.2], 0.3);
      // fortified weapons glow: +7 blue, +10 purple, +13 gold (stronger than the rarity glow)
      const fp = look.weapon?.plus ?? 0;
      const fortGlow = fp >= 13 ? 0xffc83c : fp >= 10 ? 0xc070ff : fp >= 7 ? 0x5ab0ff : 0;
      if (look.weapon) add(look.weapon.icon, 'hand', 38, GRIP[look.weapon.base] ?? [0.8, 0.8], armD + 0.5, HOLD_ANGLE - ICON_ANGLE, look.weapon.rarity, false, fortGlow);
      if (look.armor?.base === 'mitt') add(look.armor.icon, 'hand', 18, [0.5, 0.45], armD + 0.7, 0.2);
      if (look.charm) add(look.charm.icon, 'neck', 13, [0.5, 0.05], 0.4, 0, 0, true);
      for (const e of order.sort((a, b) => a.d - b.d)) this.root.add(e.o);
    } else {
      this.single = scene.add.image(0, 0, `kaiju-${species}`).setOrigin(0.5, 1);
      this.scale = height / this.single.height;
      this.single.setScale(this.scale);
      this.root.add(this.single);
    }
  }

  update(h: Hero, time: number, dt: number): void {
    this.walk += Math.abs(h.vx) * dt * (this.rig?.legs === 'none' ? 0.042 : 0.05);
    const p = poseFor(h, time, this.walk, this.rig);
    if (h.ground && !this.wasGround) this.squash = 0.16;
    this.wasGround = h.ground;
    if (h.face !== this.lastFace) { this.turn = 0.12; this.lastFace = h.face; }
    if (this.squash > 0) { const k = this.squash / 0.16; p.sy *= 1 - 0.12 * k; p.sx *= 1 + 0.1 * k; this.squash -= dt; }
    if (this.turn > 0) { p.sx *= 1 - 0.18 * (this.turn / 0.12); this.turn -= dt; }
    // body lean eases (snappy during moves)
    this.lean += (p.lean - this.lean) * Math.min(1, dt * (p.snap ? 30 : 12));
    p.lean = this.lean;
    this.apply(p, dt);
    this.root.setPosition(h.x, h.y);
    this.root.scaleX = h.face;
    this.root.rotation = p.whole * h.face;
    const blink = h.inv > 0 && h.state !== 'down' && Math.floor(time * 16) % 2 === 0;
    this.root.setAlpha(blink ? 0.45 : 1);
  }

  /** Pose the pieces. Attached parts follow the body; tails/wings/arms ride springs for follow-through. */
  apply(p: Pose, dt = 1 / 60): void {
    if (this.single) {
      this.single.setPosition(0, p.y).setRotation(p.lean).setScale(this.scale * p.sx, this.scale * p.sy);
      return;
    }
    const body = this.body!;
    const cos = Math.cos(p.lean), sin = Math.sin(p.lean);
    for (const b of this.parts) {
      const role = b.def.role;
      const target = (b.def.rest ?? 0) + (p.r[role] ?? 0);
      const springy = role === 'tail' || role === 'wing' || role === 'wingBack' || ((role === 'arm' || role === 'armBack') && !p.snap);
      if (springy) {
        const k = role === 'tail' ? 90 : role.startsWith('wing') ? 260 : 170, damp = role === 'tail' ? 9 : 14;
        b.v += ((target - b.a) * k - b.v * damp) * dt;
        b.a += b.v * dt;
      } else { b.a = target; b.v = 0; }
      if (b === body) {
        b.img.setPosition(b.x, b.y + p.y).setRotation(p.lean).setScale(this.scale * p.sx, this.scale * p.sy);
        continue;
      }
      if (role === 'legA' || role === 'legB') {
        const i = role === 'legA' ? 0 : 1;
        b.img.setPosition(b.x + p.step[i], b.y + (this.rig?.hover ? p.y : p.y * 0.5) - p.lift[i]).setRotation(b.a);
        continue;
      }
      const dx = (b.x - body.x) * p.sx, dy = (b.y - body.y) * p.sy;
      b.img.setPosition(body.x + dx * cos - dy * sin, body.y + p.y + dx * sin + dy * cos).setRotation(b.a + p.lean);
    }
    this.placeGear(p, dt, cos, sin);
  }

  private placeGear(p: Pose, dt: number, cos: number, sin: number): void {
    if (!this.gear.length || !this.rig || !this.body) return;
    const r = this.rig, body = this.body;
    for (const g of this.gear) {
      let x: number, y: number, rot: number;
      if (g.anchor === 'hand') {
        const a = this.arm!, img = a.img;
        const hx = (r.gear.hand[0] - a.def.pivot[0]) * img.width * r.scale, hy = (r.gear.hand[1] - a.def.pivot[1]) * img.height * r.scale;
        const ar = img.rotation, c = Math.cos(ar), s = Math.sin(ar);
        x = img.x + hx * c - hy * s; y = img.y + hx * s + hy * c; rot = ar + g.rot;
      } else {
        const pt = r.gear[g.anchor];
        const bx = (pt[0] - r.root[0]) * r.scale, by = (pt[1] - r.root[1]) * r.scale;
        const dx = (bx - body.x) * p.sx, dy = (by - body.y) * p.sy;
        x = body.x + dx * cos - dy * sin; y = body.y + p.y + dx * sin + dy * cos; rot = p.lean + g.rot;
      }
      if (g.swing) { // charms dangle: a little pendulum that lags behind body motion
        g.v += ((-p.lean * 1.5 - g.a) * 60 - g.v * 4) * dt; g.a += g.v * dt; rot += g.a;
      }
      g.img.setPosition(x, y).setRotation(rot);
      g.glow?.setPosition(x, y).setRotation(rot).setAlpha(0.35 + Math.sin(performance.now() / 260) * 0.15);
      if (g.outline.length) {
        const pulse = 1.6 + Math.sin(performance.now() / 180) * 0.6;
        for (const o of g.outline) { const a = o.getData('a') as number; o.setPosition(x + Math.cos(a) * pulse, y + Math.sin(a) * pulse).setRotation(rot).setAlpha(0.85); }
      }
    }
  }

  /** Flash solid white (hit) or back to normal. */
  flash(on: boolean): void {
    const all = this.single ? [{ img: this.single, tint: undefined as number | undefined }] : [...this.parts.map(b => ({ img: b.img, tint: b.def.tint })), ...this.gear.map(g => ({ img: g.img, tint: undefined as number | undefined }))];
    for (const { img, tint } of all) {
      if (on) img.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);
      else { img.setTintMode(Phaser.TintModes.MULTIPLY); if (tint) img.setTint(tint); else img.clearTint(); }
    }
  }

  destroy(): void { this.root.destroy(); }
}
