import { useEffect, useRef, useState } from 'react'
import type { NavProps } from '../types'
import { useDemo, PAST_CASES, THREADS, PROFILE, proById, money } from '../store'
import { Avatar, Btn, Card, Chip, Header, Icon, Label, Row, Tone } from '../components/UI'

// ── 21. Cases (tab) ──────────────────────────────────────────────────────────

export function CasesScreen({ navigate }: NavProps) {
  const { d, stages } = useDemo()
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all')
  const active = stages.find(s => s.status === 'current')
  const live = d.proId && d.step < 9

  const groups = [
    {
      when: 'Today',
      items: live
        ? [{ id: 'c1', title: 'Kitchen Sink Leak', pro: proById(d.proId).name, state: active ? active.label : 'Completed', tone: 'brand' as const, to: 'status' as const }]
        : [],
    },
    { when: 'Yesterday', items: PAST_CASES.slice(0, 1).map(c => ({ ...c, to: 'record' as const })) },
    { when: 'Monday, Aug 21', items: PAST_CASES.slice(1, 2).map(c => ({ ...c, to: 'record' as const })) },
    { when: 'Jan 15', items: PAST_CASES.slice(2).map(c => ({ ...c, to: 'record' as const })) },
  ].map(g => ({
    ...g,
    items: g.items.filter(i =>
      filter === 'all' ? true : filter === 'active' ? i.state !== 'Completed' : i.state === 'Completed',
    ),
  }))

  const empty = groups.every(g => g.items.length === 0)

  return (
    <div className="bg-white min-h-full pb-6">
      <Header title="My Cases" right={<span className="text-ink-400"><Icon name="filter" size={19} /></span>} />

      <div className="px-5 pt-4 flex gap-2">
        <Chip active={filter === 'all'} onClick={() => setFilter('all')}>All</Chip>
        <Chip active={filter === 'active'} onClick={() => setFilter('active')}>In progress</Chip>
        <Chip active={filter === 'done'} onClick={() => setFilter('done')}>Completed</Chip>
      </div>

      {empty ? (
        <div className="pt-24 flex flex-col items-center gap-2 px-10 text-center">
          <span className="text-ink-300"><Icon name="cases" size={34} /></span>
          <p className="text-[14px] text-ink-500">No cases in this filter.</p>
        </div>
      ) : (
        <div className="px-5 pt-5 space-y-5">
          {groups.filter(g => g.items.length > 0).map(g => (
            <div key={g.when}>
              <Label className="mb-2">{g.when}</Label>
              <div className="space-y-2.5">
                {g.items.map(c => (
                  <Card key={c.id} onClick={() => navigate(c.to)} className="p-3.5 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      c.state === 'Completed' ? 'bg-ink-100 text-ink-500' : 'bg-brand-50 text-brand-600'
                    }`}>
                      <Icon name="wrench" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-ink-900 truncate">{c.title}</p>
                      <p className="text-[12px] text-ink-500 truncate">{c.pro}</p>
                    </div>
                    <Tone tone={c.state === 'Completed' ? 'muted' : c.tone}>{c.state}</Tone>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── 22. Messages (tab) ───────────────────────────────────────────────────────

const SUPPORT = { id: 'support', name: 'TrustCraft Support', trade: 'Support team', hue: 250 }

export function MessagesScreen({ navigate }: NavProps) {
  const { set } = useDemo()
  const [q, setQ] = useState('')

  const rows = THREADS.map(t => {
    const p = t.id === 'support' ? SUPPORT : proById(t.id)
    return { ...t, name: p.name, trade: p.trade, hue: p.hue }
  }).filter(t => t.name.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="bg-white min-h-full pb-6 relative">
      <Header title="Messages" right={<span className="text-ink-400"><Icon name="edit" size={18} /></span>} />

      <div className="px-5 pt-4">
        <div className="h-11 rounded-xl border border-ink-200 flex items-center gap-2 px-3.5 focus-within:border-brand-500">
          <span className="text-ink-400"><Icon name="search" size={17} /></span>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search messages"
            className="flex-1 text-[14px] outline-none placeholder:text-ink-400"
          />
        </div>
      </div>

      <div className="mt-3 divide-y divide-ink-100">
        {rows.map(t => (
          <button
            key={t.id}
            onClick={() => { set({ chatWith: t.id }); navigate('chat') }}
            className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-ink-50 transition-colors"
          >
            <Avatar name={t.name} hue={t.hue} size={44} badge={t.id !== 'support'} />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-ink-900 truncate">{t.name}</p>
              <p className={`text-[12.5px] truncate ${t.unread ? 'text-ink-800 font-medium' : 'text-ink-500'}`}>{t.last}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[11px] text-ink-400">{t.time}</span>
              {t.unread > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {t.unread}
                </span>
              )}
            </div>
          </button>
        ))}
        {rows.length === 0 && <p className="px-5 py-10 text-center text-[13px] text-ink-400">No conversations found.</p>}
      </div>

      <button
        onClick={() => { set({ chatWith: 'support' }); navigate('chat') }}
        aria-label="New message"
        className="absolute bottom-5 right-5 w-14 h-14 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-600/35 hover:bg-brand-700"
      >
        <Icon name="plus" size={24} />
      </button>
    </div>
  )
}

// ── 22b. Chat ────────────────────────────────────────────────────────────────

export function ChatScreen({ goBack }: NavProps) {
  const { d, send } = useDemo()
  const p = d.chatWith === 'support' ? SUPPORT : proById(d.chatWith)
  const [text, setText] = useState('')
  const end = useRef<HTMLDivElement>(null)

  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }) }, [d.chat.length])

  const submit = () => {
    if (!text.trim()) return
    send(text.trim())
    setText('')
  }

  return (
    <div className="bg-ink-50 h-full flex flex-col">
      <div className="sticky top-0 z-20 bg-white border-b border-ink-100 flex items-center gap-2 px-2 h-14">
        <button onClick={goBack} aria-label="Go back" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-ink-100">
          <Icon name="back" size={20} />
        </button>
        <Avatar name={p.name} hue={p.hue} size={36} badge={d.chatWith !== 'support'} />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-ink-900 truncate">{p.name}</p>
          <p className="text-[11.5px] text-success-600 font-medium">Online</p>
        </div>
        <button aria-label="Call" className="w-10 h-10 rounded-full flex items-center justify-center text-ink-500 hover:bg-ink-100">
          <Icon name="phone" size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scroll px-4 py-4 space-y-2.5">
        <p className="text-center text-[11px] text-ink-400">Today</p>
        {d.chat.map((m, i) => {
          const mine = m.from === 'me'
          return (
            <div key={i} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[76%] px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                  mine
                    ? 'bg-brand-600 text-white rounded-2xl rounded-br-sm'
                    : 'bg-white text-ink-800 border border-ink-200 rounded-2xl rounded-bl-sm'
                }`}
              >
                {m.text}
                <span className={`block text-[10px] mt-1 ${mine ? 'text-white/70' : 'text-ink-400'}`}>{m.time}</span>
              </div>
            </div>
          )
        })}
        <div ref={end} />
      </div>

      <div className="bg-white border-t border-ink-100 p-3 flex items-center gap-2">
        <button aria-label="Attach" className="w-10 h-10 rounded-full flex items-center justify-center text-ink-500 hover:bg-ink-100 flex-shrink-0">
          <Icon name="plus" size={20} />
        </button>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Type a message"
          className="flex-1 h-11 rounded-full bg-ink-100 px-4 text-[14px] outline-none placeholder:text-ink-400"
        />
        <button
          onClick={submit}
          aria-label="Send"
          className="w-11 h-11 rounded-full bg-brand-600 text-white flex items-center justify-center flex-shrink-0 hover:bg-brand-700 disabled:opacity-40"
          disabled={!text.trim()}
        >
          <Icon name="send" size={19} />
        </button>
      </div>
    </div>
  )
}

// ── 23. Profile (tab) ────────────────────────────────────────────────────────

export function ProfileScreen({ navigate }: NavProps) {
  const { reset } = useDemo()

  return (
    <div className="bg-white min-h-full pb-6">
      <Header title="Profile" right={<span className="text-ink-400"><Icon name="edit" size={18} /></span>} />

      <div className="px-5 pt-6 space-y-5">
        <div className="flex flex-col items-center">
          <Avatar name={PROFILE.name} hue={230} size={76} />
          <p className="text-[17px] font-bold text-ink-900 mt-3">{PROFILE.name}</p>
          <p className="text-[12.5px] text-ink-500">Customer</p>
        </div>

        <Card onClick={() => navigate('profile-overview')} className="p-4 flex items-center gap-3 border-brand-200 bg-brand-50">
          <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0">
            <Icon name="chart" size={19} />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-ink-900">Overview</p>
            <p className="text-[12px] text-ink-500">Spending and services used</p>
          </div>
          <span className="text-brand-600"><Icon name="next" size={17} /></span>
        </Card>

        <div>
          <Label className="mb-2">Personal Information</Label>
          <Card className="divide-y divide-ink-100 overflow-hidden">
            <Row icon="user" label="Full Name" value={PROFILE.name} />
            <Row icon="pin" label="Address" value={PROFILE.address} />
            <Row icon="phone" label="Contact" value={PROFILE.contact} />
            <Row icon="mail" label="Email" value={PROFILE.email} />
            <Row icon="id" label="NIC" value={PROFILE.nic} />
          </Card>
        </div>

        <div>
          <Label className="mb-2">App</Label>
          <Card className="divide-y divide-ink-100 overflow-hidden">
            <Row icon="bell" label="Notifications" onClick={() => navigate('notifications')} />
            <Row icon="cases" label="My Cases" onClick={() => navigate('cases')} />
            <Row icon="chat" label="Messages" onClick={() => navigate('messages')} />
            <Row icon="shield" label="Privacy & Security" onClick={() => navigate('profile')} />
            <Row icon="info" label="Help & Support" onClick={() => navigate('messages')} />
          </Card>
        </div>

        <Btn variant="ghost" onClick={() => { reset(); navigate('home') }}>Reset Demo Data</Btn>
      </div>
    </div>
  )
}

// ── 23b. Profile overview ────────────────────────────────────────────────────

export function ProfileOverviewScreen({ navigate, goBack }: NavProps) {
  const { d } = useDemo()
  const max = Math.max(...PROFILE.months.map(m => m.v))
  const [month, setMonth] = useState('August 2026')

  return (
    <div className="bg-white min-h-full pb-6">
      <Header title="Overview" onBack={goBack} />

      <div className="px-5 pt-4 space-y-5">
        <div className="flex items-center justify-between">
          <Label>Monthly Overview</Label>
          <select
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="text-[12.5px] font-semibold text-ink-700 border border-ink-200 rounded-lg px-2.5 py-1.5 outline-none"
          >
            {['August 2026', 'July 2026', 'June 2026'].map(m => <option key={m}>{m}</option>)}
          </select>
        </div>

        <Card className="p-4">
          <div className="flex items-end justify-between gap-2 h-36">
            {PROFILE.months.map((m, i) => (
              <div key={m.m} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-semibold text-ink-400">{(m.v / 1000).toFixed(1)}k</span>
                <div
                  className={`w-full rounded-t-lg ${i === PROFILE.months.length - 1 ? 'bg-brand-600' : 'bg-brand-200'}`}
                  style={{ height: `${(m.v / max) * 100}%`, minHeight: 6 }}
                />
                <span className="text-[10.5px] text-ink-500 font-medium">{m.m}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <p className="text-[11.5px] text-ink-500 font-medium">Money Spent</p>
            <p className="text-[19px] font-bold text-ink-900 mt-1">LKR {money(PROFILE.moneySpent)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-[11.5px] text-ink-500 font-medium">Services Used</p>
            <p className="text-[19px] font-bold text-ink-900 mt-1">{PROFILE.servicesUsed}</p>
          </Card>
        </div>

        <div>
          <Label className="mb-2">Recent Services</Label>
          <Card className="divide-y divide-ink-100 overflow-hidden">
            {d.proId && <Row icon="wrench" label="Kitchen Sink Leak" value="Aug 24" onClick={() => navigate('record')} />}
            {PAST_CASES.map(c => (
              <Row key={c.id} icon="cases" label={c.title} value={c.when} onClick={() => navigate('record')} />
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}
