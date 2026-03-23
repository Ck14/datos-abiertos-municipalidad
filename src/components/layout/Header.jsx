import { RefreshCw, Database, HardDrive, Sun, Moon, Wifi, WifiOff } from 'lucide-react'
import appConfig from '../../data/config.json'

export default function Header({ source, lastUpdated, year, loading, onRefetch, isDark, onToggleTheme }) {
  const isAPI = source === 'api'

  return (
    <header className="sticky top-0 z-30 transition-colors duration-200">
      {/* Barra superior teal oscura */}
      <div className="bg-brand-700 dark:bg-brand-900 px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {source && (
            <div className="flex items-center gap-1.5 text-xs font-body font-semibold text-brand-200">
              {isAPI
                ? <><Wifi size={11} className="text-teal-300" /> <span className="text-teal-300">Datos actuales del gobierno</span></>
                : <><WifiOff size={11} className="text-amber-300" /> <span className="text-amber-300">Datos guardados</span></>
              }
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="hidden sm:block text-[11px] font-body text-brand-300">
              Actualizado: {lastUpdated}
            </span>
          )}
          <button
            onClick={onToggleTheme}
            className="p-1 rounded-md text-brand-300 hover:text-white transition-colors"
            title={isDark ? 'Modo claro' : 'Modo oscuro'}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>

      {/* Barra principal blanca */}
      <div className="bg-white dark:bg-teal-950 border-b-2 border-brand-100 dark:border-teal-800 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo + título */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Logo cuadrado con ícono de escudo */}
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-200 dark:shadow-brand-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/40 to-transparent" />
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className="font-display font-bold text-teal-900 dark:text-teal-100 text-sm sm:text-base leading-tight truncate">
                  Chimaltenango Transparente
                </h1>
                <p className="text-xs font-body text-brand-600 dark:text-brand-400 font-medium">
                  Presupuesto {year ?? new Date().getFullYear()} · {appConfig.entidad}
                </p>
              </div>
            </div>

            {/* Botón actualizar */}
            <button
              onClick={onRefetch}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-body font-semibold rounded-xl transition-all duration-150 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">{loading ? 'Actualizando…' : 'Actualizar datos'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
