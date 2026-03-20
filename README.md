# ⚓ Voice Anchor: A Therapeutic ASD Support Suite

**Voice Anchor** is a world-class, multi-platform Progressive Web App (PWA) designed to empower children with Autism Spectrum Disorder (ASD) and support their caregivers through AI-driven therapy, sensory regulation, and daily management tools.

![Voice Anchor Banner](https://img.shields.io/badge/Status-Production--Ready-success?style=for-the-badge&logo=react)

## 🚀 19+ Therapeutic Features

### 💙 Emotional Support Zone
- **Personalized AI Stories**: Therapeutic narratives generated in 10+ languages (Hindi, Telugu, etc.)
- **Body Scan / Check-In**: Visual tools for identifying physical and emotional states.
- **AI Anchor Buddy**: An interactive chat companion for practicing social skills.

### ✨ Daily Essentials Zone
- **Interactive Routines**: Visual and timed sequences for morning, school, and bedtime.
- **Smart Schedule**: A dynamic calendar that manages transitions with AI-generated audio cues.
- **Reward System**: Gamified positive reinforcement for completing daily tasks.

### 🌈 Preparation & Play Zone
- **Sensory Sand Art**: High-performance canvas for calming cause-and-effect interaction.
- **Zen Play (Bubbles)**: Therapeutic bubble-popping game for focus.
- **Social Stories (Generator)**: AI-generated 4-step visual guides for new or stressful situations.
- **AAC Communication Board**: Visual "My Voice" board for non-verbal support.
- **Sensory Soundscape Mixer**: 4-channel audio regulator (Rain, Ocean, etc.).
- **Visual Choice Board**: Simplified decision-support tool for reducing choice fatigue.
- **Task Modeling ("How-To")**: Step-by-step visual sequences for hygiene and daily tasks.

### 📊 Caregiver & Therapist Tools
- **Deep Insights**: Data-driven analysis of behavioral trends and session logs.
- **Live Support Connect**: Real-time messaging and stickers from caregivers to the child.
- **Therapist Dashboard**: Centralized management for tracking multiple children.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Vanilla CSS (Premium Micro-Animations)
- **Backend**: Node.js, Express
- **AI Engine**: Anthropic Claude AI (via Claude SDK)
- **Audio**: Web Speech API & Custom Audio Mixers
- **PWA**: Service Workers & Web App Manifest for native-feel installation.

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- Claude AI API Key

### Installation

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd voiceanchor
   npm install
   cd frontend && npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the `backend/` directory:
   ```env
   CLAUDE_API_KEY=your_key_here
   PORT=5000
   ```

3. **Run Locally**
   ```bash
   # Backend
   node backend/server.js
   
   # Frontend
   cd frontend && npm run dev
   ```

---

## 🌎 Accessibility
Voice Anchor is built with a **Premium Dark Theme** and high-contrast visuals, adhering to accessibility standards for children with sensory sensitivities. It supports **10+ languages**, including major Indian regional languages.

---

## 📜 License
This project is private and proprietary. Developed for **Voice Anchor**. 🦾✨