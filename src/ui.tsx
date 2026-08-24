import {
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'
import { navigate } from './app-state'

// ════════════════════════════════════════════════════════════════════════════
// Icons — one stroke weight, one corner language, no icon library.
// ════════════════════════════════════════════════════════════════════════════

type IconProps = { size?: number; className?: string }

const svg = (size: number, className: string | undefined, children: ReactNode) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
)

export const Icon = {
  check: ({ size = 16, className }: IconProps) => svg(size, className, <path d="M4 10.5L8 14.5L16 5.5" />),
  cross: ({ size = 16, className }: IconProps) => svg(size, className, <path d="M5.5 5.5L14.5 14.5M14.5 5.5L5.5 14.5" />),
  dash: ({ size = 16, className }: IconProps) => svg(size, className, <path d="M5 10H15" />),
  question: ({ size = 16, className }: IconProps) =>
    svg(size, className, (
      <>
        <path d="M7.5 7.5a2.5 2.5 0 114 2c-.9.7-1.5 1.2-1.5 2.3" />
        <circle cx="10" cy="15" r="0.6" fill="currentColor" />
      </>
    )),
  arrow: ({ size = 16, className }: IconProps) => svg(size, className, <path d="M3.5 10h13M12 5.5l4.5 4.5L12 14.5" />),
  arrowLeft: ({ size = 16, className }: IconProps) => svg(size, className, <path d="M16.5 10h-13M8 5.5L3.5 10 8 14.5" />),
  chevron: ({ size = 16, className }: IconProps) => svg(size, className, <path d="M5.5 8L10 12.5L14.5 8" />),
  chevronRight: ({ size = 16, className }: IconProps) => svg(size, className, <path d="M8 5.5L12.5 10L8 14.5" />),
  camera: ({ size = 16, className }: IconProps) =>
    svg(size, className, (
      <>
        <path d="M2.5 7h2.2l1.6-2.5h7.4L15.3 7h2.2a1 1 0 011 1v7.5a1 1 0 01-1 1H2.5a1 1 0 01-1-1V8a1 1 0 011-1z" />
        <circle cx="10" cy="11.5" r="3" />
      </>
    )),
  mic: ({ size = 16, className }: IconProps) =>
    svg(size, className, (
      <>
        <rect x="7.2" y="1.8" width="5.6" height="9.4" rx="2.8" />
        <path d="M4 9.8a6 6 0 0012 0" />
        <path d="M10 15.8v2.4M7.4 18.2h5.2" />
      </>
    )),
  text: ({ size = 16, className }: IconProps) => svg(size, className, <path d="M3.5 5.5h13M3.5 10h9M3.5 14.5h6" />),
  shield: ({ size = 16, className }: IconProps) =>
    svg(size, className, (
      <>
        <path d="M10 2l6.5 2.6v4.8c0 4-2.8 7.4-6.5 8.6-3.7-1.2-6.5-4.6-6.5-8.6V4.6L10 2z" />
        <path d="M7.2 9.8l2 2 3.6-4" />
      </>
    )),
  info: ({ size = 16, className }: IconProps) =>
    svg(size, className, (
      <>
        <circle cx="10" cy="10" r="7.6" />
        <path d="M10 9v4.4" />
        <circle cx="10" cy="6.4" r="0.6" fill="currentColor" />
      </>
    )),
  alert: ({ size = 16, className }: IconProps) =>
    svg(size, className, (
      <>
        <circle cx="10" cy="10" r="7.6" />
        <path d="M10 6v4.6" />
        <circle cx="10" cy="13.6" r="0.6" fill="currentColor" />
      </>
    )),
  clock: ({ size = 16, className }: IconProps) =>
    svg(size, className, (
      <>
        <circle cx="10" cy="10" r="7.6" />
        <path d="M10 5.8V10l2.8 1.8" />
      </>
    )),
  pin: ({ size = 16, className }: IconProps) =>
    svg(size, className, (
      <>
        <path d="M10 17.5s5.5-4.6 5.5-8.6a5.5 5.5 0 10-11 0c0 4 5.5 8.6 5.5 8.6z" />
        <circle cx="10" cy="8.8" r="2" />
      </>
    )),
  play: ({ size = 16, className }: IconProps) => svg(size, className, <path d="M6.5 4.5l9 5.5-9 5.5V4.5z" />),
  pause: ({ size = 16, className }: IconProps) => svg(size, className, <path d="M7.5 4.5v11M12.5 4.5v11" />),
  plus: ({ size = 16, className }: IconProps) => svg(size, className, <path d="M10 4.5v11M4.5 10h11" />),
  close: ({ size = 16, className }: IconProps) => svg(size, className, <path d="M5 5l10 10M15 5L5 15" />),
  search: ({ size = 16, className }: IconProps) =>
    svg(size, className, (
      <>
        <circle cx="8.8" cy="8.8" r="5.4" />
        <path d="M12.8 12.8l4 4" />
      </>
    )),
  home: ({ size = 16, className }: IconProps) => svg(size, className, <path d="M3 8.6L10 3l7 5.6V17H3V8.6z" />),
  folder: ({ size = 16, className }: IconProps) =>
    svg(size, className, <path d="M2.5 5.5h5l1.6 2h8.4v9h-15v-11z" />),
  book: ({ size = 16, className }: IconProps) =>
    svg(size, className, (
      <>
        <path d="M3.5 3.5h5a2.5 2.5 0 012.5 2.5v10a2 2 0 00-2-2h-5.5v-10.5z" />
        <path d="M16.5 3.5h-5A2.5 2.5 0 009 6v10a2 2 0 012-2h5.5v-10.5z" />
      </>
    )),
  message: ({ size = 16, className }: IconProps) =>
    svg(size, className, <path d="M3 4.5h14v9.5H8l-5 3.5V4.5z" />),
  people: ({ size = 16, className }: IconProps) =>
    svg(size, className, (
      <>
        <circle cx="8" cy="7" r="3.2" />
        <path d="M2.5 17c0-2.9 2.5-5 5.5-5s5.5 2.1 5.5 5" />
        <path d="M14 5.2a3 3 0 010 5.6M15.4 12.6c1.5.8 2.4 2.3 2.4 4.4" />
      </>
    )),
  file: ({ size = 16, className }: IconProps) =>
    svg(size, className, (
      <>
        <path d="M5 2.5h6l4 4V17.5H5V2.5z" />
        <path d="M11 2.5v4h4" />
      </>
    )),
  wrench: ({ size = 16, className }: IconProps) =>
    svg(size, className, (
      <path d="M13.4 2.8a4.6 4.6 0 00-5.6 5.9l-5.1 5.1a1.6 1.6 0 002.3 2.3l5.1-5.1a4.6 4.6 0 005.9-5.6l-2.6 2.6-2.2-.5-.5-2.2 2.7-2.5z" />
    )),
  drop: ({ size = 16, className }: IconProps) =>
    svg(size, className, <path d="M10 2.5s5 5.6 5 9a5 5 0 01-10 0c0-3.4 5-9 5-9z" />),
  bell: ({ size = 16, className }: IconProps) =>
    svg(size, className, (
      <>
        <path d="M10 2.5A4.6 4.6 0 005.4 7v3.6L3.6 13h12.8l-1.8-2.4V7A4.6 4.6 0 0010 2.5z" />
        <path d="M8 15.4a2 2 0 004 0" />
      </>
    )),
  external: ({ size = 16, className }: IconProps) =>
    svg(size, className, <path d="M8 4.5H4.5v11h11V12M12 3.5h4.5V8M16.5 3.5L9.5 10.5" />),
  grid: ({ size = 16, className }: IconProps) =>
    svg(size, className, (
      <>
        <rect x="3" y="3" width="6" height="6" rx="1" />
        <rect x="11" y="3" width="6" height="6" rx="1" />
        <rect x="3" y="11" width="6" height="6" rx="1" />
        <rect x="11" y="11" width="6" height="6" rx="1" />
      </>
    )),
}

// ════════════════════════════════════════════════════════════════════════════
// Typography and structure
// ════════════════════════════════════════════════════════════════════════════

/** Small tracked mono label. The workhorse of TrustCraft's hierarchy. */
export function Eyebrow({
  children,
  tone = 'muted',
  className = '',
}: {
  children: ReactNode
  tone?: 'muted' | 'teal' | 'gold' | 'light' | 'danger'
  className?: string
}) {
  const tones = {
    muted: 'text-ink-400',
    teal: 'text-teal-800',
    gold: 'text-gold-600',
    danger: 'text-danger-700',
    light: 'text-white/45',
  }
  return (
    <p className={`font-data text-[10.5px] tracking-[0.16em] uppercase ${tones[tone]} ${className}`}>
      {children}
    </p>
  )
}

/** A hairline. Structure comes from rules and spacing, not from boxes. */
export function Rule({ className = '', tone = 'default' }: { className?: string; tone?: 'default' | 'strong' | 'light' }) {
  const c =
    tone === 'strong'
      ? 'bg-[var(--color-rule-strong)]'
      : tone === 'light'
        ? 'bg-white/12'
        : 'bg-[var(--color-rule)]'
  return <div role="presentation" className={`h-px w-full ${c} ${className}`} />
}

export function Display({
  children,
  size = 'lg',
  className = '',
  as: As = 'h1',
}: {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
}) {
  // The scale itself lives in index.css as fluid clamps: one continuous
  // ramp from a 360px phone to a 1440px display, with no snap in between.
  return <As className={`display-${size} ${className}`}>{children}</As>
}

// ════════════════════════════════════════════════════════════════════════════
// Buttons
// ════════════════════════════════════════════════════════════════════════════

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'quiet' | 'danger' | 'onDark'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  icon?: ReactNode
  iconEnd?: ReactNode
  full?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  to,
  icon,
  iconEnd,
  full,
  className = '',
  children,
  onClick,
  ...rest
}: ButtonProps) {
  const variants: Record<string, string> = {
    primary:
      'bg-teal-800 text-white hover:bg-teal-900 active:bg-teal-950 disabled:bg-ink-200 disabled:text-ink-400',
    secondary:
      'bg-transparent text-ink-800 border border-[var(--color-rule-strong)] hover:border-ink-700 hover:bg-white active:bg-ink-100 disabled:text-ink-300 disabled:border-[var(--color-rule)]',
    ghost: 'bg-transparent text-ink-600 hover:text-ink-900 hover:bg-black/[0.045] active:bg-black/[0.07]',
    quiet: 'bg-white text-ink-800 border border-[var(--color-rule)] hover:border-ink-300 hover:shadow-sm',
    danger: 'bg-transparent text-danger-700 border border-danger-700/35 hover:bg-danger-100 active:bg-danger-100',
    onDark: 'bg-white/[0.09] text-white border border-white/15 hover:bg-white/[0.16] active:bg-white/20',
  }
  const sizes = {
    sm: 'h-9 px-3.5 text-[13px] gap-1.5 rounded-lg',
    md: 'h-11 px-5 text-[14px] gap-2 rounded-[10px]',
    lg: 'h-[52px] px-7 text-[15px] gap-2.5 rounded-xl',
  }
  return (
    <button
      type="button"
      onClick={e => {
        onClick?.(e)
        if (to && !e.defaultPrevented) navigate(to)
      }}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150
        disabled:cursor-not-allowed disabled:hover:shadow-none
        ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {icon}
      {children}
      {iconEnd}
    </button>
  )
}

/** Inline text action. Underline on hover, never a floating pill. */
export function TextLink({
  children,
  to,
  onClick,
  className = '',
  tone = 'teal',
}: {
  children: ReactNode
  to?: string
  onClick?: () => void
  className?: string
  tone?: 'teal' | 'muted' | 'light'
}) {
  const tones = {
    teal: 'text-teal-800 decoration-teal-800/30 hover:decoration-teal-800',
    muted: 'text-ink-500 decoration-ink-300 hover:text-ink-900 hover:decoration-ink-700',
    light: 'text-white/70 decoration-white/25 hover:text-white hover:decoration-white/70',
  }
  return (
    <button
      type="button"
      onClick={() => {
        onClick?.()
        if (to) navigate(to)
      }}
      className={`inline-flex items-center gap-1.5 text-[13.5px] font-medium underline underline-offset-[5px]
        transition-colors duration-150 ${tones[tone]} ${className}`}
    >
      {children}
    </button>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Surfaces — used sparingly. Most structure is rules + spacing.
// ════════════════════════════════════════════════════════════════════════════

/** A recessed pane. Tone shift, not a border-and-shadow card. */
export function Panel({
  children,
  className = '',
  tone = 'sunken',
}: {
  children: ReactNode
  className?: string
  tone?: 'sunken' | 'raised' | 'ink' | 'teal' | 'warning'
}) {
  const tones = {
    sunken: 'bg-[var(--color-sunken)]',
    raised: 'bg-white border border-[var(--color-rule)]',
    ink: 'bg-ink-950 text-white',
    teal: 'bg-teal-50 border border-teal-100',
    warning: 'bg-warning-100',
  }
  return <div className={`rounded-xl ${tones[tone]} ${className}`}>{children}</div>
}

// ════════════════════════════════════════════════════════════════════════════
// Status — never color alone. Glyph + colour + word, always.
// ════════════════════════════════════════════════════════════════════════════

export type Tone = 'teal' | 'gold' | 'success' | 'warning' | 'danger' | 'neutral'

const TONE_TEXT: Record<Tone, string> = {
  teal: 'text-teal-800',
  gold: 'text-gold-600',
  success: 'text-success-700',
  warning: 'text-warning-700',
  danger: 'text-danger-700',
  neutral: 'text-ink-500',
}

const TONE_BG: Record<Tone, string> = {
  teal: 'bg-teal-50 text-teal-800',
  gold: 'bg-gold-100 text-gold-600',
  success: 'bg-success-100 text-success-800',
  warning: 'bg-warning-100 text-warning-700',
  danger: 'bg-danger-100 text-danger-700',
  neutral: 'bg-ink-100 text-ink-600',
}

export function Pill({
  children,
  tone = 'neutral',
  icon,
  className = '',
}: {
  children: ReactNode
  tone?: Tone
  icon?: ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium
        ${TONE_BG[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  )
}

/** Status dot paired with its label — the dot is decoration, the word carries it. */
export function StatusDot({ tone = 'neutral', pulse }: { tone?: Tone; pulse?: boolean }) {
  const bg: Record<Tone, string> = {
    teal: 'bg-teal-700',
    gold: 'bg-gold-500',
    success: 'bg-success-700',
    warning: 'bg-warning-700',
    danger: 'bg-danger-700',
    neutral: 'bg-ink-400',
  }
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-[7px] w-[7px] shrink-0 rounded-full ${bg[tone]} ${pulse ? 'a-pulse' : ''}`}
    />
  )
}

/**
 * Scope mark for comparison grids.
 * Three states, three distinct glyphs — legible without colour vision.
 */
export function ScopeMark({ state }: { state: 'yes' | 'no' | 'unstated' }) {
  if (state === 'yes') {
    return (
      <span className="inline-flex items-center gap-1.5 text-success-700">
        <Icon.check size={16} />
        <span className="sr-only">Included</span>
      </span>
    )
  }
  if (state === 'no') {
    return (
      <span className="inline-flex items-center gap-1.5 text-ink-400">
        <Icon.dash size={16} />
        <span className="sr-only">Not included</span>
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-warning-700">
      <Icon.question size={15} />
      <span className="text-[11px] font-medium tracking-tight">Not stated</span>
    </span>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Tooltip — hover AND focus, so it exists for keyboard users too.
// ════════════════════════════════════════════════════════════════════════════

export function Tooltip({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  const id = useId()
  const [rect, setRect] = useState<{ x: number; y: number } | null>(null)
  const ref = useRef<HTMLSpanElement>(null)

  // Positioned fixed against the viewport: comparison tables scroll, and an
  // absolutely-positioned tooltip gets clipped by their overflow container.
  const open = () => {
    const r = ref.current?.getBoundingClientRect()
    if (r) setRect({ x: r.left + r.width / 2, y: r.top })
  }
  const close = () => setRect(null)

  return (
    <>
      <span
        ref={ref}
        tabIndex={0}
        aria-describedby={rect ? id : undefined}
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={open}
        onBlur={close}
        onKeyDown={e => e.key === 'Escape' && close()}
        className="inline-flex cursor-help items-center rounded"
      >
        {children}
      </span>
      {rect && (
        <span
          id={id}
          role="tooltip"
          className="a-fade pointer-events-none fixed z-[90] w-60 -translate-x-1/2 -translate-y-full
            rounded-lg bg-ink-950 px-3 py-2 text-[12px] leading-relaxed text-white/90 shadow-xl"
          style={{
            left: Math.min(Math.max(rect.x, 128), window.innerWidth - 128),
            top: rect.y - 8,
          }}
        >
          {label}
        </span>
      )}
    </>
  )
}

/** The little ⓘ that opens a tooltip. Consistent affordance everywhere. */
export function InfoHint({ label }: { label: string }) {
  return (
    <Tooltip label={label}>
      <Icon.info size={13} className="text-ink-300 transition-colors hover:text-ink-600" />
    </Tooltip>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Disclosure — inline detail reveal, native <details> semantics
// ════════════════════════════════════════════════════════════════════════════

export function Disclosure({
  summary,
  children,
  defaultOpen = false,
  className = '',
}: {
  summary: ReactNode
  children: ReactNode
  defaultOpen?: boolean
  className?: string
}) {
  return (
    <details className={`group ${className}`} open={defaultOpen}>
      <summary
        className="flex cursor-pointer list-none items-center justify-between gap-3 py-2.5
          text-[13.5px] font-medium text-ink-700 transition-colors hover:text-ink-950
          [&::-webkit-details-marker]:hidden"
      >
        {summary}
        <Icon.chevron
          size={15}
          className="shrink-0 text-ink-400 transition-transform duration-200 group-open:rotate-180"
        />
      </summary>
      <div className="a-up pb-1">{children}</div>
    </details>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Misc
// ════════════════════════════════════════════════════════════════════════════

/**
 * Monogram avatar. No stock faces: a fabricated photograph of a person who does
 * not exist is the one thing on a trust screen that should not be invented.
 */
export function Avatar({
  name,
  size = 40,
  tint = '#0B6B6B',
  ring,
}: {
  name: string
  size?: number
  tint?: string
  ring?: boolean
}) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 select-none items-center justify-center rounded-full
        font-display leading-none text-white
        ${ring ? 'ring-2 ring-teal-700 ring-offset-2 ring-offset-[var(--color-canvas)]' : ''}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: tint,
        paddingTop: size * 0.04,
      }}
    >
      {initials}
    </span>
  )
}

/** A definition row. Reads as a record, not as a form. */
export function Field({
  label,
  children,
  hint,
  className = '',
}: {
  label: string
  children: ReactNode
  hint?: string
  className?: string
}) {
  return (
    <div className={`flex items-baseline justify-between gap-6 py-3 ${className}`}>
      <dt className="flex shrink-0 items-center gap-1.5 text-[13px] text-ink-500">
        {label}
        {hint && <InfoHint label={hint} />}
      </dt>
      <dd className="text-right text-[13.5px] font-medium text-ink-900">{children}</dd>
    </div>
  )
}

export function Money({ value, className = '' }: { value: number; className?: string }) {
  return <span className={`tnum font-data ${className}`}>Rs.{value.toLocaleString('en-LK')}</span>
}

/** Non-blocking confirmation. Announced politely to assistive tech. */
export function Toast({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div
      role="status"
      aria-live="polite"
      className="a-up fixed bottom-7 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2.5
        rounded-full bg-ink-950 px-5 py-3 text-[13.5px] text-white shadow-2xl"
    >
      <Icon.check size={15} className="text-teal-400" />
      {message}
    </div>
  )
}

/** Empty state. Says what is missing and what to do — never just an icon. */
export function Empty({
  title,
  body,
  action,
}: {
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="py-16 text-center">
      <p className="font-display text-[24px] text-ink-800">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-ink-500">{body}</p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  )
}

/** Page-level heading block with a back affordance. */
export function PageHead({
  eyebrow,
  title,
  lede,
  back,
  aside,
}: {
  eyebrow?: string
  title: ReactNode
  lede?: ReactNode
  back?: { label: string; to: string }
  aside?: ReactNode
}) {
  return (
    <header className="mb-8 sm:mb-10 lg:mb-12">
      {back && (
        <button
          type="button"
          onClick={() => navigate(back.to)}
          className="a-fade tap mb-4 inline-flex items-center gap-2 text-[13px] text-ink-500
            transition-colors hover:text-ink-900 sm:mb-5"
        >
          <Icon.arrowLeft size={15} />
          {back.label}
        </button>
      )}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          {eyebrow && <Eyebrow tone="teal" className="mb-2.5 sm:mb-3">{eyebrow}</Eyebrow>}
          <Display size="md" className="a-up text-ink-950">{title}</Display>
          {lede && (
            <p className="a-up d1 measure mt-3 text-[14.5px] leading-relaxed text-ink-500 sm:text-[15px]">
              {lede}
            </p>
          )}
        </div>
        {aside && <div className="a-up d2 shrink-0">{aside}</div>}
      </div>
    </header>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Product motifs
//
// These are the marks that make a screen recognisably TrustCraft. They come
// from the product model — provenance, tri-state scope, resolved/open — and
// not from decoration. Every one of them appears on more than one surface.
// ════════════════════════════════════════════════════════════════════════════

/**
 * A provenance mark: the tag that ties an assertion back to the thing that
 * evidences it. `E1` is the first photograph, `VOICE` the recording, `YOU` an
 * answer the customer gave. Nothing on a trust screen is asserted without one.
 */
export function EvidenceRef({
  label,
  onSelect,
  tone = 'teal',
}: {
  label: string
  onSelect?: () => void
  tone?: 'teal' | 'muted' | 'light'
}) {
  const tones = {
    teal: 'border-teal-200 bg-teal-50 text-teal-800',
    muted: 'border-[var(--color-rule-strong)] bg-transparent text-ink-500',
    light: 'border-white/20 bg-white/[0.06] text-white/70',
  }
  const cls = `inline-flex h-[19px] shrink-0 items-center rounded-[5px] border px-1.5
    font-data text-[10px] uppercase leading-none tracking-[0.1em] ${tones[tone]}`

  if (!onSelect) {
    return <span className={cls}>{label}</span>
  }
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`${cls} transition-colors hover:border-teal-700 hover:bg-teal-100`}
      aria-label={`Show the evidence behind this: ${label}`}
    >
      {label}
    </button>
  )
}

/** `ev-1` → `E1`, so the mark reads as a citation rather than a database key. */
export function evidenceTag(id: string, kind?: string): string {
  if (kind === 'voice') return 'Voice'
  if (kind === 'note') return 'Note'
  const n = id.match(/(\d+)$/)?.[1]
  return n ? `E${n}` : 'Evidence'
}

/**
 * Segmented control. On small screens a three-column comparison becomes a
 * choice of which two things to read — this is how that choice is made.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  size = 'md',
}: {
  options: { value: T; label: string; hint?: string }[]
  value: T
  onChange: (v: T) => void
  label: string
  size?: 'sm' | 'md'
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex gap-1 rounded-xl bg-[var(--color-sunken)] p-1"
    >
      {options.map(o => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`tap min-w-0 flex-1 rounded-[9px] px-2 transition-all duration-150
              ${size === 'sm' ? 'py-1.5 text-[12.5px]' : 'py-2 text-[13.5px]'}
              ${
                active
                  ? 'bg-white font-semibold text-ink-950 shadow-[0_1px_2px_rgba(15,17,20,0.10)]'
                  : 'font-medium text-ink-500 hover:text-ink-900'
              }`}
          >
            <span className="block truncate">{o.label}</span>
            {o.hint && (
              <span className={`mt-0.5 block truncate text-[10.5px] font-normal ${active ? 'text-ink-500' : 'text-ink-400'}`}>
                {o.hint}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/**
 * A stated / not-stated pair for stacked mobile comparison. Colour is never
 * the only carrier: an unstated value keeps its words and its glyph.
 */
export function CompareCell({
  name,
  children,
  emphasis,
}: {
  name: string
  children: ReactNode
  emphasis?: boolean
}) {
  return (
    <div
      className={`min-w-0 rounded-xl px-3.5 py-3 ${
        emphasis ? 'bg-white ring-1 ring-[var(--color-rule)]' : 'bg-[var(--color-sunken)]/70'
      }`}
    >
      <p className="mb-1.5 truncate font-data text-[10px] uppercase tracking-[0.13em] text-ink-400">
        {name}
      </p>
      <div className="text-[13.5px] font-medium text-ink-900">{children}</div>
    </div>
  )
}
