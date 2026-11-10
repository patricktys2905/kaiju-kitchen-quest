// Dumplord: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Hear ye, hear ye! Royal Decree Number One: every crumb on the Crumb Trail is crown property!"], ["me", "Ow! OW! Who bit the king? Moldy Buns, that is NOT how you pay taxes!"]],
  "w1-s3": [["me", "Behold! A great crowd gathers in Gummy Gully to greet their lord! Wave, everyone!"], ["n", "Uh-oh! That's a swarm, Your Majesty!"], ["me", "Hmph! Decree Number Two: crowds must greet us LESS BITEY."]],
  "w1-s4": [["me", "A lost little Crumblet? Fear not, small one! You are now heir to the throne!"], ["me", "Snacks? Does the throne have snacks? Of COURSE the throne has snacks!"], ["me", "Royal guard, protect the heir! Oh wait, we ARE the royal guard. Very well, we accept!"]],
  "w1-s6": [["me", "A Recipe Scroll on the Spice Shelf! Surely a royal proclamation the Chef left just for us!"], ["me", "Decree Number Three: we shall fetch it ourselves. A lord runs his own errands! Today only."]],
  "w1-s7": [[0, "Are you a king? Can I be a knight? I'm not a shrimp, I'm a STRAWBERRY! Rawr!"], ["me", "Kneel, Sir Strawberry! At last, a subject who ASKED! Now help us find the hidden key."]],
  "w1-s8": [["foe", "Ha! My fortune says: \"A dumpling will be minced.\" I left a BIG guest on the Bluffs for you!"], ["me", "Decree Number Four: no mincing! This is a cutting board, not a courtroom!"]],
  "w1-s9": [["mold", "Hehehe... a little lord with no kingdom. Come to the Sink, dumpling. I'll give you a crown."], ["me", "Eep! Who said that? Decree Number Five: creepy voices must make an appointment!"]],
  // World 2: The Fridge
  "w2-s2": [["me", "Hear ye! Royal Census of the Northern Provinces! Please form an orderly queue!"], ["n", "Meanwhile, the Northern Provinces form a big, bitey swarm!"], ["me", "Decree Number Six: we need to have a little TALK about queues!"]],
  "w2-s3": [["me", "Brrr! Frosty Shelf! Even our royal steam is shivering."], ["me", "Ooh, and that lunchbox up there is BOWING to us! Nobody bows to us. Highly suspicious!"]],
  "w2-s4": [["me", "Another lost Crumblet! You are now second heir! The first heir is very proud of you."], ["me", "Mind the pressure cookers, small one. They hiss like the royal treasurer when we go shopping!"]],
  "w2-s6": [[17, "Wheee! Oops! Excuse me, is this the freezer? I'm trying to get home!"], ["me", "Not yet, small penguin! But by royal decree, you SHALL get there. Right after we grab this scroll!"]],
  "w2-s7": [["me", "Butter Bridge, packed with citizens! And they're ALL looking at us! Finally!"], ["me", "A key hides in a secret chest here. The royal treasury must grow, even by one teeny key!"]],
  "w2-s8": [["me", "Hold Ketchup Canyon forty-five seconds! Decree Number Seven: all ketchup stays in the bottle!"], ["me", "SPLORT! Hey! Who squirted the king?! That's treason in a squeezy bottle!"]],
  "w2-s9": [["me", "Ice Tray Steps? Slippery! Undignified! A lord should be CARRIED up stairs!"], ["me", "Ahem. We said, a lord should be carried. Anyone? Hello? Hmph! Fine, we'll climb. Tell no one."]],
  // World 3: The Oven
  "w3-s2": [["me", "The Bottom Rack! Warm and steamy! Ahhh, we could rule from here forever."], ["me", "Decree Number Eight: the Oven is now the royal sauna! Bacon may attend, but NO sizzling at the king."]],
  "w3-s3": [["me", "The Muffin Tin Maze! Every cup a tiny throne! But who sits on a tiny throne?"], ["n", "Uh-oh! Cereal Box Mimics, mostly!"], ["me", "Then pull the ladle lever! We shall throw a rolling pin PARADE!"]],
  "w3-s4": [["me", "A third Crumblet! The royal heirs now outnumber our subjects three to two!"], ["me", "Stay behind the royal belly, small one. It's big and VERY protective. Boing!"]],
  "w3-s6": [[15, "U-u-um, Your Majesty? C-could I help carry the scroll?"], ["me", "A volunteer?! Nobody has EVER volunteered! What do we do with our face? Is it smiling? It's smiling!"]],
  "w3-s7": [["me", "Decree Number Nine: all secret chests must be reached by bouncing on a sponge, as is tradition!"], ["me", "BOING! Why is the sponge the only one who obeys us? Never mind. There's a key up there!"]],
  "w3-s8": [["me", "Forty-five seconds on the Pizza Stone Steppe! A lord never flees. A lord steams HEROICALLY!"], ["me", "And lures monsters into pressure cookers. Also heroic! Just a teeny bit sneaky. Hee hee."]],
  "w3-s9": [["mold", "Why collect subjects, dumpling? In the Sink, everyone kneels. Forever. Hehehe."], ["me", "Kneel forever? And nobody laughs at our decrees? Ew! That sounds BORING. And lonely. Mostly boring!"]],
  // World 4: The Pantry
  "w4-s2": [["me", "Cereal Canyon! Decree Number Ten: breakfast is now served to everyone, all day long!"], ["n", "Whoa! For the first time ever, a Cheerio Blob looks interested!"]],
  "w4-s3": [["foe", "My fortune says: \"A heavy guest awaits the dumpling in the Flour Drifts.\" Hah! Just for you!"], ["me", "Duke! You can't WRITE fortunes and then make them come true! That's cheating!"]],
  "w4-s4": [["me", "The final Crumblet! Four heirs! The line of succession is getting crowded."], ["me", "Come, little one. Royal Rule One: nobody gets left behind! We just made it up. It's our best rule!"]],
  "w4-s6": [[7, "Hrrm. The scroll is far, young lord. As the ancients said: the longest roll begins with one grain."], ["me", "Ooh, very wise! We have NO idea what it means. Come along, both of us!"]],
  "w4-s7": [["me", "Pasta Jar Peaks hides the last secret key! The royal treasury shall have four keys! And a button!"], ["me", "Decree Number Eleven: all treasure shall be SHARED. Ugh. Yes. Shared. Get used to it, Dumplord."]],
  "w4-s8": [[2, "Hmph! Hold the hollow with you? Fine. But I'm NOT your subject, dumpling."], ["me", "No, no! You're our FRIEND! Way harder to get rid of. Forty-five seconds, friend!"]],
  "w4-s9": [["me", "Royal Census, final count! Subjects: two. Friends: um, we lost count! Hee hee!"], ["me", "Decree Number Twelve: nobody in OUR kitchen goes mouldy! Not today, not on our shelf!"]],
  // World 5: The Sink.
  "w5-s2": [["me", "Suds Slide! A royal waterpark! Wheee! Hold on, why is that rolling pin chasing the king?!"], ["n", "Uh-oh! It wants to roll you flat, Your Majesty!"], ["me", "Royal retreat! To the RIGHT! A lord never runs, he hurries GRACEFULLY!"]],
  "w5-s3": [["me", "Sponge Shoals! The gates locked us in! Nobody locks in the king! Except, apparently, these gates."], ["me", "Three waves of rebels? Pull the lever! Royal rolling pin, roll out the welcome!"]],
  "w5-s4": [[10, "Hmph. Dumpling. One more Crumblet needs walking over Dish Rack Ridge. Don't make me count twice."], ["me", "Heir number five! Fear not, small one! The royal belly protects all! Boing!"]],
  "w5-s6": [["me", "Bubble Bay! The final Recipe Scroll! Surely it says \"Dumplings are the best\"!"], ["me", "Seventy-five seconds on a conveyor belt! At LAST, the king is being carried! Sort of!"]],
  "w5-s7": [["me", "Decree Number Fourteen: nobody goes down the plughole! Especially not us. ESPECIALLY us."], ["me", "Secret chest on a high ledge! Bouncy sponge, our most loyal subject, launch the king! BOING!"]],
  "w5-s8": [["foe", "Psst, dumpling! My fortune says: \"The grease hates soap.\" I didn't even write this one. Honest!"], ["me", "Duke, helping?! Forty-five seconds, then we're having a long royal chat about your attitude!"]],
  "w5-s9": [["mold", "Hehehe... deeper, little lord. Down here everyone kneels, and you'll never be lonely again."], ["me", "Lonely? We've got FRIENDS now! Lots! Well, seven! Seven is LOTS!"]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Placemat Plains! Royal dining is served! Wait, why is that rolling pin rolling at the king AGAIN?!"], ["n", "Uh-oh! It still wants to roll you flat, Your Majesty!"], ["me", "Royal retreat! To the RIGHT! Gracefully! Okay, QUICKLY!"]],
  "w6-s3": [["me", "Candelabra Crossing! Decree Number Nineteen: candles may NOT drip on the king! SPLAT! Ow! Hot hot HOT!"], ["me", "Pull the lever! Royal rolling pin, roll out the red carpet! Nice and flat!"]],
  "w6-s4": [[10, "Hmph. Dumpling. This Crumblet wants to see the world. Start it on Gravy Boat Bay. Don't spill it."], ["me", "Heir number six! Behold, small one, the world! It's mostly gravy! Stay behind the royal belly!"]],
  "w6-s6": [["me", "Teacup Terrace! A royal tea party! With a Recipe Scroll for afters!"], ["lo2", "Fie! Thou art not invited, dumpling! Teapot Nannies, pour him OUT!"], ["me", "How RUDE! We're grabbing the scroll AND staying for crumpets!"]],
  "w6-s7": [["me", "Napkin Fold Fort! A castle made of napkins! Ooh, can we keep it? It's so wipeable!"], ["me", "Secret chest on a high ledge! Sponge, our most loyal subject, you know the drill! BOING!"]],
  "w6-s8": [["me", "Silverware Siege! Decree Number Twenty: forks are for EATING, not for poking kings!"], ["me", "Forty-five seconds! A lord never flees. A lord steams HEROICALLY! Again!"]],
  "w6-s9": [["lo2", "Hark! Climbest thou my chandelier, little king? Up here thou art but a wee dumpling!"], ["me", "A wee dumpling with a BIG crown! Well, a medium crown. Made of dough! Still counts!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "Hose Highway! A royal water slide! Wait, why is THAT rolling pin here too?! Does it follow the king everywhere?"], ["n", "Uh-oh! It's a big fan, Your Majesty!"], ["me", "Royal retreat! To the RIGHT! Gracefully! Okay, QUICKLY!"]],
  "w7-s3": [["me", "Sprinkler Springs! Decree Number Twenty-Four: no fwooshing the king! FWOOSH! Hmph. Nobody listens."], ["me", "Pull the lever! Royal rolling pin, mow the royal lawn! Nice and flat!"]],
  "w7-s4": [[10, "Hmph. Dumpling. This Crumblet wants a swim. Walk it round the Paddling Pool Pier. Don't lose it."], ["me", "Heir number seven! Behold, small one, the royal pool! Stay behind the royal belly. It floats! Boing!"]],
  "w7-s6": [["me", "Picnic Table Peak! A royal picnic! Sandwiches, lemonade, and a Recipe Scroll for pudding!"], ["lo2", "Fie! Thou art not invited to this picnic either, dumpling! The Baron shall grill thee!"], ["me", "Decree Number Twenty-Five: we're ALWAYS invited! Grab the scroll and hold the table!"]],
  "w7-s7": [["me", "Flowerpot Fort! A castle of flowerpots, and every tower has a daisy on top! We LOVE it!"], ["me", "Secret chest on a high ledge! Sponge, our most loyal subject, launch the king! BOING!"]],
  "w7-s8": [[18, "In THIS corner, a teeny dumpling king! Ding ding! Need a sparring partner, Your Shortness?"], ["me", "Your SHORTNESS?! Decree Number Twenty-Six: hold the canyon forty-five seconds, THEN you may bow!"], [18, "Bow? I'll HOP! Let's go, champ! We knead to win!"]],
  "w7-s9": [["n", "From the Grill Summit, a voice booms: \"Sprout Soldiers, FORM UP! The dumpling goes on the grill!\""], ["me", "The GRILL? We're steamed, not grilled! Decree Number... oh, never mind, just CLIMB!"]],
  // World 8: The Garden.
  "w8-s2": [["me", "Watering Can Run! A royal fountain! Wait, why is that rolling pin in the GARDEN now?!"], ["n", "Uh-oh! It's your biggest fan, Your Majesty! It follows you everywhere!"], ["me", "Royal retreat! To the RIGHT! Gracefully! Okay, QUICKLY!"]],
  "w8-s3": [["me", "Sunflower Grove! Decree Number Thirty: flowers may NOT sneeze on the king! AH-CHOO! Hmph. That was us."], ["me", "Pull the lever! Royal rolling pin, flatten the flowerbeds! Er, just the monsters, please!"]],
  "w8-s4": [[10, "Hmph. Dumpling. This Crumblet wants to see a garden. Walk it through the Pumpkin Patch. Don't lose it."], ["me", "Heir number eight! Behold, small one, the royal pumpkins! Stay behind the royal belly! Boing!"]],
  "w8-s6": [["me", "Beanstalk Heights! A Recipe Scroll at the very top! Good. A king belongs up high anyway!"], ["lo2", "Fie! Nobody invited thee to the Garden, dumpling! The Meatloaf wanteth thee not!"], ["me", "Decree Number Thirty-One: the king invites HIMSELF! Grab the scroll and hold the beanstalk!"]],
  "w8-s7": [["me", "Compost Keep! Pee-yew! A castle made of old peels! We are NOT keeping this one."], ["me", "Secret chest on a high ledge! Sponge, our most loyal subject, launch the king! BOING!"]],
  "w8-s8": [[9, "Hello, little king! *POP* Elephants never forget! Um, who are you again?"], ["me", "Dumplord, Lord of All Leftovers! Hold the Scarecrow Stand forty-five seconds with us and you shall be a duke!"], [9, "A duke? Ooh! Let's stick together! Wait, what are we doing?"]],
  "w8-s9": [["n", "From the old Greenhouse, a voice mumbles: \"A king? Coming for ME? Nobody EVER comes for me!\""], ["me", "Decree Number Thirty-Two: somebody's coming for you NOW! Up the steps! Royally!"]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "Trolley Track! A royal carriage, at LAST! Wait, why is that rolling pin doing the shopping too?!"], ["n", "Uh-oh! It's your biggest fan, Your Majesty! It even follows you to the shops!"], ["me", "Royal retreat! To the RIGHT! Gracefully! Okay, QUICKLY!"]],
  "w9-s3": [["me", "Cereal Aisle! Decree Number Thirty-Six: every cereal box must have a free prize, and the prize is US!"], ["me", "Pull the lever! Royal rolling pin, clean-up on aisle nine! Nice and flat!"]],
  "w9-s4": [[10, "Hmph. Dumpling. My Crumblet got lost in Fruit and Veg. Walk it to the exit. Don't let anybody bag it."], ["me", "Heir number nine! Behold, small one, the royal greengrocer! Stay behind the royal belly! Boing!"]],
  "w9-s6": [["me", "Bakery Bluff! Buns, rolls AND a Recipe Scroll! Ooh, our royal cousins!"], ["lo2", "Fie! Thou art not invited to the bakery, dumpling! Thou art well past thy best before!"], ["me", "Decree Number Thirty-Seven: dumplings NEVER expire! Grab the scroll and hold the bakery!"]],
  "w9-s7": [["me", "Canned Goods Keep! So many tins, and nobody's opened them either! Fear not, little cans! Later!"], ["me", "Secret chest on a high ledge! Sponge, our most loyal subject, launch the king! BOING!"]],
  "w9-s8": [[3, "Wibble wobble! A king! Your Majesty, is there a dessert table at your court? I'm never invited!"], ["me", "Never invited?! Hold Checkout Chaos forty-five seconds with us and you get the FRONT row!"], [3, "Eeee! I'm all a-jiggle! Let's check 'em OUT!"]],
  "w9-s9": [["n", "From the Frozen Aisle, a voice wails: \"Woooo! A king? Coming to open ME? Nobody opens me!\""], ["me", "Somebody's opening you NOW! Into the frosty aisle! Royally! Brrr, royally and QUICKLY!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Royal decree: you're DONE!", "Steamed, stuffed and served!", "Bow! Or fall over. That works."],
  lowhp: ["The crown is getting SOGGY!", "Guards! Oh wait, we're the guards!", "Somebody fan the royal steam!"],
  perfect: ["Nobody touches the king!", "Royal dodge! So graceful!", "You missed! Kneel in shame!"],
  levelup: ["All hail a bigger Dumplord!", "Extra filling acquired!", "Promoted! By us. To us!"],
  secret: ["To the royal treasury!", "Tribute! At LAST, tribute!", "Hidden loot? Crown loot now!"],
  boom: ["Royal fireworks! How festive!", "Steamrolled, by decree!", "Rolled flat like good dough!"],
  mimic: ["Treason! That box has TEETH!", "You are NOT royal tribute!", "A rebel box! Seize it!"],
  objective: ["Decree fulfilled! Hooray!", "Done! Sound the trumpets!", "Toot toot! That's us trumpeting."],
};
