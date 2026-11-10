# World 8 story brief (Act 2) for writers

Read `docs/VOICE.md` and follow it strictly (tests: `tests/voice.test.ts`, `tests/banter.test.ts`: no em dashes or
semicolons, no stiff words, at most two "..." per scene, short-scene lines max 130 chars, 1-3 lines per short scene).
Read your kaiju's `src/story/arcs/k<sp>.ts` and `src/story/more/k<sp>.ts` end to end, ESPECIALLY its World 7 scenes
(`w7-open`, `w7-*`, `w7-after`): World 8 continues straight on from where Baron Brussels rolled off to the Garden, with the
kaiju's Act 2 goal and running gags. `docs/WORLD6-BRIEF.md` explains Act 2 and the Leftovers.

## The world: The Garden
A giant vegetable garden at sunset seen from tiny-creature height: sunflower and corn-stalk forests, cabbage and pumpkin
hills, a watering-can tower, a bean trellis, fireflies, a compost heap and an old glass greenhouse. Hazard: big FLOWERS
puff POLLEN clouds that sting a little and leave sticky pollen (achoo jokes welcome). Monsters (the Leftovers' troops,
wilted and scruffy): Lettuce Snails (shield), Ladybug Gliders (fly), Peapod Snipers, Potato Moles (pop out of the
ground), Tomato Lobbers (turrets), Radish Bombers (run up and explode), Pumpkin Brutes (big), Mystery Chunks (the boss's
little meat bits).

Boss: **THE MYSTERY MEATLOAF**, Leftovers lieutenant: a lumpy grey-brown meatloaf with a ketchup glaze and odd things
poking out of him (a pea, a carrot coin, a button, a toy wheel). Nobody knows what's in him, not even him: he keeps
discovering new ingredients mid-fight ("Huh, a SOCK?"), shifty and rambling, with an identity crisis ("Am I beef? Am I
lentils? WHO AM I?"), bitter that nobody ever wanted seconds. His moves borrow from everyone. Beaten, he wobbles off toward
the SUPERMARKET, teasing the next lieutenant: THE TUPPERWRAITH, a ghostly old food tub haunting the back aisles
("Nobody's opened HIM in years!"). Not cured: a villain. Sir Stale (`lo2`) can grumble from the sidelines; Old Fruitcake
(`lo`) at most once.

Locals: two new kaiju live in the Garden and can cameo (species numbers): **Sloba (12)**, a super-sleepy bubble-tea sloth
("Heyyy... duuude..."); **Minturtle (16)**, an ultra-chill mint-choc-chip ice-cream turtle ("Stay frosty.") who is secretly
terrified of melting in the sun. Bubblegumbo (9) and Velvaroo (18) can cameo too.

Stages: 8-1 Seedling Lane (w8-open before it) · 8-2 Watering Can Run: a giant rolling pin chases you · 8-3 Sunflower Grove:
arena, a lever drops a rolling pin · 8-4 Pumpkin Patch Path: escort a lost Crumblet to the exit · 8-5 Gourd Guard: a
Pumpkin Brute elite (w8-elite before it) · 8-6 Beanstalk Heights: grab the Recipe Scroll in time, then hold out · 8-7
Compost Keep: arena, secret chest with the World 8 key on a high ledge (bouncy sponge) · 8-8 Scarecrow Stand: survive 45
seconds · 8-9 Greenhouse Steps: arena, the Meatloaf's voice · 8-10 The Mystery Heap: THE MYSTERY MEATLOAF.

## What to write for each kaiju (add to its existing files only)
`src/story/arcs/k<sp>.ts` `ARC`: `"w8-open"` (2-4 lines, arriving in the Garden, on with its Act 2 goal),
`"w8-boss"` (2-4 lines, `"boss"` is the Mystery Meatloaf), `"w8-after"` (3-5 lines: he wobbles off to the Supermarket,
Tupperwraith tease). In the object that holds its `w7-elite` (keep it there, add the key to its type): `"w8-elite"`
(2-3 lines: the old nemesis `"foe"` or a cameo friend warns about the Pumpkin Brute ahead, in a fun way).
`src/story/more/k<sp>.ts` `BEATS` (comment `// World 8: The Garden.`): `"w8-s2"`, `"w8-s3"`, `"w8-s4"`, `"w8-s6"`,
`"w8-s7"`, `"w8-s8"`, `"w8-s9"` (1-3 lines; speakers `"me"`, `"n"`, `"foe"`, `"lo"`, `"lo2"`, or a species number for a
cameo, e.g. 12 or 16 sometimes, Bluebeary 10 on 8-4). The Meatloaf's voice in short scenes: narrator-quoted or via `"lo2"`
Sir Stale grumbling, since `"boss"` is only for w8-boss / w8-after. Garden, vegetable, growing, compost, "mystery meat",
"what's the beef", "lettuce", "turnip for the books", "you reap what you sow" puns.

## When done
Run `npx tsc --noEmit` and `npx vitest run tests/voice.test.ts tests/banter.test.ts`. Banter only fully passes once every
writer is done (the test stops at the first failing kaiju, so check yours with a temporary test if needed, then delete it).
Make sure no failure names YOUR kaiju. Don't edit tests or other kaiju's files. Don't commit.
