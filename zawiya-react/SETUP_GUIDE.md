# Zawiya React Migration — Complete Setup Guide

## Step 1: Terminal Commands

Run these from your **project root** (where `package.json` and `backend/` live):

```bash
# Create the React frontend alongside the existing backend
npm create vite@latest frontend-react -- --template react

# Move into the new frontend directory
cd frontend-react

# Install all dependencies
npm install

# Install routing and additional packages
npm install react-router-dom axios

# Go back to project root
cd ..
```

## Step 2: Folder Structure After Migration

```
your-project/
├── backend/                    ← Unchanged Express API
│   ├── server.js               ← Modified (see server.js changes below)
│   ├── database/
│   ├── routes/
│   ├── middleware/
│   └── services/
├── frontend-react/             ← New React app (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/         ← Shared components (Navbar, Footer, etc.)
│   │   ├── pages/              ← One file per route/section
│   │   ├── services/           ← API calls
│   │   ├── hooks/              ← Custom React hooks
│   │   └── styles/             ← Global CSS
│   ├── vite.config.js          ← API proxy config
│   └── package.json
├── frontend/                   ← Old Vanilla JS (keep until fully migrated)
└── package.json                ← Backend scripts unchanged
```

## Step 3: Run Both Servers

In **Terminal 1** (backend):
```bash
npm run dev        # Express runs on port 3000
```

In **Terminal 2** (React frontend):
```bash
cd frontend-react
npm run dev        # Vite runs on port 5173
```

Open: http://localhost:5173

## Step 4: Production Build

```bash
cd frontend-react
npm run build     # Outputs to frontend-react/dist/

# Then serve via Express static (configure server.js to point to dist/)
```
