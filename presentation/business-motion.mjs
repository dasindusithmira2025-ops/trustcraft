// Native PresentationML fade builds. No COM, macros, or runtime dependencies.
// https://learn.microsoft.com/en-us/office/open-xml/presentation/working-with-animation
//
// One click per `reveal-<beat>-<n>` group, in beat order. Inside a beat the
// shapes stagger 60 ms apart so a panel assembles instead of blinking on.
const STAGGER = 60

export function businessTiming(xml) {
  const groups = new Map()
  for (const m of xml.matchAll(/<p:cNvPr\b[^>]*id="(\d+)"[^>]*name="reveal-([^"-]+)-\d+"/g)) {
    if (!groups.has(m[2])) groups.set(m[2], [])
    groups.get(m[2]).push(m[1])
  }
  if (!groups.size) throw new Error('Missing business slide animation targets')
  let id = 2
  const next = () => ++id
  const at = d => `<p:stCondLst><p:cond delay="${d}"/></p:stCondLst>`
  const sequences = [...groups.keys()].sort().map(key => {
    const ids = groups.get(key)
    const outer = next(), inner = next()
    const effects = ids.map((shapeId, index) => {
      const effectId = next(), setId = next(), fadeId = next()
      const target = `<p:tgtEl><p:spTgt spid="${shapeId}"/></p:tgtEl>`
      const delay = index * STAGGER
      return `<p:par><p:cTn id="${effectId}" presetID="10" presetClass="entr" presetSubtype="0" fill="hold" nodeType="${index ? 'withEffect' : 'clickEffect'}">${at(delay)}<p:childTnLst>` +
        `<p:set><p:cBhvr><p:cTn id="${setId}" dur="1" fill="hold">${at(0)}</p:cTn>${target}<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set>` +
        `<p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="${fadeId}" dur="400"/>${target}</p:cBhvr></p:animEffect>` +
        '</p:childTnLst></p:cTn></p:par>'
    }).join('')
    return `<p:par><p:cTn id="${outer}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst><p:childTnLst><p:par><p:cTn id="${inner}" fill="hold">${at(0)}<p:childTnLst>${effects}</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>`
  }).join('')
  return '<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>' +
    `<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>${sequences}</p:childTnLst></p:cTn>` +
    '<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>' +
    '<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst>' +
    '</p:seq></p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>'
}
