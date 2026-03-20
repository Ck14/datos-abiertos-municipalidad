import { Search, X } from 'lucide-react'
import { fixEncoding } from '../../utils/formatters'

function Select({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-body font-medium text-slate-500 uppercase tracking-wide">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-xs font-body bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 transition-all"
      >
        <option value="">Todos</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

export default function TableFilters({ records, filters, onFilterChange, onClear }) {
  const programas   = [...new Set(records.map(r => fixEncoding(r.programa)))].sort()
  const fuentes     = [...new Set(records.map(r => fixEncoding(r.fuente)))].sort()
  const tipos       = [...new Set(records.map(r => fixEncoding(r.tipoPresupuesto)))].sort()
  const hasFilters  = Object.values(filters).some(Boolean)

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex flex-wrap gap-3 items-end">
        {/* Búsqueda */}
        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label className="text-[10px] font-body font-medium text-slate-500 uppercase tracking-wide">Buscar</label>
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Actividad, renglón, programa…"
              value={filters.search || ''}
              onChange={e => onFilterChange('search', e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 text-xs font-body border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 transition-all"
            />
          </div>
        </div>

        <Select label="Programa"       value={filters.programa   || ''} onChange={v => onFilterChange('programa',   v)} options={programas} />
        <Select label="Fuente"         value={filters.fuente     || ''} onChange={v => onFilterChange('fuente',     v)} options={fuentes} />
        <Select label="Tipo"           value={filters.tipo       || ''} onChange={v => onFilterChange('tipo',       v)} options={tipos} />

        {hasFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs font-body text-slate-500 hover:text-red-500 transition-colors self-end pb-1.5"
          >
            <X size={12} /> Limpiar
          </button>
        )}
      </div>
    </div>
  )
}
