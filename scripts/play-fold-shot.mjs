// Is PLAY in reach on every stage card without scrolling? Checks a wide sample of stages at 667x375 and 844x390, in
// four states of the card (plain · SKIP TO BOSS showing · chillies open and on · Hard), and photographs the worst ones.
//   node scripts/play-fold-shot.mjs [--port N] [--out shots/fix/play]   (needs a running dev server, default port 5733)
// → <out>/<W>-<stage>-<state>.png (+ "-before": the same card with the pin switched off), <out>/play-fold.json;
//   prints every card where PLAY (or ONLINE) is not fully inside the card's visible area, and exits 1 if there is one.
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 ? process.argv[i + 1] : d; };
const PORT = Number(arg('port', 5733)), OUT = arg('out', 'shots/fix/play');
const STAGES = (arg('stages', '1-1,1-5,1-10,2-7,3-5,4-10,5-5,5-10,6-2,6-5,7-7,8-10,9-5,10-5,10-10,11-1,11-4,11-5,11-7,11-10')).split(',');
const SHOOT = new Set(arg('shoot', '1-5,5-10,11-5,11-10').split(','));
fs.mkdirSync(OUT, { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 667, height: 375 }, isMobile: true, hasTouch: true })).newPage();
await p.routeWebSocket(u => /^(localhost|127\.0\.0\.1)$/.test(new URL(u).hostname), () => {}); // no hot reloads mid-run
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(`http://localhost:${PORT}/?touch`, { waitUntil: 'commit', timeout: 120000 }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 480 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(900);
for (let i = 0; i < 3; i++) await p.evaluate(() => document.querySelector('#story .skip')?.click());
// everything cleared (so Hard, chillies, boss names, "Can drop", Best and the secret-stage buttons all show), a full drop bag (SKIP TO BOSS)
await p.evaluate(async () => {
  const st = await import('/src/sim/stages.ts'), mb = await import('/src/sim/mobs.ts'), stats = await import('/src/sim/stats.ts');
  const s = window.__kkq.save, h = s.heroes[s.selected];
  h.level = stats.MAX_LEVEL; for (const x of st.STAGES) { h.cleared[x.id] = 'A'; h.hardCleared[x.id] = 'B'; }
  h.seen = Object.keys((await import('/src/story/stories.ts')).STORIES[s.selected].beats);
  s.drops = Object.fromEntries(Object.keys(mb.MOBS).map(k => [k, 99])); s.keys = st.WORLDS.map(w => w.id); s.buddy = null; s.hard = false; s.nightmare = false; s.spicy = [];
  window.__kkq.scene.scene.restart({});
});
await wait(900);
await p.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; }' });
const click = sel => p.evaluate(s => document.querySelector(s)?.click(), sel);
const out = [], bad = [];
const pick = async id => {
  for (let i = 0; i < 16 && !await p.evaluate(id => !!document.querySelector(`[data-node="${id}"]`), id); i++) { await click(`[data-mappage="${i}"]`); await wait(80); }
  await click(`[data-node="${id}"]`); await wait(80);
  if (!await p.evaluate(id => document.querySelector('.map .info .playrow [data-play]')?.dataset.play === id, id)) bad.push(`could not open the card of ${id}`);
};
const measure = () => p.evaluate(() => {
  const info = document.querySelector('.map .info'); if (!info) return null; info.scrollTop = 0;
  const R = e => e ? e.getBoundingClientRect() : null, ir = R(info), pl = R(info.querySelector('.playrow [data-play]')), on = R(info.querySelector('.playrow [data-act=online]')), sk = R(info.querySelector('.playrow [data-skip]'));
  const page = R(info.closest('.page')) ?? { bottom: innerHeight }, floor = Math.min(ir.bottom, innerHeight, page.bottom);
  const inside = r => !r || (r.top >= ir.top - 0.5 && r.bottom <= floor + 0.5);
  return { card: [Math.round(ir.top), Math.round(ir.bottom)], scrolls: info.scrollHeight > info.clientHeight + 1, play: pl ? [Math.round(pl.top), Math.round(pl.bottom)] : null, playOk: !!pl && inside(pl), onlineOk: inside(on), skip: !!sk, skipOk: inside(sk), rowOk: inside(R(info.querySelector('.playrow'))), vh: innerHeight };
});
const BEFORE = '.kq .map .info .playrow { position: static !important; }';
for (const [W, H] of [[667, 375], [844, 390]]) {
  await p.setViewportSize({ width: W, height: H }); await wait(300);
  for (const state of ['plain', 'skip', 'chillies', 'hard']) {
    await p.evaluate(async state => {
      const s = window.__kkq.save, mb = await import('/src/sim/mobs.ts');
      s.drops = state === 'plain' ? {} : Object.fromEntries(Object.keys(mb.MOBS).map(k => [k, 99]));
      s.spicy = state === 'chillies' ? ['glass', 'clock'] : []; s.hard = state === 'hard';
    }, state);
    await click('[data-tab="hero"]'); await click('[data-tab="map"]'); await wait(80);
    const open = await p.evaluate(() => / ▾/.test(document.querySelector('[data-act=spicyopen]')?.textContent ?? ''));
    if ((state === 'chillies') !== open) { await click('[data-act=spicyopen]'); await wait(80); }
    for (const id of STAGES) {
      await pick(id);
      const m = await measure(); if (!m) { bad.push(`${W} ${id} ${state}: no stage card`); continue; }
      const tag = await p.addStyleTag({ content: BEFORE }); const was = await measure();
      if (SHOOT.has(id)) await p.screenshot({ path: `${OUT}/${W}-${id}-${state}-before.png` });
      await tag.evaluate(e => e.remove()); await measure();
      if (SHOOT.has(id)) await p.screenshot({ path: `${OUT}/${W}-${id}-${state}.png` });
      out.push({ W, id, state, ...m, beforeOk: was.playOk, rowH: await p.evaluate(() => Math.round(document.querySelector('.map .info .playrow').getBoundingClientRect().height)) });
      if (!m.rowOk) bad.push(`${W} ${id} ${state}: the PLAY row runs off the bottom of the page`);
      if (!m.playOk || !m.onlineOk) bad.push(`${W} ${id} ${state}: PLAY ${JSON.stringify(m.play)} outside the card ${JSON.stringify(m.card)} (screen ${m.vh})`);
    }
  }
}
fs.writeFileSync(`${OUT}/play-fold.json`, JSON.stringify(out, null, 1));
for (const W of [667, 844]) for (const state of ['plain', 'skip', 'chillies', 'hard']) {
  const rows = out.filter(o => o.W === W && o.state === state);
  console.log(`${W} ${state}: ${rows.length} cards · scroll ${rows.filter(o => o.scrolls).length} · with SKIP ${rows.filter(o => o.skip).length} · PLAY in reach ${rows.filter(o => o.playOk).length}/${rows.length} (before the pin: ${rows.filter(o => o.beforeOk).length}/${rows.length}; below the fold then: ${rows.filter(o => !o.beforeOk).map(o => o.id).join(' ') || 'none'}) · SKIP in reach ${rows.filter(o => o.skip && o.skipOk).length}/${rows.filter(o => o.skip).length} · the pinned row is up to ${Math.max(...rows.map(o => o.rowH))}px tall of a ${Math.min(...rows.map(o => o.card[1] - o.card[0]))}px card`);
}
console.log(bad.length ? 'PROBLEMS:\n' + bad.join('\n') : 'PLAY and ONLINE are in reach on every card');
console.log(errs.length ? errs : 'no page errors');
await b.close(); process.exit(bad.length || errs.length ? 1 : 0);
