// Shared CSS for the camp menus, gacha reveal and stage overlays.
export const UI_CSS = `
.kq { font-family: Nunito, Arial, sans-serif; font-weight: 800; color: #fff4e4; -webkit-user-select: none; user-select: none; }
.kq h1, .kq h2, .kq h3, .kq .lg { font-family: 'Luckiest Guy', 'Arial Black', sans-serif; font-weight: 400; letter-spacing: 0.05em; margin: 0; }
.kq button { font: inherit; color: inherit; border: none; cursor: pointer; touch-action: manipulation; }
.kq .pill { font-family: 'Luckiest Guy', sans-serif; letter-spacing: 0.05em; padding: 1.3vmin 2.6vmin; border-radius: 1.8vmin; background: #4a2c50; border: 2px solid #ffd27a88; color: #ffe9c7; font-size: 2.8vmin; box-shadow: 0 0.6vmin 0 #0006; }
.kq .pill.go { background: linear-gradient(#ffb347, #ff8a2a); color: #3a1408; border-color: #fff3; }
.kq .pill:active { transform: translateY(0.4vmin); box-shadow: 0 0.2vmin 0 #0006; }
.kq .pill:disabled { opacity: 0.35; }
#camp { position: fixed; inset: 0; z-index: 20; display: none; background: #1a1020 center/cover no-repeat; }
#camp.on { display: flex; }
#camp::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, #1a1020f2 0%, #1a1020c0 45%, #1a102080 100%); }
#camp > * { position: relative; }
#camp .side { width: 13vmin; padding: calc(2vmin + env(safe-area-inset-top)) 1.5vmin 2vmin calc(1.5vmin + env(safe-area-inset-left)); display: flex; flex-direction: column; gap: 1.4vmin; }
#camp .side .hp { position: relative; width: 11vmin; height: 11vmin; border-radius: 2vmin; background: #2a1a30d0 center/80% no-repeat; border: 2px solid #fff3; }
#camp .side .hp.on { border-color: #ffd27a; background-color: #5a3a28e0; box-shadow: 0 0 2vmin #ffb34766; }
#camp .side .hp b { position: absolute; right: -0.6vmin; bottom: -0.6vmin; font-size: 1.8vmin; background: #1a1020; border: 1px solid #ffd27a; border-radius: 1vmin; padding: 0 0.6vmin; }
#camp .side .hp i { position: absolute; left: -0.6vmin; top: -0.6vmin; width: 2.4vmin; height: 2.4vmin; border-radius: 50%; background: #ff5a6a; display: none; }
#camp .side .hp.pts i { display: block; }
#camp .main { flex: 1; display: flex; flex-direction: column; padding: calc(1.5vmin + env(safe-area-inset-top)) calc(2vmin + env(safe-area-inset-right)) 1.5vmin 0.5vmin; min-width: 0; }
#camp .top { display: flex; align-items: center; gap: 1.6vmin; }
#camp .top h1 { font-size: 4.2vmin; color: #ffb347; text-shadow: 0 0.5vmin 0 #5a1a10; flex: 1; white-space: nowrap; }
#camp .chip { font-size: 2.4vmin; background: #2a1a30d8; border: 2px solid #ffd27a66; border-radius: 1.6vmin; padding: 0.6vmin 1.6vmin; white-space: nowrap; }
#camp .tabs { display: flex; gap: 1vmin; margin: 1.2vmin 0; }
#camp .tabs button { font-family: 'Luckiest Guy', sans-serif; letter-spacing: 0.05em; font-size: 2.6vmin; padding: 1vmin 2.2vmin; border-radius: 1.6vmin 1.6vmin 0 0; background: #2a1a30c0; color: #c8b8c8; position: relative; }
#camp .tabs button.on { background: #4a2c50; color: #ffd27a; }
#camp .tabs button em { position: absolute; top: -0.8vmin; right: -0.6vmin; font-style: normal; font-size: 1.7vmin; background: #ff5a6a; color: #fff; border-radius: 1vmin; padding: 0 0.7vmin; }
#camp .page { flex: 1; overflow-y: auto; overflow-x: hidden; background: #2a1a30b8; border-radius: 0 2vmin 2vmin 2vmin; padding: 2vmin; -webkit-overflow-scrolling: touch; }
.kq .stages { display: flex; gap: 2vmin; flex-wrap: wrap; }
.kq .stage { width: 30vmin; border-radius: 2vmin; overflow: hidden; background: #1a1020; border: 2px solid #ffd27a66; text-align: left; padding: 0; position: relative; }
.kq .stage .pic { height: 14vmin; background: #333 center/cover; }
.kq .stage .tx { padding: 1vmin 1.4vmin 1.4vmin; }
.kq .stage .num { font-family: 'Luckiest Guy', sans-serif; color: #ffb347; font-size: 2.6vmin; }
.kq .stage .nm { font-size: 2.4vmin; }
.kq .stage .lv { font-size: 1.9vmin; color: #c8b8c8; }
.kq .stage .rank { position: absolute; right: 1vmin; top: 1vmin; font-family: 'Luckiest Guy', sans-serif; font-size: 4.6vmin; text-shadow: 0 0.4vmin 0 #000; }
.kq .stage .boss { position: absolute; left: 1vmin; top: 1vmin; background: #e0304a; padding: 0.3vmin 1vmin; border-radius: 1vmin; font-family: 'Luckiest Guy', sans-serif; font-size: 2vmin; }
.kq .stage.locked { filter: grayscale(1) brightness(0.5); }
.kq .stage.locked::after { content: '🔒'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 8vmin; }
.kq .hero { display: grid; grid-template-columns: 26vmin 1fr 1fr; gap: 2vmin; }
.kq .portrait { text-align: center; }
.kq .portrait img { width: 24vmin; height: 24vmin; object-fit: contain; filter: drop-shadow(0 1vmin 1vmin #0008); }
.kq .portrait h2 { color: #ffd27a; font-size: 3.4vmin; }
.kq .portrait .role { font-size: 1.9vmin; color: #c8b8c8; }
.kq .bar { height: 1.6vmin; border-radius: 1vmin; background: #0008; overflow: hidden; margin: 0.6vmin 0; }
.kq .bar i { display: block; height: 100%; background: linear-gradient(#ffe27a, #e0a020); }
.kq .rows div { display: flex; justify-content: space-between; align-items: center; font-size: 2.3vmin; padding: 0.5vmin 0; border-bottom: 1px solid #fff1; }
.kq .rows small { color: #b8a8b8; font-size: 1.7vmin; display: block; font-weight: 700; }
.kq .rows .plus { width: 4.6vmin; height: 4.6vmin; border-radius: 1.2vmin; background: #ff9a3c; color: #3a1408; font-size: 3vmin; font-family: 'Luckiest Guy', sans-serif; }
.kq .rows .plus:disabled { opacity: 0.2; }
.kq .h3 { font-family: 'Luckiest Guy', sans-serif; color: #ffb347; font-size: 2.6vmin; margin: 0 0 0.8vmin; letter-spacing: 0.05em; }
.kq .slots { display: flex; flex-direction: column; gap: 1.2vmin; }
.kq .slot { display: flex; gap: 1.2vmin; align-items: center; background: #1a1020c0; border-radius: 1.6vmin; padding: 0.8vmin; border: 2px solid #fff2; text-align: left; }
.kq .icon { width: 8vmin; height: 8vmin; border-radius: 1.4vmin; background: #3a2440 center/78% no-repeat; border: 2px solid var(--rc, #fff3); flex-shrink: 0; position: relative; }
.kq .icon b { position: absolute; right: 0.3vmin; bottom: 0; font-size: 1.7vmin; text-shadow: 0 1px 2px #000; }
.kq .icon .sk { position: absolute; left: 0.3vmin; top: 0; font-size: 1.7vmin; }
.kq .slot .t { font-size: 2.1vmin; line-height: 1.25; }
.kq .slot .t span { display: block; color: #c8b8c8; font-size: 1.7vmin; font-weight: 700; }
.kq .grid { display: flex; flex-wrap: wrap; gap: 1.2vmin; align-content: flex-start; }
.kq .grid .icon { width: 10vmin; height: 10vmin; }
.kq .bagwrap { display: grid; grid-template-columns: 1fr 34vmin; gap: 2vmin; }
.kq .detail { background: #1a1020d8; border-radius: 2vmin; padding: 1.6vmin; font-size: 2.1vmin; align-self: start; }
.kq .detail h3 { font-size: 2.9vmin; }
.kq .detail .ln { color: #a8f0a8; }
.kq .detail .skl { color: #ffd27a; }
.kq .detail .btns { display: flex; flex-wrap: wrap; gap: 1vmin; margin-top: 1.4vmin; }
.kq .detail .btns .pill { font-size: 2.2vmin; padding: 1vmin 1.6vmin; }
.kq .skills { display: grid; grid-template-columns: 1fr 1fr; gap: 1.6vmin; }
.kq .skill { display: flex; gap: 1.4vmin; background: #1a1020c0; border-radius: 1.8vmin; padding: 1.2vmin; border: 2px solid #fff2; align-items: center; }
.kq .skill.locked { opacity: 0.45; }
.kq .skill .ic { font-size: 5vmin; width: 8vmin; height: 8vmin; border-radius: 1.6vmin; background: #3a2c50; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.kq .skill .t { flex: 1; font-size: 2vmin; }
.kq .skill .t b { font-family: 'Luckiest Guy', sans-serif; font-weight: 400; font-size: 2.6vmin; color: #ffd27a; letter-spacing: 0.04em; }
.kq .skill .t span { display: block; color: #c8b8c8; font-weight: 700; }
.kq .pips { display: flex; gap: 0.5vmin; margin-top: 0.5vmin; }
.kq .pips i { width: 2.2vmin; height: 1.2vmin; border-radius: 0.6vmin; background: #0008; }
.kq .pips i.on { background: #ffb347; } .kq .pips i.bonus { background: #7ac0ff; }
.kq .boxes { display: flex; gap: 2vmin; flex-wrap: wrap; }
.kq .boxcard { width: 18vmin; text-align: center; background: #1a1020c0; border-radius: 2vmin; padding: 1.4vmin; border: 2px solid var(--tc); }
.kq .boxcard img { width: 12vmin; height: 12vmin; object-fit: contain; }
.kq .boxcard .n { font-family: 'Luckiest Guy', sans-serif; font-size: 3.6vmin; color: var(--tc); }
.kq .boxcard .nm { font-size: 1.9vmin; min-height: 2.4vmin; }
.kq .empty { color: #b8a8b8; font-size: 2.4vmin; padding: 3vmin; text-align: center; }
/* gacha */
#gacha { position: fixed; inset: 0; z-index: 40; display: none; align-items: center; justify-content: center; flex-direction: column; background: radial-gradient(circle, #3a2048 0%, #120a18 75%); }
#gacha.on { display: flex; }
#gacha .rays { pointer-events: none; position: absolute; width: 140vmin; height: 140vmin; background: repeating-conic-gradient(var(--gc, #ffd27a) 0 6deg, transparent 6deg 18deg); opacity: 0; border-radius: 50%; mask-image: radial-gradient(circle, #000 0%, transparent 65%); -webkit-mask-image: radial-gradient(circle, #000 0%, transparent 65%); }
#gacha.burst .rays { animation: rays 6s linear infinite, fadein 0.4s forwards; }
@keyframes rays { to { transform: rotate(360deg); } }
@keyframes fadein { to { opacity: 0.35; } }
#gacha .bx { width: 34vmin; height: 34vmin; object-fit: contain; filter: drop-shadow(0 2vmin 3vmin #000c); }
#gacha .bx.shake { animation: shake 0.11s infinite; }
#gacha .bx.pop { animation: pop 0.35s forwards; }
@keyframes shake { 0% { transform: rotate(-6deg) scale(1.02); } 50% { transform: rotate(6deg) scale(1.06); } 100% { transform: rotate(-6deg) scale(1.02); } }
@keyframes pop { to { transform: scale(1.8); opacity: 0; } }
#gacha .flash { position: absolute; inset: 0; background: var(--gc, #fff); opacity: 0; pointer-events: none; }
#gacha .flash.go { animation: flash 0.5s; }
@keyframes flash { 0% { opacity: 0.9; } 100% { opacity: 0; } }
#gacha .card { display: none; width: 46vmin; background: linear-gradient(#3a2448, #24142e); border: 3px solid var(--gc); border-radius: 3vmin; padding: 2vmin 2.4vmin; text-align: center; box-shadow: 0 0 6vmin var(--gc); }
#gacha.reveal .card { display: block; animation: cardin 0.45s cubic-bezier(.2,1.6,.4,1); }
#gacha.reveal .bx { display: none; }
@keyframes cardin { from { transform: scale(0.3) rotateY(90deg); opacity: 0; } to { transform: none; opacity: 1; } }
#gacha .card .icon { width: 16vmin; height: 16vmin; margin: 0 auto 1vmin; }
#gacha .card .rar { font-family: 'Luckiest Guy', sans-serif; color: var(--gc); font-size: 2.6vmin; letter-spacing: 0.1em; }
#gacha .card h3 { font-size: 3.4vmin; margin: 0.4vmin 0 1vmin; }
#gacha .card .ln { color: #a8f0a8; font-size: 2.2vmin; }
#gacha .card .skl { color: #ffd27a; font-size: 2.2vmin; }
#gacha .card .cr { color: #c8b8c8; font-size: 1.9vmin; margin-top: 0.8vmin; }
#gacha .btns { position: relative; z-index: 2; display: flex; gap: 1.4vmin; margin-top: 2.4vmin; min-height: 7vmin; }
#gacha .left { position: absolute; top: 3vmin; font-family: 'Luckiest Guy', sans-serif; color: #c8b8c8; font-size: 2.6vmin; }
/* stage result */
#result { position: fixed; inset: 0; z-index: 30; display: none; align-items: center; justify-content: center; background: #120a18d0; }
#result.on { display: flex; }
#result .panel { background: linear-gradient(#3a2448, #24142e); border: 3px solid #ffd27a; border-radius: 3vmin; padding: 2.4vmin 3.6vmin; text-align: center; min-width: 60vmin; animation: cardin 0.4s; }
#result h2 { font-size: 5vmin; color: #ffb347; }
#result .rk { font-family: 'Luckiest Guy', sans-serif; font-size: 13vmin; line-height: 1; margin: 0.6vmin 0; text-shadow: 0 0.8vmin 0 #000a; animation: rk 0.6s cubic-bezier(.2,1.8,.4,1); }
@keyframes rk { from { transform: scale(3); opacity: 0; } }
#result .st { display: flex; gap: 3vmin; justify-content: center; font-size: 2.3vmin; color: #d8c8d8; }
#result .st b { display: block; font-size: 3.2vmin; color: #fff; }
#result .gots { display: flex; gap: 1vmin; justify-content: center; margin: 1.6vmin 0; flex-wrap: wrap; max-width: 70vmin; }
#result .gots img { width: 7vmin; height: 7vmin; object-fit: contain; }
#result .gots img.up { filter: drop-shadow(0 0 1vmin #ffe27a); }
#result .note { font-size: 2vmin; color: #ffd27a; min-height: 2.6vmin; }
#result .btns { display: flex; gap: 1.4vmin; justify-content: center; margin-top: 1.6vmin; flex-wrap: wrap; }
`;
