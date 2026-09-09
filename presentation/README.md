# TrustCraft — DHACK Grand Final presentation

Everything for the 10-minute presentation, the 5-minute prototype demo and the
5-minute Q&A. **This directory is presentation tooling only.** It does not run
in, ship with, or affect the TrustCraft application — it has its own
`package.json` so no dependency here touches the app's.

The one thing it *does* read is the application itself: every product image in
the deck is a real screen captured from the running React app, and every colour
and type token is lifted from `src/index.css`.

---

## ⚠ Before the final: set the team name

The repository contains no team name, so the deck currently ships a flagged
placeholder on slides 1, 2 and 22.

```bash
TEAM_NAME="Your Team Name" node presentation/generate.mjs
TEAM_NAME="Your Team Name" node presentation/generate.mjs --static
```

`validate.mjs` fails loudly while the placeholder is still present, so you
cannot ship it by accident.

---

## Deliverables

### Slides 17–18: interactive redesign

Open `output/TrustCraft_DHACK_Interactive.pptx` for the updated 22-slide deck.
The original Grand Final file was locked during this edit, so the redesign is
saved separately. Slide 17 now uses a savings chart and a large revenue flow;
slide 18 uses a connected four-engine network and a compact evidence map.
Each has three native click-to-reveal builds. Pricing assumptions and supporting
detail remain in the slide footnotes and speaker notes.

- `output/TrustCraft_DHACK_Interactive_Static.pptx`: matching static backup.
- `output/interactive-preview/index.html`: self-contained browser companion for
  slides 17 and 18, with reveal, replay, previous, and show-all controls.
- `output/interactive-preview/slide-17.png` and `slide-18.png`: browser-rendered
  previews. These are not PowerPoint exports; the original PDF is unchanged.

Rebuild from this directory:

```bash
node generate.mjs --out TrustCraft_DHACK_Interactive.pptx
node generate.mjs --static --out TrustCraft_DHACK_Interactive_Static.pptx
node capture/business-preview.mjs
```

The layouts live in `business-slides.mjs`; `business-motion.mjs` writes native
PresentationML animations during generation. The text audit passes and browser
controls were exercised. Native playback could not be checked: the local
PowerPoint session rejected both opening files and creating a blank deck with
HRESULT `0x80048240`. The existing team-name placeholders on slides 1, 2, and 22
still need the real team name.

| File | What it is |
|---|---|
| `output/TrustCraft_DHACK_Grand_Final.pptx` | **The deck.** 22 slides, 12 chapters, Morph + Fade transitions, 3 looping GIF clips of the real app, speaker notes on every slide |
| `output/TrustCraft_DHACK_Static_Backup.pptx` | Same deck, no animated media, fade-only transitions. Opens anywhere |
| `output/TrustCraft_DHACK_Grand_Final.pdf` | PDF export, produced by PowerPoint itself |
| `previews/slide-01..22.png` | What PowerPoint actually renders, one PNG per slide |
| `TrustCraft_DHACK_Speaker_Script.md` | Word-for-word script, 9:32, with click and cut cues |
| `TrustCraft_5_Minute_Demo_Script.md` | The prototype run, 4:35, one scenario |
| `TrustCraft_Judge_QA.md` | 30+ hard questions, answers tagged BUILT / DESIGNED / PLANNED / UNKNOWN |
| `TrustCraft_Presentation_Sources.md` | Every external number, with its source |
| `Presentation_Design_System.md` | Canvas, colour, type, imagery, motion and citation rules |
| `Presentation_QA_Report.md` | What was checked, what was found, what was fixed |

---

## Rebuilding

The dev server must be running for the capture steps (`pnpm dev` in the repo
root, or `npx vite --port 5199`).

```bash
cd presentation
npm install                       # pptxgenjs, playwright, jszip
npx playwright install chromium

# 1. brand furniture — the product's own gradient and shield lockup
node capture/brand.mjs

# 2. 34 real screens, 3x, transparent, in the app's real device frame
node capture/shoot.mjs --base http://127.0.0.1:5199

# 3. three clips of the app being driven for real -> mp4 + gif + still
node capture/motion.mjs

# 4. build both decks
node generate.mjs
node generate.mjs --static

# 5. check them
node validate.mjs                 # package integrity, legibility floor, placeholders
node audit.mjs                    # measured text overflow, in real Inter metrics
powershell -ExecutionPolicy Bypass -File capture/preview.ps1   # render via PowerPoint
```

Steps 1–3 only need re-running when the application's UI changes.

---

## Fonts

The deck is set in **Inter**, the face the application itself loads. Static
faces are bundled under `assets/fonts/` (SIL Open Font Licence 1.1).

On the presenting machine, run once:

```powershell
powershell -ExecutionPolicy Bypass -File assets/fonts/install-fonts.ps1
```

It installs for the current user only — no admin, nothing system-wide, and the
header comment explains how to undo it. Without Inter, PowerPoint substitutes
Segoe UI; nothing breaks, but the type is not what was designed.

---

## How the tooling works

**`capture/shots.tsx` + `shoot.mjs`** — a harness that renders exactly one real
screen at real device size inside the app's real `Frame`, on a transparent
page, at `deviceScaleFactor: 3`. It imports the actual screen components and
the actual demo fixtures, exactly as `src/gallery.tsx` already does for the UI
documentation PDF. It draws no UI of its own, so a deck image can never drift
from the product.

**`capture/motion.mjs`** — drives the running application with real clicks and
real keystrokes, records it, and marks the moment each clip's story starts so
all setup navigation is trimmed away. Output is MP4 (for any other use), GIF
(what the deck embeds — GIFs loop in PowerPoint slideshow with no codec, no
autoplay setting and no click) and a closing still for the backup deck.

**`measure.mjs`** — the reason the deck has no overflow. PowerPoint anchors text
to the top of its box and silently lets it spill out, so a box that is too
short does not look broken until it collides with something on a projector.
Every string is measured in Chromium with the real Inter faces, at the real
width, size, tracking and line spacing; `slides.mjs` then stacks blocks from
measured heights instead of guessed ones. The build runs in passes: build,
measure the cache misses, rebuild.

**`generate.mjs`** — composes the deck with PptxGenJS, then reopens the `.pptx`
as a zip to write `p:transition` into each slide, because PptxGenJS has no API
for transitions. The package is rebuilt by hand so `[Content_Types].xml` stays
first and no directory entries are emitted — both of which PowerPoint rejects.

**`validate.mjs` / `audit.mjs`** — the checks that caught the real bugs: a
negative shape extent that made PowerPoint refuse the file outright, an 8.5 pt
label below the legibility floor, and ~130 text overflows.

---

## Editing the deck

The `.pptx` is a genuine, fully editable PowerPoint file — real text boxes, real
shapes, no flattened slide images. You can open it and change anything.

If you want a change to survive a rebuild, make it in `slides.mjs` instead.
Design tokens live in `theme.mjs`; the reasoning behind them is in
`Presentation_Design_System.md`.

---

## Reliability notes for the day

- The deck is **self-contained**: all media embedded, no localhost URLs, no
  remote images, no web embeds, no macros, no add-ins. It needs no internet.
- **Morph** carries the seven matched-state transitions and needs PowerPoint
  2019 or 365. The XML includes a fade fallback, and every slide is composed to
  read correctly standing still.
- The **static backup** uses fade only and contains no animated media.
- The three GIF clips autoplay in slideshow. If one does not, the slide still
  makes its point — the speaker script says to keep going.
- Verified opening in Microsoft PowerPoint (Office 16) on this machine: both
  decks, 22 slides, 22 speaker notes, 13.33 × 7.5 in.
