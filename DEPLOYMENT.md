# Deployment Guide: Unified Single-Server App

## Runtime Model
- Frontend and backend run from one Node.js + Express server.
- Frontend static build is served by backend from `frontend/dist`.
- API endpoints are served from `/api/*` on the same origin.
- Database remains MongoDB Atlas via `MONGO_URI`.

## Required Environment
1. In `backend/.env`, set:
   - `MONGO_URI` (MongoDB Atlas connection string)

## Build + Run (From Repo Root)
1. Install dependencies:
   ```sh
   npm --prefix backend install
   npm --prefix frontend install
   ```
2. Build frontend assets:
   ```sh
   npm run build
   ```
3. Start unified server:
   ```sh
   npm start
   ```

## PM2 (Production Process Manager)
1. Start app with PM2:
   ```sh
   npm run pm2:start
   ```
2. Persist PM2 process list:
   ```sh
   npm run pm2:save
   ```
3. Configure PM2 startup on boot:
   ```sh
   npm run pm2:startup
   ```
4. Restart app after deploy:
   ```sh
   npm run pm2:restart
   ```

## Server Binding (Enforced)
- Host: `0.0.0.0`
- Port: `3015`

## Session/Auth Model
- No internal login/signup/JWT auth routes.
- Frontend reads URL query params:
  - `token`
  - `student_id`
  - `session_id`
- These values are stored in `sessionStorage` and sent to backend.

## Session APIs
- `POST /api/start-session`
- `POST /api/update-progress`
- `POST /api/submit-session`

Final submit forwards metrics to:
- `https://kaushik-dev.online/api/recommend/`

## Notes
- CORS middleware is removed because frontend/backend are same-origin.
- Do not install local MongoDB; use Atlas only.
- If session submission fails due network/API errors, payload is persisted and retried on next app load for the same session.
