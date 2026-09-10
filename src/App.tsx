import { useCallback, useState, type ReactElement } from 'react'
import type { ScreenId } from './types'
import { BottomNav, Frame, Icon } from './components/UI'
import { HomeScreen, NotificationsScreen, LocationScreen, CameraScreen, ProblemScreen } from './screens/FlowA'
import { FindProsScreen, ProProfileScreen, AIAnalysisScreen, RecommendationsScreen, ConfirmationScreen } from './screens/FlowB'
import {
  StatusScreen, AssessmentScreen, SetInspectionScreen, InspectionPaymentScreen,
  QuotationScreen, QuotationPaymentScreen, WorkCompletedScreen, ReviewScreen, RecordScreen,
} from './screens/FlowC'
import { CasesScreen, MessagesScreen, ChatScreen, ProfileScreen, ProfileOverviewScreen } from './screens/FlowD'
import WorkerApp from './worker/WorkerApp'

/** Per-screen chrome: which tab lights up, and whether the device UI goes dark. */
const TAB_OF: Partial<Record<ScreenId, string>> = {
  home: 'home', 'find-pros': 'find-pros', cases: 'cases', messages: 'messages', profile: 'profile',
}

const SCREENS: Record<ScreenId, (p: { navigate: (to: ScreenId) => void; goBack: () => void }) => ReactElement> = {
  home: HomeScreen,
  notifications: NotificationsScreen,
  location: LocationScreen,
  camera: CameraScreen,
  problem: ProblemScreen,
  'find-pros': FindProsScreen,
  'pro-profile': ProProfileScreen,
  'ai-analysis': AIAnalysisScreen,
  recommendations: RecommendationsScreen,
  confirmation: ConfirmationScreen,
  status: StatusScreen,
  assessment: AssessmentScreen,
  'set-inspection': SetInspectionScreen,
  'inspection-payment': InspectionPaymentScreen,
  quotation: QuotationScreen,
  'quotation-payment': QuotationPaymentScreen,
  'work-completed': WorkCompletedScreen,
  review: ReviewScreen,
  record: RecordScreen,
  cases: CasesScreen,
  messages: MessagesScreen,
  chat: ChatScreen,
  profile: ProfileScreen,
  'profile-overview': ProfileOverviewScreen,
}

function CustomerApp() {
  const [history, setHistory] = useState<ScreenId[]>(['home'])
  const [animKey, setAnimKey] = useState(0)

  const screen = history[history.length - 1]

  const navigate = useCallback((to: ScreenId) => {
    setHistory(h => {
      // Tabs reset the stack; anything else pushes onto it.
      if (TAB_OF[to]) return [to]
      return h[h.length - 1] === to ? h : [...h, to]
    })
    setAnimKey(k => k + 1)
  }, [])

  const goBack = useCallback(() => {
    setHistory(h => (h.length > 1 ? h.slice(0, -1) : h))
    setAnimKey(k => k + 1)
  }, [])

  const tab = TAB_OF[screen]
  const dark = screen === 'camera'
  const Screen = SCREENS[screen]

  return (
    <Frame
      screenKey={animKey}
      light={dark}
      topBg={dark ? '#020617' : '#fff'}
      bg={dark ? '#020617' : '#fff'}
      nav={tab ? <BottomNav active={tab} navigate={navigate} /> : undefined}
    >
      <Screen navigate={navigate} goBack={goBack} />
    </Frame>
  )
}

// ── Role switch ──────────────────────────────────────────────────────────────

const ROLES = [
  { id: 'customer', label: 'Customer', icon: 'user' },
  { id: 'worker', label: 'Professional', icon: 'wrench' },
] as const

export default function App() {
  const [role, setRole] = useState<'customer' | 'worker'>('worker')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-3 sm:px-4">
      <div className="mb-5 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center text-white">
          <Icon name="shield" size={18} />
        </div>
        <span className="text-[20px] font-bold text-white tracking-tight">TrustCraft</span>
      </div>

      <div className="mb-6 p-1 rounded-full bg-white/8 ring-1 ring-white/10 flex gap-1">
        {ROLES.map(r => {
          const on = role === r.id
          return (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`h-9 px-4 rounded-full text-[13px] font-semibold inline-flex items-center gap-2 transition-colors ${
                on ? 'bg-white text-ink-900' : 'text-white/55 hover:text-white'
              }`}
            >
              <Icon name={r.icon} size={15} />
              {r.label}
            </button>
          )
        })}
      </div>

      <div className="device-fit">
        {role === 'customer' ? <CustomerApp /> : <WorkerApp />}
      </div>

      <p className="mt-5 text-[11px] text-white/30">
        {role === 'customer' ? 'Describe a problem to start' : 'Accept a request, quote it, prove the work'}
      </p>
    </div>
  )
}
