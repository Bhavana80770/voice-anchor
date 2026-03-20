import React, { useState } from 'react'
import { generateTherapistReport } from '../utils/ReportGenerator'
import { getCaregiverInsights } from '../utils/aiLearning'

export default function TherapistDashboard({ children, onSelectChild, onLogout }) {
  const [showAddChild, setShowAddChild] = useState(false)
  const [newChild, setNewChild] = useState({ childName: '', age: '', favoriteThing: '' })

  const handleExport = () => {
    const data = {
      childrenProfiles: JSON.parse(localStorage.getItem('childrenProfiles')) || [],
      customRoutines: JSON.parse(localStorage.getItem('customRoutines')) || [],
      sessionsMap: {}
    }
    data.childrenProfiles.forEach(child => {
      data.sessionsMap[child.id] = JSON.parse(localStorage.getItem(`sessions_${child.id}`)) || []
    })
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `voice_anchor_backup.json`
    link.click()
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (data.childrenProfiles) localStorage.setItem('childrenProfiles', JSON.stringify(data.childrenProfiles))
        if (data.customRoutines) localStorage.setItem('customRoutines', JSON.stringify(data.customRoutines))
        if (data.sessionsMap) {
          Object.keys(data.sessionsMap).forEach(id => {
            localStorage.setItem(`sessions_${id}`, JSON.stringify(data.sessionsMap[id]))
          })
        }
        alert('Import successful!')
        window.location.reload()
      } catch (err) { alert('Invalid file format') }
    }
    reader.readAsText(file)
  }

  const handleAddChild = () => {
    if (!newChild.childName) return
    const child = {
      ...newChild,
      id: Date.now().toString(),
      lastActive: 'Never',
      photo: null
    }
    const updated = [...children, child]
    localStorage.setItem('childrenProfiles', JSON.stringify(updated))
    window.location.reload() // Quick refresh to update App state
  }

  const handleDownloadReport = (child) => {
    const childSessions = JSON.parse(localStorage.getItem(`sessions_${child.id}`)) || []
    const childInsights = getCaregiverInsights(childSessions)
    const childNotes = JSON.parse(localStorage.getItem(`notes_${child.id}`)) || []
    generateTherapistReport(child, childSessions, childInsights, childNotes)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '2rem 1rem', color: 'white', fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: 26, background: 'linear-gradient(90deg, #9f7aea, #63b3ed)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>Therapist Dashboard</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleExport} style={smBtnStyle}>📥 Backup</button>
            <label style={{ ...smBtnStyle, cursor: 'pointer' }}>
              📤 Restore
              <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </label>
            <button onClick={onLogout} style={{
              background: 'rgba(252,129,129,0.1)', border: '1px solid rgba(252,129,129,0.3)',
              color: '#fc8181', padding: '8px 16px', borderRadius: 8, cursor: 'pointer'
            }}>Logout</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: '2rem' }}>
          {children.map(child => (
            <div 
              key={child.id}
              onClick={() => onSelectChild(child)}
              style={{
                background: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: '1.5rem',
                border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#63b3ed'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>👤</div>
              <h3 style={{ margin: '0 0 4px 0' }}>{child.childName}</h3>
              <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                Age: {child.age} | Last active: {child.lastActive}
              </p>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownloadReport(child)
                }}
                style={{
                  marginTop: 16, width: '100%', padding: '10px',
                  borderRadius: 10, background: 'rgba(159,122,234,0.15)',
                  border: '1px solid rgba(159,122,234,0.4)',
                  color: '#b794f4', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.target.style.background = 'rgba(159,122,234,0.3)'}
                onMouseLeave={e => e.target.style.background = 'rgba(159,122,234,0.15)'}
              >📄 Download Clinical Report</button>
            </div>
          ))}

          <button 
            onClick={() => setShowAddChild(true)}
            style={{
              background: 'rgba(99,179,237,0.1)', borderRadius: 20, padding: '1.5rem',
              border: '2px dashed rgba(99,179,237,0.4)', cursor: 'pointer',
              color: '#63b3ed', fontWeight: 600
            }}
          >+ Add New Child</button>
        </div>

        {showAddChild && (
          <div style={{
            background: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: '2rem',
            border: '1px solid rgba(99,179,237,0.3)', animation: 'fadeIn 0.4s ease'
          }}>
            <h3 style={{ marginTop: 0 }}>Register New Child 🧒</h3>
            <input 
              placeholder="Child Name" 
              value={newChild.childName}
              onChange={e => setNewChild({...newChild, childName: e.target.value})}
              style={inputStyle} 
            />
            <input 
              placeholder="Age" 
              value={newChild.age}
              onChange={e => setNewChild({...newChild, age: e.target.value})}
              style={inputStyle} 
            />
            <input 
              placeholder="Favorite Thing (e.g. Dinosaurs)" 
              value={newChild.favoriteThing}
              onChange={e => setNewChild({...newChild, favoriteThing: e.target.value})}
              style={inputStyle} 
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={handleAddChild}
                style={{ flex: 1, padding: '12px', borderRadius: 12, background: '#63b3ed', border: 'none', color: 'white', fontWeight: 700 }}
              >Save Child</button>
              <button 
                onClick={() => setShowAddChild(false)}
                style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
              >Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '12px', borderRadius: 10,
  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'white', marginBottom: '1rem', outline: 'none', boxSizing: 'border-box'
}

const smBtnStyle = {
  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
  color: 'white', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12
}
