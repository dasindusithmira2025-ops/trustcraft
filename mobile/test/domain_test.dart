import 'package:flutter_test/flutter_test.dart';
import 'package:trustcraft/data/repositories.dart';
import 'package:trustcraft/domain/models.dart';

void main() {
  group('TrustScore', () {
    test('represents the verified evidence-backed score centrally', () {
      final trust = MockTrustCraftRepository.trustScore;
      expect(trust.score, 92);
      expect(trust.band, TrustBand.excellent);
      expect(trust.evidence, hasLength(5));
      expect(trust.isVerified, isTrue);
    });
  });

  group('Price context', () {
    test('positions the quote inside its comparison range', () {
      const repository = MockTrustCraftRepository();
      const quotation = MockTrustCraftRepository.quote;
      expect(quotation.total, 6900);
      expect(repository.positionFor(quotation), closeTo(.5, .001));
      expect(repository.explanationFor(quotation), contains('usual range'));
    });
  });

  group('Matching', () {
    test('keeps the strongest reason traceable to verified work', () async {
      const repository = MockTrustCraftRepository();
      final matches = await repository.rank(MockTrustCraftRepository.issue);
      expect(matches.single.score, 94);
      expect(matches.single.reasons.first.evidence, contains('31 verified'));
    });
  });

  test('job status preserves the trust-building sequence', () {
    expect(JobStatus.values, [
      JobStatus.requestUnderstood,
      JobStatus.professionalSelected,
      JobStatus.inspectionCompleted,
      JobStatus.quoteApproved,
      JobStatus.repairInProgress,
      JobStatus.customerVerification,
      JobStatus.resolved,
    ]);
  });
}
