import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { inOut, outExpo } from "../motion/easing";

export type Shot = {
  frame: number;
  /** Pan in px, applied to a 1920×1080 stage. Positive x moves the world left. */
  x?: number;
  y?: number;
  /** 1 = neutral. >1 pushes in. */
  scale?: number;
  /** Z-rotation in deg — keep tiny. */
  rotate?: number;
  /** Y-rotation in deg for a shallow perspective turn — keep ≤ 8. */
  rotateY?: number;
  /** Gaussian blur in px for rack-focus. */
  blur?: number;
};

const channel = (
  shots: Shot[],
  frame: number,
  key: keyof Omit<Shot, "frame">,
  fallback: number,
): number => {
  const pts = shots.filter((s) => s[key] !== undefined);
  if (pts.length === 0) return fallback;
  if (pts.length === 1) return pts[0][key] as number;
  const frames = pts.map((s) => s.frame);
  const values = pts.map((s) => s[key] as number);
  // Ease-out for the first leg (a move arriving), ease-in-out afterwards.
  return interpolate(frame, frames, values, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: pts.length === 2 ? outExpo : inOut,
  });
};

/**
 * A reusable cinematic camera. It never rotates hard enough to make the UI
 * unreadable — rotateY is capped low and perspective is generous. Children are
 * a full 1920×1080 stage; the camera frames a region of it.
 */
export const CinematicCamera: React.FC<{
  shots: Shot[];
  frame: number;
  children: React.ReactNode;
}> = ({ shots, frame, children }) => {
  const x = channel(shots, frame, "x", 0);
  const y = channel(shots, frame, "y", 0);
  const scale = channel(shots, frame, "scale", 1);
  const rotate = channel(shots, frame, "rotate", 0);
  const rotateY = Math.max(-8, Math.min(8, channel(shots, frame, "rotateY", 0)));
  const blur = channel(shots, frame, "blur", 0);

  return (
    <AbsoluteFill style={{ perspective: 2400, perspectiveOrigin: "50% 45%" }}>
      <AbsoluteFill
        style={{
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotateY(${rotateY}deg) rotate(${rotate}deg)`,
          transformStyle: "preserve-3d",
          filter: blur > 0.01 ? `blur(${blur}px)` : undefined,
          willChange: "transform",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
