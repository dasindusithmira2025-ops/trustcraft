/**
 * Renders the deck's brand furniture straight from the product's own tokens:
 * the exact radial surface `src/index.css` paints behind the app, and the
 * shield lockup drawn from the same SVG path `src/components/UI.tsx` ships.
 *
 *   node presentation/capture/brand.mjs
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'brand')
mkdirSync(OUT, { recursive: true })

// Straight from src/index.css and src/components/UI.tsx.
const SURFACE = 'radial-gradient(120% 120% at 50% 0%, #1E293B 0%, #0B1220 60%, #060A12 100%)'
const SHIELD = 'M12 3l7 3v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6l7-3zM8.8 12l2.2 2.2 4.2-4.4'

const shieldSvg = (stroke, size) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}"
     stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${SHIELD}"/></svg>`

const PAGE = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..800&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:transparent;font-family:Inter,system-ui,sans-serif}
  .tile{display:inline-flex;align-items:center;justify-content:center}
  #surface{width:1280px;height:720px;background:${SURFACE}}
  #surface-tall{width:720px;height:1280px;background:${SURFACE}}
  #mark{width:200px;height:200px;background:#2563EB;border-radius:52px}
  #lockup{display:inline-flex;width:max-content;align-items:center;gap:26px;padding:20px}
  #lockup .m{width:104px;height:104px;background:#2563EB;border-radius:28px;display:flex;align-items:center;justify-content:center}
  #lockup .w{font-size:76px;font-weight:700;letter-spacing:-0.035em;color:#fff;line-height:1}
  #lockup-ink .w{color:#0F172A}
  #lockup-ink .m{background:#2563EB}
</style></head><body>
  <div id="surface"></div>
  <div id="surface-tall"></div>
  <div id="mark" class="tile">${shieldSvg('#fff', 108)}</div>
  <div id="lockup"><span class="m">${shieldSvg('#fff', 58)}</span><span class="w">TrustCraft</span></div>
  <div id="lockup-ink" style="display:inline-flex;width:max-content;align-items:center;gap:26px;padding:20px">
    <span class="m" style="width:104px;height:104px;background:#2563EB;border-radius:28px;display:flex;align-items:center;justify-content:center">${shieldSvg('#fff', 58)}</span>
    <span class="w" style="font-size:76px;font-weight:700;letter-spacing:-0.035em;color:#0F172A;line-height:1">TrustCraft</span>
  </div>
</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1400, height: 2400 }, deviceScaleFactor: 2 })
await page.setContent(PAGE, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)

for (const [id, file, alpha] of [
  ['surface', 'bg-dark.png', false],
  ['surface-tall', 'bg-dark-tall.png', false],
  ['mark', 'mark.png', true],
  ['lockup', 'lockup-white.png', true],
  ['lockup-ink', 'lockup-ink.png', true],
]) {
  await page.locator(`#${id}`).screenshot({ path: join(OUT, file), omitBackground: alpha })
  process.stdout.write(`  ok ${file}\n`)
}

await browser.close()
console.log('brand assets -> presentation/assets/brand/')
