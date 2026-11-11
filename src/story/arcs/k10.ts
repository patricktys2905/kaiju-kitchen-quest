// Bluebeary: main story arc and nemesis scenes (cartoon voice, see docs/VOICE.md).
import type { StoryLine } from '../stories';

export const TITLE = "The Lost Crumblets";
export const TAGLINE = "One grumpy papa bear, six missing muffins. Hmph!";
/** same keys as STORIES[10].beats except the w{N}-elite and w{N}-s{n} ones */
export const ARC: Record<string, StoryLine[]> = {
  "intro": [
    ["n", "Uh-oh! When the Head Chef vanished, the muffin tin tipped over and the little Crumblets scattered everywhere!"],
    ["me", "My six little Crumblets, out there with the moldy monsters!"],
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
    ["me", "C'mere, you two! That's two found, four to go."],
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
    ["me", "Well, ya kinda were. A little. ...Thanks."],
    ["n", "Four Crumblets found! The last two were spotted near the Oven!"],
  ],
  "w3-open": [
    ["me", "Muffins go in the Oven for twenty minutes, tops! NOT forever! Grrr."],
  ],
  "w3-boss": [
    ["boss", "BAKED GOODS! I SHALL HOARD THEM ALL! MY PRECIOUS MUFFINS!"],
    ["me", "Hoard THIS. GRRRAAAH!"],
  ],
  "w3-after": [
    ["boss", "Ow ow ow! Sorry! Dragons hoard stuff. Moldy dragons hoard SILLY stuff."],
    ["me", "That's five! Just one more to go."],
    ["boss", "The last one crawled into the Pantry, toward a great big cookie jar!"],
  ],
  "w4-open": [
    ["me", "One last Crumblet, then home, then a great big snoring nap."],
  ],
  "w4-boss": [
    ["boss", "NOM NOM NOM! ONE LITTLE MUFFIN LEFT TO EAT!"],
    ["me", "You spit that muffin OUT, cookie breath. GRRRR!"],
  ],
  "w4-after": [
    ["boss", "HURK! Ptoo! Sorry, little muffin!"],
    ["me", "Littlest! You're sticky, but you're safe! All six of you! Hey, stop hugging me. ...Okay, fine. Five more seconds."],
    ["mold", "Hehehe! What a sweet little family. The Mold Crown in the Sink would LOVE to meet them."],
    ["me", "Over my frosting, ya creep."],
    ["n", "To be continued in World 5: The Sink."],
  ],
  "w5-open": [
    ["me", "Six Crumblets, tucked in safe at home. I counted 'em twice. Okay, nine times."],
    ["me", "Now for the creep who wants to MEET 'em. Bath time, mold. Grrr."],
  ],
  "w5-boss": [
    ["boss", "Hehehe... the papa bear! Six little crumbs, all alone at home. Who's counting them NOW?"],
    ["me", "Me. Always. I count 'em in my sleep. And you just made my list of things to SQUASH."],
    ["boss", "Stay down here with me, bear! Muffins go stale. Mold is FOREVER!"],
    ["me", "Not on my watch, fuzzface. GRRRAAAH!"],
  ],
  "w5-after": [
    ["boss", "Squeeeak! Don't squash me! I'm only a little science project! Somebody grew me in the back of the fridge and forgot!"],
    ["me", "Who leaves a science project in the FRIDGE?!"],
    ["boss", "Can't say! Byeee! SLUUURP!"],
    ["n", "GLUG! Down the drain! A note floats up: \"Safe and sound. Go home to those little ones, bear. The Chef.\""],
    ["me", "One, two, three, four, five, six. All asleep in their cups. Hmph. Good."],
    ["foe", "Caw! Psst! That spare muffin cup still free, fuzzy?"],
    ["me", "Shh! You'll wake 'em. Get in, bird. That makes seven."],
    ["me", "Don't look at me like that. This is my grumpy face. It's just... smiling a little. Hmph."],
  ],
  "w6-open": [
    ["n", "Act 2: Beyond the Kitchen! A few days later, it's head count time..."],
    ["me", "One, two, three, four, five, bird. FIVE?! Where's the Littlest?!"],
    ["me", "A note. In crayon. \"Gone to see the wurld! Back for nap. Love, Littlest.\" The WORLD?!"],
    ["lo", "Hehe. Little crumbs go stale out here, bear. And stale crumbs belong to US."],
    ["me", "It can't even see over a spoon! Bird, watch the kids. Papa's going for a walk. GRRRAAAH!"],
  ],
  "w6-boss": [
    ["boss", "Halt, bear! I am SIR STALE, aged to perfection! Thy little muffin shall be my squire!"],
    ["me", "It's past its nap time, breadstick. So are you."],
    ["boss", "BREADSTICK?! I am a VINTAGE baguette! Have at thee!"],
    ["me", "Hmph. Have at THIS. GRRRAAAH!"],
  ],
  "w6-after": [
    ["n", "SNAP! The butter-knife lance breaks in half, and Sir Stale dives out the window!"],
    ["boss", "Unhand me, varlet! To the Backyard! Baron Brussels shall grill thee AND thy crumbs!"],
    ["me", "Grill my crumbs? Oh, now it's personal."],
    ["me", "Littlest wants to see the world? Fine. We see it together. Hold on to my ear, kiddo."],
    ["me", "Next stop, the Backyard! Littlest calls it \"the big outside\". Cute. Don't tell anybody I said cute."],
  ],
  "w7-open": [
    ["n", "The Backyard! Littlest squeaks at its very first sky, and Bluebeary's ears go all wiggly."],
    ["me", "So this is the big outside? The grass is up to my nose! Stay on my ear, kiddo, it's the safe seat."],
    ["me", "Smell that barbecue? Somebody wants to grill my crumbs? Well, somebody's getting grilled FIRST."],
  ],
  "w7-boss": [
    ["boss", "ATTEN-TION, bear! I am BARON BRUSSELS! That little muffin is hereby drafted into my Sprout Soldiers!"],
    ["me", "Drafted? It's three inches tall and it's past its nap time."],
    ["boss", "Then it shall nap on my GRILL! Pee-yew? Nonsense! That is the smell of VICTORY!"],
    ["me", "Smells like gym socks. Littlest, hold your nose. Papa's busy. GRRRAAAH!"],
  ],
  "w7-after": [
    ["n", "KA-BLAM! Baron Brussels tumbles off the grill and goes rolling across the lawn!"],
    ["boss", "Retreat! Always left on the PLATE! The Mystery Meatloaf will deal with you in the Garden, bear!"],
    ["boss", "Nobody knows what's in him! Not even HIM! Hmph!"],
    ["me", "Mystery meat? Littlest, that's a no-eat food."],
    ["me", "And now the Littlest wants to see the Garden. Fine! Buckle up on the ear. We nap after. Okay, we nap DURING."],
  ],
  "w8-open": [
    ["n", "The Garden! Fireflies blink on, and Littlest squeaks like it found a whole sky full of night-lights!"],
    ["me", "Fireflies, kid. Bugs with glowy tails. No touching. Okay, ONE touch."],
    ["me", "That Mystery Meatloaf's out here somewhere. And Littlest, he's STILL a no-eat food."],
  ],
  "w8-boss": [
    ["boss", "Hey! A muffin! Is there muffin in ME? Hold on, lemme check... huh, a BUTTON?"],
    ["me", "Littlest, that's what happens when ya don't wash your paws before cooking."],
    ["boss", "Am I beef? Am I lentils? WHO AM I?! Nobody ever came back for SECONDS!"],
    ["me", "Here's seconds. And thirds. GRRRAAAH!"],
  ],
  "w8-after": [
    ["n", "SPLORT! The Mystery Meatloaf wobbles off the heap, shedding peas and one very confused sock!"],
    ["boss", "Retreat! To the SUPERMARKET! The Tupperwraith haunts the back aisles, bear! Nobody's opened HIM in years!"],
    ["me", "A haunted leftovers tub? And now the Littlest wants to see a supermarket. Of course it does."],
    ["me", "Fine, buckle up on the ear. But we nap BEFORE the spooky aisle. Grrr."],
  ],
  "w9-open": [
    ["n", "The Supermarket! Littlest squeaks at aisles so tall they disappear into the dark!"],
    ["me", "Nap's done! I took it in a shopping trolley, and it was comfy, actually. Up on the ear, kid. Nobody wanders off in here."],
    ["lo2", "Hah! Thy crumbs are past their best-before, bear! The Tupperwraith shall SHELVE them!"],
    ["me", "Best-before THIS, breadstick. Grrr."],
  ],
  "w9-boss": [
    ["boss", "Woooo! A muffin! Into the tub with you! I'll keep you forever and ever! Wooooo!"],
    ["me", "Keep? Like the back of the fridge keeps stuff? You're a hoarder, ya soggy lunchbox."],
    ["boss", "Don't you DARE say \"just throw it out\"! Woooo! I don't know what I am, but I'm IMPORTANT!"],
    ["me", "Littlest, cover your ears. Papa's about to say it. GRRRAAAH!"],
  ],
  "w9-after": [
    ["n", "POP! The lid flies off, and out tumbles a whole hoard of stolen treasure!"],
    ["me", "Cabbage. Golden Butter. A thermostat knob. And Littlest's BLANKIE?! So THAT'S why nobody can nap!"],
    ["boss", "Woooo! It was so soft! Fine, keep it! I'm floating home to Old Fruitcake! The Feast is coming! Hmph!"],
    ["lo", "Bring the muffins to the House, bear. Every forgotten crumb gets a seat at my Feast."],
    ["me", "The Littlest's got a blankie and a papa. We nap first, then we crash your Feast, Fruitcake! GRRR."],
  ],
  "w10-open": [
    ["n", "The back of the Fridge! Frosty shelves, dusty jars, and one long, empty table waiting at the end!"],
    ["me", "Head count! Littlest on the ear, blankie on the Littlest, five at home with the bird. Good."],
    ["me", "Last stop on the world tour, kid. Then home for the biggest nap in history. Grrr."],
  ],
  "w10-boss": [
    ["boss", "The papa bear! I am OLD FRUITCAKE! Your crumbs go stale out here, and stale crumbs sit at MY table!"],
    ["me", "My crumbs sit at MY table. With bibs on. Hmph."],
    ["boss", "Nobody ever CUTS me, bear! Nobody ever counts ME! So nobody gets a feast!"],
    ["me", "Littlest, cover your ears. GRRRAAAH!"],
  ],
  "w10-after": [
    ["boss", "Oof. My crown. Just a dented old cake tin."],
    ["boss", "Every Christmas they wrap me up and pass me on. Nobody ever brings me home. I just wanted an invite, bear."],
    ["boss", "One seat at one feast. Was that so much? *sniff*"],
    ["me", "Look, the Littlest's giving you its blankie. Don't make it weird."],
    ["me", "There's a big table back home. Bring your whole gang! Breadstick sits by the bird."],
    ["foe", "Caw?! Not by the bird! Fine. He can have the shiny fork."],
    ["me", "One, two, three, four, five, Littlest, bird, ten strays, a bunch of Leftovers and one old Fruitcake. Hmph."],
    ["me", "Everybody's counted. Now NAP. ...Okay, fine. Cake first."],
  ],
};
export const NEMESIS: Record<"w1-elite" | "w2-elite" | "w3-elite" | "w4-elite" | "w5-elite" | "w6-elite" | "w7-elite" | "w8-elite" | "w9-elite" | "w10-elite", StoryLine[]> = {
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
  "w5-elite": [
    ["foe", "CAW! Steel wool feathers, fuzzy! Scratchy AND shiny! Last chance, hand over the crumbs!"],
    ["me", "Kids are home, bird. You're guarding a sink full of dirty forks."],
    ["foe", "They're SHINY forks! Caw... fine. Beat me and maybe I'll quit snatching stuff. MAYBE!"],
    ["me", "My offer's still open, bird. Gotta flatten ya first, though. GRRR."],
  ],
  "w6-elite": [
    ["foe", "Caw! Fuzzy! Roast Brute up the ridge. Smells like Sunday dinner, hits like a truck!"],
    ["me", "Bird. You're supposed to be home watching the kids."],
    ["foe", "Kids are napping! Somebody's gotta watch YOUR back. Caw! Don't make it weird."],
  ],
  "w7-elite": [
    ["foe", "Caw! Fuzzy! Burger Brute on the plateau. Three patties, extra cheese, ZERO manners!"],
    ["me", "Bird. Who's watching the kids?"],
    ["foe", "Chocomunch is on nap duty! He keeps saying \"Me watch.\" It's working! Caw! Now go!"],
  ],
  "w8-elite": [
    ["foe", "Caw! Fuzzy! Pumpkin Brute up at Gourd Guard. Big, orange, and it rolls like a bowling ball!"],
    ["me", "Bird. Who's on nap duty this time?"],
    ["foe", "Velvaroo! She counts 'em down like a boxing match. One, two, three, they're OUT cold! Caw!"],
  ],
  "w9-elite": [
    ["foe", "Caw! Fuzzy! Watermelon Brute on Melon Mountain. Big, stripy, and it spits seeds! I caught nine. Shiny ones!"],
    ["me", "Bird. Who's on nap duty?"],
    ["foe", "Bloblin! She jiggles 'em to sleep like a waterbed! Wibble wobble, they're OUT! Caw!"],
  ],
  "w10-elite": [
    ["foe", "Caw! Fuzzy! Fruitcake Knight up ahead. Crumbly, nutty, and the cherries are SHINY!"],
    ["me", "Bird. Who's on nap duty?"],
    ["foe", "Nobody! The kids wanted to see Papa's big finish! Front row, with snacks! Caw! Feast after, right?"],
  ],
};
