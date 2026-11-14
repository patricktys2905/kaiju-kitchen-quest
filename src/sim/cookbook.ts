// The Monster Cookbook (docs/DROPS-USES.md, build spec B1-B3): hand monster drops in at camp to fill a card per monster,
// a page per world, and the whole book. It pays crumbs, map stamps, card borders and titles, once each, and NOTHING that
// changes a fight: the reward type below has no field for a box, an item or a consumable, on purpose.
//
// ======================================================================================================================
// EXPORTED API (for the UI: src/ui/cookbook.ts and camp.ts). Everything here is pure: it works on the object you pass.
// The game's own save goes through the small wrappers at the bottom of src/save.ts, which fill in `save`, the unlocked
// stages and persist():   cookbookView()  cookCardView(kind)  cookHandIn(kind, n?)  cookHandInSpares(pageId)
//                         cookSpendWarning(spend)  chooseTitle(id | null)  skipStages()
//
// Data
//   cookbook(): Cookbook                    the book built from WORLDS, STAGES and DROPS (cached). `pages` (one per world
//                                           that brings new monsters: id '1'..'10', world number, world name, kinds),
//                                           `pageOf[kind]`, `spare` (the never-wanted kinds), `wantedBy[kind]` (story
//                                           stage ids whose exits ask for that drop).
//   buildCookbook(worlds, stages, drops)    the same for any data (tests; World 11 needs no call: cookbook() sees it).
//   neverWantedKinds(stages, drops)         the kinds no story exit asks for (26 today).
//   baseDropChance(kind)                    0.35 for a never-wanted kind, 0.2 otherwise (world.ts uses it in killMob).
//   CARD_NEEDS                              drops for Discovered / one star / two stars: wanted 1/5/12, spare 1/3/8.
//   cardNeeds(kind)                         that card's three numbers.
//   cardLevel(s, kind): CardLevel           the card's level as the save stands (sim/garnish.ts reads it).
//   cardReward(world, level 1|2|3)          CookReward paid when a card reaches that level.
//   pageReward(world, level 1|2)            CookReward for a page at one star / two stars everywhere.
//   BOOK_REWARD                             CookReward for the whole book (the title 'all', Head Chef).
//   bookTotals()                            { cards, oneStarDrops, twoStarDrops, crumbs } for the whole book.
//
// Looking (read-only; `stages` = the stages whose SKIP TO BOSS the player could use, i.e. unlocked ones)
//   cardView(s, kind, stages): CardView     one card: level, progress, next cost and reward, bag count, how many a tap
//                                           would hand in (`usable`), how many are safe (`safe`), the skips a full
//                                           hand-in would break (`breaks`: stage ids, empty = no warning), weak / resist
//                                           elements, home world, the stages that ask for it, drop chance.
//   pageView(s, pageId, stages): PageView   a world's page: its cards, stars, stamp, what the next page reward is.
//   bookView(s, stages): BookView           every page, the gold cover, earned titles, the Bag tab badge count.
//   titlesEarned(s): string[]               title ids the player may show ('w3', 'all').
//   titleName(id): string                   'Fridge Cook', 'Head Chef' ('' for an unknown id).
//   shownTitle(s): string                   the name of the title being shown, or '' (camp line, online name tag).
//
// Spending drops (the shared SKIP TO BOSS guard: every screen that spends drops calls skipsBrokenBy)
//   stageWants(stage)                       what all of a stage's exits ask for, kind -> n (camp's canSkip sum).
//   canSkipWith(drops, stage)               could this bag pay that stage's SKIP TO BOSS?
//   skipsBrokenBy(drops, spend, stages)     the stages whose skip is affordable now and would not be after `spend`.
//   skipReserve(drops, stages)              kind -> how many to hold back so every affordable skip stays affordable.
//
// Doing (they change `s`; the save.ts wrappers persist)
//   handIn(s, kind, n?): HandInResult       hand in up to n of a drop (default: all the card can still use). Never takes
//                                           more than the card needs for two stars; pays card, page and book rewards the
//                                           moment they are reached. It does not ask: show the warning first if
//                                           cardView().breaks is not empty (HAND IN / KEEP).
//   handInSpares(s, pageId | 'all', stages) hand in everything on a page that no affordable skip needs (never warns).
//   setTitle(s, id | null): boolean         show an earned title, or none.
//   repairCookbook(s)                       load repair for save.drops, cookbook, cookbookPaid and title.
//
// Not here, on purpose: beaten counts (the UI reads statOf(`kill:${kind}`) from src/quests.ts) and art keys
// (`mob-<kind>` is MOBS[kind].art, `drop-<kind>` is dropIcon(kind); CardView carries both).
// Co-op and Free Play need nothing: hand-ins happen at camp on each player's own save, and nothing runs in a stage.
// ======================================================================================================================
import { DROPS, DROP_CHANCE, SPARE_DROP_CHANCE, dropIcon, dropName } from './drops';
import { type Element, resistOf, weakOf } from './elements';
import { MOBS } from './mobs';
import { STAGES, WORLDS, type WorldDef } from './stages';
import type { MobKind, StageDef } from './types';

// ---------- types ----------
/** A drop bag: kind -> count (save.drops, World.drops). */
export type DropBag = Partial<Record<string, number>>;

/** The part of the save the Cookbook reads and writes (Save in src/save.ts fits it). */
export interface CookSave {
  crumbs: number;
  drops?: DropBag;
  /** drops handed in per kind */
  cookbook?: Record<string, number>;
  /** per page id ('1'.., 'all'): the highest page reward level already paid */
  cookbookPaid?: Record<string, number>;
  /** the title shown ('w3', 'all'), or unset */
  title?: string;
}

/** Everything the Cookbook can ever pay. There is no field for a box, an item, a stone or a consumable, and none may be
 *  added (rule B1: drops never change a fight). `title` is a title id ('w3', 'all'). */
export interface CookReward { crumbs: number; stamp?: 'hat' | 'gold'; border?: 'gold'; title?: string }

export interface CookPage { /** '1'..: the world's number as text (the key in cookbookPaid) */ id: string; world: number; /** the world's name, e.g. 'The Fridge' */ name: string; kinds: MobKind[] }
export interface Cookbook {
  pages: CookPage[];
  /** kind -> its page */
  pageOf: Record<string, CookPage>;
  /** the never-wanted kinds: no story exit asks for their drop (they drop at SPARE_DROP_CHANCE and need fewer hand-ins) */
  spare: ReadonlySet<string>;
  /** kind -> the story stages whose exits ask for its drop */
  wantedBy: Record<string, string[]>;
}

/** 0 = not discovered, 1 = discovered, 2 = one star, 3 = two stars. */
export type CardLevel = 0 | 1 | 2 | 3;

export interface CardView {
  kind: MobKind;
  /** page id and world number (the home world) and that world's name */
  page: string; world: number; worldName: string;
  /** the monster's name and art key, its drop's name and icon key */
  name: string; art: string; dropName: string; dropIcon: string;
  level: CardLevel; discovered: boolean; /** 0-2 */ stars: number; /** two stars: the card's gold border */ goldBorder: boolean;
  /** drops handed in so far, and the three numbers for Discovered / one star / two stars */
  handed: number; needs: readonly [number, number, number];
  /** the next level: total needed, how many more, and what reaching it pays (null at two stars) */
  next: { level: CardLevel; need: number; left: number; reward: CookReward } | null;
  /** progress toward the next level, 0-1 (1 at two stars) */
  progress: number;
  /** drops of this kind in the bag */
  bag: number;
  /** how many a tap on HAND IN would take (what the card can still use, at most the bag) */
  usable: number;
  /** how many of those no affordable SKIP TO BOSS needs (what 'hand in all spares' would take) */
  safe: number;
  /** would handing in `usable` reach the next level? (the Bag tab badge counts these) */
  canAdvance: boolean;
  /** stage ids whose SKIP TO BOSS handing in `usable` would break: not empty = show the warning first */
  breaks: string[];
  /** no story exit asks for this drop (it drops at 35% and the card needs 1 / 3 / 8) */
  neverWanted: boolean;
  /** the story stages whose exits ask for it (empty when neverWanted) */
  wantedBy: string[];
  /** its plain drop chance, 0-1 (0.2 or 0.35; an exit that still wants it uses 0.55) */
  dropChance: number;
  weak: Element; resist: Element;
}

export interface PageView {
  id: string; world: number; name: string; cards: CardView[];
  /** every card at one star = 1, at two stars = 2 (as the cards stand now) */
  stars: 0 | 1 | 2;
  /** the highest page reward paid; the map stamp follows it (a stamp earned stays earned) */
  paid: number; stamp: null | 'hat' | 'gold';
  /** cards discovered / at one star or better / at two stars */
  discovered: number; oneStar: number; twoStar: number;
  /** the next page reward still to be paid, and its level (null when both are paid) */
  next: { level: 1 | 2; reward: CookReward } | null;
  /** the title this page gives, and whether it is earned */
  title: { id: string; name: string; earned: boolean };
  /** cards with something to hand in / cards a hand-in would move up a level (the dot on the world chip) */
  canHandIn: number; canAdvance: number;
  /** how many drops 'hand in all spares' would take on this page */
  spares: number;
}

export interface BookView {
  pages: PageView[];
  /** every page at two stars (as the cards stand now) and whether the book reward is paid: the gold cover follows `paid` */
  complete: boolean; paid: boolean; goldCover: boolean;
  /** earned titles, the id shown now (or null) and its name (or '') */
  titles: { id: string; name: string }[]; title: string | null; titleName: string;
  /** cards a hand-in would move up a level: the Bag tab badge */
  badge: number;
  cards: number; discovered: number; oneStar: number; twoStar: number;
}

export interface PaidReward { source: 'card' | 'page' | 'book'; /** the kind, the page id, or 'all' */ id: string; level: number; reward: CookReward }
export interface HandInResult { kind: string; /** drops taken from the bag (0 = refused) */ handed: number; from: CardLevel; to: CardLevel; paid: PaidReward[]; /** crumbs paid in all */ crumbs: number }

// ---------- the book, from data ----------
const STORY = /^\d+-\d+$/;
const wantsCache = new WeakMap<StageDef, Record<string, number>>();
/** What all of a stage's exits ask for: kind -> how many (the price of its SKIP TO BOSS). Empty for a stage with no maps. */
export function stageWants(stage: StageDef): Record<string, number> {
  let need = wantsCache.get(stage);
  if (!need) {
    need = {};
    for (const m of stage.maps ?? []) if (m.goal?.kind === 'collect') for (const q of m.goal.wants) need[q.mob] = (need[q.mob] ?? 0) + q.n;
    wantsCache.set(stage, need);
  }
  return need;
}

/** The kinds with a drop that no story stage's exit asks for. Worked out from the stages, never listed by hand. */
export function neverWantedKinds(stages: readonly StageDef[] = STAGES, drops: Partial<Record<string, unknown>> = DROPS): string[] {
  const wanted = new Set<string>();
  for (const s of stages) if (STORY.test(s.id)) for (const k of Object.keys(stageWants(s))) wanted.add(k);
  return Object.keys(drops).filter(k => drops[k] && !wanted.has(k));
}

/** Pages from data: for each world, the kinds in its pool plus its mimic that have a drop and are not on an earlier page. */
export function buildCookbook(worlds: readonly WorldDef[] = WORLDS, stages: readonly StageDef[] = STAGES, drops: Partial<Record<string, unknown>> = DROPS): Cookbook {
  const pages: CookPage[] = [], pageOf: Record<string, CookPage> = {}, wantedBy: Record<string, string[]> = {};
  for (const w of worlds) {
    const kinds: MobKind[] = [];
    for (const k of [...w.pool.map(([, kind]) => kind), w.mimic]) if (drops[k] && !pageOf[k] && !kinds.includes(k)) kinds.push(k);
    if (!kinds.length) continue;
    const page: CookPage = { id: String(w.id), world: w.id, name: w.name, kinds };
    pages.push(page);
    for (const k of kinds) pageOf[k] = page;
  }
  for (const s of stages) if (STORY.test(s.id)) for (const k of Object.keys(stageWants(s))) (wantedBy[k] ??= []).push(s.id);
  return { pages, pageOf, spare: new Set(neverWantedKinds(stages, drops)), wantedBy };
}

let cached: Cookbook | undefined;
/** The game's book (WORLDS, STAGES, DROPS), built once. */
export function cookbook(): Cookbook { return cached ??= buildCookbook(); }

/** A monster's plain drop chance (not the 55% of a kind its map's exit still wants). */
export function baseDropChance(kind: string, book: Cookbook = cookbook()): number { return book.spare.has(kind) ? SPARE_DROP_CHANCE : DROP_CHANCE; }

// ---------- levels and rewards ----------
/** Drops handed in for Discovered / one star / two stars. */
export const CARD_NEEDS = { wanted: [1, 5, 12], spare: [1, 3, 8] } as const;
export function cardNeeds(kind: string, book: Cookbook = cookbook()): readonly [number, number, number] { return book.spare.has(kind) ? CARD_NEEDS.spare : CARD_NEEDS.wanted; }
const levelFor = (n: number, needs: readonly number[]): CardLevel => needs.filter(v => n >= v).length as CardLevel;
/** A card's level as the save stands (0 not discovered, 1 discovered, 2 one star, 3 two stars). The Garnish reads it. */
export function cardLevel(s: CookSave, kind: string, book: Cookbook = cookbook()): CardLevel { return book.pageOf[kind] ? levelFor(Math.min(whole(s.cookbook?.[kind]), cardNeeds(kind, book)[2]), cardNeeds(kind, book)) : 0; }

/** Paid once, the moment a card reaches the level (1 Discovered, 2 one star, 3 two stars). `world` is the page number. */
export function cardReward(world: number, level: 1 | 2 | 3): CookReward {
  return level === 1 ? { crumbs: 20 + 10 * world } : level === 2 ? { crumbs: 60 + 30 * world } : { crumbs: 150 * world, border: 'gold' };
}
/** Paid once: every card on the page at one star (1) / two stars (2). */
export function pageReward(world: number, level: 1 | 2): CookReward {
  return level === 1 ? { crumbs: 500 * world, stamp: 'hat' } : { crumbs: 1000 * world, stamp: 'gold', title: `w${world}` };
}
/** Paid once: every page at two stars. */
export const BOOK_REWARD: CookReward = { crumbs: 0, title: 'all' };

/** Size of the whole book: drops for one star / two stars on every card, and every crumb it pays. */
export function bookTotals(book: Cookbook = cookbook()): { cards: number; oneStarDrops: number; twoStarDrops: number; crumbs: number } {
  const t = { cards: 0, oneStarDrops: 0, twoStarDrops: 0, crumbs: BOOK_REWARD.crumbs };
  for (const p of book.pages) {
    for (const k of p.kinds) { const n = cardNeeds(k, book); t.cards++; t.oneStarDrops += n[1]; t.twoStarDrops += n[2]; for (const lv of [1, 2, 3] as const) t.crumbs += cardReward(p.world, lv).crumbs; }
    t.crumbs += pageReward(p.world, 1).crumbs + pageReward(p.world, 2).crumbs;
  }
  return t;
}

// ---------- titles ----------
/** 'w3' -> 'Oven Cook' (built from the world's name), 'all' -> 'Head Chef'; '' for an id the book does not know. */
export function titleName(id: string | null | undefined, book: Cookbook = cookbook()): string {
  if (id === 'all') return 'Head Chef';
  const page = typeof id === 'string' && id[0] === 'w' ? book.pages.find(p => p.id === id.slice(1)) : undefined;
  // "The Feast of the Forgotten" -> "Feast Cook": drop the article and any "of the ..." tail so the title stays short
  return page ? `${page.name.replace(/^The\s+/i, '').replace(/\s+of\s+.*$/i, '')} Cook` : '';
}
/** Earned title ids, read from the page rewards already paid (there is no second list). */
export function titlesEarned(s: CookSave, book: Cookbook = cookbook()): string[] {
  const paid = s.cookbookPaid ?? {};
  const out = book.pages.filter(p => (paid[p.id] ?? 0) >= 2).map(p => `w${p.id}`);
  if ((paid.all ?? 0) >= 1) out.push('all');
  return out;
}
/** The name of the title being shown, or '' (unset, or not earned). */
export function shownTitle(s: CookSave, book: Cookbook = cookbook()): string { return s.title && titlesEarned(s, book).includes(s.title) ? titleName(s.title, book) : ''; }
/** Show an earned title (or none with null). False if it is not earned: nothing changes. */
export function setTitle(s: CookSave, id: string | null, book: Cookbook = cookbook()): boolean {
  if (id === null) { delete s.title; return true; }
  if (!titlesEarned(s, book).includes(id)) return false;
  s.title = id; return true;
}

// ---------- the SKIP TO BOSS guard ----------
const whole = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? Math.floor(v) : 0);
/** Could this bag pay the stage's SKIP TO BOSS (every drop every exit asks for)? */
export function canSkipWith(drops: DropBag | undefined, stage: StageDef): boolean {
  const need = Object.entries(stageWants(stage));
  return need.length > 0 && need.every(([k, n]) => whole(drops?.[k]) >= n);
}
/** The stages (of those given: pass the unlocked ones) whose SKIP TO BOSS the bag can pay now and could not after
 *  spending `spend` (kind -> count). Empty = no warning. Each stage is judged by itself, as the stage panel does. */
export function skipsBrokenBy(drops: DropBag | undefined, spend: DropBag, stages: readonly StageDef[]): StageDef[] {
  const after: DropBag = { ...(drops ?? {}) };
  let any = false;
  for (const [k, n] of Object.entries(spend)) if (whole(n)) { after[k] = whole(after[k]) - whole(n); any = true; }
  return any ? stages.filter(s => canSkipWith(drops, s) && !canSkipWith(after, s)) : [];
}
/** How many of each kind to hold back so that every skip the bag can pay now stays payable (the most any one of them asks). */
export function skipReserve(drops: DropBag | undefined, stages: readonly StageDef[]): Record<string, number> {
  const keep: Record<string, number> = {};
  for (const s of stages) if (canSkipWith(drops, s)) for (const [k, n] of Object.entries(stageWants(s))) keep[k] = Math.max(keep[k] ?? 0, n);
  return keep;
}

// ---------- looking ----------
const pageStars = (s: CookSave, p: CookPage, book: Cookbook): 0 | 1 | 2 => {
  const lv = Math.min(...p.kinds.map(k => levelFor(whole(s.cookbook?.[k]), cardNeeds(k, book))));
  return lv >= 3 ? 2 : lv >= 2 ? 1 : 0;
};

/** One card, ready to draw. `stages`: the stages whose skip the player could use (unlocked ones); `reserve` is an
 *  optimisation for callers that draw many cards (skipReserve of the same bag and stages). */
export function cardView(s: CookSave, kind: string, stages: readonly StageDef[] = [], book: Cookbook = cookbook(), reserve: Record<string, number> = skipReserve(s.drops, stages)): CardView | null {
  const page = book.pageOf[kind];
  if (!page) return null;
  const k = kind as MobKind, needs = cardNeeds(kind, book), handed = Math.min(whole(s.cookbook?.[kind]), needs[2]), level = levelFor(handed, needs), bag = whole(s.drops?.[kind]);
  const usable = Math.min(bag, needs[2] - handed), kept = reserve[kind] ?? 0, nd: readonly number[] = needs;
  const next = level < 3 ? { level: (level + 1) as CardLevel, need: nd[level], left: nd[level] - handed, reward: cardReward(page.world, (level + 1) as 1 | 2 | 3) } : null;
  const prev = level > 0 ? nd[level - 1] : 0;
  return {
    kind: k, page: page.id, world: page.world, worldName: page.name,
    name: MOBS[k]?.name ?? kind, art: MOBS[k]?.art ?? `mob-${kind}`, dropName: dropName(k), dropIcon: dropIcon(k),
    level, discovered: level >= 1, stars: Math.max(0, level - 1), goldBorder: level >= 3,
    handed, needs, next, progress: next ? (handed - prev) / (next.need - prev) : 1,
    bag, usable, safe: Math.min(usable, Math.max(0, bag - kept)), canAdvance: !!next && usable >= next.left,
    // only a kind some affordable skip holds back can break one, so most cards skip the search
    breaks: usable > 0 && kept > bag - usable ? skipsBrokenBy(s.drops, { [kind]: usable }, stages).map(st => st.id) : [],
    neverWanted: book.spare.has(kind), wantedBy: book.wantedBy[kind] ?? [], dropChance: baseDropChance(kind, book),
    weak: weakOf(k), resist: resistOf(k),
  };
}

/** A world's page, ready to draw (null for an id that is not a page). */
export function pageView(s: CookSave, pageId: string, stages: readonly StageDef[] = [], book: Cookbook = cookbook(), reserve: Record<string, number> = skipReserve(s.drops, stages)): PageView | null {
  const p = book.pages.find(x => x.id === pageId);
  if (!p) return null;
  const cards = p.kinds.map(k => cardView(s, k, stages, book, reserve)!);
  const paid = Math.min(2, whole(s.cookbookPaid?.[p.id]));
  const title = `w${p.id}`;
  return {
    id: p.id, world: p.world, name: p.name, cards, stars: pageStars(s, p, book), paid, stamp: paid >= 2 ? 'gold' : paid >= 1 ? 'hat' : null,
    discovered: cards.filter(c => c.level >= 1).length, oneStar: cards.filter(c => c.level >= 2).length, twoStar: cards.filter(c => c.level >= 3).length,
    next: paid < 2 ? { level: (paid + 1) as 1 | 2, reward: pageReward(p.world, (paid + 1) as 1 | 2) } : null,
    title: { id: title, name: titleName(title, book), earned: paid >= 2 },
    canHandIn: cards.filter(c => c.usable > 0).length, canAdvance: cards.filter(c => c.canAdvance).length, spares: cards.reduce((a, c) => a + c.safe, 0),
  };
}

/** The whole book, ready to draw. */
export function bookView(s: CookSave, stages: readonly StageDef[] = [], book: Cookbook = cookbook()): BookView {
  const reserve = skipReserve(s.drops, stages);
  const pages = book.pages.map(p => pageView(s, p.id, stages, book, reserve)!);
  const paid = whole(s.cookbookPaid?.all) >= 1, sum = (f: (p: PageView) => number) => pages.reduce((a, p) => a + f(p), 0);
  const shown = s.title && titlesEarned(s, book).includes(s.title) ? s.title : null;
  return {
    pages, complete: pages.length > 0 && pages.every(p => p.stars >= 2), paid, goldCover: paid,
    titles: titlesEarned(s, book).map(id => ({ id, name: titleName(id, book) })), title: shown, titleName: shown ? titleName(shown, book) : '',
    badge: sum(p => p.canAdvance), cards: sum(p => p.cards.length), discovered: sum(p => p.discovered), oneStar: sum(p => p.oneStar), twoStar: sum(p => p.twoStar),
  };
}

// ---------- doing ----------
/** Pay every page and book reward that is due and not yet paid (hand-ins call it; safe to call any time). */
export function settleCookbook(s: CookSave, book: Cookbook = cookbook()): PaidReward[] {
  const out: PaidReward[] = [];
  const pay = (source: PaidReward['source'], id: string, level: number, reward: CookReward) => { s.crumbs += reward.crumbs; out.push({ source, id, level, reward }); };
  for (const p of book.pages) {
    const stars = pageStars(s, p, book), was = whole(s.cookbookPaid?.[p.id]);
    for (let lv = was + 1; lv <= stars; lv++) { pay('page', p.id, lv, pageReward(p.world, lv as 1 | 2)); (s.cookbookPaid ??= {})[p.id] = lv; }
  }
  if (book.pages.length && whole(s.cookbookPaid?.all) < 1 && book.pages.every(p => pageStars(s, p, book) >= 2)) { pay('book', 'all', 1, BOOK_REWARD); (s.cookbookPaid ??= {}).all = 1; }
  return out;
}

/** Hand in up to `n` of a monster's drop from the bag (default: all the card can still use). It never takes more than the
 *  card needs for two stars (past that it is refused: handed 0, nothing lost), and pays each card, page and book reward
 *  once, as it is reached. It changes only s.drops, s.cookbook, s.cookbookPaid and s.crumbs. */
export function handIn(s: CookSave, kind: string, n = Infinity, book: Cookbook = cookbook()): HandInResult {
  const page = book.pageOf[kind], needs = cardNeeds(kind, book);
  const had = Math.min(whole(s.cookbook?.[kind]), needs[2]), from = levelFor(had, needs);
  const res: HandInResult = { kind, handed: 0, from, to: from, paid: [], crumbs: 0 };
  const take = page ? Math.min(whole(s.drops?.[kind]), needs[2] - had, n === Infinity ? Infinity : whole(n)) : 0;
  if (take <= 0) return res;
  const left = whole(s.drops![kind]) - take;
  if (left > 0) s.drops![kind] = left; else delete s.drops![kind];
  (s.cookbook ??= {})[kind] = had + take;
  res.handed = take; res.to = levelFor(had + take, needs);
  for (let lv = from + 1; lv <= res.to; lv++) { const reward = cardReward(page.world, lv as 1 | 2 | 3); s.crumbs += reward.crumbs; res.paid.push({ source: 'card', id: kind, level: lv, reward }); }
  res.paid.push(...settleCookbook(s, book));
  res.crumbs = res.paid.reduce((a, p) => a + p.reward.crumbs, 0);
  return res;
}

/** 'Hand in all spares' on a page (or 'all' pages): every card takes what it can use, but never a drop that a SKIP TO
 *  BOSS the bag can pay now needs, so no skip is broken and no warning is needed. Returns the hand-ins that took something. */
export function handInSpares(s: CookSave, pageId: string, stages: readonly StageDef[], book: Cookbook = cookbook()): HandInResult[] {
  const keep = skipReserve(s.drops, stages), out: HandInResult[] = [];
  for (const p of book.pages) if (pageId === 'all' || p.id === pageId) for (const k of p.kinds) {
    const spare = whole(s.drops?.[k]) - (keep[k] ?? 0);
    if (spare > 0) { const r = handIn(s, k, spare, book); if (r.handed) out.push(r); }
  }
  return out;
}

// ---------- load repair ----------
/** A record of whole numbers: anything else becomes empty / is dropped. */
function counts(v: unknown, ok: (k: string) => boolean, cap: (k: string) => number): Record<string, number> {
  const out: Record<string, number> = {};
  if (!v || typeof v !== 'object' || Array.isArray(v)) return out;
  for (const [k, n] of Object.entries(v as Record<string, unknown>)) { const c = Math.min(whole(n), cap(k)); if (ok(k) && c > 0) out[k] = c; }
  return out;
}
/** The most of one drop a bag keeps (far above anything play reaches; a fuzzed or edited save can say anything). */
export const MAX_DROPS = 9999;
/** Make the Cookbook's fields safe after loading (old saves have none of them; an edited save can hold anything):
 *  kinds that have no drop are removed, a count that is not a whole number 0 or more becomes 0, hand-ins are capped at the
 *  card's two-star number, payment marks are kept only for real pages, and a title that is not earned is cleared. */
export function repairCookbook(s: CookSave, book: Cookbook = cookbook(), drops: Partial<Record<string, unknown>> = DROPS): void {
  if (s.drops !== undefined) s.drops = counts(s.drops, k => !!drops[k], () => MAX_DROPS);
  if (s.cookbook !== undefined) s.cookbook = counts(s.cookbook, k => !!drops[k] && !!book.pageOf[k], k => cardNeeds(k, book)[2]);
  if (s.cookbookPaid !== undefined) s.cookbookPaid = counts(s.cookbookPaid, k => k === 'all' || book.pages.some(p => p.id === k), k => (k === 'all' ? 1 : 2));
  if (s.title !== undefined && (typeof s.title !== 'string' || !titlesEarned(s, book).includes(s.title))) delete s.title;
}
