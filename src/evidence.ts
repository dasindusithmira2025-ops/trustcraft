/**
 * Evidence imagery, drawn rather than sourced.
 *
 * The case turns on what these pictures actually show — water under a specific
 * joint, a fractured connector, a split hose. Stock photography either misses
 * that or shows something else entirely, so these are illustrated to match the
 * facts the case asserts. They also render with no network.
 */

const uri = (svg: string): string =>
  `data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`

/** Shared material gradients. */
const DEFS = `
<linearGradient id="cab" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#332e29"/><stop offset="1" stop-color="#15130f"/>
</linearGradient>
<linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#96795a"/><stop offset="1" stop-color="#6d5741"/>
</linearGradient>
<linearGradient id="chrome" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#5f666c"/><stop offset="0.22" stop-color="#eef1f3"/>
  <stop offset="0.5" stop-color="#a7afb6"/><stop offset="0.8" stop-color="#f3f6f8"/>
  <stop offset="1" stop-color="#565c62"/>
</linearGradient>
<linearGradient id="brass" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#8a6a2c"/><stop offset="0.25" stop-color="#e8c884"/>
  <stop offset="0.55" stop-color="#b8923f"/><stop offset="0.82" stop-color="#f0d69c"/>
  <stop offset="1" stop-color="#7d5f26"/>
</linearGradient>
<linearGradient id="pvc" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#7e8388"/><stop offset="0.28" stop-color="#e4e8ea"/>
  <stop offset="0.62" stop-color="#bcc2c7"/><stop offset="1" stop-color="#6d7276"/>
</linearGradient>
<linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#b9d0da" stop-opacity="0.95"/>
  <stop offset="1" stop-color="#5a7482" stop-opacity="0.85"/>
</linearGradient>
<radialGradient id="damp" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#2b2118" stop-opacity="0.92"/>
  <stop offset="0.7" stop-color="#3a2d20" stop-opacity="0.55"/>
  <stop offset="1" stop-color="#3a2d20" stop-opacity="0"/>
</radialGradient>
<radialGradient id="vig" cx="0.5" cy="0.44" r="0.78">
  <stop offset="0.45" stop-color="#000" stop-opacity="0"/>
  <stop offset="1" stop-color="#000" stop-opacity="0.62"/>
</radialGradient>
<pattern id="braid" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
  <rect width="14" height="14" fill="#9aa2a9"/>
  <path d="M0 0h7v14H0z" fill="#cfd6db"/>
  <path d="M0 0h14v2H0z" fill="#7d858c" opacity="0.5"/>
</pattern>
<filter id="soft"><feGaussianBlur stdDeviation="7"/></filter>
<filter id="soft2"><feGaussianBlur stdDeviation="2.4"/></filter>
`

/** The pipework under a kitchen sink, shared by the before and after views. */
function cabinet(wet: boolean): string {
  return `
  <rect width="1200" height="800" fill="url(#cab)"/>
  <!-- side walls, receding -->
  <path d="M0 0 L168 104 L168 690 L0 800Z" fill="#201c18"/>
  <path d="M1200 0 L1032 104 L1032 690 L1200 800Z" fill="#1c1915"/>
  <!-- back panel -->
  <rect x="168" y="104" width="864" height="586" fill="#2e2922"/>
  <rect x="168" y="104" width="864" height="586" fill="none" stroke="#413b32" stroke-width="3"/>
  <!-- base board, in perspective -->
  <path d="M168 690 L1032 690 L1200 800 L0 800Z" fill="url(#wood)"/>
  <path d="M168 690 L1032 690 L1200 800 L0 800Z" fill="#241d15" opacity="0.42"/>
  ${wood_grain()}
  <!-- contact shadow where the panels meet the base -->
  <path d="M168 690 L1032 690 L1200 800 L0 800Z" fill="none"/>
  <rect x="0" y="686" width="1200" height="26" fill="#000" opacity="0.35" filter="url(#soft2)"/>

  ${
    wet
      ? `<!-- water soaked into the base, directly beneath the failing joint -->
         <ellipse cx="368" cy="748" rx="270" ry="56" fill="url(#damp)"/>
         <ellipse cx="360" cy="752" rx="146" ry="27" fill="url(#water)"/>
         <ellipse cx="360" cy="752" rx="146" ry="27" fill="none" stroke="#d6e7ee" stroke-width="2.5" opacity="0.55"/>
         <ellipse cx="322" cy="745" rx="46" ry="8" fill="#f2f8fb" opacity="0.55"/>
         <ellipse cx="404" cy="757" rx="22" ry="5" fill="#f2f8fb" opacity="0.3"/>
         <!-- the base swelling at the back corner -->
         <path d="M214 706 q80 -12 168 -2" stroke="#1a140d" stroke-width="7" fill="none" opacity="0.5"/>`
      : `<ellipse cx="368" cy="748" rx="230" ry="42" fill="#000" opacity="0.16"/>`
  }

  <!-- waste pipe and P-trap -->
  <g fill="none" stroke-linecap="round">
    <path d="M596 104 V430 A96 96 0 0 0 788 430 V352 H930" stroke="#000" stroke-width="76" opacity="0.4"/>
    <path d="M596 104 V430 A96 96 0 0 0 788 430 V352 H930" stroke="url(#pvc)" stroke-width="64"/>
    <path d="M578 120 V424" stroke="#fff" stroke-width="9" opacity="0.3"/>
    <path d="M770 372 V420" stroke="#fff" stroke-width="8" opacity="0.22"/>
  </g>
  <!-- trap collars -->
  <rect x="556" y="382" width="80" height="28" rx="9" fill="url(#chrome)"/>
  <rect x="748" y="336" width="80" height="28" rx="9" fill="url(#chrome)"/>

  <!-- the supply riser under scrutiny -->
  <rect x="330" y="150" width="38" height="330" rx="18" fill="url(#braid)"/>
  <rect x="330" y="150" width="38" height="330" rx="18" fill="#000" opacity="0.12"/>
  <rect x="336" y="158" width="9" height="314" rx="5" fill="#fff" opacity="0.3"/>
  <!-- isolation valve -->
  <rect x="316" y="480" width="68" height="52" rx="10" fill="url(#chrome)"/>
  <rect x="296" y="496" width="24" height="38" rx="8" fill="url(#chrome)"/>
  <!-- the compression connector at the top -->
  <rect x="316" y="120" width="66" height="46" rx="9" fill="url(#brass)"/>
  <path d="M316 134 h66 M316 152 h66" stroke="#000" stroke-width="3" opacity="0.18"/>

  ${
    wet
      ? `<!-- hairline fracture in the connector body -->
         <path d="M330 126 l10 12 l-6 9 l12 11 l-4 8" stroke="#3a2c0c" stroke-width="3.4"
               fill="none" stroke-linecap="round" stroke-linejoin="round"/>
         <!-- the bead, the run down the braid, and the fall -->
         <path d="M348 166 q7 22 1 34 q-7 -12 -1 -34Z" fill="url(#water)"/>
         <path d="M347 200 q6 130 2 268" stroke="#c3dce6" stroke-width="5" fill="none" opacity="0.55"/>
         <ellipse cx="349" cy="470" rx="14" ry="18" fill="url(#water)"/>
         <ellipse cx="344" cy="463" rx="4.5" ry="7" fill="#fff" opacity="0.8"/>
         <ellipse cx="352" cy="596" rx="10" ry="14" fill="url(#water)" opacity="0.9"/>
         <ellipse cx="356" cy="676" rx="7" ry="10" fill="url(#water)" opacity="0.75"/>`
      : `<rect x="320" y="124" width="20" height="38" rx="6" fill="#fff" opacity="0.35"/>`
  }

  <!-- the second riser, further back and softer -->
  <g filter="url(#soft2)" opacity="0.75">
    <rect x="848" y="176" width="30" height="292" rx="14" fill="url(#braid)"/>
    <rect x="834" y="468" width="60" height="44" rx="9" fill="url(#chrome)"/>
  </g>

  <rect width="1200" height="800" fill="url(#vig)"/>
  `
}

function wood_grain(): string {
  return Array.from({ length: 9 }, (_, i) => {
    const y = 700 + i * 12
    return `<path d="M${60 + i * 8} ${y} q300 ${i % 2 ? 6 : -6} 1080 0" stroke="#000" stroke-width="1.5" opacity="0.12" fill="none"/>`
  }).join('')
}

const wrap = (body: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800"><defs>${DEFS}</defs>${body}</svg>`

// ── 1. Under-sink cabinet, water present ────────────────────────────────────

export const UNDER_SINK = uri(wrap(cabinet(true)))

// ── 2. The supply connection, close ─────────────────────────────────────────

export const SUPPLY_CONNECTION = uri(
  wrap(`
  <rect width="1200" height="800" fill="#1d1a17"/>
  <g filter="url(#soft)" opacity="0.85">
    <rect x="0" y="520" width="1200" height="280" fill="#5c4a37"/>
    <rect x="820" y="120" width="40" height="420" rx="18" fill="#7f868c"/>
  </g>
  <!-- braided hose entering from the top -->
  <rect x="470" y="0" width="120" height="300" rx="20" fill="url(#braid)"/>
  <rect x="470" y="0" width="120" height="300" rx="20" fill="#000" opacity="0.1"/>
  <!-- crimp collar -->
  <rect x="452" y="286" width="156" height="54" rx="14" fill="url(#chrome)"/>
  <rect x="452" y="300" width="156" height="8" fill="#000" opacity="0.18"/>
  <!-- brass compression nut -->
  <rect x="440" y="336" width="180" height="120" rx="16" fill="url(#brass)"/>
  <path d="M440 366 h180 M440 400 h180 M440 430 h180" stroke="#000" stroke-width="3" opacity="0.16"/>
  <!-- hairline fracture across the nut -->
  <path d="M462 348 l22 26 l-13 18 l26 22 l-10 20" stroke="#3f3010" stroke-width="4"
        fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- valve body below -->
  <rect x="466" y="452" width="128" height="96" rx="12" fill="url(#chrome)"/>
  <!-- the bead of water at the joint, and the drip -->
  <path d="M470 452 q-18 34 -4 56 q18 -22 4 -56Z" fill="url(#water)"/>
  <ellipse cx="462" cy="560" rx="20" ry="26" fill="url(#water)"/>
  <ellipse cx="456" cy="550" rx="6" ry="9" fill="#fff" opacity="0.8"/>
  <ellipse cx="459" cy="640" rx="13" ry="17" fill="url(#water)" opacity="0.9"/>
  <ellipse cx="452" cy="712" rx="120" ry="26" fill="url(#water)" opacity="0.55"/>
  <rect width="1200" height="800" fill="url(#vig)"/>
`),
)

// ── 3. The fractured connector, removed (inspection evidence) ───────────────

export const FRACTURED_CONNECTOR = uri(
  wrap(`
  <defs>
    <linearGradient id="bench" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4a453f"/><stop offset="1" stop-color="#2a2622"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="#1a1815"/>
  <!-- work surface, horizon high so the part sits on something -->
  <rect x="0" y="470" width="1200" height="330" fill="url(#bench)"/>
  <rect x="0" y="470" width="1200" height="5" fill="#5d574f" opacity="0.7"/>
  <g filter="url(#soft)" opacity="0.6">
    <rect x="0" y="300" width="1200" height="180" fill="#0f0e0c"/>
  </g>
  <!-- contact shadow, tight under the part -->
  <ellipse cx="600" cy="556" rx="290" ry="34" fill="#000" opacity="0.55" filter="url(#soft2)"/>

  <g transform="translate(600 500) rotate(-7) translate(-600 -500)">
    <!-- threaded tail -->
    <rect x="330" y="474" width="130" height="52" rx="8" fill="url(#brass)"/>
    <path d="M330 484 h130 M330 496 h130 M330 508 h130 M330 520 h130"
          stroke="#000" stroke-width="3.5" opacity="0.22"/>
    <!-- hex nut -->
    <path d="M460 458 h150 l26 42 l-26 42 h-150 l-26 -42Z" fill="url(#brass)"/>
    <path d="M460 458 h150 l26 42 l-26 42 h-150 l-26 -42Z" fill="none" stroke="#6d5320" stroke-width="3"/>
    <path d="M460 458 v84 M610 458 v84" stroke="#6d5320" stroke-width="2.5" opacity="0.7"/>
    <!-- barrel where it failed -->
    <rect x="636" y="466" width="180" height="68" rx="12" fill="url(#brass)"/>
    <rect x="636" y="472" width="180" height="14" rx="7" fill="#fff" opacity="0.25"/>
    <!-- compression olive -->
    <rect x="816" y="470" width="46" height="60" rx="10" fill="url(#brass)"/>
    <!-- the hairline fracture, running the barrel -->
    <path d="M690 466 l18 24 l-14 18 l20 26" stroke="#241a04" stroke-width="6"
          fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M690 466 l18 24 l-14 18 l20 26" stroke="#f0d9a2" stroke-width="1.8"
          fill="none" stroke-linecap="round" opacity="0.6"/>
    <!-- corrosion bloom around it -->
    <ellipse cx="706" cy="500" rx="66" ry="40" fill="#4f3d14" opacity="0.4"/>
    <ellipse cx="702" cy="500" rx="32" ry="22" fill="#2e2408" opacity="0.45"/>
  </g>

  <!-- residual moisture ring on the bench -->
  <ellipse cx="420" cy="600" rx="120" ry="20" fill="#20211f" opacity="0.75"/>
  <ellipse cx="420" cy="600" rx="120" ry="20" fill="none" stroke="#7c848a" stroke-width="2" opacity="0.3"/>
  <rect width="1200" height="800" fill="url(#vig)"/>
`),
)

// ── 4. The perished flexible hose (change-request evidence) ─────────────────

export const PERISHED_HOSE = uri(
  wrap(`
  <rect width="1200" height="800" fill="#211e1b"/>
  <g filter="url(#soft)"><ellipse cx="600" cy="500" rx="470" ry="140" fill="#000" opacity="0.55"/></g>
  <path d="M100 580 q500 -60 1000 0 l0 220 l-1000 0Z" fill="#38342f"/>
  <!-- the hose, curving across the frame -->
  <g transform="translate(0 -20)">
    <path d="M120 430 q220 -120 460 -20 q240 100 500 -30" stroke="url(#braid)"
          stroke-width="96" fill="none" stroke-linecap="round"/>
    <path d="M120 430 q220 -120 460 -20 q240 100 500 -30" stroke="#000"
          stroke-width="96" fill="none" stroke-linecap="round" opacity="0.12"/>
    <!-- split in the outer sleeve, exposing the black inner tube -->
    <path d="M452 368 q76 -26 152 8" stroke="#141312" stroke-width="34" fill="none" stroke-linecap="round"/>
    <path d="M452 368 q76 -26 152 8" stroke="#5b3f34" stroke-width="16" fill="none" stroke-linecap="round"/>
    <path d="M452 368 q76 -26 152 8" stroke="#8a6355" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.7"/>
    <!-- frayed braid strands lifting away from the split -->
    <path d="M446 350 l-20 -26 M486 332 l-8 -30 M528 326 l6 -32 M572 332 l20 -28 M610 352 l28 -20"
          stroke="#c8cfd5" stroke-width="6" stroke-linecap="round" opacity="0.85"/>
    <path d="M466 340 l-10 -30 M550 324 l2 -30 M592 340 l24 -24"
          stroke="#9aa2a9" stroke-width="4" stroke-linecap="round" opacity="0.7"/>
    <!-- crimp ferrule, corroded at the collar -->
    <rect x="972" y="322" width="76" height="128" rx="14" fill="url(#chrome)"/>
    <rect x="1042" y="342" width="72" height="88" rx="12" fill="url(#chrome)"/>
    <path d="M980 336 h60 M980 366 h60 M980 400 h60 M980 432 h60"
          stroke="#000" stroke-width="4" opacity="0.22"/>
    <ellipse cx="1012" cy="392" rx="48" ry="54" fill="#7a5a2a" opacity="0.45"/>
    <ellipse cx="1000" cy="404" rx="24" ry="28" fill="#4d3614" opacity="0.5"/>
    <ellipse cx="1062" cy="386" rx="20" ry="24" fill="#6b4d20" opacity="0.35"/>
  </g>
  <rect width="1200" height="800" fill="url(#vig)"/>
`),
)

// ── 5. The same cabinet after the repair ────────────────────────────────────

export const AFTER_REPAIR = uri(
  wrap(`
  ${cabinet(false)}
  <!-- new parts read as clean highlights, not as a different room -->
  <rect x="318" y="126" width="54" height="40" rx="8" fill="url(#brass)"/>
  <rect x="322" y="130" width="18" height="32" rx="5" fill="#fff" opacity="0.4"/>
  <rect x="330" y="150" width="30" height="330" rx="14" fill="url(#braid)"/>
  <rect x="334" y="156" width="8" height="318" rx="4" fill="#fff" opacity="0.35"/>
  <rect width="1200" height="800" fill="url(#vig)"/>
`),
)
