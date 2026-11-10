// Velvaroo: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop. First bouts, crowd of zero, ringing her own bell.
  "w1-s2": [["n", "RUMBLE! A giant rolling pin is chasing Velvaroo down the counter!"], ["me", "Roadwork! Every champ does roadwork! Hop, hop, HOP!"]],
  "w1-s3": [["me", "Gates locked? Ooh, a CAGE MATCH! In THIS corner... everybody!"], ["me", "Pull the ladle and the rolling pin does the pinning! Hah! Get it? PINNING!"]],
  "w1-s4": [[10, "Hmph. You. Kangaroo. Walk this Crumblet to the exit. And no boxing near the baby."], ["me", "Into the pouch, little muffin! Best seat in the house! Hey, you're my first fan!"]],
  "w1-s6": [["me", "Recipe scroll at the end of the shelf? Hop, grab, hop back! Easy-peasy!"], ["n", "Whoa! Monsters are piling off the spice shelf!"], ["me", "Ooh, a tag-team match! Ding ding!"]],
  "w1-s7": [["me", "Bouncy sponge! Best trampoline ever! Triple hop, plus a BOING!"], ["me", "Key's in that chest up high. The Chef always hides the good stuff on the top rope!"]],
  "w1-s8": [["foe", "Hold out forty-five seconds, Cupcake? Hah! You'll be flat as a pancake!"], ["me", "It's RED VELVET! And forty-five seconds is my warm-up! Ding ding!"]],
  "w1-s9": [["me", "Burners ahead. Toasty! Good thing I'm already baked!"], ["mold", "Hehehe... soggy little cakes make the BEST snacks."], ["me", "Who said that?! Show yourself! I'll go three rounds with ya!"]],
  // World 2: The Fridge. Cold training camp, the crowd grows to one.
  "w2-s2": [["me", "Dairy Lane! Slippy milk, cold toes!"], ["n", "RUMBLE! Here comes the rolling pin again!"], ["me", "Roadwork, round two! Hop like the wind!"]],
  "w2-s3": [["n", "Click! The fridge light goes out!"], ["me", "A fight in the dark? I'll punch by ear! Lever, pin, BONK! And the crowd goes... still just me. Rrrraaahhh!"]],
  "w2-s4": [[10, "Hmph. Another Crumblet for ya. Keep it warm. Keep it safe. Got it, kangaroo?"], ["me", "Into the pouch, buddy! Front row seat! Hey, my crowd just doubled!"]],
  "w2-s6": [["me", "Egg carton cliffs! Scroll's way at the end. Fetch, hop, fetch!"], ["me", "Monsters everywhere! It's a battle royale! My FAVOURITE kind!"]],
  "w2-s7": [["me", "Butter Bridge! Float like a butterfly, slide like a butter-fry!"], ["me", "Sponge, chest, key! BOING! The champ always finds the prize!"]],
  "w2-s8": [["me", "Ketchup Canyon! Forty-five seconds? That's not even a full round!"], ["me", "Gloves up! Nobody gets past the red corner!"]],
  "w2-s9": [["mold", "Stay in the cold, little cake. Cold cake keeps foreverrr..."], ["me", "Forever? Nope! I've got a title to win! Up the steps! Hup hup!"]],
  // World 3: The Oven. Her hometown, and a REAL announcer.
  "w3-s2": [["n", "RUMBLE! A rolling pin, fresh off the hot rack, rolls after Velvaroo!"], ["me", "Hot roadwork! Like a sauna! Sweat out the sprinkles!"]],
  "w3-s3": [["me", "Muffin tin maze! Cups everywhere, like a hundred little rings!"], ["me", "Lever time! The pin drops, and they're down for the count! One, two, TEN!"]],
  "w3-s4": [[10, "Hmph. Velvaroo. This Crumblet's never seen an oven. Show it around. No fighting near the heat."], ["me", "Into the pouch! This is the Oven, kiddo. Where cakes become CHAMPIONS!"]],
  "w3-s6": [["me", "Cookie sheet! Scroll at the end! Hop hop hop!"], ["n", "Whoa! A monster ambush on the cookie sheet!"], ["me", "Bring it! I'm hot outta the oven!"]],
  "w3-s7": [[15, "And h-h-here she comes, folks! The hoppiest heavyweight in the whole house! VEL-VA-ROOOO!"], ["me", "Hotchog! A real announcer! Do it again! Do it at my title fight!"], ["me", "But first, BOING! Up to the chest! Key secured!"]],
  "w3-s8": [["me", "Pizza stone pit! Forty-five seconds of HOT!"], ["me", "My frosting's dripping, but my record isn't! Hold the line!"]],
  "w3-s9": [["foe", "Go on up, Cupcake! I'll wait down here where it's cooler! Hah!"], ["me", "Scared of a little heat, Rocky? And it's RED VELVET!"]],
  // World 4: The Pantry. Close to the Chef, the crowd keeps growing.
  "w4-s2": [["n", "RUMBLE! A rolling pin bounces off the cereal boxes!"], ["me", "Roadwork, round four! I could do this in my sleep! Zzz... HOP!"]],
  "w4-s3": [["me", "Flour everywhere! I look like a ghost! Boo!"], ["n", "Uh-oh! That's a REAL Flour Ghost!"], ["me", "Rematch! Lever, pin, KA-BLAM! Boo to YOU!"]],
  "w4-s4": [[10, "Hmph. Velvaroo. This Crumblet's scared of the dark. So am I. Tell nobody."], ["me", "Into the pouch! Your secret's safe with me, Bluebeary! Mostly!"]],
  "w4-s6": [["me", "Spice rack! Cinnamon, nutmeg, and a scroll at the top!"], ["me", "Hissy pots here too! Lure 'em in, and KA-BLAM! That's a technical knockout!"]],
  "w4-s7": [[7, "Hrrm. Young boxer. Ancient wisdom says the best punch is the one you never throw."], ["me", "Ooh, deep!"], [7, "Then you never get hit. Or fed. Hrrm, that one was about rice. Sponge is that way."]],
  "w4-s8": [[6, "Hear ye! We, Dumplord, decree that the kangaroo shall WIN! Royal decree number forty-five!"], ["me", "A royal fan! The crowd's growing! Forty-five seconds, for the king! Ding ding!"]],
  "w4-s9": [["me", "Top shelf! I can smell the Chef's apron! So close!"], ["mold", "Drip, drip. Hear the Sink, little sponge cake? Soaking wet! Hehehe!"], ["me", "I'm RED VELVET! Why does nobody GET that?!"]],
  // World 5: The Sink. Never get soggy, last rounds, the crowd arrives.
  "w5-s2": [["n", "RUMBLE! A rolling pin comes skiing down the Suds Slide!"], ["me", "Last roadwork! Hop like a champ! Don't get soggy, don't get soggy!"]],
  "w5-s3": [["me", "Sponge Shoals! Sponges are great for bouncing. Terrible for BEING! Stay dry, Velvaroo!"], ["me", "Lever! Pin! Bad guys get SCRUBBED! Ding ding!"]],
  "w5-s4": [[10, "Hmph. Last Crumblet, kangaroo. Keep its frosting dry."], ["me", "Into the pouch! Front row seat for the final round, kiddo!"]],
  "w5-s6": [["me", "Bubble Bay! Pop the monsters, not the bubbles! Wait, pop both!"], ["me", "Grab the scroll in seventy-five seconds? I'll do it in ten! Okay, sixty!"]],
  "w5-s7": [["me", "Plughole Pass! Don't go DOWN the hole. Go UP! BOING!"], ["me", "The last key! I'm holding it up like a title belt! Ooh, practice!"]],
  "w5-s8": [["me", "Greasy Pan Pits! Gross! Good thing my gloves are machine washable!"], [17, "Wheee! Go, Velvaroo! Everybody's cheering from the dish rack!"], ["me", "A REAL crowd?! Forty-five seconds, for the fans! Ding ding!"]],
  "w5-s9": [["mold", "Hehehe... down, down, little cake. Down where it's wet. Down where you get SOGGY!"], ["me", "Champs don't go down! Well, I'm going down the drain. To WIN! You know what I mean!"]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Placemat Plains! Long runway! Roadwork, Act 2 edition!"], ["n", "RUMBLE! A giant rolling pin flops over the placemats!"], ["me", "I'm the champ now, I don't DO roadwork! Okay, I do. HOP!"]],
  "w6-s3": [["me", "Candelabras dripping hot wax! Duck, weave, don't get waxed!"], ["me", "Lever! The pin drops! Down for the count, forks!"]],
  "w6-s4": [[10, "Hmph. This Crumblet's a big fan of yours. Wants to ride in the pouch again."], ["me", "Hop in, champ-in-training! Next stop, past the gravy boats!"]],
  "w6-s6": [["me", "Teacups like bathtubs! And Teapot Nannies healing the bad guys? That's CHEATING! Ref!"], ["me", "No ref. Fine! Grab the scroll, punch the teapot!"]],
  "w6-s7": [["me", "Napkin fort! I'll grab one for a towel. A champ's gotta stay fresh!"], ["me", "Key chest up high. Sponge! BOING! Don't drop the belt!"]],
  "w6-s8": [["lo2", "Charge, my silverware! Flatten yon kangaroo like a pancake!"], ["me", "Pancake? I'm a CAKE cake! Forty-five seconds! Gloves up!"]],
  "w6-s9": [["me", "Chandelier! Fancy! Lots of candles, lots of drips!"], ["lo2", "Climb, marsupial! At the top, thou facest ME!"], ["me", "Ooh, a main event! Ding ding!"]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "Hose Highway! I used this hose as a skipping rope!"], ["n", "RUMBLE! A rolling pin comes bouncing down the hose!"], ["me", "Roadwork, Backyard edition! Don't get rolled, don't get grilled!"]],
  "w7-s3": [["me", "Sprinkler Springs! FWOOSH! A free shower between rounds! Ahh, refreshing!"], ["me", "Lever! Pin! Those Sprout Soldiers are about to be WELL DONE!"]],
  "w7-s4": [[10, "Hmph. Velvaroo. This Crumblet wants to swim in the paddling pool. Absolutely not. Exit's that way."], ["me", "Into the pouch! No swimming, champ. Frosting and pools don't mix!"]],
  "w7-s6": [["me", "Picnic Table Peak! Scroll at the top, Picnic Wasps everywhere!"], ["me", "Rule one of picnics: swat the wasps! Rule two: grab the scroll! Hop hop!"]],
  "w7-s7": [[9, "Hiya, Velvaroo! Elephants never forget! Um, who are you again? *POP*"], ["me", "Bubblegumbo! We trained here! You held my punching bag!"], [9, "Ooh! I remember the bag! The bag was nice. Sponge is over there!"]],
  "w7-s8": [["me", "Cooler Canyon! Nice and cold. Rocky would love it here!"], ["lo2", "Hold out all thou likest, marsupial! The Baron shall roast thee rare!"], ["me", "Rare? I'm a red velvet champ! I'm always WELL DONE! Forty-five seconds!"]],
  "w7-s9": [["n", "From the smoky grill above, a big voice booms: \"ATTEN-TION! Sprout Soldiers, FORM UP!\""], ["me", "Charcoal Climb! Hot, smoky and stinky. Pee-yew! Main event, here I come! Ding ding!"]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["One-two! One-two! THREE-FOUR!", "Combo! And the crowd goes WILD!", "Jab, jab, red velvet SLAB!"],
  lowhp: ["I'm not down! Just resting my eyes!", "Ref, don't you DARE start counting!", "Towel! For my face! NOT the ring!"],
  perfect: ["Float like a butterfly, hop like a roo!", "Missed me! Footwork, baby!", "Duck and weave! Mostly hop!"],
  levelup: ["New weight class! Heavyweight!", "Up the rankings! Ding ding!", "Extra layer! Extra frosting!"],
  secret: ["Ooh! A prize for the champ!", "Bonus round! Ding ding!", "Secret stash! Don't tell Rocky!"],
  boom: ["KA-BLAM! Knockout!", "Down for the count! ALL of 'em!", "Ding ding! Boom boom!"],
  mimic: ["A box with TEETH? Rematch!", "Sucker punch from a chest?!", "Hey! No biting in the ring!"],
  objective: ["And the winner is... ME!", "Job done! Raise my glove!", "Point to the red corner!"],
};
