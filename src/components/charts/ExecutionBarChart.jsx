import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend
} from 'recharts'
import { formatMillions } from '../../utils/formatters'
import { getExecutionColor } from '../../utils/colorScale'
import { useIsDark } from '../../contexts/ThemeContext'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 shadow-lg text-xs font-body max-w-xs">
      <p className="font-medium text-slate-800 dark:text-slate-200 mb-1 truncate">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.fill || p.color }} />
          <span>{p.name}: <strong>{formatMillions(p.value)}</strong></span>
        </div>
      ))}
    </div>
  )
}

function SingleItemChart({ item, title }) {
  const execColor = getExecutionColor(item.pctEjecucion)
  const pctWidth  = Math.min(item.pctEjecucion, 100)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition-colors duration-200">
      <h3 className="text-sm font-display font-semibold text-slate-800 dark:text-slate-200 mb-4">{title}</h3>
      <div className="space-y-4">
        {[
          { label: 'Vigente',   val: item.totalVigente,   color: '#bfdbfe', width: 100 },
          { label: 'Devengado', val: item.totalDevengado, color: execColor,  width: pctWidth },
          { label: 'Pagado',    val: item.totalPagado,    color: '#6ee7b7',  width: item.totalVigente > 0 ? (item.totalPagado / item.totalVigente) * 100 : 0 },
        ].map(({ label, val, color, width }) => (
          <div key={label}>
            <div className="flex justify-between text-xs font-body mb-1.5">
              <span className="text-slate-600 dark:text-slate-400 font-medium">{label}</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{formatMillions(val)}</span>
            </div>
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${width}%`, backgroundColor: color }}
              />
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center pt-1 border-t border-slate-100 dark:border-slate-700">
          <span className="text-xs font-body text-slate-500 dark:text-slate-400">% de ejecución</span>
          <span className="text-sm font-mono font-bold" style={{ color: execColor }}>
            {item.pctEjecucion < 1 ? '<1%' : `${item.pctEjecucion.toFixed(1)}%`}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function ExecutionBarChart({ items, title = 'Ejecución Presupuestaria' }) {
  const isDark = useIsDark()

  if (items.length === 1) {
    return <SingleItemChart item={items[0]} title={title} />
  }

  const data = items.slice(0, 12).map(item => ({
    name: item.label.length > 22 ? item.label.slice(0, 22) + '…' : item.label,
    Vigente: item.totalVigente,
    Devengado: item.totalDevengado,
    pct: item.pctEjecucion,
  }))

  const height   = Math.max(120, data.length * 52)
  const gridColor = isDark ? '#1e293b' : '#f1f5f9'
  const textColor = isDark ? '#94a3b8' : '#64748b'

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm transition-colors duration-200">
      <h3 className="text-sm font-display font-semibold text-slate-800 dark:text-slate-200 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
          <XAxis type="number" tickFormatter={formatMillions} tick={{ fontSize: 10, fontFamily: 'DM Sans', fill: textColor }} />
          <YAxis
            type="category" dataKey="name" width={140}
            tick={{ fontSize: 10, fontFamily: 'DM Sans', fill: textColor }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: 'DM Sans', color: textColor }} />
          <Bar dataKey="Vigente" fill="#bfdbfe" radius={[0, 3, 3, 0]} maxBarSize={14} />
          <Bar dataKey="Devengado" radius={[0, 3, 3, 0]} maxBarSize={14}>
            {data.map((d, i) => (
              <Cell key={i} fill={getExecutionColor(d.pct)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
