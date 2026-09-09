/**
 * The deck's drawing primitives, shared by every slide.
 *
 * Extracted from slides.mjs so business-slides.mjs draws with exactly the same
 * type scale, hairlines, pills and brand furniture as the other twenty slides.
 * Nothing here knows about any particular slide.
 */
import { A, C, F, T, M, DEV } from './theme.mjs'
import { measureH } from './measure.mjs'
import { pngSize } from './theme.mjs'

/** Lockup proportions come from the asset itself, never a hard-coded guess. */
export const LOCKUP = (() => { const d = pngSize(A.brand('lockup-white.png')); return d.h / d.w })()

export const dark = (p, s = p.addSlide()) => (s.background = { path: A.brand('bg-dark.png') }, s)
export const light = (p, s = p.addSlide()) => (s.background = { color: C.ink50 }, s)

/**
 * Places text with a measured box and returns the y it ends at, so callers can
 * stack the next block against a real number.
 */
export function text(s, t, o) {
  const opts = { fontFace: F.reg, valign: 'top', ...o }
  const h = opts.h ?? measureH(t, opts)
  s.addText(t, { ...opts, h })
  return o.y + h
}

export const eyebrow = (s, t, x, y, color, w = 6) =>
  text(s, t.toUpperCase(), { x, y, w, ...T.eyebrow, color })

/**
 * Places a real screen so x/y/h describe the DEVICE, not the padded PNG.
 * The padding exists only so the app's own drop shadow survives the crop.
 */
export function device(s, id, { x, y, h, transparency }) {
  const dw = h * DEV.aspect
  s.addImage({
    path: A.shot(id),
    x: x - dw * DEV.padX,
    y: y - h * DEV.padY,
    w: dw * DEV.imgW,
    h: h * DEV.imgH,
    ...(transparency ? { transparency } : {}),
  })
  return { x, y, w: dw, right: x + dw, bottom: y + h, cx: x + dw / 2 }
}

/** Same contract for the recorded clips (780 x 1688 device pixels, no padding). */
export function clip(s, file, { x, y, h }) {
  const w = h * (780 / 1688)
  s.addImage({ path: A.motion(file), x, y, w, h })
  return { x, y, w, right: x + w, bottom: y + h, cx: x + w / 2 }
}

export const rule = (s, { x, y, w, color, width = 0.75 }) =>
  s.addShape('line', { x, y, w, h: 0, line: { color, width } })

export const vrule = (s, { x, y, h, color, width = 0.75 }) =>
  s.addShape('line', { x, y, w: 0, h, line: { color, width } })

export const panel = (s, { x, y, w, h, fill, line, radius = 0.1 }) =>
  s.addShape('roundRect', {
    x, y, w, h, rectRadius: radius,
    fill: fill ? { color: fill } : { type: 'none' },
    line: line ? { color: line, width: 0.75 } : { type: 'none' },
  })

export const dot = (s, { x, y, d = 0.09, color = C.brand }) =>
  s.addShape('ellipse', { x: x - d / 2, y: y - d / 2, w: d, h: d, fill: { color }, line: { type: 'none' } })

/** A pill whose box IS the visual, so its height is fixed on purpose. */
export const pill = (s, t, { x, y, w, h = 0.3, fill, line, color, size = 10, face = F.semi, spc = 0 }) =>
  s.addText(t, {
    x, y, w, h, shape: 'roundRect', rectRadius: 0.05,
    fill: fill ? { color: fill } : { type: 'none' },
    line: line ? { color: line, width: 0.75 } : { type: 'none' },
    fontSize: size, fontFace: face, charSpacing: spc, color,
    align: 'center', valign: 'middle',
  })

const FOOTER_Y = 7.08

/** Small brand furniture, bottom-left, on the chapters between the bookends. */
export function footer(s, isDark) {
  s.addImage({ path: A.brand('mark.png'), x: M.l, y: FOOTER_Y, w: 0.17, h: 0.17 })
  s.addText('TrustCraft', {
    x: M.l + 0.24, y: FOOTER_Y - 0.05, w: 1.4, h: 0.26,
    fontSize: 9.5, fontFace: F.semi, charSpacing: 0.3, valign: 'middle',
    color: isDark ? C.onDarkFaint : C.ink400,
  })
}

export const cite = (s, t) =>
  text(s, t, { x: M.l, y: 7.0, w: 11.9, ...T.cite, color: C.ink400 })

/** A numbered marker that sits on top of a screen. */
export function marker(s, n, x, y) {
  const d = 0.32
  s.addShape('ellipse', {
    x: x - d / 2, y: y - d / 2, w: d, h: d,
    fill: { color: C.brand }, line: { color: 'FFFFFF', width: 1.5 },
  })
  s.addText(String(n), {
    x: x - d / 2, y: y - d / 2, w: d, h: d,
    fontSize: 11, fontFace: F.semi, color: 'FFFFFF', align: 'center', valign: 'middle',
  })
}

/** Small premium status tag. BUILT is the only solid fill; PROPOSED is an
 *  outline whose word carries the meaning, so colour is never the only signal. */
const AMBER = { line: C.warningDeep, color: 'FBBF24' }
const TAGS = {
  BUILT: { fill: C.successDeep, color: 'DCFCE7' },
  'CURRENT BUILD': { fill: C.successDeep, color: 'DCFCE7' },
  PROPOSED: AMBER,
  'PROPOSED PRICING': AMBER,
  'NEXT · PROPOSED': AMBER,
  'SCALE · PROPOSED': AMBER,
}
export function tag(s, kind, x, y, w) {
  const t = TAGS[kind]
  pill(s, kind, { x, y, w, h: 0.32, fill: t.fill, line: t.line, color: t.color, size: 9, spc: 1.2 })
  return x + w
}
