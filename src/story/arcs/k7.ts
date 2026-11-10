// Norigon: main story arc and nemesis scenes (cartoon voice, see docs/VOICE.md).
import type { StoryLine } from '../stories';

export const TITLE = "The Last Roll Dragon";
export const TAGLINE = "Hrrm! A nine-hundred-year-old sushi dragon wants his fire back!";
/** same keys as STORIES[7].beats except the w{N}-elite and w{N}-s{n} ones */
export const ARC: Record<string, StoryLine[]> = {
  "intro": [["n", "Long ago, Roll Dragons breathed green Wasabi Flame! Now only one is left, and his fire went out!"], ["me", "Hrrm. Without the Chef's blessing, my mighty flame is just... *pff*. That."], ["me", "So I shall walk the old dragon road and light it again! This is the way of the Roll!"]],
  "w1-open": [["me", "The countertop of my ancestors! Hrrm. Smaller than the legends said. And stickier."]],
  "w1-boss": [["boss", "A DRAGON? HAH! YOU'RE JUST A SNACK ROLL!"], ["me", "Hrrm. Even a small flame can make toast!"], ["boss", "WAIT. I'M THE TOAST!"]],
  "w1-after": [["boss", "Ow, ow. Hey, your flame flickered when you bonked me!"], ["me", "A good, honest scrap stirs the fire! Onward! The road continues!"]],
  "w2-open": [["me", "The Frozen Shrine. My ancestors napped here between battles. Brrr! Chilly naps."]],
  "w2-boss": [["boss", "SLEEP FOREVER! LIKE THE OLD DRAGONS! SLEEEEP!"], ["me", "The old dragons slept, ice-brain. They did NOT give up!"]],
  "w2-after": [["boss", "Whoa, I feel all thawed. Your fire's warming up, dragon! Seek the Oven. The Flame was born there!"], ["me", "To the Oven! Hup hup!"]],
  "w3-open": [["me", "The Oven! The great forge where my ancestors were rolled. Ooh, it smells like home."]],
  "w3-boss": [["boss", "I AM THE LAST DRAGON THAT MATTERS! ROOOAR!"], ["me", "Hrrm. Then let two last dragons settle it!"]],
  "w3-after": [["n", "Whoa! The two dragons breathe together, and green fire roars back to life!"], ["me", "FWOOOSH! The Wasabi Flame! It's BACK! Ha ha!"], ["boss", "Use it well, buddy. The mould is scared of fire, and it's hiding in the Pantry."]],
  "w4-open": [["me", "Flame restored! Now I owe this kitchen one big favour, and a dragon always pays up."]],
  "w4-boss": [["boss", "NO FIRE NEAR MY COOKIES! NO FIRE! NO FIRE!"], ["me", "Then you should not have stolen them, cookie-snatcher!"]],
  "w4-after": [["me", "FWOOOOSH! Out of my Pantry, fuzz! Every last speck of you!"], ["mold", "Hehehe... fire, old dragon? In the Sink, all fires drown."], ["me", "Hrrm! A Roll Dragon is made of rice and sea. A little water? Bring it on!"], ["n", "To be continued in World 5: The Sink."]],
};
export const NEMESIS: Record<"w1-elite" | "w2-elite" | "w3-elite" | "w4-elite", StoryLine[]> = {
  "w1-elite": [["foe", "Ssso! The last Roll Dragon still crawls! I am Gari, and I swallowed your flame's last ember! Sss-hehehe!"], ["me", "Then I shall take it back, you pickled noodle!"]],
  "w2-elite": [["foe", "Cold, isn't it, old dragon? Without your fire? Ssshiver, ssshiver!"], ["me", "Hrrm. A dragon's heart stays warm, fire or no fire. Also, I wore a scarf."]],
  "w3-elite": [["foe", "The oven feeds my pink flame! Your green one is just a memory! Sss-ha!"], ["me", "Memories are where the Roll keeps its strength. And its snacks."]],
  "w4-elite": [["foe", "Take your ember, then! IF you can pull it from my coils!"], ["me", "This is the way of the Roll! HYAAAH!"], ["foe", "Ssss! It burns! Okay, okay, it was always yours! Hmph. This isn't over!"]],
};
