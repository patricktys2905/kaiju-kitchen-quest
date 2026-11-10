// Mothball: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Oh! Something round and glowing at the end of the Crumb Trail! Moon?"], ["n", "It was a crumb in a sunbeam. Mothball apologised to it anyway."]],
  "w1-s3": [["me", "Gummy Gully. Everything is sticky. Even my wings are having second thoughts."], ["me", "That ladle up there looks very pull-able. I wonder what it does to grumpy monsters."]],
  "w1-s4": [["n", "A tiny Crumblet blinks up at Mothball, blueberries wobbling."], ["me", "Are you lost too? Stay in my glow. We'll cross the Toaster Hills together."], ["me", "And keep away from the rattly pots. They go boom when anything gets close. Let the monsters hug them."]],
  "w1-s6": [["me", "A Recipe Scroll at the far end of the Spice Shelf. Maybe it's a recipe for moonlight."], ["me", "Seventy-five seconds. I'll flutter fast. Fluttering fast is like dreaming, but sweatier."]],
  "w1-s7": [["me", "Pepper Pass... ah... ACHOO! Spice makes my antennae tickle."], ["me", "A chest up on a ledge holds a key, I think. Keys open doors. Doors have windows. Windows have moons."]],
  "w1-s8": [["n", "Clouds cover the window. The Cutting Board Bluffs go dark as a closed cupboard."], ["me", "No moon tonight. Then I'll be the little light. Just for forty-five seconds. Just until they stop coming."]],
  "w1-s9": [["me", "The Burner Approach glows orange. Very bright. Very hot. Very not the moon."], ["foe", "Bzzt. Orange light, blue light, MY light... they all burn the same, little moth."], ["me", "Then I'll keep my wings to myself, thank you."]],
  // World 2: The Fridge
  "w2-s2": [["me", "Dairy Lane. The milk is so pale and round in its jug... Moon?"], ["n", "The Milk Carton Rammer lowered its horns."], ["me", "Not moon. Definitely not moon."]],
  "w2-s3": [["me", "Frosty Shelf. My breath makes little clouds. Little clouds make me miss the night sky."], ["me", "One lunchbox here is pretending to be a lunchbox. I can always tell. It has teeth."]],
  "w2-s4": [["n", "A Crumblet shivers among the pickle jars."], [10, "Hmph. That one's mine. Keep it warm, moth. I've got more to find."], ["me", "I'll wrap it in my wings. Wings make the best scarves."]],
  "w2-s6": [["n", "The fridge light flickers, then dies. The Egg Carton Cliffs vanish into cold dark."], ["me", "Twelve pale round eggs up there. Twelve tiny moons, and none of them mine."], ["me", "Last scroll was a recipe for crumble. No moonlight. Maybe this one. Fetch it, then hold on."]],
  "w2-s7": [["me", "Butter Bridge! Slippery, yellow, and it smells like warm toast."], [5, "Psst. Moth. Chest on the high ledge. The key inside beats all this butter. Don't tell Ricotta."], ["me", "I won't tell anyone. I'm very bad at secrets, but very good at forgetting."]],
  "w2-s8": [["me", "Ketchup Canyon. Red everywhere, like a sunset someone squeezed too hard."], ["me", "Forty-five seconds of monsters. I'll pretend they're stars and count them."]],
  "w2-s9": [["me", "The Ice Tray Steps climb toward the freezer. The air tastes like snow."], ["mold", "Hush, little moth. The cold keeps the light locked away. Stay. Sleep."], ["me", "...I don't sleep at night. That's when the moon's awake."]],
  // World 3: The Oven
  "w3-s2": [["me", "The Oven lamp is up there somewhere. My moon. The Golem said so."], ["me", "From the Bottom Rack, everything is up. I like up. Up is where moons live."]],
  "w3-s3": [["me", "Muffin Tin Maze. Twelve round cups, and every one of them dark."], ["me", "A ladle hangs over the maze. One pull and a rolling pin tidies up. Like a lullaby, but flatter."]],
  "w3-s4": [["n", "Popcorn pops. And pops. And POPS. The Casserole Cliffs are crawling with monsters."], ["me", "Little Crumblet, stay under my wing. There are more of them than there are stars."], ["me", "When the pressure cookers rattle, we float away. The monsters can stay for the fireworks."]],
  "w3-s6": [[8, "Moth! Me see paper far away. Paper say \"Recipe\". Me hope it cake."], ["me", "Oh, Chocomunch. I hope it's moonlight. Let's go together. I'll flutter, you stomp."]],
  "w3-s7": [["me", "The Roasting Pan Pass drips with gravy. My wings are getting glossy."], ["me", "There's a key chest on a high ledge. Somewhere a sponge is waiting to bounce me up. Sponges are kind."]],
  "w3-s8": [["n", "The Oven lamp sputters and dies. Only the Pizza Stone Steppe glows, dull and red."], ["mold", "Mmm. Warm little light. I'll drink every drop."], ["me", "Something is drinking my moon. Forty-five seconds, then I'm taking it back."]],
  "w3-s9": [["me", "Top Rack Ascent. The lamp is just above. I can see its little glass face."], ["foe", "Bzzt! Higher and higher, moth. Wings melt near the top, you know."], ["me", "That's wax wings. Mine are dust. Dust is very stubborn."]],
  // World 4: The Pantry
  "w4-s2": [["me", "Cereal Canyon. A hundred little O's, like a hundred tiny moons. Hello, tiny moons!"], ["n", "The tiny moons growled."]],
  "w4-s3": [["me", "Flour Drifts. Soft and white as moon dust. I'm so tempted to nap in it."], ["me", "But the Flour Ghosts got here first. And that cereal box over there is breathing."]],
  "w4-s4": [["n", "A small Crumblet sits on a tin can, crying blueberry tears."], ["me", "Shh, shh. Hold onto my glow. Tin Can Alley is loud, but we'll be quiet together."]],
  "w4-s6": [[7, "Little moth. The Scroll lies at the ridge's end. Old recipes remember when the kitchen was bright."], ["me", "Every scroll so far: crumble, cake, soup. Never moonlight. I'll fetch this one anyway, Norigon."]],
  "w4-s7": [["n", "The Pantry lights go out. A faint silver glow seeps from the cookie jar far above."], ["me", "It's coming from the jar! My moon is IN there!"], ["me", "The last secret key is up on these Pasta Jar Peaks. I'll find it in the dark. Moths always do."]],
  "w4-s8": [["me", "Honey Hollow. Golden, sticky, glowing like a harvest moon."], ["me", "No. I promised. Not every glow is the moon. ...But it is very pretty."], ["me", "Forty-five seconds. Then the jar."]],
  "w4-s9": [["me", "The Top Shelf Climb. Right up to the cookie jar. Right up to my moon."], ["mold", "Go on, little light. Break the jar. The Sink is so very dark, and it's waiting for you."], ["me", "...Then it'll be glad of the company."]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Flutter, flutter, POW!", "Moonbeams on repeat!", "Dust to dust, crumb to crumb!"],
  lowhp: ["My wings are fraying...", "Not the moth-eaten look!", "Need... a little light..."],
  perfect: ["Floated right past you!", "Lighter than moon dust!", "Missed me by a wingspan."],
  levelup: ["I'm glowing a little brighter!", "Waxing, not waning!", "Full moon energy!"],
  secret: ["Shiny! Not the moon, but shiny!", "Treasure, hiding like a moon.", "A secret! I'll keep it in my wings."],
  boom: ["Brighter than the moon!", "Oops. Lights out for you!", "Pin-rolled! Sweet dreams!"],
  mimic: ["Not a lunch box. A lunatic box!", "A box with teeth? Rude!", "I knew that box was too quiet."],
  objective: ["Done! Back to moon-hunting.", "Over the moon about that!", "Glowing with pride!"],
};
