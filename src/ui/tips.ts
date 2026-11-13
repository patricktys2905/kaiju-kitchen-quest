// First-time help: a short guided start (move, jump, attack, dodge, skill, gear) and one-time tips the first time you meet
// something (a ladder, an arena, a hazard, a sponge, low health, the Crumblet, the Recipe Scroll, a boss). Each shows in a
// small coach bar, advances when you do the thing (or after a while), and is remembered per save (save.tips).
// Settings can switch tips off.
import { save, persist } from '../save';
import { isTouchDevice } from '../touch';
import { settings } from './settings';
import type { World } from '../sim/world';
import { ELEMENT_INFO, type Element } from '../sim/elements';
import { stageWants } from '../sim/cookbook';

/** Does the bag hold a drop this stage's exits will not take (a kind they do not ask for, or more than they ask for)? */
export function hasSpareDrop(drops: Partial<Record<string, number>>, wants: Record<string, number>): boolean {
  return Object.entries(drops).some(([k, n]) => (n ?? 0) > (wants[k] ?? 0));
}

interface Tip { id: string; text: (touch: boolean, c: Coach) => string; /** show it now? */ when: (w: World, c: Coach) => boolean; /** done (hide early)? */ done?: (w: World, t: number) => boolean; basic?: boolean }

const TIPS: Tip[] = [
  // the guided start, in order (only on a kaiju's first stage of a save)
  { id: 'move', basic: true, text: t => t ? 'Drag the stick on the left to walk' : 'Walk with ← →', when: () => true, done: w => Math.abs(w.hero.x - 100) > 140 },
  { id: 'jump', basic: true, text: t => t ? 'Tap JUMP to jump (hold for higher)' : 'Jump with SPACE (hold for higher)', when: () => true, done: w => !w.hero.ground && w.hero.vy < 0 },
  { id: 'attack', basic: true, text: t => t ? 'Tap ATTACK three times for a combo' : 'Attack with J: three in a row is a combo', when: () => true, done: w => w.combo >= 3 || w.hero.step >= 2 },
  { id: 'dodge', basic: true, text: t => t ? 'Dodge roll: flick the stick twice quickly toward a side' : 'Dodge roll: double-tap ← or →', when: () => true, done: w => w.hero.state === 'dodge' },
  { id: 'skill', basic: true, text: t => t ? 'The round blue buttons are your skills' : 'Skills: L, I and O', when: w => (w.hero.d.skillLv[Object.keys(w.hero.d.skillLv)[0]] ?? 0) > 0, done: w => w.hero.state === 'skill' },
  { id: 'gear', basic: true, text: t => t ? 'Your weapon has a special move: the GEAR button' : 'Your weapon has a special move: press F', when: w => !!w.hero.d.gear, done: w => (w.hero.cds[3] ?? 0) > 0 },
  // one-time tips, the first time it happens
  // elemental weaknesses: set off by the hit events (GameScene tells the coach), not by the world's state
  { id: 'weak', text: (_t, c) => `WEAK! This monster hates ${c.weakEl ? ELEMENT_INFO[c.weakEl].icon : 'that'}. The stage card shows what each stage is weak to`, when: (_w, c) => !!c.weakEl },
  { id: 'resist', text: () => 'RESIST: this monster shrugs that element off a bit. Plain hits always do full damage', when: (_w, c) => c.resists >= 3 },
  { id: 'ladder', text: () => 'A ladder! Stand on it and press ↑ to climb', when: w => !!w.ladderAt(w.hero.x, w.hero.y), done: w => w.hero.state === 'climb' },
  { id: 'drop', text: t => t ? 'Hold the stick down and tap JUMP to drop through a ledge' : 'Hold ↓ and press SPACE to drop through a ledge', when: w => w.hero.ground && w.hero.on !== null && w.hero.on >= 0, done: w => !w.hero.ground && w.hero.vy > 0 },
  { id: 'arena', text: () => 'The gates are shut! Beat every wave to open them', when: w => w.arenas.some(a => a.locked) },
  { id: 'hazard', text: () => 'Watch the floor: hazards flash before they fire', when: w => w.hazards.some(z => z.state === 'warn' && Math.abs(z.x - w.hero.x) < 260) },
  { id: 'sponge', text: () => 'A bouncy sponge: jump on it to reach something high up', when: w => w.props.some(p => p.kind === 'sponge' && Math.abs(p.x - w.hero.x) < 160) },
  { id: 'potion', text: t => t ? 'Low on health: tap the jam jar at the bottom' : 'Low on health: press 1 for a jam jar', when: w => w.hero.hp < w.hero.d.maxHp * 0.4 && w.hero.bag.some(b => b && b.n > 0), done: w => w.hero.hp > w.hero.d.maxHp * 0.6 },
  { id: 'escort', text: () => 'Keep the Crumblet safe: it follows you to the exit', when: w => !!w.npc },
  { id: 'fetch', text: () => 'Race to the Recipe Scroll before the timer runs out!', when: w => !!w.scroll && !w.scroll.got && w.objArmed },
  { id: 'boss', text: () => 'A boss! Watch for its glowing wind-ups, and dodge the red ones', when: w => !!w.boss },
  // the Monster Cookbook: the first time you hold a drop no exit of this stage will take
  { id: 'cookbook', text: () => 'A spare drop! Exits only take what they ask for. Hand spares in at camp: Bag → Cookbook pays crumbs', when: w => hasSpareDrop(w.drops, stageWants(w.stage)) },
  { id: 'exit', text: () => 'All clear! Walk to the glowing EXIT on the right', when: w => w.portal },
];

let bar: HTMLElement | null = null;
function ensureBar(): HTMLElement {
  if (bar) return bar;
  const st = document.createElement('style');
  st.textContent = `#coach { position: fixed; z-index: 12; left: 50%; top: calc(11vmin + env(safe-area-inset-top)); transform: translateX(-50%); display: none; align-items: center; gap: 1.2vmin; max-width: 80vw;
    background: #24142ae8; border: 2px solid #9fe8ff; border-radius: 2vmin; padding: 0.8vmin 1.4vmin 0.8vmin 2vmin; color: #fff; font: 800 calc(var(--ts, 1) * 2.6vmin) Nunito, sans-serif; box-shadow: 0 0.6vmin 2vmin #0008; }
    body.bossbar #coach { top: calc(17.5vmin + env(safe-area-inset-top)); }
    #coach.on { display: flex; animation: coachin 0.3s ease-out; } @keyframes coachin { from { opacity: 0; transform: translate(-50%, -1vmin); } }
    #coach b { color: #9fe8ff; font-family: 'Luckiest Guy', sans-serif; font-weight: 400; letter-spacing: 0.04em; }
    #coach button { pointer-events: auto; font: inherit; background: none; border: 0; color: #b8a8c8; font-size: 1.1em; cursor: pointer; padding: 0 0.6vmin; }`;
  document.head.appendChild(st);
  bar = document.createElement('div'); bar.id = 'coach'; document.body.appendChild(bar);
  return bar;
}

/** One stage's worth of tips. Call step() every frame; stop() when the stage ends. */
export class Coach {
  private cur: Tip | null = null;
  private shownT = 0;
  private quiet = 1.5; // a moment of calm before the first tip
  private basics: boolean;
  constructor(firstStage: boolean) { this.basics = firstStage; }
  /** the element of your first weak hit this stage (the 'weak' tip names it) */
  weakEl: Element | null = null;
  /** how many of your hits this stage were resisted (the 'resist' tip comes on the third) */
  resists = 0;
  /** One of your hits carried an element the monster is weak to (w 1) or resists (w -1). */
  onElementHit(el: Element, w: 1 | -1): void { if (w > 0) this.weakEl ??= el; else this.resists++; }
  private seen(id: string) { return (save.tips ?? []).includes(id); }
  private remember(id: string) { (save.tips ??= []).push(id); persist(); }
  step(w: World, dt: number): void {
    if (!settings.tips) { this.hide(); return; }
    if (this.cur) {
      this.shownT += dt;
      const finished = this.cur.done ? this.cur.done(w, this.shownT) : this.shownT > 6;
      if ((finished && this.shownT > 1.2) || this.shownT > (this.cur.basic ? 25 : 9)) { this.hide(); this.quiet = 0.8; }
      return;
    }
    if ((this.quiet -= dt) > 0) return;
    const next = TIPS.find(t => !this.seen(t.id) && (this.basics || !t.basic) && t.when(w, this));
    if (next) this.show(next);
  }
  private show(t: Tip): void {
    this.cur = t; this.shownT = 0; this.remember(t.id);
    const b = ensureBar();
    b.innerHTML = `<b>TIP</b><span>${t.text(isTouchDevice, this)}</span><button aria-label="Hide tip">✕</button>`;
    b.querySelector('button')!.addEventListener('pointerdown', e => { e.preventDefault(); this.hide(); });
    b.classList.add('on');
  }
  hide(): void { this.cur = null; bar?.classList.remove('on'); }
}

/** For the settings menu: forget which tips were shown (they come back). */
export function resetTips(): void { save.tips = []; persist(); }
