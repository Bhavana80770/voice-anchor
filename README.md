# 🎙️ Voice Anchor

### A Voice-First AI Companion for Children with Autism Spectrum Disorder

> *"Because every child deserves a calming voice"*

Built for **MurfAI Hackathon** | Powered by **Murf AI** + **Claude AI**

---

## 🧠 Problem Statement

Children with Autism Spectrum Disorder experience anxiety and meltdowns during daily routine transitions like stopping playtime or brushing teeth. Caregivers struggle to provide consistent reassurance, and existing screen-based tools fail when a child is overwhelmed.

---

## ✅ Solution

Voice Anchor is a voice-first AI companion powered by Murf AI that delivers personalized, soothing voice guidance to ASD children during routine transitions — using their name, favourite thing, and emotion — in 10 Indian languages, helping children stay calm and caregivers feel supported.

---

## 🌟 Key Features

| Feature | Description |
|---------|-------------|
| 🎙️ Murf AI Voice | Warm, calm, personalized voice using Murf Falcon model |
| 🌍 10 Languages | English, Hindi, Telugu, Tamil, Kannada, Malayalam, Marathi, Gujarati, Bengali, Punjabi |
| 😊 Emotion Selector | Message adapts based on child's current emotion |
| ⚙️ Custom Routines | Caregiver can add their own routines |
| 📊 Progress Tracker | Track completed routines with charts |
| ⭐ Rewards System | Stars and badges for completing routines |
| 📅 Daily Schedule | Set routine times for the whole day |
| 🚨 Emergency SOS | WhatsApp alert to caregiver instantly |
| 🎵 Calming Music | Background music while voice guidance plays |
| 🔐 Secure Login | Password protected caregiver account |
| 📷 Child Photo | Personalized profile for every child |
| ☀️ Dark/Light Mode | Comfortable for every environment |

---

## 🎬 How It Works

```
1. Caregiver logs in and sets up child profile
   (name, age, favourite thing, photo)

2. Caregiver taps routine button
   (Stop Playtime, Brush Teeth, Leave House, etc.)

3. Claude AI generates personalized calming script
   (uses child's name + favourite thing + emotion)

4. Murf AI speaks the message
   (warm, calm voice in selected language)

5. Child hears their name and calms down
   (breathing animation plays alongside voice)
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| React.js + Vite | Frontend UI |
| Node.js + Express | Backend API |
| Murf AI API | Text to Speech (Falcon Model) |
| Claude AI API | Personalized calming script generation |
| LocalStorage | Data persistence |
| WhatsApp API | Emergency SOS alerts |

---

## 📁 Project Structure

```
voiceanchor/
├── backend/
│   ├── routes/
│   │   ├── generate.js     ← Claude AI integration
│   │   └── speak.js        ← Murf AI integration
│   ├── .env                ← API keys
│   └── server.js           ← Express server
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Setup.jsx
│       │   ├── Home.jsx
│       │   ├── Emotions.jsx
│       │   ├── Routines.jsx
│       │   ├── Progress.jsx
│       │   ├── Rewards.jsx
│       │   ├── Schedule.jsx
│       │   └── SOS.jsx
│       └── App.jsx
└── README.md
```

---

## 🚀 How to Run

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/voice-anchor.git
cd voice-anchor
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file inside backend folder:
```
CLAUDE_API_KEY=your_claude_api_key
MURF_API_KEY=your_murf_api_key
```

Start backend:
```bash
node server.js
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🎯 Murf AI Integration

Voice Anchor uses Murf AI as the **core feature**:

- **Voice:** `en-US-natalie` — warm, soft female voice
- **Style:** `Calm` — specifically for ASD children
- **Rate:** `-10` — slightly slower for better comprehension
- **Model:** `GEN2` — Murf Falcon model (under 130ms latency)
- **Languages:** 10 Indian languages supported
- **Format:** MP3 audio played directly in browser

```javascript
const response = await axios.post(
  'https://api.murf.ai/v1/speech/generate',
  {
    voiceId: 'en-US-natalie',
    style: 'Calm',
    rate: -10,
    text: personalizedScript,
    format: 'MP3',
    modelVersion: 'GEN2'
  }
)
```

---

## 🌍 Supported Languages

| Language | Code |
|----------|------|
| English | english |
| Hindi | hindi |
| Telugu | telugu |
| Tamil | tamil |
| Kannada | kannada |
| Malayalam | malayalam |
| Marathi | marathi |
| Gujarati | gujarati |
| Bengali | bengali |
| Punjabi | punjabi |

---

## 💙 Impact

- Helps ASD children transition between routines without meltdowns
- Reduces caregiver stress and burnout
- Works in 10 Indian languages — reaches rural and urban families
- Completely voice-first — no screen dependency
- Can be used by schools, therapy centers, and homes

---

👩‍💻 Built By
Built with ❤️ for MurfAI Hackathon

Voice Anchor — Because every child with ASD deserves to feel calm, safe, and heard.

Built with ❤️ for MurfAI Hackathon

> *Voice Anchor — Because every child with ASD deserves to feel calm, safe, and heard.*
