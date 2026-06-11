// frontend-react/src/services/api.js
// ═══════════════════════════════════════════════════════
// Centralized API client — all backend calls go through here.
// In development, Vite proxies /api requests to localhost:3000.
// In production, they go to the same origin.
// ═══════════════════════════════════════════════════════

const BASE = '/api';

/**
 * Core fetch wrapper — always returns the API envelope:
 * { success, data, meta, error }
 */
async function request(path, options = {}) {
  const init = {
    credentials: 'include', // Send cookies for JWT auth
    headers: {},
    ...options,
  };

  // Auto-serialize JSON body (skip FormData — multer handles it)
  if (init.body && !(init.body instanceof FormData) && typeof init.body !== 'string') {
    init.body = JSON.stringify(init.body);
    init.headers['Content-Type'] = 'application/json';
  }

  let res;
  try {
    res = await fetch(path, init);
  } catch (e) {
    return { success: false, data: null, meta: null, error: e.message || 'Network error' };
  }

  let json;
  try {
    json = await res.json();
  } catch {
    return { success: false, data: null, meta: null, error: `HTTP ${res.status}` };
  }

  if (!res.ok && !('success' in json)) {
    return { success: false, data: null, meta: null, error: json.error || `HTTP ${res.status}` };
  }

  return json;
}

// ─── HTTP helpers ─────────────────────────────────────────────────
export const api = {
  get:      (path)        => request(path, { method: 'GET' }),
  post:     (path, body)  => request(path, { method: 'POST', body }),
  put:      (path, body)  => request(path, { method: 'PUT', body }),
  delete:   (path)        => request(path, { method: 'DELETE' }),
  postForm: (path, fd)    => request(path, { method: 'POST', body: fd }),
};

// ─── Public library API ───────────────────────────────────────────

/** Fetch paginated books with optional filters */
export async function getBooks(params = {}) {
  const q = new URLSearchParams();
  if (params.search)    q.set('search',    params.search);
  if (params.author)    q.set('author',    params.author);
  if (params.category)  q.set('category',  params.category);
  if (params.year_from) q.set('year_from', params.year_from);
  if (params.year_to)   q.set('year_to',   params.year_to);
  if (params.language)  q.set('language',  params.language);
  q.set('sort',  params.sort  || 'newest');
  q.set('page',  params.page  || 1);
  q.set('limit', params.limit || 20);
  return api.get(`${BASE}/books?${q}`);
}

export const getFeaturedBooks = ()       => api.get(`${BASE}/books/featured`);
export const getRecentBooks   = ()       => api.get(`${BASE}/books/recent`);
export const getBook          = (id)     => api.get(`${BASE}/books/${id}`);
export const getRelatedBooks  = (id)     => api.get(`${BASE}/books/${id}/related`);
export const getCategories    = ()       => api.get(`${BASE}/categories`);
export const getStats         = ()       => api.get(`${BASE}/stats`);
export const searchBooks      = (q)      => api.get(`${BASE}/search?q=${encodeURIComponent(q)}`);
export const getRandomBook    = ()       => api.get(`${BASE}/books/random`);

/** Fetch events; pass { upcoming: true } to get future events only (soonest first) */
export async function getEvents(params = {}) {
  const q = new URLSearchParams();
  if (params.upcoming) q.set('upcoming', 'true');
  q.set('page',  params.page  || 1);
  q.set('limit', params.limit || 100);
  return api.get(`${BASE}/events?${q}`);
}

export const getEvent = (id) => api.get(`${BASE}/events/${id}`);

/** Submit the public contact form */
export const sendContactMessage = (body) => api.post(`${BASE}/contact`, body);

// ─── Admin API ────────────────────────────────────────────────────

export const adminLogin   = (email, password) => api.post(`${BASE}/admin/login`, { email, password });
export const adminLogout  = ()                => api.post(`${BASE}/admin/logout`, {});
export const adminMe      = ()                => api.get(`${BASE}/admin/me`);
export const adminGetBooks    = ()            => api.get(`${BASE}/admin/books`);
export const adminGetStats    = ()            => api.get(`${BASE}/admin/dashboard`);
export const adminGetLogs     = ()            => api.get(`${BASE}/admin/logs`);
export const adminAddBook     = (fd)          => api.postForm(`${BASE}/admin/books`, fd);
export const adminUpdateBook  = (id, fd)      => api.postForm(`${BASE}/admin/books/${id}?_method=PUT`, fd);
export const adminDeleteBook  = (id)          => api.delete(`${BASE}/admin/books/${id}`);
export const adminFetchOL     = (body)        => api.post(`${BASE}/admin/books/fetch-openlibrary`, body);
export const adminGetMessages = ()            => api.get(`${BASE}/admin/messages`);
export const adminMarkMessageHandled = (id, isHandled = 1) =>
  api.put(`${BASE}/admin/messages/${id}/handled`, { is_handled: isHandled });

// ─── Utility ─────────────────────────────────────────────────────

/** Build the full URL for a stored asset */
export function assetUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith('/') ? path : '/' + path;
}

/** Star rating HTML helper */
export function starsHtml(rating) {
  const r = Math.round(parseFloat(rating) || 0);
  return Array.from({ length: 5 }, (_, i) =>
    i < r ? '★' : '<span class="empty">★</span>'
  ).join('');
}
