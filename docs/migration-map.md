# TrustCraft prototype migration map

The React/Figma Make prototype remains at the repository root as the visual and interaction reference. The Flutter implementation uses semantic routes, typed data, and native capability boundaries.

| Prototype screen | Product purpose | Flutter route | State / capability | Status |
|---|---|---|---|---|
| Home | Start “What happened?” and resume work | `/` | localized app shell | Migrated |
| Camera | Capture issue evidence | `/issue/capture` | camera + gallery adapter | Migrated |
| Voice | Record an issue description | `/issue/voice` | recorder; mock transcription | Migrated |
| AI Analysis | Explain preliminary processing | `/issue/analyzing` | IssueRepository | Migrated |
| Problem Canvas | Surface likely issue, urgency, safety, confidence | `/issue/problem` | ProblemAnalysis | Migrated |
| Clarification | Refine uncertainty | `/issue/clarify` | Riverpod selection | Migrated |
| Structured Request | Confirm a professional-ready request | `/issue/confirm` | typed issue data | Migrated |
| Top Matches | Show ranked professionals | `/matches` | MatchingRepository | Migrated |
| Match comparison | Compare evidence | `/matches/compare` | deterministic comparison | Migrated |
| Why This Match? | Explain ranking | `/matches/why` | MatchReason list | Migrated |
| Professional Profile | Show identity, qualifications, work | `/professional/:id` | Professional model | Migrated |
| Trust Score | Explain evidence-backed trust | `/professional/:id/trust` | central TrustScore model | Migrated |
| Booking | Choose an inspection | `/booking` | local slot state | Migrated |
| Appointment | Track arrival | `/booking/appointment` | deterministic appointment | Migrated |
| Inspection | Record professional assessment | `/job/:id/inspection` | job repository boundary | Migrated |
| Repair Plan | Explain work and costs | `/job/:id/quote` | Quotation model | Migrated |
| Price Context | Compare with completed jobs | `/job/:id/quote/price-context` | PriceContextService | Migrated |
| Approval | Deliberate quote approval | `/job/:id/approve` | confirmation state + haptic | Migrated |
| Protected Payment | Simulate protected authorization | `/job/:id/payment` | explicitly mocked | Migrated |
| Active Job | Show living timeline | `/job/:id` | TimelineEvent list | Migrated |
| Completion | Verify completion evidence | `/job/:id/verify` | Riverpod checklist | Migrated |
| Resolved | Save a service outcome | `/job/:id/resolved` | haptic transition | Migrated |
| Verified Review | Create feedback tied to a job | `/job/:id/review` | local demo state | Migrated |
| My Home | Preserve service and warranty history | `/profile` | HomeRepository | Migrated |
| Professional Request | Show the professional-side intake | `/professional/request-preview` | typed mock request | Migrated |

Production authority boundaries are intentionally explicit: identity, qualifications, Trust Score, quote approval, payment settlement, completion, disputes, and verified-review eligibility must eventually be server-authoritative.
