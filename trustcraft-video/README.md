# TrustCraft Launch Film

A 30-second cinematic product film for TrustCraft, built with [Remotion](https://remotion.dev).
Standalone artifact — it imports nothing from the production app and cannot affect it.

## Deliverables at a glance

| | |
|---|---|
| **Project location** | `trustcraft/trustcraft-video/` |
| **Main composition** | `TrustCraftLaunchFilm` |
| **Preview command** | `npm run studio` (Remotion Studio at http://localhost:3000) |
| **Render command** | `npm run render` → `out/trustcraft-launch.mp4` |
| **Rendered file** | `out/trustcraft-launch.mp4` |
| **Duration** | 30.0 s (900 frames) |
| **Frame rate** | 30 fps |
| **Resolution** | 1920 × 1080 (16:9) |
| **Codec** | H.264 / yuv420p, CRF 17 (silent — canonical version is text-driven) |

## Commands

```bash
cd trustcraft/trustcraft-video
npm install          # first time only
npm run studio       # interactive preview / iteration
npm run render       # writes out/trustcraft-launch.mp4
npm run still -- --frame=890   # export the end frame as a still
npm run typecheck    # tsc --noEmit
```

## The cinematic sequence

One continuous piece — a persistent dark environment, a device that holds its mark
through the product act, and match transitions between beats (scene windows overlap
a few frames so the dissolves in `Stage` blend the seams). Central timeline in
`src/motion/timing.ts`; no scene hardcodes an absolute frame.

| Beat | Time | What happens |
|---|---|---|
| **Problem** | 0.0–3.2 s | Dark open. "Something breaks." Fragments of real service problems (leaking tap, dead socket, AC not cooling) drift in depth. |
| **Brand entrance** | 3.0–6.3 s | The fragments collapse toward centre; the TrustCraft mark and wordmark resolve. |
| **Hero search** | 6.1–12.8 s | The product performs. One problem — a kitchen-sink leak — described three ways: typed, spoken, shown. Kinetic type column: *Type it. Say it. Show it.* → **TrustCraft understands.** Camera pushes into the interpreted category card. |
| **Discovery** | 12.6–17.4 s | The read of the problem resolves into people. Three real professional cards populate with live match scores; the camera glides the list and locks on the strongest match. |
| **Trust** | 17.2–21.4 s | The chosen card becomes the full profile. Trust Score and its evidence (verified NIC, certification, completed jobs, reviews) resolve into focus one signal at a time. "Built for trust." |
| **Action** | 21.2–25.4 s | Request confirmed. "Kasun is on the job." Next steps — quotation, scheduled visit, payment held in escrow. |
| **Ecosystem** | 25.2–27.6 s | One wide beat. Every home-service category snaps into one connected system around the product. "One place. Every service." |
| **Finale** | 27.4–30.0 s | Everything resolves to the mark. **TrustCraft — Find better. Choose with confidence.** |

## Architecture

```
src/
  Root.tsx                     composition registration + font preload
  compositions/TrustCraftLaunchFilm.tsx
  scenes/                      one file per beat
  components/
    Stage.tsx, CinematicCamera.tsx   camera + scene framing
    Phone.tsx                  device shell (390×844, matches the app's Frame)
    screens.tsx, ui.tsx        video-specific rebuild of the real TrustCraft UI
    Headline.tsx               masked word-level type reveal
    Background.tsx, Grain.tsx, Waveform.tsx, Cursor.tsx, ...
  motion/timing.ts             the single source of truth for the timeline
  motion/springs.ts, easing.ts shared motion language
  theme.ts                     brand colours, type, professional fixtures
public/
  brand/                       TrustCraft marks and lockups
  fonts/                       Inter (SIL OFL 1.1) — bundled, no network at render
```

UI colours, typography, the bottom-nav tabs, professional fixtures and the device
geometry are taken from the real app (`trustcraft/src/components/UI.tsx`,
`trustcraft/src/store.tsx`). Screens are simplified for readability at 1080p — the
film communicates the product, it does not reproduce every pixel.

## Determinism / technical notes

- No network content at render time; fonts are bundled and preloaded via `calculateMetadata`.
- All motion is frame-driven (`interpolate` / spring helpers) — no `Date.now`, no unseeded randomness.
- `tsc --noEmit` is clean.
- Verified with `ffprobe`: 1920×1080, 30 fps, 900 frames, ~30.0 s, H.264 / yuv420p.

## Limitations

- **Silent.** The brief allows a text-driven canonical film; no royalty-free score or
  sound-design layer is bundled. The film is designed to read fully with sound off.
- Professional names, ratings, match scores and fees are the app's demo fixtures,
  shown as visually representative — no real statistical claims are made.
- Renders with the ANGLE GL renderer (`remotion.config.ts`); on a headless machine
  without a GPU, add `--gl=swiftshader` to the render command.
