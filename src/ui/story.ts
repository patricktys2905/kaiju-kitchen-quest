// Story scenes: comic-style dialogue over the world's background, with portraits. Tap to advance, SKIP to jump out.
import { CLASSES } from '../sim/classes';
import { MOBS, nemesisOf } from '../sim/mobs';
import { WORLDS } from '../sim/stages';
import { STORIES, stillFor, type StoryLine } from '../story/stories';
import { sfx } from '../audio';
import { moodOf } from '../story/mood';
import { LEFTOVER_NAMES } from '../story/finale';
import { showCredits } from './credits';

/** Expression portrait for a kaiju saying this line (the neutral one when no mood shows). */
export function faceArt(sp: number, text: string): string {
  const m = moodOf(text);
  return m === 'neutral' ? `art/kaiju-${sp}.webp` : `art/face-${sp}-${m}.webp`;
}

const CSS = `
#story { position: fixed; inset: 0; z-index: 45; display: none; background: #120a18 center/cover no-repeat; font-family: Nunito, Arial, sans-serif; font-weight: 800; color: #fff4e4; }
#story.on { display: block; }
#story::before { content: ''; position: absolute; inset: 0; background: linear-gradient(#120a1840, #120a18d8 70%); }
#story .ttl { position: absolute; left: 0; right: 0; top: calc(3vmin + env(safe-area-inset-top)); text-align: center; font-family: 'Luckiest Guy', sans-serif; font-size: 4vmin; color: #ffb347; letter-spacing: 0.05em; text-shadow: 0 0.5vmin 0 #5a1a10; }
#story .ttl small { display: block; font-family: Nunito; font-size: 2vmin; color: #d8c8d8; letter-spacing: 0; text-shadow: none; }
#story .por { position: absolute; bottom: 24vmin; height: 46vmin; width: 40vmin; background: bottom/contain no-repeat; transition: transform 0.25s, filter 0.25s, opacity 0.25s; filter: drop-shadow(0 1vmin 1.5vmin #000a); }
#story .por.l { left: 6vw; } #story .por.r { right: 6vw; transform: scaleX(-1); }
#story .por.dim { filter: brightness(0.45) drop-shadow(0 1vmin 1.5vmin #000a); }
#story .por.r.dim { transform: scaleX(-1) scale(0.94); } #story .por.l.dim { transform: scale(0.94); }
#story .por.mold { background: radial-gradient(circle, #9adf6a 0 18%, #3a7a2a 30%, transparent 62%); filter: blur(0.5vmin) drop-shadow(0 0 4vmin #6ad04a); animation: moldp 2s ease-in-out infinite alternate; }
#story .por.talk { animation: talk 0.4s ease-out; }
@keyframes talk { 35% { translate: 0 -2.6vmin; } 65% { translate: 0 0.4vmin; } }
#story .por.lo { background: radial-gradient(ellipse 38% 46% at 50% 62%, #1a0e22 0 70%, transparent 72%); filter: drop-shadow(0 0 3vmin #6a4aa0); }
#story .por.lo::before, #story .por.lo::after { content: ''; position: absolute; top: 42%; width: 3vmin; height: 1.6vmin; border-radius: 50%; background: #ffe24a; box-shadow: 0 0 2vmin #ffe24a; animation: blinky 3s infinite; }
#story .por.lo::before { left: 40%; } #story .por.lo::after { left: 54%; }
#story .por.lo.two { transform: scaleX(-1) scale(0.8); filter: drop-shadow(0 0 3vmin #a04a4a); }
@keyframes blinky { 0%, 92%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
#story .box.lo { border-color: #8a6ab8; } #story .box.lo .who { background: #8a6ab8; color: #fff; }
@keyframes moldp { to { transform: scale(1.12); } }
#story .box { position: absolute; left: 50%; transform: translateX(-50%); bottom: calc(3vmin + env(safe-area-inset-bottom)); width: min(86vw, 150vmin); min-height: 18vmin; box-sizing: border-box;
  background: #2a1a30f2; border: 3px solid #ffd27a; border-radius: 2.4vmin; padding: 2vmin 3vmin; font-size: 3vmin; line-height: 1.35; box-shadow: 0 1vmin 0 #0008; }
#story .box .who { position: absolute; top: -3.4vmin; left: 3vmin; background: #ffb347; color: #3a1408; font-family: 'Luckiest Guy', sans-serif; font-size: 2.6vmin; padding: 0.4vmin 1.6vmin; border-radius: 1.2vmin; letter-spacing: 0.04em; }
#story .box.n { font-style: italic; color: #e8d8f0; border-color: #8a7aa8; }
#story .box.n .who { display: none; }
#story .box.mold { border-color: #6ad04a; color: #c8f0a8; } #story .box.mold .who { background: #6ad04a; }
#story .next { position: absolute; right: 2.4vmin; bottom: 1.2vmin; font-size: 2vmin; color: #ffd27a; animation: nb 0.8s infinite alternate; }
@keyframes nb { to { transform: translateY(-0.5vmin); } }
#story .still { position: absolute; inset: 0; overflow: hidden; }
#story .still i { position: absolute; inset: 0; background: center/cover no-repeat; animation: stin 0.7s ease-out both, kb 18s ease-out both; }
#story .still i.out { animation: stout 0.7s ease-in both; }
#story .still:has(i)::after { content: ''; position: absolute; inset: 0; background: linear-gradient(#120a1870, transparent 20%, transparent 58%, #120a18e8 94%); }
@keyframes stin { from { opacity: 0; } } @keyframes stout { to { opacity: 0; } }
@keyframes kb { from { transform: scale(1.02); } to { transform: scale(1.1) translate(-1.5%, -1%); } }
#story .cnt { position: absolute; inset: 0; }
#story .who img { height: 4.8vmin; width: 4.8vmin; object-fit: contain; vertical-align: middle; margin: -1.4vmin 0.8vmin -1.2vmin -0.8vmin; background: #fff4e4; border-radius: 50%; border: 2px solid #3a1408; }
#story .skip { position: absolute; right: calc(2vmin + env(safe-area-inset-right)); top: calc(2vmin + env(safe-area-inset-top)); z-index: 2; font-family: 'Luckiest Guy', sans-serif; font-size: 2.4vmin; padding: 1vmin 2vmin; border-radius: 1.4vmin; background: #2a1a30d0; color: #ffd27a; border: 2px solid #ffd27a88; }
`;

let el: HTMLElement | null = null;
function ensure(): HTMLElement {
  if (el) return el;
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  el = document.createElement('div'); el.id = 'story';
  el.innerHTML = '<div class="still"></div><div class="cnt"></div>';
  document.body.appendChild(el);
  return el;
}

/** Plays beats (e.g. ['intro', 'w1-open']) of a kaiju's story, then calls done. */
export function playStory(species: number, beats: string[], done: () => void): void {
  // the credits roll sits between beats (end of Act 1)
  const ci = beats.indexOf('credits');
  if (ci >= 0) { playStory(species, beats.slice(0, ci), () => showCredits(species, () => playStory(species, beats.slice(ci + 1), done))); return; }
  const story = STORIES[species];
  const lines: { line: StoryLine; world: number; still: string | null }[] = [];
  for (const b of beats) {
    const w = Number(/^w(\d)/.exec(b)?.[1] ?? 1);
    (story?.beats[b] ?? []).forEach((line, k) => lines.push({ line, world: w, still: stillFor(species, b, k) }));
  }
  if (!story || !lines.length) { done(); return; }
  for (const k of new Set(lines.map(l => l.still))) if (k) new Image().src = `art/${k}.webp`; // preload the paintings
  for (const { line: [who, text] } of lines) if (who === 'me' || typeof who === 'number') new Image().src = faceArt(who === 'me' ? species : who, text);
  const root = ensure();
  const stillEl = root.querySelector<HTMLElement>('.still')!, cnt = root.querySelector<HTMLElement>('.cnt')!;
  stillEl.innerHTML = '';
  const me = CLASSES.find(c => c.species === species)!;
  let i = 0, typing: number | null = null, full = '', curStill: string | null = null;
  const finish = () => { if (typing !== null) clearInterval(typing); root.classList.remove('on'); cnt.innerHTML = ''; stillEl.innerHTML = ''; done(); };
  const show = () => {
    if (i >= lines.length) { finish(); return; }
    const { line: [who, text], world, still } = lines[i];
    const w = WORLDS.find(x => x.id === world) ?? WORLDS[0];
    const boss = MOBS[w.boss];
    const isMe = who === 'me', other = typeof who === 'number' ? who : null;
    const foe = nemesisOf(species);
    const name = who === 'me' ? me.name : who === 'boss' ? boss.name : who === 'foe' ? (foe ? MOBS[foe].name : '') : who === 'mold' ? '???' : who === 'lo' || who === 'lo2' ? LEFTOVER_NAMES[who] : other !== null ? CLASSES.find(c => c.species === other)?.name ?? '' : '';
    const rightArt = who === 'boss' ? `art/${boss.art}.webp` : who === 'foe' && foe ? `art/${MOBS[foe].art}.webp` : other !== null ? faceArt(other, text) : '';
    root.style.backgroundImage = `url(art/${w.bg}.webp)`;
    if (still !== curStill) {
      // crossfade: the old painting fades out on top while the new one fades in and slowly zooms
      for (const old of stillEl.querySelectorAll('i')) { old.classList.add('out'); setTimeout(() => old.remove(), 700); }
      if (still) { const img = document.createElement('i'); img.style.backgroundImage = `url(art/${still}.webp)`; stillEl.prepend(img); }
      curStill = still;
    }
    // Who is already painted into the still: the kaiju in its own intro / cliffhanger, the boss in the boss and
    // "cured" paintings, nobody in the world vistas. Anyone not in the painting still gets their portrait.
    const painted = new Set(!still ? [] : /-(intro|cliff|end)$/.test(still) ? ['me'] : /-(boss|cure)$/.test(still) ? ['boss'] : /-hook$/.test(still) ? ['me', 'lo', 'lo2'] : []);
    const face = who === 'me' ? faceArt(species, text) : rightArt;
    const chip = still && face ? `<img src="${face}" alt="">` : '';
    const left = painted.has('me') ? '' : `<div class="por l ${isMe ? 'talk' : 'dim'}" style="background-image:url(${isMe ? face : `art/kaiju-${species}.webp`})"></div>`;
    const right = (who === 'lo' || who === 'lo2') && painted.has(who) ? '' : who === 'lo2' ? '<div class="por r" style="background-image:url(art/boss-stale.webp)"></div>' : who === 'lo' ? '<div class="por r lo"></div>' : who === 'mold' ? '<div class="por r mold"></div>' : rightArt && !(who === 'boss' && painted.has('boss')) ? `<div class="por r ${isMe || who === 'n' ? 'dim' : 'talk'}" style="background-image:url(${rightArt})"></div>` : '';
    cnt.innerHTML = `<div class="ttl">${story.title}<small>${me.name} · World ${w.id}: ${w.name}</small></div>
      ${left}
      ${right}
      <div class="box ${who === 'n' ? 'n' : who === 'mold' ? 'mold' : who === 'lo' || who === 'lo2' ? 'lo' : ''}"><span class="who">${chip}${name}</span><span class="tx"></span><span class="next">▼ tap</span></div>
      <button class="skip">SKIP ▶▶</button>`;
    cnt.querySelector('.skip')!.addEventListener('click', e => { e.stopPropagation(); finish(); });
    const tx = cnt.querySelector('.tx')!;
    full = text; let k = 0;
    if (typing !== null) clearInterval(typing);
    typing = window.setInterval(() => { k += 2; tx.textContent = full.slice(0, k); if (k >= full.length && typing !== null) { clearInterval(typing); typing = null; } }, 22);
    sfx('click');
  };
  root.onclick = () => {
    if (typing !== null) { clearInterval(typing); typing = null; cnt.querySelector('.tx')!.textContent = full; return; }
    i++; show();
  };
  root.classList.add('on');
  show();
}
