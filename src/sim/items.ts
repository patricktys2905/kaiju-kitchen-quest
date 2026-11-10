// Equipment: rolled from loot boxes (gacha). Slot base + rarity + random stat lines.
// Epic/Legendary can roll "+N to a skill" for any kaiju; Legendary can roll "+1 all skills".
import type { Stat } from './classes';
import { SKILLS } from './skills';
const skillIdsOf = (sp: number) => (SKILLS[sp]?.actives ?? []).map(a => a.id);
import type { BoxTier } from './types';

export type Slot = 'weapon' | 'armor' | 'charm';
export type Rarity = 1 | 2 | 3 | 4 | 5;
export type LineKind = Stat | 'atk' | 'hp' | 'def' | 'crit' | 'critDmg' | 'skillDmg' | 'cdr' | 'speed';

export interface Line { k: LineKind; v: number }
export interface Item {
  id: number;
  base: string;     // key into BASES
  rarity: Rarity;
  ilvl: number;     // item level (from the monsters / stage it came from)
  plus: number;     // fortification +0..+15
  /** grade index into GRADES (D..S); missing on old saves = C */
  grade?: number;
  lines: Line[];
  /** skill id → bonus levels; 'all' = every skill */
  skill?: { id: string; n: number };
  /** set piece (SETS key) */
  set?: string;
  /** named legendary (UNIQUES key) */
  unique?: string;
  /** trigger effect (PROCS key), armour and charms only */
  proc?: string;
  /** weapons: a rolled twist on the weapon's gear skill (style + effect; see gear.ts gearSkillOf) */
  twist?: { style: string; fx?: string };
}

/** Weapon twists: the throwing styles and effects a weapon's gear skill can roll (kept in step with gear.ts STYLE / FX_TEXT). */
export const TWIST_STYLES = ['throw', 'lob', 'roll', 'slam', 'rain', 'boomerang', 'burst', 'trap'] as const;
export const TWIST_FX = ['burn', 'freeze', 'glue', 'slow', 'launch', 'pull', 'heal'] as const;
/** The word a twisted weapon gets in its name (by effect, or by style when it has no effect). */
export const TWIST_WORD: Record<string, string> = {
  burn: 'Scorching', freeze: 'Frosty', glue: 'Sticky', slow: 'Syrupy', launch: 'Bouncy', pull: 'Grabby', heal: 'Hearty',
  throw: 'Flinging', lob: 'Lobbing', roll: 'Tumbling', slam: 'Slamming', rain: 'Showering', boomerang: 'Returning', burst: 'Bursting', trap: 'Snapping',
};
/** How often a (non-legendary) weapon drop rolls a twist. */
export const TWIST_CHANCE = 0.65;

export interface BaseDef { slot: Slot; name: string; icon: string; main: Line[]; minLv?: number; /** only this kaiju can wear it */ for?: number; tier?: number; /** no longer drops */ retired?: boolean; /** always part of this set */ set?: string }
/** main = guaranteed stat at ilvl 1 (scaled by ilvl and rarity) */
const TIER_LV = [0, 6, 14]; // item level each gear tier starts dropping at
const W = (name: string, icon: string, owner: number, tier: number, main: Line[]): BaseDef => ({ slot: 'weapon', name, icon, main, for: owner, minLv: TIER_LV[tier - 1], tier, set: tier === 3 ? `sig${owner}` : undefined });
const AR = (name: string, icon: string, owner: number, main: Line[], tier = 1): BaseDef => ({ slot: 'armor', name, icon, main, for: owner, minLv: TIER_LV[tier - 1], tier, set: tier === 3 ? `sig${owner}` : undefined });
const CH = (name: string, icon: string, owner: number, main: Line[]): BaseDef => ({ slot: 'charm', name, icon, main, for: owner, minLv: 12, set: `sig${owner}` });
export const BASES: Record<string, BaseDef> = {
  // ----- kaiju weapons: 3 tiers each (tier 2 from item level 6, tier 3 from 14); every drop may roll a twist -----
  spoon: W('Wooden Spoon', 'eq-spoon', 0, 1, [{ k: 'atk', v: 4 }]),
  'w-gob2': W('Vine Whip', 'w-gob2', 0, 2, [{ k: 'atk', v: 5 }, { k: 'critDmg', v: 0.08 }]),
  'w-gob3': W('Berry Basher', 'w-gob3', 0, 3, [{ k: 'atk', v: 6 }, { k: 'str', v: 2 }, { k: 'critDmg', v: 0.1 }]),
  pin: W('Rolling Pin', 'eq-pin', 10, 1, [{ k: 'atk', v: 4 }, { k: 'hp', v: 10 }]),
  'w-blue2': W('Honey Dipper Mace', 'w-blue2', 10, 2, [{ k: 'atk', v: 5 }, { k: 'hp', v: 20 }]),
  'w-blue3': W('Blueberry Hammer', 'w-blue3', 10, 3, [{ k: 'atk', v: 6 }, { k: 'vit', v: 2 }, { k: 'hp', v: 25 }]),
  skewer: W('Kebab Skewer', 'eq-skewer', 11, 1, [{ k: 'atk', v: 3 }, { k: 'crit', v: 3 }]),
  'w-pizza2': W('Pizza Cutter Blade', 'w-pizza2', 11, 2, [{ k: 'atk', v: 4 }, { k: 'crit', v: 4 }]),
  'w-pizza3': W('Grater Claws', 'w-pizza3', 11, 3, [{ k: 'atk', v: 5 }, { k: 'dex', v: 2 }, { k: 'crit', v: 5 }]),
  whisk: W('Whisk Wand', 'eq-whisk', 4, 1, [{ k: 'atk', v: 3 }, { k: 'skillDmg', v: 0.05 }]),
  'w-moth2': W('Candy Floss Staff', 'w-moth2', 4, 2, [{ k: 'atk', v: 4 }, { k: 'skillDmg', v: 0.07 }]),
  'w-moth3': W('Moonmallow Wand', 'w-moth3', 4, 3, [{ k: 'atk', v: 5 }, { k: 'int', v: 2 }, { k: 'skillDmg', v: 0.09 }]),
  fork: W('Fork Trident', 'eq-fork', 1, 1, [{ k: 'atk', v: 4 }, { k: 'crit', v: 1 }]),
  'w-squid2': W('Bubble Wand', 'w-squid2', 1, 2, [{ k: 'atk', v: 4 }, { k: 'skillDmg', v: 0.05 }, { k: 'crit', v: 2 }]),
  'w-squid3': W('Ink Quill Trident', 'w-squid3', 1, 3, [{ k: 'atk', v: 6 }, { k: 'int', v: 2 }, { k: 'crit', v: 2 }]),
  icepick: W('Ice Pick', 'eq-icepick', 2, 1, [{ k: 'atk', v: 4 }, { k: 'def', v: 1 }]),
  'w-crab2': W('Nutcracker Pincers', 'w-crab2', 2, 2, [{ k: 'atk', v: 5 }, { k: 'def', v: 2 }]),
  'w-crab3': W('Cheese Cleaver', 'w-crab3', 2, 3, [{ k: 'atk', v: 6 }, { k: 'vit', v: 2 }, { k: 'def', v: 3 }]),
  fish: W('Frozen Fish', 'eq-fish', 5, 1, [{ k: 'atk', v: 3 }, { k: 'crit', v: 3 }]),
  'w-toast2': W('Butter Knife', 'w-toast2', 5, 2, [{ k: 'atk', v: 4 }, { k: 'crit', v: 4 }, { k: 'speed', v: 0.02 }]),
  'w-toast3': W('Toast Scythe', 'w-toast3', 5, 3, [{ k: 'atk', v: 5 }, { k: 'dex', v: 2 }, { k: 'critDmg', v: 0.12 }]),
  spatula: W('Flaming Spatula', 'eq-spatula', 6, 1, [{ k: 'atk', v: 3 }, { k: 'skillDmg', v: 0.05 }]),
  'w-dump2': W('Chopstick Staff', 'w-dump2', 6, 2, [{ k: 'atk', v: 4 }, { k: 'skillDmg', v: 0.06 }, { k: 'hp', v: 10 }]),
  'w-dump3': W('Rice Paddle Club', 'w-dump3', 6, 3, [{ k: 'atk', v: 5 }, { k: 'int', v: 2 }, { k: 'skillDmg', v: 0.08 }]),
  // ----- kaiju signature armor -----
  'a-gob': AR('Leaf Cape', 'a-gob', 0, [{ k: 'def', v: 3 }, { k: 'hp', v: 18 }, { k: 'str', v: 1 }]),
  'a-blue': AR('Muffin Tin Plate', 'a-blue', 10, [{ k: 'def', v: 4 }, { k: 'hp', v: 25 }]),
  'a-pizza': AR('Pizza Box Armor', 'a-pizza', 11, [{ k: 'def', v: 3 }, { k: 'hp', v: 15 }, { k: 'dex', v: 1 }]),
  'a-moth': AR('Silk Cocoon Robe', 'a-moth', 4, [{ k: 'def', v: 2 }, { k: 'hp', v: 15 }, { k: 'int', v: 1 }]),
  'a-squid': AR('Seaweed Wrap', 'a-squid', 1, [{ k: 'def', v: 3 }, { k: 'hp', v: 18 }, { k: 'int', v: 1 }]),
  'a-crab': AR('Cabbage Leaf Plate', 'a-crab', 2, [{ k: 'def', v: 5 }, { k: 'hp', v: 20 }]),
  'a-toast': AR('Crust Cloak', 'a-toast', 5, [{ k: 'def', v: 2 }, { k: 'hp', v: 15 }, { k: 'dex', v: 1 }]),
  'a-dump': AR('Steamer Armor', 'a-dump', 6, [{ k: 'def', v: 3 }, { k: 'hp', v: 22 }]),
  // armor tiers 2 / 3 and signature charms for the first 8
  'a-gob2': AR('Thorny Bark Plate', 'a-gob2', 0, [{ k: 'def', v: 4 }, { k: 'hp', v: 24 }, { k: 'str', v: 1 }], 2), 'a-gob3': AR('Royal Berry Armor', 'a-gob3', 0, [{ k: 'def', v: 5 }, { k: 'hp', v: 30 }, { k: 'str', v: 2 }], 3), 'k-gob': CH('Strawberry Seed', 'k-gob', 0, [{ k: 'critDmg', v: 0.1 }]),
  'a-blue2': AR('Honeycomb Armor', 'a-blue2', 10, [{ k: 'def', v: 5 }, { k: 'hp', v: 32 }], 2), 'a-blue3': AR('Frosted Muffin Mail', 'a-blue3', 10, [{ k: 'def', v: 6 }, { k: 'hp', v: 40 }, { k: 'vit', v: 2 }], 3), 'k-blue': CH('Blueberry Locket', 'k-blue', 10, [{ k: 'hp', v: 30 }]),
  'a-pizza2': AR('Crust Scale Mail', 'a-pizza2', 11, [{ k: 'def', v: 4 }, { k: 'hp', v: 20 }, { k: 'dex', v: 1 }], 2), 'a-pizza3': AR('Molten Cheese Armor', 'a-pizza3', 11, [{ k: 'def', v: 5 }, { k: 'hp', v: 26 }, { k: 'dex', v: 2 }], 3), 'k-pizza': CH('Pepperoni Medallion', 'k-pizza', 11, [{ k: 'crit', v: 4 }]),
  'a-moth2': AR('Moonlit Shawl', 'a-moth2', 4, [{ k: 'def', v: 3 }, { k: 'hp', v: 20 }, { k: 'int', v: 1 }], 2), 'a-moth3': AR('Stardust Gown', 'a-moth3', 4, [{ k: 'def', v: 4 }, { k: 'hp', v: 26 }, { k: 'int', v: 2 }], 3), 'k-moth': CH('Little Lantern', 'k-moth', 4, [{ k: 'skillDmg', v: 0.08 }]),
  'a-squid2': AR('Coral Plate', 'a-squid2', 1, [{ k: 'def', v: 4 }, { k: 'hp', v: 22 }, { k: 'int', v: 1 }], 2), 'a-squid3': AR('Pearl Shell Armor', 'a-squid3', 1, [{ k: 'def', v: 5 }, { k: 'hp', v: 28 }, { k: 'int', v: 2 }], 3), 'k-squid': CH('Lucky Pearl', 'k-squid', 1, [{ k: 'cdr', v: 0.05 }]),
  'a-crab2': AR('Cheese Rind Shell', 'a-crab2', 2, [{ k: 'def', v: 6 }, { k: 'hp', v: 26 }], 2), 'a-crab3': AR('Golden Gouda Plate', 'a-crab3', 2, [{ k: 'def', v: 7 }, { k: 'hp', v: 34 }, { k: 'vit', v: 2 }], 3), 'k-crab': CH('Claw Charm', 'k-crab', 2, [{ k: 'def', v: 4 }]),
  'a-toast2': AR('Toasted Crust Mail', 'a-toast2', 5, [{ k: 'def', v: 3 }, { k: 'hp', v: 20 }, { k: 'dex', v: 1 }], 2), 'a-toast3': AR('Golden Brioche Armor', 'a-toast3', 5, [{ k: 'def', v: 4 }, { k: 'hp', v: 26 }, { k: 'dex', v: 2 }], 3), 'k-toast': CH('Butter Pat', 'k-toast', 5, [{ k: 'speed', v: 0.04 }]),
  'a-dump2': AR('Bamboo Lattice Armor', 'a-dump2', 6, [{ k: 'def', v: 4 }, { k: 'hp', v: 28 }], 2), 'a-dump3': AR('Jade Steamer Plate', 'a-dump3', 6, [{ k: 'def', v: 5 }, { k: 'hp', v: 36 }, { k: 'int', v: 2 }], 3), 'k-dump': CH('Soy Dish', 'k-dump', 6, [{ k: 'skillDmg', v: 0.07 }]),
  // the new kaiju: 3 weapons, 3 armors, a charm each
  'w-nori1': W('Chopstick Spear', 'w-nori1', 7, 1, [{ k: 'atk', v: 3 }, { k: 'skillDmg', v: 0.05 }]), 'w-nori2': W('Wasabi Flame Staff', 'w-nori2', 7, 2, [{ k: 'atk', v: 4 }, { k: 'skillDmg', v: 0.07 }]), 'w-nori3': W('Dragon Roll Blade', 'w-nori3', 7, 3, [{ k: 'atk', v: 5 }, { k: 'int', v: 2 }, { k: 'skillDmg', v: 0.09 }]),
  'a-nori1': AR('Nori Wrap', 'a-nori1', 7, [{ k: 'def', v: 3 }, { k: 'hp', v: 18 }], 1), 'a-nori2': AR('Rice Scale Mail', 'a-nori2', 7, [{ k: 'def', v: 4 }, { k: 'hp', v: 24 }, { k: 'int', v: 1 }], 2), 'a-nori3': AR('Salmon Scale Armor', 'a-nori3', 7, [{ k: 'def', v: 5 }, { k: 'hp', v: 30 }, { k: 'int', v: 2 }], 3), 'k-nori': CH('Soy Fish', 'k-nori', 7, [{ k: 'skillDmg', v: 0.08 }]),
  'w-choco1': W('Chocolate Mallet', 'w-choco1', 8, 1, [{ k: 'atk', v: 5 }]), 'w-choco2': W('Candy Cane Club', 'w-choco2', 8, 2, [{ k: 'atk', v: 6 }, { k: 'critDmg', v: 0.08 }]), 'w-choco3': W('Fudge Crusher', 'w-choco3', 8, 3, [{ k: 'atk', v: 7 }, { k: 'str', v: 2 }, { k: 'critDmg', v: 0.1 }]),
  'a-choco1': AR('Wafer Plate', 'a-choco1', 8, [{ k: 'def', v: 4 }, { k: 'hp', v: 22 }], 1), 'a-choco2': AR('Truffle Armor', 'a-choco2', 8, [{ k: 'def', v: 5 }, { k: 'hp', v: 30 }], 2), 'a-choco3': AR('Golden Foil Armor', 'a-choco3', 8, [{ k: 'def', v: 6 }, { k: 'hp', v: 36 }, { k: 'str', v: 2 }], 3), 'k-choco': CH('Golden Ticket', 'k-choco', 8, [{ k: 'atk', v: 4 }]),
  'w-hog1': W('Mustard Blaster', 'w-hog1', 15, 1, [{ k: 'atk', v: 4 }, { k: 'hp', v: 8 }]), 'w-hog2': W('Ketchup Lance', 'w-hog2', 15, 2, [{ k: 'atk', v: 5 }, { k: 'crit', v: 2 }]), 'w-hog3': W('Grill Tongs', 'w-hog3', 15, 3, [{ k: 'atk', v: 6 }, { k: 'vit', v: 2 }, { k: 'crit', v: 3 }]),
  'a-hog1': AR('Napkin Bib', 'a-hog1', 15, [{ k: 'def', v: 3 }, { k: 'hp', v: 22 }], 1), 'a-hog2': AR('Bun Shell', 'a-hog2', 15, [{ k: 'def', v: 5 }, { k: 'hp', v: 28 }], 2), 'a-hog3': AR('Grill Plate Armor', 'a-hog3', 15, [{ k: 'def', v: 6 }, { k: 'hp', v: 34 }, { k: 'vit', v: 2 }], 3), 'k-hog': CH('Relish Charm', 'k-hog', 15, [{ k: 'def', v: 3 }, { k: 'atk', v: 2 }]),
  'w-peng1': W('Ice Cream Scoop', 'w-peng1', 17, 1, [{ k: 'atk', v: 3 }, { k: 'crit', v: 3 }]), 'w-peng2': W('Wafer Ice Sword', 'w-peng2', 17, 2, [{ k: 'atk', v: 4 }, { k: 'crit', v: 3 }, { k: 'speed', v: 0.02 }]), 'w-peng3': W('Frozen Cream Trident', 'w-peng3', 17, 3, [{ k: 'atk', v: 5 }, { k: 'dex', v: 2 }, { k: 'crit', v: 4 }]),
  'a-peng1': AR('Cookie Crumb Vest', 'a-peng1', 17, [{ k: 'def', v: 2 }, { k: 'hp', v: 16 }, { k: 'dex', v: 1 }], 1), 'a-peng2': AR('Cream Puff Coat', 'a-peng2', 17, [{ k: 'def', v: 3 }, { k: 'hp', v: 22 }, { k: 'dex', v: 1 }], 2), 'a-peng3': AR('Ice Crystal Armor', 'a-peng3', 17, [{ k: 'def', v: 4 }, { k: 'hp', v: 28 }, { k: 'dex', v: 2 }], 3), 'k-peng': CH('Cherry Charm', 'k-peng', 17, [{ k: 'crit', v: 4 }]),
  // the Act 2 kaiju
  'w-avo1': W('Molcajete Pestle', 'w-avo1', 13, 1, [{ k: 'atk', v: 4 }, { k: 'hp', v: 8 }]), 'w-avo2': W('Lime Wedge Mace', 'w-avo2', 13, 2, [{ k: 'atk', v: 5 }, { k: 'skillDmg', v: 0.05 }]), 'w-avo3': W('Golden Pit Staff', 'w-avo3', 13, 3, [{ k: 'atk', v: 6 }, { k: 'int', v: 2 }, { k: 'skillDmg', v: 0.07 }]),
  'a-avo1': AR('Avocado Skin Guard', 'a-avo1', 13, [{ k: 'def', v: 3 }, { k: 'hp', v: 20 }], 1), 'a-avo2': AR('Chip Scale Armor', 'a-avo2', 13, [{ k: 'def', v: 4 }, { k: 'hp', v: 26 }, { k: 'int', v: 1 }], 2), 'a-avo3': AR('Jade Guac Plate', 'a-avo3', 13, [{ k: 'def', v: 5 }, { k: 'hp', v: 32 }, { k: 'int', v: 2 }], 3), 'k-avo': CH('Lime Charm', 'k-avo', 13, [{ k: 'hp', v: 24 }, { k: 'skillDmg', v: 0.04 }]),
  'w-owl1': W('Chip Fan', 'w-owl1', 19, 1, [{ k: 'atk', v: 3 }, { k: 'crit', v: 3 }]), 'w-owl2': W('Chili Spear', 'w-owl2', 19, 2, [{ k: 'atk', v: 4 }, { k: 'crit', v: 4 }]), 'w-owl3': W('Piñata Staff', 'w-owl3', 19, 3, [{ k: 'atk', v: 5 }, { k: 'dex', v: 2 }, { k: 'critDmg', v: 0.1 }]),
  'a-owl1': AR('Tortilla Wrap', 'a-owl1', 19, [{ k: 'def', v: 2 }, { k: 'hp', v: 16 }, { k: 'dex', v: 1 }], 1), 'a-owl2': AR('Fiesta Poncho', 'a-owl2', 19, [{ k: 'def', v: 3 }, { k: 'hp', v: 22 }, { k: 'dex', v: 1 }], 2), 'a-owl3': AR('Golden Husk Armor', 'a-owl3', 19, [{ k: 'def', v: 4 }, { k: 'hp', v: 28 }, { k: 'dex', v: 2 }], 3), 'k-owl': CH('Cilantro Charm', 'k-owl', 19, [{ k: 'crit', v: 4 }]),
  'w-gum1': W('Gum Club', 'w-gum1', 9, 1, [{ k: 'atk', v: 4 }, { k: 'hp', v: 12 }]), 'w-gum2': W('Gumball Flail', 'w-gum2', 9, 2, [{ k: 'atk', v: 5 }, { k: 'hp', v: 20 }]), 'w-gum3': W('Gumball Scepter', 'w-gum3', 9, 3, [{ k: 'atk', v: 6 }, { k: 'vit', v: 2 }, { k: 'hp', v: 26 }]),
  'a-gum1': AR('Wrapper Vest', 'a-gum1', 9, [{ k: 'def', v: 4 }, { k: 'hp', v: 24 }], 1), 'a-gum2': AR('Stretch Gum Mail', 'a-gum2', 9, [{ k: 'def', v: 5 }, { k: 'hp', v: 32 }], 2), 'a-gum3': AR('Gumball Machine Plate', 'a-gum3', 9, [{ k: 'def', v: 6 }, { k: 'hp', v: 40 }, { k: 'vit', v: 2 }], 3), 'k-gum': CH('Lucky Gumball', 'k-gum', 9, [{ k: 'def', v: 3 }, { k: 'hp', v: 20 }]),
  'w-roo1': W('Velvet Baton', 'w-roo1', 18, 1, [{ k: 'atk', v: 4 }, { k: 'crit', v: 2 }]), 'w-roo2': W('Cake Server Blade', 'w-roo2', 18, 2, [{ k: 'atk', v: 5 }, { k: 'critDmg', v: 0.08 }]), 'w-roo3': W('Champion Whisk', 'w-roo3', 18, 3, [{ k: 'atk', v: 6 }, { k: 'str', v: 2 }, { k: 'crit', v: 3 }]),
  'a-roo1': AR('Cupcake Liner Vest', 'a-roo1', 18, [{ k: 'def', v: 3 }, { k: 'hp', v: 18 }, { k: 'str', v: 1 }], 1), 'a-roo2': AR('Velvet Robe', 'a-roo2', 18, [{ k: 'def', v: 4 }, { k: 'hp', v: 24 }, { k: 'dex', v: 1 }], 2), 'a-roo3': AR('Champion Plate', 'a-roo3', 18, [{ k: 'def', v: 5 }, { k: 'hp', v: 30 }, { k: 'str', v: 2 }], 3), 'k-roo': CH('Lucky Glove', 'k-roo', 18, [{ k: 'atk', v: 3 }, { k: 'crit', v: 2 }]),
  'w-slo1': W('Big Straw', 'w-slo1', 12, 1, [{ k: 'atk', v: 4 }, { k: 'skillDmg', v: 0.04 }]), 'w-slo2': W('Pearl Net', 'w-slo2', 12, 2, [{ k: 'atk', v: 5 }, { k: 'skillDmg', v: 0.06 }]), 'w-slo3': W('Golden Tea Whisk', 'w-slo3', 12, 3, [{ k: 'atk', v: 6 }, { k: 'int', v: 2 }, { k: 'skillDmg', v: 0.08 }]),
  'a-slo1': AR('Cup Sleeve Vest', 'a-slo1', 12, [{ k: 'def', v: 3 }, { k: 'hp', v: 20 }], 1), 'a-slo2': AR('Pajama Plate', 'a-slo2', 12, [{ k: 'def', v: 4 }, { k: 'hp', v: 26 }, { k: 'int', v: 1 }], 2), 'a-slo3': AR('Jade Tea Armour', 'a-slo3', 12, [{ k: 'def', v: 5 }, { k: 'hp', v: 32 }, { k: 'int', v: 2 }], 3), 'k-slo': CH('Lucky Pearl Drop', 'k-slo', 12, [{ k: 'cdr', v: 0.04 }, { k: 'hp', v: 16 }]),
  'w-mint1': W('Waffle Lance', 'w-mint1', 16, 1, [{ k: 'atk', v: 4 }, { k: 'def', v: 1 }]), 'w-mint2': W('Scooper Mace', 'w-mint2', 16, 2, [{ k: 'atk', v: 5 }, { k: 'hp', v: 18 }]), 'w-mint3': W('Mint Crystal Staff', 'w-mint3', 16, 3, [{ k: 'atk', v: 6 }, { k: 'vit', v: 2 }, { k: 'skillDmg', v: 0.06 }]),
  'a-mint1': AR('Waffle Guard', 'a-mint1', 16, [{ k: 'def', v: 4 }, { k: 'hp', v: 24 }], 1), 'a-mint2': AR('Choc Dip Plate', 'a-mint2', 16, [{ k: 'def', v: 5 }, { k: 'hp', v: 32 }], 2), 'a-mint3': AR('Sundae Shell Armour', 'a-mint3', 16, [{ k: 'def', v: 7 }, { k: 'hp', v: 38 }, { k: 'vit', v: 2 }], 3), 'k-mint': CH('Choc Chip Charm', 'k-mint', 16, [{ k: 'def', v: 3 }, { k: 'skillDmg', v: 0.04 }]),
  'w-blob1': W('Jelly Spoon', 'w-blob1', 3, 1, [{ k: 'atk', v: 3 }, { k: 'hp', v: 10 }]), 'w-blob2': W('Lime Slicer', 'w-blob2', 3, 2, [{ k: 'atk', v: 4 }, { k: 'skillDmg', v: 0.06 }]), 'w-blob3': W('Jelly Mould Sceptre', 'w-blob3', 3, 3, [{ k: 'atk', v: 5 }, { k: 'int', v: 2 }, { k: 'skillDmg', v: 0.08 }]),
  'a-blob1': AR('Paper Cup Vest', 'a-blob1', 3, [{ k: 'def', v: 3 }, { k: 'hp', v: 22 }], 1), 'a-blob2': AR('Jelly Cube Mail', 'a-blob2', 3, [{ k: 'def', v: 4 }, { k: 'hp', v: 30 }], 2), 'a-blob3': AR('Golden Mould Plate', 'a-blob3', 3, [{ k: 'def', v: 5 }, { k: 'hp', v: 36 }, { k: 'vit', v: 2 }], 3), 'k-blob': CH('Cherry Charm', 'k-blob', 3, [{ k: 'cdr', v: 0.04 }, { k: 'hp', v: 18 }]),
  'w-fish1': W('Fin Blade', 'w-fish1', 14, 1, [{ k: 'atk', v: 4 }, { k: 'crit', v: 2 }]), 'w-fish2': W('Rowing Oar', 'w-fish2', 14, 2, [{ k: 'atk', v: 5 }, { k: 'hp', v: 14 }]), 'w-fish3': W('Lemon Trident', 'w-fish3', 14, 3, [{ k: 'atk', v: 6 }, { k: 'str', v: 2 }, { k: 'critDmg', v: 0.1 }]),
  'a-fish1': AR('Rain Slicker', 'a-fish1', 14, [{ k: 'def', v: 3 }, { k: 'hp', v: 18 }, { k: 'dex', v: 1 }], 1), 'a-fish2': AR('Fishnet Mail', 'a-fish2', 14, [{ k: 'def', v: 4 }, { k: 'hp', v: 24 }, { k: 'str', v: 1 }], 2), 'a-fish3': AR('Silver Scale Armour', 'a-fish3', 14, [{ k: 'def', v: 5 }, { k: 'hp', v: 30 }, { k: 'str', v: 2 }], 3), 'k-fish': CH('Lemon Charm', 'k-fish', 14, [{ k: 'atk', v: 3 }, { k: 'crit', v: 2 }]),
  // ----- new weapon types: a second kaiju weapon from the start (a) and one more from item level 6 (b), each with its own
  // gear skill (mostly the boomerang / burst / trap styles). Icons: scripts/weapons2-jobs.mjs -----
  'w-goba': W('Seed Slingshot', 'w-goba', 0, 1, [{ k: 'atk', v: 4 }, { k: 'crit', v: 3 }]),
  'w-gobb': W('Stem Boomerang', 'w-gobb', 0, 2, [{ k: 'atk', v: 5 }, { k: 'dex', v: 1 }]),
  'w-bluea': W('Muffin Tin Shield', 'w-bluea', 10, 1, [{ k: 'atk', v: 3 }, { k: 'hp', v: 18 }]),
  'w-blueb': W('Honeycomb Club', 'w-blueb', 10, 2, [{ k: 'atk', v: 5 }, { k: 'hp', v: 20 }]),
  'w-pizzaa': W('Pepperoni Chakram', 'w-pizzaa', 11, 1, [{ k: 'atk', v: 3 }, { k: 'crit', v: 3 }]),
  'w-pizzab': W('Crust Sabre', 'w-pizzab', 11, 2, [{ k: 'atk', v: 4 }, { k: 'crit', v: 4 }]),
  'w-motha': W('Lantern Staff', 'w-motha', 4, 1, [{ k: 'atk', v: 3 }, { k: 'skillDmg', v: 0.05 }]),
  'w-mothb': W('S\'more Scepter', 'w-mothb', 4, 2, [{ k: 'atk', v: 4 }, { k: 'skillDmg', v: 0.06 }]),
  'w-squida': W('Test Tube Slinger', 'w-squida', 1, 1, [{ k: 'atk', v: 3 }, { k: 'skillDmg', v: 0.05 }]),
  'w-squidb': W('Coral Boomerang', 'w-squidb', 1, 2, [{ k: 'atk', v: 4 }, { k: 'crit', v: 3 }]),
  'w-craba': W('Cheese Wheel Buckler', 'w-craba', 2, 1, [{ k: 'atk', v: 3 }, { k: 'hp', v: 18 }]),
  'w-crabb': W('Cabbage Flail', 'w-crabb', 2, 2, [{ k: 'atk', v: 5 }, { k: 'hp', v: 15 }]),
  'w-toasta': W('Breadstick Darts', 'w-toasta', 5, 1, [{ k: 'atk', v: 3 }, { k: 'crit', v: 4 }]),
  'w-toastb': W('Jam Knife', 'w-toastb', 5, 2, [{ k: 'atk', v: 4 }, { k: 'critDmg', v: 0.08 }]),
  'w-dumpa': W('Soup Spoon Staff', 'w-dumpa', 6, 1, [{ k: 'atk', v: 3 }, { k: 'skillDmg', v: 0.05 }]),
  'w-dumpb': W('Bao Bun Mace', 'w-dumpb', 6, 2, [{ k: 'atk', v: 4 }, { k: 'hp', v: 15 }]),
  'w-noria': W('Chopstick Boomerang', 'w-noria', 7, 1, [{ k: 'atk', v: 3 }, { k: 'skillDmg', v: 0.05 }]),
  'w-norib': W('Soy Sauce Staff', 'w-norib', 7, 2, [{ k: 'atk', v: 4 }, { k: 'skillDmg', v: 0.06 }]),
  'w-chocoa': W('Cocoa Pod Club', 'w-chocoa', 8, 1, [{ k: 'atk', v: 5 }, { k: 'str', v: 1 }]),
  'w-chocob': W('Truffle Flail', 'w-chocob', 8, 2, [{ k: 'atk', v: 6 }]),
  'w-hoga': W('Mustard Bottle', 'w-hoga', 15, 1, [{ k: 'atk', v: 4 }, { k: 'crit', v: 2 }]),
  'w-hogb': W('Bun Boomerang', 'w-hogb', 15, 2, [{ k: 'atk', v: 5 }, { k: 'hp', v: 10 }]),
  'w-penga': W('Ice Skate Blade', 'w-penga', 17, 1, [{ k: 'atk', v: 3 }, { k: 'crit', v: 3 }]),
  'w-pengb': W('Wafer Fan', 'w-pengb', 17, 2, [{ k: 'atk', v: 4 }, { k: 'skillDmg', v: 0.06 }]),
  'w-avoa': W('Tortilla Shield', 'w-avoa', 13, 1, [{ k: 'atk', v: 3 }, { k: 'hp', v: 18 }]),
  'w-avob': W('Lime Boomerang', 'w-avob', 13, 2, [{ k: 'atk', v: 5 }, { k: 'hp', v: 10 }]),
  'w-owla': W('Salsa Shaker', 'w-owla', 19, 1, [{ k: 'atk', v: 3 }, { k: 'crit', v: 3 }]),
  'w-owlb': W('Feather Fan Blade', 'w-owlb', 19, 2, [{ k: 'atk', v: 4 }, { k: 'crit', v: 4 }]),
  'w-guma': W('Gum Wrapper Whip', 'w-guma', 9, 1, [{ k: 'atk', v: 3 }, { k: 'hp', v: 18 }]),
  'w-gumb': W('Jawbreaker Flail', 'w-gumb', 9, 2, [{ k: 'atk', v: 5 }, { k: 'hp', v: 15 }]),
  'w-rooa': W('Cake Boxing Mitt', 'w-rooa', 18, 1, [{ k: 'atk', v: 5 }]),
  'w-roob': W('Red Velvet Boomerang', 'w-roob', 18, 2, [{ k: 'atk', v: 5 }, { k: 'crit', v: 3 }]),
  'w-sloa': W('Pillow Mace', 'w-sloa', 12, 1, [{ k: 'atk', v: 3 }, { k: 'hp', v: 15 }]),
  'w-slob': W('Bamboo Boomerang', 'w-slob', 12, 2, [{ k: 'atk', v: 4 }, { k: 'skillDmg', v: 0.05 }]),
  'w-minta': W('Waffle Cone Shield', 'w-minta', 16, 1, [{ k: 'atk', v: 3 }, { k: 'hp', v: 18 }]),
  'w-mintb': W('Choc-Chip Flail', 'w-mintb', 16, 2, [{ k: 'atk', v: 5 }]),
  'w-bloba': W('Jelly Spoon', 'w-bloba', 3, 1, [{ k: 'atk', v: 3 }, { k: 'skillDmg', v: 0.05 }]),
  'w-blobb': W('Gummy Ring', 'w-blobb', 3, 2, [{ k: 'atk', v: 4 }, { k: 'hp', v: 15 }]),
  'w-fisha': W('Fishing Rod', 'w-fisha', 14, 1, [{ k: 'atk', v: 4 }, { k: 'crit', v: 3 }]),
  'w-fishb': W('Roe Bomb Pouch', 'w-fishb', 14, 2, [{ k: 'atk', v: 5 }]),
  // ----- generic armor (one per world + the lid) -----
  apron: { slot: 'armor', name: 'Checkered Apron', icon: 'eq-apron', main: [{ k: 'hp', v: 20 }, { k: 'def', v: 2 }] },
  lid: { slot: 'armor', name: 'Pot Lid', icon: 'eq-lid', main: [{ k: 'def', v: 4 }] },
  cozy: { slot: 'armor', name: 'Tea Cozy Vest', icon: 'eq-cozy', main: [{ k: 'hp', v: 30 }, { k: 'def', v: 3 }], minLv: 12 },
  foil: { slot: 'armor', name: 'Foil Plate', icon: 'eq-foil', main: [{ k: 'def', v: 5 }, { k: 'hp', v: 20 }], minLv: 24 },
  mitt: { slot: 'armor', name: 'Oven Mitt', icon: 'eq-mitt', main: [{ k: 'def', v: 3 }, { k: 'atk', v: 1 }], retired: true },
  // ----- charms: everyone can wear these -----
  cookie: { slot: 'charm', name: 'Fortune Cookie', icon: 'eq-cookie', main: [{ k: 'crit', v: 3 }] },
  bell: { slot: 'charm', name: 'Timer Bell', icon: 'eq-bell', main: [{ k: 'cdr', v: 0.04 }] },
  salt: { slot: 'charm', name: 'Salt Crystal', icon: 'eq-salt', main: [{ k: 'skillDmg', v: 0.06 }] },
  snow: { slot: 'charm', name: 'Snowflake Charm', icon: 'eq-snow', main: [{ k: 'cdr', v: 0.05 }, { k: 'crit', v: 2 }], minLv: 12 },
  ember: { slot: 'charm', name: 'Ember Chili', icon: 'eq-ember', main: [{ k: 'skillDmg', v: 0.06 }, { k: 'atk', v: 2 }], minLv: 24 },
};

/** Kaiju that own gear (species numbers). */
export const OWNERS = [...new Set(Object.values(BASES).map(b => b.for).filter((x): x is number => x !== undefined))];
/** Who can wear this item (undefined = anyone). */
export function ownerOf(it: Item): number | undefined { return BASES[it.base]?.for; }
export function canWear(it: Item, species: number): boolean { const o = ownerOf(it); return o === undefined || o === species; }

export const RARITY_NAMES: Record<Rarity, string> = { 1: 'Common', 2: 'Uncommon', 3: 'Rare', 4: 'Epic', 5: 'Legendary' };
export const RARITY_CSS: Record<Rarity, string> = { 1: '#d8d0c8', 2: '#7ee87e', 3: '#6ab8ff', 4: '#c88aff', 5: '#ffb02e' };
const PREFIX: Record<Rarity, string[]> = {
  1: ['Plain', 'Sturdy', 'Trusty'],
  2: ['Polished', 'Zesty', 'Toasty'],
  3: ['Gleaming', 'Spiced', 'Glazed'],
  4: ['Royal', 'Molten', 'Candied'],
  5: ["Grand Chef's", 'Mythic', 'Golden'],
};

export const LINE_NAMES: Record<LineKind, string> = {
  str: 'STR', dex: 'DEX', int: 'INT', vit: 'VIT', atk: 'Attack', hp: 'Max HP', def: 'Defence',
  crit: 'Crit chance', critDmg: 'Crit damage', skillDmg: 'Skill damage', cdr: 'Cooldowns', speed: 'Move speed',
};
const PCT: LineKind[] = ['critDmg', 'skillDmg', 'cdr', 'speed'];

export function lineText(l: Line): string {
  if (PCT.includes(l.k)) return `${l.k === 'cdr' ? '-' : '+'}${Math.round(l.v * 100)}% ${LINE_NAMES[l.k]}`;
  if (l.k === 'crit') return `+${l.v}% ${LINE_NAMES[l.k]}`;
  return `+${l.v} ${LINE_NAMES[l.k]}`;
}

/** Random extra lines: value at item level 1, rounded by kind. */
const EXTRA: { k: LineKind; v: number; w: number }[] = [
  { k: 'str', v: 2, w: 10 }, { k: 'dex', v: 2, w: 10 }, { k: 'int', v: 2, w: 10 }, { k: 'vit', v: 2, w: 10 },
  { k: 'atk', v: 2, w: 8 }, { k: 'hp', v: 12, w: 8 }, { k: 'def', v: 2, w: 6 }, { k: 'crit', v: 2, w: 5 },
  { k: 'critDmg', v: 0.08, w: 4 }, { k: 'skillDmg', v: 0.05, w: 4 }, { k: 'cdr', v: 0.03, w: 3 }, { k: 'speed', v: 0.03, w: 3 },
];

/** Box tier → rarity weights (Common..Legendary). */
const RARITY_WEIGHTS: Record<BoxTier, number[]> = {
  1: [70, 25, 5, 0, 0],
  2: [35, 45, 17, 3, 0],
  3: [5, 35, 45, 13, 2],
  4: [0, 10, 45, 37, 8],
  5: [0, 0, 20, 55, 25],
};

export function rarityFor(tier: BoxTier, rand: () => number): Rarity {
  const w = RARITY_WEIGHTS[tier];
  let r = rand() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < 5; i++) { r -= w[i]; if (r < 0) return (i + 1) as Rarity; }
  return 1;
}

function pick<T>(arr: T[], rand: () => number): T { return arr[Math.floor(rand() * arr.length) % arr.length]; }

const scaleV = (k: LineKind, v: number) => PCT.includes(k) ? Math.round(v * 100) / 100 : Math.max(1, Math.round(v));

/** Roll a piece of equipment. skillIds = every skill id in the game (for skill-boost lines). */
/** Pick what kind of item drops: weapon 45% (always kaiju-specific), armor 30% (55% kaiju-specific), charm 25%.
 *  Kaiju-specific gear goes to a random kaiju; prefer (the hero you're playing) only gets a small extra chance. */
export function rollBase(ilvl: number, rand: () => number, prefer = -1): string {
  const ok = (k: string) => !BASES[k].retired && (BASES[k].minLv ?? 0) <= ilvl;
  const owner = () => (prefer >= 0 && rand() < 0.25 ? prefer : OWNERS[Math.floor(rand() * OWNERS.length) % OWNERS.length]);
  const r = rand();
  let pool: string[];
  if (r < 0.45) {
    const o = owner();
    pool = Object.keys(BASES).filter(k => ok(k) && BASES[k].slot === 'weapon' && BASES[k].for === o);
    const best = Math.max(...pool.map(k => BASES[k].tier ?? 1));
    if (rand() < 0.6) pool = pool.filter(k => (BASES[k].tier ?? 1) === best); // the newest tier is the usual drop
  } else if (r < 0.75) {
    const o = rand() < 0.6 ? owner() : undefined;
    pool = Object.keys(BASES).filter(k => ok(k) && BASES[k].slot === 'armor' && BASES[k].for === o);
    const best = Math.max(...pool.map(k => BASES[k].tier ?? 1));
    if (o !== undefined && rand() < 0.6) pool = pool.filter(k => (BASES[k].tier ?? 1) === best);
  } else {
    const o = rand() < 0.35 ? owner() : undefined;
    pool = Object.keys(BASES).filter(k => ok(k) && BASES[k].slot === 'charm' && BASES[k].for === o);
    if (!pool.length) pool = Object.keys(BASES).filter(k => ok(k) && BASES[k].slot === 'charm' && BASES[k].for === undefined);
  }
  if (!pool.length) pool = Object.keys(BASES).filter(k => !BASES[k].retired && !BASES[k].minLv); // safety net: a starter piece
  return pick(pool, rand);
}

export function rollItem(id: number, tier: BoxTier, ilvl: number, rand: () => number, skillIds: string[], prefer = -1): Item {
  if (!Number.isFinite(ilvl) || ilvl < 1) ilvl = 1; // never roll from a broken item level (no gear would qualify)
  const rarity = rarityFor(tier, rand);
  const base = rollBase(ilvl, rand, prefer);
  // skill-boost lines on kaiju gear only name that kaiju's skills
  const own = BASES[base].for;
  if (own !== undefined && skillIds.length) { const mine = skillIdsOf(own); if (mine.length) skillIds = mine; }
  const lvlMul = 1 + 0.15 * (ilvl - 1);
  const rarMul = [1, 1.25, 1.55, 1.9, 2.4][rarity - 1];
  const lines: Line[] = BASES[base].main.map(l => ({ k: l.k, v: scaleV(l.k, l.v * (PCT.includes(l.k) || l.k === 'crit' ? rarMul : lvlMul * rarMul)) }));
  // rarity 1 → 0 extra lines … rarity 5 → 4 extra lines
  for (let i = 0; i < rarity - 1; i++) {
    const tot = EXTRA.reduce((a, e) => a + e.w, 0);
    let r = rand() * tot;
    const e = EXTRA.find(e => (r -= e.w) < 0) ?? EXTRA[0];
    const pct = PCT.includes(e.k) || e.k === 'crit';
    const v = scaleV(e.k, e.v * (pct ? 1 : lvlMul) * (0.8 + rand() * 0.6) * (1 + 0.15 * (rarity - 2)));
    const same = lines.find(l => l.k === e.k);
    if (same) same.v = scaleV(e.k, same.v + v); else lines.push({ k: e.k, v });
  }
  const it: Item = { id, base, rarity, ilvl, plus: 0, lines, grade: rollGrade(rand, rarity) };
  if (rarity === 5 && rand() < 0.3) it.skill = { id: 'all', n: 1 };
  else if (rarity >= 4 && rand() < 0.6) it.skill = { id: pick(skillIds, rand), n: rarity === 5 ? 2 : 1 };
  // set pieces (Rare+), from the set of the world this item level belongs to
  if (BASES[base].set) it.set = BASES[base].set;
  else if (rarity >= 3 && rand() < 0.25) it.set = setForLevel(ilvl);
  // named legendaries
  // a kaiju's own signature legendaries turn up on its own gear (more often when it's the kaiju you're playing)
  const sig = own !== undefined ? Object.keys(UNIQUES).filter(k => UNIQUES[k].for === own && UNIQUES[k].slot === BASES[base].slot) : [];
  if (sig.length && rarity >= 4 && rand() < (rarity === 5 ? 0.45 : 0.12) * (own === prefer ? 1.6 : 0.6)) it.unique = pick(sig, rand);
  else if (rarity === 5 && rand() < 0.35) {
    const u = Object.keys(UNIQUES).filter(k => UNIQUES[k].slot === BASES[base].slot && UNIQUES[k].for === undefined);
    if (u.length) it.unique = pick(u, rand);
  }
  // trigger effects on armour and charms
  if (BASES[base].slot !== 'weapon' && rand() < [0, 0, 0.2, 0.5, 0.8][rarity - 1]) it.proc = pick(Object.keys(PROCS), rand);
  // weapons: most drops twist their gear skill (a new style and/or effect), so the same weapon can play many ways
  if (BASES[base].slot === 'weapon' && !it.unique && rand() < TWIST_CHANCE) {
    const style = TWIST_STYLES[Math.floor(rand() * TWIST_STYLES.length)];
    const fx = rand() < 0.85 ? TWIST_FX[Math.floor(rand() * TWIST_FX.length)] : undefined;
    it.twist = { style, ...(fx ? { fx } : {}) };
  }
  return it;
}

export function itemName(it: Item): string {
  if (it.unique) return `${UNIQUES[it.unique].name}${it.plus ? ` +${it.plus}` : ''}`;
  const pre = it.twist ? TWIST_WORD[it.twist.fx ?? it.twist.style] ?? PREFIX[it.rarity][0] : PREFIX[it.rarity][it.id % PREFIX[it.rarity].length];
  return `${pre} ${BASES[it.base].name}${it.plus ? ` +${it.plus}` : ''}`;
}

export function gradeOf(it: Item): number { return it.grade ?? 1; }

/** Lines including grade and fortification. */
export function itemLines(it: Item): Line[] {
  const m = fortMul(it.plus) * GRADE_MUL[gradeOf(it)];
  return it.lines.map(l => ({ k: l.k, v: scaleV(l.k, l.v * m) }));
}

/** Crumbs (currency) from salvaging an item, and the cost of the next enhancement. */
export function salvageValue(it: Item): number { return Math.round((4 + it.ilvl) * [1, 2, 5, 12, 30][it.rarity - 1] * (1 + it.plus * 0.5) * GRADE_MUL[gradeOf(it)]); }

// ---------- grading ----------
/** Grades scale every stat line of an item. */
export const GRADES = ['D', 'C', 'B', 'A', 'S'];
export const GRADE_MUL = [0.85, 1, 1.12, 1.25, 1.4];
export const GRADE_CSS = ['#a89898', '#e0e0e0', '#7ee87e', '#7ac0ff', '#ffb02e'];
/** Grade odds when an item is found or re-graded; rarer items lean higher. */
export function gradeWeights(rarity: Rarity): number[] { return [30, 36, 22, 9, 3].map((w, i) => w * Math.pow(1 + 0.12 * (rarity - 1), i)); }
export function rollGrade(rand: () => number, rarity: Rarity, floor = 0): number {
  const w = gradeWeights(rarity).map((x, i) => (i < floor ? 0 : x));
  let r = rand() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < w.length; i++) { r -= w[i]; if (r < 0) return i; }
  return floor;
}

// ---------- fortification ----------
export const MAX_PLUS = 15;
/** Stat multiplier from fortification: +6% per level to +10, then +10% per level. */
export function fortMul(plus: number): number { return 1 + 0.06 * Math.min(plus, 10) + 0.1 * Math.max(0, plus - 10); }
/** Success chance of going from +plus to +plus+1. */
export function fortChance(plus: number): number { return [1, 1, 1, 1, 1, 0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.28, 0.22, 0.16, 0.1][plus] ?? 0; }
/** Failing from +7 or higher drops one level (a Safety Charm prevents it). */
export function fortRisky(plus: number): boolean { return plus >= 7; }
export function fortCost(it: Item): { crumbs: number; stones: number } {
  return { crumbs: Math.round((10 + it.ilvl * 2) * (1 + it.plus * 0.8) * [1, 1.3, 1.7, 2.2, 3][it.rarity - 1]), stones: 1 + Math.floor(it.plus / 5) };
}
/** kept for older callers */
export function enhanceCost(it: Item): number { return fortCost(it).crumbs; }

// ---------- sets ----------
export interface SetDef { name: string; world: number; two: string; three: string; b2: SetBonus; b3: SetBonus }
export interface SetBonus { atkPct?: number; hpPct?: number; critDmg?: number; speed?: number; skillDmg?: number; cdr?: number; dr?: number; ultGain?: number; ultDmg?: number }
export const SETS: Record<string, SetDef> = {
  champ: { name: 'Countertop Champion', world: 1, two: '+8% attack', three: '+25% crit damage, +8% speed', b2: { atkPct: 0.08 }, b3: { critDmg: 0.25, speed: 0.08 } },
  frost: { name: 'Frostbite Guard', world: 2, two: '+12% max HP', three: '-15% damage taken, +10% skill damage', b2: { hpPct: 0.12 }, b3: { dr: 0.15, skillDmg: 0.1 } },
  pantry: { name: 'Pantry Raider', world: 4, two: '+12% attack', three: '+15% max HP, -10% cooldowns', b2: { atkPct: 0.12 }, b3: { hpPct: 0.15, cdr: 0.1 } },
  ...Object.fromEntries(([[0, 'Gobzilla'], [10, 'Bluebeary'], [11, 'Pizzaraptor'], [4, 'Mothball'], [1, 'Squidgeon'], [2, 'Crabbage'], [5, 'Toastbat'], [6, 'Dumplord'], [7, 'Norigon'], [8, 'Chocomunch'], [15, 'Hotchog'], [17, 'Pengwhip'], [13, 'Avocadrake'], [19, 'Tacowl'], [9, 'Bubblegumbo'], [18, 'Velvaroo'], [12, 'Sloba'], [16, 'Minturtle'], [3, 'Bloblin'], [14, 'Salmonster']] as [number, string][]).map(([sp, n]) => [`sig${sp}`, {
    name: `${n}'s Regalia`, world: 0, two: '+15% skill damage', three: 'Ultimate charges 50% faster and hits 25% harder',
    b2: { skillDmg: 0.15 }, b3: { ultGain: 0.5, ultDmg: 0.25 } } as SetDef])),
  feast: { name: 'Feast of Friends', world: 10, two: '+20% skill damage, +10% max HP', three: '+25% attack, ultimate charges 30% faster', b2: { skillDmg: 0.2, hpPct: 0.1 }, b3: { atkPct: 0.25, ultGain: 0.3 } },
  market: { name: 'Best Before', world: 9, two: '+15% attack, +8% speed', three: '+25% crit damage, -12% damage taken', b2: { atkPct: 0.15, speed: 0.08 }, b3: { critDmg: 0.25, dr: 0.12 } },
  garden: { name: 'Green Thumb', world: 8, two: '+12% max HP, -10% cooldowns', three: '+20% skill damage, -10% damage taken', b2: { hpPct: 0.12, cdr: 0.1 }, b3: { skillDmg: 0.2, dr: 0.1 } },
  bbq: { name: 'Pitmaster', world: 7, two: '+15% crit damage, +10% max HP', three: '+20% attack, +15% skill damage', b2: { critDmg: 0.15, hpPct: 0.1 }, b3: { atkPct: 0.2, skillDmg: 0.15 } },
  dining: { name: 'Fine Dining', world: 6, two: '+15% skill damage, +8% speed', three: '+20% attack, -10% cooldowns', b2: { skillDmg: 0.15, speed: 0.08 }, b3: { atkPct: 0.2, cdr: 0.1 } },
  sink: { name: 'Deep Clean', world: 5, two: '+15% attack', three: '+20% max HP, -15% damage taken', b2: { atkPct: 0.15 }, b3: { hpPct: 0.2, dr: 0.15 } },
  inferno: { name: 'Inferno Chef', world: 3, two: '+10% skill damage', three: '-12% cooldowns, +12% attack', b2: { skillDmg: 0.1 }, b3: { cdr: 0.12, atkPct: 0.12 } },
};
export function setForLevel(ilvl: number): string { return ilvl >= 107 ? 'feast' : ilvl >= 97 ? 'market' : ilvl >= 85 ? 'garden' : ilvl >= 73 ? 'bbq' : ilvl >= 61 ? 'dining' : ilvl >= 49 ? 'sink' : ilvl >= 37 ? 'pantry' : ilvl >= 25 ? 'inferno' : ilvl >= 13 ? 'frost' : 'champ'; }

// ---------- named legendaries ----------
// Signature legendaries: two per kaiju (a weapon and an armour), each upgrading one of that kaiju's skills.
const SIG = (name: string, slot: Slot, sp: number, skill: string, mod: SkillMod, effect: string): UniqueDef => ({ name, slot, for: sp, skill, mod, effect, icon: `u-${name.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')}` });
const SIGS: Record<string, UniqueDef> = {
  jamcrown: SIG('Jam Crown Scepter', 'weapon', 0, 'jamspin', { n: 3, glue: true }, 'Jam Tornado spins longer and glues monsters in place'),
  seedpod: SIG('Hot Seedpod Shell', 'armor', 0, 'seed', { reach: 1.4, burn: 2 }, 'Seed Spray reaches 40% further and sets monsters on fire'),
  berrybasket: SIG('Berry Bomb Basket', 'weapon', 10, 'mines', { n: 3, dmg: 1.15 }, 'Berry Mines throws 6 berries instead of 3'),
  frostquake: SIG('Brain-Freeze Bonnet', 'armor', 10, 'quake', { freeze: true, reach: 1.2 }, 'Muffin Quake freezes everything it hits'),
  deepdish: SIG('Deep-Dish Disc', 'weapon', 11, 'pspin', { echo: true, burn: 2 }, 'Pizza Cutter Toss throws a second hot cutter right after'),
  delivery: SIG('Hot Delivery Bag', 'armor', 11, 'slice', { cd: 0.65, burn: 2 }, 'Slice Dash comes back 35% faster and leaves monsters burning'),
  moonfan: SIG('Moonbeam Fan', 'weapon', 4, 'fan', { n: 4, slow: true }, 'Sugar Fan throws 9 darts that slow monsters'),
  lantern: SIG('Lantern Heart', 'armor', 4, 'nova', { reach: 1.4, leech: 0.2 }, 'Marshmallow Nova is 40% bigger and heals you for a fifth of its damage'),
  eightarm: SIG('Eight-Arm Gauntlet', 'weapon', 1, 'ink', { n: 2, glue: true }, 'Tentacle Lash hits twice more and sticks monsters in place'),
  flaskbelt: SIG('Bubbling Flask Belt', 'armor', 1, 'wave', { n: 3, freeze: true }, 'Bubbling Flasks throws 3 more flasks that freeze'),
  goudaclaw: SIG('Gouda Grand Claw', 'weapon', 2, 'snap', { dmg: 1.6, ky: 1.6 }, 'Claw Counter hits 60% harder and sends monsters flying'),
  cabbagecrown: SIG('Cabbage Crown', 'armor', 2, 'crash', { reach: 1.5, glue: true }, 'Cheddar Pounce lands in a 50% bigger cheesy splat that glues'),
  toasterfang: SIG('Toaster Fangs', 'weapon', 5, 'toastado', { n: 6, burn: 2 }, 'Toast Rain drops 6 more slices, piping hot'),
  crumbcloak: SIG('Crumb Cloak', 'armor', 5, 'butter', { cd: 0.6, dmg: 1.4 }, 'Shadow Toast comes back 40% faster and hits 40% harder'),
  steamcrown: SIG('Bamboo Steamer Crown', 'weapon', 6, 'steam', { reach: 1.5, burn: 2 }, 'Steam Cloud is 50% bigger and scalds'),
  soupladle: SIG('Royal Soup Ladle', 'armor', 6, 'soup', { dmg: 1.4, cd: 0.75 }, 'Soup Slurp slurps 40% harder and comes back sooner'),
  wasabiheart: SIG('Wasabi Heart Blade', 'weapon', 7, 'wasabi', { n: 3, burn: 3 }, 'Wasabi Breath burns longer and leaves monsters on fire'),
  onigiri: SIG('Onigiri Halo', 'armor', 7, 'roll', { n: 2, slow: true }, 'Rice Ball Ring adds 2 more rice balls that slow monsters'),
  goldbar: SIG('Golden Bar Gauntlets', 'weapon', 8, 'chocoslam', { dmg: 1.5, ky: 1.5 }, 'Choco Suplex hits 50% harder and higher'),
  fudgecore: SIG('Molten Fudge Core', 'armor', 8, 'melt', { reach: 1.3, glue: true }, 'Melt Charge leaves monsters stuck in fudge'),
  picnicnet: SIG('Picnic Net Launcher', 'weapon', 15, 'mustard', { n: 2, dmg: 1.3 }, 'Mustard Glue fires 5 blobs instead of 3'),
  grillmaster: SIG('Grillmaster Apron', 'armor', 15, 'grillspin', { n: 6, burn: 2 }, 'Quill Burst fires 16 red-hot quills'),
  sundae: SIG('Sundae Scepter', 'weapon', 17, 'snowball', { dmg: 1.4, freeze: true }, 'Rolling Snowball hits 40% harder and freezes'),
  wobblecrown: SIG('Wobble Crown', 'armor', 3, 'wobble', { cd: 0.65 }, 'Wobble Shield comes back 35% sooner'),
  cherryspoon: SIG('Cherry Bomb Spoon', 'weapon', 3, 'clones', { n: 2, dmg: 1.3 }, 'Jelly Clones makes four clones that hit 30% harder'),
  paddle: SIG('Upstream Paddle', 'weapon', 14, 'upstream', { dmg: 1.4, cd: 0.75 }, 'Upstream Leap hits 40% harder and comes back sooner'),
  lurevest: SIG('Lucky Lure Vest', 'armor', 14, 'salmonswarm', { n: 3, burn: 2 }, 'Salmon Swarm sends seven grilled-hot salmon'),
  dreamstraw: SIG('Dream Catcher Straw', 'weapon', 12, 'nap', { reach: 1.5, dmg: 1.4 }, 'Power Nap wakes up with a shockwave 50% bigger and 40% stronger'),
  snuggle: SIG('Snuggle Hammock Mail', 'armor', 12, 'vineswing', { cd: 0.7, glue: true }, 'Vine Swing comes back sooner and glues everything it swings through'),
  triplescoop: SIG('Triple Scoop Shield', 'armor', 16, 'scoop', { n: 2 }, 'Scoop Lob throws three scoops at once'),
  brainfreezecone: SIG('Brain Freeze Cone', 'weapon', 16, 'wafflewall', { cd: 0.7, freeze: true }, 'Waffle Wall freezes monsters that bump into it, and comes back sooner'),
  bubbleblower: SIG('Biggest Bubble Blower', 'weapon', 9, 'bubbletrap', { n: 2, dmg: 1.3 }, 'Bubble Trap seals four monsters and pops 30% harder'),
  gumheart: SIG('Gumball Machine Heart', 'armor', 9, 'gumballs', { n: 2, cd: 0.75 }, 'Gumball Bounce fires five gumballs and comes back sooner'),
  goldengloves: SIG('Golden Gloves', 'weapon', 18, 'flurry', { dmg: 1.4, burn: 2 }, 'One-Two Flurry hits 40% harder with red-hot gloves'),
  champbelt: SIG('Championship Belt', 'armor', 18, 'hops', { reach: 1.4, glue: true }, 'Triple Hop shockwaves are 40% wider and leave monsters stuck'),
  guacbowl: SIG('Holy Guacamole Bowl', 'weapon', 13, 'guacpool', { reach: 1.5, dmg: 1.3 }, 'Guac Pool spreads 50% wider and hits harder'),
  pitplate: SIG('Pit of Destiny Plate', 'armor', 13, 'pithurl', { n: 2, dmg: 1.3 }, 'Pit Hurl bounces five times and hits 30% harder'),
  tuesday: SIG('Taco Tuesday Calendar', 'weapon', 19, 'salsabomb', { n: 3, burn: 3 }, 'Salsa Bombs drops six bombs that burn longer'),
  fiestacape: SIG('Midnight Fiesta Cape', 'armor', 19, 'screech', { reach: 1.4, cd: 0.7 }, 'Night Screech reaches 40% further and comes back sooner'),
  cherrybomb: SIG('Cherry Bomb Vest', 'armor', 17, 'slide', { cd: 0.7, burn: 2 }, 'Belly Slide comes back sooner and leaves a fiery trail of hurt'),
};
export interface UniqueDef { name: string; slot: Slot; effect: string;
  /** signature legendary: only this kaiju's gear, upgrades this skill with these changes, has its own icon */
  for?: number; skill?: string; mod?: SkillMod; icon?: string }
/** How a signature legendary changes a skill: × damage / reach / cooldown, + count, + status on hit, cast again (echo). */
export interface SkillMod { dmg?: number; reach?: number; cd?: number; n?: number; burn?: number; freeze?: boolean; glue?: boolean; slow?: boolean; leech?: number; echo?: boolean; ky?: number }
export const UNIQUES: Record<string, UniqueDef> = {
  momspoon: { name: "Grandma's Spoon", slot: 'weapon', effect: 'Combo finishers heal 4% max HP' },
  excalifork: { name: 'Excalifork', slot: 'weapon', effect: 'Critical hits fire a bonus seed bolt' },
  frostfish: { name: 'Brain-Freeze Fish', slot: 'weapon', effect: 'Hits slow monsters by 40% for 2s' },
  phoenix: { name: 'Phoenix Apron', slot: 'armor', effect: 'Once per stage, survive a knockout at 1 HP' },
  thornlid: { name: 'Thornshell Lid', slot: 'armor', effect: 'Reflects 30% of damage taken back at the attacker' },
  lucky: { name: 'Lucky Fortune Cookie', slot: 'charm', effect: '+50% crumbs from monsters' },
  hourglass: { name: 'Egg-Timer Hourglass', slot: 'charm', effect: 'Each kill cuts skill cooldowns by 1s' },
  ...SIGS,
};

/** The icon to draw for an item (signature legendaries have their own). */
export function itemIcon(it: Item): string { return (it.unique && UNIQUES[it.unique]?.icon) || BASES[it.base].icon; }

// ---------- trigger effects (procs) ----------
export interface ProcDef { name: string; effect: string }
export const PROCS: Record<string, ProcDef> = {
  jamtrap: { name: 'Jam Trap', effect: 'A perfect dodge leaves a sticky jam mine behind' },
  zap: { name: 'Static Whisk', effect: 'Every 6th hit zaps up to 3 nearby monsters' },
  bubble: { name: 'Bubble Wrap', effect: 'Dropping below 35% HP blows a shield bubble (once every 25s)' },
  spikes: { name: 'Pineapple Skin', effect: 'Getting hit fires a ring of spikes (every 3s at most)' },
  snack: { name: 'Snack Break', effect: 'Every kill heals 3% max HP' },
  rush: { name: 'Sugar High', effect: 'Every 25-hit combo: +25% attack and speed for 5s' },
  frosty: { name: 'Brain Freeze', effect: 'Critical hits freeze monsters for a moment' },
  quake: { name: 'Belly Flop', effect: 'Landing from a big fall makes a shockwave' },
};
