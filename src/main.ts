import * as Phaser from 'phaser';
import { initInput } from './input';
import { CANVAS, GameScene } from './scenes/GameScene';
import { initTouch } from './touch';

initInput(() => {});
initTouch();

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'app',
  backgroundColor: '#1a1020',
  scale: { mode: Phaser.Scale.EXPAND, autoCenter: Phaser.Scale.CENTER_BOTH, width: CANVAS.w, height: CANVAS.h },
  render: { antialias: true },
  scene: [GameScene],
});
(window as unknown as { __game: Phaser.Game }).__game = game;
