// Toastbat: main story arc and nemesis scenes (cartoon voice, see docs/VOICE.md).
import type { StoryLine } from '../stories';

export const TITLE = "The Golden Butter";
export const TAGLINE = "A smooth-talking toast bat pulls the butter heist of the century!";
/** same keys as STORIES[5].beats except the w{N}-elite and w{N}-s{n} ones */
export const ARC: Record<string, StoryLine[]> = {
  "intro": [["n", "Legend says the Head Chef kept one pat of Golden Butter, the richest treasure in the whole kitchen!"], ["me", "And now the Chef's gone missing. Which means nobody's guarding it. Heh."], ["me", "Ladies and gentle-crumbs, it's time for the heist of the century!"]],
  "w1-open": [["me", "Stay in the shadows, wings tucked. Shhh! Nobody ever notices a bit of toast."]],
  "w1-boss": [["boss", "A THIEF! IN MY KINGDOM! OFF WITH YOUR CRUST!"], ["me", "Whoa, thief is such a harsh word! I prefer \"treasure enthusiast\"."]],
  "w1-after": [["boss", "Ugh, my head... The Butter? The mould's after it too! It'll rot the whole kitchen with it!"], ["me", "Uh-oh. Then I'd better get there first. Heh. Strictly professional reasons."]],
  "w2-open": [["me", "The Fridge! Where butter lives! *sniff sniff* Ooh, I can almost smell it."]],
  "w2-boss": [["boss", "THE BUTTER MUST STAY FROZEN! FROZEN, I SAY!"], ["me", "Frozen butter's impossible to spread, big guy. Let it go!"]],
  "w2-after": [["boss", "Whoa, brain freeze. Sorry! The Butter isn't here. The Chef hid it somewhere warm."], ["me", "Somewhere warm, huh? The Oven it is!"]],
  "w3-open": [["me", "Phew, way too hot for butter in here! Unless somebody's keeping it safe..."]],
  "w3-boss": [["boss", "THE GOLDEN BUTTER IS MINE! MY HOARD! MY SHINY, SHINY HOARD!"], ["me", "Finders keepers? You didn't find it, pal. You swiped it. Like a THIEF!"], ["boss", "WAIT. ISN'T THAT YOUR JOB?"], ["me", "Hey! Leave me out of this!"]],
  "w3-after": [["n", "Uh-oh! Toastbat finds an empty butter dish and a note: \"Kept safe. -Chef. Pantry, top shelf.\""], ["me", "Aw, nuts! Of COURSE it's in the Pantry."]],
  "w4-open": [["me", "Last vault. Funny thing, I'm not sure I want the Butter for myself any more. Ugh, what's WRONG with me?"]],
  "w4-boss": [["boss", "NOBODY TOUCHES MY COOKIES! OR MY BUTTER! MINE MINE MINE!"], ["me", "It's not yours, cookie-breath. And hey, maybe it isn't mine either."]],
  "w4-after": [["me", "Whoa, it's glowing! And look, the mould melts away wherever it shines!"], ["me", "It's a CURE! The Chef was saving it to fix the whole kitchen!"], ["mold", "Hehehe... give it here, little thief. In the Sink, everything sours."], ["me", "Sorry, creepy. Just this once, this thief is giving something BACK."], ["n", "To be continued in World 5: The Sink."]],
};
export const NEMESIS: Record<"w1-elite" | "w2-elite" | "w3-elite" | "w4-elite", StoryLine[]> = {
  "w1-elite": [["foe", "Squeak squeak! Well, if it isn't the toast with wings! Going after the Golden Butter too?"], ["me", "Ricotta Rat. Last time I saw you, you swiped my crust!"], ["foe", "Hee hee! And THIS time I'm swiping your whole heist!"]],
  "w2-elite": [["foe", "The vault's in the cold, bat, and guess who's got the map? ME! Nyah nyah!"], ["me", "Maps are for amateurs, cheese-face. I FLY."]],
  "w3-elite": [["foe", "Mousetraps everywhere! Professional courtesy, of course. Squeak!"], ["me", "Cute. I've seen scarier traps in a cereal box."]],
  "w4-elite": [["foe", "The Butter's MINE! The Mold Crown pays double for it! DOUBLE, bat!"], ["me", "It's a cure, Ricotta. Some stuff you just don't sell."], ["foe", "Since when do YOU have a heart?! Ugh! This isn't over!"]],
};
