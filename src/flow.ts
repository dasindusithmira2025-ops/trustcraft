// Pure case-progress logic, kept free of JSX so it can be run and tested with
// plain `node src/flow.test.ts`.
import type { ScreenId, StageState } from './types'
import type { ServiceCase } from './case'

export const STAGES: { key: string; label: string; screen: ScreenId | null }[] = [
  { key: 'request', label: 'Request Created', screen: 'problem' },
  { key: 'selected', label: 'Professional Selected', screen: 'confirmation' },
  { key: 'assessment', label: 'Problem Assessment', screen: 'assessment' },
  { key: 'inspection', label: 'Inspection', screen: 'set-inspection' },
  { key: 'quotation', label: 'Quotation', screen: 'quotation' },
  { key: 'payment', label: 'Payment', screen: 'quotation-payment' },
  { key: 'work', label: 'Work', screen: null },
  { key: 'completion', label: 'Completion', screen: 'work-completed' },
  { key: 'review', label: 'Review', screen: 'review' },
]

export const DONE_STEP = STAGES.length

const STAMPS: Record<string, string> = {
  request: 'Aug 22, 10:15 AM',
  selected: 'Aug 22, 10:25 AM',
  assessment: 'Aug 22, 11:05 AM',
  inspection: 'Aug 24, 1:30 PM',
  quotation: 'Aug 24, 3:30 PM',
  payment: 'Aug 24, 4:05 PM',
  work: 'Aug 24, 4:15 PM',
  completion: 'Aug 24, 6:30 PM',
  review: 'Aug 24, 6:45 PM',
}

export function deriveStages(
  step: number,
  inspectionSkipped: boolean,
  stamps: Record<string, string> = {},
): StageState[] {
  return STAGES.map((s, i) => ({
    key: s.key,
    label: s.key === 'inspection' && inspectionSkipped ? 'Inspection (skipped)' : s.label,
    detail: i < step ? (stamps[s.key] ?? STAMPS[s.key]) : i === step ? 'In progress' : 'Pending',
    status: i < step ? 'done' : i === step ? 'current' : 'pending',
    screen: s.screen,
  }))
}

export interface Action { label: string; to: ScreenId; hint: string; waiting?: boolean }

/**
 * The single "what happens next" call the Problem Status screen renders.
 * Everything it branches on comes off the shared case, so the customer is
 * never offered an action the professional has not unlocked yet.
 */
export function nextAction(step: number, c: ServiceCase): Action {
  const { inspection: ins } = c
  switch (step) {
    case 0:
      return { label: 'Finish Your Request', to: 'problem', hint: 'Describe the problem and submit it.' }
    case 1:
      return { label: 'Choose a Professional', to: 'recommendations', hint: 'Pick who takes this job.' }
    case 2:
      return {
        label: 'View Request Status', to: 'assessment', waiting: true,
        hint: c.status === 'under_analysis'
          ? 'Your professional is analysing the problem now.'
          : 'Your professional has the request and will send an analysis.',
      }
    case 3:
      if (ins.status === 'requested') {
        return { label: 'Respond to Inspection Request', to: 'assessment', hint: 'An on-site inspection has been requested.' }
      }
      if (ins.status === 'confirmed') {
        return ins.paid
          ? { label: 'View Assessment', to: 'assessment', waiting: true, hint: `Inspection confirmed for ${ins.confirmedDate} at ${ins.confirmedTime}.` }
          : { label: 'Pay Inspection Fee', to: 'inspection-payment', hint: 'Pay the visit charge to confirm the slot.' }
      }
      return { label: 'View Analysis', to: 'assessment', hint: 'Your professional shared their analysis.' }
    case 4:
      return c.quotation
        ? { label: 'View Quotation', to: 'quotation', hint: 'Review the quotation and agree to proceed.' }
        : { label: 'View Assessment', to: 'assessment', waiting: true, hint: 'Your professional is preparing a quotation.' }
    case 5:
      return { label: 'Pay Quotation', to: 'quotation-payment', hint: 'Approve payment so work can start.' }
    case 6:
      return { label: 'Message Professional', to: 'chat', waiting: true, hint: 'Work is in progress.' }
    case 7:
      return { label: 'Confirm Completion', to: 'work-completed', hint: 'Check the work and confirm.' }
    case 8:
      return { label: 'Rate & Review', to: 'review', hint: 'Tell others how it went.' }
    default:
      return { label: 'View Service Record', to: 'record', hint: 'This case is complete.' }
  }
}
