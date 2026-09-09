import { seeded } from '../motion/anim'
import { C } from '../theme'

const R = seeded(4471, 96)

/**
 * Voice input, visualised. Deterministic: the bar heights come from a seeded
 * sum of sines, so every render produces the identical waveform — no random
 * differences between takes.
 *
 * `energy` 0→1 opens the form; `speaking` gates the live modulation so the
 * bars settle flat when the sentence ends.
 */
export function Waveform({
  frame, bars = 52, width, height = 74, energy, speaking, color = C.brand600,
}: {
  frame: number
  bars?: number
  width: number
  height?: number
  energy: number
  speaking: number
  color?: string
}) {
  const gap = 6
  const bw = (width - gap * (bars - 1)) / bars

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap, height, width,
    }}>
      {Array.from({ length: bars }).map((_, i) => {
        const seed = R[i % R.length]
        const t = frame * 0.34

        // Three detuned components + a seeded offset = organic, never a sine loop.
        const a = Math.sin(t * 0.9 + i * 0.55 + seed * 6.28)
        const b = Math.sin(t * 1.7 + i * 0.31 + seed * 3.1)
        const c = Math.sin(t * 0.42 + i * 0.9)
        const raw = (a * 0.5 + b * 0.32 + c * 0.28 + 1.1) / 2.2

        // Envelope: loudest mid-sentence, tapering at both ends of the bar field.
        const centre = 1 - Math.abs(i / (bars - 1) - 0.5) * 1.5
        const amp = 0.16 + raw * 0.84 * speaking * Math.max(0.25, centre)

        // Bars grow outward from the centre as the form opens.
        const reveal = Math.max(0, Math.min(1, energy * bars - Math.abs(i - bars / 2) * 0.9))
        const h = Math.max(3, height * amp * reveal)

        return (
          <div key={i} style={{
            width: bw, height: h, borderRadius: 999,
            background: color,
            opacity: 0.28 + amp * 0.72,
          }} />
        )
      })}
    </div>
  )
}
