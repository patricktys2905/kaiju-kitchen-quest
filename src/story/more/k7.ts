// Norigon: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "The ancients said: \"The rice remembers who rushed it.\""], ["me", "Nine hundred years, and I still do not know what it means. I suspect it is about rice."]],
  "w1-s3": [["me", "Gummy Gully. In my youth, one breath of fire would have freed my feet."], ["me", "Now I breathe... pff. A small green puff. Very well. Wisdom is knowing where the ladle lever is."]],
  "w1-s4": [["n", "Night falls on Toaster Hills. A tiny lost Crumblet hides behind Norigon's tail, trembling."], ["me", "Fear not, little one. My flame is small, but it is enough to light a path for two."]],
  "w1-s6": [["me", "A scroll at the end of the Spice Shelf. Scrolls are sacred to my people. We are, after all, rolled."], ["me", "Proverb: \"Wasabi first, regret later.\" Today I shall run first and hold the line later."]],
  "w1-s7": [["me", "So many foes in Pepper Pass. As the ancients said: \"Too many grains make a sticky situation.\""], [1, "Fascinating! A real Roll Dragon! May I take a sample of your seaweed?"], ["me", "After the swarm, small scientist. And mind the hidden chest above. It holds a key."]],
  "w1-s8": [["me", "A cutting board. The most solemn place for my kind. Many brave rolls were sliced here."], ["me", "I will not be sliced. Forty-five seconds. Let them come at me in sixes and eights."]],
  "w1-s9": [["me", "The burners glow. Once, my flame burned hotter. I miss it the way rice misses the fish."], ["mold", "Flames go out, old dragon. Everything ends damp and cold. Like the Sink."]],
  // World 2: The Fridge
  "w2-s2": [["me", "Dairy. The ancients warned: \"Cream cheese in a roll is a door opened to strangers.\""], ["me", "I have since tried it. The ancients were... perhaps too strict."]],
  "w2-s3": [["me", "The cold bites my scales. My flame shrinks to a candle."], ["me", "And that lunchbox is breathing. Nine hundred years have taught me: treasure does not breathe."]],
  "w2-s4": [["me", "Another lost Crumblet. Climb on my back, small one. Dragons have carried heroes before."], ["n", "The Crumblet insisted on sitting on his head. Norigon allowed it, with great dignity."]],
  "w2-s6": [["me", "Proverb: \"The egg upon the rice must be tied with seaweed, or it will wander.\""], ["me", "I say it before every long run. The scroll is far. Seventy-five seconds. Do not wander."]],
  "w2-s7": [[4, "Mr. Dragon... is your fire like the moon? It glows so softly."], ["me", "It is only an ember now. But embers, like moons, come back. Come, a key to a hidden path waits here."]],
  "w2-s8": [["foe", "Ssso cold, dragon. I sent a friend to keep you company in the canyon. A big one."], ["me", "Gari hides a champion in the ketchup. Forty-five seconds, then. A Roll does not unroll."]],
  "w2-s9": [["me", "My ancestors slept in trays like these, cube by cube, dreaming of fire."], ["mold", "Sleep with them, old dragon. In the Sink, nobody dreams."], ["me", "A Roll Dragon does not sleep in a drain."]],
  // World 3: The Oven
  "w3-s2": [["me", "The Bottom Rack. My ancestors warmed here before great battles. And great lunches."], ["me", "Proverb: \"Warm the heart, never the fish.\" That one, at least, I understand."]],
  "w3-s3": [["me", "A maze of muffin cups. Each one round, and not one of them rolled. Barbaric."], ["me", "Above waits a rolling pin. Even a rolling pin knows the way of the Roll."]],
  "w3-s4": [["me", "A lost Crumblet, and something large lurking on the Casserole Cliffs. Stay behind me, little one."], ["me", "Proverb: \"Protect the filling, and the roll protects itself.\" That one is about you."]],
  "w3-s6": [[0, "Whoa, a real dragon! Can you breathe fire? Do it! Do it!"], ["me", "...Pff."], [0, "That was a very good tiny puff. My big brother can't even do that!"]],
  "w3-s7": [["me", "Roasting Pan Pass. Hot enough to stir an old dragon's blood. My ember is pulsing."], ["me", "A key hides in a chest high above. The ancients loved two things: secret chests, and sponges."]],
  "w3-s8": [["me", "A pizza stone. Flat, round, uncut by honour. Still, I respect any food that holds its ground."], ["me", "Forty-five seconds. Lure them to the pressure cookers. Steam is merely fire wearing a hat."]],
  "w3-s9": [["me", "The Top Rack. Above, I hear another dragon roaring. Another last dragon."], ["mold", "Two old dragons, two dying flames. How lovely. The Sink takes the warm ones first."]],
  // World 4: The Pantry
  "w4-s2": [["me", "FWOOOOSH!"], ["me", "...Forgive me. Nine hundred years without fire. I may be showing off a little."], ["n", "Several cereal boxes are now toasted. Some were mimics. Most were breakfast."]],
  "w4-s3": [["me", "Flour drifts like snow. Flour Ghosts drift like old regrets."], ["me", "Proverb: \"Flour is not for the roll. Flour is for the tempura.\" Let us fry some ghosts."]],
  "w4-s4": [["me", "The last lost Crumblet. When this is over, little ones, you shall all ride the last dragon home."], ["n", "The Crumblet cheered and ran straight at a pressure cooker. Norigon gently turned it around."]],
  "w4-s6": [["me", "The whole Pantry swarms the Spice Rack. Good. My fire has waited centuries for a crowd."], ["me", "Fetch the scroll. Hold the ridge. And, as the ancients said: never mistake wasabi for guacamole."]],
  "w4-s7": [["me", "Pasta Jar Peaks. The last hidden key waits up high. Bounce, climb, and never break the noodle."], ["me", "Proverb: \"Long noodles, long life.\" That one is not even about sushi. I borrowed it."]],
  "w4-s8": [[15, "M-Mr. Norigon? When this is over... could your fire light my grill?"], ["me", "Hold Honey Hollow with me forty-five seconds, young champion. Then I'll light every grill you own."]],
  "w4-s9": [["me", "The Top Shelf. This kitchen gave me back my fire. Now I give it everything I have."], ["me", "This is the way of the Roll. ...I always knew what that one meant."]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Rolled, sliced and served.", "Eight pieces. A proper roll.", "The way of the Roll!"],
  lowhp: ["My scales grow soggy...", "Even dragons need a moment.", "The ember dims... not yet!"],
  perfect: ["Too slow. Like day-old rice.", "The wind flows around the dragon.", "Ancient reflexes. Still crisp."],
  levelup: ["The ember grows stronger!", "A dragon never stops learning.", "Nine hundred and one years wise."],
  secret: ["The ancients hid this well.", "A treasure worthy of a dragon.", "Sponge, you have my thanks."],
  boom: ["Flat as a sheet of nori.", "The rolling pin knows the way.", "Sliced into eight. Honourable."],
  mimic: ["Treasure does not have teeth.", "A box that bites? Most rude.", "In my day, chests stayed still."],
  objective: ["It is done, as foretold.", "Task complete. Bow, then onward.", "The road continues."],
};
