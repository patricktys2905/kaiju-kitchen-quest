// Bloblin: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop. Bubbly, blank flag, cheering for everybody.
  "w1-s2": [["me", "Hi, crumbs! You're all so crumbly and great!"], ["n", "Whoa! Monsters are pouring down the Crumb Trail. LOTS of monsters!"], ["me", "Ack! So many new friends! Wait, they're biting! Hop, hop, HOP!"]],
  "w1-s3": [["me", "Ooh, gummies! Hi, cousins! Wait, why are they growling?"], ["me", "And a Rolling Pin Rogue in the boss room? Jelly plus rolling pin equals jelly PANCAKE! Eep!"]],
  "w1-s4": [[10, "Hmph. You, jelly. Walk this Crumblet to the exit. And don't let it eat you."], ["me", "Wibble wobble, little muffin! Hop on my whipped cream! You're doing great already!"]],
  "w1-s6": [["me", "There's a recipe scroll way up high! Ooh, maybe it's a dessert recipe with jelly in it!"], ["n", "Whoa! Monsters are pouring off the spice shelf!"], ["me", "Jelly Clones! Three of me! Three times the cheering! Go, us!"]],
  "w1-s7": [["me", "Ah... AH-CHOO! Whoa, I sneezed my cherry right off! Got it!"], ["me", "Key chest way up high? Bouncy sponge! BOING! Jelly was MADE for bouncing!"]],
  "w1-s8": [["me", "A cutting board, knives, and a jelly. Ooh, I don't love this math. *jiggle jiggle*"], ["me", "Hold out time! Wobble Shield, up! Bounce off me, baddies, I'm springy!"]],
  "w1-s9": [["me", "Burners ahead! Hot, hot, HOT! I'm getting runny!"], ["mold", "Hehehe... melt, little jelly. Nobody wants a runny dessert anyway."], ["me", "Who said that?! Rude! Okay, now I'm extra firm. Out of spite!"]],
  // World 2: The Fridge. Firm, happy, everybody else got invited.
  "w2-s2": [["me", "My whipped cream's cousins live here! Hi, milk! Hi, yogurt!"], ["n", "Brrr! An Ice Cube Ogre snores in the boss room, and the floor's slippery as glass!"], ["me", "Nobody invited YOU either, Mr. Ogre! Wheee, slidey jelly!"]],
  "w2-s3": [["n", "Click! The fridge light goes out!"], ["me", "Ooh, spooky! I'll glow! Do jellies glow? Nope. Okay, hop carefully!"], ["me", "A Fish Finger General's in here somewhere! Gimme an F! For FISH! Wibble wobble!"]],
  "w2-s4": [[10, "Hmph. Jelly. This Crumblet keeps poking you. Walk it to the exit anyway."], ["me", "Poke away, little muffin! I'm a jiggly bouncy castle! Wheee!"]],
  "w2-s6": [[17, "Wheee! Bloblin! Are you going to the dessert party? I'm going! Ice to meet you!"], ["me", "You got invited too? That's GREAT! Yay, Pengwhip! Okay, scroll time."]],
  "w2-s7": [["me", "Jelly on butter? I'm a wobbly little hockey puck! Wheee!"], ["me", "Bouncy sponge! BOING! The key's mine! Gimme a K! That's it, that's the whole cheer!"]],
  "w2-s8": [["foe", "Hold out, Wobbles? Darling, you can't even hold your SHAPE! Hahaha!"], ["me", "I can hold it till the monsters quit! Probably! Wobble Shield, up!"]],
  "w2-s9": [["mold", "Why leave the cold, little jelly? Stay here and set. Nobody's waiting for you anyway."], ["me", "The Chef is! Kinda! There's a FLAG! Up the steps, hup, hup!"]],
  // World 3: The Oven. Runny, sweaty, still cheering.
  "w3-s2": [["me", "Hot! Hot! Jelly's supposed to go in the FRIDGE, people!"], ["n", "FWOOSH! A steam vent blasts Bloblin clear up to the next rack!"], ["me", "Wheee! Steam makes a breeze! Breeze is good! Hop, hop, hop!"]],
  "w3-s3": [["me", "Every muffin cup looks the same. Am I lost? I'm lost! Yay, adventure!"], ["me", "Ooh, a lunchbox! Free snacks? Wait, it has TEETH! Okay, now I'm found. And running!"]],
  "w3-s4": [[10, "Hmph. Jelly. This Crumblet's made for ovens. You aren't. Walk it out quick."], ["me", "Hop on, little muffin! Don't mind the drips, I'm just sweating lime!"]],
  "w3-s6": [["me", "Cookies always get invited. Every party, every time. Sigh."], ["me", "Nope! No sighing! Grab the scroll! Gimme an S! Gimme a C! Go, me!"]],
  "w3-s7": [[15, "B-B-Bloblin! You look a little r-runny. I'll fan you with my spikes!"], ["me", "Aww, Hotchog! Spikes make a terrible fan! Thank you! Okay, sponge! BOING!"]],
  "w3-s8": [["foe", "Pizza stone, Wobbles! Even I'm sweating, and I'm GORGEOUS when I sweat!"], ["me", "Hold out time! Jelly Clones! Three wobbly walls, coming up!"]],
  "w3-s9": [["me", "The hottest rack of all! I'm turning into a smoothie. A LIME smoothie!"], ["mold", "Hehehe... little puddle. A runny jelly never gets a seat."], ["me", "*jiggle* I'm still climbing! Set for success! Mostly set!"]],
  // World 4: The Pantry. Firm again, closer to the Chef.
  "w4-s2": [["me", "Ahh, the Pantry! Cool and shady! I'm firming right up! Boing!"], ["n", "CLANG! Tin cans come tumbling off the shelves!"], ["me", "Every world's got something falling on me! Does gravity LIKE me? Run!"]],
  "w4-s3": [["me", "Flour everywhere, like snow! I'm a lime jelly snowman!"], ["n", "Uh-oh! Behind the snow pile snores a Cereal Box Colossus!"], ["me", "Shh! Okay, Honey Bees first, Colossus later! Wibble wobble, tiptoe!"]],
  "w4-s4": [["n", "SLAM! The pantry door shuts. Lights out in Tin Can Alley!"], [10, "Hmph. My Crumblet's scared of the dark. Walk it out, jelly."], ["me", "Hold my nub, little muffin! I'll cheer the whole way. Gimme a D! For DARK! Wheee!"]],
  "w4-s6": [["me", "Chili? Nope. Cinnamon? Ooh, maybe. The scroll's at the top!"], ["me", "And the Honey Pot Hermit's up there too! Gotta hurry! Gimme an H! For HURRY!"]],
  "w4-s7": [[7, "Hrrm. Young jelly. Ancient wisdom says the best seat at the table is the one you share."], ["me", "Ooh! That's so nice!"], [7, "It was about rice. Sharing rice. Hrrm. The sponge is that way."]],
  "w4-s8": [["me", "Sticky honey! I'm sticky too! Sticky buddies! Team Dessert!"], ["me", "Hold out time! Jiggle Splat! Now EVERYBODY's sticky!"]],
  "w4-s9": [["me", "The top shelf! I can smell the Chef's apron! Vanilla and lime!"], ["mold", "Drip, drip, little jelly. Hear the Sink? Your seat's going right down the drain. Hehehe!"], ["me", "No it isn't! *jiggle jiggle* Climbing anyway!"]],
  // World 5: The Sink. Bubbles, the last climb down, the seat is waiting.
  "w5-s2": [["n", "Wheee! The Suds Slide sends Bloblin skiing down, straight at a snoozing Sponge Golem!"], ["me", "A big sponge! Sponges soak up jelly! Not today, Mr. Golem! Hop, hop, HOP!"]],
  "w5-s3": [["me", "Bubbles! Soap! It's a bubble bath party!"], ["me", "A Plunger Paladin? Okay, the baddies get scrubbed! Squeaky clean, here we go!"]],
  "w5-s4": [[10, "Hmph. My last Crumblet, jelly. Get it past those dishes. Keep it dry."], ["me", "Hop in my whipped cream, little muffin! Dry, fluffy and VERY cheered for!"]],
  "w5-s6": [["me", "Pop! Pop! Ooh, sorry, scroll first. It's way up high!"], ["me", "Gotta grab it before time runs out! Gimme a B! For BUBBLES! Wheee!"]],
  "w5-s7": [["me", "Down the plughole is bad. Up is good! Bouncy sponge! BOING!"], ["me", "Got the last key! I'm holding it inside my jelly. Ooh, I can see it through me! Neat!"]],
  "w5-s8": [["foe", "Greasy pans, Wobbles! Slippery! Just like my Snooty Drip!"], ["me", "Slippery AND sticky? I'll Jiggle Splat the whole pan! Hold out, go!"]],
  "w5-s9": [["mold", "Hehehe... down, down, little jelly. No party down here. No seats. No friends."], ["me", "There's a Chef down there, and a flag to sign! Gimme a D! For DOWN! Here I come!"]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Placemats! Fancy! Do I use the little fork or the big fork?"], ["n", "SPLOSH! Gravy Boat Rammers come charging over the placemats!"], ["me", "Neither! I use my LEGS! Wait, no legs. HOP!"]],
  "w6-s3": [["me", "These candles are dripping hot wax! Wax on jelly? Ew, I'd be a jelly candle!"], ["me", "A Teapot Tyrant in the boss room? Okay, Fork Soldiers first. You're about to get wobbled!"]],
  "w6-s4": [[10, "Hmph. Jelly. This Crumblet wants to see the world. Walk it past the gravy boats."], ["me", "Gravy boats! Ahoy! Hop on, little muffin, and cheer with me! Go, us!"]],
  "w6-s6": [["me", "Pinkies up! Grab the scroll, then tea time!"], ["me", "A Candelabra Duchess dripping wax on me? No fair! Jiggle Splat! Now you're stuck!"]],
  "w6-s7": [["me", "Ooh, fancy folds! I'm a swan! A wobbly swan!"], ["me", "The key's in a chest way up there. I bet my flag's not in it, but I'll bounce up and check anyway!"]],
  "w6-s8": [["lo2", "Charge, my silverware! Spoon yon jelly into a bowl!"], ["me", "Spoons are for PARTIES, Sir Stale! Hold out! Wobble Shield, up!"]],
  "w6-s9": [["me", "That chandelier's so sparkly! It's like a disco ball! Dance break? Dance break!"], ["lo2", "Climb, wobbly knave! At the top, I shall sit upon thy flag! Hahaha!"], ["me", "Rude! Okay, dance break's over. Climbing!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "Ooh, a long green noodle! Hi, noodle!"], ["n", "BZZZ! Picnic Wasps come zooming down the hose!"], ["me", "Even the bugs in the Backyard are grumpy! Get your own picnic! RUN!"]],
  "w7-s3": [["n", "FSSSH! Sprinklers burst up all over the lawn!"], ["me", "Wheee! I'm a water balloon! Spatula Sheriff, get ready! Splash zone, baddies!"]],
  "w7-s4": [[10, "Hmph. Jelly. This Crumblet wants to swim. No swimming. Walk it to the exit."], ["me", "I float! Kinda! Hop on, little muffin. I'm a jelly pool float!"]],
  "w7-s6": [[9, "Hiya, little jelly! I'm having a birthday party! I think. Did I invite you? *POP*"], ["me", "Nope! Nobody ever does! That's okay! Happy birthday, maybe! Scroll time!"]],
  "w7-s7": [["me", "Dirt. Ew. Jelly and dirt is NOT a dessert."], ["me", "There's a chest up on that flowerpot. Still no flag in any of them! Where ARE you, flag?"]],
  "w7-s8": [[18, "In THIS corner, the jiggliest cheerleader in the yard! Ding ding!"], ["me", "Velvaroo! You announced ME! Nobody announces me! Hold out time, let's GO!"]],
  "w7-s9": [["me", "Hot and smoky! My whipped cream is turning into soup!"], ["n", "From the grill above, a voice booms: \"ATTEN-TION! Sprouts, guard that little flag!\""], ["me", "He's got it! Gimme a G! For GRILL! Wait, no, for GO!"]],
  // World 8: The Garden.
  "w8-s2": [["me", "Ooh, a shower from the watering can! Fresh and lime-y!"], ["n", "SNAP! A Snapdragon in the boss room snaps at the air!"], ["me", "A flower that bites? Aww, you just need a friend! A FAR away friend! RUN!"]],
  "w8-s3": [["me", "Sunflowers! So tall! So cheery! Ah... AH-CHOO! Pollen!"], ["me", "Now I'm a jelly with sprinkles, and there's a Watering Can Wizard! Bless you, baddies!"]],
  "w8-s4": [[10, "Hmph. Jelly. This Crumblet wants to see a pumpkin. A SMALL one. Walk it to the exit."], ["me", "Pumpkins! Big ones! Little ones! You're doing great, little muffin!"]],
  "w8-s6": [[12, "Heyyy, duuude... *yaaawn* Were you at my nap party? Oh wait, I forgot to send invites."], ["me", "Ha! Of course! That's okay, Sloba! The scroll's at the top. Up we go!"]],
  "w8-s7": [["me", "All the forgotten scraps end up here. Aww, poor scraps."], ["me", "I'll grab the key from up there. Hang in there, scraps! I'm cheering for you!"]],
  "w8-s8": [["lo2", "Hold out, wobbly knave! The scarecrow shall scare thee silly!"], ["me", "Scarecrows are just lonely guys in hats! Hold out time! Go, Scarecrow! Wait."]],
  "w8-s9": [["n", "From the greenhouse, a voice rambles: \"Is that a pea in me? Is that a FLAG in me? Ooh, pointy!\""], ["me", "My flag! He's got my flag! The greenhouse is hot, but I'm climbing! Set for success!"]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "I used to watch these trolleys from my shelf! Vroom!"], ["n", "RATTLE! Trolley Rammers come bowling down the track!"], ["me", "Clean-up on aisle EVERYWHERE! Run, run!"]],
  "w9-s3": [["me", "Cereal always gets picked. Every single breakfast. Lucky!"], ["me", "Ooh, a Cash Register Golem! Let's bag these baddies! Two for one! Wibble wobble!"]],
  "w9-s4": [[10, "Hmph. Jelly. Walk this Crumblet past the bananas. They cartwheel. Don't ask."], ["me", "Cartwheeling bananas? Ooh, they're good! Hop on, little muffin. We'll cheer from over here!"]],
  "w9-s6": [[14, "Let's GOOO! Bloblin! Hey, neighbour! Race you up the bakery! The HARD way!"], ["me", "Salmonster! Hi from aisle nine! Scroll first, then I'll cheer you up the hard way!"]],
  "w9-s7": [["me", "A Mop Bucket Mage? Everybody gets magic but me!"], ["me", "Bouncy sponge! BOING! The key's mine! Still no flag. Best before SOON, please!"]],
  "w9-s8": [["lo2", "Hold out, wobbly knave! Thou art EXPIRED! Clean-up on aisle nine!"], ["me", "I'm jelly, Sir Stale! Jelly's got a LONG shelf life! Hold out? Check it out!"]],
  "w9-s9": [["me", "The Frozen Aisle! Brrr! Jelly's best friend! I'm SO firm right now!"], ["n", "From the Back Aisle, a voice moans: \"Woooo! Nobody opens me! Nobody remembers me! Woooo!\""], ["me", "Aww. I know that feeling. But I still want my flag back! Climbing!"]],
  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Jam is jelly's cousin! Hi, cousins! Love the lids!"], ["n", "GLORP! A pot of Forgotten Soup bubbles away in the boss room!"], ["me", "Forgotten Soup? Aww! You're invited too! Just don't splash me! Wibble wobble!"]],
  "w10-s3": [["me", "Old noodle boxes nobody came back for. Aww. Hi, noodles!"], ["me", "A Banquet Butler! Gimme a T! For TAKEAWAY! Takeaway THIS!"]],
  "w10-s4": [[10, "Hmph. Jelly. This is my LAST Crumblet. The very last one. Walk it out of the cold."], ["me", "The last one?! Hop in my whipped cream, little muffin! I'll cheer the WHOLE way!"], [10, "And, uh, save us a seat at that party. Both of us."]],
  "w10-s6": [["me", "Party chains! I'm fixing them as I go! Ta-daa! Ooh, scroll first."], [15, "B-B-Bloblin! I'll hold the line! I-I'm not even scared! Okay, a l-little scared!"], ["me", "Go, Hotchog! We grab it before time runs out! Wibble wobble!"]],
  "w10-s7": [["me", "Jars with no labels. Nobody even knows their names!"], ["me", "*scribble scribble* There! Now you're Jam Jar Jeff! Okay, one last bounce for one last key! BOING!"]],
  "w10-s8": [["lo2", "Hold out, wobbly knave! The WHOLE army cometh! Thou art doomed!"], ["me", "Sir Stale! Want a name flag? I've got spares! Okay, after! Wobble Shield, up!"]],
  "w10-s9": [["me", "This table is SO long. And SO empty. There's not one plate, and not one flag."], ["n", "From the cake-tin throne, a grumpy voice booms: \"NOBODY sits at my table! Nobody EVER came!\""], ["me", "Nobody ever came? Aww. Hang on, Mr. Fruitcake! Somebody's coming! Wibbling up!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Wibble wobble WALLOP!", "Gimme a C! Gimme a COMBO!", "Jiggle, jiggle, SPLAT!"],
  lowhp: ["Uh-oh! I'm getting runny!", "*jiggle jiggle* Not good!", "I need a fridge! Quick!"],
  perfect: ["Wobbled right outta the way!", "Missed me! Too jiggly!", "Bendy jelly, baby!"],
  levelup: ["Set for success! Level up!", "Extra wobble unlocked!", "Bigger cherry! Yay me!"],
  secret: ["Ooh, a secret! I invited myself!", "A hidden treat! For ME?!", "Found it! Wibble wobble!"],
  boom: ["KA-BLAM! Go, boom! Yay, boom!", "Boom! I jiggled all over!", "Gimme a B! Gimme a BOOM!"],
  mimic: ["Eep! That box BIT me!", "Rude box! Very rude!", "A box with teeth? *jiggle*"],
  objective: ["Done! Gimme a W! For WIN!", "Job done! Wibble wobble!", "We did it! Go, team!"],
};
