import { continueRender, delayRender, staticFile } from 'remotion'

/**
 * Inter, loaded from disk. The product uses Inter via Google Fonts; the film
 * ships the same faces locally so a render never touches the network and two
 * renders can never differ because a webfont arrived late.
 */
const FACES: [string, number][] = [
  ['Inter-Regular.ttf', 400],
  ['Inter-Medium.ttf', 500],
  ['Inter-SemiBold.ttf', 600],
  ['Inter-Bold.ttf', 700],
  ['Inter-ExtraBold.ttf', 800],
]

const handle = delayRender('Loading Inter')

Promise.all(
  FACES.map(([file, weight]) => {
    const face = new FontFace('Inter', `url(${staticFile(`fonts/${file}`)}) format('truetype')`, {
      weight: String(weight),
      style: 'normal',
    })
    return face.load().then(loaded => {
      document.fonts.add(loaded)
    })
  }),
)
  .then(() => continueRender(handle))
  .catch(err => {
    // Never hang a render on a font: fail loudly in the log, continue in system-ui.
    console.error('Inter failed to load', err)
    continueRender(handle)
  })

export {}
