import { useState, useEffect } from 'react'
import axios from 'axios'

const DEFAULT_ROUTINES = [
  { label: 'Stop Playtime', emoji: '🧸' },
  { label: 'Brush Teeth', emoji: '🪥' },
  { label: 'Leave House', emoji: '👟' },
  { label: 'Eat Food', emoji: '🍽️' },
  { label: 'Bedtime', emoji: '🌙' },
]

const LANGUAGES = [
  { code: 'english', label: 'English', flag: '🇬🇧' },
  { code: 'hindi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'telugu', label: 'తెలుగు', flag: '🌟' },
  { code: 'tamil', label: 'தமிழ்', flag: '🌺' },
  { code: 'kannada', label: 'ಕನ್ನಡ', flag: '🌸' },
  { code: 'malayalam', label: 'മലയാളം', flag: '🌴' },
  { code: 'marathi', label: 'मराठी', flag: '🎯' },
  { code: 'gujarati', label: 'ગુજરાતી', flag: '🦁' },
  { code: 'bengali', label: 'বাংলা', flag: '🌿' },
  { code: 'punjabi', label: 'ਪੰਜਾਬੀ', flag: '🌾' },
]

const FIREWORK_COLORS = ['#63b3ed','#9f7aea','#f6ad55','#68d391','#fc8181','#f687b3','#76e4f7']
const CALM_MUSIC_URL = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'

const Bubbles = ({ isDark }) => (
  <div style={{
    position: 'fixed', top: 0, left: 0,
    width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: -1, overflow: 'hidden'
  }}>
    {[...Array(25)].map((_, i) => {
      const size = Math.random() * 60 + 20
      return (
        <div key={i} style={{
          position: 'absolute',
          width: size + 'px', height: size + 'px',
          borderRadius: '50%', bottom: '-100px',
          left: Math.random() * 100 + '%',
          background: `rgba(${Math.random() > 0.5 ? '99,179,237' : '159,122,234'}, ${isDark ? Math.random() * 0.15 + 0.05 : Math.random() * 0.2 + 0.1})`,
          border: `1px solid rgba(${Math.random() > 0.5 ? '99,179,237' : '159,122,234'}, 0.3)`,
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
    pointerEvents: 'none', zIndex: -1, overflow: 'hidden'
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

const Fireworks = ({ particles }) => (
  <div style={{
    position: 'fixed', top: 0, left: 0,
    width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: 99
  }}>
    {particles.map((p, i) => (
      <div key={i} style={{
        position: 'absolute',
        width: p.size + 'px', height: p.size + 'px',
        borderRadius: '50%',
        top: p.top + '%', left: p.left + '%',
        background: p.color,
        animation: `firework${p.dir} ${p.duration}s ease-out forwards`,
        animationDelay: p.delay + 's',
        opacity: 0
      }} />
    ))}
  </div>
)

const generateParticles = () =>
  [...Array(40)].map(() => ({
    size: Math.random() * 8 + 4,
    top: Math.random() * 70 + 10,
    left: Math.random() * 90 + 5,
    color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
    duration: Math.random() * 1 + 0.8,
    delay: Math.random() * 1.5,
    dir: Math.floor(Math.random() * 4) + 1
  }))

export default function Home({
  profile, caregiverName, sessions, addSession, selectedEmotion,
  pendingRoutine, onPendingRoutineDone,
  onGoToRoutines, onGoToEmotions, onGoToProgress,
  onGoToRewards, onGoToSchedule, onGoToSOS, onLogout, onReset
}) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [audioUrl, setAudioUrl] = useState(null)
  const [active, setActive] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [language, setLanguage] = useState('english')
  const [ripples, setRipples] = useState([])
  const [fireworkParticles, setFireworkParticles] = useState([])
  const [showFireworks, setShowFireworks] = useState(false)
  const [glowBtn, setGlowBtn] = useState(null)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [bgMusic, setBgMusic] = useState(null)
  const [showVoiceInput, setShowVoiceInput] = useState(false)
  const [voiceText, setVoiceText] = useState('')
  const [isDark, setIsDark] = useState(true)

  const customRoutines = JSON.parse(localStorage.getItem('customRoutines')) || []
  const allRoutines = [...DEFAULT_ROUTINES, ...customRoutines]

  const textColor = isDark ? 'white' : '#1a1a2e'
  const mutedColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)'
  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)'
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(99,179,237,0.3)'

  useEffect(() => {
    if (pendingRoutine) {
      handleRoutine(pendingRoutine)
      onPendingRoutineDone()
    }
  }, [pendingRoutine])

  const toggleMusic = () => {
    if (!bgMusic) {
      const audio = new Audio(CALM_MUSIC_URL)
      audio.loop = true
      audio.volume = 0.15
      audio.play()
      setBgMusic(audio)
      setIsMusicPlaying(true)
    } else {
      if (isMusicPlaying) {
        bgMusic.pause()
        setIsMusicPlaying(false)
      } else {
        bgMusic.play()
        setIsMusicPlaying(true)
      }
    }
  }

  const addRipple = (e, routineLabel) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples(prev => [...prev, { x, y, id, label: routineLabel }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 800)
  }

  const triggerFireworks = () => {
    setFireworkParticles(generateParticles())
    setShowFireworks(true)
    setTimeout(() => setShowFireworks(false), 3000)
  }

  const handleRoutine = async (routine) => {
    setLoading(true)
    setActive(routine.label)
    setGlowBtn(routine.label)
    setMessage('')
    setAudioUrl(null)
    setIsPlaying(false)

    const emotionContext = selectedEmotion
      ? `The child is feeling ${selectedEmotion.label}.`
      : ''

    try {
      const { data: genData } = await axios.post('http://localhost:5000/api/generate', {
        childName: profile.childName,
        age: profile.age,
        favoriteThing: profile.favoriteThing,
        transition: routine.label,
        language: language,
        emotionContext: emotionContext
      })

      setMessage(genData.script)
      triggerFireworks()

      addSession({
        time: new Date().toLocaleTimeString(),
        routine: routine.label,
        message: genData.script,
        language: language,
        emotion: selectedEmotion?.label || 'neutral'
      })

      const { data: speakData } = await axios.post('http://localhost:5000/api/speak', {
        text: genData.script
      })

      setAudioUrl(speakData.audioUrl)
      setIsPlaying(true)

      const audio = new Audio(speakData.audioUrl)
      audio.play()
      audio.onended = () => setIsPlaying(false)

    } catch (err) {
      setMessage('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark
        ? 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)'
        : 'linear-gradient(135deg, #e8f4fd 0%, #f0f4ff 50%, #e8f0fe 100%)',
      padding: '2rem 1rem', fontFamily: 'Segoe UI, sans-serif',
      transition: 'background 0.5s ease'
    }}>
      <Bubbles isDark={isDark} />
      <OrbitBalls />
      {showFireworks && <Fireworks particles={fireworkParticles} />}

      <div style={{ maxWidth: 500, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', animation: 'fadeIn 0.8s ease' }}>
          <div style={{ marginBottom: 8 }}>
            {profile.photo ? (
              <img
                src={profile.photo}
                alt={profile.childName}
                style={{
                  width: 80, height: 80,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #63b3ed',
                  boxShadow: '0 0 20px rgba(99,179,237,0.4)',
                  animation: 'float 3s ease-in-out infinite'
                }}
              />
            ) : (
              <div style={{
                fontSize: 40,
                animation: 'float 3s ease-in-out infinite',
                display: 'inline-block'
              }}>🎙️</div>
            )}
          </div>
          <h1 style={{
            fontSize: 26, fontWeight: 700,
            background: 'linear-gradient(90deg, #63b3ed, #9f7aea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent', marginBottom: 4
          }}>Hi, {profile.childName}! 👋</h1>
          <p style={{ color: mutedColor, fontSize: 14 }}>
            What are we doing now?
          </p>
          <p style={{ color: mutedColor, fontSize: 12, marginTop: 4 }}>
            Caregiver: {caregiverName} 👤
          </p>
          {selectedEmotion && (
            <div style={{
              display: 'inline-block', marginTop: 8,
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: 20, padding: '4px 14px',
              fontSize: 13, color: textColor
            }}>
              Feeling: {selectedEmotion.emoji} {selectedEmotion.label}
            </div>
          )}
        </div>

        {/* Row 1 buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
          <button onClick={onGoToEmotions} style={{
            background: 'rgba(246,173,85,0.1)',
            border: '1px solid rgba(246,173,85,0.3)',
            color: '#f6ad55', padding: '10px 8px',
            borderRadius: 12, cursor: 'pointer',
            fontSize: 12, fontWeight: 600
          }}>😊 Emotions</button>
          <button onClick={onGoToRoutines} style={{
            background: 'rgba(159,122,234,0.1)',
            border: '1px solid rgba(159,122,234,0.3)',
            color: '#9f7aea', padding: '10px 8px',
            borderRadius: 12, cursor: 'pointer',
            fontSize: 12, fontWeight: 600
          }}>⚙️ Routines</button>
          <button onClick={onGoToProgress} style={{
            background: 'rgba(104,211,145,0.1)',
            border: '1px solid rgba(104,211,145,0.3)',
            color: '#68d391', padding: '10px 8px',
            borderRadius: 12, cursor: 'pointer',
            fontSize: 12, fontWeight: 600
          }}>📊 Progress</button>
        </div>

        {/* Row 2 buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: '1.5rem' }}>
          <button onClick={onGoToRewards} style={{
            background: 'rgba(246,173,85,0.1)',
            border: '1px solid rgba(246,173,85,0.3)',
            color: '#f6ad55', padding: '10px 8px',
            borderRadius: 12, cursor: 'pointer',
            fontSize: 12, fontWeight: 600
          }}>⭐ Rewards</button>
          <button onClick={onGoToSchedule} style={{
            background: 'rgba(99,179,237,0.1)',
            border: '1px solid rgba(99,179,237,0.3)',
            color: '#63b3ed', padding: '10px 8px',
            borderRadius: 12, cursor: 'pointer',
            fontSize: 12, fontWeight: 600
          }}>📅 Schedule</button>
          <button onClick={onGoToSOS} style={{
            background: 'rgba(252,129,129,0.1)',
            border: '1px solid rgba(252,129,129,0.3)',
            color: '#fc8181', padding: '10px 8px',
            borderRadius: 12, cursor: 'pointer',
            fontSize: 12, fontWeight: 600,
            animation: 'sosPulse 2s infinite'
          }}>🚨 SOS</button>
        </div>

        {/* Language selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{
            color: mutedColor, fontSize: 12,
            marginBottom: 8, textAlign: 'center', letterSpacing: 1
          }}>SELECT LANGUAGE</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {LANGUAGES.map(lang => (
              <button key={lang.code} onClick={() => setLanguage(lang.code)} style={{
                padding: '6px 12px', borderRadius: 20,
                border: language === lang.code
                  ? '1.5px solid #63b3ed'
                  : `1px solid ${cardBorder}`,
                background: language === lang.code
                  ? 'rgba(99,179,237,0.2)'
                  : cardBg,
                color: language === lang.code ? '#63b3ed' : mutedColor,
                fontSize: 12, cursor: 'pointer',
                fontWeight: language === lang.code ? 700 : 400,
                transition: 'all 0.2s'
              }}>
                {lang.flag} {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Breathing animation */}
        {isPlaying && (
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: 'linear-gradient(135deg, #63b3ed, #9f7aea)',
              margin: '0 auto',
              animation: 'breathe 4s ease-in-out infinite',
              boxShadow: '0 0 30px rgba(99,179,237,0.4)'
            }} />
            <p style={{ color: mutedColor, fontSize: 13, marginTop: 10 }}>
              Take a deep breath... 🌬️
            </p>
          </div>
        )}

        {/* Background music */}
        <button onClick={toggleMusic} style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 10,
          width: '100%', padding: '12px',
          borderRadius: 16, marginBottom: 8,
          cursor: 'pointer',
          background: isMusicPlaying ? 'rgba(104,211,145,0.15)' : cardBg,
          border: isMusicPlaying
            ? '1px solid rgba(104,211,145,0.4)'
            : `1px solid rgba(159,122,234,0.3)`,
        }}>
          <span style={{ fontSize: 18 }}>{isMusicPlaying ? '🎵' : '🎶'}</span>
          <span style={{
            color: isMusicPlaying ? '#68d391' : '#9f7aea',
            fontWeight: 600, fontSize: 13
          }}>
            {isMusicPlaying ? 'Calming music ON — tap to stop' : 'Tap for calming background music'}
          </span>
        </button>

        {/* Voice input */}
        <button
          onClick={() => setShowVoiceInput(!showVoiceInput)}
          style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 10,
            width: '100%', padding: '14px',
            borderRadius: 16, marginBottom: 8,
            cursor: 'pointer',
            background: showVoiceInput ? 'rgba(252,129,129,0.2)' : cardBg,
            border: showVoiceInput
              ? '1.5px solid #fc8181'
              : '1px solid rgba(99,179,237,0.3)',
          }}
        >
          <span style={{ fontSize: 20 }}>🎤</span>
          <span style={{
            color: showVoiceInput ? '#fc8181' : '#63b3ed',
            fontWeight: 600, fontSize: 14
          }}>
            {showVoiceInput ? 'Close voice input' : 'Tap to speak your routine'}
          </span>
        </button>

        {showVoiceInput && (
          <div style={{
            background: cardBg,
            border: `1px solid rgba(99,179,237,0.3)`,
            borderRadius: 16, padding: '1rem',
            marginBottom: '1rem',
            animation: 'fadeIn 0.3s ease'
          }}>
            <p style={{ color: mutedColor, fontSize: 12, marginBottom: 8 }}>
              Type your routine and press Enter or Go ▶
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                placeholder="e.g. Take Medicine, Bath Time..."
                value={voiceText}
                onChange={e => setVoiceText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && voiceText.trim()) {
                    handleRoutine({ label: voiceText, emoji: '🎤' })
                    setVoiceText('')
                    setShowVoiceInput(false)
                  }
                }}
                style={{
                  flex: 1, padding: '10px 14px',
                  borderRadius: 10,
                  border: `1px solid ${cardBorder}`,
                  background: isDark ? 'rgba(255,255,255,0.07)' : 'white',
                  color: textColor, fontSize: 14, outline: 'none'
                }}
              />
              <button
                onClick={() => {
                  if (voiceText.trim()) {
                    handleRoutine({ label: voiceText, emoji: '🎤' })
                    setVoiceText('')
                    setShowVoiceInput(false)
                  }
                }}
                style={{
                  background: 'linear-gradient(90deg, #63b3ed, #9f7aea)',
                  border: 'none', color: 'white',
                  padding: '10px 16px', borderRadius: 10,
                  cursor: 'pointer', fontWeight: 700, fontSize: 14
                }}
              >Go ▶</button>
            </div>
          </div>
        )}

        {/* Routine buttons */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 12, marginBottom: '1.5rem'
        }}>
          {allRoutines.map(r => (
            <button
              key={r.label}
              onClick={(e) => { addRipple(e, r.label); handleRoutine(r) }}
              disabled={loading}
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', padding: '22px 12px',
                borderRadius: 18,
                cursor: loading ? 'not-allowed' : 'pointer',
                gap: 10, position: 'relative', overflow: 'hidden',
                background: active === r.label
                  ? 'linear-gradient(135deg, rgba(99,179,237,0.3), rgba(159,122,234,0.3))'
                  : cardBg,
                border: active === r.label
                  ? '1.5px solid rgba(99,179,237,0.8)'
                  : `1px solid ${cardBorder}`,
                boxShadow: glowBtn === r.label
                  ? '0 0 20px rgba(99,179,237,0.6), 0 0 40px rgba(159,122,234,0.3)'
                  : 'none',
                transition: 'all 0.3s',
                opacity: loading && active !== r.label ? 0.5 : 1
              }}
            >
              {ripples.filter(rip => rip.label === r.label).map(rip => (
                <span key={rip.id} style={{
                  position: 'absolute',
                  left: rip.x - 50, top: rip.y - 50,
                  width: 100, height: 100, borderRadius: '50%',
                  background: 'rgba(99,179,237,0.4)',
                  animation: 'ripple 0.8s ease-out forwards',
                  pointerEvents: 'none'
                }} />
              ))}
              <span style={{ fontSize: 38, animation: 'float 3s ease-in-out infinite', display: 'inline-block' }}>
                {r.emoji}
              </span>
              <span style={{
                fontSize: 13,
                color: active === r.label ? '#63b3ed' : textColor,
                fontWeight: 600, textAlign: 'center'
              }}>{r.label}</span>
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', margin: '1rem 0', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: '#63b3ed',
                  animation: 'bounce 0.8s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`
                }} />
              ))}
            </div>
            <p style={{ color: '#63b3ed', fontSize: 14 }}>✨ Getting your message ready...</p>
          </div>
        )}

        {/* Message box */}
        {message && !loading && (
          <div style={{
            background: cardBg,
            border: '1px solid rgba(99,179,237,0.3)',
            borderRadius: 18, padding: '1.25rem',
            marginBottom: '1rem', animation: 'fadeIn 0.5s ease'
          }}>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: textColor, marginBottom: 12 }}>
              {message}
            </p>
            {audioUrl && (
              <audio controls src={audioUrl} style={{ width: '100%', borderRadius: 8 }} />
            )}
          </div>
        )}

        {/* Calm button */}
        <button
          onClick={(e) => {
            addRipple(e, 'calm')
            handleRoutine({ label: 'calm down, everything is okay', emoji: '💙' })
          }}
          style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 12,
            background: 'rgba(99,179,237,0.1)',
            border: '1px solid rgba(99,179,237,0.4)',
            width: '100%', padding: '18px', borderRadius: 18,
            marginTop: 8, cursor: 'pointer',
            position: 'relative', overflow: 'hidden',
            animation: 'heartbeat 1.5s ease-in-out infinite'
          }}
        >
          <span style={{ fontSize: 26 }}>💙</span>
          <span style={{ color: '#63b3ed', fontWeight: 700, fontSize: 15 }}>
            I need to calm down
          </span>
        </button>

        {/* Bottom */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginTop: 20
        }}>
          <button onClick={onReset} style={{
            background: 'none', border: 'none',
            color: mutedColor, fontSize: 12, cursor: 'pointer'
          }}>Change profile</button>

          <button onClick={() => setIsDark(!isDark)} style={{
            background: isDark ? 'rgba(246,173,85,0.1)' : 'rgba(99,179,237,0.1)',
            border: isDark ? '1px solid rgba(246,173,85,0.3)' : '1px solid rgba(99,179,237,0.3)',
            color: isDark ? '#f6ad55' : '#63b3ed',
            fontSize: 12, padding: '6px 14px',
            borderRadius: 8, cursor: 'pointer'
          }}>
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>

          <button onClick={onLogout} style={{
            background: 'rgba(252,129,129,0.1)',
            border: '1px solid rgba(252,129,129,0.3)',
            color: '#fc8181', fontSize: 12,
            padding: '6px 14px', borderRadius: 8, cursor: 'pointer'
          }}>🚪 Logout</button>
        </div>

      </div>

      <style>{`
        @keyframes riseBubble {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 1; } 90% { opacity: 0.5; }
          100% { transform: translateY(-110vh) scale(1.2); opacity: 0; }
        }
        @keyframes orbitBall {
          0% { transform: translate(0px, 0px) scale(1); opacity: 0.6; }
          50% { transform: translate(60px, 40px) scale(1.3); opacity: 1; }
          100% { transform: translate(120px, -30px) scale(0.8); opacity: 0.4; }
        }
        @keyframes firework1 {
          0% { opacity: 1; transform: scale(0) translate(0,0); }
          100% { opacity: 0; transform: scale(1.5) translate(80px,-80px); }
        }
        @keyframes firework2 {
          0% { opacity: 1; transform: scale(0) translate(0,0); }
          100% { opacity: 0; transform: scale(1.5) translate(-80px,-80px); }
        }
        @keyframes firework3 {
          0% { opacity: 1; transform: scale(0) translate(0,0); }
          100% { opacity: 0; transform: scale(1.5) translate(80px,80px); }
        }
        @keyframes firework4 {
          0% { opacity: 1; transform: scale(0) translate(0,0); }
          100% { opacity: 0; transform: scale(1.5) translate(-80px,80px); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.35); opacity: 1; }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.03); }
          28% { transform: scale(1); }
          42% { transform: scale(1.03); }
          56% { transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes sosPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(252,129,129,0.3); }
          50% { box-shadow: 0 0 10px 3px rgba(252,129,129,0.1); }
        }
      `}</style>
    </div>
  )
}