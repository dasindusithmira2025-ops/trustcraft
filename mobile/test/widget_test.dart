import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:trustcraft/app/app.dart';
import 'package:trustcraft/core/design_system/tc_widgets.dart';

void main() {
  testWidgets('home exposes all multimodal issue entry points', (tester) async {
    await tester.pumpWidget(const ProviderScope(child: TrustCraftApp()));
    await tester.pump(const Duration(milliseconds: 100));

    expect(find.textContaining('What'), findsOneWidget);
    expect(find.text('SHOW IT'), findsOneWidget);
    expect(find.text('TELL US'), findsOneWidget);
    expect(find.text('DESCRIBE'), findsOneWidget);
    expect(find.text('Kitchen Sink Repair'), findsOneWidget);
  });

  testWidgets('TrustBadge exposes a semantic score', (tester) async {
    final semantics = tester.ensureSemantics();
    await tester.pumpWidget(
      const MaterialApp(home: Scaffold(body: TrustBadge(score: 92))),
    );
    final node = tester.getSemantics(find.byType(TrustBadge));
    expect(node.label, contains('Trust score 92'));
    semantics.dispose();
  });

  testWidgets('home remains usable across supported phone widths', (
    tester,
  ) async {
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetDevicePixelRatio);
    addTearDown(tester.view.resetPhysicalSize);

    for (final size in <Size>[
      const Size(360, 800),
      const Size(390, 844),
      const Size(430, 932),
    ]) {
      tester.view.physicalSize = size;
      await tester.pumpWidget(const ProviderScope(child: TrustCraftApp()));
      await tester.pump(const Duration(milliseconds: 100));

      expect(find.byKey(const Key('home-scroll')), findsOneWidget);
      expect(find.text('SHOW IT'), findsOneWidget);
      expect(tester.takeException(), isNull, reason: 'Failed at $size');
    }
  });
}
