// Crabbage: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Crumbs everywhere. Who raised these people? I'd sweep, if I had a broom. And cared."], ["me", "...I care a little. Crumbs bring ants. Ants bring trouble."]],
  "w1-s3": [["me", "Gummy Gully. My legs keep sticking. Eight legs. Eight separate problems."], ["me", "A ladle lever. Pull it and a rolling pin flattens the lot. Finally, a kitchen tool that does some weeding."]],
  "w1-s4": [["n", "A tiny Crumblet waddles up and grabs Crabbage's leg."], ["me", "No. Absolutely not. Go home. ...You don't have a home? Ugh. Fine. Stay behind my shell."], ["me", "There are hundreds of them out there. Don't look. Don't touch the rattly pots. Don't follow me. Follow me."]],
  "w1-s6": [["me", "A Recipe Scroll on the Spice Shelf. Probably a recipe for coleslaw. Over my dead leaves."], ["me", "Fine. I'll fetch it. Seventy-five seconds. Sideways is faster than you'd think."]],
  "w1-s7": [["me", "Pepper Pass is crawling. Pepper Grunts, Sour Worms, ants. A full pest outbreak. Claws out."], ["me", "There's a key in a chest up on some ledge. I'm taking it. Finders keepers. Crabs keepers."]],
  "w1-s8": [["me", "Cutting Board Bluffs. A board for chopping vegetables. I'm a vegetable. Wonderful."], ["me", "Forty-five seconds of them coming at me. Shell up. Pincers out. Mood: terrible."]],
  "w1-s9": [["me", "Found a seed on the Spice Shelf. Pocketed it. For... reasons. Gardening reasons."], ["n", "Seed count: one."], ["me", "Stop counting my seeds, narrator."]],
  // World 2: The Fridge
  "w2-s2": [["me", "Dairy Lane. Milk Cartons charging at everything. No manners. No crop rotation either, I bet."], [17, "Hey, crab! Why are you walking sideways?"], ["me", "I'm a crab. You're a penguin in a fridge. Neither of us gets to judge."]],
  "w2-s3": [["me", "Something big is waiting on the Frosty Shelf. I can feel it in my claws. Extra elite. Extra annoying."], ["me", "Good thing there's a lever. One rolling pin, delivered. No tip."]],
  "w2-s4": [["n", "A Crumblet is stuck in a pickle-jar ring by the pier."], ["me", "Pickles again. Come on, small. You walk, I pinch, nobody gets brined."]],
  "w2-s6": [["me", "Egg Carton Cliffs. Eggs. Never grown one. Never wanted to. They just sit there."], ["me", "Scroll at the far end, seventy-five seconds. I'll be back before these eggs hatch an opinion."]],
  "w2-s7": [["me", "Butter Bridge. Slippery. Every step sideways turns into three steps sideways."], ["me", "There's a sponge by the ledge. Bounce, chest, key. Simple. I like simple."]],
  "w2-s8": [["n", "The fridge light clicks off. Ketchup Canyon turns the colour of very late tomatoes."], ["me", "Dark. Good. Nobody sees a crab in the dark. Except slugs. Slugs see everything."], ["foe", "Slurrrp. I see you, cabbage crab."]],
  "w2-s9": [["me", "Seed count: four. Lettuce, pea, carrot... and something from the crisper I can't name."], ["mold", "Plant your little seeds, crab. My spores will be waiting when they sprout."], ["me", "Then I'll weed you out. That's what gardeners do."]],
  // World 3: The Oven
  "w3-s2": [["me", "Bottom Rack. Not even the top rack. Even the oven thinks I'm small."], ["me", "Too hot for seeds in here. I'm keeping them deep in my shell. Don't ask."]],
  "w3-s3": [["me", "A muffin maze. In my day we had hedges. Proper hedges. I grew one. It was perfect."], ["me", "One of those cereal boxes has teeth. Pinch first, ask questions never."]],
  "w3-s4": [["n", "A Crumblet is trembling under a casserole lid."], [11, "Delivery for Crabbage! One Crumblet, handle with care! Sign here!"], ["me", "I didn't order a... Fine. FINE. Behind me, small. If the cookers rattle, that's the monsters' problem."]],
  "w3-s6": [["me", "Cookie Sheet Plains. Flat, hot, and something extra-large is lurking near the Scroll."], ["me", "An elite guarding a recipe. Must be a good recipe. It had better not be coleslaw."]],
  "w3-s7": [["me", "Roasting Pan Pass. Everything here gets roasted. Sprouts, potatoes... my patience."], ["me", "Key chest above the pass. I'm getting good at these sponge bounces. Don't tell anyone."]],
  "w3-s8": [["me", "Pizza Stone Steppe. Forty-five seconds of holding out. My shell is basically a baking dish now."], [7, "Small crab. A garden is patience with dirt on it. So is a siege."], ["me", "...That was annoyingly wise, seaweed."]],
  "w3-s9": [["me", "Seed count: seven. And a tomato cutting. It's fine. I'm not building anything."], ["n", "He was absolutely building something."]],
  // World 4: The Pantry
  "w4-s2": [["me", "Cereal Canyon. Oats, wheat, corn. Grains in boxes, never touching soil. Tragic."], ["me", "I'd set them free, but they're shaped like little O's and they bite."]],
  "w4-s3": [["me", "Flour Drifts. Like snow, if snow got into everything and then haunted you."], ["me", "Ladle up ahead. Rolling pin. Flatten the ghosts. Then sweep. Somebody has to sweep."]],
  "w4-s4": [["n", "A Crumblet waves from the top of a soup can."], ["me", "Another one? How many of you are there? ...Don't answer. Hop down. Keep clear of the cookers."]],
  "w4-s6": [["me", "Spice Rack Ridge. Basil, thyme, oregano... in JARS. They should be in dirt. In the sun. With me."], ["me", "Scroll first. Then I'm liberating the parsley."]],
  "w4-s7": [["me", "Pasta Jar Peaks. Noodles burrowing under my feet. Like worms, but useless to the soil."], ["me", "Last key's up on those ledges. A secret honey cellar. Bees help gardens grow. Grudgingly, like me."]],
  "w4-s8": [["me", "Honey Hollow. Forty-five seconds against all comers. Sticky, but honest work."], ["foe", "...Psst. Crab. If I wanted to grow something... where would I even start?"], ["me", "Start by not eating it. Now hold the line, slug."]],
  "w4-s9": [["me", "Seed count: twelve. Enough for a patch. A big patch. A patch for... more than one crab."], ["mold", "The jar is only a door, crab. What's behind it runs all the way down the drain."], ["me", "Then I'll dig all the way down. Gardeners don't mind getting their claws dirty."]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Pinch, pinch, PINCH!", "Get off my patch! All of you!", "Sideways and unstoppable!"],
  lowhp: ["My shell's cracking. Rude.", "Ow. Somebody water me.", "I'm wilting here!"],
  perfect: ["Sidestepped. Obviously.", "Crabs dodge sideways. Duh.", "Too slow, weed."],
  levelup: ["Hmph. Growing a bit.", "New growth. Don't make it weird.", "Bigger claws. Good."],
  secret: ["Mine now. Finders keepers.", "Ooh. Is that... seeds?", "Hidden stash? Mine."],
  boom: ["Weeded!", "That's mulch now.", "Compost, the lot of you!"],
  mimic: ["A box with teeth? Typical.", "Even the boxes want to eat me!", "Fake chest. Real pinch."],
  objective: ["Done. Don't thank me.", "Job done. Back to sideways.", "Hmph. That went well, I suppose."],
};
