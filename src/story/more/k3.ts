// Bloblin: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop. Bubbly, blank flag, cheering for everybody.
  "w1-s2": [["me", "Crumb Trail! Hi, crumbs! You're all so crumbly and great!"], ["n", "RUMBLE! A giant rolling pin is rolling right at Bloblin!"], ["me", "Ack! Jelly plus rolling pin equals jelly PANCAKE! Hop, hop, HOP!"]],
  "w1-s3": [["me", "Gummy Gully! Ooh, gummies! Hi, cousins! Wait, why are they growling?"], ["me", "Gates locked! Pull the ladle, drop the pin. BONK! Sorry, cousins!"]],
  "w1-s4": [[10, "Hmph. You, jelly. Walk this Crumblet to the exit. And don't let it eat you."], ["me", "Wibble wobble, little muffin! Hop on my whipped cream! Gimme an M! You're doing great!"]],
  "w1-s6": [["me", "Recipe scroll at the end of the shelf! Ooh, maybe it's a dessert recipe with jelly in it!"], ["n", "Whoa! Monsters are pouring off the spice shelf!"], ["me", "Jelly Clones! Three of me! Three times the cheering! Go, us!"]],
  "w1-s7": [["me", "Pepper Pass. Ah... AH-CHOO! Whoa, I sneezed my cherry off! Got it!"], ["me", "Key chest way up high! Bouncy sponge! BOING! Jelly was MADE for bouncing!"]],
  "w1-s8": [["me", "Cutting board. Knives. Jelly. Ooh, I don't love this math. *jiggle jiggle*"], ["me", "Forty-five seconds! Wobble Shield, up! Bounce off me, baddies, I'm springy!"]],
  "w1-s9": [["me", "Burners ahead! Hot, hot, HOT! I'm getting runny!"], ["mold", "Hehehe... melt, little jelly. Nobody wants a runny dessert anyway."], ["me", "Who said that?! Rude! Okay, now I'm extra firm. Out of spite!"]],
  // World 2: The Fridge. Firm, happy, everybody else got invited.
  "w2-s2": [["me", "Dairy Lane! My whipped cream's cousins live here! Hi, milk! Hi, yogurt!"], ["n", "RUMBLE! The rolling pin is back, sliding extra fast on the cold shelf!"], ["me", "Nobody invited YOU either! Run, run, run!"]],
  "w2-s3": [["n", "Click! The fridge light goes out!"], ["me", "Ooh, spooky! I'll glow! Do jellies glow? Nope. Okay, ladle!"], ["me", "Ladle down, pin drops, baddies go flat. Wibble wobble!"]],
  "w2-s4": [[10, "Hmph. Jelly. This Crumblet keeps poking you. Walk it to the exit anyway."], ["me", "Poke away, little muffin! I'm a jiggly bouncy castle! Wheee!"]],
  "w2-s6": [[17, "Wheee! Bloblin! Are you going to the dessert party? I'm going! Ice to meet you!"], ["me", "You got invited too? That's GREAT! Yay, Pengwhip! Okay, scroll time."]],
  "w2-s7": [["me", "Butter Bridge! Jelly on butter? I'm a wobbly little hockey puck! Wheee!"], ["me", "Bouncy sponge! BOING! Key's mine! Gimme a K! That's it, that's the whole cheer!"]],
  "w2-s8": [["foe", "Hold out, Wobbles? Darling, you can't even hold your SHAPE! Hahaha!"], ["me", "I can hold it for forty-five seconds! Probably! Wobble Shield, up!"]],
  "w2-s9": [["mold", "Why leave the cold, little jelly? Stay here and set. Nobody's waiting for you anyway..."], ["me", "The Chef is! Kinda! There's a FLAG! Up the steps, hup, hup!"]],
  // World 3: The Oven. Runny, sweaty, still cheering.
  "w3-s2": [["me", "Bottom Rack. Hot. Jelly is supposed to go in the FRIDGE, people!"], ["n", "RUMBLE! A rolling pin, hot off the rack, rolls after Bloblin!"], ["me", "Running makes a breeze! Breeze is good! Hop, hop, hop!"]],
  "w3-s3": [["me", "Muffin Tin Maze! Every cup looks the same. Am I lost? I'm lost! Yay, adventure!"], ["me", "Ladle down! Rolling pin goes BONK! Okay, now I'm found."]],
  "w3-s4": [[10, "Hmph. Jelly. This Crumblet's made for ovens. You aren't. Walk it out quick."], ["me", "Hop on, little muffin! Don't mind the drips, I'm just sweating lime!"]],
  "w3-s6": [["me", "Cookie Sheet Plains. Cookies always get invited. Every party, every time. Sigh."], ["me", "Nope! No sighing! Grab the scroll! Gimme an S! Gimme a C! Go, me!"]],
  "w3-s7": [[15, "B-B-Bloblin! You look a little r-runny. I'll fan you with my spikes!"], ["me", "Aww, Hotchog! Spikes make a terrible fan! Thank you! Okay, sponge! BOING!"]],
  "w3-s8": [["foe", "Pizza stone, Wobbles! Even I'm sweating, and I'm GORGEOUS when I sweat!"], ["me", "Forty-five seconds! Jelly Clones! Three wobbly walls, coming up!"]],
  "w3-s9": [["me", "Top Rack. Hottest rack! I'm turning into a smoothie. A LIME smoothie!"], ["mold", "Hehehe... little puddle. A runny jelly never gets a seat."], ["me", "*jiggle* I'm still climbing! Set for success! Mostly set!"]],
  // World 4: The Pantry. Firm again, closer to the Chef.
  "w4-s2": [["me", "Ahh, the Pantry! Cool and shady! I'm firming right up! Boing!"], ["n", "RUMBLE! A rolling pin bounces off the cereal boxes!"], ["me", "Every world! Does it LIKE me? Nobody likes me this much! Run!"]],
  "w4-s3": [["me", "Flour everywhere, like snow! I'm a lime jelly snowman!"], ["n", "Uh-oh! That snow pile is a Flour Ghost!"], ["me", "Boo yourself! Ladle down, pin drops, SPLAT!"]],
  "w4-s4": [["n", "SLAM! The pantry door shuts. Lights out in Tin Can Alley!"], [10, "Hmph. My Crumblet's scared of the dark. Walk it out, jelly."], ["me", "Hold my nub, little muffin! I'll cheer the whole way. Gimme a D! For DARK! Wheee!"]],
  "w4-s6": [["me", "Spice Rack Ridge! Chili? Nope. Cinnamon? Ooh, maybe. Scroll's at the top!"], ["me", "Lure the baddies to the hissy pot! KA-BLAM! Gimme a B! For BOOM!"]],
  "w4-s7": [[7, "Hrrm. Young jelly. Ancient wisdom says the best seat at the table is the one you share."], ["me", "Ooh! That's so nice!"], [7, "It was about rice. Sharing rice. Hrrm. The sponge is that way."]],
  "w4-s8": [["me", "Honey Hollow! Sticky! I'm sticky too! Sticky buddies! Team Dessert!"], ["me", "Forty-five seconds! Jiggle Splat! Now EVERYBODY's sticky!"]],
  "w4-s9": [["me", "Top shelf! I can smell the Chef's apron! Vanilla and lime!"], ["mold", "Drip, drip, little jelly. Hear the Sink? Your seat's going right down the drain. Hehehe!"], ["me", "No it isn't! *jiggle jiggle* Climbing anyway!"]],
  // World 5: The Sink. Bubbles, the last climb down, the seat is waiting.
  "w5-s2": [["n", "RUMBLE! A giant rolling pin comes skiing down the Suds Slide!"], ["me", "Last time, rolling pin! I'm not even mad! Okay, a little mad! RUN!"]],
  "w5-s3": [["me", "Sponge Shoals! Bubbles! Soap! It's a bubble bath party!"], ["me", "Lever down, pin drops, baddies get scrubbed! Squeaky clean! Wibble wobble!"]],
  "w5-s4": [[10, "Hmph. My last Crumblet, jelly. Get it past those dishes. Keep it dry."], ["me", "Hop in my whipped cream, little muffin! Dry, fluffy and VERY cheered for!"]],
  "w5-s6": [["me", "Bubble Bay! Pop! Pop! Ooh, sorry, scroll first. Seventy-five seconds!"], ["me", "Conveyor belts! A free ride! Gimme a W! Gimme an H! Wheee!"]],
  "w5-s7": [["me", "Plughole Pass. Down is bad. Up is good! Bouncy sponge! BOING!"], ["me", "Last key! I'm holding it inside my jelly. Ooh, I can see it through me! Neat!"]],
  "w5-s8": [["foe", "Greasy pans, Wobbles! Slippery! Just like my Snooty Drip!"], ["me", "Slippery AND sticky? I'll Jiggle Splat the whole pan! Forty-five seconds, go!"]],
  "w5-s9": [["mold", "Hehehe... down, down, little jelly. No party down here. No seats. No friends."], ["me", "There's a Chef down there, and a flag to sign! Gimme a D! For DOWN! Here I come!"]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Placemat Plains! Fancy! Do I use the little fork or the big fork?"], ["n", "RUMBLE! A giant rolling pin flops over the placemats!"], ["me", "Neither! I use my LEGS! Wait, no legs. HOP!"]],
  "w6-s3": [["me", "Candelabras dripping hot wax! Wax on jelly? Ew, I'd be a jelly candle!"], ["me", "Lever down, pin drops, Fork Soldiers go flat! Wibble wobble!"]],
  "w6-s4": [[10, "Hmph. Jelly. This Crumblet wants to see the world. Walk it past the gravy boats."], ["me", "Gravy boats! Ahoy! Hop on, little muffin, and cheer with me! Go, us!"]],
  "w6-s6": [["me", "Teacup Terrace! Pinkies up! Grab the scroll, then tea time!"], ["me", "A Teapot Nanny healing baddies? No fair! Jiggle Splat! Now you're stuck!"]],
  "w6-s7": [["me", "Napkin Fold Fort! Ooh, fancy folds! I'm a swan! A wobbly swan!"], ["me", "Bouncy sponge! BOING! Key's mine. No flag in the chest, though. Aw, crumbs."]],
  "w6-s8": [["lo2", "Charge, my silverware! Spoon yon jelly into a bowl!"], ["me", "Spoons are for PARTIES, Sir Stale! Forty-five seconds! Wobble Shield, up!"]],
  "w6-s9": [["me", "Chandelier! Sparkly! It's like a disco ball! Dance break? Dance break!"], ["lo2", "Climb, wobbly knave! At the top, I shall sit upon thy flag! Hahaha!"], ["me", "Rude! Okay, dance break's over. Climbing!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "Hose Highway! A long green noodle! Hi, noodle!"], ["n", "RUMBLE! A rolling pin comes bouncing down the hose!"], ["me", "Even in the Backyard?! Get your own adventure! RUN!"]],
  "w7-s3": [["n", "FSSSH! Sprinklers burst up all over the lawn!"], ["me", "Wheee! I'm a water balloon! Okay, lever, pin, BONK! Splash zone!"]],
  "w7-s4": [[10, "Hmph. Jelly. This Crumblet wants to swim. No swimming. Walk it to the exit."], ["me", "I float! Kinda! Hop on, little muffin. I'm a jelly pool float!"]],
  "w7-s6": [[9, "Hiya, little jelly! I'm having a birthday party! I think. Did I invite you? *POP*"], ["me", "Nope! Nobody ever does! That's okay! Happy birthday, maybe! Scroll time!"]],
  "w7-s7": [["me", "Flowerpot Fort! Dirt. Ew. Jelly and dirt is NOT a dessert."], ["me", "Bouncy sponge! BOING! Key's mine! Still no flag. Gimme an F! Where ARE you?"]],
  "w7-s8": [[18, "In THIS corner, the jiggliest cheerleader in the yard! Ding ding!"], ["me", "Velvaroo! You announced ME! Nobody announces me! Forty-five seconds, let's GO!"]],
  "w7-s9": [["me", "Charcoal Climb. Hot and smoky. My whipped cream is turning into soup!"], ["n", "From the grill above, a voice booms: \"ATTEN-TION! Sprouts, guard that little flag!\""], ["me", "He's got it! Gimme a G! For GRILL! Wait, no, for GO!"]],
  // World 8: The Garden.
  "w8-s2": [["me", "Watering Can Run! Ooh, a shower! Fresh and lime-y!"], ["n", "RUMBLE! A rolling pin bounces down from the watering can!"], ["me", "You again! At this point you're basically my friend! RUN!"]],
  "w8-s3": [["me", "Sunflowers! So tall! So cheery! Ah... AH-CHOO! Pollen!"], ["me", "Now I'm a jelly with sprinkles! Lever, pin, BONK! Bless you, baddies!"]],
  "w8-s4": [[10, "Hmph. Jelly. This Crumblet wants to see a pumpkin. A SMALL one. Walk it to the exit."], ["me", "Pumpkins! Big ones! Little ones! Gimme a P! You're doing great, little muffin!"]],
  "w8-s6": [[12, "Heyyy, duuude... *yaaawn* Were you at my nap party? Oh wait, I forgot to send invites."], ["me", "Ha! Of course! That's okay, Sloba! Scroll's at the top. Up we go!"]],
  "w8-s7": [["me", "Compost Keep. All the forgotten scraps end up here. Aww, poor scraps."], ["me", "Bouncy sponge! BOING! Key's mine! Hang in there, scraps. I'm cheering for you!"]],
  "w8-s8": [["lo2", "Hold out, wobbly knave! The scarecrow shall scare thee silly!"], ["me", "Scarecrows are just lonely guys in hats! Forty-five seconds! Go, Scarecrow! Wait."]],
  "w8-s9": [["n", "From the greenhouse, a voice rambles: \"Is that a pea in me? Is that a FLAG in me? Ooh, pointy!\""], ["me", "My flag! He's got my flag! Greenhouse is hot, but I'm climbing! Set for success!"]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "Trolley Track! I used to watch these trolleys from my shelf! Vroom!"], ["n", "RUMBLE! A giant rolling pin comes bowling down the trolley track!"], ["me", "Clean-up on aisle EVERYWHERE! Run, run!"]],
  "w9-s3": [["me", "Cereal Aisle! Cereal always gets picked. Every single breakfast. Lucky!"], ["me", "Lever down, pin drops, baddies bagged! Two for one! Wibble wobble!"]],
  "w9-s4": [[10, "Hmph. Jelly. Walk this Crumblet past the bananas. They cartwheel. Don't ask."], ["me", "Cartwheeling bananas? Ooh, they're good! Hop on, little muffin. We'll cheer from over here!"]],
  "w9-s6": [[14, "Let's GOOO! Bloblin! Hey, neighbour! Race you up the bakery! The HARD way!"], ["me", "Salmonster! Hi from aisle nine! Scroll first, then I'll cheer you up the hard way!"]],
  "w9-s7": [["me", "Canned Goods Keep. Dented cans with lasers. Everybody gets a laser but me!"], ["me", "Bouncy sponge! BOING! Key's mine! Still no flag. Best before SOON, please!"]],
  "w9-s8": [["lo2", "Hold out, wobbly knave! Thou art EXPIRED! Clean-up on aisle nine!"], ["me", "I'm jelly, Sir Stale! Jelly's got a LONG shelf life! Forty-five seconds, check it out!"]],
  "w9-s9": [["me", "The Frozen Aisle! Brrr! Jelly's best friend! I'm SO firm right now!"], ["n", "From the Back Aisle, a voice moans: \"Woooo! Nobody opens me! Nobody remembers me! Woooo!\""], ["me", "Aww. I know that feeling. But I still want my flag back! Climbing!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Wibble wobble WALLOP!", "Gimme a C! Gimme a COMBO!", "Jiggle, jiggle, SPLAT!"],
  lowhp: ["Uh-oh! I'm getting runny!", "*jiggle jiggle* Not good!", "Need a fridge! Quick!"],
  perfect: ["Wobbled right outta the way!", "Missed me! Too jiggly!", "Bendy jelly, baby!"],
  levelup: ["Set for success! Level up!", "Extra wobble unlocked!", "Bigger cherry! Yay me!"],
  secret: ["Ooh, a secret! I invited myself!", "A hidden treat! For ME?!", "Found it! Wibble wobble!"],
  boom: ["KA-BLAM! Go, boom! Yay, boom!", "Boom! I jiggled all over!", "Gimme a B! Gimme a BOOM!"],
  mimic: ["Eep! That box BIT me!", "Rude box! Very rude!", "A box with teeth? *jiggle*"],
  objective: ["Done! Gimme a W! For WIN!", "Job done! Wibble wobble!", "We did it! Go, team!"],
};
