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
  "w5-s2": [["me","Uh, folks? Is that a rolling pin coming down the suds? It IS! And it's gaining!"], ["me","Hotchog breaks from the pack! Look at those little legs go! RUN, Hotchog, RUN!"]],
  "w5-s3": [["me","Sponge Shoals! I scrub my grill with these. I never knew monsters lived inside 'em! Ew!"], ["me","Gates just slammed shut! Hey, there's a lever up there. Wanna bet it drops that rolling pin on 'em?"]],
  "w5-s4": [[10, "Hmph. Hotchog. My last Crumblet. Walk it through the dish rack. Spikes pointed AWAY."], ["me", "You got it, Mr. Bluebeary! One VIP pass to the cookout, coming right up!"]],
  "w5-s6": [["me", "Bubble Bay! Conveyor belts all the way to the scroll. It's a giant rotisserie!"], ["me", "Seventy-five seconds on the timer, folks! Ding ding! Let's GO!"]],
  "w5-s7": [["me","Plughole Pass! Careful, everybody. Nobody drop the ketchup down there."], ["me","That chest's way up high, but I bet that squishy sponge gives a champion a boost! BOING!"]],
  "w5-s8": [["me", "Greasy Pan Pits! Somebody forgot to wash up after the cookout. Was it me? It was me. Sorry!"], [7, "Hrrm! Young champion! Your grill still burns with my flame. Forty-five seconds, side by side?"], ["me", "Side by side, Mr. Norigon! Light 'em up!"]],
  "w5-s9": [["mold", "Hehehe... cookouts end, little sausage. Everybody goes home, and you're all alone with the dishes."], ["me", "Nope! After a cookout, everybody helps with the dishes. That's the best part!"], ["me", "Well, second-best. After the burgers."]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["n","Uh-oh! Something big and round is rolling across the Placemat Plains!"], ["me","The rolling pin's BACK, folks! Fresh legs, same old pin! Hotchog takes the outside lane! RUN!"]],
  "w6-s3": [["me","Whoa, candelabras! Hot wax dripping everywhere. Watch your step, folks. Sticky!"], ["me","Locked in again?! Well, you know what they say. When in doubt, yank the lever and let the pin do the flipping!"]],
  "w6-s4": [[10,"Hmph. This Crumblet wants to see the world, sausage. Get it past the gravy boats in one piece."], ["me","You got it, Mr. Bluebeary! Little buddy, gravy is a topping, not a swimming pool!"]],
  "w6-s6": [["me", "Teacup Terrace! Pinkies up, folks! The scroll's at the far end."], ["me", "Teapot Nannies healing the baddies? That's a foul! Grab the scroll and hold the line!"]],
  "w6-s7": [["me","Napkin Fold Fort! Somebody folded these into swans. Show-offs!"], ["me","Ooh, a chest on the top fold! I'll take the sponge express. BOING!"]],
  "w6-s8": [["lo2", "Charge, my silverware! Skewer yon sausage!"], ["me", "Skewers? Pal, I've grilled with Captain Kebab! Forty-five seconds! Bring it on!"]],
  "w6-s9": [["lo2", "Forsooth! A hot dog climbs my chandelier! Thou art not even FANCY, varlet!"], ["me", "Fancy? I'm the Grill Champion! Next up, folks, the main event!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me","Folks, I hear rumbling on the Hose Highway. Please don't be the pin. Please don't be the pin..."], ["n","It's the pin!"], ["me","Down the stretch they come! Hotchog on the hose, the pin right on his tail! RUN!"]],
  "w7-s3": [["n","FSSSH! The sprinklers burst up and soak the whole arena!"], ["me","Aw, my poor coals! Ahem. The gates are shut, folks, but I spy a lever. Rolling pin, you're in the game!"]],
  "w7-s4": [[10,"Hmph. This Crumblet's never been to a pool party. Get it past the pier, and no poking it with those spikes."], ["me","One VIP pass to the pool party, Mr. Bluebeary! Little buddy, no cannonballs till after lunch!"]],
  "w7-s6": [["me", "Picnic Table Peak! Checkered tablecloth, folks, the classic cookout look!"], ["me", "Scroll's up top! Grab it, hold the line, and keep those wasps off the potato salad!"]],
  "w7-s7": [[18, "In THIS corner! Hey, Champ! Key chest's on the high ledge. Ding ding, go get it!"], ["me", "W-wow, Velvaroo! Wanna come to the cookout?"], [18, "Is there a bake sale? Kidding! I'll bring cupcakes! HOP!"]],
  "w7-s8": [["me", "Cooler Canyon! Every cookout needs drinks on ice. The Freezer Golem would LOVE it here!"], ["me", "Forty-five seconds, folks! Same as a good burger needs per side. Let's sear it!"]],
  "w7-s9": [["n", "From the summit, a voice booms: \"ATTEN-TION! Sprouts, turn the grill to MAXIMUM!\""], ["me", "MAXIMUM?! You'll burn everything! Folks, this is a grilling emergency! Here I come!"]],
  // World 8: The Garden.
  "w8-s2": [["me","Watering Can Run! Folks, I've got a bad feeling about that spout..."], ["n","Uh-oh! A rolling pin tumbles out of the can and comes thundering after Hotchog!"], ["me","Called it! Neck and neck, folks! The Champion digs deep! RUN!"]],
  "w8-s3": [["n","POOF! The sunflowers puff pollen all over the arena!"], ["me","Ah-CHOO! That's a pollen penalty! Somebody get me a tissue and pull that lever. The pin's got this one!"]],
  "w8-s4": [[10,"Hmph. Hotchog. This one's never seen a pumpkin patch. Exit's that way. Don't let it climb anything."], ["me","One VIP pass to the Garden, Mr. Bluebeary! Little buddy, pumpkins are for pie, not for climbing!"]],
  "w8-s6": [["me", "Beanstalk Heights! Green beans, folks, the perfect cookout side! The scroll's at the top!"], ["me", "Grab it in time, then hold the line! Let's go, Champion. Beans mean business!"]],
  "w8-s7": [[12, "Heyyy, duuude... *yaaawn* Key chest's on the high ledge. Boing boing, or whatever."], ["me", "Th-thanks, Sloba! Wanna come to the cookout? There's bubble tea!"], [12, "No pressure, just tea-sure. Zzz."]],
  "w8-s8": [["me", "Scarecrow Stand! Folks, he's wearing a BBQ apron! Now THAT'S a scarecrow with style!"], ["me", "Forty-five seconds, then corn on the cob for everybody! Hold the line!"]],
  "w8-s9": [["n", "From the greenhouse, a lumpy voice mumbles: \"Huh! Is that a PEA in me? Or a button? WHO AM I?\""], ["me", "Mystery meat, folks! The Champion has grilled worse. I think. Here I come!"]],
  // World 9: The Supermarket.
  "w9-s2": [["me","Trolley Track! I always wanted to race a shopping cart. Wait, what's THAT coming down lane one?"], ["me","It's the rolling pin, folks! It never retires! Hotchog takes the trolley lane! RUN!"]],
  "w9-s3": [["me","The Cereal Aisle, folks! Crunchy, sugary, and not one bit grillable. Tough crowd!"], ["me","Gates locked again? Pfft. I'm a pro at this now. Lever, pin, BONK, and the crowd goes wild!"]],
  "w9-s4": [[10,"Hmph. Found this one in the bananas. Walk it to the exit. Gently, sausage."], ["me","One VIP pass to produce, Mr. Bluebeary! Little buddy, grilled pineapple is a thing. Trust me!"]],
  "w9-s6": [["me", "Bakery Bluff! BUNS, folks! Racks and racks of buns! I-I think I'm gonna cry. Happy cry!"], ["me", "Focus! Grab the Recipe Scroll in time and hold the line! THEN bun shopping!"]],
  "w9-s7": [[3, "Wibble wobble! Hi, Champ! Key chest's up high! Um, will there be a dessert table at your cookout?"], ["me", "A d-dessert table? Folks, there WILL be one, and you're invited! Front row!"], [3, "EEEE! Invited! That's the jiggle of it! Go boing, Champ!"]],
  "w9-s8": [["lo2", "Hold out at the checkout, sausage? I shall bag thee and sell thee, two for one!"], ["me", "Two for one? Folks, I'm a PREMIUM sausage! Forty-five seconds! Ring 'em up!"]],
  "w9-s9": [["n", "From the Frozen Aisle, a spooky voice wails: \"Woooo! Who goes there? Nobody EVER opens meee!\""], ["me", "B-b-brrr! Folks, it's cold in here! Ahem. Freezer burn is no match for a HOT dog! Here I come!"]],
  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me","Jam Jar Junction! Folks, you know what's coming. One last time!"], ["n","RUMBLE! The rolling pin comes crashing through the jam jars, sticky and determined!"], ["me","Final lap! The pin's got jam, but Hotchog's got hot feet! RUN!"]],
  "w10-s3": [["me","Takeaway Towers, folks! Noodle boxes, curry tubs, and a fortune cookie! It says..."], ["me","\"You will win a big feast-off.\" HA! I KNEW it! Now somebody pull that lever!"]],
  "w10-s4": [[10, "Hmph. Hotchog. My LAST Crumblet. The very last one. Get it down Frost Drawer Falls. Spikes AWAY."], ["me", "The final VIP pass, Mr. Bluebeary! Little buddy, you get a front row seat at the feast. Promise!"], [10, "It's wearing a tiny party hat. Don't look at me. It's the frost, okay?"]],
  "w10-s6": [["me", "Paper Chain Pass! Folks, these decorations are older than Sir Stale. And twice as dusty!"], ["me", "The LAST Recipe Scroll! Grab it in time, hold the line, and save these streamers for the party!"]],
  "w10-s7": [[3, "Wibble wobble! Champ! The last key chest is up high! Is the dessert table still on?"], ["me", "Still on, Bloblin! Folks, it's the BIGGEST dessert table in history! Sponge, BOING!"]],
  "w10-s8": [["lo2", "Hold out one last time, sausage? Thy buns shall go as stale as MINE!"], ["me", "Stale buns? Pal, we TOAST 'em! Forty-five seconds, folks, then you're coming to dinner too!"]],
  "w10-s9": [["n", "A grumpy old voice booms down the long, empty table: \"A cookout? HERE? Nobody feasts in MY Fridge!\""], ["me", "Folks, look at that table! Not one plate! That's a foul if I ever saw one!"], ["me", "It's the feast-off finals! The Champion's coming in HOT! Here I come!"]],
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
