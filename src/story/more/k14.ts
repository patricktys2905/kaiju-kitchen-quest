// Salmonster: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop. Fresh out of the prep sink, taking the long way round.
  "w1-s2": [["me", "These crumbs are like gravel, bro. Perfect for a warm-up jog!"], ["n", "Jam Blobs and Moldy Buns everywhere! The portal wants their drops, and Sir Butterknife waits at the end!"], ["me", "A knight AND a workout? Let's GOOO!"]],
  "w1-s3": [["me", "Ugh, it's like swimming in syrup in here! Great leg day. Wait, I don't have legs."], ["me", "Sour Worms to farm, a lunchbox with TEETH, and the Rolling Pin Rogue at the end? Triple workout, bro!"]],
  "w1-s4": [[10, "Fish! Walk my Crumblet to the boss room, and watch the shadows. Things jump out round here."], ["me", "You got it, Coach! Little muffin, stay behind me. If anything jumps, I jump higher!"]],
  "w1-s6": [[11, "Beep beep! Coming through! Hey, fishy, you're running BACKWARDS!"], ["me", "Backwards is harder! Scroll's way up high. Grab it before time runs out, then the Toaster Tyrant! Let's GOOO!"]],
  "w1-s7": [["me", "Ah... AH-CHOO! Whoa, sneezed my lemon right off my head! Who peppered this place?"], ["me", "Sponge past the end of the map, chest way up high. BOING! Too easy. Next time I'm jumping without it."]],
  "w1-s8": [["foe", "Here, fishy fishy! I brought a whole swarm of hungry friends! Hold out, fishy, then you're LUNCH!"], ["me", "A swarm AND a King Pepper Grunt? Bring it, bro! Fins up! Let's GOOO!"]],
  "w1-s9": [["me", "Flame pillars! Hot hot HOT! Steamed salmon is NOT on the menu today, bro."], ["mold", "Hehehe... why swim so hard, little fishy? Just float down, down, down."], ["me", "Float DOWN? Bro, you don't know me at all."]],
  // World 2: The Fridge. Ice beds, lemon slices, a little homesick.
  "w2-s2": [["me", "Rivers of milk! Ooh, I'm gonna swim up that milk carton!"], ["n", "Melty Ice Pops drip everywhere! The portal wants their Popsicle Sticks, and an Ice Cube Ogre's waiting!"], ["me", "Ice? Bro, I grew up on ice! Let's GOOO!"]],
  "w2-s3": [["me", "Ice everywhere. Smells just like my old fish counter. I'm kinda homesick, bro."], ["me", "Fish Finger General up ahead? Fish FINGERS?! Okay, now it's personal! BONK!"]],
  "w2-s4": [[10, "It's cold out here, fish. Walk my Crumblet to the boss room, and keep it moving."], ["me", "Moving's my thing, Coach! Little muffin, let's do some laps. Hut, hut!"]],
  "w2-s6": [["me", "The recipe scroll's up on the egg carton cliffs, and there's a ladder round the side."], ["me", "Ladders are for quitters! Straight up the eggs, before time runs out! Let's GOOO!"]],
  "w2-s7": [["me", "This butter's slippy, like a wet rock in a river. I LIVE for wet rocks!"], ["me", "Key chest past the end of the map? Sponge time! BOING! Fridge key, bagged. O-fish-ally!"]],
  "w2-s8": [["foe", "Here, fishy fishy! I can SMELL ya! Hold out while my friends pile in, then dinner!"], ["me", "Pile in, bros! Then King Carrot Sniper! A river's got worse than this! Bring it!"]],
  "w2-s9": [["mold", "Hehehe... stay in the cold, little fish. Lie down on the ice. Just like the fish counter."], ["me", "Been there, done that, flopped outta there. Climbing!"]],
  // World 3: The Oven. Hot pans, a scary place for a salmon.
  "w3-s2": [["me", "Every step on this rack feels like a frying pan! Keep moving, keep moving!"], ["n", "FSSSH! A steam vent launches him up a whole platform!"], ["me", "Free ride? Pfft! I'll take the ladder! Casserole Commander, here I come! Upstream Leap!"]],
  "w3-s3": [["me", "Muffin tins as far as I can see. A maze? Salmon find their way home anywhere, bro."], ["me", "Pizza Peel Paladin at the end? Let's GOOO! Uh, which way's the end?"]],
  "w3-s4": [[10, "It's hot in here. Walk my Crumblet out, fish. Quick. QUICK."], ["me", "Quick is my middle name, Coach! Okay, my middle name is Steve. But QUICK!"]],
  "w3-s6": [[15, "S-S-Salmonster! The recipe scroll's way up high! A-and the cookie sheet's HOT!"], ["me", "Hotchog! Hot is great cardio, bro! Grab it before time runs out, then the Muffin Tin Mortar!"]],
  "w3-s7": [["me", "A roasting pan. For a SALMON. Nope! Nope nope nope!"], ["me", "Sponge past the end of the map, up to the key chest! BOING! Out of the pan and onto the ledge. Phew!"]],
  "w3-s8": [["foe", "Here, fishy fishy! Ooh, this pizza stone's nice and hot! Perfect for grilling ya!"], ["me", "Hold out on a hot stone? It's a sauna, bro. Then King Kettle Turret. Very sporty."]],
  "w3-s9": [["me", "It's all uphill from here! My favorite!"], ["mold", "Hehehe... why climb, little fishy? Everything ends at the bottom. The drain is waiting."], ["me", "The drain IS my plan, bro. Gingerbread Gladiator first. I'm taking the scenic route!"]],
  // World 4: The Pantry. Mountains of shelves, all uphill, all good.
  "w4-s2": [["me", "Cereal rapids! I'm swimming UP the cereal!"], ["n", "CLANG! Tin cans tumble off the shelf! And Flour Sack Sumo waits at the end!"], ["me", "Dodge drill! Crunch crunch! Let's GOOO!"]],
  "w4-s3": [["me", "Ugh, flour on a fish? Bro, that's how fish get FRIED!"], ["me", "A Cereal Box Colossus? The bigger the box, the better the workout! Batter luck next time, bro!"]],
  "w4-s4": [[10, "Cans keep falling in Tin Can Alley, fish. Walk my Crumblet gently. No laps."], ["me", "No laps? Okay, Coach. Little muffin, tiny steps. Tiny, sporty steps."]],
  "w4-s6": [["n", "Surprise! Monsters burst out from behind the spice jars!"], ["me", "An ambush? Love a surprise workout! Scroll's up top. Grab it before time runs out, GO!"]],
  "w4-s7": [[7, "Hrrm. Young salmon. An ancient proverb: the fish that swims upstream gets very, very tired."], ["me", "Tired is just WINNING slowly, Sensei!"], [7, "Hrrm. That is not the proverb. The sponge is over there."]],
  "w4-s8": [["foe", "Here, fishy fishy! Honey Hollow! Bears LOVE honey! Wait. Focus. FISH!"], ["me", "Hold out in sticky honey? Leg day AGAIN! Still no legs! Then King Raisin Sniper!"]],
  "w4-s9": [["me", "Sniff, sniff. I can smell the Sink from up here. Water!"], ["mold", "Drip, drip! The Chef is down MY drain, fishy. Come and get 'em. Hehehe!"], ["me", "I'm climbing up so I can go down. The hard way! It's tradition!"]],
  // World 5: The Sink. Real water at last, and a drain that only goes down.
  "w5-s2": [["me", "A water slide! It goes down, though. Ugh. FINE."], ["n", "Drip, drop! The taps are dripping, and a Sponge Golem waits at the bottom!"], ["me", "Okay, okay, downhill is fine TODAY! Plate Shards, let's GOOO!"]],
  "w5-s3": [["me", "Water! REAL water! Hey, gills, we're BACK!"], ["me", "Plunger Paladin? Bro, nobody plunges ME! And don't open that lunchbox. It's got TEETH!"]],
  "w5-s4": [[10, "My last Crumblet, fish. Get it past the dishes, and keep it dry. You're very splashy."], ["me", "Dry muffin, no splashing. Got it, Coach! Little muffin, ride on my lemon!"]],
  "w5-s6": [["me", "A whole bay full of bubbles! And the scroll's way up high. Love it!"], ["me", "Grab it before time runs out, then the Dish Soap Siren. Just keep swimming!"]],
  "w5-s7": [["me", "That's the drain, right there. Too close. Too easy. I'm going up first!"], ["me", "The last key's past the end of the map. BOING! Fins crossed!"]],
  "w5-s8": [["me", "Eww, grease! Grease on a fish is a big no-no, bro."], ["me", "Hold out, then King Grabby Glove! Scrub-a-dub-dub! Let's GOOO!"]],
  "w5-s9": [["mold", "Hehehe... down, down, little fishy. Everything flows DOWN. You can't fight the current forever."], ["me", "Fighting the current is my whole THING, bro!"]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Fancy! Little forks, little spoons. No fish knives, I hope."], ["n", "Fork Soldiers march across the placemats! The Gravy Boat Captain waits at the end!"], ["me", "Forks?! Near a FISH?! Okay, Fork Prongs, you're coming with me! Let's GOOO!"]],
  "w6-s3": [["me", "Hot wax! SPLAT! Ow! I'm a waxed salmon now. Shiny!"], ["me", "Teapot Tyrant up ahead? Bring the heat, bro! Pass the victory, please!"]],
  "w6-s4": [[10, "Fish! This Crumblet wants to see the world. Walk it past the gravy boats, would ya?"], ["me", "Gravy boats? I'll steer, Coach! Little muffin, all aboard the S.S. Salmon!"]],
  "w6-s6": [["me", "Teacups as big as swimming pools! And the scroll's way up high."], ["me", "Grab it before time runs out, beat the Candelabra Duchess, and NO hot-tub breaks. Okay, ONE."]],
  "w6-s7": [["me", "Napkins folded like swans? Show-offs."], ["me", "Key chest up high, here I come! BOING! Ten out of ten dive, bro!"]],
  "w6-s8": [["lo2", "Charge, my silverware! Fillet yon fishy!"], ["me", "FILLET?! Hold out, you forks! Then King Teapot Nanny! Fins up!"]],
  "w6-s9": [["me", "Up, up, UP a chandelier! Now THIS is my kinda climb!"], ["lo2", "Climb, fishy varlet! At the top, I shall serve thee on a cracker!"], ["me", "You're the cracker, bro! A stale one!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "I'm swimming up the hose! Against the flow! Let's GOOO!"], ["n", "BZZZ! Picnic Wasps! The portal wants their Stingers, and a Hot Coal Golem waits at the end!"], ["me", "Hot coals? For a FISH? Okay, that's the hard way even for me!"]],
  "w7-s3": [["n", "FSSSH! Sprinklers burst up all over the lawn!"], ["me", "WHOO! Sprinkler launch! Best ride ever!"], ["me", "Spatula Sheriff at the end? Flip THIS, bro!"]],
  "w7-s4": [[10, "Fish! This Crumblet wants to see the paddling pool. Walk it to the boss room. Dry."], ["me", "A POOL, and no swimming? Okay, Coach. That's the hardest way of all."]],
  "w7-s6": [[18, "In THIS corner! The fishiest fighter in the yard! SAL-MON-STERRR! Ding ding!"], ["me", "Velvaroo! Love the intro! Scroll's up high. Grab it before time runs out, GO!"]],
  "w7-s7": [["me", "Flowerpots stacked like a mountain? Mountains are my jam!"], ["me", "The key chest's way up high. BOING! Fine, I'll take the sponge. Just this once."]],
  "w7-s8": [["me", "Ice! Ahhh, that's cool on the gills."], ["lo2", "Forsooth! Baron Brussels shall grill thee medium rare, fish!"], ["me", "Rare? Sure am. Rare TALENT! Hold out, then King Corn Cob Cannon!"]],
  "w7-s9": [["me", "Hot coals, a Sauce Bandit, and a grill up top. *gulp*"], ["n", "From the grill, a voice booms: \"ATTEN-TION, fish! You'll be SIZZLED with a side of sprouts!\""], ["me", "Sizzle THIS! Uphill, the hard way! Let's GOOO!"]],
  // World 8: The Garden.
  "w8-s2": [["me", "Water pouring off the watering can! I'm swimming UP the stream!"], ["n", "SNAP! The Snapdragon waits at the end, and it looks hungry!"], ["me", "Bro, I'm NOT a snack! Mushroom Caps first! Let's GOOO!"]],
  "w8-s3": [["n", "POOF! A giant flower puffs a pollen cloud right at Salmonster!"], ["me", "AH-CHOO! Gills full of pollen! Gross, bro!"], ["me", "Watering Can Wizard? Turnip for the books, bro!"]],
  "w8-s4": [[10, "Fish! This Crumblet wants to see the pumpkins. Walk it to the boss room for me."], ["me", "Pumpkin patch tour, Coach! Little muffin, wave to the gourds!"]],
  "w8-s6": [[12, "Heyyy, duuude. Scroll's up the beanstalk. There's a ladder. Super easy."], ["me", "Sloba! A ladder? EASY? Pfft! I'm climbing the stalk. Grab it before time runs out! Let's GOOO!"]],
  "w8-s7": [["me", "Pee-yew! This compost smells like a fish counter on a Monday."], ["me", "Up the sponge to the key chest! BOING! Fresher air up here, bro."]],
  "w8-s8": [["lo2", "Ha! The Meatloaf shall stale thy whole Garden, fish! Thou reapest what thou sowest!"], ["me", "Reap THIS! Hold out by the scarecrow, then King Radish Bomber! Let's GOOO!"]],
  "w8-s9": [["me", "Steamy greenhouse! It's like a fish steamer. Ugh."], ["n", "From the heap, a voice rambles: \"Who goes there?! Wait, is that a FISH FINGER in me?\""], ["me", "A fish finger?! Hang on, little buddy! Climbing!"]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "Shopping carts zooming everywhere! I'm running UP the aisle!"], ["n", "RATTLE! Trolley Rammers come charging down the track!"], ["me", "Trolley Wheels, bagged! Then the Trolley Chariot! Clean-up on aisle two! Let's GOOO!"]],
  "w9-s3": [["me", "Boxes like skyscrapers! I used to dream about this view from the fish counter."], ["me", "Coupon Ghosts! Cash Register Golem! You monsters are way past your best before!"]],
  "w9-s4": [[10, "Fish! This Crumblet got lost in Fruit and Veg. Walk it to the boss room."], ["me", "My old neighbors! Little muffin, wave to the bananas. Not the bruised ones."]],
  "w9-s6": [[3, "Wibble wobble! Salmonster! The scroll's way up in the bakery! Can I come? Please? Pleeease?"], ["me", "Bloblin! Course you can! Grab it before time runs out, and cheer LOUD! Let's GOOO!"]],
  "w9-s7": [["me", "Canned TUNA. Hang in there, guys."], ["me", "The key chest's way up high. BOING! Key, bagged!"]],
  "w9-s8": [["foe", "Clean-up on aisle nine! Hold out, fishy! I'll bag the bad guys!"], ["me", "Grizzle! Okay, team! Then King Dented Can Turret! Check out THIS combo!"]],
  "w9-s9": [["me", "Brrr! Fish sticks in every box. Don't look, bro. Don't look."], ["n", "From the dark, a spooky voice wails: \"Woooo! Who's shopping in MY aisle? Woooo!\""], ["me", "A ghost tub, sitting on my crew's ice? Your expiry date's TODAY, bro!"]],
  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Backwards! Tail first! How'd I get so good at this?"], ["n", "Candied Peel Bats swoop between the jars! And the Forgotten Soup bubbles at the end!"], ["me", "Soup? FISH soup?! Okay, FORWARDS for this part! Let's GOOO!"]],
  "w10-s3": [["me", "Old takeaway boxes everywhere. Is that fish and chips? Don't look, bro. Don't look."], ["me", "Banquet Butler? I'm NOT on the menu, bro! You're all way past your sell-by!"]],
  "w10-s4": [[10, "This is my LAST Crumblet, fish. The very last one. Walk it out, and no laps."], ["me", "The last one? I got this, Coach! Little muffin, ride on my lemon. Final lap!"], [10, "Good fish. Don't let it go to your head."]],
  "w10-s6": [[11, "Beep beep! Fishy! Still running BACKWARDS?! Scroll's way up high! Clock's ticking!"], ["me", "Backwards is harder, Pizzaraptor! I'm climbing UP the party chains! Then the Pudding Juggernaut!"]],
  "w10-s7": [["me", "Old jars nobody's opened in years. Hang in there, guys."], ["me", "The last key's up on the high ledge. No sponge this time! Okay, ONE sponge. BOING!"]],
  "w10-s8": [["lo2", "Forsooth, fishy! The WHOLE army! Hold out if thou canst! Thou shalt be filleted!"], ["me", "A last stand? That's the fourth quarter, bro! Fins up! Let's GOOO!"]],
  "w10-s9": [["me", "Longest table I ever saw. It's like a river with no water. And a Fondue Fiend at the end."], ["n", "From the cake-tin throne, a grumpy voice booms: \"Bring me the fish! Every feast needs a FISH!\""], ["me", "Wrong fish, bro! Climbing! Uphill, obviously!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Let's GOOO! Combo!", "Fin, fin, FIN!", "Holy mackerel, what a streak!"],
  lowhp: ["Ow! Fish outta water here!", "I'm floundering, bro!", "Gills! Need! Water!"],
  perfect: ["Slippery! Can't catch me!", "Swam right past ya!", "Too fast, bro! Fin-tastic!"],
  levelup: ["Level up! O-fish-ally stronger!", "Gains! Fin gains!", "New personal best! Let's GOOO!"],
  secret: ["Ooh, treasure! Reel it in!", "Hidden loot! Fin-ders keepers!", "Holy mackerel, a goodie!"],
  boom: ["KA-BLAM! Made a splash!", "BOOM! Total wipeout!", "Bonk! Nothing but net!"],
  mimic: ["Whoa! The chest BITES!", "Bro, that box is hungry!", "Teeth?! I'm not BAIT!"],
  objective: ["Done! Let's GOOO!", "Goal! Fish-tastic!", "Nailed it! The hard way!"],
};
