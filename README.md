# Leaderboard App

Full-stack celebrity rating application.

## Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript + Prisma
- Database: PostgreSQL
- Image hosting: ImageKit

## Quick Start

### 1) Backend

```bash
cd backend
npm install
npm run db:generate
npm run dev
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### backend/.env

- DATABASE_URL
- JWT_SECRET
- PORT (optional, default 3001)
- FRONTEND_URL (optional, default http://localhost:5173)
- IMAGEKIT_PUBLIC_KEY (for seed/upload script)
- IMAGEKIT_PRIVATE_KEY (for seed/upload script)
- IMAGEKIT_URL_ENDPOINT (for seed/upload script)

### frontend/.env

- VITE_API_URL (optional)
  - If set, frontend calls ${VITE_API_URL}/api
  - If not set, frontend calls /api

## Main Commands

### Backend

```bash
npm run dev
npm run build
npm start
npm run db:generate
npm run db:push
npm run db:migrate
npm run db:reset-seed-images
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
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

- Backend deploy root: backend/
- Frontend deploy root: frontend/
- Backend build script is self-contained and installs needed dependencies before TypeScript compile.

## Documentation

See full technical documentation in:

- docs/CODEBASE.md
