import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage, PHONE_STAGE } from "../components/Stage";
import { Headline } from "../components/Headline";
import { FragmentField } from "../components/FragmentField";
import { ShieldMark } from "../components/ui";
import { Phone } from "../components/Phone";
import { HomeSearchScreen } from "../components/screens";
import { phase } from "../motion/timing";
import { COLOR } from "../theme";
import { heavy, pop } from "../motion/springs";

/**
 * SCENE 2 — TRUSTCRAFT ARRIVES  (3.0s – 6.3s)
 * The fragments collapse into a point of light; the TrustCraft mark forms out
 * of it and the wordmark resolves. One line lands — "Just describe the
 * problem." — and the lockup lifts away as the product itself rises into frame.
 */
export const BrandEntranceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const collapse = phase(frame, 0, 12);
  const flash = interpolate(frame, [8, 14, 26], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const markIn = pop({ frame, fps, delay: 12, durationInFrames: 30 });

  // lockup lifts and dissolves as the phone takes over
  const handoff = phase(frame, 66, 96);
  const lockupY = interpolate(handoff, [0, 1], [0, -120]);
  const lockupScale = interpolate(handoff, [0, 1], [1, 1.08]);
  const lockupOpacity = interpolate(handoff, [0, 0.7], [1, 0], { extrapolateLeft: "clamp" });

  // phone rises from the point of light
  const phoneGrow = heavy({ frame, fps, delay: 58, durationInFrames: 42 });
  const phoneScale = interpolate(phoneGrow, [0, 1], [0.16, PHONE_STAGE.scale]);
  const phoneY = interpolate(phoneGrow, [0, 1], [80, 0]);
  const phoneOpacity = interpolate(frame, [58, 74], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage fadeIn={1} fadeOut={1}>
      {frame < 20 && (
        <FragmentField
          frame={frame}
          enter={1}
          converge={interpolate(collapse, [0, 1], [0.86, 1])}
          cx={960}
          cy={460}
        />
      )}

      <AbsoluteFill
        style={{
          background: `radial-gradient(30% 26% at 50% 42%, ${COLOR.white}, ${COLOR.brand400} 40%, transparent 72%)`,
          opacity: flash,
          mixBlendMode: "screen",
        }}
      />

      {/* the product rising into frame */}
      <div
        style={{
          position: "absolute",
          left: PHONE_STAGE.cx,
          top: PHONE_STAGE.cy + phoneY,
          transform: "translate(-50%, -50%)",
          opacity: phoneOpacity,
        }}
      >
        <Phone scale={phoneScale} glow={interpolate(phoneGrow, [0, 1], [1.1, 0.55])}>
          <HomeSearchScreen frame={frame} mode="text" typed="" caret={false} interpretation={0} />
        </Phone>
      </div>

      {/* lockup */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
          transform: `translateY(${lockupY}px) scale(${lockupScale})`,
          opacity: lockupOpacity,
        }}
      >
        <div
          style={{
            transform: `scale(${interpolate(markIn, [0, 1], [0.4, 1])})`,
            filter: `drop-shadow(0 16px 46px ${COLOR.brand600}77)`,
          }}
        >
          <div
            style={{
              width: 132,
              height: 132,
              borderRadius: 38,
              background: COLOR.brand600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShieldMark size={78} color={COLOR.white} stroke={1.7} />
          </div>
        </div>

        <Headline text="TrustCraft" startAt={26} size={104} weight={800} color={COLOR.white} />
        <Headline
          text="Just describe the problem."
          startAt={40}
          size={38}
          weight={500}
          color={COLOR.ink300}
          stagger={2.2}
        />
      </AbsoluteFill>
    </Stage>
  );
};
