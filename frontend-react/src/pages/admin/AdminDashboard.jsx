// frontend-react/src/pages/admin/AdminDashboard.jsx
// لوحة الإدارة — Full admin dashboard with book CRUD

import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  adminMe, adminLogout, adminGetStats, adminGetBooks,
  adminGetLogs, adminDeleteBook, adminAddBook, adminUpdateBook,
  adminFetchOL, adminGetMessages, adminMarkMessageHandled,
  getCategories, assetUrl,
} from '../../services/api'
import PageLoader from '../../components/ui/PageLoader'
import styles from './Admin.module.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [adminUser,   setAdminUser]   = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [stats,       setStats]       = useState(null)
  const [books,       setBooks]       = useState([])
  const [filtered,    setFiltered]    = useState([])
  const [logs,        setLogs]        = useState([])
  const [messages,    setMessages]    = useState([])
  const [tab,         setTab]         = useState('books')
  const [categories,  setCategories]  = useState([])
  const [search,      setSearch]      = useState('')
  const [modalBook,   setModalBook]   = useState(null)  // null = closed, {} = new, {...} = edit
  const [confirmId,   setConfirmId]   = useState(null)
  const [confirmTitle,setConfirmTitle]= useState('')
  const [toast,       setToast]       = useState(null)

  // Auth check
  useEffect(() => {
    adminMe()
      .then(r => {
        if (!r.success) { navigate('/admin/login', { replace: true }); return }
        setAdminUser(r.data)
        loadAll()
      })
  }, [])

  const loadAll = async () => {
    const [statsR, booksR, logsR, msgsR, catsR] = await Promise.all([
      adminGetStats(), adminGetBooks(), adminGetLogs(), adminGetMessages(), getCategories(),
    ])
    if (statsR.success) setStats(statsR.data)
    if (booksR.success) { setBooks(booksR.data); setFiltered(booksR.data) }
    if (logsR.success)  setLogs(logsR.data)
    if (msgsR.success)  setMessages(msgsR.data)
    if (catsR.success)  setCategories(catsR.data)
    if (!statsR.success || !booksR.success || !msgsR.success) {
      showToast('تعذّر تحميل بعض البيانات — حدّث الصفحة', 'error')
    }
    setLoading(false)
  }

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Search filter
  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(books.filter(b =>
      (b.title || '').toLowerCase().includes(q) ||
      (b.author || '').toLowerCase().includes(q) ||
      (b.category || '').toLowerCase().includes(q)
    ))
  }, [search, books])

  const handleLogout = async () => {
    await adminLogout()
    navigate('/admin/login', { replace: true })
  }

  const handleDelete = async () => {
    if (!confirmId) return
    const r = await adminDeleteBook(confirmId)
    setConfirmId(null)
    if (r.success) { showToast('تم حذف الكتاب بنجاح', 'success'); loadAll() }
    else showToast(r.error || 'فشل الحذف', 'error')
  }

  const toggleVisible = async (book) => {
    const fd = new FormData()
    Object.entries(book).forEach(([k, v]) => {
      if (!['cover_image', 'first_page_img', 'last_page_img', 'pdf_file'].includes(k)) {
        fd.append(k, v == null ? '' : v)
      }
    })
    fd.set('is_visible', book.is_visible ? '0' : '1')
    const r = await adminUpdateBook(book.id, fd)
    if (r.success) { showToast('تم التحديث', 'success'); loadAll() }
    else showToast(r.error || 'فشل', 'error')
  }

  const toggleHandled = async (msg) => {
    const r = await adminMarkMessageHandled(msg.id, msg.is_handled ? 0 : 1)
    if (r.success) {
      setMessages(ms => ms.map(m => (m.id === msg.id ? r.data : m)))
      showToast(r.data.is_handled ? 'تمت معالجة الرسالة ✓' : 'أُعيد فتح الرسالة', 'success')
    } else {
      showToast(r.error || 'فشل التحديث', 'error')
    }
  }

  const unhandledCount = messages.filter(m => !m.is_handled).length

  if (loading) return <PageLoader />

  return (
    <div className={styles.dashboard} dir="rtl">

      {/* ── Header ── */}
      <header className={styles.adminHeader}>
        <div className={`container ${styles.adminHeaderInner}`}>
          <Link to="/admin" className={styles.adminBrand}>
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="var(--color-primary)"/>
              <path d="M20 8 L22.9 16.1 H31.5 L24.8 21.2 L27.7 29.3 L20 24.2 L12.3 29.3 L15.2 21.2 L8.5 16.1 H17.1 Z" fill="var(--color-accent)"/>
            </svg>
            <span>لوحة الإدارة</span>
          </Link>
          <div className={styles.adminHeaderActions}>
            <Link to="/" className="btn btn-ghost btn-sm">← الموقع</Link>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">تسجيل الخروج</button>
          </div>
        </div>
      </header>

      <main className={`container ${styles.adminMain}`}>

        {/* ── Stats ── */}
        {stats && (
          <div className={styles.statsGrid}>
            <StatCard n={stats.totalBooks}      label="إجمالي الكتب"      icon="📚" />
            <StatCard n={stats.booksThisMonth}  label="أضيفت هذا الشهر"   icon="📅" />
            <StatCard n={stats.totalCategories} label="التصنيفات"          icon="🗂️" />
            <StatCard n={`${stats.storageMB} MB`} label="مساحة التخزين"   icon="💾" />
          </div>
        )}

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: '0.5rem', margin: '1.5rem 0 0.5rem' }}>
          <button
            className={tab === 'books' ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
            onClick={() => setTab('books')}
          >
            📚 الكتب
          </button>
          <button
            className={tab === 'messages' ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
            onClick={() => setTab('messages')}
          >
            ✉️ الرسائل{unhandledCount > 0 ? ` (${unhandledCount})` : ''}
          </button>
        </div>

        {tab === 'messages' && (
          <MessagesPanel messages={messages} onToggleHandled={toggleHandled} />
        )}

        {tab === 'books' && (
        <>
        {/* ── Toolbar ── */}
        <div className={styles.toolbar}>
          <h2 className={styles.toolbarTitle}>الكتب</h2>
          <div className={styles.toolbarActions}>
            <input
              type="search"
              className="form-input"
              placeholder="ابحث بالعنوان أو المؤلف…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ minWidth: 240 }}
            />
            <button className="btn btn-primary" onClick={() => setModalBook({})}>
              + إضافة كتاب
            </button>
          </div>
        </div>

        {/* ── Books table ── */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th>العنوان</th>
                <th>المؤلف</th>
                <th>التصنيف</th>
                <th>السنة</th>
                <th>مرئي</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  {books.length === 0 ? 'لا توجد كتب بعد. انقر "+ إضافة كتاب".' : 'لا توجد نتائج.'}
                </td></tr>
              ) : filtered.map(book => (
                <tr key={book.id}>
                  <td>
                    <div className={styles.thumb}>
                      {book.cover_image ? (
                        <img src={assetUrl(book.cover_image)} alt="" onError={e => e.target.style.visibility = 'hidden'} />
                      ) : (
                        <span style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>📖</span>
                      )}
                    </div>
                  </td>
                  <td><strong>{book.title}</strong></td>
                  <td style={{ color: 'var(--text-soft)' }}>{book.author}</td>
                  <td><span className="badge">{book.category}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{book.publication_year || '—'}</td>
                  <td>
                    <label className={styles.toggle} title="تبديل الظهور">
                      <input
                        type="checkbox"
                        checked={!!book.is_visible}
                        onChange={() => toggleVisible(book)}
                      />
                      <span className={styles.toggleSlider} />
                    </label>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setModalBook(book)}>تعديل</button>
                      <button
                        className="btn btn-sm"
                        style={{ background: 'color-mix(in srgb, #dc2626 12%, var(--bg-elevated))', color: '#dc2626', border: '1px solid color-mix(in srgb, #dc2626 25%, transparent)' }}
                        onClick={() => { setConfirmId(book.id); setConfirmTitle(book.title) }}
                      >حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Activity log ── */}
        <h3 className={styles.logsTitle}>آخر النشاطات</h3>
        <ul className={styles.logList}>
          {logs.length === 0 ? (
            <li style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>لا توجد نشاطات بعد.</li>
          ) : logs.map(l => (
            <li key={l.id} className={styles.logItem}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className={`${styles.logAction} ${styles['log_' + l.action]}`}>{l.action}</span>
                <strong>{l.book_title || '—'}</strong>
                {l.admin_email && <small style={{ color: 'var(--text-muted)' }}>بواسطة {l.admin_email}</small>}
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                {new Date(l.timestamp + ' UTC').toLocaleString('ar-EG')}
              </span>
            </li>
          ))}
        </ul>
        </>
        )}

      </main>

      {/* ── Book form modal ── */}
      {modalBook !== null && (
        <BookFormModal
          book={modalBook}
          categories={categories}
          onClose={() => setModalBook(null)}
          onSaved={() => { setModalBook(null); loadAll(); showToast(modalBook.id ? 'تم التحديث ✓' : 'تم الإضافة ✓', 'success') }}
          onError={msg => showToast(msg, 'error')}
        />
      )}

      {/* ── Confirm delete ── */}
      {confirmId && (
        <div className="lightbox" onClick={() => setConfirmId(null)}>
          <div className="lightbox-overlay" />
          <div className="lightbox-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <button className="lightbox-close" onClick={() => setConfirmId(null)}>×</button>
            <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>تأكيد الحذف</h3>
            <p style={{ color: 'var(--text-soft)' }}>
              هل تريد حذف <strong>"{confirmTitle}"</strong>؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn btn-ghost" onClick={() => setConfirmId(null)}>إلغاء</button>
              <button className="btn btn-primary" style={{ background: '#dc2626', borderColor: '#dc2626' }} onClick={handleDelete}>
                نعم، احذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`toast ${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  )
}

// ─── Book Form Modal ───────────────────────────────────────────────
function BookFormModal({ book, categories, onClose, onSaved, onError }) {
  const formRef = useRef()
  const [saving,     setSaving]     = useState(false)
  const [formError,  setFormError]  = useState('')
  const [fetching,   setFetching]   = useState(false)
  const isEdit = !!(book && book.id)

  const handleFetchOL = async () => {
    const olid = formRef.current.elements['open_library_id']?.value?.trim()
    const isbn = olid ? null : prompt('أدخل ISBN-13 للبحث:')
    if (!olid && !isbn) return
    setFetching(true)
    const r = await adminFetchOL({ olid: olid || null, isbn: isbn || null })
    setFetching(false)
    if (!r.success) { setFormError(r.error || 'لم يتم إيجاد البيانات'); return }
    const els = formRef.current.elements
    Object.entries(r.data).forEach(([k, v]) => {
      if (els[k] && v != null) els[k].value = v
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    const fd = new FormData(formRef.current)
    // Normalize checkboxes
    fd.set('is_visible', formRef.current.elements['is_visible']?.checked ? '1' : '0')
    fd.set('is_featured', formRef.current.elements['is_featured']?.checked ? '1' : '0')

    const r = isEdit
      ? await adminUpdateBook(book.id, fd)
      : await adminAddBook(fd)

    setSaving(false)
    if (r.success) onSaved()
    else { setFormError(r.error || 'فشل الحفظ'); onError && onError(r.error) }
  }

  return (
    <div className="lightbox" onClick={onClose}>
      <div className="lightbox-overlay" />
      <div className="lightbox-content" style={{ maxWidth: 780, padding: '2rem' }} onClick={e => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}>×</button>
        <h2 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem', fontFamily: 'var(--font-display-arabic)' }}>
          {isEdit ? 'تعديل الكتاب' : 'إضافة كتاب جديد'}
        </h2>

        <form ref={formRef} onSubmit={handleSubmit} encType="multipart/form-data" dir="rtl">
          <input type="hidden" name="id" defaultValue={book.id || ''} />

          {/* Open Library fetch */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              name="open_library_id"
              className="form-input"
              placeholder="Open Library ID (مثال: OL7353617M)"
              defaultValue={book.open_library_id || ''}
              style={{ flex: 1 }}
            />
            <button type="button" className="btn btn-ghost" onClick={handleFetchOL} disabled={fetching}>
              {fetching ? 'جارٍ الجلب…' : '🔍 جلب البيانات'}
            </button>
          </div>

          {/* Row: title + author */}
          <div className={styles.formRow2}>
            <FormField name="title" label="العنوان *" required defaultValue={book.title || ''} />
            <FormField name="author" label="المؤلف *" required defaultValue={book.author || ''} />
          </div>

          {/* Row: category + language */}
          <div className={styles.formRow2}>
            <div className="form-group">
              <label className="form-label">التصنيف *</label>
              <input
                name="category"
                className="form-input"
                list="cats"
                required
                defaultValue={book.category || ''}
                placeholder="الفئة…"
              />
              <datalist id="cats">
                {categories.map(c => <option key={c.id} value={c.name} />)}
              </datalist>
            </div>
            <FormField name="language" label="اللغة" defaultValue={book.language || 'English'} />
          </div>

          {/* Description */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">الوصف</label>
            <textarea name="description" className="form-textarea" rows={3} defaultValue={book.description || ''} />
          </div>

          {/* Row: isbn10 + isbn13 + year */}
          <div className={styles.formRow3}>
            <FormField name="isbn10"           label="ISBN-10"  defaultValue={book.isbn10 || ''} />
            <FormField name="isbn13"           label="ISBN-13"  defaultValue={book.isbn13 || ''} />
            <FormField name="publication_year" label="سنة النشر" type="number" defaultValue={book.publication_year || ''} />
          </div>

          {/* Row: pages + publisher + license */}
          <div className={styles.formRow3}>
            <FormField name="total_pages" label="الصفحات"   type="number" defaultValue={book.total_pages || ''} />
            <FormField name="publisher"   label="الناشر"    defaultValue={book.publisher || ''} />
            <div className="form-group">
              <label className="form-label">الترخيص</label>
              <select name="license_type" className="form-select" defaultValue={book.license_type || 'Public Domain'}>
                <option>Public Domain</option>
                <option>Creative Commons</option>
                <option>All Rights Reserved</option>
              </select>
            </div>
          </div>

          {/* Row: rating + gutenberg + checkboxes */}
          <div className={styles.formRow3}>
            <FormField name="rating"      label="التقييم (0-5)" type="number" step="0.1" defaultValue={book.rating || '0'} />
            <FormField name="gutenberg_id" label="Gutenberg ID" defaultValue={book.gutenberg_id || ''} />
            <div className="form-group">
              <label className="form-label">&nbsp;</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingTop: '0.3rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500, cursor: 'pointer' }}>
                  <input type="checkbox" name="is_visible"  defaultChecked={book.is_visible !== 0} /> مرئي
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500, cursor: 'pointer' }}>
                  <input type="checkbox" name="is_featured" defaultChecked={!!book.is_featured} /> مميز
                </label>
              </div>
            </div>
          </div>

          {/* Cover image URL + upload */}
          <div className={styles.formRow2}>
            <FormField name="cover_image_url" label="رابط صورة الغلاف" type="url" defaultValue={book.cover_image || ''} placeholder="https://…" />
            <div className="form-group">
              <label className="form-label">رفع غلاف (jpg/png/webp)</label>
              <input type="file" name="cover_image" accept="image/*" className="form-input" />
            </div>
          </div>

          {/* Preview images */}
          <div className={styles.formRow2}>
            <div className="form-group">
              <label className="form-label">صورة الصفحة الأولى</label>
              <input type="file" name="first_page_img" accept="image/*" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">صورة الصفحة الأخيرة</label>
              <input type="file" name="last_page_img" accept="image/*" className="form-input" />
            </div>
          </div>

          {/* PDF */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">ملف PDF (اختياري — يستخرج الصفحات تلقائياً)</label>
            <input type="file" name="pdf_file" accept="application/pdf" className="form-input" />
          </div>

          {formError && (
            <p style={{ color: '#dc2626', fontSize: '0.9rem', marginBottom: '1rem' }}>⚠️ {formError}</p>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>إلغاء</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'جارٍ الحفظ…' : isEdit ? 'حفظ التعديلات' : 'إضافة الكتاب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function FormField({ name, label, type = 'text', required = false, defaultValue = '', placeholder = '', step }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>{label}</label>
      <input
        id={name} name={name} type={type}
        className="form-input"
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        step={step}
        dir={type === 'email' || type === 'url' || name === 'isbn10' || name === 'isbn13' ? 'ltr' : undefined}
      />
    </div>
  )
}

// ─── Messages panel ────────────────────────────────────────────────
function MessagesPanel({ messages, onToggleHandled }) {
  if (messages.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 1rem' }}>
        لا توجد رسائل بعد.
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
      {messages.map(m => (
        <div
          key={m.id}
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            opacity: m.is_handled ? 0.65 : 1,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <strong style={{ color: 'var(--color-primary)' }}>{m.name}</strong>
              <a href={`mailto:${m.email}`} dir="ltr" style={{ fontSize: '0.85rem', color: 'var(--color-accent-dark)' }}>
                {m.email}
              </a>
              {m.phone && <span dir="ltr" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{m.phone}</span>}
              <span className="badge">{m.is_handled ? 'تمت المعالجة' : 'جديدة'}</span>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
              {new Date(m.created_at + ' UTC').toLocaleString('ar-EG')}
            </span>
          </div>

          {m.subject && (
            <p style={{ fontWeight: 700, margin: '0.75rem 0 0.25rem', fontSize: '0.95rem' }}>{m.subject}</p>
          )}
          <p style={{ color: 'var(--text-soft)', whiteSpace: 'pre-wrap', margin: '0.25rem 0 1rem', lineHeight: 1.7 }}>
            {m.message}
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <a className="btn btn-ghost btn-sm" href={`mailto:${m.email}?subject=${encodeURIComponent('رد: ' + (m.subject || ''))}`}>
              رد بالبريد
            </a>
            <button
              className={m.is_handled ? 'btn btn-ghost btn-sm' : 'btn btn-primary btn-sm'}
              onClick={() => onToggleHandled(m)}
            >
              {m.is_handled ? 'إعادة فتح' : '✓ تمت المعالجة'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function StatCard({ n, label, icon }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statIcon}>{icon}</span>
      <span className={styles.statNum}>{n}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}
