/**
 * TrustCraft mock domain data.
 *
 * One case (TC-2048) carries the whole narrative. Every screen reads from
 * here so the numbers can never disagree across surfaces.
 */

import {
  AFTER_REPAIR,
  FRACTURED_CONNECTOR,
  PERISHED_HOSE,
  SUPPLY_CONNECTION,
  UNDER_SINK,
} from './evidence'

export const CURRENCY = 'Rs.'

export function money(n: number): string {
  return `${CURRENCY}${n.toLocaleString('en-LK')}`
}

// ── Evidence ────────────────────────────────────────────────────────────────

export type EvidenceKind = 'photo' | 'voice' | 'note'

export interface Evidence {
  id: string
  kind: EvidenceKind
  label: string
  at: string
  src?: string
  /** Voice transcript or note body. */
  body?: string
  duration?: string
  by: string
}

export const EVIDENCE: Evidence[] = [
  {
    id: 'ev-1',
    kind: 'photo',
    label: 'Under-sink cabinet',
    at: '10:14',
    by: 'Nadeesha',
    src: UNDER_SINK,
  },
  {
    id: 'ev-2',
    kind: 'photo',
    label: 'Supply line connection',
    at: '10:15',
    by: 'Nadeesha',
    src: SUPPLY_CONNECTION,
  },
  {
    id: 'ev-3',
    kind: 'voice',
    label: 'Voice description',
    at: '10:15',
    duration: '0:22',
    by: 'Nadeesha',
    body:
      "There's water coming from underneath my kitchen sink. I noticed it this morning when I opened the cabinet — the base is damp and there's a small puddle. It seems worse right after I use the tap.",
  },
  {
    id: 'ev-4',
    kind: 'note',
    label: 'Added detail',
    at: '10:16',
    by: 'Nadeesha',
    body: 'The cabinet floor has started to swell slightly at the back corner.',
  },
]

/** Evidence added later, by the professional, during the job. */
export const JOB_EVIDENCE: Evidence[] = [
  {
    id: 'ev-5',
    kind: 'photo',
    label: 'Inspection — fractured connector',
    at: '11:20',
    by: 'Chamod Fernando',
    src: FRACTURED_CONNECTOR,
  },
  {
    id: 'ev-6',
    kind: 'photo',
    label: 'Flexible hose — perished sleeve',
    at: '11:44',
    by: 'Chamod Fernando',
    src: PERISHED_HOSE,
  },
]

export const ALL_EVIDENCE = [...EVIDENCE, ...JOB_EVIDENCE]

export const evidenceById = (id: string): Evidence | undefined =>
  ALL_EVIDENCE.find(e => e.id === id)

// ── What we know / what we still need ───────────────────────────────────────

export interface KnownFact {
  id: string
  text: string
  /** Which evidence supports this. Trust is traceable, never asserted. */
  from: string
  evidenceId: string
}

export const KNOWN: KnownFact[] = [
  {
    id: 'k1',
    text: 'Water is visible below the sink connection',
    from: 'Photo · Under-sink cabinet',
    evidenceId: 'ev-1',
  },
  { id: 'k2', text: 'Leakage increases after tap use', from: 'Voice description', evidenceId: 'ev-3' },
  { id: 'k3', text: 'The cabinet base shows early water damage', from: 'Added detail', evidenceId: 'ev-4' },
  {
    id: 'k4',
    text: 'No water is reaching the floor outside the cabinet',
    from: 'Photo · Supply line connection',
    evidenceId: 'ev-2',
  },
]

export interface OpenQuestion {
  id: string
  question: string
  why: string
  options: string[]
  /** What each answer means — shown after answering, never before. */
  reading: Record<string, string>
}

export const QUESTIONS: OpenQuestion[] = [
  {
    id: 'q1',
    question: 'Does the leak continue when the tap is fully closed?',
    why: 'Separates a pressurised supply fault from a drainage fault. The two need different work.',
    options: ['Yes', 'No', 'Not sure'],
    reading: {
      Yes: 'Points to the pressurised supply side — the connector or its seal. This does not stop on its own.',
      No: 'Points to the drain or trap side. Usually less urgent, but it still needs sealing.',
      'Not sure': 'Left open. The professional will confirm this first during inspection.',
    },
  },
  {
    id: 'q2',
    question: 'Roughly how long has this been happening?',
    why: 'Duration changes how much hidden damage to expect behind the cabinet base.',
    options: ['Today', 'A few days', 'Longer'],
    reading: {
      Today: 'Hidden damage is unlikely. The scope should stay contained.',
      'A few days': 'Some absorption into the cabinet base is likely. Worth inspecting.',
      Longer: 'Expect the professional to check the cabinet base and wall for spread.',
    },
  },
]

export const SAFETY = {
  title: 'Close the local isolation valve',
  body:
    'If the valve under the sink is safely reachable, turn it clockwise to stop the supply until a professional inspects it. Do not dismantle the connection yourself.',
  caveat: 'If the valve is stiff or corroded, leave it and keep a container under the leak instead.',
}

export const LIKELY_EXPERTISE = {
  field: 'Plumbing',
  narrow: 'Supply-side connection and seal work',
  priority: 'Needs attention today',
  priorityWhy:
    'Active water against a wooden cabinet base spreads damage faster than the leak itself does.',
}

// ── Resolution paths ────────────────────────────────────────────────────────

export interface ResolutionPath {
  id: string
  title: string
  recommended: boolean
  summary: string
  why: string[]
  lessAppropriate?: string
  cost: string
  time: string
}

export const PATHS: ResolutionPath[] = [
  {
    id: 'inspect',
    title: 'Professional inspection',
    recommended: true,
    summary: 'A qualified plumber confirms the source, then quotes the actual repair.',
    why: [
      'The exact leak source cannot be confirmed from the available evidence',
      'Supply-side and drain-side faults look identical in a photograph',
      'The inspection fee is credited against the repair if you proceed',
    ],
    cost: 'Rs.700 – Rs.1,000',
    time: 'Today',
  },
  {
    id: 'monitor',
    title: 'Monitor temporarily',
    recommended: false,
    summary: 'Contain the water, watch it for 24–48 hours, decide after that.',
    why: ['Costs nothing', 'Reasonable when a leak is slow, clean, and clearly settling'],
    lessAppropriate:
      'Less appropriate here: the cabinet base is already absorbing water, and the leak increases with tap use rather than settling.',
    cost: 'Free',
    time: '24–48 hrs',
  },
  {
    id: 'urgent',
    title: 'Urgent call-out',
    recommended: false,
    summary: 'Immediate attendance at a premium rate.',
    why: ['Right when water is uncontained, reaching electrics, or flooding'],
    lessAppropriate:
      'Less appropriate here: the water is contained inside the cabinet and no electrical fitting is involved.',
    cost: '+ Rs.1,500 surcharge',
    time: 'Within 1 hr',
  },
]

// ── Professionals ───────────────────────────────────────────────────────────

export interface TrustEvidenceItem {
  label: string
  detail: string
}

export interface Pro {
  id: string
  name: string
  short: string
  specialty: string
  /** Monogram tint, so the three columns stay distinguishable at a glance. */
  tint: string
  fitLabel: string
  fitNote: string
  similarJobs: number
  qualification: string
  completion: number
  distanceKm: number
  availability: string
  availabilityRank: number
  inspection: number
  /** How often the final cost matched the approved quote. */
  quoteAccuracy: number
  disputes: number
  since: string
  area: string
  evidence: TrustEvidenceItem[]
  reviews: { name: string; text: string; date: string; job: string }[]
}

export const PROS: Pro[] = [
  {
    id: 'chamod',
    name: 'Chamod Fernando',
    short: 'Chamod',
    specialty: 'Plumbing · Pipe & leak specialist',
    tint: '#0B6B6B',
    fitLabel: 'Strongest overall fit',
    fitNote:
      'Not first on every measure — first on the ones that decide this job: he can come today, he has done this exact repair 31 times, and his final cost matches his quote more often than either alternative.',
    similarJobs: 31,
    qualification: 'Verified',
    completion: 96,
    distanceKm: 2.4,
    availability: '42 min',
    availabilityRank: 1,
    inspection: 1000,
    quoteAccuracy: 91,
    disputes: 0,
    since: '2019',
    area: 'Colombo 03 – 07',
    evidence: [
      { label: '31 verified similar repairs', detail: 'Supply-line and connector leaks, last 24 months' },
      { label: 'Identity verified', detail: 'NIC checked against service records' },
      { label: 'Qualification verified', detail: 'NAITA plumbing certification, verified 2024' },
      { label: '96% completion rate', detail: '46 of 48 accepted jobs completed as agreed' },
      { label: 'No unresolved disputes', detail: '0 open, 1 resolved in the customer’s favour (2023)' },
      { label: 'Final cost matched the quote in 91% of jobs', detail: 'Measured against approved plans' },
    ],
    reviews: [
      {
        name: 'Amara S.',
        text: 'Identified the problem quickly and explained exactly what he was replacing before touching anything.',
        date: 'Jul 2026',
        job: 'Supply line leak · Colombo 05',
      },
      {
        name: 'Priya K.',
        text: 'Fixed the leak in under an hour with no mess. Sent photos of the old part.',
        date: 'Jun 2026',
        job: 'Connector replacement · Colombo 04',
      },
    ],
  },
  {
    id: 'nimal',
    name: 'Nimal Perera',
    short: 'Nimal',
    specialty: 'Plumbing · General maintenance',
    tint: '#2D3139',
    fitLabel: 'Closest, cheapest to ask',
    fitNote: 'Nearest to you and the least expensive opinion, with fewer jobs of this exact type.',
    similarJobs: 14,
    qualification: 'Verified',
    completion: 98,
    distanceKm: 1.6,
    availability: '2 hrs',
    availabilityRank: 2,
    inspection: 700,
    quoteAccuracy: 78,
    disputes: 0,
    since: '2021',
    area: 'Colombo 05 – 06',
    evidence: [
      { label: '14 verified similar repairs', detail: 'Mixed plumbing, fewer supply-side jobs' },
      { label: 'Identity verified', detail: 'NIC checked against service records' },
      { label: 'Qualification verified', detail: 'Trade certification, verified 2025' },
      { label: '98% completion rate', detail: '49 of 50 accepted jobs completed as agreed' },
      { label: 'No unresolved disputes', detail: '0 open, 0 resolved' },
    ],
    reviews: [
      {
        name: 'Ruwan D.',
        text: 'Arrived early and was very tidy.',
        date: 'Aug 2026',
        job: 'Tap replacement · Colombo 06',
      },
    ],
  },
  {
    id: 'kasun',
    name: 'Kasun Silva',
    short: 'Kasun',
    specialty: 'Plumbing · Installation & repair',
    tint: '#9A6D1E',
    fitLabel: 'Most thorough scope',
    fitNote: 'Tends to replace surrounding parts rather than the minimum.',
    similarJobs: 37,
    qualification: 'Verified',
    completion: 91,
    distanceKm: 4.7,
    availability: 'Tomorrow',
    availabilityRank: 3,
    inspection: 900,
    quoteAccuracy: 74,
    disputes: 0,
    since: '2017',
    area: 'Colombo 01 – 08',
    evidence: [
      { label: '37 verified similar repairs', detail: 'Highest relevant volume of the three' },
      { label: 'Identity verified', detail: 'NIC checked against service records' },
      { label: 'Qualification verified', detail: 'NAITA plumbing certification, verified 2023' },
      { label: '91% completion rate', detail: '62 of 68 accepted jobs completed as agreed' },
      { label: 'No unresolved disputes', detail: '0 open, 2 resolved by agreement' },
    ],
    reviews: [
      {
        name: 'Fathima R.',
        text:
          'Thorough — replaced parts I did not know were failing. Cost more than I expected but nothing has leaked since.',
        date: 'May 2026',
        job: 'Bathroom supply rework · Colombo 07',
      },
    ],
  },
]

export const proById = (id: string): Pro => PROS.find(p => p.id === id) ?? PROS[0]

/** Comparison rows for Professional Fit: a value plus how to read it. */
export interface FitRow {
  key: string
  label: string
  hint: string
  /** 'high' — bigger is better. 'low' — smaller is better. 'none' — no winner. */
  better: 'high' | 'low' | 'none'
  value: (p: Pro) => string
  raw: (p: Pro) => number
}

export const FIT_ROWS: FitRow[] = [
  {
    key: 'similar',
    label: 'Similar repairs',
    hint: 'Verified jobs matching this problem type in the last 24 months.',
    better: 'high',
    value: p => String(p.similarJobs),
    raw: p => p.similarJobs,
  },
  {
    key: 'qual',
    label: 'Qualification',
    hint: 'Trade certification checked against the issuing body.',
    better: 'none',
    value: p => p.qualification,
    raw: () => 0,
  },
  {
    key: 'completion',
    label: 'Completion',
    hint: 'Share of accepted jobs finished as agreed, without cancellation.',
    better: 'high',
    value: p => `${p.completion}%`,
    raw: p => p.completion,
  },
  {
    key: 'distance',
    label: 'Distance',
    hint: 'Straight-line distance from your address.',
    better: 'low',
    value: p => `${p.distanceKm} km`,
    raw: p => p.distanceKm,
  },
  {
    key: 'availability',
    label: 'Availability',
    hint: 'The earliest this professional can attend.',
    better: 'low',
    value: p => p.availability,
    raw: p => p.availabilityRank,
  },
  {
    key: 'inspection',
    label: 'Inspection',
    hint: 'Credited against the repair if you continue with the same professional.',
    better: 'low',
    value: p => money(p.inspection),
    raw: p => p.inspection,
  },
  {
    key: 'accuracy',
    label: 'Final cost matched quote',
    hint: 'How often the amount actually charged matched the plan the customer approved.',
    better: 'high',
    value: p => `${p.quoteAccuracy}%`,
    raw: p => p.quoteAccuracy,
  },
]

// ── Quote Lens ──────────────────────────────────────────────────────────────

/** Tri-state on purpose: included, excluded, or *not stated* — the gap that matters. */
export type ScopeState = 'yes' | 'no' | 'unstated'

export interface ScopeLine {
  key: string
  label: string
  hint: string
}

export const SCOPE_LINES: ScopeLine[] = [
  {
    key: 'connector',
    label: 'Connector replacement',
    hint: 'Replacing the fractured compression fitting itself.',
  },
  {
    key: 'hose',
    label: 'New flexible hose',
    hint: 'The braided hose between the isolation valve and the mixer.',
  },
  {
    key: 'pressure',
    label: 'Pressure test',
    hint: 'Verifies the new joint holds under supply pressure before leaving.',
  },
  {
    key: 'materials',
    label: 'Materials included',
    hint: 'Whether parts sit inside the quoted total or are billed afterwards.',
  },
  { key: 'labour', label: 'Labour included', hint: 'Whether fitting time sits inside the quoted total.' },
  {
    key: 'cleanup',
    label: 'Cabinet dry-out & cleanup',
    hint: 'Drying the cabinet base and removing the old parts.',
  },
]

export interface Quote {
  proId: string
  scope: Record<string, ScopeState>
  warrantyDays: number | null
  durationMin: number
  inspection: number
  parts: number
  labour: number
  total: number
  note: string
}

export const QUOTES: Quote[] = [
  {
    proId: 'chamod',
    scope: { connector: 'yes', hose: 'no', pressure: 'yes', materials: 'yes', labour: 'yes', cleanup: 'yes' },
    warrantyDays: 30,
    durationMin: 60,
    inspection: 1000,
    parts: 2400,
    labour: 3500,
    total: 6900,
    note:
      'Replaces the connector only. The hose will be assessed during the repair, and raised as a change request if it needs replacing.',
  },
  {
    proId: 'nimal',
    scope: {
      connector: 'yes',
      hose: 'unstated',
      pressure: 'no',
      materials: 'unstated',
      labour: 'yes',
      cleanup: 'unstated',
    },
    warrantyDays: null,
    durationMin: 45,
    inspection: 700,
    parts: 0,
    labour: 4700,
    total: 5400,
    note: 'Covers the visit and the fitting work. Parts and warranty are not itemised.',
  },
  {
    proId: 'kasun',
    scope: { connector: 'yes', hose: 'yes', pressure: 'yes', materials: 'yes', labour: 'yes', cleanup: 'yes' },
    warrantyDays: 90,
    durationMin: 90,
    inspection: 900,
    parts: 3900,
    labour: 2500,
    total: 7300,
    note: 'Replaces the connector and the hose together, on the basis that both are the same age.',
  },
]

export const quoteFor = (proId: string): Quote => QUOTES.find(q => q.proId === proId) ?? QUOTES[0]

/** Observations TrustCraft surfaces. Never a verdict — always a "notice this". */
export interface LensInsight {
  kind: 'cheapest' | 'complete' | 'balanced' | 'gap'
  proId: string
  headline: string
  body: string
}

export const LENS_INSIGHTS: LensInsight[] = [
  {
    kind: 'cheapest',
    proId: 'nimal',
    headline: 'Lowest total',
    body: 'Rs.5,400 — Rs.1,500 below the next quote.',
  },
  {
    kind: 'gap',
    proId: 'nimal',
    headline: 'But three lines are not stated',
    body:
      'Materials, warranty and cleanup are unspecified. If parts are billed separately at the typical Rs.2,400, this quote lands near Rs.7,800 — above both of the others.',
  },
  {
    kind: 'complete',
    proId: 'kasun',
    headline: 'Most complete scope',
    body: 'Every line specified and the longest warranty at 90 days. Also the highest total and the latest availability.',
  },
  {
    kind: 'balanced',
    proId: 'chamod',
    headline: 'Balanced',
    body:
      'Everything specified except the hose — which is deliberately excluded pending inspection, rather than left blank.',
  },
]

// ── Repair plan / agreement ─────────────────────────────────────────────────

export const REPAIR_PLAN = {
  proId: 'chamod',
  title: 'Replace damaged sink connector',
  diagnosis:
    'The compression fitting joining the supply line to the sink mixer has a hairline fracture. The drip continues with the tap closed, which confirms a supply-side fault rather than a drainage fault.',
  lines: [
    {
      group: 'Parts',
      label: 'Compression connector',
      detail: '15 mm · brass · standard grade',
      amount: 2400,
    },
    { group: 'Labour', label: 'Installation + pressure test', detail: 'Estimated 45–60 minutes', amount: 3500 },
    { group: 'Inspection', label: 'Inspection fee', detail: 'Already paid — included in this total', amount: 1000 },
  ],
  total: 6900,
  warranty: '30-day labour warranty',
  duration: '45–60 minutes',
  excluded: [
    'Flexible hose replacement — condition to be assessed during the repair',
    'Cabinet base repair or refinishing',
  ],
}

export const AGREEMENT = {
  caseId: 'TC-2048',
  proId: 'chamod',
  agreedWork: [
    'Replace the fractured compression connector',
    'Pressure-test the new connection before leaving',
  ],
  materials: 'Replacement connector included in the price',
  price: 6900,
  warranty: '30 days on labour',
  evidenceRequired: 'Before and after images required at completion',
  changePolicy: 'Any additional work needs a written change request and your approval before it starts.',
}

// ── Change request ──────────────────────────────────────────────────────────

export const CHANGE_REQUEST = {
  id: 'CR-1',
  raisedBy: 'chamod',
  at: '11:47',
  title: 'Flexible hose also requires replacement',
  reason:
    'With the connector off, the braided hose shows corrosion at the crimp and the outer sleeve has split. It is the same age as the failed connector. If it is left, it is likely to fail within months and the joint would need opening again.',
  scopeAddition: 'Replace the flexible supply hose',
  priceChange: 1500,
  timeChange: 20,
  evidenceId: 'ev-6',
  originalTotal: 6900,
  newTotal: 8400,
  declineConsequence:
    'The connector repair still completes and is still covered. The hose stays as it is, and TrustCraft records that it was flagged and declined on this date.',
}

// ── Proof timeline ──────────────────────────────────────────────────────────

export type EventKind = 'report' | 'system' | 'decision' | 'work' | 'money' | 'verify' | 'resolved'

export interface TimelineEvent {
  id: string
  time: string
  title: string
  detail?: string
  by: string
  confirmedBy?: string
  evidenceIds?: string[]
  amount?: number
  kind: EventKind
  /** Step index this event appears at, so the record can play forward. */
  step: number
}

export const TIMELINE: TimelineEvent[] = [
  {
    id: 't1',
    time: '10:14',
    title: 'Problem reported',
    detail: 'Water beneath the kitchen sink — 2 photos, 1 voice note',
    by: 'Nadeesha',
    evidenceIds: ['ev-1', 'ev-2'],
    kind: 'report',
    step: 0,
  },
  {
    id: 't2',
    time: '10:18',
    title: 'Case structured',
    detail: '4 facts established, 2 questions raised, plumbing identified as the likely expertise',
    by: 'TrustCraft',
    kind: 'system',
    step: 0,
  },
  {
    id: 't3',
    time: '10:31',
    title: 'Chamod Fernando selected',
    detail: 'Chosen from 3 curated professionals for inspection',
    by: 'Nadeesha',
    confirmedBy: 'Nadeesha',
    kind: 'decision',
    step: 1,
  },
  {
    id: 't4',
    time: '11:20',
    title: 'Inspection completed',
    detail: 'Fractured compression connector confirmed as the source',
    by: 'Chamod Fernando',
    confirmedBy: 'Chamod Fernando',
    evidenceIds: ['ev-5'],
    kind: 'work',
    step: 2,
  },
  {
    id: 't5',
    time: '11:28',
    title: 'Repair plan approved',
    detail: 'Work agreement signed — connector replacement with pressure test',
    by: 'Nadeesha',
    confirmedBy: 'Nadeesha',
    amount: 6900,
    kind: 'money',
    step: 3,
  },
  {
    id: 't6',
    time: '11:47',
    title: 'Change request raised',
    detail: 'Flexible hose also requires replacement',
    by: 'Chamod Fernando',
    evidenceIds: ['ev-6'],
    amount: 1500,
    kind: 'decision',
    step: 4,
  },
  {
    id: 't7',
    time: '11:52',
    title: 'Change request approved',
    detail: 'New agreed total Rs.8,400',
    by: 'Nadeesha',
    confirmedBy: 'Nadeesha',
    amount: 8400,
    kind: 'money',
    step: 5,
  },
  {
    id: 't8',
    time: '12:14',
    title: 'Repair completed',
    detail: 'Connector and hose replaced, pressure test passed at 3 bar',
    by: 'Chamod Fernando',
    confirmedBy: 'Chamod Fernando',
    evidenceIds: ['ev-5', 'ev-6'],
    kind: 'work',
    step: 6,
  },
  {
    id: 't9',
    time: '12:18',
    title: 'Resolution verified',
    detail: 'Customer confirmed the leak has stopped',
    by: 'Nadeesha',
    confirmedBy: 'Nadeesha',
    kind: 'verify',
    step: 7,
  },
  {
    id: 't10',
    time: '12:18',
    title: 'Case resolved',
    detail: 'Recorded permanently against Kitchen · Sink',
    by: 'TrustCraft',
    kind: 'resolved',
    step: 7,
  },
]

export const COMPLETION_CHECKS = [
  { id: 'c1', label: 'The leak has stopped', detail: 'No water under the cabinet after running the tap' },
  { id: 'c2', label: 'The new parts are fitted', detail: 'Connector and hose visibly replaced' },
  { id: 'c3', label: 'The area was left clean', detail: 'Old parts removed, cabinet dried' },
]

export const BEFORE_AFTER = {
  before: UNDER_SINK,
  after: AFTER_REPAIR,
}

export const RESOLVED_SUMMARY = {
  finalAmount: 8400,
  durationMin: 58,
  evidenceCount: 5,
  warranty: '30 days',
  warrantyUntil: '18 September 2026',
  proId: 'chamod',
  date: '23 August 2026',
}

// ── Cases ───────────────────────────────────────────────────────────────────

export type Attention = 'needs-you' | 'active' | 'waiting' | 'resolved'

export interface CaseRecord {
  id: string
  title: string
  room: string
  status: string
  opened: string
  attention: Attention
  attentionReason?: string
  pro?: string
  route: string
}

export const CASES: CaseRecord[] = [
  {
    id: 'TC-2041',
    title: 'Bedroom AC not cooling',
    room: 'Bedroom · Air conditioner',
    status: '2 quotes ready to compare',
    opened: '21 Aug 2026',
    attention: 'needs-you',
    attentionReason: 'Two quotes are waiting for your decision',
    route: '#/case/TC-2048/quotes',
  },
  {
    id: 'TC-2048',
    title: 'Kitchen sink leak',
    room: 'Kitchen · Sink',
    status: 'Repair underway',
    opened: 'Today, 10:14',
    attention: 'active',
    pro: 'Chamod Fernando',
    route: '#/case/TC-2048/record',
  },
  {
    id: 'TC-2039',
    title: 'Bathroom light flickering',
    room: 'Bathroom · Lighting',
    status: 'Professional response pending',
    opened: '20 Aug 2026',
    attention: 'waiting',
    route: '#/cases',
  },
  {
    id: 'TC-2012',
    title: 'Electrical socket replacement',
    room: 'Living room · Power',
    status: 'Resolved 4 Aug 2026',
    opened: '2 Aug 2026',
    attention: 'resolved',
    pro: 'Nuwan Silva',
    route: '#/ledger',
  },
  {
    id: 'TC-1998',
    title: 'Bedroom AC annual service',
    room: 'Bedroom · Air conditioner',
    status: 'Resolved 14 Jul 2026',
    opened: '12 Jul 2026',
    attention: 'resolved',
    pro: 'Samith Rajapaksa',
    route: '#/ledger',
  },
]

// ── Home ledger ─────────────────────────────────────────────────────────────

export interface LedgerEntry {
  date: string
  title: string
  pro: string
  cost: number
  caseId: string
  warranty?: string
  evidence: number
  parts?: string[]
}

export interface LedgerAsset {
  id: string
  area: string
  name: string
  detail: string
  lastService: string
  warrantyUntil?: string
  history: LedgerEntry[]
  reminder?: { label: string; due: string }
}

export const LEDGER: LedgerAsset[] = [
  {
    id: 'kitchen-sink',
    area: 'Kitchen',
    name: 'Sink',
    detail: 'Mixer tap, supply lines and waste trap',
    lastService: 'Aug 2026',
    warrantyUntil: '18 Sep 2026',
    history: [
      {
        date: '23 Aug 2026',
        title: 'Connector and flexible hose replaced',
        pro: 'Chamod Fernando',
        cost: 8400,
        caseId: 'TC-2048',
        warranty: 'Labour warranty until 18 Sep 2026',
        evidence: 5,
        parts: ['15 mm brass compression connector', 'Braided flexible supply hose'],
      },
      {
        date: '11 Feb 2025',
        title: 'Mixer tap cartridge replaced',
        pro: 'Chamod Fernando',
        cost: 4200,
        caseId: 'TC-1604',
        evidence: 2,
        parts: ['Ceramic cartridge'],
      },
    ],
    reminder: { label: 'Check supply hose condition', due: 'Aug 2028' },
  },
  {
    id: 'kitchen-filter',
    area: 'Kitchen',
    name: 'Water filter',
    detail: 'Under-sink cartridge unit',
    lastService: 'Apr 2026',
    history: [
      {
        date: '6 Apr 2026',
        title: 'Cartridge replaced',
        pro: 'Chamod Fernando',
        cost: 3100,
        caseId: 'TC-1822',
        evidence: 1,
      },
    ],
    reminder: { label: 'Replace cartridge', due: 'Oct 2026' },
  },
  {
    id: 'bedroom-ac',
    area: 'Bedroom',
    name: 'Air conditioner',
    detail: '12,000 BTU split unit · installed 2021',
    lastService: 'Jul 2026',
    history: [
      {
        date: '14 Jul 2026',
        title: 'Full service and filter replacement',
        pro: 'Samith Rajapaksa',
        cost: 6500,
        caseId: 'TC-1998',
        evidence: 3,
        parts: ['Filter set'],
      },
      {
        date: '9 Aug 2025',
        title: 'Refrigerant top-up',
        pro: 'Samith Rajapaksa',
        cost: 5800,
        caseId: 'TC-1401',
        evidence: 2,
      },
    ],
    reminder: { label: 'Annual service due', due: 'Jul 2027' },
  },
  {
    id: 'electrical-board',
    area: 'Electrical',
    name: 'Main board',
    detail: 'Consumer unit, 8 circuits',
    lastService: 'Mar 2026',
    warrantyUntil: 'Certificate valid to Mar 2031',
    history: [
      {
        date: '3 Mar 2026',
        title: 'Safety inspection and certificate',
        pro: 'Nuwan Silva',
        cost: 7500,
        caseId: 'TC-1750',
        warranty: 'Certificate valid 5 years',
        evidence: 4,
      },
    ],
    reminder: { label: 'Re-inspection due', due: 'Mar 2031' },
  },
  {
    id: 'water-pump',
    area: 'Water system',
    name: 'Pressure pump',
    detail: 'Roof tank booster',
    lastService: 'Dec 2025',
    history: [
      {
        date: '18 Dec 2025',
        title: 'Impeller replaced',
        pro: 'Kasun Silva',
        cost: 9200,
        caseId: 'TC-1533',
        evidence: 3,
      },
    ],
  },
]

// ── Messages ────────────────────────────────────────────────────────────────

export type MessageItem =
  | { id: string; kind: 'text'; from: 'you' | 'pro'; at: string; body: string }
  | {
      id: string
      kind: 'object'
      from: 'you' | 'pro'
      at: string
      objectType: string
      title: string
      meta: string
      href: string
    }

export const THREAD: MessageItem[] = [
  { id: 'm1', kind: 'text', from: 'pro', at: '10:36', body: 'On my way — should be with you in about 40 minutes.' },
  {
    id: 'm2',
    kind: 'text',
    from: 'you',
    at: '10:37',
    body: 'Thank you. The valve under the sink is quite stiff so I left it.',
  },
  {
    id: 'm3',
    kind: 'text',
    from: 'pro',
    at: '10:38',
    body: "That's fine, don't force it. I'll deal with it when I arrive.",
  },
  {
    id: 'm4',
    kind: 'object',
    from: 'pro',
    at: '11:26',
    objectType: 'Repair plan',
    title: 'Replace damaged sink connector',
    meta: 'Rs.6,900 · 30-day warranty',
    href: '#/case/TC-2048/plan',
  },
  {
    id: 'm5',
    kind: 'object',
    from: 'you',
    at: '11:28',
    objectType: 'Work agreement',
    title: 'Approved',
    meta: 'Rs.6,900 agreed',
    href: '#/case/TC-2048/agreement',
  },
  {
    id: 'm6',
    kind: 'object',
    from: 'pro',
    at: '11:47',
    objectType: 'Change request',
    title: 'Flexible hose also requires replacement',
    meta: '+ Rs.1,500 · + 20 min',
    href: '#/case/TC-2048/change',
  },
  { id: 'm7', kind: 'text', from: 'you', at: '11:50', body: 'Is the hose likely to fail soon if I leave it?' },
  {
    id: 'm8',
    kind: 'text',
    from: 'pro',
    at: '11:51',
    body:
      'The sleeve has already split, so yes — likely within a few months, and it would mean opening the joint again.',
  },
]

export const USER = {
  name: 'Nadeesha',
  full: 'Nadeesha Jayawardena',
  initial: 'N',
  address: 'Colombo 05',
}

export const CASE = {
  id: 'TC-2048',
  title: 'Kitchen sink leak',
  room: 'Kitchen · Sink',
  opened: 'Today, 10:14',
}

// ── Internal consistency ────────────────────────────────────────────────────
//
// Every screen reads these figures, so a contradiction between two of them
// shows up as a credibility hole rather than a crash. These ran as review
// comments until two of them were actually wrong; now they run on every dev
// boot instead.

if (import.meta.env.DEV) {
  const bad: string[] = []

  // Availability ranking must agree with the availability text it sits beside.
  const byRank = [...PROS].sort((a, b) => a.availabilityRank - b.availabilityRank)
  const minutes = (p: Pro): number =>
    /min/.test(p.availability)
      ? parseInt(p.availability, 10)
      : /hr/.test(p.availability)
        ? parseInt(p.availability, 10) * 60
        : 10_000
  byRank.forEach((p, i) => {
    if (i > 0 && minutes(byRank[i - 1]) > minutes(p)) {
      bad.push(`${p.name} ranks slower than ${byRank[i - 1].name} but attends sooner`)
    }
  })

  // A quote total must equal the parts it claims to be made of.
  for (const q of QUOTES) {
    if (q.parts + q.labour + q.inspection !== q.total) {
      bad.push(`${q.proId}: parts + labour + inspection ≠ total (${q.total})`)
    }
  }

  // The change request, the plan and the resolved summary must agree on money.
  if (CHANGE_REQUEST.originalTotal !== REPAIR_PLAN.total) {
    bad.push('change request does not start from the approved plan total')
  }
  if (CHANGE_REQUEST.originalTotal + CHANGE_REQUEST.priceChange !== CHANGE_REQUEST.newTotal) {
    bad.push('change request new total is not original + change')
  }
  if (RESOLVED_SUMMARY.finalAmount !== CHANGE_REQUEST.newTotal) {
    bad.push('resolved final amount does not match the approved change')
  }

  // The ledger entry for this case must record what the case actually cost.
  const entry = LEDGER.flatMap(a => a.history).find(h => h.caseId === CASE.id)
  if (entry && entry.cost !== RESOLVED_SUMMARY.finalAmount) {
    bad.push('ledger entry cost disagrees with the resolved amount')
  }

  // Every fact must point at evidence that exists.
  for (const k of KNOWN) {
    if (!evidenceById(k.evidenceId)) bad.push(`known fact ${k.id} cites missing evidence`)
  }

  if (bad.length > 0) {
    throw new Error(`TrustCraft data is inconsistent:\n  - ${bad.join('\n  - ')}`)
  }
}
