# AGENTS.md

Quick runbook for contributors and coding agents working in this repository.

## Commands

### Backend (`backend/`)

```bash
cd backend
npm install
npm run db:generate            # required before first local dev run
npm run dev                    # tsx watch server on port 3001 (default)
npm run build                  # npm ci + prisma generate + tsc
npm start                      # runs dist/index.js
npm run db:push                # push schema changes
npm run db:migrate             # create/apply migration in dev
npm run db:reset-seed-images   # reset DB and reseed using ../images
```

### Frontend (`frontend/`)

```bash
cd frontend
npm install
npm run dev                    # Vite dev server on port 5173 (default)
npm run build                  # tsc + vite build
npm run preview                # preview built app
npm run lint                   # ESLint
```

## Order Matters

- Always run backend `npm install` before `npm run db:generate`.
- Run backend `npm run db:generate` before first `npm run dev`.
- Backend `npm run build` performs a clean install (`npm ci`).

## Seeding Notes

- Seed source directory is `../images/` from backend root.
- `npm run db:reset-seed-images` requires:
  - `DATABASE_URL`
  - `IMAGEKIT_PUBLIC_KEY`
  - `IMAGEKIT_PRIVATE_KEY`
  - `IMAGEKIT_URL_ENDPOINT`

## Environment Variables

- Backend `.env`: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `FRONTEND_URL`, ImageKit keys
- Frontend `.env`: `VITE_API_URL` (optional; defaults to relative `/api` behavior)

## Architecture Snapshot

- Monorepo with `backend/` and `frontend/`
- Backend: Express + Prisma + PostgreSQL + JWT
- Frontend: React + Vite + Tailwind + React Router
- Auth flow: JWT stored client-side and sent via `Authorization` header
- Media hosting: ImageKit

## Fast Verification

- Backend health endpoint: `GET /api/health`
- Frontend dev URL: `http://localhost:5173`
- Backend dev URL: `http://localhost:3001`
