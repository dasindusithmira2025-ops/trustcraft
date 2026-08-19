import '../domain/models.dart';

abstract interface class IssueRepository {
  Future<ProblemAnalysis> analyseIssue(List<IssueEvidence> evidence);
}

abstract interface class MatchingRepository {
  Future<List<MatchResult>> findMatches(ProblemAnalysis issue);
}

abstract interface class JobRepository {
  Future<Quotation> getQuotation(String jobId);
  Future<List<TimelineEvent>> getTimeline(String jobId);
  Future<void> approveQuote(String jobId, String quoteId);
  Future<void> completeJob(String jobId);
}

abstract interface class HomeRepository {
  Future<List<ServiceRecord>> serviceHistory();
}

abstract interface class IssueIntelligenceService {
  Future<ProblemAnalysis> understand(List<IssueEvidence> evidence);
}

abstract interface class MatchingIntelligenceService {
  Future<List<MatchResult>> rank(ProblemAnalysis issue);
}

abstract interface class PriceContextService {
  double positionFor(Quotation quotation);
  String explanationFor(Quotation quotation);
}

class MockTrustCraftRepository
    implements
        IssueRepository,
        MatchingRepository,
        JobRepository,
        HomeRepository,
        IssueIntelligenceService,
        MatchingIntelligenceService,
        PriceContextService {
  const MockTrustCraftRepository();

  static final trustScore = TrustScore(
    score: 92,
    band: TrustBand.excellent,
    lastUpdated: DateTime(2026, 8, 19),
    evidence: const [
      TrustEvidence(
        label: 'Identity verified',
        value: 100,
        detail: 'Government identity and phone ownership verified.',
      ),
      TrustEvidence(
        label: 'Qualifications',
        value: 94,
        detail: 'Plumbing credentials and two trade references checked.',
      ),
      TrustEvidence(
        label: 'Relevant repairs',
        value: 96,
        detail: '31 verified pipe-leak repairs completed successfully.',
      ),
      TrustEvidence(
        label: 'Completion reliability',
        value: 96,
        detail: '96% of accepted jobs completed without dispute.',
      ),
      TrustEvidence(
        label: 'Customer satisfaction',
        value: 89,
        detail: 'Derived only from verified completed jobs.',
      ),
    ],
  );

  static final chamod = Professional(
    id: 'chamod-fernando',
    name: 'Chamod Fernando',
    specialty: 'Leak specialist',
    distanceKm: 2.4,
    arrivalMinutes: 42,
    completedJobs: 147,
    completionRate: .96,
    trust: trustScore,
    qualifications: const [
      'NVQ Level 4 Plumbing',
      'Identity verified',
      'Public liability covered',
    ],
  );

  static const issue = ProblemAnalysis(
    category: 'Plumbing',
    possibleIssue: 'Leak near sink connection',
    urgency: Urgency.moderate,
    confidence: .87,
    observations: [
      'Moisture is visible below the basin.',
      'Leak appears close to the connector joint.',
    ],
    safetyGuidance: 'Turn off the local water valve if safely accessible.',
    questions: [
      ClarificationQuestion(
        prompt: 'Does the leak continue when the tap is closed?',
        options: ['Yes', 'No', 'Not sure'],
      ),
    ],
    requiresProfessionalAssessment: true,
  );

  static const quote = Quotation(
    id: 'quote-kitchen-01',
    typicalLow: 5600,
    typicalHigh: 8200,
    items: [
      QuotationLineItem(
        label: 'PARTS',
        description: 'Replacement connector',
        amount: 2400,
      ),
      QuotationLineItem(
        label: 'LABOUR',
        description: 'Installation + pressure test',
        amount: 3500,
      ),
      QuotationLineItem(
        label: 'INSPECTION',
        description: 'On-site assessment',
        amount: 1000,
      ),
    ],
  );

  @override
  Future<ProblemAnalysis> analyseIssue(List<IssueEvidence> evidence) =>
      understand(evidence);

  @override
  Future<ProblemAnalysis> understand(List<IssueEvidence> evidence) async {
    await Future<void>.delayed(const Duration(milliseconds: 750));
    return issue;
  }

  @override
  Future<List<MatchResult>> findMatches(ProblemAnalysis issue) => rank(issue);

  @override
  Future<List<MatchResult>> rank(ProblemAnalysis issue) async {
    await Future<void>.delayed(const Duration(milliseconds: 350));
    return [
      MatchResult(
        professional: chamod,
        score: 94,
        reasons: const [
          MatchReason(
            label: 'Relevant experience',
            score: 98,
            evidence: '31 verified pipe-leak repairs.',
          ),
          MatchReason(
            label: 'Availability',
            score: 94,
            evidence: 'Can arrive in about 42 minutes.',
          ),
          MatchReason(
            label: 'Distance',
            score: 92,
            evidence: 'Currently 2.4 km from Colombo 05.',
          ),
          MatchReason(
            label: 'Reliability',
            score: 96,
            evidence: '96% completion across accepted jobs.',
          ),
          MatchReason(
            label: 'Price fit',
            score: 88,
            evidence: 'Recent comparable work is within your range.',
          ),
        ],
      ),
    ];
  }

  @override
  Future<Quotation> getQuotation(String jobId) async => quote;

  @override
  Future<List<TimelineEvent>> getTimeline(String jobId) async => const [
    TimelineEvent(
      status: JobStatus.requestUnderstood,
      label: 'Request understood',
      detail: '1:52 PM',
      completed: true,
    ),
    TimelineEvent(
      status: JobStatus.professionalSelected,
      label: 'Chamod selected',
      detail: '2:04 PM',
      completed: true,
    ),
    TimelineEvent(
      status: JobStatus.inspectionCompleted,
      label: 'Inspection completed',
      detail: '2:26 PM',
      completed: true,
    ),
    TimelineEvent(
      status: JobStatus.quoteApproved,
      label: 'Quote approved',
      detail: '2:31 PM',
      completed: true,
    ),
    TimelineEvent(
      status: JobStatus.repairInProgress,
      label: 'Repair in progress',
      detail: 'Started 2:47 PM',
      completed: false,
    ),
    TimelineEvent(
      status: JobStatus.customerVerification,
      label: 'Customer verification',
      detail: 'Pending',
      completed: false,
    ),
    TimelineEvent(
      status: JobStatus.resolved,
      label: 'Resolved',
      detail: 'Pending',
      completed: false,
    ),
  ];

  @override
  Future<void> approveQuote(String jobId, String quoteId) async =>
      Future<void>.delayed(const Duration(milliseconds: 350));

  @override
  Future<void> completeJob(String jobId) async =>
      Future<void>.delayed(const Duration(milliseconds: 300));

  @override
  double positionFor(Quotation quotation) => quotation.pricePosition;

  @override
  String explanationFor(Quotation quotation) =>
      'Within the usual range of comparable completed jobs.';

  @override
  Future<List<ServiceRecord>> serviceHistory() async => const [
    ServiceRecord(
      room: 'Kitchen',
      service: 'Sink connector replaced',
      professional: 'Chamod Fernando',
      dateLabel: 'August 2026',
      warranty: 'Warranty until November 2026',
    ),
    ServiceRecord(
      room: 'Bedroom AC',
      service: 'Full service & filter replacement',
      professional: 'Samith Rajapaksa',
      dateLabel: 'July 2026',
    ),
    ServiceRecord(
      room: 'Electrical',
      service: 'Safety inspection',
      professional: 'Nuwan Silva',
      dateLabel: 'March 2026',
      warranty: 'Certificate valid',
    ),
    ServiceRecord(
      room: 'Bathroom',
      service: 'Shower valve replacement',
      professional: 'Chamod Fernando',
      dateLabel: 'December 2025',
    ),
  ];
}
