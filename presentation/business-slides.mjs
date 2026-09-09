import { A, C, F } from './theme.mjs'
import { measureH } from './measure.mjs'

const mint = '5EEAD4', muted = 'A5B4CB', blue = '60A5FA'
const tx = (s, t, x, y, w, size = 14, color = C.white, extra = {}) => {
  const o = { x, y, w, fontSize: size, color, fontFace: F.reg, valign: 'top', ...extra }
  s.addText(t, { ...o, h: measureH(t, o) })
}
const box = (s, x, y, w, h, fill = '101D32', line = '263A56') => s.addShape('roundRect', {
  x, y, w, h, radius: 0.12, rectRadius: 0.12, fill: { color: fill }, line: { color: line, width: 0.8 },
})
const line = (s, x, y, w, h = 0, color = '263A56', { flipV, ...extra } = {}) => s.addShape('line', {
  x, y, w, h, flipV, line: { color, width: 1.4, ...extra },
})
const label = (s, t, x, y, w, color = muted) => tx(s, t, x, y, w, 10, color, { fontFace: F.semi, charSpacing: 1.1 })
const bold = { bold: true, charSpacing: -0.8 }

// Prefixes are consumed by business-motion.mjs for native PowerPoint builds.
function beat(s, name, draw) {
  const start = s._slideObjects.length
  draw()
  s._slideObjects.slice(start).forEach((o, i) => {
    o.options ??= {}
    o.options.objectName = `reveal-${name}-${i}`
  })
}
function base(p, chapter, title, accent, mode) {
  const s = p.addSlide()
  s.background = { path: A.brand('bg-dark.png') }
  label(s, `BUSINESS MODEL  /  ${chapter}`, 0.62, 0.43, 8, blue)
  tx(s, title, 0.62, 0.85, 12, 32, C.white, bold)
  tx(s, accent, 0.62, 1.38, 12, 32, blue, bold)
  s.addImage({ path: A.brand('mark.png'), x: 12.12, y: 0.5, w: 0.43, h: 0.43 })
  tx(s, chapter === '02' ? '17 / 22' : '18 / 22', 11.8, 7.04, 0.9, 9, muted, { align: 'right' })
  return s
}

export function businessEconomics(p, mode) {
  const s = base(p, '02', 'More work. More take-home.', 'A business model that grows together.', mode)
  box(s, 0.62, 2.24, 6.0, 4.24)
  label(s, '01  /  THE PROFESSIONAL WINS', 0.84, 2.43, 5.5, mint)
  tx(s, 'Extra cash kept with Pro', 0.84, 2.77, 5.5, 22, C.white, bold)
  tx(s, 'Monthly job value', 0.84, 3.28, 1.9, 11, muted)
  tx(s, 'Monthly saving', 4.64, 3.28, 1.62, 11, mint, { align: 'right' })
  beat(s, '01', () => {
    const rows = [ ['100K', '510', 0.28], ['200K', '2,510', 1.38], ['300K', '4,510', 2.48] ]
    rows.forEach(([v, saving, width], i) => {
      const y = 3.76 + i * 0.58
      tx(s, `LKR ${v}`, 0.84, y - 0.06, 1.52, 15, C.white, { fontFace: F.semi })
      box(s, 2.46, y, 2.48, 0.23, '1C304A', '1C304A')
      box(s, 2.46, y, width, 0.23, i === 2 ? mint : blue, i === 2 ? mint : blue)
      tx(s, `+ ${saving}`, 5.02, y - 0.08, 1.2, 17, i === 2 ? mint : C.white, { ...bold, align: 'right' })
    })
    line(s, 0.92, 5.44, 5.38)
    tx(s, 'LKR 54,120', 0.84, 5.58, 3.5, 32, mint, bold)
    tx(s, 'extra per year\nat LKR 300K / month', 4.0, 5.7, 2.25, 12, muted)
  })
  box(s, 6.84, 2.24, 5.87, 4.24, '102443', '28538B')
  label(s, '02  /  THE PLATFORM GROWS', 7.07, 2.43, 5.25, blue)
  tx(s, '1,000 active professionals', 7.07, 2.81, 5.18, 21, C.white, bold)
  tx(s, '700 Free  +  300 Pro', 7.07, 3.23, 5.15, 13, muted)
  beat(s, '02', () => {
    tx(s, 'LKR 50.5M', 7.07, 3.72, 4.9, 30, C.white, bold)
    label(s, 'MONTHLY JOB VALUE (GMV)', 7.07, 4.25, 4.9)
    line(s, 7.18, 4.82, 0, 0.38, blue, { endArrowType: 'triangle' })
    tx(s, 'LKR 5.05M', 7.49, 4.65, 4.83, 39, blue, bold)
    label(s, 'CORE MONTHLY REVENUE, APPROX.', 7.51, 5.36, 4.8)
    tx(s, 'LKR 4.60M job fees  +  LKR 447K Pro MRR', 7.07, 5.92, 5.2, 12, muted)
  })
  box(s, 8.49, 0.43, 3.38, 0.35, '2C2415', '78582B')
    tx(s, 'ILLUSTRATIVE · NOT A FORECAST', 8.56, 0.46, 3.23, 9, 'FCD34D', { fontFace: F.semi })
  beat(s, '03', () => {
    // Final takeaway lands in the same place as the slide 18 conclusion.
    tx(s, 'Shared upside. Before supplier commerce or enterprise revenue.', 0.62, 6.61, 12, 16, C.white, { fontFace: F.semi })
  })
  // Assumptions stay visible during every build state.
  tx(s, 'Proposed: Free 10%; Pro 8% + min(LKR 1,490, 2% of monthly job value). Cash savings begin above LKR 74,500/month.', 0.62, 7.03, 11.05, 9, muted)
  s.addNotes(ECONOMICS_NOTES)
  return s
}

export function businessArchitecture(p, mode) {
  const s = base(p, '03', 'One successful job.', 'Four connected revenue engines.', mode)
  // An orbital network replaces the dense full-slide comparison table.
  const cx = 3.47, cy = 4.35
  s.addShape('ellipse', { x: 1.84, y: 2.72, w: 3.26, h: 3.26, fill: { transparency: 100, color: C.brand }, line: { color: '244B79', width: 1.5, dash: 'dash' } })
  s.addShape('ellipse', { x: 2.33, y: 3.21, w: 2.28, h: 2.28, fill: { color: '123467' }, line: { color: blue, width: 1.5 } })
  s.addImage({ path: A.brand('mark.png'), x: cx - 0.25, y: 3.53, w: 0.5, h: 0.5 })
  tx(s, 'A job\nwell done.', 2.43, 4.07, 2.08, 24, C.white, { ...bold, align: 'center', lineSpacing: 26 })
  const card = (n, title, detail, x, y, color) => {
    box(s, x, y, 2.68, 1.16, '101E34', color)
    label(s, n, x + 0.14, y + 0.09, 2.38, color)
    tx(s, title, x + 0.14, y + 0.37, 2.38, 17, C.white, bold)
    tx(s, detail, x + 0.14, y + 0.77, 2.4, 10, muted)
  }
  beat(s, '01', () => {
    card('01 / COMPLETED JOBS', 'Earn on success', '10% Free · 8% Pro — proposed', 0.62, 2.25, blue)
    card('02 / TRUSTCRAFT PRO', 'Recurring value', 'Optional · capped at LKR 1,490', 3.62, 2.25, blue)
    line(s, 2.0, 3.42, 0.48, 0.4, blue)
    line(s, 4.47, 3.42, 0.48, 0.4, blue, { flipV: true })
    card('03 / SUPPLY · PROPOSED', 'Materials follow', 'Supplier ads + commerce', 0.62, 5.46, mint)
    card('04 / B2B · PROPOSED', 'Demand returns', 'Enterprise maintenance', 3.62, 5.46, mint)
    line(s, 2.0, 5.02, 0.48, 0.42, mint, { flipV: true })
    line(s, 4.47, 5.02, 0.48, 0.42, mint)
  })
  box(s, 6.65, 2.25, 6.06, 4.37)
  label(s, 'THE MODEL AT A GLANCE', 6.88, 2.44, 5.6, blue)
  tx(s, 'Compare the architecture', 6.88, 2.79, 5.6, 21, C.white, bold)
  const colX = [8.66, 9.65, 10.64, 11.63]
  ;['JOBS', 'PRO', 'SUPPLY', 'B2B'].forEach((t, i) => tx(s, t, colX[i], 3.34, 0.95, 9, muted, { align: 'center', fontFace: F.semi }))
  beat(s, '02', () => {
    const rows = [ ['TaskForce', [1, 0, 0, 0]], ['Blu', [1, 1, 0, 0]], ['Grab Me', [-1, 0, 0, 0]], ['Servixy', [0, 0, 0, 0]], ['Kaikili', [1, -1, 0, 0]], ['TrustCraft', [2, 2, 2, 2]] ]
    rows.forEach(([name, flags], i) => {
      const y = 3.8 + i * 0.34
      if (i === 5) box(s, 6.88, y - 0.01, 5.58, 0.35, '19395C', '285889')
      tx(s, name, 6.96, y, 1.7, 12, i === 5 ? blue : C.white, { fontFace: F.semi })
      flags.forEach((f, j) => tx(s, f === 1 ? '●' : f === 2 ? 'P' : f === -1 ? '0' : '—', colX[j], y, 0.95, 12, f === 1 ? blue : f === 2 ? mint : muted, { align: 'center', fontFace: F.semi }))
    })
    tx(s, '● Public evidence    P Proposed    0 Explicitly none\n— Not found / disclosed; does not mean absent.', 6.91, 6.01, 5.52, 9, muted, { lineSpacing: 12 })
  })
  beat(s, '03', () => {
    tx(s, 'More value around each job. More reasons to stay in the network.', 0.62, 6.68, 12.1, 16, C.white, { fontFace: F.semi })
  })
  tx(s, '8% job fee is built; the full four-engine architecture is proposed. Competitor evidence and detailed rates: speaker notes + Presentation Sources.', 0.62, 7.03, 11.05, 9, muted)
  s.addNotes(ARCHITECTURE_NOTES)
  return s
}

// The existing evidence and calculation detail are preserved in speaker notes.
const ECONOMICS_NOTES = 'CLICK CUES: 1 professional savings; 2 platform economics; 3 shared upside. All scale figures are illustrative.\n' + 'BUSINESS MODEL · 02 — ~0:45\n' +
    'LEFT, the professional. Free is a flat 10%. Pro is 8% plus an activity-adjusted subscription capped at LKR 1,490. Because the gap between 10% and 8% is exactly 2%, and the subscription is 2% until it caps, a Pro professional is never worse off — and above ~LKR 74,500 of monthly job value Pro starts creating real cash savings. At 100k / 200k / 300k a month the Pro keeps 510 / 2,510 / 4,510 more. Annualised at the 300k level that is LKR 54,120 — before any supplier savings and before valuing the tools.\n' +
    'RIGHT, the platform — clearly an ILLUSTRATIVE scale scenario, not revenue and not a forecast. 1,000 pros, 700 free / 300 Pro, gives about LKR 50.5M monthly GMV, and roughly LKR 5.05M core monthly platform revenue: 2.80M + 1.80M in completed-job fees plus 447K of Pro subscription MRR. Only that 447K is subscription MRR. Annualised, about LKR 60.6M — and that is before supplier advertising, supply commerce or TrustCraft for Business contribute anything.\n' +
    'Land: the marketplace can work before the expansion engines even contribute.'
const ARCHITECTURE_NOTES = 'CLICK CUES: 1 four engines; 2 evidence map; 3 network takeaway. P means proposed architecture, not proven revenue.\n' + 'BUSINESS MODEL · 03 — ~0:40\n' +
    'The matrix, honestly built. TaskForce charges a completed-job service fee, rate not public. Blu is subscription-led and its terms also mention a platform commission on online-paid bookings. Grab Me publicly runs a zero-commission model. Servixy does not disclose provider monetisation. Kaikili publishes an 11.25–15% commission with no subscription — a useful international benchmark. Where we found nothing public we wrote “not publicly found”, and that is not proof a competitor does not do it privately.\n' +
    'TrustCraft is the only row with something in every column: completed-job fee, optional recurring Pro, supplier commerce and enterprise recurring demand — the last two flagged proposed.\n' +
    'Four pillars: diversified, aligned, provider-oriented, demand-compounding. Angi shows multi-engine home-service monetisation works at global scale — that validates the concept, nothing more.\n' +
    'Land: lower dependence on any one revenue stream; more ways for every successful job to compound.\n' +
    '[CUT IF BEHIND] drop the pillar-by-pillar read; just say “TrustCraft is the only architecture with revenue in every column, and the completed-job fee is built and the wider architecture is proposed.”'
