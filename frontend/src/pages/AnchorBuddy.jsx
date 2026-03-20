import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

export default function AnchorBuddy({ onBack, profile, language }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi ${profile?.childName || 'there'}! I'm your Anchor Buddy. How are you feeling today?` }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMsg = { role: 'user', content: input }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const history = newMessages.slice(-5).map(m => ({
        role: m.role,
        content: m.content
      }))

      const res = await axios.post('http://localhost:5000/api/generate', {
        isBuddy: true,
        userMessage: input,
        history,
        childName: profile?.childName,
        age: profile?.age,
        favoriteThing: profile?.favoriteThing,
        language: language || 'english'
      })

      setMessages([...newMessages, { role: 'assistant', content: res.data.reply }])
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: "I'm a little sleepy right now. Let's talk later!" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a1a', color: 'white',
      display: 'flex', flexDirection: 'column', padding: '1rem',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button 
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
            padding: '10px 15px', borderRadius: 12, cursor: 'pointer', marginRight: '1rem'
          }}
        >← Back</button>
        <h2 style={{ margin: 0 }}>🤖 Anchor Buddy</h2>
      </div>

      <div style={{
        flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 24,
        padding: '1.5rem', overflowY: 'auto', marginBottom: '1rem',
        display: 'flex', flexDirection: 'column', gap: '1rem',
        border: '1px solid rgba(159,122,234,0.1)'
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
            padding: '12px 18px',
            borderRadius: m.role === 'user' ? '20px 20px 2px 20px' : '20px 20px 20px 2px',
            background: m.role === 'user' ? '#63b3ed' : 'rgba(159,122,234,0.2)',
            color: 'white',
            fontSize: 15,
            lineHeight: 1.4,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            {m.content}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
            Buddy is thinking...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type something to your buddy..."
          style={{
            flex: 1, padding: '15px 20px', borderRadius: 16,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'white', fontSize: 15, outline: 'none'
          }}
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          style={{
            background: '#9f7aea', color: 'white', border: 'none',
            padding: '0 25px', borderRadius: 16, cursor: 'pointer',
            fontWeight: 700, fontSize: 15
          }}
        >Send</button>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: 10 }}>
        {['😊', '🎮', '🍕', '🐱', '🌈'].map(emoji => (
          <button 
            key={emoji}
            onClick={() => setInput(prev => prev + emoji)}
            style={{
              background: 'rgba(255,255,255,0.05)', border: 'none',
              fontSize: 20, padding: 8, borderRadius: 10, cursor: 'pointer'
            }}
          >{emoji}</button>
        ))}
      </div>
    </div>
  )
}
