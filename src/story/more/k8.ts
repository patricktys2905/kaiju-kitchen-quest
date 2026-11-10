// Chocomunch: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop. Sunny, soft, scared, brave anyway.
  "w1-s2": [["me", "Ooh, crumb trail! Me follow crumbs to snack! Yum yum!"], ["n", "Uh-oh! Something extra big is hiding at the end of that trail!"], ["me", "Hah! Me knew it was trap. Me punch trap right in face!"]],
  "w1-s3": [["me", "Gummy Gully! Aw, nuts, me feet stuck! *squelch* Okay, me free!"], ["me", "Ooh, big ladle! Me yank ladle and rolling pin go BONK! Me LOVE bonk!"]],
  "w1-s4": [["n", "Aww! A teeny lost Crumblet is hugging Chocomunch's leg!"], ["me", "Hi, little muffin! Me big, me keep you safe. Stay away from toaster, okay?"], ["me", "Hissy pot go BOOM! Me feed bad guys to pot. Muffin no go near pot!"]],
  "w1-s6": [["me", "Chef recipe scroll at end of shelf! Me fetch it super fast! Well, medium fast."], ["n", "Whoa! Monsters are pouring off the spice shelf by the bucketload!"], ["me", "Me count bad guys. One, two... MANY! Okay! Me punch MANY!"]],
  "w1-s7": [["me", "Pepper Pass. Pepper tickle nose. Ah... AH-CHOO! Hehe, me okay."], ["me", "Chef hide key in high chest. Me find sponge and go BOING!"]],
  "w1-s8": [["foe", "Hold out all you like, golem! I'll be warming up the Oven for ya! Hehehe!"], ["me", "Hmph! Me hold forty-five seconds. Me count on fingers. Uh-oh, me need more fingers!"]],
  "w1-s9": [["me", "Yikes, burners ahead! Me feel squishy like pudding."], ["mold", "Hehehe... melt, little golem. Melting feels sooo cozy."], ["me", "Who say that?! Me no melt! Me PUNCH!"]],
  // World 2: The Fridge. Firm, crunchy, happy, tempted to stay.
  "w2-s2": [["me", "Dairy Lane! Milk everywhere! Uh-oh, chocolate plus milk make CHOCOLATE MILK?!"], ["me", "Nope! Me stay golem! Me punch milk carton instead. POW!"]],
  "w2-s3": [["n", "Click! The fridge light goes out, and the monsters look extra tough in the dark!"], ["me", "Hey! Light only go off when door close. Who close door?!"], ["me", "Me cold and crunchy and teeny bit scared. Me punch anyway!"]],
  "w2-s4": [[10, "Hmph. Chocomunch! That's one of my Crumblets. Walk it to the exit for me, would ya?"], ["me", "Me best muffin-walker ever! Loud pressure pot? Me handle pot!"]],
  "w2-s6": [["me", "Whoa, egg carton cliffs! Whole fridge come to party, and nobody bring snacks!"], ["me", "Recipe scroll at far end. Me grab it and hug it tight. Easy-peasy!"]],
  "w2-s7": [["me", "Butter Bridge! Me used to be soft like butter. Now me crunchy! Ooh, fancy me!"], ["me", "Key in high chest. Sponge squishy, me not squishy. Hah! BOING!"]],
  "w2-s8": [["me", "Ketchup Canyon. Eww, red goop everywhere. Me no like."], ["n", "Here they come! Hold the line for forty-five seconds!"], ["me", "Me plant feet. Me big chocolate wall! Nobody get past wall!"]],
  "w2-s9": [["mold", "Why leave the cold, little golem? Stay here where you're nice and firm. Forever..."], ["me", "Ooh, fridge comfy. Me maybe stay a teeny bit?"], ["me", "Wait, NO! Chef note say Oven! Me climb steps! Hup, hup!"]],
  // World 3: The Oven. Cubey the ice cube, slowly giving everything.
  "w3-s2": [["me", "Me got ice from Freezer Golem in pocket. Me name him Cubey! Hi, Cubey!"], ["n", "Uh-oh! The bottom rack is crawling with monsters!"], ["me", "Hot AND crowded?! This oven a sauna! Me want refund!"]],
  "w3-s3": [["me", "Muffin tin maze! Every cup look same. Me lost. Cubey lost too."], ["me", "Hmm, that cereal box look hungry. Me no trust box. Me pull ladle first!"]],
  "w3-s4": [["me", "Little muffin in OVEN?! Muffin get crispy! Me carry you, quick quick!"], ["n", "Psst! Muffins get baked in ovens. That Crumblet is totally fine."], ["me", "Oh. Muffin braver than me! Me still walk muffin home. Hmph."]],
  "w3-s6": [["me", "Cookie sheet. Me think about chocolate chips in cookies. Poor little chips! *sniff*"], ["me", "Uh-oh, Cubey getting tiny! Me grab recipe fast, before Cubey gone!"]],
  "w3-s7": [[15, "Ch-Chocomunch! You look kinda... glossy. I'll fan you with my spikes!"], ["me", "Spikes bad fan. Spikes good try! Thank you, friend!"], ["me", "Now me BOING to high chest. Key inside. Me cool enough. Barely!"]],
  "w3-s8": [["me", "Cubey? CUBEY?! Aw, Cubey all melted. Cubey give everything for me."], ["n", "Sizzle! One tiny drop of water on the pizza stone. Chocomunch salutes."], ["me", "Me hold forty-five seconds. This one for Cubey!"]],
  "w3-s9": [["me", "Top rack. Hottest rack! Me sweating chocolate. Me no look at puddle."], ["foe", "Almost at the Broiler, golem! I'll save you a fondue fork! Hehehe!"], ["me", "NO FONDUE! Me say it before, now me say it LOUDER! NO FONDUE!"]],
  // World 4: The Pantry. Firm again, braver, closer to the Chef.
  "w4-s2": [["me", "Ahh, Pantry nice and cool! Me firm again! Me punch EXTRA good today!"], ["me", "Cheerios roll at me! Me no eat. *crunch* Okay, me eat one. For muscles!"]],
  "w4-s3": [["me", "Ooh, flour everywhere, like snow! Me make flour buddy!"], ["n", "Uh-oh! That flour buddy is a Flour Ghost!"], ["me", "BAD buddy! Me pull ladle, rolling pin go SPLAT. Bye-bye, buddy!"]],
  "w4-s4": [["n", "SLAM! The pantry door shuts. Lights out in Tin Can Alley!"], ["me", "Little muffin, hold my hand. Me no scared of dark. Me scared of HOT. Dark is cool!"], ["me", "Ooh, dark VERY cool. Me like dark now!"]],
  "w4-s6": [["me", "Spice rack. Chili flakes! Brrr, me remember Oven and get shivers."], ["me", "Recipe scroll at top! Hissy pots here too. Me lure bad guys in. KA-BLAM!"]],
  "w4-s7": [[7, "Hrrm. Chocomunch! You walked through the Oven. Few chocolate warriors could."], ["me", "Me scared whole time!"], [7, "Scared, yet you went? Ancient wisdom calls that courage. Or rice. Anyway, sponge is that way."]],
  "w4-s8": [["me", "Honey Hollow! Sticky sweet! Me and honey same team. Team Dessert!"], ["me", "Before, me count one, two, many. Now me count ALL the way to forty-five! Me ready!"]],
  "w4-s9": [["me", "Top shelf! Sniff sniff. Me smell Chef apron! Chef close!"], ["mold", "Drip, drip! Hear the Sink, little golem? It's waiting for you. Hehehe!"], ["me", "Me hear. Me climb anyway! Chef is friend!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Me punch! Me punch! Me PUNCH!", "One, two, MANY punch!", "Chocolate fist! Extra rich!"],
  lowhp: ["Uh-oh! Me getting squishy!", "Me need fridge! Now please!", "Me melty but me still punch!"],
  perfect: ["Hah! Me not there!", "Fudge-dodge! Me sneaky!", "Whoosh! Me chunky AND quick!"],
  levelup: ["Me stronger! Extra dark!", "Ooh! Me 70% cocoa now!", "Me bigger brain! Wait, same brain."],
  secret: ["Ooh, shiny box! Me open!", "BOING! Me find treat!", "Secret! Me no tell! Okay, me tell."],
  boom: ["BOOM! Me LOVE boom!", "Pin go bonk! Bad guys go flat!", "Pot go pop! Me not near pot!"],
  mimic: ["Yikes! Box have teeth!", "Me open box. Box open ME!", "Me punch box. Box punch back?!"],
  objective: ["Me do job! Me good golem!", "Done! Chef gonna be proud!", "Job done! Me no melt! WIN!"],
};
