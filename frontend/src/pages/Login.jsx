import { useState } from 'react'

const FIREWORK_COLORS = ['#63b3ed','#9f7aea','#f6ad55','#68d391','#fc8181','#f687b3','#76e4f7']

const Bubbles = () => (
  <div style={{
    position: 'fixed', top: 0, left: 0,
    width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: 0, overflow: 'hidden'
  }}>
    {[...Array(20)].map((_, i) => {
      const size = Math.random() * 60 + 20
      return (
        <div key={i} style={{
          position: 'absolute',
          width: size + 'px', height: size + 'px',
          borderRadius: '50%', bottom: '-100px',
          left: Math.random() * 100 + '%',
          background: `rgba(${Math.random() > 0.5 ? '99,179,237' : '159,122,234'}, ${Math.random() * 0.15 + 0.05})`,
          border: `1px solid rgba(${Math.random() > 0.5 ? '99,179,237' : '159,122,234'}, 0.2)`,
          animation: `riseBubble ${Math.random() * 10 + 8}s ease-in infinite`,
          animationDelay: `${Math.random() * 8}s`
        }} />
      )
    })}
  </div>
)

export default function Login({ onLogin, onGoToTherapist }) {
  const [isSignup, setIsSignup] = useState(
    !localStorage.getItem('caregiverPassword')
  )
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = () => {
    setError('')

    if (isSignup) {
      if (!name || !password || !confirmPassword) {
        setError('Please fill in all fields!')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match!')
        return
      }
      if (password.length < 4) {
        setError('Password must be at least 4 characters!')
        return
      }
      localStorage.setItem('caregiverPassword', password)
      localStorage.setItem('caregiverLoginName', name)
      onLogin(name)
    } else {
      const savedPassword = localStorage.getItem('caregiverPassword')
      if (password !== savedPassword) {
        setError('Wrong password! Please try again.')
        return
      }
      const savedName = localStorage.getItem('caregiverLoginName')
      onLogin(savedName)
    }
  }

  const handleReset = () => {
    localStorage.removeItem('caregiverPassword')
    localStorage.removeItem('caregiverLoginName')
    setIsSignup(true)
    setPassword('')
    setName('')
    setConfirmPassword('')
    setError('')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem', fontFamily: 'Segoe UI, sans-serif'
    }}>
      <Bubbles />

      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 24, padding: '2.5rem',
        width: '100%', maxWidth: 420,
        position: 'relative', zIndex: 1,
        animation: 'fadeIn 0.8s ease'
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            fontSize: 48, marginBottom: 12,
            animation: 'float 3s ease-in-out infinite',
            display: 'inline-block'
          }}>🔐</div>
          <h1 style={{
            fontSize: 24, fontWeight: 700,
            background: 'linear-gradient(90deg, #63b3ed, #9f7aea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 8
          }}>
            {isSignup ? 'Create Account' : 'Welcome Back!'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
            {isSignup ? 'Set up your caregiver account' : 'Login to Voice Anchor'}
          </p>
        </div>

        {/* Name field (signup only) */}
        {isSignup && (
          <>
            <label style={labelStyle}>Your Name</label>
            <input
              placeholder="e.g. Dad,  Mom, Teacher"
              value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#63b3ed'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </>
        )}

        {/* Password */}
        <label style={labelStyle}>Password</label>
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ ...inputStyle, marginBottom: 0, paddingRight: 48 }}
            onFocus={e => e.target.style.borderColor = '#63b3ed'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute', right: 12, top: '50%',
              transform: 'translateY(-50%)',
              background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer', fontSize: 18
            }}
          >{showPassword ? '🙈' : '👁️'}</button>
        </div>

        {/* Confirm password (signup only) */}
        {isSignup && (
          <>
            <label style={labelStyle}>Confirm Password</label>
            <input
              type="password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#63b3ed'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(252,129,129,0.1)',
            border: '1px solid rgba(252,129,129,0.3)',
            borderRadius: 10, padding: '10px 14px',
            color: '#fc8181', fontSize: 13,
            marginBottom: 16, animation: 'fadeIn 0.3s ease'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          style={{
            background: 'linear-gradient(90deg, #63b3ed, #9f7aea)',
            border: 'none', color: 'white',
            padding: '15px 32px', borderRadius: 14,
            fontSize: 16, fontWeight: 700,
            cursor: 'pointer', width: '100%',
            marginBottom: 16, transition: 'opacity 0.2s'
          }}
          onMouseEnter={e => e.target.style.opacity = '0.85'}
          onMouseLeave={e => e.target.style.opacity = '1'}
        >
          {isSignup ? 'Create Account 🚀' : 'Login →'}
        </button>

        {/* Toggle signup/login */}
        {!isSignup && (
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleReset}
              style={{
                background: 'none', border: 'none',
                color: 'rgba(255,255,255,0.3)',
                fontSize: 12, cursor: 'pointer'
              }}
            >
              Forgot password? Reset account
            </button>
          </div>
        )}

        <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center' }}>
          <button
            onClick={onGoToTherapist}
            style={{
              background: 'none', border: 'none',
              color: '#9f7aea', fontSize: 13,
              cursor: 'pointer', fontWeight: 600,
              textDecoration: 'underline'
            }}
          >
            Are you a Therapist? Login here 👨‍⚕️
          </button>
        </div>

      </div>

      <style>{`
        @keyframes riseBubble {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-110vh) scale(1.2); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: 13,
  color: 'rgba(255,255,255,0.6)',
  fontWeight: 600, marginBottom: 6,
  letterSpacing: 1, textTransform: 'uppercase'
}

const inputStyle = {
  display: 'block', width: '100%',
  padding: '14px 16px', margin: '0 0 20px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.1)',
  fontSize: 15,
  background: 'rgba(255,255,255,0.07)',
  color: 'white', outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box'
}