import { useEffect, useState, type ReactElement } from 'react'
import { navigate, useStore } from '../app-state'
import { AppShell } from '../shell'
import {
  Avatar,
  Button,
  Display,
  Eyebrow,
  Icon,
  Money,
  Pill,
  Rule,
  StatusDot,
  TextLink,
} from '../ui'
import {
  BEFORE_AFTER,
  CASE,
  CHANGE_REQUEST,
  COMPLETION_CHECKS,
  RESOLVED_SUMMARY,
  TIMELINE,
  evidenceById,
  money,
  proById,
  type EventKind,
  type TimelineEvent,
} from '../data'

// ════════════════════════════════════════════════════════════════════════════
// Proof Timeline ★ — what happened, who confirmed it, what proves it
// ════════════════════════════════════════════════════════════════════════════

const KIND_ICON: Record<EventKind, (p: { size?: number; className?: string }) => ReactElement> = {
  report: Icon.camera,
  system: Icon.grid,
  decision: Icon.question,
  work: Icon.wrench,
  money: Icon.file,
  verify: Icon.check,
  resolved: Icon.shield,
}

export function ProofTimeline() {
  const { progress, step } = useStore()
  const [lightbox, setLightbox] = useState<string | null>(null)

  // Everything up to the current step is real; the rest is still ahead.
  const reached = (e: TimelineEvent) => e.step <= step
  const pro = proById(RESOLVED_SUMMARY.proId)

  const pendingChange = progress.agreementApproved && !progress.changeDecision
  const readyToVerify = progress.changeDecision !== null && !progress.verified

  return (
    <AppShell recede caseStage="prove">
      <div className="pb-24 pt-12">
        <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* ── The record ──────────────────────────────────────────── */}
          <div>
            <Eyebrow tone="teal" className="mb-4">
              Resolution record · {CASE.id}
            </Eyebrow>
            <Display size="lg" as="h1" className="a-up text-ink-950">
              Everything that
              <br />
              happened, in order.
            </Display>
            <p className="a-up d1 mt-5 max-w-lg text-[15px] leading-relaxed text-ink-500">
              Each entry records what happened, who confirmed it, and what evidence exists. Nothing here
              can be edited after the fact.
            </p>

            <ol className="mt-12">
              {TIMELINE.map((e, i) => (
                <TimelineRow
                  key={e.id}
                  event={e}
                  reached={reached(e)}
                  isLast={i === TIMELINE.length - 1}
                  index={i}
                  onOpenEvidence={setLightbox}
                />
              ))}
            </ol>
          </div>

          {/* ── Case rail ───────────────────────────────────────────── */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-2xl bg-ink-950 p-7 text-white">
              <div className="flex items-center justify-between">
                <Eyebrow tone="light">Agreed total</Eyebrow>
                {progress.changeDecision === 'approved' && (
                  <span className="rounded bg-white/10 px-2 py-0.5 font-data text-[10px] tracking-wider text-white/60">
                    REVISED
                  </span>
                )}
              </div>
              <p className="tnum mt-3 font-display text-[42px] leading-none">
                {money(
                  progress.changeDecision === 'approved'
                    ? CHANGE_REQUEST.newTotal
                    : CHANGE_REQUEST.originalTotal,
                )}
              </p>
              {progress.changeDecision === 'approved' && (
                <p className="mt-2 text-[12.5px] text-white/45">
                  {money(CHANGE_REQUEST.originalTotal)} agreed, plus{' '}
                  {money(CHANGE_REQUEST.priceChange)} you approved at 11:52.
                </p>
              )}

              <Rule tone="light" className="my-6" />

              <div className="flex items-center gap-3">
                <Avatar tint={pro.tint} name={pro.name} size={34} />
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-medium">{pro.name}</p>
                  <p className="text-[12px] text-white/45">On site since 11:02</p>
                </div>
              </div>
              <Button full size="md" variant="onDark" className="mt-5" to="/messages">
                Message {pro.short}
              </Button>
            </div>

            {/* The rail always states the single next action. */}
            {pendingChange && (
              <NextAction
                tone="warning"
                title="A change request needs you"
                body="Work is paused. Chamod found the flexible hose is also failing."
                cta="Review the change"
                to="/case/TC-2048/change"
              />
            )}
            {readyToVerify && (
              <NextAction
                tone="teal"
                title="Confirm the work is done"
                body="The repair is finished. Your confirmation releases payment and closes the case."
                cta="Verify completion"
                to="/case/TC-2048/verify"
              />
            )}
            {progress.verified && (
              <NextAction
                tone="success"
                title="Case resolved"
                body="This record is now permanent and attached to Kitchen · Sink."
                cta="See the resolved case"
                to="/case/TC-2048/resolved"
              />
            )}
            {!progress.agreementApproved && (
              <NextAction
                tone="teal"
                title="Approve the work agreement"
                body="Nothing starts until the scope and price are agreed in writing."
                cta="Open the agreement"
                to="/case/TC-2048/agreement"
              />
            )}

            <div className="mt-6 rounded-xl bg-[var(--color-sunken)] p-5">
              <p className="flex items-center gap-2 text-[13px] font-medium text-ink-800">
                <Icon.shield size={14} />
                Why this record matters
              </p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink-600">
                If anyone later disagrees about what was agreed or what was done, this is the answer —
                timestamped, attributed, and with the photographs attached.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {lightbox && <Lightbox id={lightbox} onClose={() => setLightbox(null)} />}
    </AppShell>
  )
}

function TimelineRow({
  event,
  reached,
  isLast,
  index,
  onOpenEvidence,
}: {
  event: TimelineEvent
  reached: boolean
  isLast: boolean
  index: number
  onOpenEvidence: (id: string) => void
}) {
  const Glyph = KIND_ICON[event.kind]
  const evidence = (event.evidenceIds ?? []).map(evidenceById).filter(Boolean)

  return (
    <li
      className={`a-up grid grid-cols-[58px_28px_minmax(0,1fr)] gap-x-4 transition-opacity duration-300
        ${reached ? 'opacity-100' : 'opacity-40'}`}
      style={{ animationDelay: `${Math.min(index, 8) * 0.05}s` }}
    >
      {/* Time gutter */}
      <span className="tnum pt-[3px] text-right font-data text-[12px] text-ink-400">{event.time}</span>

      {/* Spine */}
      <span className="relative flex flex-col items-center" aria-hidden="true">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors
            ${
              !reached
                ? 'bg-[var(--color-sunken)] text-ink-300 ring-1 ring-[var(--color-rule-strong)]'
                : event.kind === 'resolved'
                  ? 'bg-success-700 text-white'
                  : event.kind === 'money'
                    ? 'bg-ink-950 text-white'
                    : 'bg-teal-800 text-white'
            }`}
        >
          <Glyph size={13} />
        </span>
        {!isLast && (
          <span
            className={`w-px flex-1 ${reached ? 'bg-teal-700/25' : 'bg-[var(--color-rule)]'}`}
            style={{ minHeight: 28 }}
          />
        )}
      </span>

      {/* Entry */}
      <div className={isLast ? 'pb-2' : 'pb-9'}>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-[16px] font-semibold text-ink-950">{event.title}</h3>
          {event.amount !== undefined && reached && (
            <Money value={event.amount} className="text-[13.5px] text-ink-600" />
          )}
          {!reached && (
            <span className="font-data text-[10.5px] uppercase tracking-[0.14em] text-ink-400">
              Not yet
            </span>
          )}
        </div>

        {event.detail && (
          <p className="mt-1.5 max-w-xl text-[14px] leading-relaxed text-ink-600">{event.detail}</p>
        )}

        {/* Attribution and proof only exist once the event actually happened. */}
        <p className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12.5px] text-ink-400">
          {reached ? (
            <>
              <span>By {event.by}</span>
              {event.confirmedBy && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 text-success-700">
                    <Icon.check size={12} />
                    Confirmed by {event.confirmedBy}
                  </span>
                </>
              )}
              {evidence.length === 0 && event.kind !== 'system' && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>No evidence attached</span>
                </>
              )}
            </>
          ) : (
            <span>Expected from {event.by}</span>
          )}
        </p>

        {reached && evidence.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-2.5">
            {evidence.map(
              ev =>
                ev && (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => onOpenEvidence(ev.id)}
                    className="group relative h-16 w-24 overflow-hidden rounded-lg ring-1 ring-[var(--color-rule)]
                      transition-transform duration-150 hover:-translate-y-0.5"
                    aria-label={`Open evidence: ${ev.label}`}
                  >
                    <img src={ev.src} alt="" className="h-full w-full object-cover" loading="lazy" />
                    <span
                      className="absolute inset-0 flex items-center justify-center bg-ink-950/0 text-white
                        opacity-0 transition-all group-hover:bg-ink-950/45 group-hover:opacity-100"
                    >
                      <Icon.search size={16} />
                    </span>
                  </button>
                ),
            )}
          </div>
        )}
      </div>
    </li>
  )
}

function NextAction({
  tone,
  title,
  body,
  cta,
  to,
}: {
  tone: 'teal' | 'warning' | 'success'
  title: string
  body: string
  cta: string
  to: string
}) {
  const bg = {
    teal: 'bg-teal-50',
    warning: 'bg-warning-100',
    success: 'bg-success-100',
  }[tone]
  const dot = { teal: 'teal', warning: 'warning', success: 'success' } as const
  return (
    <div className={`a-up mt-5 rounded-2xl p-6 ${bg}`}>
      <p className="flex items-center gap-2 text-[14px] font-semibold text-ink-950">
        <StatusDot tone={dot[tone]} pulse={tone === 'warning'} />
        {title}
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-600">{body}</p>
      <Button full size="md" className="mt-4" to={to}>
        {cta}
      </Button>
    </div>
  )
}

function Lightbox({ id, onClose }: { id: string; onClose: () => void }) {
  const ev = evidenceById(id)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!ev) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ev.label}
      className="a-fade fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/92 p-8"
      onClick={onClose}
    >
      <div className="max-w-4xl" onClick={e => e.stopPropagation()}>
        <img src={ev.src} alt={ev.label} className="max-h-[76vh] w-full rounded-xl object-contain" />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[14px] text-white/80">
            {ev.label} · taken by {ev.by} at <span className="font-data">{ev.at}</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2 text-[13px] text-white
              transition-colors hover:bg-white/20"
          >
            <Icon.close size={14} />
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Completion verification
// ════════════════════════════════════════════════════════════════════════════

export function CompletionVerify() {
  const { progress, toggleCheck, set, notify } = useStore()
  const all = progress.completionChecks.length === COMPLETION_CHECKS.length

  return (
    <AppShell recede caseStage="prove">
      <div className="pb-20 pt-12">
        <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <Eyebrow tone="teal" className="mb-4">
              Completion evidence
            </Eyebrow>
            <Display size="lg" as="h1" className="a-up text-ink-950">
              Does this match
              <br />
              what you see?
            </Display>
            <p className="a-up d1 mt-5 max-w-lg text-[15px] leading-relaxed text-ink-500">
              Chamod has marked the repair complete and submitted evidence. Nothing is released until you
              agree.
            </p>

            <div className="mt-10">
              <Eyebrow className="mb-4">Before and after</Eyebrow>
              <BeforeAfter />
            </div>
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-2xl bg-white p-7 shadow-[0_1px_2px_rgba(15,17,20,0.04),0_18px_50px_-28px_rgba(15,17,20,0.3)]">
              <Eyebrow tone="teal" className="mb-4">
                Confirm each point
              </Eyebrow>

              <ul className="space-y-1">
                {COMPLETION_CHECKS.map(c => {
                  const checked = progress.completionChecks.includes(c.id)
                  return (
                    <li key={c.id}>
                      <label
                        className={`flex cursor-pointer items-start gap-3 rounded-xl p-3 transition-colors
                          ${checked ? 'bg-success-100' : 'hover:bg-ink-100'}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCheck(c.id)}
                          className="mt-0.5 shrink-0 accent-teal-800"
                          style={{ width: 17, height: 17 }}
                        />
                        <span>
                          <span className="block text-[14px] font-medium text-ink-950">{c.label}</span>
                          <span className="mt-0.5 block text-[12.5px] leading-relaxed text-ink-500">
                            {c.detail}
                          </span>
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>

              <Rule className="my-6" />

              <Button
                full
                size="lg"
                disabled={!all}
                onClick={() => {
                  set({ verified: true })
                  notify('Resolution verified — payment released')
                  window.setTimeout(() => navigate('/case/TC-2048/resolved'), 600)
                }}
              >
                Verify resolution
              </Button>
              <Button full size="md" variant="secondary" className="mt-2" to="/messages">
                Something is not right
              </Button>

              <p className="mt-4 text-center text-[12px] leading-relaxed text-ink-400">
                {all
                  ? `Verifying releases ${money(RESOLVED_SUMMARY.finalAmount)} and starts the 30-day warranty.`
                  : 'Confirm all three points to continue.'}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  )
}

/** Before/after wipe. A slider, because a side-by-side pair hides the detail. */
function BeforeAfter() {
  const [pos, setPos] = useState(50)
  return (
    <figure>
      <div className="relative overflow-hidden rounded-2xl bg-ink-950">
        <img src={BEFORE_AFTER.after} alt="After the repair" className="h-[420px] w-full object-cover" />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <img
            src={BEFORE_AFTER.before}
            alt="Before the repair"
            className="h-[420px] w-full object-cover"
          />
        </div>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-px bg-white/85"
          style={{ left: `${pos}%` }}
        />

        <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-ink-950/70 px-3 py-1 font-data text-[10.5px] tracking-[0.14em] text-white">
          BEFORE
        </span>
        <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-ink-950/70 px-3 py-1 font-data text-[10.5px] tracking-[0.14em] text-white">
          AFTER
        </span>

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={e => setPos(Number(e.target.value))}
          aria-label="Reveal before or after the repair"
          className="wipe absolute inset-0 h-full w-full"
        />
      </div>
      <figcaption className="mt-3 text-[12.5px] text-ink-500">
        Drag to compare · both images timestamped and attributed to Chamod Fernando
      </figcaption>
    </figure>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Resolved — calm, editorial, no confetti
// ════════════════════════════════════════════════════════════════════════════

export function Resolved() {
  const pro = proById(RESOLVED_SUMMARY.proId)
  const [reviewed, setReviewed] = useState(false)

  return (
    <AppShell recede caseStage="prove" caseResolved>
      <div className="pb-24 pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow tone="teal" className="a-up mb-7">
            Case {CASE.id} · closed {RESOLVED_SUMMARY.date}
          </Eyebrow>

          <h1 className="a-rise font-display text-[110px] leading-[0.92] text-ink-950">Resolved.</h1>

          <p className="a-rise d2 mt-6 font-display text-[28px] text-ink-600">{CASE.title}</p>
          <p className="a-up d3 mt-4 flex items-center justify-center gap-2.5 text-[14.5px] text-ink-500">
            <Avatar tint={pro.tint} name={pro.name} size={26} />
            {pro.name}
          </p>
        </div>

        <div className="mx-auto mt-20 max-w-4xl">
          <Rule />
          <dl className="grid grid-cols-2 md:grid-cols-4">
            <Summary label="Final amount" value={money(RESOLVED_SUMMARY.finalAmount)} delay={0} />
            <Summary label="Repair duration" value={`${RESOLVED_SUMMARY.durationMin} min`} delay={0.07} />
            <Summary label="Evidence" value={`${RESOLVED_SUMMARY.evidenceCount} items`} delay={0.14} />
            <Summary label="Warranty" value={RESOLVED_SUMMARY.warranty} delay={0.21} last />
          </dl>
          <Rule />

          <p className="a-up d5 mt-8 text-center text-[13.5px] text-ink-500">
            Warranty on labour runs until {RESOLVED_SUMMARY.warrantyUntil}. It is attached to the ledger
            entry, so you will not need to find this page again.
          </p>

          <div className="a-up d6 mt-12 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" to="/case/TC-2048/record">
              View the service record
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setReviewed(true)}
              disabled={reviewed}
            >
              {reviewed ? 'Review submitted' : 'Leave a verified review'}
            </Button>
          </div>

          <div className="a-up d7 mt-16 rounded-2xl bg-[var(--color-sunken)] p-8 text-center">
            <Pill tone="neutral" className="mb-4">
              Added to your Home Ledger
            </Pill>
            <p className="font-display text-[26px] text-ink-950">Kitchen · Sink</p>
            <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-relaxed text-ink-600">
              The parts fitted, the professional who fitted them, the price, the warranty and the five
              photographs are now part of this home&apos;s permanent record.
            </p>
            <TextLink className="mt-5" onClick={() => navigate('/ledger?asset=kitchen-sink')}>
              Open the Home Ledger
            </TextLink>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function Summary({
  label,
  value,
  delay,
  last,
}: {
  label: string
  value: string
  delay: number
  last?: boolean
}) {
  return (
    <div
      className={`a-up px-6 py-8 text-center ${last ? '' : 'md:border-r md:border-[var(--color-rule)]'}`}
      style={{ animationDelay: `${0.35 + delay}s` }}
    >
      <dt className="font-data text-[10.5px] uppercase tracking-[0.14em] text-ink-400">{label}</dt>
      <dd className="tnum mt-2.5 font-display text-[30px] leading-none text-ink-950">{value}</dd>
    </div>
  )
}
