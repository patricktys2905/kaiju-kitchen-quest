// The playable stage: parallax kitchen, platforms + ladders, the rigged hero, mobs, loot boxes, hit effects.
import * as Phaser from 'phaser';
import { initHud, toast, updateHud } from '../hud';
import { readInput, takeTaps } from '../input';
import { CLASSES } from '../sim/classes';
import { TIER_COLORS, TIER_NAMES } from '../sim/loot';
import { MOBS } from '../sim/mobs';
import { STAGES } from '../sim/stages';
import type { SimEvent } from '../sim/types';
import { DT, World } from '../sim/world';
import { HeroView } from '../render/rig';
import { setSkillUi } from '../touch';

export const CANVAS = { w: 1920, h: 1080 };
const ZOOM = 3;                      // world px → canvas px
// Visible world is 360 px tall; its width follows the screen shape (canvas EXPANDs to fill wide phones).
let VW = CANVAS.w / ZOOM, SX = 0;
const VH = CANVAS.h / ZOOM;
// scrollFactor-0 objects are laid out in this box (the camera zooms about the canvas centre)
const SY = CANVAS.h / 2 - VH / 2;
function measure(width: number): void { VW = width / ZOOM; SX = width / 2 - VW / 2; }

let manifest: string[] = [];
const MID = 0.16; // mid parallax layer scale

export class GameScene extends Phaser.Scene {
  private world!: World;
  private hero!: HeroView;
  private species = 0;
  private acc = 0;
  private cx = 0; private cy = 0;
  private far?: Phaser.GameObjects.Image;
  private mid?: Phaser.GameObjects.TileSprite;
  private mobImgs = new Map<number, Phaser.GameObjects.Image>();
  private boxImgs = new Map<number, { img: Phaser.GameObjects.Image; glow: Phaser.GameObjects.Arc }>();
  private boltImgs = new Map<number, Phaser.GameObjects.Arc>();
  private heroShadow!: Phaser.GameObjects.Ellipse;
  private fx!: Phaser.GameObjects.Graphics;
  private shake = 0;
  private hitStop = 0;

  constructor() { super('game'); }

  preload(): void {
    this.load.json('manifest', 'art/manifest.json');
    this.load.once('filecomplete-json-manifest', (_k: string, _t: string, data: string[]) => {
      manifest = data;
      for (const k of data) this.load.image(k, `art/${k}.webp`);
    });
  }

  private has(k: string): boolean { return manifest.includes(k) && this.textures.exists(k); }

  create(): void {
    const q = new URLSearchParams(location.search);
    this.species = Number(q.get('hero') ?? 0);
    const st = STAGES[0];
    this.world = new World(st, this.species, Date.now() & 0xffff);
    measure(this.scale.width);
    this.scale.on('resize', (g: Phaser.Structs.Size) => { measure(g.width); this.mid?.setSize(VW, 1080 * MID); });
    const cam = this.cameras.main.setZoom(ZOOM).setBackgroundColor('#f6dcb4');

    // far background + mid parallax layer (screen-space, moved manually)
    if (this.has('bg-far')) this.far = this.add.image(SX, SY, 'bg-far').setOrigin(0, 0).setScrollFactor(0).setDepth(-100);
    if (this.has('bg-mid')) {
      this.mid = this.add.tileSprite(SX, SY + VH, VW, 1080 * MID, 'bg-mid').setOrigin(0, 1).setScrollFactor(0).setDepth(-90);
      this.mid.setTileScale(MID, MID).setTint(0xe8dcd8);
    }
    // ground
    const gh = 200;
    if (this.has('tile-ground')) this.add.tileSprite(0, st.groundY - 8, st.width, gh, 'tile-ground').setOrigin(0, 0).setTileScale(0.24, 0.24).setDepth(-10);
    else this.add.rectangle(0, st.groundY, st.width, gh, 0x9a6a3a).setOrigin(0, 0);
    this.add.rectangle(0, st.groundY - 8, st.width, 4, 0x000000, 0.12).setOrigin(0, 0).setDepth(-9);
    // ladders, then platforms on top
    for (const l of st.ladders) {
      if (this.has('ob-ladder')) this.add.image(l.x, l.top - 12, 'ob-ladder').setOrigin(0.5, 0).setDisplaySize(44, l.bottom - l.top + 12).setDepth(-6);
      else this.add.rectangle(l.x, l.top, 30, l.bottom - l.top, 0xc89050).setOrigin(0.5, 0);
    }
    for (const p of st.platforms) {
      this.add.ellipse(p.x + p.w / 2, st.groundY - 4, p.w * 0.8, 10, 0x000000, 0.1).setDepth(-9);
      if (this.has('plat-board')) this.add.image(p.x + p.w / 2, p.y - 6, 'plat-board').setOrigin(0.5, 0.08).setDisplaySize(p.w + 28, 38).setDepth(-5);
      else this.add.rectangle(p.x, p.y, p.w, 16, 0xa0703c).setOrigin(0, 0);
    }
    this.heroShadow = this.add.ellipse(0, 0, 54, 12, 0x000000, 0.22).setDepth(-2);
    this.fx = this.add.graphics().setDepth(20);
    this.buildHero();
    this.cx = this.world.hero.x; this.cy = st.groundY - 100;
    cam.centerOn(this.cx, this.cy);

    initHud(s => this.switchHero(s));
    (window as unknown as { __kkq: unknown }).__kkq = { scene: this, world: () => this.world, setPose: (s: string, t: number) => this.debugPose(s, t) };
  }

  private buildHero(): void {
    this.hero?.destroy();
    this.hero = new HeroView(this, this.species, k => this.has(k));
    this.hero.root.setDepth(5);
  }

  private switchHero(species: number): void {
    if (species === this.species) return;
    const old = this.world;
    this.species = species;
    this.world = new World(old.stage, species, Date.now() & 0xffff);
    this.world.hero.x = old.hero.x; this.world.hero.y = old.hero.y; this.world.hero.ground = old.hero.ground; this.world.hero.on = old.hero.on;
    this.world.loot = old.loot;
    // keep the same mobs and boxes
    this.world.mobs = old.mobs; this.world.boxes = old.boxes;
    this.buildHero();
    toast(CLASSES.find(c => c.species === species)!.name);
  }

  /** Debug/screenshot helper: freeze the hero in a state at time t. */
  private debugPose(state: string, t: number): void {
    const h = this.world.hero;
    this.paused = true;
    Object.assign(h, { state, t, step: state === 'attack' ? Math.floor(t) : 0, vx: state === 'run' ? h.cls.speed : 0, inv: 0 });
    if (state === 'run') h.state = 'move';
    if (state === 'attack') h.t = t % 1 * h.cls.combo[h.step].dur;
    this.hero.update(h, t, 1 / 60);
  }
  private paused = false;

  update(_time: number, deltaMs: number): void {
    for (const k of takeTaps()) {
      const n = ['Digit1', 'Digit2', 'Digit3', 'Digit4'].indexOf(k);
      if (n >= 0) this.switchHero(CLASSES[n].species);
    }
    if (this.paused) return;
    const dt = Math.min(0.05, deltaMs / 1000);
    if (this.hitStop > 0) { this.hitStop -= dt; } else {
      this.acc += dt;
      while (this.acc >= DT) {
        this.acc -= DT;
        this.onEvents(this.world.step(readInput())); // read per step: quick taps are latched until a step uses them
      }
    }
    this.draw(dt);
  }

  private onEvents(evs: SimEvent[]): void {
    for (const e of evs) {
      switch (e.t) {
        case 'hit': {
          const col = e.target === 'hero' ? '#ff5a6a' : e.crit ? '#ffd23c' : '#ffffff';
          const txt = this.add.text(e.x + Phaser.Math.Between(-8, 8), e.y, String(e.dmg), {
            fontFamily: 'Luckiest Guy', fontSize: e.crit ? '26px' : '20px', color: col, stroke: '#3a1020', strokeThickness: 5,
          }).setOrigin(0.5).setDepth(30).setResolution(3);
          this.tweens.add({ targets: txt, y: e.y - 46, duration: 700, ease: 'Cubic.easeOut' });
          this.tweens.add({ targets: txt, alpha: 0, delay: 450, duration: 300, onComplete: () => txt.destroy() });
          if (e.target === 'mob') {
            this.burst(e.x, e.y, e.crit ? 0xffd23c : 0xffffff, e.crit ? 10 : 6);
            this.hitStop = e.crit ? 0.07 : 0.045;
            this.shake = Math.max(this.shake, e.crit ? 5 : 2.5);
          } else this.shake = 6;
          break;
        }
        case 'swing': this.slash(e.step); break;
        case 'skill': this.skillFx(); break;
        case 'mobDie': this.burst(e.x, e.y - 24, 0xc8f0a0, 14); break;
        case 'drop': toast(`${TIER_NAMES[e.tier]} dropped!`, { tier: e.tier }); break;
        case 'pickup': toast(`Got a ${TIER_NAMES[e.tier]}`, { tier: e.tier }); break;
        case 'levelUp': toast(`LEVEL UP! Lv ${e.level}`, { color: '#ffe27a' }); this.burst(this.world.hero.x, this.world.hero.y - 40, 0xffe27a, 20); break;
      }
    }
  }

  private burst(x: number, y: number, color: number, n: number): void {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, d = 18 + Math.random() * 26;
      const dot = this.add.circle(x, y, 2 + Math.random() * 3, color).setDepth(25);
      this.tweens.add({ targets: dot, x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, alpha: 0, scale: 0.3, duration: 260 + Math.random() * 200, ease: 'Cubic.easeOut', onComplete: () => dot.destroy() });
    }
  }

  /** A swoosh arc in front of the hero for each combo step. */
  private slash(step: number): void {
    const h = this.world.hero;
    const atk = step < 0 ? h.cls.air : h.cls.combo[step];
    const g = this.add.graphics().setDepth(6);
    const r = atk.reach * 0.8;
    const [a0, a1] = step === 2 ? [100, -80] : step === 1 ? [-60, 60] : step < 0 ? [-80, 90] : [60, -60];
    const col = step === 2 ? 0xffe27a : 0xffffff;
    let t = 0;
    const draw = () => {
      g.clear();
      const k = Math.min(1, t / 0.12);
      const end = a0 + (a1 - a0) * k;
      for (let w = 0; w < 3; w++) {
        g.lineStyle(7 - w * 2, col, (0.65 - w * 0.2) * (1 - Math.max(0, t - 0.12) / 0.14));
        g.beginPath();
        const steps = 10;
        for (let i = 0; i <= steps; i++) {
          const ang = Phaser.Math.DegToRad(a0 + (end - a0) * (i / steps));
          const px = h.x + h.face * (12 + Math.cos(ang) * (r - w * 6)), py = h.y - 40 + Math.sin(ang) * (r - w * 6) * 0.7;
          if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
        }
        g.strokePath();
      }
    };
    this.time.delayedCall(atk.hit[0] * 1000 * 0.8, () => {
      const ev = this.time.addEvent({ delay: 16, loop: true, callback: () => { t += 0.016; draw(); if (t > 0.26) { ev.remove(); g.destroy(); } } });
    });
  }

  private skillFx(): void {
    const h = this.world.hero, sk = h.cls.skill;
    if (sk.kind === 'cone') {
      for (let i = 0; i < 16; i++) {
        const seed = this.add.ellipse(h.x + h.face * 30, h.y - 50, 6, 9, i % 3 ? 0xffe6a0 : 0xff4a6a).setDepth(7);
        const a = (Math.random() - 0.5) * 0.7;
        this.tweens.add({ targets: seed, delay: 100 + i * 8, x: seed.x + h.face * Math.cos(a) * sk.reach, y: seed.y + Math.sin(a) * sk.reach + 20, angle: 360, alpha: 0, duration: 380, onComplete: () => seed.destroy() });
      }
    } else if (sk.kind === 'slam') {
      this.time.delayedCall(320, () => {
        const ring = this.add.ellipse(h.x, h.y, 20, 8).setStrokeStyle(5, 0x7a9aff).setDepth(7);
        this.tweens.add({ targets: ring, scaleX: sk.reach / 10, scaleY: 3, alpha: 0, duration: 380, onComplete: () => ring.destroy() });
        this.burst(h.x - 40, h.y - 6, 0x4a6cff, 8); this.burst(h.x + 40, h.y - 6, 0x4a6cff, 8);
        this.shake = 8;
      });
    } else if (sk.kind === 'dash') {
      for (let i = 0; i < 5; i++) this.time.delayedCall(i * 45, () => {
        const ghost = this.add.ellipse(h.x, h.y - 40, 70, 60, 0xff7a3c, 0.35).setDepth(4);
        this.tweens.add({ targets: ghost, alpha: 0, scaleX: 1.4, duration: 260, onComplete: () => ghost.destroy() });
      });
    }
  }

  private draw(dt: number): void {
    const w = this.world, st = w.stage, h = w.hero, t = this.time.now / 1000;
    // camera follows, clamped to the stage (done manually; zoom is about the canvas centre)
    const tx = h.x + h.face * 40, ty = Math.min(h.y - 70, st.groundY + 90 - VH / 2);
    this.cx += (tx - this.cx) * Math.min(1, dt * 5);
    this.cy += (ty - this.cy) * Math.min(1, dt * 3);
    this.cx = Phaser.Math.Clamp(this.cx, VW / 2, st.width - VW / 2);
    this.cy = Phaser.Math.Clamp(this.cy, VH / 2 - 60, st.groundY + 90 - VH / 2);
    this.shake = Math.max(0, this.shake - dt * 30);
    const sx = (Math.random() - 0.5) * this.shake, sy = (Math.random() - 0.5) * this.shake;
    this.cameras.main.centerOn(this.cx + sx, this.cy + sy);

    // parallax
    const fx = (this.cx - VW / 2) / Math.max(1, st.width - VW); // 0..1 across the stage
    if (this.far) {
      const fh = VH * 1.35, fw = fh * (this.far.width / this.far.height);
      this.far.setDisplaySize(fw, fh).setPosition(SX - fx * (fw - VW), SY - (fh - VH) * 0.55 - (this.cy - 200) * 0.06);
    }
    if (this.mid) {
      this.mid.x = SX;
      this.mid.tilePositionX = (this.cx * 0.4) / MID;
      this.mid.y = SY + VH / 2 + (st.groundY - this.cy) * 0.75 + 4;
    }

    // hero
    this.hero.update(h, t, dt);
    const floor = w.floorBelow(h.x, h.y, h.y + 2000, false);
    const fy = floor ? floor.y : st.groundY;
    const lift = Math.min(1, (fy - h.y) / 200);
    this.heroShadow.setPosition(h.x, fy - 1).setScale(1 - lift * 0.5).setAlpha(h.state === 'climb' ? 0 : 1);
    this.hero.flash(h.state === 'hurt' && h.t < 0.08);

    // mobs
    const seen = new Set<number>();
    for (const m of w.mobs) {
      seen.add(m.id);
      let img = this.mobImgs.get(m.id);
      const def = MOBS[m.kind];
      if (!img) {
        img = this.has('mob-bun') ? this.add.image(0, 0, 'mob-bun') : this.add.image(0, 0, '__WHITE').setTint(0xa08040);
        img.setOrigin(0.5, 0.95).setDepth(3);
        img.setData('s', (def.h + 10) / img.height);
        this.mobImgs.set(m.id, img);
      }
      const s0 = img.getData('s') as number;
      const wob = m.state === 'walk' && Math.abs(m.vx) > 5 ? Math.sin(t * 14 + m.id) : 0;
      let sxm = 1 + wob * 0.04, sym = 1 - wob * 0.05, rot = wob * 0.06;
      if (m.state === 'windup') { sxm = 1.12; sym = 0.88; rot = -0.12 * m.face; }
      if (m.state === 'bite') { sxm = 0.9; sym = 1.12; rot = 0.2 * m.face; }
      if (m.state === 'hurt') rot = -0.25 * m.face;
      if (m.state === 'dead') { rot = m.deadT * 12 * -m.face; img.setAlpha(Math.max(0, 1 - m.deadT / 0.6)); }
      img.setPosition(m.x, m.y).setScale(s0 * sxm, s0 * sym).setRotation(rot).setFlipX(m.face > 0);
      if (m.flash > 0) img.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);
      else if (m.state === 'windup' && Math.floor(t * 12) % 2 === 0) img.setTint(0xff8080).setTintMode(Phaser.TintModes.MULTIPLY);
      else img.clearTint().setTintMode(Phaser.TintModes.MULTIPLY);
    }
    for (const [id, img] of this.mobImgs) if (!seen.has(id)) { img.destroy(); this.mobImgs.delete(id); }

    // boxes
    const seenB = new Set<number>();
    for (const b of w.boxes) {
      seenB.add(b.id);
      let o = this.boxImgs.get(b.id);
      if (!o) {
        const glow = this.add.circle(0, 0, 22, TIER_COLORS[b.tier], 0.35).setDepth(1).setBlendMode(Phaser.BlendModes.ADD);
        const img = this.has(`box-${b.tier}`) ? this.add.image(0, 0, `box-${b.tier}`) : this.add.image(0, 0, '__WHITE').setTint(TIER_COLORS[b.tier]);
        img.setOrigin(0.5, 1).setDepth(2).setScale(32 / img.height);
        o = { img, glow };
        this.boxImgs.set(b.id, o);
      }
      const bob = b.ground ? Math.sin(t * 3 + b.id) * 2 - 2 : 0;
      o.img.setPosition(b.x, b.y + bob);
      o.glow.setPosition(b.x, b.y - 14 + bob).setScale(1 + Math.sin(t * 4) * 0.12 + b.tier * 0.1).setAlpha(0.2 + b.tier * 0.07);
    }
    for (const [id, o] of this.boxImgs) if (!seenB.has(id)) {
      this.tweens.add({ targets: o.img, y: o.img.y - 30, alpha: 0, duration: 250, onComplete: () => o.img.destroy() });
      o.glow.destroy(); this.boxImgs.delete(id);
    }

    // bolts
    const seenP = new Set<number>();
    for (const b of w.bolts) {
      seenP.add(b.id);
      let c = this.boltImgs.get(b.id);
      if (!c) { c = this.add.circle(0, 0, 10, 0xe8c8ff).setStrokeStyle(3, 0xffffff).setDepth(8).setBlendMode(Phaser.BlendModes.ADD); this.boltImgs.set(b.id, c); }
      c.setPosition(b.x, b.y).setScale(1 + Math.sin(t * 30) * 0.15);
      if (Math.random() < 0.6) { const s = this.add.circle(b.x, b.y + (Math.random() - 0.5) * 12, 3, 0xffd8ff).setDepth(7); this.tweens.add({ targets: s, alpha: 0, duration: 250, onComplete: () => s.destroy() }); }
    }
    for (const [id, c] of this.boltImgs) if (!seenP.has(id)) { c.destroy(); this.boltImgs.delete(id); }

    this.fx.clear();
    updateHud(h, w.loot);
    setSkillUi(h.cls.skill.name, h.skillCd / h.cls.skill.cd);
  }
}
