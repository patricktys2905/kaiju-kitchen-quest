// Mothball: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Ooooh! Something round and glowy on the trail! Is it... the MOON?"], ["me", "Oh. It's a Jam Blob in a sunbeam. Sorry, Mr. Blob! You're still very shiny! Can I have your Jam Glob?"]],
  "w1-s3": [["me", "Ew, ew, sticky! My wings just went SCHLUCK in all this gummy goo!"], ["me", "Ooh, a pretty lunchbox! Wait, did it just lick its lips? Eep! And a Rolling Pin Rogue is snoozing at the end!"]],
  "w1-s4": [["n", "Aww! A tiny Crumblet blinks up at Mothball, blueberries wobbling."], ["me", "Hi, little one! Are you lost? Snuggle up in my glow and we'll float over the hills together!"], ["me", "And when we find the big King Sour Worm, you hide, okay? Worm hugs are only for monsters."]],
  "w1-s6": [["me", "There's a Recipe Scroll way up high on the Spice Shelf! Ooh, maybe it's a recipe for moonlight!"], ["me", "Gotta grab it before time runs out? Flap flap flap! Fluttering fast is like dreaming, but sweatier!"]],
  "w1-s7": [["me", "Ah... AH-CHOO! Hee hee, all this pepper makes my antennae tickle!"], ["me", "Ooh, a bouncy sponge past the far edge, and a key chest up top! Keys open doors, doors have windows, windows have MOONS!"]],
  "w1-s8": [["n", "Uh-oh! Clouds cover the window and the Cutting Board Bluffs go dark!"], ["me", "Aw, no moon tonight? Then I'll be the little light! Hold on tight, everybody, the monsters are pouring in!"], ["me", "Ooh, and a King Pepper Grunt with a shiny crown! Crowns aren't moons. I checked."]],
  "w1-s9": [["me", "Ooh, those burners are sooo bright and orange! Hmm. Nope, still not the moon."], ["foe", "Bzzzt! Orange light, blue light, MY light! They all go ZAP, little moth!"], ["me", "Eep! Then I'm keeping my wings to myself, thank you very much!"]],
  // World 2: The Fridge
  "w2-s2": [["me", "Ooh, that ice cube is so pale and glowy. Moon? Is that you?"], ["n", "Uh-oh! It's the Ice Cube Ogre, and it is NOT a morning person!"], ["me", "Yikes! Not the moon! I'll go ask the Brain-Freeze Bats for Frost Wings instead. Bats are nicer!"]],
  "w2-s3": [["me", "Hoo, my breath makes little clouds in here! Now I miss the night sky."], ["me", "And psst, see that lunchbox over there? It's only pretending to be a lunchbox. It's got TEETH!"]],
  "w2-s4": [["me", "Aww, a Crumblet shivering in the pickle jars! Come here, sweetie!"], [10, "Hmph. That little one's mine. Keep it warm for me, moth. I've got more to find."], ["me", "Ooh, I'll wrap it in my wings! Wings make the snuggliest scarves!"]],
  "w2-s6": [["me", "Eek! The fridge light went out! There are twelve pale eggs up there like twelve tiny moons, and none of 'em are mine."], ["me", "The last scroll was a crumble recipe, not moonlight. Maybe this one's different! Flap up and grab it, quick!"], ["me", "And a big round Cheese Wheel is snoozing at the end. Round, but stinky. Not the moon!"]],
  "w2-s7": [["me", "Whee, this bridge is slippy, and it smells like warm toast!"], [5, "Psst. Moth. There's a chest on the high ledge, and the key inside beats all this butter. Don't tell Ricotta."], ["me", "Tell who? Hee! I'm bad at secrets but super good at forgetting!"]],
  "w2-s8": [["me", "Whoa, this canyon looks like a sunset somebody squeezed too hard!"], ["me", "Monsters pouring in? I'll pretend they're stars and count 'em! One, two, ooh, that's a big one..."], ["me", "And a King Carrot Sniper waiting at the end? Eep! Orange is NOT a moon colour!"]],
  "w2-s9": [["me", "Brrr, the air up these ice steps tastes like snow."], ["mold", "Hehehe... hush, little moth. The cold keeps the light locked up. Stay. Sleep."], ["me", "Nuh-uh! Moths don't sleep at night. That's when the moon's awake!"]],
  // World 3: The Oven
  "w3-s2": [["me", "The Golem says my moon's in here! It's the Oven lamp, way, way up!"], ["me", "Wheee! The steam vents go WHOOSH and fling me right up! I like up! Up is where moons live!"]],
  "w3-s3": [["me", "Twelve round muffin cups, and not a single one of them is glowing. Hmph!"], ["me", "The portal wants Burnt Croutons and Popped Kernels. Ooh, popcorn! It's like teeny fluffy clouds!"]],
  "w3-s4": [["n", "POP! POP! POP! Popcorn everywhere, and the Casserole Cliffs are crawling with monsters!"], ["me", "Under my wing, little Crumblet! There are more of them than there are stars!"], ["me", "The King Popcorn Popper lives at the very top. You hide, and I'll do the fireworks. Wheee!"]],
  "w3-s6": [[8, "Moth! Me see paper way up high. Paper say \"Recipe\". Me hope it cake."], ["me", "Ooh, Chocomunch! I hope it's moonlight! Quick, before time runs out! You stomp, I'll flutter!"]],
  "w3-s7": [["me", "Drip, drip, there's gravy everywhere! My wings are getting all glossy!"], ["me", "That chest up high has a key in it. There's gotta be a sponge around here to bounce me up. Sponges are so nice."]],
  "w3-s8": [["n", "Uh-oh! The Oven lamp sputters out! Only the Pizza Stone Steppe glows, dull and red."], ["mold", "Mmmm, hehehe! Warm little light. I'm gonna slurp up every drop."], ["me", "Hey! Somebody's drinking my moon! Let me hold out here first, and then I'm taking it BACK!"]],
  "w3-s9": [["me", "I can see the lamp's little glass face from here! Hi, moon!"], ["foe", "Bzzt! Higher and higher, moth! Wings melt near the top, ya know!"], ["me", "That's wax wings, silly! Mine are dust. And dust is super stubborn!"]],
  // World 4: The Pantry
  "w4-s2": [["me", "A hundred little O's, like a hundred tiny moons! Hellooo, tiny moons!"], ["n", "Uh-oh! Tin cans come CLONK-ing down off the shelves!"], ["me", "Eep! Flap flap! I'll grab my Flour Puffs and Cracker Shards and skip the can hugs, thanks!"]],
  "w4-s3": [["me", "This flour is soft and white like moon dust. Ooh, it'd be sooo nice for a nap..."], ["me", "Aw, the Flour Ghosts beat me to it. And yikes, that cereal box is BREATHING!"]],
  "w4-s4": [["n", "Aww! A little Crumblet sits on a tin can, crying blueberry tears."], ["me", "Shh, shh, it's okay! Hold onto my glow. This alley's loud, but we'll tiptoe through it together."]],
  "w4-s6": [[7, "Hrrm. Little moth, old recipes remember when the kitchen was bright. Also when it had snacks."], ["me", "Norigon, the last scroll was SOUP! Not one drop of moonlight! Okay, okay, I'll fetch this one too."]],
  "w4-s7": [["me", "Hey, who turned off the Pantry? Wait, there's a silver glow way up in the cookie jar!"], ["me", "My moon is IN THERE! But first I'll find that last secret key. Moths are great at finding stuff in the dark!"]],
  "w4-s8": [["me", "Ooooh, shiny! This honey is golden and glowy like a harvest moon!"], ["me", "No! I promised! Not every glow is the moon. Buuut it IS very pretty."], ["me", "Hold out against the monsters first, then the jar!"]],
  "w4-s9": [["me", "We're climbing right up to the cookie jar! Right up to my moon!"], ["mold", "Hehehe, go on, little light. Break the jar. The Sink is soooo dark, and it's waiting for you."], ["me", "Ooh, then it'll be happy to have some company!"]],
  // World 5: The Sink.
  "w5-s2": [["me", "Wheee, my wings are all bubbly! I'm a bubble moth now!"], ["n", "Uh-oh! A big fat drip from the tap goes PLOOSH, right on Mothball's head!"], ["me", "Eep! Soggy! Okay, Soap Bubble Sprites, bubbles please! Then that Sponge Golem gets a wake-up call!"]],
  "w5-s3": [["me", "Ooh, a lunchbox by the plates! Is it full of moon pies? Wait. It's got TEETH!"], ["me", "And the Grabby Gloves keep wiggling their fingers at me. I need their Rubber Fingers, so... wiggle back?"]],
  "w5-s4": [[10, "Hmph. Moth. There's a stray Crumblet up on that dish rack. Light the way for it, would ya?"], ["me", "Ooh, I'd love to! Snuggle into my glow, little one. The plates are big, but we're brave!"]],
  "w5-s6": [["me", "There's a Recipe Scroll way up in the bubbles! Maybe THIS one's a recipe for moon pie!"], ["me", "Flap up before time runs out! And no listening to the Dish Soap Siren. Her songs are too soapy!"]],
  "w5-s7": [["me", "Bubbles, bubbles everywhere, and a chest way up on a ledge! Hello, chest!"], ["me", "I'll do my special bounce on that sponge. Boing! I'm basically a firework now!"]],
  "w5-s8": [["me", "Ooh, look how the drippy taps sparkle, like falling stars!"], ["me", "Falling stars that SPLASH you? Eep! Then let's lure the monsters underneath 'em while we hold out!"]],
  "w5-s9": [["me", "It's so dark down this drain that I'm the only light left. Hee, I'm the moon now!"], ["mold", "Hehehe... come down, little light. I'm so thirsty. One more sip and the dark lasts FOREVER."], ["me", "Nuh-uh! I'm not a juice box! And I'm taking my moon home!"]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "These placemats go on forever! Ooh, and there's something big and round sailing this way! Moon?"], ["n", "Uh-oh! It's a Gravy Boat Rammer, and it's coming FAST!"], ["me", "Nope! Never trust anything round that's in a hurry! I'll take your Gravy Drop, though! Flap flap FLAP!"]],
  "w6-s3": [["me", "Ooooh, real candles, like little lighthouses!"], ["me", "Eep, hot wax! Shiny but SPLATTY. And that lunchbox has teeth! I'm keeping my wings to myself!"]],
  "w6-s4": [[10, "Hmph. Moth. There's a Crumblet in the gravy boats who wants to see the world. Light it home, would ya?"], ["me", "Hi, little explorer! Let's see the world together. It's mostly gravy so far, but I'm sure it gets better!"]],
  "w6-s6": [["me", "Every single teacup has a teeny moon floating in the tea! And there's a Recipe Scroll way up high!"], ["lo2", "Forsooth! No moons at MY tea party, moth! Only stale crumpets!"], ["me", "Aw, you're no fun. I'm grabbing that scroll before time runs out anyway! Pinkies up!"]],
  "w6-s7": [["me", "Somebody folded all these napkins into little swans! Hi, swans! Do you know where the key is?"], ["me", "The swans say it's in that chest up high. Okay, sponge, you know what to do! BOING!"]],
  "w6-s8": [["me", "Ooh, the spoons are so shiny I can see myself! Hi, me!"], ["me", "Eep, and the forks are pointy! I'll hold out against the monsters first, THEN admire the spoons. Promise!"]],
  "w6-s9": [["me", "We're climbing the chandelier! It's the moon's sparkly cousin! Ooooh, shiny!"], ["lo2", "Hahaha! Climb all thou likest, moth! Up here, the candles stay OUT!"], ["me", "Then I'll bring my own glow! I always do!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "The sunset makes this hose all golden! Ooh, and something round and glowy is rolling this way! Mo..."], ["n", "Uh-oh! It's a red-hot coal, rolling off to wake up the Hot Coal Golem!"], ["me", "I didn't even get to finish saying \"moon\"! Flap flap FLAP!"]],
  "w7-s3": [["n", "FWOOSH! The sprinklers spray a big, sparkly rainbow over the lawn!"], ["me", "Wheee, a rainbow! Rainbows are like moons, but stripy!"], ["me", "Eep, soggy wings! And the Spatula Sheriff says no flying in his town. Hmph! Moths don't do speed limits!"]],
  "w7-s4": [[10, "Hmph. Moth. Crumblet on the pool pier, and it's gettin' dark. You're the only nightlight I trust."], ["me", "Aww, you trust me? Hi, little swimmer! Look, the pool's full of sunset! Let's go!"]],
  "w7-s6": [["me", "There's a Recipe Scroll on the picnic table! Is it moon pie? Please be moon pie!"], ["lo2", "Hah! 'Tis a recipe for SPROUTS, moth! The Baron's finest!"], ["me", "Aw, sprouts? Lettuce hope not! I'm grabbing it before time runs out anyway!"]],
  "w7-s7": [[9, "Ooh, pretty glow! Is that my birthday candle? I lost my party somewhere. *POP*"], ["me", "Aww! I'll watch out for it, Bubblegumbo! Could you hold that sponge still? The key chest is way up there."], [9, "Sure! Wait, what am I holding? Oh, right! Bounce away!"]],
  "w7-s8": [["me", "The sun's going down! Hold out a little longer, and then it's moon o'clock!"], ["me", "Eep, Picnic Wasps! Those are NOT fireflies! Shoo, shoo!"]],
  "w7-s9": [["me", "The coals glow orange, like a hundred tiny sunsets. Ooooh, shiny..."], ["n", "From the Grill Summit, a voice booms: \"ATTEN-TION! More smoke! Hide that SKY!\""], ["me", "Hey! The moon's coming out tonight, and you're NOT gonna smoke it! Flap flap!"]],
  // World 8: The Garden.
  "w8-s2": [["me", "Okay, I've learned my lesson. If something big and round comes rolling at me, it's NOT the moon."], ["n", "Uh-oh! Here comes a Toadstool Hopper, boinging off the watering can!"], ["me", "See? I didn't even ask this time! I'm growing up! Can I have your Mushroom Cap? FLAP FLAP!"]],
  "w8-s3": [["me", "All the sunflowers are facing the sunset. Do they turn around to look at the moon too?"], ["me", "Ah-CHOO! Eep, pollen puffs! And a lunchbox with teeth hiding in the petals! Rude!"]],
  "w8-s4": [[10, "Hmph. Moth. There's a stray hiding in the pumpkins. Fireflies are out, but it wants YOU."], ["me", "Hi, little pumpkin! Er, little muffin! Snuggle into my glow. The fireflies can come too!"]],
  "w8-s6": [["me", "The Recipe Scroll's at the top of this beanstalk! Is the moon up there too? Like in the bedtime story?"], ["lo2", "Hah! 'Tis a recipe for MYSTERY MEATLOAF, moth! None shall read it!"], ["me", "Ew! Then I'll turnip the speed and grab it first! Flap flap!"]],
  "w8-s7": [["me", "Ooh, this compost heap is all warm and glowy with fireflies! And there's a chest up on that ledge!"], [12, "Heyyy, little light. *yaaawn* Moon's comin' up soon. No rush. Moon's never in a rush."], ["me", "Ooh, Sloba, that's so wise! Okay, sponge, slow and steady. BOING!"]],
  "w8-s8": [["me", "Monsters pouring into the patch? Then I'll hold out till the sun's down! Moon o'clock, here I come!"], [16, "Stay frosty, moth. Sun's leaving? Cool, cool, cool. I was NOT melting. Totally fine."], ["me", "Hee! I'll glow nice and cool for you, Minturtle! Here come the monsters!"]],
  "w8-s9": [["me", "It's glass all the way up! The moon's gonna look SO pretty through it!"], ["n", "From the Mystery Heap, a voice rumbles: \"A moon? Is there a MOON in me?! Hold on, lemme check!\""], ["me", "Nuh-uh! The moon lives in the sky! Flap flap!"]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "Ooh, the trolleys are all lined up like a train! Hi, trolleys!"], ["n", "Uh-oh! A Trolley Rammer comes rumbling down the aisle, wheels squeaking!"], ["me", "Clean-up on aisle EEP! Okay, Mr. Rammer, I'll just borrow a Trolley Wheel! Flap flap FLAP!"]],
  "w9-s3": [["me", "Moon Puffs! A whole box of tiny moons! Hellooo, tiny moons!"], ["me", "Eep, a lunchbox with teeth! I know the drill now. Don't hug it, bop it! Then on to the Cash Register Golem!"]],
  "w9-s4": [[10, "Hmph. Moth. My Crumblet's lost in the fruit and veg, and the lights are dim back there. Help a bear out?"], ["me", "Hi, little one! Snuggle into my glow. Ooh, a big round melon! Not the moon. See? I'm learning!"]],
  "w9-s6": [["me", "Mmm, the bakery smells so good! Is that Recipe Scroll for moon pie this time? Please, please be moon pie!"], ["lo2", "Hah! 'Tis a recipe for STALE crumpets, moth! Best before last Tuesday!"], ["me", "Aw, crumpets again! I'm grabbing it before time runs out! Flap flap!"]],
  "w9-s7": [[3, "Wibble wobble! Ooh, you glow like a dessert table candle! Is there a dessert table? Am I invited?"], ["me", "Hee! Come to my moon party, Bloblin! Can you jiggle that sponge for me? The key's way up there!"], [3, "Ooh, a job! I'm set for success! BOING!"]],
  "w9-s8": [["me", "Ooh, the scanner glows red and goes beep! Hi, scanner! Here come the monsters, hold out!"], [14, "Let's GOOO, moth! Fly against the breeze! That's o-fish-ally how champions do it!"], ["me", "Ooh, okay! Flap flap FLAP! Wheee, I'm going backwards!"]],
  "w9-s9": [["me", "Every freezer door has its own little light! Brrr, chilly moons!"], ["n", "From the Back Aisle, a spooky voice wails: \"Woooo! Turn off that glow! I like it DARK back here!\""], ["me", "Aww, that's just 'cause you've never had a nightlight! I'm coming!"]],
  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Ten whole worlds, and every time something round rolls at me, it's never the moon."], ["n", "Uh-oh! A big round Party Cracker Bomber comes bouncing off the jam jars!"], ["me", "Hi, cracker! I'm still not falling for it! Can I have your Paper Crown? Flap flap FLAP!"]],
  "w10-s3": [["me", "Ooh, a fortune cookie! It says \"You will find the moon.\" Hee, I KNEW it!"], ["me", "Eep, a lunchbox with teeth! Somebody tell the Banquet Butler his luggage is biting!"]],
  "w10-s4": [[10, "Hmph. Moth. This is the last stray in the whole House, and it's real dark down by the falls."], ["me", "The LAST one? Ooh, then it gets my extra-special glow! Snuggle in, little one!"], [10, "Hmph. Thanks, moth. For all of 'em."]],
  "w10-s6": [["me", "Somebody hung paper moons on the party chains! And there's a Recipe Scroll way up high!"], ["lo2", "Hah! 'Tis a recipe for a FORGOTTEN feast, moth! Served cold, in the dark!"], ["me", "Aw, nobody likes eating in the dark! I'm grabbing it before time runs out! Flap flap!"]],
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
