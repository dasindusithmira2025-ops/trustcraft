import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Background } from "../components/Background";
import { TIMING, dur } from "../motion/timing";
import { ProblemScene } from "../scenes/ProblemScene";
import { BrandEntranceScene } from "../scenes/BrandEntranceScene";
import { SearchScene } from "../scenes/SearchScene";
import { DiscoveryScene } from "../scenes/DiscoveryScene";
import { TrustScene } from "../scenes/TrustScene";
import { ActionScene } from "../scenes/ActionScene";
import { EcosystemScene } from "../scenes/EcosystemScene";
import { FinaleScene } from "../scenes/FinaleScene";
import { FONT } from "../theme";

/**
 * TrustCraftLaunchFilm — 1920×1080 · 30 fps · 900 frames · 30 seconds.
 *
 * One continuous piece: a persistent environment, a device that stays on its
 * mark through the product act, and match transitions between scenes. Scene
 * windows overlap by a few frames (see motion/timing.ts) so the dissolves in
 * `Stage` blend the seams.
 */
export const TrustCraftLaunchFilm: React.FC = () => {
  const S = [
    { win: TIMING.problem, C: ProblemScene, name: "problem" },
    { win: TIMING.brand, C: BrandEntranceScene, name: "brand" },
    { win: TIMING.search, C: SearchScene, name: "search" },
    { win: TIMING.discovery, C: DiscoveryScene, name: "discovery" },
    { win: TIMING.trust, C: TrustScene, name: "trust" },
    { win: TIMING.action, C: ActionScene, name: "action" },
    { win: TIMING.ecosystem, C: EcosystemScene, name: "ecosystem" },
    { win: TIMING.finale, C: FinaleScene, name: "finale" },
  ] as const;

  return (
    <AbsoluteFill style={{ backgroundColor: "#060A12", fontFamily: FONT }}>
      <Background />
      {S.map(({ win, C, name }) => (
        <Sequence key={name} from={win[0]} durationInFrames={dur(win)} name={name} layout="none">
          <C />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
