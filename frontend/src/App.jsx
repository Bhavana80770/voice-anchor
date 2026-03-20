import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Setup from './pages/Setup'
import Home from './pages/Home'
import Routines from './pages/Routines'
import Emotions from './pages/Emotions'
import Progress from './pages/Progress'
import Rewards from './pages/Rewards'
import Schedule from './pages/Schedule'
import SOS from './pages/SOS'
import Insights from './pages/Insights'
import TherapistLogin from './pages/TherapistLogin'
import TherapistDashboard from './pages/TherapistDashboard'
import StoryGenerator from './pages/StoryGenerator'
import FocusGame from './pages/FocusGame'
import CommBoard from './pages/CommBoard'
import SensoryCheckIn from './pages/SensoryCheckIn'
import SocialStory from './pages/SocialStory'
import EnergyMeter from './pages/EnergyMeter'
import SandArt from './pages/SandArt'
import MemoryMatch from './pages/MemoryMatch'
import AnchorBuddy from './pages/AnchorBuddy'
import SensoryMixer from './pages/SensoryMixer'
import ChoiceBoard from './pages/ChoiceBoard'
import VisualSequence from './pages/VisualSequence'
import LiveConnect from './pages/LiveConnect'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  )
  const [caregiverName, setCaregiverName] = useState(
    localStorage.getItem('caregiverLoginName') || ''
  )
  const [profile, setProfile] = useState(
    JSON.parse(localStorage.getItem('childProfile')) || null
  )
  const [page, setPage] = useState('home')
  const [isTherapist, setIsTherapist] = useState(
    localStorage.getItem('isTherapist') === 'true'
  )
  const [children, setChildren] = useState(
    JSON.parse(localStorage.getItem('childrenProfiles')) || []
  )
  const [sessions, setSessions] = useState(
    JSON.parse(localStorage.getItem('childSessions')) || []
  )
  const [selectedEmotion, setSelectedEmotion] = useState(null)
  const [pendingRoutine, setPendingRoutine] = useState(null)
  const [language, setLanguage] = useState('english')

  useEffect(() => {
    localStorage.setItem('childProfile', JSON.stringify(profile))
    
    // Request Notification Permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Routine Reminder Check (every minute)
    const interval = setInterval(() => {
      const routineData = JSON.parse(localStorage.getItem('customRoutines')) || []
      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      
      let updatedAny = false
      const updatedRoutines = routineData.map(r => {
        if (r.time === currentTime && !r.notifiedToday) {
          if (Notification.permission === 'granted') {
            new Notification(`Voice Anchor: ${r.label}`, {
              body: `It's time for ${profile?.childName || 'the child'}'s ${r.label} routine!`,
              icon: '/pwa-192x192.png'
            })
          }
          updatedAny = true
          return { ...r, notifiedToday: true }
        }
        return r
      })

      if (updatedAny) {
        localStorage.setItem('customRoutines', JSON.stringify(updatedRoutines))
      }
      
      // Reset marks at midnight
      if (currentTime === '00:00') {
        const resetRoutines = routineData.map(r => ({ ...r, notifiedToday: false }))
        localStorage.setItem('customRoutines', JSON.stringify(resetRoutines))
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [profile])

  const handleLogin = (name) => {
    localStorage.setItem('isLoggedIn', 'true')
    setIsLoggedIn(true)
    setCaregiverName(name)
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('isTherapist')
    setIsLoggedIn(false)
    setIsTherapist(false)
    setProfile(null)
    setPage('home')
    setSessions([])
    setSelectedEmotion(null)
    setPendingRoutine(null)
  }

  const handleTherapistLogin = () => {
    localStorage.setItem('isTherapist', 'true')
    setIsTherapist(true)
    setIsLoggedIn(true)
    setPage('therapist-dashboard')
  }

  const saveProfile = (data) => {
    localStorage.setItem('childProfile', JSON.stringify(data))
    setProfile(data)
  }

  const handleSelectEmotion = (emotion) => {
    setSelectedEmotion(emotion)
    setPage('home')
  }

  const handleSelectRoutine = (routine) => {
    setPendingRoutine(routine)
    setPage('home')
  }


  const addSession = (session) => {
    const updated = [session, ...sessions]
    setSessions(updated)
    
    if (isTherapist && profile) {
      localStorage.setItem(`sessions_${profile.id}`, JSON.stringify(updated))
      const updatedChildren = children.map(c => 
        c.id === profile.id ? { ...c, lastActive: new Date().toLocaleString() } : c
      )
      setChildren(updatedChildren)
      localStorage.setItem('childrenProfiles', JSON.stringify(updatedChildren))
    } else {
      localStorage.setItem('childSessions', JSON.stringify(updated))
    }
  }

  // Show login if not logged in
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} onGoToTherapist={() => setPage('therapist-login')} />
  }

  // Show setup if no profile and not in therapist mode
  if (!profile && !isTherapist) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a1a',
        fontFamily: 'Segoe UI, sans-serif'
      }}>
        <Setup onSave={saveProfile} caregiverName={caregiverName} />
      </div>
    )
  }

  if (page === 'therapist-login') {
    return <TherapistLogin onLogin={handleTherapistLogin} onBack={() => setPage('home')} />
  }

  if (isTherapist && page === 'therapist-dashboard') {
    return (
      <TherapistDashboard 
        children={children} 
        onSelectChild={(child) => {
          setProfile(child)
          setSessions(JSON.parse(localStorage.getItem(`sessions_${child.id}`)) || [])
          setPage('home')
        }}
        onLogout={handleLogout}
      />
    )
  }

  if (page === 'story') {
    return <StoryGenerator profile={profile} language={language} isDark={true} onBack={() => setPage('home')} />
  }

  if (page === 'routines') {
    return <Routines onBack={() => setPage('home')} onSelectRoutine={handleSelectRoutine} />
  }

  if (page === 'emotions') {
    return <Emotions onBack={() => setPage('home')} onSelect={handleSelectEmotion} />
  }

  if (page === 'progress') {
    return <Progress sessions={sessions} onBack={() => setPage('home')} />
  }

  if (page === 'rewards') {
    return <Rewards sessions={sessions} onBack={() => setPage('home')} />
  }

  if (page === 'schedule') {
    return (
      <Schedule
        onBack={() => setPage('home')}
        onTriggerRoutine={handleSelectRoutine}
      />
    )
  }

  if (page === 'sos') {
    return (
      <SOS
        onBack={() => setPage('home')}
        childName={profile.childName}
      />
    )
  }

  if (page === 'insights') {
    return <Insights sessions={sessions} onBack={() => setPage('home')} isTherapist={isTherapist} />
  }

  if (page === 'game') {
    return <FocusGame onBack={() => setPage('home')} isDark={true} />
  }

  if (page === 'comm') {
    return <CommBoard onBack={() => setPage('home')} profile={profile} isDark={true} />
  }

  if (page === 'checkin') {
    return <SensoryCheckIn onBack={() => setPage('home')} profile={profile} isDark={true} />
  }

  if (page === 'social') {
    return <SocialStory onBack={() => setPage('home')} profile={profile} language={profile.language} isDark={true} />
  }

  if (page === 'energy') {
    return <EnergyMeter onBack={() => setPage('home')} isDark={true} />
  }

  if (page === 'sand') {
    return <SandArt onBack={() => setPage('home')} isDark={true} />
  }

  if (page === 'memory') {
    return <MemoryMatch onBack={() => setPage('home')} isDark={true} />
  }

  if (page === 'buddy') {
    return <AnchorBuddy onBack={() => setPage('home')} profile={profile} language={language} />
  }

  if (page === 'mixer') {
    return <SensoryMixer onBack={() => setPage('home')} />
  }

  if (page === 'choice') {
    return <ChoiceBoard onBack={() => setPage('home')} />
  }

  if (page === 'sequence') {
    return <VisualSequence onBack={() => setPage('home')} />
  }

  if (page === 'live') {
    return <LiveConnect onBack={() => setPage('home')} profile={profile} />
  }

  return (
    <Home
      profile={profile}
      caregiverName={caregiverName}
      sessions={sessions}
      addSession={addSession}
      selectedEmotion={selectedEmotion}
      pendingRoutine={pendingRoutine}
      onPendingRoutineDone={() => setPendingRoutine(null)}
      onGoToRoutines={() => setPage('routines')}
      onGoToEmotions={() => setPage('emotions')}
      onGoToProgress={() => setPage('progress')}
      onGoToRewards={() => setPage('rewards')}
      onGoToSchedule={() => setPage('schedule')}
      onGoToSOS={() => setPage('sos')}
      onGoToInsights={() => setPage('insights')}
      onGoToTherapist={() => setPage('therapist-login')}
      onGoToStory={() => setPage('story')}
      isTherapist={isTherapist}
      onGoToGame={() => setPage('game')}
      onGoToComm={() => setPage('comm')}
      onGoToCheckIn={() => setPage('checkin')}
      onGoToSocial={() => setPage('social')}
      onGoToEnergy={() => setPage('energy')}
      onGoToSand={() => setPage('sand')}
      onGoToMemory={() => setPage('memory')}
      onGoToBuddy={() => setPage('buddy')}
      onGoToMixer={() => setPage('mixer')}
      onGoToChoice={() => setPage('choice')}
      onGoToSequence={() => setPage('sequence')}
      onGoToLive={() => setPage('live')}
      onLogout={handleLogout}
      onReset={() => {
        if (isTherapist) {
          setPage('therapist-dashboard')
          setProfile(null)
        } else {
          localStorage.removeItem('childProfile')
          setProfile(null)
          setPage('home')
          setSessions([])
          setSelectedEmotion(null)
          setPendingRoutine(null)
        }
      }}
    />
  )
}

export default App