// Keyboard + on-screen touch, merged into one sim Input.
// Keys: arrows/WASD move & climb, Space/K jump, J attack, L skill, Down+Jump drops through a platform.
import { readTouch } from './touch';
import type { Input } from './sim/types';

const down = new Set<string>();
const taps: string[] = [];
/** Keys pressed since the last readInput(), so a tap shorter than one frame still counts. */
const latched = new Set<string>();

export function initInput(onFirst: () => void): void {
  addEventListener('keydown', e => {
    if (e.repeat) return;
    down.add(e.code); latched.add(e.code); taps.push(e.code); onFirst();
    if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault();
  });
  addEventListener('keyup', e => down.delete(e.code));
  addEventListener('blur', () => down.clear());
  addEventListener('pointerdown', onFirst, { once: true });
}

/** Key presses since the last call (for menus / hotkeys). */
export function takeTaps(): string[] { return taps.splice(0); }
export function injectTap(code: string): void { taps.push(code); }

const any = (...codes: string[]) => codes.some(c => down.has(c) || latched.has(c));

export function readInput(): Input {
  const t = readTouch();
  const out: Input = {
    left: any('ArrowLeft', 'KeyA') || t.x < 0,
    right: any('ArrowRight', 'KeyD') || t.x > 0,
    up: any('ArrowUp', 'KeyW') || t.y < 0,
    down: any('ArrowDown', 'KeyS') || t.y > 0,
    jump: any('Space', 'KeyK') || t.jump,
    attack: any('KeyJ', 'KeyZ') || t.attack,
    skill: any('KeyL', 'KeyX') || t.skill,
  };
  latched.clear();
  return out;
}
