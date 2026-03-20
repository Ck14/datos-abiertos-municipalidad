import { fixEncoding } from './formatters'

// Configuración de jerarquías
export const HIERARCHY_CONFIG = {
  programatica: {
    label: 'Programática',
    levels: [
      { key: 'programa',     label: 'Programa' },
      { key: 'subPrograma',  label: 'SubPrograma' },
      { key: 'proyecto',     label: 'Proyecto' },
      { key: 'actividad',    label: 'Actividad' },
    ]
  },
  funcional: {
    label: 'Funcional',
    levels: [
      { key: 'finalidad', label: 'Finalidad' },
      { key: 'funcion',   label: 'Función' },
      { key: 'division',  label: 'División' },
    ]
  },
  gasto: {
    label: 'Por Tipo de Gasto',
    levels: [
      { key: 'grupoGasto',    label: 'Grupo de Gasto' },
      { key: 'subGrupoGasto', label: 'SubGrupo de Gasto' },
      { key: 'renglon',       label: 'Renglón' },
    ]
  }
}

/**
 * Agrega registros por un campo específico, filtrando según el path actual.
 * @param {Array}  records    - todos los registros
 * @param {string} view       - 'programatica' | 'funcional' | 'gasto'
 * @param {Array}  path       - [{ level, key, value }] ruta actual de drill-down
 * @returns {Array} items agregados con totales
 */
export function aggregateByLevel(records, view, path = []) {
  const config = HIERARCHY_CONFIG[view]
  if (!config) return []

  const levelIndex = path.length
  if (levelIndex >= config.levels.length) return []

  const groupKey = config.levels[levelIndex].key

  // Filtrar registros según el path actual
  let filtered = records
  for (const step of path) {
    filtered = filtered.filter(r => fixEncoding(r[step.key]) === step.value)
  }

  // Agrupar por el campo del nivel actual
  const groups = {}
  for (const record of filtered) {
    const rawVal = record[groupKey]
    const val = fixEncoding(rawVal) || 'Sin definir'
    if (!groups[val]) {
      groups[val] = {
        label: val,
        key: groupKey,
        levelIndex,
        levelLabel: config.levels[levelIndex].label,
        hasChildren: levelIndex < config.levels.length - 1,
        totalAsignado: 0,
        totalVigente: 0,
        totalDevengado: 0,
        totalPagado: 0,
        count: 0,
      }
    }
    groups[val].totalAsignado  += record.asignado  || 0
    groups[val].totalVigente   += record.vigente   || 0
    groups[val].totalDevengado += record.devengado || 0
    groups[val].totalPagado    += record.pagado    || 0
    groups[val].count++
  }

  return Object.values(groups)
    .map(g => ({
      ...g,
      pctEjecucion: g.totalVigente > 0 ? (g.totalDevengado / g.totalVigente) * 100 : 0
    }))
    .sort((a, b) => b.totalVigente - a.totalVigente)
}

/**
 * Calcula totales globales de todos los registros.
 */
export function calcGlobalTotals(records) {
  return records.reduce((acc, r) => ({
    totalAsignado:  acc.totalAsignado  + (r.asignado  || 0),
    totalVigente:   acc.totalVigente   + (r.vigente   || 0),
    totalDevengado: acc.totalDevengado + (r.devengado || 0),
    totalPagado:    acc.totalPagado    + (r.pagado    || 0),
  }), { totalAsignado: 0, totalVigente: 0, totalDevengado: 0, totalPagado: 0 })
}

/**
 * Agrega por fuente de financiamiento.
 */
export function aggregateByFuente(records) {
  const groups = {}
  for (const r of records) {
    const fuente = fixEncoding(r.fuente) || 'Otra'
    if (!groups[fuente]) groups[fuente] = { name: fuente, value: 0 }
    groups[fuente].value += r.vigente || 0
  }
  return Object.values(groups).sort((a, b) => b.value - a.value)
}

/**
 * Agrega por programa para treemap.
 */
export function aggregateByPrograma(records) {
  const groups = {}
  for (const r of records) {
    const prog = fixEncoding(r.programa) || 'Sin Programa'
    if (!groups[prog]) groups[prog] = { name: prog, vigente: 0, devengado: 0 }
    groups[prog].vigente   += r.vigente   || 0
    groups[prog].devengado += r.devengado || 0
  }
  return Object.values(groups)
    .map(g => ({ ...g, pctEjecucion: g.vigente > 0 ? (g.devengado / g.vigente) * 100 : 0 }))
    .sort((a, b) => b.vigente - a.vigente)
}
