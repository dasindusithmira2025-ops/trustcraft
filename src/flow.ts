// Pure case-progress logic, kept free of JSX so it can be run and tested with
// plain `node src/flow.test.ts`.
import type { ScreenId, StageState } from './types'

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

export function deriveStages(step: number, inspectionSkipped: boolean): StageState[] {
  return STAGES.map((s, i) => ({
    key: s.key,
    label: s.key === 'inspection' && inspectionSkipped ? 'Inspection (skipped)' : s.label,
    detail: i < step ? STAMPS[s.key] : i === step ? 'In progress' : 'Pending',
    status: i < step ? 'done' : i === step ? 'current' : 'pending',
    screen: s.screen,
  }))
}

export interface Action { label: string; to: ScreenId; advanceTo?: number; hint: string }

/** The single "what happens next" call the Problem Status screen renders. */
export function nextAction(step: number, inspectionPaid: boolean): Action {
  switch (step) {
    case 0:
    case 1:
      return { label: 'Choose a Professional', to: 'recommendations', hint: 'Pick who takes this job.' }
    case 2:
      return { label: 'View Assessment', to: 'assessment', hint: 'Your professional sent an assessment.' }
    case 3:
      return inspectionPaid
        ? { label: 'View Quotation', to: 'quotation', advanceTo: 4, hint: 'Inspection done — a quotation is ready.' }
        : { label: 'Set Inspection', to: 'set-inspection', hint: 'Schedule the inspection to continue.' }
    case 4:
      return { label: 'View Quotation', to: 'quotation', hint: 'Review the quotation and agree to proceed.' }
    case 5:
      return { label: 'Pay Quotation', to: 'quotation-payment', hint: 'Approve payment so work can start.' }
    case 6:
      return { label: 'View Work Update', to: 'work-completed', advanceTo: 7, hint: 'Work is in progress.' }
    case 7:
      return { label: 'Confirm Completion', to: 'work-completed', hint: 'Check the work and confirm.' }
    case 8:
      return { label: 'Rate & Review', to: 'review', hint: 'Tell others how it went.' }
    default:
      return { label: 'View Service Record', to: 'record', hint: 'This case is complete.' }
  }
}
