# TrustCraft — Presentation QA Report

Everything checked, everything found, everything fixed — and the things that
are still open.

**Decks under test**
- `output/TrustCraft_DHACK_Grand_Final.pptx` — 22 slides, 26.0 MB
- `output/TrustCraft_DHACK_Static_Backup.pptx` — 22 slides, ~21 MB

> **Update — business-model chapter rebuilt.** Chapter 10 went from one slide
> ("free tier / paid tier") to three (`Core` → `B2B commerce` → `Expansion`),
> so the deck is now 22 slides. The old slide positioned the professional
> subscription as optional; the new chapter makes an active **TrustCraft
> Professional** membership a required condition of operating, on top of the
> already-built 8% completed-job fee, with B2B supply commerce, sponsored
> placement, payments, enterprise and business tooling as tagged future
> engines. Every claim carries a `BUILT / LAUNCH MODEL / NEXT / PROPOSED /
> SCALE / LATER` tag. Governing rule on the slide: *access is paid, trust is
> earned* — no badge, score, review or ranking is ever for sale. `validate.mjs`
> and `audit.mjs` both pass; all 22 renders reviewed by eye.

---

## ⚠ One item is still open

**The team name is a placeholder.** The repository contains no team name, so
slides 1, 2 and 22 currently read `TEAM NAME — SET TEAM_NAME BEFORE THE FINAL`.

This is deliberately impossible to miss: `validate.mjs` treats it as a **hard
failure** and exits non-zero while it is present. Fix with one command:

```bash
TEAM_NAME="Your Team Name" node presentation/generate.mjs
TEAM_NAME="Your Team Name" node presentation/generate.mjs --static
```

Verified: with a real name supplied, `validate.mjs` reports `structure OK`.
Nothing else in either deck is unresolved.

---

## How it was checked

Four independent passes, because each catches a class the others cannot see.

| Pass | Tool | What it can catch |
|---|---|---|
| Structure | `validate.mjs` | Package integrity, negative extents, missing media, undeclared content types, type below the legibility floor, placeholder copy, missing transitions and notes |
| Text metrics | `audit.mjs` | Text that does not fit its box, measured in Chromium with the same Inter faces PowerPoint uses |
| Render | `capture/preview.ps1` | What **PowerPoint itself** draws — one PNG per slide, via COM |
| Eye | Manual review of all 20 renders | Shape-on-shape collisions, composition, hierarchy, whether a slide is any good |

The render pass matters most: the decks were exported by the real Microsoft
PowerPoint on this machine, not by a substitute renderer.

---

## Defects found and fixed

### Blocking — PowerPoint refused to open the file

**1. Negative shape extent (slide 9).** The three converging lines on the peak
slide were drawn with `h: 4.11 - 4.87`, producing `cy="-695325"`. Negative
extents are invalid DrawingML and PowerPoint rejects the entire package with
"PowerPoint could not open the file" — no indication of which slide.
*Fixed:* upward lines are now a positive box plus `flipV`. `validate.mjs` now
fails on any negative extent so this cannot recur.

**2. Corrupted package on the transition round-trip.** Re-zipping the `.pptx`
to inject slide transitions emitted directory entries (`_rels/`, `ppt/`, …) and
displaced `[Content_Types].xml` from the first position. Both break OPC.
*Fixed:* the package is rebuilt by hand, `[Content_Types].xml` first,
`createFolders: false`. `validate.mjs` checks both.

### Layout — text spilling out of its box

**3. ~130 text overflows across 17 slides.** Box heights were being guessed.
PowerPoint anchors text to the top of its box and silently lets it overflow, so
these were invisible until something collided on a rendered slide.
*Fixed structurally, not slide by slide:* `measure.mjs` now measures every
string in Chromium with the real Inter faces at the real width, size, tracking
and line spacing; `slides.mjs` stacks blocks from measured heights and each
`text()` call returns the y it ends at. The build runs in passes — build,
measure the cache misses, rebuild.
*Result:* `audit.mjs` reports **no overflow** on either deck.

**4. Content running past the bottom edge** — slides 13, 15, 17.
*Fixed:* copy trimmed, vertical rhythm tightened, and on slide 17 the four
horizon columns were 12.76 in wide inside a 12.09 in safe area, so the column
width was corrected.

### Collisions the overflow audit could not see

These are separate shapes overlapping, not text leaving its box. Found by eye
in the PowerPoint renders.

| # | Slide | Problem | Fix |
|---|---|---|---|
| 5 | 1, 2 | Metadata line ran under the device | Team name moved to its own line at the foot |
| 6 | 5 | "THE TRUST GAP" badge sat on the right column's heading | Badge moved to mid-height on the divider rule |
| 7 | 5 | Support chips wrapped mid-word ("Confidenc / e") | Chips replaced with one small-caps meta line |
| 8 | 11 | Annotation 1's body ran into annotation 2's heading | Annotation 2 re-anchored to the foot of the stat card |
| 9 | 12 | Sub-headline collided with the column eyebrows; drivers list overflowed its panel; payoff line ran off the slide | Panel now sized from measured contents and drawn *under* its text; payoff moved to a full-width foot line |
| 10 | 13 | Headline and supporting line ran across both devices | Supporting line folded into the eyebrow; headline rebalanced to two lines |
| 11 | 15 | Headline over the map and the right column; axis label inside the plot; citation under the last paragraph | Slide rebuilt: two-line headline, map narrowed, axis labels moved outside the plot |
| 12 | 16 | Headline wrapped into the section label; "PROPOSED" tag overflowed its pill | Headline widened, pill widened |
| 13 | 7 | Closing strapline collided with the footer lockup | Footer moved down, strapline lifted |

### Craft

**14. Squashed logo lockup.** The brand generator captured the lockup inside a
full-width flex row, so the PNG was 2800 × 288 with the artwork in the left
third. Placed at the assumed aspect ratio, the shield rendered as a tall
rounded rectangle.
*Fixed:* the lockup is captured at `width: max-content`, and `slides.mjs` now
derives the aspect from the file itself (`pngSize`) so it can never drift again.

**15. Clipped drop shadows on light slides.** Screenshots were captured with
70 px of padding, which cut the app's own `0 40px 90px` shadow and left a
visible hard edge on the light slides.
*Fixed:* padding increased to 150/150/200 px and all 34 screens re-captured.
`theme.mjs` derives the device geometry from those numbers.

**16. Type below the legibility floor.** A fix for the wrapping meta line on
slide 5 dropped it to 8.5 pt. `validate.mjs` caught it.
*Fixed properly* — back to 9.5 pt with reduced tracking, which fits. The floor
was not lowered.

**17. Decorative bars on slide 17.** Four equal-height blocks read as filler
rather than as growing reach.
*Fixed:* the bars now share a baseline and rise in height across the four
horizons, so the progression is legible as a step.

---

## Current state

### Structure — both decks

```
slides        22
transitions   7 morph · 15 fade      (backup: 0 morph · 22 fade)
speaker notes 22/22
media parts   59 (png, gif)          (backup: 59 png)
negative extents            none
missing media targets       none
undeclared content types    none
type below 9 pt             none
[Content_Types].xml first   yes
directory entries           none
```

### Text metrics

`audit.mjs`: **no overflow found** on either deck. Every text box fits its
content at the exact Inter metrics PowerPoint will use.

### Opens in real PowerPoint

Verified via COM against Microsoft PowerPoint (Office 16):

```
OPENS OK  TrustCraft_DHACK_Grand_Final.pptx    slides=22  notes=22  13.33 x 7.5 in
OPENS OK  TrustCraft_DHACK_Static_Backup.pptx  slides=22  notes=22  13.33 x 7.5 in
```

### Remaining warnings (expected, not defects)

`validate.mjs` reports three objects extending past the canvas, on slides 1, 2
and 20. All three are the transparent padding around a device screenshot — the
padding that keeps the app's drop shadow un-clipped. The device itself is fully
on-slide in every case. This is intentional bleed.

---

## Slide-by-slide

| # | Chapter | Surface | Dominant idea | Product UI | Status |
|---|---|---|---|---|---|
| 1 | Cold open | dark | "Trusting them isn't." | Home, empty | ✅ |
| 2 | Cold open, typed | dark | The query appears | Home, typed | ✅ |
| 3 | The real problem | dark | The scatter | — | ✅ |
| 4 | Three frictions | dark | Discovery / Evaluation / Communication | — | ✅ |
| 5 | Two sides | light | One problem, two sides | Home + Service Request | ✅ |
| 6 | The reveal | dark | Describe the problem | Home | ✅ |
| 7 | Three phases | dark | Describe → Understand → Discover | 3 screens | ✅ |
| 8 | Three input modes | dark | Text / Photo / Voice | 3 screens | ✅ |
| 9 | Convergence | dark | One structured problem | 4 screens | ✅ |
| 10 | **Motion peak** | dark | "Just tell us what's wrong" | 2 live clips | ✅ |
| 11 | **Trust surface** | light | Know *why* you're choosing | Pro profile + annotations | ✅ |
| 12 | Earned, not claimed | light | The score's drivers | Profile + Analyse | ✅ |
| 13 | UX by design | light | Three laws, in the product | Home + Recommendations | ✅ |
| 14 | Market evidence | light | **76.1%** | — | ✅ |
| 15 | Competitive position | light | Positioning map | — | ✅ |
| 16 | Business model · Core | dark | Membership (LAUNCH MODEL) + 8% fee (BUILT) | Quote builder | ✅ |
| 17 | Business model · B2B commerce | dark | The second marketplace a job creates (NEXT) | Quote builder | ✅ |
| 18 | Business model · Expansion | dark | Payments / enterprise / business tooling; revenue architecture | — | ✅ |
| 19 | Scale | dark | Four horizons | — | ✅ |
| 20 | Closing | dark | "shouldn't be another problem" | Confirmation, ghosted | ✅ |
| 21 | Wordmark | dark | Describe it. Find them. Trust the choice. | — | ✅ |
| 22 | Handoff | dark | "Let us show you how it works." | — | ⚠ team name |

Product UI appears on **14 of 22 slides**, roughly half the deck's visual
weight — the target set in the design system.

---

## Honesty audit

Every claim in the deck traced to a source or to code.

| Check | Result |
|---|---|
| Any invented user, revenue, provider or transaction number? | **No.** The deck states plainly that there is no traction |
| Any invented market size or TAM? | **No.** Only the DCS workforce figure, which is sourced |
| Any fabricated testimonial, award, partnership or interview? | **No** |
| Any competitor weakness asserted without checking? | **No.** Slide 15 names what Servixy, TaskForce and Blu each do *well*, from their own sites |
| Any UI in the deck that does not exist in the app? | **No.** All 34 screens are captured from the running application |
| Any redesigned or "improved" screen? | **No.** `capture/shots.tsx` imports the real components and draws none of its own |
| Speculative business model labelled? | **Yes** — slides 16–18 tag every claim `BUILT / LAUNCH MODEL / NEXT / PROPOSED / SCALE / LATER`; only the 8% completed-job fee is marked built |
| Does the model sell trust? | **No** — slide 16 states *access is paid, trust is earned*; verification, score, reviews and ranking are never purchasable. Sponsored supplier placement is the only paid visibility and is labelled `SPONSORED` |
| Every number on a slide sourced? | **Yes** — `TrustCraft_Presentation_Sources.md` |
| Trust score / match figures traceable? | **Yes** — `server/domain.mjs`, cited in the sources file |

**Stated openly on the slides themselves:** every business-model layer beyond
the 8% fee is tagged as a launch model or a future engine; the competitive axes
are qualitative, not measured share; slide 19 says there are deliberately no
dates, targets or valuations.

**One thing a judge could find that the deck does not say:** the shipped app
runs on seeded demo fixtures, while the scoring, classification and matching
engine lives in a separate, unit-tested domain layer that is not yet wired to
the UI. That is covered head-on in `TrustCraft_Judge_QA.md` under "The one
thing to know before you answer anything".

---

## Reliability

| Requirement | Status |
|---|---|
| Self-contained, no internet needed | ✅ all media embedded |
| No localhost or dev-server URLs | ✅ |
| No remote images or web embeds | ✅ |
| No macros, scripts or add-ins | ✅ |
| Fonts available on the presenting machine | ✅ Inter installed for the current user; files + installer bundled |
| Static fallback for every motion slide | ✅ backup deck substitutes each clip's closing frame |
| Backup deck free of version-dependent features | ✅ fade only, no morph, no animated media |
| File size reasonable | ✅ 26.0 MB / ~21 MB |
| Editable, not flattened images | ✅ real text boxes and shapes throughout |
| Opens in Microsoft PowerPoint | ✅ verified via COM |

**Motion risk, stated plainly.** Morph needs PowerPoint 2019 or 365; the XML
carries a fade fallback and every slide is composed to read correctly standing
still. The three clips are GIFs rather than video specifically because GIFs
loop in slideshow with no codec dependency, no autoplay setting and no click.
If a clip does not run, the slide still makes its point, and the speaker script
tells the presenter to keep going.

---

## Timing

Script total **9:32** against a 10:00 limit — 28 seconds of margin. The
business-model chapter grew from 0:45 to 1:49 for the three-slide rebuild; the
other eleven chapters were tightened (and three `[CUT IF BEHIND]` passages made
permanent) to hold the total. Three mid-run checkpoints (3:27, 5:40, 8:09) let
the presenter detect drift early; the note in the script says the business
chapter is the one place not to overrun.

Demo script total **4:35** against 5:00, with step 8 marked droppable.

---

## What was not done

Stated so nothing is implied by omission.

- **No desktop UI in the deck**, because TrustCraft has none. The product is a
  390 × 844 mobile application with two role-based apps. The cross-surface
  story is customer app ↔ professional app on one design system, shown on
  slides 5 and 12. Inventing a desktop layout would have meant fabricating UI.
- **No usability testing.** No users were tested, and no research finding is
  claimed anywhere.
- **No shape-collision auditor.** Overflow is automated; shape-on-shape overlap
  was found by eye across all 20 renders. A geometric overlap check would be
  the next tool worth building if this deck keeps evolving.
- **No opening in LibreOffice or Google Slides.** Neither is installed here.
  Verification was against Microsoft PowerPoint, which is what will be used.
