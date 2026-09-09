/**
 * TrustCraft — original score and sound design.
 *
 * Everything here is synthesised from first principles: sine/triangle/saw
 * oscillators, filtered noise and ADSR envelopes, rendered sample by sample
 * and written straight to WAV. Nothing is sampled, nothing is licensed, and
 * two runs produce byte-identical files.
 *
 * It is written against the film's frame numbers rather than against bars, so
 * a musical event can be placed on the exact frame a visual event happens.
 *
 *   node scripts/score.mjs
 *     → public/audio/trustcraft-score.wav   (music bed)
 *     → public/audio/trustcraft-sfx.wav     (interface + transition design)
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, '..', 'public', 'audio')

const SR = 48000
const FPS = 30
const LEN_F = 915 // a few frames of tail past the 900-frame cut
const N = Math.round((LEN_F / FPS) * SR)

/** Frames → samples. The whole score is addressed in film frames. */
const f2s = f => Math.round((f / FPS) * SR)

// ── Tiny synth ───────────────────────────────────────────────────────────────

const buf = () => ({ l: new Float64Array(N), r: new Float64Array(N) })

/** Deterministic noise source (mulberry32) — no Math.random anywhere. */
const rng = (seed => () => {
  seed = (seed + 0x6d2b79f5) >>> 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
})(20260909)

const osc = (type, phase) => {
  const p = phase % 1
  switch (type) {
    case 'sine': return Math.sin(p * Math.PI * 2)
    case 'tri': return 4 * Math.abs(p - 0.5) - 1
    case 'saw': return 2 * p - 1
    default: return Math.sin(p * Math.PI * 2)
  }
}

/** ADSR in seconds; returns gain at time t within a note of length dur. */
const adsr = (t, dur, a, d, s, r) => {
  if (t < 0) return 0
  if (t < a) return t / a
  if (t < a + d) return 1 + (s - 1) * ((t - a) / d)
  if (t < dur) return s
  const rt = t - dur
  return rt < r ? s * (1 - rt / r) : 0
}

/**
 * Add a tone. `fromF`/`durF` are in frames; envelope times are in seconds.
 * `glide` optionally sweeps the pitch across the note (for risers and kicks).
 */
function tone(b, {
  fromF, durF, freq, freqTo, amp = 0.2, wave = 'sine', pan = 0,
  a = 0.01, d = 0.1, s = 0.7, r = 0.3, detune = 0, harmonic = 0, vib = 0,
}) {
  const i0 = f2s(fromF)
  const dur = durF / FPS
  const tail = dur + r + 0.05
  const n = Math.round(tail * SR)
  let ph = 0
  let ph2 = 0
  const gl = freqTo ?? freq
  for (let i = 0; i < n; i++) {
    const idx = i0 + i
    if (idx < 0 || idx >= N) continue
    const t = i / SR
    const k = Math.min(1, t / Math.max(dur, 1e-6))
    // Exponential glide reads more natural than linear on pitch.
    const fr = freq * Math.pow(gl / freq, k) * (1 + (vib ? Math.sin(t * 2 * Math.PI * 4.5) * vib : 0))
    ph += fr / SR
    ph2 += (fr * (1 + detune)) / SR
    const env = adsr(t, dur, a, d, s, r)
    if (env <= 0) continue
    let v = osc(wave, ph)
    if (detune) v = (v + osc(wave, ph2)) * 0.5
    if (harmonic) v += osc('sine', ph * 2) * harmonic
    v *= env * amp
    const lg = Math.cos(((pan + 1) / 2) * (Math.PI / 2))
    const rg = Math.sin(((pan + 1) / 2) * (Math.PI / 2))
    b.l[idx] += v * lg
    b.r[idx] += v * rg
  }
}

/** Filtered noise: one-pole lowpass, optionally swept. Used for air and percussion. */
function noise(b, { fromF, durF, amp = 0.1, cut = 3000, cutTo, a = 0.005, r = 0.2, pan = 0, hp = 0 }) {
  const i0 = f2s(fromF)
  const dur = durF / FPS
  const n = Math.round((dur + r + 0.05) * SR)
  let lp = 0
  let hpS = 0
  for (let i = 0; i < n; i++) {
    const idx = i0 + i
    if (idx < 0 || idx >= N) continue
    const t = i / SR
    const k = Math.min(1, t / Math.max(dur, 1e-6))
    const fc = cutTo ? cut * Math.pow(cutTo / cut, k) : cut
    const alpha = Math.min(1, (2 * Math.PI * fc) / SR)
    const white = rng() * 2 - 1
    lp += alpha * (white - lp)
    let v = lp
    if (hp) {
      const ah = Math.min(1, (2 * Math.PI * hp) / SR)
      hpS += ah * (v - hpS)
      v = v - hpS
    }
    const env = adsr(t, dur, a, 0.05, 0.85, r)
    v *= env * amp
    const lg = Math.cos(((pan + 1) / 2) * (Math.PI / 2))
    const rg = Math.sin(((pan + 1) / 2) * (Math.PI / 2))
    b.l[idx] += v * lg
    b.r[idx] += v * rg
  }
}

/** Simple stereo plate-ish reverb: a few diffuse taps. Cheap, and enough. */
function reverb(b, mix = 0.22) {
  const taps = [
    [0.0231, 0.62, -0.3], [0.0367, 0.52, 0.35], [0.0533, 0.44, -0.5],
    [0.0791, 0.36, 0.55], [0.1137, 0.28, -0.2], [0.1601, 0.2, 0.25],
    [0.2273, 0.13, 0.0], [0.3109, 0.08, 0.15],
  ]
  const wl = new Float64Array(N)
  const wr = new Float64Array(N)
  for (const [dt, g, p] of taps) {
    const d = Math.round(dt * SR)
    const lg = Math.cos(((p + 1) / 2) * (Math.PI / 2))
    const rg = Math.sin(((p + 1) / 2) * (Math.PI / 2))
    for (let i = d; i < N; i++) {
      const src = (b.l[i - d] + b.r[i - d]) * 0.5
      wl[i] += src * g * lg
      wr[i] += src * g * rg
    }
  }
  // One-pole damping so the tail is warm rather than fizzy.
  let dl = 0
  let dr = 0
  const alpha = Math.min(1, (2 * Math.PI * 3200) / SR)
  for (let i = 0; i < N; i++) {
    dl += alpha * (wl[i] - dl)
    dr += alpha * (wr[i] - dr)
    b.l[i] = b.l[i] * (1 - mix * 0.35) + dl * mix
    b.r[i] = b.r[i] * (1 - mix * 0.35) + dr * mix
  }
}

function writeWav(path, b, peak = 0.89) {
  let max = 0
  for (let i = 0; i < N; i++) max = Math.max(max, Math.abs(b.l[i]), Math.abs(b.r[i]))
  const g = max > 0 ? peak / max : 1

  const bytes = N * 4
  const out = Buffer.alloc(44 + bytes)
  out.write('RIFF', 0)
  out.writeUInt32LE(36 + bytes, 4)
  out.write('WAVE', 8)
  out.write('fmt ', 12)
  out.writeUInt32LE(16, 16)
  out.writeUInt16LE(1, 20)
  out.writeUInt16LE(2, 22)
  out.writeUInt32LE(SR, 24)
  out.writeUInt32LE(SR * 4, 28)
  out.writeUInt16LE(4, 32)
  out.writeUInt16LE(16, 34)
  out.write('data', 36)
  out.writeUInt32LE(bytes, 40)

  // Soft-clip before quantising; nothing should ever hit the rails hard.
  const sc = x => Math.tanh(x * 1.06) * 0.985
  for (let i = 0; i < N; i++) {
    out.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(sc(b.l[i] * g) * 32767))), 44 + i * 4)
    out.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(sc(b.r[i] * g) * 32767))), 44 + i * 4 + 2)
  }
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, out)
  return out.length
}

// ── The arrangement ──────────────────────────────────────────────────────────
//
// 100 BPM. One beat = 18 frames, one bar = 72 frames — so the grid lines up
// cleanly with the film's frame math. Harmony walks Am → F → C → G and lands
// on C major for the brand resolve: tension resolving into confidence, which
// is the entire story of the film in one cadence.

const BEAT = 18

const SECTIONS = [
  // start, sub root, chord (Hz), label
  { f: 0,   sub: 55.00, chord: [110.00, 164.81], name: 'Am — held' },
  { f: 126, sub: 55.00, chord: [110.00, 130.81, 164.81], name: 'Am — pulse' },
  { f: 375, sub: 43.65, chord: [87.31, 130.81, 174.61], name: 'F — momentum' },
  { f: 525, sub: 65.41, chord: [130.81, 164.81, 196.00], name: 'C — lift' },
  { f: 648, sub: 49.00, chord: [98.00, 123.47, 146.83], name: 'G — confidence' },
  { f: 738, sub: 43.65, chord: [87.31, 130.81, 174.61], name: 'F — build' },
  { f: 798, sub: 65.41, chord: [130.81, 164.81, 196.00, 261.63], name: 'C — resolve' },
]

function music() {
  const b = buf()

  SECTIONS.forEach((sec, i) => {
    const next = SECTIONS[i + 1]
    const end = next ? next.f : LEN_F
    const dur = end - sec.f

    // Sub — the floor of the mix. Long attack so it swells rather than thumps.
    tone(b, {
      fromF: sec.f - (i === 0 ? 0 : 6), durF: dur + 6, freq: sec.sub,
      amp: i === 0 ? 0.30 : i >= 5 ? 0.46 : 0.38,
      wave: 'sine', a: i === 0 ? 1.6 : 0.5, d: 0.4, s: 0.86, r: 1.1, harmonic: 0.06,
    })

    // Pad — detuned voices, spread, opening as the film gains confidence.
    sec.chord.forEach((hz, k) => {
      const pan = (k - (sec.chord.length - 1) / 2) * 0.45
      tone(b, {
        fromF: sec.f - (i === 0 ? 0 : 8), durF: dur + 8, freq: hz * 2,
        amp: (i === 0 ? 0.055 : i >= 5 ? 0.115 : 0.085) * (1 - k * 0.12),
        wave: 'tri', detune: 0.004, pan,
        a: i === 0 ? 2.2 : 0.85, d: 0.6, s: 0.78, r: 1.4,
      })
      // A breath of air an octave up, very quiet, keeps the pad from sounding dull.
      tone(b, {
        fromF: sec.f, durF: dur, freq: hz * 4, amp: 0.018 * (i >= 3 ? 1.5 : 1),
        wave: 'sine', pan: -pan, a: 1.2, d: 0.5, s: 0.6, r: 1.2,
      })
    })
  })

  const secAt = f => {
    let s = SECTIONS[0]
    for (const x of SECTIONS) if (f >= x.f) s = x
    return s
  }

  // ── Pulse: soft eighth-note heartbeat. Enters with the search surface. ────
  for (let f = 126; f < 798; f += BEAT / 2) {
    const sec = secAt(f)
    // Duck the pulse through the trust act so the harmony can breathe.
    const quiet = f >= 525 && f < 648 ? 0.45 : 1
    const swell = Math.min(1, (f - 126) / 90)
    const strong = Math.round(f / BEAT) % 2 === 0
    tone(b, {
      fromF: f, durF: 3, freq: sec.sub * 2,
      amp: 0.085 * swell * quiet * (strong ? 1 : 0.6),
      wave: 'sine', a: 0.004, d: 0.09, s: 0.15, r: 0.16,
    })
  }

  // ── Pluck: the melodic thread. Walks the chord, never a tune you'd hum. ───
  const PATTERN = [0, 1, 2, 1, 0, 2, 1, 0]
  let step = 0
  for (let f = 165; f < 800; f += BEAT / 2) {
    const sec = secAt(f)
    const tones = sec.chord
    const note = tones[PATTERN[step % PATTERN.length] % tones.length]
    step++
    // Rest on some steps — space is what keeps this from sounding like a loop.
    if (step % 8 === 3 || step % 8 === 6) continue
    const oct = step % 16 < 8 ? 4 : 8
    const swell = Math.min(1, (f - 165) / 120)
    const lift = f >= 525 ? 1.25 : 1
    tone(b, {
      fromF: f, durF: 4, freq: note * oct,
      amp: 0.05 * swell * lift, wave: 'tri', harmonic: 0.12,
      pan: ((step % 4) - 1.5) * 0.28,
      a: 0.003, d: 0.22, s: 0.06, r: 0.42,
    })
  }

  // ── Percussion: restrained. A low kick on the strong beats, air on the offs.
  for (let f = 375; f < 800; f += BEAT * 2) {
    tone(b, { fromF: f, durF: 2, freq: 92, freqTo: 44, amp: 0.34, wave: 'sine', a: 0.002, d: 0.12, s: 0.02, r: 0.1 })
    noise(b, { fromF: f, durF: 1, amp: 0.025, cut: 2600, cutTo: 600, r: 0.05 })
  }
  for (let f = 386; f < 800; f += BEAT) {
    if (Math.round((f - 386) / BEAT) % 2 === 0) continue
    noise(b, { fromF: f, durF: 1, amp: 0.020, cut: 9000, cutTo: 5200, hp: 2400, r: 0.06, pan: 0.3 })
  }
  // The kick doubles up through the build.
  for (let f = 738; f < 800; f += BEAT) {
    tone(b, { fromF: f, durF: 2, freq: 96, freqTo: 42, amp: 0.36, wave: 'sine', a: 0.002, d: 0.14, s: 0.02, r: 0.12 })
  }

  // ── Transitions: air moving between sections ─────────────────────────────
  noise(b, { fromF: 96, durF: 34, amp: 0.075, cut: 300, cutTo: 5200, a: 0.6, r: 0.25 })   // into the reveal
  noise(b, { fromF: 350, durF: 26, amp: 0.055, cut: 400, cutTo: 4200, a: 0.5, r: 0.3 })   // into discovery
  noise(b, { fromF: 500, durF: 30, amp: 0.045, cut: 5000, cutTo: 700, a: 0.15, r: 0.5 })  // settling on the person
  noise(b, { fromF: 740, durF: 52, amp: 0.10, cut: 260, cutTo: 7200, a: 1.7, r: 0.35 })   // the build

  // ── Brand resolve at frame 798: weight from arrangement, not from volume ──
  tone(b, { fromF: 798, durF: 4, freq: 130.81, freqTo: 65.41, amp: 0.42, wave: 'sine', a: 0.003, d: 0.5, s: 0.1, r: 1.2 })
  ;[261.63, 329.63, 392.0, 523.25].forEach((hz, k) => {
    tone(b, {
      fromF: 798, durF: 98, freq: hz, amp: 0.062 - k * 0.008, wave: 'tri', detune: 0.003,
      pan: (k - 1.5) * 0.4, a: 0.25, d: 0.8, s: 0.62, r: 2.2,
    })
  })

  // Final tail: everything decays into a clean, quiet C.
  tone(b, { fromF: 846, durF: 40, freq: 65.41, amp: 0.22, wave: 'sine', a: 0.4, d: 0.6, s: 0.5, r: 1.6 })

  reverb(b, 0.26)

  // Gentle fade-in from black silence and a clean fade at the cut.
  const fin = f2s(10)
  for (let i = 0; i < fin; i++) {
    const g = i / fin
    b.l[i] *= g
    b.r[i] *= g
  }
  const fs = f2s(886)
  const fe = f2s(902)
  for (let i = fs; i < N; i++) {
    const g = Math.max(0, 1 - (i - fs) / (fe - fs))
    b.l[i] *= g
    b.r[i] *= g
  }

  return b
}

// ── Sound design ─────────────────────────────────────────────────────────────
//
// Every cue is anchored to the frame its picture lands on. Deliberately small:
// these should sit inside the music, not on top of it.

function sfx() {
  const b = buf()

  // 0:00 — the leak. Two drips, the second quieter and further away.
  const drip = (f, amp, pan) => {
    tone(b, { fromF: f, durF: 1, freq: 1500, freqTo: 620, amp, wave: 'sine', a: 0.001, d: 0.05, s: 0.05, r: 0.14, pan })
    noise(b, { fromF: f, durF: 1, amp: amp * 0.18, cut: 6000, cutTo: 1800, hp: 900, r: 0.09, pan })
  }
  drip(2, 0.26, -0.2)
  drip(24, 0.34, -0.15)
  drip(72, 0.22, -0.1)

  // 0:03.4 — the pull that collapses the fragments.
  tone(b, { fromF: 96, durF: 22, freq: 220, freqTo: 55, amp: 0.20, wave: 'sine', a: 0.35, d: 0.3, s: 0.5, r: 0.4 })
  noise(b, { fromF: 100, durF: 14, amp: 0.075, cut: 4200, cutTo: 500, a: 0.1, r: 0.3 })

  // 0:04.3 — the surface opens.
  tone(b, { fromF: 130, durF: 3, freq: 660, amp: 0.12, wave: 'sine', a: 0.004, d: 0.12, s: 0.1, r: 0.35 })
  noise(b, { fromF: 128, durF: 10, amp: 0.055, cut: 700, cutTo: 6500, a: 0.22, r: 0.28 })

  // 0:05.8 — typing. Quiet tactile ticks, irregular like real hands.
  let t = 176
  for (let i = 0; i < 27; i++) {
    const jitter = ((i * 37) % 11) / 11 - 0.5
    t += 1.35 + jitter * 0.8
    noise(b, {
      fromF: Math.round(t), durF: 1, amp: 0.030 + (i % 3) * 0.004,
      cut: 7800, cutTo: 2600, hp: 1800, r: 0.035, pan: ((i % 5) - 2) * 0.12,
    })
  }

  // 0:07.5 — the first understanding lands.
  tone(b, { fromF: 224, durF: 2, freq: 784, amp: 0.10, wave: 'sine', a: 0.003, d: 0.14, s: 0.12, r: 0.4 })
  tone(b, { fromF: 226, durF: 2, freq: 1046.5, amp: 0.055, wave: 'sine', a: 0.003, d: 0.12, s: 0.1, r: 0.34 })

  // 0:08.2 — voice mode arms.
  tone(b, { fromF: 246, durF: 3, freq: 523.25, amp: 0.085, wave: 'sine', a: 0.006, d: 0.1, s: 0.3, r: 0.24 })
  tone(b, { fromF: 251, durF: 3, freq: 659.25, amp: 0.085, wave: 'sine', a: 0.006, d: 0.1, s: 0.3, r: 0.3 })
  // A breath of room tone while the mic is live.
  noise(b, { fromF: 248, durF: 38, amp: 0.017, cut: 1600, hp: 300, a: 0.2, r: 0.5 })
  tone(b, { fromF: 286, durF: 2, freq: 880, amp: 0.075, wave: 'sine', a: 0.003, d: 0.12, s: 0.1, r: 0.36 })

  // 0:10.1 — the photograph drops in and locks.
  noise(b, { fromF: 304, durF: 2, amp: 0.085, cut: 2400, cutTo: 480, r: 0.14 })
  tone(b, { fromF: 304, durF: 2, freq: 300, freqTo: 150, amp: 0.13, wave: 'sine', a: 0.002, d: 0.1, s: 0.05, r: 0.2 })
  tone(b, { fromF: 332, durF: 2, freq: 932, amp: 0.075, wave: 'sine', a: 0.002, d: 0.1, s: 0.08, r: 0.3 })

  // 0:11.7 — "Understood." A warm perfect fifth, the act's full stop.
  tone(b, { fromF: 350, durF: 10, freq: 523.25, amp: 0.13, wave: 'tri', a: 0.01, d: 0.3, s: 0.4, r: 0.9 })
  tone(b, { fromF: 350, durF: 10, freq: 784.0, amp: 0.085, wave: 'tri', a: 0.014, d: 0.3, s: 0.35, r: 0.9, pan: 0.3 })
  tone(b, { fromF: 352, durF: 8, freq: 1046.5, amp: 0.045, wave: 'sine', a: 0.02, d: 0.3, s: 0.25, r: 0.8, pan: -0.3 })

  // 0:12.9 — results arrive; 0:14.5 — the layout responds.
  noise(b, { fromF: 386, durF: 8, amp: 0.05, cut: 900, cutTo: 5200, a: 0.12, r: 0.26, pan: -0.25 })
  noise(b, { fromF: 414, durF: 16, amp: 0.045, cut: 5600, cutTo: 900, a: 0.1, r: 0.3, pan: 0.25 })
  tone(b, { fromF: 414, durF: 6, freq: 392, freqTo: 261.63, amp: 0.055, wave: 'sine', a: 0.02, d: 0.2, s: 0.2, r: 0.4 })

  // 0:16.4 — the chosen card leaves the device and comes forward.
  noise(b, { fromF: 492, durF: 12, amp: 0.038, cut: 4600, cutTo: 800, a: 0.12, r: 0.4 })
  tone(b, { fromF: 492, durF: 8, freq: 330, freqTo: 196, amp: 0.055, wave: 'sine', a: 0.05, d: 0.3, s: 0.25, r: 0.6 })

  // 0:21.6 — the profile opens out.
  noise(b, { fromF: 648, durF: 6, amp: 0.030, cut: 3400, cutTo: 1100, hp: 700, r: 0.22, pan: -0.2 })
  tone(b, { fromF: 648, durF: 4, freq: 587.33, amp: 0.042, wave: 'tri', a: 0.006, d: 0.16, s: 0.16, r: 0.4 })

  // 0:17.8 — trust. A restrained positive accent, not a fanfare.
  tone(b, { fromF: 534, durF: 6, freq: 659.25, amp: 0.09, wave: 'tri', a: 0.008, d: 0.2, s: 0.3, r: 0.7 })
  tone(b, { fromF: 537, durF: 6, freq: 987.77, amp: 0.05, wave: 'sine', a: 0.01, d: 0.2, s: 0.25, r: 0.6, pan: 0.35 })

  // 0:22.9 — the choice is made.
  noise(b, { fromF: 686, durF: 1, amp: 0.075, cut: 5200, cutTo: 1400, hp: 900, r: 0.05 })
  tone(b, { fromF: 686, durF: 1, freq: 420, freqTo: 260, amp: 0.10, wave: 'sine', a: 0.001, d: 0.05, s: 0.05, r: 0.12 })

  // 0:23.3 — confirmed. Warm major third.
  tone(b, { fromF: 698, durF: 12, freq: 523.25, amp: 0.12, wave: 'tri', a: 0.01, d: 0.3, s: 0.4, r: 1.0 })
  tone(b, { fromF: 700, durF: 12, freq: 659.25, amp: 0.09, wave: 'tri', a: 0.012, d: 0.3, s: 0.38, r: 1.0, pan: 0.3 })
  tone(b, { fromF: 702, durF: 10, freq: 1046.5, amp: 0.04, wave: 'sine', a: 0.02, d: 0.3, s: 0.3, r: 0.9, pan: -0.3 })

  // 0:24.6 — the platform opens out.
  noise(b, { fromF: 738, durF: 54, amp: 0.06, cut: 400, cutTo: 6800, a: 1.5, r: 0.3 })

  // 0:26.6 — the mark. One resolve, from arrangement rather than loudness.
  tone(b, { fromF: 798, durF: 3, freq: 160, freqTo: 65.41, amp: 0.30, wave: 'sine', a: 0.004, d: 0.4, s: 0.12, r: 1.1 })
  tone(b, { fromF: 798, durF: 16, freq: 523.25, amp: 0.075, wave: 'tri', a: 0.02, d: 0.5, s: 0.35, r: 1.6 })
  tone(b, { fromF: 801, durF: 14, freq: 783.99, amp: 0.045, wave: 'sine', a: 0.03, d: 0.5, s: 0.3, r: 1.5, pan: 0.3 })
  noise(b, { fromF: 798, durF: 3, amp: 0.03, cut: 8000, cutTo: 1200, hp: 2000, r: 0.4 })
  // The wordmark clears its mask — one soft harmonic, nothing more.
  tone(b, { fromF: 820, durF: 10, freq: 659.25, amp: 0.042, wave: 'tri', a: 0.03, d: 0.4, s: 0.3, r: 1.2, pan: -0.25 })

  reverb(b, 0.20)

  // Match the picture's cut.
  const fs = f2s(890)
  const fe = f2s(902)
  for (let i = fs; i < N; i++) {
    const g = Math.max(0, 1 - (i - fs) / (fe - fs))
    b.l[i] *= g
    b.r[i] *= g
  }
  return b
}

const m = writeWav(join(OUT, 'trustcraft-score.wav'), music(), 0.78)
const s = writeWav(join(OUT, 'trustcraft-sfx.wav'), sfx(), 0.62)

console.log(`score : ${(m / 1024 / 1024).toFixed(2)} MB  (${(LEN_F / FPS).toFixed(2)}s, 100 BPM, Am→F→C→G→C)`)
console.log(`sfx   : ${(s / 1024 / 1024).toFixed(2)} MB  (19 cues, frame-locked)`)
