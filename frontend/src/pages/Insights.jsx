import React from 'react'
import { getCaregiverInsights } from '../utils/aiLearning'
import AdvancedStats from '../components/AdvancedStats'

export default function Insights({ sessions, onBack, isTherapist }) {
  const insights = getCaregiverInsights(sessions)

  if (!insights) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)',
        padding: '2rem 1rem', color: 'white', fontFamily: 'Segoe UI, sans-serif',
        textAlign: 'center'
      }}>
        <button onClick={onBack} style={{
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          color: 'white', padding: '10px 20px', borderRadius: 12, cursor: 'pointer', marginBottom: '2rem'
        }}>← Back</button>
        <h2>No insights yet</h2>
        <p>Complete some routines to see patterns!</p>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '2rem 1rem', color: 'white', fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <button onClick={onBack} style={{
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          color: 'white', padding: '10px 20px', borderRadius: 12, cursor: 'pointer', marginBottom: '1.5rem'
        }}>← Back</button>

        <h2 style={{
          background: 'linear-gradient(90deg, #63b3ed, #9f7aea)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          fontSize: 24, marginBottom: '0.5rem'
        }}>🛡️ AI Caregiver Insights</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: '2rem' }}>
          Patterns learned from your child's sessions.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          {/* Top Routine */}
          <div style={cardStyle}>
            <div style={iconStyle}>🎯</div>
            <div>
              <div style={labelStyle}>Favorite Routine</div>
              <div style={valueStyle}>{insights.topRoutine}</div>
            </div>
          </div>

          {/* Best Time */}
          <div style={cardStyle}>
            <div style={iconStyle}>⏰</div>
            <div>
              <div style={labelStyle}>Most Cooperative Time</div>
              <div style={valueStyle}>{insights.bestTime}</div>
            </div>
          </div>

          {/* Preferred Language */}
          <div style={cardStyle}>
            <div style={iconStyle}>🌍</div>
            <div>
              <div style={labelStyle}>Preferred Language</div>
              <div style={valueStyle}>{insights.topLang}</div>
            </div>
          </div>

          {/* Dominant Emotion */}
          <div style={cardStyle}>
            <div style={iconStyle}>🎭</div>
            <div>
              <div style={labelStyle}>Common Emotion</div>
              <div style={valueStyle}>{insights.topEmotion}</div>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '2rem', padding: '1.5rem',
          background: 'rgba(159,122,234,0.1)',
          border: '1px solid rgba(159,122,234,0.3)',
          borderRadius: 20, textAlign: 'center'
        }}>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>
            ✨ <b>AI Suggestion:</b> Your child is most responsive to <b>{insights.topRoutine}</b> during the <b>{insights.bestTime}</b> when spoken to in <b>{insights.topLang}</b>.
          </p>
        </div>

        {isTherapist && <AdvancedStats sessions={sessions} />}
      </div>
    </div>
  )
}

const cardStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 18, padding: '1.25rem',
  display: 'flex', alignItems: 'center', gap: 20
}

const iconStyle = {
  fontSize: 32, background: 'rgba(99,179,237,0.1)',
  width: 60, height: 60, borderRadius: 15,
  display: 'flex', alignItems: 'center', justifyContent: 'center'
}

const labelStyle = {
  color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 4
}

const valueStyle = {
  fontSize: 18, fontWeight: 700, color: '#63b3ed'
}
