// Title screen at a few screen shapes: node scripts/title-shot.mjs [dpr] → shots/title-<w>x<h>.png
import { spawn } from 'node:child_process';
import { chromium } from 'playwright-core';
const PORT = 5314, url = `http://localhost:${PORT}/?touch`;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const wait = ms => new Promise(r => setTimeout(r, ms));
await wait(3000);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
for (const [w, h] of [[844, 390], [932, 430], [1024, 768]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: Number(process.argv[2] ?? 1), isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(url);
  await wait(2500);
  await p.screenshot({ path: `shots/title-${w}x${h}.png` });
  await ctx.close();
}
await b.close();
server.kill();
process.exit(0);
