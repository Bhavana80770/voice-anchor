import { useState } from 'react'

export default function SOS({ onBack, childName }) {
  const [sent, setSent] = useState(false)
  const [caregiverPhone, setCaregiverPhone] = useState(
    localStorage.getItem('caregiverPhone') || ''
  )
  const [caregiverName, setCaregiverName] = useState(
    localStorage.getItem('caregiverName') || ''
  )
  const [saved, setSaved] = useState(false)

  const handleSOS = () => {
    if (!caregiverPhone) {
      alert('Please save caregiver phone number first! Scroll down and add it!')
      return
    }
    setSent(true)
    setTimeout(() => setSent(false), 4000)
    const phone = caregiverPhone.replace(/\D/g, '')
    const message = encodeURIComponent(
      `🚨 EMERGENCY ALERT! ${childName} needs help RIGHT NOW! Please come immediately! - Voice Anchor App`
    )
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  const saveCaregiver = () => {
    if (!caregiverName || !caregiverPhone) {
      alert('Please fill in both name and phone number!')
      return
    }
    localStorage.setItem('caregiverPhone', caregiverPhone)
    localStorage.setItem('caregiverName', caregiverName)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

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
          background: 'linear-gradient(90deg, #fc8181, #f6ad55)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: 22, marginBottom: '0.5rem'
        }}>🚨 Emergency SOS</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: '1.5rem' }}>
          Alert caregiver on WhatsApp when child needs help!
        </p>

        {/* SOS Button */}
        <button
          onClick={handleSOS}
          style={{
            width: '100%', padding: '28px',
            borderRadius: 20, cursor: 'pointer',
            background: sent
              ? 'rgba(104,211,145,0.2)'
              : 'rgba(252,129,129,0.15)',
            border: sent
              ? '2px solid #68d391'
              : '2px solid #fc8181',
            marginBottom: '2rem',
            animation: sent ? 'none' : 'sosPulse 1.5s infinite'
          }}
        >
          <div style={{ fontSize: 60, marginBottom: 8 }}>
            {sent ? '✅' : '🆘'}
          </div>
          <div style={{
            fontSize: 22, fontWeight: 700,
            color: sent ? '#68d391' : '#fc8181',
            marginBottom: 6
          }}>
            {sent ? 'WhatsApp Alert Sent!' : 'TAP FOR EMERGENCY HELP'}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
            {sent
              ? `Caregiver notified about ${childName} via WhatsApp!`
              : 'Opens WhatsApp and sends alert to caregiver'}
          </div>
        </button>

        {/* Caregiver setup */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16, padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, marginBottom: '1rem' }}>
            👤 Caregiver Details
          </h3>

          <label style={labelStyle}>Caregiver Name</label>
          <input
            placeholder="e.g. Mom, Dad, Teacher"
            value={caregiverName}
            onChange={e => setCaregiverName(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>WhatsApp Number (with country code)</label>
          <input
            placeholder="e.g. 919876543210"
            value={caregiverPhone}
            onChange={e => setCaregiverPhone(e.target.value)}
            style={inputStyle}
          />

          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginBottom: 12 }}>
            ⚠️ Enter number with country code. India = 91XXXXXXXXXX
          </p>

          <button onClick={saveCaregiver} style={{
            background: saved
              ? 'rgba(104,211,145,0.3)'
              : 'linear-gradient(90deg, #63b3ed, #9f7aea)',
            border: 'none', color: 'white',
            padding: '12px 24px', borderRadius: 12,
            fontSize: 14, fontWeight: 700,
            cursor: 'pointer', width: '100%'
          }}>
            {saved ? '✅ Saved! SOS is ready!' : 'Save Caregiver Details'}
          </button>
        </div>

        {/* Calm messages */}
        <div style={{
          background: 'rgba(99,179,237,0.05)',
          border: '1px solid rgba(99,179,237,0.2)',
          borderRadius: 16, padding: '1.25rem'
        }}>
          <h3 style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, marginBottom: '1rem' }}>
            💙 Quick Calm Messages
          </h3>
          {[
            'You are safe. I am coming!',
            'Take a deep breath. Everything is okay.',
            'I love you. Stay calm. I will be there soon.',
          ].map((msg, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '12px 16px',
              marginBottom: 8, color: 'rgba(255,255,255,0.7)',
              fontSize: 14, lineHeight: 1.5
            }}>
              💬 {msg}
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes sosPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(252,129,129,0.4); }
          50% { box-shadow: 0 0 25px 12px rgba(252,129,129,0.15); }
        }
      `}</style>
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: 12,
  color: 'rgba(255,255,255,0.5)',
  marginBottom: 6, letterSpacing: 1,
  textTransform: 'uppercase'
}

const inputStyle = {
  display: 'block', width: '100%',
  padding: '12px 16px', marginBottom: 16,
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.07)',
  color: 'white', fontSize: 15,
  outline: 'none', boxSizing: 'border-box'
}