import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:trustcraft/app/app.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('Flow A begins from all three evidence modes', (tester) async {
    await tester.pumpWidget(const ProviderScope(child: TrustCraftApp()));
    await tester.pump(const Duration(milliseconds: 300));
    expect(find.text('SHOW IT'), findsOneWidget);
    expect(find.text('TELL US'), findsOneWidget);
    expect(find.text('DESCRIBE'), findsOneWidget);
  });

  testWidgets('the active job keeps protected progress visible', (
    tester,
  ) async {
    await tester.pumpWidget(const ProviderScope(child: TrustCraftApp()));
    await tester.pump(const Duration(milliseconds: 300));
    expect(find.text('Kitchen Sink Repair'), findsOneWidget);
    expect(find.text('5 / 8'), findsOneWidget);
  });
}
