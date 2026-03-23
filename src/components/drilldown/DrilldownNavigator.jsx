import { useMemo } from 'react'
import ViewToggle from './ViewToggle'
import Breadcrumb from './Breadcrumb'
import LevelCard from './LevelCard'
import ExecutionBarChart from '../charts/ExecutionBarChart'
import { aggregateByLevel, HIERARCHY_CONFIG } from '../../utils/budgetAggregator'
import { getItemMeta } from '../../utils/levelIcons'

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-teal-400 dark:text-teal-500">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="mb-3 opacity-50"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      <p className="text-base font-body font-semibold">No hay información para mostrar aquí.</p>
    </div>
  )
}

export default function DrilldownNavigator({ records, drilldown }) {
  const { view, path, drillDown, drillUp, resetPath, setView } = drilldown

  const items = useMemo(
    () => aggregateByLevel(records, view, path),
    [records, view, path]
  )

  const config           = HIERARCHY_CONFIG[view]
  const currentLevelIdx  = path.length
  const currentLevelLabel = config?.levels[currentLevelIdx]?.label || ''

  const handleBreadcrumb = (index) => {
    if (index === 0) resetPath()
    else drillUp(index)
  }

  return (
    <div className="space-y-5">
      {/* Controles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <ViewToggle view={view} onViewChange={setView} />
        <Breadcrumb path={path} onDrillUp={handleBreadcrumb} />
      </div>

      {/* Contador */}
      {items.length > 0 && (
        <p className="text-sm font-body font-bold text-stone-500 dark:text-stone-400">
          <span className="font-black text-stone-800 dark:text-stone-200">{items.length}</span> {currentLevelLabel}{items.length !== 1 ? 's' : ''} encontrados
          {items[0]?.hasChildren &&
            <span className="ml-1.5 text-brand-600 dark:text-brand-400">👆 Toca para explorar</span>
          }
        </p>
      )}

      {/* Tarjetas */}
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item, i) => (
            <LevelCard
              key={`${item.key}-${item.label}`}
              item={item}
              meta={getItemMeta(item.label, view, currentLevelIdx, i)}
              onClick={drillDown}
            />
          ))}
        </div>
      )}

      {/* Gráfica */}
      {items.length > 0 && (
        <ExecutionBarChart
          items={items}
          title={`Vigente vs Devengado — por ${currentLevelLabel}`}
        />
      )}

      {/* Leyenda semáforo */}
      {items.length > 0 && (
        <div className="flex items-center gap-4 pt-1">
          <span className="text-[10px] font-body font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wide">Ejecución:</span>
          {[['#ef4444','Bajo (<30%)'],['#f59e0b','Medio (30–70%)'],['#22c55e','Alto (>70%)']].map(([c,l]) => (
            <span key={l} className="flex items-center gap-1.5 text-xs font-body font-semibold text-stone-500 dark:text-stone-400">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: c }} />
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
