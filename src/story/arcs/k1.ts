// Squidgeon: main story arc and nemesis scenes (cartoon voice, see docs/VOICE.md).
import type { StoryLine } from '../stories';

export const TITLE = "The Antidote";
export const TAGLINE = "A jelly mad scientist in a colander helmet, brewing up a cure!";
/** same keys as STORIES[1].beats except the w{N}-elite and w{N}-s{n} ones */
export const ARC: Record<string, StoryLine[]> = {
  "intro": [["me", "Lab notes, day one! The kitchen's caught a fungus-y infection. I'm calling it... the Mold Crown!"], ["me", "Main symptom: fuzz! Side effect: trying to eat everybody! Yikes!"], ["me", "Hypothesis: enough samples equals one antidote! Colander helmet: ON! EUREKA! Er, not yet. Soon!"]],
  "w1-open": [["me", "Sample site one: the Countertop! Hold still, spores, this won't hurt a bit! ...It'll hurt a bit."]],
  "w1-boss": [["boss", "NO EXPERIMENTS ON THE KING! GUARDS! I HAVE NO GUARDS! RAAAH!"], ["me", "Subject is hostile! Switching to tentacle-based science! WHAP WHAP WHAP!"]],
  "w1-after": [["boss", "Ugh, my crust... what happened?"], ["me", "You were infected! Now you're cured. Mostly! Please report any fuzz."], ["me", "Note to self: the spores get thicker toward the Fridge! Onward!"]],
  "w2-open": [["me", "Hmm! Cold slows mould down. So why is it partying in here? Curiouser and curiouser!"]],
  "w2-boss": [["boss", "SCIENCE WILL FREEEEEZE! EVERYTHING WILL FREEZE!"], ["me", "Actually, science will UN-freeze you! Hold still, this is a thaw-retical experiment!"]],
  "w2-after": [["me", "Fascinating! The golem's core had a spore cluster shaped like a teeny little crown!"], ["boss", "Brrr... it came from the Oven. No, wait, it went THROUGH the Oven. Going up."]],
  "w3-open": [["me", "Heat should kill spores! These ones are... thriving? Uh-oh. That's bad science."]],
  "w3-boss": [["boss", "BURN THE JELLY! BUUURN IT!"], ["me", "Jelly doesn't burn, it MELTS! Which is way worse for you, actually! SPLOOSH!"]],
  "w3-after": [["me", "Note to self: I need one final ingredient. A sample from the source!"], ["boss", "Ow. Sorry about the burning. The source is in the Pantry. That cookie jar's been acting weird."]],
  "w4-open": [["me", "Antidote at ninety percent! Just ONE more sample! Ooh, my tentacles are tingling!"]],
  "w4-boss": [["boss", "NO SCIENCE IN MY JAR! ONLY COOKIES!"], ["me", "Hah! Everything is science! ESPECIALLY you, mister cookie jar!"]],
  "w4-after": [["me", "EUREKA! Antidote complete! It cures all mould in a teeny tiny radius. Eh, close enough!"], ["mold", "Hehehe... little chemist. My Crown grows in the Sink, faster than you can brew."], ["me", "Then I'll brew FASTER! Note to self: next stop, the Sink!"], ["n", "To be continued in World 5: The Sink."]],
};
export const NEMESIS: Record<"w1-elite" | "w2-elite" | "w3-elite" | "w4-elite", StoryLine[]> = {
  "w1-elite": [["foe", "Ah, a colleague! Professor Penicillin, at your service. I study the Mold Crown too!"], ["foe", "I just happen to want it to WIN! Mwahaha!"], ["me", "Hey! That's not science, that's CHEATING!"]],
  "w2-elite": [["foe", "My spores LOVE the cold! Your little antidote is such a cute hypothesis. Hehehe!"], ["me", "Hypotheses get tested, Professor! And you're about to get tested! Pop quiz!"]],
  "w3-elite": [["foe", "Peer review time! My mushroom minions have some NOTES for you!"], ["me", "Your methods are wonky and your minions are mouldy! F minus!"]],
  "w4-elite": [["foe", "One drop of your antidote and I can make the Mold UNSTOPPABLE! Hand it over!"], ["me", "Results: REJECTED! Conclusion: you're going down, Professor!"], ["foe", "Fascinating... and slightly ouchy! This isn't over!"]],
};
