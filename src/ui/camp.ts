// Camp (hub) menus as an HTML overlay: STAGES map, HERO (stats + equipment), SKILLS, BAG, BOXES (gacha opening).
// Also the stage result panel. Everything reads/writes the save (src/save.ts).
import { CLASSES, type Stat } from '../sim/classes';
import { BASES, type Item, LINE_NAMES, MAX_PLUS, RARITY_CSS, RARITY_NAMES, type Slot, enhanceCost, itemLines, itemName, lineText, salvageValue } from '../sim/items';
import { TIER_NAMES, clearCount, likelyTier } from '../sim/loot';
import { SKILLS, MAX_SKILL, type SkillKind, skillsOf } from '../sim/skills';
import { STAGES, WORLDS } from '../sim/stages';
import { STAT_INFO, STATS, derive, xpFor } from '../sim/stats';
import type { BoxTier, LootBox, StageDef } from '../sim/types';
import { RANK_ORDER, type ClearResult, type Rank, autoStats, enhance, equip, hero, levelSkill, openBox, resetStats, salvage, save, spendStat, unequip, persist } from '../save';
import { UI_CSS } from './style';

type Tab = 'stages' | 'hero' | 'skills' | 'bag' | 'boxes';
const RANK_CSS: Record<Rank, string> = { S: '#ffd23c', A: '#7ee87e', B: '#7ac0ff', C: '#d8c8d8', D: '#a89898' };
const TIER_CSS: Record<BoxTier, string> = { 1: '#e0c09a', 2: '#7ee87e', 3: '#7ac0ff', 4: '#ffd23c', 5: '#ff8af4' };
export const SKILL_ICON: Record<SkillKind, string> = { cone: '💥', slam: '🌋', dash: '⚡', bolt: '✨', spin: '🌀', uppercut: '⤴️', mines: '🫐', buff: '🛡️', nova: '🌟', fan: '🎐' };
const SLOT_NAMES: Record<Slot, string> = { weapon: 'Weapon', armor: 'Armor', charm: 'Charm' };
const SKILL_NAME: Record<string, string> = Object.fromEntries(Object.values(SKILLS).flatMap(s => [...s.actives, s.passive].map(a => [a.id, a.name])));

let el: HTMLElement;
let tab: Tab = 'stages';
let selItem: number | null = null;
let onPlay: (stageId: string) => void = () => {};

export function initCamp(play: (stageId: string) => void): void {
  onPlay = play;
  const st = document.createElement('style');
  st.textContent = UI_CSS;
  document.head.appendChild(st);
  el = document.createElement('div');
  el.id = 'camp';
  el.className = 'kq';
  el.style.backgroundImage = 'url(art/bg-far.webp)';
  document.body.appendChild(el);
  for (const id of ['gacha', 'result']) { const d = document.createElement('div'); d.id = id; d.className = 'kq'; document.body.appendChild(d); }
  el.addEventListener('click', onClick);
}

export function showCamp(t?: Tab): void {
  if (t) tab = t;
  el.classList.add('on');
  render();
}
export function hideCamp(): void { el.classList.remove('on'); }

const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
const iconHtml = (it: Item | undefined, extra = '') => it
  ? `<div class="icon" style="--rc:${RARITY_CSS[it.rarity]};background-image:url(art/${BASES[it.base].icon}.webp)" ${extra}>${it.skill ? '<span class="sk">⭐</span>' : ''}${it.plus ? `<b>+${it.plus}</b>` : ''}</div>`
  : `<div class="icon" ${extra}></div>`;

export function stageUnlocked(s: StageDef): boolean {
  const i = STAGES.indexOf(s);
  return i === 0 || !!save.cleared[STAGES[i - 1].id];
}

function render(): void {
  const p = hero();
  const tabs: [Tab, string, number][] = [['stages', 'Stages', 0], ['hero', 'Hero', p.statPts], ['skills', 'Skills', p.skillPts], ['bag', 'Bag', 0], ['boxes', 'Boxes', save.boxes.length]];
  el.innerHTML = `
    <div class="side">${CLASSES.map(c => { const h = save.heroes[c.species]; return `<button class="hp ${c.species === save.selected ? 'on' : ''} ${h.statPts + h.skillPts ? 'pts' : ''}" data-hero="${c.species}" style="background-image:url(art/kaiju-${c.species}.webp)"><i></i><b>${h.level}</b></button>`; }).join('')}</div>
    <div class="main">
      <div class="top"><h1>Kaiju Kitchen Quest</h1><span class="chip">🍪 ${save.crumbs} crumbs</span><span class="chip">🎁 ${save.boxes.length} boxes</span></div>
      <div class="tabs">${tabs.map(([k, n, c]) => `<button class="${tab === k ? 'on' : ''}" data-tab="${k}">${n}${c ? `<em>${c}</em>` : ''}</button>`).join('')}</div>
      <div class="page">${page()}</div>
    </div>`;
}

function page(): string {
  switch (tab) {
    case 'stages': return stagesPage();
    case 'hero': return heroPage();
    case 'skills': return skillsPage();
    case 'bag': return bagPage();
    case 'boxes': return boxesPage();
  }
}

function stagesPage(): string {
  const p = hero();
  return WORLDS.map(w => `<div class="h3">World ${w.id}: ${w.name} <small style="color:#b8a8b8;font-family:Nunito;font-size:1.9vmin">${w.blurb}</small></div>
    <div class="stages">${STAGES.filter(s => s.world === w.id).map(s => {
      const locked = !stageUnlocked(s);
      const rank = save.cleared[s.id] as Rank | undefined;
      const low = p.level < s.rec - 1;
      return `<button class="stage ${locked ? 'locked' : ''}" data-stage="${s.id}" ${locked ? 'disabled' : ''}>
        <div class="pic" style="background-image:url(art/${s.bg}.webp)"></div>
        ${s.boss ? '<span class="boss">BOSS</span>' : ''}
        ${rank ? `<span class="rank" style="color:${RANK_CSS[rank]}">${rank}</span>` : ''}
        <div class="tx"><div class="num">${s.num}</div><div class="nm">${s.name}</div>
        <div class="lv">Monsters Lv ${s.lv[0]}${s.lv[1] !== s.lv[0] ? '–' + s.lv[1] : ''} · <span style="color:${low ? '#ff8a8a' : '#a8f0a8'}">Rec. Lv ${s.rec}</span></div>
        ${rewardLine(s)}</div>
      </button>`;
    }).join('')}</div>`).join('') + `<p style="color:#b8a8b8;font-size:2vmin;margin-top:2vmin">Beat every monster, then walk to the exit on the right. Higher stages give more and better clear boxes. Your rank (time, hits taken, best combo) improves them and can upgrade the boxes you found.</p>`;
}

/** "Clear: [box][box] Lunchbox ×2": the usual clear reward at rank A (more and better on higher stages). */
function rewardLine(s: StageDef): string {
  const tier = likelyTier(s.lv[1], 'A', !!s.boss), n = clearCount(s.lv[1]);
  const img = `<img src="art/box-${tier}.webp" style="width:3.4vmin;height:3.4vmin;object-fit:contain">`;
  return `<div class="lv" style="display:flex;align-items:center;gap:0.4vmin">Clear: ${img.repeat(n)} <span>${TIER_NAMES[tier]}${n > 1 ? ` ×${n}` : ''}</span></div>`;
}

function heroPage(): string {
  const p = hero(), d = derive(p);
  const cls = d.cls;
  const need = xpFor(p.level);
  const statRow = (s: Stat) => `<div><span>${s.toUpperCase()} <b>${d.prim[s]}</b><small>${STAT_INFO[s]}</small></span><button class="plus" data-stat="${s}" ${p.statPts ? '' : 'disabled'}>+</button></div>`;
  const pct = (v: number) => `${Math.round(v * 100)}%`;
  return `<div class="hero">
    <div class="portrait"><img src="art/kaiju-${p.species}.webp"><h2>${cls.name}</h2><div class="role">${cls.role}</div>
      <div style="font-size:2.4vmin;margin-top:1vmin">Level ${p.level}</div><div class="bar"><i style="width:${Math.min(100, p.xp / need * 100)}%"></i></div><div style="font-size:1.7vmin;color:#b8a8b8">${p.xp} / ${need} XP</div></div>
    <div><div class="h3">Stats ${p.statPts ? `<span style="color:#ff8a8a">· ${p.statPts} points</span>` : ''}</div>
      <div class="rows">${STATS.map(statRow).join('')}</div>
      <div style="display:flex;gap:1vmin;margin-top:1.2vmin"><button class="pill" data-act="auto" ${p.statPts ? '' : 'disabled'}>AUTO</button><button class="pill" data-act="reset">RESET</button></div>
      <div class="rows" style="margin-top:1.4vmin">
        <div><span>Attack</span><b>${d.atk}</b></div><div><span>Max HP</span><b>${d.maxHp}</b></div>
        <div><span>Defence</span><b>${d.def} <small style="display:inline">(-${pct(d.dr)})</small></b></div>
        <div><span>Crit</span><b>${d.crit.toFixed(1)}% × ${d.critDmg.toFixed(2)}</b></div>
        <div><span>Skill damage</span><b>${pct(d.skillDmg)}</b></div><div><span>Cooldowns</span><b>-${pct(d.cdr)}</b></div><div><span>Move speed</span><b>${pct(d.speed)}</b></div>
      </div></div>
    <div><div class="h3">Equipment <small style="color:#b8a8b8;font-family:Nunito;font-size:1.7vmin">Your kaiju wears it in stages!</small></div><div class="slots">${(['weapon', 'armor', 'charm'] as Slot[]).map(s => {
      const it = p.equip[s];
      return `<button class="slot" data-eqslot="${s}">${iconHtml(it)}<div class="t">${it ? `<span style="color:${RARITY_CSS[it.rarity]};display:inline;font-size:2.1vmin">${esc(itemName(it))}</span><span>${itemLines(it).map(lineText).join(' · ')}${it.skill ? ` · ⭐ ${skillText(it)}` : ''}</span>` : `${SLOT_NAMES[s]}<span>Empty — equip from the Bag</span>`}</div></button>`;
    }).join('')}</div>
    ${selItem !== null && Object.values(p.equip).some(i => i?.id === selItem) ? detail(Object.values(p.equip).find(i => i?.id === selItem)!, true) : ''}</div>
  </div>`;
}

function skillText(it: Item): string { return it.skill!.id === 'all' ? `+${it.skill!.n} to all skills` : `+${it.skill!.n} ${SKILL_NAME[it.skill!.id] ?? it.skill!.id}`; }

function skillsPage(): string {
  const p = hero(), d = derive(p), sk = skillsOf(p.species);
  const card = (s: { id: string; name: string; desc: string; unlock: number }, icon: string, extra: string) => {
    const learned = p.skills[s.id] ?? 0, eff = d.skillLv[s.id] ?? 0;
    const locked = p.level < s.unlock;
    const can = !locked && p.skillPts > 0 && learned < MAX_SKILL;
    const pips = Array.from({ length: Math.max(MAX_SKILL, eff) }, (_, i) => `<i class="${i < learned ? 'on' : i < eff ? 'bonus' : ''}"></i>`).join('');
    return `<div class="skill ${locked ? 'locked' : ''}"><div class="ic">${icon}</div><div class="t"><b>${s.name}</b> ${learned ? `Lv ${eff}` : ''}<span>${s.desc}</span><span>${locked ? `🔒 Unlocks at hero Lv ${s.unlock}` : learned ? extra : 'Not learned yet — spend a point'}</span><div class="pips">${pips}</div></div>
      <button class="pill ${can ? 'go' : ''}" data-skill="${s.id}" ${can ? '' : 'disabled'}>+</button></div>`;
  };
  return `<div class="h3">Skills ${p.skillPts ? `<span style="color:#ff8a8a">· ${p.skillPts} points</span>` : ''} <small style="color:#b8a8b8;font-family:Nunito;font-size:1.8vmin">Every level gives 1 point. Each skill level: +20% damage, -4% cooldown. ⭐ gear adds bonus levels (blue).</small></div>
    <div class="skills">${sk.actives.map((a, i) => card(a, SKILL_ICON[a.kind], `Button ${i + 1} · ${a.kind === 'buff' ? `${a.buff?.t}s buff` : `${Math.round(a.dmg * 100)}% dmg`} · ${a.cd}s cooldown`)).join('')}
    ${card(sk.passive, '💗', 'Passive: always on')}</div>`;
}

function sortedBag(): Item[] { return [...save.bag].sort((a, b) => b.rarity - a.rarity || b.ilvl - a.ilvl || b.id - a.id); }

function bagPage(): string {
  const bag = sortedBag();
  const sel = bag.find(i => i.id === selItem) ?? bag[0];
  if (sel) selItem = sel.id;
  const commons = save.bag.filter(i => i.rarity === 1).length;
  return bag.length ? `<div class="bagwrap"><div><div class="h3">Bag (${bag.length}) <button class="pill" data-act="salvage-common" style="font-size:1.8vmin;padding:0.6vmin 1.4vmin" ${commons ? '' : 'disabled'}>SALVAGE ALL COMMON (${commons})</button></div>
    <div class="grid">${bag.map(it => iconHtml(it, `data-item="${it.id}" style="--rc:${RARITY_CSS[it.rarity]};background-image:url(art/${BASES[it.base].icon}.webp);${it.id === selItem ? 'outline:3px solid #fff' : ''}"`)).join('')}</div></div>
    ${sel ? detail(sel, false) : ''}</div>` : '<div class="empty">Your bag is empty. Open boxes to find gear!</div>';
}

function detail(it: Item, equipped: boolean): string {
  const p = hero();
  const slot = BASES[it.base].slot;
  const cur = p.equip[slot];
  const cost = enhanceCost(it);
  return `<div class="detail"><div style="display:flex;gap:1.2vmin;align-items:center">${iconHtml(it)}<div><h3 style="color:${RARITY_CSS[it.rarity]}">${esc(itemName(it))}</h3>${RARITY_NAMES[it.rarity]} ${SLOT_NAMES[slot]} · iLv ${it.ilvl}</div></div>
    <div style="margin-top:1vmin">${itemLines(it).map(l => `<div class="ln">${lineText(l)}</div>`).join('')}${it.skill ? `<div class="skl">⭐ ${skillText(it)}</div>` : ''}</div>
    ${!equipped && cur ? `<div style="margin-top:1vmin;color:#b8a8b8;font-size:1.8vmin">Now wearing: <span style="color:${RARITY_CSS[cur.rarity]}">${esc(itemName(cur))}</span><br>${itemLines(cur).map(lineText).join(' · ')}</div>` : ''}
    <div class="btns">
      ${equipped ? `<button class="pill" data-act="unequip" data-slot="${slot}">UNEQUIP</button>` : `<button class="pill go" data-act="equip" data-id="${it.id}">EQUIP</button>`}
      <button class="pill" data-act="enhance" data-id="${it.id}" ${it.plus >= MAX_PLUS || save.crumbs < cost ? 'disabled' : ''}>${it.plus >= MAX_PLUS ? 'MAX +10' : `ENHANCE 🍪${cost}`}</button>
      ${equipped ? '' : `<button class="pill" data-act="salvage" data-id="${it.id}">SALVAGE +🍪${salvageValue(it)}</button>`}
    </div></div>`;
}

function boxesPage(): string {
  if (!save.boxes.length) return '<div class="empty">No boxes. Beat monsters in stages: they drop boxes, and clearing a stage gives more!</div>';
  const tiers = [5, 4, 3, 2, 1] as BoxTier[];
  return `<div class="h3">Loot boxes <button class="pill go" data-act="open-all" style="font-size:2vmin;padding:0.8vmin 1.8vmin">OPEN ALL (${save.boxes.length})</button></div>
    <div class="boxes">${tiers.filter(t => save.boxes.some(b => b.tier === t)).map(t => `<button class="boxcard" data-box="${t}" style="--tc:${TIER_CSS[t]}"><img src="art/box-${t}.webp"><div class="n">×${save.boxes.filter(b => b.tier === t).length}</div><div class="nm">${TIER_NAMES[t]}</div></button>`).join('')}</div>
    <p style="color:#b8a8b8;font-size:2vmin">Better boxes roll rarer gear: Common → Uncommon → Rare → Epic → Legendary. Epic and Legendary gear can boost skills. Item level follows the monsters that dropped it.</p>`;
}

function onClick(e: MouseEvent): void {
  const t = (e.target as HTMLElement).closest<HTMLElement>('[data-tab],[data-hero],[data-stage],[data-stat],[data-skill],[data-item],[data-act],[data-box],[data-eqslot]');
  if (!t || (t as HTMLButtonElement).disabled) return;
  const sp = save.selected;
  const ds = t.dataset;
  if (ds.tab) { tab = ds.tab as Tab; selItem = null; }
  else if (ds.hero) { save.selected = Number(ds.hero); selItem = null; persist(); }
  else if (ds.stage) { const s = STAGES.find(x => x.id === ds.stage)!; if (stageUnlocked(s)) { hideCamp(); onPlay(s.id); } return; }
  else if (ds.stat) spendStat(sp, ds.stat as Stat);
  else if (ds.skill) levelSkill(sp, ds.skill);
  else if (ds.item) selItem = Number(ds.item);
  else if (ds.eqslot) { const it = hero().equip[ds.eqslot as Slot]; selItem = it ? it.id : null; if (!it) { tab = 'bag'; } }
  else if (ds.box) { const i = save.boxes.findIndex(b => b.tier === Number(ds.box)); if (i >= 0) runGacha([i]); return; }
  else if (ds.act) {
    const find = (id: number) => save.bag.find(i => i.id === id) ?? Object.values(hero().equip).find(i => i?.id === id);
    switch (ds.act) {
      case 'auto': autoStats(sp); break;
      case 'reset': resetStats(sp); break;
      case 'equip': equip(sp, Number(ds.id)); tab = 'hero'; break;
      case 'unequip': unequip(sp, ds.slot as Slot); break;
      case 'enhance': { const it = find(Number(ds.id)); if (it) enhance(it); break; }
      case 'salvage': salvage(Number(ds.id)); selItem = null; break;
      case 'salvage-common': for (const it of save.bag.filter(i => i.rarity === 1)) salvage(it.id); selItem = null; break;
      case 'open-all': runGacha(save.boxes.map((_, i) => i)); return;
    }
  }
  render();
}

// ---------- gacha ----------
/** Opens boxes one by one with a shake → burst → card reveal. Highest tiers first. */
export function runGacha(indices: number[]): void {
  const g = document.getElementById('gacha')!;
  let left = indices.length;
  const next = () => {
    if (left <= 0 || !save.boxes.length) { g.className = 'kq'; render(); return; }
    left--;
    // open the best box first
    let bi = 0;
    save.boxes.forEach((b, i) => { if (b.tier > save.boxes[bi].tier) bi = i; });
    const tier = save.boxes[bi].tier;
    const res = openBox(bi)!;
    const it = res.item, rc = RARITY_CSS[it.rarity];
    g.className = 'kq on';
    g.style.setProperty('--gc', rc);
    g.innerHTML = `<div class="rays"></div><div class="left">${left ? `${left} more` : ''}</div>
      <img class="bx shake" src="art/box-${tier}.webp">
      <div class="card"><div class="icon" style="--rc:${rc};background-image:url(art/${BASES[it.base].icon}.webp)"></div>
        <div class="rar">${RARITY_NAMES[it.rarity].toUpperCase()}</div><h3>${esc(itemName(it))}</h3>
        ${itemLines(it).map(l => `<div class="ln">${lineText(l)}</div>`).join('')}${it.skill ? `<div class="skl">⭐ ${skillText(it)}</div>` : ''}
        <div class="cr">iLv ${it.ilvl} ${SLOT_NAMES[BASES[it.base].slot]} · +🍪${res.crumbs} crumbs</div></div>
      <div class="flash"></div><div class="btns"></div>`;
    const bx = g.querySelector('.bx')!;
    const shakeMs = 500 + it.rarity * 160;
    setTimeout(() => {
      bx.classList.remove('shake'); bx.classList.add('pop');
      g.querySelector('.flash')!.classList.add('go');
      setTimeout(() => {
        g.classList.add('burst', 'reveal');
        const btns = g.querySelector('.btns')!;
        btns.innerHTML = `<button class="pill go" data-g="next">${left ? 'NEXT BOX ▶' : 'DONE'}</button><button class="pill" data-g="equip">EQUIP ON ${CLASSES.find(c => c.species === save.selected)!.name.toUpperCase()}</button>${left > 1 ? '<button class="pill" data-g="skip">SKIP ALL</button>' : ''}`;
        btns.querySelector('[data-g=next]')!.addEventListener('click', next);
        btns.querySelector('[data-g=equip]')!.addEventListener('click', () => { equip(save.selected, it.id); next(); });
        btns.querySelector('[data-g=skip]')?.addEventListener('click', () => { while (left > 0 && save.boxes.length) { left--; openBox(0); } g.className = 'kq'; tab = 'bag'; render(); });
      }, 220);
    }, shakeMs);
  };
  next();
}

// ---------- stage result ----------
export function showResult(o: { stage: StageDef; res: ClearResult | null; time: number; hits: number; combo: number; xp: number; levels: number; failed: boolean },
  act: (a: 'boxes' | 'next' | 'camp' | 'retry') => void): void {
  const r = document.getElementById('result')!;
  const nextStage = STAGES[STAGES.indexOf(o.stage) + 1];
  const res = o.res;
  r.className = 'kq on';
  r.innerHTML = `<div class="panel">
    <h2>${o.failed ? 'KNOCKED OUT!' : o.stage.boss ? 'BOSS DEFEATED!' : 'STAGE CLEAR!'}</h2>
    ${res ? `<div class="rk" style="color:${RANK_CSS[res.rank]}">${res.rank}</div>` : '<div style="font-size:9vmin;margin:1vmin">😵</div>'}
    <div class="st"><div>Time<b>${Math.floor(o.time / 60)}:${String(Math.floor(o.time % 60)).padStart(2, '0')}</b></div><div>Hits taken<b>${o.hits}</b></div><div>Best combo<b>${o.combo}</b></div><div>XP<b>+${o.xp}</b></div></div>
    ${o.levels ? `<div class="note">LEVEL UP ×${o.levels}! Spend your new stat and skill points at camp.</div>` : '<div class="note"></div>'}
    ${res ? `<div class="gots">${res.boxes.map((b: LootBox, i) => `<img src="art/box-${b.tier}.webp" title="${TIER_NAMES[b.tier]}" class="${i < res.upgraded ? 'up' : ''}">`).join('')}</div>
    <div class="note">${res.upgraded ? `Rank ${res.rank} upgraded ${res.upgraded} box${res.upgraded > 1 ? 'es' : ''}! ` : ''}${res.firstClear ? 'First clear bonus box!' : ''}</div>` : '<div class="note">Boxes you found are lost. Level up, gear up and try again!</div>'}
    <div class="btns">
      ${res ? `<button class="pill go" data-r="boxes">OPEN BOXES (${save.boxes.length})</button>` : `<button class="pill go" data-r="retry">RETRY</button>`}
      ${res && nextStage && stageUnlocked(nextStage) ? `<button class="pill" data-r="next">NEXT: ${nextStage.num} ▶</button>` : ''}
      ${res ? '<button class="pill" data-r="retry">REPLAY</button>' : ''}
      <button class="pill" data-r="camp">CAMP</button>
    </div></div>`;
  r.querySelectorAll<HTMLElement>('[data-r]').forEach(b => b.addEventListener('click', () => { r.className = 'kq'; act(b.dataset.r as 'boxes'); }));
}

export function rankBetter(a: Rank, b: Rank): boolean { return RANK_ORDER.indexOf(a) > RANK_ORDER.indexOf(b); }
export { LINE_NAMES };
