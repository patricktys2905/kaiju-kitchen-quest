// Hotchog: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop. Practice round, lots of apologising.
  "w1-s2": [["me", "C-crumbs everywhere! A champion keeps a clean grill... and a clean countertop!"], ["me", "I'll tidy up right after I bonk those Moldy Buns for their crusts. S-sorry in advance, buns!"]],
  "w1-s3": [["me", "Eep! S-sour worms! They look so grumpy. Sorry about whatever happened to you!"], ["n", "Psst! The Rolling Pin Rogue waits at the end. And one lunchbox in here has TEETH."], ["me", "T-teeth?! Sorry, lunchbox, but a champion checks EVERY box! C-carefully!"]],
  "w1-s4": [["n", "Aww! A tiny Crumblet pops out from behind the toaster and grabs Hotchog's tail!"], ["me", "Oh! H-h-hi! I'm Hotchog. Watch the spikes! King Sour Worm's at the end, so stay close, okay?"]],
  "w1-s6": [["me", "The Chef's Recipe Scroll?! Maybe it's got the s-secret sauce! I'll grab it before time runs out!"], ["me", "Ooh, paprika! And smoky salt! No, no, focus, Hotchog! Seasoning comes AFTER the fight!"]],
  "w1-s7": [["me", "P-Pepper Pass! I use pepper for grilling, n-not for fighting! Ah-CHOO!"], ["me", "A key hidden past the end of the map? A ch-champion would check the sponges. BOING!"]],
  "w1-s8": [["n", "Rumble rumble! Monsters pour over the cutting board from every side!"], ["me", "S-s-so many! Grill rule number one: hold your ground and don't flip too early!"], ["me", "Then King Pepper Grunt gets one perfect sear!"]],
  "w1-s9": [["foe", "Hah! Burners, sausage! Flame pillars! Real champions grill on these. Try not to get charred!"], ["me", "I l-like a little char, Captain. It's called FLAVOUR!"]],
  // World 2: The Fridge. Out of his element, but making a guest list.
  "w2-s2": [["me", "Dairy Lane! For the cookout I'll need cheese slices. Lotsa cheese slices!"], ["me", "Shopping list: Cheese Crumbs, Carton Horns, and \"d-don't get squished by the Ice Cube Ogre.\""]],
  "w2-s3": [["me", "Brrr! My spikes have frost on 'em! I'm a hot dog on a p-p-popsicle stick!"], ["me", "Um, that lunchbox is l-looking at me. Is it looking at me? It's TOTALLY looking at me!"]],
  "w2-s4": [["me", "Another lost Crumblet? Hi, little guy! Walk next to me. Not TOO close. Spikes!"], ["n", "Uh-oh! Something big and briny lurks under the pier!"], ["me", "S-stay behind me! A champion protects the crowd!"]],
  "w2-s6": [["me", "Recipe Scroll way up high! If it's the secret sauce, I'm gonna cry. Happy cry!"], ["me", "Gotta grab it before time runs out, just like a grill timer! Ding! I LOVE a grill timer!"]],
  "w2-s7": [["me", "Whoa, Butter Bridge! Super slippery. Super good for basting, though!"], [17, "Wheee! Hi, Hotchog! Coming through! Chest's up past the sponge, by the way! Byeee!"], ["me", "Th-thanks, Pengwhip! How does anybody slide that good?!"]],
  "w2-s8": [["me", "Ketchup Canyon! I'm more of a mustard guy, but I won't be rude about it."], ["me", "Hold out while they pour in. Like waiting for the coals to go white. Patience, Hotchog!"]],
  "w2-s9": [["n", "Brrr! The Ice Tray Steps glitter all the way up to the Leftover Lasagna Lich!"], ["mold", "Shhh, little sausage. Cold and dark keeps meat fresh... forever. Hehehe!"], ["me", "N-nope! I'm a hot dog! Emphasis on HOT!"]],
  // World 3: The Oven. His element. The stammer starts to fade.
  "w3-s2": [["me", "The Oven! Sniff sniff! It smells like every cookout I ever dreamed about!"], ["me", "Bottom rack, lowest heat! A champion starts slow and builds up to the Casserole Commander. Let's go!"]],
  "w3-s3": [["me", "Muffin tins! If a Crumblet gets lost in here, it's gonna be a looong day."], ["me", "Pizza Peel Paladin at the end? Spotted! And that box over there? VERY suspicious."]],
  "w3-s4": [["me", "There you are, little Crumblet! It's hot in here, so stick by me. The not-spiky side!"], ["me", "Steam vents launch ya sky-high, so hold on tight! King Popcorn Popper's at the end. Like popcorn, but rude!"]],
  "w3-s6": [["n", "Whoa! The cookie sheet is packed edge to edge with monsters. A full batch!"], ["me", "I've cooked FOR a crowd before. Never AGAINST one!"], ["me", "Grab the scroll before time runs out. Spikes up!"]],
  "w3-s7": [["me", "Chocomunch! You look kinda glossy. I'll fan you with my spikes! Whoosh whoosh!"], [8, "Spikes bad fan. Spikes good try! Thank you, friend!"], ["me", "Anytime! Low and slow is for roasts. Me? I'm going high and fast to that key chest!"]],
  "w3-s8": [["me", "A pizza stone! Hottest spot in the kitchen! Now THIS is my kinda place!"], ["me", "Holding out on high heat, folks, and he won't even FLIP! King Kettle Turret, you're next!"]],
  "w3-s9": [["foe", "Broiler Peak's right above us, kid. Still think you can take MY grill?"], ["me", "It's everybody's grill, Captain! And here I come!"]],
  // World 4: The Pantry. Hunting the secret sauce, inviting everyone.
  "w4-s2": [["me", "The Pantry! The Chef's secret sauce is somewhere in here. I can almost taste it! Mmm!"], ["me", "Whoa, tin cans falling everywhere! Breakfast is attacking! I'm more of a lunch dog."]],
  "w4-s3": [["me", "Flour drifts? Pfft. At a cookout we call that \"unseasoned\"!"], ["me", "Cereal Box Colossus at the end? Let's dust 'em off and season 'em up!"]],
  "w4-s4": [["me", "Hey, little Crumblet! Wanna be my first guest at the cookout? Then stay close!"], ["me", "And watch for falling cans. They're grumpier than Captain Kebab!"]],
  "w4-s6": [["me", "Spice Rack Ridge! The sauce recipe could be up here! Ooh, smoky paprika! Brown sugar!"], ["me", "Focus! Grab the scroll before time runs out. Happy dance later!"]],
  "w4-s7": [[11, "Beep beep! Special delivery for one shy hedgehog: a hot tip! Key chest's past the sponge!"], ["me", "W-wow, thanks! Hey, are you coming to the cookout?"], [11, "Is there pizza? Then I'm already there! Zoom!"]],
  "w4-s8": [["n", "Drip drip! Honey oozes off the shelves, and a sticky swarm of monsters with it!"], ["me", "Ooh, honey glaze! Thanks for the idea! Now everybody line up for the grill!"], ["me", "I waited a whole year for this cookout. I can hold out a little longer!"]],
  "w4-s9": [["me", "Top shelf! The Cookie Vault's right up there, and the recipe with it!"], ["me", "Last year I couldn't even say hi without stammering. Watch this! HELLO, TOP SHELF!"]],
  // World 5: The Sink. The Champion cleans up. Stammer nearly gone.
  "w5-s2": [["me", "Uh, folks? The taps are dripping, and the Suds Slide is packed with Crusty Plate Knights!"], ["me", "Hotchog breaks from the pack! Plate Shards, Soap Bubbles, then a Sponge Golem! Look at those little legs go!"]],
  "w5-s3": [["me", "Sponge Shoals! I scrub my grill with these. I never knew monsters lived inside 'em! Ew!"], ["me", "Plunger Paladin at the end, and a lunchbox with TEETH. Wanna bet that's a trap? I'm not opening it!"]],
  "w5-s4": [[10, "Hmph. Hotchog. My last Crumblet. Walk it through the dish rack. Spikes pointed AWAY."], ["me", "You got it, Mr. Bluebeary! One VIP pass to the cookout, coming right up!"]],
  "w5-s6": [["me", "Bubble Bay! The scroll's way up high, and the Dish Soap Siren's singing at the end!"], ["me", "Gotta grab it before time runs out, folks! Ding ding! Let's GO!"]],
  "w5-s7": [["me", "Plughole Pass! Careful, everybody. Nobody drop the ketchup down there."], ["me", "That chest's way up high, but I bet that squishy sponge gives a champion a boost! BOING!"]],
  "w5-s8": [["me", "Greasy Pan Pits! Somebody forgot to wash up after the cookout. Was it me? It was me. Sorry!"], [7, "Hrrm! Young champion! Your grill still burns with my flame. Shall we hold the line, side by side?"], ["me", "Side by side, Mr. Norigon! Light 'em up! Then King Grabby Glove!"]],
  "w5-s9": [["mold", "Hehehe... cookouts end, little sausage. Everybody goes home, and you're all alone with the dishes."], ["me", "Nope! After a cookout, everybody helps with the dishes. That's the best part!"], ["me", "Well, second-best. After the burgers."]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["n", "Uh-oh! Fork Soldiers march across the Placemat Plains!"], ["me", "Forks on the field, folks! And the Gravy Boat Captain waits at the end! Hotchog takes the outside lane!"]],
  "w6-s3": [["me", "Whoa, candelabras! Hot wax dripping everywhere. Watch your step, folks. Sticky!"], ["me", "Teapot Tyrant at the end, folks! And a lunchbox that bites! Watch the wax AND the teeth!"]],
  "w6-s4": [[10, "Hmph. This Crumblet wants to see the world, sausage. Get it past the gravy boats in one piece."], ["me", "You got it, Mr. Bluebeary! Little buddy, gravy is a topping, not a swimming pool!"]],
  "w6-s6": [["me", "Teacup Terrace! Pinkies up, folks! The scroll's way up high."], ["me", "Candelabra Duchess at the end? Grab the scroll before time runs out, then light her up!"]],
  "w6-s7": [["me", "Napkin Fold Fort! Somebody folded these into swans. Show-offs!"], ["me", "Ooh, a chest on the top fold! I'll take the sponge express. BOING!"]],
  "w6-s8": [["lo2", "Charge, my silverware! Skewer yon sausage!"], ["me", "Skewers? Pal, I've grilled with Captain Kebab! Hold the line, then King Teapot Nanny! Bring it on!"]],
  "w6-s9": [["lo2", "Forsooth! A hot dog climbs my chandelier! Thou art not even FANCY, varlet!"], ["me", "Fancy? I'm the Grill Champion! Next up, folks, the main event!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "Folks, I hear buzzing on the Hose Highway. Please don't be wasps. Please don't be wasps..."], ["n", "It's wasps!"], ["me", "Picnic Wasps, folks! The portal wants their Stingers, and a Hot Coal Golem waits at the end! GO!"]],
  "w7-s3": [["n", "FSSSH! The sprinklers burst up and soak the whole place!"], ["me", "Aw, my poor coals! Ahem. The Spatula Sheriff waits at the end, folks. A spatula! My people!"]],
  "w7-s4": [[10, "Hmph. This Crumblet's never been to a pool party. Get it past the pier, and no poking it with those spikes."], ["me", "One VIP pass to the pool party, Mr. Bluebeary! Little buddy, no cannonballs till after lunch!"]],
  "w7-s6": [["me", "Picnic Table Peak! Checkered tablecloth, folks, the classic cookout look!"], ["me", "Scroll's up top! Grab it in time, and keep those wasps off the potato salad!"]],
  "w7-s7": [[18, "In THIS corner! Hey, Champ! Key chest's on the high ledge. Ding ding, go get it!"], ["me", "W-wow, Velvaroo! Wanna come to the cookout?"], [18, "Is there a bake sale? Kidding! I'll bring cupcakes! HOP!"]],
  "w7-s8": [["me", "Cooler Canyon! Every cookout needs drinks on ice. The Freezer Golem would LOVE it here!"], ["me", "Hold the line, folks! Then King Corn Cob Cannon! Let's sear it!"]],
  "w7-s9": [["n", "From the summit, a voice booms: \"ATTEN-TION! Sprouts, turn the grill to MAXIMUM!\""], ["me", "MAXIMUM?! You'll burn everything! Folks, this is a grilling emergency! Here I come!"]],
  // World 8: The Garden.
  "w8-s2": [["me", "Watering Can Run! Folks, I've got a bad feeling about that spout..."], ["n", "SNAP! The Snapdragon waits at the end, and it's extra snappy!"], ["me", "Called it! Mushroom Caps first, folks! The Champion digs deep!"]],
  "w8-s3": [["n", "POOF! The sunflowers puff pollen everywhere!"], ["me", "Ah-CHOO! That's a pollen penalty! Somebody get me a tissue! Watering Can Wizard, I'm coming!"]],
  "w8-s4": [[10, "Hmph. Hotchog. This one's never seen a pumpkin patch. Boss room's that way. Don't let it climb anything."], ["me", "One VIP pass to the Garden, Mr. Bluebeary! Little buddy, pumpkins are for pie, not for climbing!"]],
  "w8-s6": [["me", "Beanstalk Heights! Green beans, folks, the perfect cookout side! The scroll's at the top!"], ["me", "Grab it in time, then the Gnome General! Let's go, Champion. Beans mean business!"]],
  "w8-s7": [[12, "Heyyy, duuude... *yaaawn* Key chest's on the high ledge. Boing boing, or whatever."], ["me", "Th-thanks, Sloba! Wanna come to the cookout? There's bubble tea!"], [12, "No pressure, just tea-sure. Zzz."]],
  "w8-s8": [["me", "Scarecrow Stand! Folks, he's wearing a BBQ apron! Now THAT'S a scarecrow with style!"], ["me", "Hold the line, beat King Radish Bomber, then corn on the cob for everybody!"]],
  "w8-s9": [["n", "From the greenhouse, a lumpy voice mumbles: \"Huh! Is that a PEA in me? Or a button? WHO AM I?\""], ["me", "Mystery meat, folks! The Champion has grilled worse. I think. Here I come!"]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "Trolley Track! I always wanted to race a shopping cart. Wait, what's THAT coming down lane one?"], ["me", "Trolley Rammers, folks! The portal wants their wheels, and the Trolley Chariot waits at the end! RUN!"]],
  "w9-s3": [["me", "The Cereal Aisle, folks! Crunchy, sugary, and not one bit grillable. Tough crowd!"], ["me", "Coupon Ghosts, folks! And a Cash Register Golem! Ring 'em up, and the crowd goes wild!"]],
  "w9-s4": [[10, "Hmph. Found this one in the bananas. Walk it to the boss room. Gently, sausage."], ["me", "One VIP pass to produce, Mr. Bluebeary! Little buddy, grilled pineapple is a thing. Trust me!"]],
  "w9-s6": [["me", "Bakery Bluff! BUNS, folks! Racks and racks of buns! I-I think I'm gonna cry. Happy cry!"], ["me", "Focus! Grab the scroll in time! Price Gun Paladin, I'm NOT on sale! THEN bun shopping!"]],
  "w9-s7": [[3, "Wibble wobble! Hi, Champ! Key chest's up high! Um, will there be a dessert table at your cookout?"], ["me", "A d-dessert table? Folks, there WILL be one, and you're invited! Front row!"], [3, "EEEE! Invited! That's the jiggle of it! Go boing, Champ!"]],
  "w9-s8": [["lo2", "Hold out at the checkout, sausage? I shall bag thee and sell thee, two for one!"], ["me", "Two for one? Folks, I'm a PREMIUM sausage! Hold the line, then King Dented Can Turret! Ring 'em up!"]],
  "w9-s9": [["n", "From the Frozen Aisle, a spooky voice wails: \"Woooo! Who goes there? Nobody EVER opens meee!\""], ["me", "B-b-brrr! Folks, it's cold in here! Ahem. Freezer burn is no match for a HOT dog! Here I come!"]],
  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Jam Jar Junction! Folks, you know what's coming. One last time!"], ["n", "Candied Peel Bats swoop out of the jam jars, sticky and determined!"], ["me", "Final lap! Then the Forgotten Soup! Nobody forgets a soup at MY cookout! RUN!"]],
  "w10-s3": [["me", "Takeaway Towers, folks! Noodle boxes, curry tubs, and a fortune cookie! It says..."], ["me", "\"You will win a big feast-off.\" HA! I KNEW it! Banquet Butler, set a place for me!"]],
  "w10-s4": [[10, "Hmph. Hotchog. My LAST Crumblet. The very last one. Get it down Frost Drawer Falls. Spikes AWAY."], ["me", "The final VIP pass, Mr. Bluebeary! Little buddy, you get a front row seat at the feast. Promise!"], [10, "It's wearing a tiny party hat. Don't look at me. It's the frost, okay?"]],
  "w10-s6": [["me", "Paper Chain Pass! Folks, these decorations are older than Sir Stale. And twice as dusty!"], ["me", "The LAST Recipe Scroll! Grab it in time, beat the Pudding Juggernaut, and save these streamers for the party!"]],
  "w10-s7": [[3, "Wibble wobble! Champ! The last key chest is up high! Is the dessert table still on?"], ["me", "Still on, Bloblin! Folks, it's the BIGGEST dessert table in history! Sponge, BOING!"]],
  "w10-s8": [["lo2", "Hold out one last time, sausage? Thy buns shall go as stale as MINE!"], ["me", "Stale buns? Pal, we TOAST 'em! Hold the line, folks, then you're coming to dinner too!"]],
  "w10-s9": [["n", "A grumpy old voice booms down the long, empty table: \"A cookout? HERE? Nobody feasts in MY Fridge!\""], ["me", "Folks, look at that table! Not one plate! Just a Fondue Fiend! That's a foul if I ever saw one!"], ["me", "It's the feast-off finals! The Champion's coming in HOT! Here I come!"]],

  // World 11: The Midway.
  "w11-s2": [["me", "Guess-your-weight, folks! The Champion steps on the scale, and it says ELEPHANT! Hey! Somebody's got a thumb on it!"], ["me", "And at the end of the boulevard, a Pretzel Contortionist posing in a knot! Frank-ly, folks, that's just showing off. Ding ding!"]],
  "w11-s3": [["me", "Folks, the Champion lines up his ring toss! It's up, it's good, it... bounced off! That peg's wearing a HAT!"], ["me", "And the prize box just BIT the referee! Whack-a-Churros underfoot, and a Gumball Gunner up next. Ka-Chunk? Ka-SIZZLE!"]],
  "w11-s4": [[10, "Hmph. Hotchog. One of mine followed the smell of a grill into the crowd. Found it. Walk it to the exit. Spikes AWAY."], ["me", "One VIP pass to the exit, Mr. Bluebeary! Little buddy, stay on my not-spiky side. Those Bumper Cupcakes are ALL over the road!"], [10, "It's cheering for you in a teeny voice. Don't look at me. It's the sawdust, okay?"]],
  "w11-s6": [["me", "Folks, a Recipe Scroll on the top prize shelf by the helter-skelter, and the clock is ON! The Champion loves a timer! Ding!"], ["me", "Who's yelling \"Order Up!\" up there? A Fry Basket Brawler! Deep-fried, at MY festival? Pal, we GRILL around here! Let's GO!"]],
  "w11-s7": [["me", "Folks, in this mirror I'm a FOOT-LONG! In that one I'm a cocktail sausage. The judges will take the first one, thank you!"], ["me", "Key chest up on a ledge, and a Carousel Macaron Pony prancing in circles! The Champion saddles up, folks! BOING!"]],
  "w11-s8": [["lo2", "Have at thee, coconut! Sausage, thou shalt be my herald! Announce me to the lists!"], ["me", "In THIS corner, a baguette who thinks it's a joust! In THAT corner, King Coconut Shy Lobber and a whole crowd! Hold the line, pal!"], ["lo2", "Splendidly heralded! Forsooth, the coconuts are throwing themselves BACK! Is that in the rules of the tourney?"]],
  "w11-s9": [["me", "The big wheel, folks! One giant doughnut, and the Champion climbs it rung by rung! What a view of the big top!"], ["n", "The loudspeaker crackles: \"Step right up, little sausage! Champion of WHAT? One kitchen? My Midway eats champions for lunch!\""], ["me", "One kitchen AND a backyard, mister! And here's Bonbon the Cannonball, folks, helmet on, drum roll! I'm coming for that tent!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Sizzle sizzle SIZZLE!", "Now THAT'S a grill!", "And the crowd goes WILD!"],
  lowhp: ["I-I'm getting overcooked!", "Ow ow! I need a bun!", "D-don't flip me yet!"],
  perfect: ["Spikes in, roll out!", "Whoosh! Too quick to grill!", "S-sorry! Coming through!"],
  levelup: ["Turning up the heat!", "One step closer to Champion!", "Extra spicy edition!"],
  secret: ["A secret! S-so many sauces!", "Ooh! Cookout supplies!", "Champion finds the chest!"],
  boom: ["W-was that me? Wow!", "Flame-grilled! Sorry!", "Well done! EXTRA well done!"],
  mimic: ["Eek! That box bites!", "That's no picnic basket!", "S-sorry! Hey, YOU bit ME!"],
  objective: ["Order up!", "D-did it! Champion stuff!", "Done to perfection, folks!"],
};
