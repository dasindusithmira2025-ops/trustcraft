# TrustCraft — DHACK Grand Final presentation

Everything for the 10-minute presentation, the 5-minute prototype demo and the
5-minute Q&A. **This directory is presentation tooling only.** It does not run
in, ship with, or affect the TrustCraft application — it has its own
`package.json` so no dependency here touches the app's.

The one thing it *does* read is the application itself: every product image in
the deck is a real screen captured from the running React app, and every colour
and type token is lifted from `src/index.css`.

---

## Team name

The deck ships as **Team TrustCraft** on slides 1, 2 and 22 (`slides.mjs` →
`TEAM`). Override for a different registration without editing the source:

```bash
TEAM_NAME="Your Team Name" node presentation/generate.mjs
TEAM_NAME="Your Team Name" node presentation/generate.mjs --static
```

`validate.mjs` treats any leftover placeholder as a hard failure, so an unset
team name cannot ship by accident.

---

## Deliverables

### Slides 17–18: the business-model pair

These two now ship **in the Grand Final deck itself** (`output/TrustCraft_DHACK_Grand_Final.pptx`),
with the PDF and the 22 slide previews re-exported from PowerPoint.

Both slides are drawn with the deck's own primitives — same display and body
type scale, same hairline rules, same `BUILT` / `PROPOSED` tags and brand
footer as slides 16 and 19. Those primitives now live in **`kit.mjs`**, shared
by `slides.mjs` and `business-slides.mjs`, so the pair cannot drift from the
rest of the deck again.

**Slide 16 — one completed job, four revenue engines.** The real quotation
screen is the hub, carrying a green `CURRENT BUILD` tag: the 8% quotation fee
logic is the one mechanism with code behind it (`src/worker/data.ts` →
`PLATFORM_FEE`). All four engines branching off it carry amber PROPOSED tags,
so *built logic* can never be mistaken for *final pricing*. **5 clicks.**

**Slide 17 — why the economics can work.** Two halves. Left is professional
economics: Free 10% against Pro 8% + a subscription capped at LKR 1,490, at
LKR 100K / 200K / 300K of monthly work, with a bar whose length is what the Pro
retains — 510, 2,510, 4,510 — so the widening gap *is* the chart. Right is an
explicitly-labelled illustrative scale scenario: 50.5M GMV, ≈5.05M core monthly
platform revenue, of which only the 447K subscription line is MRR, and ≈60.6M
as an annualised run rate. **8 clicks.**

**Slide 18 — the public evidence map.** Five competitors against four
monetisation columns, then the TrustCraft rail on its own band, then four
structural advantages. Cells are either something the platform publishes about
itself or an explicit "not publicly found" — never a red cross, because absence
of public evidence is not evidence of absence. The claim is *architectural*
(more ways to earn), never comparative performance. **4 clicks.**

Shapes inside a beat stagger 60 ms apart so a block assembles rather than
blinking on. No macros and no add-ins — stock PresentationML written by
`business-motion.mjs`.

`output/TrustCraft_DHACK_Interactive.pptx` and `..._Interactive_Static.pptx` are
byte-identical copies of the two main decks, refreshed on every rebuild. They
exist only for the round when the Grand Final file is locked in PowerPoint.

- `output/interactive-preview/index.html`: self-contained browser companion for
  slides 16–18, with reveal, replay, previous, and show-all controls.

Rebuild from this directory:

```bash
node generate.mjs                 # Grand Final
node generate.mjs --static        # backup
node capture/business-preview.mjs # browser companion
node audit.mjs && node validate.mjs
powershell -ExecutionPolicy Bypass -File capture/preview.ps1   # PNGs + PDF
```

`audit.mjs` reports no overflow; `validate.mjs` still fails only on the
team-name placeholders on slides 1, 2 and 22.

| File | What it is |
|---|---|
| `output/TrustCraft_DHACK_Grand_Final.pptx` | **The deck.** 22 slides, 12 chapters, Morph + Fade transitions, 3 looping GIF clips of the real app, speaker notes on every slide |
| `output/TrustCraft_DHACK_Static_Backup.pptx` | Same deck, no animated media, fade-only transitions. Opens anywhere |
| `output/TrustCraft_DHACK_Grand_Final.pdf` | PDF export, produced by PowerPoint itself |
| `previews/slide-01..22.png` | What PowerPoint actually renders, one PNG per slide |
| `TrustCraft_DHACK_Speaker_Script.md` | Word-for-word script, 9:43, with click and cut cues |
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

If you want a change to survive a rebuild, make it in `slides.mjs` instead
(slides 16, 17 and 18 live in `business-slides.mjs`). Design tokens live in
`theme.mjs` and the shared drawing primitives — text, rules, pills, tags, the
brand footer — in `kit.mjs`; the reasoning behind them is in
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
