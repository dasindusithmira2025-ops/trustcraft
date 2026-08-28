import { useState } from 'react'
import { Avatar, Btn, Icon } from '../components/UI'
import { AppBar, Bars, Dock, Meta, Meter, Money, Section, Shot, StepRail, Switch, Tag } from './ui'
import { useW } from './store'
import {
  EARNINGS, LAST_STEP, OPPORTUNITIES, WORKER, money, oppById,
  type Opportunity, type WNav,
} from './data'

// ── Shared pieces ────────────────────────────────────────────────────────────

const HERO = 'linear-gradient(152deg, #0B1220 0%, #16305C 58%, #1E3A8A 128%)'

function JobStrip({ job }: { job: Opportunity }) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar name={job.customer} hue={job.hue} size={34} />
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-ink-900 leading-tight truncate">{job.customer}</p>
        <p className="text-[11px] text-ink-500 truncate">{job.area} · {job.km} km away</p>
      </div>
    </div>
  )
}

function OppCard({ o, onOpen }: { o: Opportunity; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="w-full text-left bg-white border border-ink-200 rounded-2xl p-4 hover:border-brand-200 hover:shadow-[0_8px_24px_-16px_rgba(15,23,42,.5)] transition-all"
    >
      <div className="flex items-center gap-2 mb-2">
        <Tag hue={o.hue}>{o.trade}</Tag>
        {o.urgent && <Tag hue={0} solid>URGENT</Tag>}
        <span className="ml-auto text-[10.5px] font-medium text-ink-400">{o.posted}</span>
      </div>

      <p className="text-[15.5px] font-bold text-ink-900 leading-snug tracking-[-0.01em]">{o.title}</p>
      <p className="text-[12px] text-ink-500 leading-relaxed mt-1 line-clamp-2">{o.summary}</p>

      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-ink-100">
        <Meta icon="user">{o.customer.split(' ')[0]}</Meta>
        <Meta icon="pin">{o.area} · {o.km} km</Meta>
        <span className="ml-auto text-[12px] font-bold text-ink-800 tabular-nums">~ Rs {money(o.budget)}</span>
      </div>
    </button>
  )
}

// ── 1. Home ──────────────────────────────────────────────────────────────────

export function HomeScreen({ go }: WNav) {
  const { w, set, steps, action, unread } = useW()
  const done = steps.filter(s => s.status === 'done').length
  const open = OPPORTUNITIES.filter(o => !w.declined.includes(o.id) && o.id !== w.job.id)

  return (
    <div className="min-h-full flex flex-col bg-ink-50">
      <div className="text-white" style={{ background: HERO }}>
        <AppBar flat unread={unread} onBell={() => go('messages')} avatar={() => go('profile')} />

        <div className="px-5 pb-11 pt-1">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-white/45">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
          </p>
          <h1 className="text-[25px] font-bold tracking-[-0.03em] leading-tight mt-1.5">
            Good morning, {WORKER.name.split(' ')[0]}
          </h1>

          <div className="mt-4 flex items-center gap-3 bg-white/8 ring-1 ring-white/12 rounded-2xl px-3.5 py-2.5">
            <span className={`w-2 h-2 rounded-full ${w.online ? 'bg-success-600 soft-pulse' : 'bg-ink-400'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold leading-tight">{w.online ? 'Accepting jobs' : 'Not accepting jobs'}</p>
              <p className="text-[11px] text-white/50 leading-tight">
                {w.online ? `${open.length} requests near ${WORKER.area.split(',')[0]}` : 'You are hidden from search'}
              </p>
            </div>
            <Switch on={w.online} onChange={v => set({ online: v })} label="Availability" />
          </div>
        </div>
      </div>

      <div className="relative -mt-7 rounded-t-[28px] bg-ink-50 px-5 pt-6 pb-8 flex-1 space-y-7">
        {/* Active job */}
        <section className="fade-up">
          <Section title="Active job" />
          <div className="bg-white border border-ink-200 rounded-2xl overflow-hidden shadow-[0_10px_30px_-24px_rgba(15,23,42,.8)]">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[10.5px] font-bold tracking-[0.1em] text-ink-400">{w.job.id}</p>
                  <p className="text-[17px] font-bold text-ink-900 tracking-[-0.02em] leading-snug mt-0.5">{w.job.title}</p>
                </div>
                <Tag hue={w.job.hue}>{w.job.trade}</Tag>
              </div>

              <div className="mt-3.5"><JobStrip job={w.job} /></div>

              <div className="mt-4">
                <div className="flex items-baseline justify-between mb-1.5">
                  <p className="text-[12px] font-semibold text-ink-700">
                    {w.step >= LAST_STEP ? 'Completed' : action.hint}
                  </p>
                  <p className="text-[11px] font-bold text-ink-400 tabular-nums">{Math.min(done + 1, LAST_STEP)}/{LAST_STEP}</p>
                </div>
                <Meter value={(done / LAST_STEP) * 100} tone={w.step >= LAST_STEP ? 'success' : 'brand'} />
              </div>
            </div>

            <button
              onClick={() => go('job')}
              className="w-full h-12 border-t border-ink-100 text-[14px] font-semibold text-brand-700 hover:bg-brand-50 transition-colors inline-flex items-center justify-center gap-1.5"
            >
              View job progress <Icon name="next" size={15} />
            </button>
          </div>
        </section>

        {/* Opportunities */}
        <section className="fade-up-1">
          <Section title={`New opportunities · ${open.length}`} action="See all" onAction={() => go('opportunities')} />
          <div className="space-y-3">
            {open.slice(0, 2).map(o => (
              <OppCard key={o.id} o={o} onOpen={() => { set({ viewOpp: o.id }); go('request') }} />
            ))}
          </div>
        </section>

        {/* Earnings widget */}
        <section className="fade-up-2">
          <Section title="This month" action="Details" onAction={() => go('earnings')} />
          <div className="rounded-2xl p-4 text-white" style={{ background: HERO }}>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] text-white/50 font-medium">Available balance</p>
                <Money value={EARNINGS.available} size={27} />
              </div>
              <div className="text-right">
                <p className="text-[11px] text-white/50 font-medium">Earned in August</p>
                <p className="text-[15px] font-bold tabular-nums">Rs {money(EARNINGS.month)}</p>
              </div>
            </div>
            <div className="mt-4"><Bars data={EARNINGS.months} height={72} light /></div>
          </div>
        </section>
      </div>
    </div>
  )
}

// ── 2. Opportunities ─────────────────────────────────────────────────────────

const FILTERS = ['All', 'Plumbing', 'Electrical', 'Nearby', 'Urgent']

export function OpportunitiesScreen({ go, back }: WNav) {
  const { w, set } = useW()
  const [f, setF] = useState('All')

  const list = OPPORTUNITIES.filter(o => {
    if (w.declined.includes(o.id)) return false
    if (f === 'Nearby') return o.km <= 4
    if (f === 'Urgent') return !!o.urgent
    if (f === 'All') return true
    return o.trade.includes(f)
  })

  return (
    <div className="min-h-full flex flex-col bg-ink-50">
      <AppBar title="New Opportunities" onBack={back} />

      <div className="sticky top-14 z-20 bg-ink-50/95 backdrop-blur px-5 py-3 border-b border-ink-100">
        <div className="flex gap-2 overflow-x-auto no-scroll">
          {FILTERS.map(x => (
            <button
              key={x}
              onClick={() => setF(x)}
              className={`h-8 px-3.5 rounded-full text-[12px] font-semibold border transition-colors flex-shrink-0 ${
                f === x ? 'bg-ink-900 text-white border-ink-900' : 'bg-white text-ink-600 border-ink-200 hover:border-ink-300'
              }`}
            >
              {x}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 space-y-3 flex-1">
        <p className="text-[11.5px] text-ink-400 font-medium">
          {list.length} request{list.length === 1 ? '' : 's'} matched to your trades and area
        </p>
        {list.map((o, i) => (
          <div key={o.id} className={i < 4 ? `fade-up-${i}` : 'fade-up'}>
            <OppCard o={o} onOpen={() => { set({ viewOpp: o.id }); go('request') }} />
          </div>
        ))}
        {list.length === 0 && (
          <div className="text-center py-16 text-ink-400">
            <Icon name="search" size={26} />
            <p className="text-[13px] font-medium mt-2">Nothing matches this filter right now.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── 3. Service request detail ────────────────────────────────────────────────

export function RequestScreen({ go, back }: WNav) {
  const { w, accept, decline } = useW()
  const o = oppById(w.viewOpp)

  return (
    <div className="min-h-full flex flex-col bg-white">
      <AppBar title="Service Request" onBack={back} />

      <div className="flex-1">
        {/* Hero */}
        <div className="px-5 pt-5 pb-5 border-b border-ink-100">
          <div className="flex items-center gap-2">
            <span className="text-[10.5px] font-bold tracking-[0.1em] text-brand-700 bg-brand-50 px-2 py-1 rounded-md">{o.id}</span>
            {o.urgent && <Tag hue={0} solid>URGENT</Tag>}
            <span className="ml-auto text-[11px] text-ink-400 font-medium">{o.posted}</span>
          </div>
          <h1 className="text-[24px] font-bold text-ink-900 tracking-[-0.03em] leading-tight mt-2.5">{o.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Tag hue={o.hue}>{o.trade}</Tag>
            <Meta icon="pin">{o.km} km from you</Meta>
          </div>
        </div>

        <div className="px-5 py-5 space-y-6">
          {/* Customer */}
          <div className="flex items-center gap-3">
            <Avatar name={o.customer} hue={o.hue} size={42} badge />
            <div className="flex-1 min-w-0">
              <p className="text-[14.5px] font-semibold text-ink-900 leading-tight">{o.customer}</p>
              <p className="text-[11.5px] text-ink-500">Verified customer · 4 past jobs</p>
            </div>
            <button
              onClick={() => go('chat')}
              className="w-10 h-10 rounded-full border border-ink-200 flex items-center justify-center text-ink-600 hover:bg-ink-50"
              aria-label="Message customer"
            >
              <Icon name="chat" size={18} />
            </button>
          </div>

          {/* Description */}
          <section>
            <Section title="In the customer's words" />
            <p className="text-[14px] text-ink-800 leading-relaxed border-l-[3px] border-brand-200 pl-3.5">{o.summary}</p>
          </section>

          {/* AI read */}
          <section>
            <div className="rounded-2xl bg-brand-50 border border-brand-100 p-4">
              <div className="flex items-center gap-1.5 text-brand-700 mb-2">
                <Icon name="sparkle" size={14} />
                <p className="text-[11px] font-bold tracking-[0.1em] uppercase">TrustCraft read of the problem</p>
              </div>
              <p className="text-[13px] text-ink-800 leading-relaxed">
                Most likely a failed trap seal or worn compression washer. Photos show staining on the cabinet base,
                so check for swelling before you quote replacement carpentry.
              </p>
              <p className="text-[11px] text-ink-500 mt-2.5 leading-relaxed">
                A suggestion only — your on-site judgement decides the job.
              </p>
            </div>
          </section>

          {/* Photos */}
          <section>
            <Section title="Photos from the customer" />
            <div className="grid grid-cols-3 gap-2">
              <Shot h={86} hue={o.hue} label="Under sink" />
              <Shot h={86} hue={o.hue + 20} label="Cabinet" />
              <Shot h={86} hue={o.hue - 20} label="Tap" />
            </div>
          </section>

          {/* Location */}
          <section>
            <Section title="Location" />
            <div className="rounded-2xl overflow-hidden border border-ink-200">
              <div
                className="h-32 relative"
                style={{
                  background:
                    'repeating-linear-gradient(0deg,#E8EDF4 0 1px,transparent 1px 22px),repeating-linear-gradient(90deg,#E8EDF4 0 1px,transparent 1px 22px),#F4F7FB',
                }}
              >
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full text-danger-600">
                  <Icon name="pin" size={30} fill />
                </span>
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-brand-600/10 ring-1 ring-brand-200" />
              </div>
              <div className="flex items-center gap-2 px-4 py-3 bg-white">
                <Icon name="pin" size={15} />
                <p className="text-[13px] font-medium text-ink-800 flex-1">{o.area}</p>
                <span className="text-[12px] font-semibold text-ink-500 tabular-nums">{o.km} km · ~12 min</span>
              </div>
            </div>
            <p className="text-[11px] text-ink-400 mt-2">Exact address is released once you accept.</p>
          </section>

          {/* Schedule + budget */}
          <section className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-ink-200 p-3.5">
              <div className="text-ink-400 mb-1.5"><Icon name="calendar" size={16} /></div>
              <p className="text-[11px] text-ink-500 font-medium">Preferred window</p>
              <p className="text-[13px] font-semibold text-ink-900 leading-snug mt-0.5">{o.window}</p>
            </div>
            <div className="rounded-2xl border border-ink-200 p-3.5">
              <div className="text-ink-400 mb-1.5"><Icon name="wallet" size={16} /></div>
              <p className="text-[11px] text-ink-500 font-medium">Customer expects</p>
              <p className="text-[13px] font-semibold text-ink-900 leading-snug mt-0.5">around Rs {money(o.budget)}</p>
            </div>
          </section>
        </div>
      </div>

      <Dock>
        <div className="flex gap-3">
          <Btn variant="ghost" onClick={() => { decline(o.id); back() }} className="!text-danger-700">Reject</Btn>
          <Btn onClick={() => { accept(o); go('accepted') }}>Accept Opportunity</Btn>
        </div>
        <p className="text-[10.5px] text-ink-400 text-center mt-2.5">
          Accepting locks your response time into your trust score.
        </p>
      </Dock>
    </div>
  )
}

// ── 4. Accepted ──────────────────────────────────────────────────────────────

const NEXT_UP = [
  { icon: 'search', title: 'Analyse the problem', body: 'Review the photos and share what you think is wrong.' },
  { icon: 'calendar', title: 'Inspect on site', body: 'Confirm the cause in person during the agreed window.' },
  { icon: 'doc', title: 'Send a quotation', body: 'Itemise parts and labour so the price is never a surprise.' },
]

export function AcceptedScreen({ go }: WNav) {
  const { w } = useW()
  return (
    <div className="min-h-full flex flex-col bg-white">
      <div className="flex-1 flex flex-col items-center px-6 pt-16">
        <div className="relative scale-in">
          <span className="absolute inset-0 rounded-full bg-success-100 scale-150 soft-pulse" />
          <div className="relative w-[86px] h-[86px] rounded-full bg-success-600 text-white flex items-center justify-center shadow-[0_16px_36px_-14px_rgba(22,163,74,.7)]">
            <Icon name="check" size={40} />
          </div>
        </div>

        <h1 className="text-[25px] font-bold text-ink-900 tracking-[-0.03em] mt-7 text-center fade-up-1">
          Opportunity accepted
        </h1>
        <p className="text-[14px] text-ink-500 leading-relaxed text-center mt-2 max-w-[290px] fade-up-1">
          {w.job.customer.split(' ')[0]} has been notified. The full address and contact number are now unlocked for you.
        </p>

        <div className="w-full mt-8 space-y-2.5 fade-up-2">
          <Section title="What happens next" />
          {NEXT_UP.map((s, i) => (
            <div key={s.title} className="flex gap-3 bg-ink-50 rounded-2xl p-3.5">
              <div className="w-9 h-9 rounded-xl bg-white border border-ink-200 flex items-center justify-center text-brand-700 flex-shrink-0">
                <Icon name={s.icon} size={17} />
              </div>
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold text-ink-900 leading-tight">
                  <span className="text-ink-400 tabular-nums">{i + 1}. </span>{s.title}
                </p>
                <p className="text-[12px] text-ink-500 leading-relaxed mt-0.5">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dock>
        <Btn onClick={() => go('job')} icon="next">Continue to Job Progress</Btn>
      </Dock>
    </div>
  )
}

// ── 5. Job progress ──────────────────────────────────────────────────────────

export function JobScreen({ go, back }: WNav) {
  const { w, steps, action, advance } = useW()
  const finished = w.step >= LAST_STEP

  const run = () => {
    if (action.advance !== undefined) advance(action.advance)
    if (action.to !== 'job') go(action.to)
  }

  return (
    <div className="min-h-full flex flex-col bg-white">
      <AppBar title={w.job.title} onBack={back} />

      <div className="flex-1">
        <div className="px-5 py-4 border-b border-ink-100 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10.5px] font-bold tracking-[0.1em] text-ink-400">{w.job.id}</p>
            <div className="mt-1"><JobStrip job={w.job} /></div>
          </div>
          <button
            onClick={() => go('chat')}
            className="w-10 h-10 rounded-full border border-ink-200 flex items-center justify-center text-ink-600 hover:bg-ink-50 flex-shrink-0"
            aria-label="Message customer"
          >
            <Icon name="chat" size={18} />
          </button>
        </div>

        <div className="px-5 py-5">
          <StepRail steps={steps}>
            {s =>
              s.status === 'current' ? (
                <div className="mt-2.5 rounded-2xl bg-brand-50 border border-brand-100 p-3.5 fade-in">
                  <p className="text-[12.5px] text-ink-700 leading-relaxed">{action.hint}</p>
                  {action.waiting && !finished && (
                    <div className="flex items-center gap-2 mt-2.5 text-[11.5px] font-semibold text-warning-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning-600 soft-pulse" />
                      Awaiting customer
                    </div>
                  )}
                </div>
              ) : s.key === 'payment' && s.status === 'done' ? (
                <div className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-success-700 bg-success-100 rounded-lg px-2 py-1">
                  <Icon name="shield" size={12} /> Rs {money(w.items.reduce((a, i) => a + i.qty * i.price, 0))} held in escrow
                </div>
              ) : null
            }
          </StepRail>

          {finished && (
            <div className="mt-6 rounded-2xl border border-success-100 bg-success-100/40 p-4 text-center fade-up">
              <div className="text-success-700 flex justify-center mb-1.5"><Icon name="check" size={22} /></div>
              <p className="text-[14px] font-bold text-ink-900">Job closed</p>
              <p className="text-[12px] text-ink-600 mt-0.5">Payout released to your balance.</p>
            </div>
          )}
        </div>
      </div>

      <Dock>
        <Btn onClick={run} variant={action.waiting ? 'secondary' : 'primary'}>{action.label}</Btn>
      </Dock>
    </div>
  )
}

// ── 6. Create quotation ──────────────────────────────────────────────────────

const DURATIONS = ['1 – 2 hours', '2 – 3 hours', 'Half day', 'Full day']
const WARRANTIES = ['14 days', '30 days', '90 days']

export function QuoteScreen({ go, back }: WNav) {
  const { w, set, totals, advance } = useW()

  const patch = (id: string, p: { qty?: number; price?: number }) =>
    set({ items: w.items.map(i => (i.id === id ? { ...i, ...p } : i)) })

  const addItem = () =>
    set({ items: [...w.items, { id: `q${Date.now()}`, name: 'New item', qty: 1, price: 0 }] })

  const removeItem = (id: string) => set({ items: w.items.filter(i => i.id !== id) })

  const valid = w.items.length > 0 && totals.subtotal > 0

  return (
    <div className="min-h-full flex flex-col bg-white">
      <AppBar title="Create Quotation" onBack={back} />

      <div className="flex-1 px-5 py-5 space-y-6">
        <div>
          <p className="text-[13px] text-ink-500 leading-relaxed">
            Every line the customer sees is a line you wrote. Clear quotes are the single biggest driver of your
            trust score.
          </p>
        </div>

        <section>
          <Section title="Parts & labour" />
          <div className="space-y-2.5">
            {w.items.map(it => (
              <div key={it.id} className="rounded-2xl border border-ink-200 p-3">
                <div className="flex items-start gap-2">
                  <input
                    value={it.name}
                    onChange={e => set({ items: w.items.map(i => (i.id === it.id ? { ...i, name: e.target.value } : i)) })}
                    className="flex-1 min-w-0 text-[14px] font-semibold text-ink-900 bg-transparent outline-none focus:bg-ink-50 rounded px-1 -mx-1 py-0.5"
                    aria-label="Item name"
                  />
                  <button
                    onClick={() => removeItem(it.id)}
                    className="w-6 h-6 rounded-full text-ink-300 hover:text-danger-600 hover:bg-danger-100 flex items-center justify-center flex-shrink-0"
                    aria-label={`Remove ${it.name}`}
                  >
                    <Icon name="x" size={13} />
                  </button>
                </div>

                <div className="flex items-center gap-3 mt-2.5">
                  <div className="flex items-center bg-ink-100 rounded-lg h-8">
                    <button
                      onClick={() => patch(it.id, { qty: Math.max(1, it.qty - 1) })}
                      className="w-8 h-8 text-ink-600 flex items-center justify-center rounded-l-lg hover:bg-ink-200"
                      aria-label="Decrease quantity"
                    >
                      <Icon name="minus" size={13} />
                    </button>
                    <span className="w-7 text-center text-[13px] font-bold tabular-nums">{it.qty}</span>
                    <button
                      onClick={() => patch(it.id, { qty: it.qty + 1 })}
                      className="w-8 h-8 text-ink-600 flex items-center justify-center rounded-r-lg hover:bg-ink-200"
                      aria-label="Increase quantity"
                    >
                      <Icon name="plus" size={13} />
                    </button>
                  </div>

                  <label className="flex items-center gap-1 flex-1 min-w-0">
                    <span className="text-[12px] text-ink-400 font-semibold">Rs</span>
                    <input
                      type="number"
                      min={0}
                      value={it.price}
                      onChange={e => patch(it.id, { price: Math.max(0, Number(e.target.value) || 0) })}
                      className="w-full text-[13.5px] font-semibold text-ink-900 tabular-nums bg-ink-50 rounded-lg h-8 px-2 outline-none focus:ring-2 focus:ring-brand-200 [&::-webkit-inner-spin-button]:appearance-none"
                      aria-label={`Unit price for ${it.name}`}
                    />
                  </label>

                  <span className="text-[13.5px] font-bold text-ink-900 tabular-nums w-[72px] text-right">
                    {money(it.qty * it.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addItem}
            className="w-full mt-2.5 h-11 rounded-2xl border border-dashed border-ink-300 text-[13px] font-semibold text-ink-500 hover:border-brand-200 hover:text-brand-700 inline-flex items-center justify-center gap-1.5 transition-colors"
          >
            <Icon name="plus" size={15} /> Add line item
          </button>
        </section>

        <section>
          <Section title="Time on site" />
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map(x => (
              <button
                key={x}
                onClick={() => set({ duration: x })}
                className={`h-8 px-3 rounded-full text-[12px] font-semibold border transition-colors ${
                  w.duration === x ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-ink-600 border-ink-200'
                }`}
              >
                {x}
              </button>
            ))}
          </div>
        </section>

        <section>
          <Section title="Workmanship warranty" />
          <div className="flex flex-wrap gap-2">
            {WARRANTIES.map(x => (
              <button
                key={x}
                onClick={() => set({ warranty: x })}
                className={`h-8 px-3 rounded-full text-[12px] font-semibold border transition-colors ${
                  w.warranty === x ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-ink-600 border-ink-200'
                }`}
              >
                {x}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="rounded-2xl bg-ink-50 border border-ink-200 p-4 space-y-2">
            <div className="flex justify-between text-[13px] text-ink-600">
              <span>Customer pays</span>
              <span className="font-semibold text-ink-900 tabular-nums">Rs {money(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-[13px] text-ink-600">
              <span>TrustCraft fee (8%)</span>
              <span className="font-semibold text-ink-500 tabular-nums">− Rs {money(totals.fee)}</span>
            </div>
            <div className="pt-2.5 mt-1 border-t border-ink-200 flex items-baseline justify-between">
              <span className="text-[13px] font-semibold text-ink-900">You receive</span>
              <Money value={totals.payout} size={21} className="text-brand-700" />
            </div>
          </div>
        </section>
      </div>

      <Dock>
        <Btn disabled={!valid} onClick={() => { set({ quoteSent: true }); advance(4); go('quote-sent') }}>
          Preview &amp; Send Quotation
        </Btn>
      </Dock>
    </div>
  )
}

// ── 7. Quotation sent ────────────────────────────────────────────────────────

export function QuoteSentScreen({ go }: WNav) {
  const { w, totals } = useW()
  return (
    <div className="min-h-full flex flex-col bg-white">
      <div className="flex-1 px-5 pt-14">
        <div className="flex flex-col items-center">
          <div className="relative scale-in">
            <span className="absolute inset-0 rounded-3xl bg-brand-100 scale-125 soft-pulse" />
            <div className="relative w-[76px] h-[76px] rounded-3xl bg-brand-600 text-white flex items-center justify-center shadow-[0_16px_36px_-14px_rgba(37,99,235,.7)]">
              <Icon name="doc" size={34} />
            </div>
          </div>
          <h1 className="text-[24px] font-bold text-ink-900 tracking-[-0.03em] mt-6 fade-up-1">Quotation sent</h1>
          <p className="text-[13.5px] text-ink-500 mt-1.5 fade-up-1">Waiting for {w.job.customer.split(' ')[0]} to approve</p>
        </div>

        <div className="mt-8 rounded-2xl border border-ink-200 overflow-hidden fade-up-2">
          <div className="px-4 py-4 text-center border-b border-ink-100 bg-ink-50">
            <p className="text-[11px] font-semibold text-ink-500 uppercase tracking-[0.12em]">Quoted total</p>
            <Money value={totals.subtotal} size={32} className="text-ink-900" />
          </div>
          <div className="divide-y divide-ink-100">
            {w.items.map(i => (
              <div key={i.id} className="flex items-center gap-3 px-4 py-3">
                <span className="text-[13px] text-ink-700 flex-1 min-w-0 truncate">{i.name}</span>
                <span className="text-[11.5px] text-ink-400 tabular-nums">×{i.qty}</span>
                <span className="text-[13px] font-semibold text-ink-900 tabular-nums">{money(i.qty * i.price)}</span>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 bg-ink-50 flex justify-between text-[12px] text-ink-500 font-medium">
            <span>{w.duration} on site</span>
            <span>{w.warranty} warranty</span>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-warning-100/60 border border-warning-100 p-3.5 fade-up-3">
          <span className="text-warning-700 mt-0.5"><Icon name="clock" size={16} /></span>
          <p className="text-[12.5px] text-ink-700 leading-relaxed">
            Once approved, the customer's payment is held by TrustCraft and released to you after the work is confirmed.
          </p>
        </div>
      </div>

      <Dock>
        <Btn onClick={() => go('job')}>Back to Job Progress</Btn>
      </Dock>
    </div>
  )
}

// ── 8. Work completed ────────────────────────────────────────────────────────

const CHECKS = [
  { key: 'clean', label: 'Work area cleaned up' },
  { key: 'walk', label: 'Walked the customer through the fix' },
  { key: 'parts', label: 'Old parts shown or handed over' },
]

export function CompleteScreen({ go, back }: WNav) {
  const { w, set, toggleCheck, advance } = useW()
  const ready = w.summary.trim().length >= 12 && w.evidence >= 2

  return (
    <div className="min-h-full flex flex-col bg-white">
      <AppBar title="Work Completed" onBack={back} />

      <div className="flex-1 px-5 py-5 space-y-6">
        <section>
          <Section title="Completion summary" />
          <textarea
            value={w.summary}
            onChange={e => set({ summary: e.target.value })}
            rows={4}
            placeholder="What did you replace or repair? Anything the customer should watch for?"
            className="w-full rounded-2xl border border-ink-200 p-3.5 text-[14px] text-ink-900 leading-relaxed outline-none focus:border-brand-200 focus:ring-2 focus:ring-brand-100 resize-none placeholder:text-ink-300"
          />
          <p className="text-[11px] text-ink-400 mt-1.5">
            {w.summary.trim().length < 12 ? 'Write at least a sentence — this becomes part of the service record.' : 'Looks good.'}
          </p>
        </section>

        <section>
          <Section title={`Evidence photos · ${w.evidence}/6`} />
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }, (_, i) =>
              i < w.evidence ? (
                <Shot key={i} h={82} hue={200 + i * 14} label={`Shot ${i + 1}`} />
              ) : (
                <button
                  key={i}
                  onClick={() => set({ evidence: Math.min(6, w.evidence + 1) })}
                  disabled={i !== w.evidence}
                  className="h-[82px] rounded-xl border border-dashed border-ink-300 flex items-center justify-center text-ink-300 hover:border-brand-200 hover:text-brand-600 disabled:opacity-45 disabled:pointer-events-none transition-colors"
                  aria-label="Add evidence photo"
                >
                  <Icon name={i === w.evidence ? 'camera' : 'image'} size={19} />
                </button>
              ),
            )}
          </div>
          <p className="text-[11px] text-ink-400 mt-2">At least two photos are required before submitting.</p>
        </section>

        <section>
          <Section title="Before you submit" />
          <div className="rounded-2xl border border-ink-200 divide-y divide-ink-100">
            {CHECKS.map(c => {
              const on = w.checks.includes(c.key)
              return (
                <button
                  key={c.key}
                  onClick={() => toggleCheck(c.key)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-ink-50 transition-colors"
                >
                  <span
                    className={`w-[21px] h-[21px] rounded-md flex items-center justify-center flex-shrink-0 ${
                      on ? 'bg-success-600 text-white' : 'border-2 border-ink-200'
                    }`}
                  >
                    {on && <Icon name="check" size={12} />}
                  </span>
                  <span className={`text-[13.5px] ${on ? 'text-ink-900 font-medium' : 'text-ink-600'}`}>{c.label}</span>
                </button>
              )
            })}
          </div>
        </section>
      </div>

      <Dock>
        <Btn disabled={!ready} onClick={() => { advance(6); go('done') }}>Submit Completion</Btn>
      </Dock>
    </div>
  )
}

// ── 9. Job summary ───────────────────────────────────────────────────────────

export function DoneScreen({ go }: WNav) {
  const { w, totals, advance } = useW()
  return (
    <div className="min-h-full flex flex-col bg-white">
      <div className="flex-1 px-5 pt-14">
        <div className="flex flex-col items-center text-center">
          <div className="relative scale-in">
            <span className="absolute inset-0 rounded-full bg-success-100 scale-150" />
            <div className="relative w-[80px] h-[80px] rounded-full bg-success-600 text-white flex items-center justify-center shadow-[0_16px_36px_-14px_rgba(22,163,74,.7)]">
              <Icon name="check" size={38} />
            </div>
          </div>
          <h1 className="text-[24px] font-bold text-ink-900 tracking-[-0.03em] mt-6 fade-up-1">{w.job.title} is done</h1>
          <p className="text-[13.5px] text-ink-500 mt-1.5 max-w-[300px] leading-relaxed fade-up-1">
            Your evidence went to {w.job.customer.split(' ')[0]}. Payment is released the moment they confirm.
          </p>
        </div>

        <div className="mt-8 rounded-2xl p-4 text-white fade-up-2" style={{ background: HERO }}>
          <p className="text-[11px] text-white/50 font-medium">Releasing to your balance</p>
          <Money value={totals.payout} size={30} />
          <div className="mt-3 pt-3 border-t border-white/10 flex justify-between text-[11.5px] text-white/60">
            <span>Job total Rs {money(totals.subtotal)}</span>
            <span>Fee Rs {money(totals.fee)}</span>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-ink-200 p-4 fade-up-3">
          <p className="text-[13px] font-semibold text-ink-900">This job adds evidence to your profile</p>
          <p className="text-[12px] text-ink-500 leading-relaxed mt-1">
            {w.evidence} photos, a written summary and an itemised quotation are now attached to service record {w.job.id}.
          </p>
        </div>
      </div>

      <Dock>
        <div className="space-y-2.5">
          <Btn onClick={() => { advance(LAST_STEP); go('home') }}>Back to Home</Btn>
          <Btn variant="ghost" onClick={() => go('earnings')}>View earnings</Btn>
        </div>
      </Dock>
    </div>
  )
}
