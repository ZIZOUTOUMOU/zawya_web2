import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import translations from '../translations'

const LANGUAGE_KEY = 'zawiya_language'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try { return localStorage.getItem(LANGUAGE_KEY) || 'ar' }
    catch { return 'ar' }
  })

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang)
    try { localStorage.setItem(LANGUAGE_KEY, lang) } catch {}
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'ar' ? 'en' : 'ar')
  }, [language, setLanguage])

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('lang', language)
    root.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr')
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

export function useT() {
  const { language } = useLanguage()
  const t = useCallback((key, params) => {
    const keys = key.split('.')
    let val = translations[language]
    for (const k of keys) {
      if (val && typeof val === 'object' && k in val) val = val[k]
      else return key
    }
    if (typeof val === 'string' && params) {
      return val.replace(/\{(\w+)\}/g, (_, p) => params[p] !== undefined ? params[p] : `{${p}}`)
    }
    return typeof val === 'string' ? val : key
  }, [language])
  return t
}
