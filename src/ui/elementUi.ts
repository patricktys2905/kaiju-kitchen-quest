// Elemental weaknesses, the player-facing bits shared by the camp menus, the Free Play tab, the online room, the
// pause menu and the fight (docs/WEAKNESS-DESIGN.md section 7). Names, icons and colours come from ELEMENT_INFO only.
import { ELEMENT_INFO, type Element, type StageElements, stageMatch } from '../sim/elements';

/** "🔥×4 🍬×3 🔨×2": how many of the stage's monster kinds are weak to each element, biggest first. */
export function weakCounts(se: StageElements): string {
  return se.order.map(o => `${ELEMENT_INFO[o.el].icon}×${o.n}`).join(' ');
}
/** The whole line as plain text: "Weak: 🔥×4 🍬×3 🔨×2 · Boss 🔥 (shrugs off ❄️)". Empty when there is nothing to say. */
export function weakText(se: StageElements): string {
  const mobs = weakCounts(se);
  const boss = se.boss ? `Boss ${ELEMENT_INFO[se.boss.weakTo].icon} (shrugs off ${ELEMENT_INFO[se.boss.resists].icon})` : '';
  return mobs || boss ? `Weak: ${[mobs, boss].filter(Boolean).join(' · ')}` : '';
}
/** One element icon (the tooltip says what counts as that element). */
export function elHtml(el: Element): string {
  const i = ELEMENT_INFO[el];
  return `<abbr class="el" style="--ec:${i.color}" title="${i.name}: ${i.text}">${i.icon}</abbr>`;
}
/** A skill's or weapon's element icon(s), ready to sit in front of its name ('' for a plain one). */
export const elsHtml = (els: readonly Element[]): string => els.length ? els.map(elHtml).join('') + ' ' : '';
/** The same line as HTML (icons carry tooltips; the "shrugs off" part is small so the line stays short). */
export function weakHtml(se: StageElements): string {
  const mobs = se.order.map(o => `<span>${elHtml(o.el)}×${o.n}</span>`).join(' ');
  const boss = se.boss ? `<span>Boss ${elHtml(se.boss.weakTo)}</span> <small>(shrugs off ${elHtml(se.boss.resists)})</small>` : '';
  return mobs || boss ? `Weak: ${[mobs, boss].filter(Boolean).join(' · ')}` : '';
}
/** The green tick on a skill or weapon that fits the stage ('' when it does not, or when no stage is given). */
export function tickHtml(els: readonly Element[], se: StageElements | null | undefined, stageName = 'this stage'): string {
  const m = se && els.length ? stageMatch(els, se) : null;
  return m ? `<abbr class="eltick" title="${m === 'boss' ? `Hits the boss of ${stageName} where it hurts` : `Good against most monsters in ${stageName}`}">✓</abbr>` : '';
}

/** Shared look (added once by the camp; the selectors work in every .kq overlay and in the pause menu). */
export const ELEMENT_CSS = `
.kq abbr.el, .kq abbr.eltick { text-decoration: none; font-style: normal; cursor: inherit; }
.kq abbr.eltick { font-family: Nunito, sans-serif; font-weight: 900; color: #7ef07e; margin-left: 0.4vmin; }
.kq .weakln, #pause .weakln { color: #ffe9c7; } .kq .weakln small, #pause .weakln small { color: #b8a8b8; white-space: nowrap; } .kq .weakln span, #pause .weakln span { white-space: nowrap; }
`;
