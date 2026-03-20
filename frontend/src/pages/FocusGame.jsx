import React, { useState, useEffect } from 'react'

const COLORS = ['#63b3ed', '#9f7aea', '#f6ad55', '#68d391', '#fc8181']
const BUBBLE_COUNT = 15

export default function FocusGame({ onBack, isDark }) {
  const [bubbles, setBubbles] = useState([])
  const [score, setScore] = useState(0) // Internal state, we won't show it prominently to avoid competition

  useEffect(() => {
    const initialBubbles = Array.from({ length: BUBBLE_COUNT }).map((_, i) => createBubble(i))
    setBubbles(initialBubbles)
  }, [])

  const createBubble = (id) => ({
    id,
    x: Math.random() * 80 + 10,
    y: 110,
    size: Math.random() * 60 + 40,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    speed: Math.random() * 2 + 1,
    delay: Math.random() * 5
  })

  const popBubble = (id) => {
    // Play a gentle sound
    const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-37a.mp3') // Soft tinkle
    audio.volume = 0.3
    audio.play()

    setBubbles(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b))
    setScore(s => s + 1)

    // Respawn after animation
    setTimeout(() => {
      setBubbles(prev => prev.map(b => b.id === id ? { ...createBubble(id), y: 110 } : b))
    }, 600)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#0a0a1a' : '#f0f4ff',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <button 
        onClick={onBack}
        style={{
          position: 'absolute', top: 20, left: 20, zIndex: 10,
          background: 'rgba(255,255,255,0.1)', border: 'none', color: isDark ? 'white' : '#1a202c',
          padding: '10px 20px', borderRadius: 12, cursor: 'pointer', fontWeight: 600
        }}
      >← Back</button>

      <div style={{ textAlign: 'center', paddingTop: '4rem', pointerEvents: 'none' }}>
        <h1 style={{ 
          fontSize: 32, color: isDark ? 'white' : '#1a202c', opacity: 0.6,
          background: 'linear-gradient(90deg, #63b3ed, #9f7aea)', 
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          fontWeight: 800
        }}>Zen Bubbles</h1>
        <p style={{ color: isDark ? 'rgba(255,255,255,0.4)' : '#718096' }}>Gentle Focus & Play</p>
      </div>

      {bubbles.map(b => (
        <div
          key={b.id}
          onClick={() => popBubble(b.id)}
          style={{
            position: 'absolute',
            left: `${b.x}%`,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            background: b.color,
            opacity: b.popped ? 0 : 0.4,
            border: `2px solid ${b.color}`,
            boxShadow: `inset -10px -10px 20px rgba(255,255,255,0.2), 0 0 20px ${b.color}44`,
            cursor: 'pointer',
            transform: b.popped ? 'scale(2)' : 'scale(1)',
            transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
            animation: `floatUp ${10/b.speed}s linear infinite`,
            animationDelay: `${b.delay}s`
          }}
        />
      ))}

      <style>{`
        @keyframes floatUp {
          from { bottom: -100px; transform: translateX(0); }
          50% { transform: translateX(20px); }
          to { bottom: 110%; transform: translateX(-20px); }
        }
      `}</style>
    </div>
  )
}
