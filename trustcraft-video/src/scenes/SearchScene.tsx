import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stage, PHONE_STAGE, PositionedPhone } from "../components/Stage";
import { CinematicCamera, Shot } from "../components/CinematicCamera";
import { HomeSearchScreen } from "../components/screens";
import { Headline } from "../components/Headline";
import { Cursor } from "../components/Cursor";
import { phase } from "../motion/timing";
import { COLOR, FONT } from "../theme";
import { outQuint } from "../motion/easing";

/**
 * SCENE 3 — HERO SEARCH  (6.1s – 12.8s)
 * The product performs. One coherent problem — a kitchen-sink leak — described
 * three ways: typed, spoken, shown. Then TrustCraft reads it. The kinetic type
 * column on the left accumulates: Type it · Say it · Show it → understands.
 */

const TYPED_FULL = "There's water under my kitchen sink.";
const VOICE_TRANSCRIPT = "The tap keeps dripping even when it's shut.";

export const SearchScene: React.FC = () => {
  const frame = useCurrentFrame();

  // ── beat windows (local frames) ──
  const typeStart = 8;
  const typeEnd = 60;
  const voiceStart = 68;
  const voiceEnd = 116;
  const photoStart = 122;
  const photoEnd = 150;
  const understandStart = 150;

  const mode: "text" | "voice" | "photo" =
    frame >= photoStart ? "photo" : frame >= voiceStart ? "voice" : "text";

  // typing
  const typedChars = Math.round(
    interpolate(frame, [typeStart, typeEnd], [0, TYPED_FULL.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const voiceChars = Math.round(
    interpolate(frame, [voiceStart + 8, voiceEnd], [0, VOICE_TRANSCRIPT.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const typed =
    mode === "voice"
      ? VOICE_TRANSCRIPT.slice(0, voiceChars)
      : mode === "photo"
        ? TYPED_FULL
        : TYPED_FULL.slice(0, typedChars);

  const caret =
    (mode === "text" && frame < typeEnd + 6 && Math.floor(frame / 8) % 2 === 0) ||
    (mode === "voice" && frame < voiceEnd && Math.floor(frame / 8) % 2 === 0);

  const energy = interpolate(
    frame,
    [voiceStart, voiceStart + 10, voiceEnd - 8, voiceEnd],
    [0, 1, 1, 0.15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const interpretation = phase(frame, understandStart, understandStart + 20);

  // ── mode-morph sweep over the input ──
  const sweepAt = (t: number) =>
    interpolate(frame, [t - 2, t + 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: outQuint,
    });
  const sweep =
    frame >= photoStart - 2 && frame < photoStart + 12
      ? sweepAt(photoStart)
      : frame >= voiceStart - 2 && frame < voiceStart + 12
        ? sweepAt(voiceStart)
        : -1;

  // ── camera ──
  const shots: Shot[] = [
    { frame: 0, x: 0, y: 0, scale: 1, blur: 0 },
    { frame: 60, x: 0, y: 0, scale: 1.02 },
    { frame: understandStart, x: 30, y: -40, scale: 1.04 },
    { frame: understandStart + 34, x: 60, y: -150, scale: 1.24 }, // push toward the interpretation card
    { frame: 202, x: 70, y: -180, scale: 1.3 },
  ];

  // cursor: moves to the input field and clicks at the start of typing
  const cur = {
    x: interpolate(frame, [0, typeStart], [660, 980], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: outQuint }),
    y: interpolate(frame, [0, typeStart], [760, 470], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: outQuint }),
    press: interpolate(frame, [typeStart - 3, typeStart, typeStart + 6], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    opacity: interpolate(frame, [0, 6, typeEnd, typeEnd + 10], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  };

  // ── left kinetic-type column ──
  const items: { text: string; at: number; out: number }[] = [
    { text: "Type it.", at: 14, out: understandStart },
    { text: "Say it.", at: voiceStart + 4, out: understandStart },
    { text: "Show it.", at: photoStart + 2, out: understandStart },
  ];

  return (
    <Stage fadeIn={6} fadeOut={0}>
      <CinematicCamera shots={shots} frame={frame}>
        <PositionedPhone glow={0.55}>
          <div style={{ position: "relative", width: 390, height: "100%" }}>
            <HomeSearchScreen
              frame={frame}
              mode={mode}
              typed={typed}
              caret={caret}
              interpretation={interpretation}
              energy={energy}
            />
            {sweep >= 0 && sweep < 1 && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 150,
                  height: 150,
                  background: `linear-gradient(90deg, transparent, ${COLOR.brand400}66, transparent)`,
                  transform: `translateX(${interpolate(sweep, [0, 1], [-390, 390])}px)`,
                  mixBlendMode: "screen",
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
        </PositionedPhone>

        <Cursor x={cur.x} y={cur.y} pressed={cur.press} opacity={cur.opacity} />
      </CinematicCamera>

      {/* left kinetic type — lives in the dark, outside the camera push */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 300,
          width: 640,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {items.map((it, i) => {
          if (frame < it.at) return null;
          const dim = interpolate(frame, [it.out - 10, it.out], [1, 0.28], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div key={i} style={{ opacity: dim }}>
              <Headline text={it.text} startAt={it.at} size={58} weight={700} align="left" color={COLOR.white} stagger={2} />
            </div>
          );
        })}

        {frame >= understandStart && (
          <div style={{ marginTop: 26 }}>
            <Headline
              text="TrustCraft understands."
              startAt={understandStart + 4}
              size={78}
              weight={800}
              align="left"
              color={COLOR.white}
              lineHeight={1.02}
              maxWidth={620}
              stagger={3}
            />
            <div
              style={{
                marginTop: 18,
                opacity: interpolate(frame, [understandStart + 26, understandStart + 40], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <span style={{ fontFamily: FONT, fontSize: 22, color: COLOR.ink400, fontWeight: 500 }}>
                Type it. Say it. Show it.
              </span>
            </div>
          </div>
        )}
      </div>
    </Stage>
  );
};
