// Pengwhip: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop. Lost, warm, and no brakes.
  "w1-s2": [["me", "Crumbs! Terrible for sliding, great for snacking! Nom!"], ["me", "Excuse me, which way to the freezer? Anybody? No? Okay! Up and across! Wheee!"]],
  "w1-s3": [["n", "Yikes! Gummy Gully is wriggling with sour worms and moldy buns!"], ["me", "Whoa! That's a lotta friends who are NOT my friends!"], ["me", "Ooh, a ladle lever! One tug and down comes a big rolling pin! Penguin bowling!"]],
  "w1-s4": [["me", "Oh! A little Crumblet! Are you lost too? Me too! Let's be lost together!"], ["me", "Just one rule: I can't stop when I slide, so DON'T stand in front of me! Okay? Okay!"]],
  "w1-s6": [["me", "The Chef's Recipe Scroll? If I fetch it, maybe somebody'll point me home!"], ["n", "Uh-oh! Behind the cinnamon, something BIG is waiting!"], ["me", "Eep! Then I'll fetch it really, REALLY fast!"]],
  "w1-s7": [["me", "Ah-CHOO! Pepper Pass is the least snowy place I've ever been!"], ["me", "A key in a hidden chest? Maybe it opens the FREEZER door! Sponge, here I come! Boing!"]],
  "w1-s8": [["me", "Hold my ground for forty-five seconds?! But I don't HAVE brakes!"], ["me", "Okay, I'll slide in circles. Circles count as standing still. I've decided! Wheee!"]],
  "w1-s9": [["me", "Burners! My whipped cream is drooping! Do penguins sweat? Oh no, I'm finding out!"], ["mold", "Hehehe... such a long way from the cold, little bird. Stay and melt awhile."], ["me", "Nope! Resting is for AFTER the slide!"]],
  // World 2: The Fridge. Almost home.
  "w2-s2": [["n", "Click! The fridge light goes out, and Dairy Lane goes pitch-dark!"], ["me", "Dark and cold? Pfft, that's just a normal Tuesday back home! I'm not scared!"], ["me", "Um, the glowing eyes are new, though. Hi, glowing eyes!"]],
  "w2-s3": [["me", "FROST! Real, proper frost! I'm gonna slide on ALL of it! Wheee!"], ["me", "That lunchbox has teeth marks on the INSIDE. Don't open it. Don't open it. Ooh, I wanna open it!"]],
  "w2-s4": [["me", "Another lost Crumblet! I know a great spot for lost stuff: the freezer! Follow me!"], ["me", "Wait, no, that's where leftovers go! To the exit, then! Mind the hissy pots!"]],
  "w2-s6": [["me", "Recipe Scroll, then the freezer! I can smell frost from here! Smells like... ice!"], ["me", "Seventy-five seconds? I could slide round the whole fridge twice in that! Probably!"]],
  "w2-s7": [["me", "Butter Bridge! Second-best thing to slide on! First is ice. Third is also ice!"], [5, "Heh. Psst, penguin. Chest on the high ledge, key inside. I'd lift it myself, but I'm on a job."], ["me", "Thanks, Toastbat! Wait, what job?!"]],
  "w2-s8": [["me", "Ketchup Canyon. Red and gloopy. Nothing like snow. Aw, I miss snow."], ["me", "The freezer's RIGHT up there! Forty-five seconds. Hold it, hold it, hoooold it!"]],
  "w2-s9": [["me", "Ice Tray Steps! Ice cubes! Ooh, I can see my house from here!"], ["foe", "Hey, birdie! I've been using your bed as a snack drawer! Hurry up, you're missing it!"], ["me", "FINN! Get your snacks outta my NEST! Ewww!"]],
  // World 3: The Oven. The opposite of home, for the sake of friends.
  "w3-s2": [["me", "Home'll still be there when I'm done. I hope it saves me a snowball!"], ["me", "Whoa, even the bottom rack is hotter than anywhere I've EVER been! Slide fast!"]],
  "w3-s3": [["me", "Muffin tins! Twelve little cups, twelve wrong turns! I'm gonna slide into every one!"], ["me", "That cereal box wiggles when I'm not looking. Lever first, questions later!"]],
  "w3-s4": [["me", "Little Crumblet! Stay in my shadow. It's the only cool spot in the whole Oven!"], ["me", "And remember, hissy pots are monster traps, NOT hot tubs!"]],
  "w3-s6": [["me", "A flat cookie sheet! Perfect sliding! Ow! Ow! Hot! STILL PERFECT SLIDING!"], ["me", "Grab the scroll and hold on. It's warm, but so is a hug! Think huggy thoughts!"]],
  "w3-s7": [["n", "Sizzle! The roasting pan is packed with monsters, shoulder to shoulder!"], ["me", "That's a LOT of hot stuff in one pan! Somebody turn it down!"], ["me", "The key chest is up a sponge somewhere. I'll slide right under the crowd! Belly first!"]],
  "w3-s8": [["me", "Forty-five seconds on a pizza stone? I'm gonna come out a waffle cone!"], [6, "Hear ye! Courage, small penguin! We, Dumplord, have been steamed for HOURS! Builds character!"]],
  "w3-s9": [["me", "Top rack! So hot my cookie bits are extra crunchy! But hey, I'm glad I came."], ["me", "Out here everybody says \"thanks, Pengwhip!\" At home they mostly say \"shut the door!\""]],
  // World 4: The Pantry. Dry, dusty, and finally learning to stop.
  "w4-s2": [["me", "Dusty and dry. Not a snowflake for miles. I sent the freezer a postcard anyway!"], ["me", "\"Dear Freezer: I'm in a canyon made of cereal! Wish you were here! Bring ice!\""]],
  "w4-s3": [["me", "SNOW! Real snow! Snowdrifts as far as I can... wait."], ["me", "It's flour. It's flour, isn't it. Aw, nuts."], ["me", "Still slides like snow! I'm counting it! Wheee!"]],
  "w4-s4": [["me", "Hiya again, little Crumblet! You're great at following me. And I'm great at STOPPING now!"], ["me", "See? Brakes! Mostly! *skrrrt* Stay clear of the pressure cookers!"]],
  "w4-s6": [["n", "Uh-oh! Up on the ridge, a big shadow is lurking behind the nutmeg!"], ["foe", "Thought you'd want a warm-up before our rematch, birdie! Say hi to my pal! Hehehe!"], ["me", "Finn! Since when do sharks have pals THAT big?!"]],
  "w4-s7": [["me", "Pasta Jar Peaks! Spaghetti makes terrible skis. Trust me, I tried."], ["me", "One more key, one more chest! I've bounced so much I'm basically a sponge! Boing!"]],
  "w4-s8": [["me", "Honey Hollow. Sticky floor. No sliding?! Uh-oh. I'm a penguin standing STILL!"], ["me", "Forty-five seconds of waddling. Okay! Waddle mode: ACTIVATE! Waddle waddle!"]],
  "w4-s9": [["me", "The top shelf! From up here I can see the freezer AND all my friends! Hi, everybody!"], ["mold", "Look the other way, little penguin. The Sink is dripping. Drip, drip. Hehehe!"], ["me", "Hey! Whoever's dripping, cut it out! We're having a moment here!"]],
  // World 5: The Sink. Finally, water! Penguin turf.
  "w5-s2": [["n", "Uh-oh! A giant rolling pin is chasing Pengwhip down the Suds Slide!"], ["me", "A soapy slide AND a chase?! Who needs brakes? Wheeeee!"]],
  "w5-s3": [["me", "Sponge Shoals! It's like bouncing on a big, wet cloud! Boing! Squish! Boing!"], ["me", "Gates locked! Lever time, then rolling pin bowling! Strike!"]],
  "w5-s4": [[10, "Hmph. Penguin. My last Crumblet. Walk it through the dish rack. Slowly. SLOWLY."], ["me", "Slowly! Got it! I've got brakes now, Mr. Bluebeary! *skrrrt* See?"], [10, "Hmph. Show-off. Keep its cup dry."]],
  "w5-s6": [["me", "Bubble Bay! Bubbles AND conveyor belts? It's a water park! Scroll first, splashing after!"], ["me", "Seventy-five seconds! That's like a hundred slides! Wheee!"]],
  "w5-s7": [["me", "Plughole Pass! Don't slide into the plughole. Don't slide into the plughole. Oops, almost!"], ["me", "Last key's up on a high ledge! Sponge, my old pal! Boing!"]],
  "w5-s8": [["me", "Greasy Pan Pits! Grease is slippery! Grease is SO slippery! I kinda love grease!"], ["me", "Forty-five seconds? Easy! I'll slide in circles again. Circles still count!"]],
  "w5-s9": [["mold", "Hehehe... slide down, little bird. Down, down the drain. It's cold and dark, just like home!"], ["me", "Nope! Home is cold and SPARKLY and full of friends! You've got the wrong freezer, buddy!"]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Placemat Plains! Smooth and flat! Perfect for sli... uh-oh."], ["n", "RUMBLE! A giant rolling pin is chasing Pengwhip across the placemats!"], ["me", "No brakes, no problem! Wheeee!"]],
  "w6-s3": [["me", "Candelabras! Pretty lights! Ow! Hot wax! Pretty OUCHY lights!"], ["me", "Gates locked! Yank the lever and bowl 'em over! Penguin bowling, fancy dinner edition!"]],
  "w6-s4": [[10, "Hmph. Penguin. This Crumblet wants to see the world. Walk it through Gravy Boat Bay. Slowly."], ["me", "Slowly! Brakes on! *skrrrt* Oops, gravy's slippery too! Hang on, little buddy!"]],
  "w6-s6": [["me", "Teacup Terrace! Ooh, iced tea? No? Just hot tea? Aw, nuts."], ["me", "Grab the scroll, then hold out! Stay cool, Pengwhip! You're SO cool!"]],
  "w6-s7": [["me", "Napkin Fold Fort! Napkins are like snow, but folded!"], ["me", "Key chest up on the high ledge. Sponge, my old pal! Boing!"]],
  "w6-s8": [["lo2", "Charge, my silverware! Make yon penguin into dessert!"], ["me", "Forty-five seconds? I'll slide in circles round the plates. Circles STILL count!"]],
  "w6-s9": [["me", "Chandelier Climb! Ooh, shiny! Like icicles, but warmer. Much warmer."], ["lo2", "Forsooth! A cookies-and-cream bird! I shall dunk thee in my tea, varlet!"], ["me", "Nobody dunks THIS penguin! Still true! Wheee!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "A garden hose! A long green slide! Wheeee!"], ["n", "RUMBLE! A giant rolling pin comes bouncing down right behind the penguin!"], ["me", "A race?! I LOVE races! Wait, I can't stop at the finish! Wheeee!"]],
  "w7-s3": [["n", "FSSSH! Sprinklers burst up all over Sprinkler Springs!"], ["me", "Cold splashy water! Puddles are just tiny ice rinks that forgot to freeze!"], ["me", "Gates locked! Yank the lever! Penguin bowling, backyard edition!"]],
  "w7-s4": [[10, "Hmph. Penguin. This Crumblet's never seen a paddling pool. Walk it past the pier. Slowly."], ["me", "A POOL?! Cannonb... no! Slowly! Brakes on! *skrrrt* Okay, little buddy, follow me!"]],
  "w7-s6": [["me", "Picnic Table Peak! Ooh, is there ice cream? Wait, I'M the ice cream. Eek!"], ["me", "Grab the scroll and hold out! Shoo, wasps! Penguins are NOT on the menu!"]],
  "w7-s7": [["me", "Flowerpot Fort! Flowers smell nice. Way nicer than that stinky Baron."], [9, "*POP* Hi, little penguin! Elephants never forget! The key chest is up on the, um, the..."], ["me", "The high ledge? Thanks, Bubblegumbo! Sponge, my old pal! Boing!"]],
  "w7-s8": [["me", "A COOLER! Ice cubes! Frost! It smells like HOME! *sniff* I'm not crying, it's condensation!"], ["me", "Forty-five seconds in here? Best spot in the whole backyard! Circles STILL count! Wheee!"]],
  "w7-s9": [["me", "Charcoal Climb! The rocks are glowing! Why is EVERYTHING out here so hot?!"], ["lo2", "Climb on, bird! The Baron shall serve thee as a summer slushie! Hahaha!"], ["me", "Slushie?! I'm cookies AND cream! Get it right! Wheee!"]],
  // World 8: The Garden.
  "w8-s2": [["me", "A giant watering can! A shower AND a slide! Wheee!"], ["n", "RUMBLE! A giant rolling pin comes bouncing down the Watering Can Run!"], ["me", "Race you, pin! Wait, I still can't stop at the finish! Wheeee!"]],
  "w8-s3": [["n", "POOF! A giant flower puffs pollen all over Sunflower Grove!"], ["me", "Ah... ACHOO! Eek, now I'm cookies and cream and POLLEN!"], ["me", "Gates locked! Yank the lever! Penguin bowling, garden edition!"]],
  "w8-s4": [[10, "Hmph. Penguin. This Crumblet's never seen a pumpkin patch. Walk it to the exit. Slowly."], ["me", "Slowly! Brakes on! *skrrrt* Little buddy, pumpkins are NOT ice rinks. I checked!"]],
  "w8-s6": [["me", "Beanstalk Heights! Climbing is just sliding, but UP! Ooh, that's harder."], ["me", "Grab the scroll quick, then hold out! Up, up, Pengwhip! Don't slide back down!"]],
  "w8-s7": [[16, "Whoa. A penguin. Stay frosty, little dude. Is it hot, or is it me? It's hot, right?"], ["me", "Another ice cream?! You're melting too! Quick, stand in my shade!"], [16, "Cool, cool, cool. Key chest's up on the high ledge. Scoop there it is."]],
  "w8-s8": [["me", "A scarecrow! Hi, Mr. Scarecrow! You look so chilly out here. I'm jealous!"], ["me", "Forty-five seconds? Round and round the scarecrow! Circles STILL count! Wheee!"]],
  "w8-s9": [["n", "From the greenhouse, a lumpy voice mumbles: \"Huh! Is that a sock in me? WHO AM I?\""], ["me", "A greenhouse is just a glass oven for plants! Eek! Okay, slide fast! Wheee!"]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "A trolley track! Shiny wheels, shiny floor! Wheee!"], ["n", "RUMBLE! A giant rolling pin comes rolling down the Trolley Track!"], ["me", "Another race?! Clean-up on aisle nine! That's ME! Wheeee!"]],
  "w9-s3": [["me", "The Cereal Aisle! Frosted flakes! FROSTED! Ooh, I feel at home already!"], ["me", "Gates locked! Yank the lever! Penguin bowling, supermarket edition!"]],
  "w9-s4": [[10, "Hmph. Penguin. This Crumblet's never seen fruit and veg. Walk it to the exit. Slowly."], ["me", "Slowly! Brakes on! *skrrrt* Oops, misty lettuce is slippery! Hang on, little buddy!"]],
  "w9-s6": [["me", "Bakery Bluff! Mmm, warm bread smell! Eek, WARM! Grab the scroll fast!"], ["me", "Then hold out! Stay cool, Pengwhip! You're SO cool! Cooler than a baguette, anyway!"]],
  "w9-s7": [[3, "Wibble wobble! A penguin! Are you dessert? Are you going to the dessert table?"], ["me", "I'm cookies AND cream! I'm basically a dessert table! Wanna come to my freezer for a sleepover?"], [3, "Eee! A frosty jelly sleepover! That's the jiggle of it! Key chest's up high! Go boing!"]],
  "w9-s8": [["lo2", "The checkout, bird! I shall scan thee, bag thee and pop thee in the freezer section!"], ["me", "Ooh, yes please! Wait, nope! Forty-five seconds! Circles STILL count! Wheee!"]],
  "w9-s9": [["me", "THE FROZEN AISLE! Frost! Freezers all the way down! Is this home? Aw, it's not home, is it?"], ["n", "Uh-oh! A freezer door swings open, and a spooky voice wails: \"Woooo! Get out of my aisle!\""], ["me", "YOUR aisle?! Brrr, that's a cold welcome! I love it! Long way home, part six and a half! Wheee!"]],
  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Jam Jar Junction! Sticky floors! Uh-oh, you can't slide on jam!"], ["n", "RUMBLE! A giant rolling pin comes rolling between the jam jars!"], ["me", "Last race, pin! I STILL can't stop at the finish! Wheeee!"]],
  "w10-s3": [["me", "Takeaway Towers! Ooh, a tub of ice cream! Nope, it's soup. Cold soup. Close enough!"], ["me", "Gates locked! Yank the lever! Penguin bowling, FINAL edition!"]],
  "w10-s4": [[10, "Hmph. Penguin. My LAST Crumblet. The very last one. Walk it down Frost Drawer Falls. Slowly."], ["me", "Slowly! Brakes on! *skrrrt* Little buddy, frost is MY turf! Follow my footprints!"], [10, "It's wearing a tiny bobble hat. Don't look at me. It's the frost, okay?"]],
  "w10-s6": [["me", "Paper Chain Pass! Party streamers! Wait, are they frozen? They're FROZEN! Wheee!"], ["me", "Grab the LAST Recipe Scroll, then hold out! Stay cool, Pengwhip! You're SO cool!"]],
  "w10-s7": [[16, "Whoa, little dude. The back of the Fridge. Finally, somewhere cool enough for us. Cool, cool, cool."], ["me", "Right?! It's like a holiday! Last key's up high! Sponge, my old pal! One last boing!"]],
  "w10-s8": [["lo2", "Hold out one last time, bird? Thou shalt be forgotten at the back, like a frozen pea!"], ["me", "Peas are great! Forty-five seconds! Circles STILL count! Even the last ones! Wheee!"]],
  "w10-s9": [["n", "A grumpy old voice booms down the long, empty table: \"Who's SLIDING on my banquet table?!\""], ["me", "Me! Sorry! It's so dusty and slidey! Wait, why is a feast table EMPTY?"], ["me", "Aw, nuts. That's the saddest party ever! Long way home, part seven and a half! Here I come!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Slide, slide, SLIDE!", "Bowling for baddies!", "Strike! Penguin style!"],
  lowhp: ["I'm melting! Wrong way!", "Need a freezer nap! STAT!", "Eek! My cream is curdling!"],
  perfect: ["Wheee! Missed me!", "Can't hit what slides!", "Slippery when cool!"],
  levelup: ["Extra whipped! Level up!", "Fancy penguin unlocked!", "Ooh, I'm SO cool right now!"],
  secret: ["Ooh! A souvenir for home!", "Boing! Sponge for the win!", "Treasure! Is it cold?"],
  boom: ["KABOOM! Avalanche!", "Rolled flat like pastry!", "Ice to meet you! Bye!"],
  mimic: ["Yikes! That box has TEETH!", "That's no present!", "Lunch tried to eat ME?!"],
  objective: ["Done! Freezer, here I come!", "Nailed it! Slide on!", "One cool job, done!"],
};
