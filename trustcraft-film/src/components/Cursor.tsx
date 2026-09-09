import { EASE, pulse, track } from '../motion/anim'

/**
 * The pointer. It arrives with intent, settles, and presses — the small human
 * presence that makes the interface feel operated rather than animated.
 */
export function Cursor({
  frame, x, y, clickAt, visible = 1,
}: {
  frame: number
  /** Keyframed position tracks, in stage pixels. */
  x: [number, number][]
  y: [number, number][]
  clickAt?: number[]
  visible?: number
}) {
  const px = track(frame, x, EASE.out)
  const py = track(frame, y, EASE.out)
  const press = (clickAt ?? []).reduce((m, c) => Math.max(m, pulse(frame, c, 3, 7)), 0)

  return (
    <div style={{
      position: 'absolute', left: px, top: py,
      transform: `translate(-3px,-2px) scale(${1 - press * 0.14})`,
      opacity: visible,
      pointerEvents: 'none',
      filter: 'drop-shadow(0 4px 10px rgba(2,6,23,.55))',
      willChange: 'transform',
    }}>
      {/* Click ring — expands out of the pointer tip, never a cartoon burst. */}
      {(clickAt ?? []).map(c => {
        const p = frame < c ? 0 : Math.min(1, (frame - c) / 20)
        if (p <= 0 || p >= 1) return null
        return (
          <div key={c} style={{
            position: 'absolute', left: 2, top: 2, width: 10, height: 10,
            marginLeft: -5, marginTop: -5, borderRadius: 999,
            border: '2px solid rgba(96,165,250,.85)',
            transform: `scale(${1 + p * 5.5})`,
            opacity: (1 - p) * 0.8,
          }} />
        )
      })}
      <svg width="30" height="34" viewBox="0 0 24 28" fill="none">
        <path d="M4 2.2 L19.4 15.1 L12.2 15.6 L16.2 24.4 L12.9 25.8 L9 17.1 L4 21.6 Z"
          fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
