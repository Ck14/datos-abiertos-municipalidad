import { useState, useMemo, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'
import TableFilters from './TableFilters'
import { fixEncoding, formatGTQ, formatPct } from '../../utils/formatters'
import { getExecutionColor, getExecutionTailwind } from '../../utils/colorScale'

const PAGE_SIZE = 25

const DEFAULT_WIDTHS = {
  programa: 160, actividad: 140, obra: 120, renglon: 140,
  fuente: 130, tipoPresupuesto: 110,
  asignado: 112, vigente: 112, devengado: 112, pagado: 112, pctEjecucion: 120,
}

function PctCell({ pct }) {
  const { text, light, border } = getExecutionTailwind(pct)
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
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
  const [filters, setFilters] = useState({ search: '', programa: '', subPrograma: '', proyecto: '', actividad: '', obra: '', fuente: '', tipo: '' })
  const [page, setPage]       = useState(1)
  const [sortKey, setSortKey] = useState('totalVigente')
  const [sortDir, setSortDir] = useState('desc')
  const [colWidths, setColWidths] = useState(DEFAULT_WIDTHS)

  const handleFilter = (key, val) => { setFilters(f => ({ ...f, [key]: val })); setPage(1) }
  const clearFilters = () => { setFilters({ search: '', programa: '', subPrograma: '', proyecto: '', actividad: '', obra: '', fuente: '', tipo: '' }); setPage(1) }

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  // Resize handler
  const startResize = useCallback((e, key) => {
    e.preventDefault()
    e.stopPropagation()
    const startX = e.clientX
    const startWidth = colWidths[key]

    const onMouseMove = (e) => {
      const newWidth = Math.max(60, startWidth + e.clientX - startX)
      setColWidths(w => ({ ...w, [key]: newWidth }))
    }
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [colWidths])

  const filtered = useMemo(() => {
    let rows = records.map(r => ({
      ...r,
      programa:        fixEncoding(r.programa),
      subPrograma:     fixEncoding(r.subPrograma),
      proyecto:        fixEncoding(r.proyecto),
      actividad:       fixEncoding(r.actividad),
      obra:            fixEncoding(r.obra),
      renglon:         fixEncoding(r.renglon),
      fuente:          fixEncoding(r.fuente),
      tipoPresupuesto: fixEncoding(r.tipoPresupuesto),
      pctEjecucion:    r.vigente > 0 ? (r.devengado / r.vigente) * 100 : 0,
    }))

    if (filters.search) {
      const q = filters.search.toLowerCase()
      rows = rows.filter(r =>
        r.programa?.toLowerCase().includes(q) ||
        r.subPrograma?.toLowerCase().includes(q) ||
        r.proyecto?.toLowerCase().includes(q) ||
        r.actividad?.toLowerCase().includes(q) ||
        r.obra?.toLowerCase().includes(q) ||
        r.renglon?.toLowerCase().includes(q)
      )
    }
    if (filters.programa)    rows = rows.filter(r => r.programa    === filters.programa)
    if (filters.subPrograma) rows = rows.filter(r => r.subPrograma === filters.subPrograma)
    if (filters.proyecto)    rows = rows.filter(r => r.proyecto    === filters.proyecto)
    if (filters.actividad)   rows = rows.filter(r => r.actividad   === filters.actividad)
    if (filters.obra)        rows = rows.filter(r => r.obra        === filters.obra)
    if (filters.fuente)      rows = rows.filter(r => r.fuente      === filters.fuente)
    if (filters.tipo)        rows = rows.filter(r => r.tipoPresupuesto === filters.tipo)

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
    { key: 'programa',        label: 'Área',           sortable: false },
    { key: 'actividad',       label: 'Tarea',          sortable: false },
    { key: 'obra',            label: 'Obra',           sortable: false },
    { key: 'renglon',         label: 'Partida',        sortable: false },
    { key: 'fuente',          label: 'Financiamiento', sortable: false },
    { key: 'tipoPresupuesto', label: 'Tipo',           sortable: false },
    { key: 'asignado',        label: 'Aprobado',       sortable: true  },
    { key: 'vigente',         label: 'Disponible',     sortable: true  },
    { key: 'devengado',       label: 'Comprometido',   sortable: true  },
    { key: 'pagado',          label: 'Pagado',         sortable: true  },
    { key: 'pctEjecucion',    label: '% Gastado',      sortable: true  },
  ]

  return (
    <div className="space-y-4">
      <TableFilters records={records} filters={filters} onFilterChange={handleFilter} onClear={clearFilters} />

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
          <p className="text-xs font-body text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-800 dark:text-slate-200">{filtered.length}</span> registros
          </p>
          <p className="text-xs font-body text-slate-500 dark:text-slate-400">
            Página {page} de {totalPages || 1}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="text-xs font-body table-fixed" style={{ width: Object.values(colWidths).reduce((a, b) => a + b, 0) }}>
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                {cols.map(col => (
                  <th
                    key={col.key}
                    style={{ width: colWidths[col.key] }}
                    className={`relative text-left px-3 py-2.5 font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap select-none ${
                      col.sortable ? 'cursor-pointer hover:text-slate-900 dark:hover:text-slate-200' : ''
                    }`}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  >
                    <div className="flex items-center gap-1 overflow-hidden">
                      <span className="truncate">{col.label}</span>
                      {col.sortable && <ArrowUpDown size={10} className={`flex-shrink-0 ${sortKey === col.key ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-600'}`} />}
                    </div>
                    {/* Resize handle */}
                    <div
                      className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize group flex items-center justify-center"
                      onMouseDown={(e) => startResize(e, col.key)}
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 group-hover:bg-brand-500 group-hover:w-0.5 transition-all" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((row, i) => (
                <tr key={row._id || i} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-3 py-2 text-slate-800 dark:text-slate-200 font-medium truncate" title={row.programa}>{row.programa}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300 truncate" title={row.actividad}>{row.actividad}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400 truncate" title={row.obra}>{row.obra}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400 truncate" title={row.renglon}>{row.renglon}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400 truncate" title={row.fuente}>{row.fuente}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400 truncate">{row.tipoPresupuesto}</td>
                  <td className="px-3 py-2 font-mono text-slate-700 dark:text-slate-300 text-right">{formatGTQ(row.asignado)}</td>
                  <td className="px-3 py-2 font-mono text-slate-700 dark:text-slate-300 text-right">{formatGTQ(row.vigente)}</td>
                  <td className="px-3 py-2 font-mono text-slate-700 dark:text-slate-300 text-right">{formatGTQ(row.devengado)}</td>
                  <td className="px-3 py-2 font-mono text-slate-700 dark:text-slate-300 text-right">{formatGTQ(row.pagado)}</td>
                  <td className="px-3 py-2"><PctCell pct={row.pctEjecucion} /></td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={11} className="text-center py-10 text-slate-400 dark:text-slate-500">
                    No se encontraron registros con estos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 text-xs font-body text-slate-600 dark:text-slate-400 hover:text-brand-700 dark:hover:text-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                    page === p
                      ? 'bg-brand-700 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
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
            className="flex items-center gap-1 text-xs font-body text-slate-600 dark:text-slate-400 hover:text-brand-700 dark:hover:text-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
