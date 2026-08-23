import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

// ── Hash routing ────────────────────────────────────────────────────────────
//
// The whole prototype is one document. A hash route is enough: it gives real
// URLs, working browser back/forward, and no router dependency.

function currentHash(): string {
  const h = window.location.hash.replace(/^#/, '')
  return h.length > 0 ? h : '/'
}

export function navigate(to: string): void {
  const path = to.replace(/^#/, '')
  if (path === currentHash()) return
  window.location.hash = path
}

export function useRoute(): string {
  const [route, setRoute] = useState(currentHash)
  useEffect(() => {
    const onChange = () => setRoute(currentHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

/** Scroll to top on route change — otherwise deep pages open mid-scroll. */
export function useScrollReset(route: string): void {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [route])
}

// ── Case progress ───────────────────────────────────────────────────────────

export interface CaseProgress {
  /** questionId -> chosen answer */
  answers: Record<string, string>
  path: string | null
  selectedPro: string | null
  acceptedQuote: string | null
  agreementApproved: boolean
  changeDecision: 'approved' | 'declined' | null
  completionChecks: string[]
  verified: boolean
}

const EMPTY: CaseProgress = {
  answers: {},
  path: null,
  selectedPro: null,
  acceptedQuote: null,
  agreementApproved: false,
  changeDecision: null,
  completionChecks: [],
  verified: false,
}

interface Store {
  progress: CaseProgress
  set: (patch: Partial<CaseProgress>) => void
  answer: (questionId: string, value: string) => void
  toggleCheck: (id: string) => void
  reset: () => void
  /** How far the proof timeline has advanced, derived from decisions made. */
  step: number
  toast: string | null
  notify: (message: string) => void
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<CaseProgress>(EMPTY)
  const [toast, setToast] = useState<string | null>(null)

  const set = useCallback((patch: Partial<CaseProgress>) => {
    setProgress(p => ({ ...p, ...patch }))
  }, [])

  const answer = useCallback((questionId: string, value: string) => {
    setProgress(p => ({ ...p, answers: { ...p.answers, [questionId]: value } }))
  }, [])

  const toggleCheck = useCallback((id: string) => {
    setProgress(p => ({
      ...p,
      completionChecks: p.completionChecks.includes(id)
        ? p.completionChecks.filter(c => c !== id)
        : [...p.completionChecks, id],
    }))
  }, [])

  const reset = useCallback(() => setProgress(EMPTY), [])

  const notify = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(t => (t === message ? null : t)), 4200)
  }, [])

  const step = useMemo(() => {
    let s = 0
    if (progress.selectedPro) s = 1
    if (progress.acceptedQuote) s = 2
    if (progress.agreementApproved) s = 3
    if (progress.agreementApproved) s = 4
    if (progress.changeDecision) s = 5
    if (progress.changeDecision) s = 6
    if (progress.verified) s = 7
    return s
  }, [progress])

  const value = useMemo<Store>(
    () => ({ progress, set, answer, toggleCheck, reset, step, toast, notify }),
    [progress, set, answer, toggleCheck, reset, step, toast, notify],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}
