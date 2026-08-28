import type { ReactNode } from 'react'
import { Icon } from '../components/UI'
import { money, type Step, type WScreen } from './data'

// ── App bar ──────────────────────────────────────────────────────────────────
// The worker app wears a dark navy crown on every screen, so the two sides of
// TrustCraft never look like the same app by accident.

export function AppBar({
  title, onBack, right, unread, onBell, avatar, flat,
}: {
  title?: string
  onBack?: () => void
  right?: ReactNode
  unread?: number
  onBell?: () => void
  avatar?: () => void
  /** Sits on a gradient the screen already paints — no background, no sticking. */
  flat?: boolean
}) {
  return (
    <div
      className={`${flat ? 'relative' : 'sticky top-0'} z-30 text-white`}
      style={
        flat
          ? undefined
          : {
              background: 'linear-gradient(118deg, #0B1220 0%, #14294F 52%, #1D4ED8 190%)',
              boxShadow: '0 1px 0 rgba(255,255,255,.06) inset, 0 8px 22px -14px rgba(2,6,23,.9)',
            }
      }
    >
      <div className="h-14 flex items-center gap-2 px-3">
        {onBack ? (
          <button
            onClick={onBack}
            aria-label="Go back"
            className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center hover:bg-white/10 active:bg-white/15 transition-colors flex-shrink-0"
          >
            <Icon name="back" size={19} />
          </button>
        ) : (
          <div className="w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 bg-white/12 ring-1 ring-white/20">
            <Icon name="shield" size={16} />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-[16.5px] font-bold tracking-[-0.02em] truncate">{title ?? 'TrustCraft'}</p>
          {!title && <p className="text-[9.5px] font-semibold tracking-[0.18em] text-white/45 -mt-0.5">PRO</p>}
        </div>

        {right ?? (
          <div className="flex items-center gap-1">
            {onBell && (
              <button
                onClick={onBell}
                aria-label="Messages"
                className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Icon name="bell" size={19} />
                {!!unread && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-danger-600 flex items-center justify-center text-[9px] font-bold ring-2 ring-[#152A4E]">
                    {unread}
                  </span>
                )}
              </button>
            )}
            {avatar && (
              <button
                onClick={avatar}
                aria-label="Profile"
                className="w-8 h-8 rounded-full ring-2 ring-white/25 flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(145deg,#3B82F6,#1E3A8A)' }}
              >
                KP
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Bottom navigation ────────────────────────────────────────────────────────

export const WTABS: { id: WScreen; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'messages', label: 'Messages', icon: 'chat' },
  { id: 'earnings', label: 'Earnings', icon: 'wallet' },
  { id: 'analyse', label: 'Analyse', icon: 'chart' },
  { id: 'profile', label: 'Profile', icon: 'user' },
]

export function WorkerNav({ active, go, unread }: { active: WScreen; go: (to: WScreen) => void; unread: number }) {
  return (
    <div className="h-20 bg-white/95 backdrop-blur border-t border-ink-200 flex items-start pt-2 px-1">
      {WTABS.map(t => {
        const on = active === t.id
        return (
          <button
            key={t.id}
            onClick={() => go(t.id)}
            className={`relative flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl transition-colors ${
              on ? 'text-brand-700' : 'text-ink-400 hover:text-ink-700'
            }`}
          >
            <span className="relative">
              <Icon name={t.icon} size={21} fill={on && t.icon === 'home'} />
              {t.id === 'messages' && unread > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-danger-600 text-white flex items-center justify-center text-[9px] font-bold">
                  {unread}
                </span>
              )}
            </span>
            <span className="text-[10px] font-semibold">{t.label}</span>
            {on && <span className="absolute -top-[9px] w-8 h-[3px] rounded-full bg-brand-600" />}
          </button>
        )
      })}
    </div>
  )
}

// ── Small primitives ─────────────────────────────────────────────────────────

export function Section({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-end justify-between mb-2.5">
      <p className="text-[11px] font-bold text-ink-400 uppercase tracking-[0.14em]">{title}</p>
      {action && (
        <button onClick={onAction} className="text-[12px] font-semibold text-brand-700 hover:text-brand-800 inline-flex items-center gap-0.5">
          {action} <Icon name="next" size={13} />
        </button>
      )}
    </div>
  )
}

export function Money({ value, size = 22, className = '' }: { value: number; size?: number; className?: string }) {
  return (
    <span className={`font-bold tracking-[-0.02em] tabular-nums ${className}`} style={{ fontSize: size }}>
      <span className="font-semibold opacity-60" style={{ fontSize: size * 0.62 }}>Rs </span>
      {money(value)}
    </span>
  )
}

export function Tag({ children, hue = 212, solid }: { children: ReactNode; hue?: number; solid?: boolean }) {
  return (
    <span
      className="inline-flex items-center text-[10.5px] font-bold px-2 py-[3px] rounded-md tracking-wide"
      style={
        solid
          ? { background: `hsl(${hue} 72% 46%)`, color: '#fff' }
          : { background: `hsl(${hue} 78% 96%)`, color: `hsl(${hue} 62% 34%)` }
      }
    >
      {children}
    </span>
  )
}

export function Meta({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11.5px] text-ink-500 font-medium">
      <span className="text-ink-400"><Icon name={icon} size={12.5} /></span>
      {children}
    </span>
  )
}

/** Photo stand-in — the prototype ships no image assets. */
export function Shot({ h = 74, hue = 205, label, className = '' }: { h?: number; hue?: number; label?: string; className?: string }) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden flex items-center justify-center text-white/60 flex-shrink-0 ${className}`}
      style={{ height: h, background: `linear-gradient(155deg, hsl(${hue} 22% 66%), hsl(${hue} 20% 36%))` }}
    >
      <Icon name="image" size={18} />
      {label && <span className="absolute bottom-1 left-1.5 text-[9px] font-semibold text-white/90">{label}</span>}
    </div>
  )
}

// ── Job step rail ────────────────────────────────────────────────────────────

export function StepRail({ steps, children }: { steps: Step[]; children?: (s: Step) => ReactNode }) {
  return (
    <div className="relative">
      {steps.map((s, i) => {
        const last = i === steps.length - 1
        return (
          <div key={s.key} className="relative flex gap-3.5">
            {/* connector */}
            {!last && (
              <span
                className="absolute left-[13px] top-7 bottom-0 w-[2px] rounded"
                style={{ background: s.status === 'done' ? 'var(--color-success-600)' : 'var(--color-ink-200)' }}
              />
            )}
            <div
              className={`relative z-10 w-[27px] h-[27px] rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                s.status === 'done'
                  ? 'bg-success-600 text-white'
                  : s.status === 'current'
                  ? 'bg-brand-600 text-white dot-glow'
                  : 'bg-white text-ink-400 border-2 border-ink-200'
              }`}
            >
              {s.status === 'done' ? <Icon name="check" size={14} /> : s.index + 1}
            </div>

            <div className={`flex-1 min-w-0 ${last ? 'pb-0' : 'pb-4'}`}>
              <p
                className={`text-[14.5px] leading-tight ${
                  s.status === 'current'
                    ? 'font-bold text-ink-900'
                    : s.status === 'done'
                    ? 'font-semibold text-ink-800'
                    : 'font-medium text-ink-400'
                }`}
              >
                {s.label}
              </p>
              <p className={`text-[11.5px] mt-0.5 ${s.status === 'pending' ? 'text-ink-300' : 'text-ink-500'}`}>{s.note}</p>
              {children?.(s)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Charts ───────────────────────────────────────────────────────────────────

export function Bars({ data, height = 96, light }: { data: { m: string; v: number }[]; height?: number; light?: boolean }) {
  const max = Math.max(...data.map(d => d.v))
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => {
        const top = i === data.length - 1
        return (
          <div key={d.m} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <div
              className="w-full rounded-t-[5px] transition-all"
              style={{
                height: `${Math.max(8, (d.v / max) * (height - 20))}px`,
                background: top
                  ? 'linear-gradient(180deg,#3B82F6,#1D4ED8)'
                  : light ? 'rgba(255,255,255,.22)' : 'var(--color-ink-200)',
              }}
            />
            <span className={`text-[9.5px] font-semibold ${top ? 'text-brand-700' : light ? 'text-white/50' : 'text-ink-400'}`}>
              {d.m}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/** Thin progress meter used for trust factors and job progress. */
export function Meter({ value, tone = 'brand' }: { value: number; tone?: 'brand' | 'success' | 'warning' }) {
  const bg = { brand: '#2563EB', success: '#16A34A', warning: '#F59E0B' }[tone]
  return (
    <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, background: bg }} />
    </div>
  )
}

// ── Sticky action dock ───────────────────────────────────────────────────────

export function Dock({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 mt-auto px-5 pt-3 pb-5 bg-gradient-to-t from-white via-white to-white/0">
      {children}
    </div>
  )
}

// ── Switch ───────────────────────────────────────────────────────────────────

export function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`w-[42px] h-[25px] rounded-full p-[3px] flex-shrink-0 transition-colors ${on ? 'bg-brand-600' : 'bg-ink-200'}`}
    >
      <span
        className="block w-[19px] h-[19px] rounded-full bg-white shadow-sm transition-transform"
        style={{ transform: on ? 'translateX(17px)' : 'none' }}
      />
    </button>
  )
}
