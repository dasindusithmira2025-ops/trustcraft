import React from "react";

/** A macOS-style pointer for demonstrating real interaction. */
export const Cursor: React.FC<{
  x: number;
  y: number;
  pressed?: number;
  opacity?: number;
  scale?: number;
}> = ({ x, y, pressed = 0, opacity = 1, scale = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-2px, -2px) scale(${scale * (1 - pressed * 0.16)})`,
      opacity,
      pointerEvents: "none",
      zIndex: 80,
      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.35))",
    }}
  >
    {pressed > 0.02 && (
      <div
        style={{
          position: "absolute",
          left: -14,
          top: -14,
          width: 44,
          height: 44,
          borderRadius: 999,
          border: "2px solid rgba(37,99,235,0.9)",
          transform: `scale(${0.5 + pressed * 0.9})`,
          opacity: 1 - pressed,
        }}
      />
    )}
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 3l14 8-6 1.6L10 20 5 3z"
        fill="#fff"
        stroke="#0F172A"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);
