// Norigon: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Hrrm. The ancients said: \"The rice remembers who rushed it.\""], ["me", "Nine hundred years, and I still have no clue what it means. I suspect it is about rice."]],
  "w1-s3": [["me", "Gummy Gully! In my youth, one breath of fire would unstick my feet. Behold! HRAAAH!"], ["me", "*pff* A small green puff. Hrrm. Wisdom is knowing where the ladle lever is."]],
  "w1-s4": [["n", "Meanwhile, night falls on Toaster Hills, and a tiny lost Crumblet hides behind Norigon's tail!"], ["me", "Fear not, little one! My flame is small, but it can light a path for two. Scoot closer."]],
  "w1-s6": [["me", "A scroll at the end of the Spice Shelf! Scrolls are sacred to my people. We are, after all, rolled."], ["me", "Proverb: \"Wasabi first, regret later.\" Hrrm. Today I run first and hold the line later. Hup hup!"]],
  "w1-s7": [["me", "So many foes in Pepper Pass! As the ancients said: \"Too many grains make a sticky situation.\""], [1, "FASCINATING! A real Roll Dragon! May I take a sample of your seaweed?"], ["me", "After the swarm, small scientist. And mind the hidden chest above. It holds a key!"]],
  "w1-s8": [["me", "A cutting board. Hrrm. Many brave rolls were sliced here. *sniff* Ahem. Dust in my eye."], ["me", "But I will NOT be sliced! Forty-five seconds. Come at me in sixes and eights!"]],
  "w1-s9": [["me", "The burners glow. My flame used to burn that hot! I miss it like rice misses the fish."], ["mold", "Hehehe... flames go out, old dragon. Everything ends damp and cold. Like the Sink."]],
  // World 2: The Fridge
  "w2-s2": [["me", "Dairy! The ancients warned: \"Cream cheese in a roll is a door opened to strangers.\""], ["me", "I have since tried it. Mmm! The ancients were a teeny bit too strict."]],
  "w2-s3": [["me", "Brrr! The cold bites my scales. My flame shrinks to a birthday candle."], ["me", "And that lunchbox is BREATHING. Nine hundred years have taught me: treasure does not breathe!"]],
  "w2-s4": [["me", "Another lost Crumblet! Climb on my back, small one. Dragons have carried heroes before."], ["me", "My back, I said. Not my head. Hrrm. Very well, head it is. With great dignity."]],
  "w2-s6": [["me", "Proverb: \"The egg upon the rice must be tied with seaweed, or it will wander.\""], ["me", "I say it before every long run! The scroll is far. Seventy-five seconds. Do NOT wander!"]],
  "w2-s7": [[4, "Ooooh, Mr. Dragon! Is your fire like the moon? It glows so softly."], ["me", "Only an ember now. But embers, like moons, come back! Come, a key to a hidden path waits here."]],
  "w2-s8": [["foe", "Ssso cold, dragon! I sent a friend to keep you company in the canyon. A BIG one. Sss-sss-sss!"], ["me", "Gari hides a champion in the ketchup. Forty-five seconds, then! A Roll does not unroll!"]],
  "w2-s9": [["me", "My ancestors slept in trays like these, cube by cube, dreaming of fire. Zzz. Ahem!"], ["mold", "Sleep with them, old dragon. In the Sink, nobody dreams. Hehehe."], ["me", "Ha! A Roll Dragon does NOT nap in a drain!"]],
  // World 3: The Oven
  "w3-s2": [["me", "The Bottom Rack! My ancestors warmed up here before great battles. And great lunches."], ["me", "Proverb: \"Warm the heart, never the fish.\" Ah! Finally, one I understand!"]],
  "w3-s3": [["me", "A maze of muffin cups. Each one round, and not ONE of them rolled. Barbaric!"], ["me", "Up above waits a rolling pin. Even a rolling pin knows the way of the Roll. Respect."]],
  "w3-s4": [["me", "A lost Crumblet, and something BIG lurking on the Casserole Cliffs. Stay behind me, little one."], ["me", "Proverb: \"Protect the filling, and the roll protects itself.\" Hrrm! That one is about you."]],
  "w3-s6": [[0, "Whoa, a real dragon! Can you breathe fire? Do it! Do it! DO IT!"], ["me", "*pff*"], [0, "Ooh! That was a REALLY good tiny puff! My big brother can't even do that!"]],
  "w3-s7": [["me", "Roasting Pan Pass! Hot enough to stir an old dragon's blood. My ember goes thump-thump!"], ["me", "A key hides in a chest up high. The ancients loved two things: secret chests and sponges. Boing!"]],
  "w3-s8": [["me", "A pizza stone. Flat, round, never once rolled. Still, I respect any food that holds its ground."], ["me", "Forty-five seconds! Lure them to the pressure cookers. Steam is only fire wearing a hat."]],
  "w3-s9": [["me", "The Top Rack. Up above, I hear another dragon roaring. Another LAST dragon. Hrrm!"], ["mold", "Two old dragons, two little flames. How lovely. Hehehe. The Sink takes the warm ones first."]],
  // World 4: The Pantry
  "w4-s2": [["me", "FWOOOOSH!"], ["me", "Ahem! Forgive me. Nine hundred years without fire. I may be showing off a teeny bit."], ["me", "Oops. Some of those boxes were mimics. Most of them were breakfast."]],
  "w4-s3": [["me", "Flour drifts like snow, and Flour Ghosts drift like old regrets. Ooooh, spooky."], ["me", "Proverb: \"Where there is flour, there is tempura!\" Let us fry some ghosts!"]],
  "w4-s4": [["me", "The last lost Crumblet! When this is over, little ones, you shall ALL ride the last dragon home!"], ["me", "Wait, no, not toward the pressure cooker! Hrrm. This way, this way."]],
  "w4-s6": [["me", "The whole Pantry swarms the Spice Rack! Good! My fire has waited centuries for a crowd!"], ["me", "Grab the scroll and hold the ridge! And as the ancients said: never mistake wasabi for guacamole. OOF."]],
  "w4-s7": [["me", "Pasta Jar Peaks! The last hidden key waits up high. Up we bounce, and never break the noodle!"], ["me", "Proverb: \"Long noodles, long life!\" That one isn't even about sushi. I borrowed it. Shh."]],
  "w4-s8": [[15, "M-M-Mr. Norigon? When this is over, c-could your fire light my grill?"], ["me", "Hold Honey Hollow with me forty-five seconds, young champion, and I will light EVERY grill you own!"]],
  "w4-s9": [["me", "The Top Shelf. This kitchen gave me back my fire! Now it gets every last spark. FWOOSH!"], ["me", "This is the way of the Roll! Hrrm. I always knew what that one meant. Mostly."]],
  // World 5: The Sink.
  "w5-s2": [["me", "A giant rolling pin! At last, someone else who knows the way of the Roll!"], ["me", "Wait, it is rolling at ME. Proverb: \"When the pin rolls, the dragon runs!\" HUP HUP HUP!"]],
  "w5-s3": [["me", "Sponge Shoals! Soft, squishy and full of holes. Like my memory of the ancient proverbs."], ["me", "The gates lock! Pull the lever, and these monsters get scrubbed right out. Hrrm!"]],
  "w5-s4": [[10, "Hmph. Dragon. My last Crumblet. Walk it out of this soggy dish rack, or else."], ["me", "Fear not, papa bear! I shall carry it with honour. And keep its paper cup dry."], [10, "It's wearing a tiny rain hat. Don't look at me. It's the steam, okay?"]],
  "w5-s6": [["me", "Bubble Bay! The scroll waits at the far end, and the floor moves by itself!"], ["me", "A conveyor belt? Ha! My ancestors invented these. We called it sushi-go-round!"]],
  "w5-s7": [["me", "The last secret chest, high above the plughole. Proverb: \"Never drop your key down the drain.\""], ["me", "Hrrm. That one is less ancient and more common sense. Boing, sponge! Boing!"]],
  "w5-s8": [["me", "A greasy pan! Fear not, pan. When this is over, a Roll Dragon always washes up."], [15, "Mr. Norigon! My grill's still lit with your flame! Forty-five seconds, side by side?"], ["me", "Side by side, young champion! FWOOSH!"]],
  "w5-s9": [["mold", "Hehehe... closer, old dragon. Down here it's dark and damp, and every fire goes fizzle."], ["me", "Fizzle? I waited nine hundred years for this flame. I can out-wait one soggy drain!"], ["me", "Hrrm. Actually, no. I am very impatient. HERE I COME!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Rolled, sliced and served!", "Eight pieces! A proper roll!", "The way of the Roll! HYAH!"],
  lowhp: ["Oof! My scales grow soggy!", "Even dragons need a nap. Not yet!", "The ember dims! Hrrm, NOT YET!"],
  perfect: ["Too slow! Like day-old rice!", "Whoosh! The wind flows round me!", "Ancient reflexes! Still crispy!"],
  levelup: ["The ember grows! FWOOSH!", "Old dragon, new tricks!", "Nine hundred and one years wise!"],
  secret: ["Hrrm! The ancients hid this well.", "Treasure fit for a dragon!", "Thank you, sponge! Bow!"],
  boom: ["Flat as a sheet of nori!", "The rolling pin knows the way!", "Sliced into eight! Honourable!"],
  mimic: ["Treasure does NOT have teeth!", "A box that bites? How rude!", "In my day, chests sat still!"],
  objective: ["It is done, as foretold!", "Task complete! Bow, then onward!", "Hrrm! The road rolls on!"],
};
