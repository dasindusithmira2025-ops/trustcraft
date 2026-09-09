/**
 * Slides 16, 17 and 18 — the business-model chapter.
 *
 * Drawn with the deck's own primitives (kit.mjs): the same type scale,
 * hairlines, status tags and brand furniture as the other nineteen slides. No
 * card chrome, no borrowed styling — if these three ever look different from
 * slide 15 or 19, the fix belongs in kit.mjs, not here.
 *
 * The chapter answers three questions in order:
 *   16 — how TrustCraft makes money
 *   17 — why the economics can work
 *   18 — why the commercial architecture is broader than the publicly
 *        evidenced competitor models
 *
 * Two things are kept apart on purpose, everywhere in this file:
 *
 *   CURRENT BUILD    the product ships quotation logic at an 8% platform fee
 *                    (src/worker/data.ts → PLATFORM_FEE = 0.08). That is the
 *                    one revenue mechanism with code behind it.
 *   PROPOSED MODEL   Free 10% / Pro 8%, plus an optional activity-adjusted Pro
 *                    subscription capped at LKR 1,490. Designed and priced,
 *                    not live, and never described as if it were.
 *
 * Customers never pay a subscription, and search stays free. Pro never buys
 * trust — trust stays earned.
 *
 * Blocks stack from measured heights (`text()` returns the y its box ends at)
 * rather than guessed ones, because a box that is too short does not look
 * wrong in PowerPoint — it silently collides with whatever is underneath.
 *
 * Each slide builds click by click; business-motion.mjs turns the `reveal-*`
 * object names below into native PowerPoint animations.
 */
import { C, F, T, M, DEV } from './theme.mjs'
import { dark, text, eyebrow, device, rule, vrule, panel, dot, pill, footer, tag } from './kit.mjs'

/** Objects drawn inside a beat share a name prefix, one click per beat. */
function beat(s, name, draw) {
  const start = s._slideObjects.length
  const out = draw()
  s._slideObjects.slice(start).forEach((o, i) => {
    o.options ??= {}
    o.options.objectName = `reveal-${name}-${i}`
  })
  return out
}

function head(p, chapter, title, lead, titleW = 11.9) {
  const s = dark(p)
  footer(s, true)
  eyebrow(s, `Business model · ${chapter}`, M.l, 0.55, C.onDarkFaint)
  const h = text(s, title, {
    x: M.l, y: 0.83, w: titleW, fontSize: 26, fontFace: F.reg, bold: true,
    charSpacing: -0.9, lineSpacing: 32,
  })
  text(s, lead, { x: M.l, y: h + 0.02, w: 11.9, fontSize: 13.5, fontFace: F.med, color: C.onDarkBody })
  return s
}

const statement = (s, t, y) =>
  text(s, t, { x: M.l, y, w: 12.09, fontSize: 16.5, fontFace: F.semi, color: C.onDarkLead })

// One line, always — the footer lockup sits directly below it, so anything
// that wraps here lands on the brand mark.
const note = (s, t, y) =>
  text(s, t, { x: M.l, y, w: 12.09, fontSize: 10, fontFace: F.med, lineSpacing: 14, color: C.onDarkFaint })

const BR = '2E3D55'

// ── 16 · One completed job, four revenue engines ─────────────────────────────
// The real quotation screen is the hub. Four engines branch off it, and every
// one of them carries a PROPOSED tag — only the centre is built. That contrast
// is the slide's honesty, and it is drawn rather than written.

const ENGINES = [
  {
    x: M.l, y: 2.58, n: '01', name: 'Completed-job commission', tagKind: 'PROPOSED PRICING',
    kind: 'Primary engine',
    big: 'FREE  10%           PRO  8%',
    line: 'TrustCraft earns when completed work succeeds. Charged inside the quotation builder, before the price is sent.',
  },
  {
    x: M.l, y: 4.40, n: '02', name: 'TrustCraft Pro', tagKind: 'PROPOSED',
    kind: 'Recurring · optional',
    big: 'UP TO  LKR 1,490 / MONTH',
    line: '8% commission · ad-free · Demand Radar · AI Quote Copilot · Pro Supply Club.\nFree: “start earning.”   Pro: “grow your business.”',
  },
  {
    x: 8.35, y: 2.58, n: '03', name: 'Supply network', tagKind: 'NEXT · PROPOSED',
    kind: 'B2B engine',
    big: 'SPONSORED PLACEMENT  +  COMMERCE',
    line: 'Free: contextual sponsored supplier placements plus commerce revenue. Pro: ad-free, with an intentional Pro Supply Club. TrustCraft earns when purchases happen.',
  },
  {
    x: 8.35, y: 4.40, n: '04', name: 'TrustCraft for Business', tagKind: 'SCALE · PROPOSED',
    kind: 'B2B recurring engine',
    big: 'RECURRING MAINTENANCE CONTRACTS',
    line: 'Hotels · property managers · apartments · offices · restaurants · SMEs. Recurring B2B revenue, and recurring job demand that feeds every other engine.',
  },
]

export function businessEngines(p) {
  const s = head(p, '01',
    [
      { text: 'One completed job.\n', options: { color: C.onDarkHead } },
      { text: 'Four revenue engines.', options: { color: C.brandLight } },
    ],
    'The commission is the core. The network creates the upside.', 8.6)

  pill(s, 'PROPOSED COMMERCIAL MODEL', {
    x: 9.16, y: 0.58, w: 3.55, h: 0.34, line: C.warningDeep, color: 'FBBF24', size: 9, spc: 1,
  })

  // ── Centre — what is actually built, walled off from what is proposed ──
  const dcx = 6.667
  panel(s, { x: 4.98, y: 2.30, w: 3.37, h: 0.62, fill: '0B1526', line: '213048', radius: 0.06 })
  tag(s, 'CURRENT BUILD', dcx - 0.78, 2.34, 1.56)
  text(s, '8% quotation fee logic, demonstrated today', {
    x: 5.06, y: 2.66, w: 3.21, fontSize: 9, fontFace: F.med, color: C.onDarkBody, align: 'center',
  })

  const dh = 2.72
  const dw = dh * DEV.aspect
  const dy = 2.98
  const d = device(s, 'w-quote-money', { x: dcx - dw / 2, y: dy, h: dh })
  text(s, 'REAL QUOTATION SCREEN', {
    x: dcx - 1.7, y: d.bottom + 0.06, w: 3.4, fontSize: 9, fontFace: F.semi,
    charSpacing: 1, color: C.onDarkFaint, align: 'center',
  })

  // The job is the hub: a stub out of each side of the device to a spine dot,
  // then one branch per engine, drawn on that engine's own click.
  const cy = dy + dh / 2
  const lsx = d.x - 0.42
  const rsx = d.right + 0.42
  rule(s, { x: lsx, y: cy, w: d.x - lsx, color: BR })
  rule(s, { x: d.right, y: cy, w: rsx - d.right, color: BR })
  dot(s, { x: lsx, y: cy, d: 0.11, color: C.brandLight })
  dot(s, { x: rsx, y: cy, d: 0.11, color: C.brandLight })

  const TAG_W = 1.86
  ENGINES.forEach(N => {
    beat(s, N.n, () => {
      const left = N.x < dcx
      const spineX = left ? lsx : rsx
      const endX = left ? 5.30 : 8.06
      const anchorY = N.y + 0.60
      const w = left ? 4.42 : M.r - N.x

      vrule(s, { x: spineX, y: Math.min(cy, anchorY), h: Math.abs(anchorY - cy), color: BR })
      rule(s, { x: Math.min(spineX, endX), y: anchorY, w: Math.abs(spineX - endX), color: BR })
      dot(s, { x: endX, y: anchorY, d: 0.09, color: C.brandLight })

      text(s, N.n, { x: N.x, y: N.y + 0.03, w: 0.6, fontSize: 11, fontFace: F.semi, color: C.brandLight, charSpacing: 0.5 })
      const a = text(s, N.name, { x: N.x + 0.42, y: N.y, w: w - 0.42, fontSize: 16, fontFace: F.semi, color: C.onDarkHead })
      // The tag rides the small-caps line, so a long engine name never has to
      // share a line with it.
      tag(s, N.tagKind, N.x + w - TAG_W, a + 0.01, TAG_W)
      const b = text(s, N.kind, { x: N.x, y: a + 0.06, w: w - TAG_W - 0.2, ...T.eyebrow, color: C.onDarkFaint })
      const c = text(s, N.big, { x: N.x, y: b + 0.08, w, fontSize: 12.5, fontFace: F.semi, charSpacing: 0.3, color: C.brandLight })
      text(s, N.line, { x: N.x, y: c + 0.04, w, fontSize: 9.5, fontFace: F.reg, lineSpacing: 13, color: C.onDarkBody })
    })
  })

  beat(s, '05', () => statement(s,
    'We don’t depend on taking more from one job.    We create more value around every job.', 6.40))

  note(s, 'Proposed — Free 10%; Pro 8% + min(LKR 1,490, 2% of monthly job value), optional. Customers pay no subscription. Supplier and enterprise engines are not signed.', 6.72)
  s.addNotes(ENGINE_NOTES)
  return s
}

// ── 17 · Why the economics can work ──────────────────────────────────────────
// Left proves it for the professional, right sizes it for the platform. The
// left column is arithmetic from the proposed model; the right column is an
// illustrative scenario and is labelled as one *inside its own column*, so the
// label can never be read as covering the professional-side maths too.

// ── The proposed pricing rule, in one place ──
// Every number on this slide is *computed* from these three constants rather
// than typed, so a figure on the slide can never drift from a figure in the
// speaker notes or from the rule the presenter states out loud.
// `test-economics.mjs` pins the results.
export const FREE_RATE = 0.10
export const PRO_RATE = 0.08
export const PRO_CAP = 1490                       // LKR / month, the ceiling

export const freeCost = v => v * FREE_RATE
/** 8% plus an activity-adjusted subscription: 2% of the month's job value,
 *  capped at LKR 1,490. The 2% is exactly the Free/Pro gap, which is why Pro
 *  is never the more expensive choice. */
export const proCost = v => v * PRO_RATE + Math.min(PRO_CAP, v * (FREE_RATE - PRO_RATE))

// monthly job value, Free cost, Pro cost, what Pro retains
export const TIERS = [100_000, 200_000, 300_000].map(v => {
  const free = freeCost(v), pro = proCost(v)
  return [v, free, pro, free - pro]
})

/** The illustrative scale scenario. Not current revenue, not a forecast. */
export const SCENARIO = { freeCount: 700, freeJobs: 40_000, proCount: 300, proJobs: 75_000 }

const money = n => Math.round(n).toLocaleString('en-US')
const m1 = n => `LKR ${(n / 1e6).toFixed(1)}M`
const m2 = n => `LKR ${(n / 1e6).toFixed(2)}M`

const { freeCount, freeJobs, proCount, proJobs } = SCENARIO
const freeGmv = freeCount * freeJobs
const proGmv = proCount * proJobs
export const TOTAL_GMV = freeGmv + proGmv
const subMrr = proCount * PRO_CAP
export const CORE_MONTHLY = freeGmv * FREE_RATE + proGmv * PRO_RATE + subMrr
export const CORE_ANNUAL = CORE_MONTHLY * 12

const GMV = [
  [`${money(freeCount)} Free  ×  LKR ${money(freeJobs)} a month`, m1(freeGmv)],
  [`${money(proCount)} Pro  ×  LKR ${money(proJobs)} a month`, m1(proGmv)],
]
// Only the third line is recurring subscription MRR, and it says so.
const REVENUE = [
  [`Free commission  —  ${FREE_RATE * 100}% of ${m1(freeGmv)}`, m2(freeGmv * FREE_RATE)],
  [`Pro commission  —  ${PRO_RATE * 100}% of ${m1(proGmv)}`, m2(proGmv * PRO_RATE)],
  [`Pro subscription MRR  —  ${money(proCount)} × LKR ${money(PRO_CAP)}`, `LKR ${Math.round(subMrr / 1000)}K`],
]

export function businessEconomics(p) {
  const s = head(p, '02',
    [
      { text: 'When professionals earn more,\n', options: { color: C.onDarkHead } },
      { text: 'TrustCraft earns more.', options: { color: C.brandLight } },
    ],
    'One model. Two take rates. Aligned growth.')

  vrule(s, { x: 6.60, y: 2.24, h: 4.02, color: C.onDarkHair })

  // ── Left · professional economics ──
  const LX = M.l, LW = 5.62

  beat(s, '01', () => {
    text(s, '01 · Professional economics'.toUpperCase(), { x: LX, y: 2.26, w: LW, ...T.eyebrow, color: C.brandLight })
    text(s, 'Pro becomes more valuable as work grows.', {
      x: LX, y: 2.48, w: LW, fontSize: 17, fontFace: F.semi, color: C.onDarkHead,
    })
    text(s, [
      { text: 'FREE  ', options: { color: C.onDarkFaint } },
      { text: '10%', options: { color: C.onDarkLead } },
      { text: '          PRO  ', options: { color: C.onDarkFaint } },
      { text: '8% + subscription capped at LKR 1,490', options: { color: C.onDarkLead } },
    ], { x: LX, y: 2.84, w: LW, fontSize: 10.5, fontFace: F.med })
    rule(s, { x: LX, y: 3.10, w: LW, color: C.onDarkHair })
  })

  // The bar is the argument: its length is what Pro retains, and it widens
  // with the work. Scaled off the largest tier, so the growth is honest.
  const SCALE = 5.40 / TIERS[TIERS.length - 1][3]
  TIERS.forEach(([value, free, pro, keeps], i) => {
    const ty = 3.18 + i * 0.80
    beat(s, `0${i + 1}`, () => {
      text(s, `LKR ${money(value)} monthly job value`.toUpperCase(), {
        x: LX, y: ty, w: 3.6, fontSize: 9.5, fontFace: F.semi, charSpacing: 1.2, color: C.onDarkFaint,
      })
      text(s, [
        { text: 'Free  ', options: { color: C.onDarkFaint } },
        { text: money(free), options: { color: C.onDarkBody } },
        { text: '        Pro  ', options: { color: C.onDarkFaint } },
        { text: money(pro), options: { color: C.onDarkLead } },
      ], { x: LX, y: ty + 0.20, w: 3.5, fontSize: 12, fontFace: F.med })
      text(s, `+ ${money(keeps)}`, {
        x: LX + 3.5, y: ty + 0.17, w: 2.12, fontSize: 15, fontFace: F.semi,
        color: C.brandLight, align: 'right',
      })
      s.addShape('rect', {
        x: LX, y: ty + 0.52, w: keeps * SCALE, h: 0.14,
        fill: { color: i === TIERS.length - 1 ? C.brandLight : '1E3A8A' }, line: { type: 'none' },
      })
    })
  })

  beat(s, '04', () => {
    rule(s, { x: LX, y: 5.52, w: LW, color: C.onDarkHair })
    text(s, 'Annualised advantage at LKR 300,000 a month'.toUpperCase(), {
      x: LX, y: 5.58, w: LW, ...T.eyebrow, color: C.onDarkFaint,
    })
    text(s, `LKR ${money(TIERS[TIERS.length - 1][3] * 12)}`, { x: LX, y: 5.80, w: 2.3, fontSize: 22, fontFace: F.reg, bold: true, charSpacing: -0.6, color: C.onDarkHead })
    text(s, 'Free helps you earn.\nPro helps you grow.', {
      x: LX + 2.4, y: 5.80, w: 3.22, fontSize: 13, fontFace: F.semi, lineSpacing: 18, color: C.onDarkLead,
    })
  })

  // ── Right · platform economics ──
  const RX = 6.95, RW = 5.76
  const row = (label, value, y, size, color) => {
    text(s, label, { x: RX, y, w: 3.7, fontSize: size, fontFace: F.reg, color: C.onDarkBody })
    text(s, value, { x: RX + 3.7, y: y - 0.02, w: 2.06, fontSize: size + 2, fontFace: F.semi, color, align: 'right' })
  }

  beat(s, '05', () => {
    text(s, '02 · Platform economics'.toUpperCase(), { x: RX, y: 2.26, w: RW, ...T.eyebrow, color: C.brandLight })
    pill(s, 'ILLUSTRATIVE SCALE SCENARIO  ·  NOT REVENUE  ·  NOT A FORECAST', {
      x: RX, y: 2.52, w: RW, h: 0.30, line: C.warningDeep, color: 'FBBF24', size: 9, spc: 0.6,
    })
    text(s, '1,000 active professionals', { x: RX, y: 2.88, w: 3.4, fontSize: 14, fontFace: F.semi, color: C.onDarkHead })
    text(s, '700 FREE  ·  300 PRO', { x: RX + 3.4, y: 2.91, w: 2.36, fontSize: 10, fontFace: F.semi, charSpacing: 1, color: C.onDarkFaint, align: 'right' })
    rule(s, { x: RX, y: 3.16, w: RW, color: C.onDarkHair })
    GMV.forEach(([label, value], i) => row(label, value, 3.22 + i * 0.25, 10.5, C.onDarkLead))
    rule(s, { x: RX, y: 3.72, w: RW, color: C.onDarkHair })
    text(s, 'Total monthly job value (GMV)', { x: RX, y: 3.82, w: 3.7, fontSize: 11, fontFace: F.semi, color: C.brandLight })
    text(s, m1(TOTAL_GMV), { x: RX + 3.7, y: 3.78, w: 2.06, fontSize: 15, fontFace: F.reg, bold: true, color: C.onDarkHead, align: 'right' })
  })

  beat(s, '06', () => {
    rule(s, { x: RX, y: 4.14, w: RW, color: C.onDarkHair })
    REVENUE.forEach(([label, value], i) => row(label, value, 4.22 + i * 0.25, 10.5, C.onDarkLead))
    rule(s, { x: RX, y: 4.96, w: RW, color: C.onDarkHair })
    text(s, `≈ ${m2(CORE_MONTHLY)}`, { x: RX, y: 5.00, w: 2.55, fontSize: 24, fontFace: F.reg, bold: true, charSpacing: -0.9, color: C.onDarkHead })
    text(s, 'CORE MONTHLY\nPLATFORM REVENUE', {
      x: RX + 2.6, y: 5.04, w: 3.16, fontSize: 9.5, fontFace: F.semi, charSpacing: 1.2,
      lineSpacing: 12, color: C.onDarkFaint, align: 'right',
    })
  })

  // Only 447K of that is subscription MRR; the run rate is annualised, not
  // booked. Both distinctions are made in type, not just in the footnote.
  beat(s, '07', () => {
    text(s, `≈ ${m1(CORE_ANNUAL)}`, { x: RX, y: 5.44, w: 2.55, fontSize: 16, fontFace: F.reg, bold: true, charSpacing: -0.4, color: C.brandLight })
    text(s, 'CORE ANNUALISED\nREVENUE RUN RATE', {
      x: RX + 2.6, y: 5.42, w: 3.16, fontSize: 9.5, fontFace: F.semi, charSpacing: 1.2,
      lineSpacing: 12, color: C.onDarkFaint, align: 'right',
    })
  })

  beat(s, '08', () => {
    rule(s, { x: RX, y: 5.84, w: RW, color: C.onDarkHair })
    text(s, 'Not included in this scenario'.toUpperCase(), { x: RX, y: 5.90, w: RW, ...T.eyebrow, color: C.warning })
    text(s, 'Supplier advertising    ·    Supplier commerce    ·    TrustCraft for Business', {
      x: RX, y: 6.10, w: RW, fontSize: 11, fontFace: F.med, color: C.onDarkLead,
    })
    statement(s, 'The marketplace can work before the expansion engines even contribute.', 6.42)
  })

  note(s, 'Left: arithmetic from the proposed model, before hardware savings. Right: illustrative — not revenue, not a forecast; only the LKR 447K line is MRR.', 6.78)
  s.addNotes(ECONOMICS_NOTES)
  return s
}

// ── 18 · The public evidence map ─────────────────────────────────────────────
// The claim here is architectural, never comparative performance: TrustCraft
// has more ways to earn, not more revenue. Every competitor cell is either
// something the platform publishes about itself or an explicit "not publicly
// found" — which is never dressed up as a cross.

const COLUMNS = [
  ['01', 'Completed-job\nrevenue'],
  ['02', 'Professional\nrecurring revenue'],
  ['03', 'Supplier /\nad commerce'],
  ['04', 'Enterprise\nrecurring demand'],
]

// [name, aside, cells]. A cell is [text, evidenced?] — evidenced cells are
// something the platform states publicly; the rest are an absence of public
// evidence, which is not the same thing as a "no".
const NONE = ['not publicly found', 0]
const RIVALS = [
  ['TaskForce', '', [['Charges · rate not public', 1], NONE, NONE, NONE]],
  ['Blu', '', [['Transaction terms unclear', 0], ['Subscription-led', 1], NONE, NONE]],
  ['Findit.lk', '', [['No commission (stated)', 1], ['LKR 990 / month', 1], NONE, NONE]],
  ['Servixy', '', [['not publicly disclosed', 0], NONE, NONE, NONE]],
  ['Kaikili', '  international benchmark', [['11.25 – 15%', 1], ['No subscription (stated)', 1], NONE, NONE]],
]

const TC_CELLS = [
  ['10% Free  ·  8% Pro', '10/8 PROPOSED · 8% BUILT'],
  ['Optional  ≤ LKR 1,490', 'PROPOSED'],
  ['Ads + commerce', 'NEXT · PROPOSED'],
  ['Maintenance contracts', 'SCALE · PROPOSED'],
]

const ADVANTAGES = [
  ['01', 'Diversified', 'Four monetisation engines instead of a single fee.'],
  ['02', 'Aligned', 'Primary commission revenue grows only when successful work grows.'],
  ['03', 'Provider-oriented', 'Free 10%, Pro 8% — Pro lowers cost for the busiest professionals.'],
  ['04', 'Demand-compounding', 'Enterprise demand compounds into every other engine.'],
]

const COL = [3.30, 5.68, 8.06, 10.44], CW = 2.24

export function businessArchitecture(p) {
  const s = head(p, '03',
    [
      { text: 'Most models monetise one relationship.\n', options: { color: C.onDarkHead } },
      { text: 'TrustCraft monetises the network.', options: { color: C.brandLight } },
    ],
    'Assessed only on what each platform publicly discloses.')

  COLUMNS.forEach(([n, name], i) => {
    text(s, n, { x: COL[i], y: 2.20, w: CW, ...T.eyebrow, color: C.brandLight, align: 'center' })
    text(s, name, { x: COL[i], y: 2.42, w: CW, fontSize: 12.5, fontFace: F.semi, lineSpacing: 16, color: C.onDarkHead, align: 'center' })
  })
  rule(s, { x: M.l, y: 2.98, w: 12.06, color: '2B3D57' })

  beat(s, '01', () => {
    RIVALS.forEach(([name, aside, cells], i) => {
      const y = 3.06 + i * 0.35
      text(s, aside
        ? [{ text: name }, { text: aside, options: { fontSize: 9, color: C.onDarkFaint } }]
        : name,
      { x: M.l, y, w: 2.6, fontSize: 13, fontFace: F.reg, color: C.onDarkLead })
      cells.forEach(([t, evidenced], j) => {
        text(s, t, {
          x: COL[j], y: y + 0.02, w: CW,
          fontSize: evidenced ? 10.5 : 9.5,
          fontFace: evidenced ? F.semi : F.reg,
          color: evidenced ? C.brandLight : C.onDarkFaint,
          align: 'center',
        })
      })
    })
  })

  // TrustCraft sits on its own rail. The contrast with the rows above is the
  // whole point of the slide, so it lands on its own click.
  const tY = 4.88
  beat(s, '02', () => {
    s.addShape('rect', { x: M.l - 0.14, y: tY, w: 12.34, h: 0.72, fill: { color: '10233F' }, line: { type: 'none' } })
    dot(s, { x: M.l + 0.06, y: tY + 0.36, d: 0.12, color: C.brandLight })
    text(s, 'TrustCraft', { x: M.l + 0.26, y: tY + 0.19, w: 2.4, fontSize: 17, fontFace: F.semi, color: C.onDarkHead })
    TC_CELLS.forEach(([value, status], j) => {
      text(s, value, { x: COL[j], y: tY + 0.09, w: CW, fontSize: 11.5, fontFace: F.semi, color: C.onDarkHead, align: 'center' })
      text(s, status, {
        x: COL[j], y: tY + 0.37, w: CW, fontSize: 9, fontFace: F.semi, charSpacing: 0.6,
        color: 'FBBF24', align: 'center',
      })
    })
  })

  beat(s, '03', () => {
    rule(s, { x: M.l, y: 5.74, w: 12.06, color: C.onDarkHair })
    ADVANTAGES.forEach(([n, title, body], i) => {
      const x = M.l + i * 3.00
      text(s, n, { x, y: 5.82, w: 0.5, fontSize: 10.5, fontFace: F.semi, color: C.brandLight, charSpacing: 0.5 })
      text(s, title.toUpperCase(), { x: x + 0.38, y: 5.82, w: 2.5, fontSize: 10.5, fontFace: F.semi, charSpacing: 1, color: C.onDarkHead })
      text(s, body, { x, y: 6.04, w: 2.85, fontSize: 9.5, fontFace: F.reg, lineSpacing: 13, color: C.onDarkBody })
    })
  })

  beat(s, '04', () => statement(s,
    'Lower dependence on any one revenue stream.    More ways for every successful job to compound.', 6.46))

  note(s, 'Competitor cells reflect public information only, checked 10 Sep 2026. “Not publicly found” is not proof of absence. Supplier and enterprise engines are proposed.', 6.80)
  s.addNotes(ARCHITECTURE_NOTES)
  return s
}

// ── Speaker notes ────────────────────────────────────────────────────────────

const ENGINE_NOTES = 'CLICK CUES: 1 completed-job commission; 2 TrustCraft Pro; 3 supply network; 4 TrustCraft for Business; 5 takeaway.\n' +
  'BUSINESS MODEL · 01 — ~0:38\n' +
  'Start at the centre. That is the real quotation screen, and the 8% fee logic in it is what the prototype demonstrates today. Say CURRENT BUILD out loud — everything around it is a proposed commercial model, and it is tagged that way.\n' +
  'ONE, the completed-job commission. Proposed: Free pays 10%, Pro pays 8%. We earn when the work succeeds, and the fee is applied inside the quotation builder before the price reaches the customer.\n' +
  'TWO, TrustCraft Pro. Optional, never required, up to LKR 1,490 a month and activity-adjusted below that. Free is “start earning”, Pro is “grow your business”.\n' +
  'THREE, the supply network. A job creates material demand. Free professionals see clearly-labelled sponsored supplier placements; Pro gets an ad-free dashboard and an intentional Supply Club. We earn when purchases happen. No supplier deals are signed — this is next.\n' +
  'FOUR, TrustCraft for Business. Hotels, property managers, apartments, offices, restaurants, SMEs. Recurring B2B revenue and recurring demand back into jobs. This is scale, and it is proposed.\n' +
  'Customers never pay a subscription and search stays free. Land: we don’t depend on taking more from one job — we create more value around every job.'

const ECONOMICS_NOTES = 'CLICK CUES: 1 professional economics + 100K; 2 200K; 3 300K; 4 annualised; 5 scale scenario + GMV; 6 platform revenue; 7 run rate; 8 upside + takeaway.\n' +
  'BUSINESS MODEL · 02 — ~0:44\n' +
  'LEFT, the professional. Free is a flat 10%. Pro is 8% plus an activity-adjusted subscription capped at LKR 1,490. Because the gap between 10 and 8 is exactly the 2% the subscription charges until it caps, Pro is never the more expensive choice — and the moment it caps, the advantage keeps widening.\n' +
  'At 100,000 a month the Pro keeps 510 more. At 200,000, 2,510. At 300,000, 4,510 — 54,120 a year, before hardware savings and before valuing the Pro tools at all. That is the widening bar.\n' +
  'RIGHT, and say this label out loud: ILLUSTRATIVE SCALE SCENARIO. Not current revenue, not a forecast. A thousand active professionals, 700 Free and 300 Pro, completing about 50.5M of job value a month.\n' +
  'Free commission 2.80M, Pro commission 1.80M, Pro subscription MRR 447K. Core monthly platform revenue about 5.05M — and only the 447K is recurring subscription MRR; I want that precise. Annualised, roughly 60.6M as a run rate.\n' +
  'None of that includes supplier advertising, supplier commerce or TrustCraft for Business. Land: the marketplace can work before the expansion engines even contribute.\n' +
  '[CUT IF BEHIND] give the 300,000 tier only, then jump straight to 5.05M and the upside line.'

const ARCHITECTURE_NOTES = 'CLICK CUES: 1 competitor rows; 2 the TrustCraft rail; 3 the four structural advantages; 4 takeaway. Say “proposed” out loud — do not let it read as revenue.\n' +
  'BUSINESS MODEL · 03 — ~0:38\n' +
  'The evidence map, from public information only. TaskForce charges a fee on completed jobs; the rate is not public. Blu is subscription-led publicly and its transaction economics are not clear. Findit.lk publishes no commission ever — professionals keep 100% — and charges LKR 990 a month instead. Servixy does not disclose provider monetisation. Kaikili publishes 11.25 to 15% with no subscription, and it is here only as an international benchmark.\n' +
  'Where we found nothing public we wrote “not publicly found”. That is not proof a competitor does not do it privately, and I am not going to claim it is.\n' +
  'Then the TrustCraft rail. The 8% quotation logic is built. The 10/8 split, Pro, the supply network and TrustCraft for Business are proposed, and they are labelled that way on the slide.\n' +
  'Four structural advantages: DIVERSIFIED — four engines, not one. ALIGNED — the primary revenue only grows when successful work grows. PROVIDER-ORIENTED — Pro actually lowers the transaction cost for the professionals doing the most work. DEMAND-COMPOUNDING — enterprise contracts feed jobs, which feed commission, which feeds Pro adoption, which feeds supplier commerce.\n' +
  'To be clear about what we are NOT claiming: not that we out-earn anyone, and not that we have market share. The claim is architectural.\n' +
  'Land: lower dependence on any one revenue stream, more ways for every successful job to compound.\n' +
  '[CUT IF BEHIND] skip the competitor-by-competitor read; go straight to the rail and the four advantages.'
