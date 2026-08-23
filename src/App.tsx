import { StoreProvider, useRoute, useScrollReset } from './app-state'
import Home from './pages/Home'
import { CaseCreating, ProblemWorkspace, ResolutionPathPage } from './pages/Workspace'
import { ProfessionalFit, ProProfile, Professionals } from './pages/Fit'
import { QuoteLens, RepairPlan } from './pages/Quotes'
import { ChangeRequest, WorkAgreement } from './pages/Agreement'
import { CompletionVerify, ProofTimeline, Resolved } from './pages/Record'
import { HomeLedger } from './pages/Ledger'
import { Cases, Messages } from './pages/Cases'

function Router() {
  const route = useRoute()
  useScrollReset(route)

  const [path, query = ''] = route.split('?')
  const params = new URLSearchParams(query)
  const parts = path.split('/').filter(Boolean)

  // /case/:id/:view
  if (parts[0] === 'case') {
    if (parts[1] === 'new') return <CaseCreating />
    switch (parts[2]) {
      case undefined:
        return <ProblemWorkspace />
      case 'path':
        return <ResolutionPathPage />
      case 'fit':
        return <ProfessionalFit />
      case 'quotes':
        return <QuoteLens />
      case 'plan':
        return <RepairPlan />
      case 'agreement':
        return <WorkAgreement />
      case 'change':
        return <ChangeRequest />
      case 'record':
        return <ProofTimeline />
      case 'verify':
        return <CompletionVerify />
      case 'resolved':
        return <Resolved />
      default:
        return <ProblemWorkspace />
    }
  }

  if (parts[0] === 'pro') return <ProProfile id={parts[1] ?? 'chamod'} />
  if (parts[0] === 'professionals') return <Professionals />
  if (parts[0] === 'cases') return <Cases />
  if (parts[0] === 'ledger') return <HomeLedger assetId={params.get('asset') ?? undefined} />
  if (parts[0] === 'messages') return <Messages />

  return <Home />
}

export default function App() {
  return (
    <StoreProvider>
      <Router />
    </StoreProvider>
  )
}
