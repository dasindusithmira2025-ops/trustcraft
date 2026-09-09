// Portable browser companion for the three business-model slides. Replays the
// same layout commands the deck issues; the PNGs are browser previews, not
// Office exports.
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { businessEngines, businessEconomics, businessArchitecture } from '../business-slides.mjs'
import { ROOT } from '../theme.mjs'
import { flush, missing } from '../measure.mjs'

const out = join(ROOT, 'output', 'interactive-preview')
await mkdir(out, { recursive: true })
const esc = t => String(t).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;')
const data = async path => `data:image/png;base64,${(await readFile(path)).toString('base64')}`
const collect = fn => {
  const s = { _slideObjects: [], addText(t, options) { this._slideObjects.push({ type: 'text', text: t, options }) },
    addShape(shape, options) { this._slideObjects.push({ type: 'shape', shape, options }) },
    addImage(options) { this._slideObjects.push({ type: 'image', options }) }, addNotes() {} }
  fn({ addSlide: () => s }, 'motion')
  return s
}
const DECK = [businessEngines, businessEconomics, businessArchitecture]
let slides = DECK.map(collect)
if (missing()) { await flush(); slides = DECK.map(collect) }
let fonts = ''
for (const [name, file, weight] of [['Inter', 'Inter-Regular.ttf', 400], ['Inter', 'Inter-Bold.ttf', 700], ['Inter SemiBold', 'Inter-SemiBold.ttf', 600], ['Inter Medium', 'Inter-Medium.ttf', 500]]) {
  fonts += `@font-face{font-family:'${name}';src:url(data:font/ttf;base64,${(await readFile(join(ROOT, 'assets/fonts', file))).toString('base64')});font-weight:${weight}}`
}

const PX = 96
const fillOf = a => (!a.fill || a.fill.type === 'none' || a.fill.transparency === 100 ? 'transparent' : '#' + a.fill.color)
const edgeOf = a => (!a.line || a.line.type === 'none' ? 'none' : `${a.line.width * PX / 72}px ${a.line.dash ? 'dashed' : 'solid'} #${a.line.color}`)
const radiusOf = (shape, a) => (shape === 'ellipse' ? '50%' : shape === 'roundRect' ? `${(a.rectRadius ?? 0.1) * PX}px` : '0')
const weightOf = a => (a.bold ? 700 : a.fontFace === 'Inter SemiBold' ? 600 : a.fontFace === 'Inter Medium' ? 500 : 400)
const fontOf = a => `${weightOf(a)} ${a.fontSize * PX / 72}px '${a.fontFace}'`

const pages = []
for (const s of slides) {
  const objects = []
  const seen = new Map()
  let max = 0
  for (const o of s._slideObjects) {
    const a = o.options
    const step = a.objectName?.match(/^reveal-(\d+)/)?.[1]
    if (step) max = Math.max(max, +step)
    // Stagger inside a beat, matching the 60 ms native PowerPoint stagger.
    const nth = step ? (seen.set(step, (seen.get(step) ?? -1) + 1), seen.get(step)) : 0
    const attrs = step ? `class="reveal" data-step="${+step}" style="transition-delay:${nth * 60}ms;` : 'style="'
    const pos = `position:absolute;left:${a.x * PX}px;top:${a.y * PX}px;width:${a.w * PX}px;height:${a.h * PX}px;`

    if (o.type === 'image') {
      objects.push(`<img ${attrs}${pos}" src="${await data(a.path)}">`)
    } else if (o.type === 'text') {
      // A pill is a text box whose shape IS the visual, so it needs the fill,
      // the border and real vertical centring.
      const chrome = a.shape
        ? `background:${fillOf(a)};border:${edgeOf(a)};border-radius:${radiusOf(a.shape, a)};display:flex;align-items:center;justify-content:${a.align === 'center' ? 'center' : 'flex-start'};`
        : 'padding:4.8px 9.6px;'
      objects.push(`<div ${attrs}${pos}box-sizing:border-box;${chrome}color:#${a.color};font:${fontOf(a)};letter-spacing:${(a.charSpacing || 0) * PX / 72}px;line-height:${a.lineSpacing ? a.lineSpacing * PX / 72 + 'px' : '1.25'};text-align:${a.align || 'left'};white-space:pre-wrap">${esc(o.text)}</div>`)
    } else if (o.shape === 'line') {
      // A rule is 0 tall and a vrule is 0 wide; a zero-extent SVG viewport
      // paints nothing, so give the box a pixel and draw inside it.
      const w = Math.max(a.w * PX, 1), h = Math.max(a.h * PX, 1)
      objects.push(`<svg ${attrs}position:absolute;left:${a.x * PX}px;top:${a.y * PX}px;width:${w}px;height:${h}px;overflow:visible" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><line x1="0" y1="${a.flipV ? h : 0}" x2="${a.w * PX}" y2="${a.flipV ? 0 : a.h * PX}" stroke="#${a.line.color}" stroke-width="${a.line.width * PX / 72}"/></svg>`)
    } else {
      objects.push(`<div ${attrs}${pos}box-sizing:border-box;background:${fillOf(a)};border:${edgeOf(a)};border-radius:${radiusOf(o.shape, a)}"></div>`)
    }
  }
  pages.push({ max, html: `<section data-max="${max}" style="background-image:url('${await data(s.background.path)}')">${objects.join('')}</section>` })
}

const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>TrustCraft · Slides 16-18</title><style>${fonts}
body{margin:0;background:#020617;color:white;font-family:Inter,sans-serif;display:grid;min-height:100vh;place-content:center}#stage{width:1280px;height:720px;position:relative}section{position:absolute;inset:0;background-size:100% 100%;overflow:hidden;display:none}section.active{display:block}.reveal{opacity:0;transform:translateY(12px);transition:opacity .4s ease,transform .4s ease}.reveal.visible{opacity:1;transform:none}nav{display:flex;align-items:center;justify-content:center;gap:14px;padding:18px}button{font:inherit;color:#c7d2e0;background:#101e34;border:1px solid #285889;border-radius:8px;padding:10px 18px;cursor:pointer}button:hover,button:focus-visible{background:#19395c;color:white}#next{background:#2563eb;color:white}#status{font-size:13px;min-width:170px;text-align:center}@media(prefers-reduced-motion:reduce){.reveal{transition:none;transform:none}}
</style><main id="stage">${pages.map(p => p.html).join('')}</main><nav aria-label="Presentation controls"><button id="prev">← Previous</button><button id="reset">Replay slide</button><span id="status" aria-live="polite"></span><button id="next">Reveal next →</button><button id="all">Show all</button></nav><script>
let page=0,step=0;const sections=[...document.querySelectorAll('section')];const maxOf=i=>+sections[i].dataset.max;
function render(){sections.forEach((s,i)=>{s.classList.toggle('active',i===page);s.querySelectorAll('.reveal').forEach(el=>el.classList.toggle('visible',+el.dataset.step<=step))});document.querySelector('#status').textContent='Slide '+(page+16)+' · Reveal '+step+' / '+maxOf(page);document.querySelector('#next').textContent=step===maxOf(page)?(page<sections.length-1?'Next slide →':'Replay →'):'Reveal next →'}
function next(){if(step<maxOf(page))step++;else{page=(page+1)%sections.length;step=0}render()}
document.querySelector('#next').onclick=next;document.querySelector('#stage').onclick=next;document.querySelector('#prev').onclick=()=>{if(step>0)step--;else if(page>0){page--;step=maxOf(page)}render()};document.querySelector('#reset').onclick=()=>{step=0;render()};document.querySelector('#all').onclick=()=>{step=maxOf(page);render()};document.onkeydown=e=>{if(e.target.tagName==='BUTTON')return;if(['ArrowRight',' '].includes(e.key)){e.preventDefault();next()}if(e.key==='ArrowLeft')document.querySelector('#prev').click()};window.showSlide=(p,s)=>{page=p;step=s??maxOf(p);render()};render();
</script></html>`
await writeFile(join(out, 'index.html'), html)

const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1.5 })
  await page.setContent(html)
  await page.evaluate(() => document.fonts.ready)
  // Exercise the real controls, including the slide boundary and replay.
  await page.locator('#next').click()
  if (!(await page.locator('#status').textContent()).includes('Reveal 1')) throw new Error('Reveal failed')
  await page.locator('#all').click()
  await page.locator('#next').click()
  if (!(await page.locator('#status').textContent()).includes('Slide 17')) throw new Error('Navigation failed')
  await page.locator('#reset').click()
  for (let i = 0; i < slides.length; i++) {
    await page.evaluate(i => window.showSlide(i), i)
    await page.waitForTimeout(900)
    await page.locator('#stage').screenshot({ path: join(out, `slide-${i + 16}.png`) })
  }
  console.log(`Browser companion verified: ${pages.map(p => p.max).join(' + ')} reveals, navigation, replay; ${slides.length} PNG previews exported.`)
} finally { await browser.close() }
