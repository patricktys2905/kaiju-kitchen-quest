// Online co-op lobby (HTML overlay): host a room or join one by its 4-letter code, see who's in, the host picks the
// stage and starts. The room stays open between stages: after each result everyone comes back here.
// The connections live in this module so they survive the game scene restarting between stages.
import { type Kit, type LobbySeat, MAX_GUESTS, NetGuest, NetHost, type NetMsg } from '../net/net';
import type { HeroProfile } from '../sim/stats';
import { BONUS_STAGES, STAGES, stageById } from '../sim/stages';
import { CLASSES } from '../sim/classes';
import { hero, persist, save } from '../save';
import { hardUnlocked, stageUnlocked } from './camp';
import { sfx } from '../audio';

/** What the game scene needs to run an online stage. Seat 0 is the host; guests[k] is the host-side id of seat k+1. */
export interface NetPlay {
  role: 'host' | 'guest';
  seat: number;
  kits: Kit[];
  seed: number;
  hard: boolean;
  nightmare: boolean;
  guests: number[];
}

export const net: { host: NetHost | null; guest: NetGuest | null } = { host: null, guest: null };
/** Set by the game scene while a stage runs (snapshots, a friend leaving, a friend levelling up). */
export const inGame: {
  snap: ((m: Extract<NetMsg, { t: 'snap' }>) => void) | null;
  left: ((guest: number) => void) | null;
  kit: ((guest: number, kit: Kit) => void) | null;
} = { snap: null, left: null, kit: null };

let el: HTMLElement;
let startGame: (stage: string, play: NetPlay) => void = () => {};
let toCamp: () => void = () => {};
let status = '', statusOk = true;
/** host: who's in (host-side guest id → their kit + route) */
const guests = new Map<number, { kit: Kit; route: 'direct' | 'backup' }>();
let stage = '1-1', hard = false, nightmare = false;
/** guest: the latest lobby from the host */
let lobby: Extract<NetMsg, { t: 'lobby' }> | null = null;

/** Only what the host needs to build your kaiju (no quest counters or story flags). */
export function kitOf(p: HeroProfile = hero()): Kit {
  return { name: save.netName || 'Player', profile: { species: p.species, level: p.level, xp: 0, statPts: 0, alloc: p.alloc, skillPts: 0, skills: p.skills, equip: p.equip, branch: p.branch, cleared: {}, hardCleared: {}, stats: {}, kq: [], seen: [] } };
}

export function initOnline(start: (stage: string, play: NetPlay) => void, camp: () => void): void {
  startGame = start; toCamp = camp;
  el = document.createElement('div');
  el.id = 'online'; el.className = 'kq';
  document.body.appendChild(el);
  const st = document.createElement('style');
  st.textContent = CSS;
  document.head.appendChild(st);
  el.addEventListener('click', onClick);
}

export const isOnline = () => !!(net.host || net.guest);

export function showOnline(): void {
  el.classList.add('on');
  if (net.host) broadcastLobby();
  render();
}
function hide(): void { el.classList.remove('on'); }

function seats(): LobbySeat[] {
  const me = hero();
  return [{ who: 'host', name: save.netName || 'Host', species: me.species, level: me.level },
    ...[...guests].map(([g, v]) => ({ who: 'guest' as const, guest: g, name: v.kit.name, species: v.kit.profile.species, level: v.kit.profile.level, route: v.route }))];
}

function broadcastLobby(): void {
  const h = net.host; if (!h) return;
  const s = seats(), nm = stageById(stage).name;
  s.forEach((_, i) => { if (i > 0) h.send(s[i].guest!, { t: 'lobby', seats: s, you: i, stage, stageName: `${stageById(stage).num} ${nm}`, hard, nightmare }); });
}

function host(): void {
  const h = new NetHost();
  net.host = h; guests.clear();
  const open = [...STAGES].reverse().find(stageUnlocked);
  stage = open?.id ?? '1-1'; hard = false; nightmare = false;
  h.onStatus = (t, ok) => { status = t; statusOk = ok; render(); };
  h.onGuestJoin = (g, name, route, kit) => {
    if (inGame.snap || guests.size >= MAX_GUESTS) { h.send(g, { t: 'bye', reason: guests.size >= MAX_GUESTS ? 'That room is full (4 players).' : 'They\'re in the middle of a stage. Try again in a minute.' }); return; }
    guests.set(g, { kit: { ...kit, name: (name || kit.name).slice(0, 14) }, route }); sfx('pickup'); broadcastLobby(); render();
  };
  h.onKit = (g, kit) => { const v = guests.get(g); if (v) v.kit = { ...kit, name: v.kit.name }; inGame.kit?.(g, kit); if (!inGame.snap) { broadcastLobby(); render(); } };
  h.onGuestLeave = g => { guests.delete(g); inGame.left?.(g); if (!inGame.snap) { broadcastLobby(); render(); } };
  h.open();
  status = 'Opening a room…'; statusOk = true;
}

function join(code: string): void {
  const g = new NetGuest();
  net.guest = g; lobby = null;
  g.kit = kitOf();
  g.onStatus = (t, ok) => { status = t; statusOk = ok; render(); };
  g.onClosed = reason => {
    net.guest = null; lobby = null;
    status = reason; statusOk = false;
    if (inGame.snap) { toCamp(); setTimeout(showOnline, 60); } else render();
  };
  g.onMsg = m => {
    if (m.t === 'snap') inGame.snap?.(m);
    else if (m.t === 'lobby') { lobby = m; if (el.classList.contains('on')) render(); }
    else if (m.t === 'start') {
      document.getElementById('result')?.classList.remove('on');
      hide();
      startGame(m.stage, { role: 'guest', seat: m.seat, kits: m.kits, seed: m.seed, hard: m.hard, nightmare: m.nightmare, guests: [] });
    }
  };
  g.join(code, save.netName || 'Player');
}

export function leaveOnline(): void {
  net.host?.close(); net.guest?.close();
  net.host = null; net.guest = null; guests.clear(); lobby = null;
  inGame.snap = inGame.left = inGame.kit = null;
  status = '';
}

function start(): void {
  const h = net.host; if (!h || !guests.size) return;
  const order = [...guests.keys()];
  const kits = [kitOf(), ...order.map(g => guests.get(g)!.kit)];
  kits[0].name = save.netName || 'Host';
  const seed = (Date.now() & 0xffff) + 1;
  order.forEach((g, i) => h.send(g, { t: 'start', stage, seed, kits, seat: i + 1, hard, nightmare }));
  hide();
  startGame(stage, { role: 'host', seat: 0, kits, seed, hard, nightmare, guests: order });
}

const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
const seatHtml = (s: LobbySeat, me: boolean) => `<div class="seat ${me ? 'me' : ''}"><img src="art/kaiju-${s.species}.webp"><b>${esc(s.name)}</b><span>${CLASSES.find(c => c.species === s.species)?.name ?? ''} · Lv ${s.level}</span>${s.route === 'backup' ? '<em>backup route</em>' : s.who === 'host' ? '<em>host</em>' : ''}</div>`;

function render(): void {
  const st = status ? `<p class="status ${statusOk ? '' : 'bad'}">${esc(status)}</p>` : '';
  let body: string;
  if (net.host) {
    const all = [...STAGES, ...BONUS_STAGES].filter(stageUnlocked);
    const sel = stageById(stage), hOk = hardUnlocked(sel.world), nOk = !!hero().hardCleared[`${sel.world}-10`];
    if (!hOk) hard = false;
    if (!hard || !nOk) nightmare = false;
    body = `<h2>ROOM <span class="code">${net.host.code || '····'}</span></h2>
      <p class="hint">Friends tap <b>ONLINE CO-OP → JOIN</b> and type this code. Up to 4 players.</p>
      <div class="seats">${seats().map((s, i) => seatHtml(s, i === 0)).join('')}${Array.from({ length: MAX_GUESTS - guests.size }, () => '<div class="seat empty">waiting…</div>').join('')}</div>
      <div class="row"><label>Stage <select data-f="stage">${all.map(s => `<option value="${s.id}" ${s.id === stage ? 'selected' : ''}>${s.num} ${esc(s.name)} (Lv ${s.lv[0]}–${s.lv[1]})</option>`).join('')}</select></label>
        <label class="${hOk ? '' : 'off'}"><input type="checkbox" data-f="hard" ${hard ? 'checked' : ''} ${hOk ? '' : 'disabled'}> HARD</label>
        <label class="${nOk && hard ? '' : 'off'}"><input type="checkbox" data-f="nightmare" ${nightmare ? 'checked' : ''} ${nOk && hard ? '' : 'disabled'}> 💀 NIGHTMARE</label></div>
      <p class="hint">Monsters get tougher for each friend. Stand next to a downed friend to pick them up. Everyone gets their own loot.</p>
      ${st}
      <div class="btns"><button class="pill go big" data-o="start" ${guests.size ? '' : 'disabled'}>▶ START${guests.size ? '' : ' (waiting for friends)'}</button><button class="pill" data-o="leave">CLOSE ROOM</button></div>`;
  } else if (net.guest) {
    body = lobby
      ? `<h2>IN ROOM</h2><div class="seats">${lobby.seats.map((s, i) => seatHtml(s, i === lobby!.you)).join('')}</div>
        <p class="stage">Stage: <b>${esc(lobby.stageName)}</b>${lobby.nightmare ? ' · 💀 NIGHTMARE' : lobby.hard ? ' · HARD' : ''}</p>
        <p class="hint">Waiting for the host to start…</p>${st}<div class="btns"><button class="pill" data-o="leave">LEAVE</button></div>`
      : `<h2>JOINING…</h2>${st}<div class="btns"><button class="pill" data-o="leave">CANCEL</button></div>`;
  } else {
    body = `<h2>🌐 ONLINE CO-OP</h2>
      <p class="hint">Play stages together with up to 3 friends, each on their own phone or computer. Everyone brings their own kaiju, levels and gear.</p>
      <div class="row"><label>Your name <input data-f="name" maxlength="14" value="${esc(save.netName || '')}" placeholder="Player"></label></div>
      <div class="btns"><button class="pill go big" data-o="host">HOST A ROOM</button></div>
      <div class="row"><label>Room code <input data-f="code" maxlength="4" autocapitalize="characters" placeholder="ABCD"></label><button class="pill go" data-o="join">JOIN</button></div>
      ${st}
      <div class="btns"><button class="pill" data-o="back">BACK TO CAMP</button></div>`;
  }
  el.innerHTML = `<div class="panel">${body}</div>`;
  el.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-f]').forEach(i => i.addEventListener('change', () => {
    const f = i.dataset.f;
    if (f === 'name') { save.netName = i.value.trim().slice(0, 14); persist(); }
    else if (f === 'stage') { stage = i.value; render(); broadcastLobby(); }
    else if (f === 'hard') { hard = (i as HTMLInputElement).checked; render(); broadcastLobby(); }
    else if (f === 'nightmare') { nightmare = (i as HTMLInputElement).checked; render(); broadcastLobby(); }
  }));
}

function onClick(e: MouseEvent): void {
  const b = (e.target as HTMLElement).closest<HTMLElement>('[data-o]'); if (!b) return;
  const name = el.querySelector<HTMLInputElement>('[data-f=name]');
  if (name) { save.netName = name.value.trim().slice(0, 14); persist(); }
  sfx('click');
  switch (b.dataset.o) {
    case 'host': host(); break;
    case 'join': {
      const code = (el.querySelector<HTMLInputElement>('[data-f=code]')?.value ?? '').trim().toUpperCase();
      if (!/^[A-Z]{4}$/.test(code)) { status = 'Room codes are 4 letters.'; statusOk = false; break; }
      join(code); break;
    }
    case 'start': start(); return;
    case 'leave': leaveOnline(); break;
    case 'back': hide(); toCamp(); return;
  }
  render();
}

const CSS = `
#online { position: fixed; inset: 0; z-index: 28; display: none; align-items: center; justify-content: center; background: #120a18e8 url(art/bg-far.webp) center/cover; background-blend-mode: multiply; }
#online.on { display: flex; }
#online .panel { background: linear-gradient(#3a2448, #24142e); border: 3px solid #ffd27a; border-radius: 3vmin; padding: 2.4vmin 3.6vmin; text-align: center; width: min(110vmin, 94vw); max-height: 94vh; overflow-y: auto; }
#online h2 { font-size: 5vmin; color: #ffb347; margin: 0 0 1vmin; }
#online .code { color: #ffe27a; letter-spacing: 0.3em; font-size: 6vmin; }
#online .hint { color: #d8c8d8; font-size: 2.2vmin; margin: 1vmin 0; }
#online .status { color: #a8f0a8; font-size: 2.3vmin; }
#online .status.bad { color: #ff8a8a; }
#online .stage { color: #ffe9c7; font-size: 2.6vmin; }
#online .row { display: flex; gap: 2vmin; justify-content: center; align-items: center; flex-wrap: wrap; margin: 1.4vmin 0; color: #ffe9c7; font-size: 2.4vmin; }
#online .row .off { opacity: 0.4; }
#online input, #online select { font: inherit; font-size: 2.4vmin; padding: 0.8vmin 1.2vmin; border-radius: 1vmin; border: 2px solid #ffd27a88; background: #1a1020; color: #ffe9c7; margin-left: 1vmin; }
#online input[data-f=code] { width: 12vmin; text-transform: uppercase; letter-spacing: 0.2em; text-align: center; }
#online .btns { display: flex; gap: 2vmin; justify-content: center; margin-top: 1.6vmin; }
#online .seats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.4vmin; margin: 1.4vmin 0; }
#online .seat { background: #1a1020aa; border: 2px solid #ffd27a44; border-radius: 2vmin; padding: 1vmin; display: flex; flex-direction: column; align-items: center; color: #ffe9c7; font-size: 2vmin; min-height: 18vmin; justify-content: center; }
#online .seat.me { border-color: #ffd27a; }
#online .seat.empty { color: #8a7a8a; }
#online .seat img { height: 9vmin; }
#online .seat b { font-family: 'Luckiest Guy', sans-serif; font-size: 2.6vmin; }
#online .seat em { color: #a8e8ff; font-size: 1.6vmin; }
`;
