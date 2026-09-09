import { EASE, ramp } from '../motion/anim'
import { C, FONT } from '../theme'
import { Icon } from '../product/icons'

/**
 * The "show it" input: a photograph of the fault, under the cabinet.
 *
 * The repository ships no photographic assets, so this is drawn — a chrome
 * trap and joint with a bead of water, shot shallow. Drawing it keeps the film
 * free of stock footage and keeps the render deterministic and offline.
 *
 * `lock` 0→1 runs the scan: corner brackets converge on the wet joint and the
 * finding is labelled. No sci-fi scanner, no particles — it reads like a
 * camera acquiring focus.
 */
export function PhotoTile({
  frame, w, h, lockAt, label,
}: {
  frame: number; w: number; h: number; lockAt: number; label: string
}) {
  const lock = ramp(frame, lockAt, 26, EASE.lock)
  const labelIn = ramp(frame, lockAt + 14, 18, EASE.out)

  // The wet joint, in tile-local coordinates.
  const fx = 0.545
  const fy = 0.47

  return (
    <div style={{
      width: w, height: h, borderRadius: 14, overflow: 'hidden',
      position: 'relative', background: '#0B0F16',
      boxShadow: 'inset 0 0 0 1px rgba(15,23,42,.35)',
    }}>
      {/* Cabinet interior — warm, underexposed, falling off to black. */}
      <div style={{
        position: 'absolute', inset: 0,
        background:
          'radial-gradient(78% 88% at 46% 34%, #3B3226 0%, #241E17 42%, #0D0B08 100%)',
      }} />
      {/* Board seams behind the plumbing. */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.5,
        background:
          'repeating-linear-gradient(96deg, rgba(0,0,0,0) 0 44px, rgba(0,0,0,.42) 44px 46px)',
      }} />

      {/* Chrome trap: down-pipe, collar, and the run into the wall. */}
      <div style={{
        position: 'absolute', left: `${fx * 100}%`, top: '4%',
        width: h * 0.135, height: h * 0.45, marginLeft: -h * 0.0675, borderRadius: 4,
        background: 'linear-gradient(90deg, #6E7A88 0%, #C8D2DC 26%, #7C8794 56%, #333C47 100%)',
      }} />
      <div style={{
        position: 'absolute', left: `${fx * 100}%`, top: `${fy * 100}%`,
        width: h * 0.19, height: h * 0.115, marginLeft: -h * 0.095, borderRadius: 5,
        background: 'linear-gradient(90deg, #5C6773 0%, #D5DEE6 28%, #808C99 58%, #2C343E 100%)',
        boxShadow: '0 3px 10px rgba(0,0,0,.55)',
      }} />
      <div style={{
        position: 'absolute', left: `${fx * 100}%`, top: `${fy * 100 + 10}%`,
        width: h * 0.135, height: h * 0.30, marginLeft: -h * 0.0675, borderRadius: 4,
        background: 'linear-gradient(90deg, #5A6673 0%, #AFB9C4 26%, #6A7480 58%, #2A323B 100%)',
      }} />

      {/* The leak: a swollen bead under the collar and the wet trail below it. */}
      <div style={{
        position: 'absolute', left: `${fx * 100}%`, top: `${fy * 100 + 11.5}%`,
        width: h * 0.05, height: h * 0.062, marginLeft: -h * 0.025, borderRadius: '50% 50% 44% 44%',
        background: 'linear-gradient(180deg, rgba(226,240,255,.95), rgba(120,170,220,.75))',
        boxShadow: '0 0 14px rgba(150,200,255,.5)',
      }} />
      <div style={{
        position: 'absolute', left: `${fx * 100}%`, top: `${fy * 100 + 17}%`,
        width: h * 0.10, height: h * 0.30, marginLeft: -h * 0.05,
        background: 'linear-gradient(180deg, rgba(170,205,240,.30), rgba(120,160,200,0))',
        filter: 'blur(3px)',
      }} />
      {/* Pooled water catching the light. */}
      <div style={{
        position: 'absolute', left: `${fx * 100}%`, bottom: '6%',
        width: h * 0.52, height: h * 0.13, marginLeft: -h * 0.26, borderRadius: '50%',
        background: 'radial-gradient(50% 50% at 50% 50%, rgba(190,220,250,.30) 0%, rgba(150,190,230,0) 72%)',
        filter: 'blur(4px)',
      }} />

      {/* Shallow depth of field + lens vignette. */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(46% 52% at 55% 47%, rgba(0,0,0,0) 38%, rgba(6,9,14,.72) 100%)',
      }} />

      {/* ── Scan lock: four brackets closing on the finding ── */}
      {lock > 0.01 && (() => {
        const spread = (1 - lock) * h * 0.34
        const bw = h * 0.085
        const bx = fx * w
        const by = fy * h + h * 0.06
        const box = h * 0.19
        const corner = (sx: number, sy: number, k: string) => (
          <div key={k} style={{
            position: 'absolute',
            left: bx + sx * (box + spread) - (sx > 0 ? 0 : bw),
            top: by + sy * (box + spread) - (sy > 0 ? 0 : 0),
            width: bw, height: bw,
            borderTop: sy < 0 ? `2.5px solid ${C.brand500}` : undefined,
            borderBottom: sy > 0 ? `2.5px solid ${C.brand500}` : undefined,
            borderLeft: sx < 0 ? `2.5px solid ${C.brand500}` : undefined,
            borderRight: sx > 0 ? `2.5px solid ${C.brand500}` : undefined,
            opacity: lock,
          }} />
        )
        return (
          <>
            {corner(-1, -1, 'tl')}{corner(1, -1, 'tr')}
            {corner(-1, 1, 'bl')}{corner(1, 1, 'br')}
          </>
        )
      })()}

      {/* The finding, stated plainly. */}
      <div style={{
        position: 'absolute', left: 12, bottom: 12,
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(2,6,23,.74)',
        border: `1px solid rgba(59,130,246,${0.45 * labelIn})`,
        borderRadius: 9, padding: '6px 10px',
        opacity: labelIn,
        transform: `translateY(${(1 - labelIn) * 10}px)`,
        fontFamily: FONT, fontSize: 15, fontWeight: 600, color: C.white,
        whiteSpace: 'nowrap',
      }}>
        <span style={{ color: C.brand500, display: 'flex' }}><Icon name="warn" size={16} /></span>
        {label}
      </div>
    </div>
  )
}
