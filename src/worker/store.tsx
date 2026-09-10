import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  ACTIVE_JOB, CHAT_SEED, LAST_STEP, SEED_QUOTE, THREADS,
  caseToOpportunity, deriveSteps, nextAction, quoteTotals,
  type Opportunity, type QuoteItem, type Step, type WAction,
} from './data'
import { rank, workerStep } from '../case'
import { setAvailable, useAvailability, useCase, nowTime } from '../caseStore'

/** This prototype is signed in as one professional. */
export const ME = 'kamal'

/** Professional-app UI state. Anything the customer can also see lives in the
 *  shared case (see src/caseStore.ts), never here. */
export interface WState {
  /** Fixture opportunities this professional has taken on (demo filler — the
   *  live shared case is the one the job screens actually track). */
  accepted: string[]
  viewOpp: string
  declined: string[]
  items: QuoteItem[]
  duration: string
  warranty: string
  notes: string
  analysisDraft: string
  summary: string
  evidence: number
  checks: string[]
  chatWith: string
  chat: { from: string; text: string; time: string }[]
  read: string[]
}

const INITIAL: WState = {
  accepted: [],
  viewOpp: '',
  declined: [],
  items: SEED_QUOTE,
  duration: '2 – 3 hours',
  warranty: '30 days',
  notes: '',
  analysisDraft: '',
  summary: '',
  evidence: 0,
  checks: [],
  chatWith: 'nimal',
  chat: CHAT_SEED,
  read: [],
}

interface Ctx {
  w: WState
  /** The job this professional is working: the live shared case when they hold
   *  it, otherwise the seeded historical job. */
  job: Opportunity
  /** True when `job` is the live customer request. */
  onLiveCase: boolean
  step: number
  /** Availability lives in the shared store: the customer's urgent matching
   *  reads the same flag this switch writes. */
  online: boolean
  setOnline: (on: boolean) => void
  set: (patch: Partial<WState>) => void
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
  const c = useCase()
  const avail = useAvailability()
  const online = avail[ME] ?? false
  const setOnline = useCallback((on: boolean) => setAvailable(ME, on), [])

  const set = useCallback((patch: Partial<WState>) => setW(p => ({ ...p, ...patch })), [])

  const accept = useCallback((opp: Opportunity) => {
    setW(p => ({
      ...p,
      accepted: opp.live ? p.accepted : [...p.accepted, opp.id],
      items: SEED_QUOTE, summary: '', analysisDraft: '', evidence: 0, checks: [],
    }))
  }, [])

  const decline = useCallback((id: string) => setW(p => ({ ...p, declined: [...p.declined, id] })), [])

  const send = useCallback((text: string) => {
    setW(p => ({ ...p, chat: [...p.chat, { from: 'me', text, time: nowTime() }] }))
  }, [])

  const toggleCheck = useCallback((key: string) => {
    setW(p => ({ ...p, checks: p.checks.includes(key) ? p.checks.filter(k => k !== key) : [...p.checks, key] }))
  }, [])

  const reset = useCallback(() => setW(INITIAL), [])

  // The live case becomes this professional's active job the moment it is
  // assigned; until then the card shows their last, already-closed job.
  const onLiveCase = rank(c.status) >= rank('assigned')
  const job = onLiveCase ? caseToOpportunity(c) : ACTIVE_JOB
  const step = onLiveCase ? workerStep(c.status) : LAST_STEP

  const steps = useMemo(() => deriveSteps(step), [step])
  const action = useMemo(() => nextAction(step, c), [step, c])
  const totals = useMemo(() => quoteTotals(w.items), [w.items])
  const unread = useMemo(
    () => THREADS.filter(t => !w.read.includes(t.id)).reduce((n, t) => n + t.unread, 0),
    [w.read],
  )

  return (
    <C.Provider
      value={{ w, job, onLiveCase, step, online, setOnline, set, accept, decline, send, toggleCheck, reset, steps, action, totals, unread }}
    >
      {children}
    </C.Provider>
  )
}

export const useW = () => useContext(C)
