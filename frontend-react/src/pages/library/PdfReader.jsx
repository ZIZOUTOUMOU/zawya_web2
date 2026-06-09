// frontend-react/src/pages/library/PdfReader.jsx
import { useState, useEffect, useRef, useCallback } from 'react'
import * as pdfjs from 'pdfjs-dist'
import { useT } from '../../context/LanguageContext'
import styles from './PdfReader.module.css'

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`

export default function PdfReader({ pdfUrl, onClose }) {
  const [pdf,        setPdf]        = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages,  setTotalPages]  = useState(0)
  const [scale,      setScale]      = useState(1.0)
  const [fitWidth,   setFitWidth]   = useState(false)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const [pageInput,  setPageInput]  = useState('1')
  const [rendering,  setRendering]  = useState(false)

  const t = useT()

  const canvasRef      = useRef(null)
  const containerRef   = useRef(null)
  const renderTaskRef  = useRef(null)

  const loadPdf = useCallback(async () => {
    if (!pdfUrl) {
      setError(true)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const pdfDoc = await pdfjs.getDocument(pdfUrl).promise
      setPdf(pdfDoc)
      setTotalPages(pdfDoc.numPages)
      setCurrentPage(1)
      setPageInput('1')
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [pdfUrl])

  useEffect(() => { loadPdf() }, [loadPdf])

  const renderPage = useCallback(async (pageNum, targetScale) => {
    if (!pdf || !canvasRef.current) return
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel()
      renderTaskRef.current = null
    }
    setRendering(true)
    try {
      const page = await pdf.getPage(pageNum)
      let useScale = targetScale
      if (fitWidth && containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 32
        const vp0 = page.getViewport({ scale: 1 })
        useScale = containerWidth / vp0.width
      }
      const viewport = page.getViewport({ scale: useScale })
      const canvas   = canvasRef.current
      canvas.width   = viewport.width
      canvas.height  = viewport.height
      const task = page.render({ canvasContext: canvas.getContext('2d'), viewport })
      renderTaskRef.current = task
      await task.promise
      renderTaskRef.current = null
    } catch (err) {
      if (err?.name !== 'RenderingCancelledException') {
        // ignore cancel; other errors are non-fatal
      }
    } finally {
      setRendering(false)
    }
  }, [pdf, fitWidth])

  useEffect(() => {
    if (!pdf) return
    renderPage(currentPage, scale)
  }, [pdf, currentPage, scale, fitWidth, renderPage])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'd')
        setCurrentPage(p => Math.min(p + 1, totalPages))
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'a')
        setCurrentPage(p => Math.max(p - 1, 1))
      if (e.key === '+' || e.key === '=') { setFitWidth(false); setScale(s => Math.min(+(s + 0.25).toFixed(2), 2.0)) }
      if (e.key === '-' || e.key === '_') { setFitWidth(false); setScale(s => Math.max(+(s - 0.25).toFixed(2), 0.5)) }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose, totalPages])

  useEffect(() => { setPageInput(String(currentPage)) }, [currentPage])

  const goToPage = n => {
    const p = Math.max(1, Math.min(n, totalPages))
    setCurrentPage(p)
    setPageInput(String(p))
  }

  const zoomIn  = () => { setFitWidth(false); setScale(s => Math.min(+(s + 0.25).toFixed(2), 2.0)) }
  const zoomOut = () => { setFitWidth(false); setScale(s => Math.max(+(s - 0.25).toFixed(2), 0.5)) }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.reader} onClick={e => e.stopPropagation()}>

        {/* ── Toolbar ── */}
        <div className={styles.toolbar}>

          {/* Page navigation */}
          <div className={styles.toolbarGroup}>
            <button
              className={styles.navBtn}
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              aria-label={t('bookDetail.previous')}
            >›</button>

            <div className={styles.pageControl}>
              <span className={styles.pageLabel}>{t('pdfReader.page')}</span>
              <input
                className={styles.pageInput}
                type="number"
                min={1}
                max={totalPages || 1}
                value={pageInput}
                onChange={e => setPageInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { const n = parseInt(pageInput, 10); if (!isNaN(n)) goToPage(n) } }}
                onBlur={() => { const n = parseInt(pageInput, 10); if (!isNaN(n)) goToPage(n) }}
              />
              <span className={styles.totalPages}>/ {totalPages || '—'}</span>
            </div>

            <button
              className={styles.navBtn}
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              aria-label={t('bookDetail.next')}
            >‹</button>
          </div>

          {/* Zoom controls */}
          <div className={styles.toolbarGroup}>
            <span className={styles.zoomLabel}>{t('pdfReader.zoom')}</span>
            <button className={styles.zoomBtn} onClick={zoomOut} disabled={scale <= 0.5 || fitWidth}>−</button>
            <span className={styles.zoomValue}>{fitWidth ? t('pdfReader.fitLabel') : `${Math.round(scale * 100)}%`}</span>
            <button className={styles.zoomBtn} onClick={zoomIn}  disabled={scale >= 2.0 || fitWidth}>+</button>
            <button
              className={`${styles.fitBtn} ${fitWidth ? styles.fitBtnActive : ''}`}
              onClick={() => setFitWidth(fw => !fw)}
            >
              {t('pdfReader.fitWidth')}
            </button>
          </div>

          {/* Close */}
          <button className={styles.closeBtn} onClick={onClose} title={t('pdfReader.close')}>✕</button>
        </div>

        {/* ── Canvas area ── */}
        <div className={styles.canvasArea} ref={containerRef}>
          {loading && (
            <div className={styles.stateBox}>
              <div className={styles.spinner} />
              <p>{t('pdfReader.loading')}</p>
            </div>
          )}

          {error && !loading && (
            <div className={styles.stateBox}>
              <p className={styles.errorText}>{t('pdfReader.failed')}</p>
              <button className={styles.retryBtn} onClick={loadPdf}>
                {t('pdfReader.retry')}
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className={styles.canvasWrap}>
              {rendering && (
                <div className={styles.renderingOverlay}>
                  <div className={styles.spinnerSm} />
                </div>
              )}
              <canvas ref={canvasRef} className={styles.pdfCanvas} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
