// Salmonster: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop. Fresh out of the prep sink, taking the long way round.
  "w1-s2": [["me", "Crumb Trail! Crumbs are like gravel. Great for a warm-up jog."], ["n", "RUMBLE! A giant rolling pin is rolling right at him!"], ["me", "Whoa! And this way's DOWNhill. I hate downhill! RUN!"]],
  "w1-s3": [["me", "Gummy Gully. Sticky! Like swimming in syrup. Great leg day. Wait, I don't have legs."], ["me", "Ooh, a lever! Pull it and a rolling pin goes BONK! Teamwork, bro!"]],
  "w1-s4": [[10, "Hmph. Fish. Walk my Crumblet to the exit. And watch the shadows. Things jump out round here."], ["me", "You got it, Coach! Little muffin, stay behind me. If anything jumps, I jump higher!"]],
  "w1-s6": [[11, "Beep beep! Coming through! Hey, fishy, you're running BACKWARDS!"], ["me", "Backwards is harder! Recipe scroll, here I come! Grab it, hold the line, let's GOOO!"]],
  "w1-s7": [["me", "Pepper Pass. Ah... AH-CHOO! Whoa, sneezed my lemon right off my head."], ["me", "Chest way up high. Sponge! BOING! Too easy. Next time I'm jumping without the sponge."]],
  "w1-s8": [["foe", "Here, fishy fishy! I brought a whole swarm of hungry friends! Forty-five seconds, then you're LUNCH!"], ["me", "A swarm? Bring it, bro! Fins up! Let's GOOO!"]],
  "w1-s9": [["me", "Burner Approach. Hot hot HOT. Steamed salmon is NOT on the menu today."], ["mold", "Hehehe... why swim so hard, little fishy? Just float down, down, down."], ["me", "Float DOWN? Bro, you don't know me at all."]],
  // World 2: The Fridge. Ice beds, lemon slices, a little homesick.
  "w2-s2": [["me", "Dairy Lane! Rivers of milk! Ooh, I'm gonna swim up the milk carton!"], ["n", "RUMBLE! A chilly rolling pin comes rolling down the lane!"], ["me", "Okay, swimming later! Running now! Not my favorite stroke!"]],
  "w2-s3": [["me", "Frosty Shelf. Ice everywhere. Smells like my old fish counter. Kinda homesick, bro."], ["me", "Lever! Rolling pin goes BONK! Chill out, monsters!"]],
  "w2-s4": [[10, "Hmph. Fish. It's cold. Walk my Crumblet to the exit, and keep it moving."], ["me", "Moving's my thing, Coach! Little muffin, let's do some laps. Hut, hut!"]],
  "w2-s6": [["me", "Egg carton cliffs! Recipe scroll up top. There's a ramp round the side."], ["me", "Ramps are for quitters! Straight up the eggs! Grab, hold, let's GOOO!"]],
  "w2-s7": [["me", "Butter Bridge. Slippy! Like a wet rock in a river. I LIVE for wet rocks."], ["me", "Key chest up high. Sponge! BOING! Fridge key, bagged. O-fish-ally!"]],
  "w2-s8": [["n", "Click! The fridge light goes out! Lights out in Ketchup Canyon!"], ["foe", "Here, fishy fishy! Can't see ya, but I can SMELL ya! Forty-five seconds, then dinner!"], ["me", "Fish don't need lights, bro. The bottom of a river is dark! Bring it!"]],
  "w2-s9": [["mold", "Hehehe... stay in the cold, little fish. Lie down on the ice. Just like the fish counter."], ["me", "Been there, done that, flopped outta there. Climbing!"]],
  // World 3: The Oven. Hot pans, a scary place for a salmon.
  "w3-s2": [["me", "Bottom Rack. Every step feels like a frying pan. Keep moving, keep moving!"], ["n", "RUMBLE! A hot rolling pin is rolling out of the oven!"], ["me", "Hot pin? I'll leap OVER it. Upstream Leap!"]],
  "w3-s3": [["n", "Click! The oven light goes out in the Muffin Tin Maze!"], ["me", "Dark? No problem. Salmon find their way home in the dark. It's like a superpower, bro."], ["me", "Lever! Rolling pin goes BONK! Lights out for YOU guys!"]],
  "w3-s4": [[10, "Hmph. It's hot in here. Walk my Crumblet. Quick, fish. QUICK."], ["me", "Quick is my middle name, Coach! Okay, my middle name is Steve. But QUICK!"]],
  "w3-s6": [[15, "S-S-Salmonster! The recipe scroll's at the end of the cookie sheet! A-and it's HOT!"], ["me", "Hotchog! Hot is great cardio, bro! Grab it, hold the line!"]],
  "w3-s7": [["me", "Roasting Pan Pass. A roasting pan. For a SALMON. Nope! Nope nope nope!"], ["me", "Key chest up high. Sponge! BOING! Out of the pan, onto the ledge. Phew!"]],
  "w3-s8": [["foe", "Here, fishy fishy! Ooh, this pizza stone's nice and hot! Perfect for grilling ya!"], ["me", "Forty-five seconds on a hot stone? It's a sauna, bro. Very sporty."]],
  "w3-s9": [["me", "Top Rack Ascent. All uphill! My favorite!"], ["mold", "Hehehe... why climb, little fishy? Everything ends at the bottom. The drain is waiting."], ["me", "The drain IS my plan, bro. I'm just taking the scenic route!"]],
  // World 4: The Pantry. Mountains of shelves, all uphill, all good.
  "w4-s2": [["me", "Cereal Canyon! Cereal rapids! I'm swimming UP the cereal!"], ["n", "RUMBLE! A rolling pin is crunching through the cereal!"], ["me", "Crunch crunch! Run run! Let's GOOO!"]],
  "w4-s3": [["me", "Flour Drifts. Ugh. Flour on a fish? That's how fish get FRIED, bro!"], ["me", "Lever! Rolling pin goes POOF! Sorry, Flour Ghosts. Batter luck next time!"]],
  "w4-s4": [[10, "Hmph. Tin Can Alley's dark. Walk my Crumblet. Gently, fish. No laps."], ["me", "No laps? Okay, Coach. Little muffin, tiny steps. Tiny, sporty steps."]],
  "w4-s6": [["n", "Surprise! Monsters burst out from behind the spice jars!"], ["me", "An ambush? Love a surprise workout! Scroll's up top. Grab, hold, GO!"]],
  "w4-s7": [[7, "Hrrm. Young salmon. An ancient proverb: the fish that swims upstream gets very, very tired."], ["me", "Tired is just WINNING slowly, Sensei!"], [7, "Hrrm. That is not the proverb. The sponge is over there."]],
  "w4-s8": [["foe", "Here, fishy fishy! Honey Hollow! Bears LOVE honey! Wait. Focus. FISH!"], ["me", "Forty-five seconds in sticky honey? Leg day AGAIN! Still no legs!"]],
  "w4-s9": [["me", "Top Shelf Climb. Sniff, sniff. I can smell the Sink from up here. Water!"], ["mold", "Drip, drip! The Chef is down MY drain, fishy. Come and get 'em. Hehehe!"], ["me", "Climbing up so I can go down. The hard way! It's tradition!"]],
  // World 5: The Sink. Real water at last, and a drain that only goes down.
  "w5-s2": [["me", "Suds Slide! A water slide! Down, though. Ugh. FINE."], ["n", "RUMBLE! A giant rolling pin is sliding down the suds right behind him!"], ["me", "Okay, okay, downhill is fine TODAY! RUN!"]],
  "w5-s3": [["me", "Sponge Shoals! Water! REAL water! Hey, gills, we're BACK!"], ["me", "Gates locked. Lever! Rolling pin goes SPLOOSH. Monsters, you're all washed up!"]],
  "w5-s4": [[10, "Hmph. My last Crumblet. Get it past the dishes. And keep it dry, fish. You're very splashy."], ["me", "Dry muffin, no splashing. Got it, Coach! Little muffin, ride on my lemon!"]],
  "w5-s6": [["me", "Bubble Bay! Conveyor belts! Going the wrong way, of course. Love it!"], ["me", "Scroll in seventy-five seconds, then hold out. Just keep swimming!"]],
  "w5-s7": [["me", "Plughole Pass. That's the drain, right there. Too close. Too easy. Up first!"], ["me", "Last key in the high chest. Sponge! BOING! Fins crossed!"]],
  "w5-s8": [["me", "Greasy Pan Pits. Eww. Grease on a fish is a big no-no, bro."], ["me", "Forty-five seconds! Scrub-a-dub-dub! Let's GOOO!"]],
  "w5-s9": [["mold", "Hehehe... down, down, little fishy. Everything flows DOWN. You can't fight the current forever."], ["me", "Fighting the current is my whole THING, bro!"]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Placemat Plains. Fancy! Little forks, little spoons. No fish knives, I hope."], ["n", "RUMBLE! A giant rolling pin is bowling down the tablecloth!"], ["me", "Downhill AGAIN?! Who keeps building these?! RUN!"]],
  "w6-s3": [["me", "Candelabra Crossing. Hot wax. SPLAT! Ow! I'm a waxed salmon now. Shiny!"], ["me", "Lever! Rolling pin goes BONK! Pass the victory, please!"]],
  "w6-s4": [[10, "Hmph. Fish. This Crumblet wants to see the world. Walk it past the gravy boats."], ["me", "Gravy boats? I'll steer, Coach! Little muffin, all aboard the S.S. Salmon!"]],
  "w6-s6": [["me", "Teacup Terrace! Teacups like swimming pools! Scroll's at the far end."], ["me", "Grab it, hold out, and NO hot-tub breaks. Okay, ONE hot-tub break."]],
  "w6-s7": [["me", "Napkin Fold Fort. Napkins folded like swans. Show-offs."], ["me", "Key chest up high. Sponge! BOING! Ten out of ten dive, bro!"]],
  "w6-s8": [["lo2", "Charge, my silverware! Fillet yon fishy!"], ["me", "FILLET?! Forty-five seconds, you forks! Fins up!"]],
  "w6-s9": [["me", "Chandelier Climb. Up, up, UP! Now THIS is my kinda stage!"], ["lo2", "Climb, fishy varlet! At the top, I shall serve thee on a cracker!"], ["me", "You're the cracker, bro! A stale one!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "Hose Highway! I'm swimming up the hose! Against the flow! Let's GOOO!"], ["n", "RUMBLE! A giant rolling pin comes bouncing down the hose!"], ["me", "Okay, against the PIN is harder! RUN!"]],
  "w7-s3": [["n", "FSSSH! Sprinklers burst up all over the lawn!"], ["me", "WHOO! Sprinkler launch! Best ride ever!"], ["me", "Sprout Soldiers! Lever! Rolling pin goes BONK! You're toast, bros!"]],
  "w7-s4": [[10, "Hmph. Fish. This Crumblet wants to see the paddling pool. Walk it to the exit. Dry."], ["me", "A POOL, and no swimming? Okay, Coach. That's the hardest way of all."]],
  "w7-s6": [[18, "In THIS corner! The fishiest fighter in the yard! SAL-MON-STERRR! Ding ding!"], ["me", "Velvaroo! Love the intro! Scroll's on the picnic table. Grab, hold, GO!"]],
  "w7-s7": [["me", "Flowerpot Fort. Pots stacked like a mountain. Mountains are my jam!"], ["me", "Key chest way up high. Sponge! BOING! Fine, I'll take the sponge. Just this once."]],
  "w7-s8": [["me", "Cooler Canyon! Ice! Ahhh, cool on the gills."], ["lo2", "Forsooth! Baron Brussels shall grill thee medium rare, fish!"], ["me", "Rare? Sure am. Rare TALENT! Forty-five seconds, go!"]],
  "w7-s9": [["me", "Charcoal Climb. Hot coals. A grill up top. *gulp*"], ["n", "From the grill, a voice booms: \"ATTEN-TION, fish! You'll be SIZZLED with a side of sprouts!\""], ["me", "Sizzle THIS! Uphill, the hard way! Let's GOOO!"]],
  // World 8: The Garden.
  "w8-s2": [["me", "Watering Can Run! Water pouring down. I'm swimming UP the stream!"], ["n", "RUMBLE! A giant rolling pin comes tumbling off the watering can!"], ["me", "That's NOT the kind of stream I meant! RUN!"]],
  "w8-s3": [["n", "POOF! A giant flower puffs a pollen cloud right at Salmonster!"], ["me", "AH-CHOO! Gills full of pollen! Gross, bro!"], ["me", "Lever! Rolling pin goes BONK! Turnip for the books!"]],
  "w8-s4": [[10, "Hmph. Fish. This Crumblet wants to see the pumpkins. Walk it to the exit."], ["me", "Pumpkin patch tour, Coach! Little muffin, wave to the gourds!"]],
  "w8-s6": [[12, "Heyyy, duuude. Scroll's up the beanstalk. There's a leaf elevator. Super easy."], ["me", "Sloba! Elevator? EASY? Pfft! I'm climbing the stalk. Grab, hold, let's GOOO!"]],
  "w8-s7": [["me", "Compost Keep. Pee-yew! Smells like a fish counter on a Monday."], ["me", "Key chest up high. Sponge! BOING! Fresher air up here, bro."]],
  "w8-s8": [["lo2", "Ha! The Meatloaf shall stale thy whole Garden, fish! Thou reapest what thou sowest!"], ["me", "Reap THIS! Forty-five seconds on Scarecrow Stand! Let's GOOO!"]],
  "w8-s9": [["me", "Greenhouse Steps. Steamy! Like a fish steamer. Ugh."], ["n", "From the heap, a voice rambles: \"Who goes there?! Wait, is that a FISH FINGER in me?\""], ["me", "A fish finger?! Hang on, little buddy! Climbing!"]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "Trolley Track! Shopping carts zooming! I'm running UP the aisle!"], ["n", "RUMBLE! A giant rolling pin comes rolling down the track!"], ["me", "Clean-up on aisle two! And it's ME! RUN!"]],
  "w9-s3": [["me", "Cereal Aisle! Boxes like skyscrapers. I used to dream about this view from the fish counter."], ["me", "Lever! Rolling pin goes BONK! You monsters are way past your best before!"]],
  "w9-s4": [[10, "Hmph. Fish. This Crumblet got lost in Fruit and Veg. Walk it to the exit."], ["me", "My old neighbors! Little muffin, wave to the bananas. Not the bruised ones."]],
  "w9-s6": [[3, "Wibble wobble! Salmonster! The scroll's at the end of the bakery! Can I come? Please? Pleeease?"], ["me", "Bloblin! Course you can! Grab, hold, and cheer LOUD! Let's GOOO!"]],
  "w9-s7": [["me", "Canned Goods Keep. Canned TUNA. Hang in there, guys."], ["me", "Key chest way up high. Sponge! BOING! Key, bagged!"]],
  "w9-s8": [["foe", "Clean-up on aisle nine! Forty-five seconds, fishy! I'll bag the bad guys!"], ["me", "Grizzle! Okay, team! Check out THIS combo!"]],
  "w9-s9": [["me", "The Frozen Aisle. Brrr! Fish sticks in every box. Don't look, bro. Don't look."], ["n", "From the dark, a spooky voice wails: \"Woooo! Who's shopping in MY aisle? Woooo!\""], ["me", "A ghost tub, sitting on my crew's ice? Your expiry date's TODAY, bro!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Let's GOOO! Combo!", "Fin, fin, FIN!", "Holy mackerel, what a streak!"],
  lowhp: ["Ow! Fish outta water here!", "I'm floundering, bro!", "Gills! Need! Water!"],
  perfect: ["Slippery! Can't catch me!", "Swam right past ya!", "Too fast, bro! Fin-tastic!"],
  levelup: ["Level up! O-fish-ally stronger!", "Gains! Fin gains!", "New personal best! Let's GOOO!"],
  secret: ["Ooh, treasure! Reel it in!", "Hidden loot! Fin-ders keepers!", "Holy mackerel, a goodie!"],
  boom: ["KA-BLAM! Made a splash!", "BOOM! Total wipeout!", "Bonk! Nothing but net!"],
  mimic: ["Whoa! The chest BITES!", "Bro, that box is hungry!", "Teeth?! I'm not BAIT!"],
  objective: ["Done! Let's GOOO!", "Goal! Fish-tastic!", "Nailed it! The hard way!"],
};
