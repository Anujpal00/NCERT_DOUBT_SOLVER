# AI Doubt Solver

AI Doubt Solver is a lightweight local web application designed for students who want quick academic support in a friendly, encouraging format. Students can ask questions, receive AI-generated answers aligned with NCERT-style learning, listen to the response using text-to-speech, and watch a simple animated avatar react while speaking.

The app combines a React frontend, an Express API, and MongoDB persistence to offer a complete learning experience focused on doubt resolution, instant feedback, and voice-based interaction.

## Features

- Student signup and login flow
- Class and subject-aware doubt solving
- AI answer generation using Groq
- Voice response using Sarvam AI text-to-speech
- Saved conversation history per user
- Animated avatar with lip-sync behavior in the browser
- Simple dashboard for asking questions and viewing past interactions

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT + bcryptjs
- AI: Groq API
- TTS: Sarvam AI

## Project Structure

```text
ai-doubt-solver/
├── .env.example
├── .gitignore
├── README.md
├── client/
│   ├── public/
│   │   └── avatar/
│   │       ├── avatar-idle.mp4
│   │       └── avatar-idle.png
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── .env (optional for frontend)
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── server.js
└── package-lock.json (if present)
```

## How It Works

1. A student creates an account and selects their class and subject.
2. They ask a question from the dashboard.
3. The backend builds a teaching prompt and sends it to Groq for an answer.
4. The response is saved to MongoDB along with the user’s question history.
5. If a TTS API key is available, the answer is converted into speech.
6. The frontend plays the generated audio and animates the avatar to simulate speaking.

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+ installed
- MongoDB running locally or a MongoDB Atlas connection string
- API keys for Groq and Sarvam AI
- A valid avatar video placed in the client avatar folder

## Environment Setup

### 1) Root backend environment
Create a `.env` file in the project root using `.env.example` as the template:

```env
MONGO_URI=mongodb://127.0.0.1:27017/ai-doubt-solver
JWT_SECRET=your_super_secret_key
GROQ_API_KEY=your_groq_api_key
SARVAM_API_KEY=your_sarvam_api_key
PORT=5000
```

### 2) Frontend environment
Create a `client/.env` file if you want to override the API base URL:

```env
VITE_API_URL=http://localhost:5000
```

If this file is not present, the app defaults to `http://localhost:5000`.

## Install Dependencies

### Server

```bash
cd server
npm install
```

### Client

```bash
cd client
npm install
```

## Run the Application

Start the backend server:

```bash
cd server
npm run dev
```

Start the frontend in a separate terminal:

```bash
cd client
npm run dev
```

Then open the app in your browser:

```text
http://localhost:5173
```

## Important Asset Requirement

The avatar animation depends on a video file stored at:

```text
client/public/avatar/avatar-idle.mp4
```

Optionally, place a poster image at:

```text
client/public/avatar/avatar-idle.png
```

Without this asset, the avatar panel may display without the expected video animation.

## API Overview

### Authentication

- `POST /api/auth/signup` — create a new student account
- `POST /api/auth/login` — sign in with email and password
- `GET /api/auth/me` — fetch logged-in user details

### Doubt Solving

- `POST /api/doubt/ask` — ask a question and get an AI answer
- `GET /api/doubt/history` — get recent question history for the logged-in user

### Health Check

- `GET /health` — check backend status

## Security Notes

This project uses environment variables for sensitive configuration, including:

- MongoDB URI
- JWT secret
- Groq key
- Sarvam AI key

These values should never be committed to GitHub. A project-level `.gitignore` is included to protect local secrets and generated artifacts.

## Notes

- Authentication is handled using JWT tokens.
- User chat history is stored in MongoDB.
- The avatar mouth animation is a simple browser-based lip-sync effect triggered by audio amplitude.
- The project is designed primarily for local development and learning.

## License

This project is intended for educational and local development use. Add a suitable license if you plan to share or distribute it publicly.

## Contributing

Feel free to fork the project, improve the UX, add better teacher prompts, or extend the avatar behavior. If you make changes, keep environment variables local and never expose secret keys in the repository.
