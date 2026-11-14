// Are the generated stages the SAME in the browser as in Node?  (All 121 story + secret stages, boss rooms, Daily / Endless seeds.)
//   1. start a DEV server:   npx vite --port 5173 --strictPort      (dev, not preview: the script imports the TS modules)
//   2. node scripts/stage-fingerprint-browser.mjs 5173 [edge|chrome|chromium|firefox|webkit ...]   (default: edge)
// Computes scripts/stage-fingerprint.ts in each browser and compares it with Node (vite-node) and with the pinned
// tests/stage-fingerprints.json. Exit code 1 on any difference.
// edge / chrome use the installed browser; chromium / firefox / webkit need Playwright's own builds
// (npx playwright-core install firefox webkit); a browser that is not installed is reported as SKIPPED.
import { chromium, firefox, webkit } from 'playwright-core'; import { execSync } from 'node:child_process'; import fs from 'node:fs';
const port = process.argv[2]; if (!port) { console.error('usage: node scripts/stage-fingerprint-browser.mjs <dev-server-port> [browsers...]'); process.exit(2); }
const names = process.argv.slice(3).length ? process.argv.slice(3) : ['edge'];
const LAUNCH = {
  edge: () => chromium.launch({ channel: 'msedge', headless: true }),
  chrome: () => chromium.launch({ channel: 'chrome', headless: true }),
  chromium: () => chromium.launch({ headless: true }),
  firefox: () => firefox.launch({ headless: true }),
  webkit: () => webkit.launch({ headless: true }),
};
const node = JSON.parse(execSync('node node_modules/vite-node/dist/cli.mjs scripts/stage-fingerprint.ts', { encoding: 'utf8', maxBuffer: 1 << 26 }));
const pinned = fs.existsSync('tests/stage-fingerprints.json') ? JSON.parse(fs.readFileSync('tests/stage-fingerprints.json', 'utf8')) : null;
const cmp = (label, a, b) => { const ids = [...new Set([...Object.keys(a), ...Object.keys(b)])]; const bad = ids.filter(id => a[id] !== b[id]); console.log(`${label}: ${ids.length} compared, ${bad.length} different`); for (const id of bad.slice(0, 15)) console.log(`   ${id}\n      ${a[id]}\n      ${b[id]}`); return bad.length; };
let fail = 0, ran = 0;
console.log(`node ${process.version} (v8 ${process.versions.v8})`);
if (pinned) fail += cmp('node vs pinned tests/stage-fingerprints.json', node, pinned);
for (const name of names) {
  let b; try { b = await LAUNCH[name](); } catch (e) { console.log(`${name}: SKIPPED (not installed: ${String(e.message).split('\n')[0]})`); continue; }
  try {
    const p = await b.newPage(); await p.goto(`http://localhost:${port}/`, { waitUntil: 'commit' });
    const ua = await p.evaluate(() => navigator.userAgent);
    const got = await p.evaluate(async () => (await import('/scripts/stage-fingerprint.ts')).fingerprints());
    console.log(`${name}: ${ua}`); ran++;
    fail += cmp(`node vs ${name}`, node, got);
  } finally { await b.close(); }
}
if (!ran) { console.log('no browser ran'); process.exit(2); }
console.log(fail ? 'FAIL: the stages differ' : 'OK: identical');
process.exit(fail ? 1 : 0);
