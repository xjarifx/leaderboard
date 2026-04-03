# Leaderboard App

A celebrity rating application with separate frontend and backend.

## Tech Stack

**Frontend**: React + Vite + Tailwind CSS  
**Backend**: Node.js + Express + Prisma 7  
**Database**: PostgreSQL

## Project Structure

```
leaderboard/
├── frontend/     # React app (deploys to Vercel)
├── backend/     # Express API (deploys to Render)
└── .env         # Environment variables (gitignored)
```

## Setup

### Backend

```bash
cd backend
npm install
npm run db:generate
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

**Backend** (`backend/.env`):
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT tokens
- `PORT` - Server port (default: 3001)

**Frontend** (`frontend/.env`):
- `VITE_API_URL` - Backend API URL (default: http://localhost:3001)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/sessions` | List user sessions |
| POST | `/api/sessions` | Create new session |
| GET | `/api/sessions/:id/current` | Get current image |
| POST | `/api/sessions/:id/rate` | Rate image |
| GET | `/api/sessions/:id/ratings` | Get session ratings |
| GET | `/api/leaderboard` | Get leaderboard |
| GET | `/api/images` | List images |
| POST | `/api/images` | Add image |

## Deployment

**Frontend**: Deploy `frontend/` to Vercel  
**Backend**: Deploy `backend/` to Render
