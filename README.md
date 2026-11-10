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

## Story nemeses (mobs.ts `nem`, src/story/nemesis.ts)
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
