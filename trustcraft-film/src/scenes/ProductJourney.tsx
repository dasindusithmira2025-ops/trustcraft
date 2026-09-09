import { interpolate } from 'remotion'
import { EASE, popAt, ramp, springAt } from '../motion/anim'
import { CUE, FILM } from '../motion/timeline'
import { C, FONT, SHADOW } from '../theme'
import { Icon } from '../product/icons'
import { KASUN, PROS, money } from '../product/data'
import { Btn, Card, Tone } from '../product/ui'
import { Viewport } from '../components/Viewport'
import { ProviderCard } from '../components/ProviderCard'
import { Cursor } from '../components/Cursor'
import { Line } from '../components/Type'

/**
 * ACTS IV, V and VI — 0:12.5 → 0:24.8. Discovery, trust, and action.
 *
 * These three acts share one file because they share one object. The card
 * that appears as a search result in a desktop browser is the same card that
 * reflows into a phone, the same card that lifts out of the phone to be
 * examined, and the same card that becomes a profile and is finally chosen.
 * Nothing is cut away and re-introduced; the camera simply stays with it.
 *
 * Three coordinate systems, blended by two progress values:
 *   D — desktop browser results list, arranged in depth
 *   P — phone list, after the viewport reshapes
 *   H — hero, lifted out of the device at cinematic scale
 */

// ── Layout constants for the three states ────────────────────────────────────
const D = { shellW: 1480, shellH: 800, cy: 545, cardW: 1320, top: 348, step: 176, s: 1 }
const P = { shellW: 430, shellH: 800, cy: 540, cardW: 372, top: 300, step: 138, s: 0.7 }
const H = { left: 370, top: 380, w: 1180, s: 1.22 }
/** Where the chosen card settles once the request is confirmed. */
const K = { left: 690, top: 664, w: 540, s: 0.66 }

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function ProductJourney({ frame }: { frame: number }) {
  // ── The two blends that drive every position in these three acts ──────────
  /** Desktop → phone. The product physically responds. */
  const resp = ramp(frame, CUE.responsive, 42, EASE.inOut)
  /** Phone → hero. The chosen card leaves the device and comes to us. */
  const hero = ramp(frame, CUE.heroFound + 14, 46, EASE.out)

  // ── Act VI phases ─────────────────────────────────────────────────────────
  const profile = ramp(frame, CUE.profileOpen, 30, EASE.out)
  const confirm = springAt(frame, CUE.confirmed, { damping: 16, mass: 0.9, stiffness: 120 })
  /** How far the chosen card has travelled into its confirmed resting place. */
  const settled = ramp(frame, CUE.confirmed - 6, 30, EASE.out)
  /** Act VI collapses into the point Act VII builds outwards from. */
  const collapse = ramp(frame, CUE.pullback - 2, 16, EASE.in)

  // ── Viewport shell ────────────────────────────────────────────────────────
  // Overlaps the tail of "Understood." deliberately: the word travels up as
  // the results rise, so the two exchange the frame instead of cross-fading —
  // and there is never a dead beat between them.
  const shellIn = ramp(frame, FILM.discovery.start, 16, EASE.out)
  const shellW = lerp(D.shellW, P.shellW, resp)
  const shellH = lerp(D.shellH, P.shellH, resp)
  const shellCy = lerp(D.cy, P.cy, resp)
  const shellOpacity = shellIn * (1 - ramp(frame, CUE.heroFound + 4, 24, EASE.inOut))

  // ── Per-card geometry, blended across D → P → H ───────────────────────────
  const cardRect = (i: number) => {
    const dW = D.cardW * (1 - i * 0.07)
    const d = { left: 960 - dW / 2, top: D.top + i * D.step, w: dW, s: D.s }
    const p = {
      left: 960 - P.shellW / 2 + 13 + 16,
      top: P.top + i * P.step,
      w: P.cardW,
      s: P.s,
    }
    const base = {
      left: lerp(d.left, p.left, resp),
      top: lerp(d.top, p.top, resp),
      w: lerp(d.w, p.w, resp),
      s: lerp(d.s, p.s, resp),
    }
    if (i > 0) return base
    // Only the chosen card continues into hero space — and then into the
    // confirmation, where it is the same card, not a copy of it.
    const h = {
      left: lerp(base.left, H.left, hero),
      top: lerp(base.top, H.top, hero),
      w: lerp(base.w, H.w, hero),
      s: lerp(base.s, H.s, hero),
    }
    return {
      left: lerp(h.left, K.left, settled),
      top: lerp(h.top, K.top, settled),
      w: lerp(h.w, K.w, settled),
      s: lerp(h.s, K.s, settled),
    }
  }

  // The supporting results recede, then release the frame entirely.
  const supportFade = (i: number) =>
    (1 - i * 0.24) *
    (1 - ramp(frame, CUE.heroFound + 6, 26, EASE.in)) *
    ramp(frame, CUE.resultsOpen + i * 5, 22, EASE.out)

  const heroCard = cardRect(0)

  // Trust signals live between the hero card and the profile expansion.
  const trust = ramp(frame, CUE.trustStats, 26, EASE.out)
  const trustOut = ramp(frame, CUE.profileOpen - 10, 18, EASE.in)
  const score = Math.round(interpolate(ramp(frame, CUE.trustStats + 4, 30, EASE.out), [0, 1], [0, KASUN.trust]))

  const SIGNALS = [
    { label: 'Trust Score', value: `${score}`, suffix: '/100', icon: 'shield', accent: true },
    { label: 'Rating', value: `${KASUN.rating}`, suffix: ` (${KASUN.reviews})`, icon: 'star' },
    { label: 'Works Completed', value: `${KASUN.jobs}`, suffix: '', icon: 'check' },
    { label: 'Experience', value: `${KASUN.years}`, suffix: ' yrs', icon: 'clock' },
  ]


  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: 1 - collapse,
        // Everything folds into the exact point the categories then radiate
        // from, so Act VI becomes Act VII instead of cross-fading into it.
        transformOrigin: '960px 566px',
        transform: `scale(${1 - collapse * 0.74})`,
      }}
    >
      {/* ── The device ── */}
      {shellOpacity > 0.01 && (
        <div
          style={{
            // Rises in, then recedes as the chosen card comes forward: the two
            // exchange depth rather than one simply fading under the other.
            transform: `translateY(${(1 - shellIn) * 58 + hero * 26}px) scale(${(0.95 + shellIn * 0.05) * (1 - hero * 0.09)})`,
            transformOrigin: '960px 545px',
          }}
        >
          <Viewport resp={resp} opacity={shellOpacity} w={shellW} h={shellH} cx={960} cy={shellCy} />
        </div>
      )}

      {/* Screen title, riding inside the viewport as it reshapes. */}
      {shellOpacity > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: 960 - shellW / 2 + lerp(40, 29, resp),
            top: shellCy - shellH / 2 + lerp(88, 74, resp),
            width: shellW - lerp(80, 58, resp),
            opacity: shellOpacity * (1 - hero),
            fontFamily: FONT,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: lerp(34, 22, resp),
              fontWeight: 700,
              color: C.ink900,
              letterSpacing: '-0.025em',
            }}
          >
            Recommended Professionals
          </p>
          <p
            style={{
              margin: `${lerp(10, 6, resp)}px 0 0`,
              fontSize: lerp(21, 14, resp),
              color: C.ink500,
              lineHeight: 1.45,
            }}
          >
            Based on your request, these professionals may be a good match.
          </p>
        </div>
      )}

      {/* ── The supporting results, arranged in depth ── */}
      {[2, 1].map(i => {
        const r = cardRect(i)
        const o = supportFade(i)
        if (o <= 0.01) return null
        return (
          <div
            key={PROS[i].id}
            style={{
              position: 'absolute',
              left: r.left,
              top: r.top,
              width: r.w,
              opacity: o,
              filter: `blur(${i * 2.1 * (1 - resp * 0.6)}px)`,
            }}
          >
            <ProviderCard pro={PROS[i]} s={r.s} />
          </div>
        )
      })}

      {/* The screen's real footer link — it keeps the phone from bottoming out
          in empty white, because it is what the product actually shows there. */}
      {resp > 0.5 && hero < 0.5 && (
        <div
          style={{
            position: 'absolute',
            left: 960 - P.shellW / 2,
            top: 726,
            width: P.shellW,
            textAlign: 'center',
            fontFamily: FONT,
            fontSize: 15,
            fontWeight: 600,
            color: C.brand600,
            opacity: Math.min(1, (resp - 0.5) * 3) * (1 - hero * 2),
          }}
        >
          Browse all professionals instead
        </div>
      )}

      {/* The line opens beside the reshaped viewport, where the frame would
          otherwise be empty on both sides of a phone. */}
      <div
        style={{
          position: 'absolute',
          left: 150,
          top: 470,
          opacity:
            ramp(frame, CUE.easyLine, 20, EASE.out) *
            (1 - ramp(frame, CUE.heroFound + 8, 16, EASE.in)),
        }}
      >
        <Line frame={frame} at={CUE.easyLine} size={58} weight={600} color={C.ink400}>
          Finding someone
        </Line>
        <div style={{ marginTop: 10 }}>
          <Line frame={frame} at={CUE.easyLine + 7} size={58} weight={600} color={C.ink400}>
            is easy.
          </Line>
        </div>
      </div>

      {/* ── The chosen professional ── */}
      <div
        style={{
          position: 'absolute',
          left: heroCard.left,
          top: heroCard.top,
          width: heroCard.w,
          opacity: ramp(frame, CUE.resultsOpen, 20, EASE.out),
        }}
      >
        <ProviderCard pro={KASUN} s={heroCard.s} recommended highlight={hero} />

        {/* Verified — the badge the product uses, popped as the card lands. */}
        <div
          style={{
            position: 'absolute',
            right: 22 * heroCard.s,
            top: -18 * heroCard.s,
            opacity: popAt(frame, CUE.trustIn - 6) * (1 - ramp(frame, CUE.ctaPress, 14, EASE.in)),
            transform: `scale(${0.8 + popAt(frame, CUE.trustIn - 6) * 0.2})`,
          }}
        >
          <Tone tone="success" style={{ fontSize: 20, padding: '6px 14px', boxShadow: SHADOW.card }}>
            ✓ Verified
          </Tone>
        </div>
      </div>

      {/* ── ACT V — why this one is safe to choose ── */}
      {trust > 0.01 && trustOut < 1 && (
        <>
          <div
            style={{
              position: 'absolute',
              left: H.left,
              top: 596,
              width: H.w,
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 20,
              opacity: trust * (1 - trustOut),
            }}
          >
            {SIGNALS.map((s, i) => {
              const p = ramp(frame, CUE.trustStats + i * 6, 22, EASE.out)
              return (
                <Card
                  key={s.label}
                  style={{
                    padding: '22px 24px',
                    opacity: p,
                    transform: `translateY(${(1 - p) * 26}px)`,
                    background: s.accent ? C.brand50 : C.white,
                    borderColor: s.accent ? C.brand200 : C.ink200,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      color: s.accent ? C.brand600 : C.ink400,
                      fontSize: 17,
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <Icon name={s.icon} size={17} />
                    {s.label}
                  </div>
                  <p
                    style={{
                      margin: '10px 0 0',
                      fontSize: 44,
                      fontWeight: 700,
                      color: s.accent ? C.brand700 : C.ink900,
                      lineHeight: 1,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {s.value}
                    <span style={{ fontSize: 20, color: C.ink400, fontWeight: 500 }}>{s.suffix}</span>
                  </p>
                </Card>
              )
            })}
          </div>

          {/* The second half of TrustCraft's own line — the first half landed
              on the results in Act IV, so the sentence spans the two acts it
              actually describes. */}
          <div
            style={{
              position: 'absolute',
              left: H.left,
              top: 208,
              opacity: 1 - trustOut,
            }}
          >
            <Line frame={frame} at={CUE.trustLine} size={68} weight={700} color={C.white}>
              Trusting them isn’t.
            </Line>
          </div>
        </>
      )}

      {/* ── ACT VI — the profile, and the decision ── */}
      {profile > 0.01 && settled < 0.5 && (
        <div
          style={{
            position: 'absolute',
            left: H.left,
            top: 596,
            width: H.w,
            opacity: profile * (1 - Math.min(1, settled * 2.4)),
            transform: `translateY(${(1 - profile) * 30}px)`,
          }}
        >
          <Card style={{ padding: '30px 34px' }}>
            <p
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 600,
                color: C.ink400,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              Services
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
              {KASUN.services.map((s, i) => {
                const p = ramp(frame, CUE.profileOpen + 8 + i * 4, 18, EASE.out)
                return (
                  <span
                    key={s}
                    style={{
                      fontSize: 22,
                      fontWeight: 500,
                      background: C.ink100,
                      color: C.ink700,
                      borderRadius: 999,
                      padding: '10px 20px',
                      fontFamily: FONT,
                      opacity: p,
                      transform: `translateY(${(1 - p) * 12}px)`,
                    }}
                  >
                    {s}
                  </span>
                )
              })}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginTop: 24,
                fontFamily: FONT,
                fontSize: 22,
                color: C.ink700,
              }}
            >
              <span style={{ color: C.ink400, display: 'flex' }}>
                <Icon name="calendar" size={21} />
              </span>
              {KASUN.availability}
              <span style={{ marginLeft: 'auto', color: C.ink500, fontSize: 21 }}>
                Inspection · LKR {money(KASUN.inspectionFee)}
              </span>
            </div>
          </Card>

          {/* The action bar, exactly as the profile screen presents it. */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              marginTop: 22,
              opacity: ramp(frame, CUE.profileOpen + 18, 18, EASE.out),
            }}
          >
            <Btn variant="secondary" icon="chat" width={300}>
              Message
            </Btn>
            <Btn width={420} press={ramp(frame, CUE.ctaPress, 4, EASE.out) * (1 - ramp(frame, CUE.ctaPress + 6, 6, EASE.out))}>
              Select
            </Btn>
          </div>
        </div>
      )}

      {/* The pointer commits to the choice. */}
      <Cursor
        frame={frame}
        x={[[CUE.profileOpen + 14, 1420], [CUE.ctaPress - 8, 900], [CUE.ctaPress + 14, 900], [CUE.ctaPress + 34, 1180]]}
        y={[[CUE.profileOpen + 14, 980], [CUE.ctaPress - 8, 841], [CUE.ctaPress + 14, 841], [CUE.ctaPress + 34, 1020]]}
        clickAt={[CUE.ctaPress]}
        visible={
          ramp(frame, CUE.profileOpen + 12, 12, EASE.out) *
          (1 - ramp(frame, CUE.ctaPress + 6, 10, EASE.in))
        }
      />

      {/* ── Confirmation — the product's real success state ── */}
      {confirm > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 372,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: Math.min(1, confirm * 1.6),
          }}
        >
          <div
            style={{
              width: 128,
              height: 128,
              borderRadius: 999,
              background: C.success100,
              color: C.success600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${0.6 + confirm * 0.4})`,
              boxShadow: `0 30px 80px -20px rgba(22,163,74,${0.5 * confirm})`,
            }}
          >
            <Icon name="check" size={62} strokeWidth={2.6} />
          </div>

          <div style={{ marginTop: 34 }}>
            <Line frame={frame} at={CUE.confirmed + 4} size={72} weight={700} align="center">
              Professional Selected
            </Line>
          </div>

        </div>
      )}
    </div>
  )
}
