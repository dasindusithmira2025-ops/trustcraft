import { useEffect, useRef, useState } from 'react'
import { navigate, useStore } from '../app-state'
import { AppShell } from '../shell'
import {
  Button,
  Display,
  Eyebrow,
  Icon,
  Money,
  Pill,
  Rule,
  StatusDot,
  TextLink,
  Tooltip,
} from '../ui'
import { CASES, EVIDENCE, LEDGER, USER } from '../data'

// The scenario the composer demonstrates, kept verbatim from the case data.
const EXAMPLE_TEXT =
  "There's water coming from underneath my kitchen sink. I noticed it this morning when I opened the cabinet — the base is damp and there's a small puddle. It seems worse right after I use the tap."

interface Attachment {
  id: string
  label: string
  src?: string
  kind: 'photo' | 'voice'
  duration?: string
}

const EXAMPLE_ATTACHMENTS: Attachment[] = [
  { id: 'ev-1', kind: 'photo', label: 'Under-sink cabinet', src: EVIDENCE[0].src },
  { id: 'ev-2', kind: 'photo', label: 'Supply line connection', src: EVIDENCE[1].src },
]

/**
 * Home.
 *
 * Editorial, not a dashboard. One question owns the top of the screen and one
 * object answers it. Everything else in this home is context, and context sits
 * to the side on a desktop and underneath on a phone — the same information in
 * both cases, ordered by what the person came here to do.
 */
export default function Home() {
  return (
    <AppShell>
      <div
        className="grid grid-cols-1 items-start gap-y-12 pb-4 pt-8
          sm:pt-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-x-14 lg:pt-14 xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-x-20"
      >
        <Composer />
        <ContextRail />
      </div>
    </AppShell>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// The composer — one surface. Show it, describe it, or talk.
// ════════════════════════════════════════════════════════════════════════════

function Composer() {
  const { notify } = useStore()
  const [text, setText] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [recording, setRecording] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [focused, setFocused] = useState(false)
  const [starting, setStarting] = useState(false)
  const areaRef = useRef<HTMLTextAreaElement>(null)

  const hasContent = text.trim().length > 0 || attachments.length > 0
  const live = focused || hasContent || recording

  // Grow with content rather than scrolling inside a fixed box. The floor is
  // lower on a phone: a tall empty box there just pushes the button off-screen.
  useEffect(() => {
    const el = areaRef.current
    if (!el) return
    const floor = window.innerWidth < 640 ? 92 : 132
    el.style.height = 'auto'
    el.style.height = `${Math.max(el.scrollHeight, floor)}px`
  }, [text])

  // Voice: transcribe into the same field the typed words go into. One surface.
  useEffect(() => {
    if (!recording) return
    let i = 0
    const target = EXAMPLE_TEXT
    const tick = window.setInterval(() => {
      i = Math.min(i + 3, target.length)
      setText(target.slice(0, i))
      if (i >= target.length) {
        window.clearInterval(tick)
        setRecording(false)
      }
    }, 26)
    return () => window.clearInterval(tick)
  }, [recording])

  function addPhotos() {
    setAttachments(a => {
      const next = EXAMPLE_ATTACHMENTS.filter(e => !a.some(x => x.id === e.id))
      return next.length > 0 ? [...a, next[0]] : a
    })
  }

  function loadExample() {
    setText(EXAMPLE_TEXT)
    setAttachments(EXAMPLE_ATTACHMENTS)
    areaRef.current?.focus()
  }

  function start() {
    if (!hasContent) return
    setStarting(true)
    window.setTimeout(() => navigate('/case/new'), 260)
  }

  return (
    <section aria-labelledby="composer-heading">
      <Eyebrow tone="teal" className="a-up mb-3 sm:mb-4">
        {greeting()}, {USER.name}
      </Eyebrow>

      <Display size="xl" as="h1" className="a-up d1 text-ink-950">
        What happened?
      </Display>

      <p
        id="composer-heading"
        className="a-up d2 measure mt-3.5 text-[15.5px] leading-relaxed text-ink-500 sm:mt-5 sm:text-[17px]"
      >
        Show us, describe it, or just talk. We&apos;ll help structure what comes next.
      </p>

      {/* One surface: typing, photos and voice all land in the same place. */}
      <div
        onDragOver={e => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault()
          setDragging(false)
          addPhotos()
          notify('Evidence attached')
        }}
        className={`a-up d3 mt-6 rounded-2xl bg-white transition-all duration-200 sm:mt-8 lg:mt-9
          ${
            dragging
              ? 'ring-2 ring-teal-700 ring-offset-2 ring-offset-[var(--color-canvas)]'
              : live
                ? 'shadow-[0_1px_2px_rgba(15,17,20,0.05),0_20px_50px_-22px_rgba(15,17,20,0.28)]'
                : 'shadow-[0_1px_2px_rgba(15,17,20,0.04),0_12px_36px_-18px_rgba(15,17,20,0.22)]'
          }
          ${starting ? 'scale-[0.985] opacity-60' : ''}`}
      >
        <label htmlFor="what-happened" className="sr-only">
          Describe what happened
        </label>
        <textarea
          id="what-happened"
          ref={areaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) start()
          }}
          placeholder="Start typing, drop a photo, or press record…"
          rows={3}
          className="focus-inset w-full resize-none rounded-t-2xl bg-transparent px-5 pt-5 text-[16px]
            leading-relaxed text-ink-900 placeholder:text-ink-300 focus:outline-none
            sm:px-7 sm:pt-7 sm:text-[17px]"
        />

        {recording && <RecordingStrip onStop={() => setRecording(false)} />}

        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-5 pb-1 pt-1 sm:gap-2.5 sm:px-7">
            {attachments.map(a => (
              <AttachmentChip
                key={a.id}
                attachment={a}
                onRemove={() => setAttachments(list => list.filter(x => x.id !== a.id))}
              />
            ))}
          </div>
        )}

        {/* A hairline separates intake from action without making two boxes. */}
        <div className="mx-5 mt-3 sm:mx-7">
          <Rule />
        </div>

        <div className="flex flex-wrap items-center gap-2 p-3 sm:gap-2 sm:p-4">
          <ComposerTool
            icon={<Icon.camera size={16} />}
            label="Photo"
            longLabel="Photo or video"
            onClick={() => {
              addPhotos()
              notify('Evidence attached')
            }}
          />
          <ComposerTool
            icon={recording ? <Icon.pause size={16} /> : <Icon.mic size={16} />}
            label={recording ? 'Stop' : 'Voice'}
            longLabel={recording ? 'Stop' : 'Record voice'}
            active={recording}
            onClick={() => setRecording(r => !r)}
          />

          <div className="ml-auto flex w-full items-center gap-3 sm:w-auto">
            <span
              className={`hidden text-[12px] text-ink-400 transition-opacity lg:inline
                ${hasContent ? 'opacity-100' : 'opacity-0'}`}
            >
              <kbd className="font-data">⌘↵</kbd> to start
            </span>
            <Button
              size="md"
              onClick={start}
              disabled={!hasContent}
              iconEnd={<Icon.arrow size={16} />}
              className="w-full sm:w-auto"
            >
              Start a case
            </Button>
          </div>
        </div>
      </div>

      <div className="a-up d4 mt-4 flex flex-col gap-x-6 gap-y-2.5 sm:mt-5 sm:flex-row sm:flex-wrap sm:items-center">
        {!hasContent && <TextLink onClick={loadExample}>Use the kitchen sink example</TextLink>}
        <TextLink tone="muted" onClick={() => navigate('/professionals')}>
          Browse services instead
        </TextLink>
        <span className="flex items-start gap-1.5 text-[12.5px] leading-relaxed text-ink-400">
          <Icon.shield size={13} className="mt-0.5 shrink-0" />
          Nothing is shared with a professional until you choose one
        </span>
      </div>

      <HowItWorks />
    </section>
  )
}

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function ComposerTool({
  icon,
  label,
  longLabel,
  onClick,
  active,
}: {
  icon: React.ReactNode
  label: string
  longLabel: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={longLabel}
      className={`tap inline-flex h-10 items-center gap-2 rounded-[10px] px-3 text-[13px] font-medium
        transition-colors duration-150 sm:px-3.5
        ${active ? 'bg-danger-100 text-danger-700' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'}`}
    >
      {icon}
      <span className="sm:hidden">{label}</span>
      <span className="hidden sm:inline">{longLabel}</span>
    </button>
  )
}

function RecordingStrip({ onStop }: { onStop: () => void }) {
  return (
    <div className="mx-5 mb-1 mt-1 flex items-center gap-3 rounded-xl bg-danger-100/60 px-3 py-2.5 sm:mx-7 sm:gap-4 sm:px-4 sm:py-3">
      <span className="flex shrink-0 items-center gap-2 text-[12.5px] font-medium text-danger-700">
        <StatusDot tone="danger" pulse />
        Recording
      </span>
      <span className="flex h-6 min-w-0 flex-1 items-end gap-[3px] overflow-hidden" aria-hidden="true">
        {Array.from({ length: 22 }, (_, i) => (
          <span
            key={i}
            className="w-[3px] shrink-0 rounded-full bg-danger-700/45"
            style={{
              height: `${6 + Math.abs(Math.sin(i * 1.7)) * 18}px`,
              animation: `softPulse ${0.6 + (i % 5) * 0.14}s ease-in-out ${i * 0.03}s infinite`,
            }}
          />
        ))}
      </span>
      <button
        type="button"
        onClick={onStop}
        className="shrink-0 text-[12.5px] font-medium text-ink-600 hover:text-ink-900"
      >
        Stop
      </button>
    </div>
  )
}

function AttachmentChip({ attachment, onRemove }: { attachment: Attachment; onRemove: () => void }) {
  return (
    <span className="a-up group relative flex items-center gap-2.5 rounded-xl bg-ink-100 py-1.5 pl-1.5 pr-3">
      {attachment.src ? (
        <img src={attachment.src} alt="" className="h-9 w-11 rounded-lg object-cover" />
      ) : (
        <span className="flex h-9 w-11 items-center justify-center rounded-lg bg-teal-100 text-teal-800">
          <Icon.mic size={15} />
        </span>
      )}
      <span className="max-w-[38vw] truncate text-[12.5px] font-medium text-ink-700 sm:max-w-none">
        {attachment.label}
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-1 text-ink-400 transition-colors hover:bg-ink-200 hover:text-ink-900"
        aria-label={`Remove ${attachment.label}`}
      >
        <Icon.close size={12} />
      </button>
    </span>
  )
}

/** The product's spine, stated once. Four numbered movements, not four cards. */
function HowItWorks() {
  const steps = [
    { n: 'Understand', body: 'We separate what is known from what is still unknown.' },
    { n: 'Decide', body: 'A recommended next step, with the reasoning shown.' },
    { n: 'Agree', body: 'Compare scope, not only price. Then a written agreement.' },
    { n: 'Prove', body: 'Every decision and photo lands in a permanent record.' },
  ]
  return (
    <div className="mt-2 lg:mt-6">
      <Rule />
      <Eyebrow className="mb-5 mt-7 sm:mb-6 sm:mt-9">How a case moves</Eyebrow>
      <ol className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 sm:gap-y-8 lg:grid-cols-4 xl:gap-x-14">
        {steps.map((s, i) => (
          <li key={s.n} className="a-up flex gap-4 sm:block" style={{ animationDelay: `${0.05 * i}s` }}>
            <span className="font-data mt-1 shrink-0 text-[11px] text-ink-300 sm:mt-0">0{i + 1}</span>
            <div className="min-w-0">
              <p className="font-display text-[19px] text-ink-900 sm:mt-1.5">{s.n}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-500">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Context rail — what is happening in this home right now
//
// Three registers, deliberately not three matching card stacks: the live case
// is a solid object, what needs a decision is set larger with its reason, and
// what is already settled recedes into quiet mono-dated rows.
// ════════════════════════════════════════════════════════════════════════════

function ContextRail() {
  const needsYou = CASES.filter(c => c.attention === 'needs-you')
  const active = CASES.filter(c => c.attention === 'active')
  const resolved = CASES.filter(c => c.attention === 'resolved').slice(0, 2)

  return (
    <aside aria-label="Your home right now" className="a-rail d3 lg:pt-[5.5rem]">
      {active.map(c => (
        <ActiveCase key={c.id} title={c.title} pro={c.pro ?? ''} to={c.route} />
      ))}

      {needsYou.length > 0 && (
        <section className="mb-8">
          <Eyebrow tone="gold" className="mb-3">
            Needs your decision
          </Eyebrow>
          {needsYou.map(c => (
            <DecisionRow key={c.id} to={c.route} title={c.title} reason={c.attentionReason ?? c.status} />
          ))}
        </section>
      )}

      <section className="mb-8">
        <Eyebrow className="mb-1">Recently resolved</Eyebrow>
        <Rule />
        {resolved.map(c => (
          <QuietRow key={c.id} to={c.route} title={c.title} meta={c.status} resolved />
        ))}
      </section>

      <section className="mb-2">
        <div className="mb-1 flex items-center justify-between gap-4">
          <Eyebrow>Your home</Eyebrow>
          <TextLink tone="muted" onClick={() => navigate('/ledger')}>
            Home Ledger
          </TextLink>
        </div>
        <Rule />
        {LEDGER.slice(0, 3).map(a => (
          <QuietRow
            key={a.id}
            to={`/ledger?asset=${a.id}`}
            title={`${a.area} · ${a.name}`}
            meta={`Last serviced ${a.lastService}`}
            accent={
              a.warrantyUntil ? (
                <Tooltip label={`Warranty or certificate valid until ${a.warrantyUntil}`}>
                  <span className="flex items-center gap-1 text-[11.5px] font-medium text-success-700">
                    <Icon.shield size={12} />
                    Covered
                  </span>
                </Tooltip>
              ) : undefined
            }
          />
        ))}
      </section>
    </aside>
  )
}

const STAGE_LABEL = [
  'Understanding the problem',
  'Choosing a professional',
  'Reviewing quotes',
  'Agreement approved',
  'Repair underway',
  'Change request decided',
  'Repair complete',
  'Resolved',
]

/** The one solid object on the page. A live case outranks everything else. */
function ActiveCase({ title, pro, to }: { title: string; pro: string; to: string }) {
  // The same derived step the proof timeline uses, so the two never disagree.
  const { step } = useStore()
  const status = STAGE_LABEL[step]
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="group mb-8 block w-full rounded-2xl bg-ink-950 p-5 text-left transition-transform
        duration-200 hover:-translate-y-0.5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <Eyebrow tone="light">Active case</Eyebrow>
        <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-teal-400">
          <StatusDot tone="teal" pulse />
          Live
        </span>
      </div>
      <p className="mt-3 font-display text-[24px] leading-tight text-white sm:text-[26px]">{title}</p>
      <p className="mt-1.5 text-[13px] text-white/45">
        {pro} · {status}
      </p>

      <div className="mt-5 flex items-center gap-3">
        <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/12">
          <span
            className="a-draw block h-full rounded-full bg-teal-400"
            style={{ width: `${Math.max(8, (step / 7) * 100)}%` }}
          />
        </span>
        <span className="font-data shrink-0 text-[11px] text-white/40">Step {step + 1} of 8</span>
      </div>

      <span
        className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-white/80
          transition-colors group-hover:text-white"
      >
        Open the record
        <Icon.arrow size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </button>
  )
}

/** Set larger than the rows below it, because it is asking for something. */
function DecisionRow({ title, reason, to }: { title: string; reason: string; to: string }) {
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="group block w-full rounded-xl border-l-2 border-gold-500 bg-gold-100/50 py-3.5 pl-4 pr-3
        text-left transition-colors hover:bg-gold-100"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[15.5px] font-semibold leading-snug text-ink-950">{title}</p>
        <Pill tone="gold" className="mt-0.5 shrink-0">
          Decide
        </Pill>
      </div>
      <p className="mt-1 text-[12.5px] leading-relaxed text-ink-600">{reason}</p>
      <span className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-gold-600">
        Compare them
        <Icon.arrow size={13} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  )
}

/** Settled or reference information. Compact on purpose. */
function QuietRow({
  title,
  meta,
  to,
  accent,
  resolved,
}: {
  title: string
  meta: string
  to: string
  accent?: React.ReactNode
  resolved?: boolean
}) {
  return (
    <>
      <button
        type="button"
        onClick={() => navigate(to)}
        className="group flex w-full items-center gap-3 py-3 text-left transition-colors"
      >
        {resolved && <Icon.check size={14} className="shrink-0 text-success-700" />}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13.5px] font-medium text-ink-900 transition-colors group-hover:text-teal-800">
            {title}
          </span>
          <span className="mt-0.5 block truncate text-[12px] text-ink-400">{meta}</span>
        </span>
        {accent}
        <Icon.chevronRight
          size={15}
          className="shrink-0 text-ink-300 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-ink-600"
        />
      </button>
      <Rule />
    </>
  )
}

/** Small helper used by the ledger rail — kept here so Home owns its own money format. */
export { Money }
