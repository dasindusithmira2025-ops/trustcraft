import type { CSSProperties } from 'react'

/**
 * The TrustCraft icon set, copied path-for-path from the product
 * (`src/components/UI.tsx`). One 24x24 stroke set drawn in currentColor —
 * the film uses the app's real geometry, not lookalikes.
 */
export const PATHS: Record<string, string> = {
  back: 'M15 5l-7 7 7 7',
  next: 'M9 5l7 7-7 7',
  bell: 'M18 9a6 6 0 10-12 0c0 5-2 6-2 6h16s-2-1-2-6M13.7 20a2 2 0 01-3.4 0',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4-4',
  camera: 'M4 8h3l1.5-2h7L17 8h3v11H4V8zM12 16.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z',
  video: 'M4 7h11v10H4V7zM15 11l5-3v8l-5-3',
  mic: 'M12 3a2.5 2.5 0 012.5 2.5v6a2.5 2.5 0 01-5 0v-6A2.5 2.5 0 0112 3zM6 11a6 6 0 0012 0M12 17v4',
  pin: 'M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  home: 'M4 10.5L12 4l8 6.5V20h-5v-5H9v5H4v-9.5z',
  wrench: 'M20 6.5a4.5 4.5 0 01-6 5.6L6.8 19.3a2 2 0 11-2.8-2.8L11.2 9A4.5 4.5 0 0116.8 3l-2.6 2.6 1.6 2.6L19 6.1z',
  cases: 'M4 8h16v11H4V8zM9 8V6a2 2 0 012-2h2a2 2 0 012 2v2',
  chat: 'M4 5h16v11H9l-5 4V5z',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-3.5 3.6-6 8-6s8 2.5 8 6',
  calendar: 'M4 6h16v14H4V6zM8 3v5M16 3v5M4 11h16',
  check: 'M5 12.5l4.5 4.5L19 7',
  star: 'M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5z',
  edit: 'M4 20h4L19 9l-4-4L4 16v4zM14.5 5.5l4 4',
  image: 'M4 5h16v14H4V5zM4 16l4.5-4.5 4 4L16 12l4 4M9 10a1.3 1.3 0 100-2.6A1.3 1.3 0 009 10z',
  card: 'M3 6h18v12H3V6zM3 10h18',
  shield: 'M12 3l7 3v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6l7-3zM8.8 12l2.2 2.2 4.2-4.4',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z',
  clock: 'M12 4a8 8 0 100 16 8 8 0 000-16zM12 7.5V12l3 2',
  wallet: 'M4 7h13a3 3 0 013 3v7H4V7zM4 7l11-3v3M17 13.5h.01',
  send: 'M4 12l16-8-6 16-2.5-6L4 12z',
  info: 'M12 4a8 8 0 100 16 8 8 0 000-16zM12 11v5M12 8h.01',
  warn: 'M12 4l9 16H3l9-16zM12 10v4M12 17h.01',
  flip: 'M4 9a8 8 0 0113.5-3M20 15A8 8 0 016.5 18M17 3v3.5h-3.5M7 21v-3.5h3.5',
  more: 'M6 12h.01M12 12h.01M18 12h.01',
  filter: 'M4 6h16M7 12h10M10 18h4',
  play: 'M8 5l11 7-11 7V5z',
}

interface IconProps {
  name: keyof typeof PATHS | string
  size?: number
  fill?: boolean
  strokeWidth?: number
  style?: CSSProperties
}

export function Icon({ name, size = 20, fill, strokeWidth = 1.8, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      <path d={PATHS[name] ?? ''} />
    </svg>
  )
}

/**
 * The shield, drawn as a self-drawing stroke for the finale. `progress` runs
 * 0→1; the outline draws first, the tick lands last.
 */
export function ShieldDraw({ size, progress, color }: { size: number; progress: number; color: string }) {
  const body = 'M12 3l7 3v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6l7-3z'
  const tick = 'M8.8 12l2.2 2.2 4.2-4.4'
  const L = 62
  const T = 12
  const pBody = Math.min(1, progress / 0.72)
  const pTick = Math.max(0, (progress - 0.66) / 0.34)
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
      <path d={body} strokeDasharray={L} strokeDashoffset={L * (1 - pBody)} />
      <path d={tick} strokeDasharray={T} strokeDashoffset={T * (1 - pTick)} />
    </svg>
  )
}
