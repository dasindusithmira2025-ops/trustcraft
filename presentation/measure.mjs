/**
 * Real text metrics for the deck.
 *
 * PowerPoint anchors text to the top of its box and silently lets it spill out,
 * so a box that is too short does not look wrong — it collides with whatever is
 * underneath it, two slides later, on a projector. The only reliable fix is to
 * stop guessing heights and measure them.
 *
 * Heights are measured in Chromium with the same Inter faces PowerPoint uses,
 * at the same width, size, weight, tracking and line spacing. Results are
 * cached on disk so a rebuild costs nothing.
 *
 * Because the slide code is synchronous, the build runs in passes: the first
 * pass records every string it could not find in the cache, the caller measures
 * them in one browser trip, and the deck is rebuilt with real numbers. Two
 * passes is normally enough.
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { ROOT } from './theme.mjs'

const CACHE_FILE = join(ROOT, 'assets', '.text-metrics.json')
const IN_X = 0.1, IN_Y = 0.05     // PowerPoint's default text insets

const cache = existsSync(CACHE_FILE)
  ? new Map(Object.entries(JSON.parse(readFileSync(CACHE_FILE, 'utf8'))))
  : new Map()

const pending = new Map()

/** Normalises both plain strings and PptxGenJS rich-text arrays into runs. */
function runsOf(t, o) {
  const base = {
    size: o.fontSize ?? 18,
    face: o.fontFace ?? 'Inter',
    bold: !!o.bold,
    spc: o.charSpacing ?? 0,
  }
  if (typeof t === 'string') return [{ ...base, text: t }]
  return t.map(r => ({
    ...base,
    bold: r.options?.bold ?? base.bold,
    size: r.options?.fontSize ?? base.size,
    face: r.options?.fontFace ?? base.face,
    text: r.text,
  }))
}

const keyOf = (runs, o) => JSON.stringify([
  runs.map(r => [r.text, r.size, r.face, r.bold, r.spc]),
  +(o.w ?? 4).toFixed(3),
  o.lineSpacing ?? 0,
  o.align ?? 'l',
])

/**
 * Height in inches that this text needs, including PowerPoint's vertical
 * insets. Returns a generous estimate on a cache miss and records the request.
 */
export function measureH(t, o) {
  const runs = runsOf(t, o)
  const k = keyOf(runs, o)
  if (cache.has(k)) return cache.get(k)

  pending.set(k, { runs, w: o.w ?? 4, lineSpacing: o.lineSpacing ?? 0 })

  // Estimate: Inter averages ~0.50em advance across mixed-case copy.
  const chars = runs.reduce((n, r) => n + r.text.length, 0)
  const size = runs[0].size
  const usable = Math.max(0.3, (o.w ?? 4) - IN_X * 2)
  const perLine = Math.max(1, Math.floor((usable * 72) / (size * 0.5)))
  const breaks = runs.reduce((n, r) => n + (r.text.match(/\n/g)?.length ?? 0), 0)
  const lines = Math.max(1, Math.ceil(chars / perLine) + breaks)
  const lead = o.lineSpacing || size * 1.25
  return (lines * lead) / 72 + IN_Y * 2
}

export const missing = () => pending.size

/** Measures everything recorded since the last flush and persists the cache. */
export async function flush() {
  if (!pending.size) return 0
  const jobs = [...pending.entries()]
  pending.clear()

  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setContent('<body style="margin:0"></body>')
  await page.evaluate(() => document.fonts.ready)

  const heights = await page.evaluate(({ jobs, IN_Y }) => jobs.map(([, job]) => {
    const box = document.createElement('div')
    box.style.cssText =
      `position:absolute;left:0;top:0;width:${Math.max(0.3, job.w - 0.2)}in;` +
      `visibility:hidden;white-space:pre-wrap;word-wrap:break-word;` +
      `line-height:${job.lineSpacing ? job.lineSpacing + 'pt' : 'normal'};`
    for (const r of job.runs) {
      const s = document.createElement('span')
      s.textContent = r.text
      s.style.cssText =
        `font-family:'${r.face}',Inter,sans-serif;font-size:${r.size}pt;` +
        `font-weight:${r.bold ? 700 : 400};letter-spacing:${r.spc}pt;`
      box.appendChild(s)
    }
    document.body.appendChild(box)
    const h = box.getBoundingClientRect().height / 96
    box.remove()
    // A hair of headroom absorbs the difference between Chromium's and
    // PowerPoint's line rounding.
    return h + IN_Y * 2 + 0.02
  }), { jobs, IN_Y })

  await browser.close()

  jobs.forEach(([k], i) => cache.set(k, Math.round(heights[i] * 1000) / 1000))
  writeFileSync(CACHE_FILE, JSON.stringify(Object.fromEntries(cache), null, 0))
  return jobs.length
}
