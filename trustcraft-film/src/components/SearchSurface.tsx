import { EASE, popAt, ramp, seeded, springAt } from '../motion/anim'
import { BEAT, CUE } from '../motion/timeline'
import { C, FONT, SHADOW } from '../theme'
import { Icon } from '../product/icons'
import { REQUEST, CUSTOMER } from '../product/data'
import { Waveform } from './Waveform'
import { PhotoTile } from './PhotoTile'

/**
 * The TrustCraft problem-capture surface — the film's persistent hero object.
 *
 * This is the app's real "Tell us your problem" card from HomeScreen: the same
 * textarea, the same 500-character counter, the same four capture modes
 * (Photo / Video / Voice / Location). It opens in Act II and is continuously
 * transformed through Act III rather than being cut away and replaced.
 */

/** Shared geometry so other scenes can match-transition to and from it. */
export const SURFACE = { x: 370, w: 1180, y: 372 } as const

/** Body + counter + divider + capture row. Drives the opening unroll. */
const CARD_H = 348

const JIT = seeded(8823, 64)

/** Character count with human cadence — deterministic, never metronomic. */
function typedCount(frame: number, start: number, text: string, framesPerChar: number) {
  const t = frame - start
  if (t <= 0) return 0
  let n = 0
  for (let i = 0; i < text.length; i++) {
    // Seeded jitter, plus a beat of hesitation after each word break.
    const jitter = (JIT[i % JIT.length] - 0.5) * 0.9
    const pause = i > 0 && text[i - 1] === ' ' ? 1.6 : 0
    n += framesPerChar + jitter + pause
    if (t < n) return i
  }
  return text.length
}

/** The four capture modes, exactly as the product lists them. */
const MODES = [
  { icon: 'camera', label: 'Photo' },
  { icon: 'video', label: 'Video' },
  { icon: 'mic', label: 'Voice' },
  { icon: 'pin', label: 'Location' },
]

export function SearchSurface({ frame, showPlaceholder }: { frame: number; showPlaceholder: number }) {
  // ── Opening: a line of light widens, then the card grows from it ──────────
  const openX = ramp(frame, CUE.collapse + 6, 22, EASE.out)
  const openY = ramp(frame, CUE.surfaceOpen, 20, EASE.out)

  // ── Focus ring: the field is focused once the cursor clicks in ────────────
  const focus = ramp(frame, CUE.typeStart - 10, 12, EASE.out)

  // ── Act III state machine ─────────────────────────────────────────────────
  const nType = typedCount(frame, CUE.typeStart, REQUEST.typed, 1.35)
  const typeOut = ramp(frame, BEAT.say.start - 4, 14, EASE.in)

  const voiceOn = ramp(frame, CUE.voiceOn - 8, 14, EASE.out)
  const speaking =
    ramp(frame, CUE.voiceOn, 10, EASE.out) * (1 - ramp(frame, CUE.voiceLock - 8, 12, EASE.inOut))
  const nSpoken = typedCount(frame, CUE.voiceOn + 4, REQUEST.spoken, 1.15)
  const voiceOut = ramp(frame, BEAT.show.start - 4, 14, EASE.in)

  const photoIn = springAt(frame, CUE.photoDrop, { damping: 15, mass: 0.9, stiffness: 110 })
  const photoOut = ramp(frame, BEAT.understood.start + 2, 16, EASE.in)

  // Body height is fixed: the photograph sits inside the existing text area
  // rather than growing the card, so the rows beneath it never shift.
  const bodyH = 196

  // The request text is visible while typing AND again beneath the photograph:
  // a photo is an attachment to the description, not a replacement for it.
  const textIn = Math.min(1, 1 - typeOut + photoIn * (1 - photoOut))

  const caret = Math.floor(frame / 14) % 2 === 0 ? 1 : 0
  const isTyping = frame >= CUE.typeStart && nType < REQUEST.typed.length

  // Which capture mode is lit.
  const modeActive = (label: string) => {
    if (label === 'Voice') return voiceOn * (1 - voiceOut)
    if (label === 'Photo') return photoIn * (1 - photoOut)
    return 0
  }

  // Whole surface releases as "Understood." takes the frame.
  // Recedes into depth as the payoff comes forward — no two elements in
  // this transition travel the same direction.
  const release = ramp(frame, BEAT.understood.start - 6, 16, EASE.inOut)

  const labelIn = ramp(frame, CUE.brandIn, 18, EASE.out)
  const micPulse = 0.5 + 0.5 * Math.sin(frame * 0.34)

  return (
    <div
      style={{
        position: 'absolute',
        left: SURFACE.x,
        top: SURFACE.y,
        width: SURFACE.w,
        opacity: 1 - release,
        transform: `translateY(${release * 20}px) scale(${1 - release * 0.14})`,
      }}
    >
      {/* Section label — the product's own words. */}
      <div
        style={{
          position: 'absolute',
          top: -52,
          left: 2,
          fontFamily: FONT,
          fontSize: 25,
          fontWeight: 600,
          color: C.ink300,
          opacity: labelIn * (1 - release),
          transform: `translateY(${(1 - labelIn) * 12}px)`,
          letterSpacing: '-0.01em',
        }}
      >
        Tell us your problem
      </div>

      {/* ── The card ── */}
      <div
        style={{
          width: `${openX * 100}%`,
          marginLeft: `${(1 - openX) * 50}%`,
          background: C.white,
          borderRadius: 26,
          border: `2px solid ${focus > 0 ? `rgba(59,130,246,${0.35 + focus * 0.65})` : C.ink200}`,
          boxShadow: `${SHADOW.hero}, 0 0 ${60 * focus}px -10px rgba(37,99,235,${0.5 * focus})`,
          // One clean unroll: the card's own height is the reveal, so nothing
          // inside it can occupy space before the card exists.
          height: openY * CARD_H,
          overflow: 'hidden',
          transformOrigin: '50% 0%',
        }}
      >
        {/* Body */}
        <div
          style={{
            height: bodyH,
            padding: '28px 40px 0',
            position: 'relative',
            display: 'flex',
            gap: 26,
            alignItems: 'flex-start',
          }}
        >
          {/* The photograph, when shown. */}
          {photoIn > 0.01 && (
            <div
              style={{
                width: 300,
                flexShrink: 0,
                opacity: photoIn * (1 - photoOut),
                transform: `scale(${0.86 + photoIn * 0.14}) rotate(${(1 - photoIn) * -4}deg)`,
                transformOrigin: '50% 40%',
              }}
            >
              <PhotoTile
                frame={frame}
                w={300}
                h={166}
                lockAt={CUE.photoLock}
                label={REQUEST.photoLabel}
              />
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0, position: 'relative', paddingTop: 2 }}>
            {/* Placeholder — inherited from the "Just describe it." headline. */}
            <div
              style={{
                position: 'absolute',
                top: 2,
                left: 0,
                fontFamily: FONT,
                fontSize: 42,
                color: C.ink400,
                fontWeight: 400,
                letterSpacing: '-0.022em',
                opacity: showPlaceholder * (1 - ramp(frame, CUE.typeStart - 6, 10, EASE.in)),
              }}
            >
              Just describe it.
            </div>

            {/* While a photo is attached, name what the text now is. */}
            <div
              style={{
                fontFamily: FONT,
                fontSize: 17,
                fontWeight: 600,
                color: C.ink400,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: 12,
                height: 20 * photoIn * (1 - photoOut),
                opacity: photoIn * (1 - photoOut),
              }}
            >
              Your request
            </div>

            {/* TYPE — the user's own sentence. */}
            <div
              style={{
                fontFamily: FONT,
                fontSize: 42,
                color: C.ink800,
                fontWeight: 400,
                lineHeight: 1.34,
                letterSpacing: '-0.022em',
                opacity: textIn,
                transform: `translateY(${(1 - textIn) * -22}px)`,
              }}
            >
              {REQUEST.typed.slice(0, nType)}
              <span
                style={{
                  display: 'inline-block',
                  width: 3,
                  height: 40,
                  marginLeft: 3,
                  marginBottom: -6,
                  background: C.brand600,
                  // The caret only blinks while the field is actually being typed into.
                  opacity:
                    (isTyping ? 1 : caret) * (1 - typeOut) * (frame >= CUE.typeStart - 8 ? 1 : 0),
                }}
              />
            </div>

            {/* SAY — the same slot becomes a live voice field. */}
            {voiceOn > 0.01 && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  opacity: voiceOn * (1 - voiceOut),
                  transform: `translateY(${(1 - voiceOn) * 26 - voiceOut * 20}px)`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  {/* Live mic. The ring pulses only while sound is arriving. */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div
                      style={{
                        position: 'absolute',
                        inset: -6,
                        borderRadius: 999,
                        border: `2px solid ${C.brand500}`,
                        opacity: 0.55 * speaking * micPulse,
                        transform: `scale(${1 + 0.16 * speaking * micPulse})`,
                      }}
                    />
                    <div
                      style={{
                        width: 58,
                        height: 58,
                        borderRadius: 999,
                        background: C.brand600,
                        color: C.white,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 26px -6px rgba(37,99,235,.6)',
                      }}
                    >
                      <Icon name="mic" size={27} strokeWidth={2} />
                    </div>
                  </div>
                  <Waveform frame={frame} width={620} height={62} energy={voiceOn} speaking={speaking} />
                </div>
                <div
                  style={{
                    marginTop: 14,
                    fontFamily: FONT,
                    fontSize: 34,
                    color: C.ink700,
                    fontWeight: 400,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {REQUEST.spoken.slice(0, nSpoken)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 500-character counter — a real detail from the product. */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '0 40px 12px',
            opacity: openY * (1 - voiceOn) * (1 - photoIn),
            fontFamily: FONT,
            fontSize: 17,
            color: C.ink400,
          }}
        >
          {Math.max(0, nType)}/500
        </div>

        {/* The four capture modes. */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            borderTop: `1px solid ${C.ink100}`,
            opacity: openY,
          }}
        >
          {MODES.map((m, i) => {
            const on = modeActive(m.label)
            return (
              <div
                key={m.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 7,
                  padding: '18px 0 20px',
                  borderRight: i < 3 ? `1px solid ${C.ink100}` : 'none',
                  background: on > 0 ? `rgba(239,246,255,${on})` : 'transparent',
                  color: on > 0.35 ? C.brand600 : C.ink500,
                  fontFamily: FONT,
                }}
              >
                <Icon name={m.icon} size={25} />
                <span style={{ fontSize: 17, fontWeight: 500 }}>{m.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Location row — the product shows it directly under the card. */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 18,
          fontFamily: FONT,
          fontSize: 21,
          color: C.ink300,
          opacity: openY * ramp(frame, CUE.brandIn + 6, 16, EASE.out) * (1 - release),
        }}
      >
        <span style={{ color: C.brand500, display: 'flex' }}>
          <Icon name="pin" size={20} />
        </span>
        {CUSTOMER.location}
      </div>
    </div>
  )
}

/**
 * What TrustCraft worked out — shown beneath the surface, arriving with the
 * quiet confidence of a resolved answer rather than an "AI analysing" spinner.
 */
export function CategoryResolve({ frame }: { frame: number }) {
  const resolves = [
    { at: CUE.categoryLock, out: BEAT.say.start + 2, icon: 'wrench', label: 'Plumbing', detail: 'Leak Repair' },
    { at: CUE.voiceLock, out: BEAT.show.start + 2, icon: 'flip', label: 'AC Repair', detail: 'Not Cooling' },
    { at: CUE.photoLock + 4, out: BEAT.understood.start + 4, icon: 'wrench', label: 'Plumbing', detail: 'Leak Repair' },
  ]

  return (
    <div style={{ position: 'absolute', left: SURFACE.x, top: 830, width: SURFACE.w }}>
      {resolves.map((r, i) => {
        const p = popAt(frame, r.at)
        const out = ramp(frame, r.out, 12, EASE.in)
        if (p <= 0.001 || out >= 1) return null
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              opacity: p * (1 - out),
              transform: `translateY(${(1 - p) * 18 - out * 14}px)`,
            }}
          >
            <span
              style={{
                fontFamily: FONT,
                fontSize: 19,
                fontWeight: 600,
                color: C.ink500,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              Understood as
            </span>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(37,99,235,.16)',
                border: '1.5px solid rgba(59,130,246,.55)',
                color: C.white,
                borderRadius: 999,
                padding: '10px 20px',
                fontFamily: FONT,
                fontSize: 24,
                fontWeight: 600,
                boxShadow: `0 12px 34px -10px rgba(37,99,235,${0.7 * p})`,
                transform: `scale(${0.94 + p * 0.06})`,
              }}
            >
              <span style={{ color: C.brand500, display: 'flex' }}>
                <Icon name={r.icon} size={22} />
              </span>
              {r.label}
              <span style={{ width: 1, height: 18, background: 'rgba(255,255,255,.25)' }} />
              <span style={{ color: C.brand200, fontWeight: 500 }}>{r.detail}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
