import { useState } from 'react'
import { NavProps } from '../types'
import { BackButton } from '../components/Shared'

// ── Appointment Status ───────────────────────────────────────────────────────

export function AppointmentScreen({ navigate, goBack }: NavProps) {
  return (
    <div className="h-full bg-ink-50 flex flex-col">
      <div className="flex items-center px-4 pt-4 pb-2">
        <BackButton onPress={goBack} />
        <p className="text-[15px] font-semibold text-ink-900 mx-auto pr-10">Appointment</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scroll px-6 pt-2 pb-8">
        {/* Status hero */}
        <div className="bg-teal-800 rounded-2xl p-5 mb-5 text-white">
          <p className="text-teal-300 text-[11px] font-data tracking-widest mb-1">STATUS</p>
          <p className="font-display text-[24px] leading-tight mb-3">Chamod is on the way</p>
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-teal-300 soft-pulse" />
            <span className="font-data text-[20px] font-medium">18 min</span>
            <span className="text-teal-300 text-[14px]">estimated</span>
          </div>
        </div>

        {/* Minimal map placeholder */}
        <div className="h-36 bg-ink-100 rounded-2xl mb-5 relative overflow-hidden flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none" viewBox="0 0 390 144">
            <path d="M40 100 C80 80 130 50 200 65 C250 78 290 55 340 45" stroke="#0B6B6B" strokeWidth="3" fill="none" strokeDasharray="10 5"/>
            <circle cx="340" cy="45" r="8" fill="#0B6B6B" opacity="0.8"/>
            <circle cx="200" cy="65" r="6" fill="#B8842A" opacity="0.8"/>
            <circle cx="40" cy="100" r="5" fill="#1D7A47" opacity="0.8"/>
          </svg>
          <div className="text-center z-10">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" className="mx-auto mb-1.5">
              <circle cx="11" cy="9" r="4"/><path d="M11 20C11 20 4 14.5 4 9C4 5.1 7.1 2 11 2S18 5.1 18 9C18 14.5 11 20 11 20Z"/>
            </svg>
            <p className="text-[13px] text-ink-500">Colombo 05</p>
          </div>
        </div>

        {/* Pro card */}
        <div className="bg-white rounded-2xl border border-ink-200 p-4 mb-5 flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=56&h=56&fit=crop&auto=format"
            alt="Chamod Fernando"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-ink-900">Chamod Fernando</p>
            <p className="text-[13px] text-ink-400">Plumber · TRUST 92</p>
          </div>
          <button className="w-10 h-10 rounded-full border border-ink-200 flex items-center justify-center text-ink-500 hover:bg-ink-50 transition-colors">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <path d="M3.5 3.5H13.5C14.1 3.5 14.5 3.9 14.5 4.5V10.5C14.5 11.1 14.1 11.5 13.5 11.5H6L2.5 14.5V4.5C2.5 3.9 2.9 3.5 3.5 3.5Z"/>
            </svg>
          </button>
        </div>

        {/* Progress timeline */}
        <p className="text-[11px] font-data text-ink-400 tracking-widest mb-3">JOB PROGRESS</p>
        <div className="relative">
          <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-ink-200" />
          {[
            { label: 'Request understood', done: true, detail: null },
            { label: 'Chamod selected', done: true, detail: '94% match' },
            { label: 'Chamod travelling', active: true, detail: '18 min away' },
            { label: 'Inspection', done: false, detail: null },
            { label: 'Quote received', done: false, detail: null },
            { label: 'Repair', done: false, detail: null },
            { label: 'Completed', done: false, detail: null },
          ].map(({ label, done, active, detail }, i) => (
            <div key={i} className={`flex items-start gap-4 py-2.5 ${!done && !active ? 'opacity-35' : ''}`}>
              <div className={`relative z-10 w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${done ? 'bg-teal-700' : active ? 'bg-teal-800 timeline-active' : 'bg-ink-200'}`}>
                {done
                  ? <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M2 5.5L4.5 8L9 3"/></svg>
                  : active
                  ? <div className="w-2 h-2 rounded-full bg-white" />
                  : <div className="w-1.5 h-1.5 rounded-full bg-ink-400" />
                }
              </div>
              <div className="flex-1">
                <p className={`text-[14px] leading-snug ${active ? 'font-semibold text-ink-900' : done ? 'font-medium text-ink-600' : 'text-ink-400'}`}>{label}</p>
                {detail && <p className="text-[12px] text-ink-400 mt-0.5 font-data">{detail}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Inspection Result ────────────────────────────────────────────────────────

export function InspectionScreen({ navigate, goBack }: NavProps) {
  return (
    <div className="h-full bg-ink-50 flex flex-col">
      <div className="flex items-center px-4 pt-4 pb-2">
        <BackButton onPress={goBack} />
        <p className="text-[15px] font-semibold text-ink-900 mx-auto pr-10">Inspection</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scroll px-6 pt-4 pb-8">
        {/* Done badge */}
        <div className="flex items-center gap-3 bg-success-100 rounded-2xl px-4 py-3.5 mb-5 border border-success-700/20">
          <div className="w-10 h-10 bg-success-700 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M3.5 9L7 12.5L14.5 5.5"/>
            </svg>
          </div>
          <div>
            <p className="text-[15px] font-semibold text-success-800">Inspection Complete</p>
            <p className="text-[13px] text-success-700">Chamod has assessed the issue</p>
          </div>
        </div>

        {/* Findings */}
        <p className="text-[11px] font-data text-ink-400 tracking-widest mb-3">TECHNICIAN FINDINGS</p>
        <div className="bg-white rounded-2xl border border-ink-200 p-5 mb-5">
          <p className="text-[16px] font-semibold text-ink-900 mb-2.5">Damaged sink connector</p>
          <p className="text-[14px] text-ink-600 leading-relaxed mb-4">
            The compression fitting connecting the supply line to the sink mixer has developed a hairline fracture. Continuous drip confirmed regardless of tap position. Connector replacement is required.
          </p>
          <div className="flex items-center gap-1.5 text-[13px] text-ink-400">
            <div className="w-2 h-2 rounded-full bg-warning-700" />
            Moderate urgency — fix within 48 hrs recommended
          </div>
        </div>

        {/* Evidence photos */}
        <p className="text-[11px] font-data text-ink-400 tracking-widest mb-3">EVIDENCE PHOTOS</p>
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {[
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=120&h=90&fit=crop',
            'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=120&h=90&fit=crop',
            'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=120&h=90&fit=crop',
          ].map((url, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden bg-ink-200">
              <img src={url} alt={`Evidence ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="bg-teal-50 rounded-xl border border-teal-200 px-4 py-3.5 text-[13px] text-teal-800 leading-relaxed">
          A repair plan is ready. Review it and decide before any work begins.
        </div>
      </div>
      <div className="px-6 pb-10 pt-3">
        <button onClick={() => navigate('repair-plan')} className="w-full h-14 bg-teal-800 text-white rounded-2xl font-semibold text-[15px] hover:bg-teal-900 transition-colors">
          View Repair Plan
        </button>
      </div>
    </div>
  )
}

// ── Repair Plan ★ ─────────────────────────────────────────────────────────────

export function RepairPlanScreen({ navigate, goBack }: NavProps) {
  return (
    <div className="h-full bg-ink-50 flex flex-col">
      <div className="flex items-center px-4 pt-4 pb-2">
        <BackButton onPress={goBack} />
        <p className="text-[15px] font-semibold text-ink-900 mx-auto pr-10">Repair Plan</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scroll px-6 pt-4 pb-8">
        {/* Plan header */}
        <div className="mb-5">
          <p className="text-[11px] font-data text-teal-800 tracking-widest mb-1.5">REPAIR PLAN</p>
          <h1 className="font-display text-[30px] text-ink-900 leading-tight">
            Replace damaged<br />sink connector
          </h1>
          <p className="text-[13px] text-ink-400 mt-1.5">Chamod Fernando · August 19, 2026</p>
        </div>

        {/* Parts */}
        <div className="bg-white rounded-2xl border border-ink-200 overflow-hidden mb-3">
          <div className="px-5 py-2.5 bg-ink-50 border-b border-ink-100">
            <p className="text-[10px] font-data text-ink-400 tracking-widest">PARTS</p>
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-ink-900">Compression connector</p>
              <p className="text-[12px] text-ink-400 mt-0.5">Presto · 15mm · standard quality</p>
            </div>
            <p className="font-data text-[15px] font-semibold text-ink-900">LKR 2,400</p>
          </div>
        </div>

        {/* Labour */}
        <div className="bg-white rounded-2xl border border-ink-200 overflow-hidden mb-3">
          <div className="px-5 py-2.5 bg-ink-50 border-b border-ink-100">
            <p className="text-[10px] font-data text-ink-400 tracking-widest">LABOUR</p>
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-ink-900">Installation + pressure test</p>
              <p className="text-[12px] text-ink-400 mt-0.5">Est. 45–60 min</p>
            </div>
            <p className="font-data text-[15px] font-semibold text-ink-900">LKR 3,500</p>
          </div>
        </div>

        {/* Inspection fee */}
        <div className="bg-white rounded-2xl border border-ink-200 overflow-hidden mb-5">
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-ink-900">Inspection fee</p>
              <p className="text-[12px] text-ink-400 mt-0.5">Included in this total</p>
            </div>
            <p className="font-data text-[15px] font-semibold text-ink-900">LKR 1,000</p>
          </div>
        </div>

        {/* Total */}
        <div className="bg-ink-900 rounded-2xl px-5 py-5 mb-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-data text-ink-300 tracking-widest mb-1">TOTAL</p>
              <p className="font-display text-[36px] text-white leading-none">LKR 6,900</p>
            </div>
            <button
              onClick={() => navigate('price-context')}
              className="flex items-center gap-1 text-[13px] text-teal-300 hover:text-teal-200 transition-colors pb-1"
            >
              Price context
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M2.5 6H9.5M7 3.5L9.5 6L7 8.5"/>
              </svg>
            </button>
          </div>
        </div>

        <p className="text-[12px] text-ink-400 text-center mb-6 leading-relaxed px-4">
          No work begins until you explicitly approve this plan. You may request changes first.
        </p>
      </div>
      <div className="px-6 pb-10 pt-3 flex gap-3">
        <button className="flex-1 h-14 border border-ink-300 text-ink-600 rounded-2xl font-semibold text-[15px] hover:bg-ink-100 transition-colors">
          Request Changes
        </button>
        <button
          onClick={() => navigate('approval')}
          className="flex-[2] h-14 bg-teal-800 text-white rounded-2xl font-semibold text-[15px] hover:bg-teal-900 transition-colors"
        >
          Approve LKR 6,900
        </button>
      </div>
    </div>
  )
}

// ── Price Context ────────────────────────────────────────────────────────────

export function PriceContextScreen({ goBack }: NavProps) {
  return (
    <div className="h-full bg-ink-50 flex flex-col">
      <div className="flex items-center px-4 pt-4 pb-2">
        <BackButton onPress={goBack} />
        <p className="text-[15px] font-semibold text-ink-900 mx-auto pr-10">Price Context</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scroll px-6 pt-5 pb-8">
        <p className="text-[11px] font-data text-ink-400 tracking-widest mb-2">PRICE CONTEXT</p>
        <p className="font-display text-[28px] text-ink-900 leading-tight mb-1">Typical range</p>
        <p className="text-[14px] text-ink-400 mb-6">Sink leak repair · Colombo area</p>

        {/* Range bar */}
        <div className="bg-white rounded-2xl border border-ink-200 p-5 mb-5">
          <div className="flex justify-between text-[12px] text-ink-400 font-data mb-3">
            <span>LKR 4,200</span>
            <span>LKR 12,500</span>
          </div>
          <div className="relative h-3 bg-ink-100 rounded-full mb-2">
            <div className="absolute inset-y-0 left-[12%] right-[18%] bg-teal-100 rounded-full" />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-teal-800 rounded-full border-2 border-white shadow"
              style={{ left: 'calc(38% - 10px)' }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-ink-400 mb-4">
            <span>Low</span>
            <span>High</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-ink-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-teal-800 rounded-full" />
              <span className="text-[13px] text-ink-700">This quote</span>
            </div>
            <span className="font-data text-[16px] font-semibold text-teal-800">LKR 6,900</span>
          </div>
        </div>

        <div className="bg-teal-50 rounded-xl border border-teal-200 p-4 mb-5">
          <p className="text-[14px] text-ink-700 leading-relaxed">
            "Within the usual range of comparable completed jobs in this area."
          </p>
        </div>

        <p className="text-[11px] font-data text-ink-400 tracking-widest mb-3">BASED ON</p>
        {['14 comparable completed jobs', 'Sink connector replacement, Colombo', 'Includes parts + labour + inspection', 'Last updated August 2026'].map(item => (
          <div key={item} className="flex items-start gap-2.5 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 flex-shrink-0" />
            <span className="text-[13px] text-ink-600">{item}</span>
          </div>
        ))}

        <div className="mt-5 bg-ink-100 rounded-xl px-4 py-3.5">
          <p className="text-[12px] text-ink-500 leading-relaxed">
            Informational guidance only. It does not set or enforce pricing. Professionals set their own rates independently.
          </p>
        </div>
      </div>
      <div className="px-6 pb-10 pt-3">
        <button onClick={goBack} className="w-full h-14 bg-teal-800 text-white rounded-2xl font-semibold text-[15px] hover:bg-teal-900 transition-colors">
          Back to Repair Plan
        </button>
      </div>
    </div>
  )
}

// ── Approval ─────────────────────────────────────────────────────────────────

export function ApprovalScreen({ navigate, goBack }: NavProps) {
  return (
    <div className="h-full bg-ink-50 flex flex-col">
      <div className="flex items-center px-4 pt-4 pb-2">
        <BackButton onPress={goBack} />
        <p className="text-[15px] font-semibold text-ink-900 mx-auto pr-10">Approve Plan</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scroll flex flex-col items-center px-6 pt-8 pb-6">
        {/* Lock icon */}
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-5">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="#0B6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="11" width="18" height="13" rx="2"/>
            <path d="M8.5 11V8C8.5 5.5 10.6 3.5 13 3.5S17.5 5.5 17.5 8V11"/>
          </svg>
        </div>

        <p className="text-[11px] font-data text-ink-400 tracking-widest mb-2">YOU ARE APPROVING</p>
        <p className="font-display text-[42px] text-ink-900 mb-1 text-center leading-none">LKR 6,900</p>
        <p className="text-[14px] text-ink-400 mb-8 text-center">Kitchen sink repair · Chamod Fernando</p>

        {/* Commitments */}
        <div className="w-full bg-white rounded-2xl border border-ink-200 divide-y divide-ink-100 mb-7">
          {[
            'Work begins only after your approval',
            'You will not be charged above this amount without a new approval',
            'Payment is protected until you verify the completed work',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 px-5 py-4">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="#1D7A47" strokeWidth="2.2" strokeLinecap="round" className="mt-0.5 flex-shrink-0">
                <path d="M2.5 7.5L5.5 10.5L12.5 3.5"/>
              </svg>
              <p className="text-[13px] text-ink-700 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>

        {/* Protected payment */}
        <div className="flex items-center gap-2 mb-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#0B6B6B" strokeWidth="1.8" strokeLinecap="round">
            <path d="M7 1L2 3.5V7C2 9.8 4.2 12.5 7 13C9.8 12.5 12 9.8 12 7V3.5L7 1Z"/>
            <path d="M5 7L6.5 8.5L9.5 5.5"/>
          </svg>
          <p className="text-[13px] text-teal-800 font-semibold">TrustCraft Protected Payment</p>
        </div>
        <p className="text-[12px] text-ink-400 text-center">Funds are held securely until job verified</p>
      </div>
      <div className="px-6 pb-10 pt-3">
        <button
          onClick={() => navigate('active-job')}
          className="w-full h-14 bg-teal-800 text-white rounded-2xl font-semibold text-[15px] hover:bg-teal-900 transition-colors flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M8 1.5L2 4V8C2 11.3 4.8 14 8 15C11.2 14 14 11.3 14 8V4L8 1.5Z"/>
            <path d="M5.5 8L7 9.5L10.5 6"/>
          </svg>
          Approve Repair Plan
        </button>
      </div>
    </div>
  )
}

// ── Payment Confirmed ────────────────────────────────────────────────────────

export function PaymentScreen({ navigate }: NavProps) {
  return (
    <div className="h-full bg-ink-50 flex flex-col items-center justify-center px-8 text-center">
      <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mb-5 scale-in">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="#1D7A47" strokeWidth="2.5" strokeLinecap="round">
          <path d="M4 13L10 19L22 7"/>
        </svg>
      </div>
      <p className="font-display text-[30px] text-ink-900 mb-2">Approved.</p>
      <p className="text-[15px] text-ink-400 mb-8 leading-relaxed">
        Chamod will begin the repair shortly.<br />You will be notified at each step.
      </p>
      <button onClick={() => navigate('active-job')} className="h-12 px-8 bg-teal-800 text-white rounded-2xl font-semibold text-[15px] hover:bg-teal-900 transition-colors">
        Track Job Progress
      </button>
    </div>
  )
}
