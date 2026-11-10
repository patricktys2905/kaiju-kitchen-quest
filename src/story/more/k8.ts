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
  // World 5: The Sink. Hot water, last climb down, the bravest golem.
  "w5-s2": [["n", "Uh-oh! A giant rolling pin is rumbling down the Suds Slide, right at Chocomunch!"], ["me", "Rolling pin supposed to be on MY team! Me no pull ladle this time!"], ["me", "Okay! Me RUN! Me run fast like hot fudge! Wait, no, me no like hot!"]],
  "w5-s3": [["me", "Sponge Shoals! Sponge soak up water. Sponge soak up bad guys? Me find out!"], ["me", "Gate lock! Me pull lever, rolling pin drop. Bad guys get SCRUBBED! Hehe!"]],
  "w5-s4": [[10, "Hmph. Chocomunch. My last Crumblet. Get it past those dishes, and keep its frosting dry."], ["me", "Me walk muffin! Soggy muffin is sad muffin. Me no allow sad muffin!"]],
  "w5-s6": [["me", "Bubbles! Me pop bubble! Me pop ALL the bubble! Hehe, pop pop pop!"], ["me", "Oh, right. Scroll. Me grab scroll in seventy-five seconds. THEN me pop bubble."]],
  "w5-s7": [["me", "Plughole! Me no go down hole. Me go UP! Sponge! BOING!"], ["me", "Last key in high chest. Me hold key SO tight. Key no go down the drain!"]],
  "w5-s8": [["me", "Greasy pan. Eww. Me need bath after this. Good thing we in Sink!"], ["me", "Forty-five seconds. Me count all the way now! Me good counter! Wanna hear? One, two, FORTY-FIVE!"]],
  "w5-s9": [["mold", "Hehehe... going down, little golem? Down where the water's HOT. Steamy, melty, gooey hot!"], ["me", "Me scared. Me still go. Me ALWAYS still go! Chef is friend!"]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Placemat flat. Me like flat! Me walk nice and slow and..."], ["n", "RUMBLE! A giant rolling pin comes bouncing over the placemats!"], ["me", "Nope! Me RUN! Me no chocolate pancake!"]],
  "w6-s3": [["me", "Big candles drip hot wax. SPLAT! Hot! Me no like hot!"], ["me", "Me pull lever, rolling pin drop. Bad guys go flat. Me stay FAR from candle!"]],
  "w6-s4": [[10, "Hmph. Chocomunch. This Crumblet wants to see the world. Walk it past the gravy boats, would ya?"], ["me", "Me walk muffin! Gravy boat go vroom? Me punch boat. Muffin say yay!"]],
  "w6-s6": [["me", "Teacups big like bathtub! Me no take bath. Me grab scroll!"], ["me", "Teapot Nanny heal bad guys? No fair! Me punch teapot first. POW!"]],
  "w6-s7": [["me", "Napkin fort! Me make napkin bib. Ooh, me fancy golem now!"], ["me", "Key chest way up high. Sponge! BOING! Me no drop Chef note!"]],
  "w6-s8": [["lo2", "Charge, my silverware! Carve yon golem like a chocolate bunny!"], ["me", "Me NO bunny! Me hold forty-five seconds. Me count all the way. Me good counter now!"]],
  "w6-s9": [["me", "Chandelier! Big and sparkly. Lots of candles. Uh-oh, lots of HOT."], ["lo2", "Climb, little sweet! At the top, I shall serve thee for dessert! Hahaha!"], ["me", "Me dessert? Okay, maybe. But me PUNCHING dessert!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "Hose long like snake. Me no trust snake."], ["n", "RUMBLE! A giant rolling pin comes bouncing down the Hose Highway!"], ["me", "Pin AGAIN?! Me RUN! Me no chocolate pancake! Not today!"]],
  "w7-s3": [["n", "FSSSH! Sprinklers burst up all over the lawn!"], ["me", "Ooh! Cold water! Me LOVE sprinkler! Me stay nice and firm!"], ["me", "Gate lock. Me pull lever, pin go BONK! Easy-peasy!"]],
  "w7-s4": [[10, "Hmph. Chocomunch. This Crumblet's never seen a paddling pool. Walk it to the exit. Keep it dry."], ["me", "Me walk muffin! Me be big chocolate boat! Wait, no. Me sink. Me just walk."]],
  "w7-s6": [["me", "Picnic table! Big checker blanket. Me want sandwich."], ["me", "No! Scroll first! Me grab scroll, me punch wasps. THEN sandwich."]],
  "w7-s7": [["me", "Flowerpots! Me like dirt. Dirt cool. Dirt no melt nobody."], ["me", "Chest way up high. Sponge! BOING! Me no drop Chef note!"]],
  "w7-s8": [["me", "COOLER! Ice inside! Me hug ice. Hi, new friend! Me name you Cubey Two!"], ["me", "Forty-five seconds. This one for Cubey. BOTH Cubeys!"]],
  "w7-s9": [["me", "Charcoal hot. Grill up top even hotter. Me feet go sizzle! *gulp*"], [15, "Chocomunch! Grill tip from a champ: keep moving and you never stick! Go go go!"], ["me", "Me keep moving! Me scared AND me climb! Chef is friend!"]],
  // World 8: The Garden.
  "w8-s2": [["me", "Big watering can. Water cool! Me like this place!"], ["n", "RUMBLE! A giant rolling pin comes bouncing down the Watering Can Run!"], ["me", "Pin AGAIN?! Pin follow me EVERYWHERE! Me RUN!"]],
  "w8-s3": [["n", "POOF! A giant flower puffs a pollen cloud right at Chocomunch!"], ["me", "AH-CHOO! Ow, sticky! Me now chocolate with sprinkles!"], ["me", "Gate lock. Me pull lever, pin go BONK! Bad guys flat like pancake!"]],
  "w8-s4": [[10, "Hmph. Chocomunch. This Crumblet wants to see a pumpkin patch. Walk it to the exit. Keep it out of the dirt."], ["me", "Me walk muffin! Pumpkins big like house. Muffin no climb pumpkin! Okay, ONE pumpkin."]],
  "w8-s6": [["me", "Beanstalk go up, up, UP! Scroll at top. Me climb! Me no look down."], ["me", "Me look down. Uh-oh. Me grab scroll and hold on tight. Me VERY good hugger!"]],
  "w8-s7": [[16, "Whoa, a chocolate dude. Stay frosty. Psst, is it just me, or is the sun kinda melty?"], ["me", "YOU scared of melt too?! Me hold your flipper. We stay in shade together!"], [16, "Cool, cool, cool. Key chest's up on the ledge. You go boing, I guard the shade."]],
  "w8-s8": [["me", "Scarecrow! Me no scared of scarecrow. Me scared of HOT. Scarecrow not hot. Hehe!"], ["me", "Forty-five seconds. This one for Cubey! And Cubey Two! And new turtle friend!"]],
  "w8-s9": [["n", "From the greenhouse, a lumpy voice mumbles: \"Huh, is that a toy wheel in me? WHO AM I?\""], ["me", "Greenhouse warm like Oven. *gulp* Me scared AND me climb! Chef is friend!"]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "Trolley! Me push trolley! Me no need trolley. Me just like push. Wheee!"], ["n", "RUMBLE! A giant rolling pin comes thundering down the Trolley Track!"], ["me", "PIN?! Pin follow me SHOPPING now?! Me RUN!"]],
  "w9-s3": [["me", "Cereal Aisle! Ooh, Choco Puffs! Me on box! Me FAMOUS!"], ["me", "Gate lock. Me pull lever, pin go BONK! Bad guys go soggy like cereal!"]],
  "w9-s4": [[10, "Hmph. Chocomunch. This Crumblet's never seen fruit and veg. Walk it to the exit. No snacking on grapes."], ["me", "Me walk muffin! Banana cartwheel at muffin? Me punch banana. Banana SPLIT!"]],
  "w9-s6": [["me", "Bakery! Ooh, chocolate cake! You me cousin? Hi, cousin!"], ["me", "No. Focus. Me grab scroll, me hold line, THEN me say hi to cake family."]],
  "w9-s7": [[14, "Let's GOOO! Big choco dude! Key chest's on the high ledge! I swim UP to it. Against the current!"], ["me", "Me no swim. Me sink like rock. Me go BOING instead!"], [14, "O-fish-ally awesome! Race ya!"]],
  "w9-s8": [["lo2", "Hold out at the checkout, varlet? Thou shalt be scanned, bagged and SOLD!"], ["me", "Me no for sale! Me no on sale! Forty-five seconds. Me count all the way!"]],
  "w9-s9": [["me", "FREEZER AISLE! Me LOVE freezer aisle! Me firm! Me crunchy! Me happiest golem!"], ["n", "Uh-oh! From the dark, a spooky voice wails: \"Woooo! Who's in my aisle?\""], ["me", "GHOST! *gulp* Me scared. Me still go. Me ALWAYS still go!"]],
  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Jam jars! Me like jam! Me walk nice and slow and..."], ["n", "RUMBLE! A giant rolling pin comes rolling between the jam jars!"], ["me", "PIN?! Pin follow me to back of FRIDGE?! Last time! Me RUN!"]],
  "w10-s3": [[16, "Stay frosty, choco dude. Back of the Fridge is the chillest spot in the house. Cool, cool, cool."], ["me", "Me LOVE chill! Takeaway box towers! Me hungry. No! Focus!"], ["me", "Gate lock. Me pull lever, pin go BONK! Bad guys flat like old pizza!"]],
  "w10-s4": [[10, "Hmph. Chocomunch. My LAST Crumblet. The very last one. Walk it down Frost Drawer Falls. Gently."], ["me", "Me walk LAST muffin! Me hold it gentle, like Cubey. Muffin say yay!"], [10, "It's wearing tiny mittens. Don't look at me. It's the frost, okay?"]],
  "w10-s6": [["me", "Paper chains! Old party stuff. Party sad and dusty. Me want to fix party!"], ["me", "First, scroll! Me grab scroll, me hold line. THEN fix party!"]],
  "w10-s7": [["me", "Forgotten Shelf. Old jars, old boxes. Me no like forgotten. Me remember EVERYBODY!"], ["me", "Last key way up high. Sponge! BOING! Cubey Three, hold on tight!"]],
  "w10-s8": [["lo2", "Hold out one last time, varlet? Thou shalt be frozen solid and FORGOTTEN!"], ["me", "Frozen? Ooh, me like frozen! Me count forty-five! Me count all the way! Last time!"]],
  "w10-s9": [["n", "A grumpy old voice booms down the long, empty table: \"Who let a CHOCOLATE into my feast hall?!\""], ["me", "Big table. No food. That saddest table me ever see."], ["me", "*gulp* Me scared AND me go! Me ALWAYS still go!"]],
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
