import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/localization/tc_localizations.dart';
import '../core/theme/tc_theme.dart';
import 'providers.dart';
import 'router.dart';

class TrustCraftApp extends ConsumerWidget {
  const TrustCraftApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final locale = Locale(ref.watch(localeProvider));
    return MaterialApp.router(
      title: 'TrustCraft',
      debugShowCheckedModeBanner: false,
      theme: TCTheme.light,
      routerConfig: trustCraftRouter,
      locale: locale,
      supportedLocales: TCLocalizations.supportedLocales,
      localizationsDelegates: const [
        TCLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
    );
  }
}
