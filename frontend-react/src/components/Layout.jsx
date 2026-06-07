// frontend-react/src/components/Layout.jsx
// ═══════════════════════════════════════════════════════
// Shared layout wrapper: Navbar at top, page content in
// <main>, Footer at bottom. Used by all public-facing routes
// via <Route element={<Layout />}> in App.jsx.
// ═══════════════════════════════════════════════════════

import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  const { pathname } = useLocation()

  // Scroll to top on route change
  // (React Router v6 doesn't do this automatically)
  // We use key={pathname} on the Outlet to remount and scroll
  return (
    <>
      <Navbar />
      <main id="main-content" role="main">
        {/* key causes scroll-to-top on navigation */}
        <Outlet key={pathname} />
      </main>
      <Footer />
    </>
  )
}
