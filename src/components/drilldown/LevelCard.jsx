import { ChevronRight } from 'lucide-react'
import { formatMillions, formatPct } from '../../utils/formatters'
import { getExecutionColor } from '../../utils/colorScale'

// Anillo SVG reutilizado del mismo estilo que ProgramasGrid
function Ring({ pct, color, size = 48 }) {
  const r     = (size - 8) / 2
  const circ  = 2 * Math.PI * r
  const filled = (Math.min(pct, 100) / 100) * circ

  return (
    <svg width={size} height={size} className="flex-shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={5} />
      <circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dasharray 0.7s ease' }}
      />
      <text
        x={size/2} y={size/2 + 4}
        textAnchor="middle" fontSize={9}
        fontFamily="JetBrains Mono, monospace" fontWeight={700}
        fill={color}
      >
        {pct < 1 ? '<1%' : `${Math.round(pct)}%`}
      </text>
    </svg>
  )
}

// Tarjeta hero — ítem más grande del nivel
export function HeroLevelCard({ item, meta, onClick }) {
  const execColor = getExecutionColor(item.pctEjecucion)
  const clickable = item.hasChildren

  return (
    <button
      onClick={() => clickable && onClick(item)}
      disabled={!clickable}
      className={`col-span-full w-full text-left rounded-2xl p-5 text-white relative overflow-hidden transition-all duration-200 ${
        clickable ? 'hover:brightness-110 hover:shadow-lg active:scale-[0.99]' : ''
      }`}
      style={{ background: `linear-gradient(135deg, ${meta.color}f0, ${meta.color}99)` }}
    >
      {/* Decoración de fondo */}
      <div className="absolute right-5 top-4 text-8xl opacity-10 select-none pointer-events-none" aria-hidden>
        {meta.icon}
      </div>

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{meta.icon}</span>
            <span className="text-[10px] font-body font-medium opacity-75 uppercase tracking-widest">
              {item.levelLabel} principal
            </span>
            {clickable && <ChevronRight size={14} className="opacity-70 ml-auto" />}
          </div>
          <h4 className="font-display font-bold text-base sm:text-lg leading-snug mb-3 pr-8">
            {item.label}
          </h4>

          <div className="flex flex-wrap items-end gap-5">
            {[
              { label: 'Presupuesto vigente', val: item.totalVigente, big: true },
              { label: 'Devengado',           val: item.totalDevengado },
              { label: 'Pagado',              val: item.totalPagado },
            ].map(({ label, val, big }) => (
              <div key={label}>
                <p className="text-[10px] opacity-70 font-body">{label}</p>
                <p className={`font-display font-bold ${big ? 'text-xl' : 'text-base'}`}>
                  {formatMillions(val)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <Ring pct={item.pctEjecucion} color="white" size={72} />
          <span className="text-[10px] font-body opacity-75">ejecución</span>
        </div>
      </div>

      {/* Barra de ejecución */}
      <div className="mt-4 h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-white/80 transition-all duration-700"
          style={{ width: `${Math.min(item.pctEjecucion, 100)}%` }}
        />
      </div>
    </button>
  )
}

// Tarjeta mini — resto de ítems
export default function LevelCard({ item, meta, onClick }) {
  const execColor = getExecutionColor(item.pctEjecucion)
  const clickable = item.hasChildren

  return (
    <button
      onClick={() => clickable && onClick(item)}
      disabled={!clickable}
      className={`w-full text-left bg-white border border-slate-100 rounded-xl p-3.5 flex items-center gap-3 transition-all duration-150 ${
        clickable
          ? 'hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
          : 'cursor-default'
      }`}
    >
      {/* Ícono */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ backgroundColor: meta.color + '18' }}
      >
        {meta.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <p className="text-xs font-display font-semibold text-slate-800 leading-tight line-clamp-2">
            {item.label}
          </p>
          {clickable && <ChevronRight size={13} className="text-slate-400 flex-shrink-0 mt-0.5" />}
        </div>
        <p className="text-sm font-mono font-bold mt-0.5" style={{ color: meta.color }}>
          {formatMillions(item.totalVigente)}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(item.pctEjecucion, 100)}%`, backgroundColor: execColor }}
            />
          </div>
        </div>
        <p className="text-[10px] text-slate-400 font-body mt-0.5">
          Devengado: <span className="font-medium text-slate-600">{formatMillions(item.totalDevengado)}</span>
        </p>
      </div>

      {/* Anillo */}
      <Ring pct={item.pctEjecucion} color={execColor} size={44} />
    </button>
  )
}
