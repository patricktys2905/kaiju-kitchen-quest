// Squidgeon: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Lab notes, entry two! This trail contains... CRUMBS! Fascinating! Write that down, me!"], ["me", "Ooh, and there's a sponge by that high ledge. How bouncy is it? Only one way to find out!"]],
  "w1-s3": [["me", "Whoa-ho! My spore-o-meter's going bonkers! There's one HUGE specimen up ahead!"], ["me", "And a ladle lever! I've got a hunch it drops that rolling pin. SPLAT goes the problem!"]],
  "w1-s4": [["n", "A tiny Crumblet tugs on Squidgeon's tentacle."], ["me", "A lab assistant! Rule one: stay behind the scientist. Rule two: don't lick the samples!"], ["me", "Rule three, in BIG letters: rattly pressure cookers are for monsters only! KA-BLOOEY!"]],
  "w1-s6": [["me", "A Recipe Scroll! Old cookbooks might list anti-fungus-ical spices! Gimme gimme!"], ["me", "Whoa, the spore count's off the charts! Seventy-five seconds! Science waits for no squid!"]],
  "w1-s7": [["me", "This place is forty percent pepper and sixty percent AH-CHOO!"], ["me", "My tentacles are tingling! There's a key chest on a ledge up there, and I'm fetching it!"]],
  "w1-s8": [["foe", "Professor Penicillin here! I've sent some test subjects your way, colleague. Do take notes! Mwahaha!"], ["me", "Forty-five seconds of specimens? Oh, I'll take notes. With my tentacles. VERY HARD."]],
  "w1-s9": [["me", "Antidote progress: twelve percent! It's mostly toast crumbs and stubbornness so far."], [0, "Rawr! Is that a colander on your head? Big brother says scientists are cool!"], ["me", "Your big brother is correct! That's been peer-reviewed!"]],
  // World 2: The Fridge
  "w2-s2": [["me", "Milk, yogurt, cheese... for mould, this street's an all-you-can-eat buffet!"], ["me", "The Yogurt Slimes keep telling me they're \"cultured\". I've talked to them. They are NOT."]],
  "w2-s3": [["me", "Brrr! Jelly sets in the cold. If I stop wiggling, I'll turn into dessert!"], ["me", "Gates are locked, but I spy a lever and a rolling pin. My favourite experiment! Let's run it again!"]],
  "w2-s4": [["n", "Uh-oh! A Crumblet bobs on a pickle lid, and the pier is crawling with monsters!"], ["me", "Assistant! You're back! Oh wait, you're a new one. Hi! Rules one to three still apply!"], ["me", "Monster density: YIKES. Recommended method: pressure cookers. LOTS of pressure cookers."]],
  "w2-s6": [["me", "Another Recipe Scroll! The last one said \"add garlic\". The Garlic Clerics did NOT agree!"], ["me", "Seventy-five seconds to the far end of these egg cartons! Eggs, please don't crack under pressure!"]],
  "w2-s7": [["me", "Hey, who turned off the fridge light? Whoa-whoa-WHOA! This butter's slippery!"], ["me", "Dark, slippy, and a secret key up top? That's way too many variables. I LOVE it!"]],
  "w2-s8": [["me", "Antidote progress: forty-one percent! And for the record, ketchup is NOT an ingredient. I checked twice."], ["me", "Forty-five seconds of waves! Brace yourselves, tentacles! You too, colander!"]],
  "w2-s9": [["mold", "Hehehe... your little cure tickles, jelly. My Crown grew a thousand spores since you started."], ["me", "A thousand? Pfft! Then I need a thousand and ONE samples! Good thing I packed extra jars!"]],
  // World 3: The Oven
  "w3-s2": [["me", "Heat should cook mould! But these spores are wearing teeny oven mitts! That's CHEATING!"], ["me", "Note to self: do jellies sweat? Down here, yes! Somebody update the textbooks!"]],
  "w3-s3": [["me", "Twelve muffin cups, one exit, and a Cereal Box Mimic pretending to be breakfast!"], ["me", "Theory: if I pull that ladle, a rolling pin solves the maze for me. Testing, testing!"]],
  "w3-s4": [[10, "Hmph. Jelly. That Crumblet's one of mine. You keep it safe, or you answer to me."], ["me", "Y-yes, Mr. Bluebeary, sir! Assistant, stay close! Rule three: cookers are NOT toys!"]],
  "w3-s6": [["me", "Scroll number three! If this one says \"add more garlic\", I quit! I'm quitting!"], ["me", "Seventy-five seconds across a giant cookie sheet! I'll just avoid the hot parts. Oh no. It's ALL hot parts!"]],
  "w3-s7": [["me", "Antidote progress: sixty-eight percent! I'm still missing something sour. Sour and BRAVE."], ["me", "Ooh, that key chest might open a secret bakery! Bakeries have lemons! Lemons are sour! EUREKA!"]],
  "w3-s8": [["foe", "Penicillin again! My spores LOVE a pizza stone! Warm, crusty... perfect lab conditions!"], ["me", "Forty-five seconds, Professor! Then your lab's closed for inspection!"]],
  "w3-s9": [["me", "Note to self: the dragon up top is coated in grease, and grease traps spores. Gross! Also useful!"], ["me", "Second note to self: wash the colander afterwards. Twice. Make it three times."]],
  // World 4: The Pantry
  "w4-s2": [["me", "The Cheerio Blobs split in two when you bonk 'em, just like cells! I must stay calm!"], ["me", "Nope! Can't do it! FASCINATING!"]],
  "w4-s3": [["me", "Flour Ghosts? Pfft! Flour isn't haunted, it's a fine powder! I refuse to fear a powder!"], ["me", "...Did that flour just say BOO? EEP! Moving on! That ladle better work!"]],
  "w4-s4": [["me", "Assistant number four! Welcome to the team! The team is me. And now you! Yay, team!"], ["me", "Cookers ahead! Let the Can Crushers find 'em first. Science is mostly letting stuff explode."]],
  "w4-s6": [[6, "Halt! The Recipe Scroll is ROYAL property! Hmm. We suppose a scientist may borrow it."], ["me", "Thanks, Dumplord! Peer review is so polite today! Seventy-five seconds, GO!"]],
  "w4-s7": [["me", "These Noodle Lurkers burrow and bite! I'm calling it al dente aggression!"], ["me", "One more key, one more secret door! Note to self: side quests are FUN!"]],
  "w4-s8": [["me", "EUREKA! Honey fights fungus! The final ingredient might be right here in this honey!"], ["me", "Uh-oh, my scanner says there's one big, cranky elite. I'll need to survive forty-five seconds first!"]],
  "w4-s9": [["mold", "Hehehe... ninety-nine percent, little chemist. So close! The last percent is waiting in the Sink."], ["me", "Then that's where the experiment ends! Final note before the jar: good luck, me! You got this!"]],
  // World 5: The Sink.
  "w5-s2": [["me", "Note to self: soap plus jelly equals ZOOM! Wheee!"], ["me", "Wait, why is a giant rolling pin following me?! New hypothesis: RUN! Very, VERY fast!"]],
  "w5-s3": [["me", "Did you know sponges soak up eight hundred times their weight? I made that number up. Fascinating!"], ["me", "The gates locked behind me, and here come three waves! Time to scrub up, tentacles!"]],
  "w5-s4": [[10, "Hmph. Jelly. Walk my Crumblet over Dish Rack Ridge. Gently. Those plates are slippy."], ["me", "Assistant number five! New rule: no sliding on the plates! Okay, ONE slide."]],
  "w5-s6": [["me", "The last Recipe Scroll! Please say \"soap\". PLEASE don't say garlic!"], ["me", "Conveyor belts AND a seventy-five second timer? It's science on a treadmill! Go, go, GO!"]],
  "w5-s7": [["me", "Note to self: do NOT go down the plughole. Underline that. Twice!"], ["me", "There's a secret chest up on that ledge, and a sponge right below it. Launching the squid!"]],
  "w5-s8": [["foe", "Psst, colleague! Grease monsters HATE soap. That's free data. Don't tell anyone I helped!"], ["me", "Professor Penicillin, sharing data?! Peer review WORKS! Forty-five seconds, let's scrub up!"]],
  "w5-s9": [["mold", "Hehehe... closer, little chemist. Bring your bottle down the drain. I want to taste your last one percent."], ["me", "My tentacles are tingling! That's either science or fear. Final note before the drain: it's SCIENCE!"]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Placemats are supposed to keep tables clean, not hide giant rolling pins!"], ["n", "Uh-oh! The rolling pin comes thundering off the placemat, straight at Squidgeon!"], ["me", "Calculating escape velocity! Answer: FASTER! Wiggle, wiggle, wiggle!"]],
  "w6-s3": [["me", "Hot wax dripping everywhere? Jelly plus wax equals one very sticky squid!"], ["me", "The gates are locked, so it's monster time. Note to self: keep the tentacles away from the candles!"]],
  "w6-s4": [[10, "Hmph. Jelly. This Crumblet wants to see the world. Start it on Gravy Boat Bay. Bring it back in one piece."], ["me", "Assistant number six! Brand new rule just for you: no swimming in the gravy!"]],
  "w6-s6": [["me", "A Recipe Scroll, and Teapot Nannies healing everything I bonk? That's not fair science!"], ["lo2", "Hah! Thou shalt never hold yon scroll, jelly! Thou art far too WOBBLY!"], ["me", "Wobbly is a perfectly good state of matter! Grab it and hold on, GO!"]],
  "w6-s7": [["me", "These napkins are folded into swans, towers and one very rude goose!"], ["me", "Treasure on the highest ledge again! Hypothesis: whoever hides these chests is VERY tall."]],
  "w6-s8": [["me", "The Fork Soldiers brought the whole cutlery drawer!"], ["me", "Forty-five seconds! Survive now, write notes later. Gravy-stained notes. Fascinating!"]],
  "w6-s9": [["lo2", "Hark, jelly! Thou climbest my chandelier? Up here we serve only VINTAGE guests!"], ["me", "Vintage? My spore-o-meter says STALE! Readings don't lie, Sir Crusty!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "A giant garden hose, perfect for jelly sliding! Wheee!"], ["n", "Uh-oh! A rolling pin comes bouncing down the hose, and it's picking up speed!"], ["me", "You followed me OUTSIDE?! That's not a coincidence, that's a pattern! RUN!"]],
  "w7-s3": [["me", "FWOOSH! Note to self: jelly plus sprinkler equals one VERY bouncy squid!"], ["me", "Gates locked again! Fine, I'll run the monster experiment. On fresh-cut lawn, this time!"]],
  "w7-s4": [[10, "Hmph. Jelly. My Crumblet wants a swim. Walk it round the Paddling Pool Pier. NO deep end."], ["me", "Assistant number seven! The pool rules are simple: armbands at ALL times!"]],
  "w7-s6": [["me", "There's a Recipe Scroll by the potato salad! Please say antidote. Please DON'T say garlic!"], ["lo2", "Hah! Baron Brussels shall grill thee, jelly! Thou art but a wobbly side dish!"], ["me", "Side dish? I'm the MAIN experiment! Grab it and hold on, GO!"]],
  "w7-s7": [["me", "Soil samples EVERYWHERE! Ooh, a worm! Hi, worm! Fascinating!"], ["me", "Okay, focus. That chest up on the flowerpot won't open itself. Up I go!"]],
  "w7-s8": [[9, "Hello, little squid! Have you seen my birthday party? *POP* Elephants never forget, but I forgot where I left it."], ["me", "A lost party? Fascinating! I'll help you find it right after forty-five seconds of monsters!"]],
  "w7-s9": [["n", "From the smoky Grill Summit, a voice booms: \"ATTEN-TION! No jellies past this point!\""], ["me", "My spore-o-meter says ninety percent sprout and ten percent STINK! Pee-yew! Up the coals we go!"]],
  // World 8: The Garden.
  "w8-s2": [["me", "Note to self: jelly plus watering can equals one EXTRA wobbly squid!"], ["n", "Uh-oh! A rolling pin comes tumbling between the veggie rows!"], ["me", "In a GARDEN?! I'm writing a strongly worded letter! After I run! RUN!"]],
  "w8-s3": [["me", "Giant flowers puffing pollen! Fascinating! Ah... ah... AH-CHOO!"], ["me", "The gates locked while I was sneezing. Rude! Okay, monsters, prepare to be studied!"]],
  "w8-s4": [[10, "Hmph. Jelly. My Crumblet wants to see where veggies come from. Walk it through the Pumpkin Patch."], ["me", "Assistant number eight! Here's today's lesson: we do NOT lick the pumpkins!"]],
  "w8-s6": [["me", "The Recipe Scroll's up a bean pole! Please say antidote. Please DON'T say garlic!"], ["lo2", "Hah! Thou shalt never climb so high, jelly! Thou art a wobbly salad dressing!"], ["me", "Beans are climbers, and so is SCIENCE! Grab it and hold on, GO!"]],
  "w8-s7": [["me", "Rotting peels, worm tunnels, and a WHIFF of science! My tentacles are tingling!"], ["me", "There's a chest up on that ledge. I've bounced off so many sponges, I should write a paper on it!"]],
  "w8-s8": [[12, "Heyyy, duuude. *yaaawn* Nice helmet. Is it for straining boba?"], ["me", "It's for SCIENCE! Can you help me hold this spot for forty-five seconds? Sloba? Hellooo?"], [12, "Zzz... I'm steeped in it, dude. Zzz..."]],
  "w8-s9": [["n", "From the old Greenhouse, a voice mumbles: \"Who's out there? Want seconds? Nobody EVER wants seconds!\""], ["me", "Seconds? I want a SAMPLE! My spore-o-meter says ninety percent mystery! Up the steps we go!"]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "Note to self: shopping trolley plus jelly equals one very FAST squid! Wheee!"], ["n", "Uh-oh! A rolling pin comes rumbling down the aisle, knocking over a pyramid of cans!"], ["me", "It's following me through every world! I'm starting to think it LIKES me! RUN!"]],
  "w9-s3": [["me", "Every box says \"part of a balanced breakfast\". I tested that. Results: CRUNCHY!"], ["me", "And now the gates are locked. Monsters, you're on special offer! Two bonks for the price of one!"]],
  "w9-s4": [[10, "Hmph. Jelly. My Crumblet got lost by the bananas. Walk it out of Fruit and Veg. No squeezing the peaches."], ["me", "Assistant number nine! No riding the trolleys! Okay, ONE ride."]],
  "w9-s6": [["me", "A Recipe Scroll on the bread shelf! Please say antidote. Please DON'T say garlic bread!"], ["lo2", "Hah! Unhand yon scroll, jelly! This bakery is VINTAGE, like me!"], ["me", "Vintage? Your best-before date says LAST TUESDAY! Grab it and hold on, GO!"]],
  "w9-s7": [["me", "Tins are teeny time capsules! Fascinating! Also dented. VERY dented."], ["me", "Treasure on the top shelf? Clean-up on aisle EUREKA!"]],
  "w9-s8": [[3, "Wibble wobble! Ooh, another jelly! Are you invited to the dessert table? I never am!"], ["me", "I'm a jelly SCIENTIST! Help me hold this checkout for forty-five seconds and I'll write you an invite!"], [3, "Eeee! I'm set for success! That's the jiggle of it!"]],
  "w9-s9": [["n", "From the frosty Frozen Aisle, a voice wails: \"Woooo! Who goes there? Don't you DARE throw me out!\""], ["me", "My spore-o-meter says ninety percent leftovers and ten percent spooky! Brrr! Into the cold we go!"]],
  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Note to self: jam plus jelly equals one VERY sticky squid!"], ["n", "Uh-oh! The rolling pin is back for one last chase, rumbling between the jam jars!"], ["me", "Final data point! Rolling pins are faster in the cold! Wait, no, it's just ME being slow! RUN!"]],
  "w10-s3": [["me", "Old noodle boxes stacked like skyscrapers! Best-before date: the Stone Age!"], ["me", "Gates locked one last time! Okay, monsters, this is my final experiment. Make it count!"]],
  "w10-s4": [[10, "Hmph. Jelly. This is the last Crumblet. The very LAST one. Walk it down Frost Drawer Falls."], ["me", "Assistant number ten! And here's the best rule yet: you're invited to the feast!"], [10, "Hmph. Fine. It sits next to ME."]],
  "w10-s6": [["me", "The very last Recipe Scroll! Please say antidote. Please, PLEASE don't say garlic!"], ["lo2", "Hmph! I am beaten, jelly. Take yon scroll. 'Tis a fruitcake recipe. Nobody ever readeth it."], ["me", "A fruitcake recipe?! Fascinating! Grab it and hold on, GO!"]],
  "w10-s7": [["me", "Dusty jars labelled \"Do Not Open\" and \"Gravy? Maybe?\" Fascinating!"], ["me", "One last secret chest! Colander, hold on tight. EUREKA, I'm airborne one final time!"]],
  "w10-s8": [[4, "Ooooh, shiny... is that the moon? Oh, it's the fridge light. Hi, little squid!"], ["me", "Mothball! Help me survive forty-five more seconds? Then we feast under the fridge light!"], [4, "Ooooh, a moonlit feast! I'm in!"]],
  "w10-s9": [["lo", "Heh heh. Come to the long table, little jelly. My feast is EMPTY, just how I like it."], ["me", "My spore-o-meter says one hundred percent fruitcake! Final lab, final sample! Colander helmet: ON!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Tentacle-ular combo!", "Results: repeatable! Hah!", "All arms on deck!"],
  lowhp: ["Note to self: I'm losing jelly!", "This experiment's going sideways!", "Requesting a lab break! Please!"],
  perfect: ["Calculated! Obviously!", "Wibble, wobble, DODGE!", "Predicted that! Eighty-seven percent sure!"],
  levelup: ["New hypothesis: I'm STRONGER!", "Peer-reviewed power-up!", "Promoted to Senior Squid!"],
  secret: ["EUREKA! A hidden chest!", "Hidden variable found!", "Ooh! Undocumented treasure!"],
  boom: ["Controlled explosion! Ish!", "Rolling pin: super effective!", "Now THAT'S a reaction!"],
  mimic: ["The specimen has teeth! Noted!", "That box isn't a box! Fascinating!", "False positive! VERY positive!"],
  objective: ["Objective complete! Logged it!", "Hypothesis confirmed! Hah!", "Another one for the notes!"],
};
