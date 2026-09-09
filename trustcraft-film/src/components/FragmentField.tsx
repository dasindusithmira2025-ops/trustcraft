import { EASE, ramp, seeded } from '../motion/anim'
import { CUE } from '../motion/timeline'
import { C } from '../theme'
import { Icon } from '../product/icons'

/**
 * The uncertainty. Real household faults — a wrench, a fault warning, an AC
 * unit, a socket — drifting at different depths in the dark.
 *
 * This layer deliberately spans the Act I → Act II boundary: the same objects
 * that establish the problem are the objects that collapse into the search
 * surface. Nothing fades out and gets replaced; it transforms.
 */
const R = seeded(9137, 64)

const FRAGMENTS = [
  { icon: 'wrench', x: 300, y: 300, size: 130, z: 0.15 },
  { icon: 'warn', x: 1540, y: 372, size: 104, z: 0.42 },
  { icon: 'flip', x: 1360, y: 764, size: 122, z: 0.28 },
  { icon: 'sparkle', x: 486, y: 812, size: 92, z: 0.55 },
  { icon: 'card', x: 1104, y: 224, size: 84, z: 0.62 },
  { icon: 'wallet', x: 214, y: 596, size: 76, z: 0.70 },
  { icon: 'clock', x: 1690, y: 596, size: 70, z: 0.76 },
]

/** Where everything collapses to — the point the search surface opens from. */
const FOCUS = { x: 960, y: 372 }

export function FragmentField({ frame }: { frame: number }) {
  // Fragments exist quietly, then are pulled in hard at the collapse.
  const gather = ramp(frame, CUE.collapse - 8, 34, EASE.in)
  const appear = ramp(frame, 8, 46, EASE.out)

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {FRAGMENTS.map((f, i) => {
        const r1 = R[i * 3]
        const r2 = R[i * 3 + 1]
        const r3 = R[i * 3 + 2]

        // Idle drift — slow, parallaxed by depth, never synchronised.
        const t = frame * 0.011 * (0.5 + r1 * 0.7)
        const driftX = Math.sin(t + r2 * 6.28) * (26 - f.z * 16)
        const driftY = Math.cos(t * 0.82 + r3 * 6.28) * (20 - f.z * 12)

        // Collapse: pulled toward the focus, shrinking, accelerating away.
        const gx = (FOCUS.x - f.x) * gather
        const gy = (FOCUS.y - f.y) * gather
        const gScale = 1 - gather * 0.86
        const gFade = 1 - ramp(frame, CUE.collapse + 6, 24, EASE.in)

        const near = 1 - f.z
        return (
          <div key={f.icon} style={{
            position: 'absolute',
            left: f.x, top: f.y,
            transform: `translate(${driftX + gx}px, ${driftY + gy}px) scale(${(0.9 + near * 0.2) * gScale}) rotate(${(r1 - 0.5) * 16 + gather * (r2 - 0.5) * 90}deg)`,
            opacity: appear * gFade * (0.06 + near * 0.20),
            color: r3 > 0.62 ? C.brand500 : C.ink300,
            filter: `blur(${f.z * 3.4}px)`,
            willChange: 'transform, opacity',
          }}>
            <Icon name={f.icon} size={f.size} strokeWidth={1.1} />
          </div>
        )
      })}
    </div>
  )
}
