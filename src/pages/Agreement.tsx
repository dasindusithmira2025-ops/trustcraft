import { useState } from 'react'
import { navigate, useStore } from '../app-state'
import { AppShell } from '../shell'
import {
  Avatar,
  Button,
  Display,
  Disclosure,
  Eyebrow,
  Icon,
  Pill,
  Rule,
  StatusDot,
  TextLink,
} from '../ui'
import { AGREEMENT, CHANGE_REQUEST, evidenceById, money, proById } from '../data'

// ════════════════════════════════════════════════════════════════════════════
// Work Agreement — approval is deliberate, never a stray click
// ════════════════════════════════════════════════════════════════════════════

export function WorkAgreement() {
  const { progress, set, notify } = useStore()
  const [read, setRead] = useState(false)
  const pro = proById(progress.acceptedQuote ?? AGREEMENT.proId)
  const approved = progress.agreementApproved

  return (
    <AppShell recede caseStage="agree">
      <div className="pb-20 pt-12">
        <div className="grid grid-cols-1 gap-x-20 gap-y-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* The agreement itself, set like a document */}
          <article>
            <button
              type="button"
              onClick={() => navigate('/case/TC-2048/plan')}
              className="mb-7 inline-flex items-center gap-2 text-[13px] text-ink-500 transition-colors hover:text-ink-900"
            >
              <Icon.arrowLeft size={15} />
              Repair plan
            </button>

            <Eyebrow tone="teal" className="mb-4">
              Work agreement · {AGREEMENT.caseId}
            </Eyebrow>
            <Display size="lg" as="h1" className="a-up text-ink-950">
              What you are
              <br />
              agreeing to.
            </Display>
            <p className="a-up d1 mt-5 max-w-xl text-[15px] leading-relaxed text-ink-500">
              This is the whole of it. Anything not written here is not part of the job, and cannot be
              added without coming back to you.
            </p>

            <Rule className="my-10" />

            <Clause label="Case">
              <p className="text-[16px] font-medium text-ink-950">Kitchen sink leak</p>
              <p className="mt-1 text-[13.5px] text-ink-500">Kitchen · Sink · Colombo 05</p>
            </Clause>

            <Clause label="Professional">
              <div className="flex items-center gap-3">
                <Avatar tint={pro.tint} name={pro.name} size={34} />
                <div>
                  <p className="text-[16px] font-medium text-ink-950">{pro.name}</p>
                  <p className="mt-0.5 text-[13px] text-ink-500">
                    Identity and qualification verified · {pro.similarJobs} similar repairs
                  </p>
                </div>
              </div>
            </Clause>

            <Clause label="Agreed work">
              <ul className="space-y-3">
                {AGREEMENT.agreedWork.map(w => (
                  <li key={w} className="flex items-start gap-3 text-[16px] leading-snug text-ink-900">
                    <Icon.check size={16} className="mt-1 shrink-0 text-teal-700" />
                    {w}
                  </li>
                ))}
              </ul>
            </Clause>

            <Clause label="Materials">
              <p className="text-[15px] text-ink-800">{AGREEMENT.materials}</p>
            </Clause>

            <Clause label="Price">
              <p className="tnum font-display text-[38px] leading-none text-ink-950">
                {money(AGREEMENT.price)}
              </p>
              <p className="mt-2 text-[13px] text-ink-500">
                Fixed for the work described above. Nothing else is chargeable without your approval.
              </p>
            </Clause>

            <Clause label="Warranty">
              <p className="text-[15px] text-ink-800">{AGREEMENT.warranty}</p>
            </Clause>

            <Clause label="Completion evidence">
              <p className="flex items-start gap-2.5 text-[15px] text-ink-800">
                <Icon.camera size={16} className="mt-1 shrink-0 text-ink-400" />
                {AGREEMENT.evidenceRequired}
              </p>
            </Clause>

            <Clause label="If something changes" last>
              <p className="text-[15px] leading-relaxed text-ink-800">{AGREEMENT.changePolicy}</p>
              <p className="mt-3 text-[13px] leading-relaxed text-ink-500">
                Extra work discovered mid-job is normal. What is not normal is finding out about it on
                the final bill.
              </p>
            </Clause>
          </article>

          {/* Approval rail */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div
              className={`rounded-2xl p-7 transition-colors duration-300
                ${approved ? 'bg-success-100' : 'bg-white shadow-[0_1px_2px_rgba(15,17,20,0.04),0_18px_50px_-28px_rgba(15,17,20,0.3)]'}`}
            >
              {approved ? (
                <div className="a-up">
                  <span className="a-mark mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-success-700 text-white">
                    <Icon.check size={22} />
                  </span>
                  <p className="font-display text-[26px] leading-tight text-success-800">
                    Agreement approved
                  </p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-success-800/80">
                    Recorded at 11:28 against case TC-2048. {pro.short} has been notified and can begin.
                  </p>
                  <Button full size="lg" className="mt-6" to="/case/TC-2048/record">
                    Follow the work
                  </Button>
                </div>
              ) : (
                <>
                  <Eyebrow tone="teal" className="mb-3">
                    Approve
                  </Eyebrow>
                  <p className="font-display text-[26px] leading-tight text-ink-950">
                    {money(AGREEMENT.price)}
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-500">
                    Payment is held until you verify the work is done. {pro.short} is paid after that.
                  </p>

                  <Rule className="my-6" />

                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={read}
                      onChange={e => setRead(e.target.checked)}
                      className="mt-0.5 h-4.5 w-4.5 shrink-0 accent-teal-800"
                      style={{ width: 17, height: 17 }}
                    />
                    <span className="text-[13px] leading-relaxed text-ink-700">
                      I have read the agreed work, the price and the warranty above.
                    </span>
                  </label>

                  <Button
                    full
                    size="lg"
                    className="mt-5"
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

            <Disclosure summary="What happens to my money" className="mt-6">
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

function Clause({
  label,
  children,
  last,
}: {
  label: string
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <section className="grid grid-cols-1 gap-x-10 gap-y-3 py-6 sm:grid-cols-[150px_minmax(0,1fr)]">
      <Eyebrow className="pt-1">{label}</Eyebrow>
      <div>
        {children}
        {!last && <Rule className="mt-6 sm:hidden" />}
      </div>
      {!last && (
        <div className="col-span-full">
          <Rule />
        </div>
      )}
    </section>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Change Request ★ — the mid-job discovery, out of chat and into the record
// ════════════════════════════════════════════════════════════════════════════

export function ChangeRequest() {
  const { progress, set, notify } = useStore()
  const pro = proById(CHANGE_REQUEST.raisedBy)
  const evidence = evidenceById(CHANGE_REQUEST.evidenceId)
  const decision = progress.changeDecision
  const [asking, setAsking] = useState(false)
  const [question, setQuestion] = useState('')

  return (
    <AppShell recede caseStage="prove">
      <div className="pb-20 pt-12">
        <div className="mb-9 flex flex-wrap items-center gap-4">
          <Pill tone="warning" icon={<StatusDot tone="warning" pulse />}>
            Work paused, awaiting your decision
          </Pill>
          <TextLink tone="muted" onClick={() => navigate('/case/TC-2048/record')}>
            Back to the record
          </TextLink>
        </div>

        <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_380px]">
          <article>
            <Eyebrow tone="gold" className="mb-4">
              Change request {CHANGE_REQUEST.id} · raised {CHANGE_REQUEST.at}
            </Eyebrow>
            <Display size="lg" as="h1" className="a-up max-w-2xl text-ink-950">
              {CHANGE_REQUEST.title}
            </Display>

            <div className="a-up d1 mt-6 flex items-center gap-3">
              <Avatar tint={pro.tint} name={pro.name} size={34} />
              <p className="text-[14px] text-ink-500">
                Raised by <span className="font-medium text-ink-800">{pro.name}</span>, on site
              </p>
            </div>

            <Rule className="my-9" />

            <Eyebrow className="mb-4">Why</Eyebrow>
            <p className="max-w-2xl font-display text-[22px] leading-[1.5] text-ink-800">
              {CHANGE_REQUEST.reason}
            </p>

            {evidence && (
              <figure className="mt-9">
                <div className="overflow-hidden rounded-2xl bg-ink-950">
                  <img
                    src={evidence.src}
                    alt={evidence.label}
                    className="max-h-[380px] w-full object-cover"
                  />
                </div>
                <figcaption className="mt-3 flex flex-wrap items-center gap-x-3 text-[12.5px] text-ink-500">
                  <Icon.camera size={13} />
                  {evidence.label}
                  <span aria-hidden="true">·</span>
                  <span>Taken by {evidence.by}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-data">{evidence.at}</span>
                </figcaption>
              </figure>
            )}

            <Rule className="my-9" />

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

            <Disclosure summary="What happens if I decline" className="mt-8 max-w-2xl">
              <p className="text-[13.5px] leading-relaxed text-ink-600">
                {CHANGE_REQUEST.declineConsequence}
              </p>
            </Disclosure>
          </article>

          {/* Decision rail */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            {/* The money, before and after, side by side. */}
            <div className="rounded-2xl bg-ink-950 p-7 text-white">
              <Eyebrow tone="light" className="mb-5">
                Agreed total
              </Eyebrow>
              <div className="flex items-end gap-5">
                <div>
                  <p className="text-[11.5px] text-white/40">Now</p>
                  <p className="tnum mt-1 font-data text-[22px] text-white/50 line-through">
                    {money(CHANGE_REQUEST.originalTotal)}
                  </p>
                </div>
                <Icon.arrow size={18} className="mb-2 text-white/30" />
                <div>
                  <p className="text-[11.5px] text-white/40">If approved</p>
                  <p className="tnum mt-1 font-display text-[34px] leading-none">
                    {money(CHANGE_REQUEST.newTotal)}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-[12.5px] leading-relaxed text-white/45">
                An increase of {money(CHANGE_REQUEST.priceChange)}, which is {' '}
                {Math.round((CHANGE_REQUEST.priceChange / CHANGE_REQUEST.originalTotal) * 100)}% above what
                you agreed.
              </p>
            </div>

            {decision ? (
              <div
                className={`a-up mt-5 rounded-2xl p-6 ${
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
              <div className="mt-5 space-y-2.5">
                <Button
                  full
                  size="lg"
                  onClick={() => {
                    set({ changeDecision: 'approved' })
                    notify('Change request approved — new total Rs.8,400')
                  }}
                >
                  Approve · {money(CHANGE_REQUEST.newTotal)}
                </Button>
                <Button
                  full
                  size="md"
                  variant="secondary"
                  onClick={() => {
                    set({ changeDecision: 'declined' })
                    notify('Change request declined and recorded')
                  }}
                >
                  Decline this change
                </Button>
                <Button full size="md" variant="ghost" onClick={() => setAsking(a => !a)}>
                  Ask a question first
                </Button>

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

                <p className="pt-2 text-center text-[12px] leading-relaxed text-ink-400">
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
      <div className="flex items-start justify-between gap-8 py-4">
        <dt className="text-[13.5px] text-ink-500">{label}</dt>
        <dd className="flex max-w-md items-start gap-2.5 text-right text-[15px] font-medium text-ink-950">
          <span>{value}</span>
          <span className="mt-0.5 shrink-0">{icon}</span>
        </dd>
      </div>
      {!last && <Rule />}
    </>
  )
}
