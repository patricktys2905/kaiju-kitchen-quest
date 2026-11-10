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
Online stages skip story twists, nemesis and spicy rules (same stage for everyone); only the host has potions.
A friend who drops mid-stage is handed to the CPU; a friend who levels up sends a new kit (`setDerivedOf`).
After a stage everyone gets their own loot and goes back to the room. Test: `node scripts/online-shot.mjs [backup]`.

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
