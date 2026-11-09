// Phone-first on-screen controls (HTML overlay above the canvas, thumb-sized at any scale).
// Left thumb: a floating stick anywhere on the left 40% of the screen (8-way: run, climb, drop).
// Right thumb: big ATTACK, JUMP, and SKILL with a cooldown ring.

export const isTouchDevice =
  new URLSearchParams(location.search).has('touch') || 'ontouchstart' in window || navigator.maxTouchPoints > 0;

const stick = { x: 0, y: 0 };
const held = { jump: false, attack: false, skill: false };
const latched = { jump: false, attack: false, skill: false };

export interface TouchRead { x: number; y: number; jump: boolean; attack: boolean; skill: boolean }

export function readTouch(): TouchRead {
  const out = { x: stick.x, y: stick.y, jump: held.jump || latched.jump, attack: held.attack || latched.attack, skill: held.skill || latched.skill };
  latched.jump = latched.attack = latched.skill = false;
  return out;
}

const CSS = `
#tc { position: fixed; inset: 0; pointer-events: none; z-index: 10; font-family: 'Luckiest Guy', 'Arial Black', Impact, sans-serif; letter-spacing: 0.04em; display: none; }
body.touch #tc { display: block; }
#tc .zone { position: absolute; left: 0; top: 18%; bottom: 0; width: 42%; pointer-events: auto; touch-action: none; }
#tc .base { position: absolute; width: 26vmin; height: 26vmin; margin: -13vmin 0 0 -13vmin; border-radius: 50%; border: 3px solid #fff5; background: #0004; }
#tc .knob { position: absolute; width: 12vmin; height: 12vmin; margin: -6vmin 0 0 -6vmin; border-radius: 50%; background: #fff8; border: 3px solid #fff; box-shadow: 0 2px 6px #0006; }
#tc .btn { position: absolute; pointer-events: auto; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff;
  text-shadow: 0 2px 0 #0008; border: 3px solid #fff6; background: #0005; touch-action: none; box-sizing: border-box; user-select: none; -webkit-user-select: none; overflow: hidden; }
#tc .btn.down { background: #fff4; transform: scale(0.93); }
#tc #t-attack { width: 25vmin; height: 25vmin; right: calc(4vmin + env(safe-area-inset-right)); bottom: 5vmin; font-size: 4.2vmin; border-color: #ffb0a0; background: #ff5a3c66; }
#tc #t-jump { width: 17vmin; height: 17vmin; right: calc(31vmin + env(safe-area-inset-right)); bottom: 3vmin; font-size: 3.4vmin; border-color: #ffe08a; background: #ffb33c55; }
#tc #t-skill { width: 16vmin; height: 16vmin; right: calc(10vmin + env(safe-area-inset-right)); bottom: 32vmin; font-size: 2.6vmin; border-color: #a0e0ff; background: #3cb0ff55; flex-direction: column; line-height: 1; }
#tc #t-skill .cd { position: absolute; inset: 0; background: conic-gradient(#000a var(--cd, 0deg), transparent 0); pointer-events: none; }
#tc #t-skill .nm { position: relative; font-size: 1.9vmin; opacity: 0.9; margin-top: 0.6vmin; }
#tc-rotate { position: fixed; inset: 0; z-index: 40; background: #1a1020; color: #ffe9c7; display: none; align-items: center; justify-content: center;
  flex-direction: column; font-family: 'Luckiest Guy', 'Arial Black', Impact, sans-serif; letter-spacing: 0.04em; font-size: 6vw; text-align: center; gap: 4vw; }
@media (orientation: portrait) { body.touch #tc-rotate { display: flex; } }
`;

function hold(el: HTMLElement, k: keyof typeof held): void {
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
    <div class="btn" id="t-skill"><div class="cd"></div><span style="position:relative">SKILL</span><span class="nm" id="t-skname"></span></div>
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
  hold($('t-skill'), 'skill');

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

/** Skill button: name and cooldown fraction (0 = ready). */
export function setSkillUi(name: string, cdFrac: number): void {
  const n = document.getElementById('t-skname');
  if (n && n.textContent !== name) n.textContent = name;
  const cd = document.querySelector<HTMLElement>('#t-skill .cd');
  cd?.style.setProperty('--cd', `${Math.round(cdFrac * 360)}deg`);
}
