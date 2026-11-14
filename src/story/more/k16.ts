// Minturtle: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop. Sunny, slow, the drip count starts.
  "w1-s2": [["me", "Jam Blobs drop Jam Globs. Moldy Buns drop Mouldy Crust. The exit portal wants both. Easy math, dude."], ["n", "And napping in the boss room: Sir Butterknife, the sharpest spreader on the counter!"], ["me", "A butter knife? Near ice cream? Cool, cool, cool. Totally fine."]],
  "w1-s3": [["me", "Ooh, a loot box. Free stuff! I'll just bump it with my shell and..."], ["n", "CHOMP! It's a Lunchbox Mimic!"], ["me", "Not cool, box. And the boss is a Rolling Pin Rogue? Dude, I just want ONE day without getting flattened."]],
  "w1-s4": [[10, "Turtle! Walk this Crumblet to the boss room. Slowly. Carefully. Got it?"], ["me", "Slow and careful is my whole thing, big guy. Hop on the shell, little muffin."], ["me", "Stay clear of the burners, and no licking my scoop. King Sour Worm's at the end. Big, sour, NOT your friend."]],
  "w1-s6": [["me", "The Recipe Scroll's way up high, and I gotta grab it before time runs out? Uh, for a turtle?"], ["n", "Whoa! And the Toaster Tyrant is snoozing in the boss room!"], ["me", "Scoop Lob the baddies, climb the ladders, grab the scroll. Slow and steady, but, like, fast."]],
  "w1-s7": [["me", "Pepper's spicy, right? Spicy is hot. Drip number two. Stay frosty."], ["me", "Bouncy sponge past the end of the map? Hidden key chest! BOING! Who says turtles can't fly?"], ["n", "Meanwhile, in the boss room, the Cutting Board Golem goes chop, chop, chop!"]],
  "w1-s8": [["foe", "Monsters pouring in, and you've gotta hold out? You'll need a NAP, Slowpoke! Hahaha!"], ["me", "Waffle Wall, up. Nobody gets through the waffle, dude. Not even King Pepper Grunt."]],
  "w1-s9": [["me", "Those burners are shooting flames. Drip number three. Cool, cool, cool."], ["mold", "Hehehe... melt, little scoop. The Cookie Cutter Witch will cut you into a nice round puddle."], ["me", "Who said that?! Uh, no thanks. Puddles aren't my vibe."]],
  // World 2: The Fridge. Nearly home, cold and comfy.
  "w2-s2": [["me", "Ahhh, feel that cold milk breeze. Drip count holding steady."], ["n", "Slippery ice everywhere, and an Ice Cube Ogre in the boss room!"], ["me", "An ogre made of ice? Dude, that's not a boss. That's a roommate."]],
  "w2-s3": [["n", "Click! The fridge light goes out!"], ["me", "Dark AND cold? Honestly, dude, this is my best life."], ["me", "Milk Carton Rammers drop Carton Horns. Portal wants 'em. Then the Fish Finger General. Salute? No arms."]],
  "w2-s4": [[10, "This Crumblet's chilly, turtle. Keep it warm, would ya?"], ["me", "Bad news, big guy. I'm literally ice cream. Shell ride, though?"], [10, "...Fine. Shell ride."]],
  "w2-s6": [[17, "Wheee! Minturtle! Is the freezer still open? I miss it SO much!"], ["me", "Wide open, Pengwhip. Gotta find the Chef. First, I gotta grab that scroll before time runs out."], ["n", "And rolling around the boss room: The Cheese Wheel!"]],
  "w2-s7": [["me", "A turtle on butter is basically a hockey puck. Wheee!"], ["me", "One bounce on the sponge past the end, and the hidden key's mine. BOING! Grabbed it with my mouth. No arms, remember?"], ["n", "Up ahead, the Butter Block Brute is waiting. Slippery AND grumpy!"]],
  "w2-s8": [["me", "Monsters pouring into Ketchup Canyon? Shell era, activate."], ["me", "Waffle Wall up! Go ahead, bounce off it, King Carrot Sniper. I'll wait. I'm great at waiting."]],
  "w2-s9": [["mold", "Why leave the cold, little scoop? Stay here. Stay frozen forever..."], ["me", "Tempting, dude. But the Peas can't wait. And a Leftover Lasagna Lich? Leftovers are getting WAY too fancy."]],
  // World 3: The Oven. The drip count climbs, the cool cracks a little.
  "w3-s2": [["me", "Drip number nine. Drip number ten. Cool, cool... AAAH!"], ["n", "FWOOSH! A steam vent launches Minturtle clean off the bottom rack!"], ["me", "Okay, flying is GOOD. Flying makes a breeze! Now, where's this Casserole Commander?"]],
  "w3-s3": [["me", "Every cup in this muffin tin looks the same. And they're all HOT."], ["me", "Popcorn Poppers drop Popped Kernels. Bonk, grab, portal. Then the Pizza Peel Paladin. Sweaty, but easy."]],
  "w3-s4": [[10, "This Crumblet's been in an oven before, turtle. It'll be fine. You, I'm not so sure."], ["me", "Thanks, dude. Hop on, little muffin. You can be my sunshade."]],
  "w3-s6": [[8, "Turtle! You melty too? Me melty! We melt buddies!"], ["me", "Melt buddies. Love it, Chocomunch. Let's grab that scroll up top before the Muffin Tin Mortar wakes up."]],
  "w3-s7": [["me", "A wet sponge past the end of the pan. Ooh, a COLD sponge! BOING! Ahhh, that's the stuff."], ["me", "Key secured. Drip count: fifteen. Still chill. The Souffle Sorcerer, though? Total hot air, dude."]],
  "w3-s8": [["foe", "Pizza stone, Slowpoke! Hot hot hot! And a giant King Kettle Turret! I'll nap while you melt!"], ["me", "You nap, dude. I'll hold out right here, being a wall. A waffle wall."]],
  "w3-s9": [["me", "The top rack is the hottest rack. Drip number twenty. I'm not counting anymore."], ["me", "Okay, I'm still counting. Twenty-one. And a Gingerbread Gladiator up top? Stay frosty, cookie."]],
  // World 4: The Pantry. Shady, firm again, close to the Chef.
  "w4-s2": [["me", "Ahh, shade at last. My scoop's going firm again."], ["n", "CLANG! Tin cans come tumbling off the shelves!"], ["me", "Seriously? Okay. Shell up. Then go wake the Flour Sack Sumo. Gently. He's big, dude."]],
  "w4-s3": [["me", "Flour everywhere, like snow! Hey, it's kinda like home."], ["n", "Uh-oh! A lunchbox on the shelf just licked its lips. Lunchbox Mimic!"], ["me", "Not cool, dude. Shell bump! And next up, a Cereal Box Colossus? Part of a complete breakfast? Nope."]],
  "w4-s4": [["n", "SLAM! The pantry door shuts. Lights out in Tin Can Alley!"], [10, "My Crumblet's scared of the dark, turtle. Walk it out for me."], ["me", "Dark is just shade with the lights off. Shell ride, little muffin. You're safe."]],
  "w4-s6": [["me", "Chili flakes on the spice rack? I'm gonna hold my breath."], ["me", "The scroll's up top, and the clock's ticking. Then the Honey Pot Hermit. Sticky AND grumpy? Stay frosty."]],
  "w4-s7": [[7, "Hrrm. Young turtle. Ancient wisdom says the slow river carves the deepest canyon."], ["me", "Whoa. Deep, dude."], [7, "Also, slow rice cooks the fluffiest. Hrrm. The sponge is that way."]],
  "w4-s8": [["me", "Honestly, sticky honey is fine. Sticky is just slow and steady for your feet."], ["me", "Monsters pouring in? Waffle Wall up. Kick back, hold the line, then go see the King Raisin Sniper."]],
  "w4-s9": [["me", "I can smell the Chef's apron from up here. Smells like vanilla."], ["mold", "Drip, drip, little scoop. Hear the Sink? It's full of WARM water. Hehehe!"], ["me", "Warm water? *gulp* Stay frosty. Stay SO frosty."]],
  // World 5: The Sink. Last stretch, drip count at its worst, still chill.
  "w5-s2": [["n", "Drip, drip! The taps are leaking all over the Suds Slide!"], ["me", "Cold drips? On ME? Aw, dude, that's a spa treatment. And a Sponge Golem at the end? Squishy boss. Love it."]],
  "w5-s3": [["me", "Cold water and soapy bubbles? Oh, this is a spa day."], ["me", "Grabby Gloves drop Rubber Fingers. Ironic, 'cause I've got no fingers. Or arms. Plunger Paladin's next, dude."]],
  "w5-s4": [[10, "My last Crumblet, turtle. Get it past the dishes, and don't let it get soggy."], ["me", "Shell ride, one last time. Hang on, little muffin. I've got you."]],
  "w5-s6": [["me", "The scroll's way up high, and the clock's ticking. That's a LOT of pressure for a turtle."], ["n", "From the boss room, the Dish Soap Siren sings a sudsy, sleepy song!"], ["me", "Nice try. Ice cream doesn't nap on the job. Climbing, dude."]],
  "w5-s7": [["me", "Down the plughole is bad. Up the sponge is good. BOING!"], ["me", "Got the last key, and it's in my mouth. Mmf! Scrub Brush Boar, you're next. Mmf mmf!"]],
  "w5-s8": [["foe", "Greasy pans AND a King Grabby Glove, Slowpoke! Bet you can't hold out!"], ["me", "Bet I can, dude. I've been holding out since World 1. Waffle Wall!"]],
  "w5-s9": [["mold", "Hehehe... down, down, little scoop. My Clogged Drain Hag is waiting. The water's lovely and melty."], ["me", "Drip count: ninety-nine. Still here. Still chill. Going down, Mold."]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Long, flat placemats. Perfect for a slow stroll."], ["n", "Uh-oh! Fork Soldiers march out, and a Gravy Boat Captain waits in the boss room!"], ["me", "Gravy? Dude, gravy is HOT. Okay, okay, scooping time."]],
  "w6-s3": [["me", "Hot wax dripping off the candles? On ice cream? Hard pass."], ["me", "And a Teapot Tyrant up ahead. Tea is hot, tyrants are rude. Double not cool."]],
  "w6-s4": [[10, "This Crumblet wants to see the world, turtle. Slowly. Walk it past the gravy boats."], ["me", "Shell ride, Act 2 edition! Gravy boats are fast. We're steady. Steady wins."]],
  "w6-s6": [["me", "These teacups are the size of hot tubs. HOT tubs. Nope."], ["me", "Grab the scroll before time runs out, then freeze the Candelabra Duchess. Stay frosty, fancy lady."]],
  "w6-s7": [["me", "A napkin fort! Ooh, napkins. Great for drips."], ["me", "BOING! Key's mine. No knob in the chest, though. Bummer. Now, about that Silver Cloche Knight."]],
  "w6-s8": [["lo2", "Charge, my silverware! Scoop yon turtle like a sundae! King Teapot Nanny awaits!"], ["me", "Dude, you can't scoop the scoop. Hold out? Waffle Wall, up!"]],
  "w6-s9": [["me", "A chandelier full of candles means a whole lot of heat. Drip number one. Here we go again."], ["lo2", "Climb, frosty knave! The Napkin Ringmaster shall fold thee like a swan, and the heat goes UP! Hahaha!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "A garden hose! Cold water, please, please, please!"], ["n", "Nope! Just Ember Fireflies, and a Hot Coal Golem snoozing in the boss room!"], ["me", "Aw, nuts. Hot coals. Not cool. Literally."]],
  "w7-s3": [["n", "FSSSH! Sprinklers burst up all over the lawn!"], ["me", "Sprinklers! Best thing ever! Okay, back to business. Spatula Sheriff, this lawn ain't big enough for us both."]],
  "w7-s4": [[10, "This Crumblet wants to swim in the paddling pool. No. The exit's that way, turtle."], ["me", "Turtles can swim, little muffin. Muffins can't. Shell ride it is."]],
  "w7-s6": [["me", "Wasps all over the picnic table, and the scroll's up top."], [9, "Hiya, little turtle! Elephants never forget! Um, who are you? *POP*"], ["me", "Minturtle, dude. Help me swat these wasps and I'll remind you every five minutes."]],
  "w7-s7": [["me", "Dirt is cool. Cool dirt is the best dirt."], ["me", "BOING! Key's mine. Still no knob. Classic. And a Marshmallow Mammoth? Toasty AND fluffy, dude."]],
  "w7-s8": [[18, "In THIS corner, the coolest turtle in the yard! Ding ding!"], ["me", "Thanks, Velvaroo. Hold out in a cooler? I'll be hugging the ice. King Corn Cob Cannon can wait."]],
  "w7-s9": [["me", "Hot, smoky and stinky all the way up. Drip number thirty. Stay frosty."], ["me", "A Sauce Bandit in the boss room? Dude, I'm mint. I don't DO sauce."], ["n", "From the grill above, a big voice booms: \"ATTEN-TION! Turn the heat UP, Sprouts!\""]],
  // World 8: The Garden.
  "w8-s2": [["me", "Ooh, drips from the watering can that AREN'T mine! Love that."], ["n", "And in the boss room, a Snapdragon! It's a flower with TEETH!"], ["me", "A biting flower? Dude, this garden needs a chill pill. Okay, scooping."]],
  "w8-s3": [["me", "Big sunflowers, big shade. Ahhh. Wait. ACHOO! Pollen!"], ["me", "Lettuce Snails drop Lettuce Leaves. Lettuce get this over with. Then the Watering Can Wizard. Bless you, monsters."]],
  "w8-s4": [[10, "This Crumblet wants to see a pumpkin, turtle. A small one. Walk it to the exit."], ["me", "Shell ride through the pumpkin patch! Best seat in the Garden, little muffin."]],
  "w8-s6": [[12, "Heyyy, duuude... *yaaawn* Beanstalk's tall. Scroll's at the top. No rush."], ["me", "No rush is my favourite rush, Sloba. But the clock's ticking AND the heat's on. Up we go!"]],
  "w8-s7": [["me", "This compost is warm and squishy, and it smells like old salad."], ["me", "You reap what you sow, Leftovers! BOING! Key's mine. Knob? Still no knob. Of course."]],
  "w8-s8": [["lo2", "Hold out, frosty knave! The Meatloaf hath turned the heat up to TWELVE!"], ["me", "Twelve? That's not even a setting! Waffle Wall, up! King Radish Bomber, you're next."]],
  "w8-s9": [["n", "From the greenhouse, a voice rambles: \"Is this a pea? Is this a button? Am I a BUTTON?!\""], ["me", "Greenhouses are hot on purpose, y'know. Drip number fifty. A Pumpkin Scarecrow up top? Climbing anyway, dude."]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "A shopping trolley! Finally, a ride that doesn't need arms."], ["n", "Uh-oh! That's a Trolley Rammer! And its big boss, the Trolley Chariot, is parked in the boss room!"], ["me", "Clean-up on aisle me! Okay, scooping!"]],
  "w9-s3": [["me", "Cereal boxes as tall as buildings. Frosted flakes, though? My kinda people."], ["me", "Coupon Ghosts drop Coupon Scraps. The portal wants 'em. Then the Cash Register Golem. Do I pay in drips?"]],
  "w9-s4": [[10, "My Crumblet wandered into the fruit and veg, turtle. Walk it out, and mind the bananas."], ["me", "Shell ride through the produce! Hold on, little muffin. Stay frosty, stay fresh."]],
  "w9-s6": [[3, "Wibble wobble! Hi hi hi! Are you going to the dessert table?! Can I come?!"], ["me", "Ice cream and jelly? Dude, that's a party. Help me grab that scroll before time runs out, Bloblin."]],
  "w9-s7": [["me", "Cold tins everywhere. Ahhh, nice and chilly on the shell."], ["me", "BOING! Key's mine. Knob? Nope. And a Mop Bucket Mage up ahead? Two for one on bummers."]],
  "w9-s8": [["lo2", "Hold out, frosty knave! King Dented Can Turret shall pelt thee at the checkout!"], ["me", "Paper or plastic? Neither, dude. Waffle Wall, up!"]],
  "w9-s9": [["me", "THE FROZEN AISLE! Chill blasts everywhere! Drip count: below zero! Is that a thing?!"], ["n", "From the back aisle, a ghostly voice wails: \"Woooo! The knob is MINE! I keep EVERYTHING!\""], ["me", "Cool, cool, cool. Shelf Stacker Bot first. Then you, dude."]],
  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Cold jars, cold jam. Drip count holding at zero."], ["n", "In the boss room, a pot of Forgotten Soup bubbles and grumbles!"], ["me", "Soup? Back here? Dude, even soup gets forgotten. Okay, last stretch. Legs, go!"]],
  "w10-s3": [["me", "Noodle boxes, best before LAST year. Not cool. Well, literally cool."], ["me", "A Banquet Butler in the boss room? Sorry, dude. I'm not ordering. I'm scooping."]],
  "w10-s4": [[10, "This is my LAST Crumblet, turtle. The very last one. Walk it out carefully."], ["me", "Last shell ride, big guy. Hop on, little muffin. Slow, steady and frosty."], [10, "Stay close to the turtle, kid. He's a good one."]],
  "w10-s6": [["me", "Old party chains, all faded. Somebody threw a party back here once."], [17, "Wheee! Minturtle! It's so cold back here! It's like the freezer! I'm HOME! Ish!"], ["me", "Ice to see ya, Pengwhip. Scroll's up high, clock's ticking. Then Waffle Wall the Pudding Juggernaut."]],
  "w10-s7": [["me", "Dusty jars nobody ever opens. Dude, that's kinda sad."], ["me", "Last key's past the end, up on the hidden ledge. BOING! Grabbed it with my mouth. Trifle Titan, you're next."]],
  "w10-s8": [["lo2", "Forsooth, frosty knave! The WHOLE army pours in, and King Party Cracker Bomber too! Thou shalt MELT!"], ["me", "In a fridge? Dude, I'm thriving. Waffle Wall, up!"]],
  "w10-s9": [["me", "Long, dusty and super empty. Not a single plate on the whole table."], ["n", "From the cake-tin throne, a grumpy voice booms: \"Bring me that knob, little scoop! My oven is ALWAYS on!\""], ["me", "Always on? Cool, cool, cool. And a Fondue Fiend on the way? Hot cheese. Totally fine. Climbing."]],

  // World 11: The Midway.
  "w11-s2": [["me", "Scoop Lob at the milk bottles, win a parasol! BONK! Nothing. Dude, those bottles are nailed to the shelf. Drip count: two."], ["n", "Step right up! Down the boulevard, a Pretzel Contortionist poses in a knot, in the only shady spot for miles!"], ["me", "He's hogging the shade AND he's twisted? Not cool. Scoot over, pretzel dude. Slow and steady, here I come."]],
  "w11-s3": [["me", "Ring toss with no arms. I flipped one with my foot, dude, and the peg DUCKED. Pegs don't duck! Drip count: three."], ["me", "Then a Whack-a-Churro popped up under my shell, and the prize box bit my tail. Gumball Gunner, you'd better play fair. Ka-Chunk."]],
  "w11-s4": [[10, "Hmph. Turtle. I count five, and I ought to count six. One's lost in the crowd by the bumper cars."], ["me", "On it, big guy. Shell ride, festival edition! Hop on, little muffin. The Bumper Cupcakes can't steer, but I never swerve."], [10, "Slowly. Carefully. And no licking the turtle."]],
  "w11-s6": [["me", "A Recipe Scroll at the tippy top of the prize shelf, and the clock's ticking. In full sun. Drip count: four."], ["me", "And the Fry Basket Brawler's spitting HOT oil and yelling \"Order Up!\"? I'll have the opposite of that, dude."]],
  "w11-s7": [["me", "Whoa. This mirror makes me a triple scoop. That one makes me a milkshake. Not cool, mirror. So not cool."], ["me", "Triple Scoop Me spotted a key chest up on a ledge. BOING! Carousel Macaron Pony, your prancing makes a nice breeze. Keep going."]],
  "w11-s8": [["lo2", "Have at thee, coconut! Frosty knave, to my side! The tourney hath begun, and yon coconuts joust most foully!"], ["me", "They're throwing them BACK, dude. Here comes the whole crowd, and King Coconut Shy Lobber too. Waffle Wall, up! Drip count: five."], ["lo2", "A wall of waffle! Forsooth, the finest shield in all the lists! I shall hide behind it. Bravely!"]],
  "w11-s9": [["me", "A doughnut wheel as tall as the sky. That's closer to the sun, dude. Drip count: six. Stay frosty."], ["n", "The loudspeaker crackles: \"Step right up, my boy! Feeling the HEAT? Nobody keeps cool at the Great Flosso's games! Ta-daa!\""], ["me", "I keep cool for a living, mister. Bonbon the Cannonball, mind the shell. And hey, that big top's got a ROOF. Climbing."]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Scoop, scoop, SCOOP!", "Chip chip hooray!", "Combo? Cool, cool, cool!"],
  lowhp: ["Uh-oh! Drip, drip, DRIP!", "Not cool! Literally not cool!", "Need a freezer, dude! Stat!"],
  perfect: ["Missed me! Stay frosty!", "Shell yeah!", "Slow and steady dodges too!"],
  levelup: ["Extra scoop unlocked!", "Bigger shell, cooler dude!", "Level up! Shell era continues!"],
  secret: ["Ooh, a secret stash! Cool!", "Hidden treat! Nice, dude!", "Found it! Scoop there it is!"],
  boom: ["KA-BLAM! Cool explosion!", "Boom! Didn't even flinch!", "Pin drop! Chill vibes!"],
  mimic: ["Dude! That box BIT me!", "Not cool, treasure chest!", "Box with teeth? Into the shell!"],
  objective: ["Done! Stay frosty!", "Slow and steady wins again!", "Job done! Cool, cool, cool!"],
};
