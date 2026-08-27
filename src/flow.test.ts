// Run: node src/flow.test.ts
import assert from 'node:assert/strict'
import { STAGES, DONE_STEP, deriveStages, nextAction } from './flow.ts'

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

// Every step offers a next action, and the unpaid-inspection branch differs.
for (let step = 0; step <= DONE_STEP; step++) {
  const a = nextAction(step, false)
  assert.ok(a.label && a.to && a.hint, `step ${step} has no action`)
}
assert.equal(nextAction(3, false).to, 'set-inspection')
assert.equal(nextAction(3, true).to, 'quotation')
assert.equal(nextAction(DONE_STEP, true).to, 'record')

// Following the actions from a fresh case reaches the end without looping.
let step = 2
for (let i = 0; i < 20 && step < DONE_STEP; i++) {
  const a = nextAction(step, true)
  step = a.advanceTo ?? step + 1
}
assert.equal(step, DONE_STEP, 'flow did not reach completion')

console.log('flow: ok')
