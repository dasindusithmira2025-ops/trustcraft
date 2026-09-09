import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLOR, FONT } from "../theme";
import { outQuint } from "../motion/easing";
import { crisp } from "../motion/springs";

/**
 * Masked, word-level headline reveal. Each word rises out of a fixed-height
 * clip with a short stagger and a micro letter-spacing settle. No typewriter,
 * no plain opacity fade. Fixed clip heights keep every word on one baseline.
 */
export const Headline: React.FC<{
  text: string;
  startAt: number;
  exitAt?: number;
  size?: number;
  weight?: number;
  color?: string;
  align?: "center" | "left";
  lineHeight?: number;
  stagger?: number;
  maxWidth?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  startAt,
  exitAt,
  size = 84,
  weight = 700,
  color = COLOR.white,
  align = "center",
  lineHeight = 1.08,
  stagger = 3.5,
  maxWidth,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  // clip box: tall enough for caps + descenders; visual rhythm kept tight
  // with negative margins so lines don't feel loose.
  const box = size * 1.32;
  const pad = (box - size * lineHeight) / 2;

  const exiting =
    exitAt !== undefined
      ? interpolate(frame, [exitAt, exitAt + 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: outQuint,
        })
      : 0;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: size * 0.26,
        rowGap: 0,
        justifyContent: align === "center" ? "center" : "flex-start",
        maxWidth,
        fontFamily: FONT,
        transform: `translateY(${-exiting * 30}px)`,
        opacity: 1 - exiting,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const local = frame - startAt - i * stagger;
        const p = crisp({ frame: Math.max(0, local), fps, durationInFrames: 28 });
        const y = interpolate(p, [0, 1], [118, 0]);
        const tracking = interpolate(p, [0, 1], [size * 0.05, -size * 0.012]);
        return (
          <span
            key={`${w}-${i}`}
            style={{
              display: "block",
              overflow: "hidden",
              height: box,
              marginTop: -pad,
              marginBottom: -pad,
              verticalAlign: "top",
            }}
          >
            <span
              style={{
                display: "block",
                paddingTop: pad,
                transform: `translateY(${y}%)`,
                fontSize: size,
                fontWeight: weight,
                lineHeight,
                letterSpacing: tracking,
                color,
                whiteSpace: "pre",
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};
