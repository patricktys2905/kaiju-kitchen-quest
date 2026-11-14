// QA review sheets for the Garnish with taller tiles and more poses than scripts/garnish-sheet.mjs.
//   node scripts/qa-garnish-sheet.mjs full  <port> <kind>            → shots/qa2/garnish/<kind>/full-<n>.png
//        20 kaiju x 11 poses (idle run run jump jab uppercut skill hurt climb dodge down), row A: bare, facing right, white;
//        row B: spoon + lid + charm, facing left, gold
//   node scripts/qa-garnish-sheet.mjs heads <port> <kind,kind,...>   → shots/qa2/garnish/heads-<kind>.png (20 kaiju, idle, right + left)
import fs from 'node:fs';
import { chromium } from 'playwright-core';
import sharp from 'sharp';
const mode = process.argv[2] ?? 'full', PORT = Number(process.argv[3] ?? 5611), arg = process.argv[4] ?? 'floss';
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 3 })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(`http://localhost:${PORT}/`, { waitUntil: 'commit', timeout: 120000 });
await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 480 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(800);
const kaiju = await p.evaluate(async () => { const { CLASSES } = await import('/src/sim/classes.ts'); return CLASSES.map(c => ({ sp: c.species, name: c.name })); });
const GEAR = {
  weapon: { id: 9001, base: 'spoon', rarity: 2, ilvl: 1, plus: 0, grade: 1, lines: [] },
  armor: { id: 9002, base: 'lid', rarity: 2, ilvl: 1, plus: 0, grade: 1, lines: [] },
  charm: { id: 9003, base: 'kernel', rarity: 2, ilvl: 1, plus: 0, grade: 1, lines: [] },
};
async function stage(sp, gear) {
  await p.evaluate(([sp, gear]) => {
    const s = window.__kkq.save; s.selected = sp; s.unlocked = [...new Set([...s.unlocked, sp])]; s.buddy = undefined;
    for (const h of Object.values(s.heroes)) { h.equip = {}; delete h.garnish; }
    if (gear) s.heroes[sp].equip = JSON.parse(JSON.stringify(gear));
    (s.tips ??= []).push('move', 'jump', 'attack', 'dodge', 'skill', 'gear');
    window.__kkq.play('1-1');
  }, [sp, gear]);
  for (let i = 0; i < 80; i++) { await wait(100); if (await p.evaluate(sp => window.__kkq.world()?.hero?.d.cls.species === sp, sp)) break; }
  await wait(500);
  await p.evaluate(() => { const w = window.__kkq.world(); for (const m of w.mobs) m.x += 3000; w.hero.inv = 9999; document.getElementById('coach')?.classList.remove('on'); });
}
const CW = 150, CH = 170;
async function tile(st, t, face, tw, th) {
  await p.evaluate(([st, t, face]) => { window.__kkq.world().hero.face = face; window.__kkq.setPose(st, t); }, [st, t, face]);
  await wait(70);
  const pos = await p.evaluate(() => { const s = window.__kkq.scene, h = window.__kkq.world().hero, cam = s.cameras.main; const m = cam.getWorldPoint(0, 0); return { x: (h.x - m.x) * cam.zoom, y: (h.y - m.y) * cam.zoom }; });
  const k = 390 / 1080;
  const buf = await p.screenshot({ clip: { x: Math.max(0, pos.x * k - CW / 2), y: Math.max(0, pos.y * k - CH + 22), width: CW, height: CH } });
  return sharp(buf).resize(tw, th).toBuffer();
}
const label = (text, w, h = 16) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#000" fill-opacity="0.7"/><text x="4" y="12" font-family="sans-serif" font-size="11" fill="#fff">${text.replace(/&/g, '&amp;')}</text></svg>`);
if (mode === 'full') {
  const kind = arg; fs.mkdirSync(`shots/qa2/garnish/${kind}`, { recursive: true });
  const poses = [['move', 0.3, 'idle'], ['run', 0.1, 'run'], ['run', 0.5, 'run'], ['air', 0.1, 'jump'], ['attack', 0.25, 'jab'], ['attack', 2.5, 'uppercut'], ['skill', 0.5, 'skill'], ['hurt', 0.1, 'hurt'], ['climb', 0.3, 'climb'], ['dodge', 0.15, 'dodge'], ['down', 0.6, 'down']];
  const TW = 150, TH = 170, PER = 4, rows = [];
  for (const { sp, name } of kaiju) {
    for (const [gear, face, gold] of [[null, 1, false], [GEAR, -1, true]]) {
      await stage(sp, gear);
      await p.evaluate(([k, g]) => window.__kkq.garnish(k, g), [kind, gold]);
      const tiles = [];
      for (const [st, t] of poses) tiles.push(await tile(st, t, face, TW, TH));
      rows.push({ name: `${sp} ${name} · ${gear ? 'gear, LEFT, gold' : 'bare, RIGHT, white'} · ${poses.map(q => q[2]).join(' / ')}`, tiles });
    }
    console.log('shot', sp, name);
  }
  for (let i = 0; i < rows.length; i += PER * 2) {
    const part = rows.slice(i, i + PER * 2), comp = [];
    part.forEach((r, y) => { r.tiles.forEach((input, x) => comp.push({ input, left: x * TW, top: y * (TH + 16) + 16 })); comp.push({ input: label(r.name, TW * poses.length), left: 0, top: y * (TH + 16) }); });
    await sharp({ create: { width: TW * poses.length, height: (TH + 16) * part.length, channels: 3, background: '#222' } }).composite(comp).png().toFile(`shots/qa2/garnish/${kind}/full-${i / (PER * 2)}.png`);
  }
} else if (mode === 'zoom') {
  // node scripts/qa-garnish-sheet.mjs zoom <port> <kind> <name> <state:t:face:gear(0|1):gold(0|1)> [sp,sp,...]  → shots/qa2/garnish/zoom-<name>.png
  fs.mkdirSync('shots/qa2/garnish', { recursive: true });
  const kind = arg, name = process.argv[5], [st, t, face, gear, gold] = process.argv[6].split(':'), only = process.argv[7] ? process.argv[7].split(',').map(Number) : null;
  const ZW = Number(process.env.ZW ?? 200), ZH = 180, TW = Math.round(320 * ZW / 200), TH = 288, tiles = [];
  for (const { sp, name: kn } of kaiju) {
    if (only && !only.includes(sp)) continue;
    await stage(sp, gear === '1' ? GEAR : null);
    await p.evaluate(([k, g]) => window.__kkq.garnish(k, g), [kind, gold === '1']);
    await p.evaluate(([st, t, face]) => { window.__kkq.world().hero.face = face; window.__kkq.setPose(st, t); }, [st, Number(t), Number(face)]);
    await wait(90);
    const pos = await p.evaluate(() => { const s = window.__kkq.scene, h = window.__kkq.world().hero, cam = s.cameras.main; const m = cam.getWorldPoint(0, 0); return { x: (h.x - m.x) * cam.zoom, y: (h.y - m.y) * cam.zoom }; });
    const k = 390 / 1080;
    const buf = await p.screenshot({ clip: { x: Math.max(0, pos.x * k - ZW / 2), y: Math.max(0, pos.y * k - ZH + 30), width: ZW, height: ZH } });
    tiles.push({ t: await sharp(buf).resize(TW, TH).toBuffer(), name: sp + ' ' + kn + ' · ' + st + ' ' + (face === '1' ? 'R' : 'L') });
  }
  const comp = [], rows = Math.ceil(tiles.length / 5);
  tiles.forEach((x, i) => { comp.push({ input: x.t, left: (i % 5) * TW, top: Math.floor(i / 5) * TH }, { input: label(x.name, 200), left: (i % 5) * TW, top: Math.floor(i / 5) * TH }); });
  await sharp({ create: { width: TW * 5, height: TH * rows, channels: 3, background: '#222' } }).composite(comp).png().toFile('shots/qa2/garnish/zoom-' + name + '.png');
} else {
  fs.mkdirSync('shots/qa2/garnish', { recursive: true });
  const kinds = arg.split(','), TW = 150, TH = 170;
  const tiles = {}; for (const k of kinds) tiles[k] = [];
  for (const { sp, name } of kaiju) {
    await stage(sp, null);
    for (const k of kinds) {
      await p.evaluate(k => window.__kkq.garnish(k, false), k);
      const r = await tile('move', 0.3, 1, TW, TH);
      await p.evaluate(k => window.__kkq.garnish(k, true), k);
      const l = await tile('move', 0.3, -1, TW, TH);
      tiles[k].push({ r, l, name: `${sp} ${name}` });
    }
    console.log('shot', sp, name);
  }
  for (const k of kinds) {
    const comp = [];
    tiles[k].forEach((x, i) => { const cx = (i % 5) * TW * 2, cy = Math.floor(i / 5) * (TH + 16); comp.push({ input: x.r, left: cx, top: cy + 16 }, { input: x.l, left: cx + TW, top: cy + 16 }, { input: label(`${x.name} · ${k} · R white / L gold`, TW * 2 - 2), left: cx, top: cy }); });
    await sharp({ create: { width: TW * 10, height: (TH + 16) * 4, channels: 3, background: '#222' } }).composite(comp).png().toFile(`shots/qa2/garnish/heads-${k}.png`);
  }
}
console.log(errs.length ? errs : 'no page errors');
await b.close(); process.exit(0);
