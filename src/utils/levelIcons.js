// Íconos y colores por jerarquía programática
export const PROGRAM_ICONS = {
  'ACTIVIDADES CENTRALES':                       { icon: '🏛️', color: '#1d4ed8' },
  'ACCESO AL AGUA POTABLE Y SANEAMIENTO':        { icon: '💧', color: '#0891b2' },
  'SEGURIDAD INTEGRAL':                          { icon: '🛡️', color: '#7c3aed' },
  'MOVILIDAD URBANA':                            { icon: '🏙️', color: '#0369a1' },
  'AMBIENTE Y RECURSOS NATURALES':               { icon: '🌿', color: '#15803d' },
  'TURÍSTICA':                                   { icon: '✈️', color: '#b45309' },
  'MORTALIDAD':                                  { icon: '❤️', color: '#dc2626' },
  'EDUCACIÓN':                                   { icon: '📚', color: '#7e22ce' },
  'SALUD':                                       { icon: '🏥', color: '#0f766e' },
  'PARTIDAS NO ASIGNABLES':                      { icon: '📋', color: '#64748b' },
  'VULNERABLE':                                  { icon: '🤝', color: '#c2410c' },
  'ECONÓMICO':                                   { icon: '📈', color: '#166534' },
}

// Íconos por finalidad funcional
export const FINALIDAD_ICONS = {
  'SERVICIOS PÚBLICOS GENERALES':                { icon: '🏛️', color: '#1d4ed8' },
  'ORDEN PÚBLICO Y SEGURIDAD':                   { icon: '🛡️', color: '#7c3aed' },
  'ASUNTOS ECONÓMICOS':                          { icon: '📈', color: '#166534' },
  'PROTECCIÓN AMBIENTAL':                        { icon: '🌿', color: '#15803d' },
  'URBANIZACIÓN Y SERVICIOS COMUNITARIOS':       { icon: '🏘️', color: '#0369a1' },
  'SALUD':                                       { icon: '🏥', color: '#0f766e' },
  'ACTIVIDADES DEPORTIVAS':                      { icon: '⚽', color: '#b45309' },
  'EDUCACIÓN':                                   { icon: '📚', color: '#7e22ce' },
  'PROTECCIÓN SOCIAL':                           { icon: '🤝', color: '#c2410c' },
  'DESASTRES':                                   { icon: '⚠️', color: '#d97706' },
}

// Íconos por grupo de gasto
export const GASTO_ICONS = {
  'SERVICIOS PERSONALES':                        { icon: '👥', color: '#1d4ed8' },
  'SERVICIOS NO PERSONALES':                     { icon: '🔧', color: '#0891b2' },
  'PROPIEDAD, PLANTA, EQUIPO':                   { icon: '🏗️', color: '#7c3aed' },
  'MATERIALES Y SUMINISTROS':                    { icon: '📦', color: '#b45309' },
  'TRANSFERENCIAS CORRIENTES':                   { icon: '💸', color: '#059669' },
  'ASIGNACIONES GLOBALES':                       { icon: '📋', color: '#64748b' },
}

// Paleta de colores para ítems sin match
const PALETTE = [
  '#1d4ed8','#4f46e5','#0891b2','#059669',
  '#d97706','#dc2626','#7c3aed','#0284c7',
  '#16a34a','#ca8a04','#9333ea','#0369a1',
]

/**
 * Devuelve { icon, color } para cualquier ítem según su jerarquía.
 */
export function getItemMeta(label, view, levelIndex, itemIndex = 0) {
  const upper = label?.toUpperCase() || ''

  if (view === 'programatica' && levelIndex === 0) {
    const key = Object.keys(PROGRAM_ICONS).find(k => upper.includes(k))
    if (key) return PROGRAM_ICONS[key]
  }

  if (view === 'funcional' && levelIndex === 0) {
    const key = Object.keys(FINALIDAD_ICONS).find(k => upper.includes(k))
    if (key) return FINALIDAD_ICONS[key]
  }

  if (view === 'gasto' && levelIndex === 0) {
    const key = Object.keys(GASTO_ICONS).find(k => upper.includes(k))
    if (key) return GASTO_ICONS[key]
  }

  // Ícono genérico por nivel
  const levelDefaults = [
    ['🗂️','📁','📂','📄','🔨'],  // programatica
    ['🎯','⚙️','🔹'],              // funcional
    ['💼','🔸','📌'],              // gasto
  ]
  const viewIdx = { programatica: 0, funcional: 1, gasto: 2 }[view] ?? 0
  const icons   = levelDefaults[viewIdx]
  const icon    = icons[Math.min(levelIndex, icons.length - 1)]
  const color   = PALETTE[itemIndex % PALETTE.length]
  return { icon, color }
}
