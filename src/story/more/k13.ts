// Avocadrake: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop. Sunny, toasty, a browning factory.
  "w1-s2": [["me", "A crumb trail! Dragons LOVE following trails to treasure!"], ["n", "Uh-oh! RUMBLE RUMBLE! A giant rolling pin is coming right at him!"], ["me", "Mashed avocado is NOT on the menu! RUN!"]],
  "w1-s3": [["me", "Gummy Gully! Ugh, my tiny feet are stuck! Why do dragons get such tiny feet?!"], ["me", "Ooh, a lever! Pull it and the rolling pin goes BONK! Behold my clever claw!"]],
  "w1-s4": [[10, "Hmph. Dragon. Walk my Crumblet past the toasters. Not one scratch."], ["me", "Behold, little muffin! You're under the wing of a mighty wyrm! Psst, Bluebeary, am I browning?"], [10, "Hmph. You're green. Now GO."]],
  "w1-s6": [["me", "The Chef's recipe scroll! What if it's the recipe for GUAC? It must join my hoard!"], ["n", "Whoa! Monsters are pouring off the spice shelf!"], ["me", "Back, spice fiends! Ooh, is that chili powder? Chili and guac? Focus, dragon!"]],
  "w1-s7": [["me", "Pepper Pass. Ah... AH... ACHOO! Did I just breathe FIRE?!"], ["me", "Nope, just pepper. Ooh, a chest way up high! Bouncy sponge, take me to my TREASURE!"]],
  "w1-s8": [["foe", "Forty-five seconds, amigo! Then El Nacho comes back for SECONDS! OHHH YEAH!"], ["me", "Cutting boards? Knives? Hold the line, dragon. Nobody's slicing THIS avocado!"]],
  "w1-s9": [["me", "Burners ahead! Hot hot HOT! Keep the pit in, keep the green in!"], ["mold", "Hehehe... warm, isn't it, little avocado? Warm things go brown."], ["me", "Who said that?! I'm GREEN! Probably! Am I?!"]],
  // World 2: The Fridge. Cold, fresh, tempting.
  "w2-s2": [["me", "Dairy Lane! Sour cream! Ooh, sour cream and guac, a classic combo!"], ["n", "RUMBLE! Here comes that rolling pin again!"], ["me", "Classic combo, RUN!"]],
  "w2-s3": [["n", "Click! The fridge light goes out!"], ["me", "Darkness! Finally, a proper dragon's lair! *bonk* Ow. Who put a shelf there? Lever, help me out!"]],
  "w2-s4": [[10, "Hmph. Dragon. Another Crumblet. Mind the pickle jars, they're salty."], ["me", "Pickles are SO green. Am I that green? Don't answer! Come on, muffin!"]],
  "w2-s6": [["me", "An egg carton! A real dragon nest! Twelve eggs! Are any of them mine?"], ["me", "Nope, all chicken. Fine! I'll grab the recipe scroll and sulk later!"]],
  "w2-s7": [[17, "Wheee! Avocadrake! Watch out, the butter's super slippery!"], ["me", "Behold my graceful landing! *SPLAT* Ow. Okay, sponge time. BOING!"]],
  "w2-s8": [["me", "Ketchup Canyon. Ketchup and guac? Nope. Never. That's just wrong."], ["n", "Here they come! Hold out for forty-five seconds!"], ["me", "Guac and ROLL!"]],
  "w2-s9": [["mold", "Stay in the cold, little avocado. Cold keeps you green forever..."], ["me", "Forever green? Ooh. Tempting."], ["me", "Wait, frozen guac goes MUSHY! Nice try, creepy voice! Up the steps!"]],
  // World 3: The Oven. The browning nightmare, the pit panic, a real old dragon.
  "w3-s2": [["me", "My skin's getting all toasty. Am I browning? AM I?!"], ["n", "Uh-oh! RUMBLE! A rolling pin, coming in hot off the rack!"], ["me", "Toasty AND chased?! Worst day EVER! Well, since Tuesday!"]],
  "w3-s3": [["me", "Pit Hurl! BOING, BOING... wait, where'd my pit go?! My pit keeps me GREEN!"], ["me", "Phew, it bounced back! Okay, lever! Rolling pin, do your thing! BONK!"]],
  "w3-s4": [[10, "Hmph. This Crumblet's getting a sunburn. Get it through the Oven quick, would ya?"], ["me", "Behold, little muffin! I shall shade you with my mighty wings! They're small, but they're MIGHTY!"]],
  "w3-s6": [["me", "Recipe scroll, dead ahead! Ooh, hot sheet pan. My feet! Ow, ow, hot!"], ["me", "Hot-foot dragon dance! Hop, hop, grab the scroll, HOP!"]],
  "w3-s7": [[7, "Hrrm. A young dragon. I too was once green. Now I am also green. Seaweed is like that."], ["me", "Norigon! A REAL ancient dragon! I'm ancient too! Centuries! Since Tuesday!"], [7, "Hrrm. Tuesday is a fine age. The key chest is up high. Bounce, little wyrm."]],
  "w3-s8": [["me", "Pizza stone! Sizzle sizzle. Guac on pizza? Hmm. Wait, that's actually kinda good."], ["n", "Here they come! Hold out for forty-five seconds!"], ["me", "Hot rock, hot fight, cool dragon! Guac and roll!"]],
  "w3-s9": [["foe", "Up top it's even HOTTER, amigo! Perfect for warm chips and DIP! OHHH YEAH!"], ["me", "Warm guac?! That should be ILLEGAL!"]],
  // World 4: The Pantry. Cool cave, lime clues, a new idea about brown.
  "w4-s2": [["me", "Cereal Canyon! Crunchy. Reminds me of somebody cheesy."], ["n", "RUMBLE! Rolling pin! Cereal flying everywhere!"], ["me", "Run, wings, RUN! I mean flap! FLAP!"]],
  "w4-s3": [["me", "Flour everywhere! Oh no, I'm all white and powdery! Is that better or worse than brown?!"], ["me", "Gate's locked! Lever! Rolling pin, turn 'em into flatbread!"]],
  "w4-s4": [[10, "Hmph. Dragon. It's dark in Tin Can Alley and my Crumblet's scared. Don't tell it I'm scared too."], ["me", "Fear not, little muffin! Dragons can see in the dark! *bonk* Mostly!"]],
  "w4-s6": [["me", "Salt AND garlic? Everything a guac needs! Except a LIME!"], ["me", "Grab the recipe scroll, guardian! Hissy pots? Lure 'em in! KA-BLAM!"]],
  "w4-s7": [[8, "Avocadrake green! Me brown! Brown okay, see? Me still strong!"], ["me", "Huh. Brown IS kinda nice on you, Chocomunch."], ["me", "But I'm still keeping MY green! Sponge! BOING! Treasure time!"]],
  "w4-s8": [["me", "Honey Hollow! My wings are glued! Fine, I'll fight standing still. Like a statue! A SCARY one!"], ["n", "Here they come! Forty-five seconds!"]],
  "w4-s9": [["me", "Top shelf! Sniff sniff. I smell LIME! The Chef's close!"], ["mold", "Hehehe... drip, drip. Hear the Sink, little avocado? It's where browny things go."], ["me", "Behold my bravery! *squeak* Ahem. Climbing!"]],
  // World 5: The Sink. Down the drain to the lime.
  "w5-s2": [["n", "Uh-oh! A giant rolling pin is surfing down the Suds Slide!"], ["me", "Guac and ROLL! I mean RUN! Rolling is for the pin!"]],
  "w5-s3": [["me", "Sponge Shoals! Gates locked. Fine! Lever, rolling pin, SCRUB-a-dub-BONK!"], ["me", "Squeaky clean monsters! Next, please!"]],
  "w5-s4": [[10, "Hmph. My last Crumblet. Keep its frosting dry, dragon."], ["me", "Behold, little muffin! An umbrella of mighty wings! Small but mighty. We've talked about this."]],
  "w5-s6": [["me", "Bubbles! Is that a lime? No, bubble. Is THAT a lime? Also bubble!"], ["me", "Focus! Grab the scroll in seventy-five seconds, THEN pop bubbles!"]],
  "w5-s7": [["me", "The last key is way up high. My treasure! My chest! Sponge! BOING!"], ["me", "Nothing goes down the drain on MY watch! Except monsters!"]],
  "w5-s8": [["me", "Greasy pan. Eww! Somebody didn't wash up! I bet it was the Grease Dragon."], ["n", "Here they come! Hold out for forty-five seconds!"], ["me", "Time to clean up! Holy guacamole!"]],
  "w5-s9": [["mold", "Hehehe... down, down, little avocado. Down where it's dark and everything turns BROWN."], ["me", "Hey! Only I get to worry about browning!"], ["me", "Lime, I'm coming! Chef, I'm coming! Guardian of the guac, going DOWN!"]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Placemats! Ooh, fancy. Elbows off the table, dragon."], ["n", "RUMBLE! A giant rolling pin comes bowling across the placemats!"], ["me", "Excuse me! Pardon me! RUNNING!"]],
  "w6-s3": [["me", "Hot wax dripping! SPLAT! Hot AND sticky? That's a browning double whammy!"], ["me", "Lever time! Rolling pin, please clear the table!"]],
  "w6-s4": [[10, "Hmph. Dragon. This Crumblet wants to see the world. Mind the gravy boats."], ["me", "Behold, little muffin! The world! So far it's mostly gravy. Let's go!"]],
  "w6-s6": [["me", "Teacups! Pinkies up! Grab the scroll very politely and VERY fast!"], ["me", "Teapot Nannies healing the bad guys? Rude! Pit Hurl! BONK!"]],
  "w6-s7": [["me", "A napkin fort! Every dragon needs a castle! Can I keep it?"], ["lo2", "Thou canst NOT! Begone, guacamole!"], ["me", "Too late! Sponge! BOING! The key's mine, crusty!"]],
  "w6-s8": [["lo2", "Forks, CHARGE! Scoop up yon dip!"], ["me", "Scoop ME?! Only El Nacho tries that, and even HE gave up! Forty-five seconds, let's go!"]],
  "w6-s9": [["me", "A chandelier! Sparkly! This is the fanciest hoard I've ever seen!"], ["lo2", "Climb, little dip! At the top, I shall leave thee out on the table till thou art BROWN! Hahaha!"], ["me", "BROWN?! Oh, that's IT! Holy guacamole, here I come!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "Hose Highway! Long, green and bendy. Hey, it's like a big long ME!"], ["n", "RUMBLE! A giant rolling pin comes rolling down the hose!"], ["me", "Mashed avocado on a summer day?! NOPE! Guac and RUN!"]],
  "w7-s3": [["me", "Sprinklers! Ooh, cool water! Perfect for a sun-safe dragon!"], ["n", "FWOOSH! A sprinkler blasts Avocadrake sky-high!"], ["me", "Wheee! I mean, BEHOLD my flight! Lever! Rolling pin, BONK!"]],
  "w7-s4": [[10, "Hmph. Dragon. This Crumblet wants to see the pool. Keep it away from the splashy end."], ["me", "Behold, little muffin! My wings make great shade! Small but mighty. Need sunscreen?"], [10, "Hmph. Put some on its frosting."]],
  "w7-s6": [["me", "Picnic Table Peak! Grab the Recipe Scroll, dragon! Hey, where's my bowl?"], ["lo2", "Hah! The Baron's sprouts took thy dip up to the GRILL! Sizzle, sizzle!"], ["me", "Sizzle?! Not my hoard! Scroll first, then you're TOAST, crusty!"]],
  "w7-s7": [[9, "Hello there, little lizard! Elephants never forget! *POP* Uh, what was I saying?"], ["me", "DRAGON! And you forgot already! Ooh, is that a treasure chest up there?"], [9, "Bounce on the sponge, buddy! Let's stick together! *POP* Wait, who are you?"]],
  "w7-s8": [["me", "A cooler! Cold and dark! The perfect spot for guac! Remember this, dragon!"], ["n", "Here they come! Hold out for forty-five seconds!"], ["me", "Chill out, monsters! Get it? COOLER? Holy guacamole!"]],
  "w7-s9": [["n", "From the grill, a big pompous voice booms: \"ATTEN-TION! Dip on the grill, soldiers! Make it WELL DONE!\""], ["lo2", "Hah! Well done, guacamole! VERY well done! Brown all over!"], ["me", "Grilled guac?! That's the PITS! Hang on, hoard! Climbing!"]],
  // World 8: The Garden.
  "w8-s2": [["me", "Watering Can Run! A little sprinkle keeps a dragon fresh! Ahh!"], ["n", "RUMBLE! A giant rolling pin comes rolling round the watering can!"], ["me", "Mashed avocado on a garden path? That's the PITS! RUN!"]],
  "w8-s3": [["me", "Sunflowers! Big yellow faces, all staring at me. Am I browning? Don't all answer at once!"], ["n", "PUFF! A flower blasts a cloud of pollen!"], ["me", "Ah... ACHOO! Lever! Rolling pin, BONK! You reap what you sow, weeds!"]],
  "w8-s4": [[10, "Hmph. Dragon. This Crumblet got lost in the Pumpkin Patch. Walk it out."], ["me", "Behold, little muffin! Stay under my mighty wings! Small but mighty. You know the drill."], [10, "Hmph. Still small."]],
  "w8-s6": [["me", "Beanstalk Heights! A dragon climbing a beanstalk? Fee-fi-fo-GUAC!"], ["me", "Grab the Recipe Scroll and hold the vine! Peapod Snipers? Pit Hurl! BONK!"]],
  "w8-s7": [["me", "Compost Keep. Everything here is BROWN! Don't look at me, compost!"], [16, "Stay frosty, little dude. Scared of the sun? Same. Scoot into my shade."], ["me", "Shade buddies! Now, sponge! BOING! Treasure for the hoard!"]],
  "w8-s8": [["lo2", "Hah! Hold out all thou likest, dip! The Meatloaf shall MASH thee in!"], ["me", "Mash ME? Only guac gets mashed! Wait. I AM guac. Forty-five seconds, GO!"]],
  "w8-s9": [["me", "The Greenhouse! Glass walls, hot sun. It's a browning OVEN with plants!"], ["n", "From the top, a lumpy voice mumbles: \"Guac? In ME? Huh. Might be some in here already. Who knows!\""], ["me", "Nobody puts the guac in the loaf! Climbing!"]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "Trolley Track! Ooh, little carts! Can a dragon ride one? Wheee!"], ["n", "RUMBLE! A giant rolling pin comes rolling down the aisle right behind him!"], ["me", "Clean-up on aisle MASHED AVOCADO?! Nope! RUN!"]],
  "w9-s3": [["me", "Cereal Aisle! Boxes as tall as castles! Behold my new kingdom! Hey, who let Leftovers in my kingdom?"], ["me", "Lever! Rolling pin, BONK! Your shelf life is OVER!"]],
  "w9-s4": [[10, "Hmph. Dragon. Crumblet wandered off in Fruit and Veg. Walk it to the exit."], ["me", "Behold, little muffin! Ooh, AVOCADOS! My cousins! Wait, why are some of them BROWN?!"], [10, "Hmph. Don't look. Just walk."]],
  "w9-s6": [["me", "Bakery Bluff! Grab the Recipe Scroll, dragon! Ooh, is it a guac recipe?"], ["me", "Nope, croissants. Still mine! Hold the shelf! Pit Hurl! BONK!"]],
  "w9-s7": [[3, "Wibble wobble! A dragon! Are you going to the dessert table? Can I come?"], ["me", "Guac isn't dessert, Bloblin. But it SHOULD be! Ooh, a chest up high! Sponge! BOING!"]],
  "w9-s8": [["me", "Checkout Chaos! Beep! Beep! Hey, nobody scans the dragon!"], ["lo2", "Hah! Bag yon dip, my troops! Two for one!"], ["me", "Forty-five seconds, crusty! Then YOU'RE checked out! Guac and roll!"]],
  "w9-s9": [["me", "The Frozen Aisle! Cold and frosty! Perfect for guac! Brrr, maybe TOO perfect!"], ["n", "From the back aisle, a spooky voice wails: \"Woooo! Your dip will keep in my tub way past its best before! Woooo!\""], ["me", "Past its BEST BEFORE?! Hang on, hoard! Climbing!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Behold my fury! BEHOLD!", "Guac and ROLL!", "Holy guacamole, a combo!"],
  lowhp: ["Am I browning?! Be honest!", "Keep the pit in! Keep it IN!", "Ow! I'm getting mushy!"],
  perfect: ["Missed me! Dragon reflexes!", "Swoosh! Too fresh for ya!", "Ha! Smooth as guac!"],
  levelup: ["BEHOLD! A bigger dragon! *squeak*", "Ooh! Extra chunky!", "Older and wiser! Since Tuesday!"],
  secret: ["TREASURE! For my hoard!", "Ooh, shiny! Dragon finds!", "A secret! Dragons LOVE secrets!"],
  boom: ["KA-BLAM! That's the pits!", "Bonk! Mashed 'em!", "Boom! Holy guacamole!"],
  mimic: ["The treasure BIT me?!", "Yikes! A box with teeth!", "Hey! I'M the dragon here!"],
  objective: ["Behold! Mission complete!", "Done! And still green!", "The guardian of the guac wins!"],
};
