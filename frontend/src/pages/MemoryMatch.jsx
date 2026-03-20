import React, { useState, useEffect } from 'react'

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼']

export default function MemoryMatch({ onBack, isDark }) {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [solved, setSolved] = useState([])
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const deck = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }))
    setCards(deck)
    setSolved([])
    setFlipped([])
  }

  const handleClick = (id) => {
    if (disabled || flipped.includes(id) || solved.includes(id)) return

    const newFlipped = [...flipped, id]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setDisabled(true)
      const [first, second] = newFlipped
      if (cards[first].emoji === cards[second].emoji) {
        setSolved([...solved, first, second])
        setFlipped([])
        setDisabled(false)
      } else {
        setTimeout(() => {
          setFlipped([])
          setDisabled(false)
        }, 1000)
      }
    }
  }

  return (
    <div style={{
      minHeight: '100vh', padding: '2rem 1.5rem',
      background: isDark ? '#0a0a1a' : '#f7fafc',
      fontFamily: 'Segoe UI, sans-serif', color: isDark ? 'white' : '#1a202c'
    }}>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: '#63b3ed',
          fontSize: 16, cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8
        }}>← Back</button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Memory Match 🧠</h1>
          <p style={{ color: isDark ? 'rgba(255,255,255,0.4)' : '#718096' }}>
            Find the matching pairs
          </p>
        </div>

        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12,
          perspective: '1000px'
        }}>
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || solved.includes(index)
            return (
              <div
                key={index}
                onClick={() => handleClick(index)}
                style={{
                  height: 80, borderRadius: 16,
                  background: isFlipped ? 'white' : (isDark ? 'rgba(255,255,255,0.05)' : '#edf2f7'),
                  border: isFlipped ? '2px solid #63b3ed' : '2px solid transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 32, cursor: 'pointer',
                  transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
                  transition: 'transform 0.5s',
                  transformStyle: 'preserve-3d',
                  boxShadow: isFlipped ? '0 4px 12px rgba(99,179,237,0.3)' : 'none'
                }}
              >
                <span style={{ 
                  display: isFlipped ? 'block' : 'none',
                  animation: 'popIn 0.3s ease'
                }}>{card.emoji}</span>
              </div>
            )
          })}
        </div>

        {solved.length === cards.length && cards.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '3rem', animation: 'fadeIn 0.5s ease' }}>
            <h2 style={{ color: '#68d391' }}>Amazing Job! 🎉</h2>
            <button 
              onClick={initializeGame}
              style={{
                marginTop: '1rem', padding: '12px 24px', borderRadius: 12,
                border: 'none', background: '#63b3ed', color: 'white',
                fontWeight: 700, cursor: 'pointer'
              }}
            >Play Again</button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
