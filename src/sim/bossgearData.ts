// Boss signature weapons: every world boss drops one weapon made for each kaiju (10 x 20 = 200). Each has its own gear
// skill: one of 20 styles (no kaiju gets the same style twice; no boss gives two kaiju the same one) with the boss's element.
// Items: items.ts (BASES 'bw-<boss>-<ref>'); skills: gear.ts (GEAR); art: scripts/bossgear-jobs.mjs; drops: save.ts finishStage.

export const BOSS_ORDER = ['toast', 'golem', 'dragon', 'jar', 'moldking', 'stale', 'brussels', 'meatloaf', 'tupper', 'fruitcake'] as const;
/** kaiju (in a fixed order) -> [art ref, weapon noun] */
export const BW_KAIJU: [number, string, string][] = [
  [0, 'gob', 'Club'], [10, 'blue', 'Hammer'], [11, 'pizza', 'Blade'], [4, 'moth', 'Wand'], [1, 'squid', 'Staff'], [2, 'crab', 'Pincers'], [5, 'toast', 'Daggers'],
  [6, 'dump', 'Paddle'], [7, 'nori', 'Glaive'], [8, 'choco', 'Gauntlets'], [15, 'hog', 'Lance'], [17, 'peng', 'Lance'], [13, 'avo', 'Spear'], [19, 'owl', 'Wand'],
  [9, 'gum', 'Mace'], [18, 'roo', 'Gloves'], [12, 'slo', 'Bo Staff'], [16, 'mint', 'Shield'], [3, 'blob', 'Whip'], [14, 'fish', 'Harpoon'],
];
/** boss -> [weapon name prefix, skill adjective, element] */
export const BW_BOSS: Record<string, [string, string, string]> = {
  toast: ['Toast King\'s', 'Burnt', 'burn'], golem: ['Frostbite', 'Frozen', 'freeze'], dragon: ['Grease Dragon', 'Dragonfire', 'burn'],
  jar: ['Cookie Jar', 'Cookie', 'crumbs'], moldking: ['Mold Crown', 'Spore', 'poison'], stale: ['Stale Knight', 'Stale', 'shatter'],
  brussels: ['Baron\'s', 'Sprout', 'launch'], meatloaf: ['Mystery', 'Gravy', 'glue'], tupper: ['Tupperwraith', 'Phantom', 'pull'], fruitcake: ['Fruitcake', 'Candied', 'heal'],
};
export const ALL_STYLES = ['throw', 'lob', 'roll', 'slam', 'rain', 'boomerang', 'burst', 'trap', 'orbit', 'dash', 'chain', 'meteor', 'vortex', 'turret', 'spin', 'wave', 'shield', 'barrage', 'pillar', 'bounce'] as const;
export const STYLE_NAME: Record<string, string> = {
  throw: 'Fling', lob: 'Lob', roll: 'Roll', slam: 'Quake', rain: 'Rain', boomerang: 'Boomerang', burst: 'Starburst', trap: 'Snap Trap', orbit: 'Orbit',
  dash: 'Rush', chain: 'Chain', meteor: 'Meteor', vortex: 'Vortex', turret: 'Sentry', spin: 'Whirl', wave: 'Wave', shield: 'Guard', barrage: 'Barrage', pillar: 'Pillars', bounce: 'Ricochet',
};
export interface BossWeapon { base: string; boss: string; species: number; ref: string; name: string; skill: string; style: string; fx: string }
export const BOSS_WEAPONS: BossWeapon[] = BOSS_ORDER.flatMap((boss, bi) => BW_KAIJU.map(([species, ref, noun], ki) => {
  const style = ALL_STYLES[(ki + 7 * bi) % ALL_STYLES.length];
  const [pre, adj, fx] = BW_BOSS[boss];
  return { base: `bw-${boss}-${ref}`, boss, species, ref, name: `${pre} ${noun}`, skill: `${adj} ${STYLE_NAME[style]}`, style, fx };
}));
export const bossWeaponFor = (boss: string, species: number): BossWeapon | undefined => BOSS_WEAPONS.find(w => w.boss === boss && w.species === species);
