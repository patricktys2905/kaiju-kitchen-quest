// The Monster Cookbook screen (docs/DROPS-USES.md, B3): the Bag tab's fifth sub-tab. A page per world, a card per monster;
// hand monster drops in for crumbs, map stamps, gold card borders and titles (never anything that changes a fight).
// Everything is drawn from cookbookView() (src/save.ts over src/sim/cookbook.ts): pages are never listed here, so a new
// world's page shows up by itself. The camp (src/ui/camp.ts) owns the click handler: every button here carries
// data-cb="<action>" and the camp passes that string to cookbookClick().
import { sfx } from '../audio';
import { statOf } from '../quests';
import { chooseTitle, cookCardView, cookHandIn, cookHandInSpares, cookbookView, save } from '../save';
import { type BookView, type CardView, type HandInResult, type PageView, cardReward, pageReward, shownTitle } from '../sim/cookbook';
import { ELEMENT_INFO } from '../sim/elements';
import { BONUS_STAGES, STAGES } from '../sim/stages';
import { listText, paidSummary, rewardLine } from './cookbookText';
import { elHtml } from './elementUi';

/** the page shown (a page id), the card opened, the hand-in waiting for HAND IN / KEEP, the title picker */
let pageId: string | null = null, openKind: string | null = null, askKind: string | null = null, picking = false;
/** a page or the book was just completed: drawn once, then it fades by itself */
let fanfare = '';

const img = (key: string, cls = '') => `<img class="${cls}" src="art/${key}.webp" onerror="this.style.visibility='hidden'" alt="">`;
/** Two stars, the earned ones gold and the rest dim (an outline star reads as a full one at phone size). */
const starsHtml = (n: number): string => `<span class="cbst">${[0, 1].map(i => `<i class="${i < n ? 'on' : ''}">★</i>`).join('')}</span>`;
const stageNum = (id: string): string => [...STAGES, ...BONUS_STAGES].find(s => s.id === id)?.num ?? id;
/** A page's stamp: a chef in an inked ring, gold once every card has two stars ('' with no stamp). CSS only. */
export function stampHtml(stamp: null | 'hat' | 'gold' | undefined, title = ''): string {
  return stamp ? `<i class="cbstamp ${stamp}" title="${title || (stamp === 'gold' ? 'Cookbook page complete' : 'Cookbook page: every card at one star')}">🧑‍🍳</i>` : '';
}
/** The pieces other camp screens borrow (the tab bar, the map, the Hero tab) must never take those screens down with them. */
function quiet<T>(f: () => T, or: T): T { try { return f(); } catch (e) { console.error(e); return or; } }
/** world number -> its Cookbook stamp (the map draws them). */
export function worldStamps(): Record<number, 'hat' | 'gold'> {
  return quiet(() => {
    const out: Record<number, 'hat' | 'gold'> = {};
    for (const p of cookbookView().pages) if (p.stamp) out[p.world] = p.stamp;
    return out;
  }, {});
}
/** Cards a hand-in would move up a level: the number on the Bag tab. */
export const cookbookBadge = (): number => quiet(() => cookbookView().badge, 0);
/** The whole book is done (the sub-tab turns gold). */
export const cookbookGold = (): boolean => quiet(() => cookbookView().goldCover, false);
/** The title line under the kaiju's name ('' with none shown). Tapping it opens the picker. */
export function titleHtml(): string {
  const t = quiet(() => shownTitle(save), '');
  return t ? `<button class="cbtitle" data-cb="titles:open" title="Change it in Bag → Cookbook">🎖 ${t}</button>` : '';
}

function currentPage(book: BookView): PageView {
  let pg = book.pages.find(p => p.id === pageId);
  // first look: the first page with something to do
  pg ??= book.pages.find(p => p.canAdvance > 0) ?? book.pages.find(p => p.canHandIn > 0) ?? book.pages[0];
  pageId = pg.id;
  return pg;
}

/** The book's line in the Bag sub-tab row: totals and the title picker. */
export function cookbookHead(): string {
  const book = cookbookView();
  const titles = book.titles.length
    ? `<button class="cbpick ${picking ? 'on' : ''}" data-cb="titles">🎖 ${book.titleName || 'No title'} ${picking ? '▴' : '▾'}</button>`
    : '<span class="cbnone" title="Get every card on a page to two stars">🎖 Titles: finish a page</span>';
  return `<span class="cbtot ${book.goldCover ? 'gold' : ''}">${book.goldCover ? '👑 Head Chef\'s book · ' : ''}Found <b>${book.discovered}</b>/${book.cards} · ★ <b>${book.oneStar}</b> · ★★ <b>${book.twoStar}</b></span><span style="flex:1"></span>${titles}`;
}

function cardHtml(c: CardView): string {
  const prog = c.next ? `${c.handed}/${c.next.need}` : 'done';
  return `<div class="cbcard ${c.discovered ? '' : 'unk'} ${c.goldBorder ? 'gold' : ''} ${c.canAdvance ? 'adv' : ''}" data-cb="card:${c.kind}">
    <b class="nm">${c.discovered ? c.name : '???'}</b>
    <div class="mid"><div class="pic">${img(c.art)}</div>
      <div class="rt">${c.discovered ? starsHtml(c.stars) : ''}${c.discovered || c.bag ? `<span class="dr ${c.bag ? '' : 'none'}">${img(c.dropIcon)}<u>×${c.bag}</u></span>` : ''}</div></div>
    <div class="pg"><div class="bar"><i style="width:${Math.round(c.progress * 100)}%"></i></div><u>${prog}</u></div>
    ${c.usable ? `<button class="pill ${c.canAdvance ? 'go' : ''}" data-cb="hand:${c.kind}"${c.breaks.length ? ' title="Uses drops a SKIP TO BOSS needs: you will be asked first"' : ''}>HAND IN ${c.usable}${c.breaks.length ? ' ⚠' : ''}</button>` : `<span class="noh">${c.level >= 3 ? 'Complete' : c.discovered ? 'No drops' : 'Not found'}</span>`}
  </div>`;
}

function detailHtml(c: CardView): string {
  const known = c.discovered, drop = known || c.bag ? c.dropName : '???';
  const hunt = !known ? (c.bag ? 'Hand in one drop to turn this card over.' : `A monster of World ${c.world}: ${c.worldName}. Beat it until it drops something.`)
    : c.neverWanted ? `No exit asks for this one, so it drops more often (${Math.round(c.dropChance * 100)}%).`
      : `Exits ask for it in ${listText(c.wantedBy.map(stageNum))}. Drops ${Math.round(c.dropChance * 100)}% of the time, more while an exit wants it.`;
  const rows = ([1, 2, 3] as const).map(lv => `<div class="${c.level >= lv ? 'got' : c.next?.level === lv ? 'now' : ''}"><span>${c.level >= lv ? '✓' : '·'} ${lv === 1 ? 'Found' : lv === 2 ? '★' : '★★'}</span><span>${c.needs[lv - 1]} drop${c.needs[lv - 1] > 1 ? 's' : ''}</span><span>${rewardLine(cardReward(c.world, lv))}</span></div>`).join('');
  const warn = c.breaks.length ? `<small class="warn">⚠ Uses drops SKIP TO BOSS on ${listText(c.breaks.map(stageNum))} needs: you will be asked</small>` : '';
  return `<div class="cbdetail ${known ? '' : 'unk'} ${c.goldBorder ? 'gold' : ''}">
    <div class="big">${img(c.art)}${known ? starsHtml(c.stars) : ''}</div>
    <div class="info">
      <h3>${known ? c.name : '???'}</h3>
      <div class="ln dropln ${known || c.bag ? '' : 'hid'}">${img(c.dropIcon)}<span><b>${drop}</b> · you hold <b>${c.bag}</b></span></div>
      <div class="ln">${hunt}</div>
      ${known ? `<div class="ln">Weak to ${elHtml(c.weak)} ${ELEMENT_INFO[c.weak].name} · shrugs off ${elHtml(c.resist)} ${ELEMENT_INFO[c.resist].name}</div>` : ''}
      <div class="ln">Home: World ${c.world} · ${c.worldName} · beaten <b>${statOf(`kill:${c.kind}`)}</b></div>
    </div>
    <div class="side2">
      <div class="ladder">${rows}</div>
      <div class="pg"><div class="bar"><i style="width:${Math.round(c.progress * 100)}%"></i></div><u>${c.next ? `${c.handed}/${c.next.need}` : `${c.handed} handed in`}</u></div>
      ${warn}
      <div class="btns">${c.usable ? `<button class="pill go" data-cb="hand:${c.kind}">HAND IN ${c.usable}</button>` : `<button class="pill" disabled>${c.level >= 3 ? 'CARD COMPLETE' : c.next ? `NEED ${c.next.left} MORE` : ''}</button>`}<button class="pill" data-cb="back">◀ BACK</button></div>
    </div>
  </div>`;
}

/** HAND IN / KEEP, in the look of the title screen's START OVER question. */
function askHtml(c: CardView): string {
  return `<div class="cbask"><div><h2>HAND IN?</h2>
    <p>This uses drops your <b>SKIP TO BOSS</b> on <b>${listText(c.breaks.map(stageNum))}</b> needs.</p>
    <p>${c.usable} ${c.dropName} would go to the ${c.discovered ? c.name : 'new'} card.${c.safe > 0 ? ` ${c.safe} of them ${c.safe > 1 ? 'are' : 'is'} spare.` : ''}</p>
    <div class="row2"><button class="no" data-cb="no">KEEP</button>${c.safe > 0 ? `<button class="mid" data-cb="safe">ONLY THE ${c.safe} SPARE</button>` : ''}<button class="yes" data-cb="yes">HAND IN</button></div></div></div>`;
}

/** The Cookbook sub-tab: world chips, the page's header, its cards (or one card opened), and any question on top. */
export function cookbookBody(): string {
  const book = cookbookView();
  if (!book.pages.length) return '<div class="empty">The Cookbook is empty.</div>';
  const pg = currentPage(book);
  const open = openKind ? pg.cards.find(c => c.kind === openKind) : undefined;
  if (!open) openKind = null;
  const ask = askKind ? cookCardView(askKind) : null;
  if (!ask || !ask.breaks.length) askKind = null;
  const chips = book.pages.map(p => `<button class="${p.id === pg.id ? 'on' : ''} ${p.stamp ?? ''}" data-cb="page:${p.id}" title="World ${p.world}: ${p.name}"><b>${p.world}</b>${starsHtml(p.stars)}${p.canAdvance ? '<em></em>' : p.canHandIn ? '<em class="soft"></em>' : ''}</button>`).join('');
  const next = pg.next ? `Next: every card ${pg.next.level === 1 ? '★' : '★★'} → ${rewardLine(pg.next.reward)}` : `Page complete! Title: ${pg.title.name}`;
  const head = `<div class="cbph"><b>World ${pg.world} · ${pg.name}</b>${stampHtml(pg.stamp)}<span>★ ${pg.oneStar}/${pg.cards.length} · ★★ ${pg.twoStar}/${pg.cards.length}</span><span class="nx ${pg.next ? '' : 'done'}">${next}</span>
    <span class="sp"><button class="pill ${pg.spares ? 'go' : ''}" data-cb="spares:${pg.id}" ${pg.spares ? '' : 'disabled'} title="Hands in every drop on this page that no SKIP TO BOSS needs">HAND IN ALL SPARES${pg.spares ? ` (${pg.spares})` : ''}</button><small>never breaks a SKIP TO BOSS</small></span></div>`;
  const picker = picking && book.titles.length ? `<div class="cbtitles"><span>Show a title under your kaiju's name:</span><button class="pill ${book.title ? '' : 'go'}" data-cb="title:none">None</button>${book.titles.map(t => `<button class="pill ${book.title === t.id ? 'go' : ''}" data-cb="title:${t.id}">🎖 ${t.name}</button>`).join('')}</div>` : '';
  const ff = fanfare; fanfare = '';
  return `<div class="cb ${book.goldCover ? 'goldbook' : ''}">${picker}<div class="cbpages">${chips}</div>${head}
    ${open ? detailHtml(open) : `<div class="cbgrid">${pg.cards.map(cardHtml).join('')}</div>`}
    ${askKind && ask ? askHtml(ask) : ''}${ff}</div>`;
}

export interface CookClick { /** a line for the camp's toast */ flash?: string; /** switch the camp to Bag → Cookbook */ show?: boolean }

/** A page or the whole book was completed: a stamp thumps down in the middle of the screen for a moment. */
function fanfareHtml(results: readonly HandInResult[]): string {
  const sum = paidSummary(results);
  if (!sum.pages.length && !sum.book) return '';
  const book = cookbookView();
  const lines = sum.pages.map(p => { const pg = book.pages.find(x => x.id === p.id); return `<p><b>${pg ? pg.name : `World ${p.id}`} ${p.level >= 2 ? '★★' : '★'}</b> ${rewardLine(pageReward(pg?.world ?? Number(p.id), p.level as 1 | 2))}</p>`; });
  const gold = sum.book || sum.pages.some(p => p.level >= 2);
  return `<div class="cbfan ${gold ? 'gold' : ''}"><div><i class="cbstamp ${gold ? 'gold' : 'hat'}">🧑‍🍳</i><h2>${sum.book ? 'HEAD CHEF!' : 'PAGE COMPLETE!'}</h2>${lines.join('')}${sum.book ? '<p>Every page has two stars: the book turns gold.</p>' : ''}</div></div>`;
}

function handedIn(results: readonly HandInResult[]): CookClick {
  const sum = paidSummary(results);
  if (!sum.handed) return { flash: 'Nothing to hand in' };
  fanfare = fanfareHtml(results);
  sfx(sum.book || sum.pages.some(p => p.level >= 2) ? 'reveal5' : sum.pages.length ? 'reveal3' : sum.crumbs ? 'levelup' : 'pickup');
  // a finished page or book says it all in the middle of the screen: keep the toast short
  return { flash: fanfare ? `📖 Handed in ${sum.handed} · +🍪 ${sum.crumbs}` : sum.text };
}

/** A tap on a [data-cb] element. The camp redraws afterwards and shows `flash` as its toast. */
export function cookbookClick(action: string): CookClick {
  const [act, arg = ''] = action.split(':');
  switch (act) {
    case 'page': pageId = arg; openKind = null; askKind = null; break;
    case 'card': openKind = arg; break;
    case 'back': openKind = null; break;
    // a drop chip on the stage card: open that monster's card
    case 'open': { const c = cookCardView(arg); if (!c) return {}; pageId = c.page; openKind = arg; askKind = null; picking = false; return { show: true }; }
    case 'hand': {
      const c = cookCardView(arg);
      if (!c || !c.usable) return { flash: 'Nothing to hand in' };
      if (c.breaks.length) { askKind = arg; break; } // HAND IN / KEEP first
      return handedIn([cookHandIn(arg)]);
    }
    case 'yes': case 'safe': {
      const kind = askKind, c = kind ? cookCardView(kind) : null; askKind = null;
      if (!kind || !c) break;
      return handedIn([act === 'safe' ? cookHandIn(kind, c.safe) : cookHandIn(kind)]);
    }
    case 'no': askKind = null; return { flash: 'Kept: your SKIP TO BOSS is safe' };
    case 'spares': return handedIn(cookHandInSpares(arg));
    case 'titles': picking = arg === 'open' || !picking; return { show: true };
    case 'title': {
      picking = false;
      if (!chooseTitle(arg === 'none' ? null : arg)) return { flash: 'That title is not earned yet' };
      const t = shownTitle(save);
      return { flash: t ? `🎖 Title shown: ${t}` : 'No title shown' };
    }
  }
  return {};
}

export const COOKBOOK_CSS = `
.kq .cbstamp { display: inline-flex; align-items: center; justify-content: center; width: 1.7em; height: 1.7em; border-radius: 50%; font-style: normal; font-size: 0.95em; line-height: 1; border: 0.14em dashed #ff8a7a; background: #5a1a2088; transform: rotate(-12deg); vertical-align: middle; box-sizing: border-box; flex-shrink: 0; }
.kq .cbstamp.gold { border: 0.14em solid #fff3b0; background: radial-gradient(#ffe27a, #e09a20); box-shadow: 0 0 0.5em #ffd23caa; }
.kq .cbtitle { font: inherit; font-weight: 900; font-size: 2vmin; color: #ffe27a; background: #3a2a18; border: 2px solid #ffd27a88; border-radius: 1.4vmin; padding: 0.2vmin 1.2vmin; margin: 0.4vmin 0; }
.kq .subtabs > button.cbtab.gold { background: linear-gradient(#ffe27a, #e09a20); color: #3a1408; box-shadow: 0 0 1.4vmin #ffd23c88; }
.kq .subtabs > button em { display: inline-block; font-style: normal; font-family: Nunito; font-weight: 900; font-size: 1.5vmin; background: #ff5a6a; color: #fff; border-radius: 1vmin; padding: 0 0.6vmin; margin-left: 0.4vmin; vertical-align: 0.3vmin; }
.kq .cbtot { font-size: 1.9vmin; color: #d8c8d8; white-space: nowrap; } .kq .cbtot b { color: #ffd27a; } .kq .cbtot.gold { color: #ffe27a; }
.kq .subtabs > button.cbpick { font-family: Nunito; font-weight: 900; font-size: 1.9vmin; padding: 0.6vmin 1.4vmin; border-radius: 1.4vmin; background: #3a2a18; border: 2px solid #ffd27a88; color: #ffe27a; white-space: nowrap; }
.kq .subtabs > button.cbpick.on { background: #5a4420; }
.kq .cbnone { font-size: 1.7vmin; color: #8a7a8a; white-space: nowrap; }
.kq .cb { position: relative; }
.kq .cbtitles { display: flex; flex-wrap: wrap; align-items: center; gap: 0.8vmin; background: #1a1020; border: 2px solid #ffd27a66; border-radius: 1.4vmin; padding: 0.8vmin 1.2vmin; margin-bottom: 0.8vmin; font-size: 1.9vmin; color: #e8d8f0; }
.kq .cbtitles .pill { font-family: Nunito; font-weight: 900; font-size: 1.9vmin; padding: 0.5vmin 1.2vmin; letter-spacing: 0; }
.kq .cbpages { display: flex; gap: 0.7vmin; margin-bottom: 0.8vmin; }
.kq .cbpages button { position: relative; flex: 1 1 0; min-width: 0; max-width: 12vmin; display: flex; flex-direction: column; align-items: center; padding: 0.3vmin 0 0.4vmin; border-radius: 1.2vmin; background: #1a1020c0; color: #c8b8c8; border: 2px solid transparent; }
.kq .cbpages button b { font-family: 'Luckiest Guy', sans-serif; font-weight: 400; font-size: 2.4vmin; line-height: 1.1; }
.kq .cbst { display: inline-flex; gap: 0.2vmin; line-height: 1; } .kq .cbst i { font-style: normal; color: #ffffff2e; } .kq .cbst i.on { color: #ffd23c; text-shadow: 0 1px 2px #000, 0 0 0.8vmin #ffd23c88; }
.kq .cbpages .cbst { font-size: 1.8vmin; }
.kq .cbpages button.on { background: #ffb347; color: #3a1408; } .kq .cbpages button.on .cbst i { color: #7a3a0850; } .kq .cbpages button.on .cbst i.on { color: #fff; text-shadow: 0 0 0.5vmin #7a3a08, 0 1px 1px #7a3a08; }
.kq .cbpages button.hat { border-color: #ff8a7a88; } .kq .cbpages button.gold { border-color: #ffd23c; box-shadow: inset 0 0 1.2vmin #ffd23c55; }
.kq .cbpages button em { position: absolute; top: -0.5vmin; right: -0.3vmin; width: 1.8vmin; height: 1.8vmin; border-radius: 50%; background: #ff5a6a; border: 1px solid #1a1020; }
.kq .cbpages button em.soft { background: #ffd27a; width: 1.3vmin; height: 1.3vmin; }
.kq .cbph { display: flex; flex-wrap: wrap; align-items: center; gap: 0.3vmin 1.4vmin; margin-bottom: 0.9vmin; font-size: 1.9vmin; color: #d8c8d8; }
.kq .cbph > b { font-family: 'Luckiest Guy', sans-serif; font-weight: 400; letter-spacing: 0.05em; font-size: 2.5vmin; color: #ffb347; white-space: nowrap; }
.kq .cbph .nx { color: #ffe9c7; } .kq .cbph .nx.done { color: #ffe27a; }
.kq .cbph .pill { font-size: 1.9vmin; padding: 0.7vmin 1.4vmin; white-space: nowrap; }
.kq .cbph .sp { margin-left: auto; display: flex; align-items: center; gap: 1.2vmin; }
.kq .cbph small { font-size: 1.5vmin; color: #a898a8; white-space: nowrap; }
.kq .cbgrid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 1vmin; }
.kq .cbcard { display: flex; flex-direction: column; gap: 0.4vmin; min-width: 0; background: #1a1020d0; border: 2px solid #ffffff26; border-radius: 1.6vmin; padding: 0.8vmin 1vmin 1vmin; cursor: pointer; }
.kq .cbcard.adv { border-color: #7ae87a; } .kq .cbcard.gold { border-color: #ffd23c; box-shadow: 0 0 1.4vmin #ffd23c66, inset 0 0 1.6vmin #ffd23c22; background: #2a2010d8; }
.kq .cbcard .nm { font-size: 2.15vmin; line-height: 1.15; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #ffe9c7; }
.kq .cbcard.unk .nm { color: #8a7a9a; letter-spacing: 0.2em; }
.kq .cbcard .mid { display: flex; align-items: center; gap: 0.6vmin; }
.kq .cbcard .pic { flex: 1 1 0; min-width: 0; height: 13vmin; display: flex; align-items: center; justify-content: center; }
.kq .cbcard .pic img { max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(0 0.4vmin 0.4vmin #0008); }
.kq .cbcard.unk .pic img, .kq .cbdetail.unk .big img { filter: brightness(0) invert(0.34) sepia(0.4) hue-rotate(220deg); }
.kq .cbcard .rt { display: flex; flex-direction: column; align-items: center; gap: 0.3vmin; min-width: 7.5vmin; }
.kq .cbcard .cbst { font-size: 3vmin; } .kq .cbdetail .big .cbst { font-size: 4vmin; margin-top: 0.4vmin; }
.kq .cbcard .dr { display: flex; align-items: center; gap: 0.2vmin; background: #3a2a48; border: 1px solid #ffffff33; border-radius: 1vmin; padding: 0.2vmin 0.6vmin 0.2vmin 0.3vmin; }
.kq .cbcard .dr img { width: 5vmin; height: 5vmin; object-fit: contain; filter: drop-shadow(0 0 0.25vmin #000) drop-shadow(0 0 0.25vmin #000); }
.kq .cbcard .dr u { text-decoration: none; font-size: 2vmin; color: #fff; } .kq .cbcard .dr.none { opacity: 0.45; }
.kq .cb .pg { display: flex; align-items: center; gap: 0.8vmin; } .kq .cb .pg .bar { flex: 1; height: 1.3vmin; margin: 0; } .kq .cb .pg u { text-decoration: none; font-size: 1.95vmin; color: #e8d8f0; white-space: nowrap; }
.kq .cbcard .pill { font-size: 2.1vmin; padding: 0.7vmin 0.4vmin; border-radius: 1.2vmin; white-space: nowrap; }
.kq .cbcard .noh { font-size: 1.8vmin; color: #8a7a9a; text-align: center; padding: 0.9vmin 0; }
.kq .cbdetail { display: grid; grid-template-columns: 24vmin minmax(0, 1.25fr) minmax(0, 1fr); gap: 2vmin; align-items: start; background: #1a1020d8; border: 2px solid #ffffff26; border-radius: 2vmin; padding: 1.4vmin; }
.kq .cbdetail.gold { border-color: #ffd23c; box-shadow: 0 0 1.6vmin #ffd23c55; }
.kq .cbdetail .big { text-align: center; } .kq .cbdetail .big img { width: 22vmin; height: 22vmin; object-fit: contain; filter: drop-shadow(0 0.8vmin 0.8vmin #0008); display: block; margin: 0 auto; }
.kq .cbdetail h3 { font-size: 3vmin; color: #ffd27a; margin-bottom: 0.4vmin; } .kq .cbdetail.unk h3 { color: #8a7a9a; letter-spacing: 0.2em; }
.kq .cbdetail .ln { font-size: 1.95vmin; color: #d8c8d8; margin-top: 0.7vmin; line-height: 1.3; } .kq .cbdetail .ln b { color: #ffe9c7; }
.kq .cbdetail .dropln { display: flex; align-items: center; gap: 0.8vmin; } .kq .cbdetail .dropln img { width: 6.5vmin; height: 6.5vmin; object-fit: contain; background: #3a2a48; border-radius: 1.2vmin; border: 1px solid #ffffff33; filter: drop-shadow(0 0 0.25vmin #000); }
.kq .cbdetail .dropln.hid img { filter: brightness(0) invert(0.34) sepia(0.4) hue-rotate(220deg); }
.kq .cbdetail abbr.el { font-size: 1.15em; }
.kq .ladder { display: flex; flex-direction: column; gap: 0.3vmin; margin-bottom: 0.9vmin; }
.kq .ladder > div { display: grid; grid-template-columns: 9vmin 9vmin 1fr; gap: 0.6vmin; font-size: 1.85vmin; color: #a898a8; background: #24142a; border-radius: 0.9vmin; padding: 0.4vmin 0.9vmin; }
.kq .ladder > div.got { color: #a8f0a8; } .kq .ladder > div.now { color: #ffe9c7; box-shadow: inset 0 0 0 1px #ffd27a88; }
.kq .cbdetail .warn { display: block; color: #ffd27a; font-size: 1.7vmin; margin-top: 0.6vmin; }
.kq .cbdetail .btns { display: flex; gap: 1vmin; margin-top: 1.1vmin; flex-wrap: wrap; } .kq .cbdetail .btns .pill { font-size: 2.2vmin; padding: 0.9vmin 1.8vmin; }
.kq .cbask { position: fixed; inset: 0; z-index: 30; display: flex; align-items: center; justify-content: center; background: #120a18d8; }
.kq .cbask > div { background: linear-gradient(#3a2448, #24142e); border: 3px solid #ffd27a; border-radius: 3vmin; padding: 3vmin 4vmin; max-width: min(90vw, 110vmin); text-align: center; color: #ffe9c7; font-weight: 800; font-size: 2.8vmin; }
.kq .cbask h2 { color: #ffd27a; font-size: 5vmin; margin: 0 0 1.4vmin; } .kq .cbask p { margin: 1vmin 0; } .kq .cbask p b { color: #ffd27a; }
.kq .cbask .row2 { display: flex; gap: 2.4vmin; justify-content: center; margin-top: 2.4vmin; flex-wrap: wrap; }
.kq .cbask button { font-family: 'Luckiest Guy', sans-serif; letter-spacing: 0.05em; font-size: 3.2vmin; padding: 1.2vmin 3.6vmin; border: 2px solid #fff4e4; border-radius: 1.8vmin; }
.kq .cbask .no { background: linear-gradient(#ffd27a, #ff9a3a); color: #4a1a08; } .kq .cbask .mid { background: #4a2c50; color: #ffe9c7; } .kq .cbask .yes { background: #8a2030; color: #fff; }
.kq .cbfan { position: fixed; inset: 0; z-index: 29; display: flex; align-items: center; justify-content: center; pointer-events: none; animation: cbfan 3s forwards; }
.kq .cbfan > div { background: linear-gradient(#3a2448f4, #24142ef4); border: 3px solid #ff8a7a; border-radius: 3vmin; padding: 2.4vmin 5vmin; text-align: center; color: #ffe9c7; font-size: 2.6vmin; box-shadow: 0 0 6vmin #000a; }
.kq .cbfan.gold > div { border-color: #ffd23c; box-shadow: 0 0 6vmin #ffd23c88; }
.kq .cbfan h2 { font-size: 5vmin; color: #ffd27a; margin: 0.6vmin 0; } .kq .cbfan p { margin: 0.5vmin 0; } .kq .cbfan p b { color: #ffe27a; }
.kq .cbfan .cbstamp { font-size: 8vmin; animation: cbthump 0.5s cubic-bezier(0.2, 1.6, 0.4, 1) both; }
@keyframes cbfan { 0% { opacity: 0; } 8%, 80% { opacity: 1; } 100% { opacity: 0; visibility: hidden; } }
@keyframes cbthump { from { transform: rotate(-40deg) scale(3.2); opacity: 0; } to { transform: rotate(-12deg) scale(1); opacity: 1; } }
.kq .wlabel .cbstamp { font-size: 1.25em; margin-left: 0.6vmin; text-shadow: none; } .kq .mappages .cbstamp { font-size: 0.8em; margin-left: 0.5vmin; }
.kq .lv.dropreq button { font: inherit; color: #ffd27a; background: none; padding: 0; white-space: nowrap; } .kq .lv.dropreq button.ok { color: #a8f0a8; }
`;
