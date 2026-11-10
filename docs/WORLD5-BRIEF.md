# World 5 story brief (for writers)

World 5, **The Sink**, is the Act 1 finale. Read `docs/VOICE.md` first and follow it strictly (tests in
`tests/voice.test.ts` and `tests/banter.test.ts` enforce it: no em dashes or semicolons, no stiff words, at most two "..."
per scene, short-scene lines max 130 chars). Read the kaiju's existing `src/story/arcs/k<sp>.ts` and `src/story/more/k<sp>.ts`
end to end first so the voice, running gags, nemesis and personal goal carry straight on from World 4 (the World 4 ending
is a cliffhanger: the Chef's note says come to the Sink, and the Mold Crown taunts).

## The world
A giant stainless-steel kitchen sink: soapy water lakes, mountains of dirty dishes, a huge chrome faucet arching overhead,
dripping taps that pour waterfalls (a new hazard: stand under one when it pours and you get blasted), soap bubbles, the drain
at the bottom glowing green. The Mold Crown lives down the drain. The Head Chef is down there too (trapped, NOT shown on
screen, never gets lines; mention them through notes, the hat, the narrator).

New monsters: Crusty Plate Knight (shield), Soap Bubble Sprite (flies), Grabby Glove (charges), Drain Eel (pops out of the
plughole), Mouldy Mug (spits cold coffee), Scrub Brute (big steel-wool brute), Sporelings (tiny mould puffs the boss summons).

Stages (same set-piece pattern as earlier worlds):
- 5-1 Faucet Falls (w5-open plays before it)
- 5-2 Suds Slide: a giant rolling pin chases you (run right!)
- 5-3 Sponge Shoals: arena room (gates lock, 3 waves), a lever drops a rolling pin on monsters
- 5-4 Dish Rack Ridge: escort a lost Crumblet (muffin baby) to the exit
- 5-5 Steel Wool Wall: the kaiju's NEMESIS final showdown (w5-elite plays before it)
- 5-6 Bubble Bay: grab the Recipe Scroll at the far end within 75s, then hold out; conveyor belts
- 5-7 Plughole Pass: arena room; a secret chest on a high ledge (reach it with a bouncy sponge) holds the World 5 key
- 5-8 Greasy Pan Pits: survive 45 seconds of waves
- 5-9 Drain Descent: arena; going down toward the drain, the Mold Crown's voice gets closer
- 5-10 The Mold Throne: the final boss, THE MOLD CROWN (w5-boss before it, w5-after after it)

## What to write for each kaiju (add to its existing files, keep everything else unchanged)
In `src/story/arcs/k<sp>.ts`:
- `ARC["w5-open"]`: 1-3 lines arriving at the Sink.
- `ARC["w5-boss"]`: 2-4 lines. Speaker `"boss"` is THE MOLD CROWN now (creepy, giggly, oozy, "Hehehe...", taunts this kaiju
  personally using what it knows of its fears/goal). The kaiju answers with its catchphrase energy.
- `ARC["w5-after"]`: the ENDING, 6-9 lines. Order: (1) the Mold Crown, beaten, shrinks into a tiny squeaky puff (speaker
  `"boss"`) and blurts out that it was only a "little science project" that SOMEONE grew in the forgotten back of the fridge,
  then gets slurped down the drain (keep it a funny tease, don't name who). (2) The Head Chef is safe (narrator line or a
  note). (3) The kaiju's own personal goal is resolved, matching this ending painting: ENDING_SCENE (below). End on a big warm
  funny line in character. No "To be continued" (a shared post-credits scene follows).
- `NEMESIS["w5-elite"]`: 2-4 lines, the final showdown with the kaiju's nemesis (speaker `"foe"`), who has grown since World 4
  and is a bit desperate. Make it a fun last clash; the nemesis can hint they might not be a total villain after this
  ("...Fine. Maybe I'll stop. MAYBE!"). Also update the type of `NEMESIS` to include `"w5-elite"`.

In `src/story/more/k<sp>.ts`, add to `BEATS` (with a `// World 5: The Sink.` comment like the other worlds):
- `"w5-s2"`, `"w5-s3"`, `"w5-s4"`, `"w5-s6"`, `"w5-s7"`, `"w5-s8"`, `"w5-s9"`: 1-3 lines each, about the stage above,
  speakers only `"me"`, `"n"`, `"foe"`, `"mold"` or a kaiju species number for a cameo (5-4 can feature Bluebeary, 10,
  asking you to walk his Crumblet, like the earlier escort stages; 5-9 should have the Mold's voice).
  Puns about water, soap, scrubbing, dishes, drains, bubbles, "clean up", "wash up", "go down the drain".

## Ending scenes (the painting shown behind the kaiju's resolution lines)
- 0 Gobzilla Jr.: stands proudly on the rim of a sparkling clean sink at sunrise, its tiny shadow cast huge on the wall like a giant monster, tiny friends cheering.
- 10 Bluebeary: back home in its muffin tin, six tiny Crumblet babies asleep in paper cups around it, gruff but secretly happy.
- 11 Pizzaraptor: sets its steaming delivery box down on a little table set for one, the Chef's white hat on the chair, a jar of crumbs as a big tip, takes a bow.
- 4 Mothball: flutters outside the window beside a big round full moon glowing bright again.
- 1 Squidgeon: in its lab raising an empty antidote bottle in triumph, the mould sample gone.
- 2 Crabbage: its cabbage garden green and growing again, little kitchen creatures watering it, Crabbage pretending to be grumpy.
- 5 Toastbat: hanging upside down in the moonlight next to an open butter dish glowing golden, a satisfied grin.
- 6 Dumplord: on its bowl throne, dough crown crooked, a crowd of tiny kitchen creatures finally cheering for it.
- 7 Norigon: on its bamboo mat at dawn, a bright strong green Wasabi Flame burning steadily.
- 8 Chocomunch: in front of the warm oven glow, not melting at all, holding up a note from the Chef.
- 15 Hotchog: wearing a champion's sash at a big cosy cookout party around a glowing grill.
- 17 Pengwhip: sliding joyfully across a sparkling clean sink full of bubbles at sunrise.

## When done
Run `npx vitest run tests/voice.test.ts tests/banter.test.ts` and `npx tsc --noEmit`. The banter test checks every kaiju
for World 5 scenes, so it only passes once ALL kaiju are done; make sure YOUR kaiju have no failures listed. Do not edit
tests, other kaiju's files, or anything outside `src/story/arcs/k<sp>.ts` and `src/story/more/k<sp>.ts`. Do not commit.
