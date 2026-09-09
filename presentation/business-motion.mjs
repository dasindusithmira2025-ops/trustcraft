// Native PresentationML fade builds. No COM, macros, or runtime dependencies.
// https://learn.microsoft.com/en-us/office/open-xml/presentation/working-with-animation
export function businessTiming(xml) {
  const groups = new Map(['01', '02', '03'].map(k => [k, []]))
  for (const m of xml.matchAll(/<p:cNvPr\b[^>]*id="(\d+)"[^>]*name="reveal-(\d+)-\d+"/g)) {
    groups.get(m[2])?.push(m[1])
  }
  if ([...groups.values()].some(ids => !ids.length)) throw new Error('Missing business slide animation targets')
  let id = 2
  const next = () => ++id
  const atZero = '<p:stCondLst><p:cond delay="0"/></p:stCondLst>'
  const sequences = [...groups.values()].map(ids => {
    const outer = next(), inner = next()
    const effects = ids.map((shapeId, index) => {
      const effectId = next(), setId = next(), fadeId = next()
      const target = `<p:tgtEl><p:spTgt spid="${shapeId}"/></p:tgtEl>`
      return `<p:par><p:cTn id="${effectId}" presetID="10" presetClass="entr" presetSubtype="0" fill="hold" nodeType="${index ? 'withEffect' : 'clickEffect'}">${atZero}<p:childTnLst>` +
        `<p:set><p:cBhvr><p:cTn id="${setId}" dur="1" fill="hold">${atZero}</p:cTn>${target}<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set>` +
        `<p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="${fadeId}" dur="450"/>${target}</p:cBhvr></p:animEffect>` +
        '</p:childTnLst></p:cTn></p:par>'
    }).join('')
    return `<p:par><p:cTn id="${outer}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst><p:childTnLst><p:par><p:cTn id="${inner}" fill="hold">${atZero}<p:childTnLst>${effects}</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>`
  }).join('')
  return '<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>' +
    `<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>${sequences}</p:childTnLst></p:cTn>` +
    '<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>' +
    '<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst>' +
    '</p:seq></p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>'
}
