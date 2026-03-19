import { useState, useEffect } from 'react'

export default function Progress({ sessions, onBack }) {

  const routineCounts = sessions.reduce((acc, s) => {
    acc[s.routine] = (acc[s.routine] || 0) + 1
    return acc
  }, {})

  const languageCounts = sessions.reduce((acc, s) => {
    acc[s.language] = (acc[s.language] || 0) + 1
    return acc
  }, {})

  const maxCount = Math.max(...Object.values(routineCounts), 1)

  const COLORS = ['#63b3ed','#9f7aea','#f6ad55','#68d391','#fc8181','#f687b3']

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
        }}>📊 Progress Tracker</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: '1.5rem' }}>
          See how your child is doing!
        </p>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: '2rem' }}>
          <div style={{
            background: 'rgba(99,179,237,0.1)',
            border: '1px solid rgba(99,179,237,0.3)',
            borderRadius: 16, padding: '1rem', textAlign: 'center'
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#63b3ed' }}>
              {sessions.length}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 }}>
              Total Sessions
            </div>
          </div>
          <div style={{
            background: 'rgba(159,122,234,0.1)',
            border: '1px solid rgba(159,122,234,0.3)',
            borderRadius: 16, padding: '1rem', textAlign: 'center'
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#9f7aea' }}>
              {Object.keys(routineCounts).length}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 }}>
              Routines Done
            </div>
          </div>
          <div style={{
            background: 'rgba(104,211,145,0.1)',
            border: '1px solid rgba(104,211,145,0.3)',
            borderRadius: 16, padding: '1rem', textAlign: 'center'
          }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#68d391' }}>
              {Object.keys(languageCounts).length}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 }}>
              Languages Used
            </div>
          </div>
        </div>

        {/* Routine bar chart */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16, padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ color: 'white', fontSize: 15, marginBottom: '1rem' }}>
            🎯 Routines breakdown
          </h3>
          {Object.keys(routineCounts).length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center' }}>
              No sessions yet! Go back and try a routine.
            </p>
          ) : (
            Object.entries(routineCounts).map(([routine, count], i) => (
              <div key={routine} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{routine}</span>
                  <span style={{ color: COLORS[i % COLORS.length], fontSize: 13, fontWeight: 700 }}>
                    {count} times
                  </span>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 8, height: 10, overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(count / maxCount) * 100}%`,
                    background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i+1) % COLORS.length]})`,
                    borderRadius: 8,
                    animation: 'growBar 1s ease-out forwards',
                    transition: 'width 1s ease'
                  }} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Language breakdown */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16, padding: '1.25rem'
        }}>
          <h3 style={{ color: 'white', fontSize: 15, marginBottom: '1rem' }}>
            🌍 Languages used
          </h3>
          {Object.keys(languageCounts).length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center' }}>
              No sessions yet!
            </p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(languageCounts).map(([lang, count], i) => (
                <div key={lang} style={{
                  background: `rgba(${['99,179,237','159,122,234','104,211,145','246,173,85'][i % 4]}, 0.15)`,
                  border: `1px solid rgba(${['99,179,237','159,122,234','104,211,145','246,173,85'][i % 4]}, 0.4)`,
                  borderRadius: 20, padding: '6px 14px',
                  fontSize: 13, color: 'rgba(255,255,255,0.8)'
                }}>
                  {lang} ({count})
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <style>{`
        @keyframes growBar {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}