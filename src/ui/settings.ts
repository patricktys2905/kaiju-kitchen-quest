// Settings: sound and music volume, screen shake, flashes, text size, touch button size, story scenes, and a "low effects"
// mode for slower phones. Kept apart from the save (localStorage 'kkq-settings'), so START OVER keeps them.
// Any [data-settings] element opens the panel.
import { save, persist } from '../save';
import { setVolumes } from '../audio';

export interface Settings { tips: boolean; sound: number; music: number; shake: 0 | 0.4 | 1; flash: boolean; text: 1 | 1.2 | 1.4; buttons: 1 | 1.2; lowFx: boolean }
const KEY = 'kkq-settings';
const DEFAULTS: Settings = { tips: true, sound: 1, music: 1, shake: 1, flash: true, text: 1, buttons: 1, lowFx: false };
export const settings: Settings = (() => { try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') }; } catch { return { ...DEFAULTS }; } })();

/** Push the settings into the page (text and button scale) and the audio. */
export function applySettings(): void {
  const b = document.body;
  b.style.setProperty('--ts', String(settings.text));
  b.style.setProperty('--bs', String(settings.buttons));
  b.classList.toggle('lowfx', settings.lowFx);
  setVolumes(settings.sound, settings.music);
}
function store(): void { try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch { /* private mode */ } applySettings(); }

let el: HTMLElement | null = null;
export function showSettings(): void {
  if (!el) {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    el = document.createElement('div'); el.id = 'settings'; el.className = 'kq'; document.body.appendChild(el);
    el.addEventListener('input', onInput); el.addEventListener('click', onClick);
  }
  render(); el.classList.add('on');
}

const seg = <T>(key: keyof Settings, opts: [T, string][]) => `<div class="seg" data-key="${key}">${opts.map(([v, l]) => `<button data-v="${v}" class="${String(settings[key]) === String(v) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
function render(): void {
  el!.innerHTML = `<div class="box"><h2>⚙ SETTINGS</h2>
    <div class="grid">
      <label>🔊 Sound</label><input type="range" min="0" max="100" step="5" data-key="sound" value="${Math.round(settings.sound * 100)}">
      <label>🎵 Music</label><input type="range" min="0" max="100" step="5" data-key="music" value="${Math.round(settings.music * 100)}">
      <label>📳 Screen shake</label>${seg('shake', [[1, 'On'], [0.4, 'Less'], [0, 'Off']])}
      <label>⚡ Screen flashes</label>${seg('flash', [[true, 'On'], [false, 'Off']])}
      <label>🔤 Text size</label>${seg('text', [[1, 'Normal'], [1.2, 'Large'], [1.4, 'Extra large']])}
      <label>👆 Touch buttons</label>${seg('buttons', [[1, 'Normal'], [1.2, 'Large']])}
      <label>📖 Story scenes</label><div class="seg" data-key="story"><button data-v="full" class="${save.storyMode !== 'key' ? 'on' : ''}">All</button><button data-v="key" class="${save.storyMode === 'key' ? 'on' : ''}">Key only</button></div>
      <label>💡 Tips</label><div class="seg" data-key="tips"><button data-v="true" class="${settings.tips ? 'on' : ''}">On</button><button data-v="false" class="${settings.tips ? '' : 'on'}">Off</button><button data-v="again">Show them again</button></div>
      <label>🐢 Low effects <small>(slower phones)</small></label>${seg('lowFx', [[false, 'Off'], [true, 'On']])}
    </div>
    <div class="row"><button class="pill" data-report>🐞 REPORT A BUG</button><button class="pill go" data-close>DONE</button></div></div>`;
}
function onInput(e: Event): void {
  const t = e.target as HTMLInputElement; const k = t.dataset.key as 'sound' | 'music' | undefined;
  if (k) { settings[k] = Number(t.value) / 100; store(); }
}
function onClick(e: MouseEvent): void {
  const t = e.target as HTMLElement;
  if (t.closest('[data-close]') || t === el) { el!.classList.remove('on'); return; }
  const b = t.closest<HTMLElement>('.seg [data-v]'); if (!b) return;
  const key = b.parentElement!.dataset.key!, raw = b.dataset.v!;
  if (key === 'story') { save.storyMode = raw as 'full' | 'key'; persist(); }
  else if (key === 'tips' && raw === 'again') { save.tips = []; settings.tips = true; persist(); }
  else (settings as unknown as Record<string, unknown>)[key] = raw === 'true' ? true : raw === 'false' ? false : Number(raw);
  store(); render();
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', e => { if ((e.target as HTMLElement).closest?.('[data-settings]')) { e.preventDefault(); e.stopPropagation(); showSettings(); } }, true);
  const st = document.createElement('style');
  // text and touch-button scale apply to the story box, toasts, the stage panel and the touch controls
  st.textContent = `
#story .box { font-size: calc(var(--ts, 1) * 1em); } #story .box > * { font-size: inherit; }
#hud .toast { font-size: calc(var(--ts, 1) * 3.4vmin); }
.kq .map .info .lv, .kq .map .info .nm { zoom: var(--ts, 1); }
#tc .btn, #tc .sk, #tc #t-attack, #tc #t-jump, #tc #t-ult { zoom: var(--bs, 1); }
#tc .base { zoom: var(--bs, 1); }`;
  document.head.appendChild(st);
  if (document.body) applySettings(); else addEventListener('DOMContentLoaded', applySettings);
}

const CSS = `
#settings { position: fixed; inset: 0; z-index: 78; display: none; align-items: center; justify-content: center; background: #120a18d8; font-family: Nunito, sans-serif; }
#settings.on { display: flex; }
#settings .box { background: linear-gradient(#3a2448, #24142e); border: 3px solid #ffd27a; border-radius: 3vmin; padding: 2vmin 3vmin; width: min(110vmin, 94vw); max-height: 94vh; overflow-y: auto; color: #ffe9c7; font-weight: 800; }
#settings h2 { font-family: 'Luckiest Guy', sans-serif; font-weight: 400; color: #ffb347; font-size: 4.4vmin; margin: 0 0 1.2vmin; text-align: center; }
#settings .grid { display: grid; grid-template-columns: auto 1fr; gap: 1.2vmin 2vmin; align-items: center; font-size: 2.5vmin; }
#settings label small { color: #b8a8c8; font-size: 1.8vmin; }
#settings input[type=range] { width: 100%; accent-color: #ffb347; }
#settings .seg { display: flex; gap: 0.6vmin; flex-wrap: wrap; }
#settings .seg button { font: inherit; font-size: 2.2vmin; padding: 0.6vmin 1.6vmin; border-radius: 1.2vmin; border: 2px solid #ffd27a55; background: #1a1020; color: #d8c8d8; cursor: pointer; }
#settings .seg button.on { background: #ff9a3a; color: #3a1408; border-color: #ffe0a0; }
#settings .row { display: flex; gap: 1.6vmin; justify-content: center; margin-top: 1.6vmin; }
`;
