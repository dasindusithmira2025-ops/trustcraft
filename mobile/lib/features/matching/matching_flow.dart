import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/providers.dart';
import '../../core/design_system/tc_widgets.dart';
import '../../core/theme/tc_theme.dart';
import '../../data/repositories.dart';
import '../../domain/models.dart';

MatchResult _fallbackMatch() => MatchResult(
  professional: MockTrustCraftRepository.chamod,
  score: 94,
  reasons: const [
    MatchReason(
      label: 'Relevant experience',
      score: 98,
      evidence: '31 verified pipe-leak repairs completed successfully.',
    ),
    MatchReason(
      label: 'Availability',
      score: 94,
      evidence: 'Can arrive in about 42 minutes.',
    ),
    MatchReason(
      label: 'Distance',
      score: 92,
      evidence: '2.4 km from your home.',
    ),
    MatchReason(
      label: 'Reliability',
      score: 96,
      evidence: '96% completion rate.',
    ),
    MatchReason(
      label: 'Price fit',
      score: 88,
      evidence: 'Comparable recent work is in range.',
    ),
  ],
);

class TopMatchesScreen extends ConsumerWidget {
  const TopMatchesScreen({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final match =
        ref.watch(matchesProvider).value?.firstOrNull ?? _fallbackMatch();
    return TCScrollPage(
      title: 'Top matches',
      children: [
        const TCKicker('Best fit for your request'),
        const SizedBox(height: 7),
        const TCDisplay('Professionals you\ncan understand', size: 31),
        const SizedBox(height: 8),
        const Text(
          'Ranked with visible evidence—not only ratings.',
          style: TextStyle(color: TCColors.ink400, fontSize: 14),
        ),
        const SizedBox(height: 22),
        Semantics(
          label:
              '${match.score}% match, ${match.professional.name}, trust ${match.professional.trust.score}',
          child: TCSurface(
            onTap: () => context.push('/professional/${match.professional.id}'),
            padding: EdgeInsets.zero,
            borderColor: TCColors.teal200,
            child: Column(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(18),
                  ),
                  child: Stack(
                    children: [
                      Image.asset(
                        'assets/images/chamod.jpg',
                        height: 230,
                        width: double.infinity,
                        fit: BoxFit.cover,
                        alignment: Alignment.topCenter,
                      ),
                      const Positioned.fill(
                        child: DecoratedBox(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [Colors.transparent, Colors.black87],
                            ),
                          ),
                        ),
                      ),
                      Positioned(
                        top: 14,
                        right: 14,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: Row(
                            children: [
                              Text(
                                '${match.score}%',
                                style: context.data.copyWith(
                                  color: TCColors.teal800,
                                  fontSize: 17,
                                  fontWeight: FontWeight.w500,
                                  letterSpacing: 0,
                                ),
                              ),
                              const SizedBox(width: 5),
                              const Text(
                                'MATCH',
                                style: TextStyle(
                                  color: TCColors.ink500,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      Positioned(
                        left: 18,
                        right: 18,
                        bottom: 16,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              match.professional.name,
                              style: context.display.copyWith(
                                color: Colors.white,
                                fontSize: 29,
                              ),
                            ),
                            const SizedBox(height: 3),
                            Text(
                              '${match.professional.specialty} · ${match.professional.distanceKm} km away',
                              style: const TextStyle(
                                color: Colors.white70,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      TrustBadge(
                        score: match.professional.trust.score,
                        onTap: () => context.push(
                          '/professional/${match.professional.id}/trust',
                        ),
                      ),
                      const SizedBox(height: 18),
                      Row(
                        children: [
                          Expanded(
                            child: _CompactStat(
                              value:
                                  '${(match.professional.completionRate * 100).round()}%',
                              label: 'completion',
                            ),
                          ),
                          Expanded(
                            child: _CompactStat(
                              value: '${match.professional.arrivalMinutes} min',
                              label: 'available',
                            ),
                          ),
                          Expanded(
                            child: _CompactStat(
                              value: '${match.professional.completedJobs}',
                              label: 'jobs',
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 18),
                      TCButton(
                        label: 'Why this match?',
                        style: TCButtonStyle.outline,
                        icon: Icons.insights_outlined,
                        onPressed: () => context.push('/matches/why'),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 14),
        Row(
          children: [
            Expanded(
              child: TCButton(
                label: 'Compare',
                style: TCButtonStyle.outline,
                onPressed: () => context.push('/matches/compare'),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: TCButton(
                label: 'View Chamod',
                onPressed: () =>
                    context.push('/professional/${match.professional.id}'),
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),
        const Center(
          child: Text(
            'Swipe the card or use the visible controls to explore matches.',
            style: TextStyle(fontSize: 11.5, color: TCColors.ink400),
          ),
        ),
      ],
    );
  }
}

class _CompactStat extends StatelessWidget {
  const _CompactStat({required this.value, required this.label});
  final String value;
  final String label;
  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(
        value,
        style: context.data.copyWith(
          color: TCColors.ink900,
          fontSize: 16,
          fontWeight: FontWeight.w500,
          letterSpacing: 0,
        ),
      ),
      Text(
        label,
        style: const TextStyle(color: TCColors.ink400, fontSize: 10.5),
      ),
    ],
  );
}

class CompareMatchesScreen extends StatelessWidget {
  const CompareMatchesScreen({super.key});
  @override
  Widget build(BuildContext context) => TCScrollPage(
    title: 'Compare matches',
    children: [
      const TCKicker('Evidence side by side'),
      const SizedBox(height: 8),
      const TCDisplay('Choose with context', size: 31),
      const SizedBox(height: 20),
      const _CompareHeader(),
      const SizedBox(height: 12),
      for (final row in const [
        ('Match', '94%', '89%'),
        ('Trust', '92', '88'),
        ('Leak repairs', '31', '19'),
        ('Arrival', '42 min', '55 min'),
        ('Distance', '2.4 km', '3.1 km'),
      ])
        TCSurface(
          radius: 12,
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  row.$1,
                  style: const TextStyle(
                    color: TCColors.ink500,
                    fontSize: 12.5,
                  ),
                ),
              ),
              Expanded(
                child: Text(
                  row.$2,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    color: TCColors.teal800,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              Expanded(
                child: Text(
                  row.$3,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    color: TCColors.ink700,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
      const SizedBox(height: 18),
      TCButton(
        label: 'Choose Chamod',
        onPressed: () => context.push('/professional/chamod-fernando'),
      ),
    ],
  );
}

class _CompareHeader extends StatelessWidget {
  const _CompareHeader();
  @override
  Widget build(BuildContext context) => Row(
    children: [
      const Expanded(child: SizedBox()),
      Expanded(
        child: Column(
          children: [
            const CircleAvatar(
              radius: 28,
              backgroundImage: AssetImage('assets/images/chamod.jpg'),
            ),
            const SizedBox(height: 6),
            Text('Chamod', style: context.display.copyWith(fontSize: 19)),
          ],
        ),
      ),
      Expanded(
        child: Column(
          children: [
            CircleAvatar(
              radius: 28,
              backgroundColor: TCColors.ink200,
              child: Text(
                'NS',
                style: context.data.copyWith(
                  color: TCColors.ink700,
                  letterSpacing: 0,
                ),
              ),
            ),
            const SizedBox(height: 6),
            Text('Nuwan', style: context.display.copyWith(fontSize: 19)),
          ],
        ),
      ),
    ],
  );
}

class WhyMatchScreen extends StatelessWidget {
  const WhyMatchScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final match = _fallbackMatch();
    return TCScrollPage(
      title: 'Why this match?',
      bottom: TCButton(
        label: 'View Chamod’s profile',
        onPressed: () => context.push('/professional/chamod-fernando'),
      ),
      children: [
        const SizedBox(height: 6),
        Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: TCColors.teal800,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                '94%',
                style: context.data.copyWith(
                  color: Colors.white,
                  fontSize: 22,
                  letterSpacing: 0,
                ),
              ),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'A strong evidence-based fit',
                    style: TextStyle(
                      color: TCColors.ink900,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  Text(
                    'for this specific sink leak',
                    style: TextStyle(color: TCColors.ink400, fontSize: 13),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 24),
        const TCKicker('Strongest reason'),
        const SizedBox(height: 8),
        TCSurface(
          color: TCColors.ink900,
          borderColor: TCColors.ink900,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(Icons.water_drop_outlined, color: TCColors.teal200),
              const SizedBox(height: 13),
              Text(
                '31 verified pipe-leak repairs completed successfully.',
                style: context.display.copyWith(
                  color: Colors.white,
                  fontSize: 25,
                  height: 1.14,
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'This evidence comes from completed TrustCraft jobs—not a self-written profile claim.',
                style: TextStyle(
                  color: Colors.white54,
                  fontSize: 12.5,
                  height: 1.5,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 22),
        const TCKicker('Match explanation', color: TCColors.ink400),
        const SizedBox(height: 8),
        for (final reason in match.reasons)
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: TCSurface(
              radius: 13,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          reason.label,
                          style: const TextStyle(
                            color: TCColors.ink900,
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                      Text(
                        '${reason.score}',
                        style: context.data.copyWith(
                          color: TCColors.teal800,
                          fontSize: 15,
                          letterSpacing: 0,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  LinearProgressIndicator(
                    value: reason.score / 100,
                    minHeight: 5,
                    borderRadius: BorderRadius.circular(5),
                    color: TCColors.teal700,
                    backgroundColor: TCColors.ink100,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    reason.evidence,
                    style: const TextStyle(
                      color: TCColors.ink500,
                      fontSize: 12.5,
                    ),
                  ),
                ],
              ),
            ),
          ),
        TextButton.icon(
          onPressed: () => context.push('/professional/chamod-fernando/trust'),
          icon: const Icon(Icons.shield_outlined),
          label: const Text('See how Trust 92 is calculated'),
        ),
      ],
    );
  }
}

class ProfessionalProfileScreen extends StatelessWidget {
  const ProfessionalProfileScreen({super.key, required this.id});
  final String id;
  @override
  Widget build(BuildContext context) {
    final pro = MockTrustCraftRepository.chamod;
    return TCScrollPage(
      title: 'Professional profile',
      bottom: TCButton(
        label: 'Book Chamod',
        onPressed: () => context.push('/booking'),
      ),
      children: [
        Center(
          child: ClipOval(
            child: Image.asset(
              'assets/images/chamod.jpg',
              width: 104,
              height: 104,
              fit: BoxFit.cover,
              alignment: Alignment.topCenter,
            ),
          ),
        ),
        const SizedBox(height: 14),
        Text(
          pro.name,
          textAlign: TextAlign.center,
          style: context.display.copyWith(fontSize: 31),
        ),
        const SizedBox(height: 4),
        Text(
          '${pro.specialty} · ${pro.distanceKm} km away',
          textAlign: TextAlign.center,
          style: const TextStyle(color: TCColors.ink400, fontSize: 13),
        ),
        const SizedBox(height: 16),
        Center(
          child: TrustBadge(
            score: pro.trust.score,
            large: true,
            onTap: () => context.push('/professional/$id/trust'),
          ),
        ),
        const SizedBox(height: 22),
        TCSurface(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _CompactStat(
                value: '${pro.completedJobs}',
                label: 'verified jobs',
              ),
              _CompactStat(value: '96%', label: 'completed'),
              _CompactStat(value: '42 min', label: 'available'),
            ],
          ),
        ),
        const SizedBox(height: 18),
        const TCKicker('Verified qualifications', color: TCColors.ink400),
        const SizedBox(height: 8),
        for (final item in pro.qualifications)
          Padding(
            padding: const EdgeInsets.only(bottom: 9),
            child: Row(
              children: [
                const Icon(
                  Icons.verified_rounded,
                  color: TCColors.success700,
                  size: 19,
                ),
                const SizedBox(width: 10),
                Text(
                  item,
                  style: const TextStyle(color: TCColors.ink700, fontSize: 14),
                ),
              ],
            ),
          ),
        const SizedBox(height: 16),
        const TCKicker('Recent relevant work', color: TCColors.ink400),
        const SizedBox(height: 8),
        const TCSurface(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Kitchen pipe leak · Colombo 03',
                style: TextStyle(
                  color: TCColors.ink900,
                  fontWeight: FontWeight.w700,
                ),
              ),
              SizedBox(height: 4),
              Text(
                'Resolved in 51 minutes · Verified review',
                style: TextStyle(color: TCColors.ink400, fontSize: 12.5),
              ),
              SizedBox(height: 10),
              Text(
                '“Explained the repair clearly and left the area spotless.”',
                style: TextStyle(
                  color: TCColors.ink700,
                  fontSize: 13.5,
                  height: 1.45,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class TrustScoreScreen extends StatelessWidget {
  const TrustScoreScreen({super.key, required this.id});
  final String id;
  @override
  Widget build(BuildContext context) {
    final trust = MockTrustCraftRepository.trustScore;
    return TCScrollPage(
      title: 'Trust Score',
      dark: true,
      children: [
        const SizedBox(height: 18),
        const Center(
          child: TCKicker(
            'Evidence, not a popularity badge',
            color: TCColors.teal200,
          ),
        ),
        const SizedBox(height: 14),
        Center(
          child: Semantics(
            label: 'Trust score 92 out of 100, excellent',
            child: SizedBox(
              width: 184,
              height: 184,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  const SizedBox.expand(
                    child: CircularProgressIndicator(
                      value: .92,
                      strokeWidth: 11,
                      color: TCColors.teal600,
                      backgroundColor: Colors.white12,
                      strokeCap: StrokeCap.round,
                    ),
                  ),
                  Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'TRUST',
                        style: context.data.copyWith(
                          color: Colors.white54,
                          fontSize: 10,
                        ),
                      ),
                      Text(
                        '92',
                        style: context.display.copyWith(
                          color: Colors.white,
                          fontSize: 66,
                          height: .95,
                        ),
                      ),
                      const Text(
                        'EXCELLENT',
                        style: TextStyle(
                          color: TCColors.teal200,
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 1.1,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(height: 30),
        Text(
          'Why Chamod earns this score',
          style: context.display.copyWith(color: Colors.white, fontSize: 27),
        ),
        const SizedBox(height: 6),
        const Text(
          'Server-authoritative in production. These deterministic values are clearly marked development data.',
          style: TextStyle(color: Colors.white38, fontSize: 12.5, height: 1.5),
        ),
        const SizedBox(height: 20),
        for (final evidence in trust.evidence)
          ExpansionTile(
            tilePadding: EdgeInsets.zero,
            childrenPadding: const EdgeInsets.only(bottom: 14),
            iconColor: TCColors.teal200,
            collapsedIconColor: Colors.white38,
            title: Row(
              children: [
                Expanded(
                  child: Text(
                    evidence.label,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                Text(
                  '${evidence.value}',
                  style: context.data.copyWith(
                    color: TCColors.teal200,
                    fontSize: 14,
                    letterSpacing: 0,
                  ),
                ),
              ],
            ),
            subtitle: Padding(
              padding: const EdgeInsets.only(top: 7),
              child: LinearProgressIndicator(
                value: evidence.value / 100,
                minHeight: 5,
                borderRadius: BorderRadius.circular(4),
                color: TCColors.teal600,
                backgroundColor: Colors.white10,
              ),
            ),
            children: [
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  evidence.detail,
                  style: const TextStyle(
                    color: Colors.white60,
                    height: 1.45,
                    fontSize: 12.5,
                  ),
                ),
              ),
            ],
          ),
      ],
    );
  }
}

class BookingScreen extends StatefulWidget {
  const BookingScreen({super.key});
  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  int _slot = 0;
  @override
  Widget build(BuildContext context) => TCScrollPage(
    title: 'Book inspection',
    bottom: TCButton(
      label: 'Confirm appointment',
      onPressed: () {
        HapticFeedback.mediumImpact();
        context.push('/booking/appointment');
      },
    ),
    children: [
      const TCKicker('Chamod Fernando'),
      const SizedBox(height: 7),
      const TCDisplay('Choose a time that\nworks for you', size: 31),
      const SizedBox(height: 20),
      TCSurface(
        child: Row(
          children: [
            const CircleAvatar(
              radius: 28,
              backgroundImage: AssetImage('assets/images/chamod.jpg'),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Leak inspection',
                    style: TextStyle(
                      color: TCColors.ink900,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  Text(
                    'LKR 1,000 · applied to approved work',
                    style: TextStyle(color: TCColors.ink400, fontSize: 12.5),
                  ),
                ],
              ),
            ),
            TrustBadge(score: 92),
          ],
        ),
      ),
      const SizedBox(height: 20),
      const TCKicker('Today · August 20', color: TCColors.ink400),
      const SizedBox(height: 10),
      for (final entry in const [
        '4:30 PM – 5:00 PM',
        '5:30 PM – 6:00 PM',
        '6:30 PM – 7:00 PM',
      ].indexed)
        Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: TCSurface(
            onTap: () => setState(() => _slot = entry.$1),
            color: _slot == entry.$1 ? TCColors.teal50 : Colors.white,
            borderColor: _slot == entry.$1 ? TCColors.teal700 : TCColors.ink200,
            child: Row(
              children: [
                Icon(
                  _slot == entry.$1
                      ? Icons.radio_button_checked
                      : Icons.radio_button_off,
                  color: _slot == entry.$1 ? TCColors.teal700 : TCColors.ink300,
                ),
                const SizedBox(width: 12),
                Text(
                  entry.$2,
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    color: TCColors.ink900,
                  ),
                ),
              ],
            ),
          ),
        ),
      const SizedBox(height: 10),
      const TCSurface(
        child: Column(
          children: [
            TCInfoRow(
              label: 'Address',
              value: '12B Galle Road, Colombo 05',
              icon: Icons.location_on_outlined,
            ),
            Divider(height: 1, color: TCColors.ink100),
            TCInfoRow(
              label: 'Contact',
              value: 'Nadeesha · 077 123 4567',
              icon: Icons.phone_outlined,
            ),
          ],
        ),
      ),
    ],
  );
}
