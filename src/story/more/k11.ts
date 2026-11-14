// Pizzaraptor: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["n", "Rush hour! Crumb Trail is jam-packed with monsters!"], ["me", "Minute four and I'm already stuck in a monster jam! Beep beep! Outta the way!"], ["me", "And Sir Butterknife at the end? Raptor Express doesn't need cutlery. I've got CLAWS! Vroom!"]],
  "w1-s3": [["me", "Minute seven and it's all gummy in here! Do NOT get gummy on the box. Do NOT."], ["me", "Rolling Pin Rogue at the end? Special delivery: one claw, right to his door! No signature needed!"]],
  "w1-s4": [["n", "Tug, tug! A little lost Crumblet is pulling on the pizza box."], ["me", "Aw, kiddo, I'm on the clock! Ugh, okay, fine! Hop on. One passenger. Mind the cheese!"], ["me", "Burners ahead, then King Sour Worm. Hot, angry and about to blow. Kinda like my manager!"]],
  "w1-s6": [["me", "Pick-up order: one Recipe Scroll, way up high, before time runs out! Express service!"], ["me", "Then the Toaster Tyrant? A toaster, for a pizza? Nope. This pie's already hot!"]],
  "w1-s7": [["me", "Minute eighteen, and the air's full of pepper. Pepperoni's cousins live here! Awk-ward!"], ["me", "Secret key on a sponge ledge? Ooh, a shortcut! Shortcuts are my favorite thing EVER!"]],
  "w1-s8": [["me", "Hold out forty-five seconds? Pfft! I do thirty MINUTES for a living!"], [5, "Heh. Nice box, raptor. Shame if somebody... borrowed it."], ["me", "Hands off, Toastbat! Paying customers only! And that goes double for King Pepper Grunt!"]],
  "w1-s9": [["me", "Minute twenty-six, and look at those burners! Great for warm cheese, terrible for raptors. Yowch!"], ["mold", "Mmm, pizza! Leave it out a while, little courier. Let it grow a nice green crust. Hehehe!"], ["me", "Ew, gross! That's a ONE-star review from me!"]],

  // World 2: The Fridge
  "w2-s2": [["me", "Minute thirty-one. I'm LATE! First time in my whole career! Aaaugh!"], ["me", "Wait, the customer's missing. So technically the customer's later than me! Phew!"], ["n", "Slippery ice ahead, and the Ice Cube Ogre is parked at the end!"]],
  "w2-s3": [["me", "Brrr! If this box freezes, I'm delivering a pizza-shaped skateboard!"], ["me", "Watch the lunchboxes! Anything that wants to be opened THAT bad is suspicious."]],
  "w2-s4": [["n", "Uh-oh! Another lost Crumblet, shivering on Pickle Jar Pier!"], ["me", "Kiddo! Sit on the box, it's warm. Don't eat it. Seriously! Don't eat it!"], ["me", "Next stop, King Milk Carton Rammer! Free escort service, just this once! Shh, don't tell Dispatch."]],
  "w2-s6": [["me", "Recipe Scroll pick-up on Egg Carton Cliffs! Way up high, and the clock's ticking!"], ["me", "Ooh, maybe the Chef wrote their address on it! A raptor can dream!"]],
  "w2-s7": [["me", "Ooh, a butter bridge! Perfect for drifting! Wheee... focus, raptor, FOCUS!"], ["me", "There's a key to a secret stage on a hidden ledge. Secret stage? Secret SHORTCUT. Probably!"]],
  "w2-s8": [["me", "Tons of sauce and zero pizza? Wrong condiment, people!"], [6, "Halt, courier! Hear ye! Is that pizza a tribute for the Lord of Leftovers?"], ["me", "Only if you're the Head Chef, Your Doughiness! Now help me hold this canyon!"]],
  "w2-s9": [["n", "The Leftover Lasagna Lich waits at the top of the Ice Tray Steps, and he HATES fresh food!"], ["me", "A lich?! Okay, special delivery: one slice of CLAW! Hi-yah!"]],

  // World 3: The Oven
  "w3-s2": [["me", "The Oven! Box on the rack, cheese bubbling. Ding! Reheat complete!"], ["me", "Minute fifty-eight. I've stopped telling Dispatch. Dispatch doesn't need to know."]],
  "w3-s3": [["me", "Twelve muffin cups that look exactly the same! Who designs these addresses?!"], ["me", "If a lunchbox looks THAT tasty, it's lying. And it BITES."]],
  "w3-s4": [["n", "A Crumblet waves a tiny flag on Casserole Cliffs. It needs a ride!"], ["me", "Raptor Express Kids' Edition, back by popular demand! Hop on! Mind the steam vents!"]],
  "w3-s6": [["foe", "Pineapple Pete Express is grabbing that scroll first, raptor! Tropical speeeed!"], ["me", "You lost at Meatball Mountain, Pete! Go home and think about your toppings!"], ["foe", "Hey! My toppings are GREAT!"]],
  "w3-s7": [["me", "Roasting pans, steam vents, and a Souffle Sorcerer at the end? Hot route!"], ["me", "And a key past the end of the pass. Sponge-jumping over steam? Ooh, love that for me. NOT!"]],
  "w3-s8": [["me", "A PIZZA STONE! This is basically my ancestral homeland! Hi, Grandma!"], ["me", "Hold out, then King Kettle Turret. Pizza party, monster edition! KA-BLAM!"]],
  "w3-s9": [["me", "Something up top keeps rumbling \"PIZZAAA\" in a big dragon voice. Gulp!"], ["mold", "Hehehe! Every hungry thing in this kitchen is mine, little courier. Even the dragons."], ["me", "Then it can wait in line like everybody else! Take a number, buddy!"]],

  // World 4: The Pantry
  "w4-s2": [["me", "Minute one hundred and twelve. If anyone asks, it was a really slow oven. Ahem."], ["me", "Breakfast cereal at dinner time, with tin cans falling from the sky? My schedule's a mess!"]],
  "w4-s3": [["n", "A lunchbox sits in the flour, grinning a little TOO wide!"], ["me", "Flour, a biting lunchbox, and a Cereal Box Colossus? Somebody's getting turned into a pizza base! Hehe!"]],
  "w4-s4": [["n", "One last lost Crumblet, sitting on a tin can!"], ["me", "Climb aboard, kiddo! Passenger number four! I should really buy a bus."], ["me", "Rule of the road: tin cans fall, raptors swerve. King Noodle Lurker, beep beep!"]],
  "w4-s6": [["me", "Oregano, basil, chilli flakes... it's a pizza's spice rack! I'm HOME!"], ["foe", "Psst. Raptor. Scroll's that way. What? Even a rival can give directions!"], ["me", "Huh! Thanks, Pete. Five-star rival!"]],
  "w4-s7": [["me", "Pasta jars! Pizza and pasta, together at last! The dream team!"], ["me", "Last secret key's on a sponge ledge. Raptor Express delivers to hard-to-reach places! Boing!"]],
  "w4-s8": [["me", "Holding out... in HONEY?! My claws are gonna be SO sticky!"], [10, "Hmph. You're still lugging that box around?"], ["me", "A delivery's a promise, Bluebeary! Like you and your Crumblets!"]],
  "w4-s9": [["me", "Minute, uh... let's say thirty and never talk about it again. Deal?"], ["me", "The box is kinda warm and the customer's still missing. Eh! Up we go! Beep beep!"]],

  // World 5: The Sink.
  "w5-s2": [["me", "Wheee! Soap makes EVERYTHING go faster! This is my new favorite road!"], ["n", "Uh-oh! The Sponge Golem is soaking at the bottom of the slide, blocking the road!"], ["me", "A road block?! Beep beep, eat my bubbles!"]],
  "w5-s3": [["me", "Exit wants Rubber Fingers? Grabby Gloves, hand 'em over! Literally!"], ["me", "Plunger Paladin at the end? Open up, I've got a claw with your name on it! No tip required!"]],
  "w5-s4": [[10, "Hmph. Raptor. Stray Crumblet on Dish Rack Ridge. Gonna need your bus."], ["me", "Passenger number five! Climb aboard, kiddo! I am SO buying a bus after this."], [10, "Hmph. I'll chip in."]],
  "w5-s6": [["me", "Scroll pick-up way up high, before time runs out! Bubble Bay express, GO!"], ["me", "Hey, quit popping on the box! It's a pizza, not a bubble bath!"]],
  "w5-s7": [["me", "Secret chest on a hidden ledge, and a bouncy sponge to get there? My kind of elevator!"], ["me", "World 5 key, here I come! Raptor Express delivers to EVERY floor!"]],
  "w5-s8": [["me", "Who leaves pans THIS greasy? One star for the dishwasher!"], ["foe", "Psst, raptor! Lure 'em under the taps! SPLOOSH! What? I'm on the clock too!"], ["me", "Pete! You're helping?! Hold out, then King Grabby Glove! Let's ROLL!"]],
  "w5-s9": [["me", "Going down! Next stop: the customer! *gulp*"], ["mold", "Hehehe... down, down, little courier. Your pizza's getting cold. And cold pizza is MINE."], ["me", "Cold pizza is a breakfast classic, and you're NOT invited!"]],

  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Minute four! Flat placemats, zero traffic. Wait, what's that rumble?"], ["n", "Uh-oh! The Gravy Boat Captain's Rammers come zooming across the placemats!"], ["me", "Gravy boats in MY lane? You want this pizza? Get in LINE! Beep beep, VROOM!"]],
  "w6-s3": [["me", "Hot wax? Keep it OFF the box! Splat-free delivery, people!"], ["me", "Teapot Tyrant at the end? Express to your spout, buddy!"]],
  "w6-s4": [[10, "Hmph. Raptor. Lost Crumblet in Gravy Boat Bay. Wanted to see the world. Bus it through."], ["me", "Passenger number six! Hey, did ya chip in for that bus yet, Bluebeary?"], [10, "Hmph. Check's in the mail."]],
  "w6-s6": [["me", "A fancy tea party with zero tips? Typical. Okay, grab the Recipe Scroll before time runs out!"], ["lo2", "Forsooth! Thy feast is LATE, courier! A knight hateth tardiness!"], ["me", "Late?! It's minute fourteen! That's EARLY for me!"]],
  "w6-s7": [["me", "Another secret chest! Raptor Express takes the sponge elevator! Boing!"], ["me", "World 6 key, delivered right to MY pocket. Tip yourself, raptor!"]],
  "w6-s8": [["me", "Holding out, and every fork in the house wants a bite of this pizza!"], [5, "Heh. Nice feast box, raptor. Shame if it walked off."], ["me", "Hands off, Toastbat! It's a paid order! Well, a promised order!"]],
  "w6-s9": [["me", "The Head of the Table is up past that chandelier. Customer's that way!"], ["lo2", "Hahaha! Bring me my feast, courier! And let it be STALE as a tombstone!"], ["me", "Sorry, pal! Raptor Express only delivers HOT! Beep beep!"]],

  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "Minute twenty-three! A long green hose and no tolls! I love it!"], ["n", "Uh-oh! A Hot Coal Golem is blocking the end of the hose!"], ["me", "Hot coals? Keeps the pizza warm! Still, get outta my lane! Beep beep, VROOM!"]],
  "w7-s3": [["me", "FWOOSH! Sprinklers?! Free air mail! Keep the box DRY, people!"], ["me", "And the Spatula Sheriff at the end? Flip THIS, sheriff!"]],
  "w7-s4": [[10, "Hmph. Raptor. Lost Crumblet on Paddling Pool Pier. Bus it through."], ["me", "Passenger number seven! Kiddo, a pool is NOT a bus stop. All aboard!"], [10, "Bus fund's growing. Got two crumbs and a button. Hmph."]],
  "w7-s6": [["me", "A whole picnic buffet?! Focus, raptor! Scroll first, before time runs out!"], ["lo2", "Hah! The Baron shall cook thy pizza WELL DONE, courier!"], ["me", "Rare, medium, well done? Nope! Pizza's DONE done!"]],
  "w7-s7": [["me", "Flowerpots stacked like a tower, and a secret chest past the end. Going UP!"], [9, "Ooh, pizza! Did I order that? Elephants never forget! *POP* Wait, did I order that?"], ["me", "Sorry, big guy, it's spoken for! Here, have a coupon!"]],
  "w7-s8": [["me", "Holding out by a cooler? Great for drinks, TERRIBLE for pizza!"], [18, "In THIS corner, the fastest dino in the yard! Ding ding! Deliver a knockout!"], ["me", "Special delivery: one knuckle sandwich! Beep beep!"]],
  "w7-s9": [["me", "Hot rocks, hot box, hot raptor! Customer's up top!"], ["n", "A voice booms from the Grill Summit: \"ATTEN-TION, courier! Prepare to be SPROUTED!\""], ["me", "Sorry! Raptor Express doesn't do sprouts! Beep beep!"]],

  // World 8: The Garden.
  "w8-s2": [["me", "Minute thirty-six! Smooth road, zero traffic, nice breeze!"], ["n", "SNAP! The Snapdragon is waiting at the end of the run!"], ["me", "A flower with teeth?! Not on the menu! Get your own route, pal! VROOM!"]],
  "w8-s3": [["me", "Ah-CHOO! Sunflowers! Keep the pollen OFF the cheese, people!"], ["me", "Watering Can Wizard at the end? No sprinkling the box, buddy!"]],
  "w8-s4": [[10, "Hmph. Raptor. Lost Crumblet in the Pumpkin Patch. Bus it through."], ["me", "Passenger number eight! Ooh, Bluebeary, a big pumpkin! That's basically a bus with a stem!"], [10, "Bus fund's up to two crumbs, a button and a pumpkin seed. Hmph."]],
  "w8-s6": [["me", "The Recipe Scroll's at the top of a BEANSTALK? Who's writing these addresses?!"], ["lo2", "Hah! The Meatloaf shall gobble thy pizza AND thy scroll, courier!"], ["me", "Not without a receipt, he won't! Beep beep!"]],
  "w8-s7": [["me", "Pee-yew! Who left all these leftovers out? One star for the fridge!"], [12, "Heyyy, delivery dude. *yaaawn* Did I order a pizza? Like, last week?"], ["me", "Not from me, buddy! Boing! World 8 key, delivered to MY pocket!"]],
  "w8-s8": [["me", "Holding out by a scarecrow? Hey, Mr. Scarecrow, you look like my old manager!"], [16, "Stay frosty, raptor. Got anything cold in that box? Asking for a turtle. Is it hot out here?"], ["me", "Sorry, pal, HOT deliveries only! Shade's free, though!"]],
  "w8-s9": [["me", "Glass everywhere! Customer's up top. Keep the box level!"], ["n", "From the Mystery Heap, a voice rumbles: \"Is that PIZZA? Is there pizza in ME?! I gotta check!\""], ["me", "Nobody's checking ANYTHING till they tip! Beep beep!"]],

  // World 9: The Supermarket.
  "w9-s2": [["me", "Minute forty-two! Smooth aisles and a whole trolley lane! Love it!"], ["n", "Uh-oh! The Trolley Chariot comes rumbling down the aisle!"], ["me", "A chariot in a SUPERMARKET? Tailgater! Get your own lane! Beep beep, VROOM!"]],
  "w9-s3": [["me", "Breakfast boxes at pizza o'clock? My schedule's still a mess!"], ["me", "Coupon Ghosts, hand over those coupons! Then the Cash Register Golem! Ka-ching!"]],
  "w9-s4": [[10, "Hmph. Raptor. Lost Crumblet in Fruit and Veg. Bus it through."], ["me", "Passenger number nine! Ooh, Bluebeary, they sell trolleys! That's basically a bus with a basket!"], [10, "Bus fund's up to two crumbs, a button, a seed and a grape. Hmph."]],
  "w9-s6": [["me", "Ooh, garlic bread! No, no, focus! Recipe Scroll first, before time runs out!"], ["lo2", "Hah! Thy pizza shall be day-old ere it arriveth, courier!"], ["me", "Day-old pizza is still PIZZA, pal! Beep beep!"]],
  "w9-s7": [["me", "A secret chest past the cans? Sponge elevator, take me UP!"], [3, "Wibble wobble! Is that pizza for the dessert table? Am I invited? Please say I'm invited!"], ["me", "Wrong menu, jelly! Here, have a coupon! Boing! World 9 key, delivered!"]],
  "w9-s8": [["me", "Holding out at the checkout? Finally, a queue that moves FOR me!"], [14, "Let's GOOO, raptor! Swim against the rush! It's o-fish-ally the best workout!"], ["me", "Against traffic?! That's a ticket, buddy! Beep beep!"]],
  "w9-s9": [["me", "Brrr! The freezer aisle?! Hang in there, pizza box! Think toasty oven thoughts!"], ["n", "From the Back Aisle, a spooky voice wails: \"Woooo! Is that PIZZA? Into the tub it goes!\""], ["me", "Nope! Hot deliveries only! No tub, no tip, NO way!"]],

  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Minute forty-four! Sticky jam road, but I've got grippy claws!"], ["n", "BLOOP! A bowl of Forgotten Soup is waiting at the end of the jars!"], ["me", "Soup? That's not on the order! Swerve! Beep beep, VROOM!"]],
  "w10-s3": [["me", "Old takeaway boxes everywhere! Rival delivery companies?! Unacceptable!"], ["me", "And a Banquet Butler at the end? Sorry, pal. I'M the one who serves around here!"]],
  "w10-s4": [[10, "Hmph. Raptor. Last stray Crumblet in the House, out on Frost Drawer Falls. Bus it through."], ["me", "Passenger number TEN! Final stop! Bluebeary, how's the bus fund?"], [10, "Two crumbs, a button, a seed, a grape and an IOU. Hmph. It's a bus."]],
  "w10-s6": [["me", "Ooh, party streamers! Grab the Recipe Scroll before time runs out!"], ["lo2", "Hah! Paper chains for a forgotten feast, courier! Not one guest hath RSVP'd!"], ["me", "I RSVP'd! I'm the DELIVERY! Beep beep!"]],
  "w10-s7": [["me", "Final secret chest, way past the end of the shelf. Last elevator ride, folks!"], [9, "Ooh, pizza! Elephants never forget! *POP* Hey, it's the pizza from the Dining Room!"], ["me", "You REMEMBERED?! Big guy, that's a five-star memory! Boing!"]],
  "w10-s8": [["me", "Holding out against EVERY monster?! It's rush hour at the end of the world!"], ["foe", "Raptor! I'm on traffic control! Pineapple barricade, deployed!"], ["me", "Pete! Pineapple on the ROAD is finally allowed! Beep beep!"]],
  "w10-s9": [["me", "Delivery address confirmed! Wow, that's one LONG, EMPTY table."], ["n", "From the cake-tin throne, a voice grumbles: \"Bring it here, lizard. And don't expect a TIP.\""], ["me", "Customer's in! Keep the box level, raptor. Last fifty feet!"]],

  // World 11: The Midway.
  "w11-s2": [["me", "Minute two! Knock over three pizza boxes, win a prize? Those boxes are NAILED DOWN! I know boxes, people! One star!"], ["n", "Uh-oh! A Pretzel Contortionist is posing in a knot, smack in the middle of the boulevard!"], ["me", "Double parked AND tied in a knot?! That's a ticket, twisty! Beep beep, VROOM!"]],
  "w11-s3": [["me", "Minute three! A prize box by the ring toss? Maybe it's a tip! OW! It's a BITER! Return to sender!"], ["me", "And the Gumball Gunner wants a coin just to go Ka-Chunk? Raptor Express has a ride-through window, buddy! Coming THROUGH!"]],
  "w11-s4": [[10, "Hmph. Raptor. One of mine hopped off the string in Bumper Car Bay. It's MINE this time. Bus it to the exit. Carefully."], ["me", "Passenger number eleven! All aboard, kiddo, seatbelt on! Those Bumper Cupcakes never signal, and their King's the worst of 'em!"], [10, "Bus is paid off. Now I'm saving up for a horn. Hmph."]],
  "w11-s6": [["me", "Minute five! Pick-up order: one Recipe Scroll, top of the prize shelf, and the clock's ticking! My FAVORITE kind of clock!"], ["me", "And the Fry Basket Brawler keeps yelling \"Order Up!\" That's MY line, grease-bucket! Get your own catchphrase!"]],
  "w11-s7": [["me", "Minute six! Whoa, in this mirror the pizza's EXTRA large! In that one it's a breadstick. Do NOT show the customer!"], ["me", "Secret key chest on a hidden ledge? Sponge elevator, going up! Carousel Macaron Pony, no horsing around in my lane! Boing!"]],
  "w11-s8": [["lo2", "Have at thee, coconut! Courier, thou art in good time! Fetch me my lance, my shield and one large pepperoni!"], ["me", "You're ORDERING?! The coconuts throw BACK, pal, King Coconut Shy Lobber's up next, and here comes a whole rush hour!"], ["lo2", "Then we hold the lists together! And forsooth, this time I shall TIP! Which coin is a tip?"]],
  "w11-s9": [["me", "Minute seven! The big doughnut wheel! No lift, no ramp, just claws! And the big top's right past it! Hup hup!"], ["n", "The loudspeaker crackles: \"Step right up, speedy lizard! Late again? Every clock on MY Midway runs fast! Ta-daa!\""], ["me", "He rigged the CLOCKS?! That's LOW! And Bonbon the Cannonball gets a CANNON? Even he's got faster shipping than me!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Express combo! Extra cheese!", "Beep beep! Coming through!", "Slice! Slice! SLICE!"],
  lowhp: ["Box is fine! I'm... less fine!", "Pit stop! Sauce leak!", "Ugh! Keep the cheese hot!"],
  perfect: ["Swerve! Traffic dodged!", "Missed me! I'm EXPRESS!", "Whoa, pothole! Dodged it!"],
  levelup: ["Promotion! Senior Raptor!", "Faster wheels! Er, feet!", "Level up! Tip jar's growing!"],
  secret: ["Bonus tip? Don't mind if I do!", "Secret stash! Shortcuts pay!", "Ooh, a hidden drop-off!"],
  boom: ["Special delivery: KA-BOOM!", "Rolled flatter than a crust!", "Delivered! Splat on arrival!"],
  mimic: ["Ew! This box isn't pizza!", "Return to sender! It BITES!", "Wrong order! WRONG ORDER!"],
  objective: ["Delivered! Sign here!", "Order up! Five stars, baby!", "Under thirty sec... er, DONE!"],
};
