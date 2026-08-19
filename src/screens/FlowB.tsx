import { useState, useEffect } from 'react'
import { NavProps } from '../types'
import { BackButton, TrustBadge } from '../components/Shared'

const PROS = [
  {
    name: 'Chamod Fernando',
    specialty: 'Plumbing · Pipe & Leak Specialist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&auto=format',
    match: 94, trust: 92, available: '42 min', distance: '2.4 km',
    completion: 96, jobs: 46, tag: 'BEST OVERALL', tagBg: 'bg-teal-800',
    reason: '31 verified pipe-leak repairs completed successfully.',
    factors: [
      { label: 'Relevant experience', score: 98 },
      { label: 'Availability', score: 91 },
      { label: 'Distance', score: 95 },
      { label: 'Reliability', score: 96 },
      { label: 'Price fit', score: 82 },
    ],
    reviews: [
      { name: 'Amara S.', text: 'Identified the problem quickly and explained everything clearly. Clean work.', date: 'Jul 2026' },
      { name: 'Priya K.', text: 'Very professional. Fixed the leak in under an hour with no mess.', date: 'Jun 2026' },
    ],
  },
  {
    name: 'Suresh Perera',
    specialty: 'Plumbing · General',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&auto=format',
    match: 91, trust: 87, available: '18 min', distance: '0.9 km',
    completion: 93, jobs: 28, tag: 'FASTEST ARRIVAL', tagBg: 'bg-gold-500',
    reason: 'Closest available professional with a strong completion record.',
    factors: [
      { label: 'Relevant experience', score: 84 },
      { label: 'Availability', score: 98 },
      { label: 'Distance', score: 99 },
      { label: 'Reliability', score: 89 },
      { label: 'Price fit', score: 88 },
    ],
    reviews: [],
  },
  {
    name: 'Dilshan Wijesinghe',
    specialty: 'Plumbing · Maintenance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&auto=format',
    match: 88, trust: 84, available: '65 min', distance: '4.1 km',
    completion: 91, jobs: 19, tag: 'BEST VALUE', tagBg: 'bg-success-700',
    reason: 'Lower inspection fee with a solid reliability record.',
    factors: [
      { label: 'Relevant experience', score: 82 },
      { label: 'Availability', score: 76 },
      { label: 'Distance', score: 72 },
      { label: 'Reliability', score: 91 },
      { label: 'Price fit', score: 97 },
    ],
    reviews: [],
  },
]

// ── Top Matches ★ ───────────────────────────────────────────────────────────

export function TopMatchesScreen({ navigate, goBack }: NavProps) {
  return (
    <div className="h-full bg-ink-50 flex flex-col">
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-start gap-3 mb-1">
          <BackButton onPress={goBack} />
          <div>
            <p className="text-[11px] font-data text-teal-800 tracking-widest mb-0.5">SINK LEAK · PLUMBING</p>
            <h1 className="font-display text-[26px] text-ink-900 leading-tight">Top Matches</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scroll px-5 pb-6 space-y-4">
        {PROS.map((pro, i) => (
          <div
            key={pro.name}
            className={`bg-white rounded-2xl border overflow-hidden cursor-pointer transition-shadow hover:shadow-md
              ${i === 0 ? 'border-teal-300 shadow-sm' : 'border-ink-200'}`}
            onClick={() => navigate('pro-profile')}
          >
            {/* Coloured tag bar */}
            <div className={`${pro.tagBg} px-4 py-2.5 flex items-center justify-between`}>
              <span className="text-white text-[11px] font-data tracking-widest font-medium">{pro.tag}</span>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-white text-[22px] leading-none">{pro.match}</span>
                <span className="text-white/70 text-[13px] font-data">%</span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <img src={pro.avatar} alt={pro.name} className="w-12 h-12 rounded-full object-cover border-2 border-ink-100" />
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-ink-900 truncate">{pro.name}</p>
                  <p className="text-[13px] text-ink-400 truncate">{pro.specialty}</p>
                </div>
                <TrustBadge score={pro.trust} />
              </div>

              {/* Key stats */}
              <div className="grid grid-cols-3 gap-1 mb-4">
                {[
                  { val: pro.available, label: 'Available' },
                  { val: `${pro.completion}%`, label: 'Completion' },
                  { val: pro.distance, label: 'Away' },
                ].map(({ val, label }, j) => (
                  <div key={label} className={`text-center py-2 ${j === 1 ? 'border-x border-ink-100' : ''}`}>
                    <p className="font-data text-[15px] font-medium text-ink-900">{val}</p>
                    <p className="text-[11px] text-ink-400">{label}</p>
                  </div>
                ))}
              </div>

              {/* Why match button */}
              <button
                onClick={e => { e.stopPropagation(); navigate('why-match') }}
                className="w-full h-9 rounded-xl border border-ink-200 text-[13px] font-medium text-ink-500 hover:border-teal-700 hover:text-teal-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="6.5" cy="6.5" r="5"/><path d="M6.5 4.5V7"/><circle cx="6.5" cy="9" r="0.5" fill="currentColor"/>
                </svg>
                Why this match?
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Why This Match ★ ────────────────────────────────────────────────────────

export function WhyMatchScreen({ navigate, goBack }: NavProps) {
  const pro = PROS[0]
  return (
    <div className="h-full bg-ink-50 flex flex-col">
      <div className="flex items-center px-4 pt-4 pb-1">
        <BackButton onPress={goBack} />
        <p className="text-[15px] font-semibold text-ink-900 mx-auto pr-10">Why This Match?</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scroll px-6 pt-5 pb-8">
        {/* Pro header */}
        <div className="flex items-center gap-3 mb-7">
          <img src={pro.avatar} alt={pro.name} className="w-14 h-14 rounded-full object-cover border-2 border-ink-100" />
          <div className="flex-1">
            <p className="text-[16px] font-semibold text-ink-900">{pro.name}</p>
            <p className="text-[13px] text-ink-400">{pro.specialty}</p>
          </div>
          <div className={`${pro.tagBg} rounded-xl px-3 py-1.5 flex items-baseline gap-0.5`}>
            <span className="font-display text-white text-[24px] leading-none">{pro.match}</span>
            <span className="text-white/70 text-[13px] font-data">%</span>
          </div>
        </div>

        <p className="text-[11px] font-data text-ink-400 tracking-widest mb-4">MATCH BREAKDOWN</p>
        <div className="space-y-4 mb-7">
          {pro.factors.map(({ label, score }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[14px] text-ink-700">{label}</span>
                <span className="font-data text-[14px] font-medium text-ink-900">{score}%</span>
              </div>
              <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-700 rounded-full progress-fill" style={{ width: `${score}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Strongest reason */}
        <div className="bg-teal-50 rounded-2xl border border-teal-200 p-5 mb-5">
          <p className="text-[10px] font-data text-teal-700 tracking-widest mb-2">STRONGEST REASON</p>
          <p className="text-[15px] text-ink-900 leading-relaxed font-medium">"{pro.reason}"</p>
        </div>

        {/* Trust score link */}
        <button
          onClick={() => navigate('trust-score')}
          className="w-full bg-white rounded-2xl border border-ink-200 p-4 flex items-center gap-4 hover:border-teal-700 transition-colors"
        >
          <TrustBadge score={pro.trust} size="lg" />
          <div className="flex-1 text-left">
            <p className="text-[14px] font-semibold text-ink-900">View Trust Score</p>
            <p className="text-[12px] text-ink-400">See the evidence behind this score</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#9BA3AF" strokeWidth="1.8" strokeLinecap="round">
            <path d="M5 8H11M9 5.5L11 8L9 10.5"/>
          </svg>
        </button>
      </div>
      <div className="px-6 pb-10 pt-3">
        <button onClick={() => navigate('pro-profile')} className="w-full h-14 bg-teal-800 text-white rounded-2xl font-semibold text-[15px] hover:bg-teal-900 transition-colors">
          View Full Profile
        </button>
      </div>
    </div>
  )
}

// ── Professional Profile ────────────────────────────────────────────────────

export function ProProfileScreen({ navigate, goBack }: NavProps) {
  const pro = PROS[0]
  return (
    <div className="h-full bg-ink-50 flex flex-col">
      {/* Hero */}
      <div className="relative flex-shrink-0" style={{ height: 210 }}>
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=390&h=210&fit=crop&auto=format"
          alt={pro.name}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3"><BackButton onPress={goBack} light /></div>
        <div className="absolute bottom-4 left-5">
          <p className="font-display text-[26px] text-white leading-tight">{pro.name}</p>
          <p className="text-[14px] text-white/65">{pro.specialty}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scroll px-5 pt-5 pb-8">
        {/* Trust + stats */}
        <div className="flex items-center gap-5 mb-5">
          <button onClick={() => navigate('trust-score')}>
            <TrustBadge score={pro.trust} size="lg" />
          </button>
          <div className="flex-1 grid grid-cols-3 gap-1">
            {[{ val: pro.jobs, label: 'Jobs' }, { val: `${pro.completion}%`, label: 'Completion' }, { val: '4.8', label: 'Satisfaction' }].map(({ val, label }, i) => (
              <div key={label} className={`text-center ${i === 1 ? 'border-x border-ink-200' : ''}`}>
                <p className="font-data text-[16px] font-medium text-ink-900">{val}</p>
                <p className="text-[11px] text-ink-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Attributes */}
        <div className="flex flex-wrap gap-2 mb-5">
          {['Leak specialist', 'NIC verified', 'TVEC certified', '7 yrs experience'].map(a => (
            <span key={a} className="text-[12px] font-medium text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">{a}</span>
          ))}
        </div>

        <div className="h-px bg-ink-200 mb-5" />

        <p className="text-[11px] font-data text-ink-400 tracking-widest mb-2">ABOUT</p>
        <p className="text-[14px] text-ink-700 leading-relaxed mb-5">
          Specialises in residential plumbing, particularly pipe leaks and drain repairs. TVEC-certified with 7 years of verified field experience in Colombo and Gampaha districts.
        </p>

        <div className="h-px bg-ink-200 mb-5" />

        <p className="text-[11px] font-data text-ink-400 tracking-widest mb-4">VERIFIED REVIEWS</p>
        {pro.reviews.map(review => (
          <div key={review.name} className="bg-white rounded-xl border border-ink-200 p-4 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 text-[12px] font-semibold">
                {review.name[0]}
              </div>
              <span className="text-[13px] font-medium text-ink-900">{review.name}</span>
              <span className="text-[12px] text-ink-400 ml-auto">{review.date}</span>
            </div>
            <p className="text-[13px] text-ink-600 leading-relaxed mb-2">"{review.text}"</p>
            <div className="flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="#1D7A47">
                <path d="M5.5 1L6.9 4.1H10.1L7.6 5.9L8.7 9L5.5 7.2L2.3 9L3.4 5.9L.9 4.1H4.1L5.5 1Z"/>
              </svg>
              <span className="text-[11px] text-success-700 font-medium">Verified completed job</span>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 pb-10 pt-3">
        <button onClick={() => navigate('booking')} className="w-full h-14 bg-teal-800 text-white rounded-2xl font-semibold text-[15px] hover:bg-teal-900 transition-colors">
          Book Inspection · LKR 1,000
        </button>
      </div>
    </div>
  )
}

// ── Trust Score ★ ────────────────────────────────────────────────────────────

export function TrustScoreScreen({ goBack }: NavProps) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300)
    return () => clearTimeout(t)
  }, [])

  const r = 38, circ = 2 * Math.PI * r
  const score = 92
  const offset = circ * (1 - score / 100)

  const evidence = [
    { group: 'Identity', emoji: '🪪', items: [{ text: 'National ID', note: 'Verified' }] },
    { group: 'Qualification', emoji: '📋', items: [{ text: 'TVEC Vocational Certificate — Level 4', note: 'Verified' }] },
    { group: 'Relevant Work', emoji: '🔧', items: [{ text: '46 verified plumbing jobs', note: null }, { text: '31 pipe-leak repairs', note: null }] },
    { group: 'Reliability', emoji: '✓', items: [{ text: 'Completion rate', note: '96%' }, { text: 'On-time rate', note: '94%' }] },
    { group: 'Satisfaction', emoji: '⭐', items: [{ text: 'Verified customer score', note: '4.8 / 5' }] },
    { group: 'Disputes', emoji: '⚖', items: [{ text: 'Unresolved disputes', note: '0' }] },
    { group: 'Activity', emoji: '⏱', items: [{ text: 'Last active', note: 'This week' }] },
  ]

  return (
    <div className="h-full bg-ink-50 flex flex-col">
      <div className="flex items-center px-4 pt-4 pb-1">
        <BackButton onPress={goBack} />
        <p className="text-[15px] font-semibold text-ink-900 mx-auto pr-10">Trust Score</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scroll px-6 pt-5 pb-8">
        {/* Score ring + label */}
        <div className="flex items-center gap-5 mb-6 fade-in">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg width="96" height="96" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r={r} fill="none" stroke="#E0F2F2" strokeWidth="8" />
              <circle
                cx="48" cy="48" r={r}
                fill="none"
                stroke="#0B6B6B"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={animated ? offset : circ}
                style={{
                  transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'rotate(-90deg)',
                  transformOrigin: '48px 48px',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-data text-[10px] text-teal-700 tracking-widest font-medium">TRUST</span>
              <span className="font-display text-[30px] text-ink-900 leading-none">{score}</span>
            </div>
          </div>
          <div>
            <p className="font-display text-[24px] text-ink-900 mb-1">Excellent</p>
            <div className="flex items-center gap-1.5 mb-2">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="#1D7A47">
                <path d="M6.5 1L2 4V7C2 10 4.2 12.5 6.5 13C8.8 12.5 11 10 11 7V4L6.5 1Z"/>
              </svg>
              <span className="text-[13px] text-success-700 font-semibold">Verified · Active</span>
            </div>
            <p className="text-[12px] text-ink-500 leading-relaxed">Built from verified activity, not claims</p>
          </div>
        </div>

        {/* Philosophy */}
        <div className="bg-ink-900 rounded-2xl px-5 py-4 mb-6">
          <p className="text-[13px] text-white/65 leading-relaxed italic">
            "Trust is built from verified activity — not from claims."
          </p>
        </div>

        <p className="text-[11px] font-data text-ink-400 tracking-widest mb-4">EVIDENCE BREAKDOWN</p>
        <div className="space-y-3">
          {evidence.map(({ group, emoji, items }) => (
            <div key={group} className="bg-white rounded-xl border border-ink-200 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-ink-100 bg-ink-50">
                <p className="text-[12px] font-semibold text-ink-700">
                  {emoji} {group}
                </p>
              </div>
              {items.map(({ text, note }) => (
                <div key={text} className="flex items-center justify-between px-4 py-3">
                  <span className="text-[13px] text-ink-600">{text}</span>
                  {note
                    ? <span className="text-[13px] font-semibold text-teal-800 font-data">{note}</span>
                    : <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#1D7A47" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M3 7L5.5 9.5L11 4"/>
                      </svg>
                  }
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="text-[12px] text-ink-400 text-center mt-5">Updated after last job · August 2026</p>
      </div>
    </div>
  )
}

// ── Booking ─────────────────────────────────────────────────────────────────

export function BookingScreen({ navigate, goBack }: NavProps) {
  const [day, setDay] = useState('Today')
  const [time, setTime] = useState('4:30 PM')
  return (
    <div className="h-full bg-ink-50 flex flex-col">
      <div className="flex items-center px-4 pt-4 pb-1">
        <BackButton onPress={goBack} />
        <p className="text-[15px] font-semibold text-ink-900 mx-auto pr-10">Book Inspection</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scroll px-6 pt-5 pb-6">
        {/* Pro card */}
        <div className="flex items-center gap-3 bg-white rounded-2xl border border-ink-200 p-4 mb-6">
          <img src={PROS[0].avatar} alt={PROS[0].name} className="w-12 h-12 rounded-full object-cover" />
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-ink-900">{PROS[0].name}</p>
            <p className="text-[13px] text-ink-400">Inspection fee: LKR 1,000</p>
          </div>
          <TrustBadge score={PROS[0].trust} />
        </div>

        <p className="text-[11px] font-data text-ink-400 tracking-widest mb-3">DATE</p>
        <div className="flex gap-2 mb-6">
          {['Today', 'Tomorrow', 'Thu 21'].map(d => (
            <button key={d} onClick={() => setDay(d)}
              className={`flex-1 h-11 rounded-xl border text-[13px] font-medium transition-colors ${d === day ? 'bg-teal-800 border-teal-800 text-white' : 'bg-white border-ink-200 text-ink-700'}`}>
              {d}
            </button>
          ))}
        </div>

        <p className="text-[11px] font-data text-ink-400 tracking-widest mb-3">TIME WINDOW</p>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {['3:00 PM', '4:30 PM', '5:30 PM', '6:00 PM'].map(t => (
            <button key={t} onClick={() => setTime(t)}
              className={`h-11 rounded-xl border text-[14px] font-medium transition-colors ${t === time ? 'bg-teal-800 border-teal-800 text-white' : 'bg-white border-ink-200 text-ink-700'}`}>
              {t}
            </button>
          ))}
        </div>

        <p className="text-[11px] font-data text-ink-400 tracking-widest mb-3">LOCATION</p>
        <div className="bg-white rounded-xl border border-ink-200 p-4 flex items-center gap-3 mb-6">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#0B6B6B" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="9" cy="7" r="3"/><path d="M9 16C9 16 3 11.5 3 7C3 3.7 5.7 1 9 1S15 3.7 15 7C15 11.5 9 16 9 16Z"/>
          </svg>
          <div className="flex-1">
            <p className="text-[14px] font-medium text-ink-900">12B, Galle Road, Colombo 05</p>
            <p className="text-[12px] text-ink-400">Apartment 3F</p>
          </div>
          <button className="text-[13px] text-teal-800 font-medium">Edit</button>
        </div>

        <div className="bg-teal-50 rounded-xl border border-teal-200 px-4 py-3.5 text-[13px] text-teal-800 leading-relaxed">
          Inspection fee is only charged if you proceed with a repair. No other charges until you approve a plan.
        </div>
      </div>
      <div className="px-6 pb-10 pt-3">
        <button onClick={() => navigate('appointment')} className="w-full h-14 bg-teal-800 text-white rounded-2xl font-semibold text-[15px] hover:bg-teal-900 transition-colors">
          Confirm Booking
        </button>
      </div>
    </div>
  )
}
