// Draws a hero as a cutout puppet (parts sheet + RIGS) and animates it procedurally from sim state.
// Kaiju without a rig fall back to their single Kitchen Kaiju sprite with the same body motion.
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
}

const BASE: Pose = { y: 0, lean: 0, sx: 1, sy: 1, whole: 0, r: {}, lift: [0, 0] };
const ease = (p: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, p)), 3);

/** Procedural animation: everything comes from the hero's state, its timer and speed. */
export function poseFor(h: Hero, time: number, walkPhase: number): Pose {
  const p: Pose = { ...BASE, r: {}, lift: [0, 0] };
  const run = Math.min(1, Math.abs(h.vx) / h.cls.speed);
  const tailSway = Math.sin(time * 3) * 0.12;
  switch (h.state) {
    case 'move': {
      if (run > 0.1) {
        const s = Math.sin(walkPhase), c = Math.cos(walkPhase);
        p.y = -Math.abs(c) * 5 * run;
        p.lean = 0.1 * run;
        p.r = { legA: s * 0.7 * run, legB: -s * 0.7 * run, arm: -s * 0.8 * run, armBack: s * 0.6 * run, tail: s * 0.2 + 0.1, wing: Math.sin(time * 18) * 0.25, wingBack: -Math.sin(time * 18) * 0.2 };
        p.lift = [Math.max(0, -c) * 6 * run, Math.max(0, c) * 6 * run];
      } else {
        const b = Math.sin(time * 3);
        p.y = b * 1.5; p.sy = 1 + b * 0.02; p.sx = 1 - b * 0.015;
        p.r = { arm: b * 0.08, armBack: -b * 0.06, tail: tailSway, wing: b * 0.12, wingBack: -b * 0.1 };
      }
      break;
    }
    case 'air': {
      const up = h.vy < 0;
      p.sy = up ? 1.06 : 0.97; p.sx = up ? 0.95 : 1.02;
      p.lean = up ? -0.05 : 0.08;
      p.r = { legA: -0.5, legB: 0.45, arm: up ? -1.6 : -0.9, armBack: up ? -1.2 : -0.6, tail: up ? 0.35 : -0.2, wing: h.gliding ? -0.9 + Math.sin(time * 26) * 0.35 : -0.5, wingBack: h.gliding ? -0.7 : -0.4 };
      p.lift = [4, 2];
      break;
    }
    case 'attack': {
      const atk = h.step < 0 ? h.cls.air : h.cls.combo[h.step];
      const [a, b] = atk.hit;
      const wind = ease(h.t / a), strike = ease((h.t - a) / Math.max(0.01, b - a)), rec = ease((h.t - b) / Math.max(0.01, atk.dur - b));
      const phase = h.t < a ? 0 : h.t < b ? 1 : 2;
      // three different swings: jab, backhand, big uppercut finisher; air = downward swipe
      const shape = h.step < 0 ? [-2.2, 1.4] : h.step === 0 ? [-1.4, 1.3] : h.step === 1 ? [1.4, -1.0] : [1.5, -2.6];
      const arm = phase === 0 ? shape[0] * wind : phase === 1 ? shape[0] + (shape[1] - shape[0]) * strike : shape[1] * (1 - rec);
      const leanTo = h.step === 2 ? -0.18 : 0.22;
      p.lean = phase === 0 ? -0.12 * wind : phase === 1 ? leanTo * strike : leanTo * (1 - rec);
      p.sx = phase === 1 ? 1.08 : 1; p.sy = phase === 1 ? 0.95 : 1;
      if (h.step === 2 && phase >= 1) { p.y = -10 * (phase === 1 ? strike : 1 - rec); p.sy = 1.08; p.sx = 0.94; }
      p.r = { arm, armBack: -arm * 0.4, legA: phase === 1 ? 0.5 : 0.2, legB: phase === 1 ? -0.4 : -0.2, tail: phase === 1 ? -0.4 : 0.1, wing: -arm * 0.3, wingBack: arm * 0.2 };
      if (!h.ground) { p.r.legA = -0.5; p.r.legB = 0.4; }
      break;
    }
    case 'skill': {
      const sk = h.cls.skill, q = h.t / sk.dur;
      if (sk.kind === 'cone') { // rear back, then spray forward
        const k = q < 0.25 ? -ease(q / 0.25) : Math.sin(Math.min(1, (q - 0.25) / 0.5) * Math.PI) ;
        p.lean = k * 0.25; p.sx = 1 + Math.max(0, k) * 0.12; p.sy = 1 - Math.max(0, k) * 0.06;
        p.r = { arm: -0.6 - Math.max(0, k) * 0.6, tail: -k * 0.5, legA: 0.3, legB: -0.3 };
      } else if (sk.kind === 'slam') {
        const k = q < 0.5 ? ease(q / 0.5) : 1 - ease((q - 0.5) / 0.5);
        p.sy = q < 0.5 ? 1 + k * 0.1 : 0.82 + (1 - k) * 0.18; p.sx = q < 0.5 ? 0.94 : 1.15 - (1 - k) * 0.15;
        p.r = { arm: q < 0.5 ? -2.6 : 1.2, armBack: q < 0.5 ? -2.4 : 1.0 };
      } else if (sk.kind === 'dash') {
        p.lean = 0.45; p.sx = 1.15; p.sy = 0.9; p.y = -2;
        p.r = { legA: 0.9, legB: -0.9, arm: 1.2, armBack: 1.0, tail: -0.3 };
      } else {
        const k = Math.sin(Math.min(1, q) * Math.PI);
        p.lean = -0.1 * k; p.r = { arm: -1.4 * k, wing: -0.8 * k, wingBack: -0.6 * k };
      }
      break;
    }
    case 'climb': {
      const s = Math.sin(h.y * 0.12);
      p.r = { arm: -2.4 + s * 0.4, armBack: -2.2 - s * 0.4, legA: s * 0.4, legB: -s * 0.4, tail: 0.2 };
      p.lift = [Math.max(0, s) * 5, Math.max(0, -s) * 5];
      break;
    }
    case 'hurt':
      p.lean = -0.3; p.sx = 0.92; p.sy = 1.05;
      p.r = { arm: -1.2, armBack: -1, legA: -0.4, legB: 0.3, tail: 0.5 };
      break;
    case 'down':
      p.whole = -1.45 * ease(h.t / 0.3); p.y = 0;
      p.r = { arm: -0.5, legA: 0.4, legB: 0.6 };
      break;
  }
  return p;
}

interface Built { def: PartDef; img: Phaser.GameObjects.Image; x: number; y: number }

export class HeroView {
  readonly root: Phaser.GameObjects.Container;
  private parts: Built[] = [];
  private body: Built | null = null;
  private single: Phaser.GameObjects.Image | null = null;
  private rig: RigDef | null;
  private scale = 1;
  private walk = 0;

  constructor(scene: Phaser.Scene, species: number, has: (k: string) => boolean, height = 84) {
    this.root = scene.add.container(0, 0);
    const rig = RIGS[species];
    this.rig = rig && has(`parts-${species}-0`) ? rig : null;
    if (this.rig) {
      const r = this.rig;
      this.scale = r.scale;
      for (const def of [...r.parts].sort((a, b) => a.depth - b.depth)) {
        const img = scene.add.image(0, 0, `parts-${species}-${def.piece}`).setOrigin(def.pivot[0], def.pivot[1]).setScale(r.scale);
        if (def.flip) img.setFlipX(true);
        if (def.tint) img.setTint(def.tint);
        const b: Built = { def, img, x: (def.joint[0] - r.root[0]) * r.scale, y: (def.joint[1] - r.root[1]) * r.scale };
        this.parts.push(b);
        if (def.role === 'body') this.body = b;
        this.root.add(img);
      }
    } else {
      const key = `kaiju-${species}`;
      this.single = scene.add.image(0, 0, key).setOrigin(0.5, 1);
      this.scale = height / this.single.height;
      this.single.setScale(this.scale);
      this.root.add(this.single);
    }
  }

  update(h: Hero, time: number, dt: number): void {
    this.walk += Math.abs(h.vx) * dt * 0.055;
    const p = poseFor(h, time, this.walk);
    this.apply(p);
    this.root.setPosition(h.x, h.y);
    this.root.scaleX = h.face;
    this.root.rotation = p.whole * h.face;
    const blink = h.inv > 0 && h.state !== 'down' && Math.floor(time * 16) % 2 === 0;
    this.root.setAlpha(blink ? 0.45 : 1);
  }

  /** Pose the pieces. Parts attached to the body follow its bob, lean and squash. */
  apply(p: Pose): void {
    if (this.single) {
      this.single.setPosition(0, p.y).setRotation(p.lean).setScale(this.scale * p.sx, this.scale * p.sy);
      return;
    }
    const body = this.body!;
    const cos = Math.cos(p.lean), sin = Math.sin(p.lean);
    for (const b of this.parts) {
      const rest = b.def.rest ?? 0;
      const rot = p.r[b.def.role] ?? 0;
      if (b === body) {
        b.img.setPosition(b.x, b.y + p.y).setRotation(p.lean).setScale(this.scale * p.sx, this.scale * p.sy);
        continue;
      }
      if (b.def.role === 'legA' || b.def.role === 'legB') {
        const lift = b.def.role === 'legA' ? p.lift[0] : p.lift[1];
        b.img.setPosition(b.x, b.y + p.y * 0.6 - lift).setRotation(rest + rot);
        continue;
      }
      // attached to the body: transform the joint by the body's squash + lean about the hips
      const dx = (b.x - body.x) * p.sx, dy = (b.y - body.y) * p.sy;
      b.img.setPosition(body.x + dx * cos - dy * sin, body.y + p.y + dx * sin + dy * cos).setRotation(rest + rot + p.lean);
    }
  }

  /** Flash solid white (hit) or back to normal (null). */
  flash(on: boolean): void {
    const imgs = this.single ? [this.single] : this.parts.map(b => b.img);
    for (const img of imgs) {
      const def = this.parts.find(b => b.img === img)?.def;
      if (on) img.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);
      else { img.setTintMode(Phaser.TintModes.MULTIPLY); if (def?.tint) img.setTint(def.tint); else img.clearTint(); }
    }
  }

  destroy(): void { this.root.destroy(); }
}
