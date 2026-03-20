import { ChevronRight } from 'lucide-react'
import { formatMillions, formatPct } from '../../utils/formatters'
import { getExecutionColor, getExecutionTailwind, getExecutionLabel } from '../../utils/colorScale'

export default function LevelCard({ item, onClick }) {
  const { bg, text, light, border } = getExecutionTailwind(item.pctEjecucion)
  const barColor = getExecutionColor(item.pctEjecucion)

  return (
    <button
      onClick={() => item.hasChildren && onClick(item)}
      className={`w-full text-left bg-white rounded-xl border border-slate-200 p-4 transition-all duration-200 ${
        item.hasChildren
          ? 'hover:border-brand-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
          : 'cursor-default'
      } animate-slide-up`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <span className={`inline-block text-[10px] font-body font-medium px-1.5 py-0.5 rounded ${light} ${text} border ${border} mb-1`}>
            {item.levelLabel}
          </span>
          <p className="font-display font-semibold text-slate-900 text-sm leading-snug line-clamp-2">
            {item.label}
          </p>
        </div>
        {item.hasChildren && (
          <ChevronRight size={16} className="text-slate-400 flex-shrink-0 mt-1" />
        )}
      </div>

      {/* Montos */}
      <div className="grid grid-cols-3 gap-1 mb-3">
        {[
          { label: 'Vigente',   val: item.totalVigente },
          { label: 'Devengado', val: item.totalDevengado },
          { label: 'Pagado',    val: item.totalPagado },
        ].map(({ label, val }) => (
          <div key={label} className="text-center">
            <p className="text-[10px] text-slate-500 font-body">{label}</p>
            <p className="text-xs font-mono font-medium text-slate-800">{formatMillions(val)}</p>
          </div>
        ))}
      </div>

      {/* Barra de ejecución */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-body">Ejecución</span>
          <div className="flex items-center gap-1">
            <span className={`text-[10px] font-body font-medium ${text}`}>{getExecutionLabel(item.pctEjecucion)}</span>
            <span className="text-xs font-mono font-bold text-slate-800">{formatPct(item.pctEjecucion)}</span>
          </div>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(item.pctEjecucion || 0, 100)}%`, backgroundColor: barColor }}
          />
        </div>
      </div>
    </button>
  )
}
