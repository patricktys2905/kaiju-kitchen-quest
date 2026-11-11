// Gear that changes how you play, not just your numbers:
//  - GEAR SKILL: every weapon gives a 4th button: you fling / lob / roll / slam / rain your actual weapon, with a twist.
//  - PROCS: armour and charms (Rare+) can carry a trigger effect (perfect dodge drops jam, every 6th hit zaps...).
//  - Signature legendaries (items.ts UNIQUES with `skill`) upgrade one of their kaiju's skills.
import { BASES, GRADE_MUL, type Item, fortMul, gradeOf } from './items';
import { BOSS_WEAPONS } from './bossgearData';

export type GearStyle = 'throw' | 'lob' | 'roll' | 'slam' | 'rain' | 'boomerang' | 'burst' | 'trap'
  // boss weapons only
  | 'orbit' | 'dash' | 'chain' | 'meteor' | 'vortex' | 'turret' | 'spin' | 'wave' | 'shield' | 'barrage' | 'pillar' | 'bounce';
export type GearFx = 'burn' | 'freeze' | 'glue' | 'slow' | 'launch' | 'pull' | 'heal' | 'poison' | 'shatter' | 'crumbs';
export interface GearSkill { name: string; style: GearStyle; fx?: GearFx }

/** What each style does: damage × attack (per hit), cooldown, and how it's described. */
export const STYLE: Record<GearStyle, { dmg: number; cd: number; text: string }> = {
  throw: { dmg: 2.2, cd: 7, text: 'Fling it straight ahead, through everything in the way' },
  lob: { dmg: 2.6, cd: 9, text: 'Lob it in an arc; it bursts where it lands' },
  roll: { dmg: 1.2, cd: 10, text: 'Send it rolling along the floor, bumping everything again and again' },
  slam: { dmg: 2.4, cd: 9, text: 'Slam it down: a shockwave runs both ways along the floor' },
  rain: { dmg: 1.1, cd: 12, text: 'Five copies drop from the sky in front of you' },
  boomerang: { dmg: 1.5, cd: 8, text: 'Throw it like a boomerang: it hits on the way out and again on the way back' },
  burst: { dmg: 1.6, cd: 9, text: 'Eight copies burst out all around you in a star' },
  trap: { dmg: 3.4, cd: 9, text: 'Plant it on the floor: it snaps the first monster that steps on it' },
  orbit: { dmg: 0.7, cd: 12, text: 'Three copies circle you for 6 seconds, hitting everything they pass' },
  dash: { dmg: 2.6, cd: 8, text: 'Rush forward with it, untouchable, hitting everything in your path' },
  chain: { dmg: 1.6, cd: 8, text: 'A crackle that jumps from monster to monster (up to 6)' },
  meteor: { dmg: 4.2, cd: 12, text: 'One giant copy crashes down ahead: a huge hit in a big circle' },
  vortex: { dmg: 0.45, cd: 12, text: 'A whirlwind ahead drags monsters in and grinds them for 3 seconds' },
  turret: { dmg: 0.9, cd: 13, text: 'Plant it: it fires at the nearest monster for 6 seconds' },
  spin: { dmg: 0.65, cd: 10, text: 'Spin with it for a moment, hitting all around you again and again' },
  wave: { dmg: 2.3, cd: 8, text: 'A ground wave that rolls far ahead, launching what it hits' },
  shield: { dmg: 0, cd: 14, text: 'A guard that soaks a third of your health for 8 seconds' },
  barrage: { dmg: 1.1, cd: 9, text: 'Six copies fired in a quick fan ahead' },
  pillar: { dmg: 1.7, cd: 10, text: 'Pillars erupt from the floor one after another ahead of you' },
  bounce: { dmg: 1.5, cd: 9, text: 'Bounces along the floor five times, hitting on every bounce' },
};
export const FX_TEXT: Record<GearFx, string> = {
  burn: 'sets monsters on fire', freeze: 'freezes monsters solid', glue: 'glues monsters in place', slow: 'slows monsters down',
  launch: 'launches monsters into the air', pull: 'drags monsters toward you', heal: 'heals you a little per hit',
  poison: 'poisons monsters (damage over time, slowed)', shatter: 'cracks their armour (they take more damage)', crumbs: 'shakes crumbs (and a little health) out of every hit',
};

/** Every weapon's gear skill (keyed by weapon base). */
export const GEAR: Record<string, GearSkill> = {
  spoon: { name: 'Spoon Fling', style: 'throw', fx: 'launch' },
  'w-gob2': { name: 'Vine Snare', style: 'throw', fx: 'pull' },
  'w-gob3': { name: 'Berry Bash', style: 'slam', fx: 'launch' },
  pin: { name: 'Pin Roll', style: 'roll', fx: 'launch' },
  'w-blue2': { name: 'Honey Drip', style: 'lob', fx: 'glue' },
  'w-blue3': { name: 'Hammer Time', style: 'slam', fx: 'slow' },
  skewer: { name: 'Skewer Toss', style: 'throw' },
  'w-pizza2': { name: 'Cutter Wheel', style: 'roll', fx: 'burn' },
  'w-pizza3': { name: 'Grated Cheese Storm', style: 'rain', fx: 'slow' },
  whisk: { name: 'Whisk Whirl', style: 'throw', fx: 'pull' },
  'w-moth2': { name: 'Candy Cloud', style: 'lob', fx: 'slow' },
  'w-moth3': { name: 'Moonmallow Shower', style: 'rain', fx: 'heal' },
  fork: { name: 'Fork Fling', style: 'throw', fx: 'slow' },
  'w-squid2': { name: 'Bubble Bomb', style: 'lob', fx: 'launch' },
  'w-squid3': { name: 'Ink Quill Volley', style: 'rain', fx: 'glue' },
  icepick: { name: 'Ice Pick Plunge', style: 'slam', fx: 'freeze' },
  'w-crab2': { name: 'Nutcracker Snap', style: 'throw', fx: 'launch' },
  'w-crab3': { name: 'Cheddar Quake', style: 'slam', fx: 'glue' },
  fish: { name: 'Fish Slap Toss', style: 'throw', fx: 'freeze' },
  'w-toast2': { name: 'Butter Slide', style: 'roll', fx: 'slow' },
  'w-toast3': { name: 'Scythe Spin', style: 'throw', fx: 'heal' },
  spatula: { name: 'Flip Flame', style: 'lob', fx: 'burn' },
  'w-dump2': { name: 'Chopstick Rain', style: 'rain' },
  'w-dump3': { name: 'Paddle Pound', style: 'slam', fx: 'heal' },
  'w-nori1': { name: 'Spear Toss', style: 'throw', fx: 'burn' },
  'w-nori2': { name: 'Wasabi Bomb', style: 'lob', fx: 'burn' },
  'w-nori3': { name: 'Roll Blade', style: 'roll', fx: 'heal' },
  'w-choco1': { name: 'Mallet Smash', style: 'slam', fx: 'launch' },
  'w-choco2': { name: 'Candy Cane Hook', style: 'throw', fx: 'pull' },
  'w-choco3': { name: 'Fudge Avalanche', style: 'rain', fx: 'glue' },
  'w-hog1': { name: 'Mustard Mortar', style: 'lob', fx: 'glue' },
  'w-hog2': { name: 'Ketchup Lance', style: 'throw', fx: 'burn' },
  'w-hog3': { name: 'Tong Clap', style: 'slam', fx: 'pull' },
  'w-peng1': { name: 'Scoop Bomb', style: 'lob', fx: 'freeze' },
  'w-peng2': { name: 'Wafer Skate', style: 'roll', fx: 'freeze' },
  'w-peng3': { name: 'Cream Hail', style: 'rain', fx: 'freeze' },
  'w-blob1': { name: 'Spoon Splat', style: 'lob', fx: 'glue' },
  'w-blob2': { name: 'Lime Spin', style: 'throw', fx: 'pull' },
  'w-blob3': { name: 'Jelly Rain', style: 'rain', fx: 'heal' },
  'w-fish1': { name: 'Fin Fling', style: 'throw' },
  'w-fish2': { name: 'Oar Smack', style: 'slam', fx: 'launch' },
  'w-fish3': { name: 'Trident Toss', style: 'throw', fx: 'freeze' },
  'w-slo1': { name: 'Straw Jab', style: 'throw', fx: 'slow' },
  'w-slo2': { name: 'Pearl Net', style: 'lob', fx: 'glue' },
  'w-slo3': { name: 'Sleepy Shower', style: 'rain', fx: 'heal' },
  'w-mint1': { name: 'Cone Toss', style: 'throw', fx: 'freeze' },
  'w-mint2': { name: 'Scoop Slam', style: 'slam', fx: 'freeze' },
  'w-mint3': { name: 'Mint Crystal Rain', style: 'rain', fx: 'slow' },
  'w-gum1': { name: 'Gum Glob', style: 'lob', fx: 'glue' },
  'w-gum2': { name: 'Gumball Roll', style: 'roll', fx: 'launch' },
  'w-gum3': { name: 'Gumball Storm', style: 'rain', fx: 'slow' },
  'w-roo1': { name: 'Baton Toss', style: 'throw', fx: 'launch' },
  'w-roo2': { name: 'Server Slam', style: 'slam', fx: 'heal' },
  'w-roo3': { name: 'Whisk Whirlwind', style: 'throw', fx: 'pull' },
  'w-avo1': { name: 'Pestle Pound', style: 'slam', fx: 'glue' },
  'w-avo2': { name: 'Lime Lob', style: 'lob', fx: 'slow' },
  'w-avo3': { name: 'Pit Shower', style: 'rain', fx: 'heal' },
  'w-owl1': { name: 'Chip Fling', style: 'throw' },
  'w-owl2': { name: 'Chili Lance', style: 'throw', fx: 'burn' },
  'w-owl3': { name: 'Piñata Smash', style: 'slam', fx: 'launch' },
  'w-goba': { name: 'Seed Spray', style: 'burst', fx: 'slow' },
  'w-gobb': { name: 'Leafy Boomerang', style: 'boomerang', fx: 'pull' },
  'w-bluea': { name: 'Tin Snap', style: 'trap', fx: 'glue' },
  'w-blueb': { name: 'Hive Burst', style: 'burst', fx: 'glue' },
  'w-pizzaa': { name: 'Pepperoni Boomerang', style: 'boomerang', fx: 'burn' },
  'w-pizzab': { name: 'Topping Burst', style: 'burst', fx: 'burn' },
  'w-motha': { name: 'Glow Snare', style: 'trap', fx: 'slow' },
  'w-mothb': { name: 'Toasty Burst', style: 'burst', fx: 'burn' },
  'w-squida': { name: 'Potion Trap', style: 'trap', fx: 'glue' },
  'w-squidb': { name: 'Coral Boomerang', style: 'boomerang', fx: 'slow' },
  'w-craba': { name: 'Cheddar Boomerang', style: 'boomerang', fx: 'launch' },
  'w-crabb': { name: 'Leaf Burst', style: 'burst', fx: 'slow' },
  'w-toasta': { name: 'Breadstick Burst', style: 'burst', fx: 'burn' },
  'w-toastb': { name: 'Jam Boomerang', style: 'boomerang', fx: 'glue' },
  'w-dumpa': { name: 'Broth Burst', style: 'burst', fx: 'heal' },
  'w-dumpb': { name: 'Steamy Bao Trap', style: 'trap', fx: 'heal' },
  'w-noria': { name: 'Chopstick Boomerang', style: 'boomerang', fx: 'pull' },
  'w-norib': { name: 'Soy Snare', style: 'trap', fx: 'slow' },
  'w-chocoa': { name: 'Cocoa Trap', style: 'trap', fx: 'launch' },
  'w-chocob': { name: 'Truffle Burst', style: 'burst', fx: 'launch' },
  'w-hoga': { name: 'Mustard Trap', style: 'trap', fx: 'glue' },
  'w-hogb': { name: 'Bun Boomerang', style: 'boomerang', fx: 'burn' },
  'w-penga': { name: 'Skate Boomerang', style: 'boomerang', fx: 'freeze' },
  'w-pengb': { name: 'Sprinkle Burst', style: 'burst', fx: 'freeze' },
  'w-avoa': { name: 'Chip Burst', style: 'burst', fx: 'slow' },
  'w-avob': { name: 'Lime Boomerang', style: 'boomerang', fx: 'heal' },
  'w-owla': { name: 'Salsa Trap', style: 'trap', fx: 'burn' },
  'w-owlb': { name: 'Feather Burst', style: 'burst', fx: 'slow' },
  'w-guma': { name: 'Gum Trap', style: 'trap', fx: 'glue' },
  'w-gumb': { name: 'Jawbreaker Boomerang', style: 'boomerang', fx: 'launch' },
  'w-rooa': { name: 'Frosting Burst', style: 'burst', fx: 'launch' },
  'w-roob': { name: 'Cake Boomerang', style: 'boomerang', fx: 'slow' },
  'w-sloa': { name: 'Pillow Trap', style: 'trap', fx: 'slow' },
  'w-slob': { name: 'Bamboo Boomerang', style: 'boomerang', fx: 'pull' },
  'w-minta': { name: 'Scoop Trap', style: 'trap', fx: 'freeze' },
  'w-mintb': { name: 'Choc-Chip Burst', style: 'burst', fx: 'freeze' },
  'w-bloba': { name: 'Jiggle Burst', style: 'burst', fx: 'glue' },
  'w-blobb': { name: 'Gummy Boomerang', style: 'boomerang', fx: 'heal' },
  'w-fisha': { name: 'Hook Boomerang', style: 'boomerang', fx: 'pull' },
  'w-fishb': { name: 'Roe Trap', style: 'trap', fx: 'launch' },
  // late-game tiers 4 / 5
  'w-gob4': { name: 'Thorn Lash', style: 'boomerang', fx: 'pull' }, 'w-gob5': { name: 'Jam Dragon Drop', style: 'slam', fx: 'burn' },
  'w-squid4': { name: 'Potion Splash', style: 'lob', fx: 'freeze' }, 'w-squid5': { name: 'Tesla Coil', style: 'trap', fx: 'launch' },
  'w-crab4': { name: 'Parmesan Pinch', style: 'boomerang', fx: 'glue' }, 'w-crab5': { name: 'Cabbage King Quake', style: 'slam', fx: 'freeze' },
  'w-blob4': { name: 'Gelatin Snare', style: 'trap', fx: 'glue' }, 'w-blob5': { name: 'Jelly Crown Rain', style: 'rain', fx: 'heal' },
  'w-moth4': { name: 'Starlight Sprinkle', style: 'rain', fx: 'slow' }, 'w-moth5': { name: 'Moonmallow Nova', style: 'burst', fx: 'heal' },
  'w-toast4': { name: 'Crouton Flurry', style: 'burst', fx: 'slow' }, 'w-toast5': { name: 'Reaper Toss', style: 'boomerang', fx: 'heal' },
  'w-dump4': { name: 'Bao Moon Drop', style: 'lob', fx: 'heal' }, 'w-dump5': { name: 'Imperial Wok Spin', style: 'roll', fx: 'burn' },
  'w-nori4': { name: 'Salmon Slash', style: 'throw', fx: 'slow' }, 'w-nori5': { name: 'Wasabi Dragon Rain', style: 'rain', fx: 'burn' },
  'w-choco4': { name: 'Brownie Brick Drop', style: 'rain', fx: 'launch' }, 'w-choco5': { name: 'Lava Cake Eruption', style: 'slam', fx: 'burn' },
  'w-gum4': { name: 'Jawbreaker Bowl', style: 'roll', fx: 'launch' }, 'w-gum5': { name: 'Bubble Barrage', style: 'burst', fx: 'glue' },
  'w-blue4': { name: 'Berry Bomb Barrage', style: 'burst', fx: 'glue' }, 'w-blue5': { name: 'Golden Muffin Crush', style: 'slam', fx: 'launch' },
  'w-pizza4': { name: 'Cheese Wheel Run', style: 'roll', fx: 'slow' }, 'w-pizza5': { name: 'Inferno Slice', style: 'throw', fx: 'burn' },
  'w-slo4': { name: 'Boba Pearl Shot', style: 'throw', fx: 'glue' }, 'w-slo5': { name: 'Dream Pillow Thump', style: 'slam', fx: 'slow' },
  'w-avo4': { name: 'Nacho Chip Spin', style: 'boomerang', fx: 'burn' }, 'w-avo5': { name: 'Golden Pit Bomb', style: 'lob', fx: 'heal' },
  'w-fish4': { name: 'Harpoon Hook', style: 'throw', fx: 'pull' }, 'w-fish5': { name: 'River King Wave', style: 'slam', fx: 'freeze' },
  'w-hog4': { name: 'Kebab Javelin', style: 'throw', fx: 'launch' }, 'w-hog5': { name: 'Flaming Fork Trap', style: 'trap', fx: 'burn' },
  'w-mint4': { name: 'Mint Shield Roll', style: 'roll', fx: 'freeze' }, 'w-mint5': { name: 'Glacier Scoop Drop', style: 'lob', fx: 'freeze' },
  'w-peng4': { name: 'Cone Lance Toss', style: 'throw', fx: 'freeze' }, 'w-peng5': { name: 'Blizzard Sundae', style: 'rain', fx: 'freeze' },
  'w-roo4': { name: 'Fudge Uppercut', style: 'slam', fx: 'launch' }, 'w-roo5': { name: 'Champion Combo', style: 'boomerang', fx: 'pull' },
  'w-owl4': { name: 'Churro Star Burst', style: 'burst', fx: 'burn' }, 'w-owl5': { name: 'Pinata Thunder', style: 'rain', fx: 'launch' },
};// boss signature weapons: each its own style + the boss's element
for (const bw of BOSS_WEAPONS) GEAR[bw.base] = { name: bw.skill, style: bw.style as GearStyle, fx: bw.fx as GearFx };


/** Gear skill names for a twist: the effect word + the style's noun, e.g. 'Frosty Lob'. */
const STYLE_NOUN: Record<GearStyle, string> = { throw: 'Fling', lob: 'Lob', roll: 'Roll', slam: 'Slam', rain: 'Shower', boomerang: 'Boomerang', burst: 'Burst', trap: 'Trap', orbit: 'Orbit', dash: 'Rush', chain: 'Chain', meteor: 'Meteor', vortex: 'Vortex', turret: 'Sentry', spin: 'Whirl', wave: 'Wave', shield: 'Guard', barrage: 'Barrage', pillar: 'Pillars', bounce: 'Ricochet' };
const FX_WORD: Record<GearFx, string> = { burn: 'Scorching', freeze: 'Frosty', glue: 'Sticky', slow: 'Syrupy', launch: 'Bouncy', pull: 'Grabby', heal: 'Hearty', poison: 'Spore', shatter: 'Cracking', crumbs: 'Crumbly' };
/** The gear skill a weapon item gives: its rolled twist, or its base weapon's own skill. */
export function gearSkillOf(weapon: Item): GearSkill | undefined {
  const base = GEAR[weapon.base];
  const t = weapon.twist;
  if (!t || !(t.style in STYLE)) return base;
  const style = t.style as GearStyle, fx = t.fx && t.fx in FX_TEXT ? t.fx as GearFx : undefined;
  return { name: `${fx ? FX_WORD[fx] : 'Mighty'} ${base?.name.split(' ')[0] ?? ''} ${STYLE_NOUN[style]}`.replace(/\s+/g, ' ').trim(), style, fx };
}

/** The gear skill a hero gets from its weapon (null = no weapon). power scales damage with rarity, fortification and grade. */
export interface HeroGear extends GearSkill { base: string; icon: string; power: number; dmg: number; cd: number }
export function gearOf(weapon: Item | undefined, icon?: string): HeroGear | null {
  if (!weapon) return null;
  const g = gearSkillOf(weapon);
  if (!g) return null;
  const power = [1, 1.15, 1.3, 1.5, 1.75][weapon.rarity - 1] * fortMul(weapon.plus) * GRADE_MUL[gradeOf(weapon)];
  return { ...g, base: weapon.base, icon: icon ?? BASES[weapon.base].icon, power, dmg: STYLE[g.style].dmg, cd: STYLE[g.style].cd };
}
export function gearText(g: GearSkill): string { return `${STYLE[g.style].text}${g.fx ? `; ${FX_TEXT[g.fx]}` : ''}.`; }
