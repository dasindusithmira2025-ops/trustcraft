import { useState } from 'react'
import type { NavProps } from '../types'
import { useDemo, LOCATIONS, NOTIFICATIONS, PAST_CASES, PROFILE } from '../store'
import { CATEGORIES, guessCategory, titleFrom, type ServiceType } from '../case'
import {
  useCase, addAttachment, removeAttachment, updateDraft, submitRequest, toast,
} from '../caseStore'
import { pickMedia, useVoiceRecorder, mmss } from '../media'
import {
  AttachmentGrid, Avatar, Btn, Card, Header, Icon, Label, Overlay, Row, Tone,
} from '../components/UI'

// ── Media capture ────────────────────────────────────────────────────────────
// Photo, Video and Voice are three separate actions. Photo and Video open the
// OS picker/camera for that type only; Voice opens the recorder sheet and
// never touches the picker.

function VoiceSheet({ onClose }: { onClose: () => void }) {
  const { state, seconds, error, take, start, stop, discard } = useVoiceRecorder()

  const attach = () => {
    if (!take) return
    addAttachment(take)
    toast('Voice note attached')
    onClose()
  }

  return (
    <Overlay>
    <div className="absolute inset-0 z-40 flex flex-col justify-end" role="dialog" aria-label="Record a voice note">
      <button className="absolute inset-0 bg-black/45" onClick={onClose} aria-label="Close" />
      <div className="relative bg-white rounded-t-3xl p-5 pb-7 fade-up">
        <div className="w-10 h-1 rounded-full bg-ink-200 mx-auto mb-4" />
        <p className="text-[16px] font-bold text-ink-900 text-center">Record a voice note</p>
        <p className="text-[12.5px] text-ink-500 text-center mt-1">
          Describe the problem out loud — your professional hears exactly what you said.
        </p>

        <div className="flex flex-col items-center py-7">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {state === 'recording' && <span className="absolute inset-0 rounded-full bg-danger-100 soft-pulse" />}
            <div
              className={`relative w-[76px] h-[76px] rounded-full flex items-center justify-center ${
                state === 'recording' ? 'bg-danger-600 text-white' : state === 'ready' ? 'bg-success-600 text-white' : 'bg-brand-50 text-brand-600'
              }`}
            >
              <Icon name={state === 'ready' ? 'check' : 'mic'} size={32} />
            </div>
          </div>
          <p className="text-[22px] font-bold text-ink-900 tabular-nums mt-3">{mmss(seconds)}</p>
          <p className="text-[12px] text-ink-500 mt-0.5">
            {state === 'idle' && 'Tap start when you are ready'}
            {state === 'requesting' && 'Waiting for microphone permission…'}
            {state === 'recording' && 'Recording…'}
            {state === 'ready' && 'Recording ready — play it back below'}
          </p>
          {error && <p className="text-[11.5px] text-warning-700 mt-2 text-center px-4 leading-relaxed">{error}</p>}
        </div>

        {state === 'ready' && take && (
          <div className="mb-4">
            <AttachmentGrid items={[take]} />
          </div>
        )}

        {state === 'idle' && <Btn icon="mic" onClick={start}>Start Recording</Btn>}
        {(state === 'recording' || state === 'requesting') && (
          <Btn variant="danger" icon="stop" onClick={stop}>
            {state === 'requesting' ? 'Cancel & Save Placeholder' : 'Stop Recording'}
          </Btn>
        )}
        {state === 'ready' && (
          <div className="space-y-2.5">
            <Btn onClick={attach}>Attach Recording</Btn>
            <Btn variant="ghost" icon="mic" onClick={discard}>Record Again</Btn>
          </div>
        )}
        <button onClick={onClose} className="w-full text-[13px] font-semibold text-ink-500 pt-3.5">Cancel</button>
      </div>
    </div>
    </Overlay>
  )
}

/** The photo / video / voice / location row shared by Home and Problem. */
export function MediaBar({ onLocation }: { onLocation: () => void }) {
  const [voice, setVoice] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)

  const pick = async (kind: 'photo' | 'video') => {
    setBusy(kind)
    const a = await pickMedia(kind)
    setBusy(null)
    if (!a) return
    addAttachment(a)
    toast(kind === 'photo' ? 'Photo attached' : 'Video attached')
  }

  const items: { icon: string; label: string; run: () => void }[] = [
    { icon: 'camera', label: 'Photo', run: () => pick('photo') },
    { icon: 'video', label: 'Video', run: () => pick('video') },
    { icon: 'mic', label: 'Voice', run: () => setVoice(true) },
    { icon: 'pin', label: 'Location', run: onLocation },
  ]

  return (
    <>
      <div className="grid grid-cols-4 border-t border-ink-100">
        {items.map(i => (
          <button
            key={i.label}
            onClick={i.run}
            disabled={busy !== null}
            className="flex flex-col items-center gap-1 py-2.5 text-ink-600 hover:bg-brand-50 hover:text-brand-600 transition-colors border-r last:border-r-0 border-ink-100 disabled:opacity-50"
          >
            <Icon name={i.icon} size={18} />
            <span className="text-[11px] font-medium">{i.label}</span>
          </button>
        ))}
      </div>
      {voice && <VoiceSheet onClose={() => setVoice(false)} />}
    </>
  )
}

// ── 01. Home ─────────────────────────────────────────────────────────────────

export function HomeScreen({ navigate }: NavProps) {
  const { d, stages, step } = useDemo()
  const c = useCase()
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
              value={c.description}
              onChange={e => updateDraft({ description: e.target.value.slice(0, 500) })}
              placeholder="Type your problem here..."
              rows={3}
              className="w-full px-4 pt-3 text-[14px] text-ink-800 leading-relaxed resize-none outline-none placeholder:text-ink-400"
            />
            <div className="flex justify-end px-4 pb-1.5">
              <span className="text-[11px] text-ink-400">{c.description.length}/500</span>
            </div>
            <MediaBar onLocation={() => navigate('location')} />
          </div>

          {c.attachments.length > 0 && (
            <div className="mt-2.5">
              <AttachmentGrid items={c.attachments} onRemove={removeAttachment} h={68} />
            </div>
          )}

          <div className="flex items-center gap-1.5 mt-2.5 text-[13px]">
            <span className="text-brand-600"><Icon name="pin" size={15} /></span>
            <span className="text-ink-700 flex-1">{c.location}</span>
            <button onClick={() => navigate('location')} className="text-brand-600 font-semibold">Change</button>
          </div>

          <div className="mt-3">
            <Btn onClick={() => navigate('problem')} disabled={!c.description.trim()}>Continue</Btn>
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
            {step > 0 && (
              <Card onClick={() => navigate('status')} className="p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="wrench" size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-ink-900 truncate">{c.title}</p>
                  <p className="text-[12px] text-ink-500 truncate">{active ? active.label : 'Completed'}</p>
                </div>
                {c.serviceType === 'urgent' ? <Tone tone="warning">Urgent</Tone> : <Tone tone="brand">Active</Tone>}
              </Card>
            )}
            {PAST_CASES.slice(0, 2).map(x => (
              <Card key={x.id} onClick={() => navigate('cases')} className="p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-ink-100 text-ink-500 flex items-center justify-center flex-shrink-0">
                  <Icon name="cases" size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-ink-900 truncate">{x.title}</p>
                  <p className="text-[12px] text-ink-500 truncate">{x.state}</p>
                </div>
                <Tone tone={x.tone}>{x.when}</Tone>
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
  const c = useCase()
  const [q, setQ] = useState('')
  const [picked, setPicked] = useState(c.location)
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
          <Option name={c.location} note="Default" />
        </div>

        <Label className="px-5 mt-5 mb-1">Popular Areas</Label>
        <div className="border-t border-ink-100 divide-y divide-ink-100">
          {list.filter(l => l !== c.location).map(l => <Option key={l} name={l} />)}
          {list.length === 0 && <p className="px-5 py-6 text-[13px] text-ink-400">No area matches “{q}”.</p>}
        </div>
      </div>

      <div className="p-5 sticky bottom-0 bg-white border-t border-ink-100">
        <Btn onClick={() => { updateDraft({ location: picked }); goBack() }}>Confirm Location</Btn>
      </div>
    </div>
  )
}

// ── 04. Camera / media ───────────────────────────────────────────────────────
// The in-app capture surface. It records a real attachment so the professional
// sees the same item; with no image assets in the prototype the frame itself
// is represented rather than stored.

export function CameraScreen({ goBack }: NavProps) {
  const [mode, setMode] = useState<'Photo' | 'Video'>('Photo')
  const [flash, setFlash] = useState(false)

  const capture = () => {
    setFlash(true)
    const n = Date.now().toString().slice(-4)
    addAttachment(
      mode === 'Photo'
        ? { id: `a-${n}`, kind: 'photo', name: `capture-${n}.jpg`, hue: 205 }
        : { id: `a-${n}`, kind: 'video', name: `clip-${n}.mp4`, hue: 195, duration: '0:19' },
    )
    toast(`${mode} added`)
    setTimeout(goBack, 260)
  }

  const fromLibrary = async () => {
    const a = await pickMedia(mode === 'Photo' ? 'photo' : 'video')
    if (!a) return
    addAttachment(a)
    toast(`${mode} added`)
    goBack()
  }

  return (
    <div className="h-full bg-ink-950 flex flex-col text-white relative">
      {flash && <div className="absolute inset-0 bg-white z-50 fade-in" />}

      <div className="flex items-center justify-between px-3 h-14 flex-shrink-0">
        <button onClick={goBack} aria-label="Close" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/15">
          <Icon name="x" size={20} />
        </button>
        <p className="text-[15px] font-semibold">Add {mode}</p>
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
        {['top-4 left-4 border-t-2 border-l-2', 'top-4 right-4 border-t-2 border-r-2', 'bottom-4 left-4 border-b-2 border-l-2', 'bottom-4 right-4 border-b-2 border-r-2'].map(x => (
          <div key={x} className={`absolute w-7 h-7 border-white/70 rounded-sm ${x}`} />
        ))}
        {mode === 'Video' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 rounded-full px-2.5 py-1">
            <span className="w-2 h-2 rounded-full bg-danger-600 soft-pulse" />
            <span className="text-[11px] font-semibold">00:00</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-around py-7 flex-shrink-0">
        <button onClick={fromLibrary} aria-label="Choose from library" className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center hover:bg-white/25">
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

const DAYS = [
  { d: 'Sat', n: '24 Aug', full: 'Sat, 24 Aug 2026' },
  { d: 'Sun', n: '25 Aug', full: 'Sun, 25 Aug 2026' },
  { d: 'Mon', n: '26 Aug', full: 'Mon, 26 Aug 2026' },
  { d: 'Tue', n: '27 Aug', full: 'Tue, 27 Aug 2026' },
]
const TIMES = ['10:00 AM', '1:30 PM', '4:00 PM', '5:30 PM', '6:30 PM']

export function ProblemScreen({ navigate, goBack }: NavProps) {
  const c = useCase()
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState(false)
  const submitted = c.status !== 'draft'

  // Category follows the customer's words until they pick one themselves.
  const category = c.category || guessCategory(c.description)
  const urgent = c.serviceType === 'urgent'

  const setType = (t: ServiceType) =>
    updateDraft(
      t === 'urgent'
        // An urgent request can never also carry a future slot.
        ? { serviceType: 'urgent', scheduledDate: '', scheduledTime: '' }
        : { serviceType: 'scheduled' },
    )

  const ready = c.description.trim().length > 0 && (urgent || (c.scheduledDate && c.scheduledTime))

  const submit = (to: 'ai-analysis' | 'find-pros') => {
    if (busy || !ready) return
    setBusy(true)
    submitRequest({
      title: c.title.trim() || titleFrom(c.description),
      category,
      description: c.description.trim(),
    })
    toast('Request sent')
    setBusy(false)
    navigate(to)
  }

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
          <Label className="mb-1.5">Title</Label>
          <input
            value={c.title}
            onChange={e => updateDraft({ title: e.target.value.slice(0, 60) })}
            placeholder={titleFrom(c.description)}
            className="w-full rounded-xl border border-ink-200 px-3.5 py-3 text-[14px] font-semibold text-ink-900 outline-none focus:border-brand-500 placeholder:font-normal placeholder:text-ink-400"
          />
        </div>

        <div>
          <Label className="mb-1.5">Problem</Label>
          <div className={`rounded-xl border p-3.5 ${editing ? 'border-brand-500 bg-white' : 'border-ink-200 bg-ink-50'}`}>
            {editing ? (
              <textarea
                autoFocus
                value={c.description}
                onChange={e => updateDraft({ description: e.target.value.slice(0, 500) })}
                rows={3}
                className="w-full text-[14px] text-ink-800 leading-relaxed resize-none outline-none bg-transparent"
              />
            ) : (
              <p className="text-[14px] text-ink-800 leading-relaxed">{c.description}</p>
            )}
          </div>
        </div>

        <div>
          <Label className="mb-2">Service Category</Label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(x => {
              const on = category === x.id
              return (
                <button
                  key={x.id}
                  onClick={() => updateDraft({ category: x.id })}
                  className={`h-8 px-3 rounded-full text-[12px] font-semibold border transition-colors ${
                    on ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-ink-600 border-ink-200 hover:border-brand-300'
                  }`}
                >
                  {x.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <Label className="mb-1.5">Location</Label>
          <button
            onClick={() => navigate('location')}
            className="w-full rounded-xl border border-ink-200 bg-ink-50 px-3.5 py-3 flex items-center gap-2 hover:border-brand-300"
          >
            <span className="text-brand-600"><Icon name="pin" size={17} /></span>
            <span className="text-[14px] text-ink-800 flex-1 text-left">{c.location}</span>
            <span className="text-ink-400"><Icon name="next" size={15} /></span>
          </button>
        </div>

        <div>
          <Label className="mb-1.5">Media</Label>
          <div className="border border-ink-200 rounded-2xl overflow-hidden">
            <div className="p-3">
              <AttachmentGrid
                items={c.attachments}
                onRemove={removeAttachment}
                empty={<p className="text-[12.5px] text-ink-400 py-3 text-center">No photos, video or voice yet.</p>}
                extra={
                  <button
                    onClick={() => navigate('camera')}
                    className="h-[74px] rounded-xl border-2 border-dashed border-ink-200 flex flex-col items-center justify-center gap-1 text-ink-400 hover:border-brand-400 hover:text-brand-600"
                  >
                    <Icon name="plus" size={18} />
                    <span className="text-[10px] font-semibold">Add</span>
                  </button>
                }
              />
            </div>
            <MediaBar onLocation={() => navigate('location')} />
          </div>
        </div>

        {/* Urgent vs scheduled — mutually exclusive by construction. */}
        <div>
          <Label className="mb-2">When do you need this?</Label>
          <button
            onClick={() => setType(urgent ? 'scheduled' : 'urgent')}
            aria-pressed={urgent}
            className={`w-full rounded-2xl border p-4 flex items-start gap-3 text-left transition-colors ${
              urgent ? 'border-warning-600/50 bg-warning-100/60' : 'border-ink-200 bg-white hover:border-brand-300'
            }`}
          >
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${urgent ? 'bg-warning-600 text-white' : 'bg-ink-100 text-ink-500'}`}>
              <Icon name="bolt" size={18} fill={urgent} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[14px] font-semibold text-ink-900">Urgent Service</span>
              <span className="block text-[12px] text-ink-600 leading-relaxed mt-0.5">
                Need someone as soon as possible? We will notify professionals who are available right now.
              </span>
            </span>
            <span
              className={`w-11 h-6 rounded-full flex items-center px-0.5 flex-shrink-0 transition-colors ${urgent ? 'bg-warning-600' : 'bg-ink-200'}`}
            >
              <span className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${urgent ? 'translate-x-5' : ''}`} />
            </span>
          </button>

          {urgent ? (
            <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-brand-50 p-3.5 fade-in">
              <span className="text-brand-600 mt-0.5"><Icon name="info" size={16} /></span>
              <p className="text-[12.5px] text-brand-800 leading-relaxed">
                Scheduling is turned off for urgent requests. TrustCraft will search only for
                {' '}{CATEGORIES.find(x => x.id === category)?.label.toLowerCase()} professionals who are available right now
                near {c.location}.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-4 fade-in">
              <div>
                <Label className="mb-2">Preferred Date</Label>
                <div className="grid grid-cols-4 gap-2">
                  {DAYS.map(x => {
                    const on = c.scheduledDate === x.full
                    return (
                      <button
                        key={x.full}
                        onClick={() => updateDraft({ scheduledDate: x.full })}
                        className={`rounded-xl border py-2.5 flex flex-col items-center transition-colors ${
                          on ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-200 text-ink-700 hover:border-brand-300'
                        }`}
                      >
                        <span className="text-[11px] font-medium opacity-80">{x.d}</span>
                        <span className="text-[13px] font-bold">{x.n}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <Label className="mb-2">Preferred Time</Label>
                <div className="grid grid-cols-3 gap-2">
                  {TIMES.map(t => {
                    const on = c.scheduledTime === t
                    return (
                      <button
                        key={t}
                        onClick={() => updateDraft({ scheduledTime: t })}
                        className={`h-10 rounded-xl border text-[13px] font-semibold transition-colors ${
                          on ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-200 text-ink-700 hover:border-brand-300'
                        }`}
                      >
                        {t}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {submitted && (
          <div>
            <Label className="mb-1">Submitted on</Label>
            <p className="text-[13px] text-ink-600">{c.createdAt}</p>
          </div>
        )}

        <Btn variant="secondary" onClick={() => setEditing(e => !e)}>
          {editing ? 'Done Editing' : 'Edit Request'}
        </Btn>

        <div>
          <Label className="mb-2">Submit your request</Label>
          {!ready && (
            <p className="text-[12px] text-warning-700 mb-2">
              {c.description.trim() ? 'Pick a preferred date and time, or switch on Urgent Service.' : 'Describe the problem first.'}
            </p>
          )}
          <div className="space-y-2.5">
            <Card
              onClick={() => submit('ai-analysis')}
              className={`p-4 flex items-center gap-3 border-brand-200 bg-brand-50 ${ready && !busy ? '' : 'opacity-50 pointer-events-none'}`}
            >
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center flex-shrink-0">
                <Icon name="sparkle" size={18} />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-ink-900">{busy ? 'Submitting…' : 'Submit & match with AI'}</p>
                <p className="text-[12px] text-ink-500">
                  {urgent ? 'Find professionals available right now' : 'Let our AI find the best matches'}
                </p>
              </div>
              <span className="text-brand-600"><Icon name="next" size={17} /></span>
            </Card>
            <Card
              onClick={() => submit('find-pros')}
              className={`p-4 flex items-center gap-3 ${ready && !busy ? '' : 'opacity-50 pointer-events-none'}`}
            >
              <div className="w-9 h-9 rounded-xl bg-ink-100 text-ink-600 flex items-center justify-center flex-shrink-0">
                <Icon name="user" size={18} />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-ink-900">I will choose myself</p>
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
