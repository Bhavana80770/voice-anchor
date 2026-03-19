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

const OrbitBalls = () => (
  <div style={{
    position: 'fixed', top: 0, left: 0,
    width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: 0, overflow: 'hidden'
  }}>
    {[...Array(6)].map((_, i) => (
      <div key={i} style={{
        position: 'absolute',
        width: '14px', height: '14px',
        borderRadius: '50%',
        top: `${10 + i * 15}%`,
        left: `${5 + i * 15}%`,
        background: FIREWORK_COLORS[i],
        boxShadow: `0 0 12px 4px ${FIREWORK_COLORS[i]}`,
        animation: `orbitBall ${4 + i}s ease-in-out infinite alternate`,
        animationDelay: `${i * 0.5}s`
      }} />
    ))}
  </div>
)

export default function Setup({ onSave, caregiverName }) {
  const [form, setForm] = useState({
    childName: '',
    age: '',
    favoriteThing: '',
    photo: null
  })
  const [preview, setPreview] = useState(null)

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
      setForm({ ...form, photo: reader.result })
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!form.childName || !form.favoriteThing) {
      alert('Please fill in child name and favourite thing!')
      return
    }
    onSave(form)
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
      <OrbitBalls />

      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 24, padding: '2.5rem',
        width: '100%', maxWidth: 460,
        position: 'relative', zIndex: 1,
        animation: 'fadeIn 0.8s ease'
      }}>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            fontSize: 48, marginBottom: 12,
            animation: 'float 3s ease-in-out infinite',
            display: 'inline-block'
          }}>🎙️</div>
          <h1 style={{
            fontSize: 28, fontWeight: 700,
            background: 'linear-gradient(90deg, #63b3ed, #9f7aea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 8
          }}>Voice Anchor</h1>
          {caregiverName && (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
              Welcome, {caregiverName}! 👋 Setup your child's profile
            </p>
          )}
        </div>

        {/* Photo upload */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            onClick={() => document.getElementById('photoInput').click()}
            style={{
              width: 100, height: 100,
              borderRadius: '50%', margin: '0 auto 12px',
              background: preview
                ? 'transparent'
                : 'rgba(99,179,237,0.1)',
              border: '2px dashed rgba(99,179,237,0.4)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer', overflow: 'hidden',
              transition: 'all 0.3s'
            }}
          >
            {preview ? (
              <img
                src={preview}
                alt="Child"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ fontSize: 36 }}>📷</span>
            )}
          </div>
          <input
            id="photoInput"
            type="file"
            accept="image/*"
            onChange={handlePhoto}
            style={{ display: 'none' }}
          />
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
            {preview ? 'Tap photo to change' : 'Tap to add child photo'}
          </p>
        </div>

        {/* Inputs */}
        <label style={labelStyle}>Child's Name</label>
        <input
          placeholder="e.g. Arjun"
          value={form.childName}
          onChange={e => setForm({ ...form, childName: e.target.value })}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#63b3ed'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />

        <label style={labelStyle}>Age</label>
        <input
          placeholder="e.g. 7"
          value={form.age}
          onChange={e => setForm({ ...form, age: e.target.value })}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#63b3ed'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />

        <label style={labelStyle}>Favourite Thing</label>
        <input
          placeholder="e.g. dinosaurs, trains, Doraemon"
          value={form.favoriteThing}
          onChange={e => setForm({ ...form, favoriteThing: e.target.value })}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#63b3ed'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />

        <button
          onClick={handleSave}
          style={btnStyle}
          onMouseEnter={e => e.target.style.opacity = '0.85'}
          onMouseLeave={e => e.target.style.opacity = '1'}
        >
          Let's Go! 🚀
        </button>
      </div>

      <style>{`
        @keyframes riseBubble {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-110vh) scale(1.2); opacity: 0; }
        }
        @keyframes orbitBall {
          0% { transform: translate(0px, 0px) scale(1); opacity: 0.6; }
          50% { transform: translate(60px, 40px) scale(1.3); opacity: 1; }
          100% { transform: translate(120px, -30px) scale(0.8); opacity: 0.4; }
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

const btnStyle = {
  background: 'linear-gradient(90deg, #63b3ed, #9f7aea)',
  color: 'white', border: 'none',
  padding: '15px 32px', borderRadius: 14,
  fontSize: 16, fontWeight: 700,
  cursor: 'pointer', width: '100%',
  marginTop: 8, transition: 'opacity 0.2s',
  letterSpacing: 0.5
}