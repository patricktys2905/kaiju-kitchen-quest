// Gobzilla Jr.: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Stomp count: twelve! Big brother would be at the Fridge by now. Show-off!"], ["me", "Sir Butterknife's napping at the end of the trail? A knife that NAPS? Wakey wakey! Rawr!"]],
  "w1-s3": [["n", "Uh-oh! Gummy Gully is wiggling, and it's NOT the gummies!"], ["me", "Whoa, that's a LOT of monsters! Finally, stuff my size to stomp! Rawr!"], ["me", "And a Rolling Pin Rogue in the boss room? I love rolling pins! Just not ones that roll at ME!"]],
  "w1-s4": [["n", "A teeny Crumblet peeks out from behind the toaster. Its blueberries are shaking!"], ["me", "Don't worry, little muffin! Stay behind me. I'm the big one here! ...Wait, am I?"], ["me", "YES I am! Rawr! There's a King Sour Worm up ahead, so you hide and I stomp. Deal?"]],
  "w1-s6": [["me", "There's a Recipe Scroll way up high on the shelf! I gotta grab it before time runs out. Go go go!"], ["me", "Big brother says I'm all sugar and no spice. Hah! Watch me get SPICY!"]],
  "w1-s7": [["foe", "Psst, shrimp! I left a pal up ahead for ya. A BIG pal. Hah!"], ["me", "Brutus! Big pals fall over just like big bullies! KA-THUMP!"], ["me", "Plus there's a secret key way up high. Ugh, high is my worst direction! Good thing sponges go BOING!"]],
  "w1-s8": [["me", "Monsters are gonna pour in, and I gotta hold out till they quit! Then King Pepper Grunt's next!"], ["me", "Big brother can hold his breath forever. I can hold my GROUND! Hmm, that sounded cooler in my head."]],
  "w1-s9": [["me", "Sniff sniff. Yuck! Smells like a whole breakfast went wrong up there! And is that a WITCH?"], ["mold", "Hehehe! Come closer, tiny berry. Toast that sits out too long gets all fuzzy and green."], ["me", "I-I'm not scared! I'm MEDIUM scared! That's different!"]],

  // World 2: The Fridge
  "w2-s2": [["me", "Yogurt Slimes, Cheese Cube Critters... this whole street is past its date. Pee-yew!"], ["me", "Stomp count: two hundred and six! And an Ice Cube Ogre at the end? Big brother's gonna flip!"]],
  "w2-s3": [[11, "Beep beep! Hot pizza coming through! Heads up, kid, the lunchboxes in here BITE!"], ["me", "Thanks, Pizzaraptor! Um, how do I tip you?"], [11, "Stomp something big! I'll count it as five stars!"]],
  "w2-s4": [["n", "Click! The fridge light goes out on Pickle Jar Pier. A lost Crumblet whimpers. Uh-oh!"], ["me", "Eep! It's okay, little guy. I'm scared of the dark too. We'll be scared TOGETHER!"], ["me", "Hold my leaf. And if the ice gets slippy, we slide TOGETHER. Deal?"]],
  "w2-s6": [["me", "Another Recipe Scroll, way up on the egg cartons! Grab it before the clock runs out!"], ["me", "Twelve eggs and no time for egg jokes. Okay, ONE! Let's SCRAMBLE! Rawr!"]],
  "w2-s7": [["me", "Wheee, this butter's all slippy-slidey! There's a secret key up on a ledge somewhere."], ["me", "Big brother found a key once and lost it in the jam jar. I'm keeping mine in my leaves!"]],
  "w2-s8": [["n", "Ketchup Canyon is boiling over with monsters! Hold out till they stop coming!"], ["me", "Whoa! Somebody squeezed the bottle WAY too hard!"], ["me", "Eh, more monsters means more stomps! Then a King Carrot Sniper? Veggies, ew! Rawr!"]],
  "w2-s9": [["me", "Every step up here's a giant ice cube! Look at me, climbing like a REAL kaiju! Hup! Hup!"], ["mold", "Hehehe! Climb, little berry. It's so cold up there. You'll stay fresh FOREVER."], ["me", "Hey! You're not the boss of my freshness!"]],

  // World 3: The Oven
  "w3-s2": [["me", "Phew, it's hot down here! My leaves are wilting into bangs. Do I look cool? I look cool."], ["me", "Stomp count: four hundred and, uh, something! Real kaiju lose count! Casserole Commander, you're next!"]],
  "w3-s3": [["n", "Uh-oh! Something big and hungry is hiding in the Muffin Tin Maze!"], ["me", "An ambush? Big brother ambushes me every breakfast! I'm SO ready!"], ["me", "And if a lunchbox looks extra snacky, it's a trap. A bitey trap!"]],
  "w3-s4": [[10, "Hmph. Got a stray Crumblet on these cliffs, strawberry. Get it to the top in one piece."], ["me", "Me?! Bluebeary trusts ME with a muffin?! Gobzilla Medium, babysitter class! Rawr!"], [10, "Mind the steam vents. They'll fling ya. And hold its hand."]],
  "w3-s6": [["me", "The Recipe Scroll's way up over these cookie sheets! Grab it before time runs out!"], ["mold", "Hehehe! The Crown has a recipe too, little berry. Step one: add YOU."], ["me", "Ew ew EW! Kaiju don't go in recipes! RAWR!"]],
  "w3-s7": [["me", "A Souffle Sorcerer? Big brother says souffles fall flat if you stomp near 'em. Let's test it! STOMP!"], ["me", "The secret key's up high again. I used to need a step stool. Now I've got a sponge! Boing!"]],
  "w3-s8": [["me", "Ow ow ow, hot floor! I gotta dance AND hold out at the same time? Let's GO!"], ["me", "Then a King Kettle Turret? Whistle all you want, teapot! I'm stomping your spout! KA-BLAM!"]],
  "w3-s9": [["foe", "Oi, shrimp! Still climbing? The Grease Dragon's gonna spread you on toast like jam!"], ["me", "Then I'll be the spiciest jam he ever tasted, Brutus! Watch me!"]],

  // World 4: The Pantry
  "w4-s2": [["me", "Big brother said cereal is breakfast. He never said a Flour Sack Sumo sits on it!"], ["me", "And he never got THIS far. Ooh, this time I get to tell HIM the story!"]],
  "w4-s3": [["me", "Everything's white and poofy, like a giant pillow fight! Pfft, ptoo! Flour in my mouth!"], ["me", "A Cereal Box Colossus? I'm gonna stomp him into the world's biggest bowl of crumbs!"]],
  "w4-s4": [["n", "A Crumblet waves from behind a soup can. It's been waiting for someone big!"], ["me", "Someone big? Oh! Me? That's ME! Stay right behind me, little buddy!"], ["me", "Rule one: watch for falling cans. Rule two: I'm super proud of rule one!"]],
  "w4-s6": [["n", "Flicker... CLICK! The pantry bulb goes out on Spice Rack Ridge!"], ["me", "I can't see the Recipe Scroll, but I can smell it way up there! Paprika! Ah-CHOO!"], ["me", "Monsters get tougher in the dark? So do I! Pretty sure! Rawr?"]],
  "w4-s7": [["me", "A Peanut Butter Ogre? Big brother eats peanut butter with a SPOON. I'll stomp it with my FEET!"], ["me", "The last secret key's up there somewhere. Penne for your thoughts on where? Hehe!"]],
  "w4-s8": [["me", "Sticky honey AND monsters pouring in? If I get stuck, I'll just stomp in place!"], [8, "Small berry fight good! Me watch. Me cheer. GO BERRY GO!"]],
  "w4-s9": [["me", "This is higher than big brother's EVER been! Whoa, don't look down!"], ["mold", "Hehehe! Climb all you like, little berry. Every road goes down... to the Sink."], ["me", "Then I'll stomp that jar and come down as Gobzilla MEDIUM! Final answer!"]],

  // World 5: The Sink.
  "w5-s2": [["me", "Wheee, a soap slide! Stomp count: a gazillion! Wait, why are the bubbles rumbling?"], ["n", "Uh-oh! A Sponge Golem snores at the bottom of the suds, soaking up the whole sink!"], ["me", "I LOVE sponges! Just not ones bigger than big brother! Stomp first, boing later!"]],
  "w5-s3": [["me", "A Plunger Paladin? Ew, somebody wash that knight! Time to get soap-er! I mean SUPER!"], ["me", "I'm gonna wash these guys right outta my leaves! Scrub-a-dub STOMP!"]],
  "w5-s4": [[10, "Hmph. Strawberry. Stray Crumblet up on Dish Rack Ridge. You know the drill."], ["me", "Babysitter class, back on duty! Hold my leaf, little guy. These plates are slippy!"], [10, "You're getting good at this. Don't let it go to your leaves."]],
  "w5-s6": [["me", "The Recipe Scroll's way up past the bubbles! Gotta grab it before time runs out! Wheee!"], ["me", "Pop! Pop! Big brother says bubbles are for babies. Big brother's not HERE! Pop!"]],
  "w5-s7": [["me", "That secret chest is up on a high ledge again. Why is treasure ALWAYS up?"], ["me", "Good thing I've got a bouncy sponge and a big RAWR! Boing! Gimme that key!"]],
  "w5-s8": [["me", "Ew, nobody's EVER washed these greasy pans! And I gotta hold out in here till the monsters quit?"], ["foe", "Psst, shrimp. Er, Gobzilla. Lure 'em under the drippy taps. SPLOOSH! Not that I care!"], ["me", "Brutus is HELPING?! Wait till big brother hears THIS!"]],
  "w5-s9": [["me", "It's real dark going down the drain. Stomp count? Who's counting? I'm too busy being brave."], ["mold", "Hehehe... closer, little berry. Everything goes down the drain sooner or later. Even little brothers."], ["me", "Not THIS little brother! I'm the MEDIUM one! RAWR!"]],

  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Placemats as big as football fields! Stomp count: one! Two! Hey, why's the whole table shaking?"], ["n", "SPLOSH! Gravy Boat Rammers come charging across the tablecloth like tiny angry ships!"], ["me", "I'm NOT running away. I'm stomping TOWARDS the Gravy Boat Captain! RAWR!"]],
  "w6-s3": [["me", "These candles are taller than lighthouses! Ow, hot wax! Drip drip SPLAT!"], ["me", "A Teapot Tyrant in the boss room? I'll make him whistle a DIFFERENT tune! Rawr!"]],
  "w6-s4": [[10, "Hmph. Strawberry. One of mine wandered off to see the world. Gravy Boat Bay's no place for it."], ["me", "Babysitter class, on tour! Hold my leaf, little guy, and DON'T fall in the gravy!"], [10, "Wanted a big adventure. Like somebody I know."]],
  "w6-s6": [["me", "There's a Recipe Scroll up on the tea table! Grab it quick! Pinkies up!"], ["lo2", "Forsooth! A berry at the tea party? Mind thy manners, peasant!"], ["me", "My manners say STOMP! Rawr!"]],
  "w6-s7": [["me", "Somebody folded these napkins into a whole castle! And the treasure's at the very top. Of course."], ["me", "Lucky they serve sponges with dinner around here! Boing! Come to Gobzilla, little key!"]],
  "w6-s8": [["me", "The whole cutlery drawer wants a piece of me! I just gotta hold out!"], ["foe", "Oi, Gobzilla! Lure 'em under the candles! Hot wax makes 'em SPLAT! Not that I'm watching!"], ["me", "Brutus is my biggest fan now! Stomp count, here we GO!"]],
  "w6-s9": [["me", "Whoa, that chandelier's like a sparkly upside-down tree!"], ["lo2", "Hah! Climb, little crumb! At the Head of the Table, thou shalt be DESSERT!"], ["me", "Dessert?! I'm the MAIN COURSE! Wait, no. I'm the HERO!"]],

  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "This garden hose goes on FOREVER! Hey, why's it buzzing?"], ["n", "BZZZ! Picnic Wasps and Ember Fireflies come zooming up off the hose!"], ["me", "And a Hot Coal Golem at the end? Somebody wants to make a burger outta ME! Stomp 'em all!"]],
  "w7-s3": [["me", "FWOOSH! Whoa, the sprinklers flung me sky-high! Gobzilla Large is also Gobzilla AIRBORNE!"], ["me", "A Spatula Sheriff up ahead? Let's flip HIM like a burger patty! RAWR!"]],
  "w7-s4": [[10, "Hmph. Strawberry. Stray Crumblet out on Paddling Pool Pier. Walk it to the exit."], ["me", "Poolside babysitting? I'm on it! Hold my leaf, and no cannonballs, okay?"], [10, "Watch the sprinklers. And the wasps. And the kid. Mostly the kid."]],
  "w7-s6": [["me", "The Recipe Scroll's up by a potato salad mountain! Grab it quick, maybe grab a snack!"], ["lo2", "Hah! Baron Brussels shall cook thee WELL DONE, berry!"], ["me", "Well done? Aw, thanks! I DID do well! RAWR!"]],
  "w7-s7": [[9, "Ooh, a little strawberry! Elephants never forget a face! *POP* Um, have we met?"], ["me", "Not yet! I'm Gobzilla Large! Almost! Can you help me reach that chest up there?"], [9, "Sure! Wait, what were we doing? Ooh, a sponge! Boing!"]],
  "w7-s8": [["me", "Brrr, this cooler's like the Fridge all over again! Monsters pouring in? Let's hold out!"], [18, "In THIS corner, the teeny strawberry with the great big RAWR! Ding ding! Give 'em the old one-two!"], ["me", "One-two STOMP! Stomp count, here I come!"]],
  "w7-s9": [["me", "Ow ow, hot rocks! And there's a Sauce Bandit hiding up there with all the ketchup!"], ["n", "From the Grill Summit, a voice booms: \"ATTEN-TION, berry! Report for sprout inspection!\""], ["me", "Nope! Big brother says strawberries are DESSERT! RAWR!"]],

  // World 8: The Garden.
  "w8-s2": [["me", "Somebody left a giant watering can tipped over. It's like a waterslide! Wait, what's that snapping?"], ["n", "SNAP SNAP! A giant Snapdragon snoozes at the end of the run, and it's got TEETH!"], ["me", "A flower with teeth?! Who planted THAT? Okay, stomp first, sniff flowers later! RAWR!"]],
  "w8-s3": [["me", "ACHOO! These sunflowers keep sneezing pollen on me! Bless YOU! Wait, bless ME!"], ["me", "And a Watering Can Wizard? Okay, monsters, line up. One squish each, no cutting! RAWR!"]],
  "w8-s4": [[10, "Hmph. Strawberry. Stray Crumblet hiding in the Pumpkin Patch. Walk it to the exit."], ["me", "Garden babysitting! Hold my leaf, little guy. Watch out for Radish Bombers!"], [10, "Medium? Looks more like Large to me. Don't let it go to your leaves."]],
  "w8-s6": [["me", "The Recipe Scroll's way up the beanstalk. And high is STILL my worst direction!"], ["lo2", "Hah! Climb, berry! The Meatloaf shall serve thee as a GARNISH!"], ["me", "Garnish is the teeny leaf on the side! I'm a WHOLE berry! RAWR!"]],
  "w8-s7": [["me", "Pee-yew! This compost smells like big brother's sneakers!"], [12, "Heyyy, little dude. *yaaawn* Compost is old snacks growin' into new snacks. Pretty rad."], ["me", "Whoa, that's deep! Okay, now gimme that sponge. BOING! Key, you're mine!"]],
  "w8-s8": [["me", "Hey, Mr. Scarecrow! You don't scare me, and neither does a whole crowd of monsters!"], [16, "Stay frosty, little dude. Is that sun hot? I'm not melting. Am I melting?"], ["me", "Stand in my shadow! It's LARGE now! RAWR!"]],
  "w8-s9": [["me", "Glass everywhere! Ooh, lookin' LARGE in that reflection, Gobzilla!"], ["n", "From the Mystery Heap, a voice rumbles: \"Is that a berry? Am I PART berry?! Lemme check!\""], ["me", "Nope! You're not getting any of THIS berry! RAWR!"]],

  // World 9: The Supermarket.
  "w9-s2": [["me", "Shopping trolleys! Can I ride one? Wait, why are they all rattling?"], ["n", "Clean-up on aisle one! Trolley Rammers come barrelling down the track, and their boss is a CHARIOT!"], ["me", "Trolleys aren't supposed to have drivers! Okay, stomp 'em and grab their wheels! RAWR!"]],
  "w9-s3": [["me", "Big brother's Choco Crunch Bombs! These boxes are taller than his whole BED!"], ["me", "And a Cash Register Golem? Ka-CHING! Okay, monsters, it's cereal-squashing time! RAWR!"]],
  "w9-s4": [[10, "Hmph. Strawberry. Stray Crumblet in Fruit and Veg. Thinks it's a blueberry. Walk it to the exit."], ["me", "Grocery babysitting! Hold my leaf, little guy, and no hiding with the grapes!"], [10, "Large. You're Large now. Don't make me say it twice."]],
  "w9-s6": [["me", "Whoa, these donuts are bigger than ME! Okay, focus. Grab the scroll up top before time runs out!"], ["lo2", "Hah! Fresh bread is for PEASANTS, berry! Day-old is VINTAGE!"], ["me", "Day-old? You're like YEAR-old, buddy! RAWR!"]],
  "w9-s7": [[3, "Wibble wobble! Go, go, little berry! Gimme an S! Gimme a T! Gimme... um, a sponge?"], ["me", "Got one! BOING! That chest up there's gonna get checked out! Get it? Check out? Hehe!"]],
  "w9-s8": [["me", "Beep, beep, BEEP! The whole checkout is covered in monsters! Time to hold out!"], [14, "Let's GOOO, little dude! Stomp 'em all! That's how ya get o-fish-ally strong!"], ["me", "Then a King Dented Can Turret? Stomp count, here I come! RAWR!"]],
  "w9-s9": [["me", "Brrr! My leaves are shivering AGAIN! Anybody got a scarf? Still no?"], ["n", "From the Back Aisle, a spooky voice wails: \"Woooo! Who's there? Has anybody seen my LABEL?\""], ["me", "I'm not scared of a lunch tub! Okay, okay. MEDIUM scared!"]],

  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Jam jars! Hey, strawberries go IN jam. I'm not going in! Why are the jars rattling?"], ["n", "GLORP! A pot of Forgotten Soup bubbles in the boss room. Nobody's stirred it in YEARS!"], ["me", "Forgotten Soup? I'll remember you! Mostly 'cause you STINK! RAWR!"]],
  "w10-s3": [["me", "Old noodle boxes stacked taller than the House! Who ordered all this?"], [11, "Not me! Raptor Express only delivers HOT! Beep beep!"], ["me", "There's a Banquet Butler up top, so we'll deliver some STOMPS instead! RAWR!"]],
  "w10-s4": [[10, "Hmph. Strawberry. Last stray Crumblet in the whole House, out on Frost Drawer Falls. Walk it to the exit."], ["me", "The LAST one?! Gobzilla Large, babysitter class, FINAL mission! Hold my leaf, little guy!"], [10, "Large. I said it. Twice now."]],
  "w10-s6": [["me", "Ooh, party decorations! And a Recipe Scroll to grab before the monsters do!"], ["lo2", "Hah! 'Tis a party for the FORGOTTEN, berry! Fresh fruit not invited!"], ["me", "Then I'm crashing it! Crash-STOMP! RAWR!"]],
  "w10-s7": [[3, "Wibble wobble! Go, little berry! Psst, I'm inviting Old Fruitcake to dessert after! Shh!"], ["me", "Ooh, good idea! Okay, one last sponge bounce for one last key. BOING!"]],
  "w10-s8": [["me", "Every monster from every world is here! I just gotta hold out!"], ["foe", "Oi, Gobzilla! Back to back! Nobody beets us TOGETHER!"], ["me", "Brutus and Gobzilla, tag team! Stomp count, here we GO! RAWR!"]],
  "w10-s9": [["me", "Whoa, this table is SO long and SO empty. Not one snack on it!"], ["n", "From the cake-tin throne, a voice grumbles: \"Nobody ever comes to MY table, berry. Why would YOU?\""], ["me", "'Cause I'm hungry! And I'm LARGE! Almost! RAWR!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Stomp count: a LOT!", "Rawr! Rawr! RAWRRR!", "Gobzilla Medium combo!"],
  lowhp: ["I'm not scared! Medium scared!", "Ow! My seeds!", "Big brother, a little help?!"],
  perfect: ["Too small to hit! Hah!", "Missed me! Small is fast!", "Berry nimble!"],
  levelup: ["I grew! Gobzilla Medium-er!", "A whole seed bigger! Rawr!", "Level up! Tell big brother!"],
  secret: ["Ooh, treasure! Mine! Rawr!", "Big brother never found this!", "Shiny! A berry secret!"],
  boom: ["KA-BOOM! Did I do that?!", "Now THAT'S a jam session!", "Flat as a fruit roll-up!"],
  mimic: ["Bad lunchbox! No biting!", "Yikes! That box has TEETH!", "That's no snack! STOMP!"],
  objective: ["Mission stomped!", "Did ya see that, big brother?!", "Done! Real kaiju stuff!"],
};
