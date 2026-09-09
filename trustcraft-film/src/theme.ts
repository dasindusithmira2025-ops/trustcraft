/**
 * Brand tokens lifted verbatim from the TrustCraft product (`src/index.css`
 * @theme block). The film must never invent a colour the app does not use.
 */
export const C = {
  brand900: '#1E3A8A',
  brand800: '#1E40AF',
  brand700: '#1D4ED8',
  brand600: '#2563EB',
  brand500: '#3B82F6',
  brand200: '#BFDBFE',
  brand100: '#DBEAFE',
  brand50: '#EFF6FF',

  ink950: '#020617',
  ink900: '#0F172A',
  ink800: '#1E293B',
  ink700: '#334155',
  ink500: '#64748B',
  ink400: '#94A3B8',
  ink300: '#CBD5E1',
  ink200: '#E2E8F0',
  ink100: '#F1F5F9',
  ink50: '#F8FAFC',

  success700: '#15803D',
  success600: '#16A34A',
  success100: '#DCFCE7',

  warning600: '#F59E0B',
  danger600: '#DC2626',
  gold: '#F59E0B',

  white: '#FFFFFF',
} as const

/** The film's environment. Derived from the product's own `body` gradient. */
export const STAGE_BG = '#04070D'

export const FONT = "'Inter', system-ui, sans-serif"

/** Product shadow language, deepened slightly for a dark cinematic stage. */
export const SHADOW = {
  card: '0 1px 2px rgba(2,6,23,.06), 0 8px 24px rgba(2,6,23,.10)',
  lift: '0 24px 70px -18px rgba(2,6,23,.55), 0 8px 24px rgba(2,6,23,.30)',
  hero: '0 60px 140px -30px rgba(2,6,23,.80), 0 20px 50px rgba(2,6,23,.45)',
  glowBrand: '0 30px 90px -20px rgba(37,99,235,.55)',
} as const
