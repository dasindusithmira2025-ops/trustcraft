/**
 * One central timeline. Every scene reads its window from here; no scene
 * hardcodes an absolute frame. 30 fps · 900 frames · exactly 30 seconds.
 */

export const FPS = 30;
export const DURATION_IN_FRAMES = 900;
export const WIDTH = 1920;
export const HEIGHT = 1080;

type Win = readonly [number, number];

export const TIMING = {
  problem: [0, 96] as Win, // 0.0s – 3.2s   Something breaks.
  brand: [90, 188] as Win, // 3.0s – 6.3s   TrustCraft arrives.
  search: [182, 384] as Win, // 6.1s – 12.8s  Type it. Say it. Show it.
  discovery: [378, 522] as Win, // 12.6s – 17.4s Professionals appear.
  trust: [516, 642] as Win, // 17.2s – 21.4s Built for trust.
  action: [636, 762] as Win, // 21.2s – 25.4s Connect.
  ecosystem: [756, 828] as Win, // 25.2s – 27.6s One place. Every service.
  finale: [822, 900] as Win, // 27.4s – 30.0s TrustCraft.
} as const;

export const dur = (w: Win): number => w[1] - w[0];

/** Local frame → progress 0..1 across [a,b]. */
export const phase = (frame: number, a: number, b: number): number => {
  if (b <= a) return frame >= b ? 1 : 0;
  return Math.min(1, Math.max(0, (frame - a) / (b - a)));
};
