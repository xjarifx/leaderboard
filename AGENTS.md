# AGENTS.md

## Commands

### Backend
```bash
cd backend
npm install
npm run db:generate   # Required before first dev run
npm run dev          # Starts Express on port 3001
npm run build        # npm ci + prisma generate + tsc
npm start            # Runs compiled dist/index.js
npm run db:push      # Push schema to database
npm run db:reset-seed-images  # Reset DB + reseed from ../images
```

### Frontend
```bash
cd frontend
npm install
npm run dev          # Vite dev server (port 5173)
npm run build        # tsc + vite build
npm run lint         # ESLint check
```

## Order Matters
- Backend: always run `db:generate` after `npm install` before `dev`
- Backend build auto-runs `db:generate` (includes `npm ci`)

## Seeding
- `npm run db:reset-seed-images` reads from `../images/` directory
- Requires env vars: `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`, `DATABASE_URL`

## Env Variables
- Backend `.env`: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `FRONTEND_URL`, ImageKit keys
- Frontend `.env`: `VITE_API_URL` (optional, defaults to `/api`)

## Architecture
- Monorepo with `backend/` and `frontend/` directories
- Backend: Express + Prisma + PostgreSQL + JWT
- Frontend: React + Vite + Tailwind + React Router
- Auth: JWT in localStorage, sent via Authorization header
- Image hosting: ImageKit
