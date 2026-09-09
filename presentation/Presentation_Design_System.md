# TrustCraft — Presentation Design System

Everything here is derived from the running product, not invented for the deck.
The authorities are `src/index.css` (`@theme` tokens), `src/components/UI.tsx`
(primitives, icons, device frame) and `src/gallery.tsx` (the UI-documentation
generator that already codifies the product's ramps and type scale).

---

## 1. Canvas

| | |
|---|---|
| Aspect | 16:9 widescreen |
| Slide size | 13.333 in × 7.5 in (960 × 540 pt) |
| Unit | inches, because PptxGenJS positions in inches |
| Safe area | 0.62 in left/right, 0.50 in top, 0.55 in bottom |
| Outer no-go band | ≥ 4% of each edge stays free of critical content |
| Column grid | 12 columns, 0.9 in wide, 0.22 in gutter, inside the safe area |
| Vertical rhythm | 0.0833 in (6 pt) baseline unit |

## 2. Surfaces

The deck alternates two surfaces so the argument has rhythm. Dark carries the
narrative and the product; light carries the analysis.

**Dark surface — `assets/brand/bg-dark.png`**
This is the literal `body` background of the TrustCraft application:

```css
radial-gradient(120% 120% at 50% 0%, #1E293B 0%, #0B1220 60%, #060A12 100%)
```

Rendered once at 2560 × 1440 and reused, so every dark slide is the product's
own surface rather than an approximation. Carries the cold open, the problem,
the reveal, the multimodal peak, the business model (slides 16–18), scale and
the close.

**Light surface — flat `#F8FAFC` (`ink-50`)**
The app's own page tint behind tab screens. Carries the two-sides slide, the
trust surface, UX by design, market evidence and competitive position.
Never pure white: white is reserved for the device screens themselves, so the
product always reads as the brightest object on the slide.

## 3. Colour

Straight from `src/index.css @theme`. Nothing outside this list appears in the deck.

| Role | Token | Hex |
|---|---|---|
| Brand / primary action / active state | `brand-600` | `#2563EB` |
| Brand light (on dark) | `brand-500` | `#3B82F6` |
| Brand deep | `brand-700` | `#1D4ED8` |
| Brand wash | `brand-100` / `brand-50` | `#DBEAFE` / `#EFF6FF` |
| Ink darkest / dark surface floor | `ink-950` | `#020617` |
| Ink headline (light slides) | `ink-900` | `#0F172A` |
| Ink body | `ink-700` | `#334155` |
| Ink muted | `ink-500` | `#64748B` |
| Ink faint | `ink-400` | `#94A3B8` |
| Hairline | `ink-200` | `#E2E8F0` |
| Light surface | `ink-50` | `#F8FAFC` |
| Verified / completed / escrow | `success-600` | `#16A34A` |
| Attention, scheduled, expiring | `warning-600` | `#F59E0B` |
| Risk, rejection, unread | `danger-600` | `#DC2626` |
| Rating stars only | `gold-500` | `#F59E0B` |

**On dark**, text uses white at four fixed opacities baked into flat hex so
PowerPoint never has to composite: `FFFFFF` (headline), `C7D2E0` (lead),
`94A3B8` (body/meta), `64748B` (label). Brand accent on dark is `#3B82F6`,
never `#2563EB` — the 600 is too dense against `#0B1220`.

Colour is never the only carrier of meaning: every accent is paired with a
label, a number or a position.

## 4. Typography

**Family: Inter.** The product loads Inter from Google Fonts in `src/index.css`,
so the deck uses the same face. Static faces are bundled in
`assets/fonts/` (SIL OFL 1.1) with `install-fonts.ps1` for the presenting
machine. PowerPoint sees four families:

- `Inter` — regular and bold
- `Inter Medium`
- `Inter SemiBold`
- `Inter ExtraBold`

If Inter is missing, PowerPoint substitutes Segoe UI, which is metrically close
enough that no slide breaks; run the install script to get the intended render.

### Type scale (pt)

| Role | Size | Face | Tracking | Used on |
|---|---|---|---|---|
| Cold-open / closing display | 60 | Inter Bold | −1.6 | 1, 12 |
| Giant metric | 132 | Inter ExtraBold | −4.0 | 8 |
| Section headline | 40 | Inter Bold | −1.1 | 2–7, 9–11 |
| Sub-headline / turn | 26 | Inter SemiBold | −0.5 | most |
| Lead statement | 20 | Inter Regular | −0.2 | most |
| Body | 16.5 | Inter Regular | 0 | most |
| Annotation | 14 | Inter Medium | 0 | 6, 7 |
| Caption / meta | 12.5 | Inter Regular | 0 | most |
| Eyebrow / label | 10.5 | Inter SemiBold, uppercase | +1.6 | most |
| Citation | 9 | Inter Regular | 0 | 8, 9 |

Line spacing is set as a multiple: 1.05 for display, 1.18 for headlines,
1.45 for body. Nothing on a slide is below 9 pt, and nothing below 12.5 pt
carries information the audience must read to follow the argument.

## 5. Product imagery

Screens are captured from the running application by
`capture/shots.mjs` at `deviceScaleFactor: 3` — 1170 × 2532 of real pixels
inside the app's real `Frame` (390 × 844, 44 pt corner radius, the app's own
`0 40px 90px rgba(0,0,0,0.55)` shadow and hairline ring). They are saved with an
alpha channel, so the rounded corners and the shadow sit on any surface.

Rules:

- **Never** wrap a screen in an extra mockup, laptop, tilt or 3D perspective.
  The device frame is the product's own; nothing is added on top.
- Crops are honest crops (`?y=` scroll offsets against the real screen), never
  recomposed UI.
- A screen is either shown whole or cropped to a single region of interest;
  it is never stretched, and aspect ratio is always preserved.
- Minimum on-slide device height 4.3 in, so the smallest live UI text
  (11 pt in-app) stays legible when projected.
- At most three devices on a slide. Four reads as a grid, and a grid reads as
  a template.

## 6. Annotation style

Used on slides 6 and 7 only, where the point *is* a specific pixel.

- Leader line: 0.75 pt, `#94A3B8` on light / `#64748B` on dark, always
  horizontal or vertical — never diagonal, never curved, never an arrow.
- Terminal dot: 0.06 in circle, `brand-600`.
- Label: 10.5 pt uppercase eyebrow + 14 pt Inter Medium body, left-aligned,
  0.14 in from the line end.
- Maximum three annotations per slide. If a fourth is needed, the slide is
  making two points and should be split.

## 7. Shape language

- Corner radius: 0.10 in on panels, 0.055 in on chips. These match the app's
  `rounded-2xl` / `rounded-lg` at slide scale.
- Hairlines: 0.75 pt, `#E2E8F0` on light, `#1E293B` on dark.
- Fill panels on dark: `#0F172A` at 100% — never translucent glass.
- Fill panels on light: `#FFFFFF` with a 0.75 pt `#E2E8F0` hairline.
- **No shadows on slide shapes.** The only shadow in the deck is the one the
  product itself casts, baked into the screen PNGs.
- No decorative circles, blobs, floating 3D objects or gradient meshes.

## 8. Motion

Three levels, in order of reliability.

**Level 1 — native transitions.** Injected into the generated PPTX as
`p:transition` XML after PptxGenJS writes the file (`generate.mjs`, `withTransitions`).
`morph` between matched states, `fade` between chapters. Both are stock
PowerPoint transitions; if a build opens somewhere that ignores them, the
slides simply cut, and every slide is composed to stand still.

**Level 2 — matched slide states.** Consecutive slides share a layout and change
one thing, so Morph animates the difference: the query typing itself into the
home screen (1a→1b), the fragmented journey resolving into three named problems
(2a→2b), one device becoming three phases (4a→4b), three input modes converging
(5a→5b), the trust surface handing over to the score that produces it (6a→6b),
the closing reducing to the wordmark (12a→12b→12c).

**Level 3 — rendered clips.** `capture/motion.mjs` drives the real app and
records it. Delivered as **animated GIF** in the deck, because GIF loops in
PowerPoint slideshow with no codec dependency, no autoplay setting and no
click. MP4 versions of the same clips ship in `assets/motion/` for any other
use. Every clip has a closing still (`*-still.png`) that the static backup deck
uses in its place.

Motion rules: nothing spins, bounces, flies or zooms. Motion only ever shows
the product doing the thing being described.

## 9. Citation style

9 pt `#94A3B8`, bottom-left inside the safe area, one line, format:

> Source — Organisation, *Title*, year. Accessed 8 Sep 2026.

Full claim-by-claim provenance lives in `TrustCraft_Presentation_Sources.md`.
Every number on a slide appears there. Anything that is a plan rather than a
fact is labelled `PROPOSED` on the slide itself.

## 10. Charts

One number beats six. The deck contains no bar chart, no pie chart, no 3D
anything. Slide 8 is a single giant percentage with a proportion rule beneath
it. Slide 9 is a two-axis positioning map built from native shapes, so it stays
editable and readable at the back of a hall.

## 11. Logo usage

- `assets/brand/lockup-white.png` on dark, `lockup-ink.png` on light.
- Clear space on all sides ≥ the height of the shield mark.
- Minimum lockup width 1.0 in. Below that, use `mark.png` alone.
- The mark is never recoloured, outlined, rotated or placed on a busy area of
  a product screenshot.

## 12. Slide inventory

22 slides, 12 story chapters. Motion states are marked `→`.

| # | Chapter | Surface | Time |
|---|---|---|---|
| 1–2 | 01 Cold open → typed query | dark | 0:28 |
| 3–4 | 02 The real problem → three frictions | dark | 0:40 |
| 5 | 03 Two sides of the trust gap | light | 0:35 |
| 6–7 | 04 Reveal → describe / understand / discover | dark | 0:41 |
| 8–10 | 05 Multimodal peak → convergence → live motion | dark | 1:03 |
| 11–12 | 06 Trust is the product → what builds the score | light | 0:53 |
| 13 | 07 UX by design | light | 0:39 |
| 14 | 08 Market evidence | light | 0:41 |
| 15 | 09 Competitive position | light | 0:40 |
| 16–18 | 10 Business model · four engines → economics → architecture | dark | 2:05 |
| 19 | 11 Scale | dark | 0:40 |
| 20–22 | 12 Closing → wordmark → handoff | dark | 0:43 |

Total spoken target: **9:48**, inside a 10:00 limit.

**Chapter 10** is three slides, all on the dark surface, fade between them, and
answers three questions in order: *what* the model is (16 — one completed job,
four revenue engines: completed-job commission, optional TrustCraft Pro
subscription, supply network, TrustCraft for Business), *why* the economics can
work (17 — the professional-side arithmetic of the 10% / 8% split and the
activity-adjusted Pro price, and an explicitly **illustrative** platform-scale
scenario), and *why* the architecture is differentiated (18 — a publicly-sourced
competitor matrix and four structural-advantage pillars). Only `BUILT` (solid
green) and `PROPOSED` (outlined amber) tags are used; the 8% completed-job fee
is the one `BUILT` mechanism. Product UI: the real quotation screen
(`w-quote-money`) as the hub of slide 16. The chapter never claims TrustCraft
already out-earns an operating competitor — the claim is architectural — and
paying never buys trust: verification, score, reviews and ranking stay separate
from any fee. Every competitor claim carries a slide footnote and is logged in
`TrustCraft_Presentation_Sources.md`.
