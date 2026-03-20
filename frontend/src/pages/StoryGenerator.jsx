import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function StoryGenerator({ profile, onBack, language, isDark }) {
  const [loading, setLoading] = useState(false)
  const [story, setStory] = useState('')
  const [audioUrl, setAudioUrl] = useState('')

  const generateStory = async () => {
    setLoading(true)
    setAudioUrl('')
    try {
      const genRes = await axios.post('http://localhost:5000/api/generate', {
        childName: profile.childName,
        favoriteThing: profile.favoriteThing,
        language: language,
        isStory: true
      })
      
      const storyText = genRes.data.script
      setStory(storyText)
 
      const speakRes = await axios.post('http://localhost:5000/api/speak', {
        text: storyText,
        voiceId: profile.voiceId,
        style: profile.voiceStyle
      })
      
      setAudioUrl(speakRes.data.audioUrl)
      new Audio(speakRes.data.audioUrl).play()
    } catch (err) {
      console.error('Story failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const bgColor = isDark ? '#0a0a1a' : '#f7fafc'
  const textColor = isDark ? 'white' : '#1a202c'
  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : 'white'

  return (
    <div style={{
      minHeight: '100vh', background: bgColor, color: textColor,
      padding: '2rem 1.5rem', fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: '#63b3ed',
          fontSize: 16, cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: 8
        }}>← Back</button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📖</div>
          <h1 style={{
            fontSize: 28, background: 'linear-gradient(90deg, #9f7aea, #63b3ed)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800
          }}>AI Story Companion</h1>
          <p style={{ color: isDark ? 'rgba(255,255,255,0.4)' : '#718096' }}>
            A personalized therapeutic story just for {profile.childName}
          </p>
        </div>

        <button 
          onClick={generateStory}
          disabled={loading}
          style={{
            width: '100%', padding: '18px', borderRadius: 20,
            background: 'linear-gradient(90deg, #9f7aea, #63b3ed)',
            border: 'none', color: 'white', fontWeight: 700, fontSize: 16,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 10px 20px rgba(159,122,234,0.3)',
            marginBottom: '2rem'
          }}
        >
          {loading ? '✨ Writing Magic Story...' : '✨ Create New Story'}
        </button>

        {story && (
          <div style={{
            background: cardBg, borderRadius: 24, padding: '2rem',
            border: '1px solid rgba(159,122,234,0.3)',
            animation: 'fadeIn 0.5s ease'
          }}>
            <p style={{
              lineHeight: 1.8, fontSize: 16, whiteSpace: 'pre-wrap',
              fontFamily: 'Georgia, serif', fontStyle: 'italic'
            }}>
              "{story}"
            </p>
            
            {audioUrl && (
              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>🔊</div>
                <p style={{ fontSize: 12, color: '#9f7aea' }}>Playing Story Narration...</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
