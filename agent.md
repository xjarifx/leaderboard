# Leaderboard App - Agent Instructions

## Architecture
- **Frontend**: React + Vite + Tailwind CSS (deploys to Vercel)
- **Backend**: Node.js + Express + Prisma 7 (deploys to Render)

## Tech Decisions
1. **Database**: PostgreSQL (Aiven)
2. **Auth**: JWT
3. **API**: REST
4. **State**: React built-in state only
5. **Deploy**: Separate deployments for frontend/backend

## Structure
```
/
├── frontend/     # React app
├── backend/      # Express API
└── AGENT.md      # This file
```

## Key Files
- Frontend entry: `frontend/src/main.tsx`
- Backend entry: `backend/src/index.ts`
- Prisma schema: `backend/prisma/schema.prisma`

## Commands
```bash
# Backend
cd backend && npm run dev
npm run build  # TypeScript build

# Frontend  
cd frontend && npm run dev
npm run build  # Production build
```

## Environment Variables
- Backend: `DATABASE_URL`, `JWT_SECRET`, `PORT`
- Frontend: `VITE_API_URL`
