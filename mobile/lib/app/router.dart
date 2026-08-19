import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../features/home/home_screen.dart';
import '../features/issue/issue_flow.dart';
import '../features/jobs/jobs_flow.dart';
import '../features/matching/matching_flow.dart';
import '../features/shell/app_shell.dart';
import '../features/support/support_screens.dart';

final trustCraftRouter = GoRouter(
  initialLocation: '/',
  routes: [
    ShellRoute(
      builder: (context, state, child) => AppShell(child: child),
      routes: [
        GoRoute(
          path: '/',
          name: 'home',
          builder: (context, state) => const HomeScreen(),
        ),
        GoRoute(
          path: '/jobs',
          name: 'jobs',
          builder: (context, state) => const JobsOverviewScreen(),
        ),
        GoRoute(
          path: '/messages',
          name: 'messages',
          builder: (context, state) => const MessagesScreen(),
        ),
        GoRoute(
          path: '/profile',
          name: 'profile',
          builder: (context, state) => const ProfileHomeScreen(),
        ),
      ],
    ),
    GoRoute(
      path: '/issue/capture',
      builder: (context, state) => const CameraCaptureScreen(),
    ),
    GoRoute(
      path: '/issue/voice',
      builder: (context, state) => const VoiceCaptureScreen(),
    ),
    GoRoute(
      path: '/issue/describe',
      builder: (context, state) => const DescribeIssueScreen(),
    ),
    GoRoute(
      path: '/issue/analyzing',
      builder: (context, state) => const AnalysingScreen(),
    ),
    GoRoute(
      path: '/issue/problem',
      builder: (context, state) => const ProblemCanvasScreen(),
    ),
    GoRoute(
      path: '/issue/clarify',
      builder: (context, state) => const ClarificationScreen(),
    ),
    GoRoute(
      path: '/issue/confirm',
      builder: (context, state) => const StructuredRequestScreen(),
    ),
    GoRoute(
      path: '/matches',
      builder: (context, state) => const TopMatchesScreen(),
    ),
    GoRoute(
      path: '/matches/compare',
      builder: (context, state) => const CompareMatchesScreen(),
    ),
    GoRoute(
      path: '/matches/why',
      builder: (context, state) => const WhyMatchScreen(),
    ),
    GoRoute(
      path: '/matches/empty',
      builder: (context, state) => const EmptyStateScreen(kind: 'matches'),
    ),
    GoRoute(
      path: '/professional/request-preview',
      builder: (context, state) => const ProfessionalRequestScreen(),
    ),
    GoRoute(
      path: '/professional/:id',
      builder: (context, state) =>
          ProfessionalProfileScreen(id: state.pathParameters['id']!),
    ),
    GoRoute(
      path: '/professional/:id/trust',
      builder: (context, state) =>
          TrustScoreScreen(id: state.pathParameters['id']!),
    ),
    GoRoute(
      path: '/booking',
      builder: (context, state) => const BookingScreen(),
    ),
    GoRoute(
      path: '/booking/appointment',
      builder: (context, state) => const AppointmentScreen(),
    ),
    GoRoute(
      path: '/job/:id',
      builder: (context, state) => const ActiveJobScreen(),
    ),
    GoRoute(
      path: '/job/:id/inspection',
      builder: (context, state) => const InspectionScreen(),
    ),
    GoRoute(
      path: '/job/:id/quote',
      builder: (context, state) => const RepairPlanScreen(),
    ),
    GoRoute(
      path: '/job/:id/quote/price-context',
      builder: (context, state) => const PriceContextScreen(),
    ),
    GoRoute(
      path: '/job/:id/approve',
      builder: (context, state) => const ApprovalScreen(),
    ),
    GoRoute(
      path: '/job/:id/payment',
      builder: (context, state) => const PaymentScreen(),
    ),
    GoRoute(
      path: '/job/:id/verify',
      builder: (context, state) => const CompletionScreen(),
    ),
    GoRoute(
      path: '/job/:id/resolved',
      builder: (context, state) => const ResolvedScreen(),
    ),
    GoRoute(
      path: '/job/:id/review',
      builder: (context, state) => const ReviewScreen(),
    ),
    GoRoute(
      path: '/offline',
      builder: (context, state) => const EmptyStateScreen(kind: 'offline'),
    ),
  ],
  errorBuilder: (context, state) => Scaffold(
    body: SafeArea(
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.route_outlined, size: 42),
              const SizedBox(height: 14),
              const Text(
                'This TrustCraft route is unavailable.',
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 14),
              FilledButton(
                onPressed: () => context.go('/'),
                child: const Text('Return home'),
              ),
            ],
          ),
        ),
      ),
    ),
  ),
);
