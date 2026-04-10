# Leaderboard App

Full-stack image rating application with JWT auth, session-based scoring, and a global leaderboard.

## Tech Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS + React Router
- Backend: Node.js + Express + TypeScript + Prisma
- Database: PostgreSQL
- Image hosting: ImageKit

## Repository Structure

```text
.
├── backend/
├── frontend/
├── images/
├── docs/
└── AGENTS.md
```

## Prerequisites

- Node.js 20.x
- npm
- PostgreSQL database

## Quick Start

### 1. Start Backend

```bash
cd backend
npm install
npm run db:generate
npm run dev
```

Important: run `npm run db:generate` once after install (and again after Prisma schema changes).

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` by default and backend runs on `http://localhost:3001`.

## Environment Variables

### Backend (`backend/.env`)

- `DATABASE_URL`
- `JWT_SECRET`
- `PORT` (optional, default: `3001`)
- `FRONTEND_URL` (optional, default: `http://localhost:5173`)
- `IMAGEKIT_PUBLIC_KEY` (required for reset/seed script)
- `IMAGEKIT_PRIVATE_KEY` (required for reset/seed script)
- `IMAGEKIT_URL_ENDPOINT` (required for reset/seed script)

### Frontend (`frontend/.env`)

- `VITE_API_URL` (optional)

If `VITE_API_URL` is set, API calls go to `${VITE_API_URL}/api`.
If not set, API calls go to `/api`.

## Commands

### Backend (`backend/`)

```bash
npm run dev                   # tsx watch src/index.ts
npm run build                 # npm ci + prisma generate + tsc
npm start                     # run dist/index.js
npm run db:generate           # prisma generate
npm run db:push               # prisma db push
npm run db:migrate            # prisma migrate dev
npm run db:reset-seed-images  # reset DB + reseed from ../images
```

### Frontend (`frontend/`)

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## API Surface

| Method | Endpoint                  | Auth | Purpose                      |
| ------ | ------------------------- | ---- | ---------------------------- |
| POST   | /api/auth/register        | No   | Register participant         |
| POST   | /api/auth/login           | No   | Login participant            |
| GET    | /api/sessions             | Yes  | List participant sessions    |
| POST   | /api/sessions             | Yes  | Create new session queue     |
| GET    | /api/sessions/:id/current | Yes  | Get current image + progress |
| POST   | /api/sessions/:id/rate    | Yes  | Submit a rating              |
| GET    | /api/sessions/:id/ratings | Yes  | Get session ratings          |
| GET    | /api/images               | Yes  | List image catalog           |
| POST   | /api/images               | Yes  | Add image metadata           |
| GET    | /api/leaderboard          | Yes  | Get aggregated ranking       |
| GET    | /api/health               | No   | Health check                 |

## Deploy Notes

- Backend deploy root: `backend/`
- Frontend deploy root: `frontend/`
- Backend build script already runs Prisma generate during build.

## Additional Docs

- `docs/CODEBASE.md` for deeper architecture and route details.
- `AGENTS.md` for concise command and setup guidance.
