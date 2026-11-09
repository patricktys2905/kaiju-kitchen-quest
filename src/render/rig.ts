// Draws a hero as a cutout puppet (parts sheet + RIGS) and animates it procedurally from sim state.
// Natural motion: poses give TARGET angles; tails, wings and idle arms follow on springs (follow-through),
// landing and turning squash the body, legs either swing (walkers), shuffle (Bluebeary) or dangle (Mothball hovers).
import * as Phaser from 'phaser';
import type { Hero } from '../sim/world';
import { partXf } from './layout';
import { RIGS, type PartDef, type RigDef } from './rigs';

export { type Pose, poseFor } from './pose';
import { type Pose, poseFor } from './pose';

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
const GRIP: Record<string, [number, number]> = { spoon: [0.76, 0.8], fork: [0.8, 0.82], whisk: [0.63, 0.76], pin: [0.84, 0.84], icepick: [0.82, 0.82], fish: [0.84, 0.84], spatula: [0.85, 0.86], skewer: [0.86, 0.86] };
const ICON_ANGLE = -2.33;
const ARMOR_SPOT: Record<string, 'chest' | 'back'> = {
  apron: 'chest', cozy: 'chest', foil: 'chest', lid: 'back',
  'a-gob': 'back', 'a-blue': 'chest', 'a-pizza': 'chest', 'a-moth': 'chest', 'a-squid': 'chest', 'a-crab': 'back', 'a-toast': 'back', 'a-dump': 'chest',
  'a-gob2': 'chest', 'a-gob3': 'chest', 'a-blue2': 'chest', 'a-blue3': 'chest', 'a-pizza2': 'chest', 'a-pizza3': 'chest', 'a-moth2': 'back', 'a-moth3': 'chest',
  'a-squid2': 'chest', 'a-squid3': 'chest', 'a-crab2': 'back', 'a-crab3': 'chest', 'a-toast2': 'chest', 'a-toast3': 'chest', 'a-dump2': 'chest', 'a-dump3': 'chest',
  'a-nori1': 'chest', 'a-nori2': 'chest', 'a-nori3': 'chest', 'a-choco1': 'chest', 'a-choco2': 'chest', 'a-choco3': 'chest',
  'a-hog1': 'chest', 'a-hog2': 'back', 'a-hog3': 'chest', 'a-peng1': 'chest', 'a-peng2': 'chest', 'a-peng3': 'chest', pantry: 'chest',
};
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
      // armor: where each piece sits (back = behind the body, chest = over the belly)
      const spot = look.armor && ARMOR_SPOT[look.armor.base];
      if (look.armor && spot === 'back') add(look.armor.icon, 'back', look.armor.base === 'lid' ? 32 : 40, [0.5, 0.5], -3.6, look.armor.base === 'lid' ? -0.35 : -0.15);
      if (look.armor && spot === 'chest') add(look.armor.icon, 'chest', 30, [0.5, 0.2], 0.3);
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
    const body = this.body!, rig = this.rig!;
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
      const xf = partXf(rig, b.def, body.def, p, b.a);
      b.img.setPosition(xf.x, xf.y).setRotation(xf.rot).setScale(xf.sx, xf.sy);
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
