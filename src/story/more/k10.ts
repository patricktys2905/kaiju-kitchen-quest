// Bluebeary: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Crumbs everywhere, and not ONE of 'em is a Crumblet. I checked. Every single crumb."], ["me", "Sir Butterknife's snoozing at the end of the trail? Nobody butters MY muffins, pal. Grrr."]],
  "w1-s3": [["me", "Ugh, this goo is sticky! If one of my Crumblets is stuck in here, somebody's getting growled at."], ["me", "That lunchbox? Never trust a box. And the Rolling Pin Rogue? Nobody rolls my muffins flat."]],
  "w1-s4": [["n", "A Crumblet tumbles out of the toaster! Uh-oh, it's not one of Bluebeary's six!"], ["me", "You're not one of mine, are ya, kiddo? Eh, doesn't matter. You stick right behind me."], ["me", "When we hit King Sour Worm, you hide. And don't touch ANYTHING! Especially the burners!"]],
  "w1-s6": [["me", "Recipe Scroll way up on the Spice Shelf, and the clock's ticking? Pfft. Plenty of time."], ["me", "That's the muffin recipe. That's where my little ones came from. The Toaster Tyrant ain't getting his mitts on it."]],
  "w1-s7": [["me", "Ah... AH... ACHOO! Who puts this much pepper on a countertop?!"], ["me", "Good thing a bear's nose never quits. I can smell a key behind that sponge ledge. And a lunchbox that smells real funny. Grrr."]],
  "w1-s8": [["n", "Here they come! Monsters pour onto Cutting Board Bluffs from every side!"], ["me", "My Crumblets always wanted to stay up past bedtime. Hmph. Gotta hold out till this rush stops."], ["me", "Then King Pepper Grunt gets a real grumpy bedtime story! GRRRR!"]],
  "w1-s9": [["foe", "Caw! Two shiny crumbs up on the stovetop, fuzzy! The King wears 'em like jewels! Caw-caw!"], ["me", "Two of MINE? Up THERE?!"], ["me", "Zip it, bird. I'm walking faster now. STOMP, STOMP, STOMP!"]],

  // World 2: The Fridge
  "w2-s2": [["me", "Brrr! Two Crumblets home safe, four still out here in the cold. Hang on, kids."], ["me", "Ice Cube Ogre, huh? Go on, freeze me. I dare ya. Grrr."]],
  "w2-s3": [["n", "Whoa! A lunchbox on the Frosty Shelf is licking its lips!"], ["me", "I'm bopping that thing first and asking questions never."], ["me", "Then the Fish Finger General. Fish fingers? My kids have muffin fingers. Way cuter. Hmph."]],
  "w2-s4": [["n", "A little Crumblet huddles on Pickle Jar Pier, frosted blue. Another stray!"], ["me", "Aw, lookit you, all shivery! AHEM. I mean, hmph. That's stray number two I'm walking home."], ["me", "King Milk Carton Rammer's up ahead, kiddo. You hide behind the pickles. Papa rams back."]],
  "w2-s6": [["me", "Another Recipe Scroll, way up high! Grab it before time runs out, then The Cheese Wheel."], ["mold", "Hehehe! Ssso many little crumbs, bear. Do you count them at night? So do I!"], ["me", "Whoever said that, start counting your TEETH. You're gonna have fewer real soon."]],
  "w2-s7": [["n", "Uh-oh! The Butter Block Brute is waiting at the end of Butter Bridge, ready to pounce!"], ["me", "Fine by me. First I boing up the sponge for that key, then I smash it. Easy."], ["me", "My Crumblets would LOVE sliding on this bridge. Nobody tell 'em it exists!"]],
  "w2-s8": [["me", "A monster rush in Ketchup Canyon? I've had worse bedtimes. Hold out, then King Carrot Sniper."], ["me", "Carrots are good for your eyes, kids. Crowned ones are good for SQUASHING. Grrr!"]],
  "w2-s9": [["me", "Look at all these little ice cubes. I'm checking every last one of 'em."], ["n", "Every cube holds one frozen pea. Bluebeary checks all forty-two anyway!"], ["me", "What? I'm thorough! I am NOT worried! Hmph!"]],

  // World 3: The Oven
  "w3-s2": [["me", "Phew, it's hot down here! Muffins get baked ONCE. My Crumblets are not getting baked twice."], ["me", "Four found, two to go. Steam vents, Casserole Commander, whatever. Move those paws, Papa."]],
  "w3-s3": [["me", "Huh. The Muffin Tin. This is where they were born, all twelve little cups. *sniff* It's dust! There's dust in my eye!"], ["me", "And a lunchbox in the cups. Never trusted a box, never will. Pizza Peel Paladin, you're next."]],
  "w3-s4": [["n", "A singed little Crumblet sits by a casserole dish, crying teeny tiny tears."], [0, "Ooh, a little one! Can I carry it? I'm great at being bigger than muffins!"], ["me", "No. ...Okay, fine, you can walk behind it. Stray number three. King Popcorn Popper, you're toast."]],
  "w3-s6": [["n", "The Recipe Scroll sits way up high, and the clock is ticking!"], ["me", "Climbing? With these paws? Hah! I raised six. I can climb anything. Muffin Tin Mortar's next."]],
  "w3-s7": [["me", "There's a key past the end of this pan, and a bouncy sponge to get there. I don't bounce."], ["me", "Souffle Sorcerer, huh? Souffles fall flat if you yell. Let's test it. GRRR!"]],
  "w3-s8": [[11, "Thirty minutes or it's free! Oh hey, Bluebeary! Holding out against a monster rush? Easy-peasy!"], ["me", "You're late for your own delivery, raptor."], [11, "LATE?! I'm fashionably on schedule!"]],
  "w3-s9": [["me", "Something up top is hoarding stuff. Sniff sniff... I smell BLUEBERRY!"], ["me", "Hang on, number five! Papa's coming!"]],

  // World 4: The Pantry
  "w4-s2": [["me", "Crumblets love cereal. Nobody tell 'em this canyon's got tin cans falling from the sky."], ["me", "One left. The Littlest. Always wandering off, always coming back. Hmph. Always."]],
  "w4-s3": [["me", "All this flour makes everything white, so a blueberry will stick out a mile. Good."], ["me", "That lunchbox in the flour? Never trust a box. Then the Cereal Box Colossus. Big box, bigger growl."]],
  "w4-s4": [["n", "One more stray Crumblet in Tin Can Alley! And King Noodle Lurker is lurking at the end!"], ["me", "That's stray number four for me. I'm not counting! I'm just good at numbers."], ["me", "Behind me, kid. Cans fall, I catch 'em. Then the big noodle goes down."]],
  "w4-s6": [["foe", "Caw... the scroll's that way, fuzzy. Not that I'm helping! Just saying! Caw!"], ["me", "Got a spare muffin cup back home, y'know. If a crow ever wanted one."], ["foe", "C-caw?! I mean, CAW. Whatever. Maybe."]],
  "w4-s7": [["me", "The last secret key's up on a sponge ledge. Here we go again. Hmph."], ["me", "Peanut Butter Ogre at the end? Peanut butter sticks to the roof of your mouth. And my CLAWS. Grrr."]],
  "w4-s8": [["me", "Honey! Ooh, there's honey everywhere! Bears LOVE honey..."], ["me", "Nope! Focus! Hold out against the rush, then King Raisin Sniper, THEN honey. Okay, maybe one lick during."]],
  "w4-s9": [["n", "Squeak! A tiny, sticky squeak floats down from the Top Shelf!"], ["mold", "Hehehe! Last little crumb, bear. Can I keep it? The Sink has room for everyone."], ["me", "Hold on, Littlest! Papa's climbing!"]],

  // World 5: The Sink.
  "w5-s2": [["me", "My Crumblets would ride these suds all day long. Nobody tell 'em about this place either."], ["n", "Uh-oh! The Sponge Golem is soaking at the bottom of the slide, and the taps are dripping!"], ["me", "Bears don't run. We JOG. Real fast. Under the drips. GO GO GO!"]],
  "w5-s3": [["me", "Grabby Gloves, huh? Pfft. I've done bath time with six muffins. I KNOW grabby."], ["me", "Gimme those Rubber Fingers. Then the Plunger Paladin gets washed up for good. Grrr!"]],
  "w5-s4": [["n", "A lost Crumblet wobbles on Dish Rack Ridge, between two giant plates!"], ["me", "C'mere, kid. Grab a handful of fur. That's stray number five, and these plates bite back."], [0, "Ooh, Bluebeary! Need a babysitter? I'm medium class now!"]],
  "w5-s6": [["me", "Recipe Scroll way up high, and the clock's running? Climbing in a bubble bath. Hmph."], ["me", "Bubbles keep popping on my nose. It's not funny! Okay, it's a little funny."]],
  "w5-s7": [["me", "The key's in a chest past the end of the path, and the only way there is a bouncy sponge. I don't bounce."], ["me", "BOING! Wheee! AHEM. Nobody saw that. Nobody saw ANYTHING."]],
  "w5-s8": [["me", "These greasy pans need a good scrub. So does King Grabby Glove. Hold out, then scrub!"], [11, "Beep beep! Watch the taps, Bluebeary! When they pour, they BLAST ya!"], ["me", "I know how taps work, raptor. ...Thanks."]],
  "w5-s9": [["me", "Sniff sniff. Down this drain smells like a fridge nobody's cleaned in years."], ["mold", "Hehehe... come down, bear. Is anybody counting YOU?"], ["me", "Six little somebodies do. Every single night. GRRR."]],

  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Crumbs all over the placemats, and they're stale ones. Not one of 'em is my Littlest."], ["n", "Ahoy! The Gravy Boat Captain is sailing at the end of the placemats!"], ["me", "Gravy on a muffin? Not on my watch. GRRR!"]],
  "w6-s3": [["me", "Ow! Hot wax from the candles drips right into the fur! Who lights this many candles?!"], ["me", "Teapot Tyrant's at the end, and a lunchbox on the way. Never trust a box. Never trust a teapot either."]],
  "w6-s4": [["n", "Gravy Boat Bay! A tiny Crumblet waves from a gravy boat. It's the Littlest!"], ["me", "LITTLEST! Found ya! You still wanna see the world? Fine. We'll see it together. Stay close."], ["me", "And that's stray number six! Well, this one's mine, so it counts double."]],
  "w6-s6": [["me", "The Littlest wants a tea party in these giant teacups. After the scroll, kid."], ["lo2", "Forsooth, a bear at tea! Mind thy elbows, furry oaf! Pinkies UP!"], ["me", "This pinky's for squashing, breadstick."]],
  "w6-s7": [["me", "Another key up on a high ledge. Another bouncy sponge. I STILL don't bounce."], ["me", "BOING! ...The Littlest says do it again. ONE more. Hmph."]],
  "w6-s8": [["me", "Fork Soldiers, huh? Cute. I brought my own forks. Ten of 'em. They're called claws."], [11, "Beep beep! Table for two, Bluebeary? I'll take the knives, you take the forks!"], ["me", "Deal, raptor. Hold the line, then King Teapot Nanny's next!"]],
  "w6-s9": [["me", "The Littlest thinks this chandelier is a sparkly tree. A sparkly tree full of monsters, kid."], ["lo2", "Hahaha! Climb, bear! At the Head of the Table, thy crumbs shall be my croutons!"], ["me", "Count your crumbs, breadstick. You're about to lose a few. Grrr."]],

  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "The Littlest thinks this hose is a big green snake. It's a hose, kid."], ["n", "Uh-oh! A Hot Coal Golem glows at the end of the hose, and Picnic Wasps buzz all around!"], ["me", "Okay, THAT bites! Hold on to my ear! GRRR!"]],
  "w7-s3": [["me", "FWOOSH! Sprinklers! Now my fur's all soggy. The Littlest LOVED that. I did not."], ["me", "Let's flatten the Spatula Sheriff. I'll dry off. Eventually."]],
  "w7-s4": [["n", "Paddling Pool Pier! A tiny Crumblet drifts by on a pool noodle, totally lost!"], ["me", "Seventh stray this trip. Littlest, say hi to your new buddy. And no splashing!"], ["me", "Okay, ONE splash. Then we walk it past King Ketchup Squirter."]],
  "w7-s6": [["me", "Scroll's at the top of the picnic table, and the Littlest wants potato salad. After, kid."], ["lo2", "Hah! Baron Brussels shall grill thee RARE, bear!"], ["me", "Rare? I'm a muffin. I come out golden. Grrr."]],
  "w7-s7": [["me", "Key on a high ledge, sponge right under it. Do I bounce now? I guess I bounce now."], [9, "Ooh, a bear! Have we met? Elephants never forget! *POP* Who are you again?"], ["me", "Bluebeary. Again. Hold the sponge still, big guy. BOING!"]],
  "w7-s8": [["me", "Hot tempers in a cold cooler, and most of 'em are mine. Hold out, then King Corn Cob Cannon."], [18, "In THIS corner, the grumpy papa bear! Ding ding! Swing for the muffin top!"], ["me", "Already swinging!"]],
  "w7-s9": [["me", "Littlest, stay up on my ear. These hot coals are for paws only. Ow, ow, OW!"], ["n", "From the Grill Summit, a voice booms: \"ATTEN-TION! That muffin will make a FINE Sprout Soldier!\""], ["me", "My muffin's already got a job. Being little. GRRR."]],

  // World 8: The Garden.
  "w8-s2": [["me", "The Littlest says this watering can is a giant teapot. Y'know, it kinda is."], ["n", "SNAP! The Snapdragon is waiting at the end, and its jaws are bigger than Bluebeary!"], ["me", "Snap at my kid and I'll snap back. Hold the ear, kiddo! GRRR!"]],
  "w8-s3": [["me", "Ah... ACHOO! Sunflower pollen, right up my snout. The Littlest thinks it's hilarious."], ["me", "Okay, it's a little funny. Now let's bop the Watering Can Wizard so I can find a tissue."]],
  "w8-s4": [["n", "Pumpkin Patch Path! A tiny Crumblet is hiding inside a hollow pumpkin!"], ["me", "C'mon out, kiddo. You're stray number eight. Littlest, no, we're NOT keeping the pumpkin."], ["me", "Okay, ONE pumpkin seed. Stay close, King Tomato Lobber's got a mean throwing arm."]],
  "w8-s6": [["me", "The scroll's at the top of a beanstalk? Bears don't climb beans. Bears climb TREES."], ["lo2", "Hah! The Meatloaf shall stuff thee, bear! Thou art the mystery ingredient!"], ["me", "The only mystery is how many teeth you'll have left. Grrr."]],
  "w8-s7": [["me", "Pee-yew! This compost smells like the bottom of the muffin tin. Key's up on a high ledge."], [12, "Heyyy, papa bear. *yaaawn* Wanna nap on the compost? It's warm. Super chill."], ["me", "Key first, sloth. BOING! The Littlest wants another go. Of course it does."]],
  "w8-s8": [["me", "Holding out by the scarecrow, and the Littlest is scared of it. It's a hat on a stick, kid!"], [16, "Stay frosty, little muffin. Cool, cool, cool. Is that sun hot? I'm fine. Totally not melting."], ["me", "You're dripping mint all over the place, turtle. Get behind me. Hmph."]],
  "w8-s9": [["me", "A whole house made of glass. Littlest, no tapping on the windows."], ["n", "From the Mystery Heap, a voice rumbles: \"Is that a MUFFIN? Am I part muffin?! I could be!\""], ["me", "Nope. You're a no-eat food. GRRR."]],

  // World 9: The Supermarket.
  "w9-s2": [["me", "The Littlest wants a trolley ride. We had one, kid! You slept through the whole thing."], ["n", "Uh-oh! The Trolley Chariot comes rattling down the aisle!"], ["me", "Clean-up on aisle FAST! Hold the ear! GRRR!"]],
  "w9-s3": [["me", "These cereal boxes are taller than trees. Like I always say, never trust a box. Especially a lunchbox."], ["me", "Cash Register Golem at the end? I'm keeping the free toy AND the change."]],
  "w9-s4": [["n", "Fruit and Veg! A tiny Crumblet is hiding in the blueberry punnets. Sneaky camouflage!"], ["me", "Stray number nine, c'mon out. No, Littlest, we're NOT buying it a grape."], ["me", "Okay, ONE grape. Stay close, the Bruised Bananas cartwheel outta nowhere."]],
  "w9-s6": [["me", "Mmm, this bakery smells like muffins. The Littlest says it smells like cousins."], ["lo2", "Hah! The day-old shelf awaits thy crumbs, bear! Half price!"], ["me", "My crumbs are priceless, breadstick. Grrr."]],
  "w9-s7": [["me", "Key on a high ledge again. If I see one more bouncy sponge, I'm gonna growl at it."], [14, "Let's GOOO, papa bear! Bounce against gravity! That's how I swim upstream!"], ["me", "BOING! ...Fine. ONE more, Littlest. Just one."]],
  "w9-s8": [["me", "A checkout full of monsters? Somebody ring 'em up! Hold out!"], [11, "Beep beep! Express lane, Bluebeary! Ten monsters or less! Wait, that's like fifty!"], ["me", "You bag 'em, raptor. I'll do the scanning. With my paws."]],
  "w9-s9": [["me", "Brrr! Littlest, get under the fur. Blueberries go hard in the cold."], ["n", "From the Back Aisle, a spooky voice wails: \"Woooo! Is that a muffin? I'll keep it in a TUB!\""], ["me", "Nobody keeps my muffins but me. GRRR."]],

  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "No, kid, you can't lick the jam. That jam's older than I am."], ["n", "Uh-oh! A bowl of Forgotten Soup sloshes at the end, grumbling about the good old days!"], ["me", "Soup's cold, kid. Real cold. Hold the ear! GRRR!"]],
  "w10-s3": [["me", "Noodle boxes stacked to the ceiling! Somebody never cleans this fridge."], ["me", "And a Banquet Butler at the end. Maybe I'll find a fortune cookie in the mess."]],
  "w10-s4": [["n", "Frost Drawer Falls! A tiny Crumblet shivers on an ice cube. The very last stray in the House!"], ["me", "Stray number ten, the very last one. C'mere, kiddo. Littlest, scoot over on the ear."], ["me", "Two on one ear is getting crowded. The ear's FINE. Don't worry about the ear."]],
  "w10-s6": [["me", "Scroll's way up high, and the Littlest wants a paper chain. After, kid."], ["lo2", "Hah! Thy crumbs shall be the party favors, bear!"], ["me", "Party's over for you, breadstick. Grrr."]],
  "w10-s7": [["me", "Last key, last high ledge, last bouncy sponge. I still don't bounce. Officially."], [12, "Heyyy, papa bear. *yaaawn* Last bounce, dude. Make it count."], ["me", "BOING! The Littlest says do it again. No. ...Okay, ONE more."]],
  "w10-s8": [["me", "Every monster in the House, and one bear in the way. Let's dance."], [11, "Beep beep! Bluebeary! Bus fund's FULL! After this, everybody rides home!"], ["me", "Then let's earn the ride, raptor. GRRR!"]],
  "w10-s9": [["me", "Look at this long, dusty table. Not a crumb on it. What a sad table."], ["n", "From the cake-tin throne, a voice booms: \"Every forgotten crumb sits at MY table, bear!\""], ["me", "Nobody forgets these crumbs. I count 'em. GRRR."]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["And THAT'S for my Crumblets!", "Bear hug! The bad kind!", "Ya want more? Here's more!"],
  lowhp: ["Grrr! I'm not done yet!", "That all ya got?!", "My fur's singed, but I'm still standing!"],
  perfect: ["Too slow, pal!", "Hah! Bears can dodge! Who knew?", "Missed me by a whisker!"],
  levelup: ["Stronger! I got six to protect!", "Level up! Nap later!", "Look out, it's a BIGGER bear!"],
  secret: ["Ooh! The little ones'll love this!", "I'm saving this for the Crumblets!", "Found it! I always do!"],
  boom: ["Flat as a muffin top!", "KA-BLAM! Shouldn'ta stood there!", "Rolled flat! Good!"],
  mimic: ["Knew it! Never trust a box!", "Bad box! BAD!", "Since when does lunch bite back?!"],
  objective: ["Done! Now let's count heads!", "Job's done, kiddos!", "Easy as pie! Muffin! Whatever!"],
};
