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

export default function Home() {
  return (
    <AppShell>
      <div className="grid grid-cols-1 gap-x-16 gap-y-14 pb-6 pt-14 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-x-24">
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
  const [starting, setStarting] = useState(false)
  const areaRef = useRef<HTMLTextAreaElement>(null)

  const hasContent = text.trim().length > 0 || attachments.length > 0

  // Grow with content rather than scrolling inside a fixed box.
  useEffect(() => {
    const el = areaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.max(el.scrollHeight, 132)}px`
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
      <Eyebrow tone="teal" className="a-up mb-5">
        {greeting()}, {USER.name}
      </Eyebrow>

      <Display size="xl" as="h1" className="a-up d1 text-ink-950" >
        What happened?
      </Display>

      <p id="composer-heading" className="a-up d2 mt-5 max-w-lg text-[17px] leading-relaxed text-ink-500">
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
        className={`a-up d3 mt-9 rounded-2xl bg-white transition-all duration-200
          ${
            dragging
              ? 'ring-2 ring-teal-700 ring-offset-2 ring-offset-[var(--color-canvas)]'
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
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) start()
          }}
          placeholder="Start typing, drop a photo, or press record…"
          rows={4}
          className="focus-inset w-full resize-none rounded-t-2xl bg-transparent px-7 pt-7 text-[17px]
            leading-relaxed text-ink-900 placeholder:text-ink-300 focus:outline-none"
        />

        {recording && <RecordingStrip onStop={() => setRecording(false)} />}

        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2.5 px-7 pb-1 pt-1">
            {attachments.map(a => (
              <AttachmentChip
                key={a.id}
                attachment={a}
                onRemove={() => setAttachments(list => list.filter(x => x.id !== a.id))}
              />
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 px-4 pb-4 pt-4">
          <ComposerTool
            icon={<Icon.camera size={16} />}
            label="Photo or video"
            onClick={() => {
              addPhotos()
              notify('Evidence attached')
            }}
          />
          <ComposerTool
            icon={recording ? <Icon.pause size={16} /> : <Icon.mic size={16} />}
            label={recording ? 'Stop' : 'Record voice'}
            active={recording}
            onClick={() => setRecording(r => !r)}
          />

          <div className="ml-auto flex items-center gap-3">
            <span
              className={`text-[12px] text-ink-400 transition-opacity ${hasContent ? 'opacity-100' : 'opacity-0'}`}
            >
              <kbd className="font-data">⌘↵</kbd> to start
            </span>
            <Button size="md" onClick={start} disabled={!hasContent} iconEnd={<Icon.arrow size={16} />}>
              Start a case
            </Button>
          </div>
        </div>
      </div>

      <div className="a-up d4 mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
        {!hasContent && (
          <TextLink onClick={loadExample}>Use the kitchen sink example</TextLink>
        )}
        <TextLink tone="muted" onClick={() => navigate('/professionals')}>
          Browse services instead
        </TextLink>
        <span className="flex items-center gap-1.5 text-[12.5px] text-ink-400">
          <Icon.shield size={13} />
          Nothing is shared with a professional until you choose one
        </span>
      </div>

      <Rule className="mt-14" />

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
  onClick,
  active,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-10 items-center gap-2 rounded-[10px] px-3.5 text-[13px] font-medium
        transition-colors duration-150
        ${
          active
            ? 'bg-danger-100 text-danger-700'
            : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
        }`}
    >
      {icon}
      {label}
    </button>
  )
}

function RecordingStrip({ onStop }: { onStop: () => void }) {
  return (
    <div className="mx-7 mb-1 mt-1 flex items-center gap-4 rounded-xl bg-danger-100/60 px-4 py-3">
      <span className="flex items-center gap-2 text-[12.5px] font-medium text-danger-700">
        <StatusDot tone="danger" pulse />
        Recording
      </span>
      <span className="flex h-6 items-end gap-[3px]" aria-hidden="true">
        {Array.from({ length: 22 }, (_, i) => (
          <span
            key={i}
            className="w-[3px] rounded-full bg-danger-700/45"
            style={{
              height: `${6 + Math.abs(Math.sin(i * 1.7)) * 18}px`,
              animation: `softPulse ${0.6 + (i % 5) * 0.14}s ease-in-out ${i * 0.03}s infinite`,
            }}
          />
        ))}
      </span>
      <span className="font-data text-[12px] text-danger-700/70">Transcribing live</span>
      <button
        type="button"
        onClick={onStop}
        className="ml-auto text-[12.5px] font-medium text-ink-600 hover:text-ink-900"
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
      <span className="text-[12.5px] font-medium text-ink-700">{attachment.label}</span>
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

function HowItWorks() {
  const steps = [
    { n: 'Understand', body: 'We separate what is known from what is still unknown.' },
    { n: 'Decide', body: 'A recommended next step, with the reasoning shown.' },
    { n: 'Agree', body: 'Compare scope, not only price. Then a written agreement.' },
    { n: 'Prove', body: 'Every decision and photo lands in a permanent record.' },
  ]
  return (
    <div className="mt-10">
      <Eyebrow className="mb-6">How a case moves</Eyebrow>
      <ol className="grid grid-cols-2 gap-x-10 gap-y-7 md:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.n} className="a-up" style={{ animationDelay: `${0.05 * i}s` }}>
            <span className="font-data text-[11px] text-ink-300">0{i + 1}</span>
            <p className="mt-1.5 font-display text-[19px] text-ink-900">{s.n}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-500">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Context rail — what is happening in this home right now
// ════════════════════════════════════════════════════════════════════════════

function ContextRail() {
  const needsYou = CASES.filter(c => c.attention === 'needs-you')
  const active = CASES.filter(c => c.attention === 'active')
  const resolved = CASES.filter(c => c.attention === 'resolved').slice(0, 2)

  return (
    <aside aria-label="Your home right now" className="a-rail d3 lg:pt-[4.5rem]">
      {active.map(c => (
        <ActiveCase key={c.id} title={c.title} pro={c.pro ?? ''} to={c.route} />
      ))}

      {needsYou.length > 0 && (
        <RailSection title="Needs your attention" tone="gold">
          {needsYou.map(c => (
            <RailRow
              key={c.id}
              to={c.route}
              title={c.title}
              meta={c.attentionReason ?? c.status}
              accent={<Pill tone="gold">Decide</Pill>}
            />
          ))}
        </RailSection>
      )}

      <RailSection title="Recently resolved">
        {resolved.map(c => (
          <RailRow key={c.id} to={c.route} title={c.title} meta={c.status} />
        ))}
      </RailSection>

      <RailSection title="Your home" action={{ label: 'Home Ledger', to: '/ledger' }}>
        {LEDGER.slice(0, 4).map(a => (
          <RailRow
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
      </RailSection>
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

function ActiveCase({ title, pro, to }: { title: string; pro: string; to: string }) {
  // The same derived step the proof timeline uses, so the two never disagree.
  const { step } = useStore()
  const status = STAGE_LABEL[step]
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="group mb-9 block w-full rounded-2xl bg-ink-950 p-6 text-left transition-transform
        duration-200 hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between">
        <Eyebrow tone="light">Active case</Eyebrow>
        <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-teal-400">
          <StatusDot tone="teal" pulse />
          Live
        </span>
      </div>
      <p className="mt-3 font-display text-[26px] leading-tight text-white">{title}</p>
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
        <span className="font-data text-[11px] text-white/40">Step {step + 1} of 8</span>
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

function RailSection({
  title,
  children,
  action,
  tone,
}: {
  title: string
  children: React.ReactNode
  action?: { label: string; to: string }
  tone?: 'gold'
}) {
  return (
    <section className="mb-9">
      <div className="mb-1 flex items-center justify-between">
        <Eyebrow tone={tone === 'gold' ? 'gold' : 'muted'}>{title}</Eyebrow>
        {action && (
          <TextLink tone="muted" onClick={() => navigate(action.to)}>
            {action.label}
          </TextLink>
        )}
      </div>
      <Rule />
      <div>{children}</div>
    </section>
  )
}

function RailRow({
  title,
  meta,
  to,
  accent,
}: {
  title: string
  meta: string
  to: string
  accent?: React.ReactNode
}) {
  return (
    <>
      <button
        type="button"
        onClick={() => navigate(to)}
        className="group flex w-full items-center gap-4 py-3.5 text-left transition-colors"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-medium text-ink-900 transition-colors group-hover:text-teal-800">
            {title}
          </span>
          <span className="mt-0.5 block truncate text-[12.5px] text-ink-500">{meta}</span>
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
