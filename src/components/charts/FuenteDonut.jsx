import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { aggregateByFuente } from '../../utils/budgetAggregator'
import { formatMillions, formatPct } from '../../utils/formatters'
import { useIsDark } from '../../contexts/ThemeContext'

// Nombres más amigables para el público general
const FUENTE_META = {
  'INGRESOS PROPIOS':                                     { short: 'Cobros propios del municipio',  color: '#0d9488', icon: <CoinIcon color="#0d9488" /> },
  'INGRESOS TRIBUTARIOS IVA PAZ':                         { short: 'IVA de la paz (impuesto)',       color: '#a21caf', icon: <ReceiptIcon color="#a21caf" /> },
  'INGRESOS ORDINARIOS DE APORTE CONSTITUCIONAL':         { short: 'Aporte del gobierno central',   color: '#1d4ed8', icon: <GovIcon color="#1d4ed8" /> },
  'OTROS RECURSOS DEL TESORO CON AFECTACIÓN ESPECÍFICA':  { short: 'Fondos especiales del Estado',  color: '#15803d', icon: <StarIcon color="#15803d" /> },
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-white dark:bg-teal-900 border-2 border-brand-200 dark:border-teal-600 rounded-2xl px-4 py-3 shadow-xl text-sm font-body">
      <p className="font-bold text-teal-900 dark:text-teal-100 mb-1">{d.payload.meta.short}</p>
      <p className="font-extrabold text-teal-700 dark:text-teal-200 text-base">{formatMillions(d.value)}</p>
      <p className="text-teal-500 text-xs mt-0.5">{formatPct(d.payload.pct)} del total recibido</p>
    </div>
  )
}

export default function FuenteDonut({ records }) {
  const isDark = useIsDark()
  const raw   = aggregateByFuente(records)
  const total = raw.reduce((s, d) => s + d.value, 0)

  const data = raw.map(d => {
    const meta = Object.entries(FUENTE_META).find(([k]) =>
      d.name.toUpperCase().includes(k)
    )?.[1] ?? { short: d.name, color: '#14b8a6', icon: <DefaultIcon color="#14b8a6" /> }
    return { ...d, meta, pct: total > 0 ? (d.value / total) * 100 : 0 }
  })

  const strokeColor = isDark ? '#042f2e' : '#f0fdfa'

  return (
    <div className="bg-white dark:bg-teal-900 rounded-3xl border-2 border-brand-100 dark:border-teal-700 p-6 shadow-sm flex flex-col transition-colors duration-200">
      <div className="mb-4">
        <h3 className="text-lg font-display font-bold text-teal-900 dark:text-teal-100">
          ¿De dónde viene el dinero?
        </h3>
        <p className="text-sm font-body text-teal-500 dark:text-teal-400 mt-0.5">
          Total disponible: <span className="font-bold text-brand-600 dark:text-brand-400 text-base">{formatMillions(total)}</span>
        </p>
      </div>

      <ResponsiveContainer width="100%" height={170}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={52} outerRadius={78}
            paddingAngle={4} dataKey="value"
            startAngle={90} endAngle={-270}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.meta.color} stroke={strokeColor} strokeWidth={3} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="space-y-2.5 mt-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-2xl"
            style={{ backgroundColor: d.meta.color + '12', border: `2px solid ${d.meta.color}30` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: d.meta.color + '20' }}>
              {d.meta.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-display font-bold text-teal-900 dark:text-teal-100 leading-tight">{d.meta.short}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-2 bg-white/60 dark:bg-teal-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${d.pct}%`, backgroundColor: d.meta.color }} />
                </div>
                <span className="text-xs font-mono font-bold flex-shrink-0" style={{ color: d.meta.color }}>{formatPct(d.pct)}</span>
              </div>
            </div>
            <p className="text-sm font-mono font-bold text-teal-900 dark:text-teal-100 flex-shrink-0">{formatMillions(d.value)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function CoinIcon({ color }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M9 9.5c0-1.1.9-2 2-2h2a2 2 0 0 1 0 4h-2a2 2 0 0 0 0 4h2a2 2 0 0 0 2-2"/></svg>
}
function ReceiptIcon({ color }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><path d="M9 7h6M9 11h6M9 15h4"/></svg>
}
function GovIcon({ color }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M3 22V11l9-9 9 9v11"/><path d="M9 22V15h6v7"/></svg>
}
function StarIcon({ color }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}
function DefaultIcon({ color }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
}
