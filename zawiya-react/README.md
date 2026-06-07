# 🕌 Zawiya React Migration — Complete Guide

## Quick Start (Step by Step)

### Step 1 — Copy the new frontend folder

Create a `frontend-react/` folder at your project root and place these files inside it:
- `index.html`
- `vite.config.js`
- `package.json`
- `src/` (all the .jsx and .css files)

Your project structure should be:
```
your-project/
├── backend/
│   └── server.js          ← Replace with the new server.js provided
├── frontend/              ← Keep your old Vanilla JS for reference
├── frontend-react/        ← NEW React app lives here
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── styles/
│       │   └── global.css
│       ├── components/
│       │   ├── Layout.jsx
│       │   ├── Navbar.jsx
│       │   ├── Navbar.module.css
│       │   ├── Footer.jsx
│       │   ├── Footer.module.css
│       │   └── ui/
│       │       ├── PageLoader.jsx
│       │       ├── SectionHero.jsx
│       │       └── SectionHero.module.css
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── HomePage.module.css
│       │   ├── SectionPage.module.css  ← shared by About, Manuscripts, etc.
│       │   ├── AboutPage.jsx
│       │   ├── QuranSchoolPage.jsx
│       │   ├── ManuscriptsPage.jsx
│       │   ├── SewingPage.jsx
│       │   ├── ActivitiesPage.jsx
│       │   ├── AssociationPage.jsx
│       │   ├── ContactPage.jsx
│       │   ├── library/
│       │   │   ├── LibraryPage.jsx
│       │   │   ├── Library.module.css
│       │   │   ├── BookDetailPage.jsx
│       │   │   └── BookDetail.module.css
│       │   └── admin/
│       │       ├── AdminLoginPage.jsx
│       │       ├── AdminDashboard.jsx
│       │       └── Admin.module.css
│       └── services/
│           └── api.js
└── package.json           ← unchanged (backend)
```

---

### Step 2 — Install React dependencies

```bash
cd frontend-react
npm install
```

---

### Step 3 — Update the backend server.js

Replace `backend/server.js` with the new version provided (`backend-server.js`).
The key change: **CORS now allows `localhost:5173`** (Vite's dev server).

---

### Step 4 — Add environment variable (optional)

In your root `.env`, add:
```env
FRONTEND_URL=https://your-production-domain.com
```

---

### Step 5 — Run both servers

**Terminal 1 — Backend (Express API):**
```bash
# From project root
npm run dev
# → Express on http://localhost:3000
```

**Terminal 2 — Frontend (React/Vite):**
```bash
# From frontend-react/
npm run dev
# → Vite on http://localhost:5173
```

Open your browser at: **http://localhost:5173** ✅

---

## How the API Proxy Works

In `vite.config.js`, any request to `/api/...` or `/uploads/...` from
the React app is **automatically forwarded** to `localhost:3000`.

This means:
- No CORS errors during development
- `fetch('/api/books')` in React → goes to Express on port 3000
- `fetch('/uploads/covers/image.jpg')` → served from Express static files

---

## Customizing Content (Arabic Text & Images)

Every section page has clear `↓↓↓ REPLACE WITH YOUR TEXT ↓↓↓` comments.

### Adding your text:
Open the relevant file and replace placeholder `<p>` tags:
```jsx
// In AboutPage.jsx, find this block and replace:
<p>
  أضف هنا نصاً تعريفياً بالزاوية...
</p>

// With your real text:
<p>
  تأسست زاوية ورقلة عام ١٣٨٠هـ على يد الشيخ...
</p>
```

### Adding real images:
Find `img-placeholder` divs and replace with `<img>` tags:
```jsx
// Before (placeholder):
<div className="img-placeholder" style={{ minHeight: 320 }}>
  <span style={{ fontSize: '3rem' }}>🕌</span>
  <span>صورة الزاوية من الخارج</span>
</div>

// After (real image):
<img
  src="/images/zawiya-exterior.jpg"
  alt="مبنى الزاوية من الخارج"
  style={{ width: '100%', borderRadius: 'var(--radius-xl)', objectFit: 'cover' }}
/>
```

Place your images in `frontend-react/public/images/` and reference them as `/images/filename.jpg`.

---

## Routes Reference

| URL                  | Arabic Label         | Component            |
|----------------------|----------------------|----------------------|
| `/`                  | الرئيسية             | HomePage             |
| `/about`             | التعريف بالزاوية     | AboutPage            |
| `/quran-school`      | المدرسة القرآنية     | QuranSchoolPage      |
| `/manuscripts`       | المخطوطات            | ManuscriptsPage      |
| `/sewing`            | الخياطة              | SewingPage           |
| `/activities`        | أنشطة مختلفة         | ActivitiesPage       |
| `/association`       | الجمعية              | AssociationPage      |
| `/library`           | المكتبة              | LibraryPage          |
| `/library/:id`       | تفاصيل الكتاب        | BookDetailPage       |
| `/contact`           | التواصل              | ContactPage          |
| `/admin/login`       | تسجيل دخول           | AdminLoginPage       |
| `/admin`             | لوحة التحكم          | AdminDashboard       |

Arabic URL aliases also work (e.g. `/المكتبة` redirects to `/library`).

---

## Production Build

```bash
cd frontend-react
npm run build
# Creates: frontend-react/dist/

# Then in your backend .env:
NODE_ENV=production
# Express will automatically serve from frontend-react/dist/
```

---

## Adding Manuscripts from a Database

Currently `ManuscriptsPage.jsx` uses a hardcoded array. To load from the backend:

1. Create a new backend route in `backend/routes/books.js`:
```js
router.get('/manuscripts', (req, res) => {
  const rows = db.prepare('SELECT * FROM manuscripts ORDER BY date DESC').all()
  res.json({ success: true, data: rows })
})
```

2. Create the schema in `backend/database/schema.sql`:
```sql
CREATE TABLE IF NOT EXISTS manuscripts (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  title   TEXT NOT NULL,
  date    TEXT,
  subject TEXT,
  imageUrl TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

3. In `ManuscriptsPage.jsx`, replace the static array with a `useEffect` fetch:
```jsx
const [manuscripts, setManuscripts] = useState([])
useEffect(() => {
  fetch('/api/manuscripts')
    .then(r => r.json())
    .then(r => { if (r.success) setManuscripts(r.data) })
}, [])
```

---

## Contact Form Backend (Optional)

To make the contact form send real emails, add to `backend/routes/`:

```js
// backend/routes/contact.js
const nodemailer = require('nodemailer')
router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body
  // Configure with your email provider
  const transporter = nodemailer.createTransport({ /* ... */ })
  await transporter.sendMail({
    from: email,
    to: process.env.ADMIN_EMAIL,
    subject: `[الزاوية] ${subject}`,
    text: `من: ${name}\n\n${message}`
  })
  res.json({ success: true })
})
```

Then in `ContactPage.jsx`, uncomment the fetch block (Option A).

---

## Tech Stack Summary

| Layer           | Technology                          |
|-----------------|-------------------------------------|
| Frontend        | React 18 + Vite 5                   |
| Routing         | React Router v6                     |
| Styling         | CSS Modules + Global CSS variables  |
| Direction       | RTL-first (Arabic primary)          |
| Fonts           | Cairo + Amiri (Arabic), Playfair    |
| Backend         | Node.js + Express (unchanged)       |
| Database        | SQLite via sql.js (unchanged)       |
| Auth            | JWT in httpOnly cookie (unchanged)  |
| Dev proxy       | Vite proxy → Express :3000          |
