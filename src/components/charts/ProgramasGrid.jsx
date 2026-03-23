import { ChevronRight } from 'lucide-react'
import { aggregateByPrograma } from '../../utils/budgetAggregator'
import { formatMillions, formatPct } from '../../utils/formatters'
import { getExecutionColor } from '../../utils/colorScale'

// Nombres amigables para el público general
const PROGRAM_META = {
  'ACTIVIDADES CENTRALES':                          { color: '#0d9488', short: 'Administración Municipal' },
  'ACCESO AL AGUA POTABLE Y SANEAMIENTO BÁSICO':    { color: '#1d4ed8', short: 'Agua limpia y drenajes' },
  'SEGURIDAD INTEGRAL':                             { color: '#7c3aed', short: 'Seguridad ciudadana' },
  'MOVILIDAD URBANA Y ESPACIOS PÚBLICOS':           { color: '#0369a1', short: 'Calles y espacios públicos' },
  'AMBIENTE Y RECURSOS NATURALES':                  { color: '#15803d', short: 'Cuidado del medio ambiente' },
  'INCREMENTO DE LA COMPETITIVIDAD TURÍSTICA':      { color: '#b45309', short: 'Turismo y economía local' },
  'PREVENCIÓN DE LA MORTALIDAD':                    { color: '#dc2626', short: 'Salud preventiva' },
  'GESTIÓN DE LA EDUCACIÓN LOCAL DE CALIDAD':       { color: '#6d28d9', short: 'Educación para todos' },
  'RECUPERACIÓN DE LA SALUD':                       { color: '#0f766e', short: 'Atención médica' },
  'PARTIDAS NO ASIGNABLES A PROGRAMAS':             { color: '#78716c', short: 'Gastos generales' },
  'ATENCIÓN A POBLACIÓN VULNERABLE':                { color: '#c2410c', short: 'Ayuda a personas vulnerables' },
  'APOYO AL DESARROLLO ECONÓMICO LOCAL':            { color: '#166534', short: 'Desarrollo económico' },
}

// Íconos SVG en lugar de emojis
const PROGRAM_ICONS = {
  'Administración Municipal':    AdminIcon,
  'Agua limpia y drenajes':      WaterIcon,
  'Seguridad ciudadana':         ShieldIcon,
  'Calles y espacios públicos':  RoadIcon,
  'Cuidado del medio ambiente':  LeafIcon,
  'Turismo y economía local':    MapIcon,
  'Salud preventiva':            HeartIcon,
  'Educación para todos':        BookIcon,
  'Atención médica':             CrossIcon,
  'Gastos generales':            FileIcon,
  'Ayuda a personas vulnerables':HandsIcon,
  'Desarrollo económico':        ChartIcon,
}

const FALLBACK = { color: '#14b8a6', short: 'Programa' }

function getMeta(name) {
  if (PROGRAM_META[name]) return PROGRAM_META[name]
  const key = Object.keys(PROGRAM_META).find(k =>
    name.toLowerCase().includes(k.toLowerCase().slice(0, 12))
  )
  return key ? PROGRAM_META[key] : FALLBACK
}

function ProgramIcon({ shortName, color, size = 20 }) {
  const IconComp = PROGRAM_ICONS[shortName]
  if (!IconComp) return <DefaultProgramIcon color={color} size={size} />
  return <IconComp color={color} size={size} />
}

function Ring({ pct, color, size = 52 }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const filled = (Math.min(pct, 100) / 100) * circ
  return (
    <svg width={size} height={size} className="flex-shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" style={{ stroke: 'var(--ring-track)' }} strokeWidth={5} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dasharray 0.7s ease' }}
      />
      <text x={size/2} y={size/2+4} textAnchor="middle" fontSize={9}
        fontFamily="JetBrains Mono, monospace" fontWeight={700} fill={color}>
        {pct < 1 ? '<1%' : `${Math.round(pct)}%`}
      </text>
    </svg>
  )
}

function HeroCard({ item, meta, totalVigente, onClick }) {
  const pctOfTotal = totalVigente > 0 ? (item.vigente / totalVigente) * 100 : 0
  return (
    <button
      onClick={() => onClick(item.name)}
      className="col-span-full w-full text-left rounded-3xl p-6 text-white relative overflow-hidden hover:brightness-110 hover:shadow-xl transition-all duration-200 active:scale-[0.99]"
      style={{ background: `linear-gradient(135deg, ${meta.color}f0, ${meta.color}80)` }}
    >
      <div className="absolute right-6 top-5 opacity-10 pointer-events-none select-none">
        <ProgramIcon shortName={meta.short} color="white" size={80} />
      </div>
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <ProgramIcon shortName={meta.short} color="white" size={22} />
            </div>
            <span className="text-xs font-body font-semibold opacity-80 bg-white/20 px-2.5 py-1 rounded-full">
              Programa principal
            </span>
          </div>
          <h4 className="font-display font-bold text-xl leading-tight mb-3">{meta.short}</h4>
          <div className="flex flex-wrap gap-5">
            <div>
              <p className="text-xs opacity-70 font-body">Dinero disponible</p>
              <p className="text-2xl font-display font-bold">{formatMillions(item.vigente)}</p>
            </div>
            <div>
              <p className="text-xs opacity-70 font-body">Comprometido</p>
              <p className="text-lg font-display font-semibold">{formatMillions(item.devengado)}</p>
            </div>
            <div>
              <p className="text-xs opacity-70 font-body">Del total</p>
              <p className="text-lg font-display font-semibold">{formatPct(pctOfTotal)}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <Ring pct={item.pctEjecucion} color="white" size={76} />
          <span className="text-xs font-body opacity-80">ejecutado</span>
        </div>
      </div>
      <div className="mt-4 h-2.5 w-full bg-white/20 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-white/70 transition-all duration-700" style={{ width: `${Math.min(item.pctEjecucion, 100)}%` }} />
      </div>
      <p className="text-xs opacity-60 mt-1.5 flex items-center gap-1">
        Toca para ver el detalle <ChevronRight size={12} />
      </p>
    </button>
  )
}

function MiniCard({ item, meta, onClick }) {
  const execColor = getExecutionColor(item.pctEjecucion)
  return (
    <button
      onClick={() => onClick(item.name)}
      className="w-full text-left bg-white dark:bg-teal-900 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border-2"
      style={{ borderColor: meta.color + '30' }}
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: meta.color + '18' }}>
        <ProgramIcon shortName={meta.short} color={meta.color} size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-display font-bold text-teal-900 dark:text-teal-100 leading-tight line-clamp-2">{meta.short}</p>
        <p className="text-sm font-mono font-bold mt-0.5" style={{ color: meta.color }}>{formatMillions(item.vigente)}</p>
        <div className="mt-1.5 h-1.5 w-full bg-teal-100 dark:bg-teal-700 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(item.pctEjecucion, 100)}%`, backgroundColor: execColor }} />
        </div>
      </div>
      <Ring pct={item.pctEjecucion} color={execColor} size={46} />
    </button>
  )
}

export default function ProgramasGrid({ records, onProgramClick }) {
  const data = aggregateByPrograma(records)
  if (!data.length) return null
  const [hero, ...rest] = data
  const heroMeta = getMeta(hero.name)
  const totalVigente = data.reduce((s, d) => s + d.vigente, 0)

  return (
    <div className="bg-white dark:bg-teal-900 rounded-3xl border-2 border-brand-100 dark:border-teal-700 p-5 shadow-sm transition-colors duration-200">
      <div className="mb-4">
        <h3 className="text-lg font-display font-bold text-teal-900 dark:text-teal-100">¿En qué se usa el dinero?</h3>
        <p className="text-sm font-body text-teal-500 dark:text-teal-400">{data.length} programas municipales activos</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <HeroCard item={hero} meta={heroMeta} totalVigente={totalVigente} onClick={onProgramClick} />
        {rest.map(item => (
          <MiniCard key={item.name} item={item} meta={getMeta(item.name)} onClick={onProgramClick} />
        ))}
      </div>
      <div className="flex items-center flex-wrap gap-4 mt-4 pt-3 border-t-2 border-teal-100 dark:border-teal-700">
        <span className="text-[10px] font-body font-bold text-teal-400 uppercase tracking-wide">Nivel de avance:</span>
        {[['#ef4444','Bajo (menos del 30%)'],['#f59e0b','Medio (30–70%)'],['#22c55e','Alto (más del 70%)']].map(([c,l]) => (
          <span key={l} className="flex items-center gap-1.5 text-xs font-body font-semibold text-teal-600 dark:text-teal-400">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />{l}
          </span>
        ))}
      </div>
    </div>
  )
}

// SVG Icons para programas
function AdminIcon({ color, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
}
function WaterIcon({ color, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
}
function ShieldIcon({ color, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
}
function RoadIcon({ color, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M3 17l9 4 9-4"/><path d="M3 12l9-9 9 9"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
}
function LeafIcon({ color, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M17 8C8 10 5.9 16.17 3.82 22h2.71l2.27-7.61A16.77 16.77 0 0 1 17 8z"/><path d="M3.82 22c0-11 8-19.17 18-20a19.07 19.07 0 0 0-7 13.59"/></svg>
}
function MapIcon({ color, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
}
function HeartIcon({ color, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
}
function BookIcon({ color, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
}
function CrossIcon({ color, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
}
function FileIcon({ color, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
}
function HandsIcon({ color, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M18 1l3 3-3 3"/><path d="M2 20l3-3-3-3"/><path d="M21 4H8a2 2 0 0 0-2 2v4"/><path d="M3 20h13a2 2 0 0 0 2-2v-4"/></svg>
}
function ChartIcon({ color, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
}
function DefaultProgramIcon({ color, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
}
