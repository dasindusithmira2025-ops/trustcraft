import { NavProps } from '../types'

export function ProRequestScreen({ navigate }: NavProps) {
  return (
    <div className="h-full bg-ink-50 flex flex-col">
      {/* Pro header — dark */}
      <div className="bg-ink-900 px-5 pt-5 pb-5 flex-shrink-0">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-teal-700 rounded-xl flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
                <path d="M7 1L2 3.5V7C2 10 4.2 12.5 7 13.5C9.8 12.5 12 10 12 7V3.5L7 1Z"/>
              </svg>
            </div>
            <span className="font-display text-[20px] text-white">TrustCraft</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-data text-teal-400 bg-teal-900/60 border border-teal-800 px-2.5 py-1 rounded-full tracking-wider">PRO</span>
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=36&h=36&fit=crop&auto=format"
              alt="Chamod"
              className="w-9 h-9 rounded-full object-cover border-2 border-teal-700"
            />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-[11px] font-data text-teal-400 tracking-widest mb-1.5">NEW REQUEST · PLUMBING</p>
            <h1 className="font-display text-[26px] text-white leading-tight">Possible sink<br />connection leak</h1>
          </div>
          <div className="bg-warning-700 rounded-xl px-2.5 py-1.5 mt-1 flex-shrink-0">
            <span className="text-[11px] font-data text-white font-medium tracking-wider">MODERATE</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scroll bg-ink-50 px-5 pt-5 pb-8">
        {/* Request details */}
        <div className="bg-white rounded-2xl border border-ink-200 divide-y divide-ink-100 mb-4">
          {[
            { label: 'Location', value: 'Colombo 05 · 2.4 km away', icon: '📍' },
            { label: 'Customer availability', value: '4:30 PM – 7:00 PM today', icon: '🗓' },
            { label: 'Inspection fee', value: 'LKR 1,000', icon: '💳' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3.5">
              <span className="text-[17px] flex-shrink-0">{icon}</span>
              <span className="text-[13px] text-ink-400 flex-1">{label}</span>
              <span className="text-[13px] font-semibold text-ink-900">{value}</span>
            </div>
          ))}
        </div>

        {/* Evidence */}
        <div className="bg-white rounded-2xl border border-ink-200 p-4 mb-4">
          <p className="text-[11px] font-data text-ink-400 tracking-widest mb-3">CUSTOMER EVIDENCE</p>
          <div className="flex gap-3 items-center">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-ink-200 flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=64&h=64&fit=crop"
                alt="Evidence photo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex items-center gap-1 bg-ink-100 rounded-full px-2.5 py-1">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="1" y="3" width="10" height="7" rx="1"/>
                    <path d="M4 3V2.5C4 2 4.4 1.5 5 1.5H7C7.6 1.5 8 2 8 2.5V3"/>
                    <circle cx="6" cy="6.5" r="1.5"/>
                  </svg>
                  <span className="text-[12px] text-ink-500 font-medium">3 photos</span>
                </div>
                <div className="flex items-center gap-1 bg-ink-100 rounded-full px-2.5 py-1">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="4" y="1" width="4" height="6" rx="2"/>
                    <path d="M2 6.5C2 8.7 3.8 10.5 6 10.5S10 8.7 10 6.5"/>
                    <line x1="6" y1="10.5" x2="6" y2="12"/>
                  </svg>
                  <span className="text-[12px] text-ink-500 font-medium">1 voice note</span>
                </div>
              </div>
              <p className="text-[13px] text-ink-400">Tap to view all evidence</p>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-ink-900 rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-teal-700 rounded-lg flex items-center justify-center">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="5.5" cy="5.5" r="3.5"/>
                <path d="M5.5 3.5V5.8M5.5 7V7.5" strokeWidth="1.8"/>
              </svg>
            </div>
            <p className="text-[11px] font-data text-teal-400 tracking-widest">AI SUMMARY</p>
          </div>
          <p className="text-[14px] text-white/85 leading-relaxed italic">
            "Continuous leak reported below the kitchen sink. Confirmed present with tap fully closed. Local shutoff status unknown. Likely compression fitting or supply line failure."
          </p>
        </div>

        {/* Confidence bar */}
        <div className="bg-white rounded-xl border border-ink-200 p-4 mb-6 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[12px] text-ink-400 mb-1.5">AI assessment confidence</p>
            <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal-700 rounded-full progress-fill" style={{ width: '87%' }} />
            </div>
          </div>
          <span className="font-data text-[18px] font-semibold text-teal-800">87%</span>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('appointment')}
            className="w-full h-14 bg-teal-800 text-white rounded-2xl font-semibold text-[15px] hover:bg-teal-900 transition-colors"
          >
            Accept Request
          </button>
          <button className="w-full h-12 border border-ink-200 text-ink-700 rounded-2xl font-medium text-[14px] hover:bg-ink-100 transition-colors">
            Ask a Question
          </button>
          <button className="w-full h-12 text-danger-700 font-medium text-[14px] hover:bg-danger-100 rounded-2xl transition-colors">
            Decline
          </button>
        </div>

        <p className="text-[12px] text-ink-400 text-center mt-5 leading-relaxed">
          AI reduces friction for both sides. You receive structured, pre-analysed information instead of an unstructured message.
        </p>
      </div>
    </div>
  )
}
