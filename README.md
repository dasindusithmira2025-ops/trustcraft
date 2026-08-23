# TrustCraft

TrustCraft is a web-based decision workspace for home-service problems. It helps a customer understand an uncertain problem, decide who should handle it, agree in writing what the work is, prove it was done, and keep the record afterwards.

The unit of the product is a **Case**, not a service listing: problem evidence, what is known, what is still unknown, safety guidance, a recommended resolution path, curated professionals, quotations compared on scope, a work agreement, structured change requests, a proof timeline, and a permanent home record.

## Repository

- The root React + Vite application is the web workspace (`src/`), the primary product surface.
- `mobile/` is the production-structured Flutter application for Android and iOS.
- `scripts/` and `.vscode/` provide the automated Windows/VS Code workflow.
- `docs/migration-map.md` maps every reference screen to its semantic mobile route and state boundary.

## Web architecture

`src/` is a React 19 + Vite + Tailwind v4 application with no router or component-library dependency — routing is hash-based (`src/app-state.tsx`), which gives real URLs and working browser back/forward.

- `src/data.ts` — the single source of truth for the demo case (TC-2048). Every screen reads from it, so figures cannot disagree across surfaces.
- `src/evidence.ts` — evidence imagery drawn as SVG data URIs rather than sourced, so each picture shows the fault the case actually asserts, and renders with no network.
- `src/ui.tsx` — the design system: tokens-driven primitives, icons, tri-state scope marks, viewport-positioned tooltips.
- `src/shell.tsx` — the app shell, quiet primary navigation, and the case context bar.
- `src/pages/` — one file per surface group.

Signature screens: **What happened?** composer, **Problem Workspace** (evidence viewer + known/unknown intelligence rail), **Resolution Path**, **Professional Fit**, **Quote Lens**, **Work Agreement**, **Change Request**, **Proof Timeline**, **Home Ledger**.

Design target is 1440 × 1024, validated at 1280 × 832.

## Mobile architecture

The Flutter app uses `go_router` for domain routes and `flutter_riverpod` for coordinated application state. Feature UI is separated from typed domain models, repository contracts, deterministic mock repositories, native service adapters, localization, and the TrustCraft design system.

The design system preserves the prototype’s warm canvas, deep teal, ink, gold, Instrument Serif editorial headings, Inter body text, DM Mono evidence labels, calm motion, generous spacing, and evidence-first hierarchy. Stock Material behavior is used only as accessible infrastructure.

## Primary journeys

1. Understand — multimodal evidence, AI-assisted analysis, Problem Canvas, clarification, structured request.
2. Match — Match Stack, comparison, Why This Match, professional evidence, Trust Score, booking.
3. Agree — appointment, professional inspection, Repair Plan, Price Context, protected approval/payment simulation.
4. Resolve — living Service Timeline, completion evidence, customer verification, Resolved state, verified review, My Home record.

## Native capabilities

Camera/gallery, audio recording, location, permission handling, and haptics use cross-platform Flutter packages. Transcription, AI understanding, matching, pricing context, payment, job updates, messaging, and server trust records are currently deterministic mocks behind interfaces. The client contains no privileged secret.

English is complete for the competition scenario. Representative Sinhala and Tamil strings verify localization wiring, Unicode rendering, language switching, and layout expansion. Reduced-motion settings, semantic labels, 44+ px controls, keyboard-safe scrolling, error/cancel states, and non-color status cues are built in.

## Daily development in VS Code

Open the repository root and run the task **TrustCraft: Run Android**. It checks the dedicated `trustcraft_api36` AVD, starts it when needed, waits for Android's boot animation to stop and the activity service to become available, resolves packages, and launches the app.

Other tasks:

- **TrustCraft: Start Emulator**
- **TrustCraft: Verify** — prototype build, Flutter doctor, format check, analyzer, tests, debug APK
- **TrustCraft: Clean + Rebuild**
- Debug configuration: **TrustCraft: Debug Android**

Command-line equivalent:

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File .\scripts\run-android.ps1
```

## Platform status

Android is developed and runtime-validated on the dedicated Pixel 7-style API 36 emulator. The generated iOS project, Swift host, permissions, bundle identifier, packages, routing, state, UI, and capability abstractions remain cross-platform. iOS runtime/build validation still requires macOS/Xcode or a physical Apple development environment.

Validation on August 20, 2026 used Flutter 3.47.0, Dart 3.13.0, Android Emulator 37.1.11, and Android 16/API 36. `flutter analyze` completed with no issues, 7 unit/widget tests and 2 device integration tests passed, and the normal debug APK launched as `com.trustcraft.app`. Home, Problem Canvas, Match Stack, Trust Score, Repair Plan, Active Job, and Resolved were inspected on the emulator; Home was also checked at 360-, 390-, and 430-class widths. Camera capture returned a real emulator image and voice recording produced a real local M4A. Transcription and all backend authority remain mocked.

## Backend roadmap

Production services still need authentication, customer/professional accounts, professional verification, multimodal AI, media storage, matching and Trust Score engines, realtime job updates, messaging, payments, disputes, notifications, verified reviews, analytics, and admin operations. Identity, qualification, Trust Score, quote approval, payment settlement, completion state, dispute outcome, and review eligibility must be server-authoritative.
