import { useState } from 'react'
import { NavProps } from '../types'
import { BackButton } from '../components/Shared'

// ── Active Job ★ ─────────────────────────────────────────────────────────────

const TIMELINE = [
  { label: 'Request understood', detail: 'Sink leak · Colombo 05', done: true, step: 0 },
  { label: 'Chamod selected', detail: '94% match · TRUST 92', done: true, step: 1 },
  { label: 'Inspection complete', detail: 'Damaged connector confirmed', done: true, step: 2 },
  { label: 'Quote approved', detail: 'LKR 6,900 · 2:31 PM', done: true, step: 3 },
  { label: 'Repair in progress', detail: 'Est. 35 min remaining', active: true, step: 4 },
  { label: 'Customer verification', detail: null, done: false, step: 5 },
  { label: 'Job completed', detail: null, done: false, step: 6 },
]

export function ActiveJobScreen({ navigate, goBack }: NavProps) {
  const [expanded, setExpanded] = useState<number | null>(4)
  return (
    <div className="h-full bg-ink-50 flex flex-col">
      <div className="flex items-center px-4 pt-4 pb-2">
        <BackButton onPress={goBack} />
        <p className="text-[15px] font-semibold text-ink-900 mx-auto pr-10">Active Job</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scroll px-6 pt-2 pb-8">
        <p className="text-[11px] font-data text-teal-800 tracking-widest mb-1">KITCHEN SINK REPAIR</p>
        <h1 className="font-display text-[26px] text-ink-900 leading-tight mb-1">Repair in progress</h1>
        <p className="text-[13px] text-ink-400 mb-5">Chamod Fernando · Started 2:47 PM</p>

        {/* Current status card */}
        <div className="bg-teal-800 rounded-2xl px-5 py-4 mb-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="9" cy="9" r="3"/>
              <path d="M15.5 3L11 7.5M2.5 15L7 10.5M2.5 3L7 7.5M15.5 15L11 10.5"/>
            </svg>
          </div>
          <div>
            <p className="text-teal-200 text-[11px] font-data tracking-widest">CURRENT STATUS</p>
            <p className="text-white font-semibold text-[16px] mt-0.5">Connector replacement underway</p>
          </div>
        </div>

        {/* Timeline */}
        <p className="text-[11px] font-data text-ink-400 tracking-widest mb-4">JOB TIMELINE</p>
        <div className="relative">
          <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-ink-200" />
          {TIMELINE.map(({ label, detail, done, active, step }) => (
            <div key={step}>
              <button
                className={`w-full flex items-start gap-4 py-2.5 text-left ${!done && !active ? 'opacity-35' : ''}`}
                onClick={() => setExpanded(expanded === step ? null : step)}
              >
                <div className={`relative z-10 w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${done ? 'bg-teal-700' : active ? 'bg-teal-800 timeline-active' : 'bg-ink-200'}`}>
                  {done
                    ? <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M2 5.5L4.5 8L9 3"/></svg>
                    : active
                    ? <div className="w-2 h-2 rounded-full bg-white" />
                    : <div className="w-1.5 h-1.5 rounded-full bg-ink-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[14px] leading-snug ${active ? 'font-semibold text-ink-900' : done ? 'font-medium text-ink-700' : 'text-ink-400'}`}>
                    {label}
                  </p>
                  {detail && <p className="text-[12px] text-ink-400 mt-0.5 font-data">{detail}</p>}
                </div>
                {(done || active) && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#9BA3AF" strokeWidth="1.6" className={`mt-1 flex-shrink-0 transition-transform ${expanded === step ? 'rotate-180' : ''}`}>
                    <path d="M3 5L7 9L11 5"/>
                  </svg>
                )}
              </button>

              {expanded === step && active && (
                <div className="ml-10 mb-3 bg-teal-50 rounded-xl border border-teal-200 p-4">
                  <p className="text-[13px] font-semibold text-teal-800 mb-1">Repair underway</p>
                  <p className="text-[13px] text-ink-600 leading-relaxed">Chamod is replacing the connector and will run a pressure test before finishing.</p>
                  <p className="text-[12px] text-ink-400 mt-2 font-data">Est. 35 min remaining</p>
                </div>
              )}
              {expanded === step && done && step === 3 && (
                <div className="ml-10 mb-3 bg-white rounded-xl border border-ink-200 p-4">
                  <p className="text-[13px] text-ink-600">You approved LKR 6,900 at 2:31 PM today.</p>
                </div>
              )}
              {expanded === step && done && step === 2 && (
                <div className="ml-10 mb-3 bg-white rounded-xl border border-ink-200 p-4">
                  <p className="text-[13px] text-ink-600">Damaged compression fitting found. Connector replacement recommended.</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick action */}
        <button
          onClick={() => navigate('completion')}
          className="w-full mt-5 h-11 border border-ink-200 rounded-xl text-[14px] font-medium text-ink-600 hover:border-teal-700 hover:text-teal-800 transition-colors"
        >
          Skip to verification →
        </button>
      </div>
    </div>
  )
}

// ── Completion Verification ─────────────────────────────────────────────────

const VERIFY_ITEMS = ['Connector replaced', 'Pressure test passed', 'No active leaks', 'Area cleaned up']

export function CompletionScreen({ navigate, goBack }: NavProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const toggle = (item: string) => setChecked(prev => {
    const next = new Set(prev)
    next.has(item) ? next.delete(item) : next.add(item)
    return next
  })
  return (
    <div className="h-full bg-ink-50 flex flex-col">
      <div className="flex items-center px-4 pt-4 pb-2">
        <BackButton onPress={goBack} />
        <p className="text-[15px] font-semibold text-ink-900 mx-auto pr-10">Verify Completion</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scroll px-6 pt-4 pb-8">
        <p className="text-[11px] font-data text-teal-800 tracking-widest mb-2">READY FOR VERIFICATION</p>
        <h1 className="font-display text-[26px] text-ink-900 leading-tight mb-1.5">
          Chamod says the<br />job is complete
        </h1>
        <p className="text-[14px] text-ink-400 mb-6 leading-relaxed">
          Please verify the work before we release payment.
        </p>

        {/* Completion photos */}
        <p className="text-[11px] font-data text-ink-400 tracking-widest mb-3">COMPLETION PHOTOS</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=180&h=130&fit=crop',
            'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=180&h=130&fit=crop',
          ].map((url, i) => (
            <div key={i} className="rounded-xl overflow-hidden bg-ink-200 aspect-video">
              <img src={url} alt={`Completion photo ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Checklist */}
        <p className="text-[11px] font-data text-ink-400 tracking-widest mb-3">VERIFY EACH ITEM</p>
        <div className="space-y-2 mb-4">
          {VERIFY_ITEMS.map(item => {
            const isChecked = checked.has(item)
            return (
              <button
                key={item}
                onClick={() => toggle(item)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-colors text-left
                  ${isChecked ? 'bg-success-100 border-success-700/25' : 'bg-white border-ink-200 hover:border-ink-300'}`}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isChecked ? 'bg-success-700 border-success-700' : 'border-ink-300'}`}>
                  {isChecked && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M1.5 5L4 7.5L8.5 2.5"/>
                    </svg>
                  )}
                </div>
                <span className={`text-[14px] ${isChecked ? 'text-success-800 font-medium' : 'text-ink-800'}`}>{item}</span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="px-6 pb-10 pt-3">
        <button
          onClick={() => navigate('resolved')}
          disabled={checked.size < VERIFY_ITEMS.length}
          className={`w-full h-14 rounded-2xl font-semibold text-[15px] transition-colors ${checked.size === VERIFY_ITEMS.length ? 'bg-teal-800 text-white hover:bg-teal-900' : 'bg-ink-200 text-ink-400 cursor-not-allowed'}`}
        >
          {checked.size < VERIFY_ITEMS.length ? `Verify ${checked.size} / ${VERIFY_ITEMS.length} items` : 'Mark Job Complete'}
        </button>
      </div>
    </div>
  )
}

// ── Resolved ★ ───────────────────────────────────────────────────────────────

export function ResolvedScreen({ navigate }: NavProps) {
  return (
    <div className="h-full bg-ink-900 flex flex-col items-center justify-center px-8 text-center">
      <div className="resolved-enter mb-8">
        <div className="w-14 h-14 bg-teal-800 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M4 12L9.5 17.5L20 7"/>
          </svg>
        </div>
        <p className="font-data text-[11px] text-teal-400 tracking-[0.3em] mb-3">RESOLVED</p>
        <h1 className="font-display text-[40px] text-white leading-[1.05]">
          Kitchen<br />sink leak
        </h1>
      </div>

      {/* Summary */}
      <div className="w-full bg-white/6 rounded-2xl border border-white/10 divide-y divide-white/10 mb-7">
        {[
          { label: 'Repair time', value: '42 min' },
          { label: 'Total cost', value: 'LKR 6,900' },
          { label: 'Technician', value: 'Chamod Fernando' },
          { label: 'Date', value: 'August 19, 2026' },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-5 py-3.5">
            <span className="text-[13px] text-white/45">{label}</span>
            <span className="text-[13px] font-medium text-white">{value}</span>
          </div>
        ))}
      </div>

      {/* Service record saved */}
      <div className="w-full flex items-center gap-3 bg-teal-800/35 rounded-xl border border-teal-700/40 px-4 py-3.5 mb-6">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#5DD0D0" strokeWidth="1.8" strokeLinecap="round">
          <path d="M8 1.5L2 4V8C2 11.3 4.8 14 8 15C11.2 14 14 11.3 14 8V4L8 1.5Z"/>
          <path d="M5.5 8L7 9.5L10.5 6"/>
        </svg>
        <p className="text-[13px] text-teal-200 font-semibold">Digital service record saved</p>
      </div>

      <button
        onClick={() => navigate('review')}
        className="w-full h-14 bg-teal-700 text-white rounded-2xl font-semibold text-[15px] hover:bg-teal-600 transition-colors mb-3"
      >
        Leave Verified Review
      </button>
      <button
        onClick={() => navigate('home')}
        className="text-[14px] text-white/40 hover:text-white/70 transition-colors"
      >
        Return to home
      </button>
    </div>
  )
}

// ── Verified Review ──────────────────────────────────────────────────────────

export function ReviewScreen({ navigate, goBack }: NavProps) {
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="h-full bg-ink-50 flex flex-col items-center justify-center px-8 text-center">
        <div className="w-14 h-14 bg-success-100 rounded-full flex items-center justify-center mb-4 scale-in">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1D7A47" strokeWidth="2.5" strokeLinecap="round">
            <path d="M4 12L9 17L20 6"/>
          </svg>
        </div>
        <p className="font-display text-[26px] text-ink-900 mb-2">Review submitted.</p>
        <p className="text-[14px] text-ink-400 mb-2 leading-relaxed">
          Your review is verified and will strengthen Chamod's Trust Score.
        </p>
        <p className="text-[12px] text-ink-300 mb-8">Only verified completed jobs can produce reviews.</p>
        <button onClick={() => navigate('home')} className="h-12 px-8 bg-teal-800 text-white rounded-2xl font-semibold text-[15px]">
          Done
        </button>
      </div>
    )
  }

  return (
    <div className="h-full bg-ink-50 flex flex-col">
      <div className="flex items-center px-4 pt-4 pb-1">
        <BackButton onPress={goBack} />
        <p className="text-[15px] font-semibold text-ink-900 mx-auto pr-10">Verified Review</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scroll px-6 pt-5 pb-8">
        <div className="flex items-center gap-1.5 mb-5">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#1D7A47" strokeWidth="1.8" strokeLinecap="round">
            <path d="M6.5 1L2 3.5V6.5C2 9.3 4 11.7 6.5 12.5C9 11.7 11 9.3 11 6.5V3.5L6.5 1Z" fill="#E8F5EE"/>
            <path d="M4.5 6.5L5.8 7.8L8.5 5"/>
          </svg>
          <span className="text-[12px] text-success-700 font-semibold">Verified completed job · August 19, 2026</span>
        </div>

        <p className="font-display text-[26px] text-ink-900 mb-7">How did Chamod do?</p>

        {/* Star rating */}
        <p className="text-[11px] font-data text-ink-400 tracking-widest mb-3">OVERALL RATING</p>
        <div className="flex gap-2 mb-7">
          {[1, 2, 3, 4, 5].map(s => (
            <button
              key={s}
              onClick={() => setRating(s)}
              className="flex-1 aspect-square rounded-xl border-2 flex items-center justify-center text-xl transition-colors"
              style={{
                borderColor: s <= rating ? '#0B6B6B' : '#E2E4E8',
                background: s <= rating ? '#E0F2F2' : 'white',
              }}
            >
              ⭐
            </button>
          ))}
        </div>

        {/* Category scores */}
        <p className="text-[11px] font-data text-ink-400 tracking-widest mb-4">SPECIFIC ASPECTS</p>
        <div className="space-y-3.5 mb-6">
          {['Arrived on time', 'Quality of work', 'Communication', 'Cleanliness'].map(aspect => (
            <div key={aspect} className="flex items-center justify-between">
              <span className="text-[14px] text-ink-700">{aspect}</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <div key={s} className="w-5 h-5 rounded-full" style={{ background: s <= 4 ? '#0B6B6B' : '#E2E4E8' }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Text review */}
        <p className="text-[11px] font-data text-ink-400 tracking-widest mb-2">WRITTEN REVIEW</p>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Share your experience..."
          className="w-full h-24 rounded-xl border border-ink-200 p-4 text-[14px] text-ink-900 resize-none focus:outline-none focus:border-teal-700 bg-white"
        />
        <p className="text-[12px] text-ink-400 mt-3 leading-relaxed">
          Only customers with a verified completed job can leave reviews. This keeps feedback trustworthy and credible.
        </p>
      </div>
      <div className="px-6 pb-10 pt-3">
        <button
          onClick={() => setSubmitted(true)}
          disabled={rating === 0}
          className={`w-full h-14 rounded-2xl font-semibold text-[15px] transition-colors ${rating > 0 ? 'bg-teal-800 text-white hover:bg-teal-900' : 'bg-ink-200 text-ink-400 cursor-not-allowed'}`}
        >
          Submit Verified Review
        </button>
      </div>
    </div>
  )
}

// ── My Home ──────────────────────────────────────────────────────────────────

const HOME_RECORDS = [
  { room: 'Kitchen', service: 'Sink connector replaced', tech: 'Chamod Fernando', date: 'August 2026', warranty: 'Warranty until November 2026', roomColor: 'bg-teal-100 text-teal-800' },
  { room: 'Bedroom AC', service: 'Full service & filter replacement', tech: 'Samith Rajapaksa', date: 'July 2026', warranty: null, roomColor: 'bg-ink-100 text-ink-700' },
  { room: 'Electrical', service: 'Safety inspection', tech: 'Nuwan Silva', date: 'March 2026', warranty: 'Certificate valid', roomColor: 'bg-gold-100 text-gold-600' },
  { room: 'Bathroom', service: 'Shower valve replacement', tech: 'Chamod Fernando', date: 'December 2025', warranty: null, roomColor: 'bg-ink-100 text-ink-700' },
]

export function MyHomeScreen({ goBack }: NavProps) {
  return (
    <div className="h-full bg-ink-50 flex flex-col">
      <div className="px-6 pt-5 pb-3">
        <p className="text-[11px] font-data text-teal-800 tracking-widest mb-1">12B GALLE ROAD, COLOMBO 05</p>
        <h1 className="font-display text-[30px] text-ink-900 leading-tight">My Home</h1>
        <p className="text-[14px] text-ink-400 mt-1">Service history & maintenance records</p>
      </div>

      <div className="flex-1 overflow-y-auto no-scroll px-6 pb-8">
        {/* Property overview */}
        <div className="bg-ink-900 rounded-2xl p-5 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-teal-800/25 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-20 w-16 h-16 bg-teal-900/30 rounded-full translate-y-6" />
          <p className="text-[11px] font-data text-ink-300 tracking-widest mb-1 relative z-10">YOUR HOME</p>
          <p className="font-display text-[24px] text-white mb-4 relative z-10">Apartment 3F</p>
          <div className="flex gap-6 relative z-10">
            {[{ val: '7', label: 'Jobs done' }, { val: '2', label: 'Warranties' }, { val: '3', label: 'Spaces' }].map(({ val, label }) => (
              <div key={label}>
                <p className="font-data text-[20px] text-white font-medium">{val}</p>
                <p className="text-[12px] text-ink-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] font-data text-ink-400 tracking-widest mb-4">SERVICE HISTORY</p>
        <div className="space-y-3">
          {HOME_RECORDS.map(({ room, service, tech, date, warranty, roomColor }) => (
            <div key={service} className="bg-white rounded-xl border border-ink-200 p-4">
              <div className="flex items-start gap-3">
                <span className={`text-[11px] font-semibold font-data px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5 ${roomColor}`}>
                  {room}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-ink-900 mb-0.5">{service}</p>
                  <p className="text-[12px] text-ink-400">{tech} · {date}</p>
                  {warranty && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="#1D7A47" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M5.5 1L1.5 3V5.5C1.5 8 3.4 10 5.5 10.5C7.6 10 9.5 8 9.5 5.5V3L5.5 1Z"/>
                      </svg>
                      <span className="text-[11px] text-success-700 font-semibold">{warranty}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 h-11 border-2 border-dashed border-ink-200 text-ink-400 rounded-xl text-[14px] hover:border-teal-600 hover:text-teal-800 transition-colors">
          + Add a space
        </button>
      </div>
    </div>
  )
}
