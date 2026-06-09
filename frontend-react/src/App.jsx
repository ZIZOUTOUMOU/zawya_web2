// frontend-react/src/App.jsx
// ═══════════════════════════════════════════════════════
// Root application component with React Router v6 setup.
// All routes are defined here. The Layout wraps every page
// providing the Navbar and Footer.
// ═══════════════════════════════════════════════════════

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from './components/Layout'
import PageLoader from './components/ui/PageLoader'
import { LanguageProvider } from './context/LanguageContext'
import './styles/global.css'

// ─── Lazy-load pages (code splitting for performance) ─────────────
const HomePage         = lazy(() => import('./pages/HomePage'))
const AboutPage        = lazy(() => import('./pages/AboutPage'))
const QuranSchoolPage  = lazy(() => import('./pages/QuranSchoolPage'))
const ManuscriptsPage  = lazy(() => import('./pages/ManuscriptsPage'))
const SewingPage       = lazy(() => import('./pages/SewingPage'))
const ActivitiesPage   = lazy(() => import('./pages/ActivitiesPage'))
const AssociationPage  = lazy(() => import('./pages/AssociationPage'))
const ContactPage      = lazy(() => import('./pages/ContactPage'))

// Library section — reuses existing backend, now as a React component
const LibraryPage      = lazy(() => import('./pages/library/LibraryPage'))
const BookDetailPage   = lazy(() => import('./pages/library/BookDetailPage'))
const ReadingListPage  = lazy(() => import('./pages/library/ReadingListPage'))

// Admin section
const AdminLoginPage   = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminDashboard   = lazy(() => import('./pages/admin/AdminDashboard'))

// ─── App ──────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
          {/* ── Public site — all wrapped in Layout (Navbar + Footer) ── */}
          <Route element={<Layout />}>
            {/* Home */}
            <Route path="/"              element={<HomePage />} />

            {/* About the Zawiya */}
            <Route path="/التعريف"       element={<AboutPage />} />
            <Route path="/about"         element={<AboutPage />} />

            {/* Quranic School */}
            <Route path="/المدرسة"       element={<QuranSchoolPage />} />
            <Route path="/quran-school"  element={<QuranSchoolPage />} />

            {/* Manuscripts */}
            <Route path="/المخطوطات"     element={<ManuscriptsPage />} />
            <Route path="/manuscripts"   element={<ManuscriptsPage />} />

            {/* Sewing Section */}
            <Route path="/الخياطة"       element={<SewingPage />} />
            <Route path="/sewing"        element={<SewingPage />} />

            {/* General Activities */}
            <Route path="/الأنشطة"       element={<ActivitiesPage />} />
            <Route path="/activities"    element={<ActivitiesPage />} />

            {/* The Association */}
            <Route path="/الجمعية"       element={<AssociationPage />} />
            <Route path="/association"   element={<AssociationPage />} />

            {/* Library (reuses existing backend) */}
            <Route path="/المكتبة"       element={<LibraryPage />} />
            <Route path="/library"       element={<LibraryPage />} />
            <Route path="/المكتبة/:id"   element={<BookDetailPage />} />
            <Route path="/الكتاب/:id"    element={<BookDetailPage />} />
            <Route path="/الكتب/:id"     element={<BookDetailPage />} />
            <Route path="/library/:id"   element={<BookDetailPage />} />

            {/* Reading List */}
            <Route path="/قائمة-القراءة" element={<ReadingListPage />} />
            <Route path="/reading-list"  element={<ReadingListPage />} />

            {/* Contact */}
            <Route path="/التواصل"       element={<ContactPage />} />
            <Route path="/contact"       element={<ContactPage />} />
          </Route>

          {/* ── Admin — no shared Layout ── */}
          <Route path="/admin/login"   element={<AdminLoginPage />} />
          <Route path="/admin"         element={<AdminDashboard />} />
          <Route path="/admin/*"       element={<AdminDashboard />} />

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </LanguageProvider>
    </BrowserRouter>
  )
}
