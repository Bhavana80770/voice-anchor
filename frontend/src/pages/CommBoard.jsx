import React from 'react'
import axios from 'axios'

const NEEDS = [
  { label: "I'm Hungry", emoji: '😋', text: "I am feeling hungry. Can I have something to eat please?", color: '#f6ad55' },
  { label: "I'm Thirsty", emoji: '🧃', text: "I am thirsty. Can I have some water please?", color: '#63b3ed' },
  { label: "Toilet", emoji: '🚽', text: "I need to go to the toilet please.", color: '#68d391' },
  { label: "Break Please", emoji: '🧘', text: "I need a little break and some quiet time please.", color: '#9f7aea' },
  { label: "Help Me", emoji: '🆘', text: "I need some help please. I am feeling a bit overwhelmed.", color: '#fc8181' },
  { label: "I Love You", emoji: '❤️', text: "I love you very much!", color: '#f687b3' }
]

export default function CommBoard({ onBack, profile, isDark }) {
  const handleSpeak = async (text) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/speak', {
        text,
        voiceId: profile.voiceId || 'en-US-natalie',
        style: profile.voiceStyle || 'Calm'
      })
      const audio = new Audio(data.audioUrl)
      audio.play()
    } catch (err) {
      console.error('AAC failed:', err)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', padding: '2rem 1.5rem',
      background: isDark ? '#0a0a1a' : '#f7fafc',
      fontFamily: 'Segoe UI, sans-serif', color: isDark ? 'white' : '#1a202c'
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: '#63b3ed',
          fontSize: 16, cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8
        }}>← Back</button>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>My Voice 🗣️</h1>
          <p style={{ color: isDark ? 'rgba(255,255,255,0.4)' : '#718096' }}>
            Tap a card to tell me what you need
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {NEEDS.map((need, i) => (
            <button
              key={i}
              onClick={() => handleSpeak(need.text)}
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'white',
                border: `2px solid ${need.color}44`,
                borderRadius: 24, padding: '1.5rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: 40 }}>{need.emoji}</span>
              <span style={{ fontWeight: 700, fontSize: 15, color: need.color }}>{need.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
