import React from "react";
import { Composition } from "remotion";
import { TrustCraftLaunchFilm } from "./compositions/TrustCraftLaunchFilm";
import { DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH } from "./motion/timing";
import { ensureFonts } from "./fonts";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TrustCraftLaunchFilm"
      component={TrustCraftLaunchFilm}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      calculateMetadata={async () => {
        await ensureFonts();
        return {};
      }}
    />
  );
};
