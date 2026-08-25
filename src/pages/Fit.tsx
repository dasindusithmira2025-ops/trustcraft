import { useState } from 'react'
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
  PageHead,
  Pill,
  Rule,
  StatusDot,
  TextLink,
  Tooltip,
} from '../ui'
import { FIT_ROWS, PROS, money, proById, type Pro } from '../data'

/** Which pro wins a row, or null when the row has no winner. */
function leaderOf(key: string): string | null {
  const row = FIT_ROWS.find(r => r.key === key)
  if (!row || row.better === 'none') return null
  const sorted = [...PROS].sort((a, b) =>
    row.better === 'high' ? row.raw(b) - row.raw(a) : row.raw(a) - row.raw(b),
  )
  // A tie means no leader — marking one would be a lie.
  return row.raw(sorted[0]) === row.raw(sorted[1]) ? null : sorted[0].id
}

const RECOMMENDED = 'chamod'

// ════════════════════════════════════════════════════════════════════════════
// Professional Fit ★
//
// A matrix answers "how do these three differ". Almost nobody arrives with
// that question — they arrive with "who should I pick, and why". So the page
// answers that first, in a sentence, and keeps the matrix for the person who
// wants to check the reasoning rather than accept it.
// ════════════════════════════════════════════════════════════════════════════

export function ProfessionalFit() {
  const { progress, set, notify } = useStore()
  const [whyOpen, setWhyOpen] = useState<string | null>(null)
  const selected = progress.selectedPro

  const primary = proById(RECOMMENDED)
  const alternatives = PROS.filter(p => p.id !== RECOMMENDED)

  function choose(p: Pro) {
    set({ selectedPro: p.id })
    notify(`${p.name} selected for inspection`)
    window.setTimeout(() => navigate('/case/TC-2048/quotes'), 700)
  }

  return (
    <AppShell caseStage="decide">
      <div className="pb-16 pt-8 sm:pt-10 lg:pb-20 lg:pt-12">
        <PageHead
          eyebrow="Decide"
          title={
            <>
              Who fits this case,
              <br />
              and why?
            </>
          }
          lede="Not everyone available — the three whose record is actually relevant to a supply-side connector leak. One of them fits this job best, and the reason is not that they are cheapest."
          back={{ label: 'Resolution path', to: '/case/TC-2048/path' }}
        />

        <PrimaryFit
          pro={primary}
          selected={selected === primary.id}
          onChoose={() => choose(primary)}
          onWhy={() => setWhyOpen(w => (w === primary.id ? null : primary.id))}
          whyOpen={whyOpen === primary.id}
        />

        {whyOpen === primary.id && <WhyThisFit pro={primary} onClose={() => setWhyOpen(null)} />}

        {/* ── Alternatives ─────────────────────────────────────────── */}
        <section className="mt-12 sm:mt-16" aria-label="Alternatives">
          <div className="mb-4 flex items-center gap-3 sm:mb-5">
            <Eyebrow>Also relevant</Eyebrow>
            <span className="h-px flex-1 bg-[var(--color-rule)]" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {alternatives.map((p, i) => (
              <AlternativeFit
                key={p.id}
                pro={p}
                index={i}
                selected={selected === p.id}
                onChoose={() => choose(p)}
                onWhy={() => setWhyOpen(w => (w === p.id ? null : p.id))}
                whyOpen={whyOpen === p.id}
              />
            ))}
          </div>

          {whyOpen && whyOpen !== primary.id && (
            <WhyThisFit pro={proById(whyOpen)} onClose={() => setWhyOpen(null)} />
          )}
        </section>

        {/* ── The full matrix, for anyone who wants to check ────────── */}
        <section className="mt-12 sm:mt-16" aria-label="Full comparison">
          <CompareDetails selected={selected} onChoose={choose} />
        </section>

        <p className="measure mt-10 flex items-start gap-2 text-[14px] leading-relaxed text-ink-400 sm:mt-12">
          <Icon.info size={14} className="mt-0.5 shrink-0" />
          Ratings are deliberately not the headline. Every figure above comes from completed jobs on
          TrustCraft and can be traced to its source.
        </p>
      </div>
    </AppShell>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// The recommendation
// ════════════════════════════════════════════════════════════════════════════

function PrimaryFit({
  pro,
  selected,
  onChoose,
  onWhy,
  whyOpen,
}: {
  pro: Pro
  selected: boolean
  onChoose: () => void
  onWhy: () => void
  whyOpen: boolean
}) {
  return (
    <article
      className="a-rise overflow-hidden rounded-2xl bg-white
        shadow-[0_1px_2px_rgba(15,17,20,0.04),0_18px_50px_-28px_rgba(15,17,20,0.32)]"
    >
      {/* A solid teal edge marks the recommendation without a badge shouting it. */}
      <div className="h-1 bg-teal-800" aria-hidden="true" />

      <div className="p-5 sm:p-7 lg:p-9">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
          <div className="min-w-0 flex-1">
            <Pill tone="teal" icon={<Icon.check size={12} />}>
              Recommended for this case
            </Pill>

            <div className="mt-4 flex items-center gap-4">
              <Avatar tint={pro.tint} name={pro.name} size={56} ring={selected} />
              <div className="min-w-0">
                <Display size="md" as="h2" className="text-ink-950">
                  {pro.name}
                </Display>
                <p className="mt-1 text-[14.5px] text-ink-500">{pro.specialty}</p>
              </div>
            </div>

            {/* The reason, in one sentence, before any number. */}
            <p className="measure mt-5 text-[15px] leading-relaxed text-ink-700 sm:text-[16px]">
              {pro.fitNote}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
              <TextLink onClick={onWhy}>
                {whyOpen ? 'Hide the evidence' : 'See the evidence behind this'}
              </TextLink>
              <TextLink tone="muted" onClick={() => navigate(`/pro/${pro.id}`)}>
                Full profile
              </TextLink>
            </div>
          </div>

          {/* Decision block */}
          <div className="shrink-0 lg:w-[240px]">
            <div className="rounded-xl bg-[var(--color-sunken)] p-4 sm:p-5">
              <dl className="space-y-2.5">
                <MiniRow label="Can attend" value={pro.availability} strong />
                <MiniRow label="Distance" value={`${pro.distanceKm} km`} />
                <MiniRow label="Inspection" value={money(pro.inspection)} />
              </dl>
              <Button full size="lg" className="mt-4" onClick={onChoose}>
                {selected ? 'Selected' : `Choose ${pro.short}`}
              </Button>
              <p className="mt-2.5 text-center text-[12.5px] leading-relaxed text-ink-400">
                Nothing is charged until you approve a plan.
              </p>
            </div>
          </div>
        </div>

        <Rule className="my-6 sm:my-7" />

        <StatStrip pro={pro} />
      </div>
    </article>
  )
}

/** The six numbers that decide this job, with the leader of each marked. */
function StatStrip({ pro }: { pro: Pro }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-4">
      {FIT_ROWS.filter(r => r.key !== 'distance').map(row => {
        const isLeader = leaderOf(row.key) === pro.id
        return (
          <div key={row.key} className="min-w-0">
            <dt className="flex items-center gap-1 text-[12.5px] leading-snug text-ink-500">
              <span className="truncate">{row.label}</span>
              <InfoHint label={row.hint} />
            </dt>
            <dd className="mt-1 flex items-baseline gap-1.5">
              <span className="tnum text-[17px] font-semibold text-ink-950">{row.value(pro)}</span>
              {isLeader && (
                <Tooltip
                  label={row.better === 'high' ? `Highest of the three. ${row.hint}` : `Lowest of the three. ${row.hint}`}
                >
                  <span className="font-data rounded bg-teal-100 px-1 py-0.5 text-[10.5px] uppercase tracking-[0.1em] text-teal-800">
                    Best
                  </span>
                </Tooltip>
              )}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

function MiniRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-[13.5px] text-ink-500">{label}</dt>
      <dd className={`tnum text-[14px] ${strong ? 'font-semibold text-teal-800' : 'font-medium text-ink-900'}`}>
        {value}
      </dd>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// The alternatives — deliberately quieter, and honest about the trade
// ════════════════════════════════════════════════════════════════════════════

const TRADE_LABEL: Record<string, string> = {
  availability: 'Fastest',
  inspection: 'Lower inspection cost',
  distance: 'Closest',
  similar: 'Most relevant experience',
  completion: 'Highest completion',
  accuracy: 'Most accurate quotes',
}

function AlternativeFit({
  pro,
  index,
  selected,
  onChoose,
  onWhy,
  whyOpen,
}: {
  pro: Pro
  index: number
  selected: boolean
  onChoose: () => void
  onWhy: () => void
  whyOpen: boolean
}) {
  // Whatever this person genuinely leads on, named rather than implied.
  const leads = FIT_ROWS.filter(r => leaderOf(r.key) === pro.id)

  return (
    <article
      className={`a-up flex h-full flex-col rounded-2xl border p-5 transition-colors sm:p-6
        ${selected ? 'border-teal-700 bg-teal-50/40' : 'border-[var(--color-rule)] bg-[var(--color-sunken)]/55'}`}
      style={{ animationDelay: `${0.06 * index}s` }}
    >
      {leads.length > 0 && (
        <Pill tone="neutral" className="mb-3.5 self-start">
          {TRADE_LABEL[leads[0].key] ?? `Best on ${leads[0].label.toLowerCase()}`}
        </Pill>
      )}

      <div className="flex items-start gap-3.5">
        <Avatar tint={pro.tint} name={pro.name} size={40} ring={selected} />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[21px] leading-tight text-ink-950">{pro.name}</h3>
          <p className="mt-0.5 text-[13.5px] text-ink-500">{pro.fitLabel}</p>
        </div>
      </div>

      <p className="mt-4 text-[14.5px] leading-relaxed text-ink-600">{pro.fitNote}</p>

      {leads.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {leads.map(r => (
            <li key={r.key} className="flex items-center gap-2 text-[13.5px] text-ink-700">
              <Icon.check size={13} className="shrink-0 text-teal-700" />
              <span>
                Best on {r.label.toLowerCase()} — <span className="tnum font-medium">{r.value(pro)}</span>
              </span>
            </li>
          ))}
        </ul>
      )}

      <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        <MiniStat label="Similar repairs" value={String(pro.similarJobs)} />
        <MiniStat label="Can attend" value={pro.availability} />
        <MiniStat label="Inspection" value={money(pro.inspection)} />
      </dl>

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-3 pt-5">
        <Button size="sm" variant="secondary" onClick={onChoose}>
          {selected ? 'Selected' : `Choose ${pro.short}`}
        </Button>
        <TextLink tone="muted" onClick={onWhy}>
          {whyOpen ? 'Hide evidence' : 'Evidence'}
        </TextLink>
      </div>
    </article>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-data text-[10.5px] uppercase tracking-[0.13em] text-ink-400">{label}</dt>
      <dd className="tnum mt-0.5 text-[14.5px] font-medium text-ink-900">{value}</dd>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Compare details — the matrix, on request
// ════════════════════════════════════════════════════════════════════════════

function CompareDetails({
  selected,
  onChoose,
}: {
  selected: string | null
  onChoose: (p: Pro) => void
}) {
  const [open, setOpen] = useState(false)
  const [pair, setPair] = useState<string[]>(['chamod', 'nimal'])

  function pick(id: string) {
    setPair(([, recent]) => (id === recent ? pair : [recent, id]))
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="tap flex w-full items-center justify-between gap-4 rounded-xl border
          border-[var(--color-rule-strong)] bg-white px-4 py-3.5 text-left transition-colors
          hover:border-ink-400 sm:px-5"
      >
        <span className="min-w-0">
          <span className="block text-[15.5px] font-semibold text-ink-950">Compare details</span>
          <span className="mt-0.5 block text-[13.5px] text-ink-500">
            All {FIT_ROWS.length} measures, side by side
          </span>
        </span>
        <Icon.chevron
          size={17}
          className={`shrink-0 text-ink-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="a-up mt-5">
          {/* Matrix — laptop and wider. */}
          <div className="hidden lg:block">
            <FitMatrix selected={selected} onChoose={onChoose} />
          </div>

          {/* Two at a time — phone and tablet. */}
          <div className="lg:hidden">
            <FitPairCompare pair={pair} onPick={pick} />
          </div>
        </div>
      )}
    </div>
  )
}

function FitMatrix({ selected, onChoose }: { selected: string | null; onChoose: (p: Pro) => void }) {
  const [focused, setFocused] = useState<string | null>(null)

  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">
        Comparison of three professionals across relevant experience, qualification, completion rate,
        distance, availability and inspection fee.
      </caption>

      <thead>
        <tr>
          <th scope="col" className="w-[200px] pb-4 align-bottom">
            <Eyebrow>Compare on</Eyebrow>
          </th>
          {PROS.map(p => (
            <th
              key={p.id}
              scope="col"
              onMouseEnter={() => setFocused(p.id)}
              onMouseLeave={() => setFocused(null)}
              className={`pb-4 pr-6 align-bottom transition-colors
                ${selected === p.id ? 'bg-teal-50/60' : focused === p.id ? 'bg-black/[0.02]' : ''}`}
            >
              <div className="flex items-center gap-3 pt-3">
                <Avatar tint={p.tint} name={p.name} size={36} ring={selected === p.id} />
                <div className="min-w-0">
                  <p className="font-display text-[19px] leading-tight text-ink-950">{p.short}</p>
                  {p.id === RECOMMENDED && (
                    <p className="mt-0.5 flex items-center gap-1 text-[11.5px] font-normal text-teal-800">
                      <Icon.check size={11} />
                      Recommended
                    </p>
                  )}
                </div>
              </div>
            </th>
          ))}
        </tr>
        <tr aria-hidden="true">
          <td colSpan={4} className="p-0">
            <Rule tone="strong" />
          </td>
        </tr>
      </thead>

      <tbody>
        {FIT_ROWS.map(row => {
          const leader = leaderOf(row.key)
          return (
            <tr key={row.key} className="group/row">
              <th scope="row" className="py-3.5 pr-6 align-middle text-[14.5px] font-medium text-ink-600">
                <span className="inline-flex items-center gap-1.5">
                  {row.label}
                  <InfoHint label={row.hint} />
                </span>
              </th>
              {PROS.map(p => {
                const isLeader = leader === p.id
                return (
                  <td
                    key={p.id}
                    onMouseEnter={() => setFocused(p.id)}
                    onMouseLeave={() => setFocused(null)}
                    className={`py-3.5 pr-6 align-middle transition-colors duration-150
                      ${selected === p.id ? 'bg-teal-50/60' : focused === p.id ? 'bg-black/[0.025]' : ''}`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`tnum text-[15px] ${isLeader ? 'font-semibold text-ink-950' : 'text-ink-700'}`}
                      >
                        {row.value(p)}
                      </span>
                      {row.key === 'qual' && <Icon.check size={14} className="text-success-700" />}
                      {isLeader && (
                        <Tooltip
                          label={
                            row.better === 'high'
                              ? `Highest of the three. ${row.hint}`
                              : `Lowest of the three. ${row.hint}`
                          }
                        >
                          <span className="font-data rounded bg-teal-100 px-1.5 py-0.5 text-[10.5px] uppercase tracking-[0.1em] text-teal-800">
                            Best
                          </span>
                        </Tooltip>
                      )}
                    </span>
                  </td>
                )
              })}
            </tr>
          )
        })}

        <tr aria-hidden="true">
          <td colSpan={4} className="p-0 pt-2">
            <Rule />
          </td>
        </tr>

        <tr>
          <th scope="row" className="py-5 pr-6 align-top text-[14.5px] font-medium text-ink-600">
            Decide
          </th>
          {PROS.map(p => (
            <td key={p.id} className="py-5 pr-6 align-top">
              <Button
                size="sm"
                variant={p.id === RECOMMENDED ? 'primary' : 'secondary'}
                onClick={() => onChoose(p)}
              >
                {selected === p.id ? 'Selected' : `Choose ${p.short}`}
              </Button>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  )
}

/** Two professionals at a time — the phone and tablet form of the matrix. */
function FitPairCompare({ pair, onPick }: { pair: string[]; onPick: (id: string) => void }) {
  const [a, b] = pair.map(proById)

  return (
    <div>
      <fieldset className="mb-5">
        <legend className="mb-2.5">
          <Eyebrow>Select two to compare</Eyebrow>
        </legend>
        <div className="flex flex-wrap gap-2">
          {PROS.map(p => {
            const on = pair.includes(p.id)
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={on}
                onClick={() => onPick(p.id)}
                className={`tap flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5
                  text-[14.5px] font-medium transition-colors
                  ${
                    on
                      ? 'border-teal-800 bg-teal-50 text-teal-900'
                      : 'border-[var(--color-rule-strong)] bg-white text-ink-600 hover:border-ink-400'
                  }`}
              >
                <Avatar tint={p.tint} name={p.name} size={24} />
                {p.short}
                {on && <Icon.check size={13} />}
              </button>
            )
          })}
        </div>
      </fieldset>

      <h3 className="mb-4 flex items-center gap-2.5 text-[15px] font-semibold text-ink-950">
        {a.short}
        <span className="text-ink-300" aria-hidden="true">
          ↔
        </span>
        <span className="sr-only">compared with</span>
        {b.short}
      </h3>

      <ul className="space-y-3">
        {FIT_ROWS.map(row => {
          const leader = leaderOf(row.key)
          const differs = row.value(a) !== row.value(b)
          return (
            <li key={row.key}>
              <p className="mb-1.5 flex items-center gap-1.5 text-[14px] font-medium text-ink-700">
                {row.label}
                <InfoHint label={row.hint} />
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[a, b].map(p => (
                  <CompareCell key={p.id} name={p.short} emphasis={differs && leader === p.id}>
                    <span className="flex items-center gap-1.5">
                      <span className="tnum">{row.value(p)}</span>
                      {leader === p.id && (
                        <span className="font-data rounded bg-teal-100 px-1 py-0.5 text-[10.5px] uppercase tracking-[0.1em] text-teal-800">
                          Best
                        </span>
                      )}
                    </span>
                  </CompareCell>
                ))}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** The reveal. Trust is explained with traceable evidence, never asserted. */
function WhyThisFit({ pro, onClose }: { pro: Pro; onClose: () => void }) {
  return (
    <section
      className="a-up mt-5 rounded-2xl bg-white p-5 sm:p-7 lg:p-9
        shadow-[0_1px_2px_rgba(15,17,20,0.04),0_18px_50px_-28px_rgba(15,17,20,0.3)]"
      aria-label={`Why ${pro.name} fits this case`}
    >
      <div className="flex items-start justify-between gap-5">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar tint={pro.tint} name={pro.name} size={44} />
          <div className="min-w-0">
            <Eyebrow tone="teal" className="mb-1">
              {pro.fitLabel}
            </Eyebrow>
            <Display size="sm" as="h3" className="text-ink-950">
              {pro.name}
            </Display>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="tap shrink-0 rounded-full p-2 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-900"
          aria-label="Close reasoning"
        >
          <Icon.close size={16} />
        </button>
      </div>

      <Rule className="my-5 sm:my-7" />

      <Eyebrow className="mb-4 sm:mb-5">Trust evidence</Eyebrow>
      <ul className="grid grid-cols-1 gap-x-10 md:grid-cols-2 xl:gap-x-14">
        {pro.evidence.map(item => (
          <li key={item.label}>
            <div className="flex items-start gap-3 py-3">
              <Icon.check size={15} className="mt-0.5 shrink-0 text-success-700" />
              <div className="min-w-0">
                <p className="text-[15px] font-medium leading-snug text-ink-900">{item.label}</p>
                <p className="mt-0.5 text-[13.5px] leading-relaxed text-ink-500">{item.detail}</p>
              </div>
            </div>
            <Rule />
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <p className="measure text-[13.5px] leading-relaxed text-ink-400">
          Each line is drawn from completed jobs and verified documents, not from self-reported profile
          claims.
        </p>
        <Button variant="secondary" onClick={() => navigate(`/pro/${pro.id}`)} className="shrink-0">
          Full profile
        </Button>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Professional profile — organised around evidence
// ════════════════════════════════════════════════════════════════════════════

export function ProProfile({ id }: { id: string }) {
  const pro = proById(id)
  const { set, notify } = useStore()

  return (
    <AppShell>
      <div className="pb-16 pt-8 sm:pt-10 lg:pb-20 lg:pt-12">
        <button
          type="button"
          onClick={() => navigate('/case/TC-2048/fit')}
          className="tap mb-6 inline-flex items-center gap-2 text-[14px] text-ink-500 transition-colors hover:text-ink-900 sm:mb-8"
        >
          <Icon.arrowLeft size={15} />
          Back to comparison
        </button>

        <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_300px] xl:gap-x-20 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
              <Avatar tint={pro.tint} name={pro.name} size={72} />
              <div className="min-w-0">
                <Display size="md" as="h1" className="text-ink-950">
                  {pro.name}
                </Display>
                <p className="mt-1.5 text-[15.5px] text-ink-500 sm:text-[15px]">{pro.specialty}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Pill tone="success" icon={<Icon.shield size={12} />}>
                    Identity verified
                  </Pill>
                  <Pill tone="success" icon={<Icon.check size={12} />}>
                    Qualification verified
                  </Pill>
                  <Pill tone="neutral">On TrustCraft since {pro.since}</Pill>
                </div>
              </div>
            </div>

            <Rule className="my-8 lg:my-10" />

            <Section title="Relevant experience">
              <div className="flex flex-wrap items-baseline gap-4">
                <span className="font-display text-[44px] leading-none text-ink-950 sm:text-[56px]">
                  {pro.similarJobs}
                </span>
                <span className="max-w-xs text-[15px] leading-relaxed text-ink-600">
                  verified repairs of this type in the last 24 months — supply-line and connector leaks
                  specifically.
                </span>
              </div>
            </Section>

            <Section title="Performance">
              <dl className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3 sm:gap-x-10 sm:gap-y-6">
                <Stat label="Completion" value={`${pro.completion}%`} hint="Accepted jobs finished as agreed." />
                <Stat label="Unresolved disputes" value={String(pro.disputes)} hint="Open disputes against this professional." />
                <Stat label="Service area" value={pro.area} />
                <Stat label="Earliest availability" value={pro.availability} />
                <Stat label="Inspection fee" value={money(pro.inspection)} hint="Credited against the repair if you proceed." />
              </dl>
            </Section>

            <Section title="Trust evidence">
              <ul>
                {pro.evidence.map(e => (
                  <li key={e.label}>
                    <div className="flex items-start gap-3 py-3.5">
                      <Icon.check size={15} className="mt-0.5 shrink-0 text-success-700" />
                      <div className="min-w-0">
                        <p className="text-[15px] font-medium text-ink-900">{e.label}</p>
                        <p className="mt-0.5 text-[13.5px] leading-relaxed text-ink-500">{e.detail}</p>
                      </div>
                    </div>
                    <Rule />
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Customer experience">
              <p className="mb-5 flex items-start gap-2 text-[14px] leading-relaxed text-ink-500 sm:mb-6">
                <Icon.info size={14} className="mt-0.5 shrink-0 text-ink-300" />
                Only customers whose job completed through TrustCraft can leave a review.
              </p>
              <ul>
                {pro.reviews.map(r => (
                  <li key={r.name}>
                    <div className="py-4 sm:py-5">
                      <p className="quote-lg measure text-ink-800">“{r.text}”</p>
                      <p className="mt-3 text-[13.5px] text-ink-400">
                        {r.name} · {r.job} · {r.date}
                      </p>
                    </div>
                    <Rule />
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          {/* Decision rail */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(15,17,20,0.04),0_16px_44px_-26px_rgba(15,17,20,0.28)] sm:p-7">
              <Eyebrow tone="teal" className="mb-3">
                For this case
              </Eyebrow>
              <p className="font-display text-[22px] leading-tight text-ink-950 sm:text-[24px]">
                {pro.fitLabel}
              </p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-500">{pro.fitNote}</p>

              <Rule className="my-5 sm:my-6" />

              <dl>
                <Row label="Inspection" value={money(pro.inspection)} />
                <Row label="Can attend" value={pro.availability} />
                <Row label="Distance" value={`${pro.distanceKm} km`} />
              </dl>

              <Button
                full
                size="lg"
                className="mt-5 sm:mt-6"
                onClick={() => {
                  set({ selectedPro: pro.id })
                  notify(`${pro.name} selected for inspection`)
                  navigate('/case/TC-2048/quotes')
                }}
              >
                Choose {pro.short}
              </Button>
              <p className="mt-3 text-center text-[13px] text-ink-400">
                Nothing is charged until you approve a plan.
              </p>
            </div>

            <Disclosure summary="How TrustCraft verifies people" className="mt-5 sm:mt-6">
              <p className="text-[14px] leading-relaxed text-ink-600">
                Identity is checked against national ID. Qualifications are checked against the issuing
                body. Job counts and completion rates are computed from jobs completed on TrustCraft —
                a professional cannot edit them.
              </p>
            </Disclosure>
          </aside>
        </div>
      </div>
    </AppShell>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10 lg:mb-12">
      <Eyebrow className="mb-4 sm:mb-5">{title}</Eyebrow>
      {children}
    </section>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-[13.5px] text-ink-500">
        <span className="truncate">{label}</span>
        {hint && <InfoHint label={hint} />}
      </dt>
      <dd className="tnum mt-1.5 text-[19px] font-medium text-ink-950 sm:text-[20px]">{value}</dd>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <div className="flex items-baseline justify-between gap-4 py-2.5">
        <dt className="text-[14px] text-ink-500">{label}</dt>
        <dd className="tnum text-[14.5px] font-medium text-ink-900">{value}</dd>
      </div>
      <Rule />
    </>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Professionals directory — the secondary browse path
// ════════════════════════════════════════════════════════════════════════════

export function Professionals() {
  return (
    <AppShell>
      <div className="pb-16 pt-8 sm:pt-10 lg:pb-20 lg:pt-12">
        <PageHead
          eyebrow="People"
          title="People, with their record attached"
          lede="TrustCraft normally brings professionals to you inside a case, where their record can be judged against the actual problem. This is the open directory."
        />

        <div>
          {PROS.map((p, i) => (
            <div key={p.id}>
              <Rule />
              <button
                type="button"
                onClick={() => navigate(`/pro/${p.id}`)}
                className="a-up group flex w-full flex-col gap-4 py-5 text-left sm:py-7
                  lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-10 lg:gap-y-5"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="flex items-center gap-4">
                  <Avatar tint={p.tint} name={p.name} size={48} />
                  <div className="min-w-0 lg:min-w-[220px] lg:flex-1">
                    <p className="font-display text-[21px] text-ink-950 transition-colors group-hover:text-teal-800 sm:text-[24px]">
                      {p.name}
                    </p>
                    <p className="mt-1 text-[14px] text-ink-500 sm:text-[14.5px]">{p.specialty}</p>
                  </div>
                </div>
                <dl className="flex flex-wrap gap-x-8 gap-y-3 lg:gap-x-10">
                  <MiniStat label="Similar repairs" value={String(p.similarJobs)} />
                  <MiniStat label="Completion" value={`${p.completion}%`} />
                  <MiniStat label="Area" value={p.area} />
                  <MiniStat label="Inspection" value={money(p.inspection)} />
                </dl>
                <span className="flex items-center gap-2 text-[14px] font-medium text-ink-400 transition-colors group-hover:text-teal-800">
                  <StatusDot tone="success" />
                  Verified
                  <Icon.chevronRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            </div>
          ))}
          <Rule />
        </div>
      </div>
    </AppShell>
  )
}
