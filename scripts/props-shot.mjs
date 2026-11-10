// Interactive props in a real stage: node scripts/props-shot.mjs → shots/props-*.png
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5317, url = `http://localhost:${PORT}/?touch`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const ctx = await b.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: Number(process.argv[2] ?? 1), isMobile: true, hasTouch: true });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push(e.message));
await p.goto(url);
await p.evaluate(() => localStorage.clear());
await p.reload();
for (let i = 0; i < 60; i++) { if (await p.evaluate(() => !!window.__kkq).catch(() => false)) break; await wait(250); }
await p.evaluate(() => document.querySelector('#title .play')?.click());
await wait(600);
await p.evaluate(() => { const s = window.__kkq.save; s.heroes[0].level = 20; });
// 1) stage 2-7: secret ledge + chest above a sponge, a moving tray, crates
await p.evaluate(() => window.__kkq.play('2-7'));
await wait(1500);
await p.evaluate(() => {
  const w = window.__kkq.world(), h = w.hero;
  const chest = w.props.find(q => q.kind === 'chest');
  h.inv = 99; h.x = chest.x - 90; h.face = 1;
});
await wait(900);
await p.screenshot({ path: 'shots/props-secret.png' });
// bounce: stand on the sponge
await p.evaluate(() => { const w = window.__kkq.world(), h = w.hero; const s = w.props.find(q => q.kind === 'sponge'); h.x = s.x; h.y = w.stage.groundY - 70; h.vy = 0; h.ground = false; h.on = null; h.state = 'air'; });
await wait(350);
await p.screenshot({ path: 'shots/props-bounce.png' });
// 2) stage 1-6: a runaway pressure cooker next to monsters
await p.evaluate(() => window.__kkq.play('1-6'));
await wait(1500);
await p.evaluate(() => {
  const w = window.__kkq.world(), h = w.hero, c = w.cookers[0];
  h.inv = 99; h.x = c.x - 220; h.face = 1;
  for (let i = 0; i < 3; i++) { const m = w.spawnMob('bun', c.x + 40 + i * 30, 5); m.state = 'hurt'; m.t = -2; }
  for (const q of w.props.slice(0, 2)) { q.x = h.x + 70 + w.props.indexOf(q) * 60; q.y = w.stage.groundY; }
});
await wait(500);
await p.screenshot({ path: 'shots/props-cooker-fuse.png' });
await wait(800);
await p.screenshot({ path: 'shots/props-cooker-boom.png' });
// 3) camp map with a key: the secret stage button
await p.evaluate(() => { window.__kkq.save.keys = [1]; window.__kkq.save.heroes[0].cleared['1-6'] = 'A'; window.__kkq.scene.scene.restart({}); });
await wait(1000);
await p.evaluate(() => document.querySelector('[data-node="1-7"]')?.click());
await wait(400);
await p.screenshot({ path: 'shots/props-map.png' });
console.log(errs.length ? errs : 'no errors');
await b.close();
server.kill();
process.exit(0);
