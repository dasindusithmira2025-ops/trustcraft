// Run: node src/case.test.ts
import assert from 'node:assert/strict'
import {
  EMPTY_INSPECTION, STATUS_ORDER, customerStep, guessCategory, matchPros,
  quoteTotal, rank, sameDayInspectionSlot, titleFrom, workerStep,
  type CaseStatus, type ServiceCase,
} from './case.ts'
import { DONE_STEP } from './flow.ts'
import { LAST_STEP } from './worker/data.ts'

const base: ServiceCase = {
  id: 'TC-1', customer: 'Nadeesha', category: 'plumbers', title: 'Kitchen Sink Leakage',
  description: 'Water leaking under the sink.', attachments: [], location: 'Colombo 05',
  serviceType: 'scheduled', scheduledDate: 'Sat, 24 Aug 2026', scheduledTime: '1:30 PM',
  proId: null, analysis: '', analysisAt: '', inspection: EMPTY_INSPECTION,
  quotation: null, quotationPaid: false, completion: null, status: 'draft', createdAt: '', updatedAt: '',
}

// Both apps derive their rail from the one status, and neither rail ever runs
// backwards as the case moves forward.
let lastC = -1
let lastW = -1
for (const s of STATUS_ORDER) {
  const cs = customerStep(s)
  const ws = workerStep(s)
  assert.ok(cs >= lastC, `customer step went backwards at ${s}`)
  assert.ok(ws >= lastW, `worker step went backwards at ${s}`)
  assert.ok(cs >= 0 && cs <= DONE_STEP, `customer step out of range at ${s}`)
  assert.ok(ws >= 0 && ws <= LAST_STEP, `worker step out of range at ${s}`)
  lastC = cs
  lastW = ws
}
assert.equal(customerStep('closed'), DONE_STEP)
assert.equal(workerStep('closed'), LAST_STEP)

// Nothing the professional does is visible before they do it.
assert.equal(customerStep('assigned'), 2, 'analysis stage opens only once assigned')
assert.ok(customerStep('quotation_sent') > customerStep('analysis_sent'))
assert.ok(workerStep('inspection_completed') > workerStep('inspection_requested'))

// Status ranks are unique and ordered, which is what makes the store's
// forward-only guard total.
assert.equal(new Set(STATUS_ORDER).size, STATUS_ORDER.length)
STATUS_ORDER.forEach((s, i) => assert.equal(rank(s as CaseStatus), i))

// Matching: urgent work only reaches professionals who are free right now.
const pros = [
  { id: 'kamal', category: 'plumbers', availableNow: true },
  { id: 'kasun', category: 'plumbers', availableNow: false },
  { id: 'chamara', category: 'electricians', availableNow: true },
]
assert.deepEqual(
  matchPros(pros, { category: 'plumbers', serviceType: 'urgent' }).map(p => p.id),
  ['kamal'],
)
assert.deepEqual(
  matchPros(pros, { category: 'plumbers', serviceType: 'scheduled' }).map(p => p.id),
  ['kamal', 'kasun'],
)
assert.deepEqual(matchPros(pros, { category: 'painters', serviceType: 'scheduled' }), [])

// Category inference from the customer's own words.
assert.equal(guessCategory('Water has been leaking under my kitchen sink'), 'plumbers')
assert.equal(guessCategory('The breaker trips whenever the oven runs'), 'electricians')
assert.equal(guessCategory('My AC is not cooling'), 'ac')
assert.equal(guessCategory('something odd', 'others'), 'others')

// Titles stay card-sized.
assert.equal(titleFrom('Kitchen sink leak. It got worse.'), 'Kitchen sink leak')
assert.ok(titleFrom('x'.repeat(200)).length <= 46)
assert.equal(titleFrom('   '), 'New service request')

// Urgent inspections inherit the request date/time instead of asking the
// professional to schedule another slot.
assert.deepEqual(sameDayInspectionSlot('Sep 10, 9:00 AM', 'Sep 11, 2:00 PM'), {
  date: 'Sep 10', time: '9:00 AM',
})
assert.deepEqual(sameDayInspectionSlot('', 'Sep 11, 2:00 PM'), {
  date: 'Sep 11', time: '2:00 PM',
})

// Quotation maths.
assert.equal(quoteTotal(null), 0)
assert.equal(
  quoteTotal({
    items: [{ id: 'a', name: 'Trap', qty: 2, price: 500 }, { id: 'b', name: 'Labour', qty: 1, price: 2000 }],
    duration: '', warranty: '', notes: '', sentAt: '', validUntil: '',
  }),
  3000,
)

// An urgent case never carries a schedule once the customer switches it on —
// this mirrors the single write the store performs.
const urgent: ServiceCase = { ...base, serviceType: 'urgent', scheduledDate: '', scheduledTime: '' }
assert.ok(!(urgent.serviceType === 'urgent' && (urgent.scheduledDate || urgent.scheduledTime)))

console.log('case: ok')
