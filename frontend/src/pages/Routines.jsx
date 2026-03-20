import { useState } from 'react'

const EMOJI_OPTIONS = ['🧸','🪥','👟','🍽️','🌙','🛁','📚','🎨','🎮','🌳','🚗','🎵','🏃','😴','🧹','💊','🎯','🌈','🏠','🐶']

export default function Routines({ onBack, onSelectRoutine }) {
  const [routines, setRoutines] = useState(
    JSON.parse(localStorage.getItem('customRoutines')) || []
  )
  const [newLabel, setNewLabel] = useState('')
  const [newEmoji, setNewEmoji] = useState('🧸')
  const [scheduledTime, setScheduledTime] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const addRoutine = () => {
    if (!newLabel.trim()) {
      alert('Please enter a routine name!')
      return
    }
    const updated = [...routines, { label: newLabel, emoji: newEmoji, time: scheduledTime }]
    setRoutines(updated)
    localStorage.setItem('customRoutines', JSON.stringify(updated))
    setNewLabel('')
    setNewEmoji('🧸')
    setScheduledTime('')
    setShowAdd(false)
  }

  const deleteRoutine = (index) => {
    const updated = routines.filter((_, i) => i !== index)
    setRoutines(updated)
    localStorage.setItem('customRoutines', JSON.stringify(updated))
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '2rem 1rem',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{ maxWidth: 500, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <button onClick={onBack} style={{
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white', padding: '10px 20px',
          borderRadius: 12, cursor: 'pointer',
          marginBottom: '1.5rem', fontSize: 14
        }}>← Back</button>

        <h2 style={{
          background: 'linear-gradient(90deg, #63b3ed, #9f7aea)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: 22, marginBottom: '0.5rem'
        }}>⚙️ Custom Routines</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: '1.5rem' }}>
          Add your own routines for your child!
        </p>

        {/* Add new routine button */}
        <button
          onClick={() => setShowAdd(!showAdd)}
          style={{
            background: 'linear-gradient(90deg, #63b3ed, #9f7aea)',
            border: 'none', color: 'white',
            padding: '12px 24px', borderRadius: 12,
            fontSize: 14, fontWeight: 700,
            cursor: 'pointer', width: '100%',
            marginBottom: '1.5rem'
          }}
        >
          {showAdd ? '✕ Cancel' : '+ Add New Routine'}
        </button>

        {/* Add form */}
        {showAdd && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(99,179,237,0.3)',
            borderRadius: 16, padding: '1.25rem',
            marginBottom: '1.5rem',
            animation: 'fadeIn 0.3s ease'
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: 12, marginBottom: 8, letterSpacing: 1
            }}>
              ROUTINE NAME
            </p>
            <input
              placeholder="e.g. Take Medicine, Change Clothes..."
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              style={{
                display: 'block', width: '100%',
                padding: '12px 16px', marginBottom: 16,
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.07)',
                color: 'white', fontSize: 15,
                outline: 'none', boxSizing: 'border-box'
              }}
            />

            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: 12, marginBottom: 8, letterSpacing: 1
            }}>
              SCHEDULE REMINDER (OPTIONAL)
            </p>
            <input
              type="time"
              value={scheduledTime}
              onChange={e => setScheduledTime(e.target.value)}
              style={{
                display: 'block', width: '100%',
                padding: '12px 16px', marginBottom: 16,
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.07)',
                color: 'white', fontSize: 15,
                outline: 'none', boxSizing: 'border-box'
              }}
            />

            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: 12, marginBottom: 8, letterSpacing: 1
            }}>
              PICK AN EMOJI
            </p>
            <div style={{
              display: 'flex', flexWrap: 'wrap',
              gap: 8, marginBottom: 16
            }}>
              {EMOJI_OPTIONS.map(e => (
                <button
                  key={e}
                  onClick={() => setNewEmoji(e)}
                  style={{
                    fontSize: 24, padding: '6px 10px',
                    borderRadius: 10, cursor: 'pointer',
                    background: newEmoji === e
                      ? 'rgba(99,179,237,0.3)'
                      : 'rgba(255,255,255,0.05)',
                    border: newEmoji === e
                      ? '1.5px solid #63b3ed'
                      : '1px solid rgba(255,255,255,0.1)'
                  }}
                >{e}</button>
              ))}
            </div>

            <button onClick={addRoutine} style={{
              background: 'linear-gradient(90deg, #63b3ed, #9f7aea)',
              border: 'none', color: 'white',
              padding: '12px 24px', borderRadius: 12,
              fontSize: 14, fontWeight: 700,
              cursor: 'pointer', width: '100%'
            }}>
              Save Routine ✅
            </button>
          </div>
        )}

        {/* Routine list */}
        {routines.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '2rem',
            color: 'rgba(255,255,255,0.3)', fontSize: 14
          }}>
            No custom routines yet!<br />Add your first one above 👆
          </div>
        ) : (
          routines.map((r, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16, padding: '1rem 1.25rem',
              marginBottom: 12, animation: 'fadeIn 0.5s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 32 }}>{r.emoji}</span>
                <span style={{ color: 'white', fontWeight: 600, fontSize: 15 }}>
                  {r.label}
                </span>
                {r.time && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: 4, marginLeft: 8 }}>⏰ {r.time}</span>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => {
                    onSelectRoutine(r)
                    onBack()
                  }}
                  style={{
                    background: 'rgba(99,179,237,0.2)',
                    border: '1px solid rgba(99,179,237,0.4)',
                    color: '#63b3ed', padding: '6px 14px',
                    borderRadius: 8, cursor: 'pointer', fontSize: 12,
                    fontWeight: 600
                  }}
                >Use ▶</button>
                <button
                  onClick={() => deleteRoutine(i)}
                  style={{
                    background: 'rgba(252,129,129,0.1)',
                    border: '1px solid rgba(252,129,129,0.3)',
                    color: '#fc8181', padding: '6px 14px',
                    borderRadius: 8, cursor: 'pointer', fontSize: 12,
                    fontWeight: 600
                  }}
                >Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}