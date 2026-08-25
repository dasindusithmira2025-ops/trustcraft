import { useMemo, useState } from 'react'
import { navigate, useStore } from '../app-state'
import { AppShell } from '../shell'
import {
  Avatar,
  Button,
  CompareCell,
  Display,
  Disclosure,
  Eyebrow,
  Icon,
  InfoHint,
  Pill,
  Rule,
  ScopeMark,
  TextLink,
  Tooltip,
} from '../ui'
import {
  LENS_INSIGHTS,
  QUOTES,
  REPAIR_PLAN,
  SCOPE_LINES,
  money,
  proById,
  quoteFor,
  type Quote,
} from '../data'

// ════════════════════════════════════════════════════════════════════════════
// Quote Lens ★
//
// The screen exists to break one assumption: that the lowest number is the
// cheapest job. So the page opens with the finding, not with the data — the
// comparison underneath is the evidence for a claim already made at the top.
//
//   ≥1024  a scope matrix, read across before down
//   <1024  two quotes at a time, stacked line by line; a three-column matrix
//          on a phone is a matrix nobody reads
// ════════════════════════════════════════════════════════════════════════════

/** Lines this quote leaves open, in the words the quote itself used. */
function gapsOf(q: Quote): { label: string; kind: 'unstated' | 'excluded' }[] {
  const gaps: { label: string; kind: 'unstated' | 'excluded' }[] = []
  for (const line of SCOPE_LINES) {
    const state = q.scope[line.key]
    if (state === 'unstated') gaps.push({ label: `${line.label} not specified`, kind: 'unstated' })
    if (state === 'no') gaps.push({ label: `${line.label} excluded`, kind: 'excluded' })
  }
  if (q.warrantyDays === null) gaps.push({ label: 'Cover not specified', kind: 'unstated' })
  return gaps
}

const unstatedCount = (q: Quote) => Object.values(q.scope).filter(s => s === 'unstated').length
const isComparable = (q: Quote) => unstatedCount(q) === 0 && q.warrantyDays !== null

export function QuoteLens() {
  const { progress, set, notify } = useStore()
  const [diffOnly, setDiffOnly] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [focus, setFocus] = useState<string | null>(progress.acceptedQuote)
  // Which two quotes the small-screen comparison is holding side by side.
  const [pair, setPair] = useState<string[]>(['chamod', 'nimal'])

  const cheapest = QUOTES.reduce((a, b) => (a.total <= b.total ? a : b))
  const comparable = QUOTES.filter(isComparable).length
  const incomplete = QUOTES.length - comparable

  /** Rows where the compared quotes actually disagree. */
  const rowsFor = (ids: string[]) => {
    if (!diffOnly) return SCOPE_LINES
    const set = QUOTES.filter(q => ids.includes(q.proId))
    return SCOPE_LINES.filter(line => new Set(set.map(q => q.scope[line.key])).size > 1)
  }

  const matrixRows = useMemo(() => rowsFor(QUOTES.map(q => q.proId)), [diffOnly])
  const pairRows = useMemo(() => rowsFor(pair), [diffOnly, pair])

  function choose(proId: string) {
    const pro = proById(proId)
    set({ acceptedQuote: proId, selectedPro: proId })
    notify(`${pro.short}'s plan selected`)
    window.setTimeout(() => navigate('/case/TC-2048/plan'), 650)
  }

  /** Selecting a quote replaces the least recently chosen half of the pair. */
  function pick(proId: string) {
    setPair(([, recent]) => (proId === recent ? pair : [recent, proId]))
    setFocus(proId)
  }

  return (
    <AppShell caseStage="agree">
      <div className="pb-16 pt-7 sm:pt-9 lg:pb-20 lg:pt-11">
        <header className="mb-7 sm:mb-9">
          <Eyebrow tone="teal" className="a-up mb-2.5 sm:mb-3">
            Quote Lens
          </Eyebrow>
          <Display size="lg" as="h1" className="a-up d1 max-w-3xl text-ink-950">
            Three quotes. They are
            <br className="hidden sm:block" /> not the same job.
          </Display>
          <p className="a-up d2 measure mt-3.5 text-[15.5px] leading-relaxed text-ink-500 sm:mt-5 sm:text-[15.5px]">
            Every quote answers the same six questions about scope. Read across before you read the
            totals — the cheapest quote is cheapest partly because it promises less.
          </p>
        </header>

        <Verdict cheapest={cheapest} comparable={comparable} incomplete={incomplete} />

        {/* ── Scope comparison ─────────────────────────────────────── */}
        <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-10 sm:mt-14 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-x-14">
          <div className="min-w-0">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Eyebrow className="mb-1.5">Scope, line by line</Eyebrow>
                <p className="text-[14px] text-ink-500">
                  {diffOnly
                    ? `Showing only what differs — ${SCOPE_LINES.length - matrixRows.length} identical line(s) hidden`
                    : 'Every line each quote does or does not commit to'}
                </p>
              </div>
              <DiffToggle on={diffOnly} onChange={setDiffOnly} />
            </div>

            {/* Matrix — laptop and wider only. */}
            <div className="hidden lg:block">
              <ScopeMatrix
                rows={matrixRows}
                hovered={hovered}
                setHovered={setHovered}
                focus={focus}
                setFocus={setFocus}
                accepted={progress.acceptedQuote}
                cheapestId={cheapest.proId}
                onChoose={choose}
              />
            </div>

            {/* Pairwise comparison — phone and tablet. */}
            <div className="lg:hidden">
              <PairCompare
                pair={pair}
                onPick={pick}
                rows={pairRows}
                hiddenCount={SCOPE_LINES.length - pairRows.length}
                diffOnly={diffOnly}
                accepted={progress.acceptedQuote}
                onChoose={choose}
              />
            </div>

            <InTheirWords />
          </div>

          <LensNotes focus={focus} onFocus={setFocus} />
        </div>
      </div>
    </AppShell>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// The verdict — the one thing to remember from this screen
// ════════════════════════════════════════════════════════════════════════════

function Verdict({
  cheapest,
  comparable,
  incomplete,
}: {
  cheapest: Quote
  comparable: number
  incomplete: number
}) {
  const pro = proById(cheapest.proId)
  const gaps = gapsOf(cheapest)
  // What this quote plausibly costs once the unstated parts are actually
  // billed — the same typical parts figure the specified quotes carry.
  const likely = cheapest.total + quoteFor('chamod').parts
  const highest = Math.max(...QUOTES.map(q => q.total), likely)

  return (
    <section
      aria-label="What the lens found"
      className="a-rise overflow-hidden rounded-2xl bg-ink-950 text-white"
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-white/10 px-5 py-3.5 sm:px-7 lg:px-9">
        <Eyebrow tone="light">The lens found</Eyebrow>
        <p className="font-data ml-auto text-[12.5px] tracking-[0.1em] text-white/68">
          {QUOTES.length} QUOTES · {comparable} COMPARABLE · {incomplete} INCOMPLETE
        </p>
      </div>

      <div className="grid grid-cols-1 gap-y-8 px-5 py-6 sm:px-7 sm:py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-14 lg:px-9 lg:py-9">
        {/* The claim */}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Avatar tint={pro.tint} name={pro.name} size={34} />
            <p className="font-display text-[22px] leading-none text-white sm:text-[26px]">{pro.short}</p>
            <Pill tone="gold">Lowest price</Pill>
          </div>

          <p className="tnum mt-4 font-display text-[40px] leading-none text-white sm:text-[52px]">
            {money(cheapest.total)}
          </p>

          <p className="mt-5 flex items-center gap-2 text-[14px] font-semibold uppercase tracking-[0.12em] text-warning-700">
            <span className="h-px w-6 bg-warning-700" aria-hidden="true" />
            But
          </p>
          <ul className="mt-3 space-y-2">
            {gaps.map(g => (
              <li key={g.label} className="flex items-start gap-2.5 text-[15px] leading-snug text-white/85">
                {g.kind === 'unstated' ? (
                  <Icon.question size={15} className="mt-0.5 shrink-0 text-warning-700" />
                ) : (
                  <Icon.dash size={15} className="mt-0.5 shrink-0 text-white/58" />
                )}
                {g.label}
              </li>
            ))}
          </ul>
        </div>

        {/* The consequence, drawn to scale */}
        <div className="lg:border-l lg:border-white/10 lg:pl-14">
          <Eyebrow tone="light" className="mb-3">
            Estimated comparable scope
          </Eyebrow>
          <p className="tnum font-display text-[34px] leading-none text-teal-400 sm:text-[42px]">
            ~{money(likely)}
          </p>
          <p className="measure-sm mt-3 text-[14.5px] leading-relaxed text-white/68">
            If the unspecified parts are billed at the typical {money(quoteFor('chamod').parts)}, this
            quote lands above both of the others.
          </p>

          <div className="mt-7 space-y-3.5">
            <ScaleBar
              label={`${pro.short} quoted`}
              value={cheapest.total}
              max={highest}
              tone="quoted"
            />
            <ScaleBar
              label={`${pro.short} likely`}
              value={likely}
              max={highest}
              tone="likely"
              dashed
            />
            {QUOTES.filter(q => q.proId !== cheapest.proId).map(q => (
              <ScaleBar
                key={q.proId}
                label={`${proById(q.proId).short} quoted`}
                value={q.total}
                max={highest}
                tone="other"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * One bar of the price comparison. The estimate is drawn hatched rather than
 * solid, because it is an inference and should not read as a quoted figure.
 */
function ScaleBar({
  label,
  value,
  max,
  tone,
  dashed,
}: {
  label: string
  value: number
  max: number
  tone: 'quoted' | 'likely' | 'other'
  dashed?: boolean
}) {
  const pct = Math.round((value / max) * 100)
  const fill =
    tone === 'quoted' ? 'bg-gold-500' : tone === 'likely' ? 'bg-teal-400/70' : 'bg-white/25'
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="truncate text-[13px] text-white/68">{label}</span>
        <span className="tnum font-data shrink-0 text-[13px] text-white/80">{money(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={`a-draw h-full rounded-full ${fill} ${dashed ? 'opacity-90' : ''}`}
          style={{
            width: `${pct}%`,
            backgroundImage: dashed
              ? 'repeating-linear-gradient(115deg,transparent,transparent 5px,rgba(0,0,0,0.28) 5px,rgba(0,0,0,0.28) 10px)'
              : undefined,
          }}
        />
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Controls
// ════════════════════════════════════════════════════════════════════════════

function DiffToggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`tap inline-flex shrink-0 self-start items-center gap-2.5 rounded-[10px] border px-3.5 py-2.5
        text-[14px] font-medium transition-colors
        ${
          on
            ? 'border-teal-800 bg-teal-800 text-white'
            : 'border-[var(--color-rule-strong)] bg-white text-ink-800 hover:border-ink-400'
        }`}
    >
      <span
        aria-hidden="true"
        className={`flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors
          ${on ? 'border-white bg-white text-teal-800' : 'border-ink-300'}`}
      >
        {on && <Icon.check size={11} />}
      </span>
      Show only what differs
    </button>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Desktop matrix
// ════════════════════════════════════════════════════════════════════════════

function ScopeMatrix({
  rows,
  hovered,
  setHovered,
  focus,
  setFocus,
  accepted,
  cheapestId,
  onChoose,
}: {
  rows: typeof SCOPE_LINES
  hovered: string | null
  setHovered: (v: string | null) => void
  focus: string | null
  setFocus: (v: string | null) => void
  accepted: string | null
  cheapestId: string
  onChoose: (id: string) => void
}) {
  const col = (id: string) =>
    `${focus === id ? 'bg-white' : hovered === id ? 'bg-black/[0.02]' : ''}`

  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">
        Quote comparison across scope lines, cover, duration, inspection fee and total.
      </caption>

      <thead className="sticky-head">
        <tr>
          <th scope="col" className="w-[210px] pb-4 align-bottom">
            <Eyebrow>Scope line</Eyebrow>
          </th>
          {QUOTES.map(q => {
            const pro = proById(q.proId)
            const gaps = unstatedCount(q)
            return (
              <th
                key={q.proId}
                scope="col"
                onMouseEnter={() => setHovered(q.proId)}
                onMouseLeave={() => setHovered(null)}
                className={`pb-4 pr-5 align-bottom transition-colors ${col(q.proId)}`}
              >
                <button
                  type="button"
                  onClick={() => setFocus(focus === q.proId ? null : q.proId)}
                  aria-pressed={focus === q.proId}
                  className="flex w-full items-center gap-2.5 rounded-lg pt-3 text-left"
                >
                  <Avatar tint={pro.tint} name={pro.name} size={32} ring={accepted === q.proId} />
                  <span className="min-w-0">
                    <span className="block font-display text-[19px] leading-tight text-ink-950">
                      {pro.short}
                    </span>
                    {gaps > 0 ? (
                      <span className="mt-0.5 flex items-center gap-1 text-[11.5px] font-normal text-warning-700">
                        <Icon.question size={11} />
                        {gaps} unstated
                      </span>
                    ) : (
                      <span className="mt-0.5 flex items-center gap-1 text-[11.5px] font-normal text-success-700">
                        <Icon.check size={11} />
                        Fully stated
                      </span>
                    )}
                  </span>
                </button>
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
              className="py-3.5 pr-6 text-[14.5px] font-medium text-ink-700 transition-colors
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
                  className={`py-3.5 pr-5 transition-colors duration-150
                    ${state === 'unstated' ? 'bg-warning-100/70' : col(q.proId)}`}
                >
                  <ScopeMark state={state} />
                </td>
              )
            })}
          </tr>
        ))}

        {rows.length === 0 && (
          <tr>
            <td colSpan={4} className="py-8 text-[15px] text-ink-500">
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
          label="Cover"
          hint="Cover on the labour if the same fault returns."
          col={col}
          render={q =>
            q.warrantyDays ? (
              <span className="tnum text-[15.5px] font-medium text-ink-900">{q.warrantyDays} days</span>
            ) : (
              <ScopeMark state="unstated" />
            )
          }
          flag={q => q.warrantyDays === null}
        />
        <TermRow
          label="Expected duration"
          hint="How long the professional expects to be on site."
          col={col}
          render={q => <span className="tnum text-[15.5px] text-ink-700">{q.durationMin} min</span>}
        />
        <TermRow
          label="Inspection"
          hint="Credited against the repair if you continue with the same professional."
          col={col}
          render={q => <span className="tnum text-[15.5px] text-ink-700">{money(q.inspection)}</span>}
        />

        <tr aria-hidden="true">
          <td colSpan={4} className="p-0 pt-2">
            <Rule tone="strong" />
          </td>
        </tr>

        {/* Totals — the loudest row, and deliberately the last one read. */}
        <tr>
          <th scope="row" className="py-6 pr-6 align-top">
            <Eyebrow tone="teal">Quoted total</Eyebrow>
          </th>
          {QUOTES.map(q => (
            <td
              key={q.proId}
              onMouseEnter={() => setHovered(q.proId)}
              onMouseLeave={() => setHovered(null)}
              className={`py-6 pr-5 align-top transition-colors ${col(q.proId)}`}
            >
              <p className="tnum font-display text-[30px] leading-none text-ink-950 xl:text-[34px]">
                {money(q.total)}
              </p>
              {q.proId === cheapestId && (
                <Pill tone="gold" className="mt-3">
                  Lowest quoted
                </Pill>
              )}
              {unstatedCount(q) > 0 && (
                <Tooltip label="Unstated lines can be billed on top. This figure is not directly comparable to the others.">
                  <p className="mt-2 flex items-center gap-1.5 text-[13px] text-warning-700">
                    <Icon.alert size={12} />
                    Not directly comparable
                  </p>
                </Tooltip>
              )}
            </td>
          ))}
        </tr>

        <tr>
          <th scope="row" className="py-4 pr-6 align-top text-[14.5px] font-medium text-ink-600">
            Decide
          </th>
          {QUOTES.map(q => {
            const pro = proById(q.proId)
            const chosen = accepted === q.proId
            return (
              <td key={q.proId} className={`py-4 pr-5 align-top transition-colors ${col(q.proId)}`}>
                <div className="flex flex-col items-start gap-2.5">
                  <Button
                    size="sm"
                    variant={q.proId === 'chamod' ? 'primary' : 'secondary'}
                    onClick={() => onChoose(q.proId)}
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
  )
}

function TermRow({
  label,
  hint,
  render,
  col,
  flag,
}: {
  label: string
  hint: string
  render: (q: Quote) => React.ReactNode
  col: (id: string) => string
  flag?: (q: Quote) => boolean
}) {
  return (
    <tr className="group/row">
      <th scope="row" className="py-3.5 pr-6 text-[14.5px] font-medium text-ink-700">
        <span className="inline-flex items-center gap-1.5">
          {label}
          <InfoHint label={hint} />
        </span>
      </th>
      {QUOTES.map(q => (
        <td
          key={q.proId}
          className={`py-3.5 pr-5 transition-colors duration-150
            ${flag?.(q) ? 'bg-warning-100/70' : col(q.proId)}`}
        >
          {render(q)}
        </td>
      ))}
    </tr>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Small-screen comparison — two quotes, one line at a time
// ════════════════════════════════════════════════════════════════════════════

function PairCompare({
  pair,
  onPick,
  rows,
  hiddenCount,
  diffOnly,
  accepted,
  onChoose,
}: {
  pair: string[]
  onPick: (id: string) => void
  rows: typeof SCOPE_LINES
  hiddenCount: number
  diffOnly: boolean
  accepted: string | null
  onChoose: (id: string) => void
}) {
  const [a, b] = pair.map(id => QUOTES.find(q => q.proId === id)!)
  const proA = proById(a.proId)
  const proB = proById(b.proId)

  const label = (q: Quote) => (q.scope ? proById(q.proId).short : '')

  return (
    <div>
      {/* Pick two of three. */}
      <fieldset className="mb-5">
        <legend className="mb-2.5">
          <Eyebrow>Select two quotes to compare</Eyebrow>
        </legend>
        <div className="flex flex-wrap gap-2">
          {QUOTES.map(q => {
            const pro = proById(q.proId)
            const on = pair.includes(q.proId)
            return (
              <button
                key={q.proId}
                type="button"
                aria-pressed={on}
                onClick={() => onPick(q.proId)}
                className={`tap flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5
                  text-[14.5px] font-medium transition-colors
                  ${
                    on
                      ? 'border-teal-800 bg-teal-50 text-teal-900'
                      : 'border-[var(--color-rule-strong)] bg-white text-ink-600 hover:border-ink-400'
                  }`}
              >
                <Avatar tint={pro.tint} name={pro.name} size={24} />
                {pro.short}
                {on && <Icon.check size={13} />}
              </button>
            )
          })}
        </div>
      </fieldset>

      <h3 className="mb-4 flex items-center gap-2.5 text-[15px] font-semibold text-ink-950">
        {proA.short}
        <span className="text-ink-300" aria-hidden="true">
          ↔
        </span>
        <span className="sr-only">compared with</span>
        {proB.short}
      </h3>

      {/* Scope, stacked. */}
      <ul className="space-y-3">
        {rows.map(line => {
          const differs = a.scope[line.key] !== b.scope[line.key]
          return (
            <li key={line.key}>
              <p className="mb-1.5 flex items-center gap-1.5 text-[14px] font-medium text-ink-700">
                {line.label}
                <InfoHint label={line.hint} />
                {differs && (
                  <span className="font-data ml-auto text-[10.5px] uppercase tracking-[0.12em] text-warning-700">
                    Differs
                  </span>
                )}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <CompareCell name={proA.short} emphasis={differs}>
                  <ScopeMark state={a.scope[line.key]} />
                </CompareCell>
                <CompareCell name={proB.short} emphasis={differs}>
                  <ScopeMark state={b.scope[line.key]} />
                </CompareCell>
              </div>
            </li>
          )
        })}

        {rows.length === 0 && (
          <li className="rounded-xl bg-[var(--color-sunken)] px-4 py-5 text-[14.5px] text-ink-600">
            {proA.short} and {proB.short} commit to exactly the same scope. The difference between them
            is price, cover and timing.
          </li>
        )}
      </ul>

      {diffOnly && hiddenCount > 0 && (
        <p className="mt-3 text-[13.5px] text-ink-400">
          {hiddenCount} identical line{hiddenCount > 1 ? 's' : ''} hidden.
        </p>
      )}

      <Rule className="my-6" />

      {/* Terms. */}
      <ul className="space-y-3">
        <PairRow
          label="Cover"
          a={a.warrantyDays ? `${a.warrantyDays} days` : undefined}
          b={b.warrantyDays ? `${b.warrantyDays} days` : undefined}
          nameA={proA.short}
          nameB={proB.short}
        />
        <PairRow
          label="Expected duration"
          a={`${a.durationMin} min`}
          b={`${b.durationMin} min`}
          nameA={proA.short}
          nameB={proB.short}
        />
        <PairRow
          label="Inspection"
          a={money(a.inspection)}
          b={money(b.inspection)}
          nameA={proA.short}
          nameB={proB.short}
        />
      </ul>

      <Rule className="my-6" />

      {/* Totals and the decision. */}
      <Eyebrow tone="teal" className="mb-3">
        Quoted total
      </Eyebrow>
      <div className="grid grid-cols-2 gap-3">
        {[a, b].map(q => {
          const pro = proById(q.proId)
          const gaps = unstatedCount(q)
          return (
            <div
              key={q.proId}
              className={`rounded-xl p-3.5 ${gaps > 0 ? 'bg-warning-100' : 'bg-[var(--color-sunken)]'}`}
            >
              <p className="mb-1.5 truncate font-data text-[10.5px] uppercase tracking-[0.13em] text-ink-500">
                {label(q)}
              </p>
              <p className="tnum font-display text-[26px] leading-none text-ink-950">{money(q.total)}</p>
              {gaps > 0 && (
                <p className="mt-2 flex items-start gap-1.5 text-[12.5px] leading-snug text-warning-700">
                  <Icon.alert size={12} className="mt-px shrink-0" />
                  Not directly comparable — {gaps} line{gaps > 1 ? 's' : ''} unstated
                </p>
              )}
              <Button
                size="sm"
                full
                className="mt-3"
                variant={q.proId === 'chamod' ? 'primary' : 'secondary'}
                onClick={() => onChoose(q.proId)}
              >
                {accepted === q.proId ? 'Selected' : 'Repair plan'}
              </Button>
              <div className="mt-2 flex justify-center">
                <TextLink tone="muted" onClick={() => navigate(`/pro/${pro.id}`)}>
                  About {pro.short}
                </TextLink>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PairRow({
  label,
  a,
  b,
  nameA,
  nameB,
}: {
  label: string
  a?: string
  b?: string
  nameA: string
  nameB: string
}) {
  const differs = a !== b
  return (
    <li>
      <p className="mb-1.5 flex items-center gap-1.5 text-[14px] font-medium text-ink-700">
        {label}
        {differs && (
          <span className="font-data ml-auto text-[10.5px] uppercase tracking-[0.12em] text-warning-700">
            Differs
          </span>
        )}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <CompareCell name={nameA} emphasis={differs}>
          {a ?? <ScopeMark state="unstated" />}
        </CompareCell>
        <CompareCell name={nameB} emphasis={differs}>
          {b ?? <ScopeMark state="unstated" />}
        </CompareCell>
      </div>
    </li>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Supporting reads
// ════════════════════════════════════════════════════════════════════════════

/** Each professional's own words, not paraphrased by us. */
function InTheirWords() {
  return (
    <div className="mt-10 sm:mt-12">
      <Eyebrow className="mb-3 sm:mb-4">In their words</Eyebrow>
      {QUOTES.map(q => {
        const pro = proById(q.proId)
        return (
          <div key={q.proId}>
            <Rule />
            <div className="flex gap-4 py-4 sm:gap-5 sm:py-5">
              <Avatar tint={pro.tint} name={pro.name} size={32} />
              <p className="measure text-[14.5px] leading-relaxed text-ink-600 sm:text-[15px]">
                <span className="font-medium text-ink-900">{pro.short}: </span>
                {q.note}
              </p>
            </div>
          </div>
        )
      })}
      <Rule />
    </div>
  )
}

function LensNotes({ focus, onFocus }: { focus: string | null; onFocus: (id: string | null) => void }) {
  // A selected quote narrows the notes to the one being considered.
  const shown = focus ? LENS_INSIGHTS.filter(i => i.proId === focus) : LENS_INSIGHTS
  const focusPro = focus ? proById(focus) : null

  return (
    <aside aria-label="What TrustCraft noticed" className="xl:sticky xl:top-28 xl:self-start">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Eyebrow tone="teal">What TrustCraft noticed</Eyebrow>
        {focusPro && (
          <TextLink tone="muted" onClick={() => onFocus(null)}>
            Show all
          </TextLink>
        )}
      </div>

      {focusPro && (
        <p className="mb-3 flex items-center gap-2 text-[14px] text-ink-500">
          <Avatar tint={focusPro.tint} name={focusPro.name} size={20} />
          Filtered to {focusPro.short}
        </p>
      )}

      <div>
        {shown.map((ins, i) => {
          const pro = proById(ins.proId)
          return (
            <div key={ins.headline} className="a-up" style={{ animationDelay: `${i * 0.07}s` }}>
              <Rule />
              <div className="py-4 sm:py-5">
                <div className="mb-2 flex items-center gap-2.5">
                  {ins.kind === 'gap' ? (
                    <Icon.alert size={15} className="text-warning-700" />
                  ) : (
                    <Avatar tint={pro.tint} name={pro.name} size={22} />
                  )}
                  <p
                    className={`text-[15px] font-semibold ${
                      ins.kind === 'gap' ? 'text-warning-700' : 'text-ink-950'
                    }`}
                  >
                    {ins.headline}
                  </p>
                </div>
                <p className="text-[14px] leading-relaxed text-ink-600">{ins.body}</p>
                {ins.kind !== 'gap' && <p className="mt-1.5 text-[13px] text-ink-400">{pro.name}</p>}
              </div>
            </div>
          )
        })}
        <Rule />
      </div>

      <div className="mt-7 rounded-xl bg-[var(--color-sunken)] p-4 sm:p-5">
        <p className="text-[14.5px] leading-relaxed text-ink-700">
          TrustCraft highlights differences. The decision remains yours.
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">
          None of these quotes is wrong. They describe different amounts of work, and only you know how
          long you plan to keep this kitchen.
        </p>
      </div>
    </aside>
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
    <AppShell caseStage="agree">
      <div className="pb-16 pt-8 sm:pt-10 lg:pb-20 lg:pt-12">
        <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_320px] xl:gap-x-20 xl:grid-cols-[minmax(0,1fr)_340px]">
          <article className="min-w-0">
            <button
              type="button"
              onClick={() => navigate('/case/TC-2048/quotes')}
              className="tap mb-6 inline-flex items-center gap-2 text-[14px] text-ink-500 transition-colors hover:text-ink-900 sm:mb-7"
            >
              <Icon.arrowLeft size={15} />
              All three quotes
            </button>

            <Eyebrow tone="teal" className="mb-3 sm:mb-4">
              Repair plan
            </Eyebrow>
            <Display size="lg" as="h1" className="a-up max-w-xl text-ink-950">
              {REPAIR_PLAN.title}
            </Display>
            <p className="a-up d1 mt-4 flex items-center gap-2.5 text-[15px] text-ink-500">
              <Avatar tint={pro.tint} name={pro.name} size={24} />
              {pro.name} · 23 August 2026
            </p>

            <Rule className="my-8 lg:my-10" />

            <Eyebrow className="mb-3 sm:mb-4">What was found</Eyebrow>
            <p className="quote-lg measure text-ink-800">{REPAIR_PLAN.diagnosis}</p>

            <Rule className="my-8 lg:my-10" />

            <Eyebrow className="mb-2">The work</Eyebrow>
            <dl>
              {lines.map(l => (
                <div key={l.label}>
                  <div className="flex items-start justify-between gap-6 py-4 sm:gap-8 sm:py-5">
                    <div className="min-w-0">
                      <dt className="font-data text-[11px] uppercase tracking-[0.14em] text-ink-400">
                        {l.group}
                      </dt>
                      <p className="mt-1.5 text-[15px] font-medium text-ink-950 sm:text-[16px]">
                        {l.label}
                      </p>
                      <p className="mt-0.5 text-[14px] text-ink-500">{l.detail}</p>
                    </div>
                    <dd className="tnum shrink-0 font-data text-[15px] text-ink-900 sm:text-[16px]">
                      {money(l.amount)}
                    </dd>
                  </div>
                  <Rule />
                </div>
              ))}
            </dl>

            <div className="mt-8 lg:mt-10">
              <Eyebrow className="mb-3 sm:mb-4">Not included</Eyebrow>
              <ul className="space-y-2.5">
                {REPAIR_PLAN.excluded.map(e => (
                  <li key={e} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-ink-600">
                    <Icon.dash size={15} className="mt-0.5 shrink-0 text-ink-300" />
                    {e}
                  </li>
                ))}
              </ul>
              <p className="measure mt-4 flex items-start gap-2 text-[13.5px] leading-relaxed text-ink-400">
                <Icon.info size={13} className="mt-0.5 shrink-0" />
                Excluded work cannot be added silently. If the hose turns out to need replacing, it comes
                back to you as a change request first.
              </p>
            </div>
          </article>

          {/* Total + approval rail */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl bg-ink-950 p-6 text-white sm:p-7">
              <Eyebrow tone="light">Total</Eyebrow>
              <p className="tnum mt-3 font-display text-[40px] leading-none sm:text-[46px]">
                {money(REPAIR_PLAN.total)}
              </p>
              <p className="mt-3 text-[13.5px] leading-relaxed text-white/62">
                Parts, labour and the inspection fee you already paid, in one figure.
              </p>

              <Rule tone="light" className="my-6" />

              <dl className="space-y-3.5">
                <DarkRow label="Cover" value={REPAIR_PLAN.warranty} />
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

            <Disclosure summary="Is this a normal price?" className="mt-5">
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
      <dt className="text-[13.5px] text-white/62">{label}</dt>
      <dd className="text-right text-[14px] font-medium text-white/90">{value}</dd>
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
      <p className="mb-4 text-[14px] leading-relaxed text-ink-600">
        Based on 14 comparable completed jobs in the Colombo area over the last 12 months.
      </p>
      <div className="relative mb-2 h-2 rounded-full bg-ink-100">
        <div className="absolute inset-y-0 left-[14%] right-[22%] rounded-full bg-teal-100" />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-teal-800 shadow"
          style={{ left: `calc(${pos}% - 8px)` }}
        />
      </div>
      <div className="tnum flex justify-between font-data text-[11.5px] text-ink-400">
        <span>{money(low)}</span>
        <span>{money(high)}</span>
      </div>
      <p className="mt-4 text-[14px] text-ink-700">
        This quote sits in the usual range. Being in range is not the same as being right for you — the
        scope still matters more.
      </p>
    </div>
  )
}

/** Re-exported so the Cases page can reuse the roster without importing data twice. */
export { PROS } from '../data'
