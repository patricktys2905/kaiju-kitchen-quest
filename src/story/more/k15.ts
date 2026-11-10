// Hotchog: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop. Practice round, lots of apologising.
  "w1-s2": [["me", "C-crumbs everywhere! A champion keeps a clean grill... and a clean countertop!"], ["me", "I'll tidy up right after I bonk those Moldy Buns. S-sorry in advance, buns!"]],
  "w1-s3": [["me", "Eep! S-sour worms! They look so grumpy. Sorry about whatever happened to you!"], ["n", "Psst! Hotchog has been practising lever-pulling in secret. LOTS."], ["me", "Pull, two, three! Rolling pin, c-coming down! BONK!"]],
  "w1-s4": [["n", "Aww! A tiny Crumblet pops out from behind the toaster and grabs Hotchog's tail!"], ["me", "Oh! H-h-hi! I'm Hotchog. Watch the spikes, and the hissy pots! Stay close, okay?"]],
  "w1-s6": [["me", "The Chef's Recipe Scroll?! Maybe it's got the s-secret sauce! I'll grab it, quick!"], ["me", "Ooh, paprika! And smoky salt! No, no, focus, Hotchog! Seasoning comes AFTER the fight!"]],
  "w1-s7": [["me", "P-Pepper Pass! I use pepper for grilling, n-not for fighting! Ah-CHOO!"], ["me", "A key hidden up high? A ch-champion would check the sponges. BOING!"]],
  "w1-s8": [["n", "Rumble rumble! Monsters pour over the cutting board from every side!"], ["me", "S-s-so many! Grill rule number one: hold your ground and don't flip too early!"], ["me", "Forty-five seconds? Ha! That's one perfect sear!"]],
  "w1-s9": [["foe", "Hah! Burners, sausage! Real champions grill on these. Try not to get charred!"], ["me", "I l-like a little char, Captain. It's called FLAVOUR!"]],
  // World 2: The Fridge. Out of his element, but making a guest list.
  "w2-s2": [["me", "Dairy Lane! For the cookout I'll need cheese slices. Lotsa cheese slices!"], ["me", "Shopping list: cheese, buns, and \"d-don't get squished by a Milk Carton Rammer.\""]],
  "w2-s3": [["me", "Brrr! My spikes have frost on 'em! I'm a hot dog on a p-p-popsicle stick!"], ["me", "Um, that lunchbox is l-looking at me. Is it looking at me? It's TOTALLY looking at me!"]],
  "w2-s4": [["me", "Another lost Crumblet? Hi, little guy! Walk next to me. Not TOO close. Spikes!"], ["n", "Uh-oh! Something big and briny lurks under the pier!"], ["me", "S-stay behind me! A champion protects the crowd!"]],
  "w2-s6": [["me", "Recipe Scroll at the far end! If it's the secret sauce, I'm gonna cry. Happy cry!"], ["me", "Seventy-five seconds, just like a grill timer! Ding! I LOVE a grill timer!"]],
  "w2-s7": [["me", "Whoa, Butter Bridge! Super slippery. Super good for basting, though!"], [17, "Wheee! Hi, Hotchog! Coming through! Chest's up past the sponge, by the way! Byeee!"], ["me", "Th-thanks, Pengwhip! How does anybody slide that good?!"]],
  "w2-s8": [["me", "Ketchup Canyon! I'm more of a mustard guy, but I won't be rude about it."], ["me", "Forty-five seconds. Like waiting for the coals to go white. Patience, Hotchog!"]],
  "w2-s9": [["n", "Click! The fridge light dies. Uh-oh! The Ice Tray Steps glitter in the dark!"], ["mold", "Shhh, little sausage. Cold and dark keeps meat fresh... forever. Hehehe!"], ["me", "N-nope! I'm a hot dog! Emphasis on HOT!"]],
  // World 3: The Oven. His element. The stammer starts to fade.
  "w3-s2": [["me", "The Oven! Sniff sniff! It smells like every cookout I ever dreamed about!"], ["me", "Bottom rack, lowest heat! A champion starts slow and builds it up. Let's go!"]],
  "w3-s3": [["me", "Muffin tins! If a Crumblet gets lost in here, it's gonna be a looong day."], ["me", "Ladle lever? Spotted! And that cereal box? VERY suspicious."]],
  "w3-s4": [["me", "There you are, little Crumblet! It's hot in here, so stick by me. The not-spiky side!"], ["me", "Pressure cookers! Lure the baddies in, then KA-BOOM! Like popcorn, but rude!"]],
  "w3-s6": [["n", "Whoa! The cookie sheet is packed edge to edge with monsters. A full batch!"], ["me", "I've cooked FOR a crowd before. Never AGAINST one!"], ["me", "Grab the scroll and hold the line. Spikes up!"]],
  "w3-s7": [["me", "Chocomunch! You look kinda glossy. I'll fan you with my spikes! Whoosh whoosh!"], [8, "Spikes bad fan. Spikes good try! Thank you, friend!"], ["me", "Anytime! Low and slow is for roasts. Me? I'm going high and fast to that key chest!"]],
  "w3-s8": [["me", "A pizza stone! Hottest spot in the kitchen! Now THIS is my kinda place!"], ["me", "Forty-five seconds on high heat, folks, and he won't even FLIP! The crowd goes wild!"]],
  "w3-s9": [["foe", "Broiler Peak's right above us, kid. Still think you can take MY grill?"], ["me", "It's everybody's grill, Captain! And here I come!"]],
  // World 4: The Pantry. Hunting the secret sauce, inviting everyone.
  "w4-s2": [["me", "The Pantry! The Chef's secret sauce is somewhere in here. I can almost taste it! Mmm!"], ["me", "Whoa, Cheerios rolling everywhere! Breakfast is attacking! I'm more of a lunch dog."]],
  "w4-s3": [["me", "Flour Ghosts? Pfft. At a cookout we call that \"unseasoned\"!"], ["me", "Ladle's up there! Let's roll out the pin and dust 'em off!"]],
  "w4-s4": [["me", "Hey, little Crumblet! Wanna be my first guest at the cookout? Then stay close!"], ["me", "And keep away from the hissing pots. They're grumpier than Captain Kebab!"]],
  "w4-s6": [["me", "Spice Rack Ridge! The sauce recipe could be up here! Ooh, smoky paprika! Brown sugar!"], ["me", "Focus! Grab the scroll and hang on for seventy-five seconds. Happy dance later!"]],
  "w4-s7": [[11, "Beep beep! Special delivery for one shy hedgehog: a hot tip! Key chest's past the sponge!"], ["me", "W-wow, thanks! Hey, are you coming to the cookout?"], [11, "Is there pizza? Then I'm already there! Zoom!"]],
  "w4-s8": [["n", "Drip drip! Honey oozes off the shelves, and a sticky swarm of monsters with it!"], ["me", "Ooh, honey glaze! Thanks for the idea! Now everybody line up for the grill!"], ["me", "I waited a whole year for this cookout. I can wait forty-five more seconds!"]],
  "w4-s9": [["me", "Top shelf! The Cookie Vault's right up there, and the recipe with it!"], ["me", "Last year I couldn't even say hi without stammering. Watch this! HELLO, TOP SHELF!"]],
  // World 5: The Sink. The Champion cleans up. Stammer nearly gone.
  "w5-s2": [["n", "RUMBLE! A giant rolling pin comes bouncing down the Suds Slide!"], ["me", "And the rolling pin takes the lead! But here comes Hotchog on the outside! RUN, Hotchog, RUN!"]],
  "w5-s3": [["me", "Sponge Shoals! Great for scrubbing a grill. Not so great with monsters living in it!"], ["me", "Gates locked? Then it's lever time! Rolling pin, you're up!"]],
  "w5-s4": [[10, "Hmph. Hotchog. My last Crumblet. Walk it through the dish rack. Spikes pointed AWAY."], ["me", "You got it, Mr. Bluebeary! One VIP pass to the cookout, coming right up!"]],
  "w5-s6": [["me", "Bubble Bay! Conveyor belts all the way to the scroll. It's a giant rotisserie!"], ["me", "Seventy-five seconds on the timer, folks! Ding ding! Let's GO!"]],
  "w5-s7": [["me", "Plughole Pass! Careful, everybody. Nobody drop the ketchup down there."], ["me", "Key chest's up high. A champion always checks the sponges! BOING!"]],
  "w5-s8": [["me", "Greasy Pan Pits! Somebody forgot to wash up after the cookout. Was it me? It was me. Sorry!"], [7, "Hrrm! Young champion! Your grill still burns with my flame. Forty-five seconds, side by side?"], ["me", "Side by side, Mr. Norigon! Light 'em up!"]],
  "w5-s9": [["mold", "Hehehe... cookouts end, little sausage. Everybody goes home, and you're all alone with the dishes."], ["me", "Nope! After a cookout, everybody helps with the dishes. That's the best part!"], ["me", "Well, second-best. After the burgers."]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["n", "RUMBLE! A giant rolling pin comes rolling across the Placemat Plains!"], ["me", "And they're off! The pin starts strong, but Hotchog is on fire today, folks! RUN!"]],
  "w6-s3": [["me", "Whoa, candelabras! Hot wax dripping everywhere. Watch your step, folks. Sticky!"], ["me", "Gates locked? You know the drill. Lever time! Rolling pin, take it away!"]],
  "w6-s4": [[10, "Hmph. Hotchog. This Crumblet wants to see the world. Get it through Gravy Boat Bay in one piece."], ["me", "You got it, Mr. Bluebeary! Little buddy, gravy is a topping, not a swimming pool!"]],
  "w6-s6": [["me", "Teacup Terrace! Pinkies up, folks! The scroll's at the far end."], ["me", "Teapot Nannies healing the baddies? That's a foul! Grab the scroll and hold the line!"]],
  "w6-s7": [["me", "Napkin Fold Fort! Somebody folded these into swans. Show-offs!"], ["me", "Key chest up high, sponge right here. The Champion goes for the BOING!"]],
  "w6-s8": [["lo2", "Charge, my silverware! Skewer yon sausage!"], ["me", "Skewers? Pal, I've grilled with Captain Kebab! Forty-five seconds! Bring it on!"]],
  "w6-s9": [["lo2", "Forsooth! A hot dog climbs my chandelier! Thou art not even FANCY, varlet!"], ["me", "Fancy? I'm the Grill Champion! Next up, folks, the main event!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["n", "RUMBLE! A giant rolling pin comes bouncing down the Hose Highway!"], ["me", "And they're off! The pin on the inside, Hotchog on the hose! Down the stretch they come! RUN!"]],
  "w7-s3": [["n", "FSSSH! The sprinklers burst up and soak the whole arena!"], ["me", "Aw, my poor coals! Ahem. Gates locked, folks! Lever time! Rolling pin, take it away!"]],
  "w7-s4": [[10, "Hmph. Hotchog. This Crumblet's never been to a pool party. Get it past the pier. Spikes AWAY."], ["me", "One VIP pass to the pool party, Mr. Bluebeary! Little buddy, no cannonballs till after lunch!"]],
  "w7-s6": [["me", "Picnic Table Peak! Checkered tablecloth, folks, the classic cookout look!"], ["me", "Scroll's up top! Grab it, hold the line, and keep those wasps off the potato salad!"]],
  "w7-s7": [[18, "In THIS corner! Hey, Champ! Key chest's on the high ledge. Ding ding, go get it!"], ["me", "W-wow, Velvaroo! Wanna come to the cookout?"], [18, "Is there a bake sale? Kidding! I'll bring cupcakes! HOP!"]],
  "w7-s8": [["me", "Cooler Canyon! Every cookout needs drinks on ice. The Freezer Golem would LOVE it here!"], ["me", "Forty-five seconds, folks! Same as a good burger needs per side. Let's sear it!"]],
  "w7-s9": [["n", "From the summit, a voice booms: \"ATTEN-TION! Sprouts, turn the grill to MAXIMUM!\""], ["me", "MAXIMUM?! You'll burn everything! Folks, this is a grilling emergency! Here I come!"]],
  // World 8: The Garden.
  "w8-s2": [["n", "RUMBLE! A giant rolling pin comes bouncing down the Watering Can Run!"], ["me", "And they're off! The pin takes the spout, Hotchog takes the handle! It's neck and neck, folks! RUN!"]],
  "w8-s3": [["n", "POOF! The sunflowers puff pollen all over the arena!"], ["me", "Ah-CHOO! Folks, that's a pollen penalty! Gates locked! Lever time! Rolling pin, take it away!"]],
  "w8-s4": [[10, "Hmph. Hotchog. This Crumblet's never seen a pumpkin patch. Get it to the exit. Spikes AWAY."], ["me", "One VIP pass to the Garden, Mr. Bluebeary! Little buddy, pumpkins are for pie, not for climbing!"]],
  "w8-s6": [["me", "Beanstalk Heights! Green beans, folks, the perfect cookout side! The scroll's at the top!"], ["me", "Grab it in time, then hold the line! Let's go, Champion. Beans mean business!"]],
  "w8-s7": [[12, "Heyyy, duuude... *yaaawn* Key chest's on the high ledge. Boing boing, or whatever."], ["me", "Th-thanks, Sloba! Wanna come to the cookout? There's bubble tea!"], [12, "No pressure, just tea-sure. Zzz."]],
  "w8-s8": [["me", "Scarecrow Stand! Folks, he's wearing a BBQ apron! Now THAT'S a scarecrow with style!"], ["me", "Forty-five seconds, then corn on the cob for everybody! Hold the line!"]],
  "w8-s9": [["n", "From the greenhouse, a lumpy voice mumbles: \"Huh! Is that a PEA in me? Or a button? WHO AM I?\""], ["me", "Mystery meat, folks! The Champion has grilled worse. I think. Here I come!"]],
  // World 9: The Supermarket.
  "w9-s2": [["n", "RUMBLE! A giant rolling pin comes rolling down the Trolley Track!"], ["me", "And they're off! The pin in lane one, Hotchog in the trolley lane! Down the aisle they come! RUN!"]],
  "w9-s3": [["me", "The Cereal Aisle, folks! Crunchy, sugary, and not one bit grillable. Tough crowd!"], ["me", "Gates locked? You know the drill. Lever time! Rolling pin, take it away!"]],
  "w9-s4": [[10, "Hmph. Hotchog. This Crumblet's never seen fruit and veg. Get it to the exit. Spikes AWAY."], ["me", "One VIP pass to produce, Mr. Bluebeary! Little buddy, grilled pineapple is a thing. Trust me!"]],
  "w9-s6": [["me", "Bakery Bluff! BUNS, folks! Racks and racks of buns! I-I think I'm gonna cry. Happy cry!"], ["me", "Focus! Grab the Recipe Scroll in time and hold the line! THEN bun shopping!"]],
  "w9-s7": [[3, "Wibble wobble! Hi, Champ! Key chest's up high! Um, will there be a dessert table at your cookout?"], ["me", "A d-dessert table? Folks, there WILL be one, and you're invited! Front row!"], [3, "EEEE! Invited! That's the jiggle of it! Go boing, Champ!"]],
  "w9-s8": [["lo2", "Hold out at the checkout, sausage? I shall bag thee and sell thee, two for one!"], ["me", "Two for one? Folks, I'm a PREMIUM sausage! Forty-five seconds! Ring 'em up!"]],
  "w9-s9": [["n", "From the Frozen Aisle, a spooky voice wails: \"Woooo! Who goes there? Nobody EVER opens meee!\""], ["me", "B-b-brrr! Folks, it's cold in here! Ahem. Freezer burn is no match for a HOT dog! Here I come!"]],
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
