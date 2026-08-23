import { useMemo, useState } from 'react'
import { navigate } from '../app-state'
import { AppShell } from '../shell'
import {
  Button,
  Display,
  Disclosure,
  Eyebrow,
  Icon,
  PageHead,
  Pill,
  Rule,
  StatusDot,
  TextLink,
} from '../ui'
import { LEDGER, money, type LedgerAsset } from '../data'

/** Areas, in the order a person would walk them. */
function groupByArea(assets: LedgerAsset[]) {
  const map = new Map<string, LedgerAsset[]>()
  for (const a of assets) {
    const list = map.get(a.area) ?? []
    list.push(a)
    map.set(a.area, list)
  }
  return [...map.entries()]
}

export function HomeLedger({ assetId }: { assetId?: string }) {
  const [selected, setSelected] = useState(assetId ?? LEDGER[0].id)
  const asset = LEDGER.find(a => a.id === selected) ?? LEDGER[0]
  const areas = useMemo(() => groupByArea(LEDGER), [])

  const totalSpend = LEDGER.flatMap(a => a.history).reduce((s, h) => s + h.cost, 0)
  const totalJobs = LEDGER.flatMap(a => a.history).length

  return (
    <AppShell>
      <div className="pb-20 pt-12">
        <PageHead
          eyebrow="Home Ledger"
          title="What this home has been through"
          lede="Every resolved case becomes a permanent entry: what was done, who did it, what it cost, what it is still covered by, and the photographs that prove it."
          aside={
            <dl className="flex gap-10">
              <div>
                <dt className="font-data text-[10.5px] uppercase tracking-[0.14em] text-ink-400">
                  Recorded jobs
                </dt>
                <dd className="tnum mt-1.5 font-display text-[28px] leading-none text-ink-950">
                  {totalJobs}
                </dd>
              </div>
              <div>
                <dt className="font-data text-[10.5px] uppercase tracking-[0.14em] text-ink-400">
                  Total spend
                </dt>
                <dd className="tnum mt-1.5 font-display text-[28px] leading-none text-ink-950">
                  {money(totalSpend)}
                </dd>
              </div>
            </dl>
          }
        />

        <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-[248px_minmax(0,1fr)]">
          {/* ── The home, as a structure ────────────────────────────── */}
          <nav aria-label="Rooms and assets" className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow className="mb-4">Your home</Eyebrow>
            {areas.map(([area, assets]) => (
              <div key={area} className="mb-6">
                <p className="mb-1 text-[13px] font-semibold text-ink-950">{area}</p>
                <ul className="border-l border-[var(--color-rule-strong)]">
                  {assets.map(a => {
                    const active = a.id === selected
                    return (
                      <li key={a.id}>
                        <button
                          type="button"
                          onClick={() => setSelected(a.id)}
                          aria-current={active ? 'true' : undefined}
                          className={`-ml-px flex w-full items-center gap-2 border-l-2 py-2 pl-4 text-left
                            text-[13.5px] transition-colors duration-150
                            ${
                              active
                                ? 'border-teal-800 font-semibold text-teal-900'
                                : 'border-transparent text-ink-500 hover:border-ink-300 hover:text-ink-900'
                            }`}
                        >
                          {a.name}
                          {a.warrantyUntil && (
                            <Icon.shield size={12} className="ml-auto shrink-0 text-success-700" />
                          )}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* ── The asset record ───────────────────────────────────── */}
          <section key={asset.id} className="a-fade min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <Eyebrow tone="teal" className="mb-2.5">
                  {asset.area}
                </Eyebrow>
                <Display size="md" as="h2" className="text-ink-950">
                  {asset.name}
                </Display>
                <p className="mt-2 text-[14px] text-ink-500">{asset.detail}</p>
              </div>
              {asset.warrantyUntil && (
                <Pill tone="success" icon={<Icon.shield size={12} />}>
                  {asset.warrantyUntil.startsWith('Certificate')
                    ? asset.warrantyUntil
                    : `Covered until ${asset.warrantyUntil}`}
                </Pill>
              )}
            </div>

            {asset.reminder && (
              <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-[var(--color-sunken)] px-5 py-4">
                <span className="flex items-center gap-2 text-[13.5px] font-medium text-ink-900">
                  <Icon.clock size={15} className="text-ink-500" />
                  {asset.reminder.label}
                </span>
                <span className="text-[13px] text-ink-500">Due {asset.reminder.due}</span>
                <TextLink tone="muted" className="ml-auto">
                  Remind me
                </TextLink>
              </div>
            )}

            <Rule className="my-10" />

            <Eyebrow className="mb-2">Service history</Eyebrow>

            {asset.history.map((h, i) => (
              <article key={h.caseId} className="a-up" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="grid grid-cols-1 gap-x-10 gap-y-5 py-7 sm:grid-cols-[120px_minmax(0,1fr)]">
                  <div>
                    <p className="tnum font-data text-[12px] text-ink-400">{h.date}</p>
                    {i === 0 && (
                      <span className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-teal-800">
                        <StatusDot tone="teal" />
                        Most recent
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-4">
                      <h3 className="font-display text-[24px] leading-tight text-ink-950">{h.title}</h3>
                      <span className="tnum font-data text-[16px] text-ink-900">{money(h.cost)}</span>
                    </div>

                    <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-3">
                      <Meta label="Professional" value={h.pro} />
                      <Meta label="Case" value={h.caseId} />
                      <Meta label="Evidence" value={`${h.evidence} items`} />
                      {h.warranty && <Meta label="Cover" value={h.warranty} tone="success" />}
                    </dl>

                    {h.parts && h.parts.length > 0 && (
                      <Disclosure summary={`Parts fitted (${h.parts.length})`} className="mt-4 max-w-md">
                        <ul className="space-y-2 pb-2">
                          {h.parts.map(p => (
                            <li key={p} className="flex items-start gap-2.5 text-[13.5px] text-ink-600">
                              <Icon.check size={14} className="mt-0.5 shrink-0 text-ink-300" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </Disclosure>
                    )}

                    {h.caseId === 'TC-2048' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="mt-5"
                        onClick={() => navigate('/case/TC-2048/record')}
                        iconEnd={<Icon.arrow size={14} />}
                      >
                        Open the full record
                      </Button>
                    )}
                  </div>
                </div>
                <Rule />
              </article>
            ))}

            <p className="mt-8 flex max-w-xl items-start gap-2 text-[12.5px] leading-relaxed text-ink-400">
              <Icon.info size={13} className="mt-0.5 shrink-0" />
              This record stays with the home, not with the professional. If you sell, it is the honest
              maintenance history a buyer would otherwise have to take on trust.
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  )
}

function Meta({ label, value, tone }: { label: string; value: string; tone?: 'success' }) {
  return (
    <div>
      <dt className="font-data text-[10px] uppercase tracking-[0.14em] text-ink-400">{label}</dt>
      <dd className={`mt-1 text-[13.5px] font-medium ${tone === 'success' ? 'text-success-700' : 'text-ink-900'}`}>
        {value}
      </dd>
    </div>
  )
}
