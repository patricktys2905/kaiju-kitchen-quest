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
Phone: left thumb anywhere on the left = stick (run, ↑↓ climb, ↓+JUMP drop down); ATTACK, JUMP, SKILL.
Keys: arrows/WASD, Space/K jump, J attack (tap 3× for a combo), L skill, 1-4 switch hero.

## Box tiers
Paper Bag → Lunchbox → Bento → Golden Cloche → Rainbow Cake Box (`src/sim/loot.ts`).
