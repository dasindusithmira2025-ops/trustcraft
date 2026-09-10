import { useCallback, useState, type ReactElement } from 'react'
import { Frame } from '../components/UI'
import { WorkerNav } from './ui'
import { useW } from './store'
import type { WNav, WScreen } from './data'
import {
  HomeScreen, OpportunitiesScreen, RequestScreen, AcceptedScreen,
  JobScreen, ProblemAnalysisScreen, QuoteScreen, QuoteSentScreen, CompleteScreen, DoneScreen,
} from './jobs'
import {
  MessagesScreen, ChatScreen, EarningsScreen, AnalyseScreen,
  ProfileScreen, ServicesScreen, DocumentsScreen, SettingsScreen,
} from './hub'

const SCREENS: Record<WScreen, (p: WNav) => ReactElement> = {
  home: HomeScreen,
  opportunities: OpportunitiesScreen,
  request: RequestScreen,
  accepted: AcceptedScreen,
  job: JobScreen,
  analysis: ProblemAnalysisScreen,
  quote: QuoteScreen,
  'quote-sent': QuoteSentScreen,
  complete: CompleteScreen,
  done: DoneScreen,
  messages: MessagesScreen,
  chat: ChatScreen,
  earnings: EarningsScreen,
  analyse: AnalyseScreen,
  profile: ProfileScreen,
  services: ServicesScreen,
  documents: DocumentsScreen,
  settings: SettingsScreen,
}

const TABS: WScreen[] = ['home', 'messages', 'earnings', 'analyse', 'profile']

/** Screens that paint their own white canvas right up to the status bar. */
const WHITE_TOP: WScreen[] = ['accepted', 'quote-sent', 'done']

function Shell() {
  const { unread } = useW()
  const [stack, setStack] = useState<WScreen[]>(['home'])
  const [key, setKey] = useState(0)

  const screen = stack[stack.length - 1]

  const go = useCallback((to: WScreen) => {
    // Tabs reset the stack; everything else pushes onto it.
    setStack(s => (TABS.includes(to) ? [to] : s[s.length - 1] === to ? s : [...s, to]))
    setKey(k => k + 1)
  }, [])

  const back = useCallback(() => {
    setStack(s => (s.length > 1 ? s.slice(0, -1) : s))
    setKey(k => k + 1)
  }, [])

  const Screen = SCREENS[screen]
  const onTab = TABS.includes(screen)
  const whiteTop = WHITE_TOP.includes(screen)

  return (
    <Frame
      screenKey={key}
      light={!whiteTop}
      topBg={whiteTop ? '#fff' : '#0B1220'}
      bg={onTab ? '#F8FAFC' : '#fff'}
      nav={onTab ? <WorkerNav active={screen} go={go} unread={unread} /> : undefined}
    >
      <Screen go={go} back={back} />
    </Frame>
  )
}

// The provider lives at the app root (src/main.tsx) so the professional's
// draft state survives flipping the role switch mid-demo.
export default function WorkerApp() {
  return <Shell />
}
