# 🕌 الزاوية — المركز الثقافي والتعليمي
**Zawiya Digital Center** — Full-stack web platform

React frontend + Node.js/Express backend + SQLite database.
Everything works out of the box — clone, install, seed, run.

---

## ⚡ Quick Start (5 commands)

```bash
# 1. Install backend dependencies (from project root)
npm install

# 2. Install React frontend dependencies
cd frontend-react && npm install && cd ..

# 3. Initialize the database
npm run init-db

# 4. Seed with admin account + 12 sample books
npm run seed

# 5a. Start backend API (Terminal 1)
npm run dev          # → http://localhost:3000

# 5b. Start React frontend (Terminal 2)
cd frontend-react && npm run dev    # → http://localhost:5173
```

Open **http://localhost:5173** in your browser. ✅

---

## 🔑 Default Admin Credentials

| Field    | Value                |
|----------|----------------------|
| URL      | http://localhost:5173/admin |
| Email    | `admin@zawiya.com`   |
| Password | `Admin123!`          |

**Change these** in `.env` before deploying.

---

## 📁 Project Structure

```
zawiya/
├── backend/
│   ├── server.js              ← Express entry point
│   ├── database/
│   │   ├── db.js              ← SQLite (sql.js) layer
│   │   ├── schema.sql         ← All table definitions
│   │   ├── init.js            ← npm run init-db
│   │   ├── seed.js            ← npm run seed
│   │   └── zawiya.db          ← Created on first run (gitignored)
│   ├── routes/
│   │   ├── books.js           ← Public API (GET /api/books, etc.)
│   │   ├── auth.js            ← Login / logout / me
│   │   └── admin.js           ← Protected CRUD for books
│   ├── middleware/
│   │   ├── auth.js            ← JWT requireAuth middleware
│   │   ├── validate.js        ← express-validator chains
│   │   └── upload.js          ← Multer file upload config
│   ├── services/
│   │   ├── imageResize.js     ← Jimp cover/preview processing
│   │   └── openLibrary.js     ← Open Library API client
│   └── uploads/               ← User-uploaded files (gitignored)
│       ├── covers/
│       ├── previews/
│       └── pdfs/
├── frontend-react/
│   ├── index.html             ← lang="ar" dir="rtl"
│   ├── vite.config.js         ← Dev proxy /api → :3000
│   ├── package.json
│   └── src/
│       ├── App.jsx            ← React Router routes
│       ├── main.jsx
│       ├── styles/global.css  ← RTL design system
│       ├── services/api.js    ← All API calls
│       ├── components/        ← Navbar, Footer, Layout, UI
│       └── pages/             ← One file per section
│           ├── HomePage.jsx
│           ├── AboutPage.jsx
│           ├── QuranSchoolPage.jsx
│           ├── ManuscriptsPage.jsx
│           ├── SewingPage.jsx
│           ├── ActivitiesPage.jsx
│           ├── AssociationPage.jsx
│           ├── ContactPage.jsx
│           ├── library/
│           │   ├── LibraryPage.jsx
│           │   └── BookDetailPage.jsx
│           └── admin/
│               ├── AdminLoginPage.jsx
│               └── AdminDashboard.jsx
├── package.json               ← Backend scripts
├── .env                       ← All configuration
└── .gitignore
```

---

## 🌐 API Reference

### Public (no auth)

| Method | Endpoint                         | Description                            |
|--------|----------------------------------|----------------------------------------|
| GET    | `/api/books`                     | Paginated list — filters: `search`, `category`, `year_from`, `year_to`, `language`, `sort`, `page`, `limit` |
| GET    | `/api/books/recent`              | 8 most recently added                  |
| GET    | `/api/books/featured`            | Books marked as featured               |
| GET    | `/api/books/:id`                 | Single book detail                     |
| GET    | `/api/categories`                | All categories with book counts        |
| GET    | `/api/search?q=`                 | Fast title/author search (top 8)       |
| GET    | `/api/stats`                     | Total books, categories, authors, pages|
| GET    | `/health`                        | Server health check                    |

### Admin (JWT cookie required)

| Method | Endpoint                             | Description                       |
|--------|--------------------------------------|-----------------------------------|
| POST   | `/api/admin/login`                   | Set JWT cookie                    |
| POST   | `/api/admin/logout`                  | Clear cookie                      |
| GET    | `/api/admin/me`                      | Current admin info                |
| GET    | `/api/admin/dashboard`               | Stats + storage info              |
| GET    | `/api/admin/logs`                    | Last 50 activity log entries      |
| GET    | `/api/admin/books`                   | All books (including hidden)      |
| POST   | `/api/admin/books`                   | Add book (multipart/form-data)    |
| POST   | `/api/admin/books/:id?_method=PUT`   | Update book (multipart)           |
| PUT    | `/api/admin/books/:id`               | Update book (JSON)                |
| DELETE | `/api/admin/books/:id`               | Delete book + files               |
| POST   | `/api/admin/books/fetch-openlibrary` | Auto-fill from Open Library       |

All responses use the envelope:
```json
{ "success": true, "data": { ... }, "meta": { ... }, "error": null }
```

---

## ✏️ Customising Content

Every page has `↓↓↓ REPLACE WITH YOUR TEXT ↓↓↓` markers.

### Swap placeholder text
Open `frontend-react/src/pages/AboutPage.jsx` and replace:
```jsx
<p>أضف هنا نصاً تعريفياً بالزاوية...</p>
```
with your real Arabic text.

### Add real images
1. Drop photos into `frontend-react/public/images/`
2. Find `img-placeholder` divs in any page and uncomment the `<img>` tag:
```jsx
// Before:
<div className="img-placeholder">
  <span>🕌</span>
</div>

// After:
<img src="/images/zawiya-front.jpg" alt="مبنى الزاوية" />
```

### Add team members (AssociationPage.jsx)
Edit the `TEAM` array:
```jsx
const TEAM = [
  { emoji: '👤', name: 'الشيخ محمد بن علي', role: 'رئيس الجمعية' },
  // ...
]
```

### Add manuscripts (ManuscriptsPage.jsx)
Edit the `MANUSCRIPTS` array — or connect it to a backend API (see README section below).

### Update contact details (ContactPage.jsx)
Search for `zawiya@example.com` and `+213 XX XX XX XX` and replace.

---

## 🚀 Production Deployment

### Build React
```bash
cd frontend-react
npm run build
# Creates: frontend-react/dist/
```

### Configure .env for production
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=<48-char random string>
FRONTEND_URL=https://yourdomain.com
```

### Start
```bash
npm start
# Express serves the React build from frontend-react/dist/
# All /api/* routes remain available
```

### Generate a strong JWT secret
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## 🔧 Extending the Backend

### Add a Manuscripts table

In `backend/database/schema.sql`, append:
```sql
CREATE TABLE IF NOT EXISTS manuscripts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  author      TEXT,
  date_text   TEXT,
  subject     TEXT,
  description TEXT,
  image_url   TEXT,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

In `backend/routes/books.js`, add:
```js
router.get('/manuscripts', (req, res) => {
  const rows = db.prepare('SELECT * FROM manuscripts ORDER BY created_at DESC').all()
  res.json({ success: true, data: rows, meta: null })
})
```

In `ManuscriptsPage.jsx`, replace the static array:
```jsx
useEffect(() => {
  fetch('/api/manuscripts')
    .then(r => r.json())
    .then(r => { if (r.success) setManuscripts(r.data) })
}, [])
```

### Enable real email from ContactPage

Install nodemailer: `npm install nodemailer`

Create `backend/routes/contact.js`:
```js
const nodemailer = require('nodemailer')
router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body
  const t = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } })
  await t.sendMail({ from: email, to: process.env.ADMIN_EMAIL, subject: `[الزاوية] ${subject}`, text: `${name}\n\n${message}` })
  res.json({ success: true })
})
```

In `server.js`, add: `app.use('/api', require('./routes/contact'))`

In `ContactPage.jsx`, uncomment the `fetch('/api/contact', ...)` block.

---

## 📦 Tech Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Frontend    | React 18 + Vite 5 + React Router v6     |
| Styling     | CSS Modules + RTL design system (Cairo) |
| Backend     | Node.js 18+ + Express 4                 |
| Database    | SQLite via sql.js (no native binaries)  |
| Auth        | JWT in httpOnly cookie + bcryptjs       |
| Uploads     | Multer + Jimp image resizing            |
| External    | Open Library API (book metadata)        |
| Dev proxy   | Vite proxy → Express :3000              |
