import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Pro, StageState, ScreenId } from './types'
import { deriveStages } from './flow'
import { customerStep } from './case'
import { useAvailability, useCase, nowTime, resetCase } from './caseStore'

export { STAGES, DONE_STEP, nextAction } from './flow'
export { CATEGORIES } from './case'

// ── Demo data ────────────────────────────────────────────────────────────────
// The prototype ships its own fixtures; nothing here talks to a server so the
// walkthrough is deterministic on any machine.
//
// `kamal` is the professional the second half of the demo is logged in as (see
// worker/data.ts WORKER) — the same person on both sides of the transaction.

export const PROS: Pro[] = [
  {
    id: 'kamal', name: 'Kamal Perera', trade: 'Verified Plumber & Electrician', category: 'plumbers',
    trust: 92, rating: 4.8, reviews: 214, distanceKm: 1.2, years: 7, jobs: 312,
    inspectionFee: 1500, match: 97, hue: 212, availableNow: true,
    services: ['Leak Repair', 'Pipe Installation', 'Socket & Wiring', 'Water Heater Service'],
    about: 'Plumbing and electrical repairs across Colombo since 2019. I explain the fix before I start.',
    availability: 'Available now · on the road until 8:00 PM',
  },
  {
    id: 'kasun', name: 'Kasun Perera', trade: 'Verified Plumber', category: 'plumbers',
    trust: 94, rating: 4.9, reviews: 126, distanceKm: 2.4, years: 8, jobs: 412,
    inspectionFee: 1500, match: 94, hue: 190, availableNow: false,
    services: ['General Plumbing', 'Leak Repair', 'Pipe Installation', 'Drain Cleaning'],
    about: 'I specialize in all kinds of plumbing repairs and installations with quality work and honest prices.',
    availability: 'Booked today · next free tomorrow 8:00 AM',
  },
  {
    id: 'nimal', name: 'Nimal Fernando', trade: 'Verified Plumber', category: 'plumbers',
    trust: 91, rating: 4.8, reviews: 98, distanceKm: 3.1, years: 6, jobs: 288,
    inspectionFee: 1200, match: 91, hue: 160, availableNow: false,
    services: ['Leak Repair', 'Bathroom Fittings', 'Water Tank Service'],
    about: 'Six years of residential plumbing across Colombo. Fast response on emergency leaks.',
    availability: 'Booked today · next free tomorrow 9:00 AM',
  },
  {
    id: 'ruwan', name: 'Ruwan Silva', trade: 'Verified Plumber', category: 'plumbers',
    trust: 89, rating: 4.7, reviews: 76, distanceKm: 1.8, years: 10, jobs: 501,
    inspectionFee: 1000, match: 89, hue: 24, availableNow: false,
    services: ['General Plumbing', 'Drain Cleaning', 'Hot Water Systems'],
    about: 'Ten years on the tools. I explain the fix before I start so there are no surprises.',
    availability: 'Tomorrow · 8:00 AM to 5:00 PM',
  },
  {
    id: 'chamara', name: 'Chamara Bandara', trade: 'Verified Electrician', category: 'electricians',
    trust: 92, rating: 4.8, reviews: 141, distanceKm: 4.0, years: 9, jobs: 377,
    inspectionFee: 1400, match: 93, hue: 275, availableNow: true,
    services: ['Wiring', 'Breaker Panels', 'Lighting Installation'],
    about: 'Certified electrician for domestic wiring, board upgrades and fault finding.',
    availability: 'Available now · 8:00 AM to 7:00 PM',
  },
  {
    id: 'ishara', name: 'Ishara Jayasuriya', trade: 'Verified AC Technician', category: 'ac',
    trust: 90, rating: 4.7, reviews: 88, distanceKm: 5.2, years: 7, jobs: 233,
    inspectionFee: 1800, match: 90, hue: 200, availableNow: true,
    services: ['AC Service', 'Gas Refill', 'Split Unit Installation'],
    about: 'AC servicing and repairs for split and inverter units, residential and small office.',
    availability: 'Available now · 10:00 AM to 6:00 PM',
  },
]

export const proById = (id: string | null) => PROS.find(p => p.id === id) ?? PROS[0]

/** PROS with live availability folded in — the professional's own switch in
 *  the other app is what flips these. */
export function usePros(): Pro[] {
  const avail = useAvailability()
  return PROS.map(p => ({ ...p, availableNow: avail[p.id] ?? p.availableNow }))
}

export function usePro(id: string | null): Pro {
  const avail = useAvailability()
  const p = proById(id)
  return { ...p, availableNow: avail[p.id] ?? p.availableNow }
}

export const LOCATIONS = ['Colombo 04', 'Colombo 05', 'Colombo 07', 'Nugegoda', 'Dehiwala', 'Moratuwa', 'Kottawa']

export const NOTIFICATIONS: { id: string; title: string; time: string; kind: string; to: ScreenId }[] = [
  { id: 'n1', title: 'Kasun Perera submitted an assessment for your request.', time: '10:30 AM', kind: 'assessment', to: 'assessment' },
  { id: 'n2', title: 'Your inspection is scheduled for Aug 24, 1:30 PM.', time: 'Yesterday, 9:15 PM', kind: 'inspection', to: 'status' },
  { id: 'n3', title: 'New quotation received for Kitchen Sink Leak.', time: 'Yesterday, 6:40 PM', kind: 'quote', to: 'quotation' },
  { id: 'n4', title: 'Payment of LKR 1,500 was successful.', time: 'Aug 20, 2:30 PM', kind: 'payment', to: 'record' },
  { id: 'n5', title: 'Your service has been marked as completed.', time: 'Aug 19, 8:10 PM', kind: 'done', to: 'work-completed' },
  { id: 'n6', title: 'Do not forget to leave a review for Kasun Perera.', time: 'Aug 19, 7:55 PM', kind: 'review', to: 'review' },
]

export const PAST_CASES = [
  { id: 'c2', title: 'AC Not Cooling', pro: 'Nimal Fernando', state: 'Inspection done', when: 'Yesterday', tone: 'warning' as const },
  { id: 'c3', title: 'Bathroom Repair', pro: 'Ruwan Silva', state: 'Completed', when: 'Monday, Aug 21', tone: 'muted' as const },
  { id: 'c4', title: 'Pipe Leak', pro: 'Kasun Perera', state: 'Completed', when: 'Jan 15', tone: 'muted' as const },
]

export const THREADS = [
  { id: 'kamal', last: 'Thank you! I am on the way.', time: '10:32 AM', unread: 2 },
  { id: 'nimal', last: 'Quotation sent.', time: '9:10 AM', unread: 0 },
  { id: 'ruwan', last: 'Work completed.', time: 'Yesterday', unread: 0 },
  { id: 'support', last: 'How can we help you?', time: 'Aug 20', unread: 0 },
]

export const CHAT_SEED = [
  { from: 'pro', text: 'Hi, I have reviewed your request.', time: '10:26 AM' },
  { from: 'pro', text: 'I think we need an inspection to confirm the exact cause.', time: '10:26 AM' },
  { from: 'me', text: 'Okay, please let me know the available times.', time: '10:28 AM' },
  { from: 'pro', text: 'Sure, I will send them now.', time: '10:30 AM' },
]

export const PROFILE = {
  name: 'Nadeesha Fernando',
  address: 'Colombo 05',
  contact: '071 123 4567',
  email: 'nadeesha@email.com',
  nic: '987654321V',
  moneySpent: 28650,
  servicesUsed: 5,
  months: [
    { m: 'Mar', v: 3200 }, { m: 'Apr', v: 5400 }, { m: 'May', v: 2100 },
    { m: 'Jun', v: 6800 }, { m: 'Jul', v: 4450 }, { m: 'Aug', v: 6700 },
  ],
}

export const money = (n: number) => n.toLocaleString('en-US')

// ── State ────────────────────────────────────────────────────────────────────
// Everything that crosses the customer/professional boundary lives in the
// shared case (see caseStore.ts).  What is left here is customer-app UI state
// only: which profile is open, the chat thread, the review they wrote.

export interface Demo {
  viewProId: string
  chatWith: string
  rating: number
  review: string
  chat: { from: string; text: string; time: string }[]
  notificationsRead: boolean
}

const INITIAL: Demo = {
  viewProId: 'kamal',
  chatWith: 'kamal',
  rating: 0,
  review: '',
  chat: CHAT_SEED,
  notificationsRead: false,
}

interface Ctx {
  d: Demo
  set: (patch: Partial<Demo>) => void
  send: (text: string) => void
  reset: () => void
  stages: StageState[]
  step: number
}

const C = createContext<Ctx>(null as unknown as Ctx)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [d, setD] = useState<Demo>(INITIAL)
  const c = useCase()

  const set = useCallback((patch: Partial<Demo>) => setD(p => ({ ...p, ...patch })), [])
  const send = useCallback((text: string) => {
    setD(p => ({ ...p, chat: [...p.chat, { from: 'me', text, time: nowTime() }] }))
  }, [])
  const reset = useCallback(() => { resetCase(); setD(INITIAL) }, [])

  const step = customerStep(c.status)
  const stages = useMemo<StageState[]>(
    () => deriveStages(step, c.inspection.status === 'skipped'),
    [step, c.inspection.status],
  )

  return <C.Provider value={{ d, set, send, reset, stages, step }}>{children}</C.Provider>
}

export const useDemo = () => useContext(C)
