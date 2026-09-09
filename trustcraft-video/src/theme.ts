/**
 * TrustCraft design tokens — lifted verbatim from the product.
 * Colour ramp: trustcraft/src/index.css `@theme`.
 * Type: Inter, the family the app loads.
 * Nothing here is invented; the film is built from the real system.
 */

export const COLOR = {
  // Brand — the TrustCraft blue
  brand900: "#1E3A8A",
  brand800: "#1E40AF",
  brand700: "#1D4ED8",
  brand600: "#2563EB",
  brand500: "#3B82F6",
  brand400: "#60A5FA",
  brand300: "#93C5FD",
  brand200: "#BFDBFE",
  brand100: "#DBEAFE",
  brand50: "#EFF6FF",

  // Ink — near-black through slate to off-white
  ink950: "#020617",
  ink900: "#0F172A",
  ink800: "#1E293B",
  ink700: "#334155",
  ink600: "#475569",
  ink500: "#64748B",
  ink400: "#94A3B8",
  ink300: "#CBD5E1",
  ink200: "#E2E8F0",
  ink100: "#F1F5F9",
  ink50: "#F8FAFC",
  white: "#FFFFFF",

  success700: "#15803D",
  success600: "#16A34A",
  success100: "#DCFCE7",

  warning700: "#B45309",
  warning600: "#F59E0B",
  warning100: "#FEF3C7",

  danger600: "#DC2626",
  danger100: "#FEE2E2",

  gold500: "#F59E0B",
} as const;

/** The product's own body background — a radial wash from slate into deep space. */
export const CINEMATIC_BG =
  "radial-gradient(120% 120% at 50% 0%, #1E293B 0%, #0B1220 60%, #060A12 100%)";

export const FONT = "Inter, system-ui, -apple-system, Segoe UI, sans-serif";

/** Device geometry — the app's real `Frame` component. */
export const DEVICE = {
  width: 390,
  height: 844,
  radius: 44,
} as const;

/** Radii used across the product UI. */
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  card: 16,
  pill: 999,
} as const;

/** Professional fixtures — the real demo data from trustcraft/src/store.tsx. */
export const PROS = [
  {
    id: "kasun",
    name: "Kasun Perera",
    initials: "KP",
    trade: "Verified Plumber",
    trust: 94,
    rating: 4.9,
    reviews: 126,
    distanceKm: 2.4,
    years: 8,
    jobs: 412,
    inspectionFee: 1500,
    match: 94,
    hue: 212,
    availability: "Today · 8:00 AM to 8:00 PM",
  },
  {
    id: "nimal",
    name: "Nimal Fernando",
    initials: "NF",
    trade: "Verified Plumber",
    trust: 91,
    rating: 4.8,
    reviews: 98,
    distanceKm: 3.1,
    years: 6,
    jobs: 288,
    inspectionFee: 1200,
    match: 91,
    hue: 160,
    availability: "Today · 9:00 AM to 6:00 PM",
  },
  {
    id: "ruwan",
    name: "Ruwan Silva",
    initials: "RS",
    trade: "Verified Plumber",
    trust: 89,
    rating: 4.7,
    reviews: 76,
    distanceKm: 1.8,
    years: 10,
    jobs: 501,
    inspectionFee: 1000,
    match: 89,
    hue: 24,
    availability: "Tomorrow · 8:00 AM to 5:00 PM",
  },
] as const;

export const CATEGORIES = [
  "Plumbing",
  "Electrical",
  "AC Repair",
  "Cleaning",
  "Painting",
  "Carpentry",
  "Appliance Repair",
] as const;

export const avatarGradient = (hue: number) =>
  `linear-gradient(140deg, hsl(${hue} 62% 52%), hsl(${hue + 24} 55% 38%))`;
