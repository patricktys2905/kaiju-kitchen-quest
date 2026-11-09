// Story scenes: comic-style dialogue over the world's background, with portraits. Tap to advance, SKIP to jump out.
import { CLASSES } from '../sim/classes';
import { MOBS } from '../sim/mobs';
import { WORLDS } from '../sim/stages';
import { STORIES, type StoryLine } from '../story/stories';
import { sfx } from '../audio';

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
@keyframes moldp { to { transform: scale(1.12); } }
#story .box { position: absolute; left: 50%; transform: translateX(-50%); bottom: calc(3vmin + env(safe-area-inset-bottom)); width: min(86vw, 150vmin); min-height: 18vmin; box-sizing: border-box;
  background: #2a1a30f2; border: 3px solid #ffd27a; border-radius: 2.4vmin; padding: 2vmin 3vmin; font-size: 3vmin; line-height: 1.35; box-shadow: 0 1vmin 0 #0008; }
#story .box .who { position: absolute; top: -3.4vmin; left: 3vmin; background: #ffb347; color: #3a1408; font-family: 'Luckiest Guy', sans-serif; font-size: 2.6vmin; padding: 0.4vmin 1.6vmin; border-radius: 1.2vmin; letter-spacing: 0.04em; }
#story .box.n { font-style: italic; color: #e8d8f0; border-color: #8a7aa8; }
#story .box.n .who { display: none; }
#story .box.mold { border-color: #6ad04a; color: #c8f0a8; } #story .box.mold .who { background: #6ad04a; }
#story .next { position: absolute; right: 2.4vmin; bottom: 1.2vmin; font-size: 2vmin; color: #ffd27a; animation: nb 0.8s infinite alternate; }
@keyframes nb { to { transform: translateY(-0.5vmin); } }
#story .skip { position: absolute; right: calc(2vmin + env(safe-area-inset-right)); top: calc(2vmin + env(safe-area-inset-top)); z-index: 2; font-family: 'Luckiest Guy', sans-serif; font-size: 2.4vmin; padding: 1vmin 2vmin; border-radius: 1.4vmin; background: #2a1a30d0; color: #ffd27a; border: 2px solid #ffd27a88; }
`;

let el: HTMLElement | null = null;
function ensure(): HTMLElement {
  if (el) return el;
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  el = document.createElement('div'); el.id = 'story';
  document.body.appendChild(el);
  return el;
}

/** Plays beats (e.g. ['intro', 'w1-open']) of a kaiju's story, then calls done. */
export function playStory(species: number, beats: string[], done: () => void): void {
  const story = STORIES[species];
  const lines: { line: StoryLine; world: number }[] = [];
  for (const b of beats) { const w = Number(/^w(\d)/.exec(b)?.[1] ?? 1); for (const line of story?.beats[b] ?? []) lines.push({ line, world: w }); }
  if (!story || !lines.length) { done(); return; }
  const root = ensure();
  const me = CLASSES.find(c => c.species === species)!;
  let i = 0, typing: number | null = null, full = '';
  const finish = () => { if (typing !== null) clearInterval(typing); root.classList.remove('on'); root.innerHTML = ''; done(); };
  const show = () => {
    if (i >= lines.length) { finish(); return; }
    const { line: [who, text], world } = lines[i];
    const w = WORLDS.find(x => x.id === world) ?? WORLDS[0];
    const boss = MOBS[w.boss];
    const isMe = who === 'me', other = typeof who === 'number' ? who : null;
    const name = who === 'me' ? me.name : who === 'boss' ? boss.name : who === 'mold' ? '???' : other !== null ? CLASSES.find(c => c.species === other)?.name ?? '' : '';
    const rightArt = who === 'boss' ? `art/${boss.art}.webp` : other !== null ? `art/kaiju-${other}.webp` : '';
    root.style.backgroundImage = `url(art/${w.bg}.webp)`;
    root.innerHTML = `<div class="ttl">${story.title}<small>${me.name} · World ${w.id}: ${w.name}</small></div>
      <div class="por l ${isMe ? '' : 'dim'}" style="background-image:url(art/kaiju-${species}.webp)"></div>
      ${who === 'mold' ? '<div class="por r mold"></div>' : rightArt ? `<div class="por r" style="background-image:url(${rightArt})"></div>` : ''}
      <div class="box ${who === 'n' ? 'n' : who === 'mold' ? 'mold' : ''}"><span class="who">${name}</span><span class="tx"></span><span class="next">▼ tap</span></div>
      <button class="skip">SKIP ▶▶</button>`;
    root.querySelector('.skip')!.addEventListener('click', e => { e.stopPropagation(); finish(); });
    const tx = root.querySelector('.tx')!;
    full = text; let k = 0;
    if (typing !== null) clearInterval(typing);
    typing = window.setInterval(() => { k += 2; tx.textContent = full.slice(0, k); if (k >= full.length && typing !== null) { clearInterval(typing); typing = null; } }, 22);
    sfx('click');
  };
  root.onclick = () => {
    if (typing !== null) { clearInterval(typing); typing = null; root.querySelector('.tx')!.textContent = full; return; }
    i++; show();
  };
  root.classList.add('on');
  show();
}
