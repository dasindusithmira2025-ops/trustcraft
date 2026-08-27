// End-to-end walk of the API: describe a problem, match, book, inspect,
// approve, verify, review — asserting the rules that must not break.
// Run with: pnpm test

import assert from 'node:assert/strict'
import { Readable } from 'node:stream'

// Must be set before api.mjs loads: it reads these at module scope.
process.env.TRUSTCRAFT_EPHEMERAL = '1'
process.env.DEMO_ACCEPT_MS = '10'
process.env.DEMO_TRAVEL_MS = '10'
process.env.DEMO_REPAIR_MS = '10'

const { handleApi } = await import('./api.mjs')
const { analyse, trustScore, matchPros, priceContext } = await import('./domain.mjs')

// ── Minimal req/res doubles so routes can be driven without a socket ─────────

function call(method, url, body) {
  const req = Readable.from(body === undefined ? [] : [Buffer.from(JSON.stringify(body))])
  req.method = method
  req.url = url

  return new Promise((resolve, reject) => {
    const chunks = []
    const res = {
      statusCode: 0,
      writeHead(status) { res.statusCode = status; return res },
      end(chunk) {
        if (chunk) chunks.push(chunk)
        resolve({ status: res.statusCode, body: JSON.parse(chunks.join('')) })
      },
    }
    handleApi(req, res).then(handled => {
      if (!handled) reject(new Error(`unhandled: ${method} ${url}`))
    }, reject)
  })
}

const ok = async (method, url, body) => {
  const r = await call(method, url, body)
  assert.equal(r.status, 200, `${method} ${url} -> ${r.status} ${JSON.stringify(r.body)}`)
  return r.body
}

const fails = async (method, url, body, status) => {
  const r = await call(method, url, body)
  assert.equal(r.status, status, `${method} ${url} expected ${status}, got ${r.status}`)
  return r.body
}

const settle = () => new Promise(r => setTimeout(r, 40))

// ── Pure domain rules ───────────────────────────────────────────────────────

{
  const leak = analyse('Water is leaking from under my kitchen sink')
  assert.equal(leak.category, 'plumbing')
  assert.equal(leak.urgency, 'Moderate')
  assert.match(leak.title, /sink connection/)

  const sparking = analyse('The wall socket is sparking and smells of burning')
  assert.equal(sparking.category, 'electrical')
  assert.equal(sparking.urgency, 'High', 'sparking must escalate urgency')

  // Confidence must never be presented as certainty.
  assert.ok(analyse('leak water pipe drain tap sink toilet shower').confidence <= 95)
  assert.equal(analyse('something is odd').category, 'general')

  // Photo evidence should raise confidence over the same text alone.
  const text = 'water leaking from the sink'
  assert.ok(analyse(text, { photos: 1 }).confidence > analyse(text).confidence)
}

{
  // Trust must move only on verified evidence, and disputes must cost.
  const base = {
    ratings: [{ rating: 5 }, { rating: 5 }],
    evidence: {
      identityVerified: true, qualificationVerified: true, relevantJobs: 40,
      completionRate: 100, onTimeRate: 100, disputes: 0,
    },
  }
  assert.equal(trustScore(base), 100)

  const disputed = { ...base, evidence: { ...base.evidence, disputes: 1 } }
  assert.ok(trustScore(disputed) < trustScore(base), 'a dispute must lower trust')

  const unverified = { ...base, evidence: { ...base.evidence, identityVerified: false } }
  assert.equal(trustScore(base) - trustScore(unverified), 10)
}

{
  const ctx = priceContext(
    [1000, 2000, 3000, 4000, 5000].map(total => ({ category: 'plumbing', total })),
    'plumbing', 3000,
  )
  assert.equal(ctx.median, 3000)
  assert.equal(ctx.position, 50)
  assert.match(ctx.verdict, /Within the usual range/)

  const high = priceContext(
    [1000, 2000, 3000, 4000, 5000].map(total => ({ category: 'plumbing', total })),
    'plumbing', 5000,
  )
  assert.match(high.verdict, /Above the usual range/)
}

// ── Full customer journey ───────────────────────────────────────────────────

const req = await ok('POST', '/api/requests', {
  mode: 'text',
  text: 'There is water leaking from under my kitchen sink and it is getting worse.',
})
assert.equal(req.analysis.category, 'plumbing')
assert.equal(req.status, 'analysed')

await fails('POST', '/api/requests', { mode: 'text', text: 'hm' }, 400)

// Clarification only accepts the options the question actually offered.
await fails('POST', `/api/requests/${req.id}/answer`, { answer: 'Maybe' }, 400)
const clarified = await ok('POST', `/api/requests/${req.id}/answer`, { answer: 'Yes' })
assert.equal(clarified.status, 'clarified')
assert.match(clarified.evidenceLabel, /leak when tap off/)

const { matches } = await ok('GET', `/api/requests/${req.id}/matches`)
assert.ok(matches.length >= 3, 'plumbing request should surface the plumbing pros')
assert.ok(matches.every(m => m.match > 0 && m.factors.length === 5))
assert.deepEqual([...matches].sort((a, b) => b.match - a.match).map(m => m.proId), matches.map(m => m.proId),
  'matches must come back ranked')
assert.equal(new Set(matches.map(m => m.tag)).size, matches.length, 'each pro gets a distinct tag')

// A pro from another trade must never be bookable against this request.
await fails('POST', '/api/bookings', { requestId: req.id, proId: 'p5' }, 400)

const booked = await ok('POST', '/api/bookings', {
  requestId: req.id, proId: matches[0].proId, day: 'Today', time: '4:30 PM',
})
assert.equal(booked.status, 'booked')
assert.equal(booked.quote, null, 'no quote exists before the inspection')

// Nothing can be approved before there is something to approve.
await fails('POST', `/api/jobs/${booked.id}/approve`, {}, 409)

await settle()
const inspected = await ok('GET', `/api/jobs/${booked.id}`)
assert.equal(inspected.status, 'inspected')
assert.ok(inspected.quote.total > 0)
assert.equal(
  inspected.quote.total,
  inspected.quote.parts.reduce((s, p) => s + p.price, 0) + inspected.quote.labour.price + inspected.quote.inspectionFee,
  'quote total must equal its line items',
)

const price = await ok('GET', `/api/jobs/${booked.id}/price-context`)
assert.ok(price.low <= price.total && price.total <= price.high)
assert.ok(price.count > 0)

// Verification is not available until the repair is actually finished.
await fails('POST', `/api/jobs/${booked.id}/verify`, { checked: [] }, 409)

const approved = await ok('POST', `/api/jobs/${booked.id}/approve`, {})
assert.equal(approved.status, 'in_progress')

await settle()
const awaiting = await ok('GET', `/api/jobs/${booked.id}`)
assert.equal(awaiting.status, 'awaiting_verification')
assert.equal(awaiting.completion.checklist.length, 4)

// Partial verification must not release the job.
await fails('POST', `/api/jobs/${booked.id}/verify`, { checked: [awaiting.completion.checklist[0]] }, 400)

// Reviews are gated on a verified completed job — the product's central claim.
await fails('POST', `/api/jobs/${booked.id}/review`, { rating: 5 }, 409)

const done = await ok('POST', `/api/jobs/${booked.id}/verify`, { checked: awaiting.completion.checklist })
assert.equal(done.status, 'completed')
assert.ok(done.timeline.every(s => s.done), 'a completed job has no unfinished stages')

const home = await ok('GET', '/api/home')
assert.equal(home.records[0].jobId, booked.id, 'completion writes a service record')
assert.ok(home.records[0].warranty)

await fails('POST', `/api/jobs/${booked.id}/review`, { rating: 9 }, 400)
const reviewed = await ok('POST', `/api/jobs/${booked.id}/review`, {
  rating: 5, text: 'Clear explanation and clean work.',
})
assert.ok(reviewed.trustAfter >= reviewed.trustBefore, 'a five-star verified review must not lower trust')

const proAfter = await ok('GET', `/api/pros/${matches[0].proId}`)
assert.equal(proAfter.reviews[0].text, 'Clear explanation and clean work.')
assert.equal(proAfter.reviews[0].verified, true)

const trust = await ok('GET', `/api/pros/${matches[0].proId}/trust`)
assert.equal(trust.score, proAfter.trust)
assert.equal(trust.evidence.length, 7)

await fails('GET', '/api/jobs/nope', undefined, 404)
await fails('GET', '/api/nothing-here', undefined, 404)

console.log('✓ all API and domain checks passed')
