// Squidgeon: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Lab notes, entry two! The Crumb Trail contains... CRUMBS! Fascinating! Write that down, me!"], ["me", "Also, a sponge by a high ledge! Bounciness: unknown! Must poke it. For science!"]],
  "w1-s3": [["me", "Whoa-ho! My spore-o-meter says there's one HUGE specimen up ahead! An extra elite!"], ["me", "And a ladle lever! Hypothesis: pull ladle, drop pin, SPLAT goes the problem!"]],
  "w1-s4": [["n", "A tiny Crumblet tugs on Squidgeon's tentacle."], ["me", "A lab assistant! Rule one: stay behind the scientist. Rule two: don't lick the samples!"], ["me", "Rule three, in BIG letters: rattly pressure cookers are for monsters only! KA-BLOOEY!"]],
  "w1-s6": [["me", "A Recipe Scroll! Old cookbooks might list anti-fungus-ical spices! Gimme gimme!"], ["me", "Whoa, the spore count's off the charts! Seventy-five seconds! Science waits for no squid!"]],
  "w1-s7": [["me", "Note to self: Pepper Pass is forty percent pepper and sixty percent AH-CHOO!"], ["me", "My tentacles are tingling! Key chest on a ledge up there! Fetching it, for SCIENCE!"]],
  "w1-s8": [["foe", "Professor Penicillin here! I've sent some test subjects your way, colleague. Do take notes! Mwahaha!"], ["me", "Forty-five seconds of specimens? Oh, I'll take notes. With my tentacles. VERY HARD."]],
  "w1-s9": [["me", "Antidote progress: twelve percent! Mostly toast crumbs and stubbornness."], [0, "Rawr! Is that a colander on your head? Big brother says scientists are cool!"], ["me", "Your big brother is correct! That's been peer-reviewed!"]],
  // World 2: The Fridge
  "w2-s2": [["me", "Dairy Lane! Milk, yogurt, cheese... for mould, it's an all-you-can-eat buffet!"], ["me", "Note to self: the Yogurt Slimes say they're \"cultured\". I've talked to them. They are NOT."]],
  "w2-s3": [["me", "Frosty Shelf! Brrr! Jelly sets in the cold. If I stop wiggling, I turn into dessert!"], ["me", "Pull lever, drop pin, flat monsters! My favourite experiment! Repeat until EUREKA!"]],
  "w2-s4": [["n", "Uh-oh! A Crumblet bobs on a pickle lid, and the pier is crawling with monsters!"], ["me", "Assistant! You're back! ...Oh, you're a new one. Hi! Rules one to three still apply!"], ["me", "Monster density: YIKES. Recommended method: pressure cookers. LOTS of pressure cookers."]],
  "w2-s6": [["me", "Another Recipe Scroll! The last one said \"add garlic\". The Garlic Clerics did NOT agree!"], ["me", "Seventy-five seconds to the end of the Egg Carton Cliffs! Eggs, please don't crack under pressure!"]],
  "w2-s7": [["me", "Hey, who turned off the fridge light? Whoa-whoa-WHOA! Butter Bridge is slippery!"], ["me", "Dark, slippy, and a secret key up top? Too many variables! Fun level: MAXIMUM!"]],
  "w2-s8": [["me", "Antidote progress: forty-one percent! Ketchup is NOT an ingredient. I checked. Twice."], ["me", "Forty-five seconds of waves! Brace yourselves, tentacles! You too, colander!"]],
  "w2-s9": [["mold", "Hehehe... your little cure tickles, jelly. My Crown grew a thousand spores since you started."], ["me", "A thousand? Pfft! Then I need a thousand and ONE samples! Good thing I packed extra jars!"]],
  // World 3: The Oven
  "w3-s2": [["me", "Heat should cook mould! But these spores are wearing teeny oven mitts! That's CHEATING!"], ["me", "Note to self: do jellies sweat? On the Bottom Rack, yes! Somebody update the textbooks!"]],
  "w3-s3": [["me", "Muffin Tin Maze! Twelve cups, one exit, and a Cereal Box Mimic pretending to be breakfast!"], ["me", "Theory: if I pull that ladle, a rolling pin solves the maze for me. Testing, testing!"]],
  "w3-s4": [[10, "Hmph. Jelly. That Crumblet's one of mine. You keep it safe, or you answer to me."], ["me", "Y-yes, Mr. Bluebeary, sir! Assistant, stay close! Rule three: cookers are NOT toys!"]],
  "w3-s6": [["me", "Scroll number three! If this one says \"add more garlic\", I quit! I'm quitting!"], ["me", "Seventy-five seconds across the Cookie Sheet Plains! Note: avoid the hot parts. Oh no. It's ALL hot parts!"]],
  "w3-s7": [["me", "Antidote progress: sixty-eight percent! Still missing something sour. Sour and BRAVE."], ["me", "Ooh, that key chest might open a secret bakery! Bakeries have lemons! Lemons are sour! EUREKA!"]],
  "w3-s8": [["foe", "Penicillin again! My spores LOVE a pizza stone! Warm, crusty... perfect lab conditions!"], ["me", "Forty-five seconds, Professor! Then your lab's closed for inspection!"]],
  "w3-s9": [["me", "Note to self: the dragon up top is coated in grease. Grease traps spores. Gross! Also useful!"], ["me", "Second note to self: wash colander afterwards. Twice. Make it three times."]],
  // World 4: The Pantry
  "w4-s2": [["me", "Cereal Canyon! Cheerio Blobs split in two when you bonk 'em, like cells! Must stay calm!"], ["me", "Nope! Can't do it! FASCINATING!"]],
  "w4-s3": [["me", "Flour Ghosts? Pfft! Flour isn't haunted, it's a fine powder! I refuse to fear a powder!"], ["me", "...Did that flour just say BOO? EEP! Moving on! That ladle better work!"]],
  "w4-s4": [["me", "Assistant number four! Welcome to the team! The team is me. And now you! Yay, team!"], ["me", "Cookers ahead! Let the Can Crushers find 'em first. Science is mostly letting stuff explode."]],
  "w4-s6": [[6, "Halt! The Recipe Scroll is ROYAL property! ...But We suppose a scientist may borrow it."], ["me", "Thanks, Dumplord! Peer review is so polite today! Seventy-five seconds, GO!"]],
  "w4-s7": [["me", "Pasta Jar Peaks! The Noodle Lurkers burrow and bite! I call it al dente aggression!"], ["me", "One more key, one more secret door! Note to self: side quests are FUN!"]],
  "w4-s8": [["me", "EUREKA! Honey fights fungus! Honey Hollow might have the final ingredient!"], ["me", "Uh-oh, my scanner says one extra elite. Big and cranky! Survive forty-five seconds first!"]],
  "w4-s9": [["mold", "Hehehe... ninety-nine percent, little chemist. So close! The last percent is waiting in the Sink."], ["me", "Then that's where the experiment ends! Final note before the jar: good luck, me! You got this!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Tentacle-ular combo!", "Results: repeatable! Hah!", "All arms on deck!"],
  lowhp: ["Note to self: losing jelly!", "Experiment going sideways!", "Requesting a lab break! Please!"],
  perfect: ["Calculated! Obviously!", "Wibble, wobble, DODGE!", "Predicted that! 87% sure!"],
  levelup: ["New hypothesis: I'm STRONGER!", "Peer-reviewed power-up!", "Promoted to Senior Squid!"],
  secret: ["EUREKA! A hidden chest!", "Hidden variable found!", "Ooh! Undocumented treasure!"],
  boom: ["Controlled explosion! Ish!", "Rolling pin: super effective!", "Now THAT'S a reaction!"],
  mimic: ["Specimen has teeth! Noted!", "Box is not a box! Fascinating!", "False positive! VERY positive!"],
  objective: ["Objective complete! Logged!", "Hypothesis confirmed! Hah!", "Another one for the notes!"],
};
