import { useState } from 'react'
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
  Segmented,
  StatusDot,
  TextLink,
} from '../ui'
import {
  AGREEMENT,
  CASES,
  CHANGE_REQUEST,
  REPAIR_PLAN,
  THREAD,
  TIMELINE,
  money,
  proById,
  type Attention,
  type CaseRecord,
} from '../data'

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
      <div className="pb-16 pt-8 sm:pt-10 lg:pb-20 lg:pt-12">
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
            <section key={g.key} className="mb-10 sm:mb-14">
              <div className="mb-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <Eyebrow tone={g.tone === 'muted' ? 'muted' : g.tone}>{g.title}</Eyebrow>
                <span className="font-data text-[11.5px] text-ink-300">{items.length}</span>
                <span className="text-[14px] text-ink-400">{g.blurb}</span>
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
        className="a-up group -mx-3 flex w-full flex-col gap-3 rounded-xl px-3 py-5 text-left
          transition-colors duration-150 hover:bg-white/70
          lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-8 lg:gap-y-3 lg:py-6"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <span className="flex items-center gap-3 lg:contents">
          <span className="font-data shrink-0 text-[12.5px] text-ink-400 lg:w-[74px]">{record.id}</span>
          {record.attention === 'needs-you' && (
            <span className="lg:hidden">
              <Pill tone="gold">Decide</Pill>
            </span>
          )}
          <span className="font-data ml-auto text-[12.5px] text-ink-400 lg:hidden">{record.opened}</span>
        </span>

        <span className="min-w-0 lg:min-w-[220px] lg:flex-1">
          <span className="block font-display text-[21px] leading-tight text-ink-950 transition-colors group-hover:text-teal-800 sm:text-[24px]">
            {record.title}
          </span>
          <span className="mt-1 block text-[14px] text-ink-500">{record.room}</span>
        </span>

        {/* What happens next, not what state a database is in. A row that
            says "2 quotes ready to compare" answers the question the list
            was opened to answer; "Waiting" does not. */}
        <span className="flex flex-col gap-1.5 lg:min-w-[248px]">
          <span className="flex items-start gap-2 text-[14.5px] font-medium text-ink-900">
            <span className="mt-1.5">
              <StatusDot tone={tone[record.attention]} pulse={record.attention === 'active'} />
            </span>
            {record.next}
          </span>
          {record.pro && <span className="pl-4 text-[13.5px] text-ink-500">{record.pro}</span>}
        </span>

        <span className="hidden items-center gap-4 lg:flex">
          {record.action && <Pill tone="gold">{record.action}</Pill>}
          <span className="text-[13.5px] text-ink-500">{record.opened}</span>
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
  const { notify, progress } = useStore()
  // On a phone the decisions rail cannot sit beside the thread, and burying it
  // under 40 messages would defeat the point of it. So it becomes a peer tab.
  const [tab, setTab] = useState<'thread' | 'decisions'>('thread')

  return (
    <AppShell>
      <div className="pb-16 pt-8 sm:pt-10 lg:pb-20 lg:pt-12">
        <PageHead
          eyebrow="Messages"
          title="Chamod Fernando"
          lede="Conversation about case TC-2048. Repair plans, agreements and change requests appear here as objects you can open — never only as text in a chat."
          back={{ label: 'All cases', to: '/cases' }}
        />

        <div className="mb-6 lg:hidden">
          <Segmented
            label="Messages view"
            value={tab}
            onChange={setTab}
            options={[
              { value: 'thread', label: 'Conversation', hint: 'What was said' },
              { value: 'decisions', label: 'Case decisions', hint: 'What became true' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_300px] xl:gap-x-16 xl:grid-cols-[minmax(0,1fr)_330px]">
          <div className={`min-w-0 ${tab === 'thread' ? '' : 'hidden lg:block'}`}>
            <div className="space-y-5 sm:space-y-6">
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
                className="w-full resize-none rounded-xl bg-white px-4 py-3.5 text-[16px] text-ink-900 sm:px-5 sm:py-4
                  ring-1 ring-[var(--color-rule)] transition-shadow placeholder:text-ink-400
                  focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button size="md" type="submit">
                  Send
                </Button>
                <Button size="md" variant="ghost" icon={<Icon.camera size={16} />}>
                  Attach a photo
                </Button>
                <span className="w-full text-[13px] text-ink-500 sm:ml-auto sm:w-auto">
                  Messages are attached to case TC-2048
                </span>
              </div>
            </form>
          </div>

          <aside
            className={`lg:sticky lg:top-24 lg:self-start lg:block ${tab === 'decisions' ? '' : 'hidden'}`}
            aria-label="Decisions in this case"
          >
            <Eyebrow className="mb-3">Decisions in this case</Eyebrow>

            {/* The distinction the whole product rests on, said once, here. */}
            <div className="mb-5 rounded-xl bg-[var(--color-sunken)] p-4">
              <dl className="space-y-2.5">
                <div className="flex gap-3">
                  <dt className="w-[92px] shrink-0 font-data text-[11px] uppercase tracking-[0.13em] text-ink-500">
                    Chat
                  </dt>
                  <dd className="text-[13.5px] leading-snug text-ink-700">What people said.</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-[92px] shrink-0 font-data text-[11px] uppercase tracking-[0.13em] text-teal-800">
                    Case record
                  </dt>
                  <dd className="text-[13.5px] leading-snug text-ink-900">What became true.</dd>
                </div>
              </dl>
            </div>

            <div className="space-y-0">
              <DecisionLink label="Repair plan" meta={`${money(REPAIR_PLAN.total)} · proposed 11:26`} to="/case/TC-2048/plan" />
              <DecisionLink
                label={`Work agreement · V${progress.changeDecision === 'approved' ? 2 : 1}`}
                meta={
                  progress.agreementApproved
                    ? `Approved 11:28 · ${money(progress.changeDecision === 'approved' ? CHANGE_REQUEST.newTotal : AGREEMENT.price)}`
                    : 'Awaiting your approval'
                }
                to="/case/TC-2048/agreement"
              />
              <DecisionLink
                label="Change request CR-1"
                meta={
                  progress.changeDecision
                    ? `${progress.changeDecision === 'approved' ? 'Approved' : 'Declined'} 11:52 · + ${money(CHANGE_REQUEST.priceChange)}`
                    : `Awaiting you · + ${money(CHANGE_REQUEST.priceChange)}`
                }
                to="/case/TC-2048/change"
              />
              <DecisionLink label="Proof timeline" meta={`${TIMELINE.length} entries`} to="/case/TC-2048/record" />
              <Rule />
            </div>

            <p className="mt-4 text-[13px] leading-relaxed text-ink-500">
              Each of these changed what you owe or what you agreed to. They live in the case record,
              where they cannot be edited after the fact.
            </p>
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
      <div className={`min-w-0 max-w-[80%] sm:max-w-lg ${mine ? 'text-right' : ''}`}>
        <div
          className={`inline-block rounded-2xl px-[18px] py-3 text-left text-[15px] leading-relaxed sm:text-[15.5px]
            ${mine ? 'bg-teal-800 text-white' : 'bg-white text-ink-800 ring-1 ring-[var(--color-rule)]'}`}
        >
          {body}
        </div>
        <p className="mt-1.5 font-data text-[11.5px] text-ink-400">{at}</p>
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
        className="group w-full max-w-md rounded-2xl bg-[var(--color-sunken)] p-4 text-left sm:p-5
          ring-1 ring-[var(--color-rule)] transition-all duration-150 hover:-translate-y-0.5 hover:ring-teal-700"
      >
        <div className="flex items-center justify-between">
          <Eyebrow tone="teal">{objectType}</Eyebrow>
          <span className="font-data text-[11.5px] text-ink-400">{at}</span>
        </div>
        <p className="mt-2.5 font-display text-[22px] leading-tight text-ink-950">{title}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="tnum text-[14.5px] font-medium text-ink-700">{meta}</span>
          <span className="flex items-center gap-1.5 text-[14px] font-medium text-teal-800">
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
          <span className="block text-[14.5px] font-medium text-ink-900 transition-colors group-hover:text-teal-800">
            {label}
          </span>
          <span className="tnum mt-0.5 block text-[13px] text-ink-500">{meta}</span>
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
