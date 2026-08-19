import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/design_system/tc_widgets.dart';
import '../../core/localization/tc_localizations.dart';
import '../../core/theme/tc_theme.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final copy = TCLocalizations.of(context);
    return SafeArea(
      child: LayoutBuilder(
        builder: (context, constraints) => ListView(
          key: const Key('home-scroll'),
          padding: EdgeInsets.fromLTRB(
            constraints.maxWidth < 380 ? 18 : 24,
            18,
            constraints.maxWidth < 380 ? 18 : 24,
            28,
          ),
          children: [
            Row(
              children: [
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Good afternoon,',
                        style: TextStyle(
                          color: TCColors.ink400,
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      Text(
                        'Nadeesha',
                        style: TextStyle(
                          color: TCColors.ink900,
                          fontSize: 17,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton.filledTonal(
                  onPressed: () {},
                  tooltip: 'Notifications',
                  icon: const Icon(Icons.notifications_none_rounded, size: 21),
                ),
                const SizedBox(width: 6),
                const CircleAvatar(
                  radius: 19,
                  backgroundColor: TCColors.teal800,
                  child: Text(
                    'N',
                    style: TextStyle(
                      color: Colors.white,
                      fontFamily: 'InstrumentSerif',
                      fontSize: 17,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 28),
            TCDisplay(
              copy.t('question').replaceFirst(' ', '\n'),
              size: constraints.maxWidth < 380 ? 38 : 44,
            ),
            const SizedBox(height: 12),
            Text(
              copy.t('subtitle'),
              style: const TextStyle(
                color: TCColors.ink500,
                height: 1.55,
                fontSize: 15,
              ),
            ),
            const SizedBox(height: 26),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: _InputMode(
                    label: 'SHOW IT',
                    caption: 'Camera',
                    icon: Icons.photo_camera_outlined,
                    onTap: () => context.push('/issue/capture'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _InputMode(
                    label: 'TELL US',
                    caption: 'Voice',
                    icon: Icons.mic_none_rounded,
                    primary: true,
                    onTap: () => context.push('/issue/voice'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _InputMode(
                    label: 'DESCRIBE',
                    caption: 'Text',
                    icon: Icons.subject_rounded,
                    onTap: () => context.push('/issue/describe'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),
            TextButton.icon(
              onPressed: () {},
              iconAlignment: IconAlignment.end,
              icon: const Icon(Icons.arrow_forward_rounded, size: 17),
              label: const Text('Browse all services'),
            ),
            const Divider(height: 40, color: TCColors.ink200),
            TCSurface(
              onTap: () => context.push('/job/kitchen-sink-01'),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            TCKicker('Active job'),
                            SizedBox(height: 6),
                            Text(
                              'Kitchen Sink Repair',
                              style: TextStyle(
                                fontSize: 15,
                                color: TCColors.ink900,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            SizedBox(height: 3),
                            Text(
                              'Chamod Fernando · Repair in progress',
                              style: TextStyle(
                                fontSize: 12.5,
                                color: TCColors.ink500,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        width: 34,
                        height: 34,
                        decoration: const BoxDecoration(
                          color: TCColors.teal100,
                          shape: BoxShape.circle,
                        ),
                        child: const Center(child: _PulseDot()),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  const Row(
                    children: [
                      Expanded(
                        child: LinearProgressIndicator(
                          value: .62,
                          minHeight: 6,
                          borderRadius: BorderRadius.all(Radius.circular(6)),
                          color: TCColors.teal700,
                          backgroundColor: TCColors.ink100,
                        ),
                      ),
                      SizedBox(width: 12),
                      Text(
                        '5 / 8',
                        style: TextStyle(
                          fontFamily: 'DMMono',
                          color: TCColors.ink400,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 22),
            Row(
              children: [
                const Expanded(
                  child: TCKicker('My home', color: TCColors.ink400),
                ),
                TextButton(
                  onPressed: () => context.go('/profile'),
                  child: const Text('View all'),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Row(
              children: const [
                Expanded(
                  child: _HomePreview(
                    room: 'Kitchen',
                    service: 'Sink connector replaced',
                    date: 'Aug 2026',
                  ),
                ),
                SizedBox(width: 10),
                Expanded(
                  child: _HomePreview(
                    room: 'Bedroom AC',
                    service: 'Serviced',
                    date: 'Jul 2026',
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _InputMode extends StatelessWidget {
  const _InputMode({
    required this.label,
    required this.caption,
    required this.icon,
    required this.onTap,
    this.primary = false,
  });
  final String label;
  final String caption;
  final IconData icon;
  final VoidCallback onTap;
  final bool primary;

  @override
  Widget build(BuildContext context) => Semantics(
    button: true,
    label: '$label, $caption',
    child: Material(
      color: primary ? TCColors.teal800 : Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: BorderSide(color: primary ? TCColors.teal800 : TCColors.ink200),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 5),
          child: Column(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: primary
                      ? Colors.white.withValues(alpha: .16)
                      : TCColors.ink100,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  icon,
                  color: primary ? Colors.white : TCColors.teal800,
                  size: 21,
                ),
              ),
              const SizedBox(height: 11),
              Text(
                label,
                style: TextStyle(
                  fontFamily: 'DMMono',
                  fontSize: 10,
                  letterSpacing: 1.1,
                  fontWeight: FontWeight.w500,
                  color: primary ? Colors.white : TCColors.teal800,
                ),
              ),
              const SizedBox(height: 3),
              Text(
                caption,
                style: TextStyle(
                  fontSize: 11,
                  color: primary ? Colors.white54 : TCColors.ink400,
                ),
              ),
            ],
          ),
        ),
      ),
    ),
  );
}

class _HomePreview extends StatelessWidget {
  const _HomePreview({
    required this.room,
    required this.service,
    required this.date,
  });
  final String room;
  final String service;
  final String date;

  @override
  Widget build(BuildContext context) => TCSurface(
    padding: const EdgeInsets.all(13),
    radius: 13,
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          room,
          style: const TextStyle(color: TCColors.ink400, fontSize: 11),
        ),
        const SizedBox(height: 4),
        Text(
          service,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(
            color: TCColors.ink900,
            fontSize: 13,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 9),
        Text(
          date,
          style: const TextStyle(color: TCColors.ink400, fontSize: 11),
        ),
      ],
    ),
  );
}

class _PulseDot extends StatefulWidget {
  const _PulseDot();
  @override
  State<_PulseDot> createState() => _PulseDotState();
}

class _PulseDotState extends State<_PulseDot>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1300),
  )..repeat(reverse: true);
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.disableAnimationsOf(context)) {
      return const CircleAvatar(radius: 6, backgroundColor: TCColors.teal700);
    }
    return FadeTransition(
      opacity: Tween(begin: .35, end: 1.0).animate(_controller),
      child: const CircleAvatar(radius: 6, backgroundColor: TCColors.teal700),
    );
  }
}
