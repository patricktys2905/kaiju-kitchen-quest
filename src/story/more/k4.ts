// Mothball: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Ooooh! Something round and glowy at the end of the Crumb Trail! Is it... the MOON?"], ["me", "Oh. It's a crumb in a sunbeam. Sorry, Mr. Crumb! You're still very shiny!"]],
  "w1-s3": [["me", "Gummy Gully! Ew, ew, sticky! My wings just went SCHLUCK!"], ["me", "Ooh, a big shiny ladle up there! What happens if I pull it on the grumpy monsters?"]],
  "w1-s4": [["n", "Aww! A tiny Crumblet blinks up at Mothball, blueberries wobbling."], ["me", "Hi, little one! Lost? Snuggle up in my glow and we'll float over the Toaster Hills!"], ["me", "But stay away from the rattly pots, okay? KA-BLAM! Those are for monster hugs only."]],
  "w1-s6": [["me", "A Recipe Scroll way out on the Spice Shelf! Ooh, maybe it's a recipe for moonlight!"], ["me", "Seventy-five seconds? Flap flap flap! Fluttering fast is like dreaming, but sweatier!"]],
  "w1-s7": [["me", "Pepper Pass! Ah... AH-CHOO! Hee hee, spice makes my antennae tickle!"], ["me", "Ooh, a chest on a ledge with a key! Keys open doors, and doors have windows, and windows have MOONS!"]],
  "w1-s8": [["n", "Uh-oh! Clouds cover the window and the Cutting Board Bluffs go dark!"], ["me", "Aw, no moon tonight? Then I'll be the little light! Forty-five seconds, monsters. Get dazzled!"]],
  "w1-s9": [["me", "Ooh, the Burner Approach is sooo bright and orange! Hmm. Nope, not the moon."], ["foe", "Bzzzt! Orange light, blue light, MY light! They all go ZAP, little moth!"], ["me", "Eep! Then I'm keeping my wings to myself, thank you very much!"]],
  // World 2: The Fridge
  "w2-s2": [["me", "Dairy Lane! Ooh, that milk jug is so pale and round... Moon? Is that you?"], ["n", "Uh-oh! The Milk Carton Rammer lowers its horns!"], ["me", "Yikes! Not the moon! DEFINITELY not the moon!"]],
  "w2-s3": [["me", "Frosty Shelf! Hoo, my breath makes little clouds. Now I miss the night sky."], ["me", "And psst, that lunchbox over there? It's pretending. I can always tell. It's got TEETH!"]],
  "w2-s4": [["me", "Aww, a Crumblet shivering in the pickle jars! Come here, sweetie!"], [10, "Hmph. That little one's mine. Keep it warm, moth. I got more to find."], ["me", "Ooh, I'll wrap it in my wings! Wings make the snuggliest scarves!"]],
  "w2-s6": [["me", "Eek! The fridge light went out! Twelve pale eggs up there, like twelve tiny moons. None of 'em mine."], ["me", "Last scroll was crumble, not moonlight. Aw! Maybe this one! Grab it, then hang on tight!"]],
  "w2-s7": [["me", "Butter Bridge! Whee, it's slippy and it smells like warm toast!"], [5, "Psst. Moth. Chest on the high ledge. The key in there beats all this butter. Don't tell Ricotta."], ["me", "Tell who? Hee! I'm bad at secrets but super good at forgetting!"]],
  "w2-s8": [["me", "Ketchup Canyon! Whoa, it's like a sunset somebody squeezed too hard!"], ["me", "Forty-five seconds of monsters? I'll pretend they're stars and count 'em! One, two, ooh, a big one..."]],
  "w2-s9": [["me", "The Ice Tray Steps! Brrr, the air up here tastes like snow."], ["mold", "Hehehe... hush, little moth. The cold keeps the light locked up. Stay. Sleep."], ["me", "Nuh-uh! Moths don't sleep at night. That's when the moon's awake!"]],
  // World 3: The Oven
  "w3-s2": [["me", "The Golem said my moon's in here! The Oven lamp, way, way up!"], ["me", "Down on the Bottom Rack, everything is up. I like up! Up is where moons live!"]],
  "w3-s3": [["me", "Muffin Tin Maze! Twelve round cups and not one of them is glowing. Hmph!"], ["me", "Ooh, a ladle! One pull and a rolling pin goes ROLLY-ROLL. Like a lullaby, but flatter!"]],
  "w3-s4": [["n", "POP! POP! POP! Popcorn everywhere, and the Casserole Cliffs are crawling with monsters!"], ["me", "Under my wing, little Crumblet! There are more of them than there are stars!"], ["me", "When the pressure cookers rattle, we float away. Wheee! The monsters can stay for the fireworks."]],
  "w3-s6": [[8, "Moth! Me see paper far away. Paper say \"Recipe\". Me hope it cake."], ["me", "Ooh, Chocomunch! I hope it's moonlight! Let's go together. I flutter, you stomp!"]],
  "w3-s7": [["me", "Roasting Pan Pass! Drip, drip, gravy everywhere! My wings are getting all glossy!"], ["me", "A key chest on a high ledge! Somewhere there's a sponge to bounce me up. Sponges are so nice."]],
  "w3-s8": [["n", "Uh-oh! The Oven lamp sputters out! Only the Pizza Stone Steppe glows, dull and red."], ["mold", "Mmmm, hehehe! Warm little light. I'm gonna slurp up every drop."], ["me", "Hey! Somebody's drinking my moon! Forty-five seconds, then I'm taking it BACK!"]],
  "w3-s9": [["me", "Top Rack Ascent! I can see the lamp's little glass face! Hi, moon!"], ["foe", "Bzzt! Higher and higher, moth! Wings melt near the top, ya know!"], ["me", "That's wax wings, silly! Mine are dust. And dust is super stubborn!"]],
  // World 4: The Pantry
  "w4-s2": [["me", "Cereal Canyon! A hundred little O's, like a hundred tiny moons! Hellooo, tiny moons!"], ["me", "Um. Why are the tiny moons growling? EEP!"]],
  "w4-s3": [["me", "Flour Drifts! Soft and white like moon dust. Ooh, it'd be sooo nice for a nap..."], ["me", "Aw, the Flour Ghosts beat me to it. And yikes, that cereal box is BREATHING!"]],
  "w4-s4": [["n", "Aww! A little Crumblet sits on a tin can, crying blueberry tears."], ["me", "Shh, shh, it's okay! Hold onto my glow. Tin Can Alley's loud, but we'll tiptoe together."]],
  "w4-s6": [[7, "Hrrm. Little moth, old recipes remember when the kitchen was bright. Also when it had snacks."], ["me", "Norigon, the last scroll was SOUP! Not one drop of moonlight! Okay, okay, I'll fetch this one."]],
  "w4-s7": [["me", "Hey, who turned off the Pantry? Wait... a silver glow, way up in the cookie jar!"], ["me", "My moon is IN THERE! But first, the last secret key on Pasta Jar Peaks. Moths can find stuff in the dark!"]],
  "w4-s8": [["me", "Honey Hollow! Golden and glowy like a harvest moon! Ooooh, shiny..."], ["me", "No! I promised! Not every glow is the moon. Buuut it IS very pretty."], ["me", "Forty-five seconds, then the jar!"]],
  "w4-s9": [["me", "The Top Shelf Climb! Right up to the cookie jar! Right up to my moon!"], ["mold", "Hehehe, go on, little light. Break the jar. The Sink is soooo dark, and it's waiting for you."], ["me", "Ooh, then it'll be happy to have some company!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Flutter, flutter, POW!", "Moonbeams on repeat! Wheee!", "Dust to dust, crumb to crumb!"],
  lowhp: ["Eep! My wings are fraying!", "Not the moth-eaten look!", "Need... a little... light..."],
  perfect: ["Floated right past ya!", "Lighter than moon dust!", "Whoosh! Missed me by a wing!"],
  levelup: ["Ooh, I'm glowing brighter!", "Waxing, not waning! Hee!", "Full moon energy!"],
  secret: ["Ooooh, shiny! Moon? Nope! Still shiny!", "Psst, treasure! Hide it in my wings!", "A secret! Hee hee hee!"],
  boom: ["KA-BLAM! Brighter than the moon!", "Oopsie! Lights out for you!", "Pin-rolled! Sweet dreams!"],
  mimic: ["Lunch box? More like LUNATIC box!", "Yikes! A box with teeth? Rude!", "I knew that box was too quiet!"],
  objective: ["Done! Back to moon-hunting!", "I'm over the moon! Get it?", "Glowing with pride! Hee!"],
};
