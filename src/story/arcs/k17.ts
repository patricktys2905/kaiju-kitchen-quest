// Pengwhip: main story arc and nemesis scenes (cartoon voice, see docs/VOICE.md).
import type { StoryLine } from '../stories';

export const TITLE = "Long Way Home";
export const TAGLINE = "Wheee! One little penguin, zero brakes, and a looong way home!";
/** same keys as STORIES[17].beats except the w{N}-elite and w{N}-s{n} ones */
export const ARC: Record<string, StoryLine[]> = {
  "intro": [["n", "When the Head Chef vanished, the freezer door was left wide open, and a little penguin slid out, and out, and OUT!"], ["me", "Wheeeeee! Uh-oh. Where am I?"], ["me", "Home is the freezer. Up and across! I can slide there! Probably!"]],
  "w1-open": [["me", "Warm countertop! Eek, my cream's going soft! Slide faster!"]],
  "w1-boss": [["boss", "A PENGUIN? ON MY STOVE? YOU'LL MELT!"], ["me", "Not if I slide fast enough! Wheee!"]],
  "w1-after": [["boss", "Ooh, my crumbs. You're a long way from home, little one."], ["me", "I know! The Fridge is that way! I think! Maybe!"]],
  "w2-open": [["me", "The Fridge! Ooh, so cold and lovely! I'm almost home!"]],
  "w2-boss": [["boss", "NO ONE LEAVES THE FREEZER! NO ONE!"], ["me", "But I'm trying to get IN!"]],
  "w2-after": [["n", "Creeeak! The freezer door swings open. Home at last!"], ["me", "HOME! Hellooo? Wow, it's quiet in here."], ["me", "Hmm. All my new pals out there still need help. Home can wait a teeny bit!"]],
  "w3-open": [["me", "The Oven. The opposite of home! I've gotta be brave. Or very silly. Maybe both!"]],
  "w3-boss": [["boss", "ICE CREAM! MY FAVOURITE DESSERT! SLUUURP!"], ["me", "Excuse me! I'm cookies AND cream, thank you very much!"]],
  "w3-after": [["boss", "Oof, sorry. You came all this way to help others? You're no ordinary penguin!"], ["me", "Nope! I'm an adventurer now! Pantry, here I come!"]],
  "w4-open": [["me", "Dusty and dry. Aw, I miss the snow. But my friends are counting on me!"]],
  "w4-boss": [["boss", "COOKIES AND CREAM! THE PERFECT DUNK!"], ["me", "Nobody dunks THIS penguin!"]],
  "w4-after": [["n", "Hooray! The Pantry's saved, and the whole kitchen sends Pengwhip home in style!"], ["me", "Group hug! Careful, I'm chilly! You're all coming to visit, right? Bring mittens!"], ["mold", "Hehehe... then you'll want to save them from the Sink, little penguin."], ["me", "Water?! I'm a PENGUIN! That's MY turf! Cannonball!"], ["n", "To be continued in World 5: The Sink."]],
};
export const NEMESIS: Record<"w1-elite" | "w2-elite" | "w3-elite" | "w4-elite", StoryLine[]> = {
  "w1-elite": [["foe", "A penguin? Out HERE? You're in my waters now, birdie! Duh-dun, duh-dun!"], ["me", "What water? This is a countertop!"], ["foe", "Everywhere's water if ya believe hard enough! CHOMP!"]],
  "w2-elite": [["foe", "The freezer was MY kingdom while you were gone, birdie! All hail King Finn!"], ["me", "Kingdom?! That's my HOME! And it's cold for everybody!"]],
  "w3-elite": [["foe", "Brrr-oil! Hot! Hot! I'm melting! This is your fault somehow!"], ["me", "Then let's finish this quick and get you somewhere cold!"]],
  "w4-elite": [["foe", "Last slide, birdie! Winner gets the freezer!"], ["me", "How about we share it? There's room for a shark AND a penguin!"], ["foe", "Share? Nobody ever asked me to share before. Uh, I mean, this isn't over!"]],
};
