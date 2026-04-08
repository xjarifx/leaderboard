# Leaderboard Codebase Documentation

## 1. System Overview

This repository contains a full-stack celebrity rating application:

- Frontend: React + Vite + TypeScript
- Backend: Express + TypeScript + Prisma Client
- Database: PostgreSQL
- Image hosting: ImageKit

High-level flow:

1. A participant registers or logs in.
2. Backend issues a JWT.
3. Frontend stores token in localStorage and sends it via Authorization header.
4. Participant starts a rating session.
5. Backend creates an ordered session queue from all available images.
6. Participant rates images one by one until session completion.
7. Leaderboard aggregates ratings by celebrity name.

---

## 2. Repository Structure

```text
leaderboard/
├─ backend/
│  ├─ prisma/schema.prisma
│  ├─ src/
│  │  ├─ index.ts
│  │  ├─ lib/prisma.ts
│  │  ├─ middleware/auth.ts
│  │  ├─ routes/
│  │  │  ├─ auth.ts
│  │  │  ├─ images.ts
│  │  │  ├─ leaderboard.ts
│  │  │  ├─ sessionDetails.ts
│  │  │  └─ sessions.ts
│  │  └─ scripts/resetAndSeedImages.ts
│  ├─ package.json
│  └─ render.yaml
├─ frontend/
│  ├─ src/
│  │  ├─ App.tsx
│  │  ├─ main.tsx
│  │  ├─ index.css
│  │  ├─ lib/
│  │  │  ├─ api.ts
│  │  │  └─ auth.ts
│  │  └─ pages/
│  │     ├─ Login.tsx
│  │     ├─ Register.tsx
│  │     ├─ Session.tsx
│  │     ├─ SessionComplete.tsx
│  │     └─ Leaderboard.tsx
│  ├─ package.json
│  ├─ vite.config.ts
│  └─ vercel.json
├─ images/
├─ docs/
│  └─ CODEBASE.md
└─ README.md
```

---

## 3. Backend Architecture

### 3.1 Entry Point

- File: backend/src/index.ts
- Responsibilities:
  - Loads environment variables
  - Configures CORS and JSON parsing
  - Mounts API route modules
  - Exposes health endpoint: GET /api/health

### 3.2 Database Access

- File: backend/src/lib/prisma.ts
- Uses Prisma Client with pg adapter.
- Reads DATABASE_URL from environment.
- Handles sslmode from connection string and adjusts TLS behavior.

### 3.3 Auth Middleware

- File: backend/src/middleware/auth.ts
- JWT-based authentication.
- authenticate middleware validates Bearer token and adds:
  - participantId
  - studentId
    to request object.

### 3.4 Route Modules

#### auth.ts

- POST /api/auth/register
  - Creates participant account with bcrypt-hashed password.
  - Returns JWT + participant summary.
- POST /api/auth/login
  - Verifies credentials.
  - Returns JWT + participant summary.

#### sessions.ts

- GET /api/sessions
  - Returns participant sessions including queue and ratings.
- POST /api/sessions
  - Creates a new session.
  - Builds session queue from all images via shuffleNoConsecutive().
  - Queue generation now falls back to remaining groups to ensure all images are included.

#### sessionDetails.ts

- GET /api/sessions/:id/current
  - Returns current image and progress state.
- POST /api/sessions/:id/rate
  - Creates rating + advances current index in one transaction.
- GET /api/sessions/:id/ratings
  - Returns all ratings for the session.

#### images.ts

- GET /api/images
  - Lists images ordered by celebrity_name.
- POST /api/images
  - Adds a new image record.

#### leaderboard.ts

- GET /api/leaderboard
  - Aggregates ratings by celebrity_name.
  - Returns average score, rating count, and one representative image URL.

---

## 4. Data Model (Prisma)

Defined in backend/prisma/schema.prisma.

### Image

- celebrity_name
- image_url

### Participant

- student_id (unique)
- name
- password (hashed)

### Session

- participant_id
- current_index
- is_completed

### SessionQueue

- session_id
- image_id
- order_index

### Rating

- session_id
- image_id
- rating
- Unique constraint: (session_id, image_id)

---

## 5. Frontend Architecture

### 5.1 Routing

- File: frontend/src/App.tsx
- Public routes:
  - /login
  - /register
- Protected routes (JWT required):
  - /session
  - /session/complete
  - /leaderboard

### 5.2 API Client

- File: frontend/src/lib/api.ts
- Base URL behavior:
  - Uses VITE_API_URL when provided, appending /api
  - Falls back to /api for same-origin/proxy usage
- Automatically adds Authorization header when token exists.

### 5.3 Auth Storage

- File: frontend/src/lib/auth.ts
- Stores token, participant profile, and current session id in localStorage.

### 5.4 Page Responsibilities

- Login.tsx: sign in and token persistence
- Register.tsx: account creation and token persistence
- Session.tsx: active rating loop, progress bar, submission
- SessionComplete.tsx: completed session summary and per-image ratings
- Leaderboard.tsx: ranked aggregate scores

---

## 6. Session and Progress Logic

1. Frontend resolves existing incomplete session or creates a new one.
2. Backend session queue is built from all current image rows.
3. Progress payload includes:
   - current = session.current_index + 1
   - total = session.session_queue.length
4. Rating submission increments current_index.
5. Session is marked completed when current_index reaches queue length.

Notes:

- Existing sessions keep their original queue length.
- If image catalog changes, only newly created sessions use the new image set.

---

## 7. Seeding and Reset Operations

### Script

- File: backend/src/scripts/resetAndSeedImages.ts
- npm script: npm run db:reset-seed-images

What it does:

1. Reads local files from ../images
2. Uploads each image to ImageKit
3. Clears app tables in FK-safe order
4. Inserts uploaded image URLs into Image table

Required backend env vars for this script:

- IMAGEKIT_PUBLIC_KEY
- IMAGEKIT_PRIVATE_KEY
- IMAGEKIT_URL_ENDPOINT
- DATABASE_URL

For a user-data-only reset (keep images), clear:

- Rating
- SessionQueue
- Session
- Participant

---

## 8. Environment Variables

### Backend (.env)

- DATABASE_URL
- JWT_SECRET
- PORT
- FRONTEND_URL
- IMAGEKIT_PUBLIC_KEY
- IMAGEKIT_PRIVATE_KEY
- IMAGEKIT_URL_ENDPOINT

### Frontend (.env)

- VITE_API_URL

---

## 9. Local Development

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

---

## 10. Deployment Notes

### Backend (Render)

- Service root should be backend/
- Start command: npm start
- Build command should run dependency install and compile.
- Current backend build script already does this:

```bash
npm run build
# internally: npm ci --include=dev && tsc
```

### Frontend (Vercel)

- Build output: dist
- API rewrite should forward /api/\* to backend URL.

---

## 11. Known Behavior and Constraints

- Leaderboard groups by celebrity_name, not by image id.
- JWT secret currently falls back to a default in code if not configured; production should always set JWT_SECRET.
- API uses localStorage token strategy (no refresh tokens).

---

## 12. Suggested Future Improvements

- Add migration files and a formal seed strategy under prisma/.
- Add backend input validation schema layer (e.g., Zod).
- Add tests for session creation and queue generation.
- Add centralized error response typing in frontend API client.
- Replace deprecated imagekit package with @imagekit/nodejs.
