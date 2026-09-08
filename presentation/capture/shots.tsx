/**
 * Presentation capture harness — NOT part of the shipped app.
 *
 * Renders exactly one real TrustCraft screen, at real device size, inside the
 * real device Frame, on a transparent page so Playwright can grab a PNG with
 * an alpha channel (rounded corners + soft shadow intact).
 *
 * Every screen, every fixture and every seed below comes from the live
 * application — this file adds no UI of its own. It mirrors the technique
 * already used by src/gallery.tsx to render the UI documentation PDF.
 *
 *   /presentation/capture/shots.html?s=<id>[&y=<scrollPx>]
 */
import { useLayoutEffect, useState, type ReactNode } from 'react'
import ReactDOM from 'react-dom/client'
import '../../src/index.css'
import { BottomNav, Frame } from '../../src/components/UI'
import { DemoProvider, useDemo, type Demo } from '../../src/store'
import {
  HomeScreen as CHome, NotificationsScreen, CameraScreen, ProblemScreen,
} from '../../src/screens/FlowA'
import {
  FindProsScreen, ProProfileScreen, AIAnalysisScreen, RecommendationsScreen, ConfirmationScreen,
} from '../../src/screens/FlowB'
import {
  StatusScreen, AssessmentScreen, QuotationScreen, WorkCompletedScreen, RecordScreen,
} from '../../src/screens/FlowC'
import { CasesScreen } from '../../src/screens/FlowD'
import { WorkerProvider, useW, type WState } from '../../src/worker/store'
import { WorkerNav } from '../../src/worker/ui'
import {
  HomeScreen as WHome, OpportunitiesScreen, RequestScreen, JobScreen, QuoteScreen, DoneScreen,
} from '../../src/worker/jobs'
import { EarningsScreen, AnalyseScreen, DocumentsScreen } from '../../src/worker/hub'

const params = new URLSearchParams(location.search)
const SHOT = params.get('s') ?? 'home'
const SCROLL = Number(params.get('y') ?? 0)
/** Freeze entrance animations at their end state unless a motion shot wants them. */
const LIVE = params.get('live') === '1'

const noop = () => {}

const SHEET = `
html, body { margin:0; padding:0; background: transparent !important; }
#root { display:flex; }
.stage { padding: 150px 150px 200px; display:flex; }
${LIVE ? '' : `
.screen-slide, .fade-up, .fade-up-1, .fade-up-2, .fade-up-3, .fade-up-4,
.fade-in, .scale-in { animation: none !important; opacity: 1 !important; transform: none !important; }
*, *::before, *::after { transition: none !important; }
`}
`

// ── Screen hosts (same seeding contract the gallery uses) ────────────────────

function SeedC({ patch, children }: { patch?: Partial<Demo>; children: ReactNode }) {
  const { set } = useDemo()
  const [ready, setReady] = useState(!patch)
  useLayoutEffect(() => { if (patch) { set(patch); setReady(true) } }, [])
  return ready ? <>{children}</> : null
}

function SeedW({ patch, children }: { patch?: Partial<WState>; children: ReactNode }) {
  const { set } = useW()
  const [ready, setReady] = useState(!patch)
  useLayoutEffect(() => { if (patch) { set(patch); setReady(true) } }, [])
  return ready ? <>{children}</> : null
}

const Scroll = ({ children }: { children: ReactNode }) =>
  SCROLL ? <div style={{ marginTop: -SCROLL }}>{children}</div> : <>{children}</>

const CUST_TABS: Record<string, string> = {
  home: 'home', 'find-pros': 'find-pros', cases: 'cases', messages: 'messages', profile: 'profile',
}

function Cust({ screen, Comp, seed }: { screen: string; Comp: (p: any) => any; seed?: Partial<Demo> }) {
  const tab = CUST_TABS[screen]
  const dark = screen === 'camera'
  return (
    <DemoProvider>
      <SeedC patch={seed}>
        <Frame
          screenKey={0}
          light={dark}
          topBg={dark ? '#020617' : '#fff'}
          bg={dark ? '#020617' : '#fff'}
          nav={tab ? <BottomNav active={tab} navigate={noop} /> : undefined}
        >
          <Scroll><Comp navigate={noop} goBack={noop} /></Scroll>
        </Frame>
      </SeedC>
    </DemoProvider>
  )
}

const W_TABS = ['home', 'messages', 'earnings', 'analyse', 'profile']
const W_WHITE_TOP = ['accepted', 'quote-sent', 'done']

function Work({ screen, Comp, seed }: { screen: string; Comp: (p: any) => any; seed?: Partial<WState> }) {
  const onTab = W_TABS.includes(screen)
  const whiteTop = W_WHITE_TOP.includes(screen)
  return (
    <WorkerProvider>
      <SeedW patch={seed}>
        <Frame
          screenKey={0}
          light={!whiteTop}
          topBg={whiteTop ? '#fff' : '#0B1220'}
          bg={onTab ? '#F8FAFC' : '#fff'}
          nav={onTab ? <WorkerNav active={screen as any} go={noop} unread={2} /> : undefined}
        >
          <Scroll><Comp go={noop} back={noop} /></Scroll>
        </Frame>
      </SeedW>
    </WorkerProvider>
  )
}

// ── Catalogue ────────────────────────────────────────────────────────────────

const ACTIVE_CASE: Partial<Demo> = { proId: 'kasun', step: 3, inspectionPaid: false }

const SHOTS: Record<string, ReactNode> = {
  // Customer — the described-problem journey
  'home': <Cust screen="home" Comp={CHome} />,
  'home-blank': <Cust screen="home" Comp={CHome} seed={{ problem: '' }} />,
  'home-ac': <Cust screen="home" Comp={CHome} seed={{ problem: 'My AC turns on but the room does not get cold.' }} />,
  'home-case': <Cust screen="home" Comp={CHome} seed={ACTIVE_CASE} />,
  'camera': <Cust screen="camera" Comp={CameraScreen} />,
  'problem': <Cust screen="problem" Comp={ProblemScreen} />,
  'problem-voice': <Cust screen="problem" Comp={ProblemScreen} seed={{ problem: 'My bathroom tap has been leaking since yesterday.', voice: true }} />,
  'ai-analysis': <Cust screen="ai-analysis" Comp={AIAnalysisScreen} />,
  'recommendations': <Cust screen="recommendations" Comp={RecommendationsScreen} />,
  'pro-profile': <Cust screen="pro-profile" Comp={ProProfileScreen} />,
  'find-pros': <Cust screen="find-pros" Comp={FindProsScreen} />,
  'confirmation': <Cust screen="confirmation" Comp={ConfirmationScreen} seed={{ proId: 'kasun', step: 1 }} />,
  'status': <Cust screen="status" Comp={StatusScreen} seed={ACTIVE_CASE} />,
  'assessment': <Cust screen="assessment" Comp={AssessmentScreen} seed={{ proId: 'kasun', step: 2 }} />,
  'quotation': <Cust screen="quotation" Comp={QuotationScreen} seed={{ proId: 'kasun', step: 4, inspectionPaid: true }} />,
  'work-completed': <Cust screen="work-completed" Comp={WorkCompletedScreen} seed={{ proId: 'kasun', step: 7, quotationPaid: true }} />,
  'record': (
    <Cust
      screen="record" Comp={RecordScreen}
      seed={{ proId: 'kasun', step: 9, rating: 5, quotationPaid: true, inspectionPaid: true, review: 'Fast, clean work and a fair price.' }}
    />
  ),
  'cases': <Cust screen="cases" Comp={CasesScreen} seed={ACTIVE_CASE} />,
  'notifications': <Cust screen="notifications" Comp={NotificationsScreen} />,

  // Professional — the other side of the marketplace
  'w-home': <Work screen="home" Comp={WHome} />,
  'w-opportunities': <Work screen="opportunities" Comp={OpportunitiesScreen} />,
  'w-request': <Work screen="request" Comp={RequestScreen} />,
  'w-job': <Work screen="job" Comp={JobScreen} />,
  'w-quote': <Work screen="quote" Comp={QuoteScreen} />,
  'w-done': <Work screen="done" Comp={DoneScreen} seed={{ step: 7 }} />,
  'w-earnings': <Work screen="earnings" Comp={EarningsScreen} />,
  'w-analyse': <Work screen="analyse" Comp={AnalyseScreen} />,
  'w-documents': <Work screen="documents" Comp={DocumentsScreen} />,
}

const node = SHOTS[SHOT]

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <style>{SHEET}</style>
    <div className="stage" id="stage">
      {node ?? <p style={{ color: 'red', font: '16px monospace' }}>Unknown shot: {SHOT}</p>}
    </div>
  </>,
)
