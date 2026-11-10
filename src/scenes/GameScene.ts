// The playable stage: parallax kitchen, platforms + ladders, the rigged hero, monsters (with level plates),
// the boss, loot boxes, skill effects, the exit. Started from the camp; reports results back to the save.
import * as Phaser from 'phaser';
import { playMusic, sfx, toggleMute } from '../audio';
import { initHud, showHud, showPause, toast, updateHud } from '../hud';
import { readInput, takeTaps } from '../input';
import { TIER_COLORS, TIER_NAMES } from '../sim/loot';
import { CONSUMABLES } from '../sim/consumables';
import { ELITE, ELITE_MODS, MOBS, nemesisOf } from '../sim/mobs';
import { ULT_LV, applyBranch, skillsOf, skillScale } from '../sim/skills';
import { STAGES, stageById, worldOf } from '../sim/stages';
import { derive } from '../sim/stats';
import type { SimEvent, StageDef } from '../sim/types';
import { DT, HARD_LV, type Mob, World, guardBreakOf, launcherOf, rankOf } from '../sim/world';
import { type GearLook, HeroView } from '../render/rig';
import { BASES } from '../sim/items';
import type { HeroProfile } from '../sim/stats';
import { addXp, finishStage, hero, quickBag, save, syncQuickBag } from '../save';
import { checkUnlocks, track, trackHero, trackKey } from '../quests';
import { STORIES, beatAfter } from '../story/stories';
import { playStory } from '../ui/story';
import { type QuipKind, TAUNTS } from '../story/banter';
import { QUIPS } from '../story/more';
import { CLASSES } from '../sim/classes';
import { setSkillUi, setTouchVisible, setUltUi } from '../touch';
import { hideCamp, runGacha, showCamp, showResult, stageUnlocked } from '../ui/camp';

/** Equipped items → what to draw on the kaiju. */
export function lookOf(p: HeroProfile): GearLook {
  const e = p.equip, ic = (b: string) => BASES[b]?.icon ?? '';
  return {
    weapon: e.weapon && { icon: ic(e.weapon.base), base: e.weapon.base, rarity: e.weapon.rarity, plus: e.weapon.plus },
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

interface MobView { img: Phaser.GameObjects.Image; plate: Phaser.GameObjects.Text; bar: Phaser.GameObjects.Rectangle; barBg: Phaser.GameObjects.Rectangle; shadow: Phaser.GameObjects.Ellipse; s: number; warn: Phaser.GameObjects.Text }

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
  /** hazard visuals (one container per hazard) + one graphics layer for lasers / mould puddles / burrow mounds */
  private hazardViews: Phaser.GameObjects.Container[] = [];
  private overlay?: Phaser.GameObjects.Graphics;
  private slowTint?: Phaser.GameObjects.Rectangle;
  /** platform boards (moving trays follow, secret ledges fade in), props and cookers */
  private platViews: { board?: Phaser.GameObjects.Image; shadow: Phaser.GameObjects.Ellipse }[] = [];
  private propViews = new Map<number, Phaser.GameObjects.Image>();
  private cookerViews = new Map<number, Phaser.GameObjects.Image>();
  private npcView?: { img: Phaser.GameObjects.Image; bar: Phaser.GameObjects.Rectangle; bg: Phaser.GameObjects.Rectangle };
  private scrollView?: { img: Phaser.GameObjects.Image; glow: Phaser.GameObjects.Arc };
  /** speech bubbles: monsters taunt the first time each kind appears, your kaiju quips at big moments */
  private bubbles: { c: Phaser.GameObjects.Container; who: number | 'hero'; t: number }[] = [];
  private taunted = new Set<string>();
  private quipT = 0; private tauntT = 0; private lastQuip = '';
  private lowWarned = false; private comboQuipped = 0;
  /** Hard mode is open for a world once its boss is beaten. */
  private hardOk(): boolean { return !!hero().cleared[`${this.stage.world}-10`]; }

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
    this.world = new World(st, derive(p), (Date.now() & 0xffff) + 1, quickBag(), save.items.revive ?? 0, this.hard, STORIES[p.species]?.variants[st.id], [...(save.spicy ?? [])], nemesisOf(p.species));
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
    this.platViews = this.world.stage.platforms.map(pl => ({
      shadow: this.add.ellipse(pl.x + pl.w / 2, st.groundY - 4, pl.w * 0.8, 10, 0x000000, pl.secret ? 0 : 0.1).setDepth(-9),
      board: this.has('plat-board') ? this.add.image(pl.x + pl.w / 2, pl.y - 6, 'plat-board').setOrigin(0.5, 0.08).setDisplaySize(pl.w + 28, 38).setDepth(-5).setTint(pl.secret ? 0xffe8a0 : pl.move ? 0xd8e8f8 : st.platTint) : undefined,
    }));
    this.propViews.clear(); this.cookerViews.clear(); this.npcView = undefined; this.scrollView = undefined;
    this.bubbles = []; this.taunted.clear(); this.quipT = 2; this.tauntT = 1; this.lowWarned = false; this.comboQuipped = 0;
    if (this.world.npc && this.has('npc-crumblet')) {
      const img = this.add.image(0, 0, 'npc-crumblet').setOrigin(0.5, 1).setDepth(4); img.setScale(46 / img.height);
      this.npcView = { img, bg: this.add.rectangle(0, 0, 40, 5, 0x000000, 0.6).setDepth(9), bar: this.add.rectangle(0, 0, 40, 5, 0x7ae87a).setOrigin(0, 0.5).setDepth(9) };
    }
    if (this.world.scroll && this.has('c-scroll')) {
      const glow = this.add.circle(0, 0, 26, 0xffe27a, 0.35).setDepth(1).setBlendMode(Phaser.BlendModes.ADD);
      const img = this.add.image(0, 0, 'c-scroll').setOrigin(0.5, 1).setDepth(2); img.setScale(38 / img.height);
      this.scrollView = { img, glow };
    }
    if (this.world.stage.objective) this.time.delayedCall(1500, () => toast(({ escort: '🧁 Keep the lost Crumblet safe and bring it to the EXIT', fetch: '📜 Grab the Recipe Scroll at the far end before time runs out!', survive: '⏱ Hold out until the timer runs out!' })[this.world!.stage.objective!.kind], { color: '#ffd27a' }));
    for (const p of this.world.props) {
      const key = `ob-${p.kind}`;
      if (!this.has(key)) continue;
      const img = this.add.image(p.x, p.y + 2, key).setOrigin(0.5, 1).setDepth(p.kind === 'sponge' ? -4 : 1);
      img.setScale(({ crate: 44, jar: 40, sponge: 22, lever: 56, chest: 40 } as Record<string, number>)[p.kind] / img.height);
      this.propViews.set(p.id, img);
    }
    // exit: a glowing golden plate that appears once the stage is cleared
    const w = this.world;
    const glow = this.add.ellipse(0, -30, 70, 110, 0xffe27a, 0.35).setBlendMode(Phaser.BlendModes.ADD);
    const plate = this.add.ellipse(0, -2, 80, 16, 0xffd23c).setStrokeStyle(3, 0xa06010);
    const label = this.add.text(0, -80, 'EXIT ➜', { fontFamily: 'Luckiest Guy', fontSize: '20px', color: '#ffe27a', stroke: '#5a2a08', strokeThickness: 5 }).setOrigin(0.5).setResolution(3);
    this.exit = this.add.container(w.exitX, st.groundY, [glow, plate, label]).setDepth(-3).setVisible(false);
    this.tweens.add({ targets: glow, scaleX: 1.2, scaleY: 1.1, alpha: 0.2, yoyo: true, repeat: -1, duration: 700 });

    this.hazardViews = w.hazards.map(z => this.buildHazard(z.kind, z.x, z.w, st.groundY));
    this.overlay = this.add.graphics().setDepth(2);
    this.slowTint = this.add.rectangle(SX, SY, VW * 2, VH * 2, 0x6a8aff, 0).setOrigin(0, 0).setScrollFactor(0).setDepth(16);
    this.heroShadow = this.add.ellipse(0, 0, 54, 12, 0x000000, 0.22).setDepth(-2);
    this.aura = this.add.ellipse(0, 0, 80, 100, 0x9fe0ff, 0.25).setDepth(4).setBlendMode(Phaser.BlendModes.ADD).setVisible(false);
    this.hero = new HeroView(this, p.species, k => this.has(k), 84, lookOf(p));
    this.hero.root.setDepth(5);
    this.cx = w.hero.x; this.cy = st.groundY - 100;
    cam.centerOn(this.cx, this.cy);
    if (w.variant === 'night') { this.add.rectangle(SX, SY, VW * 2, VH * 2, 0x0a0a30, 0.42).setOrigin(0, 0).setScrollFactor(0).setDepth(15); }
    setTouchVisible(true); showHud(true);
    playMusic(st.boss ? 'boss' : st.world === 2 ? 'world2' : st.world === 3 ? 'world3' : st.world === 4 ? 'world2' : 'world1');
    if (st.boss) this.time.delayedCall(900, () => sfx('boss'));
    if (w.variant) this.time.delayedCall(900, () => toast(`${{ swarm: '🐜 SWARM', ambush: '⚔️ AMBUSH', night: '🌙 NIGHT' }[w.variant!]}!`, { color: '#c8a8ff' }));
    toast(`${st.num} ${st.name}${this.hard ? ' · HARD' : ''}${w.spicy.length ? ' · ' + '🌶'.repeat(w.spicy.length) : ''}`, { big: true, color: this.hard ? '#ff7a6a' : undefined });
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
        case 'skill': trackHero(hero().species, `skill:${e.id}`); this.skillFx(e.kind); sfx(e.kind === 'heal' ? 'heal' : 'skill'); break;
        case 'shock': sfx('boom'); this.ring(e.x, e.y, e.r, 0xffe0a0); this.shake = Math.max(this.shake, 7); break;
        case 'boom': if (w.cookers.some(c => Math.abs(c.x - e.x) < 4 && c.gone > 5.9)) this.time.delayedCall(500, () => this.quip('boom')); sfx('boom'); this.burst(e.x, e.y - 10, 0x4a6cff, 14); this.ring(e.x, e.y, 70, 0x7a9aff); break;
        case 'mobDie':
          sfx('kill');
          track('kills');
          trackKey(`kill:${e.kind}`); trackHero(hero().species, `kill:${e.kind}`); trackHero(hero().species, 'kills');
          if (e.boss) track('bossKills');
          if (e.boss || e.elite) track('eliteKills');
          this.burst(e.x, e.y - 24, e.boss ? 0xffb347 : 0xc8f0a0, e.boss ? 40 : 14);
          if (e.boss) { this.shake = 14; this.hitStop = 0.4; toast(`THE ${MOBS[e.kind].name.toUpperCase()} FALLS!`, { big: true, color: '#ffb347' }); }
          break;
        case 'xp': {
          this.xpGained += e.n;
          const ups = addXp(hero().species, e.n);
          if (ups) {
            sfx('levelup');
            this.levels += ups;
            w.setDerived(derive(hero()));
            w.hero.hp = w.hero.d.maxHp;
            toast(`LEVEL UP! Lv ${hero().level}`, { color: '#ffe27a' }); this.quip('levelup', true);
            this.burst(w.hero.x, w.hero.y - 40, 0xffe27a, 24);
            this.ring(w.hero.x, w.hero.y - 30, 60, 0xffe27a);
          }
          break;
        }
        case 'pickup': sfx('pickup'); break;
        case 'drop': sfx('drop'); toast(`${TIER_NAMES[e.tier]} dropped!`, { tier: e.tier }); break;
        case 'summon': toast(w.boss ? `The ${MOBS[w.boss.kind].name} calls for help!` : 'More little ones!', { color: '#ff9a6a' }); break;
        case 'perfect': {
          this.quip('perfect');
          sfx('crit'); track('perfects');
          this.callout(e.x, e.y - 20, 'PERFECT!', '#9fe8ff', 22);
          this.ring(e.x, e.y + 20, 90, 0x9fe8ff); this.burst(e.x, e.y, 0x9fe8ff, 18);
          this.cameras.main.flash(120, 160, 220, 255);
          break;
        }
        case 'interrupt': track('interrupts'); sfx('stagger'); this.callout(e.x, e.y, 'INTERRUPT!', '#ffe27a', 15); this.burst(e.x, e.y + 10, 0xffe27a, 10); break;
        case 'guardBreak': sfx('boom'); this.callout(e.x, e.y - 10, 'GUARD BREAK!', '#ffb36a', 16); this.ring(e.x, e.y + 20, 60, 0xffb36a); this.shake = Math.max(this.shake, 6); break;
        case 'enrage': sfx('boss'); this.shake = 14; this.cameras.main.flash(250, 255, 80, 60); toast(`${e.name.toUpperCase()} IS ENRAGED!`, { big: true, color: '#ff6a5a' }); break;
        case 'heal': this.callout(e.x, e.y, '+' + e.n, '#7ae87a', 13); this.burst(e.x, e.y + 20, 0x7ae87a, 8); break;
        case 'burrow': this.burst(e.x, e.y - 6, 0x8a6a4a, e.up ? 16 : 10); if (e.up) { sfx('boom'); this.shake = Math.max(this.shake, 4); } break;
        case 'steal': sfx('hurt'); toast(`Your ${e.name} was snatched! Beat the thief to get it back`, { color: '#ff9a6a' }); break;
        case 'recover': sfx('pickup'); toast(`Got your ${e.name} back!`, { color: '#a8f0a8' }); break;
        case 'nemesisMove': this.callout(w.hero.x, w.hero.y - 150, e.move.toUpperCase() + '!', '#ff9ad8', 13); break;
        case 'objective': if (e.done) this.quip('objective', true); sfx(e.done ? 'reveal3' : 'portal'); toast(e.text, { big: !!e.done, color: '#a8f0a8' }); break;
        case 'objFail': toast(e.why, { big: true, color: '#ff8a8a' }); break;
        case 'prop': {
          sfx(e.kind === 'chest' ? 'reveal3' : 'hit'); this.burst(e.x, e.y - 20, e.kind === 'jar' ? 0xff8af4 : e.kind === 'chest' ? 0xffd23c : 0xc8a070, 14);
          const v = [...this.propViews.entries()].find(([id]) => !w.props.find(p => p.id === id && p.hp > 0));
          if (v) { this.tweens.add({ targets: v[1], alpha: 0, scaleY: 0.2, duration: 220, onComplete: () => v[1].destroy() }); this.propViews.delete(v[0]); }
          if (e.kind === 'chest') { toast('Secret chest!', { color: '#ffd27a' }); this.quip('secret', true); }
          break;
        }
        case 'bounce': sfx('jump'); this.ring(e.x, e.y, 40, 0xf0e060); break;
        case 'lever': {
          sfx('boom'); this.shake = 10; this.time.delayedCall(500, () => this.quip('boom'));
          const pin = this.add.rectangle(e.x, w.stage.groundY - 300, 240, 34, 0xc89a60).setStrokeStyle(4, 0x6a4a20).setDepth(8);
          this.tweens.add({ targets: pin, y: w.stage.groundY - 18, duration: 180, ease: 'Quad.easeIn', onComplete: () => this.tweens.add({ targets: pin, alpha: 0, delay: 400, duration: 300, onComplete: () => pin.destroy() }) });
          toast('Rolling pin away!', { color: '#ffd27a' });
          break;
        }
        case 'fuse': sfx('shake'); this.callout(e.x, e.y - 70, '!!', '#ff4a3a', 18); break;
        case 'key': {
          sfx('reveal5'); this.cameras.main.flash(250, 255, 230, 160);
          if (!(save.keys ?? []).includes(e.world)) save.keys = [...(save.keys ?? []), e.world];
          toast(`🗝 WORLD ${e.world} KEY! A secret stage has opened on the map`, { big: true, color: '#ffd27a' });
          break;
        }
        case 'mimic': this.time.delayedCall(400, () => this.quip('mimic', true)); sfx('boss'); toast('It\'s a MIMIC!', { color: '#ff9a6a' }); break;
        case 'style': if (e.rank === 'S' || e.rank === 'A') toast(`STYLE ${e.rank}!`, { color: e.rank === 'S' ? '#ffd23c' : '#9fe8ff' }); break;
        case 'hazard': if (e.on && w.hazards[e.i]?.kind === 'drop') { sfx('boom'); } break;
        case 'stagger': sfx('stagger'); toast('STAGGERED!', { color: '#ffe27a' }); this.shake = 8; break;
        case 'dodge': {
          sfx('dodge');
          track('dodges');
          const h = w.hero;
          for (let i = 0; i < 4; i++) this.time.delayedCall(i * 50, () => { const g = this.add.ellipse(h.x, h.y - 40, 60, 70, 0xffffff, 0.3).setDepth(4); this.tweens.add({ targets: g, alpha: 0, scaleX: 1.3, duration: 220, onComplete: () => g.destroy() }); });
          break;
        }
        case 'use': {
          const def = CONSUMABLES[e.id];
          sfx('potion');
          track('potions');
          toast(def.name, { color: def.heal ? '#ff8a9a' : '#ffd27a' });
          this.burst(w.hero.x, w.hero.y - 40, def.heal ? 0xff6a8a : 0xffd27a, 14);
          this.ring(w.hero.x, w.hero.y - 30, 50, def.heal ? 0xff8aa0 : 0xffe27a);
          break;
        }
        case 'block': {
          const t = this.add.text(e.x, e.y, 'BLOCK', { fontFamily: 'Luckiest Guy', fontSize: '14px', color: '#c8d8e8', stroke: '#203040', strokeThickness: 4 }).setOrigin(0.5).setDepth(30).setResolution(3);
          this.tweens.add({ targets: t, y: e.y - 30, alpha: 0, duration: 500, onComplete: () => t.destroy() });
          sfx('click');
          break;
        }
        case 'ult': {
          track('ults'); trackHero(hero().species, 'ult');
          sfx('reveal5'); this.shake = 12; this.hitStop = 0.25;
          const cam = this.cameras.main; cam.flash(200, 255, 230, 160);
          showUltBanner(hero().species, e.name);
          break;
        }
        case 'revive': sfx('levelup'); toast('SECOND HELPING! Revived!', { big: true, color: '#ffe27a' }); this.burst(w.hero.x, w.hero.y - 40, 0xffe27a, 30); this.ring(w.hero.x, w.hero.y - 30, 90, 0xffe27a); break;
        case 'stone': {
          const t = this.add.text(e.x, e.y, '+' + e.n + ' Fortify Stone', { fontFamily: 'Nunito', fontStyle: '900', fontSize: '10px', color: '#ffb36a', stroke: '#3a1808', strokeThickness: 3 }).setOrigin(0.5).setDepth(29).setResolution(3);
          this.tweens.add({ targets: t, y: e.y - 36, alpha: 0, duration: 1100, delay: 300, onComplete: () => t.destroy() });
          break;
        }
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
    const chillies = w.spicy.length;
    if (!failed && chillies) w.run.crumbs = Math.round(w.run.crumbs * (1 + 0.25 * chillies));
    save.crumbs += w.run.crumbs;
    save.items.fstone = (save.items.fstone ?? 0) + w.run.stones;
    if (w.run.crumbs) track('crumbs', w.run.crumbs);
    const res = failed ? null : finishStage(st.id, rankOf(w.run, st.par).rank, w.loot, st.lv[1] + (this.hard ? HARD_LV : 0), !!st.boss, this.hard, chillies);
    const sp = hero().species;
    trackHero(sp, 'combo', w.run.maxCombo, true);
    if (res) {
      trackHero(sp, `clear:${st.id}`, ['D', 'C', 'B', 'A', 'S'].indexOf(res.rank) + 1, true);
      if (w.run.hitsTaken === 0) trackHero(sp, 'nohit');
      if (this.hard) trackHero(sp, 'hard');
      if (chillies) track('spicy');
      track('clears'); track('heroClear', 1, hero().species);
      if (res.rank === 'S' || res.rank === 'A') track('rankA');
      if (res.rank === 'S') track('rankS');
    }
    const newKaiju = checkUnlocks();
    const after = res ? beatAfter(st.id).filter(b => !hero().seen.includes(b)) : [];
    for (const b of after) hero().seen.push(b);
    this.time.delayedCall(failed ? 600 : 300, () => playStory(sp, after, () => showResult(
      { stage: st, res, time: w.run.time, hits: w.run.hitsTaken, combo: w.run.maxCombo, xp: this.xpGained, levels: this.levels, failed, crumbs: w.run.crumbs, hard: this.hard, unlocked: newKaiju.map(s => CLASSES.find(c => c.species === s)!.name) },
      a => {
        if (a === 'retry') this.scene.restart({ stage: st.id });
        else if (a === 'next') { const ix = STAGES.indexOf(st), n = ix >= 0 ? STAGES[ix + 1] : undefined; this.scene.restart(n && stageUnlocked(n) ? { stage: n.id } : {}); }
        else if (a === 'boxes') { this.scene.restart({}); setTimeout(() => { showCamp('boxes'); runGacha(save.boxes.map((_, i) => i)); }, 50); }
        else this.scene.restart({});
      })));
  }

  // ---------- banter ----------
  private bubble(text: string, who: number | 'hero', color = '#2a1030'): void {
    const old = this.bubbles.find(b => b.who === who); if (old) { old.c.destroy(); this.bubbles.splice(this.bubbles.indexOf(old), 1); }
    const txt = this.add.text(0, 0, text, { fontFamily: 'Nunito', fontStyle: '900', fontSize: '10px', color, align: 'center', wordWrap: { width: 150 } }).setOrigin(0.5).setResolution(3);
    const w = txt.width + 12, h = txt.height + 8;
    const g = this.add.graphics();
    g.fillStyle(0xfffaf0, 0.96); g.lineStyle(2, who === 'hero' ? 0xffb347 : 0x8a3a5a, 1);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, 7); g.strokeRoundedRect(-w / 2, -h / 2, w, h, 7);
    g.fillTriangle(-5, h / 2 - 1, 5, h / 2 - 1, 0, h / 2 + 7); g.lineBetween(-5, h / 2, 0, h / 2 + 7); g.lineBetween(5, h / 2, 0, h / 2 + 7);
    const c = this.add.container(0, 0, [g, txt]).setDepth(32).setScale(0.6);
    this.tweens.add({ targets: c, scale: 1, duration: 140, ease: 'Back.easeOut' });
    this.bubbles.push({ c, who, t: 2.8 });
  }

  /** Your kaiju says something about the moment (not too often, never the same line twice in a row). */
  private quip(kind: QuipKind, force = false): void {
    if (!force && this.quipT > 0) return;
    const lines = QUIPS[hero().species]?.[kind];
    if (!lines?.length) return;
    const pick = lines.filter(l => l !== this.lastQuip);
    this.lastQuip = pick[Math.floor(Math.random() * pick.length)] ?? lines[0];
    this.quipT = 5;
    this.bubble(this.lastQuip, 'hero');
  }

  private stepBanter(dt: number): void {
    const w = this.world!, h = w.hero;
    this.quipT -= dt; this.tauntT -= dt;
    // monsters: the first of each kind on screen says its line
    if (this.tauntT <= 0) {
      for (const m of w.mobs) {
        if (m.state === 'dead' || m.disguised || m.under || this.taunted.has(m.kind) || Math.abs(m.x - this.cx) > VW / 2 - 30 || Math.abs(m.y - this.cy) > VH / 2) continue;
        const lines = TAUNTS[m.kind];
        this.taunted.add(m.kind);
        if (!lines) continue;
        this.bubble(lines[Math.floor(Math.random() * lines.length)], m.id, '#5a1030');
        this.tauntT = 3;
        break;
      }
    }
    if (w.combo >= 15 && w.combo >= this.comboQuipped + 15) { this.comboQuipped = w.combo; this.quip('combo'); }
    if (w.combo < 3) this.comboQuipped = 0;
    if (h.hp < h.d.maxHp * 0.3 && h.hp > 0 && !this.lowWarned) { this.lowWarned = true; this.quip('lowhp', true); }
    if (h.hp > h.d.maxHp * 0.6) this.lowWarned = false;
    const placed: { x: number; y: number; w: number; h: number }[] = [];
    for (const b of [...this.bubbles]) {
      b.t -= dt;
      const m = b.who === 'hero' ? null : w.mobs.find(x => x.id === b.who);
      if (b.t <= 0 || (b.who !== 'hero' && (!m || m.state === 'dead'))) { b.c.destroy(); this.bubbles.splice(this.bubbles.indexOf(b), 1); continue; }
      const x = m ? m.x : h.x;
      let y = m ? m.y - MOBS[m.kind].h * (m.elite ? ELITE.scale : 1) - 30 : h.y - 108;
      const bw = b.c.getBounds().width, bh = b.c.getBounds().height;
      // two bubbles side by side would overlap: lift this one above the other
      for (const r of placed) if (Math.abs(r.x - x) < (r.w + bw) / 2 + 4 && Math.abs(r.y - y) < (r.h + bh) / 2 + 2) y = r.y - (r.h + bh) / 2 - 4;
      placed.push({ x, y, w: bw, h: bh });
      b.c.setPosition(x, y).setAlpha(Math.min(1, b.t / 0.3));
    }
  }

  // ---------- effects ----------
  private callout(x: number, y: number, text: string, color: string, size: number): void {
    const t = this.add.text(x, y, text, { fontFamily: 'Luckiest Guy', fontSize: size + 'px', color, stroke: '#2a1030', strokeThickness: 5 }).setOrigin(0.5).setDepth(31).setResolution(3).setScale(0.5);
    this.tweens.add({ targets: t, scale: 1, duration: 140, ease: 'Back.easeOut' });
    this.tweens.add({ targets: t, y: y - 34, alpha: 0, delay: 450, duration: 450, onComplete: () => t.destroy() });
  }

  /** Hazard look: burner ring / steam grate / shelf shadow / ice sheet (no art needed). */
  private buildHazard(kind: string, x: number, w: number, gy: number): Phaser.GameObjects.Container {
    const parts: Phaser.GameObjects.GameObject[] = [];
    if (kind === 'ice') {
      parts.push(this.add.ellipse(0, -2, w + 30, 16, 0xbfe8ff, 0.55).setStrokeStyle(2, 0xffffff, 0.8));
      for (let i = 0; i < 4; i++) parts.push(this.add.rectangle(-w / 2 + 20 + i * (w - 40) / 3, -4, 18, 2, 0xffffff, 0.8).setAngle(-12));
    } else if (kind === 'burner') {
      parts.push(this.add.ellipse(0, -2, w, 14, 0x2a2a30).setStrokeStyle(3, 0x5a5a66));
      const flame = this.add.container(0, -2, [
        this.add.ellipse(0, -55, w * 0.75, 120, 0xff4a10, 0.55),
        this.add.ellipse(-w * 0.18, -40, w * 0.35, 85, 0xff8a20, 0.7),
        this.add.ellipse(w * 0.2, -45, w * 0.3, 95, 0xff8a20, 0.7),
        this.add.ellipse(0, -30, w * 0.38, 60, 0xffe080, 0.85),
      ]).setName('fx').setBlendMode(Phaser.BlendModes.ADD);
      parts.push(flame);
      parts.push(this.add.ellipse(0, -4, w * 0.8, 10, 0xffb347, 0.9).setName('glow'));
    } else if (kind === 'vent') {
      parts.push(this.add.rectangle(0, -3, w, 8, 0x4a3a30).setStrokeStyle(2, 0x8a6a50));
      parts.push(this.add.rectangle(0, -4, w * 0.8, 150, 0xf0f0ff, 0.6).setOrigin(0.5, 1).setName('fx'));
      parts.push(this.add.ellipse(0, -6, w * 0.8, 8, 0xffffff, 0.8).setName('glow'));
    } else { // drop: a shadow that grows, then a can falls
      parts.push(this.add.ellipse(0, -2, w, 12, 0x000000, 0.35).setName('glow'));
      const can = this.has('mob-can') ? this.add.image(0, -200, 'mob-can').setOrigin(0.5, 1) : this.add.rectangle(0, -200, 40, 50, 0x9aa0a8).setOrigin(0.5, 1);
      if (can instanceof Phaser.GameObjects.Image) can.setScale(56 / can.height).setTint(0xb0b0b8);
      parts.push(can.setName('fx'));
    }
    return this.add.container(x, gy, parts).setDepth(kind === 'ice' ? -8 : 6);
  }
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
    const atk = step === -2 ? guardBreakOf(h.d.cls.combo) : step === -3 ? launcherOf(h.d.cls.combo) : step < 0 ? h.d.cls.air : h.d.cls.combo[step];
    const g = this.add.graphics().setDepth(6);
    const r = atk.reach * 0.8;
    const [a0, a1] = step === 2 || step === -2 ? [100, -80] : step === 1 ? [-60, 60] : step === -3 ? [80, -110] : step < 0 ? [-80, 90] : [60, -60];
    const col = step === -2 ? 0xffb36a : step === -3 ? 0x9fe8ff : step === 2 ? 0xffe27a : 0xffffff;
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
      case 'dash': case 'swoop': case 'slide': case 'bulldoze': case 'rampage': case 'slashall':
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
      case 'spin': case 'vortex': case 'roll': {
        const col = h.d.cls.species === 0 ? 0xff3a6a : 0xffb347;
        const sw = this.add.ellipse(h.x, h.y - 40, sk.reach * 2, 60).setStrokeStyle(6, col, 0.7).setDepth(6);
        this.tweens.add({ targets: sw, angle: 720, duration: sk.dur * 1000, onUpdate: () => { const hh = this.world?.hero; if (hh) sw.setPosition(hh.x, hh.y - 40); }, onComplete: () => sw.destroy() });
        this.tweens.add({ targets: sw, alpha: 0.2, yoyo: true, repeat: 3, duration: sk.dur * 125 });
        break;
      }
      case 'blink': this.burst(h.x, h.y - 40, 0x6a3a8a, 18); this.ring(h.x, h.y - 30, 50, 0xb08aff); break;
      case 'counter': this.ring(h.x, h.y - 40, 60, 0xffffff); this.callout(h.x, h.y - 100, 'COUNTER STANCE', '#ffe8a0', 11); break;
      case 'orbit': this.ring(h.x, h.y - 40, 64, 0xf4f0e0); break;
      case 'drain': this.ring(h.x, h.y - 30, sk.reach, 0x8ae07a); break;
      case 'freeze': this.ring(h.x, h.y - 30, sk.reach, 0xbfe8ff); this.burst(h.x, h.y - 40, 0xe0f4ff, 24); break;
      case 'whip': case 'breath': case 'beam': {
        const col = kind === 'breath' ? 0x7ad04a : kind === 'beam' ? 0xf0f0ff : 0x6a9aff;
        const len = sk.reach, hgt = kind === 'whip' ? 10 : kind === 'beam' ? 46 : 60;
        const bar = this.add.ellipse(h.x + h.face * len / 2, h.y - (kind === 'whip' ? 40 : 45), len, hgt, col, 0.55).setDepth(7).setBlendMode(Phaser.BlendModes.ADD);
        bar.scaleX = 0.1;
        this.tweens.add({ targets: bar, scaleX: 1, duration: 90 });
        this.tweens.add({ targets: bar, alpha: 0, delay: Math.max(60, sk.dur * 1000 - 200), duration: 200, onComplete: () => bar.destroy() });
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
    this.aura.setFillStyle(h.counter > 0 ? 0xffd23c : 0x9fe0ff, 0.25).setVisible(!!h.buff || h.counter > 0).setPosition(h.x, h.y - 40).setScale(1 + Math.sin(t * 6) * 0.06).setAlpha(0.18 + Math.sin(t * 6) * 0.06);

    this.stepBanter(dt);

    // objective bits
    if (this.npcView && w.npc) {
      const n = w.npc, v = this.npcView;
      v.img.setPosition(n.x, n.y + (Math.abs(Math.sin(t * 9)) * -3)).setFlipX(n.face < 0).setAlpha(n.hp > 0 ? (n.hurt > 0 && Math.floor(t * 20) % 2 ? 0.4 : 1) : 0.3);
      v.bg.setPosition(n.x, n.y - 54); v.bar.setPosition(n.x - 20, n.y - 54).setScale(Math.max(0, n.hp / n.maxHp), 1);
    }
    if (this.scrollView && w.scroll) {
      const s = w.scroll, v = this.scrollView;
      v.img.setVisible(!s.got).setPosition(s.x, s.y - 8 + Math.sin(t * 3) * 4); v.glow.setVisible(!s.got).setPosition(s.x, s.y - 26).setScale(1 + Math.sin(t * 5) * 0.15);
    }

    // platforms that move or hide
    w.stage.platforms.forEach((pl, i) => {
      const v = this.platViews[i]; if (!v) return;
      if (pl.move) { v.board?.setX(pl.x + pl.w / 2); v.shadow.setX(pl.x + pl.w / 2); }
      if (pl.secret) { const near = Math.max(0, 1 - Math.max(0, Math.abs(h.x - (pl.x + pl.w / 2)) - 120) / 160); v.board?.setAlpha(0.08 + near * 0.92); }
    });
    for (const p of w.props) {
      const img = this.propViews.get(p.id); if (!img) continue;
      if (p.kind === 'chest') { const pl = w.stage.platforms.find(q => q.secret && p.x >= q.x && p.x <= q.x + q.w); const near = pl ? Math.max(0, 1 - Math.max(0, Math.abs(h.x - p.x) - 120) / 160) : 1; img.setAlpha(0.08 + near * 0.92).setY(p.y + 2 + Math.sin(t * 3) * 2); }
      if (p.kind === 'sponge') img.setScale(img.scaleX, (22 / img.height) * (1 - Math.max(0, 0.3 - Math.abs(h.x - p.x) / 120) * (h.ground ? 1 : 0)));
      if (p.kind === 'lever') img.setRotation(p.cd > 0 ? 0.6 : 0);
    }
    for (const c of w.cookers) {
      let img = this.cookerViews.get(c.id);
      if (!img && this.has('ob-cooker')) { img = this.add.image(0, 0, 'ob-cooker').setOrigin(0.5, 1).setDepth(3); img.setScale(54 / img.height); this.cookerViews.set(c.id, img); }
      if (!img) continue;
      img.setVisible(c.gone <= 0).setPosition(c.x, c.y + (c.fuse > 0 ? Math.sin(t * 60) * 2 : Math.abs(Math.sin(t * 8)) * -3)).setFlipX(c.face > 0);
      if (c.fuse > 0 && Math.floor(t * 16) % 2 === 0) img.setTint(0xff5040).setTintMode(Phaser.TintModes.FILL); else img.clearTint();
    }

    // hazards
    w.hazards.forEach((z, i) => {
      const c = this.hazardViews[i]; if (!c) return;
      const fxo = c.getByName('fx') as Phaser.GameObjects.Rectangle | Phaser.GameObjects.Image | Phaser.GameObjects.Container | null, glow = c.getByName('glow') as Phaser.GameObjects.Ellipse | null;
      const cyc = ((w.time + z.offset) % z.period);
      if (z.kind === 'ice') { c.setAlpha(z.state === 'on' ? 1 : 0); return; }
      if (z.kind === 'drop') {
        glow?.setScale(z.state === 'warn' ? 0.4 + 0.6 * (cyc - (z.period - 0.9)) / 0.9 : z.state === 'on' ? 1 : 0.2).setAlpha(z.state === 'off' ? 0.12 : 0.4);
        fxo?.setVisible(z.state !== 'off').setY(z.state === 'warn' ? -260 + 120 * (cyc - (z.period - 0.9)) / 0.9 : 0);
        return;
      }
      c.setAlpha(z.phase2 && z.state === 'off' && !w.boss?.enraged ? 0.35 : 1);
      fxo?.setVisible(z.state === 'on').setScale(1 + Math.sin(t * 30) * 0.08, 1 + Math.sin(t * 17) * 0.1);
      glow?.setAlpha(z.state === 'warn' ? 0.5 + Math.sin(t * 25) * 0.5 : z.state === 'on' ? 1 : 0.25);
    });
    // lasers, mould puddles, burrow mounds
    const g = this.overlay!;
    g.clear();
    for (const p of w.puddles) {
      const col = ({ slow: 0xa83a6a, slick: 0xf0d040, burn: 0xff7a2a, poison: 0x7ab8c8, trap: 0x6a6a72 } as Record<string, number>)[p.kind ?? ''] ?? 0x6ac04a;
      if (p.kind === 'trap') { g.fillStyle(col, 1); g.fillRect(p.x - 14, p.y - 6, 28, 6); g.lineStyle(2, 0xd8d8e0, 1); g.lineBetween(p.x - 12, p.y - 6, p.x + 12, p.y - 14); continue; }
      g.fillStyle(p.kind === 'slow' && w.nemesis === 'nslug' ? 0x9ad0a0 : col, Math.min(p.kind === 'burn' ? 0.5 + Math.sin(t * 18) * 0.15 : 0.55, p.t / 2)); g.fillEllipse(p.x, p.y - 1, p.w ?? 70, 10);
    }
    for (const z of w.zones) {
      const a = Math.min(1, z.t);
      if (z.kind === 'steam') { g.fillStyle(0xf4f4ff, 0.3 * a); g.fillEllipse(z.x, z.y - 45, z.w, 90 + Math.sin(t * 6) * 6); }
      else if (z.kind === 'goo') { g.fillStyle(0xf0c820, 0.7 * a); g.fillEllipse(z.x, z.y - 2, z.w, 12); }
      else if (z.kind === 'ice') { g.fillStyle(0xcfeeff, 0.55 * a); g.fillEllipse(z.x, z.y - 2, z.w, 10); }
      else if (z.kind === 'fire') { g.fillStyle(0xff7a2a, (0.4 + Math.sin(t * 20 + z.id) * 0.15) * a); g.fillEllipse(z.x, z.y - 20, z.w, 44); }
      else { g.fillStyle(0xffffff, 0.75 * a); for (let i = 0; i < 40; i++) { const sx = z.x - z.w / 2 + ((i * 97 + t * 160) % z.w), sy = z.y - 300 + ((i * 53 + t * 220) % 320); g.fillCircle(sx, sy, 2.5); } }
    }
    if (h.orbs) for (let i = 0; i < h.orbs.n; i++) {
      const a = w.time * 4 + (i / h.orbs.n) * Math.PI * 2, ox = h.x + Math.cos(a) * 64, oy = h.y - 40 + Math.sin(a) * 34;
      g.fillStyle(0xfafaf2, 1); g.fillCircle(ox, oy, 10); g.fillStyle(0x1a3a2a, 1); g.fillRect(ox - 10, oy + 1, 20, 7);
    }
    for (const s of w.shots) if (s.kind === 'steam' && s.tx !== undefined && s.ty !== undefined) { g.lineStyle(2, 0xff6a4a, 0.8); g.strokeEllipse(s.tx, s.ty - 2, 50, 12); }
    for (const m of w.mobs) {
      if (m.state === 'windup' && m.move === 'snipe') {
        const sy = m.y - MOBS[m.kind].h * 0.7, lock = m.t > 0.6;
        g.lineStyle(lock ? 2.5 : 1.2, 0xff2a2a, lock ? 0.9 : 0.5); g.lineBetween(m.x + m.face * 22, sy, m.aimX, m.aimY);
      }
      if (m.move === 'beam' && (m.state === 'windup' || m.state === 'attack')) {
        const on = m.state === 'attack'; g.lineStyle(on ? 16 : 2, on ? 0xe8d0ff : 0xc8a0ff, on ? 0.85 : 0.6); g.lineBetween(m.x + m.face * 20, m.aimY, m.aimX, m.aimY);
      }
      if (m.shellT > 0) { g.lineStyle(3, 0xffd27a, 0.8); g.strokeEllipse(m.x, m.y - MOBS[m.kind].h / 2, MOBS[m.kind].w * 1.6, MOBS[m.kind].h * 1.3); }
      if (m.under && m.state !== 'dead' && m.kind === 'nshark') { g.fillStyle(0x6ab8e8, 1); g.fillTriangle(m.x - 10, m.y - 2, m.x + 14, m.y - 2, m.x + 2 * m.face, m.y - 34); continue; }
      if (m.under && m.state !== 'dead') { g.fillStyle(0x7a5a3a, 0.9); g.fillEllipse(m.x, m.y - 3, 46, m.state === 'windup' ? 16 + Math.sin(t * 40) * 4 : 12); }
    }
    this.slowTint?.setFillStyle(0x6a8aff, w.slowmo > 0 ? 0.16 : 0);

    // monsters
    const seen = new Set<number>();
    for (const m of w.mobs) { seen.add(m.id); this.drawMob(m, t); }
    for (const [id, v] of this.mobViews) if (!seen.has(id)) { v.img.destroy(); v.plate.destroy(); v.bar.destroy(); v.barBg.destroy(); v.shadow.destroy(); v.warn.destroy(); this.mobViews.delete(id); }

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
        c = s.kind === 'berry' ? this.add.circle(0, 0, 8, 0x3a4aa0).setStrokeStyle(2, 0x9ab0ff)
          : s.kind === 'boomerang' ? this.add.circle(0, 0, 13, 0xd8d8e0).setStrokeStyle(4, 0xe8a040)
          : s.kind === 'homing' ? this.add.rectangle(0, 0, 18, 14, 0xc88a40).setStrokeStyle(3, 0xff7a2a)
          : s.kind === 'toast' ? this.add.rectangle(0, 0, 18, 16, 0xd8a050).setStrokeStyle(2, 0x7a4a20)
          : s.kind === 'meteor' ? this.add.circle(0, 0, 18, 0x3a4aa0).setStrokeStyle(3, 0x9ab0ff)
          : s.kind === 'twister' ? this.add.ellipse(0, -20, 46, 110, 0x4a2a1a, 0.6).setStrokeStyle(3, 0x8a5a3a)
          : s.kind === 'snowball' ? this.add.circle(0, 0, 14, 0xf8faff).setStrokeStyle(2, 0xa8c8e8)
          : s.kind === 'wave' ? this.add.ellipse(0, 0, 130, 46, 0x6a3a1a, 0.9).setStrokeStyle(3, 0x3a1a08)
          : s.kind === 'quill' ? this.add.ellipse(0, 0, 18, 5, 0x6a4a2a).setStrokeStyle(1, 0xffe0a0)
          : s.kind === 'goo' ? this.add.circle(0, 0, 9, 0xf0c820).setStrokeStyle(2, 0xa07a10)
          : s.kind === 'spike' ? this.add.triangle(0, 0, 0, 14, 9, -14, 18, 14, 0x8a3a5a).setStrokeStyle(2, 0x3a1020)
          : s.kind === 'heat' ? this.add.ellipse(0, 0, 30, 22, 0xff6a2a, 0.75).setBlendMode(Phaser.BlendModes.ADD)
          : s.kind === 'ring' ? this.add.circle(0, 0, 13).setStrokeStyle(6, 0xf0d040)
          : s.kind === 'crumb' ? this.add.circle(0, 0, 6, 0x9a6a3a).setStrokeStyle(2, 0x4a2a10)
          : s.kind === 'spark' ? this.add.circle(0, 0, 7, 0xc8a0ff).setStrokeStyle(2, 0xffffff).setBlendMode(Phaser.BlendModes.ADD)
          : s.kind === 'spore' ? this.add.circle(0, 0, 8, 0x7ab8c8, 0.85).setStrokeStyle(2, 0x2a5a6a)
          : s.kind === 'acid' ? this.add.circle(0, 0, 8, 0xa8e04a).setStrokeStyle(2, 0x4a7a10)
          : s.kind === 'knife' ? this.add.ellipse(0, 0, 20, 5, 0xe0e0e8).setStrokeStyle(1, 0x5a5a6a)
          : s.kind === 'fortune' ? this.add.rectangle(0, 0, 16, 8, 0xfff8e0).setStrokeStyle(1, 0xa08a50)
          : s.kind === 'marinade' ? this.add.circle(0, 0, 9, 0xc0401a).setStrokeStyle(2, 0x6a1a08)
          : s.kind?.startsWith('puddle-') ? this.add.circle(0, 0, 9, s.kind === 'puddle-burn' ? 0xff7a2a : s.kind === 'puddle-poison' ? 0x7ab8c8 : s.kind === 'puddle-slick' ? 0xf0d040 : 0xa83a6a).setStrokeStyle(2, 0x2a1020)
          : s.kind === 'reflect' ? this.add.circle(0, 0, 9, 0x8ae07a).setStrokeStyle(2, 0xffffff)
          : s.from === 'hero'
          ? this.add.circle(0, 0, 9, 0xe8c8ff).setStrokeStyle(3, 0xffffff).setBlendMode(Phaser.BlendModes.ADD)
          : s.kind === 'icicle' && worldOf(this.stage).id === 4 ? this.add.circle(0, 0, 11, 0xc8904a).setStrokeStyle(3, 0x6a3a10)
          : s.kind === 'icicle' && worldOf(this.stage).id === 3 ? this.add.circle(0, 0, 8, 0xff6a2a).setStrokeStyle(2, 0xffd27a).setBlendMode(Phaser.BlendModes.ADD)
          : s.kind === 'icicle' ? this.add.ellipse(0, 0, 10, 26, 0xc8f0ff).setStrokeStyle(2, 0x6ab8ff)
          : s.kind === 'laser' ? this.add.ellipse(0, 0, 26, 5, 0xff4a4a).setStrokeStyle(1.5, 0xffe0e0).setBlendMode(Phaser.BlendModes.ADD)
          : s.kind === 'steam' ? this.add.circle(0, 0, 10, 0xf4f4ff, 0.85).setStrokeStyle(2, 0xc8d0e0)
          : s.kind === 'fire' ? this.add.circle(0, 0, 9, 0xff8a2a).setStrokeStyle(3, 0xffe27a).setBlendMode(Phaser.BlendModes.ADD)
          : this.add.circle(0, 0, 7, worldOf(this.stage).id === 2 ? 0x6ac86a : worldOf(this.stage).id === 3 ? 0xd0301a : 0x2a2020).setStrokeStyle(2, 0x8a7060);
        c.setDepth(8); this.shotImgs.set(s.id, c);
      }
      c.setPosition(s.x, s.y).setScale(1 + Math.sin(t * 30) * 0.12);
      if (s.kind === 'laser' || s.kind === 'quill' || s.kind === 'knife') c.setRotation(Math.atan2(s.vy, s.vx));
      if (s.kind === 'ring' || s.kind === 'fortune') c.setRotation(t * 14);
      if (s.kind === 'boomerang' || s.kind === 'snowball') c.setRotation(t * 20 * Math.sign(s.vx || 1));
      if (s.kind === 'snowball') c.setScale((s.r ?? 14) / 14);
      if (s.kind === 'twister') c.setScale(1 + Math.sin(t * 30) * 0.08, 1);
      if (s.from === 'hero' && s.kind !== 'berry' && Math.random() < 0.5) { const p = this.add.circle(s.x, s.y + (Math.random() - 0.5) * 12, 3, 0xffd8ff).setDepth(7); this.tweens.add({ targets: p, alpha: 0, duration: 250, onComplete: () => p.destroy() }); }
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
    setUltUi(h.d.level >= ULT_LV, h.ult);
    const sk = skillsOf(h.d.cls.species).actives;
    for (let i = 0; i < 3; i++) {
      const lv = h.d.skillLv[sk[i].id] ?? 0;
      const full = applyBranch(sk[i], h.d.branch[sk[i].id]).cd * skillScale(lv).cd * (1 - h.d.cdr);
      setSkillUi(i, lv ? sk[i].name : null, lv && full ? h.cds[i] / full : 0, h.cds[i]);
    }
  }

  private drawMob(m: Mob, t: number): void {
    const def = MOBS[m.kind];
    let v = this.mobViews.get(m.id);
    if (!v) {
      const img = this.add.image(0, 0, this.has(def.art) ? def.art : '__WHITE').setOrigin(0.5, 0.96).setDepth(def.brain === 'boss' ? 4 : 3);
      const plate = this.add.text(0, 0, `Lv${m.lv} ${m.elite ? 'Elite ' : ''}${this.world!.mobName(m)}`, { fontFamily: 'Nunito', fontStyle: '900', fontSize: '10px', color: '#ffffff', backgroundColor: '#1a1020b0', padding: { x: 4, y: 1 } })
        .setOrigin(0.5, 0).setDepth(9).setResolution(3);
      const barBg = this.add.rectangle(0, 0, 40, 5, 0x000000, 0.6).setDepth(9);
      const bar = this.add.rectangle(0, 0, 40, 5, 0xff4a5a).setOrigin(0, 0.5).setDepth(9);
      const shadow = this.add.ellipse(0, 0, def.w * 1.1, 10, 0x000000, 0.2).setDepth(1);
      const warn = this.add.text(0, 0, '!', { fontFamily: 'Luckiest Guy', fontSize: '30px', color: '#ff2a2a', stroke: '#ffffff', strokeThickness: 5 }).setOrigin(0.5, 1).setDepth(10).setResolution(3).setVisible(false);
      v = { warn, img, plate, bar, barBg, shadow, s: (def.h + (def.brain === 'boss' ? 20 : 12)) / img.height * (m.elite ? ELITE.scale : 1) };
      if (m.elite) plate.setColor('#ffb347');
      if (m.mods.length) plate.setColor(ELITE_MODS[m.mods[0]].color);
      if (def.brain === 'boss') plate.setVisible(false);
      this.mobViews.set(m.id, v);
    }
    const flyer = def.brain === 'flyer';
    // a mimic looks exactly like a dropped loot box until it bites
    const boxKey = m.kind === 'cereal' ? 'box-3' : 'box-2';
    if (m.disguised) {
      if (v.img.texture.key !== boxKey && this.has(boxKey)) { v.img.setTexture(boxKey).setOrigin(0.5, 1); v.s = 32 / v.img.height; }
      v.img.setPosition(m.x, m.y + Math.sin(t * 3 + m.id) * 2 - 2).setScale(v.s).setRotation(0).setFlipX(false).clearTint();
      v.plate.setVisible(false); v.shadow.setVisible(false); v.bar.setVisible(false); v.barBg.setVisible(false);
      return;
    }
    if (v.img.texture.key === boxKey && def.brain === 'mimic' && this.has(def.art)) { v.img.setTexture(def.art).setOrigin(0.5, 0.96); v.s = (def.h + 12) / v.img.height * (m.elite ? ELITE.scale : 1); v.plate.setVisible(true); v.shadow.setVisible(true); }
    v.img.setVisible(!m.under); v.plate.setVisible(!m.under && def.brain !== 'boss'); v.shadow.setVisible(!m.under);
    const wob = flyer ? Math.sin(t * 22 + m.id) * 0.6 : m.state === 'walk' && Math.abs(m.vx) > 5 ? Math.sin(t * 14 + m.id) : 0;
    let sx = 1 + wob * 0.04, sy = 1 - wob * 0.05, rot = wob * 0.05;
    if (m.state === 'windup') { const k = Math.min(1, m.t / 0.4); sx = 1 + 0.12 * k; sy = 1 - 0.12 * k; rot = -0.12 * m.face * k; if (def.brain === 'bomber') { sx = sy = 1 + Math.sin(t * 40) * 0.1 + m.t * 0.3; } }
    if (m.state === 'attack') { sx = 0.92; sy = 1.1; rot = 0.16 * m.face; if (m.move === 'charge') rot = 0.25 * m.face; }
    if (m.state === 'hurt') rot = -0.22 * m.face;
    if (m.state === 'stagger') rot = Math.sin(t * 20) * 0.1;
    if (m.state === 'dead') { rot = m.deadT * 10 * -m.face; v.img.setAlpha(Math.max(0, 1 - m.deadT / 0.7)); }
    // art faces left: flip when facing right
    v.img.setPosition(m.x, m.y).setScale(v.s * sx, v.s * sy).setRotation(rot).setFlipX(m.face > 0);
    if (m.flash > 0) v.img.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);
    else if (m.frozen > 0) v.img.setTint(0x9fd8ff).setTintMode(Phaser.TintModes.MULTIPLY);
    else if (m.glued > 0) v.img.setTint(0xf8e060).setTintMode(Phaser.TintModes.MULTIPLY);
    else if (m.burn > 0 && Math.floor(t * 10) % 2 === 0) v.img.setTint(0xffa060).setTintMode(Phaser.TintModes.MULTIPLY);
    else if (this.world!.isDanger(m)) v.img.setTint(Math.floor(t * 14) % 2 ? 0xff3030 : 0xff8080).setTintMode(Phaser.TintModes.MULTIPLY); // red: can't interrupt, dodge it!
    else if (m.state === 'windup' && Math.floor(t * 12) % 2 === 0) v.img.setTint(0xffc070).setTintMode(Phaser.TintModes.MULTIPLY);
    else if (m.enraged && Math.floor(t * 4) % 2 === 0) v.img.setTint(0xff9a8a).setTintMode(Phaser.TintModes.MULTIPLY);
    else if (m.state === 'stagger') v.img.setTint(0xfff0a0).setTintMode(Phaser.TintModes.MULTIPLY);
    else v.img.clearTint().setTintMode(Phaser.TintModes.MULTIPLY);
    const top = m.y - def.h * (m.elite ? ELITE.scale : 1) - 18;
    const danger = this.world!.isDanger(m);
    v.warn.setVisible(danger).setPosition(m.x, top - 4).setScale(danger ? 1 + Math.sin(t * 24) * 0.15 : 1);
    const fl = this.world!.floorBelow(m.x, m.y, m.y + 2000, false);
    v.shadow.setPosition(m.x, (fl ? fl.y : m.y) - 1).setAlpha(m.state === 'dead' ? 0 : 1);
    v.plate.setPosition(m.x, flyer ? m.y + 6 : m.y + 4).setAlpha(m.state === 'dead' ? 0 : 0.9);
    if (flyer) v.shadow.setScale(Math.max(0.3, 1 - ((fl ? fl.y : m.y) - m.y) / 200));
    const showBar = m.hurtShown > 0 && m.state !== 'dead' && def.brain !== 'boss';
    v.barBg.setVisible(showBar).setPosition(m.x, top);
    v.bar.setVisible(showBar).setPosition(m.x - 20, top).setScale(Math.max(0, m.hp / m.maxHp), 1);
  }
}

/** Big cut-in banner for an ultimate (HTML, over the canvas). */
function showUltBanner(species: number, name: string): void {
  let el = document.getElementById('ultban');
  if (!el) {
    el = document.createElement('div'); el.id = 'ultban';
    const st = document.createElement('style');
    st.textContent = `#ultban { position: fixed; left: 0; right: 0; top: 30%; height: 22vmin; z-index: 25; pointer-events: none; display: none; align-items: center; justify-content: center; gap: 3vmin;
      background: linear-gradient(90deg, transparent, #2a1030e8 15%, #2a1030e8 85%, transparent); border-top: 3px solid #ffd27a; border-bottom: 3px solid #ffd27a; }
      #ultban.on { display: flex; animation: ultin 1.3s ease-out forwards; }
      #ultban img { height: 26vmin; margin-top: -4vmin; filter: drop-shadow(0 1vmin 1vmin #000); animation: ultimg 1.3s ease-out; }
      #ultban b { font-family: 'Luckiest Guy', sans-serif; font-weight: 400; font-size: 7vmin; color: #ffd27a; letter-spacing: 0.05em; text-shadow: 0 0.6vmin 0 #a03010; }
      @keyframes ultin { 0% { transform: scaleY(0); opacity: 0; } 12% { transform: scaleY(1); opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; } }
      @keyframes ultimg { from { transform: translateX(-40vw); } 25% { transform: none; } }`;
    document.head.appendChild(st); document.body.appendChild(el);
  }
  el.innerHTML = `<img src="art/kaiju-${species}.webp"><b>${name}!</b>`;
  el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
}
