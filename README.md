# Kaiju Kitchen Quest

A phone-first, side-scrolling co-op brawler RPG starring the 20 Kitchen Kaiju food monsters. Ten worlds of ten stages
(Act 1: the Kitchen, Worlds 1-5; Act 2: Beyond the Kitchen, Worlds 6-10), loot boxes in 5 tiers, gear, skill trees,
a CPU buddy, online co-op for up to 4, and Free Play modes. Phaser 4 + TypeScript + Vite, installable as a PWA.

This file describes the game as the code builds it today. Tuning numbers that change with every balance pass are not
quoted here: each one is named with the constant and file that holds it.

## Run, test, build

| What | Command |
| --- | --- |
| Dev server (port 5210) | `start.cmd` or `npm run dev` (`npm run phone` exposes it on Wi-Fi) |
| Tests (Phaser-free sim) | `npm test` |
| Type check | `npm run typecheck` (`tsc --noEmit`) |
| Build | `npm run build` (type check, then `vite build`) |
| Phone screenshots + pose sheet | `node scripts/shot.mjs [dpr]` → `shots/` |
| Process art | `npm run art` |
| Generate art | `node scripts/gem-gen.mjs <jobs.json>` or `sh scripts/gem-batch.sh <jobs.json> <log>` (see Art pipeline) |

`.ts` scripts run with `npx vite-node scripts/<name>.ts`; `.mjs` scripts with `node`.

## Where things live

| Path | What |
| --- | --- |
| `src/sim/` | The whole game simulation, no Phaser: `world.ts` (the stage loop), `stages.ts` (worlds + stage generator), `mobs.ts`, `skills.ts`, `tree.ts`, `stats.ts`, `classes.ts`, `items.ts`, `gear.ts`, `bossgearData.ts`, `loot.ts`, `drops.ts`, `challenges.ts`, `consumables.ts`, `free.ts`, `kaijuTune.ts`, `bot.ts` (balance bot), `chaos.ts` (random-input bot + rules), `types.ts` |
| `src/scenes/GameScene.ts` | Draws a `World`, plays its events (sound, toasts, speech bubbles), runs Free Play and online stages |
| `src/render/` | Cutout rigs: `rigs.ts` (pieces, joints, draw order), `rig.ts` (`poseFor` animation), `pose.ts`, `layout.ts` |
| `src/ui/` | HTML overlays: `camp.ts`, `free.ts`, `online.ts`, `story.ts`, `credits.ts`, `title.ts`, `settings.ts`, `tips.ts`, `report.ts`, `style.ts` |
| `src/story/` | `stories.ts`, `arcs/k<species>.ts`, `more/k<species>.ts`, `banter.ts`, `finale.ts`, `mood.ts`, `kaijuQuests.ts` |
| `src/net/` | Online co-op: `net.ts`, `relay.ts`, `snapshot.ts` |
| `src/save.ts`, `src/quests.ts` | Save data and everything that changes it; daily quests and achievements |
| `src/audio.ts`, `src/input.ts`, `src/touch.ts`, `src/hud.ts` | Synthesised SFX and chiptune tracks (no audio files), keys, touch controls, HUD |
| `scripts/` | Balance, diagnosis, screenshot and art-job scripts (see Testing and Art pipeline) |
| `tests/` | Vitest suites, one per system; `tests/visual-baseline/` for the visual check |
| `docs/` | `PLAYTEST.md`, `VOICE.md`, `stage-facts.md` (generated), world and kaiju briefs for writers, `STUDIO-LOG.md` |
| `art-src/` | `jobs-*.json` prompt files and `raw/` Gemini output; processed art goes to `public/art/` |

## Controls (`src/input.ts`, `src/touch.ts`)
Phone: left thumb anywhere on the left = stick (run, ↑↓ climb, ↑ at a portal to go through, ↓+JUMP drop down, flick the
same way twice = dodge roll); ATTACK, JUMP, 3 SKILL buttons, ULT, GEAR, 4 quick-bag slots at the bottom, 💬 quick chat online.

Keys: arrows/WASD (double-tap ←/→ = dodge), Space/K jump, J/Z attack (×3 combo), L / I / O (or X / C / V) skills,
U/Q ultimate, F/H gear skill, 1-4 quick bag, 7 8 9 0 quick chat, Esc pause, M mute.

## Stages

### Worlds (`stages.ts` `WORLDS`)
Each `WorldDef` holds its art keys, `baseLv` (monster level of stage 1, each stage adds about 1), `power` and `mobPow`
(strength multipliers, tuning), the monster `pool` (kind + the stage number it appears from), `elite`, `boss`, `hazard`,
`mimic` and the 10 stage names.

| # | World | Levels | Hazard | Boss (`MobKind`) |
| --- | --- | --- | --- | --- |
| 1 | The Countertop | 1-10 | `burner` | Burnt Toast King (`toast`) |
| 2 | The Fridge | 13-22 | `ice` | Freezer Golem (`golem`) |
| 3 | The Oven | 25-34 | `vent` (steam) | Grease Dragon (`dragon`) |
| 4 | The Pantry | 37-46 | `drop` (falling cans) | Cookie Jar Mimic (`jar`) |
| 5 | The Sink (Act 1 finale) | 49-58 | `tap` (faucet) | The Mold Crown (`moldking`: spore rain, Sporelings, floor tendrils, mould puddles) |
| 6 | The Dining Room | 61-70 | `wax` (drip + sticky puddle) | Sir Stale (`stale`: lance charges, crumb volleys, crouton summons) |
| 7 | The Backyard BBQ | 71-80 | `sprinkler` (launch + slick puddle) | Baron Brussels (`brussels`: stink puddles, sprout summons, charcoal rain) |
| 8 | The Garden | 81-90 | `pollen` (sting + sticky patch) | The Mystery Meatloaf (`meatloaf`: borrowed breath / spores / crumbs, chunk summons) |
| 9 | The Supermarket | 91-100 | `chill` (push + ice slick) | The Tupperwraith (`tupper`: lid boomerangs, murky puddles, lid summons) |
| 10 | The Feast of the Forgotten (Act 2 finale) | 101-110 | `chill` | Old Fruitcake (`fruitcake`: every lieutenant's trick + candied fruit storm) |

The level cap is `MAX_LEVEL` in `stats.ts`. World numbers can have two digits (beat regexes use `\d+`).
Writer briefs: `docs/WORLD5-BRIEF.md` … `docs/WORLD10-BRIEF.md`.

### Story stages are a run of maps (`stages.ts` `genMaps`)
`STAGES` is built once from `genStage(world, n)`, seeded per stage, so a stage is laid out the same for everyone.
Every story stage, the Daily Dungeon and the bonus stages come from `genMaps`:

- **Maps**: 2 maps for stages 1-3 and for the world boss stage, 3 for the rest, then a boss room, all side by side in one
  wide world and walled off from each other (`StageDef.maps`, World `mapAt`). Each map is 2-3 screens, uses one of six
  layouts (terraces, towers, steps, islands, deck, valley) with several floors, and has a ladder up to every upper floor.
  The islands layout has a moving tray; the valley layout has conveyor belts from World 2 on (`StageDef.belts`).
- **Monsters respawn**: each map has spawn points on every floor and a cap (`StageMap.spawns`: kinds, points, cap);
  `World.stepMapZones` brings monsters back away from you while you are in the map. Later maps bring in a monster of the
  next stage. Monsters in the gap between your level and theirs: see `LV_GAP` in `world.ts`.
- **Exits want monster drops**: each map's EXIT portal (press up) wants a mix, 3 each of 2-3 monsters' drops
  (`ZoneGoal` `collect.wants`), close-range monsters first and at most one shooter. Every monster kind has its own drop
  (`src/sim/drops.ts` `DROPS`, icons `drop-<kind>`). Drops fall on the floor and drift to you; the exit takes what it
  wants as you go through (`World.tryPortal`), the rest stay in your bag (`save.drops`). Drop odds: `DROP_CHANCE` /
  `QUEST_DROP_CHANCE` in `drops.ts`; a wanted monster never misses three times in a row, and one you still need is
  spawned next when few are around. Holding a stage's full set shows SKIP TO BOSS on the stage panel (`World.skipToBoss`).
- **Boss room**: the last map. The foe sleeps until you walk in (`MobSpawn.wake`, event `bossWake`). Stages 1-4 and 6-9:
  that stage's miniboss or King from `ROOM_FOES`; stage 5: the world's champion (`WorldDef.elite`, `x<monster>`) or, in
  Worlds 1-5, your kaiju's nemesis; stage 10: the world boss, with the boss backdrop and music (`StageDef.bossBg`) and the
  world's hazards switching on when it enrages. Non-boss room foes get extra health (`MINI_ROOM_HP` in `world.ts`).
  The exit portal appears when the boss room is clear. Every boss room has a ladder to its top ledge (the low jumpers
  can't hop up there and a summon on it never comes down), and `World.keepMobsInMaps` puts any monster shoved outside
  its map back inside, so the room can't clear with the foe alive (`tests/room-reach.test.ts`, `scripts/room-reach.ts`).
- **Along the way**: two honey jars at each map's start and three before the boss room (a jar heals a little), a crate or
  jar per map, one or two of the world's hazards per map (none in 1-1; hazards by a bouncy sponge are slid away:
  `awayFromSponges`), a loot-box mimic in the first map of stages 3, 7 and 9, and on stage 7 a secret ledge at the far end
  of the second map (it fades in when you are near; bounce up from the sponge under it) whose chest holds the World Key.
- **Objectives** (`StageDef.objective`, `World.stepObjective`): stage 4 escort the lost Crumblet (it follows you through
  portals, monsters hurt it, it heals when left alone and at each portal, and it waits by the boss room door); stage 6
  grab the Recipe Scroll on a high floor of the second map before a timer runs out; stage 8 hold out against waves in the
  second map. Timers are in the `objective` line at the end of `genMaps`. Finishing one adds a bonus Bento (one per
  player online). The race and the hold-out only start in their own map; the scroll map's exit stays shut until the
  scroll is got; SKIP TO BOSS cancels both with no bonus (`World.objCancelled`, `tests/qa-fixes.test.ts`).
- **Leaving**: the pause menu's ESCAPE leaves the stage keeping the drops and crumbs you picked up, not the boxes.
- **Stage facts for writers**: `npx vite-node scripts/stage-facts.ts > docs/stage-facts.md` lists each stage's boss-room
  foe, wanted drops and feature. The short pre-stage scenes (`src/story/more`) are written against it, so regenerate it
  and re-check those scenes whenever stage generation changes.

Tests: `tests/drops.test.ts`, `tests/world.test.ts` (every platform reachable), `tests/objectives.test.ts`,
`tests/props.test.ts`, `tests/setpieces.test.ts`, `tests/sponge.test.ts`, `tests/ladder.test.ts`.

### Loot, rank, challenges
- **Boxes** (`loot.ts`): Paper Bag → Lunchbox → Bento → Golden Cloche → Rainbow Cake Box. In map stages ordinary monsters
  drop no boxes (crumbs, stones and their drop item only); a mimic drops 1, the boss-room foe 1, a world boss 2, a secret
  chest 1 (`World.killMob`, `hitProp`). The end-of-stage chest holds boxes by rank (`clearCount`), plus a first-clear box
  (`clearRewards`); a good rank can also upgrade boxes you found (`save.ts` `finishStage`).
- **Rank** (`world.ts` `rankOf`): time against par, hits taken per minute, jams drunk (`RunStats.heals`), best combo, and
  style (average style meter, perfect dodges, interrupts).
- **Stage challenges** (`src/sim/challenges.ts`): 3 per story stage, each pays crumbs and a box once and gives a star.
- **Secret bonus stages** (`BONUS_STAGES`, `S-1` … `S-10`, button on the stage card): opened by the World Key from that
  world's stage 7 chest, or by `STARS_FOR_SECRET` challenge stars in that world. A bonus stage is the world's stage 9
  layout with a dozen extra crates and jars, no hazards or objective, an extra elite in the boss room, and one runaway
  pressure cooker in the second map (it can't be hurt, your hits shove it, it explodes near anything: lure monsters in).
- **Boss weapons**: see Gear.

### Difficulty and options (stage card in `src/ui/camp.ts`)
- **Hard** (per world, after its boss): monsters `HARD_LV` levels higher, two modifiers on elites and some on normal monsters.
- **Nightmare** (per world, after its boss on Hard): Hard plus the `NIGHTMARE` / `NIGHTMARE_BOSS` multipliers in
  `world.ts`, shorter telegraphs, more modifiers, three attackers at once, and an extra high-tier box every clear.
- **Spicy chillies** (after 1-10): No potions / Glass jaw / Beat the clock, each adding a bonus box and more crumbs.
- **Story twists** (`STORIES[sp].variants`, `VARIANT_INFO`): some stages in a kaiju's story are Swarm, Ambush or Night.
- **CPU buddy** and **story mode** (FULL STORY / KEY SCENES ONLY, `save.storyMode`) are also picked on the stage card.
- Global knobs: `TUNE` and `ELITE` in `mobs.ts`, `WorldDef.power` / `mobPow`, `lateHit` (Act 2 ordinary monsters),
  `TUNE.treeRamp` (monsters grow past level 20 to absorb skill-tree power).

## Free Play (`src/sim/free.ts`, `src/ui/free.ts`, camp tab "Free Play", opens after 1-10)
Monsters scale to the hero's level through `StageDef.power` = `powerFor(lv)` (the story worlds' curve), so Free Play
never touches story progress.
- **Daily Dungeon** (`dailyStage(dayKey, heroLv)`): a world and a stage shape (2, 3, 6, 7, 8 or 9) picked by the date,
  the same for everyone, built by the same map generator as the story, scaled by `DAILY_POWER`, with no World Key.
  A bonus box once a day.
- **Endless Pantry** (`endlessFloor(floor, heroLv, seed)`): one arena room per floor (the gates shut, 2-3 waves, the gates
  open; an elite every 5th floor, a world boss room every 10th), harder each floor; pick 1 of 3 `PERKS` after each floor
  (`withPerks`), health carries over; a box per floor (`endlessReward`, banked at once), "bank it & stop" any time.
  Best floor per kaiju in `save.free.endless`.
- **Boss Rush** (`rushStages(beaten, heroLv)`): every world boss this kaiju has beaten, back to back in its bare boss room
  (`genStage(..., { short: true })`), scaled by `RUSH_POWER`, half your health back between fights; best time in
  `save.free.rush`.
`GameScene` runs these from `data.free` (`FreeRun`) and `finishFree()` chains the stages.
Balance: `npx vite-node scripts/free-balance.ts [runs]`. Screens: `node scripts/free-shot.mjs`. Tests: `tests/free.test.ts`.

## Combat (`src/sim/world.ts`)
- **Perfect dodge**: get hit at the very start of a roll (`PERFECT_WIN`) → slow motion, a window of guaranteed crits, ult gauge.
- **Interrupts**: hitting a wind-up cancels it (armoured monsters need a heavy hit). **Red wind-ups** (`DANGER_MOVES`:
  boss charge / leap, elite slams, charger rushes) can't be interrupted: dodge them. Elites leave an opening after each attack.
- **Combo routes**: UP+attack = launcher, air attacks keep you aloft (juggles), DOWN+attack = Guard Break (breaks shields
  and armour, adds boss stagger), dodge-cancel out of attacks and skills. **Style meter** (D-S, `STYLE_RANKS`): varied
  moves raise it, getting hit drops it; it feeds the stage rank.
- **Monster brains**: walker, hopper, flyer, ranged, brute, healer, burrower, charger, sniper (laser line), turret,
  summoner, bomber, mimic, plus bosses and nemeses (`MOBS` in `mobs.ts`).
- **Smarter monsters**: melee monsters take turns (`maxAttackers`; the rest circle at range), split up to flank both sides
  (`flankSide`), shield carriers stand between you and a healer, and repeating plain combos makes nearby monsters raise
  their guard (`guardT`) until you mix in a launcher, Guard Break, air attack or skill. Tests: `tests/ai.test.ts`.
- **Elite modifiers** (`ELITE_MODS`): Spiky, Hasty, Vampiric, Shielded, Moldy, Splitting.
- **World bosses** (`BOSS_PATTERNS`, `BOSS_ARMOR`): they fight in fixed strings (a close one or a far one, by where you
  stand), then are tired for a moment and take more damage. Later phases add moves ("FINAL PHASE!"). Armour (the bar under
  the boss's HP) softens hits until it breaks, heavy hits break it faster; a break staggers the boss and leaves it weak,
  then the armour grows back. Gear skills do reduced damage to bosses (`gearVs`). Tests: `tests/boss.test.ts`;
  `node scripts/boss-shot.mjs 2-10`.
- **Minibosses, Kings and champions**: 5 minibosses per world (`m<world>a`-`e`), Kings (`k<monster>`: a world monster
  drawn twice as big with a crown, `MobDef.king`) and each world's champion (`x<elite>`). `ROOM_FOES` gives a world's
  stages 1-4 and 6-9 eight different boss-room foes (3 Kings + 5 minibosses). They keep to their move order and, like
  nemeses, fight in armour: hits don't interrupt or flinch them until it cracks. Boss-room fights: `scripts/room-duel.ts`.
- **Story nemeses** (`mobs.ts` `nem`, `nemesisOf`, scenes in `src/story/arcs/k<species>.ts`): each kaiju has one rival
  (brain `nemesis`) who takes the champion's place in the stage 5 boss room of Worlds 1-5, in that kaiju's story only.
  It uses more of its moves in later worlds (`nemesisMoves`), cycles them in order, tires after each round and enrages at
  half HP. Shared basics (slash, leap, charge, rain, breath, fanshot, lob, spin, roar, puddle, trap) plus one signature
  move each. From World 6 on the nemeses have retired: stage 5 is the champion and the `w<N>-elite` scene is a friendly
  cameo. Story speaker `foe`. Checks: `tests/nemesis.test.ts`, `npx vite-node scripts/nem-diag.ts 4-5 Toastbat`,
  `node scripts/nemesis-shot.mjs`.
- **Hazards** (`hazardAt` in `stages.ts`): one kind per world (see the Worlds table); they flash before they fire.
- Preview: `node scripts/combat-shot.mjs 2` → `shots/combat-*.png`.

## Kaiju

### Stats and levelling (`stats.ts`, `classes.ts`)
STR / DEX / INT / VIT with `STAT_PTS_PER_LEVEL` points per level, turned into combat numbers by `derive`. The scaling
constants are in `SCALE`: INT's skill bonus is measured against the level, STR also multiplies attack a little, DEX past
the crit cap becomes crit damage, every kaiju gets HP per level, and damage reduction past the soft cap counts for less.
`src/sim/kaijuTune.ts` holds a small HP / attack multiplier per kaiju (global offsets `SCALE.hpAll` / `dmgAll`).
`xpFor` is tuned so one pass of the story keeps you about at each stage's recommended level (`scripts/progress-sim.ts`,
`scripts/xp-curve.ts`).

### Skills (`skills.ts`)
3 actives (`SKILL_UNLOCKS`), 1 passive (`PASSIVE_UNLOCK`) and an ultimate (`ULTS`, `ULT_LV`) per kaiju; skill ranks up
to `MAX_SKILL` (+gear bonus), each rank needing a hero level (`rankLv`). Every kaiju's skills are its own:
`tests/skills.test.ts` fails if two kaiju share a skill mechanic, an ultimate kind, a passive stat or a skill name.
Skill ids never change (saves store levels and branches by id). Mechanics live in `world.ts` `startSkill` / `stepSkill`
(+ zones, orbs, burn / freeze status, special projectiles); `POSE_OF` maps them to existing animations. Healing skills get
limited cooldown reduction. Lobbed hero shots remember the height they were thrown from (`Shot.fromY`) and fall through
ledges above it (`tests/berry.test.ts`). Preview: `node scripts/skill-shot.mjs [species...]` → `shots/skills-sheet.png`.

### Skill trees (`tree.ts`)
3 paths × 7 rows per kaiju (stat, stat, a new skill, stat, an upgrade to an original skill, a capstone, a 10-rank
mastery): more points than a max-level kaiju earns, so you choose. Rows open at hero levels (`ROW_LV`, `nodeLv`); the
first row opens at Lv 1. New skills reuse proven skill templates with their own numbers. 3 skill buttons: pick from the 3
originals + learned tree skills (`HeroProfile.loadout`, Skills tab → ⚔ SKILLS); a newly learned tree skill goes onto a
free button. The Recipe Scroll refunds tree points. Tests: `tests/tree.test.ts`; screen: `node scripts/tree-shot.mjs`.

### Roster and unlocks
20 kaiju (`CLASSES`). You start with 4 (`STARTERS` in `save.ts`); the rest are recruited through `UNLOCKS` in
`src/story/kaijuQuests.ts` (boss kills and monster counts, tracked in `src/quests.ts`). Each has its own story from 1-1,
its own nemesis, gear and 2 signature legendaries. Writer briefs for the later eight: `docs/NEWKAIJU-BRIEF.md` … `NEWKAIJU4-BRIEF.md`.

| Kaiju (species) | Skill kinds of note | Nemesis (`MobKind`, signature move) |
| --- | --- | --- |
| Avocadrake (13) | `pitbounce`, `guac` (zone that heals heroes), ult `guacflood`; holds its weapon in a foot | El Nacho (`nnacho`, `yank`) |
| Tacowl (19) | `gust`, `drop`, `screech`, `volley`, ult `fiesta`; flies, weapon in a talon | Señor Sting (`nhornet`, `stingers`) |
| Bubblegumbo (9) | `bubbletrap` (`world.bubbles`: sealed monsters are helpless, then pop), ricocheting `gumball`, two-way `trumpet`, ult `megabubble` | Brittle (`nmouse`, `scurry`) |
| Velvaroo (18) | landing-driven `hops`, `flurry`, aimed `cakebomb` (frosting slow patch), ult `tko` | Rocky Road (`ngorilla`, `haymaker`, a danger move) |
| Sloba (12) | `swing`, `nap` (heals then shockwave), `slowtime`, ult `snooze` | Jitters (`nbird`, `zip`) |
| Minturtle (16) | aimed freezing `scoop`, `wall` (`world.walls` block monsters and mob shots), `chipstorm`, ult `sundae` | Hot Fudge Hare (`nhare`, `boomhop`) |
| Bloblin (3) | `jiggle` (glue splat), bouncing `clones`, `wobble`, ult `jellyquake` | Grey Gelato (`ngelato`, `drip`) |
| Salmonster (14) | `upstream`, `tide` (carries monsters), wavy `salmon`, ult `salmonrun` | Grizzly Grizzle (`nbear`, `swipe`) |

## Gear (`items.ts`, `gear.ts`, `bossgearData.ts`)
- **Items**: slots weapon / armour / charm, rarities Common-Legendary, random stat lines, skill boosts, grades, sets,
  fortifying (`MAX_PLUS`), salvage. Gear tiers per kaiju start dropping at the item levels in `TIER_LV`; tiers 3+ are part
  of the kaiju's signature set. Tests: `tests/gear.test.ts`, `tests/gear-late.test.ts`.
- **Gear skill**: every weapon has its own move on a 4th button (`world.castGear`; shots carry `icon` + `fx`). Styles:
  throw, lob (aims at the nearest monster), roll, slam, rain, boomerang (out and back, shot kind `gearboom`), burst
  (`gearburst`), trap (a Mine on the floor), plus the boss-weapon styles. Power scales with rarity × fortification × grade.
- **Weapon twists** (`TWIST_CHANCE`, `TWIST_STYLES`, `TWIST_FX`, `gearSkillOf`): most weapon drops that aren't signature
  legendaries roll a twist: a different gear-skill style and usually an effect (burn / freeze / glue / slow / launch /
  pull / heal). The weapon is named for it ("Frosty Rolling Pin") and so is its gear skill. Screens:
  `node scripts/twist-shot.mjs`, `node scripts/gearstyle-shot.mjs`; tests: `tests/gearstyles.test.ts`.
- **Effects on armour and charms** (`PROCS`, `Item.proc`, `BaseDef.proc` for built-in ones such as the `a-<ref>x`
  armours): Jam Trap, Static Whisk, Bubble Wrap, Pineapple Skin, Snack Break, Sugar High, Brain Freeze, Belly Flop,
  Meringue Guard, Popcorn Burst, Syrup Slide, Pepper Breath, Second Scoop, Quick Draw, Snack Bite, Crumb Magnet.
  Tests: `tests/procs2.test.ts`.
- **Signature legendaries** (`UNIQUES`, `u-*` icons): 2 per kaiju (weapon + armour) that upgrade one of its skills through
  `SkillMod` (`applyMod`: dmg / reach / cd / n / burn / freeze / glue / slow / leech / echo). They roll on that kaiju's
  gear, more often for the kaiju you play.
- **Boss weapons** (`BOSS_WEAPONS`): one per kaiju per world boss (`bw-<boss>-<ref>`), each with its own gear skill: one
  of the styles in `ALL_STYLES` (orbit, dash, chain, meteor, vortex, turret, spin, wave, shield, barrage, pillar, bounce
  on top of the ordinary ones) plus the boss's element. Dropped only by that world boss for the kaiju you play; the
  chance rises with rank and mode and a pity counter guarantees it (`finishStage`, `save.bwPity`). Tests: `tests/bossgear.test.ts`.
- **Consumables** (`consumables.ts`): Jam Jars, boosts, Second Helping (auto-revive), Golden Sugar Cube, Recipe Scroll,
  fortify stones; 4 quick-bag slots with a shared cooldown.
- Screens: `node scripts/gear-shot.mjs`. Icon jobs: `sig-jobs`, `weapons2-jobs`, `gear2-jobs`, `gear3-jobs`,
  `bossgear-jobs`, `drops-jobs` (all `node scripts/<name>.mjs`, then generate and `npm run art`).

## Story (`src/story/`)
- **Arcs**: `stories.ts` holds a story per kaiju (beats `intro`, `w<N>-open` / `-elite` / `-boss` / `-after`), with each
  kaiju's arc and nemesis scenes in `arcs/k<species>.ts`. `src/ui/story.ts` plays beats as comic dialogue;
  `beatBefore` / `beatAfter` decide which play around a stage.
- **Short scenes** (`more/k<species>.ts` `BEATS`): a punny scene before stages 2-4 and 6-9 of every world for every kaiju
  (`w<N>-s<n>`), skipped in KEY SCENES ONLY mode (`isMinorBeat`). They are written against `docs/stage-facts.md`.
- **In-stage banter** (speech bubbles that don't pause play, `GameScene.quip` / `bubble`): each monster kind taunts the
  first time it is on screen (`TAUNTS` in `banter.ts`); your kaiju quips (`QUIPS` in `more/k<species>.ts`, keyed by
  `QuipKind`) on big combos, low HP, perfect dodges, level-ups, secret chests, mimics, finished objectives / cleared
  arenas, and cooker explosions (bonus stages).
- **Voice**: all dialogue follows `docs/VOICE.md` (cartoon characters talking: interjections, sound effects, catchphrases,
  ham-fisted puns; no em dashes, dry narrator punchlines or explained morals). `tests/voice.test.ts` and
  `tests/banter.test.ts` guard it; `src/story/mood.ts` picks expression portraits (`tests/mood.test.ts`).
- **Endings**: after 5-10, `w5-after` (still-w5-cure, then still-<sp>-end), the credits (`src/ui/credits.ts`), then the
  tease of Act 2's villains, THE LEFTOVERS (`finale.ts` `HOOK`, speakers `lo` / `lo2`, still-w5-hook). After 10-10,
  `w10-after` (still-w10-cure, then the shared still-w10-end), the Act 2 credits (`showCredits(sp, done, 2)`), then
  `w10-hook` (`HOOK2`, still-w10-hook). The Leftovers lieutenants are the bosses of Worlds 6-9.
- **Painted stills** (`stillFor`): per kaiju `still-<sp>-intro` and `still-<sp>-cliff` (the Sink cliffhanger); shared
  `still-w<N>-open|boss|cure`; shared `still-w<N>-s<n>` for the short scenes (the left third is kept clear for your
  kaiju's portrait); per kaiju `still-<sp>-w<N>-elite` for the stage 5 beat (both characters are painted in, so their
  portraits hide). The elite stills aren't precached (`vite.config.ts` `globIgnores`): they download when first shown and
  are then cached for offline play. A scene whose painting is missing falls back to portraits (the story player reads
  `art/manifest.json`); the art test fails if a required still is missing.
- Preview: `node scripts/story-shot.mjs 2 <species> intro w1-open ...` → `shots/story-*.png`; `node scripts/banter-shot.mjs`.

## Co-op

### Party and CPU buddy (`world.ts` `heroes[]`, `tests/party.test.ts`)
The sim runs 1-4 heroes: `new World(..., party: Derived[], humans)`, `step([input0, input1, ...])`. `world.hero` is the
hero the current code is about (the one stepping, a monster's target, a shot's owner) and is the player between steps.
Monsters target the nearest standing hero (turn-taking per target); a downed hero is revived by a teammate standing next
to them and only a full wipe fails the stage; monsters get more HP per extra player and per CPU buddy (`spawnMob`);
stragglers are leashed back; each human gets their own box drops (`lootOf`); arenas pull everyone in; rank / combo /
style only count the player. CPU buddy: pick on the stage card (`save.buddy`); it fights at your level (`buddyProfile`),
driven by `new Bot(w, AVERAGE, seed, 1)`, revives you, follows you and comes through portals with you.
`node scripts/buddy-shot.mjs`.

### Online (`src/net`, `src/ui/online.ts`, `tests/net.test.ts`, `tests/coop.test.ts`)
Camp map → 🌐 ONLINE: host a room (a short code) or join one; up to 4 players, each with their own kaiju, level and gear
(`kitOf` sends a trimmed `HeroProfile`). PeerJS direct link first, MQTT public-broker backup route if that fails
(`?net=backup` forces it). The host runs the only real `World` (`party` = friends' kits, `humans` = player count) and
feeds friends' inputs into `step([...])`; it sends snapshots (`makeSnapshot`, fewer per second on the backup route, and
only monsters in maps that have a hero); guests copy them into a drawing-only World with `applySnapshot` +
`world.view(seat)`. Online stages skip story twists, nemeses and spicy rules (same stage for everyone). Everyone brings
their own quick bag and Second Helpings (`Kit.bag` / `revives`, World `partyBags`; snapshot `bg` sends the counts back,
each device writes its own). A friend who drops mid-stage is handed to the CPU; a friend who levels up sends a new kit
(`setDerivedOf`). After a stage everyone gets their own loot and goes back to the room.
- **Free Play online**: the host picks Daily Dungeon / Endless Pantry / Boss Rush in the room; monsters scale to the
  average party level. The host generates each stage and sends it whole (`NetFree`, `launch()`), health carries over by
  player; in Endless the host picks the perk for the team (friends see `waitPerk`), `freeEnd` when the host banks. Each
  device banks its own boxes and records its own bests.
- **Quick chat**: 💬 button or keys 7 8 9 0 (`EMOTES`, msg `emo`, the host relays). The HUD lists every teammate (red when
  down); a teammate's name tag sticks to the screen edge with an arrow when off screen.
- Tests in a browser: `node scripts/online-shot.mjs [backup]`, `node scripts/online-free-shot.mjs` (two browsers).

## Camp, save and settings
- **Camp** (`src/ui/camp.ts`): tabs Map (world map, stage card with challenges, difficulty, buddy, online), Free Play,
  Hero (stats, equipment), Skills (ranks, tree, loadout), Bag (tabs, ▲▼ compare, lock, equip best, salvage, quick bag),
  Market (daily gear, boxes, consumables), Boxes (opening), Quests (daily quests, achievements, kaiju quest lines); and the
  result screen. Title screen: `src/ui/title.ts` (⛶ fullscreen also in camp and pause).
- **Save** (`src/save.ts`): localStorage key `KEY` (currently `kkq-save-v3`; a version bump starts everyone fresh and
  leaves the old save untouched). Loading repairs saves (unknown item types dropped, broken levels fixed).
- **Settings** (`src/ui/settings.ts`, ⚙ in camp and pause, stored in `kkq-settings` so START OVER keeps them): sound and
  music volume, screen shake, flashes, text size, touch button size, story scenes, tips, low effects (fewer particles,
  damage numbers only for crits and hits on you).
- **Tips** (`src/ui/tips.ts`): a guided start on a kaiju's first 1-1 (move, jump, attack, dodge, skill, gear) and one-time
  tips (ladder, dropping through, arena, hazard, sponge, low health, Crumblet, Recipe Scroll, boss, exit), remembered in `save.tips`.
- **Bug report** (`src/ui/report.ts`): 🐞 REPORT A BUG (camp, pause, title) copies a report (version, kaiju, stage
  position, last errors); every uncaught error is logged.
- **PWA**: `vite.config.ts` (`VitePWA`); art is precached except the per-kaiju elite stills.

## Art pipeline
- **Flow**: a `scripts/*-jobs.mjs` script writes `art-src/jobs-*.json` → generate with Gemini in Chrome → raw images land
  in `art-src/raw/` → `npm run art` (`scripts/process-art.mjs`) cleans them into `public/art/`.
- **Generating**: `node scripts/gem-gen.mjs <jobs.json>` needs Chrome started with `--remote-debugging-port=9333` and
  signed in to Gemini. For batches use `sh scripts/gem-batch.sh <jobs.json> <log>`: one job at a time, a time limit each
  (a refused prompt hangs gem-gen), skips art that exists, resumable.
- **Rules learned the hard way**: run one gem-gen at a time (two jobs in the same Gemini tab can swap images). Prompts
  must not name characters (Gemini drew a famous cartoon for "Finn") or places (it paints the name as text).
- **Review**: `node scripts/icon-sheet.mjs <jobs.json> [--wide]`, `node scripts/contact-sheet.mjs <prefix> [out] [cols]`,
  `node scripts/faces-sheet.mjs`.
- **Cutout rigs**: heroes are puppets. A Gemini "parts sheet" per kaiju (`art-src/raw/parts-N.png`) is split by
  `npm run art` into `public/art/parts-N-<i>.webp` (+ `parts-N.json` with each piece's box). `src/render/rigs.ts` names
  each piece (body / arm / leg / tail / wing), its joint and draw order; `src/render/rig.ts` animates them from the hero
  state (`poseFor`). `node scripts/rig-shot.mjs <species>` for close-ups; `tests/rig.test.ts`.
- **Job scripts**: stills `stills-jobs`, `scenes-jobs` (short-scene paintings), `elite-jobs` (stage 5 paintings);
  worlds `w5-jobs` … `w10-jobs` (`[stills]`); kaiju `newkaiju-jobs` … `newkaiju4-jobs`, `nemesis-jobs`, `faces-jobs`;
  monsters `mobs2-jobs`, `mobs3-jobs`, `minis-jobs`, `minis2-jobs`; props `props-jobs`, `cage-jobs`; gear: see Gear.

## Testing and tools (see also `docs/PLAYTEST.md`)
- **Unit tests**: `npm test` runs every `tests/*.test.ts` against the Phaser-free sim.
- **Chaos**: `src/sim/chaos.ts` (random-input bot + rules); `npx vite-node scripts/chaos.ts [stageFilter] [seconds] [seeds]`;
  replay one report with `scripts/chaos-trace.ts <stage> <species> <seed>`; `tests/chaos.test.ts` runs a slice. Runs are
  deterministic (entity ids restart per World). Ladder checks: `scripts/ladder-probe.ts`, `scripts/ladder-probe2.ts`.
- **Saves**: `npx vite-node scripts/save-fuzz-gen.ts` then `node scripts/save-fuzz.mjs` (every screen × 60 random / odd saves).
- **Visual**: `node scripts/visual-check.mjs [--update]` against `tests/visual-baseline/`.
- **Performance**: `node scripts/perf-check.mjs [cpuSlowdown]`, `node scripts/perf-profile.mjs [stage]`. Monsters far
  off-camera aren't drawn.

### Balance tools
The balance bot (`src/sim/bot.ts`, `AVERAGE` and `SKILLED`) plays stages with a build made for its level
(`scripts/hero-at.ts`). It steps out of firing hazards, hops off ladders level with its target and goes back for a
Recipe Scroll it rode past. Current targets and results are kept with the balance work (`docs/STUDIO-LOG.md`), not here.

| Question | Tool |
| --- | --- |
| One stage or world, every kaiju | `npx vite-node scripts/balance.ts [stageFilter] [runs] [normal\|hard\|nightmare] [average\|skilled] [jams]` (e.g. `3- 2 normal skilled 8`) |
| Every story stage, in parallel | `JAMS=8 sh scripts/sweep-all.sh <runs> <mode> <average\|skilled> > shots/<file>.txt` (per-stage files go to `shots/sweep/`; `KAIJU=0,10,11` limits the kaiju) |
| Per-world summary of that sweep | `node scripts/sweep-sum.mjs shots/<file>.txt` (always pass the file: with no argument it reads an old `shots/sweep-all.txt`) |
| Per-kaiju clear rates of that sweep | `node scripts/sweep-kaiju.mjs` (reads `shots/sweep/`) |
| Sweep to a named file, all 20 kaiju (preferred) | `sh scripts/sweep-pass.sh shots/<file>.txt <runs> [mode] [stage ids...]`, then `node scripts/pass-sum.mjs shots/<file>.txt` (`STAGES=1` adds per-stage lines; shows per-kaiju boss lows and bot timeouts) |
| A few chosen stages | `JAMS=8 sh scripts/sweep.sh <runs> <mode> <average\|skilled> <stage ids...>` |
| World-by-world files + summary | `npx vite-node scripts/balance.ts <w>- 3 > shots/bal/w<w>.txt` for each world, then `node scripts/bal-sum.mjs [dir]` |
| All 20 kaiju on a mode | `sh scripts/bench-all.sh <normal\|hard\|nightmare> [stages]` |
| Even the kaiju out | `node scripts/kaiju-tune.mjs [rounds]` (`--dry` only reports; uses `scripts/kaiju-bench.ts`, writes `src/sim/kaijuTune.ts`; skilled bot with 8 jams like the sweeps, targets via `BOSS=` / `STAGE=`, slow kaiju get damage). Its rounds wobble at noise level, so stop early and check with a boss sweep. Re-run after changing a kaiju's skills or stats |
| One run traced, room checks | `scripts/run-trace.ts`, `scripts/room-clear.ts`, `scripts/room-perch.ts`, `scripts/room-escape.ts` |
| Co-op / Free Play QA | `scripts/qa-sim.ts <daily\|buddy\|coop\|obj\|hold>`, `node scripts/qa-online.mjs <port> [backup]`, `node scripts/qa-free.mjs <port>` (need a server already running on that port) |
| Why is a kaiju weak | `npx vite-node scripts/kaiju-diag.ts [stages] [bosses] [runs]`; stats table `scripts/stat-table.ts [levels]` |
| Why does the bot fail / stall | `scripts/fail-why.ts <stage> [average\|skilled]`, `scripts/stuck-check.ts <stage>`, `scripts/stage-probe.ts <stage> <species>` |
| What hurts, what heals | `scripts/dmg-diag.ts <stage> <species>`, `scripts/nem-diag.ts <stage> <Kaiju name>`, `scripts/heal-probe.ts <stage> <species>` |
| Boss-room fights | `scripts/room-duel.ts <stage> [kaiju]` |
| Levelling and loot pace | `scripts/progress-sim.ts`, `scripts/xp-curve.ts`, `scripts/loot-count.ts [stages...]` |
| Free Play | `scripts/free-balance.ts [runs]` |

### Screenshot scripts (`node scripts/<name>.mjs` → `shots/`)
`shot` (camp, stage, combat, boss, gacha, pose sheet), `combat-shot`, `skill-shot`, `boss-shot`, `room-shot <stages>`,
`nemesis-shot`, `buddy-shot`, `banter-shot`, `story-shot`, `gear-shot`, `twist-shot`, `gearstyle-shot`, `tree-shot`,
`free-shot`, `online-shot`, `online-free-shot`, `card-shot`, `panel-shot`, `market-shot` (every camp tab on a fresh
save), `settings-shot`, `tips-shot`, `title-shot`, `report-shot`, `reset-shot`, `w5-shot` … `w10-shot`.
