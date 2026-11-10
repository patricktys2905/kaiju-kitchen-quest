// Chocomunch: main story arc and nemesis scenes (cartoon voice, see docs/VOICE.md).
import type { StoryLine } from '../stories';

export const TITLE = "Don't Melt";
export const TAGLINE = "He's big! He's tough! He's... made of chocolate. Uh-oh!";
/** same keys as STORIES[8].beats except the w{N}-elite and w{N}-s{n} ones */
export const ARC: Record<string, StoryLine[]> = {
  "intro": [["me", "Me Chocomunch! Me strong! Me punch real good! POW!"], ["me", "Me only scared of ONE thing. *gulp* Melting."], ["n", "Uh-oh! The Head Chef left Chocomunch a note: \"Meet me at the Oven.\""], ["me", "OVEN?! Me never go near oven! ...Okay. Me go. Chef is friend."]],
  "w1-open": [["me", "Countertop sunny. Me feel a little soft. Me okay! Me TOTALLY okay!"]],
  "w1-boss": [["boss", "MY BURNERS WILL MELT YOU, CHOCOLATE!"], ["me", "Eep! Me no like this boss. Me PUNCH this boss!"]],
  "w1-after": [["boss", "Wha? Where am I? You fought right next to a burner, little guy? Brave chocolate!"], ["me", "Me VERY scared! Me do it anyway! Hehe!"]],
  "w2-open": [["me", "FRIDGE! Me LOVE fridge! Me nice and crunchy here! Yay!"]],
  "w2-boss": [["boss", "STAY HERE! STAY COLD! STAY FOREVERRRR!"], ["me", "Ooh, tempting. But Chef need Chocomunch! Sorry, big guy!"]],
  "w2-after": [["boss", "Ugh, my head. Here, take some ice with you. For the Oven."], ["me", "Ooh, ice! Me still scared. But me go!"]],
  "w3-open": [["me", "Oven. Hot hot HOT. Me count to ten. One, two, uh, TEN! Okay, me go!"]],
  "w3-boss": [["boss", "FONDUE! I'LL MAKE FONDUE OUT OF YOU!"], ["me", "NO FONDUE! NEVER FONDUE!"]],
  "w3-after": [["n", "Chocomunch is a little drippy round the edges, but still standing!"], ["me", "Me did it! Me in Oven! Me not scared no more! Well, teeny bit scared."], ["boss", "Oof, sorry about the fire breath. The Chef was here, but went up to the Pantry. Hurry!"]],
  "w4-open": [["me", "Ahh, Pantry cool! Me firm again! Me READY!"]],
  "w4-boss": [["boss", "CHOCOLATE COOKIE! THE BEST KIND! CHOMP CHOMP!"], ["me", "Me no cookie! Me FIST! POW!"]],
  "w4-after": [["n", "Look! A note from the Chef: \"Chocomunch, I knew you could do it! Now come to the Sink.\""], ["me", "Sink? Water? Hah! Me okay with water. Water not hot!"], ["mold", "Hehehe... HOT water, little golem. Very hot water."], ["me", "*gulp* Me scared. Me go anyway!"], ["n", "To be continued in World 5: The Sink."]],
  "w5-open": [["me", "Sink! Big water! Me dip one toe. Ooh, warm-ish. Me no melt! Me okay!"], ["me", "Chef down there somewhere. Me coming, Chef!"]],
  "w5-boss": [["boss", "Hehehe... little golem. My drain is full of HOT water. You'll melt like a candy bar in a sunny car!"], ["me", "Me scared of melting! Me scared whole trip!"], ["boss", "Then RUN home, little snack! Hehehe!"], ["me", "Nope! Me scared AND me here! Me SMASH crown! POW!"]],
  "w5-after": [["boss", "Squeak! Ow! I was only a little science project! Somebody grew me in the back of the fridge!"], ["me", "Who grow you? Me want to know!"], ["boss", "Can't say! They forgot me behind the pickles! Blub blub bluuub!"], ["n", "SHLOOORP! Down the drain goes the Mold Crown! And look, a note from the Head Chef floats up!"], ["me", "Me read it! \"Chocomunch, I'm safe! Come warm up by the Oven. No fondue, promise!\""], ["me", "Oven? OVEN?! ...Okay. Me go. Chef is friend."], ["me", "Ahhh. Oven glow so cozy. Me no melting! Me just toasty!"], ["me", "Me hold up Chef note for everybody! Me so proud! Me gonna frame it! In CHOCOLATE!"]],
  "w6-open": [["n", "Act 2: Beyond the Kitchen! Chocomunch is hanging up his Chef note, framed in chocolate."], ["me", "Me so proud! Me look at note every day. Me lick frame only a little."], ["n", "Uh-oh! A tiny Crouton Squire snatches the frame and scurries out the door!"], ["lo", "Bring me everything they love, my Squires. Let THEM feel forgotten for a change. Hehehe!"], ["me", "HEY! That Chef note! Me follow crumbs! Me get note back! Me SMASH!"]],
  "w6-boss": [["boss", "Halt, chocolate varlet! Thy fancy frame is MINE! I am SIR STALE, aged to perfection!"], ["me", "Aged? You smell like old sandwich. Me know stale when me sniff it."], ["boss", "STALE?! I am VINTAGE! Have at thee!"], ["me", "Me have at YOU! POW!"]],
  "w6-after": [["n", "CRACK! Sir Stale's lance snaps, and the chocolate frame tumbles out from behind his shield!"], ["boss", "Unhand me, varlet! Thou shalt pay! Baron Brussels shall roast thee on the Backyard grill!"], ["me", "Grill?! Hot?! *gulp*"], ["me", "Me got Chef note back! Me hold it tight. Me scared AND me go! Backyard, here me come!"]],
  "w7-open": [["n", "Meanwhile, in the Backyard! Grass like a jungle, and a giant grill puffing smoke like a volcano!"], ["me", "That the grill?! Big. Hot. VERY hot. *gulp*"], ["me", "Me hold Chef note tight. Leftovers no take more stuff from friends! Me scared AND me go!"]],
  "w7-boss": [["boss", "ATTEN-TION! BARON BRUSSELS reporting! I shall grill this golem into FUDGE!"], ["me", "Pee-yew! You stinky! Me hold nose AND punch. Me multitask!"], ["boss", "Nobody EVER finishes their sprouts! ALWAYS LEFT ON THE PLATE!"], ["me", "Me no eat you. Me PUNCH you! POW!"]],
  "w7-after": [["n", "BONK! Baron Brussels rolls off the grill like a runaway meatball, all the way toward the Garden!"], ["boss", "RETREAT! The Mystery Meatloaf will sort you out! Nobody knows what's in him! Not even HIM!"], ["me", "Me stood right next to big grill! Me no melt! Me just teeny bit shiny!"], ["me", "Mystery Meatloaf? Me no like mystery. Me like punch. Garden, here me come!"]],
  "w8-open": [["n", "Meanwhile, in the Garden! The sun is setting over giant pumpkins and sunflowers!"], ["me", "Sun going down. Me like sunset. Sunset mean cool coming! Phew!"], ["me", "Me hold Chef note tight. Me find Mystery Meatloaf. Me punch mystery right out of him!"]],
  "w8-boss": [["boss", "Who goes there? I am THE MYSTERY MEATLOAF! I'm made of... huh. A BUTTON? Since when?!"], ["me", "You no know what inside you? Me know what inside me. Chocolate! All the way!"], ["boss", "Lucky! Am I beef? Am I lentils? WHO AM I?!"], ["me", "You about to be SQUISHED meatloaf! POW!"]],
  "w8-after": [["n", "SPLAT! The Mystery Meatloaf wobbles off through the cabbages, toward the Supermarket!"], ["boss", "Nobody ever wanted seconds of ME! Wait till you meet the Tupperwraith! Nobody's opened HIM in years!"], ["me", "Tupper-wraith? Ghost box? *gulp* Me scared of ghost."], ["me", "But Supermarket got FREEZER aisle! Me LOVE freezer aisle!"], ["me", "Me scared AND me go! Me hold Chef note. Supermarket, here me come!"]],
};
export const NEMESIS: Record<"w1-elite" | "w2-elite" | "w3-elite" | "w4-elite" | "w5-elite" | "w6-elite" | "w7-elite" | "w8-elite", StoryLine[]> = {
  "w1-elite": [["foe", "A CHOCOLATE golem? Ooh, this'll be fun! Say hello to my little blowtorch! FWOOSH!"], ["me", "Yikes! Me no like torch!"], ["foe", "Nobody likes the torch, sweetie. That's what makes it FUN! Mwahaha!"]],
  "w2-elite": [["foe", "Cold fridge, hot torch! You can't hide in here forever, golem!"], ["me", "Me no hiding! Me waiting. And now me PUNCHING!"]],
  "w3-elite": [["foe", "The OVEN! Home sweet home! And look, you're already soft, golem! Hehehe!"], ["me", "Me soft. Me still punch! POW!"]],
  "w4-elite": [["foe", "Why aren't you melting?! Everything melts! Even crème brûlée melts!"], ["me", "Me scared of melting. Me MORE scared of friends getting hurt!"], ["foe", "Ugh! That's so annoyingly brave! This isn't over, golem!"]],
  "w5-elite": [["foe", "Look at me now, golem! Biggest torch in the whole kitchen! FWOOSH! Why won't you MELT already?!"], ["me", "Me no melt in Oven. Me no melt in Pantry. Me no melt for YOU! POW!"], ["foe", "Ugh! Fine! Maybe I'll stop torching things. MAYBE! Can I at least still torch crème brûlée?"], ["me", "Hmm. Okay. Me like crème brûlée. Me save you a spoon!"]],
  "w6-elite": [["foe", "Psst, golem! Big Roast Brute up ahead. Trust me, I know roasting, and that guy is OVERDONE!"], ["me", "You help me? Me no believe it!"], ["foe", "Hey, you promised me a spoon! I keep my deals. Now go get him! Mwahaha! Ahem. Good luck!"]],
  "w7-elite": [["foe", "Psst, golem! Burger Brute up ahead. Flame-grilled, double stacked. Honestly? I'm jealous."], ["me", "You warn me AGAIN? You nice now?"], ["foe", "Ugh, don't tell anybody! Go flatten him like a patty! Mwahaha! Ahem."]],
  "w8-elite": [["foe", "Psst, golem! Pumpkin Brute up ahead. Know what I'd do? Torch him into pumpkin pie! Mwahaha!"], ["me", "You warn me THREE times now. You my friend?"], ["foe", "Ugh! Friend is a strong word! SPOON buddy. Now go smash that gourd! Ahem."]],
};
