import type { ReactNode } from 'react'
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from 'remotion'
import { DURATION, FILM } from '../motion/timeline'
import { STAGE_BG } from '../theme'
import { Camera } from '../components/Camera'
import { Stage } from '../components/Stage'
import { FragmentField } from '../components/FragmentField'
import { SearchSurface, CategoryResolve } from '../components/SearchSurface'
import { BrandBar } from '../components/BrandBar'
import { ProblemScene } from '../scenes/ProblemScene'
import { RevealScene, placeholderHandoff } from '../scenes/RevealScene'
import { MultimodalScene } from '../scenes/MultimodalScene'
import { ProductJourney } from '../scenes/ProductJourney'
import { EcosystemScene } from '../scenes/EcosystemScene'
import { FinaleScene } from '../scenes/FinaleScene'

/**
 * TrustCraft — the launch film.
 *
 * Layers, not slides. Every layer declares the window it is alive for, and
 * those windows deliberately overlap: the fragment field outlives the problem,
 * the search surface outlives the reveal, the product journey carries one card
 * through three acts. Objects hand off to each other rather than cutting.
 *
 * Everything sits inside a single camera that never stops moving.
 */

/** Alive only inside its window (with lead-in and tail for hand-offs). */
function Layer({ frame, from, to, children }: {
  frame: number; from: number; to: number; children: ReactNode
}) {
  if (frame < from || frame > to) return null
  return <>{children}</>
}

export function TrustCraftLaunchFilm() {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill style={{ background: STAGE_BG }}>
      {/* The environment reacts to the story but is never inside the camera's
          transform — the world moves, the light does not swim with it. */}
      <Stage frame={frame} />

      <Camera frame={frame}>
        {/* I — the problem, and the faults that will collapse into the product */}
        <Layer frame={frame} from={0} to={FILM.reveal.start + 40}>
          <FragmentField frame={frame} />
        </Layer>
        <Layer frame={frame} from={0} to={FILM.reveal.start + 24}>
          <ProblemScene frame={frame} />
        </Layer>

        {/* II + III — the surface itself, one object across two acts */}
        <Layer frame={frame} from={FILM.reveal.start} to={FILM.multimodal.end + 4}>
          <SearchSurface frame={frame} showPlaceholder={placeholderHandoff(frame)} />
          <CategoryResolve frame={frame} />
          <BrandBar frame={frame} />
        </Layer>

        {/* II — the promise travelling down into the field it becomes. Drawn
            after the surface so it lands on the card rather than behind it. */}
        <Layer frame={frame} from={FILM.problem.end - 6} to={FILM.multimodal.start + 20}>
          <RevealScene frame={frame} />
        </Layer>

        {/* III — type, say, show, understood */}
        <Layer frame={frame} from={FILM.multimodal.start - 30} to={FILM.discovery.start + 6}>
          <MultimodalScene frame={frame} />
        </Layer>

        {/* IV, V, VI — discovery, trust and action, sharing one card */}
        <Layer frame={frame} from={FILM.discovery.start - 8} to={FILM.ecosystem.start + 20}>
          <ProductJourney frame={frame} />
        </Layer>

        {/* VII — the platform */}
        <Layer frame={frame} from={FILM.ecosystem.start - 6} to={FILM.finale.start + 30}>
          <EcosystemScene frame={frame} />
        </Layer>

        {/* VIII — the mark */}
        <Layer frame={frame} from={FILM.finale.start - 14} to={DURATION}>
          <FinaleScene frame={frame} />
        </Layer>
      </Camera>

      {/* Two stems, mixed here rather than baked, so the design can sit
          inside the music instead of on top of it. */}
      <Audio src={staticFile('audio/trustcraft-score.wav')} volume={0.86} />
      <Audio src={staticFile('audio/trustcraft-sfx.wav')} volume={0.72} />
    </AbsoluteFill>
  )
}
