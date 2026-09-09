import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage } from "../components/Stage";
import { PositionedPhone } from "../components/Stage";
import { ConfirmationScreen } from "../components/screens";
import { Headline } from "../components/Headline";
import { Icon } from "../components/ui";
import { COLOR, FONT } from "../theme";
import { crisp } from "../motion/springs";
import { phase } from "../motion/timing";

/**
 * SCENE 7 — ECOSYSTEM  (25.2s – 27.6s)
 * One wide beat. Every home-service category snaps into one organised system
 * around the product — connected, not a grid of cards.
 */

const CATS: { label: string; icon: string }[] = [
  { label: "Plumbing", icon: "drop" },
  { label: "Electrical", icon: "bolt" },
  { label: "AC Repair", icon: "wind" },
  { label: "Cleaning", icon: "sparkle" },
  { label: "Painting", icon: "brush" },
  { label: "Carpentry", icon: "hammer" },
  { label: "Appliance", icon: "plug" },
];

export const EcosystemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cx = 960;
  const cy = 545;
  const converge = phase(frame, 50, 72);

  const phoneTarget =
    interpolate(frame, [0, 20], [0.82, 0.54], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    (1 - converge * 0.55);

  return (
    <Stage fadeIn={5} fadeOut={0}>
      <AbsoluteFill>
        {/* connecting lines */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {CATS.map((_, i) => {
            const t = crisp({ frame, fps, delay: 4 + i * 2.5, durationInFrames: 26 });
            const ang = (-Math.PI * 0.82) + (i / (CATS.length - 1)) * Math.PI * 1.64;
            const R = 372 * (1 - converge);
            const ex = cx + Math.cos(ang) * R * t;
            const ey = cy + Math.sin(ang) * R * 0.62 * t;
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={ex}
                y2={ey}
                stroke={COLOR.brand500}
                strokeWidth={1.5}
                strokeOpacity={0.28 * t * (1 - converge)}
              />
            );
          })}
        </svg>

        <PositionedPhone dx={-70} dScale={phoneTarget - 1.12} dy={-3} glow={0.6}>
          <ConfirmationScreen reveal={1} />
        </PositionedPhone>

        {CATS.map((c, i) => {
          const t = crisp({ frame, fps, delay: 4 + i * 2.5, durationInFrames: 26 });
          const ang = (-Math.PI * 0.82) + (i / (CATS.length - 1)) * Math.PI * 1.64;
          const R = 372 * (1 - converge);
          const x = cx + Math.cos(ang) * R * t;
          const y = cy + Math.sin(ang) * R * 0.62 * t;
          return (
            <div
              key={c.label}
              style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `translate(-50%, -50%) scale(${t * (1 - converge * 0.7)})`,
                opacity: t * (1 - converge),
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 16px 10px 12px",
                borderRadius: 999,
                background: "rgba(15,23,42,0.9)",
                border: `1px solid ${COLOR.brand500}44`,
                boxShadow: "0 14px 34px rgba(0,0,0,0.45)",
                whiteSpace: "nowrap",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  background: `${COLOR.brand500}22`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name={c.icon} size={16} color={COLOR.brand300} />
              </div>
              <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.92)" }}>
                {c.label}
              </span>
            </div>
          );
        })}

        <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: 74 }}>
          <div style={{ opacity: interpolate(converge, [0, 1], [1, 0]), textAlign: "center" }}>
            <Headline text="One place. Every service." startAt={10} size={58} weight={800} color={COLOR.white} align="center" />
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </Stage>
  );
};
