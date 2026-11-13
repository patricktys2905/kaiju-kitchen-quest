// Free mode menus: the FREE PLAY camp tab (Daily Dungeon / Endless Pantry / Boss Rush), the perk picker between
// Endless floors, and the end-of-run summary. The run itself is played by GameScene (data.free).
import { type FreeMode, type Perk, dailyStage, dayKey, endlessFloor, rushStages } from '../sim/free';
import { MOBS } from '../sim/mobs';
import { WORLDS } from '../sim/stages';
import type { LootBox, StageDef } from '../sim/types';
import { TIER_NAMES } from '../sim/loot';
import { hero, save } from '../save';
import { sfx } from '../audio';
import { stageElements } from '../sim/elements';
import { weakHtml } from './elementUi';

/** One free-mode run in progress (passed from stage to stage). */
export interface FreeRun {
  mode: FreeMode;
  stage: StageDef;
  /** Endless floor / Boss Rush step (1-based) */
  floor: number;
  seed: number;
  perks: string[];
  /** health carried into the next stage, as a share of max HP */
  hpFrac: number;
  /** Boss Rush: time so far; Endless: floors cleared */
  time: number;
  /** boxes banked this run (for the summary) */
  boxes: LootBox[];
  /** Boss Rush: the remaining boss stages */
  queue?: StageDef[];
}

let start: (run: FreeRun) => void = () => {};
export function initFree(fn: (run: FreeRun) => void): void {
  start = fn;
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
}

export function freeData(): NonNullable<typeof save.free> { return (save.free ??= { endless: {}, rush: {} }); }
export const freeUnlocked = () => !!hero().cleared['1-10'];
export const beatenBosses = () => WORLDS.filter(w => hero().cleared[`${w.id}-10`]).map(w => w.id);
const mmss = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

/** The FREE PLAY tab. */
export function freePage(): string {
  if (!freeUnlocked()) return '<div class="freeinfo">🔒 Beat the World 1 boss (1-10) with this kaiju to open Free Play.</div>';
  const f = freeData(), sp = hero().species, day = dayKey(), d = dailyStage(day, hero().level), w = WORLDS.find(x => x.id === d.world)!;
  const bosses = beatenBosses();
  const card = (mode: FreeMode, icon: string, name: string, text: string, info: string, ok = true, weak = '') =>
    `<div class="fcard"><div class="fi">${icon}</div><div class="ft"><b>${name}</b><span>${text}</span>${weak ? `<span class="weakln">${weak}</span>` : ''}<em>${info}</em></div><button class="pill go" data-free="${mode}" ${ok ? '' : 'disabled'}>▶ PLAY</button></div>`;
  return `<div class="free">
    ${card('daily', '📅', 'Daily Dungeon', `A fresh stage every day, the same for everybody. Today: ${w.name}, monsters Lv ${d.lv[0]}.`, f.daily === day ? '✅ Today\'s bonus box claimed. Play again for loot and XP!' : '🎁 Clear it today for a bonus Golden Cloche box', true, weakHtml(stageElements(d)))}
    ${card('endless', '🥫', 'Endless Pantry', 'Arena floors that keep getting tougher. Pick a perk after each floor, a boss every 10th. A box for every floor you clear.', `Best: floor ${f.endless[sp] ?? 0}`)}
    ${card('rush', '👑', 'Boss Rush', `Every boss you've beaten (${bosses.length}), back to back. Health carries over (you get half back between fights).`, f.rush[sp] ? `Best time: ${mmss(f.rush[sp])}` : bosses.length ? 'No best time yet' : 'Beat a world boss first', bosses.length > 0)}
    <p class="hint">Free Play uses your level, gear and potions, and never changes your story progress. Your CPU buddy comes along too.</p>
  </div>`;
}

/** Start a free-mode run from the camp. */
export function startFree(mode: FreeMode): void {
  const lv = hero().level, seed = (Date.now() & 0xffff) + 1;
  const base = { mode, floor: 1, seed, perks: [], hpFrac: 1, time: 0, boxes: [] };
  if (mode === 'daily') start({ ...base, seed: dayKey(), stage: dailyStage(dayKey(), lv) });
  else if (mode === 'endless') start({ ...base, stage: endlessFloor(1, lv, seed) });
  else { const q = rushStages(beatenBosses(), lv); if (q.length) start({ ...base, stage: q[0], queue: q.slice(1) }); }
}

// ---------- overlays ----------
let el: HTMLElement | null = null;
function panel(html: string): HTMLElement {
  if (!el) {
    el = document.createElement('div'); el.id = 'freepanel'; el.className = 'kq'; document.body.appendChild(el);
  }
  el.innerHTML = `<div class="panel">${html}</div>`;
  el.classList.add('on');
  return el;
}
const close = () => el?.classList.remove('on');
export const closeFree = close;
const boxesHtml = (b: LootBox[]) => b.length ? `<div class="gots">${b.map(x => `<img src="art/box-${x.tier}.webp" title="${TIER_NAMES[x.tier]}">`).join('')}</div>` : '';

/** Endless: pick one of three perks (or bank your boxes and stop). */
export function pickPerk(floor: number, choices: Perk[], got: LootBox[], onPick: (p: Perk) => void, onStop: () => void): void {
  sfx('reveal3');
  const p = panel(`<h2>FLOOR ${floor} CLEAR!</h2>${boxesHtml(got)}<p>Pick a perk for the next floor:</p>
    <div class="perks">${choices.map((c, i) => `<button class="perk" data-i="${i}"><i>${c.icon}</i><b>${c.name}</b><span>${c.text}</span></button>`).join('')}</div>
    <div class="btns"><button class="pill" data-stop="1">BANK IT &amp; STOP</button></div>`);
  p.querySelectorAll<HTMLElement>('[data-i]').forEach(b => b.addEventListener('click', () => { close(); sfx('click'); onPick(choices[Number(b.dataset.i)]); }));
  p.querySelector('[data-stop]')!.addEventListener('click', () => { close(); onStop(); });
}

/** Online Endless, for friends: the host is choosing the next perk (it goes to everyone). */
export function waitPerk(floor: number, choices: Perk[], got: LootBox[], onLeave: () => void): void {
  sfx('reveal3');
  const p = panel(`<h2>FLOOR ${floor} CLEAR!</h2>${boxesHtml(got)}<p>The host is picking a perk for everyone…</p>
    <div class="perks">${choices.map(c => `<div class="perk wait"><i>${c.icon}</i><b>${c.name}</b><span>${c.text}</span></div>`).join('')}</div>
    <div class="btns"><button class="pill" data-leave="1">LEAVE ROOM</button></div>`);
  p.querySelector('[data-leave]')!.addEventListener('click', () => { close(); onLeave(); });
}

/** End of a free run. */
export function freeSummary(title: string, lines: string[], boxes: LootBox[], done: () => void): void {
  const p = panel(`<h2>${title}</h2>${lines.map(l => `<p>${l}</p>`).join('')}${boxesHtml(boxes)}
    <p class="small">${boxes.length ? `${boxes.length} box${boxes.length > 1 ? 'es' : ''} added to your Boxes tab.` : 'No boxes this time.'}</p>
    <div class="btns"><button class="pill go" data-ok="1">BACK TO CAMP</button></div>`);
  p.querySelector('[data-ok]')!.addEventListener('click', () => { close(); done(); });
}

export const bossName = (st: StageDef) => MOBS[st.mobs[0]?.kind]?.name ?? 'the boss';
export { mmss };

const CSS = `
#freepanel { position: fixed; inset: 0; z-index: 31; display: none; align-items: center; justify-content: center; background: #120a18d0; }
#freepanel.on { display: flex; }
#freepanel .panel { background: linear-gradient(#3a2448, #24142e); border: 3px solid #ffd27a; border-radius: 3vmin; padding: 2.4vmin 3.6vmin; text-align: center; min-width: 60vmin; max-width: 94vw; color: #ffe9c7; font-family: Nunito, sans-serif; font-weight: 800; }
#freepanel h2 { font-family: 'Luckiest Guy', sans-serif; font-size: 5vmin; color: #ffb347; margin: 0 0 1vmin; }
#freepanel p { font-size: 2.6vmin; margin: 0.8vmin 0; } #freepanel .small { font-size: 2vmin; color: #c8b8d8; }
#freepanel .gots img { height: 7vmin; margin: 0 0.4vmin; }
#freepanel .perks { display: flex; gap: 1.6vmin; justify-content: center; margin: 1.4vmin 0; }
#freepanel .perk { width: 24vmin; padding: 1.6vmin 1vmin; border-radius: 2vmin; border: 2px solid #ffd27a88; background: #1a1020; color: #ffe9c7; display: flex; flex-direction: column; align-items: center; gap: 0.6vmin; font: inherit; }
#freepanel .perk:active { transform: scale(0.96); } #freepanel .perk.wait { opacity: 0.75; }
#freepanel .perk i { font-style: normal; font-size: 6vmin; } #freepanel .perk b { font-family: 'Luckiest Guy', sans-serif; font-size: 2.8vmin; color: #ffd27a; } #freepanel .perk span { font-size: 2.1vmin; }
#freepanel .btns { display: flex; gap: 2vmin; justify-content: center; margin-top: 1.4vmin; }
.kq .free { display: flex; flex-direction: column; gap: 1.4vmin; }
.kq .fcard { display: flex; align-items: center; gap: 2vmin; background: #1a1020aa; border: 2px solid #ffd27a44; border-radius: 2vmin; padding: 1.4vmin 2vmin; }
.kq .fcard .fi { font-size: 7vmin; } .kq .fcard .ft { flex: 1; display: flex; flex-direction: column; gap: 0.4vmin; }
.kq .fcard b { font-family: 'Luckiest Guy', sans-serif; font-size: 3.4vmin; color: #ffd27a; } .kq .fcard span { font-size: 2.2vmin; color: #e8d8f0; } .kq .fcard em { font-size: 2vmin; color: #a8f0a8; font-style: normal; }
.kq .freeinfo { font-size: 2.6vmin; color: #e8d8f0; padding: 3vmin; text-align: center; }
`;
