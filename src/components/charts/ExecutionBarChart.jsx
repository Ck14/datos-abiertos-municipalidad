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
    <div className="bg-white dark:bg-teal-800 border-2 border-brand-200 dark:border-stone-600 rounded-2xl px-4 py-3 shadow-xl text-sm font-body max-w-xs">
      <p className="font-black text-teal-800 dark:text-teal-200 mb-1 truncate">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400 font-semibold">
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
    <div className="bg-white dark:bg-teal-900 rounded-3xl border-2 border-brand-100 dark:border-teal-700 p-5 shadow-sm transition-colors duration-200">
      <h3 className="text-sm font-display font-black text-teal-800 dark:text-teal-200 mb-4">{title}</h3>
      <div className="space-y-4">
        {[
          { label: 'Dinero disponible',    val: item.totalVigente,   color: '#5eead4', width: 100 },
          { label: 'Comprometido a pagar', val: item.totalDevengado, color: execColor,  width: pctWidth },
          { label: 'Ya pagado',            val: item.totalPagado,    color: '#6ee7b7',  width: item.totalVigente > 0 ? (item.totalPagado / item.totalVigente) * 100 : 0 },
        ].map(({ label, val, color, width }) => (
          <div key={label}>
            <div className="flex justify-between text-sm font-body mb-1.5">
              <span className="text-stone-600 dark:text-stone-400 font-bold">{label}</span>
              <span className="font-mono font-black text-teal-800 dark:text-teal-200">{formatMillions(val)}</span>
            </div>
            <div className="h-4 w-full bg-stone-100 dark:bg-teal-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${width}%`, backgroundColor: color }}
              />
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center pt-2 border-t-2 border-stone-100 dark:border-teal-700">
          <span className="text-sm font-body font-bold text-teal-500 dark:text-teal-400">% del dinero comprometido</span>
          <span className="text-base font-mono font-black" style={{ color: execColor }}>
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
  const gridColor = isDark ? '#0f3330' : '#ccfbf1'
  const textColor = isDark ? '#5eead4' : '#0f766e'

  return (
    <div className="bg-white dark:bg-teal-900 rounded-3xl border-2 border-brand-100 dark:border-teal-700 p-5 shadow-sm transition-colors duration-200">
      <h3 className="text-sm font-display font-black text-teal-800 dark:text-teal-200 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
          <XAxis type="number" tickFormatter={formatMillions} tick={{ fontSize: 10, fontFamily: 'Rubik', fill: textColor }} />
          <YAxis
            type="category" dataKey="name" width={140}
            tick={{ fontSize: 10, fontFamily: 'Rubik', fill: textColor }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: 'Rubik', color: textColor }} />
          <Bar dataKey="Vigente" name="Disponible" fill="#5eead4" radius={[0, 4, 4, 0]} maxBarSize={16} />
          <Bar dataKey="Devengado" name="Comprometido" radius={[0, 4, 4, 0]} maxBarSize={16}>
            {data.map((d, i) => (
              <Cell key={i} fill={getExecutionColor(d.pct)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
