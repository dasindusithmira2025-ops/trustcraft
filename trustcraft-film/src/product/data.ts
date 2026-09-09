/**
 * Real fixtures from the TrustCraft app (`src/store.tsx`). Every number the
 * film puts on screen — trust score, rating, jobs, fee — is a number the
 * product actually renders. No invented claims.
 */
export interface Pro {
  id: string
  name: string
  trade: string
  trust: number
  rating: number
  reviews: number
  distanceKm: number
  years: number
  jobs: number
  inspectionFee: number
  match: number
  hue: number
  services: string[]
  availability: string
}

export const PROS: Pro[] = [
  {
    id: 'kasun', name: 'Kasun Perera', trade: 'Verified Plumber', trust: 94, rating: 4.9,
    reviews: 126, distanceKm: 2.4, years: 8, jobs: 412, inspectionFee: 1500, match: 94, hue: 212,
    services: ['General Plumbing', 'Leak Repair', 'Pipe Installation', 'Drain Cleaning'],
    availability: 'Today · 8:00 AM to 8:00 PM',
  },
  {
    id: 'nimal', name: 'Nimal Fernando', trade: 'Verified Plumber', trust: 91, rating: 4.8,
    reviews: 98, distanceKm: 3.1, years: 6, jobs: 288, inspectionFee: 1200, match: 91, hue: 160,
    services: ['Leak Repair', 'Bathroom Fittings', 'Water Tank Service'],
    availability: 'Today · 9:00 AM to 6:00 PM',
  },
  {
    id: 'ruwan', name: 'Ruwan Silva', trade: 'Verified Plumber', trust: 89, rating: 4.7,
    reviews: 76, distanceKm: 1.8, years: 10, jobs: 501, inspectionFee: 1000, match: 89, hue: 24,
    services: ['General Plumbing', 'Drain Cleaning', 'Hot Water Systems'],
    availability: 'Tomorrow · 8:00 AM to 5:00 PM',
  },
]

export const KASUN = PROS[0]

/** The app's own category list (`CATEGORIES` in store.tsx), with its icons. */
export const CATEGORIES = [
  { id: 'plumbers', label: 'Plumbers', icon: 'wrench' },
  { id: 'electricians', label: 'Electricians', icon: 'sparkle' },
  { id: 'cleaners', label: 'Cleaners', icon: 'star' },
  { id: 'carpenters', label: 'Carpenters', icon: 'cases' },
  { id: 'ac', label: 'AC Repair', icon: 'flip' },
  { id: 'painters', label: 'Painters', icon: 'edit' },
  { id: 'appliance', label: 'Appliance Repair', icon: 'card' },
  { id: 'others', label: 'Others', icon: 'more' },
]

/** The customer, verbatim from PROFILE. */
export const CUSTOMER = { name: 'Nadeesha Fernando', location: 'Colombo 05' }

/** The seeded request the product ships with. */
export const REQUEST = {
  typed: 'My kitchen sink is leaking.',
  spoken: 'The AC isn’t cooling properly.',
  photoLabel: 'Pipe joint · leak',
}

export const money = (n: number) => n.toLocaleString('en-US')
