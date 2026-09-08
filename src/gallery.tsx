/**
 * Print document generator — not part of the shipped app.
 * Renders every real screen of TrustCraft into an A4-landscape layout that
 * Chromium prints to PDF.  `?mode=wire` re-tints the same render into a
 * high-fidelity greyscale wireframe by overriding the Tailwind theme tokens.
 */
import { useLayoutEffect, useState, type ReactNode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {
  Avatar, BottomNav, Btn, Card, Chip, Frame, Header, Icon, Label, Row, Stars,
  Timeline, Tone, TrustPill,
} from './components/UI'
import { DemoProvider, useDemo, type Demo } from './store'
import { deriveStages } from './flow'
import {
  HomeScreen as CHome, NotificationsScreen, LocationScreen, CameraScreen, ProblemScreen,
} from './screens/FlowA'
import {
  FindProsScreen, ProProfileScreen, AIAnalysisScreen, RecommendationsScreen, ConfirmationScreen,
} from './screens/FlowB'
import {
  StatusScreen, AssessmentScreen, SetInspectionScreen, InspectionPaymentScreen,
  QuotationScreen, QuotationPaymentScreen, WorkCompletedScreen, ReviewScreen, RecordScreen,
} from './screens/FlowC'
import {
  CasesScreen, MessagesScreen, ChatScreen, ProfileScreen, ProfileOverviewScreen,
} from './screens/FlowD'
import { WorkerProvider, useW, type WState } from './worker/store'
import { WorkerNav } from './worker/ui'
import {
  HomeScreen as WHome, OpportunitiesScreen, RequestScreen, AcceptedScreen,
  JobScreen, QuoteScreen, QuoteSentScreen, CompleteScreen, DoneScreen,
} from './worker/jobs'
import {
  MessagesScreen as WMessages, ChatScreen as WChat, EarningsScreen, AnalyseScreen,
  ProfileScreen as WProfile, ServicesScreen, DocumentsScreen, SettingsScreen,
} from './worker/hub'

const MODE = new URLSearchParams(location.search).get('mode') === 'wire' ? 'wire' : 'design'
const WIRE = MODE === 'wire'
const noop = () => {}

// ── Print stylesheet ─────────────────────────────────────────────────────────

const SHEET = `
@page { size: 1122px 791px; margin: 0; }
html, body { background: #fff; }

.page {
  position: relative;
  width: 1122px; height: 791px;
  overflow: hidden;
  background: #fff;
  break-after: page;
  page-break-after: always;
}
.page:last-child { break-after: auto; page-break-after: auto; }

/* Nothing animates in a PDF — freeze every entrance animation at its end state. */
.screen-slide, .fade-up, .fade-up-1, .fade-up-2, .fade-up-3, .fade-up-4,
.fade-in, .scale-in, .soft-pulse, .ring-spin, .dot-glow, .wave-bar, .shimmer {
  animation: none !important;
}
*, *::before, *::after { transition: none !important; }

/* The greyscale wireframe: retint the design tokens, desaturate the few
   inline gradients (avatars, photo stand-ins, hero panels). */
.wire {
  --color-brand-900:#0F172A; --color-brand-800:#1E293B; --color-brand-700:#334155;
  --color-brand-600:#475569; --color-brand-500:#64748B; --color-brand-200:#CBD5E1;
  --color-brand-100:#E2E8F0; --color-brand-50:#F1F5F9;
  --color-success-700:#334155; --color-success-600:#64748B; --color-success-100:#E2E8F0;
  --color-warning-700:#475569; --color-warning-600:#94A3B8; --color-warning-100:#EDF1F5;
  --color-danger-700:#334155;  --color-danger-600:#64748B;  --color-danger-100:#E9EDF2;
  --color-gold-500:#94A3B8;
}
.phone > div { box-shadow: 0 0 0 1px #D7DEE7, 0 16px 34px -22px rgba(15,23,42,.55) !important; }
/* React writes inline colours through CSSOM, so hsl() lands in the attribute as
   rgb() — match both that and the gradient stand-ins. */
.wire [style*="gradient"], .wire [style*="rgb("] { filter: grayscale(1) contrast(0.92); }
`

// ── Page chrome ──────────────────────────────────────────────────────────────

let pageNo = 0

function Page({
  eyebrow, title, note, children, plain,
}: { eyebrow?: string; title?: string; note?: string; children: ReactNode; plain?: boolean }) {
  pageNo += 1
  const n = pageNo
  return (
    <section className="page">
      {!plain && (
        <div className="absolute left-[40px] right-[40px] top-[34px] flex items-end justify-between">
          <div>
            {eyebrow && (
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-ink-400">{eyebrow}</p>
            )}
            <h2 className="text-[21px] font-bold text-ink-900 tracking-[-0.02em] mt-1">{title}</h2>
            {note && <p className="text-[11.5px] text-ink-500 mt-1 max-w-[760px] leading-relaxed">{note}</p>}
          </div>
          <div className="flex items-center gap-2 pb-1">
            <span className="text-ink-300"><Icon name="shield" size={14} /></span>
            <span className="text-[10.5px] font-semibold text-ink-400 tracking-tight">
              TrustCraft · {WIRE ? 'Wireframe' : 'UI Design'}
            </span>
          </div>
        </div>
      )}
      {children}
      {!plain && (
        <>
          <div className="absolute left-[40px] right-[40px] bottom-[30px] h-px bg-ink-100" />
          <p className="absolute right-[40px] bottom-[13px] text-[10px] font-semibold text-ink-400 tabular-nums">
            {String(n).padStart(2, '0')}
          </p>
          <p className="absolute left-[40px] bottom-[13px] text-[10px] text-ink-300">
            TrustCraft — verified home-service marketplace · 2026
          </p>
        </>
      )}
    </section>
  )
}

// ── Phone tile ───────────────────────────────────────────────────────────────

const SCALE = 0.58
const TILE_W = Math.round(390 * SCALE)
const TILE_H = Math.round(844 * SCALE)

function Tile({ id, name, purpose, parts, children }: {
  id: string; name: string; purpose: string; parts: string; children: ReactNode
}) {
  return (
    <div style={{ width: TILE_W }} className="flex flex-col">
      <div style={{ width: TILE_W, height: TILE_H }}>
        <div className="phone" style={{ zoom: SCALE }}>{children}</div>
      </div>
      <div className="mt-3.5 flex items-baseline gap-1.5">
        <span className="text-[9.5px] font-bold text-white bg-ink-900 rounded px-1.5 py-[2px] tabular-nums flex-shrink-0">
          {id}
        </span>
        <p className="text-[12.5px] font-bold text-ink-900 tracking-[-0.01em] leading-tight">{name}</p>
      </div>
      <p className="text-[10.5px] text-ink-600 leading-[1.45] mt-1">{purpose}</p>
      <p className="text-[9.5px] text-ink-400 leading-[1.45] mt-[3px]">{parts}</p>
    </div>
  )
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="absolute left-[40px] right-[40px] top-[130px] flex justify-between">{children}</div>
}

// ── Screen hosts ─────────────────────────────────────────────────────────────

/* Screens read the store when they mount (several seed local state from it), so
   the patch has to land before the screen renders — not alongside it. */
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

const Sc = ({ y, children }: { y?: number; children: ReactNode }) =>
  y ? <div style={{ marginTop: -y }}>{children}</div> : <>{children}</>

const CUST_TABS: Record<string, string> = {
  home: 'home', 'find-pros': 'find-pros', cases: 'cases', messages: 'messages', profile: 'profile',
}

function CustomerShot({
  screen, Comp, seed, y,
}: { screen: string; Comp: (p: any) => any; seed?: Partial<Demo>; y?: number }) {
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
          <Sc y={y}><Comp navigate={noop} goBack={noop} /></Sc>
        </Frame>
      </SeedC>
    </DemoProvider>
  )
}

const W_TABS = ['home', 'messages', 'earnings', 'analyse', 'profile']
const W_WHITE_TOP = ['accepted', 'quote-sent', 'done']

function WorkerShot({
  screen, Comp, seed, y,
}: { screen: string; Comp: (p: any) => any; seed?: Partial<WState>; y?: number }) {
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
          <Sc y={y}><Comp go={noop} back={noop} /></Sc>
        </Frame>
      </SeedW>
    </WorkerProvider>
  )
}

// ── Screen catalogue ─────────────────────────────────────────────────────────

interface Entry { name: string; purpose: string; parts: string; node: ReactNode }

const tag = (prefix: string, i: number) => `${prefix}-${String(i + 1).padStart(2, '0')}`

const ACTIVE_CASE: Partial<Demo> = { proId: 'kasun', step: 3, inspectionPaid: false }

const CUSTOMER: Entry[] = [
  {
    name: 'Home',
    purpose: 'Entry point. The problem box is the primary action — type, attach media, set the area, continue.',
    parts: 'App bar · problem textarea (500 char) · photo/video/voice/location row · location line · pro search · My Cases list · tab bar',
    node: <CustomerShot screen="home" Comp={CHome} seed={ACTIVE_CASE} />,
  },
  {
    name: 'Notifications',
    purpose: 'One feed for assessments, inspections, quotations, payments and review nudges. Each row deep-links to its stage.',
    parts: 'Back header · clear-all action · typed icon tiles · title + timestamp rows · empty state',
    node: <CustomerShot screen="notifications" Comp={NotificationsScreen} />,
  },
  {
    name: 'Select Location',
    purpose: 'Sets the service area used to match nearby professionals. Current area is preselected.',
    parts: 'Search field · Current Location group · Popular Areas list · radio selection · sticky Confirm button',
    node: <CustomerShot screen="location" Comp={LocationScreen} />,
  },
  {
    name: 'Camera / Media Capture',
    purpose: 'Full-bleed dark capture surface for evidence photos and video of the problem.',
    parts: 'Dark chrome · Photo/Video segmented control · framed viewfinder · gallery, shutter and flip controls',
    node: <CustomerShot screen="camera" Comp={CameraScreen} />,
  },
  {
    name: 'Problem Definition',
    purpose: 'Review of the whole request before dispatch, with an inline edit mode and the fork to AI or manual search.',
    parts: 'Problem card · location row · media grid · voice-note waveform · submitted-on · two next-step cards',
    node: <CustomerShot screen="problem" Comp={ProblemScreen} />,
  },
  {
    name: 'Find Professionals',
    purpose: 'Manual discovery: sort by distance, rating or fee, then narrow by trade category.',
    parts: 'Search field · sort chips · 8 category tiles · professional cards with trust pill, rating, distance, fee',
    node: <CustomerShot screen="find-pros" Comp={FindProsScreen} />,
  },
  {
    name: 'Professional Profile',
    purpose: 'The trust surface — verification badge, trust score, experience, services and recent reviews.',
    parts: 'Avatar + verified badge · Trust Score /100 · stat row · About · service chips · review list · Message / Select dock',
    node: <CustomerShot screen="pro-profile" Comp={ProProfileScreen} />,
  },
  {
    name: 'AI Analysis',
    purpose: 'Progress state while the request is parsed and matched. Auto-advances to the ranked results.',
    parts: 'Spinner ring · four-step checklist with live status · reassurance copy',
    node: <CustomerShot screen="ai-analysis" Comp={AIAnalysisScreen} />,
  },
  {
    name: 'Recommended Professionals',
    purpose: 'Ranked AI matches with an explicit match percentage so the ordering is explainable.',
    parts: 'Recommended tag · match % dial · trust, rating and distance meta · View Profile / Select actions',
    node: <CustomerShot screen="recommendations" Comp={RecommendationsScreen} />,
  },
  {
    name: 'Request Confirmation',
    purpose: 'Confirms the pairing of request and professional and hands over to case tracking.',
    parts: 'Success mark · selected pro card · request recap · location · timestamp · Message / Continue dock',
    node: <CustomerShot screen="confirmation" Comp={ConfirmationScreen} seed={{ proId: 'kasun', step: 1 }} />,
  },
  {
    name: 'Problem Status',
    purpose: 'The spine of the product: a nine-stage timeline plus the single next action for the current stage.',
    parts: 'Case card · Timeline (done / current / pending) · contextual CTA card · View Details · Message pill',
    node: <CustomerShot screen="status" Comp={StatusScreen} seed={ACTIVE_CASE} />,
  },
  {
    name: 'Problem Assessment',
    purpose: 'The professional’s written diagnosis, with the inspection fee and three ways to respond.',
    parts: 'Pro row · assessment body · inspection fee card · Agree / Skip / Message actions',
    node: <CustomerShot screen="assessment" Comp={AssessmentScreen} seed={{ proId: 'kasun', step: 2 }} />,
  },
  {
    name: 'Set Inspection',
    purpose: 'Date and time selection for the on-site visit, priced up front.',
    parts: 'Fee strip · date carousel · time-slot grid · service address · Continue to Payment',
    node: <CustomerShot screen="set-inspection" Comp={SetInspectionScreen} seed={{ proId: 'kasun', step: 3 }} />,
  },
  {
    name: 'Inspection Payment',
    purpose: 'Pays the one-time visit charge that unlocks the inspection.',
    parts: 'Amount summary · line items · payment-method selector · total bar · Pay Now with processing state',
    node: <CustomerShot screen="inspection-payment" Comp={InspectionPaymentScreen} seed={{ proId: 'kasun', step: 3 }} />,
  },
  {
    name: 'Quotation',
    purpose: 'Itemised price the customer agrees to — every line is visible before any money moves.',
    parts: 'From card · problem recap · item table (item, qty, price, total) · duration, warranty, validity · Agree dock',
    node: <CustomerShot screen="quotation" Comp={QuotationScreen} seed={{ proId: 'kasun', step: 4, inspectionPaid: true }} />,
  },
  {
    name: 'Quotation Payment',
    purpose: 'Releases the service payment; funds are held until the work is confirmed complete.',
    parts: 'Service payment header · quotation total · fee breakdown · method selector · Pay Now',
    node: <CustomerShot screen="quotation-payment" Comp={QuotationPaymentScreen} seed={{ proId: 'kasun', step: 5, inspectionPaid: true }} />,
  },
  {
    name: 'Work Completed',
    purpose: 'The evidence the professional submitted: what was done, before/after photos, notes.',
    parts: 'Pro row · work-done summary · before / after photo pair · notes · completed-on · Confirm Completion',
    node: <CustomerShot screen="work-completed" Comp={WorkCompletedScreen} seed={{ proId: 'kasun', step: 7, quotationPaid: true }} />,
  },
  {
    name: 'Review & Rate',
    purpose: 'Feeds the trust score. Star rating plus optional written feedback closes the case.',
    parts: 'Pro summary · 5-star input · comment field · submit action',
    node: <CustomerShot screen="review" Comp={ReviewScreen} seed={{ proId: 'kasun', step: 8, rating: 5, quotationPaid: true }} />,
  },
  {
    name: 'Service Record',
    purpose: 'The permanent, downloadable record of a finished job — the artefact that makes history auditable.',
    parts: 'Download action · job header · stage log · totals paid · your rating · Book Again',
    node: (
      <CustomerShot
        screen="record" Comp={RecordScreen}
        seed={{ proId: 'kasun', step: 9, rating: 5, quotationPaid: true, inspectionPaid: true, review: 'Fast, clean work and a fair price.' }}
      />
    ),
  },
  {
    name: 'My Cases (tab)',
    purpose: 'Every request the customer has raised, split into in-progress and completed.',
    parts: 'Filter chips · date-grouped cards · state tone tags · filter action',
    node: <CustomerShot screen="cases" Comp={CasesScreen} seed={ACTIVE_CASE} />,
  },
  {
    name: 'Messages (tab)',
    purpose: 'Thread list per professional plus support, with unread counts.',
    parts: 'Thread rows with avatar, last message, time · unread badge · compose action',
    node: <CustomerShot screen="messages" Comp={MessagesScreen} />,
  },
  {
    name: 'Chat',
    purpose: 'One-to-one conversation tied to the case, reachable from every stage of the flow.',
    parts: 'Contact header with online state · day divider · bubble pairs · composer with send',
    node: <CustomerShot screen="chat" Comp={ChatScreen} />,
  },
  {
    name: 'Profile (tab)',
    purpose: 'Account home: identity, spending overview entry, personal details and app settings.',
    parts: 'Avatar header · Overview card · personal information rows · app rows · reset demo data',
    node: <CustomerShot screen="profile" Comp={ProfileScreen} />,
  },
  {
    name: 'Spending Overview',
    purpose: 'Six-month spend chart with services used, so repeat value is visible.',
    parts: 'Monthly bar chart · money spent / services used stats · recent services list',
    node: <CustomerShot screen="profile-overview" Comp={ProfileOverviewScreen} />,
  },
]

const WORKER_SCREENS: Entry[] = [
  {
    name: 'Home',
    purpose: 'Shift dashboard: online toggle, the active job and the one action it needs next.',
    parts: 'Dark hero app bar · greeting · online switch · active job card with stage progress · alert bell',
    node: <WorkerShot screen="home" Comp={WHome} />,
  },
  {
    name: 'Home — queue & earnings',
    purpose: 'Scrolled: the opportunity queue and this month’s money sit directly under the active job.',
    parts: 'New opportunities list · trade and urgency tags · available balance · earned this month · tab bar',
    node: <WorkerShot screen="home" Comp={WHome} y={430} />,
  },
  {
    name: 'New Opportunities',
    purpose: 'The inbound queue of matched requests, newest first, with urgency and indicative budget on the card.',
    parts: 'Back header · trade tag · URGENT tag · summary · customer, area, distance meta · budget',
    node: <WorkerShot screen="opportunities" Comp={OpportunitiesScreen} />,
  },
  {
    name: 'Service Request',
    purpose: 'Everything needed to decide before accepting: the customer’s own words and the platform’s read of them.',
    parts: 'Title + tags · customer strip · verbatim problem · TrustCraft read panel · Reject / Accept dock',
    node: <WorkerShot screen="request" Comp={RequestScreen} />,
  },
  {
    name: 'Service Request — evidence',
    purpose: 'Scrolled: the photos the customer sent, the location, and the window they expect.',
    parts: 'Photo grid · location card · preferred window · customer expectation · sticky action dock',
    node: <WorkerShot screen="request" Comp={RequestScreen} y={430} />,
  },
  {
    name: 'Opportunity Accepted',
    purpose: 'Commitment confirmation that sets expectations for the next three steps.',
    parts: 'Success mark · job title · What happens next list · Continue to Job Progress',
    node: <WorkerShot screen="accepted" Comp={AcceptedScreen} seed={{ step: 0 }} />,
  },
  {
    name: 'Job Progress',
    purpose: 'Mirror of the customer timeline from the professional’s side — seven stages, one action at a time.',
    parts: 'Job id + customer strip · message button · step rail with stage hint · escrow badge · action dock',
    node: <WorkerShot screen="job" Comp={JobScreen} />,
  },
  {
    name: 'Create Quotation',
    purpose: 'Line-by-line pricing. Quantity steppers and prices roll up into subtotal, platform fee and payout.',
    parts: 'Editable item rows · qty stepper · price field · add / remove item · empty-total validation',
    node: <WorkerShot screen="quote" Comp={QuoteScreen} />,
  },
  {
    name: 'Quotation — totals',
    purpose: 'Foot of the builder: time on site, warranty, and what the customer pays against what the pro receives.',
    parts: 'Duration chips · warranty chips · customer pays / TrustCraft fee 8% / you receive · Send Quotation',
    node: <WorkerShot screen="quote" Comp={QuoteScreen} y={620} />,
  },
  {
    name: 'Quotation Sent',
    purpose: 'Hand-off state while the ball is in the customer’s court, with the quote restated in full.',
    parts: 'Success mark · quoted total · line recap · escrow explainer · Back to Job Progress',
    node: <WorkerShot screen="quote-sent" Comp={QuoteSentScreen} seed={{ quoteSent: true, step: 4 }} />,
  },
  {
    name: 'Work Completed',
    purpose: 'Evidence gate: a written summary, at least two photos and a self-check list before completion can be sent.',
    parts: 'Summary field with validation hint · 6-slot evidence grid · pre-submit checklist · disabled-until-ready Submit',
    node: (
      <WorkerShot
        screen="complete" Comp={CompleteScreen}
        seed={{ step: 5, evidence: 3, checks: ['clean', 'walk'], summary: 'Replaced the corroded angle valve and both washers under the sink, resealed the connector and tested for 20 minutes with no drip.' }}
      />
    ),
  },
  {
    name: 'Job Summary',
    purpose: 'Close-out: payout releasing to balance and the trust evidence this job adds to the profile.',
    parts: 'Done headline · payout panel · evidence note · Back to Home · View earnings',
    node: <WorkerShot screen="done" Comp={DoneScreen} seed={{ step: 7 }} />,
  },
  {
    name: 'Messages (tab)',
    purpose: 'Customer threads for live and past jobs, tied to the service record.',
    parts: 'Thread rows · unread badges · job context line',
    node: <WorkerShot screen="messages" Comp={WMessages} />,
  },
  {
    name: 'Chat',
    purpose: 'Conversation with the customer, retained as part of the record.',
    parts: 'Contact header · retention notice · message bubbles · composer',
    node: <WorkerShot screen="chat" Comp={WChat} />,
  },
  {
    name: 'Earnings (tab)',
    purpose: 'Money view: available balance, six-month trend and a transaction ledger.',
    parts: 'Dark balance panel · payout action · six-month bar chart · ledger rows',
    node: <WorkerShot screen="earnings" Comp={EarningsScreen} />,
  },
  {
    name: 'Analyse (tab)',
    purpose: 'Trust score with the factors behind it — the feedback loop that drives professional behaviour.',
    parts: 'Trust dial · score drivers with meters · jobs completed chart · work-source breakdown',
    node: <WorkerShot screen="analyse" Comp={AnalyseScreen} />,
  },
  {
    name: 'Profile (tab)',
    purpose: 'Professional identity and the four account areas: services, documents, payouts, settings.',
    parts: 'Dark identity header · rating, jobs, trust stats · menu rows with hints',
    node: <WorkerShot screen="profile" Comp={WProfile} />,
  },
  {
    name: 'My Services',
    purpose: 'The trades this professional may take work in — each one has to be backed by proof.',
    parts: 'Trade rows with status · add-trade notice · evidence requirement callout',
    node: <WorkerShot screen="services" Comp={ServicesScreen} />,
  },
  {
    name: 'Verification Documents',
    purpose: 'Proof of trade: verification strength, per-document status and expiry warnings.',
    parts: 'Strength meter · document rows with Verified / expiring tags · Upload a document',
    node: <WorkerShot screen="documents" Comp={DocumentsScreen} />,
  },
  {
    name: 'Settings',
    purpose: 'Alerting and coverage rules that decide which opportunities reach this professional.',
    parts: 'Notification switches · auto-decline radius · weekly digest · account rows',
    node: <WorkerShot screen="settings" Comp={SettingsScreen} />,
  },
]

// ── Foundations content ──────────────────────────────────────────────────────

const RAMPS: { name: string; note: string; stops: { t: string; hex: string }[] }[] = [
  {
    name: 'Brand', note: 'Trust, primary actions, active navigation',
    stops: [
      { t: '900', hex: '#1E3A8A' }, { t: '800', hex: '#1E40AF' }, { t: '700', hex: '#1D4ED8' },
      { t: '600', hex: '#2563EB' }, { t: '500', hex: '#3B82F6' }, { t: '200', hex: '#BFDBFE' },
      { t: '100', hex: '#DBEAFE' }, { t: '50', hex: '#EFF6FF' },
    ],
  },
  {
    name: 'Ink', note: 'Type, surfaces, borders, dark chrome',
    stops: [
      { t: '950', hex: '#020617' }, { t: '900', hex: '#0F172A' }, { t: '800', hex: '#1E293B' },
      { t: '700', hex: '#334155' }, { t: '500', hex: '#64748B' }, { t: '400', hex: '#94A3B8' },
      { t: '300', hex: '#CBD5E1' }, { t: '200', hex: '#E2E8F0' }, { t: '100', hex: '#F1F5F9' },
      { t: '50', hex: '#F8FAFC' },
    ],
  },
  {
    name: 'Success', note: 'Completed stages, verification, escrow',
    stops: [{ t: '700', hex: '#15803D' }, { t: '600', hex: '#16A34A' }, { t: '100', hex: '#DCFCE7' }],
  },
  {
    name: 'Warning', note: 'Scheduled, awaiting customer, expiring',
    stops: [{ t: '700', hex: '#B45309' }, { t: '600', hex: '#F59E0B' }, { t: '100', hex: '#FEF3C7' }],
  },
  {
    name: 'Danger', note: 'Reject, destructive, unread dot',
    stops: [{ t: '700', hex: '#B91C1C' }, { t: '600', hex: '#DC2626' }, { t: '100', hex: '#FEE2E2' }],
  },
  { name: 'Gold', note: 'Rating stars only', stops: [{ t: '500', hex: '#F59E0B' }] },
]

const TYPE_SCALE = [
  { px: '25 / 24', w: 'Bold', use: 'Screen hero — worker home greeting, job titles', cls: 'text-[25px] font-bold tracking-[-0.03em]' },
  { px: '22 / 20', w: 'Bold', use: 'Page title, trust score, section hero', cls: 'text-[21px] font-bold tracking-[-0.02em]' },
  { px: '17 / 16', w: 'Semibold', use: 'App bar title, card headline', cls: 'text-[16px] font-semibold' },
  { px: '15', w: 'Semibold', use: 'Primary button, group label', cls: 'text-[15px] font-semibold' },
  { px: '14', w: 'Regular / Semibold', use: 'Body copy, list rows, form values', cls: 'text-[14px]' },
  { px: '12–13', w: 'Regular', use: 'Secondary meta, hints, timestamps', cls: 'text-[12.5px] text-ink-500' },
  { px: '11', w: 'Semibold caps', use: 'Field labels, tags, tab labels', cls: 'text-[11px] font-semibold uppercase tracking-wide text-ink-500' },
]

const ICONS = [
  'shield', 'home', 'search', 'cases', 'chat', 'user', 'bell', 'pin', 'camera', 'video', 'mic',
  'calendar', 'clock', 'card', 'wallet', 'doc', 'id', 'chart', 'star', 'check', 'x', 'plus',
  'minus', 'edit', 'filter', 'image', 'share', 'download', 'upload', 'send', 'play', 'sparkle',
  'wrench', 'phone', 'mail', 'info', 'warn', 'flip', 'more', 'logout', 'back', 'next',
]

const STAGE_ROW = deriveStages(3, false)

// ── Pages ────────────────────────────────────────────────────────────────────

function Cover() {
  return (
    <Page plain>
      <div
        className="w-full h-full relative text-white px-[74px] flex flex-col justify-center"
        style={{ background: 'radial-gradient(120% 120% at 50% 0%, #1E293B 0%, #0B1220 60%, #060A12 100%)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-brand-600 rounded-2xl flex items-center justify-center text-white">
            <Icon name="shield" size={24} />
          </div>
          <span className="text-[26px] font-bold tracking-tight">TrustCraft</span>
        </div>

        <h1 className="text-[62px] font-bold tracking-[-0.035em] leading-[1.02] mt-10 max-w-[820px]">
          {WIRE ? 'High-Fidelity UI Wireframes' : 'High-Fidelity UI Design'}
        </h1>
        <p className="text-[16px] text-white/60 mt-5 max-w-[640px] leading-relaxed">
          {WIRE
            ? 'Structure, hierarchy and content of every screen in the product, rendered from the live application and stripped to a neutral greyscale so layout can be reviewed without colour.'
            : 'The complete screen inventory of the TrustCraft mobile application — customer and professional — captured at full fidelity directly from the live React application.'}
        </p>

        <div className="mt-14 flex gap-14">
          {[
            [String(CUSTOMER.length + WORKER_SCREENS.length), 'Screen views documented'],
            ['2', 'Role-based applications'],
            ['390 × 844', 'Design frame (pt)'],
            ['Inter', 'Type family'],
          ].map(([v, l]) => (
            <div key={l}>
              <p className="text-[27px] font-bold tracking-[-0.02em]">{v}</p>
              <p className="text-[11px] text-white/45 font-medium mt-1 tracking-wide">{l}</p>
            </div>
          ))}
        </div>

        <div className="absolute left-[74px] bottom-[56px] flex items-center gap-8 text-[11.5px] text-white/35">
          <span>Verified home-service marketplace</span>
          <span>Colombo, Sri Lanka</span>
          <span>Version 1.0 · 2026</span>
        </div>
      </div>
    </Page>
  )
}

function Contents() {
  const Col = ({ title, sub, items, tint, prefix }: { title: string; sub: string; items: Entry[]; tint: string; prefix: string }) => (
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: tint }} />
        <p className="text-[13.5px] font-bold text-ink-900">{title}</p>
      </div>
      <p className="text-[10.5px] text-ink-500 mt-1 mb-3 leading-relaxed">{sub}</p>
      <div className="grid grid-cols-2 gap-x-7">
        {items.map((e, i) => (
          <div key={e.name} className="flex gap-2 py-[5px] border-b border-ink-100">
            <span className="text-[9.5px] font-bold text-ink-400 tabular-nums w-[30px] flex-shrink-0 pt-[2px]">{tag(prefix, i)}</span>
            <span className="text-[11px] text-ink-800 leading-snug">{e.name}</span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Page
      eyebrow="Section 01" title="Contents & Information Architecture"
      note="TrustCraft runs two role-based applications on one design system. The customer raises a problem and follows it to completion; the professional receives it, prices it and proves the work."
    >
      <div className="absolute left-[40px] right-[40px] top-[150px] flex gap-[46px]">
        <Col prefix="C" title={`Customer application — ${CUSTOMER.length} views`} sub="Raise a problem, choose a verified professional, follow the case, pay, review." items={CUSTOMER} tint="#2563EB" />
        <Col prefix="P" title={`Professional application — ${WORKER_SCREENS.length} views`} sub="Take the job, price it line by line, prove the work, get paid." items={WORKER_SCREENS} tint="#0F172A" />
      </div>

      <div className="absolute left-[40px] right-[40px] top-[556px]">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-ink-400 mb-3">The nine-stage case lifecycle</p>
        <div className="flex items-stretch gap-1.5">
          {STAGE_ROW.map((s, i) => (
            <div
              key={s.key}
              className={`flex-1 rounded-lg px-3 py-2.5 border ${
                s.status === 'done'
                  ? 'bg-success-100 border-success-100'
                  : s.status === 'current'
                  ? 'bg-brand-50 border-brand-200'
                  : 'bg-ink-50 border-ink-100'
              }`}
            >
              <p className="text-[9px] font-bold text-ink-400 tabular-nums">{String(i + 1).padStart(2, '0')}</p>
              <p className={`text-[11px] font-semibold leading-tight mt-1 ${s.status === 'pending' ? 'text-ink-400' : 'text-ink-900'}`}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
        <p className="text-[10.5px] text-ink-500 mt-3 leading-relaxed">
          Both applications render this lifecycle from the same pure state machine, so the customer timeline and the
          professional step rail can never disagree. Money is held after the quotation is approved and released only
          once completion evidence is submitted and confirmed.
        </p>
      </div>
    </Page>
  )
}

function Foundations() {
  return (
    <Page
      eyebrow="Section 02" title="Foundations — Colour & Type"
      note="One neutral ink ramp carries structure; a single blue carries trust and action. Semantic colour is reserved for state, never decoration."
    >
      <div className="absolute left-[40px] top-[142px] w-[560px]">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-ink-400 mb-3">Colour tokens</p>
        {RAMPS.map(r => (
          <div key={r.name} className="mb-3.5">
            <div className="flex items-baseline gap-2">
              <p className="text-[11.5px] font-bold text-ink-900">{r.name}</p>
              <p className="text-[10px] text-ink-400">{r.note}</p>
            </div>
            <div className="flex gap-1.5 mt-1.5">
              {r.stops.map(s => (
                <div key={s.t} className="w-[52px]">
                  <div className="h-[34px] rounded-md border border-ink-200/60" style={{ background: s.hex }} />
                  <p className="text-[8.5px] font-semibold text-ink-500 mt-1 tabular-nums">{s.t}</p>
                  <p className="text-[8px] text-ink-300 tabular-nums">{s.hex}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute left-[636px] right-[40px] top-[142px]">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-ink-400 mb-3">
          Type scale — Inter, optical sizing 14–32
        </p>
        {TYPE_SCALE.map(t => (
          <div key={t.px} className="flex items-center gap-4 py-[6px] border-b border-ink-100">
            <div className="w-[64px] flex-shrink-0">
              <p className="text-[10.5px] font-bold text-ink-900 tabular-nums">{t.px}</p>
              <p className="text-[8.5px] text-ink-400">{t.w}</p>
            </div>
            <p className={`${t.cls} text-ink-900 flex-shrink-0`}>Aa</p>
            <p className="text-[10px] text-ink-500 leading-snug">{t.use}</p>
          </div>
        ))}

        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-ink-400 mt-5 mb-2.5">Radius, spacing & elevation</p>
        <div className="flex gap-2.5">
          {[
            ['44', 'Device', 44], ['16', 'Card', 16], ['12', 'Button', 12], ['8', 'Tag', 8], ['999', 'Pill', 32],
          ].map(([r, l, v]) => (
            <div key={l as string} className="flex-1">
              <div className="h-[58px] bg-ink-100 border border-ink-200" style={{ borderRadius: v as number }} />
              <p className="text-[9px] font-semibold text-ink-600 mt-1">{r}px</p>
              <p className="text-[8.5px] text-ink-400">{l}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2.5 mt-4">
          {[
            ['Flat', 'none', 'Lists, dividers, inputs'],
            ['Lift', '0 8px 24px -14px rgba(15,23,42,.55)', 'Card hover, opportunity card'],
            ['Device', '0 18px 44px -10px rgba(15,23,42,.42)', 'Phone frame, modals'],
          ].map(([l, sh, use]) => (
            <div key={l} className="flex-1">
              <div className="rounded-xl bg-white border border-ink-200/70 h-[40px]" style={{ boxShadow: sh }} />
              <p className="text-[9px] font-semibold text-ink-600 mt-2">{l}</p>
              <p className="text-[8.5px] text-ink-400 leading-snug">{use}</p>
            </div>
          ))}
        </div>
        <p className="text-[9.5px] text-ink-400 mt-3">
          Spacing steps on a 4px grid; the screen gutter is 20px and cards sit 12–16px apart.
        </p>
      </div>
    </Page>
  )
}

function Components() {
  const Box = ({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) => (
    <div className={className}>
      <p className="text-[9.5px] font-bold tracking-[0.14em] uppercase text-ink-400 mb-2">{label}</p>
      {children}
    </div>
  )

  return (
    <Page
      eyebrow="Section 03" title="Component Library"
      note="Every component below is the live component used by the application — the same code that renders the screens on the following pages."
    >
      <div className="absolute left-[40px] right-[40px] top-[142px] flex gap-[34px]">
        <div className="w-[236px] space-y-5">
          <Box label="Buttons">
            <div className="space-y-2">
              <Btn>Primary action</Btn>
              <Btn variant="secondary" icon="chat">Secondary</Btn>
              <Btn variant="ghost" icon="doc">Ghost</Btn>
              <Btn variant="dark">Dark</Btn>
              <div className="flex gap-2">
                <Btn size="sm" full={false}>Small</Btn>
                <Btn size="sm" full={false} variant="secondary">View</Btn>
                <Btn size="sm" full={false} disabled>Disabled</Btn>
              </div>
            </div>
          </Box>

          <Box label="Chips & tags">
            <div className="flex flex-wrap gap-1.5">
              <Chip active icon="pin">Nearest</Chip>
              <Chip icon="star">Top rated</Chip>
              <Chip icon="wallet">Lowest fee</Chip>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Tone tone="brand">Active</Tone>
              <Tone tone="success">Verified</Tone>
              <Tone tone="warning">Inspection done</Tone>
              <Tone tone="muted">Completed</Tone>
            </div>
          </Box>

          <Box label="Trust & rating">
            <div className="flex items-center gap-3">
              <TrustPill score={94} />
              <Stars value={4.9} size={15} />
              <span className="text-[11px] text-ink-500">4.9 · 126</span>
            </div>
            <div className="mt-2"><TrustPill score={94} size="lg" /></div>
          </Box>
        </div>

        <div className="w-[236px] space-y-5">
          <Box label="Avatars">
            <div className="flex items-end gap-3">
              <Avatar name="Kasun Perera" hue={212} size={52} badge />
              <Avatar name="Nimal Fernando" hue={160} size={44} />
              <Avatar name="Ruwan Silva" hue={24} size={34} />
              <Avatar name="Ishara J" hue={190} size={28} />
            </div>
          </Box>

          <Box label="Card & list rows">
            <Card className="p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                <Icon name="wrench" size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-ink-900 truncate">Kitchen Sink Leak</p>
                <p className="text-[12px] text-ink-500 truncate">Inspection</p>
              </div>
              <Tone tone="brand">Active</Tone>
            </Card>
            <div className="mt-2 rounded-2xl border border-ink-200 divide-y divide-ink-100">
              <Row icon="phone" label="Contact" value="071 123 4567" />
              <Row icon="mail" label="Email" onClick={noop} />
              <Row icon="logout" label="Log out" danger />
            </div>
          </Box>

          <Box label="Field label & app bar">
            <Label>Payment Method</Label>
            <div className="mt-2 border border-ink-200 rounded-xl overflow-hidden">
              <Header title="Quotation" onBack={noop} right={<span className="text-ink-400"><Icon name="download" size={17} /></span>} />
            </div>
          </Box>
        </div>

        <div className="w-[236px] space-y-5">
          <Box label="Case timeline">
            <Card className="p-3.5">
              <Timeline stages={STAGE_ROW.slice(0, 5)} onOpen={noop} />
            </Card>
          </Box>

          <Box label="Bottom navigation">
            <div className="border border-ink-200 rounded-xl overflow-hidden">
              <BottomNav active="home" navigate={noop} />
            </div>
            <div className="border border-ink-200 rounded-xl overflow-hidden mt-2">
              <WorkerNav active="earnings" go={noop} unread={2} />
            </div>
          </Box>
        </div>

        <div className="flex-1">
          <Box label="Iconography — one 24px stroke set, 1.7px, currentColor">
            <div className="grid grid-cols-6 gap-y-3 gap-x-1">
              {ICONS.map(n => (
                <div key={n} className="flex flex-col items-center gap-1">
                  <span className="text-ink-700"><Icon name={n} size={19} /></span>
                  <span className="text-[7.5px] text-ink-400 leading-none">{n}</span>
                </div>
              ))}
            </div>
          </Box>
          <p className="text-[9.5px] text-ink-400 leading-relaxed mt-4">
            No icon dependency: all 42 glyphs are single-path SVGs defined in one map, so weight and colour stay
            consistent across both applications and every glyph inherits the text colour of its context.
          </p>
        </div>
      </div>
    </Page>
  )
}

function ScreenPages({ entries, eyebrow, title, note, prefix }: {
  entries: Entry[]; eyebrow: string; title: string; note: string; prefix: string
}) {
  const pages: number[][] = []
  for (let i = 0; i < entries.length; i += 4) {
    pages.push(entries.slice(i, i + 4).map((_, k) => i + k))
  }
  return (
    <>
      {pages.map((group, i) => (
        <Page
          key={i}
          eyebrow={eyebrow}
          title={`${title} — ${tag(prefix, group[0])} to ${tag(prefix, group[group.length - 1])}`}
          note={i === 0 ? note : undefined}
        >
          <Grid>
            {group.map(idx => {
              const e = entries[idx]
              return (
                <Tile key={e.name} id={tag(prefix, idx)} name={e.name} purpose={e.purpose} parts={e.parts}>
                  {e.node}
                </Tile>
              )
            })}
          </Grid>
        </Page>
      ))}
    </>
  )
}

function Doc() {
  return (
    <div className={WIRE ? 'wire' : undefined}>
      <style>{SHEET}</style>
      <Cover />
      <Contents />
      <Foundations />
      <Components />
      <ScreenPages
        prefix="C"
        entries={CUSTOMER}
        eyebrow="Section 04 · Customer application"
        title="Customer"
        note="Rendered at 390 × 844 pt, the iPhone reference frame. Screens are shown at the state a real user reaches them in: an active case at the inspection stage."
      />
      <ScreenPages
        prefix="P"
        entries={WORKER_SCREENS}
        eyebrow="Section 05 · Professional application"
        title="Professional"
        note="The professional shell shares the device frame and component set, and inverts the chrome to a dark hero so the two roles are never confused on a shared device."
      />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Doc />)
