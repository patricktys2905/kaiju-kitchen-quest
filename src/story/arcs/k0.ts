// Gobzilla Jr.: main story arc and nemesis scenes (cartoon voice, see docs/VOICE.md).
import type { StoryLine } from '../stories';

export const TITLE = "Junior Goes Big";
export const TAGLINE = "A teeny strawberry with a GREAT BIG RAWR!";
/** same keys as STORIES[0].beats except the w{N}-elite and w{N}-s{n} ones */
export const ARC: Record<string, StoryLine[]> = {
  "intro": [
    ["n", "Meanwhile, in the kitchen... the Head Chef is GONE, and something sour is creeping in!"],
    ["me", "Rawr! Big brother says I'm too small to be a real kaiju."],
    ["me", "Hah! If I find the Chef, everybody's gotta call me Gobzilla SENIOR! Okay, okay. Gobzilla Medium."],
  ],
  "w1-open": [
    ["me", "The Countertop! Big brother crossed this whole thing in ONE stomp!"],
    ["me", "So that's like two hundred of my stomps. Easy peasy! Let's go!"],
  ],
  "w1-boss": [
    ["boss", "WHO DARES CLIMB MY STOVETOP?! I AM THE BURNT TOAST KING!"],
    ["me", "King? You're BREAKFAST, buddy! Rawr!"],
    ["boss", "SILENCE, CRUMB! BOW BEFORE MY CRUST!"],
  ],
  "w1-after": [
    ["boss", "Ooh, my head... was I shouting? I used to be such a nice slice!"],
    ["boss", "Then this green fuzz crawled all over my crust. Blech!"],
    ["me", "The Mold Crown! Where'd it come from?"],
    ["boss", "From the cold. The Fridge! Brrr."],
    ["me", "Then that's where I'm stomping next! Rawr!"],
  ],
  "w2-open": [
    ["me", "Brrr! My leaves are shivering! Real kaiju don't shiver!"],
    ["me", "Um, real kaiju wear scarves. Probably. Anybody got a scarf?"],
  ],
  "w2-boss": [
    ["boss", "COLD! SO COLD! EVERYBODY STAYS FROZEN! FOREVERRR!"],
    ["me", "Nope! Strawberries are best FRESH!"],
  ],
  "w2-after": [
    ["boss", "Drip, drip! Hey, the ice is melting outta my brain!"],
    ["boss", "That mold wanted me to freeze the WHOLE kitchen. Sorry, kiddo."],
    ["me", "It's okay! Did you see the Head Chef?"],
    ["boss", "Just a hat, floating off toward the warm glow of the Oven."],
    ["me", "A hat clue! Ooh, I'm a detective now too!"],
  ],
  "w3-open": [
    ["me", "Whoa, it's so hot in here my seeds are popping! Pop! Pop!"],
    ["me", "Big brother would just roar at the heat. RAWR! ...Nope, still hot."],
  ],
  "w3-boss": [
    ["boss", "A SNACK! A TINY SWEET SNACK FOR THE GREASE DRAGON! SLUUURP!"],
    ["me", "TINY?! I'm Gobzilla Jr., and I'm here to STOMP!"],
  ],
  "w3-after": [
    ["boss", "Phew! The grease is out of my eyes. You're pretty brave for a berry!"],
    ["me", "*sniff* Nobody ever called me brave before!"],
    ["boss", "The mold went up into the Pantry. Be careful, little one. Er, BIG one!"],
    ["me", "Didja hear that? BIG one! Rawr!"],
  ],
  "w4-open": [
    ["me", "The Pantry! Smells like old cereal and ADVENTURE!"],
    ["me", "Big brother never got this far. Hey... does that make ME the big one now?"],
  ],
  "w4-boss": [
    ["boss", "COOOKIES! ALL MINE! YOU'LL BE A COOKIE TOO! NOM NOM NOM!"],
    ["me", "Hey! The Chef's hat is inside that jar! Spit it out!"],
  ],
  "w4-after": [
    ["boss", "Hic! Thank you! I was keeping the Chef's hat safe, and then the mold got into my lid."],
    ["mold", "Hehehe... little berry. The Mold Crown waits in the Sink. Come and wear it."],
    ["me", "Big brother, if you can hear me, I'm going to the Sink! And I'm NOT scared!"],
    ["me", "Okay, medium scared."],
    ["n", "To be continued in World 5: The Sink."],
  ],
};
export const NEMESIS: Record<"w1-elite" | "w2-elite" | "w3-elite" | "w4-elite", StoryLine[]> = {
  "w1-elite": [
    ["foe", "Well, well! If it isn't Gobzilla JUNIOR! Lost your big brother, shrimp?"],
    ["me", "Brutus Beetroot! I'm a STRAWBERRY, ya big turnip!"],
    ["foe", "Same diff! Small and squishy! C'mon, shrimp, stomp ME! Hah!"],
  ],
  "w2-elite": [
    ["foe", "YOU again?! I froze my roots off getting here just to squash ya!"],
    ["me", "Then you came a looong way to lose, Brutus!"],
  ],
  "w3-elite": [
    ["foe", "Hah! The mold made me STRONGER, shrimp! Check out these roots!"],
    ["me", "Big brother says bullies are just scared kaiju with loud voices!"],
    ["foe", "I'm NOT SCARED! RAAAAH!"],
  ],
  "w4-elite": [
    ["foe", "Huff, puff! Every time! You get back up EVERY time! Why?!"],
    ["me", "'Cause real kaiju don't stay down! Even the medium ones!"],
    ["foe", "Hmph. Fine. One last round. And if you win... you can just call me Brutus, okay?"],
  ],
};
