/**
 * The single service request shared by the customer app and the professional
 * app.  Both roles read and write this one object, so anything a customer
 * submits is literally the thing a professional opens — there is no second
 * copy of the request anywhere in the prototype.
 *
 * Pure TypeScript (no JSX) so `node src/case.test.ts` can exercise the state
 * machine directly, matching the house style of flow.ts / worker/data.ts.
 */

// ── Shape ────────────────────────────────────────────────────────────────────

export type ServiceType = 'urgent' | 'scheduled'

export type AttachmentKind = 'photo' | 'video' | 'voice'

export interface Attachment {
  id: string
  kind: AttachmentKind
  name: string
  /** Object URL for real captures; absent for simulated demo media. */
  url?: string
  /** mm:ss, for voice and video. */
  duration?: string
  hue?: number
}

export type InspectionStatus = 'none' | 'requested' | 'confirmed' | 'completed' | 'skipped'

export interface Inspection {
  status: InspectionStatus
  reason: string
  proposedDate: string
  proposedTime: string
  confirmedDate: string
  confirmedTime: string
  requestedAt: string
  confirmedAt: string
  completedAt: string
  paid: boolean
}

export interface QuoteLine { id: string; name: string; qty: number; price: number }

/** What the professional submitted as proof the job is done. */
export interface Completion { summary: string; photos: number; at: string }

export interface Quotation {
  items: QuoteLine[]
  duration: string
  warranty: string
  notes: string
  sentAt: string
  validUntil: string
}

/**
 * One status drives both apps.  Order is the transition order — the store only
 * ever moves forward through this list, which is what makes contradictory
 * states (quotation before analysis, inspection after payment) impossible.
 */
export const STATUS_ORDER = [
  'draft',
  'submitted',
  'assigned',
  'under_analysis',
  'analysis_sent',
  'inspection_requested',
  'inspection_confirmed',
  'inspection_completed',
  'quotation_sent',
  'quotation_accepted',
  'in_progress',
  'work_completed',
  'confirmed',
  'closed',
] as const

export type CaseStatus = (typeof STATUS_ORDER)[number]

export const rank = (s: CaseStatus) => STATUS_ORDER.indexOf(s)

export interface ServiceCase {
  id: string
  customer: string
  category: string
  title: string
  description: string
  attachments: Attachment[]
  location: string
  serviceType: ServiceType
  scheduledDate: string
  scheduledTime: string
  proId: string | null
  analysis: string
  analysisAt: string
  inspection: Inspection
  quotation: Quotation | null
  quotationPaid: boolean
  completion: Completion | null
  status: CaseStatus
  createdAt: string
  updatedAt: string
}

export const EMPTY_INSPECTION: Inspection = {
  status: 'none', reason: '', proposedDate: '', proposedTime: '',
  confirmedDate: '', confirmedTime: '', requestedAt: '', confirmedAt: '',
  completedAt: '', paid: false,
}

// ── Categories ───────────────────────────────────────────────────────────────

export const CATEGORIES = [
  { id: 'plumbers', label: 'Plumbing', trade: 'Plumber' },
  { id: 'electricians', label: 'Electrical', trade: 'Electrician' },
  { id: 'ac', label: 'AC Repair', trade: 'AC Technician' },
  { id: 'carpenters', label: 'Carpentry', trade: 'Carpenter' },
  { id: 'painters', label: 'Painting', trade: 'Painter' },
  { id: 'cleaners', label: 'Cleaning', trade: 'Cleaner' },
  { id: 'appliance', label: 'Appliance Repair', trade: 'Appliance Technician' },
  { id: 'others', label: 'Other', trade: 'Technician' },
]

export const categoryLabel = (id: string) => CATEGORIES.find(c => c.id === id)?.label ?? 'Other'

const KEYWORDS: [string, RegExp][] = [
  ['ac', /\bac\b|air.?con|cooling|compressor|refriger/i],
  ['plumbers', /leak|sink|tap|pipe|drain|toilet|water|bathroom|shower|geyser/i],
  ['electricians', /wire|wiring|socket|switch|breaker|power|current|electric|fuse|bulb|fan/i],
  ['carpenters', /wood|door|cupboard|cabinet|furniture|hinge|timber|carpent/i],
  ['painters', /paint|repaint|primer|varnish/i],
  ['appliance', /fridge|washing machine|oven|microwave|appliance/i],
  ['cleaners', /clean|wash|stain|mould|mold|dust/i],
]

/** Best-guess category from the customer's own words; always overridable. */
export function guessCategory(text: string, fallback = 'plumbers') {
  for (const [id, re] of KEYWORDS) if (re.test(text)) return id
  return fallback
}

/** First sentence of the description, trimmed into something card-sized. */
export function titleFrom(text: string) {
  const first = text.trim().split(/[.\n]/)[0].trim()
  if (!first) return 'New service request'
  return first.length > 46 ? `${first.slice(0, 44).trim()}…` : first
}

// ── Matching ─────────────────────────────────────────────────────────────────

export interface Matchable { id: string; category: string; availableNow: boolean }

/**
 * Urgent requests only ever reach professionals who are available right now.
 * Scheduled requests reach every professional in the category.
 */
export function matchPros<T extends Matchable>(
  pros: T[],
  c: Pick<ServiceCase, 'category' | 'serviceType'>,
): T[] {
  return pros.filter(p => p.category === c.category && (c.serviceType !== 'urgent' || p.availableNow))
}

// ── Status → per-app progress ────────────────────────────────────────────────
// Both apps already had their own stage rails (9 customer stages, 7 worker
// stages).  Rather than add a third progress model, each rail is now a pure
// view of the one shared status.

const CUSTOMER_STEP: Record<CaseStatus, number> = {
  draft: 0,
  submitted: 1,
  assigned: 2,
  under_analysis: 2,
  analysis_sent: 3,
  inspection_requested: 3,
  inspection_confirmed: 3,
  inspection_completed: 4,
  quotation_sent: 4,
  quotation_accepted: 5,
  in_progress: 6,
  work_completed: 7,
  confirmed: 8,
  closed: 9,
}

const WORKER_STEP: Record<CaseStatus, number> = {
  draft: 0,
  submitted: 0,
  assigned: 0,
  under_analysis: 1,
  analysis_sent: 2,
  inspection_requested: 2,
  inspection_confirmed: 2,
  inspection_completed: 3,
  quotation_sent: 4,
  quotation_accepted: 4,
  in_progress: 5,
  work_completed: 6,
  confirmed: 7,
  closed: 7,
}

export const customerStep = (s: CaseStatus) => CUSTOMER_STEP[s]
export const workerStep = (s: CaseStatus) => WORKER_STEP[s]

/** Human label used on both sides so the two apps never disagree in words. */
export const STATUS_LABEL: Record<CaseStatus, string> = {
  draft: 'Draft',
  submitted: 'Finding a professional',
  assigned: 'Professional assigned',
  under_analysis: 'Under analysis',
  analysis_sent: 'Analysis received',
  inspection_requested: 'Inspection requested',
  inspection_confirmed: 'Inspection confirmed',
  inspection_completed: 'Inspection completed',
  quotation_sent: 'Quotation received',
  quotation_accepted: 'Quotation accepted',
  in_progress: 'Work in progress',
  work_completed: 'Work completed',
  confirmed: 'Completion confirmed',
  closed: 'Closed',
}

// ── Money ────────────────────────────────────────────────────────────────────

export const quoteTotal = (q: Quotation | null) =>
  q ? q.items.reduce((s, i) => s + i.qty * i.price, 0) : 0
