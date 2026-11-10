# World 10 story brief: THE FINALE of Act 2 (for writers)

Read `docs/VOICE.md` and follow it strictly (tests: `tests/voice.test.ts`, `tests/banter.test.ts`: no em dashes or
semicolons, no stiff words, at most two "..." per scene, short-scene lines max 130 chars, 1-3 lines per short scene).
Read your kaiju's `src/story/arcs/k<sp>.ts` and `src/story/more/k<sp>.ts` end to end. This is the FINALE: pay off its
whole Act 2 (Worlds 6-9) goal and running gags, and give a warm callback to its Act 1 journey. World 9 ended with the
Tupperwraith fleeing home to OLD FRUITCAKE for the Feast of the Forgotten.

## The world: The Feast of the Forgotten
The forgotten back of the giant Fridge, turned into the Leftovers' gloomy kingdom: frosty wire shelves like castle walls,
old jars and takeaway boxes like towers, faded paper-chain party decorations, freezer blasts, and at the end a long, dusty,
EMPTY banquet table and a throne of stacked cake tins. Old Fruitcake's whole army gathers here (Fork Soldiers, Kebab
Beetles, Lettuce Snails, Barcode Snipers from the earlier worlds) plus Candied Cherry Soldiers, Candied Peel Bats and
Fruitcake Knights (big). Sir Stale, Baron Brussels, the Mystery Meatloaf and the Tupperwraith are all here, beaten and a
bit sulky; they can grumble from the sidelines (`lo2` is Sir Stale; the others narrator-quoted).

Final boss: **OLD FRUITCAKE**, King of the Leftovers: a lumpy old Christmas fruitcake with candied cherries, a crooked
cake-tin crown, a cling-wrap cloak and a candy-cane sceptre. Grumpy, grand, bitter: every year he's given as a present,
never eaten, re-gifted and pushed to the back of the fridge ("Nobody ever CUTS me!"). He grew the Mold Crown and stole
everything to throw the Feast of the Forgotten: if nobody wants the Leftovers, then NOBODY gets to have a feast. Speaker
in w10-boss / w10-after is `"boss"`; elsewhere he is `"lo"`.

THE TWIST (shared by everyone, the heart of the finale): beaten, Old Fruitcake admits he never wanted to ruin feasts, he
just wanted to be INVITED to one. The kaiju (in its own way) invites him and all the Leftovers to a real feast. He smiles
for the first time. Many stories already seeded this (Bloblin and Dumplord want to invite them, Hotchog's "feast-off",
Velvaroo's title fight, Mothball's nightlight...): pay it off in your kaiju's voice.

Stages: 10-1 The Cold Door (w10-open before it) · 10-2 Jam Jar Junction: a giant rolling pin chases you · 10-3 Takeaway
Towers: arena · 10-4 Frost Drawer Falls: escort a lost Crumblet (the last one!) to the exit · 10-5 Knight of the
Fruitcake: a Fruitcake Knight elite (w10-elite before it) · 10-6 Paper Chain Pass: grab the Recipe Scroll in time, then
hold out · 10-7 The Forgotten Shelf: arena, secret chest with the final key on a high ledge · 10-8 The Last Stand:
survive 45 seconds · 10-9 The Long Table: arena, Old Fruitcake's voice · 10-10 The Feast of the Forgotten: OLD FRUITCAKE.

## What to write for each kaiju (add to its existing files only)
`src/story/arcs/k<sp>.ts` `ARC`:
- `"w10-open"` (2-4 lines): arriving at the back of the Fridge for the final fight.
- `"w10-boss"` (3-5 lines): Old Fruitcake (`"boss"`) confronts the kaiju personally (he knows its goal and taunts it);
  the kaiju answers with its catchphrase energy.
- `"w10-after"` (6-9 lines): THE ENDING. Structure: first the `"boss"` lines (beaten, crown in his hands, the admission
  that he just wanted an invite; ALL his lines must come before any `"me"` line, since the painting switches to the big
  happy feast after his last line); then the kaiju resolves its Act 2 goal and invites him (in its own way), ending on a
  big warm funny line in character. The shared closing painting shows a big happy feast with Old Fruitcake and his gang.
  No "To be continued" (a shared post-credits teaser follows).
In the object that holds its `w9-elite` (keep it there, add the key to its type): `"w10-elite"` (2-3 lines: the old
nemesis `"foe"` shows up as a friend for the final push, maybe even promising to come to the feast).
`src/story/more/k<sp>.ts` `BEATS` (comment `// World 10: The Feast of the Forgotten.`): `"w10-s2"`, `"w10-s3"`,
`"w10-s4"`, `"w10-s6"`, `"w10-s7"`, `"w10-s8"`, `"w10-s9"` (1-3 lines; speakers `"me"`, `"n"`, `"foe"`, `"lo"`, `"lo2"`, or
a species number for cameos: this is the finale, so bring friends in! Bluebeary 10 on 10-4 with the LAST Crumblet).
Feast, party, "best before", "leftover", "re-gift", "slice", "stale", "cold", "invitation", "seconds" puns.

## When done
Run `npx tsc --noEmit` and `npx vitest run tests/voice.test.ts tests/banter.test.ts`. Banter only fully passes once every
writer is done (it stops at the first failing kaiju, so check yours with a temporary test, then DELETE it; give it a
unique name like tests/tmp-w10-<your kaiju numbers>.test.ts). Make sure no failure names YOUR kaiju. Don't edit tests or
other kaiju's files. Don't commit.
