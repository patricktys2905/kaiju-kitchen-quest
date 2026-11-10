// In-stage banter: speech bubbles that don't pause play. Monsters taunt (with food puns) the first time each kind
// shows up in a stage; your kaiju quips at big moments. Kaiju lines live in src/story/more/k<species>.ts.
import type { MobKind } from '../sim/types';

/** Moments your kaiju reacts to. */
export type QuipKind = 'combo' | 'lowhp' | 'perfect' | 'levelup' | 'secret' | 'boom' | 'mimic' | 'objective';

/** What each monster says when it first appears in a stage (one is picked at random). */
export const TAUNTS: Partial<Record<MobKind, string[]>> = {
  bun: ['You\'re toast! ...Wait, that\'s my line.', 'I\'m on a roll!', 'Feeling crusty today.'],
  worm: ['Sour power!', 'Let\'s get this wiggle on!', 'I\'m not bitter. You\'re bitter.'],
  pepper: ['Things are about to get spicy!', 'Pepper spray, coming up!', 'Hot stuff coming through!'],
  egg: ['Prepare to be eggs-terminated!', 'I\'m a tough egg to crack.', 'Smell ya later. Literally.'],
  pea: ['Peas surrender!', 'Give peas a chance? Nope!', 'Shell shocked yet?'],
  yogurt: ['Culture shock incoming!', 'I\'m a little cultured.', 'Splorp. That\'s yogurt for "hello".'],
  icebat: ['Brrrain freeze!', 'Chill out. Permanently.', 'Ice to meet you!'],
  pickle: ['You\'re in a pickle now!', 'Dill with it!', 'En garde, and also en brine!'],
  popcorn: ['POP! POP! Pop quiz!', 'Things are heating up!', 'Kernel of truth: you\'re done!'],
  imp: ['Sauce boss in the house!', 'Hot sauce, hot temper!', 'Feeling saucy?'],
  bacon: ['Sizzle sizzle, you\'re in a pickle. Wait, wrong food.', 'I\'ll bring home the... me.', 'Crispy and dangerous!'],
  meatball: ['Mama mia, you\'re in trouble!', 'I\'m having a ball!', 'Meet your match. Meat your match?'],
  can: ['Yes we can! Block you, I mean.', 'Can\'t touch this!', 'Tin-credible defence!'],
  cheerio: ['Cheerio, old chap! Goodbye, I mean.', 'Hole-y moly!', 'We\'re a whole cereal of trouble!'],
  minicheerio: ['Mini but mighty!', 'Tiny O, big NO!'],
  soda: ['Fizz-tastic!', 'I\'m about to blow my top!', 'Bubble trouble!'],
  flour: ['Boooo! Flour power!', 'I\'m a little floury today.', 'Whooo knead to know?'],
  garlic: ['Heal thy fellow monsters! Also, I stink.', 'Clove encounter!', 'Bless you. You\'ll need it.'],
  ant: ['Dig it!', 'Ant-icipate me!', 'Sweet! A sugar rush!'],
  mimic: ['Surprise! I\'m lunch!', 'Box of chocolates? Box of TEETH!', 'You never know what you\'re gonna get!'],
  carrot: ['Eye see you!', 'What\'s up, snack?', 'I never miss. Unlike my eyesight.'],
  milk: ['Moooove aside!', 'Udderly unstoppable!', 'Got milk? Got HORNS!'],
  jelly: ['My babies will wobble you!', 'Jelly-ous yet?', 'Wiggle wiggle, little ones!'],
  jellybit: ['Wobble!', 'Jelly-roll!'],
  kettle: ['I\'m steaming mad!', 'Tea time! Hot tea. VERY hot tea.', 'Whistle while I hurt!'],
  sausage: ['Links up! Charge!', 'You\'re the wurst!', 'Banger coming through!'],
  marsh: ['I\'ll patch them right up!', 'Toasty and caring!', 'Nurse Marsh, reporting for s\'more duty!'],
  noodle: ['Use your noodle!', 'Pasta la vista!', 'I\'m pasta caring!'],
  raisin: ['Raisin the stakes!', 'Grape expectations? I\'m wrinkled.', 'Raisin my aim...'],
  cereal: ['Part of a complete breakfast: YOU!', 'Snap, crackle, CHOMP!', 'Breakfast is served. It\'s YOU!'],
};
