import React from "react";
import { AbsoluteFill, interpolate, random } from "remotion";
import { COLOR, FONT } from "../theme";
import { Icon } from "./ui";
import { outExpo, outQuint } from "../motion/easing";

/**
 * The "something breaks" fragments: cropped, tilted problem tiles at different
 * depths. They enter with clip-reveals, drift with parallax, and — when
 * `converge` climbs to 1 — rush toward the centre and collapse. This is the
 * physical bridge from the Problem scene into the Brand entrance.
 */

type Frag = {
  icon: string;
  label: string;
  x: number;
  y: number;
  rot: number;
  depth: number; // 0 (far) .. 1 (near)
  accent: string;
};

const FRAGS: Frag[] = [
  { icon: "drop", label: "Leaking tap", x: -430, y: -150, rot: -8, depth: 0.9, accent: COLOR.brand500 },
  { icon: "bolt", label: "Dead socket", x: 420, y: -190, rot: 7, depth: 0.75, accent: COLOR.warning600 },
  { icon: "wind", label: "AC not cooling", x: 470, y: 150, rot: -6, depth: 0.55, accent: COLOR.brand400 },
  { icon: "drop", label: "Water under sink", x: -450, y: 180, rot: 10, depth: 0.7, accent: COLOR.brand500 },
  { icon: "bolt", label: "Flickering light", x: -150, y: -300, rot: -4, depth: 0.4, accent: COLOR.warning600 },
  { icon: "wind", label: "Blocked drain", x: 160, y: 300, rot: 5, depth: 0.35, accent: COLOR.brand400 },
];

export const FragmentField: React.FC<{
  frame: number;
  /** 0..1 — entrance progress */
  enter: number;
  /** 0..1 — converge + collapse toward centre */
  converge: number;
  cx?: number;
  cy?: number;
}> = ({ frame, enter, converge, cx = 960, cy = 500 }) => {
  return (
    <AbsoluteFill>
      {FRAGS.map((f, i) => {
        const appear = interpolate(enter, [i * 0.08, i * 0.08 + 0.4], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: outExpo,
        });
        const driftX = Math.sin(frame / (40 + i * 7) + i) * (10 + f.depth * 14);
        const driftY = Math.cos(frame / (52 + i * 5) + i) * (8 + f.depth * 12);

        // convergence: position lerps to centre, scale collapses, blur rises
        const c = interpolate(converge, [0, 1], [0, 1], { easing: outQuint });
        const px = cx + interpolate(c, [0, 1], [f.x + driftX, 0]);
        const py = cy + interpolate(c, [0, 1], [f.y + driftY, 0]);
        const scale =
          (0.7 + f.depth * 0.5) *
          interpolate(appear, [0, 1], [0.85, 1]) *
          interpolate(c, [0, 0.7, 1], [1, 1.05, 0.05]);
        const blurNear = interpolate(f.depth, [0, 1], [4.5, 0]);
        const blur = blurNear + c * 6;
        const opacity =
          appear * interpolate(c, [0, 0.75, 1], [1, 0.9, 0]) * (0.5 + f.depth * 0.5);

        const w = 232;
        const h = 88;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: w,
              height: h,
              transform: `translate(-50%, -50%) rotate(${f.rot * (1 - c)}deg) scale(${scale})`,
              opacity,
              filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
            }}
          >
            {/* clip-reveal mask on entrance */}
            <div
              style={{
                width: "100%",
                height: "100%",
                clipPath: `inset(0 ${(1 - appear) * 100}% 0 0)`,
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 16,
                  background: "rgba(15,23,42,0.82)",
                  border: `1px solid ${f.accent}55`,
                  boxShadow: `0 18px 44px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.04)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "0 18px",
                  backdropFilter: "blur(2px)",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: `${f.accent}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name={f.icon} size={20} color={f.accent} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: FONT,
                      fontSize: 15,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.92)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {f.label}
                  </p>
                  <p
                    style={{
                      margin: "3px 0 0",
                      fontFamily: FONT,
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: 0.5,
                      color: f.accent,
                    }}
                  >
                    NEEDS A PRO
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
