import { EASE, ramp } from '../motion/anim'
import { BEAT, CUE } from '../motion/timeline'
import { AppBar } from '../product/ui'
import { SURFACE } from './SearchSurface'

/**
 * TrustCraft, by name — introduced only after the product has already shown
 * what it does, and then held for the whole hero act so the brand is present
 * while the feature earns it. It leaves with the surface, not before.
 */
export function BrandBar({ frame }: { frame: number }) {
  const inP = ramp(frame, CUE.brandIn, 20, EASE.out)
  const out = ramp(frame, BEAT.understood.start, 16, EASE.in)
  return (
    <div
      style={{
        position: 'absolute',
        left: SURFACE.x,
        top: 176,
        opacity: inP * (1 - out),
        transform: `translateY(${(1 - inP) * 16 - out * 22}px)`,
      }}
    >
      <AppBar scale={1.45} />
    </div>
  )
}
