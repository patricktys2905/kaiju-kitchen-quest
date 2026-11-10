// Gobzilla Jr.: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Stomp count: twelve. Big brother would be at the Fridge by now."], ["me", "Ooh, a sponge up there! Bouncy things are how small kaiju get tall. Temporarily."]],
  "w1-s3": [["n", "Gummy Gully is wriggling. That's not the gummies. That's a LOT of monsters."], ["me", "Lots of little ones? Finally, something my size to stomp!"], ["me", "And a ladle lever up top. Rolling pins don't care how small you are. I like rolling pins."]],
  "w1-s4": [["n", "A tiny Crumblet peeks out from behind a toaster, its blueberries trembling."], ["me", "Don't worry, little muffin. Stay behind me. I'm... the big one here?"], ["me", "I'm the BIG one here! Rawr! (And stay away from the hissing pressure cookers.)"]],
  "w1-s6": [["me", "The Recipe Scroll is at the far end of the Spice Shelf. Seventy-five seconds to grab it."], ["me", "Big brother says I'm all sugar and no spice. Time to get spicy."]],
  "w1-s7": [["foe", "Psst, shrimp! I left a friend in Pepper Pass for you. A BIG friend. Ha!"], ["me", "Brutus! ...Fine. Big friends fall over just like big bullies."], ["me", "Plus there's a secret key hidden up high. High is my least favourite direction."]],
  "w1-s8": [["me", "Cutting Board Bluffs. Monsters coming in waves, and I have to hold out for forty-five seconds."], ["me", "Big brother can hold his breath that long. I can hold my GROUND that long."]],
  "w1-s9": [["me", "It smells like burnt toast up ahead. Like a whole breakfast went wrong."], ["mold", "Hehehe... tiny berry. Toast is only bread that got... changed."], ["me", "W-whoever said that, I'm not scared! (I'm medium scared.)"]],

  // World 2: The Fridge
  "w2-s2": [["me", "Dairy Lane. Milk Carton Rammers, Yogurt Slimes... this whole street is past its date."], ["me", "Stomp count: two hundred and six. I'm over budget. Real kaiju go over budget."]],
  "w2-s3": [[11, "Beep beep! Hot pizza coming through! Tip: the lunchboxes in here bite!"], ["me", "Thanks, Pizzaraptor! Er... how do I tip YOU?"], [11, "Stomp something big. I'll count it!"]],
  "w2-s4": [["n", "The fridge light clicks off. Pickle Jar Pier goes dark and briny. A lost Crumblet whimpers."], ["me", "It's okay. I'm scared of the dark too. Let's be scared together. Quietly. Toward the exit."], ["me", "And if a pressure cooker hisses, we go the OTHER way."]],
  "w2-s6": [["me", "A Recipe Scroll at the end of Egg Carton Cliffs. Grab it fast, then hold on for 25 seconds."], ["me", "Twelve eggs, one scroll, no time for breakfast puns. ...Okay, one. Let's SCRAMBLE!"]],
  "w2-s7": [["me", "Butter Bridge. Slippy, slidey, and the secret key is up on a ledge somewhere."], ["me", "Big brother once found a key and lost it in a jam jar. I'll keep mine in my leaves."]],
  "w2-s8": [["n", "Ketchup Canyon is boiling over with monsters. Hold out for forty-five seconds."], ["me", "So many! It's like someone squeezed the bottle too hard!"], ["me", "That's fine. More monsters means more stomps. Stomp count, here I come!"]],
  "w2-s9": [["me", "Ice Tray Steps. Every step is a giant cube. I'll climb them like a giant kaiju."], ["mold", "Climb, little berry. The cold up there keeps things fresh... forever."], ["me", "You're not the boss of my freshness!"]],

  // World 3: The Oven
  "w3-s2": [["me", "The Bottom Rack. My leaves are wilting into a fringe. It's a new look."], ["me", "Stomp count: four hundred and... something. Real kaiju lose count."]],
  "w3-s3": [["n", "Something large waits in the Muffin Tin Maze. Something hungrier than the rest."], ["me", "An ambush? Big brother ambushes me every breakfast. I'm READY."], ["me", "Also: if a cereal box looks extra crunchy, it's a trap. Probably a bitey trap."]],
  "w3-s4": [[10, "Hmph. A stray Crumblet on the cliffs. You. Strawberry. Walk it to the exit."], ["me", "Me? Bluebeary trusts ME with a muffin?!"], ["me", "Gobzilla Medium, babysitter class. Stay close, little one. Casseroles bubble."]],
  "w3-s6": [["me", "The Recipe Scroll is across the Cookie Sheet Plains. Grab it, then hold the line."], ["mold", "The Chef's recipes, little berry? The Crown has a recipe too. One part... you."], ["me", "Ew! I'm not an ingredient! I'm a KAIJU!"]],
  "w3-s7": [["me", "Roasting Pan Pass. There's a ladle lever on the ridge. Pull it and... pin drop."], ["me", "The secret key's up high again. I used to need a step stool. Now I just need a sponge. Progress!"]],
  "w3-s8": [["me", "Pizza Stone Steppe. Forty-five seconds of waves. Hot stone, hot monsters, hot berry."], ["me", "Runaway pressure cookers want to blow up? I'll introduce them to some Sausage Rams."]],
  "w3-s9": [["foe", "Oi, shrimp! Still climbing? The Grease Dragon's gonna spread you like jam."], ["me", "Then I'll be the spiciest jam he's ever tasted, Brutus. Watch me."]],

  // World 4: The Pantry
  "w4-s2": [["me", "Cereal Canyon. Big brother said cereal comes in boxes. He never said the boxes have TEETH."], ["me", "He never came this far, either. This time I get to tell HIM the story."]],
  "w4-s3": [["me", "Flour Drifts. Everything's white and puffy, like a giant pillow fight."], ["me", "Ladle lever, rolling pin, lots of flour... I'm about to make the biggest monster pancake ever."]],
  "w4-s4": [["n", "A Crumblet waves from behind a soup can. It's been waiting for someone big."], ["me", "Someone big? ...Oh! Me! That's ME! Stay right behind me, little one."], ["me", "Rule one: stay away from hissing pots. Rule two: I'm very proud of rule one."]],
  "w4-s6": [["n", "The pantry bulb flickers out. Spice Rack Ridge goes pitch dark."], ["me", "Can't see the Recipe Scroll. Can smell it, though. Paprika and... hope."], ["me", "Monsters are tougher in the dark. So am I. I think!"]],
  "w4-s7": [["me", "Pasta Jar Peaks. Noodle Lurkers wriggling under the spaghetti. Gross AND spooky."], ["me", "The last secret key is up there somewhere. Penne for your thoughts on where?"]],
  "w4-s8": [["me", "Honey Hollow. Forty-five seconds of sticky waves. If I get stuck, I'll stomp in place."], [8, "Small berry fight good. Me watch. Me cheer. GO BERRY!"]],
  "w4-s9": [["me", "The Top Shelf. Higher than big brother has ever been."], ["mold", "Climb all you like, little berry. Every road leads down... to the Sink."], ["me", "Then I'll stomp the jar and come down as Gobzilla Medium. Final answer."]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Stomp count: a LOT!", "Rawr-rawr-rawr-RAWR!", "Gobzilla Medium combo!"],
  lowhp: ["Not scared! (A bit scared.)", "Ow! Seeds... everywhere...", "Big brother, a little help?"],
  perfect: ["Too small to hit! For once!", "Missed me! Small is fast!", "Berry nimble!"],
  levelup: ["I grew! Gobzilla Medium-er!", "Bigger! A whole seed bigger!", "Level up! Tell big brother!"],
  secret: ["Treasure! Berry secret!", "Big brother never found this!", "Ooh, shiny! Mine now. Rawr."],
  boom: ["KABOOM! Did I do that?!", "Now THAT'S a jam session!", "Flat as a fruit roll-up!"],
  mimic: ["Bad lunchbox! No biting!", "That box has TEETH!", "Not snack! Monster! STOMP!"],
  objective: ["Done! Real kaiju stuff!", "Mission stomped!", "Did you see, big brother?"],
};
