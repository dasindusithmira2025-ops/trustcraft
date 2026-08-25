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
import { CASES, LEDGER, money, type LedgerAsset, type LedgerEntry } from '../data'

// ════════════════════════════════════════════════════════════════════════════
// Home Ledger
//
// Not a file browser. A home is rooms and the things in them, so the structure
// is walked the way a person walks a house — and each thing states its own
// condition rather than being a name in a tree.
//
//   ≥1024  the whole structure beside the open record
//   <1024  a drill-down: rooms → things → record, one screen at a time
// ════════════════════════════════════════════════════════════════════════════

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

/**
 * Condition, derived rather than declared: an asset is "attention needed" only
 * when a live case actually names it. Nothing here is a self-reported status.
 */
function conditionOf(asset: LedgerAsset) {
  const room = `${asset.area} · ${asset.name}`
  const open = CASES.find(c => c.room === room && c.attention !== 'resolved')
  if (open) return { label: 'Open case', tone: 'gold' as const, detail: open.status }
  return { label: 'No open issues', tone: 'success' as const, detail: `Last serviced ${asset.lastService}` }
}

export function HomeLedger({ assetId }: { assetId?: string }) {
  const areas = useMemo(() => groupByArea(LEDGER), [])
  const [selected, setSelected] = useState(assetId ?? LEDGER[0].id)
  const asset = LEDGER.find(a => a.id === selected) ?? LEDGER[0]

  // Small screens walk the structure one level at a time. A URL that names an
  // asset lands straight on its record.
  const [level, setLevel] = useState<'areas' | 'assets' | 'record'>(assetId ? 'record' : 'areas')
  const [openArea, setOpenArea] = useState<string>(assetId ? asset.area : areas[0][0])

  const totalSpend = LEDGER.flatMap(a => a.history).reduce((s, h) => s + h.cost, 0)
  const totalJobs = LEDGER.flatMap(a => a.history).length

  function openAsset(id: string) {
    setSelected(id)
    setLevel('record')
  }

  return (
    <AppShell>
      <div className="pb-16 pt-8 sm:pt-10 lg:pb-20 lg:pt-12">
        <PageHead
          eyebrow="Home Ledger"
          title="What this home has been through"
          lede="Every resolved case becomes a permanent entry: what was done, who did it, what it cost, what it is still covered by, and the photographs that prove it."
          aside={
            <dl className="flex gap-8 sm:gap-10">
              <div>
                <dt className="font-data text-[11px] uppercase tracking-[0.14em] text-ink-400">
                  Recorded jobs
                </dt>
                <dd className="tnum mt-1.5 font-display text-[24px] leading-none text-ink-950 sm:text-[28px]">
                  {totalJobs}
                </dd>
              </div>
              <div>
                <dt className="font-data text-[11px] uppercase tracking-[0.14em] text-ink-400">
                  Total spend
                </dt>
                <dd className="tnum mt-1.5 font-display text-[24px] leading-none text-ink-950 sm:text-[28px]">
                  {money(totalSpend)}
                </dd>
              </div>
            </dl>
          }
        />

        {/* ── Small screens: drill down ──────────────────────────────── */}
        <div className="md:hidden">
          {level === 'areas' && (
            <div className="a-fade">
              <Eyebrow className="mb-3">My home</Eyebrow>
              <ul>
                {areas.map(([area, assets]) => (
                  <li key={area}>
                    <Rule />
                    <button
                      type="button"
                      onClick={() => {
                        setOpenArea(area)
                        setLevel('assets')
                      }}
                      className="group flex w-full items-center gap-4 py-4 text-left"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-[21px] leading-tight text-ink-950">
                          {area}
                        </span>
                        <span className="mt-1 block text-[13.5px] text-ink-500">
                          {assets.length} tracked {assets.length === 1 ? 'item' : 'items'}
                          {assets.some(a => a.warrantyUntil) && ' · some still covered'}
                        </span>
                      </span>
                      <Icon.chevronRight
                        size={17}
                        className="shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5"
                      />
                    </button>
                  </li>
                ))}
              </ul>
              <Rule />
            </div>
          )}

          {level === 'assets' && (
            <div className="a-fade">
              <BackLink label="All rooms" onClick={() => setLevel('areas')} />
              <Display size="md" as="h2" className="mb-4 text-ink-950">
                {openArea}
              </Display>
              <ul>
                {(areas.find(([a]) => a === openArea)?.[1] ?? []).map(a => {
                  const cond = conditionOf(a)
                  return (
                    <li key={a.id}>
                      <Rule />
                      <button
                        type="button"
                        onClick={() => openAsset(a.id)}
                        className="group flex w-full items-center gap-4 py-4 text-left"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block text-[15px] font-semibold text-ink-950">{a.name}</span>
                          <span className="mt-1 flex items-center gap-1.5 text-[13.5px] text-ink-500">
                            <StatusDot tone={cond.tone} />
                            {cond.detail}
                          </span>
                        </span>
                        {a.warrantyUntil && (
                          <Icon.shield size={14} className="shrink-0 text-success-700" />
                        )}
                        <Icon.chevronRight
                          size={17}
                          className="shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5"
                        />
                      </button>
                    </li>
                  )
                })}
              </ul>
              <Rule />
            </div>
          )}

          {level === 'record' && (
            <div className="a-fade">
              <BackLink
                label={openArea}
                onClick={() => {
                  setOpenArea(asset.area)
                  setLevel('assets')
                }}
              />
              <AssetRecord asset={asset} />
            </div>
          )}
        </div>

        {/* ── Laptop and wider: structure beside record ──────────────── */}
        <div className="hidden md:grid md:grid-cols-[204px_minmax(0,1fr)] md:gap-x-9 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-x-14 xl:grid-cols-[264px_minmax(0,1fr)] xl:gap-x-16">
          <nav aria-label="Rooms and assets" className="md:sticky md:top-24 md:self-start">
            <Eyebrow className="mb-4">My home</Eyebrow>
            {areas.map(([area, assets]) => (
              <div key={area} className="mb-6">
                <p className="mb-2 font-display text-[17px] text-ink-950">{area}</p>
                <ul className="space-y-0.5">
                  {assets.map(a => {
                    const active = a.id === selected
                    const cond = conditionOf(a)
                    return (
                      <li key={a.id}>
                        <button
                          type="button"
                          onClick={() => setSelected(a.id)}
                          aria-current={active ? 'true' : undefined}
                          className={`flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left
                            transition-colors duration-150
                            ${active ? 'bg-white shadow-[0_1px_2px_rgba(15,17,20,0.06)]' : 'hover:bg-black/[0.035]'}`}
                        >
                          <span className="mt-[5px]">
                            <StatusDot tone={cond.tone} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span
                              className={`block truncate text-[14.5px] ${active ? 'font-semibold text-ink-950' : 'font-medium text-ink-700'}`}
                            >
                              {a.name}
                            </span>
                            <span className="mt-0.5 block truncate text-[12.5px] text-ink-400">
                              {a.lastService}
                            </span>
                          </span>
                          {a.warrantyUntil && (
                            <Icon.shield size={12} className="mt-1 shrink-0 text-success-700" />
                          )}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <section key={asset.id} className="a-fade min-w-0">
            <AssetRecord asset={asset} />
          </section>
        </div>
      </div>
    </AppShell>
  )
}

function BackLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="tap mb-4 inline-flex items-center gap-2 text-[14px] text-ink-500 transition-colors hover:text-ink-900"
    >
      <Icon.arrowLeft size={15} />
      {label}
    </button>
  )
}

/** One thing in the home: what it is, how it is, and everything done to it. */
function AssetRecord({ asset }: { asset: LedgerAsset }) {
  const cond = conditionOf(asset)

  return (
    <>
      <Eyebrow tone="teal" className="mb-2.5">
        {asset.area}
      </Eyebrow>
      <Display size="md" as="h2" className="text-ink-950">
        {asset.name}
      </Display>
      <p className="mt-2 text-[14.5px] text-ink-500 sm:text-[15px]">{asset.detail}</p>

      {/* Condition first — the question a person actually arrives with. */}
      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl bg-[var(--color-sunken)] p-4 sm:mt-7 sm:grid-cols-3 sm:p-5">
        <div className="min-w-0">
          <dt className="font-data text-[10.5px] uppercase tracking-[0.14em] text-ink-400">
            Current state
          </dt>
          <dd
            className={`mt-1.5 flex items-center gap-1.5 text-[15px] font-semibold
              ${cond.tone === 'gold' ? 'text-gold-600' : 'text-success-700'}`}
          >
            <StatusDot tone={cond.tone} />
            {cond.label}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="font-data text-[10.5px] uppercase tracking-[0.14em] text-ink-400">
            Latest service
          </dt>
          <dd className="mt-1.5 text-[15px] font-semibold text-ink-950">{asset.lastService}</dd>
        </div>
        <div className="col-span-2 min-w-0 sm:col-span-1">
          <dt className="font-data text-[10.5px] uppercase tracking-[0.14em] text-ink-400">Cover</dt>
          <dd className="mt-1.5 text-[15px] font-semibold text-ink-950">
            {asset.warrantyUntil ? (
              <Pill tone="success" icon={<Icon.shield size={12} />}>
                {asset.warrantyUntil.startsWith('Certificate')
                  ? asset.warrantyUntil
                  : `Until ${asset.warrantyUntil}`}
              </Pill>
            ) : (
              <span className="text-[14.5px] font-medium text-ink-500">None active</span>
            )}
          </dd>
        </div>
      </dl>

      {asset.reminder && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-dashed border-[var(--color-rule-strong)] px-4 py-3.5 sm:px-5">
          <span className="flex items-center gap-2 text-[14.5px] font-medium text-ink-900">
            <Icon.clock size={15} className="text-ink-500" />
            {asset.reminder.label}
          </span>
          <span className="text-[14px] text-ink-500">Due {asset.reminder.due}</span>
          <TextLink tone="muted" className="ml-auto">
            Remind me
          </TextLink>
        </div>
      )}

      <Rule className="my-8 lg:my-10" />

      <Eyebrow className="mb-2">Service history</Eyebrow>

      {asset.history.map((h, i) => (
        <article key={h.caseId} className="a-up" style={{ animationDelay: `${i * 0.06}s` }}>
          <div className="grid grid-cols-1 gap-x-10 gap-y-4 py-6 sm:py-7 lg:grid-cols-[120px_minmax(0,1fr)]">
            <div className="flex items-center gap-3 lg:block">
              <p className="tnum font-data text-[13px] text-ink-400">{h.date}</p>
              {i === 0 && (
                <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-teal-800 lg:mt-2">
                  <StatusDot tone="teal" />
                  Most recent
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-display text-[21px] leading-tight text-ink-950 sm:text-[24px]">
                  {h.title}
                </h3>
                <span className="tnum font-data text-[15px] text-ink-900 sm:text-[16px]">
                  {money(h.cost)}
                </span>
              </div>

              <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3 sm:gap-x-10">
                <Meta label="Professional" value={h.pro} />
                <Meta label="Case" value={h.caseId} />
                <Meta label="Evidence" value={`${h.evidence} items`} />
                {h.versions && h.versions > 1 && (
                  <Meta label="Agreement versions" value={String(h.versions)} />
                )}
                {h.warranty && <Meta label="Cover" value={h.warranty} tone="success" />}
              </dl>

              <EvidenceStrip entry={h} />

              {h.parts && h.parts.length > 0 && (
                <Disclosure summary={`Parts fitted (${h.parts.length})`} className="mt-4 max-w-md">
                  <ul className="space-y-2 pb-2">
                    {h.parts.map(p => (
                      <li key={p} className="flex items-start gap-2.5 text-[14.5px] text-ink-600">
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

      <p className="measure mt-7 flex items-start gap-2 text-[13.5px] leading-relaxed text-ink-400 sm:mt-8">
        <Icon.info size={13} className="mt-0.5 shrink-0" />
        This record stays with the home, not with the professional. If you sell, it is the honest
        maintenance history a buyer would otherwise have to take on trust.
      </p>
    </>
  )
}

/**
 * Evidence strip.
 *
 * Not a gallery — a strip, capped and quiet, sitting under the figures rather
 * than competing with them. Four photographs and the two documents that were
 * actually signed are enough to make a ledger row feel like a thing that
 * happened to this house.
 */
function EvidenceStrip({ entry }: { entry: LedgerEntry }) {
  const [open, setOpen] = useState<string | null>(null)
  if (!entry.strip || entry.strip.length === 0) return null

  const shown = entry.strip
  const photo = open ? shown.find(i => i.label === open) : null

  return (
    <div className="mt-5">
      <Eyebrow className="mb-2.5">What this looked like</Eyebrow>

      <ul className="snap-row gap-2.5">
        {shown.map(item => (
          <li key={item.label}>
            <button
              type="button"
              onClick={() => (item.to ? navigate(item.to.replace('#', '')) : setOpen(item.label))}
              className="group block w-[104px] text-left focus:outline-none sm:w-[116px]"
            >
              <span
                className="relative block h-[74px] overflow-hidden rounded-lg ring-1 ring-[var(--color-rule)]
                  transition-all duration-150 group-hover:-translate-y-0.5 group-hover:ring-teal-700
                  group-focus-visible:ring-2 group-focus-visible:ring-teal-700 sm:h-[82px]"
              >
                {item.src ? (
                  <img src={item.src} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-[var(--color-sunken)] text-ink-500">
                    <Icon.file size={19} />
                  </span>
                )}
              </span>
              <span className="mt-1.5 block truncate text-[12.5px] font-medium text-ink-700">
                {item.label}
              </span>
              <span className="block truncate text-[11.5px] text-ink-500">
                {item.kind === 'document' ? 'Open the record' : 'Photograph'}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {photo?.src && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={photo.label}
          onClick={() => setOpen(null)}
          className="a-fade fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/92 p-4 sm:p-8"
        >
          <div className="max-w-3xl" onClick={e => e.stopPropagation()}>
            <img src={photo.src} alt={photo.label} className="max-h-[70vh] w-full rounded-xl object-contain" />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <p className="text-[14px] text-white/80">
                {photo.label} · {entry.title} · {entry.date}
              </p>
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="tap flex items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2 text-[13.5px]
                  text-white transition-colors hover:bg-white/20"
              >
                <Icon.close size={14} />
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Meta({ label, value, tone }: { label: string; value: string; tone?: 'success' }) {
  return (
    <div className="min-w-0">
      <dt className="font-data text-[10.5px] uppercase tracking-[0.14em] text-ink-400">{label}</dt>
      <dd className={`mt-1 text-[14.5px] font-medium ${tone === 'success' ? 'text-success-700' : 'text-ink-900'}`}>
        {value}
      </dd>
    </div>
  )
}
