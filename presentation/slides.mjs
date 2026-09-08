/**
 * The TrustCraft DHACK Grand Final deck, slide by slide.
 *
 * Twelve story chapters across twenty slides; the extra slides are matched
 * states that exist so PowerPoint's Morph transition can animate one idea into
 * the next. Every product image is a real screen captured from the running
 * application (see capture/shots.mjs) — nothing in here draws fake UI.
 *
 * Text boxes are never sized by hand. `text()` measures the string with the
 * real Inter faces (measure.mjs) and returns the y its box ends at, so blocks
 * stack from measured heights instead of guessed ones.
 *
 * `mode` is 'motion' (animated GIFs on the peak slide) or 'static' (the same
 * frames, held still) for the backup build.
 */
import { A, C, F, T, W, H, M, DEV, pngSize } from './theme.mjs'
import { measureH } from './measure.mjs'

/** Lockup proportions come from the asset itself, never a hard-coded guess. */
const LOCKUP = (() => { const d = pngSize(A.brand('lockup-white.png')); return d.h / d.w })()

/** Set before the final run, or pass TEAM_NAME=... on the command line. */
export const TEAM = process.env.TEAM_NAME || 'TEAM NAME — SET TEAM_NAME BEFORE THE FINAL'

// ── Primitives ───────────────────────────────────────────────────────────────

const dark = (p, s = p.addSlide()) => (s.background = { path: A.brand('bg-dark.png') }, s)
const light = (p, s = p.addSlide()) => (s.background = { color: C.ink50 }, s)

/**
 * Places text with a measured box and returns the y it ends at, so callers can
 * stack the next block against a real number.
 */
function text(s, t, o) {
  const opts = { fontFace: F.reg, valign: 'top', ...o }
  const h = opts.h ?? measureH(t, opts)
  s.addText(t, { ...opts, h })
  return o.y + h
}

const eyebrow = (s, t, x, y, color, w = 6) =>
  text(s, t.toUpperCase(), { x, y, w, ...T.eyebrow, color })

/**
 * Places a real screen so x/y/h describe the DEVICE, not the padded PNG.
 * The padding exists only so the app's own drop shadow survives the crop.
 */
function device(s, id, { x, y, h, transparency }) {
  const dw = h * DEV.aspect
  s.addImage({
    path: A.shot(id),
    x: x - dw * DEV.padX,
    y: y - h * DEV.padY,
    w: dw * DEV.imgW,
    h: h * DEV.imgH,
    ...(transparency ? { transparency } : {}),
  })
  return { x, y, w: dw, right: x + dw, bottom: y + h, cx: x + dw / 2 }
}

/** Same contract for the recorded clips (780 x 1688 device pixels, no padding). */
function clip(s, file, { x, y, h }) {
  const w = h * (780 / 1688)
  s.addImage({ path: A.motion(file), x, y, w, h })
  return { x, y, w, right: x + w, bottom: y + h, cx: x + w / 2 }
}

const rule = (s, { x, y, w, color, width = 0.75 }) =>
  s.addShape('line', { x, y, w, h: 0, line: { color, width } })

const vrule = (s, { x, y, h, color, width = 0.75 }) =>
  s.addShape('line', { x, y, w: 0, h, line: { color, width } })

const panel = (s, { x, y, w, h, fill, line, radius = 0.1 }) =>
  s.addShape('roundRect', {
    x, y, w, h, rectRadius: radius,
    fill: fill ? { color: fill } : { type: 'none' },
    line: line ? { color: line, width: 0.75 } : { type: 'none' },
  })

const dot = (s, { x, y, d = 0.09, color = C.brand }) =>
  s.addShape('ellipse', { x: x - d / 2, y: y - d / 2, w: d, h: d, fill: { color }, line: { type: 'none' } })

/** A pill whose box IS the visual, so its height is fixed on purpose. */
const pill = (s, t, { x, y, w, h = 0.3, fill, line, color, size = 10, face = F.semi, spc = 0 }) =>
  s.addText(t, {
    x, y, w, h, shape: 'roundRect', rectRadius: 0.05,
    fill: fill ? { color: fill } : { type: 'none' },
    line: line ? { color: line, width: 0.75 } : { type: 'none' },
    fontSize: size, fontFace: face, charSpacing: spc, color,
    align: 'center', valign: 'middle',
  })

const FOOTER_Y = 7.08

/** Small brand furniture, bottom-left, on the chapters between the bookends. */
function footer(s, isDark) {
  s.addImage({ path: A.brand('mark.png'), x: M.l, y: FOOTER_Y, w: 0.17, h: 0.17 })
  s.addText('TrustCraft', {
    x: M.l + 0.24, y: FOOTER_Y - 0.05, w: 1.4, h: 0.26,
    fontSize: 9.5, fontFace: F.semi, charSpacing: 0.3, valign: 'middle',
    color: isDark ? C.onDarkFaint : C.ink400,
  })
}

const cite = (s, t) =>
  text(s, t, { x: M.l, y: 7.0, w: 11.9, ...T.cite, color: C.ink400 })

/** A numbered marker that sits on top of a screen. */
function marker(s, n, x, y) {
  const d = 0.32
  s.addShape('ellipse', {
    x: x - d / 2, y: y - d / 2, w: d, h: d,
    fill: { color: C.brand }, line: { color: 'FFFFFF', width: 1.5 },
  })
  s.addText(String(n), {
    x: x - d / 2, y: y - d / 2, w: d, h: d,
    fontSize: 11, fontFace: F.semi, color: 'FFFFFF', align: 'center', valign: 'middle',
  })
}

// ── Chapter 01 · Cold open ───────────────────────────────────────────────────

function coldOpen(p, typed) {
  const s = dark(p)
  s.addImage({ path: A.brand('lockup-white.png'), x: M.l, y: 0.55, w: 1.9, h: 1.9 * LOCKUP })

  text(s, [
    { text: 'Finding someone\nis easy.\n', options: { color: '7C90AB' } },
    { text: 'Trusting them isn’t.', options: { color: C.onDarkHead } },
  ], { x: M.l, y: 1.72, w: 7.9, ...T.display })

  rule(s, { x: M.l, y: 4.72, w: 1.5, color: C.brandLight, width: 2 })

  text(s,
    'TrustCraft makes finding a trusted home-service professional as simple as describing the problem.',
    { x: M.l, y: 4.98, w: 6.5, ...T.lead, color: C.onDarkLead })

  eyebrow(s, 'DHACK Grand Final', M.l, 6.62, C.onDarkFaint, 4)
  text(s, TEAM, { x: M.l, y: 6.88, w: 6.0, fontSize: 12, fontFace: F.med, color: C.onDarkBody })

  device(s, typed ? 'home' : 'home-blank', { x: 8.82, y: 0.5, h: 6.5 })

  s.addNotes(
    'COLD OPEN — 0:30\n' +
    'Beat 1 (static): "Finding someone is easy."\n' +
    'CLICK -> the query types itself into the real app.\n' +
    'Beat 2: "Trusting them isn\'t." Then the one-line promise.\n' +
    'This is the live TrustCraft home screen — nothing here is a mockup.')
  return s
}

// ── Chapter 02 · The real problem ────────────────────────────────────────────

const FRAGMENTS = [
  'Ask a friend', 'Facebook group', 'Google it', 'A directory listing',
  'Call three numbers', 'Send photos on WhatsApp', 'Explain it again',
  'Compare prices', 'Hope for the best',
]

// Scattered drift, and the dim band the drift resolves into.
const DRIFT = [
  [5.55, 1.05, -5], [8.45, 0.86, 4], [10.55, 1.55, -3],
  [5.05, 2.35, 6], [7.85, 2.10, -4], [10.30, 2.95, 5],
  [5.75, 3.70, -6], [8.60, 3.42, 3], [10.45, 4.40, -4],
]
const BAND = [
  [5.35, 1.02, 0], [7.50, 1.02, 0], [9.65, 1.02, 0],
  [5.35, 1.52, 0], [7.50, 1.52, 0], [9.85, 1.52, 0],
  [5.35, 2.02, 0], [7.50, 2.02, 0], [9.65, 2.02, 0],
]

const FRICTIONS = [
  ['Discovery', '“Where do I even find someone?”'],
  ['Evaluation', '“Can I trust this person in my house?”'],
  ['Communication', '“How do I explain what’s wrong?”'],
]

function realProblem(p, resolved) {
  const s = dark(p)
  footer(s, true)
  eyebrow(s, 'The real problem', M.l, 0.6, C.onDarkFaint)

  text(s, [
    { text: 'The problem isn’t\nfinding a plumber.\n', options: { color: '7C90AB' } },
    { text: 'It’s knowing\nwho to trust.', options: { color: C.onDarkHead } },
  ], { x: M.l, y: 1.02, w: 4.5, ...T.head })

  const place = resolved ? BAND : DRIFT
  FRAGMENTS.forEach((t, i) => {
    const [x, y, rot] = place[i]
    s.addText(t, {
      x, y, w: resolved ? 2.05 : 2.6, h: resolved ? 0.36 : 0.5,
      shape: 'roundRect', rectRadius: 0.06, rotate: rot,
      fill: { color: resolved ? '0D1524' : C.onDarkPanel },
      line: { color: resolved ? '18202F' : '243044', width: 0.75 },
      fontSize: resolved ? 10 : 13, fontFace: F.med,
      color: resolved ? '54627A' : C.onDarkBody,
      align: 'center', valign: 'middle',
    })
  })

  if (!resolved) {
    text(s, 'This is what finding a tradesperson looks like today.', {
      x: 5.35, y: 5.35, w: 6.2, ...T.lead, color: C.onDarkFaint,
    })
  } else {
    const after = text(s, 'Every one of those steps is the customer doing the platform’s job.', {
      x: 5.35, y: 2.56, w: 6.8, ...T.cap, color: C.onDarkFaint,
    })
    rule(s, { x: 5.35, y: after + 0.34, w: 7.36, color: '1E293B' })

    FRICTIONS.forEach(([label, quote], i) => {
      const x = 5.35 + i * 2.52
      const y0 = after + 0.62
      const a = text(s, String(i + 1).padStart(2, '0'), {
        x, y: y0, w: 1, fontSize: 11, fontFace: F.semi, color: C.brandLight, charSpacing: 0.5,
      })
      const b = text(s, label, { x, y: a + 0.04, w: 2.35, fontSize: 17, fontFace: F.semi, color: C.onDarkHead })
      text(s, quote, { x, y: b + 0.08, w: 2.3, ...T.cap, color: C.onDarkBody })
    })

    text(s, 'Too much friction.\nToo little trust.', {
      x: M.l, y: 4.9, w: 4.4, fontSize: 26, fontFace: F.semi,
      color: C.onDarkHead, charSpacing: -0.5, lineSpacing: 33,
    })
  }

  s.addNotes(
    'THE REAL PROBLEM — 0:50\n' +
    'Beat 1: the scatter is the journey people actually run today. Let it look tiring.\n' +
    'CLICK -> it collapses into the three things that are actually broken.\n' +
    'Land on: too much friction, too little trust. Do not read the fragments aloud.')
  return s
}

// ── Chapter 03 · Two sides of the trust gap ──────────────────────────────────

function twoSides(p) {
  const s = light(p)
  footer(s, false)
  eyebrow(s, 'Two sides', M.l, 0.6, C.ink400)
  const h1 = text(s, 'One problem. Two sides.', { x: M.l, y: 0.9, w: 8, ...T.head, color: C.ink900 })
  text(s, 'Both sides are trying to solve the same missing thing: proof.', {
    x: M.l, y: h1 + 0.06, w: 8.4, ...T.lead, color: C.ink500,
  })

  const TOP = 2.35
  const SIDES = [
    {
      shot: 'home', shotX: M.l, textX: 2.9, label: 'The homeowner',
      quote: '“I need help quickly.\nBut who can I trust?”',
      body: 'Wants speed, someone they can vet, and not to explain the same fault four times.',
      meta: 'Speed · Confidence · Transparency',
    },
    {
      shot: 'w-request', shotX: 10.78, textX: 7.42, label: 'The professional',
      quote: '“I’m good at my work.\nHow do the right\ncustomers find me?”',
      body: 'Skill is not the problem. Proving it outside a personal network is.',
      meta: 'Relevant work · Visibility · Reputation',
    },
  ]

  for (const side of SIDES) {
    device(s, side.shot, { x: side.shotX, y: TOP, h: 4.3 })
    const a = eyebrow(s, side.label, side.textX, TOP, C.ink400, 3.3)
    const b = text(s, side.quote, {
      x: side.textX, y: a + 0.1, w: 3.3, fontSize: 19, fontFace: F.semi, color: C.ink900, lineSpacing: 26,
    })
    const c = text(s, side.body, { x: side.textX, y: b + 0.22, w: 3.3, ...T.body, color: C.ink700 })
    text(s, side.meta.toUpperCase(), {
      x: side.textX, y: c + 0.24, w: 3.36, fontSize: 9.5, fontFace: F.semi, charSpacing: 0.45, color: C.ink400,
    })
  }

  // The gap. The badge sits on the rule at mid-height, so it cannot crowd
  // either column's heading.
  vrule(s, { x: 6.665, y: TOP, h: 4.35, color: C.ink200 })
  pill(s, 'THE TRUST GAP', {
    x: 6.665 - 1.05, y: 4.18, w: 2.1, h: 0.34,
    fill: C.ink900, color: C.white, size: 9.5, spc: 1.4,
  })
  text(s, 'TrustCraft bridges it', {
    x: 6.665 - 1.2, y: 4.62, w: 2.4, fontSize: 12, fontFace: F.semi,
    color: C.brand, align: 'center',
  })

  s.addNotes(
    'TWO SIDES — 0:40\n' +
    'Left is the live customer app, right is the live professional app — one product, two roles.\n' +
    'Say the two quotes as quotes. Then: the gap between them is the whole opportunity.\n' +
    'Do not read the small caps line; it is there for the eye, not the ear.')
  return s
}

// ── Chapter 04 · The reveal ──────────────────────────────────────────────────

const PHASES = [
  ['01', 'Describe', 'The customer writes, photographs or says what is wrong. No category to pick.', 'home'],
  ['02', 'Understand', 'TrustCraft structures the problem and works out which trade it belongs to.', 'ai-analysis-done'],
  ['03', 'Discover', 'A short, ranked set of verified professionals — with the match explained.', 'recommendations'],
]

function reveal(p, built) {
  const s = dark(p)
  eyebrow(s, 'The solution', M.l, 0.6, C.onDarkFaint)

  if (!built) {
    footer(s, true)
    const h1 = text(s, [
      { text: 'Describe the problem.\n', options: { color: C.onDarkHead } },
      { text: 'TrustCraft handles the search.', options: { color: C.brandLight } },
    ], { x: M.l, y: 1.3, w: 7.3, ...T.head })

    text(s,
      'The customer never has to know whether a leaking sink is a plumbing job, a fitting job or a carpentry job. That is the platform’s work, not theirs.',
      { x: M.l, y: h1 + 0.35, w: 6.2, ...T.lead, color: C.onDarkLead })

    device(s, 'home', { x: 8.55, y: 0.72, h: 6.05 })
  } else {
    text(s, [
      { text: 'Describe the problem.  ', options: { color: C.onDarkHead } },
      { text: 'TrustCraft handles the search.', options: { color: C.brandLight } },
    ], { x: M.l, y: 0.9, w: 11.8, fontSize: 26, fontFace: F.reg, bold: true, charSpacing: -0.7 })

    PHASES.forEach(([n, title, blurb, shot], i) => {
      const col = M.l + i * 4.15
      text(s, n, { x: col, y: 1.72, w: 0.8, fontSize: 11, fontFace: F.semi, color: C.brandLight, charSpacing: 0.5 })
      text(s, title, { x: col + 0.42, y: 1.62, w: 3.1, fontSize: 20, fontFace: F.semi, color: C.onDarkHead })
      text(s, blurb, { x: col, y: 2.08, w: 3.55, ...T.cap, color: C.onDarkBody })
      device(s, shot, { x: col + 0.62, y: 3.0, h: 3.5 })
      if (i < 2) {
        s.addText('→', {
          x: col + 3.55, y: 4.5, w: 0.55, h: 0.5,
          fontSize: 22, fontFace: F.reg, color: C.onDarkFaint, align: 'center', valign: 'middle',
        })
      }
    })

    text(s, 'An intelligent home-services platform built around trust, not listings.', {
      x: M.l, y: 6.7, w: 10.5, fontSize: 14, fontFace: F.med, color: C.onDarkLead,
    })
  }

  s.addNotes(
    'THE REVEAL — 0:45\n' +
    'Beat 1: state the promise against the real home screen.\n' +
    'CLICK -> one screen becomes the three phases: describe, understand, discover.\n' +
    'Name each phase once. Do not walk the UI — the demo does that in five minutes.')
  return s
}

// ── Chapter 05 · The peak: three ways to describe one problem ────────────────

const MODES = [
  ['Text', '“My AC turns on but the room doesn’t get cold.”', 'home-ac'],
  ['Photo & video', 'Point the camera at the fault and send what you see.', 'camera'],
  ['Voice', '“My bathroom tap has been leaking since yesterday.”', 'problem-voice'],
]

function peak(p, converged) {
  const s = dark(p)
  footer(s, true)
  eyebrow(s, 'The way people actually ask for help', M.l, 0.6, C.onDarkFaint, 8)

  if (!converged) {
    text(s, 'Search the way humans\nactually ask for help.', {
      x: M.l, y: 0.92, w: 8.6, ...T.head, color: C.onDarkHead,
    })
    MODES.forEach(([label, example, shot], i) => {
      const col = M.l + i * 4.15
      const a = eyebrow(s, label, col, 2.5, C.brandLight, 3.4)
      text(s, example, { x: col, y: a + 0.06, w: 3.5, fontSize: 14, fontFace: F.med, color: C.onDarkLead, lineSpacing: 19 })
      device(s, shot, { x: col + 0.66, y: 3.48, h: 3.1 })
    })
  } else {
    text(s, 'One problem.\nThree ways to describe it.', {
      x: M.l, y: 0.92, w: 5.4, ...T.head, color: C.onDarkHead,
    })

    MODES.forEach(([label, , shot], i) => {
      const x = M.l + i * 1.62
      const d = device(s, shot, { x, y: 2.95, h: 2.6 })
      text(s, label, {
        x: d.cx - 0.8, y: d.bottom + 0.14, w: 1.6,
        fontSize: 10, fontFace: F.semi, color: C.onDarkFaint, align: 'center',
      })
    })

    // Three inputs converge on one structured problem. Extents must stay
    // positive — an upward line is a positive box with flipV, never a
    // negative height, which PowerPoint rejects outright.
    const JOIN = 4.25
    for (const y0 of [3.45, JOIN, 5.05]) {
      const dy = JOIN - y0
      s.addShape('line', {
        x: 5.35, y: Math.min(y0, JOIN), w: 1.15, h: Math.abs(dy),
        ...(dy < 0 ? { flipV: true } : {}),
        line: { color: '2E3D55', width: 1 },
      })
    }
    dot(s, { x: 6.55, y: JOIN, d: 0.13, color: C.brandLight })
    s.addShape('line', { x: 6.55, y: JOIN, w: 0.9, h: 0, line: { color: '2E3D55', width: 1 } })

    panel(s, { x: 7.45, y: JOIN - 0.62, w: 2.4, h: 1.24, fill: C.onDarkPanel, line: '243044' })
    text(s, 'PLUMBING REPAIR', { x: 7.62, y: JOIN - 0.44, w: 2.1, fontSize: 10, fontFace: F.semi, charSpacing: 1.2, color: C.brandLight })
    text(s, 'Leak · Kitchen sink', { x: 7.62, y: JOIN - 0.19, w: 2.1, fontSize: 14, fontFace: F.semi, color: C.onDarkHead })
    text(s, 'Location: Colombo 05', { x: 7.62, y: JOIN + 0.11, w: 2.1, fontSize: 10.5, color: C.onDarkBody })

    s.addText('→', { x: 9.9, y: JOIN - 0.2, w: 0.45, h: 0.4, fontSize: 20, color: C.onDarkFaint, align: 'center', valign: 'middle' })

    device(s, 'recommendations', { x: 10.42, y: 1.62, h: 4.9 })
    text(s, 'Three verified\nprofessionals, ranked', {
      x: 7.45, y: JOIN + 0.78, w: 2.7, fontSize: 12.5, fontFace: F.med, color: C.onDarkLead, lineSpacing: 17,
    })

    text(s, 'The customer describes a symptom. TrustCraft returns a decision.', {
      x: M.l, y: 6.42, w: 6.6, fontSize: 14, fontFace: F.med, color: C.onDarkLead,
    })
  }

  s.addNotes(
    'THE PEAK — part of 1:10\n' +
    'Beat 1: three ways in — typed, shown, spoken. All three are in the prototype.\n' +
    'CLICK -> they converge on one structured problem and one short ranked list.\n' +
    'This is the sentence to land: you don\'t need to know the service, just tell us what\'s wrong.')
  return s
}

function peakMotion(p, mode) {
  const s = dark(p)
  footer(s, true)
  eyebrow(s, 'Live capture from the prototype', M.l, 0.6, C.onDarkFaint, 8)

  const h1 = text(s, [
    { text: 'You don’t need to know\nthe service.\n', options: { color: C.onDarkHead } },
    { text: 'Just tell us what’s wrong.', options: { color: C.brandLight } },
  ], { x: M.l, y: 1.9, w: 6.0, ...T.head })

  text(s, 'Recorded from the running TrustCraft build — not a prototype animation.', {
    x: M.l, y: h1 + 0.4, w: 5.2, ...T.cap, color: C.onDarkBody,
  })

  const still = mode === 'static'
  const files = still
    ? ['describe-still.png', 'understand-still.png']
    : ['describe.gif', 'understand.gif']

  const c1 = clip(s, files[0], { x: 6.9, y: 0.7, h: 5.95 })
  const c2 = clip(s, files[1], { x: 9.95, y: 0.7, h: 5.95 })

  for (const [c, label] of [[c1, 'DESCRIBE'], [c2, 'UNDERSTAND']]) {
    text(s, label, {
      x: c.x - 0.3, y: c.bottom + 0.14, w: c.w + 0.6,
      fontSize: 9.5, fontFace: F.semi, charSpacing: 1.3, color: C.onDarkFaint, align: 'center',
    })
  }

  s.addNotes(
    'THE PEAK, MOTION — part of 1:10\n' +
    (still
      ? 'STATIC BACKUP: these are the closing frames of the two recorded clips.\n'
      : 'The two clips loop on their own. Say the line, then stop talking for two seconds and let them run.\n') +
    'Left: the customer types the fault. Right: it becomes a category and a ranked shortlist.\n' +
    'If a clip does not play, the point still lands — keep going, do not troubleshoot on stage.')
  return s
}

// ── Chapter 06 · Trust is the product ────────────────────────────────────────

// y is the point on the device the leader line touches, measured against the
// real screenshot rather than eyeballed.
const TRUST_NOTES = [
  [1.92, 'A score, not a star average',
   'Trust Score 94/100 next to a Verified badge — built from completed work, reliability and disputes, not stars alone.'],
  // Points at the foot of the stat card, which leaves the first annotation
  // room to breathe without shortening it into meaninglessness.
  [3.62, 'The evidence behind it',
   'Experience, works completed, distance, inspection fee and availability, all before you commit to anything.'],
  [5.95, 'Reviews tied to real jobs',
   'Every review comes from a job the platform tracked end to end, not an anonymous drive-by rating.'],
]

function trustIsProduct(p, second) {
  const s = light(p)
  footer(s, false)
  eyebrow(s, 'Trust is the product', M.l, 0.6, C.ink400)

  if (!second) {
    const h1 = text(s, [
      { text: 'Don’t just find someone.\n', options: { color: C.ink500 } },
      { text: 'Know why you’re\nchoosing them.', options: { color: C.ink900 } },
    ], { x: M.l, y: 0.95, w: 4.35, ...T.head })

    const d = device(s, 'pro-profile', { x: 4.9, y: 0.85, h: 6.0 })

    TRUST_NOTES.forEach(([y, title, body]) => {
      s.addShape('line', { x: d.right + 0.06, y, w: 0.6, h: 0, line: { color: C.ink300, width: 0.75 } })
      dot(s, { x: d.right + 0.06, y, d: 0.075 })
      const a = text(s, title.toUpperCase(), { x: d.right + 0.8, y: y - 0.26, w: 4.5, ...T.eyebrow, color: C.brand })
      text(s, body, { x: d.right + 0.8, y: a + 0.02, w: 4.5, ...T.note, color: C.ink700 })
    })

    const a = text(s, 'FIND SOMEONE', {
      x: M.l, y: h1 + 0.5, w: 3.6, fontSize: 13, fontFace: F.semi, charSpacing: 1.4, color: C.ink400,
    })
    const b = text(s, '↓', { x: M.l, y: a + 0.04, w: 0.4, fontSize: 16, color: C.ink300 })
    const c = text(s, 'CHOOSE CONFIDENTLY', {
      x: M.l, y: b + 0.04, w: 3.6, fontSize: 13, fontFace: F.semi, charSpacing: 1.4, color: C.brand,
    })
    rule(s, { x: M.l, y: c + 0.28, w: 3.4, color: C.ink200 })
    text(s, 'TrustCraft removes the uncertainty at the exact moment the customer has to choose.', {
      x: M.l, y: c + 0.44, w: 3.6, ...T.body, color: C.ink700,
    })
  } else {
    const h1 = text(s, 'And the score is earned, not claimed.', {
      x: M.l, y: 0.95, w: 8.8, fontSize: 26, fontFace: F.reg, bold: true, charSpacing: -0.7, color: C.ink900,
    })
    text(s,
      'The same number the customer reads is the number the professional is measured by — and they can see exactly what moves it.',
      { x: M.l, y: h1 + 0.1, w: 7.6, ...T.body, color: C.ink500 })

    const TOP = 2.68
    eyebrow(s, 'What the customer sees', 2.45, TOP - 0.34, C.ink400, 3.2)
    device(s, 'pro-profile', { x: 2.45, y: TOP, h: 3.9 })

    s.addText('→', { x: 5.85, y: 4.4, w: 0.7, h: 0.4, fontSize: 22, color: C.ink300, align: 'center', valign: 'middle' })

    eyebrow(s, 'What produces it', 7.0, TOP - 0.34, C.brand, 3.2)
    device(s, 'w-analyse', { x: 7.0, y: TOP, h: 3.9 })

    // The panel is sized from its own measured contents, not a guessed height.
    // Heights are resolved first so the panel can be drawn underneath the text —
    // PptxGenJS paints in insertion order.
    const PX = 9.3, PW = 3.41, PAD = 0.25, IW = PW - PAD * 2
    const QUOTE = '“Your score is built from\nverified evidence —\nnot stars alone.”'
    const NOTE = 'Shown to every professional inside the app.'
    const DRIVERS = 'Identity · Certification · On-time arrival ·\nQuotation accuracy · Completion evidence'

    const qo = { w: IW, fontSize: 15, fontFace: F.semi, lineSpacing: 21 }
    const no = { w: IW, ...T.cap }
    const dv = { w: IW, fontSize: 10.5, fontFace: F.med, lineSpacing: 15 }

    const qy = TOP + PAD
    const ny = qy + measureH(QUOTE, qo) + 0.04
    const ry = ny + measureH(NOTE, no) + 0.14
    const dy = ry + 0.12
    const panelBottom = dy + measureH(DRIVERS, dv) + PAD

    panel(s, { x: PX, y: TOP, w: PW, h: panelBottom - TOP, fill: C.white, line: C.ink200 })
    text(s, QUOTE, { x: PX + PAD, y: qy, ...qo, color: C.ink900 })
    text(s, NOTE, { x: PX + PAD, y: ny, ...no, color: C.ink500 })
    rule(s, { x: PX + PAD, y: ry, w: IW, color: C.ink200 })
    text(s, DRIVERS, { x: PX + PAD, y: dy, ...dv, color: C.ink700 })

    // The payoff runs full width along the foot, where it reads as the
    // chapter's closing line rather than a caption hanging off the panel.
    text(s, 'A rating tells you people were happy.   A score tells you why you should be.', {
      x: 2.35, y: 6.72, w: 10.36, fontSize: 16, fontFace: F.semi, color: C.ink900,
    })
  }

  s.addNotes(
    'TRUST IS THE PRODUCT — 1:00\n' +
    'Beat 1: this is the real professional profile. Point at the three annotations, do not read them.\n' +
    'The transformation is find someone -> choose confidently.\n' +
    'CLICK -> show that the professional is measured on the same evidence, and can see what moves it.\n' +
    'Land: a rating tells you people were happy; a score tells you why you should be.')
  return s
}

// ── Chapter 07 · UX by design ────────────────────────────────────────────────

const LAWS = [
  ['Fewer decisions', 'Hick’s Law',
   'Three ranked matches instead of a directory of forty, each with its match percentage shown so the ordering can be questioned.'],
  ['Clear primary actions', 'Fitts’s Law · Von Restorff Effect',
   'One full-width, high-contrast action per screen, always in thumb reach. Nothing else on the screen is blue.'],
  ['Natural input', 'Postel’s Law',
   'Text, photo, video or voice. The interface adapts to how a person describes a fault, instead of demanding a form.'],
]

function uxByDesign(p) {
  const s = light(p)
  footer(s, false)
  // The supporting line rides in the eyebrow so the headline gets a clean
  // two-line band of its own above the devices.
  eyebrow(s, 'UX by design  ·  Designed to minimise decisions, not maximise screens', M.l, 0.6, C.ink400, 9)
  text(s, 'Fewer decisions. Clearer actions.\nNatural input.', {
    x: M.l, y: 0.86, w: 9.4, ...T.head, color: C.ink900,
  })

  const home = device(s, 'home', { x: M.l + 0.1, y: 2.28, h: 4.35 })
  const recs = device(s, 'recommendations', { x: 2.9, y: 2.28, h: 4.35 })

  // Markers sit on the exact affordance each law is about.
  marker(s, 1, recs.cx, 3.47)                 // the three ranked matches
  marker(s, 2, home.cx, 4.32)                 // the single primary action
  marker(s, 3, home.cx, 3.87)                 // the text / photo / video / voice row

  let y = 2.24
  LAWS.forEach(([title, law, body], i) => {
    s.addText(String(i + 1), {
      x: 5.45, y, w: 0.3, h: 0.3, fontSize: 11, fontFace: F.semi,
      color: C.white, align: 'center', valign: 'middle',
      shape: 'ellipse', fill: { color: C.brand },
    })
    const a = text(s, title, { x: 5.92, y: y - 0.02, w: 4.4, fontSize: 19, fontFace: F.semi, color: C.ink900 })
    const b = text(s, law.toUpperCase(), { x: 5.92, y: a + 0.02, w: 6.5, ...T.eyebrow, color: C.brand })
    const c = text(s, body, { x: 5.92, y: b + 0.06, w: 6.6, fontSize: 14.5, lineSpacing: 20, color: C.ink700 })
    if (i < 2) rule(s, { x: 5.92, y: c + 0.12, w: 6.6, color: C.ink200 })
    y = c + 0.26
  })

  s.addNotes(
    'UX BY DESIGN — 0:45\n' +
    'This is a UI/UX competition, so show the principle in the product, not on a card.\n' +
    'Point at marker 1, then 2, then 3. One sentence each. Do not lecture.\n' +
    'Miller\'s Law is also at work: the nine-stage case timeline is chunked into one "what happens next" at a time.\n' +
    'BACKUP LINE (skip if behind): "The aesthetic-usability effect is doing real work here — a calm interface is read as a trustworthy one."')
  return s
}

// ── Chapter 08 · Market evidence ─────────────────────────────────────────────

function market(p) {
  const s = light(p)
  eyebrow(s, 'Market evidence', M.l, 0.6, C.ink400)
  text(s, 'The demand already exists.\nThe experience is what needs fixing.', {
    x: M.l, y: 0.9, w: 9.2, ...T.head, color: C.ink900,
  })

  const m = text(s, '76.1%', { x: M.l - 0.12, y: 2.5, w: 5.8, ...T.metric, color: C.brand })
  text(s,
    'of Sri Lanka’s craft and related trades workers — the plumbers, electricians, carpenters and masons this product serves — work in the informal sector.',
    { x: M.l, y: m + 0.1, w: 5.4, ...T.body, color: C.ink700 })

  // A proportion rule, not a chart.
  const barX = M.l, barY = 5.82, barW = 5.4
  s.addShape('rect', { x: barX, y: barY, w: barW, h: 0.16, fill: { color: C.ink200 }, line: { type: 'none' } })
  s.addShape('rect', { x: barX, y: barY, w: barW * 0.761, h: 0.16, fill: { color: C.brand }, line: { type: 'none' } })
  text(s, '841,588 informal', { x: barX, y: barY + 0.24, w: 3, fontSize: 10.5, fontFace: F.semi, color: C.brand })
  text(s, 'of 1,105,729', { x: barX + 3.0, y: barY + 0.24, w: 2.4, fontSize: 10.5, color: C.ink400, align: 'right' })

  vrule(s, { x: 6.9, y: 2.5, h: 3.8, color: C.ink200 })

  const facts = [
    ['No registration. No accounts. No record.',
     'The Department of Census and Statistics calls a worker informal when the business is unregistered, keeps no formal accounts and has fewer than ten regular employees. That is exactly the state a customer cannot check.'],
    ['21.6 million mobile broadband subscriptions',
     'In a country of 21.9 million people, at 131.5 mobile connections per 100 inhabitants. The channel for a mobile-first trust layer is already in every hand.'],
    ['Skill is not scarce. Proof is.',
     'TrustCraft does not have to create demand or supply. It has to make the supply legible.'],
  ]
  let y = 2.5
  for (const [title, body] of facts) {
    const a = text(s, title, { x: 7.4, y, w: 5.3, fontSize: 17, fontFace: F.semi, color: C.ink900, lineSpacing: 22 })
    const b = text(s, body, { x: 7.4, y: a + 0.04, w: 5.3, ...T.cap, color: C.ink700 })
    y = b + 0.26
  }

  cite(s,
    'Sources — Dept. of Census and Statistics, Sri Lanka Labour Force Survey Annual Report 2023, Tables 7.1 & 7.5 · ' +
    'TRCSL, Telecom Statistics Q1 2025.')

  s.addNotes(
    'MARKET EVIDENCE — 0:50\n' +
    'One number carries this slide: 76.1% of craft and trades workers are informal.\n' +
    'That is a government figure, and it is the trust gap stated as a statistic.\n' +
    'Second number: 21.6M mobile broadband subscriptions — the channel already exists.\n' +
    'Land: skill is not scarce in Sri Lanka; proof is.\n' +
    'BACKUP LINE (skip if behind): the same survey puts construction and utilities at 77.3% informal.')
  return s
}

// ── Chapter 09 · Competitive position ────────────────────────────────────────

const RIVALS = [
  // label, x 0..1 (category -> problem), y 0..1 (list -> evidence), muted?
  ['Facebook groups', 0.06, 0.07, true],
  ['Google search', 0.15, 0.19, true],
  ['Directory listings', 0.10, 0.32, true],
  ['Blu', 0.30, 0.45, false],
  ['Servixy', 0.36, 0.56, false],
  ['TaskForce.lk', 0.26, 0.63, false],
]

function competitors(p) {
  const s = light(p)
  eyebrow(s, 'Competitive position', M.l, 0.6, C.ink400)
  text(s, 'Sri Lanka already has service directories.\nNone of them start from the problem.', {
    x: M.l, y: 0.88, w: 11.6, ...T.head, color: C.ink900,
  })

  // Map frame
  const X0 = M.l + 0.45, Y0 = 2.62, MW = 5.9, MH = 3.4
  panel(s, { x: X0, y: Y0, w: MW, h: MH, fill: C.white, line: C.ink200 })
  for (let i = 1; i < 4; i++) {
    vrule(s, { x: X0 + (MW / 4) * i, y: Y0, h: MH, color: C.ink100 })
    rule(s, { x: X0, y: Y0 + (MH / 4) * i, w: MW, color: C.ink100 })
  }

  const px = v => X0 + v * MW
  const py = v => Y0 + MH - v * MH

  // Axis labels live outside the plot, so nothing sits on top of a data point.
  text(s, '↑  EVIDENCE YOU CAN ACT ON', { x: X0, y: Y0 - 0.3, w: 4.0, ...T.eyebrow, color: C.ink400 })
  text(s, '↓  A LIST OF NAMES', { x: X0, y: Y0 + MH + 0.12, w: 3.0, ...T.eyebrow, color: C.ink300 })
  text(s, 'BROWSE A CATEGORY', { x: X0, y: Y0 + MH + 0.42, w: 2.8, ...T.eyebrow, color: C.ink400 })
  text(s, 'START FROM THE PROBLEM  →', {
    x: X0 + MW - 3.3, y: Y0 + MH + 0.42, w: 3.3, ...T.eyebrow, color: C.ink400, align: 'right',
  })

  RIVALS.forEach(([label, vx, vy, muted]) => {
    const x = px(vx), y = py(vy)
    dot(s, { x, y, d: 0.11, color: muted ? C.ink300 : C.ink500 })
    text(s, label, {
      x: x + 0.11, y: y - 0.11, w: 2.1,
      fontSize: 11, fontFace: muted ? F.reg : F.semi, color: muted ? C.ink400 : C.ink700,
    })
  })

  const tx = px(0.82), ty = py(0.86)
  s.addShape('ellipse', { x: tx - 0.3, y: ty - 0.3, w: 0.6, h: 0.6, fill: { color: C.brandWash }, line: { type: 'none' } })
  dot(s, { x: tx, y: ty, d: 0.18, color: C.brand })
  text(s, 'TrustCraft', {
    x: tx - 1.75, y: ty - 0.48, w: 1.55, fontSize: 15, fontFace: F.semi, color: C.brand, align: 'right',
  })

  // Right column — the honest read
  const RX = 7.15, RW = 5.56
  const k = text(s, 'Existing platforms help you browse services.\nTrustCraft starts from the problem itself.', {
    x: RX, y: 2.32, w: RW, fontSize: 18, fontFace: F.semi, color: C.ink900, lineSpacing: 25,
  })
  rule(s, { x: RX, y: k + 0.14, w: RW, color: C.ink200 })

  const reads = [
    ['What they already do well',
     'Servixy and TaskForce.lk verify providers against NIC and hold payment in escrow; TaskForce also mediates disputes. Blu vets profiles and leans on reviews. None of this is a weakness to attack.'],
    ['Where the gap actually is',
     'All of them ask the customer to pick a category, or describe a job and name a budget, first. The person with a leaking sink knows neither.'],
    ['What TrustCraft adds',
     'Problem-first entry with photo, video and voice; a trust score with its drivers exposed; an interrogable match percentage.'],
  ]
  let y = k + 0.28
  for (const [t, b] of reads) {
    const a = text(s, t.toUpperCase(), { x: RX, y, w: RW, ...T.eyebrow, color: C.brand })
    const c = text(s, b, { x: RX, y: a + 0.02, w: RW, fontSize: 11.5, lineSpacing: 16, color: C.ink700 })
    y = c + 0.14
  }

  cite(s, 'Positions assessed from each platform’s own public site, 8 September 2026 — servixy.lk, taskforce.lk, blu.lk. Axes are qualitative, not measured market share.')

  s.addNotes(
    'COMPETITIVE POSITION — 0:45\n' +
    'Be fair out loud: Servixy and TaskForce do verify and do hold escrow. Say so.\n' +
    'The differentiator is the entry point, not the plumbing.\n' +
    'Land: they help you browse services; we start from the problem itself.\n' +
    'If asked for market share: we do not have it, and the axes are explicitly qualitative.')
  return s
}

// ── Chapter 10 · Business model ──────────────────────────────────────────────

function businessModel(p) {
  const s = dark(p)
  footer(s, true)
  eyebrow(s, 'Business model', M.l, 0.6, C.onDarkFaint)
  text(s, 'When providers grow, TrustCraft grows.', {
    x: M.l, y: 0.9, w: 11.4, ...T.head, color: C.onDarkHead,
  })

  // Left — what is already in the build
  text(s, 'IN THE PRODUCT TODAY', { x: M.l, y: 1.78, w: 3.2, ...T.eyebrow, color: C.brandLight })
  device(s, 'w-quote-money', { x: M.l, y: 2.12, h: 4.3 })

  const flows = [
    ['Customer pays', 'Rs 4,300', C.onDarkHead],
    ['TrustCraft fee (8%)', '– Rs 344', C.brandLight],
    ['Professional receives', 'Rs 3,956', C.success],
  ]
  let fy = 2.4
  for (const [l, v, col] of flows) {
    const a = text(s, l, { x: 2.85, y: fy, w: 2.4, fontSize: 12, color: C.onDarkBody })
    const b = text(s, v, { x: 2.85, y: a - 0.03, w: 2.4, fontSize: 20, fontFace: F.semi, color: col })
    fy = b + 0.22
  }
  text(s, 'The quotation builder already takes the platform fee out of every job, and shows the professional their payout before they send the price.', {
    x: 2.85, y: fy + 0.1, w: 2.6, ...T.cap, color: C.onDarkBody,
  })

  vrule(s, { x: 5.82, y: 1.78, h: 4.7, color: C.onDarkHair })

  // Right — what is proposed
  pill(s, 'PROPOSED', { x: 6.2, y: 1.72, w: 1.3, h: 0.28, fill: C.warningDeep, color: 'FFE9C2', size: 9, spc: 1.2 })
  text(s, 'Not yet built, and not yet earning.', {
    x: 7.65, y: 1.75, w: 5.0, fontSize: 11, color: C.onDarkFaint,
  })

  const tiers = [
    ['Customers', 'Free, always',
     'Describing a problem, seeing matches and reading trust evidence stays free. Charging the anxious side of a trust problem would break the product.'],
    ['Professional · Free tier', 'Basic presence',
     'A verified profile, discoverability, reputation and the full job lifecycle. Enough for a working professional to earn on the platform.'],
    ['Professional · Paid tier', 'Business tools',
     'Richer presence, lead management, portfolio and reputation tooling, stronger discovery. Priced only once real providers tell us what they would pay for.'],
  ]
  let y = 2.3
  tiers.forEach(([who, what, body], i) => {
    const a = text(s, who.toUpperCase(), { x: 6.2, y, w: 3.1, ...T.eyebrow, color: C.onDarkFaint })
    text(s, what, { x: 6.2, y: a + 0.04, w: 3.1, fontSize: 17, fontFace: F.semi, color: C.onDarkHead })
    const c = text(s, body, { x: 9.5, y: y - 0.02, w: 3.21, ...T.cap, color: C.onDarkBody })
    const next = Math.max(a + 0.42, c) + 0.22
    if (i < 2) rule(s, { x: 6.2, y: next - 0.11, w: 6.51, color: C.onDarkHair })
    y = next
  })

  text(s, 'Later: service facilitation, property-management and maintenance-network partnerships.', {
    x: 6.2, y: 6.5, w: 6.51, fontSize: 11.5, fontFace: F.med, color: C.onDarkFaint,
  })

  s.addNotes(
    'BUSINESS MODEL — 0:45\n' +
    'Left is real and in the build: an 8% platform fee, visible to the professional before they quote.\n' +
    'Right is explicitly PROPOSED — say the word. No revenue exists yet, no prices are set.\n' +
    'The exchange: the professional gets relevant customers and tools; we get recurring provider revenue.\n' +
    'Never charge the customer for asking for help — that is the point of the free side.')
  return s
}

// ── Chapter 11 · Scale ───────────────────────────────────────────────────────

const HORIZONS = [
  ['Now', 'Core home services,\nColombo',
   'Plumbers · Electricians · AC Repair · Cleaners · Carpenters · Painters · Appliance Repair — the categories already in the build.', 0.12],
  ['Next', 'More local-service\ncategories',
   'The same trust layer applied to any trade where a customer has to let a stranger into their home.', 0.22],
  ['Then', 'Beyond the\nhousehold',
   'Property managers, small businesses and maintenance networks that need the same proof at higher volume.', 0.34],
  ['Long term', 'The trust layer for\nlocal services',
   'A verified service record a professional owns and carries — the thing that does not exist today.', 0.48],
]

function scale(p) {
  const s = dark(p)
  footer(s, true)
  eyebrow(s, 'Scalability', M.l, 0.6, C.onDarkFaint)
  const h1 = text(s, 'Start focused. Scale the trust layer.', {
    x: M.l, y: 0.9, w: 9.5, ...T.head, color: C.onDarkHead,
  })
  text(s, 'The categories change. The problem — proving a stranger is worth letting in — does not.', {
    x: M.l, y: h1 + 0.08, w: 11.9, ...T.lead, fontSize: 18, color: C.onDarkLead,
  })

  const colW = 2.74, gap = 0.32
  HORIZONS.forEach(([label, title, body, band], i) => {
    const x = M.l + i * (colW + gap)
    const a = text(s, label.toUpperCase(), { x, y: 2.62, w: colW, ...T.eyebrow, color: i === 0 ? C.brandLight : C.onDarkFaint })
    const b = text(s, title, { x, y: a + 0.06, w: colW, fontSize: 19, fontFace: F.semi, color: C.onDarkHead, lineSpacing: 25 })
    text(s, body, { x, y: b + 0.14, w: colW, ...T.cap, color: C.onDarkBody })
    // A step that rises with each horizon, on a shared baseline, so growing
    // reach is felt rather than claimed.
    s.addShape('rect', {
      x, y: 6.42 - band, w: colW, h: band,
      fill: { color: i === 0 ? C.brand : ['1E3A8A', '1B3068', '17264E'][i - 1] }, line: { type: 'none' },
    })
    if (i > 0) vrule(s, { x: x - gap / 2, y: 2.62, h: 2.9, color: C.onDarkHair })
  })

  text(s, 'No dates, no user targets, no valuations — those would be invented. This is the order of the work.', {
    x: M.l, y: 6.62, w: 10.5, fontSize: 11.5, fontFace: F.med, color: C.onDarkFaint,
  })

  s.addNotes(
    'SCALE — 0:45\n' +
    'Now is real: those seven categories are in the build today.\n' +
    'Next / Then / Long term are direction, not forecast. Say that.\n' +
    'Land: the trust layer is the asset — a verified service record a professional owns and carries.\n' +
    'Deliberately no dates or user numbers; if a judge pushes, that honesty is the answer.')
  return s
}

// ── Chapter 12 · Closing ─────────────────────────────────────────────────────

function closing(p, stage) {
  const s = dark(p)

  if (stage === 0) {
    device(s, 'confirmation', { x: 8.35, y: 0.7, h: 6.3, transparency: 62 })
    text(s, 'When something goes wrong at home,\nfinding help shouldn’t be\nanother problem.', {
      x: M.l, y: 2.1, w: 7.5, ...T.head, color: C.onDarkHead,
    })
    s.addNotes(
      'CLOSING — 0:45\n' +
      'Slow down here. Say the line once, cleanly, and let it sit.\n' +
      'CLICK -> everything falls away except the name.')
    return s
  }

  s.addImage({ path: A.brand('lockup-white.png'), x: (W - 4.9) / 2, y: 2.42, w: 4.9, h: 4.9 * LOCKUP })
  text(s, 'Describe it.   Find them.   Trust the choice.', {
    x: 0, y: 3.72, w: W, fontSize: 24, fontFace: F.semi, charSpacing: 0.6,
    color: C.onDarkLead, align: 'center',
  })

  if (stage === 2) {
    rule(s, { x: (W - 1.6) / 2, y: 4.62, w: 1.6, color: '2E3D55' })
    text(s, 'Let us show you how it works.  →', {
      x: 0, y: 4.9, w: W, fontSize: 20, fontFace: F.med, color: C.brandLight, align: 'center',
    })
    text(s, `${TEAM}  ·  DHACK GRAND FINAL`.toUpperCase(), {
      x: 0, y: 6.55, w: W, fontSize: 10.5, fontFace: F.semi, charSpacing: 1.4,
      color: C.onDarkFaint, align: 'center',
    })
    s.addNotes(
      'HANDOFF — end of 0:45\n' +
      'Final CLICK. Say it and stop: "Let us show you how it works."\n' +
      'Do not add anything. Walk to the prototype. The five-minute demo starts on the home screen.')
  } else {
    s.addNotes(
      'CLOSING, WORDMARK\n' +
      'Three beats, evenly paced: Describe it. Find them. Trust the choice.\n' +
      'CLICK -> the handoff line.')
  }
  return s
}

// ── Deck ─────────────────────────────────────────────────────────────────────

/**
 * Builds every slide and returns the transition to attach to each, in order.
 * 'morph' animates a matched state into the next; 'fade' turns a page.
 */
export function build(pptx, mode = 'motion') {
  const t = []
  const add = (fn, kind) => { fn(); t.push(kind) }

  add(() => coldOpen(pptx, false), 'fade')
  add(() => coldOpen(pptx, true), 'morph')

  add(() => realProblem(pptx, false), 'fade')
  add(() => realProblem(pptx, true), 'morph')

  add(() => twoSides(pptx), 'fade')

  add(() => reveal(pptx, false), 'fade')
  add(() => reveal(pptx, true), 'morph')

  add(() => peak(pptx, false), 'fade')
  add(() => peak(pptx, true), 'morph')
  add(() => peakMotion(pptx, mode), 'fade')

  add(() => trustIsProduct(pptx, false), 'fade')
  add(() => trustIsProduct(pptx, true), 'morph')

  add(() => uxByDesign(pptx), 'fade')
  add(() => market(pptx), 'fade')
  add(() => competitors(pptx), 'fade')
  add(() => businessModel(pptx), 'fade')
  add(() => scale(pptx), 'fade')

  add(() => closing(pptx, 0), 'fade')
  add(() => closing(pptx, 1), 'morph')
  add(() => closing(pptx, 2), 'morph')

  return t
}
