import { useCallback, useEffect, useState } from 'react'
import { navigate, useStore } from '../app-state'
import { AppShell } from '../shell'
import {
  Button,
  Display,
  Disclosure,
  Eyebrow,
  Icon,
  InfoHint,
  Pill,
  Rule,
  StatusDot,
  TextLink,
} from '../ui'
import {
  CASE,
  EVIDENCE,
  KNOWN,
  LIKELY_EXPERTISE,
  PATHS,
  QUESTIONS,
  SAFETY,
  type Evidence,
} from '../data'

// ════════════════════════════════════════════════════════════════════════════
// Case creation — the composer becoming a structured case
// ════════════════════════════════════════════════════════════════════════════

const STRUCTURING = [
  'Reading the evidence you attached',
  'Separating what is established from what is assumed',
  'Identifying which questions still matter',
  'Matching the likely field of expertise',
]

export function CaseCreating() {
  const [done, setDone] = useState(0)

  useEffect(() => {
    const timers = STRUCTURING.map((_, i) => window.setTimeout(() => setDone(i + 1), 520 + i * 620))
    const go = window.setTimeout(() => navigate('/case/TC-2048'), 520 + STRUCTURING.length * 620 + 500)
    return () => {
      timers.forEach(window.clearTimeout)
      window.clearTimeout(go)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-950 px-8">
      <div className="w-full max-w-[880px]">
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-[300px_minmax(0,1fr)]">
          <div className="relative overflow-hidden rounded-2xl">
            <img src={EVIDENCE[0].src} alt="" className="h-[220px] w-full object-cover opacity-70" />
            <div className="pointer-events-none absolute inset-0">
              <div className="a-scan h-px w-full bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
            </div>
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15" />
          </div>

          <div>
            <Eyebrow tone="light" className="mb-4">
              Creating case {CASE.id}
            </Eyebrow>
            <Display size="md" className="text-white">
              Structuring what
              <br />
              you told us
            </Display>

            <ol className="mt-9 space-y-3.5" aria-live="polite">
              {STRUCTURING.map((s, i) => (
                <li
                  key={s}
                  className={`flex items-center gap-3.5 transition-all duration-500
                    ${i < done ? 'opacity-100' : 'opacity-25'}`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors
                      ${i < done ? 'bg-teal-600 text-white' : 'bg-white/10'}`}
                  >
                    {i < done ? (
                      <Icon.check size={11} />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
                    )}
                  </span>
                  <span className="text-[14.5px] text-white/85">{s}</span>
                </li>
              ))}
            </ol>

            <p className="mt-9 max-w-sm text-[12.5px] leading-relaxed text-white/35">
              TrustCraft structures evidence. It does not diagnose — a professional confirms the cause.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Problem Workspace ★
// ════════════════════════════════════════════════════════════════════════════

export function ProblemWorkspace() {
  const { progress } = useStore()
  const [activeId, setActiveId] = useState(EVIDENCE[0].id)

  const index = EVIDENCE.findIndex(e => e.id === activeId)
  const active = EVIDENCE[index] ?? EVIDENCE[0]

  const step = useCallback(
    (delta: number) => {
      const next = (index + delta + EVIDENCE.length) % EVIDENCE.length
      setActiveId(EVIDENCE[next].id)
    },
    [index],
  )

  // Arrow keys move through evidence — a viewer that ignores them feels broken.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step])

  const answered = Object.keys(progress.answers).length
  const remaining = QUESTIONS.length - answered

  return (
    <AppShell recede caseStage="understand" wide noFooter>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_min(38vw,460px)]">
        {/* ── Evidence viewer ─────────────────────────────────────────── */}
        <section
          aria-label="Evidence"
          className="flex h-[calc(100vh-108px)] min-h-[640px] flex-col overflow-hidden bg-ink-950 px-8 pb-7 pt-8 xl:px-12"
        >
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <Eyebrow tone="light">Evidence · {EVIDENCE.length} items</Eyebrow>
            <span className="ml-auto flex items-center gap-1 rounded-lg bg-white/[0.07] px-2 py-1">
              <NavArrow dir="prev" onClick={() => step(-1)} />
              <span className="font-data px-1.5 text-[11.5px] text-white/55">
                {index + 1} / {EVIDENCE.length}
              </span>
              <NavArrow dir="next" onClick={() => step(1)} />
            </span>
          </div>

          <EvidenceStage item={active} />

          <div className="mt-7 flex gap-3 overflow-x-auto pb-1 thin-scroll">
            {EVIDENCE.map(e => (
              <Thumb key={e.id} item={e} active={e.id === activeId} onSelect={() => setActiveId(e.id)} />
            ))}
            <button
              type="button"
              className="flex h-[68px] w-[92px] shrink-0 flex-col items-center justify-center gap-1
                rounded-xl border border-dashed border-white/20 text-white/40 transition-colors
                hover:border-white/40 hover:text-white/70"
            >
              <Icon.plus size={16} />
              <span className="text-[11px]">Add</span>
            </button>
          </div>
        </section>

        {/* ── Contextual intelligence rail ────────────────────────────── */}
        <aside
          aria-label="What TrustCraft understands"
          className="a-rail flex h-[calc(100vh-108px)] min-h-[640px] flex-col overflow-hidden
            border-l border-[var(--color-rule)] bg-[var(--color-canvas)]"
        >
          <div className="flex-1 overflow-y-auto px-8 pb-6 pt-8 thin-scroll">
            <Eyebrow tone="teal" className="mb-3">
              {CASE.room}
            </Eyebrow>
            <Display size="sm" as="h1" className="text-ink-950">
              {CASE.title}
            </Display>
            <p className="mt-2.5 text-[13.5px] text-ink-500">Opened {CASE.opened}</p>

            <Rule className="my-7" />

            <KnownBlock />
            <UnknownBlock />
            <ExpertiseBlock />
            <SafetyBlock />
            <ConfirmationBlock />
          </div>

          {/* Sticky decision footer — the rail always offers the next move. */}
          <div className="sticky bottom-0 border-t border-[var(--color-rule)] bg-[var(--color-canvas)]/95 px-8 py-5 backdrop-blur-md">
            <div className="mb-3 flex items-center gap-2 text-[12.5px] text-ink-500">
              {remaining > 0 ? (
                <>
                  <StatusDot tone="warning" />
                  {remaining} question{remaining > 1 ? 's' : ''} still open — you can continue anyway
                </>
              ) : (
                <>
                  <StatusDot tone="success" />
                  Everything we can establish without a professional is recorded
                </>
              )}
            </div>
            <Button full size="lg" to="/case/TC-2048/path" iconEnd={<Icon.arrow size={17} />}>
              See the resolution path
            </Button>
          </div>
        </aside>
      </div>
    </AppShell>
  )
}

function NavArrow({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Previous evidence' : 'Next evidence'}
      className="flex h-7 w-7 items-center justify-center rounded-md text-white/60
        transition-colors hover:bg-white/10 hover:text-white"
    >
      {dir === 'prev' ? <Icon.arrowLeft size={15} /> : <Icon.arrow size={15} />}
    </button>
  )
}

function EvidenceStage({ item }: { item: Evidence }) {
  if (item.kind === 'photo') {
    return (
      <figure key={item.id} className="a-fade flex min-h-0 flex-1 flex-col">
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-black/40 p-2">
          <img src={item.src} alt={item.label} className="h-full w-full object-contain" />
          {item.id === 'ev-1' && <LeakMarker />}
        </div>
        <figcaption className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-white/55">
          <span className="font-medium text-white/85">{item.label}</span>
          <span aria-hidden="true">·</span>
          <span>Added by {item.by}</span>
          <span aria-hidden="true">·</span>
          <span className="font-data">{item.at}</span>
        </figcaption>
      </figure>
    )
  }

  if (item.kind === 'voice') {
    return (
      <div key={item.id} className="a-fade flex min-h-0 flex-1 flex-col justify-center">
        <div className="rounded-2xl bg-white/[0.05] p-9">
          <div className="flex items-center gap-5">
            <button
              type="button"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-600
                text-white transition-colors hover:bg-teal-500"
              aria-label="Play voice description"
            >
              <Icon.play size={20} className="ml-0.5" />
            </button>
            <span className="flex h-12 flex-1 items-center gap-[3px]" aria-hidden="true">
              {Array.from({ length: 64 }, (_, i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-full bg-teal-400/50"
                  style={{ height: `${8 + Math.abs(Math.sin(i * 0.9)) * 34}px` }}
                />
              ))}
            </span>
            <span className="font-data shrink-0 text-[13px] text-white/50">{item.duration}</span>
          </div>

          <Rule tone="light" className="my-7" />

          <Eyebrow tone="light" className="mb-3">
            Transcript
          </Eyebrow>
          <p className="max-w-2xl font-display text-[24px] leading-[1.45] text-white/90">“{item.body}”</p>
        </div>
        <p className="mt-4 text-[13px] text-white/55">
          {item.label} · Added by {item.by} · <span className="font-data">{item.at}</span>
        </p>
      </div>
    )
  }

  return (
    <div key={item.id} className="a-fade flex min-h-0 flex-1 flex-col justify-center">
      <div className="rounded-2xl bg-white/[0.05] p-9">
        <Eyebrow tone="light" className="mb-4">
          Written note
        </Eyebrow>
        <p className="max-w-2xl font-display text-[26px] leading-[1.4] text-white/90">{item.body}</p>
      </div>
      <p className="mt-4 text-[13px] text-white/55">
        {item.label} · Added by {item.by} · <span className="font-data">{item.at}</span>
      </p>
    </div>
  )
}

/** The one annotation on the evidence — labelled as observed, not diagnosed. */
function LeakMarker() {
  return (
    <div className="a-mark absolute left-[30%] top-[60%]">
      <span className="relative flex items-center gap-2">
        <span className="relative flex h-5 w-5 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-warning-700/30 a-pulse" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning-700 ring-2 ring-white/70" />
        </span>
        <span className="whitespace-nowrap rounded-full bg-black/70 px-3 py-1 text-[12px] text-white backdrop-blur-sm">
          Water visible here
        </span>
      </span>
    </div>
  )
}

function Thumb({ item, active, onSelect }: { item: Evidence; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? 'true' : undefined}
      className={`relative h-[68px] w-[92px] shrink-0 overflow-hidden rounded-xl transition-all duration-150
        ${active ? 'ring-2 ring-teal-400' : 'opacity-55 hover:opacity-100'}`}
    >
      {item.src ? (
        <img src={item.src} alt={item.label} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <span className="flex h-full w-full flex-col items-center justify-center gap-1 bg-white/[0.07] text-white/70">
          {item.kind === 'voice' ? <Icon.mic size={16} /> : <Icon.text size={16} />}
          <span className="text-[10px]">{item.kind === 'voice' ? item.duration : 'Note'}</span>
        </span>
      )}
    </button>
  )
}

// ── Rail blocks ─────────────────────────────────────────────────────────────

function RailHeading({ children, tone }: { children: React.ReactNode; tone?: 'teal' | 'gold' }) {
  return (
    <Eyebrow tone={tone ?? 'muted'} className="mb-3.5">
      {children}
    </Eyebrow>
  )
}

function KnownBlock() {
  const { progress } = useStore()
  const derived = QUESTIONS.filter(q => progress.answers[q.id]).map(q => ({
    id: q.id,
    text: q.reading[progress.answers[q.id]],
    from: `You answered “${progress.answers[q.id]}”`,
  }))

  return (
    <section className="mb-9">
      <RailHeading tone="teal">What we know</RailHeading>
      <ul className="space-y-0">
        {[...KNOWN, ...derived].map((f, i) => (
          <li key={f.id} className={i >= KNOWN.length ? 'a-up' : ''}>
            <div className="flex gap-3 py-3">
              <Icon.check size={15} className="mt-0.5 shrink-0 text-teal-700" />
              <div className="min-w-0">
                <p className="text-[14px] leading-snug text-ink-900">{f.text}</p>
                <p className="mt-1 text-[12px] text-ink-400">{f.from}</p>
              </div>
            </div>
            <Rule />
          </li>
        ))}
      </ul>
    </section>
  )
}

function UnknownBlock() {
  const { progress, answer, notify } = useStore()
  const open = QUESTIONS.filter(q => !progress.answers[q.id])

  return (
    <section className="mb-9">
      <RailHeading tone="gold">What we still need</RailHeading>

      {open.length === 0 ? (
        <p className="rounded-xl bg-success-100 px-4 py-3.5 text-[13.5px] leading-relaxed text-success-800">
          Nothing further can be established from here. The remaining uncertainty needs a professional
          on site.
        </p>
      ) : (
        <ul className="space-y-5">
          {open.map(q => (
            <li key={q.id} className="a-up">
              <p className="text-[15px] font-medium leading-snug text-ink-900">{q.question}</p>
              <p className="mt-1.5 flex items-start gap-1.5 text-[12.5px] leading-relaxed text-ink-500">
                <Icon.info size={13} className="mt-px shrink-0 text-ink-300" />
                {q.why}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {q.options.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      answer(q.id, opt)
                      notify('Answer recorded — the case updated')
                    }}
                    className="rounded-[10px] border border-[var(--color-rule-strong)] bg-white px-4 py-2
                      text-[13.5px] font-medium text-ink-800 transition-all duration-150
                      hover:border-teal-700 hover:bg-teal-50 hover:text-teal-900 active:scale-[0.98]"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function ExpertiseBlock() {
  return (
    <section className="mb-9">
      <RailHeading>Likely expertise</RailHeading>
      <div className="flex items-start gap-3.5">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-teal-100 text-teal-800">
          <Icon.drop size={17} />
        </span>
        <div>
          <p className="text-[15px] font-semibold text-ink-950">{LIKELY_EXPERTISE.field}</p>
          <p className="mt-0.5 text-[13px] text-ink-500">{LIKELY_EXPERTISE.narrow}</p>
        </div>
      </div>

      <Rule className="my-5" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-[14.5px] font-semibold text-ink-950">
            <StatusDot tone="warning" />
            {LIKELY_EXPERTISE.priority}
          </p>
          <p className="mt-1.5 max-w-xs text-[12.5px] leading-relaxed text-ink-500">
            {LIKELY_EXPERTISE.priorityWhy}
          </p>
        </div>
        <InfoHint label="Priority reflects how fast damage spreads if nothing is done — not how severe the fault is." />
      </div>
    </section>
  )
}

function SafetyBlock() {
  return (
    <section className="mb-9">
      <RailHeading>Safety</RailHeading>
      <div className="rounded-xl bg-warning-100 p-5">
        <p className="flex items-center gap-2 text-[14px] font-semibold text-warning-700">
          <Icon.alert size={15} />
          {SAFETY.title}
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-700">{SAFETY.body}</p>
        <Disclosure summary="If the valve will not turn" className="mt-1">
          <p className="text-[13px] leading-relaxed text-ink-600">{SAFETY.caveat}</p>
        </Disclosure>
      </div>
    </section>
  )
}

function ConfirmationBlock() {
  return (
    <section className="mb-4">
      <RailHeading>Professional confirmation</RailHeading>
      <div className="flex gap-3.5 rounded-xl bg-[var(--color-sunken)] p-5">
        <Icon.shield size={17} className="mt-0.5 shrink-0 text-ink-500" />
        <div>
          <p className="text-[13.5px] font-medium text-ink-900">Required before any diagnosis</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">
            Everything above is drawn from the evidence you provided. TrustCraft has not identified a
            cause and cannot — a supply-side and a drain-side fault look identical from here.
          </p>
        </div>
      </div>
    </section>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Resolution Path ★
// ════════════════════════════════════════════════════════════════════════════

export function ResolutionPathPage() {
  const { progress, set, notify } = useStore()
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <AppShell recede caseStage="decide">
      <div className="pb-20 pt-12">
        <div className="max-w-2xl">
          <Eyebrow tone="teal" className="a-up mb-4">
            Recommended next step
          </Eyebrow>
          <Display size="lg" as="h1" className="a-up d1 text-ink-950">
            A professional needs
            <br />
            to see it.
          </Display>
          <p className="a-up d2 mt-6 text-[16px] leading-relaxed text-ink-600">
            The exact leak source cannot be confirmed from the available evidence. Two different faults
            look the same in a photograph, and they need different work.
          </p>
        </div>

        <div className="mt-14 space-y-px">
          {PATHS_ORDERED.map((p, i) => (
            <PathRow
              key={p.id}
              path={p}
              index={i}
              expanded={expanded === p.id}
              onToggle={() => setExpanded(e => (e === p.id ? null : p.id))}
              chosen={progress.path === p.id}
              onChoose={() => {
                set({ path: p.id })
                if (p.recommended) {
                  navigate('/case/TC-2048/fit')
                } else {
                  notify(`Recorded: you chose to ${p.title.toLowerCase()}`)
                }
              }}
            />
          ))}
        </div>

        <p className="mt-12 max-w-xl text-[13px] leading-relaxed text-ink-400">
          TrustCraft recommends a path and shows its reasoning. Choosing a different one is recorded
          against the case, not overridden.
        </p>
      </div>
    </AppShell>
  )
}

// Recommended first, then the alternatives.
const PATHS_ORDERED = [...PATHS].sort((a, b) => Number(b.recommended) - Number(a.recommended))

function PathRow({
  path,
  index,
  expanded,
  onToggle,
  chosen,
  onChoose,
}: {
  path: (typeof PATHS)[number]
  index: number
  expanded: boolean
  onToggle: () => void
  chosen: boolean
  onChoose: () => void
}) {
  const recommended = path.recommended
  return (
    <div
      className={`a-up transition-colors duration-200
        ${recommended ? 'rounded-2xl bg-white shadow-[0_1px_2px_rgba(15,17,20,0.04),0_14px_40px_-24px_rgba(15,17,20,0.28)]' : ''}
        ${chosen && !recommended ? 'bg-[var(--color-sunken)] rounded-2xl' : ''}`}
      style={{ animationDelay: `${0.08 * index}s` }}
    >
      {!recommended && <Rule />}
      <div className={recommended ? 'p-9' : 'py-7'}>
        <div className="flex flex-wrap items-start gap-x-8 gap-y-5">
          <div className="min-w-0 flex-1">
            <div className="mb-2.5 flex flex-wrap items-center gap-3">
              {recommended && <Pill tone="teal" icon={<Icon.check size={12} />}>Recommended</Pill>}
              {chosen && !recommended && <Pill tone="neutral">Your choice</Pill>}
            </div>

            <h2
              className={`font-display text-ink-950 ${recommended ? 'text-[32px] leading-tight' : 'text-[24px]'}`}
            >
              {path.title}
            </h2>
            <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-ink-600">{path.summary}</p>

            {path.lessAppropriate && (
              <p className="mt-4 flex max-w-xl items-start gap-2 text-[13px] leading-relaxed text-warning-700">
                <Icon.alert size={14} className="mt-0.5 shrink-0" />
                {path.lessAppropriate}
              </p>
            )}

            {recommended && (
              <ul className="mt-6 space-y-2.5">
                {path.why.map(w => (
                  <li key={w} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-ink-700">
                    <Icon.check size={15} className="mt-0.5 shrink-0 text-teal-700" />
                    {w}
                  </li>
                ))}
              </ul>
            )}

            {!recommended && expanded && (
              <ul className="a-up mt-5 space-y-2">
                {path.why.map(w => (
                  <li key={w} className="flex items-start gap-2.5 text-[13.5px] text-ink-600">
                    <Icon.dash size={14} className="mt-0.5 shrink-0 text-ink-300" />
                    {w}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={`flex shrink-0 flex-col gap-5 ${recommended ? 'items-end' : 'items-end'}`}>
            <dl className="flex gap-8 text-right">
              <div>
                <dt className="font-data text-[10.5px] uppercase tracking-[0.14em] text-ink-400">Cost</dt>
                <dd className="tnum mt-1 text-[15px] font-medium text-ink-900">{path.cost}</dd>
              </div>
              <div>
                <dt className="font-data text-[10.5px] uppercase tracking-[0.14em] text-ink-400">When</dt>
                <dd className="mt-1 text-[15px] font-medium text-ink-900">{path.time}</dd>
              </div>
            </dl>

            {recommended ? (
              <Button size="lg" onClick={onChoose} iconEnd={<Icon.arrow size={17} />}>
                Find a professional
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <TextLink tone="muted" onClick={onToggle}>
                  {expanded ? 'Hide detail' : 'When this fits'}
                </TextLink>
                <Button size="sm" variant="secondary" onClick={onChoose}>
                  Choose this
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
