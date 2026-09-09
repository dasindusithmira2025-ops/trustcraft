import React from "react";
import { interpolate } from "remotion";
import { COLOR, FONT, PROS } from "../theme";
import { Avatar, BottomNav, Icon, ShieldMark, Stars, TrustPill, VerifiedBadge } from "./ui";
import { Waveform } from "./Waveform";
import { outQuint } from "../motion/easing";

const W = 390;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <p
    style={{
      fontFamily: FONT,
      fontSize: 11.5,
      fontWeight: 600,
      letterSpacing: 0.6,
      textTransform: "uppercase",
      color: COLOR.ink500,
      margin: 0,
      ...style,
    }}
  >
    {children}
  </p>
);

const AppBar: React.FC = () => (
  <div
    style={{
      height: 56,
      padding: "0 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: `1px solid ${COLOR.ink100}`,
      background: COLOR.white,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <ShieldMark size={20} color={COLOR.brand600} />
      <span
        style={{
          fontFamily: FONT,
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: -0.3,
          color: COLOR.brand700,
        }}
      >
        TrustCraft
      </span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ position: "relative", color: COLOR.ink700 }}>
        <Icon name="chat" size={20} color={COLOR.ink700} />
      </div>
      <Avatar initials="NF" hue={230} size={32} />
    </div>
  </div>
);

/* ─────────────────────────  1. Multimodal home / search  ───────────────────── */

export const HomeSearchScreen: React.FC<{
  frame: number;
  mode: "text" | "voice" | "photo";
  typed: string;
  caret: boolean;
  /** 0..1 reveal of the interpreted category. */
  interpretation: number;
  energy?: number;
}> = ({ frame, mode, typed, caret, interpretation, energy = 1 }) => {
  const inputActive = COLOR.brand500;
  return (
    <div style={{ width: W, background: COLOR.white, height: "100%", fontFamily: FONT, position: "relative" }}>
      <AppBar />
      <div style={{ padding: "18px 20px 96px" }}>
        <h1
          style={{
            fontFamily: FONT,
            fontSize: 20,
            fontWeight: 700,
            color: COLOR.ink900,
            margin: "0 0 18px",
          }}
        >
          Hi, Nadeesha 👋
        </h1>

        <p
          style={{
            fontFamily: FONT,
            fontSize: 15,
            fontWeight: 600,
            color: COLOR.ink900,
            margin: "0 0 8px",
          }}
        >
          Tell us your problem
        </p>

        <div
          style={{
            border: `1.5px solid ${inputActive}`,
            borderRadius: 16,
            background: COLOR.white,
            overflow: "hidden",
            boxShadow: `0 0 0 4px ${COLOR.brand600}18`,
          }}
        >
          <div style={{ padding: "14px 16px 0", minHeight: 92 }}>
            {mode === "photo" ? (
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: 12,
                    background: "linear-gradient(150deg, hsl(205 25% 62%), hsl(205 18% 38%))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="camera" size={22} color={"rgba(255,255,255,0.75)"} />
                </div>
                <div>
                  <p style={{ margin: "2px 0 0", fontSize: 14, color: COLOR.ink800, lineHeight: 1.5 }}>
                    Photo attached
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: 12.5, color: COLOR.ink500 }}>
                    Under the kitchen sink
                  </p>
                </div>
              </div>
            ) : mode === "voice" ? (
              <div style={{ paddingTop: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 999,
                      background: COLOR.brand50,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name="mic" size={15} color={COLOR.brand600} />
                  </div>
                  <Waveform frame={frame} width={230} height={30} energy={energy} />
                  <span style={{ fontSize: 11, color: COLOR.ink500, fontWeight: 500 }}>0:04</span>
                </div>
                <p style={{ margin: "12px 0 0", fontSize: 14, color: COLOR.ink800, lineHeight: 1.5 }}>
                  {typed}
                  {caret && <span style={{ color: COLOR.brand500 }}>|</span>}
                </p>
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 14, color: COLOR.ink800, lineHeight: 1.5 }}>
                {typed}
                {caret && (
                  <span style={{ color: COLOR.brand500, fontWeight: 300 }}>|</span>
                )}
              </p>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "4px 16px 6px",
            }}
          >
            <span style={{ fontSize: 11, color: COLOR.ink400 }}>
              {mode === "text" ? typed.length : 61}/500
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              borderTop: `1px solid ${COLOR.ink100}`,
            }}
          >
            {[
              { icon: "camera", label: "Photo", on: mode === "photo" },
              { icon: "camera", label: "Video", on: false },
              { icon: "mic", label: "Voice", on: mode === "voice" },
              { icon: "pin", label: "Location", on: false },
            ].map((it, i) => (
              <div
                key={it.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: "10px 0",
                  borderRight: i < 3 ? `1px solid ${COLOR.ink100}` : "none",
                  color: it.on ? COLOR.brand600 : COLOR.ink500,
                  background: it.on ? COLOR.brand50 : "transparent",
                }}
              >
                <Icon name={it.icon} size={18} color={it.on ? COLOR.brand600 : COLOR.ink500} />
                <span style={{ fontSize: 11, fontWeight: 500 }}>{it.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* location row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 12,
            fontSize: 13,
          }}
        >
          <Icon name="pin" size={15} color={COLOR.brand600} />
          <span style={{ color: COLOR.ink700, flex: 1 }}>Colombo 05</span>
          <span style={{ color: COLOR.brand600, fontWeight: 600 }}>Change</span>
        </div>

        {/* interpreted category — the intelligent read of the problem */}
        <div
          style={{
            marginTop: 14,
            opacity: interpretation,
            transform: `translateY(${interpolate(clamp01(interpretation), [0, 1], [10, 0])}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 14px",
              borderRadius: 14,
              background: COLOR.brand50,
              border: `1px solid ${COLOR.brand100}`,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: COLOR.brand600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="sparkle" size={17} color={COLOR.white} fill />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 11, color: COLOR.ink500, fontWeight: 600 }}>
                TRUSTCRAFT UNDERSTANDS
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 14.5, color: COLOR.ink900, fontWeight: 600 }}>
                Plumbing · Leak near sink connection
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: 14,
            height: 48,
            borderRadius: 14,
            background: COLOR.brand600,
            color: COLOR.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            fontWeight: 600,
            boxShadow: `0 8px 20px ${COLOR.brand600}40`,
          }}
        >
          Continue
        </div>

        {/* reassurance strip — fills the fold, states the promise */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 16,
          }}
        >
          {[
            { icon: "check", label: "Verified pros" },
            { icon: "wallet", label: "Upfront fees" },
            { icon: "pin", label: "Across Colombo" },
          ].map((it) => (
            <div
              key={it.label}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                padding: "12px 4px",
                borderRadius: 12,
                background: COLOR.ink50,
              }}
            >
              <Icon name={it.icon} size={16} color={COLOR.brand600} />
              <span style={{ fontSize: 11, fontWeight: 600, color: COLOR.ink600 }}>{it.label}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 16,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: COLOR.ink900 }}>Recent</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 8,
            padding: "10px 12px",
            borderRadius: 12,
            border: `1px solid ${COLOR.ink100}`,
          }}
        >
          <Avatar initials="RS" hue={24} size={34} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: COLOR.ink900 }}>
              Ruwan Silva · Electrical
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: COLOR.ink500 }}>
              Completed · 2 weeks ago
            </p>
          </div>
          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11.5, color: COLOR.ink600 }}>
            <Icon name="star" size={11} color={COLOR.gold500} fill stroke={1} />
            5.0
          </span>
        </div>
      </div>
      <BottomNav active="home" />
    </div>
  );
};

/* ─────────────────────────  2. AI understanding  ───────────────────── */

const ANALYSIS_STEPS = [
  "Understanding your problem",
  "Reading photo and voice note",
  "Identifying the service category",
  "Finding trusted professionals",
];

export const AnalysisScreen: React.FC<{ frame: number; progress: number }> = ({
  frame,
  progress,
}) => {
  const done = Math.floor(progress * (ANALYSIS_STEPS.length + 0.4));
  const spin = (frame * 8) % 360;
  return (
    <div
      style={{
        width: W,
        height: "100%",
        background: COLOR.white,
        fontFamily: FONT,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 40px",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: 21, fontWeight: 700, color: COLOR.ink900, lineHeight: 1.3, margin: 0 }}>
        Reading your request
      </h2>
      <p style={{ fontSize: 13, color: COLOR.ink500, margin: "8px 0 0" }}>This takes a moment.</p>

      <div
        style={{
          position: "relative",
          width: 108,
          height: 108,
          margin: "34px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 999,
            border: `4px solid ${COLOR.brand100}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 999,
            border: "4px solid transparent",
            borderTopColor: COLOR.brand600,
            transform: `rotate(${spin}deg)`,
          }}
        />
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 999,
            background: COLOR.brand50,
            color: COLOR.brand600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="sparkle" size={30} color={COLOR.brand600} fill />
        </div>
      </div>

      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 14, textAlign: "left" }}>
        {ANALYSIS_STEPS.map((s, i) => {
          const isDone = i < done;
          const isNow = i === done;
          return (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isDone ? COLOR.success600 : "transparent",
                  border: isDone
                    ? "none"
                    : `2px solid ${isNow ? COLOR.brand500 : COLOR.ink200}`,
                }}
              >
                {isDone ? (
                  <Icon name="check" size={11} color={COLOR.white} stroke={2.6} />
                ) : isNow ? (
                  <div style={{ width: 6, height: 6, borderRadius: 999, background: COLOR.brand500 }} />
                ) : null}
              </div>
              <span
                style={{
                  fontSize: 13.5,
                  color: isDone ? COLOR.ink800 : isNow ? COLOR.brand700 : COLOR.ink400,
                  fontWeight: isNow ? 600 : 400,
                }}
              >
                {s}
                {isNow ? "…" : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────  3. Recommended professionals  ───────────────────── */

export const ResultsScreen: React.FC<{
  frame: number;
  /** 0..1 — cards populate in sequence. */
  reveal: number;
  /** index of the card being highlighted (or -1). */
  focus?: number;
  headerLabel?: string;
}> = ({ reveal, focus = -1, headerLabel = "Plumbing · Colombo 05" }) => {
  return (
    <div style={{ width: W, height: "100%", background: COLOR.ink50, fontFamily: FONT }}>
      <div
        style={{
          height: 56,
          borderBottom: `1px solid ${COLOR.ink100}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: COLOR.white,
        }}
      >
        <Icon name="next" size={18} color={COLOR.ink700} />
        <span
          style={{
            position: "absolute",
            left: 44,
            fontSize: 16,
            fontWeight: 600,
            color: COLOR.ink900,
          }}
        >
          Recommended
        </span>
      </div>

      <div style={{ padding: "16px 18px 0" }}>
        <p style={{ margin: 0, fontSize: 12.5, color: COLOR.ink500, lineHeight: 1.5 }}>
          <span style={{ color: COLOR.brand700, fontWeight: 600 }}>{headerLabel}</span>
          {"  —  you choose who takes the job."}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
          {PROS.map((p, i) => {
            const local = clamp01((reveal - i * 0.22) / 0.5);
            const focused = focus === i;
            const dimmed = focus >= 0 && !focused;
            return (
              <div
                key={p.id}
                style={{
                  opacity: local * (dimmed ? 0.32 : 1),
                  transform: `translateY(${interpolate(local, [0, 1], [26, 0], {
                    easing: outQuint,
                  })}px) scale(${focused ? 1.03 : 1})`,
                  filter: dimmed ? "blur(1.5px)" : "none",
                  border: `1px solid ${focused ? COLOR.brand300 : i === 0 ? COLOR.brand200 : COLOR.ink200}`,
                  borderRadius: 16,
                  padding: 16,
                  background: COLOR.white,
                  boxShadow: focused
                    ? `0 22px 45px ${COLOR.brand900}22`
                    : "0 1px 2px rgba(15,23,42,0.04)",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <Avatar initials={p.initials} hue={p.hue} size={46} badge />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14.5, fontWeight: 600, color: COLOR.ink900 }}>
                        {p.name}
                      </span>
                      {i === 0 && (
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 600,
                            color: COLOR.success700,
                            background: COLOR.success100,
                            padding: "2px 7px",
                            borderRadius: 999,
                          }}
                        >
                          Recommended
                        </span>
                      )}
                    </div>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: COLOR.ink500 }}>{p.trade}</p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginTop: 6,
                        fontSize: 11.5,
                        color: COLOR.ink600,
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 3, color: COLOR.ink700 }}>
                        <Icon name="star" size={11} color={COLOR.gold500} fill stroke={1} />
                        {p.rating} ({p.reviews})
                      </span>
                      <span style={{ color: COLOR.ink400 }}>{p.distanceKm} km</span>
                      <TrustPill score={p.trust} size={10.5} />
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: COLOR.brand600, lineHeight: 1 }}>
                      {p.match}%
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 10, color: COLOR.ink400, fontWeight: 500 }}>
                      Match
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 999,
                    background: COLOR.ink100,
                    marginTop: 12,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${p.match * clamp01((reveal - i * 0.22) / 0.7)}%`,
                      borderRadius: 999,
                      background: COLOR.brand500,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 14,
            padding: "12px 0",
            textAlign: "center",
            fontSize: 12.5,
            color: COLOR.ink500,
            opacity: clamp01((reveal - 0.7) / 0.3),
          }}
        >
          + 12 more verified plumbers nearby
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────  4. Profile · Trust  ───────────────────── */

const P = PROS[0];

export const ProfileTrustScreen: React.FC<{
  /** 0..1 — trust signals resolve into focus. */
  reveal: number;
}> = ({ reveal }) => {
  const rows = [
    { icon: "clock", label: "Experience", value: `${P.years} years` },
    { icon: "check", label: "Works Completed", value: String(P.jobs) },
    { icon: "pin", label: "Location", value: `${P.distanceKm} km away` },
    { icon: "wallet", label: "Inspection Fee", value: `LKR ${P.inspectionFee.toLocaleString("en-US")}` },
    { icon: "calendar", label: "Availability", value: "Today · 8 AM – 8 PM" },
  ];
  return (
    <div style={{ width: W, height: "100%", background: COLOR.ink50, fontFamily: FONT }}>
      <div
        style={{
          height: 56,
          borderBottom: `1px solid ${COLOR.ink100}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: COLOR.white,
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 600, color: COLOR.ink900 }}>Professional Profile</span>
      </div>

      <div style={{ padding: "20px 20px 96px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <Avatar initials={P.initials} hue={P.hue} size={64} badge />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: COLOR.ink900 }}>{P.name}</span>
              <VerifiedBadge />
            </div>
            <p style={{ margin: "3px 0 0", fontSize: 13, color: COLOR.ink500 }}>{P.trade}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
              <Stars value={P.rating} size={13} />
              <span style={{ fontSize: 12, color: COLOR.ink500 }}>
                {P.rating} ({P.reviews} reviews)
              </span>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p style={{ margin: 0, fontSize: 11, color: COLOR.ink500, fontWeight: 500 }}>Trust Score</p>
            <p style={{ margin: "2px 0 0", fontSize: 28, fontWeight: 800, color: COLOR.brand700, lineHeight: 1 }}>
              {P.trust}
              <span style={{ fontSize: 13, color: COLOR.ink400, fontWeight: 500 }}>/100</span>
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            border: `1px solid ${COLOR.ink200}`,
            borderRadius: 16,
            overflow: "hidden",
            background: COLOR.white,
          }}
        >
          {rows.map((r, i) => {
            const local = clamp01((reveal - i * 0.14) / 0.4);
            return (
              <div
                key={r.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderTop: i > 0 ? `1px solid ${COLOR.ink100}` : "none",
                  opacity: 0.35 + local * 0.65,
                  background: local > 0.6 ? COLOR.brand50 : "transparent",
                  transition: "none",
                }}
              >
                <Icon name={r.icon} size={16} color={local > 0.6 ? COLOR.brand600 : COLOR.ink400} />
                <span style={{ flex: 1, fontSize: 13.5, color: COLOR.ink700 }}>{r.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: COLOR.ink900 }}>{r.value}</span>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 14px",
            borderRadius: 14,
            background: COLOR.brand50,
            border: `1px solid ${COLOR.brand100}`,
            opacity: clamp01((reveal - 0.7) / 0.3),
          }}
        >
          <ShieldMark size={18} color={COLOR.brand600} stroke={2} />
          <span style={{ fontSize: 12.5, color: COLOR.brand800, lineHeight: 1.5 }}>
            Verified NIC, trade certification and {P.jobs} completed plumbing jobs.
          </span>
        </div>

        {/* review preview — the human signal under the numbers */}
        <div style={{ opacity: clamp01((reveal - 0.8) / 0.2), marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: COLOR.ink900 }}>Reviews</span>
            <span style={{ fontSize: 12, color: COLOR.brand600, fontWeight: 600 }}>See all {P.reviews}</span>
          </div>
          <div
            style={{
              marginTop: 8,
              padding: "12px 14px",
              borderRadius: 14,
              border: `1px solid ${COLOR.ink200}`,
              background: COLOR.white,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Stars value={5} size={12} />
              <span style={{ fontSize: 12, color: COLOR.ink500 }}>Dilani · Colombo 07</span>
            </div>
            <p style={{ margin: "6px 0 0", fontSize: 12.5, color: COLOR.ink700, lineHeight: 1.5 }}>
              “Arrived on time, found the leak in minutes and fixed it cleanly. Fair price.”
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: 16,
          background: COLOR.white,
          borderTop: `1px solid ${COLOR.ink100}`,
          display: "flex",
          gap: 10,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 46,
            borderRadius: 12,
            border: `1px solid ${COLOR.brand200}`,
            color: COLOR.brand700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Message
        </div>
        <div
          style={{
            flex: 1,
            height: 46,
            borderRadius: 12,
            background: COLOR.brand600,
            color: COLOR.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Select
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────  5. Confirmation  ───────────────────── */

export const ConfirmationScreen: React.FC<{ reveal: number }> = ({ reveal }) => {
  const ring = clamp01(reveal / 0.4);
  return (
    <div style={{ width: W, height: "100%", background: COLOR.ink50, fontFamily: FONT }}>
      <div
        style={{
          height: 56,
          borderBottom: `1px solid ${COLOR.ink100}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: COLOR.white,
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 600, color: COLOR.ink900 }}>Request Confirmed</span>
      </div>

      <div style={{ padding: "34px 24px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: 999,
            background: COLOR.success100,
            color: COLOR.success600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${interpolate(ring, [0, 1], [0.4, 1], { easing: outQuint })})`,
          }}
        >
          <Icon name="check" size={32} color={COLOR.success600} stroke={2.6} />
        </div>
        <p style={{ margin: "16px 0 0", fontSize: 19, fontWeight: 700, color: COLOR.ink900 }}>
          Kasun is on the job
        </p>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: COLOR.ink500, textAlign: "center" }}>
          Your request, photo and voice note were shared.
        </p>

        <div
          style={{
            marginTop: 22,
            width: "100%",
            border: `1px solid ${COLOR.ink200}`,
            borderRadius: 16,
            padding: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: COLOR.white,
            opacity: clamp01((reveal - 0.35) / 0.4),
          }}
        >
          <Avatar initials={P.initials} hue={P.hue} size={46} badge />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: COLOR.ink900 }}>{P.name}</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: COLOR.ink500 }}>{P.trade}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center" }}>
              <TrustPill score={P.trust} size={10.5} />
              <span style={{ fontSize: 11.5, color: COLOR.ink500 }}>Arrives today</span>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            width: "100%",
            borderRadius: 14,
            background: COLOR.brand50,
            border: `1px solid ${COLOR.brand100}`,
            padding: "12px 14px",
            fontSize: 12.5,
            color: COLOR.brand800,
            lineHeight: 1.5,
            opacity: clamp01((reveal - 0.55) / 0.4),
          }}
        >
          Next: Kasun reviews the request and sends a transparent quotation before any work begins.
        </div>

        {/* what happens next — fills the flow, ends on payment protection */}
        <div style={{ width: "100%", marginTop: 20, opacity: clamp01((reveal - 0.7) / 0.3) }}>
          {[
            { icon: "check", label: "Request sent", sub: "Just now", done: true },
            { icon: "wallet", label: "Quotation", sub: "Within ~15 min", done: false },
            { icon: "calendar", label: "Visit scheduled", sub: "Today, 8 AM – 8 PM", done: false },
          ].map((s, i) => (
            <div key={s.label} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    background: s.done ? COLOR.brand600 : COLOR.ink100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name={s.icon} size={13} color={s.done ? COLOR.white : COLOR.ink400} stroke={2.4} />
                </div>
                {i < 2 && <div style={{ width: 2, height: 22, background: COLOR.ink100 }} />}
              </div>
              <div style={{ paddingBottom: 12 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: COLOR.ink900 }}>{s.label}</p>
                <p style={{ margin: "1px 0 0", fontSize: 11.5, color: COLOR.ink500 }}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            width: "100%",
            marginTop: 4,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 11.5,
            color: COLOR.ink500,
            opacity: clamp01((reveal - 0.8) / 0.2),
          }}
        >
          <ShieldMark size={14} color={COLOR.brand600} stroke={2} />
          Payment is held securely until the job is done.
        </div>
      </div>
    </div>
  );
};
