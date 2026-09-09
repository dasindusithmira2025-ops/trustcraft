import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Stage, PositionedPhone } from "../components/Stage";
import { CinematicCamera, Shot } from "../components/CinematicCamera";
import { ConfirmationScreen, ProfileTrustScreen } from "../components/screens";
import { Headline } from "../components/Headline";
import { Cursor } from "../components/Cursor";
import { phase } from "../motion/timing";
import { COLOR, FONT } from "../theme";
import { outQuint } from "../motion/easing";

/**
 * SCENE 6 — CONNECTION  (21.2s – 25.4s)
 * One deliberate tap. The profile becomes a confirmed request — the moment the
 * marketplace becomes useful. Problem → the right professional → action, with
 * no explanation needed.
 */
export const ActionScene: React.FC = () => {
  const frame = useCurrentFrame();

  const pressAt = 12;
  const swap = phase(frame, pressAt + 2, pressAt + 16);
  const confirmReveal = phase(frame, pressAt + 8, pressAt + 74);

  const shots: Shot[] = [
    { frame: 0, x: 0, y: 150, scale: 1.15 }, // on the Select button
    { frame: 16, x: 0, y: 90, scale: 1.12 },
    { frame: 30, x: 0, y: -6, scale: 1.03 }, // rise to see the confirmation
    { frame: 84, x: 0, y: -6, scale: 1.03 },
    { frame: 126, x: 0, y: 0, scale: 0.86 }, // begin pulling back toward the ecosystem
  ];

  const cur = {
    x: interpolate(frame, [0, pressAt], [1060, 1092], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: outQuint }),
    y: interpolate(frame, [0, pressAt], [880, 812], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: outQuint }),
    press: interpolate(frame, [pressAt - 3, pressAt, pressAt + 8], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    opacity: interpolate(frame, [0, 4, pressAt + 12, pressAt + 22], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  };

  return (
    <Stage fadeIn={4} fadeOut={0}>
      <CinematicCamera shots={shots} frame={frame}>
        <PositionedPhone glow={interpolate(confirmReveal, [0, 0.4], [0.72, 0.6])}>
          <div style={{ position: "relative", width: 390, height: "100%" }}>
            {frame < pressAt + 18 && (
              <div style={{ position: "absolute", inset: 0, opacity: interpolate(swap, [0, 1], [1, 0]) }}>
                <ProfileTrustScreen reveal={1} />
                {/* Select button glow before the press */}
                <div
                  style={{
                    position: "absolute",
                    left: 205,
                    right: 16,
                    bottom: 16,
                    height: 46,
                    borderRadius: 12,
                    boxShadow: `0 0 0 ${interpolate(frame, [0, pressAt], [0, 6])}px ${COLOR.brand500}55`,
                  }}
                />
              </div>
            )}
            {frame >= pressAt + 2 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: interpolate(swap, [0.3, 1], [0, 1], { extrapolateLeft: "clamp" }),
                  transform: `scale(${interpolate(swap, [0.3, 1], [1.05, 1], { extrapolateLeft: "clamp", easing: outQuint })})`,
                }}
              >
                <ConfirmationScreen reveal={confirmReveal} />
              </div>
            )}
          </div>
        </PositionedPhone>

        <Cursor x={cur.x} y={cur.y} pressed={cur.press} opacity={cur.opacity} />
      </CinematicCamera>

      <div style={{ position: "absolute", left: 120, top: 400, width: 560 }}>
        <Headline text="Connected." startAt={pressAt + 10} size={92} weight={800} align="left" color={COLOR.white} />
        <div
          style={{
            marginTop: 18,
            opacity: interpolate(frame, [pressAt + 34, pressAt + 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <span style={{ fontFamily: FONT, fontSize: 21, color: COLOR.ink400, fontWeight: 500 }}>
            Problem → the right professional → done.
          </span>
        </div>
      </div>
    </Stage>
  );
};
