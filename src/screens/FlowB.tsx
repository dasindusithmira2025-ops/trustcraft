import { useEffect, useState } from 'react'
import type { NavProps } from '../types'
import { useDemo, PROS, CATEGORIES, proById, money } from '../store'
import { Avatar, Btn, Card, Chip, Header, Icon, Label, Stars, Tone, TrustPill } from '../components/UI'

const CAT_ICON: Record<string, string> = {
  plumbers: 'wrench', electricians: 'sparkle', cleaners: 'star', carpenters: 'cases',
  ac: 'flip', painters: 'edit', appliance: 'card', others: 'more',
}

// ── 06. Find professionals ───────────────────────────────────────────────────

export function FindProsScreen({ navigate }: NavProps) {
  const { set } = useDemo()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<string | null>(null)
  const [sort, setSort] = useState<'rating' | 'distance' | 'fee'>('rating')

  const list = PROS
    .filter(p => (q ? (p.name + p.trade).toLowerCase().includes(q.toLowerCase()) : true))
    .filter(p => {
      if (!cat) return true
      if (cat === 'plumbers') return p.trade.includes('Plumber')
      if (cat === 'electricians') return p.trade.includes('Electrician')
      if (cat === 'ac') return p.trade.includes('AC')
      return false
    })
    .slice()
    .sort((a, b) =>
      sort === 'rating' ? b.rating - a.rating : sort === 'distance' ? a.distanceKm - b.distanceKm : a.inspectionFee - b.inspectionFee,
    )

  const open = (id: string) => { set({ viewProId: id }); navigate('pro-profile') }

  return (
    <div className="bg-white min-h-full pb-6">
      <Header title="Find Professionals" right={<span className="text-ink-400"><Icon name="filter" size={19} /></span>} />

      <div className="px-5 pt-4 space-y-4">
        <div className="h-11 rounded-xl border border-ink-200 flex items-center gap-2 px-3.5 focus-within:border-brand-500">
          <span className="text-ink-400"><Icon name="search" size={17} /></span>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search professionals"
            className="flex-1 text-[14px] outline-none placeholder:text-ink-400"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scroll -mx-5 px-5">
          <Chip icon="filter" active={!cat && sort === 'rating'} onClick={() => { setCat(null); setSort('rating') }}>All</Chip>
          <Chip icon="pin" active={sort === 'distance'} onClick={() => setSort('distance')}>Nearest</Chip>
          <Chip icon="star" active={sort === 'rating'} onClick={() => setSort('rating')}>Top rated</Chip>
          <Chip icon="wallet" active={sort === 'fee'} onClick={() => setSort('fee')}>Lowest fee</Chip>
        </div>

        <div>
          <Label className="mb-2">Categories</Label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map(c => {
              const on = cat === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setCat(on ? null : c.id)}
                  className={`rounded-xl border py-3 flex flex-col items-center gap-1.5 transition-colors ${
                    on ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-200 text-ink-600 hover:border-brand-300'
                  }`}
                >
                  <Icon name={CAT_ICON[c.id]} size={19} />
                  <span className="text-[10px] font-semibold leading-tight text-center px-1">{c.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <Label className="mb-2">{cat ? 'Matching Professionals' : 'Top Professionals'}</Label>
          <div className="space-y-2.5">
            {list.map(p => (
              <Card key={p.id} className="p-3.5 flex items-center gap-3">
                <Avatar name={p.name} hue={p.hue} badge />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-ink-900 truncate">{p.name}</p>
                  <p className="text-[12px] text-ink-500 truncate">{p.trade}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11.5px] text-ink-600 flex items-center gap-1">
                      <span className="text-gold-500"><Icon name="star" size={11} fill /></span>
                      {p.rating} ({p.reviews})
                    </span>
                    <span className="text-[11.5px] text-ink-400">{p.distanceKm} km</span>
                    <TrustPill score={p.trust} />
                  </div>
                  <p className="text-[11.5px] text-ink-500 mt-1">Inspection · LKR {money(p.inspectionFee)}</p>
                </div>
                <Btn size="sm" full={false} variant="secondary" onClick={() => open(p.id)}>View</Btn>
              </Card>
            ))}
            {list.length === 0 && (
              <p className="text-[13px] text-ink-400 py-8 text-center">No professionals match that filter.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── 07. Professional profile ─────────────────────────────────────────────────

const REVIEWS = [
  { by: 'Amaya S.', stars: 5, text: 'Great service and very professional. Solved the problem quickly.', when: 'Aug 12' },
  { by: 'Roshan P.', stars: 5, text: 'Arrived on time and the price matched the quotation exactly.', when: 'Jul 30' },
  { by: 'Dilini W.', stars: 4, text: 'Good work, explained everything clearly before starting.', when: 'Jul 18' },
]

export function ProProfileScreen({ navigate, goBack }: NavProps) {
  const { d, set, advance } = useDemo()
  const p = proById(d.viewProId)
  const [saved, setSaved] = useState(false)

  const select = () => {
    set({ proId: p.id, chatWith: p.id })
    advance(2)
    navigate('confirmation')
  }

  return (
    <div className="bg-white min-h-full flex flex-col">
      <Header
        title="Professional Profile"
        onBack={goBack}
        right={
          <div className="flex">
            <button onClick={() => setSaved(s => !s)} aria-label="Save" className={`w-9 h-9 rounded-full flex items-center justify-center ${saved ? 'text-danger-600' : 'text-ink-400'} hover:bg-ink-100`}>
              <Icon name="heart" size={17} fill={saved} />
            </button>
            <button aria-label="Share" className="w-9 h-9 rounded-full flex items-center justify-center text-ink-400 hover:bg-ink-100">
              <Icon name="share" size={17} />
            </button>
          </div>
        }
      />

      <div className="flex-1 px-5 pt-5 pb-6 space-y-5">
        <div className="flex items-start gap-4">
          <Avatar name={p.name} hue={p.hue} size={64} badge />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-[17px] font-bold text-ink-900 truncate">{p.name}</p>
              <Tone tone="success">Verified</Tone>
            </div>
            <p className="text-[13px] text-ink-500">{p.trade}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Stars value={p.rating} />
              <span className="text-[12px] text-ink-500">{p.rating} ({p.reviews} reviews)</span>
            </div>
          </div>
          <TrustPill score={p.trust} size="lg" />
        </div>

        <Card className="divide-y divide-ink-100">
          {[
            { icon: 'clock', label: 'Experience', value: `${p.years} years` },
            { icon: 'check', label: 'Works Completed', value: String(p.jobs) },
            { icon: 'pin', label: 'Location', value: `${p.distanceKm} km away` },
            { icon: 'wallet', label: 'Inspection Fee', value: `LKR ${money(p.inspectionFee)}` },
            { icon: 'calendar', label: 'Availability', value: p.availability },
          ].map(r => (
            <div key={r.label} className="flex items-center gap-3 px-4 py-3">
              <span className="text-ink-400"><Icon name={r.icon} size={16} /></span>
              <span className="flex-1 text-[13.5px] text-ink-700">{r.label}</span>
              <span className="text-[13px] font-semibold text-ink-900">{r.value}</span>
            </div>
          ))}
        </Card>

        <div>
          <Label className="mb-1.5">About</Label>
          <p className="text-[13.5px] text-ink-600 leading-relaxed">{p.about}</p>
        </div>

        <div>
          <Label className="mb-2">Services</Label>
          <div className="flex flex-wrap gap-2">
            {p.services.map(s => (
              <span key={s} className="text-[12px] font-medium bg-ink-100 text-ink-700 rounded-full px-3 py-1.5">{s}</span>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-2">Recent Reviews</Label>
          <div className="space-y-2.5">
            {REVIEWS.map(r => (
              <Card key={r.by} className="p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-semibold text-ink-900">{r.by}</span>
                  <span className="text-[11px] text-ink-400">{r.when}</span>
                </div>
                <Stars value={r.stars} size={12} />
                <p className="text-[13px] text-ink-600 leading-relaxed mt-1.5">{r.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-ink-100 p-4 flex gap-2.5">
        <Btn variant="secondary" icon="chat" onClick={() => { set({ chatWith: p.id }); navigate('chat') }}>Message</Btn>
        <Btn onClick={select}>Select</Btn>
      </div>
    </div>
  )
}

// ── 08. AI analysis ──────────────────────────────────────────────────────────

const STEPS = [
  'Understanding your problem',
  'Processing submitted information',
  'Understanding service category',
  'Finding suitable professionals',
]

export function AIAnalysisScreen({ navigate }: NavProps) {
  const [done, setDone] = useState(0)

  useEffect(() => {
    const timers = STEPS.map((_, i) => setTimeout(() => setDone(i + 1), 700 * (i + 1)))
    const go = setTimeout(() => navigate('recommendations'), 700 * STEPS.length + 700)
    return () => { timers.forEach(clearTimeout); clearTimeout(go) }
  }, [navigate])

  return (
    <div className="bg-white min-h-full flex flex-col items-center justify-center px-8 text-center">
      <h2 className="text-[22px] font-bold text-ink-900 leading-snug">Please wait<br />a moment</h2>
      <p className="text-[13px] text-ink-500 mt-2">This may take a few seconds.</p>

      <div className="relative my-9 w-28 h-28 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-brand-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-600 ring-spin" />
        <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center soft-pulse">
          <Icon name="sparkle" size={30} />
        </div>
      </div>

      <div className="w-full space-y-3 text-left">
        {STEPS.map((s, i) => {
          const isDone = i < done
          const isNow = i === done
          return (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isDone ? 'bg-success-600 text-white' : isNow ? 'border-2 border-brand-500' : 'border-2 border-ink-200'
                }`}
              >
                {isDone ? <Icon name="check" size={11} /> : isNow ? <div className="w-1.5 h-1.5 rounded-full bg-brand-500 soft-pulse" /> : null}
              </div>
              <span className={`text-[13.5px] ${isDone ? 'text-ink-800' : isNow ? 'text-brand-700 font-medium' : 'text-ink-400'}`}>
                {s}{isNow ? '...' : ''}
              </span>
            </div>
          )
        })}
      </div>

      <p className="text-[12px] text-ink-400 mt-8">Please do not close the app.</p>
    </div>
  )
}

// ── 09. AI recommended professionals ─────────────────────────────────────────

export function RecommendationsScreen({ navigate, goBack }: NavProps) {
  const { set, advance } = useDemo()
  const list = PROS.filter(p => p.match > 0)

  const select = (id: string) => {
    set({ proId: id, chatWith: id })
    advance(2)
    navigate('confirmation')
  }

  return (
    <div className="bg-white min-h-full pb-6">
      <Header title="Recommended Professionals" onBack={goBack} />
      <div className="px-5 pt-4">
        <p className="text-[13px] text-ink-500 leading-relaxed mb-4">
          Based on your request, these professionals may be a good match. You choose who takes the job.
        </p>

        <div className="space-y-3">
          {list.map((p, i) => (
            <Card key={p.id} className={`p-4 fade-up-${i + 1} ${i === 0 ? 'border-brand-300' : ''}`}>
              <div className="flex items-start gap-3">
                <Avatar name={p.name} hue={p.hue} size={48} badge />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[14.5px] font-semibold text-ink-900 truncate">{p.name}</p>
                      <p className="text-[12px] text-ink-500">{p.trade}</p>
                    </div>
                    {i === 0 && <Tone tone="success">Recommended</Tone>}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[11.5px] text-ink-600 flex items-center gap-1">
                      <span className="text-gold-500"><Icon name="star" size={11} fill /></span>
                      {p.rating} ({p.reviews})
                    </span>
                    <span className="text-[11.5px] text-ink-400">{p.distanceKm} km</span>
                    <span className="text-[11.5px] text-ink-400">{p.years} yrs</span>
                  </div>
                  <p className="text-[11.5px] text-ink-500 mt-0.5">Inspection Fee · LKR {money(p.inspectionFee)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[17px] font-bold text-brand-600 leading-none">{p.match}%</p>
                  <p className="text-[10px] text-ink-400 font-medium">Match</p>
                </div>
              </div>

              <div className="h-1.5 rounded-full bg-ink-100 mt-3 overflow-hidden">
                <div className="h-full rounded-full bg-brand-500" style={{ width: `${p.match}%` }} />
              </div>

              <div className="flex gap-2.5 mt-3">
                <Btn size="sm" variant="ghost" onClick={() => { set({ viewProId: p.id }); navigate('pro-profile') }}>View Profile</Btn>
                <Btn size="sm" onClick={() => select(p.id)}>Select</Btn>
              </div>
            </Card>
          ))}
        </div>

        <button onClick={() => navigate('find-pros')} className="w-full text-[13px] font-semibold text-brand-600 py-4">
          Browse all professionals instead
        </button>
      </div>
    </div>
  )
}

// ── 10. Request confirmation ─────────────────────────────────────────────────

export function ConfirmationScreen({ navigate, goBack }: NavProps) {
  const { d, advance, set } = useDemo()
  const p = proById(d.proId)

  return (
    <div className="bg-white min-h-full flex flex-col">
      <Header title="Request Confirmation" onBack={goBack} />

      <div className="flex-1 px-5 pt-6 pb-6 space-y-5">
        <div className="flex flex-col items-center text-center scale-in">
          <div className="w-16 h-16 rounded-full bg-success-100 text-success-600 flex items-center justify-center">
            <Icon name="check" size={30} />
          </div>
          <p className="text-[19px] font-bold text-ink-900 mt-3">Professional Selected!</p>
          <p className="text-[13px] text-ink-500 mt-1">You selected this professional for your request.</p>
        </div>

        <Card className="p-4 flex items-center gap-3">
          <Avatar name={p.name} hue={p.hue} size={48} badge />
          <div className="flex-1 min-w-0">
            <p className="text-[14.5px] font-semibold text-ink-900">{p.name}</p>
            <p className="text-[12px] text-ink-500">{p.trade}</p>
            <div className="flex items-center gap-2 mt-1">
              <TrustPill score={p.trust} />
              <span className="text-[11.5px] text-ink-600 flex items-center gap-1">
                <span className="text-gold-500"><Icon name="star" size={11} fill /></span>
                {p.rating} ({p.reviews})
              </span>
              <span className="text-[11.5px] text-ink-400">{p.distanceKm} km</span>
            </div>
          </div>
        </Card>

        <div>
          <Label className="mb-1.5">Your Request</Label>
          <div className="rounded-xl border border-ink-200 bg-ink-50 p-3.5">
            <p className="text-[14px] text-ink-800 leading-relaxed">{d.problem}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="mb-1">Location</Label>
            <p className="text-[13px] text-ink-700">{d.location}</p>
          </div>
          <div>
            <Label className="mb-1">Submitted on</Label>
            <p className="text-[13px] text-ink-700">{d.submittedAt}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl bg-brand-50 p-3.5">
          <span className="text-brand-600 mt-0.5"><Icon name="info" size={16} /></span>
          <p className="text-[12.5px] text-brand-800 leading-relaxed">
            {p.name.split(' ')[0]} will review your request and send an assessment. You can message them at any stage.
          </p>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-ink-100 p-4 flex gap-2.5">
        <Btn variant="secondary" icon="chat" onClick={() => { set({ chatWith: p.id }); navigate('chat') }}>Message</Btn>
        <Btn onClick={() => { advance(2); navigate('status') }}>Continue</Btn>
      </div>
    </div>
  )
}
