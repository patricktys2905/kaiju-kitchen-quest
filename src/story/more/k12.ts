// Sloba: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop. A cold tea, a long walk and the Chef's tea bag.
  "w1-s2": [["me", "Heyyy, look at all these crumbs. They're, like, little pillows. Nap time? Yeah, nap time."], ["n", "Uh-oh! Sir Butterknife waits in the boss room, and the portal wants Jam Globs and Mouldy Crusts!"], ["me", "A knight who naps in his room? My kinda guy. Okay, Jam Blobs first. Slooowly."]],
  "w1-s3": [["me", "Uh-oh, I'm stuck in the goo. Eh, I was gonna sit here anyway."], ["n", "Careful! One of these lunchboxes has TEETH. And the Rolling Pin Rogue waits at the end!"], ["me", "A rolling pin with a name? Duuude, he's gonna roll right past me. Everybody does."]],
  "w1-s4": [[10, "You, sloth. Walk my Crumblet to the boss room. And stay AWAKE. King Sour Worm's in there."], ["me", "A king worm? Duuude, that's a big noodle. Okay, little muffin, hold my claw. If I snore, poke me."]],
  "w1-s6": [[11, "Beep beep! First one to the Spice Shelf! Five-star speed! Wait, why are YOU here?"], ["me", "Got here an hour ago, dude. I took the straw. Scroll's way up high before time runs out? Sure. In a sec."]],
  "w1-s7": [["me", "Ah. Ahh. AH-CHOO! Whoa, who peppered this place? That sneeze woke me right up."], ["me", "Bouncy sponge way past the end of the map. BOING! Heyyy, I'm flying. Wake me when I land."]],
  "w1-s8": [["foe", "Hurry hurry HURRY! Hold out while the monsters pour in, slowpoke! Then King Pepper Grunt! I could do it in TEN!"], ["me", "Ten what? Naps? Okay, monsters, pile on. I'll just hang here. *yaaawn*"]],
  "w1-s9": [["me", "Mmm, these burners shoot big warm flame pillars. Perfect nap weather. Cookie Cutter Witch, wake me when it's my turn."], ["mold", "Hehehe... sleep, little sloth. Sleep while your tea goes cold."], ["me", "It's already cold, dude. That's kinda the whole reason I'm up."]],
  // World 2: The Fridge. Frosty fur, the Chef's milk, a very buzzy bird.
  "w2-s2": [["me", "Heyyy, milk everywhere! I need milk for my tea. Lemme just grab a carton and-"], ["n", "Not yet! The portal wants Popsicle Sticks and Cheese Crumbs. And an Ice Cube Ogre guards the end!"], ["me", "Okay, milk later. Ice pops now. Ew, chores."]],
  "w2-s3": [["me", "There's frost on my fur. I'm a bubble tea slushie now."], ["me", "A lunchbox with teeth AND a Fish Finger General? Cool, cool. Like, literally cool. Slip, slide, BONK."]],
  "w2-s4": [[10, "Sloth! My Crumblet's freezing. Get it to the boss room, and keep it moving, would ya?"], ["me", "Moving's not really my thing. But for you, little muffin? Slow and steady beats a King Milk Carton Rammer."]],
  "w2-s6": [["me", "Duuude, egg carton cliffs. Every little cup is a tiny bed."], ["me", "Okay, okay. Scroll first, before time runs out. THEN bed. Then The Cheese Wheel. Go go go. Gently."]],
  "w2-s7": [["me", "Wheee! This butter's so slippy, I'm not even walking. I'm sliding. Way less effort."], ["me", "Key chest past the end of the map? Bouncy sponge to the rescue. BOING! Brrr, it's a cold sponge."]],
  "w2-s8": [["foe", "There you are! I lapped this canyon NINETEEN times! Monsters incoming! Hold out, slowpoke! Bean Spray!"], ["me", "Nineteen laps, wow. I did zero, and we're both here. Think about it, dude. Then King Carrot Sniper."]],
  "w2-s9": [["me", "A Leftover Lasagna Lich at the top of the ice trays? Heyyy, lasagna's a nap food, dude."], ["mold", "Hehehe... stay in the cold, little sloth. Cold fur, cold tea, cold forever."], ["me", "Nah. I'm getting fresh tea. With pearls. Dream big, mold dude."]],
  // World 3: The Oven. Toasty trays, sleepy sloth, a bag of brown sugar.
  "w3-s2": [["me", "Mmm, this rack's so toasty. I could nap right here."], ["n", "FSSSH! A steam vent launches her sky-high! And the portal wants Popped Kernels from the Popcorn Poppers!"], ["me", "Okay, no nap. Popcorn AND a flight? Movie night, dude. Vine Swing! Wheee!"]],
  "w3-s3": [["me", "Sooo many monsters in this muffin tin. Heyyy, guys, one at a time?"], ["me", "Nope? Okay. Bonk, bonk, bonk, then the Pizza Peel Paladin. And I'm NOT opening that bitey lunchbox. Tea-rrific."]],
  "w3-s4": [[10, "It's hot in here, sloth. Walk my Crumblet to the boss room quick. QUICK."], ["me", "Quick-ish, papa bear. Hop on my back, little muffin. It's a really slow bus. Next stop, King Popcorn Popper."]],
  "w3-s6": [[17, "Wheee! Can't brake! Can't BRAKE! Sloba?! How'd you get to the end of the tray before me?!"], ["me", "I didn't run, so I didn't slip. Scroll's up high. Grab it before time runs out, then the Muffin Tin Mortar."]],
  "w3-s7": [["me", "Hot hot hot! My pearls are getting all bouncy in this roasting pan."], ["me", "Sponge past the end of the map, key chest up top. BOING! A flying bubble tea. That's a rare sight, dude."]],
  "w3-s8": [["foe", "Caffeine Rain! Drink it in, sloth! Monsters, monsters, MORE monsters! Hold out if you can!"], ["me", "No coffee, thanks. I'm a tea girl. Steeping now. King Kettle Turret, put the kettle on, dude."]],
  "w3-s9": [["me", "Climbing ladders is just hanging, but upward. I'm, like, a natural."], ["mold", "Hehehe... why climb, little sloth? The Gingerbread Gladiator waits up top. Lie down. Rest forever."], ["me", "Tempting. Super tempting. Nope! Tea first."]],
  // World 4: The Pantry. Cozy shelves, a wise old dragon, a jar of pearls.
  "w4-s2": [["me", "Crunchy cereal pillows everywhere. Five more minutes, cereal."], ["n", "CLANG! A tin can lands right next to her head! And Flour Sack Sumo waits at the end!"], ["me", "Fine, fine! I'm awake! Cracker Crawlers, hand over those shards. Crunch crunch crunch!"]],
  "w4-s3": [["me", "Ooh, all this flour's soft like snow. It's like a giant pillow made of snow."], ["me", "A bitey lunchbox? A Cereal Box Colossus? Don't mess with my pillow, dudes. POOF!"]],
  "w4-s4": [[10, "Cans fall outta nowhere in this alley, sloth. Walk my Crumblet out, and no snoring!"], ["me", "No snoring, got it. Little muffin, if you hear a snore, it's King Noodle Lurker. Probably."]],
  "w4-s6": [["me", "The recipe scroll's way up high, and the clock's ticking. I'm not, though."], ["me", "Grab it before time runs out, then say hi to the Honey Pot Hermit. Hermits nap a lot. We'll get along."]],
  "w4-s7": [[7, "Hrrm. Young sloth. An ancient proverb: the slow tea leaf steeps the strongest."], ["me", "Whoa, Norigon. That's deep. Is it about tea?"], [7, "Hrrm. It is ALWAYS about tea. Sometimes rice. The sponge is over there."]],
  "w4-s8": [["me", "Honey everywhere. Sticky and sweet, like boba syrup. Mmm."], ["foe", "Sugar Trap! Gotcha! Now hold out while the monsters pile in, sloth! Hurry hurry HURRY!"], ["me", "Sticky? I'm used to it, little buddy. Yawn, swing, repeat. Then King Raisin Sniper."]],
  "w4-s9": [["me", "Tea bag, milk, sugar, pearls. All I need now is the Chef."], ["mold", "Drip, drip! The Chef is down MY drain, sleepy sloth. Come and get them. Hehehe!"], ["me", "Sure thing. Spice Rack Shaman first. Gimme five minutes. I'm climbing!"]],
  // World 5: The Sink. Bubbles like boba, the drain, a fresh tea at the bottom.
  "w5-s2": [["me", "Bubbles! They're like boba, but see-through. Wheee!"], ["n", "Drip, DROP! The taps are dripping, and the portal wants Plate Shards and Soap Bubbles!"], ["me", "Soap boba? I'll collect 'em. Then a squishy Sponge Golem. Sounds like a mattress fight, dude."]],
  "w5-s3": [["me", "This sponge is so squishy. It's like a mattress that drinks. Five more minutes?"], ["me", "Nope, the Plunger Paladin's waiting. And that lunchbox has teeth. Rude. Grabby Gloves, gimme those fingers."]],
  "w5-s4": [[10, "My last Crumblet, sloth. Get it past the dishes. And, um, thanks. Don't tell anybody."], ["me", "Your secret's safe, papa bear. I'll forget it in my next nap anyway."]],
  "w5-s6": [["me", "A whole bay of bubbles? Duuude, it's like a giant boba with no tea."], ["me", "Grab the scroll before time runs out, then shush the Dish Soap Siren. No pressure, just tea-sure."]],
  "w5-s7": [["me", "I'm not going down the plughole yet. I'm going UP. BOING!"], ["me", "Got the last key! I'll keep it in my fur, right next to the spare pearls."]],
  "w5-s8": [["foe", "There you are! I waited FOREVER! Like, two whole minutes! Hold out against THIS crowd, sloth!"], ["me", "Two minutes? Wow. That's my record for staying awake. Okay, monsters, line up. Then King Grabby Glove."]],
  "w5-s9": [["me", "A Clogged Drain Hag at the bottom? Heyyy, I'll unclog ya. Slowly."], ["mold", "Hehehe... down, down, down, sleepy sloth. Down here your tea goes cold forever."], ["me", "Not forever, dude. Just till I get there. Which is, like, now."]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Ooh, fancy. There are napkin pillows everywhere. Okay, tiny nap."], ["n", "No naps! The portal wants Napkin Scraps and Fork Prongs, and the Gravy Boat Captain is waiting!"], ["me", "Excuse me, pardon me, sloth coming through. Slowly. Okay, FASTER!"]],
  "w6-s3": [["me", "Ow, hot wax! Waxed fur is NOT a look, dude."], ["me", "A Teapot Tyrant up ahead? A TEAPOT? Duuude, this is personal. Pass me the victory, please. No rush."]],
  "w6-s4": [[10, "Sloth! This Crumblet wants to see the world. Walk it past the gravy boats, would ya?"], ["me", "Hop on, little muffin. We're going on a gravy boat cruise. A very slow cruise. Best kind."]],
  "w6-s6": [["me", "Teacups as big as bathtubs! Duuude, this is, like, my dream."], ["me", "Aw, they're all full of STALE tea. Grab the scroll before time runs out. This is personal now."]],
  "w6-s7": [["me", "All these folded napkins look like little beds. Gotta stay awake. Gotta."], ["me", "Sponge up to the key chest. BOING! Heyyy, I landed on a napkin bed. Five more minutes."]],
  "w6-s8": [["lo2", "Charge, my silverware! Skewer yon sleepy sloth!"], ["me", "Forks? Rude. I'll just hang here upside down till you get bored. Then King Teapot Nanny. Tea time!"]],
  "w6-s9": [["me", "Hanging way up high on a chandelier? This is my thing, dude. Vine Swing! Wheee!"], ["lo2", "Climb, furry varlet! At the top I shall make thee as stale as thy tea!"], ["me", "Nah. My tea's getting fresh again. Like, any day now."]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "Ooh, a long green hose. I could hang off it like a nap swing."], ["n", "BZZZ! Picnic Wasps! The portal wants their Stingers, plus Ember Glows from the fireflies!"], ["me", "Nap cancelled. Bug hunt. Ugh, summer cardio."]],
  "w7-s3": [["me", "WHOA! The sprinkler launched me! Wheee! Okay, that woke me up."], ["me", "A Spatula Sheriff runs this town? Heyyy, Sheriff. I'm just passing through. Slooowly."]],
  "w7-s4": [[10, "Sloth! My Crumblet wants a dip in the pool. It's NOT getting one. Walk it to the boss room. Dry."], ["me", "One dry muffin, got it. A little floatie nap on the way? No? Okay, okay."]],
  "w7-s6": [["me", "Sprouts left on every plate. Lettuce not do that, people."], ["me", "Grab the scroll before time runs out, pop the Corn Cob Gunner, then iced tea. A girl can dream."]],
  "w7-s7": [[18, "In THIS corner! The slowest sloth in the West! SLOOO-BA! Ding ding!"], ["me", "Heyyy, Velvaroo. Thanks. Can I nap in your corner?"], ["me", "Okay, the key chest's on that flowerpot. BOING! Ding ding, I guess."]],
  "w7-s8": [["me", "Ahhh, this cooler's nice and chilly. Iced tea vibes."], ["lo2", "Forsooth! Hold out against my horde, sloth, and the Baron shall STILL grill thee well done!"], ["me", "Well done? I'm more of a rare. Rarely awake. Okay, monsters, bring it."]],
  "w7-s9": [["me", "Hot coals all the way up, and a Sauce Bandit at the top. Pee-yew, I smell a sprout too."], ["n", "From the grill, a voice booms: \"ATTEN-TION, sloth! You'll be SIZZLED!\""], ["me", "Sizzled? Nah. Steeped, maybe. I'm climbing. Okay, medium-fast climbing."]],
  // World 8: The Garden.
  "w8-s2": [["me", "Heyyy, my old shortcut past the watering can. I know every puddle here."], ["n", "SNAP! Something with big leafy jaws waits at the end. It's the Snapdragon!"], ["me", "Didn't know about THAT guy! Okay, Ladybug Spots first. Then, uh, snap back."]],
  "w8-s3": [[16, "Yo, Sloba. Stay frosty. The sunflowers are puffing pollen everywhere."], ["me", "Minturtle! Heyyy. ACHOO! Okay, okay. Watering Can Wizard, here I come. Bless you, monsters."]],
  "w8-s4": [[10, "This is your patch, sloth. Walk my Crumblet past the pumpkins for me."], ["me", "My turf, little muffin. I know every pumpkin by name. That's Gourdon. Say hi."]],
  "w8-s6": [["me", "I used to nap at the top of this beanstalk. Now there's a scroll up there. Rude."], ["me", "Grab it before time runs out, then the Gnome General. Turnip for the books, dude. I'm actually hurrying."]],
  "w8-s7": [["me", "Pee-yew. Old peels and stale leaves everywhere. The Leftovers love this stuff."], ["me", "The key chest's on the high ledge. BOING! Ahhh, it smells way better up here."]],
  "w8-s8": [["lo2", "Ha! The Meatloaf shall stale every leaf in thy Garden, sloth! Thou reapest what thou sowest!"], ["me", "I sow naps, dude, and I reap naps. Hold out, beat King Radish Bomber, then nap."]],
  "w8-s9": [["me", "It's warm, foggy and green in this greenhouse. My tea bushes are in there."], ["n", "From the heap, a voice rambles: \"Who goes there?! Wait, is that a PEA in me? Since WHEN?\""], ["me", "Somebody's having a weird day. Pumpkin Scarecrow first, though. I'm climbing. Fast. For me."]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "Heyyy, a shopping trolley. It's a bed with wheels! Hop in, nap on the go."], ["n", "RATTLE! Trolley Rammers come charging down the track! The portal wants their wheels!"], ["me", "Clean-up on aisle nine! That's, like, me. Wheels first, then the Trolley Chariot. Beep beep, dude."]],
  "w9-s3": [["me", "Cereal boxes as big as buildings. Crunchy pillows as far as the eye can see."], ["me", "Coupon Ghosts, gimme those scraps. Then the Cash Register Golem. I'm paying in naps, dude."]],
  "w9-s4": [[10, "Sloth! My Crumblet got lost in the fruit and veg. Walk it out for me."], ["me", "Hop on, little muffin. We're taking the slow lane. It's the comfy one."]],
  "w9-s6": [["me", "Warm bread smell, like a big fluffy blanket. Gotta stay awake."], ["me", "Grab the scroll before time runs out, zap the Price Gun Paladin, then a loaf nap. Get it? Loaf?"]],
  "w9-s7": [[14, "Let's GOOO! Up the canned goods, against the current! Race ya, sloth!"], ["me", "Heyyy, Salmonster. You swim, I'll take the sponge. BOING!"], ["me", "The key's right on this ledge. Two for one, dude, a key AND a nap spot."]],
  "w9-s8": [["lo2", "Forsooth! Thy time is up, sloth! Check out NOW!"], ["me", "Checkout? I'm in the slow lane, dude. Hold out, then King Dented Can Turret. Bag it."]],
  "w9-s9": [["me", "Brrr. Chill blasts, frosty fur again. Heyyy, it's Minturtle's dream house."], ["n", "From the back aisle, a voice wails: \"Woooo! Nobody throws ME out! Nobody even OPENS me!\""], ["me", "Spooky. Shelf Stacker Bot first, then I'll open ya, dude. Gently. Climbing."]],
  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Sticky jars and comfy lids. A tiny nap?"], ["n", "No naps! Candied Peel Bats flap overhead, and the Forgotten Soup waits at the end!"], ["me", "Okay, okay. One more rush. A jam-packed rush. Soup's on, dude. Go, legs!"]],
  "w10-s3": [["me", "Old noodle boxes up to the ceiling. Duuude, somebody forgot a LOT of dinners."], ["me", "A Banquet Butler AND a lunchbox with teeth? Order up, Leftovers. Table for one sloth, please."]],
  "w10-s4": [[10, "This is my LAST Crumblet, sloth. The very last one. Walk it out of the cold."], ["me", "The last one? Okay, papa bear. Hop on, little muffin. It's the slowest, safest bus in the Fridge."], [10, "...Thanks. Don't tell anybody I said that."]],
  "w10-s6": [[16, "Yo, Sloba. Stay frosty. Scroll's way up high, and the clock's ticking. Race ya?"], ["me", "Race? Heyyy, Minturtle. I'll meet ya there. Then the Pudding Juggernaut. No pressure, just tea-sure."]],
  "w10-s7": [["me", "Dusty jars with no labels. Heyyy, jars. I see ya."], [3, "Wibble wobble! Sloba! I'm writing names on ALL the jars! Wanna help?"], ["me", "Sure. Right after the sponge. BOING! Last key. Got it."]],
  "w10-s8": [["lo2", "Forsooth, sloth! The WHOLE army! Hold out if thou canst! Thou art doomed!"], ["me", "Doomed? Sir Stale, that's, like, one yawn. *yaaawn* Then King Party Cracker Bomber. Okay, go."]],
  "w10-s9": [["me", "Duuude, this table is super long. A Fondue Fiend's bubbling at the end, and nobody's sitting at it."], ["n", "From the cake-tin throne, a grumpy voice booms: \"Nobody touches my table! NOBODY gets a seat!\""], ["me", "Heyyy. I saved myself one anyway. Been here since lunch. Climbing."]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Heyyy, a combo! Neat!", "Swing, swing, swiiing!", "Whoa, I'm on a roll! A slow roll!"],
  lowhp: ["Ow! I need a nap, like, now!", "Ouch, my pearls!", "Heyyy, not cool, dude!"],
  perfect: ["Missed me! I was asleep!", "Dodged it! By accident!", "Too slow, dude! Wait, that's me!"],
  levelup: ["Level up! Boba-lieve it!", "Ooh, stronger! Nap to celebrate!", "I'm steeped in power, dude!"],
  secret: ["Ooh, a goodie! I'm gonna nap on it!", "Treasure! Tea-rrific!", "Heyyy, a present! For me!"],
  boom: ["KA-BLAM! That woke me right up!", "Whoa, BOOM! Loud!", "Bonk! Big bonk, no rush!"],
  mimic: ["Heyyy, the box bites!", "Rude box! Not cool!", "Teeth? On a CHEST? Duuude!"],
  objective: ["Done! No rush, no fuss!", "Got there first! Again!", "No pressure, just tea-sure!"],
};
