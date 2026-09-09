import { C, FONT, SHADOW } from '../theme'
import { Icon } from '../product/icons'
import { Avatar, MatchBar, Tone } from '../product/ui'
import { money, type Pro } from '../product/data'

/**
 * A professional, as the Recommendations screen presents them: avatar, name,
 * trade, the signals that matter, and how well they match the request.
 *
 * `s` is the responsive type scale (1 = desktop, ~0.6 = phone). The meta row
 * uses real flex wrapping, so narrowing the parent genuinely reflows the card
 * the way the product does — it is not a scaled-down screenshot.
 */
export function ProviderCard({
  pro, s = 1, recommended, highlight = 0,
}: {
  pro: Pro
  s?: number
  recommended?: boolean
  /** 0→1 lifts this card out of the list as the chosen one. */
  highlight?: number
}) {
  const meta = (children: React.ReactNode, key: string) => (
    <span
      key={key}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5 * s,
        fontSize: 19 * s,
        color: C.ink500,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )

  return (
    <div
      style={{
        background: C.white,
        border: `${Math.max(1, 1.5 * s)}px solid ${highlight > 0.2 ? C.brand500 : recommended ? C.brand200 : C.ink200}`,
        borderRadius: 20 * s,
        padding: `${22 * s}px ${24 * s}px`,
        boxShadow: highlight > 0.2 ? SHADOW.lift : SHADOW.card,
        fontFamily: FONT,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 * s }}>
        <Avatar name={pro.name} hue={pro.hue} size={62 * s} badge />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 * s, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 27 * s,
                  fontWeight: 600,
                  color: C.ink900,
                  letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap',
                }}
              >
                {pro.name}
              </p>
              <p style={{ margin: `${3 * s}px 0 0`, fontSize: 20 * s, color: C.ink500 }}>{pro.trade}</p>
            </div>
            {recommended && (
              <Tone tone="success" style={{ fontSize: 16 * s, padding: `${3 * s}px ${10 * s}px` }}>
                Recommended
              </Tone>
            )}
          </div>

          {/* Signals. Wraps naturally as the viewport narrows. */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14 * s,
              flexWrap: 'wrap',
              marginTop: 9 * s,
            }}
          >
            {meta(
              <>
                <span style={{ color: C.gold, display: 'flex' }}>
                  <Icon name="star" size={17 * s} fill strokeWidth={1.4} />
                </span>
                <span style={{ color: C.ink700, fontWeight: 500 }}>{pro.rating}</span>
                <span>({pro.reviews})</span>
              </>,
              'rating',
            )}
            {meta(<>{pro.distanceKm} km</>, 'dist')}
            {meta(<>{pro.years} yrs</>, 'yrs')}
            {meta(<>Inspection · LKR {money(pro.inspectionFee)}</>, 'fee')}
          </div>
        </div>

        {/* Match strength. */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: 34 * s,
              fontWeight: 700,
              color: C.brand600,
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
          >
            {pro.match}%
          </p>
          <p style={{ margin: `${4 * s}px 0 0`, fontSize: 16 * s, color: C.ink400, fontWeight: 500 }}>
            Match
          </p>
        </div>
      </div>

      <div style={{ marginTop: 16 * s }}>
        <MatchBar pct={pro.match} />
      </div>
    </div>
  )
}
