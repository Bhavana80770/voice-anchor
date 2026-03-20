import React, { useState, useEffect, useRef } from 'react'

export default function SandArt({ onBack, isDark }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const [isDrawing, setIsDrawing] = useState(false)
  const requestRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particlesRef.current = particlesRef.current.map(p => ({
        ...p,
        y: p.y + p.speed,
        opacity: p.opacity - 0.008
      })).filter(p => p.opacity > 0)
      
      particlesRef.current.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${Math.floor(p.opacity * 255).toString(16).padStart(2, '0')}`
        ctx.fill()
      })

      requestRef.current = requestAnimationFrame(render)
    }

    // Passive listener fix
    const handleTouchStart = (e) => { e.preventDefault(); setIsDrawing(true); }
    const handleTouchMove = (e) => { e.preventDefault(); addParticles(e); }
    
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    
    requestRef.current = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(requestRef.current)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  const addParticles = (e) => {
    // Check isDrawing only for mouse; touch usually implies drawing once moving
    const x = e.clientX || (e.touches && e.touches[0].clientX)
    const y = e.clientY || (e.touches && e.touches[0].clientY)
    
    if (x === undefined || y === undefined) return
    if (e.type === 'mousemove' && !isDrawing) return

    const newParticles = Array.from({ length: 8 }).map(() => ({
      x: x + (Math.random() - 0.5) * 30,
      y: y + (Math.random() - 0.5) * 30,
      size: Math.random() * 6 + 3,
      color: ['#f6ad55', '#63b3ed', '#9f7aea', '#68d391', '#f687b3'][Math.floor(Math.random() * 5)],
      speed: Math.random() * 3 + 2,
      opacity: 1
    }))
    
    particlesRef.current = [...particlesRef.current.slice(-300), ...newParticles]
  }

  return (
    <div 
      style={{
        width: '100vw', height: '100vh', 
        background: '#050510',
        position: 'relative', overflow: 'hidden', touchAction: 'none'
      }}
      onMouseDown={() => setIsDrawing(true)}
      onMouseUp={() => setIsDrawing(false)}
      onMouseMove={addParticles}
      onTouchEnd={() => setIsDrawing(false)}
    >
      <button 
        onClick={onBack}
        style={{
          position: 'absolute', top: 20, left: 20, zIndex: 10,
          background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
          padding: '12px 24px', borderRadius: 14, cursor: 'pointer', fontWeight: 700,
          backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)'
        }}
      >← Back</button>

      <button 
        onClick={() => { particlesRef.current = []; }}
        style={{
          position: 'absolute', top: 20, right: 20, zIndex: 10,
          background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
          padding: '12px 24px', borderRadius: 14, cursor: 'pointer', fontWeight: 700,
          backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)'
        }}
      >🧹 Clear</button>

      <div style={{ 
        position: 'absolute', top: '40%', width: '100%', 
        textAlign: 'center', pointerEvents: 'none', zIndex: 5
      }}>
        <h1 style={{ 
          fontSize: 48, margin: 0, fontWeight: 900,
          background: 'linear-gradient(135deg, #fbd38d, #b794f4)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          textShadow: '0 0 30px rgba(159,122,234,0.4)',
          letterSpacing: -1
        }}>Sensory SandArt</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 20, marginTop: 15, fontWeight: 500 }}>
          Touch the screen and watch the sand flow ✨
        </p>
      </div>

      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}
