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
  // World 5: The Sink.
  "w5-s2": [["me", "Suds Slide! Note to self: soap plus jelly equals ZOOM! Wheee!"], ["me", "Wait, why is a giant rolling pin following me?! New hypothesis: RUN RIGHT! Very, VERY right!"]],
  "w5-s3": [["me", "Sponge Shoals! Sponges soak up eight hundred times their weight! I made that number up. Fascinating!"], ["me", "Gates locked, three waves! Lever, rolling pin, SPLAT! The classic experiment, now with bubbles!"]],
  "w5-s4": [[10, "Hmph. Jelly. Walk my Crumblet over Dish Rack Ridge. Gently. Those plates are slippy."], ["me", "Assistant number five! Rules one to three still apply! Rule four: no sliding on the plates! ...Okay, ONE slide."]],
  "w5-s6": [["me", "Bubble Bay! The last Recipe Scroll! Please say \"soap\". PLEASE don't say garlic!"], ["me", "Conveyor belts AND seventy-five seconds? Science on a treadmill! Go, go, GO!"]],
  "w5-s7": [["me", "Plughole Pass! Note to self: do NOT go down the drain. Underline that. Twice!"], ["me", "Secret chest on a high ledge! Bouncy sponge, launch the squid! EUREKA, I'm airborne!"]],
  "w5-s8": [["foe", "Psst, colleague! Grease monsters HATE soap. That's free data. Don't tell anyone I helped!"], ["me", "Professor Penicillin, sharing data?! Peer review WORKS! Forty-five seconds, let's scrub up!"]],
  "w5-s9": [["mold", "Hehehe... closer, little chemist. Bring your bottle down the drain. I want to taste your last one percent."], ["me", "My tentacles are tingling! That's either science or fear. Final note before the drain: it's SCIENCE!"]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Placemat Plains! Placemats keep tables clean. This one's keeping a giant rolling pin warm!"], ["me", "New hypothesis, same as the old hypothesis: RUN RIGHT! Very, VERY right!"]],
  "w6-s3": [["me", "Candelabra Crossing! Hot wax drips everywhere. Jelly plus wax equals one sticky squid!"], ["me", "Gates locked? Lever, rolling pin, SPLAT! My favourite experiment, now served on fine china!"]],
  "w6-s4": [[10, "Hmph. Jelly. This Crumblet wants to see the world. Start it on Gravy Boat Bay. Bring it back in one piece."], ["me", "Assistant number six! Rules one to four still apply! Rule five: no swimming in the gravy!"]],
  "w6-s6": [["me", "Teacup Terrace! A Recipe Scroll, and Teapot Nannies healing everything I bonk! Unfair!"], ["lo2", "Hah! Thou shalt never hold yon scroll, jelly! Thou art far too WOBBLY!"], ["me", "Wobbly is a perfectly good state of matter! Grab it and hold on, GO!"]],
  "w6-s7": [["me", "Napkin Fold Fort! Napkins folded into swans, towers and one very rude goose!"], ["me", "Secret chest on a high ledge! Bouncy sponge, launch the squid! Science is mostly bouncing now!"]],
  "w6-s8": [["me", "Silverware Siege! The Fork Soldiers brought the whole cutlery drawer!"], ["me", "Forty-five seconds! Survive now, write notes later. Gravy-stained notes. Fascinating!"]],
  "w6-s9": [["lo2", "Hark, jelly! Thou climbest my chandelier? Up here we serve only VINTAGE guests!"], ["me", "Vintage? My spore-o-meter says STALE! Readings don't lie, Sir Crusty!"]],
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
