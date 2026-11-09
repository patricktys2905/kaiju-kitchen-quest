// Procedural animation poses (Phaser-free, so tests can check them).
import type { Hero } from '../sim/world';
import type { RigDef, Role } from './rigs';

export interface Pose {
  y: number;        // body lift (world px, negative = up)
  lean: number;     // body rotation about the hips
  sx: number; sy: number; // squash & stretch
  whole: number;    // whole-character rotation (knocked down)
  r: Partial<Record<Role, number>>; // limb rotations (added to rest)
  lift: [number, number]; // legA / legB raise (px)
  step: [number, number]; // legA / legB forward offset (px, shuffle walkers)
  snap: boolean;    // attack/skill: arms follow the pose exactly (no spring lag)
}

const ease = (p: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, p)), 3);

/** Procedural animation: everything comes from the hero's state, its timer and speed. */
export function poseFor(h: Hero, time: number, walkPhase: number, rig: RigDef | null): Pose {
  const p: Pose = { y: 0, lean: 0, sx: 1, sy: 1, whole: 0, r: {}, lift: [0, 0], step: [0, 0], snap: false };
  const cls = h.d.cls;
  const run = Math.min(1, Math.abs(h.vx) / cls.speed);
  const shuffle = rig?.legs === 'shuffle';
  const hopper = rig?.legs === 'none';
  const flap = Math.sin(time * (rig?.hover ? 14 : 4));
  switch (h.state) {
    case 'move': {
      if (run > 0.1 && hopper) {
        // legless: bounce along in little hops, squashing on each landing
        const hp = Math.abs(Math.sin(walkPhase));
        const contact = 1 - Math.min(1, hp / 0.3);
        p.y = -hp * 13 * run;
        p.sy = 1 + (hp * 0.06 - contact * 0.13) * run; p.sx = 1 + (contact * 0.1 - hp * 0.04) * run;
        p.lean = (0.05 + Math.cos(walkPhase * 2) * 0.04) * run;
        p.r = { arm: -0.3 - hp * 0.9 * run, armBack: -0.2 - hp * 0.7 * run, tail: hp * 0.2 };
      } else if (run > 0.1) {
        const s = Math.sin(walkPhase), c = Math.cos(walkPhase);
        p.y = -Math.abs(c) * 4 * run;
        p.lean = 0.07 * run;
        p.sy = 1 - Math.abs(s) * 0.025 * run; p.sx = 1 + Math.abs(s) * 0.02 * run;
        const legSwing = shuffle ? 0.15 : 0.55;
        p.r = { legA: s * legSwing * run, legB: -s * legSwing * run, arm: -s * 0.55 * run, armBack: s * 0.45 * run, tail: s * 0.12, wing: flap * 0.3, wingBack: -flap * 0.25 };
        p.lift = [Math.max(0, -c) * 5 * run, Math.max(0, c) * 5 * run];
        if (shuffle) p.step = [s * 7 * run, -s * 7 * run];
      } else {
        const b = Math.sin(time * 2.6);
        p.y = b * 1.2; p.sy = 1 + b * 0.018; p.sx = 1 - b * 0.012;
        p.r = { arm: 0.05 + b * 0.06, armBack: -b * 0.05, tail: Math.sin(time * 1.7) * 0.1, wing: flap * 0.18, wingBack: -flap * 0.14 };
      }
      break;
    }
    case 'air': {
      const up = h.vy < 0;
      p.sy = up ? 1.06 : 0.98; p.sx = up ? 0.95 : 1.02;
      p.lean = up ? -0.04 : 0.06;
      const glide = h.gliding;
      p.r = { legA: shuffle ? 0.1 : -0.45, legB: shuffle ? -0.1 : 0.4, arm: up ? -1.3 : -0.7, armBack: up ? -1.0 : -0.5, tail: up ? 0.3 : -0.15,
        wing: glide ? -0.6 + Math.sin(time * 9) * 0.15 : -0.3 + Math.sin(time * 22) * 0.45, wingBack: glide ? -0.5 : -0.2 + Math.sin(time * 22) * 0.35 };
      p.lift = [4, 2];
      break;
    }
    case 'attack': {
      p.snap = true;
      const atk = h.step < 0 ? cls.air : cls.combo[h.step];
      const [a, b] = atk.hit;
      const wind = ease(h.t / a), strike = ease((h.t - a) / Math.max(0.01, b - a)), rec = ease((h.t - b) / Math.max(0.01, atk.dur - b));
      const phase = h.t < a ? 0 : h.t < b ? 1 : 2;
      // jab, backhand, big uppercut finisher; air = downward swipe. Kept inside ±1.6 rad so arms stay attached.
      const shape = h.step < 0 ? [-1.5, 1.1] : h.step === 0 ? [-1.1, 1.0] : h.step === 1 ? [1.0, -0.8] : [1.2, -1.6];
      const arm = phase === 0 ? shape[0] * wind : phase === 1 ? shape[0] + (shape[1] - shape[0]) * strike : shape[1] * (1 - rec);
      const leanTo = h.step === 2 ? -0.12 : 0.16;
      p.lean = phase === 0 ? -0.08 * wind : phase === 1 ? leanTo * strike : leanTo * (1 - rec);
      p.sx = phase === 1 ? 1.06 : 1; p.sy = phase === 1 ? 0.96 : 1;
      if (h.step === 2 && phase >= 1) { p.y = -8 * (phase === 1 ? strike : 1 - rec); p.sy = 1.06; p.sx = 0.95; }
      p.r = { arm, armBack: -arm * 0.35, legA: phase === 1 ? 0.35 : 0.15, legB: phase === 1 ? -0.3 : -0.15, tail: phase === 1 ? -0.3 : 0.1, wing: -arm * 0.25, wingBack: arm * 0.2 };
      if (shuffle) { p.step = [phase === 1 ? 6 : 0, phase === 1 ? -4 : 0]; p.r.legA = 0; p.r.legB = 0; }
      if (!h.ground) { p.r.legA = shuffle ? 0 : -0.45; p.r.legB = shuffle ? 0 : 0.4; }
      break;
    }
    case 'skill': {
      p.snap = true;
      const sk = h.skill!, q = h.t / sk.dur;
      switch (sk.kind) {
        case 'cone': {
          const k = q < 0.2 ? -ease(q / 0.2) : Math.sin(Math.min(1, (q - 0.2) / 0.5) * Math.PI);
          p.lean = k * 0.2; p.sx = 1 + Math.max(0, k) * 0.1; p.sy = 1 - Math.max(0, k) * 0.05;
          p.r = { arm: -0.5 - Math.max(0, k) * 0.5, tail: -k * 0.4 };
          break;
        }
        case 'slam': {
          const k = q < 0.45 ? ease(q / 0.45) : 1 - ease((q - 0.45) / 0.55);
          p.sy = q < 0.45 ? 1 + k * 0.08 : 0.84 + (1 - k) * 0.16; p.sx = q < 0.45 ? 0.95 : 1.12 - (1 - k) * 0.12;
          p.r = { arm: q < 0.45 ? -1.5 : 1.0, armBack: q < 0.45 ? -1.4 : 0.8 };
          break;
        }
        case 'dash': p.lean = 0.35; p.sx = 1.12; p.sy = 0.92; p.y = -2; p.r = { legA: 0.7, legB: -0.7, arm: 1.1, armBack: 0.9, tail: -0.25 }; break;
        case 'uppercut': p.lean = -0.2; p.sy = 1.1; p.sx = 0.92; p.r = { arm: -1.6, armBack: -0.6, legA: -0.4, legB: 0.5, tail: 0.4 }; break;
        case 'spin': p.whole = (h.t * 18) % (Math.PI * 2); p.r = { arm: 1.3, armBack: 1.1, tail: -0.4 }; break;
        case 'nova': { const k = Math.min(1, q / 0.55); p.sy = 1 + 0.12 * k * (q < 0.55 ? 1 : -0.5); p.sx = 1 - 0.06 * k; p.r = { arm: -1.5 * k, armBack: -1.3 * k, wing: -0.9 * k, wingBack: -0.8 * k }; break; }
        case 'buff': { const k = Math.sin(Math.min(1, q) * Math.PI); p.sy = 1 + 0.08 * k; p.r = { arm: -1.4 * k, armBack: -1.4 * k, wing: -0.6 * k }; break; }
        default: { const k = Math.sin(Math.min(1, q) * Math.PI); p.lean = -0.08 * k; p.r = { arm: -1.3 * k, wing: -0.6 * k, wingBack: -0.5 * k }; }
      }
      break;
    }
    case 'climb': {
      const s = Math.sin(h.y * 0.12);
      p.r = { arm: -1.6 + s * 0.35, armBack: -1.5 - s * 0.35, legA: s * 0.35, legB: -s * 0.35, tail: 0.15 };
      p.lift = [Math.max(0, s) * 5, Math.max(0, -s) * 5];
      break;
    }
    case 'hurt':
      p.lean = -0.25; p.sx = 0.93; p.sy = 1.05;
      p.r = { arm: -1.0, armBack: -0.8, legA: -0.3, legB: 0.25, tail: 0.4 };
      break;
    case 'down':
      p.whole = -1.45 * ease(h.t / 0.3);
      p.r = { arm: -0.4, legA: 0.3, legB: 0.5 };
      break;
  }
  if (rig?.hover && h.state !== 'down' && h.state !== 'climb') p.y += rig.fly ? -16 + Math.sin(time * 3) * 4 : -6 + Math.sin(time * 3) * 3;
  if (rig?.fly && h.state !== 'down') { // wings never stop
    const f = Math.sin(time * 16);
    p.r.wing = (p.r.wing ?? 0) * 0.5 - 0.25 + f * 0.45; p.r.wingBack = (p.r.wingBack ?? 0) * 0.5 - 0.15 + f * 0.35;
  }
  return p;
}

