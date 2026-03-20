import React, { useState } from 'react'

export default function TherapistLogin({ onLogin, onBack }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    // Simple mock password for therapist
    if (password === 'therapist123') {
      onLogin()
    } else {
      setError('Invalid Therapist Password')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 24, padding: '2.5rem',
        width: '100%', maxWidth: 400, textAlign: 'center'
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>👨‍⚕️</div>
        <h2 style={{
          color: 'white', marginBottom: 8, fontSize: 24
        }}>Therapist Portal</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: '2rem' }}>
          Please enter your therapist credentials
        </p>

        <input
          type="password"
          placeholder="Therapist Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%', padding: '14px', borderRadius: 12,
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'white', marginBottom: '1.5rem', outline: 'none'
          }}
        />

        {error && <p style={{ color: '#fc8181', fontSize: 13, marginBottom: 16 }}>{error}</p>}

        <button
          onClick={handleLogin}
          style={{
            width: '100%', padding: '14px', borderRadius: 12,
            background: 'linear-gradient(90deg, #9f7aea, #63b3ed)',
            border: 'none', color: 'white', fontWeight: 700,
            cursor: 'pointer', marginBottom: '1rem'
          }}
        >Login to Dashboard</button>

        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
            fontSize: 13, cursor: 'pointer', textDecoration: 'underline'
          }}
        >Back to Caregiver Login</button>
      </div>
    </div>
  )
}
