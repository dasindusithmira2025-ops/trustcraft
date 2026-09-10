/**
 * Capture helpers for the three independent attachment types.
 *
 * Photo and video use a real file input (which is also the camera on a phone).
 * Voice uses MediaRecorder — it never touches the image picker, which was the
 * original bug.  Where the runtime blocks the microphone the recorder degrades
 * to a clearly-labelled simulated note instead of leaving the UI stuck.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Attachment } from './case'

const id = () => `a-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

/** Opens the OS picker/camera for one kind of media only. */
export function pickMedia(kind: 'photo' | 'video'): Promise<Attachment | null> {
  return new Promise(resolve => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = kind === 'photo' ? 'image/*' : 'video/*'
    // Hints at the rear camera on mobile; desktop browsers ignore it.
    input.setAttribute('capture', 'environment')
    input.style.display = 'none'
    let settled = false
    const done = (a: Attachment | null) => {
      if (settled) return
      settled = true
      input.remove()
      resolve(a)
    }
    input.onchange = () => {
      const f = input.files?.[0]
      done(f ? { id: id(), kind, name: f.name, url: URL.createObjectURL(f) } : null)
    }
    // Cancelling a file dialog fires no event in most browsers; the window
    // regaining focus is the only reliable signal.
    window.addEventListener('focus', () => setTimeout(() => done(null), 400), { once: true })
    document.body.appendChild(input)
    input.click()
  })
}

export type RecorderState = 'idle' | 'requesting' | 'recording' | 'ready' | 'error'

export function useVoiceRecorder() {
  const [state, setState] = useState<RecorderState>('idle')
  const [seconds, setSeconds] = useState(0)
  const [error, setError] = useState('')
  const [take, setTake] = useState<Attachment | null>(null)

  const rec = useRef<MediaRecorder | null>(null)
  /** Set when the user stops before the permission prompt is answered. */
  const aborted = useRef(false)
  const chunks = useRef<Blob[]>([])
  const tick = useRef<ReturnType<typeof setInterval>>(undefined)
  const elapsed = useRef(0)

  const stopTimer = () => { clearInterval(tick.current); tick.current = undefined }

  useEffect(() => () => {
    stopTimer()
    rec.current?.stream.getTracks().forEach(t => t.stop())
  }, [])

  const start = useCallback(async () => {
    aborted.current = false
    setError('')
    setTake(null)
    setSeconds(0)
    elapsed.current = 0

    const supported =
      typeof MediaRecorder !== 'undefined' && !!navigator.mediaDevices?.getUserMedia

    const runTimer = () => {
      stopTimer()
      tick.current = setInterval(() => {
        elapsed.current += 1
        setSeconds(elapsed.current)
      }, 1000)
    }

    if (!supported) {
      // Prototype fallback: the flow still records a voice note, honestly labelled.
      setState('recording')
      setError('Microphone not available here — recording a placeholder note.')
      runTimer()
      return
    }

    setState('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (aborted.current) {
        stream.getTracks().forEach(t => t.stop())
        return
      }
      const mr = new MediaRecorder(stream)
      chunks.current = []
      mr.ondataavailable = e => { if (e.data.size) chunks.current.push(e.data) }
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunks.current, { type: mr.mimeType || 'audio/webm' })
        setTake({
          id: id(), kind: 'voice', name: 'Voice note',
          url: blob.size ? URL.createObjectURL(blob) : undefined,
          duration: mmss(elapsed.current),
        })
        setState('ready')
      }
      rec.current = mr
      mr.start()
      setState('recording')
      runTimer()
    } catch {
      // Denied or no device: keep the workflow usable rather than dead-ending.
      setState('recording')
      setError('Microphone blocked — recording a placeholder note instead.')
      runTimer()
    }
  }, [])

  const stop = useCallback(() => {
    stopTimer()
    aborted.current = true
    const mr = rec.current
    if (mr && mr.state !== 'inactive') {
      mr.stop()
      rec.current = null
      return
    }
    setTake({
      id: id(), kind: 'voice', name: 'Voice note (simulated)',
      duration: mmss(Math.max(1, elapsed.current)),
    })
    setError(e => e || 'Saved as a placeholder note — no microphone audio was captured.')
    setState('ready')
  }, [])

  const discard = useCallback(() => {
    if (take?.url) URL.revokeObjectURL(take.url)
    setTake(null)
    setSeconds(0)
    elapsed.current = 0
    setState('idle')
    setError('')
  }, [take])

  return { state, seconds, error, take, start, stop, discard }
}
