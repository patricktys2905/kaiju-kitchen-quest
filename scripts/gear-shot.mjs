// Gear look sheet: every hero × 3 gear sets, idle + mid-swing. Usage: node scripts/gear-shot.mjs → shots/gear.png
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
import sharp from 'sharp';
const PORT = 5313;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(`http://localhost:${PORT}/?touch`);
for (let i = 0; i < 60; i++) { if (await p.evaluate(() => !!window.__kkq).catch(() => false)) break; await wait(250); }
const OWN = { 0: ['w-gob2', 'w-gob3', 'a-gob'], 10: ['w-blue2', 'w-blue3', 'a-blue'], 11: ['w-pizza2', 'w-pizza3', 'a-pizza'], 4: ['w-moth2', 'w-moth3', 'a-moth'], 1: ['w-squid2', 'w-squid3', 'a-squid'], 2: ['w-crab2', 'w-crab3', 'a-crab'], 5: ['w-toast2', 'w-toast3', 'a-toast'], 6: ['w-dump2', 'w-dump3', 'a-dump'] };
const setsFor = sp => [{ weapon: [OWN[sp][0], 3], armor: [OWN[sp][2], 3] }, { weapon: [OWN[sp][1], 5], charm: ['bell', 2] }, { weapon: [OWN[sp][1], 2] }];
const tiles = [];
for (const [r, sp] of (process.argv[2] ? process.argv[2].split(',').map(Number) : [0, 10, 11, 4]).entries()) for (const [si, set] of setsFor(sp).entries()) for (const [fi, [st, t]] of [['move', 0.3], ['attack', 0.12]].entries()) {
  await p.evaluate(([sp, set]) => {
    const s = window.__kkq.save; s.selected = sp; let id = 9000;
    const eq = {}; for (const [slot, [base, rarity]] of Object.entries(set)) eq[slot] = { id: id++, base, rarity, ilvl: 1, plus: 0, lines: [] };
    s.heroes[sp].equip = eq; window.__kkq.play('1-1');
  }, [sp, set]);
  await wait(700);
  await p.evaluate(([st, t]) => window.__kkq.setPose(st, t), [st, t]);
  await wait(60);
  const pos = await p.evaluate(() => { const s = window.__kkq.scene, h = window.__kkq.world().hero, cam = s.cameras.main; const m = cam.getWorldPoint(0, 0); return { x: (h.x - m.x) * cam.zoom, y: (h.y - m.y) * cam.zoom }; });
  const k = 390 / 1080;
  const buf = await p.screenshot({ clip: { x: Math.max(0, pos.x * k - 75), y: Math.max(0, pos.y * k - 125), width: 150, height: 140 } });
  tiles.push({ input: await sharp(buf).resize(200, 187).toBuffer(), left: (si * 2 + fi) * 200, top: r * 187 });
}
await sharp({ create: { width: 1200, height: 748, channels: 3, background: '#222' } }).composite(tiles).png().toFile('shots/gear.png');
console.log(errs.length ? errs : 'no page errors');
await b.close(); server.kill();
