import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stage, PositionedPhone } from "../components/Stage";
import { CinematicCamera, Shot } from "../components/CinematicCamera";
import { ProfileTrustScreen, ResultsScreen } from "../components/screens";
import { Headline } from "../components/Headline";
import { phase } from "../motion/timing";
import { COLOR, FONT } from "../theme";
import { outQuint } from "../motion/easing";

/**
 * SCENE 5 — TRUST  (17.2s – 21.4s)
 * The chosen card comes forward and becomes the full profile. The Trust Score
 * and its evidence resolve into focus, one signal at a time. This is where the
 * film says: don't just find someone — find someone you can trust.
 */
export const TrustScene: React.FC = () => {
  const frame = useCurrentFrame();

  const morph = phase(frame, 0, 22); // results card 0 → profile
  const reveal = phase(frame, 20, 96);
  const showProfile = frame >= 14;

  const shots: Shot[] = [
    { frame: 0, x: 8, y: -10, scale: 1.16 },
    { frame: 22, x: 0, y: -8, scale: 1.05 },
    { frame: 60, x: 26, y: -128, scale: 1.3 }, // push toward the Trust Score
    { frame: 96, x: 26, y: -128, scale: 1.32 },
    { frame: 118, x: 0, y: 150, scale: 1.14 }, // drop to the Select button
    { frame: 126, x: 0, y: 150, scale: 1.15 },
  ];

  // a ring pulse around the Trust Score number
  const pulse = interpolate(frame, [46, 62, 82], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage fadeIn={4} fadeOut={0}>
      <CinematicCamera shots={shots} frame={frame}>
        <PositionedPhone glow={interpolate(reveal, [0, 1], [0.5, 0.72])}>
          <div style={{ position: "relative", width: 390, height: "100%" }}>
            {frame < 20 && (
              <div style={{ position: "absolute", inset: 0, opacity: interpolate(morph, [0, 1], [1, 0]) }}>
                <ResultsScreen frame={frame} reveal={1} focus={0} />
              </div>
            )}
            {showProfile && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: interpolate(morph, [0.4, 1], [0, 1], { extrapolateLeft: "clamp" }),
                  transform: `scale(${interpolate(morph, [0.4, 1], [1.06, 1], { extrapolateLeft: "clamp", easing: outQuint })})`,
                }}
              >
                <ProfileTrustScreen reveal={reveal} />
                {/* pulse ring over the Trust Score (top-right of the profile card) */}
                <div
                  style={{
                    position: "absolute",
                    right: 42,
                    top: 96,
                    width: 96,
                    height: 96,
                    borderRadius: 999,
                    border: `2px solid ${COLOR.brand500}`,
                    transform: `translate(50%, -50%) scale(${0.6 + pulse * 0.9})`,
                    opacity: pulse * 0.8,
                  }}
                />
              </div>
            )}
          </div>
        </PositionedPhone>
      </CinematicCamera>

      <div style={{ position: "absolute", left: 120, top: 360, width: 600 }}>
        <Headline text="Built for trust." startAt={16} size={82} weight={800} align="left" color={COLOR.white} />
        <div
          style={{
            marginTop: 18,
            opacity: interpolate(frame, [40, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <span style={{ fontFamily: FONT, fontSize: 21, color: COLOR.ink400, fontWeight: 500, lineHeight: 1.5 }}>
            Verified identity, certification and completed work — every score is evidence.
          </span>
        </div>
      </div>
    </Stage>
  );
};
