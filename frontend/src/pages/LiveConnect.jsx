import React, { useState, useEffect } from 'react'

export default function LiveConnect({ onBack, profile }) {
  const [messages, setMessages] = useState([
    { id: 1, type: 'sticker', content: '🌟', sender: 'Caregiver', time: '10:00 AM' },
    { id: 2, type: 'text', content: 'You are doing amazing today! I am so proud of you.', sender: 'Mom', time: '11:30 AM' },
    { id: 3, type: 'sticker', content: '🎉', sender: 'Therapist', time: '1:00 PM' }
  ])

  // In a real app, we would fetch these from a database
  useEffect(() => {
    const saved = localStorage.getItem(`live_messages_${profile?.id}`)
    if (saved) setMessages(JSON.parse(saved))
  }, [profile])

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a1a', color: 'white',
      padding: '2rem', display: 'flex', flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem' }}>
        <button 
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
            padding: '12px 20px', borderRadius: 14, cursor: 'pointer', marginRight: '1.5rem'
          }}
        >← Back</button>
        <h2 style={{ margin: 0 }}>👨‍👩‍👧‍👦 Live Connect</h2>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '3rem' }}>
        Messages and stickers from your support team 💖
      </p>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: '1.5rem',
        maxWidth: 600, margin: '0 auto', width: '100%'
      }}>
        {messages.map(m => (
          <div key={m.id} style={{
            background: 'rgba(255,255,255,0.03)', padding: '1.8rem',
            borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)',
            position: 'relative'
          }}>
            <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 8 }}>{m.sender} • {m.time}</div>
            {m.type === 'sticker' ? (
              <div style={{ fontSize: 60, textAlign: 'center' }}>{m.content}</div>
            ) : (
              <div style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.5 }}>"{m.content}"</div>
            )}
          </div>
        ))}
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '4rem' }}>
            No messages yet. They will appear here! ✨
          </div>
        )}
      </div>

      <div style={{ marginTop: 'auto', padding: '2rem', textAlign: 'center' }}>
        <div style={{ 
          background: 'rgba(159,122,234,0.1)', border: '1px dashed rgba(159,122,234,0.3)',
          padding: '20px', borderRadius: 24, color: '#9f7aea', fontSize: 14
        }}>
           Caregivers can send messages from the **Insights** page.
        </div>
      </div>
    </div>
  )
}
