import { interpolate } from 'remotion'
import { EASE, ramp } from '../motion/anim'
import { CUE } from '../motion/timeline'
import { C, FONT } from '../theme'
import { ShieldDraw } from '../product/icons'

/**
 * ACT VIII — 0:27.0 → 0:30.0
 *
 * Everything unnecessary leaves. The mark the categories converged on travels
 * into its lockup, the shield redraws itself, the wordmark clears its mask,
 * and TrustCraft's own line lands underneath.
 *
 * The lockup is laid out as a centred flex row rather than at measured
 * coordinates, so the mark and wordmark are optically centred no matter how
 * the font renders. The mark's journey in from the ecosystem is expressed as
 * an offset that decays to zero — motion is applied on top of a layout that is
 * already correct, which is why the final frame lands exactly centred.
 */

const MARK = 104
const GAP = 30
const LOCKUP_Y = 452

export function FinaleScene({ frame }: { frame: number }) {
  // The mark arrives from where the categories converged, and settles into place.
  const travel = ramp(frame, CUE.markIn - 2, 30, EASE.inOut)
  const offX = (1 - travel) * 274
  const offY = (1 - travel) * 50
  const offScale = interpolate(travel, [0, 1], [0.82, 1])

  // The shield redraws itself as it arrives.
  const draw = ramp(frame, CUE.markIn, 30, EASE.out)
  // Wordmark clears its mask, immediately after the mark lands.
  const word = ramp(frame, CUE.markIn + 22, 26, EASE.out)

  const tag = ramp(frame, CUE.taglineIn, 24, EASE.out)
  const rule = ramp(frame, CUE.taglineIn - 4, 26, EASE.out)

  // Residual motion — the frame settles, it never freezes dead.
  const settle = ramp(frame, CUE.markIn, 80, EASE.inOut)
  const drift = (1 - settle) * 8

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* Key light tightens behind the lockup. */}
      <div
        style={{
          position: 'absolute',
          left: 210,
          top: LOCKUP_Y - 310,
          width: 1500,
          height: 700,
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(37,99,235,.20) 0%, rgba(37,99,235,0) 68%)',
          opacity: draw * 0.9,
        }}
      />

      {/* ── The lockup: mark + wordmark, centred as one optical unit ── */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: LOCKUP_Y,
          height: MARK,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: GAP,
          transform: `translateY(${drift * 0.4}px)`,
        }}
      >
        <div
          style={{
            width: MARK,
            height: MARK,
            flexShrink: 0,
            transform: `translate(${offX}px, ${offY}px) scale(${offScale})`,
            filter: `drop-shadow(0 14px 40px rgba(37,99,235,${0.42 * draw}))`,
          }}
        >
          <ShieldDraw size={MARK} progress={draw} color={C.brand500} />
        </div>

        <div
          style={{
            fontFamily: FONT,
            fontSize: 108,
            fontWeight: 700,
            color: C.white,
            letterSpacing: '-0.035em',
            lineHeight: 1,
            whiteSpace: 'pre',
            // Masked reveal outward from the mark, plus a breath of tracking.
            clipPath: `inset(-0.2em ${(1 - word) * 100}% -0.2em 0)`,
            transform: `translateX(${(1 - word) * -26}px)`,
          }}
        >
          TrustCraft
        </div>
      </div>

      {/* ── The line ── */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: LOCKUP_Y + MARK + 84,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 40,
        }}
      >
        <div
          style={{
            width: 132 * rule,
            height: 2,
            borderRadius: 2,
            background: C.brand500,
            opacity: 0.75 * rule,
          }}
        />

        <div style={{ overflow: 'hidden', padding: '0.16em 0.1em', margin: '-0.16em -0.1em' }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 42,
              fontWeight: 500,
              color: C.ink300,
              letterSpacing: '0.01em',
              whiteSpace: 'pre',
              transform: `translateY(${(1 - tag) * 116}%)`,
              opacity: interpolate(tag, [0, 0.3, 1], [0, 1, 1]),
            }}
          >
            Describe it.  Find them.  Trust the choice.
          </div>
        </div>
      </div>
    </div>
  )
}
