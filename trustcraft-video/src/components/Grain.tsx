import { useMemo } from "react";
import { AbsoluteFill, random } from "remotion";

/**
 * Barely-visible film grain. Deterministic: the pattern is seeded, and it
 * animates by shifting a pre-baked tile so there is no per-frame randomness
 * during render.
 */
export const Grain: React.FC<{ frame: number; opacity?: number }> = ({
  frame,
  opacity = 0.04,
}) => {
  const tile = useMemo(() => {
    const size = 120;
    const dots: string[] = [];
    for (let i = 0; i < 900; i++) {
      const x = random(`gx-${i}`) * size;
      const y = random(`gy-${i}`) * size;
      const o = 0.15 + random(`go-${i}`) * 0.5;
      const r = 0.4 + random(`gr-${i}`) * 0.7;
      dots.push(
        `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(
          2,
        )}" fill="rgb(255,255,255)" fill-opacity="${o.toFixed(2)}"/>`,
      );
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">${dots.join(
      "",
    )}</svg>`;
    return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
  }, []);

  // Slow 4-step shuffle so grain feels alive without flickering.
  const step = Math.floor(frame / 2) % 4;
  const shift = [
    [0, 0],
    [37, 19],
    [-23, 41],
    [11, -29],
  ][step];

  return (
    <AbsoluteFill
      style={{
        backgroundImage: tile,
        backgroundRepeat: "repeat",
        backgroundPosition: `${shift[0]}px ${shift[1]}px`,
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};
