// Tacowl: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop. Too sunny for a night owl, and nobody answers.
  "w1-s2": [["n", "Click! The kitchen lights go out on the Crumb Trail!"], ["me", "Finally, NIGHT! My favorite! Now I can see everything! WHOOO's ready to party?!"], ["me", "Crickets. Actual crickets. Tough crowd."]],
  "w1-s3": [["me", "Gummy Gully! My talons are stuck! Wise owl says: never land on a gummy bear."], ["me", "Ooh, a ladle lever! Pull it and the rolling pin drops the beat! BONK!"]],
  "w1-s4": [["n", "Aww! A little lost Crumblet is peeking out from behind the salt shaker!"], ["me", "Hey, little muffin! Ride along with DJ Tacowl! Stay clear of the hissy pots, okay?"], ["me", "They go BOOM. Great for monsters, bad for muffins!"]],
  "w1-s6": [["me", "The Chef's Recipe Scroll! Maybe it's the Taco Tuesday recipe! Gotta fetch it fast!"], ["n", "Uh-oh! Monsters are tumbling off the spice shelf!"], ["me", "Paprika party crashers! Salsa bombs away!"]],
  "w1-s7": [["me", "Pepper Pass. Ah... AH-CHOO! Whoa, I sneezed out a tortilla chip!"], ["me", "A key in a high chest? Owls flap, sponges BOING. Let's do both!"]],
  "w1-s8": [["me", "Lights out again! Forty-five seconds of monsters in the dark? That's just a party with rude guests!"], ["me", "Note for my Taco Tuesday mixtape: Track one, \"Countertop Showdown.\" It slaps!"]],
  "w1-s9": [["me", "Burners ahead! My lettuce is wilting! Do NOT look at my lettuce!"], ["mold", "Hehehe... it's Monday, little owl. It's always gonna be Monday."], ["me", "Who said that?! Rude! Nobody says Monday that creepy!"]],
  // World 2: The Fridge. Dark, chilly, and full of taco fixings.
  "w2-s2": [["me", "Dairy Lane! Sour cream! Shredded cheese! Somebody pinch me, I'm in taco heaven!"], ["me", "Monday number twelve, by the way. Not that I'm counting. Okay, I'm counting."]],
  "w2-s3": [["n", "Whoa! The Frost Shelf is crawling with frozen monsters!"], ["me", "And that lunchbox has teeth. I'm NOT opening the lunchbox. Lever first, questions later!"]],
  "w2-s4": [[10, "Hmph. Owl. That's one of my Crumblets. Lights are out, so walk it to the exit. Carefully."], ["me", "Lights out is MY time, Mr. Bluebeary! I see in the dark! Hoo-hoo!"], [10, "Hmph. Fine. Don't play your loud music at it."]],
  "w2-s6": [["me", "Egg Carton Cliffs! Twelve eggs and not one breakfast taco. What a waste!"], ["me", "Recipe scroll at the far end! Wise owl says: hold the scroll, not the eggs."]],
  "w2-s7": [["me", "Butter Bridge! Slippery talons! Whoa, whoa, WHOA!"], [4, "Ooooh, a round glowy owl... are you the moon?"], ["me", "Nope! But night owls and moon-lovers are basically cousins, Mothball! Now, BOING to the key!"]],
  "w2-s8": [["me", "Ketchup Canyon! Ketchup on tacos? Hmm. Don't tell Señor Sting I said hmm."], ["me", "Forty-five seconds! Mixtape Track two: \"Cold Feet, Hot Beats!\""]],
  "w2-s9": [["n", "Uh-oh! The Ice Tray Steps are swarming with monsters!"], ["me", "Ooh, a big crowd! WHOOO's ready to party?!"], ["me", "Growling? Is growling a yes? I'm counting it as a yes!"]],
  // World 3: The Oven. Warm tortillas, a cracked shell, and the Chef's trail.
  "w3-s2": [["me", "Bottom rack. Whew! It's hotter in here than Señor Sting's sauce!"], ["foe", "NOTHING is hotter than my sauce, owl! Bzzzt!"], ["me", "How are you even HERE?!"]],
  "w3-s3": [["me", "Muffin Tin Maze! Every cup looks the same. Wise owl says: when lost, eat a muffin."], ["me", "Nope, NOT eating the muffins. Pulling the lever instead. BONK!"]],
  "w3-s4": [["me", "A little Crumblet in the Oven? Hop under my wing, shorty! It's shady under here!"], ["me", "Steer clear of the pressure cookers. They're the only things in here louder than me!"]],
  "w3-s6": [["n", "Click! The oven light flickers out over the Cookie Sheet!"], ["me", "Night shift! My favorite! Grab the scroll, hold out, and keep the beat!"]],
  "w3-s7": [[15, "T-T-Tacowl! Your shell's c-c-cracked!"], ["me", "It's fine, Hotchog! Cracked shells are just extra crunchy! Now, sponge to the key chest! BOING!"]],
  "w3-s8": [["me", "Pizza Stone! Hot stone, hot beats! Forty-five seconds!"], ["me", "Mixtape Track nine: \"Sizzle Sizzle Hoo-Hoo.\" Okay, I'm still working on the title."]],
  "w3-s9": [["me", "Top rack! I smell warm tortillas. The Chef was HERE!"], ["mold", "Hehehe... warm tortillas go cold, little owl. Mondays never end."], ["me", "Stop saying Monday like that! It gives me shell-shivers!"]],
  // World 4: The Pantry. Spices, beans, and the Chef's lime-and-cilantro trail.
  "w4-s2": [["me", "Cereal Canyon! Corn flakes, corn puffs, CORN! Tortillas are corn! I'm home!"], ["me", "Monday number thirty-one. Wise owl says: never count Mondays. Too late!"]],
  "w4-s3": [["me", "Flour everywhere, like snow! Ooh, tortilla flour! The Chef's been here!"], ["n", "Uh-oh! That flour pile just stood up! It's a Flour Ghost!"], ["me", "Boo yourself! Lever time! BONK!"]],
  "w4-s4": [["n", "SLAM! The pantry door shuts, and Tin Can Alley goes pitch black!"], ["me", "Don't worry, little Crumblet! Owl eyes! I see EVERYTHING. Including that hissy pot. Stay clear!"]],
  "w4-s6": [["me", "Spice rack! Cumin! Chili powder! It smells like Taco Tuesday in here!"], ["me", "Grab the scroll, hold out, THEN I'm swiping a pinch of cumin. For later!"]],
  "w4-s7": [[7, "Hrrm. Young owl. They say the owl is the wisest of birds."], ["me", "Yup! And my wisdom says: always bring extra salsa!"], [7, "Hrrm. Very wise. I say the same about rice. Sponge is that way."]],
  "w4-s8": [["me", "Honey Hollow! Sticky! Honey on a taco? Weird. I kinda wanna try it."], ["me", "Forty-five seconds! Mixtape Track twenty: \"Stuck in Honey.\" It's a slow jam. Very slow."]],
  "w4-s9": [["me", "The top shelf! Sniff sniff. Lime and cilantro! The Chef's apron smells just like that!"], ["mold", "Drip, drip... hear the Sink, little owl? Your Chef is down here with ME. Hehehe!"], ["me", "Then I'm coming down! WHOOO's ready? ME!"]],
  // World 5: The Sink. Last stop before Tuesday.
  "w5-s2": [["n", "Uh-oh! A giant rolling pin is rumbling down the Suds Slide, right at Tacowl!"], ["me", "Not now, rolling pin! I've got a party to get to! Flap, flap, FLAP!"]],
  "w5-s3": [["me", "Sponge Shoals! Gates locked! WHOOO's ready to get scrubbed?!"], ["me", "Lever down, rolling pin drop! Clean-up on aisle Sink! Hoo-hoo!"]],
  "w5-s4": [[10, "Hmph. Owl. My last Crumblet. Get it across Dish Rack Ridge, and keep its frosting dry."], ["me", "Dry frosting, coming right up! No splashing, no loud music. Okay, a LITTLE music."]],
  "w5-s6": [["me", "Bubble Bay! Bubbles AND conveyor belts? It's a foam party!"], ["me", "Grab the scroll in seventy-five seconds, then party. I mean hold out. Same thing!"]],
  "w5-s7": [["me", "Plughole Pass! Do NOT drop anything down the plughole. Especially not the key!"], ["me", "Key chest up on the high ledge. Sponge, BOING! Hoo-hoo!"]],
  "w5-s8": [["me", "Greasy Pan Pits! Grease on my feathers? Ew! I'll wash up after the party!"], ["me", "Mixtape Track thirty-nine: \"Forty-Five Seconds of Greasy.\" It's a banger!"]],
  "w5-s9": [["mold", "Hehehe... come down the drain, little owl. Down here, every day is MONDAY."], ["me", "Well, I've got a calendar to fix and a Chef to find! Going down! Hoo-hoo!"]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Placemat Plains! Flat and fancy! Perfect for a moonlit flight and..."], ["n", "RUMBLE! A giant rolling pin comes bouncing over the placemats!"], ["me", "Nope! Flap, flap, FLAP!"]],
  "w6-s3": [["me", "Candelabras! Fancy party lighting! OW! Hot wax! TOO fancy!"], ["me", "Gates locked! Pull the lever, drop the rolling pin, drop the beat!"]],
  "w6-s4": [[10, "Hmph. Owl. This Crumblet wants to see the world. Walk it past the gravy boats. No loud music."], ["me", "No music?! Fine. I'll hum. Hoo-hoo-hmm-hmm!"]],
  "w6-s6": [["me", "Teacup Terrace! A tea party? Ooh, I LOVE a party. Even a pinky-up party!"], ["me", "Grab the scroll, hold out, and keep an eye on those Teapot Nannies!"]],
  "w6-s7": [["me", "Napkin Fold Fort! Napkins! Every taco party needs a TON of napkins!"], ["me", "Key chest way up high. Sponge! BOING! Hoo-hoo!"]],
  "w6-s8": [["lo2", "Charge, my silverware! Fork yon owl like a crusty taco!"], ["me", "Forty-five seconds! Mixtape Track forty-two: \"Fork It Over!\""]],
  "w6-s9": [["me", "Chandelier Climb! Look at all those lights! Ooh, the party's gonna need this!"], ["lo2", "Forsooth! Climb, feathered snack! At the top, I shall make thee a stale tostada!"], ["me", "A tostada? Rude! Right shape, but RUDE!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "Hose Highway! Long and bendy. Great dance floor! Mixtape Track forty-three!"], ["n", "RUMBLE! A giant rolling pin comes chasing down the hose!"], ["me", "New dance! It's called RUN! Flap, flap, FLAP!"]],
  "w7-s3": [["n", "FWOOSH! The sprinklers burst up and blast Tacowl into the air!"], ["me", "Whoa! A free sprinkler show! Okay, lever, drop that rolling pin! BONK! Hoo-hoo!"]],
  "w7-s4": [[10, "Hmph. Owl. This Crumblet's never seen a pool. Walk it round the edge. No cannonballs."], ["me", "No cannonballs? Aw. Okay, little muffin, stick with me! I'll hoot if anything splashy comes!"]],
  "w7-s6": [["me", "Picnic Table Peak! Paper plates, plastic forks... a taco party waiting to happen!"], ["me", "Grab the Recipe Scroll, hold the table! Nobody crashes this picnic but ME!"]],
  "w7-s7": [[18, "In THIS corner! A tiny taco with wings! Ding ding! Wanna spar?"], ["me", "Spar? I'm a party host, not a boxer! But I throw a mean salsa bomb!"], [18, "Ha! I like ya, feathers! Key's up on that ledge. Bounce on the sponge, champ!"]],
  "w7-s8": [["me", "Cooler Canyon! Ice, sodas and a cold breeze. Ahhh, night owl weather!"], ["me", "Forty-five seconds! Mixtape Track forty-four: \"Chill Out, Grill Out!\" Hoo-hoo!"]],
  "w7-s9": [["me", "Charcoal Climb! Hot coals, big smoke. My feathers are getting toasty!"], ["lo2", "Hah! The Baron shall grill thee, owl! Well done and extra crunchy!"], ["me", "Extra crunchy is my BEST look! WHOOO's climbing? This owl!"]],
  // World 8: The Garden.
  "w8-s2": [["me", "Watering Can Run! Ooh, a misty spout! Free fog machine for the dance floor!"], ["n", "RUMBLE! A giant rolling pin comes rolling round the watering can!"], ["me", "New dance! The Rolling Pin Run! Flap, flap, FLAP!"]],
  "w8-s3": [["me", "Sunflower Grove! Tall flowers all facing the stage. Best crowd I ever had!"], ["n", "PUFF! A big flower blasts a cloud of pollen!"], ["me", "Ah... AH-CHOO! Lever! Rolling pin, drop the beat! BONK!"]],
  "w8-s4": [[10, "Hmph. Owl. Crumblet's lost in the pumpkins. Walk it out. No loud music."], ["me", "Not even a little garden groove? Fine. Stick close, little muffin! Hoo-hoo-hmm!"]],
  "w8-s6": [["me", "Beanstalk Heights! Beans! Every taco needs beans!"], ["me", "Grab the Recipe Scroll and hold the vine! Wise owl says: never let go of the beans!"]],
  "w8-s7": [[12, "Heyyy, duuude. Nice party. *yaaawn*"], ["me", "Sloba! Wise owl says: a guest who naps at your party is a guest who never leaves!"], [12, "Mmhm. Key's up there. Bounce, dude... zzz."]],
  "w8-s8": [["me", "Scarecrow Stand! Ooh, that scarecrow's got a great party hat!"], ["me", "Forty-five seconds! Mixtape Track forty-five: \"Scared Crow, Brave Owl!\" Hoo-hoo!"]],
  "w8-s9": [["lo2", "Climb, feathered taco! The Meatloaf shall stuff thee with mystery filling!"], ["n", "From the greenhouse, a lumpy voice mutters: \"Am I pork? Am I beans? Would a taco even WANT me?\""], ["me", "Sorry, buddy, the menu's set! WHOOO's climbing? This owl!"]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "Trolley Track! Shopping carts! It's like a taco truck, but tiny! Hoo-hoo!"], ["n", "RUMBLE! A giant rolling pin comes bowling down the aisle!"], ["me", "New dance! The Express Lane! Flap, flap, FLAP!"]],
  "w9-s3": [["me", "Cereal Aisle! Corn flakes as big as surfboards! Tortillas are corn! I'm home again!"], ["me", "Lever! Rolling pin, drop the beat! Clean-up on aisle nine! Hoo-hoo!"]],
  "w9-s4": [[10, "Hmph. Owl. Crumblet's lost in Fruit and Veg. Walk it out. No loud music."], ["me", "Not even a little supermarket muzak? Fine. Stick close, little muffin! Hoo-hoo-hmm!"]],
  "w9-s6": [["me", "Bakery Bluff! Fresh tortillas! Grab the Recipe Scroll, then grab ALL the tortillas!"], ["me", "Wise owl says: the bread aisle is the best aisle. Hold the shelf!"]],
  "w9-s7": [[14, "Let's GOOO! Taco bird! Race ya up the soup cans! Against the current!"], ["me", "Salmonster! Wanna headline my Fish Taco Friday?"], [14, "Holy mackerel, NO! Key chest's up top! Sponge! GOOO!"]],
  "w9-s8": [["me", "Checkout Chaos! Beep, beep, beep! Those scanners have a BEAT!"], ["me", "Forty-five seconds! Mixtape Track forty-seven: \"Beep Beep Checkout!\" It's a two-for-one banger!"]],
  "w9-s9": [["me", "The Frozen Aisle! Brrr! Owls aren't built for this! My cheese is going stiff!"], ["n", "From the back aisle, a spooky voice wails: \"Woooo! Leftovers Night, every night! Woooo!\""], ["me", "Over my crunchy shell! WHOOO's climbing? This owl!"]],
  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Jam Jar Junction! Jam on a taco? Wise owl says: never say never."], ["n", "RUMBLE! A giant rolling pin comes crashing through the jam jars!"], ["me", "New dance! The Jam Session! Flap, flap, FLAP!"]],
  "w10-s3": [["me", "Takeaway Towers! Old taco boxes?! Somebody ordered tacos and FORGOT them? That's a crime!"], ["lo2", "Hah! Leftovers, ATTACK! Make yon owl stale!"], ["me", "WHOOO's ready to party?! Salsa bombs away!"]],
  "w10-s4": [[10, "Hmph. Owl. This is my LAST Crumblet. The very last one. Walk it out of Frost Drawer Falls."], ["me", "One last walk, little muffin! No loud music, promise. Okay, one tiny hoot."], [10, "Hmph. One. A small one."]],
  "w10-s6": [["me", "Paper Chain Pass! Party decorations! They just need some string lights and a DJ!"], ["me", "Grab the Recipe Scroll and hold the pass! Wise owl says: never leave a party early!"]],
  "w10-s7": [["me", "The Forgotten Shelf! Dusty jars, old lids, and a lonely taco shell. Hang in there, buddy!"], [17, "Wheee! Tacowl! Ice to meet you at the back of the fridge! The key's up high!"], ["me", "Pengwhip! Bounce with me! Sponge! BOING! Hoo-hoo!"]],
  "w10-s8": [["lo2", "Hah! The Last Stand, owl! The whole army is here! Thy party is OVER!"], ["me", "Forty-five seconds! Mixtape Track forty-seven and a half: \"Last Stand Shuffle!\" Hoo-hoo!"]],
  "w10-s9": [["me", "The Long Table! So long, so dusty, and not one taco on it! Wise owl says: that's just sad furniture."], ["n", "From the cake-tin throne, a grumpy old voice booms: \"No Tuesdays here, owl! Only LEFTOVERS!\""], ["me", "Not for long! WHOOO's climbing? This owl!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Taco 'bout a combo!", "Hoo! Hoo! HOO-HOO!", "Crunch, crunch, CRUNCH!"],
  lowhp: ["My shell's cracking!", "Somebody pass the salsa!", "Ow! My lettuce is falling out!"],
  perfect: ["Owl be gone! Missed me!", "Hoo-hoo! Too quick!", "Night moves, baby!"],
  levelup: ["Extra cheese! Level up!", "WHOOO's stronger? ME!", "Upgraded to a supreme taco!"],
  secret: ["Hoo-hoo! Hidden snacks!", "Wise owl finds the loot!", "Ooh! Party favors!"],
  boom: ["KA-BLAM! Drop the beat!", "Salsa bombs away!", "That's a spicy BOOM!"],
  mimic: ["Yikes! That box bites!", "WHOOO puts teeth on a box?!", "Bad box! No tacos for you!"],
  objective: ["Done! Tuesday's getting closer!", "Nailed it! Hoo-hoo!", "Job done! Party on!"],
};
