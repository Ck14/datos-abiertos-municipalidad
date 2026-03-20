import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { aggregateByFuente } from '../../utils/budgetAggregator'
import { formatMillions, formatPct } from '../../utils/formatters'

const FUENTE_META = {
  'INGRESOS PROPIOS':                                      { icon: '🏦', short: 'Ingresos Propios',        color: '#1d4ed8' },
  'INGRESOS TRIBUTARIOS IVA PAZ':                          { icon: '🧾', short: 'IVA Paz',                  color: '#4f46e5' },
  'INGRESOS ORDINARIOS DE APORTE CONSTITUCIONAL':          { icon: '🏛️', short: 'Aporte Constitucional',   color: '#0891b2' },
  'OTROS RECURSOS DEL TESORO CON AFECTACIÓN ESPECÍFICA':   { icon: '💼', short: 'Otros Recursos',           color: '#059669' },
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg text-xs font-body">
      <p className="font-semibold text-slate-800 mb-0.5">{d.payload.meta.short}</p>
      <p className="text-slate-600">{formatMillions(d.value)}</p>
      <p className="text-slate-500">{formatPct(d.payload.pct)} del total</p>
    </div>
  )
}

export default function FuenteDonut({ records }) {
  const raw   = aggregateByFuente(records)
  const total = raw.reduce((s, d) => s + d.value, 0)

  const data = raw.map(d => {
    const meta = Object.entries(FUENTE_META).find(([k]) =>
      d.name.toUpperCase().includes(k)
    )?.[1] ?? { icon: '💰', short: d.name, color: '#94a3b8' }
    return {
      ...d,
      meta,
      pct: total > 0 ? (d.value / total) * 100 : 0,
    }
  })

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col">
      <h3 className="text-sm font-display font-semibold text-slate-800 mb-1">
        Fuentes de Financiamiento
      </h3>
      <p className="text-xs font-body text-slate-500 mb-4">
        Total vigente: <span className="font-semibold text-slate-700">{formatMillions(total)}</span>
      </p>

      {/* Donut */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.meta.color} stroke="white" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Tarjetas de fuente */}
      <div className="grid grid-cols-1 gap-2 mt-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            {/* Ícono con color */}
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
              style={{ backgroundColor: d.meta.color + '18' }}
            >
              {d.meta.icon}
            </div>

            {/* Texto */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-display font-semibold text-slate-800 truncate">{d.meta.short}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${d.pct}%`, backgroundColor: d.meta.color }}
                  />
                </div>
                <span className="text-[10px] font-mono font-bold flex-shrink-0" style={{ color: d.meta.color }}>
                  {formatPct(d.pct)}
                </span>
              </div>
            </div>

            {/* Monto */}
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-mono font-bold text-slate-800">{formatMillions(d.value)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
