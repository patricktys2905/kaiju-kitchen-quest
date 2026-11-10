// Hotchog: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop. Practice round, lots of apologising.
  "w1-s2": [["me", "C-crumbs everywhere. A champion keeps a clean grill. And a clean countertop."], ["me", "I'll tidy up after I bonk the Moldy Buns. S-sorry in advance, buns."]],
  "w1-s3": [["me", "Sour worms? Oh no, they look upset. S-sorry for whatever happened to you!"], ["n", "A ladle hangs on the wall. Hotchog has practised pulling levers. In secret. Many times."], ["me", "Pull, two, three! Rolling pin, coming down!"]],
  "w1-s4": [["n", "A tiny Crumblet peeks out from behind a toaster and grabs Hotchog's tail."], ["me", "Oh! H-hi! I'm Hotchog. Don't touch the spikes. Or the hissing pots. Stay close, okay?"]],
  "w1-s6": [["me", "The Chef's Recipe Scroll? Maybe it has the secret sauce! I-I'll grab it. Fast."], ["me", "Paprika, cumin, smoked salt... focus, Hotchog. Seasoning AFTER the battle."]],
  "w1-s7": [["me", "Pepper Pass! Grill masters season with pepper. Not FIGHT pepper. This is new."], ["me", "They say a key hides up high. A-a champion would check the sponges."]],
  "w1-s8": [["n", "The cutting board shakes. Monsters pour over the bluffs from every side."], ["me", "S-so many! Grill rule one: hold your ground and don't flip too early."], ["me", "Forty-five seconds. That's one perfect sear."]],
  "w1-s9": [["foe", "Hah! Burners! Real champions grill on these, sausage. Try not to char."], ["me", "I like a little char, Captain. It's called flavour."]],
  // World 2: The Fridge. Out of his element, but making a guest list.
  "w2-s2": [["me", "Dairy Lane. For the cookout I'll need cheese slices. Lots of cheese slices."], ["me", "Shopping list: cheese, buns, and \"d-don't get flattened by a Milk Carton Rammer.\""]],
  "w2-s3": [["me", "Brrr. My spikes are frosty. I'm a hot dog on a stick. A p-popsicle stick."], ["me", "That lunchbox over there... it's watching me. Isn't it."]],
  "w2-s4": [["me", "Another lost Crumblet? Hi, little one. Walk next to me. Not too close. Spikes."], ["n", "Something big and briny stirs under the pier. An extra elite is lying in wait."], ["me", "Stay behind me. Champions protect the crowd."]],
  "w2-s6": [["me", "Recipe Scroll at the far end! If it's the secret sauce, I'm going to cry. Happy cry."], ["me", "Seventy-five seconds. Like a grill timer. I LOVE a grill timer."]],
  "w2-s7": [["me", "Butter Bridge. Very slippery. Very good for basting, though."], [17, "Wheee! Hi Hotchog! Coming through! There's a chest up past the sponge, by the way!"], ["me", "Th-thanks, Pengwhip! ...How does anyone slide that well?"]],
  "w2-s8": [["me", "Ketchup Canyon! Mustard's my favourite, but I won't be rude about it."], ["me", "Hold out forty-five seconds. Like waiting for the coals to go white. Patience, Hotchog."]],
  "w2-s9": [["n", "With a click, the fridge light dies. The Ice Tray Steps glitter in the dark."], ["mold", "Shh, little sausage. Cold and dark is how you keep meat. Forever."], ["me", "N-nope! I'm a hot dog! Emphasis on HOT!"]],
  // World 3: The Oven. His element. The stammer starts to fade.
  "w3-s2": [["me", "The Oven! It smells like every cookout I ever dreamed of."], ["me", "Bottom rack. Lowest heat. A champion starts slow and builds. Okay!"]],
  "w3-s3": [["me", "Muffin tins. If a Crumblet's lost in here, I'm going to have a very long day."], ["me", "Ladle lever spotted. Rolling pin ready. And that cereal box is VERY suspicious."]],
  "w3-s4": [["me", "There you are, little Crumblet! It's hot, so stick near me. The not-spiky side."], ["me", "Pressure cookers! Lure the sausages in, then KABOOM. Like popcorn, but rude."]],
  "w3-s6": [["n", "The cookie sheet is packed edge to edge with monsters. A full batch."], ["me", "I've cooked for crowds before. Just never AGAINST one."], ["me", "Grab the scroll, hold the line. Spikes up!"]],
  "w3-s7": [["me", "Chocomunch! You look a little... glossy. I'll fan you with my spikes!"], [8, "Spikes bad fan. Spikes good effort. Thank you, friend."], ["me", "Anytime! Now, the key chest. Low and slow is for roasts. I'm going high and fast."]],
  "w3-s8": [["me", "A pizza stone! Hottest surface in the kitchen. My kind of place."], ["me", "Forty-five seconds on high heat. I won't even flip."]],
  "w3-s9": [["foe", "Broiler Peak's right above us, kid. Still think you can take MY grill?"], ["me", "It's not your grill, Captain. It's everybody's. And I'm coming up."]],
  // World 4: The Pantry. Hunting the secret sauce, inviting everyone.
  "w4-s2": [["me", "The Pantry. Somewhere in here is the Chef's secret sauce. I can almost taste it."], ["me", "Cheerios rolling everywhere. Breakfast is attacking. I'm more of a lunch dog."]],
  "w4-s3": [["me", "Flour Ghosts? At a cookout we'd call those \"unseasoned.\""], ["me", "There's a ladle up there. Let's roll out the pin and dust them off."]],
  "w4-s4": [["me", "Hey, little Crumblet. Want to be my first guest at the cookout? Stay close, then."], ["me", "And keep away from the hissing pots. They're grumpier than Captain Kebab."]],
  "w4-s6": [["me", "Spice Rack Ridge! The sauce recipe could be up here! Smoky paprika... brown sugar..."], ["me", "Focus. Seventy-five seconds to the scroll. Then hold. Then DANCE."]],
  "w4-s7": [[11, "Raptor Express! Delivery for one shy hedgehog: a hot tip! Key chest's up past the sponge!"], ["me", "W-wow, thanks! Are you coming to the cookout?"], [11, "If there's pizza, I'm already there."]],
  "w4-s8": [["n", "Honey drips from the shelves... and with it, a sticky swarm of monsters."], ["me", "Honey glaze! Thanks for the idea. Now everybody line up for the grill."], ["me", "I've waited a whole year for this cookout. I can wait forty-five more seconds."]],
  "w4-s9": [["me", "Top shelf. The Cookie Vault's just up there, and the recipe with it."], ["me", "A year ago I couldn't say hello without stammering. Listen: HELLO, TOP SHELF!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Sizzle sizzle SIZZLE!", "Now THAT'S a grill!", "Grill marks: perfect!"],
  lowhp: ["I-I'm getting overcooked!", "Ow! I need a bun...", "D-don't flip me yet!"],
  perfect: ["Spikes in, roll out!", "Too quick to grill!", "Excuse me! Coming through!"],
  levelup: ["Turning up the heat!", "One step closer to Champion!", "Extra spicy edition!"],
  secret: ["A secret! S-so many sauces!", "Ooh! Cookout supplies!", "Champion finds the chest!"],
  boom: ["W-was that me? Wow!", "Flame-grilled! Sorry!", "Well done. EXTRA well done."],
  mimic: ["Eek! That box bites!", "That's not a picnic basket!", "S-sorry! Wait, YOU bit ME!"],
  objective: ["Order up!", "D-did it! Champion stuff!", "Done to perfection!"],
};
