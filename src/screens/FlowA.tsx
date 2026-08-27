import { useState } from 'react'
import type { NavProps } from '../types'
import { useDemo, LOCATIONS, NOTIFICATIONS, PAST_CASES, PROFILE } from '../store'
import { Avatar, Btn, Card, Header, Icon, Label, Photo, Row, Tone } from '../components/UI'

// ── 01. Home ─────────────────────────────────────────────────────────────────

const INPUTS = [
  { icon: 'camera', label: 'Photo', to: 'camera' as const },
  { icon: 'video', label: 'Video', to: 'camera' as const },
  { icon: 'mic', label: 'Voice', to: 'camera' as const },
  { icon: 'pin', label: 'Location', to: 'location' as const },
]

export function HomeScreen({ navigate }: NavProps) {
  const { d, set, stages } = useDemo()
  const active = stages.find(s => s.status === 'current')

  return (
    <div className="pb-6">
      {/* App bar */}
      <div className="sticky top-0 z-20 bg-white px-5 h-14 flex items-center justify-between border-b border-ink-100">
        <div className="flex items-center gap-2">
          <span className="text-brand-600"><Icon name="shield" size={20} /></span>
          <span className="text-[17px] font-bold text-brand-700 tracking-tight">TrustCraft</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('notifications')}
            aria-label="Notifications"
            className="w-10 h-10 rounded-full flex items-center justify-center text-ink-700 hover:bg-ink-100 relative"
          >
            <Icon name="bell" size={20} />
            {!d.notificationsRead && <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-danger-600 border border-white" />}
          </button>
          <button onClick={() => navigate('profile')} aria-label="Profile">
            <Avatar name={PROFILE.name} hue={230} size={32} />
          </button>
        </div>
      </div>

      <div className="px-5 pt-4 space-y-5">
        <h1 className="text-[20px] font-bold text-ink-900">Hi, {PROFILE.name.split(' ')[0]} 👋</h1>

        {/* Problem capture */}
        <div className="fade-up">
          <p className="text-[15px] font-semibold text-ink-900 mb-2">Tell us your problem</p>
          <div className="border border-ink-200 rounded-2xl bg-white overflow-hidden focus-within:border-brand-500 transition-colors">
            <textarea
              value={d.problem}
              onChange={e => set({ problem: e.target.value.slice(0, 500) })}
              placeholder="Type your problem here..."
              rows={3}
              className="w-full px-4 pt-3 text-[14px] text-ink-800 leading-relaxed resize-none outline-none placeholder:text-ink-400"
            />
            <div className="flex justify-end px-4 pb-1.5">
              <span className="text-[11px] text-ink-400">{d.problem.length}/500</span>
            </div>
            <div className="grid grid-cols-4 border-t border-ink-100">
              {INPUTS.map(i => (
                <button
                  key={i.label}
                  onClick={() => navigate(i.to)}
                  className="flex flex-col items-center gap-1 py-2.5 text-ink-600 hover:bg-brand-50 hover:text-brand-600 transition-colors border-r last:border-r-0 border-ink-100"
                >
                  <Icon name={i.icon} size={18} />
                  <span className="text-[11px] font-medium">{i.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-2.5 text-[13px]">
            <span className="text-brand-600"><Icon name="pin" size={15} /></span>
            <span className="text-ink-700 flex-1">{d.location}</span>
            <button onClick={() => navigate('location')} className="text-brand-600 font-semibold">Change</button>
          </div>

          <div className="mt-3">
            <Btn onClick={() => navigate('problem')} disabled={!d.problem.trim()}>Continue</Btn>
          </div>
        </div>

        {/* Search pros */}
        <div>
          <p className="text-[15px] font-semibold text-ink-900 mb-2">Find a professional</p>
          <button
            onClick={() => navigate('find-pros')}
            className="w-full h-12 rounded-xl border border-ink-200 bg-white flex items-center gap-2.5 px-4 text-ink-400 hover:border-brand-300"
          >
            <Icon name="search" size={17} />
            <span className="text-[14px] flex-1 text-left">Search professionals</span>
            <Icon name="next" size={16} />
          </button>
        </div>

        {/* My cases */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[15px] font-semibold text-ink-900">My Cases</p>
            <button onClick={() => navigate('cases')} className="text-[13px] font-semibold text-brand-600">View all</button>
          </div>
          <div className="space-y-2">
            {d.proId && (
              <Card onClick={() => navigate('status')} className="p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="wrench" size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-ink-900 truncate">Kitchen Sink Leak</p>
                  <p className="text-[12px] text-ink-500 truncate">{active ? active.label : 'Completed'}</p>
                </div>
                <Tone tone="brand">Active</Tone>
              </Card>
            )}
            {PAST_CASES.slice(0, 2).map(c => (
              <Card key={c.id} onClick={() => navigate('cases')} className="p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-ink-100 text-ink-500 flex items-center justify-center flex-shrink-0">
                  <Icon name="cases" size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-ink-900 truncate">{c.title}</p>
                  <p className="text-[12px] text-ink-500 truncate">{c.state}</p>
                </div>
                <Tone tone={c.tone}>{c.when}</Tone>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── 02. Notifications ────────────────────────────────────────────────────────

const NOTE_ICON: Record<string, { icon: string; cls: string }> = {
  assessment: { icon: 'doc', cls: 'bg-brand-50 text-brand-600' },
  inspection: { icon: 'calendar', cls: 'bg-warning-100 text-warning-700' },
  quote: { icon: 'wallet', cls: 'bg-brand-50 text-brand-600' },
  payment: { icon: 'card', cls: 'bg-success-100 text-success-700' },
  done: { icon: 'check', cls: 'bg-success-100 text-success-700' },
  review: { icon: 'star', cls: 'bg-warning-100 text-warning-700' },
}

export function NotificationsScreen({ navigate, goBack }: NavProps) {
  const { set } = useDemo()
  const [cleared, setCleared] = useState(false)

  return (
    <div className="pb-6 bg-white min-h-full">
      <Header
        title="Notifications"
        onBack={goBack}
        right={
          <button onClick={() => { setCleared(true); set({ notificationsRead: true }) }} aria-label="Clear all" className="w-9 h-9 rounded-full flex items-center justify-center text-ink-500 hover:bg-ink-100">
            <Icon name="x" size={18} />
          </button>
        }
      />
      {cleared ? (
        <div className="pt-24 flex flex-col items-center gap-2 text-center px-10 fade-in">
          <span className="text-ink-300"><Icon name="bell" size={34} /></span>
          <p className="text-[14px] text-ink-500">You are all caught up.</p>
        </div>
      ) : (
        <div className="divide-y divide-ink-100">
          {NOTIFICATIONS.map(n => {
            const style = NOTE_ICON[n.kind]
            return (
              <button
                key={n.id}
                onClick={() => { set({ notificationsRead: true }); navigate(n.to) }}
                className="w-full flex items-start gap-3 px-5 py-3.5 text-left hover:bg-ink-50 transition-colors"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${style.cls}`}>
                  <Icon name={style.icon} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] text-ink-800 leading-snug">{n.title}</p>
                  <p className="text-[11.5px] text-ink-400 mt-1">{n.time}</p>
                </div>
                <span className="text-ink-300 mt-2"><Icon name="next" size={15} /></span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── 03. Select location ──────────────────────────────────────────────────────

export function LocationScreen({ goBack }: NavProps) {
  const { d, set } = useDemo()
  const [q, setQ] = useState('')
  const [picked, setPicked] = useState(d.location)
  const list = LOCATIONS.filter(l => l.toLowerCase().includes(q.toLowerCase()))

  const Option = ({ name, note }: { name: string; note?: string }) => (
    <button
      onClick={() => setPicked(name)}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-ink-50 text-left transition-colors"
    >
      <div className="flex-1">
        <p className="text-[14px] text-ink-800">{name}</p>
        {note && <p className="text-[11.5px] text-ink-400">{note}</p>}
      </div>
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          picked === name ? 'border-brand-600' : 'border-ink-300'
        }`}
      >
        {picked === name && <div className="w-2.5 h-2.5 rounded-full bg-brand-600" />}
      </div>
    </button>
  )

  return (
    <div className="bg-white min-h-full flex flex-col">
      <Header title="Select Location" onBack={goBack} />
      <div className="px-5 pt-4">
        <div className="h-11 rounded-xl border border-ink-200 flex items-center gap-2 px-3.5 focus-within:border-brand-500">
          <span className="text-ink-400"><Icon name="search" size={17} /></span>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search location"
            className="flex-1 text-[14px] outline-none placeholder:text-ink-400"
          />
        </div>
      </div>

      <div className="flex-1 mt-5">
        <Label className="px-5 mb-1">Current Location</Label>
        <div className="border-y border-ink-100">
          <Option name={d.location} note="Default" />
        </div>

        <Label className="px-5 mt-5 mb-1">Popular Areas</Label>
        <div className="border-t border-ink-100 divide-y divide-ink-100">
          {list.filter(l => l !== d.location).map(l => <Option key={l} name={l} />)}
          {list.length === 0 && <p className="px-5 py-6 text-[13px] text-ink-400">No area matches “{q}”.</p>}
        </div>
      </div>

      <div className="p-5 sticky bottom-0 bg-white border-t border-ink-100">
        <Btn onClick={() => { set({ location: picked }); goBack() }}>Confirm Location</Btn>
      </div>
    </div>
  )
}

// ── 04. Camera / media ───────────────────────────────────────────────────────

export function CameraScreen({ goBack }: NavProps) {
  const { d, set } = useDemo()
  const [mode, setMode] = useState<'Photo' | 'Video'>('Photo')
  const [flash, setFlash] = useState(false)

  const capture = () => {
    setFlash(true)
    set(mode === 'Photo' ? { photos: d.photos + 1 } : { videos: d.videos + 1 })
    setTimeout(goBack, 260)
  }

  return (
    <div className="h-full bg-ink-950 flex flex-col text-white relative">
      {flash && <div className="absolute inset-0 bg-white z-50 fade-in" />}

      <div className="flex items-center justify-between px-3 h-14 flex-shrink-0">
        <button onClick={goBack} aria-label="Close" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/15">
          <Icon name="x" size={20} />
        </button>
        <p className="text-[15px] font-semibold">Add Photo or Video</p>
        <button aria-label="Flash" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/15">
          <Icon name="sparkle" size={19} />
        </button>
      </div>

      <div className="flex justify-center gap-1 pb-3 flex-shrink-0">
        {(['Photo', 'Video'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-6 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${
              mode === m ? 'bg-white text-ink-900' : 'text-white/60 hover:text-white'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Viewfinder */}
      <div className="flex-1 mx-4 rounded-2xl relative overflow-hidden" style={{ background: 'linear-gradient(160deg,#3F4A57,#1B222B)' }}>
        <div className="absolute inset-0 flex items-center justify-center text-white/25">
          <Icon name="image" size={60} />
        </div>
        {['top-4 left-4 border-t-2 border-l-2', 'top-4 right-4 border-t-2 border-r-2', 'bottom-4 left-4 border-b-2 border-l-2', 'bottom-4 right-4 border-b-2 border-r-2'].map(c => (
          <div key={c} className={`absolute w-7 h-7 border-white/70 rounded-sm ${c}`} />
        ))}
        {mode === 'Video' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 rounded-full px-2.5 py-1">
            <span className="w-2 h-2 rounded-full bg-danger-600 soft-pulse" />
            <span className="text-[11px] font-semibold">00:00</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-around py-7 flex-shrink-0">
        <button aria-label="Gallery" className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center hover:bg-white/25">
          <Icon name="image" size={20} />
        </button>
        <button onClick={capture} aria-label="Capture" className="w-[70px] h-[70px] rounded-full border-4 border-white/70 p-1 active:scale-95 transition-transform">
          <div className={`w-full h-full rounded-full ${mode === 'Video' ? 'bg-danger-600' : 'bg-white'}`} />
        </button>
        <button aria-label="Flip camera" className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center hover:bg-white/25">
          <Icon name="flip" size={20} />
        </button>
      </div>
    </div>
  )
}

// ── 05. Problem definition ───────────────────────────────────────────────────

export function ProblemScreen({ navigate, goBack }: NavProps) {
  const { d, set, advance } = useDemo()
  const [editing, setEditing] = useState(false)

  return (
    <div className="bg-white min-h-full pb-8">
      <Header
        title="Problem Definition"
        onBack={goBack}
        right={
          <button onClick={() => setEditing(e => !e)} aria-label="Edit" className="w-9 h-9 rounded-full flex items-center justify-center text-brand-600 hover:bg-brand-50">
            <Icon name="edit" size={17} />
          </button>
        }
      />

      <div className="px-5 pt-4 space-y-5">
        <div>
          <Label className="mb-1.5">Problem</Label>
          <div className={`rounded-xl border p-3.5 ${editing ? 'border-brand-500 bg-white' : 'border-ink-200 bg-ink-50'}`}>
            {editing ? (
              <textarea
                autoFocus
                value={d.problem}
                onChange={e => set({ problem: e.target.value.slice(0, 500) })}
                rows={3}
                className="w-full text-[14px] text-ink-800 leading-relaxed resize-none outline-none bg-transparent"
              />
            ) : (
              <p className="text-[14px] text-ink-800 leading-relaxed">{d.problem}</p>
            )}
          </div>
        </div>

        <div>
          <Label className="mb-1.5">Location</Label>
          <button
            onClick={() => navigate('location')}
            className="w-full rounded-xl border border-ink-200 bg-ink-50 px-3.5 py-3 flex items-center gap-2 hover:border-brand-300"
          >
            <span className="text-brand-600"><Icon name="pin" size={17} /></span>
            <span className="text-[14px] text-ink-800 flex-1 text-left">{d.location}</span>
            <span className="text-ink-400"><Icon name="next" size={15} /></span>
          </button>
        </div>

        <div>
          <Label className="mb-1.5">Media</Label>
          <div className="grid grid-cols-3 gap-2">
            <Photo h={74} label={`${d.photos} photo${d.photos === 1 ? '' : 's'}`} hue={205} />
            <div className="relative">
              <Photo h={74} label="0:19" hue={195} />
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <Icon name="play" size={22} fill />
              </div>
            </div>
            <button
              onClick={() => navigate('camera')}
              className="h-[74px] rounded-xl border-2 border-dashed border-ink-200 flex flex-col items-center justify-center gap-1 text-ink-400 hover:border-brand-400 hover:text-brand-600"
            >
              <Icon name="plus" size={18} />
              <span className="text-[10px] font-semibold">Add</span>
            </button>
          </div>
          {d.voice && (
            <div className="mt-2 flex items-center gap-3 rounded-xl border border-ink-200 px-3.5 py-2.5">
              <span className="text-brand-600"><Icon name="mic" size={17} /></span>
              <div className="flex-1 flex items-end gap-[3px] h-6">
                {Array.from({ length: 22 }).map((_, i) => (
                  <span
                    key={i}
                    className="wave-bar flex-1 bg-brand-300 rounded-full"
                    style={{ height: `${25 + ((i * 37) % 70)}%`, animationDelay: `${(i % 6) * 0.1}s` }}
                  />
                ))}
              </div>
              <span className="text-[11px] text-ink-500 font-medium">0:10</span>
            </div>
          )}
        </div>

        <div>
          <Label className="mb-1">Submitted on</Label>
          <p className="text-[13px] text-ink-600">{d.submittedAt}</p>
        </div>

        <Btn variant="secondary" onClick={() => setEditing(e => !e)}>
          {editing ? 'Done Editing' : 'Edit Request'}
        </Btn>

        <div>
          <Label className="mb-2">Choose next step</Label>
          <div className="space-y-2.5">
            <Card onClick={() => { advance(1); navigate('ai-analysis') }} className="p-4 flex items-center gap-3 border-brand-200 bg-brand-50">
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0">
                <Icon name="sparkle" size={18} />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-ink-900">Analyze with AI</p>
                <p className="text-[12px] text-ink-500">Let our AI find the best matches</p>
              </div>
              <span className="text-brand-600"><Icon name="next" size={17} /></span>
            </Card>
            <Card onClick={() => { advance(1); navigate('find-pros') }} className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-ink-100 text-ink-600 flex items-center justify-center flex-shrink-0">
                <Icon name="user" size={18} />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-ink-900">I will do it myself</p>
                <p className="text-[12px] text-ink-500">Browse and pick a professional</p>
              </div>
              <span className="text-ink-400"><Icon name="next" size={17} /></span>
            </Card>
          </div>
        </div>

        <Row icon="info" label="Your request is only shared with the professional you select." />
      </div>
    </div>
  )
}
