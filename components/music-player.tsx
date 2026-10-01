'use client'

import { Pause, Play } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  name?: string
}

function clock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const whole = Math.floor(seconds)
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`
}

export default function MusicPlayer({ src, name }: Props) {
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState(false)

  useEffect(() => {
    const element = audio.current
    if (!element) return

    const updateTime = () => setTime(element.currentTime)
    const updateDuration = () => setDuration(Number.isFinite(element.duration) ? element.duration : 0)
    const onPlay = () => {
      setPlaying(true)
      setError(false)
    }
    const onPause = () => setPlaying(false)
    const onEnded = () => setPlaying(false)
    const onError = () => setError(true)

    if (element.readyState >= HTMLMediaElement.HAVE_METADATA) {
      updateDuration()
      updateTime()
    }
    if (element.error) setError(true)

    element.addEventListener('timeupdate', updateTime)
    element.addEventListener('loadedmetadata', updateDuration)
    element.addEventListener('durationchange', updateDuration)
    element.addEventListener('play', onPlay)
    element.addEventListener('pause', onPause)
    element.addEventListener('ended', onEnded)
    element.addEventListener('error', onError)

    return () => {
      element.removeEventListener('timeupdate', updateTime)
      element.removeEventListener('loadedmetadata', updateDuration)
      element.removeEventListener('durationchange', updateDuration)
      element.removeEventListener('play', onPlay)
      element.removeEventListener('pause', onPause)
      element.removeEventListener('ended', onEnded)
      element.removeEventListener('error', onError)
    }
  }, [])

  const togglePlayback = () => {
    const element = audio.current
    if (!element) return

    if (element.paused) {
      void element.play().catch(() => {
        setPlaying(false)
        setError(true)
      })
    } else {
      element.pause()
    }
  }

  const seek = (value: string) => {
    const element = audio.current
    if (!element || duration <= 0) return

    const nextTime = Number(value)
    element.currentTime = nextTime
    setTime(nextTime)
  }

  const progress = duration > 0 ? Math.min(100, (time / duration) * 100) : 0

  return (
    <section className='mb-6 max-w-120 font-sans' aria-label='Audio player'>
      <audio ref={audio} src={src} preload='metadata' />

      <div className='flex min-w-0 items-center gap-3'>
        <button
          type='button'
          onClick={togglePlayback}
          aria-label={playing ? 'Pause audio' : 'Play audio'}
          aria-pressed={playing}
          className='flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-150 ease-out-strong active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50 motion-reduce:transition-none motion-reduce:active:scale-100'
        >
          {playing ? <Pause size={14} weight='fill' /> : <Play size={14} weight='fill' />}
        </button>

        <div className='min-w-0 flex-1'>
          <div className='flex min-w-0 items-baseline justify-between gap-3'>
            <span className='truncate text-[0.875rem] text-ink/90'>{name ?? 'Music'}</span>
            <span className='shrink-0 text-[0.7rem] tabular-nums text-muted' aria-live='off'>
              <span className='text-ink/70'>{clock(time)}</span>
              <span className='px-1 text-muted/70' aria-hidden='true'>/</span>
              {duration > 0 ? clock(duration) : '--:--'}
            </span>
          </div>

          <label className='sr-only' htmlFor='audio-seek'>Track progress</label>
          <input
            id='audio-seek'
            type='range'
            min={0}
            max={duration || 1}
            step={0.1}
            value={duration > 0 ? Math.min(time, duration) : 0}
            onChange={(event) => seek(event.target.value)}
            disabled={duration <= 0}
            aria-valuetext={duration > 0 ? `${clock(time)} of ${clock(duration)}` : 'Audio duration unavailable'}
            className='audio-seek mt-0.5 block h-6 w-full cursor-pointer touch-pan-y appearance-none bg-transparent disabled:cursor-default'
            style={{ '--audio-progress': `${progress}%` } as React.CSSProperties}
          />
        </div>
      </div>

      {error ? <p className='mt-1 ps-12 text-xs text-muted' role='status'>Audio could not be played.</p> : null}
    </section>
  )
}
