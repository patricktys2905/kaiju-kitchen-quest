# Kaiju Kitchen Quest

A phone-first, side-scrolling co-op brawler RPG starring the Kitchen Kaiju food monsters.
Fight through the kitchen, chain combos, collect loot boxes in 5 tiers, gear up.

- `start.cmd` or `npm run dev` (port 5210; `npm run phone` exposes it on Wi-Fi)
- `npm test` — sim tests (Phaser-free sim in `src/sim`)
- `npm run build`
- `node scripts/shot.mjs [dpr]` — phone screenshots + pose sheet into `shots/`
- Art: `art-src/jobs-*.json` → `node scripts/gem-gen.mjs <jobs>` (Gemini Chrome on port 9333) → `npm run art`

## Cutout rigs
Heroes are puppets: a Gemini "parts sheet" per kaiju (`art-src/raw/parts-N.png`) is split by
`npm run art` into `public/art/parts-N-<i>.webp` (+ `parts-N.json` with each piece's box).
`src/render/rigs.ts` names each piece (body/arm/leg/tail/wing), its joint and draw order;
`src/render/rig.ts` animates them procedurally from the hero state (`poseFor`).

## Controls
Phone: left thumb anywhere on the left = stick (run, ↑↓ climb, ↓+JUMP drop down, flick the same way twice = dodge roll);
ATTACK, JUMP, 3 SKILL buttons, 4 quick-bag slots at the bottom.
Keys: arrows/WASD (double-tap ←/→ = dodge), Space/K jump, J attack (×3 combo), L / I / O skills, 1-4 quick bag, Esc pause, M mute.

## Systems (src/sim)
- stats.ts — level/XP curve, STR/DEX/INT/VIT (+3 points per level), derived combat numbers.
- skills.ts — 3 actives (unlock Lv 1/4/8) + 1 passive (Lv 6) per kaiju, skill levels 1-5 (+gear bonus).
- items.ts — gear slots (weapon/armor/charm), rarities, random lines, skill boosts, salvage + enhance costs.
- loot.ts — box tiers Paper Bag → Lunchbox → Bento → Golden Cloche → Rainbow Cake Box.
- mobs.ts — monsters (walker/hopper/ranged/brute/boss) scaled by level; stages.ts — World 1 (1-1 … 1-4 boss).
- src/save.ts — save (localStorage kkq-save-v1), box opening, stage results (rank upgrades boxes).
- consumables.ts — Jam Jars, boosts, Second Helping (auto-revive), Golden Sugar Cube, Recipe Scroll.
- stages.ts — WORLDS + a seeded generator: 10 stages per world (stage 5 elite, stage 10 boss arena).
- bot.ts + scripts/balance.ts — an average bot plays every stage with every hero at the recommended level;
  difficulty knobs live in mobs.ts TUNE and WorldDef.power. Run: npx vite-node scripts/balance.ts [stage] [runs]
- src/audio.ts — synthesised SFX + original chiptune tracks (no audio files).
- src/ui/camp.ts — world map, hero, skills, bag (tabs, ▲▼ compare, lock, equip best, salvage worse, quick bag),
  market (daily gear), boxes (gacha), result screen.

## Story
- src/story/stories.ts — a unique story per kaiju (beats intro, w{N}-open/elite/boss/after); src/ui/story.ts plays them as comic dialogue.
- Painted stills (`stillFor`): per kaiju `still-<sp>-intro` and `still-<sp>-cliff` (the Sink cliffhanger, from the Mold's first line);
  shared `still-w<N>-open|boss|cure` (bosses are the same for everyone). Elite beats use the plain background + portraits.
- Generate: `node scripts/stills-jobs.mjs` → `node scripts/gem-gen.mjs art-src/jobs-stills.json` → `npm run art`.
  Preview: `node scripts/story-shot.mjs 2 <species> intro w1-open ...` → `shots/story-*.png`. The art test fails if a still is missing.

## Combat depth (src/sim/world.ts)
- **Perfect dodge**: get hit in the first 0.2 s of a roll → slow motion, 1.6 s of guaranteed crits (+30%), ult gauge.
- **Interrupts**: hitting a wind-up cancels it (armoured monsters need a heavy hit). **Red wind-ups** (boss charge/leap,
  elite slams, charger rushes) can't be interrupted — dodge them. Elites leave a 1.4 s opening after each attack.
- **Combo routes**: UP+attack = launcher, air attacks keep you aloft (juggles), DOWN+attack = Guard Break (breaks shields,
  armour, adds boss stagger), dodge-cancel out of attacks/skills. **Style meter** (D–S): varied moves raise it, hits halve
  it; its average, perfect dodges and interrupts feed the stage rank.
- **Boss phase 2** at 50% HP: faster, and the arena's hazards switch on (same for every kaiju).
- **Hazards** per world from stage 2: burners (Countertop), ice (Fridge), steam vents (Oven), falling cans (Pantry).
- **Elite modifiers** (mobs.ts ELITE_MODS): Spiky, Hasty, Vampiric, Shielded, Moldy, Splitting — one per elite, two on Hard.
- **Spicy chillies** (stage card): No potions / Glass jaw / Beat the clock — each +1 bonus box and +25% crumbs.
- **New monsters** (3 per world): healer (Garlic Cleric, Marshmallow Medic), burrower (Sugar Ant, Noodle Lurker),
  charger (Milk Carton, Sausage Ram), sniper with a laser line (Carrot, Raisin), turret (Kettle, ground only, one per stage),
  summoner (Jelly Mother), loot-box mimics (Lunchbox, Cereal Box) in stages 3/7/9. Specialists are capped at 2 per stage.
- Preview: `node scripts/combat-shot.mjs 2` → shots/combat-*.png. Title screen: src/ui/title.ts (⛶ fullscreen also in camp + pause).

## Skills (src/sim/skills.ts)
Every kaiju's 3 actives, ultimate and passive are its own: tests/skills.test.ts fails if two kaiju share a skill mechanic,
an ultimate kind, a passive stat or a skill name. Skill ids never change (saves store levels/branches by id).
New mechanics live in world.ts startSkill/stepSkill (+ zones, orbs, burn/freeze status, special projectiles);
POSE_OF maps them to existing animations. Preview: `node scripts/skill-shot.mjs [species...]` → shots/skills-sheet.png.

## Story nemeses (mobs.ts `nem`, scenes in src/story/arcs/k<species>.ts NEMESIS)
Each kaiju has one rival (brain 'nemesis') who replaces the elite at stage 5 of every world in that kaiju's story only
(World(..., nemesis)). It uses 2 / 3 / 4 / 4 of its moves in worlds 1–4 (nemesisMoves) and enrages at half HP.
Shared basics (slash, leap, charge, rain, breath, fanshot, lob, spin, roar, puddle, trap) + one signature move each
(rootspike, dive/snatch, boomerang, beam/lure, summon, slimesurge, vanish, shell, burrow, heatwave, skewer, finslide).
Story speaker 'foe'. Checks: tests/nemesis.test.ts; `npx vite-node scripts/nem-diag.ts 4-5 Toastbat` (what hurts);
`node scripts/nemesis-shot.mjs` (screenshots).

## Interactive maps (stages.ts interactive(), world.ts stepProps)
Seeded per stage, the same for everyone: breakable crates (2 hits, crumbs, sometimes a box) and jars (heal 8%), a moving
tray from World 2 on, a ladle lever on stages 3/7 (drops a rolling pin on the stretch ahead), runaway pressure cookers on
stages 4/6/8/9 (can't be hurt; your hits shove them; they explode near anything — lure monsters in), and a secret ledge
on stages 2/4/6/7/8/9 (fades in when near; jump onto the sponge under its end to bounce up) with a chest. Stage 7's chest
holds the World Key → that world's secret bonus stage (BONUS_STAGES, S-1..S-4, button on the stage card).
Checks: tests/props.test.ts, `node scripts/props-shot.mjs`.
Objectives (stage.objective, world.ts stepObjective): stage 4 escort the lost Crumblet (follows you, monsters hurt it,
the exit needs it there), stage 6 fetch the Recipe Scroll within 75 s then hold out 25 s, stage 8 survive 45 s of waves.
Completing one adds a bonus Bento. Checks: tests/objectives.test.ts, `node scripts/objective-shot.mjs`.

## More story (src/story/more/k<species>.ts, src/story/banter.ts)
A short punny scene before every stage that has none (beats w{N}-s{2,3,4,6,7,8,9}, 336 in all), skippable with the
"FULL STORY / KEY SCENES ONLY" toggle on the stage card (save.storyMode). In stages, speech bubbles that don't pause play:
each monster kind taunts the first time it's on screen (TAUNTS), your kaiju quips on big combos, low HP, perfect dodges,
level-ups, secrets, explosions, mimics and objectives (QUIPS). Checks: tests/banter.test.ts, `node scripts/banter-shot.mjs`.

## Story voice
All dialogue follows docs/VOICE.md (cartoon characters talking: interjections, sound effects, catchphrases, ham-fisted
puns; no em dashes, dry narrator punchlines or explained morals). Each kaiju's arc + nemesis scenes: src/story/arcs/k<sp>.ts;
between-stage scenes + quips: src/story/more/k<sp>.ts; monster taunts: src/story/banter.ts. tests/voice.test.ts guards it.

## Smarter monsters + Nightmare (world.ts)
Melee monsters take turns (maxAttackers: 2, Nightmare 3 — the rest circle at range), split up to flank both sides of
you (flankSide) and only attack once round, shield carriers stand between you and a healer, and three full plain combos
in a row (two on Nightmare) make nearby monsters raise their guard (guardT: plain combo hits do 15% until you mix in a
launcher, Guard Break, air attack or skill). Nightmare (per world, after its boss on Hard): Hard's levels, ×1.2 HP,
×1.25 damage (NIGHTMARE), 28% shorter telegraphs, extra modifiers, a Golden Cloche every clear.
`npx vite-node scripts/balance.ts 3- 2 nightmare`. Tests: tests/ai.test.ts.

## Learnable bosses (mobs.ts BOSS_PATTERNS / BOSS_ARMOR)
World bosses fight in fixed strings (a close one or a far one, by where you stand), then are TIRED for 1.6 s (+25%
damage). Phases at 50% and 25% (new moves, "FINAL PHASE!"). Armour (HUD bar under its HP) softens hits until it breaks
(heavy hits ×2.5): stagger + 5 s weak (+50%), then it grows back. Nemeses cycle their moves in order and tire after each
round. Tests: tests/boss.test.ts. `node scripts/boss-shot.mjs 2-10`.

## Arena rooms + set pieces (stages.ts setPieces, world.ts stepSetPieces)
Arena rooms on stages 2/3/7/9: ladle gates shut when you walk in, three designed waves (warm-up; a team that needs a plan —
protected healer, snipers behind a charger, a swarm with a bomber, or everything — then the world's elite with backup),
gates open + a Bento; the exit needs every arena done. Stage 2: a giant rolling pin chases you (88% of your kaiju's speed,
flattens monsters). Worlds 2–4 stages 6/9: conveyor belts. Stages 8/9: a moving-tray gauntlet to the secret ledge where
there's room. Tests: tests/setpieces.test.ts; `node scripts/setpiece-shot.mjs`.

## Party / multi-hero (world.ts heroes[], tests/party.test.ts)
The sim runs 1–4 heroes: `new World(..., party: Derived[], humans)`, `step([input0, input1, ...])`. `world.hero` is the
hero the current code is about (the one stepping, a monster's target, a shot's owner) and is the player between steps.
Monsters target the nearest standing hero (turn-taking per target); downed heroes are revived by a teammate standing
next to them for 2 s and only a full wipe fails the stage; monster HP +60% per extra player (+35% per CPU buddy);
stragglers are leashed back; each human gets their own drops (lootOf); arenas pull everyone in; the rolling pin paces
the slowest; rank / combo / style only count the player. `world.snapshot()` = compact JSON state for online play later.
CPU buddy: pick on the stage card (save.buddy); it fights at your level (buddyProfile) driven by `new Bot(w, AVERAGE, seed, 1)`,
revives you and follows you. `node scripts/buddy-shot.mjs`.

## Online co-op (src/net, src/ui/online.ts, tests/net.test.ts)
Camp map → 🌐 ONLINE: host a room (4-letter code) or join one; up to 4 players, each with their own kaiju, level and gear
(`kitOf` sends a trimmed HeroProfile). Same netcode as Kitchen Kaiju: PeerJS direct link first, MQTT public-broker backup
route if that fails (`?net=backup` forces it). The host runs the only real World (`party` = friends' kits,
`humans` = player count) and feeds friends' inputs into `step([...])`; ~15 snapshots/s (8 on the backup route) via
`makeSnapshot`; guests copy them into a drawing-only World with `applySnapshot` + `world.view(seat)`.
Online stages skip story twists, nemesis and spicy rules (same stage for everyone). Everyone brings their own quick bag
and Second Helpings (`Kit.bag`/`revives`, World `partyBags`; snapshot `bg` sends the counts back, each device writes its own).
A friend who drops mid-stage is handed to the CPU; a friend who levels up sends a new kit (`setDerivedOf`).
After a stage everyone gets their own loot and goes back to the room. Test: `node scripts/online-shot.mjs [backup]`.
FREE PLAY ONLINE: the host picks Daily Dungeon / Endless Pantry / Boss Rush in the room ("Play"); monsters scale to the
average party level. The host generates each stage and sends it whole (`NetFree`, `launch()`), health carries over by player;
in Endless the host picks the perk for the whole team (friends see `waitPerk`), `freeEnd` when the host banks. Each device
banks its own boxes and records its own bests. QUICK CHAT: 💬 button or keys 7 8 9 0 (`EMOTES`, msg `emo`, the host relays).
The HUD lists every teammate (red when down); a teammate's name tag sticks to the screen edge with an arrow when off screen.
Tests: tests/coop.test.ts, `node scripts/online-free-shot.mjs` (Endless 2 floors + Boss Rush, two browsers).

## Gear that plays (src/sim/gear.ts, items.ts PROCS / SIGS, tests/gear.test.ts)
- GEAR SKILL: every weapon has its own move on a 4th button (touch GEAR, keys F / H): throw / lob (aims at the nearest
  monster) / roll / slam / rain your actual weapon icon, plus a twist (burn, freeze, glue, slow, launch, pull, heal).
  Power scales with rarity × fortification × grade; bosses take 40% from it (balance). `world.castGear`, shots carry `icon` + `fx`.
- PROCS on Rare+ armour / charms (`Item.proc`): Jam Trap, Static Whisk, Bubble Wrap, Pineapple Skin, Snack Break,
  Sugar High, Brain Freeze, Belly Flop.
- SIGNATURE LEGENDARIES: 2 per kaiju (weapon + armour, own `u-*` icons) that upgrade one of its skills via `SkillMod`
  (`applyMod`: dmg / reach / cd / n / burn / freeze / glue / slow / leech / echo). They roll on that kaiju's gear, more
  often for the kaiju you play. Art: `node scripts/sig-jobs.mjs`. Screens: `node scripts/gear-shot.mjs`.


## World 5: The Sink (Act 1 finale)
Stages 5-1..5-10 (WORLDS[4]: plate / bubble / mug / eel / glove / scrub, faucet hazard `tap`, map-sink), final boss
**The Mold Crown** (`moldking`: spore rain, Sporelings (`calls`, max 4), floor tendrils, mould puddles; 3 phases).
After 5-10: the kaiju's ending (`w5-after`: still-w5-cure then still-<sp>-end), the credits roll (src/ui/credits.ts),
then the post-credits tease of Act 2's villains, THE LEFTOVERS (src/story/finale.ts, speakers 'lo'/'lo2', still-w5-hook).
Deep Clean set (ilvl 49+), S-5 bonus stage. Story brief for writers: docs/WORLD5-BRIEF.md. Art: `node scripts/w5-jobs.mjs`.
Screens: `node scripts/w5-shot.mjs`. Damage diagnosis: `npx vite-node scripts/dmg-diag.ts 5-6 11`.

## Free Play (src/sim/free.ts, src/ui/free.ts, camp tab "Free Play", opens after 1-10)
- **Daily Dungeon**: `dailyStage(dayKey, heroLv)`: a world theme and stage shape picked by the date (same for everyone),
  monsters at your level (`StageDef.power` = `powerFor(lv)`, the story curve), no World Keys. Bonus Golden Cloche once a day.
- **Endless Pantry**: `endlessFloor(floor, heroLv, seed)`: an arena room per floor (elite every 5th, a world boss every 10th),
  +0.8 level and +2% power per floor; pick 1 of 3 `PERKS` after each floor (`withPerks`), health carries over; a box per floor
  (banked at once), "bank it & stop" any time. Best floor per kaiju in `save.free.endless`.
- **Boss Rush**: `rushStages(beaten, heroLv)`: every boss this kaiju has beaten, back to back, half your health back between
  fights; best time in `save.free.rush`; a Legendary box for finishing.
GameScene runs it from `data.free` (`FreeRun`) and `finishFree()` chains the stages. Balance: `npx vite-node scripts/free-balance.ts`
(bot: daily 59-83% clears, Endless median 9 floors, Boss Rush 29-38%). Screens: `node scripts/free-shot.mjs`.

## Act 2: Beyond the Kitchen — World 6: The Dining Room
WORLDS[5] (Lv 61-70, level cap now 70): fork / napkin / candle / gravy / teapot / roast (+ crouton squires), hot-wax hazard
`wax` (drip + sticky puddle), boss **Sir Stale** (`stale`, Leftovers lieutenant: lance charges, crumb volleys, crouton
summons). Act 2 nemeses have retired: stage x-5 is a plain elite from World 6 on and `w6-elite` is a friendly cameo.
Leftovers roster (for later worlds): W7 Backyard BBQ Baron Brussels, W8 Garden the Mystery Meatloaf, W9 Supermarket the
Tupperwraith, W10 Old Fruitcake. 'lo2' (Sir Stale) speaks with his boss art in Act 2 scenes. Brief: docs/WORLD6-BRIEF.md.
Art `node scripts/w6-jobs.mjs [stills]`, screens `node scripts/w6-shot.mjs`.

## Act 2 kaiju: Avocadrake (13) and Tacowl (19)
Recruited by beating the Mold Crown / Sir Stale (UNLOCKS); start at 1-1 with their own full stories ("Holy Guacamole",
"Taco 'Bout Tuesday", written from docs/NEWKAIJU-BRIEF.md) and nemeses El Nacho (`nnacho`, signature Queso Yank `yank`)
and Señor Sting (`nhornet`, Triple Sting `stingers`). New skill kinds: `pitbounce`, `guac` (zone that heals heroes),
`gust`, `drop`, `screech`, `volley`, ults `guacflood`, `fiesta`. Rigs: Avocadrake holds its weapon in a foot, Tacowl flies
(wings tucked behind the shell, weapon in a talon). Gear w-/a-/k-avo, w-/a-/k-owl, 2 signature legendaries each.
Art: `node scripts/newkaiju-jobs.mjs`.

## World 7: The Backyard BBQ + Bubblegumbo (9) and Velvaroo (18)
WORLDS[6] (Lv 71-80, level cap 80): wasp / corn / ketchup / beetle / charcoal / patty (+ sprout soldiers), lawn
`sprinkler` hazard (launch + slick puddle), boss **Baron Brussels** (`brussels`: stink puddles, sprout summons, charcoal
rain). Stage generation keeps hazards away from bouncy sponges (bot loop fix). Fetch timer 100 s from World 7.
Bubblegumbo: `bubbletrap` (world.bubbles: sealed monsters are helpless, then pop), ricocheting `gumball`, two-way
`trumpet`, ult `megabubble`; nemesis Brittle (`nmouse`, signature `scurry`). Velvaroo: landing-driven `hops`, `flurry`,
aimed `cakebomb` (frosting slow patch), ult `tko`; nemesis Rocky Road (`ngorilla`, signature `haymaker`, a danger move).
Unlocks: Baron Brussels / 25 Burger Brutes. Briefs: docs/WORLD7-BRIEF.md, docs/NEWKAIJU2-BRIEF.md. Art: `node scripts/w7-jobs.mjs [stills]`,
`node scripts/newkaiju2-jobs.mjs`. Screens: `node scripts/w7-shot.mjs`.

## World 8: The Garden + Sloba (12) and Minturtle (16)
WORLDS[7] (Lv 81-90, level cap 90): snail / ladybug / peapod / mole / tomato / radish / pumpkin (+ mystery chunks), `pollen`
hazard (sting + sticky patch), boss **The Mystery Meatloaf** (`meatloaf`: borrows breath / spores / crumbs, chunk summons).
Hazards next to bouncy sponges are slid to a free spot (`awayFromSponges`). Sloba: `swing`, `nap` (heals then shockwave),
`slowtime`, ult `snooze`; nemesis Jitters (`nbird`, `zip`). Minturtle: aimed freezing `scoop`, `wall` (world.walls block
monsters and mob shots), `chipstorm`, ult `sundae`; nemesis Hot Fudge Hare (`nhare`, `boomhop`). Briefs: docs/WORLD8-BRIEF.md,
docs/NEWKAIJU3-BRIEF.md. Art: `node scripts/w8-jobs.mjs [stills]`, `node scripts/newkaiju3-jobs.mjs`. Screens: `node scripts/w8-shot.mjs`.

## World 9: The Supermarket + Bloblin (3) and Salmonster (14)
WORLDS[8] (Lv 91-100, level cap 100): trolley / bag / scanner / banana / can2 / melon (+ lost lids), freezer-door `chill`
hazard (push + ice slick), boss **The Tupperwraith** (`tupper`: lid boomerangs, murky puddles, lid summons). The bot now goes
back for the Recipe Scroll if it rode past it (fetch stages were undercounted). Bloblin: `jiggle` (glue splat), bouncing
`clones`, `wobble` (burst + 40% DR + reflect), ult `jellyquake`; nemesis Grey Gelato (`ngelato`, `drip`). Salmonster:
`upstream`, `tide` (carries monsters), wavy `salmon`, ult `salmonrun`; nemesis Grizzly Grizzle (`nbear`, `swipe`). All 20
Kitchen Kaiju cast are now playable. Briefs: docs/WORLD9-BRIEF.md, docs/NEWKAIJU4-BRIEF.md. Screens: `node scripts/w9-shot.mjs`.
Note: run one gem-gen at a time (two jobs in the same Gemini tab can swap images).

## World 10: The Feast of the Forgotten (Act 2 finale)
WORLDS[9] (Lv 101-110, level cap 110): the Leftovers' army (fork / beetle / snail / scanner) + candied cherry soldiers,
candied peel bats and Fruitcake Knights; final boss **Old Fruitcake** (`fruitcake`: every lieutenant's trick + candied fruit
storm). After 10-10: `w10-after` (still-w10-cure while he speaks, then the shared feast still-w10-end), the Act 2 credits
(`credits2` → showCredits(sp, done, 2)), then the teaser `w10-hook` (src/story/finale.ts HOOK2, still-w10-hook: an invite to
the Great Food Festival). World numbers can be two digits now (beat regexes use \d+). Brief: docs/WORLD10-BRIEF.md.
Screens: `node scripts/w10-shot.mjs`.

## Kaiju balance (src/sim/stats.ts SCALE, scripts/kaiju-diag.ts, scripts/bal-sum.mjs)
Main stats scale evenly into the late game: INT's skill bonus is measured against the level (`SCALE.int / (1 + intLv·(lv-1))`),
STR also multiplies attack a little (`SCALE.str`), DEX past the 75% crit cap becomes crit damage (`dexOver`), every kaiju gets
`hpLv` HP per level, and damage reduction past 70% counts for less (`drSoft`/`drOver`). The escorted Crumblet shares most of
your damage reduction. The balance bot steps out of (and waits at) firing hazards like a player would.
Full sweep: `for w in 1 2 3 4 5 6 7 8 9 10; do npx vite-node scripts/balance.ts $w- 3 > shots/bal/w$w.txt & done`, then
`node scripts/bal-sum.mjs` (per-kaiju clear % by world, stages outside target, bot timeouts). Why is a kaiju weak:
`npx vite-node scripts/kaiju-diag.ts [stages] [bosses] [runs]` (DPS, HP lost per minute, boss kill time). Stats: `scripts/stat-table.ts`.
EVENING THE KAIJU: `src/sim/kaijuTune.ts` holds a small HP / attack multiplier per kaiju (global offset in `SCALE.hpAll` /
`dmgAll`). `node scripts/kaiju-tune.mjs [rounds]` benchmarks all 20 in parallel (`scripts/kaiju-bench.ts`: every boss ×10,
nine stages ×4, stuck-bot timeouts ignored) and nudges each toward ~55% boss clears; `--dry` just reports. Re-run it after
changing a kaiju's skills or stats. Healing skills only get up to 25% cooldown reduction; Soup Slurp heals at most 12% a cast.
Stage rules: monsters never start on the top tier, brutes never on ledges; the bot hops off ladders level with its target.
Probes: `scripts/stage-probe.ts <stage> <species>` (layout + where the bot ends up), `scripts/heal-probe.ts <stage> <species>`.
HARD / NIGHTMARE CHECKS: `npx vite-node scripts/balance.ts <world>- 3 hard|nightmare` (the hero comes back 3 / 6 levels over),
`sh scripts/bench-all.sh hard|nightmare [stages]` (all 20 kaiju in parallel). Fighting above your level: monsters more than
`LV_GAP.free` (4) levels over you take `LV_GAP.per` (6%) less damage per level. Bosses on Nightmare get NIGHTMARE_BOSS (×1.1 HP,
×1.12 damage) instead of NIGHTMARE (×1.2 / ×1.25). Targets used: Hard stages ~75-90% / bosses ~30-50%; Nightmare stages
~55-75% / bosses ~20-40%.

## Weapon twists (items.ts TWIST_*, gear.ts gearSkillOf)
Most weapon drops (65%, not signature legendaries) roll a twist: a new gear-skill style (throw / lob / roll / slam / rain)
and usually an effect (burn / freeze / glue / slow / launch / pull / heal). The weapon is named for it ("Frosty Rolling Pin")
and its gear skill becomes e.g. "Frosty Pin Lob". Each kaiju's 2nd / 3rd weapon tier now drops from item level 6 / 14
(was 12 / 24). Screen: `node scripts/twist-shot.mjs`.
NEW WEAPON TYPES: every kaiju has 2 more weapons (BASES `w-<ref>a` from item level 0, `w-<ref>b` from 6), each with its own
gear skill, mostly the newer styles: BOOMERANG (out and back, hits both ways, shot kind `gearboom`), BURST (eight copies in a
star, `gearburst`) and TRAP (planted on the floor, snaps the first monster: a Mine with `icon` + `fx`). Twists can roll these
styles too. Icons: `node scripts/weapons2-jobs.mjs` → gem-gen → `npm run art`; review with `node scripts/icon-sheet.mjs`.
Screens: `node scripts/gearstyle-shot.mjs`. Lobbed hero shots (Berry Mines, mustard goo, lobbed gear) remember the height they
were thrown from (`Shot.fromY`) and fall through ledges above it, so they land among the monsters (tests/berry.test.ts).

## Painted story scenes (stories.ts stillFor, ui/story.ts)
- 70 shared scenes `still-w<N>-s<n>` for the short scene before stages 2-4 and 6-9 of every world (the rolling-pin chase, the
  arena, the lost Crumblet, the Recipe Scroll, the secret chest, the horde, the boss lair ahead). The left third is kept clear:
  your kaiju's portrait stands there. Jobs: `node scripts/scenes-jobs.mjs`.
- 200 per-kaiju scenes `still-<sp>-w<N>-elite` for the stage-5 beat: Worlds 1-5 a standoff with the kaiju's nemesis, 6-10 the
  nemesis as a friend pointing at the world's elite. Both are painted in, so their portraits hide. Jobs: `node scripts/elite-jobs.mjs`.
  These aren't precached (vite.config.ts globIgnores): they download when first shown and are then cached for offline play.
- Generate with `sh scripts/gem-batch.sh <jobs.json> <log>` (one job at a time, a time limit each, skips art that exists,
  resumable). Review with `node scripts/icon-sheet.mjs <jobs.json> --wide`. Prompts must not name characters (Gemini drew a
  famous cartoon for "Finn") or places (it paints the name as text). Screens: `node scripts/story-shot.mjs`.
- A scene whose painting is missing falls back to portraits (the story player reads art/manifest.json).

## Testing tools (see docs/PLAYTEST.md)
- Chaos: `src/sim/chaos.ts` (random-input bot + rules), `npx vite-node scripts/chaos.ts [world-] [s] [seeds]`, replay one report with
  `scripts/chaos-trace.ts <stage> <species> <seed>`; tests/chaos.test.ts runs a slice on every push. Runs are deterministic
  (entity ids restart per World).
- Saves: `npx vite-node scripts/save-fuzz-gen.ts` + `node scripts/save-fuzz.mjs` (every screen x 60 random/odd saves).
  Loading repairs saves (unknown item types dropped, broken levels fixed).
- Visual: `node scripts/visual-check.mjs [--update]` against tests/visual-baseline/.
- Performance: `node scripts/perf-check.mjs [cpuSlowdown]`, `node scripts/perf-profile.mjs [stage]`.
- In game: 🐞 REPORT A BUG (camp, pause, title) copies a report (version, kaiju, stage position, last errors); every uncaught
  error is logged (src/ui/report.ts).

## Settings and tips
- `src/ui/settings.ts` (⚙ in camp and pause, stored in 'kkq-settings' so START OVER keeps them): sound and music volume,
  screen shake, flashes, text size, touch button size, story scenes, tips, low effects (fewer particles, damage numbers only for
  crits and hits on you).
- `src/ui/tips.ts`: a guided start on a kaiju's first 1-1 (move, jump, attack, dodge, skill, gear) and one-time tips (ladder,
  dropping through, arena, hazard, sponge, low health, Crumblet, Recipe Scroll, boss, exit), remembered in save.tips.

## Gear variety 2
8 more armour/charm effects in PROCS (Meringue Guard, Popcorn Burst, Syrup Slide, Pepper Breath, Second Scoop, Quick Draw,
Snack Bite, Crumb Magnet; tests/procs2.test.ts), a kaiju armour each with a built-in effect (`a-<ref>x`, item level 6+) and 8
charms with a built-in effect (`BaseDef.proc`). Icons: `node scripts/gear2-jobs.mjs`.

## Skill trees (src/sim/tree.ts)
Each kaiju has 3 paths × 7 rows (stat, stat, NEW SKILL at 5 points, stat, an upgrade to an original skill at 10, a capstone at 15,
a 10-rank mastery at 18): 84 points, more than a Lv 110 kaiju earns, so you choose. New skills reuse proven skill templates
with their own numbers. 3 skill buttons: pick from the 3 originals + learned tree skills (HeroProfile.loadout, Skills tab →
⚔ SKILLS). Recipe Scroll refunds tree points. Monsters grow `TUNE.treeRamp` per level past 20 to absorb the extra power.
Tests: tests/tree.test.ts; screen: `node scripts/tree-shot.mjs`.

## Late-game gear tiers
Every kaiju has weapon and armour tiers 4 (item level 40) and 5 (item level 75): BASES `w-<ref>4/5`, `a-<ref>4/5`, part of
the kaiju's signature set, each weapon with its own gear skill (gear.ts). TIER_LV = [0, 6, 14, 40, 75]. Icons:
`node scripts/gear3-jobs.mjs` then `sh scripts/gem-batch.sh art-src/jobs-gear3.json shots/gem-gear3.log`. Tests: tests/gear-late.test.ts.

## Long stages (5-10 minutes), tough difficulty, levelling (playtest fixes)
- **Sections** (stages.ts `genLong`, `RECIPE`): every story stage is a run of sections: field / swarm / snipers / heavies
  / dark (lights out) / arena / tower (a climb) / gauntlet (hazards + trays) / conveyor / treasure (crates + mimics) /
  ambush (monsters drop in from above: `MobSpawn.wake` + y < 0) / mini (miniboss room) / gate (pull its lever up on a
  ledge: `StageDef.gates`, `Prop.gate`) / chase / lever / holdout, then a finale. Each stage number has its own recipe plus
  2-3 random extras, so no two stages play alike. Shooters and flyers are capped at about a third of a stretch.
  The exit only needs the last ~2600 px cleared (stragglers far behind don't block it). Fetch / hold-out timers start
  near the end (`Objective.at`). The Crumblet heals when left alone and shelters behind arena gates.
- **Boss stages**: a run-up, then the boss room; the boss sleeps until you walk in (backdrop and music switch:
  `StageDef.bossBg`, event `bossWake`); 3 honey jars by the door. Boss Rush / Endless use the room alone (`short`).
- **Minibosses**: 20 new ones (2 per world, `m<world>a/b`, art `scripts/minis-jobs.mjs`) guard miniboss rooms; each world's
  stage-5 elite is now a champion (`x<elite>`) with its own moves; arena finales use a random champion of the world's
  monsters. They keep strictly to their move order (walking in for close-range moves).
- **Difficulty** ("tough": jams needed): tuned against a SKILLED bot (bot.ts) carrying 8 jams: stages clear ~85-95% using
  3-4 jams, bosses ~45-90%. `WorldDef.mobPow` evens worlds out, Act 2 ordinary monsters hit harder (`lateHit`), Nightmare
  eases off in Act 2. Tools: `JAMS=8 sh scripts/sweep-all.sh 1 normal skilled` then `node scripts/sweep-sum.mjs` /
  `node scripts/sweep-kaiju.mjs`; `scripts/fail-why.ts <stage>`; `scripts/stuck-check.ts <stage>`.
- **Levelling**: `xpFor` is steeper (long stages give far more XP); one pass of the story keeps you about at each stage's
  recommended level (`scripts/progress-sim.ts`). Skill ranks need hero levels (`rankLv`: unlock + 6 per rank) and so do
  tree nodes (`ROW_LV`, +4 per rank), so a kaiju can't max its skills in World 1.
- Performance: monsters far off-camera aren't drawn. Screens: `node scripts/sections-shot.mjs`.

## Map stages, boss loot, challenges, boss weapons (Lunia / MapleStory style)
- **Maps** (stages.ts `genMaps`, World `mapAt` / `tryPortal` / `stepMapZones`): every story stage is a camp hub, three
  zones and a boss room, side by side in one world, walled off, joined by portals (press up). Each zone has a goal
  (`ZoneGoal`): collect a named monster's quest drops (45% per kill, never 3 misses in a row; the monster respawns),
  free caged Crumblets (`cage` props), smash mould nests (`nest` props that hatch monsters), clear an arena, race for the
  Recipe Scroll (stage 6) or hold out (stage 8). All three open the boss door: the stage's miniboss (stage 5: the elite
  or your nemesis; stage 10: the world boss) with `MINI_ROOM_HP` health. Arriving at camp heals you (and the escorted
  Crumblet, which waits at camp until the boss room). Zones are built from the section kit (`sectionKit`).
- **Loot**: ordinary monsters drop no boxes (crumbs and quest items); the boss-room miniboss 1, a world boss 2, chests 1,
  mimics 1; the end chest holds rank-many boxes (S 3, A 2, else 1; +1 for a world boss). Rank: time vs par, hits taken
  per minute, jams drunk (`RunStats.heals`), combo and style.
- **Challenges** (src/sim/challenges.ts): 3 per stage, each pays crumbs + a box once and gives a star; 15 stars in a world
  open its secret stage (`STARS_FOR_SECRET`).
- **Boss weapons** (src/sim/bossgearData.ts): 200, one per kaiju per world boss (`bw-<boss>-<ref>`), each with its own
  gear skill: one of 20 styles (12 new: orbit, dash, chain, meteor, vortex, turret, spin, wave, shield, barrage, pillar,
  bounce) + the boss's element (incl. new poison / shatter / crumbs). Dropped by the world boss for the kaiju you play:
  18% (+rank / mode), guaranteed by the 5th clear (`save.bwPity`). Icons: scripts/bossgear-jobs.mjs. Tests:
  tests/bossgear.test.ts.
- Balance (skilled bot, 8 jams): stages 85-97% clear with 2-4 jams, bosses 40-80%; bot stage time 4-7 min.
