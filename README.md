# AI Doubt Solver

A lightweight local web app for students to ask academic questions, receive an enthusiastic AI answer, listen to it via text-to-speech, and watch a simple avatar lip-sync to the audio.

## Tech stack
- React + Vite + Tailwind CSS
- Node.js + Express
- MongoDB + Mongoose
- Groq API for answers
- Sarvam AI TTS for audio

## Setup
1. Install dependencies for both client and server.
2. Create a .env file in the project root using .env.example as a template.
3. Place your HeyGen avatar video at client/public/avatar/avatar-idle.mp4.
4. Start the server and client.

## Run locally
```bash
cd server
npm install
npm run dev
```

```bash
cd client
npm install
npm run dev
```

## Notes
- Authentication uses JWT and bcrypt.
- Chat history is stored per user in MongoDB.
- The avatar animation is simple amplitude-based lip-sync implemented in the browser.
