import { EASE, popAt, ramp } from '../motion/anim'
import { BEAT, CUE } from '../motion/timeline'
import { C, FONT } from '../theme'
import { Kicker, Line } from '../components/Type'
import { Cursor } from '../components/Cursor'
import { SURFACE } from '../components/SearchSurface'

/**
 * ACT III — 0:05.5 → 0:12.5. The flagship feature, unveiled.
 *
 * Three ways to describe a problem, resolved by the same surface, in seven
 * seconds: the sentence you type, the sentence you say, the thing you show.
 * Each one is answered, and then the act pays off in a single word.
 *
 * The kickers (TYPE / SAY / SHOW) sit in the left margin as annotations to a
 * live interface — they never take the frame away from the product.
 */

const KICKERS = [
  { text: 'TYPE.', at: BEAT.type.start + 4, out: BEAT.say.start - 6 },
  { text: 'SAY.', at: BEAT.say.start + 2, out: BEAT.show.start - 6 },
  { text: 'SHOW.', at: BEAT.show.start + 2, out: BEAT.understood.start - 6 },
]

export function MultimodalScene({ frame }: { frame: number }) {
  // "Understood." — the emotional payoff of the whole act.
  const u = ramp(frame, CUE.understood, 22, EASE.out)
  const uOut = ramp(frame, BEAT.understood.end - 11, 12, EASE.inOut)
  const chip = popAt(frame, CUE.understood + 10)

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* Left-margin annotations, vertically aligned to the card's top rule. */}
      <div style={{ position: 'absolute', left: 128, top: SURFACE.y + 4 }}>
        {KICKERS.map(k => (
          <div key={k.text} style={{ position: 'absolute', top: 0, left: 0 }}>
            <Kicker frame={frame} at={k.at} delayOut={k.out} size={26}>
              {k.text}
            </Kicker>
          </div>
        ))}
      </div>

      {/* The pointer: arrives, clicks into the field, then leaves the frame to
          the product once typing is under way. */}
      <Cursor
        frame={frame}
        x={[[BEAT.type.start - 22, 1180], [CUE.typeStart - 12, 470], [CUE.typeStart + 16, 470], [CUE.typeStart + 40, 300]]}
        y={[[BEAT.type.start - 22, 880], [CUE.typeStart - 12, SURFACE.y + 52], [CUE.typeStart + 16, SURFACE.y + 52], [CUE.typeStart + 40, 920]]}
        clickAt={[CUE.typeStart - 10]}
        visible={ramp(frame, BEAT.type.start - 24, 10, EASE.out) * (1 - ramp(frame, CUE.typeStart + 26, 14, EASE.in))}
      />

      {/* ── The payoff ── */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 430,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: 1 - uOut,
          transform: `translateY(${uOut * -54}px)`,
        }}
      >
        <Line frame={frame} at={CUE.understood} size={148} weight={700} align="center">
          Understood.
        </Line>

        {/* What it resolved to, locked in beneath the word. */}
        <div
          style={{
            marginTop: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            opacity: chip,
            transform: `translateY(${(1 - chip) * 22}px)`,
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontSize: 22,
              fontWeight: 600,
              color: C.ink500,
              letterSpacing: '0.18em',
            }}
          >
            PLUMBING
          </span>
          <span style={{ width: 5, height: 5, borderRadius: 999, background: C.ink500 }} />
          <span
            style={{
              fontFamily: FONT,
              fontSize: 22,
              fontWeight: 600,
              color: C.brand500,
              letterSpacing: '0.18em',
            }}
          >
            LEAK REPAIR
          </span>
        </div>

        {/* A single rule that will become the top edge of the results view. */}
        <div
          style={{
            marginTop: 46,
            width: 560 * u,
            height: 2,
            borderRadius: 2,
            background: `linear-gradient(90deg, rgba(59,130,246,0), ${C.brand500}, rgba(59,130,246,0))`,
            opacity: 0.8 * u,
          }}
        />
      </div>
    </div>
  )
}
