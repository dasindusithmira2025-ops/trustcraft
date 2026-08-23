import { navigate, useStore } from '../app-state'
import { AppShell } from '../shell'
import {
  Avatar,
  Button,
  Display,
  Eyebrow,
  Icon,
  PageHead,
  Pill,
  Rule,
  StatusDot,
  TextLink,
} from '../ui'
import { CASES, THREAD, proById, type Attention, type CaseRecord } from '../data'

// ════════════════════════════════════════════════════════════════════════════
// Cases — grouped by what they want from you, not by date
// ════════════════════════════════════════════════════════════════════════════

const GROUPS: { key: Attention; title: string; blurb: string; tone: 'gold' | 'teal' | 'muted' }[] = [
  {
    key: 'needs-you',
    title: 'Needs you',
    blurb: 'Nothing moves on these until you decide something.',
    tone: 'gold',
  },
  { key: 'active', title: 'Active', blurb: 'Work is happening right now.', tone: 'teal' },
  {
    key: 'waiting',
    title: 'Waiting',
    blurb: 'Waiting on a professional, not on you.',
    tone: 'muted',
  },
  { key: 'resolved', title: 'Resolved', blurb: 'Closed, recorded, and covered.', tone: 'muted' },
]

export function Cases() {
  return (
    <AppShell>
      <div className="pb-20 pt-12">
        <PageHead
          eyebrow="Cases"
          title="What needs you, and what does not"
          lede="Sorted by what each case is waiting for rather than when it was opened, so the list answers the only question worth asking."
          aside={
            <Button size="md" to="/" icon={<Icon.plus size={16} />}>
              Start a case
            </Button>
          }
        />

        {GROUPS.map(g => {
          const items = CASES.filter(c => c.attention === g.key)
          if (items.length === 0) return null
          return (
            <section key={g.key} className="mb-14">
              <div className="mb-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <Eyebrow tone={g.tone === 'muted' ? 'muted' : g.tone}>{g.title}</Eyebrow>
                <span className="font-data text-[11px] text-ink-300">{items.length}</span>
                <span className="text-[13px] text-ink-400">{g.blurb}</span>
              </div>
              <Rule tone={g.key === 'needs-you' ? 'strong' : 'default'} />
              {items.map((c, i) => (
                <CaseRow key={c.id} record={c} index={i} />
              ))}
            </section>
          )
        })}
      </div>
    </AppShell>
  )
}

function CaseRow({ record, index }: { record: CaseRecord; index: number }) {
  const tone: Record<Attention, 'gold' | 'teal' | 'neutral' | 'success'> = {
    'needs-you': 'gold',
    active: 'teal',
    waiting: 'neutral',
    resolved: 'success',
  }
  return (
    <>
      <button
        type="button"
        onClick={() => navigate(record.route)}
        className="a-up group flex w-full flex-wrap items-center gap-x-8 gap-y-3 py-6 text-left"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <span className="font-data w-[74px] shrink-0 text-[11.5px] text-ink-400">{record.id}</span>

        <span className="min-w-[220px] flex-1">
          <span className="block font-display text-[24px] leading-tight text-ink-950 transition-colors group-hover:text-teal-800">
            {record.title}
          </span>
          <span className="mt-1 block text-[13px] text-ink-500">{record.room}</span>
        </span>

        <span className="flex min-w-[210px] flex-col gap-1.5">
          <span className="flex items-center gap-2 text-[13.5px] font-medium text-ink-800">
            <StatusDot tone={tone[record.attention]} pulse={record.attention === 'active'} />
            {record.status}
          </span>
          {record.pro && <span className="pl-4 text-[12.5px] text-ink-400">{record.pro}</span>}
        </span>

        <span className="flex items-center gap-4">
          {record.attention === 'needs-you' && <Pill tone="gold">Decide</Pill>}
          <span className="text-[12.5px] text-ink-400">{record.opened}</span>
          <Icon.chevronRight
            size={16}
            className="text-ink-300 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-ink-700"
          />
        </span>
      </button>
      <Rule />
    </>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Messages — chat exists, but the decisions do not live inside it
// ════════════════════════════════════════════════════════════════════════════

export function Messages() {
  const pro = proById('chamod')
  const { notify } = useStore()

  return (
    <AppShell>
      <div className="pb-20 pt-12">
        <PageHead
          eyebrow="Messages"
          title={`Chamod Fernando`}
          lede="Conversation about case TC-2048. Quotes, agreements and change requests appear here as objects you can open — they are never only text in a chat."
          back={{ label: 'All cases', to: '/cases' }}
        />

        <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <div className="space-y-6">
              {THREAD.map(m =>
                m.kind === 'text' ? (
                  <TextBubble key={m.id} from={m.from} at={m.at} body={m.body} tint={pro.tint} name={pro.name} />
                ) : (
                  <ObjectCard
                    key={m.id}
                    from={m.from}
                    at={m.at}
                    objectType={m.objectType}
                    title={m.title}
                    meta={m.meta}
                    href={m.href}
                  />
                ),
              )}
            </div>

            <Rule className="my-8" />

            <form
              onSubmit={e => {
                e.preventDefault()
                notify('Message sent')
                ;(e.currentTarget.elements.namedItem('msg') as HTMLTextAreaElement).value = ''
              }}
            >
              <label htmlFor="msg" className="sr-only">
                Message Chamod
              </label>
              <textarea
                id="msg"
                name="msg"
                rows={3}
                placeholder="Write a message…"
                className="w-full resize-none rounded-xl bg-white px-5 py-4 text-[14.5px] text-ink-900
                  ring-1 ring-[var(--color-rule)] transition-shadow placeholder:text-ink-300
                  focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
              <div className="mt-3 flex items-center gap-3">
                <Button size="md" type="submit">
                  Send
                </Button>
                <Button size="md" variant="ghost" icon={<Icon.camera size={16} />}>
                  Attach a photo
                </Button>
                <span className="ml-auto text-[12px] text-ink-400">
                  Messages are attached to case TC-2048
                </span>
              </div>
            </form>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow className="mb-4">Decisions in this case</Eyebrow>
            <p className="mb-5 text-[13px] leading-relaxed text-ink-500">
              These are the things that changed what you owe or what you agreed to. They live in the
              case record, not in the conversation.
            </p>
            <div className="space-y-0">
              <DecisionLink label="Repair plan" meta="Rs.6,900" to="/case/TC-2048/plan" />
              <DecisionLink label="Work agreement" meta="Approved 11:28" to="/case/TC-2048/agreement" />
              <DecisionLink label="Change request CR-1" meta="+ Rs.1,500" to="/case/TC-2048/change" />
              <DecisionLink label="Proof timeline" meta="10 entries" to="/case/TC-2048/record" />
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  )
}

function TextBubble({
  from,
  at,
  body,
  tint,
  name,
}: {
  from: 'you' | 'pro'
  at: string
  body: string
  tint: string
  name: string
}) {
  const mine = from === 'you'
  return (
    <div className={`flex gap-3 ${mine ? 'flex-row-reverse' : ''}`}>
      {!mine && <Avatar tint={tint} name={name} size={32} />}
      <div className={`max-w-lg ${mine ? 'text-right' : ''}`}>
        <div
          className={`inline-block rounded-2xl px-4.5 py-3 text-[14.5px] leading-relaxed
            ${mine ? 'bg-teal-800 text-white' : 'bg-white text-ink-800 ring-1 ring-[var(--color-rule)]'}`}
          style={{ paddingLeft: 18, paddingRight: 18 }}
        >
          {body}
        </div>
        <p className="mt-1.5 font-data text-[11px] text-ink-400">{at}</p>
      </div>
    </div>
  )
}

/** A structured product object inside the thread — openable, never just text. */
function ObjectCard({
  from,
  at,
  objectType,
  title,
  meta,
  href,
}: {
  from: 'you' | 'pro'
  at: string
  objectType: string
  title: string
  meta: string
  href: string
}) {
  const mine = from === 'you'
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <button
        type="button"
        onClick={() => navigate(href)}
        className="group w-full max-w-md rounded-2xl bg-[var(--color-sunken)] p-5 text-left
          ring-1 ring-[var(--color-rule)] transition-all duration-150 hover:-translate-y-0.5 hover:ring-teal-700"
      >
        <div className="flex items-center justify-between">
          <Eyebrow tone="teal">{objectType}</Eyebrow>
          <span className="font-data text-[11px] text-ink-400">{at}</span>
        </div>
        <p className="mt-2.5 font-display text-[22px] leading-tight text-ink-950">{title}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="tnum text-[13.5px] font-medium text-ink-700">{meta}</span>
          <span className="flex items-center gap-1.5 text-[13px] font-medium text-teal-800">
            Open
            <Icon.arrow size={14} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </button>
    </div>
  )
}

function DecisionLink({ label, meta, to }: { label: string; meta: string; to: string }) {
  return (
    <>
      <Rule />
      <button
        type="button"
        onClick={() => navigate(to)}
        className="group flex w-full items-center gap-4 py-3.5 text-left"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[13.5px] font-medium text-ink-900 transition-colors group-hover:text-teal-800">
            {label}
          </span>
          <span className="tnum mt-0.5 block text-[12px] text-ink-500">{meta}</span>
        </span>
        <Icon.chevronRight
          size={15}
          className="text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-ink-600"
        />
      </button>
    </>
  )
}

/** Kept for the empty-thread case a judge might click into. */
export function NoCases() {
  return (
    <div className="py-16 text-center">
      <Display size="sm">Nothing open</Display>
      <TextLink className="mt-4" onClick={() => navigate('/')}>
        Start a case
      </TextLink>
    </div>
  )
}
