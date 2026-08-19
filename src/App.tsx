import { useState, useCallback } from 'react'
import { ScreenId } from './types'
import { StatusBar, BottomNav, ProtoNav } from './components/Shared'
import {
  HomeScreen, CameraScreen, VoiceScreen, AIAnalysisScreen,
  ProblemCanvasScreen, ClarificationScreen, StructuredRequestScreen,
} from './screens/FlowA'
import {
  TopMatchesScreen, WhyMatchScreen, ProProfileScreen, TrustScoreScreen, BookingScreen,
} from './screens/FlowB'
import {
  AppointmentScreen, InspectionScreen, RepairPlanScreen,
  PriceContextScreen, ApprovalScreen, PaymentScreen,
} from './screens/FlowC'
import {
  ActiveJobScreen, CompletionScreen, ResolvedScreen, ReviewScreen, MyHomeScreen,
} from './screens/FlowD'
import { ProRequestScreen } from './screens/ProScreen'

const NO_BOTTOM_NAV = new Set<ScreenId>([
  'camera', 'voice', 'ai-analysis', 'why-match', 'trust-score',
  'price-context', 'approval', 'payment', 'completion', 'resolved',
  'review', 'pro-request', 'inspection', 'booking',
])

const BOTTOM_ACTIVE: Record<ScreenId, string> = {
  home: 'home', camera: 'home', voice: 'home', 'ai-analysis': 'home',
  'problem-canvas': 'home', clarification: 'home', 'structured-request': 'home',
  'top-matches': 'home', 'why-match': 'home', 'pro-profile': 'home',
  'trust-score': 'home', booking: 'home',
  appointment: 'jobs', inspection: 'jobs', 'repair-plan': 'jobs',
  'price-context': 'jobs', approval: 'jobs', payment: 'jobs',
  'active-job': 'jobs', completion: 'jobs', resolved: 'jobs', review: 'jobs',
  'my-home': 'profile', 'pro-request': 'messages',
}

export default function App() {
  const [history, setHistory] = useState<ScreenId[]>(['home'])
  const [animKey, setAnimKey] = useState(0)

  const screen = history[history.length - 1]

  const navigate = useCallback((to: ScreenId) => {
    setHistory(h => [...h, to])
    setAnimKey(k => k + 1)
  }, [])

  const goBack = useCallback(() => {
    setHistory(h => h.length > 1 ? h.slice(0, -1) : h)
    setAnimKey(k => k + 1)
  }, [])

  const showBottomNav = !NO_BOTTOM_NAV.has(screen)
  const navProps = { navigate, goBack }

  const renderScreen = () => {
    switch (screen) {
      case 'home':               return <HomeScreen {...navProps} />
      case 'camera':             return <CameraScreen {...navProps} />
      case 'voice':              return <VoiceScreen {...navProps} />
      case 'ai-analysis':        return <AIAnalysisScreen {...navProps} />
      case 'problem-canvas':     return <ProblemCanvasScreen {...navProps} />
      case 'clarification':      return <ClarificationScreen {...navProps} />
      case 'structured-request': return <StructuredRequestScreen {...navProps} />
      case 'top-matches':        return <TopMatchesScreen {...navProps} />
      case 'why-match':          return <WhyMatchScreen {...navProps} />
      case 'pro-profile':        return <ProProfileScreen {...navProps} />
      case 'trust-score':        return <TrustScoreScreen {...navProps} />
      case 'booking':            return <BookingScreen {...navProps} />
      case 'appointment':        return <AppointmentScreen {...navProps} />
      case 'inspection':         return <InspectionScreen {...navProps} />
      case 'repair-plan':        return <RepairPlanScreen {...navProps} />
      case 'price-context':      return <PriceContextScreen {...navProps} />
      case 'approval':           return <ApprovalScreen {...navProps} />
      case 'payment':            return <PaymentScreen {...navProps} />
      case 'active-job':         return <ActiveJobScreen {...navProps} />
      case 'completion':         return <CompletionScreen {...navProps} />
      case 'resolved':           return <ResolvedScreen {...navProps} />
      case 'review':             return <ReviewScreen {...navProps} />
      case 'my-home':            return <MyHomeScreen {...navProps} />
      case 'pro-request':        return <ProRequestScreen {...navProps} />
      default:                   return <HomeScreen {...navProps} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 px-4">
      {/* Wordmark */}
      <div className="mb-7 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-teal-800 rounded-xl flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5L2 4.5V8.5C2 12 4.8 15 8 16C11.2 15 14 12 14 8.5V4.5L8 1.5Z" fill="white"/>
            <path d="M5.5 8.5L7.2 10.2L10.5 6.5" stroke="#0B6B6B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="font-display text-[22px] text-white tracking-wide">TrustCraft</span>
        <span className="font-data text-[11px] text-white/30 tracking-wider ml-1">PROTOTYPE</span>
      </div>

      {/* Phone shell */}
      <div
        className="relative bg-ink-50 overflow-hidden flex-shrink-0"
        style={{
          width: 390,
          height: 844,
          borderRadius: 44,
          boxShadow: '0 48px 96px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)',
        }}
      >
        {/* Dynamic island pill */}
        <div
          className="absolute z-50 bg-black"
          style={{ top: 12, left: '50%', transform: 'translateX(-50%)', width: 120, height: 34, borderRadius: 20 }}
        />

        <StatusBar />

        {/* Screen content */}
        <div
          key={animKey}
          className="absolute left-0 right-0 screen-slide"
          style={{ top: 44, bottom: showBottomNav ? 80 : 0 }}
        >
          <div className="h-full overflow-y-auto no-scroll">
            {renderScreen()}
          </div>
        </div>

        {showBottomNav && (
          <div className="absolute bottom-0 left-0 right-0 z-30">
            <BottomNav active={BOTTOM_ACTIVE[screen] ?? 'home'} navigate={navigate} />
          </div>
        )}
      </div>

      {/* Prototype navigator */}
      <ProtoNav navigate={navigate} current={screen} />
    </div>
  )
}
