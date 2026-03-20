import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { aggregateByFuente } from '../../utils/budgetAggregator'
import { formatMillions, formatPct } from '../../utils/formatters'

const COLORS = ['#1d4ed8', '#4f46e5', '#0891b2', '#059669']

const SHORT_NAMES = {
  'INGRESOS PROPIOS': 'Propios',
  'INGRESOS TRIBUTARIOS IVA PAZ': 'IVA Paz',
  'INGRESOS ORDINARIOS DE APORTE CONSTITUCIONAL': 'Aporte Const.',
  'OTROS RECURSOS DEL TESORO CON AFECTACIÓN ESPECÍFICA': 'Otros',
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg text-xs font-body">
      <p className="font-medium text-slate-800 mb-0.5">{d.name}</p>
      <p className="text-slate-600">{formatMillions(d.value)}</p>
      <p className="text-slate-500">{formatPct(d.payload.pct)}% del total</p>
    </div>
  )
}

export default function FuenteDonut({ records }) {
  const raw = aggregateByFuente(records)
  const total = raw.reduce((s, d) => s + d.value, 0)
  const data = raw.map(d => ({
    ...d,
    name: SHORT_NAMES[d.name] || d.name,
    pct: total > 0 ? (d.value / total) * 100 : 0,
  }))

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h3 className="text-sm font-display font-semibold text-slate-800 mb-4">Fuentes de Financiamiento</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span className="text-xs font-body text-slate-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
