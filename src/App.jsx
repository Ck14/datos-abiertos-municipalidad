import { useState, useMemo, useCallback } from 'react'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import KPICards from './components/dashboard/KPICards'
import FuenteDonut from './components/charts/FuenteDonut'
import ProgramasGrid from './components/charts/ProgramasGrid'
import DrilldownNavigator from './components/drilldown/DrilldownNavigator'
import BudgetTable from './components/table/BudgetTable'
import { useBudgetData } from './hooks/useBudgetData'
import { useDrilldown } from './hooks/useDrilldown'
import { calcGlobalTotals } from './utils/budgetAggregator'

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center animate-pulse">
        <span className="text-white font-display font-bold text-lg">CH</span>
      </div>
      <p className="text-sm font-body text-slate-500 animate-pulse">Cargando presupuesto…</p>
    </div>
  )
}

function ErrorBanner({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm font-body text-red-700">
      Error al cargar los datos: {message}
    </div>
  )
}

export default function App() {
  const { records, loading, error, source, year, lastUpdated, refetch } = useBudgetData()
  const [activeTab, setActiveTab] = useState('dashboard')
  const drilldown = useDrilldown()

  const totals = useMemo(() => calcGlobalTotals(records), [records])

  const handleProgramClick = useCallback((programLabel) => {
    drilldown.setView('programatica')
    drilldown.drillDown({ key: 'programa', label: programLabel, levelLabel: 'Programa', hasChildren: true })
    setActiveTab('explorar')
  }, [drilldown])

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header source={source} lastUpdated={lastUpdated} year={year} loading={loading} onRefetch={refetch} />

      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 p-4 sm:p-6 pb-20 lg:pb-6 min-w-0">
          {error && <ErrorBanner message={error} />}

          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h2 className="text-lg font-display font-bold text-slate-900 mb-1">Resumen General</h2>
                <p className="text-xs font-body text-slate-500">Ejercicio Fiscal {year} · {records.length} renglones presupuestarios</p>
              </div>
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
              <div className="mb-5">
                <h2 className="text-lg font-display font-bold text-slate-900 mb-1">Explorar Presupuesto</h2>
                <p className="text-xs font-body text-slate-500">Navega por las jerarquías presupuestarias haciendo click en cada tarjeta.</p>
              </div>
              <DrilldownNavigator records={records} drilldown={drilldown} />
            </div>
          )}

          {/* TABLA */}
          {activeTab === 'tabla' && (
            <div className="animate-fade-in">
              <div className="mb-5">
                <h2 className="text-lg font-display font-bold text-slate-900 mb-1">Tabla Detallada</h2>
                <p className="text-xs font-body text-slate-500">Todos los renglones del ejercicio {year} con filtros y ordenamiento.</p>
              </div>
              <BudgetTable records={records} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
