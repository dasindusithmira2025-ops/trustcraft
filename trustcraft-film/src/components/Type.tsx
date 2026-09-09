import type { CSSProperties } from 'react'
import { EASE, ramp } from '../motion/anim'
import { C, FONT } from '../theme'

/**
 * The film's typography. Two rules, enforced here rather than per-scene:
 * headlines arrive by masked upward reveal (never a fade), and tracking
 * tightens as the type settles so the word feels like it locks into place.
 */

export function Line({
  children, frame, at, dur = 24, size = 96, weight = 700, color = C.white,
  align = 'left', style, delayOut, outDur = 16,
}: {
  children: string
  frame: number
  at: number
  dur?: number
  size?: number
  weight?: number
  color?: string
  align?: CSSProperties['textAlign']
  style?: CSSProperties
  /** Frame at which the line clips back out (upward). */
  delayOut?: number
  outDur?: number
}) {
  const inP = ramp(frame, at, dur, EASE.out)
  const outP = delayOut === undefined ? 0 : ramp(frame, delayOut, outDur, EASE.in)

  // In: rises from below its own mask. Out: continues upward, never fades in place.
  const y = (1 - inP) * 112 - outP * 112

  return (
    <div style={{ overflow: 'hidden', padding: '0.14em 0.06em', margin: '-0.14em -0.06em', ...style }}>
      <div style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        color,
        textAlign: align,
        lineHeight: 1.02,
        // Tracking opens slightly on entry and tightens as it settles.
        letterSpacing: `${-0.032 + (1 - inP) * 0.022}em`,
        transform: `translateY(${y}%)`,
        whiteSpace: 'pre',
        willChange: 'transform',
      }}>{children}</div>
    </div>
  )
}

/** Small brand-blue label. Used for TYPE / SAY / SHOW and section kickers. */
export function Kicker({
  children, frame, at, color = C.brand500, size = 22, style, delayOut,
}: {
  children: string; frame: number; at: number; color?: string; size?: number
  style?: CSSProperties; delayOut?: number
}) {
  const p = ramp(frame, at, 16, EASE.out)
  const out = delayOut === undefined ? 0 : ramp(frame, delayOut, 12, EASE.in)
  return (
    <div style={{
      fontFamily: FONT, fontSize: size, fontWeight: 600, color,
      letterSpacing: `${0.26 - p * 0.08}em`, textTransform: 'uppercase',
      opacity: p * (1 - out),
      transform: `translateY(${(1 - p) * 10}px)`,
      whiteSpace: 'pre',
      ...style,
    }}>{children}</div>
  )
}

/** A thin brand rule that draws out from its origin. Used under headlines. */
export function Rule({ frame, at, width = 120, dur = 26, color = C.brand500, style }: {
  frame: number; at: number; width?: number; dur?: number; color?: string; style?: CSSProperties
}) {
  const p = ramp(frame, at, dur, EASE.out)
  return (
    <div style={{
      height: 2, width: width * p, background: color, borderRadius: 2,
      opacity: 0.9, ...style,
    }} />
  )
}

/**
 * Phrase replacement: two lines stacked inside ONE mask, rolled by exactly one
 * line height.
 *
 * Cross-fading two separately-masked headlines at the same coordinates lets
 * both be legible at once and reads as a mistake. Sharing a mask makes overlap
 * geometrically impossible — the outgoing line can only leave as the incoming
 * one arrives.
 */
export function PhraseSwap({
  frame, first, second, at, swapAt, size = 104, weight = 700,
  color = C.white, secondColor, dur = 24, style,
}: {
  frame: number
  first: string
  second: string
  at: number
  swapAt: number
  size?: number
  weight?: number
  color?: string
  secondColor?: string
  dur?: number
  style?: CSSProperties
}) {
  const lh = Math.round(size * 1.34)
  const inP = ramp(frame, at, dur, EASE.out)
  const roll = ramp(frame, swapAt, 22, EASE.out)

  const line = (text: string, c: string) => (
    <div
      style={{
        height: lh,
        display: 'flex',
        alignItems: 'center',
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        color: c,
        lineHeight: 1,
        letterSpacing: `${-0.032 + (1 - inP) * 0.022}em`,
        whiteSpace: 'pre',
      }}
    >
      {text}
    </div>
  )

  return (
    <div style={{ height: lh, overflow: 'hidden', ...style }}>
      <div
        style={{
          transform: `translateY(${(1 - inP) * lh - roll * lh}px)`,
          willChange: 'transform',
        }}
      >
        {line(first, color)}
        {line(second, secondColor ?? color)}
      </div>
    </div>
  )
}
