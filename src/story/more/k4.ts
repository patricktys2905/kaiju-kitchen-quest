// Mothball: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Ooooh! Something round and glowy at the end of the trail! Is it... the MOON?"], ["me", "Oh. It's a crumb sitting in a sunbeam. Sorry, Mr. Crumb! You're still very shiny!"]],
  "w1-s3": [["me", "Ew, ew, sticky! My wings just went SCHLUCK in all this gummy goo!"], ["me", "Ooh, a big shiny ladle up there! I wonder what happens if I give it a tug?"]],
  "w1-s4": [["n", "Aww! A tiny Crumblet blinks up at Mothball, blueberries wobbling."], ["me", "Hi, little one! Are you lost? Snuggle up in my glow and we'll float over the hills together!"], ["me", "But stay away from the rattly pots, okay? Those go KA-BLAM, and they're only for monster hugs."]],
  "w1-s6": [["me", "There's a Recipe Scroll way out on the Spice Shelf! Ooh, maybe it's a recipe for moonlight!"], ["me", "Seventy-five seconds? Flap flap flap! Fluttering fast is like dreaming, but sweatier!"]],
  "w1-s7": [["me", "Ah... AH-CHOO! Hee hee, all this pepper makes my antennae tickle!"], ["me", "Ooh, I spy a chest with a key in it! Keys open doors, and doors have windows, and windows have MOONS!"]],
  "w1-s8": [["n", "Uh-oh! Clouds cover the window and the Cutting Board Bluffs go dark!"], ["me", "Aw, no moon tonight? That's okay, I'll be the little light instead! Hold on tight for forty-five seconds, everybody!"]],
  "w1-s9": [["me", "Ooh, those burners are sooo bright and orange! Hmm. Nope, still not the moon."], ["foe", "Bzzzt! Orange light, blue light, MY light! They all go ZAP, little moth!"], ["me", "Eep! Then I'm keeping my wings to myself, thank you very much!"]],
  // World 2: The Fridge
  "w2-s2": [["me", "Ooh, that milk jug is so pale and round. Moon? Is that you?"], ["n", "Uh-oh! The Milk Carton Rammer lowers its horns!"], ["me", "Yikes! Not the moon! DEFINITELY not the moon!"]],
  "w2-s3": [["me", "Hoo, my breath makes little clouds in here! Now I miss the night sky."], ["me", "And psst, see that lunchbox over there? It's only pretending to be a lunchbox. It's got TEETH!"]],
  "w2-s4": [["me", "Aww, a Crumblet shivering in the pickle jars! Come here, sweetie!"], [10, "Hmph. That little one's mine. Keep it warm for me, moth. I've got more to find."], ["me", "Ooh, I'll wrap it in my wings! Wings make the snuggliest scarves!"]],
  "w2-s6": [["me", "Eek! The fridge light went out! There are twelve pale eggs up there like twelve tiny moons, and none of 'em are mine."], ["me", "The last scroll was a crumble recipe, not moonlight. Aw! Maybe this one's different! Grab it, then hang on tight!"]],
  "w2-s7": [["me", "Whee, this bridge is slippy, and it smells like warm toast!"], [5, "Psst. Moth. There's a chest on the high ledge, and the key inside beats all this butter. Don't tell Ricotta."], ["me", "Tell who? Hee! I'm bad at secrets but super good at forgetting!"]],
  "w2-s8": [["me", "Whoa, this canyon looks like a sunset somebody squeezed too hard!"], ["me", "Forty-five seconds of monsters? I'll pretend they're stars and count 'em! One, two, ooh, that's a big one..."]],
  "w2-s9": [["me", "Brrr, the air up these ice steps tastes like snow."], ["mold", "Hehehe... hush, little moth. The cold keeps the light locked up. Stay. Sleep."], ["me", "Nuh-uh! Moths don't sleep at night. That's when the moon's awake!"]],
  // World 3: The Oven
  "w3-s2": [["me", "The Golem says my moon's in here! It's the Oven lamp, way, way up!"], ["me", "Down here on the bottom rack, everything is up. I like up! Up is where moons live!"]],
  "w3-s3": [["me", "Twelve round muffin cups, and not a single one of them is glowing. Hmph!"], ["me", "Ooh, a ladle! I bet if I pull it, that rolling pin goes ROLLY-ROLL. Like a lullaby, but flatter!"]],
  "w3-s4": [["n", "POP! POP! POP! Popcorn everywhere, and the Casserole Cliffs are crawling with monsters!"], ["me", "Under my wing, little Crumblet! There are more of them than there are stars!"], ["me", "When the pressure cookers rattle, we float away. Wheee! The monsters can stay for the fireworks."]],
  "w3-s6": [[8, "Moth! Me see paper far away. Paper say \"Recipe\". Me hope it cake."], ["me", "Ooh, Chocomunch! I hope it's moonlight! Let's go together. You stomp, I'll flutter!"]],
  "w3-s7": [["me", "Drip, drip, there's gravy everywhere! My wings are getting all glossy!"], ["me", "That chest up high has a key in it. There's gotta be a sponge around here to bounce me up. Sponges are so nice."]],
  "w3-s8": [["n", "Uh-oh! The Oven lamp sputters out! Only the Pizza Stone Steppe glows, dull and red."], ["mold", "Mmmm, hehehe! Warm little light. I'm gonna slurp up every drop."], ["me", "Hey! Somebody's drinking my moon! Give me forty-five seconds, and then I'm taking it BACK!"]],
  "w3-s9": [["me", "I can see the lamp's little glass face from here! Hi, moon!"], ["foe", "Bzzt! Higher and higher, moth! Wings melt near the top, ya know!"], ["me", "That's wax wings, silly! Mine are dust. And dust is super stubborn!"]],
  // World 4: The Pantry
  "w4-s2": [["me", "Cereal Canyon! A hundred little O's, like a hundred tiny moons! Hellooo, tiny moons!"], ["me", "Um. Why are the tiny moons growling at me? EEP!"]],
  "w4-s3": [["me", "This flour is soft and white like moon dust. Ooh, it'd be sooo nice for a nap..."], ["me", "Aw, the Flour Ghosts beat me to it. And yikes, that cereal box is BREATHING!"]],
  "w4-s4": [["n", "Aww! A little Crumblet sits on a tin can, crying blueberry tears."], ["me", "Shh, shh, it's okay! Hold onto my glow. This alley's loud, but we'll tiptoe through it together."]],
  "w4-s6": [[7, "Hrrm. Little moth, old recipes remember when the kitchen was bright. Also when it had snacks."], ["me", "Norigon, the last scroll was SOUP! Not one drop of moonlight! Okay, okay, I'll fetch this one too."]],
  "w4-s7": [["me", "Hey, who turned off the Pantry? Wait, there's a silver glow way up in the cookie jar!"], ["me", "My moon is IN THERE! But first I'll find that last secret key. Moths are great at finding stuff in the dark!"]],
  "w4-s8": [["me", "Ooooh, shiny! This honey is golden and glowy like a harvest moon!"], ["me", "No! I promised! Not every glow is the moon. Buuut it IS very pretty."], ["me", "Forty-five seconds, then the jar!"]],
  "w4-s9": [["me", "We're climbing right up to the cookie jar! Right up to my moon!"], ["mold", "Hehehe, go on, little light. Break the jar. The Sink is soooo dark, and it's waiting for you."], ["me", "Ooh, then it'll be happy to have some company!"]],
  // World 5: The Sink.
  "w5-s2": [["me", "Wheee, my wings are all bubbly! I'm a bubble moth now!"], ["n", "Uh-oh! A giant rolling pin comes thundering down the suds!"], ["me", "Eep! Flap flap FLAP! Moths are NOT for rolling!"]],
  "w5-s3": [["me", "The gates went clunk! Here come the grumpy monsters, all soapy and squeaky."], ["me", "Ooh, is that a lever up there? Somebody's about to get a big, flat, rolling-pin hug!"]],
  "w5-s4": [[10, "Hmph. Moth. There's a stray Crumblet up on that dish rack. Light the way for it, would ya?"], ["me", "Ooh, I'd love to! Snuggle into my glow, little one. The plates are big, but we're brave!"]],
  "w5-s6": [["me", "Ooh, the floor's moving all by itself! It's like flying without flapping!"], ["me", "There's a Recipe Scroll at the very end. Maybe THIS one's a recipe for moon pie! Grab it and hang on tight!"]],
  "w5-s7": [["me", "Bubbles, bubbles everywhere, and a chest way up on a ledge! Hello, chest!"], ["me", "I'll do my special bounce on that sponge. Boing! I'm basically a firework now!"]],
  "w5-s8": [["me", "Ooh, look how the drippy taps sparkle, like falling stars!"], ["me", "Falling stars that BLAST you? Eep! Then let's lure the monsters underneath 'em! Forty-five seconds, go!"]],
  "w5-s9": [["me", "It's so dark down this drain that I'm the only light left. Hee, I'm the moon now!"], ["mold", "Hehehe... come down, little light. I'm so thirsty. One more sip and the dark lasts FOREVER."], ["me", "Nuh-uh! I'm not a juice box! And I'm taking my moon home!"]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "These placemats go on forever! Ooh, and there's something big and round rolling this way! Moon?"], ["n", "Uh-oh! It's a giant rolling pin, and it's coming FAST!"], ["me", "Nope! Not the moon! Never trust anything round that's in a hurry! Flap flap FLAP!"]],
  "w6-s3": [["me", "Ooooh, real candles, like little lighthouses!"], ["me", "Eep, hot wax! Shiny but SPLATTY. Hey, that lever up there looks like it's just begging to be pulled!"]],
  "w6-s4": [[10, "Hmph. Moth. There's a Crumblet in the gravy boats who wants to see the world. Light it home, would ya?"], ["me", "Hi, little explorer! Let's see the world together. It's mostly gravy so far, but I'm sure it gets better!"]],
  "w6-s6": [["me", "Every single teacup has a teeny moon floating in the tea! And there's a Recipe Scroll at the end!"], ["lo2", "Forsooth! No moons at MY tea party, moth! Only stale crumpets!"], ["me", "Aw, you're no fun. I'm grabbing that scroll anyway! Pinkies up!"]],
  "w6-s7": [["me", "Somebody folded all these napkins into little swans! Hi, swans! Do you know where the key is?"], ["me", "The swans say it's in that chest up high. Okay, sponge, you know what to do! BOING!"]],
  "w6-s8": [["me", "Ooh, the spoons are so shiny I can see myself! Hi, me!"], ["me", "Eep, and the forks are pointy! Forty-five seconds of monsters first, THEN I'll admire the spoons. Promise!"]],
  "w6-s9": [["me", "We're climbing the chandelier! It's the moon's sparkly cousin! Ooooh, shiny!"], ["lo2", "Hahaha! Climb all thou likest, moth! Up here, the candles stay OUT!"], ["me", "Then I'll bring my own glow! I always do!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "The sunset makes this hose all golden! Ooh, and something round is rolling down it! Mo..."], ["n", "Uh-oh! It's that giant rolling pin again, rumbling down the hose!"], ["me", "I didn't even get to finish saying \"moon\"! Flap flap FLAP!"]],
  "w7-s3": [["n", "FWOOSH! The sprinklers spray a big, sparkly rainbow over the lawn!"], ["me", "Wheee, a rainbow! Rainbows are like moons, but stripy!"], ["me", "Eep, soggy wings! Quick, somebody pull that lever and roll those monsters flat while I dry off!"]],
  "w7-s4": [[10, "Hmph. Moth. Crumblet on the pool pier, and it's gettin' dark. You're the only nightlight I trust."], ["me", "Aww, you trust me? Hi, little swimmer! Look, the pool's full of sunset! Let's go!"]],
  "w7-s6": [["me", "There's a Recipe Scroll on the picnic table! Is it moon pie? Please be moon pie!"], ["lo2", "Hah! 'Tis a recipe for SPROUTS, moth! The Baron's finest!"], ["me", "Aw, sprouts? Lettuce hope not! I'm grabbing it anyway!"]],
  "w7-s7": [[9, "Ooh, pretty glow! Is that my birthday candle? I lost my party somewhere. *POP*"], ["me", "Aww! I'll watch out for it, Bubblegumbo! Could you hold that sponge still? The key chest is way up there."], [9, "Sure! Wait, what am I holding? Oh, right! Bounce away!"]],
  "w7-s8": [["me", "The sun's going down! Forty-five seconds, and then it's moon o'clock!"], ["me", "Eep, Picnic Wasps! Those are NOT fireflies! Shoo, shoo!"]],
  "w7-s9": [["me", "The coals glow orange, like a hundred tiny sunsets. Ooooh, shiny..."], ["n", "From the Grill Summit, a voice booms: \"ATTEN-TION! More smoke! Hide that SKY!\""], ["me", "Hey! The moon's coming out tonight, and you're NOT gonna smoke it! Flap flap!"]],
  // World 8: The Garden.
  "w8-s2": [["me", "Okay, I've learned my lesson. If something big and round comes rolling at me, it's NOT the moon."], ["n", "Uh-oh! Here comes the giant rolling pin, tumbling off the watering can!"], ["me", "See? I didn't even ask this time! I'm growing up! FLAP FLAP FLAP!"]],
  "w8-s3": [["me", "All the sunflowers are facing the sunset. Do they turn around to look at the moon too?"], ["me", "Ah-CHOO! Eep, pollen! Ooh, but that lever up there would make a lovely monster flattener!"]],
  "w8-s4": [[10, "Hmph. Moth. There's a stray hiding in the pumpkins. Fireflies are out, but it wants YOU."], ["me", "Hi, little pumpkin! Er, little muffin! Snuggle into my glow. The fireflies can come too!"]],
  "w8-s6": [["me", "The Recipe Scroll's at the top of this beanstalk! Is the moon up there too? Like in the bedtime story?"], ["lo2", "Hah! 'Tis a recipe for MYSTERY MEATLOAF, moth! None shall read it!"], ["me", "Ew! Then I'll turnip the speed and grab it first! Flap flap!"]],
  "w8-s7": [["me", "Ooh, this compost heap is all warm and glowy with fireflies! And there's a chest up on that ledge!"], [12, "Heyyy, little light. *yaaawn* Moon's comin' up soon. No rush. Moon's never in a rush."], ["me", "Ooh, Sloba, that's so wise! Okay, sponge, slow and steady. BOING!"]],
  "w8-s8": [["me", "The sun's almost down! Forty-five seconds, and then it's moon o'clock!"], [16, "Stay frosty, moth. Sun's leaving? Cool, cool, cool. I was NOT melting. Totally fine."], ["me", "Hee! I'll glow nice and cool for you, Minturtle! Here come the monsters!"]],
  "w8-s9": [["me", "It's glass all the way up! The moon's gonna look SO pretty through it!"], ["n", "From the Mystery Heap, a voice rumbles: \"A moon? Is there a MOON in me?! Hold on, lemme check!\""], ["me", "Nuh-uh! The moon lives in the sky! Flap flap!"]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "Ooh, the trolleys are all lined up like a train! Hi, trolleys!"], ["n", "Uh-oh! A giant rolling pin comes rumbling down the aisle, right behind them!"], ["me", "Clean-up on aisle EEP! Flap flap FLAP!"]],
  "w9-s3": [["me", "Moon Puffs! A whole box of tiny moons! Hellooo, tiny moons!"], ["me", "Eep, the boxes are growling again! Okay, I know the drill. Lever, rolling pin, big flat hug!"]],
  "w9-s4": [[10, "Hmph. Moth. My Crumblet's lost in the fruit and veg, and the lights are dim back there. Help a bear out?"], ["me", "Hi, little one! Snuggle into my glow. Ooh, a big round melon! Not the moon. See? I'm learning!"]],
  "w9-s6": [["me", "Mmm, the bakery smells so good! Is that Recipe Scroll for moon pie this time? Please, please be moon pie!"], ["lo2", "Hah! 'Tis a recipe for STALE crumpets, moth! Best before last Tuesday!"], ["me", "Aw, crumpets again! I'm grabbing it anyway! Flap flap!"]],
  "w9-s7": [[3, "Wibble wobble! Ooh, you glow like a dessert table candle! Is there a dessert table? Am I invited?"], ["me", "Hee! Come to my moon party, Bloblin! Can you jiggle that sponge for me? The key's way up there!"], [3, "Ooh, a job! I'm set for success! BOING!"]],
  "w9-s8": [["me", "Ooh, the scanner glows red and goes beep! Hi, scanner! Forty-five seconds, go!"], [14, "Let's GOOO, moth! Fly against the breeze! That's o-fish-ally how champions do it!"], ["me", "Ooh, okay! Flap flap FLAP! Wheee, I'm going backwards!"]],
  "w9-s9": [["me", "Every freezer door has its own little light! Brrr, chilly moons!"], ["n", "From the Back Aisle, a spooky voice wails: \"Woooo! Turn off that glow! I like it DARK back here!\""], ["me", "Aww, that's just 'cause you've never had a nightlight! I'm coming!"]],
  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Ten whole worlds, and every time something round rolls at me, it's never the moon."], ["n", "Uh-oh! The giant rolling pin is back, rumbling off the jam jars!"], ["me", "Hi again, rolling pin! I'm still not falling for it! Flap flap FLAP!"]],
  "w10-s3": [["me", "Ooh, a fortune cookie! It says \"You will find the moon.\" Hee, I KNEW it!"], ["me", "Eep, here come the monsters! Somebody pull that lever, quick! Rolling pin hugs for everyone!"]],
  "w10-s4": [[10, "Hmph. Moth. This is the last stray in the whole House, and it's real dark down by the falls."], ["me", "The LAST one? Ooh, then it gets my extra-special glow! Snuggle in, little one!"], [10, "Hmph. Thanks, moth. For all of 'em."]],
  "w10-s6": [["me", "Somebody hung paper moons on the party chains! And there's a Recipe Scroll at the end!"], ["lo2", "Hah! 'Tis a recipe for a FORGOTTEN feast, moth! Served cold, in the dark!"], ["me", "Aw, nobody likes eating in the dark! I'm grabbing it anyway! Flap flap!"]],
  "w10-s7": [[8, "Moth! Me hold sponge. Me no melt. Back of fridge nice and cold!"], ["me", "Hee, thanks, Chocomunch! That's the very last key chest up there!"], ["me", "BOING! Keys open doors, doors have windows, and windows have MOONS! Never gets old!"]],
  "w10-s8": [["me", "Every monster from every world, all at once? Eep, and it's sooo dark in here!"], ["foe", "Bzzt! Not for long! Party lights, ON! Go get 'em, moth!"], ["me", "Ooooh, sparkly! Thanks, Zapsy! FWOOSH!"]],
  "w10-s9": [["me", "This table goes on forever, all dusty and dark. There's not one candle on it. Aww."], ["n", "From the cake-tin throne, a voice grumbles: \"Turn off that glow, moth. Nobody's coming to my table.\""], ["me", "I'm coming! And I'm bringing the light! Flap flap!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Flutter, flutter, POW!", "Moonbeams on repeat! Wheee!", "Dust to dust, crumb to crumb!"],
  lowhp: ["Eep! My wings are fraying!", "Not the moth-eaten look!", "I need a little light here!"],
  perfect: ["Floated right past ya!", "Lighter than moon dust!", "Whoosh! Missed me by a wing!"],
  levelup: ["Ooh, I'm glowing brighter!", "Waxing, not waning! Hee!", "Full moon energy!"],
  secret: ["Ooooh, shiny! Moon? Nope! Still shiny!", "Psst, treasure! Hide it in my wings!", "A secret! Hee hee hee!"],
  boom: ["KA-BLAM! Brighter than the moon!", "Oopsie! Lights out for you!", "Pin-rolled! Sweet dreams!"],
  mimic: ["Lunch box? More like LUNATIC box!", "Yikes! A box with teeth? Rude!", "I knew that box was too quiet!"],
  objective: ["All done! Back to moon-hunting!", "I'm over the moon! Get it?", "Glowing with pride! Hee!"],
};
