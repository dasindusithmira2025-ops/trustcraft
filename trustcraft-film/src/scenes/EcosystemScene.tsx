import { EASE, ramp } from '../motion/anim'
import { CUE, FILM } from '../motion/timeline'
import { C, FONT } from '../theme'
import { Icon } from '../product/icons'
import { Line } from '../components/Type'

/**
 * ACT VII — 0:24.6 → 0:26.6
 *
 * One solved problem becomes a platform. The app's real service categories
 * converge on the TrustCraft mark, each drawing a line back to it — the shape
 * of a network rather than a menu.
 *
 * The positions are composed by hand rather than generated on an ellipse: a
 * formula spreads things evenly, which is not the same as balancing them. The
 * top of the frame is deliberately left clear for the headline, and no node
 * sits near enough to an edge to feel like it is falling out of frame.
 */

/** The point everything converges on, and the point the finale inherits. */
export const ECO_CENTER = { x: 960, y: 566 }
export const ECO_MARK = 86

/**
 * Seven services from the product's CATEGORIES list. "Others" is omitted: it
 * is a real filter in the app, but it is not a trade and it says nothing on
 * screen.
 */
const NODES = [
  { label: 'Plumbers', icon: 'wrench', x: 560, y: 372, z: 0.12 },
  { label: 'Electricians', icon: 'sparkle', x: 1372, y: 348, z: 0.3 },
  { label: 'Appliance Repair', icon: 'card', x: 1610, y: 566, z: 0.56 },
  { label: 'Cleaners', icon: 'star', x: 1292, y: 812, z: 0.22 },
  { label: 'Carpenters', icon: 'cases', x: 656, y: 840, z: 0.4 },
  { label: 'Painters', icon: 'edit', x: 340, y: 632, z: 0.6 },
  { label: 'AC Repair', icon: 'flip', x: 968, y: 902, z: 0.18 },
]

export function EcosystemScene({ frame }: { frame: number }) {
  const start = FILM.ecosystem.start
  const markIn = ramp(frame, start + 6, 20, EASE.out)

  // The mark is handed to the finale the frame its travel begins — the two
  // must never draw at once.
  const markVisible = frame < CUE.markIn - 2 ? 1 : 0

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* Copy sits high, in the gap left for it. */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 168 }}>
        <Line frame={frame} at={CUE.pullback + 16} size={76} weight={600} align="center" color={C.ink300}>
          Whatever the problem.
        </Line>
      </div>

      {NODES.map((n, i) => {
        const at = start + 12 + i * 2.6
        const p = ramp(frame, at, 28, EASE.out)

        // Fly in along the radial from further out — a convergence, not a fade.
        const dx = n.x - ECO_CENTER.x
        const dy = n.y - ECO_CENTER.y
        const dist = 1 + 0.62 * (1 - p)
        const x = ECO_CENTER.x + dx * dist
        const y = ECO_CENTER.y + dy * dist

        const near = 1 - n.z
        const scale = (0.84 + near * 0.24) * (0.9 + p * 0.1)

        const len = Math.hypot(dx, dy)
        const ang = (Math.atan2(dy, dx) * 180) / Math.PI
        const lineP = ramp(frame, at + 10, 24, EASE.out)

        return (
          <div key={n.label}>
            {/* Connector back to the mark: bright enough at the mark end to
                read on a dark stage, gone before it reaches the label. */}
            <div
              style={{
                position: 'absolute',
                left: ECO_CENTER.x,
                top: ECO_CENTER.y,
                width: (len - 96) * lineP,
                height: 1.6,
                transformOrigin: '0 50%',
                transform: `rotate(${ang}deg)`,
                background: `linear-gradient(90deg, rgba(59,130,246,${0.5 * (0.4 + near * 0.6)}) 0%, rgba(59,130,246,${0.18 * near}) 62%, rgba(59,130,246,0) 100%)`,
                opacity: lineP,
              }}
            />

            <div
              style={{
                position: 'absolute',
                left: x,
                top: y,
                transform: `translate(-50%,-50%) scale(${scale})`,
                opacity: p * (0.42 + near * 0.58),
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'rgba(15,23,42,.72)',
                border: `1px solid rgba(148,163,184,${0.16 + near * 0.16})`,
                borderRadius: 999,
                padding: '13px 26px',
                whiteSpace: 'nowrap',
                fontFamily: FONT,
                fontSize: 26,
                fontWeight: 600,
                color: C.ink200,
                filter: `blur(${n.z * 1.6}px)`,
              }}
            >
              <span style={{ color: C.brand500, display: 'flex' }}>
                <Icon name={n.icon} size={24} />
              </span>
              {n.label}
            </div>
          </div>
        )
      })}

      {/* ── The mark at the centre of it all ── */}
      <div
        style={{
          position: 'absolute',
          left: ECO_CENTER.x,
          top: ECO_CENTER.y,
          transform: `translate(-50%,-50%) scale(${0.7 + markIn * 0.3})`,
          opacity: markIn * markVisible,
          color: C.brand500,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: -96,
            borderRadius: 999,
            background:
              'radial-gradient(50% 50% at 50% 50%, rgba(37,99,235,.46) 0%, rgba(37,99,235,.12) 42%, rgba(37,99,235,0) 72%)',
          }}
        />
        <Icon name="shield" size={ECO_MARK} strokeWidth={1.7} />
      </div>
    </div>
  )
}
