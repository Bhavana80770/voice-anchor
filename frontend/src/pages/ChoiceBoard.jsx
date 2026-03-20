import React, { useState } from 'react'

const DEFAULT_CHOICES = [
  { id: 1, label: 'Snack Time', optionA: { text: '🍎 Apple', color: '#feb2b2' }, optionB: { text: '🍌 Banana', color: '#fefcbf' } },
  { id: 2, label: 'Play Time', optionA: { text: '📚 Book', color: '#90cdf4' }, optionB: { text: '🧱 Blocks', color: '#f6ad55' } },
  { id: 3, label: 'Outdoors', optionA: { text: '🛝 Park', color: '#9ae6b4' }, optionB: { text: '🚶 Walk', color: '#cbd5e0' } }
]

export default function ChoiceBoard({ onBack }) {
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [result, setResult] = useState(null)

  if (result) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a1a', color: 'white',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '2rem', textAlign: 'center'
      }}>
        <h1 style={{ fontSize: 60, marginBottom: '2rem' }}>{result.text}</h1>
        <h2 style={{ fontSize: 32, fontWeight: 800 }}>Great choice! ✨</h2>
        <button 
          onClick={() => { setResult(null); setSelectedChoice(null); }}
          style={{
            marginTop: '3rem', background: '#9f7aea', color: 'white', border: 'none',
            padding: '15px 40px', borderRadius: 20, fontSize: 18, fontWeight: 700, cursor: 'pointer'
          }}
        >Pick another one</button>
        <button onClick={onBack} style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>Back to Home</button>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a1a', color: 'white',
      padding: '2rem', display: 'flex', flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <button 
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
            padding: '12px 20px', borderRadius: 14, cursor: 'pointer', marginRight: '1.5rem'
          }}
        >← Back</button>
        <h2 style={{ margin: 0 }}>🍱 Choice Board</h2>
      </div>

      {!selectedChoice ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          {DEFAULT_CHOICES.map(c => (
            <button 
              key={c.id}
              onClick={() => setSelectedChoice(c)}
              style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                padding: '2.5rem', borderRadius: 24, cursor: 'pointer', textAlign: 'center',
                transition: 'transform 0.2s', color: 'white'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <h3 style={{ margin: 0, fontSize: 24 }}>{c.label}</h3>
              <p style={{ opacity: 0.5 }}>Choose between two things</p>
            </button>
          ))}
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ marginBottom: '3rem', fontSize: 32, textAlign: 'center' }}>What would you like?</h2>
          <div style={{ 
            display: 'flex', 
            flexDirection: window.innerWidth < 600 ? 'column' : 'row',
            gap: '2rem', width: '100%', maxWidth: 800, padding: '1rem' 
          }}>
            {[selectedChoice.optionA, selectedChoice.optionB].map((opt, idx) => (
              <button 
                key={idx}
                onClick={() => {
                  console.log('Choice selected:', opt.text);
                  setResult(opt);
                }}
                style={{
                  flex: 1, minHeight: 300, background: opt.color,
                  borderRadius: 40, border: '6px solid white', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)', transition: 'all 0.2s',
                  padding: '2rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
                }}
              >
                <div style={{ fontSize: '6rem', marginBottom: 10 }}>{opt.text.split(' ')[0]}</div>
                <div style={{ color: '#1a202c', fontSize: 32, fontWeight: 900 }}>
                  {opt.text.split(' ').slice(1).join(' ')}
                </div>
              </button>
            ))}
          </div>
          <button 
            onClick={() => setSelectedChoice(null)}
            style={{ 
              marginTop: '4rem', background: 'rgba(255,255,255,0.1)', 
              border: 'none', color: 'white', padding: '15px 30px', 
              borderRadius: 16, cursor: 'pointer', fontWeight: 600 
            }}
          >← Change Category</button>
        </div>
      )}
    </div>
  )
}
