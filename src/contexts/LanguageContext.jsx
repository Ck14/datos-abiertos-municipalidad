import { createContext, useContext, useState, useCallback } from 'react'
import es from '../locales/es.json'
import kaq from '../locales/kaq.json'

const LOCALES = { es, kaq }

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('lang') || 'es'
    } catch {
      return 'es'
    }
  })

  const toggleLang = useCallback(() => {
    setLang(l => {
      const next = l === 'es' ? 'kaq' : 'es'
      try { localStorage.setItem('lang', next) } catch {}
      return next
    })
  }, [])

  // t('key.nested', { year: 2026 }) → string con interpolación {year}
  const t = useCallback((key, params) => {
    const locale = LOCALES[lang] || LOCALES.es
    const value = key.split('.').reduce((obj, k) => obj?.[k], locale)
      ?? key.split('.').reduce((obj, k) => obj?.[k], LOCALES.es)
      ?? key
    if (!params) return value
    return String(value).replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`)
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
