import { useEffect, useRef, useState, type ReactNode } from 'react'
import { navigate, useRoute, useStore } from './app-state'
import { Avatar, Eyebrow, Icon, Rule, StatusDot, Toast } from './ui'
import { CASE, USER } from './data'

// ════════════════════════════════════════════════════════════════════════════
// Wordmark
// ════════════════════════════════════════════════════════════════════════════

/** The mark alone — used where the rail is too narrow for the wordmark. */
export function Mark({ size = 30, onDark }: { size?: number; onDark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[9px] ${onDark ? 'bg-white' : 'bg-teal-800'}`}
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 1.5L2 4.5V8.5C2 12 4.8 15 8 16C11.2 15 14 12 14 8.5V4.5L8 1.5Z" fill={onDark ? '#0B6B6B' : 'white'} />
        <path
          d="M5.5 8.5L7.2 10.2L10.5 6.5"
          stroke={onDark ? 'white' : '#0B6B6B'}
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export function Wordmark({ size = 'md', onDark }: { size?: 'sm' | 'md'; onDark?: boolean }) {
  const box = size === 'sm' ? 26 : 30
  return (
    <span className="inline-flex items-center gap-2.5">
      <Mark size={box} />
      <span
        className={`font-display tracking-[0.005em] ${onDark ? 'text-white' : 'text-ink-950'}`}
        style={{ fontSize: size === 'sm' ? 19 : 22 }}
      >
        TrustCraft
      </span>
    </span>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Navigation
//
// One destination list, three presentations:
//   ≥768   a quiet 76px rail — icons with permanent micro-labels, so nothing
//          depends on hover and the top of every page stays free for content
//   <768   a sticky identity bar plus a bottom tab bar, thumb-first
// ════════════════════════════════════════════════════════════════════════════

interface NavItem {
  label: string
  short: string
  to: string
  icon: (p: { size?: number; className?: string }) => ReactNode
  match: (r: string) => boolean
  /** Whether this destination earns a slot in the four-wide mobile tab bar. */
  primary: boolean
}

const NAV: NavItem[] = [
  { label: 'Home', short: 'Home', to: '#/', icon: Icon.home, primary: true, match: r => r === '/' },
  {
    label: 'Cases',
    short: 'Cases',
    to: '#/cases',
    icon: Icon.folder,
    primary: true,
    match: r => r.startsWith('/cases') || r.startsWith('/case/'),
  },
  {
    label: 'Ledger',
    short: 'Ledger',
    to: '#/ledger',
    icon: Icon.book,
    primary: true,
    match: r => r.startsWith('/ledger'),
  },
  {
    label: 'Messages',
    short: 'Messages',
    to: '#/messages',
    icon: Icon.message,
    primary: true,
    match: r => r.startsWith('/messages'),
  },
  {
    label: 'People',
    short: 'People',
    to: '#/professionals',
    icon: Icon.people,
    primary: false,
    match: r => r.startsWith('/professionals') || r.startsWith('/pro/'),
  },
]

function NavRail() {
  const route = useRoute()
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-y-0 left-0 z-40 hidden w-[var(--rail-w)] flex-col items-center
        border-r border-[var(--color-rule)] bg-[var(--color-canvas)] py-5 md:flex"
    >
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mb-7 rounded-[10px]"
        aria-label="TrustCraft home"
      >
        <Mark size={32} />
      </button>

      <ul className="flex w-full flex-col items-center gap-1">
        {NAV.map(item => {
          const active = item.match(route)
          return (
            <li key={item.to} className="w-full px-2">
              <button
                type="button"
                onClick={() => navigate(item.to)}
                aria-current={active ? 'page' : undefined}
                className={`relative flex min-h-[56px] w-full flex-col items-center justify-center gap-1.5
                  rounded-xl py-3 transition-colors duration-150
                  ${
                    active
                      ? 'bg-teal-50 text-teal-800'
                      : 'text-ink-500 hover:bg-black/[0.04] hover:text-ink-900'
                  }`}
              >
                {/* Position is the primary cue; colour only reinforces it. */}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-teal-800"
                  />
                )}
                <item.icon size={20} />
                <span className={`text-[11.5px] leading-none ${active ? 'font-semibold' : 'font-medium'}`}>
                  {item.short}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="mt-auto flex w-full flex-col items-center gap-2 px-2">
        <NotificationButton />
        <AccountMenu placement="rail" />
      </div>
    </nav>
  )
}

function NotificationButton() {
  return (
    <button
      type="button"
      onClick={() => navigate('/cases')}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl text-ink-500
        transition-colors hover:bg-black/[0.05] hover:text-ink-900"
      aria-label="Notifications — 1 case needs you"
    >
      <Icon.bell size={18} />
      <span
        aria-hidden="true"
        className="absolute right-2 top-2 h-[6px] w-[6px] rounded-full bg-gold-500
          ring-2 ring-[var(--color-canvas)]"
      />
    </button>
  )
}

/**
 * Account menu. On mobile this is the only route to the secondary
 * destinations, so it holds them rather than being decorative.
 */
function AccountMenu({ placement }: { placement: 'rail' | 'bar' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const secondary = NAV.filter(n => !n.primary)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`flex items-center rounded-full transition-colors hover:bg-black/[0.05]
          ${placement === 'rail' ? 'justify-center p-1.5' : 'gap-2 py-1 pl-1 pr-2.5'}`}
        aria-label={`Account — ${USER.full}`}
      >
        <Avatar name={USER.full} size={placement === 'rail' ? 30 : 28} />
      </button>

      {open && (
        <div
          role="menu"
          className={`a-up absolute z-50 w-60 rounded-2xl border border-[var(--color-rule)] bg-white p-2
            shadow-[0_2px_6px_rgba(15,17,20,0.06),0_24px_60px_-28px_rgba(15,17,20,0.4)]
            ${placement === 'rail' ? 'bottom-0 left-[calc(100%+10px)]' : 'right-0 top-[calc(100%+10px)]'}`}
        >
          <div className="flex items-center gap-3 px-2.5 py-2.5">
            <Avatar name={USER.full} size={36} />
            <div className="min-w-0">
              <p className="truncate text-[14.5px] font-semibold text-ink-950">{USER.full}</p>
              <p className="truncate text-[13px] text-ink-500">{USER.address}</p>
            </div>
          </div>
          <Rule className="my-1.5" />
          {secondary.map(item => (
            <MenuLink
              key={item.to}
              icon={<item.icon size={16} />}
              label={item.label}
              onClick={() => {
                setOpen(false)
                navigate(item.to)
              }}
            />
          ))}
          <MenuLink
            icon={<Icon.shield size={16} />}
            label="Your home & privacy"
            onClick={() => setOpen(false)}
          />
          <Rule className="my-1.5" />
          <div className="px-2.5 pb-1.5 pt-1">
            <Eyebrow className="mb-2">Language</Eyebrow>
            <LanguageSwitch />
          </div>
        </div>
      )}
    </div>
  )
}

function MenuLink({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-[14.5px]
        font-medium text-ink-700 transition-colors hover:bg-[var(--color-sunken)] hover:text-ink-950"
    >
      <span className="text-ink-400">{icon}</span>
      {label}
    </button>
  )
}

/** Mobile identity bar. Deliberately slim — the hero should own the screen. */
function MobileTopBar() {
  return (
    <header
      className="sticky top-0 z-40 flex h-[54px] items-center gap-3 border-b border-[var(--color-rule)]
        bg-[var(--color-canvas)]/94 backdrop-blur-md md:hidden"
      style={{ paddingInline: 'var(--gutter)' }}
    >
      <button type="button" onClick={() => navigate('/')} className="rounded" aria-label="TrustCraft home">
        <Wordmark size="sm" />
      </button>
      <div className="ml-auto flex items-center gap-1">
        <NotificationButton />
        <AccountMenu placement="bar" />
      </div>
    </header>
  )
}

/** Mobile tab bar. Four destinations, thumb-height, always labelled. */
function MobileTabBar() {
  const route = useRoute()
  return (
    <nav
      aria-label="Primary"
      className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-rule)]
        bg-[var(--color-canvas)]/96 backdrop-blur-lg md:hidden"
    >
      <ul className="flex h-[var(--tabbar-h)] items-stretch">
        {NAV.filter(n => n.primary).map(item => {
          const active = item.match(route)
          return (
            <li key={item.to} className="flex-1">
              <button
                type="button"
                onClick={() => navigate(item.to)}
                aria-current={active ? 'page' : undefined}
                className={`relative flex h-full w-full flex-col items-center justify-center gap-1
                  transition-colors ${active ? 'text-teal-800' : 'text-ink-400'}`}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-[26%] top-0 h-[2px] rounded-b-full bg-teal-800"
                  />
                )}
                <item.icon size={20} />
                <span className={`text-[11px] leading-none ${active ? 'font-semibold' : 'font-medium'}`}>
                  {item.short}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Case context strip
//
// Shown on every case surface so a workspace never loses its subject. On a
// phone the stage rail scrolls horizontally inside itself rather than
// wrapping into a second row that pushes the content down.
// ════════════════════════════════════════════════════════════════════════════

const CASE_STEPS = [
  { key: 'understand', label: 'Understand', to: '#/case/TC-2048' },
  { key: 'decide', label: 'Decide', to: '#/case/TC-2048/path' },
  { key: 'agree', label: 'Agree', to: '#/case/TC-2048/quotes' },
  { key: 'prove', label: 'Prove', to: '#/case/TC-2048/record' },
]

export function CaseBar({ active, resolved }: { active: string; resolved?: boolean }) {
  const { progress } = useStore()
  const activeIndex = CASE_STEPS.findIndex(s => s.key === active)
  const done = resolved || progress.verified
  const status = done ? 'Resolved' : progress.agreementApproved ? 'Repair underway' : 'Open'

  return (
    <div className="border-b border-[var(--color-rule)] bg-[var(--color-canvas)]/94 backdrop-blur-md">
      <div className="page flex flex-col gap-2 py-2.5 lg:flex-row lg:items-center lg:gap-6 lg:py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="font-data text-[11px] tracking-[0.14em] text-ink-400">{CASE.id}</span>
          <span className="h-3.5 w-px shrink-0 bg-[var(--color-rule-strong)]" aria-hidden="true" />
          <span className="truncate text-[14px] font-semibold text-ink-950 sm:text-[14.5px]">
            {CASE.title}
          </span>
          <span
            className={`ml-auto flex shrink-0 items-center gap-1.5 text-[12.5px] font-medium lg:ml-0
              ${done ? 'text-success-700' : 'text-teal-800'}`}
          >
            <StatusDot tone={done ? 'success' : 'teal'} pulse={!done} />
            {status}
          </span>
        </div>

        {/* Stage rail — scrolls itself on a phone, never wraps the page. */}
        <nav
          aria-label="Case stages"
          className="snap-row bleed-row -my-1 items-center gap-1 py-1 lg:ml-auto lg:mx-0 lg:px-0"
        >
          {CASE_STEPS.map((s, i) => {
            const isActive = i === activeIndex
            const isPast = i < activeIndex
            return (
              <span key={s.key} className="flex items-center gap-1">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className={`h-px w-4 lg:w-5 ${isPast || isActive ? 'bg-teal-700/45' : 'bg-[var(--color-rule-strong)]'}`}
                  />
                )}
                <button
                  type="button"
                  onClick={() => navigate(s.to)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1
                    text-[13px] transition-colors lg:text-[13.5px]
                    ${
                      isActive
                        ? 'bg-teal-800 font-semibold text-white'
                        : isPast
                          ? 'font-medium text-teal-800 hover:bg-teal-50'
                          : 'font-medium text-ink-400 hover:text-ink-700'
                    }`}
                >
                  {isPast && <Icon.check size={12} />}
                  {s.label}
                </button>
              </span>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// Shell
// ════════════════════════════════════════════════════════════════════════════

export function AppShell({
  children,
  caseStage,
  caseResolved,
  wide = false,
  noFooter = false,
  /** Surfaces that manage their own height (the evidence workspace). */
  flush = false,
}: {
  children: ReactNode
  caseStage?: string
  caseResolved?: boolean
  wide?: boolean
  noFooter?: boolean
  flush?: boolean
}) {
  const { toast } = useStore()
  return (
    <div className="min-h-screen">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <NavRail />
      <MobileTopBar />

      <div className="pb-tabbar md:pl-[var(--rail-w)]">
        {caseStage && (
          <div className="sticky top-[54px] z-30 md:top-0">
            <CaseBar active={caseStage} resolved={caseResolved} />
          </div>
        )}

        <main
          id="main"
          tabIndex={-1}
          className={wide || flush ? 'w-full' : 'page'}
        >
          {children}
        </main>

        {!noFooter && <Footer />}
      </div>

      <MobileTabBar />
      <Toast message={toast} />
    </div>
  )
}

function Footer() {
  return (
    <footer className="mt-16 md:mt-24">
      <Rule />
      <div className="page flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:py-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Wordmark size="sm" />
          <span className="text-[13px] text-ink-400 sm:text-[13.5px]">
            Understand · Decide · Agree · Prove · Remember
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Eyebrow className="hidden sm:block">Language</Eyebrow>
          <LanguageSwitch />
        </div>
      </div>
    </footer>
  )
}

/**
 * Language switch. Only English is written; the other two exist so the layout
 * is exercised against longer Sinhala/Tamil strings rather than assumed safe.
 */
const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'si', label: 'සිංහල' },
  { code: 'ta', label: 'தமிழ்' },
]

function LanguageSwitch() {
  const [lang, setLang] = useState('en')
  const { notify } = useStore()
  return (
    <div role="group" aria-label="Interface language" className="flex items-center gap-1">
      {LANGS.map(l => (
        <button
          key={l.code}
          type="button"
          onClick={() => {
            setLang(l.code)
            document.documentElement.lang = l.code
            if (l.code !== 'en') notify(`${l.label} translation is in progress — layouts already account for it`)
          }}
          aria-pressed={lang === l.code}
          className={`rounded-lg px-2.5 py-1.5 text-[13.5px] transition-colors
            ${lang === l.code ? 'bg-ink-950 font-medium text-white' : 'text-ink-500 hover:bg-black/[0.05] hover:text-ink-900'}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
