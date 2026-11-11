// Crabbage: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Hmph! Crumbs everywhere! Kids these days. Would it kill 'em to sweep?"], ["me", "Not that I care. Okay, I care a little. Crumbs bring ants, and ants bring trouble!"]],
  "w1-s3": [["me", "Ugh, this gummy goo keeps grabbing my legs! Eight legs, eight problems!"], ["me", "See that ladle lever? Pull it and a rolling pin flattens the lot. Now THAT'S weeding!"]],
  "w1-s4": [["n", "A tiny Crumblet waddles up and grabs Crabbage's leg."], ["me", "Nope! Shoo! Go home! You don't have a home? Aw, nuts. FINE. Get behind my shell."], ["me", "There's hundreds of monsters out there! Don't touch the rattly pots, and don't follow me. Okay, follow me."]],
  "w1-s6": [["me", "A Recipe Scroll on the Spice Shelf? Bet it's for coleslaw. Over my dead leaves!"], ["me", "Fine, I'll fetch it in seventy-five seconds. Sideways is faster than ya think!"]],
  "w1-s7": [["me", "This pass is crawling with pests! Even the ants have ants! Claws out!"], ["me", "And there's a key in a chest on a ledge up there. Finders keepers! Crabs keepers!"]],
  "w1-s8": [["me", "A board for chopping veggies. And guess what I am? A VEGGIE. Great."], ["me", "They're comin' at me for forty-five seconds? Hmph! Shell up, pincers out! SNIP SNAP!"]],
  "w1-s9": [["me", "Found a seed back there and pocketed it. For, uh, gardening reasons."], ["n", "Seed count: one!"], ["me", "Hey! Quit counting my seeds, narrator!"]],
  // World 2: The Fridge
  "w2-s2": [["me", "Milk cartons charging at everything! No manners! Kids these days!"], [17, "Wheee! Hey, crab! Why are you walking sideways?"], ["me", "I'm a crab! You're a penguin in a fridge! Nobody gets to judge here, kid!"]],
  "w2-s3": [["me", "Something big's waiting on this shelf. My claws are itchy. Extra elite, extra annoying!"], ["me", "Good thing there's a lever. One rolling pin, special delivery! No tip!"]],
  "w2-s4": [["me", "Aw, nuts. There's a Crumblet stuck in a pickle-jar ring by the pier. Pickles AGAIN?"], ["me", "C'mon, small fry. You walk, I pinch, and nobody gets brined. Deal?"]],
  "w2-s6": [["me", "Eggs! Never grew one. Never wanted to. They just SIT there!"], ["me", "The scroll's at the far end. I'll be back with it before these eggs hatch an opinion!"]],
  "w2-s7": [["me", "A bridge made of BUTTER? Whoa-whoa-WHOA! Every step sideways turns into three!"], ["me", "I'll bounce off that sponge and grab the key. Easy-peasy. I like easy."]],
  "w2-s8": [["n", "Uh-oh! The fridge light clicks off, and Ketchup Canyon goes dark!"], ["me", "Good! Nobody sees a crab in the dark. Except slugs. Slugs see EVERYTHING."], ["foe", "Slurrrrp! I see you, cabbage crab! Hehehe!"]],
  "w2-s9": [["me", "Seed count: four! Lettuce, pea, carrot, and a weird one from the crisper. No idea."], ["mold", "Hehehe... plant your little seeds, crab. My spores will be waiting when they sprout."], ["me", "Then I'll weed ya out! That's what gardeners do. Now get off my lawn!"]],
  // World 3: The Oven
  "w3-s2": [["me", "The BOTTOM rack? Not even the top one? Hmph! Even the oven thinks I'm small!"], ["me", "It's way too hot for seeds in here. They're staying deep in my shell. Don't ask!"]],
  "w3-s3": [["me", "A muffin maze? Back in my day we had hedges! Proper hedges! I grew one. It was PERFECT."], ["me", "And one of those cereal boxes has teeth. Pinch first, ask questions never!"]],
  "w3-s4": [[11, "Beep beep! Special delivery for Crabbage! One Crumblet, handle with care! Sign here!"], ["me", "I didn't order a... oh, FINE. Behind me, small fry. If the cookers rattle, that's the monsters' problem!"]],
  "w3-s6": [["me", "Flat, hot, and something extra-large is lurking right by the Scroll."], ["me", "An elite guarding a recipe? Must be a good one. It had BETTER not be coleslaw!"]],
  "w3-s7": [["me", "Everything gets roasted in here! Spuds, sprouts, my patience..."], ["me", "There's a key chest above the pass. I'm gettin' pretty good at sponge bounces. Don't tell anybody!"]],
  "w3-s8": [["me", "Hold out for forty-five seconds on a pizza stone? My shell's basically a baking dish now!"], [7, "Hrrm. Small crab, a garden is patience with dirt on it. So is a siege. So is rice."], ["me", "That was annoyingly wise, seaweed. Right up until the rice."]],
  "w3-s9": [["me", "Seed count: seven! Plus a tomato cutting. It's nothing! I'm not building anything!"], ["me", "Quit lookin' at me like that. It's a small, leafy, totally-not-a-garden thing."]],
  // World 4: The Pantry
  "w4-s2": [["me", "Look at these grains, stuck in boxes, never touching dirt. Poor things!"], ["me", "I'd set 'em free, but they're shaped like little O's and they BITE. Kids these days!"]],
  "w4-s3": [["me", "This flour's like snow, if snow got in everything and then haunted ya!"], ["me", "I'll drop the rolling pin, flatten the ghosts, then sweep up. SOMEBODY has to sweep!"]],
  "w4-s4": [["me", "Another Crumblet? Up on a soup can, waving at me? How many of you ARE there?"], ["me", "Don't answer! Hop down, kid. And stay clear of the cookers!"]],
  "w4-s6": [["me", "Basil and thyme stuck in JARS! They belong in dirt! In the sun! With me!"], ["me", "I'm grabbing that scroll first. Then I'm busting out the parsley!"]],
  "w4-s7": [["me", "Noodles burrowing under my feet! They're like worms, but useless for the soil."], ["me", "The last key's up on those ledges. Might open a secret honey cellar! Bees help gardens grow. Grumpily. Like me."]],
  "w4-s8": [["me", "Forty-five seconds against everybody? Sticky, but honest work."], ["foe", "Psst! Crab! Say I wanted to grow something. Where would I even start?"], ["me", "Step one: don't EAT it! Now hold the line, slug!"]],
  "w4-s9": [["me", "Seed count: twelve! Enough for a patch. A big patch. A patch for, uh, more than one crab."], ["mold", "Hehehe... the jar's just a door, crab. What's behind it goes all the way down the drain."], ["me", "Then I'll dig all the way down! Gardeners don't mind dirty claws. Hmph!"]],
  // World 5: The Sink.
  "w5-s2": [["me", "Slide? Crabs don't slide, we SCUTTLE! Hey, why's there a giant rolling pin behind me?!"], ["me", "Run right! Sideways right! Same thing! HURRY UP, legs!"]],
  "w5-s3": [["me", "These sponges are soaking up the water my sprouts should be drinking! Thieves, the lot of 'em!"], ["me", "Gates are locked and three waves are comin'. Good thing that rolling pin up there does my weeding!"]],
  "w5-s4": [[10, "Hmph. Crab. My Crumblet needs walking over Dish Rack Ridge. You're grumpy enough to keep it safe."], ["me", "Takes one to know one, muffin! C'mon, small fry, stick to my shell and don't lick the plates!"]],
  "w5-s6": [["me", "Bubbles popping on my shell! Pop, pop, POP! Kids these days!"], ["me", "The last Scroll's way down the conveyor belts. If it's coleslaw, it goes down the drain!"]],
  "w5-s7": [["me", "My patch is right around here. I can smell the dirt! Ahh, lovely dirt!"], ["me", "Key chest on a high ledge again. Sponge bouncing's my second-best skill now. After pinching."]],
  "w5-s8": [["foe", "Slurrrp! Crab! I'm on your side now! Mostly! Forty-five seconds, I'll slime the left!"], ["me", "Hmph! Fine! Just don't slime the seeds, ya goof!"]],
  "w5-s9": [["mold", "Hehehe... down here, crab. Your little patch is all fuzz now. Come and see!"], ["me", "That's MY patch you're squatting on! Seed count: twelve. Pinch count: about to be a LOT!"]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "A whole table, flat and bare, and not one weed on it. Somebody shoulda planted something!"], ["n", "Uh-oh! A rolling pin comes rumbling off the edge of a placemat!"], ["me", "Oh, it's YOU again! I'm not running from ya! I'm scuttling with PURPOSE!"]],
  "w6-s3": [["me", "Hot wax dripping everywhere! That stuff ruins good soil!"], ["me", "Gates locked again? Hmph! I could weed this lot in my sleep. SNIP SNAP!"]],
  "w6-s4": [[10, "Hmph. Crab. My Crumblet wants to see the world. Walk it across Gravy Boat Bay."], ["me", "Kid, the world's mostly gravy and monsters. Stick to my shell and don't drink the bay!"]],
  "w6-s6": [["me", "Tea's just leaf soup, y'know. Gardeners respect leaf soup."], ["lo2", "Pinch not my teacups, crab! Yon Recipe Scroll belongs to the Feast!"], ["me", "Then the Feast can come and GET it! Grab it and hold on, legs!"]],
  "w6-s7": [["me", "Ooh, that napkin's folded like a cabbage! Nope. It's a swan. Hmph."], ["me", "There's a key chest up high, so it's bouncing time. I'm a pro now. Still, don't tell anybody!"]],
  "w6-s8": [["me", "Forty-five seconds of forks? I've been forked before! Pinch back!"], ["n", "Seed count: twelve! Cabbage count: zero!"], ["me", "Not for long! And quit counting, narrator!"]],
  "w6-s9": [["lo2", "Hark, crab! The chandelier is the finest seat at the table! Come up, if thou canst climb!"], ["me", "I walk SIDEWAYS, buster. Up is just sideways tipped over!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "A whole garden hose, just lyin' around, not watering ANYTHING! Shameful!"], ["n", "BOING! A rolling pin comes bouncing down the hose like a runaway log!"], ["me", "Who keeps leaving that thing lying around?! Scuttle, legs, SCUTTLE!"]],
  "w7-s3": [["me", "FWOOSH! Finally, somebody's watering this lawn! Way too much, but still!"], ["me", "The gates locked behind me. Fine, monsters, line up for your weeding!"]],
  "w7-s4": [[10, "Hmph. Crab. My Crumblet wants a paddle. Walk it round the Paddling Pool Pier. No splashing."], ["me", "Kid, cheese and pools don't mix. Stick to my shell and DON'T do a cannonball!"]],
  "w7-s6": [["me", "A Recipe Scroll right next to the coleslaw. I KNEW it! It's always coleslaw!"], ["lo2", "Hah! Baron Brussels grilleth thy cabbage, crab! 'Tis nearly well done!"], ["me", "Over my dead leaves! Grab the scroll and hold on, legs! Faster!"]],
  "w7-s7": [["me", "Real dirt! Real pots! Ahh, now THIS is a fort a gardener can respect!"], ["me", "Key chest's up on that big pot. I'll bounce up and grab it, then I'm taking a soil sample. Or ten."]],
  "w7-s8": [["me", "Nice and chilly in this cooler. Keeps my cheese from sweating. Forty-five seconds, pinch everything!"], ["n", "Seed count: twelve! Cabbage count: still zero!"], ["me", "Quit counting, narrator! She's on that grill up there. I can SMELL it!"]],
  "w7-s9": [["n", "From the Grill Summit, a voice booms: \"Sprout Soldiers, FORM UP! The cabbage is almost well done!\""], ["me", "Almost well done?! Hang on, sweetheart, I'm comin'! Up the coals, SIDEWAYS!"]],
  // World 8: The Garden.
  "w8-s2": [["me", "Finally, somebody's watering this garden! With a GIANT can, but still!"], ["n", "Uh-oh! A rolling pin comes rumbling down the veggie rows, squashing lettuce as it goes!"], ["me", "Not on my veggies, ya don't! I'm gonna catch you one day, rolling pin! Right after I run!"]],
  "w8-s3": [["me", "Lovely blooms! Ahh... AH-CHOO! Hmph! Pollen in my shell!"], ["me", "Gates locked in a REAL garden this time? Fine by me. Weeding's what I do best!"]],
  "w8-s4": [[10, "Hmph. Crab. My Crumblet wants to see where veggies come from. Walk it through the Pumpkin Patch."], ["me", "Finally, a kid with taste! Stick to my shell, small fry, and DON'T step on the vines!"]],
  "w8-s6": [["me", "Beans climbing poles like they own the place. Hmph! Good for them."], ["lo2", "Hah! Thou shalt never reach yon Recipe Scroll, crab! Crabs climb not beanstalks!"], ["me", "Watch me, crumb-bum! I'll grab that scroll and hold on. Up's just sideways tipped over!"]],
  "w8-s7": [["me", "Peels, worms and the good stinky stuff. It's a spa for dirt! Ahh!"], ["me", "Eight worlds of sponge bouncing, and I STILL hate heights. Up we go anyway. Key's in that chest!"]],
  "w8-s8": [[16, "Yo, crab. Stay frosty. Is it, like, super sunny out here? Asking for a shell."], ["me", "It's SUNSET, kid! You're fine! Now help me hold this spot for forty-five seconds!"], [16, "Cool, cool. Sooo not melting. Scoop there it is!"]],
  "w8-s9": [["n", "From the old Greenhouse, a voice mumbles: \"Your cabbage? Huh. Maybe I ATE it? Maybe I AM it?\""], ["me", "If you're made of my cabbage, I'm takin' ya back leaf by leaf! Up the steps, SIDEWAYS!"]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "Who leaves shopping trolleys lying around like this? Kids these days!"], ["n", "Clean-up on aisle one! A rolling pin comes barrelling down the aisle!"], ["me", "Even in the SHOPS?! Does that thing have a loyalty card or something? Scuttle!"]],
  "w9-s3": [["me", "Grains stuck in boxes AGAIN. Poor things never even met a field!"], ["me", "Gates locked? Hmph! Two monsters squished for the price of one!"]],
  "w9-s4": [[10, "Hmph. Crab. My Crumblet's lost in Fruit and Veg. Walk it to the exit. Mind the bruised bananas."], ["me", "Fruit and Veg! My kinda neighbourhood! Stick to my shell, small fry, and DON'T squeeze the tomatoes!"]],
  "w9-s6": [["me", "Bread, bread and more bread. Not one single veggie! Hmph!"], ["lo2", "Hah! Thy cabbage sits in the Tupperwraith's hoard, crab! 'Tis well past its best before!"], ["me", "She's FRESH, buster! Grab the scroll and hold on, legs!"]],
  "w9-s7": [["me", "Peas in a CAN? Who does that to a veggie?! And there's a key chest up on that ledge, too."], ["n", "Seed count: still twelve! Cabbage count: a big fat ZERO!"], ["me", "Quit counting, narrator! Key first, then the back aisle. Hang on, sweetheart!"]],
  "w9-s8": [[14, "Let's GOOO! Hey, crab! I'm swimming the WRONG way down the checkout belt! On purpose!"], ["me", "Wrong way? I go SIDEWAYS, fishface! Help me hold this checkout for forty-five seconds!"], [14, "O-fish-ally the grumpiest crab I ever met! Let's GOOO!"]],
  "w9-s9": [["n", "From the Frozen Aisle, a voice wails: \"Woooo! A cabbage? Is THAT what's in me? I forget!\""], ["me", "She's not IN ya, she's stuck WITH ya, ya spooky tub! Hang on, sweetheart! Down the aisle, SIDEWAYS!"]],
  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Jam's just fruit that gave up on life. Hmph! Kids these days!"], ["n", "The rolling pin's back for one last chase, and it's rattling every jar on the shelf!"], ["me", "Ten worlds of you chasin' me! When this is over, you're getting planted in my patch as a FENCE!"]],
  "w10-s3": [["me", "Old noodle boxes stacked to the ceiling. Nobody even recycles back here!"], ["me", "One last locked gate, one last weeding. Hmph! I'm gonna miss this."]],
  "w10-s4": [[10, "Hmph. Crab. This is the last Crumblet. The LAST one. Walk it down Frost Drawer Falls."], ["me", "The last one? Then stick to my shell like glue, small fry. And you're comin' to the feast!"], [10, "It sits next to me. Grrr."]],
  "w10-s6": [["me", "Party decorations for a party nobody came to. That's just sad."], ["lo2", "Take yon scroll, crab. I am beaten and stale. 'Tis a recipe for coleslaw, if thou must know."], ["me", "COLESLAW?! I KNEW it! Grab it anyway and hold on, legs!"]],
  "w10-s7": [["me", "Dusty jars of pickled who-knows-what. This place needs a good weeding!"], ["me", "One last chest up high. Ten worlds of bouncing, so fine, you can TELL everybody I'm a pro!"]],
  "w10-s8": [[7, "Hrrm. Small crab, a last stand is like a garden. Hold the line, and the weeds give up."], ["me", "Huh. That's actually wise, seaweed. Forty-five seconds, then?"], [7, "Hrrm. And then rice."]],
  "w10-s9": [["n", "From the long, dusty table, a voice grumbles: \"Nobody eats cabbage! Nobody eats FRUITCAKE either!\""], ["me", "Then it's high time somebody started! Up the table, SIDEWAYS!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Pinch, pinch, PINCH!", "Get off my lawn! ALL of ya!", "Sideways and unstoppable!"],
  lowhp: ["Hey! My shell's cracking!", "Ow! Somebody water me!", "Aw, nuts! I'm wilting!"],
  perfect: ["Hah! Sidestepped!", "Crabs dodge sideways. Duh!", "Too slow, ya weed!"],
  levelup: ["Hmph. I'm growing a bit.", "New growth! Don't make it weird.", "Bigger claws! Hah!"],
  secret: ["Finders keepers! Crabs keepers!", "Ooh! Are those seeds?", "A hidden stash? MINE!"],
  boom: ["WEEDED!", "Hah! That's mulch now!", "Compost, the lot of ya!"],
  mimic: ["A box with teeth? Typical!", "Even the boxes wanna eat me!", "Fake chest! Real pinch!"],
  objective: ["Done! Don't thank me.", "Job done. Back to sideways!", "Hmph! Not bad, I guess."],
};
