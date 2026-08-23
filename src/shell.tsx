import { useEffect, useState, type ReactNode } from 'react'
import { navigate, useRoute, useStore } from './app-state'
import { Avatar, Eyebrow, Icon, Pill, Rule, StatusDot, Toast } from './ui'
import { CASE, USER } from './data'

// ── Wordmark ────────────────────────────────────────────────────────────────

export function Wordmark({ size = 'md', onDark }: { size?: 'sm' | 'md'; onDark?: boolean }) {
  const box = size === 'sm' ? 26 : 30
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className="inline-flex items-center justify-center rounded-[9px] bg-teal-800"
        style={{ width: box, height: box }}
      >
        <svg width={box * 0.55} height={box * 0.55} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 1.5L2 4.5V8.5C2 12 4.8 15 8 16C11.2 15 14 12 14 8.5V4.5L8 1.5Z" fill="white" />
          <path
            d="M5.5 8.5L7.2 10.2L10.5 6.5"
            stroke="#0B6B6B"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className={`font-display tracking-[0.005em] ${onDark ? 'text-white' : 'text-ink-950'}`}
        style={{ fontSize: size === 'sm' ? 19 : 22 }}
      >
        TrustCraft
      </span>
    </span>
  )
}

// ── Primary navigation ──────────────────────────────────────────────────────

const NAV = [
  { label: 'Home', to: '#/', match: (r: string) => r === '/' },
  { label: 'Cases', to: '#/cases', match: (r: string) => r.startsWith('/cases') || r.startsWith('/case/') },
  { label: 'Professionals', to: '#/professionals', match: (r: string) => r.startsWith('/professionals') || r.startsWith('/pro/') },
  { label: 'Home Ledger', to: '#/ledger', match: (r: string) => r.startsWith('/ledger') },
  { label: 'Messages', to: '#/messages', match: (r: string) => r.startsWith('/messages') },
]

function TopNav({ recede }: { recede: boolean }) {
  const route = useRoute()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200
        ${scrolled ? 'bg-[var(--color-canvas)]/92 backdrop-blur-md' : 'bg-transparent'}`}
    >
      <div
        className={`mx-auto flex max-w-[1360px] items-center gap-10 px-8 transition-all duration-200
          ${recede ? 'h-14' : 'h-[68px]'}`}
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          className="shrink-0 rounded"
          aria-label="TrustCraft home"
        >
          <Wordmark size={recede ? 'sm' : 'md'} />
        </button>

        <nav aria-label="Primary" className="flex items-center gap-1">
          {NAV.map(item => {
            const active = item.match(route)
            return (
              <button
                key={item.to}
                type="button"
                onClick={() => navigate(item.to)}
                aria-current={active ? 'page' : undefined}
                className={`relative rounded-lg px-3 py-2 text-[13.5px] transition-colors duration-150
                  ${active ? 'font-semibold text-ink-950' : 'font-medium text-ink-500 hover:text-ink-900'}`}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-teal-800"
                  />
                )}
              </button>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/cases')}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink-500
              transition-colors hover:bg-black/[0.05] hover:text-ink-900"
            aria-label="Notifications — 1 case needs you"
          >
            <Icon.bell size={17} />
            <span
              aria-hidden="true"
              className="absolute right-2 top-2 h-[6px] w-[6px] rounded-full bg-gold-500 ring-2 ring-[var(--color-canvas)]"
            />
          </button>
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-black/[0.05]"
            aria-label={`Account — ${USER.full}`}
          >
            <Avatar name={USER.full} size={30} />
            <span className="text-[13px] font-medium text-ink-800">{USER.name}</span>
          </button>
        </div>
      </div>
      <Rule className={scrolled ? 'opacity-100' : 'opacity-0'} />
    </header>
  )
}

// ── Case context strip ──────────────────────────────────────────────────────
//
// Shown on every case surface so the workspace never loses its subject.

const CASE_STEPS = [
  { key: 'understand', label: 'Understand', to: '#/case/TC-2048' },
  { key: 'decide', label: 'Decide', to: '#/case/TC-2048/path' },
  { key: 'agree', label: 'Agree', to: '#/case/TC-2048/quotes' },
  { key: 'prove', label: 'Prove', to: '#/case/TC-2048/record' },
]

export function CaseBar({ active, resolved }: { active: string; resolved?: boolean }) {
  const { progress } = useStore()
  const activeIndex = CASE_STEPS.findIndex(s => s.key === active)

  return (
    <div className="border-b border-[var(--color-rule)] bg-[var(--color-canvas)]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-x-6 gap-y-3 px-8 py-3">
        <div className="flex items-center gap-3">
          <span className="font-data text-[11px] tracking-[0.14em] text-ink-400">{CASE.id}</span>
          <span className="h-3.5 w-px bg-[var(--color-rule-strong)]" aria-hidden="true" />
          <span className="text-[13.5px] font-semibold text-ink-950">{CASE.title}</span>
          <Pill
            tone={resolved || progress.verified ? 'success' : 'teal'}
            icon={<StatusDot tone={resolved || progress.verified ? 'success' : 'teal'} pulse={!resolved && !progress.verified} />}
          >
            {resolved || progress.verified
              ? 'Resolved'
              : progress.agreementApproved
                ? 'Repair underway'
                : 'Open'}
          </Pill>
        </div>

        <nav aria-label="Case stages" className="ml-auto flex items-center gap-1">
          {CASE_STEPS.map((s, i) => {
            const isActive = i === activeIndex
            const isPast = i < activeIndex
            return (
              <span key={s.key} className="flex items-center gap-1">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className={`h-px w-5 ${isPast || isActive ? 'bg-teal-700/45' : 'bg-[var(--color-rule-strong)]'}`}
                  />
                )}
                <button
                  type="button"
                  onClick={() => navigate(s.to)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px] transition-colors
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

// ── Shell ───────────────────────────────────────────────────────────────────

export function AppShell({
  children,
  recede = false,
  caseStage,
  caseResolved,
  wide = false,
  noFooter = false,
}: {
  children: ReactNode
  recede?: boolean
  caseStage?: string
  caseResolved?: boolean
  wide?: boolean
  noFooter?: boolean
}) {
  const { toast } = useStore()
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <TopNav recede={recede} />
      {caseStage && (
        <div className="sticky top-14 z-30">
          <CaseBar active={caseStage} resolved={caseResolved} />
        </div>
      )}
      <main
        id="main"
        tabIndex={-1}
        className={`flex-1 ${wide ? 'w-full' : 'mx-auto w-full max-w-[1360px] px-8'}`}
      >
        {children}
      </main>
      {!noFooter && <Footer />}
      <Toast message={toast} />
    </div>
  )
}

function Footer() {
  return (
    <footer className="mt-24">
      <Rule />
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-6 px-8 py-8">
        <div className="flex items-center gap-4">
          <Wordmark size="sm" />
          <span className="text-[12.5px] text-ink-400">Understand · Decide · Agree · Prove · Remember</span>
        </div>
        <div className="flex items-center gap-5">
          <Eyebrow>Language</Eyebrow>
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
          className={`rounded-lg px-2.5 py-1.5 text-[12.5px] transition-colors
            ${lang === l.code ? 'bg-ink-950 font-medium text-white' : 'text-ink-500 hover:bg-black/[0.05] hover:text-ink-900'}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
