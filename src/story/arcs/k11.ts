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
};
export const NEMESIS: Record<"w1-elite" | "w2-elite" | "w3-elite" | "w4-elite", StoryLine[]> = {
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
};
