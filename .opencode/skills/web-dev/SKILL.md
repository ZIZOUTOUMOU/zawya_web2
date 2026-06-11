---
name: web-dev
description: Zawiya Digital Center full-stack web development
---

## Stack
- **Backend**: Node.js + Express (backend/server.js)
- **Frontend**: React + Vite (frontend-react/)
- **Database**: SQLite via sql.js (backend/database/)
- **Auth**: JWT with bcryptjs

## Conventions
- Backend routes in `backend/routes/`, middleware in `backend/middleware/`
- React components in `frontend-react/src/`
- Run `npm run dev` to start the dev server
- Run `npm run seed` to populate the database
- API routes prefixed with `/api/`
- Use `helmet` and `cors` middleware on all routes
- Sanitize HTML inputs with `sanitize-html`
- Validate with `express-validator`
