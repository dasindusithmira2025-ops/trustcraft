# TrustCraft

TrustCraft is a web-based decision workspace for home-service problems. It helps a customer understand an uncertain problem, decide who should handle it, agree in writing what the work is, prove it was done, and keep the record afterwards.

The unit of the product is a **Case**, not a service listing: problem evidence, what is known, what is still unknown, safety guidance, a recommended resolution path, curated professionals, quotations compared on scope, a work agreement, structured change requests, a proof timeline, and a permanent home record.

## Stack

- React 19
- Vite 8
- Tailwind CSS v4
- TypeScript 5.7
- Firebase Hosting static output from `dist/`

## Web architecture

`src/` is a React 19 + Vite + Tailwind v4 application with no router or component-library dependency — routing is hash-based (`src/app-state.tsx`), which gives real URLs and working browser back/forward.

- `src/data.ts` — the single source of truth for the demo case (TC-2048). Every screen reads from it, so figures cannot disagree across surfaces.
- `src/evidence.ts` — evidence imagery drawn as SVG data URIs rather than sourced, so each picture shows the fault the case actually asserts, and renders with no network.
- `src/ui.tsx` — the design system: tokens-driven primitives, icons, tri-state scope marks, viewport-positioned tooltips.
- `src/shell.tsx` — the app shell, quiet primary navigation, and the case context bar.
- `src/pages/` — one file per surface group.

Signature screens: **What happened?** composer, **Problem Workspace** (evidence viewer + known/unknown intelligence rail), **Resolution Path**, **Professional Fit**, **Quote Lens**, **Work Agreement**, **Change Request**, **Proof Timeline**, **Home Ledger**.

Design target is 1440 × 1024, validated at 1280 × 832.

## Primary journeys

1. Understand — multimodal evidence, AI-assisted analysis, Problem Canvas, clarification, structured request.
2. Match — Match Stack, comparison, Why This Match, professional evidence, Trust Score, booking.
3. Agree — appointment, professional inspection, Repair Plan, Price Context, protected approval/payment simulation.
4. Resolve — living Service Timeline, completion evidence, customer verification, Resolved state, verified review, My Home record.

## Development

Install dependencies:

```bash
pnpm install
```

Run the local Vite server:

```bash
pnpm dev
```

Build the static web output:

```bash
pnpm build
```

## Backend roadmap

Production services still need authentication, customer/professional accounts, professional verification, multimodal AI, media storage, matching and Trust Score engines, realtime job updates, messaging, payments, disputes, notifications, verified reviews, analytics, and admin operations. Identity, qualification, Trust Score, quote approval, payment settlement, completion state, dispute outcome, and review eligibility must be server-authoritative.
