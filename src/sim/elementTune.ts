// Elemental weaknesses: every number the balance designer tunes (docs/WEAKNESS-DESIGN.md section 3 and 9).
// Rules and tables live in elements.ts, which only reads these. Nothing here changes a hit that carries no element.

/** The six multipliers. A hit that carries an element the monster is weak to / resists: */
export const ELEMENT_TUNE = {
  /** weak hit: damage × this (ordinary monsters, Kings, champions, minibosses, nemeses) */
  weakDmg: 1.4,
  /** weak hit: its freeze / glue / slow lasts × this. (Was 1.5: with a re-seasoned freeze / glue weapon that held a weak
   *  boss-room foe frozen or glued for over 80% of the fight twice as often as before weaknesses, 24 fights in 1800 against 10;
   *  at 1.25 it is 12. Deep Freeze on a Fiery monster: 3.1 s, not 3.75 s. scripts/weak-duel.ts) */
  weakStatus: 1.25,
  /** resisted hit: damage × this */
  resistDmg: 0.7,
  /** resisted hit: its freeze / glue / slow lasts × this */
  resistStatus: 0.5,
  /** world bosses (brain 'boss'): one target, nothing to dilute it, so a smaller swing */
  bossWeakDmg: 1.25,
  bossResistDmg: 0.85,
};

/** Market "Re-season" (set an ordinary weapon's twist effect to HOT / COLD / STICKY): the crumb price is
 *  (base + perLv × item level) × rarity[rarity - 1], rounded, with the gentle fortify rarity curve (items.ts fortCost) so a
 *  Legendary costs 3×, not 12×, a Common.
 *  Sized against what a stage clear pays (scripts/weak-income.ts, skilled bot): crumbs picked up are about 60 per stage level
 *  (35 in a world's first stages, 80 in its last), plus about 15 per level inside the loot boxes. At 40 per level a Common
 *  costs about 0.7 of a clear, an Uncommon 0.9, a Rare 1.1, an Epic 1.5, a Legendary 2: a real choice each stage, not a grind.
 *  (At the first 12 per level a Rare was a third of a clear: free.) */
export const RESEASON_PRICE = { base: 40, perLv: 40, rarity: [1, 1.3, 1.7, 2.2, 3] };
