/**
 * Records short clips of the REAL TrustCraft application being driven through
 * the real customer journey, then hands them to ffmpeg to become
 * presentation-grade MP4s and autoplaying GIFs.
 *
 *   node presentation/capture/motion.mjs
 *
 * Nothing here fakes UI: every frame is the live React app responding to real
 * clicks and real keystrokes. The only injected CSS scales the page up so the
 * 390pt device frame records at 2x and pulls the prototype's role switcher out
 * of shot — that switcher exists only so one prototype can host both apps.
 *
 * Each clip marks the moment its story actually starts, and everything before
 * that mark is trimmed, so no setup navigation survives into the deck.
 */
import { chromium } from 'playwright'
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, readdirSync, renameSync, existsSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, '..', 'assets', 'motion')
const RAW = join(OUT, '.raw')
const BASE = 'http://127.0.0.1:5199'

const ZOOM = 2
const VIEW = { width: 880, height: 1760 }

mkdirSync(OUT, { recursive: true })
rmSync(RAW, { recursive: true, force: true })
mkdirSync(RAW, { recursive: true })

const PREP = `
  html { zoom: ${ZOOM}; }
  body { background: #0B1220 !important; }
  #root > div { padding: 8px 0 0 !important; min-height: 0 !important; justify-content: flex-start !important; }
  #root > div > div:nth-child(1), #root > div > div:nth-child(2), #root > div > p { display: none !important; }
`

async function open(browser) {
  const ctx = await browser.newContext({
    viewport: VIEW,
    recordVideo: { dir: RAW, size: VIEW },
    reducedMotion: 'no-preference',
  })
  const page = await ctx.newPage()
  const t0 = Date.now()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  // The prototype boots into the professional app; the customer journey is the story.
  await page.getByRole('button', { name: 'Customer' }).click()
  await page.addStyleTag({ content: PREP })
  await page.waitForTimeout(400)
  return { ctx, page, t0 }
}

/** The device frame is the only 390x844 box on the page. */
const deviceBox = page => page.evaluate(() => {
  const el = [...document.querySelectorAll('div')]
    .find(d => d.style.width === '390px' && d.style.height === '844px')
  const r = el.getBoundingClientRect()
  return { x: r.x, y: r.y, w: r.width, h: r.height }
})

const CLIPS = [
  {
    name: 'describe',
    seconds: 6.0,
    // The customer types the fault in their own words and moves to the request review.
    async run(page, mark) {
      const box = page.locator('textarea').first()
      await box.click()
      await box.fill('')
      await mark()
      await page.waitForTimeout(450)
      await box.pressSequentially('My kitchen sink is leaking underneath when I turn on the tap.', { delay: 44 })
      await page.waitForTimeout(800)
      await page.getByRole('button', { name: 'Continue' }).click()
      await page.waitForTimeout(1600)
    },
  },
  {
    name: 'understand',
    seconds: 7.0,
    // The described problem is structured, then turned into ranked, relevant matches.
    async run(page, mark) {
      await page.getByRole('button', { name: 'Continue' }).click()
      await page.waitForTimeout(900)
      await mark()
      await page.waitForTimeout(400)
      await page.getByText('Analyze with AI').click()
      await page.waitForTimeout(4400)   // the four analysis steps, then auto-advance
      await page.waitForTimeout(2200)   // ranked cards fade up
    },
  },
  {
    name: 'trust',
    seconds: 7.5,
    // Open the strongest match, read the evidence behind it, then commit.
    async run(page, mark) {
      await page.getByRole('button', { name: 'Continue' }).click()
      await page.waitForTimeout(400)
      await page.getByText('Analyze with AI').click()
      await page.waitForTimeout(5400)
      await mark()
      await page.waitForTimeout(600)
      await page.getByRole('button', { name: 'View Profile' }).first().click()
      await page.waitForTimeout(1200)
      const scroller = page.locator('.no-scroll').first()
      for (const y of [200, 400, 620]) {
        await scroller.evaluate((el, v) => el.scrollTo({ top: v, behavior: 'smooth' }), y)
        await page.waitForTimeout(620)
      }
      await page.waitForTimeout(400)
      await page.getByRole('button', { name: 'Select' }).click()
      await page.waitForTimeout(2000)
    },
  },
]

// ── Record ───────────────────────────────────────────────────────────────────

const browser = await chromium.launch()
const meta = {}

for (const clip of CLIPS) {
  const { ctx, page, t0 } = await open(browser)
  const box = await deviceBox(page)
  let lead = 0
  await clip.run(page, () => { lead = (Date.now() - t0) / 1000; return Promise.resolve() })
  await page.waitForTimeout(300)
  const video = page.video()
  await ctx.close()
  renameSync(await video.path(), join(RAW, `${clip.name}.webm`))
  meta[clip.name] = { box, lead }
  process.stdout.write(`  * recorded ${clip.name}  (story starts at ${lead.toFixed(2)}s)\n`)
}

await browser.close()

// ── Encode ───────────────────────────────────────────────────────────────────

const ff = args => execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args])
const even = n => Math.round(n / 2) * 2
const mb = p => (statSync(p).size / 1e6).toFixed(1) + ' MB'

for (const clip of CLIPS) {
  const { box, lead } = meta[clip.name]
  const src = join(RAW, `${clip.name}.webm`)
  if (!existsSync(src)) { console.warn(`  ! missing ${clip.name}`); continue }

  const crop = `crop=${even(box.w)}:${even(box.h)}:${Math.round(box.x)}:${Math.round(box.y)}`
  const window = ['-ss', lead.toFixed(2), '-t', String(clip.seconds)]

  const mp4 = join(OUT, `${clip.name}.mp4`)
  ff([...window, '-i', src, '-vf', `${crop},scale=780:-2:flags=lanczos,fps=30`,
      '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-crf', '21',
      '-movflags', '+faststart', '-an', mp4])

  // GIF: PowerPoint loops these in slideshow with no codec and no autoplay risk.
  const pal = join(RAW, `${clip.name}.png`)
  const chain = `${crop},scale=430:-1:flags=lanczos,fps=14`
  ff([...window, '-i', src, '-vf', `${chain},palettegen=max_colors=160:stats_mode=diff`, pal])
  ff([...window, '-i', src, '-i', pal, '-lavfi',
      `${chain}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle`,
      join(OUT, `${clip.name}.gif`)])

  // The clip's closing frame, for the static backup deck. Taken from the
  // encoded mp4 so it can never seek past the end of the trimmed window.
  ff(['-sseof', '-0.4', '-i', mp4, '-frames:v', '1', join(OUT, `${clip.name}-still.png`)])

  process.stdout.write(`  = ${clip.name}  mp4 ${mb(mp4)}  gif ${mb(join(OUT, `${clip.name}.gif`))}\n`)
}

rmSync(RAW, { recursive: true, force: true })
console.log('\n' + readdirSync(OUT).join('  '))
