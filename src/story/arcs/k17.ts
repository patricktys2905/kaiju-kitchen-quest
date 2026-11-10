// Pengwhip: main story arc and nemesis scenes (cartoon voice, see docs/VOICE.md).
import type { StoryLine } from '../stories';

export const TITLE = "Long Way Home";
export const TAGLINE = "Wheee! One little penguin, zero brakes, and a looong way home!";
/** same keys as STORIES[17].beats except the w{N}-elite and w{N}-s{n} ones */
export const ARC: Record<string, StoryLine[]> = {
  "intro": [["n", "When the Head Chef vanished, the freezer door was left wide open, and a little penguin slid out, and out, and OUT!"], ["me", "Wheeeeee! Uh-oh. Where am I?"], ["me", "Home is the freezer. Up and across! I can slide there! Probably!"]],
  "w1-open": [["me", "Warm countertop! Eek, my cream's going soft! Slide faster!"]],
  "w1-boss": [["boss", "A PENGUIN? ON MY STOVE? YOU'LL MELT!"], ["me", "Not if I slide fast enough! Wheee!"]],
  "w1-after": [["boss", "Ooh, my crumbs. You're a long way from home, little one."], ["me", "I know! The Fridge is that way! I think! Maybe!"]],
  "w2-open": [["me", "The Fridge! Ooh, so cold and lovely! I'm almost home!"]],
  "w2-boss": [["boss", "NO ONE LEAVES THE FREEZER! NO ONE!"], ["me", "But I'm trying to get IN!"]],
  "w2-after": [["n", "Creeeak! The freezer door swings open. Home at last!"], ["me", "HOME! Hellooo? Wow, it's quiet in here."], ["me", "Hmm. All my new pals out there still need help. Home can wait a teeny bit!"]],
  "w3-open": [["me", "The Oven. The opposite of home! I've gotta be brave. Or very silly. Maybe both!"]],
  "w3-boss": [["boss", "ICE CREAM! MY FAVOURITE DESSERT! SLUUURP!"], ["me", "Excuse me! I'm cookies AND cream, thank you very much!"]],
  "w3-after": [["boss", "Oof, sorry. You came all this way to help others? You're no ordinary penguin!"], ["me", "Nope! I'm an adventurer now! Pantry, here I come!"]],
  "w4-open": [["me", "Dusty and dry. Aw, I miss the snow. But my friends are counting on me!"]],
  "w4-boss": [["boss", "COOKIES AND CREAM! THE PERFECT DUNK!"], ["me", "Nobody dunks THIS penguin!"]],
  "w4-after": [["n", "Hooray! The Pantry's saved, and the whole kitchen sends Pengwhip home in style!"], ["me", "Group hug! Careful, I'm chilly! You're all coming to visit, right? Bring mittens!"], ["mold", "Hehehe... then you'll want to save them from the Sink, little penguin."], ["me", "Water?! I'm a PENGUIN! That's MY turf! Cannonball!"], ["n", "To be continued in World 5: The Sink."]],
  "w5-open": [["me", "WATER! Real, splashy water! A penguin's natural habitat! Cannonbaaall!"], ["me", "Pfft! Ptoo! Okay, it's soapy water. Still counts! Wheee!"]],
  "w5-boss": [["boss", "Hehehe... little penguin, so far from your freezer. No brakes, no way home. Slide into my drain!"], ["me", "Hah! I've got brakes now! Mostly! And my pals always help me find the way home!"], ["boss", "Hehehe! Then I'll wash your pals away too!"], ["me", "Not on MY turf! Belly-slide attack! WHEEEEE!"]],
  "w5-after": [["boss", "Squeak! I give up! I was only a little science project! Somebody grew me in the back of the fridge and forgot!"], ["me", "The FRIDGE? That's right next door to my freezer! Who was it?!"], ["boss", "Not telling! Byeee! Blub blub bluuub!"], ["n", "SHLOOORP! Down the drain it goes! And up floats the Head Chef's hat with a note: \"All safe! Thanks, everybody!\""], ["me", "Hooray! Now let's clean this Sink! Bubbles, everybody! MORE BUBBLES!"], ["me", "Then everybody's coming to my freezer for a sleepover! Bring mittens!"], ["me", "Ooh, look, sunrise! A whole sink, squeaky clean and full of bubbles. You know what that means?"], ["me", "Longest slide EVER! Wheeeeeee! Uh-oh. Brakes? BRAKES?! Somebody catch meeee!"]],
  "w6-open": [["n", "Act 2: Beyond the Kitchen! Remember Pengwhip's longest slide ever? It STILL hasn't stopped!"], ["me", "Wheeee! Day three! Out the kitchen door and onto a giant tablecloth! Somebody catch meeee!"], ["n", "FWUMP! Pengwhip skids into a napkin, nose to nose with a tiny Crouton Squire!"], ["me", "Ice to meet you! Um, which way's my freezer?"], ["lo", "Your freezer, little bird? We were neighbours, y'know. It'll make a lovely frosty home for the Leftovers. Hehehe!"], ["me", "Leftovers in MY nest?! AGAIN?! Nope! Okay, home's that way. Through the bad guys. Wheee!"]],
  "w6-boss": [["boss", "Halt, penguin! I am SIR STALE, aged to perfection! None shall slide past me!"], ["me", "Aged? You smell like a breadbox left open all summer!"], ["boss", "I am VINTAGE! Have at thee!"], ["me", "Belly-slide attack! WHEEEEE!"]],
  "w6-after": [["n", "SNAP! Sir Stale's lance cracks in two, and off he stomps for the window!"], ["boss", "Unhand me, bird! Baron Brussels shall grill thee in the Backyard! And THEN, thy freezer!"], ["me", "My freezer?! Nope, nope, nope!"], ["me", "Okay! Long way home, part two! Backyard, here I come! Brakes? Still no brakes! Wheee!"]],
};
export const NEMESIS: Record<"w1-elite" | "w2-elite" | "w3-elite" | "w4-elite" | "w5-elite" | "w6-elite", StoryLine[]> = {
  "w1-elite": [["foe", "A penguin? Out HERE? You're in my waters now, birdie! Duh-dun, duh-dun!"], ["me", "What water? This is a countertop!"], ["foe", "Everywhere's water if ya believe hard enough! CHOMP!"]],
  "w2-elite": [["foe", "The freezer was MY kingdom while you were gone, birdie! All hail King Finn!"], ["me", "Kingdom?! That's my HOME! And it's cold for everybody!"]],
  "w3-elite": [["foe", "Brrr-oil! Hot! Hot! I'm melting! This is your fault somehow!"], ["me", "Then let's finish this quick and get you somewhere cold!"]],
  "w4-elite": [["foe", "Last slide, birdie! Winner gets the freezer!"], ["me", "How about we share it? There's room for a shark AND a penguin!"], ["foe", "Share? Nobody ever asked me to share before. Uh, I mean, this isn't over!"]],
  "w5-elite": [["foe", "Birdie! Look at me, I'm HUGE now! All this water, and I'm finally a REAL shark! Duh-dun, duh-dun!"], ["me", "Finn, you're a freezepop. You're melting in the dishwater!"], ["foe", "Eek, I'm going slushy! Fine! Maybe I'll stop being a meanie. MAYBE! Is that freezer share still open?"], ["me", "Still open! Last one to the freezer is a soggy fish stick! Wheee!"]],
  "w6-elite": [["foe", "Birdie! Big Roast Brute up ahead, and he's WAY too warm for a freezepop! Duh-dun, duh-dun!"], ["me", "Finn! Did you come all this way to warn me?"], ["foe", "Pfft! I just want my freezer share safe from those Leftovers! Now go! I'll be chilling in the ice bucket."]],
};
