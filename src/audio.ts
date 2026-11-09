// All sound is synthesised with WebAudio (no files): short SFX and original looping chiptune tracks
// (camp, World 1, World 2, boss). M toggles mute; the choice is saved.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicBus: GainNode | null = null;
let muted = localStorage.getItem('kkq-mute') === '1';

export function unlockAudio(): void {
  if (ctx) { if (ctx.state === 'suspended') void ctx.resume(); return; }
  try {
    ctx = new AudioContext();
    master = ctx.createGain(); master.gain.value = muted ? 0 : 0.5; master.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = 0.32; musicBus.connect(master);
    if (wanted) playMusic(wanted, true);
  } catch { ctx = null; }
}

export function isMuted(): boolean { return muted; }
export function toggleMute(): boolean {
  muted = !muted;
  localStorage.setItem('kkq-mute', muted ? '1' : '0');
  if (master && ctx) master.gain.setTargetAtTime(muted ? 0 : 0.5, ctx.currentTime, 0.05);
  return muted;
}

function tone(freq: number, dur: number, type: OscillatorType, vol: number, slide = 0, delay = 0, bus?: AudioNode): void {
  if (!ctx || !master) return;
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * slide), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(bus ?? master); o.start(t); o.stop(t + dur + 0.02);
}

function noise(dur: number, vol: number, hp = 800, delay = 0, bus?: AudioNode): void {
  if (!ctx || !master) return;
  const t = ctx.currentTime + delay;
  const buf = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * dur)), ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf;
  const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp;
  const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f); f.connect(g); g.connect(bus ?? master); src.start(t);
}

export type Sfx = 'swing' | 'hit' | 'crit' | 'hurt' | 'jump' | 'land' | 'dodge' | 'skill' | 'heal' | 'potion' | 'pickup' | 'drop' | 'levelup' | 'kill'
  | 'boss' | 'stagger' | 'boom' | 'coin' | 'click' | 'shake' | 'reveal1' | 'reveal3' | 'reveal5' | 'clear' | 'fail' | 'portal';

export function sfx(s: Sfx): void {
  if (!ctx || muted) return;
  switch (s) {
    case 'swing': noise(0.09, 0.18, 2500); break;
    case 'hit': tone(180, 0.09, 'square', 0.18, 0.5); noise(0.06, 0.2, 1200); break;
    case 'crit': tone(320, 0.14, 'square', 0.2, 0.4); noise(0.1, 0.28, 900); tone(880, 0.1, 'triangle', 0.12, 1.2, 0.02); break;
    case 'hurt': tone(220, 0.2, 'sawtooth', 0.16, 0.45); break;
    case 'jump': tone(300, 0.12, 'square', 0.08, 2); break;
    case 'land': noise(0.05, 0.08, 300); break;
    case 'dodge': noise(0.16, 0.14, 1800); tone(500, 0.12, 'triangle', 0.06, 0.6); break;
    case 'skill': tone(440, 0.18, 'sawtooth', 0.1, 1.8); noise(0.18, 0.12, 1500); break;
    case 'heal': [523, 659, 784].forEach((f, i) => tone(f, 0.18, 'triangle', 0.12, 1, i * 0.07)); break;
    case 'potion': tone(600, 0.1, 'sine', 0.14, 1.5); tone(900, 0.12, 'sine', 0.1, 1.3, 0.08); break;
    case 'pickup': tone(880, 0.08, 'square', 0.08); tone(1320, 0.1, 'square', 0.08, 1, 0.06); break;
    case 'drop': tone(660, 0.1, 'triangle', 0.1, 0.8); break;
    case 'kill': tone(140, 0.18, 'square', 0.12, 0.4); noise(0.15, 0.12, 600); break;
    case 'coin': tone(1200, 0.06, 'square', 0.05); tone(1600, 0.08, 'square', 0.05, 1, 0.05); break;
    case 'levelup': [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'square', 0.1, 1, i * 0.09)); break;
    case 'boss': tone(90, 0.8, 'sawtooth', 0.22, 0.6); noise(0.6, 0.15, 200); break;
    case 'stagger': tone(700, 0.3, 'triangle', 0.14, 0.5); break;
    case 'boom': tone(80, 0.35, 'sine', 0.3, 0.4); noise(0.3, 0.25, 150); break;
    case 'click': tone(700, 0.04, 'square', 0.05); break;
    case 'shake': noise(0.07, 0.08, 2000); break;
    case 'reveal1': tone(660, 0.2, 'triangle', 0.12); break;
    case 'reveal3': [660, 880, 1100].forEach((f, i) => tone(f, 0.22, 'triangle', 0.12, 1, i * 0.06)); break;
    case 'reveal5': [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, 0.35, 'square', 0.1, 1, i * 0.07)); noise(0.6, 0.08, 4000, 0.3); break;
    case 'clear': [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, 0.18, 'square', 0.1, 1, i * 0.11)); break;
    case 'fail': [392, 330, 262, 196].forEach((f, i) => tone(f, 0.25, 'triangle', 0.12, 1, i * 0.18)); break;
    case 'portal': tone(400, 0.6, 'sine', 0.1, 2.5); break;
  }
}

// ---------- music: original tunes, one note string per voice ----------
// Notes: letter (+ # / b) + octave, '-' holds, '.' rests. One char-group per step (eighth notes).
export type Track = 'camp' | 'world1' | 'world2' | 'world3' | 'boss';
interface Song { bpm: number; lead: string; bass: string; drums: string; wave: OscillatorType }
const SONGS: Record<Track, Song> = {
  camp: { bpm: 96, wave: 'triangle',
    lead: 'E5 . G5 . A5 - G5 . E5 . D5 . C5 - - . D5 . E5 . G5 . E5 - D5 . C5 . D5 - - - ',
    bass: 'C3 - . . G2 - . . A2 - . . F2 - . . C3 - . . G2 - . . F2 - . . G2 - . . ',
    drums: 'k . h . s . h . k . h . s . h h ' },
  world1: { bpm: 132, wave: 'square',
    lead: 'C5 . E5 G5 . E5 A5 G5 E5 . C5 D5 E5 - . . F5 . A5 C6 . A5 G5 F5 E5 . D5 C5 D5 - . . ',
    bass: 'C3 . C3 . G2 . G2 . A2 . A2 . E2 . E2 . F2 . F2 . C3 . C3 . G2 . G2 . G2 . B2 . ',
    drums: 'k . h k s . h . k . h k s . h h ' },
  world2: { bpm: 118, wave: 'triangle',
    lead: 'A5 . E5 . C6 - B5 A5 G5 . E5 . A5 - - . F5 . A5 . C6 . B5 G5 E5 . G5 . A5 - - . ',
    bass: 'A2 . . A2 E3 . . . F2 . . F2 C3 . . . D3 . . D3 A2 . . . E2 . . E2 G#2 . . . ',
    drums: 'k . h . s . h h k . h . s . h . ' },
  world3: { bpm: 140, wave: 'square',
    lead: 'D5 . F5 . A5 . G5 F5 E5 . C5 . D5 - - . D5 . F5 . A5 C6 A5 G5 F5 . E5 F5 D5 - - . ',
    bass: 'D3 . D3 A2 D3 . D3 A2 A#2 . A#2 F2 C3 . C3 G2 D3 . D3 A2 D3 . D3 A2 A#2 . C3 . A2 . A2 . ',
    drums: 'k . h s k k h s k . h s k . s s ' },
  boss: { bpm: 150, wave: 'sawtooth',
    lead: 'E5 E5 . G5 . E5 D5 . C5 . D5 E5 . B4 . . E5 E5 . G5 . A5 G5 . F#5 . G5 E5 - - . . ',
    bass: 'E2 E2 E3 E2 E2 E3 E2 E3 C2 C2 C3 C2 D2 D2 D3 D2 E2 E2 E3 E2 E2 E3 E2 E3 C2 C2 C3 C2 B1 B1 B2 B1 ',
    drums: 'k h s h k k s h k h s h k k s s ' },
};

const NOTE: Record<string, number> = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
function freq(n: string): number {
  const m = /^([A-G])([#b]?)(\d)$/.exec(n);
  if (!m) return 0;
  const semi = NOTE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + (Number(m[3]) - 4) * 12;
  return 440 * Math.pow(2, semi / 12);
}

let wanted: Track | null = null;
let current: Track | null = null;
let timer: number | null = null;

export function playMusic(t: Track | null, force = false): void {
  wanted = t;
  if (!ctx || !musicBus) return;
  if (t === current && !force) return;
  if (timer !== null) { clearInterval(timer); timer = null; }
  current = t;
  if (!t) return;
  const song = SONGS[t];
  const split = (s: string) => s.trim().split(/\s+/);
  const lead = split(song.lead), bass = split(song.bass), drums = split(song.drums);
  const stepDur = 60 / song.bpm / 2;
  let step = 0;
  const tick = () => {
    if (!ctx || muted) { step++; return; }
    const hold = (arr: string[], i: number) => { let n = 1; while (arr[(i + n) % arr.length] === '-' && n < 8) n++; return n; };
    const li = step % lead.length, bi = step % bass.length, di = step % drums.length;
    if (freq(lead[li])) tone(freq(lead[li]), stepDur * hold(lead, li) * 0.95, song.wave, 0.09, 1, 0, musicBus!);
    if (freq(bass[bi])) tone(freq(bass[bi]), stepDur * hold(bass, bi) * 0.9, 'triangle', 0.16, 1, 0, musicBus!);
    const d = drums[di];
    if (d === 'k') tone(110, 0.12, 'sine', 0.3, 0.4, 0, musicBus!);
    if (d === 's') noise(0.1, 0.15, 1500, 0, musicBus!);
    if (d === 'h') noise(0.03, 0.06, 6000, 0, musicBus!);
    step++;
  };
  tick();
  timer = window.setInterval(tick, stepDur * 1000);
}
