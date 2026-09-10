// Run: node src/flow.test.ts
import assert from 'node:assert/strict'
import { STAGES, DONE_STEP, deriveStages, nextAction } from './flow.ts'
import { EMPTY_INSPECTION, customerStep, type CaseStatus, type ServiceCase } from './case.ts'

const c = (patch: Partial<ServiceCase> = {}): ServiceCase => ({
  id: 'TC-1', customer: 'Nadeesha', category: 'plumbers', title: 'Kitchen Sink Leakage',
  description: 'Water leaking under the sink.', attachments: [], location: 'Colombo 05',
  serviceType: 'urgent', scheduledDate: '', scheduledTime: '',
  proId: 'kamal', analysis: '', analysisAt: '', inspection: EMPTY_INSPECTION,
  quotation: null, quotationPaid: false, completion: null, status: 'draft', createdAt: '', updatedAt: '',
  ...patch,
})

// Exactly one stage is current until the case finishes, and progress only ever
// runs done → current → pending in that order.
for (let step = 0; step <= DONE_STEP; step++) {
  const stages = deriveStages(step, false)
  assert.equal(stages.length, STAGES.length)
  assert.equal(stages.filter(s => s.status === 'current').length, step < DONE_STEP ? 1 : 0, `step ${step}`)
  assert.equal(stages.filter(s => s.status === 'done').length, Math.min(step, STAGES.length))
  const order = stages.map(s => s.status).join(',')
  assert.ok(/^(done,)*(current,)?(pending,)*$/.test(order + ','), `out of order at step ${step}: ${order}`)
}

// A skipped inspection is still shown, labelled, never silently dropped.
assert.equal(deriveStages(4, true).length, STAGES.length)
assert.match(deriveStages(4, true)[3].label, /skipped/)

// Real timestamps override the fixture stamps when the case supplies them.
assert.equal(deriveStages(2, false, { request: 'Sep 10, 9:01 AM' })[0].detail, 'Sep 10, 9:01 AM')

// Every step offers a next action.
for (let step = 0; step <= DONE_STEP; step++) {
  const a = nextAction(step, c())
  assert.ok(a.label && a.to && a.hint, `step ${step} has no action`)
}

// The inspection branch is driven by the professional, not by the step number.
assert.equal(nextAction(3, c({ status: 'analysis_sent' })).to, 'assessment')
assert.equal(
  nextAction(3, c({ status: 'inspection_requested', inspection: { ...EMPTY_INSPECTION, status: 'requested' } })).label,
  'Respond to Inspection Request',
)
assert.equal(
  nextAction(3, c({ status: 'inspection_confirmed', inspection: { ...EMPTY_INSPECTION, status: 'confirmed' } })).to,
  'inspection-payment',
)
assert.ok(
  nextAction(3, c({
    status: 'inspection_confirmed',
    inspection: { ...EMPTY_INSPECTION, status: 'confirmed', paid: true },
  })).waiting,
)

// The customer is never offered a quotation that has not been sent.
assert.ok(nextAction(4, c({ status: 'inspection_completed' })).waiting)
assert.equal(
  nextAction(4, c({
    status: 'quotation_sent',
    quotation: { items: [], duration: '', warranty: '', notes: '', sentAt: '', validUntil: '' },
  })).to,
  'quotation',
)
assert.equal(nextAction(DONE_STEP, c({ status: 'closed' })).to, 'record')

// Walking the shared status machine reaches completion without looping, and
// every status maps to an action.
const PATH: CaseStatus[] = [
  'draft', 'submitted', 'assigned', 'under_analysis', 'analysis_sent',
  'inspection_requested', 'inspection_confirmed', 'inspection_completed',
  'quotation_sent', 'quotation_accepted', 'in_progress', 'work_completed',
  'confirmed', 'closed',
]
let last = -1
for (const status of PATH) {
  const step = customerStep(status)
  assert.ok(step >= last, `status ${status} rewound the customer rail`)
  assert.ok(nextAction(step, c({ status })).label)
  last = step
}
assert.equal(last, DONE_STEP, 'flow did not reach completion')

console.log('flow: ok')
