// HTML HUD over the canvas: crisp text on any phone. Hero card (HP/XP), loot box counts, hero picker, toasts.
import { CLASSES } from './sim/classes';
import { TIER_NAMES } from './sim/loot';
import type { BoxTier } from './sim/types';
import type { Hero } from './sim/world';
import { xpFor } from './sim/world';

const CSS = `
#hud { position: fixed; inset: 0; pointer-events: none; z-index: 9; font-family: Nunito, Arial, sans-serif; font-weight: 900; color: #fff; }
#hud .card { position: absolute; left: calc(1.5vmin + env(safe-area-inset-left)); top: 1.5vmin; display: flex; gap: 1.4vmin; align-items: center;
  background: linear-gradient(#3a2440e6, #24142ae6); border: 2px solid #ffd27a; border-radius: 2vmin; padding: 1vmin 1.6vmin 1vmin 1vmin; box-shadow: 0 0.6vmin 0 #0006; }
#hud .face { width: 8vmin; height: 8vmin; border-radius: 1.4vmin; background: #fff2 center/contain no-repeat; }
#hud .nm { font-family: 'Luckiest Guy', sans-serif; font-weight: 400; font-size: 2.8vmin; letter-spacing: 0.04em; color: #ffe08a; }
#hud .lv { font-size: 2vmin; color: #fff; margin-left: 1vmin; }
#hud .bar { width: 26vmin; height: 1.9vmin; border-radius: 1vmin; background: #0008; overflow: hidden; margin-top: 0.6vmin; position: relative; }
#hud .bar i { position: absolute; inset: 0; width: 100%; background: linear-gradient(#ff7a8a, #e0304a); transform-origin: left; }
#hud .bar.xp { height: 1.1vmin; } #hud .bar.xp i { background: linear-gradient(#ffe27a, #e0a020); }
#hud .bar b { position: absolute; inset: 0; font-size: 1.5vmin; line-height: 1.9vmin; text-align: center; text-shadow: 0 1px 0 #000; }
#hud .loot { position: absolute; right: calc(1.5vmin + env(safe-area-inset-right)); top: 1.5vmin; display: flex; gap: 0.6vmin;
  background: #24142ad0; border: 2px solid #ffd27a; border-radius: 2vmin; padding: 0.6vmin 1vmin; }
#hud .loot div { width: 6vmin; text-align: center; font-size: 2vmin; opacity: 0.35; }
#hud .loot div.has { opacity: 1; }
#hud .loot img { width: 5.4vmin; height: 5.4vmin; object-fit: contain; display: block; margin: 0 auto -0.4vmin; }
#hud .pick { position: absolute; left: 50%; transform: translateX(-50%); top: 1.5vmin; display: flex; gap: 1vmin; pointer-events: auto; }
#hud .pick img { width: 7vmin; height: 7vmin; object-fit: contain; border-radius: 1.4vmin; background: #24142ab0; border: 2px solid #fff4; padding: 0.4vmin; }
#hud .pick img.on { border-color: #ffd27a; background: #5a3a20d0; }
#hud .toasts { position: absolute; left: 0; right: 0; top: 24%; display: flex; flex-direction: column; align-items: center; gap: 1vmin; }
#hud .toast { font-family: 'Luckiest Guy', sans-serif; font-weight: 400; letter-spacing: 0.05em; font-size: 3.6vmin; padding: 0.8vmin 2.4vmin; border-radius: 2vmin;
  background: #24142ae0; border: 2px solid var(--c, #ffd27a); color: var(--c, #ffd27a); animation: tst 2.2s ease-out forwards; display: flex; align-items: center; gap: 1.2vmin; }
#hud .toast img { width: 6vmin; height: 6vmin; object-fit: contain; }
@keyframes tst { 0% { transform: scale(0.6); opacity: 0 } 10% { transform: scale(1.08); opacity: 1 } 18% { transform: scale(1) } 80% { opacity: 1 } 100% { opacity: 0; transform: translateY(-3vmin) } }
#hud .help { position: absolute; left: 50%; bottom: 1.5vmin; transform: translateX(-50%); font-size: 1.9vmin; opacity: 0.75; text-shadow: 0 1px 2px #000; white-space: nowrap; }
body.touch #hud .help { display: none; }
`;

const TIER_CSS: Record<BoxTier, string> = { 1: '#e0c09a', 2: '#7ee87e', 3: '#7ac0ff', 4: '#ffd23c', 5: '#ff8af4' };

let els: { face: HTMLElement; nm: HTMLElement; lv: HTMLElement; hp: HTMLElement; hpT: HTMLElement; xp: HTMLElement; loot: HTMLElement[]; picks: HTMLImageElement[]; toasts: HTMLElement } | null = null;

export function initHud(onPick: (species: number) => void): void {
  const st = document.createElement('style');
  st.textContent = CSS;
  document.head.appendChild(st);
  const h = document.createElement('div');
  h.id = 'hud';
  h.innerHTML = `
    <div class="card"><div class="face"></div><div><div><span class="nm"></span><span class="lv"></span></div>
      <div class="bar hp"><i></i><b></b></div><div class="bar xp"><i></i></div></div></div>
    <div class="pick">${CLASSES.map(c => `<img data-s="${c.species}" src="art/kaiju-${c.species}.webp" title="${c.name}">`).join('')}</div>
    <div class="loot">${[1, 2, 3, 4, 5].map(t => `<div title="${TIER_NAMES[t as BoxTier]}"><img src="art/box-${t}.webp"><span>0</span></div>`).join('')}</div>
    <div class="toasts"></div>
    <div class="help">← → move · ↑ ↓ climb · SPACE jump · J attack (tap ×3 for a combo) · L skill · ↓+SPACE drop down · 1-4 switch hero</div>`;
  document.body.appendChild(h);
  const q = <T extends HTMLElement>(s: string) => h.querySelector<T>(s)!;
  els = {
    face: q('.face'), nm: q('.nm'), lv: q('.lv'), hp: q('.hp i'), hpT: q('.hp b'), xp: q('.xp i'),
    loot: [...h.querySelectorAll<HTMLElement>('.loot div')], picks: [...h.querySelectorAll<HTMLImageElement>('.pick img')], toasts: q('.toasts'),
  };
  for (const img of els.picks) img.addEventListener('pointerdown', e => { e.preventDefault(); onPick(Number(img.dataset.s)); });
}

export function updateHud(hero: Hero, loot: BoxTier[]): void {
  if (!els) return;
  const bg = `url(art/kaiju-${hero.cls.species}.webp)`;
  if (els.face.style.backgroundImage !== bg) els.face.style.backgroundImage = bg;
  els.nm.textContent = hero.cls.name;
  els.lv.textContent = `Lv ${hero.level}`;
  els.hp.style.transform = `scaleX(${hero.hp / hero.maxHp})`;
  els.hpT.textContent = `${Math.ceil(hero.hp)} / ${hero.maxHp}`;
  els.xp.style.transform = `scaleX(${hero.xp / xpFor(hero.level)})`;
  for (let t = 1; t <= 5; t++) {
    const n = loot.filter(x => x === t).length;
    const el = els.loot[t - 1];
    el.classList.toggle('has', n > 0);
    el.querySelector('span')!.textContent = String(n);
  }
  for (const p of els.picks) p.classList.toggle('on', Number(p.dataset.s) === hero.cls.species);
}

export function toast(text: string, opts: { color?: string; tier?: BoxTier } = {}): void {
  if (!els) return;
  const t = document.createElement('div');
  t.className = 'toast';
  const c = opts.color ?? (opts.tier ? TIER_CSS[opts.tier] : '#ffd27a');
  t.style.setProperty('--c', c);
  t.innerHTML = (opts.tier ? `<img src="art/box-${opts.tier}.webp">` : '') + `<span>${text}</span>`;
  els.toasts.appendChild(t);
  while (els.toasts.children.length > 3) els.toasts.firstChild!.remove();
  setTimeout(() => t.remove(), 2300);
}
