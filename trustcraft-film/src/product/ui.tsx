import type { CSSProperties, ReactNode } from 'react'
import { C, FONT, SHADOW } from '../theme'
import { Icon } from './icons'

/**
 * Film-side rebuilds of the product's UI primitives. Same geometry, radii,
 * weights and colours as `src/components/UI.tsx`, but written with inline
 * styles so Remotion renders them deterministically at 1920x1080 without
 * a Tailwind pipeline.
 */

export function Avatar({ name, hue = 212, size = 44, badge }: {
  name: string; hue?: number; size?: number; badge?: boolean
}) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('')
  return (
    <div style={{ position: 'relative', flexShrink: 0, width: size, height: size }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 600, color: C.white, fontFamily: FONT,
        background: `linear-gradient(140deg, hsl(${hue} 62% 52%), hsl(${hue + 24} 55% 38%))`,
        fontSize: size * 0.36, letterSpacing: '-0.01em',
      }}>{initials}</div>
      {badge && (
        <div style={{
          position: 'absolute', bottom: -size * 0.02, right: -size * 0.02,
          width: size * 0.38, height: size * 0.38, borderRadius: 999,
          background: C.brand600, border: `${Math.max(2, size * 0.045)}px solid ${C.white}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white,
        }}>
          <Icon name="check" size={size * 0.2} strokeWidth={3} />
        </div>
      )}
    </div>
  )
}

export function TrustPill({ score, size = 'sm' }: { score: number; size?: 'sm' | 'lg' }) {
  if (size === 'lg') {
    return (
      <div style={{ textAlign: 'right', fontFamily: FONT }}>
        <p style={{ margin: 0, fontSize: 15, color: C.ink500, fontWeight: 500 }}>Trust Score</p>
        <p style={{ margin: 0, fontSize: 40, fontWeight: 700, color: C.brand700, lineHeight: 1, letterSpacing: '-0.03em' }}>
          {score}<span style={{ fontSize: 18, color: C.ink400, fontWeight: 500 }}>/100</span>
        </p>
      </div>
    )
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: C.brand50, color: C.brand700, borderRadius: 6,
      padding: '2px 7px', fontSize: 15, fontWeight: 600, fontFamily: FONT,
    }}>
      <Icon name="shield" size={14} /> {score}
    </span>
  )
}

export function Tone({ tone, children, style }: {
  tone: 'success' | 'warning' | 'brand' | 'muted'; children: ReactNode; style?: CSSProperties
}) {
  const map = {
    success: { background: C.success100, color: C.success700 },
    warning: { background: '#FEF3C7', color: '#B45309' },
    brand: { background: C.brand100, color: C.brand700 },
    muted: { background: C.ink100, color: C.ink500 },
  } as const
  return (
    <span style={{
      ...map[tone], fontSize: 15, fontWeight: 600, padding: '3px 10px',
      borderRadius: 999, whiteSpace: 'nowrap', fontFamily: FONT, ...style,
    }}>{children}</span>
  )
}

export function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2, color: C.gold }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Icon key={i} name="star" size={size} fill={i <= Math.round(value)} strokeWidth={1.4} />
      ))}
    </span>
  )
}

export function Card({ children, style, elevated }: {
  children: ReactNode; style?: CSSProperties; elevated?: boolean
}) {
  return (
    <div style={{
      background: C.white,
      border: `1px solid ${C.ink200}`,
      borderRadius: 18,
      boxShadow: elevated ? SHADOW.lift : SHADOW.card,
      fontFamily: FONT,
      ...style,
    }}>{children}</div>
  )
}

/** The product's primary button. `press` 0→1 drives the tactile push. */
export function Btn({ children, variant = 'primary', icon, width, press = 0, style }: {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  icon?: string
  width?: number | string
  press?: number
  style?: CSSProperties
}) {
  const primary = variant === 'primary'
  return (
    <div style={{
      height: 54, width, borderRadius: 14,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
      fontFamily: FONT, fontSize: 18, fontWeight: 600,
      background: primary ? C.brand600 : C.white,
      color: primary ? C.white : C.ink700,
      border: primary ? 'none' : `1px solid ${C.ink200}`,
      boxShadow: primary
        ? `0 ${10 - press * 7}px ${26 - press * 14}px -6px rgba(37,99,235,${0.5 - press * 0.2})`
        : 'none',
      transform: `scale(${1 - press * 0.028})`,
      filter: primary && press > 0 ? `brightness(${1 - press * 0.08})` : undefined,
      ...style,
    }}>
      {icon && <Icon name={icon} size={19} />}
      {children}
    </div>
  )
}

/** Match strength bar from the Recommendations screen. */
export function MatchBar({ pct, width }: { pct: number; width?: number | string }) {
  return (
    <div style={{ height: 7, borderRadius: 999, background: C.ink100, overflow: 'hidden', width }}>
      <div style={{ height: '100%', borderRadius: 999, background: C.brand500, width: `${pct}%` }} />
    </div>
  )
}

/** The TrustCraft app bar: shield mark + wordmark, exactly as HomeScreen draws it. */
export function AppBar({ scale = 1, style }: { scale?: number; style?: CSSProperties }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 9 * scale, fontFamily: FONT, ...style,
    }}>
      <span style={{ color: C.brand600, display: 'flex' }}>
        <Icon name="shield" size={30 * scale} strokeWidth={1.9} />
      </span>
      <span style={{
        fontSize: 26 * scale, fontWeight: 700, color: C.brand700, letterSpacing: '-0.028em',
      }}>TrustCraft</span>
    </div>
  )
}
