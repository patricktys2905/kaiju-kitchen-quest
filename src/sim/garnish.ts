// The Garnish (docs/DROPS-USES.md, build spec B1 and B4): candy a monster's drop and a kaiju wears it on its head.
// It is a LOOK, and it gives exactly one thing, Hunter's Nose: its OWN monster drops its item more often (+15 points).
// It gives no power of any kind (rule B1): no damage, HP, healing, cooldowns, speed, crumbs, XP, pickup reach, boxes or
// stones. There is no perk type to extend: one number (GARNISH_LUCK) and one function (garnishChance), read in one
// place (the drop roll in World.killMob). sim/stats.ts never imports this file and `derive` never reads the field.
//
// ======================================================================================================================
// EXPORTED API (for the UI: src/ui/cookbook.ts, camp.ts, GameScene.ts, online.ts). Everything here is pure: it works on
// the object you pass. The game's own save goes through the wrappers at the bottom of src/save.ts, which fill in `save`,
// the unlocked stages and persist():
//     garnishCard(kind)  garnishPicker(species?)  garnishOf(species?)  candyGarnish(kind)  wearGarnish(species, kind | null)
//     garnishLookOf(profile)  kitGarnishOf(species?)
//
// The one perk
//   GARNISH_LUCK = 0.15                       Hunter's Nose: points added to the worn kind's own drop chance.
//   garnishChance(base, kind, worn): number   the drop chance for `kind` given the kinds worn: base + 0.15 when worn (once,
//                                             however many wear it), otherwise base unchanged. 0.2 -> 0.35, 0.35 -> 0.5.
//                                             killMob calls it for the PLAIN roll only: while the map's own exit still wants
//                                             the drop the roll stays at 0.55, garnish or not (decided 2026-11-14: a faster
//                                             exit is power; measured with scripts/garnish-probe.ts).
//   setWorldGarnishes(world, wornByHero)      tell a World what each hero wears, IN HERO ORDER (index 0 = the first player,
//                                             then the party; pass the CPU buddy's too: it is ignored, only the first
//                                             `world.humans` entries count). Call it right after `new World(...)`, where
//                                             GameScene sets `world.drops`. Unknown kinds and junk are ignored.
//   worldGarnishes(world): readonly string[]  the kinds that count in that World (what killMob reads).
//
// Rules and numbers
//   GARNISH_COST = { wanted: 10, spare: 6 }   drops to make one (6 for the never-wanted kinds).
//   GARNISH_CARD_LEVEL = 2                    the Cookbook card level needed to make one (2 = one star).
//   garnishCost(kind): number
//   garnishBlock(s, kind): GarnishBlock|null  why CANDY IT cannot happen now: 'unknown' (no such drop), 'owned', 'card'
//                                             (the card has no star yet), 'drops' (not enough in the bag); null = it can.
//
// Looking (read-only; `stages` = the stages whose SKIP TO BOSS the player could use, i.e. unlocked ones)
//   garnishView(s, kind, stages): GarnishView|null   one card's garnish: owned, canMake, block, cost, bag, the skips making
//                                             it would break (`breaks`: stage ids; not empty = show the warning first),
//                                             gold (card at two stars), wornBy (species ids), icon (the drop's own icon
//                                             key, `drop-<kind>`), the drop chances with and without it.
//   garnishesOwned(s, stages): GarnishView[]  the owned ones in Cookbook order (the picker; draw "None" first yourself).
//   wornGarnish(s, species): GarnishLook|null what that kaiju wears: { kind, icon, gold, name, dropName }.
//   garnishLook(profile, s?): GarnishLook|null   the look for HeroView / lookOf. With `s` (your own kaiju, your CPU buddy)
//                                             gold comes from your Cookbook; without it (a friend's online kit) gold comes
//                                             from the kit's `garnishGold` flag. null = draw nothing.
//   kitGarnish(s, species): { garnish?, garnishGold? }   the two optional fields to put in the online kit's profile.
//
// Doing (they change `s`; the save.ts wrappers persist)
//   candy(s, kind): CandyResult               make a garnish: takes the cost from the bag, adds the kind to s.garnishes.
//                                             Never twice, only at one star or better. It does not ask about SKIP TO BOSS:
//                                             show the warning first if garnishView().breaks is not empty (CANDY IT / KEEP).
//   wear(s, species, kind | null): boolean    put an owned garnish on a kaiju, or take it off (null). Free; any number of
//                                             kaiju may wear the same one. False = not owned / no such kaiju.
//   repairGarnish(s)                          load repair for save.garnishes and every hero's garnish.
//
// CO-OP RULE (decided here, as B4 says): TEAM, not per-killer. The team shares one drop bag, so a kind worn by ANY human
// player gets +15 points for every kill of that monster, whoever lands the blow, and it is added once however many wear
// it. A CPU buddy's garnish is drawn and gives nothing. Online the roll happens on the host only, so each player's worn
// kind must reach the host inside their kit's profile (`garnish`, see kitGarnish).
// Free Play: the look shows everywhere; the perk matters where drops fall (Daily Dungeon, bonus stages).
// ======================================================================================================================
import { type CardLevel, type CookSave, type Cookbook, baseDropChance, cardLevel, cookbook, skipsBrokenBy } from './cookbook';
import { DROPS, QUEST_DROP_CHANCE, dropIcon, dropName } from './drops';
import { MOBS } from './mobs';
import type { MobKind, StageDef } from './types';

// The saved field lives on HeroProfile, declared here so that sim/stats.ts has no line about the Garnish at all
// (rule B1: `derive` cannot read what stats.ts does not know).
declare module './stats' {
  interface HeroProfile {
    /** the garnish this kaiju wears: a monster kind from save.garnishes (sim/garnish.ts). A look; never read by derive. */
    garnish?: string;
    /** online kits only (never saved, removed on load): the wearer's Cookbook card has two stars, so friends draw a gold outline */
    garnishGold?: boolean;
  }
}

// ---------- the one perk ----------
/** Hunter's Nose: a worn garnish adds this to its own monster's drop chance (0.15 = 15 percentage points). The ONLY
 *  number a garnish has. */
export const GARNISH_LUCK = 0.15;

const known = (k: unknown): k is string => typeof k === 'string' && Object.prototype.hasOwnProperty.call(DROPS, k);

/** The drop chance for `kind` given the kinds worn by the human players: `base` plus GARNISH_LUCK when one of them wears
 *  that kind's garnish (once, however many wear it), `base` untouched for every other kind. */
export function garnishChance(base: number, kind: string, worn: readonly (string | null | undefined)[] | undefined): number {
  return worn && worn.length && worn.includes(kind) ? Math.min(1, Math.round((base + GARNISH_LUCK) * 1000) / 1000) : base;
}

const NONE: readonly string[] = [];
const WORN = new WeakMap<object, readonly string[]>();
/** Tell a World what its heroes wear, in hero order. Only the human players count (the first `world.humans`): a CPU
 *  buddy's garnish is a look and nothing more. Anything that is not a monster with a drop is ignored. */
export function setWorldGarnishes(world: { humans: number }, wornByHero: readonly unknown[] | null | undefined): void {
  const kinds = [...new Set((Array.isArray(wornByHero) ? wornByHero : []).slice(0, Math.max(1, world.humans)).filter(known))];
  if (kinds.length) WORN.set(world, kinds); else WORN.delete(world);
}
/** The garnish kinds that count in this World (empty unless setWorldGarnishes was called). */
export function worldGarnishes(world: object): readonly string[] { return WORN.get(world) ?? NONE; }

// ---------- rules ----------
/** Drops it costs to make a garnish: 10, or 6 for the never-wanted kinds. */
export const GARNISH_COST = { wanted: 10, spare: 6 } as const;
/** The Cookbook card level needed to make its garnish (2 = one star). */
export const GARNISH_CARD_LEVEL: CardLevel = 2;

/** The part of the save the Garnish reads and writes (Save in src/save.ts fits it). */
export interface GarnishSave extends CookSave {
  /** garnishes made (monster kinds): owned by the whole account, for good */
  garnishes?: string[];
  heroes: Record<number, { garnish?: string; garnishGold?: boolean }>;
}
export type GarnishBlock = 'unknown' | 'owned' | 'card' | 'drops';
export interface CandyResult { ok: boolean; kind: string; /** drops taken from the bag (0 when refused) */ cost: number; block: GarnishBlock | null }
/** What to draw on a kaiju: the drop's own icon, white outline, or gold when `gold`. */
export interface GarnishLook { kind: MobKind; /** art key: the drop's own icon, `drop-<kind>` */ icon: string; /** gold outline: its Cookbook card has two stars */ gold: boolean; /** the monster's name and its drop's name */ name: string; dropName: string }
export interface GarnishView extends GarnishLook {
  owned: boolean;
  /** drops to make it, how many are in the bag, the card's level and whether that is enough (one star) */
  cost: number; bag: number; cardLevel: CardLevel; cardOk: boolean;
  /** can CANDY IT be pressed now, and if not, why */
  canMake: boolean; block: GarnishBlock | null;
  /** stage ids whose SKIP TO BOSS making it would break: not empty = show the warning first (empty when it cannot be made) */
  breaks: string[];
  /** the kaiju wearing it (species ids, in id order) */
  wornBy: number[];
  /** no story exit asks for this drop */
  neverWanted: boolean;
  /** Hunter's Nose in numbers, 0-1: the plain chance without and with the garnish; and the chance while a map's exit still
   *  wants the drop (null for a never-wanted kind), which the garnish does NOT change: questWorn always equals quest */
  chance: { plain: number; worn: number; quest: number | null; questWorn: number | null };
  /** "<monster> drops its item more often" (a wanted kind adds: ", except while an exit is collecting it") */
  perk: string;
}

const whole = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? Math.floor(v) : 0);
const owns = (s: GarnishSave, kind: string): boolean => Array.isArray(s.garnishes) && s.garnishes.includes(kind);
const real = (kind: unknown, book: Cookbook): kind is string => known(kind) && !!book.pageOf[kind];

export function garnishCost(kind: string, book: Cookbook = cookbook()): number { return book.spare.has(kind) ? GARNISH_COST.spare : GARNISH_COST.wanted; }

/** Why this garnish cannot be made right now (null = it can). */
export function garnishBlock(s: GarnishSave, kind: string, book: Cookbook = cookbook()): GarnishBlock | null {
  if (!real(kind, book)) return 'unknown';
  if (owns(s, kind)) return 'owned';
  if (cardLevel(s, kind, book) < GARNISH_CARD_LEVEL) return 'card';
  return whole(s.drops?.[kind]) < garnishCost(kind, book) ? 'drops' : null;
}

// ---------- looking ----------
const lookFor = (kind: string, gold: boolean): GarnishLook => ({ kind: kind as MobKind, icon: dropIcon(kind as MobKind), gold, name: MOBS[kind as MobKind]?.name ?? kind, dropName: dropName(kind as MobKind) });

/** One monster's garnish, ready to draw on its Cookbook card or in the picker (null for a monster with no drop). */
export function garnishView(s: GarnishSave, kind: string, stages: readonly StageDef[] = [], book: Cookbook = cookbook()): GarnishView | null {
  if (!real(kind, book)) return null;
  const cost = garnishCost(kind, book), level = cardLevel(s, kind, book), block = garnishBlock(s, kind, book), spare = book.spare.has(kind), plain = baseDropChance(kind, book);
  const look = lookFor(kind, level >= 3);
  return {
    ...look, owned: owns(s, kind), cost, bag: whole(s.drops?.[kind]), cardLevel: level, cardOk: level >= GARNISH_CARD_LEVEL, canMake: block === null, block,
    breaks: block === null ? skipsBrokenBy(s.drops, { [kind]: cost }, stages).map(st => st.id) : [],
    wornBy: Object.keys(s.heroes ?? {}).map(Number).filter(sp => s.heroes[sp]?.garnish === kind).sort((a, b) => a - b),
    neverWanted: spare,
    // the quest roll (a map's exit still wants the drop) never gets the bonus, so questWorn is always the same as quest
    chance: { plain, worn: garnishChance(plain, kind, [kind]), quest: spare ? null : QUEST_DROP_CHANCE, questWorn: spare ? null : QUEST_DROP_CHANCE },
    perk: spare ? `${look.name} drops its item more often` : `${look.name} drops its item more often, except while an exit is collecting it`,
  };
}

/** Every garnish the account owns, in Cookbook order (page by page): the picker's grid. */
export function garnishesOwned(s: GarnishSave, stages: readonly StageDef[] = [], book: Cookbook = cookbook()): GarnishView[] {
  return book.pages.flatMap(p => p.kinds).filter(k => owns(s, k)).map(k => garnishView(s, k, stages, book)!);
}

/** What a kaiju of this save wears (null = nothing, or something it does not own). */
export function wornGarnish(s: GarnishSave, species: number, book: Cookbook = cookbook()): GarnishLook | null {
  const k = s.heroes?.[species]?.garnish;
  return real(k, book) && owns(s, k) ? lookFor(k, cardLevel(s, k, book) >= 3) : null;
}

/** The look to draw for a profile. Pass `s` for a kaiju of this save (gold = its Cookbook card has two stars); leave it
 *  out for a friend's online kit (gold = the kit's own `garnishGold` flag). null = draw nothing (none, or not a real drop). */
export function garnishLook(p: { garnish?: unknown; garnishGold?: unknown } | null | undefined, s?: GarnishSave, book: Cookbook = cookbook()): GarnishLook | null {
  const k = p?.garnish;
  if (!real(k, book)) return null;
  return lookFor(k, s ? cardLevel(s, k, book) >= 3 : p!.garnishGold === true);
}

/** The fields an online kit's profile carries for a kaiju of this save: `garnish` (the host's drop roll and everyone's
 *  screen need it) and `garnishGold` (only when true). Empty when it wears nothing. */
export function kitGarnish(s: GarnishSave, species: number, book: Cookbook = cookbook()): { garnish?: string; garnishGold?: true } {
  const w = wornGarnish(s, species, book);
  return w ? (w.gold ? { garnish: w.kind, garnishGold: true } : { garnish: w.kind }) : {};
}

// ---------- doing ----------
/** Make a monster's garnish: its Cookbook card must have one star or better, it costs 10 of that drop from the bag (6 for
 *  a never-wanted kind), and it is made once: the account owns it for good. It changes only s.drops and s.garnishes. */
export function candy(s: GarnishSave, kind: string, book: Cookbook = cookbook()): CandyResult {
  const block = garnishBlock(s, kind, book);
  if (block) return { ok: false, kind, cost: 0, block };
  const cost = garnishCost(kind, book), left = whole(s.drops![kind]) - cost;
  if (left > 0) s.drops![kind] = left; else delete s.drops![kind];
  s.garnishes = [...(Array.isArray(s.garnishes) ? s.garnishes : []), kind];
  return { ok: true, kind, cost, block: null };
}

/** Put an owned garnish on a kaiju, or take it off with null. Free; one per kaiju; many kaiju may wear the same one. */
export function wear(s: GarnishSave, species: number, kind: string | null, book: Cookbook = cookbook()): boolean {
  const h = s.heroes?.[species];
  if (!h) return false;
  if (kind === null) { delete h.garnish; return true; }
  if (!real(kind, book) || !owns(s, kind)) return false;
  h.garnish = kind; return true;
}

// ---------- load repair ----------
/** Make the Garnish fields safe after loading (old saves have neither; an edited save can hold anything): the owned list
 *  keeps only real drops, once each (anything that is not a list becomes no list); a worn garnish that is not owned or
 *  not a real drop is cleared; the online-only gold flag is never kept. Absent fields stay absent. */
export function repairGarnish(s: GarnishSave, book: Cookbook = cookbook()): void {
  if (s.garnishes !== undefined) {
    const list = Array.isArray(s.garnishes) ? [...new Set(s.garnishes.filter(k => real(k, book)))] : [];
    if (list.length) s.garnishes = list; else delete s.garnishes;
  }
  for (const h of Object.values(s.heroes ?? {})) {
    if (!h || typeof h !== 'object') continue;
    if ('garnishGold' in h) delete h.garnishGold;
    if ('garnish' in h && !(real(h.garnish, book) && owns(s, h.garnish))) delete h.garnish;
  }
}
