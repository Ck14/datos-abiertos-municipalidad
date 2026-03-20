import { Search, X } from 'lucide-react'
import { fixEncoding } from '../../utils/formatters'

function Select({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <label className="text-[10px] font-body font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full text-xs font-body bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-300 dark:focus:ring-brand-700 focus:border-brand-400 dark:focus:border-brand-600 transition-all"
      >
        <option value="">Todos</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

export default function TableFilters({ records, filters, onFilterChange, onClear }) {
  // Cascada: cada select filtra con base en las selecciones previas
  const base = records.map(r => ({
    programa:        fixEncoding(r.programa),
    subPrograma:     fixEncoding(r.subPrograma),
    proyecto:        fixEncoding(r.proyecto),
    actividad:       fixEncoding(r.actividad),
    obra:            fixEncoding(r.obra),
    fuente:          fixEncoding(r.fuente),
    tipoPresupuesto: fixEncoding(r.tipoPresupuesto),
  }))

  const byPrograma    = filters.programa    ? base.filter(r => r.programa    === filters.programa)    : base
  const bySubPrograma = filters.subPrograma ? byPrograma.filter(r => r.subPrograma === filters.subPrograma) : byPrograma
  const byProyecto    = filters.proyecto    ? bySubPrograma.filter(r => r.proyecto === filters.proyecto)    : bySubPrograma
  const byActividad   = filters.actividad   ? byProyecto.filter(r => r.actividad === filters.actividad)     : byProyecto

  const programas    = [...new Set(base.map(r => r.programa))].filter(Boolean).sort()
  const subProgramas = [...new Set(byPrograma.map(r => r.subPrograma))].filter(Boolean).sort()
  const proyectos    = [...new Set(bySubPrograma.map(r => r.proyecto))].filter(Boolean).sort()
  const actividades  = [...new Set(byProyecto.map(r => r.actividad))].filter(Boolean).sort()
  const obras        = [...new Set(byActividad.map(r => r.obra))].filter(v => v && v !== 'NA').sort()
  const fuentes      = [...new Set(base.map(r => r.fuente))].filter(Boolean).sort()
  const tipos        = [...new Set(base.map(r => r.tipoPresupuesto))].filter(Boolean).sort()

  const hasFilters = Object.values(filters).some(Boolean)

  // Al cambiar un nivel superior, limpia los niveles inferiores
  const handlePrograma    = v => { onFilterChange('programa', v); onFilterChange('subPrograma', ''); onFilterChange('proyecto', ''); onFilterChange('actividad', ''); onFilterChange('obra', '') }
  const handleSubPrograma = v => { onFilterChange('subPrograma', v); onFilterChange('proyecto', ''); onFilterChange('actividad', ''); onFilterChange('obra', '') }
  const handleProyecto    = v => { onFilterChange('proyecto', v); onFilterChange('actividad', ''); onFilterChange('obra', '') }
  const handleActividad   = v => { onFilterChange('actividad', v); onFilterChange('obra', '') }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm transition-colors duration-200">
      {/* Búsqueda — ancho completo */}
      <div className="flex flex-col gap-1 mb-3">
        <label className="text-[10px] font-body font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Buscar</label>
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Programa, actividad, obra, renglón…"
            value={filters.search || ''}
            onChange={e => onFilterChange('search', e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 text-xs font-body bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-300 dark:focus:ring-brand-700 focus:border-brand-400 dark:focus:border-brand-600 transition-all"
          />
        </div>
      </div>

      {/* Jerarquía programática — 2 cols en móvil */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <Select label="Programa"    value={filters.programa    || ''} onChange={handlePrograma}    options={programas} />
        <Select label="SubPrograma" value={filters.subPrograma || ''} onChange={handleSubPrograma} options={subProgramas} />
        <Select label="Proyecto"    value={filters.proyecto    || ''} onChange={handleProyecto}    options={proyectos} />
        <Select label="Actividad"   value={filters.actividad   || ''} onChange={handleActividad}   options={actividades} />
      </div>

      {/* Otros filtros */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-end">
        <Select label="Obra"   value={filters.obra   || ''} onChange={v => onFilterChange('obra',   v)} options={obras} />
        <Select label="Fuente" value={filters.fuente  || ''} onChange={v => onFilterChange('fuente', v)} options={fuentes} />
        <Select label="Tipo"   value={filters.tipo    || ''} onChange={v => onFilterChange('tipo',   v)} options={tipos} />

        {hasFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs font-body text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors self-end pb-1.5"
          >
            <X size={12} /> Limpiar
          </button>
        )}
      </div>
    </div>
  )
}
