import React, { useState } from 'react'

const SEQUENCES = [
  {
    id: 'wash',
    title: 'Wash Hands 🧼',
    steps: [
      { text: 'Turn on the water 💧', icon: '🚰' },
      { text: 'Get some soap 🫧', icon: '🧼' },
      { text: 'Rub hands together ✨', icon: '🤲' },
      { text: 'Rinse with water 🌊', icon: '💦' },
      { text: 'Dry with a towel 🧣', icon: '🧤' }
    ]
  },
  {
    id: 'teeth',
    title: 'Brush Teeth 🦷',
    steps: [
      { text: 'Put toothpaste on 🧁', icon: '🪥' },
      { text: 'Brush top and bottom 🦷', icon: '✨' },
      { text: 'Brush for 2 minutes ⏰', icon: '⏳' },
      { text: 'Rinse and spit 💦', icon: '🚰' }
    ]
  }
]

export default function VisualSequence({ onBack }) {
  const [selected, setSelected] = useState(null)
  const [step, setStep] = useState(0)

  if (selected) {
    const currentStep = selected.steps[step]
    const isLast = step === selected.steps.length - 1

    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a1a', color: 'white',
        display: 'flex', flexDirection: 'column', padding: '2rem',
        fontFamily: 'Segoe UI, sans-serif'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          <button 
            onClick={() => { setSelected(null); setStep(0); }}
            style={{
              background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
              padding: '12px 20px', borderRadius: 14, cursor: 'pointer', marginRight: '1.5rem'
            }}
          >← Back</button>
          <h2 style={{ margin: 0 }}>{selected.title}</h2>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: '100%', maxWidth: 500, background: 'rgba(255,255,255,0.03)',
            padding: '3rem', borderRadius: 40, border: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center', position: 'relative'
          }}>
            <div style={{ fontSize: '8rem', marginBottom: '2rem', animation: 'bounce 2s infinite' }}>{currentStep.icon}</div>
            <h1 style={{ fontSize: 36, fontWeight: 800 }}>{currentStep.text}</h1>
            <div style={{ marginTop: '2rem', opacity: 0.5, fontSize: 18 }}>Step {step + 1} of {selected.steps.length}</div>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '3rem', width: '100%', maxWidth: 500 }}>
            {step > 0 && (
              <button 
                onClick={() => setStep(step - 1)}
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
                  padding: '20px', borderRadius: 20, fontSize: 18, fontWeight: 700, cursor: 'pointer'
                }}
              >Back</button>
            )}
            <button 
              onClick={() => isLast ? (setSelected(null), setStep(0)) : setStep(step + 1)}
              style={{
                flex: 2, background: isLast ? '#48bb78' : '#63b3ed', color: 'white', border: 'none',
                padding: '20px', borderRadius: 20, fontSize: 18, fontWeight: 700, cursor: 'pointer'
              }}
            >{isLast ? 'DONE! ✨' : 'NEXT'}</button>
          </div>
        </div>
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
        <h2 style={{ margin: 0 }}>👟 How-To Guides</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {SEQUENCES.map(s => (
          <button 
            key={s.id}
            onClick={() => setSelected(s)}
            style={{
              padding: '2.5rem', borderRadius: 24, textAlign: 'left',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer', transition: 'transform 0.2s', color: 'white'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h3 style={{ margin: 0, fontSize: 24 }}>{s.title}</h3>
            <p style={{ opacity: 0.5 }}>{s.steps.length} simple steps</p>
          </button>
        ))}
      </div>
    </div>
  )
}
