import { FileText, CalendarCheck, TrendingUp, CheckCircle2 } from 'lucide-react'
import { formatMillions, formatPct } from '../../utils/formatters'
import { getExecutionColor } from '../../utils/colorScale'

function KPICard({ icon: Icon, label, amount, pct, color, showBar = false }) {
  const barColor = showBar ? getExecutionColor(pct) : null

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col gap-3 animate-slide-up shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '18' }}>
          <Icon size={18} style={{ color }} />
        </div>
        {pct !== undefined && (
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            {formatPct(pct)}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-body text-slate-500 dark:text-slate-400 mb-0.5">{label}</p>
        <p className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100 tracking-tight">{formatMillions(amount)}</p>
      </div>
      {showBar && (
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(pct || 0, 100)}%`, backgroundColor: barColor }}
          />
        </div>
      )}
    </div>
  )
}

export default function KPICards({ totals }) {
  const { totalAsignado, totalVigente, totalDevengado, totalPagado } = totals
  const pctDevengado = totalVigente > 0 ? (totalDevengado / totalVigente) * 100 : 0
  const pctPagado    = totalVigente > 0 ? (totalPagado    / totalVigente) * 100 : 0

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <KPICard icon={FileText}      label="Presupuesto Asignado" amount={totalAsignado}  color="#1d4ed8" />
      <KPICard icon={CalendarCheck} label="Presupuesto Vigente"  amount={totalVigente}   color="#4f46e5" />
      <KPICard icon={TrendingUp}    label="Total Devengado"      amount={totalDevengado} pct={pctDevengado} color="#0891b2" showBar />
      <KPICard icon={CheckCircle2}  label="Total Pagado"         amount={totalPagado}    pct={pctPagado}    color="#059669" showBar />
    </div>
  )
}
