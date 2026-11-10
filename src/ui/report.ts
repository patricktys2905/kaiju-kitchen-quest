// "Report a bug": one tap gathers what's needed to find a bug (what you say happened, the version, your device, your kaiju,
// where you are in a stage, a save summary and the game's last errors) into a short text to copy or share.
// Any element with [data-report] opens it. Also catches every uncaught error and offers a report the first time.
import { save, hero } from '../save';
import { CLASSES } from '../sim/classes';

const errors: { t: string; msg: string }[] = [];
let context: () => string = () => 'camp';
let nudged = false;

/** The game scene tells the reporter where you are (stage, position, state) while a stage runs. */
export function setReportContext(fn: (() => string) | null): void { context = fn ?? (() => 'camp'); }

/** Remember an error (newest last, at most 8) and, once per session, offer to report it. */
export function logError(msg: string): void {
  errors.push({ t: new Date().toLocaleTimeString(), msg: msg.slice(0, 300) });
  if (errors.length > 8) errors.shift();
  if (!nudged) { nudged = true; nudge(); }
}

if (typeof window !== 'undefined') {
  window.addEventListener('error', e => logError(`${e.message} @ ${(e.filename ?? '').split('/').pop()}:${e.lineno}:${e.colno}`));
  window.addEventListener('unhandledrejection', e => logError(`promise: ${String((e.reason as Error)?.message ?? e.reason)}`));
  document.addEventListener('click', e => { if ((e.target as HTMLElement).closest?.('[data-report]')) { e.preventDefault(); e.stopPropagation(); showReport(); } }, true);
}

/** Everything about this moment, as plain text. */
export function reportText(note = ''): string {
  let me = '';
  try {
    const p = hero(), c = CLASSES.find(k => k.species === p.species);
    const cleared = Object.keys(p.cleared).length, hard = Object.keys(p.hardCleared).length;
    me = `${c?.name ?? p.species} Lv ${p.level} · cleared ${cleared} (hard ${hard}) · unlocked ${save.unlocked.length} kaiju · bag ${save.bag.length} · boxes ${save.boxes.length} · crumbs ${save.crumbs} · weapon ${p.equip.weapon?.base ?? '-'}${p.equip.weapon?.twist ? '(' + p.equip.weapon.twist.style + (p.equip.weapon.twist.fx ? '/' + p.equip.weapon.twist.fx : '') + ')' : ''}`;
  } catch (e) { me = `save unreadable: ${(e as Error).message}`; }
  let where = '';
  try { where = context(); } catch (e) { where = `? (${(e as Error).message})`; }
  return [
    `KAIJU KITCHEN QUEST BUG REPORT`,
    `What happened: ${note.trim() || '(not filled in)'}`,
    `Version ${__APP_VERSION__} · ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`,
    `Screen ${innerWidth}x${innerHeight} · ${/Android|iPhone|iPad/.exec(navigator.userAgent)?.[0] ?? 'desktop'} · ${matchMedia('(display-mode: standalone)').matches ? 'installed app' : 'browser'}`,
    `Kaiju: ${me}`,
    `Where: ${where}`,
    `Story: ${save.storyMode ?? 'full'} · mode: ${save.nightmare ? 'nightmare' : save.hard ? 'hard' : 'normal'}${save.spicy?.length ? ' · spicy ' + save.spicy.join(',') : ''}`,
    `Errors: ${errors.length ? '\n' + errors.map(e => `  ${e.t} ${e.msg}`).join('\n') : 'none'}`,
  ].join('\n');
}

let el: HTMLElement | null = null;
function panel(): HTMLElement {
  if (el) return el;
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  el = document.createElement('div'); el.id = 'report'; el.className = 'kq'; document.body.appendChild(el);
  return el;
}

export function showReport(): void {
  const p = panel();
  p.innerHTML = `<div class="box"><h2>🐞 REPORT A BUG</h2>
    <label>What happened? <small>(what you did, what you expected, what went wrong)</small><textarea data-r="note" rows="3" placeholder="e.g. I jumped off the ladder on 1-4 and Bluebeary floated"></textarea></label>
    <pre data-r="text"></pre>
    <div class="row"><button class="pill go" data-r="copy">📋 COPY</button>${'share' in navigator ? '<button class="pill" data-r="share">📤 SHARE</button>' : ''}<button class="pill" data-r="close">CLOSE</button></div>
    <p class="hint">Copy (or share) this and send it to whoever looks after the game. Nothing is sent on its own.</p></div>`;
  p.classList.add('on');
  const note = p.querySelector<HTMLTextAreaElement>('[data-r=note]')!, pre = p.querySelector<HTMLElement>('[data-r=text]')!;
  const refresh = () => { pre.textContent = reportText(note.value); };
  refresh(); note.addEventListener('input', refresh);
  const say = (b: HTMLElement, t: string) => { const o = b.textContent; b.textContent = t; setTimeout(() => { b.textContent = o; }, 1500); };
  p.querySelector<HTMLElement>('[data-r=copy]')!.addEventListener('click', async e => {
    const b = e.currentTarget as HTMLElement;
    try { await navigator.clipboard.writeText(pre.textContent ?? ''); say(b, '✓ COPIED'); }
    catch { const r = document.createRange(); r.selectNodeContents(pre); getSelection()?.removeAllRanges(); getSelection()?.addRange(r); say(b, 'SELECTED: COPY IT'); }
  });
  p.querySelector<HTMLElement>('[data-r=share]')?.addEventListener('click', () => { void navigator.share?.({ title: 'Kaiju Kitchen Quest bug', text: pre.textContent ?? '' }).catch(() => {}); });
  p.querySelector<HTMLElement>('[data-r=close]')!.addEventListener('click', () => p.classList.remove('on'));
}

/** A small, non-blocking offer after the first error of a session. */
function nudge(): void {
  if (typeof document === 'undefined') return;
  const n = document.createElement('button');
  n.className = 'report-nudge'; n.dataset.report = '1';
  n.textContent = '🐞 Something went wrong. Tap to report it';
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 9000);
}

const CSS = `
#report { position: fixed; inset: 0; z-index: 80; display: none; align-items: center; justify-content: center; background: #120a18d8; font-family: Nunito, sans-serif; }
#report.on { display: flex; }
#report .box { background: linear-gradient(#3a2448, #24142e); border: 3px solid #ffd27a; border-radius: 3vmin; padding: 2vmin 3vmin; width: min(120vmin, 94vw); max-height: 94vh; overflow-y: auto; color: #ffe9c7; font-weight: 800; }
#report h2 { font-family: 'Luckiest Guy', sans-serif; font-weight: 400; color: #ffb347; font-size: 4.4vmin; margin: 0 0 1vmin; text-align: center; }
#report label { display: block; font-size: 2.3vmin; } #report label small { color: #c8b8d8; }
#report textarea { width: 100%; box-sizing: border-box; margin-top: 0.6vmin; font: inherit; font-size: 2.3vmin; border-radius: 1vmin; border: 2px solid #ffd27a88; background: #1a1020; color: #ffe9c7; padding: 0.8vmin; }
#report pre { white-space: pre-wrap; word-break: break-word; background: #1a1020; border-radius: 1vmin; padding: 1vmin; font-size: 1.8vmin; color: #d8c8e8; max-height: 32vh; overflow-y: auto; }
#report .row { display: flex; gap: 1.6vmin; justify-content: center; }
#report .hint { font-size: 1.9vmin; color: #b8a8c8; text-align: center; margin: 1vmin 0 0; }
.report-nudge { position: fixed; z-index: 79; left: 50%; bottom: calc(3vmin + env(safe-area-inset-bottom)); transform: translateX(-50%); font: 800 2.4vmin Nunito, sans-serif; padding: 1vmin 2.4vmin; border-radius: 2vmin; border: 2px solid #ff9a8a; background: #3a1420ee; color: #ffd0c8; cursor: pointer; }
`;
