import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';

import '../data/repositories.dart';
import '../domain/models.dart';

final repositoryProvider = Provider<MockTrustCraftRepository>(
  (ref) => const MockTrustCraftRepository(),
);
final issueRepositoryProvider = Provider<IssueRepository>(
  (ref) => ref.watch(repositoryProvider),
);
final matchingRepositoryProvider = Provider<MatchingRepository>(
  (ref) => ref.watch(repositoryProvider),
);
final jobRepositoryProvider = Provider<JobRepository>(
  (ref) => ref.watch(repositoryProvider),
);
final homeRepositoryProvider = Provider<HomeRepository>(
  (ref) => ref.watch(repositoryProvider),
);

final analysisProvider = FutureProvider<ProblemAnalysis>((ref) async {
  return ref.watch(issueRepositoryProvider).analyseIssue(const [
    IssueEvidence(kind: 'photo', path: 'assets/images/kitchen.jpg'),
  ]);
});

final matchesProvider = FutureProvider<List<MatchResult>>((ref) async {
  final issue = await ref.watch(analysisProvider.future);
  return ref.watch(matchingRepositoryProvider).findMatches(issue);
});

final quotationProvider = FutureProvider<Quotation>(
  (ref) => ref.watch(jobRepositoryProvider).getQuotation('kitchen-sink-01'),
);
final timelineProvider = FutureProvider<List<TimelineEvent>>(
  (ref) => ref.watch(jobRepositoryProvider).getTimeline('kitchen-sink-01'),
);
final serviceHistoryProvider = FutureProvider<List<ServiceRecord>>(
  (ref) => ref.watch(homeRepositoryProvider).serviceHistory(),
);

final localeProvider = StateProvider<String>((ref) => 'en');
final selectedClarificationProvider = StateProvider<String?>((ref) => null);
final completionChecksProvider = StateProvider<Set<String>>(
  (ref) => <String>{},
);
