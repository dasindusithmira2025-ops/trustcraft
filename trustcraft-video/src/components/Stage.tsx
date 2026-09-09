import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { WIDTH, HEIGHT } from "../motion/timing";
import { outQuint } from "../motion/easing";
import { Phone as PhoneImpl } from "./Phone";

/**
 * A 1920×1080 scene stage with a short, subtle dissolve at each end so the
 * overlapping scene windows in the timeline read as one continuous film.
 * The dissolves are deliberately small — most scene changes are match cuts.
 */
export const Stage: React.FC<{
  children: React.ReactNode;
  fadeIn?: number;
  fadeOut?: number;
  style?: React.CSSProperties;
}> = ({ children, fadeIn = 6, fadeOut = 8, style }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fi = Math.max(1, fadeIn);
  const fo = Math.max(1, fadeOut);
  const opacity =
    interpolate(frame, [0, fi], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: outQuint,
    }) *
    interpolate(frame, [durationInFrames - fo, durationInFrames], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return (
    <AbsoluteFill style={{ opacity, ...style }}>
      <AbsoluteFill style={{ width: WIDTH, height: HEIGHT }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Shared on-screen placement for the phone across the product scenes (3–6). */
export const PHONE_STAGE = {
  /** centre of the device on the 1920×1080 canvas */
  cx: 1030,
  cy: 548,
  scale: 1.12,
} as const;

/** The device, pinned to its shared stage position, with an optional camera-ish nudge. */
export const PositionedPhone: React.FC<{
  children: React.ReactNode;
  dx?: number;
  dy?: number;
  dScale?: number;
  glow?: number;
  dark?: boolean;
  screenBg?: string;
}> = ({ children, dx = 0, dy = 0, dScale = 0, glow = 0.5, dark, screenBg }) => (
  <div
    style={{
      position: "absolute",
      left: PHONE_STAGE.cx + dx,
      top: PHONE_STAGE.cy + dy,
      transform: "translate(-50%, -50%)",
    }}
  >
    <PhoneImpl scale={PHONE_STAGE.scale + dScale} glow={glow} dark={dark} screenBg={screenBg}>
      {children}
    </PhoneImpl>
  </div>
);
