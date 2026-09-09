/**
 * Builds the TrustCraft DHACK Grand Final deck.
 *
 *   node presentation/generate.mjs                 # motion build (animated GIFs)
 *   node presentation/generate.mjs --static        # backup build (held frames)
 *   TEAM_NAME="Team Foo" node presentation/generate.mjs
 *
 * PptxGenJS writes a genuine, fully editable .pptx. Afterwards the file is
 * reopened as a zip and a `p:transition` element is written into each slide's
 * XML, because PptxGenJS has no API for slide transitions. Morph carries the
 * matched states; fade turns the chapters. Both are stock PowerPoint
 * transitions, and both degrade to a plain cut anywhere they are unsupported.
 */
import PptxGenJS from 'pptxgenjs'
import JSZip from 'jszip'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { ROOT, W, H } from './theme.mjs'
import { build, TEAM } from './slides.mjs'
import { flush, missing } from './measure.mjs'
import { businessTiming } from './business-motion.mjs'

const STATIC = process.argv.includes('--static')
const OUT_DIR = join(ROOT, 'output')
const outArg = process.argv.indexOf('--out')
const FILE = outArg >= 0 ? process.argv[outArg + 1] : STATIC ? 'TrustCraft_DHACK_Static_Backup.pptx' : 'TrustCraft_DHACK_Grand_Final.pptx'
const OUT = join(OUT_DIR, FILE)

await mkdir(OUT_DIR, { recursive: true })

/**
 * Text boxes are sized from measured Inter metrics, and the slide code is
 * synchronous, so the deck is built in passes: build, measure whatever the
 * cache did not know, build again. Two passes is normally enough, and a warm
 * cache makes it one.
 */
function compose() {
  const pptx = new PptxGenJS()
  pptx.defineLayout({ name: 'TC16x9', width: W, height: H })
  pptx.layout = 'TC16x9'
  pptx.author = TEAM
  pptx.company = 'TrustCraft'
  pptx.title = 'TrustCraft — DHACK Grand Final'
  pptx.subject = 'An intelligent home-services platform built around trust, not listings.'
  return { pptx, transitions: build(pptx, STATIC ? 'static' : 'motion') }
}

let composed = compose()
for (let pass = 0; pass < 4 && missing(); pass++) {
  const n = await flush()
  console.log(`  measured ${n} text block(s), rebuilding`)
  composed = compose()
}
if (missing()) await flush()

const { pptx, transitions } = composed
await pptx.writeFile({ fileName: OUT })

// ── Slide transitions, written straight into the package ─────────────────────

const MORPH =
  '<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">' +
  '<mc:Choice xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" Requires="p159">' +
  '<p:transition xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" spd="slow" p14:dur="900">' +
  '<p159:morph option="byObject"/></p:transition></mc:Choice>' +
  '<mc:Fallback><p:transition spd="slow"><p:fade/></p:transition></mc:Fallback>' +
  '</mc:AlternateContent>'

const FADE = '<p:transition spd="med"><p:fade/></p:transition>'

const src = await JSZip.loadAsync(await readFile(OUT))

// Read every part out in the order PptxGenJS wrote it, skipping the directory
// entries JSZip synthesises — an OPC package must contain files only.
const parts = []
for (const name of Object.keys(src.files)) {
  const entry = src.files[name]
  if (entry.dir) continue
  parts.push([name, await entry.async('nodebuffer')])
}

const patched = new Map()
let applied = 0

for (let i = 0; i < transitions.length; i++) {
  const name = `ppt/slides/slide${i + 1}.xml`
  const part = parts.find(([n]) => n === name)
  if (!part) { console.warn(`  ! ${name} not found`); continue }

  const xml = part[1].toString('utf8')
  if (xml.includes('<p:transition') || xml.includes('p159:morph')) continue

  // The backup build uses fade everywhere: Morph needs PowerPoint 2019 or 365,
  // and the whole point of the backup is to depend on nothing.
  const kind = STATIC ? 'fade' : transitions[i]

  // CT_Slide order is cSld, clrMapOvr, transition, timing — appending just
  // before </p:sld> keeps that order because PptxGenJS emits no timing block.
  const timing = !STATIC && [17, 18].includes(i + 1) ? businessTiming(xml) : ''
  patched.set(name, xml.replace('</p:sld>', (kind === 'morph' ? MORPH : FADE) + timing + '</p:sld>'))
  applied++
}

// Rebuild the package by hand. `[Content_Types].xml` has to lead, and
// `createFolders: false` keeps JSZip from re-adding directory entries — both
// were why PowerPoint refused the first round-trip.
const out = new JSZip()
const ORDER = (a, b) => (a[0] === '[Content_Types].xml' ? -1 : b[0] === '[Content_Types].xml' ? 1 : 0)
for (const [name, buf] of [...parts].sort(ORDER)) {
  out.file(name, patched.has(name) ? patched.get(name) : buf, { createFolders: false })
}

await writeFile(OUT, await out.generateAsync({
  type: 'nodebuffer',
  compression: 'DEFLATE',
  compressionOptions: { level: 6 },
  createFolders: false,
}))

const size = (await readFile(OUT)).length / 1e6
console.log(`${FILE}`)
console.log(`  slides       ${transitions.length}`)
const morphs = STATIC ? 0 : transitions.filter(t => t === 'morph').length
console.log(`  transitions  ${applied} (${morphs} morph, ${applied - morphs} fade)`)
console.log(`  size         ${size.toFixed(1)} MB`)
console.log(`  team         ${TEAM}`)
