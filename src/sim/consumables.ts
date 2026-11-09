// Consumables: potions and boosts for the 4-slot quick bag, plus camp-only items (stat cube, skill reset).
// Second Helping revives you automatically when you're knocked out (if you own one).

export type ConsumableId = 'jam' | 'bigjam' | 'pepper' | 'ice' | 'bean' | 'revive' | 'sugar' | 'scroll';
export type BoostKind = 'atk' | 'def' | 'speed' | 'cdr';

export interface ConsumableDef {
  id: ConsumableId; name: string; icon: string; desc: string;
  price: number;
  /** usable from the quick bag during a stage */
  quick: boolean;
  heal?: number;             // fraction of max HP
  boost?: { kind: BoostKind; v: number; t: number };
}

export const CONSUMABLES: Record<ConsumableId, ConsumableDef> = {
  jam: { id: 'jam', name: 'Jam Jar', icon: 'c-jam', desc: 'Heals 30% HP', price: 25, quick: true, heal: 0.3 },
  bigjam: { id: 'bigjam', name: 'Big Jam Jar', icon: 'c-bigjam', desc: 'Heals 60% HP', price: 70, quick: true, heal: 0.6 },
  pepper: { id: 'pepper', name: 'Spicy Pepper', icon: 'c-pepper', desc: '+30% attack for 30s', price: 60, quick: true, boost: { kind: 'atk', v: 0.3, t: 30 } },
  ice: { id: 'ice', name: 'Ice Cube', icon: 'c-ice', desc: '-30% damage taken for 30s', price: 60, quick: true, boost: { kind: 'def', v: 0.3, t: 30 } },
  bean: { id: 'bean', name: 'Espresso Bean', icon: 'c-bean', desc: '+20% speed and faster cooldowns for 20s', price: 70, quick: true, boost: { kind: 'speed', v: 0.2, t: 20 } },
  revive: { id: 'revive', name: 'Second Helping', icon: 'c-revive', desc: 'Auto-revives you with 50% HP when knocked out', price: 250, quick: false },
  sugar: { id: 'sugar', name: 'Golden Sugar Cube', icon: 'c-sugar', desc: 'Use at camp: +1 permanent stat of your choice', price: 0, quick: false },
  scroll: { id: 'scroll', name: 'Recipe Scroll', icon: 'c-scroll', desc: 'Use at camp: refunds all skill points of a hero', price: 400, quick: false },
};

export const QUICK_CD = 3; // shared potion cooldown (s)
export const QUICK_SLOTS = 4;
