// In-stage HTML HUD: hero card (HP/XP), stage + monsters left, combo counter, boss bar, loot found, toasts, pause.
import { TIER_NAMES } from './sim/loot';
import { xpFor, type HeroProfile } from './sim/stats';
import type { BoxTier, StageDef } from './sim/types';
import type { World } from './sim/world';

const CSS = `
#hud { position: fixed; inset: 0; pointer-events: none; z-index: 9; font-family: Nunito, Arial, sans-serif; font-weight: 900; color: #fff; display: none; }
#hud.on { display: block; }
#hud .card { position: absolute; left: calc(1.5vmin + env(safe-area-inset-left)); top: 1.5vmin; display: flex; gap: 1.4vmin; align-items: center;
  background: linear-gradient(#3a2440e6, #24142ae6); border: 2px solid #ffd27a; border-radius: 2vmin; padding: 1vmin 1.6vmin 1vmin 1vmin; box-shadow: 0 0.6vmin 0 #0006; }
#hud .face { width: 8vmin; height: 8vmin; border-radius: 1.4vmin; background: #fff2 center/contain no-repeat; }
#hud .nm { font-family: 'Luckiest Guy', sans-serif; font-weight: 400; font-size: 2.6vmin; letter-spacing: 0.04em; color: #ffe08a; }
#hud .lv { font-size: 2vmin; color: #fff; margin-left: 1vmin; }
#hud .bar { width: 26vmin; height: 1.9vmin; border-radius: 1vmin; background: #0008; overflow: hidden; margin-top: 0.6vmin; position: relative; }
#hud .bar i { position: absolute; inset: 0; width: 100%; background: linear-gradient(#ff7a8a, #e0304a); transform-origin: left; transition: transform 0.15s; }
#hud .bar.xp { height: 1.1vmin; } #hud .bar.xp i { background: linear-gradient(#ffe27a, #e0a020); }
#hud .bar b { position: absolute; inset: 0; font-size: 1.5vmin; line-height: 1.9vmin; text-align: center; text-shadow: 0 1px 0 #000; }
#hud .buff { font-size: 1.6vmin; color: #9fe0ff; min-height: 1.8vmin; }
#hud .stage { position: absolute; left: 50%; transform: translateX(-50%); top: 1.5vmin; text-align: center; text-shadow: 0 0.3vmin 0.6vmin #000; }
#hud .stage .t { font-family: 'Luckiest Guy', sans-serif; font-weight: 400; letter-spacing: 0.05em; font-size: 2.6vmin; color: #ffe08a; }
#hud .stage .s { font-size: 2vmin; }
#hud .boss { position: absolute; left: 50%; transform: translateX(-50%); top: 9vmin; width: 60vmin; display: none; text-align: center; }
#hud .boss.on { display: block; }
#hud .boss .t { font-family: 'Luckiest Guy', sans-serif; font-weight: 400; letter-spacing: 0.06em; font-size: 2.8vmin; color: #ff9a6a; text-shadow: 0 0.3vmin 0 #000; }
#hud .boss .bar { width: 100%; height: 2.6vmin; border: 2px solid #ffb08a; }
#hud .boss .bar i { background: linear-gradient(#ff8a3c, #c02020); }
#hud .boss .bar u { position: absolute; left: 0; right: 0; bottom: 0; height: 0.6vmin; background: #ffe27a; transform-origin: left; text-decoration: none; }
#hud .right { position: absolute; right: calc(1.5vmin + env(safe-area-inset-right)); top: 1.5vmin; display: flex; gap: 1vmin; align-items: center; }
#hud .loot { display: flex; align-items: center; gap: 0.5vmin; background: #24142ad0; border: 2px solid #ffd27a; border-radius: 2vmin; padding: 0.5vmin 1.2vmin; font-size: 2.4vmin; }
#hud .loot img { width: 4.6vmin; height: 4.6vmin; object-fit: contain; }
#hud .menu { pointer-events: auto; width: 7vmin; height: 7vmin; border-radius: 1.6vmin; background: #24142ad0; border: 2px solid #ffd27a; color: #ffd27a; font-size: 3.6vmin; display: flex; align-items: center; justify-content: center; }
#hud .combo { position: absolute; right: calc(6vmin + env(safe-area-inset-right)); top: 22vmin; text-align: right; font-family: 'Luckiest Guy', sans-serif; font-weight: 400; color: #ffe27a; text-shadow: 0 0.5vmin 0 #a03010; opacity: 0; transition: opacity 0.3s; }
#hud .combo.on { opacity: 1; }
#hud .combo b { font-size: 7vmin; font-weight: 400; display: block; line-height: 1; }
#hud .combo span { font-size: 2.6vmin; letter-spacing: 0.1em; }
#hud .combo.bump b { animation: bump 0.15s; }
@keyframes bump { 50% { transform: scale(1.25); } }
#hud .toasts { position: absolute; left: 0; right: 0; top: 24%; display: flex; flex-direction: column; align-items: center; gap: 1vmin; }
#hud .toast { font-family: 'Luckiest Guy', sans-serif; font-weight: 400; letter-spacing: 0.05em; font-size: 3.4vmin; padding: 0.8vmin 2.4vmin; border-radius: 2vmin;
  background: #24142ae0; border: 2px solid var(--c, #ffd27a); color: var(--c, #ffd27a); animation: tst 2.2s ease-out forwards; display: flex; align-items: center; gap: 1.2vmin; }
#hud .toast img { width: 5.6vmin; height: 5.6vmin; object-fit: contain; }
#hud .toast.big { font-size: 6vmin; padding: 1.4vmin 4vmin; }
@keyframes tst { 0% { transform: scale(0.6); opacity: 0 } 10% { transform: scale(1.08); opacity: 1 } 18% { transform: scale(1) } 80% { opacity: 1 } 100% { opacity: 0; transform: translateY(-3vmin) } }
#hud .help { position: absolute; left: 50%; bottom: 1.5vmin; transform: translateX(-50%); font-size: 1.8vmin; opacity: 0.75; text-shadow: 0 1px 2px #000; white-space: nowrap; }
body.touch #hud .help { display: none; }
#pause { position: fixed; inset: 0; z-index: 35; background: #120a18c8; display: none; align-items: center; justify-content: center; flex-direction: column; gap: 2vmin; }
#pause.on { display: flex; }
#pause h2 { font-size: 6vmin; color: #ffb347; }
`;

const TIER_CSS: Record<BoxTier, string> = { 1: '#e0c09a', 2: '#7ee87e', 3: '#7ac0ff', 4: '#ffd23c', 5: '#ff8af4' };

let root: HTMLElement;
let q: <T extends HTMLElement>(s: string) => T;
let lastCombo = 0;

export function initHud(onMenu: () => void, onResume: () => void, onLeave: () => void): void {
  const st = document.createElement('style');
  st.textContent = CSS;
  document.head.appendChild(st);
  root = document.createElement('div');
  root.id = 'hud';
  root.innerHTML = `
    <div class="card"><div class="face"></div><div><div><span class="nm"></span><span class="lv"></span></div>
      <div class="bar hp"><i></i><b></b></div><div class="bar xp"><i></i></div><div class="buff"></div></div></div>
    <div class="stage"><div class="t"></div><div class="s"></div></div>
    <div class="boss"><div class="t"></div><div class="bar"><i></i><u></u></div></div>
    <div class="right"><div class="loot"><img src="art/box-3.webp"><span>0</span></div><button class="menu">☰</button></div>
    <div class="combo"><b>0</b><span>HITS</span></div>
    <div class="toasts"></div>
    <div class="help">← → move · ↑ ↓ climb · SPACE jump · J attack ×3 combo · L / I / O skills · ↓+SPACE drop · ESC menu</div>`;
  document.body.appendChild(root);
  q = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
  q('.menu').addEventListener('pointerdown', e => { e.preventDefault(); onMenu(); });
  const p = document.createElement('div');
  p.id = 'pause'; p.className = 'kq';
  p.innerHTML = `<h2>PAUSED</h2><button class="pill go" data-a="resume">▶ RESUME</button><button class="pill" data-a="leave">⟵ RETREAT TO CAMP</button>`;
  document.body.appendChild(p);
  p.querySelector('[data-a=resume]')!.addEventListener('click', onResume);
  p.querySelector('[data-a=leave]')!.addEventListener('click', onLeave);
}

export function showHud(v: boolean): void { root?.classList.toggle('on', v); }
export function showPause(v: boolean): void { document.getElementById('pause')?.classList.toggle('on', v); }

export function updateHud(w: World, p: HeroProfile, st: StageDef): void {
  if (!root) return;
  const h = w.hero;
  const bg = `url(art/kaiju-${p.species}.webp)`;
  const face = q('.face');
  if (face.style.backgroundImage !== bg) face.style.backgroundImage = bg;
  q('.nm').textContent = h.d.cls.name;
  q('.lv').textContent = `Lv ${p.level}`;
  q('.hp i').style.transform = `scaleX(${h.hp / h.d.maxHp})`;
  q('.hp b').textContent = `${Math.ceil(h.hp)} / ${h.d.maxHp}`;
  q('.xp i').style.transform = `scaleX(${Math.min(1, p.xp / xpFor(p.level))})`;
  q('.buff').textContent = h.buff ? `✦ BUFF ${Math.ceil(h.buff.t)}s` : '';
  q('.stage .t').textContent = `${st.num} ${st.name}`;
  q('.stage .s').textContent = w.portal ? '➜ Exit is open! Head right' : `Monsters left: ${w.alive}`;
  const boss = w.boss;
  const bb = q('.boss');
  bb.classList.toggle('on', !!boss && boss.state !== 'dead');
  if (boss) {
    q('.boss .t').textContent = `Lv ${boss.lv} BURNT TOAST KING`;
    q('.boss .bar i').style.transform = `scaleX(${Math.max(0, boss.hp / boss.maxHp)})`;
    q<HTMLElement>('.boss .bar u').style.transform = `scaleX(${boss.state === 'stagger' ? 1 : boss.stagger / (boss.maxHp * 0.12)})`;
  }
  q('.loot span').textContent = String(w.loot.length);
  const combo = q('.combo');
  combo.classList.toggle('on', w.combo >= 3);
  if (w.combo !== lastCombo && w.combo >= 3) { q('.combo b').textContent = String(w.combo); combo.classList.remove('bump'); void combo.offsetWidth; combo.classList.add('bump'); }
  lastCombo = w.combo;
}

export function toast(text: string, opts: { color?: string; tier?: BoxTier; big?: boolean } = {}): void {
  if (!root) return;
  const box = q('.toasts');
  const t = document.createElement('div');
  t.className = 'toast' + (opts.big ? ' big' : '');
  t.style.setProperty('--c', opts.color ?? (opts.tier ? TIER_CSS[opts.tier] : '#ffd27a'));
  t.innerHTML = (opts.tier ? `<img src="art/box-${opts.tier}.webp">` : '') + `<span>${text}</span>`;
  box.appendChild(t);
  while (box.children.length > 3) box.firstChild!.remove();
  setTimeout(() => t.remove(), 2300);
}

export { TIER_NAMES };
