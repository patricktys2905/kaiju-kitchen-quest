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
Phone: left thumb anywhere on the left = stick (run, ↑↓ climb, ↓+JUMP drop down); ATTACK, JUMP, 3 SKILL buttons.
Keys: arrows/WASD, Space/K jump, J attack (tap 3× for a combo), L / I / O skills, Esc pause.

## Systems (src/sim)
- stats.ts — level/XP curve, STR/DEX/INT/VIT (+3 points per level), derived combat numbers.
- skills.ts — 3 actives (unlock Lv 1/4/8) + 1 passive (Lv 6) per kaiju, skill levels 1-5 (+gear bonus).
- items.ts — gear slots (weapon/armor/charm), rarities, random lines, skill boosts, salvage + enhance costs.
- loot.ts — box tiers Paper Bag → Lunchbox → Bento → Golden Cloche → Rainbow Cake Box.
- mobs.ts — monsters (walker/hopper/ranged/brute/boss) scaled by level; stages.ts — World 1 (1-1 … 1-4 boss).
- src/save.ts — save (localStorage kkq-save-v1), box opening, stage results (rank upgrades boxes).
- src/ui/camp.ts — camp menus + gacha reveal + result screen.
