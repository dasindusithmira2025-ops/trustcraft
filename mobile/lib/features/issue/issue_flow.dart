import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/providers.dart';
import '../../core/design_system/tc_widgets.dart';
import '../../core/theme/tc_theme.dart';
import '../../domain/models.dart';
import '../../services/native_services.dart';

class CameraCaptureScreen extends StatefulWidget {
  const CameraCaptureScreen({super.key});
  @override
  State<CameraCaptureScreen> createState() => _CameraCaptureScreenState();
}

class _CameraCaptureScreenState extends State<CameraCaptureScreen> {
  final _media = DeviceMediaCaptureService();
  String? _path;
  String? _message;
  bool _busy = false;

  Future<void> _pick(bool camera) async {
    setState(() {
      _busy = true;
      _message = null;
    });
    final result = camera
        ? await _media.captureCamera()
        : await _media.selectGallery();
    if (!mounted) return;
    setState(() {
      _busy = false;
      _path = result.value;
      _message = result.message;
    });
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: Colors.black,
    body: Stack(
      fit: StackFit.expand,
      children: [
        Image(
          image: _path == null
              ? const AssetImage('assets/images/kitchen.jpg')
              : FileImage(File(_path!)) as ImageProvider,
          fit: BoxFit.cover,
          color: Colors.black.withValues(alpha: .26),
          colorBlendMode: BlendMode.darken,
        ),
        SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(12),
                child: Row(
                  children: [
                    IconButton.filled(
                      onPressed: () => context.pop(),
                      style: IconButton.styleFrom(
                        backgroundColor: Colors.black45,
                      ),
                      icon: const Icon(
                        Icons.arrow_back_ios_new_rounded,
                        color: Colors.white,
                        size: 19,
                      ),
                    ),
                    const Expanded(
                      child: Text(
                        'Frame the problem area',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    IconButton.filled(
                      onPressed: () {},
                      style: IconButton.styleFrom(
                        backgroundColor: Colors.black45,
                      ),
                      icon: const Icon(
                        Icons.flash_off_rounded,
                        color: Colors.white,
                        size: 20,
                      ),
                    ),
                  ],
                ),
              ),
              const Spacer(),
              Semantics(
                label: 'Camera framing guide',
                child: SizedBox(
                  width: 238,
                  height: 238,
                  child: CustomPaint(painter: _CornerPainter()),
                ),
              ),
              if (_message != null)
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Text(
                    _message!,
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: Colors.white),
                  ),
                ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.fromLTRB(28, 22, 28, 30),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black.withValues(alpha: .85),
                    ],
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    IconButton(
                      onPressed: _busy ? null : () => _pick(false),
                      tooltip: 'Choose from gallery',
                      icon: const Icon(
                        Icons.photo_library_outlined,
                        color: Colors.white,
                        size: 30,
                      ),
                    ),
                    Semantics(
                      button: true,
                      label: 'Take photo',
                      child: GestureDetector(
                        onTap: _busy ? null : () => _pick(true),
                        child: Container(
                          width: 78,
                          height: 78,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 4),
                          ),
                          child: Center(
                            child: Container(
                              width: 56,
                              height: 56,
                              decoration: const BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                    IconButton(
                      onPressed: _path == null || _busy
                          ? null
                          : () => context.push('/issue/analyzing'),
                      tooltip: 'Use photo',
                      icon: Icon(
                        Icons.arrow_forward_rounded,
                        color: _path == null ? Colors.white38 : Colors.white,
                        size: 31,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        if (_busy)
          const Center(child: CircularProgressIndicator(color: Colors.white)),
      ],
    ),
  );
}

class _CornerPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withValues(alpha: .86)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.square;
    const l = 36.0;
    final path = Path()
      ..moveTo(0, l)
      ..lineTo(0, 0)
      ..lineTo(l, 0)
      ..moveTo(size.width - l, 0)
      ..lineTo(size.width, 0)
      ..lineTo(size.width, l)
      ..moveTo(size.width, size.height - l)
      ..lineTo(size.width, size.height)
      ..lineTo(size.width - l, size.height)
      ..moveTo(l, size.height)
      ..lineTo(0, size.height)
      ..lineTo(0, size.height - l);
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(_CornerPainter oldDelegate) => false;
}

class VoiceCaptureScreen extends StatefulWidget {
  const VoiceCaptureScreen({super.key});
  @override
  State<VoiceCaptureScreen> createState() => _VoiceCaptureScreenState();
}

class _VoiceCaptureScreenState extends State<VoiceCaptureScreen>
    with SingleTickerProviderStateMixin {
  final RecordingService _recording = DeviceRecordingService();
  late final AnimationController _wave = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 900),
  )..repeat(reverse: true);
  Timer? _timer;
  int _seconds = 0;
  bool _recordingActive = false;
  bool _paused = false;
  String? _message;

  @override
  void initState() {
    super.initState();
    scheduleMicrotask(_start);
  }

  Future<void> _start() async {
    final result = await _recording.start();
    if (!mounted) return;
    if (result.state != CapabilityState.ready) {
      setState(() => _message = result.message);
      return;
    }
    setState(() => _recordingActive = true);
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted && !_paused) setState(() => _seconds++);
    });
  }

  Future<void> _togglePause() async {
    if (_paused) {
      await _recording.resume();
    } else {
      await _recording.pause();
    }
    setState(() => _paused = !_paused);
  }

  Future<void> _finish() async {
    if (_recordingActive) await _recording.stop();
    if (mounted) {
      await context.push('/issue/analyzing');
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    _wave.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => TCScrollPage(
    title: 'Voice Input',
    bottom: TCButton(
      label: _recordingActive ? 'Stop & Analyse' : 'Continue with demo audio',
      icon: Icons.stop_rounded,
      style: TCButtonStyle.dark,
      onPressed: _finish,
    ),
    children: [
      const SizedBox(height: 68),
      Center(
        child: Container(
          width: 14,
          height: 14,
          decoration: BoxDecoration(
            color: _recordingActive ? TCColors.danger700 : TCColors.ink300,
            shape: BoxShape.circle,
          ),
        ),
      ),
      const SizedBox(height: 28),
      const TCDisplay('Listening…', textAlign: TextAlign.center),
      const SizedBox(height: 8),
      Text(
        _message ?? 'Describe what happened in your own words',
        textAlign: TextAlign.center,
        style: const TextStyle(color: TCColors.ink400, fontSize: 15),
      ),
      const SizedBox(height: 42),
      SizedBox(
        height: 64,
        child: Center(
          child: AnimatedBuilder(
            animation: _wave,
            builder: (context, _) => Row(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: List.generate(11, (index) {
                final factor =
                    _paused || MediaQuery.disableAnimationsOf(context)
                    ? .25
                    : ((_wave.value + index * .17) % 1);
                return Container(
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  width: 5,
                  height: 8 + (36 * factor),
                  decoration: BoxDecoration(
                    color: TCColors.teal800,
                    borderRadius: BorderRadius.circular(4),
                  ),
                );
              }),
            ),
          ),
        ),
      ),
      const SizedBox(height: 34),
      Text(
        '0:${_seconds.toString().padLeft(2, '0')}',
        textAlign: TextAlign.center,
        style: context.data.copyWith(
          fontSize: 36,
          color: TCColors.ink700,
          letterSpacing: 0,
        ),
      ),
      const SizedBox(height: 18),
      Center(
        child: IconButton.filledTonal(
          onPressed: _recordingActive ? _togglePause : null,
          tooltip: _paused ? 'Resume recording' : 'Pause recording',
          icon: Icon(_paused ? Icons.play_arrow_rounded : Icons.pause_rounded),
        ),
      ),
      const SizedBox(height: 32),
      const TCSurface(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TCKicker('Transcription · mocked', color: TCColors.ink400),
            SizedBox(height: 9),
            Text(
              '“There is water leaking from under my kitchen sink. It started this morning and it is—”',
              style: TextStyle(
                fontSize: 15,
                height: 1.5,
                color: TCColors.ink700,
              ),
            ),
          ],
        ),
      ),
    ],
  );
}

class DescribeIssueScreen extends StatelessWidget {
  const DescribeIssueScreen({super.key});
  @override
  Widget build(BuildContext context) => TCScrollPage(
    title: 'Describe the problem',
    bottom: TCButton(
      label: 'Understand my problem',
      icon: Icons.auto_awesome_outlined,
      onPressed: () => context.push('/issue/analyzing'),
    ),
    children: const [
      SizedBox(height: 16),
      TCKicker('In your own words'),
      SizedBox(height: 8),
      TCDisplay('Tell us what you noticed', size: 30),
      SizedBox(height: 20),
      TextField(
        minLines: 6,
        maxLines: 10,
        decoration: InputDecoration(
          hintText: 'Example: Water is leaking beneath my kitchen sink, even when I am not using the tap.',
        ),
      ),
      SizedBox(height: 14),
      Text(
        'AI assistance is preliminary. A qualified professional confirms the final diagnosis.',
        style: TextStyle(fontSize: 12.5, height: 1.5, color: TCColors.ink400),
      ),
    ],
  );
}

class AnalysingScreen extends StatefulWidget {
  const AnalysingScreen({super.key});
  @override
  State<AnalysingScreen> createState() => _AnalysingScreenState();
}

class _AnalysingScreenState extends State<AnalysingScreen> {
  int _step = 0;
  final _timers = <Timer>[];
  @override
  void initState() {
    super.initState();
    _timers.addAll([
      Timer(
        const Duration(milliseconds: 450),
        () => mounted ? setState(() => _step = 1) : null,
      ),
      Timer(
        const Duration(milliseconds: 950),
        () => mounted ? setState(() => _step = 2) : null,
      ),
      Timer(
        const Duration(milliseconds: 1450),
        () => mounted ? setState(() => _step = 3) : null,
      ),
      Timer(const Duration(milliseconds: 1900), () {
        if (mounted) context.go('/issue/problem');
      }),
    ]);
  }

  @override
  void dispose() {
    for (final timer in _timers) {
      timer.cancel();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const steps = [
      'Identifying problem type…',
      'Analysing available evidence…',
      'Assessing urgency level…',
    ];
    return TCPage(
      background: TCColors.ink900,
      padding: const EdgeInsets.all(28),
      child: Center(
        child: SingleChildScrollView(
          child: Column(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Stack(
                  children: [
                    Image.asset(
                      'assets/images/kitchen.jpg',
                      width: 210,
                      height: 160,
                      fit: BoxFit.cover,
                      color: Colors.black26,
                      colorBlendMode: BlendMode.darken,
                    ),
                    Positioned.fill(
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          border: Border.all(color: TCColors.teal600),
                          borderRadius: BorderRadius.circular(20),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 36),
              const TCDisplay(
                'Understanding\nyour problem',
                size: 29,
                color: Colors.white,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 9),
              Text(
                'AI-ASSISTED · A MOMENT',
                style: context.data.copyWith(
                  color: Colors.white38,
                  fontSize: 10,
                ),
              ),
              const SizedBox(height: 38),
              for (int i = 0; i < steps.length; i++)
                Padding(
                  padding: const EdgeInsets.only(bottom: 15),
                  child: AnimatedOpacity(
                    duration: TCMotion.standard,
                    opacity: i < _step ? 1 : .22,
                    child: Row(
                      children: [
                        Container(
                          width: 22,
                          height: 22,
                          decoration: BoxDecoration(
                            color: i < _step
                                ? TCColors.teal700
                                : Colors.white10,
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            i < _step ? Icons.check_rounded : Icons.circle,
                            color: Colors.white,
                            size: i < _step ? 14 : 5,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Text(
                          steps[i],
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class ProblemCanvasScreen extends ConsumerWidget {
  const ProblemCanvasScreen({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final analysis =
        ref.watch(analysisProvider).value ?? MockProblemFallback.analysis;
    return Scaffold(
      backgroundColor: Colors.black,
      body: LayoutBuilder(
        builder: (context, constraints) {
          final photoHeight = (constraints.maxHeight * .47).clamp(300.0, 430.0);
          return Stack(
            children: [
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                height: photoHeight + 22,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    Image.asset('assets/images/kitchen.jpg', fit: BoxFit.cover),
                    const DecoratedBox(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.black38,
                            Colors.transparent,
                            Colors.black87,
                          ],
                        ),
                      ),
                    ),
                    SafeArea(
                      child: Align(
                        alignment: Alignment.topLeft,
                        child: Padding(
                          padding: const EdgeInsets.all(10),
                          child: IconButton.filled(
                            onPressed: () => context.pop(),
                            style: IconButton.styleFrom(
                              backgroundColor: Colors.black45,
                            ),
                            icon: const Icon(
                              Icons.arrow_back_ios_new_rounded,
                              color: Colors.white,
                              size: 19,
                            ),
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      top: 54,
                      right: 18,
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: .68),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.white12),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'AI CONFIDENCE',
                              style: context.data.copyWith(
                                color: Colors.white54,
                                fontSize: 9,
                              ),
                            ),
                            const SizedBox(height: 7),
                            Row(
                              children: [
                                SizedBox(
                                  width: 76,
                                  child: LinearProgressIndicator(
                                    value: analysis.confidence,
                                    minHeight: 6,
                                    borderRadius: BorderRadius.circular(4),
                                    color: TCColors.teal600,
                                    backgroundColor: Colors.white24,
                                  ),
                                ),
                                const SizedBox(width: 9),
                                Text(
                                  '${(analysis.confidence * 100).round()}%',
                                  style: context.data.copyWith(
                                    color: Colors.white,
                                    fontSize: 14,
                                    letterSpacing: 0,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 38,
                      left: 20,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.black54,
                          borderRadius: BorderRadius.circular(30),
                        ),
                        child: const Row(
                          children: [
                            CircleAvatar(
                              radius: 14,
                              backgroundColor: TCColors.warning700,
                              child: Icon(
                                Icons.priority_high_rounded,
                                size: 17,
                                color: Colors.white,
                              ),
                            ),
                            SizedBox(width: 8),
                            Text(
                              'Leak area detected',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Positioned(
                top: photoHeight,
                left: 0,
                right: 0,
                bottom: 0,
                child: Container(
                  decoration: const BoxDecoration(
                    color: TCColors.canvas,
                    borderRadius: BorderRadius.vertical(
                      top: Radius.circular(26),
                    ),
                  ),
                  child: ListView(
                    padding: const EdgeInsets.fromLTRB(24, 12, 24, 30),
                    children: [
                      Center(
                        child: Container(
                          width: 42,
                          height: 4,
                          decoration: BoxDecoration(
                            color: TCColors.ink300,
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ),
                      ),
                      const SizedBox(height: 18),
                      const TCKicker('What we found'),
                      const SizedBox(height: 7),
                      TCDisplay(
                        'Possible leak near\nsink connection',
                        size: 29,
                      ),
                      const SizedBox(height: 18),
                      Row(
                        children: [
                          Expanded(
                            child: _AnalysisTile(
                              label: 'SERVICE',
                              value: analysis.category,
                              icon: Icons.plumbing_rounded,
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: _AnalysisTile(
                              label: 'URGENCY',
                              value: 'Moderate',
                              icon: Icons.timelapse_rounded,
                              accent: TCColors.warning700,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      TCSurface(
                        color: TCColors.gold100,
                        borderColor: TCColors.gold500.withValues(alpha: .2),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Icon(
                              Icons.health_and_safety_outlined,
                              color: TCColors.gold600,
                              size: 21,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const TCKicker(
                                    'Safety first',
                                    color: TCColors.gold600,
                                  ),
                                  const SizedBox(height: 5),
                                  Text(
                                    analysis.safetyGuidance,
                                    style: const TextStyle(
                                      fontSize: 13.5,
                                      height: 1.45,
                                      color: TCColors.ink700,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),
                      const Row(
                        children: [
                          Icon(
                            Icons.verified_user_outlined,
                            color: TCColors.ink500,
                            size: 18,
                          ),
                          SizedBox(width: 9),
                          Expanded(
                            child: Text(
                              'Professional assessment required for final diagnosis.',
                              style: TextStyle(
                                fontSize: 12.5,
                                color: TCColors.ink500,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      TCButton(
                        label: 'Answer one quick question',
                        onPressed: () => context.push('/issue/clarify'),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _AnalysisTile extends StatelessWidget {
  const _AnalysisTile({
    required this.label,
    required this.value,
    required this.icon,
    this.accent = TCColors.teal800,
  });
  final String label;
  final String value;
  final IconData icon;
  final Color accent;
  @override
  Widget build(BuildContext context) => TCSurface(
    padding: const EdgeInsets.all(13),
    radius: 13,
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TCKicker(label, color: TCColors.ink400),
        const SizedBox(height: 10),
        Row(
          children: [
            Container(
              width: 30,
              height: 30,
              decoration: BoxDecoration(
                color: accent.withValues(alpha: .12),
                borderRadius: BorderRadius.circular(9),
              ),
              child: Icon(icon, color: accent, size: 17),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                value,
                style: const TextStyle(
                  fontSize: 13.5,
                  color: TCColors.ink900,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ),
      ],
    ),
  );
}

class ClarificationScreen extends ConsumerWidget {
  const ClarificationScreen({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selected = ref.watch(selectedClarificationProvider);
    return TCScrollPage(
      title: 'One quick question',
      bottom: TCButton(
        label: 'Build my request',
        onPressed: selected == null
            ? null
            : () => context.push('/issue/confirm'),
      ),
      children: [
        const SizedBox(height: 24),
        const TCKicker('Help us refine this'),
        const SizedBox(height: 8),
        const TCDisplay(
          'Does the leak continue when the tap is closed?',
          size: 31,
        ),
        const SizedBox(height: 10),
        const Text(
          'Your answer helps us choose a better-qualified professional. It is not a final diagnosis.',
          style: TextStyle(fontSize: 14, color: TCColors.ink400, height: 1.5),
        ),
        const SizedBox(height: 28),
        for (final option in const ['Yes', 'No', 'Not sure'])
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: TCSurface(
              onTap: () {
                ref.read(selectedClarificationProvider.notifier).state = option;
                tcHaptic();
              },
              color: selected == option ? TCColors.teal50 : Colors.white,
              borderColor: selected == option
                  ? TCColors.teal700
                  : TCColors.ink200,
              child: Row(
                children: [
                  Container(
                    width: 22,
                    height: 22,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: selected == option
                            ? TCColors.teal700
                            : TCColors.ink300,
                        width: 2,
                      ),
                    ),
                    child: selected == option
                        ? const Center(
                            child: CircleAvatar(
                              radius: 6,
                              backgroundColor: TCColors.teal700,
                            ),
                          )
                        : null,
                  ),
                  const SizedBox(width: 13),
                  Text(
                    option,
                    style: const TextStyle(
                      fontSize: 15,
                      color: TCColors.ink900,
                      fontWeight: FontWeight.w600,
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

class StructuredRequestScreen extends StatelessWidget {
  const StructuredRequestScreen({super.key});
  @override
  Widget build(BuildContext context) => TCScrollPage(
    title: 'Service request',
    bottom: TCButton(
      label: 'Find trusted professionals',
      icon: Icons.arrow_forward_rounded,
      onPressed: () => context.push('/matches'),
    ),
    children: [
      const SizedBox(height: 10),
      const TCKicker('Ready to match'),
      const SizedBox(height: 7),
      const TCDisplay('Your request,\nmade clear', size: 31),
      const SizedBox(height: 20),
      TCSurface(
        color: TCColors.ink900,
        borderColor: TCColors.ink900,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const TCKicker('Structured request', color: TCColors.teal200),
            const SizedBox(height: 10),
            const Text(
              'Kitchen sink connection leak',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 5),
            const Text(
              'Colombo 05 · Moderate urgency',
              style: TextStyle(color: Colors.white54, fontSize: 13),
            ),
            const SizedBox(height: 18),
            Row(
              children: const [
                Expanded(
                  child: _DarkMetric(value: '87%', label: 'AI confidence'),
                ),
                Expanded(
                  child: _DarkMetric(value: '3', label: 'Evidence items'),
                ),
                Expanded(
                  child: _DarkMetric(value: 'Today', label: 'Preferred'),
                ),
              ],
            ),
          ],
        ),
      ),
      const SizedBox(height: 14),
      const TCSurface(
        child: Column(
          children: [
            TCInfoRow(
              label: 'Likely service',
              value: 'Plumbing',
              icon: Icons.plumbing_rounded,
            ),
            Divider(height: 1, color: TCColors.ink100),
            TCInfoRow(
              label: 'Tap closed',
              value: 'Still leaking',
              icon: Icons.water_drop_outlined,
            ),
            Divider(height: 1, color: TCColors.ink100),
            TCInfoRow(
              label: 'Assessment',
              value: 'Required',
              icon: Icons.verified_user_outlined,
            ),
          ],
        ),
      ),
      const SizedBox(height: 14),
      const Text(
        'We will share this summary and your evidence only with professionals you choose.',
        style: TextStyle(fontSize: 12.5, color: TCColors.ink400, height: 1.5),
      ),
    ],
  );
}

class _DarkMetric extends StatelessWidget {
  const _DarkMetric({required this.value, required this.label});
  final String value;
  final String label;
  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(
        value,
        style: context.data.copyWith(
          color: Colors.white,
          fontSize: 18,
          letterSpacing: 0,
        ),
      ),
      const SizedBox(height: 3),
      Text(label, style: const TextStyle(color: Colors.white38, fontSize: 10)),
    ],
  );
}

abstract final class MockProblemFallback {
  static const analysis = ProblemAnalysis(
    category: 'Plumbing',
    possibleIssue: 'Leak near sink connection',
    urgency: Urgency.moderate,
    confidence: .87,
    observations: [],
    safetyGuidance: 'Turn off the local water valve if safely accessible.',
    questions: [],
    requiresProfessionalAssessment: true,
  );
}
