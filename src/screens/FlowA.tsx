import { useState, useEffect } from 'react'
import { NavProps } from '../types'
import { BackButton, StatusBar } from '../components/Shared'

// ── Home ───────────────────────────────────────────────────────────────────

export function HomeScreen({ navigate }: NavProps) {
  return (
    <div className="flex flex-col h-full bg-ink-50 px-6">
      {/* Top header */}
      <div className="flex items-center justify-between pt-5 pb-5">
        <div>
          <p className="text-[13px] text-ink-400 font-medium">Good afternoon,</p>
          <p className="text-[17px] font-semibold text-ink-900">Nadeesha</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center text-ink-500">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <path d="M9 2C6.8 2 5 3.8 5 6V10L3 12H15L13 10V6C13 3.8 11.2 2 9 2Z"/>
              <path d="M7 14C7 15.1 7.9 16 9 16S11 15.1 11 14"/>
            </svg>
          </button>
          <button className="w-9 h-9 rounded-full bg-teal-800 flex items-center justify-center text-white text-[14px] font-semibold font-display">
            N
          </button>
        </div>
      </div>

      {/* Hero question */}
      <div className="mb-7">
        <h1 className="font-display text-[42px] leading-[1.05] text-ink-900 mb-3">
          What<br />happened?
        </h1>
        <p className="text-[15px] text-ink-500 leading-relaxed">
          Show it, describe it, or just talk — we will figure out the rest.
        </p>
      </div>

      {/* Input method trio */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <button
          onClick={() => navigate('camera')}
          className="flex flex-col items-center gap-2.5 bg-white rounded-2xl py-5 border border-ink-200 hover:border-teal-600 hover:bg-teal-50 transition-all group"
        >
          <div className="w-11 h-11 bg-ink-100 group-hover:bg-teal-100 rounded-xl flex items-center justify-center transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#0B6B6B" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 7H4.5L6.5 4H13.5L15.5 7H18C18.6 7 19 7.4 19 8V16C19 16.6 18.6 17 18 17H2C1.4 17 1 16.6 1 16V8C1 7.4 1.4 7 2 7Z"/>
              <circle cx="10" cy="12" r="3"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-[11px] font-data text-teal-800 tracking-widest font-medium">SHOW IT</p>
            <p className="text-[11px] text-ink-400 mt-0.5">Camera</p>
          </div>
        </button>

        <button
          onClick={() => navigate('voice')}
          className="flex flex-col items-center gap-2.5 bg-teal-800 rounded-2xl py-5 hover:bg-teal-900 transition-colors group"
        >
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="7" y="1" width="6" height="10" rx="3"/>
              <path d="M4 10C4 13.3 6.7 16 10 16S16 13.3 16 10"/>
              <line x1="10" y1="16" x2="10" y2="19"/>
              <line x1="7" y1="19" x2="13" y2="19"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-[11px] font-data text-white tracking-widest font-medium">TELL US</p>
            <p className="text-[11px] text-white/50 mt-0.5">Voice</p>
          </div>
        </button>

        <button
          onClick={() => navigate('ai-analysis')}
          className="flex flex-col items-center gap-2.5 bg-white rounded-2xl py-5 border border-ink-200 hover:border-teal-600 hover:bg-teal-50 transition-all group"
        >
          <div className="w-11 h-11 bg-ink-100 group-hover:bg-teal-100 rounded-xl flex items-center justify-center transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#0B6B6B" strokeWidth="1.7" strokeLinecap="round">
              <line x1="3" y1="6" x2="17" y2="6"/>
              <line x1="3" y1="10" x2="13" y2="10"/>
              <line x1="3" y1="14" x2="10" y2="14"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-[11px] font-data text-teal-800 tracking-widest font-medium">DESCRIBE</p>
            <p className="text-[11px] text-ink-400 mt-0.5">Text</p>
          </div>
        </button>
      </div>

      {/* Browse services — secondary */}
      <div className="flex items-center justify-center mb-7">
        <button className="flex items-center gap-1.5 text-[13px] text-ink-400 hover:text-ink-700 transition-colors">
          Browse all services
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M2.5 6.5H10.5M8 4L10.5 6.5L8 9"/>
          </svg>
        </button>
      </div>

      <div className="h-px bg-ink-200 mb-6" />

      {/* Active job */}
      <button
        onClick={() => navigate('active-job')}
        className="bg-white rounded-2xl border border-ink-200 p-4 mb-4 text-left hover:border-teal-600 transition-colors"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[11px] font-data text-teal-800 tracking-wider font-medium mb-1">ACTIVE JOB</p>
            <p className="text-[15px] font-semibold text-ink-900">Kitchen Sink Repair</p>
            <p className="text-[13px] text-ink-500 mt-0.5">Chamod Fernando · Repair in progress</p>
          </div>
          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mt-0.5">
            <div className="w-3 h-3 rounded-full bg-teal-700 soft-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex-1 h-1.5 bg-ink-100 rounded-full overflow-hidden">
            <div className="h-full bg-teal-700 rounded-full" style={{ width: '62%' }} />
          </div>
          <span className="text-[12px] text-ink-400 font-data">5 / 8</span>
        </div>
      </button>

      {/* My Home mini */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-data text-ink-400 tracking-wider font-medium">MY HOME</p>
          <button onClick={() => navigate('my-home')} className="text-[13px] text-teal-800 font-medium">
            View all
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { room: 'Kitchen', service: 'Sink connector replaced', date: 'Aug 2026' },
            { room: 'Bedroom AC', service: 'Serviced', date: 'Jul 2026' },
          ].map(({ room, service, date }) => (
            <div key={room} className="bg-white rounded-xl border border-ink-200 p-3">
              <p className="text-[11px] text-ink-400 mb-0.5">{room}</p>
              <p className="text-[13px] font-medium text-ink-900 leading-snug">{service}</p>
              <p className="text-[11px] text-ink-400 mt-1.5">{date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Camera ─────────────────────────────────────────────────────────────────

export function CameraScreen({ navigate, goBack }: NavProps) {
  return (
    <div className="h-full bg-black relative">
      <StatusBar light />
      <img
        src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=390&h=844&fit=crop&auto=format"
        alt="Camera viewfinder"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      {/* Corner guide */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-60 h-60">
          {['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r',
            'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map((cls, i) => (
            <div key={i} className={`absolute w-9 h-9 ${cls} border-white/80 border-2`} />
          ))}
        </div>
      </div>
      {/* Top bar */}
      <div className="absolute top-12 left-0 right-0 flex items-center justify-between px-5">
        <button onClick={goBack} className="w-11 h-11 rounded-full bg-black/50 flex items-center justify-center text-white">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M11 14L6 9L11 4"/>
          </svg>
        </button>
        <p className="text-white text-[14px] font-medium bg-black/40 rounded-full px-4 py-1.5">Frame the problem area</p>
        <button className="w-11 h-11 rounded-full bg-black/50 flex items-center justify-center text-white">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round">
            <path d="M9 3V6M9 12V15M3 9H6M12 9H15"/>
          </svg>
        </button>
      </div>
      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 pb-10 pt-6 bg-gradient-to-t from-black/80">
        <div className="flex items-center justify-center gap-10">
          <button className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white/40">
            <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=56&h=56&fit=crop" alt="Gallery" className="w-full h-full object-cover" />
          </button>
          <button onClick={() => navigate('ai-analysis')} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white" />
          </button>
          <button className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round">
              <path d="M4 10C4 6.7 6.7 4 10 4C12.2 4 14.1 5.1 15.3 6.8"/>
              <path d="M16 10C16 13.3 13.3 16 10 16C7.8 16 5.9 14.9 4.7 13.2"/>
              <path d="M13.5 5.5L16 7.5L13.5 9.5"/>
              <path d="M6.5 14.5L4 12.5L6.5 10.5"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Voice input ─────────────────────────────────────────────────────────────

export function VoiceScreen({ navigate, goBack }: NavProps) {
  const [seconds, setSeconds] = useState(7)
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="h-full bg-ink-50 flex flex-col">
      <div className="flex items-center px-4 pt-4 pb-1">
        <BackButton onPress={goBack} />
        <p className="text-[15px] font-semibold text-ink-900 mx-auto pr-10">Voice Input</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="w-3.5 h-3.5 rounded-full bg-danger-700 mb-8 soft-pulse" />
        <h2 className="font-display text-[32px] text-ink-900 mb-2">Listening...</h2>
        <p className="text-[15px] text-ink-400 mb-12">Describe what happened in your own words</p>
        {/* Waveform */}
        <div className="flex items-center justify-center gap-2 mb-12 h-14">
          {['wave-bar-1','wave-bar-2','wave-bar-3','wave-bar-4','wave-bar-5','wave-bar-6','wave-bar-7','wave-bar-8','wave-bar-9'].map((cls, i) => (
            <div key={i} className={`w-1.5 rounded-full bg-teal-800 ${cls}`} style={{ minHeight: 4 }} />
          ))}
        </div>
        <p className="font-data text-[36px] text-ink-700 mb-14">
          0:{seconds.toString().padStart(2, '0')}
        </p>
        <div className="bg-white rounded-2xl border border-ink-200 px-5 py-4 w-full text-left">
          <p className="text-[12px] text-ink-400 mb-1.5 font-data">TRANSCRIBING</p>
          <p className="text-[15px] text-ink-700 leading-relaxed">
            "There is water leaking from under my kitchen sink. It started this morning and it is—"
          </p>
        </div>
      </div>
      <div className="px-6 pb-10 pt-4">
        <button
          onClick={() => navigate('ai-analysis')}
          className="w-full h-14 bg-ink-900 text-white rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-3 hover:bg-ink-800 transition-colors"
        >
          <div className="w-4 h-4 rounded-sm bg-white" />
          Stop & Analyse
        </button>
      </div>
    </div>
  )
}

// ── AI Analysis ─────────────────────────────────────────────────────────────

export function AIAnalysisScreen({ navigate }: NavProps) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 700),
      setTimeout(() => setStep(2), 1600),
      setTimeout(() => setStep(3), 2400),
    ]
    const nav = setTimeout(() => navigate('problem-canvas'), 3200)
    return () => { timers.forEach(clearTimeout); clearTimeout(nav) }
  }, [navigate])

  const steps = [
    'Identifying problem type...',
    'Analysing visual evidence...',
    'Assessing urgency level...',
  ]
  return (
    <div className="h-full bg-ink-900 flex flex-col items-center justify-center px-8">
      <div className="relative mb-12">
        <div className="w-[200px] h-[150px] rounded-2xl overflow-hidden border border-white/10">
          <img
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=150&fit=crop&auto=format"
            alt="Uploaded problem photo"
            className="w-full h-full object-cover opacity-75"
          />
        </div>
        {/* Scan overlay */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent scan-line opacity-80" />
        </div>
        {/* Corners */}
        {['top-2 left-2 border-t-2 border-l-2', 'top-2 right-2 border-t-2 border-r-2',
          'bottom-2 left-2 border-b-2 border-l-2', 'bottom-2 right-2 border-b-2 border-r-2'].map((cls, i) => (
          <div key={i} className={`absolute w-4 h-4 ${cls} border-teal-400`} />
        ))}
      </div>
      <h2 className="font-display text-[26px] text-white mb-2 text-center">Understanding<br />your problem</h2>
      <p className="text-[14px] text-white/40 mb-10 text-center font-data">AI-assisted · a moment</p>
      <div className="w-full max-w-xs space-y-4">
        {steps.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${i < step ? 'opacity-100' : 'opacity-20'}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${i < step ? 'bg-teal-700' : 'bg-white/10'}`}>
              {i < step
                ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M2 5L4 7L8 3"/></svg>
                : <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              }
            </div>
            <span className="text-[14px] text-white/80">{s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Problem Canvas ★ ────────────────────────────────────────────────────────

export function ProblemCanvasScreen({ navigate, goBack }: NavProps) {
  return (
    <div className="h-full flex flex-col bg-black">
      {/* Photo — upper 50% */}
      <div className="relative flex-shrink-0" style={{ height: '50%' }}>
        <img
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=390&h=422&fit=crop&auto=format"
          alt="Kitchen sink with water leak visible"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
        <div className="absolute top-3 left-3 z-10">
          <BackButton onPress={goBack} light />
        </div>
        {/* AI confidence — top right */}
        <div className="absolute top-4 right-4 fade-in">
          <div className="bg-black/70 backdrop-blur-sm rounded-2xl px-3.5 py-2.5 border border-white/10">
            <p className="text-[10px] text-white/50 font-data tracking-widest mb-1">AI CONFIDENCE</p>
            <div className="flex items-center gap-2.5">
              <div className="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-teal-400 rounded-full progress-fill" style={{ width: '87%' }} />
              </div>
              <span className="font-data text-[15px] text-white font-medium">87%</span>
            </div>
          </div>
        </div>
        {/* Leak annotation */}
        <div className="absolute bottom-6 left-5 fade-up-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-warning-700 rounded-full flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M7 3V7M7 10V10.5"/><circle cx="7" cy="7" r="6"/>
              </svg>
            </div>
            <span className="text-white text-[13px] font-medium bg-black/50 rounded-full px-3 py-1">Leak area detected</span>
          </div>
        </div>
      </div>

      {/* Analysis panel — bottom 50% */}
      <div className="flex-1 bg-ink-50 rounded-t-3xl -mt-5 overflow-y-auto no-scroll">
        <div className="px-6 pt-5 pb-8">
          <div className="w-10 h-1 bg-ink-300 rounded-full mx-auto mb-5" />

          <p className="text-[11px] font-data text-teal-800 tracking-widest font-medium mb-2">WHAT WE FOUND</p>
          <h2 className="font-display text-[28px] text-ink-900 leading-tight mb-5">
            Possible leak near<br />sink connection
          </h2>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 mb-5 fade-up-1">
            <div className="bg-white rounded-xl border border-ink-200 p-3.5">
              <p className="text-[10px] text-ink-400 font-data tracking-widest mb-2">SERVICE</p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-teal-100 rounded-lg flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#0B6B6B" strokeWidth="1.7" strokeLinecap="round">
                    <path d="M3 9V12H11V9M7 1V9M5 4L7 1L9 4"/>
                  </svg>
                </div>
                <span className="text-[14px] font-semibold text-ink-900">Plumbing</span>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-ink-200 p-3.5">
              <p className="text-[10px] text-ink-400 font-data tracking-widest mb-2">URGENCY</p>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-2 h-2 rounded-full bg-warning-700" />
                <span className="text-[14px] font-semibold text-ink-900">Moderate</span>
              </div>
              <p className="text-[11px] text-ink-400">Monitor closely</p>
            </div>
          </div>

          {/* Safety note */}
          <div className="border-l-4 border-warning-700 bg-warning-100 rounded-r-xl pl-4 pr-4 py-3.5 mb-4 fade-up-2">
            <p className="text-[12px] font-semibold text-warning-700 mb-0.5">Safety guidance</p>
            <p className="text-[13px] text-ink-700 leading-relaxed">Turn off the local water valve beneath the sink if safely accessible.</p>
          </div>

          {/* Professional disclaimer */}
          <div className="bg-teal-50 rounded-xl border border-teal-200 px-4 py-3.5 mb-6 fade-up-3">
            <p className="text-[12px] font-semibold text-teal-800 flex items-center gap-1.5 mb-0.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="6" cy="6" r="5"/><path d="M6 4V6.5"/><circle cx="6" cy="8.5" r="0.5" fill="currentColor"/>
              </svg>
              Professional assessment required
            </p>
            <p className="text-[12px] text-ink-600 leading-relaxed">This analysis is AI-guided only. A qualified plumber must diagnose and repair the issue.</p>
          </div>

          <button
            onClick={() => navigate('clarification')}
            className="w-full h-14 bg-teal-800 text-white rounded-2xl font-semibold text-[15px] hover:bg-teal-900 transition-colors flex items-center justify-center gap-2"
          >
            Continue
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M3.5 9H14.5M11 5.5L14.5 9L11 12.5"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Clarification ───────────────────────────────────────────────────────────

export function ClarificationScreen({ navigate, goBack }: NavProps) {
  const [answer, setAnswer] = useState<string | null>(null)
  return (
    <div className="h-full bg-ink-50 flex flex-col">
      <div className="flex items-center px-4 pt-4">
        <BackButton onPress={goBack} />
      </div>
      <div className="flex-1 px-6 pt-6">
        {/* Context pill */}
        <div className="flex items-center gap-3 mb-9">
          <div className="w-12 h-10 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=48&h=40&fit=crop"
              alt="Problem"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-[12px] text-ink-400">Plumbing · Moderate urgency</p>
            <p className="text-[14px] font-semibold text-ink-900">Possible sink connection leak</p>
          </div>
        </div>
        <p className="text-[11px] font-data text-teal-800 tracking-widest mb-4">ONE QUICK QUESTION</p>
        <h2 className="font-display text-[30px] text-ink-900 leading-tight mb-10">
          Does the leak continue when the tap is fully closed?
        </h2>
        <div className="space-y-3">
          {['Yes', 'No', 'Not sure'].map(opt => (
            <button
              key={opt}
              onClick={() => setAnswer(opt)}
              className={`w-full h-14 rounded-2xl border text-[15px] font-medium transition-all px-5 flex items-center gap-4
                ${answer === opt
                  ? 'bg-teal-800 border-teal-800 text-white'
                  : 'bg-white border-ink-200 text-ink-700 hover:border-teal-600'}`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${answer === opt ? 'border-white bg-white/20' : 'border-ink-300'}`}>
                {answer === opt && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              {opt}
            </button>
          ))}
        </div>
      </div>
      <div className="px-6 pb-10 pt-6">
        <button
          onClick={() => navigate('structured-request')}
          disabled={!answer}
          className={`w-full h-14 rounded-2xl font-semibold text-[15px] transition-colors ${answer ? 'bg-teal-800 text-white hover:bg-teal-900' : 'bg-ink-200 text-ink-400 cursor-not-allowed'}`}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

// ── Structured Request ──────────────────────────────────────────────────────

export function StructuredRequestScreen({ navigate, goBack }: NavProps) {
  return (
    <div className="h-full bg-ink-50 flex flex-col">
      <div className="flex items-center px-4 pt-4 pb-1">
        <BackButton onPress={goBack} />
        <p className="text-[15px] font-semibold text-ink-900 mx-auto pr-10">Your Request</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scroll px-6 pt-5 pb-6">
        <p className="font-display text-[28px] text-ink-900 leading-tight mb-1.5">
          Ready to match.
        </p>
        <p className="text-[14px] text-ink-500 mb-6">
          Here is what we will share with local professionals.
        </p>

        {/* Summary card */}
        <div className="bg-white rounded-2xl border border-ink-200 overflow-hidden mb-5 fade-up">
          <div className="bg-teal-800 px-5 py-4">
            <p className="text-[10px] font-data text-teal-200 tracking-widest mb-1">SERVICE REQUEST</p>
            <p className="text-white text-[17px] font-semibold">Possible sink connection leak</p>
          </div>
          <div className="divide-y divide-ink-100">
            {[
              { label: 'Service type', value: 'Plumbing' },
              { label: 'Urgency', value: 'Moderate' },
              { label: 'Location', value: 'Colombo 05' },
              { label: 'Evidence', value: '1 photo · leak when tap off' },
              { label: 'Availability', value: '4:30 PM – 7:00 PM today' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-[13px] text-ink-400">{label}</span>
                <span className="text-[13px] font-medium text-ink-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Match preview */}
        <div className="bg-teal-50 rounded-2xl border border-teal-200 px-5 py-4 mb-5 fade-up-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-800 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="7" cy="7" r="4.5"/>
                <path d="M13 13L10.5 10.5"/>
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-semibold text-teal-900">3 professionals matched</p>
              <p className="text-[13px] text-teal-700">Based on your location and service</p>
            </div>
          </div>
        </div>

        <p className="text-[12px] text-ink-400 text-center leading-relaxed px-3">
          No personal details are shared until you choose to book.
        </p>
      </div>
      <div className="px-6 pb-10 pt-3">
        <button
          onClick={() => navigate('top-matches')}
          className="w-full h-14 bg-teal-800 text-white rounded-2xl font-semibold text-[15px] hover:bg-teal-900 transition-colors"
        >
          See Top Matches
        </button>
      </div>
    </div>
  )
}
