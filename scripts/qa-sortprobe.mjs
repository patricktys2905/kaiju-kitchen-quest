// QA: does `.sort(() => r() - 0.5)` (stages.ts genMaps) give the same order in Node and in the browser?
import { chromium } from 'playwright-core';
const probe = () => { const rng = seed => { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; };
  const out = []; for (const seed of [11048, 1048, 5085]) { let calls = 0; const r = rng(seed); const a = ['terraces', 'towers', 'steps', 'islands', 'deck', 'valley'].sort(() => { calls++; return r() - 0.5; }); out.push(`${seed}: ${a.join(',')} (${calls} comparator calls)`); } return out; };
console.log('node', process.version, 'v8', process.versions.v8); for (const l of probe()) console.log('  ', l);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await b.newPage(); console.log('browser', await p.evaluate(() => navigator.userAgent)); for (const l of await p.evaluate(`(${probe})()`)) console.log('  ', l);
await b.close();
