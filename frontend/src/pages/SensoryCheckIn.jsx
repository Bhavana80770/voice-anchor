import React, { useState } from 'react'
import axios from 'axios'

const SENSATIONS = [
  { label: "My Ears Hurt", emoji: "👂", text: "My ears are hurting. It might be too loud for me.", color: "#fc8181", category: "Sensory" },
  { label: "My Tummy Hurts", emoji: "🤢", text: "My tummy is feeling a bit sick or hurting.", color: "#68d391", category: "Body" },
  { label: "I'm Too Hot", emoji: "🥵", text: "I am feeling very hot. Can we cool down please?", color: "#f6ad55", category: "Sensory" },
  { label: "I'm Too Cold", emoji: "🥶", text: "I am feeling very cold please.", color: "#63b3ed", category: "Sensory" },
  { label: "My Head Hurts", emoji: "🤕", text: "My head is hurting. I might need some quiet time.", color: "#9f7aea", category: "Body" },
  { label: "It's Too Bright", emoji: "🕶️", text: "The lights are too bright for my eyes.", color: "#f6e05e", category: "Sensory" },
  { label: "I'm Itchy", emoji: "🦟", text: "My skin is feeling itchy and uncomfortable.", color: "#f687b3", category: "Body" },
  { label: "I Need a Hug", emoji: "🫂", text: "I need some deep pressure or a big hug please.", color: "#4299e1", category: "Comfort" }
]

export default function SensoryCheckIn({ onBack, profile, isDark }) {
  const [activeTab, setActiveTab] = useState('All')

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
      console.error('Sensory Check-In failed:', err)
    }
  }

  const filtered = activeTab === 'All' ? SENSATIONS : SENSATIONS.filter(s => s.category === activeTab)

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

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Body Scan 🧬</h1>
          <p style={{ color: isDark ? 'rgba(255,255,255,0.4)' : '#718096' }}>
            How does your body feel right now?
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: '2rem', overflowX: 'auto', paddingBottom: 8 }}>
          {['All', 'Sensory', 'Body', 'Comfort'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px', borderRadius: 20, border: 'none',
                background: activeTab === tab ? '#63b3ed' : (isDark ? 'rgba(255,255,255,0.05)' : 'white'),
                color: activeTab === tab ? 'white' : (isDark ? 'rgba(255,255,255,0.6)' : '#4a5568'),
                fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap'
              }}
            >{tab}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {filtered.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSpeak(s.text)}
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'white',
                border: `1.5px solid ${s.color}22`,
                borderRadius: 20, padding: '1.2rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                cursor: 'pointer', transition: 'transform 0.15s',
                boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.03)'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: 32 }}>{s.emoji}</span>
              <span style={{ fontWeight: 600, fontSize: 13, textAlign: 'center' }}>{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
