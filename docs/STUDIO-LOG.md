# Studio log

Running record: date, request, decisions, commits, open items. Newest entry at the bottom.

## 2026-11-13: studio set up, status review

**Request:** Producer reads README, docs/ and the last 20 commits, then reports studio status and
proposes a ranked backlog of 5 features.

**State at HEAD 48e8fe9 (working tree clean, deploy green):**
- npm test: 36 files, 258 tests, all pass.
- Latest full sweep (shots/sweep-fix2.txt, 2026-11-12, skilled bot, 8 jams, 12 runs per stage):
  no bot timeouts. Stages under 70%: 1-1 67%, 4-3 42%, 4-4 67%, 5-4 67%, 9-8 67%, 10-1 67%,
  10-5 67%, 10-6 58%. Several world bosses clear 100% (1-10, 8-10, 10-10), above the 50-80% target.
- `node scripts/sweep-sum.mjs` with no argument reads the OLD shots/sweep-all.txt (11 Nov, before the
  bot fixes) and so shows stale lows (7-4 38%, 10-2 25%). Always pass the file:
  `node scripts/sweep-sum.mjs shots/sweep-fix2.txt`. Per world on the current sweep: stages 77-99%,
  world bosses 83-100% (all above the old 50-80% boss target; W2/W3/W6 stages at 95-99% are soft).
- The sweep is only 3 kaiju (Gobzilla, Bluebeary, Pizzaraptor) x 4 runs, so one run = 8 points.
  No all-20-kaiju sweep exists since the compact-map redesign.
- Hard / Nightmare sweeps on file date from 11 Nov, before compact maps and the bot fixes.

**Open items carried over:**
- "Skill tree not working for Bluebeary" (reported 2026-11-12): not reproduced, details needed.
- Elemental weaknesses idea: proposed 2026-11-11, never agreed.
- Human stage time never measured (bot: 3-9 min).
- Kings use the base monster art at 2x with a text crown.
- README still documents systems the map stages removed (rolling pin chase, levers, cookers,
  camp hub); variant twists are not mentioned in scenes. (Correction, same day: 'boom' quips are
  NOT dead. Bonus stages S-1..S-10 each have one pressure cooker, so they still fire there.)
- Hard / Nightmare, Free Play and online co-op have no recorded re-check since the map-stage redesign.
- Act 2 ends on a tease for the Great Food Festival (no Act 3 yet).

**Decisions:** none yet. Backlog of 5 proposed to the Creative Director; waiting for a pick.

**Commits:** none (this log file is uncommitted; it goes in with the next change).

## 2026-11-13: balance pass + post-redesign health check (backlog items 1 and 2)

**Request:** Creative Director picked 1 (boss teeth and soft spots) and 2 (health check of Hard,
Nightmare, Free Play, online co-op; README clean-up). Bluebeary skill-tree report parked.
Decision during the work: keep the co-op sideways leash as it is.

**Team:** balance designer (2 phases), QA lead, cleanup writer, 2 gameplay engineers.

**Shipped**
- World bosses: about 1.5x health and 1.2x attack, nudged per boss. Normal, skilled bot, 8 jams,
  20 kaiju, n=200 per boss: 57-80% clears (were 90-100%), 5.2-6.5 jams.
- Ordinary stages (n=60 each): world averages 89-95%, 3.4-4.0 jams, bot 4-6 min; lowest 4-8 78%;
  1-1 100% with about 2.4 jams (was 82% / 4.8). mobPow W1 .6, W2 1.5, W3 1.12, W4 1.0, W5 .82, W6 1.08.
  Room foes retuned one by one (see mobs.ts diff).
- Kaiju evened on bosses: per-kaiju boss clears 58-85% (were 42-90%). kaijuTune.ts rewritten by the
  tuner (old values: shots/kaijuTune-before-pass2.ts.txt). kaiju-bench now uses the skilled bot,
  8 jams, 15 min cap, boss target .67, and gives slow kaiju damage (Minturtle 23 timeouts -> 1).
- Bot: five stuck fixes (ladders part-way, ledge-to-ledge jumps, target stickiness, drops on ledges).
  4-3's "42%" was the bot stuck under the boss room's top ledge, not difficulty.
- Bugs fixed (found by QA or on the way), each with tests (283 tests now):
  boss rooms had a top ledge five kaiju could not reach (softlock: ladder added to every boss room);
  a room foe could be shoved through the wall and the room cleared with it alive (keepMobsInMaps);
  stage 6 scroll race vs one-way exits and SKIP TO BOSS; stage 8 hold-out spawned no waves;
  top-floor teammate teleport (vertical leash); a guest opening an exit; objective/chest boxes went
  to the host only; guest HUD lacked team drops, open exits and the boss bar; guests kept no drops;
  boss tip covered the boss bar; doubled Free Play titles; scroll timer shown before the race.
- Nightmare raised (NIGHTMARE 1.3/1.45, NIGHTMARE_BOSS 1.3/1.4): it had been easier than Hard.
  Boss Rush RUSH_POWER .8 -> .66 after the boss buffs. free-balance.ts cap 5 -> 15 min.
- README rewritten by system (not by date); visual baseline updated to the redesigned stage panel.

**Gate (producer, on the final tree):** npm test 38 files / 283 pass; build passes; shot.mjs 2
"no page errors"; stage-facts regenerates identically; qa-online on PeerJS and on the MQTT backup
route and qa-free: "no problems flagged"; independent sweep (2 runs x 20 kaiju): 1-1 100%, 4-3 85%,
10-6 88%, 4-8 75%, 6-6 93%, 9-8 78%; bosses 1-10 73%, 5-10 55%, 8-10 78%, 10-10 68%.

**Open items**
- About 40 ordinary stages clear 97-100% (target tops out near 95%); a further mobPow step of
  about 8% in W1-W8 is the next move if wanted.
- Boss jam use 5.2-6.8 of 8 is above the 2-5 jam target; that is the cost of 57-80% clears.
- Hard bosses 43-70% (old target 30-50%): needs a boss-only Hard multiplier (new logic).
  Nightmare bosses 25-70%: W1 and Act 2 (W6, W8, W9) still easy; Act 2 takes only 30% of the
  Nightmare bump (a literal in spawnMob). Crabbage and Mothball are weak on Hard/Nightmare bosses
  (20-40%). Hard/Nightmare STAGES were not re-swept after the final kaiju values.
- Toastbat, Salmonster, Tacowl sit at 84-85% boss clears (band was 55-80). Some kaiju multipliers
  moved a lot (Bluebeary HP .95 -> .66, damage .66 -> 1.01; Squidgeon, Norigon, Pengwhip): feel
  needs a human check.
- Minturtle is still the slowest kaiju (about 1.5x the median stage time).
- 7 bot timeouts in 6000 runs (mid-jump cases, not traced).
- Left as is: CPU buddy pressing UP at a ready exit opens it alone; leaving a stage-8 hold-out
  through a ready exit lets the waves follow.
- Dead code from the old generator (levers, chase, gates, dark sections, cages, short-layout
  branch of genStage), stale scripts (sections-shot, setpiece-shot, props-shot, tmp-*), missing
  scripts/smoke.mjs: tidy-up suggested, not done.
- Shared paintings still-w<N>-s2 / -s3 were made for the rolling-pin chase and the arena; not
  checked against the current scenes.
- Still open from before: Bluebeary skill-tree report (parked), human stage time, King art,
  elemental weaknesses, Act 3, music.
- Not tested: a real phone, 3-4 online players, a guest dropping mid-stage, guest pause-ESCAPE.

## 2026-11-13 (later): King art shipped; weaknesses and Act 3 decided

**Request:** "Move to 3, 4, 5" (King art, elemental weaknesses, Act 3).

**Decisions by the Creative Director**
- Weaknesses: per monster. Four elements HOT / COLD / STICKY / CRUNCH (Guard Break) in fixed
  weak/resist pairs; tag the 8 flavour skills; add Market "Re-season". Spec: docs/WEAKNESS-DESIGN.md.
- Act 3: classic worlds, FIVE worlds (11-15, Lv 111-160), villain Dame Fondant with judges Granny
  Crumble, Mr. Sample, Monsieur Zest; World 11 The Midway (boss The Great Flosso) built at FULL size
  (about 80 images, 220 scenes, no tier 6 gear); nemeses = friendly cameos + one exhibition bout in
  World 13. Outline: docs/ACT3-OUTLINE.md (approved).
- Order: weaknesses first, then World 11.

**Shipped:** 30 Kings have their own painted art (public/art/mob-k<kind>.webp, via Gemini with the
base monster attached as reference; scripts/kings-jobs.mjs). GameScene draws it 1.2x the hit box
with no emoji crown; falls back to the old look if the art is missing. 4 redone after review
(snail halo, fork crown, banana and can capes). Gate: 283 tests, build, shot.mjs, room shots.

**Open:** the BASE Lettuce Snail art (mob-snail) still has a pale sticker halo; King Teapot lost
its pout for a stern face (left as is); Kings are large on a phone (KING_ART_TALL 1.2).

## 2026-11-14: weaknesses in build; S-rank and drop-use investigations; World 11 art batch 1

**Requests:** "look into getting S for stages and if it's balanced"; "have one agent look into other
use cases for monster drops".

**Decisions by the Creative Director**
- Drops: build A Monster Cookbook and C Garnish gear slot (after weaknesses ship); rewards from
  drops give NO power at all (so Garnish is redesigned as cosmetic + non-combat perks); warn before
  a spend breaks a SKIP TO BOSS; raise the 26 never-wanted monsters' drop rate 20% -> about 35%.
  Options and spec: docs/DROPS-USES.md.
- World 11 art: keep the mould spots on the new monsters.

**State**
- Weakness sim side built (src/sim/elements.ts, elementTune.ts, 38 tests; 321 pass; neutral with
  multipliers at 1). UI engineer and balance designer running. Uncommitted.
- World 11 art batch 1 accepted: 9 monsters (kinds cadet, toffee, floss, snowcone, bumper, churro,
  coconut, pretzel, jawbreaker), boss-flosso, mob-m11a..e, 3 Kings, 9 drop icons, backdrops
  bg-far-midway, bg-mid-midway, tile-midway, bg-far-bigtop, map-midway. Sheets in shots/w11/.
  Known: Flosso low contrast in his pink tent (tint the room in code); busy stall layer; two
  pretzels look alike small; Bonbon's cannon detached. Batch 2 = stills + 20 boss weapon icons.
- S-rank investigation still running.

## 2026-11-14 (later): weaknesses, new rank, skip rules: release notes

**Built (one release)**
- Elemental weaknesses to docs/WEAKNESS-DESIGN.md: sim (elements.ts, elementTune.ts), UI
  (elementUi.ts: stage panel Weak row, kit icons + ticks, WEAK!/RESIST popups, HP-bar icon, tips,
  Market RE-SEASON), balance. Changed after measuring: weakStatus 1.5 -> 1.25 (stun-locks with a
  re-seasoned freeze/glue weapon), re-season perLv 12 -> 40 (a Rare costs about one clear).
  Bosses (n=400 each, same seeds): before 70.6% avg, unprepared 71.1, prepared weapon 71.8,
  prepared weapon+buttons 72.7. Stages: 92.4 / 91.8 / 92.7 / 93.4. No monster-type changes asked.
- Rank (decision: "Option B + clean-up", S target 10-20%): Defence = 35 - 30 x hits / (kills + 20;
  +60 on x-10) - 2 x jams (1.5 on x-10); a SKIP TO BOSS run is capped at A. Rescored on 8,000
  runs: S 17 / A 54 / B 24 (was 3 / 39 / 53); x-10 S 17 / A 69. Toastbat unlock = 3 clears at A+;
  kaiju quest "no hit" -> "any stage with an S" (same quest id); Slippery = 4 perfect dodges, hard
  tier; Express Order -> easy tier; Star Chef removed from 11 low-S stages; keepStars() migrates
  saved stars.
- Found: the three Challenges chillies and SKIP TO BOSS NEVER worked live (camp click selector
  never listed them; since 10 / 11 Nov). Fixed + tests/camp-clicks.test.ts. Producer rule to stop
  the box farm this exposed: a skipped run gets no chilli rules/bonuses, no stars, rank A at best,
  no rank-quest credit (enforced in save.finishStage).

**Decisions:** drops features and rank as recorded above; Garnish = strict (looks + own-monster
drop chance); Cookbook pays no boxes.

**Open**
- Low boss cells: Pengwhip 2-10 about 36% (was 44), Sloba 1-10 about 35% (was 45); already-low:
  Bloblin 1-10 / 2-10, Mothball 10-10, Minturtle 2-10 / 4-10, Velvaroo 5-10.
- The green tick and loadout advice can mislead: swapping a kaiju's main damage skill for an
  element match is often worse (Mothball 9-10 55% -> 15%). Tip text softened; tick logic unchanged.
- Guard Break is 20-27% slower at cracking armour on Slippery foes (still the best tool there).
- Re-season is dear next to other crumb sinks (meets the 1-2 clears brief).
- Rank: 3-3 has no S, ten more stages under 4%; World 4 far easier (4-5 S 62%). Bluebeary,
  Minturtle, Tacowl S 2-6%. "Beat the clock" unfair to Minturtle / Bluebeary.
- Judgement calls left: a Hard skip completes "clear any stage on Hard"; a skip pays first-clear
  rewards; stocked (drops in bag) runs make the clock chilli free.
- `hit` event has no monster id (popup throttle picks the nearest monster).
- Hard / Nightmare / Free Play were only spot-checked with weaknesses (within noise).
- Next: Monster Cookbook, then Garnish (docs/DROPS-USES.md), then World 11 build (art batch 1
  done; batch 2 = stills + 20 boss weapon icons).

## 2026-11-14 (evening): Monster Cookbook shipped; World 11 art batch 2a

**Shipped:** Monster Cookbook phase 1 (Bag -> Cookbook): 10 pages / 82 cards, hand-ins at 1/5/12
(1/3/8 for the 26 never-wanted kinds), rewards crumbs + stamps + gold borders + titles (no boxes,
no power), skip-break warning, HAND IN ALL SPARES, never-wanted drop rate 20% -> 35%, titles on
the Hero tab and online (id only). 408 tests. Sanity sweep: clears identical at both drop rates.
World title for World 10 shortened to "Feast Cook" (producer edit).
**Art:** 20 bw-flosso-<ref> boss weapon icons + still-w11-open / -boss / -cure accepted (not wired).
**Open:** warning dialog has an extra "ONLY THE n SPARE" button (kept); in-stage friend title is as
large as the name; Garnish test B1.3 must exclude respawn differences (the bag feeds respawns);
`flosso` is not yet in BOSS_ORDER / BW_BOSS; 27 World 11 scene paintings wait for stage facts.
**Next:** Garnish slot, then World 11 build.
