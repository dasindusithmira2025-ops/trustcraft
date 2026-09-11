/**
 * The live instance of the shared service request.
 *
 * It is a module-level external store rather than a React context on purpose:
 * the customer shell and the professional shell mount and unmount as the user
 * flips the role switch, and the case has to outlive both.  `useSyncExternal-
 * Store` gives every screen in either app the same object and the same
 * re-render.
 */
import { useSyncExternalStore } from 'react'
import {
  EMPTY_INSPECTION, type Attachment, type CaseStatus, type Inspection,
  sameDayInspectionSlot, type Quotation, type ServiceCase, rank,
} from './case'

export const nowTime = () =>
  new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

export const nowStamp = () =>
  `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${nowTime()}`

/** Demo media: no binary assets ship with the prototype, so the seeded photo
 *  renders through the existing gradient placeholder. Real captures carry a
 *  blob URL and render as actual <img>/<video>/<audio>. */
const SEED_PHOTO: Attachment = { id: 'a-seed', kind: 'photo', name: 'sink-leak.jpg', hue: 205 }

const INITIAL: ServiceCase = {
  id: 'TC-9014',
  customer: 'Nadeesha Fernando',
  category: 'plumbers',
  title: 'Kitchen Sink Leakage',
  description:
    'Water has been leaking underneath my kitchen sink since this morning. The leak becomes worse when I use the tap.',
  attachments: [SEED_PHOTO],
  location: 'Colombo 05',
  serviceType: 'scheduled',
  scheduledDate: '',
  scheduledTime: '',
  proId: null,
  analysis: '',
  analysisAt: '',
  inspection: EMPTY_INSPECTION,
  quotation: null,
  quotationPaid: false,
  completion: null,
  status: 'draft',
  createdAt: '',
  updatedAt: '',
}

let current: ServiceCase = INITIAL
const listeners = new Set<() => void>()

const emit = () => listeners.forEach(l => l())

export const getCase = () => current

export function subscribe(l: () => void) {
  listeners.add(l)
  return () => { listeners.delete(l) }
}

export function useCase(): ServiceCase {
  return useSyncExternalStore(subscribe, getCase, getCase)
}

function write(patch: Partial<ServiceCase>) {
  current = { ...current, ...patch, updatedAt: nowStamp() }
  emit()
}

/** Status only ever moves forward, so no screen can rewind the case. */
function to(status: CaseStatus, patch: Partial<ServiceCase> = {}) {
  write(rank(status) > rank(current.status) ? { ...patch, status } : patch)
}

const patchInspection = (p: Partial<Inspection>) =>
  ({ inspection: { ...current.inspection, ...p } })

// ── Customer actions ─────────────────────────────────────────────────────────

export function updateDraft(patch: Partial<ServiceCase>) {
  write(patch)
}

export function addAttachment(a: Attachment) {
  write({ attachments: [...current.attachments, a] })
}

export function removeAttachment(id: string) {
  const gone = current.attachments.find(a => a.id === id)
  if (gone?.url) URL.revokeObjectURL(gone.url)
  write({ attachments: current.attachments.filter(a => a.id !== id) })
}

export function submitRequest(patch: Partial<ServiceCase>) {
  const stamp = nowStamp()
  write({ ...patch, createdAt: current.createdAt || stamp })
  to('submitted')
}

export function assignPro(proId: string) {
  to('assigned', { proId })
}

/** Customer agrees to the inspection the professional asked for. */
export function acceptInspection(date: string, time: string) {
  const confirmedDate = current.serviceType === 'urgent' && current.inspection.proposedDate
    ? current.inspection.proposedDate
    : date
  const confirmedTime = current.serviceType === 'urgent' && current.inspection.proposedTime
    ? current.inspection.proposedTime
    : time
  to('inspection_confirmed', patchInspection({
    status: 'confirmed', confirmedDate, confirmedTime, confirmedAt: nowStamp(),
  }))
}

export function payInspection() {
  write(patchInspection({ paid: true }))
}

export function acceptQuotation() {
  to('quotation_accepted')
}

export function payQuotation() {
  to('in_progress', { quotationPaid: true })
}

export function confirmCompletion() {
  to('confirmed')
}

export function closeCase() {
  to('closed')
}

// ── Professional actions ─────────────────────────────────────────────────────

export function beginAnalysis() {
  to('under_analysis')
}

export function submitAnalysis(text: string) {
  to('analysis_sent', { analysis: text.trim(), analysisAt: nowStamp() })
}

export function requestInspection(reason: string, date: string, time: string) {
  const urgentSlot = current.serviceType === 'urgent'
    ? sameDayInspectionSlot(current.createdAt, nowStamp())
    : { date, time }
  to('inspection_requested', patchInspection({
    status: 'requested', reason: reason.trim(), proposedDate: urgentSlot.date, proposedTime: urgentSlot.time || nowTime(),
    requestedAt: nowStamp(),
  }))
}

export function completeInspection() {
  to('inspection_completed', patchInspection({ status: 'completed', completedAt: nowStamp() }))
}

/** Professional decides the photos are enough and quotes without a visit. */
export function skipInspection() {
  to('inspection_completed', patchInspection({ status: 'skipped' }))
}

export function sendQuotation(q: Omit<Quotation, 'sentAt'>) {
  to('quotation_sent', { quotation: { ...q, sentAt: nowStamp() } })
}

export function completeWork(summary: string, photos: number) {
  to('work_completed', { completion: { summary: summary.trim(), photos, at: nowStamp() } })
}

export function resetCase() {
  current.attachments.forEach(a => a.url && URL.revokeObjectURL(a.url))
  current = INITIAL
  emit()
}

/**
 * The print-document generator (src/gallery.tsx) renders every screen at once
 * against this one case, so it seeds a representative mid-flight state instead
 * of per-screen fixtures.
 */
export function seedGalleryCase() {
  current = {
    ...INITIAL,
    proId: 'kamal',
    serviceType: 'urgent',
    createdAt: 'Aug 22, 10:15 AM',
    updatedAt: 'Aug 24, 3:30 PM',
    analysis:
      'The leak appears to be coming from the sink drain connection. The pipe joint may need replacement.',
    analysisAt: 'Aug 22, 11:05 AM',
    inspection: {
      ...EMPTY_INSPECTION,
      status: 'completed',
      reason: 'I need to inspect the pipe connections before providing an accurate quotation.',
      proposedDate: 'Sat, 24 Aug 2026', proposedTime: '1:30 PM',
      confirmedDate: 'Sat, 24 Aug 2026', confirmedTime: '1:30 PM',
      requestedAt: 'Aug 22, 11:10 AM', confirmedAt: 'Aug 22, 11:40 AM',
      completedAt: 'Aug 24, 2:15 PM', paid: true,
    },
    quotation: {
      items: [
        { id: 'q1', name: 'PVC Trap Assembly', qty: 1, price: 1450 },
        { id: 'q2', name: 'Compression Washer Set', qty: 2, price: 175 },
        { id: 'q3', name: 'Replacement Labour', qty: 1, price: 2500 },
      ],
      duration: '2 – 3 hours', warranty: '30 days', notes: '',
      sentAt: 'Aug 24, 3:30 PM', validUntil: 'Aug 29, 2026',
    },
    status: 'quotation_sent',
  }
}

// ── Professional availability ────────────────────────────────────────────────
// Shared for the same reason the case is: the professional flips their own
// switch, and the customer's urgent matching has to see it immediately.

let availability: Record<string, boolean> = {
  kamal: true, kasun: false, nimal: false, ruwan: false, chamara: true, ishara: true,
}
const availListeners = new Set<() => void>()

export const isAvailable = (id: string) => availability[id] ?? false

export function setAvailable(id: string, on: boolean) {
  if (availability[id] === on) return
  availability = { ...availability, [id]: on }
  availListeners.forEach(l => l())
}

const availSnapshot = () => availability

export function useAvailability(): Record<string, boolean> {
  return useSyncExternalStore(
    l => { availListeners.add(l); return () => { availListeners.delete(l) } },
    availSnapshot,
    availSnapshot,
  )
}

// ── Toasts ───────────────────────────────────────────────────────────────────
// Same external-store trick, so any screen in either app can confirm an action
// without threading callbacks through the shells.

let toastMsg: string | null = null
let toastId = 0
const toastListeners = new Set<() => void>()
let toastTimer: ReturnType<typeof setTimeout> | undefined

const toastSnapshot = () => toastMsg

export function subscribeToast(l: () => void) {
  toastListeners.add(l)
  return () => { toastListeners.delete(l) }
}

export function toast(msg: string) {
  toastMsg = msg
  const mine = ++toastId
  toastListeners.forEach(l => l())
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    if (mine !== toastId) return
    toastMsg = null
    toastListeners.forEach(l => l())
  }, 2200)
}

export function useToast() {
  return useSyncExternalStore(subscribeToast, toastSnapshot, toastSnapshot)
}
