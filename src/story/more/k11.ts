// Pizzaraptor: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["n", "Rush hour! Crumb Trail is jam-packed with monsters!"], ["me", "Minute four and I'm already stuck in a monster jam! Beep beep! Outta the way!"], ["me", "Raptor Express doesn't SIT in traffic. Raptor Express IS the traffic! Vroom!"]],
  "w1-s3": [["me", "Minute seven and it's all gummy in here! Do NOT get gummy on the box. Do NOT."], ["me", "Ladle lever up top? Special delivery: one rolling pin, right to their door! No signature needed!"]],
  "w1-s4": [["n", "Tug, tug! A little lost Crumblet is pulling on the pizza box."], ["me", "Aw, kiddo, I'm on the clock! Ugh, okay, fine! Hop on. One passenger. Mind the cheese!"], ["me", "Pressure cookers ahead. Hot, angry and about to blow. Kinda like my manager!"]],
  "w1-s6": [["n", "Click! The lights go out over the Spice Shelf, and the monsters get bolder!"], ["me", "Pick-up order: one Recipe Scroll, far end, seventy-five seconds! Plus a night surcharge, obviously."]],
  "w1-s7": [["me", "Minute eighteen, and the air's full of pepper. Pepperoni's cousins live here! Awk-ward!"], ["me", "Secret key on a sponge ledge? Ooh, a shortcut! Shortcuts are my favorite thing EVER!"]],
  "w1-s8": [["me", "Hold out forty-five seconds? Pfft! I do thirty MINUTES for a living!"], [5, "Heh. Nice box, raptor. Shame if somebody... borrowed it."], ["me", "Hands off, Toastbat! Paying customers only!"]],
  "w1-s9": [["me", "Minute twenty-six, and look at those burners! Great for warm cheese, terrible for raptors. Yowch!"], ["mold", "Mmm, pizza! Leave it out a while, little courier. Let it grow a nice green crust. Hehehe!"], ["me", "Ew, gross! That's a ONE-star review from me!"]],

  // World 2: The Fridge
  "w2-s2": [["me", "Minute thirty-one. I'm LATE! First time in my whole career! Aaaugh!"], ["me", "Wait, the customer's missing. So technically the customer's later than me! Phew!"]],
  "w2-s3": [["me", "Brrr! If this box freezes, I'm delivering a pizza-shaped skateboard!"], ["me", "Watch the lunchboxes! Anything that wants to be opened THAT bad is suspicious."]],
  "w2-s4": [["n", "Uh-oh! Another lost Crumblet, shivering on Pickle Jar Pier!"], ["me", "Kiddo! Sit on the box, it's warm. Don't eat it. Seriously! Don't eat it!"], ["me", "Exit's past the pressure cookers. Free escort service, just this once! Shh, don't tell Dispatch."]],
  "w2-s6": [["me", "Recipe Scroll pick-up on Egg Carton Cliffs! Seventy-five seconds there, then guard it for twenty-five!"], ["me", "Ooh, maybe the Chef wrote their address on it! A raptor can dream!"]],
  "w2-s7": [["me", "Ooh, a butter bridge! Perfect for drifting! Wheee... focus, raptor, FOCUS!"], ["me", "There's a key to a secret stage on a high ledge. Secret stage? Secret SHORTCUT. Probably!"]],
  "w2-s8": [["me", "Tons of sauce and zero pizza? Wrong condiment, people!"], [6, "Halt, courier! Hear ye! Is that pizza a tribute for the Lord of Leftovers?"], ["me", "Only if you're the Head Chef, Your Doughiness! Now help me hold this canyon!"]],
  "w2-s9": [["n", "Whoa! The Ice Tray Steps are swarming, with a monster on every cube!"], ["me", "It's like delivering to a whole stadium! Okay, everybody gets a slice. A slice of CLAW! Hi-yah!"]],

  // World 3: The Oven
  "w3-s2": [["me", "The Oven! Box on the rack, cheese bubbling. Ding! Reheat complete!"], ["me", "Minute fifty-eight. I've stopped telling Dispatch. Dispatch doesn't need to know."]],
  "w3-s3": [["me", "Twelve muffin cups that look exactly the same! Who designs these addresses?!"], ["me", "If a cereal box says \"part of a balanced breakfast\", it's lying. And it BITES."]],
  "w3-s4": [["n", "A Crumblet waves a tiny flag on Casserole Cliffs. It needs a ride!"], ["me", "Raptor Express Kids' Edition, back by popular demand! Hop on! Stay low, the cookers are hot!"]],
  "w3-s6": [["foe", "Pineapple Pete Express is grabbing that scroll first, raptor! Tropical speeeed!"], ["me", "You lost at Meatball Mountain, Pete! Go home and think about your toppings!"], ["foe", "Hey! My toppings are GREAT!"]],
  "w3-s7": [["n", "Fzzt! The oven light dies. Roasting Pan Pass goes dark as burnt crust!"], ["me", "No headlights, no problem! I can smell the route. Pepperoni's on the left, monster's on the right!"], ["me", "And a key up there somewhere. Sponge-jumping in the dark? Ooh, love that for me. NOT!"]],
  "w3-s8": [["me", "A PIZZA STONE! This is basically my ancestral homeland! Hi, Grandma!"], ["me", "Forty-five seconds. Lure 'em into the pressure cookers. Pizza party, monster edition! KA-BLAM!"]],
  "w3-s9": [["me", "Something up top keeps rumbling \"PIZZAAA\" in a big dragon voice. Gulp!"], ["mold", "Hehehe! Every hungry thing in this kitchen is mine, little courier. Even the dragons."], ["me", "Then it can wait in line like everybody else! Take a number, buddy!"]],

  // World 4: The Pantry
  "w4-s2": [["me", "Minute one hundred and twelve. If anyone asks, it was a really slow oven. Ahem."], ["me", "Breakfast cereal at dinner time with a lunch order? My schedule's a mess!"]],
  "w4-s3": [["n", "Flour Drifts! Uh-oh, the powder's crawling with a whole swarm of monsters!"], ["me", "Flour, a rolling pin and a pile of monsters? Somebody's getting turned into a pizza base! Hehe!"]],
  "w4-s4": [["n", "One last lost Crumblet, sitting on a tin can!"], ["me", "Climb aboard, kiddo! Passenger number four! I should really buy a bus."], ["me", "Rule of the road: pressure cookers have right of way. Also, they explode. Beep beep!"]],
  "w4-s6": [["me", "Oregano, basil, chilli flakes... it's a pizza's spice rack! I'm HOME!"], ["foe", "Psst. Raptor. Scroll's that way. What? Even a rival can give directions!"], ["me", "Huh! Thanks, Pete. Five-star rival!"]],
  "w4-s7": [["me", "Pasta jars! Pizza and pasta, together at last! The dream team!"], ["me", "Last secret key's on a sponge ledge. Raptor Express delivers to hard-to-reach places! Boing!"]],
  "w4-s8": [["me", "Forty-five seconds of waves... in HONEY?! My claws are gonna be SO sticky!"], [10, "Hmph. You're still lugging that box around?"], ["me", "A delivery's a promise, Bluebeary! Like you and your Crumblets!"]],
  "w4-s9": [["me", "Minute, uh... let's say thirty and never talk about it again. Deal?"], ["me", "The box is kinda warm and the customer's still missing. Eh! Up we go! Beep beep!"]],

  // World 5: The Sink.
  "w5-s2": [["me", "Wheee! Soap makes EVERYTHING go faster! This is my new favorite road!"], ["n", "Uh-oh! A giant rolling pin is rolling right behind the raptor!"], ["me", "Finally, somebody who wants to race! Beep beep, eat my bubbles!"]],
  "w5-s3": [["me", "Gates locked? RUDE! I've got a customer waiting!"], ["me", "Open up, monsters! I've got a rolling pin with your name on it! No tip required!"]],
  "w5-s4": [[10, "Hmph. Raptor. Stray Crumblet on Dish Rack Ridge. Gonna need your bus."], ["me", "Passenger number five! Climb aboard, kiddo! I am SO buying a bus after this."], [10, "Hmph. I'll chip in."]],
  "w5-s6": [["me", "Conveyor belts? Free express lanes! Scroll pick-up, seventy-five seconds, GO!"], ["me", "Hey, quit popping on the box! It's a pizza, not a bubble bath!"]],
  "w5-s7": [["me", "Secret chest on a high ledge, and a bouncy sponge right under it? My kind of elevator!"], ["me", "World 5 key, here I come! Raptor Express delivers to EVERY floor!"]],
  "w5-s8": [["me", "Who leaves pans THIS greasy? One star for the dishwasher!"], ["foe", "Psst, raptor! Lure 'em under the taps! SPLOOSH! What? I'm on the clock too!"], ["me", "Pete! You're helping?! Forty-five seconds, let's ROLL!"]],
  "w5-s9": [["me", "Going down! Next stop: the customer! *gulp*"], ["mold", "Hehehe... down, down, little courier. Your pizza's getting cold. And cold pizza is MINE."], ["me", "Cold pizza is a breakfast classic, and you're NOT invited!"]],

  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Minute four! Flat placemats, zero traffic. Wait, what's that rumble?"], ["n", "Uh-oh! A giant rolling pin is chasing the delivery dino!"], ["me", "You want this pizza? Get in LINE! Beep beep, VROOM!"]],
  "w6-s3": [["me", "Hot wax? Keep it OFF the box! Splat-free delivery, people!"], ["me", "Pin drop, coming up! Express to your face, monsters!"]],
  "w6-s4": [[10, "Hmph. Raptor. Lost Crumblet in Gravy Boat Bay. Wanted to see the world. Bus it to the exit."], ["me", "Passenger number six! Hey, did ya chip in for that bus yet, Bluebeary?"], [10, "Hmph. Check's in the mail."]],
  "w6-s6": [["me", "A fancy tea party with zero tips? Typical. Okay, grab the Recipe Scroll and hold out!"], ["lo2", "Forsooth! Thy feast is LATE, courier! A knight hateth tardiness!"], ["me", "Late?! It's minute fourteen! That's EARLY for me!"]],
  "w6-s7": [["me", "Another chest up high! Raptor Express takes the sponge elevator! Boing!"], ["me", "World 6 key, delivered right to MY pocket. Tip yourself, raptor!"]],
  "w6-s8": [["me", "Forty-five seconds, and every fork in the house wants a bite of this pizza!"], [5, "Heh. Nice feast box, raptor. Shame if it walked off."], ["me", "Hands off, Toastbat! It's a paid order! Well, a promised order!"]],
  "w6-s9": [["me", "The Head of the Table is up top of that chandelier. Customer's that way!"], ["lo2", "Hahaha! Bring me my feast, courier! And let it be STALE as a tombstone!"], ["me", "Sorry, pal! Raptor Express only delivers HOT! Beep beep!"]],

  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "Minute twenty-three! A long green hose and no tolls! I love it!"], ["n", "Uh-oh! A giant rolling pin comes barreling down the hose!"], ["me", "Tailgater! Get your own lane! Beep beep, VROOM!"]],
  "w7-s3": [["me", "FWOOSH! Sprinklers?! Free air mail! Keep the box DRY, people!"], ["me", "And look, a rolling pin up top. Hot off the press, monsters!"]],
  "w7-s4": [[10, "Hmph. Raptor. Lost Crumblet on Paddling Pool Pier. Bus it to the exit."], ["me", "Passenger number seven! Kiddo, a pool is NOT a bus stop. All aboard!"], [10, "Bus fund's growing. Got two crumbs and a button. Hmph."]],
  "w7-s6": [["me", "A whole picnic buffet?! Focus, raptor! Scroll first, then hold out!"], ["lo2", "Hah! The Baron shall cook thy pizza WELL DONE, courier!"], ["me", "Rare, medium, well done? Nope! Pizza's DONE done!"]],
  "w7-s7": [["me", "Flowerpots stacked like a tower, and a chest on top. Going UP!"], [9, "Ooh, pizza! Did I order that? Elephants never forget! *POP* Wait, did I order that?"], ["me", "Sorry, big guy, it's spoken for! Here, have a coupon!"]],
  "w7-s8": [["me", "Forty-five seconds by a cooler? Great for drinks, TERRIBLE for pizza!"], [18, "In THIS corner, the fastest dino in the yard! Ding ding! Deliver a knockout!"], ["me", "Special delivery: one knuckle sandwich! Beep beep!"]],
  "w7-s9": [["me", "Hot rocks, hot box, hot raptor! Customer's up top!"], ["n", "A voice booms from the Grill Summit: \"ATTEN-TION, courier! Prepare to be SPROUTED!\""], ["me", "Sorry! Raptor Express doesn't do sprouts! Beep beep!"]],

  // World 8: The Garden.
  "w8-s2": [["me", "Minute thirty-six! Smooth road, zero traffic, nice breeze!"], ["n", "Uh-oh! A giant rolling pin comes barreling off the watering can!"], ["me", "Tailgater AGAIN?! Get your own route, pal! Beep beep, VROOM!"]],
  "w8-s3": [["me", "Ah-CHOO! Sunflowers! Keep the pollen OFF the cheese, people!"], ["me", "There's a rolling pin up top. Farm to table, monsters!"]],
  "w8-s4": [[10, "Hmph. Raptor. Lost Crumblet in the Pumpkin Patch. Bus it to the exit."], ["me", "Passenger number eight! Ooh, Bluebeary, a big pumpkin! That's basically a bus with a stem!"], [10, "Bus fund's up to two crumbs, a button and a pumpkin seed. Hmph."]],
  "w8-s6": [["me", "The Recipe Scroll's at the top of a BEANSTALK? Who's writing these addresses?!"], ["lo2", "Hah! The Meatloaf shall gobble thy pizza AND thy scroll, courier!"], ["me", "Not without a receipt, he won't! Beep beep!"]],
  "w8-s7": [["me", "Pee-yew! Who left all these leftovers out? One star for the fridge!"], [12, "Heyyy, delivery dude. *yaaawn* Did I order a pizza? Like, last week?"], ["me", "Not from me, buddy! Boing! World 8 key, delivered to MY pocket!"]],
  "w8-s8": [["me", "Forty-five seconds of waves. Hey, Mr. Scarecrow, you look like my old manager!"], [16, "Stay frosty, raptor. Got anything cold in that box? Asking for a turtle. Is it hot out here?"], ["me", "Sorry, pal, HOT deliveries only! Shade's free, though!"]],
  "w8-s9": [["me", "Glass everywhere! Customer's up top. Keep the box level!"], ["n", "From the Mystery Heap, a voice rumbles: \"Is that PIZZA? Is there pizza in ME?! I gotta check!\""], ["me", "Nobody's checking ANYTHING till they tip! Beep beep!"]],

  // World 9: The Supermarket.
  "w9-s2": [["me", "Minute forty-two! Smooth aisles and a whole trolley lane! Love it!"], ["n", "Uh-oh! A giant rolling pin comes rumbling down the aisle!"], ["me", "Tailgater AGAIN?! Is it the same pin? Get your own route! Beep beep, VROOM!"]],
  "w9-s3": [["me", "Breakfast boxes at pizza o'clock? My schedule's still a mess!"], ["me", "Clean-up on aisle three! One rolling pin, no coupon needed!"]],
  "w9-s4": [[10, "Hmph. Raptor. Lost Crumblet in Fruit and Veg. Bus it to the exit."], ["me", "Passenger number nine! Ooh, Bluebeary, they sell trolleys! That's basically a bus with a basket!"], [10, "Bus fund's up to two crumbs, a button, a seed and a grape. Hmph."]],
  "w9-s6": [["me", "Ooh, garlic bread! No, no, focus! Recipe Scroll first, then hold out!"], ["lo2", "Hah! Thy pizza shall be day-old ere it arriveth, courier!"], ["me", "Day-old pizza is still PIZZA, pal! Beep beep!"]],
  "w9-s7": [["me", "A chest way up on the cans? Sponge elevator, take me UP!"], [3, "Wibble wobble! Is that pizza for the dessert table? Am I invited? Please say I'm invited!"], ["me", "Wrong menu, jelly! Here, have a coupon! Boing! World 9 key, delivered!"]],
  "w9-s8": [["me", "Forty-five seconds on the conveyor? Finally, a road that moves FOR me!"], [14, "Let's GOOO, raptor! Run against the belt! It's o-fish-ally the best workout!"], ["me", "Against traffic?! That's a ticket, buddy! Beep beep!"]],
  "w9-s9": [["me", "Brrr! The freezer aisle?! Hang in there, pizza box! Think toasty oven thoughts!"], ["n", "From the Back Aisle, a spooky voice wails: \"Woooo! Is that PIZZA? Into the tub it goes!\""], ["me", "Nope! Hot deliveries only! No tub, no tip, NO way!"]],

  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Minute forty-four! Sticky jam road, but I've got grippy claws!"], ["n", "Uh-oh! A giant rolling pin comes rumbling off the jam jars!"], ["me", "The SAME tailgater?! It followed me all the way here! Beep beep, VROOM!"]],
  "w10-s3": [["me", "Old takeaway boxes everywhere! Rival delivery companies?! Unacceptable!"], ["me", "And a rolling pin up top! One for every monster, no chopsticks needed!"]],
  "w10-s4": [[10, "Hmph. Raptor. Last stray Crumblet in the House, out on Frost Drawer Falls. Bus it to the exit."], ["me", "Passenger number TEN! Final stop! Bluebeary, how's the bus fund?"], [10, "Two crumbs, a button, a seed, a grape and an IOU. Hmph. It's a bus."]],
  "w10-s6": [["me", "Ooh, party streamers! Grab the Recipe Scroll, then hold out!"], ["lo2", "Hah! Paper chains for a forgotten feast, courier! Not one guest hath RSVP'd!"], ["me", "I RSVP'd! I'm the DELIVERY! Beep beep!"]],
  "w10-s7": [["me", "Final secret chest, all the way up there. Last elevator ride, folks!"], [9, "Ooh, pizza! Elephants never forget! *POP* Hey, it's the pizza from the Dining Room!"], ["me", "You REMEMBERED?! Big guy, that's a five-star memory! Boing!"]],
  "w10-s8": [["me", "Forty-five seconds of EVERY monster?! It's rush hour at the end of the world!"], ["foe", "Raptor! I'm on traffic control! Pineapple barricade, deployed!"], ["me", "Pete! Pineapple on the ROAD is finally allowed! Beep beep!"]],
  "w10-s9": [["me", "Delivery address confirmed! Wow, that's one LONG, EMPTY table."], ["n", "From the cake-tin throne, a voice grumbles: \"Bring it here, lizard. And don't expect a TIP.\""], ["me", "Customer's in! Keep the box level, raptor. Last fifty feet!"]],
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
