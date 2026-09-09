// Portable browser companion for the two redesigned slides. Uses the same
// layout commands as PowerPoint; PNGs are browser previews, not Office exports.
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { businessEconomics, businessArchitecture } from '../business-slides.mjs'
import { ROOT } from '../theme.mjs'
import { flush, missing } from '../measure.mjs'

const out = join(ROOT, 'output', 'interactive-preview')
await mkdir(out, { recursive: true })
const escape = t => String(t).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;')
const data = async path => `data:image/png;base64,${(await readFile(path)).toString('base64')}`
const collect = fn => {
  const s = { _slideObjects: [], addText(t, options) { this._slideObjects.push({ type: 'text', text: t, options }) },
    addShape(shape, options) { this._slideObjects.push({ type: 'shape', shape, options }) },
    addImage(options) { this._slideObjects.push({ type: 'image', options }) }, addNotes() {} }
  fn({ addSlide: () => s }, 'motion')
  return s
}
let slides = [collect(businessEconomics), collect(businessArchitecture)]
if (missing()) { await flush(); slides = [collect(businessEconomics), collect(businessArchitecture)] }
let fonts = ''
for (const [name, file, weight] of [['Inter', 'Inter-Regular.ttf', 400], ['Inter', 'Inter-Bold.ttf', 700], ['Inter SemiBold', 'Inter-SemiBold.ttf', 600]]) {
  fonts += `@font-face{font-family:'${name}';src:url(data:font/ttf;base64,${(await readFile(join(ROOT, 'assets/fonts', file))).toString('base64')});font-weight:${weight}}`
}
const pages = []
for (const s of slides) {
  const objects = []
  for (const o of s._slideObjects) {
    const a = o.options, reveal = a.objectName?.match(/^reveal-(\d+)/)?.[1]
    const attrs = reveal ? `class="reveal" data-step="${+reveal}"` : ''
    const pos = `position:absolute;left:${a.x * 96}px;top:${a.y * 96}px;width:${a.w * 96}px;height:${a.h * 96}px;`
    if (o.type === 'text') {
      objects.push(`<div ${attrs} style="${pos}box-sizing:border-box;padding:4.8px 9.6px;color:#${a.color};font: ${a.bold ? 700 : a.fontFace === 'Inter SemiBold' ? 600 : 400} ${a.fontSize * 96 / 72}px '${a.fontFace}';letter-spacing:${(a.charSpacing || 0) * 96 / 72}px;line-height:${a.lineSpacing ? a.lineSpacing * 96 / 72 + 'px' : '1.2'};text-align:${a.align || 'left'};white-space:pre-wrap">${escape(o.text)}</div>`)
    } else if (o.type === 'image') {
      objects.push(`<img ${attrs} style="${pos}" src="${await data(a.path)}">`)
    } else if (o.shape === 'line') {
      objects.push(`<svg ${attrs} style="${pos}overflow:visible" viewBox="0 0 ${a.w * 96 || 1} ${a.h * 96 || 1}"><line x1="0" y1="${a.flipV ? a.h * 96 : 0}" x2="${a.w * 96}" y2="${a.flipV ? 0 : a.h * 96}" stroke="#${a.line.color}" stroke-width="${a.line.width * 96 / 72}"/></svg>`)
    } else {
      objects.push(`<div ${attrs} style="${pos}box-sizing:border-box;background:${a.fill.transparency === 100 ? 'transparent' : '#' + a.fill.color};border:${a.line.width * 96 / 72}px ${a.line.dash ? 'dashed' : 'solid'} #${a.line.color};border-radius:${o.shape === 'ellipse' ? '50%' : '12px'}"></div>`)
    }
  }
  pages.push(`<section style="background-image:url('${await data(s.background.path)}')">${objects.join('')}</section>`)
}
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>TrustCraft · Slides 17 & 18</title><style>${fonts}
body{margin:0;background:#020617;color:white;font-family:Inter,sans-serif;display:grid;min-height:100vh;place-content:center}#stage{width:1280px;height:720px;position:relative}section{position:absolute;inset:0;background-size:100% 100%;overflow:hidden;display:none}section.active{display:block}.reveal{opacity:0;transform:translateY(12px);transition:opacity .45s ease,transform .45s ease}.reveal.visible{opacity:1;transform:none}nav{display:flex;align-items:center;justify-content:center;gap:14px;padding:18px}button{font:inherit;color:#c7d2e0;background:#101e34;border:1px solid #285889;border-radius:8px;padding:10px 18px;cursor:pointer}button:hover,button:focus-visible{background:#19395c;color:white}#next{background:#2563eb;color:white}#status{font-size:13px;min-width:170px;text-align:center}@media(prefers-reduced-motion:reduce){.reveal{transition:none;transform:none}}
</style><main id="stage">${pages.join('')}</main><nav aria-label="Presentation controls"><button id="prev">← Previous</button><button id="reset">Replay slide</button><span id="status" aria-live="polite"></span><button id="next">Reveal next →</button><button id="all">Show all</button></nav><script>
let page=0,step=0;const sections=[...document.querySelectorAll('section')];
function render(){sections.forEach((s,i)=>{s.classList.toggle('active',i===page);s.querySelectorAll('.reveal').forEach(el=>el.classList.toggle('visible',+el.dataset.step<=step))});document.querySelector('#status').textContent='Slide '+(page+17)+' · Reveal '+step+' / 3';document.querySelector('#next').textContent=step===3?(page===0?'Next slide →':'Replay →'):'Reveal next →'}
function next(){if(step<3)step++;else{page=page===0?1:0;step=0}render()}
document.querySelector('#next').onclick=next;document.querySelector('#stage').onclick=next;document.querySelector('#prev').onclick=()=>{if(step>0)step--;else if(page>0){page--;step=3}render()};document.querySelector('#reset').onclick=()=>{step=0;render()};document.querySelector('#all').onclick=()=>{step=3;render()};document.onkeydown=e=>{if(e.target.tagName==='BUTTON')return;if(['ArrowRight',' '].includes(e.key)){e.preventDefault();next()}if(e.key==='ArrowLeft')document.querySelector('#prev').click()};window.showSlide=(p,s=3)=>{page=p;step=s;render()};render();
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
  if (!(await page.locator('#status').textContent()).includes('Slide 18')) throw new Error('Navigation failed')
  await page.locator('#reset').click()
  for (let i = 0; i < 2; i++) {
    await page.evaluate(i => window.showSlide(i), i)
    await page.waitForTimeout(500)
    await page.locator('#stage').screenshot({ path: join(out, `slide-${i + 17}.png`) })
  }
  console.log('Browser companion verified: reveal, navigation, replay; 2 PNG previews exported.')
} finally { await browser.close() }
