// QA: Hard mode on the Midway after 11-10 (tapped), and an Endless Pantry floor themed on World 11. node scripts/qa-hard-endless.mjs <port>
import { chromium } from 'playwright-core';
const PORT = Number(process.argv[2]); const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
const errs = []; p.on('pageerror', e => { errs.push(e.message); console.log('PAGEERROR', e.message); });
await p.goto(`http://localhost:${PORT}/?touch`, { waitUntil: 'commit' }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit' });
for (let i = 0; i < 300 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(900);
const setup = upTo => p.evaluate(async upTo => { window.process ??= { env: {} }; const m = await import('/scripts/hero-at.ts'); const prof = m.heroFor(0, 120, 1); const s = window.__kkq.save, h = s.heroes[0]; Object.assign(h, { level: 120, alloc: prof.alloc, skills: prof.skills, equip: prof.equip, tree: prof.tree, loadout: prof.loadout }); h.cleared = {}; for (let w = 1; w <= 10; w++) for (let k = 1; k <= 10; k++) h.cleared[`${w}-${k}`] = 'A'; for (let k = 1; k <= upTo; k++) h.cleared[`11-${k}`] = 'A'; h.seen = ['intro', ...['open', 's2', 's3', 's4', 's6', 's7', 's8', 's9', 'elite', 'boss', 'after'].map(x => 'w11-' + x)]; s.tips = ['move', 'jump', 'attack', 'dodge', 'skill', 'gear', 'weak', 'resist', 'ladder', 'drop', 'arena', 'hazard', 'hazard-skin', 'sponge', 'potion', 'escort', 'fetch', 'boss', 'cookbook', 'exit']; window.__kkq.scene.scene.restart({}); }, upTo);
const card = async () => { await p.evaluate(() => [...document.querySelectorAll('[data-mappage]')].pop()?.click()); await wait(400); await p.evaluate(() => document.querySelector('[data-node="11-1"]')?.click()); await wait(400); };
await setup(9); await wait(900); await card();
await p.locator('[data-act="diff-hard"]').tap().catch(() => {}); await wait(400);
console.log('Hard tapped BEFORE 11-10:', JSON.stringify(await p.evaluate(() => ({ hard: window.__kkq.save.hard, flash: document.querySelector('.flashmsg')?.textContent ?? null, btn: document.querySelector('[data-act="diff-hard"]')?.innerText }))));
await p.screenshot({ path: 'shots/qa2/extra/hard-0-locked.png' });
await setup(10); await wait(900); await card();
await p.locator('[data-act="diff-hard"]').tap(); await wait(500);
console.log('Hard tapped AFTER 11-10:', JSON.stringify(await p.evaluate(() => ({ hard: window.__kkq.save.hard, flash: document.querySelector('.flashmsg')?.textContent ?? null, card: document.querySelector('.map .info')?.innerText.replace(/\s+/g, ' ').slice(0, 260) }))));
await p.screenshot({ path: 'shots/qa2/extra/hard-1-card.png' });
await p.evaluate(() => document.querySelector('.playrow [data-play="11-1"]')?.click()); await wait(3000);
console.log('11-1 on Hard:', JSON.stringify(await p.evaluate(() => { const w = window.__kkq.world(); return w && { id: w.stage.id, hard: w.hard, lvs: [...new Set(w.mobs.map(m => m.lv))].sort(), elites: w.mobs.filter(m => m.elite).length, mods: w.mobs.filter(m => m.mods?.length).length, foe: w.mobName(w.mobs.find(m => m.wake)), hud: document.querySelector('#hud .stage')?.textContent.slice(0, 80) }; })));
await p.screenshot({ path: 'shots/qa2/extra/hard-2-stage.png' });
await p.evaluate(() => window.__kkq.scene.scene.restart({})); await wait(900);
for (const fl of [31, 40]) {
  const e = await p.evaluate(async fl => { const f = await import('/src/sim/free.ts'); const st = f.endlessFloor(fl, 120, 77); window.__kkq.scene.scene.restart({ stage: st.id, free: { mode: 'endless', floor: fl, seed: 77, perks: [], hpFrac: 1, time: 0, boxes: [], stage: st } }); return { id: st.id, name: st.name, world: st.world, bg: st.bg, mobs: [...new Set(st.mobs.map(m => m.kind))], boss: !!st.boss }; }, fl);
  await wait(3500); await p.evaluate(() => { const w = window.__kkq.world(); for (const h of w.heroes) h.inv = 9999; w.heroes[0].x += 300; }); await wait(2500);
  console.log(`Endless floor ${fl}:`, JSON.stringify(e), JSON.stringify(await p.evaluate(() => { const s = window.__kkq.scene, w = window.__kkq.world(); return { drawn: w.mobs.filter(m => s.mobViews.get(m.id)).map(m => m.kind + '/' + s.mobViews.get(m.id).img.texture.key), far: s.far?.texture.key, bar: document.querySelector('#hud .boss.on')?.textContent?.replace(/\s+/g, ' ').slice(0, 50) ?? null }; })));
  await p.screenshot({ path: `shots/qa2/extra/endless-${fl}.png` });
  await p.evaluate(() => window.__kkq.scene.scene.restart({})); await wait(900);
}
console.log(errs.length ? errs : 'no page errors'); await b.close();
