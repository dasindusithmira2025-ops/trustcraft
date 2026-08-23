import { useMemo, useState } from 'react'
import { navigate, useStore } from '../app-state'
import { AppShell } from '../shell'
import {
  Avatar,
  Button,
  Display,
  Disclosure,
  Eyebrow,
  Icon,
  InfoHint,
  PageHead,
  Pill,
  Rule,
  ScopeMark,
  TextLink,
  Tooltip,
} from '../ui'
import {
  LENS_INSIGHTS,
  PROS,
  QUOTES,
  REPAIR_PLAN,
  SCOPE_LINES,
  money,
  proById,
  quoteFor,
  type Quote,
} from '../data'

// ════════════════════════════════════════════════════════════════════════════
// Quote Lens ★  — compare scope, not only price
// ════════════════════════════════════════════════════════════════════════════

export function QuoteLens() {
  const { progress, set, notify } = useStore()
  const [diffOnly, setDiffOnly] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  const rows = useMemo(() => {
    if (!diffOnly) return SCOPE_LINES
    return SCOPE_LINES.filter(line => {
      const states = QUOTES.map(q => q.scope[line.key])
      return new Set(states).size > 1
    })
  }, [diffOnly])

  const cheapest = QUOTES.reduce((a, b) => (a.total <= b.total ? a : b))
  const unstatedCount = (q: Quote) => Object.values(q.scope).filter(s => s === 'unstated').length

  return (
    <AppShell recede caseStage="agree">
      <div className="pb-20 pt-12">
        <PageHead
          eyebrow="Quote Lens"
          title="Three quotes. They are not the same job."
          lede="Every quote answers the same six questions about scope. Read across before you read the totals — the cheapest quote is cheapest partly because it promises less."
          back={{ label: 'Professional fit', to: '/case/TC-2048/fit' }}
          aside={
            <label className="flex cursor-pointer select-none items-center gap-2.5 rounded-[10px] border border-[var(--color-rule-strong)] bg-white px-4 py-2.5">
              <input
                type="checkbox"
                checked={diffOnly}
                onChange={e => setDiffOnly(e.target.checked)}
                className="h-4 w-4 accent-teal-800"
              />
              <span className="text-[13px] font-medium text-ink-800">Show only what differs</span>
            </label>
          }
        />

        <div className="grid grid-cols-1 gap-x-14 gap-y-12 xl:grid-cols-[minmax(0,1fr)_336px]">
          {/* ── The lens ────────────────────────────────────────────── */}
          <div className="min-w-0 overflow-x-auto thin-scroll">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <caption className="sr-only">
                Quote comparison across scope lines, warranty, duration, inspection fee and total.
              </caption>

              <thead className="sticky-head">
                <tr>
                  <th scope="col" className="w-[220px] pb-4 align-bottom">
                    <Eyebrow>Scope line</Eyebrow>
                  </th>
                  {QUOTES.map(q => {
                    const pro = proById(q.proId)
                    return (
                      <th
                        key={q.proId}
                        scope="col"
                        onMouseEnter={() => setHovered(q.proId)}
                        onMouseLeave={() => setHovered(null)}
                        className="w-[180px] pb-4 pr-6 align-bottom"
                      >
                        <div className="flex items-center gap-2.5">
                          <Avatar tint={pro.tint} name={pro.name} size={32} />
                          <div>
                            <p className="font-display text-[19px] leading-tight text-ink-950">
                              {pro.short}
                            </p>
                            {unstatedCount(q) > 0 && (
                              <p className="mt-0.5 flex items-center gap-1 text-[11px] font-normal text-warning-700">
                                <Icon.question size={11} />
                                {unstatedCount(q)} unstated
                              </p>
                            )}
                          </div>
                        </div>
                      </th>
                    )
                  })}
                </tr>
                <tr aria-hidden="true">
                  <td colSpan={4} className="p-0">
                    <Rule tone="strong" />
                  </td>
                </tr>
              </thead>

              <tbody>
                {rows.map(line => (
                  <tr key={line.key} className="group/row">
                    <th
                      scope="row"
                      className="py-3.5 pr-6 text-[13.5px] font-medium text-ink-700 transition-colors
                        group-hover/row:text-ink-950"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {line.label}
                        <InfoHint label={line.hint} />
                      </span>
                    </th>
                    {QUOTES.map(q => {
                      const state = q.scope[line.key]
                      return (
                        <td
                          key={q.proId}
                          onMouseEnter={() => setHovered(q.proId)}
                          onMouseLeave={() => setHovered(null)}
                          className={`py-3.5 pr-6 transition-colors duration-150
                            ${state === 'unstated' ? 'bg-warning-100/70' : ''}
                            ${hovered === q.proId ? 'bg-black/[0.02]' : ''}`}
                        >
                          <ScopeMark state={state} />
                        </td>
                      )
                    })}
                  </tr>
                ))}

                {rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-[14px] text-ink-500">
                      Every scope line is identical across the three quotes.
                    </td>
                  </tr>
                )}

                <tr aria-hidden="true">
                  <td colSpan={4} className="p-0 pt-3">
                    <Rule />
                  </td>
                </tr>

                <TermRow
                  label="Warranty"
                  hint="Cover on the labour if the same fault returns."
                  hovered={hovered}
                  render={q =>
                    q.warrantyDays ? (
                      <span className="tnum text-[14.5px] font-medium text-ink-900">
                        {q.warrantyDays} days
                      </span>
                    ) : (
                      <ScopeMark state="unstated" />
                    )
                  }
                  flag={q => q.warrantyDays === null}
                />
                <TermRow
                  label="Expected duration"
                  hint="How long the professional expects to be on site."
                  hovered={hovered}
                  render={q => (
                    <span className="tnum text-[14.5px] text-ink-700">{q.durationMin} min</span>
                  )}
                />
                <TermRow
                  label="Inspection"
                  hint="Credited against the repair if you continue with the same professional."
                  hovered={hovered}
                  render={q => <span className="tnum text-[14.5px] text-ink-700">{money(q.inspection)}</span>}
                />

                <tr aria-hidden="true">
                  <td colSpan={4} className="p-0 pt-2">
                    <Rule tone="strong" />
                  </td>
                </tr>

                {/* Totals — the loudest row, and deliberately the last one read. */}
                <tr>
                  <th scope="row" className="py-7 pr-6 align-top">
                    <Eyebrow tone="teal">Quoted total</Eyebrow>
                  </th>
                  {QUOTES.map(q => (
                    <td
                      key={q.proId}
                      onMouseEnter={() => setHovered(q.proId)}
                      onMouseLeave={() => setHovered(null)}
                      className="py-7 pr-6 align-top"
                    >
                      <p className="tnum font-display text-[34px] leading-none text-ink-950">
                        {money(q.total)}
                      </p>
                      {q.proId === cheapest.proId && (
                        <Pill tone="gold" className="mt-3">
                          Lowest quoted
                        </Pill>
                      )}
                      {unstatedCount(q) > 0 && (
                        <Tooltip label="Unstated lines can be billed on top. This figure is not directly comparable to the others.">
                          <p className="mt-2 flex items-center gap-1.5 text-[12px] text-warning-700">
                            <Icon.alert size={12} />
                            Not directly comparable
                          </p>
                        </Tooltip>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr>
                  <th scope="row" className="py-4 pr-6 align-top text-[13.5px] font-medium text-ink-600">
                    Decide
                  </th>
                  {QUOTES.map(q => {
                    const pro = proById(q.proId)
                    const chosen = progress.acceptedQuote === q.proId
                    return (
                      <td key={q.proId} className="py-4 pr-6 align-top">
                        <div className="flex flex-col items-start gap-2.5">
                          <Button
                            size="sm"
                            variant={q.proId === 'chamod' ? 'primary' : 'secondary'}
                            onClick={() => {
                              set({ acceptedQuote: q.proId, selectedPro: q.proId })
                              notify(`${pro.short}'s plan selected`)
                              window.setTimeout(() => navigate('/case/TC-2048/plan'), 650)
                            }}
                          >
                            {chosen ? 'Selected' : 'View repair plan'}
                          </Button>
                          <TextLink tone="muted" onClick={() => navigate(`/pro/${pro.id}`)}>
                            About {pro.short}
                          </TextLink>
                        </div>
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>

            {/* Each professional's own words, not paraphrased by us. */}
            <div className="mt-12">
              <Eyebrow className="mb-4">In their words</Eyebrow>
              {QUOTES.map(q => (
                <div key={q.proId}>
                  <Rule />
                  <div className="flex gap-5 py-5">
                    <Avatar tint={proById(q.proId).tint} name={proById(q.proId).name} size={34} />
                    <p className="max-w-2xl text-[14px] leading-relaxed text-ink-600">
                      <span className="font-medium text-ink-900">{proById(q.proId).short}: </span>
                      {q.note}
                    </p>
                  </div>
                </div>
              ))}
              <Rule />
            </div>
          </div>

          {/* ── What TrustCraft noticed ─────────────────────────────── */}
          <aside aria-label="What TrustCraft noticed" className="xl:sticky xl:top-32 xl:self-start">
            <Eyebrow tone="teal" className="mb-5">
              What TrustCraft noticed
            </Eyebrow>

            <div className="space-y-0">
              {LENS_INSIGHTS.map((ins, i) => (
                <Insight key={ins.headline} insight={ins} index={i} onHover={setHovered} />
              ))}
            </div>

            <div className="mt-8 rounded-xl bg-[var(--color-sunken)] p-5">
              <p className="text-[13.5px] leading-relaxed text-ink-700">
                TrustCraft highlights differences. The decision remains yours.
              </p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink-500">
                None of these quotes is wrong. They describe different amounts of work, and only you know
                how long you plan to keep this kitchen.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  )
}

function TermRow({
  label,
  hint,
  render,
  hovered,
  flag,
}: {
  label: string
  hint: string
  render: (q: Quote) => React.ReactNode
  hovered: string | null
  flag?: (q: Quote) => boolean
}) {
  return (
    <tr className="group/row">
      <th scope="row" className="py-3.5 pr-6 text-[13.5px] font-medium text-ink-700">
        <span className="inline-flex items-center gap-1.5">
          {label}
          <InfoHint label={hint} />
        </span>
      </th>
      {QUOTES.map(q => (
        <td
          key={q.proId}
          className={`py-3.5 pr-6 transition-colors duration-150
            ${flag?.(q) ? 'bg-warning-100/70' : ''} ${hovered === q.proId ? 'bg-black/[0.02]' : ''}`}
        >
          {render(q)}
        </td>
      ))}
    </tr>
  )
}

function Insight({
  insight,
  index,
  onHover,
}: {
  insight: (typeof LENS_INSIGHTS)[number]
  index: number
  onHover: (id: string | null) => void
}) {
  const pro = proById(insight.proId)
  const tone =
    insight.kind === 'gap' ? 'warning' : insight.kind === 'cheapest' ? 'gold' : insight.kind === 'complete' ? 'teal' : 'neutral'
  return (
    <div
      onMouseEnter={() => onHover(insight.proId)}
      onMouseLeave={() => onHover(null)}
      className="a-up"
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <Rule />
      <div className="py-5">
        <div className="mb-2 flex items-center gap-2.5">
          {insight.kind === 'gap' ? (
            <Icon.alert size={15} className="text-warning-700" />
          ) : (
            <Avatar tint={pro.tint} name={pro.name} size={22} />
          )}
          <p
            className={`text-[14px] font-semibold ${
              tone === 'warning' ? 'text-warning-700' : 'text-ink-950'
            }`}
          >
            {insight.headline}
          </p>
        </div>
        <p className="text-[13px] leading-relaxed text-ink-600">{insight.body}</p>
        {insight.kind !== 'gap' && (
          <p className="mt-1.5 text-[12px] text-ink-400">{pro.name}</p>
        )}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Repair Plan — reads like a plan, not an invoice
// ════════════════════════════════════════════════════════════════════════════

export function RepairPlan() {
  const { progress } = useStore()
  const proId = progress.acceptedQuote ?? REPAIR_PLAN.proId
  const pro = proById(proId)
  const quote = quoteFor(proId)
  const lines = REPAIR_PLAN.lines

  return (
    <AppShell recede caseStage="agree">
      <div className="pb-20 pt-12">
        <div className="grid grid-cols-1 gap-x-20 gap-y-12 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article>
            <button
              type="button"
              onClick={() => navigate('/case/TC-2048/quotes')}
              className="mb-7 inline-flex items-center gap-2 text-[13px] text-ink-500 transition-colors hover:text-ink-900"
            >
              <Icon.arrowLeft size={15} />
              All three quotes
            </button>

            <Eyebrow tone="teal" className="mb-4">
              Repair plan
            </Eyebrow>
            <Display size="lg" as="h1" className="a-up max-w-xl text-ink-950">
              {REPAIR_PLAN.title}
            </Display>
            <p className="a-up d1 mt-4 flex items-center gap-2.5 text-[14px] text-ink-500">
              <Avatar tint={pro.tint} name={pro.name} size={24} />
              {pro.name} · 23 August 2026
            </p>

            <Rule className="my-10" />

            <Eyebrow className="mb-4">What was found</Eyebrow>
            <p className="max-w-2xl font-display text-[22px] leading-[1.5] text-ink-800">
              {REPAIR_PLAN.diagnosis}
            </p>

            <Rule className="my-10" />

            <Eyebrow className="mb-2">The work</Eyebrow>
            <dl>
              {lines.map(l => (
                <div key={l.label}>
                  <div className="flex items-start justify-between gap-8 py-5">
                    <div>
                      <dt className="font-data text-[10.5px] uppercase tracking-[0.14em] text-ink-400">
                        {l.group}
                      </dt>
                      <p className="mt-1.5 text-[16px] font-medium text-ink-950">{l.label}</p>
                      <p className="mt-0.5 text-[13px] text-ink-500">{l.detail}</p>
                    </div>
                    <dd className="tnum shrink-0 font-data text-[16px] text-ink-900">
                      {money(l.amount)}
                    </dd>
                  </div>
                  <Rule />
                </div>
              ))}
            </dl>

            <div className="mt-10">
              <Eyebrow className="mb-4">Not included</Eyebrow>
              <ul className="space-y-2.5">
                {REPAIR_PLAN.excluded.map(e => (
                  <li key={e} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-ink-600">
                    <Icon.dash size={15} className="mt-0.5 shrink-0 text-ink-300" />
                    {e}
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex max-w-xl items-start gap-2 text-[12.5px] leading-relaxed text-ink-400">
                <Icon.info size={13} className="mt-0.5 shrink-0" />
                Excluded work cannot be added silently. If the hose turns out to need replacing, it comes
                back to you as a change request first.
              </p>
            </div>
          </article>

          {/* Total + approval rail */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-2xl bg-ink-950 p-7 text-white">
              <Eyebrow tone="light">Total</Eyebrow>
              <p className="tnum mt-3 font-display text-[46px] leading-none">{money(REPAIR_PLAN.total)}</p>
              <p className="mt-3 text-[12.5px] leading-relaxed text-white/45">
                Parts, labour and the inspection fee you already paid, in one figure.
              </p>

              <Rule tone="light" className="my-6" />

              <dl className="space-y-3.5">
                <DarkRow label="Warranty" value={REPAIR_PLAN.warranty} />
                <DarkRow label="Expected duration" value={REPAIR_PLAN.duration} />
                <DarkRow label="Quote holds until" value="Tomorrow, 18:00" />
              </dl>
            </div>

            <Button full size="lg" className="mt-5" to="/case/TC-2048/agreement">
              Continue to agreement
            </Button>
            <Button full size="md" variant="ghost" className="mt-2" to="/messages">
              Ask {pro.short} a question
            </Button>

            <Disclosure summary="Is this a normal price?" className="mt-6">
              <PriceContext total={quote.total} />
            </Disclosure>
          </aside>
        </div>
      </div>
    </AppShell>
  )
}

function DarkRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[12.5px] text-white/45">{label}</dt>
      <dd className="text-[13px] font-medium text-white/90">{value}</dd>
    </div>
  )
}

/** Price context as a range, not a verdict. */
function PriceContext({ total }: { total: number }) {
  const low = 4200
  const high = 12500
  const pos = ((total - low) / (high - low)) * 100
  return (
    <div className="pt-2">
      <p className="mb-4 text-[13px] leading-relaxed text-ink-600">
        Based on 14 comparable completed jobs in the Colombo area over the last 12 months.
      </p>
      <div className="relative mb-2 h-2 rounded-full bg-ink-100">
        <div className="absolute inset-y-0 left-[14%] right-[22%] rounded-full bg-teal-100" />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-teal-800 shadow"
          style={{ left: `calc(${pos}% - 8px)` }}
        />
      </div>
      <div className="tnum flex justify-between font-data text-[11px] text-ink-400">
        <span>{money(low)}</span>
        <span>{money(high)}</span>
      </div>
      <p className="mt-4 text-[13px] text-ink-700">
        This quote sits in the usual range. Being in range is not the same as being right for you — the
        scope still matters more.
      </p>
    </div>
  )
}

/** Re-exported so the Cases page can reuse the roster without importing data twice. */
export { PROS }
