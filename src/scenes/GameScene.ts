// The playable stage: parallax kitchen, platforms + ladders, the rigged hero, monsters (with level plates),
// the boss, loot boxes, skill effects, the exit. Started from the camp; reports results back to the save.
import * as Phaser from 'phaser';
import { playMusic, sfx, toggleMute } from '../audio';
import { initHud, showHud, showPause, toast, updateHud } from '../hud';
import { readInput, takeTaps } from '../input';
import { TIER_COLORS, TIER_NAMES } from '../sim/loot';
import { CONSUMABLES } from '../sim/consumables';
import { ELITE, MOBS } from '../sim/mobs';
import { skillsOf, skillScale } from '../sim/skills';
import { STAGES, stageById, worldOf } from '../sim/stages';
import { derive } from '../sim/stats';
import type { SimEvent, StageDef } from '../sim/types';
import { DT, HARD_LV, type Mob, World, rankOf } from '../sim/world';
import { type GearLook, HeroView } from '../render/rig';
import { BASES } from '../sim/items';
import type { HeroProfile } from '../sim/stats';
import { addXp, finishStage, hero, quickBag, save, syncQuickBag } from '../save';
import { setSkillUi, setTouchVisible } from '../touch';
import { hideCamp, runGacha, showCamp, showResult, stageUnlocked } from '../ui/camp';

/** Equipped items → what to draw on the kaiju. */
export function lookOf(p: HeroProfile): GearLook {
  const e = p.equip, ic = (b: string) => BASES[b].icon;
  return {
    weapon: e.weapon && { icon: ic(e.weapon.base), base: e.weapon.base, rarity: e.weapon.rarity },
    armor: e.armor && { icon: ic(e.armor.base), base: e.armor.base, rarity: e.armor.rarity },
    charm: e.charm && { icon: ic(e.charm.base), rarity: e.charm.rarity },
  };
}

export const CANVAS = { w: 1920, h: 1080 };
const ZOOM = 3;
let VW = CANVAS.w / ZOOM, SX = 0;
const VH = CANVAS.h / ZOOM;
const SY = CANVAS.h / 2 - VH / 2;
function measure(width: number): void { VW = width / ZOOM; SX = width / 2 - VW / 2; }
const MID = 0.16;

let manifest: string[] = [];
let uiReady = false;

interface MobView { img: Phaser.GameObjects.Image; plate: Phaser.GameObjects.Text; bar: Phaser.GameObjects.Rectangle; barBg: Phaser.GameObjects.Rectangle; shadow: Phaser.GameObjects.Ellipse; s: number }

export class GameScene extends Phaser.Scene {
  private world: World | null = null;
  private stage!: StageDef;
  private hero!: HeroView;
  private acc = 0;
  private cx = 0; private cy = 0;
  private far?: Phaser.GameObjects.Image;
  private mid?: Phaser.GameObjects.TileSprite;
  private mobViews = new Map<number, MobView>();
  private boxImgs = new Map<number, { img: Phaser.GameObjects.Image; glow: Phaser.GameObjects.Arc }>();
  private shotImgs = new Map<number, Phaser.GameObjects.Shape>();
  private mineImgs = new Map<number, Phaser.GameObjects.Arc>();
  private heroShadow!: Phaser.GameObjects.Ellipse;
  private aura!: Phaser.GameObjects.Ellipse;
  private exit!: Phaser.GameObjects.Container;
  private shake = 0;
  private hitStop = 0;
  private paused = false;
  private xpGained = 0;
  private levels = 0;
  private done = false;
  private hard = false;
  /** Hard mode is open for a world once its boss is beaten. */
  private hardOk(): boolean { return !!save.cleared[`${this.stage.world}-10`]; }

  constructor() { super('game'); }

  preload(): void {
    if (manifest.length) return;
    this.load.json('manifest', 'art/manifest.json');
    this.load.once('filecomplete-json-manifest', (_k: string, _t: string, data: string[]) => {
      manifest = data;
      for (const k of data) this.load.image(k, `art/${k}.webp`);
    });
  }

  private has(k: string): boolean { return manifest.includes(k) && this.textures.exists(k); }

  create(data: { stage?: string }): void {
    measure(this.scale.width);
    this.scale.off('resize');
    this.scale.on('resize', (g: Phaser.Structs.Size) => { measure(g.width); this.mid?.setSize(VW, 1080 * MID); });
    if (!uiReady) {
      uiReady = true;
      initHud(() => this.pause(true), () => this.pause(false), () => this.leave());
      (window as unknown as { __kkq: unknown }).__kkq = {
        scene: this, world: () => this.world, setPose: (s: string, t: number) => this.debugPose(s, t),
        play: (id: string) => this.scene.restart({ stage: id }), save,
      };
    }
    this.mobViews.clear(); this.boxImgs.clear(); this.shotImgs.clear(); this.mineImgs.clear();
    this.world = null; this.done = false; this.paused = false; this.xpGained = 0; this.levels = 0; this.acc = 0;
    if (!data?.stage) {
      // camp: the HTML menus cover the screen
      setTouchVisible(false); showHud(false);
      this.cameras.main.setBackgroundColor('#1a1020');
      showCamp();
      playMusic('camp');
      return;
    }
    hideCamp();
    this.stage = stageById(data.stage);
    this.buildStage();
  }

  private buildStage(): void {
    const st = this.stage, p = hero();
    this.hard = save.hard && this.hardOk();
    this.world = new World(st, derive(p), (Date.now() & 0xffff) + 1, quickBag(), save.items.revive ?? 0, this.hard);
    const cam = this.cameras.main.setZoom(ZOOM).setBackgroundColor('#f6dcb4');
    const bg = this.has(st.bg) ? st.bg : 'bg-far';
    this.far = this.has(bg) ? this.add.image(SX, SY, bg).setOrigin(0, 0).setScrollFactor(0).setDepth(-100) : undefined;
    this.mid = undefined;
    if (st.mid && this.has(st.mid)) this.mid = this.add.tileSprite(SX, SY + VH, VW, 1080 * MID, st.mid).setOrigin(0, 1).setScrollFactor(0).setDepth(-90).setTileScale(MID, MID).setTint(0xe8dcd8);
    const gh = 200;
    const tile = this.has(st.tile) ? st.tile : 'tile-ground';
    if (this.has(tile)) this.add.tileSprite(0, st.groundY - 8, st.width, gh, tile).setOrigin(0, 0).setTileScale(0.24, 0.24).setDepth(-10).setTint(st.boss && tile === 'tile-ground' ? 0x9a8078 : 0xffffff);
    else this.add.rectangle(0, st.groundY, st.width, gh, 0x9a6a3a).setOrigin(0, 0);
    this.add.rectangle(0, st.groundY - 8, st.width, 4, 0x000000, 0.12).setOrigin(0, 0).setDepth(-9);
    for (const l of st.ladders) {
      if (this.has('ob-ladder')) this.add.image(l.x, l.top - 12, 'ob-ladder').setOrigin(0.5, 0).setDisplaySize(44, l.bottom - l.top + 12).setDepth(-6);
    }
    for (const pl of st.platforms) {
      this.add.ellipse(pl.x + pl.w / 2, st.groundY - 4, pl.w * 0.8, 10, 0x000000, 0.1).setDepth(-9);
      if (this.has('plat-board')) this.add.image(pl.x + pl.w / 2, pl.y - 6, 'plat-board').setOrigin(0.5, 0.08).setDisplaySize(pl.w + 28, 38).setDepth(-5).setTint(st.platTint);
    }
    // exit: a glowing golden plate that appears once the stage is cleared
    const w = this.world;
    const glow = this.add.ellipse(0, -30, 70, 110, 0xffe27a, 0.35).setBlendMode(Phaser.BlendModes.ADD);
    const plate = this.add.ellipse(0, -2, 80, 16, 0xffd23c).setStrokeStyle(3, 0xa06010);
    const label = this.add.text(0, -80, 'EXIT ➜', { fontFamily: 'Luckiest Guy', fontSize: '20px', color: '#ffe27a', stroke: '#5a2a08', strokeThickness: 5 }).setOrigin(0.5).setResolution(3);
    this.exit = this.add.container(w.exitX, st.groundY, [glow, plate, label]).setDepth(-3).setVisible(false);
    this.tweens.add({ targets: glow, scaleX: 1.2, scaleY: 1.1, alpha: 0.2, yoyo: true, repeat: -1, duration: 700 });

    this.heroShadow = this.add.ellipse(0, 0, 54, 12, 0x000000, 0.22).setDepth(-2);
    this.aura = this.add.ellipse(0, 0, 80, 100, 0x9fe0ff, 0.25).setDepth(4).setBlendMode(Phaser.BlendModes.ADD).setVisible(false);
    this.hero = new HeroView(this, p.species, k => this.has(k), 84, lookOf(p));
    this.hero.root.setDepth(5);
    this.cx = w.hero.x; this.cy = st.groundY - 100;
    cam.centerOn(this.cx, this.cy);
    setTouchVisible(true); showHud(true);
    playMusic(st.boss ? 'boss' : st.world === 2 ? 'world2' : 'world1');
    if (st.boss) this.time.delayedCall(900, () => sfx('boss'));
    toast(`${st.num} ${st.name}${this.hard ? ' · HARD' : ''}`, { big: true, color: this.hard ? '#ff7a6a' : undefined });
    if (st.boss) this.time.delayedCall(1200, () => toast(`The ${MOBS[st.mobs[0].kind].name} awaits!`, { color: '#ff9a6a' }));
  }

  /** Debug/screenshot helper: freeze the hero in a state at time t. */
  private debugPose(state: string, t: number): void {
    const w = this.world; if (!w) return;
    const h = w.hero;
    this.paused = true;
    const sk = skillsOf(h.d.cls.species).actives[0];
    Object.assign(h, { state, t, step: state === 'attack' ? Math.floor(t) : 0, vx: state === 'run' ? h.d.cls.speed : 0, inv: 0, skill: sk, ground: state !== 'air', vy: state === 'air' ? -200 : 0 });
    if (state === 'run') h.state = 'move';
    if (state === 'attack') h.t = t % 1 * h.d.cls.combo[h.step].dur;
    if (state === 'skill') h.t = t * sk.dur;
    for (let i = 0; i < 30; i++) this.hero.update(h, t + i / 60, 1 / 60); // settle the springs
  }

  private pause(on: boolean): void {
    if (!this.world || this.done) return;
    this.paused = on; showPause(on); setTouchVisible(!on);
  }

  private leave(): void { showPause(false); this.scene.restart({}); }

  update(_time: number, deltaMs: number): void {
    for (const k of takeTaps()) {
      if (k === 'Escape' && this.world && !this.done) this.pause(!this.paused);
      if (k === 'KeyM') toast(toggleMute() ? 'Sound off' : 'Sound on');
    }
    const w = this.world;
    if (!w || this.paused) return;
    const dt = Math.min(0.05, deltaMs / 1000);
    if (this.hitStop > 0) this.hitStop -= dt;
    else if (!this.done) {
      this.acc += dt;
      while (this.acc >= DT) {
        this.acc -= DT;
        this.onEvents(w.step(readInput()));
      }
    }
    this.draw(dt);
  }

  private onEvents(evs: SimEvent[]): void {
    const w = this.world!;
    for (const e of evs) {
      switch (e.t) {
        case 'hit': {
          const col = e.target === 'hero' ? '#ff5a6a' : e.crit ? '#ffd23c' : '#ffffff';
          const txt = this.add.text(e.x + Phaser.Math.Between(-10, 10), e.y, String(e.dmg), {
            fontFamily: 'Luckiest Guy', fontSize: e.crit ? '26px' : '19px', color: col, stroke: '#3a1020', strokeThickness: 5,
          }).setOrigin(0.5).setDepth(30).setResolution(3);
          this.tweens.add({ targets: txt, y: e.y - 46, duration: 700, ease: 'Cubic.easeOut' });
          this.tweens.add({ targets: txt, alpha: 0, delay: 450, duration: 300, onComplete: () => txt.destroy() });
          sfx(e.target === 'hero' ? 'hurt' : e.crit ? 'crit' : 'hit');
          if (e.target === 'mob') {
            this.burst(e.x, e.y, e.crit ? 0xffd23c : 0xffffff, e.crit ? 10 : 6);
            this.hitStop = Math.max(this.hitStop, e.crit ? 0.06 : 0.035);
            this.shake = Math.max(this.shake, e.crit ? 5 : 2.5);
          } else this.shake = 6;
          break;
        }
        case 'swing': this.slash(e.step); sfx('swing'); break;
        case 'jump': sfx('jump'); break;
        case 'skill': this.skillFx(e.kind); sfx(e.kind === 'heal' ? 'heal' : 'skill'); break;
        case 'shock': sfx('boom'); this.ring(e.x, e.y, e.r, 0xffe0a0); this.shake = Math.max(this.shake, 7); break;
        case 'boom': sfx('boom'); this.burst(e.x, e.y - 10, 0x4a6cff, 14); this.ring(e.x, e.y, 70, 0x7a9aff); break;
        case 'mobDie':
          sfx('kill');
          this.burst(e.x, e.y - 24, e.boss ? 0xffb347 : 0xc8f0a0, e.boss ? 40 : 14);
          if (e.boss) { this.shake = 14; this.hitStop = 0.4; toast('THE TOAST KING FALLS!', { big: true, color: '#ffb347' }); }
          break;
        case 'xp': {
          this.xpGained += e.n;
          const ups = addXp(hero().species, e.n);
          if (ups) {
            sfx('levelup');
            this.levels += ups;
            w.setDerived(derive(hero()));
            w.hero.hp = w.hero.d.maxHp;
            toast(`LEVEL UP! Lv ${hero().level}`, { color: '#ffe27a' });
            this.burst(w.hero.x, w.hero.y - 40, 0xffe27a, 24);
            this.ring(w.hero.x, w.hero.y - 30, 60, 0xffe27a);
          }
          break;
        }
        case 'pickup': sfx('pickup'); break;
        case 'drop': sfx('drop'); toast(`${TIER_NAMES[e.tier]} dropped!`, { tier: e.tier }); break;
        case 'summon': toast('The King calls for help!', { color: '#ff9a6a' }); break;
        case 'stagger': sfx('stagger'); toast('STAGGERED!', { color: '#ffe27a' }); this.shake = 8; break;
        case 'dodge': {
          sfx('dodge');
          const h = w.hero;
          for (let i = 0; i < 4; i++) this.time.delayedCall(i * 50, () => { const g = this.add.ellipse(h.x, h.y - 40, 60, 70, 0xffffff, 0.3).setDepth(4); this.tweens.add({ targets: g, alpha: 0, scaleX: 1.3, duration: 220, onComplete: () => g.destroy() }); });
          break;
        }
        case 'use': {
          const def = CONSUMABLES[e.id];
          sfx('potion');
          toast(def.name, { color: def.heal ? '#ff8a9a' : '#ffd27a' });
          this.burst(w.hero.x, w.hero.y - 40, def.heal ? 0xff6a8a : 0xffd27a, 14);
          this.ring(w.hero.x, w.hero.y - 30, 50, def.heal ? 0xff8aa0 : 0xffe27a);
          break;
        }
        case 'revive': sfx('levelup'); toast('SECOND HELPING! Revived!', { big: true, color: '#ffe27a' }); this.burst(w.hero.x, w.hero.y - 40, 0xffe27a, 30); this.ring(w.hero.x, w.hero.y - 30, 90, 0xffe27a); break;
        case 'crumbs': {
          sfx('coin');
          const t = this.add.text(e.x, e.y - 10, '+' + e.n + ' 🍪', { fontFamily: 'Nunito', fontStyle: '900', fontSize: '11px', color: '#ffe27a', stroke: '#3a2008', strokeThickness: 3 }).setOrigin(0.5).setDepth(29).setResolution(3);
          this.tweens.add({ targets: t, y: e.y - 40, alpha: 0, duration: 900, delay: 200, onComplete: () => t.destroy() });
          break;
        }
        case 'portal': sfx('portal'); this.exit.setVisible(true); toast('All clear! Head to the EXIT ➜', { color: '#a8f0a8' }); break;
        case 'clear': this.finish(false); break;
        case 'down': this.finish(true); break;
      }
    }
  }

  private finish(failed: boolean): void {
    if (this.done) return;
    this.done = true;
    const w = this.world!, st = this.stage;
    setTouchVisible(false);
    sfx(failed ? 'fail' : 'clear');
    playMusic(null);
    syncQuickBag(w.hero.bag, w.hero.revives);
    save.crumbs += w.run.crumbs;
    const res = failed ? null : finishStage(st.id, rankOf(w.run, st.par).rank, w.loot, st.lv[1] + (this.hard ? HARD_LV : 0), !!st.boss, this.hard);
    this.time.delayedCall(failed ? 600 : 300, () => showResult(
      { stage: st, res, time: w.run.time, hits: w.run.hitsTaken, combo: w.run.maxCombo, xp: this.xpGained, levels: this.levels, failed, crumbs: w.run.crumbs, hard: this.hard },
      a => {
        if (a === 'retry') this.scene.restart({ stage: st.id });
        else if (a === 'next') { const n = STAGES[STAGES.indexOf(st) + 1]; this.scene.restart(n && stageUnlocked(n) ? { stage: n.id } : {}); }
        else if (a === 'boxes') { this.scene.restart({}); setTimeout(() => { showCamp('boxes'); runGacha(save.boxes.map((_, i) => i)); }, 50); }
        else this.scene.restart({});
      }));
  }

  // ---------- effects ----------
  private burst(x: number, y: number, color: number, n: number): void {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, d = 18 + Math.random() * 26;
      const dot = this.add.circle(x, y, 2 + Math.random() * 3, color).setDepth(25);
      this.tweens.add({ targets: dot, x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, alpha: 0, scale: 0.3, duration: 260 + Math.random() * 200, ease: 'Cubic.easeOut', onComplete: () => dot.destroy() });
    }
  }

  private ring(x: number, y: number, r: number, color: number): void {
    const ring = this.add.ellipse(x, y, 20, 10).setStrokeStyle(5, color).setDepth(7);
    this.tweens.add({ targets: ring, scaleX: r / 10, scaleY: r / 18, alpha: 0, duration: 380, ease: 'Cubic.easeOut', onComplete: () => ring.destroy() });
  }

  private slash(step: number): void {
    const h = this.world!.hero;
    const atk = step < 0 ? h.d.cls.air : h.d.cls.combo[step];
    const g = this.add.graphics().setDepth(6);
    const r = atk.reach * 0.8;
    const [a0, a1] = step === 2 ? [100, -80] : step === 1 ? [-60, 60] : step < 0 ? [-80, 90] : [60, -60];
    const col = step === 2 ? 0xffe27a : 0xffffff;
    let t = 0;
    const draw = () => {
      g.clear();
      const k = Math.min(1, t / 0.1);
      const end = a0 + (a1 - a0) * k;
      for (let w = 0; w < 3; w++) {
        g.lineStyle(7 - w * 2, col, (0.7 - w * 0.2) * (1 - Math.max(0, t - 0.1) / 0.14));
        g.beginPath();
        for (let i = 0; i <= 10; i++) {
          const ang = Phaser.Math.DegToRad(a0 + (end - a0) * (i / 10));
          const px = h.x + h.face * (12 + Math.cos(ang) * (r - w * 6)), py = h.y - 40 + Math.sin(ang) * (r - w * 6) * 0.7;
          if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
        }
        g.strokePath();
      }
    };
    this.time.delayedCall(atk.hit[0] * 800, () => {
      const ev = this.time.addEvent({ delay: 16, loop: true, callback: () => { t += 0.016; draw(); if (t > 0.24) { ev.remove(); g.destroy(); } } });
    });
  }

  private skillFx(kind: string): void {
    const h = this.world!.hero, sk = h.skill!;
    switch (kind) {
      case 'cone':
        for (let i = 0; i < 18; i++) {
          const seed = this.add.ellipse(h.x + h.face * 30, h.y - 50, 6, 9, i % 3 ? 0xffe6a0 : 0xff4a6a).setDepth(7);
          const a = (Math.random() - 0.5) * 0.7;
          this.tweens.add({ targets: seed, delay: 80 + i * 8, x: seed.x + h.face * Math.cos(a) * sk.reach, y: seed.y + Math.sin(a) * sk.reach + 20, angle: 360, alpha: 0, duration: 380, onComplete: () => seed.destroy() });
        }
        break;
      case 'dash':
        for (let i = 0; i < 6; i++) this.time.delayedCall(i * 40, () => {
          const ghost = this.add.ellipse(h.x, h.y - 40, 70, 60, 0xff7a3c, 0.35).setDepth(4);
          this.tweens.add({ targets: ghost, alpha: 0, scaleX: 1.4, duration: 260, onComplete: () => ghost.destroy() });
        });
        break;
      case 'uppercut': {
        const arc = this.add.ellipse(h.x + h.face * 30, h.y - 60, 40, 140, 0xff5a7a, 0.4).setDepth(6).setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({ targets: arc, y: h.y - 140, alpha: 0, duration: 400, onComplete: () => arc.destroy() });
        break;
      }
      case 'spin': {
        const col = h.d.cls.species === 0 ? 0xff3a6a : 0xffb347;
        const sw = this.add.ellipse(h.x, h.y - 40, sk.reach * 2, 60).setStrokeStyle(6, col, 0.7).setDepth(6);
        this.tweens.add({ targets: sw, angle: 720, duration: sk.dur * 1000, onUpdate: () => { const hh = this.world?.hero; if (hh) sw.setPosition(hh.x, hh.y - 40); }, onComplete: () => sw.destroy() });
        this.tweens.add({ targets: sw, alpha: 0.2, yoyo: true, repeat: 3, duration: sk.dur * 125 });
        break;
      }
      case 'buff': this.ring(h.x, h.y - 40, 70, 0x9fe0ff); this.burst(h.x, h.y - 40, 0x9fe0ff, 16); toast(`${sk.name}!`, { color: '#9fe0ff' }); break;
      case 'nova': {
        const orb = this.add.circle(h.x, h.y - 50, 10, 0xffe8ff, 0.8).setDepth(7).setBlendMode(Phaser.BlendModes.ADD);
        this.tweens.add({ targets: orb, scale: 5, alpha: 0.2, duration: sk.dur * 550, onComplete: () => orb.destroy() });
        break;
      }
    }
  }

  // ---------- drawing ----------
  private draw(dt: number): void {
    const w = this.world!, st = w.stage, h = w.hero, t = this.time.now / 1000;
    const tx = h.x + h.face * 40, ty = Math.min(h.y - 70, st.groundY + 90 - VH / 2);
    this.cx += (tx - this.cx) * Math.min(1, dt * 5);
    this.cy += (ty - this.cy) * Math.min(1, dt * 3);
    this.cx = Phaser.Math.Clamp(this.cx, VW / 2, st.width - VW / 2);
    this.cy = Phaser.Math.Clamp(this.cy, VH / 2 - 80, st.groundY + 90 - VH / 2);
    this.shake = Math.max(0, this.shake - dt * 30);
    this.cameras.main.centerOn(this.cx + (Math.random() - 0.5) * this.shake, this.cy + (Math.random() - 0.5) * this.shake);

    const fx = (this.cx - VW / 2) / Math.max(1, st.width - VW);
    if (this.far) {
      const fh = VH * 1.35, fw = Math.max(VW * 1.15, fh * (this.far.width / this.far.height));
      this.far.setDisplaySize(fw, fh).setPosition(SX - fx * (fw - VW), SY - (fh - VH) * 0.55 - (this.cy - 200) * 0.06);
    }
    if (this.mid) { this.mid.x = SX; this.mid.tilePositionX = (this.cx * 0.4) / MID; this.mid.y = SY + VH / 2 + (st.groundY - this.cy) * 0.75 + 4; }

    // hero
    this.hero.update(h, t, dt);
    const floor = w.floorBelow(h.x, h.y, h.y + 2000, false);
    const fy = floor ? floor.y : st.groundY;
    const lift = Math.min(1, (fy - h.y) / 200);
    this.heroShadow.setPosition(h.x, fy - 1).setScale(1 - lift * 0.5).setAlpha(h.state === 'climb' ? 0 : 1);
    this.hero.flash(h.state === 'hurt' && h.t < 0.08);
    this.aura.setVisible(!!h.buff).setPosition(h.x, h.y - 40).setScale(1 + Math.sin(t * 6) * 0.06).setAlpha(0.18 + Math.sin(t * 6) * 0.06);

    // monsters
    const seen = new Set<number>();
    for (const m of w.mobs) { seen.add(m.id); this.drawMob(m, t); }
    for (const [id, v] of this.mobViews) if (!seen.has(id)) { v.img.destroy(); v.plate.destroy(); v.bar.destroy(); v.barBg.destroy(); v.shadow.destroy(); this.mobViews.delete(id); }

    // boxes
    const seenB = new Set<number>();
    for (const b of w.boxes) {
      seenB.add(b.id);
      let o = this.boxImgs.get(b.id);
      if (!o) {
        const glow = this.add.circle(0, 0, 22, TIER_COLORS[b.tier], 0.35).setDepth(1).setBlendMode(Phaser.BlendModes.ADD);
        const img = this.add.image(0, 0, this.has(`box-${b.tier}`) ? `box-${b.tier}` : '__WHITE').setOrigin(0.5, 1).setDepth(2);
        img.setScale(32 / img.height);
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

    // projectiles + mines
    const seenS = new Set<number>();
    for (const s of w.shots) {
      seenS.add(s.id);
      let c = this.shotImgs.get(s.id);
      if (!c) {
        c = s.from === 'hero'
          ? this.add.circle(0, 0, 9, 0xe8c8ff).setStrokeStyle(3, 0xffffff).setBlendMode(Phaser.BlendModes.ADD)
          : s.kind === 'icicle' ? this.add.ellipse(0, 0, 10, 26, 0xc8f0ff).setStrokeStyle(2, 0x6ab8ff)
          : this.add.circle(0, 0, 7, worldOf(this.stage).id === 2 ? 0x6ac86a : 0x2a2020).setStrokeStyle(2, 0x8a7060);
        c.setDepth(8); this.shotImgs.set(s.id, c);
      }
      c.setPosition(s.x, s.y).setScale(1 + Math.sin(t * 30) * 0.12);
      if (s.from === 'hero' && Math.random() < 0.5) { const p = this.add.circle(s.x, s.y + (Math.random() - 0.5) * 12, 3, 0xffd8ff).setDepth(7); this.tweens.add({ targets: p, alpha: 0, duration: 250, onComplete: () => p.destroy() }); }
    }
    for (const [id, c] of this.shotImgs) if (!seenS.has(id)) { c.destroy(); this.shotImgs.delete(id); }
    const seenM = new Set<number>();
    for (const mi of w.mines) {
      seenM.add(mi.id);
      let c = this.mineImgs.get(mi.id);
      if (!c) { c = this.add.circle(0, 0, 9, 0x3a4aa0).setStrokeStyle(2, 0x9ab0ff).setDepth(3); this.mineImgs.set(mi.id, c); }
      c.setPosition(mi.x, mi.y - 8).setScale(1 + (Math.sin(t * 8 + mi.id) > 0.7 ? 0.15 : 0));
    }
    for (const [id, c] of this.mineImgs) if (!seenM.has(id)) { c.destroy(); this.mineImgs.delete(id); }

    updateHud(w, hero(), st);
    const sk = skillsOf(h.d.cls.species).actives;
    for (let i = 0; i < 3; i++) {
      const lv = h.d.skillLv[sk[i].id] ?? 0;
      const full = sk[i].cd * skillScale(lv).cd * (1 - h.d.cdr);
      setSkillUi(i, lv ? sk[i].name : null, lv && full ? h.cds[i] / full : 0, h.cds[i]);
    }
  }

  private drawMob(m: Mob, t: number): void {
    const def = MOBS[m.kind];
    let v = this.mobViews.get(m.id);
    if (!v) {
      const img = this.add.image(0, 0, this.has(def.art) ? def.art : '__WHITE').setOrigin(0.5, 0.96).setDepth(def.brain === 'boss' ? 4 : 3);
      const plate = this.add.text(0, 0, `Lv${m.lv} ${m.elite ? 'Elite ' : ''}${def.name}`, { fontFamily: 'Nunito', fontStyle: '900', fontSize: '10px', color: '#ffffff', backgroundColor: '#1a1020b0', padding: { x: 4, y: 1 } })
        .setOrigin(0.5, 0).setDepth(9).setResolution(3);
      const barBg = this.add.rectangle(0, 0, 40, 5, 0x000000, 0.6).setDepth(9);
      const bar = this.add.rectangle(0, 0, 40, 5, 0xff4a5a).setOrigin(0, 0.5).setDepth(9);
      const shadow = this.add.ellipse(0, 0, def.w * 1.1, 10, 0x000000, 0.2).setDepth(1);
      v = { img, plate, bar, barBg, shadow, s: (def.h + (def.brain === 'boss' ? 20 : 12)) / img.height * (m.elite ? ELITE.scale : 1) };
      if (m.elite) plate.setColor('#ffb347');
      if (def.brain === 'boss') plate.setVisible(false);
      this.mobViews.set(m.id, v);
    }
    const flyer = def.brain === 'flyer';
    const wob = flyer ? Math.sin(t * 22 + m.id) * 0.6 : m.state === 'walk' && Math.abs(m.vx) > 5 ? Math.sin(t * 14 + m.id) : 0;
    let sx = 1 + wob * 0.04, sy = 1 - wob * 0.05, rot = wob * 0.05;
    if (m.state === 'windup') { const k = Math.min(1, m.t / 0.4); sx = 1 + 0.12 * k; sy = 1 - 0.12 * k; rot = -0.12 * m.face * k; }
    if (m.state === 'attack') { sx = 0.92; sy = 1.1; rot = 0.16 * m.face; if (m.move === 'charge') rot = 0.25 * m.face; }
    if (m.state === 'hurt') rot = -0.22 * m.face;
    if (m.state === 'stagger') rot = Math.sin(t * 20) * 0.1;
    if (m.state === 'dead') { rot = m.deadT * 10 * -m.face; v.img.setAlpha(Math.max(0, 1 - m.deadT / 0.7)); }
    // art faces left: flip when facing right
    v.img.setPosition(m.x, m.y).setScale(v.s * sx, v.s * sy).setRotation(rot).setFlipX(m.face > 0);
    if (m.flash > 0) v.img.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);
    else if (m.state === 'windup' && Math.floor(t * 12) % 2 === 0) v.img.setTint(0xff7070).setTintMode(Phaser.TintModes.MULTIPLY);
    else if (m.state === 'stagger') v.img.setTint(0xfff0a0).setTintMode(Phaser.TintModes.MULTIPLY);
    else v.img.clearTint().setTintMode(Phaser.TintModes.MULTIPLY);
    const top = m.y - def.h * (m.elite ? ELITE.scale : 1) - 18;
    const fl = this.world!.floorBelow(m.x, m.y, m.y + 2000, false);
    v.shadow.setPosition(m.x, (fl ? fl.y : m.y) - 1).setAlpha(m.state === 'dead' ? 0 : 1);
    v.plate.setPosition(m.x, flyer ? m.y + 6 : m.y + 4).setAlpha(m.state === 'dead' ? 0 : 0.9);
    if (flyer) v.shadow.setScale(Math.max(0.3, 1 - ((fl ? fl.y : m.y) - m.y) / 200));
    const showBar = m.hurtShown > 0 && m.state !== 'dead' && def.brain !== 'boss';
    v.barBg.setVisible(showBar).setPosition(m.x, top);
    v.bar.setVisible(showBar).setPosition(m.x - 20, top).setScale(Math.max(0, m.hp / m.maxHp), 1);
  }
}
