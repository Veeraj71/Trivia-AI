# TriviaAI

TriviaAI is a competitive coding and contest platform for players, hosts, companies, and admins. The app supports user authentication, contest creation and participation, live contest leaderboards, code submissions, and a streamlined player experience for learning and competing.

This repository contains:
- a Node.js + Express backend API
- a React + Vite frontend
- MySQL-backed persistence
- Socket.IO-powered live contest updates

## Tech Stack

- Frontend: React, Vite, Tailwind-like styling, React Router
- Backend: Node.js, Express
- Database: MySQL
- Real-time layer: Socket.IO
- Auth: JWT
- Code execution: Judge0-ready integration and demo submission flow

## Project Structure

```text
Trivia-AI/
├── backend/
│   ├── src/
│   ├── migrations/
│   ├── schema.sql
│   ├── .env
│   ├── package.json
│   └── ...
├── frontend/
│   └── codecraft-frontend/
│       ├── src/
│       ├── public/
│       ├── .env
│       ├── package.json
│       └── ...
└── README.md
```

## Features

- Player sign up and login
- Role-based access for player, host, company, and admin flows
- Contest creation and public/private contest support
- Contest problem listing and problem solving pages
- Submission tracking and verdict results
- Live leaderboard updates
- Player dashboard and statistics
- AI recommendation support for players
- Render-friendly deployment setup

## Prerequisites

Before running the project locally, make sure you have:

- Node.js 18+
- npm
- MySQL 8+
- A local database named `triviaai`

## Local Setup

### 1) Clone the repository

```bash
git clone <your-repo-url>
cd Trivia-AI
```

### 2) Install backend dependencies

```bash
cd backend
npm install
```

### 3) Install frontend dependencies

```bash
cd ../frontend/codecraft-frontend
npm install
```

### 4) Configure environment variables

Create or update the backend `.env` file:

```env
PORT=5000
NODE_ENV=development
APP_NAME=TriviaAI

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=triviaai

JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

FRONTEND_URLS=http://localhost:3000,http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176
ADMIN_SECRET_KEY=your_admin_secret

ENABLE_WEBSOCKET=true
ENABLE_WEBSOCKET_DEMO=false
REACT_APP_WEBSOCKET_URL=http://localhost:5000
```

Create or update the frontend `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WS_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 5) Set up MySQL database

Create the database:

```sql
CREATE DATABASE triviaai;
```

Then initialize the schema using the SQL files in the backend folder, including:

```bash
mysql -u root -p triviaai < backend/schema.sql
```

If there are migration or update scripts, run those as needed for the current version of the app.

## Run the App

### Start the backend

```bash
cd backend
npm start
```

Or with nodemon:

```bash
cd backend
npm run dev
```

### Start the frontend

```bash
cd frontend/codecraft-frontend
npm run dev -- --host 0.0.0.0
```

Then open the frontend in your browser:

- http://localhost:5173/
- or the Vite-assigned port if 5173 is occupied

## Backend Health Check

The backend exposes a health endpoint:

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "...",
  "websocket": "active"
}
```

## Deployment Notes

This project is structured for deployment across separate services:

- Backend: Node.js/Express service
- Frontend: Vite static site or equivalent hosting service
- Database: MySQL hosted externally (for example, Render, PlanetScale, or another managed MySQL provider)

### Recommended Render setup

- Backend service: deploy the `backend` app
- Frontend service: deploy the `frontend/codecraft-frontend` app
- Set `FRONTEND_URLS` and `VITE_*` environment variables to your deployed domains
- Use the backend host URL for API traffic and Socket.IO

Example frontend env for deployment:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
VITE_WS_URL=https://your-backend-url.onrender.com
```

## Core User Flows

- Player registration and login
- Contest browse and join
- Problem solving in the contest flow
- Contest leaderboard tracking
- Host/company contest creation and management
- Admin oversight and moderation

## Notes

- The codebase includes both demo and real app logic. Some contest flows may use simulated evaluation depending on the active environment.
- For production use, ensure secrets, JWT keys, DB credentials, and API keys are stored in secure environment variables.
- Review and update host origin values and CORS settings before going live.

## License

This project is licensed under the ISC license unless stated otherwise.

## Contributing

Contributions are welcome. If you are making changes:

1. create a feature branch
2. keep commits focused
3. verify the frontend build and backend health route
4. update environment examples when adding new configuration

## Contact

For questions, deployment issues, or project setup support, reach out to the repository maintainer or project owner.
