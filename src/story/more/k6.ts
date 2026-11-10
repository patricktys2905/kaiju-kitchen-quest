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
