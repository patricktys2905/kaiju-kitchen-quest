// Toastbat: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Lights out on the Crumb Trail. Perfect. A good thief never leaves crumbs..."], ["n", "Toastbat sheds three crumbs with every flap."], ["me", "...Okay, so it's less a trail and more a confession."]],
  "w1-s3": [["me", "The Plan, phase one: cross Gummy Gully without getting stuck. Phase two: see phase one."], ["me", "Ladle lever up top, rolling pin on a ledge. Every great heist needs one big, heavy distraction."]],
  "w1-s4": [["me", "Toaster Hills. The old neighbourhood. Smells like Grandma, and Grandma smelled like burnt bread."], ["n", "A lost little Crumblet grabs Toastbat's wing and refuses to let go."], ["me", "Kid, I work alone. ...Fine. Stay close and stay away from the hissing pots."]],
  "w1-s6": [["me", "A Recipe Scroll at the far end of the Spice Shelf. A smash-and-grab. My favourite genre."], ["me", "Seventy-five seconds? I once stole a whole crouton in less."]],
  "w1-s7": [[4, "Excuse me... have you seen the moon? It went dark when the Chef vanished."], ["me", "Moonlight's bad for business. But... I hope you find it. Also, there's a key hidden round here. Shh."]],
  "w1-s8": [["me", "Cutting Board Bluffs. Forty-five seconds of looking like I meant to get cornered. Time to bluff."], ["me", "Thief's rule: if you can't escape, let the pressure cookers do the talking."]],
  "w1-s9": [["mold", "Little thief... the Butter belongs in the Sink. Everything does, eventually."], ["me", "Who said that? ...Not scared. Toast doesn't get the shivers. Toast gets crunchy."]],
  // World 2: The Fridge
  "w2-s2": [["me", "Dairy Lane. If the Butter's anywhere, it's down this street."], ["me", "Milk Carton Rammers on patrol, expiry dates printed on their foreheads. Amateurs."]],
  "w2-s3": [["me", "Frosty Shelf. Cold paws, crunchy wings. Ideal safecracking weather."], ["me", "That lunchbox looks way too innocent. I know innocent. I fake it daily."]],
  "w2-s4": [["me", "Another lost Crumblet? Rule of the trade: nobody gets left behind. Especially the cute ones."], [10, "Hmph. You keep that little one safe, bat. I'll know if you don't."], ["me", "Yes sir, terrifying muffin sir."]],
  "w2-s6": [["me", "The fridge light's out. First time in history that little bulb isn't snitching on anyone."], ["me", "Grab the Recipe Scroll in the dark, then hold out. A classic night job."]],
  "w2-s7": [["me", "Butter Bridge! Finally! It's... margarine. I have never felt so betrayed."], ["me", "But the word is there's a key in a secret chest here. I accept consolation prizes."]],
  "w2-s8": [["me", "Ketchup Canyon. Hold out forty-five seconds while the whole fridge tries to ketchup with me."], ["me", "Lure them into a pressure cooker. Saucy plan, I know."]],
  "w2-s9": [["foe", "Squeak! Left you a welcome party at the top of the Ice Tray Steps, bat. A big one."], ["me", "Ricotta set an ambush. Okay. Nobody tell me the odds."]],
  // World 3: The Oven
  "w3-s2": [["me", "The Bottom Rack. Hot enough to toast a toast. I'm basically being re-toasted."], ["me", "Note to self: extra crispy is not a disguise."]],
  "w3-s3": [["me", "The oven light's off. Muffin Tin Maze in the dark, and every cup could hide a guard."], ["me", "Or a cereal box with teeth. Good thing I always clock the ladle lever on the way in."]],
  "w3-s4": [["me", "A Crumblet in the Casserole Cliffs? That's three, kid. Are you lot following me on purpose?"], ["n", "Word had spread among the Crumblets: the bat with toast wings is a soft touch."], ["me", "I'm crispy. CRISPY."]],
  "w3-s6": [["me", "Recipe Scroll on the Cookie Sheet Plains. In and out before the timer dings."], [8, "Bat go fast. Me go slow. Me guard door."], ["me", "Best lookout I've ever had. Also the only one. Don't tell him."]],
  "w3-s7": [["me", "Roasting Pan Pass. Another key, another secret vault. I'm starting a collection."], ["me", "Lever first, rolling pin second, loot third. The holy trinity."]],
  "w3-s8": [[11, "A pizza stone! Finally, somewhere that respects my profession!"], ["me", "You hold the left, I hold the right. Forty-five seconds and nobody gets delivered."]],
  "w3-s9": [["mold", "Warm... warm... but the Butter isn't warm any more, little thief. Someone moved it."], ["me", "Get your own heist, creepy voice. ...Wait. Moved it where?"]],
  // World 4: The Pantry
  "w4-s2": [["me", "Cereal Canyon. Boxes everywhere, and any one could be a mimic."], ["me", "Paranoia: the most important meal of a thief's day."]],
  "w4-s3": [["me", "Flour Drifts. Great for footprints, terrible for thieves. Lucky me, I fly."], ["me", "The Plan, phase one: get the Butter. Phase two... funny. I keep leaving phase two blank."]],
  "w4-s4": [["me", "Last lost Crumblet. Stick with Uncle Toastbat, kid. I know every alley in Tin Can Alley."], ["n", "He has stopped pretending he works alone."]],
  "w4-s6": [["me", "Another Recipe Scroll. The Chef keeps leaving clues like someone meant to be followed."], ["me", "Maybe the Chef wanted a thief. Somebody really good at finding hidden things."]],
  "w4-s7": [["me", "Pasta Jar Peaks, and the whole Pantry is swarming. Someone really doesn't want me up high."], ["me", "Fine. Lever, rolling pin, spaghetti everywhere. For once, let's make some noise."]],
  "w4-s8": [[6, "Thief! By royal decree you are pardoned. Now help me hold this line."], ["me", "Pardoned? I'm touched. Mostly by honey. Forty-five seconds, Your Stickiness."]],
  "w4-s9": [["me", "Top Shelf. Where they keep the good stuff. My whole career has led here."], ["me", "Thought I'd feel greedy right now. Mostly I feel like the kitchen needs it more than I do."]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Clean job. No fingerprints!", "Grand theft combo!", "I steal the show, too."],
  lowhp: ["Getting a bit burnt here...", "Abort heist! ...Un-abort!", "I'm toast. Well, MORE toast."],
  perfect: ["Missed me. Thieves don't get caught.", "Too slippery. Buttered, even.", "Swoosh. I was never here."],
  levelup: ["Upgraded my toolkit!", "From lightly toasted to golden!", "Master thief, level up."],
  secret: ["Hidden stash! My people!", "Unguarded loot. My favourite.", "Bounced right into the loot!"],
  boom: ["Now THAT'S a distraction.", "Smash and grab. Mostly smash.", "Flattened. No witnesses."],
  mimic: ["A fake chest? That's MY trick!", "Rule one: never trust a box.", "Loot with teeth. Lousy loot."],
  objective: ["Job done. Smooth as butter.", "Heist complete. Roll credits.", "In and out. Textbook."],
};
