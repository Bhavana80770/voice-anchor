import { useState, useEffect } from 'react'
import axios from 'axios'
import { getSmartSuggestions } from '../utils/aiLearning'
import VoiceDetector from '../components/VoiceDetector'
import TherapistNotes from '../components/TherapistNotes'

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

export default function Home(props) {
  const {
    profile, caregiverName, sessions, addSession, selectedEmotion,
    pendingRoutine, onPendingRoutineDone,
    onGoToRoutines, onGoToEmotions, onGoToProgress,
    onGoToRewards, onGoToSchedule, onGoToSOS, onGoToInsights,
    onGoToTherapist, isTherapist, onGoToStory,
    onLogout, onReset,
    onGoToGame, onGoToComm, onGoToCheckIn,
    onGoToSocial, onGoToEnergy, onGoToSand, onGoToMemory,
    onGoToBuddy, onGoToMixer, onGoToChoice, onGoToSequence, onGoToLive
  } = props;
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
  const [isAutoDetectEnabled, setIsAutoDetectEnabled] = useState(false)
  const [detectionThreshold, setDetectionThreshold] = useState(50)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [timer, setTimer] = useState(0)

  // Sensory Animation Effect: "Breathing" Background
  useEffect(() => {
    if (isPlaying) {
      setTimer(30) // 30s visual cue
      const t = setInterval(() => setTimer(prev => Math.max(0, prev - 1)), 1000)
      return () => clearInterval(t)
    } else {
      setTimer(0)
    }
  }, [isPlaying])

  const customRoutines = JSON.parse(localStorage.getItem('customRoutines')) || []
  const allRoutines = [...DEFAULT_ROUTINES, ...customRoutines]

  const textColor = isDark ? 'white' : '#1a1a2e'
  const mutedColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)'
  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)'
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(99,179,237,0.3)'

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    console.log('Install button clicked, deferredPrompt:', !!deferredPrompt)
    if (!deferredPrompt) return
    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log('Install outcome:', outcome)
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
      }
    } catch (err) {
      console.error('Install prompt error:', err)
    }
  }

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
    setTimeout(() => setShowFireworks(3000))
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
      const { data: genData } = await axios.post('https://voice-anchor.onrender.com/api/generate', {
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

      const { data: speakData } = await axios.post('https://voice-anchor.onrender.com/api/speak', {
        text: genData.script,
        voiceId: profile.voiceId,
        style: profile.voiceStyle
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

  const handleAutoTrigger = () => {
    handleRoutine({ label: 'calm down, everything is okay', emoji: '💙' })
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

      {isPlaying && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '90vw', height: '90vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(159,122,234,0.15), transparent 70%)',
          zIndex: 0, animation: 'breathing 6s ease-in-out infinite'
        }} />
      )}

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
          }}>{loading ? 'Thinking...' : `Hey ${profile?.childName}, how are you today?`}</h1>
          {isTherapist && (
            <span style={{
              background: 'rgba(159,122,234,0.2)', color: '#b794f4',
              padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
              border: '1px solid rgba(159,122,234,0.3)'
            }}>THERAPIST MODE</span>
          )}
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

        {/* SECTION 1: EMOTIONAL SUPPORT */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: mutedColor, fontSize: 11, fontWeight: 800, marginBottom: 12, letterSpacing: 2 }}>EMOTIONAL SUPPORT 💙</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button onClick={onGoToEmotions} style={{
              background: 'rgba(246,173,85,0.1)', border: '1px solid rgba(246,173,85,0.3)',
              color: '#f6ad55', padding: '15px', borderRadius: 16, cursor: 'pointer', fontWeight: 700
            }}>😊 Emotions</button>
            <button onClick={onGoToCheckIn} style={{
              background: 'rgba(104,211,145,0.1)', border: '1px solid rgba(104,211,145,0.3)',
              color: '#68d391', padding: '15px', borderRadius: 16, cursor: 'pointer', fontWeight: 700
            }}>🧬 Body Check-In</button>
          </div>
          <button onClick={onGoToStory} style={{
            width: '100%', mt: 10, padding: '18px', borderRadius: 20, marginTop: 10,
            background: 'linear-gradient(90deg, #9f7aea, #63b3ed)', border: 'none', color: 'white', fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer'
          }}>📖 AI Story Companion</button>
        </div>

        <hr style={{ border: 'none', height: '1px', background: 'rgba(255,255,255,0.05)', margin: '2rem 1.5rem' }} />

        {/* SECTION 2: DAILY ESSENTIALS */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: mutedColor, fontSize: 11, fontWeight: 800, marginBottom: 12, letterSpacing: 2 }}>DAILY ESSENTIALS ✨</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            <button onClick={onGoToRoutines} style={{
              background: cardBg, border: `1px solid ${cardBorder}`, color: '#9f7aea',
              padding: '12px 5px', borderRadius: 14, cursor: 'pointer', fontSize: 11, fontWeight: 700
            }}>📂 Routines</button>
            <button onClick={onGoToSchedule} style={{
              background: cardBg, border: `1px solid ${cardBorder}`, color: '#63b3ed',
              padding: '12px 5px', borderRadius: 14, cursor: 'pointer', fontSize: 11, fontWeight: 700
            }}>📅 Schedule</button>
            <button onClick={onGoToRewards} style={{
              background: cardBg, border: `1px solid ${cardBorder}`, color: '#f6ad55',
              padding: '12px 5px', borderRadius: 14, cursor: 'pointer', fontSize: 11, fontWeight: 700
            }}>⭐ Rewards</button>
          </div>
        </div>

        {/* SECTION 3: PREPARATION & PLAY */}
        <div style={{ 
          marginBottom: '2rem', padding: '1.5rem', borderRadius: 24,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(159,122,234,0.1)'
        }}>
          <p style={{ color: '#9f7aea', fontSize: 11, fontWeight: 900, marginBottom: 15, textAlign: 'center', letterSpacing: 2 }}>PREPARATION & PLAY 🌈</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button onClick={onGoToSocial} style={{
              padding: '12px', borderRadius: 16, background: 'rgba(159,122,234,0.1)',
              border: '1px solid rgba(159,122,234,0.2)', color: '#9f7aea', fontWeight: 700, fontSize: 12, cursor: 'pointer'
            }}>📖 Social Story</button>
            <button onClick={onGoToEnergy} style={{
              padding: '12px', borderRadius: 16, background: 'rgba(237,137,54,0.1)',
              border: '1px solid rgba(237,137,54,0.2)', color: '#ed8936', fontWeight: 700, fontSize: 12, cursor: 'pointer'
            }}>🔋 Energy Meter</button>
            <button onClick={onGoToSand} style={{
              padding: '12px', borderRadius: 16, background: 'rgba(56,161,105,0.1)',
              border: '1px solid rgba(56,161,105,0.2)', color: '#38a169', fontWeight: 700, fontSize: 12, cursor: 'pointer'
            }}>🎨 Sand Art</button>
            <button onClick={onGoToMemory} style={{
              padding: '12px', borderRadius: 16, background: 'rgba(49,130,206,0.1)',
              border: '1px solid rgba(49,130,206,0.2)', color: '#3182ce', fontWeight: 700, fontSize: 12, cursor: 'pointer'
            }}>🧠 Memory Match</button>
            <button onClick={onGoToGame} style={{
              padding: '12px', borderRadius: 16, background: 'rgba(159,122,234,0.1)',
              border: '1px solid rgba(159,122,234,0.2)', color: '#9f7aea', fontWeight: 700, fontSize: 12, cursor: 'pointer'
            }}>🧼 Zen Play</button>
            <button onClick={onGoToComm} style={{
              padding: '12px', borderRadius: 16, background: 'rgba(99,179,237,0.1)',
              border: '1px solid rgba(99,179,237,0.2)', color: '#63b3ed', fontWeight: 700, fontSize: 12, cursor: 'pointer'
            }}>🗣️ AAC Board</button>
          </div>
        </div>

        {/* SECTION 4: MASTERY & SUPPORT 🌟 */}
        <div style={{ 
          marginBottom: '2rem', padding: '1.5rem', borderRadius: 24,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(72,187,120,0.1)'
        }}>
          <p style={{ color: '#48bb78', fontSize: 11, fontWeight: 900, marginBottom: 15, textAlign: 'center', letterSpacing: 2 }}>MASTERY & SUPPORT 🌟</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button onClick={onGoToBuddy} style={{
              padding: '12px', borderRadius: 16, background: 'rgba(237,137,54,0.1)',
              border: '1px solid rgba(237,137,54,0.2)', color: '#ed8936', fontWeight: 700, fontSize: 12, cursor: 'pointer'
            }}>🤖 AI Buddy</button>
            <button onClick={onGoToMixer} style={{
              padding: '12px', borderRadius: 16, background: 'rgba(66,153,225,0.1)',
              border: '1px solid rgba(66,153,225,0.2)', color: '#4299e1', fontWeight: 700, fontSize: 12, cursor: 'pointer'
            }}>🎛️ Sensory Mixer</button>
            <button onClick={onGoToChoice} style={{
              padding: '12px', borderRadius: 16, background: 'rgba(159,122,234,0.1)',
              border: '1px solid rgba(159,122,234,0.2)', color: '#9f7aea', fontWeight: 700, fontSize: 12, cursor: 'pointer'
            }}>🍱 Choice Board</button>
            <button onClick={onGoToSequence} style={{
              padding: '12px', borderRadius: 16, background: 'rgba(56,161,105,0.1)',
              border: '1px solid rgba(56,161,105,0.2)', color: '#38a169', fontWeight: 700, fontSize: 12, cursor: 'pointer'
            }}>👟 How-To</button>
            <button onClick={onGoToLive} style={{
              gridColumn: 'span 2',
              padding: '14px', borderRadius: 18, background: 'rgba(237,100,166,0.1)',
              border: '1px solid rgba(237,100,166,0.3)', color: '#ed64a6', fontWeight: 800, fontSize: 13, cursor: 'pointer'
            }}>👨‍👩‍👧‍👦 Live Support Connect</button>
          </div>
        </div>

        <hr style={{ border: 'none', height: '1px', background: 'rgba(255,255,255,0.05)', margin: '2rem 0' }} />

        {/* SECTION 4: SMART INSIGHTS */}
        {sessions.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <p onClick={onGoToInsights} style={{ 
              color: '#68d391', fontSize: 11, fontWeight: 800, marginBottom: 12, 
              textAlign: 'center', letterSpacing: 2, cursor: 'pointer' 
            }}>AI SMART SUGGESTIONS 🧠</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {getSmartSuggestions(sessions, allRoutines).map(sug => (
                <button
                  key={sug.label}
                  onClick={() => handleRoutine(sug)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '12px',
                    background: 'rgba(104,211,145,0.05)', border: '1.5px solid rgba(104,211,145,0.3)',
                    borderRadius: 14, cursor: 'pointer', color: '#68d391', fontSize: 11, fontWeight: 700
                  }}
                >
                  <span style={{ fontSize: 18 }}>{sug.emoji}</span>
                  <span>{sug.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

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

        {/* Auto Voice Detection Controls */}
        <div style={{
          background: cardBg,
          border: `1px solid ${cardBorder}`,
          borderRadius: 16, padding: '1rem',
          marginBottom: '1rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>🤖</span>
              <span style={{ color: textColor, fontWeight: 600, fontSize: 14 }}>
                Auto Voice Detection
              </span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={isAutoDetectEnabled}
                onChange={() => setIsAutoDetectEnabled(!isAutoDetectEnabled)}
              />
              <span className="slider round"></span>
            </label>
          </div>

          {isAutoDetectEnabled && (
            <>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: mutedColor, marginBottom: 4 }}>
                  <span>Sensitivity (Threshold)</span>
                  <span>{60 - Math.floor(detectionThreshold/2)}% sensitive</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={detectionThreshold}
                  onChange={(e) => setDetectionThreshold(parseInt(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </div>
              <VoiceDetector
                isEnabled={isAutoDetectEnabled}
                threshold={detectionThreshold}
                onTrigger={handleAutoTrigger}
                isDark={isDark}
              />
            </>
          )}
        </div>

        {/* PWA Install Button */}
        {deferredPrompt && (
          <button onClick={handleInstallClick} style={{
            width: '100%', padding: '12px',
            borderRadius: 12, marginBottom: '1.5rem',
            background: 'linear-gradient(90deg, #63b3ed, #4299e1)',
            border: 'none', color: 'white',
            fontWeight: 700, cursor: 'pointer',
            fontSize: 13, animation: 'fadeIn 0.5s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
          }}>
            <span>📱</span> Install Voice Anchor App
          </button>
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
        
        {deferredPrompt && (
          <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.5s ease' }}>
            <button
              onClick={handleInstallClick}
              style={{
                width: '100%', padding: '14px', borderRadius: 16,
                background: 'rgba(99,179,237,0.15)', border: '2px solid #63b3ed',
                color: '#63b3ed', fontWeight: 800, fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
              }}
            >
              <span>📲</span>
              <span>Install Voice Anchor App</span>
            </button>
            <p style={{ 
              fontSize: 11, color: mutedColor, textAlign: 'center', 
              marginTop: 8, opacity: 0.8 
            }}>Install for offline access & faster loading</p>
          </div>
        )}

        {/* Logout/Reset */}
        <div style={{ textAlign: 'center', marginTop: '1rem', paddingBottom: '2rem' }}>
          {isTherapist ? (
            <button
              onClick={() => onReset && onReset()}
              style={{
                background: 'none', border: 'none', color: '#63b3ed',
                fontSize: 14, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline'
              }}
            >
              ← Back to Therapist Dashboard
            </button>
          ) : (
            <>
              <button 
                onClick={onGoToInsights} 
                style={{
                  background: 'none', border: 'none', color: '#9f7aea',
                  fontSize: 13, cursor: 'pointer', fontWeight: 600,
                  textDecoration: 'underline', display: 'block', margin: '0 auto 1rem'
                }}
              >
                View AI Caregiver Insights 🛡️
              </button>
              
              <button
                onClick={() => onReset && onReset()}
                style={{
                  background: 'none', border: 'none', color: '#fc8181',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline',
                  display: 'block', margin: '0 auto'
                }}
              >
                Reset Child Profile (Danger)
              </button>
            </>
          )}
        </div>

        {/* Therapist Notes Section */}
        {isTherapist && profile && (
          <TherapistNotes childId={profile.id} isDark={isDark} />
        )}
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
        
        /* Toggle Switch */
        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }
        .switch input { 
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 34px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #63b3ed;
        }
        input:focus + .slider {
          box-shadow: 0 0 1px #63b3ed;
        }
        input:checked + .slider:before {
          transform: translateX(20px);
        }
        @keyframes breathing {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.15; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.25; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}