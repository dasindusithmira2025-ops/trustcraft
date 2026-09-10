// Run: node src/worker/data.test.ts
import assert from 'node:assert/strict'
import {
  LAST_STEP, STAGES, caseToOpportunity, deriveSteps, nextAction, quoteTotals, SEED_QUOTE,
} from './data.ts'
import { EMPTY_INSPECTION, workerStep, type CaseStatus, type ServiceCase } from '../case.ts'

const c = (patch: Partial<ServiceCase> = {}): ServiceCase => ({
  id: 'TC-9014', customer: 'Nadeesha Fernando', category: 'plumbers', title: 'Kitchen Sink Leakage',
  description: 'Water leaking under the sink.', attachments: [], location: 'Colombo 05',
  serviceType: 'urgent', scheduledDate: '', scheduledTime: '',
  proId: 'kamal', analysis: '', analysisAt: '', inspection: EMPTY_INSPECTION,
  quotation: null, quotationPaid: false, completion: null, status: 'assigned', createdAt: 'Sep 10, 9:00 AM', updatedAt: '',
  ...patch,
})

// Exactly one stage is current until the job closes, and the rail never runs
// pending → done out of order.
for (let step = 0; step <= LAST_STEP; step++) {
  const steps = deriveSteps(step)
  assert.equal(steps.length, STAGES.length)
  assert.equal(steps.filter(s => s.status === 'current').length, step < LAST_STEP ? 1 : 0, `step ${step}`)
  assert.equal(steps.filter(s => s.status === 'done').length, Math.min(step, STAGES.length))
  const order = steps.map(s => s.status).join(',') + ','
  assert.ok(/^(done,)*(current,)?(pending,)*$/.test(order), `out of order at step ${step}: ${order}`)
}

// Every stage offers the professional exactly one thing to do next.
for (let step = 0; step <= LAST_STEP; step++) {
  const a = nextAction(step, c())
  assert.ok(a.label && a.to && a.hint, `step ${step} has no action`)
}
assert.equal(nextAction(0, c()).to, 'analysis', 'Begin Problem Analysis must open the analysis screen')
assert.match(nextAction(0, c()).label, /Begin Problem Analysis/)
assert.equal(nextAction(3, c({ status: 'inspection_completed' })).to, 'quote')
assert.equal(nextAction(5, c({ status: 'in_progress' })).to, 'complete')
assert.ok(nextAction(4, c({ status: 'quotation_sent' })).waiting, 'payment stage waits on the customer')

// While an inspection is out for approval the professional is told to wait,
// and once confirmed they are told to close it out.
const requested = c({ status: 'inspection_requested', inspection: { ...EMPTY_INSPECTION, status: 'requested' } })
assert.ok(nextAction(2, requested).waiting)
const confirmed = c({
  status: 'inspection_confirmed',
  inspection: { ...EMPTY_INSPECTION, status: 'confirmed', confirmedDate: 'Sat', confirmedTime: '1:30 PM' },
})
assert.match(nextAction(2, confirmed).label, /Inspection Completed/)

// Driving the shared status machine reaches completion without looping.
const PATH: CaseStatus[] = [
  'assigned', 'under_analysis', 'analysis_sent', 'inspection_requested',
  'inspection_confirmed', 'inspection_completed', 'quotation_sent',
  'quotation_accepted', 'in_progress', 'work_completed', 'confirmed', 'closed',
]
let last = -1
for (const status of PATH) {
  const step = workerStep(status)
  assert.ok(step >= last, `status ${status} rewound the job rail`)
  last = step
}
assert.equal(last, LAST_STEP, 'job flow did not reach completion')

// The live customer request is presented as an opportunity without inventing
// any data of its own.
const opp = caseToOpportunity(c())
assert.equal(opp.id, 'TC-9014')
assert.equal(opp.title, 'Kitchen Sink Leakage')
assert.equal(opp.summary, 'Water leaking under the sink.')
assert.equal(opp.urgent, true)
assert.equal(opp.category, 'plumbers')
assert.ok(opp.live)
const sched = caseToOpportunity(c({ serviceType: 'scheduled', scheduledDate: 'Sat, 24 Aug 2026', scheduledTime: '1:30 PM' }))
assert.equal(sched.urgent, false)
assert.match(sched.window, /24 Aug/)

// Money: the platform fee comes out of the quote, never gets added on top.
const t = quoteTotals(SEED_QUOTE)
assert.equal(t.subtotal, SEED_QUOTE.reduce((s, i) => s + i.qty * i.price, 0))
assert.equal(t.payout + t.fee, t.subtotal)
assert.ok(t.payout < t.subtotal && t.payout > 0)
assert.deepEqual(quoteTotals([]), { subtotal: 0, fee: 0, payout: 0 })

console.log('worker: ok')
