// Mothball: main story arc and nemesis scenes (cartoon voice, see docs/VOICE.md).
import type { StoryLine } from '../stories';

export const TITLE = "Chasing the Moon";
export const TAGLINE = "A dreamy little moth who thinks every light is the moon!";
/** same keys as STORIES[4].beats except the w{N}-elite and w{N}-s{n} ones */
export const ARC: Record<string, StoryLine[]> = {
  "intro": [["n", "Every night, the kitchen moon shone through the window. Then the Head Chef vanished, and the moon went dark!"], ["me", "Oh, mooooon! Where'd you go?"], ["me", "Don't worry, I'm coming! I always find the light. Well... usually. Okay, sometimes!"]],
  "w1-open": [["me", "Ooooh, the Countertop is sooo bright today! Moon? Is that you?"], ["me", "Aw, nope. Just the ceiling light. Hi, ceiling light!"]],
  "w1-boss": [["boss", "THE BURNER IS MY THRONE! ITS GLOW IS MINE! ALL MINE!"], ["me", "Whoa, your glow is way too hot and way too grumpy, Your Majesty!"], ["me", "Sorry, but somebody's gotta cool you down! Flap flap, FWOOSH!"]],
  "w1-after": [["boss", "Ugh... a soft little light. Thanks, kiddo. The green fuzz is gone!"], ["me", "Yay! Hey, have you seen the moon? Pale and round and super gentle?"], ["boss", "Try the Fridge! It glows whenever somebody opens the door."], ["me", "Ooh! Fridge, here I come!"]],
  "w2-open": [["me", "Ooh, a cold light! Is it the moon? Is it, is it?"], ["me", "Hmm. Nah, way too blue. The moon's more of a creamy vanilla."]],
  "w2-boss": [["boss", "ALL LIGHT WILL FREEEEEZE! FREEZE, I SAY!"], ["me", "Nuh-uh! Not my light! Not EVER!"]],
  "w2-after": [["boss", "Whoa, warm... I remember warm! Hey, little moth, your moon is the Oven lamp."], ["me", "The Oven lamp? Really?"], ["boss", "Yup. It went out when the Chef left. Sorry! Brr, I'm still a bit frosty."]],
  "w3-open": [["me", "Ooh, the Oven is so toasty! I can feel the moon somewhere up above!"], ["me", "Hang on, moon! I'm coming! Flap flap flap!"]],
  "w3-boss": [["boss", "MOTHS ARE DRAWN TO FLAME! COME CLOSER, LITTLE SNACK! HAHAHA!"], ["me", "Nope! I'm drawn to the moon. You're just a big greasy nightlight!"]],
  "w3-after": [["n", "The Oven lamp flickers back on, pale and round!"], ["me", "My moon! Hi, moon! ...Um, why are you so dim?"], ["boss", "Uh, sorry. The Mold Crown's been slurping up the kitchen's light."], ["boss", "It hides in the Pantry. Then somewhere even deeper. Blech!"]],
  "w4-open": [["me", "Dark shelves and dusty air. Ah-choo! Okay, wings, time to glow!"], ["me", "Follow me, everybody! I'm the nightlight now!"]],
  "w4-boss": [["boss", "NO LIGHT IN MY JAR! ONLY COOKIES! COOOOKIES!"], ["me", "There's a moon in there and you know it! Let the light OUT!"]],
  "w4-after": [["n", "CRASH! The jar breaks open, and moonlight pours across the Pantry!"], ["me", "Ooooh... there you are! Hi, moon! I missed you SO much!"], ["mold", "Hehehe. Enjoy it while it lasts, moth. Down in the Sink, there's no light at all."], ["me", "No light? Then I'll bring some! I've got plenty!"], ["n", "To be continued in World 5: The Sink."]],
  "w5-open": [["me", "The Sink! Ooh, so many bubbles, and every one has a teeny moon inside! Hi, teeny moons!"], ["me", "It's getting darker down by the drain. That's okay! I brought my glow. Flap flap!"]],
  "w5-boss": [["boss", "Hehehe... the little light came to me. I drank your moon, moth. Every last drop!"], ["me", "You did WHAT?! That's not a drink, that's the MOON!"], ["boss", "And it tasted sooo creamy. Now for dessert. YOU!"], ["me", "Nope! Spit it out! The moon is coming out of you right NOW! FWOOSH!"]],
  "w5-after": [
    ["boss", "Squeak! Hic! Okay, okay! I'm just a teeny science project! Somebody grew me in the back of the fridge and forgot about me!"],
    ["me", "Aww. Who?"],
    ["boss", "Can't tell! Hic! Bye! SLUUURP!"],
    ["n", "GLUG! Down the drain! And up from the plughole pours a river of silvery moonlight!"],
    ["me", "Ooh, a note from the Chef! \"Safe and sound. Somebody please leave the window open!\""],
    ["me", "The light's floating up! Up the faucet, out the window! Wait for me!"],
    ["me", "There you are! Big and round and bright! Hi, moon! Did ya miss me?"],
    ["foe", "Bzzt... wow. That IS a nice light. Can I watch too? No zapping. Promise."],
    ["me", "Sure, Zapsy! Ooooh, shiny! And this time it really IS the moon! Hee!"],
  ],
  "w6-open": [
    ["n", "Act 2: Beyond the Kitchen! It's moon-watching night at the kitchen window..."],
    ["me", "Hi, moon! Hi, Zapsy! And hiii to the big sparkly chandelier next door!"],
    ["me", "Huh? Where'd the chandelier go? The whole Dining Room just went DARK!"],
    ["lo", "Hmph. Forgotten rooms don't need lights, moth. Soon the whole house'll be dark and stale."],
    ["me", "Forgotten?! That chandelier is the moon's sparkly cousin! Nobody forgets family!"],
    ["me", "Hang on, chandelier! Mothball's coming to switch you back on! Flap flap!"],
  ],
  "w6-boss": [
    ["boss", "Halt, moth! I am SIR STALE! This table is MINE, and I like it dark and crusty!"],
    ["me", "Ooh, a knight! And a big shiny butter knife! Is that the... nope. Not the moon."],
    ["boss", "Forsooth, quit gawking at my lance! Have at thee!"],
    ["me", "Sorry, Sir Crusty! Lights back on, right NOW! FWOOSH!"],
  ],
  "w6-after": [
    ["n", "SNAP! The lance breaks, and the chandelier blinks back on, all twinkly!"],
    ["boss", "Crusty?! I am VINTAGE! Out the window I go! Baron Brussels shall roast thee in the Backyard, moth!"],
    ["me", "Ooooh, twinkly! Hi, chandelier! The moon says hi!"],
    ["me", "Wait, the Backyard? That's OUTSIDE, where the real sky is! With real stars! Wait for me!"],
  ],
  "w7-open": [
    ["me", "Ooooh! The Backyard! The REAL sky, all golden and HUGE! Hi, sky!"],
    ["me", "String lights everywhere! Moon? Moon? Moon? Aw, they're all bulbs. Very nice bulbs, though!"],
    ["me", "Uh-oh, that big grill is puffing smoke all over the sky. How's the moon gonna come out? Flap flap!"],
  ],
  "w7-boss": [
    ["boss", "ATTEN-TION, moth! I am BARON BRUSSELS! My grill smoke shall cover this sky FOREVER!"],
    ["me", "But the moon comes out tonight! It's got a whole show planned!"],
    ["boss", "No moon! No stars! Nothing up there but STINK! Sprout Soldiers, FORM UP!"],
    ["me", "Pee-yew! Okay, wings, big flap! Clear the sky! FWOOSH!"],
  ],
  "w7-after": [
    ["n", "FWOOSH! The smoke blows away, and Baron Brussels goes rolling off the grill into the grass!"],
    ["boss", "Always left on the PLATE! The Mystery Meatloaf awaits you in the Garden, moth! Nobody knows what's in him!"],
    ["me", "Ooh, a mystery! Is it moonlight? Is it, is it?"],
    ["boss", "Not even HE knows! Hmph! Sprout Soldiers, ROLL OUT!"],
    ["me", "Look, the sky's clear! And there it is, peeking over the fence! Hi, REAL moon! Garden, here I come!"],
  ],
  "w8-open": [
    ["me", "Ooooh! The Garden! Hundreds of teeny blinky lights! Are you baby moons? Are you, are you?"],
    ["n", "They're fireflies! And they blink right back at Mothball!"],
    ["me", "Hi, fireflies! Wanna watch the moon come up together? Mystery Meatloaf first, though. Flap flap!"],
  ],
  "w8-boss": [
    ["boss", "Who's there?! I'm THE MYSTERY MEATLOAF! Don't stare! I don't even know what I'm made of!"],
    ["me", "Ooooh, shiny! There's a teeny round moon in your tummy!"],
    ["boss", "That's a BUTTON?! Huh! Am I beef? Am I lentils? WHO AM I? Nobody ever wanted SECONDS!"],
    ["me", "Aww, mysteries are fun! But you're still not the moon! FWOOSH!"],
  ],
  "w8-after": [
    ["n", "SPLORT! The Mystery Meatloaf wobbles off the heap, peas bouncing everywhere!"],
    ["boss", "To the SUPERMARKET! The Tupperwraith haunts the back aisles! Nobody's opened HIM in years!"],
    ["me", "A ghost in a tub, all alone in the dark? Aww, he needs a nightlight! I'll bring one!"],
    ["me", "Ooh, look! The moon's up over the greenhouse! Hi, moon! Wanna come to the supermarket?"],
  ],
};
export const NEMESIS: Record<"w1-elite" | "w2-elite" | "w3-elite" | "w4-elite" | "w5-elite" | "w6-elite" | "w7-elite" | "w8-elite", StoryLine[]> = {
  "w1-elite": [["foe", "Bzzzt! Hey there, little moth! Come to the light! MY light! Only my light!"], ["me", "Ooooh, you're so bright! But, um, you're not the moon."], ["foe", "I can BE your moon! Closer, closerrrr... BZZZZT!"], ["me", "Yikes! My fuzz! Okay, no thank you!"]],
  "w2-elite": [["foe", "Bzzt! Even in the cold, moths come to Zapsy! They ALWAYS come!"], ["me", "Not this moth! I know the difference now. The moon doesn't go ZAP!"]],
  "w3-elite": [["foe", "Bzzt! The oven glows, but I glow BRIGHTER! Look at me, moth! LOOK AT ME!"], ["me", "La la la, not looking! I'm daydreaming about moonlight!"]],
  "w4-elite": [["foe", "Why won't you love my light?! EVERYBODY loves my light! Bzzt!"], ["me", "Your light just wants to catch stuff. The moon only wants to shine!"], ["foe", "Bzz, bzz... I just wanted a buddy. *sniff*"]],
  "w5-elite": [["foe", "BZZZT! Look, moth! Steel wool coils! I'm the BRIGHTEST thing in the whole Sink!"], ["me", "Ooh, you are super sparkly. But you're still not the moon, Zapsy!"], ["foe", "Bzz! Then what am I supposed to BE?! Fine! Beat me and maybe I'll quit zapping. MAYBE!"], ["me", "You could be a nightlight! Nightlights are everybody's buddy!"]],
  "w6-elite": [["foe", "Bzzt! Moth! Roast Brute on the ridge. I lit it up so you can see it coming. Nightlight duty!"], ["me", "Zapsy! You came! And you're glowing all friendly!"], ["foe", "Bzz, don't tell anybody. I've got a reputation. ZAP! Er, I mean, good luck."]],
  "w7-elite": [["foe", "Bzzt! Moth! Burger Brute up on Patty Plateau. Big, beefy, and it keeps trying to grill ME!"], ["me", "Zapsy! You came outside too! Ooh, you glow just like the string lights!"], ["foe", "Bzz, I'm brighter. Okay, same. Go get it, I'll light the way!"]],
  "w8-elite": [["foe", "Bzzt! Moth! Pumpkin Brute at Gourd Guard. It's got a scary carved face, and it's not even Halloween!"], ["me", "Zapsy! Ooh, look, the fireflies keep blinking at you!"], ["foe", "Bzz, they think I'm their big brother! I'm not crying, it's POLLEN! Go, I'll light the way!"]],
};
