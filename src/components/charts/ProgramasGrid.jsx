import { aggregateByPrograma } from '../../utils/budgetAggregator'
import { formatMillions, formatPct } from '../../utils/formatters'
import { getExecutionColor } from '../../utils/colorScale'

// Ícono, color y etiqueta corta por programa
const PROGRAM_META = {
  'ACTIVIDADES CENTRALES':                          { icon: '🏛️', color: '#1d4ed8', short: 'Administración' },
  'ACCESO AL AGUA POTABLE Y SANEAMIENTO BÁSICO':    { icon: '💧', color: '#0891b2', short: 'Agua y Saneamiento' },
  'SEGURIDAD INTEGRAL':                             { icon: '🛡️', color: '#7c3aed', short: 'Seguridad' },
  'MOVILIDAD URBANA Y ESPACIOS PÚBLICOS':           { icon: '🏙️', color: '#0369a1', short: 'Movilidad Urbana' },
  'AMBIENTE Y RECURSOS NATURALES':                  { icon: '🌿', color: '#15803d', short: 'Ambiente' },
  'INCREMENTO DE LA COMPETITIVIDAD TURÍSTICA':      { icon: '✈️', color: '#b45309', short: 'Turismo' },
  'PREVENCIÓN DE LA MORTALIDAD':                    { icon: '❤️', color: '#dc2626', short: 'Prevención Mortalidad' },
  'GESTIÓN DE LA EDUCACIÓN LOCAL DE CALIDAD':       { icon: '📚', color: '#7e22ce', short: 'Educación' },
  'RECUPERACIÓN DE LA SALUD':                       { icon: '🏥', color: '#0f766e', short: 'Salud' },
  'PARTIDAS NO ASIGNABLES A PROGRAMAS':             { icon: '📋', color: '#64748b', short: 'Otras Partidas' },
  'ATENCIÓN A POBLACIÓN VULNERABLE':                { icon: '🤝', color: '#c2410c', short: 'Población Vulnerable' },
  'APOYO AL DESARROLLO ECONÓMICO LOCAL':            { icon: '📈', color: '#166534', short: 'Desarrollo Económico' },
}

const FALLBACK = { icon: '📌', color: '#94a3b8', short: 'Programa' }

function getMeta(name) {
  // Búsqueda exacta primero, luego parcial
  if (PROGRAM_META[name]) return PROGRAM_META[name]
  const key = Object.keys(PROGRAM_META).find(k =>
    name.toLowerCase().includes(k.toLowerCase().slice(0, 12))
  )
  return key ? PROGRAM_META[key] : FALLBACK
}

// Anillo SVG de progreso
function Ring({ pct, color, size = 52 }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const filled = (Math.min(pct, 100) / 100) * circ

  return (
    <svg width={size} height={size} className="flex-shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={5} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 0.7s ease' }}
      />
      <text
        x={size / 2} y={size / 2 + 4}
        textAnchor="middle"
        fontSize={9}
        fontFamily="JetBrains Mono, monospace"
        fontWeight={700}
        fill={color}
      >
        {pct < 1 ? '<1%' : `${Math.round(pct)}%`}
      </text>
    </svg>
  )
}

// Tarjeta grande (primer programa)
function HeroCard({ item, meta, totalVigente }) {
  const pctOfTotal = totalVigente > 0 ? (item.vigente / totalVigente) * 100 : 0
  const execColor  = getExecutionColor(item.pctEjecucion)

  return (
    <div
      className="col-span-full rounded-2xl p-5 text-white relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${meta.color}ee, ${meta.color}99)` }}
    >
      {/* Fondo decorativo */}
      <div
        className="absolute right-4 top-4 text-7xl opacity-10 select-none pointer-events-none"
        aria-hidden
      >
        {meta.icon}
      </div>

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{meta.icon}</span>
            <span className="text-xs font-body font-medium opacity-80 uppercase tracking-widest">
              Programa principal
            </span>
          </div>
          <h4 className="font-display font-bold text-lg leading-tight mb-3">{meta.short}</h4>

          <div className="flex items-end gap-6">
            <div>
              <p className="text-xs opacity-70 font-body">Presupuesto vigente</p>
              <p className="text-2xl font-display font-bold">{formatMillions(item.vigente)}</p>
            </div>
            <div>
              <p className="text-xs opacity-70 font-body">Devengado</p>
              <p className="text-lg font-display font-semibold">{formatMillions(item.devengado)}</p>
            </div>
            <div>
              <p className="text-xs opacity-70 font-body">Del total</p>
              <p className="text-lg font-display font-semibold">{formatPct(pctOfTotal)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Ring pct={item.pctEjecucion} color="white" size={72} />
          <span className="text-xs font-body opacity-80">ejecución</span>
        </div>
      </div>

      {/* Barra de ejecución */}
      <div className="mt-4 h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-white/80 transition-all duration-700"
          style={{ width: `${Math.min(item.pctEjecucion, 100)}%` }}
        />
      </div>
    </div>
  )
}

// Tarjeta pequeña
function MiniCard({ item, meta }) {
  const execColor = getExecutionColor(item.pctEjecucion)

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-3.5 flex items-center gap-3 hover:border-slate-300 hover:shadow-sm transition-all duration-150">
      {/* Ícono */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ backgroundColor: meta.color + '15' }}
      >
        {meta.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-display font-semibold text-slate-800 leading-tight truncate">{meta.short}</p>
        <p className="text-sm font-mono font-bold mt-0.5" style={{ color: meta.color }}>
          {formatMillions(item.vigente)}
        </p>
        {/* Mini barra */}
        <div className="mt-1.5 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(item.pctEjecucion, 100)}%`, backgroundColor: execColor }}
          />
        </div>
      </div>

      {/* Anillo */}
      <Ring pct={item.pctEjecucion} color={execColor} size={44} />
    </div>
  )
}

export default function ProgramasGrid({ records }) {
  const data = aggregateByPrograma(records)
  if (!data.length) return null

  const [hero, ...rest] = data
  const heroMeta = getMeta(hero.name)
  const totalVigente = data.reduce((s, d) => s + d.vigente, 0)

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-display font-semibold text-slate-800">
          Presupuesto por Programa
        </h3>
        <span className="text-xs font-body text-slate-500">{data.length} programas</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <HeroCard item={hero} meta={heroMeta} totalVigente={totalVigente} />
        {rest.map(item => (
          <MiniCard key={item.name} item={item} meta={getMeta(item.name)} />
        ))}
      </div>

      {/* Leyenda semáforo */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-200">
        <span className="text-[10px] font-body text-slate-400 uppercase tracking-wide">Ejecución:</span>
        {[['#ef4444', '< 30%', 'Bajo'], ['#eab308', '30–70%', 'Medio'], ['#22c55e', '> 70%', 'Alto']].map(([c, r, l]) => (
          <span key={l} className="flex items-center gap-1 text-xs font-body text-slate-500">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}
