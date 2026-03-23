import { useState, useMemo, useCallback } from 'react'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'
import KPICards from './components/dashboard/KPICards'
import FuenteDonut from './components/charts/FuenteDonut'
import ProgramasGrid from './components/charts/ProgramasGrid'
import DrilldownNavigator from './components/drilldown/DrilldownNavigator'
import BudgetTable from './components/table/BudgetTable'
import { useBudgetData } from './hooks/useBudgetData'
import { useDrilldown } from './hooks/useDrilldown'
import { useTheme } from './hooks/useTheme'
import { ThemeContext } from './contexts/ThemeContext'
import { calcGlobalTotals } from './utils/budgetAggregator'

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-teal-50 dark:bg-teal-950 flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center animate-bounce shadow-xl shadow-brand-200 dark:shadow-brand-900">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
      <div className="text-center">
        <p className="text-base font-display font-bold text-brand-700 dark:text-brand-400">Cargando información…</p>
        <p className="text-sm font-body text-teal-500 mt-1">Municipalidad de Chimaltenango</p>
      </div>
    </div>
  )
}

function ErrorBanner({ message }) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-4 text-sm font-body text-red-700 dark:text-red-400 flex items-center gap-3">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>Hubo un problema al cargar los datos: {message}</span>
    </div>
  )
}

function WelcomeBanner({ year, count }) {
  return (
    <div className="rounded-3xl overflow-hidden shadow-lg mb-6 border-2 border-brand-200 dark:border-teal-700">
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 dark:from-brand-800 dark:to-teal-950 p-6 sm:p-8 relative">
        <div className="absolute right-6 top-6 opacity-10 text-white pointer-events-none select-none">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div className="relative max-w-2xl">
          <p className="text-brand-200 text-xs font-display font-semibold uppercase tracking-widest mb-2">
            Transparencia Municipal · Año {year}
          </p>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white leading-tight mb-3">
            ¿Cómo usa el dinero<br className="hidden sm:block" /> la Municipalidad?
          </h2>
          <p className="text-brand-100 font-body text-sm sm:text-base leading-relaxed">
            Aquí puedes ver, en términos sencillos, cómo se planifica y en qué se gasta el dinero de todos los vecinos de Chimaltenango.
          </p>
        </div>
      </div>
      <div className="bg-white dark:bg-teal-900 px-6 py-3 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-xs font-body font-semibold text-teal-700 dark:text-teal-300">
            Datos oficiales del Ministerio de Finanzas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-400" />
          <p className="text-xs font-body font-semibold text-teal-700 dark:text-teal-300">
            {count.toLocaleString()} registros de gasto
          </p>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const { records, loading, error, source, year, lastUpdated, refetch } = useBudgetData()
  const [activeTab, setActiveTab] = useState('dashboard')
  const drilldown = useDrilldown()
  const { isDark, toggleTheme } = useTheme()

  const totals = useMemo(() => calcGlobalTotals(records), [records])

  const handleProgramClick = useCallback((programLabel) => {
    drilldown.setView('programatica')
    drilldown.drillDown({ key: 'programa', label: programLabel, levelLabel: 'Programa', hasChildren: true })
    setActiveTab('explorar')
  }, [drilldown])

  if (loading) return <LoadingScreen />

  return (
    <ThemeContext.Provider value={isDark}>
      <div className="min-h-screen bg-teal-50 dark:bg-teal-950 flex flex-col transition-colors duration-200">
        <Header
          source={source} lastUpdated={lastUpdated} year={year}
          loading={loading} onRefetch={refetch}
          isDark={isDark} onToggleTheme={toggleTheme}
        />

        <div className="flex flex-1 max-w-screen-2xl mx-auto w-full">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

          <main className="flex-1 p-4 sm:p-6 pb-28 lg:pb-8 min-w-0">
            {error && <ErrorBanner message={error} />}

            {/* DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-5 animate-fade-in">
                <WelcomeBanner year={year} count={records.length} />
                <KPICards totals={totals} />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
                  <FuenteDonut records={records} />
                  <ProgramasGrid records={records} onProgramClick={handleProgramClick} />
                </div>
              </div>
            )}

            {/* EXPLORAR */}
            {activeTab === 'explorar' && (
              <div className="animate-fade-in">
                <div className="mb-5 bg-white dark:bg-teal-900 rounded-2xl border-2 border-accent-100 dark:border-teal-700 p-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent-100 dark:bg-accent-900/40 flex items-center justify-center flex-shrink-0">
                    <BookOpenIcon />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-teal-900 dark:text-teal-100 mb-0.5">¿En qué se gasta el dinero?</h2>
                    <p className="text-sm font-body text-teal-600 dark:text-teal-400">Toca cualquier tarjeta para ver más detalles de cada programa o proyecto.</p>
                  </div>
                </div>
                <DrilldownNavigator records={records} drilldown={drilldown} />
              </div>
            )}

            {/* TABLA */}
            {activeTab === 'tabla' && (
              <div className="animate-fade-in">
                <div className="mb-5 bg-white dark:bg-teal-900 rounded-2xl border-2 border-sun-100 dark:border-teal-700 p-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-sun-100 dark:bg-sun-900/30 flex items-center justify-center flex-shrink-0">
                    <ListIcon />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-teal-900 dark:text-teal-100 mb-0.5">Ver todo el gasto detallado</h2>
                    <p className="text-sm font-body text-teal-600 dark:text-teal-400">Cada fila es un registro oficial del año {year}. Puedes buscar y filtrar por cualquier tema.</p>
                  </div>
                </div>
                <BudgetTable records={records} />
              </div>
            )}
          </main>
        </div>
        <Footer />
      </div>
    </ThemeContext.Provider>
  )
}

function BookOpenIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a21caf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  )
}
