// Dumplord: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Hear ye, hear ye! Royal Decree Number One: every crumb on the Crumb Trail is crown property!"], ["me", "Ow! OW! Who bit the king? Moldy Buns, that is NOT how you pay taxes!"]],
  "w1-s3": [["me", "Behold! A great crowd gathers in Gummy Gully to greet their lord! Wave, everyone!"], ["n", "Uh-oh! That's a swarm, Your Majesty!"], ["me", "Hmph! Decree Number Two: crowds must greet us LESS BITEY."]],
  "w1-s4": [["me", "A lost little Crumblet? Fear not, small one! You are now heir to the throne!"], ["me", "Snacks? Does the throne have snacks? Of COURSE the throne has snacks!"], ["me", "Royal guard, protect the heir! Oh wait, we ARE the royal guard. Very well, we accept!"]],
  "w1-s6": [["me", "A Recipe Scroll high on the Spice Shelf! Surely a royal proclamation the Chef left just for us!"], ["me", "Decree Number Three: we shall fetch it ourselves, before time runs out! A lord runs his own errands! Today only."]],
  "w1-s7": [[0, "Are you a king? Can I be a knight? I'm not a shrimp, I'm a STRAWBERRY! Rawr!"], ["me", "Kneel, Sir Strawberry! At last, a subject who ASKED! Now help us find the hidden key."]],
  "w1-s8": [["foe", "Ha! My fortune says: \"A dumpling will be minced.\" I left a BIG guest on the Bluffs for you!"], ["me", "Decree Number Four: no mincing! This is a cutting board, not a courtroom!"]],
  "w1-s9": [["mold", "Hehehe... a little lord with no kingdom. Come to the Sink, dumpling. I'll give you a crown."], ["me", "Eep! Who said that? Decree Number Five: creepy voices must make an appointment!"]],
  // World 2: The Fridge
  "w2-s2": [["me", "Hear ye! Royal Census of the Northern Provinces! Please form an orderly queue!"], ["n", "Meanwhile, the Northern Provinces form a big, bitey swarm!"], ["me", "Decree Number Six: we need to have a little TALK about queues!"]],
  "w2-s3": [["me", "Brrr! Frosty Shelf! Even our royal steam is shivering."], ["me", "Ooh, and that lunchbox up there is BOWING to us! Nobody bows to us. Highly suspicious!"]],
  "w2-s4": [["me", "Another lost Crumblet! You are now second heir! The first heir is very proud of you."], ["me", "Mind the slippy ice, small one. And hide when we meet the King Milk Carton Rammer. He's a FAKE king!"]],
  "w2-s6": [[17, "Wheee! Oops! Excuse me, is this the freezer? I'm trying to get home!"], ["me", "Not yet, small penguin! But by royal decree, you SHALL get there. Right after we grab this scroll, quick quick!"]],
  "w2-s7": [["me", "Butter Bridge, packed with citizens! And they're ALL looking at us! Finally!"], ["me", "A key hides in a secret chest here. The royal treasury must grow, even by one teeny key!"]],
  "w2-s8": [["me", "Hold Ketchup Canyon, everyone! Decree Number Seven: all ketchup stays in the bottle!"], ["me", "SPLORT! Hey! Who squirted the king?! That's treason in a squeezy bottle!"]],
  "w2-s9": [["me", "Ice Tray Steps? Slippery! Undignified! A lord should be CARRIED up stairs!"], ["me", "Ahem. We said, a lord should be carried. Anyone? Hello? Hmph! Fine, we'll climb. Tell no one."]],
  // World 3: The Oven
  "w3-s2": [["me", "The Bottom Rack! Warm and steamy! Ahhh, we could rule from here forever."], ["me", "Decree Number Eight: the Oven is now the royal sauna! Bacon may attend, but NO sizzling at the king."]],
  "w3-s3": [["me", "The Muffin Tin Maze! Every cup a tiny throne! But who sits on a tiny throne?"], ["n", "Uh-oh! Lunchbox Mimics, mostly!"], ["me", "Then bop them! And somebody wake the Pizza Peel Paladin. We demand a royal pizza!"]],
  "w3-s4": [["me", "A third Crumblet! The royal heirs now outnumber our subjects three to two!"], ["me", "Stay behind the royal belly, small one. It's big and VERY protective. Boing!"]],
  "w3-s6": [[15, "U-u-um, Your Majesty? C-could I help carry the scroll?"], ["me", "A volunteer?! Nobody has EVER volunteered! What do we do with our face? Is it smiling? It's smiling!"]],
  "w3-s7": [["me", "Decree Number Nine: all secret chests must be reached by bouncing on a sponge, as is tradition!"], ["me", "BOING! Why is the sponge the only one who obeys us? Never mind. There's a key up there!"]],
  "w3-s8": [["me", "Hold the Pizza Stone Steppe, everyone! A lord never flees. A lord steams HEROICALLY!"], ["me", "And a King Kettle Turret waits at the end? Two kings, one steppe? We'll see whose steam is steamier!"]],
  "w3-s9": [["mold", "Why collect subjects, dumpling? In the Sink, everyone kneels. Forever. Hehehe."], ["me", "Kneel forever? And nobody laughs at our decrees? Ew! That sounds BORING. And lonely. Mostly boring!"]],
  // World 4: The Pantry
  "w4-s2": [["me", "Cereal Canyon! Decree Number Ten: breakfast is now served to everyone, all day long!"], ["n", "Whoa! For the first time ever, a Cheerio Blob looks interested!"]],
  "w4-s3": [["foe", "My fortune says: \"A heavy guest awaits the dumpling in the Flour Drifts.\" Hah! Just for you!"], ["me", "Duke! You can't WRITE fortunes and then make them come true! That's cheating!"]],
  "w4-s4": [["me", "The final Crumblet! Four heirs! The line of succession is getting crowded."], ["me", "Come, little one. Royal Rule One: nobody gets left behind! We just made it up. It's our best rule!"]],
  "w4-s6": [[7, "Hrrm. The scroll is far, young lord. As the ancients said: the longest roll begins with one grain."], ["me", "Ooh, very wise! We have NO idea what it means. Come along, both of us!"]],
  "w4-s7": [["me", "Pasta Jar Peaks hides the last secret key! The royal treasury shall have four keys! And a button!"], ["me", "Decree Number Eleven: all treasure shall be SHARED. Ugh. Yes. Shared. Get used to it, Dumplord."]],
  "w4-s8": [[2, "Hmph! Hold the hollow with you? Fine. But I'm NOT your subject, dumpling."], ["me", "No, no! You're our FRIEND! Way harder to get rid of. Hold fast, friend!"]],
  "w4-s9": [["me", "Royal Census, final count! Subjects: two. Friends: um, we lost count! Hee hee!"], ["me", "Decree Number Twelve: nobody in OUR kitchen goes mouldy! Not today, not on our shelf!"]],
  // World 5: The Sink.
  "w5-s2": [["me", "A royal waterpark! Wheee! Hold on, why are the taps dripping on the king?!"], ["n", "Uh-oh! They're taking aim, Your Majesty!"], ["me", "Royal retreat! Dodge the drips! A lord never runs, he hurries GRACEFULLY!"]],
  "w5-s3": [["me", "A Plunger Paladin? A knight who unclogs drains? Finally, a knight with a USEFUL job!"], ["me", "But first, that lunchbox with teeth. Rebels, every one of them! Bop it!"]],
  "w5-s4": [[10, "Hmph. Dumpling. One more Crumblet needs walking over Dish Rack Ridge. Don't make me count twice."], ["me", "Heir number five! Fear not, small one, the royal belly protects all! Boing!"]],
  "w5-s6": [["me", "Ooh, the final Recipe Scroll! Surely it says \"Dumplings are the best\"!"], ["me", "Way up in the bubbles, and the clock is ticking? Up, royal belly, UP! Boing!"]],
  "w5-s7": [["me", "Decree Number Fourteen: nobody goes down the plughole! Especially not us. ESPECIALLY us."], ["me", "See that chest on the high ledge? The bouncy sponge shall launch us up! It is our most loyal subject. BOING!"]],
  "w5-s8": [["foe", "Psst, dumpling! My fortune says: \"The grease hates soap.\" I didn't even write this one. Honest!"], ["me", "Duke, helping?! We hold out first, then we're having a long royal chat about your attitude!"]],
  "w5-s9": [["mold", "Hehehe... deeper, little lord. Down here everyone kneels, and you'll never be lonely again."], ["me", "Lonely? We've got FRIENDS now! Lots! Well, seven! Seven is LOTS!"]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Royal dining is served! Wait, why is that gravy boat sailing at the king?!"], ["n", "Uh-oh! It's a Gravy Boat Rammer, Your Majesty! It wants to ram you flat!"], ["me", "Royal retreat! Gracefully! Okay, QUICKLY! And grab its Gravy Drops on the way!"]],
  "w6-s3": [["me", "Decree Number Nineteen: candles may NOT drip on the king! SPLAT! Ow! Hot hot HOT!"], ["me", "And a Teapot Tyrant? There's only room for one tyrant here, and it's... wait, we're not a tyrant. We're NICE!"]],
  "w6-s4": [[10, "Hmph. Dumpling. This Crumblet wants to see the world. Start it on the gravy boats. Don't spill it."], ["me", "Heir number six! Behold, small one, the world! It's mostly gravy, but we're told it gets better!"]],
  "w6-s6": [["me", "A royal tea party! With a Recipe Scroll for afters!"], ["lo2", "Fie! Thou art not invited, dumpling! Teapot Nannies, pour him OUT!"], ["me", "How RUDE! We're grabbing the scroll before time runs out AND staying for crumpets!"]],
  "w6-s7": [["me", "A castle made of napkins! Ooh, can we keep it? It's so wipeable!"], ["me", "And there's the royal sponge, waiting by the key chest like a faithful hound. Launch the king, good sponge! BOING!"]],
  "w6-s8": [["me", "Decree Number Twenty: forks are for EATING, not for poking kings!"], ["me", "A whole crowd of pointy rebels? Hmph! We shall hold out and steam at them HEROICALLY!"]],
  "w6-s9": [["lo2", "Hark! Climbest thou my chandelier, little king? Up here thou art but a wee dumpling!"], ["me", "A wee dumpling with a BIG crown! Well, a medium crown. Made of dough! Still counts!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "A royal water slide! Wait, why are those wasps buzzing at the king?! Do they follow us everywhere?"], ["n", "Uh-oh! They're Picnic Wasps, Your Majesty! Big fans!"], ["me", "We don't sign autographs for wasps! We'll take a Wasp Stinger, though. RUN!"]],
  "w7-s3": [["me", "Decree Number Twenty-Four: no fwooshing the king! FWOOSH! Hmph. Nobody listens."], ["me", "And a Spatula Sheriff? Hmph! In OUR kingdom, the king makes the laws! Somebody flip him!"]],
  "w7-s4": [[10, "Hmph. Dumpling. This Crumblet wants a swim. Walk it round the pool pier. Don't lose it."], ["me", "Heir number seven, the royal pool awaits! Don't worry, the royal belly floats. We think."]],
  "w7-s6": [["me", "A royal picnic! Sandwiches, lemonade, and a Recipe Scroll for pudding!"], ["lo2", "Fie! Thou art not invited to this picnic either, dumpling! The Baron shall grill thee!"], ["me", "Decree Number Twenty-Five: we're ALWAYS invited! Grab the scroll before time runs out!"]],
  "w7-s7": [["me", "A castle of flowerpots, and every tower has a daisy on top! We LOVE it!"], ["me", "Oh, look who came outside! It's our most loyal subject, the sponge! You remember the drill. BOING!"]],
  "w7-s8": [[18, "In THIS corner, a teeny dumpling king! Ding ding! Need a sparring partner, Your Shortness?"], ["me", "Your SHORTNESS?! Decree Number Twenty-Six: help us hold the canyon, THEN you may bow!"], [18, "Bow? I'll HOP! Let's go, champ! We knead to win!"]],
  "w7-s9": [["n", "From the Grill Summit, a voice booms: \"Sprout Soldiers, FORM UP! The dumpling goes on the grill!\""], ["me", "The GRILL? We're steamed, not grilled! Decree Number... oh, never mind, just CLIMB!"]],
  // World 8: The Garden.
  "w8-s2": [["me", "A royal fountain! Wait. We hear snapping. We do NOT like that snapping."], ["n", "Uh-oh! It's a Snapdragon, Your Majesty! Asleep, for now!"], ["me", "Decree Number Twenty-Nine and a Half: dragons need an APPOINTMENT! Tiptoe!"]],
  "w8-s3": [["me", "Decree Number Thirty: flowers may NOT sneeze on the king! AH-CHOO! Hmph. That was us."], ["me", "And a Watering Can Wizard? No watering the king! We are steamed, not soggy!"]],
  "w8-s4": [[10, "Hmph. Dumpling. This Crumblet wants to see a garden. Walk it through the pumpkins. Don't lose it."], ["me", "Heir number eight! Ooh, a pumpkin as big as our castle! Stay close, small one, the moles are rude here."]],
  "w8-s6": [["me", "A Recipe Scroll at the very top of the beanstalk! Good. A king belongs up high anyway!"], ["lo2", "Fie! Nobody invited thee to the Garden, dumpling! The Meatloaf wanteth thee not!"], ["me", "Decree Number Thirty-One: the king invites HIMSELF! Up the beanstalk, before time runs out!"]],
  "w8-s7": [["me", "Pee-yew! A castle made of old peels! We are NOT keeping this one."], ["me", "The sponge is here AGAIN? Such loyalty! We shall knight you, Sir Squishy. Now, up to that key! BOING!"]],
  "w8-s8": [[9, "Hello, little king! *POP* Elephants never forget! Um, who are you again?"], ["me", "Dumplord, Lord of All Leftovers! Hold this spot with us till the monsters stop, and you shall be a duke!"], [9, "A duke? Ooh! Let's stick together! Wait, what are we doing?"]],
  "w8-s9": [["n", "From the old Greenhouse, a voice mumbles: \"A king? Coming for ME? Nobody EVER comes for me!\""], ["me", "Decree Number Thirty-Two: somebody's coming for you NOW! Up the steps! Royally!"]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "A royal carriage, at LAST! Wait, why is that trolley charging at the king?!"], ["n", "Uh-oh! It's a Trolley Rammer, Your Majesty! No brakes!"], ["me", "Clean-up on aisle KING! Retreat, retreat! And somebody grab its wheel!"]],
  "w9-s3": [["me", "Decree Number Thirty-Six: every cereal box must have a free prize, and the prize is US!"], ["me", "And a Cash Register Golem! Hmph! Royalty never PAYS! Ka-ching, rebels!"]],
  "w9-s4": [[10, "Hmph. Dumpling. My Crumblet got lost in the fruit and veg. Walk it to the exit. Don't let anybody bag it."], ["me", "Heir number nine! Fear not, small one, nobody bags royalty. Stay away from the grumpy bananas!"]],
  "w9-s6": [["me", "Buns, rolls AND a Recipe Scroll! Ooh, our royal cousins!"], ["lo2", "Fie! Thou art not invited to the bakery, dumpling! Thou art well past thy best before!"], ["me", "Decree Number Thirty-Seven: dumplings NEVER expire! Grab the scroll before the clock does!"]],
  "w9-s7": [["me", "So many tins, and nobody's opened them either! Fear not, little cans! We'll get to you later!"], ["me", "Sir Squishy! You came shopping! Up to the key chest, faithful sponge! BOING!"]],
  "w9-s8": [[3, "Wibble wobble! A king! Your Majesty, is there a dessert table at your court? I'm never invited!"], ["me", "Never invited?! Hold the checkout with us till the rush is over, and you get the FRONT row!"], [3, "Eeee! I'm all a-jiggle! Let's check 'em OUT!"]],
  "w9-s9": [["n", "From the Frozen Aisle, a voice wails: \"Woooo! A king? Coming to open ME? Nobody opens me!\""], ["me", "Somebody's opening you NOW! Into the frosty aisle! Royally! Brrr, royally and QUICKLY!"]],
  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Royal preserves! Wait, why is there a soup in the FRIDGE that nobody remembers?!"], ["n", "Uh-oh! It's the Forgotten Soup, Your Majesty! And it looks lonely!"], ["me", "Then it can join the feast! After we bop it. One last royal charge!"]],
  "w10-s3": [["me", "Decree Number Forty-Two: every takeaway box gets taken AWAY! To a party!"], ["me", "A Banquet Butler! At last, a butler! Fetch our slippers! No? Then have at thee!"]],
  "w10-s4": [[10, "Hmph. Dumpling. This is the last Crumblet. The very last one. Walk it down the frosty falls."], ["me", "Heir number ten! The FINAL heir! We'll walk you all the way, small one, belly first!"], [10, "Hmph. And it gets a front-row seat at that feast. Royal decree. MY decree."]],
  "w10-s6": [["me", "Party decorations, dusty and droopy and ROYALLY sad. We'll fix that!"], ["lo2", "Take yon scroll, little king. I am beaten. Thou mayest even dub me Sir Fresh. Just this once."], ["me", "Arise, Sir Fresh! Decree Number Forty-Three: grab the scroll before time runs out!"]],
  "w10-s7": [["me", "Jars nobody's opened in AGES! Fear not, little jars! You're on the guest list!"], ["me", "Sir Squishy, our oldest and squishiest friend! One last royal launch! BOING!"]],
  "w10-s8": [[3, "Wibble wobble! Your Majesty! Is it true? Is there finally a DESSERT table?"], ["me", "Front row, as promised! Just hold the line with us first!"], [3, "Eeee! I'm set for success! That's the jiggle of it!"]],
  "w10-s9": [["lo", "Heh heh. The little king made it. Come sit at my long, empty table. Your stale seat is waiting."], ["me", "Decree Number Forty-Four: no seat stays empty! Up to the table! Royally! Okay, QUICKLY!"]],
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
