// Worker-side fixtures and the pure job-progress logic.
// Kept JSX-free so it runs under `node src/worker/data.test.ts`.

export type WScreen =
  | 'home' | 'opportunities' | 'request' | 'accepted'
  | 'job' | 'quote' | 'quote-sent' | 'complete' | 'done'
  | 'messages' | 'chat' | 'earnings' | 'analyse'
  | 'profile' | 'services' | 'documents' | 'settings'

export interface WNav {
  go: (to: WScreen) => void
  back: () => void
}

// ── The job lifecycle, from the professional's side ──────────────────────────

export const STAGES = [
  { key: 'accepted', label: 'Request Accepted', note: 'You took this job' },
  { key: 'analysis', label: 'Problem Analysis', note: 'Findings shared with customer' },
  { key: 'inspection', label: 'Inspection', note: 'On-site verification' },
  { key: 'quotation', label: 'Quotation', note: 'Transparent, itemised price' },
  { key: 'payment', label: 'Payment Secured', note: 'Held by TrustCraft until done' },
  { key: 'work', label: 'Work in Progress', note: 'On the tools' },
  { key: 'completion', label: 'Work Completed', note: 'Evidence submitted' },
]

export const LAST_STEP = STAGES.length // 7 == everything done

export type StepStatus = 'done' | 'current' | 'pending'

export interface Step {
  key: string
  label: string
  note: string
  status: StepStatus
  index: number
}

export function deriveSteps(step: number): Step[] {
  return STAGES.map((s, i) => ({
    key: s.key,
    label: s.label,
    note: s.note,
    index: i,
    status: i < step ? 'done' : i === step ? 'current' : 'pending',
  }))
}

export interface WAction {
  label: string
  to: WScreen
  advance?: number
  hint: string
  /** True while the ball is in the customer's court. */
  waiting?: boolean
}

/** The single call-to-action the job screen renders for the current stage. */
export function nextAction(step: number): WAction {
  switch (step) {
    case 0:
      return { label: 'Begin Problem Analysis', to: 'job', advance: 1, hint: 'Read the photos and notes the customer sent.' }
    case 1:
      return { label: 'Submit Analysis', to: 'job', advance: 2, hint: 'Tell the customer what you think is wrong.' }
    case 2:
      return { label: 'Mark Inspection Complete', to: 'job', advance: 3, hint: 'Confirm the on-site visit is finished.' }
    case 3:
      return { label: 'Create Quotation', to: 'quote', hint: 'Price the job line by line.' }
    case 4:
      return { label: 'Payment Received — Start Work', to: 'job', advance: 5, waiting: true, hint: 'Waiting for the customer to release payment.' }
    case 5:
      return { label: 'Mark Work Completed', to: 'complete', hint: 'Upload evidence when the job is done.' }
    case 6:
      return { label: 'View Job Summary', to: 'done', advance: LAST_STEP, hint: 'Completion sent for customer confirmation.' }
    default:
      return { label: 'View Job Summary', to: 'done', hint: 'This job is closed and paid out.' }
  }
}

// ── Quotation maths ──────────────────────────────────────────────────────────

export interface QuoteItem { id: string; name: string; qty: number; price: number }

export const PLATFORM_FEE = 0.08

export function quoteTotals(items: QuoteItem[]) {
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)
  const fee = Math.round(subtotal * PLATFORM_FEE)
  return { subtotal, fee, payout: subtotal - fee }
}

// ── Fixtures ─────────────────────────────────────────────────────────────────

export const WORKER = {
  name: 'Kamal Perera',
  trade: 'Verified Technician',
  trades: 'Plumbing · Electrical',
  area: 'Rajagiriya, Colombo',
  since: 'Member since 2019',
  rating: 4.8,
  reviews: 214,
  trust: 92,
  jobs: 312,
  phone: '077 442 1180',
  email: 'kamal.perera@email.com',
  hue: 212,
}

export interface Opportunity {
  id: string
  title: string
  trade: string
  customer: string
  area: string
  km: number
  posted: string
  budget: number
  urgent?: boolean
  summary: string
  window: string
  hue: number
}

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'TC-8821', title: 'Kitchen Sink Leakage', trade: 'Plumbing Repair', customer: 'Nimal Perera',
    area: 'Rajagiriya', km: 2.4, posted: '12 min ago', budget: 6000, urgent: true, hue: 212,
    summary: 'Water drips from the pipe under the kitchen sink whenever the tap runs. It has been getting worse for three days and the cupboard below is soaked.',
    window: 'Today · 2:00 PM – 6:00 PM',
  },
  {
    id: 'TC-8822', title: 'Ceiling Fan Not Working', trade: 'Electrical Repair', customer: 'Sanduni Silva',
    area: 'Nugegoda', km: 3.8, posted: '40 min ago', budget: 4500, hue: 275,
    summary: 'The bedroom ceiling fan stopped turning. The regulator light still comes on, so the switch seems fine.',
    window: 'Tomorrow · 9:00 AM – 12:00 PM',
  },
  {
    id: 'TC-8823', title: 'Bathroom Tap Replacement', trade: 'Plumbing', customer: 'Ruwan Jayasuriya',
    area: 'Battaramulla', km: 5.1, posted: '1 hr ago', budget: 3800, hue: 160,
    summary: 'Old mixer tap is corroded and will not close fully. A replacement tap has already been bought.',
    window: 'Sat · 10:00 AM – 4:00 PM',
  },
  {
    id: 'TC-8824', title: 'Power Trip in Kitchen', trade: 'Electrical', customer: 'Ayesha Kumari',
    area: 'Malabe', km: 6.3, posted: '2 hr ago', budget: 7200, urgent: true, hue: 24,
    summary: 'The main breaker trips whenever the oven and kettle run together. Needs load checking and possibly a new circuit.',
    window: 'Today · 5:00 PM – 8:00 PM',
  },
]

export const oppById = (id: string) => OPPORTUNITIES.find(o => o.id === id) ?? OPPORTUNITIES[0]

/** The job already in flight when the demo opens. */
export const ACTIVE_JOB: Opportunity = {
  id: 'TC-8776', title: 'Kitchen Sink Repair', trade: 'Plumbing Repair', customer: 'Nimal Perera',
  area: 'Rajagiriya', km: 2.4, posted: 'Accepted Aug 24, 9:05 AM', budget: 5600, hue: 212,
  summary: 'Leak under the kitchen sink. Inspection confirmed a failed trap seal and a corroded compression washer.',
  window: 'Today · 2:00 PM – 6:00 PM',
}

export const SEED_QUOTE: QuoteItem[] = [
  { id: 'q1', name: 'PVC Trap Assembly', qty: 1, price: 1450 },
  { id: 'q2', name: 'Compression Washer Set', qty: 2, price: 175 },
  { id: 'q3', name: 'Replacement Labour', qty: 1, price: 2500 },
]

export const EARNINGS = {
  available: 18400,
  month: 46250,
  week: 12900,
  pending: 5600,
  payoutOn: 'Fri, 30 Aug',
  months: [
    { m: 'Mar', v: 28400 }, { m: 'Apr', v: 35100 }, { m: 'May', v: 24800 },
    { m: 'Jun', v: 41200 }, { m: 'Jul', v: 38900 }, { m: 'Aug', v: 46250 },
  ],
  ledger: [
    { id: 'TC-8790', title: 'Water Heater Install', when: 'Aug 26', amount: 9800, state: 'Released' },
    { id: 'TC-8776', title: 'Kitchen Sink Repair', when: 'Aug 24', amount: 5600, state: 'Held' },
    { id: 'TC-8761', title: 'Socket Rewiring', when: 'Aug 21', amount: 6400, state: 'Released' },
    { id: 'TC-8744', title: 'Shower Line Leak', when: 'Aug 18', amount: 4300, state: 'Released' },
    { id: 'TC-8721', title: 'Fan Regulator Fix', when: 'Aug 14', amount: 2200, state: 'Released' },
  ],
}

export const STATS = [
  { label: 'Acceptance rate', value: '86%', delta: '+4%', good: true },
  { label: 'Avg. response', value: '9 min', delta: '3 min faster', good: true },
  { label: 'Completion rate', value: '98%', delta: '+1%', good: true },
  { label: 'Repeat customers', value: '31%', delta: '2% down', good: false },
]

export const TRUST_FACTORS = [
  { label: 'Identity & NIC verified', value: 100 },
  { label: 'Trade certification on file', value: 100 },
  { label: 'On-time arrival', value: 94 },
  { label: 'Quotation accuracy', value: 89 },
  { label: 'Completion evidence', value: 96 },
]

export const SERVICES = [
  { name: 'Leak Repair', jobs: 96, rate: 4.9, on: true },
  { name: 'Pipe Installation', jobs: 61, rate: 4.8, on: true },
  { name: 'Socket & Wiring', jobs: 74, rate: 4.8, on: true },
  { name: 'Water Heater Service', jobs: 43, rate: 4.7, on: true },
  { name: 'Fan & Light Fitting', jobs: 38, rate: 4.9, on: false },
]

export const DOCUMENTS = [
  { name: 'National Identity Card', state: 'Verified', when: 'Verified Jan 2019' },
  { name: 'Trade Certificate — Plumbing', state: 'Verified', when: 'Verified Mar 2021' },
  { name: 'Electrical Wireman Licence', state: 'Verified', when: 'Verified Nov 2022' },
  { name: 'Police Clearance Report', state: 'Expiring', when: 'Renew before Oct 2026' },
  { name: 'Public Liability Insurance', state: 'Missing', when: 'Adds 4 points to your trust score' },
]

export const THREADS = [
  { id: 'nimal', name: 'Nimal Perera', job: 'Kitchen Sink Leakage', last: 'Sure, 2 PM works for me.', time: '3:30 PM', unread: 1, hue: 212 },
  { id: 'sanduni', name: 'Sanduni Silva', job: 'Ceiling Fan Not Working', last: 'Is the regulator included?', time: '1:31 PM', unread: 2, hue: 320 },
  { id: 'ruwan', name: 'Ruwan Jayasuriya', job: 'Bathroom Tap Replacement', last: 'Thanks, see you Saturday.', time: '1:35 PM', unread: 0, hue: 160 },
  { id: 'ayesha', name: 'Ayesha Kumari', job: 'Power Trip in Kitchen', last: 'The breaker tripped again.', time: '11:20 AM', unread: 0, hue: 24 },
  { id: 'support', name: 'TrustCraft Support', job: 'Payout inquiry', last: 'Your payout is scheduled for Friday.', time: 'Yesterday', unread: 0, hue: 200 },
]

export const CHAT_SEED = [
  { from: 'them', text: 'Hello, is the leak something you can fix today?', time: '3:12 PM' },
  { from: 'me', text: 'Yes. From the photos it looks like the trap seal has gone.', time: '3:18 PM' },
  { from: 'me', text: 'I can be there between 2 and 4 tomorrow to confirm.', time: '3:19 PM' },
  { from: 'them', text: 'Sure, 2 PM works for me.', time: '3:30 PM' },
]

export const money = (n: number) => n.toLocaleString('en-US')
