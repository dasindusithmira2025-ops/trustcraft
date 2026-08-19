import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/localization/tc_localizations.dart';
import '../../core/theme/tc_theme.dart';

class AppShell extends StatelessWidget {
  const AppShell({super.key, required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    final items = [
      ('/', 'home', Icons.home_rounded),
      ('/jobs', 'jobs', Icons.work_rounded),
      ('/messages', 'messages', Icons.chat_bubble_rounded),
      ('/profile', 'profile', Icons.person_rounded),
    ];
    int selected = items.indexWhere((item) => location == item.$1);
    if (selected < 0) selected = 0;
    final strings = TCLocalizations.of(context);
    return Scaffold(
      backgroundColor: TCColors.canvas,
      body: child,
      bottomNavigationBar: NavigationBar(
        height: 74,
        selectedIndex: selected,
        onDestinationSelected: (index) => context.go(items[index].$1),
        backgroundColor: Colors.white,
        indicatorColor: TCColors.teal100,
        destinations: [
          for (final item in items)
            NavigationDestination(
              icon: Icon(item.$3, color: TCColors.ink400),
              selectedIcon: Icon(item.$3, color: TCColors.teal800),
              label: strings.t(item.$2),
            ),
        ],
      ),
    );
  }
}
