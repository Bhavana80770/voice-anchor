import { useState } from 'react'

const EMOTIONS = [
  { emoji: '😊', label: 'Happy', color: '#68d391', message: 'calm and positive' },
  { emoji: '😢', label: 'Sad', color: '#63b3ed', message: 'gentle and comforting' },
  { emoji: '😠', label: 'Angry', color: '#fc8181', message: 'very calm and soothing' },
  { emoji: '😨', label: 'Scared', color: '#f6ad55', message: 'reassuring and safe' },
  { emoji: '😫', label: 'Tired', color: '#9f7aea', message: 'soft and sleepy' },
  { emoji: '😐', label: 'Neutral', color: '#b2b2b2', message: 'gentle and guiding' },
]

export default function Emotions({ onSelect, onBack }) {
  const [selected, setSelected] = useState(null)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '2rem 1rem',
      fontFamily: 'Segoe UI, sans-serif',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ maxWidth: 500, width: '100%', position: 'relative', zIndex: 1 }}>

        <button onClick={onBack} style={{
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white', padding: '10px 20px',
          borderRadius: 12, cursor: 'pointer',
          marginBottom: '1.5rem', fontSize: 14
        }}>← Back</button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: 48, marginBottom: 12, animation: 'float 3s ease-in-out infinite', display: 'inline-block' }}>
            💭
          </div>
          <h2 style={{
            background: 'linear-gradient(90deg, #63b3ed, #9f7aea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: 22, marginBottom: 8
          }}>How are you feeling?</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
            Tap how you feel right now!
          </p>
        </div>

        {/* Emotion buttons */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: 12, marginBottom: '2rem'
        }}>
          {EMOTIONS.map(e => (
            <button
              key={e.label}
              onClick={() => setSelected(e)}
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', padding: '20px 12px',
                borderRadius: 18, cursor: 'pointer', gap: 8,
                background: selected?.label === e.label
                  ? `rgba(${e.color}, 0.2)`
                  : 'rgba(255,255,255,0.05)',
                border: selected?.label === e.label
                  ? `2px solid ${e.color}`
                  : '1px solid rgba(255,255,255,0.1)',
                transform: selected?.label === e.label ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s',
                boxShadow: selected?.label === e.label
                  ? `0 0 20px ${e.color}44`
                  : 'none'
              }}
            >
              <span style={{
                fontSize: 44,
                animation: selected?.label === e.label
                  ? 'bounce 0.5s ease-in-out infinite'
                  : 'float 3s ease-in-out infinite',
                display: 'inline-block'
              }}>
                {e.emoji}
              </span>
              <span style={{
                fontSize: 13, fontWeight: 600,
                color: selected?.label === e.label
                  ? e.color : 'rgba(255,255,255,0.6)'
              }}>
                {e.label}
              </span>
            </button>
          ))}
        </div>

        {/* Continue button */}
        {selected && (
          <button
            onClick={() => onSelect(selected)}
            style={{
              background: 'linear-gradient(90deg, #63b3ed, #9f7aea)',
              border: 'none', color: 'white',
              padding: '16px', borderRadius: 16,
              fontSize: 16, fontWeight: 700,
              cursor: 'pointer', width: '100%',
              animation: 'fadeIn 0.3s ease'
            }}
          >
            Continue with {selected.emoji} {selected.label} →
          </button>
        )}

      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}