import React, { useState } from 'react'
import axios from 'axios'

export default function SocialStory({ onBack, profile, isDark, language }) {
  const [situation, setSituation] = useState('')
  const [loading, setLoading] = useState(false)
  const [steps, setSteps] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)

  const handleGenerate = async () => {
    if (!situation.trim()) return
    setLoading(true)
    try {
      const { data } = await axios.post('http://localhost:5000/api/generate', {
        childName: profile.childName,
        age: profile.age,
        situation,
        language,
        isStory: true,
        isSocialStory: true
      })

      // Parse the numbered list
      const parsedSteps = data.script.split(/\n/).filter(line => line.match(/^\d\./)).map(line => line.replace(/^\d\.\s*/, ''))
      setSteps(parsedSteps.length ? parsedSteps : [data.script])
    } catch (err) {
      console.error('Generation failed:', err)
      alert('Could not generate story. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSpeak = async (text) => {
    setIsPlaying(true)
    try {
      const { data } = await axios.post('http://localhost:5000/api/speak', {
        text,
        voiceId: profile.voiceId || 'en-US-natalie',
        style: profile.voiceStyle || 'Calm'
      })
      const audio = new Audio(data.audioUrl)
      audio.play()
      audio.onended = () => setIsPlaying(false)
    } catch (err) {
      console.error('Speech failed:', err)
      setIsPlaying(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', padding: '2rem 1.5rem',
      background: isDark ? '#0a0a1a' : '#f7fafc',
      fontFamily: 'Segoe UI, sans-serif', color: isDark ? 'white' : '#1a202c'
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: '#63b3ed',
          fontSize: 16, cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8
        }}>← Back</button>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>AI Social Stories 📖</h1>
          <p style={{ color: isDark ? 'rgba(255,255,255,0.4)' : '#718096' }}>
            Prepare for new experiences together
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
            What are we preparing for?
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input 
              type="text"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="e.g., Going to the dentist, Haircut..."
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 12,
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                background: isDark ? 'rgba(255,255,255,0.05)' : 'white',
                color: isDark ? 'white' : 'black', outline: 'none'
              }}
            />
            <button 
              onClick={handleGenerate}
              disabled={loading}
              style={{
                padding: '0 20px', borderRadius: 12, border: 'none',
                background: '#9f7aea', color: 'white', fontWeight: 700, cursor: 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>

        {steps.length > 0 && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {steps.map((step, i) => (
                <div 
                  key={i}
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'white',
                    padding: '1.5rem', borderRadius: 16,
                    border: '1px solid rgba(159,122,234,0.2)',
                    display: 'flex', gap: 15, alignItems: 'center'
                  }}
                >
                  <div style={{
                    minWidth: 32, height: 32, borderRadius: '50%', background: '#9f7aea22',
                    color: '#9f7aea', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 14
                  }}>{i + 1}</div>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>{step}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSpeak(steps.join(' '))}
              disabled={isPlaying}
              style={{
                width: '100%', marginTop: '2rem', padding: '16px', borderRadius: 16,
                border: 'none', background: 'linear-gradient(135deg, #63b3ed, #9f7aea)',
                color: 'white', fontWeight: 800, fontSize: 16, cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(159,122,234,0.4)',
                opacity: isPlaying ? 0.7 : 1
              }}
            >
              {isPlaying ? 'Reading Aloud...' : '🗣️ Hear the Story'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
