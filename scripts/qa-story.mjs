// QA: every World 11 story scene of every kaiju, every line, measured (and shot at 844x390).
//   node scripts/qa-story.mjs [port=5611] [WxH=844x390] [shots=1|0]
// → shots/qa2/story-measure-<W>.json, shots/qa2/story-text.json (844 run), shots/qa2/story/<sp>-<beat>-<line>.jpg
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const PORT = Number(process.argv[2] ?? 5611), [W, H] = (process.argv[3] ?? '844x390').split('x').map(Number), SHOTS = (process.argv[4] ?? '1') === '1';
const BEATS = ['w11-open', 'w11-s2', 'w11-s3', 'w11-s4', 'w11-elite', 'w11-s6', 'w11-s7', 'w11-s8', 'w11-s9', 'w11-boss', 'w11-after'];
fs.mkdirSync('shots/qa2/story', { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })).newPage();
const errs = []; p.on('pageerror', e => errs.push('page error: ' + e.message));
p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errs.push('console: ' + m.text().slice(0, 200)); });
const bad404 = []; p.on('response', r => { if (r.status() >= 400) bad404.push(r.status() + ' ' + r.url()); });
await p.goto(`http://localhost:${PORT}/?touch`, { waitUntil: 'commit', timeout: 120000 }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 480 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(900);
const meta = await p.evaluate(async () => {
  const st = await import('/src/story/stories.ts'), cl = await import('/src/sim/classes.ts'), mb = await import('/src/sim/mobs.ts');
  const out = {};
  for (const c of cl.CLASSES) out[c.species] = { name: c.name, title: st.STORIES[c.species]?.title, nemesis: mb.nemesisOf(c.species), nemesisName: mb.nemesisOf(c.species) ? mb.MOBS[mb.nemesisOf(c.species)].name : null, beats: Object.keys(st.STORIES[c.species]?.beats ?? {}).filter(k => /^w11/.test(k)) };
  return out;
});
const ONLY = process.argv[5] ? process.argv[5].split(',').map(Number) : null;
const species = Object.keys(meta).map(Number).sort((a, b) => a - b).filter(x => !ONLY || ONLY.includes(x));
const out = [], imgs = new Set();
for (const sp of species) {
  for (const beat of BEATS) {
    const has = await p.evaluate(async ([sp, beat]) => { const st = await import('/src/story/stories.ts'); return (st.STORIES[sp].beats[beat] ?? []).map(l => [l[0], l[1]]); }, [sp, beat]);
    const rec = { sp, name: meta[sp].name, beat, raw: has, lines: [] };
    out.push(rec);
    if (!has.length) { rec.missing = true; continue; }
    await p.evaluate(([sp, beat]) => { window.__done = false; return import('/src/ui/story.ts').then(m => m.playStory(sp, [beat], () => { window.__done = true; })); }, [sp, beat]);
    for (let i = 0; i < has.length; i++) {
      await wait(60);
      // finish the typing
      await p.evaluate(() => document.getElementById('story').click());
      await wait(i === 0 ? 350 : 90);
      const m = await p.evaluate(() => {
        const R = e => { if (!e) return null; const r = e.getBoundingClientRect(); return { l: Math.round(r.left), t: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height) }; };
        const q = s => document.querySelector('#story ' + s);
        const box = q('.box'), tx = q('.tx'), who = q('.who'), ttl = q('.ttl'), skip = q('.skip'), sm = q('.ttl small');
        const bg = e => e ? (getComputedStyle(e).backgroundImage.match(/art\/[^"')]+/)?.[0] ?? getComputedStyle(e).backgroundImage.slice(0, 60)) : null;
        const stills = [...document.querySelectorAll('#story .still i:not(.out)')].map(bg);
        const range = document.createRange(); range.selectNodeContents(tx); const tr = range.getBoundingClientRect();
        const ttlRange = document.createRange(); ttlRange.selectNodeContents(ttl.firstChild ?? ttl); const ttr = ttlRange.getBoundingClientRect();
        const smr = document.createRange(); if (sm) smr.selectNodeContents(sm); const smR = sm ? smr.getBoundingClientRect() : null;
        return {
          text: tx.textContent, who: who.textContent, whoShown: getComputedStyle(who).display !== 'none', chip: who.querySelector('img')?.getAttribute('src') ?? null,
          boxCls: box.className, box: R(box), tx: { l: Math.round(tr.left), t: Math.round(tr.top), r: Math.round(tr.right), b: Math.round(tr.bottom) }, whoR: R(who), whoLines: Math.round(who.getBoundingClientRect().height / parseFloat(getComputedStyle(who).lineHeight || '1') * 10) / 10,
          boxScroll: [box.scrollHeight, box.clientHeight, box.scrollWidth, box.clientWidth],
          ttl: { l: Math.round(ttr.left), r: Math.round(ttr.right), t: Math.round(ttr.top), b: Math.round(ttr.bottom) }, small: smR ? { l: Math.round(smR.left), r: Math.round(smR.right) } : null, skip: R(skip), next: R(q('.next')),
          still: stills, left: bg(q('.por.l')), leftR: R(q('.por.l')), right: bg(q('.por.r')), rightCls: q('.por.r')?.className ?? null, rightR: R(q('.por.r')), vw: innerWidth, vh: innerHeight,
        };
      });
      m.i = i; rec.lines.push(m);
      for (const u of [m.chip, m.left, m.right, ...m.still]) if (u && /^art\//.test(u)) imgs.add(u);
      if (SHOTS) await p.screenshot({ path: `shots/qa2/story/${sp}-${beat}-${i}.jpg`, type: 'jpeg', quality: 72, animations: 'disabled' });
      await p.evaluate(() => document.getElementById('story').click()); // next line
    }
    await wait(120);
    rec.closed = await p.evaluate(() => window.__done && !document.querySelector('#story.on'));
    if (!rec.closed) { await p.evaluate(() => document.querySelector('#story .skip')?.click()); await wait(200); }
  }
  fs.writeFileSync('shots/qa2/story/_m-' + W + '-' + sp + '.json', JSON.stringify(out.filter(r => r.sp === sp)));
  console.log('done', sp, meta[sp].name);
}
const all = []; for (const f of fs.readdirSync('shots/qa2/story').filter(f => f.startsWith('_m-' + W + '-'))) all.push(...JSON.parse(fs.readFileSync('shots/qa2/story/' + f, 'utf8'))); all.sort((a, b) => a.sp - b.sp); out.length = 0; out.push(...all);
for (const r of out) for (const m of r.lines) for (const u of [m.chip, m.left, m.right, ...m.still]) if (u && u.startsWith('art/')) imgs.add(u);
const imgOk = await p.evaluate(async list => { const o = {}; for (const u of list) { o[u] = await new Promise(res => { const im = new Image(); im.onload = () => res(im.naturalWidth + 'x' + im.naturalHeight); im.onerror = () => res('FAILED'); im.src = u; }); } return o; }, [...imgs]);
fs.writeFileSync(`shots/qa2/story-measure-${W}.json`, JSON.stringify({ meta, out, imgOk, errs, bad404 }, null, 1));
if (W === 844) fs.writeFileSync('shots/qa2/story-text.json', JSON.stringify(out.map(r => ({ species: r.sp, kaiju: r.name, beat: r.beat, lines: r.lines.map((l, i) => ({ speaker: r.raw[i][0], name: l.whoShown ? l.who : '(narrator)', text: l.text, painting: l.still, portraitLeft: l.left, portraitRight: l.right, chip: l.chip })) })), null, 1));
console.log('scenes', out.length, 'lines', out.reduce((a, r) => a + r.lines.length, 0), 'missing', out.filter(r => r.missing).map(r => r.sp + ':' + r.beat).join(' ') || 'none');
console.log('images failed:', Object.entries(imgOk).filter(([, v]) => v === 'FAILED').map(([k]) => k).join(' ') || 'none', 'of', imgs.size);
console.log('errors:', errs.length ? errs.slice(0, 10) : 'none', '4xx:', bad404.slice(0, 10));
await b.close(); process.exit(0);
