export type ScreenId =
  | 'home' | 'camera' | 'voice' | 'ai-analysis'
  | 'problem-canvas' | 'clarification' | 'structured-request'
  | 'top-matches' | 'why-match' | 'pro-profile' | 'trust-score' | 'booking'
  | 'appointment' | 'inspection' | 'repair-plan' | 'price-context'
  | 'approval' | 'payment'
  | 'active-job' | 'completion' | 'resolved' | 'review' | 'my-home'
  | 'pro-request'

export interface NavProps {
  navigate: (to: ScreenId) => void
  goBack: () => void
}
