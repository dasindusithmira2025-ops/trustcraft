import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/providers.dart';
import '../../core/design_system/tc_widgets.dart';
import '../../core/theme/tc_theme.dart';
import '../../services/native_services.dart';

class JobsOverviewScreen extends StatelessWidget {
  const JobsOverviewScreen({super.key});
  @override
  Widget build(BuildContext context) => SafeArea(
    child: ListView(
      padding: const EdgeInsets.fromLTRB(24, 22, 24, 28),
      children: [
        const TCKicker('Your services'),
        const SizedBox(height: 6),
        const TCDisplay('Jobs', size: 34),
        const SizedBox(height: 20),
        TCSurface(
          onTap: () => context.push('/job/kitchen-sink-01'),
          borderColor: TCColors.teal200,
          child: const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(child: TCKicker('Active · repair in progress')),
                  CircleAvatar(radius: 7, backgroundColor: TCColors.teal700),
                ],
              ),
              SizedBox(height: 8),
              Text(
                'Kitchen Sink Repair',
                style: TextStyle(
                  color: TCColors.ink900,
                  fontSize: 17,
                  fontWeight: FontWeight.w700,
                ),
              ),
              SizedBox(height: 4),
              Text(
                'Chamod Fernando · LKR 6,900',
                style: TextStyle(color: TCColors.ink400, fontSize: 13),
              ),
              SizedBox(height: 14),
              LinearProgressIndicator(
                value: .62,
                minHeight: 6,
                borderRadius: BorderRadius.all(Radius.circular(5)),
                color: TCColors.teal700,
                backgroundColor: TCColors.ink100,
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),
        const TCKicker('Recent', color: TCColors.ink400),
        const SizedBox(height: 9),
        const TCSurface(
          child: Row(
            children: [
              CircleAvatar(
                backgroundColor: TCColors.success100,
                child: Icon(Icons.check_rounded, color: TCColors.success700),
              ),
              SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Bedroom AC Service',
                      style: TextStyle(
                        color: TCColors.ink900,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    Text(
                      'Resolved · July 2026',
                      style: TextStyle(color: TCColors.ink400, fontSize: 12.5),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    ),
  );
}

class MessagesScreen extends StatelessWidget {
  const MessagesScreen({super.key});
  @override
  Widget build(BuildContext context) => SafeArea(
    child: ListView(
      padding: const EdgeInsets.fromLTRB(24, 22, 24, 28),
      children: [
        const TCKicker('Protected conversations'),
        const SizedBox(height: 6),
        const TCDisplay('Messages', size: 34),
        const SizedBox(height: 20),
        TCSurface(
          onTap: () {},
          child: const Row(
            children: [
              CircleAvatar(
                radius: 25,
                backgroundImage: AssetImage('assets/images/chamod.jpg'),
              ),
              SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            'Chamod Fernando',
                            style: TextStyle(
                              color: TCColors.ink900,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                        Text(
                          '2:51 PM',
                          style: TextStyle(
                            color: TCColors.ink400,
                            fontSize: 10,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 4),
                    Text(
                      'The connector is replaced. I’m starting the pressure test now.',
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(color: TCColors.ink500, fontSize: 12.5),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        TCButton(
          label: 'View professional-side request',
          style: TCButtonStyle.outline,
          onPressed: () => context.push('/professional/request-preview'),
        ),
      ],
    ),
  );
}

class ProfileHomeScreen extends ConsumerStatefulWidget {
  const ProfileHomeScreen({super.key});
  @override
  ConsumerState<ProfileHomeScreen> createState() => _ProfileHomeScreenState();
}

class _ProfileHomeScreenState extends ConsumerState<ProfileHomeScreen> {
  String? _locationMessage;
  Future<void> _location() async {
    final result = await LocationService().currentPosition();
    if (!mounted) return;
    setState(
      () => _locationMessage = result.state == CapabilityState.ready
          ? 'Location ready · ${result.value!.latitude.toStringAsFixed(3)}, ${result.value!.longitude.toStringAsFixed(3)}'
          : result.message,
    );
  }

  @override
  Widget build(BuildContext context) {
    final records = ref.watch(serviceHistoryProvider).value ?? const [];
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(24, 22, 24, 30),
        children: [
          const TCKicker('12B Galle Road · Colombo 05'),
          const SizedBox(height: 5),
          const TCDisplay('My Home', size: 34),
          const SizedBox(height: 3),
          const Text(
            'Service history & maintenance records',
            style: TextStyle(color: TCColors.ink400, fontSize: 13.5),
          ),
          const SizedBox(height: 18),
          TCSurface(
            color: TCColors.ink900,
            borderColor: TCColors.ink900,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const TCKicker('Your home', color: TCColors.teal200),
                const SizedBox(height: 6),
                Text(
                  'Apartment 3F',
                  style: context.display.copyWith(
                    color: Colors.white,
                    fontSize: 26,
                  ),
                ),
                const SizedBox(height: 18),
                const Row(
                  children: [
                    Expanded(
                      child: TCMetric(value: '7', label: 'Jobs done'),
                    ),
                    Expanded(
                      child: TCMetric(value: '2', label: 'Warranties'),
                    ),
                    Expanded(
                      child: TCMetric(value: '3', label: 'Spaces'),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          TCSurface(
            onTap: _location,
            child: Row(
              children: [
                const Icon(Icons.my_location_rounded, color: TCColors.teal800),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Location preference',
                        style: TextStyle(
                          color: TCColors.ink900,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        _locationMessage ??
                            'Colombo 05 · Tap to verify or use manually',
                        style: const TextStyle(
                          color: TCColors.ink400,
                          fontSize: 12.5,
                        ),
                      ),
                    ],
                  ),
                ),
                const Icon(
                  Icons.arrow_forward_ios_rounded,
                  color: TCColors.ink300,
                  size: 15,
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          _LanguagePicker(),
          const SizedBox(height: 20),
          const TCKicker('Service history', color: TCColors.ink400),
          const SizedBox(height: 9),
          for (final record in records)
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: TCSurface(
                radius: 13,
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 9,
                        vertical: 5,
                      ),
                      decoration: BoxDecoration(
                        color: record.room == 'Kitchen'
                            ? TCColors.teal100
                            : TCColors.ink100,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        record.room,
                        style: TextStyle(
                          color: record.room == 'Kitchen'
                              ? TCColors.teal800
                              : TCColors.ink700,
                          fontFamily: 'DMMono',
                          fontSize: 10,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    const SizedBox(width: 11),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            record.service,
                            style: const TextStyle(
                              color: TCColors.ink900,
                              fontWeight: FontWeight.w700,
                              fontSize: 13.5,
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            '${record.professional} · ${record.dateLabel}',
                            style: const TextStyle(
                              color: TCColors.ink400,
                              fontSize: 11.5,
                            ),
                          ),
                          if (record.warranty != null) ...[
                            const SizedBox(height: 6),
                            Text(
                              record.warranty!,
                              style: const TextStyle(
                                color: TCColors.success700,
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          TCButton(
            label: 'Add a space',
            style: TCButtonStyle.outline,
            onPressed: () {},
          ),
        ],
      ),
    );
  }
}

class _LanguagePicker extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final locale = ref.watch(localeProvider);
    return TCSurface(
      child: Row(
        children: [
          const Icon(Icons.translate_rounded, color: TCColors.teal800),
          const SizedBox(width: 12),
          const Expanded(
            child: Text(
              'App language',
              style: TextStyle(
                color: TCColors.ink900,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: locale,
              items: const [
                DropdownMenuItem(value: 'en', child: Text('English')),
                DropdownMenuItem(value: 'si', child: Text('සිංහල')),
                DropdownMenuItem(value: 'ta', child: Text('தமிழ்')),
              ],
              onChanged: (value) {
                if (value != null) {
                  ref.read(localeProvider.notifier).state = value;
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}

class ProfessionalRequestScreen extends StatelessWidget {
  const ProfessionalRequestScreen({super.key});
  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: TCColors.canvas,
    body: SafeArea(
      child: Column(
        children: [
          Container(
            color: TCColors.ink900,
            padding: const EdgeInsets.fromLTRB(22, 18, 22, 22),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 34,
                      height: 34,
                      decoration: BoxDecoration(
                        color: TCColors.teal700,
                        borderRadius: BorderRadius.circular(11),
                      ),
                      child: const Icon(
                        Icons.shield_outlined,
                        color: Colors.white,
                        size: 19,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Text(
                      'TrustCraft',
                      style: context.display.copyWith(
                        color: Colors.white,
                        fontSize: 22,
                      ),
                    ),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 9,
                        vertical: 5,
                      ),
                      decoration: BoxDecoration(
                        color: TCColors.teal900,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: TCColors.teal800),
                      ),
                      child: const Text(
                        'PRO',
                        style: TextStyle(
                          color: TCColors.teal200,
                          fontFamily: 'DMMono',
                          fontSize: 10,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 22),
                const Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          TCKicker(
                            'New request · plumbing',
                            color: TCColors.teal200,
                          ),
                          SizedBox(height: 6),
                          TCDisplay(
                            'Possible sink\nconnection leak',
                            size: 28,
                            color: Colors.white,
                          ),
                        ],
                      ),
                    ),
                    Chip(
                      label: Text(
                        'MODERATE',
                        style: TextStyle(
                          color: Colors.white,
                          fontFamily: 'DMMono',
                          fontSize: 10,
                        ),
                      ),
                      backgroundColor: TCColors.warning700,
                      side: BorderSide.none,
                    ),
                  ],
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(22),
              children: [
                const TCSurface(
                  child: Column(
                    children: [
                      TCInfoRow(
                        label: 'Location',
                        value: 'Colombo 05 · 2.4 km',
                        icon: Icons.location_on_outlined,
                      ),
                      Divider(height: 1, color: TCColors.ink100),
                      TCInfoRow(
                        label: 'Availability',
                        value: '4:30 PM – 7:00 PM',
                        icon: Icons.calendar_today_outlined,
                      ),
                      Divider(height: 1, color: TCColors.ink100),
                      TCInfoRow(
                        label: 'Inspection fee',
                        value: 'LKR 1,000',
                        icon: Icons.payments_outlined,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                const TCSurface(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      TCKicker('Customer evidence', color: TCColors.ink400),
                      SizedBox(height: 10),
                      Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.all(Radius.circular(10)),
                            child: Image(
                              image: AssetImage('assets/images/kitchen.jpg'),
                              width: 68,
                              height: 68,
                              fit: BoxFit.cover,
                            ),
                          ),
                          SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '3 photos · 1 voice note',
                                  style: TextStyle(
                                    color: TCColors.ink900,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                                SizedBox(height: 4),
                                Text(
                                  'AI confidence 87%',
                                  style: TextStyle(
                                    color: TCColors.ink400,
                                    fontSize: 12.5,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                const TCSurface(
                  color: TCColors.teal50,
                  borderColor: TCColors.teal200,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      TCKicker('AI summary'),
                      SizedBox(height: 7),
                      Text(
                        'Continuous leak reported beneath the kitchen sink. Local shutoff status is unknown. Professional assessment required.',
                        style: TextStyle(
                          color: TCColors.teal950,
                          height: 1.5,
                          fontSize: 13.5,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                TCButton(
                  label: 'Accept Request',
                  onPressed: () => context.push('/booking/appointment'),
                ),
                const SizedBox(height: 9),
                TCButton(
                  label: 'Ask a Question',
                  style: TCButtonStyle.outline,
                  onPressed: () {},
                ),
                const SizedBox(height: 9),
                TextButton(
                  onPressed: () => context.pop(),
                  child: const Text(
                    'Decline request',
                    style: TextStyle(color: TCColors.ink400),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    ),
  );
}

class EmptyStateScreen extends StatelessWidget {
  const EmptyStateScreen({super.key, required this.kind});
  final String kind;
  @override
  Widget build(BuildContext context) => TCScrollPage(
    title: 'Service status',
    children: [
      const SizedBox(height: 80),
      const Center(
        child: CircleAvatar(
          radius: 34,
          backgroundColor: TCColors.ink100,
          child: Icon(Icons.wifi_off_rounded, color: TCColors.ink500, size: 29),
        ),
      ),
      const SizedBox(height: 18),
      TCDisplay(
        kind == 'matches' ? 'No matches yet' : 'We could not refresh',
        size: 29,
        textAlign: TextAlign.center,
      ),
      const SizedBox(height: 8),
      Text(
        kind == 'matches'
            ? 'Try a wider time window or a nearby service area. Your request is saved.'
            : 'You appear to be offline. Existing job details remain available.',
        textAlign: TextAlign.center,
        style: const TextStyle(color: TCColors.ink400, height: 1.5),
      ),
      const SizedBox(height: 22),
      TCButton(label: 'Try again', onPressed: () => context.pop()),
    ],
  );
}
