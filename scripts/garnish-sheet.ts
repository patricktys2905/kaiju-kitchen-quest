// Review sheets for the Garnish badge (the drop's icon in a small ring by a kaiju's name), drawn with the game's own
// fit and CSS (src/ui/garnishBadge.ts), every drop, white and gold rings, on dark, mid-tone and light backgrounds:
//   shots/garnish/badges.png              real size (18 CSS px, 1 image px per CSS px)
//   shots/garnish/badges-4x-<n>.png       the same, zoomed 4x (two sheets)
//   shots/garnish/thin-before-after.png   the thin / pale icons: the old badge (whole image in a 16 px disc) beside the new
// No server needed: it reads public/art/drop-*.webp.   npx vite-node scripts/garnish-sheet.ts
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { DROPS } from '../src/sim/drops';
import { BADGE_FILTER_SVG, badgeCss, badgeFit, badgeImgStyle } from '../src/ui/garnishBadge';

fs.mkdirSync('shots/garnish', { recursive: true });
const kinds = Object.keys(DROPS);
const url = (f: string) => 'file:///' + path.resolve(f).replace(/\\/g, '/');
const art = (k: string) => url(`public/art/gb-${k}.webp`), raw = (k: string) => url(`public/art/drop-${k}.webp`);
const badge = (k: string, gold: boolean) => `<span class="gnn ${gold ? 'gold' : ''}"><img src="${art(k)}" style="${badgeImgStyle(k)}"></span>`;
const old = (k: string, gold: boolean) => `<span class="old ${gold ? 'gold' : ''}"><img src="${raw(k)}"></span>`;
/** the step in between: the whole drop icon fitted and outlined (sparks and puddles outlined too) */
const mid = (k: string, gold: boolean) => `<span class="gnn ${gold ? 'gold' : ''}"><img src="${raw(k)}" style="position:absolute;width:118%;height:118%;left:-9%;top:-9%;object-fit:contain"></span>`;
const BG = ['#2e1c36', '#8a8a92', '#f2e2c4'];
const CSS = `${badgeCss('.gnn', '18px', '1.5px')}
.old { position: relative; display: inline-block; width: 16px; height: 16px; border-radius: 50%; background: #968ab4; box-shadow: 0 0 0 1.5px #fff, 0 0 0 2.5px #1a1020; }
.old.gold { box-shadow: 0 0 0 1.5px #ffc83c, 0 0 0 2.5px #1a1020; } .old img { display: block; width: 84%; height: 84%; margin: 8%; object-fit: contain; }
.gnn { display: inline-block; }
body { margin: 0; padding: 6px; background: #55555c; font: 10px sans-serif; color: #fff; }
.grid { display: grid; gap: 4px; } .c { text-align: center; white-space: nowrap; overflow: hidden; }
.c > div { display: flex; justify-content: center; align-items: center; }
.z { zoom: 4; gap: 2px; padding: 2px 0; } .o { gap: 6px; padding: 4px 0; }`;
const cell = (k: string, zoom: boolean, f = badge) => `<div class="c">${BG.map(bg => `<div class="${zoom ? 'z' : 'o'}" style="background:${bg}">${f(k, false)}${f(k, true)}</div>`).join('')}${k}${badgeFit(k).slender ? ' ↗' : ''}</div>`;
const page = (body: string) => `<style>${CSS}</style>${BADGE_FILTER_SVG}${body}`;

const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await (await b.newContext({ viewport: { width: 1000, height: 400 }, deviceScaleFactor: 1 })).newPage();
async function shot(name: string, width: number, html: string): Promise<void> {
  fs.writeFileSync('shots/garnish/_sheet.html', page(html));
  await p.setViewportSize({ width, height: 400 });
  await p.goto(url('shots/garnish/_sheet.html')); await p.waitForTimeout(700);
  await p.screenshot({ path: `shots/garnish/${name}.png`, fullPage: true });
}
await shot('badges', 16 * 64 + 12, `<div class="grid" style="grid-template-columns:repeat(16, 60px)">${kinds.map(k => cell(k, false)).join('')}</div>`);
const half = Math.ceil(kinds.length / 2);
for (const [n, part] of [kinds.slice(0, half), kinds.slice(half)].entries())
  await shot(`badges-4x-${n}`, 10 * 172 + 12, `<div class="grid" style="grid-template-columns:repeat(10, 168px)">${part.map(k => cell(k, true)).join('')}</div>`);
// the eleven named as hard to read, old beside new, real size and 4x
const THIN = ['fork', 'bee', 'flour', 'can', 'caterpillar', 'napkin', 'straw', 'pudding', 'noodle', 'wasp', 'ladle'].filter(k => kinds.includes(k));
const pair = (k: string, zoom: boolean) => `<div class="c">${BG.map(bg => `<div class="${zoom ? 'z' : 'o'}" style="background:${bg}">${old(k, false)}${mid(k, false)}${badge(k, false)}${old(k, true)}${mid(k, true)}${badge(k, true)}</div>`).join('')}${k}: ${DROPS[k as keyof typeof DROPS]![0]} (old, whole icon, body only)</div>`;
await shot('thin-before-after', 4 * 474 + 12, `<div class="grid" style="grid-template-columns:repeat(4, 470px)">${THIN.map(k => pair(k, true)).join('')}</div><br><div class="grid" style="grid-template-columns:repeat(11, 160px)">${THIN.map(k => pair(k, false)).join('')}</div>`);
fs.rmSync('shots/garnish/_sheet.html');
await b.close();
console.log(kinds.length, 'drops → shots/garnish/badges.png, badges-4x-0.png, badges-4x-1.png, thin-before-after.png');
console.log('slender fit:', kinds.filter(k => badgeFit(k).slender).join(', '));
