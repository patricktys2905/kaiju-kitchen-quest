// Side-scrolling brawler simulation: hero physics (ground, one-way platforms, ladders), combos, 3 skill
// slots, buffs, monsters with levels and brains (walker/hopper/ranged/brute/boss), loot boxes, stage clear.
// Fixed timestep (call step(input) at DT).
import type { AttackDef } from './classes';
import { rollTier } from './loot';
import { type BoostKind, CONSUMABLES, type ConsumableId, QUICK_CD } from './consumables';
import { BOSS_ARMOR, BOSS_PATTERNS, DANGER_MOVES, ELITE, ELITE_MODS, type EliteMod, MOBS, type NemMove, TUNE, nemesisMoves, dropLevel, mobAtk, mobCrumbs, mobHp, mobXp } from './mobs';
import { type SkillDef, ULTS, ULT_LV, applyBranch, applyMod, skillScale } from './skills';
import { WORLDS } from './stages';
import type { Derived } from './stats';
import { type BoxTier, type Hazard, type Input, type MobSpawn, type Prop, type LootBox, type MobKind, NO_INPUT, type SimEvent, type Spicy, type StageDef } from './types';

export const DT = 1 / 60;
export const GRAVITY = 1900;
const MAX_FALL = 900;
const CLIMB_SPEED = 150;
const COYOTE = 0.08;
const BUFFER = 0.12;   // jump / attack input buffer
const HERO_W = 34;
const COMBO_WINDOW = 1.6;
export const HARD_LV = 6; // Hard mode: monsters this many levels higher
/** Fighting above your level: monsters more than `free` levels over you take `per` less damage per extra level. */
export const LV_GAP = { free: 4, per: 0.06 };
const DOUBLE_TAP = 0.28;  // seconds between two taps of a direction for a dodge roll
const DODGE_T = 0.32, DODGE_INV = 0.3, DODGE_CD = 0.55;
/** a hit that lands in the first part of a dodge is a PERFECT dodge */
export const PERFECT_WIN = 0.2;
/** Nightmare on top of Hard's levels: tougher, harder-hitting monsters (plus shorter telegraphs and smarter tactics) */
export const NIGHTMARE = { hp: 1.2, atk: 1.25 };
/** World bosses on Nightmare: a smaller bump (their fights are long and the shorter telegraphs already bite) */
export const NIGHTMARE_BOSS = { hp: 1.1, atk: 1.12 };
const SLOWMO_T = 0.55, SLOWMO_RATE = 0.3, COUNTER_T = 1.6;
/** style meter letters (0..100) */
export const STYLE_RANKS: [number, string][] = [[80, 'S'], [60, 'A'], [40, 'B'], [20, 'C'], [0, 'D']];
export const styleRank = (v: number) => STYLE_RANKS.find(([t]) => v >= t)![1];

export type HeroState = 'move' | 'attack' | 'air' | 'skill' | 'climb' | 'hurt' | 'down' | 'dodge';

export interface Buff { atk: number; def: number; speed: number; armor: boolean; t: number; reflect?: boolean; leech?: number }

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
  /** cooldowns: skills 1-3, then the gear skill */
  cds: number[];
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
  /** ultimate gauge 0..100 */
  ult: number;
  phoenixUsed: boolean;
  /** perfect-dodge counter window: guaranteed crits */
  counter: number;
  perfectDone: boolean;
  spikyT: number;
  /** Rice Ball Ring: orbs circling the hero */
  orbs: { t: number; n: number; dmg: number; cd: Map<number, number> } | null;
  /** launched by a sponge (letting go of jump doesn't cut it short) */
  bounced: boolean;
  /** party: which hero this is (0 = the player), CPU-controlled, revive progress, touched down this step */
  idx: number; cpu: boolean; revT: number; landed: boolean;
  /** multi-step skills: facing at the start, queued targets */
  skillFace: 1 | -1;
  targets: number[];
  /** signature legendary 'echo': the skill fires again shortly after */
  echo: { sk: SkillDef; t: number } | null;
  /** procs: shield bubble (HP it soaks, seconds left, cooldown), spike / zap counters, highest point of the current fall */
  shield: number; shieldT: number; bubbleCd: number; spikeCd: number; zapN: number; peakY: number;
  /** Meringue Guard / Popcorn Burst cooldowns, Pepper Breath skill count */
  guardCd: number; popCd: number; skillN: number;
  /** how far the last landing dropped (px): a sponge only bounces you if you jumped or walked onto it, not fell from the ledge */
  lastFall: number;
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
  slow: number;        // seconds of Brain-Freeze slow left
  mods: EliteMod[];
  /** burrower travelling underground (can't be hit) */
  under: boolean;
  /** mimic still pretending to be a loot box */
  disguised: boolean;
  /** sniper's locked aim point */
  aimX: number; aimY: number;
  /** boss phase 2 */
  enraged: boolean;
  /** summoner's id for its little ones */
  parent: number;
  dropT: number;
  /** burrower: seconds above ground */
  surfT: number;
  /** status from skills: burning (damage every 0.5 s), frozen solid (no action, +30% damage taken) */
  burn: number; burnT: number; burnDmg: number; frozen: number;
  /** stuck in mustard: can't move or act (can still be hit) */
  glued: number;
  /** nemesis: which world's version (more moves later), shell timer, a stolen quick-bag item */
  phase: number; shellT: number; stolen: number;
  /** guard raised against a button-masher (blocks plain combo hits) */
  guardT: number;
  /** spawned by arena room i (-1 = not) */
  arena: number;
  /** which hero it's after (index into heroes) */
  tgt: number;
  /** which side of you this monster tries to stand on (flanking) */
  flank: 1 | -1;
  /** learnable bosses: the moves left in the current string, which string is next, tired / armour / weak timers, phase */
  queue: string[]; patI: number; tired: number; armor: number; weak: number; bossPhase: number;
}

export interface Box { id: number; tier: BoxTier; ilvl: number; x: number; y: number; vy: number; ground: boolean; t: number; /** only this player can pick it up (each player gets their own drops) */ owner?: number }
export interface Shot { /** lobbed by a hero: the floor height it was thrown from (it falls through ledges above that) */ fromY?: number; /** extra effects on hit (gear skills, upgraded skills) and the weapon icon a gear shot is drawn as */ fx?: string[]; icon?: string; id: number; x: number; y: number; vx: number; vy: number; t: number; dmg: number; hit: Set<number>; from: 'hero' | 'mob'; kx: number; ky: number; pierce: boolean; g?: number; kind?: string; /** hit radius (default 14) */ r?: number; back?: boolean; /** Pit Hurl: bounces so far */ bounces?: number; /** lobbed shots: where it will land (drawn as a warning) */ tx?: number; ty?: number; /** hero who fired it */ owner?: number }
export interface Mine { id: number; x: number; y: number; t: number; dmg: number; kx: number; ky: number; owner?: number; /** Jam Trap: glues what it hits */ glue?: boolean; /** gear trap: the weapon's icon and on-hit effects */ icon?: string; fx?: string[] }

export interface RunStats { time: number; hitsTaken: number; dmgTaken: number; maxCombo: number; kills: number; crumbs: number; revived: number; stones: number; perfects: number; interrupts: number; styleSum: number; styleTime: number; stylePeak: number }

let nextId = 1;

export class World {
  /** the party: heroes[0] is the player, the rest are teammates (CPU buddy now, online players later) */
  heroes: Hero[] = [];
  /** the hero the current bit of code is about: the one stepping, the one a monster targets, a shot's owner.
   *  Between steps it is always the player (heroes[0]). */
  private cur!: Hero;
  get hero(): Hero { return this.cur; }
  /** Online guests: draw the stage from this hero's point of view (a guest's World never steps). */
  view(i: number): void { this.cur = this.heroes[i] ?? this.heroes[0]; }
  /** A teammate's stats changed (an online friend levelled up mid-stage). */
  setDerivedOf(i: number, d: Derived): void { const c = this.cur; this.cur = this.heroes[i] ?? c; this.setDerived(d); this.cur = c; }
  /** how many players collect loot (each gets their own drops); CPU buddies loot for the player */
  humans = 1;
  /** per-player loot (lootOf[0] is the player's, also `loot`) */
  lootOf: LootBox[][] = [[]];
  get loot(): LootBox[] { return this.lootOf[0]; }
  mobs: Mob[] = [];
  boxes: Box[] = [];
  shots: Shot[] = [];
  mines: Mine[] = [];
  events: SimEvent[] = [];
  time = 0;
  combo = 0; comboT = 0;
  run: RunStats = { time: 0, hitsTaken: 0, dmgTaken: 0, maxCombo: 0, kills: 0, crumbs: 0, revived: 0, stones: 0, perfects: 0, interrupts: 0, styleSum: 0, styleTime: 0, stylePeak: 0 };
  /** style meter 0..100: varied moves raise it, getting hit halves it */
  style = 0;
  private styleRecent: string[] = [];
  private styleLetter = 'D';
  /** monsters move in slow motion after a perfect dodge */
  slowmo = 0;
  hazards: (Hazard & { state: 'off' | 'warn' | 'on'; hit: Set<number> })[] = [];
  /** ground puddles left by monsters: mould / slime slow you, slick makes you slide, burn and poison hurt, trap snaps once */
  puddles: { x: number; y: number; t: number; kind?: 'slow' | 'slick' | 'burn' | 'poison' | 'trap'; dmg?: number; w?: number }[] = [];
  private puddleTick = 0;
  /** interactive props (crates, jars, sponges, levers, chests) and runaway pressure cookers */
  props: { id: number; kind: Prop['kind']; x: number; y: number; hp: number; cd: number; key?: boolean; tx?: number; tw?: number }[] = [];
  cookers: { id: number; x: number; y: number; vx: number; home: number; face: 1 | -1; fuse: number; gone: number }[] = [];
  private platBase: number[] = [];
  /** objective state: the escorted Crumblet, the fetch scroll, the survival / hold-out timer */
  npc: { x: number; y: number; hp: number; maxHp: number; face: 1 | -1; hurt: number } | null = null;
  scroll: { x: number; y: number; got: boolean } | null = null;
  objTimer = 0;
  holdout = 0;
  objDone = false;
  private spawnT = 0;
  /** button-mash reading: consecutive plain-combo hits */
  private mash = 0; private mashT = 0;
  /** Nightmare: Hard's levels + smarter, faster monsters */
  nightmare = false;
  /** arena rooms (gates shut while you're fighting the waves), the rolling-pin chase, conveyor belts */
  arenas: { x0: number; x1: number; waves: MobSpawn[][]; wave: number; locked: boolean; done: boolean }[] = [];
  chase: { x0: number; x1: number; x: number; speed: number; on: boolean; done: boolean; cd: number } | null = null;
  /** how many monsters may attack you at once (the rest circle and wait their turn) */
  get maxAttackers(): number { return this.nightmare ? 3 : 2; }
  /** lingering skill areas: steam / mustard goo / ice trail / fire floor / snow */
  zones: { id: number; x: number; y: number; w: number; t: number; tick: number; next: number; dmg: number; kind: 'steam' | 'goo' | 'ice' | 'fire' | 'snow' | 'guac'; hit?: Set<number>; owner?: number }[] = [];
  spicy: Spicy[];
  hard: boolean;
  portal = false;
  cleared = false;
  failed = false;
  /** x of the exit plate (appears when every monster is beaten) */
  exitX: number;
  rand: () => number;

  /** story twist on this stage */
  variant: 'swarm' | 'ambush' | 'night' | undefined;

  constructor(public stage: StageDef, d: Derived, seed = 1, bag: Hero['bag'] = [], revives = 0, hard = false, variant?: 'swarm' | 'ambush' | 'night', spicy: Spicy[] = [], public nemesis?: MobKind, nightmare = false, party: Derived[] = [], humans = 1, partyBags: { bag: Hero['bag']; revives: number }[] = []) {
    nextId = 1; // ids restart with every stage: the same seed and inputs always play out the same (monster patrols use the id)
    this.humans = Math.max(1, humans); this.lootOf = Array.from({ length: this.humans }, () => []);
    this.nightmare = nightmare; if (nightmare) hard = true;
    this.stage = stage = { ...stage, platforms: stage.platforms.map(p => ({ ...p })) };
    this.platBase = stage.platforms.map(p => p.x);
    this.props = (stage.props ?? []).map(p => ({ id: nextId++, kind: p.kind, x: p.x, y: p.y, hp: p.kind === 'crate' ? 2 : p.kind === 'chest' ? 3 : p.kind === 'jar' ? 1 : 99, cd: 0, key: p.key, tx: p.tx, tw: p.tw }));
    this.cookers = (stage.cookers ?? []).map(x => ({ id: nextId++, x, y: stage.groundY, vx: 0, home: x, face: -1, fuse: 0, gone: 0 }));
    this.spicy = spicy; this.hard = hard;
    this.arenas = (stage.arenas ?? []).map(a => ({ ...a, wave: -1, locked: false, done: false }));
    this.chase = stage.chase ? { ...stage.chase, x: 0, speed: 0, on: false, done: false, cd: 0 } : null;
    const ob = stage.objective;
    if (ob?.kind === 'escort') this.npc = { x: 60, y: stage.groundY, hp: 1, maxHp: 1, face: 1, hurt: 0 };
    if (ob?.kind === 'fetch') { this.scroll = { x: ob.x ?? stage.width - 260, y: stage.groundY, got: false }; this.objTimer = ob.t ?? 75; }
    if (ob?.kind === 'survive') { this.objTimer = ob.t ?? 45; this.holdout = this.objTimer; }
    this.hazards = (stage.hazards ?? []).map(h => ({ ...h, state: 'off', hit: new Set<number>() }));
    let s = seed >>> 0 || 1;
    this.rand = () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
    this.exitX = stage.width - 90;
    const mk = (dd: Derived, idx: number, x: number, b: Hero['bag'], rv: number): Hero => ({
      d: dd, x, y: stage.groundY, vx: 0, vy: 0, face: 1, ground: true, on: -1, state: 'move', t: 0, step: 0, queued: false,
      hitIds: new Set(), hp: dd.maxHp, inv: 0, cds: [0, 0, 0, 0], skill: null, skillMul: 1, ticks: 0,
      coyote: 0, jumpBuf: 0, atkBuf: 0, dropT: 0, prev: { ...NO_INPUT }, gliding: false, buff: null,
      boosts: {}, bag: b.map(q => q && { ...q }), revives: rv, quickCd: 0, lastTap: { dir: 0, t: -9 }, dodgeCd: 0, ult: 0, phoenixUsed: false,
      counter: 0, perfectDone: false, spikyT: 0, orbs: null, skillFace: 1, targets: [], bounced: false,
      idx, cpu: idx >= this.humans, revT: 0, landed: false,
      echo: null, shield: 0, shieldT: 0, bubbleCd: 0, spikeCd: 0, zapN: 0, peakY: stage.groundY, lastFall: 0, guardCd: 0, popCd: 0, skillN: 0,
    });
    this.heroes = [mk(d, 0, 100, bag, revives), ...party.map((pd, i) => mk(pd, i + 1, 60 - i * 30, partyBags[i]?.bag ?? [], partyBags[i]?.revives ?? 0))];
    this.cur = this.heroes[0];
    // Hard mode: every monster +HARD_LV levels
    this.variant = stage.boss ? undefined : variant; // bosses are never changed by the story
    const night = this.variant === 'night' ? 1 : 0;
    if (this.npc) { this.npc.maxHp = this.npc.hp = Math.round(d.maxHp * 0.7); }
    // stage 5: this kaiju's story nemesis takes the elite's place
    const nemStage = !!nemesis && !stage.boss && stage.id.endsWith('-5') && stage.world <= 5; // Act 2: the nemeses have hung up their capes
    for (const m of stage.mobs) this.spawnMob(m.elite && nemStage ? nemesis! : m.kind, m.x, m.lv + (hard ? HARD_LV : 0) + night, m.y, m.elite);
    if (this.variant === 'swarm') {
      for (const m of stage.mobs.filter((_, i) => i % 2 === 0)) this.spawnMob(m.kind, Math.min(stage.width - 200, m.x + 70), m.lv + (hard ? HARD_LV : 0), m.y, m.elite);
      for (const m of this.mobs) if (!m.elite) { m.hp = m.maxHp = Math.round(m.maxHp * 0.65); }
    }
    if (this.variant === 'ambush') {
      const w = WORLDS.find(x => x.id === stage.world) ?? WORLDS[0];
      this.spawnMob(w.elite, Math.round(stage.width * 0.55), stage.lv[1] + 1 + (hard ? HARD_LV : 0), undefined, true);
    }
    // elite modifiers: one per elite (two in Hard); in Hard some normal monsters get one too. Bosses never change.
    const all = Object.keys(ELITE_MODS) as EliteMod[];
    for (const m of this.mobs) {
      if (MOBS[m.kind].brain === 'boss' || MOBS[m.kind].brain === 'nemesis') continue;
      const n = m.elite ? (hard ? 2 : 1) : this.nightmare && this.rand() < 0.3 ? 1 : hard && this.rand() < 0.12 ? 1 : 0;
      while (m.mods.length < n) { const k = all[Math.floor(this.rand() * all.length)]; if (!m.mods.includes(k)) m.mods.push(k); }
    }
  }

  /** Display name with elite prefixes, e.g. 'Spiky Hasty Rotten Egg'. */
  mobName(m: Mob): string { return [...m.mods.map(k => ELITE_MODS[k].name), MOBS[m.kind].name].join(' '); }

  /** Red attacks can't be interrupted: dodge them. */
  isDanger(m: Mob): boolean { return m.state === 'windup' && DANGER_MOVES.has(m.move) && (m.move !== 'brute' || m.elite); }

  private addStyle(tag: string, base: number): void {
    const fresh = !this.styleRecent.includes(tag);
    this.style = Math.min(100, this.style + base * (fresh ? 1 : 0.3));
    this.styleRecent.push(tag); if (this.styleRecent.length > 4) this.styleRecent.shift();
    const l = styleRank(this.style);
    if (l !== this.styleLetter && STYLE_RANKS.findIndex(([, x]) => x === l) < STYLE_RANKS.findIndex(([, x]) => x === this.styleLetter)) this.events.push({ t: 'style', rank: l });
    this.styleLetter = l;
  }

  /** New stats (level up mid-stage, or a different hero). Keeps the HP fraction. */
  setDerived(d: Derived): void {
    const f = this.hero.hp / this.hero.d.maxHp;
    this.hero.d = d;
    this.hero.hp = Math.max(1, Math.round(d.maxHp * f));
  }

  spawnMob(kind: MobKind, x: number, lv: number, y?: number, elite = false): Mob {
    const pow = this.stage.power ?? WORLDS.find(x => x.id === this.stage.world)?.power ?? 1;
    const nm = !this.nightmare ? { hp: 1, atk: 1 } : MOBS[kind].brain === 'boss' ? NIGHTMARE_BOSS : NIGHTMARE;
    // more heroes, tougher monsters: +60% HP per extra player, +35% per CPU buddy (it isn't as sharp as a person)
    const party = 1 + this.heroes.slice(1).reduce((a, h) => a + (h.cpu ? 0.35 : 0.6), 0);
    const hp = Math.round(mobHp(kind, lv) * (elite ? ELITE.hp : 1) * pow * nm.hp * party);
    const m: Mob = {
      id: nextId++, kind, lv, x, y: y ?? this.stage.groundY, vx: 0, vy: 0, face: -1, hp, maxHp: hp, atk: Math.round(mobAtk(kind, lv) * (elite ? ELITE.atk : 1) * pow * nm.atk),
      state: 'walk', move: '', t: this.rand() * 2, ground: true, on: y === undefined ? -1 : null, home: x, deadT: 0, flash: 0,
      hurtShown: 0, stagger: 0, summoned: 0, hitDone: false, elite, homeY: y ?? this.stage.groundY, slow: 0,
      mods: [], under: MOBS[kind].brain === 'burrower', disguised: MOBS[kind].brain === 'mimic', aimX: 0, aimY: 0, enraged: false, parent: 0, dropT: 0, surfT: 0, burn: 0, burnT: 0, burnDmg: 0, frozen: 0, glued: 0, phase: this.stage.world, shellT: 0, stolen: -1, guardT: 0, arena: -1, tgt: 0, flank: 1, queue: [], patI: 0, tired: 0, armor: 1, weak: 0, bossPhase: 1,
    };
    if (y !== undefined) { m.on = this.platformAt(x, y); m.ground = m.on !== null; }
    this.mobs.push(m);
    return m;
  }

  get boss(): Mob | undefined { return this.mobs.find(m => MOBS[m.kind].brain === 'boss'); }
  get alive(): number { return this.mobs.filter(m => m.state !== 'dead').length; }

  step(inp: Input | Input[], dt = DT): SimEvent[] {
    const inputs = Array.isArray(inp) ? inp : [inp];
    this.cur = this.heroes[0];
    this.events = [];
    if (this.cleared) return this.events;
    this.time += dt;
    if (!this.failed) this.run.time += dt;
    this.comboT -= dt;
    if (this.comboT <= 0) this.combo = 0;
    // perfect dodge: monsters (and their shots) crawl for a moment
    const mdt = this.slowmo > 0 ? dt * SLOWMO_RATE : dt;
    this.slowmo = Math.max(0, this.slowmo - dt);
    this.style = Math.max(0, this.style - dt * (3 + this.style * 0.06));
    if (this.alive > 0 && !this.failed) { this.run.styleSum += this.style * dt; this.run.styleTime += dt; this.run.stylePeak = Math.max(this.run.stylePeak, this.style); }
    for (const h of this.heroes) {
      this.cur = h;
      const e0 = this.events.length;
      h.counter = Math.max(0, h.counter - dt); h.spikyT = Math.max(0, h.spikyT - dt);
      this.stepHero(inputs[h.idx] ?? NO_INPUT, dt);
      this.stepGearTimers(h, dt);
      this.stepOrbs(dt);
      if (h.d.regen > 0 && h.state !== 'down') h.hp = Math.min(h.d.maxHp, h.hp + h.d.maxHp * h.d.regen * dt);
      this.revive(h, dt);
      // whatever this hero fired this step is theirs (damage uses their stats)
      for (const q of this.shots) if (q.from === 'hero' && q.owner === undefined) q.owner = h.idx;
      for (const q of this.zones) if (q.owner === undefined) q.owner = h.idx;
      for (const q of this.mines) if (q.owner === undefined) q.owner = h.idx;
      if (h.idx > 0) for (let i = e0; i < this.events.length; i++) (this.events[i] as { hi?: number }).hi = h.idx;
    }
    this.cur = this.heroes[0];
    this.leash();
    this.checkWipe();
    for (const m of this.mobs) { this.cur = this.targetOf(m); this.stepMob(m, mdt); }
    this.cur = this.heroes[0];
    this.stepHazards(dt);
    this.stepZones(dt);
    this.stepBubbles(dt);
    this.stepWalls(dt);
    this.stepProps(dt);
    for (const h of this.heroes) h.landed = false;
    this.cur = this.heroes[0];
    this.stepShots(dt, mdt);
    this.cur = this.heroes[0];
    // Spicy 'clock': beat the par time or the stage is lost
    if (this.spicy.includes('clock') && !this.failed && !this.portal && this.run.time > this.stage.par && this.heroes.some(h => h.state !== 'down')) {
      for (const h of this.heroes) { h.hp = 0; this.enter(h, 'down'); }
      this.events.push({ t: 'hit', x: this.heroes[0].x, y: this.heroes[0].y - 60, dmg: 0, crit: false, target: 'hero' });
    }
    this.stepMines(dt);
    this.stepBoxes(dt);
    this.mobs = this.mobs.filter(m => !(m.state === 'dead' && m.deadT > 0.7));
    this.stepObjective(dt);
    this.stepSetPieces(dt);
    this.cur = this.heroes[0];
    const holding = this.holdout > 0 || (this.scroll !== null && !this.scroll.got) || this.arenas.some(a => !a.done);
    if (!this.portal && this.alive === 0 && !holding) { this.portal = true; this.events.push({ t: 'portal' }); }
    const h = this.hero;
    const npcHome = !this.npc || Math.abs(this.npc.x - this.exitX) < 140;
    if (this.portal && npcHome && h.state !== 'down' && Math.abs(h.x - this.exitX) < 40 && Math.abs(h.y - this.stage.groundY) < 4) {
      if (this.stage.objective && !this.objDone) { this.objDone = true; this.loot.push({ tier: 3, ilvl: this.stage.lv[1] }); this.events.push({ t: 'objective', text: 'Objective complete! Bonus Bento box', done: true }); }
      // boxes still lying around are swept up for you
      for (const b of this.boxes) { this.lootOf[b.owner ?? 0].push({ tier: b.tier, ilvl: b.ilvl }); this.events.push({ t: 'pickup', id: b.id, tier: b.tier }); }
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
    for (let i = 0; i < 4; i++) h.cds[i] = Math.max(0, (h.cds[i] ?? 0) - dt * cdRate);
    for (const k of Object.keys(h.boosts) as BoostKind[]) { const b = h.boosts[k]!; if ((b[1] -= dt) <= 0) delete h.boosts[k]; }
    h.quickCd = Math.max(0, h.quickCd - dt);
    h.dodgeCd = Math.max(0, h.dodgeCd - dt);
    const items = ['item1', 'item2', 'item3', 'item4'] as const;
    for (let i = 0; i < 4; i++) if (pressed(items[i])) this.useItem(i);
    h.dropT = Math.max(0, h.dropT - dt);
    if (h.buff && (h.buff.t -= dt) <= 0) h.buff = null;
    h.t += dt;
    const dir = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
    const under = h.ground ? this.puddles.filter(p => Math.abs(p.x - h.x) < (p.w ?? 84) / 2 && Math.abs(p.y - h.y) < 4) : [];
    const inMould = under.some(p => !p.kind || p.kind === 'slow');
    if ((this.puddleTick -= dt) <= 0 && h.state !== 'down') {
      const hot = under.find(p => p.kind === 'burn' || p.kind === 'poison');
      if (hot) { this.puddleTick = 0.6; this.hurtHero(h.d.maxHp * 0.04, 0, undefined, true); }
    }
    const trap = under.find(p => p.kind === 'trap');
    if (trap && h.state !== 'down' && h.state !== 'dodge') { trap.t = 0; this.hurtHero(trap.dmg ?? 10, 0); }
    const speed = c.speed * h.d.speed * (1 + (h.buff?.speed ?? 0) + (h.boosts.speed?.[0] ?? 0)) * (inMould ? 0.55 : 1);
    // ice: you keep sliding (low grip)
    const grip = (h.ground && h.on === -1 && this.hazards.some(z => z.kind === 'ice' && z.state === 'on' && Math.abs(h.x - z.x) < z.w / 2)) || under.some(p => p.kind === 'slick') ? 0.18 : 1;
    // dodge roll: tap the same direction twice quickly
    const tapDir = pressed('left') ? -1 : pressed('right') ? 1 : 0;
    if (tapDir) {
      // dodge-cancel: out of an attack once it has started hitting, or out of the back half of a skill (not an ultimate)
      const canDodge = h.dodgeCd <= 0 && (h.state === 'move' || h.state === 'air' || (h.state === 'attack' && h.t > this.atkDef(h).hit[0])
        || (h.state === 'skill' && !!h.skill && !h.skill.id.startsWith('ult') && h.t > h.skill.dur * 0.5));
      if (canDodge && h.lastTap.dir === tapDir && this.time - h.lastTap.t < DOUBLE_TAP) {
        h.face = tapDir as 1 | -1;
        this.enter(h, 'dodge'); h.perfectDone = false;
        if (h.d.procs.includes('syrup')) for (const o of this.targetsNear(h.x + h.face * 60, h.y, 130, 80)) o.slow = Math.max(o.slow, 3);
        h.inv = Math.max(h.inv, DODGE_INV); h.dodgeCd = DODGE_CD * (1 - h.d.dodge); h.lastTap = { dir: 0, t: -9 };
        this.events.push({ t: 'dodge' });
      } else h.lastTap = { dir: tapDir, t: this.time };
    }

    // skills (ground or air; can cancel the end of an attack)
    const free = h.state === 'move' || h.state === 'air' || (h.state === 'attack' && h.t > this.atkDef(h).hit[1]);
    const slots = ['skill1', 'skill2', 'skill3'] as const;
    for (let i = 0; i < 3 && free; i++) {
      if (!pressed(slots[i])) continue;
      const base = h.d.actives[i];
      const lv = h.d.skillLv[base.id] ?? 0;
      const sk = applyMod(applyBranch(base, h.d.branch[base.id]), h.d.mods[base.id]);
      if (!lv || h.cds[i] > 0) continue;
      if (dir) h.face = dir > 0 ? 1 : -1;
      const sc = skillScale(lv);
      h.cds[i] = sk.cd * sc.cd * (1 - (sk.kind === 'heal' ? Math.min(0.25, h.d.cdr) : h.d.cdr)); // heals: at most 25% faster
      h.skill = sk; h.skillMul = sc.dmg * h.d.skillDmg; h.ticks = 0;
      this.enter(h, 'skill');
      h.hitIds = new Set();
      this.events.push({ t: 'skill', slot: i, kind: sk.kind, id: sk.id });
      this.startSkill(h, sk);
      if (sk.echo) h.echo = { sk, t: 0.4 };
      break;
    }
    // gear skill: whatever weapon you hold (doesn't stop you moving)
    const gear = h.d.gear;
    if (gear && pressed('gear') && h.cds[3] <= 0 && free) {
      if (dir) h.face = dir > 0 ? 1 : -1;
      h.cds[3] = gear.cd * (1 - h.d.cdr);
      this.castGear(h);
    }
    // ultimate: full gauge, Lv 15+
    const ultDef = ULTS[c.species];
    if (free && pressed('ult') && ultDef && h.d.level >= ULT_LV && h.ult >= 100) {
      if (dir) h.face = dir > 0 ? 1 : -1;
      h.ult = 0;
      h.skill = ultDef; h.skillMul = h.d.skillDmg * (1 + 0.04 * (h.d.level - ULT_LV)) * h.d.ultDmg; h.ticks = 0;
      this.enter(h, 'skill');
      h.hitIds = new Set();
      h.inv = Math.max(h.inv, ultDef.dur + 0.4);
      this.events.push({ t: 'ult', name: ultDef.name });
      if (h.d.procs.includes('scoop')) h.ult = 30;
      this.events.push({ t: 'skill', slot: 3, kind: ultDef.kind, id: ultDef.id });
      this.startSkill(h, ultDef);
    }

    switch (h.state) {
      case 'move':
      case 'air': {
        const lad = this.ladderAt(h.x, h.y);
        if (lad && ((inp.up && !(h.ground && h.y <= lad.top + 2)) || (inp.down && h.ground && h.y <= lad.top + 2 && h.on !== -1))) {
          this.enter(h, 'climb');
          h.x = lad.x; h.vx = 0; h.vy = 0; h.ground = false; h.on = null;
          if (inp.down) h.y += 6;
          h.prev = { ...inp };
          return; // no physics this step (it would drop us straight back onto the floor and leave 'ground' set)
        }
        h.vx = approach(h.vx, dir * speed, (h.ground ? 2400 * grip : 1500) * dt);
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
        if (h.ground) h.bounced = false;
        if (!inp.jump && h.vy < -250 && !h.bounced) h.vy = -250; // short hop when jump is let go (not on a sponge bounce)
        h.gliding = !!c.glide && !h.ground && inp.jump && h.vy > 0;
        if (h.atkBuf > 0) {
          h.atkBuf = 0;
          // ground: UP+attack = launcher, DOWN+attack = guard break; air: air attack
          h.step = !h.ground ? -1 : inp.up ? -3 : inp.down ? -2 : 0;
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
        h.vx = h.ground ? (lunging ? h.face * atk.lunge : approach(h.vx, 0, 2400 * grip * dt)) : approach(h.vx, dir * speed, 1200 * dt);
        if (h.atkBuf > 0 && h.step >= 0 && h.step < c.combo.length - 1 && h.t > atk.hit[0]) { h.queued = true; h.atkBuf = 0; }
        if (h.t >= atk.hit[0] && h.t <= atk.hit[1]) this.hitBox(h.x + h.face * atk.reach / 2, h.y, atk.reach, atk.h, atk.dmg, h.step === -2, atk, h.hitIds);
        if (h.t >= atk.dur || (h.step < 0 && h.ground && h.t > atk.hit[1])) {
          if (h.queued) {
            h.queued = false; h.step++;
            if (dir) h.face = dir > 0 ? 1 : -1;
            h.t = 0; h.hitIds = new Set();
            this.events.push({ t: 'swing', step: h.step });
            if (h.step === 2 && h.d.uniques.includes('momspoon')) h.hp = Math.min(h.d.maxHp, h.hp + h.d.maxHp * 0.04);
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
        h.ground = false; h.on = null; // on a ladder you stand on nothing (else jumping off it left you walking on air)
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
        h.vx = approach(h.vx, 0, (h.ground ? 1600 * grip : 300) * dt);
        if (h.t > 0.35 && h.ground) this.enter(h, 'move');
        break;
      case 'down':
        h.vx = 0;
        // (checkWipe ends the stage once every hero is down)
        break;
    }

    this.physics(h, dt, h.gliding ? 120 : MAX_FALL, h.dropT > 0);
    h.prev = { ...inp };
  }

  private startSkill(h: Hero, sk: SkillDef): void {
    const s0 = this.shots.length;
    this.startSkillInner(h, sk);
    // Pepper Breath: every 5th skill also breathes fire ahead
    if (h.d.procs.includes('pepper') && ++h.skillN >= 5) {
      h.skillN = 0; this.events.push({ t: 'proc', name: 'Pepper Breath!', x: h.x, y: h.y - 90 }); this.events.push({ t: 'shock', x: h.x + h.face * 90, y: h.y - 20, r: 90 });
      for (const o of this.targetsNear(h.x + h.face * 90, h.y, 110, 80)) { this.damageMob(o, h.d.atk * 1.4, h.face, { kx: 140, ky: -200, stun: 0.3 }, true); this.applyFx(o, ['burn'], h); }
    }
    const fx = [sk.burn ? 'burn' : '', sk.freeze ? 'freeze' : '', sk.glue ? 'glue' : '', sk.slow ? 'slow' : ''].filter(Boolean);
    if (fx.length) for (let i = s0; i < this.shots.length; i++) this.shots[i].fx = fx;
  }

  /** Gear skill: the hero flings / lobs / rolls / slams / rains its own weapon. */
  private castGear(h: Hero): void {
    const g = h.d.gear!;
    const atk = h.d.atk * g.power * g.dmg * (0.6 + 0.4 * h.d.skillDmg);
    const fx = g.fx ? [g.fx] : [];
    const ky = g.fx === 'launch' ? -620 : -160;
    const base = { hit: new Set<number>(), from: 'hero' as const, t: 0, dmg: atk, fx, icon: g.icon, kx: 180, ky, owner: h.idx };
    switch (g.style) {
      case 'throw': this.shots.push({ ...base, id: nextId++, x: h.x + h.face * 30, y: h.y - 44, vx: h.face * 720, vy: 0, pierce: true, kind: 'gear', r: 22 }); break;
      case 'lob': { // lands on the nearest monster in front (or 220px ahead); flight time is ~0.74s
        const tgt = this.mobs.filter(m => m.state !== 'dead' && !m.under && Math.sign(m.x - h.x) === h.face && Math.abs(m.x - h.x) < 460 && Math.abs(m.y - h.y) < 120).sort((p, q) => Math.abs(p.x - h.x) - Math.abs(q.x - h.x))[0];
        const dx = tgt ? Math.abs(tgt.x - h.x) - 24 : 220;
        this.shots.push({ fromY: h.y, ...base, id: nextId++, x: h.x + h.face * 24, y: h.y - 56, vx: h.face * clamp(dx / 0.74, 100, 600), vy: -440, g: 1300, pierce: false, kind: 'gearlob', r: 18, tx: h.x + h.face * (dx + 24), ty: h.y });
        break;
      }
      case 'roll': this.shots.push({ ...base, id: nextId++, x: h.x + h.face * 30, y: h.y - 20, vx: h.face * 430, vy: 0, pierce: true, kind: 'gearroll', r: 22 }); break;
      case 'slam':
        this.events.push({ t: 'shock', x: h.x + h.face * 30, y: h.y, r: 80 });
        for (const d of [-1, 1]) this.shots.push({ ...base, hit: new Set(), id: nextId++, x: h.x + d * 20, y: h.y - 16, vx: d * 560, vy: 0, pierce: true, kind: 'gearwave', r: 26 });
        break;
      case 'rain':
        for (let i = 0; i < 5; i++) this.shots.push({ ...base, hit: new Set(), id: nextId++, x: h.x + h.face * (70 + i * 55), y: h.y - 330, vx: 0, vy: 120, t: -0.09 * i, g: 1500, pierce: false, kind: 'gearrain', r: 20 });
        break;
      case 'boomerang': // out and back, hitting both ways
        this.shots.push({ ...base, id: nextId++, x: h.x + h.face * 30, y: h.y - 44, vx: h.face * 680, vy: 0, pierce: true, kind: 'gearboom', r: 24 });
        break;
      case 'burst': // eight copies in a star
        for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; this.shots.push({ ...base, hit: new Set(), id: nextId++, x: h.x, y: h.y - 44, vx: Math.cos(a) * 520, vy: Math.sin(a) * 520, pierce: true, kind: 'gearburst', r: 20 }); }
        break;
      case 'trap': { // planted on the floor ahead: snaps the first monster to step on it
        const fl = this.floorBelow(h.x + h.face * 50, h.y - 2, h.y + 400, false);
        this.mines.push({ id: nextId++, x: h.x + h.face * 50, y: fl ? fl.y : h.y, t: 0, dmg: atk, kx: 160, ky: g.fx === 'launch' ? -620 : -300, owner: h.idx, icon: g.icon, fx });
        break;
      }
    }
    this.events.push({ t: 'gear', name: g.name, style: g.style, x: h.x, y: h.y });
  }

  /** On-hit extras: burn, freeze, glue, slow, pull, heal. */
  private applyFx(m: Mob, fx: string[], h: Hero): void {
    if (m.state === 'dead') return;
    const boss = MOBS[m.kind].brain === 'boss';
    for (const e of fx) {
      if (e === 'burn') { m.burn = Math.max(m.burn, 3); m.burnDmg = Math.max(m.burnDmg, h.d.atk * 0.3); }
      else if (e === 'freeze') { if (boss) m.slow = Math.max(m.slow, 2); else { m.frozen = Math.max(m.frozen, 1.4); m.vx = 0; } }
      else if (e === 'glue') { if (!boss) this.glue(m); }
      else if (e === 'slow') m.slow = Math.max(m.slow, 3);
      else if (e === 'pull') { if (!boss) m.x += clamp(h.x + h.face * 50 - m.x, -90, 90); }
      else if (e === 'heal') h.hp = Math.min(h.d.maxHp, h.hp + h.d.maxHp * 0.015);
    }
  }

  /** Echo casts, shield bubble timers, Belly Flop landings. */
  private stepGearTimers(h: Hero, dt: number): void {
    if (h.echo) {
      h.echo.t -= dt;
      if (h.echo.t <= 0 && h.state !== 'down') { const mul = h.skillMul; h.skillMul *= 0.6; this.startSkill(h, { ...h.echo.sk, echo: false }); h.skillMul = mul; h.echo = null; }
    }
    h.bubbleCd = Math.max(0, h.bubbleCd - dt); h.spikeCd = Math.max(0, h.spikeCd - dt); h.guardCd = Math.max(0, h.guardCd - dt); h.popCd = Math.max(0, h.popCd - dt);
    if (h.shieldT > 0) { h.shieldT -= dt; if (h.shieldT <= 0) h.shield = 0; }
    if (!h.ground) h.peakY = Math.min(h.peakY, h.y);
    else {
      if (h.landed) h.lastFall = h.y - h.peakY;
      if (h.landed && h.y - h.peakY > 180 && h.d.procs.includes('quake')) {
        this.events.push({ t: 'shock', x: h.x, y: h.y, r: 120 });
        for (const m of this.targetsNear(h.x, h.y, 130, 70)) this.damageMob(m, h.d.atk * 1.5, Math.sign(m.x - h.x) || 1, { kx: 160, ky: -380, stun: 0.7 }, true);
      }
      h.peakY = h.y;
    }
  }

  private startSkillInner(h: Hero, sk: SkillDef): void {
    const atk = h.d.atk * h.skillMul;
    if (sk.heal) { const lv = h.d.skillLv[sk.id] ?? 1; h.hp = Math.min(h.d.maxHp, h.hp + h.d.maxHp * sk.heal * (1 + 0.2 * (lv - 1))); }
    switch (sk.kind) {
      case 'bolt':
        for (let b = 1; b < (sk.n ?? 1); b++) this.shots.push({ id: nextId++, x: h.x + h.face * 30, y: h.y - 40 - b * 22, vx: h.face * 600, vy: 0, t: -0.06 * b, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: true });
        this.shots.push({ id: nextId++, x: h.x + h.face * 40, y: h.y - 40, vx: h.face * 620, vy: 0, t: 0, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: true });
        break;
      case 'fan':
        for (let i = 0; i < (sk.n ?? 5); i++) {
          const a = (i / ((sk.n ?? 5) - 1) - 0.5) * 0.7;
          this.shots.push({ id: nextId++, x: h.x + h.face * 30, y: h.y - 44, vx: h.face * 560 * Math.cos(a), vy: 560 * Math.sin(a), t: 0, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: false });
        }
        break;
      case 'mines':
        if (sk.toss) { // a spread of berries lobbed near, middle and far
          const n = sk.n ?? 3;
          for (let i = 0; i < n; i++) this.shots.push({ fromY: h.y, id: nextId++, x: h.x + h.face * 24, y: h.y - 56, vx: h.face * (190 + i * (300 / Math.max(1, n - 1))), vy: -430, t: 0, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: false, g: 1500, kind: 'berry' });
          break;
        }
        for (let i = 0; i < (sk.n ?? 3); i++) this.mines.push({ id: nextId++, x: h.x + h.face * (40 + i * 45), y: this.stage.groundY, t: 0, dmg: atk * sk.dmg, kx: sk.kx, ky: sk.ky });
        // mines land on the floor below each spot
        for (const m of this.mines.slice(-(sk.n ?? 3))) { const f = this.floorBelow(m.x, h.y - 2, h.y + 2000, false); if (f) m.y = f.y; }
        break;
      case 'buff':
        h.buff = { atk: sk.buff?.atk ?? 0, def: sk.buff?.def ?? 0, speed: sk.buff?.speed ?? 0, armor: !!sk.buff?.armor, t: sk.buff?.t ?? 5, reflect: sk.buff?.reflect, leech: sk.buff?.leech };
        break;
      case 'uppercut':
        if (h.ground) { h.vy = -760; h.ground = false; h.on = null; }
        break;
      case 'heal': break;
      case 'boomerang':
        for (let i = 0; i < (sk.n ?? 1); i++) this.shots.push({ id: nextId++, x: h.x + h.face * 30, y: h.y - 44 - i * 26, vx: h.face * 640, vy: 0, t: -0.1 * i, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: true, kind: 'boomerang', r: 22 });
        break;
      case 'pull': // yank everything in reach to you, stunned
        for (const m of this.targetsNear(h.x, h.y, sk.reach, sk.h)) {
          const d = MOBS[m.kind];
          if (d.brain !== 'boss') { m.x = clamp(h.x + Math.sign(m.x - h.x || h.face) * (d.w / 2 + 26), 20, this.stage.width - 20); m.vx = 0; }
          this.damageMob(m, atk * sk.dmg, Math.sign(m.x - h.x) || h.face, { kx: 0, ky: sk.ky, stun: 1.0 }, true);
        }
        this.events.push({ t: 'shock', x: h.x, y: h.y, r: sk.reach });
        break;
      case 'geyser': // eruptions under the nearest monsters
        for (const m of this.targetsNear(h.x, h.y, sk.reach, 400).slice(0, sk.n ?? 4)) {
          this.events.push({ t: 'shock', x: m.x, y: m.y, r: 60 });
          this.damageMob(m, atk * sk.dmg, Math.sign(m.x - h.x) || h.face, { kx: sk.kx, ky: sk.ky, stun: 0.9 }, true);
        }
        break;
      case 'blink': { // reappear behind the nearest monster: guaranteed crit
        const m = this.targetsNear(h.x, h.y, sk.reach, 160)[0];
        if (m) {
          const d = MOBS[m.kind];
          h.x = clamp(m.x - m.face * (d.w / 2 + 22), 20, this.stage.width - 20); h.y = Math.min(h.y, m.y); h.face = m.x > h.x ? 1 : -1;
          h.counter = Math.max(h.counter, 0.05);
          this.damageMob(m, atk * sk.dmg, h.face, { kx: sk.kx, ky: sk.ky, stun: 0.8 }, true);
        } else h.x = clamp(h.x + h.face * 120, 20, this.stage.width - 20);
        // reappearing somewhere else (beside a flyer up in the air, or past a ledge's edge) means you aren't standing on
        // whatever you stood on before: let physics find the floor (it lands you straight away if there is one)
        h.ground = false; h.on = null;
        break;
      }
      case 'rain': case 'meteor': { // drops from the sky over the area ahead
        const n = sk.n ?? 8, big = sk.kind === 'meteor';
        for (let i = 0; i < n; i++) {
          const x = clamp(h.x + h.face * (60 + (i + 0.5) * sk.reach / n) + (this.rand() - 0.5) * 30, 20, this.stage.width - 20);
          this.shots.push({ fromY: h.y, id: nextId++, x, y: h.y - 320 - this.rand() * 80, vx: 0, vy: 150, t: -i * (big ? 0.09 : 0.05), dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: big, g: 1400, kind: big ? 'meteor' : 'toast', r: big ? 30 : 16 });
        }
        break;
      }
      case 'zone':
        this.zones.push({ id: nextId++, x: h.x + h.face * sk.reach / 2, y: h.y, w: sk.reach, t: 3, tick: 0.4, next: 0, dmg: atk * sk.dmg, kind: 'steam' });
        break;
      case 'orbit':
        h.orbs = { t: 6, n: sk.n ?? 3, dmg: atk * sk.dmg, cd: new Map() };
        break;
      case 'twister':
        this.shots.push({ id: nextId++, x: h.x + h.face * 40, y: h.y - 30, vx: h.face * 150, vy: 0, t: 0, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: true, kind: 'twister', r: sk.reach * 0.7 });
        break;
      case 'throw': { // grab the monster in front and slam it behind you
        const m = this.targetsNear(h.x + h.face * sk.reach / 2, h.y, sk.reach, 70)[0];
        if (m) {
          const d = MOBS[m.kind];
          if (d.brain !== 'boss') { m.x = clamp(h.x - h.face * (d.w / 2 + 34), 20, this.stage.width - 20); m.vy = -120; }
          this.damageMob(m, atk * sk.dmg, -h.face, { kx: sk.kx, ky: sk.ky, stun: 1.1 }, true);
          this.events.push({ t: 'shock', x: m.x, y: h.y, r: 80 });
          for (const o of this.targetsNear(m.x, h.y, 80, 70)) if (o !== m) this.damageMob(o, atk * sk.dmg * 0.5, Math.sign(o.x - m.x) || 1, { kx: 220, ky: -240, stun: 0.6 }, true);
        }
        break;
      }
      case 'goo':
        for (let i = 0; i < (sk.n ?? 3); i++) this.shots.push({ fromY: h.y, id: nextId++, x: h.x + h.face * 24, y: h.y - 50, vx: h.face * (70 + i * 100), vy: -380, t: 0, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: 0, ky: 0, pierce: false, g: 1500, kind: 'goo' });
        break;
      case 'radial':
        for (let i = 0; i < (sk.n ?? 10); i++) { const a = (i / (sk.n ?? 10)) * Math.PI * 2; this.shots.push({ id: nextId++, x: h.x, y: h.y - 40, vx: Math.cos(a) * 520, vy: Math.sin(a) * 520, t: 0, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: false, kind: 'quill' }); }
        break;
      case 'slide': // the icy trail it leaves behind
        this.zones.push({ id: nextId++, x: h.x + h.face * 140, y: h.y, w: 300, t: 4, tick: 0.3, next: 0, dmg: 0, kind: 'ice' });
        break;
      case 'snowball':
        this.shots.push({ id: nextId++, x: h.x + h.face * 40, y: h.y - 18, vx: h.face * 380, vy: 0, t: 0, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: true, kind: 'snowball', r: sk.reach * 0.4 });
        break;
      case 'homing':
        for (let i = 0; i < (sk.n ?? 10); i++) { const a = -Math.PI / 2 + (i / ((sk.n ?? 10) - 1) - 0.5) * 2.2; this.shots.push({ id: nextId++, x: h.x, y: h.y - 50, vx: Math.cos(a) * 380 + h.face * 80, vy: Math.sin(a) * 380, t: -i * 0.04, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: false, kind: 'homing' }); }
        break;
      case 'wave':
        this.shots.push({ id: nextId++, x: h.x + h.face * 50, y: h.y - 16, vx: h.face * 540, vy: 0, t: 0, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: true, kind: 'wave', r: 60 });
        break;
      case 'firefloor':
        for (const m of this.targetsNear(h.x, h.y, sk.reach, 300)) this.zones.push({ id: nextId++, x: m.x, y: m.y, w: 120, t: 3, tick: 0.4, next: 0, dmg: atk * sk.dmg, kind: 'fire' });
        break;
      case 'clones':
        for (let i = 0; i < (sk.n ?? 2); i++) this.shots.push({ id: nextId++, x: h.x + h.face * 30, y: h.y - 30, vx: h.face * (300 + i * 80), vy: -300, t: -0.12 * i, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: true, g: 1400, kind: 'minijelly', r: 18, bounces: 0, tx: 6 });
        break;
      case 'wobble':
        h.buff = { atk: 0, def: 0.4, speed: 0, armor: false, t: 4, reflect: true };
        this.events.push({ t: 'shock', x: h.x, y: h.y - 30, r: sk.reach });
        for (const m of this.targetsNear(h.x, h.y, sk.reach, sk.h)) this.damageMob(m, atk * sk.dmg, Math.sign(m.x - h.x) || 1, { kx: sk.kx, ky: sk.ky, stun: 0.5 }, true);
        break;
      case 'jellyquake':
        this.events.push({ t: 'shock', x: h.x, y: h.y, r: 320 });
        for (const m of this.targetsNear(h.x, h.y, sk.reach, sk.h)) { this.damageMob(m, atk * sk.dmg, Math.sign(m.x - h.x) || 1, { kx: sk.kx, ky: sk.ky, stun: 0.8 }, true); if (MOBS[m.kind].brain !== 'boss') this.glue(m); }
        break;
      case 'tide':
        this.shots.push({ id: nextId++, x: h.x + h.face * 50, y: h.y - 24, vx: h.face * 420, vy: 0, t: 0, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: true, kind: 'tide', r: 50 });
        break;
      case 'salmon':
        for (let i = 0; i < (sk.n ?? 4); i++) this.shots.push({ id: nextId++, x: h.x + h.face * 30, y: h.y - 50, vx: h.face * 520, vy: 0, t: -0.08 * i, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: true, kind: 'salmon', r: 16, tx: h.y - 50 });
        break;
      case 'salmonrun':
        for (let i = 0; i < (sk.n ?? 16); i++) { const x0 = h.x - h.face * 340 + (this.rand() - 0.5) * 120; this.shots.push({ id: nextId++, x: x0, y: h.y + 10, vx: h.face * (520 + this.rand() * 160), vy: -620 - this.rand() * 200, t: -i * 0.06, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: true, g: 1300, kind: 'salmon', r: 18 }); }
        break;
      case 'slowtime':
        this.events.push({ t: 'shock', x: h.x, y: h.y - 30, r: sk.reach });
        for (const m of this.targetsNear(h.x, h.y, sk.reach, sk.h)) { m.slow = Math.max(m.slow, 4); this.damageMob(m, atk * sk.dmg, Math.sign(m.x - h.x) || 1, { kx: sk.kx, ky: sk.ky, stun: 0.2 }, true); }
        if (!h.buff) h.buff = { atk: 0, def: 0, speed: 0.3, armor: false, t: 4 };
        break;
      case 'snooze':
        this.events.push({ t: 'shock', x: h.x, y: h.y - 30, r: 300 });
        for (const m of this.targetsNear(h.x, h.y, sk.reach, sk.h)) { this.damageMob(m, atk * sk.dmg, Math.sign(m.x - h.x) || 1, { kx: sk.kx, ky: sk.ky, stun: 3 }, true); if (MOBS[m.kind].brain === 'boss') m.slow = Math.max(m.slow, 3); }
        break;
      case 'wall': {
        const wx = clamp(h.x + h.face * sk.reach, 30, this.stage.width - 30), fl = this.floorBelow(wx, h.y - 2, h.y + 600, false);
        this.walls.push({ x: wx, y: fl ? fl.y : h.y, t: 4, freeze: !!sk.freeze });
        for (const m of this.targetsNear(wx, h.y, 60, 120)) this.damageMob(m, atk * sk.dmg, h.face, { kx: sk.kx, ky: sk.ky, stun: 0.5 }, true);
        break;
      }
      case 'scoop': {
        const tgt = this.mobs.filter(m => m.state !== 'dead' && !m.under && Math.sign(m.x - h.x) === h.face && Math.abs(m.x - h.x) < 460 && Math.abs(m.y - h.y) < 120).sort((p, q) => Math.abs(p.x - h.x) - Math.abs(q.x - h.x))[0];
        const base = clamp(tgt ? Math.abs(tgt.x - h.x) - 24 : 220, 40, 440);
        for (let i = 0; i < (sk.n ?? 1); i++) { const dx = h.face * (base + (i - ((sk.n ?? 1) - 1) / 2) * 70); this.shots.push({ id: nextId++, x: h.x + h.face * 24, y: h.y - 56, vx: dx / 0.74, vy: -440, t: -0.06 * i, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: false, g: 1300, kind: 'scoop', r: 16, fx: ['freeze'] }); }
        break;
      }
      case 'chipstorm':
        for (let i = 0; i < (sk.n ?? 10); i++) { const x = clamp(h.x + (this.rand() * 2 - 1) * sk.reach, 20, this.stage.width - 20); this.shots.push({ id: nextId++, x, y: h.y - 320 - this.rand() * 80, vx: 0, vy: 150, t: -i * 0.05, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: false, g: 1400, kind: 'chocchip', r: 14 }); }
        break;
      case 'sundae':
        this.shots.push({ id: nextId++, x: clamp(h.x + h.face * 180, 40, this.stage.width - 40), y: h.y - 420, vx: 0, vy: 300, t: 0.05, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: true, g: 1600, kind: 'sundae', r: 50 });
        break;
      case 'bubbletrap':
        for (const m of this.targetsNear(h.x + h.face * 60, h.y, sk.reach, sk.h).slice(0, sk.n ?? 2)) { this.damageMob(m, atk * sk.dmg * 0.2, h.face, { kx: 0, ky: 0, stun: 0.2 }, true); this.bubble(m, 2.5, atk * sk.dmg, h, sk.kx, sk.ky); }
        break;
      case 'megabubble':
        this.events.push({ t: 'shock', x: h.x, y: h.y - 30, r: 300 });
        for (const m of this.targetsNear(h.x, h.y, sk.reach, sk.h)) this.bubble(m, 3, atk * sk.dmg, h, sk.kx, sk.ky);
        break;
      case 'gumball':
        for (let i = 0; i < (sk.n ?? 3); i++) this.shots.push({ id: nextId++, x: h.x + h.face * 30, y: h.y - 34 - i * 14, vx: h.face * (520 - i * 40), vy: -60 + i * 40, t: -0.08 * i, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: false, kind: 'gumball', r: 16, bounces: 0 });
        break;
      case 'trumpet':
        this.events.push({ t: 'shock', x: h.x + h.face * 30, y: h.y - 40, r: 90 });
        for (const d of [-1, 1]) this.shots.push({ id: nextId++, x: h.x + d * 30, y: h.y - 16, vx: d * 520, vy: 0, t: 0, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: true, kind: 'trumpet', r: 34 });
        break;
      case 'cakebomb': {
        const tgt = this.mobs.filter(m => m.state !== 'dead' && !m.under && Math.sign(m.x - h.x) === h.face && Math.abs(m.x - h.x) < 460 && Math.abs(m.y - h.y) < 120).sort((p, q) => Math.abs(p.x - h.x) - Math.abs(q.x - h.x))[0];
        const dx = h.face * clamp(tgt ? Math.abs(tgt.x - h.x) - 24 : 240, 40, 440);
        this.shots.push({ id: nextId++, x: h.x + h.face * 24, y: h.y - 56, vx: dx / 0.74, vy: -440, t: 0, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: false, g: 1300, kind: 'cupcake', r: 16 });
        break;
      }
      case 'tko': {
        const tgt = this.targetsNear(h.x, h.y, sk.reach, sk.h).sort((a, b) => b.maxHp - a.maxHp)[0];
        if (tgt) {
          h.x = clamp(tgt.x - h.face * (MOBS[tgt.kind].w / 2 + 30), 20, this.stage.width - 20); h.y = tgt.y; h.face = tgt.x > h.x ? 1 : -1;
          h.ground = false; h.on = null; // landed beside the target, maybe up in the air: let physics find the floor
          this.events.push({ t: 'shock', x: tgt.x, y: tgt.y - 40, r: 120 });
          this.damageMob(tgt, atk * sk.dmg, h.face, { kx: sk.kx, ky: sk.ky, stun: 1.5 }, true);
        }
        break;
      }
      case 'pitbounce':
        this.shots.push({ id: nextId++, x: h.x + h.face * 30, y: h.y - 50, vx: h.face * 430, vy: -360, t: 0, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: true, g: 1400, kind: 'pit', r: 18, bounces: 0, tx: sk.n ?? 3 });
        break;
      case 'guac': {
        const gx = clamp(h.x + h.face * 100, 40, this.stage.width - 40), fl = this.floorBelow(gx, h.y - 2, h.y + 600, false);
        this.zones.push({ id: nextId++, x: gx, y: fl ? fl.y : h.y, w: sk.reach, t: 5, tick: 0.5, next: 0, dmg: atk * sk.dmg, kind: 'guac' });
        break;
      }
      case 'guacflood':
        this.shots.push({ id: nextId++, x: h.x + h.face * 50, y: h.y - 20, vx: h.face * 480, vy: 0, t: 0, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: true, kind: 'guacwave', r: 70 });
        for (const d of [160, 340, 520]) { const gx = clamp(h.x + h.face * d, 40, this.stage.width - 40), fl = this.floorBelow(gx, h.y - 2, h.y + 600, false); this.zones.push({ id: nextId++, x: gx, y: fl ? fl.y : h.y, w: 150, t: 6, tick: 0.5, next: 0.6, dmg: atk * 0.3, kind: 'guac' }); }
        break;
      case 'drop':
        for (let i = 0; i < (sk.n ?? 3); i++) this.shots.push({ id: nextId++, x: h.x + h.face * (20 + i * 60), y: h.y - 30, vx: h.face * 70, vy: 60, t: -0.1 * i, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: false, g: 1500, kind: 'salsa', r: 16 });
        break;
      case 'volley':
        for (let i = 0; i < (sk.n ?? 7); i++) { const a = (-0.15 + 0.85 * i / Math.max(1, (sk.n ?? 7) - 1)); this.shots.push({ id: nextId++, x: h.x + h.face * 20, y: h.y - 70, vx: h.face * Math.cos(a) * 600, vy: Math.sin(a) * 600, t: -0.03 * i, dmg: atk * sk.dmg, hit: new Set(), from: 'hero', kx: sk.kx, ky: sk.ky, pierce: false, kind: 'chip' }); }
        break;
      case 'fiesta':
        this.events.push({ t: 'shock', x: h.x, y: h.y - 30, r: 300 });
        for (const m of this.targetsNear(h.x, h.y, sk.reach, sk.h)) this.damageMob(m, atk * sk.dmg, Math.sign(m.x - h.x) || 1, { kx: sk.kx, ky: sk.ky, stun: 1.3 }, true);
        for (let i = 0; i < (sk.n ?? 14); i++) { const x = clamp(h.x + (this.rand() - 0.5) * sk.reach * 1.6, 20, this.stage.width - 20); this.shots.push({ id: nextId++, x, y: h.y - 360 - this.rand() * 80, vx: 0, vy: 150, t: -i * 0.05, dmg: atk * 0.8, hit: new Set(), from: 'hero', kx: 60, ky: -120, pierce: false, g: 1400, kind: 'candy', r: 14 }); }
        break;
      case 'blizzard':
        this.zones.push({ id: nextId++, x: h.x, y: h.y, w: sk.reach * 2, t: 3, tick: 0.5, next: 0, dmg: atk * sk.dmg, kind: 'snow' });
        break;
      case 'slashall':
        h.targets = this.targetsNear(h.x, h.y, sk.reach, 400).slice(0, sk.n ?? 8).map(m => m.id);
        break;
    }
    h.skillFace = h.face;
  }

  /** Living, hittable monsters within dx/dy of a point, nearest first. */
  private targetsNear(x: number, y: number, dx: number, dy: number): Mob[] {
    return this.mobs.filter(m => m.state !== 'dead' && !m.under && Math.abs(m.x - x) < dx && Math.abs(m.y - y) < dy)
      .sort((a, b) => Math.abs(a.x - x) - Math.abs(b.x - x));
  }

  /** Mustard Glue: stuck for 2.5 s (bosses are only slowed). */
  private glue(m: Mob): void {
    if (m.state === 'dead') return;
    if (MOBS[m.kind].brain === 'boss') { m.slow = Math.max(m.slow, 2.5); return; }
    if (m.glued <= 0) this.events.push({ t: 'block', x: m.x, y: m.y - MOBS[m.kind].h - 6 });
    m.glued = 2.5; m.vx = 0; if (m.state === 'windup' || m.state === 'attack') { m.state = 'walk'; m.t = 0; m.move = ''; }
  }

  private hitProp(p: World['props'][number]): void {
    const h = this.hero;
    if (p.kind === 'lever') {
      p.cd = 8;
      this.events.push({ t: 'lever', x: p.tx ?? p.x }, { t: 'shock', x: p.tx ?? p.x, y: this.stage.groundY, r: (p.tw ?? 260) / 2 });
      for (const m of this.targetsNear(p.tx ?? p.x, this.stage.groundY, (p.tw ?? 260) / 2, 60)) {
        const d = MOBS[m.kind], dmg = Math.round(m.maxHp * (d.brain === 'boss' ? 0.06 : 0.4));
        m.hp -= dmg; m.flash = 0.15; m.hurtShown = 3; m.state = m.state === 'dead' ? m.state : 'hurt'; m.t = -0.8;
        this.events.push({ t: 'hit', x: m.x, y: m.y - d.h * 0.6, dmg, crit: true, target: 'mob' });
        if (m.hp <= 0) this.killMob(m);
      }
      return;
    }
    if (--p.hp > 0) { this.events.push({ t: 'block', x: p.x, y: p.y - 30 }); return; }
    this.events.push({ t: 'prop', kind: p.kind, x: p.x, y: p.y });
    const lv = this.stage.lv[1];
    const cr = Math.round((p.kind === 'chest' ? 40 : 4) + lv * (p.kind === 'chest' ? 4 : 0.8));
    const crm = h.d.procs.includes('magnet') ? Math.round(cr * 1.25) : cr;
    this.run.crumbs += crm; this.events.push({ t: 'crumbs', n: crm, x: p.x, y: p.y - 40 });
    if (p.kind === 'jar') { const n = Math.round(h.d.maxHp * 0.08); h.hp = Math.min(h.d.maxHp, h.hp + n); this.events.push({ t: 'heal', x: h.x, y: h.y - 70, n, hero: true }); }
    const drops = p.kind === 'chest' ? 2 : p.kind === 'crate' && this.rand() < 0.3 ? 1 : 0;
    for (let i = 0; i < drops; i++) {
      const tier = (p.kind === 'chest' ? 4 : 1 + Math.floor(this.rand() * 2)) as BoxTier;
      const b: Box = { id: nextId++, tier, ilvl: lv, x: p.x + (i - (drops - 1) / 2) * 40, y: p.y - 20, vy: -380, ground: false, t: 0 };
      this.boxes.push(b); this.events.push({ t: 'drop', id: b.id, tier, x: b.x, y: b.y });
    }
    if (p.key) this.events.push({ t: 'key', world: this.stage.world });
  }

  /** Arena rooms, the rolling-pin chase, conveyor belts. */
  private stepSetPieces(dt: number): void {
    const h = this.hero, G = this.stage.groundY;
    this.arenas.forEach((a, i) => {
      if (a.done) return;
      if (!a.locked) {
        if (this.heroes.some(p => p.x > a.x0 + 120 && p.x < a.x1 - 120 && p.state !== 'down')) { a.locked = true; a.wave = -1; this.events.push({ t: 'arenaLock', i, waves: a.waves.length }); }
        else return;
      }
      // gates: nobody gets out until it's over
      for (const p of this.heroes) {
        if (p.x < a.x0 - 60 || p.x > a.x1 + 60) { p.x = (a.x0 + a.x1) / 2; p.y = G; p.vy = 0; }
        p.x = clamp(p.x, a.x0 + 24, a.x1 - 24);
        // held back by the gate while a moving tray slides away underneath: you drop instead of standing on air
        if (p.ground && p.on !== null && p.on >= 0) { const q = this.stage.platforms[p.on]; if (p.x < q.x - 4 || p.x > q.x + q.w + 4) { p.ground = false; p.on = null; } }
      }
      const mine = this.mobs.filter(m => m.arena === i && m.state !== 'dead');
      for (const m of mine) m.x = clamp(m.x, a.x0 + 24, a.x1 - 24);
      if (mine.length) return;
      if (a.wave + 1 < a.waves.length) {
        a.wave++;
        for (const s of a.waves[a.wave]) {
          const m = this.spawnMob(s.kind, s.x, s.lv + (this.hard ? HARD_LV : 0), undefined, s.elite);
          m.arena = i; m.under = false; m.disguised = false; m.face = s.x < h.x ? 1 : -1;
          m.y = G; m.ground = true; m.on = -1; m.vy = 0; m.state = 'hurt'; m.t = -0.2; // they burst in at the gates, on the floor
        }
        this.events.push({ t: 'arenaWave', i, wave: a.wave + 1, waves: a.waves.length });
      } else {
        a.locked = false; a.done = true;
        this.events.push({ t: 'arenaClear', i });
        const b: Box = { id: nextId++, tier: 3, ilvl: this.stage.lv[1], x: (a.x0 + a.x1) / 2, y: G - 80, vy: -300, ground: false, t: 0 };
        this.boxes.push(b); this.events.push({ t: 'drop', id: b.id, tier: 3, x: b.x, y: b.y });
      }
    });
    // the giant rolling pin: starts behind you at the chase line, a bit slower than you can run
    const c = this.chase;
    if (c && !c.done) {
      if (!c.on && this.heroes.some(p => p.x > c.x0)) { c.on = true; c.x = c.x0 - 420; c.speed = Math.max(160, Math.min(...this.heroes.map(p => p.d.cls.speed * p.d.speed)) * 0.88); this.events.push({ t: 'chase', on: true }); }
      if (c.on) {
        c.x += c.speed * dt; c.cd = Math.max(0, c.cd - dt);
        for (const p of this.heroes) if (c.cd <= 0 && Math.abs(p.x - c.x) < 62 && p.y > G - 95 && p.state !== 'down') {
          c.cd = 1; this.cur = p; this.hurtHero(p.d.maxHp * 0.2, 1, undefined, true);
          if ((p.state as string) !== 'down') { p.vx = 520; p.vy = -420; p.ground = false; p.on = null; }
        }
        this.cur = this.heroes[0];
        for (const m of this.mobs) {
          const d = MOBS[m.kind];
          if (m.state === 'dead' || m.under || d.brain === 'boss' || d.brain === 'flyer' || Math.abs(m.x - c.x) > 60 || m.y < G - 95 || m.hurtShown > 2.5) continue;
          const dmg = Math.round(m.maxHp * 0.6); m.hp -= dmg; m.flash = 0.15; m.hurtShown = 3; m.vx = 400; m.vy = -380; m.ground = false; m.on = null;
          this.events.push({ t: 'hit', x: m.x, y: m.y - d.h * 0.6, dmg, crit: true, target: 'mob' });
          if (m.hp <= 0) this.killMob(m);
        }
        if (c.x >= c.x1) { c.done = true; c.on = false; this.events.push({ t: 'chase', on: false }, { t: 'shock', x: c.x, y: G, r: 120 }); }
      }
    }
    // conveyor belts move whatever stands on the floor over them
    for (const b of this.stage.belts ?? []) {
      const on = (x: number) => x > b.x - b.w / 2 && x < b.x + b.w / 2;
      for (const p of this.heroes) if (p.ground && p.on === -1 && on(p.x) && p.state !== 'climb') p.x += b.v * dt;
      for (const m of this.mobs) if (m.ground && m.on === -1 && on(m.x) && m.state !== 'dead') m.x += b.v * dt;
      for (const k of this.cookers) if (k.gone <= 0 && on(k.x)) k.x += b.v * dt;
    }
  }

  /** Everything a remote player needs to draw the stage this frame (positions, states, HP), JSON-safe. */
  snapshot() {
    const r = (n: number) => Math.round(n);
    return {
      t: Math.round(this.time * 60), portal: this.portal, cleared: this.cleared, failed: this.failed,
      heroes: this.heroes.map(h => ({ i: h.idx, sp: h.d.cls.species, x: r(h.x), y: r(h.y), f: h.face, st: h.state, tt: +h.t.toFixed(2), step: h.step, hp: r(h.hp), mhp: h.d.maxHp, sk: h.skill?.id ?? null, ult: r(h.ult) })),
      mobs: this.mobs.map(m => ({ id: m.id, k: m.kind, x: r(m.x), y: r(m.y), f: m.face, st: m.state, mv: m.move, hp: r(m.hp), mhp: m.maxHp, lv: m.lv, e: m.elite ? 1 : 0, u: m.under ? 1 : 0, d: m.disguised ? 1 : 0 })),
      shots: this.shots.map(s => ({ id: s.id, x: r(s.x), y: r(s.y), k: s.kind ?? '', fr: s.from })),
      boxes: this.boxes.map(b => ({ id: b.id, x: r(b.x), y: r(b.y), tier: b.tier, o: b.owner ?? 0 })),
    };
  }

  /** Teammates can pick you back up: stand next to a downed hero for 2 s. */
  private revive(h: Hero, dt: number): void {
    if (h.state !== 'down' || this.heroes.length < 2 || this.failed) { h.revT = 0; return; }
    const helper = this.heroes.some(o => o !== h && o.state !== 'down' && Math.abs(o.x - h.x) < 60 && Math.abs(o.y - h.y) < 50);
    h.revT = helper ? h.revT + dt : Math.max(0, h.revT - dt);
    if (h.revT >= 2) {
      h.revT = 0; h.hp = Math.round(h.d.maxHp * 0.4); h.inv = 2; this.enter(h, 'move');
      this.events.push({ t: 'revive' });
    }
  }
  /** The stage is lost only when the whole party is down. */
  private checkWipe(): void {
    if (this.failed) return;
    if (this.heroes.every(h => h.state === 'down' && h.t > 1.6)) { this.failed = true; this.events.push({ t: 'down' }); }
  }
  /** Teammates who fall too far behind are pulled back to the player. */
  private leash(): void {
    const p = this.heroes[0];
    for (const h of this.heroes) {
      if (h === p || (Math.abs(h.x - p.x) < 420 && Math.abs(h.y - p.y) < 260)) continue;
      h.x = clamp(p.x - p.face * 60, 20, this.stage.width - 20); h.y = p.y; h.vx = 0; h.vy = 0; h.ground = p.ground; h.on = p.on;
      if (h.state === 'climb') this.enter(h, 'move');
    }
  }
  /** Each monster goes after one hero: the nearest one still standing (re-checked every second). */
  private targetOf(m: Mob): Hero {
    const cur = this.heroes[m.tgt];
    if (this.heroes.length === 1) return this.heroes[0];
    if (!cur || cur.state === 'down' || Math.floor(this.time) !== Math.floor(this.time - DT)) {
      let best = cur && cur.state !== 'down' ? cur : this.heroes[0], bd = 1e9;
      for (const h of this.heroes) { if (h.state === 'down') continue; const d = Math.abs(h.x - m.x) + Math.abs(h.y - m.y) * 1.5; if (d < bd) { bd = d; best = h; } }
      m.tgt = best.idx;
    }
    return this.heroes[m.tgt] ?? this.heroes[0];
  }

  /** Escort / fetch / survive. */
  private stepObjective(dt: number): void {
    const h = this.hero, ob = this.stage.objective;
    if (!ob || this.failed || this.cleared) return;
    const fail = (why: string) => { // the whole stage is lost at once (re-downing everyone each frame kept it from ever ending)
      this.events.push({ t: 'objFail', why }); for (const p of this.heroes) { p.hp = 0; this.enter(p, 'down'); }
      this.failed = true; this.events.push({ t: 'down' });
    };
    // the Crumblet follows a step behind you along the floor and gets hurt by attacks and shots near it;
    // it shares most of your toughness (so it stays about 70% as sturdy as you, early and late)
    const n = this.npc;
    if (n && n.hp > 0) {
      const nk = 0.6 * (1 - h.d.dr * 0.75);
      n.hurt = Math.max(0, n.hurt - dt);
      const tx = this.portal ? this.exitX : h.x - h.face * 70;
      if (Math.abs(tx - n.x) > 8) { n.face = tx > n.x ? 1 : -1; n.x += n.face * Math.min(Math.abs(tx - n.x), 130 * dt); }
      for (const m of this.mobs) {
        if (m.state === 'dead' || m.under || n.hurt > 0) continue;
        const d = MOBS[m.kind];
        if ((m.state === 'attack' || (m.state === 'walk' && d.brain === 'hopper' && !m.ground)) && Math.abs(m.x - n.x) < d.w / 2 + 18 && Math.abs(m.y - n.y) < 50) {
          n.hp -= Math.round(m.atk * nk); n.hurt = 0.8;
          this.events.push({ t: 'hit', x: n.x, y: n.y - 40, dmg: Math.round(m.atk * nk), crit: false, target: 'hero' });
        }
      }
      for (const s of this.shots) if (s.from === 'mob' && s.t >= 0 && Math.abs(s.x - n.x) < 18 && s.y > n.y - 44 && s.y < n.y + 4 && n.hurt <= 0) {
        n.hp -= Math.round(s.dmg * nk); n.hurt = 0.8; s.t = 99;
        this.events.push({ t: 'hit', x: n.x, y: n.y - 40, dmg: Math.round(s.dmg * nk), crit: false, target: 'hero' });
      }
      if (n.hp <= 0) { n.hp = 0; fail('The Crumblet got hurt too badly!'); return; }
    }
    // fetch: grab the Recipe Scroll in time, then hold out
    if (this.scroll && !this.scroll.got) {
      this.objTimer -= dt;
      if (this.heroes.some(p => Math.abs(p.x - this.scroll!.x) < 36 && Math.abs(p.y - this.scroll!.y) < 60)) {
        this.scroll.got = true; this.holdout = 25;
        this.events.push({ t: 'objective', text: 'Got the Recipe Scroll! Hold out for 25 seconds!' });
      } else if (this.objTimer <= 0) { fail('Too slow: the Recipe Scroll crumbled away!'); return; }
    }
    // survive / hold out: waves from both sides until the timer runs out
    if (this.holdout > 0) {
      this.holdout -= dt;
      if ((this.spawnT -= dt) <= 0 && this.alive < 10) {
        this.spawnT = 4.5;
        const w = WORLDS.find(x => x.id === this.stage.world) ?? WORLDS[0];
        const kinds = w.pool.map(([, k]) => k).filter(k => MOBS[k].brain !== 'turret' && MOBS[k].brain !== 'mimic' && MOBS[k].brain !== 'burrower');
        for (const side of [-1, 1]) {
          const x = clamp(h.x + side * 380, 40, this.stage.width - 40);
          const m = this.spawnMob(kinds[Math.floor(this.rand() * kinds.length)], x, this.stage.lv[0] + (this.hard ? HARD_LV : 0));
          m.face = side > 0 ? -1 : 1; m.t = 1;
        }
      }
      if (this.holdout <= 0) { // the waves retreat
        this.holdout = 0;
        for (const m of this.mobs) if (m.state !== 'dead') { m.state = 'dead'; m.deadT = 0.3; m.hp = 0; }
        this.events.push({ t: 'objective', text: 'You held out! The monsters retreat' });
      }
    }
  }

  /** Moving trays, sponges, runaway pressure cookers. */
  private stepProps(dt: number): void {
    this.stage.platforms.forEach((p, i) => {
      if (!p.move) return;
      const nx = this.platBase[i] + p.move.dx * (0.5 - 0.5 * Math.cos(this.time * Math.PI * 2 / p.move.period));
      const d = nx - p.x; p.x = nx;
      for (const h of this.heroes) if (h.on === i && h.ground) h.x += d;
      for (const m of this.mobs) if (m.on === i && m.ground) m.x += d;
    });
    for (const p of this.props) {
      p.cd = Math.max(0, p.cd - dt);
      if (p.kind === 'sponge') for (const h of this.heroes) if (h.landed && h.ground && h.state !== 'climb' && Math.abs(h.x - p.x) < 34 && Math.abs(h.y - p.y) < 3 && h.lastFall < 200) { // jump or walk onto it (dropping off the ledge above doesn't send you back up)
        h.vy = -1150; h.ground = false; h.on = null; h.bounced = true; this.events.push({ t: 'bounce', x: p.x, y: p.y });
      }
    }
    for (const c of this.cookers) {
      if (c.gone > 0) { if ((c.gone -= dt) <= 0) { c.x = c.home; c.vx = 0; c.fuse = 0; } continue; }
      if (c.fuse > 0) {
        c.vx = approach(c.vx, 0, 600 * dt);
        if ((c.fuse -= dt) <= 0) { // boom: hurts everything close, monsters most of all
          c.gone = 6;
          this.events.push({ t: 'boom', x: c.x, y: c.y }, { t: 'shock', x: c.x, y: c.y, r: 130 });
          for (const h of this.heroes) if (Math.abs(h.x - c.x) < 130 && Math.abs(h.y - c.y) < 110) { this.cur = h; this.hurtHero(h.d.maxHp * 0.15, Math.sign(h.x - c.x) || 1, undefined, true); }
          this.cur = this.heroes[0];
          for (const m of this.targetsNear(c.x, c.y, 130, 110)) {
            const d = MOBS[m.kind], dmg = Math.round(m.maxHp * (d.brain === 'boss' ? 0.08 : 0.6));
            m.hp -= dmg; m.flash = 0.15; m.hurtShown = 3; this.dealt += dmg;
            this.events.push({ t: 'hit', x: m.x, y: m.y - d.h * 0.6, dmg, crit: true, target: 'mob' });
            if (m.hp <= 0) this.killMob(m); else if (d.brain !== 'boss') { m.vx = Math.sign(m.x - c.x || 1) * 400; m.vy = -420; m.ground = false; m.on = null; m.state = 'hurt'; m.t = -0.6; }
          }
        }
      } else {
        // waddles about; anything that comes close lights the fuse
        if (Math.abs(c.vx) < 60) { if (Math.abs(c.x - c.home) > 140) c.face = c.x > c.home ? -1 : 1; c.vx = c.face * 50; }
        else c.vx = approach(c.vx, c.face * 50, 500 * dt);
        const near = this.heroes.some(h => Math.abs(h.x - c.x) < 70 && Math.abs(h.y - c.y) < 60 && h.state !== 'down') || this.mobs.some(m => m.state !== 'dead' && !m.under && Math.abs(m.x - c.x) < 60 && Math.abs(m.y - c.y) < 60);
        if (near) { c.fuse = 1; this.events.push({ t: 'fuse', x: c.x, y: c.y }); }
      }
      c.x = clamp(c.x + c.vx * dt, 30, this.stage.width - 30);
    }
  }

  /** Lingering skill zones: tick damage, slow, burn, glue. */
  private stepZones(dt: number): void {
    for (const z of this.zones) {
      this.cur = this.heroes[z.owner ?? 0] ?? this.heroes[0];
      z.t -= dt; z.next -= dt;
      if (z.next > 0) continue;
      z.next = z.tick;
      if (z.kind === 'guac') for (const o of this.heroes) if (o.state !== 'down' && Math.abs(o.x - z.x) < z.w / 2 && Math.abs(o.y - z.y) < 70) o.hp = Math.min(o.d.maxHp, o.hp + o.d.maxHp * 0.015);
      for (const m of this.mobs) {
        if (m.state === 'dead' || m.under || m.disguised || Math.abs(m.x - z.x) > z.w / 2 + MOBS[m.kind].w / 2 || Math.abs(m.y - z.y) > (z.kind === 'snow' ? 400 : 70)) continue;
        if (z.kind === 'ice' || z.kind === 'snow' || z.kind === 'guac') m.slow = Math.max(m.slow, 1);
        if (z.kind === 'goo') { if (z.hit?.has(m.id)) continue; z.hit?.add(m.id); this.glue(m); }
        if (z.kind === 'fire') { m.burn = Math.max(m.burn, 1); m.burnDmg = Math.max(m.burnDmg, z.dmg * 0.5); }
        if (z.dmg > 0) this.damageMob(m, z.dmg, Math.sign(m.x - z.x) || 1, { kx: 30, ky: 0, stun: 0.15 }, true);
      }
    }
    this.zones = this.zones.filter(z => z.t > 0);
  }

  /** Rice balls circling the hero. */
  private stepOrbs(dt: number): void {
    const h = this.hero, o = h.orbs;
    if (!o) return;
    o.t -= dt;
    if (o.t <= 0 || h.state === 'down') { h.orbs = null; return; }
    for (const [id, c] of o.cd) o.cd.set(id, c - dt);
    for (let i = 0; i < o.n; i++) {
      const a = this.time * 4 + (i / o.n) * Math.PI * 2, ox = h.x + Math.cos(a) * 64, oy = h.y - 40 + Math.sin(a) * 34;
      for (const m of this.mobs) {
        if (m.state === 'dead' || m.under || (o.cd.get(m.id) ?? 0) > 0) continue;
        const d = MOBS[m.kind];
        if (Math.abs(m.x - ox) < d.w / 2 + 14 && oy < m.y + 6 && oy > m.y - d.h - 6) { o.cd.set(m.id, 0.5); this.damageMob(m, o.dmg, Math.sign(m.x - h.x) || 1, { kx: 200, ky: -200, stun: 0.5 }, true); }
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
      case 'vortex': { // spin + suck monsters in
        h.vx = approach(h.vx, dir * speed * 0.6, 1800 * dt);
        const tick = Math.floor(h.t * (sk.n ?? 6) / sk.dur);
        if (tick > h.ticks) { h.ticks = tick; h.hitIds = new Set(); }
        mk(h.x, sk.reach * 2, sk.h);
        for (const m of this.targetsNear(h.x, h.y, sk.reach * 1.8, 90)) if (MOBS[m.kind].brain !== 'boss') m.x += Math.sign(h.x - m.x) * 140 * dt;
        break;
      }
      case 'whip': { // quick lashes at fixed moments
        h.vx = approach(h.vx, 0, 2400 * dt);
        const n = sk.n ?? 2, tick = Math.min(n, Math.floor(q * (n + 1)));
        if (tick > h.ticks) { h.ticks = tick; h.hitIds = new Set(); mk(h.x + h.face * sk.reach / 2, sk.reach, sk.h, h.y - 20); }
        break;
      }
      case 'counter': { // stance: hurtHero answers a hit (ticks = 1); otherwise a small snap at the end
        h.vx = approach(h.vx, 0, 2400 * dt);
        if (q > 0.92 && !h.ticks) { h.ticks = 2; this.hitBox(h.x + h.face * sk.reach / 2, h.y, sk.reach, sk.h, sk.dmg * h.skillMul * 0.4, true, { kx: sk.kx * 0.5, ky: -150, stun: 0.6 }, h.hitIds); }
        break;
      }
      case 'pounce': {
        if (!h.ticks && h.t < 0.05) {
          const m = this.targetsNear(h.x, h.y, 340, 160)[0];
          const tx = m ? m.x : h.x + h.face * 160;
          h.face = tx >= h.x ? 1 : -1; h.vx = (tx - h.x) / 0.5; h.vy = -560; h.ground = false; h.on = null; h.ticks = -1;
        }
        if (h.ground && h.t > 0.15 && h.ticks === -1) { h.ticks = 1; h.vx = 0; this.events.push({ t: 'shock', x: h.x, y: h.y, r: sk.reach }); mk(h.x, sk.reach * 2, sk.h); }
        break;
      }
      case 'swoop': // arc up, then dive through
        h.vx = h.face * 560; h.vy = q < 0.35 ? -380 : 620; h.ground = false; h.on = null;
        mk(h.x + h.face * 20, sk.reach, sk.h);
        break;
      case 'breath': { // a stream: ticks through the duration
        h.vx = approach(h.vx, 0, 2400 * dt);
        const tick = Math.floor(q * (sk.n ?? 6));
        if (tick > h.ticks || h.t < dt * 1.5) { h.ticks = tick; h.hitIds = new Set(); mk(h.x + h.face * sk.reach / 2, sk.reach, sk.h); }
        break;
      }
      case 'drain':
        h.vx = 0;
        if (q > 0.5 && !h.ticks) {
          h.ticks = 1; this.events.push({ t: 'shock', x: h.x, y: h.y - 30, r: sk.reach });
          const before = this.dealt; mk(h.x, sk.reach * 2, sk.h, h.y + sk.h / 3);
          const heal = Math.min(h.d.maxHp * 0.12, (this.dealt - before) * (sk.leech ?? 0.3)); h.hp = Math.min(h.d.maxHp, h.hp + heal); // at most 12% max HP a slurp
        }
        break;
      case 'jiggle': // boing up, splat down: glue everything nearby
        if (!h.ticks) { h.ticks = 1; h.vy = -700; h.ground = false; h.on = null; }
        h.vx = approach(h.vx, h.face * 160, 2000 * dt);
        if (h.ticks === 1 && h.ground && h.t > 0.15) { h.ticks = 2; this.events.push({ t: 'shock', x: h.x, y: h.y, r: sk.reach }); mk(h.x, sk.reach * 2, sk.h); for (const m of this.targetsNear(h.x, h.y, sk.reach, 70)) if (MOBS[m.kind].brain !== 'boss') this.glue(m); }
        break;
      case 'upstream': // a salmon leap forward and up
        if (!h.ticks) { h.ticks = 1; h.vy = -600; h.ground = false; h.on = null; }
        h.vx = q < 0.9 ? h.face * 640 : approach(h.vx, 0, 3000 * dt);
        mk(h.x + h.face * 20, sk.reach, sk.h, h.y + 20);
        break;
      case 'swing': // up and over, then a sticky slam on landing
        if (!h.ticks) { h.ticks = 1; h.vy = -560; h.ground = false; h.on = null; }
        h.vx = q < 0.85 ? h.face * 600 : approach(h.vx, 0, 3000 * dt);
        mk(h.x + h.face * 20, sk.reach, sk.h);
        if (h.ticks === 1 && h.ground && h.t > 0.15) { h.ticks = 2; this.events.push({ t: 'shock', x: h.x, y: h.y, r: 90 }); for (const m of this.targetsNear(h.x, h.y, 100, 70)) if (MOBS[m.kind].brain !== 'boss') this.glue(m); }
        break;
      case 'nap': // dozes (heals), then wakes with a shockwave
        h.vx = 0;
        if (Math.floor(h.t / 0.3) !== Math.floor((h.t - dt) / 0.3) && q < 0.85) h.hp = Math.min(h.d.maxHp, h.hp + h.d.maxHp * 0.05);
        if (q > 0.85 && !h.ticks) { h.ticks = 1; this.events.push({ t: 'shock', x: h.x, y: h.y - 30, r: sk.reach }); mk(h.x, sk.reach * 2, sk.h); }
        break;
      case 'hops': { // three hops: jump, land with a shockwave, jump again
        h.vx = h.ticks < 6 ? h.face * 330 : approach(h.vx, 0, 3000 * dt);
        if (h.ground && h.ticks % 2 === 1) { h.ticks++; h.hitIds = new Set(); this.events.push({ t: 'shock', x: h.x, y: h.y, r: sk.reach }); mk(h.x, sk.reach * 1.6, sk.h); }
        if (h.ground && h.ticks % 2 === 0 && h.ticks < 6) { h.vy = -470; h.ground = false; h.on = null; h.ticks++; }
        break;
      }
      case 'flurry': { // six quick punches, the last one big
        h.vx = approach(h.vx, h.face * 80, 2000 * dt);
        const punch = Math.floor(q * 6);
        if (punch > h.ticks - 1 && punch < 6) {
          h.ticks = punch + 1; h.hitIds = new Set();
          const last = punch === 5;
          this.hitBox(h.x + h.face * sk.reach / 2, h.y, sk.reach, sk.h, sk.dmg * h.skillMul * (last ? 2.5 : 1), true, { kx: last ? 460 : sk.kx, ky: last ? -340 : sk.ky, stun: last ? 0.8 : 0.3 }, h.hitIds);
          this.events.push({ t: 'swing', step: punch % 2 });
        }
        break;
      }
      case 'gust':
        h.vx = approach(h.vx, 0, 3000 * dt);
        if (q > 0.25 && !h.ticks) { h.ticks = 1; this.events.push({ t: 'shock', x: h.x + h.face * 80, y: h.y - 30, r: 120 }); this.hitBox(h.x + h.face * sk.reach / 2, h.y, sk.reach, sk.h, sk.dmg * h.skillMul, true, { kx: sk.kx, ky: sk.ky, stun: 0.9 }, h.hitIds); }
        break;
      case 'screech':
        h.vx = approach(h.vx, 0, 3000 * dt);
        if (q > 0.3 && !h.ticks) { h.ticks = 1; this.events.push({ t: 'shock', x: h.x + h.face * 60, y: h.y - 40, r: 140 }); this.hitBox(h.x + h.face * sk.reach / 2, h.y, sk.reach, sk.h, sk.dmg * h.skillMul, true, { kx: sk.kx, ky: sk.ky, stun: 1.6 }, h.hitIds); }
        break;
      case 'freeze':
        h.vx = 0;
        if (q > 0.5 && !h.ticks) {
          h.ticks = 1; this.events.push({ t: 'shock', x: h.x, y: h.y - 30, r: sk.reach });
          for (const m of this.targetsNear(h.x, h.y, sk.reach, sk.h)) {
            this.damageMob(m, h.d.atk * sk.dmg * h.skillMul, Math.sign(m.x - h.x) || 1, { kx: 0, ky: 0, stun: 0.2 }, true);
            if (m.state !== 'dead') { if (MOBS[m.kind].brain === 'boss') m.slow = 3; else { m.frozen = 2.5; m.vx = 0; } }
          }
        }
        break;
      case 'bulldoze': // carry monsters along, crush at the end
        if (q < 0.8) {
          h.vx = h.face * 620;
          for (const m of this.targetsNear(h.x + h.face * 40, h.y, 70, 60)) if (MOBS[m.kind].brain !== 'boss') { m.x = clamp(h.x + h.face * (40 + MOBS[m.kind].w / 2), 20, this.stage.width - 20); m.vx = h.vx; }
        } else {
          h.vx = approach(h.vx, 0, 3000 * dt);
          if (!h.ticks) { h.ticks = 1; this.events.push({ t: 'shock', x: h.x + h.face * 60, y: h.y, r: 90 }); mk(h.x + h.face * 60, 170, sk.h); }
        }
        break;
      case 'roll': { // bounce back and forth through the crowd
        const leg = Math.floor(q * 3);
        h.face = (leg % 2 === 0 ? h.skillFace : -h.skillFace) as 1 | -1;
        if (h.x <= 40 || h.x >= this.stage.width - 40) h.skillFace = (h.x <= 40 ? (leg % 2 === 0 ? 1 : -1) : (leg % 2 === 0 ? -1 : 1)) as 1 | -1;
        h.vx = h.face * 520;
        const tick = Math.floor(h.t / 0.25);
        if (tick > h.ticks) { h.ticks = tick; h.hitIds = new Set(); }
        mk(h.x, sk.reach, sk.h);
        break;
      }
      case 'slide':
        h.vx = q < 0.8 ? h.face * 640 : approach(h.vx, 0, 3000 * dt);
        if (q < 0.8) mk(h.x + h.face * 20, sk.reach, sk.h);
        break;
      case 'rampage': { // ult: charge back and forth
        const n = sk.n ?? 3, leg = Math.min(n - 1, Math.floor(q * n));
        h.face = (leg % 2 === 0 ? h.skillFace : -h.skillFace) as 1 | -1;
        if (leg !== h.ticks) { h.ticks = leg; h.hitIds = new Set(); }
        h.vx = h.face * 720;
        mk(h.x + h.face * 20, sk.reach, sk.h);
        break;
      }
      case 'slashall': { // ult: blink from monster to monster
        h.vx = 0;
        const i = Math.floor(h.t / 0.13);
        if (i >= h.ticks && h.ticks < h.targets.length) {
          const m = this.mobs.find(x => x.id === h.targets[h.ticks]);
          h.ticks++;
          if (m && m.state !== 'dead') { h.x = clamp(m.x - h.face * (MOBS[m.kind].w / 2 + 20), 20, this.stage.width - 20); this.damageMob(m, h.d.atk * sk.dmg * h.skillMul, h.face, { kx: sk.kx, ky: sk.ky, stun: 0.8 }, true); this.events.push({ t: 'shock', x: m.x, y: m.y - 40, r: 40 }); }
        }
        break;
      }
      case 'beam': { // ult: pulses of a long piercing beam
        h.vx = 0; if (!h.ground) h.vy = Math.min(h.vy, 40);
        const tick = Math.floor(q * (sk.n ?? 4));
        if (tick > h.ticks || h.t < dt * 1.5) { h.ticks = tick; h.hitIds = new Set(); mk(h.x + h.face * sk.reach / 2, sk.reach, sk.h, h.y + 10); }
        break;
      }
      case 'tremor': { // ult: three growing shockwaves
        h.vx = 0;
        const n = sk.n ?? 3, i = Math.floor(q * n);
        if (i >= h.ticks && h.ticks < n) { const r = sk.reach * (0.5 + 0.5 * (h.ticks + 1) / n); h.ticks++; h.hitIds = new Set(); this.events.push({ t: 'shock', x: h.x, y: h.y, r }); mk(h.x, r * 2, sk.h); }
        break;
      }
      default:
        h.vx = approach(h.vx, 0, 2400 * dt);
    }
    if (h.t >= sk.dur && (!(sk.kind === 'slam' || sk.kind === 'pounce') || h.ground)) this.enter(h, h.ground ? 'move' : 'air');
  }

  /** Quick-bag item: heal or boost (shared cooldown). */
  useItem(slot: number): boolean {
    const h = this.hero, it = h.bag[slot];
    if (!it || it.n <= 0 || h.quickCd > 0 || h.state === 'down' || this.cleared || this.spicy.includes('nopots')) return false;
    const def = CONSUMABLES[it.id];
    if (!def.quick) return false;
    if (def.heal && h.hp >= h.d.maxHp) return false;
    if (def.heal) h.hp = Math.min(h.d.maxHp, h.hp + h.d.maxHp * def.heal);
    if (def.boost) h.boosts[def.boost.kind] = [def.boost.v, def.boost.t];
    it.n--; h.quickCd = QUICK_CD;
    this.events.push({ t: 'use', slot, id: it.id });
    return true;
  }

  private atkDef(h: Hero): AttackDef {
    const c = h.d.cls;
    if (h.step === -1) return c.air;
    if (h.step === -2) return guardBreakOf(c.combo);
    if (h.step === -3) return launcherOf(c.combo);
    return c.combo[h.step];
  }

  private enter(h: Hero, s: HeroState): void { h.state = s; h.t = 0; if (s !== 'attack') h.queued = false; }

  /** Hero damage into an area. Box = centre x, feet y, width, height up from feet. */
  private hitBox(cx: number, y: number, w: number, hh: number, mult: number, skill: boolean, k: { kx: number; ky: number; stun: number }, ids: Set<number>): void {
    const h = this.hero;
    for (const m of this.mobs) {
      if (m.state === 'dead' || m.under || ids.has(m.id)) continue;
      const def = MOBS[m.kind];
      if (Math.abs(m.x - cx) > w / 2 + def.w / 2) continue;
      if (m.y - def.h > y || m.y < y - hh) continue;
      ids.add(m.id);
      this.damageMob(m, h.d.atk * mult, Math.sign(m.x - h.x) || h.face, k, skill);
      // air attacks that connect keep you aloft a little: juggles
      if (h.state === 'attack' && h.step === -1 && !h.ground) h.vy = Math.min(h.vy, -170);
    }
    for (const p of this.props) {
      if (p.hp <= 0 || p.cd > 0 || p.kind === 'sponge' || Math.abs(p.x - cx) > w / 2 + 22 || p.y - 50 > y || p.y < y - hh) continue;
      p.cd = 0.25; this.hitProp(p);
    }
    for (const c of this.cookers) if (c.gone <= 0 && Math.abs(c.x - cx) < w / 2 + 24 && Math.abs(c.y - y) < hh) { c.vx = (Math.sign(c.x - h.x) || h.face) * 420; c.face = c.vx > 0 ? 1 : -1; }
  }

  /** total damage dealt to monsters (drain measures a skill's damage with it) */
  dealt = 0;

  /** Minturtle's waffle walls: monsters and their shots can't get through */
  walls: { x: number; y: number; t: number; freeze: boolean }[] = [];
  private stepWalls(dt: number): void {
    for (const w of this.walls) {
      w.t -= dt;
      for (const m of this.mobs) {
        const d = MOBS[m.kind];
        if (m.state === 'dead' || m.under || d.brain === 'boss' || d.brain === 'flyer' || Math.abs(m.y - w.y) > 130) continue;
        const gap = d.w / 2 + 16;
        if (Math.abs(m.x - w.x) < gap) { const side = Math.sign(m.x - w.x) || 1; m.x = w.x + side * gap; if (Math.sign(m.vx) === -side) m.vx = 0; if (w.freeze && m.frozen <= 0) { m.frozen = 1.2; } }
      }
      for (const s of this.shots) if (s.from === 'mob' && Math.abs(s.x - w.x) < 18 && s.y > w.y - 150 && s.y < w.y + 4) { s.t = 99; this.events.push({ t: 'block', x: w.x, y: s.y }); }
    }
    this.walls = this.walls.filter(w => w.t > 0);
  }

  /** Bubblegumbo's gum bubbles: a sealed monster is helpless until it pops */
  bubbles: { id: number; t: number; dmg: number; owner: number; kx: number; ky: number }[] = [];
  private bubble(m: Mob, t: number, dmg: number, h: Hero, kx: number, ky: number): void {
    if (m.state === 'dead' || this.bubbles.some(b => b.id === m.id)) return;
    this.bubbles.push({ id: m.id, t, dmg, owner: h.idx, kx, ky });
  }
  private stepBubbles(dt: number): void {
    for (const b of this.bubbles) {
      const m = this.mobs.find(o => o.id === b.id);
      b.t -= dt;
      if (!m || m.state === 'dead') { b.t = -1; continue; }
      if (MOBS[m.kind].brain === 'boss') m.slow = Math.max(m.slow, 0.2); else { m.frozen = Math.max(m.frozen, 0.1); m.vx = 0; }
      if (b.t <= 0) { // POP
        this.cur = this.heroes[b.owner] ?? this.heroes[0];
        this.events.push({ t: 'boom', x: m.x, y: m.y - MOBS[m.kind].h / 2 });
        this.damageMob(m, b.dmg, this.cur.face, { kx: b.kx, ky: b.ky, stun: 0.6 }, true);
      }
    }
    this.cur = this.heroes[0];
    this.bubbles = this.bubbles.filter(b => b.t > 0);
  }

  /** a proc's own hits don't set off more procs */
  private procLock = false;

  private damageMob(m: Mob, raw: number, dir: number, k: { kx: number; ky: number; stun: number }, heavy: boolean): void {
    // (k may be replaced below: an interrupt lengthens the stun)
    const def = MOBS[m.kind], h = this.hero;
    const isBoss = def.brain === 'boss';
    if (m.shellT > 0) { // Crumble Shell: only a Guard Break cracks it
      if (h.state === 'attack' && h.step === -2) { m.shellT = 0; m.state = 'stagger'; m.t = 0; m.vx = 0; this.events.push({ t: 'guardBreak', x: m.x, y: m.y - def.h * 0.6 }); }
      else { raw *= 0.1; this.events.push({ t: 'block', x: m.x, y: m.y - def.h * 0.6 }); }
    }
    const guardBreak = h.state === 'attack' && h.step === -2;
    if (m.disguised) { m.disguised = false; m.state = 'walk'; m.t = 1; this.events.push({ t: 'mimic', id: m.id }); }
    const plain = h.state === 'attack' && h.step >= 0; // a plain ground-combo hit
    if (plain && h === this.heroes[0]) {
      if (this.time - this.mashT > 1.5) this.mash = 0;
      this.mash++; this.mashT = this.time;
      if (this.mash >= (this.nightmare ? 6 : 9)) { // three full combos in a row and nothing else: they've read you
        this.mash = 0;
        for (const o of this.targetsNear(h.x, h.y, 260, 120)) if (MOBS[o.kind].brain !== 'boss') { o.guardT = 2; }
        this.events.push({ t: 'guardUp', x: m.x, y: m.y - MOBS[m.kind].h - 10 });
      }
    } else if (h.state === 'attack' || h.state === 'skill') this.mash = 0; // mixing it up resets the read
    if (m.guardT > 0 && plain) { raw *= 0.15; this.events.push({ t: 'block', x: m.x + m.face * 20, y: m.y - MOBS[m.kind].h * 0.6 }); }
    // shielders: front hits barely hurt unless it's a skill or a finisher (which also breaks the guard)
    if ((def.shield || m.mods.includes('shielded')) && m.state !== 'hurt' && m.state !== 'stagger' && Math.sign(h.x - m.x) === m.face) {
      if (!heavy && k.stun < 0.6) { raw *= 0.25; this.events.push({ t: 'block', x: m.x + m.face * 20, y: m.y - def.h * 0.6 }); }
    }
    if (guardBreak && (def.shield || def.armor || m.elite || m.mods.length)) {
      this.events.push({ t: 'guardBreak', x: m.x, y: m.y - def.h * 0.6 }); this.addStyle('guard', 8);
      if (isBoss) m.stagger += m.maxHp * 0.03;
    }
    // spiky elites prick you for plain hits
    if (m.mods.includes('spiky') && !heavy && h.spikyT <= 0 && h.state === 'attack') {
      h.spikyT = 0.5; const p = Math.max(1, Math.round(h.d.maxHp * 0.03)); h.hp = Math.max(1, h.hp - p);
      this.events.push({ t: 'hit', x: h.x, y: h.y - 60, dmg: p, crit: false, target: 'hero' });
    }
    if (m.frozen > 0) raw *= 1.3;
    if (m.glued > 0 && h.state === 'skill' && h.skill?.kind === 'roll') raw *= 2; // Mustard Glue + Spike Roll combo
    if (guardBreak || (h.state === 'attack' && h.step === 2)) raw *= 1 + h.d.heavyDmg;
    if (isBoss) raw *= (m.armor > 0 ? BOSS_ARMOR.take : 1) * (m.weak > 0 ? BOSS_ARMOR.weakMul : 1);
    if (m.tired > 0) raw *= BOSS_ARMOR.tiredMul;
    const counter = h.counter > 0;
    const crit = counter || this.rand() * 100 < h.d.crit;
    const gap = m.lv - h.d.level; // fighting above your level hurts
    const lvMul = gap > LV_GAP.free ? Math.max(0.4, 1 - LV_GAP.per * (gap - LV_GAP.free)) : 1;
    const buff = 1 + (h.buff?.atk ?? 0) + (h.boosts.atk?.[0] ?? 0);
    const dmg = Math.max(1, Math.round(raw * buff * lvMul * (crit ? h.d.critDmg : 1) * (counter ? 1.3 : 1) * (m.state === 'stagger' && def.brain === 'charger' ? 1.5 : 1) * (0.9 + this.rand() * 0.2)));
    m.hp -= dmg; m.flash = 0.12; m.hurtShown = 3; this.dealt += dmg;
    if (h.state === 'skill' && h.skill?.burn && heavy) { m.burn = Math.max(m.burn, h.skill.burn); m.burnDmg = Math.max(m.burnDmg, h.d.atk * 0.35 * h.skillMul); }
    if (h.state === 'skill' && h.skill && heavy) {
      const fx = [h.skill.freeze ? 'freeze' : '', h.skill.glue ? 'glue' : '', h.skill.slow ? 'slow' : ''].filter(Boolean);
      if (fx.length) this.applyFx(m, fx, h);
      if (h.skill.leech && h.skill.kind !== 'drain') h.hp = Math.min(h.d.maxHp, h.hp + dmg * h.skill.leech);
    }
    if (crit && h.d.procs.includes('frosty') && def.brain !== 'boss') { m.frozen = Math.max(m.frozen, 0.8); m.vx = 0; }
    if (crit && h.d.procs.includes('bite')) h.hp = Math.min(h.d.maxHp, h.hp + h.d.maxHp * 0.01);
    if (h.d.procs.includes('zap') && !this.procLock && ++h.zapN >= 6) {
      h.zapN = 0; this.procLock = true;
      const pts: [number, number][] = [[m.x, m.y - def.h * 0.6]];
      for (const o of this.targetsNear(m.x, m.y, 260, 160).filter(o => o !== m).slice(0, 3)) {
        pts.push([o.x, o.y - MOBS[o.kind].h * 0.6]);
        this.damageMob(o, h.d.atk * 0.6, Math.sign(o.x - m.x) || 1, { kx: 60, ky: -120, stun: 0.4 }, false);
      }
      this.procLock = false;
      if (pts.length > 1) this.events.push({ t: 'zap', pts });
    }
    if (h.buff?.leech) h.hp = Math.min(h.d.maxHp, h.hp + dmg * h.buff.leech);
    if (h.d.uniques.includes('frostfish')) m.slow = 2;
    if (crit && !heavy && h.d.uniques.includes('excalifork')) this.shots.push({ id: nextId++, x: h.x + h.face * 30, y: h.y - 40, vx: h.face * 600, vy: 0, t: 0, dmg: h.d.atk * 0.8, hit: new Set([m.id]), from: 'hero', kx: 120, ky: -100, pierce: false });
    if (h.state !== 'skill' || h.skill?.id.startsWith('ult') === false) h.ult = Math.min(100, h.ult + (MOBS[m.kind].brain === 'boss' ? 1.6 : 1.1) * h.d.ultGain);
    const me = h === this.heroes[0]; // the player's rank, combo and style only count the player's own hits
    if (me) { this.combo++; this.comboT = COMBO_WINDOW; this.run.maxCombo = Math.max(this.run.maxCombo, this.combo); }
    if (me && this.combo % 25 === 0 && h.d.procs.includes('rush') && !h.buff) { h.buff = { atk: 0.25, def: 0, speed: 0.25, armor: false, t: 5 }; this.events.push({ t: 'proc', name: 'Sugar High!', x: h.x, y: h.y - 90 }); }
    this.events.push({ t: 'hit', x: m.x, y: m.y - def.h * 0.6, dmg, crit, target: 'mob' });
    if (!me) { /* teammates don't feed the player's style meter */ }
    else if (h.state === 'skill') this.addStyle(h.skill?.id.startsWith('ult') ? 'ult' : 'skill', 3);
    else if (h.step === -1) this.addStyle('air', 4);
    else if (h.step === -3) this.addStyle('launch', 7);
    else if (h.step === 2) this.addStyle('finisher', 5);
    else this.addStyle('hit', 2);
    // boss phase 2 at half HP (the same for every kaiju): faster, and the arena hazards switch on
    if ((isBoss || def.brain === 'nemesis') && !m.enraged && m.hp > 0 && m.hp < m.maxHp / 2) { m.enraged = true; this.events.push({ t: 'enrage', name: def.name }); }
    if (isBoss || def.brain === 'nemesis') {
      const ph = m.hp < m.maxHp * 0.25 ? 3 : m.hp < m.maxHp * 0.5 ? 2 : 1;
      if (ph > m.bossPhase && m.hp > 0) { m.bossPhase = ph; m.queue = []; m.armor = 1; m.weak = 0; if (ph === 3) this.events.push({ t: 'phase', name: def.name, n: 3 }); }
    }
    // interrupt: hitting a wind-up cancels it, unless it's a red (danger) attack or the monster is armoured and the hit is light
    const danger = this.isDanger(m);
    if (m.state === 'windup' && !isBoss && !danger && m.hp > 0 && (!(def.armor || m.elite) || heavy || k.stun >= 0.6)) {
      // cancelled: the knockback below still applies, with a longer stun
      m.move = ''; m.state = 'hurt';
      this.run.interrupts++; this.addStyle('interrupt', 10);
      this.events.push({ t: 'interrupt', x: m.x, y: m.y - def.h - 10 });
      k = { ...k, stun: Math.max(k.stun, 0.9) };
    }

    const flinch = (!(def.armor || m.elite) || (def.brain !== 'boss' && (heavy || k.stun >= 0.6)) || m.state === 'stagger') && !danger && def.brain !== 'turret';
    if (def.brain === 'boss' && m.armor > 0 && m.hp > 0) {
      m.armor -= dmg / (m.maxHp * BOSS_ARMOR.pool) * (heavy || guardBreak ? BOSS_ARMOR.heavy : 1);
      if (m.armor <= 0) { // armour cracks: stagger, then weak for a while
        m.armor = 0; m.weak = BOSS_ARMOR.weak; m.state = 'stagger'; m.t = 0; m.vx = 0; m.queue = [];
        this.events.push({ t: 'stagger' }, { t: 'armorBreak', x: m.x, y: m.y - def.h * 0.7 });
      }
    }
    if (flinch && m.hp > 0 && m.frozen <= 0) {
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
    this.addStyle('kill', 3);
    if (m.mods.includes('splitting')) for (const off of [-40, 40]) { const c = this.spawnMob(m.kind, clamp(m.x + off, 30, this.stage.width - 30), Math.max(1, m.lv - 1), m.on !== null && m.on >= 0 ? m.y : undefined); c.hp = c.maxHp = Math.round(c.maxHp * 0.6); c.vy = -380; c.vx = off * 5; c.ground = false; c.on = null; c.state = 'hurt'; c.t = 0; c.under = false; c.disguised = false; }
    if (m.stolen >= 0) { const slot = h.bag[m.stolen]; if (slot) slot.n++; this.events.push({ t: 'recover', name: slot ? CONSUMABLES[slot.id].name : '' }); m.stolen = -1; }
    if (def.split) for (const off of [-30, 30]) { const c = this.spawnMob(def.split, clamp(m.x + off, 30, this.stage.width - 30), Math.max(1, m.lv - 2), m.on !== null && m.on >= 0 ? m.y : undefined); c.vy = -380; c.vx = off * 6; c.ground = false; c.on = null; c.state = 'hurt'; c.t = 0; }
    this.events.push({ t: 'mobDie', x: m.x, y: m.y, boss: def.brain === 'boss', elite: m.elite, kind: m.kind });
    this.events.push({ t: 'xp', n: Math.round(mobXp(m.kind, m.lv) * (m.elite ? ELITE.xp : 1)) });
    const cr = Math.round(mobCrumbs(m.lv, def.brain) * (m.elite ? 4 : 1) * (0.8 + this.rand() * 0.4) * (h.d.uniques.includes('lucky') ? 1.5 : 1));
    if (h.d.uniques.includes('hourglass')) for (let i = 0; i < 4; i++) h.cds[i] = Math.max(0, h.cds[i] - 1);
    if (h.d.procs.includes('snack') && h.state !== 'down') h.hp = Math.min(h.d.maxHp, h.hp + h.d.maxHp * 0.03);
    const crm = h.d.procs.includes('magnet') ? Math.round(cr * 1.25) : cr;
    this.run.crumbs += crm;
    this.events.push({ t: 'crumbs', n: crm, x: m.x, y: m.y - def.h });
    const st = def.brain === 'boss' ? 3 : m.elite ? 2 : this.rand() < 0.07 ? 1 : 0;
    if (st) { this.run.stones += st; this.events.push({ t: 'stone', n: st, x: m.x, y: m.y - def.h - 14 }); }
    if (h.d.lifeOnKill > 0) h.hp = Math.min(h.d.maxHp, h.hp + h.d.maxHp * h.d.lifeOnKill);
    const drops = def.brain === 'boss' ? 3 : m.elite || def.brain === 'mimic' ? 2 : this.rand() < def.dropChance * (this.variant === 'night' ? 1.4 : 1) ? 1 : 0;
    for (let i = 0; i < drops; i++) {
      const big = def.brain === 'boss' || m.elite || def.brain === 'mimic';
      const tier = Math.max(def.brain === 'boss' ? 3 : def.brain === 'mimic' ? 3 : m.elite ? 2 : 1, rollTier(dropLevel(m.lv) + (big ? 2 : 0), this.rand)) as BoxTier;
      for (let o = 0; o < this.humans; o++) {
        const b: Box = { id: nextId++, tier, ilvl: m.lv, x: m.x + (i - (drops - 1) / 2) * 50 + o * 14, y: m.y - 20, vy: -420 - i * 60, ground: false, t: 0, owner: o };
        this.boxes.push(b);
        if (o === 0) this.events.push({ t: 'drop', id: b.id, tier, x: b.x, y: b.y });
      }
    }
  }

  // ---------- monsters ----------
  private stepMob(m: Mob, dt: number): void {
    const def = MOBS[m.kind], h = this.hero;
    m.t += dt; m.flash = Math.max(0, m.flash - dt); m.hurtShown = Math.max(0, m.hurtShown - dt); m.slow = Math.max(0, m.slow - dt);
    if (m.state === 'dead') { m.deadT += dt; m.vx *= 0.96; this.physics(m, dt, MAX_FALL, false); return; }
    m.shellT = Math.max(0, m.shellT - dt); m.guardT = Math.max(0, m.guardT - dt); m.tired = Math.max(0, m.tired - dt);
    if (m.weak > 0 && (m.weak -= dt) <= 0) { m.weak = 0; m.armor = 1; } // armour grows back
    if (m.burn > 0) {
      m.burn -= dt; m.burnT -= dt;
      if (m.burnT <= 0) {
        m.burnT = 0.5; const d = Math.max(1, Math.round(m.burnDmg)); m.hp -= d; m.flash = 0.06; this.dealt += d;
        this.events.push({ t: 'hit', x: m.x, y: m.y - def.h * 0.6, dmg: d, crit: false, target: 'mob' });
        if (m.hp <= 0) { this.killMob(m); return; }
      }
    }
    if (m.glued > 0) { m.glued -= dt; m.vx = 0; if (def.brain !== 'flyer') this.physics(m, dt, MAX_FALL, false); return; } // stuck in mustard
    if (m.frozen > 0) { // frozen solid: no thinking, no moving
      m.frozen -= dt; m.vx = 0;
      if (def.brain !== 'flyer') this.physics(m, dt, MAX_FALL, false);
      return;
    }
    if (def.brain === 'flyer') { this.stepFlyer(m, dt); return; }
    const fast = (m.mods.includes('hasty') ? 1.35 : 1) * (m.enraged ? 1.15 : 1);
    if (m.mods.includes('moldy') && m.ground && m.state === 'walk' && (m.dropT -= dt) <= 0 && this.puddles.length < 30) { m.dropT = 1.3; this.puddles.push({ x: m.x, y: m.y, t: 6 }); }
    const dx = h.x - m.x;
    if (m.disguised) { // sits still as a loot box until you come close
      m.vx = 0; this.physics(m, dt, MAX_FALL, false);
      if (h.state !== 'down' && Math.abs(dx) < 95 && Math.abs(h.y - m.y) < 40) { m.disguised = false; m.face = dx > 0 ? 1 : -1; m.state = 'windup'; m.t = 0; m.move = 'walker'; this.events.push({ t: 'mimic', id: m.id }); }
      return;
    }
    const ranged = def.brain === 'ranged' || def.brain === 'healer' || def.brain === 'sniper' || def.brain === 'summoner';
    const sameLevel = Math.abs(h.y - m.y) < (ranged ? 70 : 40);
    const heroOk = h.state !== 'down';
    if (def.nem?.fly) { this.stepNemFly(m, dt, fast); return; }
    if (def.nem?.trail && m.ground && Math.abs(m.vx) > 10 && (m.dropT -= dt) <= 0 && this.puddles.length < 40) { m.dropT = 0.45; this.puddles.push({ x: m.x, y: m.y, t: 5, kind: 'slow' }); }
    const chase = heroOk && (def.brain === 'boss' || def.brain === 'nemesis' || (sameLevel && Math.abs(dx) < def.aggro) || (def.brain === 'turret' && Math.abs(dx) < def.aggro && Math.abs(h.y - m.y) < 260));
    // a surfaced burrower digs back down after a while
    if (def.brain === 'burrower' && !m.under && m.state === 'walk' && m.ground && (m.surfT += dt) > 3) { m.under = true; m.surfT = 0; this.events.push({ t: 'burrow', x: m.x, y: m.y, up: false }); }

    switch (m.state) {
      case 'walk': {
        let dir: number;
        const melee = !ranged && def.brain !== 'turret' && def.brain !== 'boss' && def.brain !== 'nemesis' && !m.under;
        const waiting = melee && this.attackers(m.tgt) >= this.maxAttackers; // not my turn: hang back and circle
        if (chase) {
          dir = Math.sign(dx);
          if (ranged && Math.abs(dx) < (def.brain === 'sniper' ? 200 : 150)) dir = -dir; // keep its distance
          if (melee) {
            // flank: head for whichever side of you has fewer monsters on it
            if (Math.floor(this.time) !== Math.floor(this.time - dt)) m.flank = this.flankSide(m);
            const tx = h.x + m.flank * (waiting ? def.range + 60 : def.range * 0.7);
            dir = Math.abs(tx - m.x) < 10 ? 0 : Math.sign(tx - m.x);
            // bodyguards: shield carriers stand between you and a healer
            const healer = (def.shield || m.mods.includes('shielded')) ? this.mobs.find(o => o.state !== 'dead' && MOBS[o.kind].brain === 'healer' && Math.abs(o.x - m.x) < 350) : undefined;
            if (healer) { const gx = healer.x + Math.sign(h.x - healer.x || 1) * 70; dir = Math.abs(gx - m.x) < 10 ? 0 : Math.sign(gx - m.x); }
          }
        } else {
          dir = Math.sin(m.t * 0.7 + m.id) > 0 ? 1 : -1;
          if (Math.abs(m.x - m.home) > def.patrol) dir = Math.sign(m.home - m.x);
        }
        if (m.on !== null && m.on >= 0) {
          const p = this.stage.platforms[m.on];
          if ((dir < 0 && m.x - 20 < p.x) || (dir > 0 && m.x + 20 > p.x + p.w)) dir = 0;
        }
        if (def.brain === 'turret' || m.tired > 0) dir = 0;
        m.vx = approach(m.vx, dir * (chase ? def.speed * (def.brain === 'bomber' ? 1.6 : m.under ? 1.5 : 1.4) : def.speed) * (m.slow > 0 ? 0.6 : 1) * fast, 800 * dt);
        if (chase) m.face = dx > 0 ? 1 : -1; else if (dir) m.face = dir > 0 ? 1 : -1;
        const onMySide = !melee || Math.sign(m.x - h.x) === m.flank || m.t > 2.5; // flankers get round you before attacking
        if (chase && m.ground && m.t > (m.elite ? 1.4 : 0.4) && !waiting && onMySide) { // elites leave an opening after each attack; others wait their turn
          const near = Math.abs(dx) < def.range;
          if (def.brain === 'boss') this.bossThink(m, dx);
          else if (def.brain === 'nemesis') this.nemThink(m, dx);
          else if (NEW_BRAINS.has(def.brain)) this.mobDecide(m, dx);
          else if (near && (def.brain !== 'ranged' || Math.abs(dx) > 90 || m.t > 2)) { m.state = 'windup'; m.t = 0; m.vx = def.brain === 'bomber' ? m.vx * 0.3 : 0; m.move = def.brain; }
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
        const wind = (m.move === 'charge' ? 0.8 : m.move === 'leap' ? 0.55 : m.move === 'rain' || m.move === 'breath' ? 0.8 : def.windup) * TUNE.windup / fast * (m.move === 'brute' && m.elite ? 1.3 : 1) * (this.nightmare ? 0.72 : 1); // red elite slams wind up longer: time to see it and dodge
        if (m.move === 'snipe' && m.t < wind - 0.3) { m.aimX = h.x; m.aimY = h.y - 40; } // the laser tracks you, then locks
        if (m.move === 'beam' && m.t < wind - 0.3) { m.aimX = m.x + m.face * 700; m.aimY = h.y - 40; }
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
        if (!m.hitDone && Math.abs(h.x - m.x) < 32 && m.y > h.y - 80 && m.y < h.y + 10) { m.hitDone = true; this.hurtHero(m.atk, Math.sign(m.vx) || 1, m); }
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
    const pats = BOSS_PATTERNS[m.kind];
    let move: string;
    if (pats) {
      // a fixed string of moves: close or far one depending on where you stand, taking turns between the two of each
      if (!m.queue.length) {
        const p = pats[Math.min(pats.length, m.bossPhase) - 1];
        const list = Math.abs(dx) < 170 ? p.near : p.far;
        m.queue = [...list[m.patI++ % list.length]];
      }
      move = m.queue[0];
      if (move === 'slash' && Math.abs(dx) > 170) return; // walk closer first
      m.queue.shift();
    } else {
      const moves = MOBS[m.kind].moves ?? ['slash'];
      move = Math.abs(dx) < 150 ? 'slash' : moves[Math.floor(this.rand() * moves.length)];
      if (move === 'slash' && Math.abs(dx) > 170) return;
    }
    m.state = 'windup'; m.t = 0; m.vx = 0; m.move = move;
    m.face = dx > 0 ? 1 : -1;
    this.events.push({ t: 'mobAttack', id: m.id, kind: move });
  }

  /** Monsters currently winding up or attacking you (bosses and nemeses don't wait in line). */
  private attackers(tgt = 0): number {
    let n = 0;
    for (const o of this.mobs) if (o.tgt === tgt && (o.state === 'windup' || o.state === 'attack') && MOBS[o.kind].brain !== 'boss' && MOBS[o.kind].brain !== 'nemesis') n++;
    return n;
  }
  /** Melee monsters near you split up: alternate ones take your left and your right. */
  private flankSide(m: Mob): 1 | -1 {
    const h = this.hero;
    const pack = this.mobs.filter(o => o.state !== 'dead' && !o.under && Math.abs(o.x - h.x) < 400 && Math.abs(o.y - h.y) < 60 && MOBS[o.kind].brain !== 'boss' && MOBS[o.kind].brain !== 'nemesis').sort((a, b) => a.id - b.id);
    if (pack.length < 2) return m.x < h.x ? -1 : 1;
    const first: 1 | -1 = pack[0].x < h.x ? -1 : 1; // the first keeps its side, the next goes round the back, and so on
    return (pack.indexOf(m) % 2 === 0 ? first : -first) as 1 | -1;
  }

  /** Attack choice for the newer brains. */
  private mobDecide(m: Mob, dx: number): void {
    const def = MOBS[m.kind], ad = Math.abs(dx);
    const go = (move: string) => { m.state = 'windup'; m.t = 0; m.vx = 0; m.move = move; m.face = dx > 0 ? 1 : -1; this.events.push({ t: 'mobAttack', id: m.id, kind: move }); };
    switch (def.brain) {
      case 'healer': {
        const hurt = this.mobs.some(o => o !== m && o.state !== 'dead' && !o.under && o.hp < o.maxHp * 0.85 && Math.abs(o.x - m.x) < 260 && Math.abs(o.y - m.y) < 120);
        if (hurt && m.t > 2) go('heal'); else if (ad < def.range && ad > 90 && m.t > 1.8) go('ranged');
        break;
      }
      case 'summoner': {
        const kids = this.mobs.filter(o => o.parent === m.id && o.state !== 'dead').length;
        if (kids < 3 && m.t > 1.6 && ad < def.range) go('call'); else if (ad < 80) go('walker');
        break;
      }
      case 'charger': if (ad < def.range && ad > 70 && m.t > 0.9) go('rush'); else if (ad <= 70) go('walker'); break;
      case 'sniper': if (ad < def.range && ad > 110 && m.t > 1.3) { go('snipe'); m.aimX = this.hero.x; m.aimY = this.hero.y - 40; } else if (ad <= 110 && m.t > 1.5) go('walker'); break;
      case 'turret': if (ad < def.range && m.t > 3.5) go('lob'); break;
      case 'burrower': if (m.under ? ad < 34 : ad < def.range + 24) go(m.under ? 'pop' : 'walker'); break;
      case 'mimic': if (ad < def.range) go('walker'); break;
    }
  }

  /** Nemesis: pick one of this world's moves that fits the distance. */
  private nemThink(m: Mob, dx: number): void {
    const def = MOBS[m.kind], ad = Math.abs(dx), h = this.hero;
    const kids = this.mobs.filter(o => o.parent === m.id && o.state !== 'dead').length;
    const ok = (mv: NemMove) => {
      switch (mv) {
        case 'slash': case 'spin': return ad < 150;
        case 'roar': case 'lure': return ad < 260;
        case 'skewer': return ad < 300;
        case 'yank': return ad > 110 && ad < 340;
        case 'scurry': return ad < 320;
        case 'zip': return ad < 360;
        case 'swipe': return ad < 200;
        case 'boomhop': return ad < 420;
        case 'haymaker': return ad < 190;
        case 'vanish': return ad > 120;
        case 'summon': return kids < 3;
        case 'shell': return m.shellT <= 0;
        case 'beam': return Math.abs(h.y - m.y) < 120;
        default: return true;
      }
    };
    const all = nemesisMoves(m.kind, m.phase);
    // learnable: goes through its moves in order (skipping ones that don't fit the distance), then catches its breath
    if (m.patI > 0 && m.patI % all.length === 0 && m.queue[0] !== 'rested') { m.queue = ['rested']; this.tire(m, m.bossPhase === 3 ? 0.9 : 1.4); return; }
    m.queue = [];
    let mv: NemMove | undefined;
    for (let k = 0; k < all.length && !mv; k++) { const c = all[(m.patI + k) % all.length]; if (ok(c)) { mv = c; m.patI += k + 1; } }
    if (!mv) return; // walk closer
    m.state = 'windup'; m.t = 0; m.vx = 0; m.move = mv; m.face = dx > 0 ? 1 : -1;
    const i = def.nem!.moves.indexOf(mv);
    this.events.push({ t: 'mobAttack', id: m.id, kind: mv });
    this.events.push({ t: 'nemesisMove', name: def.name, move: def.nem!.names[i] ?? mv });
  }

  /** Crustwing: hovers out of reach, then dives / snatches / scatters crumbs. */
  private stepNemFly(m: Mob, dt: number, fast: number): void {
    const def = MOBS[m.kind], h = this.hero, dx = h.x - m.x;
    const hoverY = m.homeY - 110 + Math.sin(this.time * 2) * 10;
    switch (m.state) {
      case 'walk': {
        const tx = h.x - Math.sign(dx || 1) * 160;
        m.vx = approach(m.vx, clamp((tx - m.x) * 2, -def.speed, def.speed) * fast, 600 * dt);
        m.vy = approach(m.vy, (hoverY - m.y) * 3, 900 * dt);
        m.face = dx > 0 ? 1 : -1;
        if (h.state !== 'down' && m.t > 1.4 / fast) this.nemThink(m, dx);
        break;
      }
      case 'windup':
        m.vx = approach(m.vx, 0, 800 * dt); m.vy = approach(m.vy, -40, 400 * dt);
        if (m.t > def.windup * TUNE.windup / fast) {
          m.state = 'attack'; m.t = 0; m.hitDone = false;
          if (m.move === 'dive' || m.move === 'snatch') { const ty = h.y - 30, d = Math.hypot(h.x - m.x, ty - m.y) || 1; m.vx = (h.x - m.x) / d * 480; m.vy = (ty - m.y) / d * 480; }
          else this.beginAttack(m);
        }
        break;
      case 'attack':
        if (m.move === 'dive' || m.move === 'snatch') {
          if (!m.hitDone && Math.abs(h.x - m.x) < 40 && m.y > h.y - 90 && m.y < h.y + 10) {
            m.hitDone = true;
            if (m.move === 'snatch' && m.stolen < 0 && h.inv <= 0 && !this.canPerfect()) {
              const i = h.bag.findIndex(b => b && b.n > 0);
              if (i >= 0) { h.bag[i]!.n--; m.stolen = i; this.events.push({ t: 'steal', name: CONSUMABLES[h.bag[i]!.id].name }); }
            }
            this.hurtHero(m.move === 'snatch' ? Math.round(m.atk * 0.6) : m.atk, Math.sign(m.vx) || 1, m);
          }
          if (m.t > 0.8) { m.state = 'stagger'; m.t = 0; } // lands to catch its breath: your chance to hit it
        } else if (m.t > 0.6) this.endAttack(m);
        break;
      case 'stagger': // resting on the floor
        m.vx = approach(m.vx, 0, 900 * dt); m.vy = approach(m.vy, 500, 1500 * dt);
        if (m.t > 1.5) { m.state = 'walk'; m.t = 0; }
        break;
      default:
        m.vx = approach(m.vx, 0, 600 * dt); m.vy = approach(m.vy, 0, 900 * dt);
        if (m.t > 0.4) { m.state = 'walk'; m.t = 0; }
    }
    m.x = clamp(m.x + m.vx * dt, 20, this.stage.width - 20);
    m.y = Math.min(m.y + m.vy * dt, m.state === 'stagger' ? m.homeY : m.homeY - 16);
    m.ground = m.state === 'stagger' && m.y >= m.homeY; m.on = m.ground ? -1 : null;
  }

  /** A monster projectile (nemesis shots use their own look). */
  private mobShot(m: Mob, x: number, y: number, vx: number, vy: number, dmg: number, g = 300, kind?: string): void {
    this.shots.push({ id: nextId++, x, y, vx, vy, t: 0, dmg, hit: new Set(), from: 'mob', kx: 200, ky: -200, pierce: false, g, kind: kind ?? MOBS[m.kind].nem?.shot });
  }

  private beginAttack(m: Mob): void {
    const h = this.hero, def = MOBS[m.kind];
    switch (m.move) {
      case 'fanshot':
        for (let i = 0; i < 5; i++) { const a = (i / 4 - 0.5) * 0.6; this.mobShot(m, m.x + m.face * 30, m.y - def.h * 0.6, m.face * 420 * Math.cos(a), 420 * Math.sin(a), Math.round(m.atk * 0.7), 200); }
        break;
      case 'rootspike': case 'heatwave': // travels along the floor: jump over it
        for (const d of m.move === 'heatwave' ? [-1, 1] : [m.face]) this.mobShot(m, m.x + d * 40, m.y - 12, d * 330, 0, m.atk, 0, m.move === 'heatwave' ? 'heat' : 'spike');
        break;
      case 'puddle': {
        const kind = def.nem?.puddle ?? 'slow';
        for (let i = 0; i < 3; i++) {
          const T = 0.8, tx = h.x + (i - 1) * 90, sx = m.x + m.face * 20, sy = m.y - def.h * 0.7;
          this.shots.push({ id: nextId++, x: sx, y: sy, vx: (tx - sx) / T, vy: (h.y - sy - 0.5 * 900 * T * T) / T, t: 0, dmg: Math.round(m.atk * 0.5), hit: new Set(), from: 'mob', kx: 60, ky: -80, pierce: false, g: 900, kind: 'puddle-' + kind });
        }
        break;
      }
      case 'trap':
        for (const off of [-70, 70]) this.puddles.push({ x: clamp(h.x + off, 30, this.stage.width - 30), y: h.y, t: 12, kind: 'trap', dmg: m.atk, w: 40 });
        break;
      case 'summon': // reuses the summoner call
        if (this.mobs.filter(o => o.parent === m.id && o.state !== 'dead').length >= 4) break;
        this.events.push({ t: 'summon' });
        for (const off of [-60, 60]) { const c = this.spawnMob(def.nem?.calls ?? def.calls ?? 'bun', clamp(m.x + off, 30, this.stage.width - 30), Math.max(1, m.lv - 3), m.on !== null && m.on >= 0 ? m.y : undefined); c.parent = m.id; c.vy = -380; c.vx = off * 3; c.ground = false; c.on = null; c.state = 'hurt'; c.t = 0; c.under = false; }
        break;
      case 'boomerang': {
        const sx = m.x + m.face * 30;
        this.shots.push({ id: nextId++, x: sx, y: m.y - def.h * 0.55, vx: m.face * 460, vy: 0, t: 0, dmg: m.atk, hit: new Set(), from: 'mob', kx: 200, ky: -200, pierce: true, g: 0, kind: 'ring', tx: sx });
        break;
      }
      case 'roar':
        this.events.push({ t: 'shock', x: m.x, y: m.y, r: 240 });
        if (Math.abs(h.x - m.x) < 240 && Math.abs(h.y - m.y) < 120) { this.hurtHero(Math.round(m.atk * 0.6), Math.sign(h.x - m.x) || 1, m); if (h.state !== 'down') h.vx = Math.sign(h.x - m.x || 1) * 520; }
        break;
      case 'vanish': // smoke, then appear behind you
        this.events.push({ t: 'boom', x: m.x, y: m.y });
        m.x = clamp(h.x - h.face * 70, 30, this.stage.width - 30); m.y = h.ground ? h.y : m.y; m.face = h.x > m.x ? 1 : -1;
        this.events.push({ t: 'boom', x: m.x, y: m.y });
        break;
      case 'shell': m.shellT = 4; break;
      case 'scurry': m.vx = m.face * 720; m.hitDone = false; break;
      case 'drip': for (const off of [-70, 0, 70]) this.puddles.push({ x: clamp(h.x + off, 30, this.stage.width - 30), y: h.y, t: 4, kind: 'slick', w: 60 }); this.events.push({ t: 'shock', x: h.x, y: h.y, r: 60 }); break;
      case 'swipe': m.aimY = 0; break;
      case 'zip': m.vx = m.face * 880; m.hitDone = false; m.aimY = 0; break;
      case 'boomhop': m.vy = -820; m.vx = clamp((h.x - m.x) * 1.3, -520, 520); m.ground = false; m.on = null; m.hitDone = false; break;
      case 'haymaker': m.hitDone = false; break;
      case 'yank': // El Nacho scoops you toward him like a chip in dip
        if (Math.abs(h.x - m.x) < 360 && Math.abs(h.y - m.y) < 120 && h.state !== 'down' && h.inv <= 0) { h.vx = Math.sign(m.x - h.x) * 640; h.vy = -180; h.ground = false; h.on = null; this.events.push({ t: 'shock', x: h.x, y: h.y, r: 50 }); }
        break;
      case 'stingers': // three stingers aimed at you
        for (const a of [-0.18, 0, 0.18]) { const sx = m.x + m.face * 20, sy = m.y - def.h * 0.5, ang = Math.atan2(h.y - 40 - sy, h.x - sx) + a; this.shots.push({ id: nextId++, x: sx, y: sy, vx: Math.cos(ang) * 560, vy: Math.sin(ang) * 560, t: 0, dmg: Math.round(m.atk * 0.7), hit: new Set(), from: 'mob', kx: 160, ky: -140, pierce: false, g: 0, kind: 'knife' }); }
        break;
      case 'burrow': m.under = true; this.events.push({ t: 'burrow', x: m.x, y: m.y, up: false }); break;
      case 'skewer': m.vx = m.face * 320; break;
      case 'slimesurge': m.vx = m.face * 430; m.dropT = 0; break;
      case 'finslide': m.under = true; m.vx = m.face * 500; this.events.push({ t: 'burrow', x: m.x, y: m.y, up: false }); break;
      case 'heal':
        for (const o of this.mobs) if (o.state !== 'dead' && !o.under && Math.abs(o.x - m.x) < 260 && Math.abs(o.y - m.y) < 120 && o.hp < o.maxHp) {
          const n = Math.round(o.maxHp * 0.16); o.hp = Math.min(o.maxHp, o.hp + n); this.events.push({ t: 'heal', x: o.x, y: o.y - MOBS[o.kind].h, n });
        }
        break;
      case 'call':
        this.events.push({ t: 'summon' });
        for (const off of [-50, 50]) {
          const c = this.spawnMob(def.calls ?? 'minicheerio', clamp(m.x + off, 30, this.stage.width - 30), Math.max(1, m.lv - 2), m.on !== null && m.on >= 0 ? m.y : undefined);
          c.parent = m.id; c.vy = -420; c.vx = off * 4; c.ground = false; c.on = null; c.state = 'hurt'; c.t = 0;
        }
        break;
      case 'rush': m.vx = m.face * 540; break;
      case 'snipe': {
        const sx = m.x + m.face * 22, sy = m.y - def.h * 0.7, d = Math.hypot(m.aimX - sx, m.aimY - sy) || 1;
        this.shots.push({ id: nextId++, x: sx, y: sy, vx: (m.aimX - sx) / d * 900, vy: (m.aimY - sy) / d * 900, t: 0, dmg: m.atk, hit: new Set(), from: 'mob', kx: 220, ky: -160, pierce: false, g: 0, kind: 'laser' });
        break;
      }
      case 'lob': { // steam arcs over platforms to land where you stand
        const T = 0.95, g = 900, sx = m.x + m.face * 24, sy = m.y - 44, tx = h.x + (this.rand() - 0.5) * 120; // a little scatter: it's a kettle, not a sniper
        this.shots.push({ id: nextId++, x: sx, y: sy, vx: (tx - sx) / T, vy: ((h.y - 30) - sy - 0.5 * g * T * T) / T, t: 0, dmg: m.atk, hit: new Set(), from: 'mob', kx: 160, ky: -200, pierce: false, g, kind: 'steam', tx, ty: h.y });
        break;
      }
      case 'pop': m.under = false; m.surfT = 0; m.vy = -600; m.ground = false; m.on = null; this.events.push({ t: 'burrow', x: m.x, y: m.y, up: true }); break;
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
      case 'breath': // a cone of fire from the mouth
        for (let i = 0; i < 7; i++) {
          const a = (i / 6 - 0.5) * 0.6, sp = 360 + this.rand() * 80;
          this.shots.push({ id: nextId++, x: m.x + m.face * 60 * Math.min(1, def.h / 170), y: m.y - def.h * 0.7, vx: m.face * sp * Math.cos(a), vy: sp * Math.sin(a) + 60, t: -i * 0.04, dmg: Math.round(m.atk * 0.8), hit: new Set(), from: 'mob', kx: 160, ky: -180, pierce: false, g: 120, kind: 'fire' });
        }
        break;
      case 'rain': // icicles (or embers) fall over the hero
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
      case 'heal': case 'call': case 'snipe': case 'lob': case 'fanshot': case 'rootspike': case 'heatwave': case 'puddle': case 'trap': case 'summon': case 'boomerang': case 'roar': case 'shell': case 'yank': case 'stingers':
        if (m.t > 0.5) this.endAttack(m);
        break;
      case 'drip': // Grey Gelato: three snooty drips land around you (slippery)
        if (m.t > 0.5) this.endAttack(m);
        break;
      case 'swipe': // Grizzly Grizzle: two big swipes
        if (m.aimY < 1 && m.t > 0.1) { m.aimY = 1; if (touch(def.range + 50, 100)) this.hurtHero(Math.round(m.atk * 0.8), m.face, m); }
        if (m.aimY < 2 && m.t > 0.34) { m.aimY = 2; if (touch(def.range + 50, 100)) this.hurtHero(Math.round(m.atk * 0.9), m.face, m); }
        if (m.t > 0.55) this.endAttack(m);
        break;
      case 'zip': // Jitters zips past you and straight back again
        if (!m.hitDone && touch(40, 80)) { m.hitDone = true; this.hurtHero(Math.round(m.atk * 0.7), Math.sign(m.vx) || m.face, m); }
        if (m.t > 0.28 && m.aimY === 0) { m.aimY = 1; m.vx = -m.vx; m.hitDone = false; }
        if (m.t > 0.58) { m.vx = 0; this.endAttack(m); }
        break;
      case 'boomhop': // Hot Fudge Hare: a huge hop that lands with a boom
        if (!m.hitDone && m.t > 0.25 && m.ground) {
          m.hitDone = true; this.events.push({ t: 'shock', x: m.x, y: m.y, r: 140 });
          if (Math.abs(h.x - m.x) < 140 && Math.abs(h.y - m.y) < 90) { this.hurtHero(Math.round(m.atk * 1.2), Math.sign(h.x - m.x) || 1, m); if (h.state !== 'down') { h.vy = -420; h.ground = false; h.on = null; } }
        }
        if ((m.hitDone && m.t > 0.45) || m.t > 1.8) { m.vx = 0; this.endAttack(m); }
        break;
      case 'scurry': // Brittle darts right past you, nipping on the way
        if (!m.hitDone && touch(40, 80)) { m.hitDone = true; this.hurtHero(Math.round(m.atk * 0.8), m.face, m); }
        if (m.t > 0.55) { m.vx = 0; this.endAttack(m); }
        break;
      case 'haymaker': // Rocky Road's big one: huge knockback
        if (!m.hitDone && m.t > 0.08) { m.hitDone = true; if (touch(def.range + 40, 90)) { this.hurtHero(Math.round(m.atk * 1.6), m.face, m); if (h.state !== 'down') { h.vx = m.face * 720; h.vy = -420; h.ground = false; h.on = null; } } }
        if (m.t > 0.5) this.endAttack(m);
        break;
      case 'vanish': // the backstab right after appearing
        if (!m.hitDone && m.t > 0.12) { m.hitDone = true; if (touch(def.range + 30, 120)) this.hurtHero(m.atk, m.face, m); }
        if (m.t > 0.6) this.endAttack(m);
        break;
      case 'spin': { // whirls toward you, hitting every 0.3 s
        m.vx = approach(m.vx, Math.sign(h.x - m.x) * 140, 800 * dt);
        if (m.t - m.aimX > 0.3 && Math.abs(h.x - m.x) < def.w / 2 + 50 && Math.abs(h.y - m.y) < 90) { m.aimX = m.t; this.hurtHero(Math.round(m.atk * 0.6), Math.sign(h.x - m.x) || 1, m); }
        if (m.t > 1.2) { m.aimX = 0; this.endAttack(m); }
        break;
      }
      case 'beam': // a long line along the locked aim
        if (!m.hitDone && m.t > 0.05) {
          m.hitDone = true;
          const lo = Math.min(m.x, m.aimX), hi = Math.max(m.x, m.aimX);
          if (h.x > lo && h.x < hi && Math.abs((h.y - 40) - m.aimY) < 34) this.hurtHero(Math.round(m.atk * 1.1), m.face, m);
        }
        if (m.t > 0.45) this.endAttack(m);
        break;
      case 'lure': // drags you toward the lamp, then zaps if you're close
        if (h.state !== 'dodge' && h.state !== 'down' && Math.abs(h.x - m.x) > 50) h.x -= Math.sign(h.x - m.x) * 170 * dt;
        if (m.t > 1.0) { if (Math.abs(h.x - m.x) < 90) this.hurtHero(m.atk, Math.sign(h.x - m.x) || 1, m); this.events.push({ t: 'shock', x: m.x, y: m.y - 30, r: 90 }); this.endAttack(m); }
        break;
      case 'burrow': // tunnels to you, then erupts
        m.vx = Math.sign(h.x - m.x) * 300;
        if (Math.abs(h.x - m.x) < 30 || m.t > 1.6) { m.move = 'pop'; m.t = 0; m.hitDone = false; m.under = false; m.vy = -650; m.ground = false; m.on = null; this.events.push({ t: 'burrow', x: m.x, y: m.y, up: true }); }
        break;
      case 'slimesurge': // belly-slide on its own slime, laying a long trail
        if ((m.dropT -= dt) <= 0 && this.puddles.length < 50) { m.dropT = 0.1; this.puddles.push({ x: m.x, y: m.y, t: 5, kind: 'slow' }); }
        if (!m.hitDone && touch(def.w * 0.6, 70)) { m.hitDone = true; this.hurtHero(m.atk, m.face, m); }
        if (m.t > 0.9 || m.x <= 40 || m.x >= this.stage.width - 40) { m.vx = approach(m.vx, 0, 3000 * dt); if (Math.abs(m.vx) < 5) this.endAttack(m); }
        break;
      case 'skewer': // long thrust
        if (!m.hitDone && m.t > 0.06) { m.hitDone = true; if (touch(280, 100)) this.hurtHero(Math.round(m.atk * 1.3), m.face, m); }
        m.vx = approach(m.vx, 0, 1400 * dt);
        if (m.t > 0.6) this.endAttack(m);
        break;
      case 'finslide': // a fin cutting along the floor, then a jump out
        if (!m.hitDone && touch(def.w * 0.6, 70)) { m.hitDone = true; this.hurtHero(m.atk, m.face, m); if (this.hero.state !== 'down') this.hero.vy = -520; }
        if (m.t > 1.0 || m.x <= 40 || m.x >= this.stage.width - 40) { m.under = false; m.vy = -480; m.ground = false; m.on = null; m.vx *= 0.3; this.endAttack(m); this.events.push({ t: 'burrow', x: m.x, y: m.y, up: true }); }
        break;
      case 'rush': {
        if (!m.hitDone && touch(def.w * 0.7, 90)) { m.hitDone = true; this.hurtHero(m.atk, m.face, m); }
        const wall = m.x <= 40 || m.x >= this.stage.width - 40;
        if (m.hitDone) { m.vx = approach(m.vx, 0, 2000 * dt); if (Math.abs(m.vx) < 5) this.endAttack(m); }
        else if (m.t > 1.1 || wall) { m.state = 'stagger'; m.t = 0.4; m.vx = 0; } // missed: dizzy for a second, takes extra damage
        break;
      }
      case 'pop':
        if (!m.hitDone && m.t < 0.35 && touch(60, 100)) { m.hitDone = true; this.hurtHero(m.atk, Math.sign(h.x - m.x) || 1, m); }
        if (m.ground && m.t > 0.2) this.endAttack(m);
        break;
      case 'walker':
        m.vx = approach(m.vx, 0, 900 * dt);
        if (m.t < 0.2 && touch(56)) this.hurtHero(m.atk, m.face, m);
        if (m.t > 0.5) this.endAttack(m);
        break;
      case 'hopper':
        if (!m.ground && touch(40)) this.hurtHero(m.atk, m.face, m);
        if (m.ground && m.t > 0.15) { m.vx = approach(m.vx, 0, 1600 * dt); if (m.t > 0.6) this.endAttack(m); }
        break;
      case 'ranged':
        if (m.t > 0.5) this.endAttack(m);
        break;
      case 'bomber':
        if (!m.hitDone) {
          m.hitDone = true;
          this.events.push({ t: 'boom', x: m.x, y: m.y });
          this.events.push({ t: 'shock', x: m.x, y: m.y, r: 95 });
          if (Math.abs(h.x - m.x) < 95 && Math.abs(h.y - m.y) < 80) this.hurtHero(m.atk, Math.sign(h.x - m.x) || 1, m);
          this.killMob(m);
        }
        break;
      case 'brute':
        if (!m.hitDone && m.t > 0.1) { m.hitDone = true; this.events.push({ t: 'shock', x: m.x + m.face * 50, y: m.y, r: 70 }); if (touch(110, 80)) this.hurtHero(m.atk, m.face, m); }
        if (m.t > 0.7) this.endAttack(m);
        break;
      case 'charge':
        if (touch(def.w * 0.6, 100)) this.hurtHero(m.atk, m.face, m);
        if (m.t > 1.3 || m.x <= 40 || m.x >= this.stage.width - 40) { m.vx = approach(m.vx, 0, 2400 * dt); if (Math.abs(m.vx) < 5) this.endAttack(m); }
        break;
      case 'leap':
        if (m.ground && !m.hitDone && m.t > 0.1) {
          m.hitDone = true; m.vx = 0;
          this.events.push({ t: 'shock', x: m.x, y: m.y, r: 170 });
          if (Math.abs(h.x - m.x) < 170 && h.ground) this.hurtHero(Math.round(m.atk * 1.2), Math.sign(h.x - m.x) || 1, m);
        }
        if (m.hitDone && m.t > 0.9) this.endAttack(m);
        break;
      case 'rain': case 'breath':
        if (m.t > 0.9) this.endAttack(m);
        break;
      case 'slash':
        if (!m.hitDone && m.t > 0.08) { m.hitDone = true; if (touch(def.range + 20, 120)) this.hurtHero(Math.round(m.atk * 0.9), m.face, m); }
        if (m.t > 0.7) this.endAttack(m);
        break;
    }
  }

  private endAttack(m: Mob): void {
    m.state = 'walk'; m.t = 0; m.move = '';
    const brain = MOBS[m.kind].brain;
    if (brain === 'boss' && BOSS_PATTERNS[m.kind]) {
      if (m.queue.length) m.t = 0.3; // next move of the string comes quickly
      else this.tire(m, BOSS_ARMOR.tired);
    }
  }
  /** Out of breath: stands still, takes extra damage. */
  private tire(m: Mob, s: number): void {
    m.tired = s; m.t = -s + 0.4; m.vx = 0;
    this.events.push({ t: 'tired', x: m.x, y: m.y - MOBS[m.kind].h - 10 });
  }

/** A hit arriving early in a dodge roll counts as a perfect dodge (once per roll). */
  canPerfect(): boolean { const h = this.hero; return h.state === 'dodge' && !h.perfectDone && h.t < PERFECT_WIN + Math.min(0.08, h.d.dodge * 0.25); }

  private perfect(): void {
    const h = this.hero;
    h.perfectDone = true; h.counter = COUNTER_T; h.inv = Math.max(h.inv, 0.4);
    h.ult = Math.min(100, h.ult + 12);
    this.slowmo = SLOWMO_T;
    if (h === this.heroes[0]) { this.run.perfects++; this.addStyle('perfect', 18); }
    this.events.push({ t: 'perfect', x: h.x, y: h.y - 60 });
    if (h.d.procs.includes('quickdraw') && h.d.gear) { h.cds[3] = 0; this.events.push({ t: 'proc', name: 'Quick Draw!', x: h.x, y: h.y - 90 }); }
    if (h.d.procs.includes('jamtrap')) { const fl = this.floorBelow(h.x, h.y - 2, h.y + 400, false); this.mines.push({ id: nextId++, x: h.x, y: fl ? fl.y : h.y, t: 0, dmg: h.d.atk * 1.2, kx: 80, ky: -200, owner: h.idx, glue: true }); }
  }

  /** fixed = exact damage (hazards), not reduced by defence */
  private hurtHero(raw: number, dir: number, from?: Mob, fixed = false): void {
    const h = this.hero;
    if (this.canPerfect()) { this.perfect(); return; }
    if (h.inv > 0 || h.state === 'down') return;
    // Claw Counter stance: block it and snap back
    if (h.state === 'skill' && h.skill?.kind === 'counter' && !h.ticks) {
      h.ticks = 1; h.inv = 0.5;
      this.events.push({ t: 'block', x: h.x + h.face * 20, y: h.y - 50 });
      this.events.push({ t: 'shock', x: h.x + h.face * 50, y: h.y, r: h.skill.reach });
      this.hitBox(h.x + h.face * h.skill.reach / 2, h.y, h.skill.reach * 1.3, h.skill.h, h.skill.dmg * h.skillMul, true, { kx: h.skill.kx, ky: h.skill.ky, stun: 1 }, h.hitIds);
      return;
    }
    const dr = fixed ? 0 : 1 - (1 - h.d.dr) * (1 - (h.buff?.def ?? 0)) * (1 - (h.boosts.def?.[0] ?? 0));
    let dmg = Math.max(1, Math.round(raw * (1 - dr) * (fixed ? 1 : 0.9 + this.rand() * 0.2) * (this.spicy.includes('glass') ? 2 : 1)));
    if (h.shield > 0) { // Bubble Wrap soaks it first
      const soak = Math.min(h.shield, dmg); h.shield -= soak; dmg -= soak;
      if (h.shield <= 0) { h.shieldT = 0; this.events.push({ t: 'proc', name: 'Pop!', x: h.x, y: h.y - 90 }); }
      if (dmg <= 0) { h.inv = 0.5; this.events.push({ t: 'block', x: h.x, y: h.y - 50 }); return; }
    }
    if (h.d.procs.includes('meringue') && h.guardCd <= 0) { h.guardCd = 10; dmg = Math.max(1, Math.round(dmg / 2)); this.events.push({ t: 'proc', name: 'Meringue Guard!', x: h.x, y: h.y - 90 }); }
    h.hp -= dmg; h.inv = 0.9;
    if (h.d.procs.includes('popcorn') && h.popCd <= 0) {
      h.popCd = 4; this.events.push({ t: 'shock', x: h.x, y: h.y - 30, r: 110 }); this.events.push({ t: 'proc', name: 'Popcorn Burst!', x: h.x, y: h.y - 90 });
      for (const o of this.targetsNear(h.x, h.y, 110, 90)) this.damageMob(o, h.d.atk * 1.2, Math.sign(o.x - h.x) || 1, { kx: 180, ky: -260, stun: 0.4 }, true);
    }
    if (h.d.procs.includes('spikes') && h.spikeCd <= 0) {
      h.spikeCd = 3;
      for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; this.shots.push({ id: nextId++, x: h.x, y: h.y - 40, vx: Math.cos(a) * 480, vy: Math.sin(a) * 480, t: 0, dmg: h.d.atk * 0.7, hit: new Set(), from: 'hero', kx: 120, ky: -120, pierce: false, kind: 'quill', owner: h.idx }); }
    }
    if (h.d.procs.includes('bubble') && h.bubbleCd <= 0 && h.hp > 0 && h.hp < h.d.maxHp * 0.35) {
      h.bubbleCd = 25; h.shield = Math.round(h.d.maxHp * 0.25); h.shieldT = 6;
      this.events.push({ t: 'proc', name: 'Bubble Wrap!', x: h.x, y: h.y - 90 });
    }
    if (h === this.heroes[0]) this.style *= 0.5;
    if (from && from.mods.includes('vampiric') && from.state !== 'dead') { from.hp = Math.min(from.maxHp, from.hp + dmg * 3); this.events.push({ t: 'heal', x: from.x, y: from.y - MOBS[from.kind].h, n: dmg * 3 }); }
    if (from && from.state !== 'dead' && h.d.thorns > 0) { from.hp -= Math.max(1, Math.round(dmg * h.d.thorns)); from.flash = 0.1; if (from.hp <= 0) this.killMob(from); }
    if (from && from.state !== 'dead' && h.d.uniques.includes('thornlid')) { from.hp -= Math.max(1, Math.round(dmg * 0.3)); from.flash = 0.1; if (from.hp <= 0) this.killMob(from); }
    if (h.hp <= 0 && !h.phoenixUsed && h.d.uniques.includes('phoenix')) { h.phoenixUsed = true; h.hp = 1; h.inv = 2.5; this.events.push({ t: 'revive' }); return; }
    h.ult = Math.min(100, h.ult + 4);
    if (h === this.heroes[0]) { this.run.hitsTaken++; this.run.dmgTaken += dmg; }
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

  private stepShots(dt: number, mdt = dt): void {
    for (const s of this.shots) {
      // hero shots act for their owner; monster shots look for whichever hero they touch
      const h = this.cur = s.from === 'hero' ? this.heroes[s.owner ?? 0] ?? this.heroes[0] : this.heroes.find(o => Math.abs(o.x - s.x) < 22 && s.y > o.y - 70 && s.y < o.y + 4) ?? this.heroes[0];
      const sdt = s.from === 'mob' ? mdt : dt; // monster shots crawl in slow motion too
      s.t += sdt;
      if (s.t < 0) continue; // staggered (fire breath)
      s.x += s.vx * sdt; s.y += s.vy * sdt;
      if (s.from === 'mob') {
        s.vy += (s.g ?? 300) * sdt;
        if (s.kind === 'ring' && s.t > 0.55 && s.tx !== undefined) { s.vx = approach(s.vx, Math.sign(s.tx - s.x) * 520, 2200 * sdt); if (Math.abs(s.x - s.tx) < 20 && s.t > 0.9) { s.t = 99; continue; } }
        if (s.kind?.startsWith('puddle-') && s.vy > 0) {
          const f = this.floorBelow(s.x, s.y - s.vy * sdt, s.y, false);
          if (f) { this.puddles.push({ x: s.x, y: f.y, t: 5, kind: s.kind.slice(7) as 'slow', w: 90 }); s.t = 99; continue; }
        }
        if (Math.abs(h.x - s.x) < 22 && s.y > h.y - 70 && s.y < h.y + 4) {
          if (h.buff?.reflect) { // Leaf Shell: it bounces back as yours
            s.from = 'hero'; s.vx = -s.vx || h.face * 400; s.vy = -Math.abs(s.vy) * 0.3; s.g = undefined; s.t = 0; s.hit = new Set(); s.dmg = h.d.atk * 1.5; s.kind = 'reflect';
            this.events.push({ t: 'block', x: s.x, y: s.y });
            continue;
          }
          if (h.inv <= 0 || this.canPerfect()) { this.hurtHero(s.dmg, Math.sign(s.vx)); s.t = 99; }
        }
        continue;
      }
      if ((s.kind === 'boomerang' || s.kind === 'gearboom') && !s.back && s.t > 0.42) { s.back = true; s.hit = new Set(); } // comes back: hits again
      if (s.kind === 'gearburst' && s.t > 0.55) { s.t = 99; continue; } // the star doesn't fly forever
      if (s.back) { s.vx = approach(s.vx, Math.sign(h.x - s.x) * 700, 2600 * sdt); if (Math.abs(h.x - s.x) < 30 && Math.abs(h.y - 44 - s.y) < 60) { s.t = 99; continue; } }
      if (s.kind === 'homing') {
        const tgt = this.targetsNear(s.x, s.y, 700, 500)[0];
        if (tgt) { const tx = tgt.x - s.x, ty = tgt.y - MOBS[tgt.kind].h / 2 - s.y, d = Math.hypot(tx, ty) || 1; s.vx = approach(s.vx, tx / d * 560, 1800 * sdt); s.vy = approach(s.vy, ty / d * 560, 1800 * sdt); }
      }
      if (s.kind === 'twister') { // drags monsters into it, re-hits every 0.25 s
        if (Math.floor(s.t / 0.25) !== Math.floor((s.t - sdt) / 0.25)) s.hit = new Set();
        for (const m of this.targetsNear(s.x, s.y + 30, 140, 90)) if (MOBS[m.kind].brain !== 'boss') m.x += Math.sign(s.x - m.x) * 160 * sdt;
      }
      if (s.kind === 'tide') for (const m of this.targetsNear(s.x, s.y + 20, 60, 70)) if (MOBS[m.kind].brain !== 'boss') m.x = clamp(m.x + Math.sign(s.vx) * 380 * sdt, 20, this.stage.width - 20);
      if (s.kind === 'salmon' && !s.g && s.tx !== undefined) s.y = s.tx + Math.sin(s.t * 14) * 26;
      if (s.kind === 'gumball') { s.vy += 500 * sdt; const fl = s.vy > 0 ? this.floorBelow(s.x, s.y - s.vy * sdt, s.y, false) : null; if (fl) { s.y = fl.y - 2; s.vy = -Math.abs(s.vy) * 0.7; } }
      if (s.kind === 'gearroll' && Math.floor(s.t / 0.3) !== Math.floor((s.t - sdt) / 0.3)) s.hit = new Set(); // bumps again
      if (s.kind === 'snowball') { s.r = (s.r ?? 14) + 22 * sdt; s.dmg *= 1 + 0.5 * sdt; }
      if (s.g) { // lobbed: falls; berries become mines, mustard becomes goo, meteors burst
        const prevY = s.y - s.vy * sdt;
        s.vy += s.g * sdt;
        let f = s.vy > 0 ? this.floorBelow(s.x, prevY, s.y, false) : null;
        if (f && s.fromY !== undefined && f.y < s.fromY - 4) f = null; // thrown from below a ledge: it drops past it to the monsters' level
        if (f) {
          if (s.kind === 'berry') this.mines.push({ id: nextId++, x: s.x, y: f.y, t: 0.2, dmg: s.dmg, kx: s.kx, ky: s.ky });
          else if (s.kind === 'goo') this.zones.push({ id: nextId++, x: s.x, y: f.y, w: 80, t: 4, tick: 0.1, next: 0, dmg: s.dmg, kind: 'goo', hit: new Set() });
          else if (s.kind === 'minijelly' && (s.bounces ?? 0) < (s.tx ?? 6)) { s.bounces = (s.bounces ?? 0) + 1; s.y = f.y - 2; s.vy = -360; s.hit = new Set(); this.events.push({ t: 'bounce', x: s.x, y: f.y }); continue; }
          else if (s.kind === 'pit' && (s.bounces ?? 0) < (s.tx ?? 3)) { s.bounces = (s.bounces ?? 0) + 1; s.y = f.y - 2; s.vy = -440 * Math.pow(0.78, s.bounces); s.hit = new Set(); this.events.push({ t: 'bounce', x: s.x, y: f.y }); continue; }
          else if (s.kind === 'scoop') { this.events.push({ t: 'boom', x: s.x, y: f.y }); for (const m of this.targetsNear(s.x, f.y, 90, 70)) { this.damageMob(m, s.dmg, Math.sign(m.x - s.x) || 1, { kx: s.kx, ky: s.ky, stun: 0.6 }, true); this.applyFx(m, ['freeze'], h); } }
          else if (s.kind === 'sundae') { this.events.push({ t: 'shock', x: s.x, y: f.y, r: 170 }); for (const m of this.targetsNear(s.x, f.y, 170, 120)) this.damageMob(m, s.dmg, Math.sign(m.x - s.x) || 1, { kx: s.kx, ky: s.ky, stun: 1 }, true); this.zones.push({ id: nextId++, x: s.x, y: f.y, w: 300, t: 5, tick: 0.4, next: 0, dmg: 0, kind: 'ice', owner: h.idx }); }
          else if (s.kind === 'chocchip') { for (const m of this.targetsNear(s.x, f.y, 40, 60)) if (!s.hit.has(m.id)) this.damageMob(m, s.dmg, Math.sign(m.x - s.x) || 1, { kx: s.kx, ky: s.ky, stun: 0.5 }, true); }
          else if (s.kind === 'cupcake') { this.events.push({ t: 'boom', x: s.x, y: f.y }); for (const m of this.targetsNear(s.x, f.y, 90, 70)) this.damageMob(m, s.dmg, Math.sign(m.x - s.x) || 1, { kx: s.kx, ky: s.ky, stun: 0.6 }, true); this.zones.push({ id: nextId++, x: s.x, y: f.y, w: 160, t: 4, tick: 0.4, next: 0, dmg: 0, kind: 'ice', owner: h.idx }); }
          else if (s.kind === 'salsa' || s.kind === 'candy') { this.events.push({ t: 'boom', x: s.x, y: f.y }); for (const m of this.targetsNear(s.x, f.y, s.kind === 'salsa' ? 70 : 40, 60)) if (!s.hit.has(m.id)) { this.damageMob(m, s.dmg, Math.sign(m.x - s.x) || 1, { kx: s.kx, ky: s.ky, stun: 0.6 }, true); if (s.kind === 'salsa') this.applyFx(m, ['burn'], h); } }
          else if (s.kind === 'gearlob') { this.events.push({ t: 'shock', x: s.x, y: f.y, r: 90 }); for (const m of this.targetsNear(s.x, f.y, 90, 70)) { this.damageMob(m, s.dmg * gearVs(m), Math.sign(m.x - s.x) || 1, { kx: s.kx, ky: s.ky, stun: 0.7 }, true); if (s.fx) this.applyFx(m, s.fx, h); } }
          else if (s.kind === 'meteor') { this.events.push({ t: 'shock', x: s.x, y: f.y, r: 70 }); for (const m of this.targetsNear(s.x, f.y, 70, 60)) if (!s.hit.has(m.id)) this.damageMob(m, s.dmg, Math.sign(m.x - s.x) || 1, { kx: s.kx, ky: s.ky, stun: 0.6 }, true); }
          s.t = 99; continue;
        }
      }
      const rad = s.r ?? 14;
      for (const m of this.mobs) {
        if (m.state === 'dead' || m.under || s.hit.has(m.id)) continue;
        const def = MOBS[m.kind];
        if (Math.abs(m.x - s.x) < def.w / 2 + rad && s.y < m.y + 10 + rad - 14 && s.y > m.y - def.h - 10 - (rad - 14)) {
          s.hit.add(m.id);
          this.damageMob(m, s.dmg * (s.icon ? gearVs(m) : 1), Math.sign(s.vx) || h.face, { kx: s.kx, ky: s.ky, stun: 0.6 }, true);
          if (s.fx) this.applyFx(m, s.fx, h);
          if (s.kind === 'gumball' && (s.bounces ?? 0) < 3) { s.bounces = (s.bounces ?? 0) + 1; s.vx = -s.vx * 0.9; s.vy = -200; s.hit = new Set([m.id]); this.events.push({ t: 'bounce', x: s.x, y: s.y }); break; }
          if (s.kind === 'berry') this.events.push({ t: 'boom', x: s.x, y: s.y });
          if (s.kind === 'goo') this.glue(m);
          if (!s.pierce) { s.t = 99; break; }
        }
      }
    }
    this.shots = this.shots.filter(s => s.t < (s.from === 'mob' || s.g || LONG_SHOTS.has(s.kind ?? '') ? 2.5 : 0.9) && s.x > 0 && s.x < this.stage.width && s.y < this.stage.groundY + 20);
  }

  private stepHazards(dt: number): void {
    const G = this.stage.groundY;
    for (const p of this.puddles) p.t -= dt;
    this.puddles = this.puddles.filter(p => p.t > 0);
    const enraged = !!this.boss?.enraged;
    this.hazards.forEach((z, i) => {
      const active = !z.phase2 || enraged;
      let st: 'off' | 'warn' | 'on';
      if (!active) st = 'off';
      else if (z.kind === 'ice') st = 'on';
      else { const c = (this.time + z.offset) % z.period; st = c < z.on ? 'on' : c > z.period - 0.9 ? 'warn' : 'off'; }
      if (st !== z.state) { if (st === 'on') z.hit.clear(); z.state = st; if (z.kind !== 'ice') this.events.push({ t: 'hazard', i, on: st === 'on' }); }
      if (st !== 'on' || z.kind === 'ice') return;
      if (z.kind === 'chill' && z.hit.size === 0 && !this.puddles.some(p => Math.abs(p.x - z.x) < 10)) this.puddles.push({ x: z.x, y: G, t: 3, kind: 'slick', w: 120 });
      if (z.kind === 'pollen' && z.hit.size === 0 && !this.puddles.some(p => Math.abs(p.x - z.x) < 10)) this.puddles.push({ x: z.x, y: G, t: 3, kind: 'slow', w: 110 });
      if (z.kind === 'sprinkler' && z.hit.size === 0 && !this.puddles.some(p => Math.abs(p.x - z.x) < 10)) this.puddles.push({ x: z.x, y: G, t: 3, kind: 'slick', w: 90 });
      const reachUp = z.kind === 'vent' || z.kind === 'sprinkler' ? 110 : z.kind === 'pollen' || z.kind === 'chill' ? 150 : z.kind === 'drop' || z.kind === 'wax' ? 70 : z.kind === 'tap' ? 900 : 60;
      if (z.kind === 'wax' && z.hit.size === 0 && !this.puddles.some(p => Math.abs(p.x - z.x) < 10)) this.puddles.push({ x: z.x, y: G, t: 3, kind: 'slow', w: 70 });
      const inZone = (x: number, y: number) => Math.abs(x - z.x) < z.w / 2 && y >= G - reachUp;
      const pct = (z.kind === 'burner' ? 0.12 : z.kind === 'vent' ? 0.06 : z.kind === 'tap' ? 0.07 : z.kind === 'wax' ? 0.11 : z.kind === 'sprinkler' ? 0.05 : z.kind === 'pollen' ? 0.05 : z.kind === 'chill' ? 0.06 : 0.15) * (z.phase2 ? 0.5 : 1);
      for (const h of this.heroes) {
        this.cur = h;
        const key = -1 - h.idx;
        if (!z.hit.has(key) && h.state !== 'down' && inZone(h.x, h.y) && (h.inv <= 0 || this.canPerfect())) {
          z.hit.add(key);
          this.hurtHero(h.d.maxHp * pct, Math.sign(h.x - z.x) || 1, undefined, true);
          if ((z.kind === 'vent' || z.kind === 'sprinkler') && (h.state as string) !== 'down') { h.vy = z.kind === 'sprinkler' ? -760 : -900; h.ground = false; h.on = null; }
          if (z.kind === 'chill' && (h.state as string) !== 'down') { h.vx = (Math.sign(h.x - z.x) || 1) * 380; }
          if (z.kind === 'tap' && (h.state as string) !== 'down') { h.vx = (Math.sign(h.x - z.x) || 1) * 300; h.vy = Math.max(h.vy, 200); }
        }
      }
      this.cur = this.heroes[0];
      for (const m of this.mobs) {
        const md = MOBS[m.kind];
        if (m.state === 'dead' || m.under || m.disguised || md.brain === 'boss' || md.brain === 'flyer' || z.hit.has(m.id) || !inZone(m.x, m.y)) continue;
        z.hit.add(m.id);
        const dmg = Math.round(m.maxHp * 0.15);
        m.hp -= dmg; m.flash = 0.12; m.hurtShown = 3;
        this.events.push({ t: 'hit', x: m.x, y: m.y - md.h * 0.6, dmg, crit: false, target: 'mob' });
        if (z.kind === 'vent' || z.kind === 'sprinkler') { m.vy = -700; m.ground = false; m.on = null; }
        if (m.hp <= 0) this.killMob(m);
      }
    });
  }

  private stepMines(dt: number): void {
    for (const mi of this.mines) {
      this.cur = this.heroes[mi.owner ?? 0] ?? this.heroes[0];
      mi.t += dt;
      if (mi.t < 0.3) continue;
      const hit = this.mobs.some(m => m.state !== 'dead' && !m.under && !m.disguised && Math.abs(m.x - mi.x) < MOBS[m.kind].w / 2 + 16 && Math.abs(m.y - mi.y) < 30);
      if (hit || mi.t > 10) {
        mi.t = 99;
        this.events.push({ t: 'boom', x: mi.x, y: mi.y });
        const ids = new Set<number>();
        for (const m of this.mobs) {
          if (m.state === 'dead' || m.under || ids.has(m.id)) continue;
          if (Math.abs(m.x - mi.x) < 70 && Math.abs(m.y - mi.y) < 60) { ids.add(m.id); this.damageMob(m, mi.dmg, Math.sign(m.x - mi.x) || 1, { kx: mi.kx, ky: mi.ky, stun: 0.7 }, true); if (mi.glue && MOBS[m.kind].brain !== 'boss') this.glue(m); if (mi.fx?.length) this.applyFx(m, mi.fx, this.cur); }
        }
      }
    }
    this.mines = this.mines.filter(m => m.t < 99);
  }

  private stepBoxes(dt: number): void {
    for (const b of this.boxes) {
      b.t += dt;
      if (!b.ground) {
        b.vy = Math.min(b.vy + GRAVITY * dt, MAX_FALL);
        const ny = b.y + b.vy * dt;
        const floor = this.floorBelow(b.x, b.y, ny, false);
        if (floor !== null) { b.y = floor.y; b.ground = true; b.vy = 0; } else b.y = ny;
      }
      const owner = b.owner ?? 0;
      const taker = b.t > 0.5 ? this.heroes.find(h => (h.idx === owner || (h.cpu && owner === 0)) && Math.abs(b.x - h.x) < HERO_W + 10 && Math.abs(b.y - h.y) < 60 && h.state !== 'down') : undefined;
      if (taker) {
        b.t = -1e9;
        this.lootOf[owner].push({ tier: b.tier, ilvl: b.ilvl });
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
        const he = this.heroes.find(q => q === e);
        if (he) { he.landed = true; if (he.idx === 0) this.events.push({ t: 'land' }); }
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

/** Stage rank from time, hits taken, best combo and style (average style meter + perfect dodges). */
export function rankOf(run: RunStats, par: number): { rank: 'S' | 'A' | 'B' | 'C' | 'D'; score: number } {
  const timeScore = Math.max(0, Math.min(40, 40 * (1.6 - run.time / par) / 0.6));
  const hitScore = Math.max(0, 35 - run.hitsTaken * 3);
  const styleAvg = run.styleTime > 0 ? run.styleSum / run.styleTime : 0;
  const comboScore = Math.min(12, run.maxCombo * 0.6) + Math.min(13, styleAvg * 0.3 + run.perfects * 1.5 + run.interrupts * 0.5);
  const score = Math.round(timeScore + hitScore + comboScore);
  const rank = score >= 85 ? 'S' : score >= 70 ? 'A' : score >= 50 ? 'B' : score >= 30 ? 'C' : 'D';
  return { rank, score };
}

/** hero projectiles that live longer than a bolt */
/** Bosses shrug off thrown kitchenware a bit (gear skills deal 40% to them). */
const gearVs = (m: Mob) => (MOBS[m.kind].brain === 'boss' ? 0.4 : 1);
const LONG_SHOTS = new Set(['gearboom', 'minijelly', 'tide', 'salmon', 'gumball', 'trumpet', 'guacwave', 'gearroll', 'boomerang', 'homing', 'twister', 'snowball', 'wave', 'reflect']);
const NEW_BRAINS = new Set(['healer', 'summoner', 'charger', 'sniper', 'turret', 'burrower', 'mimic']);

const gbCache = new WeakMap<AttackDef[], AttackDef>(), lnCache = new WeakMap<AttackDef[], AttackDef>();
/** DOWN+attack: a slower, heavier version of the finisher that breaks shields and armour. */
export function guardBreakOf(combo: AttackDef[]): AttackDef {
  let a = gbCache.get(combo);
  if (!a) { const f = combo[combo.length - 1]; a = { ...f, dur: f.dur + 0.22, hit: [f.hit[0] + 0.18, f.hit[1] + 0.18], dmg: f.dmg * 1.4, kx: f.kx * 1.2, ky: -220, stun: 0.9, lunge: f.lunge * 0.6 }; gbCache.set(combo, a); }
  return a;
}
/** UP+attack: pops the monster high into the air for a juggle. */
export function launcherOf(combo: AttackDef[]): AttackDef {
  let a = lnCache.get(combo);
  if (!a) { const f = combo[0]; a = { ...f, dur: 0.42, hit: [0.1, 0.22], h: Math.max(f.h, 90), dmg: f.dmg * 1.1, kx: 40, ky: -760, stun: 0.9, lunge: 60 }; lnCache.set(combo, a); }
  return a;
}

function approach(v: number, target: number, step: number): number {
  return v < target ? Math.min(v + step, target) : Math.max(v - step, target);
}
function clamp(v: number, a: number, b: number): number { return Math.max(a, Math.min(b, v)); }
