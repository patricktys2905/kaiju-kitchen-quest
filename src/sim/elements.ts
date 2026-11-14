// Elemental weaknesses (docs/WEAKNESS-DESIGN.md): four elements, four monster types, one type per monster.
//   melt the cold, chill the hot, crack the hard, stick the quick.
// This file is the rules and the tables; the numbers are in elementTune.ts; world.ts applies them (search `hitEls`).
//
// THE `hit` EVENT (types.ts SimEvent, relayed to online guests untouched inside the snapshot message's `ev` list):
//   { t: 'hit', x, y, dmg, crit, target, el?, w? }
//   el  the element the hit carried ('HOT' | 'COLD' | 'STICKY' | 'CRUNCH'). Missing = a plain hit (combo, finisher,
//       launcher, air attack, an untagged skill, a hazard, a hit on a hero): never weak, never resisted.
//   w   1 = the monster is WEAK to it (damage already multiplied: show the big coloured number and "WEAK!"),
//       -1 = it RESISTS it (damage already reduced: small grey number and "RESIST"). Missing = neither.
//   Both are only ever set on target 'mob'. Burn ticks are hits too (el 'HOT', and w when the monster cares).
//   `dmg` is always the final number. Teammates' events also carry `hi` (hero index) as before.
//
// HOW A HIT GETS ITS ELEMENT (first that applies):
//   1. the skill's own tag (SkillDef.el), on every hit of that skill: direct hits, its shots, zones, mines, bubbles;
//   2. else the effects the hit carries: burn -> HOT, freeze -> COLD, glue / slow -> STICKY, shatter -> CRUNCH,
//      poison -> HOT or STICKY (whichever is better for the player against that monster);
//   3. Guard Break (DOWN + attack) is CRUNCH.
//   When a hit carries several elements the best one for the player counts (weak > neutral > resisted).
//   freeze / glue / slow started by that hit last longer on a weak monster and shorter on a resisting one.
import { ELEMENT_TUNE, RESEASON_PRICE } from './elementTune';
import { GEAR, type GearSkill, STYLE, gearSkillOf } from './gear';
import { BASES, type Item, type SkillMod } from './items';
import { MOBS, nemesisOf } from './mobs';
import { type SkillDef, type SkillKind, applyMod } from './skills';
import type { MobKind, StageDef } from './types';

export type Element = 'HOT' | 'COLD' | 'STICKY' | 'CRUNCH';
/** display order (the stage panel line reads 🔥 ❄️ 🔨 🍬) */
export const ELEMENTS: Element[] = ['HOT', 'COLD', 'CRUNCH', 'STICKY'];
export const ELEMENT_INFO: Record<Element, { name: string; icon: string; color: string; /** what counts, for tooltips */ text: string }> = {
  HOT: { name: 'Hot', icon: '🔥', color: '#ff7a3c', text: 'burning and poison' },
  COLD: { name: 'Cold', icon: '❄️', color: '#7fd4ff', text: 'freezing, ice and snow' },
  STICKY: { name: 'Sticky', icon: '🍬', color: '#ff8af4', text: 'glue, slows and poison' },
  CRUNCH: { name: 'Crunch', icon: '🔨', color: '#e8e0c8', text: 'Guard Break (DOWN + attack) and armour-cracking hits' },
};

export type MonsterType = 'MELTY' | 'FIERY' | 'CRUSTY' | 'SLIPPERY';
/** Weak and resist always come in these pairs, so a player learns four things, not 209. */
export const MONSTER_TYPES: Record<MonsterType, { name: string; weakTo: Element; resists: Element; hint: string }> = {
  MELTY: { name: 'Melty', weakTo: 'HOT', resists: 'COLD', hint: 'frozen, dairy, mouldy, paper, plastic, wax, leafy' },
  FIERY: { name: 'Fiery', weakTo: 'COLD', resists: 'HOT', hint: 'hot, greasy, spicy, steaming, fizzy' },
  CRUSTY: { name: 'Crusty', weakTo: 'CRUNCH', resists: 'STICKY', hint: 'shells, crockery, cans, crackers, armour' },
  SLIPPERY: { name: 'Slippery', weakTo: 'STICKY', resists: 'CRUNCH', hint: 'hoppers, flyers, burrowers, chargers, wobbly things' },
};

// ---------- the type of every monster ----------
// Checked against the real MOBS list by scripts/weak-table.ts and tests/elements.test.ts. Kings (k<monster>) and stage-5
// champions (x<monster>) are NOT listed: they inherit from their base monster (typeOf), so a new one can't be forgotten.
const set = (t: MonsterType, s: string): [string, MonsterType][] => s.split(' ').map(k => [k, t]);
const BASE_TYPE: Record<string, MonsterType> = Object.fromEntries([
  // ordinary monsters
  ...set('MELTY', 'bun garlic icepop cheesemouse pea yogurt marsh noodle raisin straw duck glove scrub napkin skewer corn caterpillar boxbot coupon bag cracker2 floss snowcone'),
  ...set('FIERY', 'pepper bacon popcorn sausage imp kettle soda bubble candle gravy roast firefly charcoal patty ketchup peapod tomato scanner cadet toffee churro pretzel'),
  ...set('CRUSTY', 'salt egg carrot pickle crumbcube meatball cracker cheerio can plate mug fork ladle teapot beetle snail pumpkin can2 melon cherrysoldier fruitknight coconut jawbreaker'),
  ...set('SLIPPERY', 'jamhop worm ant icebat jelly milk mitt bee flour eel teacake wasp toadstool ladybug mole radish banana trolley pudding peel bumper'),
  // summons and splits: the same type as whoever calls them (one answer for a boss and its adds). The Great Flosso calls
  // Floss Wisps (floss, an ordinary Melty monster above), so he is Melty too
  ...set('SLIPPERY', 'jellybit crouton lid'), ...set('CRUSTY', 'minicheerio'), ...set('MELTY', 'sporeling sprout'), ...set('FIERY', 'chunk'),
  // mimics
  ...set('CRUSTY', 'mimic'), ...set('MELTY', 'cereal'),
  // world bosses
  ...set('CRUSTY', 'toast jar fruitcake'), ...set('MELTY', 'golem moldking brussels flosso'), ...set('FIERY', 'dragon meatloaf'), ...set('SLIPPERY', 'stale tupper'),
  // minibosses (typed by their name)
  ...set('CRUSTY', 'm1a m1d m2c m3b m3e m4b m5c m6c m6d m7c m8b m9c m9e m10c m11b'),
  ...set('FIERY', 'm1b m2e m3a m4d m4e m5e m6a m6b m7a m8a m8c m9d m10e m11c'),
  ...set('MELTY', 'm1c m2a m2d m3c m4c m5a m7b m7d m8e m9b m10a m11e'),
  ...set('SLIPPERY', 'm1e m2b m3d m4a m5b m5d m6e m7e m8d m9a m10b m10d m11a m11d'),
  // nemeses: weak to what their rival kaiju is best at (never resisting it)
  ...set('CRUSTY', 'nbeet ncrow npine nlamp nshroom nslug ncookie nbrulee nshark ngorilla nbear'), ...set('MELTY', 'nrat nginger nhornet'),
  ...set('SLIPPERY', 'nkebab nnacho nmouse nbird ngelato'), ...set('FIERY', 'nhare'),
]);
/** The monster a King or champion is a bigger version of (kbun -> bun, xegg -> egg); undefined for everything else. */
export function baseKindOf(kind: MobKind): MobKind | undefined {
  if (kind in BASE_TYPE || !/^[kx]/.test(kind)) return undefined;
  const base = kind.slice(1) as MobKind;
  return base in MOBS && MOBS[base].art === MOBS[kind]?.art ? base : undefined;
}
const typeOrNone = (kind: MobKind): MonsterType | undefined => BASE_TYPE[kind] ?? BASE_TYPE[baseKindOf(kind) ?? ''];
/** Monster kinds with no type (must be empty: the test and scripts/weak-table.ts fail loudly otherwise). */
export function untypedKinds(): MobKind[] { return (Object.keys(MOBS) as MobKind[]).filter(k => !typeOrNone(k)); }
/** A monster's type. (An untyped kind would count as Crusty, weak to the Guard Break everyone has; there are none.) */
export function typeOf(kind: MobKind): MonsterType { return typeOrNone(kind) ?? 'CRUSTY'; }
/** The element this monster is weak to / resists. (`Mob.weak` in world.ts is something else: the armour-broken timer.) */
export function weakOf(kind: MobKind): Element { return MONSTER_TYPES[typeOf(kind)].weakTo; }
export function resistOf(kind: MobKind): Element { return MONSTER_TYPES[typeOf(kind)].resists; }
/** 1 = weak to this element, -1 = resists it, 0 = neither. */
export function affinity(kind: MobKind, el: Element): 1 | 0 | -1 { const t = MONSTER_TYPES[typeOf(kind)]; return t.weakTo === el ? 1 : t.resists === el ? -1 : 0; }

// ---------- effects -> elements ----------
/** Which element(s) each on-hit effect counts as (gear.ts GearFx, items.ts TWIST_FX, SkillDef / SkillMod flags).
 *  launch, pull, heal and crumbs are utility: never an element. */
export const FX_ELEMENTS: Record<string, Element[]> = {
  burn: ['HOT'], freeze: ['COLD'], glue: ['STICKY'], slow: ['STICKY'], shatter: ['CRUNCH'], poison: ['HOT', 'STICKY'],
};
/** Elements a list of effects carries, without repeats (empty = a plain hit). */
export function elementsOfFx(fx: string | readonly string[] | undefined | null): Element[] {
  const out: Element[] = [];
  for (const f of typeof fx === 'string' ? [fx] : fx ?? []) for (const e of FX_ELEMENTS[f] ?? []) if (!out.includes(e)) out.push(e);
  return out;
}
/** Skill mechanics that ARE a status, whatever the skill is called (so tree skills built on them count too). */
const KIND_ELEMENT: Partial<Record<SkillKind, Element>> = {
  goo: 'STICKY', jiggle: 'STICKY', swing: 'STICKY', slowtime: 'STICKY', guac: 'STICKY', guacflood: 'STICKY', jellyquake: 'STICKY',
  scoop: 'COLD', freeze: 'COLD', slide: 'COLD', blizzard: 'COLD', sundae: 'COLD',
  drop: 'HOT', firefloor: 'HOT',
};
/** The element(s) every hit of a skill carries: its own `el` tag, else what its mechanic and its on-hit statuses are.
 *  Pass the skill as it is cast (branch, tree and signature upgrades applied), or a base skill plus `mod`. */
export function elementsOfSkill(sk: SkillDef, mod?: SkillMod): Element[] {
  const s = mod ? applyMod(sk, mod) : sk;
  if (s.el) return [s.el];
  const out: Element[] = [];
  const add = (e: Element | undefined | false) => { if (e && !out.includes(e)) out.push(e); };
  add(KIND_ELEMENT[s.kind]); add(!!s.burn && 'HOT'); add(!!s.freeze && 'COLD'); add((!!s.glue || !!s.slow) && 'STICKY');
  return out;
}
/** A skill's main element for a single icon (undefined = a neutral skill). */
export function elementOfSkill(sk: SkillDef, mod?: SkillMod): Element | undefined { return elementsOfSkill(sk, mod)[0]; }
/** The element(s) of a gear skill (GEAR entry, HeroGear, or gearSkillOf(item)). */
export function elementsOfGearSkill(g: Pick<GearSkill, 'fx'> | null | undefined): Element[] { return elementsOfFx(g?.fx); }
/** The element(s) of a weapon's gear skill: its twist if it has one, else its base weapon's skill (boss weapons included).
 *  Mold Crown (poison) weapons give ['HOT', 'STICKY']. Armour and charms give []. */
export function elementsOfGear(it: Item | null | undefined): Element[] {
  return it && BASES[it.base]?.slot === 'weapon' ? elementsOfGearSkill(gearSkillOf(it)) : [];
}
/** A weapon's main element for a single icon (undefined = no element). */
export function elementOfGear(it: Item | null | undefined): Element | undefined { return elementsOfGear(it)[0]; }
/** Guard Break (DOWN + attack): every kaiju has it from Lv 1. */
export const GUARD_BREAK_ELEMENT: Element = 'CRUNCH';

// ---------- a hit against a monster ----------
/** Which of the elements a hit carries counts against this monster (the best for the player), and how:
 *  w 1 = weak, -1 = resisted, 0 = neither. undefined = the hit carries no element. */
export function pickElement(kind: MobKind, els: readonly Element[] | undefined | null): { el: Element; w: 1 | 0 | -1 } | undefined {
  if (!els?.length) return undefined;
  let best: { el: Element; w: 1 | 0 | -1 } | undefined;
  for (const el of els) { const w = affinity(kind, el); if (!best || w > best.w) best = { el, w }; }
  return best;
}
/** Damage multiplier of a weak (w 1) / resisted (w -1) hit; world bosses (brain 'boss') swing less. */
export function elementDmgMul(kind: MobKind, w: number): number {
  if (!w) return 1;
  const boss = MOBS[kind].brain === 'boss';
  return w > 0 ? (boss ? ELEMENT_TUNE.bossWeakDmg : ELEMENT_TUNE.weakDmg) : (boss ? ELEMENT_TUNE.bossResistDmg : ELEMENT_TUNE.resistDmg);
}
/** How long a freeze / glue / slow from a weak / resisted hit lasts. */
export function elementStatusMul(w: number): number { return w > 0 ? ELEMENT_TUNE.weakStatus : w < 0 ? ELEMENT_TUNE.resistStatus : 1; }

// ---------- stage summary (stage panel, Daily Dungeon card, online room, pause menu) ----------
export interface StageElements {
  /** the stage's monster kinds, each once: a map stage's respawning monsters (StageMap.spawns.kinds), else the monsters
   *  placed and sent in waves. The boss-room foe and mimics are not counted. */
  kinds: MobKind[];
  /** how many of those kinds are weak to each element (all four keys, 0 when none) */
  weak: Record<Element, number>;
  /** the same counts as a list, biggest first, zeroes dropped: ready for "Weak: 🔥×4 🍬×3 🔨×2" */
  order: { el: Element; n: number }[];
  /** the boss-room foe: a world boss, the stage's miniboss / King / champion, or (stage 5 of Worlds 1-5, with `species`)
   *  that kaiju's nemesis. undefined when the stage has no such foe (most Endless floors). */
  boss?: { kind: MobKind; weakTo: Element; resists: Element; worldBoss: boolean };
}
/** What a stage is weak to. Works for story stages, bonus stages (S-n), and Free Play stages (Daily, Endless, Boss Rush):
 *  anything that is a StageDef. Pass the kaiju's species to get its nemesis as the stage-5 boss (as the game does). */
export function stageElements(stage: StageDef, species?: number): StageElements {
  const seen = new Set<MobKind>();
  for (const mp of stage.maps ?? []) for (const k of mp.spawns?.kinds ?? []) seen.add(k);
  // the boss-room foe: the world boss, else a map stage's first monster, else the last elite placed or sent in a wave
  const waveMobs = (stage.arenas ?? []).flatMap(a => a.waves.flat());
  const foe = stage.mobs.find(m => MOBS[m.kind]?.brain === 'boss') ?? (stage.maps ? stage.mobs[0] : undefined)
    ?? [...stage.mobs, ...waveMobs].reverse().find(m => m.elite);
  // a stage of maps is its respawning monsters; anything else (Endless floors, boss rooms) is what is placed and sent in
  if (!stage.maps) for (const m of [...stage.mobs, ...waveMobs]) if (m !== foe && MOBS[m.kind]?.brain !== 'mimic') seen.add(m.kind);
  let foeKind = foe?.kind;
  const nem = species !== undefined ? nemesisOf(species) : undefined;
  if (foeKind && nem && !stage.boss && stage.id.endsWith('-5') && stage.world <= 5) foeKind = nem; // world.ts: the nemesis takes the elite's place
  if (foeKind) seen.delete(foeKind);
  const kinds = [...seen];
  const weak: Record<Element, number> = { HOT: 0, COLD: 0, STICKY: 0, CRUNCH: 0 };
  for (const k of kinds) weak[weakOf(k)]++;
  const order = ELEMENTS.map(el => ({ el, n: weak[el] })).filter(x => x.n > 0).sort((a, b) => b.n - a.n);
  return { kinds, weak, order, boss: foeKind ? { kind: foeKind, weakTo: weakOf(foeKind), resists: resistOf(foeKind), worldBoss: MOBS[foeKind].brain === 'boss' } : undefined };
}
/** Does a skill / weapon with these elements fit this stage? 'boss' = its boss-room foe is weak to one of them,
 *  'mobs' = it hits the stage's most common weakness, null = no (the green tick in the kit screens). */
export function stageMatch(els: readonly Element[], s: StageElements): 'boss' | 'mobs' | null {
  if (s.boss && els.includes(s.boss.weakTo)) return 'boss';
  return s.order.length && els.some(e => s.weak[e] === s.order[0].n) ? 'mobs' : null;
}

// ---------- Market "Re-season" (the rules; save.ts reseason() pays for it and saves) ----------
/** The twist effect each element writes into the existing Item.twist.fx (CRUNCH can't be bought: Guard Break has it). */
export const RESEASON_FX: Partial<Record<Element, 'burn' | 'freeze' | 'glue'>> = { HOT: 'burn', COLD: 'freeze', STICKY: 'glue' };
export const RESEASON_ELEMENTS = Object.keys(RESEASON_FX) as Element[];
/** Ordinary weapons only: not a boss weapon, not a named legendary (those never carry a twist: their name and skill are fixed). */
export function canReseason(it: Item | null | undefined): boolean {
  return !!it && BASES[it.base]?.slot === 'weapon' && !BASES[it.base].boss && !it.unique && !!GEAR[it.base];
}
export function reseasonCost(it: Item): number {
  return Math.round((RESEASON_PRICE.base + RESEASON_PRICE.perLv * it.ilvl) * RESEASON_PRICE.rarity[it.rarity - 1]);
}
/** The twist a re-season would leave on the weapon: the new effect on its current style (a weapon with no twist keeps its
 *  base weapon's own style), or null when it can't be done (not an ordinary weapon, CRUNCH, or it already has that effect). */
export function reseasonTwist(it: Item, el: Element): { style: string; fx: string } | null {
  const fx = RESEASON_FX[el];
  if (!fx || !canReseason(it)) return null;
  const style = it.twist && it.twist.style in STYLE ? it.twist.style : GEAR[it.base].style;
  if (it.twist?.style === style && it.twist.fx === fx) return null;
  return { style, fx };
}
/** Apply it (no cost here). The gear skill (gearSkillOf) and the item's name (itemName) both read Item.twist, so
 *  "Rolling Pin" with Pin Roll becomes "Frosty Rolling Pin" with Frosty Pin Roll. Returns false if nothing changed. */
export function reseasonItem(it: Item, el: Element): boolean {
  const t = reseasonTwist(it, el);
  if (!t) return false;
  it.twist = t;
  return true;
}
