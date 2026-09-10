import { createContext, useContext, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { ScreenId, StageState } from '../types'
import type { Attachment } from '../case'
import { useToast } from '../caseStore'

// ── Icons ────────────────────────────────────────────────────────────────────
// One 24×24 stroke set, drawn in currentColor, so every screen stays visually
// consistent without pulling in an icon dependency.

const PATHS: Record<string, string> = {
  back: 'M15 5l-7 7 7 7',
  next: 'M9 5l7 7-7 7',
  up: 'M5 15l7-7 7 7',
  down: 'M5 9l7 7 7-7',
  bell: 'M18 9a6 6 0 10-12 0c0 5-2 6-2 6h16s-2-1-2-6M13.7 20a2 2 0 01-3.4 0',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4-4',
  camera: 'M4 8h3l1.5-2h7L17 8h3v11H4V8zM12 16.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z',
  video: 'M4 7h11v10H4V7zM15 11l5-3v8l-5-3',
  mic: 'M12 3a2.5 2.5 0 012.5 2.5v6a2.5 2.5 0 01-5 0v-6A2.5 2.5 0 0112 3zM6 11a6 6 0 0012 0M12 17v4',
  pin: 'M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  home: 'M4 10.5L12 4l8 6.5V20h-5v-5H9v5H4v-9.5z',
  wrench: 'M20 6.5a4.5 4.5 0 01-6 5.6L6.8 19.3a2 2 0 11-2.8-2.8L11.2 9A4.5 4.5 0 0116.8 3l-2.6 2.6 1.6 2.6L19 6.1z',
  cases: 'M4 8h16v11H4V8zM9 8V6a2 2 0 012-2h2a2 2 0 012 2v2',
  chat: 'M4 5h16v11H9l-5 4V5z',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-3.5 3.6-6 8-6s8 2.5 8 6',
  filter: 'M4 6h16M7 12h10M10 18h4',
  calendar: 'M4 6h16v14H4V6zM8 3v5M16 3v5M4 11h16',
  check: 'M5 12.5l4.5 4.5L19 7',
  star: 'M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5z',
  edit: 'M4 20h4L19 9l-4-4L4 16v4zM14.5 5.5l4 4',
  image: 'M4 5h16v14H4V5zM4 16l4.5-4.5 4 4L16 12l4 4M9 10a1.3 1.3 0 100-2.6A1.3 1.3 0 009 10z',
  share: 'M12 16V4M8 8l4-4 4 4M4 14v6h16v-6',
  heart: 'M12 20S4 15 4 9.5A4 4 0 0112 7a4 4 0 018 2.5C20 15 12 20 12 20z',
  card: 'M3 6h18v12H3V6zM3 10h18',
  download: 'M12 4v11M8 11l4 4 4-4M4 20h16',
  doc: 'M6 3h8l4 4v14H6V3zM14 3v4h4',
  phone: 'M6 3h4l2 5-2.5 1.5a11 11 0 005 5L16 12l5 2v4a2 2 0 01-2.2 2A16 16 0 014 6.2 2 2 0 016 4V3z',
  mail: 'M3 6h18v12H3V6zM3 7l9 6 9-6',
  id: 'M3 6h18v12H3V6zM9 12.5a1.8 1.8 0 100-3.6 1.8 1.8 0 000 3.6zM6 16c.6-1.5 1.7-2.2 3-2.2s2.4.7 3 2.2M14.5 10H18M14.5 13.5H18',
  shield: 'M12 3l7 3v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6l7-3zM8.8 12l2.2 2.2 4.2-4.4',
  x: 'M6 6l12 12M18 6L6 18',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  logout: 'M15 4h4v16h-4M11 8l-4 4 4 4M7 12h10',
  upload: 'M12 16V5M8 9l4-4 4 4M4 20h16',
  flip: 'M4 9a8 8 0 0113.5-3M20 15A8 8 0 016.5 18M17 3v3.5h-3.5M7 21v-3.5h3.5',
  play: 'M8 5l11 7-11 7V5z',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z',
  clock: 'M12 4a8 8 0 100 16 8 8 0 000-16zM12 7.5V12l3 2',
  wallet: 'M4 7h13a3 3 0 013 3v7H4V7zM4 7l11-3v3M17 13.5h.01',
  more: 'M6 12h.01M12 12h.01M18 12h.01',
  send: 'M4 12l16-8-6 16-2.5-6L4 12z',
  info: 'M12 4a8 8 0 100 16 8 8 0 000-16zM12 11v5M12 8h.01',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  bolt: 'M13 2L4.5 13.5H11l-1 8.5L19.5 10H13l0-8z',
  stop: 'M6.5 6.5h11v11h-11z',
  trash: 'M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13',
  pause: 'M9 5v14M15 5v14',
  warn: 'M12 4l9 16H3l9-16zM12 10v4M12 17h.01',
}

export function Icon({ name, size = 20, fill, className = '' }: { name: string; size?: number; fill?: boolean; className?: string }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill={fill ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"
      className={className}
    >
      <path d={PATHS[name] ?? PATHS.info} />
    </svg>
  )
}

// ── Chrome ───────────────────────────────────────────────────────────────────

export function StatusBar({ light }: { light?: boolean }) {
  const c = light ? 'white' : '#0F172A'
  return (
    <div className="absolute top-0 left-0 right-0 z-40 h-11 flex items-end justify-between px-6 pb-1 pointer-events-none">
      <span className="text-[13px] font-semibold" style={{ color: c }}>9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="17" height="11" viewBox="0 0 17 11" fill={c}>
          <rect x="0" y="7" width="3" height="4" rx="0.7" /><rect x="4.5" y="5" width="3" height="6" rx="0.7" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.7" /><rect x="13.5" y="0" width="3" height="11" rx="0.7" />
        </svg>
        <svg width="15" height="11" viewBox="0 0 16 12" fill={c} opacity="0.9">
          <path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0-3c1.83 0 3.48.76 4.67 1.97l1.42-1.42A8.47 8.47 0 008 4.5c-2.37 0-4.52.98-6.09 2.55l1.42 1.42A6.5 6.5 0 018 6.5zm0-3c2.76 0 5.24 1.1 7.02 2.91l1.42-1.42A10.45 10.45 0 008 1.5c-2.92 0-5.55 1.2-7.44 3.14l1.42 1.37A8.48 8.48 0 018 3.5z" />
        </svg>
        <svg width="24" height="11" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke={c} strokeOpacity="0.5" />
          <rect x="2" y="2" width="17" height="8" rx="2" fill={c} />
          <path d="M23 4V8c.83-.5 1.5-1.2 1.5-2S23.83 4.5 23 4z" fill={c} fillOpacity="0.5" />
        </svg>
      </div>
    </div>
  )
}

export function Header({
  title, onBack, right, light, subtitle,
}: {
  title: string
  onBack?: () => void
  right?: ReactNode
  light?: boolean
  subtitle?: string
}) {
  return (
    <div
      className={`sticky top-0 z-20 flex items-center gap-1 px-2 h-14 border-b ${
        light ? 'border-white/10 text-white' : 'bg-white border-ink-100 text-ink-900'
      }`}
    >
      {onBack ? (
        <button
          onClick={onBack}
          aria-label="Go back"
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            light ? 'hover:bg-white/15' : 'hover:bg-ink-100'
          }`}
        >
          <Icon name="back" size={20} />
        </button>
      ) : (
        <div className="w-3" />
      )}
      <div className="flex-1 min-w-0 text-center">
        <p className="text-[16px] font-semibold truncate">{title}</p>
        {subtitle && <p className="text-[11px] text-ink-500 truncate">{subtitle}</p>}
      </div>
      <div className="min-w-[40px] flex items-center justify-end pr-1">{right}</div>
    </div>
  )
}

// ── Primitives ───────────────────────────────────────────────────────────────

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'dark' | 'danger'

const BTN: Record<BtnVariant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm shadow-brand-600/25',
  secondary: 'bg-white text-brand-700 border border-brand-200 hover:bg-brand-50',
  ghost: 'bg-ink-100 text-ink-700 hover:bg-ink-200',
  dark: 'bg-ink-900 text-white hover:bg-ink-800',
  danger: 'bg-danger-600 text-white hover:bg-danger-700',
}

export function Btn({
  children, onClick, variant = 'primary', full = true, size = 'md', icon, disabled, className = '',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: BtnVariant
  full?: boolean
  size?: 'sm' | 'md'
  icon?: string
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${BTN[variant]} ${full ? 'w-full' : ''} ${
        size === 'sm' ? 'min-h-9 py-1.5 px-3.5 text-[13px] rounded-lg' : 'min-h-12 py-2 px-5 text-[15px] rounded-xl'
      } font-semibold leading-tight text-center inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-40 disabled:pointer-events-none ${className}`}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 15 : 17} />}
      {children}
    </button>
  )
}

export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const cls = `bg-white border border-ink-200 rounded-2xl ${className}`
  return onClick ? (
    <button onClick={onClick} className={`${cls} w-full text-left hover:border-brand-300 hover:shadow-sm transition-all`}>
      {children}
    </button>
  ) : (
    <div className={cls}>{children}</div>
  )
}

export function Label({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-[12px] font-semibold text-ink-500 uppercase tracking-wide ${className}`}>{children}</p>
}

export function Avatar({ name, hue = 212, size = 44, badge }: { name: string; hue?: number; size?: number; badge?: boolean }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('')
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div
        className="w-full h-full rounded-full flex items-center justify-center font-semibold text-white"
        style={{
          background: `linear-gradient(140deg, hsl(${hue} 62% 52%), hsl(${hue + 24} 55% 38%))`,
          fontSize: size * 0.36,
        }}
      >
        {initials}
      </div>
      {badge && (
        <div
          className="absolute -bottom-0.5 -right-0.5 rounded-full bg-brand-600 border-2 border-white flex items-center justify-center text-white"
          style={{ width: size * 0.38, height: size * 0.38 }}
        >
          <Icon name="check" size={size * 0.2} />
        </div>
      )}
    </div>
  )
}

export function Stars({ value, size = 14, onChange }: { value: number; size?: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => {
        const on = i <= Math.round(value)
        const star = (
          <span className={on ? 'text-gold-500' : 'text-ink-300'}>
            <Icon name="star" size={size} fill={on} />
          </span>
        )
        return onChange ? (
          <button key={i} onClick={() => onChange(i)} aria-label={`${i} star`} className="p-0.5 transition-transform hover:scale-110">
            {star}
          </button>
        ) : (
          <span key={i}>{star}</span>
        )
      })}
    </div>
  )
}

export function TrustPill({ score, size = 'sm' }: { score: number; size?: 'sm' | 'lg' }) {
  return size === 'lg' ? (
    <div className="text-right">
      <p className="text-[11px] text-ink-500 font-medium">Trust Score</p>
      <p className="text-[28px] font-bold text-brand-700 leading-none">
        {score}
        <span className="text-[13px] text-ink-400 font-medium">/100</span>
      </p>
    </div>
  ) : (
    <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 rounded-md px-1.5 py-0.5 text-[11px] font-semibold">
      <Icon name="shield" size={11} /> {score}
    </span>
  )
}

export function Chip({ children, active, onClick, icon }: { children: ReactNode; active?: boolean; onClick?: () => void; icon?: string }) {
  return (
    <button
      onClick={onClick}
      className={`h-8 px-3 rounded-full text-[12px] font-semibold inline-flex items-center gap-1.5 border transition-colors flex-shrink-0 ${
        active ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-ink-700 border-ink-200 hover:border-brand-300'
      }`}
    >
      {icon && <Icon name={icon} size={13} />}
      {children}
    </button>
  )
}

export function Tone({ tone, children }: { tone: 'success' | 'warning' | 'brand' | 'muted'; children: ReactNode }) {
  const map = {
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    brand: 'bg-brand-100 text-brand-700',
    muted: 'bg-ink-100 text-ink-500',
  }
  return <span className={`${map[tone]} text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap`}>{children}</span>
}

export function Row({
  icon, label, value, onClick, danger,
}: { icon?: string; label: string; value?: string; onClick?: () => void; danger?: boolean }) {
  const inner = (
    <>
      {icon && (
        <span className={danger ? 'text-danger-600' : 'text-ink-400'}>
          <Icon name={icon} size={18} />
        </span>
      )}
      <span className={`flex-1 text-[14px] ${danger ? 'text-danger-600 font-medium' : 'text-ink-800'}`}>{label}</span>
      {value && <span className="text-[13px] text-ink-500">{value}</span>}
      {onClick && <span className="text-ink-300"><Icon name="next" size={16} /></span>}
    </>
  )
  return onClick ? (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-ink-50 text-left transition-colors">
      {inner}
    </button>
  ) : (
    <div className="w-full flex items-center gap-3 px-4 py-3.5">{inner}</div>
  )
}

/** Stand-in for real photography — the prototype has no image assets. */
export function Photo({ h = 96, label, hue = 205, className = '' }: { h?: number; label?: string; hue?: number; className?: string }) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden flex items-center justify-center text-white/70 ${className}`}
      style={{ height: h, background: `linear-gradient(150deg, hsl(${hue} 25% 62%), hsl(${hue} 18% 38%))` }}
    >
      <Icon name="image" size={22} />
      {label && (
        <span className="absolute bottom-1.5 left-2 text-[10px] font-semibold text-white/90 drop-shadow">{label}</span>
      )}
    </div>
  )
}

// ── Problem status timeline ──────────────────────────────────────────────────

export function Timeline({ stages, onOpen }: { stages: StageState[]; onOpen: (screen: ScreenId) => void }) {
  return (
    <div className="relative">
      <div className="absolute left-[11px] top-5 bottom-5 w-0.5 bg-ink-200" />
      {stages.map(s => {
        const clickable = s.status !== 'pending' && s.screen !== null
        const body = (
          <>
            <div
              className={`relative z-10 w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                s.status === 'done'
                  ? 'bg-success-600 text-white'
                  : s.status === 'current'
                  ? 'bg-brand-600 text-white dot-glow'
                  : 'bg-white border-2 border-ink-300'
              }`}
            >
              {s.status === 'done' ? (
                <Icon name="check" size={12} />
              ) : s.status === 'current' ? (
                <div className="w-2 h-2 rounded-full bg-white" />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-[14px] leading-snug ${
                  s.status === 'current' ? 'font-semibold text-brand-700' : s.status === 'done' ? 'font-medium text-ink-900' : 'text-ink-400'
                }`}
              >
                {s.label}
              </p>
              <p className={`text-[11.5px] mt-0.5 ${s.status === 'pending' ? 'text-ink-300' : 'text-ink-500'}`}>{s.detail}</p>
            </div>
            {clickable && <span className="text-ink-300 mt-1"><Icon name="next" size={15} /></span>}
          </>
        )
        const cls = `w-full flex items-start gap-3.5 py-2.5 px-2 -mx-2 rounded-xl text-left ${
          s.status === 'current' ? 'bg-brand-50' : ''
        }`
        return clickable ? (
          <button key={s.key} className={`${cls} hover:bg-ink-50`} onClick={() => onOpen(s.screen!)}>
            {body}
          </button>
        ) : (
          <div key={s.key} className={cls}>{body}</div>
        )
      })}
    </div>
  )
}

// ── Bottom navigation ────────────────────────────────────────────────────────

export const TABS: { id: string; label: string; to: ScreenId; icon: string }[] = [
  { id: 'home', label: 'Home', to: 'home', icon: 'home' },
  { id: 'find-pros', label: 'Find Pros', to: 'find-pros', icon: 'search' },
  { id: 'cases', label: 'Cases', to: 'cases', icon: 'cases' },
  { id: 'messages', label: 'Messages', to: 'messages', icon: 'chat' },
  { id: 'profile', label: 'Profile', to: 'profile', icon: 'user' },
]

export function BottomNav({ active, navigate }: { active: string; navigate: (to: ScreenId) => void }) {
  return (
    <div className="h-20 bg-white border-t border-ink-200 flex items-start pt-2 px-1">
      {TABS.map(t => {
        const on = active === t.id
        return (
          <button
            key={t.id}
            onClick={() => navigate(t.to)}
            className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl transition-colors ${
              on ? 'text-brand-600' : 'text-ink-400 hover:text-ink-700'
            }`}
          >
            <Icon name={t.icon} size={21} fill={on && t.icon === 'home'} />
            <span className="text-[10px] font-semibold">{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ── Overlays ─────────────────────────────────────────────────────────────────
// Sheets and viewers must cover the whole device screen, so they are portalled
// into a layer the Frame owns rather than positioned against whichever card
// happens to contain the button that opened them.

const OverlayHost = createContext<HTMLElement | null>(null)

export function Overlay({ children }: { children: ReactNode }) {
  const host = useContext(OverlayHost)
  return host ? createPortal(children, host) : <>{children}</>
}

// ── Attachments ──────────────────────────────────────────────────────────────
// One renderer for both apps, so a photo the customer attaches is the very
// same object the professional opens. Real captures carry a blob URL and play
// for real; seeded demo media falls back to the gradient placeholder.

function Placeholder({ h, hue = 205, icon }: { h: number; hue?: number; icon: string }) {
  return (
    <div
      className="w-full flex items-center justify-center text-white/75"
      style={{ height: h, background: `linear-gradient(150deg, hsl(${hue} 25% 62%), hsl(${hue} 18% 38%))` }}
    >
      <Icon name={icon} size={22} />
    </div>
  )
}

export function AttachmentTile({
  a, h = 74, onRemove, onOpen,
}: { a: Attachment; h?: number; onRemove?: () => void; onOpen?: () => void }) {
  const media = a.url
    ? a.kind === 'video'
      ? <video src={a.url} muted playsInline preload="metadata" className="w-full object-cover" style={{ height: h }} />
      : <img src={a.url} alt={a.name} className="w-full object-cover" style={{ height: h }} />
    : <Placeholder h={h} hue={a.hue} icon={a.kind === 'video' ? 'video' : 'image'} />

  return (
    <div className="relative rounded-xl overflow-hidden bg-ink-100" style={{ height: h }}>
      <button type="button" onClick={onOpen} className="block w-full h-full text-left" aria-label={`Open ${a.name}`}>
        {media}
        {a.kind === 'video' && (
          <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow">
            <Icon name="play" size={22} fill />
          </span>
        )}
        <span className="absolute bottom-1 left-1.5 right-1.5 text-[9.5px] font-semibold text-white/95 truncate drop-shadow">
          {a.name}
        </span>
      </button>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${a.name}`}
          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/55 text-white flex items-center justify-center hover:bg-danger-600"
        >
          <Icon name="x" size={12} />
        </button>
      )}
    </div>
  )
}

/** Full-size viewer, kept inside the device frame. */
export function MediaViewer({ a, onClose }: { a: Attachment; onClose: () => void }) {
  return (
    <Overlay>
    <div className="absolute inset-0 z-40 bg-black/85 flex flex-col fade-in" role="dialog" aria-label={a.name}>
      <div className="flex items-center gap-2 px-3 h-14 text-white flex-shrink-0">
        <button onClick={onClose} aria-label="Close" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/15">
          <Icon name="x" size={20} />
        </button>
        <p className="text-[14px] font-semibold truncate">{a.name}</p>
      </div>
      <div className="flex-1 min-h-0 flex items-center justify-center px-4 pb-8">
        {!a.url ? (
          <div className="text-center text-white/70 px-8">
            <Icon name={a.kind === 'video' ? 'video' : 'image'} size={40} />
            <p className="text-[13px] mt-3 leading-relaxed">
              Demo attachment — this prototype ships no image files, so the capture is represented rather than stored.
            </p>
          </div>
        ) : a.kind === 'video' ? (
          <video src={a.url} controls autoPlay playsInline className="max-w-full max-h-full rounded-xl" />
        ) : (
          <img src={a.url} alt={a.name} className="max-w-full max-h-full rounded-xl object-contain" />
        )}
      </div>
    </div>
    </Overlay>
  )
}

/** Voice note row: plays the real recording when there is one. */
export function VoiceNote({ a, onRemove }: { a: Attachment; onRemove?: () => void }) {
  const ref = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    const el = ref.current
    if (!el) { setPlaying(p => !p); return }
    if (el.paused) { el.play().catch(() => setPlaying(false)); setPlaying(true) }
    else { el.pause(); setPlaying(false) }
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-3 py-2.5">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? 'Pause voice note' : 'Play voice note'}
        className="w-9 h-9 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center flex-shrink-0 hover:bg-brand-100"
      >
        <Icon name={playing ? 'pause' : 'play'} size={15} fill={!playing} />
      </button>
      <div className="flex-1 min-w-0 flex items-end gap-[3px] h-6">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className={`flex-1 rounded-full ${playing ? 'wave-bar bg-brand-500' : 'bg-brand-300'}`}
            style={{ height: `${25 + ((i * 37) % 70)}%`, animationDelay: `${(i % 6) * 0.1}s` }}
          />
        ))}
      </div>
      <span className="text-[11px] text-ink-500 font-medium tabular-nums flex-shrink-0">{a.duration ?? '0:10'}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove voice note"
          className="w-7 h-7 rounded-full text-ink-400 hover:text-danger-600 hover:bg-danger-100 flex items-center justify-center flex-shrink-0"
        >
          <Icon name="trash" size={14} />
        </button>
      )}
      {a.url && <audio ref={ref} src={a.url} onEnded={() => setPlaying(false)} className="hidden" />}
    </div>
  )
}

/** Photos and videos in a grid with a tap-to-open viewer; voice notes below. */
export function AttachmentGrid({
  items, onRemove, cols = 3, h = 74, empty, extra,
}: {
  items: Attachment[]
  onRemove?: (id: string) => void
  cols?: number
  h?: number
  empty?: ReactNode
  /** Rendered as the last cell of the grid (e.g. an "add" tile). */
  extra?: ReactNode
}) {
  const [open, setOpen] = useState<Attachment | null>(null)
  const visual = items.filter(a => a.kind !== 'voice')
  const voice = items.filter(a => a.kind === 'voice')

  if (items.length === 0 && !extra) return <>{empty}</>

  return (
    <>
      {(visual.length > 0 || extra) && (
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {visual.map(a => (
            <AttachmentTile
              key={a.id}
              a={a}
              h={h}
              onOpen={() => setOpen(a)}
              onRemove={onRemove ? () => onRemove(a.id) : undefined}
            />
          ))}
          {extra}
        </div>
      )}
      {voice.length > 0 && (
        <div className={visual.length > 0 || extra ? 'mt-2 space-y-2' : 'space-y-2'}>
          {voice.map(a => (
            <VoiceNote key={a.id} a={a} onRemove={onRemove ? () => onRemove(a.id) : undefined} />
          ))}
        </div>
      )}
      {open && <MediaViewer a={open} onClose={() => setOpen(null)} />}
    </>
  )
}

// ── Toast ────────────────────────────────────────────────────────────────────

export function Toaster() {
  const msg = useToast()
  if (!msg) return null
  return (
    <div className="absolute left-0 right-0 bottom-24 z-[60] flex justify-center px-6 pointer-events-none">
      <div className="fade-up bg-ink-900/95 text-white text-[13px] font-medium rounded-full px-4 py-2.5 shadow-lg max-w-full text-center">
        {msg}
      </div>
    </div>
  )
}

// ── Device frame ─────────────────────────────────────────────────────────────
// Shared by both apps so the customer and professional shells stay identical
// hardware and only their contents differ.

export function Frame({
  light, topBg = '#fff', bg = '#fff', nav, screenKey, children,
}: {
  /** Light status-bar glyphs, for dark chrome behind them. */
  light?: boolean
  topBg?: string
  bg?: string
  nav?: ReactNode
  screenKey: number
  children: ReactNode
}) {
  const [host, setHost] = useState<HTMLDivElement | null>(null)

  return (
    <div
      className="relative bg-white overflow-hidden flex-shrink-0"
      style={{
        width: 390,
        height: 844,
        borderRadius: 44,
        boxShadow: '0 40px 90px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.10)',
      }}
    >
      {/* Overlay layer: sheets and media viewers portal in here so they always
          cover the screen, whatever card opened them. */}
      <div className="absolute top-0 left-0 right-0 h-11 z-30" style={{ background: topBg }} />
      <div
        className="absolute z-50 bg-black"
        style={{ top: 12, left: '50%', transform: 'translateX(-50%)', width: 120, height: 34, borderRadius: 20 }}
      />
      <StatusBar light={light} />

      <div
        key={screenKey}
        className="absolute left-0 right-0 screen-slide"
        style={{ top: 44, bottom: nav ? 80 : 0, background: bg }}
      >
        <div className="h-full overflow-y-auto no-scroll">
          <OverlayHost.Provider value={host}>{children}</OverlayHost.Provider>
        </div>
      </div>

      {nav && <div className="absolute bottom-0 left-0 right-0 z-30">{nav}</div>}
      <Toaster />
      <div
        ref={setHost}
        className="absolute left-0 right-0 bottom-0 z-40 pointer-events-none [&>*]:pointer-events-auto"
        style={{ top: 44 }}
      />
    </div>
  )
}
