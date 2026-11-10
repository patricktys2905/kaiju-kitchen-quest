// Dumplord: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop
  "w1-s2": [["me", "Royal Decree Number One: every crumb on the Crumb Trail is now crown property!"], ["n", "The crumbs did not respond. The Moldy Buns responded by biting."]],
  "w1-s3": [["me", "Behold! A great crowd gathers in Gummy Gully to greet their lord!"], ["n", "It was a swarm. They were not greeting him."], ["me", "Decree Number Two: crowds must greet me LESS VIOLENTLY."]],
  "w1-s4": [["me", "A lost little Crumblet? Fear not, small one. You are now heir to the throne!"], ["n", "The Crumblet asked if the throne had snacks. Dumplord, deeply moved, promised it did."], ["me", "Royal guard, protect the heir! ...I am the royal guard. Very well. I accept the post."]],
  "w1-s6": [["me", "A Recipe Scroll on the Spice Shelf! Surely a royal proclamation the Chef left for me."], ["me", "Decree Number Three: I shall fetch it myself. A lord runs his own errands. Today only."]],
  "w1-s7": [[0, "Are you a king? Can I be a knight? I'm not a shrimp, I'm a strawberry!"], ["me", "Kneel, Sir Strawberry! ...At last, a subject who ASKED. Now help me find the hidden key."]],
  "w1-s8": [["foe", "My fortune says: \"A dumpling will be minced.\" I left a large guest on the Bluffs for you."], ["me", "Decree Number Four: no mincing! This is a cutting board, not a court of law!"]],
  "w1-s9": [["mold", "A little lord with no kingdom. Come to the Sink, dumpling. I will give you a crown."], ["me", "Who said that? Decree Number Five: creepy voices must make an appointment."]],
  // World 2: The Fridge
  "w2-s2": [["me", "Royal Census of the Northern Provinces! Please form an orderly queue!"], ["n", "They formed a swarm. Swarms are not queues."], ["me", "Decree Number Six: we are going to have to talk about queues."]],
  "w2-s3": [["me", "Frosty Shelf. Even my royal steam is shivering."], ["me", "And a lunchbox up there bows to me. Nobody bows to me. Most suspicious."]],
  "w2-s4": [["me", "Another lost Crumblet! You are now second heir. The first heir is very proud of you."], ["me", "Mind the pressure cookers, small one. They hiss like the royal treasurer when I go shopping."]],
  "w2-s6": [[17, "Excuse me, is this the freezer? I'm trying to get home!"], ["me", "Not yet, small penguin. But by royal decree, you shall get there! After I fetch this scroll."]],
  "w2-s7": [["me", "Butter Bridge, heaving with citizens! At least they're all looking at me."], ["me", "A key hides in a secret chest here. The royal treasury must grow. Even by one key."]],
  "w2-s8": [["me", "Hold Ketchup Canyon forty-five seconds! Decree Number Seven: all ketchup stays in the bottle."], ["n", "It did not. It never does."]],
  "w2-s9": [["me", "Ice Tray Steps. Slippery. Undignified. A lord should be carried up stairs."], ["n", "Nobody offered."], ["me", "Fine. I shall climb. Tell no one."]],
  // World 3: The Oven
  "w3-s2": [["me", "The Bottom Rack! Warm, steamy, delightful. I could rule from here forever."], ["me", "Decree Number Eight: the Oven is now the royal sauna. Bacon may attend, but must stop sizzling at me."]],
  "w3-s3": [["me", "The Muffin Tin Maze. Every cup a tiny throne. But who sits on a tiny throne?"], ["n", "Cereal Box Mimics, mostly."], ["me", "Then I shall pull the ladle lever and hold a rolling pin parade!"]],
  "w3-s4": [["me", "A third Crumblet! The royal heirs now outnumber my subjects three to two."], ["me", "Stay behind the royal belly, small one. It is large, and very protective."]],
  "w3-s6": [[15, "U-um, Your Majesty? Could I... help carry the scroll?"], ["me", "A volunteer! Nobody has ever VOLUNTEERED. I don't know what to do with my face."]],
  "w3-s7": [["me", "Decree Number Nine: all secret chests must be reached by bouncing on a sponge, as is tradition."], ["me", "Why is the sponge the only one in this kitchen who obeys me? Never mind. There's a key up there."]],
  "w3-s8": [["me", "Forty-five seconds on the Pizza Stone Steppe. A lord does not flee. A lord steams heroically."], ["me", "And lures monsters into pressure cookers. Also heroic. Slightly sneaky."]],
  "w3-s9": [["mold", "Why collect subjects, dumpling? In the Sink, everyone kneels. Forever."], ["me", "...Kneeling forever? Nobody laughing at my decrees? That sounds lonely. Even for a lord."]],
  // World 4: The Pantry
  "w4-s2": [["me", "Cereal Canyon! Decree Number Ten: breakfast is now served to everyone, at all hours."], ["n", "For the first time ever, a Cheerio Blob looked interested."]],
  "w4-s3": [["foe", "My fortune says: \"A heavy guest awaits the dumpling in the Flour Drifts.\" Written just for you."], ["me", "Duke, you can't write fortunes and then MAKE them come true! That's cheating!"]],
  "w4-s4": [["me", "The final Crumblet! Four heirs. The line of succession is getting crowded."], ["me", "Come, little one. Royal rule one: nobody gets left behind. I made it up just now. It's my best rule."]],
  "w4-s6": [[7, "The scroll is far, young lord. As the ancients said: the longest roll begins with one grain."], ["me", "Very wise! I have no idea what it means. Come along, both of us!"]],
  "w4-s7": [["me", "Pasta Jar Peaks hides the last secret key. The royal treasury shall have four keys! And a button."], ["me", "Decree Number Eleven: the treasure shall be SHARED. Yes. Shared. Get used to it, Dumplord."]],
  "w4-s8": [[2, "Hold the hollow with you? Fine. But I'm not your subject, dumpling."], ["me", "No, no. You are my FRIEND. Much harder to get rid of. Forty-five seconds, friend!"]],
  "w4-s9": [["me", "Royal Census, final count: subjects, two. Friends... I lost count. A wonderful problem."], ["me", "Decree Number Twelve: nobody in my kitchen goes mouldy. Not today. Not on my shelf."]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Royal decree: you're all done!", "Steamed, stuffed and served!", "Bow! ...Or fall over. Fine."],
  lowhp: ["The crown... is getting soggy...", "Guards! I am the guards! Help!", "Someone fan the royal steam!"],
  perfect: ["A lord is never touched!", "Royal dodge. Very graceful.", "You missed. Kneel in shame."],
  levelup: ["All hail a stronger Dumplord!", "Extra filling acquired!", "Promoted! By me. To me."],
  secret: ["To the royal treasury!", "Tribute! At last, tribute!", "Hidden loot? Crown loot now."],
  boom: ["Royal fireworks! How festive!", "Steamrolled, by decree!", "Rolled flat, like good dough."],
  mimic: ["Treason! That box has teeth!", "You are NOT royal tribute!", "A rebel box! Seize it!"],
  objective: ["Decree fulfilled!", "Done! Sound the trumpets!", "Toot toot! That's me. Trumpeting."],
};
