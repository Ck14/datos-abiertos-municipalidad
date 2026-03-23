import { Home, BookOpen, List } from 'lucide-react'

// Colores explícitos por ID — inline styles para garantizar que Tailwind no los purgue
const NAV_COLORS = {
  dashboard: { bg: '#0d9488', light: '#f0fdfa', text: '#0f766e' },
  explorar:  { bg: '#a21caf', light: '#fdf4ff', text: '#86198f' },
  tabla:     { bg: '#d97706', light: '#fffbeb', text: '#b45309' },
}

const NAV = [
  { id: 'dashboard', label: 'Inicio',           sublabel: 'Vista rápida del dinero',      icon: Home     },
  { id: 'explorar',  label: '¿En qué se gasta?', sublabel: 'Navega programa por programa', icon: BookOpen },
  { id: 'tabla',     label: 'Ver todo el gasto', sublabel: 'Cada registro detallado',      icon: List     },
]

export default function Sidebar({ activeTab, onTabChange }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col bg-white dark:bg-teal-950 border-r-2 border-teal-100 dark:border-teal-800 min-h-[calc(100vh-6.5rem)] w-64 flex-shrink-0 transition-colors duration-200">
        <div className="p-3 space-y-2 mt-3">
          {NAV.map(({ id, label, sublabel, icon: Icon }) => {
            const isActive = activeTab === id
            const colors = NAV_COLORS[id]
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                style={isActive ? { backgroundColor: colors.bg, boxShadow: `0 4px 14px ${colors.bg}55` } : {}}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 border-2 border-transparent ${
                  isActive
                    ? 'text-white'
                    : 'text-teal-800 dark:text-teal-200 hover:border-teal-100 dark:hover:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-800'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                  style={isActive ? { backgroundColor: 'rgba(255,255,255,0.2)' } : { backgroundColor: colors.light }}
                >
                  <Icon size={20} style={{ color: isActive ? 'white' : colors.bg }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-display font-bold leading-tight ${isActive ? 'text-white' : 'text-teal-900 dark:text-teal-100'}`}>
                    {label}
                  </p>
                  <p className={`text-[11px] font-body mt-0.5 leading-tight ${isActive ? 'text-white/70' : 'text-teal-500 dark:text-teal-400'}`}>
                    {sublabel}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Info card inferior */}
        <div className="mt-auto p-4">
          <div className="rounded-2xl bg-teal-50 dark:bg-teal-900/50 border-2 border-teal-100 dark:border-teal-700 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                </svg>
              </div>
              <p className="text-xs font-display font-bold text-teal-800 dark:text-teal-300">¿Por qué publicamos esto?</p>
            </div>
            <p className="text-[11px] font-body text-teal-600 dark:text-teal-400 leading-relaxed">
              La ley exige que el municipio muestre cómo usa el dinero público. Esta plataforma te lo explica de forma clara.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-teal-950 border-t-2 border-teal-100 dark:border-teal-800 flex safe-area-pb shadow-xl">
        {NAV.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id
          const colors = NAV_COLORS[id]
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-body font-bold transition-all"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                style={isActive ? { backgroundColor: colors.bg, transform: 'scale(1.1)' } : { backgroundColor: 'transparent' }}
              >
                <Icon size={20} style={{ color: isActive ? 'white' : colors.text }} />
              </div>
              <span
                className="leading-none px-1 truncate max-w-[60px] text-center"
                style={{ color: isActive ? colors.bg : '#5eead4' }}
              >
                {label.split(' ')[0]}
              </span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
