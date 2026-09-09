import React from "react";
import { COLOR, FONT, avatarGradient } from "../theme";

/** The TrustCraft mark — the exact shield path from the app's icon set. */
export const ShieldMark: React.FC<{ size?: number; color?: string; stroke?: number }> = ({
  size = 24,
  color = COLOR.white,
  stroke = 1.7,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3l7 3v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6l7-3zM8.8 12l2.2 2.2 4.2-4.4"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ICONS: Record<string, string> = {
  search: "M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4-4",
  mic: "M12 3a2.5 2.5 0 012.5 2.5v6a2.5 2.5 0 01-5 0v-6A2.5 2.5 0 0112 3zM6 11a6 6 0 0012 0M12 17v4",
  camera:
    "M4 8h3l1.5-2h7L17 8h3v11H4V8zM12 16.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z",
  check: "M5 12.5l4.5 4.5L19 7",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z",
  star: "M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5z",
  pin: "M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  clock: "M12 4a8 8 0 100 16 8 8 0 000-16zM12 7.5V12l3 2",
  wallet: "M4 7h13a3 3 0 013 3v7H4V7zM4 7l11-3v3M17 13.5h.01",
  calendar: "M4 6h16v14H4V6zM8 3v5M16 3v5M4 11h16",
  chat: "M4 5h16v11H9l-5 4V5z",
  next: "M9 5l7 7-7 7",
  back: "M15 5l-7 7 7 7",
  home: "M4 10.5L12 4l8 6.5V20h-5v-5H9v5H4v-9.5z",
  cases: "M4 8h16v11H4V8zM9 8V6a2 2 0 012-2h2a2 2 0 012 2v2",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-3.5 3.6-6 8-6s8 2.5 8 6",
  bolt: "M13 3L4 14h6l-1 7 9-11h-6l1-7z",
  drop: "M12 3s6 7 6 11a6 6 0 01-12 0c0-4 6-11 6-11z",
  wind: "M3 8h11a3 3 0 100-6M3 14h15a3 3 0 110 6M3 11h9",
  brush: "M4 20h4L19 9l-4-4L4 16v4zM14.5 5.5l4 4",
  hammer: "M14 7l3-3 3 3-3 3M13 8l-9 9 3 3 9-9M11 6l4 4",
  plug: "M9 3v6M15 3v6M6 9h12v3a6 6 0 01-12 0V9zM12 18v3",
};

export const Icon: React.FC<{
  name: keyof typeof ICONS | string;
  size?: number;
  color?: string;
  fill?: boolean;
  stroke?: number;
}> = ({ name, size = 20, color = "currentColor", fill = false, stroke = 1.7 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill ? color : "none"}
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={ICONS[name] ?? ICONS.search} />
  </svg>
);

export const Avatar: React.FC<{
  initials: string;
  hue: number;
  size?: number;
  badge?: boolean;
}> = ({ initials, hue, size = 44, badge }) => (
  <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: COLOR.white,
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: size * 0.36,
        background: avatarGradient(hue),
      }}
    >
      {initials}
    </div>
    {badge && (
      <div
        style={{
          position: "absolute",
          bottom: -size * 0.02,
          right: -size * 0.02,
          width: size * 0.38,
          height: size * 0.38,
          borderRadius: 999,
          background: COLOR.brand600,
          border: `${Math.max(2, size * 0.045)}px solid ${COLOR.white}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name="check" size={size * 0.2} color={COLOR.white} stroke={2.4} />
      </div>
    )}
  </div>
);

export const VerifiedBadge: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4 * scale,
      background: COLOR.success100,
      color: COLOR.success700,
      fontFamily: FONT,
      fontWeight: 600,
      fontSize: 11 * scale,
      padding: `${2 * scale}px ${8 * scale}px`,
      borderRadius: 999,
      whiteSpace: "nowrap",
    }}
  >
    Verified
  </span>
);

export const Stars: React.FC<{ value: number; size?: number }> = ({ value, size = 14 }) => (
  <div style={{ display: "flex", gap: size * 0.08 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Icon
        key={i}
        name="star"
        size={size}
        fill={i <= Math.round(value)}
        color={i <= Math.round(value) ? COLOR.gold500 : COLOR.ink300}
        stroke={1.4}
      />
    ))}
  </div>
);

export const TrustPill: React.FC<{ score: number; size?: number }> = ({ score, size = 11 }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.4,
      background: COLOR.brand50,
      color: COLOR.brand700,
      fontFamily: FONT,
      fontWeight: 600,
      fontSize: size,
      padding: `${size * 0.18}px ${size * 0.55}px`,
      borderRadius: 6,
    }}
  >
    <ShieldMark size={size} color={COLOR.brand700} stroke={2} /> {score}
  </span>
);

/** The app's bottom navigation, matching trustcraft/src/components/UI.tsx TABS. */
export const BottomNav: React.FC<{ active: string }> = ({ active }) => {
  const tabs = [
    { id: "home", label: "Home", icon: "home" },
    { id: "find-pros", label: "Find Pros", icon: "search" },
    { id: "cases", label: "Cases", icon: "cases" },
    { id: "messages", label: "Messages", icon: "chat" },
    { id: "profile", label: "Profile", icon: "user" },
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 78,
        background: COLOR.white,
        borderTop: `1px solid ${COLOR.ink200}`,
        display: "flex",
        alignItems: "flex-start",
        paddingTop: 9,
      }}
    >
      {tabs.map((t) => {
        const on = active === t.id;
        return (
          <div
            key={t.id}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              color: on ? COLOR.brand600 : COLOR.ink400,
            }}
          >
            <Icon name={t.icon} size={21} color={on ? COLOR.brand600 : COLOR.ink400} fill={on && t.icon === "home"} />
            <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600 }}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
};

/** iOS-style status bar, matching the app's own StatusBar component. */
export const StatusBar: React.FC<{ dark?: boolean }> = ({ dark = false }) => {
  const c = dark ? COLOR.white : COLOR.ink900;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 44,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        padding: "0 24px 4px",
        zIndex: 40,
      }}
    >
      <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: c }}>9:41</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill={c}>
          <rect x="0" y="7" width="3" height="4" rx="0.7" />
          <rect x="4.5" y="5" width="3" height="6" rx="0.7" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.7" />
          <rect x="13.5" y="0" width="3" height="11" rx="0.7" />
        </svg>
        <svg width="15" height="11" viewBox="0 0 16 12" fill={c} opacity={0.9}>
          <path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0-3c1.83 0 3.48.76 4.67 1.97l1.42-1.42A8.47 8.47 0 008 4.5c-2.37 0-4.52.98-6.09 2.55l1.42 1.42A6.5 6.5 0 018 6.5zm0-3c2.76 0 5.24 1.1 7.02 2.91l1.42-1.42A10.45 10.45 0 008 1.5c-2.92 0-5.55 1.2-7.44 3.14l1.42 1.37A8.48 8.48 0 018 3.5z" />
        </svg>
        <svg width="24" height="11" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke={c} strokeOpacity="0.5" />
          <rect x="2" y="2" width="17" height="8" rx="2" fill={c} />
          <path d="M23 4V8c.83-.5 1.5-1.2 1.5-2S23.83 4.5 23 4z" fill={c} fillOpacity="0.5" />
        </svg>
      </div>
    </div>
  );
};
