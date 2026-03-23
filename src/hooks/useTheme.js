import { useState, useEffect } from 'react'

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved) return saved === 'dark'
      return false // light by default — más amigable para la comunidad
    } catch {
      return true
    }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return { isDark, toggleTheme: () => setIsDark(d => !d) }
}
