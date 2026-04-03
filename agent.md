# Project Migration: Next.js → React/Vite + Node.js/Express/Prisma

## Overview
We are rewriting the existing Next.js project into a separate frontend and backend architecture:

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Prisma 7

## Goals
- Decouple frontend from backend
- Improve deployment flexibility
- Maintain existing functionality

## Decisions
1. **Database**: Same database (PostgreSQL via Aiven)
2. **Auth**: JWT
3. **API**: REST
4. **State**: No state management library (React built-in state only)
5. **Deploy**: Vercel (frontend), Render (backend)

## Current Structure
- `/frontend` - React + Vite + Tailwind CSS
- `/backend` - Node.js + Express + Prisma 7
- `/app` - Original Next.js code (deprecated)

## Migration Status: COMPLETE

### Frontend Features
- Login/Register pages
- Session page with image rating
- Session complete page with summary
- Leaderboard page
- Protected routes

### Backend API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/sessions` - List user sessions
- `POST /api/sessions` - Create new session
- `GET /api/sessions/:id/current` - Get current image
- `POST /api/sessions/:id/rate` - Rate image
- `GET /api/sessions/:id/ratings` - Get session ratings
- `GET /api/leaderboard` - Get leaderboard
- `GET /api/images` - List images
- `POST /api/images` - Add image

## Deployment Setup
- **Frontend**: Vercel (configure `VITE_API_URL` env var)
- **Backend**: Render (configure `DATABASE_URL`, `JWT_SECRET` env vars)
