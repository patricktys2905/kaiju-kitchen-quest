// Bubblegumbo: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop. A party hat, a flat balloon and a trail of pink crumbs.
  "w1-s2": [["me", "Pink crumbs! Ooh, somebody's been partying. I'm on the case! Detective Gumbo! Sniff sniff."], ["n", "The trail ends at a snoozing knight made of cutlery. It's Sir Butterknife!"], ["me", "Eep! Knives are for cutting CAKE, mister! Chew on THIS!"]],
  "w1-s3": [["me", "Hey, it's all sticky in here. I fit right in! Hi, gum! Hi, other gum!"], ["me", "The exit wants Sour Gummy Tails. Sorry, worms! Gimme your tails! Wait, that sounded mean."], ["me", "And the Rolling Pin Rogue's at the end? Flat elephant is NOT a party look!"]],
  "w1-s4": [["n", "Aww! A teeny lost Crumblet is hiding under Bubblegumbo's floppy ear!"], ["me", "Hi, little muffin! Stick with me! Get it? STICK? 'Cause I'm gum? Okay, let's go."], ["me", "Big worm with a crown at the end! You hide, muffin. I'll bop King Sour Worm!"]],
  "w1-s6": [["me", "Recipe scroll way up high! Gotta grab it before time runs out. I'll remember! I'll totally remember."], ["me", "What was I grabbing? Oh, right! The scroll! Then the Toaster Tyrant! *POP*"]],
  "w1-s7": [["me", "Ah... AH... AH-CHOO! *POP* Whoops, sneezed a bubble right off my trunk."], ["me", "Treasure chest past the end of the path! Bouncy sponge! BOING! Elephants CAN fly! Sorta!"], ["me", "And a big Cutting Board Golem at the end. Chew on THAT, board!"]],
  "w1-s8": [["foe", "Squeak! Have fun holding out, big guy! I'll be wearing your party hat! Hehehe!"], ["me", "That mouse! Ooh, I'm so mad I forgot what I'm mad about. Hold out, then bop King Pepper Grunt! Go!"]],
  "w1-s9": [["me", "Burners ahead. Hot! My gum's going all droopy. And a Cookie Cutter Witch? Don't cut me into shapes!"], ["mold", "Hehehe... forget the party, little elephant. Everybody else already has."], ["me", "Who said that?! Rude! Elephants never forget a rude voice!"]],
  // World 2: The Fridge. Stiff gum, frosty ears, a cake with his name on it.
  "w2-s2": [["me", "Brrr! I'm so cold my bubbles come out square!"], ["n", "Whoa! Slippery ice, and the Ice Cube Ogre is snoring at the end of the lane!"], ["me", "Stiff legs, stiff legs, hup hup hup! Let's go wake him up!"]],
  "w2-s3": [["me", "Ooh, a lunchbox! A present! For me?"], ["n", "Careful! That's a Lunchbox Mimic, and it's very bitey!"], ["me", "BONK! Ice to meet you! Wait, that's Pengwhip's joke. Fish Finger General, you're next!"]],
  "w2-s4": [[10, "Hmph. You, the pink one. Walk my Crumblet through to the end. Don't sit on it."], ["me", "Sit on it? I'd never! I'm a gentle giant! Mostly gentle. Very giant."], ["me", "King Milk Carton Rammer? Hide, muffin! Chew on THIS, carton!"]],
  "w2-s6": [["me", "Look at all these egg cartons! The recipe scroll's way up high."], ["me", "I tied a string round my trunk so I'd remember! Remember what? Uh, grab the scroll before time runs out. Probably!"]],
  "w2-s7": [["me", "This bridge is pure butter! Whoa, whoa, WHOA! Okay, I'm good."], ["me", "Key chest past the end of the bridge! Cold sponge, bouncy sponge! BOING! Brrr!"], ["me", "Then the Butter Block Brute. Butter versus gum? Sticky wins!"]],
  "w2-s8": [["me", "Hey, ketchup is red! And balloons are red! Balloons! My balloons!"], ["foe", "My balloons now, Gumbo! Squeak! Survive THIS!"], ["me", "I'll hold out, bop King Carrot Sniper, then I'm getting my balloons back, Nibble!"]],
  "w2-s9": [["mold", "Hehehe... stay in the cold, little gum. Stiff and still and forgotten."], ["me", "Forgotten? Me? I'm the one who does the forgetting, thank you very much! Lasagna Lich, here I come!"]],
  // World 3: The Oven. Stretchy gum, smoky glass, somebody's birthday candles.
  "w3-s2": [["me", "Phew, it's so hot my bubbles go floppy. *flub*"], ["n", "WHOOSH! Steam vents blast from the floor, and the Casserole Commander is barking orders!"], ["me", "Steam?! I'll ride it! Boing-oing-oing! Chew on THAT, casserole!"]],
  "w3-s3": [["me", "Every muffin cup looks the same! Did I go this way? I forget!"], ["me", "Ooh, a lunchbox! I remember lunchboxes BITE! That's a first!"], ["me", "And the Pizza Peel Paladin's at the end. Big flat paddle. Don't flip me!"]],
  "w3-s4": [[10, "Hmph. Another Crumblet. It's warm in here, so walk it quick. And keep it off the steam vents."], ["me", "Don't worry, muffin! If it gets hot, I'll blow you a bubble umbrella!"], ["me", "King Popcorn Popper? Pop pop POP! Hey, popping is MY thing!"]],
  "w3-s6": [["me", "Recipe scroll way up high! I'm stretchy now, so I'm extra speedy! Boing-oing-oing!"], ["n", "Hurry! Grab it before time runs out. The Muffin Tin Mortar is waiting at the end!"], ["me", "Bubble Trap, Mortar! You're stuck in gum, mister! *POP*"]],
  "w3-s7": [[15, "B-B-Bubblegumbo! You're m-melting a bit! Is that okay?"], ["me", "It's fine! I'm just extra stretchy! Look, I can tie my trunk in a bow!"], ["me", "Now, the key past the end of the pan! Sponge! BOING! Hey, my bow came undone."]],
  "w3-s8": [["foe", "Squeak! I've got your birthday candles, Gumbo! Hold out if you want 'em back!"], ["me", "MOUSE! *POP* Okay, okay! I'll hold out, Pebble! Then King Kettle Turret! I'm counting on my toes!"]],
  "w3-s9": [["me", "Up here I'm so stretchy I'm basically spaghetti! Pink spaghetti!"], ["mold", "Hehehe... nobody's lighting candles for you, little elephant."], ["me", "Somebody did! The Grease Dragon said so! Ha! I didn't forget THAT!"]],
  // World 4: The Pantry. Dark shelves, the cookie jar, the torn invitation.
  "w4-s2": [["me", "Cheerios! They look like tiny party rings! Ooh, I'm close!"], ["n", "CLANG! Tin cans tumble off the top shelf, and the Flour Sack Sumo stomps at the end!"], ["me", "Eep! Bonk bonk bonk! Run run run! Then sumo time!"]],
  "w4-s3": [["me", "Ooh, all this flour looks like snow! Ooh, I'll make a flour elephant!"], ["n", "Uh-oh! That lunchbox in the snow has TEETH! And the Cereal Box Colossus is waiting at the end!"], ["me", "Bad lunchbox! BAD! Shoo! Chew on THAT!"]],
  "w4-s4": [[10, "Hmph. Cans keep falling in Tin Can Alley. Walk my Crumblet through it. Hold its hand. I mean, um, its frosting."], ["me", "Don't worry, muffin! I'm scared of cans too. And of mice. And of, um, I forget!"], ["me", "Oh right! A King Noodle Lurker! Hide, muffin! I'll noodle HIM!"]],
  "w4-s6": [["me", "Recipe scroll at the top of the spice rack! Ladders, ladders, climb climb climb!"], ["me", "Grab it before time runs out! Wait, did I grab the scroll? Grab the scroll! Then Honey Pot Hermit!"]],
  "w4-s7": [[7, "Hrrm. Young elephant. An ancient proverb says the elephant never forgets."], ["me", "Ooh, that's me! What's the rest of it?"], [7, "Hrrm. I forget. Something about rice. The sponge is over there."]],
  "w4-s8": [["me", "Honey Hollow! Sticky honey! Sticky gum! We're basically cousins!"], ["me", "Hold out till the monsters stop! Okay, team sticky! Let's stick together! Then King Raisin Sniper!"]],
  "w4-s9": [["me", "I've got half an invitation. The half without the WHERE. Aw, nuts."], ["mold", "Drip, drip! The Sink is calling, little gum. Come pop for me. Hehehe!"], ["me", "Pop? *POP* Eep. I mean, NO! Climbing! Hup!"]],
  // World 5: The Sink. Bubbles everywhere, a shiny sink, nearly there.
  "w5-s2": [["me", "Weeee! I LOVE suds!"], ["n", "Drip, drip, SPLOOSH! The taps are dripping, and the Sponge Golem is soaking at the bottom!"], ["me", "A big squishy golem? I love squishy! I'll squish him right back! *POP*"]],
  "w5-s3": [["me", "Ooh, the sponges are pink like me! Hi, cousins!"], ["me", "That lunchbox is grinning at me. Nope! Not a present! SPLOOSH!"], ["me", "Plunger Paladin? Pull THIS, plunger! *POP*"]],
  "w5-s4": [[10, "Hmph. My last Crumblet. Get it past the dishes, and don't let it get soggy."], ["me", "No soggy muffins on MY watch! I'll blow it a bubble boat!"], ["me", "And no King Mouldy Mug either! Hide, muffin! Chew on THAT, mug!"]],
  "w5-s6": [["me", "Bubbles! My people! Hi, bubbles!"], ["me", "Oh, right. Recipe scroll, way up high, before time runs out. THEN I'll say hi to every single bubble."]],
  "w5-s7": [["me", "I'm not going down that plughole! I'm going UP! Sponge! BOING!"], ["me", "Last key in the secret chest. I'll hold it in my trunk. Trunks never forget! Hopefully."]],
  "w5-s8": [["me", "Ew, greasy gum is the WORST gum!"], ["me", "Hold out! I'm counting on toes AND ears this time! Then King Grabby Glove! Hands off!"]],
  "w5-s9": [["mold", "Hehehe... down, down, down, little elephant. Your friends forgot you ages ago."], ["me", "I forget stuff. My friends don't! Ha! Down we go!"]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Ooh, placemats! So fancy! I'll be on my best manners. Elbows off the table!"], ["n", "Ahoy! The Gravy Boat Captain is anchored at the end, and his Gravy Boat Rammers come zooming!"], ["me", "Excuse me! Pardon me! Bubble Trap! *POP*"]],
  "w6-s3": [["me", "Hot wax! Ow! Wax and gum do NOT mix!"], ["me", "Pass the bad guys, please. I'll take a big helping!"], ["me", "Teapot Tyrant at the end? I'm a little teapot! No I'm not. Chew on THIS!"]],
  "w6-s4": [[10, "Hmph. Bubblegumbo. This Crumblet wants to see the world. Walk it past the gravy boats."], ["me", "Muffin on board! Gravy boat ahoy! We'll sail right past! Then bop King Candle Imp!"]],
  "w6-s6": [["me", "Teacups as big as bathtubs! Recipe scroll way up high, and the clock's ticking!"], ["me", "Then the Candelabra Duchess? Hot wax AND fancy manners? Bubble Trap, Duchess! *POP*"]],
  "w6-s7": [["me", "Ooh, a napkin! Lemme tie it round my neck. Fancy elephant!"], ["me", "Key chest past the end of the fort! Sponge! BOING! Hey, my napkin flew off!"]],
  "w6-s8": [["lo2", "Charge, my silverware! Carve yon pink beast like a birthday cake!"], ["me", "Nobody carves the birthday boy! Hold out, forks! Then you, King Teapot Nanny!"]],
  "w6-s9": [["me", "Look how sparkly that chandelier is! Ooh, it's like a party up there!"], ["lo2", "Climb, little pink one! At the top, I shall pop thee like a balloon! Hahaha!"], ["me", "Pop ME? I'm the one who does the popping! *POP* See?"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "I used to play here! I remember this hose! Its name is Hosey!"], ["n", "Uh-oh! A Hot Coal Golem is glowing at the end of Hosey!"], ["me", "I DON'T remember that! Hot coals and gum? Yuck! Chew on THIS!"]],
  "w7-s3": [["me", "Wheee! Sprinklers make my bubbles extra shiny!"], ["me", "Spatula Sheriff! You're toast! Or, uh, a flipped pancake!"]],
  "w7-s4": [[10, "Hmph. Bubblegumbo. My Crumblet wants a dip in the paddling pool. Walk it through. Dry."], ["me", "A pool party?! I love pool parties! Okay, okay, I'll keep it dry. Mostly dry!"], ["me", "And King Ketchup Squirter better not squirt my muffin! Hide, muffin!"]],
  "w7-s6": [["me", "Hey, that's my birthday table! Somebody's leaving sprouts on it! Rude!"], ["me", "Recipe scroll up high! Grab it before time runs out, then bop the Corn Cob Gunner. Lettuce do this!"]],
  "w7-s7": [[18, "In THIS corner! The pink heavyweight! Bubble-GUMBO! Ding ding!"], ["me", "Velvaroo! You remembered my name! I forgot yours. Kidding! Hi, Velvaroo!"], ["me", "Key chest past the flowerpots! Watch this bounce! Ding ding!"]],
  "w7-s8": [["me", "Ooh, nice and chilly in the cooler! My gum's back to perfect chewiness!"], ["lo2", "Forsooth! The Baron shall grill thee well done, beast!"], ["me", "Well done? I'm just getting started! Hold out, then King Corn Cob Cannon! Go!"]],
  "w7-s9": [["me", "Hot coals, smoky air, and I smell a stinky sprout up top."], ["n", "From the grill, a voice booms: \"ATTEN-TION, elephant! You'll be SIZZLED!\""], ["me", "Sizzled? I'll be STICKY! Sticky beats sizzly! Climbing!"]],
  // World 8: The Garden.
  "w8-s2": [["me", "Ooh, a big drippy can! Is that a bath for elephants?"], ["n", "SNAP SNAP! A Snapdragon is waiting at the end, and it's hungry!"], ["me", "Not again! I'm a gentle giant, not a gentle SNACK!"]],
  "w8-s3": [["me", "These sunflowers are taller than me! That NEVER happens!"], ["me", "Ah... AH-CHOO! *POP* Pollen up my trunk! Bless me!"], ["me", "Watering Can Wizard? Ooh, magic! Bad magic. Chew on THIS!"]],
  "w8-s4": [[10, "Hmph. Bubblegumbo. Crumblet's lost in the Pumpkin Patch. Walk it through. Don't sit on it."], ["me", "I'd never! I sat on a pumpkin once. Did I? I forget. Come on, muffin! Duck the tomatoes!"]],
  "w8-s6": [["me", "The recipe scroll's at the top of the beanstalk! Climb, trunk, climb! Before time runs out!"], ["me", "Gnome General! Ow! Bubble Trap! Chew on THAT, gnome!"]],
  "w8-s7": [[16, "Stay frosty, big guy. You're looking a little melty."], ["me", "Minturtle! I'm stretchy, not melty! Wanna stick together in the shade?"], [16, "Cool, cool, cool. Key's past the end of the path. Sponge time, dude."]],
  "w8-s8": [["me", "Hi, Mister Scarecrow! You look like somebody I forgot!"], ["n", "Here they come! Hold out till they stop! Then King Radish Bomber's waiting!"], ["me", "Let's stick together, scarecrow! You take the left!"]],
  "w8-s9": [["lo2", "Climb, pink beast! The Meatloaf shall mash thee in with his mystery bits!"], ["me", "Mystery bits? Ooh, maybe my party hat's in there! Climbing!"]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "Ooh, a shopping cart! Can I ride in the little seat?"], ["n", "RUMBLE! The Trolley Chariot comes racing down the aisle, and the freezers blast icy air!"], ["me", "Clean-up on aisle ME! Chew on THIS, chariot!"]],
  "w9-s3": [["me", "Cheerios as big as hula hoops! Party rings again!"], ["me", "Coupon Ghosts! The exit wants your coupons! Then the Cash Register Golem! Ka-ching!"]],
  "w9-s4": [[10, "Hmph. Bubblegumbo. Crumblet's lost in Fruit and Veg. Walk it through. Don't sit on it."], ["me", "I'd never! Ooh, melons! Can I sit on THOSE? No? Okay. Come on, muffin!"]],
  "w9-s6": [["me", "Cakes everywhere! Is it somebody's birthday? Is it MINE again?"], ["me", "Recipe Scroll first, way up high, before time runs out! Then the Price Gun Paladin! Then cake! *POP*"]],
  "w9-s7": [[14, "Let's GOOO! Big pink guy! Race ya up the cans! I always go the hard way!"], ["me", "Ooh, a race! I forget the rules. Is it the one with the sponge? BOING!"], [14, "Holy mackerel, that works! Key's yours, buddy!"]],
  "w9-s8": [["me", "Beep! Beep! Hey, they're scanning ME! What's my price?"], ["lo2", "Hah! Bag yon pink beast! Two for one!"], ["me", "Nobody bags the birthday boy! Hold out, then King Dented Can Turret! Chew on THIS!"]],
  "w9-s9": [["me", "Brrr! My gum's going stiff again! Square bubbles!"], ["n", "From the back aisle, a spooky voice wails: \"Woooo! Forget your wand, little elephant! Forget EVERYTHING! Woooo!\""], ["me", "Hey! Forgetting is MY job! Climbing! *POP*"]],
  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Jam and gum? Double sticky! I fit right in!"], ["n", "BLOOP! A bowl of Forgotten Soup bubbles at the end. Nobody's finished it in YEARS!"], ["me", "Forgotten soup? Poor soup! Chew on THIS anyway! *POP*"]],
  "w10-s3": [["me", "Noodle boxes everywhere! Ooh, did I order these? I forget!"], ["me", "A Banquet Butler at the end? Ooh, fancy! Bubble Trap, you moldy lot!"]],
  "w10-s4": [[10, "Hmph. Bubblegumbo. My very LAST Crumblet. Walk it down the Frost Drawer. Don't sit on it."], ["me", "I'd never! Not even once! Come on, muffin! Last walk, best walk!"], [10, "Hmph. And don't forget it this time."]],
  "w10-s6": [["me", "Somebody had a party here and forgot all about it! I know the feeling!"], ["me", "Recipe Scroll up high! Grab it before time runs out! I tied a string round my trunk. For SOMETHING!"]],
  "w10-s7": [["me", "Hey, these old jars have names written on them! Like my ears!"], [3, "Wibble wobble! Gumbo! Is there a dessert table at this feast? Can I come?"], ["me", "Everybody can come, Bloblin! First, the key! Sponge! BOING!"]],
  "w10-s8": [["lo2", "Hah! The Last Stand, pink beast! Forget thy friends and FLEE!"], ["foe", "Squeak! Nobody's forgetting anybody! Hold out, Gumbo! I've got your back!"], ["me", "Let's stick together, Brittle! Then King Party Cracker Bomber! Chew on THIS, army!"]],
  "w10-s9": [["me", "This table's so long and so empty! No cake, no balloons, no NOTHING!"], ["n", "From the cake-tin throne, a grumpy voice booms: \"Forget the feast, elephant! Everybody else did!\""], ["me", "Not me! Elephants never forget a party! Climbing! *POP*"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Pop! Pop! POP!", "Bubble, bubble, BUBBLE!", "Chew on THAT! And that!"],
  lowhp: ["Ow! My gum's losing its chew!", "Uh-oh, I'm getting holes!", "Elephants never... ouch!"],
  perfect: ["Whoosh! Stretchy dodge!", "Missed me! *POP*", "Big AND bouncy! Ha!"],
  levelup: ["Bigger bubbles! Yay!", "Level up! I'll remember this!", "Extra chewy now!"],
  secret: ["Ooh, a present! For me?", "Treasure! I'll remember where! Nope.", "BOING! Found a goodie!"],
  boom: ["KA-BLAM! Party popper!", "Bonk! Pin goes flat!", "BOOM! Like a big balloon!"],
  mimic: ["Eek! The box has teeth!", "That's no present!", "Rude box! Chew on THIS!"],
  objective: ["Done! I didn't even forget!", "Job done! Party time!", "Woo! Let's stick together!"],
};
