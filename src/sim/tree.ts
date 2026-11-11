// Skill trees: every kaiju has 3 themed paths (power / guard / craft). Each path is a chain of rows:
//   1 stat (5 ranks) · 2 stat (5) · 3 NEW ACTIVE SKILL (needs 5 points in the path) · 4 stat (5) · 5 upgrade to one of its
//   original skills (1) · 6 CAPSTONE (needs 15 points in the path) · 7 mastery (10 small ranks).
// Points are the same skill points as before (1 per level). A path holds 28 points, so 3 paths (84) + the original skills
// (20) + new-skill levels (12) is more than the ~109 points of a Lv 110 kaiju: every point has a use, and you choose.
// New skills reuse proven skill mechanics (src/sim/skills.ts kinds) with their own names, numbers and upgrades.
// You pick which 3 actives sit on your buttons (HeroProfile.loadout).
import { type SkillDef, SKILLS } from './skills';
import type { SkillMod } from './items';
import type { HeroProfile } from './stats';

/** Hero level each tree row opens at; a node's later ranks need 4 more levels each (mastery ranks: 4 each too). */
export const ROW_LV = [3, 6, 10, 14, 22, 30, 36];
export const nodeLv = (row: number, rank: number): number => ROW_LV[row] + 4 * (rank - 1);

export type TreeStat = 'atkPct' | 'hpPct' | 'crit' | 'critDmg' | 'dr' | 'skillDmg' | 'cdr' | 'regen' | 'lifeOnKill' | 'ultGain';
export interface TreeNode {
  id: string; name: string; icon: string; desc: string;
  kind: 'stat' | 'skill' | 'mod' | 'cap' | 'mastery';
  ranks: number;
  /** points already in this path before it can be learned */
  need: number;
  /** stat bonus per rank */
  stat?: Partial<Record<TreeStat, number>>;
  /** 'skill' rows: the new active skill it teaches */
  skill?: SkillDef;
  /** 'mod' / 'cap' rows: an upgrade to a skill */
  mod?: { skill: string; mod: SkillMod };
}
export interface TreePath { id: string; name: string; icon: string; arch: 'power' | 'guard' | 'craft'; nodes: TreeNode[] }

// the shared stat rows of each kind of path (names are food-flavoured, the same for every kaiju)
const ARCH = {
  power: { icon: '🔥', rows: [['Big Bites', '💪', { atkPct: 0.02 }], ['Crunchy Crits', '💥', { critDmg: 0.05 }], ['Keen Nose', '🎯', { crit: 1.5 }]], mastery: ['Seasoned Fighter', '🍖', { atkPct: 0.01 }] },
  guard: { icon: '🛡', rows: [['Second Helpings', '❤', { hpPct: 0.03 }], ['Tough Crust', '🧱', { dr: 0.012 }], ['Comfort Food', '🍲', { regen: 0.0008 }]], mastery: ['Well Fed', '🥧', { hpPct: 0.012 }] },
  craft: { icon: '✨', rows: [['Secret Sauce', '🧪', { skillDmg: 0.03 }], ['Quick Kitchen', '⏱', { cdr: 0.012 }], ['Big Appetite', '🔥', { ultGain: 0.05 }]], mastery: ['Master Chef', '👨‍🍳', { skillDmg: 0.012 }] },
} as const;
const STAT_TEXT: Record<TreeStat, (v: number) => string> = {
  atkPct: v => `+${+(v * 100).toFixed(1)}% attack`, hpPct: v => `+${+(v * 100).toFixed(1)}% max HP`, crit: v => `+${v}% critical chance`,
  critDmg: v => `+${Math.round(v * 100)}% critical damage`, dr: v => `+${+(v * 100).toFixed(1)}% damage reduction`, skillDmg: v => `+${+(v * 100).toFixed(1)}% skill damage`,
  cdr: v => `-${+(v * 100).toFixed(1)}% cooldowns`, regen: v => `+${+(v * 100).toFixed(2)}% max HP regained per second`, lifeOnKill: v => `kills heal ${+(v * 100).toFixed(1)}%`,
  ultGain: v => `+${Math.round(v * 100)}% ultimate charge`,
};
export const statText = (s: Partial<Record<TreeStat, number>>, ranks = 1) => Object.entries(s).map(([k, v]) => STAT_TEXT[k as TreeStat](+(v! * ranks).toFixed(4))).join(', ');
const MOD_TEXT = (m: SkillMod) => [m.dmg ? `+${Math.round((m.dmg - 1) * 100)}% damage` : '', m.reach ? `+${Math.round((m.reach - 1) * 100)}% reach` : '', m.cd ? `-${Math.round((1 - m.cd) * 100)}% cooldown` : '',
  m.n ? `+${m.n} hits` : '', m.burn ? 'sets monsters burning' : '', m.freeze ? 'freezes' : '', m.glue ? 'glues' : '', m.slow ? 'slows' : '', m.leech ? `heals ${Math.round(m.leech * 100)}% of its damage` : '', m.echo ? 'casts twice' : ''].filter(Boolean).join(', ');

// every original skill by id (a new skill copies the numbers of a proven one)
const BY_ID: Record<string, SkillDef> = Object.fromEntries(Object.values(SKILLS).flatMap(s => s.actives.map(a => [a.id, a])));

type Spec = [name: string, icon: string, arch: 'power' | 'guard' | 'craft',
  skill: [id: string, name: string, template: string, desc: string, over?: Partial<SkillDef>],
  modOn: [original: number, mod: SkillMod], cap: [name: string, mod: SkillMod, stat: Partial<Record<TreeStat, number>>]];

const SPECS: Record<number, Spec[]> = {
  0: [['Jam Brawler', '🍓', 'power', ['stomp', 'Strawberry Stomp', 'quake', 'Stomps the ground: a shockwave runs both ways'], [1, { dmg: 1.3 }], ['Berry Rampage', { echo: true }, { atkPct: 0.08 }]],
      ['Thick Skin', '🌿', 'guard', ['leafguard', 'Leaf Guard', 'frost', 'Curls up in leaves: -35% damage taken and no flinching', { buff: { def: 0.35, armor: true, t: 7 } }], [2, { reach: 1.3 }], ['Evergreen', { cd: 0.8 }, { hpPct: 0.12 }]],
      ['Seed Sorcery', '🌱', 'craft', ['seedvolley', 'Seed Volley', 'fan', 'Fires a fan of seeds'], [0, { burn: 2 }], ['Seed Storm', { n: 2, dmg: 1.2 }, { skillDmg: 0.08 }]]],
  10: [['Papa Bear', '🐻', 'power', ['bearhug', 'Bear Hug', 'crash', 'Pounces on a monster and squeezes'], [0, { dmg: 1.3 }], ['Grizzly Hug', { echo: true }, { atkPct: 0.08 }]],
       ['Honey Guard', '🍯', 'guard', ['honeysnack', 'Honey Snack', 'feast', 'Eats some honey: heals'], [2, { cd: 0.8 }], ['Honey Fortress', { cd: 0.85 }, { hpPct: 0.12 }]],
       ['Muffin Magic', '🫐', 'craft', ['berrybolt', 'Berry Bolt', 'bolt', 'Shoots a magic blueberry bolt'], [1, { n: 1 }], ['Frozen Berries', { dmg: 1.4, freeze: true }, { skillDmg: 0.08 }]]],
  11: [['Slasher', '🦖', 'power', ['clawflurry', 'Claw Flurry', 'flurry', 'A flurry of claw swipes'], [0, { dmg: 1.3 }], ['Pizza Party', { echo: true }, { critDmg: 0.2 }]],
       ['Crust Armour', '🍕', 'guard', ['crustcounter', 'Crust Counter', 'snap', 'Braces behind its crust and snaps back at the next hit'], [1, { reach: 1.3 }], ['Stuffed Crust', { cd: 0.7 }, { hpPct: 0.12 }]],
       ['Hot Oven', '🔥', 'craft', ['ovenbreath', 'Oven Breath', 'wasabi', 'Breathes hot oven air that sets monsters burning', { burn: 3 }], [2, { cd: 0.8 }], ['Wood-Fired', { dmg: 1.3, burn: 3 }, { skillDmg: 0.08 }]]],
  4: [['Moonlight', '🌙', 'power', ['moonpillar', 'Moon Pillar', 'wave', 'Calls down a pillar of moonlight under a monster'], [0, { dmg: 1.3 }], ['Full Moon', { echo: true }, { atkPct: 0.08 }]],
      ['Cocoon', '🐛', 'guard', ['cocoon', 'Silk Cocoon', 'wobble', 'Wraps up in silk: less damage, shots bounce back'], [2, { reach: 1.3 }], ['Butterfly', { cd: 0.8 }, { hpPct: 0.12 }]],
      ['Dreamdust', '💤', 'craft', ['dreamdust', 'Dream Dust', 'slothtime', 'Sprinkles dream dust: everything nearby slows down'], [1, { n: 1 }], ['Sweet Dreams', { cd: 0.75 }, { skillDmg: 0.08 }]]],
  1: [['Tentacles', '🐙', 'power', ['octoslam', 'Eight-Arm Slam', 'quake', 'Slams all eight arms down: a shockwave both ways'], [0, { reach: 1.3 }], ['Kraken', { echo: true }, { atkPct: 0.08 }]],
      ['Bubble Lab', '🫧', 'guard', ['bubbleshield', 'Bubble Shield', 'wobble', 'Blows a bubble around itself: less damage, shots bounce back'], [1, { cd: 0.8 }], ['Safety Goggles', { cd: 0.8 }, { hpPct: 0.12 }]],
      ['Mad Science', '⚗', 'craft', ['sparkbeaker', 'Spark Beaker', 'bolt', 'Flings a crackling beaker of sparks'], [2, { dmg: 1.3 }], ['Eureka!', { freeze: true, dmg: 1.2 }, { skillDmg: 0.08 }]]],
  2: [['Pinch', '🦀', 'power', ['pinchflurry', 'Pinch Flurry', 'flurry', 'Pinches again and again'], [0, { dmg: 1.4 }], ['Crab Rave', { echo: true }, { atkPct: 0.08 }]],
      ['Fortress', '🧀', 'guard', ['cheesewall', 'Cheese Wall', 'wafflewall', 'Raises a wall of cheese that blocks monsters'], [1, { cd: 0.8 }], ['Aged to Perfection', { cd: 0.8 }, { hpPct: 0.12 }]],
      ['Brine', '🌊', 'craft', ['brinetide', 'Brine Tide', 'tide', 'A salty wave pushes monsters along'], [2, { reach: 1.3 }], ['Pickled', { dmg: 1.3, slow: true }, { skillDmg: 0.08 }]]],
  5: [['Assassin', '🦇', 'power', ['crustflurry', 'Crust Flurry', 'flurry', 'Slashes with toasty claws, fast'], [1, { dmg: 1.3 }], ['Crispy Edge', { echo: true }, { critDmg: 0.2 }]],
      ['Shadow', '🌑', 'guard', ['shadowveil', 'Shadow Veil', 'frost', 'Wraps itself in shadow: -30% damage and faster', { buff: { def: 0.3, speed: 0.2, t: 6 } }], [0, { cd: 0.8 }], ['Night Shift', { cd: 0.8 }, { hpPct: 0.12 }]],
      ['Burnt', '🍞', 'craft', ['burntscreech', 'Burnt Screech', 'screech', 'A smoky screech that stuns monsters', { burn: 2 }], [2, { n: 1 }], ['Charcoal', { dmg: 1.3, burn: 3 }, { skillDmg: 0.08 }]]],
  6: [['Dumpling Fist', '🥟', 'power', ['dumpdrop', 'Dumpling Drop', 'crash', 'Leaps and lands on a monster, belly first'], [2, { dmg: 1.25 }], ['Heavy Filling', { echo: true }, { atkPct: 0.08 }]],
      ['Broth', '🍜', 'guard', ['brothbubble', 'Broth Bubble', 'wobble', 'A bubble of warm broth: less damage, shots bounce back'], [1, { cd: 0.85 }], ['Chicken Soup', { cd: 0.8 }, { hpPct: 0.12 }]],
      ['Steam Magic', '♨', 'craft', ['steamtwister', 'Steam Twister', 'soystorm', 'A twister of steam that drags monsters in'], [0, { reach: 1.3 }], ['Pressure Cooker', { dmg: 1.3 }, { skillDmg: 0.08 }]]],
  7: [['Dragon', '🐉', 'power', ['dragonpounce', 'Dragon Pounce', 'crash', 'Pounces on a monster like a dragon'], [0, { dmg: 1.3 }], ['Sushi Dragon', { echo: true }, { atkPct: 0.08 }]],
      ['Seaweed', '🌊', 'guard', ['norishield', 'Nori Shield', 'shell', 'Wraps itself in nori: tougher for a while'], [1, { n: 1 }], ['Maki Armour', { cd: 0.8 }, { hpPct: 0.12 }]],
      ['Wasabi Sorcery', '🟢', 'craft', ['wasabinova', 'Wasabi Nova', 'nova', 'A burst of spicy wasabi all around', { burn: 2 }], [2, { dmg: 1.3 }], ['Extra Spicy', { dmg: 1.2, burn: 3 }, { skillDmg: 0.08 }]]],
  8: [['Smash', '🍫', 'power', ['chocoquake', 'Choco Quake', 'quake', 'Slams the ground: a chocolate shockwave'], [0, { dmg: 1.3 }], ['Rocky Road', { echo: true }, { atkPct: 0.08 }]],
      ['Fudge Wall', '🧱', 'guard', ['fudgewall', 'Fudge Wall', 'wafflewall', 'Raises a wall of fudge that blocks monsters'], [2, { cd: 0.8 }], ['Dark Chocolate', { cd: 0.8 }, { hpPct: 0.12 }]],
      ['Cocoa Craft', '☕', 'craft', ['cocoavortex', 'Cocoa Vortex', 'jamspin', 'Spins a vortex of cocoa that hits again and again'], [1, { reach: 1.3 }], ['Hot Cocoa', { n: 2 }, { skillDmg: 0.08 }]]],
  15: [['Spiky', '🦔', 'power', ['spikeflurry', 'Spike Flurry', 'flurry', 'Jabs with its spikes, fast'], [0, { dmg: 1.3 }], ['Hedgehog Hurricane', { echo: true }, { atkPct: 0.08 }]],
       ['Bun Guard', '🌭', 'guard', ['bunarmour', 'Bun Armour', 'shell', 'Tucks into its bun: tougher for a while'], [1, { reach: 1.3 }], ['Double Bun', { cd: 0.8 }, { hpPct: 0.12 }]],
       ['Grill Master', '🔥', 'craft', ['grillbreath', 'Grill Breath', 'wasabi', 'Breathes barbecue smoke that sets monsters burning', { burn: 3 }], [2, { n: 1 }], ['Flame Grilled', { dmg: 1.3, burn: 3 }, { skillDmg: 0.08 }]]],
  17: [['Skater', '⛸', 'power', ['icedash', 'Ice Dash', 'slice', 'Skates straight through monsters'], [0, { dmg: 1.3 }], ['Triple Axel', { echo: true }, { critDmg: 0.2 }]],
       ['Iceberg', '🧊', 'guard', ['iceshell', 'Iceberg Shell', 'wobble', 'An icy shell: less damage, shots bounce back'], [2, { cd: 0.8 }], ['Glacier', { cd: 0.8 }, { hpPct: 0.12 }]],
       ['Blizzard', '❄', 'craft', ['iciclerain', 'Icicle Rain', 'toastado', 'Icicles rain down on the area ahead', { slow: true }], [1, { dmg: 1.3 }], ['Whiteout', { freeze: true }, { skillDmg: 0.08 }]]],
  13: [['Drake', '🐲', 'power', ['drakedive', 'Drake Dive', 'dive', 'Swoops up and dives through monsters'], [0, { dmg: 1.3 }], ['Avocado Dragon', { echo: true }, { atkPct: 0.08 }]],
       ['Guac Shell', '🥑', 'guard', ['guacsnack', 'Guac Snack', 'feast', 'Eats a scoop of guac: heals'], [1, { reach: 1.3 }], ['Holy Guacamole', { cd: 0.85 }, { hpPct: 0.12 }]],
       ['Fiesta Magic', '🌶', 'craft', ['chilibreath', 'Chili Breath', 'wasabi', 'Breathes hot chili that sets monsters burning', { burn: 3 }], [2, { cd: 0.8 }], ['Extra Hot', { dmg: 1.3, burn: 3 }, { skillDmg: 0.08 }]]],
  19: [['Night Hunter', '🦉', 'power', ['talondive', 'Talon Dive', 'dive', 'Swoops down with sharp talons'], [0, { dmg: 1.3 }], ['Midnight Feast', { echo: true }, { critDmg: 0.2 }]],
       ['Feather Guard', '🪶', 'guard', ['featherveil', 'Feather Veil', 'frost', 'Fluffs up its feathers: -30% damage, no flinching', { buff: { def: 0.3, armor: true, t: 7 } }], [1, { cd: 0.8 }], ['Ruffled', { cd: 0.8 }, { hpPct: 0.12 }]],
       ['Fiesta', '🎉', 'craft', ['salsatwister', 'Salsa Twister', 'soystorm', 'A spicy salsa twister that drags monsters in'], [2, { n: 1 }], ['Salsa Picante', { dmg: 1.3, burn: 3 }, { skillDmg: 0.08 }]]],
  9: [['Stomp', '🐘', 'power', ['gumstomp', 'Gum Stomp', 'quake', 'Stomps the ground: a sticky shockwave'], [2, { dmg: 1.3 }], ['Stampede', { echo: true }, { atkPct: 0.08 }]],
      ['Bubble Wall', '🫧', 'guard', ['bubblewall', 'Bubble Wall', 'wafflewall', 'Blows a wall of bubblegum that blocks monsters'], [0, { cd: 0.8 }], ['Super Stretchy', { cd: 0.8 }, { hpPct: 0.12 }]],
      ['Sugar Magic', '🍬', 'craft', ['gumvortex', 'Gum Vortex', 'jamspin', 'Spins a sticky gum vortex that hits again and again'], [1, { n: 1 }], ['Sugar Rush', { slow: true, n: 2 }, { skillDmg: 0.08 }]]],
  18: [['Champion', '🥊', 'power', ['velvetupper', 'Velvet Uppercut', 'upper', 'A rising uppercut that launches monsters'], [1, { dmg: 1.3 }], ['Knockout King', { echo: true }, { atkPct: 0.08 }]],
       ['Rope-a-Dope', '🧸', 'guard', ['ropeadope', 'Rope-a-Dope', 'snap', 'Covers up and counters the next hit'], [0, { cd: 0.8 }], ['Iron Chin', { cd: 0.7 }, { hpPct: 0.12 }]],
       ['Showtime', '🎊', 'craft', ['confetti', 'Confetti Nova', 'nova', 'A burst of party confetti all around'], [2, { reach: 1.3 }], ['Grand Finale', { slow: true, dmg: 1.2 }, { skillDmg: 0.08 }]]],
  12: [['Lazy Brawler', '🦥', 'power', ['pillowslam', 'Pillow Slam', 'quake', 'Flops down on its pillow: a soft but mighty shockwave'], [0, { dmg: 1.3 }], ['Sleepwalker', { echo: true }, { atkPct: 0.08 }]],
       ['Snooze Shield', '🛏', 'guard', ['cozyfort', 'Cozy Fort', 'wafflewall', 'Builds a pillow fort wall that blocks monsters'], [1, { cd: 0.85 }], ['Ten More Minutes', { cd: 0.8 }, { hpPct: 0.12 }]],
       ['Boba Magic', '🧋', 'craft', ['bobavolley', 'Boba Volley', 'fan', 'Fires a fan of tapioca pearls'], [2, { cd: 0.8 }], ['Extra Pearls', { n: 2 }, { skillDmg: 0.08 }]]],
  16: [['Shell Slam', '🐢', 'power', ['shellroll', 'Shell Roll', 'spikeroll', 'Tucks in and rolls through monsters'], [0, { dmg: 1.3 }], ['Turtle Power', { echo: true }, { atkPct: 0.08 }]],
       ['Frozen Fortress', '🏰', 'guard', ['mintshell', 'Mint Shell', 'shell', 'Hides in its frosty shell: tougher for a while'], [1, { cd: 0.8 }], ['Permafrost', { cd: 0.8 }, { hpPct: 0.12 }]],
       ['Brain Freeze', '🍨', 'craft', ['mintfreeze', 'Mint Freeze', 'freeze', 'A frosty blast that freezes monsters solid'], [2, { n: 1 }], ['Double Scoop', { cd: 0.75 }, { skillDmg: 0.08 }]]],
  3: [['Bounce', '🟢', 'power', ['jellypounce', 'Jelly Pounce', 'crash', 'Bounces onto a monster'], [0, { dmg: 1.3 }], ['Wobble Smash', { echo: true }, { atkPct: 0.08 }]],
      ['Wobble Wall', '🍮', 'guard', ['jellymend', 'Jelly Mend', 'feast', 'Wobbles back into shape: heals'], [2, { cd: 0.8 }], ['Set Firmly', { cd: 0.85 }, { hpPct: 0.12 }]],
      ['Gelatin Magic', '🍬', 'craft', ['jellybolt', 'Jelly Bolt', 'bolt', 'Shoots a sticky jelly bolt'], [1, { n: 1 }], ['Sticky Fingers', { glue: true, dmg: 1.2 }, { skillDmg: 0.08 }]]],
  14: [['River Rush', '🐟', 'power', ['finslash', 'Fin Slash', 'slice', 'Dashes through monsters fin first'], [0, { dmg: 1.3 }], ['King Salmon', { echo: true }, { atkPct: 0.08 }]],
       ['Riverstone', '🪨', 'guard', ['rivershell', 'River Shell', 'shell', 'Hides behind river stones: tougher for a while'], [1, { cd: 0.8 }], ['Smooth Stone', { cd: 0.8 }, { hpPct: 0.12 }]],
       ['Tide Magic', '🌀', 'craft', ['whirlpool', 'Whirlpool', 'whirl', 'A whirlpool that drags monsters in'], [2, { n: 1 }], ['Riptide', { dmg: 1.3 }, { skillDmg: 0.08 }]]],
};

function buildTree(species: number): TreePath[] {
  const orig = SKILLS[species]?.actives ?? [];
  return (SPECS[species] ?? []).map(([name, icon, arch, [sid, sname, template, sdesc, over], [oi, omod], [cname, cmod, cstat]], pi) => {
    const A = ARCH[arch], id = (n: string) => `${species}.${pi}.${n}`;
    const tpl = BY_ID[template];
    const skill: SkillDef = { ...tpl, ...(over ?? {}), id: sid, name: sname, desc: sdesc, unlock: ROW_LV[2] };
    const target = orig[oi];
    const stat = (r: number) => { const [n, ic, s] = A.rows[r]; return { id: id(`s${r}`), name: n, icon: ic, kind: 'stat' as const, ranks: 5, stat: s as Partial<Record<TreeStat, number>>, desc: statText(s as Partial<Record<TreeStat, number>>) + ' per rank' }; };
    return {
      id: `${species}.${pi}`, name, icon, arch,
      nodes: [
        { ...stat(0), need: 0 },
        { ...stat(1), need: 2 },
        { id: id('skill'), name: sname, icon: '★', kind: 'skill', ranks: 1, need: 5, skill, desc: `New skill: ${sdesc}. Put it on a button, then level it up like your other skills.` },
        { ...stat(2), need: 6 },
        { id: id('mod'), name: `${target?.name ?? 'Skill'}+`, icon: '⬆', kind: 'mod', ranks: 1, need: 10, mod: { skill: target?.id ?? '', mod: omod }, desc: `${target?.name}: ${MOD_TEXT(omod)}` },
        { id: id('cap'), name: cname, icon: '👑', kind: 'cap', ranks: 1, need: 15, mod: { skill: sid, mod: cmod }, stat: cstat, desc: `${sname}: ${MOD_TEXT(cmod)}. And ${statText(cstat)}.` },
        { id: id('m'), name: A.mastery[0], icon: A.mastery[1], kind: 'mastery', ranks: 10, need: 18, stat: A.mastery[2] as Partial<Record<TreeStat, number>>, desc: statText(A.mastery[2] as Partial<Record<TreeStat, number>>) + ' per rank' },
      ],
    };
  });
}

const CACHE = new Map<number, TreePath[]>();
export function treeOf(species: number): TreePath[] { let t = CACHE.get(species); if (!t) { t = buildTree(species); CACHE.set(species, t); } return t; }
/** Every active skill this kaiju can ever use: its 3 originals and the 3 from its tree. */
export function allActives(species: number): SkillDef[] { return [...(SKILLS[species]?.actives ?? []), ...treeOf(species).map(p => p.nodes.find(n => n.kind === 'skill')!.skill!)]; }
export function nodeById(species: number, id: string): { path: TreePath; node: TreeNode; row: number } | null {
  for (const path of treeOf(species)) { const row = path.nodes.findIndex(n => n.id === id); if (row >= 0) return { path, node: path.nodes[row], row }; }
  return null;
}
export const rankOf = (p: HeroProfile, id: string) => p.tree?.[id] ?? 0;
export const pointsIn = (p: HeroProfile, path: TreePath) => path.nodes.reduce((a, n) => a + rankOf(p, n.id), 0);
/** Can this node take another point now? (enough points in the path, the row above learned, not maxed) */
export function canLearn(p: HeroProfile, id: string): boolean {
  const f = nodeById(p.species, id); if (!f || p.skillPts <= 0) return false;
  const { path, node, row } = f;
  if (rankOf(p, id) >= node.ranks) return false;
  if (p.level < nodeLv(row, rankOf(p, id) + 1)) return false;
  if (pointsIn(p, path) < node.need) return false;
  if (row > 0 && rankOf(p, path.nodes[row - 1].id) === 0) return false;
  return true;
}
/** Is this skill one the kaiju may use (an original, or a tree skill it has learned)? */
export function skillUnlocked(p: HeroProfile, id: string): boolean {
  if ((SKILLS[p.species]?.actives ?? []).some(a => a.id === id)) return true;
  const n = treeOf(p.species).flatMap(t => t.nodes).find(x => x.skill?.id === id);
  return !!n && rankOf(p, n.id) > 0;
}
/** The 3 skills on the buttons: the chosen loadout where valid, filled up with the originals. */
export function loadoutOf(p: HeroProfile): SkillDef[] {
  const all = allActives(p.species), out: SkillDef[] = [];
  for (const id of p.loadout ?? []) { const s = all.find(a => a.id === id); if (s && skillUnlocked(p, id) && !out.includes(s) && out.length < 3) out.push(s); }
  for (const s of SKILLS[p.species]?.actives ?? []) if (out.length < 3 && !out.includes(s)) out.push(s);
  return out;
}
/** Everything the learned nodes add: stats and skill upgrades. */
export function treeBonus(p: HeroProfile): { stat: Partial<Record<TreeStat, number>>; mods: { skill: string; mod: SkillMod }[] } {
  const stat: Partial<Record<TreeStat, number>> = {}, mods: { skill: string; mod: SkillMod }[] = [];
  for (const path of treeOf(p.species)) for (const n of path.nodes) {
    const r = rankOf(p, n.id); if (!r) continue;
    if (n.stat) for (const [k, v] of Object.entries(n.stat)) stat[k as TreeStat] = (stat[k as TreeStat] ?? 0) + v! * r;
    if (n.mod) mods.push(n.mod);
  }
  return { stat, mods };
}
/** Merge skill upgrades (multipliers multiply, counts add, effects switch on). */
export function mergeMods(a: SkillMod | undefined, b: SkillMod): SkillMod {
  if (!a) return { ...b };
  return { ...a, ...b, dmg: (a.dmg ?? 1) * (b.dmg ?? 1), reach: (a.reach ?? 1) * (b.reach ?? 1), cd: (a.cd ?? 1) * (b.cd ?? 1), n: (a.n ?? 0) + (b.n ?? 0) || undefined,
    burn: Math.max(a.burn ?? 0, b.burn ?? 0) || undefined, leech: (a.leech ?? 0) + (b.leech ?? 0) || undefined, freeze: a.freeze || b.freeze, glue: a.glue || b.glue, slow: a.slow || b.slow, echo: a.echo || b.echo };
}
