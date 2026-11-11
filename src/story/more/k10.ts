// Bluebeary: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Crumbs everywhere, and not ONE of 'em is a Crumblet. I checked. Every single crumb."], ["me", "Ooh, a sponge up on that ledge. My little ones love bouncing. I'm checking up there too. Hmph."]],
  "w1-s3": [["me", "Ugh, this goo is sticky! If one of my Crumblets is stuck in here, somebody's getting growled at."], ["me", "See that rolling pin up top? Yank the ladle, and it comes down on whoever's standing under it. Heh."]],
  "w1-s4": [["n", "A Crumblet tumbles out of the toaster! Uh-oh, it's not one of Bluebeary's six!"], ["me", "You're not one of mine, are ya, kiddo? Eh, doesn't matter. You stick right behind me."], ["me", "And don't touch the hissing pots! Don't touch ANYTHING! Those things go KA-BLAM!"]],
  "w1-s6": [["me", "There's a Recipe Scroll at the end of this shelf, and seventy-five seconds to grab it? Pfft. Plenty."], ["me", "That's the muffin recipe. That's where my little ones came from. Hmph. Nobody's getting their mitts on it."]],
  "w1-s7": [["me", "Ah... AH... ACHOO! Who puts this much pepper on a countertop?!"], ["me", "Good thing a bear's nose never quits. I can smell a key behind that sponge ledge. And a lunchbox that smells real funny. Grrr."]],
  "w1-s8": [["n", "Click! The lights go out over Cutting Board Bluffs, and the monsters come creeping!"], ["me", "My Crumblets always needed a night-light. Hmph. Gotta hold out forty-five seconds in the dark."], ["me", "Guess I'm the night-light now. A real grumpy one! GRRRR!"]],
  "w1-s9": [["foe", "Caw! Two shiny crumbs up on the stovetop, fuzzy! The King wears 'em like jewels! Caw-caw!"], ["me", "Two of MINE? Up THERE?!"], ["me", "Zip it, bird. I'm walking faster now. STOMP, STOMP, STOMP!"]],

  // World 2: The Fridge
  "w2-s2": [["me", "Brrr! Two Crumblets home safe, four still out here in the cold. Hang on, kids."], ["me", "Milk Carton Rammers, huh? Go on, ram me. I dare ya. Grrr."]],
  "w2-s3": [["n", "Whoa! The Frosty Shelf is crawling with monsters! Way more than usual!"], ["me", "That's a lotta monsters. Good thing I brought both paws."], ["me", "Lunchboxes on the shelf too? I'm bopping those first and asking questions never."]],
  "w2-s4": [["n", "A little Crumblet huddles on Pickle Jar Pier, frosted blue. Another stray!"], ["me", "Aw, lookit you, all shivery! AHEM. I mean, hmph. That's stray number two I'm walking home."], ["me", "Hissing things are bad guys, kiddo. Growling bears are good guys. Mostly."]],
  "w2-s6": [["me", "Another Recipe Scroll! Seventy-five seconds to grab it, then I hold the fort."], ["mold", "Hehehe! Ssso many little crumbs, bear. Do you count them at night? So do I!"], ["me", "Whoever said that, start counting your TEETH. You're gonna have fewer real soon."]],
  "w2-s7": [["n", "Uh-oh! Something heavy is hiding on Butter Bridge, waiting to pounce!"], ["me", "Fine by me. I'll smash it first, then boing up the sponge for that key. Easy."], ["me", "My Crumblets would LOVE sliding on this bridge. Nobody tell 'em it exists!"]],
  "w2-s8": [["me", "Forty-five seconds of monsters in Ketchup Canyon? I've had worse bedtimes."], ["me", "Lure 'em next to the hissing pots and KA-BLAM! Monster ketchup, extra grumpy!"]],
  "w2-s9": [["me", "Look at all these little ice cubes. I'm checking every last one of 'em."], ["n", "Every cube holds one frozen pea. Bluebeary checks all forty-two anyway!"], ["me", "What? I'm thorough! I am NOT worried! Hmph!"]],

  // World 3: The Oven
  "w3-s2": [["me", "Phew, it's hot down here! Muffins get baked ONCE. My Crumblets are not getting baked twice."], ["me", "Four found, two to go. Move those paws, Papa."]],
  "w3-s3": [["me", "Huh. The Muffin Tin. This is where they were born, all twelve little cups. *sniff* It's dust! There's dust in my eye!"], ["me", "Ooh, a ladle lever over the cups. And cereal boxes. Never trusted a box, never will."]],
  "w3-s4": [["n", "A singed little Crumblet sits by a casserole dish, crying teeny tiny tears."], [0, "Ooh, a little one! Can I carry it? I'm great at being bigger than muffins!"], ["me", "No. ...Okay, fine, you can walk behind it. That makes stray number three, kiddo."]],
  "w3-s6": [["n", "Yikes! A swarm of monsters stands between Bluebeary and the Recipe Scroll!"], ["me", "A big crowd of little troublemakers? Hah! I raised six. I know crowds."]],
  "w3-s7": [["me", "There's a key up on that ridge, and a lever right next to it. Somebody's making this easy."], ["me", "Pull the lever, the pin goes BONK, and the monsters go flat. Now THAT'S a recipe I like!"]],
  "w3-s8": [[11, "Thirty minutes or it's free! Oh hey, Bluebeary! Forty-five seconds of monsters? Easy-peasy!"], ["me", "You're late for your own delivery, raptor."], [11, "LATE?! I'm fashionably on schedule!"]],
  "w3-s9": [["me", "Something up top is hoarding stuff. Sniff sniff... I smell BLUEBERRY!"], ["me", "Hang on, number five! Papa's coming!"]],

  // World 4: The Pantry
  "w4-s2": [["me", "Crumblets love cereal. Nobody tell 'em this canyon is mostly boxes with teeth."], ["me", "One left. The Littlest. Always wandering off, always coming back. Hmph. Always."]],
  "w4-s3": [["me", "All this flour makes everything white, so a blueberry will stick out a mile. Good."], ["me", "Flour plus a rolling pin makes pastry, right? Let's make some MONSTER pastry!"]],
  "w4-s4": [["n", "One more stray Crumblet in Tin Can Alley! And something big lurks around the corner!"], ["me", "That's stray number four for me. I'm not counting! I'm just good at numbers."], ["me", "Behind me, kid. The pots go boom, and then the big guy goes down."]],
  "w4-s6": [["foe", "Caw... the scroll's that way, fuzzy. Not that I'm helping! Just saying! Caw!"], ["me", "Got a spare muffin cup back home, y'know. If a crow ever wanted one."], ["foe", "C-caw?! I mean, CAW. Whatever. Maybe."]],
  "w4-s7": [["me", "The last secret key's up on a sponge ledge. Here we go again. Hmph."], ["me", "Noodle Lurkers hiding under the pasta? Noodles don't lurk. Noodles are DINNER. Grrr."]],
  "w4-s8": [["me", "Honey! Ooh, there's honey everywhere! Bears LOVE honey..."], ["me", "Nope! Focus! Forty-five seconds of monsters first, honey after. Okay, maybe one lick during."]],
  "w4-s9": [["n", "Squeak! A tiny, sticky squeak floats down from the Top Shelf!"], ["mold", "Hehehe! Last little crumb, bear. Can I keep it? The Sink has room for everyone."], ["me", "Hold on, Littlest! Papa's climbing!"]],

  // World 5: The Sink.
  "w5-s2": [["me", "My Crumblets would ride these suds all day long. Nobody tell 'em about this place either."], ["n", "Uh-oh! A giant rolling pin comes rumbling down the suds!"], ["me", "Bears don't run. We JOG. Real fast. GO GO GO!"]],
  "w5-s3": [["me", "The gates are locked and here come three waves? Pfft. I've done bath time with six muffins."], ["me", "Pull that lever, drop the pin, and these monsters get washed up for good. Grrr!"]],
  "w5-s4": [["n", "A lost Crumblet wobbles on Dish Rack Ridge, between two giant plates!"], ["me", "C'mere, kid. Grab a handful of fur. That's stray number five, and these plates bite back."], [0, "Ooh, Bluebeary! Need a babysitter? I'm medium class now!"]],
  "w5-s6": [["me", "Recipe Scroll at the far end, seventy-five seconds, and the floor moves by itself? Lazy floors. Hmph."], ["me", "Bubbles keep popping on my nose. It's not funny! Okay, it's a little funny."]],
  "w5-s7": [["me", "The key's in a chest way up high, and the only way up is a bouncy sponge. I don't bounce."], ["me", "BOING! Wheee! AHEM. Nobody saw that. Nobody saw ANYTHING."]],
  "w5-s8": [["me", "These greasy pans need a good scrub. So do the monsters. Forty-five seconds, let's go!"], [11, "Beep beep! Watch the taps, Bluebeary! When they pour, they BLAST ya!"], ["me", "I know how taps work, raptor. ...Thanks."]],
  "w5-s9": [["me", "Sniff sniff. Down this drain smells like a fridge nobody's cleaned in years."], ["mold", "Hehehe... come down, bear. Is anybody counting YOU?"], ["me", "Six little somebodies do. Every single night. GRRR."]],

  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Crumbs all over the placemats, and they're stale ones. Not one of 'em is my Littlest."], ["n", "Uh-oh! A giant rolling pin comes rolling across the placemats!"], ["me", "Remember the jogging? Time for a FASTER jog! GRRR!"]],
  "w6-s3": [["me", "Ow! Hot wax from the candles drips right into the fur! Who lights this many candles?!"], ["me", "There's a lever up top. Drop that pin on the monsters, and I'll get a minute to grumble in peace."]],
  "w6-s4": [["n", "Gravy Boat Bay! A tiny Crumblet waves from a gravy boat. It's the Littlest!"], ["me", "LITTLEST! Found ya! You still wanna see the world? Fine. We'll see it together. Stay close."], ["me", "And that's stray number six! Well, this one's mine, so it counts double."]],
  "w6-s6": [["me", "The Littlest wants a tea party in these giant teacups. After the scroll, kid."], ["lo2", "Forsooth, a bear at tea! Mind thy elbows, furry oaf! Pinkies UP!"], ["me", "This pinky's for squashing, breadstick."]],
  "w6-s7": [["me", "Another key up on a high ledge. Another bouncy sponge. I STILL don't bounce."], ["me", "BOING! ...The Littlest says do it again. ONE more. Hmph."]],
  "w6-s8": [["me", "Fork Soldiers, huh? Cute. I brought my own forks. Ten of 'em. They're called claws."], [11, "Beep beep! Table for two, Bluebeary? I'll take the knives, you take the forks!"], ["me", "Deal, raptor. Forty-five seconds, go!"]],
  "w6-s9": [["me", "The Littlest thinks this chandelier is a sparkly tree. A sparkly tree full of monsters, kid."], ["lo2", "Hahaha! Climb, bear! At the Head of the Table, thy crumbs shall be my croutons!"], ["me", "Count your crumbs, breadstick. You're about to lose a few. Grrr."]],

  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "The Littlest thinks this hose is a big green snake. It's a hose, kid."], ["n", "Uh-oh! A giant rolling pin comes rumbling down the hose!"], ["me", "Okay, THAT bites! Hold on to my ear! GRRR!"]],
  "w7-s3": [["me", "FWOOSH! Sprinklers! Now my fur's all soggy. The Littlest LOVED that. I did not."], ["me", "Let's flatten these Sprout Soldiers with the rolling pin up top. I'll dry off. Eventually."]],
  "w7-s4": [["n", "Paddling Pool Pier! A tiny Crumblet drifts by on a pool noodle, totally lost!"], ["me", "Seventh stray this trip. Littlest, say hi to your new buddy. And no splashing!"], ["me", "Okay, ONE splash. Then we walk it to the exit."]],
  "w7-s6": [["me", "Scroll's at the far end of the picnic table, and the Littlest wants potato salad. After, kid."], ["lo2", "Hah! Baron Brussels shall grill thee RARE, bear!"], ["me", "Rare? I'm a muffin. I come out golden. Grrr."]],
  "w7-s7": [["me", "Key on a high ledge, sponge right under it. Do I bounce now? I guess I bounce now."], [9, "Ooh, a bear! Have we met? Elephants never forget! *POP* Who are you again?"], ["me", "Bluebeary. Again. Hold the sponge still, big guy. BOING!"]],
  "w7-s8": [["me", "Hot tempers in a cold cooler, and most of 'em are mine. Forty-five seconds, let's go."], [18, "In THIS corner, the grumpy papa bear! Ding ding! Swing for the muffin top!"], ["me", "Already swinging!"]],
  "w7-s9": [["me", "Littlest, stay up on my ear. These hot coals are for paws only. Ow, ow, OW!"], ["n", "From the Grill Summit, a voice booms: \"ATTEN-TION! That muffin will make a FINE Sprout Soldier!\""], ["me", "My muffin's already got a job. Being little. GRRR."]],

  // World 8: The Garden.
  "w8-s2": [["me", "The Littlest says this watering can is a giant teapot. Y'know, it kinda is."], ["n", "Uh-oh! A giant rolling pin comes rumbling off the watering can!"], ["me", "Jog, Papa, JOG! Hold the ear, kiddo! GRRR!"]],
  "w8-s3": [["me", "Ah... ACHOO! Sunflower pollen, right up my snout. The Littlest thinks it's hilarious."], ["me", "Okay, it's a little funny. Now let's drop that pin on some monsters so I can find a tissue."]],
  "w8-s4": [["n", "Pumpkin Patch Path! A tiny Crumblet is hiding inside a hollow pumpkin!"], ["me", "C'mon out, kiddo. You're stray number eight. Littlest, no, we're NOT keeping the pumpkin."], ["me", "Okay, ONE pumpkin seed. Stay close, Potato Moles pop up outta nowhere around here."]],
  "w8-s6": [["me", "The scroll's at the top of a beanstalk? Bears don't climb beans. Bears climb TREES."], ["lo2", "Hah! The Meatloaf shall stuff thee, bear! Thou art the mystery ingredient!"], ["me", "The only mystery is how many teeth you'll have left. Grrr."]],
  "w8-s7": [["me", "Pee-yew! This compost smells like the bottom of the muffin tin. Key's up on a high ledge."], [12, "Heyyy, papa bear. *yaaawn* Wanna nap on the compost? It's warm. Super chill."], ["me", "Key first, sloth. BOING! The Littlest wants another go. Of course it does."]],
  "w8-s8": [["me", "Forty-five seconds by the scarecrow, and the Littlest is scared of it. It's a hat on a stick, kid!"], [16, "Stay frosty, little muffin. Cool, cool, cool. Is that sun hot? I'm fine. Totally not melting."], ["me", "You're dripping mint all over the place, turtle. Get behind me. Hmph."]],
  "w8-s9": [["me", "A whole house made of glass. Littlest, no tapping on the windows."], ["n", "From the Mystery Heap, a voice rumbles: \"Is that a MUFFIN? Am I part muffin?! I could be!\""], ["me", "Nope. You're a no-eat food. GRRR."]],

  // World 9: The Supermarket.
  "w9-s2": [["me", "The Littlest wants a trolley ride. We had one, kid! You slept through the whole thing."], ["n", "Uh-oh! A giant rolling pin comes rumbling down the aisle!"], ["me", "Clean-up on aisle FAST! Hold the ear! GRRR!"]],
  "w9-s3": [["me", "These cereal boxes are taller than trees. Like I always say, never trust a box."], ["me", "One pin drop later, those monsters are flat, and I'm keeping the free toy inside."]],
  "w9-s4": [["n", "Fruit and Veg! A tiny Crumblet is hiding in the blueberry punnets. Sneaky camouflage!"], ["me", "Stray number nine, c'mon out. No, Littlest, we're NOT buying it a grape."], ["me", "Okay, ONE grape. Stay close, the Bruised Bananas cartwheel outta nowhere."]],
  "w9-s6": [["me", "Mmm, this bakery smells like muffins. The Littlest says it smells like cousins."], ["lo2", "Hah! The day-old shelf awaits thy crumbs, bear! Half price!"], ["me", "My crumbs are priceless, breadstick. Grrr."]],
  "w9-s7": [["me", "Key on a high ledge again. If I see one more bouncy sponge, I'm gonna growl at it."], [14, "Let's GOOO, papa bear! Bounce against gravity! That's how I swim upstream!"], ["me", "BOING! ...Fine. ONE more, Littlest. Just one."]],
  "w9-s8": [["me", "A conveyor belt full of monsters? Somebody ring 'em up! Forty-five seconds!"], [11, "Beep beep! Express lane, Bluebeary! Ten monsters or less! Wait, that's like fifty!"], ["me", "You bag 'em, raptor. I'll do the scanning. With my paws."]],
  "w9-s9": [["me", "Brrr! Littlest, get under the fur. Blueberries go hard in the cold."], ["n", "From the Back Aisle, a spooky voice wails: \"Woooo! Is that a muffin? I'll keep it in a TUB!\""], ["me", "Nobody keeps my muffins but me. GRRR."]],

  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "No, kid, you can't lick the jam. That jam's older than I am."], ["n", "Uh-oh! A giant rolling pin comes rumbling off the jam jars!"], ["me", "Last jog, I promise! Hold the ear! GRRR!"]],
  "w10-s3": [["me", "Noodle boxes stacked to the ceiling! Somebody never cleans this fridge."], ["me", "Let's drop that pin on these monsters. Maybe I'll find a fortune cookie in the mess."]],
  "w10-s4": [["n", "Frost Drawer Falls! A tiny Crumblet shivers on an ice cube. The very last stray in the House!"], ["me", "Stray number ten, the very last one. C'mere, kiddo. Littlest, scoot over on the ear."], ["me", "Two on one ear is getting crowded. The ear's FINE. Don't worry about the ear."]],
  "w10-s6": [["me", "Scroll's at the far end, and the Littlest wants a paper chain. After, kid."], ["lo2", "Hah! Thy crumbs shall be the party favors, bear!"], ["me", "Party's over for you, breadstick. Grrr."]],
  "w10-s7": [["me", "Last key, last high ledge, last bouncy sponge. I still don't bounce. Officially."], [12, "Heyyy, papa bear. *yaaawn* Last bounce, dude. Make it count."], ["me", "BOING! The Littlest says do it again. No. ...Okay, ONE more."]],
  "w10-s8": [["me", "Every monster in the House, and one bear in the way. Forty-five seconds, let's dance."], [11, "Beep beep! Bluebeary! Bus fund's FULL! After this, everybody rides home!"], ["me", "Then let's earn the ride, raptor. GRRR!"]],
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
