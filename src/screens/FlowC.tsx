import { useState } from 'react'
import type { NavProps, ScreenId } from '../types'
import { useDemo, proById, money, QUOTATION, quotationTotal } from '../store'
import { nextAction } from '../flow'
import { Avatar, Btn, Card, Header, Icon, Label, Photo, Row, Stars, Timeline, Tone } from '../components/UI'

const CASE_TITLE = 'Kitchen Sink Leak'

/** Header "Message" pill — available at every stage per the wireframe notes. */
function MessagePill({ navigate }: { navigate: (to: ScreenId) => void }) {
  return (
    <button
      onClick={() => navigate('chat')}
      className="h-8 px-3 rounded-full bg-brand-50 text-brand-700 text-[12px] font-semibold inline-flex items-center gap-1.5 hover:bg-brand-100"
    >
      <Icon name="chat" size={13} /> Message
    </button>
  )
}

function ProRow({ id, note }: { id: string | null; note?: string }) {
  const p = proById(id)
  return (
    <div className="flex items-center gap-3">
      <Avatar name={p.name} hue={p.hue} size={40} badge />
      <div className="min-w-0">
        <p className="text-[14px] font-semibold text-ink-900 truncate">{p.name}</p>
        <p className="text-[12px] text-ink-500 truncate">{note ?? p.trade}</p>
      </div>
    </div>
  )
}

// ── 11 / 15 / 18. Problem status ─────────────────────────────────────────────

export function StatusScreen({ navigate, goBack }: NavProps) {
  const { d, stages, advance } = useDemo()
  const p = proById(d.proId)
  const action = nextAction(d.step, d.inspectionPaid)

  return (
    <div className="bg-white min-h-full pb-4">
      <Header title="Problem Status" onBack={goBack} right={<MessagePill navigate={navigate} />} />

      <div className="px-5 pt-4 space-y-4">
        <Card className="p-4">
          <p className="text-[15px] font-bold text-ink-900">{CASE_TITLE}</p>
          <p className="text-[12px] text-ink-500 mt-0.5">
            {d.proId ? `${p.name} · ${p.trade}` : 'No professional selected yet'}
          </p>
          {d.inspectionPaid && d.step <= 4 && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-warning-100 px-3 py-2">
              <span className="text-warning-700"><Icon name="calendar" size={14} /></span>
              <span className="text-[12px] text-warning-700 font-medium">
                Inspection {d.inspectionDate} at {d.inspectionTime}
              </span>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <Timeline stages={stages} onOpen={navigate} />
        </Card>

        {action && (
          <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4">
            <p className="text-[12.5px] text-brand-800 mb-3">{action.hint}</p>
            <Btn
              onClick={() => {
                if (action.advanceTo) advance(action.advanceTo)
                navigate(action.to)
              }}
            >
              {action.label}
            </Btn>
          </div>
        )}

        <Btn variant="ghost" icon="doc" onClick={() => navigate('record')}>View Details</Btn>

        <p className="text-[11.5px] text-ink-400 text-center pb-2">Tap any completed stage to open its details.</p>
      </div>
    </div>
  )
}

// ── 12. Problem assessment ───────────────────────────────────────────────────

export function AssessmentScreen({ navigate, goBack }: NavProps) {
  const { d, set, advance } = useDemo()
  const p = proById(d.proId)

  const skip = () => {
    set({ inspectionSkipped: true })
    advance(4)
    navigate('quotation')
  }

  return (
    <div className="bg-white min-h-full pb-6">
      <Header title="Problem Assessment" onBack={goBack} right={<MessagePill navigate={navigate} />} />

      <div className="px-5 pt-4 space-y-5">
        <div className="flex items-center justify-between">
          <ProRow id={d.proId} />
          <span className="text-[11.5px] text-ink-400">Today, 11:05 AM</span>
        </div>

        <div>
          <Label className="mb-2">Professional Assessment</Label>
          <div className="rounded-2xl rounded-tl-sm bg-ink-100 p-4">
            <p className="text-[14px] text-ink-800 leading-relaxed">
              Based on the details and photos, I think this issue needs an inspection to confirm the exact
              cause and the required repair. The leak looks like it is coming from the waste trap or the
              supply valve underneath the sink.
            </p>
          </div>
        </div>

        <Card className="p-4 border-warning-600/30 bg-warning-100/50">
          <div className="flex items-center gap-2">
            <span className="text-warning-700"><Icon name="warn" size={16} /></span>
            <p className="text-[13.5px] font-semibold text-warning-700">Inspection is required.</p>
          </div>
        </Card>

        <div>
          <Label className="mb-1.5">Inspection Fee</Label>
          <Card className="p-4 flex items-center justify-between">
            <span className="text-[13px] text-ink-600">One-time visit charge</span>
            <span className="text-[18px] font-bold text-ink-900">LKR {money(p.inspectionFee)}</span>
          </Card>
        </div>

        <div>
          <Label className="mb-2">What would you like to do?</Label>
          <div className="space-y-2.5">
            <Btn onClick={() => navigate('set-inspection')}>Agree / Schedule Inspection</Btn>
            <Btn variant="secondary" onClick={skip}>Skip Inspection</Btn>
            <Btn variant="ghost" icon="chat" onClick={() => navigate('chat')}>Message Professional</Btn>
          </div>
          <p className="text-[11.5px] text-ink-400 mt-3 leading-relaxed">
            Skipping means the professional quotes from your description only, so the final price may change on site.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── 13. Set inspection ───────────────────────────────────────────────────────

const DAYS = [
  { d: 'Sat', n: '24 Aug', full: 'Sat, 24 Aug 2026' },
  { d: 'Sun', n: '25 Aug', full: 'Sun, 25 Aug 2026' },
  { d: 'Mon', n: '26 Aug', full: 'Mon, 26 Aug 2026' },
  { d: 'Tue', n: '27 Aug', full: 'Tue, 27 Aug 2026' },
]
const TIMES = ['10:00 AM', '1:30 PM', '4:00 PM', '5:30 PM', '6:30 PM']

export function SetInspectionScreen({ navigate, goBack }: NavProps) {
  const { d, set } = useDemo()
  const p = proById(d.proId)
  const [day, setDay] = useState(d.inspectionDate)
  const [time, setTime] = useState(d.inspectionTime)

  return (
    <div className="bg-white min-h-full flex flex-col">
      <Header title="Set Inspection" onBack={goBack} right={<MessagePill navigate={navigate} />} />

      <div className="flex-1 px-5 pt-4 pb-6 space-y-5">
        <ProRow id={d.proId} />

        <Card className="p-4 flex items-center justify-between">
          <span className="text-[13px] text-ink-600">Inspection Fee</span>
          <span className="text-[18px] font-bold text-ink-900">LKR {money(p.inspectionFee)}</span>
        </Card>

        <div>
          <Label className="mb-2">Select Date</Label>
          <div className="grid grid-cols-4 gap-2">
            {DAYS.map(x => {
              const on = day === x.full
              return (
                <button
                  key={x.full}
                  onClick={() => setDay(x.full)}
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
          <Label className="mb-2">Select Time</Label>
          <div className="grid grid-cols-3 gap-2">
            {TIMES.map(t => {
              const on = time === t
              return (
                <button
                  key={t}
                  onClick={() => setTime(t)}
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

        <div>
          <Label className="mb-1.5">Location</Label>
          <button
            onClick={() => navigate('location')}
            className="w-full rounded-xl border border-ink-200 px-3.5 py-3 flex items-center gap-2 hover:border-brand-300"
          >
            <span className="text-brand-600"><Icon name="pin" size={17} /></span>
            <span className="text-[14px] text-ink-800 flex-1 text-left">{d.location}</span>
            <span className="text-ink-400"><Icon name="next" size={15} /></span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[12.5px] text-ink-500">
          <Icon name="clock" size={15} />
          Estimated duration · 30 – 45 mins
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-ink-100 p-4">
        <Btn onClick={() => { set({ inspectionDate: day, inspectionTime: time }); navigate('inspection-payment') }}>
          Set Inspection
        </Btn>
      </div>
    </div>
  )
}

// ── Payment method row, shared by both payment screens ───────────────────────

function PayMethod() {
  const [card, setCard] = useState('VISA •••• 4242')
  return (
    <Card className="p-4 flex items-center gap-3">
      <span className="text-brand-600"><Icon name="card" size={20} /></span>
      <span className="flex-1 text-[13.5px] text-ink-800 font-medium">{card}</span>
      <button
        onClick={() => setCard(c => (c.startsWith('VISA') ? 'MASTER •••• 8891' : 'VISA •••• 4242'))}
        className="text-[12.5px] font-semibold text-brand-600"
      >
        Change
      </button>
    </Card>
  )
}

// ── 14. Inspection payment ───────────────────────────────────────────────────

export function InspectionPaymentScreen({ navigate, goBack }: NavProps) {
  const { d, set, advance } = useDemo()
  const p = proById(d.proId)
  const [paying, setPaying] = useState(false)

  const pay = () => {
    setPaying(true)
    setTimeout(() => {
      set({ inspectionPaid: true })
      advance(3)
      navigate('status')
    }, 900)
  }

  return (
    <div className="bg-white min-h-full flex flex-col">
      <Header title="Payment" onBack={goBack} />

      <div className="flex-1 px-5 pt-5 pb-6 space-y-5">
        <div>
          <p className="text-[17px] font-bold text-ink-900">Inspection Payment</p>
          <p className="text-[13px] text-ink-500 mt-1">This is for the inspection service only.</p>
        </div>

        <ProRow id={d.proId} />

        <Card className="divide-y divide-ink-100">
          {[
            { label: 'Date & Time', value: `${d.inspectionDate} · ${d.inspectionTime}` },
            { label: 'Location', value: d.location },
            { label: 'Inspection Fee', value: `LKR ${money(p.inspectionFee)}` },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between px-4 py-3">
              <span className="text-[13px] text-ink-500">{r.label}</span>
              <span className="text-[13px] font-semibold text-ink-900 text-right">{r.value}</span>
            </div>
          ))}
        </Card>

        <div>
          <Label className="mb-2">Payment Method</Label>
          <PayMethod />
        </div>

        <div className="flex items-center justify-between border-t border-ink-200 pt-4">
          <span className="text-[14px] font-semibold text-ink-700">Total</span>
          <span className="text-[22px] font-bold text-ink-900">LKR {money(p.inspectionFee)}</span>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-ink-100 p-4">
        <Btn onClick={pay} disabled={paying}>{paying ? 'Processing…' : 'Pay Now'}</Btn>
        <p className="text-[11.5px] text-ink-400 text-center mt-2.5 flex items-center justify-center gap-1.5">
          <Icon name="shield" size={13} /> Your payment is secure with TrustCraft.
        </p>
      </div>
    </div>
  )
}

// ── 16. Quotation ────────────────────────────────────────────────────────────

export function QuotationScreen({ navigate, goBack }: NavProps) {
  const { d, advance } = useDemo()
  const p = proById(d.proId)

  return (
    <div className="bg-white min-h-full flex flex-col">
      <Header title="Quotation" onBack={goBack} right={<MessagePill navigate={navigate} />} />

      <div className="flex-1 px-5 pt-4 pb-6 space-y-5">
        <div>
          <Label className="mb-2">From</Label>
          <ProRow id={d.proId} />
        </div>

        <div>
          <Label className="mb-1.5">Problem</Label>
          <p className="text-[13.5px] text-ink-700 leading-relaxed">{CASE_TITLE} — {d.problem}</p>
        </div>

        <div className="rounded-2xl border border-ink-200 overflow-hidden">
          <div className="grid grid-cols-[1fr_34px_62px_66px] gap-1 px-3 py-2.5 bg-ink-50 text-[11px] font-semibold text-ink-500 uppercase tracking-wide">
            <span>Item</span><span className="text-center">Qty</span><span className="text-right">Price</span><span className="text-right">Total</span>
          </div>
          {QUOTATION.items.map(it => (
            <div key={it.name} className="grid grid-cols-[1fr_34px_62px_66px] gap-1 px-3 py-2.5 border-t border-ink-100 text-[12.5px] text-ink-800">
              <span className="truncate">{it.name}</span>
              <span className="text-center text-ink-500">{it.qty}</span>
              <span className="text-right text-ink-500">{money(it.price)}</span>
              <span className="text-right font-semibold">{money(it.qty * it.price)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-3 py-3.5 bg-ink-50 border-t border-ink-200">
            <span className="text-[13px] font-semibold text-ink-700">Total (LKR)</span>
            <span className="text-[19px] font-bold text-ink-900">{money(quotationTotal)}</span>
          </div>
        </div>

        <Card className="divide-y divide-ink-100">
          {[
            { label: 'Estimated Duration', value: QUOTATION.duration },
            { label: 'Warranty', value: QUOTATION.warranty },
            { label: 'Valid Until', value: QUOTATION.validUntil },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between px-4 py-3">
              <span className="text-[13px] text-ink-500">{r.label}</span>
              <span className="text-[13px] font-semibold text-ink-900">{r.value}</span>
            </div>
          ))}
        </Card>

        {d.inspectionSkipped && (
          <div className="flex items-start gap-2.5 rounded-xl bg-warning-100 p-3.5">
            <span className="text-warning-700 mt-0.5"><Icon name="warn" size={16} /></span>
            <p className="text-[12.5px] text-warning-700 leading-relaxed">
              Quoted without an inspection. {p.name.split(' ')[0]} may revise the price after seeing the job.
            </p>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-white border-t border-ink-100 p-4 flex gap-2.5">
        <Btn variant="secondary" icon="chat" onClick={() => navigate('chat')}>Message</Btn>
        <Btn onClick={() => { advance(5); navigate('quotation-payment') }}>Agree</Btn>
      </div>
    </div>
  )
}

// ── 17. Quotation payment ────────────────────────────────────────────────────

export function QuotationPaymentScreen({ navigate, goBack }: NavProps) {
  const { set, advance } = useDemo()
  const [paying, setPaying] = useState(false)
  const [open, setOpen] = useState(false)

  const pay = () => {
    setPaying(true)
    setTimeout(() => {
      set({ quotationPaid: true })
      advance(6)
      navigate('status')
    }, 900)
  }

  return (
    <div className="bg-white min-h-full flex flex-col">
      <Header title="Payment" onBack={goBack} />

      <div className="flex-1 px-5 pt-5 pb-6 space-y-5">
        <div>
          <p className="text-[17px] font-bold text-ink-900">Service Payment</p>
          <p className="text-[13px] text-ink-500 mt-1">Payment for the approved quotation.</p>
        </div>

        <div>
          <Label className="mb-1">Quotation Total</Label>
          <p className="text-[26px] font-bold text-ink-900">LKR {money(quotationTotal)}</p>
        </div>

        <Card>
          <Row icon="doc" label="View Quotation Details" onClick={() => setOpen(o => !o)} />
          {open && (
            <div className="border-t border-ink-100 divide-y divide-ink-100 fade-in">
              {QUOTATION.items.map(it => (
                <div key={it.name} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-[12.5px] text-ink-600">{it.name} × {it.qty}</span>
                  <span className="text-[12.5px] font-semibold text-ink-900">{money(it.qty * it.price)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div>
          <Label className="mb-2">Payment Method</Label>
          <PayMethod />
        </div>

        <div className="flex items-center justify-between border-t border-ink-200 pt-4">
          <span className="text-[14px] font-semibold text-ink-700">Total</span>
          <span className="text-[22px] font-bold text-ink-900">LKR {money(quotationTotal)}</span>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-ink-100 p-4">
        <Btn onClick={pay} disabled={paying}>{paying ? 'Processing…' : 'Pay Now'}</Btn>
        <p className="text-[11.5px] text-ink-400 text-center mt-2.5 flex items-center justify-center gap-1.5">
          <Icon name="shield" size={13} /> Your payment is secure with TrustCraft.
        </p>
      </div>
    </div>
  )
}

// ── 19. Work completion submission ───────────────────────────────────────────

export function WorkCompletedScreen({ navigate, goBack }: NavProps) {
  const { d, advance } = useDemo()
  const p = proById(d.proId)

  return (
    <div className="bg-white min-h-full flex flex-col">
      <Header title="Work Completed" onBack={goBack} right={<span className="text-[11.5px] text-ink-400">Today, 3:45 PM</span>} />

      <div className="flex-1 px-5 pt-4 pb-6 space-y-5">
        <div className="flex items-start gap-2.5 rounded-xl bg-success-100 p-3.5">
          <span className="text-success-700 mt-0.5"><Icon name="check" size={16} /></span>
          <p className="text-[13px] text-success-700 leading-relaxed">
            {p.name} has marked the work as completed.
          </p>
        </div>

        <div>
          <Label className="mb-1.5">Work Done</Label>
          <p className="text-[14px] text-ink-800 leading-relaxed">
            Replaced the damaged valve and fixed the leaking connection under the sink. Tested for 15 minutes with no further leaks.
          </p>
        </div>

        <div>
          <Label className="mb-2">Photos</Label>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <Photo h={104} hue={12} />
              <p className="text-[11.5px] text-ink-500 mt-1 text-center font-medium">Before</p>
            </div>
            <div>
              <Photo h={104} hue={150} />
              <p className="text-[11.5px] text-ink-500 mt-1 text-center font-medium">After</p>
            </div>
          </div>
        </div>

        <div>
          <Label className="mb-1.5">Notes</Label>
          <p className="text-[13.5px] text-ink-600 leading-relaxed">
            Please check and confirm if everything is working fine. The repair carries a {QUOTATION.warranty} warranty.
          </p>
        </div>

        <Card className="p-4 flex items-center justify-between">
          <span className="text-[13px] text-ink-600">Completed on</span>
          <span className="text-[13px] font-semibold text-ink-900">Aug 24, 2026 · 6:30 PM</span>
        </Card>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-ink-100 p-4 flex gap-2.5">
        <Btn variant="secondary" icon="chat" onClick={() => navigate('chat')}>Message</Btn>
        <Btn onClick={() => { advance(8); navigate('review') }}>Confirm Completion</Btn>
      </div>
    </div>
  )
}

// ── 20. Review ───────────────────────────────────────────────────────────────

export function ReviewScreen({ navigate, goBack }: NavProps) {
  const { d, set, advance } = useDemo()
  const p = proById(d.proId)
  const [stars, setStars] = useState(d.rating || 0)
  const [text, setText] = useState(d.review)

  return (
    <div className="bg-white min-h-full flex flex-col">
      <Header title="Review & Rate" onBack={goBack} />

      <div className="flex-1 px-5 pt-6 pb-6 space-y-6">
        <div className="text-center">
          <Avatar name={p.name} hue={p.hue} size={64} badge />
          <p className="text-[16px] font-bold text-ink-900 mt-3">{p.name}</p>
          <p className="text-[12.5px] text-ink-500">{p.trade}</p>
        </div>

        <div className="text-center">
          <p className="text-[15px] font-semibold text-ink-900 mb-3">How was your experience?</p>
          <div className="flex justify-center">
            <Stars value={stars} size={34} onChange={setStars} />
          </div>
          {stars > 0 && (
            <p className="text-[12.5px] text-brand-600 font-medium mt-2 fade-in">
              {['Poor', 'Fair', 'Good', 'Great', 'Excellent'][stars - 1]}
            </p>
          )}
        </div>

        <div>
          <div className="rounded-2xl border border-ink-200 focus-within:border-brand-500 overflow-hidden">
            <textarea
              value={text}
              onChange={e => setText(e.target.value.slice(0, 500))}
              rows={5}
              placeholder="Write a review (optional)"
              className="w-full px-4 py-3 text-[14px] text-ink-800 leading-relaxed resize-none outline-none placeholder:text-ink-400"
            />
            <div className="flex justify-end px-4 pb-2">
              <span className="text-[11px] text-ink-400">{text.length}/500</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-ink-100 p-4">
        <Btn
          disabled={stars === 0}
          onClick={() => { set({ rating: stars, review: text }); advance(9); navigate('record') }}
        >
          Submit Review
        </Btn>
      </div>
    </div>
  )
}

// ── 21. Past service record ──────────────────────────────────────────────────

export function RecordScreen({ navigate, goBack }: NavProps) {
  const { d, reset } = useDemo()
  const p = proById(d.proId)
  const paid = d.quotationPaid ? quotationTotal : d.inspectionPaid ? p.inspectionFee : 0

  return (
    <div className="bg-white min-h-full flex flex-col">
      <Header title="Service Record" onBack={goBack} right={<span className="text-ink-400"><Icon name="download" size={18} /></span>} />

      <div className="flex-1 px-5 pt-4 pb-6 space-y-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[15px] font-bold text-ink-900">{CASE_TITLE}</p>
              <p className="text-[12px] text-ink-500 mt-0.5">
                {d.step >= 9 ? 'Completed on Aug 24, 2026' : 'In progress'}
              </p>
            </div>
            <Tone tone={d.step >= 9 ? 'success' : 'brand'}>{d.step >= 9 ? 'Completed' : 'Active'}</Tone>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <Avatar name={p.name} hue={p.hue} size={44} badge />
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-ink-900">{p.name}</p>
            <p className="text-[12px] text-ink-500">{p.trade}</p>
          </div>
          <div className="text-right">
            <Stars value={p.rating} size={12} />
            <p className="text-[11.5px] text-ink-500 mt-0.5">{p.rating}</p>
          </div>
        </Card>

        <Card className="divide-y divide-ink-100">
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-[13px] text-ink-500">Total Paid</span>
            <span className="text-[18px] font-bold text-ink-900">LKR {money(paid)}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-[13px] text-ink-500">Your Rating</span>
            {d.rating ? <Stars value={d.rating} size={15} /> : <span className="text-[12.5px] text-ink-400">Not rated yet</span>}
          </div>
        </Card>

        <Card className="divide-y divide-ink-100 overflow-hidden">
          <Row icon="doc" label="View Problem Details" onClick={() => navigate('problem')} />
          <Row icon="search" label="View Inspection Details" onClick={() => navigate('set-inspection')} />
          <Row icon="wallet" label="View Quotation" onClick={() => navigate('quotation')} />
          <Row icon="card" label="View Invoice / Payment" onClick={() => navigate('quotation-payment')} />
          <Row icon="image" label="View Work Completion" onClick={() => navigate('work-completed')} />
          <Row icon="star" label="View / Edit Review" onClick={() => navigate('review')} />
          <Row icon="download" label="Download Record" onClick={() => navigate('record')} />
        </Card>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-ink-100 p-4">
        <Btn onClick={() => { reset(); navigate('home') }}>Book Again</Btn>
      </div>
    </div>
  )
}
