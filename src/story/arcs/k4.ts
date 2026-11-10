// Mothball: main story arc and nemesis scenes (cartoon voice, see docs/VOICE.md).
import type { StoryLine } from '../stories';

export const TITLE = "Chasing the Moon";
export const TAGLINE = "A dreamy little moth who thinks every light is the moon!";
/** same keys as STORIES[4].beats except the w{N}-elite and w{N}-s{n} ones */
export const ARC: Record<string, StoryLine[]> = {
  "intro": [["n", "Every night, the kitchen moon shone through the window. Then the Head Chef vanished, and the moon went dark!"], ["me", "Oh, mooooon! Where'd you go?"], ["me", "Don't worry, I'm coming! I always find the light. Well... usually. Okay, sometimes!"]],
  "w1-open": [["me", "Ooooh, the Countertop is sooo bright today! Moon? Is that you?"], ["me", "Aw, nope. Just the ceiling light. Hi, ceiling light!"]],
  "w1-boss": [["boss", "THE BURNER IS MY THRONE! ITS GLOW IS MINE! ALL MINE!"], ["me", "Whoa, your glow is way too hot and way too grumpy, Your Majesty!"], ["me", "Sorry, but somebody's gotta cool you down! Flap flap, FWOOSH!"]],
  "w1-after": [["boss", "Ugh... a soft little light. Thanks, kiddo. The green fuzz is gone!"], ["me", "Yay! Hey, have you seen the moon? Pale and round and super gentle?"], ["boss", "Try the Fridge! It glows whenever somebody opens the door."], ["me", "Ooh! Fridge, here I come!"]],
  "w2-open": [["me", "Ooh, a cold light! Is it the moon? Is it, is it?"], ["me", "Hmm. Nah, way too blue. The moon's more of a creamy vanilla."]],
  "w2-boss": [["boss", "ALL LIGHT WILL FREEEEEZE! FREEZE, I SAY!"], ["me", "Nuh-uh! Not my light! Not EVER!"]],
  "w2-after": [["boss", "Whoa, warm... I remember warm! Hey, little moth, your moon is the Oven lamp."], ["me", "The Oven lamp? Really?"], ["boss", "Yup. It went out when the Chef left. Sorry! Brr, I'm still a bit frosty."]],
  "w3-open": [["me", "Ooh, the Oven is so toasty! I can feel the moon somewhere up above!"], ["me", "Hang on, moon! I'm coming! Flap flap flap!"]],
  "w3-boss": [["boss", "MOTHS ARE DRAWN TO FLAME! COME CLOSER, LITTLE SNACK! HAHAHA!"], ["me", "Nope! I'm drawn to the moon. You're just a big greasy nightlight!"]],
  "w3-after": [["n", "The Oven lamp flickers back on, pale and round!"], ["me", "My moon! Hi, moon! ...Um, why are you so dim?"], ["boss", "Uh, sorry. The Mold Crown's been slurping up the kitchen's light."], ["boss", "It hides in the Pantry. Then somewhere even deeper. Blech!"]],
  "w4-open": [["me", "Dark shelves and dusty air. Ah-choo! Okay, wings, time to glow!"], ["me", "Follow me, everybody! I'm the nightlight now!"]],
  "w4-boss": [["boss", "NO LIGHT IN MY JAR! ONLY COOKIES! COOOOKIES!"], ["me", "There's a moon in there and you know it! Let the light OUT!"]],
  "w4-after": [["n", "CRASH! The jar breaks open, and moonlight pours across the Pantry!"], ["me", "Ooooh... there you are! Hi, moon! I missed you SO much!"], ["mold", "Hehehe. Enjoy it while it lasts, moth. Down in the Sink, there's no light at all."], ["me", "No light? Then I'll bring some! I've got plenty!"], ["n", "To be continued in World 5: The Sink."]],
};
export const NEMESIS: Record<"w1-elite" | "w2-elite" | "w3-elite" | "w4-elite", StoryLine[]> = {
  "w1-elite": [["foe", "Bzzzt! Hey there, little moth! Come to the light! MY light! Only my light!"], ["me", "Ooooh, you're so bright! But, um, you're not the moon."], ["foe", "I can BE your moon! Closer, closerrrr... BZZZZT!"], ["me", "Yikes! My fuzz! Okay, no thank you!"]],
  "w2-elite": [["foe", "Bzzt! Even in the cold, moths come to Zapsy! They ALWAYS come!"], ["me", "Not this moth! I know the difference now. The moon doesn't go ZAP!"]],
  "w3-elite": [["foe", "Bzzt! The oven glows, but I glow BRIGHTER! Look at me, moth! LOOK AT ME!"], ["me", "La la la, not looking! I'm daydreaming about moonlight!"]],
  "w4-elite": [["foe", "Why won't you love my light?! EVERYBODY loves my light! Bzzt!"], ["me", "Your light just wants to catch stuff. The moon only wants to shine!"], ["foe", "Bzz, bzz... I just wanted a buddy. *sniff*"]],
};
