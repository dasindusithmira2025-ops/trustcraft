import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage } from "../components/Stage";
import { Headline } from "../components/Headline";
import { COLOR } from "../theme";
import { crisp, pop } from "../motion/springs";
import { phase } from "../motion/timing";

/**
 * SCENE 8 — BRAND REVEAL  (27.4s – 30.0s)
 * Everything resolves into the TrustCraft mark. The shield draws itself, locks,
 * the wordmark rises, the line settles, one light passes across it. The final
 * frame is a clean brand composition that could stand on its own.
 */
export const FinaleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const land = phase(frame, 0, 10); // incoming particles collapse
  const flash = interpolate(frame, [6, 11, 22], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const draw = interpolate(frame, [8, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fill = interpolate(frame, [28, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const markPop = pop({ frame, fps, delay: 8, durationInFrames: 26 });
  const sweep = interpolate(frame, [40, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const markSize = 190;

  return (
    <Stage fadeIn={0} fadeOut={4}>
      {/* incoming particles from the ecosystem converge */}
      {frame < 16 &&
        Array.from({ length: 14 }).map((_, i) => {
          const ang = (i / 14) * Math.PI * 2;
          const r = interpolate(land, [0, 1], [430, 0]);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 960 + Math.cos(ang) * r,
                top: 500 + Math.sin(ang) * r * 0.7,
                width: 6,
                height: 6,
                borderRadius: 999,
                background: COLOR.brand400,
                opacity: 1 - land,
                transform: "translate(-50%,-50%)",
              }}
            />
          );
        })}

      <AbsoluteFill
        style={{
          background: `radial-gradient(26% 24% at 50% 46%, ${COLOR.white}, ${COLOR.brand400} 45%, transparent 74%)`,
          opacity: flash,
          mixBlendMode: "screen",
        }}
      />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}
      >
        {/* the mark */}
        <div
          style={{
            transform: `scale(${interpolate(markPop, [0, 1], [0.6, 1])})`,
            filter: `drop-shadow(0 20px 60px ${COLOR.brand600}66)`,
            position: "relative",
          }}
        >
          <div
            style={{
              width: markSize + 66,
              height: markSize + 66,
              borderRadius: (markSize + 66) * 0.28,
              background: `${COLOR.brand600}`,
              opacity: interpolate(fill, [0, 1], [0.12, 1]),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={markSize} height={markSize} viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3l7 3v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6l7-3z"
                stroke={COLOR.white}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - draw}
                fill={COLOR.white}
                fillOpacity={interpolate(fill, [0, 1], [0, 0.001])}
              />
              <path
                d="M8.8 12l2.2 2.2 4.2-4.4"
                stroke={COLOR.white}
                strokeWidth={1.7}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - interpolate(frame, [20, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
              />
            </svg>
          </div>
          {/* light sweep */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: (markSize + 66) * 0.28,
              overflow: "hidden",
              opacity: sweep > 0 && sweep < 1 ? 1 : 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -20,
                bottom: -20,
                width: 90,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
                transform: `translateX(${interpolate(sweep, [0, 1], [-140, markSize + 160])}px) rotate(12deg)`,
              }}
            />
          </div>
        </div>

        <Headline text="TrustCraft" startAt={16} size={128} weight={800} color={COLOR.white} />

        <div
          style={{
            opacity: interpolate(frame, [30, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <Headline
            text="Find better. Choose with confidence."
            startAt={30}
            size={34}
            weight={500}
            color={COLOR.ink300}
            stagger={2}
          />
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
