import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../app/providers.dart';
import '../../core/design_system/tc_widgets.dart';
import '../../core/theme/tc_theme.dart';
import '../../data/repositories.dart';
import '../../domain/models.dart';

final _money = NumberFormat.currency(symbol: 'LKR ', decimalDigits: 0);

class AppointmentScreen extends StatelessWidget {
  const AppointmentScreen({super.key});
  @override
  Widget build(BuildContext context) => TCScrollPage(
    title: 'Appointment',
    bottom: TCButton(
      label: 'Continue to inspection',
      onPressed: () => context.push('/job/kitchen-sink-01/inspection'),
    ),
    children: [
      const SizedBox(height: 6),
      const TCKicker('Confirmed'),
      const SizedBox(height: 7),
      const TCDisplay('Chamod is on\nthe way', size: 32),
      const SizedBox(height: 6),
      const Text(
        'Today · arriving around 4:42 PM',
        style: TextStyle(color: TCColors.ink400, fontSize: 14),
      ),
      const SizedBox(height: 22),
      TCSurface(
        color: TCColors.ink900,
        borderColor: TCColors.ink900,
        child: Column(
          children: [
            Row(
              children: [
                const CircleAvatar(
                  radius: 30,
                  backgroundImage: AssetImage('assets/images/chamod.jpg'),
                ),
                const SizedBox(width: 13),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Chamod Fernando',
                        style: context.display.copyWith(
                          color: Colors.white,
                          fontSize: 22,
                        ),
                      ),
                      const Text(
                        'Leak specialist · Trust 92',
                        style: TextStyle(color: Colors.white54, fontSize: 12.5),
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.navigation_rounded, color: TCColors.teal200),
              ],
            ),
            const SizedBox(height: 18),
            const LinearProgressIndicator(
              value: .68,
              minHeight: 7,
              borderRadius: BorderRadius.all(Radius.circular(6)),
              color: TCColors.teal600,
              backgroundColor: Colors.white12,
            ),
            const SizedBox(height: 10),
            const Row(
              children: [
                Text(
                  '2.4 km away',
                  style: TextStyle(color: Colors.white54, fontSize: 12),
                ),
                Spacer(),
                Text(
                  '18 min',
                  style: TextStyle(
                    color: Colors.white,
                    fontFamily: 'DMMono',
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
      const SizedBox(height: 16),
      const TCSurface(
        child: Column(
          children: [
            TCInfoRow(
              label: 'Visit window',
              value: '4:30 PM – 5:00 PM',
              icon: Icons.schedule_rounded,
            ),
            Divider(height: 1, color: TCColors.ink100),
            TCInfoRow(
              label: 'Inspection fee',
              value: 'LKR 1,000',
              icon: Icons.receipt_long_outlined,
            ),
            Divider(height: 1, color: TCColors.ink100),
            TCInfoRow(
              label: 'Issue',
              value: 'Kitchen sink leak',
              icon: Icons.plumbing_rounded,
            ),
          ],
        ),
      ),
      const SizedBox(height: 14),
      Row(
        children: [
          Expanded(
            child: TCButton(
              label: 'Message',
              style: TCButtonStyle.outline,
              icon: Icons.chat_bubble_outline_rounded,
              onPressed: () => context.go('/messages'),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: TCButton(
              label: 'Call',
              style: TCButtonStyle.outline,
              icon: Icons.phone_outlined,
              onPressed: () {},
            ),
          ),
        ],
      ),
    ],
  );
}

class InspectionScreen extends StatelessWidget {
  const InspectionScreen({super.key});
  @override
  Widget build(BuildContext context) => TCScrollPage(
    title: 'Inspection result',
    bottom: TCButton(
      label: 'Review repair plan',
      onPressed: () => context.push('/job/kitchen-sink-01/quote'),
    ),
    children: [
      const TCKicker('Professional assessment'),
      const SizedBox(height: 7),
      const TCDisplay('Damaged compression\nfitting confirmed', size: 31),
      const SizedBox(height: 8),
      const Text(
        'Chamod inspected the sink connection at 2:26 PM.',
        style: TextStyle(color: TCColors.ink400, fontSize: 13.5),
      ),
      const SizedBox(height: 20),
      ClipRRect(
        borderRadius: BorderRadius.circular(18),
        child: Stack(
          children: [
            Image.asset(
              'assets/images/kitchen.jpg',
              width: double.infinity,
              height: 210,
              fit: BoxFit.cover,
            ),
            Positioned(
              bottom: 12,
              left: 12,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 11,
                  vertical: 7,
                ),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: .66),
                  borderRadius: BorderRadius.circular(30),
                ),
                child: const Text(
                  'Inspection evidence · 2 photos',
                  style: TextStyle(color: Colors.white, fontSize: 11.5),
                ),
              ),
            ),
          ],
        ),
      ),
      const SizedBox(height: 16),
      const TCSurface(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TCKicker('Assessment'),
            SizedBox(height: 8),
            Text(
              'The compression fitting is worn and leaking under pressure. Replacement is recommended; the basin and pipe are otherwise sound.',
              style: TextStyle(
                color: TCColors.ink700,
                fontSize: 14,
                height: 1.5,
              ),
            ),
            SizedBox(height: 14),
            Row(
              children: [
                Icon(
                  Icons.check_circle_rounded,
                  color: TCColors.success700,
                  size: 18,
                ),
                SizedBox(width: 8),
                Text(
                  'No structural water damage observed',
                  style: TextStyle(
                    color: TCColors.success800,
                    fontSize: 12.5,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
      const SizedBox(height: 14),
      const Text(
        'AI assisted with initial understanding. This final assessment was entered by a verified professional.',
        style: TextStyle(fontSize: 12, height: 1.5, color: TCColors.ink400),
      ),
    ],
  );
}

class RepairPlanScreen extends ConsumerWidget {
  const RepairPlanScreen({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final quote =
        ref.watch(quotationProvider).value ?? MockTrustCraftRepository.quote;
    return TCScrollPage(
      title: 'Repair Plan',
      bottom: TCButton(
        label: 'Review & approve',
        onPressed: () => context.push('/job/kitchen-sink-01/approve'),
      ),
      children: [
        const TCKicker('Before work begins'),
        const SizedBox(height: 7),
        const TCDisplay('Replace damaged\nsink connector', size: 31),
        const SizedBox(height: 8),
        const Text(
          'A clear plan from Chamod Fernando',
          style: TextStyle(color: TCColors.ink400, fontSize: 13.5),
        ),
        const SizedBox(height: 20),
        TCSurface(
          padding: EdgeInsets.zero,
          child: Column(
            children: [
              for (final entry in quote.items.indexed) ...[
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            TCKicker(entry.$2.label, color: TCColors.ink400),
                            const SizedBox(height: 5),
                            Text(
                              entry.$2.description,
                              style: const TextStyle(
                                color: TCColors.ink900,
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Text(
                        _money.format(entry.$2.amount),
                        style: context.data.copyWith(
                          color: TCColors.ink900,
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          letterSpacing: 0,
                        ),
                      ),
                    ],
                  ),
                ),
                if (entry.$1 != quote.items.length - 1)
                  const Divider(height: 1, color: TCColors.ink100),
              ],
              Container(
                padding: const EdgeInsets.all(16),
                color: TCColors.ink900,
                child: Row(
                  children: [
                    const Expanded(
                      child: TCKicker('Total', color: TCColors.teal200),
                    ),
                    Text(
                      _money.format(quote.total),
                      style: context.display.copyWith(
                        color: Colors.white,
                        fontSize: 28,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),
        TCSurface(
          onTap: () => context.push('/job/kitchen-sink-01/quote/price-context'),
          color: TCColors.gold100,
          borderColor: TCColors.gold500.withValues(alpha: .25),
          child: const Row(
            children: [
              Icon(Icons.insights_outlined, color: TCColors.gold600),
              SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Price Context',
                      style: TextStyle(
                        color: TCColors.ink900,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    Text(
                      'Within the usual range for similar completed jobs.',
                      style: TextStyle(color: TCColors.ink500, fontSize: 12.5),
                    ),
                  ],
                ),
              ),
              Icon(
                Icons.arrow_forward_ios_rounded,
                size: 15,
                color: TCColors.gold600,
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),
        const TCSurface(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TCKicker('Scope safeguards', color: TCColors.ink400),
              SizedBox(height: 8),
              Text(
                'Any change to parts, work, or total requires a revised plan and your approval before work continues.',
                style: TextStyle(
                  color: TCColors.ink600,
                  fontSize: 13,
                  height: 1.5,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        Center(
          child: TextButton(
            onPressed: () {},
            child: const Text('Request a change'),
          ),
        ),
      ],
    );
  }
}

class PriceContextScreen extends ConsumerWidget {
  const PriceContextScreen({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final quote =
        ref.watch(quotationProvider).value ?? MockTrustCraftRepository.quote;
    return TCScrollPage(
      title: 'Price Context',
      children: [
        const TCKicker('Informational guidance'),
        const SizedBox(height: 8),
        const TCDisplay('How this price\ncompares', size: 32),
        const SizedBox(height: 8),
        const Text(
          'Based on comparable verified TrustCraft jobs. This is guidance, not price enforcement.',
          style: TextStyle(color: TCColors.ink400, height: 1.5, fontSize: 13.5),
        ),
        const SizedBox(height: 28),
        TCSurface(
          color: TCColors.ink900,
          borderColor: TCColors.ink900,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const TCKicker('Typical range', color: TCColors.teal200),
              const SizedBox(height: 18),
              Row(
                children: [
                  Text(
                    _money.format(quote.typicalLow),
                    style: const TextStyle(color: Colors.white54, fontSize: 11),
                  ),
                  const Spacer(),
                  Text(
                    _money.format(quote.typicalHigh),
                    style: const TextStyle(color: Colors.white54, fontSize: 11),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              LayoutBuilder(
                builder: (context, constraints) => SizedBox(
                  height: 32,
                  child: Stack(
                    children: [
                      Positioned(
                        top: 13,
                        left: 0,
                        right: 0,
                        child: Container(
                          height: 5,
                          decoration: BoxDecoration(
                            color: Colors.white12,
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ),
                      ),
                      Positioned(
                        left: (constraints.maxWidth - 24) * quote.pricePosition,
                        top: 3,
                        child: const CircleAvatar(
                          radius: 12,
                          backgroundColor: TCColors.teal600,
                          child: CircleAvatar(
                            radius: 5,
                            backgroundColor: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 9),
              Row(
                children: [
                  const Text(
                    'LOW',
                    style: TextStyle(
                      color: Colors.white30,
                      fontSize: 9,
                      letterSpacing: 1,
                    ),
                  ),
                  const Spacer(),
                  Text(
                    _money.format(quote.total),
                    style: context.data.copyWith(
                      color: Colors.white,
                      fontSize: 16,
                      letterSpacing: 0,
                    ),
                  ),
                  const Spacer(),
                  const Text(
                    'HIGH',
                    style: TextStyle(
                      color: Colors.white30,
                      fontSize: 9,
                      letterSpacing: 1,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),
        const TCSurface(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Within the usual range',
                style: TextStyle(
                  color: TCColors.success700,
                  fontWeight: FontWeight.w700,
                ),
              ),
              SizedBox(height: 7),
              Text(
                'The plan sits near the middle of comparable connector replacement jobs with pressure testing in Colombo.',
                style: TextStyle(
                  color: TCColors.ink600,
                  fontSize: 13.5,
                  height: 1.5,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),
        TCButton(label: 'Back to Repair Plan', onPressed: () => context.pop()),
      ],
    );
  }
}

class ApprovalScreen extends StatefulWidget {
  const ApprovalScreen({super.key});
  @override
  State<ApprovalScreen> createState() => _ApprovalScreenState();
}

class _ApprovalScreenState extends State<ApprovalScreen> {
  bool _confirmed = false;
  @override
  Widget build(BuildContext context) => TCScrollPage(
    title: 'Approve work',
    bottom: TCButton(
      label: 'Approve LKR 6,900',
      onPressed: _confirmed
          ? () {
              HapticFeedback.mediumImpact();
              context.push('/job/kitchen-sink-01/payment');
            }
          : null,
    ),
    children: [
      const TCKicker('Protected approval'),
      const SizedBox(height: 7),
      const TCDisplay('Know exactly what\nyou are approving', size: 31),
      const SizedBox(height: 20),
      TCSurface(
        color: TCColors.ink900,
        borderColor: TCColors.ink900,
        child: Column(
          children: [
            const TCInfoRow(
              label: 'Work',
              value: 'Replace sink connector',
              valueColor: Colors.white,
            ),
            const Divider(height: 1, color: Colors.white10),
            const TCInfoRow(
              label: 'Professional',
              value: 'Chamod Fernando',
              valueColor: Colors.white,
            ),
            const Divider(height: 1, color: Colors.white10),
            TCInfoRow(
              label: 'Protected total',
              value: 'LKR 6,900',
              valueColor: Colors.white,
            ),
          ],
        ),
      ),
      const SizedBox(height: 14),
      const TCSurface(
        color: TCColors.success100,
        borderColor: Color(0x331D7A47),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(Icons.lock_outline_rounded, color: TCColors.success700),
            SizedBox(width: 12),
            Expanded(
              child: Text(
                'Payment is simulated and held until you verify completion. Production settlement will be server-authoritative.',
                style: TextStyle(
                  color: TCColors.success800,
                  fontSize: 13,
                  height: 1.5,
                ),
              ),
            ),
          ],
        ),
      ),
      const SizedBox(height: 16),
      Semantics(
        checked: _confirmed,
        child: CheckboxListTile(
          contentPadding: EdgeInsets.zero,
          controlAffinity: ListTileControlAffinity.leading,
          value: _confirmed,
          onChanged: (value) => setState(() => _confirmed = value ?? false),
          title: const Text(
            'I reviewed the work, parts, and total.',
            style: TextStyle(
              color: TCColors.ink900,
              fontWeight: FontWeight.w600,
              fontSize: 14,
            ),
          ),
          subtitle: const Text(
            'Any later change requires my approval.',
            style: TextStyle(color: TCColors.ink400, fontSize: 12.5),
          ),
        ),
      ),
    ],
  );
}

class PaymentScreen extends StatefulWidget {
  const PaymentScreen({super.key});
  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  bool _processing = false;
  Future<void> _pay() async {
    setState(() => _processing = true);
    await Future<void>.delayed(const Duration(milliseconds: 900));
    await HapticFeedback.heavyImpact();
    if (mounted) context.go('/job/kitchen-sink-01');
  }

  @override
  Widget build(BuildContext context) => TCScrollPage(
    title: 'Protected payment',
    bottom: TCButton(
      label: 'Confirm simulated payment',
      busy: _processing,
      onPressed: _pay,
    ),
    children: [
      const TCKicker('Development simulation'),
      const SizedBox(height: 7),
      const TCDisplay('Payment protected\nuntil completion', size: 31),
      const SizedBox(height: 8),
      const Text(
        'No real payment is processed in this product foundation.',
        style: TextStyle(color: TCColors.ink400, fontSize: 13.5),
      ),
      const SizedBox(height: 22),
      const TCSurface(
        child: Column(
          children: [
            TCInfoRow(
              label: 'Visa ending 4021',
              value: 'Selected',
              icon: Icons.credit_card_rounded,
            ),
            Divider(height: 1, color: TCColors.ink100),
            TCInfoRow(
              label: 'Approved amount',
              value: 'LKR 6,900',
              icon: Icons.receipt_long_rounded,
            ),
            Divider(height: 1, color: TCColors.ink100),
            TCInfoRow(
              label: 'Release condition',
              value: 'Customer verification',
              icon: Icons.verified_user_outlined,
            ),
          ],
        ),
      ),
      const SizedBox(height: 16),
      const TCSurface(
        color: TCColors.teal50,
        borderColor: TCColors.teal200,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(Icons.shield_outlined, color: TCColors.teal800),
            SizedBox(width: 12),
            Expanded(
              child: Text(
                'Quote approvals, payment settlement, and completion state must be trusted server records in production.',
                style: TextStyle(
                  color: TCColors.teal950,
                  fontSize: 13,
                  height: 1.5,
                ),
              ),
            ),
          ],
        ),
      ),
    ],
  );
}

class ActiveJobScreen extends ConsumerStatefulWidget {
  const ActiveJobScreen({super.key});
  @override
  ConsumerState<ActiveJobScreen> createState() => _ActiveJobScreenState();
}

class _ActiveJobScreenState extends ConsumerState<ActiveJobScreen> {
  JobStatus? _expanded;
  @override
  Widget build(BuildContext context) {
    final timeline =
        ref.watch(timelineProvider).value ?? const <TimelineEvent>[];
    return TCScrollPage(
      title: 'Active job',
      children: [
        const TCKicker('Kitchen sink repair'),
        const SizedBox(height: 6),
        const TCDisplay('Repair in progress', size: 31),
        const SizedBox(height: 4),
        const Text(
          'Chamod Fernando · Started 2:47 PM',
          style: TextStyle(color: TCColors.ink400, fontSize: 13),
        ),
        const SizedBox(height: 18),
        const TCSurface(
          color: TCColors.teal800,
          borderColor: TCColors.teal800,
          child: Row(
            children: [
              Icon(Icons.build_circle_outlined, color: Colors.white, size: 36),
              SizedBox(width: 13),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    TCKicker('Current status', color: TCColors.teal200),
                    SizedBox(height: 4),
                    Text(
                      'Connector replacement underway',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                        fontSize: 15,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 22),
        const TCKicker('Living service timeline', color: TCColors.ink400),
        const SizedBox(height: 10),
        for (final entry in timeline.indexed)
          _TimelineItem(
            event: entry.$2,
            active: entry.$2.status == JobStatus.repairInProgress,
            last: entry.$1 == timeline.length - 1,
            expanded: _expanded == entry.$2.status,
            onTap: () => setState(
              () => _expanded = _expanded == entry.$2.status
                  ? null
                  : entry.$2.status,
            ),
          ),
        const SizedBox(height: 16),
        TCButton(
          label: 'Skip to customer verification',
          style: TCButtonStyle.outline,
          onPressed: () => context.push('/job/kitchen-sink-01/verify'),
        ),
      ],
    );
  }
}

class _TimelineItem extends StatelessWidget {
  const _TimelineItem({
    required this.event,
    required this.active,
    required this.last,
    required this.expanded,
    required this.onTap,
  });
  final TimelineEvent event;
  final bool active;
  final bool last;
  final bool expanded;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => IntrinsicHeight(
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        SizedBox(
          width: 25,
          child: Column(
            children: [
              Container(
                width: 23,
                height: 23,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: event.completed || active
                      ? TCColors.teal700
                      : TCColors.ink200,
                ),
                child: Icon(
                  event.completed
                      ? Icons.check_rounded
                      : active
                      ? Icons.circle
                      : Icons.circle_outlined,
                  color: event.completed || active
                      ? Colors.white
                      : TCColors.ink400,
                  size: event.completed ? 14 : 7,
                ),
              ),
              if (!last)
                Expanded(child: Container(width: 2, color: TCColors.ink200)),
            ],
          ),
        ),
        const SizedBox(width: 13),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: TCSurface(
              onTap: onTap,
              color: active ? TCColors.teal50 : Colors.white,
              borderColor: active ? TCColors.teal200 : TCColors.ink200,
              radius: 13,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          event.label,
                          style: TextStyle(
                            color: event.completed || active
                                ? TCColors.ink900
                                : TCColors.ink400,
                            fontWeight: active
                                ? FontWeight.w700
                                : FontWeight.w600,
                            fontSize: 13.5,
                          ),
                        ),
                      ),
                      Text(
                        event.detail,
                        style: const TextStyle(
                          color: TCColors.ink400,
                          fontFamily: 'DMMono',
                          fontSize: 10,
                        ),
                      ),
                    ],
                  ),
                  if (expanded) ...[
                    const SizedBox(height: 10),
                    Text(
                      active
                          ? 'Chamod is replacing the connector and will run a pressure test before finishing.'
                          : 'This event is stored as part of the protected service record.',
                      style: const TextStyle(
                        color: TCColors.ink500,
                        fontSize: 12.5,
                        height: 1.45,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ],
    ),
  );
}

class CompletionScreen extends ConsumerWidget {
  const CompletionScreen({super.key});
  static const items = [
    'Connector replaced',
    'Pressure test passed',
    'No active leaks',
    'Area cleaned up',
  ];
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final checked = ref.watch(completionChecksProvider);
    return TCScrollPage(
      title: 'Verify completion',
      bottom: TCButton(
        label: checked.length == items.length
            ? 'Mark job complete'
            : 'Verify ${checked.length} / ${items.length} items',
        onPressed: checked.length == items.length
            ? () {
                HapticFeedback.heavyImpact();
                context.go('/job/kitchen-sink-01/resolved');
              }
            : null,
      ),
      children: [
        const TCKicker('Ready for verification'),
        const SizedBox(height: 7),
        const TCDisplay('Chamod says the\njob is complete', size: 31),
        const SizedBox(height: 7),
        const Text(
          'Please verify the evidence and work before payment is released.',
          style: TextStyle(color: TCColors.ink400, fontSize: 13.5, height: 1.5),
        ),
        const SizedBox(height: 20),
        const TCKicker('Completion evidence', color: TCColors.ink400),
        const SizedBox(height: 9),
        Row(
          children: [
            Expanded(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(13),
                child: Image.asset(
                  'assets/images/completion_before.jpg',
                  height: 122,
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(13),
                child: Image.asset(
                  'assets/images/completion_after.jpg',
                  height: 122,
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
        const TCKicker('Verify each item', color: TCColors.ink400),
        const SizedBox(height: 9),
        for (final item in items)
          Padding(
            padding: const EdgeInsets.only(bottom: 9),
            child: TCSurface(
              onTap: () {
                final next = <String>{...checked};
                next.contains(item) ? next.remove(item) : next.add(item);
                ref.read(completionChecksProvider.notifier).state = next;
                tcHaptic();
              },
              color: checked.contains(item)
                  ? TCColors.success100
                  : Colors.white,
              borderColor: checked.contains(item)
                  ? TCColors.success700.withValues(alpha: .25)
                  : TCColors.ink200,
              radius: 13,
              child: Row(
                children: [
                  Icon(
                    checked.contains(item)
                        ? Icons.check_box_rounded
                        : Icons.check_box_outline_blank_rounded,
                    color: checked.contains(item)
                        ? TCColors.success700
                        : TCColors.ink300,
                  ),
                  const SizedBox(width: 11),
                  Text(
                    item,
                    style: TextStyle(
                      color: checked.contains(item)
                          ? TCColors.success800
                          : TCColors.ink800,
                      fontWeight: FontWeight.w600,
                      fontSize: 13.5,
                    ),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}

class ResolvedScreen extends StatelessWidget {
  const ResolvedScreen({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: TCColors.ink900,
    body: SafeArea(
      child: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(28),
          child: Column(
            children: [
              const CircleAvatar(
                radius: 30,
                backgroundColor: TCColors.teal800,
                child: Icon(Icons.check_rounded, color: Colors.white, size: 31),
              ),
              const SizedBox(height: 20),
              TCKicker('Resolved', color: TCColors.teal200),
              const SizedBox(height: 10),
              const TCDisplay(
                'Kitchen\nsink leak',
                size: 44,
                color: Colors.white,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 26),
              TCSurface(
                color: Colors.white.withValues(alpha: .04),
                borderColor: Colors.white12,
                child: const Column(
                  children: [
                    TCInfoRow(
                      label: 'Repair time',
                      value: '42 min',
                      valueColor: Colors.white,
                    ),
                    Divider(height: 1, color: Colors.white10),
                    TCInfoRow(
                      label: 'Total cost',
                      value: 'LKR 6,900',
                      valueColor: Colors.white,
                    ),
                    Divider(height: 1, color: Colors.white10),
                    TCInfoRow(
                      label: 'Technician',
                      value: 'Chamod Fernando',
                      valueColor: Colors.white,
                    ),
                    Divider(height: 1, color: Colors.white10),
                    TCInfoRow(
                      label: 'Date',
                      value: 'August 20, 2026',
                      valueColor: Colors.white,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 15),
              const TCSurface(
                color: Color(0x330B6B6B),
                borderColor: Color(0x550D7E7E),
                child: Row(
                  children: [
                    Icon(Icons.shield_outlined, color: TCColors.teal200),
                    SizedBox(width: 10),
                    Text(
                      'Digital service record saved',
                      style: TextStyle(
                        color: TCColors.teal200,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              TCButton(
                label: 'Leave Verified Review',
                onPressed: () => context.push('/job/kitchen-sink-01/review'),
              ),
              const SizedBox(height: 8),
              TextButton(
                onPressed: () => context.go('/'),
                child: const Text(
                  'Return to home',
                  style: TextStyle(color: Colors.white54),
                ),
              ),
            ],
          ),
        ),
      ),
    ),
  );
}

class ReviewScreen extends StatefulWidget {
  const ReviewScreen({super.key});
  @override
  State<ReviewScreen> createState() => _ReviewScreenState();
}

class _ReviewScreenState extends State<ReviewScreen> {
  int _rating = 0;
  bool _submitted = false;
  @override
  Widget build(BuildContext context) {
    if (_submitted) {
      return Scaffold(
        backgroundColor: TCColors.canvas,
        body: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(30),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const CircleAvatar(
                    radius: 30,
                    backgroundColor: TCColors.success100,
                    child: Icon(
                      Icons.check_rounded,
                      color: TCColors.success700,
                      size: 30,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const TCDisplay(
                    'Review submitted.',
                    size: 29,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Only verified completed jobs can produce reviews. This will strengthen Chamod’s evidence history.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: TCColors.ink400, height: 1.5),
                  ),
                  const SizedBox(height: 24),
                  TCButton(label: 'Done', onPressed: () => context.go('/')),
                ],
              ),
            ),
          ),
        ),
      );
    }
    return TCScrollPage(
      title: 'Verified Review',
      bottom: TCButton(
        label: 'Submit Verified Review',
        onPressed: _rating == 0
            ? null
            : () {
                HapticFeedback.mediumImpact();
                setState(() => _submitted = true);
              },
      ),
      children: [
        const Row(
          children: [
            Icon(Icons.verified_rounded, color: TCColors.success700, size: 17),
            SizedBox(width: 7),
            Text(
              'Verified completed job · August 20, 2026',
              style: TextStyle(
                color: TCColors.success700,
                fontSize: 12,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
        const SizedBox(height: 22),
        const TCDisplay('How did Chamod do?', size: 31),
        const SizedBox(height: 24),
        const TCKicker('Overall rating', color: TCColors.ink400),
        const SizedBox(height: 10),
        Row(
          children: [
            for (int value = 1; value <= 5; value++)
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 3),
                  child: Semantics(
                    button: true,
                    label: '$value stars',
                    selected: value <= _rating,
                    child: InkWell(
                      onTap: () => setState(() => _rating = value),
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        height: 54,
                        decoration: BoxDecoration(
                          color: value <= _rating
                              ? TCColors.teal100
                              : Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: value <= _rating
                                ? TCColors.teal700
                                : TCColors.ink200,
                            width: 1.5,
                          ),
                        ),
                        child: Icon(
                          value <= _rating
                              ? Icons.star_rounded
                              : Icons.star_outline_rounded,
                          color: value <= _rating
                              ? TCColors.teal800
                              : TCColors.ink300,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(height: 24),
        const TCKicker('Written review', color: TCColors.ink400),
        const SizedBox(height: 8),
        const TextField(
          minLines: 4,
          maxLines: 6,
          decoration: InputDecoration(hintText: 'Share your experience…'),
        ),
        const SizedBox(height: 12),
        const Text(
          'Your review remains linked to this verified service record.',
          style: TextStyle(color: TCColors.ink400, fontSize: 12.5),
        ),
      ],
    );
  }
}
