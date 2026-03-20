import React, { useEffect, useRef, useState } from 'react'

export default function VoiceDetector({ 
  onTrigger, 
  threshold = 50, 
  isEnabled = false,
  isDark = true
}) {
  const [volume, setVolume] = useState(0)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const streamRef = useRef(null)
  const triggerCounterRef = useRef(0)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    if (isEnabled) {
      startListening()
    } else {
      stopListening()
    }
    return () => stopListening()
  }, [isEnabled])

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      audioContextRef.current = audioContext
      
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyserRef.current = analyser
      
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      
      const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray)
        let sum = 0
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i]
        }
        const average = sum / bufferLength
        setVolume(average)

        // If volume exceeds threshold
        if (average > threshold) {
          triggerCounterRef.current += 1
          // If sound persists for ~0.75 seconds (at 60fps, ~45 frames)
          if (triggerCounterRef.current > 45) {
            console.log('Voice Detector: Triggering calming routine...');
            onTrigger()
            triggerCounterRef.current = -120 // Cooldown: ~2 seconds
          }
        } else {
          if (triggerCounterRef.current > 0) {
            triggerCounterRef.current -= 1
          }
        }

        animationFrameRef.current = requestAnimationFrame(checkVolume)
      }
      
      checkVolume()
    } catch (err) {
      console.error('Error accessing microphone:', err)
    }
  }

  const stopListening = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    if (audioContextRef.current) audioContextRef.current.close()
    setVolume(0)
    triggerCounterRef.current = 0
  }

  return (
    <div style={{
      padding: '1rem',
      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
      borderRadius: 16,
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(99,179,237,0.3)'}`,
      marginTop: '1rem',
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
          Mic Monitor
        </span>
        <span style={{ 
          fontSize: 12, 
          color: volume > threshold ? '#fc8181' : '#68d391',
          fontWeight: 700 
        }}>
          {volume > threshold ? '🚨 Distress Detected' : '✅ Quiet'}
        </span>
      </div>
      
      <div style={{ 
        width: '100%', 
        height: 8, 
        background: 'rgba(0,0,0,0.2)', 
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          width: `${Math.min(volume * 1.5, 100)}%`,
          height: '100%',
          background: `linear-gradient(90deg, #68d391, ${volume > threshold ? '#fc8181' : '#9f7aea'})`,
          transition: 'width 0.1s ease',
          borderRadius: 4
        }} />
        
        {/* Threshold marker */}
        <div style={{
          position: 'absolute',
          left: `${threshold * 1.5}%`,
          top: 0,
          width: 2,
          height: '100%',
          background: 'white',
          boxShadow: '0 0 4px rgba(0,0,0,0.5)'
        }} />
      </div>
      
      <p style={{ fontSize: 10, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)', marginTop: 8, textAlign: 'center' }}>
        Automatic trigger active if level stays past the white line
      </p>
    </div>
  )
}
