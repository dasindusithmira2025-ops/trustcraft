import { EASE, seeded, track } from '../motion/anim'
import { CUE, DURATION } from '../motion/timeline'
import { STAGE_BG } from '../theme'

/**
 * The environment the whole film sits in.
 *
 * Not a SaaS gradient — this is the product's own `body` background
 * (radial #1E293B → #0B1220 → #060A12) pushed darker, with a key light that
 * rises and falls with the story: low-key in the problem, focused during the
 * search, clean and stable at the brand resolve.
 */

/** Rasterised once by the browser, then only ever repositioned. Cheap grain. */
const GRAIN_URI =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>" +
  "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' seed='7'/>" +
  "<feColorMatrix type='saturate' values='0'/></filter>" +
  "<rect width='180' height='180' filter='url(%23n)' opacity='0.5'/></svg>\")"

const JITTER = seeded(2027, 240)

export function Stage({ frame }: { frame: number }) {
  /** Story lighting: 0 = low-key dread, 1 = confident and clean. */
  const light = track(frame, [
    [0, 0.06],
    [CUE.drip, 0.10],
    [CUE.collapse, 0.16],
    [CUE.surfaceOpen, 0.44],
    [CUE.categoryLock, 0.52],
    [CUE.understood, 0.62],
    [CUE.resultsOpen, 0.70],
    [CUE.trustIn, 0.80],
    [CUE.confirmed, 0.86],
    [CUE.pullback, 0.74],
    [CUE.markIn, 0.92],
    [DURATION, 0.96],
  ], EASE.inOut)

  /** The key light drifts with the action instead of sitting dead centre. */
  const keyX = track(frame, [
    [0, 50], [CUE.surfaceOpen, 50], [CUE.categoryLock, 44],
    [CUE.photoLock, 57], [CUE.responsive, 46], [CUE.trustIn, 54],
    [CUE.pullback, 50], [DURATION, 50],
  ], EASE.inOut)

  const keyY = track(frame, [
    [0, 4], [CUE.collapse, 14], [CUE.surfaceOpen, 34],
    [CUE.understood, 40], [CUE.trustIn, 44], [CUE.markIn, 46], [DURATION, 46],
  ], EASE.inOut)

  const g = Math.floor(frame / 2) % 120
  const gx = JITTER[g * 2] * 180
  const gy = JITTER[g * 2 + 1] * 180

  return (
    <div style={{ position: 'absolute', inset: 0, background: STAGE_BG, overflow: 'hidden' }}>
      {/* Key light — the product's own brand tone, never a purple AI gradient. */}
      <div style={{
        position: 'absolute', inset: '-20%',
        background:
          `radial-gradient(58% 62% at ${keyX}% ${keyY}%, ` +
          `rgba(59,130,246,${0.20 * light + 0.03}) 0%, ` +
          `rgba(30,58,138,${0.16 * light + 0.02}) 34%, ` +
          `rgba(4,7,13,0) 72%)`,
      }} />

      {/* Cool floor bounce, keeps the lower third from going muddy. */}
      <div style={{
        position: 'absolute', inset: 0,
        background:
          `radial-gradient(120% 80% at 50% 118%, rgba(30,41,59,${0.42 * light + 0.05}) 0%, rgba(4,7,13,0) 60%)`,
      }} />

      {/* Vignette — always present, deepest when the story is at its darkest. */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(78% 74% at 50% 48%, rgba(0,0,0,0) 40%, rgba(0,0,0,${0.62 - light * 0.24}) 100%)`,
      }} />

      {/* Grain. Restrained — it should read as film stock, not noise. */}
      <div style={{
        position: 'absolute', inset: -180,
        backgroundImage: GRAIN_URI,
        backgroundPosition: `${gx}px ${gy}px`,
        opacity: 0.085 - light * 0.028,
        mixBlendMode: 'overlay',
      }} />
    </div>
  )
}
