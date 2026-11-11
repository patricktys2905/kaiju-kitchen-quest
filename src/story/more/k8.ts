// Chocomunch: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop. Sunny, soft, scared, brave anyway.
  "w1-s2": [["me", "Ooh, a trail of crumbs! Me follow crumbs, crumbs lead to snack. Yum yum!"], ["n", "Uh-oh! A knight made of cutlery is snoozing at the end of that trail. It's Sir Butterknife!"], ["me", "Hah! Me KNEW it was trap! Me punch knife man right in his shiny face!"]],
  "w1-s3": [["me", "Aw, nuts, me feet stuck in gummy goo! *squelch* Okay, okay, me free!"], ["me", "Exit want Sour Gummy Tails. Me go worm fishing! Sorry, wormies!"], ["me", "Rolling Pin Rogue at the end? Me no be chocolate pancake! Me BONK him first!"]],
  "w1-s4": [["n", "Aww! A teeny lost Crumblet is hugging Chocomunch's leg!"], ["me", "Hi, little muffin! Me big and me keep you safe. You stay away from burners, okay?"], ["me", "Big worm with crown at the end? You hide, me punch King Sour Worm. Deal!"]],
  "w1-s6": [["me", "Chef recipe scroll way up high on shelf! Me fetch it super fast! Well... medium fast."], ["n", "Hurry! Grab it before time runs out. The Toaster Tyrant is warming up at the end!"], ["me", "Toaster?! Toaster HOT! Me grab scroll, me punch toaster, me run to fridge!"]],
  "w1-s7": [["me", "Pepper in the air. It tickle me nose. Ah... AH-CHOO! Hehe, me okay!"], ["me", "Chef hide key in chest past end of path. Me find bouncy sponge and go BOING!"], ["me", "Cutting Board Golem? Him golem, me golem! Me win golem contest! POW!"]],
  "w1-s8": [["foe", "Hold out all you like, golem! I'll be warming up the Oven for ya! Hehehe!"], ["me", "Me hold out forty-five! Me count on fingers. Uh-oh, me gonna need more fingers!"], ["me", "Then King Pepper Grunt. Me no sneeze on king. Me PUNCH king!"]],
  "w1-s9": [["me", "Yikes, burners up ahead! Me feeling squishy like pudding."], ["mold", "Hehehe... melt, little golem. Melting feels sooo cozy."], ["me", "Who say that?! Me NO melt! Me no be cookie for Cookie Cutter Witch either! Me PUNCH!"]],
  // World 2: The Fridge. Firm, crunchy, happy, tempted to stay.
  "w2-s2": [["me", "Milk everywhere! Uh-oh, chocolate plus milk make CHOCOLATE MILK?!"], ["me", "Nope! Me stay golem! Me slide on ice, me punch Cheese Cube Critters. POW!"], ["me", "Ice Cube Ogre at the end? Ogre cold. Me LIKE cold! Me still punch ogre!"]],
  "w2-s3": [["n", "A lunchbox sits on the Frosty Shelf, looking extra yummy. Careful, it's a Lunchbox Mimic!"], ["me", "Box with TEETH?! Me no open box. Okay, me open box. Me PUNCH box!"], ["me", "Me cold and crunchy and teeny bit scared of Fish Finger General. Me punch anyway!"]],
  "w2-s4": [[10, "Hmph. Chocomunch! That's one of my Crumblets. Walk it through to the end and keep it in one piece, would ya?"], ["me", "Me best muffin-walker ever! Big crowned milk carton? Muffin hide, me handle carton, no problem!"]],
  "w2-s6": [["me", "Whoa, egg carton cliffs! Whole fridge come to party and nobody bring snacks!"], ["me", "Recipe scroll up high! Me climb ladders, grab it before time run out, hug it tight!"], ["me", "Then big Cheese Wheel. Cheese roll at me? Me roll BACK!"]],
  "w2-s7": [["me", "Me used to be soft like this butter. Now me CRUNCHY! Ooh, look at fancy me!"], ["me", "Key chest hide past end of bridge. Sponge is squishy, me not squishy. Hah! BOING!"], ["me", "Butter Block Brute waiting? Butter versus chocolate. Chocolate win! POW!"]],
  "w2-s8": [["me", "Eww, red ketchup goop everywhere. Me no like."], ["n", "Here they come! Hold the line till the monsters stop pouring in!"], ["me", "Me plant feet. Me big chocolate wall! Nobody get past wall! Not even King Carrot Sniper!"]],
  "w2-s9": [["mold", "Why leave the cold, little golem? Stay here where you're nice and firm. Forever..."], ["me", "Ooh, fridge is comfy. Maybe me stay a teeny bit?"], ["me", "Wait, NO! Chef note say Oven! Me climb steps, me squish Lasagna Lich! Hup, hup!"]],
  // World 3: The Oven. Cubey the ice cube, slowly giving everything.
  "w3-s2": [["me", "Me got ice from Freezer Golem in me pocket. Me name him Cubey! Hi, Cubey!"], ["n", "Uh-oh! The Casserole Commander rules the bottom rack, and the steam vents go WHOOSH!"], ["me", "Hot AND steamy?! This oven a sauna! Me want refund!"]],
  "w3-s3": [["me", "Every muffin cup look same! Me lost. Cubey lost too."], ["me", "Hmm, that lunchbox look hungry. Me no trust box. Me punch box first!"], ["me", "Pizza Peel Paladin at the end? Big flat paddle. Me no get flipped!"]],
  "w3-s4": [["me", "Little muffin in OVEN?! Muffin gonna get crispy! Me carry you, quick quick!"], ["n", "Psst! Muffins get baked in ovens. That Crumblet is totally fine."], ["me", "Oh. Muffin braver than me! Me still walk you. King Popcorn Popper go pop, me go POW!"]],
  "w3-s6": [["me", "Cookie sheet. Me think about chocolate chips in cookies. Poor little chips! *sniff*"], ["me", "Uh-oh, Cubey getting tiny! Me grab recipe up high before time run out, before Cubey gone!"], ["n", "And at the end of the sheet, the Muffin Tin Mortar is loading up!"]],
  "w3-s7": [[15, "Ch-Chocomunch! You look kinda glossy. I-I'll fan you with my spikes!"], ["me", "Spikes bad fan. But spikes good try! Thank you, friend!"], ["me", "Now me BOING off sponge past end of path. Key chest! Me cool enough. Barely!"]],
  "w3-s8": [["me", "Cubey? CUBEY?! Aw, Cubey all melted. Cubey give everything for me."], ["n", "Sizzle! One tiny drop of water on the pizza stone. Chocomunch salutes."], ["me", "Me hold forty-five. Then King Kettle Turret go POW. This one for Cubey!"]],
  "w3-s9": [["me", "Top rack is hottest rack! Gingerbread Gladiator up here too. Me sweating chocolate. Me no look at puddle."], ["foe", "Almost at the Broiler, golem! I'll save you a fondue fork! Hehehe!"], ["me", "NO FONDUE! Me say it before, now me say it LOUDER! NO FONDUE!"]],
  // World 4: The Pantry. Firm again, braver, closer to the Chef.
  "w4-s2": [["me", "Ahh, Pantry nice and cool! Me firm again! Me punch EXTRA good today!"], ["me", "Exit want Cracker Shards. Me crunch Cracker Crawlers. *crunch* Okay, me eat one. For muscles!"], ["n", "Look out above! Tin cans tumble off the shelves, and the Flour Sack Sumo waits at the end!"]],
  "w4-s3": [["me", "Ooh, flour everywhere like snow! Me gonna make flour buddy!"], ["n", "Uh-oh! That's no flour buddy. It's a Lunchbox Mimic, and it's hungry!"], ["me", "BAD buddy! Bye-bye, buddy! SPLAT! Cereal Box Colossus, you next!"]],
  "w4-s4": [["n", "A lost Crumblet peeks out of Tin Can Alley. Tin cans keep tumbling off the top shelf!"], ["me", "Little muffin, hold me hand. Cans go BONK on golem, not on muffin!"], ["me", "King Noodle Lurker at the end? You hide, muffin. Me turn king into noodle soup!"]],
  "w4-s6": [["me", "Chili flakes on the spice rack! Brrr, me remember Oven and get shivers."], ["me", "Recipe scroll way up top! Me climb ladders quick quick before time run out!"], ["me", "Then Honey Pot Hermit. Me crack pot! POW!"]],
  "w4-s7": [[7, "Hrrm. Chocomunch! You walked through the Oven. Few chocolate warriors could."], ["me", "Me scared the WHOLE time!"], [7, "Scared, yet you went? Ancient wisdom calls that courage. Or rice. Anyway, the sponge is that way."]],
  "w4-s8": [["me", "Honey! Sticky sweet! Me and honey same team. Team Dessert!"], ["me", "Before, me count one, two, many. Now me count ALL the way to forty-five! Me ready!"], ["me", "Then King Raisin Sniper. Raisin NOT dessert. Raisin get POW!"]],
  "w4-s9": [["me", "Sniff sniff. Me smell Chef apron! Chef close! Spice Rack Shaman no stop me!"], ["mold", "Drip, drip! Hear the Sink, little golem? It's waiting for you. Hehehe!"], ["me", "Me hear. Me climb anyway! Chef is friend!"]],
  // World 5: The Sink. Hot water, last climb down, the bravest golem.
  "w5-s2": [["me", "Wheee! Suds go slippy slide! Me golem on a slide!"], ["n", "Uh-oh! The Sponge Golem is soaking at the bottom, and the taps go drip, drip, DRIP!"], ["me", "Sponge golem?! Me golem too! Me find out who best golem. POW!"]],
  "w5-s3": [["me", "Sponge soak up water. Does sponge soak up bad guys? Me find out!"], ["me", "Exit want Rubber Fingers. Me shake hands with Grabby Gloves. Hard. POW!"], ["me", "Then Plunger Paladin. Me no get plunged! Bad guys getting SCRUBBED! Hehe!"]],
  "w5-s4": [[10, "Hmph. Chocomunch. My last Crumblet. Get it past those dishes, and keep its frosting dry."], ["me", "Me walk muffin! Soggy muffin is sad muffin. King Mouldy Mug no make muffin sad!"]],
  "w5-s6": [["me", "Bubbles! Me pop bubble! Me pop ALL the bubble! Pop pop pop!"], ["me", "Oh, right. Scroll up high. Me grab scroll before time run out. THEN me pop bubble."], ["n", "Somewhere in the suds, the Dish Soap Siren is singing. Don't listen, Chocomunch!"]],
  "w5-s7": [["me", "Plughole! Me no go DOWN hole. Me go UP! Sponge! BOING!"], ["me", "Me hold key SO tight. Key no go down drain!"], ["me", "Scrub Brush Boar? Bristly piggy. Me give piggy a POW!"]],
  "w5-s8": [["me", "Greasy pan. Eww. Me need bath after this. Good thing we in Sink!"], ["me", "Wanna hear me count? One, two... uh... FORTY-FIVE! See? Me good counter!"], ["me", "Then King Grabby Glove. Big hand? Me give high five. With FIST!"]],
  "w5-s9": [["mold", "Hehehe... going down, little golem? Down where the water's HOT. Steamy, melty, gooey hot!"], ["me", "Me scared. Me still go. Clogged Drain Hag no stop me! Me ALWAYS still go! Chef is friend!"]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Placemats nice and flat. Me like flat! Me walk nice and slow and..."], ["n", "Ahoy! The Gravy Boat Captain sails in, and his Gravy Boat Rammers come VROOM!"], ["me", "Me no wanna be chocolate gravy! Me punch boats! POW!"]],
  "w6-s3": [["me", "Big candles dripping hot wax. SPLAT! Ow, hot! Me no like hot!"], ["me", "Me stay FAR from candles. Lunchbox over there look sneaky. Me punch box first!"], ["me", "Then Teapot Tyrant. Me pour HIM out! Hehe."]],
  "w6-s4": [[10, "Hmph. Chocomunch. This Crumblet wants to see the world. Walk it past the gravy boats, would ya?"], ["me", "Me walk muffin! Gravy boat go vroom at us? Me punch boat. Muffin say yay!"], ["me", "Big crowned Candle Imp at the end? HOT! Muffin hide. Me punch FAST!"]],
  "w6-s6": [["me", "Teacups big like bathtubs! Me no take bath. Me grab scroll before time run out!"], ["me", "Candelabra Duchess at the end?! She covered in candles! Me punch her VERY quick. POW, ow, POW!"]],
  "w6-s7": [["me", "Napkin fort! Me make napkin bib. Ooh, me fancy golem now!"], ["me", "Hold still, Chef note. We going past end of path and up! BOING!"], ["me", "Silver Cloche Knight hide under big lid. Me knock! Knock knock! POW!"]],
  "w6-s8": [["lo2", "Charge, my silverware! Carve yon golem like a chocolate bunny!"], ["me", "Me NO bunny! Me hold forty-five, and you get NO ears! King Teapot Nanny next!"]],
  "w6-s9": [["me", "Chandelier big and sparkly. Lots of candles. Napkin Ringmaster up there too. Uh-oh, lots of HOT."], ["lo2", "Climb, little sweet! At the top, I shall serve thee for dessert! Hahaha!"], ["me", "Me dessert? Okay, maybe. But me PUNCHING dessert!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "That hose long like snake. Me no trust snake."], ["n", "Uh-oh! The Hot Coal Golem glows at the end of the hose, and Picnic Wasps buzz everywhere!"], ["me", "Another golem?! HOT golem?! Me punch fast and run to sprinkler!"]],
  "w7-s3": [["n", "FSSSH! Sprinklers burst up all over the lawn!"], ["me", "Ooh! Cold water! Me LOVE sprinkler! Me stay nice and firm!"], ["me", "Spatula Sheriff say this town too small? Me flip HIM! POW!"]],
  "w7-s4": [[10, "Hmph. Chocomunch. This Crumblet's never seen a paddling pool. Walk it through. Keep it dry."], ["me", "Me be big chocolate boat! Wait, no. Me sink. Me just walk, and punch King Ketchup Squirter!"]],
  "w7-s6": [["me", "Picnic table with big checker blanket! Me want sandwich."], ["me", "No! Scroll first! Me climb up, grab scroll before time run out, punch Corn Cob Gunner, THEN sandwich."]],
  "w7-s7": [["me", "Flowerpots full of dirt. Me like dirt. Dirt cool. Dirt never melt nobody."], ["me", "Key chest past end of path. Me bounce real careful. Chef note stay in pocket!"], ["me", "Marshmallow Mammoth? Big and squishy. Me squishy too, sometimes. Me still punch!"]],
  "w7-s8": [["me", "COOLER! Ice inside! Me hug ice. Hi, new friend! Me name you Cubey Two!"], ["me", "Me hold forty-five. This one for Cubey. BOTH Cubeys! Then King Corn Cob Cannon go POP!"]],
  "w7-s9": [["me", "Charcoal hot, grill up top even hotter. Sauce Bandit hiding up there too. Me feet go sizzle! *gulp*"], [15, "Chocomunch! Grill tip from a champ: keep moving and you never stick! Go go go!"], ["me", "Me keep moving! Me scared AND me climb!"]],
  // World 8: The Garden.
  "w8-s2": [["me", "Big watering can! Water cool! Me like this place!"], ["n", "SNAP! A giant flower with big chompy jaws guards the end of the run. It's the Snapdragon!"], ["me", "Flower with TEETH?! Me no get snapped! Me punch flower! Sorry, flower!"]],
  "w8-s3": [["n", "POOF! A giant flower puffs a pollen cloud right at Chocomunch!"], ["me", "AH-CHOO! Ow, sticky! Me now chocolate with sprinkles!"], ["me", "Sprinkle golem still punch! Watering Can Wizard gonna go flat like pancake!"]],
  "w8-s4": [[10, "Hmph. Chocomunch. This Crumblet wants to see a pumpkin patch. Walk it through. Keep it out of the dirt."], ["me", "Pumpkins big like house! No climbing pumpkin, little muffin. Okay, ONE pumpkin."], ["me", "King Tomato Lobber throw tomato? Muffin hide. Me SPLAT him back!"]],
  "w8-s6": [["me", "Beanstalk go up, up, UP! Scroll at top. Me climb ladders! Me no look down."], ["me", "Me look down. Uh-oh. Me grab scroll before time run out and hold on tight. Me VERY good hugger!"], ["n", "And at the end of it all, the Gnome General twirls his little beard!"]],
  "w8-s7": [[16, "Whoa, a chocolate dude. Stay frosty. Psst, is it just me, or is the sun kinda melty?"], ["me", "YOU scared of melt too?! Me hold your flipper. We stay in shade together!"], [16, "Cool, cool, cool. Key chest's past the end of the path. You go boing, I'll guard the shade."]],
  "w8-s8": [["me", "Me no scared of scarecrow. Me scared of HOT. Scarecrow not hot! Hehe!"], ["me", "Forty-five! This one for Cubey! And Cubey Two! And me new turtle friend!"], ["me", "Then King Radish Bomber go KA-BOOM. Me LOVE that part!"]],
  "w8-s9": [["n", "From the greenhouse, a lumpy voice mumbles: \"Huh, is that a toy wheel in me? WHO AM I?\""], ["me", "Greenhouse warm like Oven. *gulp* Me scared AND me climb! Chef is friend!"]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "Trolley! Me push trolley! Me no need trolley, me just like push. Wheee!"], ["n", "RUMBLE! The Trolley Chariot comes thundering down the aisle, and it wants its wheels back!"], ["me", "Me only borrow Trolley Wheels! For exit! Okay, me punch chariot!"]],
  "w9-s3": [["me", "Ooh, Choco Puffs! Me on box! Me FAMOUS!"], ["me", "Famous golem gonna punch Coupon Ghosts! Exit want coupons. Me no pay, me PUNCH!"], ["me", "Cash Register Golem at the end? Ka-CHING! POW!"]],
  "w9-s4": [[10, "Hmph. Chocomunch. This Crumblet's never seen fruit and veg. Walk it through. No snacking on grapes."], ["me", "Big crowned banana cartwheel at muffin? Me punch banana. Banana SPLIT!"]],
  "w9-s6": [["me", "Bakery! Ooh, chocolate cake! You me cousin? Hi, cousin!"], ["me", "No. Focus. Me grab scroll before time run out, me punch Price Gun Paladin, THEN me say hi to cake family."]],
  "w9-s7": [[14, "Let's GOOO, big choco dude! Key chest's on the high ledge! I swim UP to it. Against the current!"], ["me", "Me no swim. Me sink like rock. Me go BOING instead!"], [14, "O-fish-ally awesome! Race ya!"]],
  "w9-s8": [["lo2", "Hold out at the checkout, varlet? Thou shalt be scanned, bagged and SOLD!"], ["me", "Me NOT for sale! Me not on sale either! Come and try it, King Dented Can!"]],
  "w9-s9": [["me", "FREEZER AISLE! Me LOVE freezer aisle! Me firm! Me crunchy! Me happiest golem!"], ["n", "Uh-oh! From the dark, a spooky voice wails: \"Woooo! Who's in my aisle?\""], ["me", "GHOST! *gulp* Me scared. But me still go!"]],
  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Jam jars! Me like jam! Me walk nice and slow and..."], ["n", "BLUB BLUB! A bowl of Forgotten Soup bubbles at the end, cold and grumpy and VERY old!"], ["me", "Cold soup? Me like cold! But grumpy soup get POW!"]],
  "w10-s3": [[16, "Stay frosty, choco dude. Back of the Fridge is the chillest spot in the house. Cool, cool, cool."], ["me", "Me LOVE chill! Look, takeaway box towers! Me hungry. No! Focus!"], ["me", "Banquet Butler gonna serve bad guys flat like old pizza!"]],
  "w10-s4": [[10, "Hmph. Chocomunch. My LAST Crumblet. The very last one. Walk it down Frost Drawer Falls. Gently."], ["me", "Me walk LAST muffin! Me hold it gentle, like Cubey. King Pudding Cup no touch muffin!"], [10, "It's wearing tiny mittens. Don't look at me. It's the frost, okay?"]],
  "w10-s6": [["me", "Old party paper chains. Party all sad and dusty. Me want to fix party!"], ["me", "First, scroll up high before time run out! Then punch Pudding Juggernaut. THEN fix party!"]],
  "w10-s7": [["me", "Old jars, old boxes, all forgotten. Me no like forgotten. Me remember EVERYBODY!"], ["me", "Last key past end of shelf! Cubey Three, hold on tight! BOING!"]],
  "w10-s8": [["lo2", "Hold out one last time, varlet? Thou shalt be frozen solid and FORGOTTEN!"], ["me", "Frozen? Ooh, me LIKE frozen! You make bad threat! Last forty-five, here me come!"]],
  "w10-s9": [["n", "A grumpy old voice booms down the long, empty table: \"Who let a CHOCOLATE into my feast hall?!\""], ["me", "Big table and no food. And Fondue Fiend?! NO FONDUE! Saddest table me ever see."], ["me", "*gulp* Me scared AND me go! Me ALWAYS still go!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Me punch! Me punch! Me PUNCH!", "One, two, MANY punch!", "Chocolate fist! Extra rich!"],
  lowhp: ["Uh-oh! Me getting squishy!", "Me need fridge! Now please!", "Me melty, but me still punch!"],
  perfect: ["Hah! Me not there!", "Fudge-dodge! Me sneaky!", "Whoosh! Me chunky AND quick!"],
  levelup: ["Me stronger! Extra dark!", "Ooh! Me 70% cocoa now!", "Me got bigger brain! Wait, same brain."],
  secret: ["Ooh, shiny box! Me open!", "BOING! Me find treat!", "Secret! Me no tell! Okay, me tell."],
  boom: ["BOOM! Me LOVE boom!", "Pin go bonk! Bad guys go flat!", "Pot go pop! Me not near pot!"],
  mimic: ["Yikes! Box have teeth!", "Me open box. Box open ME!", "Me punch box. Box punch back?!"],
  objective: ["Me do job! Me good golem!", "Done! Chef gonna be proud!", "Job done! Me no melt! WIN!"],
};
