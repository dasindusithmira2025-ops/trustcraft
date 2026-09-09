import { interpolate } from 'remotion'
import { C, FONT } from '../theme'

/**
 * The product's own frame — one shell that physically reshapes from a desktop
 * browser into a phone.
 *
 * `resp` 0→1 drives everything: the window narrows, the chrome bar collapses,
 * the bezel thickens and a notch appears. There is no cut, and there is never
 * a laptop mockup sitting next to a phone mockup: it is the same object,
 * responding.
 */
export function Viewport({
  resp, opacity, w, h, cx, cy,
}: {
  resp: number
  opacity: number
  w: number
  h: number
  cx: number
  cy: number
}) {
  const radius = interpolate(resp, [0, 1], [18, 46])
  const bezel = interpolate(resp, [0, 1], [1, 13])
  const chromeH = Math.max(0, interpolate(resp, [0, 0.55], [46, 0], { extrapolateRight: 'clamp' }))

  return (
    <div
      style={{
        position: 'absolute',
        left: cx - w / 2,
        top: cy - h / 2,
        width: w,
        height: h,
        borderRadius: radius,
        background: interpolate(resp, [0, 1], [0, 1]) > 0.4 ? C.ink950 : '#0B1220',
        padding: bezel,
        boxSizing: 'border-box',
        boxShadow: `0 ${40 + resp * 20}px ${120}px -30px rgba(2,6,23,.92), 0 0 0 1px rgba(148,163,184,${0.10 + resp * 0.08})`,
        opacity,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: radius - bezel,
          background: C.white,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Browser chrome — collapses as the viewport narrows. */}
        {chromeH > 0.5 && (
          <div
            style={{
              height: chromeH,
              background: C.ink50,
              borderBottom: `1px solid ${C.ink200}`,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              paddingLeft: 18,
              overflow: 'hidden',
              opacity: chromeH / 46,
            }}
          >
            {['#F87171', '#FBBF24', '#34D399'].map(c => (
              <span key={c} style={{ width: 11, height: 11, borderRadius: 999, background: c, flexShrink: 0 }} />
            ))}
            <div
              style={{
                marginLeft: 16,
                height: 26,
                flex: 1,
                maxWidth: 340,
                borderRadius: 999,
                background: C.white,
                border: `1px solid ${C.ink200}`,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 14,
                fontFamily: FONT,
                fontSize: 14,
                color: C.ink500,
                whiteSpace: 'nowrap',
              }}
            >
              trustcraft.lk
            </div>
          </div>
        )}

        {/* Phone notch — materialises as the browser chrome disappears. */}
        {resp > 0.45 && (
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 118,
              height: 26,
              borderRadius: 999,
              background: C.ink950,
              opacity: interpolate(resp, [0.45, 0.85], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          />
        )}
      </div>
    </div>
  )
}
