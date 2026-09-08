/**
 * Text-overflow audit for a generated deck.
 *
 *   node presentation/audit.mjs [path-to.pptx]
 *
 * Layout bugs in a generated deck are invisible until something is rendered,
 * because PowerPoint silently lets text spill out of its box. This reads every
 * text shape straight out of the package, re-renders each one in Chromium using
 * the same Inter faces PowerPoint will use, at the same width, size, tracking
 * and line spacing, and reports the ones that do not fit.
 *
 * PowerPoint's default text insets (0.1in left/right, 0.05in top/bottom) are
 * applied, so the numbers match what the slide actually does.
 */
import JSZip from 'jszip'
import { chromium } from 'playwright'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ROOT, W, H } from './theme.mjs'

const FILE = process.argv[2] || join(ROOT, 'output', 'TrustCraft_DHACK_Grand_Final.pptx')
const EMU = 914400
const IN_X = 0.1, IN_Y = 0.05   // PowerPoint default insets
const SLACK = 0.02              // ignore sub-2/100in rounding

const decode = s => s
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&')

/** Pulls every text-bearing shape, with the geometry and run styling it will render with. */
function shapes(xml) {
  const out = []
  for (const sp of xml.split('<p:sp>').slice(1)) {
    const xf = sp.match(/<a:off x="(-?\d+)" y="(-?\d+)"\/>\s*<a:ext cx="(\d+)" cy="(\d+)"\/>/)
    if (!xf) continue
    const body = sp.slice(sp.indexOf('<p:txBody>'))
    if (!body) continue

    const paras = []
    for (const p of body.split('<a:p>').slice(1)) {
      const runs = [...p.matchAll(/<a:rPr[^>]*sz="(\d+)"([^>]*)>[\s\S]*?<a:latin typeface="([^"]+)"[\s\S]*?<a:t>([\s\S]*?)<\/a:t>/g)]
        .map(m => ({
          size: +m[1] / 100,
          bold: /b="1"/.test(m[2]),
          spc: (+(m[2].match(/spc="(-?\d+)"/)?.[1] ?? 0)) / 100,
          face: m[3],
          text: decode(m[4]),
        }))
      if (!runs.length) continue
      const lnSpc = p.match(/<a:spcPts val="(\d+)"\/>/)
      paras.push({ runs, lineSpacing: lnSpc ? +lnSpc[1] / 100 : null })
    }
    if (!paras.length) continue

    out.push({
      x: +xf[1] / EMU, y: +xf[2] / EMU, w: +xf[3] / EMU, h: +xf[4] / EMU, paras,
    })
  }
  return out
}

const zip = await JSZip.loadAsync(await readFile(FILE))
const slideNames = Object.keys(zip.files)
  .filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n))
  .sort((a, b) => (+a.match(/\d+/)[0]) - (+b.match(/\d+/)[0]))

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setContent('<body style="margin:0"></body>')
await page.evaluate(() => document.fonts.ready)

const problems = []

for (const name of slideNames) {
  const n = +name.match(/\d+/)[0]
  const xml = await zip.file(name).async('string')

  for (const sp of shapes(xml)) {
    const usableW = Math.max(0.2, sp.w - IN_X * 2)
    const usableH = Math.max(0.05, sp.h - IN_Y * 2)

    const measured = await page.evaluate(({ paras, usableW }) => {
      const box = document.createElement('div')
      box.style.cssText =
        `position:absolute;left:0;top:0;width:${usableW}in;visibility:hidden;` +
        `white-space:pre-wrap;word-wrap:break-word;`
      let total = 0
      let widest = 0
      for (const p of paras) {
        const el = document.createElement('div')
        const lead = p.lineSpacing
        el.style.cssText = `line-height:${lead ? lead + 'pt' : 'normal'};`
        for (const r of p.runs) {
          const s = document.createElement('span')
          s.textContent = r.text
          s.style.cssText =
            `font-family:'${r.face}',Inter,sans-serif;font-size:${r.size}pt;` +
            `font-weight:${r.bold ? 700 : 400};letter-spacing:${r.spc}pt;`
          el.appendChild(s)
        }
        box.appendChild(el)
      }
      document.body.appendChild(box)
      total = box.getBoundingClientRect().height
      // Longest unbreakable line, to catch single words wider than the box.
      const probe = box.cloneNode(true)
      probe.style.width = 'max-content'
      probe.style.whiteSpace = 'pre'
      document.body.appendChild(probe)
      widest = probe.getBoundingClientRect().width
      box.remove(); probe.remove()
      return { h: total / 96, w: widest / 96 }   // CSS px -> inches
    }, { paras: sp.paras, usableW })

    const first = sp.paras[0].runs[0]
    const label = sp.paras.flatMap(p => p.runs.map(r => r.text)).join(' ').replace(/\s+/g, ' ').slice(0, 58)

    if (measured.h > usableH + SLACK) {
      problems.push({
        slide: n, kind: 'OVERFLOW-Y', label,
        detail: `needs ${measured.h.toFixed(2)}in, box is ${usableH.toFixed(2)}in ` +
                `(+${(measured.h - usableH).toFixed(2)}in) at ${first.size}pt`,
        y: sp.y, bottom: sp.y + IN_Y + measured.h,
      })
    }
    if (sp.x + IN_X + Math.min(measured.w, usableW) > W - 0.28) {
      problems.push({ slide: n, kind: 'PAST-RIGHT-MARGIN', label, detail: `ends at ${(sp.x + sp.w).toFixed(2)}in` })
    }
    if (sp.y + IN_Y + measured.h > H - 0.18) {
      problems.push({
        slide: n, kind: 'PAST-BOTTOM', label,
        detail: `text reaches ${(sp.y + IN_Y + measured.h).toFixed(2)}in of ${H}in`,
      })
    }
  }
}

await browser.close()

const bySlide = new Map()
for (const p of problems) {
  if (!bySlide.has(p.slide)) bySlide.set(p.slide, [])
  bySlide.get(p.slide).push(p)
}

console.log(`\nText audit — ${FILE.split(/[\\/]/).pop()}`)
if (!problems.length) {
  console.log('  no overflow found\n')
} else {
  for (const [slide, list] of [...bySlide].sort((a, b) => a[0] - b[0])) {
    console.log(`\n  slide ${slide}`)
    for (const p of list) console.log(`    ${p.kind.padEnd(18)} "${p.label}"\n${' '.repeat(22)}${p.detail}`)
  }
  console.log(`\n  ${problems.length} issue(s) across ${bySlide.size} slide(s)\n`)
}
