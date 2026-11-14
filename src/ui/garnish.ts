// The Garnish at camp (docs/DROPS-USES.md, B4): candy a monster's drop on its Cookbook card (CANDY IT), wear it (a small ringed badge by the kaiju's name, everywhere a name shows) from the
// card (WEAR) or from the Hero tab's fourth equipment slot (a picker, "None" first). A garnish is a look plus one perk:
// its own monster drops its item more often, except while a map's exit is still collecting that drop. No fighting power.
// Rules and numbers come from src/save.ts (garnishCard, garnishPicker, garnishOf, candyGarnish, wearGarnish) over
// src/sim/garnish.ts; nothing is decided here. The camp (src/ui/camp.ts) owns the click handler: every button here carries
// data-gn="<action>" and the camp passes that string to garnishClick().
import { sfx } from '../audio';
import { candyGarnish, garnishCard, garnishOf, garnishPicker, persist, save, wearGarnish } from '../save';
import { CLASSES } from '../sim/classes';
import type { GarnishLook, GarnishView } from '../sim/garnish';
import { BONUS_STAGES, STAGES } from '../sim/stages';
import { listText } from './cookbookText';
import { settings } from './settings';
import { badgeArt, badgeCss, badgeImgStyle, ensureBadgeFilter } from './garnishBadge';

/** the picker is open (Hero tab), the kind waiting for CANDY IT / KEEP, the flourish drawn once after making one */
let picking = false, askKind: string | null = null, flourish = '';

const kaijuName = (sp: number): string => CLASSES.find(c => c.species === sp)?.name ?? 'Kaiju';
const stageNum = (id: string): string => [...STAGES, ...BONUS_STAGES].find(s => s.id === id)?.num ?? id;
const pct = (v: number): string => `${Math.round(v * 100)}%`;
function quiet<T>(f: () => T, or: T): T { try { return f(); } catch (e) { console.error(e); return or; } }

/** The drop's own icon with the garnish outline: white, or gold when its Cookbook card has two stars. */
export const garnishIcon = (g: Pick<GarnishLook, 'icon' | 'gold'>, cls = ''): string =>
  `<img class="gn ${g.gold ? 'gold' : ''} ${cls}" src="art/${g.icon}.webp" onerror="this.style.visibility='hidden'" alt="">`;
/** "Sugar Ant drops its item more often, except while an exit is collecting it (20% → 35%)" */
const perkLine = (g: GarnishView): string => `${g.perk} <b>(${pct(g.chance.plain)} → ${pct(g.chance.worn)})</b>`;
const wearers = (g: GarnishView): string => g.wornBy.length ? `Worn by ${listText(g.wornBy.map(kaijuName))}` : 'Nobody wears it yet';

/** The Cookbook grid's small badge on a card whose garnish is made (who wears it: tiny faces, and the title text). */
export function garnishBadge(kind: string): string {
  return quiet(() => {
    const g = garnishCard(kind);
    if (!g?.owned) return '';
    const faces = g.wornBy.slice(0, 2).map(sp => `<img class="fc" src="art/kaiju-${sp}.webp" alt="">`).join('') + (g.wornBy.length > 2 ? `<u>+${g.wornBy.length - 2}</u>` : '');
    return `<span class="gnbadge ${g.gold ? 'gold' : ''}" title="Garnish made${g.gold ? ' (gold)' : ''}. ${wearers(g)}">${garnishIcon(g)}${faces}</span>`;
  }, '');
}

/** The Cookbook card's garnish box: what it is, what it costs, why not yet, CANDY IT, WEAR / TAKE OFF, who wears it. */
export function garnishCardHtml(kind: string, discovered: boolean): string {
  return quiet(() => {
    const g = garnishCard(kind);
    // a card not turned over yet shows no garnish box: unless the garnish is already owned (an odd or edited save),
    // which then still gets its WEAR / TAKE OFF here and not only in the Hero tab's picker
    if (!g || (!discovered && !g.owned)) return '';
    const me = save.selected, mine = garnishOf(me)?.kind === kind;
    let state: string, btn: string;
    if (g.owned) {
      state = `<b class="ok">✓ Made${g.gold ? ' · gold outline' : ''}</b> · ${wearers(g)}`;
      btn = mine ? `<button class="pill" data-gn="wear:">TAKE OFF</button>` : `<button class="pill go" data-gn="wear:${kind}">WEAR · ${kaijuName(me)}</button>`;
    } else if (g.block === 'card') {
      state = `Candy <b>${g.cost}</b> ${g.dropName} once this card has one star`;
      btn = '<button class="pill" disabled>NEEDS ONE ★</button>';
    } else if (g.block === 'drops') {
      state = `Costs <b>${g.cost}</b> ${g.dropName} · you hold <b>${g.bag}</b>`;
      btn = `<button class="pill" disabled>NEED ${g.cost - g.bag} MORE</button>`;
    } else {
      state = `Costs <b>${g.cost}</b> ${g.dropName} · yours for good${g.breaks.length ? ` · <span class="warn">⚠ SKIP TO BOSS on ${listText(g.breaks.map(stageNum))} needs them: you will be asked</span>` : ''}`;
      btn = `<button class="pill go" data-gn="candy:${kind}">🍬 CANDY IT · ${g.cost}${g.breaks.length ? ' ⚠' : ''}</button>`;
    }
    return `<div class="gnbox ${g.owned ? 'own' : ''} ${g.gold ? 'gold' : ''}">${garnishIcon(g, g.owned ? '' : 'dim')}
      <div class="tx"><b>GARNISH</b> <span>a badge by your kaiju's name · no fighting power</span><br>${perkLine(g)}<br><i>${state}</i></div>${btn}</div>`;
  }, '');
}

/** The Hero tab's fourth equipment slot. */
export function garnishSlotHtml(): string {
  return quiet(() => {
    const worn = garnishOf(), owned = garnishPicker();
    if (worn) {
      const g = owned.find(x => x.kind === worn.kind) ?? garnishCard(worn.kind);
      return `<button class="slot gslot" data-gn="pick">${iconBox(worn)}<div class="t"><span style="color:${worn.gold ? '#ffd23c' : '#fff'};display:inline;font-size:2.1vmin">${worn.dropName} Garnish</span><span>${g ? perkLine(g) : `${worn.name} drops its item more often`} · no fighting power</span></div></button>`;
    }
    return `<button class="slot gslot" data-gn="pick">${iconBox(null)}<div class="t">Garnish<span>${owned.length ? `Empty — tap to pick one of your ${owned.length}` : 'Empty — candy a monster\'s drop in the Cookbook'}</span></div></button>`;
  }, '');
}
const iconBox = (g: GarnishLook | null): string => `<div class="icon gni">${g ? garnishIcon(g) : '<span class="gnone">🍬</span>'}</div>`;

/** The Garnish as a badge by a name: the drop's icon in a small ring (white, gold when its card has two stars). `tap`
 *  makes it a camp button that toasts the monster and the perk; everywhere it carries them as its hover title. */
export function garnishNameBadge(g: Pick<GarnishLook, 'kind' | 'icon' | 'gold' | 'name' | 'dropName'> | null | undefined, perk = '', tap = false): string {
  if (!g) return '';
  ensureBadgeFilter();
  const tip = `${g.dropName} Garnish · ${perk || `${g.name} drops its item more often`}`.replace(/"/g, '&quot;');
  const img = `<img src="art/${badgeArt(g.kind)}.webp" style="${badgeImgStyle(g.kind)}" onerror="this.style.visibility='hidden'" alt="">`;
  return tap ? `<button class="gnn ${g.gold ? 'gold' : ''}" data-gn="info:${g.kind}" title="${tip}">${img}</button>` : `<span class="gnn ${g.gold ? 'gold' : ''}" title="${tip}">${img}</span>`;
}
/** The selected kaiju's badge for the Hero tab's name line ('' when it wears none). */
export function garnishMyBadge(): string {
  return quiet(() => { const g = garnishOf(); return g ? garnishNameBadge(g, garnishCard(g.kind)?.perk, true) : ''; }, '');
}

function pickerHtml(): string {
  const owned = garnishPicker(), me = save.selected, worn = garnishOf(me)?.kind ?? null;
  const cell = (g: GarnishView | null) => {
    const on = (g?.kind ?? null) === worn, others = g ? g.wornBy.filter(sp => sp !== me) : [];
    return `<button class="${on ? 'on' : ''} ${g?.gold ? 'gold' : ''}" data-gn="wear:${g?.kind ?? ''}" title="${g ? g.perk : 'Wear no garnish'}">
      ${g ? garnishIcon(g) : '<span class="gnone">✕</span>'}<b>${g ? g.name : 'None'}</b>${on ? '<em>WORN</em>' : others.length ? `<u>${others.map(sp => `<img class="fc" src="art/kaiju-${sp}.webp" alt="">`).slice(0, 3).join('')}</u>` : ''}</button>`;
  };
  const cur = worn ? owned.find(g => g.kind === worn) : null;
  return `<div class="gnpick"><div><h2>GARNISH · ${kaijuName(me)}</h2>
    <p>${cur ? perkLine(cur) : owned.length ? 'Pick one: its own monster drops its item more often. No fighting power, free to change.' : 'Candy a monster\'s drop in the Cookbook: open a card with one star.'}</p>
    <div class="gngrid">${cell(null)}${owned.map(cell).join('')}</div>
    <div class="row2">${owned.length ? '' : '<button class="yes" data-gn="book">📖 COOKBOOK</button>'}<button class="no" data-gn="close">DONE</button></div></div></div>`;
}

/** CANDY IT / KEEP, in the look of the Cookbook's HAND IN question. */
function askHtml(g: GarnishView): string {
  return `<div class="cbask"><div><h2>CANDY IT?</h2>
    <p>This uses drops your <b>SKIP TO BOSS</b> on <b>${listText(g.breaks.map(stageNum))}</b> needs.</p>
    <p>${g.cost} ${g.dropName} would be candied into a garnish. You hold ${g.bag}.</p>
    <div class="row2"><button class="no" data-gn="no">KEEP</button><button class="yes" data-gn="yes">CANDY IT</button></div></div></div>`;
}

/** Whatever sits on top of the page: the question, the picker, the flourish (drawn once). Both the Cookbook and the
 *  Hero tab append this. */
export function garnishOverlay(): string {
  return quiet(() => {
    const ask = askKind ? garnishCard(askKind) : null;
    if (!ask || !ask.canMake || !ask.breaks.length) askKind = null;
    const f = flourish; flourish = '';
    return `${askKind && ask ? askHtml(ask) : ''}${picking ? pickerHtml() : ''}${f}`;
  }, '');
}

export interface GarnishClick { /** a line for the camp's toast */ flash?: string; /** switch the camp to Bag → Cookbook */ book?: boolean }

function made(kind: string): GarnishClick {
  const r = candyGarnish(kind);
  if (!r.ok) return { flash: r.block === 'owned' ? 'Already made' : r.block === 'card' ? 'This card needs one star first' : r.block === 'drops' ? 'Not enough drops yet' : 'That cannot be candied' };
  const g = garnishCard(kind);
  sfx('reveal3');
  if (g) flourish = `<div class="cbfan gnfan ${g.gold ? 'gold' : ''}"><div>${garnishIcon(g, 'big')}<h2>CANDIED!</h2><p><b>${g.dropName} Garnish</b> is yours for good.</p><p>Tap WEAR to show it by ${kaijuName(save.selected)}'s name.</p></div></div>`;
  return { flash: `🍬 Candied ${r.cost} ${g?.dropName ?? 'drops'} into a garnish` };
}

/** A tap on a [data-gn] element. The camp redraws afterwards and shows `flash` as its toast. */
export function garnishClick(action: string): GarnishClick {
  const i = action.indexOf(':'), act = i < 0 ? action : action.slice(0, i), arg = i < 0 ? '' : action.slice(i + 1);
  switch (act) {
    case 'pick': picking = true; break; // with none owned the picker says where they come from and offers the Cookbook
    case 'close': picking = false; break;
    case 'info': { const g = garnishCard(arg); return g ? { flash: `🍬 ${g.dropName} Garnish · ${g.perk} (${pct(g.chance.plain)} → ${pct(g.chance.worn)})` } : {}; }
    case 'book': picking = false; return { book: true };
    case 'candy': {
      const g = garnishCard(arg);
      if (!g) return { flash: 'That cannot be candied' };
      if (g.canMake && g.breaks.length) { askKind = arg; break; } // CANDY IT / KEEP first
      return made(arg);
    }
    case 'yes': { const kind = askKind; askKind = null; return kind ? made(kind) : {}; }
    case 'no': askKind = null; return { flash: 'Kept: your SKIP TO BOSS is safe' };
    case 'wear': {
      const me = save.selected;
      if (!wearGarnish(me, arg || null)) return { flash: 'That garnish is not made yet' };
      picking = false; sfx('pickup');
      const g = garnishOf(me);
      return { flash: g ? `🍬 ${kaijuName(me)} wears the ${g.dropName} Garnish` : `${kaijuName(me)} wears no garnish` };
    }
  }
  return {};
}

/** Close anything left open (the camp calls it when the tab changes). */
export function garnishReset(): void { picking = false; askKind = null; }

/** One-time camp toast, the first time a garnish can be made (and none has been yet). '' when there is nothing to say. */
export function garnishTip(): string {
  return quiet(() => {
    if (!settings.tips || (save.tips ?? []).includes('garnish') || save.garnishes?.length) return '';
    const kind = Object.keys(save.drops ?? {}).find(k => (save.drops?.[k] ?? 0) >= 6 && garnishCard(k)?.canMake);
    if (!kind) return '';
    (save.tips ??= []).push('garnish'); persist();
    const g = garnishCard(kind)!;
    return `🍬 New: candy ${g.cost} ${g.dropName} into a Garnish your kaiju wears. Bag → Cookbook → ${g.name}`;
  }, '');
}

const RING = (c: string) => `drop-shadow(0.22vmin 0 0 ${c}) drop-shadow(-0.22vmin 0 0 ${c}) drop-shadow(0 0.22vmin 0 ${c}) drop-shadow(0 -0.22vmin 0 ${c})`;
export const GARNISH_CSS = `
.kq img.gn { object-fit: contain; filter: ${RING('#fff')} drop-shadow(0 0.3vmin 0.3vmin #0008); }
.kq img.gn.gold { filter: ${RING('#ffc83c')} drop-shadow(0 0 0.6vmin #ffd23caa); }
.kq img.gn.dim { opacity: 0.55; }
.kq .gnone { font-size: 4vmin; opacity: 0.45; filter: grayscale(0.6); }
.kq .cbcard { position: relative; }
.kq .gnbadge { position: absolute; top: 3.6vmin; left: 0.6vmin; display: flex; align-items: center; gap: 0.2vmin; background: #24142ad0; border: 1px solid #ffffff55; border-radius: 1.2vmin; padding: 0.3vmin 0.5vmin; z-index: 1; }
.kq .gnbadge.gold { border-color: #ffd23c; }
.kq .gnbadge img.gn { width: 3.6vmin; height: 3.6vmin; }
.kq img.fc { width: 3vmin; height: 3vmin; object-fit: contain; }
.kq .gnbadge u, .kq .gnpick u { text-decoration: none; font-size: 1.5vmin; color: #e8d8f0; }
.kq .gnbox { grid-column: 2 / 4; display: flex; align-items: center; gap: 1.2vmin; background: #24142a; border: 2px solid #ffffff33; border-radius: 1.4vmin; padding: 0.7vmin 1.1vmin; }
.kq .gnbox.own { border-color: #ffffffaa; } .kq .gnbox.gold { border-color: #ffd23c; }
.kq .gnbox img.gn { width: 6.4vmin; height: 6.4vmin; flex-shrink: 0; }
.kq .gnbox .tx { flex: 1; min-width: 0; font-size: 1.8vmin; line-height: 1.3; color: #d8c8d8; }
.kq .gnbox .tx > b { font-family: 'Luckiest Guy', sans-serif; font-weight: 400; letter-spacing: 0.05em; font-size: 2.1vmin; color: #ffd27a; }
.kq .gnbox .tx > span { font-size: 1.6vmin; color: #a898a8; } .kq .gnbox .tx b { color: #ffe9c7; } .kq .gnbox .tx i { font-style: normal; }
.kq .gnbox .tx .ok { color: #a8f0a8; } .kq .gnbox .warn { color: #ffd27a; }
.kq .gnbox .pill { font-size: 2.1vmin; padding: 0.9vmin 1.6vmin; white-space: nowrap; flex-shrink: 0; }
.kq .slot.gslot .gni { display: flex; align-items: center; justify-content: center; }
.kq .slot.gslot .gni img.gn { width: 72%; height: 72%; }
.kq .slot.gslot .t span b { color: #ffe9c7; }
${badgeCss('.gnn', 'max(18px, 1.3em)', 'max(1.5px, 0.09em)')}.gnn { display: inline-block; border: 0; padding: 0; vertical-align: middle; margin: 0 0.15em 0.12em 0.35em; cursor: help; }
.kq .portrait .ttlrow { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; max-width: 100%; font-size: 2.6vmin; }
.kq .gnpick { position: fixed; inset: 0; z-index: 30; display: flex; align-items: center; justify-content: center; background: #120a18d8; }
.kq .gnpick > div { background: linear-gradient(#3a2448, #24142e); border: 3px solid #ffd27a; border-radius: 3vmin; padding: 2vmin 3vmin; width: min(92vw, 150vmin); max-height: 92vh; display: flex; flex-direction: column; text-align: center; color: #ffe9c7; box-sizing: border-box; }
.kq .gnpick h2 { color: #ffd27a; font-size: 4vmin; margin: 0 0 0.6vmin; }
.kq .gnpick p { margin: 0 0 1.2vmin; font-size: 2.1vmin; font-weight: 800; color: #d8c8d8; } .kq .gnpick p b { color: #ffe9c7; }
.kq .gngrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(15vmin, 1fr)); gap: 1vmin; overflow-y: auto; min-height: 0; padding: 0.4vmin; }
.kq .gngrid button { position: relative; display: flex; flex-direction: column; align-items: center; gap: 0.3vmin; min-width: 0; background: #1a1020d0; border: 2px solid #ffffff33; border-radius: 1.6vmin; padding: 1vmin 0.4vmin 0.7vmin; color: #ffe9c7; font: inherit; }
.kq .gngrid button.gold { border-color: #ffd23c88; } .kq .gngrid button.on { border-color: #7ae87a; background: #1a3020; }
.kq .gngrid img.gn { width: 8vmin; height: 8vmin; } .kq .gngrid .gnone { display: flex; align-items: center; justify-content: center; width: 8vmin; height: 8vmin; font-size: 5vmin; }
.kq .gngrid b { font-size: 1.8vmin; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.kq .gngrid em { position: absolute; top: 0.4vmin; right: 0.5vmin; font-style: normal; font-weight: 900; font-size: 1.4vmin; background: #7ae87a; color: #0a2a10; border-radius: 0.8vmin; padding: 0 0.6vmin; }
.kq .gngrid u { position: absolute; top: 0.3vmin; right: 0.4vmin; display: flex; }
.kq .gnpick .row2 { display: flex; gap: 2.4vmin; justify-content: center; margin-top: 1.6vmin; }
.kq .gnpick .row2 button { font-family: 'Luckiest Guy', sans-serif; letter-spacing: 0.05em; font-size: 3vmin; padding: 1vmin 3.6vmin; border: 2px solid #fff4e4; border-radius: 1.8vmin; }
.kq .gnpick .no { background: linear-gradient(#ffd27a, #ff9a3a); color: #4a1a08; } .kq .gnpick .yes { background: #4a2c50; color: #ffe9c7; }
.kq .gnfan img.gn.big { width: 14vmin; height: 14vmin; animation: gnpop 0.5s cubic-bezier(0.2, 1.6, 0.4, 1) both; }
@keyframes gnpop { from { transform: scale(0.2) rotate(-30deg); opacity: 0; } to { transform: none; opacity: 1; } }
`;
