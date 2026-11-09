// Where each cutout piece goes for a pose: shared by the renderer (rig.ts) and the attachment test
// (tests/rig.test.ts), so what we test is exactly what is drawn. Coordinates are the hero's local space
// (feet at 0,0, facing right); the body pivots at its hips, everything else hangs off the body.
import type { Pose } from './pose';
import type { PartDef, RigDef } from './rigs';

export interface PartXf { x: number; y: number; rot: number; sx: number; sy: number }

/** Rest position of a part's joint relative to the rig root (world px). */
export function restOf(rig: RigDef, def: PartDef): { x: number; y: number } {
  return { x: (def.joint[0] - rig.root[0]) * rig.scale, y: (def.joint[1] - rig.root[1]) * rig.scale };
}

/** Transform for one part. angle = the part's current rotation (rest + pose, after springs). */
export function partXf(rig: RigDef, def: PartDef, body: PartDef, p: Pose, angle: number): PartXf {
  const s = rig.scale;
  const b = restOf(rig, body);
  if (def === body) return { x: b.x, y: b.y + p.y, rot: p.lean, sx: s * p.sx, sy: s * p.sy };
  // joints ride on the body: squash, lean and bob move them with it, so nothing comes loose
  const r = restOf(rig, def);
  const cos = Math.cos(p.lean), sin = Math.sin(p.lean);
  const dx = (r.x - b.x) * p.sx, dy = (r.y - b.y) * p.sy;
  const jx = b.x + dx * cos - dy * sin, jy = b.y + p.y + dx * sin + dy * cos;
  if (def.role === 'legA' || def.role === 'legB') {
    // hips stay on the body; legs keep their own swing (no body lean) plus a small step / lift at the foot
    const i = def.role === 'legA' ? 0 : 1;
    return { x: jx + p.step[i] * 0.4, y: jy - p.lift[i] * 0.4, rot: angle, sx: s, sy: s };
  }
  return { x: jx, y: jy, rot: angle + p.lean, sx: s, sy: s };
}
