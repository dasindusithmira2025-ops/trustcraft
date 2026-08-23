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

// ════════════════════════════════════════════════════════════════════════════
// Professional Fit ★
// ════════════════════════════════════════════════════════════════════════════

export function ProfessionalFit() {
  const { progress, set, notify } = useStore()
  const [focused, setFocused] = useState<string | null>(null)
  const [whyOpen, setWhyOpen] = useState<string | null>(null)
  const selected = progress.selectedPro

  return (
    <AppShell recede caseStage="decide">
      <div className="pb-20 pt-12">
        <PageHead
          eyebrow="Three professionals, curated"
          title={
            <>
              Who should
              <br />
              look at this?
            </>
          }
          lede="Not everyone available — the three whose record is actually relevant to a supply-side connector leak. Compare what matters, then decide."
          back={{ label: 'Resolution path', to: '/case/TC-2048/path' }}
        />

        {/* ── Comparison surface ─────────────────────────────────────── */}
        <div className="overflow-x-auto thin-scroll">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <caption className="sr-only">
              Comparison of three professionals across relevant experience, qualification, completion
              rate, distance, availability and inspection fee.
            </caption>

            <thead className="sticky-head">
              <tr>
                <th scope="col" className="w-[210px] pb-5 align-bottom">
                  <Eyebrow>Compare on</Eyebrow>
                </th>
                {PROS.map(p => (
                  <ProHeaderCell
                    key={p.id}
                    pro={p}
                    selected={selected === p.id}
                    focused={focused === p.id}
                    onFocus={() => setFocused(p.id)}
                    onBlur={() => setFocused(null)}
                  />
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
                    <th
                      scope="row"
                      className="py-4 pr-6 align-middle text-[13.5px] font-medium text-ink-600"
                    >
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
                          className={`py-4 pr-8 align-middle transition-colors duration-150
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
                                <span
                                  className="rounded bg-teal-100 px-1.5 py-0.5 font-data text-[9.5px]
                                    uppercase tracking-[0.1em] text-teal-800"
                                >
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

              {/* Action row */}
              <tr>
                <th scope="row" className="py-6 pr-6 align-top text-[13.5px] font-medium text-ink-600">
                  Decide
                </th>
                {PROS.map(p => (
                  <td key={p.id} className="py-6 pr-8 align-top">
                    <div className="flex flex-col items-start gap-3">
                      <Button
                        size="sm"
                        variant={p.id === 'chamod' ? 'primary' : 'secondary'}
                        onClick={() => {
                          set({ selectedPro: p.id })
                          notify(`${p.name} selected for inspection`)
                          window.setTimeout(() => navigate('/case/TC-2048/quotes'), 700)
                        }}
                      >
                        {selected === p.id ? 'Selected' : `Choose ${p.short}`}
                      </Button>
                      <TextLink onClick={() => setWhyOpen(w => (w === p.id ? null : p.id))}>
                        {whyOpen === p.id ? 'Hide reasoning' : 'Why this fit'}
                      </TextLink>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {whyOpen && <WhyThisFit pro={proById(whyOpen)} onClose={() => setWhyOpen(null)} />}

        <p className="mt-12 flex max-w-2xl items-start gap-2 text-[13px] leading-relaxed text-ink-400">
          <Icon.info size={14} className="mt-0.5 shrink-0" />
          Ratings are deliberately not the headline. Every figure above comes from completed jobs on
          TrustCraft and can be traced to its source.
        </p>
      </div>
    </AppShell>
  )
}

function ProHeaderCell({
  pro,
  selected,
  focused,
  onFocus,
  onBlur,
}: {
  pro: Pro
  selected: boolean
  focused: boolean
  onFocus: () => void
  onBlur: () => void
}) {
  const strongest = pro.id === 'chamod'
  return (
    <th
      scope="col"
      onMouseEnter={onFocus}
      onMouseLeave={onBlur}
      className={`w-[240px] pb-5 pr-8 align-bottom transition-all duration-150
        ${focused ? 'translate-y-[-2px]' : ''}`}
    >
      <div className="flex flex-col items-start gap-3">
        <div className="flex items-center gap-3">
          <Avatar tint={pro.tint} name={pro.name} size={44} ring={selected} />
          <div>
            <p className="font-display text-[21px] leading-tight text-ink-950">{pro.short}</p>
            <p className="text-[11.5px] font-normal text-ink-400">{pro.name.split(' ')[1]}</p>
          </div>
        </div>
        <Pill tone={strongest ? 'teal' : 'neutral'}>{pro.fitLabel}</Pill>
      </div>
    </th>
  )
}

/** The reveal. Trust is explained with traceable evidence, never asserted. */
function WhyThisFit({ pro, onClose }: { pro: Pro; onClose: () => void }) {
  return (
    <section
      className="a-up mt-12 rounded-2xl bg-white p-9
        shadow-[0_1px_2px_rgba(15,17,20,0.04),0_18px_50px_-28px_rgba(15,17,20,0.3)]"
      aria-label={`Why ${pro.name} fits this case`}
    >
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar tint={pro.tint} name={pro.name} size={52} />
          <div>
            <Eyebrow tone="teal" className="mb-1.5">
              {pro.fitLabel}
            </Eyebrow>
            <Display size="sm" as="h2" className="text-ink-950">
              {pro.name}
            </Display>
            <p className="mt-1 text-[13.5px] text-ink-500">{pro.fitNote}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-900"
          aria-label="Close reasoning"
        >
          <Icon.close size={16} />
        </button>
      </div>

      <Rule className="my-7" />

      <Eyebrow className="mb-5">Trust evidence</Eyebrow>
      <ul className="grid grid-cols-1 gap-x-12 gap-y-0 md:grid-cols-2">
        {pro.evidence.map(item => (
          <li key={item.label}>
            <div className="flex items-start gap-3 py-3.5">
              <Icon.check size={15} className="mt-0.5 shrink-0 text-success-700" />
              <div>
                <p className="text-[14px] font-medium leading-snug text-ink-900">{item.label}</p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-500">{item.detail}</p>
              </div>
            </div>
            <Rule />
          </li>
        ))}
      </ul>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-5">
        <p className="max-w-lg text-[12.5px] leading-relaxed text-ink-400">
          Each line is drawn from completed jobs and verified documents, not from self-reported profile
          claims.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate(`/pro/${pro.id}`)}>
            Full profile
          </Button>
        </div>
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
      <div className="pb-20 pt-12">
        <button
          type="button"
          onClick={() => navigate('/case/TC-2048/fit')}
          className="mb-8 inline-flex items-center gap-2 text-[13px] text-ink-500 transition-colors hover:text-ink-900"
        >
          <Icon.arrowLeft size={15} />
          Back to comparison
        </button>

        <div className="grid grid-cols-1 gap-x-20 gap-y-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="flex flex-wrap items-center gap-6">
              <Avatar tint={pro.tint} name={pro.name} size={88} />
              <div>
                <Display size="md" as="h1" className="text-ink-950">
                  {pro.name}
                </Display>
                <p className="mt-2 text-[15px] text-ink-500">{pro.specialty}</p>
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

            <Rule className="my-10" />

            <Section title="Relevant experience">
              <div className="flex flex-wrap items-baseline gap-4">
                <span className="font-display text-[56px] leading-none text-ink-950">
                  {pro.similarJobs}
                </span>
                <span className="max-w-xs text-[14px] leading-relaxed text-ink-600">
                  verified repairs of this type in the last 24 months — supply-line and connector leaks
                  specifically.
                </span>
              </div>
            </Section>

            <Section title="Performance">
              <dl className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-3">
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
                      <div>
                        <p className="text-[14px] font-medium text-ink-900">{e.label}</p>
                        <p className="mt-0.5 text-[12.5px] text-ink-500">{e.detail}</p>
                      </div>
                    </div>
                    <Rule />
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Customer experience">
              <p className="mb-6 flex items-center gap-2 text-[13px] text-ink-500">
                <Icon.info size={14} className="shrink-0 text-ink-300" />
                Only customers whose job completed through TrustCraft can leave a review.
              </p>
              <ul className="space-y-0">
                {pro.reviews.map(r => (
                  <li key={r.name}>
                    <div className="py-5">
                      <p className="font-display text-[19px] leading-relaxed text-ink-800">“{r.text}”</p>
                      <p className="mt-3 text-[12.5px] text-ink-400">
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
            <div className="rounded-2xl bg-white p-7 shadow-[0_1px_2px_rgba(15,17,20,0.04),0_16px_44px_-26px_rgba(15,17,20,0.28)]">
              <Eyebrow tone="teal" className="mb-3">
                For this case
              </Eyebrow>
              <p className="font-display text-[24px] leading-tight text-ink-950">{pro.fitLabel}</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">{pro.fitNote}</p>

              <Rule className="my-6" />

              <dl>
                <Row label="Inspection" value={money(pro.inspection)} />
                <Row label="Can attend" value={pro.availability} />
                <Row label="Distance" value={`${pro.distanceKm} km`} />
              </dl>

              <Button
                full
                size="lg"
                className="mt-6"
                onClick={() => {
                  set({ selectedPro: pro.id })
                  notify(`${pro.name} selected for inspection`)
                  navigate('/case/TC-2048/quotes')
                }}
              >
                Choose {pro.short}
              </Button>
              <p className="mt-3 text-center text-[12px] text-ink-400">
                Nothing is charged until you approve a plan.
              </p>
            </div>

            <Disclosure summary="How TrustCraft verifies people" className="mt-6">
              <p className="text-[13px] leading-relaxed text-ink-600">
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
    <section className="mb-12">
      <Eyebrow className="mb-5">{title}</Eyebrow>
      {children}
    </section>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[12.5px] text-ink-500">
        {label}
        {hint && <InfoHint label={hint} />}
      </dt>
      <dd className="tnum mt-1.5 text-[20px] font-medium text-ink-950">{value}</dd>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <div className="flex items-baseline justify-between gap-4 py-2.5">
        <dt className="text-[13px] text-ink-500">{label}</dt>
        <dd className="tnum text-[13.5px] font-medium text-ink-900">{value}</dd>
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
      <div className="pb-20 pt-12">
        <PageHead
          eyebrow="Professionals"
          title="People, with their record attached"
          lede="TrustCraft normally brings professionals to you inside a case, where their record can be judged against the actual problem. This is the open directory."
        />

        <div className="space-y-0">
          {PROS.map((p, i) => (
            <div key={p.id}>
              <Rule />
              <button
                type="button"
                onClick={() => navigate(`/pro/${p.id}`)}
                className="a-up group flex w-full flex-wrap items-center gap-x-10 gap-y-5 py-7 text-left"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <Avatar tint={p.tint} name={p.name} size={56} />
                <div className="min-w-[220px] flex-1">
                  <p className="font-display text-[24px] text-ink-950 transition-colors group-hover:text-teal-800">
                    {p.name}
                  </p>
                  <p className="mt-1 text-[13.5px] text-ink-500">{p.specialty}</p>
                </div>
                <dl className="flex flex-wrap gap-x-10 gap-y-3">
                  <MiniStat label="Similar repairs" value={String(p.similarJobs)} />
                  <MiniStat label="Completion" value={`${p.completion}%`} />
                  <MiniStat label="Area" value={p.area} />
                  <MiniStat label="Inspection" value={money(p.inspection)} />
                </dl>
                <span className="flex items-center gap-2 text-[13px] font-medium text-ink-400 transition-colors group-hover:text-teal-800">
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

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-data text-[10px] uppercase tracking-[0.14em] text-ink-400">{label}</dt>
      <dd className="tnum mt-1 text-[14.5px] font-medium text-ink-900">{value}</dd>
    </div>
  )
}
