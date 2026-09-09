/**
 * The single source of truth for time in this film.
 *
 * 900 frames @ 30fps = exactly 30.000s. Every scene, every audio cue and every
 * camera keyframe reads from here — no bare frame numbers anywhere else.
 */
export const FPS = 30
export const DURATION = 900
export const W = 1920
export const H = 1080

const act = (start: number, end: number) => ({ start, end, dur: end - start })

export const FILM = {
  /** I — a problem, in the dark. */
  problem: act(0, 100),
  /** II — chaos collapses into one search surface. */
  reveal: act(100, 165),
  /** III — the hero: type, say, show, understood. */
  multimodal: act(165, 375),
  /** IV — the category becomes real professionals. */
  discovery: act(375, 525),
  /** V — why this one is safe to choose. */
  trust: act(525, 640),
  /** VI — the choice becomes a connection. */
  action: act(640, 738),
  /** VII — one journey becomes a platform. */
  ecosystem: act(738, 798),
  /** VIII — the mark. */
  finale: act(798, 900),
} as const

/** Sub-beats inside Act III, the film's centrepiece. */
export const BEAT = {
  type: act(165, 238),
  say: act(238, 296),
  show: act(296, 346),
  understood: act(346, 375),
} as const

/** Moments the score and the sound design lock onto. Frames, absolute. */
export const CUE = {
  drip: 24,
  titleIn: 18,
  titleSwap: 58,
  collapse: 104,
  surfaceOpen: 130,
  brandIn: 150,
  typeStart: 176,
  categoryLock: 224,
  voiceOn: 246,
  voiceLock: 286,
  photoDrop: 304,
  photoLock: 332,
  understood: 348,
  resultsOpen: 386,
  responsive: 414,
  heroFound: 478,
  /** "Finding someone is easy." — lands on the results, beside the phone. */
  easyLine: 452,
  trustIn: 528,
  /** "Trusting them isn't." — the question the signals then answer. */
  trustLine: 536,
  trustStats: 560,
  profileOpen: 648,
  ctaPress: 686,
  confirmed: 698,
  pullback: 738,
  markIn: 798,
  taglineIn: 846,
} as const

export const sec = (f: number) => f / FPS
