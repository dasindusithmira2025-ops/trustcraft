import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stage, PositionedPhone } from "../components/Stage";
import { CinematicCamera, Shot } from "../components/CinematicCamera";
import { AnalysisScreen, ResultsScreen } from "../components/screens";
import { Headline } from "../components/Headline";
import { phase } from "../motion/timing";
import { COLOR } from "../theme";

/**
 * SCENE 4 — DISCOVERY  (12.6s – 17.4s)
 * The read of the problem resolves into people. A brief processing beat, then
 * three real professional cards populate with live match scores. The camera
 * glides the list and locks onto the strongest match while the rest recede.
 */
export const DiscoveryScene: React.FC = () => {
  const frame = useCurrentFrame();

  const analysisEnd = 30;
  const showResults = frame >= analysisEnd - 4;
  const reveal = phase(frame, analysisEnd, analysisEnd + 66);
  const focusIn = phase(frame, 104, 128);

  const shots: Shot[] = [
    { frame: 0, x: 60, y: -120, scale: 1.22 }, // continues SearchScene's push
    { frame: 24, x: 20, y: -30, scale: 1.06 },
    { frame: 70, x: 0, y: 70, scale: 1.05 }, // glide down the list
    { frame: 108, x: 8, y: -38, scale: 1.2 }, // rise back and lock on card 0
    { frame: 144, x: 8, y: -42, scale: 1.22 },
  ];

  return (
    <Stage fadeIn={5} fadeOut={0}>
      <CinematicCamera shots={shots} frame={frame}>
        <PositionedPhone glow={0.5}>
          {showResults ? (
            <ResultsScreen frame={frame} reveal={reveal} focus={focusIn > 0.5 ? 0 : -1} />
          ) : (
            <AnalysisScreen frame={frame} progress={interpolate(frame, [0, analysisEnd], [0.55, 1])} />
          )}
        </PositionedPhone>
      </CinematicCamera>

      <div style={{ position: "absolute", left: 120, top: 340, width: 620 }}>
        <Headline
          text="Matched in seconds."
          startAt={12}
          size={72}
          weight={800}
          align="left"
          color={COLOR.white}
          lineHeight={1.03}
        />
        <div
          style={{
            marginTop: 16,
            opacity: interpolate(frame, [30, 44], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }) * interpolate(frame, [96, 110], [1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <span style={{ fontFamily: "Inter", fontSize: 21, color: COLOR.ink400, fontWeight: 500 }}>
            Verified professionals, ranked by fit — not ads.
          </span>
        </div>
      </div>
    </Stage>
  );
};
