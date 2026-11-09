// Big close-ups of one hero's rig in several poses (for fixing joints). Usage: node scripts/rig-shot.mjs <species> → shots/rig-<sp>.png
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
import sharp from 'sharp';
const sp = Number(process.argv[2] ?? 11), PORT = 5314;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 3 })).newPage();
await p.goto(`http://localhost:${PORT}/`);
for (let i = 0; i < 60; i++) { if (await p.evaluate(() => !!window.__kkq).catch(() => false)) break; await wait(250); }
await p.evaluate(sp => { window.__kkq.save.selected = sp; for (const h of Object.values(window.__kkq.save.heroes)) h.equip = {}; window.__kkq.play('1-1'); }, sp);
await wait(1200);
const poses = [['move', 0.3], ['run', 0.1], ['run', 0.5], ['air', 0.1], ['attack', 0.25], ['attack', 2.5], ['hurt', 0.1]];
const tiles = [];
for (const [j, [st, t]] of poses.entries()) {
  await p.evaluate(([st, t]) => window.__kkq.setPose(st, t), [st, t]);
  await wait(80);
  const pos = await p.evaluate(() => { const s = window.__kkq.scene, h = window.__kkq.world().hero, cam = s.cameras.main; const m = cam.getWorldPoint(0, 0); return { x: (h.x - m.x) * cam.zoom, y: (h.y - m.y) * cam.zoom }; });
  const k = 390 / 1080;
  const buf = await p.screenshot({ clip: { x: Math.max(0, pos.x * k - 60), y: Math.max(0, pos.y * k - 100), width: 120, height: 110 } });
  tiles.push({ input: await sharp(buf).resize(300, 275).toBuffer(), left: (j % 4) * 300, top: Math.floor(j / 4) * 275 });
}
await sharp({ create: { width: 1200, height: 550, channels: 3, background: '#222' } }).composite(tiles).png().toFile(`shots/rig-${sp}.png`);
await b.close(); server.kill();
