// Hotchog: main story arc and nemesis scenes (cartoon voice, see docs/VOICE.md).
import type { StoryLine } from '../stories';

export const TITLE = "Grill Champion";
export const TAGLINE = "He's shy, he's spiky, and he's all fired up for the cookout!";
/** same keys as STORIES[15].beats except the w{N}-elite and w{N}-s{n} ones */
export const ARC: Record<string, StoryLine[]> = {
  "intro": [["n", "Every summer the kitchen threw a giant cookout! But with the Head Chef gone, there's no cookout at all!"], ["me", "B-b-but I practised ALL year! I was gonna be Grill Champion!"], ["me", "If I find the perfect grill up on Broiler Peak, m-maybe I can bring the cookout back!"]],
  "w1-open": [["me", "Okay. Deep breath. Spikes out! You c-can do this, Hotchog!"]],
  "w1-boss": [["boss", "A HOT DOG?! ON MY STOVE?! I'LL GRILL YOU!"], ["me", "Hey! I-I'M the one who does the grilling around here!"]],
  "w1-after": [["boss", "Huh? Oh, my crusts. Hey, not bad, little sausage! You'd make a fine champion."], ["me", "R-really?! Wow! Th-thanks!"]],
  "w2-open": [["me", "The Fridge. Where hot dogs sit and wait. Well, I'm d-done waiting!"]],
  "w2-boss": [["boss", "NO COOKOUTS! ONLY COLD! COLD FOREVERRRR!"], ["me", "Everybody deserves a cookout! Even you!"]],
  "w2-after": [["boss", "Brrr, what happened? Um, could I come to your cookout? If that's okay?"], ["me", "Y-yes! Bring ice! For the drinks!"]],
  "w3-open": [["me", "Broiler Peak's right up there. The perfect grill! I can feel it in my spikes!"]],
  "w3-boss": [["boss", "BROILER PEAK IS MY LAIR! ROAAAR!"], ["me", "Th-then let's see who grills better! Fire it up!"]],
  "w3-after": [["n", "Ta-da! At the top of Broiler Peak, the perfect grill glows!"], ["boss", "Oops, sorry about all the roaring. Go on, take it. You earned it, Champion!"], ["me", "Champion? Hehe. I like the sound of that!"]],
  "w4-open": [["me", "Now I need the Chef's secret sauce recipe! It's somewhere in the Pantry!"]],
  "w4-boss": [["boss", "NO SAUCE! NO RECIPE! ALL MINE! CHOMP!"], ["me", "Hey! A cookout is for EVERYBODY!"]],
  "w4-after": [["n", "The recipe is found! The whole kitchen comes to the cookout, and Hotchog is crowned Grill Champion!"], ["me", "And the winner is... ME?! Woo-hoo! Burgers for everybody!"], ["mold", "A party? How sweet. Hehehe. The Sink will wash it all away."], ["me", "Not if the Champion has anything to say about it!"], ["n", "To be continued in World 5: The Sink."]],
  "w5-open": [["me", "The Sink! After a cookout, this is where all the dirty plates end up. And I made a LOT of plates."], ["me", "Okay, Champion. Sash on, spikes out! Time to clean up this kitchen!"]],
  "w5-boss": [["boss", "Hehehe... a champion? You? The shy little sausage who can't say hello? Who'd come to YOUR party?"], ["me", "EVERYBODY! And guess what? I'm not shy anymore!"], ["boss", "Hehehe! Then let me RAIN on your cookout!"], ["me", "Ladies and gentlemen, the Champion steps up to the grill! FIRE IT UP!"]],
  "w5-after": [["boss", "Squeak! Okay, okay! I was just a little science project! Somebody grew me in a jar way in the back of the fridge!"], ["me", "A jar? Whose jar?"], ["boss", "Go ask the leftovers! Byeee! Blub blub bluuub!"], ["n", "SHLOOORP! Down the drain! And up floats the Head Chef's white hat with a note: \"I'm safe! Start the grill!\""], ["me", "You heard the Chef, folks! The cookout is BACK!"], ["me", "Captain Kebab brought skewers! The Freezer Golem brought ice, just like he promised!"], ["me", "Burgers on the left, hot dogs on the right, and the crowd goes WILD!"], ["me", "And to think, I used to be t-too shy to say hi. HI, EVERYBODY! Who's HUNGRY?!"]],
  "w6-open": [["n", "Act 2: Beyond the Kitchen! The morning after the cookout, Hotchog is planning an even BIGGER one."], ["me", "Good morning, folks! Today's guest list? The whole house! Pass the buns!"], ["n", "Uh-oh! Every bun in the bread bin has gone hard as a rock!"], ["me", "STALE?! A hot dog with no bun is just a dog! Who did this?!"], ["lo", "Hehehe. Stale, forgotten and shoved to the back. Now you know how it feels, Champion."], ["me", "A crumb trail out the door! Champion, you are cleared for takeoff! To the Dining Room!"]],
  "w6-boss": [["boss", "Have at thee, sausage! I am SIR STALE, aged to perfection!"], ["me", "And in this corner, folks, the stalest loaf in the whole house!"], ["boss", "STALE?! I am VINTAGE, varlet! Forsooth!"], ["me", "Vintage or not, the Champion is toasting you! Ding ding!"]],
  "w6-after": [["n", "SNAP! The butter-knife lance breaks in two, and Sir Stale backs toward the window!"], ["boss", "This isn't over, varlet! Baron Brussels is taking the Backyard BBQ! He shall grill THEE!"], ["me", "The BACKYARD BBQ?! Folks, that's the biggest grill in the whole house!"], ["me", "Nobody steals a grill from the Champion! Spikes out, tongs up! To the Backyard!"]],
};
export const NEMESIS: Record<"w1-elite" | "w2-elite" | "w3-elite" | "w4-elite" | "w5-elite" | "w6-elite", StoryLine[]> = {
  "w1-elite": [["foe", "Captain Kebab, FIVE-time Grill Champion! And you are... a sausage with spikes? Hah!"], ["me", "I-I-I'm Hotchog! And I'm entering the cookout!"], ["foe", "Then let's see if ya can take the heat, kid!"]],
  "w2-elite": [["foe", "No grill in the fridge, little doggie! You're outta your element!"], ["me", "A champion grills anywhere! Even in here!"]],
  "w3-elite": [["foe", "Broiler Peak is MY grill! You're just a snack on a skewer, kid!"], ["me", "I practised all year! I'm n-not scared of you!"]],
  "w4-elite": [["foe", "Five titles! FIVE! And the Mold promised me a SIXTH! Hah!"], ["me", "A trophy's no fun without a cookout to share it with, Captain!"], ["foe", "Hrmph. You really believe that, kid? Huh. Show me, then!"]],
  "w5-elite": [["foe", "Kid! The Mold promised me a sixth trophy, and all I got was soggy skewers! Grill-off! Right here, right now!"], ["me", "A grill-off in a SINK, Captain? Hah! You're on!"], ["foe", "Hrmph! You grill like a real champ, kid. Fine! Maybe I'll quit working for that fungus. MAYBE!"], ["me", "Then bring your skewers to the cookout! Everybody's invited. Even grumpy captains!"]],
  "w6-elite": [["foe", "Kid! Roast Brute ahead. Biggest roast I ever saw, and I've grilled a LOT of roasts!"], ["me", "Then let's show him how champions do it, Captain! Tag team?"], ["foe", "Hrmph! Fine! But if we win, I'm calling it my sixth trophy. MAYBE!"]],
};
