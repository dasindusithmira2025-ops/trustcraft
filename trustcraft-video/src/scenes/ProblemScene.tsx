import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stage } from "../components/Stage";
import { Headline } from "../components/Headline";
import { FragmentField } from "../components/FragmentField";
import { phase } from "../motion/timing";
import { COLOR } from "../theme";
import { inOut } from "../motion/easing";

/**
 * SCENE 1 — THE PROBLEM  (0:00 – 3.2s)
 * A controlled dark open. Two lines land. Real service problems drift in the
 * depth around them, building tension. The scene ends with the fragments
 * beginning to pull toward centre — the bridge into the brand entrance.
 */
export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();

  const enter = phase(frame, 6, 46);
  const converge = phase(frame, 82, 96); // hands off to BrandEntranceScene

  // slow push in
  const push = interpolate(frame, [0, 96], [1, 1.06], { easing: inOut });
  const line1Out = 40;

  return (
    <Stage fadeIn={10} fadeOut={0}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        {/* faint first spark before anything else */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(9px 9px at 50% 44%, ${COLOR.brand300}, transparent 70%)`,
            opacity: interpolate(frame, [0, 12, 34], [0, 0.9, 0], { extrapolateRight: "clamp" }),
          }}
        />

        <FragmentField frame={frame} enter={enter} converge={converge} cx={960} cy={512} />

        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {frame < line1Out + 16 && (
            <Headline
              text="Something breaks."
              startAt={10}
              exitAt={line1Out}
              size={96}
              weight={700}
              color={COLOR.white}
            />
          )}
          {frame >= line1Out && (
            <Headline
              text="Who do you call?"
              startAt={line1Out + 4}
              size={100}
              weight={700}
              color={COLOR.white}
              style={{
                opacity: interpolate(converge, [0, 1], [1, 0]),
                filter: `blur(${converge * 10}px)`,
              }}
            />
          )}
        </AbsoluteFill>
      </AbsoluteFill>
    </Stage>
  );
};
