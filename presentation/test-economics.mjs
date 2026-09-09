/**
 * Pins every number the business-model chapter says out loud.
 *
 *   node presentation/test-economics.mjs
 *
 * Slide 17 computes its figures from the pricing rule rather than typing them,
 * so this is the guard that the rule itself still produces the numbers in the
 * speaker script, the judge Q&A pack and the sources file. If a rate or the
 * cap is ever edited, this fails before a judge ever sees the difference.
 */
import assert from 'node:assert/strict'
import {
  FREE_RATE, PRO_RATE, PRO_CAP, freeCost, proCost,
  TIERS, SCENARIO, TOTAL_GMV, CORE_MONTHLY, CORE_ANNUAL,
} from './business-slides.mjs'

// ── The proposed model ───────────────────────────────────────────────────────
assert.equal(FREE_RATE, 0.10, 'Free must be 10%')
assert.equal(PRO_RATE, 0.08, 'Pro must be 8%')
assert.equal(PRO_CAP, 1490, 'Pro subscription caps at LKR 1,490')

// The prototype charges 8% (src/worker/data.ts → PLATFORM_FEE). That is the
// same figure as the proposed Pro rate, and must never be read as the Free
// rate — the deck says CURRENT BUILD vs PROPOSED for exactly this reason.
assert.notEqual(FREE_RATE, 0.08, 'the built 8% logic is not the proposed Free rate')

// ── Professional economics: the three tiers on the left of slide 17 ─────────
assert.deepEqual(TIERS, [
  [100_000, 10_000, 9_490, 510],
  [200_000, 20_000, 17_490, 2_510],
  [300_000, 30_000, 25_490, 4_510],
])
assert.equal(TIERS[2][3] * 12, 54_120, 'annualised advantage at LKR 300,000/month')

// Pro is never the more expensive choice, because the subscription charges
// exactly the 2% gap until it caps. This is the claim the presenter makes on
// stage, so it is checked across the whole range, not just at three points.
for (let v = 0; v <= 1_000_000; v += 5_000) {
  assert.ok(proCost(v) <= freeCost(v) + 1e-9, `Pro costs more than Free at LKR ${v}`)
}
// Below the cap the two are identical; above it Pro pulls ahead for good.
// Binary rates make 0.10 - 0.08 slightly noisy, so these compare to the rupee
// rather than to the bit — which is the only precision the slide shows anyway.
const capAt = PRO_CAP / (FREE_RATE - PRO_RATE)          // LKR 74,500
assert.equal(Math.round(capAt), 74_500, 'Pro starts paying back at LKR 74,500')
assert.ok(Math.abs(freeCost(capAt) - proCost(capAt)) < 0.01, 'break-even sits at the cap')
assert.ok(freeCost(capAt * 2) - proCost(capAt * 2) > 1, 'Pro pays back above the cap')

// ── Platform economics: the illustrative scenario on the right ──────────────
const { freeCount, freeJobs, proCount, proJobs } = SCENARIO
assert.equal(freeCount + proCount, 1_000, '1,000 active professionals')
assert.equal(freeCount * freeJobs, 28_000_000, 'Free GMV')
assert.equal(proCount * proJobs, 22_500_000, 'Pro GMV')
assert.equal(TOTAL_GMV, 50_500_000, 'total monthly GMV')

const subMrr = proCount * PRO_CAP
assert.equal(subMrr, 447_000, 'Pro subscription MRR — the only recurring line')
assert.equal(28_000_000 * FREE_RATE, 2_800_000, 'Free commission')
assert.equal(22_500_000 * PRO_RATE, 1_800_000, 'Pro commission')
assert.equal(CORE_MONTHLY, 5_047_000, 'core monthly platform revenue')
assert.equal(CORE_ANNUAL, 60_564_000, 'core annualised revenue run rate')

// What the slide actually prints, at the rounding the slide uses.
assert.equal((CORE_MONTHLY / 1e6).toFixed(2), '5.05')
assert.equal((CORE_ANNUAL / 1e6).toFixed(1), '60.6')

// Commission, not subscription, carries the model — the reason slide 16 calls
// the commission the core and the network the upside.
assert.ok(subMrr / CORE_MONTHLY < 0.1, 'subscription is upside, not the core')

console.log('economics OK — 10/8 split, LKR 1,490 cap, 510/2,510/4,510, 54,120,')
console.log('               50.5M GMV, 447K MRR, 5.05M monthly, 60.6M run rate')
