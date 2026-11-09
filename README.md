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
