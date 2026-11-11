// Shared sim types. The sim is Phaser-free so it can be unit-tested and (later) run host-side online.

export interface Input {
  left: boolean; right: boolean; up: boolean; down: boolean;
  jump: boolean;   // held
  attack: boolean; // held
  skill1: boolean; skill2: boolean; skill3: boolean; // held
  /** quick-bag slots 1-4 (held) */
  item1: boolean; item2: boolean; item3: boolean; item4: boolean;
  ult: boolean;
  /** gear skill (the weapon's own move) */
  gear: boolean;
}
export const NO_INPUT: Input = { gear: false, left: false, right: false, up: false, down: false, jump: false, attack: false, skill1: false, skill2: false, skill3: false, item1: false, item2: false, item3: false, item4: false, ult: false };

/** One-way platform: you can jump up through it and drop down with DOWN + JUMP. */
export interface Platform { x: number; y: number; w: number; solid?: boolean;
  /** moving tray: slides dx px and back over period seconds */
  move?: { dx: number; period: number };
  /** hidden ledge: only shows when you're near; reached with a sponge */
  secret?: boolean }
/** Interactive props. crate/jar break for loot, sponge bounces you up, lever drops a rolling pin on [tx-tw/2, tx+tw/2],
 *  chest (on secret ledges) holds a big box and maybe this world's key. */
export interface Prop { kind: 'crate' | 'jar' | 'sponge' | 'lever' | 'chest' | 'cage' | 'nest'; x: number; y: number; key?: boolean; tx?: number; tw?: number; /** a lever that opens gate i (instead of dropping a rolling pin) */ gate?: number }
export interface Ladder { x: number; top: number; bottom: number }
export interface MobSpawn { kind: MobKind; x: number; y?: number; lv: number; elite?: boolean; /** asleep until a hero passes this x (a boss at the end of a long stage) */ wake?: number }
/** Stage hazard on the ground floor. burner = flame pillar, vent = steam launch, drop = falling can, ice = slippery.
 *  Timed hazards cycle: on for `on` s, off, then glow a warning for the last 0.9 s before the next burst. */
export type HazardKind = 'burner' | 'vent' | 'drop' | 'ice' | 'tap' | 'wax' | 'sprinkler' | 'pollen' | 'chill';
export interface Hazard { kind: HazardKind; x: number; w: number; period: number; on: number; offset: number; /** boss arenas: only after the boss enrages */ phase2?: boolean }
export interface Arena { x0: number; x1: number; waves: MobSpawn[][] }
export interface Objective { kind: 'escort' | 'fetch' | 'survive'; /** seconds: survive length, or fetch time limit */ t?: number; /** fetch: where the scroll is */ x?: number; /** the timer only starts once a hero passes this x */ at?: number }
/** Optional "Spicy" challenges chosen before a stage (each adds loot). */
export type Spicy = 'nopots' | 'glass' | 'clock';

/** A zone's goal: its piece of the boss-door key. */
export type ZoneGoal =
  | { kind: 'collect'; /** the drops the exit wants: n of each monster's */ wants: { mob: MobKind; n: number }[] }
  | { kind: 'rescue'; need: number }
  | { kind: 'nests'; need: number }
  | { kind: 'arena' }
  | { kind: 'fetch' }
  | { kind: 'survive' };
/** One map of a stage: maps sit side by side in the world, walled off, joined by portals (press up to go through). */
export interface StageMap {
  name: string; kind: 'hub' | 'zone' | 'boss'; x0: number; x1: number; goal?: ZoneGoal;
  /** respawning monsters (MapleStory style): which kinds, where they appear (x, floor y), how many at once */
  spawns?: { kinds: MobKind[]; pts: [number, number][]; cap: number; lv: number };
  /** to = map index, tx = where you come out; boss = the boss door (opens when every zone's goal is done) */
  portals: { x: number; to: number; tx: number; boss?: boolean; /** the map's exit: opens with the map's goal (drops handed in) */ need?: boolean }[];
}
export interface StageDef {
  /** a stage of maps: a hub, zones with goals, and the boss room (see stages.ts genMaps) */
  maps?: StageMap[];
  /** a long boss stage: the backdrop switches to this when the boss wakes */
  bossBg?: string;
  /** free mode: monster strength set by level instead of by world */
  power?: number;
  id: string;
  world: number;
  num: string;       // "1-1"
  name: string;
  bg: string;        // far background key
  mid: string;       // mid parallax layer key ('' = none)
  tile: string;      // ground tile key
  platTint: number;  // tint for the platform boards
  width: number;
  groundY: number;   // top of the ground slab
  platforms: Platform[];
  ladders: Ladder[];
  mobs: MobSpawn[];
  hazards?: Hazard[];
  props?: Prop[];
  /** runaway pressure cookers: can't be hurt, explode near anything (lure monsters into them) */
  cookers?: number[];
  /** stage goal beyond "beat everything": escort the lost Crumblet, fetch the Recipe Scroll in time, or survive the waves */
  objective?: Objective;
  /** locked combat rooms: gates close when you walk in, designed waves, gates open when they're all beaten */
  arenas?: Arena[];
  /** a giant rolling pin chases you from x0 to x1 */
  chase?: { x0: number; x1: number };
  /** lights-out stretches */
  darks?: { x0: number; x1: number }[];
  /** shut gates: nobody passes x until its lever is pulled */
  gates?: { x: number }[];
  /** the section plan of a long stage (for tests and the stage info) */
  sections?: string[];
  /** conveyor belts on the floor (v px/s, + = rightwards) */
  belts?: { x: number; w: number; v: number }[];
  /** monster level shown on the map */
  lv: [number, number];
  boss?: boolean;
  /** par time (s) for an S rank */
  par: number;
  /** level the hero should be (for the map hint) */
  rec: number;
}

export type MobKind = 'jamhop' | 'salt' | 'cheesemouse' | 'icepop' | 'crumbcube' | 'mitt' | 'bee' | 'cracker' | 'duck' | 'straw' | 'teacake' | 'ladle' | 'skewer' | 'firefly' | 'caterpillar' | 'toadstool' | 'coupon' | 'boxbot' | 'pudding' | 'cracker2'
  | 'm1a' | 'm1b' | 'm2a' | 'm2b' | 'm3a' | 'm3b' | 'm4a' | 'm4b' | 'm5a' | 'm5b' | 'm6a' | 'm6b' | 'm7a' | 'm7b' | 'm8a' | 'm8b' | 'm9a' | 'm9b' | 'm10a' | 'm10b' | 'xegg' | 'xpickle' | 'xmeatball' | 'xcan' | 'xscrub' | 'xroast' | 'xpatty' | 'xpumpkin' | 'xmelon' | 'xfruitknight'
  | 'bun' | 'worm' | 'pepper' | 'egg' | 'toast' | 'pea' | 'yogurt' | 'icebat' | 'pickle' | 'golem'
  | 'popcorn' | 'imp' | 'bacon' | 'meatball' | 'dragon'
  | 'can' | 'cheerio' | 'minicheerio' | 'soda' | 'flour' | 'jar'
  | 'garlic' | 'ant' | 'mimic' | 'carrot' | 'milk' | 'jelly' | 'jellybit' | 'kettle' | 'sausage' | 'marsh' | 'noodle' | 'raisin' | 'cereal'
  // World 5: The Sink
  | 'plate' | 'bubble' | 'glove' | 'eel' | 'mug' | 'scrub' | 'sporeling' | 'moldking'
  // World 6: The Dining Room (Act 2; boss: Sir Stale of the Leftovers)
  | 'fork' | 'napkin' | 'candle' | 'gravy' | 'teapot' | 'roast' | 'crouton' | 'stale'
  // World 7: The Backyard BBQ (boss: Baron Brussels)
  | 'wasp' | 'corn' | 'ketchup' | 'beetle' | 'charcoal' | 'patty' | 'sprout' | 'brussels'
  // World 8: The Garden (boss: the Mystery Meatloaf)
  | 'snail' | 'ladybug' | 'peapod' | 'mole' | 'tomato' | 'radish' | 'pumpkin' | 'chunk' | 'meatloaf'
  // World 9: The Supermarket (boss: the Tupperwraith)
  | 'trolley' | 'bag' | 'scanner' | 'banana' | 'can2' | 'melon' | 'lid' | 'tupper'
  // World 10: The Feast of the Forgotten (final boss: Old Fruitcake)
  | 'cherrysoldier' | 'fruitknight' | 'peel' | 'fruitcake'
  // story nemeses (one per kaiju, stage 5 of every world)
  | 'nbeet' | 'ncrow' | 'npine' | 'nlamp' | 'nshroom' | 'nslug' | 'nrat' | 'ncookie' | 'nginger' | 'nbrulee' | 'nkebab' | 'nshark' | 'nnacho' | 'nhornet' | 'nmouse' | 'ngorilla' | 'nbird' | 'nhare' | 'ngelato' | 'nbear';

export type BoxTier = 1 | 2 | 3 | 4 | 5;
export interface LootBox { tier: BoxTier; ilvl: number }

export type SimEvent =
  | { t: 'spawnPop'; x: number; y: number }
  | { t: 'loot'; kind: MobKind; n: number; x: number; y: number }
  | { t: 'needDrops'; kind: MobKind; have: number; need: number }
  | { t: 'warp'; to: number; hi: number }
  | { t: 'goal'; zone: number; text: string; done: boolean }
  | { t: 'doorLocked'; left: number }
  | { t: 'ambush'; x: number }
  | { t: 'gate'; i: number; x: number }
  | { t: 'bossWake'; kind: MobKind }
  | { t: 'hit'; x: number; y: number; dmg: number; crit: boolean; target: 'mob' | 'hero' }
  | { t: 'gear'; name: string; style: string; x: number; y: number }
  | { t: 'zap'; pts: [number, number][] }
  | { t: 'proc'; name: string; x: number; y: number }
  | { t: 'swing'; step: number }
  | { t: 'skill'; slot: number; kind: string; id: string }
  | { t: 'jump' }
  | { t: 'land' }
  | { t: 'mobDie'; x: number; y: number; boss: boolean; elite: boolean; kind: MobKind }
  | { t: 'xp'; n: number }
  | { t: 'drop'; id: number; tier: BoxTier; x: number; y: number }
  | { t: 'pickup'; id: number; tier: BoxTier }
  | { t: 'mobAttack'; id: number; kind: string }
  | { t: 'shock'; x: number; y: number; r: number }
  | { t: 'boom'; x: number; y: number }
  | { t: 'summon' }
  | { t: 'stagger' }
  | { t: 'portal' }
  | { t: 'clear' }
  | { t: 'down' }
  | { t: 'dodge' }
  | { t: 'use'; slot: number; id: import('./consumables').ConsumableId }
  | { t: 'revive' }
  | { t: 'crumbs'; n: number; x: number; y: number }
  | { t: 'stone'; n: number; x: number; y: number }
  | { t: 'ult'; name: string }
  | { t: 'block'; x: number; y: number }
  /** dodged through an attack at the last moment: slow-mo + a guaranteed crit counter */
  | { t: 'perfect'; x: number; y: number }
  /** hit a monster during its wind-up: its attack is cancelled */
  | { t: 'interrupt'; x: number; y: number }
  /** a guard-break smash broke a shield / armour */
  | { t: 'guardBreak'; x: number; y: number }
  /** a boss reached its second phase */
  | { t: 'enrage'; name: string }
  | { t: 'heal'; x: number; y: number; n: number }
  | { t: 'burrow'; x: number; y: number; up: boolean }
  | { t: 'mimic'; id: number }
  | { t: 'style'; rank: string }
  | { t: 'hazard'; i: number; on: boolean }
  /** a nemesis stole a quick-bag item (given back when it is beaten) */
  | { t: 'steal'; name: string }
  | { t: 'recover'; name: string }
  | { t: 'nemesisMove'; name: string; move: string }
  | { t: 'prop'; kind: string; x: number; y: number }
  | { t: 'bounce'; x: number; y: number }
  | { t: 'lever'; x: number }
  | { t: 'fuse'; x: number; y: number }
  /** found this world's secret key */
  | { t: 'key'; world: number }
  | { t: 'objective'; text: string; done?: boolean }
  | { t: 'objFail'; why: string }
  /** monsters near you read your button-mashing and raise their guard */
  | { t: 'guardUp'; x: number; y: number }
  /** a boss (or nemesis) finished its string and is catching its breath: hit it! */
  | { t: 'tired'; x: number; y: number }
  | { t: 'armorBreak'; x: number; y: number }
  | { t: 'phase'; name: string; n: number }
  | { t: 'arenaLock'; i: number; waves: number }
  | { t: 'arenaWave'; i: number; wave: number; waves: number }
  | { t: 'arenaClear'; i: number }
  | { t: 'chase'; on: boolean }
  | { t: 'heal'; x: number; y: number; n: number; hero: true };
