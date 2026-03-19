import { useState, useEffect } from 'react'

const BADGES = [
  { stars: 1, badge: '🌟', title: 'First Step!', color: '#f6ad55' },
  { stars: 3, badge: '⭐', title: 'Getting Better!', color: '#63b3ed' },
  { stars: 5, badge: '🏆', title: 'Superstar!', color: '#9f7aea' },
  { stars: 10, badge: '👑', title: 'Champion!', color: '#fc8181' },
  { stars: 20, badge: '🎯', title: 'Master!', color: '#68d391' },
]

export default function Rewards({ sessions, onBack }) {
  const stars = sessions.length
  const currentBadge = BADGES.filter(b => stars >= b.stars).pop() || null
  const nextBadge = BADGES.find(b => stars < b.stars)
  const progress = nextBadge
    ? ((stars - (currentBadge?.stars || 0)) / (nextBadge.stars - (currentBadge?.stars || 0))) * 100
    : 100

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '2rem 1rem',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{ maxWidth: 500, margin: '0 auto', zIndex: 1, position: 'relative' }}>

        <button onClick={onBack} style={{
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white', padding: '10px 20px',
          borderRadius: 12, cursor: 'pointer',
          marginBottom: '1.5rem', fontSize: 14
        }}>← Back</button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: 56, marginBottom: 12, animation: 'float 3s ease-in-out infinite', display: 'inline-block' }}>
            {currentBadge ? currentBadge.badge : '🌱'}
          </div>
          <h2 style={{
            background: 'linear-gradient(90deg, #f6ad55, #fc8181)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: 24, marginBottom: 8
          }}>
            {currentBadge ? currentBadge.title : 'Just Starting!'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
            You have earned <span style={{ color: '#f6ad55', fontWeight: 700 }}>{stars} ⭐ stars</span>
          </p>
        </div>

        {/* Progress to next badge */}
        {nextBadge && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16, padding: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                Next badge: {nextBadge.badge} {nextBadge.title}
              </span>
              <span style={{ color: '#f6ad55', fontSize: 13, fontWeight: 700 }}>
                {stars}/{nextBadge.stars} ⭐
              </span>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 8, height: 12, overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #f6ad55, #fc8181)',
                borderRadius: 8,
                transition: 'width 1s ease'
              }} />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 8, textAlign: 'center' }}>
              {nextBadge.stars - stars} more routines to unlock next badge!
            </p>
          </div>
        )}

        {/* All badges */}
        <h3 style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 12, letterSpacing: 1 }}>
          ALL BADGES
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {BADGES.map((b, i) => (
            <div key={i} style={{
              background: stars >= b.stars
                ? `rgba(${b.color.replace('#','').match(/.{2}/g).map(x=>parseInt(x,16)).join(',')}, 0.15)`
                : 'rgba(255,255,255,0.03)',
              border: `1px solid ${stars >= b.stars ? b.color + '66' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 16, padding: '1rem',
              textAlign: 'center',
              opacity: stars >= b.stars ? 1 : 0.4,
              transition: 'all 0.3s'
            }}>
              <div style={{ fontSize: 36, marginBottom: 6 }}>{b.badge}</div>
              <div style={{
                color: stars >= b.stars ? b.color : 'rgba(255,255,255,0.4)',
                fontWeight: 700, fontSize: 13, marginBottom: 4
              }}>{b.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                {b.stars} ⭐ needed
              </div>
              {stars >= b.stars && (
                <div style={{
                  marginTop: 6, fontSize: 11,
                  color: b.color, fontWeight: 600
                }}>✅ Unlocked!</div>
              )}
            </div>
          ))}
        </div>

        {/* Stars history */}
        {sessions.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16, padding: '1.25rem',
            marginTop: '1.5rem'
          }}>
            <h3 style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 12, letterSpacing: 1 }}>
              RECENT ACHIEVEMENTS
            </h3>
            {sessions.slice(0, 5).map((s, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '8px 0',
                borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none'
              }}>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                  {s.routine}
                </span>
                <span style={{ color: '#f6ad55', fontSize: 13 }}>⭐ +1</span>
              </div>
            ))}
          </div>
        )}

      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}