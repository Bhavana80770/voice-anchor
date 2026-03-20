import React, { useState, useEffect, useRef } from 'react'

const SOUNDS = [
  { id: 'rain', label: 'Rain 🌧️', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', color: '#63b3ed' },
  { id: 'ocean', label: 'Ocean 🌊', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', color: '#4299e1' },
  { id: 'white', label: 'Static 🌫️', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', color: '#a0aec0' },
  { id: 'forest', label: 'Birds 🐦', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', color: '#68d391' }
]

export default function SensoryMixer({ onBack }) {
  const [volumes, setVolumes] = useState({ rain: 0, ocean: 0, white: 0, forest: 0 })
  const audioRefs = useRef({})

  useEffect(() => {
    SOUNDS.forEach(s => {
      audioRefs.current[s.id] = new Audio(s.url)
      audioRefs.current[s.id].loop = true
    })
    return () => {
      Object.values(audioRefs.current).forEach(a => a.pause())
    }
  }, [])

  const handleVolumeChange = (id, val) => {
    const audio = audioRefs.current[id]
    if (audio) {
      if (val > 0 && audio.paused) audio.play()
      if (val === 0) audio.pause()
      audio.volume = val / 100
    }
    setVolumes(prev => ({ ...prev, [id]: val }))
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a1a', color: 'white',
      padding: '2rem', display: 'flex', flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem' }}>
        <button 
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
            padding: '12px 20px', borderRadius: 14, cursor: 'pointer', marginRight: '1.5rem'
          }}
        >← Back</button>
        <h2 style={{ margin: 0, fontSize: 28 }}>🎛️ Sensory Mixer</h2>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '3rem' }}>
        Mix these sounds to find your perfect "Calm Space" ✨
      </p>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: '2.5rem',
        maxWidth: 600, margin: '0 auto', width: '100%'
      }}>
        {SOUNDS.map(s => (
          <div key={s.id} style={{
            background: 'rgba(255,255,255,0.03)', padding: '1.5rem',
            borderRadius: 24, border: `1px solid ${s.color}22`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 700, color: s.color }}>{s.label}</span>
              <span style={{ opacity: 0.5, fontSize: 13 }}>{volumes[s.id]}%</span>
            </div>
            <input 
              type="range"
              min="0" max="100"
              value={volumes[s.id]}
              onChange={(e) => handleVolumeChange(s.id, parseInt(e.target.value))}
              style={{
                width: '100%', cursor: 'pointer',
                accentColor: s.color
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '2rem' }}>
        <button 
          onClick={() => {
            SOUNDS.forEach(s => handleVolumeChange(s.id, s.id === 'rain' ? 30 : 0))
          }}
          style={{
            background: 'rgba(159,122,234,0.1)', border: '1px solid rgba(159,122,234,0.3)',
            color: '#9f7aea', padding: '15px 30px', borderRadius: 20, cursor: 'pointer'
          }}
        >🌙 Instant Calm (Rain Mode)</button>
      </div>
    </div>
  )
}
