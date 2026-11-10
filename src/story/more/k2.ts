// Crabbage: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Hmph! Crumbs everywhere! Kids these days. Would it kill 'em to sweep?"], ["me", "Not that I care. ...Okay, I care a little. Crumbs bring ants, and ants bring trouble!"]],
  "w1-s3": [["me", "Gummy Gully. Ugh, my legs keep sticking! Eight legs, eight problems!"], ["me", "Hmph, a ladle lever. Pull it and a rolling pin flattens the lot. Now THAT'S weeding!"]],
  "w1-s4": [["n", "A tiny Crumblet waddles up and grabs Crabbage's leg."], ["me", "Nope! Shoo! Go home! No home? Aw, nuts. FINE. Get behind my shell."], ["me", "Hundreds of monsters out there! Don't touch the rattly pots and don't follow me. ...Okay, follow me."]],
  "w1-s6": [["me", "A Recipe Scroll on the Spice Shelf? Bet it's for coleslaw. Over my dead leaves!"], ["me", "Hmph. Fine, I'll fetch it. Seventy-five seconds. Sideways is faster than ya think!"]],
  "w1-s7": [["me", "Pepper Pass is crawling with pests! Even the ants have ants! Claws out!"], ["me", "Key in a chest on a ledge up there. Finders keepers! Crabs keepers!"]],
  "w1-s8": [["me", "Cutting Board Bluffs. A board for chopping veggies. And guess what I am? A VEGGIE. Great."], ["me", "Forty-five seconds of 'em coming at me? Hmph! Shell up, pincers out! SNIP SNAP!"]],
  "w1-s9": [["me", "Found a seed on the Spice Shelf. Pocketed it. For, uh, gardening reasons."], ["n", "Seed count: one!"], ["me", "Hey! Quit counting my seeds, narrator!"]],
  // World 2: The Fridge
  "w2-s2": [["me", "Dairy Lane! Milk cartons charging at everything. No manners! Kids these days!"], [17, "Wheee! Hey, crab! Why are you walking sideways?"], ["me", "I'm a crab! You're a penguin in a fridge! Nobody gets to judge here, kid!"]],
  "w2-s3": [["me", "Something big's waiting on the Frosty Shelf. My claws are itchy. Extra elite, extra annoying!"], ["me", "Good thing there's a lever. One rolling pin, special delivery! No tip!"]],
  "w2-s4": [["me", "Aw, nuts. A Crumblet stuck in a pickle-jar ring by the pier. Pickles AGAIN?"], ["me", "C'mon, small fry. You walk, I pinch, and nobody gets brined. Deal?"]],
  "w2-s6": [["me", "Egg Carton Cliffs. Eggs! Never grew one. Never wanted to. They just SIT there!"], ["me", "Scroll's at the far end. Seventy-five seconds. I'll be back before these eggs hatch an opinion!"]],
  "w2-s7": [["me", "Butter Bridge? Whoa-whoa-WHOA! Every step sideways turns into three!"], ["me", "Sponge by the ledge. Bounce up, grab the key. Easy-peasy. Hmph! I like easy."]],
  "w2-s8": [["n", "Uh-oh! The fridge light clicks off, and Ketchup Canyon goes dark!"], ["me", "Good! Nobody sees a crab in the dark. Except slugs. Slugs see EVERYTHING."], ["foe", "Slurrrrp! I see you, cabbage crab! Hehehe!"]],
  "w2-s9": [["me", "Seed count: four! Lettuce, pea, carrot, and a weird one from the crisper. No idea."], ["mold", "Hehehe... plant your little seeds, crab. My spores will be waiting when they sprout."], ["me", "Then I'll weed ya out! That's what gardeners do. Now get off my lawn!"]],
  // World 3: The Oven
  "w3-s2": [["me", "The Bottom Rack? Not even the TOP rack? Hmph! Even the oven thinks I'm small!"], ["me", "Way too hot for seeds in here. They're staying deep in my shell. Don't ask!"]],
  "w3-s3": [["me", "A muffin maze? Back in my day we had hedges! Proper hedges! I grew one. It was PERFECT."], ["me", "And one of those cereal boxes has teeth. Pinch first, ask questions never!"]],
  "w3-s4": [[11, "Beep beep! Special delivery for Crabbage! One Crumblet, handle with care! Sign here!"], ["me", "I didn't order a... oh, FINE. Behind me, small fry. If the cookers rattle, that's the monsters' problem!"]],
  "w3-s6": [["me", "Cookie Sheet Plains. Flat, hot, and something extra-large is lurking by the Scroll."], ["me", "An elite guarding a recipe? Must be a good one. It had BETTER not be coleslaw!"]],
  "w3-s7": [["me", "Roasting Pan Pass. Everything gets roasted in here! Spuds, sprouts, my patience..."], ["me", "Key chest above the pass. I'm getting pretty good at sponge bounces. Don't tell anybody!"]],
  "w3-s8": [["me", "Pizza Stone Steppe. Hold out forty-five seconds? My shell's basically a baking dish now!"], [7, "Hrrm. Small crab, a garden is patience with dirt on it. So is a siege. So is rice."], ["me", "...That was annoyingly wise, seaweed. Right up until the rice."]],
  "w3-s9": [["me", "Seed count: seven! Plus a tomato cutting. It's nothing! I'm not building anything!"], ["me", "Quit lookin' at me like that. It's a small, leafy, totally-not-a-garden thing."]],
  // World 4: The Pantry
  "w4-s2": [["me", "Cereal Canyon. Grains stuck in boxes, never touching dirt. Poor things!"], ["me", "I'd set 'em free, but they're shaped like little O's and they BITE. Kids these days!"]],
  "w4-s3": [["me", "Flour Drifts. Like snow, if snow got in everything and then haunted ya!"], ["me", "Ladle up ahead. Rolling pin, flat ghosts, then I sweep. SOMEBODY has to sweep!"]],
  "w4-s4": [["me", "Another Crumblet? Up on a soup can, waving at me? How many of you ARE there?"], ["me", "Don't answer! Hop down, kid. And stay clear of the cookers!"]],
  "w4-s6": [["me", "Spice Rack Ridge. Basil and thyme stuck in JARS! They belong in dirt! In the sun! With me!"], ["me", "Scroll first. Then I'm busting out the parsley!"]],
  "w4-s7": [["me", "Pasta Jar Peaks. Noodles burrowing under my feet! Like worms, but useless for the soil."], ["me", "Last key's on those ledges. A secret honey cellar! Bees help gardens grow. Grumpily. Like me."]],
  "w4-s8": [["me", "Honey Hollow. Forty-five seconds against everybody! Sticky, but honest work."], ["foe", "Psst! Crab! Say I wanted to grow something. Where would I even start?"], ["me", "Step one: don't EAT it! Now hold the line, slug!"]],
  "w4-s9": [["me", "Seed count: twelve! Enough for a patch. A big patch. A patch for, uh, more than one crab."], ["mold", "Hehehe... the jar's just a door, crab. What's behind it goes all the way down the drain."], ["me", "Then I'll dig all the way down! Gardeners don't mind dirty claws. Hmph!"]],
  // World 5: The Sink.
  "w5-s2": [["me", "Suds Slide? Crabs don't slide, we SCUTTLE! Hey, why's there a giant rolling pin behind me?!"], ["me", "Run right! Sideways right! Same thing! HURRY UP, legs!"]],
  "w5-s3": [["me", "Sponge Shoals. Sponges soak up the water my sprouts should be drinking! Thieves, the lot of 'em!"], ["me", "Gates locked, three waves. Pull the lever and the rolling pin does the weeding. Hmph! Love that thing."]],
  "w5-s4": [[10, "Hmph. Crab. My Crumblet needs walking over Dish Rack Ridge. You're grumpy enough to keep it safe."], ["me", "Takes one to know one, muffin! C'mon, small fry, stick to my shell and don't lick the plates!"]],
  "w5-s6": [["me", "Bubble Bay. Bubbles popping on my shell! Pop, pop, POP! Kids these days!"], ["me", "Last Scroll's down the conveyor belts. Seventy-five seconds! If it's coleslaw, it goes down the drain!"]],
  "w5-s7": [["me", "Plughole Pass. My patch is right around here. I can smell the dirt! Ahh, lovely dirt!"], ["me", "Key chest on a high ledge, sponge to bounce on. I'm a sponge-bouncing PRO now. Don't tell anybody!"]],
  "w5-s8": [["foe", "Slurrrp! Crab! I'm on your side now! Mostly! Forty-five seconds, I'll slime the left!"], ["me", "Hmph! Fine! Just don't slime the seeds, ya goof!"]],
  "w5-s9": [["mold", "Hehehe... down here, crab. Your little patch is all fuzz now. Come and see!"], ["me", "That's MY patch you're squatting on! Seed count: twelve. Pinch count: about to be a LOT!"]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Placemat Plains. Flat, bare, and not one weed. Somebody shoulda planted something!"], ["n", "Uh-oh! A giant rolling pin comes rumbling across the placemat!"], ["me", "Run right! Sideways right! We've done this before, legs! MOVE!"]],
  "w6-s3": [["me", "Candelabra Crossing. Hot wax dripping everywhere! That stuff ruins good soil!"], ["me", "Gates locked again? Lever, rolling pin, weeded. Hmph! I could do this in my sleep."]],
  "w6-s4": [[10, "Hmph. Crab. My Crumblet wants to see the world. Walk it across Gravy Boat Bay."], ["me", "Kid, the world's mostly gravy and monsters. Stick to my shell and don't drink the bay!"]],
  "w6-s6": [["me", "Teacup Terrace! Tea's just leaf soup. Gardeners respect leaf soup."], ["lo2", "Pinch not my teacups, crab! Yon Recipe Scroll belongs to the Feast!"], ["me", "Then the Feast can come and GET it! Grab it and hold on, legs!"]],
  "w6-s7": [["me", "Napkin Fold Fort. Ooh, that napkin's folded like a cabbage! Nope. A swan. Hmph."], ["me", "Key chest on a high ledge. Sponge bounce! Still a pro. Still don't tell anybody!"]],
  "w6-s8": [["me", "Silverware Siege! Forty-five seconds of forks? I've been forked before! Pinch back!"], ["n", "Seed count: twelve! Cabbage count: zero!"], ["me", "Not for long! And quit counting, narrator!"]],
  "w6-s9": [["lo2", "Hark, crab! The chandelier is the finest seat at the table! Come up, if thou canst climb!"], ["me", "I walk SIDEWAYS, buster. Up is just sideways tipped over!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "Hose Highway! A whole garden hose, just lying around, not watering ANYTHING! Shameful!"], ["n", "Uh-oh! A giant rolling pin comes rumbling down the hose!"], ["me", "Run right! Sideways right! You know the drill, legs! MOVE!"]],
  "w7-s3": [["me", "Sprinkler Springs! FWOOSH! Finally, somebody's watering this lawn! Way too much, but still!"], ["me", "Gates locked again? Lever, rolling pin, weeded. Hmph! Best garden tool I ever had."]],
  "w7-s4": [[10, "Hmph. Crab. My Crumblet wants a paddle. Walk it round the Paddling Pool Pier. No splashing."], ["me", "Kid, cheese and pools don't mix. Stick to my shell and DON'T do a cannonball!"]],
  "w7-s6": [["me", "Picnic Table Peak! A Recipe Scroll right next to the coleslaw. I KNEW it! It's always coleslaw!"], ["lo2", "Hah! Baron Brussels grilleth thy cabbage, crab! 'Tis nearly well done!"], ["me", "Over my dead leaves! Grab the scroll and hold on, legs! Faster!"]],
  "w7-s7": [["me", "Flowerpot Fort! Real dirt! Real pots! Ahh, now THIS is a fort a gardener can respect!"], ["me", "Key chest on a high ledge. Sponge bounce! Still a pro. STILL don't tell anybody!"]],
  "w7-s8": [["me", "Cooler Canyon! Nice and chilly. Keeps my cheese from sweating. Forty-five seconds, pinch everything!"], ["n", "Seed count: twelve! Cabbage count: still zero!"], ["me", "Quit counting, narrator! It's on that grill up there. I can SMELL it!"]],
  "w7-s9": [["n", "From the Grill Summit, a voice booms: \"Sprout Soldiers, FORM UP! The cabbage is almost well done!\""], ["me", "Almost well done?! Hang on, sweetheart, I'm comin'! Up the coals, SIDEWAYS!"]],
  // World 8: The Garden.
  "w8-s2": [["me", "Watering Can Run! Finally, somebody's watering this garden! With a GIANT can, but still!"], ["n", "Uh-oh! A giant rolling pin comes rumbling between the rows!"], ["me", "Not on my veggies, ya don't! Run right! Sideways right! MOVE, legs!"]],
  "w8-s3": [["me", "Sunflower Grove. Lovely blooms! Ahh... AH-CHOO! Hmph! Pollen in my shell!"], ["me", "Gates locked? Lever, rolling pin, weeded. In a REAL garden this time! Hmph! Bliss."]],
  "w8-s4": [[10, "Hmph. Crab. My Crumblet wants to see where veggies come from. Walk it through the Pumpkin Patch."], ["me", "Finally, a kid with taste! Stick to my shell, small fry, and DON'T step on the vines!"]],
  "w8-s6": [["me", "Beanstalk Heights! Beans climbing poles like they own the place. Hmph! Good for them."], ["lo2", "Hah! Thou shalt never reach yon Recipe Scroll, crab! Crabs climb not beanstalks!"], ["me", "Watch me, crumb-bum! Grab the scroll and hold on, legs! UP is just sideways tipped over!"]],
  "w8-s7": [["me", "Compost Keep! Peels, worms and the good stinky stuff. It's a spa for dirt! Ahh!"], ["me", "Key chest on a high ledge. Sponge bounce! Eight worlds a pro now. Don't tell ANYBODY!"]],
  "w8-s8": [[16, "Yo, crab. Stay frosty. Is it, like, super sunny out here? Asking for a shell."], ["me", "It's SUNSET, kid! You're fine! Now hold the Scarecrow Stand forty-five seconds with me!"], [16, "Cool, cool. Sooo not melting. Scoop there it is!"]],
  "w8-s9": [["n", "From the old Greenhouse, a voice mumbles: \"Your cabbage? Huh. Maybe I ATE it? Maybe I AM it?\""], ["me", "If you're made of my cabbage, I'm takin' ya back leaf by leaf! Up the steps, SIDEWAYS!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Pinch, pinch, PINCH!", "Get off my lawn! ALL of ya!", "Sideways and unstoppable!"],
  lowhp: ["Hey! My shell's cracking!", "Ow! Somebody water me!", "Aw, nuts! I'm wilting!"],
  perfect: ["Hah! Sidestepped!", "Crabs dodge sideways. Duh!", "Too slow, ya weed!"],
  levelup: ["Hmph. Growing a bit.", "New growth! Don't make it weird.", "Bigger claws! Hah!"],
  secret: ["Finders keepers! Crabs keepers!", "Ooh! Is that... seeds?", "Hidden stash? MINE!"],
  boom: ["WEEDED!", "Hah! That's mulch now!", "Compost, the lot of ya!"],
  mimic: ["A box with teeth? Typical!", "Even the boxes wanna eat me!", "Fake chest! Real pinch!"],
  objective: ["Done! Don't thank me.", "Job done. Back to sideways!", "Hmph! Not bad, I guess."],
};
