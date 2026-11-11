// Tacowl: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop. Too sunny for a night owl, and nobody answers.
  "w1-s2": [["n", "Click! The kitchen lights go out on the Crumb Trail!"], ["me", "Finally, NIGHT! My favorite! Now I can see everything! WHOOO's ready to party?!"], ["me", "Crickets. Actual crickets. And Sir Butterknife snoring in the boss room. Tough crowd."]],
  "w1-s3": [["me", "Gummy Gully! My talons are stuck! Wise owl says: never land on a gummy bear."], ["me", "A loot box with teeth? Lunchbox Mimic! And the Rolling Pin Rogue's waiting at the end. Let's drop the beat! BONK!"]],
  "w1-s4": [["n", "Aww! A little lost Crumblet is peeking out from behind the salt shaker!"], ["me", "Hey, little muffin! Ride along with DJ Tacowl! Stay clear of the burners, okay?"], ["me", "They shoot fire. Great for a show, bad for muffins! And King Sour Worm's at the end. Sour crowd!"]],
  "w1-s6": [["me", "The Chef's Recipe Scroll! Maybe it's the Taco Tuesday recipe! It's way up high, so I gotta fetch it fast!"], ["n", "Uh-oh! The Toaster Tyrant is snoring in the boss room!"], ["me", "Paprika party crashers first! Salsa bombs away!"]],
  "w1-s7": [["me", "Who put all this pepper in the pass? Ah... AH-CHOO! Whoa, I sneezed out a tortilla chip!"], ["me", "A key in a high chest? Owls flap, sponges BOING. Let's do both!"]],
  "w1-s8": [["me", "Lights out again! Hold out while monsters pour in? That's just a party with rude guests!"], ["me", "Note for my Taco Tuesday mixtape: Track one, \"Countertop Showdown.\" King Pepper Grunt gets a remix!"]],
  "w1-s9": [["me", "Burners ahead! My lettuce is wilting! Do NOT look at my lettuce!"], ["mold", "Hehehe... it's Monday, little owl. It's always gonna be Monday."], ["me", "Who said that?! Rude! Nobody says Monday that creepy!"]],
  // World 2: The Fridge. Dark, chilly, and full of taco fixings.
  "w2-s2": [["me", "Dairy Lane! Sour cream! Shredded cheese! Somebody pinch me, I'm in taco heaven!"], ["me", "Monday number twelve, by the way. And an Ice Cube Ogre in the boss room. Not that I'm counting. Okay, I'm counting."]],
  "w2-s3": [["n", "Whoa! The Frosty Shelf is crawling with Melty Ice Pops!"], ["me", "And that lunchbox has teeth. I'm NOT opening the lunchbox. Fish Finger General, though? Taco filling!"]],
  "w2-s4": [[10, "Hmph. Owl. That's one of my Crumblets. Lights are out, so walk it to the exit. Carefully."], ["me", "Lights out is MY time, Mr. Bluebeary! I see in the dark! Hoo-hoo!"], [10, "Hmph. Fine. Don't play your loud music at it."]],
  "w2-s6": [["me", "Egg Carton Cliffs! Twelve eggs and not one breakfast taco. What a waste!"], ["me", "Scroll's way up top, clock's ticking! Wise owl says: hold the scroll, not the eggs. Then grate The Cheese Wheel!"]],
  "w2-s7": [["me", "Butter Bridge! Slippery talons! Whoa, whoa, WHOA!"], [4, "Ooooh, a round glowy owl... are you the moon?"], ["me", "Nope! But night owls and moon-lovers are basically cousins, Mothball! Now, BOING to the key!"]],
  "w2-s8": [["me", "Ketchup Canyon! Ketchup on tacos? Hmm. Don't tell Señor Sting I said hmm."], ["me", "Hold out! Mixtape Track two: \"Cold Feet, Hot Beats!\" King Carrot Sniper's on backup vocals!"]],
  "w2-s9": [["n", "Uh-oh! The Ice Tray Steps are swarming, and a Leftover Lasagna Lich waits at the top!"], ["me", "Ooh, a big crowd! WHOOO's ready to party?!"], ["me", "Growling? Is growling a yes? I'm counting it as a yes!"]],
  // World 3: The Oven. Warm tortillas, a cracked shell, and the Chef's trail.
  "w3-s2": [["me", "Bottom rack. Whew! It's hotter in here than Señor Sting's sauce!"], ["foe", "NOTHING is hotter than my sauce, owl! Bzzzt!"], ["me", "How are you even HERE?!"]],
  "w3-s3": [["me", "Muffin Tin Maze! Every cup looks the same. Wise owl says: when lost, eat a muffin."], ["me", "Nope, NOT eating the muffins. Popcorn Poppers, though? Gimme those Popped Kernels! Taco topping!"]],
  "w3-s4": [["me", "A little Crumblet in the Oven? Hop under my wing, shorty! It's shady under here!"], ["me", "Steer clear of the steam vents. They're the only things in here louder than me!"]],
  "w3-s6": [["n", "Click! The oven light flickers out over the Cookie Sheet!"], ["me", "Night shift! My favorite! Grab the scroll up top before time runs out, then the Muffin Tin Mortar!"]],
  "w3-s7": [[15, "T-T-Tacowl! Your shell's c-c-cracked!"], ["me", "It's fine, Hotchog! Cracked shells are just extra crunchy! Now, sponge to the key chest! BOING!"]],
  "w3-s8": [["me", "Pizza Stone! Hot stone, hot beats! Hold out!"], ["me", "Mixtape Track nine: \"Sizzle Sizzle Hoo-Hoo.\" King Kettle Turret's on the whistle. Still working on the title."]],
  "w3-s9": [["me", "Top rack! I smell warm tortillas. The Chef was HERE!"], ["mold", "Hehehe... warm tortillas go cold, little owl. Mondays never end."], ["me", "Stop saying Monday like that! It gives me shell-shivers!"]],
  // World 4: The Pantry. Spices, beans, and the Chef's lime-and-cilantro trail.
  "w4-s2": [["me", "Cereal Canyon! Corn flakes, corn puffs, CORN! Tortillas are corn! I'm home!"], ["me", "Monday number thirty-one. Wise owl says: never count Mondays. Too late!"]],
  "w4-s3": [["me", "Flour everywhere, like snow! Ooh, tortilla flour! The Chef's been here!"], ["n", "Uh-oh! That lunchbox just grew teeth! It's a Lunchbox Mimic!"], ["me", "Boo yourself! Salsa bomb! Cereal Box Colossus, you're next!"]],
  "w4-s4": [["n", "SLAM! The pantry door shuts, and Tin Can Alley goes pitch black!"], ["me", "Don't worry, little Crumblet! Owl eyes! I see EVERYTHING. Including those falling cans. Stay close!"]],
  "w4-s6": [["me", "Spice rack! Cumin! Chili powder! It smells like Taco Tuesday in here!"], ["me", "Grab the scroll before time runs out, beat the Honey Pot Hermit, THEN I'm swiping a pinch of cumin!"]],
  "w4-s7": [[7, "Hrrm. Young owl. They say the owl is the wisest of birds."], ["me", "Yup! And my wisdom says: always bring extra salsa!"], [7, "Hrrm. Very wise. I say the same about rice. Sponge is that way."]],
  "w4-s8": [["me", "Honey Hollow! Sticky! Honey on a taco? Weird. I kinda wanna try it."], ["me", "Hold out! Mixtape Track twenty: \"Stuck in Honey.\" It's a slow jam. Very slow."]],
  "w4-s9": [["me", "The top shelf! Sniff sniff. Lime and cilantro! The Chef's apron smells just like that!"], ["mold", "Drip, drip... hear the Sink, little owl? Your Chef is down here with ME. Hehehe!"], ["me", "Then I'm coming down! WHOOO's ready? ME!"]],
  // World 5: The Sink. Last stop before Tuesday.
  "w5-s2": [["n", "Drip, drip! The taps are dripping all over the Suds Slide!"], ["me", "Not now, taps! I've got a party to get to, and a Sponge Golem to squeeze! Flap, flap, FLAP!"]],
  "w5-s3": [["me", "Sponge Shoals! WHOOO's ready to get scrubbed?!"], ["me", "Straw Snakes drop Straw Bits! Grab 'em, open the portal, then the Plunger Paladin drops like a bass line! Hoo-hoo!"]],
  "w5-s4": [[10, "Hmph. Owl. My last Crumblet. Get it across Dish Rack Ridge, and keep its frosting dry."], ["me", "Dry frosting, coming right up! No splashing, no loud music. Okay, a LITTLE music."]],
  "w5-s6": [["me", "Bubble Bay! Bubbles everywhere? It's a foam party!"], ["me", "Grab the scroll up high before time runs out, then party. I mean, the Dish Soap Siren. Same thing!"]],
  "w5-s7": [["me", "Plughole Pass! Do NOT drop anything down the plughole. Especially not the key!"], ["me", "The chest's up on the high ledge. Good thing sponges make great launch pads! Hoo-hoo!"]],
  "w5-s8": [["me", "Greasy Pan Pits! Grease on my feathers? Ew! I'll wash up after the party!"], ["me", "Mixtape Track thirty-nine: \"Hold Out, Greasy!\" King Grabby Glove's clapping along. It's a banger!"]],
  "w5-s9": [["mold", "Hehehe... come down the drain, little owl. Down here, every day is MONDAY."], ["me", "Well, I've got a calendar to fix and a Chef to find! Going down! Hoo-hoo!"]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Placemat Plains! Flat and fancy! Perfect for a moonlit flight and..."], ["n", "DRIP! Hot wax splashes down from the candles!"], ["me", "Nope! Gravy Boat Captain, you're next! Flap, flap, FLAP!"]],
  "w6-s3": [["me", "Candelabras! Fancy party lighting! OW! Hot wax! TOO fancy!"], ["me", "A Teapot Tyrant in the boss room? Every good party needs a bouncer. Tonight, it's ME!"]],
  "w6-s4": [[10, "Hmph. Owl. This Crumblet wants to see the world. Walk it past the gravy boats. No loud music."], ["me", "No music?! Fine. I'll hum. Hoo-hoo-hmm-hmm!"]],
  "w6-s6": [["me", "Teacup Terrace! A tea party? Ooh, I LOVE a party. Even a pinky-up party!"], ["me", "Grab the scroll before time runs out, and keep an eye on that Candelabra Duchess!"]],
  "w6-s7": [["me", "Napkin Fold Fort! Napkins! Every taco party needs a TON of napkins!"], ["me", "Chest way up high? I'll flap, the sponge'll boing, and we'll call it teamwork!"]],
  "w6-s8": [["lo2", "Charge, my silverware! Fork yon owl like a crusty taco!"], ["me", "Hold out! Mixtape Track forty-two: \"Fork It Over!\" King Teapot Nanny's on the kettle drum!"]],
  "w6-s9": [["me", "Chandelier Climb! Look at all those lights! Ooh, the party's gonna need this!"], ["lo2", "Forsooth! Climb, feathered snack! At the top, I shall make thee a stale tostada!"], ["me", "A tostada? Rude! Right shape, but RUDE!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "Hose Highway! Long and bendy. Great dance floor!"], ["n", "Uh-oh! Ember Fireflies, and a Hot Coal Golem in the boss room!"], ["me", "Fireflies! Free disco lights! The golem, though? Too hot to dance! Flap, flap, FLAP!"]],
  "w7-s3": [["n", "FWOOSH! The sprinklers burst up and blast Tacowl into the air!"], ["me", "Whoa! A free sprinkler show! Spatula Sheriff, you're invited! Hoo-hoo!"]],
  "w7-s4": [[10, "Hmph. Owl. This Crumblet's never seen a pool. Walk it round the edge. No cannonballs."], ["me", "No cannonballs? Aw. Okay, little muffin, stick with me! I'll hoot if anything splashy comes!"]],
  "w7-s6": [["me", "Picnic Table Peak! Paper plates, plastic forks... a taco party waiting to happen!"], ["me", "Grab the Recipe Scroll up top, fast! Then the Corn Cob Gunner! Corn? Tortillas are corn! Hoo-hoo!"]],
  "w7-s7": [[18, "In THIS corner! A tiny taco with wings! Ding ding! Wanna spar?"], ["me", "Spar? I'm a party host, not a boxer! But I throw a mean salsa bomb!"], [18, "Ha! I like ya, feathers! Key's up on that ledge. Bounce on the sponge, champ!"]],
  "w7-s8": [["me", "Cooler Canyon! Ice, sodas and a cold breeze. Ahhh, night owl weather!"], ["me", "Hold out! Mixtape Track forty-four: \"Chill Out, Grill Out!\" Hoo-hoo!"]],
  "w7-s9": [["me", "Charcoal Climb! Hot coals, big smoke. My feathers are getting toasty!"], ["lo2", "Hah! The Baron shall grill thee, owl! Well done and extra crunchy!"], ["me", "Extra crunchy is my BEST look! WHOOO's climbing? This owl!"]],
  // World 8: The Garden.
  "w8-s2": [["me", "Watering Can Run! Ooh, a misty spout! Free fog machine for the dance floor!"], ["n", "Look out! A Snapdragon is snapping in the boss room!"], ["me", "Snap along to the beat, buddy! Flap, flap, FLAP!"]],
  "w8-s3": [["me", "Sunflower Grove! Tall flowers all facing the stage. Best crowd I ever had!"], ["n", "PUFF! A big flower blasts a cloud of pollen!"], ["me", "Ah... AH-CHOO! Watering Can Wizard, wanna be my fog machine? No? Salsa bombs away!"]],
  "w8-s4": [[10, "Hmph. Owl. Crumblet's lost in the pumpkins. Walk it out. No loud music."], ["me", "Not even a little garden groove? Fine. Stick close, little muffin! Hoo-hoo-hmm!"]],
  "w8-s6": [["me", "Beanstalk Heights! Beans! Every taco needs beans!"], ["me", "Grab the Recipe Scroll up top before time runs out! Wise owl says: never let go of the beans!"]],
  "w8-s7": [[12, "Heyyy, duuude. Nice party. *yaaawn*"], ["me", "Sloba! Wise owl says: a guest who naps at your party is a guest who never leaves!"], [12, "Mmhm. Key's up there. Bounce, dude... zzz."]],
  "w8-s8": [["me", "Scarecrow Stand! Ooh, that scarecrow's got a great party hat!"], ["me", "Hold out! Mixtape Track forty-five: \"Scared Crow, Brave Owl!\" King Radish Bomber's on drums! Hoo-hoo!"]],
  "w8-s9": [["lo2", "Climb, feathered taco! The Meatloaf shall stuff thee with mystery filling!"], ["n", "From the greenhouse, a lumpy voice mutters: \"Am I pork? Am I beans? Would a taco even WANT me?\""], ["me", "Aw, buddy, everybody's welcome at my party! First I gotta get up there, though! Hoo-hoo!"]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "Trolley Track! Shopping carts! It's like a taco truck, but tiny! Hoo-hoo!"], ["n", "Uh-oh! Trolley Rammers, and a Trolley Chariot parked in the boss room!"], ["me", "New dance! The Express Lane! Flap, flap, FLAP!"]],
  "w9-s3": [["me", "Cereal Aisle! Corn flakes as big as surfboards! Tortillas are corn! I'm home again!"], ["me", "A loot box with teeth? Nope! Then the Cash Register Golem! Ka-ching! Hoo-hoo!"]],
  "w9-s4": [[10, "Hmph. Owl. Found another one in the grapes. Exit's that way. And no loud music."], ["me", "How about elevator music? It's SO quiet! Okay, okay. Stick close, little muffin!"]],
  "w9-s6": [["me", "Bakery Bluff! Fresh tortillas! Grab the Recipe Scroll fast, then grab ALL the tortillas!"], ["me", "Wise owl says: the bread aisle is the best aisle. Price Gun Paladin, I'm not for sale!"]],
  "w9-s7": [[14, "Let's GOOO! Taco bird! Race ya up the soup cans! Against the current!"], ["me", "Salmonster! Wanna headline my Fish Taco Friday?"], [14, "Holy mackerel, NO! Key chest's up top! Sponge! GOOO!"]],
  "w9-s8": [["me", "Checkout Chaos! Beep, beep, beep! Those scanners have a BEAT!"], ["me", "Hold out! Mixtape Track forty-seven: \"Beep Beep Checkout!\" King Dented Can Turret's on bass!"]],
  "w9-s9": [["me", "The Frozen Aisle! Brrr! Owls aren't built for this! My cheese is going stiff!"], ["n", "From the back aisle, a spooky voice wails: \"Woooo! Leftovers Night, every night! Woooo!\""], ["me", "Over my crunchy shell! Owls don't DO Leftovers Night! Up I go!"]],
  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Jam Jar Junction! Jam on a taco? Wise owl says: never say never."], ["n", "Uh-oh! A pot of Forgotten Soup is bubbling in the boss room!"], ["me", "Soup? On Taco Tuesday? New dance! The Jam Session! Flap, flap, FLAP!"]],
  "w10-s3": [["me", "Takeaway Towers! Old taco boxes?! Somebody ordered tacos and FORGOT them? That's a crime!"], ["lo2", "Hah! Leftovers, ATTACK! Make yon owl stale!"], ["me", "WHOOO's ready to party?! Banquet Butler, you're on snack duty! Salsa bombs away!"]],
  "w10-s4": [[10, "Hmph. Owl. This is my LAST Crumblet. The very last one. Walk it out of Frost Drawer Falls."], ["me", "One last walk, little muffin! No loud music, promise. Okay, one tiny hoot."], [10, "Hmph. One. A small one."]],
  "w10-s6": [["me", "Paper Chain Pass! Party decorations! They just need some string lights and a DJ!"], ["me", "Grab the Recipe Scroll before time runs out, then the Pudding Juggernaut! Never leave a party early!"]],
  "w10-s7": [["me", "The Forgotten Shelf! Dusty jars, old lids, and a lonely taco shell. Hang in there, buddy!"], [17, "Wheee! Tacowl! Ice to meet you at the back of the fridge! The key's up high!"], ["me", "Pengwhip! Bounce with me! Ready? One, two, BOING! Hoo-hoo!"]],
  "w10-s8": [["lo2", "Hah! The Last Stand, owl! The whole army is here! Thy party is OVER!"], ["me", "Hold out! Mixtape Track forty-seven and a half: \"Last Stand Shuffle!\" Hoo-hoo!"]],
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
