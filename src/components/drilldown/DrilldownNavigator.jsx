import { useMemo } from 'react'
import ViewToggle from './ViewToggle'
import Breadcrumb from './Breadcrumb'
import LevelCard from './LevelCard'
import ExecutionBarChart from '../charts/ExecutionBarChart'
import { aggregateByLevel, HIERARCHY_CONFIG } from '../../utils/budgetAggregator'
import { useDrilldown } from '../../hooks/useDrilldown'

export default function DrilldownNavigator({ records }) {
  const { view, path, drillDown, drillUp, resetPath, setView } = useDrilldown()

  const items = useMemo(
    () => aggregateByLevel(records, view, path),
    [records, view, path]
  )

  const config = HIERARCHY_CONFIG[view]
  const currentLevelLabel = config?.levels[path.length]?.label || ''

  const handleBreadcrumb = (index) => {
    if (index === 0) resetPath()
    else drillUp(index)
  }

  return (
    <div className="space-y-4">
      {/* Controles superiores */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <ViewToggle view={view} onViewChange={setView} />
        <Breadcrumb path={path} onDrillUp={handleBreadcrumb} />
      </div>

      {/* Subtítulo del nivel */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 font-body">
          <span className="font-medium text-slate-700">{items.length}</span> {currentLevelLabel}s encontrados
        </p>
      </div>

      {/* Grid de tarjetas */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {items.map((item) => (
            <LevelCard
              key={`${item.key}-${item.label}`}
              item={item}
              onClick={drillDown}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500 font-body text-sm">
          No hay datos para este nivel.
        </div>
      )}

      {/* Gráfica de barras */}
      {items.length > 0 && (
        <ExecutionBarChart
          items={items}
          title={`Vigente vs Devengado por ${currentLevelLabel}`}
        />
      )}
    </div>
  )
}
