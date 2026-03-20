import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend
} from 'recharts'
import { formatMillions } from '../../utils/formatters'
import { getExecutionColor } from '../../utils/colorScale'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg text-xs font-body max-w-xs">
      <p className="font-medium text-slate-800 mb-1 truncate">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-1.5 text-slate-600">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.fill || p.color }} />
          <span>{p.name}: <strong>{formatMillions(p.value)}</strong></span>
        </div>
      ))}
    </div>
  )
}

export default function ExecutionBarChart({ items, title = 'Ejecución Presupuestaria' }) {
  const data = items.slice(0, 12).map(item => ({
    name: item.label.length > 22 ? item.label.slice(0, 22) + '…' : item.label,
    Vigente: item.totalVigente,
    Devengado: item.totalDevengado,
    pct: item.pctEjecucion,
  }))

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h3 className="text-sm font-display font-semibold text-slate-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis type="number" tickFormatter={formatMillions} tick={{ fontSize: 10, fontFamily: 'DM Sans' }} />
          <YAxis
            type="category" dataKey="name" width={140}
            tick={{ fontSize: 10, fontFamily: 'DM Sans', fill: '#64748b' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: 'DM Sans' }} />
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
