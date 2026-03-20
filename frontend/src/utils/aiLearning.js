/**
 * AI Learning Utility for Voice Anchor
 * Analyzes session history to provide smart suggestions and insights.
 */

export const getSmartSuggestions = (sessions, allRoutines) => {
  if (!sessions || sessions.length === 0) return []

  const now = new Date()
  const currentHour = now.getHours()
  
  // Weights for different time windows
  // Same hour: 3, Neighboring hours: 1
  const timeWeights = {}

  sessions.forEach(session => {
    // Assuming session.time is "HH:MM:SS AM/PM" or similar from toLocaleTimeString()
    // Let's try to parse the hour from it.
    // However, it's better if we stored ISO strings.
    // For now, let's assume we can get an hour.
    
    // session.time was set as new Date().toLocaleTimeString() in Home.jsx
    // This is locale dependent. Let's try a safer way if possible.
    // If it's "14:30:00", hour is 14.
    const hourMatch = session.time.match(/(\d+):/)
    if (!hourMatch) return
    
    let sessionHour = parseInt(hourMatch[1])
    if (session.time.includes('PM') && sessionHour !== 12) sessionHour += 12
    if (session.time.includes('AM') && sessionHour === 12) sessionHour = 0

    const diff = Math.abs(currentHour - sessionHour)
    const weight = diff === 0 ? 3 : (diff === 1 || diff === 23 ? 1 : 0)

    if (weight > 0) {
      timeWeights[session.routine] = (timeWeights[session.routine] || 0) + weight
    }
  })

  // Sort routines by weight
  const suggestedLabels = Object.entries(timeWeights)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(entry => entry[0])

  return allRoutines.filter(r => suggestedLabels.includes(r.label))
}

export const getCaregiverInsights = (sessions) => {
  if (!sessions || sessions.length === 0) return null

  // 1. Most active time of day
  const hourCounts = {}
  const routineCounts = {}
  const langCounts = {}
  const emotionCounts = {}

  sessions.forEach(s => {
    const hourMatch = s.time.match(/(\d+):/)
    if (hourMatch) {
      let h = parseInt(hourMatch[1])
      if (s.time.includes('PM') && h !== 12) h += 12
      if (s.time.includes('AM') && h === 12) h = 0
      hourCounts[h] = (hourCounts[h] || 0) + 1
    }
    routineCounts[s.routine] = (routineCounts[s.routine] || 0) + 1
    langCounts[s.language] = (langCounts[s.language] || 0) + 1
    emotionCounts[s.emotion] = (emotionCounts[s.emotion] || 0) + 1
  })

  const topRoutine = Object.entries(routineCounts).sort((a,b) => b[1]-a[1])[0]
  const topLang = Object.entries(langCounts).sort((a,b) => b[1]-a[1])[0]
  const topHour = Object.entries(hourCounts).sort((a,b) => b[1]-a[1])[0]
  const topEmotion = Object.entries(emotionCounts).sort((a,b) => b[1]-a[1])[0]

  let timeString = ""
  if (topHour) {
    const h = parseInt(topHour[0])
    timeString = h >= 18 ? "Evening" : h >= 12 ? "Afternoon" : h >= 6 ? "Morning" : "Night"
  }

  return {
    topRoutine: topRoutine ? topRoutine[0] : "None",
    topLang: topLang ? topLang[0] : "None",
    bestTime: timeString || "N/A",
    topEmotion: topEmotion ? topEmotion[0] : "Neutral",
    totalSessions: sessions.length
  }
}
