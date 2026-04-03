# Agent Guidelines for Leaderboard Project

## Project Overview

This is a monorepo with:
- **Root**: Next.js App Router application (app/, lib/, tests/)
- **Backend/**: Standalone Express API server for additional endpoints
- **Frontend/**: Vite + React SPA (separate from Next.js)
- **Prisma**: Database ORM with PostgreSQL (schema in prisma/schema.prisma)

## Build/Lint/Test Commands

### Root (Next.js App)
```bash
npm run dev          # Run both backend and frontend concurrently
npm run dev:backend   # Start backend server (port 3001)
npm run dev:frontend  # Start frontend dev server (port 5173)
npm run install:all   # Install dependencies for all packages
npm run build:backend # Build backend TypeScript
npm run build:frontend # Build frontend
```

### Testing
```bash
npm test                    # Run all tests (vitest)
npm test -- <filename>      # Run single test file
npm test -- --run          # Run tests once (non-watch mode)
npm test -- ratings.test.ts # Run specific test file
```

### Frontend (frontend/)
```bash
cd frontend
npm run dev      # Vite dev server
npm run build    # TypeScript check + Vite build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

### Backend (backend/)
```bash
cd backend
npm run dev              # tsx watch mode
npm run build            # TypeScript compilation
npm run db:generate      # Prisma generate
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations
```

## Code Style Guidelines

### TypeScript Configuration
- **Root tsconfig**: Strict mode enabled, ES2017 target, `@/*` path alias
- **Frontend tsconfig**: Strict mode, noUnusedLocals, noUnusedParameters
- Always use explicit types; avoid `any` unless necessary (use eslint-disable comment)

### Imports
- Use `import type { Type }` for type-only imports
- Use named exports where possible
- Import order: external packages → internal modules → types → utils
- Prisma client: `import { prisma } from "@/lib/prisma"`

### Naming Conventions
- **Variables/Functions**: camelCase (`createSession`, `studentId`)
- **Types/Interfaces**: PascalCase (`Participant`, `SessionQueue`)
- **Database columns**: snake_case (`student_id`, `created_at`)
- **Constants**: SCREAMING_SNAKE_CASE for truly immutable values
- **Files**: kebab-case for routes (`session-details.ts`), PascalCase for components (`Login.tsx`)

### Formatting
- 2-space indentation
- Single quotes for strings
- No semicolons at line ends (ESLint/Prettier handles this)
- Trailing commas in multiline objects/arrays
- Max line length: 100 characters (soft)

### Error Handling
- Use `try/catch` blocks for async operations
- Return appropriate HTTP status codes:
  - 200: Success
  - 201: Created
  - 400: Bad request (validation errors)
  - 401: Unauthorized
  - 404: Not found
  - 409: Conflict (duplicate)
  - 500: Server error
- Never expose internal error details to client
- Log errors server-side with `console.error`

### Authentication
- JWT tokens with 7-day expiration
- Token passed via `Authorization: Bearer <token>` header
- Use `authenticate()` from `@/lib/auth` for protected routes
- Passwords hashed with bcrypt (10 salt rounds)

### Database (Prisma)
- Generated client at `@/app/generated/prisma`
- Use PrismaClient singleton pattern (globalForPrisma for dev hot reload)
- Schema uses snake_case for DB columns, camelCase for TypeScript
- Prisma generates types from schema: `prisma.participant.findUnique()`

### API Routes (Next.js App Router)
- Location: `app/api/<resource>/route.ts`
- Named exports for HTTP methods: `export async function GET`, `POST`, etc.
- Return `NextResponse.json(data, { status: X })`
- Validate input early, return 400 for invalid data
- Authenticate before processing protected endpoints

### Testing (Vitest)
- Import from `vitest`: `import { describe, it, expect, beforeAll, afterAll } from "vitest"`
- Test file naming: `*.test.ts`
- Use `makeRequest()` helper from `tests/helpers.ts`
- Each test file handles its own cleanup in `beforeAll`/`afterAll`
- Use unique test IDs (e.g., `TEST_SESSION_001`)
- Test auth: return 401 when token missing/invalid
- Test validation: return 400 for invalid input
- Disconnect Prisma at end: `await prisma.$disconnect()`

### Frontend (React + Vite)
- Use functional components with hooks
- Use React Router v7 for routing
- Access token via `getToken()` from `src/lib/auth.ts`
- API calls via `api` object from `src/lib/api.ts`
- Error handling: catch errors and display user-friendly messages
- Loading states for async operations

## Directory Structure

```
leaderboard/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/
│   │   ├── sessions/
│   │   └── leaderboard/
│   └── generated/prisma/  # Prisma generated client
├── backend/src/           # Express backend (standalone API)
│   ├── routes/
│   ├── middleware/
│   └── lib/
├── frontend/src/          # Vite React app
│   ├── pages/
│   └── lib/
├── lib/                   # Shared utilities (auth, api, prisma)
├── prisma/
│   └── schema.prisma      # Database schema
├── tests/                 # Vitest tests
│   ├── helpers.ts
│   └── setup.ts
└── scripts/               # Utility scripts
```

## Environment Variables

Required in `.env`:
```
DATABASE_URL=postgresql://...
JWT_SECRET=<secret-key>
IMAGEKIT_URL_PUBLIC=...
IMAGEKIT_URL_PRIVATE=...
IMAGEKIT_PRIVATE_KEY=...
```
