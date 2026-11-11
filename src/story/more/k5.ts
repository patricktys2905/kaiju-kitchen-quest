// Toastbat: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Heh. Lights out on the Crumb Trail. A good thief never leaves a trail of crumbs!"], ["n", "Uh-oh! Toastbat drops three crumbs with every flap!"], ["me", "Okay, okay! So it's less of a trail and more of a signed confession."]],
  "w1-s3": [["me", "The Plan, phase one: get across this gummy mess without sticking. Phase two: see phase one."], ["me", "Phase three: swipe some Sour Gummy Tails for the portal, then bonk the Rolling Pin Rogue. Heh. Nobody rolls a thief!"]],
  "w1-s4": [["me", "Ahh, the old neighbourhood! Smells just like Grandma. Grandma smelled like burnt bread."], ["n", "Meanwhile, a teeny lost Crumblet grabs Toastbat's wing and WON'T let go!"], ["me", "Kid, I work alone! Ugh, fine. Stick close, and when we reach the King Sour Worm, you HIDE, got it?"]],
  "w1-s6": [["me", "A Recipe Scroll stashed way up the Spice Shelf? Smash-and-grab! My favourite kind of job."], ["me", "Gotta nab it before time runs out? Pfft! I once swiped a whole crouton in less. Heh."]],
  "w1-s7": [[4, "Ooooh, excuse me... have you seen the moon? It went all dark when the Chef vanished."], ["me", "Moonlight's bad for business, fuzzball. But hey, I hope you find it."], ["me", "Psst! There's a key stashed round here somewhere. You didn't hear it from me."]],
  "w1-s8": [["me", "Cornered on a cutting board? Heh. I'll just hold out here, looking like I MEANT to be."], ["me", "Thief's rule: when you can't run, dodge the burner flames and let the monsters walk into 'em. FWOOSH!"]],
  "w1-s9": [["mold", "Hehehe... little thief. The Butter belongs in the Sink. Everything does, sooner or later."], ["me", "Who said that?! Pfft, I'm not scared. Toast doesn't shiver, toast gets CRUNCHY. *gulp*"]],
  // World 2: The Fridge
  "w2-s2": [["me", "If the Butter's anywhere, it's down this street. I can practically smell it!"], ["me", "Word is an Ice Cube Ogre's napping at the end. Heh. A sleeping guard is the best kind of guard."]],
  "w2-s3": [["me", "Brr! Cold paws, crunchy wings. Perfect safecracking weather!"], ["me", "That lunchbox looks WAY too innocent. Trust me, I know innocent. I fake it every day."]],
  "w2-s4": [["me", "Another lost Crumblet? Thief's code says nobody gets left behind. Especially not the cute ones."], [10, "Hmph. You keep that little one safe, bat. Or you answer to ME. Grrr."], ["me", "Yes sir, Mister Terrifying Muffin, sir!"]],
  "w2-s6": [["me", "Whoa, the fridge light's out! First time ever that little bulb isn't snitching on somebody."], ["me", "A Recipe Scroll way up high, and the clock's ticking? Heh. Up, grab, gone. My kinda night shift."]],
  "w2-s7": [["me", "Butter Bridge! At last! It's... MARGARINE?! Aw, nuts! I've been bamboozled!"], ["me", "And the Butter Block Brute? Also margarine. Eh, word is there's a key in a secret chest round here. Consolation prize!"]],
  "w2-s8": [["me", "The whole fridge wants to ketchup with me. Get it? Heh. Hold out, bat, hold out."], ["me", "Keep to the slippy ice and let the monsters do the sliding. Saucy plan, huh?"]],
  "w2-s9": [["foe", "Squeak! I left you a welcome party up the Ice Tray Steps, bat. A BIG one! Hee hee!"], ["me", "Ricotta set an ambush. Swell. Nobody tell me the odds!"]],
  // World 3: The Oven
  "w3-s2": [["me", "Yowch! It's hot enough down here to toast a toast. I'm getting re-toasted over here!"], ["me", "Note to self: extra crispy is NOT a disguise."]],
  "w3-s3": [["me", "Oven light's off, and I'm in a maze of muffin cups where any one of 'em could be hiding a guard!"], ["me", "Or a lunchbox with teeth. Heh. Takes a fake to know a fake. Bonk it, then on to the Pizza Peel Paladin."]],
  "w3-s4": [["me", "Another Crumblet? That's three, kid! Are you guys following me on purpose?"], ["n", "Psst! Word's out among the Crumblets: the bat with toast wings is a big softie!"], ["me", "I'm crispy! CRISPY!"]],
  "w3-s6": [["me", "There's a Recipe Scroll way up high on the cookie sheet. In and out before the timer goes DING!"], [8, "Bat go fast! Me slow, so me guard door."], ["me", "Best lookout I ever had. Also the only one. Shh, don't tell him."]],
  "w3-s7": [["me", "Another key, another secret vault. I'm starting a collection!"], ["me", "Sponge first, ledge second, loot last. Ka-CHING!"]],
  "w3-s8": [[11, "Beep beep! A pizza stone! Finally, a place that respects my profession!"], ["me", "You take left, I'll take right. We hold out, and nobody gets delivered, capisce?"]],
  "w3-s9": [["mold", "Warm, warm... but the Butter isn't warm any more, little thief. Hehehe. Someone MOVED it."], ["me", "Get your own heist, creepy voice! Wait, wait. Moved it WHERE?"]],
  // World 4: The Pantry
  "w4-s2": [["me", "Boxes everywhere, and any one of 'em could be a mimic."], ["me", "Paranoia! The most important meal of a thief's day."]],
  "w4-s3": [["me", "Flour's great for footprints and lousy for thieves. Lucky for me, I fly!"], ["me", "The Plan, phase one: get the Butter. Phase two: huh. Why do I keep leaving phase two blank?"]],
  "w4-s4": [["me", "Last lost Crumblet! Stick with Uncle Toastbat, kid. I know every nook in Tin Can Alley."], ["n", "Ha! Looks like somebody stopped working alone!"], ["me", "Hey! Nobody asked you, announcer guy."]],
  "w4-s6": [["me", "Another Recipe Scroll? The Chef keeps leaving clues like somebody's SUPPOSED to follow 'em."], ["me", "Wait a sec. Did the Chef want a thief? Someone real good at finding hidden stuff? Heh. I'm flattered."]],
  "w4-s7": [["me", "The whole Pantry's swarming up these pasta jars! Somebody REALLY doesn't want me up high."], ["me", "Fine! One bounce off that secret sponge, one key chest, and a Peanut Butter Ogre who's about to get SPREAD."]],
  "w4-s8": [[6, "Hear ye, thief! By royal decree you are pardoned! Now help us hold this line!"], ["me", "Pardoned? Aw, I'm touched. Mostly by honey. Hold tight, Your Stickiness!"]],
  "w4-s9": [["me", "The Top Shelf, where they keep the good stuff! My whole career led right here!"], ["me", "Funny, I thought I'd be drooling. Instead I keep thinking the kitchen needs it more. Ugh. Gross."]],
  // World 5: The Sink.
  "w5-s2": [["me", "Wet toast is the worst toast. Soggy disguise, zero style."], ["n", "Uh-oh! The taps go drip, drip, SPLOOSH, right on Toastbat's crust!"], ["me", "New plan. Grab the Soap Bubbles, dodge the drips, and sneak past the Sponge Golem. Heh."]],
  "w5-s3": [["me", "A lunchbox sitting all alone by the dishes? Heh. Classic vault security. It's got teeth, folks."], ["me", "Every vault has a weak spot. The Plunger Paladin's? He's stuck to the floor. Heh."]],
  "w5-s4": [[10, "Hmph. Bat. One more Crumblet stuck up on Dish Rack Ridge. You know the drill."], ["me", "Uncle Toastbat, back on babysitting duty! Stick close, kid. The plates are slippy and so am I."]],
  "w5-s6": [["me", "A Recipe Scroll up in the bubbles, and the clock's ticking? It's like a jewel heist movie!"], ["me", "Climb, snatch, scram. Smooth as butter. GOLDEN butter. Heh."]],
  "w5-s7": [["me", "One wrong step here and my career goes down the drain. Like, for real down the drain."], ["me", "There's a secret chest on that high ledge. A bounce off the sponge and it's mine. I've done this once or twice."]],
  "w5-s8": [["foe", "Squeak! Psst, bat. Grease monsters can't climb the pan edges. Don't say I never gave ya nothin'!"], ["me", "Ricotta, giving tips? Heh. We hold out here, then we're square, cheese-face."]],
  "w5-s9": [["mold", "Hehehe... closer, little thief. Bring the Butter all the way down. I'll keep it SAFE."], ["me", "Heh. That's what every crook says. Trust me, I'd know."]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Wide open, no shadows, zero cover. Whoever designed this placemat never pulled a heist."], ["n", "Uh-oh! A Gravy Boat Rammer comes sloshing across the placemat!"], ["me", "Chase scene, take two! Heh. I'll swipe a Gravy Drop on the way past!"]],
  "w6-s3": [["me", "Hot wax dripping from above! Toast plus wax equals one very fancy candle."], ["me", "And the Teapot Tyrant's asleep at the end? Heh. Tiptoe time. Nobody wake the kettle."]],
  "w6-s4": [[10, "Hmph. Bat. This Crumblet wants to see the world. Show it the gravy boats. SAFELY."], ["me", "Welcome to Uncle Toastbat's world tour, kid! First stop, gravy. Second stop, also gravy. Stay close!"]],
  "w6-s6": [["me", "A Recipe Scroll sitting up high on a tea terrace? Heh. It'd be rude not to take it."], ["lo2", "Unhand yon scroll, varlet! 'Tis Feast property!"], ["me", "Funny, that's exactly what I'd say if I swiped it first. Grab it before time runs out!"]],
  "w6-s7": [["me", "Napkins folded like little swans. Classy joint. Heh, right up my alley."], ["me", "And a secret chest on a high ledge. Bounce, swipe, gone before the swans notice. I miss the Butter, though."]],
  "w6-s8": [["me", "The whole cutlery drawer wants a piece of me. Get in line, forks."], ["me", "Hold out against this lot? Heh. Wings tucked, crust crisp, and nobody pours the tea on ME."]],
  "w6-s9": [["lo2", "Hark, thief! The Golden Butter sits at the Head of the Table, and none shall pass Sir Stale!"], ["me", "Heh. Thanks for the tip, Sir Snitch-a-lot."]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "A long green hose, wide open sky. Great for a getaway, lousy for hiding."], ["n", "Uh-oh! Picnic Wasps come buzzing down the hose!"], ["me", "Seriously, do these guys work for the cops? Heh. Wasp Stingers for the portal, then RUN!"]],
  "w7-s3": [["n", "FWOOSH! The sprinklers soak everything in sight!"], ["me", "Soggy toast is a crime, and trust me, I know crimes."], ["me", "And there's a Spatula Sheriff in town? Heh. He'll never flip THIS bat."]],
  "w7-s4": [[10, "Hmph. Bat. This Crumblet wants to see a pool. Walk it round the pier. It can't swim."], ["me", "Neither can toast, kid. Welcome to Uncle Toastbat's summer tour! Stay dry and stay close!"]],
  "w7-s6": [["me", "A Recipe Scroll up on the picnic table? Heh. Free sample."], ["lo2", "Halt, varlet! That scroll belongs to the Baron, and he shall grill thee well done!"], ["me", "I'm already golden, pal. Up, grab, gone before time runs out!"]],
  "w7-s7": [["me", "Every flowerpot's a hidey-hole. Heh, my kinda neighbourhood."], ["me", "Key chest on a high ledge, sponge underneath. Bounce, swipe, ka-CHING! Still miss the Butter, though."]],
  "w7-s8": [["me", "Ice, sodas, and maybe a chilled butter dish? Nope. Pickles. It's always pickles."], ["me", "Monsters pouring in, and a King Corn Cob Cannon popping off at the end? Hold out, bat, keep moving!"]],
  "w7-s9": [["n", "From the Grill Summit, a voice booms: \"ATTEN-TION! The Golden Butter goes on the corn at SUNDOWN!\""], ["me", "Sundown? Heh. That's my favourite time to work. Up the coals we go!"]],
  // World 8: The Garden.
  "w8-s2": [["me", "Neat rows of veggies with nowhere to hide. Lousy for sneaking, great for a getaway."], ["n", "Uh-oh! The Snapdragon up ahead snaps in its sleep!"], ["me", "Heh. A guard dog made of flowers. I'll grab my Ladybug Spots and tiptoe, thanks."]],
  "w8-s3": [["me", "Big flowers, big pollen. Ah... AH-CHOO! Great. A thief who sneezes."], ["me", "And a lunchbox in the tulips? With TEETH? Rookie disguise, pal. I'd have used a flowerpot."]],
  "w8-s4": [[10, "Hmph. Bat. My Crumblet wants to see a real pumpkin. Walk it through the patch. Gently."], ["me", "Garden tour, coming right up! Stick close, kid. And no swiping pumpkins. They're heavier than they look."]],
  "w8-s6": [["me", "A Recipe Scroll at the top of a beanstalk? Heh. A classic fairytale heist."], ["lo2", "Unhand yon scroll, varlet! The Meatloaf guardeth it! He knoweth not why, but he guardeth it!"], ["me", "A guard who doesn't know what he's guarding? Easiest mark ever. Up, grab, before time runs out!"]],
  "w8-s7": [["me", "Peels, rinds and old coffee grounds. Heh, smells like Grandma's place."], ["me", "Secret chest up on the ledge. You know me by now. Bounce, swipe, ka-CHING!"]],
  "w8-s8": [["me", "A big straw guy with buttons for eyes. Nice try, pal. I'm a bat, not a crow."], ["me", "Monsters pouring in? Hold out, bat, and somebody keep that pollen off my crust!"]],
  "w8-s9": [["n", "From the old Greenhouse, a voice mumbles: \"Butter? Is THAT what I'm made of? Nobody tells me ANYTHING!\""], ["me", "Heh. Sounds like the vault's having a bad day. Up the steps, before he eats the loot!"]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "Shopping trolleys, the getaway cars of the supermarket. Heh."], ["n", "Uh-oh! A Trolley Rammer comes rumbling down the aisle!"], ["me", "It followed me SHOPPING?! Heh. I'll take a Trolley Wheel for my trouble. RUN!"]],
  "w9-s3": [["me", "Every cereal box has a free prize inside. Heh. Finally, a place that gets me."], ["me", "And a Cash Register Golem at the end? A walking safe! Heh. Christmas came early."]],
  "w9-s4": [[10, "Hmph. Bat. My Crumblet wandered off in the fruit and veg. Walk it to the exit. And NO shoplifting."], ["me", "Me? Shoplift? I'm offended. Stick close, kid. And no grapes in your pockets!"]],
  "w9-s6": [["me", "Fresh loaves everywhere. Heh. Distant cousins. LOTS of 'em."], ["lo2", "Paws off that scroll, varlet! The Tupperwraith keepeth it with all our finest loot!"], ["me", "All the loot in one place, huh? Thanks for the tip, Sir Snitch-a-lot. Up, grab, gone!"]],
  "w9-s7": [["me", "A fortress of tins, and every one's a teeny safe. Heh. I'm home."], ["me", "One more high-ledge chest, one more bounce. The Butter's close. I can SMELL it."]],
  "w9-s8": [[14, "Let's GOOO! Hey, bat! Robbing the place after closing? That's o-fish-ally against the rules!"], ["me", "Heh. I'm just picking up my stuff, fishface. Help me hold the checkout till the rush is over?"], [14, "Against the current AND the crowd? My favourite! Let's GOOO!"]],
  "w9-s9": [["n", "From the Frozen Aisle, a voice wails: \"Woooo! Is that a THIEF? Nobody touches my hoard!\""], ["me", "Heh. A ghost AND a hoarder? My favourite kind of mark. Into the cold, wings tucked!"]],
  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Sticky floors, zero traction. Worst getaway route since the placemat."], ["n", "Uh-oh! The Forgotten Soup at the end of the jam jars goes BLOOP in its sleep!"], ["me", "Heh. Soup for a guard? Easiest job yet. Just don't spill on me. One last chase!"]],
  "w10-s3": [["me", "Old noodle boxes stacked like a city skyline. Heh. Rough part of town."], ["me", "A lunchbox with teeth AND a Banquet Butler? Heh. Fancy security. One last fake-out, one last BONK."]],
  "w10-s4": [[10, "Hmph. Bat. This is the last Crumblet. The very last. Walk it down the falls. Don't lose it."], ["me", "Uncle Toastbat's farewell tour! Stick close, kid. And when we're done, there's a feast."], [10, "Hmph. It sits by me. And no swiping its pudding."]],
  "w10-s6": [["me", "Party streamers, dusty and droopy. Heh. Somebody threw a party and nobody showed."], ["lo2", "Take yon scroll, thief. I am beaten. My lance is but a stale breadstick now."], ["me", "Heh. Thanks, Sir Snitch-a-lot. Up, grab, gone, one last time!"]],
  "w10-s7": [["me", "Jars nobody's opened since Grandma was a crumb. Heh. A vault full of vaults."], ["me", "Last secret chest of my career, folks. Bounce, swipe, and take a bow. Ka-CHING!"]],
  "w10-s8": [[11, "Beep beep! Special delivery! One extra pair of claws for the last stand, express!"], ["me", "Heh. We hold the line, Pizza. Then you can deliver us all to a feast."], [11, "Five stars, bat! I'm bringing extra garlic bread!"]],
  "w10-s9": [["lo", "Heh heh. Bring me that Butter, little thief. My long table's been empty for YEARS."], ["me", "Empty, huh? Heh. Not for long, pal. Up the table, wings tucked!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Clean job! No fingerprints!", "Grand theft COMBO!", "Heh. Stole the show, too."],
  lowhp: ["Yikes! Getting a bit burnt here!", "Abort heist! Wait, un-abort!", "I'm toast! Well, MORE toast."],
  perfect: ["Missed me! Can't catch a thief!", "Too slippery. Buttered, even!", "Swoosh! I was never here."],
  levelup: ["Ooh, shiny new lockpicks!", "Lightly toasted to GOLDEN!", "Master thief, level up! Heh."],
  secret: ["Hidden stash? Don't mind if I do!", "Unguarded loot! My favourite!", "Ka-ching! Bounced into the loot!"],
  boom: ["Now THAT'S a distraction!", "Smash and grab! Mostly smash.", "Flattened! No witnesses."],
  mimic: ["A fake chest? That's MY trick!", "Rule one: never trust a box!", "Loot with teeth? Lousy loot!"],
  objective: ["Job's done. Smooth as butter.", "Heist complete! Roll credits!", "In and out. Heh, textbook."],
};
