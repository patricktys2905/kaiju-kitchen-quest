// End of Act 1: a credits roll over the clean Sink, starring the whole cast. Tap to speed up, SKIP to jump out.
import { CLASSES } from '../sim/classes';
import { MOBS, nemesisOf } from '../sim/mobs';
import { WORLDS } from '../sim/stages';
import { STORIES } from '../story/stories';
import { playMusic } from '../audio';

const CSS = `
#credits { position: fixed; inset: 0; z-index: 46; background: #120a18 url(art/still-w5-cure.webp) center/cover; overflow: hidden; font-family: Nunito, Arial, sans-serif; font-weight: 800; color: #fff4e4; text-align: center; }
#credits::before { content: ''; position: absolute; inset: 0; background: #120a18c8; }
#credits .roll { position: absolute; left: 0; right: 0; top: 100%; will-change: transform; }
#credits h1 { font-family: 'Luckiest Guy', sans-serif; color: #ffb347; font-size: 8vmin; margin: 0; text-shadow: 0 0.8vmin 0 #5a1a10; }
#credits h2 { font-family: 'Luckiest Guy', sans-serif; color: #ffd27a; font-size: 4.4vmin; margin: 8vmin 0 2vmin; letter-spacing: 0.05em; }
#credits p { font-size: 2.8vmin; margin: 0.8vmin 0; color: #e8d8f0; }
#credits .star { display: flex; align-items: center; justify-content: center; gap: 2.4vmin; margin: 2vmin 0; }
#credits .star img { height: 13vmin; filter: drop-shadow(0 1vmin 1vmin #000a); }
#credits .star div { text-align: left; min-width: 46vmin; }
#credits .star b { font-family: 'Luckiest Guy', sans-serif; font-size: 3.6vmin; color: #fff; display: block; }
#credits .star i { font-size: 2.3vmin; color: #c8b8d8; }
#credits .me b { color: #ffd27a; }
#credits .skip { position: absolute; right: calc(2vmin + env(safe-area-inset-right)); top: calc(2vmin + env(safe-area-inset-top)); z-index: 2; font-family: 'Luckiest Guy', sans-serif; font-size: 2.4vmin; padding: 1vmin 2vmin; border-radius: 1.4vmin; background: #2a1a30d0; color: #ffd27a; border: 2px solid #ffd27a88; }
`;

let styled = false;

/** Rolls the credits (the kaiju whose story just ended goes first), then calls done. */
export function showCredits(species: number, done: () => void, act = 1): void {
  if (!styled) { styled = true; const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st); }
  const el = document.createElement('div');
  el.id = 'credits';
  const cast = [...CLASSES].sort((a, b) => (a.species === species ? -1 : b.species === species ? 1 : 0));
  const star = (img: string, name: string, line: string, me = false) => `<div class="star ${me ? 'me' : ''}"><img src="art/${img}.webp" alt=""><div><b>${name}</b><i>${line}</i></div></div>`;
  el.innerHTML = `<button class="skip">SKIP ▶▶</button><div class="roll">
    <h1>KAIJU KITCHEN QUEST</h1><p>${act === 2 ? 'Act 2 complete! Old Fruitcake has a seat at the table, and nobody gets forgotten anymore.' : 'Act 1 complete! The Mold Crown is down the drain and the Head Chef is safe.'}</p>
    <h2>Starring</h2>
    ${cast.map(c => star(`kaiju-${c.species}`, c.name, `in "${STORIES[c.species]?.title ?? ''}"`, c.species === species)).join('')}
    <h2>The Nemeses</h2>
    ${cast.map(c => nemesisOf(c.species)).filter((k, i, a) => k && a.indexOf(k) === i).map(k => star(MOBS[k!].art, MOBS[k!].name, 'Maybe not so bad after all?')).join('')}
    <h2>The Bosses</h2>
    ${WORLDS.filter(w => act === 2 ? w.id > 5 : w.id <= 5).map(w => star(MOBS[w.boss].art, MOBS[w.boss].name, act === 2 ? `${w.name} (now invited to dinner)` : `${w.name}${w.id === 5 ? ' (gone down the drain)' : ' (cured, and a bit embarrassed)'}`)).join('')}
    <h2>And</h2>
    <p>Every Crumblet, Sporeling and Moldy Bun who got bonked along the way</p>
    <p>The Head Chef, who will be washing up for a week</p>
    <h2>Thanks for playing!</h2><p>${act === 2 ? 'But wait... what is that van doing outside?' : 'But wait... something stirs at the back of the Fridge.'}</p>
  </div>`;
  document.body.appendChild(el);
  playMusic('camp', true);
  const roll = el.querySelector<HTMLElement>('.roll')!;
  let y = 0, speed = 1, last = performance.now(), raf = 0, over = false;
  const finish = () => { if (over) return; over = true; cancelAnimationFrame(raf); el.remove(); done(); };
  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    y += dt * innerHeight * 0.09 * speed;
    roll.style.transform = `translateY(${-y}px)`;
    if (y > roll.offsetHeight + innerHeight) { finish(); return; }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  el.addEventListener('pointerdown', () => { speed = 5; });
  el.addEventListener('pointerup', () => { speed = 1; });
  el.querySelector('.skip')!.addEventListener('click', e => { e.stopPropagation(); finish(); });
}
