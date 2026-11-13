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
