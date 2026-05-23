# 🎙️ SonicScript

> A modern Speech-to-Text web application built with the MERN stack.

SonicScript lets you upload audio files or record directly from your browser, converts speech to text using the Deepgram API, and stores your transcriptions for easy access.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Stack](https://img.shields.io/badge/stack-MERN-green)

---

## ✨ Features

- 🎤 **Record Audio** — Capture speech directly from your browser microphone
- 📁 **Upload Audio** — Upload audio files (MP3, WAV, M4A, etc.)
- 📝 **Transcribe** — Convert speech to text using Deepgram's AI
- 💾 **Save & Manage** — Store transcriptions in MongoDB
- 📋 **History** — View and search previous transcriptions
- 📱 **Responsive** — Works beautifully on desktop and mobile

---

## 🛠️ Tech Stack

| Layer      | Technology        | Purpose                          |
|------------|-------------------|----------------------------------|
| Frontend   | React + Vite      | Fast, modern UI                  |
| Styling    | Tailwind CSS v4   | Utility-first CSS framework      |
| Backend    | Express.js        | REST API server                  |
| Runtime    | Node.js           | Server-side JavaScript           |
| Database   | MongoDB           | NoSQL document storage           |
| STT API    | Deepgram          | Speech-to-Text transcription     |

---

## 📁 Project Structure

```
SonicScript/
├── client/          → React frontend (Vite + Tailwind)
├── server/          → Express.js backend API
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Deepgram API Key](https://deepgram.com/) (free $200 credits)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd SonicScript
```

### 2. Start the Frontend

```bash
cd client
npm install
npm run dev
```

### 3. Start the Backend

```bash
cd server
npm install
npm run dev
```

---

## 📝 License

This project is for educational purposes as part of an internship project.

---

## 🤝 Contributing

This is a learning project. Feel free to fork and experiment!
