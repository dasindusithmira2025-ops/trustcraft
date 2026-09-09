import { spring } from "remotion";

/** Spring presets with physical character. All deterministic. */

type Opts = { frame: number; fps: number; delay?: number; durationInFrames?: number };

/** Heavy object with mass — settles with a hint of overshoot. */
export const heavy = ({ frame, fps, delay = 0, durationInFrames }: Opts) =>
  spring({
    frame,
    fps,
    delay,
    durationInFrames,
    config: { damping: 18, mass: 1.1, stiffness: 120 },
  });

/** Crisp UI element — quick, minimal overshoot. */
export const crisp = ({ frame, fps, delay = 0, durationInFrames }: Opts) =>
  spring({
    frame,
    fps,
    delay,
    durationInFrames,
    config: { damping: 26, mass: 0.7, stiffness: 180 },
  });

/** Gentle, no overshoot — camera and focus. */
export const glide = ({ frame, fps, delay = 0, durationInFrames }: Opts) =>
  spring({
    frame,
    fps,
    delay,
    durationInFrames,
    config: { damping: 200, mass: 1, stiffness: 90 },
  });

/** A single expressive pop for a hero moment. */
export const pop = ({ frame, fps, delay = 0, durationInFrames }: Opts) =>
  spring({
    frame,
    fps,
    delay,
    durationInFrames,
    config: { damping: 12, mass: 0.9, stiffness: 140 },
  });
