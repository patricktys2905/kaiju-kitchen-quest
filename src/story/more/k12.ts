// Sloba: pre-stage scenes and in-stage quips.
import type { QuipKind } from '../banter';
import type { StoryLine } from '../stories';

export const BEATS: Record<string, StoryLine[]> = {
  // World 1: The Countertop. A cold tea, a long walk and the Chef's tea bag.
  "w1-s2": [["me", "Crumb Trail. Crumbs, crumbs, crumbs. Comfy crumbs. Nap time? Nap time."], ["n", "RUMBLE! A giant rolling pin is rolling right at her!"], ["me", "Whoa. Big wake-up call. Okay, running. Slooowly. FASTER, legs!"]],
  "w1-s3": [["me", "Gummy Gully. Sticky. I'm stuck. Eh, I was gonna sit here anyway."], ["me", "Ooh, a lever. Pull it, drop a rolling pin. Big bonk, zero effort. My kinda plan."]],
  "w1-s4": [[10, "Hmph. You. Sloth. Walk my Crumblet to the exit. And stay AWAKE. It's dark out."], ["me", "Dark? Duuude, that's bedtime. Okay, little muffin, hold my claw. If I snore, poke me."]],
  "w1-s6": [[11, "Beep beep! First one to the Spice Shelf! Five-star speed! Wait, why are YOU here?"], ["me", "Got here an hour ago, dude. Took the straw. Grab the scroll? Sure. In a sec."]],
  "w1-s7": [["me", "Pepper Pass. Ah. Ahh. AH-CHOO! Whoa, that sneeze woke me right up."], ["me", "Chest way up high. Sponge! BOING! Heyyy, I'm flying. Wake me when I land."]],
  "w1-s8": [["foe", "Hurry hurry HURRY! Survive forty-five seconds, slowpoke! I could do it in TEN!"], ["me", "Forty-five seconds? That's, like, one yawn. *yaaawn* Okay, go."]],
  "w1-s9": [["me", "Burner Approach. Sooo warm. Perfect nap weather."], ["mold", "Hehehe... sleep, little sloth. Sleep while your tea goes cold."], ["me", "Already cold, dude. Kinda the whole reason I'm up."]],
  // World 2: The Fridge. Frosty fur, the Chef's milk, a very buzzy bird.
  "w2-s2": [["me", "Dairy Lane. Milk everywhere. Heyyy, I need milk for my tea. Lemme just grab a carton and-"], ["n", "RUMBLE! A chilly rolling pin comes rolling down the lane!"], ["me", "Okay, milk later. Running now. Ew, running."]],
  "w2-s3": [["me", "Frosty Shelf. There's frost on my fur. I'm a bubble tea slushie now."], ["me", "Lever. Pull. Rolling pin goes BONK. Cool, cool. Like, literally cool."]],
  "w2-s4": [[10, "Hmph. Sloth. Crumblet. Exit. It's cold, so keep it moving."], ["me", "Moving's not really my thing. But for you, little muffin? Slow and steady wins the race."]],
  "w2-s6": [["me", "Lights out? Duuude. It's night time in the Fridge. That's my favorite time."], ["me", "Okay, okay. Scroll first, THEN bed. Go go go. Gently."]],
  "w2-s7": [["me", "Butter Bridge. Slippy. Wheee! I'm not walking, I'm sliding. Way less effort."], ["me", "Key chest up high. Sponge! BOING! Brrr, cold sponge."]],
  "w2-s8": [["foe", "There you are! I lapped this canyon NINETEEN times! Survive THIS, slowpoke! Bean Spray!"], ["me", "Nineteen laps. Wow. I did zero. And we're both here. Think about it, dude."]],
  "w2-s9": [["mold", "Hehehe... stay in the cold, little sloth. Cold fur, cold tea, cold forever."], ["me", "Nah. I'm getting fresh tea. With pearls. Dream big, mold dude."]],
  // World 3: The Oven. Toasty trays, sleepy sloth, a bag of brown sugar.
  "w3-s2": [["me", "Bottom Rack. Toasty. Mmm, I could nap right on this tray."], ["n", "RUMBLE! A hot rolling pin is rolling out of the oven!"], ["me", "Okay, no nap. Hot pin! Vine Swing! Wheee!"]],
  "w3-s3": [["me", "Muffin Tin Maze. Sooo many monsters. Heyyy, guys, one at a time?"], ["me", "Nope? Okay. Lever! Rolling pin flattens the whole line. Tea-rrific."]],
  "w3-s4": [[10, "Hmph. It's hot in here. Walk my Crumblet quick. QUICK, sloth."], ["me", "Quick-ish, papa bear. Hop on my back, little muffin. It's like a really slow bus."]],
  "w3-s6": [[17, "Wheee! Can't brake! Can't BRAKE! Sloba?! How'd you get to the end of the tray before me?!"], ["me", "Didn't run. Didn't slip. Scroll's right here. Now we hold out. You can sit on me."]],
  "w3-s7": [["me", "Roasting Pan Pass. Hot hot. My pearls are getting all bouncy."], ["me", "Key chest up top. Sponge! BOING! A flying bubble tea. Rare sight, dude."]],
  "w3-s8": [["foe", "Caffeine Rain! Drink it in, sloth! Forty-five seconds of PURE BUZZ!"], ["me", "No coffee, thanks. I'm a tea girl. Okay, forty-five seconds. Steeping now."]],
  "w3-s9": [["me", "Top Rack Ascent. Climbing is just hanging, but upward."], ["mold", "Hehehe... why climb, little sloth? Lie down. Rest forever."], ["me", "Tempting. Super tempting. Nope! Tea first."]],
  // World 4: The Pantry. Cozy shelves, a wise old dragon, a jar of pearls.
  "w4-s2": [["me", "Cereal Canyon. Crunchy pillows everywhere. Five more minutes, cereal."], ["n", "RUMBLE! A rolling pin is crunching through the cereal!"], ["me", "Fine, fine! Awake! Running! Crunch crunch crunch!"]],
  "w4-s3": [["me", "Flour Drifts. Soft like snow. Like a giant pillow made of snow."], ["me", "Flour Ghosts? Don't mess with my pillow. Lever! Rolling pin goes POOF!"]],
  "w4-s4": [[10, "Hmph. Dark alley. Walk my Crumblet. And no snoring. It's scary enough in here."], ["me", "No snoring. Got it. Little muffin, if you hear a snore, it's a monster. Probably."]],
  "w4-s6": [["me", "Spice Rack Ridge. Recipe scroll way up top. The clock's ticking. I'm not."], ["me", "Hissy pots! Lure the bad guys in. KA-BLAM! Okay, now hold on tight."]],
  "w4-s7": [[7, "Hrrm. Young sloth. An ancient proverb: the slow tea leaf steeps the strongest."], ["me", "Whoa, Norigon. That's deep. Is it about tea?"], [7, "Hrrm. It is ALWAYS about tea. Sometimes rice. The sponge is over there."]],
  "w4-s8": [["me", "Honey Hollow. Sticky and sweet. Like boba syrup. Mmm."], ["foe", "Sugar Trap! Gotcha! Forty-five seconds, sloth! Hurry hurry HURRY!"], ["me", "Sticky? I'm used to it, little buddy. Yawn, swing, repeat."]],
  "w4-s9": [["me", "Top Shelf Climb. Tea bag, milk, sugar, pearls. All I need now is the Chef."], ["mold", "Drip, drip! The Chef is down MY drain, sleepy sloth. Come and get them. Hehehe!"], ["me", "Sure thing. Gimme five minutes. Climbing!"]],
  // World 5: The Sink. Bubbles like boba, the drain, a fresh tea at the bottom.
  "w5-s2": [["me", "Suds Slide. Bubbles! Like boba, but see-through. Wheee!"], ["n", "RUMBLE! A giant rolling pin is sliding down the suds right behind her!"], ["me", "Duuude! Too fast! I'm a sloth! Vine Swing, GO!"]],
  "w5-s3": [["me", "Sponge Shoals. Squishy. Like a mattress that drinks. Five more minutes?"], ["me", "Gates locked. Fine. Lever! Rolling pin goes SPLOOSH. Monsters get all washed up."]],
  "w5-s4": [[10, "Hmph. My last Crumblet. Get it past the dishes. And, um, thanks. Don't tell anybody."], ["me", "Your secret's safe, papa bear. I'll forget it in my next nap anyway."]],
  "w5-s6": [["me", "Bubble Bay. Conveyor belts! The floor moves FOR me. Best invention ever."], ["me", "Scroll in seventy-five seconds, then hold out. No pressure, just tea-sure."]],
  "w5-s7": [["me", "Plughole Pass. Not going down the plughole yet. Going UP. Sponge! BOING!"], ["me", "Last key, up in the high chest. I'll keep it in my fur. Next to the spare pearls."]],
  "w5-s8": [["foe", "There you are! I waited FOREVER! Like, two whole minutes! Survive THIS, sloth!"], ["me", "Two minutes? Wow. That's my record for staying awake. Forty-five seconds, go."]],
  "w5-s9": [["mold", "Hehehe... down, down, down, sleepy sloth. Down here your tea goes cold forever."], ["me", "Not forever, dude. Just till I get there. Which is, like, now."]],
  // World 6: The Dining Room (Act 2).
  "w6-s2": [["me", "Placemat Plains. Fancy. Napkin pillows everywhere. Okay, tiny nap."], ["n", "RUMBLE! A giant rolling pin is bowling down the tablecloth!"], ["me", "Excuse me, pardon me, sloth coming through. Slowly. Okay, FASTER!"]],
  "w6-s3": [["me", "Candelabra Crossing. Hot wax. Ow! Waxed fur is NOT a look."], ["me", "Lever! Rolling pin goes BONK. Pass the victory, please. No rush."]],
  "w6-s4": [[10, "Hmph. Sloth. This Crumblet wants to see the world. Walk it past the gravy boats."], ["me", "Hop on, little muffin. Gravy boat cruise. A very slow cruise. Best kind."]],
  "w6-s6": [["me", "Teacup Terrace! Teacups as big as bathtubs! Duuude. This is, like, my dream."], ["me", "Aw, they're all full of STALE tea. Grab the scroll, then hold out. This is personal now."]],
  "w6-s7": [["me", "Napkin Fold Fort. Folded napkins, like little beds. Gotta stay awake. Gotta."], ["me", "Key chest up high. Sponge! BOING! Heyyy, I landed on a napkin bed. Five more minutes."]],
  "w6-s8": [["lo2", "Charge, my silverware! Skewer yon sleepy sloth!"], ["me", "Forks? Rude. Forty-five seconds? Easy. I'll just hang here upside down."]],
  "w6-s9": [["me", "Chandelier Climb. Hanging up high? This is my thing, dude. Vine Swing! Wheee!"], ["lo2", "Climb, furry varlet! At the top I shall make thee as stale as thy tea!"], ["me", "Nah. My tea's getting fresh again. Like, any day now."]],
  // World 7: The Backyard BBQ.
  "w7-s2": [["me", "Hose Highway. Ooh, a long green hose. I could hang off it. Nap swing."], ["n", "RUMBLE! A giant rolling pin comes bouncing down the hose!"], ["me", "Nap cancelled. Running. Ugh, summer cardio."]],
  "w7-s3": [["me", "Sprinkler Springs. WHOA! Sprinkler launch! Wheee! Okay, that woke me up."], ["me", "Sprout Soldiers! Lever! Rolling pin goes BONK. You're toast. Or, like, steamed."]],
  "w7-s4": [[10, "Hmph. Sloth. My Crumblet wants a dip in the pool. Walk it to the exit. Dry."], ["me", "Dry muffin, got it. A little floatie nap on the way? No? Okay, okay."]],
  "w7-s6": [["me", "Picnic Table Peak. Sprouts left on every plate. Lettuce not do that, people."], ["me", "Recipe scroll at the far end. Grab it, hold the table. Then iced tea. A girl can dream."]],
  "w7-s7": [[18, "In THIS corner! The slowest sloth in the West! SLOOO-BA! Ding ding!"], ["me", "Heyyy, Velvaroo. Thanks. Can I nap in your corner?"], ["me", "Okay, key chest on the flowerpot. Sponge! BOING! Ding ding, I guess."]],
  "w7-s8": [["me", "Cooler Canyon. Ahhh, nice and chilly. Iced tea vibes."], ["lo2", "Forsooth! The Baron shall grill thee well done, sloth!"], ["me", "Well done? I'm more of a rare. Rarely awake. Forty-five seconds, go."]],
  "w7-s9": [["me", "Charcoal Climb. Hot coals. Pee-yew, I smell a sprout up top."], ["n", "From the grill, a voice booms: \"ATTEN-TION, sloth! You'll be SIZZLED!\""], ["me", "Sizzled? Nah. Steeped, maybe. Climbing. Okay, medium-fast climbing."]],
  // World 8: The Garden.
  "w8-s2": [["me", "Watering Can Run. My old shortcut. I know every puddle here."], ["n", "RUMBLE! A giant rolling pin comes tumbling off the watering can!"], ["me", "Didn't know THAT puddle. Run, sloth, run!"]],
  "w8-s3": [[16, "Yo, Sloba. Stay frosty. The sunflowers are puffing pollen everywhere."], ["me", "Minturtle! Heyyy. ACHOO! Okay, lever. Rolling pin goes BONK. Bless you, monsters."]],
  "w8-s4": [[10, "Hmph. Sloth. This is your patch. Walk my Crumblet past the pumpkins."], ["me", "My turf, little muffin. I know every pumpkin by name. That's Gourdon. Say hi."]],
  "w8-s6": [["me", "Beanstalk Heights. I used to nap at the top. Now there's a scroll up there. Rude."], ["me", "Grab it, hold the stalk. Turnip for the books, dude. I'm actually hurrying."]],
  "w8-s7": [["me", "Compost Keep. Pee-yew. Old peels and stale leaves. The Leftovers love this stuff."], ["me", "Key chest on the high ledge. Sponge! BOING! Smells way better up here."]],
  "w8-s8": [["lo2", "Ha! The Meatloaf shall stale every leaf in thy Garden, sloth! Thou reapest what thou sowest!"], ["me", "I sow naps, dude. I reap naps. Forty-five seconds, then nap."]],
  "w8-s9": [["me", "Greenhouse Steps. Warm, foggy and green. My tea bushes are in there."], ["n", "From the heap, a voice rambles: \"Who goes there?! Wait, is that a PEA in me? Since WHEN?\""], ["me", "Somebody's having a weird day. Climbing. Fast. For me."]],
};

export const QUIPS: Record<QuipKind, string[]> = {
  combo: ["Heyyy, combo. Neat.", "Swing, swing, swiiing!", "Whoa, I'm on a roll. A slow roll."],
  lowhp: ["Ow. Need a nap. Like, now.", "Ouch, my pearls!", "Heyyy, not cool, dude."],
  perfect: ["Missed me. I was asleep.", "Dodged it. By accident.", "Too slow, dude. Wait, that's me."],
  levelup: ["Level up! Boba-lieve it.", "Ooh, stronger. Nap to celebrate.", "Steeped in power, dude."],
  secret: ["Ooh, a goodie. Gonna nap on it.", "Treasure! Tea-rrific.", "Heyyy, a present. Mine."],
  boom: ["KA-BLAM! Woke me right up.", "BOOM. Whoa. Loud.", "Bonk! Big bonk, no rush."],
  mimic: ["Heyyy, the box bites!", "Rude box. Not cool.", "Teeth? On a CHEST? Duuude."],
  objective: ["Done! No rush, no fuss.", "Got there first. Again.", "No pressure, just tea-sure."],
};
