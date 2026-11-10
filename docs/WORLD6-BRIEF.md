# World 6 story brief (Act 2 opener) for writers

Read `docs/VOICE.md` first and follow it strictly (enforced by `tests/voice.test.ts` and `tests/banter.test.ts`: no em dashes
or semicolons, no stiff words, at most two "..." per scene, short-scene lines max 130 chars, 1-3 lines per short scene).
Then read the kaiju's `src/story/arcs/k<sp>.ts` and `src/story/more/k<sp>.ts` end to end, ESPECIALLY its World 5 ending
(`w5-after`) and nemesis finale (`w5-elite`), so Act 2 picks up exactly where its story left off. Also read
`src/story/finale.ts` (the post-credits tease every kaiju saw).

## Where we are
Act 1 is over: the Mold Crown went down the drain, the Head Chef is safe, every kaiju got its happy ending.
But the Mold Crown was a "science project" grown by THE LEFTOVERS: a gang of forgotten foods from the back of the Fridge,
led by OLD FRUITCAKE (a lumpy old Christmas fruitcake nobody ever eats, wearing a crooked crown; bitter about being
forgotten). Now they've broken out and are taking over the house room by room, making everything stale and forgotten,
planning a "Feast of the Forgotten". Act 2 is called **Beyond the Kitchen**. Each world has a Leftovers lieutenant as boss:
- World 6 The Dining Room: **SIR STALE**, a pompous stale-baguette knight (crusty moustache, bread-roll helmet,
  butter-knife lance, bread-plate shield). Talks like an old-fashioned knight ("Have at thee!", "Forsooth!", "Unhand me,
  varlet!"), very proud of being "aged to perfection", hates being called stale ("I am VINTAGE!"). Funny, not scary.
- Later worlds (just tease, don't show): the Backyard BBQ (Baron Brussels, a hulking Brussels sprout), the Garden
  (the Mystery Meatloaf), the Supermarket (the Tupperwraith, a ghostly old food tub), and Old Fruitcake himself.

Each kaiju needs a small fresh reason to go on, growing out of its ending (for example Gobzilla now wants to be
"Gobzilla LARGE", Bluebeary's Crumblets want to see the world, Pizzaraptor gets a delivery order from "the Head of the
Table"...). Invent something fun and in character; keep its catchphrases and running gags going.

## The world: The Dining Room
A giant grand dining table: a tablecloth plain, candelabras like lighthouses (they drip HOT WAX: a hazard that splats you
and leaves sticky wax puddles), plates like islands, a chandelier, napkin hills, cutlery bridges. Monsters (the Leftovers'
servants): Fork Soldiers, Napkin Ghosts (fly), Candle Imps (throw fireballs), Gravy Boat Rammers (charge), Teapot Nannies
(heal other monsters), Roast Brutes (big), Crouton Squires (Sir Stale's tiny helpers).

Stages: 6-1 Tablecloth Trail (w6-open before it) · 6-2 Placemat Plains: a giant rolling pin chases you · 6-3 Candelabra
Crossing: arena room, a lever drops a rolling pin · 6-4 Gravy Boat Bay: escort a lost Crumblet to the exit · 6-5 Roast Ridge:
a Roast Brute elite (w6-elite before it) · 6-6 Teacup Terrace: grab the Recipe Scroll in time, then hold out · 6-7 Napkin
Fold Fort: arena, secret chest with the World 6 key on a high ledge (reach with a bouncy sponge) · 6-8 Silverware Siege:
survive 45 seconds · 6-9 Chandelier Climb: arena; Sir Stale's voice taunts · 6-10 The Head of the Table: SIR STALE.

## What to write for each kaiju (add to its existing files only)
In `src/story/arcs/k<sp>.ts` `ARC`:
- `"w6-open"`: 4-6 lines. The Act 2 opener: a narrator line like "Act 2: Beyond the Kitchen!" or "A few days later..." is
  fine, the kaiju finds out the Leftovers are loose (a note, a stale crumb trail, a Crouton Squire, a cameo friend) and gets
  its fresh reason to go. Can include `"lo"` (Old Fruitcake, a creepy-funny line from the shadows) at most once.
- `"w6-boss"`: 2-4 lines. Speaker `"boss"` is SIR STALE here.
- `"w6-after"`: 3-5 lines. Sir Stale is beaten (NOT cured, he's a villain): his lance snaps, he storms off out the window
  toward the Backyard vowing revenge and/or blabbing a hint ("Baron Brussels will grill you!"). Kaiju reacts and heads on.

In `ARC` or `NEMESIS` (whichever object already holds the kaiju's `w5-elite`, keep it there and add the key to its type):
- `"w6-elite"`: 2-3 lines. The kaiju's OLD NEMESIS (speaker `"foe"`) shows up as a grudging friend now, warning about the
  Roast Brute ahead or the Leftovers, in its own voice, maybe with a fun callback to their rivalry.

In `src/story/more/k<sp>.ts` `BEATS` (add a `// World 6: The Dining Room (Act 2).` comment):
- `"w6-s2"`, `"w6-s3"`, `"w6-s4"`, `"w6-s6"`, `"w6-s7"`, `"w6-s8"`, `"w6-s9"`: 1-3 lines each about that stage.
  Speakers: `"me"`, `"n"`, `"foe"`, `"lo2"` (Sir Stale's voice, use in a few), `"lo"` (Old Fruitcake, rarely), or a kaiju
  species number for a cameo (6-4 can be Bluebeary, 10, handing over a Crumblet like before). Table-manners, fancy-dinner,
  stale-bread, "crumby", "forgotten", "pass the..." puns.

## When done
Run `npx tsc --noEmit` and `npx vitest run tests/voice.test.ts tests/banter.test.ts`. The banter test only passes once every
kaiju is done; make sure no failures name YOUR kaiju. Don't edit tests or other kaiju's files. Don't commit.
