import { useState } from 'react'
import { navigate, useStore } from '../app-state'
import { AppShell } from '../shell'
import {
  Avatar,
  Button,
  Display,
  Disclosure,
  EvidenceRef,
  Eyebrow,
  Icon,
  Pill,
  Rule,
  StatusDot,
  TextLink,
  evidenceTag,
} from '../ui'
import { AGREEMENT, CHANGE_REQUEST, evidenceById, money, proById } from '../data'

// ════════════════════════════════════════════════════════════════════════════
// Work Agreement
//
// This is the one screen that should not feel like an application. It is the
// object the whole product exists to produce, so it is set as a document —
// its own paper, a masthead, numbered clauses, a hairline between each — and
// approving it is a deliberate two-step act rather than a stray click.
// ════════════════════════════════════════════════════════════════════════════

const CLAUSES = [
  'Case',
  'Professional',
  'Agreed work',
  'Materials',
  'Price',
  'Warranty',
  'Completion evidence',
  'If something changes',
]

export function WorkAgreement() {
  const { progress, set, notify } = useStore()
  const [read, setRead] = useState(false)
  const pro = proById(progress.acceptedQuote ?? AGREEMENT.proId)
  const approved = progress.agreementApproved

  return (
    <AppShell caseStage="agree">
      <div className="pb-16 pt-8 sm:pt-10 lg:pb-20 lg:pt-12">
        <button
          type="button"
          onClick={() => navigate('/case/TC-2048/plan')}
          className="tap mb-6 inline-flex items-center gap-2 text-[13px] text-ink-500 transition-colors hover:text-ink-900 sm:mb-7"
        >
          <Icon.arrowLeft size={15} />
          Repair plan
        </button>

        <div className="grid grid-cols-1 gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1fr)_330px] xl:gap-x-20 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* ── The document ───────────────────────────────────────── */}
          <article
            className="a-rise min-w-0 overflow-hidden rounded-2xl bg-white
              shadow-[0_1px_2px_rgba(15,17,20,0.04),0_20px_56px_-30px_rgba(15,17,20,0.3)]"
          >
            {/* Masthead — a document states what it is before it says anything. */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-[var(--color-rule)] bg-[var(--color-sunken)]/60 px-5 py-3 sm:px-8 lg:px-10">
              <Eyebrow tone="teal">Work agreement</Eyebrow>
              <span className="font-data ml-auto text-[10.5px] tracking-[0.14em] text-ink-400">
                {AGREEMENT.caseId} · 23 AUG 2026
              </span>
            </div>

            <div className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
              <Display size="lg" as="h1" className="a-up text-ink-950">
                What you are
                <br />
                agreeing to.
              </Display>
              <p className="a-up d1 measure mt-4 text-[14.5px] leading-relaxed text-ink-500 sm:mt-5 sm:text-[15px]">
                This is the whole of it. Anything not written here is not part of the job, and cannot be
                added without coming back to you.
              </p>

              <Rule className="my-7 lg:my-9" />

              <Clause n={1} label="Case">
                <p className="text-[15px] font-medium text-ink-950 sm:text-[16px]">Kitchen sink leak</p>
                <p className="mt-1 text-[13.5px] text-ink-500">Kitchen · Sink · Colombo 05</p>
              </Clause>

              <Clause n={2} label="Professional">
                <div className="flex items-center gap-3">
                  <Avatar tint={pro.tint} name={pro.name} size={34} />
                  <div className="min-w-0">
                    <p className="text-[15px] font-medium text-ink-950 sm:text-[16px]">{pro.name}</p>
                    <p className="mt-0.5 text-[12.5px] leading-snug text-ink-500 sm:text-[13px]">
                      Identity and qualification verified · {pro.similarJobs} similar repairs
                    </p>
                  </div>
                </div>
              </Clause>

              <Clause n={3} label="Agreed work">
                <ul className="space-y-2.5 sm:space-y-3">
                  {AGREEMENT.agreedWork.map(w => (
                    <li
                      key={w}
                      className="flex items-start gap-3 text-[15px] leading-snug text-ink-900 sm:text-[16px]"
                    >
                      <Icon.check size={16} className="mt-1 shrink-0 text-teal-700" />
                      {w}
                    </li>
                  ))}
                </ul>
              </Clause>

              <Clause n={4} label="Materials">
                <p className="text-[14.5px] text-ink-800 sm:text-[15px]">{AGREEMENT.materials}</p>
              </Clause>

              <Clause n={5} label="Price">
                <p className="tnum font-display text-[32px] leading-none text-ink-950 sm:text-[38px]">
                  {money(AGREEMENT.price)}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-500">
                  Fixed for the work described above. Nothing else is chargeable without your approval.
                </p>
              </Clause>

              <Clause n={6} label="Warranty">
                <p className="text-[14.5px] text-ink-800 sm:text-[15px]">{AGREEMENT.warranty}</p>
              </Clause>

              <Clause n={7} label="Completion evidence">
                <p className="flex items-start gap-2.5 text-[14.5px] text-ink-800 sm:text-[15px]">
                  <Icon.camera size={16} className="mt-0.5 shrink-0 text-ink-400" />
                  {AGREEMENT.evidenceRequired}
                </p>
              </Clause>

              <Clause n={8} label="If something changes" last>
                <p className="text-[14.5px] leading-relaxed text-ink-800 sm:text-[15px]">
                  {AGREEMENT.changePolicy}
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-ink-500">
                  Extra work discovered mid-job is normal. What is not normal is finding out about it on
                  the final bill.
                </p>
              </Clause>
            </div>
          </article>

          {/* ── Approval ───────────────────────────────────────────── */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div
              className={`sticky bottom-[calc(var(--tabbar-h)+8px)] rounded-2xl p-5 transition-colors
                duration-300 sm:p-7 md:bottom-0 lg:static
                ${
                  approved
                    ? 'bg-success-100'
                    : 'bg-white shadow-[0_1px_2px_rgba(15,17,20,0.04),0_18px_50px_-28px_rgba(15,17,20,0.3)]'
                }`}
            >
              {approved ? (
                <div className="a-up">
                  <span className="a-mark mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-success-700 text-white">
                    <Icon.check size={22} />
                  </span>
                  <p className="font-display text-[24px] leading-tight text-success-800 sm:text-[26px]">
                    Agreement approved
                  </p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-success-800/80">
                    Recorded at 11:28 against case {AGREEMENT.caseId}. {pro.short} has been notified and
                    can begin.
                  </p>
                  <Button full size="lg" className="mt-5 sm:mt-6" to="/case/TC-2048/record">
                    Follow the work
                  </Button>
                </div>
              ) : (
                <>
                  <Eyebrow tone="teal" className="mb-3">
                    Approve
                  </Eyebrow>
                  <p className="tnum font-display text-[24px] leading-tight text-ink-950 sm:text-[26px]">
                    {money(AGREEMENT.price)}
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-500">
                    Payment is held until you verify the work is done. {pro.short} is paid after that.
                  </p>

                  <Rule className="my-5 sm:my-6" />

                  {/* Deliberate: a financial commitment gets two actions, not one. */}
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={read}
                      onChange={e => setRead(e.target.checked)}
                      className="mt-0.5 shrink-0 accent-teal-800"
                      style={{ width: 17, height: 17 }}
                    />
                    <span className="text-[13px] leading-relaxed text-ink-700">
                      I have read the agreed work, the price and the warranty above.
                    </span>
                  </label>

                  <Button
                    full
                    size="lg"
                    className="mt-4 sm:mt-5"
                    disabled={!read}
                    onClick={() => {
                      set({ agreementApproved: true })
                      notify('Work agreement approved and recorded')
                    }}
                  >
                    Approve work
                  </Button>
                  <Button full size="md" variant="ghost" className="mt-2" to="/messages">
                    Request a change first
                  </Button>

                  {!read && (
                    <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-ink-400">
                      <Icon.info size={12} />
                      Confirm you have read it to continue
                    </p>
                  )}
                </>
              )}
            </div>

            <Disclosure summary="What happens to my money" className="mt-5 sm:mt-6">
              <p className="text-[13px] leading-relaxed text-ink-600">
                The amount is authorised now and held. It is released to {pro.short} once you confirm the
                work is complete on the proof timeline. If you and {pro.short} disagree, it stays held
                while the case is reviewed.
              </p>
            </Disclosure>
          </aside>
        </div>
      </div>
    </AppShell>
  )
}

/**
 * One numbered clause. The number is the document's spine: on a wide screen it
 * sits in the margin beside the label, on a phone it runs inline above the
 * text, and in both cases the clause is addressable by number.
 */
function Clause({
  n,
  label,
  children,
  last,
}: {
  n: number
  label: string
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <section className="grid grid-cols-1 gap-x-8 gap-y-2.5 py-5 sm:grid-cols-[132px_minmax(0,1fr)] sm:py-6 lg:gap-x-10 lg:grid-cols-[150px_minmax(0,1fr)]">
      <div className="flex items-baseline gap-2 sm:pt-1">
        <span className="font-data text-[10.5px] text-ink-300">{String(n).padStart(2, '0')}</span>
        <Eyebrow>{label}</Eyebrow>
      </div>
      <div className="min-w-0">{children}</div>
      {!last && (
        <div className="col-span-full pt-5 sm:pt-6">
          <Rule />
        </div>
      )}
    </section>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Change Request ★
//
// The mid-job discovery, taken out of a conversation and into the record. The
// whole screen turns on one comparison — what was agreed against what is being
// asked — so that comparison is drawn once, large, before any prose.
// ════════════════════════════════════════════════════════════════════════════

export function ChangeRequest() {
  const { progress, set, notify } = useStore()
  const pro = proById(CHANGE_REQUEST.raisedBy)
  const evidence = evidenceById(CHANGE_REQUEST.evidenceId)
  const decision = progress.changeDecision
  const [asking, setAsking] = useState(false)
  const [question, setQuestion] = useState('')

  return (
    <AppShell caseStage="prove">
      <div className="pb-16 pt-7 sm:pt-9 lg:pb-20 lg:pt-11">
        <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 sm:mb-8">
          <Pill tone="warning" icon={<StatusDot tone="warning" pulse />}>
            Work paused, awaiting your decision
          </Pill>
          <TextLink tone="muted" onClick={() => navigate('/case/TC-2048/record')}>
            Back to the record
          </TextLink>
        </div>

        <Eyebrow tone="gold" className="mb-3 sm:mb-4">
          Change request {CHANGE_REQUEST.id} · raised {CHANGE_REQUEST.at}
        </Eyebrow>
        <Display size="lg" as="h1" className="a-up max-w-2xl text-ink-950">
          {CHANGE_REQUEST.title}
        </Display>

        <div className="a-up d1 mt-5 flex items-center gap-3">
          <Avatar tint={pro.tint} name={pro.name} size={32} />
          <p className="text-[13.5px] text-ink-500 sm:text-[14px]">
            Raised by <span className="font-medium text-ink-800">{pro.name}</span>, on site
          </p>
        </div>

        {/* The delta, before any explanation of it. */}
        <Delta />

        <div className="mt-10 grid grid-cols-1 gap-x-14 gap-y-10 sm:mt-12 lg:grid-cols-[minmax(0,1fr)_340px] xl:gap-x-16 xl:grid-cols-[minmax(0,1fr)_380px]">
          <article className="min-w-0">
            <Eyebrow className="mb-3 sm:mb-4">Why</Eyebrow>
            <p className="quote-lg measure text-ink-800">{CHANGE_REQUEST.reason}</p>

            {evidence && (
              <figure className="mt-7 sm:mt-9">
                <div className="overflow-hidden rounded-2xl bg-ink-950">
                  <img
                    src={evidence.src}
                    alt={evidence.label}
                    className="max-h-[380px] w-full object-cover"
                  />
                </div>
                <figcaption className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12.5px] text-ink-500">
                  <EvidenceRef label={evidenceTag(evidence.id, evidence.kind)} />
                  {evidence.label}
                  <span aria-hidden="true">·</span>
                  <span>Taken by {evidence.by}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-data">{evidence.at}</span>
                </figcaption>
              </figure>
            )}

            <Rule className="my-8 sm:my-9" />

            <Eyebrow className="mb-2">What changes</Eyebrow>
            <dl>
              <ChangeRow
                label="Scope addition"
                value={CHANGE_REQUEST.scopeAddition}
                icon={<Icon.plus size={15} className="text-teal-700" />}
              />
              <ChangeRow
                label="Price change"
                value={`+ ${money(CHANGE_REQUEST.priceChange)}`}
                icon={<Icon.plus size={15} className="text-warning-700" />}
              />
              <ChangeRow
                label="Time change"
                value={`+ ${CHANGE_REQUEST.timeChange} minutes`}
                icon={<Icon.clock size={15} className="text-ink-400" />}
              />
              <ChangeRow
                label="Warranty"
                value="Unchanged — 30 days on labour, now covering both parts"
                icon={<Icon.shield size={15} className="text-success-700" />}
                last
              />
            </dl>

            <Disclosure summary="What happens if I decline" className="measure mt-7 sm:mt-8">
              <p className="text-[13.5px] leading-relaxed text-ink-600">
                {CHANGE_REQUEST.declineConsequence}
              </p>
            </Disclosure>
          </article>

          {/* Decision rail — pinned above the tab bar so it is thumb-reachable. */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            {decision ? (
              <div
                className={`a-up rounded-2xl p-5 sm:p-6 ${
                  decision === 'approved' ? 'bg-success-100' : 'bg-[var(--color-sunken)]'
                }`}
              >
                <p
                  className={`flex items-center gap-2.5 font-display text-[22px] ${
                    decision === 'approved' ? 'text-success-800' : 'text-ink-800'
                  }`}
                >
                  {decision === 'approved' ? <Icon.check size={20} /> : <Icon.dash size={20} />}
                  {decision === 'approved' ? 'Approved' : 'Declined'}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-600">
                  {decision === 'approved'
                    ? `Recorded at 11:52. ${pro.short} has resumed, and the new total of ${money(CHANGE_REQUEST.newTotal)} is now the agreed figure.`
                    : CHANGE_REQUEST.declineConsequence}
                </p>
                <Button full size="lg" className="mt-5" to="/case/TC-2048/record">
                  Back to the record
                </Button>
              </div>
            ) : (
              <div
                className="sticky bottom-[calc(var(--tabbar-h)+8px)] space-y-2.5 rounded-2xl
                  bg-[var(--color-canvas)]/95 p-3 backdrop-blur-md md:bottom-0 md:bg-transparent
                  md:p-0 md:backdrop-blur-none lg:static"
              >
                <Button
                  full
                  size="lg"
                  onClick={() => {
                    set({ changeDecision: 'approved' })
                    notify(`Change request approved — new total ${money(CHANGE_REQUEST.newTotal)}`)
                  }}
                >
                  Approve · {money(CHANGE_REQUEST.newTotal)}
                </Button>
                <div className="flex gap-2.5 md:block md:space-y-2.5">
                  <Button
                    full
                    size="md"
                    variant="secondary"
                    onClick={() => {
                      set({ changeDecision: 'declined' })
                      notify('Change request declined and recorded')
                    }}
                  >
                    Decline
                  </Button>
                  <Button full size="md" variant="ghost" onClick={() => setAsking(a => !a)}>
                    Ask a question
                  </Button>
                </div>

                {asking && (
                  <div className="a-up rounded-xl bg-white p-4 ring-1 ring-[var(--color-rule)]">
                    <label htmlFor="cr-q" className="mb-2 block text-[12.5px] font-medium text-ink-700">
                      Your question to {pro.short}
                    </label>
                    <textarea
                      id="cr-q"
                      rows={3}
                      value={question}
                      onChange={e => setQuestion(e.target.value)}
                      placeholder="Is the hose likely to fail soon if I leave it?"
                      className="w-full resize-none rounded-lg bg-[var(--color-sunken)] px-3 py-2.5 text-[13.5px]
                        text-ink-900 placeholder:text-ink-400 focus:outline-none"
                    />
                    <Button
                      size="sm"
                      className="mt-2.5"
                      disabled={question.trim().length === 0}
                      onClick={() => {
                        notify('Question sent — the work stays paused meanwhile')
                        setAsking(false)
                        setQuestion('')
                      }}
                    >
                      Send question
                    </Button>
                  </div>
                )}

                <p className="hidden pt-2 text-center text-[12px] leading-relaxed text-ink-400 md:block">
                  Whatever you choose is recorded against the case with today&apos;s date.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </AppShell>
  )
}

/**
 * Original → change → new total, drawn as one continuous movement. The arrow
 * turns downward when the three stack, so the direction of travel survives the
 * change of axis.
 */
function Delta() {
  const pct = Math.round((CHANGE_REQUEST.priceChange / CHANGE_REQUEST.originalTotal) * 100)
  return (
    <section
      aria-label="What this changes"
      className="a-rise mt-7 overflow-hidden rounded-2xl bg-ink-950 text-white sm:mt-9"
    >
      <div className="grid grid-cols-1 items-stretch sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
        <DeltaCell label="Originally agreed" sub="Approved 11:28">
          <span className="tnum font-data text-[26px] text-white/55 line-through sm:text-[28px]">
            {money(CHANGE_REQUEST.originalTotal)}
          </span>
        </DeltaCell>

        <DeltaArrow />

        <DeltaCell label="This change" sub={`+ ${CHANGE_REQUEST.timeChange} min on site`} tone="warning">
          <span className="tnum font-display text-[30px] leading-none text-warning-700 sm:text-[34px]">
            + {money(CHANGE_REQUEST.priceChange)}
          </span>
        </DeltaCell>

        <DeltaArrow />

        <DeltaCell label="New total" sub={`${pct}% above what you agreed`} tone="new">
          <span className="tnum font-display text-[36px] leading-none text-white sm:text-[42px]">
            {money(CHANGE_REQUEST.newTotal)}
          </span>
        </DeltaCell>
      </div>
    </section>
  )
}

function DeltaCell({
  label,
  sub,
  children,
  tone,
}: {
  label: string
  sub: string
  children: React.ReactNode
  tone?: 'warning' | 'new'
}) {
  return (
    <div className={`px-5 py-5 sm:px-6 sm:py-7 ${tone === 'new' ? 'bg-white/[0.05]' : ''}`}>
      <p
        className={`font-data text-[10px] uppercase tracking-[0.14em]
          ${tone === 'warning' ? 'text-warning-700' : 'text-white/45'}`}
      >
        {label}
      </p>
      <p className="mt-2.5">{children}</p>
      <p className="mt-2 text-[12px] leading-snug text-white/40">{sub}</p>
    </div>
  )
}

function DeltaArrow() {
  return (
    <div className="flex items-center justify-center py-1 sm:px-1 sm:py-0" aria-hidden="true">
      <Icon.arrow size={18} className="rotate-90 text-white/25 sm:rotate-0" />
    </div>
  )
}

function ChangeRow({
  label,
  value,
  icon,
  last,
}: {
  label: string
  value: string
  icon: React.ReactNode
  last?: boolean
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-6 py-3.5 sm:gap-8 sm:py-4">
        <dt className="shrink-0 text-[13px] text-ink-500 sm:text-[13.5px]">{label}</dt>
        <dd className="flex max-w-md items-start gap-2.5 text-right text-[14px] font-medium text-ink-950 sm:text-[15px]">
          <span>{value}</span>
          <span className="mt-0.5 shrink-0">{icon}</span>
        </dd>
      </div>
      {!last && <Rule />}
    </>
  )
}
