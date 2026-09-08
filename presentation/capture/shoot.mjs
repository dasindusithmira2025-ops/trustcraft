/**
 * Captures every real TrustCraft screen the deck needs, straight from the
 * running application, at 3x device scale on a transparent canvas.
 *
 *   node presentation/capture/shoot.mjs [--base http://127.0.0.1:5199]
 *
 * Output: presentation/assets/screenshots/<id>.png  (1620 x 3132-ish, alpha)
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, '..', 'assets', 'screenshots')
const BASE = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : 'http://127.0.0.1:5199'

// id, optional scroll offset in px, optional settle delay (ms) for timed screens.
const SHOTS = [
  ['home'], ['home-blank'], ['home-ac'], ['home-case'],
  ['camera'], ['problem'], ['problem-voice'],
  ['ai-analysis', 0, 1500], ['ai-analysis-done', 0, 2900, 'ai-analysis'],
  ['recommendations'], ['pro-profile'], ['pro-profile-trust', 470, 0, 'pro-profile'],
  ['find-pros'], ['confirmation'], ['status'], ['assessment'],
  ['quotation'], ['work-completed'], ['record'], ['cases'], ['notifications'],
  ['w-home'], ['w-home-queue', 430, 0, 'w-home'], ['w-opportunities'],
  ['w-request'], ['w-request-evidence', 430, 0, 'w-request'],
  ['w-job'], ['w-quote'], ['w-quote-totals', 470, 0, 'w-quote'], ['w-quote-money', 330, 0, 'w-quote'],
  ['w-done'], ['w-earnings'], ['w-analyse'], ['w-documents'],
]

mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 560, height: 1080 },
  deviceScaleFactor: 3,
})

for (const [id, y = 0, settle = 0, source = id] of SHOTS) {
  const url = `${BASE}/presentation/capture/shots.html?s=${source}${y ? `&y=${y}` : ''}${settle ? '&live=1' : ''}`
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  if (settle) await page.waitForTimeout(settle)
  else await page.waitForTimeout(180)

  const stage = page.locator('#stage')
  await stage.screenshot({ path: join(OUT, `${id}.png`), omitBackground: true })
  process.stdout.write(`  ✓ ${id}\n`)
}

await browser.close()
console.log(`\n${SHOTS.length} screens captured → presentation/assets/screenshots/`)
