import { useCallback, useState, type ReactElement } from 'react'
import type { ScreenId } from './types'
import { BottomNav, Icon, StatusBar } from './components/UI'
import { HomeScreen, NotificationsScreen, LocationScreen, CameraScreen, ProblemScreen } from './screens/FlowA'
import { FindProsScreen, ProProfileScreen, AIAnalysisScreen, RecommendationsScreen, ConfirmationScreen } from './screens/FlowB'
import {
  StatusScreen, AssessmentScreen, SetInspectionScreen, InspectionPaymentScreen,
  QuotationScreen, QuotationPaymentScreen, WorkCompletedScreen, ReviewScreen, RecordScreen,
} from './screens/FlowC'
import { CasesScreen, MessagesScreen, ChatScreen, ProfileScreen, ProfileOverviewScreen } from './screens/FlowD'

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

export default function App() {
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
  const showNav = Boolean(tab)
  const dark = screen === 'camera'
  const Screen = SCREENS[screen]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4">
      <div className="mb-6 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center text-white">
          <Icon name="shield" size={18} />
        </div>
        <span className="text-[20px] font-bold text-white tracking-tight">TrustCraft</span>
        <span className="text-[10px] font-semibold text-white/40 tracking-widest ml-1">CUSTOMER APP</span>
      </div>

      <div
        className="relative bg-white overflow-hidden flex-shrink-0"
        style={{
          width: 390,
          height: 844,
          borderRadius: 44,
          boxShadow: '0 40px 90px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.10)',
        }}
      >
        <div
          className="absolute z-50 bg-black"
          style={{ top: 12, left: '50%', transform: 'translateX(-50%)', width: 120, height: 34, borderRadius: 20 }}
        />

        <StatusBar light={dark} />

        <div
          key={animKey}
          className="absolute left-0 right-0 screen-slide"
          style={{ top: 44, bottom: showNav ? 80 : 0, background: dark ? '#020617' : '#fff' }}
        >
          <div className="h-full overflow-y-auto no-scroll">
            <Screen navigate={navigate} goBack={goBack} />
          </div>
        </div>

        {showNav && (
          <div className="absolute bottom-0 left-0 right-0 z-30">
            <BottomNav active={tab!} navigate={navigate} />
          </div>
        )}
      </div>

      <p className="mt-5 text-[11px] text-white/30">
        {history.length > 1 ? `${history.length - 1} screen${history.length > 2 ? 's' : ''} deep · use the in-app back button` : 'Start by describing a problem'}
      </p>
    </div>
  )
}
