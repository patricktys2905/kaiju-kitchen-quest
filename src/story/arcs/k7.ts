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
  "w5-open": [["me", "The Sink. Hrrm. A whole lake of dishwater, and my flame is made of fire. This could be awkward."], ["me", "Proverb: \"Fire plus water makes steam, and steam makes dumplings!\" Hah! Then I am ready."]],
  "w5-boss": [["boss", "Hehehe... come closer, old dragon. Down here your little green flame goes *pff*, just like before!"], ["me", "Nine hundred years I waited for this fire! No bathtub fungus is blowing it out!"], ["boss", "Bathtub?! Hehehe! I am a CROWN!"], ["me", "Then let me toast you, Your Highness! FWOOOOSH!"]],
  "w5-after": [["boss", "Squeak! No fair! I was only a little science project! Somebody grew me in the back of the fridge and forgot me!"], ["me", "Hrrm! Somebody? Who? Speak, tiny fuzz!"], ["boss", "Not telling! Byeee! Blub blub bluuub!"], ["n", "SHLOOORP! Down the drain it goes! And up floats the Head Chef's tall white hat with a note: \"All safe! Thank you!\""], ["me", "The Chef is safe! The kitchen is safe! Now, home to my bamboo mat."], ["me", "Look, sunrise! And my flame burns green and strong, steady as the day I hatched! FWOOOOSH!"], ["me", "Proverb: \"When the road ends, roll out a mat and eat breakfast.\" Ha! Finally, one I wrote myself!"], ["me", "This is the way of the Roll! Sushi for everybody! I have nine hundred years of savings!"]],
  "w6-open": [["n", "Act 2: Beyond the Kitchen! A few days later, Norigon rolls out his bamboo mat for a giant dinner party."], ["me", "Hrrm! Sushi for everybody, and one seat saved for Gari, as promised. A dragon always pays up."], ["n", "Uh-oh! The invitations have gone crusty, and a trail of stale crumbs leads out the kitchen door!"], ["lo", "A dinner party, old dragon? Hmph. Nobody ever saves a seat for the fruitcake. Hehehe..."], ["me", "Proverb: \"Never let a guest's rice go stale!\" To the Dining Room! Hup hup!"]],
  "w6-boss": [["boss", "Halt, raw fish! I am SIR STALE, aged to perfection! Have at thee!"], ["me", "Aged? I am nine hundred years old, breadstick. You are just crusty."], ["boss", "CRUSTY?! I am VINTAGE! Forsooth, en garde!"], ["me", "Proverb: \"Old bread makes the best croutons.\" FWOOOOSH!"]],
  "w6-after": [["n", "SNAP! Sir Stale's butter-knife lance breaks clean in two, and he scrambles for the window!"], ["boss", "Unhand me, varlet! This isn't over! Baron Brussels shall grill thee in the Backyard!"], ["me", "Hrrm. Toasted on one side only. Sloppy work, Roll Dragon."], ["me", "Proverb: \"Dinner is not over until every guest gets home.\" Hold my seat, Gari! To the Backyard!"]],
};
export const NEMESIS: Record<"w1-elite" | "w2-elite" | "w3-elite" | "w4-elite" | "w5-elite" | "w6-elite", StoryLine[]> = {
  "w1-elite": [["foe", "Ssso! The last Roll Dragon still crawls! I am Gari, and I swallowed your flame's last ember! Sss-hehehe!"], ["me", "Then I shall take it back, you pickled noodle!"]],
  "w2-elite": [["foe", "Cold, isn't it, old dragon? Without your fire? Ssshiver, ssshiver!"], ["me", "Hrrm. A dragon's heart stays warm, fire or no fire. Also, I wore a scarf."]],
  "w3-elite": [["foe", "The oven feeds my pink flame! Your green one is just a memory! Sss-ha!"], ["me", "Memories are where the Roll keeps its strength. And its snacks."]],
  "w4-elite": [["foe", "Take your ember, then! IF you can pull it from my coils!"], ["me", "This is the way of the Roll! HYAAAH!"], ["foe", "Ssss! It burns! Okay, okay, it was always yours! Hmph. This isn't over!"]],
  "w5-elite": [["foe", "Ssso! Look at me now, dragon! A whole JAR of ginger! The Mold promised me your flame, and I'm ssstill waiting!"], ["me", "Gari, ginger sits NEXT to the sushi! We were always on the same plate, you pickled noodle! HYAAAH!"], ["foe", "Ssss! Same plate? That's the nicest thing anyone ever said to a condiment!"], ["foe", "Fine! Maybe I'll ssstop! MAYBE! Sssave me a seat at dinner. Hmph!"]],
  "w6-elite": [["foe", "Ssso, dragon! You sssaved me a seat. Bad news! A big Roast Brute is sssitting in it!"], ["me", "Then he was never invited, pickled noodle. Hrrm! Shall we show him out together?"], ["foe", "Together? Sss-hehe! Fine! But I'm only here for the free dinner. Hmph!"]],
};
