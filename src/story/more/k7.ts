// Norigon: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Hrrm. The ancients said: \"The rice remembers who rushed it.\""], ["me", "Nine hundred years, and I still have no clue what it means. I suspect it is about rice."]],
  "w1-s3": [["me", "Gummy Gully! In my youth, one breath of fire would unstick my feet. Behold! HRAAAH!"], ["me", "*pff* A small green puff. Hrrm. Wisdom is knowing which lunchbox has teeth. That one. Definitely that one."]],
  "w1-s4": [["n", "Meanwhile, night falls on Toaster Hills, and a tiny lost Crumblet hides behind Norigon's tail!"], ["me", "Fear not, little one! My flame is small, but it can light a path for two. Scoot closer."]],
  "w1-s6": [["me", "A scroll high on the Spice Shelf! Scrolls are sacred to my people. We are, after all, rolled."], ["me", "Proverb: \"Wasabi first, regret later.\" Hrrm. Today I climb first and beat the clock. Hup hup!"]],
  "w1-s7": [["me", "So many foes in Pepper Pass! As the ancients said: \"Too many grains make a sticky situation.\""], [1, "FASCINATING! A real Roll Dragon! May I take a sample of your seaweed?"], ["me", "After the swarm, small scientist. And mind the sponge past the far edge. It bounces up to a key!"]],
  "w1-s8": [["me", "A cutting board. Hrrm. Many brave rolls were sliced here. *sniff* Ahem. Dust in my eye."], ["me", "But I will NOT be sliced! Hold out, Norigon! Come at me in sixes and eights!"]],
  "w1-s9": [["me", "The burners glow. My flame used to burn that hot! I miss it like rice misses the fish."], ["mold", "Hehehe... flames go out, old dragon. Everything ends damp and cold. Like the Sink."]],
  // World 2: The Fridge
  "w2-s2": [["me", "Dairy! The ancients warned: \"Cream cheese in a roll is a door opened to strangers.\""], ["me", "I have since tried it. Mmm! The ancients were a teeny bit too strict."]],
  "w2-s3": [["me", "Brrr! The cold bites my scales. My flame shrinks to a birthday candle."], ["me", "And that lunchbox is BREATHING. Nine hundred years have taught me: treasure does not breathe!"]],
  "w2-s4": [["me", "Another lost Crumblet! Climb on my back, small one. Dragons have carried heroes before."], ["me", "My back, I said. Not my head. Hrrm. Very well, head it is. With great dignity."]],
  "w2-s6": [["me", "Proverb: \"The egg upon the rice must be tied with seaweed, or it will wander.\""], ["me", "I say it before every long climb! The scroll is way up high, and time is short. Do NOT wander!"]],
  "w2-s7": [[4, "Ooooh, Mr. Dragon! Is your fire like the moon? It glows so softly."], ["me", "Only an ember now. But embers, like moons, come back! Come, a sponge bounces up to a hidden key."]],
  "w2-s8": [["foe", "Ssso cold, dragon! I sent a friend to keep you company in the canyon. A BIG one. Sss-sss-sss!"], ["me", "Gari hides a king in the ketchup. Hold out, then! A Roll does not unroll!"]],
  "w2-s9": [["me", "My ancestors slept in trays like these, cube by cube, dreaming of fire. Zzz. Ahem!"], ["mold", "Sleep with them, old dragon. In the Sink, nobody dreams. Hehehe."], ["me", "Ha! A Roll Dragon does NOT nap in a drain!"]],
  // World 3: The Oven
  "w3-s2": [["me", "The Bottom Rack! My ancestors warmed up here before great battles. And great lunches."], ["me", "Proverb: \"Warm the heart, never the fish.\" Ah! Finally, one I understand!"]],
  "w3-s3": [["me", "A maze of muffin cups. Each one round, and not ONE of them rolled. Barbaric!"], ["me", "And a Pizza Peel Paladin, flat as a board. Even a pizza peel deserves respect. Then a bonk."]],
  "w3-s4": [["me", "A lost Crumblet, and something BIG lurking on the Casserole Cliffs. Stay behind me, little one."], ["me", "Proverb: \"Protect the filling, and the roll protects itself.\" Hrrm! That one is about you."]],
  "w3-s6": [[0, "Whoa, a real dragon! Can you breathe fire? Do it! Do it! DO IT!"], ["me", "*pff*"], [0, "Ooh! That was a REALLY good tiny puff! My big brother can't even do that!"]],
  "w3-s7": [["me", "Roasting Pan Pass! Hot enough to stir an old dragon's blood. My ember goes thump-thump!"], ["me", "A key hides in a chest up high. The ancients loved two things: secret chests and sponges. Boing!"]],
  "w3-s8": [["me", "A pizza stone. Flat, round, never once rolled. Still, I respect any food that holds its ground."], ["me", "Hold out, and let the steam vents toss them about! Steam is only fire wearing a hat."]],
  "w3-s9": [["me", "The Top Rack. Up above, I hear another dragon roaring. Another LAST dragon. Hrrm!"], ["mold", "Two old dragons, two little flames. How lovely. Hehehe. The Sink takes the warm ones first."]],
  // World 4: The Pantry
  "w4-s2": [["me", "FWOOOOSH!"], ["me", "Ahem! Forgive me. Nine hundred years without fire. I may be showing off a teeny bit."], ["me", "Oops. Some of those boxes were mimics. Most of them were breakfast."]],
  "w4-s3": [["me", "Flour drifts like snow, and Flour Ghosts drift like old regrets. Ooooh, spooky."], ["me", "Proverb: \"Where there is flour, there is tempura!\" Let us fry some ghosts!"]],
  "w4-s4": [["me", "The last lost Crumblet! When this is over, little ones, you shall ALL ride the last dragon home!"], ["me", "Wait, no, not under the falling cans! Hrrm. This way, this way."]],
  "w4-s6": [["me", "The whole Pantry swarms the Spice Rack! Good! My fire has waited centuries for a crowd!"], ["me", "Climb to the scroll before time runs out! And as the ancients said: never mistake wasabi for guacamole. OOF."]],
  "w4-s7": [["me", "Pasta Jar Peaks! The last hidden key waits up high. Up we bounce, and never break the noodle!"], ["me", "Proverb: \"Long noodles, long life!\" That one isn't even about sushi. I borrowed it. Shh."]],
  "w4-s8": [[15, "M-M-Mr. Norigon? When this is over, c-could your fire light my grill?"], ["me", "Hold Honey Hollow with me, young champion, and I will light EVERY grill you own!"]],
  "w4-s9": [["me", "The Top Shelf. This kitchen gave me back my fire! Now it gets every last spark. FWOOSH!"], ["me", "This is the way of the Roll! Hrrm. I always knew what that one meant. Mostly."]],
  // World 5: The Sink.
  "w5-s2": [["me", "A Sponge Golem! At last, someone else who is soft in the middle, like a good roll!"], ["me", "Wait, the taps drip on ME. Proverb: \"When the tap drips, the dragon runs!\" HUP HUP HUP!"]],
  "w5-s3": [["me", "These sponges are soft, squishy and full of holes. Just like my memory of the ancient proverbs."], ["me", "Hrrm, and a lunchbox with teeth. Proverb: \"Never open a lunch that opens itself.\""]],
  "w5-s4": [[10, "Hmph. Dragon. My last Crumblet. Walk it out of this soggy dish rack, or else."], ["me", "Fear not, papa bear! I shall carry it with honour. And keep its paper cup dry."], [10, "It's wearing a tiny rain hat. Don't look at me. It's the steam, okay?"]],
  "w5-s6": [["me", "The scroll waits high up in the bubbles, and the clock is ticking!"], ["me", "Proverb: \"Do not listen to the Dish Soap Siren.\" Hrrm. Very specific. Very wise. Hup hup!"]],
  "w5-s7": [["me", "The last secret chest, high above the plughole. Proverb: \"Never drop your key down the drain.\""], ["me", "Hrrm. That one is less ancient and more common sense. Boing, sponge! Boing!"]],
  "w5-s8": [["me", "A greasy pan! Fear not, pan. When this is over, a Roll Dragon always washes up."], [15, "Mr. Norigon! My grill's still lit with your flame! Hold out with me, side by side?"], ["me", "Side by side, young champion! FWOOSH!"]],
  "w5-s9": [["mold", "Hehehe... closer, old dragon. Down here it's dark and damp, and every fire goes fizzle."], ["me", "Fizzle? I waited nine hundred years for this flame. I can out-wait one soggy drain!"], ["me", "Hrrm. Actually, no. I am very impatient. HERE I COME!"]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Hrrm! These placemats are as flat as a sheet of nori. The ancients said: \"On flat ground, the dragon strolls.\""], ["n", "SLOSH! A Gravy Boat Rammer comes ramming across the placemats!"], ["me", "The ancients clearly never met THAT boat! HUP HUP HUP!"]],
  "w6-s3": [["me", "Candelabras like lighthouses, dripping hot wax! Even my ancestors never dined THIS fancy."], ["me", "And a Teapot Tyrant at the end. Hrrm. Proper tea is never tyrannical. I shall teach him. With fire."]],
  "w6-s4": [[10, "Hmph. Dragon. This Crumblet wants to see the world. Walk it past the gravy boats, or else."], ["me", "With honour, papa bear! Little one, never swim in gravy. It is NOT soup, whatever it tells you."]],
  "w6-s6": [["me", "A tea ceremony, my favourite! And the Recipe Scroll waits way up high."], ["me", "Proverb: \"Sip slowly, climb quickly.\" Today we skip the sipping. Hup hup!"]],
  "w6-s7": [["me", "Look how neatly these napkins are folded! Whoever did this has my respect, and far too much free time."], ["me", "Ah, and my old friend the sponge sits under the key chest. Shall we, old friend? Boing!"]],
  "w6-s8": [["lo2", "Charge, my silverware! Skewer the raw fish!"], ["me", "Raw? I am rice and sea, you crusty baguette! I shall hold out! Bring the whole cutlery drawer!"]],
  "w6-s9": [["lo2", "Forsooth! An old dragon climbs my chandelier! Art thou here for the senior discount?"], ["me", "Nine hundred years, and the jokes are still about my age. Hrrm! Here I come, breadstick!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "A garden hose! Long, green and coiled. Hrrm, could it be a distant cousin?"], ["n", "BZZZ! A swarm of Picnic Wasps comes zooming down the hose!"], ["me", "They follow me like a bad proverb! Some things never change! HUP HUP!"]],
  "w7-s3": [["n", "FSSSH! Sprinklers burst up all over the lawn!"], ["me", "Water from the GROUND? My flame says no thank you."], ["me", "And a Spatula Sheriff? Hrrm. I was flipped once, in 1206. Never again!"]],
  "w7-s4": [[10, "Hmph. Dragon. This Crumblet's never seen a paddling pool. Walk it past the pier, or else."], ["me", "With honour, papa bear! Little one, the pool is NOT soy sauce. Do not dip yourself."]],
  "w7-s6": [["me", "A checkered cloth like a giant game board, and the Recipe Scroll waits at the top!"], ["me", "Proverb: \"Ants always find the picnic.\" Hrrm. Picnic Wasps too, apparently. Climb, before time runs out!"]],
  "w7-s7": [["me", "My ancestors were wrapped in leaves too. The seaweed kind. Much less pointy."], ["me", "And look, the sponge came outside! It must have followed me. Up to the key chest, my bouncy pal! Boing!"]],
  "w7-s8": [["lo2", "Hold out, old dragon? At thy age, I'd be amazed if thou could hold a CHOPSTICK!"], ["me", "Age jokes again! I shall hold out, breadstick, then toast your OTHER side!"]],
  "w7-s9": [["n", "From the smoky summit, a voice booms: \"ATTEN-TION! Sprouts, prepare to grill the lizard!\""], ["me", "Lizard?! I am a DRAGON! And pee-yew, who is boiling cabbage up there? Hup hup!"]],
  // World 8: The Garden.
  "w8-s2": [["me", "A watering can as tall as a pagoda! Proverb: \"The patient gardener waits for the rain.\""], ["n", "SNAP! A Snapdragon sleeps up ahead, snapping in its dreams!"], ["me", "A DRAGON? Hrrm! Proverb: \"Never wake a fellow dragon before breakfast.\" Hup hup, on tiptoe!"]],
  "w8-s3": [["me", "Every sunflower is facing the sun. Hrrm, just like my grandmother at the beach."], ["n", "POOF! A big flower puffs pollen right up the dragon's nose!"], ["me", "Ah... ACHOO! FWOOSH! Oops. Even my sneezes breathe fire now. Sorry, Watering Can Wizard!"]],
  "w8-s4": [[10, "Hmph. Dragon. This Crumblet wants to see a real pumpkin patch. Walk it to the exit, or else."], ["me", "With honour, papa bear! Little one, pumpkins are NOT bouncy castles. Mostly."], [10, "It's wearing tiny wellies. Don't look at me. It's the pollen, okay?"]],
  "w8-s6": [["me", "The Recipe Scroll waits at the top of this beanstalk. Proverb: \"Climb the bean, find the giant.\""], ["me", "Hrrm. Wait, that is a different story. Climb and grab the scroll before time runs out! Hup hup!"]],
  "w8-s7": [[16, "Stay frosty, dragon. Key chest's on the high ledge. I'd go, but it's sunny up there. Cool, cool, cool."], ["me", "Fear not, shell friend! I shall point my fire AWAY from you. Sponge, my old pal! Boing!"]],
  "w8-s8": [["lo2", "Hold out amongst the turnips, old dragon? At thy age, thou art practically a vegetable!"], ["me", "That's a turnip for the books! I'll hold out, breadstick, and then you're the vegetable! FWOOSH!"]],
  "w8-s9": [["n", "From the greenhouse, a lumpy voice mumbles: \"Huh! Is that a SOCK in me? When did I eat a sock?\""], ["me", "A sock in the meatloaf! Proverb: \"Always check inside the meatloaf.\" Hrrm! It begins to make sense!"]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "Proverb: \"The wise shopper walks, and never runs, in the aisles.\""], ["n", "SQUEAK! A Trolley Rammer comes rattling down the trolley track!"], ["me", "Unless the trolley rams! Clean-up on aisle nine! HUP HUP HUP!"]],
  "w9-s3": [["me", "Boxes like temples, and puffed rice everywhere. At last, some respect for rice!"], ["me", "And a lunchbox with teeth! Proverb: \"Breakfast is served, and so is a bonk.\" BONK!"]],
  "w9-s4": [[10, "Hmph. Dragon. This Crumblet wants to see the fruit and veg. Walk it to the exit, or else."], ["me", "With honour, papa bear! Little one, those bananas are bruised and grumpy. Do NOT hug them."], [10, "And no climbing the melons. I already told it. Twice."]],
  "w9-s6": [["me", "Fresh bread, at last! Sir Stale would hate it here. Hrrm, I love it already."], ["me", "Climb to the Recipe Scroll before time runs out! Proverb: \"Rice before bread.\" Sorry, baguettes!"]],
  "w9-s7": [[14, "Let's GOOO! Old dragon! Key chest's on the high ledge. I'd swim up, but there's no current!"], ["me", "Then ride the sponge, fish friend! Proverb: \"Sushi and salmon are the best of pals.\""], [14, "Wait. SUSHI?! Holy mackerel! Ahem. O-fish-ally fine with it. Go go GO!"]],
  "w9-s8": [["lo2", "Hold out at the checkout, old dragon? Thou art centuries past thy best-before date!"], ["me", "Ooh, a best-before joke! You're getting creative! I'll hold out, breadstick, and then YOU check out! FWOOSH!"]],
  "w9-s9": [["n", "From the Frozen Aisle, a spooky voice wails: \"Woooo! Don't open me! Nobody remembers what's in meee!\""], ["me", "Hrrm! Proverb: \"Always check behind the Tupperware lid.\" Brrr. I shall check fast, then thaw."]],
  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Proverb: \"Old jam is never in a hurry.\""], ["n", "BLOOP! The Forgotten Soup gurgles in its sleep, way past the jam jars!"], ["me", "But an old DRAGON is! Proverb: \"Every soup deserves a spoon.\" HUP HUP HUP!"]],
  "w10-s3": [["me", "Noodle boxes stacked to the ceiling, and not ONE of them has sushi. Hrrm!"], ["me", "Proverb: \"Leftovers taste better the next day.\" Not these ones! And mind that lunchbox. It bites! BONK!"]],
  "w10-s4": [[10, "Hmph. Dragon. My LAST Crumblet. The very last one. Walk it down the frosty falls, or else."], ["me", "With honour, papa bear! Little one, ice is NOT a slide. Ask Pengwhip, then do the opposite."], [10, "It's wearing a tiny scarf I knitted. Not a word, dragon. Not one word."]],
  "w10-s6": [["me", "Old party streamers, faded and droopy. Hrrm. Somebody's party got forgotten here."], ["me", "The LAST Recipe Scroll! Proverb: \"Grab the scroll before the clock grabs you.\" Not ancient, but it works!"]],
  "w10-s7": [[0, "Mr. Dragon! Mr. Dragon! The last key's up on the ledge! Do the tiny puff again! Do it!"], ["me", "Tiny puff? Little one, watch THIS! FWOOOOSH! Ahem. Sponge, my oldest friend! BOING!"]],
  "w10-s8": [["lo2", "Hold out one last time, old dragon? Thou art older than this whole FRIDGE!"], ["me", "Last age joke, breadstick? Then here's my last answer! I hold out, and save room for dinner! FWOOSH!"]],
  "w10-s9": [["n", "A dusty voice echoes down the long, empty table: \"Who dares bring PARTY HATS to MY feast?!\""], ["me", "Hrrm. A whole banquet table, and not one plate on it. Proverb: \"An empty table is a sad table.\""], ["me", "Let us fix that! Gari, guard my seat! Hup hup!"]],

  // World 11: The Midway.
  "w11-s2": [["me", "Hook-a-duck! I hooked ducks at the first festival. One go, please! Hup! Hrrm. This duck is NAILED to the pond!"], ["me", "Proverb: \"A knot in the pretzel is a knot in the queue.\" The Pretzel Contortionist poses in one up ahead. I shall untie both!"]],
  "w11-s3": [["me", "Proverb: \"Whoever queues for the ring toss queues for ever.\" Hrrm! These rings would not fit over a grain of rice!"], ["me", "A prize box that bites, and Whack-a-Churros underfoot! In my day, prizes behaved. Gumball Gunner, I have exact change. FWOOSH!"]],
  "w11-s4": [[10, "Hmph. Dragon. Head count says five, and it should say six. This one got lost in the crowd. Walk it to the exit, or else."], ["me", "With honour, papa bear! Little one, hold my whisker. Bumper Cupcakes cannot steer, and their King blames everybody else!"], [10, "It called you sensei. Don't look at me. It's the candy floss, okay?"]],
  "w11-s6": [["me", "A tower with a slide wrapped round it, like a roll that came undone! And a Recipe Scroll way up on the prize shelf. Hrrm!"], ["me", "Proverb: \"The clock does not queue.\" And who shouts \"Order Up!\" up there? Fry Basket Brawler, I ordered TEMPURA! Hup hup!"]],
  "w11-s7": [["me", "Hrrm! In this mirror I look four hundred. In that one I am one very long noodle. Gari must NEVER see that one."], ["me", "The handsome mirror says a key chest sits on a ledge! Sponge, old friend, you came too! Whoa there, Carousel Macaron Pony! Boing!"]],
  "w11-s8": [["lo2", "Have at thee, coconut! Stand aside, old dragon, thou art too ancient for the lists! Thou wert AT the first joust!"], ["me", "It was a festival, breadstick, and I was there! The coconuts throw BACK, and King Coconut Shy Lobber brought a whole crowd!"], ["lo2", "Then hold the lists, old dragon! Forsooth, I shall fetch thee a chair! And a blanket!"]],
  "w11-s9": [["me", "A doughnut as tall as a pagoda! Proverb: \"The dragon who climbs the doughnut skips the queue.\" Hrrm. I made that one up just now."], ["n", "The loudspeaker crackles: \"Step right up, my antique friend! Nobody out-waits the Great Flosso! Ta-daa!\""], ["me", "Antique?! My soy sauce is older than your big top, sir! Wasabi with you, Bonbon the Cannonball? Out of that cannon! Hup hup!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Rolled, sliced and served!", "Eight pieces! A proper roll!", "The way of the Roll! HYAH!"],
  lowhp: ["Oof! My scales grow soggy!", "Even dragons need a nap. Not yet!", "The ember dims! Hrrm, NOT YET!"],
  perfect: ["Too slow! Like day-old rice!", "Whoosh! The wind flows round me!", "Ancient reflexes! Still crispy!"],
  levelup: ["The ember grows! FWOOSH!", "Old dragon, new tricks!", "Nine hundred and one years wise!"],
  secret: ["Hrrm! The ancients hid this well.", "Treasure fit for a dragon!", "Thank you, sponge! Bow!"],
  boom: ["Flat as a sheet of nori!", "The blast knows the way!", "Sliced into eight! Honourable!"],
  mimic: ["Treasure does NOT have teeth!", "A box that bites? How rude!", "In my day, chests sat still!"],
  objective: ["It is done, as foretold!", "Task complete! Bow, then onward!", "Hrrm! The road rolls on!"],
};
