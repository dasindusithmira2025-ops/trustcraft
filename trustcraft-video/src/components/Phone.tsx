import React from "react";
import { DEVICE, COLOR } from "../theme";
import { StatusBar } from "./ui";

/**
 * The TrustCraft device shell — identical geometry to the app's real `Frame`
 * component (390×844, 44px radius, pill notch, deep drop shadow). Rendered at
 * native size; scenes scale it with a transform so the camera can move over it
 * and the UI stays crisp.
 */
export const Phone: React.FC<{
  children: React.ReactNode;
  scale?: number;
  dark?: boolean;
  screenBg?: string;
  /** Soft brand light behind the device. */
  glow?: number;
  style?: React.CSSProperties;
  /** Clip radius for the inner screen. */
  contentTop?: number;
}> = ({
  children,
  scale = 1,
  dark = false,
  screenBg = COLOR.white,
  glow = 0.5,
  style,
  contentTop = 44,
}) => {
  return (
    <div
      style={{
        position: "relative",
        width: DEVICE.width,
        height: DEVICE.height,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        ...style,
      }}
    >
      {glow > 0 && (
        <div
          style={{
            position: "absolute",
            inset: -260,
            background: `radial-gradient(46% 40% at 50% 46%, ${COLOR.brand500}, transparent 70%)`,
            opacity: glow * 0.55,
            filter: "blur(50px)",
            pointerEvents: "none",
          }}
        />
      )}
      <div
        style={{
          position: "relative",
          width: DEVICE.width,
          height: DEVICE.height,
          borderRadius: DEVICE.radius,
          background: screenBg,
          overflow: "hidden",
          boxShadow:
            "0 40px 90px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* top chrome fill */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 44,
            background: dark ? COLOR.ink950 : screenBg,
            zIndex: 30,
          }}
        />
        {/* notch */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 34,
            borderRadius: 20,
            background: "#000",
            zIndex: 50,
          }}
        />
        <StatusBar dark={dark} />

        <div
          style={{
            position: "absolute",
            top: contentTop,
            left: 0,
            right: 0,
            bottom: 0,
            background: screenBg,
            overflow: "hidden",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
