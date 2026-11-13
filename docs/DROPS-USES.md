# Monster drops: other uses (design options)

> **DECIDED 2026-11-14 by the Creative Director**
> 1. **Build:** A, the Monster Cookbook, and C, the Garnish gear slot. Not B (Cookpot) and not D-G for now.
> 2. **Power: none at all.** Nothing earned from drops may make a kaiju stronger in a fight. This overrides option C
>    as drafted in section 3 (its combat perks are gone) and removes the Golden Sugar Cube, Golden Grading Stone and
>    Safety Charm from the Cookbook's rewards (a Sugar Cube is +1 permanent stat, `consumables.ts:23`, `save.ts:335`).
> 3. **Drop stock:** costs stay small; warn before a spend would break a SKIP TO BOSS the player can make now; the 26
>    never-wanted kinds drop at about 35% (was 20%).
> 4. **Order:** the Cookbook ships first on its own, the Garnish second. Both start after the weakness system ships
>    (`camp.ts`, `GameScene.ts` and `hud.ts` are being edited for it now).
> 5. **Garnish perks: strict** (confirmed later the same day). A garnish is worn (looks) and gives Hunter's Nose, its
>    own monster's drop chance, and nothing else: no crumbs, XP, pickup reach or per-type perks, no coloured sparks or
>    quip (they were not free). The gold outline for a two-star card stays.
> 6. **Cookbook rewards: no boxes.** Crumbs, map stamps, card borders and titles only.
> 7. **Garnish look:** worn on the head, white outline, a per-icon size table; the fifth rig point on all 20 kaiju is
>    in scope.
>
> The build spec is the next section. Sections 1-7 below it are the original options, kept for the record; where they
> disagree with the build spec, the build spec wins.

# Build spec

## B1. The no-power rule (applies to both features)
**Drops never change a fight.** Nothing bought, earned or worn through drops may change damage dealt or taken, max HP,
healing, cooldowns, movement speed, status effects, ultimate gain, XP, or anything that gives gear (boxes, stones,
box tiers, rarity, boss weapons). Allowed, and this is the whole list: one-off crumbs from the Cookbook, a garnish
raising its own monster's drop chance, looks, map stamps, card borders, titles.

How an engineer tests it (`tests/garnish.test.ts`, `tests/cookbook.test.ts`):
1. `derive(profile)` is deep-equal with no garnish and with each of the garnishes, for all 20 kaiju.
2. `src/sim/stats.ts` does not import `garnish.ts` or `cookbook.ts` (a source check). `garnish.ts` exports one number,
   `GARNISH_LUCK`, and one function that answers "the drop chance for this kind given the worn kinds": there is no
   perk type to extend.
3. A fixed-seed, fixed-input stage run gives the same hero HP, hero position, monster HP, crumbs and XP at every step
   with no garnish, with a garnish whose monster is not in the stage, and with one whose monster is: only the floor
   pickups and the drop bag may differ. (Floor pickups share the id counter `nextId` with monsters, and patrols read
   the id, so give pickups their own counter first, or more drops will shift monster behaviour.)
4. Every Cookbook reward is typed as crumbs, a stamp, a border or a title. The reward type has no field for a box, an
   item or a consumable, so the compiler enforces it, and a test checks `save.boxes`, `save.items` and `save.bag` are
   unchanged by every hand-in.

## B2. Shared groundwork (ships with the Cookbook)
- **Home world of a drop:** new `src/sim/cookbook.ts` builds the pages from data, never by hand: for each world in
  `WORLDS`, the kinds in its `pool` plus its `mimic` that have an entry in `DROPS` and are not already on an earlier
  page. Today: 10 pages, 82 cards. **World 11:** when its `WorldDef` and 9 `DROPS` entries land, page 11 appears by
  itself (the Lunchbox Mimic stays on page 1); a test asserts every `DROPS` key is on exactly one page.
- **Never-wanted kinds at 35%:** `SPARE_DROP_CHANCE = 0.35` beside `DROP_CHANCE` (`drops.ts:53`). A kind is
  "never wanted" when no story stage's exit asks for it, computed once from `STAGES` (26 kinds today; the list follows
  stage generation by itself). Used in `World.killMob` (`world.ts:1891`) in place of `DROP_CHANCE` for those kinds.
  The random calls stay the same in number, so only the pickups change.
- **What a stage's exits want:** move the sum in `canSkip` (`camp.ts:360`) to a pure `stageWants(stage)` in sim, and
  add `skipsBrokenBy(drops, spend)`: the unlocked stages whose SKIP TO BOSS is affordable now and would not be after
  the spend. Every spend screen calls it and shows "This uses drops you could spend on SKIP TO BOSS for 4-6 and 4-7.
  Hand in anyway?" with HAND IN / KEEP. No warning when nothing breaks.

## B3. Feature 1: Monster Cookbook
**Rules.** Each card counts the drops handed in for that monster (never the bag count). Hand-ins happen at camp, one
tap for "hand in what I can use" on a card, or "hand in all spares" on a page (it keeps back what any affordable
skip needs, so it never triggers the warning).

| Card level | Drops handed in (wanted kinds / the 26 never-wanted) | Paid once, at the moment it is reached |
| --- | --- | --- |
| Discovered | 1 / 1 | 20 + 10 x world crumbs; the card turns over |
| One star | 5 / 3 | 60 + 30 x world crumbs |
| Two stars | 12 / 8 | 150 x world crumbs; the card gets a gold border |

| Page (a world) | Needs | Paid once |
| --- | --- | --- |
| One star | every card at one star | 500 x world crumbs; a chef-hat stamp on that world's map page |
| Two stars | every card at two stars | 1,000 x world crumbs; the stamp turns gold; a title named for the world ("Countertop Cook", "Fridge Cook", ... built from the world's name, so World 11 gets one by itself) |
| Whole book | every page at two stars | the title "Head Chef" and a gold cover on the Cookbook sub-tab |

"World" is the page number, 1 to 10. Titles are picked on the Cookbook screen (any earned one, or none) and shown
under the kaiju's name at camp and on the online name tag. No boxes, stones or items anywhere.

Totals today (`npx vite-node scripts/drops-pages.ts`), 82 cards on 10 pages:

| | Drops | Crumbs |
| --- | --- | --- |
| One star on every card | 358 | about 35,000 (cards 7,500 + pages 27,500) |
| The whole book | 880 | 170,190 |
| One page, two stars | 60 to 104 | 3,930 (World 1) to 27,820 (World 9) |

For scale: a page at two stars pays about what 5 to 9 clears of that world's stages pay in monster crumbs (estimated
at 55 kills a clear: about 440 in World 1, 2,500 in World 5, 4,800 in World 10), and it takes the spare drops of
roughly 20 clears. It is paid once, so it cannot be farmed. A story pass leaves about 400-450 spare drops, so one
star everywhere is within one pass and the whole book is about two. Hand-ins past two stars are refused (nothing is
wasted).

**A discovered card shows:** the monster's art (`mob-<kind>`), name, drop icon and name, home world and the stages
whose exits ask for it (or "no exit asks for this: 35% drop"), its weak-to and resists icons, how many you have beaten
(the account-wide `kill:<kind>` counter that already exists, `GameScene.ts:678`), your bag count, and the progress bar
to the next star. An undiscovered card is a grey silhouette with "???" and the drop icon if you hold one.
**Dependency on the weakness system:** read-only `weakOf` / `resistOf` and `ELEMENT_INFO` from `src/sim/elements.ts`.
That is two icons per card and no new rule, so it is included.

**Save (optional fields, `kkq-save-v3` unchanged).**
- `save.cookbook?: Record<string, number>`: drops handed in per kind.
- `save.cookbookPaid?: Record<string, number>`: per page id (`'1'`..`'11'`, `'all'`), the highest reward level paid,
  so a monster added to an old page later can never pay a page twice. Card rewards need no field: they are paid as the
  count crosses 1, 5 (3) and 12 (8).
- `save.title?: string`: the title shown (`'w3'`, `'all'`, or unset). Which titles are earned is read from
  `cookbookPaid`, so there is no second list; a title that is not earned is cleared on load.
- Loading (`load` / `repairItems`, `save.ts:81-105`): drop kinds that are not in `DROPS`, turn anything that is not a
  whole number 0 or more into 0, cap at the two-star number. Absent fields mean an empty book. `scripts/save-fuzz-gen.ts`
  gains odd books (unknown kinds, negative, huge, `null`, a string) and odd `save.drops`.

**UI (no new top-level tab).** The Bag tab already has sub-tabs Weapon / Armour / Charm / Items, and the Items one
ends with the plain "Monster drops" list (`camp.ts:355`). Add a fifth sub-tab, **📖 Cookbook**, and move the drops there:
the list becomes the cards. Layout on a phone: a row of world chips across the top (map icon, stars earned, a dot when
something can be handed in), then a grid of cards three across; tapping a card opens it full width with the HAND IN
button. The Bag tab badge counts cards that can advance. Two small links in: the Drops line on the stage card
(`camp.ts:76`) and the 🎒 in-stage bag stay as they are, and each drop chip on the stage card opens its card.
Put the screen in a new file `src/ui/cookbook.ts` so `camp.ts` only gains the sub-tab hook.

**Co-op and Free Play.** Nothing happens in a stage. Each player hands in from their own save at camp; guests already
bank the team's net gain (`snapshot.ts:150`). Daily Dungeon and bonus stages drop as today and are good hunting;
Endless Pantry and Boss Rush drop nothing and stay that way.

**Art: 0 new images.** Cards reuse `mob-<kind>` and `drop-<kind>`; stamps, stars and the book icon are emoji or CSS.

**Tests.** Pages built from data (82 cards, each drop once, mimic on page 1, a made-up eleventh world adds a page and a
title); thresholds and one-time payment; the crumb totals above (358 / 880 drops, 170,190 crumbs); a page cannot pay
twice after a card is added; hand-in never takes more than the card needs; "hand in all spares" leaves every
affordable skip affordable; `skipsBrokenBy` cases; the 26 kinds use 35% and the others do not; old saves and fuzzed
saves load; an unearned title is cleared; no hand-in changes boxes, items or the gear bag (rule B1.4). Shots: `scripts/cookbook-shot.mjs` (empty book, half
book, full page, the warning) at phone size, added to the visual baseline.

## B4. Feature 2: Garnish (a fourth gear slot with no combat power)
**What it is.** Candy a monster's drop and your kaiju wears it: the drop's own icon is drawn on the kaiju in every
stage, in camp and for friends online. It also makes that one monster drop its item more often. It is equipment you
choose for looks and for what you are hunting, never for strength.

**Rules.**
- **Making one:** on a monster's Cookbook card at one star or better, CANDY IT costs 10 of that drop from the bag (6
  for the 26 never-wanted kinds), with the skip warning. Made once, owned for good by the whole account.
- **Wearing:** each kaiju wears one or none; any number of kaiju can wear the same one. Changing is free, at camp only.
  No rarity, no grade, no fortify, no salvage, never in boxes or the Market.
- **The one perk, Hunter's Nose:** every garnish raises its own monster's drop chance by 15 points (`GARNISH_LUCK`):
  20% to 35%, the never-wanted 35% to 50%, and 55% to 70% while an exit still wants it. Nothing else: no crumbs, XP,
  pickup reach, per-type perks, coloured sparks or quips. The garnish has no dependency on `elements.ts`.
- **Gold ring:** every garnish is drawn with a white outline; one whose Cookbook card has two stars gets a gold outline
  in its place. That is the long chase.
- **Where it is applied:** only in the drop roll in `World.killMob` (`world.ts:1891`), from an optional list of the
  kinds worn by the human players, never through `Derived`. The CPU buddy's garnish is drawn but gives nothing.

**Save.** `save.garnishes?: string[]` (kinds made) and `HeroProfile.garnish?: string` (kind worn). Loading: unknown
kinds are removed from the list; a worn garnish that is not owned or not in `DROPS` is cleared; `newProfile` leaves it
unset. `kitOf` (`src/ui/online.ts:61`) builds the online profile field by field, so `garnish` must be added there or
friends will not see it. The fuzz generator gains odd values for both fields.

**UI.** Hero tab: a fourth slot under weapon / armour / charm (`data-eqslot="garnish"`, `camp.ts:276`) showing the
drop icon, the monster's name and "<monster> drops its item more often"; tapping it opens a picker of owned garnishes (a grid of drop icons,
"None" first, a gold ring on two-star ones). Cookbook card: the CANDY IT button, then "Worn by: ..." with a WEAR
button for the selected kaiju. Nothing new on the fight HUD.

**Drawing it on the kaiju: honest size of the rig work.**
- Gear is drawn by `HeroView` from a `GearLook` (`src/render/rig.ts:13-16,96-105`): weapon in the hand, armour on the
  chest or back, charm at the neck. Each rig has four hand-placed points, `gear: { hand, chest, neck, back, size }`
  (`src/render/rigs.ts:29`, one per kaiju). All four are in use, so a garnish needs **a fifth point, `top` (the top of
  the head), placed by eye for every kaiju: 20 coordinate pairs.**
- Code: one field on `GearLook`, one line in `lookOf` (`GameScene.ts:44`), one `add(...)` call in `rig.ts` (the helper
  already handles size, pivot, depth, sway and an outline). Small.
- The real work is checking: `node scripts/rig-shot.mjs <species>` for all 20 kaiju in idle, run, attack, dodge and
  facing both ways, then nudging points. Expect a few awkward ones (the fliers Tacowl and Toastbat, Salmonster, tall
  weapons crossing the head, back armour such as the pot lid). **Estimate: one day for one engineer, 0 new images.**
- **Decided look:** on the head, about 20 px on an 84 px kaiju (the charm is 13 px), always with a white outline (gold
  at two stars; the `add` helper's outline is the one fortified weapons use, `rig.ts:86-93`), and a per-icon table
  `GARNISH_FIT: Record<kind, { size?, angle?, lift? }>` in `rig.ts`, like `GRIP` for weapons, for the pale or thin drops
  (Soap Bubble, Flour Puff, Frost Wing, Salt Crystal and the like). Budget the table into the same day: start empty,
  add entries from the review sheet. A kaiju without a cut-out rig falls back to its plain sprite and shows no garnish.
- The review needs one more sheet: all 82 drop icons (91 with World 11) on one kaiju at game size, to fill the table.

**Co-op and Free Play.** Everyone sees everyone's garnish. The team shares one drop bag, so a kind worn by any human
player gets +15 points once (no stacking). Free Play: the look shows in all three modes; the perk only matters where
drops fall (Daily Dungeon, bonus stages).

**Art: 0 new images** (the slot's empty state is an emoji).

**Tests.** Checks 1-3 in B1; making costs the right number once and never twice, and only from a card at one star or
better; unknown and unowned garnishes are cleared on load; the drop chance for the worn kind is exactly 15 points
higher in each of the three cases (20, 35, 55) and unchanged for every other kind; two players wearing the same kind
add 15 once; a CPU buddy's garnish adds nothing; `kitOf` carries the field; `lookOf` returns the garnish icon and
the gold flag only at two stars; every `DROPS` key has art `drop-<kind>` (so a new world's garnishes cannot be
blank). Shots: `rig-shot` sheets for 20 kaiju, the 82-icon sheet, a Hero tab shot, an online shot with two garnishes.

## B5. Task split and order
No file is owned by two people in the same phase. Both phases start after the weakness system has merged.

| Phase | Gameplay engineer (sim, save, tests) | UI engineer (camp screens, drawing, shots) |
| --- | --- | --- |
| 1 Cookbook | new `src/sim/cookbook.ts` (pages, thresholds, rewards, `stageWants`, `skipsBrokenBy`, never-wanted list); `src/sim/drops.ts` (`SPARE_DROP_CHANCE`); `src/sim/world.ts` (one line in `killMob`, own id counter for pickups); `src/save.ts` (fields, repair, `handIn`, title); `scripts/save-fuzz-gen.ts`; `tests/cookbook.test.ts`, `tests/drops.test.ts` | new `src/ui/cookbook.ts`; `src/ui/camp.ts` (fifth Bag sub-tab, remove the old drops list, `canSkip` calls `stageWants`, stage-card chips link to cards, map stamps, title line and picker); `src/ui/style.ts`; `src/ui/online.ts` (title on the name tag); `scripts/cookbook-shot.mjs`; visual baseline |
| 2 Garnish | new `src/sim/garnish.ts` (`GARNISH_LUCK` and the drop-chance function); `src/sim/stats.ts` (`HeroProfile.garnish` only, `derive` untouched); `src/sim/world.ts` (the drop roll reads an optional list of worn kinds); `src/save.ts` (fields, repair, `candy`, `wear`); `scripts/save-fuzz-gen.ts`; `tests/garnish.test.ts` | `src/render/rig.ts` (draw, white / gold outline, `GARNISH_FIT`), `src/render/rigs.ts` (the `top` point x 20); `src/scenes/GameScene.ts` (`lookOf`, pass worn kinds to `World`); `src/ui/camp.ts` (fourth slot, picker); `src/ui/cookbook.ts` (CANDY IT, WEAR); `src/ui/online.ts` (`kitOf`); rig and camp shots |

Order inside a phase: gameplay lands the sim file and save functions with tests first; UI builds against them the same
day. After phase 1: `npm test`, build, `save-fuzz`, `qa-online`, and a short sweep of a few stages, because 35% drops
put more pickups on the floor. Phase 2 needs no balance sweep if test B1.3 passes. README: one paragraph per feature,
written by whoever lands last in each phase.

## B6. Confirmed on 2026-11-14 (nothing left open)
1. Garnish perks: strict. Looks plus Hunter's Nose only (decision 5).
2. Cookbook rewards: crumbs, stamps, borders and titles; no boxes (decision 6).
3. Garnish look: on the head, white outline, per-icon size table, fifth rig point on all 20 kaiju (decision 7).

One number to watch after phase 1, not a decision: the crumb amounts in B3 are a first guess on the scale of stage
clears. If playtests show players rushing pages for crumbs, halve the page rewards; the save does not change.

---

# Original options (for the record)

Status when written: options for the Creative Director to pick from. No code, nothing built. Written 2026-11-14.
Numbers come from `npx vite-node scripts/drops-probe.ts static` (stage data) and
`RUNS=4 npx vite-node scripts/drops-probe.ts 1-2 2-6 4-4 6-7 8-8 10-3` (skilled bot, empty bag, 24 runs, 20 clears).

## 1. Drops today, and what is unused
82 ordinary monsters each have their own drop and icon (`src/sim/drops.ts:7-49`; World 11's 9 icons are already in
`public/art`). The 127 other kinds drop nothing: 10 world bosses, 50 minibosses, 30 Kings, 10 champions, 20 nemeses,
7 summons. A monster drops its item 20% of the time, or 55% with a no-three-misses pity while its map's exit still
wants it (`drops.ts:53`, `world.ts:1889-1893`). Each map exit takes 3 each of 2-3 monsters (`stages.ts:391-397`,
`world.ts:1283-1295`); the rest go home in `save.drops` (`save.ts:44`), also on pause-ESCAPE and on a fail
(`GameScene.ts:431-439,837`). Guests bank the team's net gain (`snapshot.ts:150`). The only other use is SKIP TO BOSS:
hold a stage's whole set and pay it at the stage panel (`camp.ts:210,360`, `GameScene.ts:249`).

What the probe found:
- **The spare stock is thin.** Exits eat 12-27 drops per stage (average 18.9; 1,893 across the 100 story stages). A
  clear leaves 1.3 spare in World 1 and **3.3 to 5.8 from World 2 on, about 1 each of 3-4 kinds**. Two of 24 runs
  left 11-12 (a long fight). The bot leaves as soon as the exits are ready, so treat this as a floor: about
  **400-450 spare drops per full story pass**, around 5 per monster kind.
- **26 of the 82 drops are never asked for by any exit** (shooters, healers, summoners, turrets, burrowers, the two
  mimics: Sugar Cube, Pepper Seed, Garlic Clove, Frozen Pea, Carrot Top, Jelly Wobble, Hot Sauce Drop, Kettle Whistle,
  Toasty Marshmallow, Dry Noodle, Raisin, Mug Handle, Drain Eel Fin, Candle Wax, Tea Leaf, Ketchup Cap, Charcoal
  Chunk, Corn Kernel, Pea Pod, Potato Peel, Tomato Slice, Barcode Sticker, Can Lid, Ducky Squeaker, Lunchbox Latch,
  Cereal Prize). They trickle in at about 0.9 per clear and do nothing at all.
- **SKIP TO BOSS rarely comes up by itself**: it wants 3-9 of each of 4-7 kinds, and a clear leaves about 1 spare per
  wanted kind, so a skip takes three or more replays of that stage or deliberate hunting.
- **Deliberate hunting is quick for wanted kinds, slow for the 26.** Monsters respawn while you stay in a map and the
  55% rate holds until you walk through the exit, so staying a minute yields roughly 4-6 extra wanted drops. An
  unwanted kind is 20% and spawns less often: about 1 a minute.
- Drops fall in story stages, bonus stages and the Daily Dungeon (all `genMaps`). Endless Pantry and Boss Rush drop none.

## 2. The economy a new use sits in
- **Crumbs** come from every kill (`mobs.ts:510`), boxes, salvage, quests and challenges. Sinks: fortify (the big
  one, `items.ts:422`), Market gear (`save.ts:424`), boxes at 120 / 380, Re-season (`elementTune.ts:23`). Consumable
  prices are flat (Jam Jar 25, Second Helping 250, `consumables.ts:16-29`), so late on they are pocket change.
  A drop recipe that makes a jam is worthless: **dishes must do something the Market cannot sell.**
- **Already a collection or a chase** (do not duplicate): 200 boss weapons with pity, 40 signature legendaries, world
  sets, grades D-S, fortify to +15, achievements and daily quests (`quests.ts:15-44`), 8 quests per kaiju
  (`kaijuQuests.ts`), 3 challenge stars per stage, World Keys, Free Play bests.
- **Gaps:** nothing records the monsters you have met (kill counters exist per kind, `GameScene.ts:678`, but no screen
  shows them); gear is pure gacha with no way to aim for a slot except the 3 daily Market pieces; no quick-bag item
  touches the new elements; nothing rewards hunting one particular monster after its recruit quest is done.

## 3. Options
Costs below are sized to the stock above: single recipes cost 3-6 drops, never 20.

### A. Monster Cookbook (collectible)
- **Experience:** a camp page per world with a card for every monster. Hand in its drop to fill the card: the first
  one reveals art, name, weakness and its taunt; more earn stars. Finishing a world's page pays out once.
- **Rules:** 1 drop = discovered, 5 = one star, 12 = two stars (the 26 unwanted kinds: 1 / 3 / 8). A world page at one
  star everywhere: a Golden Cloche and a Golden Grading Stone. At two stars: a Safety Charm and a chef-hat stamp on
  the world map. All ten pages at two stars: one Golden Sugar Cube (today one comes with each world boss first clear, `save.ts:281`).
  One star everywhere: about 360 drops (under one story pass of spare stock). Whole book: about 880 (two passes, or
  less with targeted hunting).
- **Why here:** every one of the 82 drops gets its own purpose, the 26 dead ones most of all. It is a recipe book in a
  kitchen game, and it tells you where each monster lives, which every other option needs.
- **Reuses / needs:** mob art and drop icons exist: **0 new images** (stamps can be emoji). One new screen (a sub-tab
  under Quests or Bag). Save: one optional field `cookbook?: Record<kind, number>`; old saves load unchanged.
- **Effort S-M. Risk low:** rewards are existing items; the one stat point is 1 on top of 10.
- **Interactions:** hand-ins are voluntary and happen at camp on each player's own save, so co-op needs nothing.
  SKIP: the hand-in button warns when it would break a skip you can afford now. Daily Dungeon becomes a good place to
  hunt. Weakness: `WEAKNESS-DESIGN.md` section 7 said "no bestiary" for that feature's scope; this would be one, so
  the weak-to icon simply appears on each discovered card. World 11's 9 monsters become an eleventh page for free.

### B. Camp Cookpot (items)
- **Experience:** a pot at camp. Each world has one or two recipes naming three of its monsters' drops; cooking gives a
  quick-bag dish with an effect themed to those monsters that crumbs cannot buy.
- **Rules:** a recipe costs 2 + 2 + 2 of three named drops and makes one dish; carry at most 3 of a dish. Examples:
  *Pepper Pot* (Pepper Seed, Hot Sauce Drop, Charcoal Chunk): your hits set monsters burning for 20 s.
  *Frost Float* (Frozen Pea, Frost Wing, Popsicle Stick): hits chill, and freeze on the third hit, for 20 s.
  *Sticky Bun* (Jam Glob, Gravy Drop, Jelly Wobble): hits glue for 20 s. *Crackling Crunch* (Roast Crackling, Cracker
  Shard, Plate Shard): Guard Break hits 50% harder for 20 s. *Picnic Basket* (Tea Leaf, Lettuce Leaf, Corn
  Kernel): the whole party heals 25%. *Lucky Leftovers* (Cereal Prize, Lunchbox Latch, Coupon Scrap): the next boss box
  is one tier better.
- **Why here:** turning monsters into dishes is the game's own joke, and the four element dishes give the three kaiju
  with no elemental skill (Dumplord, Chocomunch, Salmonster) a way into the weakness system.
- **Reuses / needs:** consumables and the quick bag exist (`consumables.ts`, `world.ts:1658-1666`); "hits carry an
  effect" is new sim code. **1 image per dish** (6 to start, about 12 for all worlds). One recipe list in the Market or
  Bag. Save: new consumable ids only (unknown quick-bag ids are already cleaned on load, `save.ts:91`).
- **Effort M. Risk medium:** element dishes make every hit a WEAK hit for 20 s, which the weakness note deliberately
  avoided (plain hits are never weak). They need the same sweep as that system, a carry cap, and a boss-room check.
- **Interactions:** six drops per dish from kinds exits also want, so it competes with SKIP directly; recipes should
  lean on the 26 unwanted kinds. Co-op: each player brings their own dishes (quick bags are already per player).

### C. Garnish (new equipment slot)
- **Experience:** candy ten of one monster's drop into a Garnish and wear it in a fourth slot. The monster decides the
  perk, so you hunt the monster whose garnish suits your kaiju.
- **Rules:** 10 drops = that monster's garnish, kept forever, one worn at a time, no rarity, no fortify. Perks come from
  about twelve templates by monster kind, all small and conditional: a charger's gives +6% damage while dashing, a
  healer's +10% healing received, a bomber's a small burst on perfect dodge, a burrower's +15% crumbs, a mimic's +5%
  box luck; any garnish also gives -5% damage taken from that monster's own type.
- **Why here:** per-monster identity at its strongest, and 20 kaiju times 82 garnishes is a lot of build talk.
- **Reuses / needs:** the drop icon is the garnish icon: **0-1 new images**. New: a slot on the Hero tab, a perk table,
  `derive` changes, the online kit. Save: optional `garnish` per hero and an owned list.
- **Effort L. Risk medium-high:** permanent power, 82 perks to balance, and every sweep reruns.
- **Interactions:** 10 of a wanted kind is three exits' worth, so it drains SKIP stock hardest. Type-based protection
  fits the weakness system neatly. Works in co-op and Free Play like any gear.

### D. Made to Order (aim the gacha)
- **Experience:** at the Market, pay drops from one world and crumbs to order a box for a kaiju and slot you choose.
- **Rules:** 3 each of any four drops from one world, plus a Bento's 380 crumbs, gives a Bento whose item is that slot
  for that kaiju, at the Market's item level. Once a day. Never boss weapons or signature legendaries.
- **Why here:** 20 kaiju share one loot pool, so kitting out a newly recruited one is slow today.
- **Reuses / needs:** `rollItem` already takes a preferred kaiju (`save.ts:246`); a slot filter is small. **0 images**,
  one Market row, no save change. **Effort S. Risk low** (same item pool; watch that old-world drops do not make it
  too cheap). Generic, though: any four drops of a world do, so no single monster matters.

### E. Chef's Orders (turn-ins)
- **Experience:** a board with three orders a day, such as "8 Tea Leaf" or "5 Fork Prong and 5 Napkin Scrap", from
  worlds you have cleared. Deliver for crumbs, stones or a box.
- **Rules:** rewards on the daily-quest scale (150 crumbs and a Bento, or 3 Fortify Stones); all three in a day adds a
  Grading Stone. Orders lean toward the 26 unwanted kinds.
- **Why here:** gives "today I hunt teapots" a reason; fits the Quests tab as it is.
- **Reuses / needs:** daily quest code and UI. **0 images**, no new screen, one optional save field.
  **Effort S. Risk low.** It is a rotating currency sink more than an identity for each drop, and a daily chore.

### F. Season with drops (weakness tie-in)
- **Experience:** Re-season a weapon by paying in drops of monsters that carry the flavour, instead of crumbs.
- **Rules:** 6 drops from Fiery monsters set HOT, 6 from Melty set COLD, 6 from Slippery set STICKY (Crusty drops give
  30% off any re-season). The crumb price stays as the other way to pay.
- **Reuses / needs:** the monster type table and `reseason` exist (`save.ts:476`). **0 images**, one button.
  **Effort S. Risk low** (no new power, only a second price). Small in scope; best as an add-on to A.

### G. Favourite Snacks (feed your kaiju)
- **Experience:** each kaiju already has a favourite foe (`kaijuQuests.ts` `FLAVOUR`). Feed it drops at camp for a
  "Well Fed" mood that lasts the next three stages.
- **Rules:** any 5 drops: +10% XP and crumbs for 3 stages. 5 of its favourite monster's drop: +20%, and a special line
  in its own voice. No combat stats.
- **Reuses / needs:** portraits and moods exist. **0 images**, a button on the Hero tab, one optional field per hero,
  20-40 short lines. **Effort S. Risk low.** Only 20 of 82 drops become special.

## 4. Comparison
| Option | Fun | Effort | Risk | New images | New UI | Every drop distinct? |
| --- | --- | --- | --- | --- | --- | --- |
| A Monster Cookbook | high | S-M | low | 0 | 1 screen | yes, all 82 |
| B Camp Cookpot | high | M | medium | 6 to 12 | 1 list | about 18 to 36 |
| C Garnish slot | high | L | medium-high | 0-1 | slot + picker | yes, all 82 |
| D Made to Order | medium | S | low | 0 | 1 Market row | no (by world) |
| E Chef's Orders | medium | S | low | 0 | none (Quests tab) | by rotation |
| F Season with drops | low-medium | S | low | 0 | 1 button | no (by type) |
| G Favourite Snacks | medium | S | low | 0 | 1 button | 20 of 82 |

## 5. Recommendation
**Build A (Monster Cookbook) first, then B (Camp Cookpot) on top of it.**
- A is the only cheap option that gives all 82 drops, and the 26 dead ones, a purpose of their own. It costs no art,
  adds no power, puts no wall in the story, and World 11 slots in for free. Its size (360 / 880) matches what players
  really bank. **Small first version:** discovered and one star only, one reward per world page, no map stamps.
- B is the most "Kaiju Kitchen" idea and the one players will talk about, but it is where the balance risk is, so it
  should follow the weakness sweeps. Tie it to A: a world's recipe unlocks when its page reaches one star.
  **Small first version:** three dishes with no element (Picnic Basket, Lucky Leftovers, Crackling Crunch), 3 images.
  The three element dishes come after a sweep.
- F is a nearly free extra if wanted with A. C is the best long-term "new equipment" answer but is a full balance
  project; hold it until Act 3 is under way. D is the low-risk equipment answer if one is wanted sooner.
- With any option, consider one small knob: raise the drop rate of the 26 unwanted kinds from 20% to about 35%
  (a constant next to `DROP_CHANCE`), so hunting them takes a minute or two, not five.

## 6. What not to do
- Do not make drops gate story progress beyond today's exits, and do not raise exit wants to "make drops matter".
- Do not price anything in tens of drops: a clear leaves about five. Costs of 3-6 keep SKIP TO BOSS alive.
- No permanent combat stats bigger than a few percent, and nothing that stacks without a cap (the tough target needs
  jams to matter). No real-money or timer-skip hooks.
- Do not rename or redraw existing drops, monsters or cast; do not bump the save key (`kkq-save-v3`): new optional
  fields only. Do not reorder the snapshot tables (append-only).
- Do not give bosses, Kings, minibosses or nemeses drops just to fill a book: that is 120 more icons.
- Do not put a new button on the fight HUD; every use lives at camp.

## 7. Questions for the Creative Director
1. **Which to build first?** (a) Cookbook, then Cookpot; (b) Cookpot first; (c) Garnish slot; (d) one of the small
   ones (D, E, G). **Recommended: (a).**
2. **Should drop rewards ever give power?** (a) no power, only existing rewards and convenience; (b) timed power only
   (dishes), no permanent stats; (c) permanent but small and conditional (Garnish). **Recommended: (b)**, with the
   Cookbook's single Golden Sugar Cube as the one exception.
3. **SKIP TO BOSS and the new uses share one stock. How to keep both?** (a) keep costs small and warn before a spend
   breaks a skip; (b) also raise the unwanted kinds' drop rate to 35%; (c) raise all spare drop rates.
   **Recommended: (a) and (b)**: (c) would make skips common and shorten stages.
