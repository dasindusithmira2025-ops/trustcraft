import { interpolate, interpolateColors } from 'remotion'
import { EASE, ramp } from '../motion/anim'
import { CUE } from '../motion/timeline'
import { C, FONT } from '../theme'
import { SURFACE } from '../components/SearchSurface'

/**
 * ACT II — 0:03.3 → 0:05.5
 *
 * The film's first match transition, and the reason it is not a slideshow.
 *
 * The fault fragments collapse to a single point; a line of light snaps out of
 * that point and widens into the TrustCraft capture card. The promise —
 * "Just describe it." — is spoken as a headline and then physically shrinks
 * into the field and becomes its placeholder. The sentence does not fade out
 * and get replaced by a UI: it *is* the UI by the time it lands.
 *
 * TrustCraft's mark only arrives afterwards. The product is revealed through
 * what it does, before it is revealed by name.
 */

/** Progress of the headline → placeholder morph. */
export const morph = (frame: number) => ramp(frame, CUE.surfaceOpen - 2, 24, EASE.lock)

/** Once the morph lands, the surface owns the placeholder. */
export const placeholderHandoff = (frame: number) => ramp(frame, CUE.surfaceOpen + 22, 5, EASE.out)

export function RevealScene({ frame }: { frame: number }) {
  const p = morph(frame)
  const handoff = placeholderHandoff(frame)

  // Reveal of the headline itself, before it starts travelling.
  const inP = ramp(frame, CUE.collapse + 8, 20, EASE.out)

  // The seed line: the card's first frame of existence.
  const seed = ramp(frame, CUE.collapse + 4, 16, EASE.out)
  const seedFade = ramp(frame, CUE.surfaceOpen + 2, 14, EASE.in)

  // Headline start (centred, large) → placeholder end (inside the field).
  const size = interpolate(p, [0, 1], [92, 42])
  const left = interpolate(p, [0, 1], [960, SURFACE.x + 40])
  const top = interpolate(p, [0, 1], [452, SURFACE.y + 30])
  const color = interpolateColors(p, [0, 1], [C.white, C.ink400])

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* The point of collapse becomes a line, the line becomes the card. */}
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: SURFACE.y,
          width: SURFACE.w * seed,
          height: 3,
          marginLeft: (-SURFACE.w * seed) / 2,
          borderRadius: 999,
          background: `linear-gradient(90deg, rgba(59,130,246,0), ${C.brand500}, rgba(59,130,246,0))`,
          boxShadow: `0 0 ${40 * seed}px rgba(59,130,246,.8)`,
          opacity: (1 - seedFade) * 0.95,
        }}
      />

      {/* The promise, travelling into the product. */}
      <div
        style={{
          position: 'absolute',
          left,
          top,
          transform: `translateX(${-50 * (1 - p)}%)`,
          opacity: 1 - handoff,
        }}
      >
        <div style={{ overflow: 'hidden', padding: '0.12em 0.06em', margin: '-0.12em -0.06em' }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: size,
              fontWeight: interpolate(p, [0, 1], [700, 400]),
              color,
              letterSpacing: `${interpolate(p, [0, 1], [-0.032, -0.022])}em`,
              lineHeight: 1.02,
              whiteSpace: 'pre',
              transform: `translateY(${(1 - inP) * 112}%)`,
            }}
          >
            Just describe it.
          </div>
        </div>
      </div>

    </div>
  )
}
