// Bluebeary: main story arc and nemesis scenes (cartoon voice, see docs/VOICE.md).
import type { StoryLine } from '../stories';

export const TITLE = "The Lost Crumblets";
export const TAGLINE = "One grumpy papa bear, six missing muffins. Hmph!";
/** same keys as STORIES[10].beats except the w{N}-elite and w{N}-s{n} ones */
export const ARC: Record<string, StoryLine[]> = {
  "intro": [
    ["n", "Uh-oh! When the Head Chef vanished, the muffin tin tipped over and the little Crumblets scattered everywhere!"],
    ["me", "Hmph. Six little Crumblets, out there with moldy monsters."],
    ["me", "I'm NOT worried! I'm just going for a walk. A real long walk. In every direction. Grrr."],
  ],
  "w1-open": [
    ["me", "Crumblets! Come on out! ...No? Fine. Papa'll clear the way till you do."],
  ],
  "w1-boss": [
    ["boss", "A MUFFIN! BUTTER IT! TOAST IT! HAHAHA!"],
    ["me", "You've got two of my Crumblets stuck in your crown, toast."],
    ["me", "Big mistake. GRRRAAAH!"],
  ],
  "w1-after": [
    ["boss", "Oof! Sorry! I thought they were croutons. The mold makes everything so blurry!"],
    ["me", "Hmph. C'mere, you two. Two found, four to go."],
    ["boss", "I saw some little ones rolling off toward the cold!"],
  ],
  "w2-open": [
    ["me", "Brrr. Crumblets hate the cold. Their blueberries go all hard."],
    ["me", "Hang on, little ones. Papa's coming."],
  ],
  "w2-boss": [
    ["boss", "FROZEN TREATS! MINE! ALL MIIINE!"],
    ["me", "Treats? Those are my KIDS, ice-for-brains!"],
  ],
  "w2-after": [
    ["boss", "Drip, drip! They looked so cold, so I kept 'em in my ice. I thought I was HELPING!"],
    ["me", "Hmph. Well, ya kinda were. A little. ...Thanks."],
    ["n", "Four Crumblets found! The last two were spotted near the Oven!"],
  ],
  "w3-open": [
    ["me", "The Oven. Muffins go in here for twenty minutes, tops. NOT forever. Grrr."],
  ],
  "w3-boss": [
    ["boss", "BAKED GOODS! I SHALL HOARD THEM ALL! MY PRECIOUS MUFFINS!"],
    ["me", "Hoard THIS. GRRRAAAH!"],
  ],
  "w3-after": [
    ["boss", "Ow ow ow! Sorry! Dragons hoard stuff. Moldy dragons hoard SILLY stuff."],
    ["me", "Five. Hmph. One more."],
    ["boss", "The last one crawled into the Pantry, toward a great big cookie jar!"],
  ],
  "w4-open": [
    ["me", "Last Crumblet. Then home. Then a great big snoring nap. Hmph."],
  ],
  "w4-boss": [
    ["boss", "NOM NOM NOM! ONE LITTLE MUFFIN LEFT TO EAT!"],
    ["me", "You spit that muffin OUT, cookie breath. GRRRR!"],
  ],
  "w4-after": [
    ["boss", "HURK! Ptoo! Sorry, little muffin!"],
    ["me", "Littlest! Sticky, but safe. All six. Hmph. Stop hugging me. ...Okay, fine. Five more seconds."],
    ["mold", "Hehehe! What a sweet little family. The Mold Crown in the Sink would LOVE to meet them."],
    ["me", "Over my frosting, ya creep."],
    ["n", "To be continued in World 5: The Sink."],
  ],
};
export const NEMESIS: Record<"w1-elite" | "w2-elite" | "w3-elite" | "w4-elite", StoryLine[]> = {
  "w1-elite": [
    ["foe", "Caw! Shiny crumbs, crumbly crumbs! Finders keepers, caw-caw!"],
    ["me", "Those \"crumbs\" are my Crumblets, bird."],
    ["foe", "Then come and get 'em, fuzzy! Hehehe! CAW!"],
  ],
  "w2-elite": [
    ["foe", "Caw! Your little ones are frozen solid! Way easier to carry!"],
    ["me", "You put them down right now, bird. GRRRR."],
  ],
  "w3-elite": [
    ["foe", "The hot oven crisped my crust! I'm faster than ever! Zoom, caw!"],
    ["me", "Zoom all you want, bird. I'm still standing between you and them."],
  ],
  "w4-elite": [
    ["foe", "Last nest, fuzzy! Last chance to hand over your crumbs!"],
    ["me", "They're my FAMILY, featherbrain. Bet you wouldn't get it."],
    ["foe", "Caw... nobody ever came looking for me."],
    ["me", "Hmph."],
  ],
};
