// Crabbage: main story arc and nemesis scenes (cartoon voice, see docs/VOICE.md).
import type { StoryLine } from '../stories';

export const TITLE = "Get Off My Patch";
export const TAGLINE = "A cranky cheese crab who wants everybody OFF his patch!";
/** same keys as STORIES[2].beats except the w{N}-elite and w{N}-s{n} ones */
export const ARC: Record<string, StoryLine[]> = {
  "intro": [["n", "Crabbage lived all alone in a perfect little cabbage patch by the sink drain. Then the green fuzz showed up!"], ["me", "MOULD? In MY patch? On MY cabbages?!"], ["me", "Hmph! Whoever did this is gonna get pinched. Very, VERY hard! SNIP SNAP!"]],
  "w1-open": [["me", "Sideways! Always sideways! It's faster, and don't let anybody tell ya different!"]],
  "w1-boss": [["boss", "BOW TO THE KING! BOW, I SAY!"], ["me", "Crabs don't bow, Your Crustiness! We PINCH!"]],
  "w1-after": [["boss", "Ow! OW! Okay, okay! The mould came from somewhere cold!"], ["me", "Hmph. Fine. Don't follow me."]],
  "w2-open": [["me", "The Fridge. Brrr! Packed with veggies, and not ONE of 'em is mine!"]],
  "w2-boss": [["boss", "STAY FOREVER! STAAAAY!"], ["me", "No can do, ice-for-brains! I got a patch to get back to!"]],
  "w2-after": [["boss", "Whoa... you fought all that way for a garden? Aww, that's sweet."], ["me", "It is NOT sweet! It's CABBAGE! Now where's that mould going?"], ["boss", "Up! Through the Oven!"]],
  "w3-open": [["me", "Too hot! My cheese is sweating! Ugh, I hate this. Onward!"]],
  "w3-boss": [["boss", "A CHEESY CRAB! DELICIOUS! OM NOM NOM!"], ["me", "Everybody wants to eat me! Nobody wants to help with the weeding!"]],
  "w3-after": [["boss", "Uh... I'll help with the weeding. If you want."], ["me", "Hmph! Maybe. Pantry next?"], ["boss", "Pantry next!"]],
  "w4-open": [["me", "Nearly done. Then back to my patch, all by myself. Probably. Hmph!"]],
  "w4-boss": [["boss", "COOKIES! NOT CABBAGES! COOOOKIES!"], ["me", "Cabbages are BETTER! Ya hear me? BETTER!"]],
  "w4-after": [["n", "Whoa! Here come the Toast King, the Golem, even the Dragon, all carrying seeds for a new patch!"], ["me", "What's all this? You wanna HELP? ...Fine. Don't step on the sprouts!"], ["mold", "Hehehe. The drain is mine now, crab. The Sink belongs to the Mold Crown."], ["me", "That drain's right next to MY patch! Okay, NOW it's personal!"], ["n", "To be continued in World 5: The Sink."]],
  "w5-open": [["me", "The Sink. My patch is right down by that drain. Or it WAS, before the green fuzz moved in!"], ["me", "Seed count: twelve, and every one of 'em wants to go home. Me too! SNIP SNAP!"]],
  "w5-boss": [["boss", "Hehehe... cranky little crab. All alone in your patch with nobody to share it. That's how you like it!"], ["me", "Hmph! Used to be. Now I got twelve seeds and a buncha pests who keep offering to help!"], ["boss", "Then I'll fuzz your patch AND your pests! Hehehe!"], ["me", "Nobody fuzzes my friends! Er, my PESTS! Now get off my lawn!"]],
  "w5-after": [["boss", "Squeak! I'm all teeny! I was only a little science project! Somebody grew me in the back of the fridge and forgot!"], ["me", "Mould grown in the back of a fridge? Worst gardening I ever heard of! No sun, no dirt, no manners!"], ["boss", "Squeeeak! Bye-bye, crab! *SLUUURP*"], ["n", "Hooray! A soggy note bobs up the drain: \"Safe and sound! Mind the garden. -Chef\""], ["me", "Mind the garden? Hmph! Like I'd ever do anything else!"], [17, "Wheee! Crabbage, we watered your cabbages! And the carrots! And a little bit of me!"], ["foe", "Slurrrp! Look, crab! I grew a radish! And I didn't eat it! Well, one nibble."], ["me", "Hmph! Kids these days, watering everything in sight. ...Okay, it looks GREAT. Now get off my lawn! And come back tomorrow!"]],
};
export const NEMESIS: Record<"w1-elite" | "w2-elite" | "w3-elite" | "w4-elite" | "w5-elite", StoryLine[]> = {
  "w1-elite": [["foe", "Slurrrp! Ah, the cabbage crab! Your patch was DEE-licious!"], ["me", "YOU! You're the one who ate my sprouts!"], ["foe", "Yup! And your shell's next! Slurrrrp!"]],
  "w2-elite": [["foe", "The fridge drawer's got lettuce! LETTUCE! But I'd rather have YOU, crab!"], ["me", "Stay outta my garden! And stay outta my LIFE, ya slimeball!"]],
  "w3-elite": [["foe", "Phew, hot in here! My slime's all bubbly. Watch your step, crab!"], ["me", "I walk sideways, genius! Your slime trail goes forwards. Think about it!"]],
  "w4-elite": [["foe", "Every garden and every leaf, ALL MINE! The Mold promised me!"], ["me", "Eating a garden doesn't make it yours, ya goof! Growing it does!"], ["foe", "Huh. I never grew anything. ...Not even a radish."]],
  "w5-elite": [["foe", "SLURRRP! Look at me now, crab! I ate a whole dish rack! I'm a MEGA-slug!"], ["me", "Eating stuff doesn't make ya grow, ya goof! Well, okay, it does. But not the GOOD way!"], ["foe", "Ugh! Fine! If you win, maybe I'll try your radish thing. MAYBE!"]],
};
