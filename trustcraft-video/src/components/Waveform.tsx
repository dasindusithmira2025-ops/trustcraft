import React from "react";
import { random } from "remotion";
import { COLOR } from "../theme";

/**
 * Voice-input waveform. Deterministic per-bar motion (seeded sine), reacting to
 * an `energy` amplitude the scene animates. No per-frame randomness.
 */
export const Waveform: React.FC<{
  frame: number;
  bars?: number;
  energy?: number;
  width: number;
  height: number;
  color?: string;
}> = ({ frame, bars = 34, energy = 1, width, height, color = COLOR.brand500 }) => {
  const gap = 3;
  const barW = (width - gap * (bars - 1)) / bars;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap,
        width,
        height,
      }}
    >
      {Array.from({ length: bars }).map((_, i) => {
        const seed = random(`wave-${i}`);
        const speed = 0.18 + seed * 0.22;
        const centreBias = 1 - Math.abs(i - bars / 2) / (bars / 2); // taller in the middle
        const wobble = (Math.sin(frame * speed + seed * 8) + 1) / 2;
        const h =
          height *
          (0.12 + wobble * (0.28 + centreBias * 0.55) * Math.max(0.05, energy));
        return (
          <div
            key={i}
            style={{
              width: barW,
              height: h,
              borderRadius: barW,
              background: color,
              opacity: 0.55 + centreBias * 0.45,
            }}
          />
        );
      })}
    </div>
  );
};
