import type { ReactNode } from 'react'
import { EASE, track } from '../motion/anim'
import { CUE } from '../motion/timeline'

/**
 * The film's virtual camera — ONE continuous move across all 900 frames.
 *
 * Every scene renders into the same 1920x1080 world and this layer transforms
 * that world. Because the tracks are keyframed end-to-end, the lens is never
 * at rest at a scene boundary: it carries velocity through every cut, which is
 * what stops the film reading as a slideshow.
 *
 * Scale never drops below ~0.98 so the world always over-fills the frame.
 */
export const useCamera = (frame: number) => {
  const scale = track(frame, [
    [0, 1.035],
    [CUE.collapse, 1.105],       // I: slow push into the dark
    [CUE.surfaceOpen, 1.02],     // II: settle as the surface opens
    [CUE.typeStart, 1.005],
    [CUE.categoryLock, 1.055],   // III: lean in on the first understanding
    [CUE.voiceOn, 1.03],
    [CUE.voiceLock, 1.06],
    [CUE.photoDrop, 1.02],
    [CUE.photoLock, 1.085],      // closest point of the hero act
    [CUE.understood, 0.995],     // release
    [CUE.resultsOpen, 1.02],
    [CUE.responsive, 1.10],      // IV: push in, the frame reshapes
    [CUE.heroFound, 1.045],
    [CUE.trustIn, 1.085],        // V: hold close on the person
    [CUE.trustLine, 1.02],
    [CUE.profileOpen, 1.05],     // VI
    [CUE.ctaPress, 1.10],
    [CUE.confirmed, 1.0],
    [CUE.pullback, 0.99],        // VII: content recedes, lens stays wide
    [CUE.markIn, 1.015],
    [900, 1.045],                // VIII: imperceptible residual drift
  ], EASE.inOut)

  const x = track(frame, [
    [0, 26], [CUE.collapse, -14], [CUE.surfaceOpen, 0],
    [CUE.typeStart, 8], [CUE.categoryLock, -10],
    [CUE.voiceLock, 12], [CUE.photoLock, -16], [CUE.understood, 0],
    [CUE.resultsOpen, 14], [CUE.responsive, -8], [CUE.heroFound, 0],
    [CUE.trustIn, -12], [CUE.trustLine, 0],
    [CUE.profileOpen, 10], [CUE.confirmed, 0],
    [CUE.pullback, 0], [900, -8],
  ], EASE.inOut)

  const y = track(frame, [
    [0, 18], [CUE.collapse, -10], [CUE.surfaceOpen, 0],
    [CUE.categoryLock, 6], [CUE.photoLock, -8], [CUE.understood, 0],
    [CUE.responsive, 10], [CUE.heroFound, -6], [CUE.trustIn, 4],
    [CUE.confirmed, 0], [CUE.pullback, 0], [900, 6],
  ], EASE.inOut)

  /** Barely-there roll. Enough to feel handheld-stabilised, never enough to notice. */
  const rot = track(frame, [
    [0, 0.35], [CUE.surfaceOpen, 0], [CUE.photoLock, -0.28],
    [CUE.understood, 0], [CUE.responsive, 0.22], [CUE.trustIn, -0.16],
    [CUE.confirmed, 0], [900, 0],
  ], EASE.inOut)

  return { scale, x, y, rot }
}

export function Camera({ frame, children }: { frame: number; children: ReactNode }) {
  const { scale, x, y, rot } = useCamera(frame)
  return (
    <div style={{
      position: 'absolute', inset: 0,
      transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rot}deg)`,
      transformOrigin: '50% 50%',
      willChange: 'transform',
    }}>{children}</div>
  )
}
