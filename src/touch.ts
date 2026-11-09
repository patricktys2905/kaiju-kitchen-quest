// Phone-first on-screen controls (HTML overlay above the canvas, thumb-sized at any scale).
// Left thumb: a floating stick anywhere on the left 40% of the screen (8-way: run, climb, drop).
// Right thumb: big ATTACK, JUMP, and three SKILL buttons with cooldown rings.

export const isTouchDevice =
  new URLSearchParams(location.search).has('touch') || 'ontouchstart' in window || navigator.maxTouchPoints > 0;

const stick = { x: 0, y: 0 };
const held = { jump: false, attack: false, s0: false, s1: false, s2: false };
const latched = { jump: false, attack: false, s0: false, s1: false, s2: false };
type Btn = keyof typeof held;
let enabled = false;

export interface TouchRead { x: number; y: number; jump: boolean; attack: boolean; skill: [boolean, boolean, boolean] }

export function readTouch(): TouchRead {
  const on = (k: Btn) => held[k] || latched[k];
  const out: TouchRead = { x: stick.x, y: stick.y, jump: on('jump'), attack: on('attack'), skill: [on('s0'), on('s1'), on('s2')] };
  for (const k of Object.keys(latched) as Btn[]) latched[k] = false;
  return out;
}

/** Show the in-stage controls (hidden in the camp menus). */
export function setTouchVisible(v: boolean): void {
  enabled = v;
  document.getElementById('tc')?.classList.toggle('on', v);
  if (!v) { stick.x = stick.y = 0; for (const k of Object.keys(held) as Btn[]) held[k] = false; }
}
export function touchEnabled(): boolean { return enabled; }

const CSS = `
#tc { position: fixed; inset: 0; pointer-events: none; z-index: 10; font-family: 'Luckiest Guy', 'Arial Black', Impact, sans-serif; letter-spacing: 0.04em; display: none; }
body.touch #tc.on { display: block; }
#tc .zone { position: absolute; left: 0; top: 18%; bottom: 0; width: 42%; pointer-events: auto; touch-action: none; }
#tc .base { position: absolute; width: 26vmin; height: 26vmin; margin: -13vmin 0 0 -13vmin; border-radius: 50%; border: 3px solid #fff5; background: #0004; }
#tc .knob { position: absolute; width: 12vmin; height: 12vmin; margin: -6vmin 0 0 -6vmin; border-radius: 50%; background: #fff8; border: 3px solid #fff; box-shadow: 0 2px 6px #0006; }
#tc .btn { position: absolute; pointer-events: auto; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff;
  text-shadow: 0 2px 0 #0008; border: 3px solid #fff6; background: #0005; touch-action: none; box-sizing: border-box; user-select: none; -webkit-user-select: none; overflow: hidden; }
#tc .btn.down { background: #fff4; transform: scale(0.93); }
#tc #t-attack { width: 24vmin; height: 24vmin; right: calc(4vmin + env(safe-area-inset-right)); bottom: 4vmin; font-size: 4vmin; border-color: #ffb0a0; background: #ff5a3c66; }
#tc #t-jump { width: 16vmin; height: 16vmin; right: calc(30vmin + env(safe-area-inset-right)); bottom: 3vmin; font-size: 3.2vmin; border-color: #ffe08a; background: #ffb33c55; }
#tc .sk { width: 14vmin; height: 14vmin; font-size: 1.9vmin; border-color: #a0e0ff; background: #3cb0ff55; text-align: center; line-height: 1.05; }
#tc .sk .cd { position: absolute; inset: 0; background: conic-gradient(#000b var(--cd, 0deg), transparent 0); pointer-events: none; }
#tc .sk .cd i { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-style: normal; font-size: 4.6vmin; }
#tc .sk span { position: relative; padding: 0 0.8vmin; }
#tc .sk.locked { opacity: 0.28; }
#tc #t-s0 { right: calc(31vmin + env(safe-area-inset-right)); bottom: 21vmin; }
#tc #t-s1 { right: calc(19vmin + env(safe-area-inset-right)); bottom: 31vmin; }
#tc #t-s2 { right: calc(4vmin + env(safe-area-inset-right)); bottom: 30vmin; }
#tc-rotate { position: fixed; inset: 0; z-index: 60; background: #1a1020; color: #ffe9c7; display: none; align-items: center; justify-content: center;
  flex-direction: column; font-family: 'Luckiest Guy', 'Arial Black', Impact, sans-serif; letter-spacing: 0.04em; font-size: 6vw; text-align: center; gap: 4vw; }
@media (orientation: portrait) { body.touch #tc-rotate { display: flex; } }
`;

function hold(el: HTMLElement, k: Btn): void {
  const ids = new Set<number>();
  el.addEventListener('pointerdown', e => { e.preventDefault(); ids.add(e.pointerId); el.setPointerCapture?.(e.pointerId); el.classList.add('down'); held[k] = true; latched[k] = true; });
  const up = (e: PointerEvent) => { ids.delete(e.pointerId); if (!ids.size) { el.classList.remove('down'); held[k] = false; } };
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
  el.addEventListener('lostpointercapture', up);
}

export function initTouch(): void {
  if (isTouchDevice) document.body.classList.add('touch');
  const st = document.createElement('style');
  st.textContent = CSS;
  document.head.appendChild(st);
  const root = document.createElement('div');
  root.id = 'tc';
  root.innerHTML = `
    <div class="zone" id="t-zone"></div>
    <div class="btn sk" id="t-s0"><div class="cd"><i></i></div><span></span></div>
    <div class="btn sk" id="t-s1"><div class="cd"><i></i></div><span></span></div>
    <div class="btn sk" id="t-s2"><div class="cd"><i></i></div><span></span></div>
    <div class="btn" id="t-jump">JUMP</div>
    <div class="btn" id="t-attack">ATTACK</div>`;
  document.body.appendChild(root);
  const rot = document.createElement('div');
  rot.id = 'tc-rotate';
  rot.innerHTML = '<div style="font-size:16vw">⟳</div><div>Turn your phone sideways</div>';
  document.body.appendChild(rot);
  const $ = (id: string) => root.querySelector<HTMLElement>('#' + id)!;
  hold($('t-attack'), 'attack');
  hold($('t-jump'), 'jump');
  hold($('t-s0'), 's0');
  hold($('t-s1'), 's1');
  hold($('t-s2'), 's2');

  // floating stick: appears where the thumb lands
  const zone = $('t-zone');
  const base = document.createElement('div'); base.className = 'base';
  const knob = document.createElement('div'); knob.className = 'knob';
  base.style.display = knob.style.display = 'none';
  zone.append(base, knob);
  let id: number | null = null, ox = 0, oy = 0;
  const vmin = () => Math.min(innerWidth, innerHeight) / 100;
  const place = (el: HTMLElement, x: number, y: number) => { const r = zone.getBoundingClientRect(); el.style.left = `${x - r.left}px`; el.style.top = `${y - r.top}px`; };
  zone.addEventListener('pointerdown', e => {
    e.preventDefault();
    if (id !== null) return;
    id = e.pointerId; zone.setPointerCapture?.(e.pointerId);
    ox = e.clientX; oy = e.clientY;
    base.style.display = knob.style.display = 'block';
    place(base, ox, oy); place(knob, ox, oy);
  });
  zone.addEventListener('pointermove', e => {
    if (e.pointerId !== id) return;
    const max = 11 * vmin();
    let dx = e.clientX - ox, dy = e.clientY - oy;
    const d = Math.hypot(dx, dy);
    if (d > max) { dx *= max / d; dy *= max / d; }
    place(knob, ox + dx, oy + dy);
    const dead = 3.5 * vmin();
    // 8-way, with a wider horizontal band so running never accidentally climbs
    stick.x = Math.abs(dx) > dead ? Math.sign(dx) : 0;
    stick.y = Math.abs(dy) > dead * 1.6 && Math.abs(dy) > Math.abs(dx) * 0.6 ? Math.sign(dy) : 0;
  });
  const lift = (e: PointerEvent) => {
    if (e.pointerId !== id) return;
    id = null; stick.x = stick.y = 0;
    base.style.display = knob.style.display = 'none';
  };
  zone.addEventListener('pointerup', lift);
  zone.addEventListener('pointercancel', lift);
  zone.addEventListener('lostpointercapture', lift);
}

/** Skill buttons: name (null = locked), cooldown fraction (0 = ready), seconds left. */
export function setSkillUi(i: number, name: string | null, cdFrac: number, left: number): void {
  const b = document.getElementById('t-s' + i);
  if (!b) return;
  const label = name ?? 'LOCKED';
  const sp = b.querySelector('span')!;
  if (sp.textContent !== label) sp.textContent = label;
  b.classList.toggle('locked', name === null);
  const cd = b.querySelector<HTMLElement>('.cd')!;
  cd.style.setProperty('--cd', `${Math.round(cdFrac * 360)}deg`);
  const txt = left > 0 ? String(Math.ceil(left)) : '';
  const it = cd.querySelector('i')!;
  if (it.textContent !== txt) it.textContent = txt;
}
