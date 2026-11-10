# World 9 story brief (Act 2) for writers

Read `docs/VOICE.md` and follow it strictly (tests: `tests/voice.test.ts`, `tests/banter.test.ts`: no em dashes or
semicolons, no stiff words, at most two "..." per scene, short-scene lines max 130 chars, 1-3 lines per short scene).
Read your kaiju's `src/story/arcs/k<sp>.ts` and `src/story/more/k<sp>.ts` end to end, ESPECIALLY its World 8 scenes
(`w8-open`, `w8-*`, `w8-after`): World 9 continues straight on from where the Mystery Meatloaf wobbled off to the
Supermarket, with the kaiju's Act 2 goal and running gags. `docs/WORLD6-BRIEF.md` explains Act 2 and the Leftovers.

## The world: The Supermarket
A giant supermarket at night after closing, seen from tiny-creature height: towering aisles like a city, cereal boxes like
buildings, a fruit and veg section, a bakery, a checkout conveyor, a frosty frozen aisle, and a dusty forgotten back
aisle. Hazard: FREEZER DOORS swing open and blast cold air that pushes you back and leaves an icy slick. Monsters (the
Leftovers' troops, past their sell-by dates): Trolley Rammers (charge), Plastic Bag Ghosts (fly), Bruised Banana Bunches
(cartwheel), Barcode Snipers (laser), Dented Can Turrets, Watermelon Brutes (big), Lost Lids (the boss's little helpers).

Boss: **THE TUPPERWRAITH**, Leftovers lieutenant: a ghostly old plastic food container with a floating lid, murky
leftovers swirling inside, spooky-but-funny "Woooo" voice, has been in the back of the fridge so long nobody remembers
what's inside it (not even it), deeply offended when anyone says "just throw it out". It's the Leftovers' hoarder: it
has been keeping the things they stole. Beaten, its lid pops off and the stolen treasures spill out (Crabbage's cabbage,
Toastbat's Golden Butter, Minturtle's thermostat knob, and anything else that fits YOUR kaiju's Act 2 goal), then it floats
off in a huff back to the HOUSE, where OLD FRUITCAKE is waiting for the Feast of the Forgotten: the final battle (World
10). Tease it: Old Fruitcake (`lo`) can speak once, ominously, in w9-after or w9-s9. Sir Stale (`lo2`) can grumble.

Locals: two new kaiju live in the Supermarket and can cameo (species numbers): **Bloblin (3)**, a bubbly wobbly lime
jelly cheerleader ("Wibble wobble!") who just wants to be invited to the dessert table; **Salmonster (14)**, a gung-ho
sporty salmon ("Let's GOOO!") from the fish counter who always swims against the current. Others can cameo too.

Stages: 9-1 Sliding Doors (w9-open before it) · 9-2 Trolley Track: a giant rolling pin chases you · 9-3 Cereal Aisle:
arena, a lever drops a rolling pin · 9-4 Fruit and Veg: escort a lost Crumblet to the exit · 9-5 Melon Mountain: a
Watermelon Brute elite (w9-elite before it) · 9-6 Bakery Bluff: grab the Recipe Scroll in time, then hold out · 9-7
Canned Goods Keep: arena, secret chest with the World 9 key on a high ledge (bouncy sponge) · 9-8 Checkout Chaos: survive
45 seconds · 9-9 The Frozen Aisle: arena, the Tupperwraith's voice · 9-10 The Back Aisle: THE TUPPERWRAITH.

## What to write for each kaiju (add to its existing files only)
`src/story/arcs/k<sp>.ts` `ARC`: `"w9-open"` (2-4 lines, arriving at the Supermarket), `"w9-boss"` (2-4 lines, `"boss"`
is the Tupperwraith), `"w9-after"` (3-6 lines: the lid pops, the treasures spill out (the kaiju gets back what it was
after, or a big clue), the Tupperwraith flees home to Old Fruitcake, the final battle is set up).
In the object that holds its `w8-elite` (keep it there, add the key to its type): `"w9-elite"` (2-3 lines: the old
nemesis `"foe"` or a cameo friend warns about the Watermelon Brute, in a fun way).
`src/story/more/k<sp>.ts` `BEATS` (comment `// World 9: The Supermarket.`): `"w9-s2"`, `"w9-s3"`, `"w9-s4"`, `"w9-s6"`,
`"w9-s7"`, `"w9-s8"`, `"w9-s9"` (1-3 lines; speakers `"me"`, `"n"`, `"foe"`, `"lo"`, `"lo2"`, or a species number for a
cameo, e.g. 3 or 14 sometimes, Bluebeary 10 on 9-4). The Tupperwraith's voice in short scenes: narrator-quoted or via
`"lo2"`, since `"boss"` is only for w9-boss / w9-after. Shopping, "clean-up on aisle nine", "best before", "expired",
"bag it", "check out", "on sale", "two for one", "shelf life" puns.

## When done
Run `npx tsc --noEmit` and `npx vitest run tests/voice.test.ts tests/banter.test.ts`. Banter only fully passes once every
writer is done (the test stops at the first failing kaiju, so check yours with a temporary test if needed, then delete it).
Make sure no failure names YOUR kaiju. Don't edit tests or other kaiju's files. Don't commit.
