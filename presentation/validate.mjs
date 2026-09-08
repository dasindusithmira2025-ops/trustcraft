/**
 * Structural validation of a generated deck, before PowerPoint ever sees it.
 *
 *   node presentation/validate.mjs [path-to.pptx]
 *
 * Catches the failures that make PowerPoint refuse a file outright — negative
 * shape extents, a displaced [Content_Types].xml, directory entries, missing
 * media, undeclared extensions — plus the softer ones a preview would only
 * reveal late: content outside the slide, text below the legibility floor, and
 * leftover placeholder copy.
 */
import JSZip from 'jszip'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ROOT, W, H } from './theme.mjs'

const FILE = process.argv[2] || join(ROOT, 'output', 'TrustCraft_DHACK_Grand_Final.pptx')
const EMU = 914400
const MIN_PT = 9          // nothing smaller than this may carry information
const PLACEHOLDERS = [/SET TEAM_NAME/i, /\[TEAM/i, /\bTODO\b/, /\bTBD\b/, /Lorem ipsum/i, /XXX/]

const fail = []
const warn = []

const zip = await JSZip.loadAsync(await readFile(FILE))
const names = Object.keys(zip.files)

// ── Package shape ────────────────────────────────────────────────────────────

if (names[0] !== '[Content_Types].xml') fail.push(`[Content_Types].xml is not the first entry (got ${names[0]})`)
const dirs = names.filter(n => zip.files[n].dir)
if (dirs.length) fail.push(`package contains ${dirs.length} directory entries: ${dirs.slice(0, 3).join(', ')}`)

const ctypes = await zip.file('[Content_Types].xml').async('string')
const media = names.filter(n => n.startsWith('ppt/media/'))
const exts = [...new Set(media.map(n => n.split('.').pop().toLowerCase()))]
for (const e of exts) {
  if (!ctypes.includes(`Extension="${e}"`)) fail.push(`media extension .${e} has no Default content type`)
}

// ── Per-slide checks ─────────────────────────────────────────────────────────

const slideNames = names
  .filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n))
  .sort((a, b) => (+a.match(/\d+/)[0]) - (+b.match(/\d+/)[0]))

let morph = 0, fade = 0, notes = 0
const report = []

for (const name of slideNames) {
  const n = +name.match(/\d+/)[0]
  const xml = await zip.file(name).async('string')
  const issues = []

  // Every referenced relationship must resolve to a real part.
  const rels = await zip.file(`ppt/slides/_rels/slide${n}.xml.rels`)?.async('string')
  if (!rels) issues.push('no rels part')
  else {
    for (const m of rels.matchAll(/Target="([^"]+)"/g)) {
      const t = m[1]
      if (t.startsWith('http') || t.startsWith('../slideLayouts') || t.startsWith('../notesSlides')) continue
      const resolved = t.replace(/^\.\.\//, 'ppt/')
      if (!zip.file(resolved)) issues.push(`missing media target ${t}`)
    }
  }

  // Extents must be positive; PowerPoint rejects the file if any is negative.
  for (const m of xml.matchAll(/<a:ext cx="(-?\d+)" cy="(-?\d+)"\/>/g)) {
    if (+m[1] < 0 || +m[2] < 0) issues.push(`negative extent cx=${m[1]} cy=${m[2]}`)
  }

  // Nothing meaningful may sit outside the slide. Full-bleed backgrounds and
  // the transparent padding around a device screenshot are expected to.
  let offBleed = 0
  const offs = [...xml.matchAll(/<a:off x="(-?\d+)" y="(-?\d+)"\/>\s*<a:ext cx="(\d+)" cy="(\d+)"\/>/g)]
  for (const m of offs) {
    const x = +m[1] / EMU, y = +m[2] / EMU, cx = +m[3] / EMU, cy = +m[4] / EMU
    if (x < -0.9 || y < -0.9 || x + cx > W + 0.9 || y + cy > H + 0.9) offBleed++
  }
  if (offBleed) warn.push(`slide ${n}: ${offBleed} object(s) extend well past the canvas`)

  // Legibility floor.
  for (const m of xml.matchAll(/sz="(\d+)"/g)) {
    const pt = +m[1] / 100
    if (pt < MIN_PT) issues.push(`text at ${pt}pt is below the ${MIN_PT}pt floor`)
  }

  // Placeholder copy that must never reach a judge.
  const words = [...xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map(m => m[1]).join(' ')
  // Placeholder copy is a hard failure: it must never reach a judge.
  for (const p of PLACEHOLDERS) if (p.test(words)) fail.push(`slide ${n}: placeholder text matching ${p}`)

  if (xml.includes('p159:morph')) morph++
  else if (xml.includes('<p:transition')) fade++
  else warn.push(`slide ${n}: no transition`)

  if (zip.file(`ppt/notesSlides/notesSlide${n}.xml`)) notes++

  report.push({ n, shapes: offs.length, issues })
  issues.forEach(i => fail.push(`slide ${n}: ${i}`))
}

// ── Result ───────────────────────────────────────────────────────────────────

console.log(`\n${FILE.split(/[\\/]/).pop()}`)
console.log(`  slides        ${slideNames.length}`)
console.log(`  transitions   ${morph} morph · ${fade} fade`)
console.log(`  speaker notes ${notes}/${slideNames.length}`)
console.log(`  media parts   ${media.length} (${exts.join(', ')})`)
console.log(`  size          ${((await readFile(FILE)).length / 1e6).toFixed(1)} MB`)
console.log(`  objects/slide ${report.map(r => r.shapes).join(' ')}`)

if (warn.length) {
  console.log(`\n  WARNINGS (${warn.length})`)
  warn.forEach(w => console.log(`    - ${w}`))
}
if (fail.length) {
  console.log(`\n  FAILURES (${fail.length})`)
  fail.forEach(f => console.log(`    ! ${f}`))
  process.exit(1)
}
console.log('\n  structure OK\n')
