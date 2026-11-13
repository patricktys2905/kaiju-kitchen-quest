# Playtest checklist (about 15 minutes, on a phone)

Something odd? Pause (☰) → **🐞 REPORT A BUG**, write what happened, then COPY or SHARE it. It already includes the
version, your kaiju, the stage and where you were standing, so you don't need to describe those.

## Every update
1. **Title screen**: the version in the bottom-right matches the newest one. If not, close the game fully and reopen.
2. **Ladders**: climb one halfway, then jump off left and right. You should always fall back to the floor.
3. **Ledges**: drop through a platform (↓ + jump) and walk off its edge. No floating, no getting stuck.
4. **Secret chest** (stage 7 of a world, on a high ledge at the far end of the second map): bounce on the sponge, open the chest, then get down every way you can.
5. **Skills**: use every skill and the ultimate on the ground, in the air, and on a ledge. Nothing hangs in the air.
6. **Gear button**: try your weapon's gear skill near a ledge and near monsters.
7. **Camp**: open every tab (Map, Free Play, Hero, Skills, Bag, Market, Boxes, Quests). None should show "hit a snag".
8. **Market**: buy something you can afford; tap something you can't (it should say how many crumbs you need).
9. **Story**: play a stage with a scene before it. The painting shows, the text is readable, SKIP works.
10. **Leave a stage** from the pause menu, and **finish one**: the result screen, loot and back to camp all work.

## Now and then
- **Online**: host a room on one phone, join from another, play a stage and a Free Play run together.
- **Hard / Nightmare**: one stage each after beating a world's boss.
- **Bonus stage**: find a World Key (stage 7 chest, or 15 challenge stars in that world) and play the secret stage, then visit the Market.
- **Long session**: play for 30+ minutes. Does the phone get hot or the game slow down?

## For whoever fixes things (`npm test` runs most of this automatically before every deploy)
- `npx vite-node scripts/chaos.ts [world-] [seconds] [seeds]`: random-input bot on every stage and kaiju, checking rules
  (no standing on air, no NaN, nothing through the floor, nobody trapped high up). `scripts/chaos-trace.ts` replays a report.
- `npx vite-node scripts/save-fuzz-gen.ts` then `node scripts/save-fuzz.mjs`: every screen with 60 random and odd saves.
- `node scripts/visual-check.mjs`: key screens vs `tests/visual-baseline/` (`--update` after an intended change).
- Balance: `scripts/balance.ts`, `scripts/bal-sum.mjs`, `sh scripts/bench-all.sh <mode>`, `node scripts/kaiju-tune.mjs`.
