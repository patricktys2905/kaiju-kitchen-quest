// Every limb stays attached: for each kaiju, in every animation (idle, run cycle, jump, combo swings, skills,
// ultimate, climb, hurt), each part's joint must sit on that part's own opaque pixels AND on the body's
// silhouette. Uses the real piece images (alpha) and the same layout maths as the renderer.
import { beforeAll, describe, expect, it } from 'vitest';
import { CLASSES, classOf } from '../src/sim/classes';
import { ULTS, skillsOf } from '../src/sim/skills';
import { type Pose, poseFor } from '../src/render/pose';
import { partXf } from '../src/render/layout';
import { RIGS, type PartDef } from '../src/render/rigs';

interface Mask { w: number; h: number; a: Uint8Array }
const masks = new Map<string, Mask>();

beforeAll(async () => {
  // @ts-ignore sharp has no types in this tsconfig
  const sharp = (await import('sharp')).default;
  for (const [sp, rig] of Object.entries(RIGS)) for (const p of rig.parts) {
    const key = `parts-${sp}-${p.piece}`;
    if (masks.has(key)) continue;
    const { data, info } = await sharp(`public/art/${key}.webp`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const a = new Uint8Array(info.width * info.height);
    for (let i = 0; i < a.length; i++) a[i] = data[i * 4 + 3];
    masks.set(key, { w: info.width, h: info.height, a });
  }
});

/** Is there an opaque pixel within r px of (x, y) in the image? */
function solid(m: Mask, x: number, y: number, r: number): boolean {
  for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
    if (dx * dx + dy * dy > r * r) continue;
    const px = Math.round(x + dx), py = Math.round(y + dy);
    if (px >= 0 && py >= 0 && px < m.w && py < m.h && m.a[py * m.w + px] > 60) return true;
  }
  return false;
}

/** Fake hero state for poseFor. */
function hero(species: number, o: Record<string, unknown>) {
  const cls = classOf(species);
  return { d: { cls }, state: 'move', t: 0, vx: 0, vy: 0, ground: true, step: 0, skill: null, gliding: false, y: 0, ...o } as never;
}

/** A spread of poses covering every animation this kaiju can play. */
function poses(species: number): [string, Pose][] {
  const cls = classOf(species), out: [string, Pose][] = [];
  const rig = RIGS[species];
  const P = (label: string, o: Record<string, unknown>, time = 0.3, walk = 0) => out.push([label, poseFor(hero(species, o), time, walk, rig)]);
  for (let t = 0; t < 2; t += 0.25) P(`idle t${t}`, {}, t);
  for (let w = 0; w < Math.PI * 2; w += Math.PI / 6) P(`run ${w.toFixed(1)}`, { vx: cls.speed }, 0.3, w);
  P('jump up', { state: 'air', ground: false, vy: -400 }); P('fall', { state: 'air', ground: false, vy: 300 });
  for (let step = -1; step < 3; step++) {
    const atk = step < 0 ? cls.air : cls.combo[step];
    for (let k = 0; k <= 8; k++) P(`attack${step} ${k}`, { state: 'attack', step, t: atk.dur * k / 8, ground: step >= 0 });
  }
  for (const sk of [...skillsOf(species).actives, ULTS[species]].filter(Boolean)) for (let k = 0; k <= 6; k++) P(`${sk.name} ${k}`, { state: 'skill', skill: sk, t: sk.dur * k / 6 });
  for (let y = 0; y < 60; y += 10) P(`climb ${y}`, { state: 'climb', y });
  P('hurt', { state: 'hurt' });
  return out;
}

describe('cutout rigs', () => {
  for (const c of CLASSES) {
    it(`${c.name}: every limb stays attached in every pose`, () => {
      const rig = RIGS[c.species];
      expect(rig, `${c.name} has no rig`).toBeTruthy();
      const body = rig.parts.find(p => p.role === 'body')!;
      const bm = masks.get(`parts-${c.species}-${body.piece}`)!;
      const problems = new Set<string>();
      // each joint is on its own piece
      for (const part of rig.parts) {
        if (part === body) continue;
        const m = masks.get(`parts-${c.species}-${part.piece}`)!;
        if (!solid(m, part.pivot[0] * m.w, part.pivot[1] * m.h, 5)) problems.add(`${part.role} (piece ${part.piece}): pivot is not on the piece`);
      }
      // ...and on the body, in every pose
      for (const [label, p] of poses(c.species)) {
        const bx = partXf(rig, body, body, p, 0);
        for (const part of rig.parts) {
          if (part === body) continue;
          const angle = (part.rest ?? 0) + (p.r[part.role] ?? 0);
          const xf = partXf(rig, part, body, p, angle);
          // the joint in body-image pixels
          const dx = xf.x - bx.x, dy = xf.y - bx.y, cos = Math.cos(-bx.rot), sin = Math.sin(-bx.rot);
          const ix = (dx * cos - dy * sin) / bx.sx + body.pivot[0] * bm.w;
          const iy = (dx * sin + dy * cos) / bx.sy + body.pivot[1] * bm.h;
          if (!solid(bm, ix, iy, 10)) problems.add(`${part.role} (piece ${part.piece}) detaches in "${label}" (joint at ${ix.toFixed(0)},${iy.toFixed(0)} of ${bm.w}x${bm.h})`);
        }
      }
      expect([...problems].slice(0, 8)).toEqual([]);
    });
  }
});

void ((x: PartDef) => x);
