import { useState } from 'react'
import Login from './pages/Login'
import Setup from './pages/Setup'
import Home from './pages/Home'
import Routines from './pages/Routines'
import Emotions from './pages/Emotions'
import Progress from './pages/Progress'
import Rewards from './pages/Rewards'
import Schedule from './pages/Schedule'
import SOS from './pages/SOS'

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
  const [sessions, setSessions] = useState([])
  const [selectedEmotion, setSelectedEmotion] = useState(null)
  const [pendingRoutine, setPendingRoutine] = useState(null)

  const handleLogin = (name) => {
    localStorage.setItem('isLoggedIn', 'true')
    setIsLoggedIn(true)
    setCaregiverName(name)
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    setIsLoggedIn(false)
    setProfile(null)
    setPage('home')
    setSessions([])
    setSelectedEmotion(null)
    setPendingRoutine(null)
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
    setSessions(prev => [session, ...prev])
  }

  // Show login if not logged in
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  // Show setup if no profile
  if (!profile) {
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
      onLogout={handleLogout}
      onReset={() => {
        localStorage.removeItem('childProfile')
        setProfile(null)
        setPage('home')
        setSessions([])
        setSelectedEmotion(null)
        setPendingRoutine(null)
      }}
    />
  )
}

export default App