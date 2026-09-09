# TrustCraft — Launch Film

A 30-second cinematic product film for TrustCraft, built with Remotion.

**Output:** `out/trustcraft-launch-film.mp4` · 1920×1080 · 30 fps · 900 frames · H.264 + AAC

This project is fully isolated from the TrustCraft app. It has its own
`package.json` and `node_modules`, uses npm (the app uses pnpm), and touches
no application source, route, dependency or hosting config.

---

## Commands

```bash
cd trustcraft-film
npm install

npm run studio     # Remotion Studio — live preview and scrubbing
npm run render     # renders out/trustcraft-launch-film.mp4
npm run score      # regenerates both audio stems
npm run typecheck  # tsc --noEmit
```

Regenerate audio only when timings in `src/motion/timeline.ts` change — the
score is written against frame numbers, not bars.

---

## The story

One transformation: **chaos → clarity**, in eight acts.

| Act | Frames | Time | Beat |
|-----|--------|------|------|
| I — Problem | 0–100 | 0:00–3:3 | A leak in the dark. "Something breaks." → "Now what?" |
| II — Reveal | 100–165 | 3:3–5:5 | Faults collapse to a point; it opens into the capture card. "Just describe it." becomes the placeholder. |
| III — Multimodal | 165–375 | 5:5–12:5 | **TYPE. SAY. SHOW.** → "Understood." |
| IV — Discovery | 375–525 | 12:5–17:5 | Results in depth; the viewport reshapes desktop → phone. "Finding someone is easy." |
| V — Trust | 525–640 | 17:5–21:3 | "Trusting them isn't." answered by real trust signals. |
| VI — Action | 640–738 | 21:3–24:6 | Profile, Select, confirmed. |
| VII — Ecosystem | 738–798 | 24:6–26:6 | "Whatever the problem." Seven services converge on the mark. |
| VIII — Finale | 798–900 | 26:6–30:0 | **TrustCraft** — "Describe it. Find them. Trust the choice." |

All timing lives in `src/motion/timeline.ts`. There are no bare frame numbers
anywhere else in the codebase.

---

## Why it is not a slideshow

The film is built as **layers with overlapping lifetimes**, not a sequence of
scenes, and objects hand off to each other rather than cutting:

- The **fault fragments** of Act I are the things that collapse into the search
  card in Act II — same objects, one continuous move.
- The **headline** "Just describe it." physically shrinks into the card and
  becomes its placeholder text.
- The **search surface** is a single persistent object across Acts II and III;
  typing, voice and photo all transform it in place.
- One **provider card** travels through four coordinate systems — desktop
  result → phone list → hero close-up → confirmation — without ever being
  destroyed and recreated (`src/scenes/ProductJourney.tsx`).
- Act VI **collapses into the exact point** Act VII radiates outward from.
- The mark the categories converge on is the mark that draws itself in the
  finale.

A single camera (`src/components/Camera.tsx`) keyframes scale, position and
roll across all 900 frames, so the lens carries velocity through every act
boundary and is never at rest at a cut.

---

## Fidelity to the product

The film uses TrustCraft's real material, not lookalikes:

- **Colours** are lifted verbatim from the app's `@theme` block (`src/theme.ts`).
- **Icons** are the app's own 24×24 path set, copied path-for-path.
- **Data** is the app's fixtures — Kasun Perera, Trust Score 94, 4.9 from 126
  reviews, 412 works completed, 8 years, 2.4 km, LKR 1,500 inspection fee.
  No invented claims appear on screen.
- **Copy** is the product's: "Tell us your problem", "Recommended
  Professionals", "Based on your request…", "Browse all professionals instead",
  "Professional Selected", and the 500-character counter.
- **Positioning lines** are TrustCraft's own, found in the presentation deck:
  "Finding someone is easy. / Trusting them isn't." and the closing
  "Describe it. Find them. Trust the choice."

UI is rebuilt with inline styles rather than mounting the Tailwind app, so
Remotion renders it deterministically at 1920×1080 — but the geometry, radii,
weights and spacing match the product.

---

## Audio

Both stems are **synthesised from first principles** in `scripts/score.mjs` —
oscillators, filtered noise and ADSR envelopes rendered sample by sample to
WAV. Nothing is sampled and nothing is licensed, so the track is original and
safe to play publicly. It is deterministic: two runs produce identical files.

- `public/audio/trustcraft-score.wav` — 100 BPM, Am → F → C → G → **C**.
  Minor tension resolving to a major cadence on the brand: the film's story in
  one progression.
- `public/audio/trustcraft-sfx.wav` — 19 cues, each written against the frame
  its picture lands on (drips, the collapse, typing ticks, voice arming,
  the photo lock, "Understood.", the responsive reshape, trust, the CTA press,
  confirmation, and one resolve on the mark).

Mixed in `TrustCraftLaunchFilm.tsx` at 0.86 / 0.72 so the design sits inside
the music. Final mix: mean −15.2 dB, peak −2.7 dB — no clipping, comfortable
for room playback.

> **Note:** a local generative music model (MusicGen / Stable Audio) was not
> used. The machine has a GPU but no PyTorch, and the Blackwell card plus
> Python 3.14 makes that a multi-gigabyte install with a high failure rate.
> Hand-composed synthesis was the better call regardless: it locks to the
> beat map exactly, which a generated clip would not.

---

## Determinism

Every procedural element is seeded (`rng`/`seeded` in `src/motion/anim.ts`):
grain drift, waveform bars, fragment motion and typing cadence. There is no
`Math.random` and no network access at render time — Inter ships locally in
`public/fonts`. The same commit always renders the same film.

---

## Structure

```
src/
├── Root.tsx                  compositions
├── fonts.ts                  local Inter, delayRender-gated
├── theme.ts                  brand tokens from the product
├── film/TrustCraftLaunchFilm.tsx   layer graph + audio mix
├── motion/
│   ├── timeline.ts           FILM / BEAT / CUE — all timing
│   └── anim.ts               easing, keyframe tracks, springs, seeded RNG
├── product/                  the app's real icons, data and UI primitives
├── components/               camera, stage, type, surface, viewport, cursor…
└── scenes/                   the eight acts
```
