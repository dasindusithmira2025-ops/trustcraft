export type ScreenId =
  // A. main navigation & home
  | 'home' | 'notifications' | 'location' | 'camera' | 'problem'
  // B. find professionals
  | 'find-pros' | 'pro-profile' | 'ai-analysis' | 'recommendations' | 'confirmation'
  // C. service / problem solving
  | 'status' | 'assessment' | 'set-inspection' | 'inspection-payment'
  | 'quotation' | 'quotation-payment' | 'work-completed' | 'review' | 'record'
  // D. always accessible
  | 'cases' | 'messages' | 'chat' | 'profile' | 'profile-overview'

export interface NavProps {
  navigate: (to: ScreenId) => void
  goBack: () => void
}

export interface Pro {
  id: string
  name: string
  trade: string
  /** Shared-case category id (see src/case.ts CATEGORIES). */
  category: string
  /** Drives urgent matching — urgent jobs only reach professionals who are on. */
  availableNow: boolean
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
  about: string
  availability: string
}

export interface StageState {
  key: string
  label: string
  detail: string | null
  status: 'done' | 'current' | 'pending'
  screen: ScreenId | null
}
