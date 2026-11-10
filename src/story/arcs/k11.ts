// Pizzaraptor: main story arc and nemesis scenes (cartoon voice, see docs/VOICE.md).
import type { StoryLine } from '../stories';

export const TITLE = "30 Minutes or Less";
export const TAGLINE = "Beep beep! Special delivery, and the clock is TICKING!";
/** same keys as STORIES[11].beats except the w{N}-elite and w{N}-s{n} ones */
export const ARC: Record<string, StoryLine[]> = {
  "intro": [
    ["n", "One large pepperoni, extra cheese, for the Head Chef! Delivery time: thirty minutes!"],
    ["me", "Raptor Express never misses a delivery! Beep beep!"],
    ["me", "Huh? Hello? Chef? Wait, the customer's gone MISSING?!"],
    ["me", "Well, the clock's still ticking! Let's GO!"],
  ],
  "w1-open": [
    ["me", "Shortcut across the Countertop! Keep the box level, keep the cheese hot! Vroom!"],
  ],
  "w1-boss": [
    ["boss", "I SMELL PIZZA! HAND IT OVER, LIZARD!"],
    ["me", "Are you the Head Chef? No? Then no pizza for YOU!"],
  ],
  "w1-after": [
    ["boss", "Ow. That pizza smelled amazing, though. The Chef went toward the Fridge, I think?"],
    ["me", "The FRIDGE? My cheese'll go cold! Faster, faster!"],
  ],
  "w2-open": [
    ["me", "Brrr! Pizza box, stay warm! Think warm thoughts! Think toasty ovens!"],
  ],
  "w2-boss": [
    ["boss", "EVERYTHING WILL BE FROZEN PIZZA! MWAHAHA!"],
    ["me", "Frozen pizza?! That's a CRIME!"],
  ],
  "w2-after": [
    ["boss", "Whoa, the mold's gone! The Chef? Uh, they followed a yummy smell into the Oven."],
    ["me", "An oven! Perfect for reheating! Go, go, GO!"],
  ],
  "w3-open": [
    ["me", "Ding! Reheating complete! Now WHERE is my customer?!"],
  ],
  "w3-boss": [
    ["boss", "THE PIZZA! GIVE ME THE PIZZA! DRAGONS LOVE PIZZAAA!"],
    ["me", "Do dragons love TIPPING? Do you tip? Didn't think so!"],
  ],
  "w3-after": [
    ["boss", "Fine, fine! The Chef's hat went up into the Pantry. Take the stairs on the left."],
    ["me", "Thanks, big guy! Five-star review!"],
  ],
  "w4-open": [
    ["me", "Overtime. WAY overtime. But Raptor Express NEVER gives up! Beep beep!"],
  ],
  "w4-boss": [
    ["boss", "COOOKIES! AND NOW... PIZZA! NOM NOM!"],
    ["me", "No pizza for you, you overgrown biscuit tin!"],
  ],
  "w4-after": [
    ["me", "Inside the jar? Just the Chef's hat and a note! \"Gone to the Sink to stop the Mold Crown.\""],
    ["me", "New delivery address: the Sink! And the box is still warm. Mostly. Kinda."],
    ["mold", "Hehehe! Bring the pizza, little raptor. The Crown is HUNGRY."],
    ["n", "To be continued in World 5: The Sink."],
  ],
  "w5-open": [
    ["me", "The Sink! Delivery address confirmed! Minute, uh, let's just call it \"fashionably late\"!"],
    ["me", "Box is warm-ish, customer's somewhere down a drain. Easy! Beep beep!"],
  ],
  "w5-boss": [
    ["boss", "Hehehe... a pizza for the Crown? Ooh, you shouldn't have, little courier."],
    ["me", "I DIDN'T! It's for the Head Chef! It says so right on the box!"],
    ["boss", "Leave it with me. Let it get nice and fuzzy. Nobody tips a lizard anyway!"],
    ["me", "That's it! ZERO stars! Beep beep, Raptor Express coming THROUGH!"],
  ],
  "w5-after": [
    ["boss", "Squeak! Stop! I'm only a little science project! Somebody grew me in the back of the fridge and forgot!"],
    ["me", "Who?! I need a name for the complaint form!"],
    ["boss", "Nope! Bye-bye! SLUUURP!"],
    ["n", "GLUG! Down the drain it goes! The Head Chef is safe, and look, a little table set for one!"],
    ["me", "Special delivery! One large pepperoni, extra cheese! And there's the Chef's hat. Close enough, sign here!"],
    ["me", "Whoa, a whole jar of crumbs for a tip?! Biggest tip in kitchen history!"],
    ["foe", "Five stars, raptor. Even I gotta admit it."],
    ["me", "Delivered at minute two hundred and... something! Thirty minutes or less, give or take a WEEK!"],
    ["me", "*bows* Thank you, thank you! Raptor Express ALWAYS delivers! Eventually! Beep beep!"],
  ],
  "w6-open": [
    ["n", "Act 2: Beyond the Kitchen! Ring ring! A brand new order for Raptor Express!"],
    ["me", "Raptor Express, fastest claws in the kitchen! Uh-huh. One FEAST-size pizza, to... the Head of the Table?"],
    ["lo", "Hmph. For the Feast of the Forgotten, lizard. Thirty minutes. And make it STALE."],
    ["me", "Stale?! I deliver HOT and FRESH, buddy! But, uh... feast-size order, feast-size tip?"],
    ["me", "Order accepted! Clock starts NOW! Dispatch, don't wait up! Beep beep!"],
  ],
  "w6-boss": [
    ["boss", "Hark, the courier! I am SIR STALE, Head of the Table! And thy pizza is FAR too fresh!"],
    ["me", "YOU placed the order?! Who orders a stale pizza? What kind of monster are you?!"],
    ["boss", "A VINTAGE one! Have at thee! And forsooth, no tip for thee, lizard!"],
    ["me", "No tip?! ZERO stars! Beep beep, Raptor Express coming THROUGH!"],
  ],
  "w6-after": [
    ["n", "SNAP! Sir Stale's butter-knife lance breaks clean in two!"],
    ["boss", "Unhand me, varlet! I'm off to the Backyard! Baron Brussels shall grill thy pizza to a cinder!"],
    ["me", "Hey! Sign for your order first! Aaand he jumped out the window. Classic dine-and-dash."],
    ["me", "New delivery address: the Backyard! A barbecue? Hot food? Finally, MY kinda crowd! Beep beep!"],
  ],
  "w7-open": [
    ["me", "Minute twenty-two! The Backyard! Grass like a jungle and zero road signs. One star for the map!"],
    ["me", "Smell that? BBQ smoke! The customer's up by the grill. Box is hot, claws are fast. Beep beep!"],
    ["lo2", "Hah! Thy pizza shall be GRILLED, courier! Charred to a cinder!"],
    ["me", "Grilled pizza is a thing, pal! And it's DELICIOUS! Vroom!"],
  ],
  "w7-boss": [
    ["boss", "ATTEN-TION, lizard! I am BARON BRUSSELS! I am confiscating that pizza for SPROUT TOPPINGS!"],
    ["me", "Sprouts on pizza?! That's worse than PINEAPPLE! Pete's gonna flip!"],
    ["boss", "Sprout Soldiers, FORM UP! Pee-yew? Nonsense! That is the smell of DISCIPLINE!"],
    ["me", "Smells like a gym bag! ZERO stars! Beep beep, coming THROUGH!"],
  ],
  "w7-after": [
    ["n", "SIZZLE! Baron Brussels bounces off the Grill Summit and goes rolling into the grass!"],
    ["boss", "Always left on the PLATE! The Mystery Meatloaf will flatten you in the Garden, lizard! Nobody knows what's in him! Not even HIM!"],
    ["me", "Did he sign? Nope! Did he TIP? Nope! Another dine-and-dash! Er, dine-and-ROLL!"],
    ["me", "Mystery Meatloaf, huh? Sounds like a guy who never reads the menu."],
    ["me", "New delivery address: the Garden! Minute thirty-something. Round it DOWN and I'm still on time! Beep beep!"],
  ],
  "w8-open": [
    ["me", "Minute thirty-five! The Garden! Fresh veggies everywhere! Ooh, free toppings!"],
    ["me", "Ah-CHOO! Pollen on the box?! Nope nope nope. That is NOT on the menu!"],
    ["lo2", "Hah! The Mystery Meatloaf awaits thy pizza, courier! He'll eat it, then forget what it was!"],
    ["me", "Order says \"Head of the Table\". Meatloaf, buddy, you better have ID! Beep beep!"],
  ],
  "w8-boss": [
    ["boss", "PIZZA?! Is THAT what's inside me? No, wait... huh, a carrot coin. And a BUTTON?"],
    ["me", "You don't even know your own ingredients?! How do you fill out the allergy form?!"],
    ["boss", "Am I beef? Am I lentils? WHO AM I?! Nobody ever orders SECONDS of me!"],
    ["me", "One star for the mystery meat! Beep beep, Raptor Express coming THROUGH!"],
  ],
  "w8-after": [
    ["n", "SPLORT! The Mystery Meatloaf wobbles off the heap, leaving a trail of peas and one toy wheel!"],
    ["boss", "To the SUPERMARKET! The Tupperwraith haunts the back aisles! Nobody's opened HIM in years!"],
    ["me", "Hey! Sign for the order! Aaand he's gone. Dine-and-dash, dine-and-roll, now dine-and-WOBBLE!"],
    ["me", "A ghost in a leftovers tub? Spooky. But hey, airtight lid. Respect."],
    ["me", "New delivery address: the Supermarket! Minute forty-ish. That's basically on time! Beep beep!"],
  ],
};
export const NEMESIS: Record<"w1-elite" | "w2-elite" | "w3-elite" | "w4-elite" | "w5-elite" | "w6-elite" | "w7-elite" | "w8-elite", StoryLine[]> = {
  "w1-elite": [
    ["foe", "Pineapple Pete Express! Fastest wheels in the kitchen! That pizza's MINE to deliver!"],
    ["me", "Raptor Express doesn't share routes, Pete! Beep beep, outta my way!"],
  ],
  "w2-elite": [
    ["foe", "Hehe! I put pineapple all over your route, raptor. Slippery, huh?"],
    ["me", "Pineapple on pizza is a crime. Pineapple on the FLOOR? That's WAR!"],
  ],
  "w3-elite": [
    ["foe", "Tick tock, raptor! Your thirty minutes are almost up! Hahaha!"],
    ["me", "I ALWAYS deliver! Always! Now get outta my lane!"],
  ],
  "w4-elite": [
    ["foe", "The mold promised me every delivery in the kitchen if I stopped you!"],
    ["me", "Pete, buddy, the mold doesn't TIP. Trust me."],
    ["foe", "Huh. It really doesn't. Aw, nuts!"],
  ],
  "w5-elite": [
    ["foe", "Raptor! Look, steel wool turbo wheels! Last race! Winner takes EVERY route!"],
    ["me", "Pete, buddy, we talked about this. The mold doesn't TIP!"],
    ["foe", "It gave me SPEED, though! Ugh, fine. Beat me and maybe I'll quit pineappling your lane. MAYBE!"],
    ["me", "Deal! Beep beep, eat my bubbles!"],
  ],
  "w6-elite": [
    ["foe", "Raptor, hold up! Roast Brute on the ridge. Big, beefy, and it eats delivery guys for lunch!"],
    ["me", "Pete?! You're giving me a TRAFFIC report?!"],
    ["foe", "Hey, only I get to beat you! Now go! I'm timing ya. No pineapple, promise!"],
  ],
  "w7-elite": [
    ["foe", "Raptor! Traffic alert! Burger Brute on Patty Plateau. Three patties high and blocking BOTH lanes!"],
    ["me", "Pete! Another traffic report?! You're getting good at this!"],
    ["foe", "Go, go! I gotta flip my pineapple. On a GRILL it's allowed. Look it up!"],
  ],
  "w8-elite": [
    ["foe", "Raptor! Traffic alert! Pumpkin Brute at Gourd Guard. Big, round, and parked in BOTH lanes!"],
    ["me", "Pete! Your traffic reports get five stars from me!"],
    ["foe", "Go, go! I'm off to the pineapple patch. Wait, pineapples don't grow here?! Aw, nuts!"],
  ],
};
