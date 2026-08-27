// TrustCraft API — request handler shared by the Vite dev middleware and the
// standalone production server. State lives in server/data.json.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { seed } from './seed.mjs'
import {
  analyse, answerEvidence, trustScore, trustBand, trustEvidence, avgRating,
  matchPros, inspectionFor, buildQuote, priceContext,
} from './domain.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = join(HERE, 'data.json')

// Demo pacing. Real jobs take hours; a live demo cannot. Override with env vars.
const ACCEPT_MS = Number(process.env.DEMO_ACCEPT_MS ?? 4000)
const TRAVEL_MS = Number(process.env.DEMO_TRAVEL_MS ?? 10000)
const REPAIR_MS = Number(process.env.DEMO_REPAIR_MS ?? 14000)

// ── Store ───────────────────────────────────────────────────────────────────

// Tests run against an in-memory database so they never touch server/data.json.
const EPHEMERAL = Boolean(process.env.TRUSTCRAFT_EPHEMERAL)

let db = load()

function load() {
  if (EPHEMERAL) return seed()
  if (!existsSync(DATA_FILE)) {
    const fresh = seed()
    writeFileSync(DATA_FILE, JSON.stringify(fresh, null, 2))
    return fresh
  }
  return JSON.parse(readFileSync(DATA_FILE, 'utf8'))
}

function save() {
  if (EPHEMERAL) return
  writeFileSync(DATA_FILE, JSON.stringify(db, null, 2))
}

const nextId = prefix => `${prefix}${++db.seq}`

// ── Sample imagery, keyed by category ───────────────────────────────────────

const IMAGES = {
  plumbing: {
    problem: '1556909114-f6e7ad7d3136',
    evidence: ['1556909114-f6e7ad7d3136', '1621905252507-b35492cc74b4', '1585771724684-38269d6639fd'],
    completion: ['1585771724684-38269d6639fd', '1621905252507-b35492cc74b4'],
  },
  electrical: {
    problem: '1621905251189-08b45d6a269e',
    evidence: ['1621905251189-08b45d6a269e', '1558618666-fcd25c85cd64', '1581092160562-40aa08e78837'],
    completion: ['1581092160562-40aa08e78837', '1558618666-fcd25c85cd64'],
  },
  aircon: {
    problem: '1631545806609-c2b999ca4dc9',
    evidence: ['1631545806609-c2b999ca4dc9', '1581092160562-40aa08e78837', '1585771724684-38269d6639fd'],
    completion: ['1631545806609-c2b999ca4dc9', '1585771724684-38269d6639fd'],
  },
  appliance: {
    problem: '1626806787461-102c1bfaaea1',
    evidence: ['1626806787461-102c1bfaaea1', '1581092160562-40aa08e78837', '1585771724684-38269d6639fd'],
    completion: ['1626806787461-102c1bfaaea1', '1585771724684-38269d6639fd'],
  },
  carpentry: {
    problem: '1600585154340-be6161a56a0c',
    evidence: ['1600585154340-be6161a56a0c', '1581092160562-40aa08e78837', '1585771724684-38269d6639fd'],
    completion: ['1600585154340-be6161a56a0c', '1585771724684-38269d6639fd'],
  },
  general: {
    problem: '1581092160562-40aa08e78837',
    evidence: ['1581092160562-40aa08e78837', '1585771724684-38269d6639fd', '1621905252507-b35492cc74b4'],
    completion: ['1581092160562-40aa08e78837', '1585771724684-38269d6639fd'],
  },
}

const img = (id, w, h) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`
const imagesFor = c => IMAGES[c] || IMAGES.general

// Camera and voice capture are not wired to real device APIs in this prototype.
// Each mode submits the caption the user is actually shown on screen, so the
// analysis downstream is genuine even though the capture is sampled.
const SAMPLE_CAPTURE = {
  photo: 'Photo of water leaking from the pipe under the kitchen sink',
  voice: 'There is water leaking from under my kitchen sink. It started this morning and it is getting worse when the tap is on.',
}

// ── Formatting helpers ──────────────────────────────────────────────────────

const money = n => `LKR ${n.toLocaleString('en-US')}`
const firstName = pro => pro.name.split(' ')[0]
const clockTime = ts => new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
const longDate = ts => new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
const monthYear = ts => new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })

const pro = id => db.pros.find(p => p.id === id)
const request = id => db.requests.find(r => r.id === id)
const job = id => db.jobs.find(j => j.id === id)

// ── Job lifecycle ───────────────────────────────────────────────────────────

const STATUS_LABEL = {
  booked: 'Booking sent',
  travelling: 'On the way',
  inspected: 'Inspection complete',
  approved: 'Plan approved',
  in_progress: 'Repair in progress',
  awaiting_verification: 'Awaiting your verification',
  completed: 'Completed',
  reviewed: 'Completed',
}

// Index of the currently-active timeline stage for each status.
const STAGE = {
  booked: 2, travelling: 2, inspected: 4, approved: 5,
  in_progress: 5, awaiting_verification: 6, completed: 8, reviewed: 8,
}

// Statuses advance on read from elapsed time rather than a background timer:
// nothing to schedule, nothing to leak, and the demo survives a server restart.
function advance(j) {
  const now = Date.now()
  let changed = false

  if (j.status === 'booked' && now - j.bookedAt >= ACCEPT_MS) {
    j.status = 'travelling'
    j.acceptedAt = j.bookedAt + ACCEPT_MS
    changed = true
  }
  if (j.status === 'travelling' && now - j.bookedAt >= ACCEPT_MS + TRAVEL_MS) {
    const p = pro(j.proId)
    const spec = inspectionFor(j.category)
    j.status = 'inspected'
    j.inspectedAt = j.bookedAt + ACCEPT_MS + TRAVEL_MS
    j.inspection = {
      finding: spec.finding,
      detail: spec.detail,
      urgency: j.urgency,
      photos: imagesFor(j.category).evidence.map(i => img(i, 240, 240)),
    }
    j.quote = buildQuote(j.category, p.inspectionFee)
    changed = true
  }
  if (j.status === 'approved') {
    j.status = 'in_progress'
    j.startedAt = now
    changed = true
  }
  if (j.status === 'in_progress' && now - j.startedAt >= REPAIR_MS) {
    const spec = inspectionFor(j.category)
    j.status = 'awaiting_verification'
    j.finishedAt = j.startedAt + REPAIR_MS
    j.completion = {
      checklist: spec.checklist,
      photos: imagesFor(j.category).completion.map(i => img(i, 360, 260)),
    }
    changed = true
  }

  if (changed) save()
  return j
}

function etaMinutes(j) {
  if (j.status !== 'booked' && j.status !== 'travelling') return null
  const arriveAt = j.bookedAt + ACCEPT_MS + TRAVEL_MS
  const realEta = pro(j.proId).etaMin
  const remaining = Math.max(0, arriveAt - Date.now()) / (ACCEPT_MS + TRAVEL_MS)
  return Math.max(1, Math.round(realEta * remaining))
}

// The demo compresses a 40-minute repair into a few seconds; report the
// remaining time on the real scale so the UI reads like the product would.
function repairMinutesLeft(j, spec) {
  const remaining = Math.max(0, j.startedAt + REPAIR_MS - Date.now()) / REPAIR_MS
  return Math.max(1, Math.round(spec.durationMin * remaining))
}

function timeline(j) {
  const p = pro(j.proId)
  const spec = inspectionFor(j.category)
  const active = STAGE[j.status]
  const eta = etaMinutes(j)

  const stages = [
    { key: 'understood', label: 'Request understood', detail: `${j.title} · ${db.customer.area}` },
    { key: 'selected', label: `${firstName(p)} selected`, detail: `${j.match}% match · TRUST ${j.trustAtBooking}` },
    {
      key: 'travel',
      label: active > 2 ? `${firstName(p)} arrived` : `${firstName(p)} travelling`,
      detail: eta !== null ? `${eta} min away` : j.acceptedAt ? `Arrived ${clockTime(j.inspectedAt || j.acceptedAt)}` : null,
    },
    {
      key: 'inspection',
      label: 'Inspection complete',
      detail: j.inspection ? j.inspection.finding : null,
    },
    {
      key: 'quote',
      label: active > 4 ? 'Quote approved' : 'Quote received',
      detail: j.quote ? `${money(j.quote.total)}${j.approvedAt ? ` · ${clockTime(j.approvedAt)}` : ''}` : null,
    },
    {
      key: 'repair',
      label: active > 5 ? 'Repair complete' : 'Repair in progress',
      detail: j.status === 'in_progress'
        ? `Est. ${repairMinutesLeft(j, spec)} min remaining`
        : j.finishedAt ? `${spec.durationMin} min` : null,
    },
    { key: 'verification', label: 'Customer verification', detail: j.verifiedAt ? `Verified ${clockTime(j.verifiedAt)}` : null },
    { key: 'completed', label: 'Job completed', detail: j.verifiedAt ? longDate(j.verifiedAt) : null },
  ]

  return stages.map((s, i) => ({
    ...s,
    step: i,
    done: i < active,
    active: i === active,
  }))
}

function jobView(j) {
  advance(j)
  const p = pro(j.proId)
  const spec = inspectionFor(j.category)
  const stages = timeline(j)
  const doneCount = stages.filter(s => s.done).length

  return {
    id: j.id,
    requestId: j.requestId,
    status: j.status,
    statusLabel: STATUS_LABEL[j.status],
    title: j.title,
    recordTitle: spec.record,
    category: j.category,
    categoryLabel: j.categoryLabel,
    urgency: j.urgency,
    match: j.match,
    slot: j.slot,
    address: db.customer.address,
    area: db.customer.area,
    workingOn: spec.workingOn,
    etaMin: etaMinutes(j),
    startedAtLabel: j.startedAt ? clockTime(j.startedAt) : null,
    approvedAtLabel: j.approvedAt ? clockTime(j.approvedAt) : null,
    dateLabel: longDate(j.bookedAt),
    durationMin: spec.durationMin,
    pro: {
      id: p.id,
      name: p.name,
      firstName: firstName(p),
      specialty: p.specialty,
      categoryLabel: p.categoryLabel,
      avatar: p.avatar,
      trust: trustScore(p),
      trustBand: trustBand(trustScore(p)),
    },
    inspection: j.inspection || null,
    quote: j.quote || null,
    completion: j.completion || null,
    review: j.review || null,
    timeline: stages,
    progress: { done: doneCount, total: stages.length },
  }
}

function proView(p) {
  const score = trustScore(p)
  return {
    id: p.id,
    name: p.name,
    firstName: firstName(p),
    specialty: p.specialty,
    categoryLabel: p.categoryLabel,
    avatar: p.avatar,
    hero: p.hero,
    distanceKm: p.distanceKm,
    etaMin: p.etaMin,
    inspectionFee: p.inspectionFee,
    inspectionFeeLabel: money(p.inspectionFee),
    attributes: p.attributes,
    about: p.about,
    trust: score,
    trustBand: trustBand(score),
    jobsCompleted: p.evidence.jobsCompleted,
    completionRate: p.evidence.completionRate,
    satisfaction: avgRating(p.ratings).toFixed(1),
    reviews: p.ratings,
  }
}

function requestView(r) {
  const a = r.analysis
  const images = imagesFor(a.category)
  const evidenceLabel = [
    r.photos > 0 ? `${r.photos} photo${r.photos > 1 ? 's' : ''}` : null,
    r.mode === 'voice' ? '1 voice note' : null,
    r.answerEvidence,
  ].filter(Boolean).join(' · ') || 'Description only'

  return {
    id: r.id,
    mode: r.mode,
    text: r.text,
    photos: r.photos,
    answer: r.answer,
    status: r.status,
    analysis: a,
    photoUrl: img(images.problem, 390, 422),
    thumbUrl: img(images.problem, 96, 80),
    summary: [
      { label: 'Service type', value: a.categoryLabel },
      { label: 'Urgency', value: a.urgency },
      { label: 'Location', value: db.customer.area },
      { label: 'Evidence', value: evidenceLabel },
      { label: 'Availability', value: db.customer.availability },
    ],
    evidenceLabel,
  }
}

// ── Routes ──────────────────────────────────────────────────────────────────

const routes = []
const route = (method, pattern, handler) => routes.push({ method, pattern, handler })

route('GET', /^\/api\/session$/, () => {
  const active = db.jobs.map(advance).filter(j => j.status !== 'reviewed').slice(-1)[0]
  return {
    customer: db.customer,
    activeJob: active ? jobView(active) : null,
    records: db.records.slice(0, 2),
  }
})

route('POST', /^\/api\/requests$/, (_, body) => {
  const mode = body.mode || 'text'
  const text = (body.text || SAMPLE_CAPTURE[mode] || '').trim()
  if (text.length < 4) throw httpError(400, 'Describe the problem in a few words first.')

  const photos = mode === 'photo' ? 1 : 0
  const r = {
    id: nextId('r'),
    mode,
    text,
    photos,
    createdAt: Date.now(),
    analysis: analyse(text, { photos }),
    answer: null,
    answerEvidence: null,
    status: 'analysed',
  }
  db.requests.push(r)
  save()
  return requestView(r)
})

route('GET', /^\/api\/requests\/([\w-]+)$/, (_, __, [id]) => {
  const r = request(id)
  if (!r) throw httpError(404, 'Request not found')
  return requestView(r)
})

route('POST', /^\/api\/requests\/([\w-]+)\/answer$/, (_, body, [id]) => {
  const r = request(id)
  if (!r) throw httpError(404, 'Request not found')
  const allowed = r.analysis.question.options
  if (!allowed.includes(body.answer)) throw httpError(400, `Answer must be one of: ${allowed.join(', ')}`)

  r.answer = body.answer
  r.answerEvidence = answerEvidence(r.analysis.category, body.answer)
  r.status = 'clarified'
  save()
  return requestView(r)
})

route('GET', /^\/api\/requests\/([\w-]+)\/matches$/, (_, __, [id]) => {
  const r = request(id)
  if (!r) throw httpError(404, 'Request not found')

  const matches = matchPros(db.pros, r.analysis.category).map(m => {
    const p = pro(m.proId)
    return {
      ...m,
      pro: {
        id: p.id, name: p.name, specialty: p.specialty, avatar: p.avatar,
        distanceLabel: `${p.distanceKm} km`,
        availableLabel: `${p.etaMin} min`,
        completionRate: p.evidence.completionRate,
        inspectionFee: p.inspectionFee,
      },
    }
  })
  return { requestId: r.id, category: r.analysis.categoryLabel, title: r.analysis.title, count: matches.length, matches }
})

route('GET', /^\/api\/pros\/([\w-]+)$/, (_, __, [id]) => {
  const p = pro(id)
  if (!p) throw httpError(404, 'Professional not found')
  return proView(p)
})

route('GET', /^\/api\/pros\/([\w-]+)\/trust$/, (_, __, [id]) => {
  const p = pro(id)
  if (!p) throw httpError(404, 'Professional not found')
  const score = trustScore(p)
  return {
    proId: p.id,
    name: p.name,
    score,
    band: trustBand(score),
    evidence: trustEvidence(p),
    updatedNote: `Updated after last job · ${monthYear(Date.now())}`,
  }
})

route('POST', /^\/api\/bookings$/, (_, body) => {
  const r = request(body.requestId)
  const p = pro(body.proId)
  if (!r) throw httpError(404, 'Request not found')
  if (!p) throw httpError(404, 'Professional not found')
  if (p.category !== r.analysis.category) throw httpError(400, 'That professional does not cover this service.')

  const match = matchPros(db.pros, r.analysis.category).find(m => m.proId === p.id)
  const j = {
    id: nextId('j'),
    requestId: r.id,
    proId: p.id,
    category: r.analysis.category,
    categoryLabel: r.analysis.categoryLabel,
    title: r.analysis.title,
    urgency: r.analysis.urgency,
    match: match.match,
    trustAtBooking: trustScore(p),
    slot: `${body.day || 'Today'} · ${body.time || '4:30 PM'}`,
    status: 'booked',
    bookedAt: Date.now(),
  }
  db.jobs.push(j)
  r.status = 'booked'
  save()
  return jobView(j)
})

route('GET', /^\/api\/jobs\/([\w-]+)$/, (_, __, [id]) => {
  const j = job(id)
  if (!j) throw httpError(404, 'Job not found')
  return jobView(j)
})

route('GET', /^\/api\/jobs\/([\w-]+)\/price-context$/, (_, __, [id]) => {
  const j = job(id)
  if (!j) throw httpError(404, 'Job not found')
  advance(j)
  if (!j.quote) throw httpError(409, 'No quote on this job yet.')

  const ctx = priceContext(db.history, j.category, j.quote.total)
  return {
    ...ctx,
    lowLabel: money(ctx.low),
    highLabel: money(ctx.high),
    totalLabel: money(ctx.total),
    scope: `${j.categoryLabel} · ${db.customer.area} area`,
    basis: [
      `${ctx.count} comparable completed jobs`,
      `${inspectionFor(j.category).planTitle}, ${db.customer.area}`,
      'Includes parts + labour + inspection',
      `Last updated ${monthYear(Date.now())}`,
    ],
  }
})

route('POST', /^\/api\/jobs\/([\w-]+)\/approve$/, (_, __, [id]) => {
  const j = job(id)
  if (!j) throw httpError(404, 'Job not found')
  advance(j)
  if (j.status !== 'inspected') throw httpError(409, 'This job is not waiting for approval.')

  j.status = 'approved'
  j.approvedAt = Date.now()
  j.approvedAmount = j.quote.total
  save()
  return jobView(j)
})

route('POST', /^\/api\/jobs\/([\w-]+)\/verify$/, (_, body, [id]) => {
  const j = job(id)
  if (!j) throw httpError(404, 'Job not found')
  advance(j)
  if (j.status !== 'awaiting_verification') throw httpError(409, 'This job is not ready for verification yet.')

  const required = j.completion.checklist
  const checked = Array.isArray(body.checked) ? body.checked : []
  const missing = required.filter(item => !checked.includes(item))
  if (missing.length) throw httpError(400, `Still to verify: ${missing.join(', ')}`)

  j.status = 'completed'
  j.verifiedAt = Date.now()

  const spec = inspectionFor(j.category)
  const p = pro(j.proId)
  db.records.unshift({
    id: nextId('rec'),
    jobId: j.id,
    room: spec.room,
    service: spec.record,
    tech: p.name,
    date: monthYear(j.verifiedAt),
    warranty: `Warranty until ${monthYear(j.verifiedAt + 90 * 86400000)}`,
  })
  db.history.push({ id: nextId('h'), category: j.category, area: db.customer.area, total: j.approvedAmount })

  // A completed job is verified activity, so it moves the pro's evidence.
  p.evidence.jobsCompleted += 1
  p.evidence.relevantJobs += 1
  save()
  return jobView(j)
})

route('GET', /^\/api\/jobs\/([\w-]+)\/summary$/, (_, __, [id]) => {
  const j = job(id)
  if (!j) throw httpError(404, 'Job not found')
  advance(j)
  if (!j.verifiedAt) throw httpError(409, 'Job is not complete yet.')

  const p = pro(j.proId)
  return {
    title: j.title,
    rows: [
      { label: 'Repair time', value: `${inspectionFor(j.category).durationMin} min` },
      { label: 'Total cost', value: money(j.approvedAmount) },
      { label: 'Technician', value: p.name },
      { label: 'Date', value: longDate(j.verifiedAt) },
    ],
    dateLabel: longDate(j.verifiedAt),
    proName: p.name,
    proFirstName: firstName(p),
    reviewed: Boolean(j.review),
  }
})

route('POST', /^\/api\/jobs\/([\w-]+)\/review$/, (_, body, [id]) => {
  const j = job(id)
  if (!j) throw httpError(404, 'Job not found')
  // The product's core claim: only a verified completed job can produce a review.
  if (j.status !== 'completed') throw httpError(409, 'Only a verified completed job can be reviewed.')

  const rating = Number(body.rating)
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw httpError(400, 'Rating must be 1 to 5.')

  const p = pro(j.proId)
  const before = trustScore(p)
  const review = {
    by: `${db.customer.name} ${db.customer.lastInitial}.`,
    rating,
    text: (body.text || '').trim(),
    aspects: body.aspects || {},
    date: monthYear(Date.now()),
    verified: true,
    jobId: j.id,
  }
  p.ratings.unshift(review)
  j.review = review
  j.status = 'reviewed'
  save()

  return { trustBefore: before, trustAfter: trustScore(p), proName: p.name, proFirstName: firstName(p) }
})

route('GET', /^\/api\/home$/, () => ({
  property: {
    address: db.customer.address,
    unit: db.customer.unit,
    area: db.customer.area,
    jobsDone: db.records.length,
    warranties: db.records.filter(r => r.warranty).length,
    spaces: db.customer.spaces,
  },
  records: db.records,
}))

// ── Professional side ───────────────────────────────────────────────────────

route('GET', /^\/api\/pro\/([\w-]+)\/inbox$/, (_, __, [proId]) => {
  const p = pro(proId)
  if (!p) throw httpError(404, 'Professional not found')

  const pending = db.jobs.filter(j => j.proId === proId && j.status === 'booked')
  if (!pending.length) return { pro: { id: p.id, name: p.name, avatar: p.avatar }, request: null }

  const j = pending[pending.length - 1]
  const r = request(j.requestId)
  const view = requestView(r)
  return {
    pro: { id: p.id, name: p.name, avatar: p.avatar },
    request: {
      jobId: j.id,
      title: r.analysis.title,
      categoryLabel: r.analysis.categoryLabel,
      urgency: r.analysis.urgency,
      confidence: r.analysis.confidence,
      summary: `"${r.text}"`,
      evidenceLabel: view.evidenceLabel,
      thumbUrl: view.thumbUrl,
      photos: r.photos,
      hasVoice: r.mode === 'voice',
      details: [
        { label: 'Location', value: `${db.customer.area} · ${p.distanceKm} km away`, icon: '📍' },
        { label: 'Customer availability', value: db.customer.availability, icon: '🗓' },
        { label: 'Inspection fee', value: money(p.inspectionFee), icon: '💳' },
      ],
    },
  }
})

route('POST', /^\/api\/pro\/jobs\/([\w-]+)\/accept$/, (_, __, [id]) => {
  const j = job(id)
  if (!j) throw httpError(404, 'Job not found')
  if (j.status !== 'booked') throw httpError(409, 'This job has already been accepted.')

  j.status = 'travelling'
  j.acceptedAt = Date.now()
  // Accepting early pulls the travel clock forward so the customer view agrees.
  j.bookedAt = Math.min(j.bookedAt, j.acceptedAt - ACCEPT_MS)
  save()
  return jobView(j)
})

route('POST', /^\/api\/demo\/reset$/, () => {
  db = seed()
  save()
  return { ok: true }
})

// ── Dispatch ────────────────────────────────────────────────────────────────

function httpError(status, message) {
  const e = new Error(message)
  e.status = status
  return e
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', c => {
      size += c.length
      if (size > 1e6) { reject(httpError(413, 'Payload too large')); req.destroy() }
      chunks.push(c)
    })
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8')
      if (!raw) return resolve({})
      try { resolve(JSON.parse(raw)) } catch { reject(httpError(400, 'Invalid JSON body')) }
    })
    req.on('error', reject)
  })
}

const send = (res, status, payload) => {
  const body = JSON.stringify(payload)
  res.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'no-store' })
  res.end(body)
}

/** Handles /api/* requests. Returns false if the URL is not ours. */
export async function handleApi(req, res) {
  const path = (req.url || '').split('?')[0].replace(/\/+$/, '') || '/'
  if (!path.startsWith('/api/')) return false

  const hit = routes
    .map(r => ({ r, m: r.pattern.exec(path) }))
    .find(({ r, m }) => m && r.method === req.method)

  if (!hit) {
    const pathExists = routes.some(r => r.pattern.test(path))
    send(res, pathExists ? 405 : 404, { error: pathExists ? 'Method not allowed' : `No route for ${path}` })
    return true
  }

  try {
    const body = req.method === 'POST' ? await readBody(req) : {}
    const params = hit.m.slice(1)
    send(res, 200, await hit.r.handler(req, body, params))
  } catch (err) {
    send(res, err.status || 500, { error: err.message || 'Server error' })
    if (!err.status) console.error(err)
  }
  return true
}

/** Test hook: swap in a fresh in-memory database without touching disk. */
export function _resetForTests() {
  db = seed()
}
