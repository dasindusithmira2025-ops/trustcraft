enum Urgency { low, moderate, high }

enum TrustBand { developing, good, excellent }

enum JobStatus {
  requestUnderstood,
  professionalSelected,
  inspectionCompleted,
  quoteApproved,
  repairInProgress,
  customerVerification,
  resolved,
}

class IssueEvidence {
  const IssueEvidence({required this.kind, required this.path, this.duration});
  final String kind;
  final String path;
  final Duration? duration;
}

class ClarificationQuestion {
  const ClarificationQuestion({required this.prompt, required this.options});
  final String prompt;
  final List<String> options;
}

class ProblemAnalysis {
  const ProblemAnalysis({
    required this.category,
    required this.possibleIssue,
    required this.urgency,
    required this.confidence,
    required this.observations,
    required this.safetyGuidance,
    required this.questions,
    required this.requiresProfessionalAssessment,
  });
  final String category;
  final String possibleIssue;
  final Urgency urgency;
  final double confidence;
  final List<String> observations;
  final String safetyGuidance;
  final List<ClarificationQuestion> questions;
  final bool requiresProfessionalAssessment;
}

class TrustEvidence {
  const TrustEvidence({
    required this.label,
    required this.value,
    required this.detail,
  });
  final String label;
  final int value;
  final String detail;
}

class TrustScore {
  const TrustScore({
    required this.score,
    required this.band,
    required this.evidence,
    required this.lastUpdated,
  });
  final int score;
  final TrustBand band;
  final List<TrustEvidence> evidence;
  final DateTime lastUpdated;

  bool get isVerified => evidence.every((item) => item.value >= 80);
}

class Professional {
  const Professional({
    required this.id,
    required this.name,
    required this.specialty,
    required this.distanceKm,
    required this.arrivalMinutes,
    required this.completedJobs,
    required this.completionRate,
    required this.trust,
    required this.qualifications,
  });
  final String id;
  final String name;
  final String specialty;
  final double distanceKm;
  final int arrivalMinutes;
  final int completedJobs;
  final double completionRate;
  final TrustScore trust;
  final List<String> qualifications;
}

class MatchReason {
  const MatchReason({
    required this.label,
    required this.score,
    required this.evidence,
  });
  final String label;
  final int score;
  final String evidence;
}

class MatchResult {
  const MatchResult({
    required this.professional,
    required this.score,
    required this.reasons,
  });
  final Professional professional;
  final int score;
  final List<MatchReason> reasons;
}

class QuotationLineItem {
  const QuotationLineItem({
    required this.label,
    required this.description,
    required this.amount,
  });
  final String label;
  final String description;
  final int amount;
}

class Quotation {
  const Quotation({
    required this.id,
    required this.items,
    required this.typicalLow,
    required this.typicalHigh,
  });
  final String id;
  final List<QuotationLineItem> items;
  final int typicalLow;
  final int typicalHigh;
  int get total => items.fold(0, (sum, item) => sum + item.amount);
  double get pricePosition =>
      ((total - typicalLow) / (typicalHigh - typicalLow)).clamp(0, 1);
}

class TimelineEvent {
  const TimelineEvent({
    required this.status,
    required this.label,
    required this.detail,
    required this.completed,
  });
  final JobStatus status;
  final String label;
  final String detail;
  final bool completed;
}

class ServiceRecord {
  const ServiceRecord({
    required this.room,
    required this.service,
    required this.professional,
    required this.dateLabel,
    this.warranty,
  });
  final String room;
  final String service;
  final String professional;
  final String dateLabel;
  final String? warranty;
}
