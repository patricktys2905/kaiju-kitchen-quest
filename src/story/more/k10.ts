// Bluebeary: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Crumb Trail. Crumbs everywhere, and not one of 'em is a Crumblet. I checked every crumb."], ["me", "Hmph. Sponge on that high ledge. Little ones love bouncing. Gonna check up there too."]],
  "w1-s3": [["me", "Gummy Gully. Ugh, sticky! If a Crumblet's stuck in this goo, somebody's getting growled at."], ["me", "Ladle lever up there, rolling pin on top. Pin flattens monsters, paws do the rest. Grrr."]],
  "w1-s4": [["n", "A Crumblet tumbles out of the toaster! Uh-oh, it's not one of Bluebeary's six!"], ["me", "Hmph. You're not one of mine, are ya? Eh, doesn't matter. Stay behind the bear."], ["me", "Something big's lurking in these hills. And no touching the pressure cookers! No touching ANYTHING!"]],
  "w1-s6": [["me", "Recipe Scroll at the far end of the shelf. Seventy-five seconds? Hmph. Plenty."], ["me", "That's where the muffin recipe lives. Where my little ones came from. Go get it, bear."]],
  "w1-s7": [["me", "Pepper Pass. Ah, ahh... ACHOO! Hmph. Bears got good noses. Too good."], ["me", "I smell a key behind a sponge ledge. And a lunchbox that smells real funny. Grrr."]],
  "w1-s8": [["n", "Click! The lights go out over Cutting Board Bluffs, and the monsters come creeping!"], ["me", "Dark. My Crumblets always needed a night-light. Hmph. Forty-five seconds, then."], ["me", "Guess I'm the night-light now. A real grumpy one. GRRRR!"]],
  "w1-s9": [["foe", "Caw! Two shiny crumbs up on the stovetop, fuzzy! The King wears 'em like jewels! Caw-caw!"], ["me", "Two of MINE? Up THERE?!"], ["me", "Zip it, bird. The bear's walking faster now. STOMP, STOMP, STOMP."]],

  // World 2: The Fridge
  "w2-s2": [["me", "Dairy Lane. Brrr. Two found, four still out in the cold. Hmph."], ["me", "Milk Carton Rammers, huh? Go on. Ram me. See what happens. Grrr."]],
  "w2-s3": [["n", "Whoa! The Frosty Shelf is crawling with monsters! Way more than usual!"], ["me", "Lotta monsters. Good thing I brought both paws."], ["me", "Lunchboxes on the shelf too. Bop those first. Ask questions never."]],
  "w2-s4": [["n", "A little Crumblet huddles on Pickle Jar Pier, frosted blue. Another stray!"], ["me", "Aw, lookit you, all shivery! AHEM. I mean, hmph. Strays walked home: one. Making it two."], ["me", "Hissing things are bad guys, kiddo. Growling bears are good guys. Mostly."]],
  "w2-s6": [["me", "Another Recipe Scroll. Seventy-five seconds to grab it, then hold the fort."], ["mold", "Hehehe! Ssso many little crumbs, bear. Do you count them at night? So do I!"], ["me", "Whoever that was, start counting your TEETH. You'll have fewer soon. Grrr."]],
  "w2-s7": [["n", "Uh-oh! Something heavy is hiding on Butter Bridge, waiting to pounce!"], ["me", "Fine. Smash it first, then boing up the sponge for the key. Hmph. Easy."], ["me", "Crumblets would LOVE sliding on this bridge. Nobody tell 'em it exists."]],
  "w2-s8": [["me", "Ketchup Canyon. Forty-five seconds of waves. Hmph."], ["me", "Lure 'em to the pressure cookers and KA-BLAM! Monster ketchup. Extra grumpy."]],
  "w2-s9": [["me", "Ice Tray Steps. Lotta little cubes. Gonna check every one."], ["n", "Every cube holds one frozen pea. Bluebeary checks all forty-two anyway!"], ["me", "What? I'm thorough! I'm NOT worried! Hmph!"]],

  // World 3: The Oven
  "w3-s2": [["me", "Bottom Rack. Phew, hot! Muffins bake once. My Crumblets are NOT getting baked twice."], ["me", "Four found, two to go. Move it, bear."]],
  "w3-s3": [["me", "Huh. Muffin Tin Maze. This is where they were born. Twelve little cups. *sniff* Dust. It's dust."], ["me", "Ladle lever over the cups. And cereal boxes. Never trusted a box. Never will."]],
  "w3-s4": [["n", "A singed little Crumblet sits by a casserole dish, crying teeny tiny tears."], [0, "Ooh, a little one! Can I carry it? I'm great at being bigger than muffins!"], ["me", "Hmph. No. ...Okay, walk behind it, then. Strays walked home: three."]],
  "w3-s6": [["n", "Yikes! A swarm of monsters stands between Bluebeary and the Recipe Scroll!"], ["me", "Big crowd of little troublemakers? Hah. I raised six. I know crowds."]],
  "w3-s7": [["me", "Roasting Pan Pass. Key up on the ridge, lever right next to it."], ["me", "Pull the lever, pin goes BONK, monsters go flat. Like a recipe. A real rude recipe."]],
  "w3-s8": [[11, "Thirty minutes or it's free! Oh hey, Bluebeary! Forty-five seconds? Easy-peasy!"], ["me", "Hmph. You're late for your own delivery, raptor."], [11, "LATE?! I'm fashionably on schedule!"]],
  "w3-s9": [["me", "Top Rack. Something up there's hoarding stuff. Sniff sniff... I smell BLUEBERRY."], ["me", "Hang on, little one. Number five, Papa's coming."]],

  // World 4: The Pantry
  "w4-s2": [["me", "Cereal Canyon. Crumblets love cereal. Nobody tell 'em it's mostly boxes with teeth."], ["me", "One left. The littlest. Always wandering off, always coming back. Hmph. Always."]],
  "w4-s3": [["me", "Flour Drifts. Everything's white, so blueberries stick out. Good."], ["me", "Lever drops the rolling pin. Flour plus pin equals pastry. MONSTER pastry. Hmph."]],
  "w4-s4": [["n", "One more stray Crumblet in Tin Can Alley! And something big lurks around the corner!"], ["me", "Strays walked home: three. Four after you. I'm not counting! I'm just good at numbers."], ["me", "Behind me, kid. Cookers go boom, big guy goes down."]],
  "w4-s6": [["foe", "Caw... scroll's that way, fuzzy. Not that I'm helping! Just saying! Caw!"], ["me", "Hmph. Got a spare muffin cup back home. If a crow wanted one."], ["foe", "C-caw?! I mean, CAW. Whatever. Maybe."]],
  "w4-s7": [["me", "Pasta Jar Peaks. Last secret key's up on a sponge ledge."], ["me", "Noodle Lurkers under the pasta? Noodles don't lurk. Noodles are DINNER. Grrr."]],
  "w4-s8": [["me", "Honey Hollow. Honey! Bears like honey. Bears LOVE honey..."], ["me", "Nope! Focus! Forty-five seconds of waves first. Honey after. Okay, maybe one lick during."]],
  "w4-s9": [["n", "Squeak! A tiny, sticky squeak floats down from the Top Shelf!"], ["mold", "Hehehe! Last little crumb, bear. Can I keep it? The Sink has room for everyone."], ["me", "Hold on, littlest. Papa's climbing."]],

  // World 5: The Sink.
  "w5-s2": [["me", "Suds Slide. Crumblets would slide down this all day. Nobody tell 'em."], ["n", "Uh-oh! A giant rolling pin comes rumbling down the suds!"], ["me", "Bears don't run. Bears JOG. Real fast. GO GO GO!"]],
  "w5-s3": [["me", "Sponge Shoals. Gates locked, three waves. Hmph. I've done bath time with six muffins. This is nothing."], ["me", "Lever drops the pin. Monsters get washed up. For good. Grrr."]],
  "w5-s4": [["n", "A lost Crumblet wobbles on Dish Rack Ridge, between two giant plates!"], ["me", "Strays walked home: four. Five after you. Grab my fur, kid. Plates bite back."], [0, "Ooh, Bluebeary! Need a babysitter? I'm medium class now!"]],
  "w5-s6": [["me", "Bubble Bay. Recipe Scroll at the far end, seventy-five seconds. Conveyor belts. Lazy floors. Hmph."], ["me", "Bubbles keep popping on my nose. Not funny. Okay, a little funny."]],
  "w5-s7": [["me", "Plughole Pass. Key's in a chest on a high ledge. Bouncy sponge. Bears don't bounce."], ["me", "BOING! Wheee! AHEM. Nobody saw that. Hmph."]],
  "w5-s8": [["me", "Greasy Pan Pits. Forty-five seconds. These pans need a scrub. So do the monsters. GRRR."], [11, "Beep beep! Watch the taps, Bluebeary! When they pour, they BLAST ya!"], ["me", "I know how taps work, raptor. Hmph. Thanks."]],
  "w5-s9": [["me", "Drain Descent. Sniff sniff. Smells like a fridge nobody cleaned."], ["mold", "Hehehe... come down, bear. Is anybody counting YOU?"], ["me", "Six little somebodies. Every night. Grrr."]],

  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Placemat Plains. Crumbs everywhere. Stale ones. None of 'em the Littlest. Hmph."], ["n", "Uh-oh! A giant rolling pin comes rolling across the placemats!"], ["me", "Bears JOG, remember? Faster jog. FASTER! GRRR!"]],
  "w6-s3": [["me", "Candelabra Crossing. Hot wax drips everywhere. Ow! Gets right in the fur. Hmph."], ["me", "Lever up top drops a rolling pin. Monsters get flat. Bear gets a minute to grumble."]],
  "w6-s4": [["n", "Gravy Boat Bay! A tiny Crumblet waves from a gravy boat. It's the Littlest!"], ["me", "LITTLEST! Found ya! Still wanna see the world? Hmph. Fine. Together. Stay close."], ["me", "Strays walked home: six. This one's mine, so it counts double."]],
  "w6-s6": [["me", "Teacup Terrace. Recipe Scroll's at the far end. Littlest wants a tea party. After, kid."], ["lo2", "Forsooth, a bear at tea! Mind thy elbows, furry oaf! Pinkies UP!"], ["me", "This pinky's for squashing. Hmph."]],
  "w6-s7": [["me", "Napkin Fold Fort. Key chest on a high ledge. Bouncy sponge. Bears STILL don't bounce."], ["me", "BOING! Littlest says do it again. ONE more. Hmph."]],
  "w6-s8": [["me", "Silverware Siege. Forty-five seconds. Fork Soldiers, huh? I brought my own forks. Ten of 'em. Claws."], [11, "Beep beep! Table for two, Bluebeary? I'll take the knives, you take the forks!"], ["me", "Hmph. Deal, raptor."]],
  "w6-s9": [["me", "Chandelier Climb. Littlest says it's a sparkly tree. Sparkly tree full of monsters. Hmph."], ["lo2", "Hahaha! Climb, bear! At the Head of the Table, thy crumbs shall be my croutons!"], ["me", "Count your crumbs, breadstick. You're about to lose a few. Grrr."]],

  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "Hose Highway. Littlest says the hose is a big green snake. It's a hose, kid."], ["n", "Uh-oh! A giant rolling pin comes rumbling down the hose!"], ["me", "Okay, THAT one bites. Bears JOG! Hold on to the ear! GRRR!"]],
  "w7-s3": [["me", "Sprinkler Springs. FWOOSH! Wet fur. Littlest LOVED that. Hmph. I did not."], ["me", "Lever up top drops the pin. Monsters get flat. Bear gets dry. Eventually."]],
  "w7-s4": [["n", "Paddling Pool Pier! A tiny Crumblet drifts by on a pool noodle, totally lost!"], ["me", "Strays walked home: seven. Littlest, say hi to your new buddy. No splashing. Hmph."], ["me", "Okay, ONE splash. Then we walk it to the exit."]],
  "w7-s6": [["me", "Picnic Table Peak. Recipe Scroll's at the far end. Littlest wants the potato salad. After, kid."], ["lo2", "Hah! Baron Brussels shall grill thee RARE, bear!"], ["me", "Rare? I'm a muffin. I come out golden. Grrr."]],
  "w7-s7": [["me", "Flowerpot Fort. Key chest on a high ledge. Bouncy sponge. Bears STILL don't bounce."], [9, "Ooh, a bear! Have we met? Elephants never forget! *POP* Who are you again?"], ["me", "Hmph. Bluebeary. Again. Hold the sponge still, big guy. BOING!"]],
  "w7-s8": [["me", "Cooler Canyon. Forty-five seconds of waves. Cold box, hot tempers. Mostly mine."], [18, "In THIS corner, the grumpy papa bear! Ding ding! Swing for the muffin top!"], ["me", "Hmph. Already swinging."]],
  "w7-s9": [["me", "Charcoal Climb. Hot rocks. Littlest, stay up on the ear. Paws are for walking on lava."], ["n", "From the Grill Summit, a voice booms: \"ATTEN-TION! That muffin will make a FINE Sprout Soldier!\""], ["me", "My muffin's already got a job. Being little. GRRR."]],

  // World 8: The Garden.
  "w8-s2": [["me", "Watering Can Run. Littlest says the can's a giant teapot. Hmph. Kinda is."], ["n", "Uh-oh! A giant rolling pin comes rumbling off the watering can!"], ["me", "Bears JOG! Hold the ear! Faster jog! GRRR!"]],
  "w8-s3": [["me", "Sunflower Grove. Ah... ACHOO! Pollen in the fur. Littlest thinks it's hilarious. Hmph. It's a little funny."], ["me", "Lever up top drops the pin. Monsters get flat. Bear gets a tissue."]],
  "w8-s4": [["n", "Pumpkin Patch Path! A tiny Crumblet is hiding inside a hollow pumpkin!"], ["me", "Strays walked home: eight. C'mon out, kiddo. Littlest, no, we're NOT keeping the pumpkin."], ["me", "Okay, ONE pumpkin seed. Stay close. Potato Moles pop up outta nowhere. Hmph."]],
  "w8-s6": [["me", "Beanstalk Heights. Recipe Scroll's up top. Bears don't climb beans. Bears climb TREES."], ["lo2", "Hah! The Meatloaf shall stuff thee, bear! Thou art the mystery ingredient!"], ["me", "Only mystery here is how many teeth you'll keep. Grrr."]],
  "w8-s7": [["me", "Compost Keep. Pee-yew. Smells like the bottom of the muffin tin. Key chest on a high ledge."], [12, "Heyyy, papa bear. *yaaawn* Wanna nap on the compost? It's warm. Super chill."], ["me", "Hmph. Key first. BOING! Littlest says do it again. Bears STILL don't bounce."]],
  "w8-s8": [["me", "Scarecrow Stand. Forty-five seconds. Littlest is scared of the scarecrow. It's a hat on a stick, kid."], [16, "Stay frosty, little muffin. Cool, cool, cool. Is that sun hot? I'm fine. Totally not melting."], ["me", "You're dripping mint, turtle. Stand behind the bear. Hmph."]],
  "w8-s9": [["me", "Greenhouse Steps. Glass house. Littlest, no tapping on the glass."], ["n", "From the Mystery Heap, a voice rumbles: \"Is that a MUFFIN? Am I part muffin?! I could be!\""], ["me", "Nope. You're a no-eat food. GRRR."]],

  // World 9: The Supermarket.
  "w9-s2": [["me", "Trolley Track. Littlest wants a trolley ride. We had one, kid. You slept through it."], ["n", "Uh-oh! A giant rolling pin comes rumbling down the aisle!"], ["me", "Bears JOG! Hold the ear! Clean-up on aisle FAST! GRRR!"]],
  "w9-s3": [["me", "Cereal Aisle. Boxes taller than trees. Never trusted a box. Never will."], ["me", "Lever up top drops the pin. Monsters get flat. Bear gets the free toy inside."]],
  "w9-s4": [["n", "Fruit and Veg! A tiny Crumblet is hiding in the blueberry punnets. Sneaky camouflage!"], ["me", "Strays walked home: nine. C'mon out, kiddo. No, Littlest, we're NOT buying it a grape."], ["me", "Okay, ONE grape. Stay close. Bruised Bananas cartwheel outta nowhere. Hmph."]],
  "w9-s6": [["me", "Bakery Bluff. Recipe Scroll's at the far end. Smells like muffins. Littlest says it smells like cousins."], ["lo2", "Hah! The day-old shelf awaits thy crumbs, bear! Half price!"], ["me", "My crumbs are priceless, breadstick. Grrr."]],
  "w9-s7": [["me", "Canned Goods Keep. Key chest on a high ledge. Bouncy sponge. Bears STILL don't bounce."], [14, "Let's GOOO, papa bear! Bounce against gravity! That's how I swim upstream!"], ["me", "Hmph. BOING! Littlest says do it again. Fine. ONE more."]],
  "w9-s8": [["me", "Checkout Chaos. Forty-five seconds. A conveyor belt full of monsters. Somebody ring 'em up."], [11, "Beep beep! Express lane, Bluebeary! Ten monsters or less! Wait, that's like fifty!"], ["me", "Hmph. You bag 'em, raptor. I'll do the scanning. With my paws."]],
  "w9-s9": [["me", "Frozen Aisle. Brrr. Littlest, under the fur. Blueberries go hard in the cold."], ["n", "From the Back Aisle, a spooky voice wails: \"Woooo! Is that a muffin? I'll keep it in a TUB!\""], ["me", "Nobody keeps my muffins but me. GRRR."]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Hmph. Again.", "Bear hug! The bad kind!", "That's for my Crumblets!"],
  lowhp: ["Grrr... not done yet.", "Takes more than that. Hmph.", "Fur's singed. Still standing!"],
  perfect: ["Too slow, pal.", "Hah! Bears dodge. Who knew?", "Hmph. Missed me."],
  levelup: ["Stronger! Six to protect!", "Level up. Nap later.", "Hmph. Bigger bear."],
  secret: ["Ooh! Little ones'll love this.", "Saving this for the Crumblets.", "Hmph. Found it. Always do."],
  boom: ["Flat as a muffin top!", "KA-BLAM! Shouldn't stand there.", "Rolled flat. Hmph. Good."],
  mimic: ["Knew it! Never trust a box!", "Bad box! BAD!", "Hmph. Lunch fights back, huh?"],
  objective: ["Done. Next.", "Job's done. Counting heads.", "Easy as pie. Muffin. Whatever."],
};
