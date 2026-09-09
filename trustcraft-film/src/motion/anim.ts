import { Easing, interpolate, spring } from 'remotion'
import { FPS } from './timeline'

/**
 * Easing vocabulary for the film. Nothing here is linear — every curve either
 * arrives or departs with weight.
 */
export const EASE = {
  /** Default UI arrival: fast out, long settle. */
  out: Easing.bezier(0.16, 1, 0.3, 1),
  /** Camera moves: eases both ends so the lens never jerks. */
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  /** Departures — accelerates away. */
  in: Easing.bezier(0.55, 0, 1, 0.45),
  /** Confident, slightly mechanical lock-on. */
  lock: Easing.bezier(0.2, 0.9, 0.1, 1),
  /** Soft drift for background/atmosphere. */
  drift: Easing.bezier(0.4, 0, 0.6, 1),
} as const

/** 0→1 over [start, start+dur], eased, clamped. */
export const ramp = (
  frame: number,
  start: number,
  dur: number,
  easing: (n: number) => number = EASE.out,
) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

/** Rises 0→1 then falls back to 0 — for accents that must not stick. */
export const pulse = (frame: number, at: number, up: number, down: number) =>
  frame < at
    ? 0
    : interpolate(frame, [at, at + up, at + up + down], [0, 1, 0], {
        easing: EASE.inOut,
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })

/**
 * Multi-keyframe track: `track(f, [[0,100],[60,240],[120,180]])`.
 * The backbone of the camera — one continuous curve, no dead stops.
 */
export const track = (
  frame: number,
  keys: [number, number][],
  easing: (n: number) => number = EASE.inOut,
) => {
  if (frame <= keys[0][0]) return keys[0][1]
  const last = keys[keys.length - 1]
  if (frame >= last[0]) return last[1]
  for (let i = 0; i < keys.length - 1; i++) {
    const [f0, v0] = keys[i]
    const [f1, v1] = keys[i + 1]
    if (frame >= f0 && frame <= f1) {
      return interpolate(frame, [f0, f1], [v0, v1], { easing })
    }
  }
  return last[1]
}

/** Spring that starts at an absolute frame. Physical arrivals. */
export const springAt = (
  frame: number,
  at: number,
  cfg: { damping?: number; mass?: number; stiffness?: number } = {},
) =>
  spring({
    frame: frame - at,
    fps: FPS,
    config: { damping: 200, mass: 1, stiffness: 100, ...cfg },
  })

/** Overshooting arrival, used sparingly (badges, confirmations). */
export const popAt = (frame: number, at: number) =>
  springAt(frame, at, { damping: 12, mass: 0.7, stiffness: 140 })

/**
 * Deterministic PRNG (mulberry32). Every procedural detail in this film is
 * seeded so two renders are byte-comparable.
 */
export const rng = (seed: number) => {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** A fixed array of seeded randoms — call once at module scope, never per frame. */
export const seeded = (seed: number, n: number) => {
  const r = rng(seed)
  return Array.from({ length: n }, () => r())
}

/** Masked upward type reveal — returns the clip + transform for a line. */
export const revealUp = (frame: number, at: number, dur = 22) => {
  const p = ramp(frame, at, dur, EASE.out)
  return {
    transform: `translateY(${(1 - p) * 108}%)`,
    opacity: interpolate(p, [0, 0.25, 1], [0, 1, 1]),
  }
}

/** Cheap depth cue: things further away are smaller, dimmer and softer. */
export const depth = (z: number) => ({
  scale: 1 - z * 0.16,
  opacity: 1 - z * 0.62,
  blur: z * 5.5,
})
