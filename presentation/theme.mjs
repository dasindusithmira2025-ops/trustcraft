/**
 * The deck's design tokens, lifted from the product.
 * Colour ramp: src/index.css `@theme`. Type: Inter, the family the app loads.
 * See Presentation_Design_System.md for the reasoning behind each value.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = dirname(fileURLToPath(import.meta.url))
export const A = {
  shot: id => join(ROOT, 'assets', 'screenshots', `${id}.png`),
  motion: f => join(ROOT, 'assets', 'motion', f),
  brand: f => join(ROOT, 'assets', 'brand', f),
}

// ── Canvas ───────────────────────────────────────────────────────────────────

export const W = 13.333
export const H = 7.5
export const M = { l: 0.62, r: 12.713, t: 0.5, b: 6.95 }

// ── Colour (hex without '#', the form PptxGenJS wants) ───────────────────────

export const C = {
  brand: '2563EB', brandLight: '3B82F6', brandDeep: '1D4ED8',
  brandWash: 'DBEAFE', brandFaint: 'EFF6FF',

  ink950: '020617', ink900: '0F172A', ink800: '1E293B', ink700: '334155',
  ink500: '64748B', ink400: '94A3B8', ink300: 'CBD5E1', ink200: 'E2E8F0',
  ink100: 'F1F5F9', ink50: 'F8FAFC', white: 'FFFFFF',

  success: '16A34A', successDeep: '15803D', successWash: 'DCFCE7',
  warning: 'F59E0B', warningDeep: 'B45309', warningWash: 'FEF3C7',
  danger: 'DC2626',

  // Four fixed steps of white on the dark surface, flattened so PowerPoint
  // never has to composite transparency behind type.
  onDarkHead: 'FFFFFF',
  onDarkLead: 'C7D2E0',
  onDarkBody: '94A3B8',
  onDarkFaint: '64748B',
  onDarkHair: '1E293B',
  onDarkPanel: '0F172A',
}

// ── Type ─────────────────────────────────────────────────────────────────────

export const F = {
  reg: 'Inter',
  med: 'Inter Medium',
  semi: 'Inter SemiBold',
  bold: 'Inter',        // used with bold:true so PowerPoint picks the real Bold face
  black: 'Inter ExtraBold',
}

export const T = {
  display: { fontSize: 50, fontFace: F.reg, bold: true, charSpacing: -1.6, lineSpacing: 54 },
  metric: { fontSize: 118, fontFace: F.black, charSpacing: -4, lineSpacing: 112 },
  head: { fontSize: 36, fontFace: F.reg, bold: true, charSpacing: -1.1, lineSpacing: 42 },
  sub: { fontSize: 24, fontFace: F.semi, charSpacing: -0.5, lineSpacing: 30 },
  lead: { fontSize: 19, fontFace: F.reg, charSpacing: -0.2, lineSpacing: 27 },
  body: { fontSize: 15.5, fontFace: F.reg, lineSpacing: 22 },
  note: { fontSize: 13.5, fontFace: F.med, lineSpacing: 19 },
  cap: { fontSize: 12, fontFace: F.reg, lineSpacing: 17 },
  eyebrow: { fontSize: 10.5, fontFace: F.semi, charSpacing: 1.6 },
  cite: { fontSize: 9, fontFace: F.reg, lineSpacing: 12 },
}

// ── Device geometry ──────────────────────────────────────────────────────────
// capture/shots.mjs renders the 390x844 frame inside a padded stage
// (70px left/right, 90px top, 110px bottom) so the drop shadow survives the
// crop. These ratios convert a wanted DEVICE rect into the IMAGE rect.

const PAD_X = 150, PAD_T = 150, PAD_B = 200
const STAGE_W = 390 + PAD_X * 2           // 690
const STAGE_H = 844 + PAD_T + PAD_B       // 1194
export const DEV = {
  aspect: 390 / 844,                      // device w : h
  imgW: STAGE_W / 390,                    // image width  per device width
  imgH: STAGE_H / 844,                    // image height per device height
  padX: PAD_X / 390,                      // left pad     per device width
  padY: PAD_T / 844,                      // top pad      per device height
}

/** Reads width/height out of a PNG header — no image library needed. */
export function pngSize(path) {
  const b = readFileSync(path)
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }
}
