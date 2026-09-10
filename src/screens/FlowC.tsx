import { useState } from 'react'
import type { NavProps, ScreenId } from '../types'
import { useDemo, proById, money } from '../store'
import { nextAction } from '../flow'
import { categoryLabel, quoteTotal } from '../case'
import {
  useCase, acceptInspection, acceptQuotation, closeCase, confirmCompletion,
  payInspection, payQuotation, toast,
} from '../caseStore'
import {
  AttachmentGrid, Avatar, Btn, Card, Header, Icon, Label, Photo, Row, Stars, Timeline, Tone,
} from '../components/UI'

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

/** Urgent / scheduled, stated the same way everywhere it appears. */
export function WhenPill({ urgent, when }: { urgent: boolean; when: string }) {
  return urgent ? (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide bg-danger-600 text-white rounded-md px-2 py-1">
      <Icon name="bolt" size={11} fill /> Urgent
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-ink-600">
      <Icon name="calendar" size={12} /> {when}
    </span>
  )
}

// ── 11 / 15 / 18. Problem status ─────────────────────────────────────────────

export function StatusScreen({ navigate, goBack }: NavProps) {
  const { stages, step } = useDemo()
  const c = useCase()
  const p = proById(c.proId)
  const action = nextAction(step, c)
  const ins = c.inspection

  return (
    <div className="bg-white min-h-full pb-4">
      <Header title="Problem Status" onBack={goBack} right={<MessagePill navigate={navigate} />} />

      <div className="px-5 pt-4 space-y-4">
        <Card className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[15px] font-bold text-ink-900">{c.title}</p>
              <p className="text-[12px] text-ink-500 mt-0.5">
                {c.proId ? `${p.name} · ${p.trade}` : 'No professional selected yet'}
              </p>
            </div>
            <span className="flex-shrink-0">
              <WhenPill urgent={c.serviceType === 'urgent'} when={`${c.scheduledDate} · ${c.scheduledTime}`} />
            </span>
          </div>
          <p className="text-[11.5px] text-ink-400 mt-2">
            {c.id} · {categoryLabel(c.category)} · {c.location}
          </p>

          {ins.status === 'confirmed' && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-warning-100 px-3 py-2">
              <span className="text-warning-700"><Icon name="calendar" size={14} /></span>
              <span className="text-[12px] text-warning-700 font-medium">
                Inspection {ins.confirmedDate} at {ins.confirmedTime}
              </span>
            </div>
          )}
          {ins.status === 'requested' && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2">
              <span className="text-brand-700"><Icon name="search" size={14} /></span>
              <span className="text-[12px] text-brand-800 font-medium">Inspection requested — your reply is needed</span>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <Timeline stages={stages} onOpen={navigate} />
        </Card>

        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4">
          <p className="text-[12.5px] text-brand-800 mb-3">{action.hint}</p>
          <Btn variant={action.waiting ? 'secondary' : 'primary'} onClick={() => navigate(action.to)}>
            {action.label}
          </Btn>
        </div>

        <Btn variant="ghost" icon="doc" onClick={() => navigate('record')}>View Details</Btn>

        <p className="text-[11.5px] text-ink-400 text-center pb-2">Tap any completed stage to open its details.</p>
      </div>
    </div>
  )
}

// ── 12. Problem assessment ───────────────────────────────────────────────────
// Everything on this screen is the professional's own submission, read back
// out of the shared case.

export function AssessmentScreen({ navigate, goBack }: NavProps) {
  const c = useCase()
  const p = proById(c.proId)
  const ins = c.inspection
  const first = p.name.split(' ')[0]

  return (
    <div className="bg-white min-h-full pb-6">
      <Header title="Problem Assessment" onBack={goBack} right={<MessagePill navigate={navigate} />} />

      <div className="px-5 pt-4 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <ProRow id={c.proId} />
          <span className="text-[11.5px] text-ink-400 flex-shrink-0">{c.analysisAt || 'In progress'}</span>
        </div>

        {/* Waiting */}
        {!c.analysis && (
          <Card className="p-5 text-center">
            <span className="text-brand-500 inline-flex soft-pulse"><Icon name="search" size={26} /></span>
            <p className="text-[14.5px] font-semibold text-ink-900 mt-2">
              {c.status === 'under_analysis' ? `${first} is analysing your problem` : `${first} has your request`}
            </p>
            <p className="text-[12.5px] text-ink-500 leading-relaxed mt-1">
              You will see their analysis here as soon as it is sent.
            </p>
          </Card>
        )}

        {/* The analysis the professional actually wrote */}
        {c.analysis && (
          <div>
            <Label className="mb-2">Professional Analysis</Label>
            <div className="rounded-2xl rounded-tl-sm bg-ink-100 p-4">
              <p className="text-[14px] text-ink-800 leading-relaxed">{c.analysis}</p>
            </div>
            <p className="text-[11px] text-ink-400 mt-1.5">Sent {c.analysisAt}</p>
          </div>
        )}

        {/* Inspection request → customer response */}
        {ins.status === 'requested' && (
          <Card className="p-4 border-warning-600/30 bg-warning-100/50">
            <div className="flex items-center gap-2">
              <span className="text-warning-700"><Icon name="search" size={16} /></span>
              <p className="text-[13.5px] font-semibold text-warning-700">Inspection Requested</p>
            </div>
            <p className="text-[13px] text-ink-700 leading-relaxed mt-2">
              {p.name} needs to inspect the issue before providing a final quotation.
            </p>
            <div className="mt-3">
              <Label className="mb-1">Reason</Label>
              <p className="text-[13.5px] text-ink-800 leading-relaxed">“{ins.reason}”</p>
            </div>
            {(ins.proposedDate || ins.proposedTime) && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-white px-3 py-2 border border-warning-600/20">
                <span className="text-warning-700"><Icon name="calendar" size={14} /></span>
                <span className="text-[12.5px] text-ink-800 font-medium">
                  Suggested · {ins.proposedDate} at {ins.proposedTime}
                </span>
              </div>
            )}
            <div className="mt-3 flex items-center justify-between rounded-lg bg-white px-3 py-2.5 border border-warning-600/20">
              <span className="text-[12.5px] text-ink-600">Inspection fee</span>
              <span className="text-[15px] font-bold text-ink-900">LKR {money(p.inspectionFee)}</span>
            </div>

            <div className="space-y-2.5 mt-4">
              <Btn
                onClick={() => {
                  acceptInspection(ins.proposedDate, ins.proposedTime)
                  toast('Inspection accepted')
                  navigate('inspection-payment')
                }}
                disabled={!ins.proposedDate || !ins.proposedTime}
              >
                Accept Inspection
              </Btn>
              <Btn variant="secondary" onClick={() => navigate('set-inspection')}>Suggest Another Time</Btn>
              <Btn variant="ghost" icon="chat" onClick={() => navigate('chat')}>Message Professional</Btn>
            </div>
          </Card>
        )}

        {ins.status === 'confirmed' && (
          <Card className="p-4 border-success-600/30 bg-success-100/50">
            <div className="flex items-center gap-2">
              <span className="text-success-700"><Icon name="check" size={16} /></span>
              <p className="text-[13.5px] font-semibold text-success-700">Inspection Confirmed</p>
            </div>
            <p className="text-[13px] text-ink-700 leading-relaxed mt-2">
              {first} will visit on <span className="font-semibold">{ins.confirmedDate}</span> at{' '}
              <span className="font-semibold">{ins.confirmedTime}</span> at {c.location}.
            </p>
            {!ins.paid && (
              <div className="mt-3">
                <Btn onClick={() => navigate('inspection-payment')}>Pay Inspection Fee</Btn>
              </div>
            )}
          </Card>
        )}

        {ins.status === 'completed' && (
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-success-700"><Icon name="check" size={16} /></span>
              <p className="text-[13.5px] font-semibold text-ink-900">Inspection completed</p>
            </div>
            <p className="text-[12.5px] text-ink-500 mt-1">{ins.completedAt}</p>
          </Card>
        )}

        {ins.status === 'skipped' && c.analysis && (
          <div className="flex items-start gap-2.5 rounded-xl bg-ink-100 p-3.5">
            <span className="text-ink-500 mt-0.5"><Icon name="info" size={16} /></span>
            <p className="text-[12.5px] text-ink-600 leading-relaxed">
              {first} decided an on-site inspection is not needed and is quoting from what you sent.
            </p>
          </div>
        )}

        {c.quotation && (
          <Btn icon="wallet" onClick={() => navigate('quotation')}>View Quotation</Btn>
        )}

        {/* What the professional is looking at */}
        <div>
          <Label className="mb-1.5">Your submitted problem</Label>
          <div className="rounded-xl border border-ink-200 bg-ink-50 p-3.5">
            <p className="text-[14px] font-semibold text-ink-900">{c.title}</p>
            <p className="text-[13.5px] text-ink-700 leading-relaxed mt-1">{c.description}</p>
          </div>
          {c.attachments.length > 0 && (
            <div className="mt-2">
              <AttachmentGrid items={c.attachments} h={68} />
            </div>
          )}
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
  const c = useCase()
  const p = proById(c.proId)
  const ins = c.inspection
  const [day, setDay] = useState(ins.confirmedDate || ins.proposedDate || DAYS[0].full)
  const [time, setTime] = useState(ins.confirmedTime || ins.proposedTime || TIMES[1])
  const locked = ins.status === 'completed'

  const confirm = () => {
    acceptInspection(day, time)
    toast('Inspection confirmed')
    navigate(ins.paid ? 'status' : 'inspection-payment')
  }

  return (
    <div className="bg-white min-h-full flex flex-col">
      <Header title="Set Inspection" onBack={goBack} right={<MessagePill navigate={navigate} />} />

      <div className="flex-1 px-5 pt-4 pb-6 space-y-5">
        <ProRow id={c.proId} />

        {ins.reason && (
          <div>
            <Label className="mb-1.5">Why an inspection</Label>
            <p className="text-[13.5px] text-ink-700 leading-relaxed">“{ins.reason}”</p>
          </div>
        )}

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
                  disabled={locked}
                  onClick={() => setDay(x.full)}
                  className={`rounded-xl border py-2.5 flex flex-col items-center transition-colors disabled:opacity-50 ${
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
                  disabled={locked}
                  onClick={() => setTime(t)}
                  className={`h-10 rounded-xl border text-[13px] font-semibold transition-colors disabled:opacity-50 ${
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
            <span className="text-[14px] text-ink-800 flex-1 text-left">{c.location}</span>
            <span className="text-ink-400"><Icon name="next" size={15} /></span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[12.5px] text-ink-500">
          <Icon name="clock" size={15} />
          Estimated duration · 30 – 45 mins
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-ink-100 p-4">
        <Btn onClick={confirm} disabled={locked}>
          {locked ? 'Inspection Completed' : ins.status === 'confirmed' ? 'Update Inspection' : 'Confirm Inspection'}
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
        onClick={() => setCard(x => (x.startsWith('VISA') ? 'MASTER •••• 8891' : 'VISA •••• 4242'))}
        className="text-[12.5px] font-semibold text-brand-600"
      >
        Change
      </button>
    </Card>
  )
}

// ── 14. Inspection payment ───────────────────────────────────────────────────

export function InspectionPaymentScreen({ navigate, goBack }: NavProps) {
  const c = useCase()
  const p = proById(c.proId)
  const ins = c.inspection
  const [paying, setPaying] = useState(false)

  const pay = () => {
    if (paying || ins.paid) return
    setPaying(true)
    setTimeout(() => {
      payInspection()
      toast('Inspection payment received')
      setPaying(false)
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

        <ProRow id={c.proId} />

        <Card className="divide-y divide-ink-100">
          {[
            { label: 'Date & Time', value: `${ins.confirmedDate || ins.proposedDate} · ${ins.confirmedTime || ins.proposedTime}` },
            { label: 'Location', value: c.location },
            { label: 'Inspection Fee', value: `LKR ${money(p.inspectionFee)}` },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between px-4 py-3 gap-3">
              <span className="text-[13px] text-ink-500 flex-shrink-0">{r.label}</span>
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
        <Btn onClick={pay} disabled={paying || ins.paid}>
          {ins.paid ? 'Already Paid' : paying ? 'Processing…' : 'Pay Now'}
        </Btn>
        <p className="text-[11.5px] text-ink-400 text-center mt-2.5 flex items-center justify-center gap-1.5">
          <Icon name="shield" size={13} /> Your payment is secure with TrustCraft.
        </p>
      </div>
    </div>
  )
}

// ── 16. Quotation ────────────────────────────────────────────────────────────
// The customer's copy of the quotation the professional built. It carries no
// sponsored placement of any kind — ads live only in the professional's
// quotation builder.

export function QuotationScreen({ navigate, goBack }: NavProps) {
  const c = useCase()
  const p = proById(c.proId)
  const q = c.quotation
  const total = quoteTotal(q)

  if (!q) {
    return (
      <div className="bg-white min-h-full">
        <Header title="Quotation" onBack={goBack} right={<MessagePill navigate={navigate} />} />
        <div className="px-8 pt-24 text-center">
          <span className="text-ink-300 inline-flex"><Icon name="doc" size={34} /></span>
          <p className="text-[15px] font-semibold text-ink-900 mt-3">No quotation yet</p>
          <p className="text-[13px] text-ink-500 leading-relaxed mt-1.5">
            {p.name.split(' ')[0]} will send an itemised quotation once the analysis is finished.
          </p>
          <div className="mt-5"><Btn variant="secondary" onClick={() => navigate('status')}>Back to Status</Btn></div>
        </div>
      </div>
    )
  }

  const accepted = c.status !== 'quotation_sent'

  return (
    <div className="bg-white min-h-full flex flex-col">
      <Header title="Quotation" onBack={goBack} right={<MessagePill navigate={navigate} />} />

      <div className="flex-1 px-5 pt-4 pb-6 space-y-5">
        <div>
          <Label className="mb-2">From</Label>
          <ProRow id={c.proId} />
        </div>

        <div>
          <Label className="mb-1.5">Problem</Label>
          <p className="text-[13.5px] text-ink-700 leading-relaxed">{c.title} — {c.description}</p>
        </div>

        <div className="rounded-2xl border border-ink-200 overflow-hidden">
          <div className="grid grid-cols-[1fr_34px_62px_66px] gap-1 px-3 py-2.5 bg-ink-50 text-[11px] font-semibold text-ink-500 uppercase tracking-wide">
            <span>Item</span><span className="text-center">Qty</span><span className="text-right">Price</span><span className="text-right">Total</span>
          </div>
          {q.items.map(it => (
            <div key={it.id} className="grid grid-cols-[1fr_34px_62px_66px] gap-1 px-3 py-2.5 border-t border-ink-100 text-[12.5px] text-ink-800">
              <span className="truncate">{it.name}</span>
              <span className="text-center text-ink-500">{it.qty}</span>
              <span className="text-right text-ink-500">{money(it.price)}</span>
              <span className="text-right font-semibold">{money(it.qty * it.price)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-3 py-3.5 bg-ink-50 border-t border-ink-200">
            <span className="text-[13px] font-semibold text-ink-700">Total (LKR)</span>
            <span className="text-[19px] font-bold text-ink-900">{money(total)}</span>
          </div>
        </div>

        <Card className="divide-y divide-ink-100">
          {[
            { label: 'Estimated Duration', value: q.duration },
            { label: 'Warranty', value: q.warranty },
            { label: 'Valid Until', value: q.validUntil },
            { label: 'Sent', value: q.sentAt },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between px-4 py-3 gap-3">
              <span className="text-[13px] text-ink-500 flex-shrink-0">{r.label}</span>
              <span className="text-[13px] font-semibold text-ink-900 text-right">{r.value}</span>
            </div>
          ))}
        </Card>

        {q.notes && (
          <div>
            <Label className="mb-1.5">Notes from {p.name.split(' ')[0]}</Label>
            <p className="text-[13.5px] text-ink-700 leading-relaxed">{q.notes}</p>
          </div>
        )}

        {c.inspection.status === 'skipped' && (
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
        <Btn
          onClick={() => {
            acceptQuotation()
            toast('Quotation accepted')
            navigate('quotation-payment')
          }}
        >
          {accepted ? 'Continue to Payment' : 'Agree'}
        </Btn>
      </div>
    </div>
  )
}

// ── 17. Quotation payment ────────────────────────────────────────────────────

export function QuotationPaymentScreen({ navigate, goBack }: NavProps) {
  const c = useCase()
  const q = c.quotation
  const total = quoteTotal(q)
  const [paying, setPaying] = useState(false)
  const [open, setOpen] = useState(false)

  const pay = () => {
    if (paying || c.quotationPaid) return
    setPaying(true)
    setTimeout(() => {
      payQuotation()
      toast('Payment held in escrow — work can start')
      setPaying(false)
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
          <p className="text-[26px] font-bold text-ink-900">LKR {money(total)}</p>
        </div>

        <Card>
          <Row icon="doc" label="View Quotation Details" onClick={() => setOpen(o => !o)} />
          {open && q && (
            <div className="border-t border-ink-100 divide-y divide-ink-100 fade-in">
              {q.items.map(it => (
                <div key={it.id} className="flex items-center justify-between px-4 py-2.5 gap-3">
                  <span className="text-[12.5px] text-ink-600 truncate">{it.name} × {it.qty}</span>
                  <span className="text-[12.5px] font-semibold text-ink-900 flex-shrink-0">{money(it.qty * it.price)}</span>
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
          <span className="text-[22px] font-bold text-ink-900">LKR {money(total)}</span>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-ink-100 p-4">
        <Btn onClick={pay} disabled={paying || c.quotationPaid || !q}>
          {c.quotationPaid ? 'Already Paid' : paying ? 'Processing…' : 'Pay Now'}
        </Btn>
        <p className="text-[11.5px] text-ink-400 text-center mt-2.5 flex items-center justify-center gap-1.5">
          <Icon name="shield" size={13} /> Your payment is secure with TrustCraft.
        </p>
      </div>
    </div>
  )
}

// ── 19. Work completion submission ───────────────────────────────────────────

export function WorkCompletedScreen({ navigate, goBack }: NavProps) {
  const c = useCase()
  const p = proById(c.proId)
  const done = c.status === 'work_completed' || c.status === 'confirmed' || c.status === 'closed'

  return (
    <div className="bg-white min-h-full flex flex-col">
      <Header title="Work Completed" onBack={goBack} right={<span className="text-[11.5px] text-ink-400">{c.updatedAt}</span>} />

      <div className="flex-1 px-5 pt-4 pb-6 space-y-5">
        {!done ? (
          <div className="pt-16 text-center px-6">
            <span className="text-ink-300 inline-flex"><Icon name="wrench" size={34} /></span>
            <p className="text-[15px] font-semibold text-ink-900 mt-3">Work is still in progress</p>
            <p className="text-[13px] text-ink-500 leading-relaxed mt-1.5">
              {p.name.split(' ')[0]} will submit photos and a summary here when the job is finished.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-2.5 rounded-xl bg-success-100 p-3.5">
              <span className="text-success-700 mt-0.5"><Icon name="check" size={16} /></span>
              <p className="text-[13px] text-success-700 leading-relaxed">
                {p.name} has marked the work as completed.
              </p>
            </div>

            <div>
              <Label className="mb-1.5">Work Done</Label>
              <p className="text-[14px] text-ink-800 leading-relaxed">{c.completion?.summary}</p>
              <p className="text-[11.5px] text-ink-400 mt-1.5">Submitted {c.completion?.at}</p>
            </div>

            <div>
              <Label className="mb-2">Evidence photos · {c.completion?.photos ?? 0}</Label>
              <div className="grid grid-cols-3 gap-2.5">
                {Array.from({ length: c.completion?.photos ?? 0 }, (_, i) => (
                  <Photo key={i} h={90} hue={200 + i * 14} label={`Shot ${i + 1}`} />
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-1.5">Notes</Label>
              <p className="text-[13.5px] text-ink-600 leading-relaxed">
                Please check and confirm if everything is working fine. The repair carries a{' '}
                {c.quotation?.warranty ?? '30 days'} warranty.
              </p>
            </div>
          </>
        )}
      </div>

      {done && (
        <div className="sticky bottom-0 bg-white border-t border-ink-100 p-4 flex gap-2.5">
          <Btn variant="secondary" icon="chat" onClick={() => navigate('chat')}>Message</Btn>
          <Btn
            onClick={() => { confirmCompletion(); toast('Completion confirmed'); navigate('review') }}
            disabled={c.status !== 'work_completed'}
          >
            {c.status === 'work_completed' ? 'Confirm Completion' : 'Confirmed'}
          </Btn>
        </div>
      )}
    </div>
  )
}

// ── 20. Review ───────────────────────────────────────────────────────────────

export function ReviewScreen({ navigate, goBack }: NavProps) {
  const { d, set } = useDemo()
  const c = useCase()
  const p = proById(c.proId)
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
          onClick={() => {
            set({ rating: stars, review: text })
            closeCase()
            toast('Review submitted')
            navigate('record')
          }}
        >
          Submit Review
        </Btn>
      </div>
    </div>
  )
}

// ── 21. Past service record ──────────────────────────────────────────────────

export function RecordScreen({ navigate, goBack }: NavProps) {
  const { d, reset, step } = useDemo()
  const c = useCase()
  const p = proById(c.proId)
  const paid = c.quotationPaid ? quoteTotal(c.quotation) : c.inspection.paid ? p.inspectionFee : 0

  return (
    <div className="bg-white min-h-full flex flex-col">
      <Header title="Service Record" onBack={goBack} right={<span className="text-ink-400"><Icon name="download" size={18} /></span>} />

      <div className="flex-1 px-5 pt-4 pb-6 space-y-4">
        <Card className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[15px] font-bold text-ink-900">{c.title}</p>
              <p className="text-[12px] text-ink-500 mt-0.5">
                {c.status === 'closed' ? `Completed ${c.updatedAt}` : 'In progress'}
              </p>
            </div>
            <Tone tone={c.status === 'closed' ? 'success' : 'brand'}>{c.status === 'closed' ? 'Completed' : 'Active'}</Tone>
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
        </Card>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-ink-100 p-4">
        <Btn
          onClick={() => { reset(); toast('New request started'); navigate('home') }}
          disabled={step > 0 && c.status !== 'closed'}
        >
          {c.status === 'closed' ? 'Book Again' : 'Case still active'}
        </Btn>
      </div>
    </div>
  )
}
