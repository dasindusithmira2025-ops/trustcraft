import { Easing } from "remotion";

/**
 * A small, opinionated easing set. Motion in this film is physical: things
 * accelerate under load and settle, they don't blink on with linear opacity.
 */

// Strong cinematic ease-out — camera moves, big reveals.
export const outExpo = Easing.bezier(0.16, 1, 0.3, 1);

// Editorial ease — text and UI settling.
export const outQuint = Easing.bezier(0.22, 1, 0.36, 1);

// Ease-in-out for camera drifts that start and end at rest.
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);

// Anticipation then release — used sparingly for a single hero beat.
export const backOut = Easing.bezier(0.34, 1.56, 0.64, 1);

// Snappy in — elements leaving frame.
export const inCubic = Easing.bezier(0.4, 0, 1, 1);
