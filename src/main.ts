import * as Phaser from 'phaser';
import { unlockAudio } from './audio';
import { initInput } from './input';
import { CANVAS, GameScene } from './scenes/GameScene';
import { initTouch } from './touch';
import { initCamp, showCamp } from './ui/camp';
import { initOnline, showOnline } from './ui/online';
import { initFree } from './ui/free';
import { showTitle } from './ui/title';
import './ui/report'; // catches uncaught errors from the start; [data-report] buttons open it

initInput(unlockAudio);
addEventListener('pointerdown', unlockAudio);
initTouch();
showTitle();
let game: Phaser.Game;
initCamp(stageId => game.scene.getScene('game').scene.restart({ stage: stageId }), showOnline);
initFree(run => game.scene.getScene('game').scene.restart({ stage: run.stage.id, free: run }));
initOnline((stage, online) => game.scene.getScene('game').scene.restart({ stage, online }), () => { game.scene.getScene('game').scene.restart({}); showCamp(); });

game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'app',
  backgroundColor: '#1a1020',
  scale: { mode: Phaser.Scale.EXPAND, autoCenter: Phaser.Scale.CENTER_BOTH, width: CANVAS.w, height: CANVAS.h },
  render: { antialias: true },
  scene: [GameScene],
});
(window as unknown as { __game: Phaser.Game }).__game = game;
