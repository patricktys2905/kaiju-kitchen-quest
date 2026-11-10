// Dumplord: main story arc and nemesis scenes (cartoon voice, see docs/VOICE.md).
import type { StoryLine } from '../stories';

export const TITLE = "The Lord of Leftovers";
export const TAGLINE = "Hear ye! A teeny dumpling king goes looking for subjects!";
/** same keys as STORIES[6].beats except the w{N}-elite and w{N}-s{n} ones */
export const ARC: Record<string, StoryLine[]> = {
  "intro": [["me", "Hear ye, hear ye! With the Head Chef gone, this kitchen needs a ruler!"], ["me", "And clearly that's us! Dumplord, Lord of All Leftovers! Ta-daaa!"], ["n", "*chirp chirp*"], ["me", "Ahem! Our loyal subjects must be shy. Very well, we shall go COLLECT them!"]],
  "w1-open": [["me", "Citizens of the Countertop! Your lord has arrived! Hooray! Wait, why are they ATTACKING?"]],
  "w1-boss": [["boss", "THERE IS ONLY ONE KING HERE! AND IT'S ME!"], ["me", "Splendid! Then you can be our very first duke!"]],
  "w1-after": [["boss", "Duke? Huh. Well, I suppose you did scrub off that horrible green fuzz..."], ["me", "Hooray! One subject! Onward, Duke Toast! We must recruit more!"]],
  "w2-open": [["me", "Ah, the Northern Provinces! Brrr! Chilly, but FULL of potential citizens!"]],
  "w2-boss": [["boss", "NO RULERS! ONLY ICE! ICE FOREVER!"], ["me", "Every kingdom needs ice! For drinks! Join us!"]],
  "w2-after": [["boss", "Ohh, my frosty head. I shall guard your kingdom's freezer, Lord Dumplord."], ["me", "Two subjects! We're practically an EMPIRE!"]],
  "w3-open": [["me", "The Southern Steam Lands! Ahhh, toasty. We feel right at home!"]],
  "w3-boss": [["boss", "BOW TO THE DRAGON! BOW, I SAY! RAAAWR!"], ["me", "Ooh, a dragon! Every empire needs a dragon!"]],
  "w3-after": [["boss", "Wait, so you fought me to make me your... friend?"], ["me", "Subject, friend. Same thing, right?"], ["boss", "Nope! But I like \"friend\" better."], ["me", "Oh! Huh. Us too, actually!"]],
  "w4-open": [["me", "Our friends are waiting! And a good lord ALWAYS brings snacks."]],
  "w4-boss": [["boss", "NO SHARING! ALL COOKIES ARE MINE! MINE!"], ["me", "A good ruler SHARES! We only just learned that, but it's TRUE!"]],
  "w4-after": [["boss", "Cookies for everybody! Come on, the whole kitchen, dig in! Munch munch!"], ["me", "We came for subjects and got friends instead! What a bargain!"], ["mold", "Hehehe... a lovely little court. The Mold Crown will rule it all from the Sink."], ["me", "Oh, no you don't! There's only room for one crown here, and OURS is made of dough!"], ["n", "To be continued in World 5: The Sink."]],
};
export const NEMESIS: Record<"w1-elite" | "w2-elite" | "w3-elite" | "w4-elite", StoryLine[]> = {
  "w1-elite": [["foe", "Halt, commoner dumpling! I, Duke Fortune Cookie, am the rightful heir of the kitchen!"], ["me", "Rightful?! WE are Dumplord, Lord of All Leftovers!"], ["foe", "Hah! My fortune says: \"You will lose.\" Guards, get him!"]],
  "w2-elite": [["foe", "My fortune says: \"Cold days ahead for dumplings.\" Ha ha HA!"], ["me", "Oh yeah? Ours says: \"Your shell will crack.\" We wrote it ourselves!"]],
  "w3-elite": [["foe", "Bow before your Duke! My crumbly shell is IMPENETRABLE!"], ["me", "Your Grace, crumbly is pretty much the opposite of impenetrable."], ["foe", "Silence, dumpling! *crumble*"]],
  "w4-elite": [["foe", "The Mold Crown will crown ME! Me! Not some soggy little dumpling!"], ["me", "A crown's not worth much when your whole kingdom's covered in fuzz!"], ["foe", "Bah! My fortune says: \"Listen to the dumpling.\" Ugh! This isn't over!"]],
};
