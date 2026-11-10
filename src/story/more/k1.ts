// Squidgeon: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Journal, entry two. The Crumb Trail contains crumbs. Groundbreaking. Write that down, me."], ["me", "Also noted: a sponge near a high ledge. Its bounciness requires further testing."]],
  "w1-s3": [["me", "Gummy Gully. My readings show one VERY large spore signature up ahead. An extra elite!"], ["me", "Bigger specimen, bigger sample. And that ladle lever? Hypothesis: pull ladle, drop pin, flatten problem."]],
  "w1-s4": [["n", "A tiny Crumblet tugs at Squidgeon's tentacle."], ["me", "A field assistant! Rule one: stay behind the scientist. Rule two: do not lick the samples."], ["me", "Rule three: rattling pressure cookers are for monsters only. That one's in bold."]],
  "w1-s6": [["me", "A Recipe Scroll! Old cooking texts may list antifungal spices. I must have it."], ["me", "Spore count: off the chart. There are SO many of them. Seventy-five seconds. Science waits for no squid."]],
  "w1-s7": [["me", "Journal: Pepper Pass is 40% pepper and 60% sneezing. Sample secured. Also a sneeze."], ["me", "My tentacles detect a key-shaped chest on a ledge above. Fetching it, for science."]],
  "w1-s8": [["foe", "Professor Penicillin here! I've sent a few test subjects your way, colleague. Do take notes."], ["me", "Forty-five seconds of incoming specimens. I'll take notes. With my tentacles. Very hard."]],
  "w1-s9": [["me", "Antidote progress: 12%. Mostly toast crumbs and stubbornness."], [0, "Rawr! Is that a colander on your head? Big brother says scientists are cool."], ["me", "Your big brother is correct. Peer reviewed, even."]],
  // World 2: The Fridge
  "w2-s2": [["me", "Dairy Lane. Milk, yogurt, cheese. For mould, this is an all-you-can-eat buffet."], ["me", "Note: the Yogurt Slimes claim to be \"cultured\". I have spoken to them. They are not."]],
  "w2-s3": [["me", "Frosty Shelf. Brr. Jelly sets in the cold. If I stop moving, I become dessert."], ["me", "Lever, pin, flat monsters. My favourite three-step experiment. Repeat as needed."]],
  "w2-s4": [["n", "A Crumblet bobs on a pickle lid. All around it, the pier is absolutely heaving with monsters."], ["me", "Assistant! You're back! ...Oh, a different one. Rules one to three still apply."], ["me", "Population density: alarming. Recommended method: pressure cookers. Many pressure cookers."]],
  "w2-s6": [["me", "Another Recipe Scroll. The last one said \"add garlic\". The Garlic Clerics did NOT agree."], ["me", "Seventy-five seconds to the end of the Egg Carton Cliffs. Eggs, please don't crack under pressure."]],
  "w2-s7": [["n", "The fridge light clicks off. Butter Bridge is pitch black and very, very slippery."], ["me", "Darkness, slipperiness, and a secret key somewhere above. Variables: too many. Fun: maximum."]],
  "w2-s8": [["me", "Antidote progress: 41%. The ketchup is not an ingredient. I tried. Twice."], ["me", "Forty-five seconds of waves. Brace, tentacles. Brace, colander."]],
  "w2-s9": [["mold", "Your little cure tickles, jelly. My Crown has grown a thousand spores since you began."], ["me", "Then I'll need a thousand and one samples. Good thing I brought extra jars."]],
  // World 3: The Oven
  "w3-s2": [["me", "Heat should kill mould. These spores are wearing tiny oven mitts. Unacceptable."], ["me", "Journal: Do jellies sweat? On the Bottom Rack, apparently yes. Revising the textbook."]],
  "w3-s3": [["me", "Muffin Tin Maze. Twelve cups, one exit, and a Cereal Box Mimic pretending to be breakfast."], ["me", "Theory: if I pull that ladle, a rolling pin solves the maze for me. Testing now."]],
  "w3-s4": [[10, "Jelly. That Crumblet is one of mine. Keep it safe, or you answer to me."], ["me", "Understood, Mr Bluebeary. Assistant, stay close. And remember rule three: cookers are not toys."]],
  "w3-s6": [["me", "Scroll number three. If this one says \"add more garlic\" I am resigning."], ["me", "Seventy-five seconds across the Cookie Sheet Plains. Note: avoid the hot parts. All parts are hot parts."]],
  "w3-s7": [["me", "Antidote progress: 68%. Missing: something sharp, sour and brave."], ["me", "That key chest above the pass might open a secret bakery. Bakeries have lemons. Lemons are sour. Science!"]],
  "w3-s8": [["foe", "Penicillin again! My spores LOVE a pizza stone. Warm, crusty... perfect lab conditions."], ["me", "Forty-five seconds, Professor. Then your lab is closed for inspection."]],
  "w3-s9": [["me", "Journal: the dragon up top is coated in grease. Grease traps spores. Gross. Useful."], ["me", "Note to self: wash colander afterwards. Twice. Maybe three times."]],
  // World 4: The Pantry
  "w4-s2": [["me", "Cereal Canyon. Cheerio Blobs split in two when hit. Like cells. I'm trying not to find that exciting."], ["me", "I'm failing. It's very exciting."]],
  "w4-s3": [["me", "Flour Ghosts. Flour is not haunted. Flour is a fine powder. I refuse to fear a fine powder."], ["n", "A Flour Ghost said boo."], ["me", "...Noted. Moving on. Quickly. That ladle had better work."]],
  "w4-s4": [["me", "Assistant number four! Welcome to the team. The team is me. And now you."], ["me", "Cookers ahead. Let the Can Crushers find them first. Science is mostly letting other things explode."]],
  "w4-s6": [[6, "Halt! The Recipe Scroll is LORDLY property. ...But I suppose a scientist may borrow it."], ["me", "Thank you, Dumplord. Peer review is surprisingly polite today. Seventy-five seconds, go!"]],
  "w4-s7": [["me", "Pasta Jar Peaks. The Noodle Lurkers burrow and bite. I'd call it al dente aggression."], ["me", "One more key, one more secret door. Journal: I am starting to enjoy the side quests."]],
  "w4-s8": [["me", "Honey is naturally antifungal! Honey Hollow could hold the final ingredient!"], ["me", "Scanner also says: one extra elite. Very large. Very cranky. Survive forty-five seconds first."]],
  "w4-s9": [["mold", "Ninety-nine percent, little chemist. So close. The last percent is waiting in the Sink."], ["me", "Then that's where the experiment ends. Journal: final entry before the jar. Me: good luck, me."]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Tentacle-ular combo!", "Repeatable results!", "All arms on deck!"],
  lowhp: ["Note: losing jelly fast!", "Experiment going sideways!", "Requesting a lab break!"],
  perfect: ["Calculated. Obviously.", "Jelly wobbles, jelly dodges!", "Predicted that. 87% sure."],
  levelup: ["New hypothesis: I'm stronger!", "Peer-reviewed power-up!", "Promoted to Senior Squid!"],
  secret: ["Eureka! A hidden chest!", "Hidden variable found!", "Undocumented treasure!"],
  boom: ["Controlled explosion! Ish.", "Rolling pin: highly effective!", "Now THAT'S a reaction!"],
  mimic: ["Specimen has teeth! Noted!", "Box: not a box. Recording.", "False positive! Very positive!"],
  objective: ["Objective complete. Logged!", "Hypothesis confirmed!", "Another one for the journal!"],
};
