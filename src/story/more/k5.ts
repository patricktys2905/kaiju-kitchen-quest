// Toastbat: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Heh. Lights out on the Crumb Trail. A good thief never leaves a trail of crumbs!"], ["n", "Uh-oh! Toastbat drops three crumbs with every flap!"], ["me", "Okay, okay! So it's less of a trail and more of a signed confession."]],
  "w1-s3": [["me", "The Plan, phase one: cross Gummy Gully without getting stuck. Phase two: see phase one."], ["me", "Ladle lever up top, rolling pin on the ledge. Every heist needs a big, heavy distraction. BONK!"]],
  "w1-s4": [["me", "Toaster Hills, the old neighbourhood! Smells like Grandma. Grandma smelled like burnt bread."], ["n", "Meanwhile, a teeny lost Crumblet grabs Toastbat's wing and WON'T let go!"], ["me", "Kid, I work alone! Ugh, fine. Stick close and stay away from the hissy pots, got it?"]],
  "w1-s6": [["me", "A Recipe Scroll at the end of the Spice Shelf? Smash-and-grab! My favourite kind of job."], ["me", "Seventy-five seconds? Pfft! I once swiped a whole crouton in less. Heh."]],
  "w1-s7": [[4, "Ooooh, excuse me... have you seen the moon? It went all dark when the Chef vanished."], ["me", "Moonlight's bad for business, fuzzball. But hey, I hope you find it."], ["me", "Psst! There's a key stashed round here somewhere. You didn't hear it from me."]],
  "w1-s8": [["me", "Cutting Board Bluffs! Forty-five seconds of looking like I MEANT to get cornered."], ["me", "Thief's rule: when you can't run, let the pressure cookers do the talking. FSSSHHH!"]],
  "w1-s9": [["mold", "Hehehe... little thief. The Butter belongs in the Sink. Everything does, sooner or later."], ["me", "Who said that?! Pfft, I'm not scared. Toast doesn't shiver, toast gets CRUNCHY. *gulp*"]],
  // World 2: The Fridge
  "w2-s2": [["me", "Dairy Lane! If the Butter's anywhere, it's down this street. I can practically smell it!"], ["me", "Milk Carton Rammers on patrol, with expiry dates stamped on their foreheads. Heh. Amateurs."]],
  "w2-s3": [["me", "Brr! Cold paws, crunchy wings. Perfect safecracking weather!"], ["me", "That lunchbox looks WAY too innocent. Trust me, I know innocent. I fake it every day."]],
  "w2-s4": [["me", "Another lost Crumblet? Thief's code: nobody gets left behind. Especially not the cute ones."], [10, "Hmph. You keep that little one safe, bat. Or you answer to ME. Grrr."], ["me", "Yes sir, Mister Terrifying Muffin, sir!"]],
  "w2-s6": [["me", "Whoa, the fridge light's out! First time ever that little bulb isn't snitching on somebody."], ["me", "Grab the Recipe Scroll in the dark, then hold out. Heh. My kinda night shift."]],
  "w2-s7": [["me", "Butter Bridge! At last! It's... MARGARINE?! Aw, nuts! I've been bamboozled!"], ["me", "Eh, word is there's a key in a secret chest round here. I'll take the consolation prize."]],
  "w2-s8": [["me", "Ketchup Canyon! Forty-five seconds while the whole fridge tries to ketchup with me. Get it?"], ["me", "Lure 'em into a pressure cooker and FWOOSH! Saucy plan, huh?"]],
  "w2-s9": [["foe", "Squeak! I left you a welcome party up the Ice Tray Steps, bat. A BIG one! Hee hee!"], ["me", "Ricotta set an ambush. Swell. Nobody tell me the odds!"]],
  // World 3: The Oven
  "w3-s2": [["me", "Yowch! The Bottom Rack is hot enough to toast a toast. I'm getting re-toasted over here!"], ["me", "Note to self: extra crispy is NOT a disguise."]],
  "w3-s3": [["me", "Oven light's off. A Muffin Tin Maze in the dark, and any cup could be hiding a guard!"], ["me", "Or a cereal box with teeth. Good thing I always spot the ladle lever on my way in. Heh."]],
  "w3-s4": [["me", "A Crumblet on the Casserole Cliffs? That's three, kid! Are you guys following me on purpose?"], ["n", "Psst! Word's out among the Crumblets: the bat with toast wings is a big softie!"], ["me", "I'm crispy! CRISPY!"]],
  "w3-s6": [["me", "Recipe Scroll on the Cookie Sheet Plains. In and out before the timer goes DING!"], [8, "Bat go fast! Me slow, so me guard door."], ["me", "Best lookout I ever had. Also the only one. Shh, don't tell him."]],
  "w3-s7": [["me", "Roasting Pan Pass! Another key, another secret vault. I'm starting a collection!"], ["me", "Lever first, rolling pin second, loot last. Ka-CHING!"]],
  "w3-s8": [[11, "Beep beep! A pizza stone! Finally, a place that respects my profession!"], ["me", "You take left, I take right. Forty-five seconds and nobody gets delivered, capisce?"]],
  "w3-s9": [["mold", "Warm, warm... but the Butter isn't warm any more, little thief. Hehehe. Someone MOVED it."], ["me", "Get your own heist, creepy voice! Wait, wait. Moved it WHERE?"]],
  // World 4: The Pantry
  "w4-s2": [["me", "Cereal Canyon. Boxes everywhere, and any one of 'em could be a mimic."], ["me", "Paranoia! The most important meal of a thief's day."]],
  "w4-s3": [["me", "Flour Drifts. Great for footprints, lousy for thieves. Lucky for me, I fly!"], ["me", "The Plan, phase one: get the Butter. Phase two: huh. Why do I keep leaving phase two blank?"]],
  "w4-s4": [["me", "Last lost Crumblet! Stick with Uncle Toastbat, kid. I know every nook in Tin Can Alley."], ["n", "Ha! Looks like somebody stopped working alone!"], ["me", "Hey! Nobody asked you, announcer guy."]],
  "w4-s6": [["me", "Another Recipe Scroll? The Chef keeps leaving clues like somebody's SUPPOSED to follow 'em."], ["me", "Wait a sec. Did the Chef want a thief? Someone real good at finding hidden stuff? Heh. Flattered."]],
  "w4-s7": [["me", "Pasta Jar Peaks, and the whole Pantry's swarming! Somebody REALLY doesn't want me up high."], ["me", "Fine! Lever, rolling pin, spaghetti everywhere. Just this once, let's make some NOISE!"]],
  "w4-s8": [[6, "Hear ye, thief! By royal decree you are pardoned! Now help us hold this line!"], ["me", "Pardoned? Aw, I'm touched. Mostly by honey. Forty-five seconds, Your Stickiness!"]],
  "w4-s9": [["me", "The Top Shelf! Where they keep the good stuff. My whole career led right here!"], ["me", "Funny, I thought I'd be drooling. Instead I keep thinking the kitchen needs it more. Ugh. Gross."]],
  // World 5: The Sink.
  "w5-s2": [["me", "Suds Slide! Wet toast is the worst toast. Soggy disguise, zero style."], ["n", "Uh-oh! A giant rolling pin comes rumbling down the suds!"], ["me", "Getaway time! Run right! Every great heist needs a chase scene!"]],
  "w5-s3": [["me", "Sponge Shoals. Gates slam shut, three waves of guards. Classic vault security."], ["me", "Lucky for me, every vault has a weak spot. This one's a lever and a rolling pin. BONK!"]],
  "w5-s4": [[10, "Hmph. Bat. One more Crumblet stuck up on Dish Rack Ridge. You know the drill."], ["me", "Uncle Toastbat, back on babysitting duty! Stick close, kid. The plates are slippy and so am I."]],
  "w5-s6": [["me", "Bubble Bay! A Recipe Scroll at the end of a conveyor belt, seventy-five seconds on the clock. Like a jewel heist movie!"], ["me", "Ride the belt, snatch the scroll, hold the fort. Smooth as butter. GOLDEN butter. Heh."]],
  "w5-s7": [["me", "Plughole Pass. One wrong step and my career goes down the drain. Like, for real down the drain."], ["me", "Secret chest on a high ledge? Bounce the sponge, grab the key. I've done this once or twice."]],
  "w5-s8": [["foe", "Squeak! Psst, bat. Grease monsters can't climb the pan edges. Don't say I never gave ya nothin'!"], ["me", "Ricotta, giving tips? Heh. Forty-five seconds, then we're square, cheese-face."]],
  "w5-s9": [["mold", "Hehehe... closer, little thief. Bring the Butter all the way down. I'll keep it SAFE."], ["me", "Heh. That's what every crook says. Trust me, I'd know."]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Placemat Plains. Wide open, no shadows, zero cover. Worst heist layout ever."], ["n", "Uh-oh! A giant rolling pin comes rumbling across the placemat!"], ["me", "Every heist needs a chase scene! Run right!"]],
  "w6-s3": [["me", "Candelabra Crossing. Hot wax dripping from above! Toast plus wax equals one very fancy candle."], ["me", "Gates locked? Lever, rolling pin, BONK. The oldest trick in my book. Also the only page."]],
  "w6-s4": [[10, "Hmph. Bat. This Crumblet wants to see the world. Show it Gravy Boat Bay. SAFELY."], ["me", "Uncle Toastbat's world tour, now with gravy! Stick close, kid, and stay clear of the hissy pots."]],
  "w6-s6": [["me", "Teacup Terrace! A Recipe Scroll sitting out in the open? Heh. Rude not to take it."], ["lo2", "Unhand yon scroll, varlet! 'Tis Feast property!"], ["me", "Funny, that's what I'd say if I swiped it first. Grab it, hold the fort!"]],
  "w6-s7": [["me", "Napkin Fold Fort. Napkins folded like swans. Classy joint. Heh, right up my alley."], ["me", "Secret chest on a high ledge. Sponge, bounce, swipe. Smooth as butter. Ugh, I miss the Butter."]],
  "w6-s8": [["me", "Silverware Siege! The whole cutlery drawer wants a piece of me. Get in line, forks."], ["me", "Forty-five seconds. Stay crunchy, stay sneaky, and let the cookers do the talking! FSSSHHH!"]],
  "w6-s9": [["lo2", "Hark, thief! The Golden Butter sits at the Head of the Table, and none shall pass Sir Stale!"], ["me", "Heh. Thanks for the tip, Sir Snitch-a-lot."]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Clean job! No fingerprints!", "Grand theft COMBO!", "Heh. Stole the show, too."],
  lowhp: ["Yikes! Getting a bit burnt here!", "Abort heist! Wait, un-abort!", "I'm toast! Well, MORE toast."],
  perfect: ["Missed me! Can't catch a thief!", "Too slippery. Buttered, even!", "Swoosh! I was never here."],
  levelup: ["Ooh, shiny new lockpicks!", "Lightly toasted to GOLDEN!", "Master thief, level up! Heh."],
  secret: ["Hidden stash? Don't mind if I do!", "Unguarded loot! My favourite!", "Ka-ching! Bounced into the loot!"],
  boom: ["Now THAT'S a distraction!", "Smash and grab! Mostly smash.", "Flattened! No witnesses."],
  mimic: ["A fake chest? That's MY trick!", "Rule one: never trust a box!", "Loot with teeth? Lousy loot!"],
  objective: ["Job done. Smooth as butter.", "Heist complete! Roll credits!", "In and out. Heh, textbook."],
};
