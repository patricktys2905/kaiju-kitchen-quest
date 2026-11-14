// QA: Free Play with World 11 in it. node scripts/qa-free-w11.mjs <port> → shots/qa2/free/*.png
// Daily themes over the next days (11 worlds), a Midway Daily played by the bot, Boss Rush through to Flosso (tapped from the tab).
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const PORT = Number(process.argv[2]); const dir = 'shots/qa2/free'; fs.mkdirSync(dir, { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
const errs = []; p.on('pageerror', e => { errs.push(e.message); console.log('PAGEERROR', e.message); });
await p.goto(`http://localhost:${PORT}/?touch`, { waitUntil: 'commit' }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit' });
for (let i = 0; i < 300 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(900);
const shot = n => p.screenshot({ path: `${dir}/${n}.png` });
await p.evaluate(async () => {
  window.process ??= { env: {} }; const m = await import('/scripts/hero-at.ts'); const prof = m.heroFor(0, 120, 1); const s = window.__kkq.save, h = s.heroes[0];
  Object.assign(h, { level: 120, alloc: prof.alloc, skills: prof.skills, equip: prof.equip, tree: prof.tree, loadout: prof.loadout });
  for (let w = 1; w <= 11; w++) for (let k = 1; k <= 10; k++) h.cleared[`${w}-${k}`] = 'A';
  s.tips = ['move', 'jump', 'attack', 'dodge', 'skill', 'gear', 'weak', 'resist', 'ladder', 'drop', 'arena', 'hazard', 'hazard-skin', 'sponge', 'potion', 'escort', 'fetch', 'boss', 'cookbook', 'exit']; s.items.jam = 30; s.quick = ['jam', null, null, null];
  window.__kkq.scene.scene.restart({});
}); await wait(1000);
console.log('daily themes, next 14 days:', JSON.stringify(await p.evaluate(async () => { const f = await import('/src/sim/free.ts'), st = await import('/src/sim/stages.ts'); const out = []; for (let i = 0; i < 14; i++) { const d = new Date(Date.now() + i * 864e5), k = f.dayKey(d), s = f.dailyStage(k, 120); out.push(`${k}: W${s.world} ${s.name} hz ${[...new Set((s.hazards ?? []).map(z => z.kind))]}`); } window.__mid = [...Array(40).keys()].map(i => f.dayKey(new Date(Date.now() + i * 864e5))).find(k => f.dailyStage(k, 120).world === 11); return out; })));
await p.evaluate(() => document.querySelector('[data-tab="free"]')?.click()); await wait(600); await shot('0-free-tab');
console.log('free tab:', await p.evaluate(() => document.querySelector('.free')?.innerText.replace(/\s+/g, ' ').slice(0, 700)));
const bot = speed => p.evaluate(async speed => { const { Bot, SKILLED } = await import('/src/sim/bot.ts'); const w = window.__kkq.world(); if (!w || w.__bot) return; const bt = new Bot(w, SKILLED, 5, 0); w.__bot = bt; const orig = w.step.bind(w); window.__ev ??= []; w.step = inputs => { let all = []; for (let k = 0; k < speed; k++) { inputs[0] = bt.think(); const h = w.heroes[0]; if (h.hp < h.d.maxHp * 0.5) h.hp = h.d.maxHp; const e = orig(inputs); for (const x of e) if (['bossWake', 'nemesisMove', 'phase', 'clear', 'down'].includes(x.t)) window.__ev.push(`${w.stage.id} ${w.time.toFixed(0)} ${x.t} ${x.kind ?? x.move ?? x.n ?? ''}`); all = all.concat(e); if (w.cleared || w.failed) break; } return all; }; }, speed);
// ---- a Midway Daily (the day the rotation lands on World 11), played by the bot
const mid = await p.evaluate(async () => { const f = await import('/src/sim/free.ts'); const st = f.dailyStage(window.__mid, 120); window.__kkq.scene.scene.restart({ stage: st.id, free: { mode: 'daily', floor: 1, seed: window.__mid, perks: [], hpFrac: 1, time: 0, boxes: [], stage: st } }); return { day: window.__mid, id: st.id, name: st.name, world: st.world, maps: st.maps?.map(m => m.goal?.wants?.map(q => q.mob).join('+') ?? m.kind), foe: st.mobs[0]?.kind, hazards: [...new Set(st.hazards.map(z => z.kind + '/' + (z.skin ?? '')))], key: st.props.some(q => q.key) }; });
console.log('Midway daily:', JSON.stringify(mid)); await wait(2500); await shot('1-daily-midway-start'); await bot(3);
let last = -1; for (let t0 = Date.now(); Date.now() - t0 < 600000;) { const s = await p.evaluate(() => { const w = window.__kkq.world(); return { map: w ? w.mapAt(w.heroes[0].x) : -9, panel: document.getElementById('freepanel')?.innerText.replace(/\s+/g, ' ').slice(0, 300) || null, on: !!document.querySelector('#freepanel.on, #result.on') }; }).catch(() => null); if (!s) { await wait(300); continue; } if (s.on) { await wait(800); await shot('1-daily-midway-end'); console.log('Midway daily ended:', JSON.stringify(s), await p.evaluate(() => document.querySelector('#result.on')?.innerText.replace(/\s+/g, ' ').slice(0, 300) ?? null)); break; } if (s.map !== last) { last = s.map; await wait(1000); await shot(`1-daily-midway-map${s.map}`); await bot(3); } await wait(400); }
console.log('daily events:', JSON.stringify(await p.evaluate(() => window.__ev)));
await p.evaluate(() => { document.querySelectorAll('#freepanel button, #result.on [data-r="camp"]').forEach(x => { if (/CAMP|DONE|BACK|OK/i.test(x.innerText)) x.click(); }); }); await wait(800);
await p.evaluate(() => window.__kkq.scene.scene.restart({})); await wait(1000);
// ---- Boss Rush from the tab, to the end
await p.evaluate(() => { window.__ev = []; document.querySelector('[data-tab="free"]')?.click(); }); await wait(500);
await p.locator('[data-free="rush"]').tap(); await wait(2500);
const seenStages = []; let cur = '';
for (let t0 = Date.now(); Date.now() - t0 < 900000;) {
  const s = await p.evaluate(() => { const w = window.__kkq.world(); return { id: w?.stage.id ?? null, name: w?.stage.name ?? null, boss: w?.boss ? { kind: w.boss.kind, art: window.__kkq.scene.mobViews.get(w.boss.id)?.img.texture.key, lv: w.boss.lv } : null, panel: document.querySelector('#freepanel.on')?.innerText.replace(/\s+/g, ' ').slice(0, 400) ?? null, bar: document.querySelector('#hud .boss.on')?.textContent?.replace(/\s+/g, ' ').slice(0, 60) ?? null }; }).catch(() => null);
  if (!s) { await wait(300); continue; }
  if (s.panel && !/NEXT|CONTINUE/i.test(s.panel) && /best|time|rush|summary|done/i.test(s.panel) && !s.id) { await shot('2-rush-summary'); console.log('rush summary:', s.panel); break; }
  if (s.panel) { if (!seenStages.includes('P:' + s.panel.slice(0, 40))) { seenStages.push('P:' + s.panel.slice(0, 40)); if (/summary|complete|time/i.test(s.panel)) { await shot('2-rush-panel-' + seenStages.length); console.log('panel:', s.panel); } } await p.evaluate(() => { const bs = [...document.querySelectorAll('#freepanel.on button')]; (bs.find(x => /NEXT|CONTINUE|GO|FIGHT/i.test(x.innerText)) ?? bs[0])?.click(); }); await wait(1500); if (!await p.evaluate(() => !!window.__kkq.world())) { await shot('2-rush-summary'); console.log('rush ended, panel:', s.panel); break; } continue; }
  if (s.id && s.id !== cur) { cur = s.id; await bot(s.id === 'R-11' ? 1 : 4); await wait(s.id === 'R-11' ? 2500 : 600); const s2 = await p.evaluate(() => { const w = window.__kkq.world(); return w.boss ? { kind: w.boss.kind, art: window.__kkq.scene.mobViews.get(w.boss.id)?.img.texture.key, lv: w.boss.lv, bar: document.querySelector('#hud .boss.on')?.textContent?.replace(/\s+/g, ' ').slice(0, 60) } : null; }); seenStages.push(`${s.id} ${s.name} ${JSON.stringify(s2)}`); console.log('rush stage:', s.id, s.name, JSON.stringify(s2)); if (s.id === 'R-11' || s.id === 'R-10' || s.id === 'R-1') await shot('2-rush-' + s.id); if (s.id === 'R-11') { await wait(6000); await shot('2-rush-R-11-fight'); await p.evaluate(() => { const w = window.__kkq.world(); w.boss.hp = Math.min(w.boss.hp, w.boss.maxHp * 0.25); }); await wait(7000); await shot('2-rush-R-11-late'); await p.evaluate(() => { const w = window.__kkq.world(); w.boss.hp = 1; }); } }
  await wait(400);
}
console.log('rush events:', JSON.stringify(await p.evaluate(() => window.__ev)));
console.log('free save:', JSON.stringify(await p.evaluate(() => window.__kkq.save.free)));
await wait(800); await shot('3-end');
console.log(errs.length ? errs : 'no page errors'); await b.close(); process.exit(0);
