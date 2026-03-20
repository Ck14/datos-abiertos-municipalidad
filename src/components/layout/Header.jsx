import { RefreshCw, Database, HardDrive, Calendar, Sun, Moon } from 'lucide-react'
import appConfig from '../../data/config.json'

export default function Header({ source, lastUpdated, year, loading, onRefetch, isDark, onToggleTheme }) {
  const isAPI = source === 'api'

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 transition-colors duration-200">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo + título */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-brand-700 flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">CH</span>
            </div>
            <div className="min-w-0">
              <h1 className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-tight truncate">
                {appConfig.entidad}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-body">
                Presupuesto Municipal {year ?? new Date().getFullYear()}
              </p>
            </div>
          </div>

          {/* Estado + botones */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Badge de fuente */}
            {source && (
              <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body font-medium border ${
                isAPI
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                  : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
              }`}>
                {isAPI ? <Database size={11} /> : <HardDrive size={11} />}
                {isAPI ? 'En línea' : 'Datos locales'}
              </div>
            )}

            {/* Fecha */}
            {lastUpdated && (
              <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-body">
                <Calendar size={12} />
                <span>Actualizado: {lastUpdated}</span>
              </div>
            )}

            {/* Toggle dark mode */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? 'Modo claro' : 'Modo oscuro'}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Botón actualizar */}
            <button
              onClick={onRefetch}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white text-xs font-body font-medium rounded-lg transition-colors duration-150"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">{loading ? 'Cargando…' : 'Actualizar'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
