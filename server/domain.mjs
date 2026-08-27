// TrustCraft domain logic — analysis, trust scoring, matching, quoting.
// Pure functions, no I/O, so they can be tested directly (see server/test.mjs).

// ── Problem analysis ────────────────────────────────────────────────────────
// Keyword classifier. Deterministic and inspectable — no model call in the demo.

const RULES = [
  {
    category: 'plumbing',
    label: 'Plumbing',
    keywords: ['leak', 'leaking', 'water', 'sink', 'tap', 'faucet', 'pipe', 'drain',
      'toilet', 'shower', 'flush', 'burst', 'damp', 'drip', 'dripping', 'plumb'],
    objects: {
      sink: 'sink connection', tap: 'tap fitting', faucet: 'tap fitting',
      toilet: 'toilet cistern', shower: 'shower valve', pipe: 'supply pipe', drain: 'drain line',
    },
    title: o => `Possible leak near ${o || 'a water fitting'}`,
    safety: 'Turn off the local water valve beneath the fixture if safely accessible.',
    disclaimer: 'This analysis is AI-guided only. A qualified plumber must diagnose and repair the issue.',
    question: { text: 'Does the leak continue when the tap is fully closed?', options: ['Yes', 'No', 'Not sure'] },
    answerEvidence: { Yes: 'leak when tap off', No: 'leak only when tap open', 'Not sure': 'leak timing unconfirmed' },
  },
  {
    category: 'electrical',
    label: 'Electrical',
    keywords: ['power', 'socket', 'switch', 'wire', 'wiring', 'electric', 'electrical', 'breaker',
      'fuse', 'spark', 'shock', 'light', 'bulb', 'tripping', 'outlet'],
    objects: { socket: 'a wall socket', switch: 'a light switch', breaker: 'the distribution board', light: 'a light fitting' },
    title: o => `Power fault at ${o || 'a fixed electrical point'}`,
    safety: 'Do not touch the fitting. Switch off the circuit at the breaker before anyone inspects it.',
    disclaimer: 'This analysis is AI-guided only. A qualified electrician must test and repair the circuit.',
    question: { text: 'Has the circuit breaker tripped?', options: ['Yes', 'No', 'Not sure'] },
    answerEvidence: { Yes: 'breaker tripped', No: 'breaker holding', 'Not sure': 'breaker state unknown' },
  },
  {
    category: 'aircon',
    label: 'Air Conditioning',
    keywords: ['ac', 'aircon', 'air conditioner', 'air conditioning', 'cooling', 'cool',
      'compressor', 'refrigerant', 'inverter', 'condenser'],
    objects: { indoor: 'the indoor unit', outdoor: 'the outdoor unit', split: 'the indoor unit' },
    title: o => `Cooling performance fault in ${o || 'the AC unit'}`,
    safety: 'Switch the unit off at the wall to avoid further compressor strain.',
    disclaimer: 'This analysis is AI-guided only. A qualified AC technician must measure pressures and diagnose the fault.',
    question: { text: 'Is the outdoor unit running?', options: ['Yes', 'No', 'Not sure'] },
    answerEvidence: { Yes: 'outdoor unit running', No: 'outdoor unit not running', 'Not sure': 'outdoor unit unchecked' },
  },
  {
    category: 'appliance',
    label: 'Appliance Repair',
    keywords: ['fridge', 'refrigerator', 'washing machine', 'washer', 'dryer', 'oven', 'microwave',
      'dishwasher', 'appliance', 'motor', 'grinding'],
    objects: { fridge: 'the refrigerator', 'washing machine': 'the washing machine', oven: 'the oven', dryer: 'the dryer' },
    title: o => `Mechanical fault in ${o || 'a household appliance'}`,
    safety: 'Unplug the appliance at the wall before anyone opens it.',
    disclaimer: 'This analysis is AI-guided only. A qualified technician must open and diagnose the appliance.',
    question: { text: 'Does it still power on at all?', options: ['Yes', 'No', 'Not sure'] },
    answerEvidence: { Yes: 'powers on', No: 'no power at all', 'Not sure': 'power state unclear' },
  },
  {
    category: 'carpentry',
    label: 'Carpentry',
    keywords: ['door', 'window', 'cupboard', 'cabinet', 'hinge', 'wood', 'wooden', 'frame',
      'lock', 'drawer', 'shelf', 'termite'],
    objects: { door: 'a door frame', window: 'a window frame', cupboard: 'a cabinet', drawer: 'a drawer runner' },
    title: o => `Fitting damage on ${o || 'a wooden fixture'}`,
    safety: 'Avoid forcing the fitting further — it can widen the damage.',
    disclaimer: 'This analysis is AI-guided only. A qualified carpenter must assess the fitting.',
    question: { text: 'Is it still usable right now?', options: ['Yes', 'No', 'Not sure'] },
    answerEvidence: { Yes: 'still usable', No: 'not usable', 'Not sure': 'usability unclear' },
  },
]

const URGENT_HIGH = ['spark', 'sparking', 'burning', 'smoke', 'shock', 'gas', 'flood', 'flooding', 'burst', 'fire']
const URGENT_MOD = ['leak', 'leaking', 'drip', 'dripping', 'not working', 'stopped', 'noise', 'grinding', 'worse']

const FALLBACK = {
  category: 'general', label: 'General Repair',
  keywords: [], objects: {},
  title: () => 'General maintenance issue',
  safety: 'Keep the area clear until a professional has assessed it.',
  disclaimer: 'This analysis is AI-guided only. A qualified professional must assess the issue in person.',
  question: { text: 'Is the problem getting worse?', options: ['Yes', 'No', 'Not sure'] },
  answerEvidence: { Yes: 'worsening', No: 'stable', 'Not sure': 'trend unknown' },
}

const countHits = (text, words) => words.filter(w => text.includes(w)).length

export function analyse(text, { photos = 0 } = {}) {
  const t = (text || '').toLowerCase()

  let best = FALLBACK, bestHits = 0
  for (const rule of RULES) {
    const hits = countHits(t, rule.keywords)
    if (hits > bestHits) { best = rule; bestHits = hits }
  }

  const objectKey = Object.keys(best.objects).find(k => t.includes(k))
  const object = objectKey ? best.objects[objectKey] : null

  const urgency =
    countHits(t, URGENT_HIGH) > 0 ? 'High'
    : countHits(t, URGENT_MOD) > 0 ? 'Moderate'
    : 'Low'

  // Confidence rises with matched signal and supporting photo evidence, but is
  // capped — the product must never present certainty the analysis does not have.
  const confidence = Math.min(0.95, 0.5 + bestHits * 0.07 + (photos > 0 ? 0.08 : 0))

  return {
    category: best.category,
    categoryLabel: best.label,
    title: best.title(object),
    urgency,
    urgencyNote: urgency === 'High' ? 'Act now' : urgency === 'Moderate' ? 'Monitor closely' : 'Not time-critical',
    confidence: Math.round(confidence * 100),
    safety: best.safety,
    disclaimer: best.disclaimer,
    question: best.question,
    matchedTerms: best.keywords.filter(w => t.includes(w)).slice(0, 6),
  }
}

export function answerEvidence(category, answer) {
  const rule = RULES.find(r => r.category === category) || FALLBACK
  return rule.answerEvidence[answer] || null
}

// ── Trust score ─────────────────────────────────────────────────────────────
// Weighted from verified activity only — never from self-declared claims.

const TRUST_WEIGHTS = {
  identity: 10, qualification: 15, relevantWork: 20,
  reliability: 25, satisfaction: 20, disputes: 10,
}

export function avgRating(ratings) {
  if (!ratings.length) return 0
  return ratings.reduce((s, r) => s + r.rating, 0) / ratings.length
}

export function trustScore(pro) {
  const e = pro.evidence
  const rating = avgRating(pro.ratings)
  const parts = {
    identity: e.identityVerified ? TRUST_WEIGHTS.identity : 0,
    qualification: e.qualificationVerified ? TRUST_WEIGHTS.qualification : 0,
    relevantWork: Math.min(1, e.relevantJobs / 40) * TRUST_WEIGHTS.relevantWork,
    reliability: ((e.completionRate * 0.6 + e.onTimeRate * 0.4) / 100) * TRUST_WEIGHTS.reliability,
    satisfaction: (rating / 5) * TRUST_WEIGHTS.satisfaction,
    disputes: Math.max(0, TRUST_WEIGHTS.disputes - e.disputes * 5),
  }
  return Math.round(Object.values(parts).reduce((a, b) => a + b, 0))
}

export function trustBand(score) {
  if (score >= 90) return { label: 'Excellent', note: 'Verified' }
  if (score >= 80) return { label: 'Strong', note: 'Verified' }
  if (score >= 65) return { label: 'Established', note: 'Verified' }
  return { label: 'Building', note: 'Limited history' }
}

export function trustEvidence(pro) {
  const e = pro.evidence
  const rating = avgRating(pro.ratings)
  return [
    { group: 'Identity', emoji: '🪪', items: [{ text: 'National ID', note: e.identityVerified ? 'Verified' : 'Not verified' }] },
    { group: 'Qualification', emoji: '📋', items: [{ text: e.qualification, note: e.qualificationVerified ? 'Verified' : 'Pending' }] },
    {
      group: 'Relevant Work', emoji: '🔧', items: [
        { text: `${e.jobsCompleted} verified ${pro.categoryLabel.toLowerCase()} jobs`, note: null },
        { text: `${e.relevantJobs} ${pro.specialisation} jobs`, note: null },
      ],
    },
    {
      group: 'Reliability', emoji: '✓', items: [
        { text: 'Completion rate', note: `${e.completionRate}%` },
        { text: 'On-time rate', note: `${e.onTimeRate}%` },
      ],
    },
    {
      group: 'Satisfaction', emoji: '⭐',
      items: [{
        text: `Verified customer score (${pro.ratings.length} reviews)`,
        note: rating ? `${rating.toFixed(1)} / 5` : 'No reviews yet',
      }],
    },
    { group: 'Disputes', emoji: '⚖', items: [{ text: 'Unresolved disputes', note: String(e.disputes) }] },
    { group: 'Activity', emoji: '⏱', items: [{ text: 'Last active', note: e.lastActive }] },
  ]
}

// ── Matching ────────────────────────────────────────────────────────────────

const MATCH_WEIGHTS = {
  'Relevant experience': 0.30,
  Availability: 0.20,
  Distance: 0.15,
  Reliability: 0.25,
  'Price fit': 0.10,
}

const REASONS = {
  'Relevant experience': p => `${p.evidence.relevantJobs} verified ${p.specialisation} jobs completed successfully.`,
  Availability: p => `Can reach you in about ${p.etaMin} minutes — the soonest of any match.`,
  Distance: p => `Only ${p.distanceKm} km away, the closest verified professional for this job.`,
  Reliability: p => `${p.evidence.completionRate}% completion and ${p.evidence.onTimeRate}% on-time across ${p.evidence.jobsCompleted} jobs.`,
  'Price fit': p => `Lowest inspection fee at LKR ${p.inspectionFee.toLocaleString()} with a solid reliability record.`,
}

export function matchFactors(pro, pool) {
  const maxRelevant = Math.max(...pool.map(p => p.evidence.relevantJobs), 1)
  const minFee = Math.min(...pool.map(p => p.inspectionFee))
  return [
    { label: 'Relevant experience', score: Math.round(50 + (pro.evidence.relevantJobs / maxRelevant) * 50) },
    { label: 'Availability', score: Math.round(100 * Math.exp(-pro.etaMin / 120)) },
    { label: 'Distance', score: Math.round(100 * Math.exp(-pro.distanceKm / 12)) },
    { label: 'Reliability', score: Math.round(pro.evidence.completionRate * 0.6 + pro.evidence.onTimeRate * 0.4) },
    { label: 'Price fit', score: Math.round(100 - ((pro.inspectionFee - minFee) / minFee) * 60) },
  ]
}

export function matchPros(pros, category) {
  const pool = pros.filter(p => p.category === category)
  if (!pool.length) return []

  const scored = pool.map(pro => {
    const factors = matchFactors(pro, pool)
    const weighted = factors.reduce((sum, f) => sum + f.score * MATCH_WEIGHTS[f.label], 0)
    const top = [...factors].sort((a, b) => b.score - a.score)[0]
    return {
      proId: pro.id,
      match: Math.round(weighted),
      factors,
      reason: REASONS[top.label](pro),
      trust: trustScore(pro),
      trustBand: trustBand(trustScore(pro)),
    }
  }).sort((a, b) => b.match - a.match)

  // Tags say why a pro is worth a look. Each is awarded once, best-first.
  const byId = id => pool.find(p => p.id === id)
  const assign = (id, tag, tagBg) => {
    const m = scored.find(s => s.proId === id)
    if (m && !m.tag) { m.tag = tag; m.tagBg = tagBg }
  }
  assign(scored[0].proId, 'BEST OVERALL', 'bg-teal-800')
  assign([...scored].sort((a, b) => byId(a.proId).etaMin - byId(b.proId).etaMin)[0].proId, 'FASTEST ARRIVAL', 'bg-gold-500')
  assign([...scored].sort((a, b) => byId(a.proId).inspectionFee - byId(b.proId).inspectionFee)[0].proId, 'BEST VALUE', 'bg-success-700')
  for (const m of scored) if (!m.tag) { m.tag = 'VERIFIED MATCH'; m.tagBg = 'bg-ink-700' }

  return scored
}

// ── Inspection findings & quoting ───────────────────────────────────────────

const CATALOG = {
  plumbing: {
    finding: 'Damaged sink connector',
    detail: 'The compression fitting connecting the supply line to the sink mixer has developed a hairline fracture. Continuous drip confirmed regardless of tap position. Connector replacement is required.',
    planTitle: 'Replace damaged sink connector',
    parts: [{ name: 'Compression connector', spec: 'Presto · 15mm · standard quality', price: 2400 }],
    labour: { name: 'Installation + pressure test', spec: 'Est. 45–60 min', price: 3500 },
    checklist: ['Connector replaced', 'Pressure test passed', 'No active leaks', 'Area cleaned up'],
    workingOn: 'Connector replacement underway',
    durationMin: 42,
    record: 'Sink connector replaced',
    room: 'Kitchen',
  },
  electrical: {
    finding: 'Failed socket and scorched terminal',
    detail: 'The live terminal inside the socket has overheated and scorched the backbox. The socket body and a short section of the feed conductor must be replaced before the circuit is safe to reuse.',
    planTitle: 'Replace socket and damaged conductor',
    parts: [{ name: '13A switched socket', spec: 'Orange · MCB-rated · standard quality', price: 1850 }],
    labour: { name: 'Replacement + circuit test', spec: 'Est. 40–60 min', price: 3200 },
    checklist: ['Socket replaced', 'Insulation test passed', 'Circuit re-energised safely', 'Area cleaned up'],
    workingOn: 'Socket replacement underway',
    durationMin: 50,
    record: 'Socket and conductor replaced',
    room: 'Electrical',
  },
  aircon: {
    finding: 'Low refrigerant charge',
    detail: 'Measured suction pressure is well below spec and the evaporator shows partial icing. A slow leak at the flare joint is the likely cause. Re-flare, leak test and recharge are required.',
    planTitle: 'Re-flare joint and recharge system',
    parts: [{ name: 'R32 refrigerant charge', spec: 'Per-gram top-up · leak test included', price: 4200 }],
    labour: { name: 'Re-flare, vacuum and recharge', spec: 'Est. 60–90 min', price: 4500 },
    checklist: ['Joint re-flared', 'Leak test passed', 'Cooling restored', 'Area cleaned up'],
    workingOn: 'Recharge and leak test underway',
    durationMin: 75,
    record: 'Refrigerant recharged, joint repaired',
    room: 'Air Conditioning',
  },
  appliance: {
    finding: 'Worn drum bearing',
    detail: 'The drum bearing has worn past tolerance, producing the grinding noise under load. Bearing and seal replacement is required before further drum damage occurs.',
    planTitle: 'Replace drum bearing and seal',
    parts: [{ name: 'Bearing and seal kit', spec: 'OEM-compatible · standard quality', price: 3600 }],
    labour: { name: 'Strip, replace and reassemble', spec: 'Est. 90–120 min', price: 4800 },
    checklist: ['Bearing replaced', 'Test cycle completed', 'No abnormal noise', 'Area cleaned up'],
    workingOn: 'Bearing replacement underway',
    durationMin: 105,
    record: 'Drum bearing replaced',
    room: 'Utility',
  },
  carpentry: {
    finding: 'Failed hinge mounting',
    detail: 'The upper hinge has torn out of the frame and the surrounding timber is split. The mounting needs reinforcing and the hinge repositioned onto sound timber.',
    planTitle: 'Reinforce frame and reset hinge',
    parts: [{ name: 'Hardwood repair block + hinge set', spec: 'Standard quality', price: 1900 }],
    labour: { name: 'Repair, reset and align', spec: 'Est. 60–75 min', price: 2800 },
    checklist: ['Frame reinforced', 'Hinge reset and aligned', 'Opens and closes cleanly', 'Area cleaned up'],
    workingOn: 'Frame repair underway',
    durationMin: 65,
    record: 'Door frame reinforced, hinge reset',
    room: 'Carpentry',
  },
  general: {
    finding: 'Assessment completed',
    detail: 'The technician has assessed the issue on site and prepared a repair plan covering the parts and labour required.',
    planTitle: 'Carry out assessed repair',
    parts: [{ name: 'Replacement parts', spec: 'Standard quality', price: 2200 }],
    labour: { name: 'Repair and test', spec: 'Est. 45–75 min', price: 3000 },
    checklist: ['Repair completed', 'Function tested', 'Issue resolved', 'Area cleaned up'],
    workingOn: 'Repair underway',
    durationMin: 55,
    record: 'General repair completed',
    room: 'General',
  },
}

export function inspectionFor(category) {
  return CATALOG[category] || CATALOG.general
}

export function buildQuote(category, inspectionFee) {
  const c = inspectionFor(category)
  const parts = c.parts.map(p => ({ ...p }))
  const partsTotal = parts.reduce((s, p) => s + p.price, 0)
  return {
    planTitle: c.planTitle,
    parts,
    labour: { ...c.labour },
    inspectionFee,
    total: partsTotal + c.labour.price + inspectionFee,
  }
}

// ── Price context ───────────────────────────────────────────────────────────

export function priceContext(history, category, total) {
  const comparable = history.filter(h => h.category === category).map(h => h.total).sort((a, b) => a - b)
  if (!comparable.length) return null

  const low = comparable[0]
  const high = comparable[comparable.length - 1]
  const mid = Math.floor(comparable.length / 2)
  const median = comparable.length % 2 ? comparable[mid] : Math.round((comparable[mid - 1] + comparable[mid]) / 2)

  const span = high - low || 1
  const pct = v => Math.min(100, Math.max(0, ((v - low) / span) * 100))
  // "Typical" is the interquartile band — the honest middle, not the full spread.
  const q = p => comparable[Math.min(comparable.length - 1, Math.floor(comparable.length * p))]
  const bandLow = q(0.25), bandHigh = q(0.75)

  return {
    low, high, median, total,
    position: Math.round(pct(total)),
    bandStart: Math.round(pct(bandLow)),
    bandEnd: Math.round(pct(bandHigh)),
    count: comparable.length,
    verdict:
      total < bandLow ? 'Below the usual range of comparable completed jobs in this area.'
      : total > bandHigh ? 'Above the usual range for this area. Worth asking what drives the difference.'
      : 'Within the usual range of comparable completed jobs in this area.',
  }
}
