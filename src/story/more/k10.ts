// Bluebeary: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Crumb Trail. Crumbs everywhere. Not one of them is a Crumblet. I checked. All of them."], ["me", "Hmph. Sponge on a high ledge. Little ones love bouncing. ...Checking up there too."]],
  "w1-s3": [["me", "Gummy Gully. Sticky. If a Crumblet's stuck in here, it's stuck in gummy. Bad."], ["n", "A ladle lever hangs over the gully, a rolling pin balanced above."], ["me", "Good. Pins flatten monsters. Paws flatten the rest."]],
  "w1-s4": [["n", "A Crumblet tumbles out of a toaster slot. It is not one of Bluebeary's six."], ["me", "...Not mine. Doesn't matter. We're walking to the exit. Stay behind me."], ["me", "Something big is waiting in these hills. And don't touch the pressure cookers. Don't touch anything."]],
  "w1-s6": [["me", "Recipe Scroll. Far end of the shelf. Seventy-five seconds."], ["me", "The muffin recipe's in the Chef's scrolls. Where my little ones came from. I'm getting it."]],
  "w1-s7": [["me", "Pepper Pass. Makes my nose twitch. Bears have good noses."], ["me", "I smell a key behind a sponge ledge. And a lunchbox that smells... wrong."]],
  "w1-s8": [["n", "The kitchen lights snap off. Waves of monsters gather on Cutting Board Bluffs."], ["me", "Dark. Crumblets hate the dark. Always needed a night-light."], ["me", "Forty-five seconds. I'll be the night-light. A very angry one."]],
  "w1-s9": [["foe", "Caw! Two shiny crumbs up on the stovetop, fuzzy! The King wears them like jewels!"], ["me", "...Two. Two of mine. Up there."], ["me", "Stop talking, bird. I'm walking faster."]],

  // World 2: The Fridge
  "w2-s2": [["me", "Dairy Lane. Two found. Four out there in the cold."], ["me", "Milk Carton Rammers. Hmph. Ram me. See what happens."]],
  "w2-s3": [["n", "The Frosty Shelf is crawling with monsters. Far more than usual."], ["me", "More monsters. I have two paws. That's plenty."], ["me", "Lunchboxes on the shelf too. Hit them first. Ask questions never."]],
  "w2-s4": [["n", "A Crumblet huddles on Pickle Jar Pier, frosted blue. Another stray."], ["me", "Strays walked home: one. Making it two. Come on. Stay close."], ["me", "Things that hiss are not your friends. Bears that growl are. Mostly."]],
  "w2-s6": [["me", "Another Recipe Scroll. Seventy-five seconds to reach it, then hold out."], ["mold", "Ssso many little crumbs, bear. Do you count them at night? So do I."], ["me", "...Whoever that was. Count your teeth. You'll have fewer soon."]],
  "w2-s7": [["n", "Something heavy waits on Butter Bridge: an extra elite, lying in ambush."], ["me", "Fine. Smash it. Then the key. Sponge, bounce, grab, back down."], ["me", "Crumblets would love sliding on this bridge. Not telling them it exists."]],
  "w2-s8": [["me", "Ketchup Canyon. Forty-five seconds of waves."], ["me", "Lure them to the pressure cookers. Pop. Monster paste. Like ketchup, but grumpier."]],
  "w2-s9": [["me", "Ice Tray Steps. Little cubes. Checking every one."], ["n", "Every cube holds a single frozen pea. Bluebeary checks all forty-two anyway."], ["me", "Hmph. Thorough isn't the same as worried."]],

  // World 3: The Oven
  "w3-s2": [["me", "Bottom Rack. Hot. Muffins bake once. Crumblets aren't meant to bake twice."], ["me", "Four found. Two left. Move."]],
  "w3-s3": [["me", "Muffin Tin Maze. ...This is where they were born. Twelve little cups."], ["me", "Ladle lever over the cups. Cereal boxes too. Never trust a box. Never have."]],
  "w3-s4": [["n", "A singed Crumblet sits by a casserole dish, crying very small tears."], [0, "Ooh, a little one! Can I carry it? I'm great at being bigger than muffins!"], ["me", "Hmph. No. ...Walk behind it, then. Strays walked home: three."]],
  "w3-s6": [["n", "The Cookie Sheet Plains swarm with monsters, all between Bluebeary and the Recipe Scroll."], ["me", "Big crowd of little troublemakers. I've raised six. I know crowds."]],
  "w3-s7": [["me", "Roasting Pan Pass. Key up on the ridge. Lever too."], ["me", "Pull lever. Pin drops. Monsters flatten. Simple. Like a recipe. A rude recipe."]],
  "w3-s8": [[11, "Thirty minutes or it's free! Oh hey, Bluebeary. Forty-five seconds? Easy!"], ["me", "Hmph. You're late for your own delivery, raptor."], [11, "LATE?! I'm... fashionably on schedule!"]],
  "w3-s9": [["me", "Top Rack. Something up there is hoarding. I smell blueberry."], ["me", "Hold on, little one. Five's coming."]],

  // World 4: The Pantry
  "w4-s2": [["me", "Cereal Canyon. Crumblets love cereal. Nobody tell them it's mostly boxes with teeth."], ["me", "One left. The littlest. Always wandered off. Always came back. Always."]],
  "w4-s3": [["me", "Flour Drifts. Everything's white. Blueberries stand out. Good."], ["me", "Lever drops a rolling pin. Flour plus pin. Pastry. Monster pastry."]],
  "w4-s4": [["n", "One more stray Crumblet sits in Tin Can Alley. And something big waits around the corner."], ["me", "Strays walked home: three. Four after this. I'm not counting. I'm just good at numbers."], ["me", "Behind me. Cookers go boom. Big one goes down."]],
  "w4-s6": [["foe", "Caw... the scroll's that way, fuzzy. Not that I'm helping. Just... saying."], ["me", "Hmph. When this is over, there's a spare muffin cup. If a crow wanted one."], ["foe", "...Caw."]],
  "w4-s7": [["me", "Pasta Jar Peaks. Last secret key. Sponge on the ledge."], ["me", "Noodle Lurkers under the pasta. Noodles shouldn't lurk. Noodles should be dinner."]],
  "w4-s8": [["me", "Honey Hollow. Honey. ...Bears like honey."], ["me", "No. Focus. Forty-five seconds of waves first. Honey after. Maybe a little honey during."]],
  "w4-s9": [["n", "From the Top Shelf comes a faint, sticky squeak."], ["mold", "Last little crumb, bear. Shall I keep it? The Sink has room for everyone."], ["me", "Hold on, littlest. Papa's climbing."]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Hmph. Again.", "Bear hug. The bad kind.", "That's for my Crumblets."],
  lowhp: ["Not... done... yet.", "Takes more than that. Hmph.", "Fur's singed. Still standing."],
  perfect: ["Too slow.", "Bears dodge. Who knew.", "Hmph. Missed."],
  levelup: ["Stronger. Six to protect.", "Level up. Nap later.", "Hmph. Bigger bear."],
  secret: ["Hidden stash. Little ones'll like it.", "For the Crumblets.", "Hmph. Found it. Always do."],
  boom: ["Flattened. Like a muffin top.", "Boom. Shouldn't have stood there.", "Rolled flat. Good."],
  mimic: ["Knew it. Never trust a box.", "Boxes don't bite. You're no box.", "Hmph. Lunch fights back."],
  objective: ["Done. Next.", "Job done. Counting heads.", "Easy as pie. Muffin. Whatever."],
};
