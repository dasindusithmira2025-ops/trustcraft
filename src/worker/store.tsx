import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  ACTIVE_JOB, CHAT_SEED, SEED_QUOTE, THREADS,
  deriveSteps, nextAction, quoteTotals,
  type Opportunity, type QuoteItem, type Step, type WAction,
} from './data'

export interface WState {
  job: Opportunity
  step: number
  viewOpp: string
  declined: string[]
  items: QuoteItem[]
  quoteSent: boolean
  duration: string
  warranty: string
  summary: string
  evidence: number
  checks: string[]
  online: boolean
  chatWith: string
  chat: { from: string; text: string; time: string }[]
  read: string[]
}

const INITIAL: WState = {
  job: ACTIVE_JOB,
  step: 3, // quotation is the open task when the demo starts
  viewOpp: 'TC-8821',
  declined: [],
  items: SEED_QUOTE,
  quoteSent: false,
  duration: '2 – 3 hours',
  warranty: '30 days',
  summary: '',
  evidence: 0,
  checks: [],
  online: true,
  chatWith: 'nimal',
  chat: CHAT_SEED,
  read: [],
}

interface Ctx {
  w: WState
  set: (patch: Partial<WState>) => void
  advance: (step: number) => void
  accept: (opp: Opportunity) => void
  decline: (id: string) => void
  send: (text: string) => void
  toggleCheck: (key: string) => void
  reset: () => void
  steps: Step[]
  action: WAction
  totals: ReturnType<typeof quoteTotals>
  unread: number
}

const C = createContext<Ctx>(null as unknown as Ctx)

export function WorkerProvider({ children }: { children: ReactNode }) {
  const [w, setW] = useState<WState>(INITIAL)

  const set = useCallback((patch: Partial<WState>) => setW(p => ({ ...p, ...patch })), [])
  // Progress is one-way: reopening a finished stage must never rewind the job.
  const advance = useCallback((step: number) => setW(p => (step > p.step ? { ...p, step } : p)), [])

  const accept = useCallback((opp: Opportunity) => {
    setW(p => ({ ...p, job: opp, step: 0, items: SEED_QUOTE, quoteSent: false, summary: '', evidence: 0, checks: [] }))
  }, [])

  const decline = useCallback((id: string) => setW(p => ({ ...p, declined: [...p.declined, id] })), [])

  const send = useCallback((text: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    setW(p => ({ ...p, chat: [...p.chat, { from: 'me', text, time }] }))
  }, [])

  const toggleCheck = useCallback((key: string) => {
    setW(p => ({ ...p, checks: p.checks.includes(key) ? p.checks.filter(c => c !== key) : [...p.checks, key] }))
  }, [])

  const reset = useCallback(() => setW(INITIAL), [])

  const steps = useMemo(() => deriveSteps(w.step), [w.step])
  const action = useMemo(() => nextAction(w.step), [w.step])
  const totals = useMemo(() => quoteTotals(w.items), [w.items])
  const unread = useMemo(
    () => THREADS.filter(t => !w.read.includes(t.id)).reduce((n, t) => n + t.unread, 0),
    [w.read],
  )

  return (
    <C.Provider value={{ w, set, advance, accept, decline, send, toggleCheck, reset, steps, action, totals, unread }}>
      {children}
    </C.Provider>
  )
}

export const useW = () => useContext(C)
