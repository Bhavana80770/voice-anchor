import React, { useState } from 'react'

const ENERGY_LEVELS = [
  { 
    label: "High Energy ⚡", 
    color: "#f6ad55", 
    desc: "I feel like I have lots of zoomies! I want to move my body.",
    suggestions: ["10 Star Jumps", "Dance to a Song", "Run in Place", "Big Stretches"]
  },
  { 
    label: "Medium Energy ✨", 
    color: "#68d391", 
    desc: "I feel good and ready to learn or play gently.",
    suggestions: ["Read a Story", "Draw a Picture", "Memory Match Game", "Help with a Task"]
  },
  { 
    label: "Low Energy 💤", 
    color: "#63b3ed", 
    desc: "I feel tired and need some quiet time to rest my brain.",
    suggestions: ["Zen Bubbles", "Deep Breathing", "Listen to Music", "Cuddle with a Toy"]
  }
]

export default function EnergyMeter({ onBack, isDark }) {
  const [selected, setSelected] = useState(null)

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
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Energy Meter 🔋</h1>
          <p style={{ color: isDark ? 'rgba(255,255,255,0.4)' : '#718096' }}>
            How does your internal battery feel?
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {ENERGY_LEVELS.map((level, i) => (
            <button
              key={i}
              onClick={() => setSelected(level)}
              style={{
                background: selected?.label === level.label ? level.color : (isDark ? 'rgba(255,255,255,0.05)' : 'white'),
                border: `2px solid ${level.color}${selected?.label === level.label ? 'ff' : '44'}`,
                borderRadius: 24, padding: '1.5rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: selected?.label === level.label ? 'scale(1.02)' : 'scale(1)',
                color: selected?.label === level.label ? 'white' : (isDark ? 'white' : 'black')
              }}
            >
              <h2 style={{ margin: 0, fontSize: 22 }}>{level.label}</h2>
              <p style={{ 
                margin: 0, fontSize: 13, opacity: 0.7, 
                color: selected?.label === level.label ? 'white' : (isDark ? 'rgba(255,255,255,0.6)' : '#4a5568')
              }}>{level.desc}</p>
            </button>
          ))}
        </div>

        {selected && (
          <div style={{ 
            marginTop: '2.5rem', animation: 'fadeIn 0.5s ease',
            padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 24,
            border: `1px solid ${selected.color}44`
          }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: 16, fontWeight: 800 }}>
              Let's Try These: ✨
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {selected.suggestions.map((sug, i) => (
                <div 
                  key={i}
                  style={{
                    padding: '12px', background: 'white', color: '#2d3748',
                    borderRadius: 12, fontSize: 13, fontWeight: 600, textAlign: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                  }}
                >{sug}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
