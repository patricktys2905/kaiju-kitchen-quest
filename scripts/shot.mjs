// Phone screenshots (844x390) of camp, a stage, combat, the boss, gacha, plus a pose sheet per hero.
// Usage: node scripts/shot.mjs [dpr]   (dev server on a spare port; installed Edge; fresh save each run)
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5311, url = `http://localhost:${PORT}/?touch`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const ctx = await b.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: Number(process.argv[2] ?? 1), isMobile: true, hasTouch: true });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push(e.message));
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await p.goto(url);
await p.evaluate(() => localStorage.clear());
await p.reload();
for (let i = 0; i < 60; i++) { if (await p.evaluate(() => !!window.__kkq).catch(() => false)) break; await wait(250); }
await wait(1200);
await p.screenshot({ path: 'shots/camp.png' });
const kq = (fn, arg) => p.evaluate(fn, arg);

// a levelled-up save so skills/gear show
await kq(() => { const s = window.__kkq.save; for (const h of Object.values(s.heroes)) { h.level = 9; h.statPts = 6; h.skillPts = 2; for (const id of Object.keys({})) void id; } s.boxes.push({ tier: 4, ilvl: 6 }, { tier: 3, ilvl: 4 }, { tier: 5, ilvl: 8 }); });
await kq(() => { const sk = { 0: ['seed', 'upper', 'jamspin', 'sweet'], 10: ['quake', 'mines', 'frost', 'thick'], 11: ['slice', 'pspin', 'frenzy', 'hot'], 4: ['bolt', 'fan', 'nova', 'soft'] }; for (const [sp, ids] of Object.entries(sk)) for (const id of ids) window.__kkq.save.heroes[sp].skills[id] = 2; });
await p.locator('[data-tab=skills]').click(); await wait(300);
await p.screenshot({ path: 'shots/camp-skills.png' });
await p.locator('[data-tab=hero]').click(); await wait(300);
await p.screenshot({ path: 'shots/camp-hero.png' });
await p.locator('[data-tab=boxes]').click(); await wait(300);
await p.locator('[data-box="5"]').click(); await wait(400);
await p.screenshot({ path: 'shots/gacha-shake.png' });
await wait(1600);
await p.screenshot({ path: 'shots/gacha-reveal.png' });
await p.locator('[data-g=next]').click(); await wait(300);
await p.locator('[data-tab=bag]').click(); await wait(300);
await p.screenshot({ path: 'shots/camp-bag.png' });
await p.locator('[data-bag=items]').click(); await wait(300);
await p.screenshot({ path: 'shots/camp-items.png' });
await kq(() => { window.__kkq.save.crumbs = 2000; window.__kkq.save.cleared['1-1'] = 'A'; window.__kkq.save.cleared['1-2'] = 'S'; });
await p.locator('[data-tab=market]').click(); await wait(300);
await p.screenshot({ path: 'shots/camp-market.png' });
await p.locator('[data-tab=map]').click(); await wait(500);
await p.screenshot({ path: 'shots/camp-map.png' });

// stage 1-2 combat
await kq(() => window.__kkq.play('1-3'));
await wait(1500);
await kq(() => { const w = window.__kkq.world(); const m = w.mobs.find(m => m.on === -1); w.hero.x = m.x - 55; w.hero.face = 1; });
await wait(300);
for (let i = 0; i < 2; i++) { await p.keyboard.press('KeyJ'); await wait(120); }
await p.keyboard.press('KeyJ'); await wait(170);
await p.screenshot({ path: 'shots/combat.png' });
await p.keyboard.press('KeyO'); await wait(500);
await p.screenshot({ path: 'shots/skill.png' });

// boss
await kq(() => window.__kkq.play('2-3'));
await wait(1800);
await p.screenshot({ path: 'shots/world2.png' });
await kq(() => window.__kkq.play('1-10'));
await wait(2500);
await kq(() => { const w = window.__kkq.world(); w.hero.x = w.boss.x - 160; });
await wait(1200);
await p.screenshot({ path: 'shots/boss.png' });

// pose sheet: each hero in each pose
const poses = [['move', 0.3], ['run', 0.2], ['run', 0.6], ['air', 0.1], ['attack', 0.25], ['attack', 1.6], ['attack', 2.5], ['skill', 0.4], ['hurt', 0.1]];
for (const sp of [0, 10, 11, 4]) {
  await kq(sp => { window.__kkq.save.selected = sp; window.__kkq.play('1-1'); }, sp);
  await wait(900);
  for (const [j, [st, t]] of poses.entries()) {
    await kq(([st, t]) => window.__kkq.setPose(st, t), [st, t]);
    await wait(80);
    const pos = await kq(() => { const s = window.__kkq.scene, h = window.__kkq.world().hero, cam = s.cameras.main; const m = cam.getWorldPoint(0, 0); return { x: (h.x - m.x) * cam.zoom, y: (h.y - m.y) * cam.zoom }; });
    const k = 390 / 1080;
    await p.screenshot({ path: `shots/pose-${sp}-${j}.png`, clip: { x: Math.max(0, pos.x * k - 70), y: Math.max(0, pos.y * k - 120), width: 140, height: 135 } });
  }
}
console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no page errors');
await b.close(); server.kill();
