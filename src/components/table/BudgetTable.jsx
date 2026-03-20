import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'
import TableFilters from './TableFilters'
import { fixEncoding, formatGTQ, formatPct } from '../../utils/formatters'
import { getExecutionColor, getExecutionTailwind } from '../../utils/colorScale'

const PAGE_SIZE = 25

function PctCell({ pct }) {
  const { text, light, border } = getExecutionTailwind(pct)
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: getExecutionColor(pct) }}
        />
      </div>
      <span className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border ${light} ${text} ${border}`}>
        {formatPct(pct)}
      </span>
    </div>
  )
}

export default function BudgetTable({ records }) {
  const [filters, setFilters] = useState({ search: '', programa: '', fuente: '', tipo: '' })
  const [page, setPage]       = useState(1)
  const [sortKey, setSortKey] = useState('totalVigente')
  const [sortDir, setSortDir] = useState('desc')

  const handleFilter = (key, val) => { setFilters(f => ({ ...f, [key]: val })); setPage(1) }
  const clearFilters = () => { setFilters({ search: '', programa: '', fuente: '', tipo: '' }); setPage(1) }

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const filtered = useMemo(() => {
    let rows = records.map(r => ({
      ...r,
      programa:        fixEncoding(r.programa),
      actividad:       fixEncoding(r.actividad),
      renglon:         fixEncoding(r.renglon),
      fuente:          fixEncoding(r.fuente),
      tipoPresupuesto: fixEncoding(r.tipoPresupuesto),
      pctEjecucion:    r.vigente > 0 ? (r.devengado / r.vigente) * 100 : 0,
    }))

    if (filters.search) {
      const q = filters.search.toLowerCase()
      rows = rows.filter(r =>
        r.programa?.toLowerCase().includes(q) ||
        r.actividad?.toLowerCase().includes(q) ||
        r.renglon?.toLowerCase().includes(q)
      )
    }
    if (filters.programa)  rows = rows.filter(r => r.programa === filters.programa)
    if (filters.fuente)    rows = rows.filter(r => r.fuente === filters.fuente)
    if (filters.tipo)      rows = rows.filter(r => r.tipoPresupuesto === filters.tipo)

    rows.sort((a, b) => {
      const av = a[sortKey] ?? 0
      const bv = b[sortKey] ?? 0
      return sortDir === 'asc' ? av - bv : bv - av
    })

    return rows
  }, [records, filters, sortKey, sortDir])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const cols = [
    { key: 'programa',        label: 'Programa',   sortable: false, width: 'w-40' },
    { key: 'actividad',       label: 'Actividad',  sortable: false, width: 'w-36' },
    { key: 'renglon',         label: 'Renglón',    sortable: false, width: 'w-36' },
    { key: 'fuente',          label: 'Fuente',     sortable: false, width: 'w-32' },
    { key: 'tipoPresupuesto', label: 'Tipo',       sortable: false, width: 'w-28' },
    { key: 'asignado',        label: 'Asignado',   sortable: true,  width: 'w-28' },
    { key: 'vigente',         label: 'Vigente',    sortable: true,  width: 'w-28' },
    { key: 'devengado',       label: 'Devengado',  sortable: true,  width: 'w-28' },
    { key: 'pagado',          label: 'Pagado',     sortable: true,  width: 'w-28' },
    { key: 'pctEjecucion',    label: '% Ejec.',    sortable: true,  width: 'w-28' },
  ]

  return (
    <div className="space-y-4">
      <TableFilters records={records} filters={filters} onFilterChange={handleFilter} onClear={clearFilters} />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <p className="text-xs font-body text-slate-500">
            <span className="font-medium text-slate-800">{filtered.length}</span> registros
          </p>
          <p className="text-xs font-body text-slate-500">
            Página {page} de {totalPages || 1}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-body">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {cols.map(col => (
                  <th
                    key={col.key}
                    className={`text-left px-3 py-2.5 font-medium text-slate-600 whitespace-nowrap ${col.width} ${col.sortable ? 'cursor-pointer hover:text-slate-900 select-none' : ''}`}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && <ArrowUpDown size={10} className={sortKey === col.key ? 'text-brand-600' : 'text-slate-400'} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((row, i) => (
                <tr key={row._id || i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-2 text-slate-800 font-medium max-w-[160px] truncate" title={row.programa}>{row.programa}</td>
                  <td className="px-3 py-2 text-slate-700 max-w-[140px] truncate" title={row.actividad}>{row.actividad}</td>
                  <td className="px-3 py-2 text-slate-600 max-w-[140px] truncate" title={row.renglon}>{row.renglon}</td>
                  <td className="px-3 py-2 text-slate-600 max-w-[130px] truncate" title={row.fuente}>{row.fuente}</td>
                  <td className="px-3 py-2 text-slate-600 max-w-[110px] truncate">{row.tipoPresupuesto}</td>
                  <td className="px-3 py-2 font-mono text-slate-700 text-right">{formatGTQ(row.asignado)}</td>
                  <td className="px-3 py-2 font-mono text-slate-700 text-right">{formatGTQ(row.vigente)}</td>
                  <td className="px-3 py-2 font-mono text-slate-700 text-right">{formatGTQ(row.devengado)}</td>
                  <td className="px-3 py-2 font-mono text-slate-700 text-right">{formatGTQ(row.pagado)}</td>
                  <td className="px-3 py-2"><PctCell pct={row.pctEjecucion} /></td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-slate-400">
                    No se encontraron registros con estos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 text-xs font-body text-slate-600 hover:text-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} /> Anterior
          </button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded text-xs font-body font-medium transition-colors ${
                    page === p ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              )
            })}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="flex items-center gap-1 text-xs font-body text-slate-600 hover:text-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
