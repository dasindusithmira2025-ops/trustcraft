import { Composition } from 'remotion'
import './fonts'
import { DURATION, FPS, H, W } from './motion/timeline'
import { TrustCraftLaunchFilm } from './film/TrustCraftLaunchFilm'

export const RemotionRoot = () => (
  <>
    <Composition
      id="TrustCraftLaunchFilm"
      component={TrustCraftLaunchFilm}
      durationInFrames={DURATION}
      fps={FPS}
      width={W}
      height={H}
    />
  </>
)
