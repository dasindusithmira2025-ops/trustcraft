import { useState } from 'react'
import { Avatar, Btn, Icon, Stars } from '../components/UI'
import { AppBar, Bars, Dock, Meter, Money, Section, Switch, Tag } from './ui'
import { useW } from './store'
import {
  DOCUMENTS, EARNINGS, SERVICES, STATS, THREADS, TRUST_FACTORS, WORKER, money,
  type WNav,
} from './data'

const HERO = 'linear-gradient(152deg, #0B1220 0%, #16305C 58%, #1E3A8A 128%)'

// ── Messages ─────────────────────────────────────────────────────────────────

export function MessagesScreen({ go }: WNav) {
  const { w, set } = useW()
  const [q, setQ] = useState('')
  const list = THREADS.filter(t => (t.name + t.job).toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="min-h-full flex flex-col bg-white">
      <AppBar title="Messages" />

      <div className="px-5 py-3 border-b border-ink-100">
        <div className="flex items-center gap-2 h-10 rounded-xl bg-ink-100 px-3">
          <span className="text-ink-400"><Icon name="search" size={16} /></span>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search customers or jobs"
            className="flex-1 bg-transparent text-[13.5px] text-ink-900 outline-none placeholder:text-ink-400"
            aria-label="Search messages"
          />
        </div>
      </div>

      <div className="flex-1 divide-y divide-ink-100">
        {list.map(t => {
          const unread = w.read.includes(t.id) ? 0 : t.unread
          return (
            <button
              key={t.id}
              onClick={() => { set({ chatWith: t.id, read: [...w.read, t.id] }); go('chat') }}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-ink-50 transition-colors"
            >
              <Avatar name={t.name} hue={t.hue} size={44} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <p className={`text-[14.5px] truncate ${unread ? 'font-bold text-ink-900' : 'font-semibold text-ink-800'}`}>
                    {t.name}
                  </p>
                  <span className="ml-auto text-[11px] text-ink-400 flex-shrink-0">{t.time}</span>
                </div>
                <p className={`text-[12.5px] truncate mt-0.5 ${unread ? 'text-ink-800 font-medium' : 'text-ink-500'}`}>
                  {t.last}
                </p>
                <p className="text-[11px] text-brand-700 font-medium truncate mt-0.5">{t.job}</p>
              </div>
              {unread > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-brand-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                  {unread}
                </span>
              )}
            </button>
          )
        })}
        {list.length === 0 && (
          <div className="py-20 text-center text-ink-400">
            <p className="text-[13px]">No conversations match “{q}”.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Chat ─────────────────────────────────────────────────────────────────────

export function ChatScreen({ back }: WNav) {
  const { w, send } = useW()
  const t = THREADS.find(x => x.id === w.chatWith) ?? THREADS[0]
  const [text, setText] = useState('')

  const submit = () => {
    if (!text.trim()) return
    send(text.trim())
    setText('')
  }

  return (
    <div className="h-full flex flex-col bg-ink-50">
      <AppBar
        title={t.name}
        onBack={back}
        right={
          <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10" aria-label="Call customer">
            <Icon name="phone" size={18} />
          </button>
        }
      />

      <div className="px-5 py-2 bg-white border-b border-ink-100 flex items-center gap-2">
        <Tag hue={t.hue}>{t.job}</Tag>
        <span className="text-[11px] text-ink-400 ml-auto">Messages are kept with the service record</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scroll px-4 py-4 space-y-2.5">
        {w.chat.map((m, i) => {
          const me = m.from === 'me'
          return (
            <div key={i} className={`flex ${me ? 'justify-end' : 'justify-start'} fade-in`}>
              <div
                className={`max-w-[76%] px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                  me
                    ? 'bg-brand-600 text-white rounded-[18px] rounded-br-[6px]'
                    : 'bg-white text-ink-800 border border-ink-200 rounded-[18px] rounded-bl-[6px]'
                }`}
              >
                {m.text}
                <span className={`block text-[10px] mt-1 ${me ? 'text-white/60' : 'text-ink-400'}`}>{m.time}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="p-3 bg-white border-t border-ink-100 flex items-end gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Message…"
          aria-label="Message"
          className="flex-1 h-11 rounded-full bg-ink-100 px-4 text-[14px] text-ink-900 outline-none focus:ring-2 focus:ring-brand-100 placeholder:text-ink-400"
        />
        <button
          onClick={submit}
          disabled={!text.trim()}
          aria-label="Send"
          className="w-11 h-11 rounded-full bg-brand-600 text-white flex items-center justify-center disabled:opacity-40 hover:bg-brand-700 transition-colors flex-shrink-0"
        >
          <Icon name="send" size={18} />
        </button>
      </div>
    </div>
  )
}

// ── Earnings ─────────────────────────────────────────────────────────────────

const LEDGER_TONE: Record<string, string> = {
  Released: 'bg-success-100 text-success-700',
  Held: 'bg-warning-100 text-warning-700',
}

export function EarningsScreen() {
  const { totals, w } = useW()
  const pending = w.quoteSent ? totals.payout : EARNINGS.pending

  return (
    <div className="min-h-full flex flex-col bg-ink-50">
      <div style={{ background: HERO }} className="text-white">
        <AppBar flat title="Earnings" />
        <div className="px-5 pb-12 pt-2">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-white/45">AVAILABLE BALANCE</p>
          <div className="mt-1.5"><Money value={EARNINGS.available} size={38} /></div>
          <p className="text-[12px] text-white/55 mt-2">
            Next payout {EARNINGS.payoutOn} · Commercial Bank ••4471
          </p>
          <button className="mt-4 h-11 w-full rounded-xl bg-white text-ink-900 text-[14px] font-bold inline-flex items-center justify-center gap-2 hover:bg-white/90 transition-colors">
            <Icon name="download" size={16} /> Withdraw to bank
          </button>
        </div>
      </div>

      <div className="relative -mt-7 rounded-t-[28px] bg-ink-50 px-5 pt-6 pb-8 flex-1 space-y-7">
        <section className="grid grid-cols-3 gap-2.5 fade-up">
          {[
            { l: 'This month', v: EARNINGS.month },
            { l: 'This week', v: EARNINGS.week },
            { l: 'In escrow', v: pending },
          ].map(s => (
            <div key={s.l} className="bg-white border border-ink-200 rounded-2xl px-3 py-3.5">
              <p className="text-[10.5px] text-ink-400 font-semibold">{s.l}</p>
              <p className="text-[15px] font-bold text-ink-900 tabular-nums mt-1 leading-none">
                <span className="text-[10px] text-ink-400">Rs </span>{money(s.v)}
              </p>
            </div>
          ))}
        </section>

        <section className="fade-up-1">
          <Section title="Last six months" />
          <div className="bg-white border border-ink-200 rounded-2xl p-4">
            <Bars data={EARNINGS.months} height={112} />
            <p className="text-[11.5px] text-ink-500 mt-3 pt-3 border-t border-ink-100">
              August is your strongest month yet — <span className="font-semibold text-success-700">19% above</span> your six-month average.
            </p>
          </div>
        </section>

        <section className="fade-up-2">
          <Section title="Transaction ledger" />
          <div className="bg-white border border-ink-200 rounded-2xl divide-y divide-ink-100">
            {EARNINGS.ledger.map(l => (
              <div key={l.id} className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-9 h-9 rounded-xl bg-ink-100 flex items-center justify-center text-ink-500 flex-shrink-0">
                  <Icon name="wrench" size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-ink-900 truncate">{l.title}</p>
                  <p className="text-[11px] text-ink-400">{l.id} · {l.when}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[13.5px] font-bold text-ink-900 tabular-nums">Rs {money(l.amount)}</p>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${LEDGER_TONE[l.state]}`}>{l.state}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

// ── Analyse ──────────────────────────────────────────────────────────────────

function TrustRing({ score }: { score: number }) {
  const r = 46
  const c = 2 * Math.PI * r
  return (
    <div className="relative w-[124px] h-[124px]">
      <svg width="124" height="124" viewBox="0 0 124 124" className="-rotate-90">
        <circle cx="62" cy="62" r={r} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="9" />
        <circle
          cx="62" cy="62" r={r} fill="none" stroke="url(#tg)" strokeWidth="9" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)}
        />
        <defs>
          <linearGradient id="tg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[34px] font-bold leading-none tracking-[-0.03em]">{score}</span>
        <span className="text-[10px] font-semibold tracking-[0.12em] text-white/50 mt-1">TRUST</span>
      </div>
    </div>
  )
}

export function AnalyseScreen() {
  return (
    <div className="min-h-full flex flex-col bg-ink-50">
      <div style={{ background: HERO }} className="text-white">
        <AppBar flat title="Analyse" />
        <div className="px-5 pb-12 pt-2 flex items-center gap-5">
          <TrustRing score={WORKER.trust} />
          <div className="min-w-0">
            <p className="text-[15px] font-bold leading-tight">Top 8% of pros in Colombo</p>
            <p className="text-[12px] text-white/55 leading-relaxed mt-1.5">
              Your score is built from verified evidence — not stars alone.
            </p>
            <p className="text-[12px] text-success-100 font-semibold mt-2.5">▲ 3 points this month</p>
          </div>
        </div>
      </div>

      <div className="relative -mt-7 rounded-t-[28px] bg-ink-50 px-5 pt-6 pb-8 flex-1 space-y-7">
        <section className="grid grid-cols-2 gap-2.5 fade-up">
          {STATS.map(s => (
            <div key={s.label} className="bg-white border border-ink-200 rounded-2xl p-3.5">
              <p className="text-[11px] text-ink-400 font-semibold">{s.label}</p>
              <p className="text-[21px] font-bold text-ink-900 tracking-[-0.02em] mt-0.5 leading-none">{s.value}</p>
              <p className={`text-[11px] font-semibold mt-1.5 ${s.good ? 'text-success-700' : 'text-warning-700'}`}>
                {s.good ? '▲' : '▼'} {s.delta}
              </p>
            </div>
          ))}
        </section>

        <section className="fade-up-1">
          <Section title="What drives your score" />
          <div className="bg-white border border-ink-200 rounded-2xl p-4 space-y-3.5">
            {TRUST_FACTORS.map(f => (
              <div key={f.label}>
                <div className="flex justify-between text-[12.5px] mb-1.5">
                  <span className="text-ink-700 font-medium">{f.label}</span>
                  <span className="font-bold text-ink-900 tabular-nums">{f.value}</span>
                </div>
                <Meter value={f.value} tone={f.value >= 95 ? 'success' : f.value >= 90 ? 'brand' : 'warning'} />
              </div>
            ))}
          </div>
        </section>

        <section className="fade-up-2">
          <Section title="Jobs completed" />
          <div className="bg-white border border-ink-200 rounded-2xl p-4">
            <Bars data={[{ m: 'Mar', v: 14 }, { m: 'Apr', v: 19 }, { m: 'May', v: 12 }, { m: 'Jun', v: 22 }, { m: 'Jul', v: 20 }, { m: 'Aug', v: 26 }]} height={100} />
          </div>
        </section>

        <section className="fade-up-3">
          <Section title="Where the work comes from" />
          <div className="bg-white border border-ink-200 rounded-2xl divide-y divide-ink-100">
            {SERVICES.slice(0, 4).map(s => (
              <div key={s.name} className="flex items-center gap-3 px-4 py-3">
                <p className="text-[13.5px] font-medium text-ink-800 flex-1 truncate">{s.name}</p>
                <span className="text-[12px] text-ink-500 tabular-nums">{s.jobs} jobs</span>
                <span className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-ink-900">
                  <span className="text-gold-500"><Icon name="star" size={12} fill /></span>{s.rate}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

// ── Profile ──────────────────────────────────────────────────────────────────

const MENU: { icon: string; label: string; to: 'services' | 'documents' | 'earnings' | 'settings'; hint: string }[] = [
  { icon: 'wrench', label: 'My Services', to: 'services', hint: '5 trades listed' },
  { icon: 'id', label: 'Verification Documents', to: 'documents', hint: '3 verified · 1 expiring' },
  { icon: 'wallet', label: 'Earnings & Payouts', to: 'earnings', hint: 'Commercial Bank ••4471' },
  { icon: 'card', label: 'Settings', to: 'settings', hint: 'Alerts, area, language' },
]

export function ProfileScreen({ go }: WNav) {
  const { reset } = useW()
  return (
    <div className="min-h-full flex flex-col bg-ink-50">
      <div style={{ background: HERO }} className="text-white">
        <AppBar flat title="Profile" />
        <div className="px-5 pb-14 pt-3 flex flex-col items-center text-center">
          <div className="relative">
            <div
              className="w-[86px] h-[86px] rounded-full flex items-center justify-center text-[30px] font-bold ring-4 ring-white/15"
              style={{ background: 'linear-gradient(145deg,#3B82F6,#1E3A8A)' }}
            >
              KP
            </div>
            <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-success-600 ring-[3px] ring-[#16305C] flex items-center justify-center">
              <Icon name="check" size={14} />
            </span>
          </div>
          <h1 className="text-[22px] font-bold tracking-[-0.02em] mt-3.5">{WORKER.name}</h1>
          <div className="inline-flex items-center gap-1.5 mt-2 bg-white/10 ring-1 ring-white/15 rounded-full px-2.5 py-1">
            <Icon name="shield" size={12} />
            <span className="text-[11.5px] font-semibold">{WORKER.trade} · {WORKER.trades}</span>
          </div>
          <p className="text-[11.5px] text-white/45 mt-2">{WORKER.area} · {WORKER.since}</p>
        </div>
      </div>

      <div className="relative -mt-9 px-5 pb-8 flex-1 space-y-5">
        <div className="bg-white border border-ink-200 rounded-2xl grid grid-cols-3 divide-x divide-ink-100 shadow-[0_12px_34px_-24px_rgba(15,23,42,.9)] fade-up">
          {[
            { l: 'Rating', v: WORKER.rating.toFixed(1), s: `${WORKER.reviews} reviews` },
            { l: 'Trust score', v: String(WORKER.trust), s: 'Top 8%' },
            { l: 'Jobs done', v: String(WORKER.jobs), s: 'since 2019' },
          ].map(x => (
            <div key={x.l} className="px-2 py-4 text-center">
              <p className="text-[19px] font-bold text-ink-900 tracking-[-0.02em] leading-none">{x.v}</p>
              <p className="text-[11px] font-semibold text-ink-600 mt-1.5">{x.l}</p>
              <p className="text-[10px] text-ink-400">{x.s}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 fade-up-1">
          <Stars value={WORKER.rating} size={16} />
          <span className="text-[12px] text-ink-500">from {WORKER.reviews} verified jobs</span>
        </div>

        <div className="bg-white border border-ink-200 rounded-2xl divide-y divide-ink-100 overflow-hidden fade-up-2">
          {MENU.map(m => (
            <button
              key={m.label}
              onClick={() => go(m.to)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-ink-50 transition-colors"
            >
              <span className="w-9 h-9 rounded-xl bg-ink-100 flex items-center justify-center text-ink-600 flex-shrink-0">
                <Icon name={m.icon} size={17} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-[14px] font-semibold text-ink-900">{m.label}</span>
                <span className="block text-[11.5px] text-ink-400">{m.hint}</span>
              </span>
              <span className="text-ink-300"><Icon name="next" size={16} /></span>
            </button>
          ))}
        </div>

        <button
          onClick={() => { reset(); go('home') }}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl border border-ink-200 bg-white text-[14px] font-semibold text-danger-600 hover:bg-danger-100/40 transition-colors fade-up-3"
        >
          <Icon name="logout" size={17} /> Log out
        </button>

        <p className="text-center text-[10.5px] text-ink-400">TrustCraft Pro · v1.0 · Colombo, Sri Lanka</p>
      </div>
    </div>
  )
}

// ── My services ──────────────────────────────────────────────────────────────

export function ServicesScreen({ back }: WNav) {
  const [on, setOn] = useState(() => SERVICES.filter(s => s.on).map(s => s.name))
  const toggle = (n: string) => setOn(p => (p.includes(n) ? p.filter(x => x !== n) : [...p, n]))

  return (
    <div className="min-h-full flex flex-col bg-white">
      <AppBar title="My Services" onBack={back} />
      <div className="px-5 py-5 flex-1 space-y-5">
        <p className="text-[13px] text-ink-500 leading-relaxed">
          You only receive opportunities for the services you switch on. Ratings shown are from your completed jobs.
        </p>

        <div className="rounded-2xl border border-ink-200 divide-y divide-ink-100">
          {SERVICES.map(s => (
            <div key={s.name} className="flex items-center gap-3 px-4 py-3.5">
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-ink-900">{s.name}</p>
                <p className="text-[11.5px] text-ink-500 mt-0.5">
                  {s.jobs} jobs · <span className="text-gold-500">★</span> {s.rate}
                </p>
              </div>
              <Switch on={on.includes(s.name)} onChange={() => toggle(s.name)} label={s.name} />
            </div>
          ))}
        </div>

        <button className="w-full h-11 rounded-2xl border border-dashed border-ink-300 text-[13px] font-semibold text-ink-500 hover:border-brand-200 hover:text-brand-700 inline-flex items-center justify-center gap-1.5 transition-colors">
          <Icon name="plus" size={15} /> Request a new trade
        </button>

        <div className="rounded-2xl bg-brand-50 border border-brand-100 p-4">
          <p className="text-[13px] font-semibold text-brand-800">Adding a trade needs proof</p>
          <p className="text-[12px] text-ink-600 leading-relaxed mt-1">
            New trades stay hidden until the matching certificate is verified. It keeps the badge worth something.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Verification documents ───────────────────────────────────────────────────

const DOC_TONE: Record<string, { cls: string; icon: string }> = {
  Verified: { cls: 'bg-success-100 text-success-700', icon: 'check' },
  Expiring: { cls: 'bg-warning-100 text-warning-700', icon: 'clock' },
  Missing: { cls: 'bg-ink-100 text-ink-500', icon: 'plus' },
}

export function DocumentsScreen({ back }: WNav) {
  const verified = DOCUMENTS.filter(d => d.state === 'Verified').length
  return (
    <div className="min-h-full flex flex-col bg-white">
      <AppBar title="Verification Documents" onBack={back} />

      <div className="px-5 py-5 flex-1 space-y-5">
        <div className="rounded-2xl border border-ink-200 p-4">
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-[13px] font-semibold text-ink-900">Verification strength</p>
            <p className="text-[13px] font-bold text-ink-900 tabular-nums">{verified}/{DOCUMENTS.length}</p>
          </div>
          <Meter value={(verified / DOCUMENTS.length) * 100} tone="success" />
          <p className="text-[11.5px] text-ink-500 leading-relaxed mt-2.5">
            Every document here is checked by a human before your badge changes.
          </p>
        </div>

        <div className="rounded-2xl border border-ink-200 divide-y divide-ink-100">
          {DOCUMENTS.map(d => {
            const t = DOC_TONE[d.state]
            return (
              <div key={d.name} className="flex items-center gap-3 px-4 py-3.5">
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${t.cls}`}>
                  <Icon name={t.icon} size={16} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-ink-900 leading-tight">{d.name}</p>
                  <p className="text-[11.5px] text-ink-500 mt-0.5">{d.when}</p>
                </div>
                {d.state === 'Verified' ? (
                  <span className="text-[11px] font-bold text-success-700">Verified</span>
                ) : (
                  <button className="h-8 px-3 rounded-lg bg-brand-600 text-white text-[12px] font-semibold hover:bg-brand-700 transition-colors flex-shrink-0">
                    {d.state === 'Expiring' ? 'Renew' : 'Upload'}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <Dock>
        <Btn variant="secondary" icon="upload">Upload a document</Btn>
      </Dock>
    </div>
  )
}

// ── Settings ─────────────────────────────────────────────────────────────────

const TOGGLES = [
  { key: 'push', label: 'New opportunity alerts', hint: 'Push notification the moment a job matches' },
  { key: 'sms', label: 'SMS for urgent jobs', hint: 'Only for requests marked urgent' },
  { key: 'auto', label: 'Auto-decline beyond 10 km', hint: 'Keeps your response time strong' },
  { key: 'digest', label: 'Weekly earnings digest', hint: 'Every Monday morning' },
]

export function SettingsScreen({ back }: WNav) {
  const [on, setOn] = useState<string[]>(['push', 'sms', 'digest'])
  const toggle = (k: string) => setOn(p => (p.includes(k) ? p.filter(x => x !== k) : [...p, k]))

  return (
    <div className="min-h-full flex flex-col bg-white">
      <AppBar title="Settings" onBack={back} />

      <div className="px-5 py-5 flex-1 space-y-6">
        <section>
          <Section title="Notifications" />
          <div className="rounded-2xl border border-ink-200 divide-y divide-ink-100">
            {TOGGLES.map(t => (
              <div key={t.key} className="flex items-center gap-3 px-4 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-ink-900">{t.label}</p>
                  <p className="text-[11.5px] text-ink-500 mt-0.5">{t.hint}</p>
                </div>
                <Switch on={on.includes(t.key)} onChange={() => toggle(t.key)} label={t.label} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <Section title="Account" />
          <div className="rounded-2xl border border-ink-200 divide-y divide-ink-100">
            {[
              { icon: 'phone', l: 'Phone', v: WORKER.phone },
              { icon: 'mail', l: 'Email', v: WORKER.email },
              { icon: 'pin', l: 'Service area', v: 'Within 10 km of Rajagiriya' },
              { icon: 'info', l: 'Language', v: 'English' },
            ].map(r => (
              <button key={r.l} className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-ink-50 transition-colors">
                <span className="text-ink-400"><Icon name={r.icon} size={17} /></span>
                <span className="text-[13.5px] text-ink-800 flex-1">{r.l}</span>
                <span className="text-[12.5px] text-ink-500 truncate max-w-[150px]">{r.v}</span>
                <span className="text-ink-300"><Icon name="next" size={15} /></span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
