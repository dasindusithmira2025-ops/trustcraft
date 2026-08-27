import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Pro, StageState, ScreenId } from './types'
import { deriveStages } from './flow'

export { STAGES, DONE_STEP, nextAction } from './flow'

// ── Demo data ────────────────────────────────────────────────────────────────
// The prototype ships its own fixtures; nothing here talks to a server so the
// walkthrough is deterministic on any machine.

export const PROS: Pro[] = [
  {
    id: 'kasun', name: 'Kasun Perera', trade: 'Verified Plumber', trust: 94, rating: 4.9,
    reviews: 126, distanceKm: 2.4, years: 8, jobs: 412, inspectionFee: 1500, match: 94, hue: 212,
    services: ['General Plumbing', 'Leak Repair', 'Pipe Installation', 'Drain Cleaning'],
    about: 'I specialize in all kinds of plumbing repairs and installations with quality work and honest prices.',
    availability: 'Today · 8:00 AM to 8:00 PM',
  },
  {
    id: 'nimal', name: 'Nimal Fernando', trade: 'Verified Plumber', trust: 91, rating: 4.8,
    reviews: 98, distanceKm: 3.1, years: 6, jobs: 288, inspectionFee: 1200, match: 91, hue: 160,
    services: ['Leak Repair', 'Bathroom Fittings', 'Water Tank Service'],
    about: 'Six years of residential plumbing across Colombo. Fast response on emergency leaks.',
    availability: 'Today · 9:00 AM to 6:00 PM',
  },
  {
    id: 'ruwan', name: 'Ruwan Silva', trade: 'Verified Plumber', trust: 89, rating: 4.7,
    reviews: 76, distanceKm: 1.8, years: 10, jobs: 501, inspectionFee: 1000, match: 89, hue: 24,
    services: ['General Plumbing', 'Drain Cleaning', 'Hot Water Systems'],
    about: 'Ten years on the tools. I explain the fix before I start so there are no surprises.',
    availability: 'Tomorrow · 8:00 AM to 5:00 PM',
  },
  {
    id: 'chamara', name: 'Chamara Bandara', trade: 'Verified Electrician', trust: 92, rating: 4.8,
    reviews: 141, distanceKm: 4.0, years: 9, jobs: 377, inspectionFee: 1400, match: 0, hue: 275,
    services: ['Wiring', 'Breaker Panels', 'Lighting Installation'],
    about: 'Certified electrician for domestic wiring, board upgrades and fault finding.',
    availability: 'Today · 8:00 AM to 7:00 PM',
  },
  {
    id: 'ishara', name: 'Ishara Jayasuriya', trade: 'Verified AC Technician', trust: 90, rating: 4.7,
    reviews: 88, distanceKm: 5.2, years: 7, jobs: 233, inspectionFee: 1800, match: 0, hue: 190,
    services: ['AC Service', 'Gas Refill', 'Split Unit Installation'],
    about: 'AC servicing and repairs for split and inverter units, residential and small office.',
    availability: 'Today · 10:00 AM to 6:00 PM',
  },
]

export const proById = (id: string | null) => PROS.find(p => p.id === id) ?? PROS[0]

export const CATEGORIES = [
  { id: 'plumbers', label: 'Plumbers' },
  { id: 'electricians', label: 'Electricians' },
  { id: 'cleaners', label: 'Cleaners' },
  { id: 'carpenters', label: 'Carpenters' },
  { id: 'ac', label: 'AC Repair' },
  { id: 'painters', label: 'Painters' },
  { id: 'appliance', label: 'Appliance Repair' },
  { id: 'others', label: 'Others' },
]

export const LOCATIONS = ['Colombo 04', 'Colombo 05', 'Colombo 07', 'Nugegoda', 'Dehiwala', 'Moratuwa', 'Kottawa']

export const NOTIFICATIONS: { id: string; title: string; time: string; kind: string; to: ScreenId }[] = [
  { id: 'n1', title: 'Kasun Perera submitted an assessment for your request.', time: '10:30 AM', kind: 'assessment', to: 'assessment' },
  { id: 'n2', title: 'Your inspection is scheduled for Aug 24, 1:30 PM.', time: 'Yesterday, 9:15 PM', kind: 'inspection', to: 'status' },
  { id: 'n3', title: 'New quotation received for Kitchen Sink Leak.', time: 'Yesterday, 6:40 PM', kind: 'quote', to: 'quotation' },
  { id: 'n4', title: 'Payment of LKR 1,500 was successful.', time: 'Aug 20, 2:30 PM', kind: 'payment', to: 'record' },
  { id: 'n5', title: 'Your service has been marked as completed.', time: 'Aug 19, 8:10 PM', kind: 'done', to: 'work-completed' },
  { id: 'n6', title: 'Do not forget to leave a review for Kasun Perera.', time: 'Aug 19, 7:55 PM', kind: 'review', to: 'review' },
]

export const QUOTATION = {
  items: [
    { name: 'Inspection Fee', qty: 1, price: 1500 },
    { name: 'Replacement Valve', qty: 1, price: 2200 },
    { name: 'PVC Connector', qty: 2, price: 250 },
    { name: 'Rubber Washer', qty: 2, price: 75 },
    { name: 'Labour', qty: 1, price: 2000 },
    { name: 'Other Materials', qty: 1, price: 350 },
  ],
  duration: '2 – 3 Hours',
  warranty: '30 Days',
  validUntil: 'Aug 29, 2026',
}

export const quotationTotal = QUOTATION.items.reduce((s, i) => s + i.qty * i.price, 0)

export const PAST_CASES = [
  { id: 'c2', title: 'AC Not Cooling', pro: 'Nimal Fernando', state: 'Inspection done', when: 'Yesterday', tone: 'warning' as const },
  { id: 'c3', title: 'Bathroom Repair', pro: 'Ruwan Silva', state: 'Completed', when: 'Monday, Aug 21', tone: 'muted' as const },
  { id: 'c4', title: 'Pipe Leak', pro: 'Kasun Perera', state: 'Completed', when: 'Jan 15', tone: 'muted' as const },
]

export const THREADS = [
  { id: 'kasun', last: 'Thank you! I am on the way.', time: '10:32 AM', unread: 2 },
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

// ── Stage machine ────────────────────────────────────────────────────────────

export const money = (n: number) => n.toLocaleString('en-US')

// ── State ────────────────────────────────────────────────────────────────────

export interface Demo {
  problem: string
  location: string
  photos: number
  videos: number
  voice: boolean
  submittedAt: string
  proId: string | null
  viewProId: string
  chatWith: string
  step: number
  inspectionDate: string
  inspectionTime: string
  inspectionSkipped: boolean
  inspectionPaid: boolean
  quotationPaid: boolean
  rating: number
  review: string
  chat: { from: string; text: string; time: string }[]
  notificationsRead: boolean
}

const INITIAL: Demo = {
  problem: 'My kitchen sink is leaking underneath when I turn on the tap.',
  location: 'Colombo 05',
  photos: 1,
  videos: 1,
  voice: true,
  submittedAt: 'Aug 22, 2026 · 10:15 AM',
  proId: null,
  viewProId: 'kasun',
  chatWith: 'kasun',
  step: 0,
  inspectionDate: 'Sat, 24 Aug 2026',
  inspectionTime: '1:30 PM',
  inspectionSkipped: false,
  inspectionPaid: false,
  quotationPaid: false,
  rating: 0,
  review: '',
  chat: CHAT_SEED,
  notificationsRead: false,
}

interface Ctx {
  d: Demo
  set: (patch: Partial<Demo>) => void
  advance: (step: number) => void
  send: (text: string) => void
  reset: () => void
  stages: StageState[]
}

const C = createContext<Ctx>(null as unknown as Ctx)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [d, setD] = useState<Demo>(INITIAL)

  const set = useCallback((patch: Partial<Demo>) => setD(p => ({ ...p, ...patch })), [])
  // Stages only move forward: revisiting a finished screen must not rewind the case.
  const advance = useCallback((step: number) => setD(p => (step > p.step ? { ...p, step } : p)), [])
  const send = useCallback((text: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    setD(p => ({ ...p, chat: [...p.chat, { from: 'me', text, time }] }))
  }, [])
  const reset = useCallback(() => setD(INITIAL), [])

  const stages = useMemo<StageState[]>(
    () => deriveStages(d.step, d.inspectionSkipped),
    [d.step, d.inspectionSkipped],
  )

  return <C.Provider value={{ d, set, advance, send, reset, stages }}>{children}</C.Provider>
}

export const useDemo = () => useContext(C)
