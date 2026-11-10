// In-stage banter: speech bubbles that don't pause play. Monsters taunt (with food puns) the first time each kind
// shows up in a stage; your kaiju quips at big moments. Kaiju lines live in src/story/more/k<species>.ts.
import type { MobKind } from '../sim/types';

/** Moments your kaiju reacts to. */
export type QuipKind = 'combo' | 'lowhp' | 'perfect' | 'levelup' | 'secret' | 'boom' | 'mimic' | 'objective';

/** What each monster says when it first appears in a stage (one is picked at random). */
export const TAUNTS: Partial<Record<MobKind, string[]>> = {
  // World 5: The Sink
  plate: ["Nobody's washin' THIS plate!", "I've got crust AND a shield! Bring it!", "You're on my dish list, pal!"],
  bubble: ["Pop quiz! Hehe, get it? POP?", "Wheee! Catch me if you can!", "Ooh, you look like you need a bath!"],
  glove: ["Gimme five! Gimme ALL five!", "Grabby time! Hands off? Nope!", "I'm gonna wring ya out!"],
  eel: ["Surprise from the plughole!", "Down the drain with ya!", "Slurrrp! Fresh snack!"],
  mug: ["Have a cup of cold coffee! PTOO!", "I'm a MUG, and you're a mug too!", "Bitter? Me? Always!"],
  scrub: ["Time for a DEEP clean!", "I scrub tougher stains than you!", "Elbow grease! EXTRA grease!"],
  sporeling: ["Puff puff! For the Crown!", "Achoo! Uh, I mean BOO!", "Little spore, BIG trouble!"],
  bun: ["Hey! You're toast! ...Wait, that's MY line!", "Rollin' in! Get it? ROLL-in'?", "Ooh, a fresh one. Let's get crusty!"],
  worm: ["Wiggle wiggle, here comes trouble!", "Sour power, baby!", "Ew, a hero! Gross!"],
  pepper: ["Ooh, things are gettin' SPICY!", "Achoo! Pepper attack!", "Hot stuff comin' through!"],
  egg: ["Prepare to be EGG-sterminated!", "Ha! I'm one tough egg to crack!", "Phew, who cut the... oh, that's me."],
  pea: ["Peas surrender! Ha! Get it?", "Pew pew! Pea pew!", "Shell shocked yet, pal?"],
  yogurt: ["Splorp! That's yogurt for HI!", "Prepare for some culture shock!", "Ooh, I'm a little cultured!"],
  icebat: ["Skreee! BRAIN FREEZE!", "Ice to meet ya! Now SCRAM!", "Chill out, why don'tcha!"],
  pickle: ["En garde! And also... en BRINE!", "You're in a real pickle now!", "Dill with it, peasant!"],
  popcorn: ["POP! POP! Pop quiz, hotshot!", "Kernel Popcorn reporting for duty!", "It's poppin' off now!"],
  imp: ["Sauce boss in the house!", "Feelin' saucy, are ya?", "Hehe! Hot sauce, hot temper!"],
  bacon: ["Sizzle sizzle! Out of my pan!", "Ha! You can't handle the crisp!", "I'm bringin' home ME!"],
  meatball: ["Mama mia! A hero!", "I'm havin' a BALL!", "Meat your match, buddy!"],
  can: ["Yes we CAN... block you!", "Can't touch this! Clang!", "Tin-credible, right?!"],
  cheerio: ["Cheerio, old chap! Bye-bye now!", "Hole-y moly, it's a hero!", "We're a whole cereal of trouble!"],
  minicheerio: ["Mini but MIGHTY!", "Tiny O says NO!"],
  soda: ["Fizzzz... I'm gonna BLOW!", "Bubble trouble, comin' up!", "Shake me, I dare ya!"],
  flour: ["Boooo! FLOUR POWER!", "Whooo knead to know?", "Oooh, I'm feelin' floury..."],
  garlic: ["Bless you, monsters! Ew, not YOU.", "A clove encounter! Hehe!", "I'll heal 'em right up! Phew, I stink."],
  ant: ["Dig it! Dig IT!", "Ooh! A sugar rush!", "You won't ANT-icipate me!"],
  mimic: ["SURPRISE! I'm lunch! YOUR lunch!", "Box of treats? Box of TEETH!", "Nom nom nom! Haha!"],
  carrot: ["Eye see you! Well, one eye.", "What's up, snack?", "Hold still! I never miss! ...Mostly!"],
  milk: ["MOOOOVE aside!", "Got milk? Got HORNS!", "Udderly unstoppable, baby!"],
  jelly: ["Go get 'em, my wobblers!", "Jelly-ous of my babies?", "Wiggle wiggle, little ones!"],
  jellybit: ["Wobble wobble!", "Jelly roll! Wheee!"],
  kettle: ["Grrr! I'm STEAMING mad!", "Tea time! HOT tea time!", "Wheeeee-ooooo! That's my whistle!"],
  sausage: ["Links up! CHAAARGE!", "You're the WURST!", "Banger comin' through!"],
  marsh: ["Nurse Marsh to the rescue!", "Ooh, a boo-boo! I'll fix it!", "Toasty and caring, that's me!"],
  noodle: ["Pasta la vista, baby!", "Use your noodle! Oh wait, I AM the noodle!", "I'm pasta caring!"],
  raisin: ["Raisin the stakes! Hehe!", "Grape expectations? Nope, wrinkles!", "Ready... aim... raisin!"],
  cereal: ["SURPRISE! Breakfast is served! It's YOU!", "Snap! Crackle! CHOMP!", "Part of a complete breakfast! YOU!"],
};
