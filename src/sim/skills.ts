import type { SkillMod } from './items';
// Skills: every kaiju has 3 actives (unlocking with hero level) and 1 passive. Skill levels 1..MAX_SKILL
// (gear can push past the max). Damage grows +20% per level, cooldown shrinks 4% per level.
// Every skill has its OWN behaviour (no two kaiju share a mechanic) — tests/skills.test.ts checks it.
// Skill ids never change (saves store levels and branches by id); kinds, names and numbers may.

export type SkillKind =
  // the originals, each now used by one kaiju only
  | 'cone' | 'slam' | 'dash' | 'bolt' | 'spin' | 'uppercut' | 'mines' | 'buff' | 'nova' | 'fan' | 'heal'
  // one-of-a-kind mechanics
  | 'vortex'    // spin that sucks monsters in
  | 'boomerang' // projectile that flies out and comes back
  | 'whip'      // long thin lash, two hits
  | 'pull'      // yanks everything in reach to you, stunned
  | 'geyser'    // eruptions under the nearest monsters
  | 'counter'   // guard stance: blocks the next hit and strikes back
  | 'pounce'    // leaps onto the nearest monster
  | 'swoop'     // arcing dive that sets monsters burning
  | 'blink'     // teleports behind the nearest monster: guaranteed crit
  | 'rain'      // projectiles fall from above ahead of you
  | 'zone'      // lingering cloud that hurts over time
  | 'drain'     // area hit that heals you for part of the damage
  | 'breath'    // sustained stream that burns
  | 'orbit'     // orbs circle you for a while
  | 'twister'   // slow travelling whirlwind that pulls
  | 'throw'     // grab the monster in front and slam it behind you
  | 'bulldoze'  // charge that carries monsters along, crushing them at the end
  | 'roll'      // bouncing ball back and forth through a crowd
  | 'goo'       // lobbed blobs that glue monsters in place
  | 'radial'    // spikes in every direction
  | 'slide'     // dash that leaves a chilling ice trail
  | 'snowball'  // ground projectile that grows as it rolls
  | 'freeze'    // freezes monsters solid (no knockback)
  // ultimates
  | 'rampage' | 'meteor' | 'slashall' | 'beam' | 'tremor' | 'homing' | 'wave' | 'firefloor' | 'blizzard'
  // Avocadrake / Tacowl (Act 2)
  | 'pitbounce' // a pit that bounces along the ground, hitting at every bounce
  | 'guac'      // a guac pool: slows monsters, heals heroes standing in it
  | 'gust'      // wing blast that throws monsters far back
  | 'drop'      // bombs dropped from above that burst and burn
  | 'screech'   // cone that stuns everything in front
  | 'volley'    // tortilla chips sprayed forward and down
  | 'guacflood' | 'fiesta'
  // Bubblegumbo / Velvaroo
  | 'bubbletrap' // seals the nearest monsters in gum bubbles (helpless), then they pop
  | 'gumball'    // gumballs that ricochet off monsters
  | 'trumpet'    // two shockwaves race along the floor both ways and launch monsters
  | 'hops'       // three big hops forward, a shockwave at every landing
  | 'flurry'     // a rapid flurry of punches
  | 'cakebomb'   // a lobbed cupcake that bursts into a slowing frosting patch
  | 'megabubble' | 'tko'
  // Sloba / Minturtle
  | 'swing'      // swings up and over in an arc, landing with a sticky slam
  | 'nap'        // a power nap: heals while dozing, wakes with a shockwave
  | 'slowtime'   // everything nearby slows right down, and you speed up
  | 'wall'       // a waffle wall: blocks monsters and their shots
  | 'scoop'      // a lobbed scoop that bursts and freezes
  | 'chipstorm'  // choc chips rain down all around you
  | 'snooze' | 'sundae'
  // Bloblin / Salmonster
  | 'jiggle'     // bounces up and lands in a jelly splat that glues
  | 'clones'     // little jelly clones bounce along the floor
  | 'wobble'     // a wobble shield: less damage, shots bounce back
  | 'upstream'   // leaps forward and up through monsters
  | 'tide'       // a wave that pushes monsters along
  | 'salmon'     // salmon swim out in a wavy line
  | 'jellyquake' | 'salmonrun';

export interface SkillDef {
  id: string;
  name: string;
  kind: SkillKind;
  desc: string;
  unlock: number;  // hero level needed
  cd: number;      // seconds
  dur: number;     // seconds the hero is busy
  dmg: number;     // × attack (per hit / per tick for multi-hit kinds)
  reach: number; h: number;
  kx: number; ky: number;
  /** count: spin hits per second, mines / fan / rain / orbs / targets / ticks */
  n?: number;
  /** buff: what it boosts while active (reflect = shots bounce back, leech = heal that share of damage dealt) */
  buff?: { atk?: number; def?: number; speed?: number; armor?: boolean; reflect?: boolean; leech?: number; t: number };
  /** heal: fraction of max HP restored at skill level 1 */
  heal?: number;
  /** drain: share of the damage dealt that heals you */
  leech?: number;
  /** seconds of burning on monsters it hits */
  burn?: number;
  /** mines: thrown in an arc as projectiles (burst on a monster, become a mine where they land) */
  toss?: boolean;
  /** signature-legendary upgrades: statuses on hit, cast twice */
  freeze?: boolean; glue?: boolean; slow?: boolean; echo?: boolean;
}

export interface PassiveDef {
  id: string; name: string; desc: string; unlock: number;
  /** per skill level */
  per: Partial<Record<PassiveStat, number>>;
}
export type PassiveStat = 'hpPct' | 'crit' | 'skillDmg' | 'cdr' | 'lifeOnKill' | 'atkPct' | 'dr' | 'critDmg' | 'regen' | 'ultGain' | 'thorns' | 'heavyDmg' | 'dodge';

export const MAX_SKILL = 5;
export const SKILL_UNLOCKS = [1, 4, 8];
export const PASSIVE_UNLOCK = 6;

const S = (o: Partial<SkillDef> & Pick<SkillDef, 'id' | 'name' | 'kind' | 'desc'>): SkillDef =>
  ({ unlock: 1, cd: 3, dur: 0.45, dmg: 2, reach: 120, h: 80, kx: 300, ky: -200, ...o });

export const SKILLS: Record<number, { actives: SkillDef[]; passive: PassiveDef }> = {
  0: { // Gobzilla Jr. — brawler
    actives: [
      S({ id: 'seed', name: 'Seed Spray', kind: 'cone', desc: 'Spits a cone of strawberry seeds', cd: 3, dmg: 2.4, reach: 210, h: 90, kx: 380 }),
      S({ id: 'upper', name: 'Berry Uppercut', kind: 'uppercut', desc: 'Leaps up with a launching uppercut', unlock: 4, cd: 5, dur: 0.55, dmg: 3.2, reach: 80, h: 150, kx: 120, ky: -720 }),
      S({ id: 'jamspin', name: 'Jam Tornado', kind: 'vortex', desc: 'A sticky jam whirl that sucks monsters in while it spins', unlock: 8, cd: 9, dur: 1.6, dmg: 0.9, reach: 150, h: 100, kx: 160, ky: -160, n: 7 }),
    ],
    passive: { id: 'sweet', name: 'Sweet Tooth', desc: 'Heals 2% max HP per level on each kill', unlock: PASSIVE_UNLOCK, per: { lifeOnKill: 0.02 } },
  },
  10: { // Bluebeary — tank
    actives: [
      S({ id: 'quake', name: 'Muffin Quake', kind: 'slam', desc: 'Belly-flops for a shockwave', cd: 5, dur: 0.6, dmg: 2.4, reach: 190, h: 70, kx: 200, ky: -520 }),
      S({ id: 'mines', name: 'Berry Mines', kind: 'mines', desc: 'Lobs three blueberries: they burst on enemies, or lie in wait as mines', unlock: 4, cd: 7, dur: 0.4, dmg: 2.6, reach: 50, h: 60, kx: 260, ky: -460, n: 3, toss: true }),
      S({ id: 'frost', name: 'Frosting Shield', kind: 'buff', desc: 'Hardens: -40% damage taken, no flinching, +20% attack', unlock: 8, cd: 16, dur: 0.5, dmg: 0, buff: { def: 0.4, atk: 0.2, armor: true, t: 8 } }),
    ],
    passive: { id: 'thick', name: 'Thick Frosting', desc: '+4% max HP per level', unlock: PASSIVE_UNLOCK, per: { hpPct: 0.04 } },
  },
  11: { // Pizzaraptor — slasher
    actives: [
      S({ id: 'slice', name: 'Slice Dash', kind: 'dash', desc: 'Dashes through enemies', cd: 2.5, dur: 0.32, dmg: 2.8, reach: 60, h: 70, kx: 260, ky: -260 }),
      S({ id: 'pspin', name: 'Pizza Cutter Toss', kind: 'boomerang', desc: 'Hurls a spinning pizza cutter that flies out and comes back, hitting twice', unlock: 4, cd: 5, dur: 0.35, dmg: 2.3, reach: 50, h: 50, kx: 200, ky: -160 }),
      S({ id: 'frenzy', name: 'Extra Cheese', kind: 'buff', desc: 'Frenzy: +35% attack and +25% speed', unlock: 8, cd: 15, dur: 0.4, dmg: 0, buff: { atk: 0.35, speed: 0.25, t: 7 } }),
    ],
    passive: { id: 'hot', name: 'Hot Slice', desc: '+3% critical chance per level', unlock: PASSIVE_UNLOCK, per: { crit: 3 } },
  },
  4: { // Mothball — caster
    actives: [
      S({ id: 'bolt', name: 'Dust Bolt', kind: 'bolt', desc: 'Fires a piercing bolt of sugar dust', cd: 2, dur: 0.35, dmg: 2.6, reach: 40, h: 40, kx: 300, ky: -220 }),
      S({ id: 'fan', name: 'Sugar Fan', kind: 'fan', desc: 'Throws a fan of five glittering bolts', unlock: 4, cd: 6, dur: 0.45, dmg: 1.6, reach: 40, h: 40, kx: 220, ky: -160, n: 5 }),
      S({ id: 'nova', name: 'Marshmallow Nova', kind: 'nova', desc: 'A huge fluffy burst all around after a short charge', unlock: 8, cd: 12, dur: 0.8, dmg: 5, reach: 260, h: 200, kx: 420, ky: -420 }),
    ],
    passive: { id: 'soft', name: 'Moonlit Wings', desc: '+5% skill damage and -3% cooldowns per level', unlock: PASSIVE_UNLOCK, per: { skillDmg: 0.05, cdr: 0.03 } },
  },
  1: { // Squidgeon — lasher
    actives: [
      S({ id: 'ink', name: 'Tentacle Lash', kind: 'whip', desc: 'A long, lightning-fast tentacle lash that hits twice', cd: 2.5, dur: 0.4, dmg: 1.4, reach: 290, h: 50, kx: 260, ky: -160, n: 2 }),
      S({ id: 'whirl', name: 'Tentacle Grab', kind: 'pull', desc: 'Grabs every monster in reach and yanks it in, stunned', unlock: 4, cd: 7, dur: 0.5, dmg: 1.8, reach: 300, h: 120, kx: 0, ky: -120 }),
      S({ id: 'wave', name: 'Bubbling Flasks', kind: 'geyser', desc: 'Chemical geysers erupt under up to 4 monsters', unlock: 8, cd: 10, dur: 0.6, dmg: 3.6, reach: 420, h: 200, kx: 80, ky: -700, n: 4 }),
    ],
    passive: { id: 'eight', name: 'Eight Arms', desc: '+4% attack per level', unlock: PASSIVE_UNLOCK, per: { atkPct: 0.04 } },
  },
  2: { // Crabbage — guardian
    actives: [
      S({ id: 'snap', name: 'Claw Counter', kind: 'counter', desc: 'Raises its claws: blocks the next hit and snaps back hard (a small snap if nothing comes)', cd: 4, dur: 0.8, dmg: 4, reach: 110, h: 90, kx: 380, ky: -300 }),
      S({ id: 'shell', name: 'Leaf Shell', kind: 'buff', desc: 'Hides in cabbage: -35% damage, no flinching, and shots bounce back', unlock: 4, cd: 15, dur: 0.4, dmg: 0, buff: { def: 0.35, armor: true, reflect: true, t: 7 } }),
      S({ id: 'crash', name: 'Cheddar Pounce', kind: 'pounce', desc: 'Leaps onto the nearest monster and crashes down like a cheese wheel', unlock: 8, cd: 7, dur: 0.7, dmg: 3.8, reach: 160, h: 80, kx: 260, ky: -560 }),
    ],
    passive: { id: 'rind', name: 'Hard Rind', desc: '-3% damage taken per level', unlock: PASSIVE_UNLOCK, per: { dr: 0.03 } },
  },
  5: { // Toastbat — assassin
    actives: [
      S({ id: 'dive', name: 'Crumb Dive', kind: 'swoop', desc: 'Swoops up and dives through monsters, leaving them burning', cd: 2.6, dur: 0.5, dmg: 2, reach: 70, h: 90, kx: 220, ky: -300, burn: 2.5 }),
      S({ id: 'butter', name: 'Shadow Toast', kind: 'blink', desc: 'Vanishes and strikes the nearest monster from behind: always a critical hit', unlock: 4, cd: 4, dur: 0.35, dmg: 2.6, reach: 360, h: 90, kx: 260, ky: -260 }),
      S({ id: 'toastado', name: 'Toast Rain', kind: 'rain', desc: 'Slices of hot toast rain down on the area ahead', unlock: 8, cd: 9, dur: 0.6, dmg: 1.5, reach: 300, h: 60, kx: 160, ky: -260, n: 8 }),
    ],
    passive: { id: 'crispy', name: 'Extra Crispy', desc: '+10% critical damage per level', unlock: PASSIVE_UNLOCK, per: { critDmg: 0.1 } },
  },
  6: { // Dumplord — healer
    actives: [
      S({ id: 'steam', name: 'Steam Cloud', kind: 'zone', desc: 'Leaves a scalding steam cloud that hurts monsters for 3 s', cd: 4, dur: 0.4, dmg: 0.7, reach: 180, h: 110, kx: 60, ky: -80 }),
      S({ id: 'feast', name: 'Dumpling Feast', kind: 'heal', desc: 'Eats a snack: heals 20% HP (+5% per level)', unlock: 4, cd: 18, dur: 0.6, dmg: 0, heal: 0.2 }),
      S({ id: 'soup', name: 'Soup Slurp', kind: 'drain', desc: 'Slurps the life out of everything nearby: heals 20% of the damage (up to 12% of its HP)', unlock: 8, cd: 11, dur: 0.7, dmg: 3.6, reach: 230, h: 160, kx: 120, ky: -200, leech: 0.2 }),
    ],
    passive: { id: 'aura', name: 'Steamy Aura', desc: 'Regenerates 0.12% max HP per second per level', unlock: PASSIVE_UNLOCK, per: { regen: 0.0012 } },
  },
  7: { // Norigon — dragon mage
    actives: [
      S({ id: 'wasabi', name: 'Wasabi Breath', kind: 'breath', desc: 'Breathes a stream of green fire that keeps burning', cd: 3.5, dur: 0.9, dmg: 0.55, reach: 220, h: 90, kx: 80, ky: -60, n: 6, burn: 2 }),
      S({ id: 'roll', name: 'Rice Ball Ring', kind: 'orbit', desc: 'Three rice balls circle Norigon for 6 s, bonking anything close', unlock: 4, cd: 10, dur: 0.4, dmg: 1.0, reach: 70, h: 60, kx: 200, ky: -200, n: 3 }),
      S({ id: 'soystorm', name: 'Soy Twister', kind: 'twister', desc: 'A slow soy-sauce twister drifts forward, sucking monsters in', unlock: 8, cd: 11, dur: 0.5, dmg: 0.6, reach: 60, h: 140, kx: 60, ky: -160 }),
    ],
    passive: { id: 'umami', name: 'Dragon Heart', desc: '+12% ultimate gauge gain per level', unlock: PASSIVE_UNLOCK, per: { ultGain: 0.12 } },
  },
  8: { // Chocomunch — bruiser
    actives: [
      S({ id: 'chocoslam', name: 'Choco Suplex', kind: 'throw', desc: 'Grabs the monster in front and slams it down behind', cd: 4, dur: 0.6, dmg: 3.6, reach: 100, h: 100, kx: 120, ky: -300 }),
      S({ id: 'melt', name: 'Melt Charge', kind: 'bulldoze', desc: 'A shoulder-charge that carries monsters along and crushes them at the end', unlock: 4, cd: 5, dur: 0.6, dmg: 3, reach: 80, h: 90, kx: 460, ky: -320 }),
      S({ id: 'sugarrush', name: 'Sugar Rush', kind: 'buff', desc: '+20% attack, no flinching, and heals 15% of the damage dealt', unlock: 8, cd: 15, dur: 0.4, dmg: 0, buff: { atk: 0.2, armor: true, leech: 0.15, t: 7 } }),
    ],
    passive: { id: 'cocoa', name: 'Heavy Fists', desc: '+8% finisher and Guard Break damage per level', unlock: PASSIVE_UNLOCK, per: { heavyDmg: 0.08 } },
  },
  15: { // Hotchog — spiky roller
    actives: [
      S({ id: 'spikeroll', name: 'Spike Roll', kind: 'roll', desc: 'Becomes a spiky ball that bounces back and forth through crowds', cd: 4, dur: 1.2, dmg: 1.0, reach: 70, h: 70, kx: 260, ky: -240 }),
      S({ id: 'mustard', name: 'Mustard Glue', kind: 'goo', desc: 'Sticky mustard blobs glue monsters in place for 2.5 s; Spike Roll does double damage to glued monsters', unlock: 4, cd: 7, dur: 0.4, dmg: 0.6, reach: 60, h: 60, kx: 0, ky: 0, n: 3 }),
      S({ id: 'grillspin', name: 'Quill Burst', kind: 'radial', desc: 'Shoots spikes in every direction', unlock: 8, cd: 7, dur: 0.4, dmg: 1.6, reach: 40, h: 40, kx: 200, ky: -200, n: 10 }),
    ],
    passive: { id: 'spiky', name: 'Extra Spiky', desc: 'Monsters that hurt you take 12% of it back per level', unlock: PASSIVE_UNLOCK, per: { thorns: 0.12 } },
  },
  3: { // Bloblin — jiggly support
    actives: [
      S({ id: 'jiggle', name: 'Jiggle Splat', kind: 'jiggle', desc: 'Bounces up high and lands in a jelly splat that glues monsters', cd: 3.4, dur: 0.8, dmg: 2, reach: 110, h: 80, kx: 200, ky: -320 }),
      S({ id: 'clones', name: 'Jelly Clones', kind: 'clones', desc: 'Two little jelly clones bounce along the floor, hitting everything they bump', unlock: 4, cd: 8, dur: 0.4, dmg: 1.1, reach: 30, h: 30, kx: 160, ky: -220, n: 2 }),
      S({ id: 'wobble', name: 'Wobble Shield', kind: 'wobble', desc: 'A wobble burst knocks monsters back, then 4 s extra wobbly: 40% less damage and shots bounce back', unlock: 8, cd: 12, dur: 0.4, dmg: 1.2, reach: 120, h: 100, kx: 300, ky: -200 }),
    ],
    passive: { id: 'setjelly', name: 'Set Jelly', desc: '+4% max HP and +4% ultimate charge per level', unlock: PASSIVE_UNLOCK, per: { hpPct: 0.04, ultGain: 0.04 } },
  },
  14: { // Salmonster — river rusher
    actives: [
      S({ id: 'upstream', name: 'Upstream Leap', kind: 'upstream', desc: 'Leaps forward and up through monsters like a salmon up a waterfall', cd: 3, dur: 0.55, dmg: 1.8, reach: 80, h: 90, kx: 260, ky: -420 }),
      S({ id: 'tide', name: 'Tidal Push', kind: 'tide', desc: 'A rolling wave that carries monsters along and slams them', unlock: 4, cd: 8, dur: 0.5, dmg: 1.4, reach: 60, h: 60, kx: 320, ky: -200 }),
      S({ id: 'salmonswarm', name: 'Salmon Swarm', kind: 'salmon', desc: 'Four salmon swim out in a wavy line, nibbling everything', unlock: 8, cd: 6, dur: 0.4, dmg: 1.1, reach: 30, h: 30, kx: 140, ky: -140, n: 4 }),
    ],
    passive: { id: 'current', name: 'Strong Current', desc: '+4% attack and +2% move speed per level', unlock: PASSIVE_UNLOCK, per: { atkPct: 0.04, dodge: 0.02 } },
  },
  12: { // Sloba — sleepy swinger
    actives: [
      S({ id: 'vineswing', name: 'Vine Swing', kind: 'swing', desc: 'Swings up and over in an arc through monsters, landing with a sticky boba slam', cd: 3.4, dur: 0.7, dmg: 1.8, reach: 90, h: 80, kx: 260, ky: -300 }),
      S({ id: 'nap', name: 'Power Nap', kind: 'nap', desc: 'Dozes off for a moment: heals as it sleeps, then wakes up with a shockwave', unlock: 4, cd: 11, dur: 1.4, dmg: 2.4, reach: 120, h: 90, kx: 360, ky: -420 }),
      S({ id: 'slothtime', name: 'Sloth Time', kind: 'slowtime', desc: 'Everything nearby slows right down for 4 s, and Sloba speeds up', unlock: 8, cd: 12, dur: 0.5, dmg: 1, reach: 340, h: 200, kx: 40, ky: 0 }),
    ],
    passive: { id: 'easy', name: 'Easy Does It', desc: '+0.15% max HP regained per second and +6% ultimate charge per level', unlock: PASSIVE_UNLOCK, per: { regen: 0.0015, ultGain: 0.06 } },
  },
  16: { // Minturtle — chill wall
    actives: [
      S({ id: 'scoop', name: 'Scoop Lob', kind: 'scoop', desc: 'Lobs a scoop of mint ice cream that bursts and freezes monsters', cd: 3.6, dur: 0.4, dmg: 2, reach: 90, h: 70, kx: 160, ky: -260, n: 1 }),
      S({ id: 'wafflewall', name: 'Waffle Wall', kind: 'wall', desc: 'Plants a waffle wall for 4 s: monsters and their shots can\'t get through', unlock: 4, cd: 12, dur: 0.5, dmg: 1, reach: 90, h: 140, kx: 260, ky: -160 }),
      S({ id: 'chipstorm', name: 'Chip Storm', kind: 'chipstorm', desc: 'Choc chips rain down all around Minturtle', unlock: 8, cd: 7, dur: 0.5, dmg: 1, reach: 240, h: 40, kx: 120, ky: -200, n: 10 }),
    ],
    passive: { id: 'coolshell', name: 'Cool Shell', desc: '-1.5% damage taken and +3% max HP per level', unlock: PASSIVE_UNLOCK, per: { dr: 0.015, hpPct: 0.03 } },
  },
  9: { // Bubblegumbo — gum tank
    actives: [
      S({ id: 'bubbletrap', name: 'Bubble Trap', kind: 'bubbletrap', desc: 'Seals the two nearest monsters in gum bubbles: helpless for 2.5 s, then POP for big damage', cd: 7, dur: 0.5, dmg: 2.6, reach: 320, h: 160, kx: 140, ky: -420, n: 2 }),
      S({ id: 'gumballs', name: 'Gumball Bounce', kind: 'gumball', desc: 'Fires three gumballs that ricochet off monsters, hitting again and again', unlock: 4, cd: 6, dur: 0.4, dmg: 1.2, reach: 30, h: 30, kx: 200, ky: -160, n: 3 }),
      S({ id: 'trumpet', name: 'Trumpet Blast', kind: 'trumpet', desc: 'A mighty trumpet: shockwaves race both ways along the floor and launch monsters', unlock: 8, cd: 9, dur: 0.6, dmg: 2.2, reach: 60, h: 50, kx: 160, ky: -620 }),
    ],
    passive: { id: 'gumhide', name: 'Gum Hide', desc: '-2% damage taken and 4% of damage taken bounced back per level', unlock: PASSIVE_UNLOCK, per: { dr: 0.02, thorns: 0.04 } },
  },
  18: { // Velvaroo — hopping boxer
    actives: [
      S({ id: 'hops', name: 'Triple Hop', kind: 'hops', desc: 'Three big hops forward with a shockwave at every landing', cd: 4, dur: 1.6, dmg: 1.4, reach: 110, h: 70, kx: 220, ky: -300 }),
      S({ id: 'flurry', name: 'One-Two Flurry', kind: 'flurry', desc: 'A blur of six punches; the last one knocks monsters flying', unlock: 4, cd: 5, dur: 0.66, dmg: 0.75, reach: 80, h: 70, kx: 60, ky: -40 }),
      S({ id: 'cakebomb', name: 'Cupcake Bomb', kind: 'cakebomb', desc: 'Lobs a red velvet cupcake that bursts into a slowing frosting patch', unlock: 8, cd: 8, dur: 0.4, dmg: 2.4, reach: 90, h: 60, kx: 220, ky: -360 }),
    ],
    passive: { id: 'footwork', name: 'Footwork', desc: '-3% dodge cooldown and +5% finisher damage per level', unlock: PASSIVE_UNLOCK, per: { dodge: 0.03, heavyDmg: 0.05 } },
  },
  13: { // Avocadrake — guac guardian
    actives: [
      S({ id: 'pithurl', name: 'Pit Hurl', kind: 'pitbounce', desc: 'Hurls its pit, which bounces along the ground three times, hitting at every bounce', cd: 3, dur: 0.4, dmg: 1.7, reach: 40, h: 40, kx: 260, ky: -300, n: 3 }),
      S({ id: 'guacpool', name: 'Guac Pool', kind: 'guac', desc: 'Spreads a guac pool for 5 s: monsters in it slow down and take damage, heroes in it heal', unlock: 4, cd: 9, dur: 0.5, dmg: 0.5, reach: 170, h: 60, kx: 20, ky: 0 }),
      S({ id: 'wingbeat', name: 'Wing Gust', kind: 'gust', desc: 'A mighty wing blast that throws monsters far back and interrupts them', unlock: 8, cd: 8, dur: 0.5, dmg: 2.2, reach: 230, h: 150, kx: 780, ky: -220 }),
    ],
    passive: { id: 'fats', name: 'Healthy Fats', desc: '+0.2% max HP regained per second and +3% max HP per level', unlock: PASSIVE_UNLOCK, per: { regen: 0.002, hpPct: 0.03 } },
  },
  19: { // Tacowl — night flyer
    actives: [
      S({ id: 'salsabomb', name: 'Salsa Bombs', kind: 'drop', desc: 'Drops three salsa bombs that burst and set monsters burning (best from the air)', cd: 3.4, dur: 0.4, dmg: 1.6, reach: 70, h: 60, kx: 120, ky: -260, n: 3, burn: 2 }),
      S({ id: 'screech', name: 'Night Screech', kind: 'screech', desc: 'A piercing screech that stuns every monster in front for 1.6 s', unlock: 4, cd: 9, dur: 0.55, dmg: 1.2, reach: 240, h: 150, kx: 40, ky: 0 }),
      S({ id: 'chips', name: 'Chip Volley', kind: 'volley', desc: 'Sprays a volley of crunchy tortilla chips forward and down', unlock: 8, cd: 6, dur: 0.45, dmg: 1.1, reach: 40, h: 40, kx: 140, ky: -120, n: 7 }),
    ],
    passive: { id: 'nightowl', name: 'Night Owl', desc: '+1% crit chance and +5% crit damage per level', unlock: PASSIVE_UNLOCK, per: { crit: 1, critDmg: 0.05 } },
  },
  17: { // Pengwhip — ice skater
    actives: [
      S({ id: 'slide', name: 'Belly Slide', kind: 'slide', desc: 'Slides on its belly, leaving an icy trail that chills monsters', cd: 2.6, dur: 0.45, dmg: 2, reach: 66, h: 60, kx: 280, ky: -240 }),
      S({ id: 'snowball', name: 'Rolling Snowball', kind: 'snowball', desc: 'Rolls a snowball that grows as it goes and plows through monsters', unlock: 4, cd: 6, dur: 0.4, dmg: 2.4, reach: 40, h: 40, kx: 300, ky: -260 }),
      S({ id: 'freeze', name: 'Deep Freeze', kind: 'freeze', desc: 'Freezes monsters nearby solid for 2.5 s; frozen ones take +30% damage', unlock: 8, cd: 12, dur: 0.7, dmg: 2.4, reach: 240, h: 160, kx: 0, ky: 0 }),
    ],
    passive: { id: 'coldsnap', name: 'Slippery', desc: '-6% dodge cooldown and a longer perfect-dodge window per level', unlock: PASSIVE_UNLOCK, per: { dodge: 0.06 } },
  },
};

export function skillsOf(species: number) { return SKILLS[species] ?? SKILLS[0]; }

// ---------- ultimates ----------
export const ULT_LV = 15;
/** Each kaiju's ultimate: fills a gauge by landing hits (and taking them); invincible while it plays. */
export const ULTS: Record<number, SkillDef> = {
  0: S({ id: 'ult0', name: 'Strawberry Stampede', kind: 'rampage', desc: 'Charges back and forth across the screen three times', cd: 0, dur: 1.5, dmg: 4, reach: 90, h: 110, kx: 360, ky: -360, n: 3 }),
  10: S({ id: 'ult10', name: 'Blueberry Meteor', kind: 'meteor', desc: 'Calls down a shower of giant blueberries ahead', cd: 0, dur: 1.0, dmg: 3.6, reach: 420, h: 60, kx: 260, ky: -500, n: 9 }),
  11: S({ id: 'ult11', name: 'Pizza Party', kind: 'slashall', desc: 'Blinks to every monster on screen, slicing each one', cd: 0, dur: 1.2, dmg: 6, reach: 650, h: 100, kx: 300, ky: -300, n: 8 }),
  4: S({ id: 'ult4', name: 'Moonbeam', kind: 'beam', desc: 'A screen-long beam of moonlight that pierces everything', cd: 0, dur: 1.0, dmg: 3.2, reach: 700, h: 90, kx: 300, ky: -200, n: 4 }),
  1: S({ id: 'ult1', name: 'Kraken Whirl', kind: 'spin', desc: 'Every tentacle at once, for ages', cd: 0, dur: 2, dmg: 1.4, reach: 230, h: 140, kx: 240, ky: -200, n: 20 }),
  2: S({ id: 'ult2', name: 'Cheddar Quake', kind: 'tremor', desc: 'Three growing tremors shake the whole floor', cd: 0, dur: 1.3, dmg: 4, reach: 380, h: 90, kx: 220, ky: -600, n: 3 }),
  5: S({ id: 'ult5', name: 'Toast Storm', kind: 'homing', desc: 'Ten flaming toast bats that hunt monsters down', cd: 0, dur: 0.6, dmg: 2.6, reach: 40, h: 40, kx: 240, ky: -220, n: 10 }),
  7: S({ id: 'ult7', name: 'Dragon Roll Inferno', kind: 'cone', desc: 'A colossal wasabi fire breath', cd: 0, dur: 0.9, dmg: 9, reach: 400, h: 200, kx: 420, ky: -300 }),
  8: S({ id: 'ult8', name: 'Fondue Flood', kind: 'wave', desc: 'A wave of molten chocolate rolls across the whole floor', cd: 0, dur: 0.8, dmg: 8, reach: 120, h: 90, kx: 420, ky: -400 }),
  15: S({ id: 'ult15', name: 'Grand Grill', kind: 'firefloor', desc: 'Lights the floor under every monster on screen', cd: 0, dur: 0.8, dmg: 1.0, reach: 600, h: 80, kx: 60, ky: -120 }),
  3: S({ id: 'ult3', name: 'Jelly Quake', kind: 'jellyquake', desc: 'A giant wobble shakes the whole screen: every monster is hit and glued', cd: 0, dur: 0.9, dmg: 4, reach: 620, h: 300, kx: 100, ky: -300 }),
  14: S({ id: 'ult14', name: 'Salmon Run', kind: 'salmonrun', desc: 'A huge school of salmon leaps across the screen, over and over', cd: 0, dur: 1, dmg: 1.4, reach: 620, h: 200, kx: 160, ky: -260, n: 16 }),
  12: S({ id: 'ult12', name: 'Mega Snooze', kind: 'snooze', desc: 'A giant yawn: every monster on screen falls asleep for 3 s', cd: 0, dur: 0.9, dmg: 2.5, reach: 620, h: 300, kx: 20, ky: -80 }),
  16: S({ id: 'ult16', name: 'Sundae Drop', kind: 'sundae', desc: 'A colossal sundae falls from the sky: a huge impact and a freezing puddle', cd: 0, dur: 0.9, dmg: 9, reach: 170, h: 120, kx: 300, ky: -500 }),
  9: S({ id: 'ult9', name: 'Mega Bubble', kind: 'megabubble', desc: 'Blows a giant bubble that seals every monster on screen for 3 s, then POP!', cd: 0, dur: 0.9, dmg: 5, reach: 620, h: 300, kx: 160, ky: -520 }),
  18: S({ id: 'ult18', name: 'Knockout Punch', kind: 'tko', desc: 'Leaps to the toughest monster around and lands a colossal uppercut', cd: 0, dur: 0.8, dmg: 14, reach: 640, h: 300, kx: 300, ky: -900 }),
  13: S({ id: 'ult13', name: 'Holy Guacamole', kind: 'guacflood', desc: 'A rolling wave of guacamole that leaves healing guac pools behind it', cd: 0, dur: 0.9, dmg: 5, reach: 520, h: 120, kx: 420, ky: -340 }),
  19: S({ id: 'ult19', name: 'Midnight Fiesta', kind: 'fiesta', desc: 'A piñata bursts: every monster on screen is stunned and pelted with candy', cd: 0, dur: 0.9, dmg: 3.2, reach: 620, h: 300, kx: 80, ky: -200, n: 14 }),
  17: S({ id: 'ult17', name: 'Blizzard', kind: 'blizzard', desc: 'A screen-wide blizzard that hits and chills every monster for 3 s', cd: 0, dur: 0.8, dmg: 1.6, reach: 600, h: 200, kx: 40, ky: -60 }),
  6: S({ id: 'ult6', name: 'Steamer Feast', kind: 'nova', desc: 'A giant steam blast that also heals 40%', cd: 0, dur: 0.9, dmg: 8, reach: 340, h: 240, kx: 420, ky: -420, heal: 0.4 }),
};

/** Which existing animation each skill kind borrows (pose.ts). */
export const POSE_OF: Partial<Record<SkillKind, SkillKind>> = {
  vortex: 'spin', roll: 'spin', boomerang: 'cone', whip: 'cone', pull: 'cone', breath: 'cone', zone: 'cone', beam: 'cone',
  geyser: 'nova', drain: 'nova', freeze: 'nova', radial: 'nova', firefloor: 'nova', blizzard: 'nova', orbit: 'buff', counter: 'buff',
  pounce: 'slam', tremor: 'slam', wave: 'slam', meteor: 'slam', swoop: 'dash', blink: 'dash', bulldoze: 'dash', slide: 'dash', rampage: 'dash', slashall: 'dash',
  throw: 'uppercut',
  jiggle: 'slam', clones: 'cone', wobble: 'buff', upstream: 'dash', tide: 'cone', salmon: 'cone', jellyquake: 'nova', salmonrun: 'nova',
  swing: 'dash', nap: 'buff', slowtime: 'nova', wall: 'slam', scoop: 'cone', chipstorm: 'nova', snooze: 'nova', sundae: 'slam',
  bubbletrap: 'nova', gumball: 'cone', trumpet: 'slam', hops: 'dash', flurry: 'cone', cakebomb: 'cone', megabubble: 'nova', tko: 'uppercut',
  pitbounce: 'cone', guac: 'nova', gust: 'cone', drop: 'cone', screech: 'buff', volley: 'cone', guacflood: 'slam', fiesta: 'nova',
};

// ---------- branches ----------
export const BRANCH_LV = 3;
export type BranchId = 'a' | 'b';
export interface Branch { id: BranchId; name: string; desc: string; mods: { dmg?: number; reach?: number; cd?: number; n?: number; dur?: number; heal?: number; buffT?: number } }
/** At skill level 3 every active picks one of two upgrades. */
export function branchesFor(s: SkillDef): [Branch, Branch] {
  const power: Branch = s.kind === 'buff' || s.kind === 'heal'
    ? { id: 'a', name: 'Quick Recharge', desc: '-30% cooldown', mods: { cd: 0.7 } }
    : { id: 'a', name: 'Power', desc: '+35% damage', mods: { dmg: 1.35 } };
  const wide: Branch = { id: 'b', name: 'Wider', desc: '+35% reach', mods: { reach: 1.35 } };
  const quick: Branch = { id: 'b', name: 'Quick Step', desc: '-35% cooldown', mods: { cd: 0.65 } };
  const B: Partial<Record<SkillKind, Branch>> = {
    cone: { id: 'b', name: 'Wide Spray', desc: '+40% reach and height', mods: { reach: 1.4 } },
    slam: { id: 'b', name: 'Big Shockwave', desc: '+40% radius', mods: { reach: 1.4 } },
    dash: quick, swoop: quick, blink: quick, slide: quick, counter: quick, throw: quick,
    bolt: { id: 'b', name: 'Twin Bolt', desc: 'Fires two bolts', mods: { n: 1 } },
    fan: { id: 'b', name: 'Wide Fan', desc: '+2 bolts', mods: { n: 2 } },
    vortex: { id: 'b', name: 'Long Spin', desc: '+40% duration and hits', mods: { dur: 1.4, n: 0.4 } },
    roll: { id: 'b', name: 'Long Roll', desc: '+40% duration', mods: { dur: 1.4 } },
    uppercut: { id: 'b', name: 'Quick Upper', desc: '-30% cooldown', mods: { cd: 0.7 } },
    mines: { id: 'b', name: 'More Mines', desc: '+2 mines', mods: { n: 2 } },
    goo: { id: 'b', name: 'More Mustard', desc: '+2 blobs', mods: { n: 2 } },
    rain: { id: 'b', name: 'Downpour', desc: '+4 slices', mods: { n: 4 } },
    radial: { id: 'b', name: 'More Quills', desc: '+4 spikes', mods: { n: 4 } },
    orbit: { id: 'b', name: 'Bigger Ring', desc: '+2 rice balls', mods: { n: 2 } },
    geyser: { id: 'b', name: 'More Flasks', desc: '+2 geysers', mods: { n: 2 } },
    whip: { id: 'b', name: 'Triple Lash', desc: 'Hits three times', mods: { n: 1 } },
    breath: { id: 'b', name: 'Long Breath', desc: '+40% duration', mods: { dur: 1.4, n: 2 } },
    buff: { id: 'b', name: 'Lasting', desc: '+50% duration', mods: { buffT: 1.5 } },
    nova: { id: 'b', name: 'Big Nova', desc: '+35% radius', mods: { reach: 1.35 } },
    heal: { id: 'b', name: 'Big Feast', desc: '+50% healing', mods: { heal: 1.5 } },
    drain: { id: 'b', name: 'Big Slurp', desc: '+35% radius', mods: { reach: 1.35 } },
    zone: { id: 'b', name: 'Thick Steam', desc: '+35% size', mods: { reach: 1.35 } },
    freeze: { id: 'b', name: 'Big Chill', desc: '+35% radius', mods: { reach: 1.35 } },
    pull: wide, pounce: wide, bulldoze: { id: 'b', name: 'Long Charge', desc: '+35% distance', mods: { dur: 1.35 } },
    boomerang: { id: 'b', name: 'Twin Cutters', desc: 'Throws two', mods: { n: 1 } },
    twister: { id: 'b', name: 'Big Twister', desc: '+40% size', mods: { reach: 1.4 } },
    snowball: { id: 'b', name: 'Snowman', desc: '+40% size', mods: { reach: 1.4 } },
  };
  return [power, B[s.kind] ?? wide];
}

/** A skill with its branch applied (skills are shared constants, so this returns a copy). */
export function applyBranch(s: SkillDef, b: BranchId | undefined): SkillDef {
  if (!b) return s;
  const m = branchesFor(s)[b === 'a' ? 0 : 1].mods;
  const out: SkillDef = { ...s };
  if (m.dmg) out.dmg *= m.dmg;
  if (m.reach) { out.reach *= m.reach; out.h *= Math.sqrt(m.reach); }
  if (m.cd) out.cd *= m.cd;
  if (m.dur) out.dur *= m.dur;
  if (m.n) out.n = s.kind === 'spin' || s.kind === 'vortex' ? Math.round((s.n ?? 6) * (1 + m.n)) : (s.n ?? 1) + m.n;
  if (m.heal && s.heal) out.heal = s.heal * m.heal;
  if (m.buffT && s.buff) out.buff = { ...s.buff, t: s.buff.t * m.buffT };
  return out;
}

/** A signature legendary's upgrade on top of a skill (see items.ts SIGS). */
export function applyMod(s: SkillDef, m: SkillMod | undefined): SkillDef {
  if (!m) return s;
  const out: SkillDef = { ...s };
  if (m.dmg) out.dmg *= m.dmg;
  if (m.reach) { out.reach *= m.reach; out.h *= Math.sqrt(m.reach); }
  if (m.cd) out.cd *= m.cd;
  if (m.n) out.n = s.kind === 'spin' || s.kind === 'vortex' ? Math.round((s.n ?? 6) * (1 + m.n / 6)) : (s.n ?? 1) + m.n;
  if (m.ky) { out.ky *= m.ky; out.kx *= Math.sqrt(m.ky); }
  if (m.burn) out.burn = Math.max(s.burn ?? 0, m.burn);
  if (m.freeze) out.freeze = true;
  if (m.glue) out.glue = true;
  if (m.slow) out.slow = true;
  if (m.leech) out.leech = (s.leech ?? 0) + m.leech;
  if (m.echo) out.echo = true;
  return out;
}

/** Damage multiplier and cooldown at a given skill level. */
export function skillScale(level: number): { dmg: number; cd: number } {
  const l = Math.max(1, level);
  return { dmg: 1 + 0.2 * (l - 1), cd: 1 - 0.04 * (l - 1) };
}
