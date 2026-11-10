// Gear that changes how you play, not just your numbers:
//  - GEAR SKILL: every weapon gives a 4th button: you fling / lob / roll / slam / rain your actual weapon, with a twist.
//  - PROCS: armour and charms (Rare+) can carry a trigger effect (perfect dodge drops jam, every 6th hit zaps...).
//  - Signature legendaries (items.ts UNIQUES with `skill`) upgrade one of their kaiju's skills.
import { BASES, GRADE_MUL, type Item, fortMul, gradeOf } from './items';

export type GearStyle = 'throw' | 'lob' | 'roll' | 'slam' | 'rain';
export type GearFx = 'burn' | 'freeze' | 'glue' | 'slow' | 'launch' | 'pull' | 'heal';
export interface GearSkill { name: string; style: GearStyle; fx?: GearFx }

/** What each style does: damage × attack (per hit), cooldown, and how it's described. */
export const STYLE: Record<GearStyle, { dmg: number; cd: number; text: string }> = {
  throw: { dmg: 2.2, cd: 7, text: 'Fling it straight ahead, through everything in the way' },
  lob: { dmg: 2.6, cd: 9, text: 'Lob it in an arc; it bursts where it lands' },
  roll: { dmg: 1.2, cd: 10, text: 'Send it rolling along the floor, bumping everything again and again' },
  slam: { dmg: 2.4, cd: 9, text: 'Slam it down: a shockwave runs both ways along the floor' },
  rain: { dmg: 1.1, cd: 12, text: 'Five copies drop from the sky in front of you' },
};
export const FX_TEXT: Record<GearFx, string> = {
  burn: 'sets monsters on fire', freeze: 'freezes monsters solid', glue: 'glues monsters in place', slow: 'slows monsters down',
  launch: 'launches monsters into the air', pull: 'drags monsters toward you', heal: 'heals you a little per hit',
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
};

/** Gear skill names for a twist: the effect word + the style's noun, e.g. 'Frosty Lob'. */
const STYLE_NOUN: Record<GearStyle, string> = { throw: 'Fling', lob: 'Lob', roll: 'Roll', slam: 'Slam', rain: 'Shower' };
const FX_WORD: Record<GearFx, string> = { burn: 'Scorching', freeze: 'Frosty', glue: 'Sticky', slow: 'Syrupy', launch: 'Bouncy', pull: 'Grabby', heal: 'Hearty' };
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
