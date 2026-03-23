import { Wallet, CalendarDays, ClipboardCheck, BadgeCheck } from 'lucide-react'
import { formatMillions, formatPct } from '../../utils/formatters'

// Gradientes inline para garantizar renderizado — Tailwind purga clases dinámicas
const CARD_STYLES = [
  {
    icon: Wallet,
    label: 'Dinero Aprobado',
    explanation: 'Lo que se autorizó gastar al inicio del año',
    gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)',
    shadow: '0 8px 24px #0d948840',
  },
  {
    icon: CalendarDays,
    label: 'Dinero Disponible',
    explanation: 'Cuánto hay para gastar en este momento',
    gradient: 'linear-gradient(135deg, #d946ef, #a21caf)',
    shadow: '0 8px 24px #a21caf40',
  },
  {
    icon: ClipboardCheck,
    label: 'Comprometido',
    explanation: 'Ya hay factura o contrato firmado para pagarlo',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    shadow: '0 8px 24px #d9770640',
    showPct: true,
  },
  {
    icon: BadgeCheck,
    label: 'Ya Pagado',
    explanation: 'El dinero que ya salió del banco municipal',
    gradient: 'linear-gradient(135deg, #22c55e, #15803d)',
    shadow: '0 8px 24px #15803d40',
    showPct: true,
  },
]

function KPICard({ config, amount, pct }) {
  const { icon: Icon, label, explanation, gradient, shadow, showPct } = config
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 animate-pop hover:-translate-y-1 transition-all duration-200 cursor-default"
      style={{ background: gradient, boxShadow: shadow }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
          <Icon size={24} className="text-white" />
        </div>
        {showPct && pct !== undefined && (
          <span className="text-sm font-mono font-bold px-3 py-1 rounded-full flex-shrink-0 text-white" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}>
            {formatPct(pct)}
          </span>
        )}
      </div>

      <div>
        <p className="text-xs font-display font-bold uppercase tracking-wider mb-1 text-white/75">{label}</p>
        <p className="text-2xl sm:text-[1.75rem] font-display font-extrabold leading-none text-white">
          {formatMillions(amount)}
        </p>
        <p className="text-xs font-body mt-2 leading-snug text-white/70">{explanation}</p>
      </div>

      {showPct && pct !== undefined && (
        <div>
          <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(pct || 0, 100)}%`, backgroundColor: 'rgba(255,255,255,0.65)' }} />
          </div>
          <p className="text-[10px] font-body mt-1 text-white/60">del dinero disponible</p>
        </div>
      )}
    </div>
  )
}

export default function KPICards({ totals }) {
  const { totalAsignado, totalVigente, totalDevengado, totalPagado } = totals
  const pctDevengado = totalVigente > 0 ? (totalDevengado / totalVigente) * 100 : 0
  const pctPagado    = totalVigente > 0 ? (totalPagado    / totalVigente) * 100 : 0
  const amounts = [totalAsignado, totalVigente, totalDevengado, totalPagado]
  const pcts    = [undefined, undefined, pctDevengado, pctPagado]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {CARD_STYLES.map((cfg, i) => (
        <KPICard key={cfg.label} config={cfg} amount={amounts[i]} pct={pcts[i]} />
      ))}
    </div>
  )
}
