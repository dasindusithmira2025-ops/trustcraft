import { ScreenId } from '../types'

// ── Status bar ──────────────────────────────────────────────────────────────

function BatteryIcon({ light }: { light?: boolean }) {
  const c = light ? 'white' : '#0F1114'
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
      <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke={c} strokeOpacity={light ? 1 : 0.9} strokeWidth="1.1"/>
      <rect x="2" y="2" width="17" height="8" rx="1.5" fill={c} fillOpacity={light ? 1 : 0.9}/>
      <path d="M23 4V8C23.83 7.5 24.5 6.8 24.5 6S23.83 4.5 23 4Z" fill={c} fillOpacity="0.5"/>
    </svg>
  )
}

function SignalIcon({ light }: { light?: boolean }) {
  const c = light ? 'white' : '#0F1114'
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill={c}>
      <rect x="0" y="8" width="3" height="4" rx="0.7"/>
      <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.7"/>
      <rect x="9" y="3" width="3" height="9" rx="0.7"/>
      <rect x="13.5" y="0" width="3" height="12" rx="0.7"/>
    </svg>
  )
}

export function StatusBar({ light }: { light?: boolean }) {
  const textCls = light ? 'text-white' : 'text-ink-900'
  return (
    <div className={`absolute top-0 left-0 right-0 z-40 h-11 flex items-end justify-between px-6 pb-1 pointer-events-none`}>
      <span className={`${textCls} text-[13px] font-semibold font-data`}>9:41</span>
      <div className="flex items-center gap-1.5">
        <SignalIcon light={light} />
        <svg width="16" height="12" viewBox="0 0 16 12" fill={light ? 'white' : '#0F1114'} opacity="0.85">
          <path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0-3c1.83 0 3.48.76 4.67 1.97l1.42-1.42A8.47 8.47 0 008 4.5c-2.37 0-4.52.98-6.09 2.55l1.42 1.42A6.5 6.5 0 018 6.5zm0-3c2.76 0 5.24 1.1 7.02 2.91l1.42-1.42A10.45 10.45 0 008 1.5c-2.92 0-5.55 1.2-7.44 3.14l1.42 1.37A8.48 8.48 0 018 3.5z"/>
        </svg>
        <BatteryIcon light={light} />
      </div>
    </div>
  )
}

// ── Back button ──────────────────────────────────────────────────────────────

export function BackButton({ onPress, light }: { onPress: () => void; light?: boolean }) {
  return (
    <button
      onClick={onPress}
      className={`w-11 h-11 flex items-center justify-center rounded-full flex-shrink-0 transition-colors
        ${light ? 'text-white hover:bg-white/15' : 'text-ink-900 hover:bg-ink-100'}`}
      aria-label="Go back"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.5 15L7.5 10L12.5 5"/>
      </svg>
    </button>
  )
}

// ── Trust badge ──────────────────────────────────────────────────────────────

export function TrustBadge({ score, size = 'sm' }: { score: number; size?: 'sm' | 'lg' }) {
  const px = size === 'lg' ? 'px-3 py-1.5' : 'px-2 py-1'
  const mono = size === 'lg' ? 'text-[13px]' : 'text-[11px]'
  const num = size === 'lg' ? 'text-[22px]' : 'text-[17px]'
  const label1 = size === 'lg' ? 'text-[13px]' : 'text-[11px]'
  const label2 = size === 'lg' ? 'text-[11px]' : 'text-[10px]'
  return (
    <div className="flex items-center gap-2">
      <div className={`bg-teal-800 text-white rounded-xl flex items-center gap-1 ${px}`}>
        <span className={`font-data font-medium tracking-wide ${mono}`}>TRUST</span>
        <span className={`font-display leading-none ${num}`}>{score}</span>
      </div>
      <div>
        <p className={`text-success-700 font-semibold leading-tight ${label1}`}>Excellent</p>
        <p className={`text-ink-400 leading-tight ${label2}`}>Verified</p>
      </div>
    </div>
  )
}

// ── Bottom navigation ─────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    id: 'home', label: 'Home', to: 'home' as ScreenId,
    icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={a ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L11 3.5L19 9.5V19H14V14H8V19H3V9.5Z" fill={a ? 'currentColor' : 'none'}/>
      </svg>
    ),
  },
  {
    id: 'jobs', label: 'Jobs', to: 'active-job' as ScreenId,
    icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={a ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="16" height="14" rx="2" fill={a ? 'currentColor' : 'none'}/>
        <path d="M7 6V5C7 3.3 7.9 2 9 2H13C14.1 2 15 3.3 15 5V6"/>
        {a && <path d="M8 13L10 15L14 11" stroke="white" strokeWidth="2"/>}
      </svg>
    ),
  },
  {
    id: 'messages', label: 'Messages', to: 'pro-request' as ScreenId,
    icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={a ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4H18C19.1 4 20 4.9 20 6V14C20 15.1 19.1 16 18 16H7L3 20V6C3 4.9 3.9 4 4 4Z" fill={a ? 'currentColor' : 'none'}/>
      </svg>
    ),
  },
  {
    id: 'profile', label: 'Profile', to: 'my-home' as ScreenId,
    icon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={a ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="7.5" r="4" fill={a ? 'currentColor' : 'none'}/>
        <path d="M3 20C3 16.7 6.6 14 11 14S19 16.7 19 20"/>
      </svg>
    ),
  },
]

export function BottomNav({ active, navigate }: { active: string; navigate: (to: ScreenId) => void }) {
  return (
    <div className="h-20 bg-white border-t border-ink-100 flex items-center pb-3 px-1">
      {NAV_ITEMS.map(({ id, label, to, icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => navigate(to)}
            className={`flex-1 flex flex-col items-center gap-1 pt-2 pb-1 rounded-xl transition-colors ${
              isActive ? 'text-teal-800' : 'text-ink-400 hover:text-ink-700'
            }`}
          >
            {icon(isActive)}
            <span className={`text-[10px] font-medium ${isActive ? 'text-teal-800' : 'text-ink-400'}`}>
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ── Prototype navigator (outside phone frame) ─────────────────────────────────

const PROTO_SCREENS: { label: string; screen: ScreenId; flow: string }[] = [
  { label: 'Home', screen: 'home', flow: 'A' },
  { label: 'Camera', screen: 'camera', flow: 'A' },
  { label: 'Voice', screen: 'voice', flow: 'A' },
  { label: 'AI Analysis', screen: 'ai-analysis', flow: 'A' },
  { label: 'Problem Canvas ★', screen: 'problem-canvas', flow: 'A' },
  { label: 'Clarification', screen: 'clarification', flow: 'A' },
  { label: 'Structured Request', screen: 'structured-request', flow: 'A' },
  { label: 'Top Matches ★', screen: 'top-matches', flow: 'B' },
  { label: 'Why This Match ★', screen: 'why-match', flow: 'B' },
  { label: 'Pro Profile', screen: 'pro-profile', flow: 'B' },
  { label: 'Trust Score ★', screen: 'trust-score', flow: 'B' },
  { label: 'Booking', screen: 'booking', flow: 'B' },
  { label: 'Appointment', screen: 'appointment', flow: 'C' },
  { label: 'Inspection', screen: 'inspection', flow: 'C' },
  { label: 'Repair Plan ★', screen: 'repair-plan', flow: 'C' },
  { label: 'Price Context', screen: 'price-context', flow: 'C' },
  { label: 'Approval', screen: 'approval', flow: 'C' },
  { label: 'Active Job ★', screen: 'active-job', flow: 'D' },
  { label: 'Completion', screen: 'completion', flow: 'D' },
  { label: 'Resolved ★', screen: 'resolved', flow: 'D' },
  { label: 'Review', screen: 'review', flow: 'D' },
  { label: 'My Home', screen: 'my-home', flow: 'D' },
  { label: 'Pro: Request', screen: 'pro-request', flow: 'Pro' },
]

const FLOW_COLORS: Record<string, string> = {
  A: '#0D7E7E', B: '#B8842A', C: '#1D7A47', D: '#6B7280', Pro: '#2D3139',
}

export function ProtoNav({ navigate, current }: { navigate: (to: ScreenId) => void; current: ScreenId }) {
  const flows = Array.from(new Set(PROTO_SCREENS.map(s => s.flow)))
  return (
    <div className="mt-6 w-full max-w-xl px-4">
      {flows.map(flow => (
        <div key={flow} className="mb-3">
          <p className="text-[10px] text-white/30 font-data tracking-wider mb-1.5">
            FLOW {flow}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PROTO_SCREENS.filter(s => s.flow === flow).map(({ label, screen }) => {
              const isActive = current === screen
              const color = FLOW_COLORS[flow]
              return (
                <button
                  key={screen}
                  onClick={() => navigate(screen)}
                  className="px-3 py-1.5 rounded-full text-[11px] font-medium transition-all"
                  style={{
                    background: isActive ? color : 'rgba(255,255,255,0.08)',
                    color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                    border: isActive ? `1px solid ${color}` : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
