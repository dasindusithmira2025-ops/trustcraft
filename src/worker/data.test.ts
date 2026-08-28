// Run: node src/worker/data.test.ts
import assert from 'node:assert/strict'
import { LAST_STEP, STAGES, deriveSteps, nextAction, quoteTotals, SEED_QUOTE } from './data.ts'

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
  const a = nextAction(step)
  assert.ok(a.label && a.to && a.hint, `step ${step} has no action`)
}
assert.equal(nextAction(3).to, 'quote')
assert.equal(nextAction(5).to, 'complete')
assert.ok(nextAction(4).waiting, 'payment stage must read as waiting on the customer')

// Driving the CTA from a fresh job reaches completion without looping.
let step = 0
for (let i = 0; i < 30 && step < LAST_STEP; i++) {
  const a = nextAction(step)
  // 'quote' and 'complete' advance from their own screens, not the rail.
  step = a.advance ?? step + 1
}
assert.equal(step, LAST_STEP, 'job flow did not reach completion')

// Money: the platform fee comes out of the quote, never gets added on top.
const t = quoteTotals(SEED_QUOTE)
assert.equal(t.subtotal, SEED_QUOTE.reduce((s, i) => s + i.qty * i.price, 0))
assert.equal(t.payout + t.fee, t.subtotal)
assert.ok(t.payout < t.subtotal && t.payout > 0)
assert.deepEqual(quoteTotals([]), { subtotal: 0, fee: 0, payout: 0 })

console.log('worker: ok')
