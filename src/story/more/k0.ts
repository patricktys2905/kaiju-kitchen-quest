// Gobzilla Jr.: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Stomp count: twelve! Big brother would be at the Fridge by now. Show-off!"], ["me", "Ooh, a sponge up there! Boing boing! That's how little kaiju get tall. For like a second!"]],
  "w1-s3": [["n", "Uh-oh! Gummy Gully is wiggling, and it's NOT the gummies!"], ["me", "Whoa, that's a LOT of monsters! Finally, stuff my size to stomp! Rawr!"], ["me", "And a ladle lever up top! Yank it and the rolling pin goes SQUASH. I love rolling pins!"]],
  "w1-s4": [["n", "A teeny Crumblet peeks out from behind the toaster. Its blueberries are shaking!"], ["me", "Don't worry, little muffin! Stay behind me. I'm the big one here! ...Wait, am I?"], ["me", "YES I am! Rawr! Oh, and we stay away from the hissy pressure cookers, okay?"]],
  "w1-s6": [["me", "Recipe Scroll at the far end of the Spice Shelf! Seventy-five seconds, go go go!"], ["me", "Big brother says I'm all sugar and no spice. Hah! Watch me get SPICY!"]],
  "w1-s7": [["foe", "Psst, shrimp! I left a pal in Pepper Pass for ya. A BIG pal. Hah!"], ["me", "Brutus! Big pals fall over just like big bullies! KA-THUMP!"], ["me", "Plus there's a secret key way up high. Ugh, high is my worst direction!"]],
  "w1-s8": [["me", "Cutting Board Bluffs! Monsters in waves, and I gotta hang on for forty-five seconds!"], ["me", "Big brother can hold his breath that long. I can hold my GROUND! Hmm, sounded cooler in my head."]],
  "w1-s9": [["me", "Sniff sniff. Yuck! Smells like a whole breakfast went wrong up there!"], ["mold", "Hehehe! Come closer, tiny berry. Toast that sits out too long gets all fuzzy and green."], ["me", "I-I'm not scared! I'm MEDIUM scared! That's different!"]],

  // World 2: The Fridge
  "w2-s2": [["me", "Dairy Lane! Milk Carton Rammers, Yogurt Slimes... this whole street is past its date. Pee-yew!"], ["me", "Stomp count: two hundred and six! Big brother's gonna flip!"]],
  "w2-s3": [[11, "Beep beep! Hot pizza coming through! Heads up, kid, the lunchboxes in here BITE!"], ["me", "Thanks, Pizzaraptor! Um, how do I tip you?"], [11, "Stomp something big! I'll count it as five stars!"]],
  "w2-s4": [["n", "Click! The fridge light goes out on Pickle Jar Pier. A lost Crumblet whimpers. Uh-oh!"], ["me", "Eep! It's okay, little guy. I'm scared of the dark too. We'll be scared TOGETHER!"], ["me", "Hold my leaf. And if a pressure cooker hisses, we run the other way. Deal?"]],
  "w2-s6": [["me", "Recipe Scroll at the end of Egg Carton Cliffs! Grab it, then hang on for twenty-five seconds!"], ["me", "Twelve eggs and no time for egg jokes. Okay, ONE! Let's SCRAMBLE! Rawr!"]],
  "w2-s7": [["me", "Butter Bridge! Wheee, slippy-slidey! The secret key's up on a ledge somewhere."], ["me", "Big brother found a key once and lost it in the jam jar. I'm keeping mine in my leaves!"]],
  "w2-s8": [["n", "Ketchup Canyon is boiling over with monsters! Hold out for forty-five seconds!"], ["me", "Whoa! Somebody squeezed the bottle WAY too hard!"], ["me", "Eh, more monsters means more stomps! Stomp count, here I come!"]],
  "w2-s9": [["me", "Ice Tray Steps! Every step's a giant ice cube. Climbing like a giant kaiju! Hup! Hup!"], ["mold", "Hehehe! Climb, little berry. It's so cold up there. You'll stay fresh FOREVER."], ["me", "Hey! You're not the boss of my freshness!"]],

  // World 3: The Oven
  "w3-s2": [["me", "The Bottom Rack. Phew! My leaves are wilting into bangs. Do I look cool? I look cool."], ["me", "Stomp count: four hundred and, uh... something! Real kaiju lose count!"]],
  "w3-s3": [["n", "Uh-oh! Something big and hungry is hiding in the Muffin Tin Maze!"], ["me", "An ambush? Big brother ambushes me every breakfast! I'm SO ready!"], ["me", "And if a cereal box looks extra crunchy, it's a trap. A bitey trap!"]],
  "w3-s4": [[10, "Hmph. Got a stray Crumblet on these cliffs, strawberry. Walk it to the exit."], ["me", "Me?! Bluebeary trusts ME with a muffin?! Gobzilla Medium, babysitter class! Rawr!"], [10, "Mind the bubbling casseroles. And hold its hand. Hmph."]],
  "w3-s6": [["me", "Recipe Scroll's across the Cookie Sheet Plains! Grab it, then hold the line!"], ["mold", "Hehehe! The Crown has a recipe too, little berry. Step one: add YOU."], ["me", "Ew ew EW! Kaiju don't go in recipes! RAWR!"]],
  "w3-s7": [["me", "Roasting Pan Pass! Ladle lever on the ridge. Pull it and BONK goes the rolling pin!"], ["me", "Secret key's up high again. I used to need a step stool. Now I've got a sponge! Boing!"]],
  "w3-s8": [["me", "Pizza Stone Steppe! Ow ow ow, hot floor! Forty-five seconds of monster waves, let's GO!"], ["me", "Pressure cookers wanna go boom? Let's introduce 'em to the Sausage Rams! KA-BLAM!"]],
  "w3-s9": [["foe", "Oi, shrimp! Still climbing? The Grease Dragon's gonna spread you on toast like jam!"], ["me", "Then I'll be the spiciest jam he ever tasted, Brutus! Watch me!"]],

  // World 4: The Pantry
  "w4-s2": [["me", "Cereal Canyon! Big brother said cereal comes in boxes. He never said the boxes have TEETH!"], ["me", "And he never got THIS far. Ooh, this time I get to tell HIM the story!"]],
  "w4-s3": [["me", "Flour Drifts! Everything's white and poofy, like a giant pillow fight! Pfft, ptoo!"], ["me", "Lever, rolling pin, loads of flour... I'm gonna make the world's biggest monster pancake!"]],
  "w4-s4": [["n", "A Crumblet waves from behind a soup can. It's been waiting for someone big!"], ["me", "Someone big? Oh! Me? That's ME! Stay right behind me, little buddy!"], ["me", "Rule one: no hissy pots. Rule two: I'm super proud of rule one!"]],
  "w4-s6": [["n", "Flicker... CLICK! The pantry bulb goes out on Spice Rack Ridge!"], ["me", "Can't see the Recipe Scroll, but I can smell it! Paprika! Ah-CHOO!"], ["me", "Monsters get tougher in the dark? So do I! Pretty sure! Rawr?"]],
  "w4-s7": [["me", "Pasta Jar Peaks! Noodle Lurkers wiggling under the spaghetti. Gross AND spooky!"], ["me", "The last secret key's up there somewhere. Penne for your thoughts on where? Hehe!"]],
  "w4-s8": [["me", "Honey Hollow! Forty-five seconds of sticky waves. If I get stuck, I'll stomp in place!"], [8, "Small berry fight good! Me watch. Me cheer. GO BERRY GO!"]],
  "w4-s9": [["me", "The Top Shelf! Higher than big brother's EVER been! Whoa, don't look down!"], ["mold", "Hehehe! Climb all you like, little berry. Every road goes down... to the Sink."], ["me", "Then I'll stomp that jar and come down as Gobzilla MEDIUM! Final answer!"]],

  // World 5: The Sink.
  "w5-s2": [["me", "Suds Slide! Stomp count: a gazillion! Wait, why are the bubbles rumbling?"], ["n", "Uh-oh! A giant rolling pin comes tumbling down the suds!"], ["me", "I LOVE rolling pins! Just not from THIS side! Run run RUN!"]],
  "w5-s3": [["me", "Sponge Shoals! Gates locked, monsters coming. Time to get soap-er! I mean SUPER!"], ["me", "Ladle lever, rolling pin, SQUISH! I'm gonna wash these guys right outta my leaves!"]],
  "w5-s4": [[10, "Hmph. Strawberry. Stray Crumblet up on Dish Rack Ridge. You know the drill."], ["me", "Gobzilla Medium, babysitter class, back on duty! Hold my leaf, little guy. Plates are slippy!"], [10, "You're getting good at this. Don't let it go to your leaves. Hmph."]],
  "w5-s6": [["me", "Bubble Bay! Recipe Scroll way out at the far end. Conveyor belts? Free rides! Wheee!"], ["me", "Pop! Pop! Big brother says bubbles are for babies. Big brother's not HERE! Pop!"]],
  "w5-s7": [["me", "Plughole Pass! Secret chest on a high ledge. High is STILL my worst direction."], ["me", "But I've got a bouncy sponge and a big RAWR! Boing! Up goes the World 5 key!"]],
  "w5-s8": [["me", "Greasy Pan Pits! Forty-five seconds of waves. Ew, nobody washed these pans EVER!"], ["foe", "Psst, shrimp. Er, Gobzilla. Lure 'em under the drippy taps. SPLOOSH! Not that I care!"], ["me", "Brutus is HELPING?! Wait till big brother hears THIS!"]],
  "w5-s9": [["me", "Drain Descent. It's dark. Stomp count? Who's counting? Not me. Too busy being brave."], ["mold", "Hehehe... closer, little berry. Everything goes down the drain sooner or later. Even little brothers."], ["me", "Not THIS little brother! I'm the MEDIUM one! RAWR!"]],

  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Placemat Plains! Stomp count: one! Two! Wait, why's the whole table shaking?"], ["n", "Uh-oh! A giant rolling pin comes rumbling across the placemats!"], ["me", "Rolling pins are my BEST friends! Just not when they're chasing me! RUN!"]],
  "w6-s3": [["me", "Candelabra Crossing! These candles are taller than lighthouses! Ow, hot wax! Drip drip SPLAT!"], ["me", "Lever up top? Pull it and the pin goes SQUASH. Some things never change! Rawr!"]],
  "w6-s4": [[10, "Hmph. Strawberry. One of mine wandered off to see the world. Gravy Boat Bay's no place for it."], ["me", "Gobzilla Medium, babysitter class, on tour! Hold my leaf, little guy. Mind the gravy!"], [10, "Wanted a big adventure. Like somebody I know. Hmph."]],
  "w6-s6": [["me", "Teacup Terrace! Recipe Scroll at the far end. Grab it, then hold out! Pinkies up!"], ["lo2", "Forsooth! A berry at the tea party? Mind thy manners, peasant!"], ["me", "My manners say STOMP! Rawr!"]],
  "w6-s7": [["me", "Napkin Fold Fort! Secret chest way up high. High is STILL my worst direction!"], ["me", "Good thing sponges come free with dinner. Boing! World 6 key, pass it over!"]],
  "w6-s8": [["me", "Silverware Siege! The whole cutlery drawer wants a piece of me! Forty-five seconds, go!"], ["foe", "Oi, Gobzilla! Lure 'em under the candles! Hot wax makes 'em SPLAT! Not that I'm watching!"], ["me", "Brutus is my biggest fan now! Stomp count, here we GO!"]],
  "w6-s9": [["me", "Chandelier Climb! Whoa, it's like a sparkly upside-down tree!"], ["lo2", "Hah! Climb, little crumb! At the Head of the Table, thou shalt be DESSERT!"], ["me", "Dessert?! I'm the MAIN COURSE! Wait, no. I'm the HERO!"]],

  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "Hose Highway! Stomp count: one, two... hey, why's the hose wiggling?"], ["n", "Uh-oh! A giant rolling pin comes bouncing down the hose!"], ["me", "A rolling pin at a BBQ?! Somebody wants to make a burger outta ME! RUN!"]],
  "w7-s3": [["me", "Sprinkler Springs! FWOOSH! Whoa, I'm flying! Gobzilla Large is also Gobzilla AIRBORNE!"], ["me", "Lever up top drops a rolling pin. Squash 'em flat as burger patties! RAWR!"]],
  "w7-s4": [[10, "Hmph. Strawberry. Stray Crumblet out on Paddling Pool Pier. Walk it to the exit."], ["me", "Gobzilla Medium, babysitter class, poolside edition! Hold my leaf, and no cannonballs!"], [10, "Watch the sprinklers. And the wasps. And the kid. Mostly the kid. Hmph."]],
  "w7-s6": [["me", "Picnic Table Peak! Recipe Scroll at the far end, then hold out! Ooh, a potato salad mountain!"], ["lo2", "Hah! Baron Brussels shall cook thee WELL DONE, berry!"], ["me", "Well done? Aw, thanks! I DID do well! RAWR!"]],
  "w7-s7": [["me", "Flowerpot Fort! Secret chest on a high ledge. High is STILL my worst direction!"], [9, "Ooh, a little strawberry! Elephants never forget a face! *POP* Um, have we met?"], ["me", "Not yet! I'm Gobzilla Large! Almost! Boing! World 7 key, you're mine!"]],
  "w7-s8": [["me", "Cooler Canyon! Forty-five seconds of monster waves. Brrr, it's like the Fridge all over again!"], [18, "In THIS corner, the teeny strawberry with the great big RAWR! Ding ding! Give 'em the old one-two!"], ["me", "One-two STOMP! Stomp count, here I come!"]],
  "w7-s9": [["me", "Charcoal Climb! Ow ow, hot rocks! Charcoal Imps keep popping up like toast!"], ["n", "From the Grill Summit, a voice booms: \"ATTEN-TION, berry! Report for sprout inspection!\""], ["me", "Nope! Big brother says strawberries are DESSERT! RAWR!"]],

  // World 8: The Garden.
  "w8-s2": [["me", "Watering Can Run! Stomp count: one, two... why's the ground going rumble-rumble?"], ["n", "Uh-oh! A giant rolling pin comes tumbling off the watering can!"], ["me", "Who brings a rolling pin to a GARDEN?! Run, berry, RUN!"]],
  "w8-s3": [["me", "Sunflower Grove! ACHOO! These flowers keep sneezing pollen on me! Bless YOU! Wait, bless ME!"], ["me", "Lever up top drops a rolling pin. Squash 'em flat as pressed flowers! RAWR!"]],
  "w8-s4": [[10, "Hmph. Strawberry. Stray Crumblet hiding in the Pumpkin Patch. Walk it to the exit."], ["me", "Gobzilla Medium, babysitter class, garden edition! Hold my leaf, little guy. Watch out for Potato Moles!"], [10, "Medium? Looks more like Large to me. Don't let it go to your leaves. Hmph."]],
  "w8-s6": [["me", "Beanstalk Heights! Recipe Scroll way up top. High is STILL my worst direction!"], ["lo2", "Hah! Climb, berry! The Meatloaf shall serve thee as a GARNISH!"], ["me", "Garnish is the teeny leaf on the side! I'm a WHOLE berry! RAWR!"]],
  "w8-s7": [["me", "Compost Keep! Pee-yew! Smells like big brother's sneakers! Secret chest on a high ledge, too."], [12, "Heyyy, little dude. *yaaawn* Compost is old snacks growin' into new snacks. Pretty rad."], ["me", "Whoa, that's deep! Okay, BOING! World 8 key, you're mine!"]],
  "w8-s8": [["me", "Scarecrow Stand! Forty-five seconds of waves! Hey, Mr. Scarecrow, I'm not scared either!"], [16, "Stay frosty, little dude. Is that sun hot? I'm not melting. Am I melting?"], ["me", "Stand in my shadow! It's LARGE now! RAWR!"]],
  "w8-s9": [["me", "Greenhouse Steps! Whoa, glass everywhere! Lookin' LARGE in that reflection, Gobzilla!"], ["n", "From the Mystery Heap, a voice rumbles: \"Is that a berry? Am I PART berry?! Lemme check!\""], ["me", "Nope! You're not getting any of THIS berry! RAWR!"]],

  // World 9: The Supermarket.
  "w9-s2": [["me", "Trolley Track! Stomp count: one, two... why are the shopping trolleys rattling?"], ["n", "Uh-oh! A giant rolling pin comes rumbling down the aisle!"], ["me", "Rolling pins aren't even ON the shopping list! Run, berry, RUN!"]],
  "w9-s3": [["me", "Cereal Aisle! Big brother's Choco Crunch Bombs! These boxes are taller than his whole BED!"], ["me", "Lever up top drops a rolling pin. Squash 'em flat as cornflakes! RAWR!"]],
  "w9-s4": [[10, "Hmph. Strawberry. Stray Crumblet in Fruit and Veg. Thinks it's a blueberry. Walk it to the exit."], ["me", "Gobzilla Medium, babysitter class, grocery edition! Hold my leaf, little guy. No hiding with the grapes!"], [10, "Large. You're Large now. Don't make me say it twice. Hmph."]],
  "w9-s6": [["me", "Bakery Bluff! Recipe Scroll at the far end, then hold out! Whoa, these donuts are bigger than ME!"], ["lo2", "Hah! Fresh bread is for PEASANTS, berry! Day-old is VINTAGE!"], ["me", "Day-old? You're like YEAR-old, buddy! RAWR!"]],
  "w9-s7": [["me", "Canned Goods Keep! Secret chest on a high ledge. High is STILL my worst direction!"], [3, "Wibble wobble! Go, go, little berry! Gimme an S! Gimme a T! Gimme... um, a sponge?"], ["me", "Got one! BOING! World 9 key, check it OUT! Get it? Check out? Hehe!"]],
  "w9-s8": [["me", "Checkout Chaos! Forty-five seconds of waves on a giant conveyor belt! Beep, beep, BEEP!"], [14, "Let's GOOO, little dude! Stomp against the belt! That's how ya get o-fish-ally strong!"], ["me", "Stomping uphill on a treadmill! Stomp count, here I come! RAWR!"]],
  "w9-s9": [["me", "The Frozen Aisle! Brrr! My leaves are shivering AGAIN! Anybody got a scarf? Still no?"], ["n", "From the Back Aisle, a spooky voice wails: \"Woooo! Who's there? Has anybody seen my LABEL?\""], ["me", "I'm not scared of a lunch tub! Okay, okay. MEDIUM scared!"]],

  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Jam Jar Junction! Stomp count: one, two... why are the jam jars rattling?"], ["n", "Uh-oh! A giant rolling pin comes rumbling off the top shelf!"], ["me", "Strawberries go IN jam, not UNDER rolling pins! Run, berry, RUN!"]],
  "w10-s3": [["me", "Takeaway Towers! Old noodle boxes stacked taller than the House! Who ordered all this?"], [11, "Not me! Raptor Express only delivers HOT! Beep beep!"], ["me", "Lever up top drops a rolling pin. Squash 'em flat as takeaway menus! RAWR!"]],
  "w10-s4": [[10, "Hmph. Strawberry. Last stray Crumblet in the whole House, out on Frost Drawer Falls. Walk it to the exit."], ["me", "The LAST one?! Gobzilla Large, babysitter class, FINAL edition! Hold my leaf, little guy!"], [10, "Large. I said it. Twice now. Hmph."]],
  "w10-s6": [["me", "Paper Chain Pass! Recipe Scroll at the far end, then hold out! Ooh, party decorations!"], ["lo2", "Hah! 'Tis a party for the FORGOTTEN, berry! Fresh fruit not invited!"], ["me", "Then I'm crashing it! Crash-STOMP! RAWR!"]],
  "w10-s7": [["me", "The Forgotten Shelf! The final key's on a high ledge. High is STILL my worst direction!"], [3, "Wibble wobble! Go, little berry! Psst, I'm inviting Old Fruitcake to dessert after! Shh!"], ["me", "Ooh, good idea! BOING! Last key, you're MINE!"]],
  "w10-s8": [["me", "The Last Stand! Forty-five seconds, and every monster from every world is here!"], ["foe", "Oi, Gobzilla! Back to back! Nobody beets us TOGETHER!"], ["me", "Brutus and Gobzilla, tag team! Stomp count, here we GO! RAWR!"]],
  "w10-s9": [["me", "The Long Table! Whoa, it's SO long and SO empty. Not one snack on it!"], ["n", "From the cake-tin throne, a voice grumbles: \"Nobody ever comes to MY table, berry. Why would YOU?\""], ["me", "'Cause I'm hungry! And I'm LARGE! Almost! RAWR!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Stomp count: a LOT!", "Rawr! Rawr! RAWRRR!", "Gobzilla Medium combo!"],
  lowhp: ["Not scared! ...Medium scared!", "Ow! My seeds!", "Big brother, a little help?!"],
  perfect: ["Too small to hit! Hah!", "Missed me! Small is fast!", "Berry nimble!"],
  levelup: ["I grew! Gobzilla Medium-er!", "A whole seed bigger! Rawr!", "Level up! Tell big brother!"],
  secret: ["Ooh, treasure! Mine! Rawr!", "Big brother never found this!", "Shiny! Berry secret!"],
  boom: ["KA-BOOM! Did I do that?!", "Now THAT'S a jam session!", "Flat as a fruit roll-up!"],
  mimic: ["Bad lunchbox! No biting!", "Yikes! That box has TEETH!", "That's no snack! STOMP!"],
  objective: ["Mission stomped!", "Did ya see, big brother?!", "Done! Real kaiju stuff!"],
};
