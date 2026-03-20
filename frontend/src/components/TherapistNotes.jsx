import React, { useState, useEffect } from 'react'

export default function TherapistNotes({ childId, isDark }) {
  const [notes, setNotes] = useState(
    JSON.parse(localStorage.getItem(`notes_${childId}`)) || []
  )
  const [newNote, setNewNote] = useState('')

  const handleAddNote = () => {
    if (!newNote.trim()) return
    const note = {
      id: Date.now(),
      text: newNote,
      date: new Date().toLocaleString()
    }
    const updated = [note, ...notes]
    setNotes(updated)
    localStorage.setItem(`notes_${childId}`, JSON.stringify(updated))
    setNewNote('')
  }

  const textColor = isDark ? 'white' : '#1a202c'
  const mutedColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)'
  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : 'white'

  return (
    <div style={{
      marginTop: '2rem', padding: '1.5rem',
      background: cardBg, borderRadius: 20,
      border: '1px solid rgba(159,122,234,0.3)'
    }}>
      <h3 style={{ color: '#9f7aea', marginTop: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>📝</span> Therapist clinical Notes
      </h3>
      
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem' }}>
        <input 
          placeholder="Add a clinical note..."
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
          style={{
            flex: 1, padding: '12px', borderRadius: 10,
            background: isDark ? 'rgba(255,255,255,0.07)' : '#f7fafc',
            border: '1px solid rgba(159,122,234,0.2)',
            color: textColor, outline: 'none'
          }}
        />
        <button 
          onClick={handleAddNote}
          style={{
            background: '#9f7aea', color: 'white', border: 'none',
            padding: '10px 20px', borderRadius: 10, fontWeight: 700, cursor: 'pointer'
          }}
        >Add</button>
      </div>

      <div style={{ maxHeight: 300, overflowY: 'auto' }}>
        {notes.length === 0 ? (
          <p style={{ color: mutedColor, fontSize: 13, textAlign: 'center' }}>No notes yet.</p>
        ) : (
          notes.map(note => (
            <div key={note.id} style={{
              padding: '12px', borderRadius: 12,
              background: isDark ? 'rgba(255,255,255,0.03)' : '#edf2f7',
              marginBottom: 10, borderLeft: '4px solid #9f7aea'
            }}>
              <p style={{ margin: '0 0 4px 0', fontSize: 14, color: textColor }}>{note.text}</p>
              <span style={{ fontSize: 11, color: mutedColor }}>{note.date}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
