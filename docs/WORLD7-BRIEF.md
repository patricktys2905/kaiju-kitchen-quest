# World 7 story brief (Act 2) for writers

Read `docs/VOICE.md` and follow it strictly (tests: `tests/voice.test.ts`, `tests/banter.test.ts`: no em dashes or
semicolons, no stiff words, at most two "..." per scene, short-scene lines max 130 chars, 1-3 lines per short scene).
Read your kaiju's `src/story/arcs/k<sp>.ts` and `src/story/more/k<sp>.ts` end to end, ESPECIALLY its World 6 scenes
(`w6-open`, `w6-*`, `w6-after`): World 7 continues straight on from where Sir Stale fled out the window to the Backyard,
with the kaiju's Act 2 goal and running gags. `docs/WORLD6-BRIEF.md` explains Act 2 and the Leftovers.

## The world: The Backyard BBQ
A giant backyard at golden hour seen from tiny-creature height: grass forests, a paddling-pool lake, a picnic-table
plateau, string lights, a garden hose, a giant barbecue grill smoking like a volcano. Hazard: lawn SPRINKLERS burst up,
launching you and leaving slippery puddles. Monsters (the Leftovers' troops): Picnic Wasps (fly), Corn Cob Cannons
(turrets), Ketchup Squirters (snipers), Kebab Beetles (charge), Charcoal Imps (pop out of the ground), Burger Brutes
(big), Sprout Soldiers (Baron Brussels' tiny troops).

Boss: **BARON BRUSSELS**, Leftovers lieutenant: a hulking Brussels sprout with a tiny military cap, a monocle and a leafy
moustache; stinky (little stink puffs, "pee-yew" jokes are fair game); talks like a pompous general ("ATTEN-TION!",
"Sprout Soldiers, FORM UP!"); bitter that nobody ever finishes their sprouts ("Always left on the PLATE!"). Beaten, he
rolls away in a huff toward the Garden, blabbing a tease about the next lieutenant: THE MYSTERY MEATLOAF ("Nobody knows
what's in him! Not even HIM!"). Not cured: he's a villain. Sir Stale (`lo2`) can still grumble from the sidelines;
Old Fruitcake (`lo`) can appear once at most.

Locals: two new kaiju live in the Backyard and can cameo (species numbers): **Bubblegumbo (9)**, a gentle bubblegum
elephant who "never forgets" (he forgets everything) and lost his birthday party; **Velvaroo (18)**, a brash red-velvet
kangaroo boxer ("In THIS corner!") who wants her Bake Sale championship back.

Stages: 7-1 Lawn Launch (w7-open before it) · 7-2 Hose Highway: a giant rolling pin chases you · 7-3 Sprinkler Springs:
arena, a lever drops a rolling pin · 7-4 Paddling Pool Pier: escort a lost Crumblet to the exit · 7-5 Patty Plateau: a
Burger Brute elite (w7-elite before it) · 7-6 Picnic Table Peak: grab the Recipe Scroll in time, then hold out · 7-7
Flowerpot Fort: arena, secret chest with the World 7 key on a high ledge (bouncy sponge) · 7-8 Cooler Canyon: survive
45 seconds · 7-9 Charcoal Climb: arena, Baron Brussels' voice · 7-10 The Grill Summit: BARON BRUSSELS.

## What to write for each kaiju (add to its existing files only)
`src/story/arcs/k<sp>.ts` `ARC`: `"w7-open"` (2-4 lines, arriving in the Backyard, on with its Act 2 goal),
`"w7-boss"` (2-4 lines, `"boss"` is Baron Brussels), `"w7-after"` (3-5 lines: he rolls off to the Garden, Meatloaf tease).
In the object that holds its `w6-elite` (keep it there, add the key to its type): `"w7-elite"` (2-3 lines: the old
nemesis `"foe"` or a cameo friend warns about the Burger Brute ahead, in a fun way).
`src/story/more/k<sp>.ts` `BEATS` (comment `// World 7: The Backyard BBQ.`): `"w7-s2"`, `"w7-s3"`, `"w7-s4"`, `"w7-s6"`,
`"w7-s7"`, `"w7-s8"`, `"w7-s9"` (1-3 lines; speakers `"me"`, `"n"`, `"foe"`, `"lo"`, `"lo2"`, or a species number for a
cameo, e.g. 9 or 18 sometimes, Bluebeary 10 on 7-4). The Baron's voice in short scenes: write it as narrator-quoted or via
`"lo2"` Sir Stale grumbling, since `"boss"` is only for w7-boss / w7-after. BBQ, grilling, picnic, summer, "well done",
"rare", "sizzle", "you're toast", "lettuce", "sprout" puns.

## When done
Run `npx tsc --noEmit` and `npx vitest run tests/voice.test.ts tests/banter.test.ts`. Banter only fully passes once every
writer is done; make sure no failure names YOUR kaiju. Don't edit tests or other kaiju's files. Don't commit.
