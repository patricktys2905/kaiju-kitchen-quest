// Phone screenshots (844x390 @ DPR) of the stage, plus a pose sheet per hero.
// Usage: node scripts/shot.mjs [dpr]   (uses the dev server on a spare port; installed Edge)
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
for (let i = 0; i < 60; i++) { if (await p.evaluate(() => !!window.__kkq).catch(() => false)) break; await wait(250); }
await wait(1500);
await p.screenshot({ path: 'shots/stage.png' });
// walk right and attack a bit
await p.evaluate(() => { const w = window.__kkq.world(); const m = w.mobs.find(m => m.on === -1); w.hero.x = m.x - 55; w.hero.face = 1; m.state = 'hurt'; });
 await wait(400);
for (let i = 0; i < 6; i++) { await p.keyboard.press('KeyJ'); await wait(110); }
await wait(80);
await p.screenshot({ path: 'shots/combat.png' });
await p.keyboard.press('KeyL'); await wait(250);
await p.screenshot({ path: 'shots/skill.png' });
// pose sheet: each hero in each pose
const poses = [['move', 0.3], ['run', 0.2], ['air', 0.1], ['attack', 0.25], ['attack', 1.6], ['attack', 2.5], ['skill', 0.2], ['hurt', 0.1]];
for (const [i, sp] of [0, 10, 11, 4].entries()) {
  await p.keyboard.press(`Digit${i + 1}`); await wait(300);
  for (const [j, [st, t]] of poses.entries()) {
    await p.evaluate(([st, t]) => window.__kkq.setPose(st, t), [st, t]);
    await wait(60);
    const pos = await p.evaluate(() => { const s = window.__kkq.scene, h = window.__kkq.world().hero, cam = s.cameras.main; const m = cam.getWorldPoint(0, 0); return { x: (h.x - m.x) * cam.zoom, y: (h.y - m.y) * cam.zoom }; });
    const k = 844 / 1920; // canvas → css px (FIT, landscape fills width)
    const off = (390 - 1080 * k) / 2;
    await p.screenshot({ path: `shots/pose-${sp}-${j}.png`, clip: { x: Math.max(0, pos.x * k - 70), y: Math.max(0, pos.y * k + off - 120), width: 140, height: 135 } });
  }
  await p.evaluate(() => { window.__kkq.scene.paused = false; });
}
console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no page errors');
await b.close(); server.kill();
