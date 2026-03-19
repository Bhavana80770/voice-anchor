import { useState } from 'react'

const TIME_SLOTS = [
  '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM',
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
  '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM',
]

const ROUTINE_OPTIONS = [
  { label: 'Stop Playtime', emoji: '🧸' },
  { label: 'Brush Teeth', emoji: '🪥' },
  { label: 'Leave House', emoji: '👟' },
  { label: 'Eat Food', emoji: '🍽️' },
  { label: 'Bedtime', emoji: '🌙' },
  { label: 'Bath Time', emoji: '🛁' },
  { label: 'Study Time', emoji: '📚' },
  { label: 'Medicine', emoji: '💊' },
]

export default function Schedule({ onBack, onTriggerRoutine }) {
  const [schedule, setSchedule] = useState(
    JSON.parse(localStorage.getItem('dailySchedule')) || []
  )
  const [showAdd, setShowAdd] = useState(false)
  const [selectedTime, setSelectedTime] = useState('07:00 AM')
  const [selectedRoutine, setSelectedRoutine] = useState(ROUTINE_OPTIONS[0])

  const addSchedule = () => {
    const updated = [...schedule, {
      time: selectedTime,
      routine: selectedRoutine
    }].sort((a, b) => a.time.localeCompare(b.time))
    setSchedule(updated)
    localStorage.setItem('dailySchedule', JSON.stringify(updated))
    setShowAdd(false)
  }

  const deleteSchedule = (index) => {
    const updated = schedule.filter((_, i) => i !== index)
    setSchedule(updated)
    localStorage.setItem('dailySchedule', JSON.stringify(updated))
  }

  const now = new Date()
  const currentTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '2rem 1rem',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{ maxWidth: 500, margin: '0 auto', position: 'relative', zIndex: 1 }}>

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
        }}>📅 Daily Schedule</h2>

        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: '1.5rem' }}>
          Current time: <span style={{ color: '#63b3ed', fontWeight: 700 }}>{currentTime}</span>
        </p>

        {/* Add button */}
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
          {showAdd ? '✕ Cancel' : '+ Add to Schedule'}
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
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 8, letterSpacing: 1 }}>
              SELECT TIME
            </p>
            <select
              value={selectedTime}
              onChange={e => setSelectedTime(e.target.value)}
              style={{
                display: 'block', width: '100%',
                padding: '12px 16px', marginBottom: 16,
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.07)',
                color: 'white', fontSize: 15,
                outline: 'none', boxSizing: 'border-box'
              }}
            >
              {TIME_SLOTS.map(t => (
                <option key={t} value={t} style={{ background: '#1a1a2e' }}>{t}</option>
              ))}
            </select>

            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 8, letterSpacing: 1 }}>
              SELECT ROUTINE
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {ROUTINE_OPTIONS.map(r => (
                <button
                  key={r.label}
                  onClick={() => setSelectedRoutine(r)}
                  style={{
                    padding: '8px 14px', borderRadius: 10,
                    cursor: 'pointer', fontSize: 13,
                    background: selectedRoutine.label === r.label
                      ? 'rgba(99,179,237,0.3)'
                      : 'rgba(255,255,255,0.05)',
                    border: selectedRoutine.label === r.label
                      ? '1.5px solid #63b3ed'
                      : '1px solid rgba(255,255,255,0.1)',
                    color: selectedRoutine.label === r.label
                      ? '#63b3ed' : 'rgba(255,255,255,0.6)'
                  }}
                >
                  {r.emoji} {r.label}
                </button>
              ))}
            </div>

            <button onClick={addSchedule} style={{
              background: 'linear-gradient(90deg, #63b3ed, #9f7aea)',
              border: 'none', color: 'white',
              padding: '12px 24px', borderRadius: 12,
              fontSize: 14, fontWeight: 700,
              cursor: 'pointer', width: '100%'
            }}>
              Save to Schedule ✅
            </button>
          </div>
        )}

        {/* Schedule list */}
        {schedule.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '2rem',
            color: 'rgba(255,255,255,0.3)', fontSize: 14
          }}>
            No schedule yet!<br />Add your first routine above 👆
          </div>
        ) : (
          schedule.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16, padding: '1rem 1.25rem',
              marginBottom: 12, animation: 'fadeIn 0.5s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>{s.routine.emoji}</span>
                <div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>
                    {s.routine.label}
                  </div>
                  <div style={{ color: '#63b3ed', fontSize: 13, marginTop: 2 }}>
                    ⏰ {s.time}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => {
                    onTriggerRoutine(s.routine)
                    onBack()
                  }}
                  style={{
                    background: 'rgba(99,179,237,0.2)',
                    border: '1px solid rgba(99,179,237,0.4)',
                    color: '#63b3ed', padding: '6px 14px',
                    borderRadius: 8, cursor: 'pointer',
                    fontSize: 12, fontWeight: 600
                  }}
                >▶ Play</button>
                <button
                  onClick={() => deleteSchedule(i)}
                  style={{
                    background: 'rgba(252,129,129,0.1)',
                    border: '1px solid rgba(252,129,129,0.3)',
                    color: '#fc8181', padding: '6px 14px',
                    borderRadius: 8, cursor: 'pointer',
                    fontSize: 12, fontWeight: 600
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