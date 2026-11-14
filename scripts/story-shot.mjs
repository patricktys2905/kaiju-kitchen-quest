// The story player with the painted scenes, any kaiju and any beat, photographed and measured.
//   node scripts/story-shot.mjs [--species 10,2] [--beats w1-s4,w2-elite] [--size 844x390] [--lines first|all|right]
//                               [--text 1|1.2|1.4] [--out shots/story] [--port N] [--tag name]
//   --species  kaiju ids (default 10, Bluebeary); `all` = every kaiju
//   --beats    story beat ids: intro, w<N>-open, w<N>-s2..s4, w<N>-elite, w<N>-s6..s9, w<N>-boss, w<N>-after, w5-hook, w10-hook
//              (default w1-s4,w2-elite); `w11` = every World 11 beat
//   --jobs     several species:beats pairs in one go, e.g. "0:w11;2,15:w11-elite,w11-s7" (instead of --species/--beats)
//   --size     one or more screen sizes, e.g. 844x390,667x375 (default 844x390)
//   --lines    which lines of each beat to photograph: the first (default), all, or the first plus every line where
//              somebody other than your kaiju speaks (right-side portraits)
//   --text     the Settings text size (1.4 = Extra large)
//   --dpr      device pixel ratio of the screenshots (default 1)
//   --port     use a dev server that is already running (otherwise one is started on 5338 and stopped again)
// → <out>/<tag->?<W>-<species>-<beat>-<line>.png and <out>/<tag->?measure-<W>.json. The Ken Burns drift is photographed at its
//   END (the worst case). Each line is checked: the painting must sit above the dialogue box, on screen, and the title,
//   SKIP button and text must fit; problems are printed and the script exits 1.
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 ? process.argv[i + 1] : d; };
const SIZES = arg('size', '844x390').split(',').map(x => x.split('x').map(Number)); let [W, H] = SIZES[0];
const OUT = arg('out', 'shots/story'), TAG = arg('tag', '') ? arg('tag', '') + '-' : '';
const LINES = arg('lines', 'first'), TEXT = Number(arg('text', '1'));
const OWN = !arg('port'), PORT = Number(arg('port', 5338));
const server = OWN ? spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' }) : null;
const wait = ms => new Promise(r => setTimeout(r, ms));
if (OWN) await wait(3000);
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: W, height: H }, isMobile: true, hasTouch: true, deviceScaleFactor: Number(arg('dpr', '1')) })).newPage();
// no hot reloads: somebody else saving a source file must not reload the page in the middle of a run
await p.routeWebSocket(u => /^(localhost|127\.0\.0\.1)$/.test(new URL(u).hostname), () => {});
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(`http://localhost:${PORT}/?touch`, { waitUntil: 'commit', timeout: 120000 }); await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 480 && !await p.evaluate(() => !!window.__kkq).catch(() => false); i++) await wait(250);
await p.evaluate(() => document.querySelector('#title .play')?.click()); await wait(900);
await p.evaluate(() => window.__kkq.scene.game.loop.sleep()).catch(() => {}); // the camp behind the story needs no frames
await p.evaluate(async t => { const m = await import('/src/ui/settings.ts'); m.settings.text = t; m.applySettings?.(); document.body.style.setProperty('--ts', String(t)); }, TEXT);
const all = await p.evaluate(async () => { const st = await import('/src/story/stories.ts'), cl = await import('/src/sim/classes.ts'); return cl.CLASSES.map(c => ({ sp: c.species, name: c.name, beats: Object.keys(st.STORIES[c.species]?.beats ?? {}) })); });
const JOBS = (arg('jobs') ?? `${arg('species', '10')}:${arg('beats', 'w1-s4,w2-elite')}`).split(';').map(j => j.split(':'));
const bad = [];
for ([W, H] of SIZES) {
await p.setViewportSize({ width: W, height: H }); await wait(300);
const out = [];
for (const [spArg, beatArg] of JOBS) for (const sp of spArg === 'all' ? all.map(a => a.sp) : spArg.split(',').map(Number)) {
  const k = all.find(a => a.sp === sp); if (!k) { bad.push(`no kaiju ${sp}`); continue; }
  const beats = beatArg.split(',').flatMap(x => /^w\d+$/.test(x) ? k.beats.filter(y => y.startsWith(x + '-')) : [x]);
  for (const beat of beats) {
    const raw = await p.evaluate(async ([sp, beat]) => { const st = await import('/src/story/stories.ts'); return (st.STORIES[sp].beats[beat] ?? []).map(l => [l[0], l[1]]); }, [sp, beat]);
    if (!raw.length) { bad.push(`${sp} ${k.name}: no beat ${beat}`); continue; }
    await p.evaluate(([sp, beat]) => { window.__done = false; return import('/src/ui/story.ts').then(m => m.playStory(sp, [beat], () => { window.__done = true; })); }, [sp, beat]);
    for (let i = 0; i < raw.length; i++) {
      await wait(60); await p.evaluate(() => document.getElementById('story').click()); // finish the typing
      const want = LINES === 'all' || i === 0 || (LINES === 'right' && raw[i][0] !== 'me' && raw[i][0] !== 'n');
      if (want) {
        // wait for the painting and the portraits to load
        await p.evaluate(async () => { const urls = [...document.querySelectorAll('#story .still i, #story .por')].map(e => getComputedStyle(e).backgroundImage.match(/url\("?([^")]+)/)?.[1]).filter(Boolean); await Promise.all(urls.map(u => new Promise(r => { const im = new Image(); im.onload = im.onerror = r; im.src = u; }))); });
        await wait(i === 0 ? 800 : 150);
        const file = `${OUT}/${TAG}${W}-${sp}-${beat}-${i}.png`;
        await p.screenshot({ path: file, animations: 'disabled' }); // finite animations (the Ken Burns drift) jump to their end
        const m = await p.evaluate(() => {
          const R = e => { if (!e) return null; const r = e.getBoundingClientRect(); return { l: Math.round(r.left), t: Math.round(r.top), r: Math.round(r.right), b: Math.round(r.bottom) }; };
          const q = s => document.querySelector('#story ' + s);
          const tx = q('.tx'), rg = document.createRange(); rg.selectNodeContents(tx); const tr = rg.getBoundingClientRect();
          const ttl = q('.ttl'), tg = document.createRange(); tg.selectNodeContents(ttl.firstChild); const tt = tg.getBoundingClientRect();
          const i = document.querySelector('#story .still i:not(.out)');
          return { still: i ? getComputedStyle(i).backgroundImage.match(/still-[^.]+/)?.[0] ?? null : null, pic: R(i?.querySelector('u')), box: R(q('.box')), who: R(q('.who')), chip: q('.who img')?.getAttribute('src') ?? null,
            text: { l: Math.round(tr.left), t: Math.round(tr.top), r: Math.round(tr.right), b: Math.round(tr.bottom) }, title: { l: Math.round(tt.left), t: Math.round(tt.top), r: Math.round(tt.right), b: Math.round(tt.bottom) }, skip: R(q('.skip')),
            left: R(q('.por.l')), right: R(q('.por.r')), rightArt: q('.por.r') ? getComputedStyle(q('.por.r')).backgroundImage.match(/art\/[^"')]+/)?.[0] ?? q('.por.r').className : null, vw: innerWidth, vh: innerHeight };
        });
        out.push({ sp, name: k.name, beat, line: i, speaker: raw[i][0], file, ...m });
        const id = `${W}: ${sp} ${k.name} ${beat} #${i}`;
        if (m.pic && m.pic.b > m.box.t + 8) bad.push(`${id}: painting runs ${m.pic.b - m.box.t}px under the box`);
        if (m.pic && -m.pic.t > (m.pic.b - m.pic.t) * 0.1) bad.push(`${id}: more than a tenth of the painting is off the top`);
        if (m.pic && m.right && m.right.l < m.pic.r - (m.pic.r - m.pic.l) * 0.12) bad.push(`${id}: the speaker's portrait covers more than the painting's right edge`);
        if (m.text.b > m.box.b || m.text.r > m.box.r) bad.push(`${id}: text overflows the box`);
        if (m.title.r > m.skip.l && m.title.t < m.skip.b) bad.push(`${id}: title under the SKIP button`);
        if (m.box.t < m.title.b) bad.push(`${id}: box reaches the title`);
      }
      await p.evaluate(() => document.getElementById('story').click()); // next line
    }
    await wait(150);
    if (!await p.evaluate(() => window.__done)) { await p.evaluate(() => document.querySelector('#story .skip')?.click()); await wait(200); }
    await wait(750); // let the last painting's fade-out finish
  }
}
fs.writeFileSync(`${OUT}/${TAG}measure-${W}.json`, JSON.stringify(out, null, 1));
console.log(`${out.length} shots → ${OUT}/${TAG}*.png, ${OUT}/${TAG}measure-${W}.json`);
for (const o of out) console.log(`${W} ${o.sp} ${o.beat} #${o.line} ${o.still ?? 'no painting'} pic ${o.pic ? `${o.pic.l},${o.pic.t}-${o.pic.r},${o.pic.b}` : '-'} box.t ${o.box.t} L ${o.left ? o.left.l + '-' + o.left.r : '-'} R ${o.right ? o.right.l + '-' + o.right.r + ' ' + o.rightArt : '-'}${o.chip ? '' : o.speaker !== 'n' && o.still ? ' NO CHIP' : ''}`);
}
if (bad.length) console.log('PROBLEMS:\n' + bad.join('\n'));
console.log(errs.length ? errs : 'no page errors');
await b.close(); server?.kill();
process.exit(bad.length || errs.length ? 1 : 0);
