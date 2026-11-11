// Sloba: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop. A cold tea, a long walk and the Chef's tea bag.
  "w1-s2": [["me", "Heyyy, look at all these crumbs. They're, like, little pillows. Nap time? Yeah, nap time."], ["n", "RUMBLE! A giant rolling pin is rolling right at her!"], ["me", "Whoa, big wake-up call! Okay, I'm running. Slooowly. FASTER, legs!"]],
  "w1-s3": [["me", "Uh-oh, I'm stuck in the goo. Eh, I was gonna sit here anyway."], ["me", "Ooh, a lever. If I pull it, that rolling pin does all the work for me. My kinda plan, dude."]],
  "w1-s4": [[10, "You, sloth. Walk my Crumblet to the exit. And stay AWAKE, it's dark out there."], ["me", "Dark? Duuude, that's bedtime. Okay, little muffin, hold my claw. If I snore, poke me."]],
  "w1-s6": [[11, "Beep beep! First one to the Spice Shelf! Five-star speed! Wait, why are YOU here?"], ["me", "Got here an hour ago, dude. I took the straw. The scroll? Sure, I'll grab it. In a sec."]],
  "w1-s7": [["me", "Ah. Ahh. AH-CHOO! Whoa, who peppered this place? That sneeze woke me right up."], ["me", "Treasure chest way up high, and a big bouncy sponge. BOING! Heyyy, I'm flying. Wake me when I land."]],
  "w1-s8": [["foe", "Hurry hurry HURRY! Survive forty-five seconds, slowpoke! I could do it in TEN!"], ["me", "Forty-five seconds? That's, like, one yawn. *yaaawn* Okay, go."]],
  "w1-s9": [["me", "Mmm, these burners are sooo warm. Perfect nap weather."], ["mold", "Hehehe... sleep, little sloth. Sleep while your tea goes cold."], ["me", "It's already cold, dude. That's kinda the whole reason I'm up."]],
  // World 2: The Fridge. Frosty fur, the Chef's milk, a very buzzy bird.
  "w2-s2": [["me", "Heyyy, milk everywhere! I need milk for my tea. Lemme just grab a carton and-"], ["n", "RUMBLE! A chilly rolling pin comes rolling down the lane!"], ["me", "Okay, milk later. Running now. Ew, running."]],
  "w2-s3": [["me", "There's frost on my fur. I'm a bubble tea slushie now."], ["me", "Somebody pull that lever and drop the pin on these guys. Me? Sure, I guess it's me. Cool, cool. Like, literally cool."]],
  "w2-s4": [[10, "Sloth! My Crumblet's freezing. Get it to the exit, and keep it moving, would ya?"], ["me", "Moving's not really my thing. But for you, little muffin? Slow and steady wins the race."]],
  "w2-s6": [["me", "Lights out? Duuude, it's night time in the Fridge. That's my favorite time."], ["me", "Okay, okay. Scroll first, THEN bed. Go go go. Gently."]],
  "w2-s7": [["me", "Wheee! This butter's so slippy, I'm not even walking. I'm sliding. Way less effort."], ["me", "Key chest up high? Bouncy sponge to the rescue. BOING! Brrr, it's a cold sponge."]],
  "w2-s8": [["foe", "There you are! I lapped this canyon NINETEEN times! Survive THIS, slowpoke! Bean Spray!"], ["me", "Nineteen laps, wow. I did zero, and we're both here. Think about it, dude."]],
  "w2-s9": [["mold", "Hehehe... stay in the cold, little sloth. Cold fur, cold tea, cold forever."], ["me", "Nah. I'm getting fresh tea. With pearls. Dream big, mold dude."]],
  // World 3: The Oven. Toasty trays, sleepy sloth, a bag of brown sugar.
  "w3-s2": [["me", "Mmm, this tray's so toasty. I could nap right here."], ["n", "RUMBLE! A hot rolling pin is rolling out of the oven!"], ["me", "Okay, no nap. Hot pin, hot pin! Vine Swing! Wheee!"]],
  "w3-s3": [["me", "Sooo many monsters in this muffin tin. Heyyy, guys, one at a time?"], ["me", "Nope? Okay. I'll pull the lever and let the rolling pin flatten the whole line. Tea-rrific."]],
  "w3-s4": [[10, "It's hot in here, sloth. Walk my Crumblet out quick. QUICK."], ["me", "Quick-ish, papa bear. Hop on my back, little muffin. It's like a really slow bus."]],
  "w3-s6": [[17, "Wheee! Can't brake! Can't BRAKE! Sloba?! How'd you get to the end of the tray before me?!"], ["me", "I didn't run, so I didn't slip. Scroll's right here. Now we hold out, and you can sit on me."]],
  "w3-s7": [["me", "Hot hot hot! My pearls are getting all bouncy in this roasting pan."], ["me", "The key chest's up top, so it's sponge time. BOING! A flying bubble tea. That's a rare sight, dude."]],
  "w3-s8": [["foe", "Caffeine Rain! Drink it in, sloth! Forty-five seconds of PURE BUZZ!"], ["me", "No coffee, thanks. I'm a tea girl. Okay, forty-five seconds. Steeping now."]],
  "w3-s9": [["me", "Climbing is just hanging, but upward. I'm, like, a natural."], ["mold", "Hehehe... why climb, little sloth? Lie down. Rest forever."], ["me", "Tempting. Super tempting. Nope! Tea first."]],
  // World 4: The Pantry. Cozy shelves, a wise old dragon, a jar of pearls.
  "w4-s2": [["me", "Crunchy cereal pillows everywhere. Five more minutes, cereal."], ["n", "RUMBLE! A rolling pin is crunching through the cereal!"], ["me", "Fine, fine! I'm awake! I'm running! Crunch crunch crunch!"]],
  "w4-s3": [["me", "Ooh, all this flour's soft like snow. It's like a giant pillow made of snow."], ["me", "Flour Ghosts? Don't mess with my pillow, dudes. One lever later, POOF!"]],
  "w4-s4": [[10, "It's a dark alley, sloth. Walk my Crumblet out, and no snoring! It's scary enough in here."], ["me", "No snoring, got it. Little muffin, if you hear a snore, it's a monster. Probably."]],
  "w4-s6": [["me", "The recipe scroll's way up top, and the clock's ticking. I'm not, though."], ["me", "Ooh, hissy pots. Lure the bad guys over and KA-BLAM! Okay, now hold on tight."]],
  "w4-s7": [[7, "Hrrm. Young sloth. An ancient proverb: the slow tea leaf steeps the strongest."], ["me", "Whoa, Norigon. That's deep. Is it about tea?"], [7, "Hrrm. It is ALWAYS about tea. Sometimes rice. The sponge is over there."]],
  "w4-s8": [["me", "Honey everywhere. Sticky and sweet, like boba syrup. Mmm."], ["foe", "Sugar Trap! Gotcha! Forty-five seconds, sloth! Hurry hurry HURRY!"], ["me", "Sticky? I'm used to it, little buddy. Yawn, swing, repeat."]],
  "w4-s9": [["me", "Tea bag, milk, sugar, pearls. All I need now is the Chef."], ["mold", "Drip, drip! The Chef is down MY drain, sleepy sloth. Come and get them. Hehehe!"], ["me", "Sure thing. Gimme five minutes. I'm climbing!"]],
  // World 5: The Sink. Bubbles like boba, the drain, a fresh tea at the bottom.
  "w5-s2": [["me", "Bubbles! They're like boba, but see-through. Wheee!"], ["n", "RUMBLE! A giant rolling pin is sliding down the suds right behind her!"], ["me", "Duuude! Too fast! I'm a sloth! Vine Swing, GO!"]],
  "w5-s3": [["me", "This sponge is so squishy. It's like a mattress that drinks. Five more minutes?"], ["me", "The gates are locked? Fine. I'll pull the lever, and the pin goes SPLOOSH. Those monsters are all washed up."]],
  "w5-s4": [[10, "My last Crumblet, sloth. Get it past the dishes. And, um, thanks. Don't tell anybody."], ["me", "Your secret's safe, papa bear. I'll forget it in my next nap anyway."]],
  "w5-s6": [["me", "Conveyor belts? The floor moves FOR me! Best invention ever."], ["me", "Grab the scroll in seventy-five seconds, then hold out. No pressure, just tea-sure."]],
  "w5-s7": [["me", "I'm not going down the plughole yet. I'm going UP. BOING!"], ["me", "Got the last key! I'll keep it in my fur, right next to the spare pearls."]],
  "w5-s8": [["foe", "There you are! I waited FOREVER! Like, two whole minutes! Survive THIS, sloth!"], ["me", "Two minutes? Wow. That's my record for staying awake. Okay, forty-five seconds, go."]],
  "w5-s9": [["mold", "Hehehe... down, down, down, sleepy sloth. Down here your tea goes cold forever."], ["me", "Not forever, dude. Just till I get there. Which is, like, now."]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Ooh, fancy. There are napkin pillows everywhere. Okay, tiny nap."], ["n", "RUMBLE! A giant rolling pin is bowling down the tablecloth!"], ["me", "Excuse me, pardon me, sloth coming through. Slowly. Okay, FASTER!"]],
  "w6-s3": [["me", "Ow, hot wax! Waxed fur is NOT a look, dude."], ["me", "Somebody pass me that lever. BONK! Now pass the victory, please. No rush."]],
  "w6-s4": [[10, "Sloth! This Crumblet wants to see the world. Walk it past the gravy boats, would ya?"], ["me", "Hop on, little muffin. We're going on a gravy boat cruise. A very slow cruise. Best kind."]],
  "w6-s6": [["me", "Teacups as big as bathtubs! Duuude, this is, like, my dream."], ["me", "Aw, they're all full of STALE tea. Grab the scroll, then hold out. This is personal now."]],
  "w6-s7": [["me", "All these folded napkins look like little beds. Gotta stay awake. Gotta."], ["me", "Sponge up to the key chest. BOING! Heyyy, I landed on a napkin bed. Five more minutes."]],
  "w6-s8": [["lo2", "Charge, my silverware! Skewer yon sleepy sloth!"], ["me", "Forks? Rude. Forty-five seconds is easy, I'll just hang here upside down."]],
  "w6-s9": [["me", "Hanging way up high on a chandelier? This is my thing, dude. Vine Swing! Wheee!"], ["lo2", "Climb, furry varlet! At the top I shall make thee as stale as thy tea!"], ["me", "Nah. My tea's getting fresh again. Like, any day now."]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "Ooh, a long green hose. I could hang off it like a nap swing."], ["n", "RUMBLE! A giant rolling pin comes bouncing down the hose!"], ["me", "Nap cancelled. Running. Ugh, summer cardio."]],
  "w7-s3": [["me", "WHOA! The sprinkler launched me! Wheee! Okay, that woke me up."], ["me", "Sprout Soldiers, huh? I'll pull the lever, and BONK. You're toast, dudes. Or, like, steamed."]],
  "w7-s4": [[10, "Sloth! My Crumblet wants a dip in the pool. It's NOT getting one. Walk it to the exit. Dry."], ["me", "One dry muffin, got it. A little floatie nap on the way? No? Okay, okay."]],
  "w7-s6": [["me", "Sprouts left on every plate. Lettuce not do that, people."], ["me", "The recipe scroll's at the far end. Grab it, hold the table, then iced tea. A girl can dream."]],
  "w7-s7": [[18, "In THIS corner! The slowest sloth in the West! SLOOO-BA! Ding ding!"], ["me", "Heyyy, Velvaroo. Thanks. Can I nap in your corner?"], ["me", "Okay, the key chest's on that flowerpot. BOING! Ding ding, I guess."]],
  "w7-s8": [["me", "Ahhh, this cooler's nice and chilly. Iced tea vibes."], ["lo2", "Forsooth! The Baron shall grill thee well done, sloth!"], ["me", "Well done? I'm more of a rare. Rarely awake. Forty-five seconds, go."]],
  "w7-s9": [["me", "Hot coals all the way up. Pee-yew, I smell a sprout up top."], ["n", "From the grill, a voice booms: \"ATTEN-TION, sloth! You'll be SIZZLED!\""], ["me", "Sizzled? Nah. Steeped, maybe. I'm climbing. Okay, medium-fast climbing."]],
  // World 8: The Garden.
  "w8-s2": [["me", "Heyyy, my old shortcut past the watering can. I know every puddle here."], ["n", "RUMBLE! A giant rolling pin comes tumbling off the watering can!"], ["me", "Didn't know about THAT puddle! Run, sloth, run!"]],
  "w8-s3": [[16, "Yo, Sloba. Stay frosty. The sunflowers are puffing pollen everywhere."], ["me", "Minturtle! Heyyy. ACHOO! Okay, okay, I'll drop the pin on 'em. Bless you, monsters."]],
  "w8-s4": [[10, "This is your patch, sloth. Walk my Crumblet past the pumpkins for me."], ["me", "My turf, little muffin. I know every pumpkin by name. That's Gourdon. Say hi."]],
  "w8-s6": [["me", "I used to nap at the top of this beanstalk. Now there's a scroll up there. Rude."], ["me", "Grab it, hold the stalk. Turnip for the books, dude. I'm actually hurrying."]],
  "w8-s7": [["me", "Pee-yew. Old peels and stale leaves everywhere. The Leftovers love this stuff."], ["me", "The key chest's on the high ledge. BOING! Ahhh, it smells way better up here."]],
  "w8-s8": [["lo2", "Ha! The Meatloaf shall stale every leaf in thy Garden, sloth! Thou reapest what thou sowest!"], ["me", "I sow naps, dude, and I reap naps. Forty-five seconds, then nap."]],
  "w8-s9": [["me", "It's warm, foggy and green in this greenhouse. My tea bushes are in there."], ["n", "From the heap, a voice rambles: \"Who goes there?! Wait, is that a PEA in me? Since WHEN?\""], ["me", "Somebody's having a weird day. I'm climbing. Fast. For me."]],
  // World 9: The Supermarket.
  "w9-s2": [["me", "Heyyy, a shopping trolley. It's a bed with wheels! Hop in, nap on the go."], ["n", "RUMBLE! A giant rolling pin comes rolling down the aisle!"], ["me", "Clean-up on aisle nine! That's, like, me. Run, sloth, run!"]],
  "w9-s3": [["me", "Cereal boxes as big as buildings. Crunchy pillows as far as the eye can see."], ["me", "One lever pull and BONK. Those guys were way past their best before anyway."]],
  "w9-s4": [[10, "Sloth! My Crumblet got lost in the fruit and veg. Walk it out for me."], ["me", "Hop on, little muffin. We're taking the slow lane. It's the comfy one."]],
  "w9-s6": [["me", "Warm bread smell, like a big fluffy blanket. Gotta stay awake."], ["me", "I'll grab the scroll and hold the shelf, then take a loaf nap. Get it? Loaf? Like loafing around?"]],
  "w9-s7": [[14, "Let's GOOO! Up the canned goods, against the current! Race ya, sloth!"], ["me", "Heyyy, Salmonster. You swim, I'll take the sponge. BOING!"], ["me", "The key's right on this ledge. Two for one, dude, a key AND a nap spot."]],
  "w9-s8": [["lo2", "Forsooth! Thy time is up, sloth! Check out NOW!"], ["me", "Checkout? I'm in the slow lane, dude. Forty-five seconds. Bag it."]],
  "w9-s9": [["me", "Brrr. Frosty fur again. Heyyy, it's Minturtle's dream house."], ["n", "From the back aisle, a voice wails: \"Woooo! Nobody throws ME out! Nobody even OPENS me!\""], ["me", "Spooky. I'll open ya, dude. Gently. Climbing."]],
  // World 10: The Feast of the Forgotten.
  "w10-s2": [["me", "Sticky jars and comfy lids. A tiny nap?"], ["n", "RUMBLE! A giant rolling pin comes rolling between the jars!"], ["me", "Okay, okay. One more rush. A jam-packed rush. Go, legs!"]],
  "w10-s3": [["me", "Old noodle boxes up to the ceiling. Duuude, somebody forgot a LOT of dinners."], ["me", "Lever, pin, BONK. Order up, Leftovers."]],
  "w10-s4": [[10, "This is my LAST Crumblet, sloth. The very last one. Walk it out of the cold."], ["me", "The last one? Okay, papa bear. Hop on, little muffin. It's the slowest, safest bus in the Fridge."], [10, "...Thanks. Don't tell anybody I said that."]],
  "w10-s6": [[16, "Yo, Sloba. Stay frosty. Scroll's at the end of the paper chains. Race ya?"], ["me", "Race? Heyyy, Minturtle. I'll meet ya there. Grab it, hold out. No pressure, just tea-sure."]],
  "w10-s7": [["me", "Dusty jars with no labels. Heyyy, jars. I see ya."], [3, "Wibble wobble! Sloba! I'm writing names on ALL the jars! Wanna help?"], ["me", "Sure. Right after the sponge. BOING! Last key. Got it."]],
  "w10-s8": [["lo2", "Forsooth, sloth! The WHOLE army! Forty-five seconds! Thou art doomed!"], ["me", "Forty-five seconds? Sir Stale, that's, like, one yawn. *yaaawn* Okay, go."]],
  "w10-s9": [["me", "Duuude, this table is super long. And nobody's sitting at it."], ["n", "From the cake-tin throne, a grumpy voice booms: \"Nobody touches my table! NOBODY gets a seat!\""], ["me", "Heyyy. I saved myself one anyway. Been here since lunch. Climbing."]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Heyyy, a combo! Neat!", "Swing, swing, swiiing!", "Whoa, I'm on a roll! A slow roll!"],
  lowhp: ["Ow! I need a nap, like, now!", "Ouch, my pearls!", "Heyyy, not cool, dude!"],
  perfect: ["Missed me! I was asleep!", "Dodged it! By accident!", "Too slow, dude! Wait, that's me!"],
  levelup: ["Level up! Boba-lieve it!", "Ooh, stronger! Nap to celebrate!", "I'm steeped in power, dude!"],
  secret: ["Ooh, a goodie! I'm gonna nap on it!", "Treasure! Tea-rrific!", "Heyyy, a present! For me!"],
  boom: ["KA-BLAM! That woke me right up!", "Whoa, BOOM! Loud!", "Bonk! Big bonk, no rush!"],
  mimic: ["Heyyy, the box bites!", "Rude box! Not cool!", "Teeth? On a CHEST? Duuude!"],
  objective: ["Done! No rush, no fuss!", "Got there first! Again!", "No pressure, just tea-sure!"],
};
