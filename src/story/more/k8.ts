// Chocomunch: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop. Sunny, soft, scared, brave anyway.
  "w1-s2": [["me", "Crumb trail. Me follow crumbs. Crumbs lead to snack. ...Or crumbs lead to trap."], ["n", "It is a trap. Something extra big is waiting up the trail."], ["me", "Me knew it. Me punch trap."]],
  "w1-s3": [["me", "Gummy gully. Sticky. Me stuck to floor a little. Me fine."], ["me", "Big ladle on wall. Me pull ladle, rolling pin go BONK. Me like bonk."]],
  "w1-s4": [["n", "A tiny Crumblet tugs at Chocomunch's leg. It is lost."], ["me", "Little muffin follow me. Me big. Me safe. Stay away from toaster. Toaster hot."], ["me", "Pot go hiss? Pot go BOOM. Me send bad guys to pot, not muffin."]],
  "w1-s6": [["me", "Chef recipe scroll at end of shelf. Me fetch. Me fast. Me... medium fast."], ["n", "The spice jars rattle. A LOT of monsters are pouring off the shelf."], ["me", "Me count bad guys. One, two... many. Me punch many."]],
  "w1-s7": [["me", "Pepper Pass. Pepper make me sneeze. Sneeze make me... AH-CHOO! ...Me fine."], ["me", "Chef hide key in high chest. Me find sponge. Me bounce. Me reach."]],
  "w1-s8": [["foe", "Hold out as long as you like, golem. I'll be warming up the Oven for you!"], ["me", "Me hold forty-five... forty-five... me hold LONG time."]],
  "w1-s9": [["me", "Burners ahead. Me feel soft. Me feel like pudding."], ["mold", "Melt, little golem. Melting is so... relaxing."], ["me", "Who say that? ...Me not relax. Me PUNCH."]],
  // World 2: The Fridge. Firm, crunchy, happy, tempted to stay.
  "w2-s2": [["me", "Dairy Lane. Milk everywhere. Me chocolate. Chocolate plus milk... me become DRINK?!"], ["me", "No. Me stay golem. Me punch milk carton instead."]],
  "w2-s3": [["n", "The fridge light flickers... and goes out. Even the monsters look tougher in the dark."], ["me", "Light only go off when door close. Who close door?"], ["me", "Dark and cold. Me crunchy AND scared. Me punch anyway."]],
  "w2-s4": [[10, "Chocomunch! That's one of my Crumblets. Would you walk it to the exit for me?"], ["me", "Me walk muffin. Me best muffin-walker. Pressure pot loud. Me handle pot."]],
  "w2-s6": [["me", "Egg carton cliffs. Many eggs. Many MANY bad guys. Whole fridge come to party."], ["me", "Recipe scroll at far end. Me run, me grab, me hold. Easy as punch."]],
  "w2-s7": [["me", "Butter Bridge. Butter soft. Me soft once. Now me crunchy. Me feel very fancy."], ["me", "Key in high chest. Me bounce on sponge. Sponge squishy. Me not squishy. Ha."]],
  "w2-s8": [["me", "Ketchup Canyon. Red everywhere. Me not like how this look."], ["n", "Waves of monsters roll down the canyon walls. Hold the line for 45 seconds."], ["me", "Me plant feet. Me become wall. Chocolate wall."]],
  "w2-s9": [["mold", "Why leave the cold, little golem? Stay where you are firm. Stay forever."], ["me", "Fridge nice. Fridge VERY nice. ...Me think about staying."], ["me", "No. Chef note say Oven. Me climb steps."]],
  // World 3: The Oven. Cubey the ice cube, slowly giving everything.
  "w3-s2": [["me", "Ice from Freezer Golem in pocket. Me name ice Cubey. Cubey keep me cool."], ["n", "The bottom rack is crawling. Monsters swarm in from every slot."], ["me", "Hot AND crowded. Me hate this sauna."]],
  "w3-s3": [["me", "Muffin tin maze. Every cup look same. Me lost. Cubey also lost."], ["me", "Cereal box over there. Me no trust box. Box look... hungry."]],
  "w3-s4": [["me", "Little muffin in OVEN?! Muffin get crispy! Me carry quick!"], ["n", "The Crumblet seems perfectly fine. Muffins are, after all, built for ovens."], ["me", "...Muffin braver than me. Me still walk muffin home."]],
  "w3-s6": [["me", "Cookie sheet. Flat. Hot. Me think about chocolate chip cookies. Poor chips."], ["me", "Cubey small now. Me grab recipe fast, before Cubey gone."]],
  "w3-s7": [[15, "Ch-Chocomunch! You look a bit... glossy. I'll fan you with my spikes!"], ["me", "Spikes bad fan. Spikes good effort. Thank you, friend."], ["me", "Now me bounce to high chest. Key inside. Me cool enough. Just."]],
  "w3-s8": [["me", "Cubey... gone. Cubey give everything for me."], ["n", "A single drop of water sizzles on the pizza stone. Chocomunch salutes."], ["me", "Me hold forty-five seconds. For Cubey."]],
  "w3-s9": [["me", "Top rack. Hottest rack. Me sweating chocolate. Me not look at puddle."], ["foe", "Almost at the Broiler, golem! I'll save you a fondue fork!"], ["me", "NO FONDUE. Me say it before. Me say it again."]],
  // World 4: The Pantry. Firm again, braver, closer to the Chef.
  "w4-s2": [["me", "Pantry cool and dry. Me firm again. Me punch extra good today."], ["me", "Cheerios roll at me. Me no eat. ...Me eat one. For strength."]],
  "w4-s3": [["me", "Flour everywhere. Look like snow. Me make flour friend."], ["n", "The flour friend is, unfortunately, a Flour Ghost."], ["me", "Bad friend. Me pull ladle. Rolling pin flatten bad friend."]],
  "w4-s4": [["n", "The pantry door swings shut. Lights out in Tin Can Alley, and the monsters get bold."], ["me", "Little muffin, hold my hand. Me not scared of dark. Me scared of HOT. Dark is cool."], ["me", "...Dark VERY cool. Me like dark now."]],
  "w4-s6": [["me", "Spice rack. Chili flakes. Me remember Oven. Me shiver, even here."], ["me", "Recipe scroll at top. Pots hiss. Me lure bad guys to pot. Pot do rest."]],
  "w4-s7": [[7, "Chocomunch. You walked through the Oven. Few warriors of chocolate could."], ["me", "Me scared whole time."], [7, "That is what courage is, small golem. Now, the key. The sponge is that way."]],
  "w4-s8": [["me", "Honey Hollow. Sticky. Sweet. Me and honey same team. Dessert team."], ["me", "Before, me count one, two, many. Now me count all the way to forty-five. Me ready."]],
  "w4-s9": [["me", "Top shelf. Chef close. Me can smell Chef apron."], ["mold", "Drip... drip... Can you hear the Sink, little golem? It's waiting for you."], ["me", "Me hear. Me climb anyway. Chef is friend."]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Me punch! Me punch! Me PUNCH!", "Hits: one, two, MANY!", "Chocolate fist. Very rich."],
  lowhp: ["Me... getting soft...", "Me need fridge. Now.", "Me melty. Me still punch!"],
  perfect: ["Me chunky. Me also quick.", "Miss! Me fudge-dodge!", "Ha! Me not there."],
  levelup: ["Me stronger! Extra dark!", "Me level up. Me 70% cocoa now.", "Me bigger brain! ...Same brain."],
  secret: ["Shiny box! Me open!", "Me bounce sponge. Me find treat!", "Secret! Me no tell. ...Me tell."],
  boom: ["BOOM! Me like boom!", "Pin go bonk. Bad guys go flat.", "Pot go pop! Me not near pot."],
  mimic: ["Box have teeth! Box bad!", "Me open box. Box open ME.", "Me punch box. Box punch back?!"],
  objective: ["Me do job! Me good golem!", "Done! Chef proud of me.", "Job finish. Me no melt. Win!"],
};
