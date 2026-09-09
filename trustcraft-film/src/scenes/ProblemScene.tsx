import { interpolate } from 'remotion'
import { EASE, ramp } from '../motion/anim'
import { CUE } from '../motion/timeline'
import { C } from '../theme'
import { PhraseSwap, Rule } from '../components/Type'

/**
 * ACT I — 0:00.0 → 0:03.3
 *
 * Something goes wrong in a home, in the dark. No product, no logo, no
 * promise — just the moment before you know what to do.
 *
 * The only literal object is a pipe joint with a slow leak, drawn rather than
 * stocked. Its drip is the film's first sound cue and its ripple is what the
 * camera is looking at when the first line lands.
 */

/** One drip cycle: swell at the joint, detach, fall, impact. */
function drip(frame: number, start: number) {
  const t = frame - start
  if (t < 0) return null
  const swell = interpolate(t, [0, 16], [0, 1], { extrapolateRight: 'clamp', easing: EASE.inOut })
  const fallP = interpolate(t, [16, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  // Gravity, not a linear tween.
  const fall = fallP * fallP
  const impact = t - 30
  return { swell, fall, fallP, impact, t }
}

export function ProblemScene({ frame }: { frame: number }) {
  const PIPE_X = 742
  const PIPE_Y = 214
  const FLOOR_Y = 556

  const d1 = drip(frame, CUE.drip - 22)
  const d2 = drip(frame, CUE.drip + 44)

  // The whole act lifts and dims away as the collapse takes over.
  const exit = ramp(frame, CUE.collapse - 10, 20, EASE.in)

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 1 - exit }}>
      {/* ── The pipe. Dark on dark; only its left edge catches the key light. ── */}
      <div style={{
        position: 'absolute', left: PIPE_X, top: -40,
        transform: `translateY(${exit * -40}px)`,
      }}>
        {/* vertical run */}
        <div style={{
          width: 44, height: PIPE_Y + 40, borderRadius: 6,
          background: 'linear-gradient(90deg, #263243 0%, #131C29 42%, #080D15 100%)',
          boxShadow: 'inset 1px 0 0 rgba(148,163,184,.16)',
        }} />
        {/* joint collar */}
        <div style={{
          width: 62, height: 30, marginLeft: -9, borderRadius: 5,
          background: 'linear-gradient(90deg, #2E3B4E 0%, #17202E 46%, #0A1018 100%)',
          boxShadow: 'inset 1px 0 0 rgba(148,163,184,.20), 0 2px 6px rgba(0,0,0,.5)',
        }} />
        {/* short outlet */}
        <div style={{
          width: 44, height: 26, borderRadius: '0 0 8px 8px',
          background: 'linear-gradient(90deg, #222E3E 0%, #111927 44%, #070C13 100%)',
          boxShadow: 'inset 1px 0 0 rgba(148,163,184,.12)',
        }} />
      </div>

      {/* ── Droplets ── */}
      {[d1, d2].map((d, i) => {
        if (!d) return null
        const y = PIPE_Y + 66 + d.fall * (FLOOR_Y - PIPE_Y - 66)
        const stretch = 1 + d.fallP * 1.5
        const gone = d.fallP >= 1
        return (
          <div key={i} style={{
            position: 'absolute',
            left: PIPE_X + 22 - 4,
            top: y,
            width: 8, height: 8 * stretch,
            borderRadius: '50% 50% 46% 46%',
            background: 'linear-gradient(180deg, rgba(191,219,254,.92), rgba(59,130,246,.55))',
            boxShadow: '0 0 12px rgba(96,165,250,.45)',
            opacity: gone ? 0 : (d.swell * 0.35 + 0.65),
            transform: `scaleX(${1 - d.fallP * 0.28})`,
          }} />
        )
      })}

      {/* ── Impact ripples on the unseen floor ── */}
      {[d1, d2].map((d, i) => {
        if (!d || d.impact < 0) return null
        const p = interpolate(d.impact, [0, 34], [0, 1], { extrapolateRight: 'clamp', easing: EASE.out })
        if (p >= 1) return null
        return (
          <div key={i}>
            <div style={{
              position: 'absolute', left: PIPE_X + 22, top: FLOOR_Y + 6,
              width: 2, height: 2, borderRadius: 999,
              border: '1.5px solid rgba(96,165,250,.5)',
              transform: `translate(-50%,-50%) scale(${1 + p * 118})`,
              opacity: (1 - p) * 0.5,
            }} />
            <div style={{
              position: 'absolute', left: PIPE_X + 22, top: FLOOR_Y + 6,
              width: 2, height: 2, borderRadius: 999,
              border: '1.5px solid rgba(148,163,184,.4)',
              transform: `translate(-50%,-50%) scale(${1 + p * 74}) scaleY(.34)`,
              opacity: (1 - p) * 0.34,
            }} />
          </div>
        )
      })}

      {/* Faint wet sheen where the drips are landing. */}
      <div style={{
        position: 'absolute', left: PIPE_X + 22 - 200, top: FLOOR_Y - 34,
        width: 400, height: 80,
        background: 'radial-gradient(50% 50% at 50% 50%, rgba(59,130,246,.13) 0%, rgba(0,0,0,0) 70%)',
        opacity: ramp(frame, CUE.drip, 30, EASE.out),
      }} />

      {/* ── Type. Lower-left, cinematically weighted — never a centred title. ── */}
      <div style={{
        position: 'absolute', left: 168, top: 668,
        transform: `translateY(${exit * -72}px)`,
      }}>
        <Rule frame={frame} at={CUE.titleIn + 4} width={96} style={{ marginBottom: 30 }} />
        <PhraseSwap
          frame={frame}
          first="Something breaks."
          second="Now what?"
          at={CUE.titleIn}
          swapAt={CUE.titleSwap}
          size={104}
          secondColor={C.ink300}
        />
      </div>
    </div>
  )
}
