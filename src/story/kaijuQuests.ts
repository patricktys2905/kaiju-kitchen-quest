// Kaiju unlock challenges (account-wide) and each kaiju's own quest line (8 quests, titled from its story).
import { MOBS } from '../sim/mobs';
import { skillsOf } from '../sim/skills';
import type { MobKind } from '../sim/types';

/** Challenges that recruit the 8 kaiju beyond the 4 starters. Keys are account-wide counters (quests.ts). */
export const UNLOCKS: { species: number; text: string; key: string; goal: number }[] = [
  { species: 1, text: 'Defeat 50 Sour Worms', key: 'kill:worm', goal: 50 },
  { species: 2, text: 'Defeat 20 Rotten Eggs', key: 'kill:egg', goal: 20 },
  { species: 5, text: 'Clear 3 stages with an S rank', key: 'rankS', goal: 3 },
  { species: 6, text: 'Use 20 quick-bag items', key: 'potions', goal: 20 },
  { species: 7, text: 'Defeat the Burnt Toast King 3 times', key: 'kill:toast', goal: 3 },
  { species: 8, text: 'Defeat 30 Pickle Knights', key: 'kill:pickle', goal: 30 },
  { species: 15, text: 'Defeat 60 Sizzle Bacon', key: 'kill:bacon', goal: 60 },
  { species: 17, text: 'Defeat 40 Brain-Freeze Bats', key: 'kill:icebat', goal: 40 },
  // Act 2 newcomers: they turn up once the story reaches them
  { species: 13, text: 'Defeat the Mold Crown (end of Act 1)', key: 'kill:moldking', goal: 1 },
  { species: 19, text: 'Defeat Sir Stale in the Dining Room', key: 'kill:stale', goal: 1 },
];

export interface KQuest { id: string; title: string; text: string; key: string; goal: number; reward: { crumbs?: number; fstone?: number; gstone?: number; ggstone?: number; box?: 1 | 2 | 3 | 4 | 5; sigCharm?: boolean } }

/** Each kaiju's favourite foe (its first quest) and story-flavoured quest titles. */
const FLAVOUR: Record<number, { foe: MobKind; titles: string[] }> = {
  0: { foe: 'egg', titles: ['Egg Smasher', 'Seedy Business', 'Medium-Sized Hero', 'Combo Kaiju', 'Untouchable Berry', 'Ice Breaker', 'Roar of the Ultimate', 'Gobzilla Senior'] },
  10: { foe: 'bun', titles: ['No Mould Near My Cubs', 'Quake Papa', 'Bear Necessities', 'Paw-some Combo', 'Not a Scratch', 'Thaw the Golem', 'Meteor Shower', 'Papa Bear of the Kitchen'] },
  11: { foe: 'worm', titles: ['Worm Delivery', 'Express Lane', 'On-Time Bonus', 'Combo Crust', 'Box Stays Level', 'Hot Delivery, Cold Golem', 'Rush Hour', 'Employee of the Month'] },
  4: { foe: 'icebat', titles: ['Bat Out of the Light', 'Glitter Bolts', 'Moonrise', 'Dancing in the Dust', 'Soft as Marshmallow', 'Light in the Freezer', 'Moonbeam', 'The Moth Who Found the Moon'] },
  1: { foe: 'yogurt', titles: ['Culture Samples', 'Ink Analysis', 'Peer Review', 'Eight-Arm Combo', 'Lab Safety', 'Thermal Experiment', 'Kraken Theory', 'Doctor of Jellyology'] },
  2: { foe: 'pickle', titles: ['Pickle Pincher', 'Snappy', 'Sideways Victory', 'Claw Flurry', 'Hard Shell', 'Cold Garden', 'Cheddar Quake', 'King of the Patch'] },
  5: { foe: 'bacon', titles: ['Bacon Heist', 'Butter Fingers', 'Clean Getaway', 'Crumb Trail', 'Never Caught', 'Cold Vault', 'Toast Storm', 'The Greatest Thief'] },
  6: { foe: 'meatball', titles: ['Cousin Meatball', 'Steam Speech', 'Royal Decree', 'Courtly Combo', 'Untouchable Majesty', 'The Frozen Province', 'Royal Feast', 'Friend of the Realm'] },
  7: { foe: 'imp', titles: ['Fire Against Fire', 'Wasabi Breath', 'The Old Road', 'Dragon Dance', 'Unscorched Scales', 'Frozen Shrine', 'Inferno Roll', 'Flame Reborn'] },
  8: { foe: 'popcorn', titles: ['Pop Goes the Corn', 'Chocolate Fists', 'Me Strong', 'Punch Punch Punch', 'Me Not Melt', 'Me Like Fridge', 'Fondue Fall', 'Bravest Chocolate'] },
  15: { foe: 'can', titles: ['Can Opener', 'Spiky Roller', 'Practice Round', 'Grill Marks', 'Clean Plate', 'Cold Cookout', 'Spin Dog', 'Grill Champion'] },
  13: { foe: 'garlic', titles: ['Garlic Breath', 'Pit Stop', 'Holy Guacamole', 'Guac and Roll', 'Fresh, Not Brown', 'Chill Avocado', 'Guac Tsunami', 'Guardian of the Guac'] },
  19: { foe: 'ant', titles: ['Ant Snacks', 'Salsa Drop', 'Night Shift', 'Fiesta Combo', 'Who? Me?', 'Cool Owl', 'Midnight Fiesta', 'Every Day Is Taco Tuesday'] },
  17: { foe: 'flour', titles: ['Ghost Busting', 'Belly Slider', 'Long Slide', 'Cookie Flurry', 'Slippery', 'Home Sweet Freezer', 'Blizzard', 'Home Is Where the Friends Are'] },
};

/** Quest line for one kaiju. Keys are this kaiju's own counters (HeroProfile.stats). */
export function kaijuQuests(species: number): KQuest[] {
  const f = FLAVOUR[species] ?? FLAVOUR[0];
  const s1 = skillsOf(species).actives[0];
  const t = f.titles;
  return [
    { id: 'foe', title: t[0], text: `Defeat 40 ${MOBS[f.foe].name}s`, key: `kill:${f.foe}`, goal: 40, reward: { crumbs: 150, fstone: 2 } },
    { id: 'skill', title: t[1], text: `Use ${s1.name} 50 times`, key: `skill:${s1.id}`, goal: 50, reward: { crumbs: 150, gstone: 1 } },
    { id: 'rank', title: t[2], text: 'Clear stage 1-5 with an A rank or better', key: 'clear:1-5', goal: 4, reward: { box: 3 } },
    { id: 'combo', title: t[3], text: 'Reach a 25-hit combo', key: 'combo', goal: 25, reward: { crumbs: 250, fstone: 3 } },
    { id: 'nohit', title: t[4], text: 'Clear any stage without being hit', key: 'nohit', goal: 1, reward: { box: 3, gstone: 1 } },
    { id: 'golem', title: t[5], text: 'Defeat the Freezer Golem', key: 'kill:golem', goal: 1, reward: { box: 4 } },
    { id: 'ult', title: t[6], text: 'Land 10 Ultimates', key: 'ult', goal: 10, reward: { crumbs: 500, ggstone: 1 } },
    { id: 'hard', title: t[7], text: 'Clear any stage on Hard mode', key: 'hard', goal: 1, reward: { sigCharm: true, ggstone: 1 } },
  ];
}
