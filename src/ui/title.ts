// Title screen (painted key art + HTML logo) and the fullscreen toggle used by the title, camp and pause menu.
import { sfx, unlockAudio } from '../audio';

type FsDoc = Document & { webkitFullscreenElement?: Element; webkitExitFullscreen?: () => Promise<void>; webkitFullscreenEnabled?: boolean };
type FsEl = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> };
const doc = document as FsDoc;

/** iPhone Safari has no fullscreen API (the installed home-screen app is fullscreen instead). */
export function canFullscreen(): boolean { return !!(doc.fullscreenEnabled || doc.webkitFullscreenEnabled); }
export function isFullscreen(): boolean { return !!(doc.fullscreenElement || doc.webkitFullscreenElement); }
const standalone = () => matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;
const touchDevice = () => matchMedia('(pointer: coarse)').matches;

/** Must be called from a tap/click. Also locks landscape where the browser allows it. */
export async function setFullscreen(on: boolean): Promise<void> {
  try {
    if (on && !isFullscreen()) {
      const el = document.documentElement as FsEl;
      await (el.requestFullscreen ? el.requestFullscreen({ navigationUI: 'hide' }) : el.webkitRequestFullscreen?.());
      await (screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> }).lock?.('landscape').catch(() => {});
    } else if (!on && isFullscreen()) {
      await (doc.exitFullscreen ? doc.exitFullscreen() : doc.webkitExitFullscreen?.());
    }
  } catch { /* refused (no gesture, or not allowed in this browser): stay windowed */ }
}
export const toggleFullscreen = () => setFullscreen(!isFullscreen());

/** Button markup; every [data-fs] button on the page updates its label when fullscreen changes. */
export function fsButton(cls = 'chip'): string {
  return canFullscreen() ? `<button class="${cls}" data-fs title="Full screen">${isFullscreen() ? '🗗' : '⛶'}</button>` : '';
}
const syncButtons = () => document.querySelectorAll<HTMLElement>('[data-fs]').forEach(b => {
  const t = b.dataset.fs ? `${isFullscreen() ? '🗗 EXIT FULL SCREEN' : '⛶ FULL SCREEN'}` : isFullscreen() ? '🗗' : '⛶';
  b.textContent = t;
});
document.addEventListener('fullscreenchange', syncButtons);
document.addEventListener('webkitfullscreenchange', syncButtons);
// one listener for every fullscreen button, wherever it is drawn
document.addEventListener('click', e => {
  const b = (e.target as HTMLElement).closest?.('[data-fs]');
  if (!b) return;
  e.stopPropagation(); e.preventDefault();
  void toggleFullscreen();
}, true);

const CSS = `
#title { position: fixed; inset: 0; z-index: 50; overflow: hidden; background: #120a18; font-family: Nunito, Arial, sans-serif; color: #fff4e4; transition: opacity 0.6s; user-select: none; -webkit-user-select: none; }
#title.gone { opacity: 0; pointer-events: none; }
#title .art { position: absolute; inset: -2%; background: url(art/title-key.webp) center/cover no-repeat; animation: tkb 30s ease-in-out infinite alternate; }
@keyframes tkb { from { transform: scale(1.02); } to { transform: scale(1.1) translate(1.5%, -1%); } }
#title::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, #120a18c0, #120a1840 38%, transparent 60%), linear-gradient(transparent 70%, #120a18a0); pointer-events: none; }
#title .heroes { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
#title .heroes .row { position: absolute; right: calc(4vw + env(safe-area-inset-right)); bottom: 13vh; display: flex; align-items: flex-end; gap: min(4vh, 2vw); }
#title .heroes img { height: var(--h); filter: drop-shadow(0 1.4vmin 1.2vmin #0009); transform-origin: 50% 100%; animation: thop 1.6s ease-in-out infinite alternate; animation-delay: var(--d); }
#title .heroes img.fly { position: absolute; right: calc(18vw + env(safe-area-inset-right)); top: 9vh; animation: tfly 2.4s ease-in-out infinite alternate; }
@keyframes thop { to { transform: translateY(-1.2vh) scaleY(1.03); } }
@keyframes tfly { to { transform: translateY(-3vh) rotate(-4deg); } }
#title .logo { position: absolute; z-index: 1; left: calc(5vw + env(safe-area-inset-left)); top: 9vh; width: min(46vw, 90vmin); text-align: center; }
#title h1 { margin: 0; font-family: 'Luckiest Guy', sans-serif; font-weight: 400; line-height: 0.92; letter-spacing: 0.03em; color: #ffb347;
  font-size: min(9.5vw, 15vmin); text-shadow: 0 0.9vmin 0 #5a1a10, 0 0 0.5vmin #5a1a10, 0 1.6vmin 3vmin #000a; transform: rotate(-3deg); animation: tbob 3s ease-in-out infinite alternate; }
#title h1 span { display: block; color: #fff4e4; font-size: 0.62em; }
#title h1 em { display: block; font-style: normal; color: #9adf6a; font-size: 1.05em; }
@keyframes tbob { to { transform: rotate(-2deg) translateY(-1vmin); } }
#title .tag { margin-top: 2.4vmin; font-weight: 800; font-size: min(2.2vw, 3.4vmin); color: #f0e0d0; text-shadow: 0 0.3vmin 0.6vmin #000; }
#title .btns { position: absolute; z-index: 1; left: calc(5vw + env(safe-area-inset-left)); width: min(46vw, 90vmin); bottom: calc(9vh + env(safe-area-inset-bottom)); display: flex; flex-direction: column; align-items: center; gap: 2.4vmin; }
#title button { font-family: 'Luckiest Guy', sans-serif; letter-spacing: 0.05em; border-radius: 2vmin; cursor: pointer; }
#title .play { font-size: 6vmin; padding: 1.6vmin 7vmin; background: linear-gradient(#ffd27a, #ff9a3a); color: #4a1a08; border: 0.6vmin solid #fff4e4; box-shadow: 0 1vmin 0 #8a3a10, 0 0 4vmin #ffb34788; animation: tpulse 1.1s ease-in-out infinite alternate; }
@keyframes tpulse { to { transform: scale(1.06); box-shadow: 0 1vmin 0 #8a3a10, 0 0 7vmin #ffd27acc; } }
#title .fsb { font-size: 3vmin; padding: 1vmin 3vmin; background: #2a1a30d8; color: #ffd27a; border: 2px solid #ffd27a99; }
#title .hint { font-size: 2.4vmin; font-weight: 800; color: #d8c8d8; text-align: center; text-shadow: 0 0.3vmin 0.6vmin #000; }
#title .ver { position: absolute; z-index: 1; right: calc(2vmin + env(safe-area-inset-right)); bottom: calc(1.6vmin + env(safe-area-inset-bottom)); font-size: 1.8vmin; color: #ffffff88; }
`;

/** Shows the title screen; PLAY (or Enter/Space) closes it. On phones PLAY also goes full screen. */
export function showTitle(onStart: () => void = () => {}): void {
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  const el = document.createElement('div'); el.id = 'title';
  const ios = /iPhone|iPod/.test(navigator.userAgent);
  const hint = !canFullscreen() && ios && !standalone() ? '<div class="hint">For full screen: Share ⇪ → Add to Home Screen</div>' : '';
  // the four starter kaiju, from the game's own art, scaled to the same visual size (equal area, ~30vh square)
  const ART: Record<number, [number, number]> = { 0: [291, 320], 10: [256, 320], 11: [320, 272], 4: [320, 298] };
  const hgt = (sp: number, box: number) => { const [w, h] = ART[sp]; return `calc(${(1 / Math.sqrt(w / h)).toFixed(3)} * min(${box}vh, ${(box / 2).toFixed(1)}vw))`; }; // narrow screens: width-limited too
  const heroes = '<div class="row">' + ([[0, '0.9s'], [10, '0s'], [11, '0.5s']] as [number, string][])
    .map(([sp, d]) => `<img src="art/kaiju-${sp}.webp" alt="" style="--h:${hgt(sp, 30)};--d:${d}">`).join('') + '</div>'
    + `<img class="fly" src="art/kaiju-4.webp" alt="" style="--h:${hgt(4, 26)}">`;
  el.innerHTML = `<div class="art"></div><div class="heroes">${heroes}</div>
    <div class="logo"><h1><span>Kaiju</span>Kitchen<em>Quest</em></h1><div class="tag">The Head Chef is missing. The Mold Crown is rising.</div></div>
    <div class="btns"><button class="play">▶ PLAY</button>${canFullscreen() ? `<button class="fsb" data-fs="long">${isFullscreen() ? '🗗 EXIT FULL SCREEN' : '⛶ FULL SCREEN'}</button>` : ''}${hint}</div>
    <div class="ver">v${__APP_VERSION__}</div>`;
  document.body.appendChild(el);
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    unlockAudio(); sfx('click');
    if (touchDevice() && canFullscreen() && !standalone()) void setFullscreen(true);
    el.classList.add('gone');
    removeEventListener('keydown', key);
    setTimeout(() => el.remove(), 650);
    onStart();
  };
  const key = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') start(); };
  addEventListener('keydown', key);
  el.querySelector('.play')!.addEventListener('click', start);
}
