import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CINEMATIC_BG, COLOR } from "../theme";
import { Grain } from "./Grain";
import { inOut } from "../motion/easing";

/**
 * The film's persistent environment. One coherent world derived from the
 * TrustCraft brand: the product's own radial wash, a single soft brand light
 * that rises as the story turns from problem to solution, a faint precision
 * grid, a vignette, and a whisper of grain. It never competes with the UI.
 */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  // The light lifts and warms from ~frame 60 (problem) through the brand entrance.
  const lift = interpolate(frame, [40, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: inOut,
  });

  // Very slow parallax drift over the whole film.
  const driftX = Math.sin(frame / 220) * 40;
  const driftY = Math.cos(frame / 300) * 26;

  const glowY = interpolate(lift, [0, 1], [128, 44]);
  const glowOpacity = interpolate(lift, [0, 1], [0.12, 0.5]);
  const gridOpacity = interpolate(frame, [120, 200, 820, 880], [0, 0.05, 0.05, 0.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: CINEMATIC_BG }}>
      {/* Deep base tint that keeps blacks from going flat */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(80% 60% at 50% 120%, ${COLOR.brand900}22 0%, transparent 60%)`,
        }}
      />

      {/* The single brand light */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 50% at ${50 + driftX / 30}% ${glowY}%, ${
            COLOR.brand500
          }, transparent 62%)`,
          opacity: glowOpacity,
          filter: "blur(8px)",
          transform: `translate(${driftX}px, ${driftY}px)`,
        }}
      />

      {/* Faint precision grid — large cropped brand geometry, not decoration */}
      <AbsoluteFill
        style={{
          opacity: gridOpacity,
          backgroundImage: `linear-gradient(${COLOR.brand200} 1px, transparent 1px), linear-gradient(90deg, ${COLOR.brand200} 1px, transparent 1px)`,
          backgroundSize: "132px 132px",
          maskImage:
            "radial-gradient(70% 70% at 50% 46%, black 0%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(70% 70% at 50% 46%, black 0%, transparent 78%)",
          transform: `translate(${driftX / 2}px, ${driftY / 2}px)`,
        }}
      />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 120% at 50% 44%, transparent 46%, rgba(2,6,23,0.55) 100%)",
        }}
      />

      <Grain frame={frame} opacity={0.05} />
    </AbsoluteFill>
  );
};
