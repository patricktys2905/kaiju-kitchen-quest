// Minturtle: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop. Sunny, slow, the drip count starts.
  "w1-s2": [["n", "RUMBLE! A giant rolling pin is rolling right at Minturtle!"], ["me", "Whoa. Okay. Slow and steady... is NOT the move here. Legs, go go go!"]],
  "w1-s3": [["me", "Gates locked, monsters everywhere. Cool, cool, cool."], ["me", "Pull the ladle? Dude, no arms. I'll bump it with my shell. BONK! Same thing."]],
  "w1-s4": [[10, "Hmph. Turtle. Walk this Crumblet to the exit. Slowly. Carefully."], ["me", "Slow and careful is my whole thing, big guy. Hop on the shell, little muffin."], ["me", "Hissy pot goes KA-BLAM, baddies go bye-bye. And no licking my scoop, okay?"]],
  "w1-s6": [["me", "Recipe scroll at the end of the shelf. In time? Uh, how much time?"], ["n", "Whoa! Monsters are pouring off the spice shelf!"], ["me", "Scoop Lob! Freeze 'em in their tracks. Now I've got ALL the time."]],
  "w1-s7": [["me", "Pepper Pass. Pepper's spicy, right? Drip number two. Stay frosty."], ["me", "Key chest way up high. Bouncy sponge! BOING! Who says turtles can't fly?"]],
  "w1-s8": [["foe", "Hold out forty-five seconds? You'll need forty-five MINUTES, Slowpoke! Hahaha!"], ["me", "Waffle Wall, up. Nobody gets through the waffle, dude."]],
  "w1-s9": [["me", "Burners ahead. Toasty. Drip number three. Cool, cool, cool."], ["mold", "Hehehe... melt, little scoop. Melt into a nice warm puddle."], ["me", "Who said that?! Uh, no thanks. Puddles aren't my vibe."]],
  // World 2: The Fridge. Nearly home, cold and comfy.
  "w2-s2": [["me", "Dairy Lane. Ahhh, cold milk breeze. Drip count holding steady."], ["n", "RUMBLE! The rolling pin is back, and it's sliding extra fast on the cold shelf!"], ["me", "Aw, nuts. Run now, chill later!"]],
  "w2-s3": [["n", "Click! The fridge light goes out!"], ["me", "Dark AND cold? Honestly, dude, this is my best life."], ["me", "Shell bump, lever down, rolling pin drops. Baddies go flat. Cool."]],
  "w2-s4": [[10, "Hmph. Minturtle. This Crumblet's chilly. Keep it warm, would ya?"], ["me", "Bad news, big guy. I'm literally ice cream. Shell ride, though?"], [10, "...Fine. Shell ride."]],
  "w2-s6": [[17, "Wheee! Minturtle! Is the freezer still open? I miss it SO much!"], ["me", "Wide open, Pengwhip. Gotta find the Chef. First, I gotta grab that scroll."]],
  "w2-s7": [["me", "Butter Bridge. A turtle on butter is basically a hockey puck. Wheee."], ["me", "Bouncy sponge! BOING! Chest open, key's mine. Grabbed it with my mouth. No arms."]],
  "w2-s8": [["me", "Ketchup Canyon. Forty-five seconds. Shell era, activate."], ["me", "Waffle Wall up! Go ahead, bounce off it. I'll wait. I'm great at waiting."]],
  "w2-s9": [["mold", "Why leave the cold, little scoop? Stay here. Stay frozen forever..."], ["me", "Tempting, dude. But the Peas back home can't wait forever. Up the steps."]],
  // World 3: The Oven. The drip count climbs, the cool cracks a little.
  "w3-s2": [["me", "Drip number nine. Drip number ten. Cool, cool... AAAH!"], ["n", "RUMBLE! A rolling pin, hot off the rack, rolls after Minturtle!"], ["me", "Okay, running is GOOD. Running makes a breeze!"]],
  "w3-s3": [["me", "Muffin tin maze. Every cup looks the same. And they're all HOT."], ["me", "Shell bump, lever down, rolling pin goes BONK. Easy. Sweaty, but easy."]],
  "w3-s4": [[10, "Hmph. Turtle. This Crumblet's been in an oven before. It'll be fine. You, I'm not so sure."], ["me", "Thanks, dude. Hop on, little muffin. You can be my sunshade."]],
  "w3-s6": [[8, "Turtle! You melty too? Me melty! We melt buddies!"], ["me", "Melt buddies. Love it, Chocomunch. Let's grab that scroll and get OUT of here."]],
  "w3-s7": [["me", "Bouncy sponge. Wet sponge. Ooh, COLD sponge! BOING! Ahhh, that's the stuff."], ["me", "Key secured. Drip count: fifteen. Still chill. Mostly chill."]],
  "w3-s8": [["foe", "Pizza stone, Slowpoke! Hot hot hot! I'll just nap right here while you melt!"], ["me", "You nap, dude. I'll be right here, being a wall. A waffle wall."]],
  "w3-s9": [["me", "Top rack. Hottest rack. Drip number twenty. I'm not counting anymore."], ["me", "Okay, I'm still counting. Twenty-one. Stay frosty."]],
  // World 4: The Pantry. Shady, firm again, close to the Chef.
  "w4-s2": [["me", "Ahh, the Pantry. Cool and shady. My scoop is firming right up."], ["n", "RUMBLE! A rolling pin bounces off the cereal boxes!"], ["me", "Seriously? Every world? Okay. Legs, do your thing!"]],
  "w4-s3": [["me", "Flour everywhere, like snow! Hey, it's kinda like home."], ["n", "Uh-oh! That snow pile is a Flour Ghost!"], ["me", "Not cool, dude. Lever, pin, SPLAT. Now it's flat snow."]],
  "w4-s4": [["n", "SLAM! The pantry door shuts. Lights out in Tin Can Alley!"], [10, "Hmph. My Crumblet's scared of the dark. Walk it out, turtle."], ["me", "Dark is just shade with the lights off. Shell ride, little muffin. You're safe."]],
  "w4-s6": [["me", "Spice rack. Chili flakes? I'm gonna hold my breath."], ["me", "Scroll's up top. Lure the baddies to the hissy pot. KA-BLAM! Stay frosty."]],
  "w4-s7": [[7, "Hrrm. Young turtle. Ancient wisdom says the slow river carves the deepest canyon."], ["me", "Whoa. Deep, dude."], [7, "Also, slow rice cooks the fluffiest. Hrrm. The sponge is that way."]],
  "w4-s8": [["me", "Honey Hollow. Sticky. Honestly, sticky is fine. Sticky is just slow and steady for your feet."], ["me", "Forty-five seconds. Waffle Wall up. Kick back and hold the line."]],
  "w4-s9": [["me", "Top shelf! I can smell the Chef's apron. Smells like vanilla."], ["mold", "Drip, drip, little scoop. Hear the Sink? It's full of WARM water. Hehehe!"], ["me", "Warm water? *gulp* Stay frosty. Stay SO frosty."]],
  // World 5: The Sink. Last stretch, drip count at its worst, still chill.
  "w5-s2": [["n", "RUMBLE! A giant rolling pin comes skiing down the Suds Slide!"], ["me", "Last roll, dude! Slow and steady... is for LATER! Go go go!"]],
  "w5-s3": [["me", "Sponge Shoals. Cold water, soapy bubbles. Oh, this is a spa day."], ["me", "Lever down, pin drops, baddies get scrubbed. Squeaky clean, dude."]],
  "w5-s4": [[10, "Hmph. My last Crumblet, turtle. Get it past the dishes. Don't let it get soggy."], ["me", "Shell ride, one last time. Hang on, little muffin. I've got you."]],
  "w5-s6": [["me", "Bubble Bay! Scroll at the far end in seventy-five seconds. That's a LOT for a turtle."], ["me", "Conveyor belts, though? Free ride! Hah! Work smarter, not faster."]],
  "w5-s7": [["me", "Plughole Pass. Down is bad. Up is good. Bouncy sponge! BOING!"], ["me", "Last key. Holding it in my mouth. Not dropping it down the drain. Mmf!"]],
  "w5-s8": [["foe", "Greasy pans, Slowpoke! Bet you can't hold out forty-five seconds!"], ["me", "Bet I can, dude. I've been holding out since World 1. Waffle Wall!"]],
  "w5-s9": [["mold", "Hehehe... down, down, little scoop. The water's warm down here. Lovely and melty."], ["me", "Drip count: ninety-nine. Still here. Still chill. Going down, Mold."]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Placemat Plains. Long and flat. Perfect for a slow stroll."], ["n", "RUMBLE! A giant rolling pin flops over the placemats!"], ["me", "Dude! Even in Act 2?! Okay, okay, running!"]],
  "w6-s3": [["me", "Candelabras dripping hot wax. Hot wax on ice cream? Hard pass."], ["me", "Shell bump, lever down, rolling pin drops. Forks go flat. Cool."]],
  "w6-s4": [[10, "Hmph. Turtle. This Crumblet wants to see the world. Slowly. Walk it past the gravy boats."], ["me", "Shell ride, Act 2 edition! Gravy boats are fast. We're steady. Steady wins."]],
  "w6-s6": [["me", "Teacups the size of hot tubs. HOT tubs. Nope."], ["me", "Grab the scroll, freeze the Teapot Nanny. Stay frosty, little teapot."]],
  "w6-s7": [["me", "Napkin fort! Ooh, napkins. Great for drips."], ["me", "Bouncy sponge! BOING! Key's mine. No knob in the chest, though. Bummer."]],
  "w6-s8": [["lo2", "Charge, my silverware! Scoop yon turtle like a sundae!"], ["me", "Dude, you can't scoop the scoop. Forty-five seconds. Waffle Wall, up!"]],
  "w6-s9": [["me", "Chandelier. Lots of candles. Lots of heat. Drip number one. Here we go again."], ["lo2", "Climb, frosty knave! The knob is mine, and the heat goes UP! Hahaha!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "Hose Highway. A garden hose! Cold water, please, please, please!"], ["n", "RUMBLE! A rolling pin comes bouncing down the hose!"], ["me", "Aw, nuts. No shower. Just running."]],
  "w7-s3": [["n", "FSSSH! Sprinklers burst up all over the lawn!"], ["me", "Sprinklers! Best thing ever! Okay, back to business. Lever, pin, BONK."]],
  "w7-s4": [[10, "Hmph. Turtle. This Crumblet wants to swim in the paddling pool. No. Exit's that way."], ["me", "Turtles can swim, little muffin. Muffins can't. Shell ride it is."]],
  "w7-s6": [["me", "Picnic Table Peak. Wasps everywhere, scroll up top."], [9, "Hiya, little turtle! Elephants never forget! Um, who are you? *POP*"], ["me", "Minturtle, dude. Help me swat these wasps and I'll remind you every five minutes."]],
  "w7-s7": [["me", "Flowerpot Fort. Dirt is cool. Cool dirt is the best dirt."], ["me", "Bouncy sponge! BOING! Key's mine. Still no knob. Classic."]],
  "w7-s8": [[18, "In THIS corner, the coolest turtle in the yard! Ding ding!"], ["me", "Thanks, Velvaroo. Cooler Canyon, forty-five seconds. I'll be hugging the ice."]],
  "w7-s9": [["me", "Charcoal Climb. Hot, smoky and stinky. Drip number thirty. Stay frosty."], ["n", "From the grill above, a big voice booms: \"ATTEN-TION! Turn the heat UP, Sprouts!\""]],
  // World 8: The Garden.
  "w8-s2": [["me", "Watering Can Run. Ooh, drips that AREN'T mine! Love that."], ["n", "RUMBLE! A rolling pin bounces down from the watering can!"], ["me", "Every world, dude. EVERY world. Okay, running!"]],
  "w8-s3": [["me", "Sunflower Grove. Big flowers, big shade. Ahhh. Wait. ACHOO! Pollen!"], ["me", "Lettuce get this over with. Lever, pin, BONK. Bless you, monsters."]],
  "w8-s4": [[10, "Hmph. Turtle. This Crumblet wants to see a pumpkin. A small one. Walk it to the exit."], ["me", "Shell ride through the pumpkin patch! Best seat in the Garden, little muffin."]],
  "w8-s6": [[12, "Heyyy, duuude... *yaaawn* Beanstalk's tall. Scroll's at the top. No rush."], ["me", "No rush is my favourite rush, Sloba. But the heat's on. Up we go!"]],
  "w8-s7": [["me", "Compost Keep. Warm, squishy, smells like old salad."], ["me", "You reap what you sow, Leftovers! BOING! Key's mine. Knob? Still no knob. Of course."]],
  "w8-s8": [["lo2", "Hold out, frosty knave! The Meatloaf hath turned the heat up to TWELVE!"], ["me", "Twelve? That's not even a setting! Forty-five seconds. Waffle Wall, up!"]],
  "w8-s9": [["n", "From the greenhouse, a voice rambles: \"Is this a pea? Is this a button? Am I a BUTTON?!\""], ["me", "Greenhouses are hot on purpose. Drip number fifty. Climbing anyway, dude."]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "Trolley Track. A shopping trolley! Finally, a ride that doesn't need arms."], ["n", "RUMBLE! A giant rolling pin comes barrelling down the aisle!"], ["me", "Clean-up on aisle me! Okay, running!"]],
  "w9-s3": [["me", "Cereal Aisle. Boxes as tall as buildings. Frosted flakes, though? My kinda people."], ["me", "Shell bump, lever down, pin drops. Those monsters just got their shelf life cut short."]],
  "w9-s4": [[10, "Hmph. Turtle. My Crumblet wandered into the fruit and veg. Walk it out. Mind the bananas."], ["me", "Shell ride through the produce! Hold on, little muffin. Stay frosty, stay fresh."]],
  "w9-s6": [[3, "Wibble wobble! Hi hi hi! Are you going to the dessert table?! Can I come?!"], ["me", "Ice cream and jelly? Dude, that's a party. Help me grab that scroll, Bloblin."]],
  "w9-s7": [["me", "Canned Goods Keep. Cold tins everywhere. Ahhh, nice and chilly on the shell."], ["me", "Bouncy sponge! BOING! Key's mine. Knob? Nope. Two for one on bummers."]],
  "w9-s8": [["lo2", "Hold out, frosty knave! The Tupperwraith shall BAG thee at the checkout!"], ["me", "Paper or plastic? Neither, dude. Forty-five seconds. Waffle Wall, up!"]],
  "w9-s9": [["me", "THE FROZEN AISLE! Biggest freezer in the world! Drip count: below zero! Is that a thing?!"], ["n", "From the back aisle, a ghostly voice wails: \"Woooo! The knob is MINE! I keep EVERYTHING!\""], ["me", "Cool, cool, cool. Not for long, dude."]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Scoop, scoop, SCOOP!", "Chip chip hooray!", "Combo? Cool, cool, cool."],
  lowhp: ["Uh-oh. Drip, drip, DRIP!", "Not cool! Literally not cool!", "Need a freezer, dude! Stat!"],
  perfect: ["Missed me. Stay frosty.", "Shell yeah!", "Slow and steady dodges too."],
  levelup: ["Extra scoop unlocked!", "Bigger shell, cooler dude.", "Level up! Shell era continues."],
  secret: ["Ooh, a secret stash. Cool.", "Hidden treat! Nice, dude.", "Found it! Scoop there it is!"],
  boom: ["KA-BLAM! Cool explosion.", "Boom! Didn't even flinch.", "Pin drop! Chill vibes."],
  mimic: ["Dude! That box BIT me!", "Not cool, treasure chest.", "Box with teeth? Into the shell!"],
  objective: ["Done. Stay frosty.", "Slow and steady wins again!", "Job done. Cool, cool, cool."],
};
