export function getExecutionColor(pct) {
  if (pct >= 70) return '#22c55e'   // verde
  if (pct >= 30) return '#eab308'   // amarillo
  return '#ef4444'                   // rojo
}

export function getExecutionTailwind(pct) {
  if (pct >= 70) return { bg: 'bg-green-500', text: 'text-green-700', light: 'bg-green-50', border: 'border-green-200' }
  if (pct >= 30) return { bg: 'bg-yellow-400', text: 'text-yellow-700', light: 'bg-yellow-50', border: 'border-yellow-200' }
  return { bg: 'bg-red-500', text: 'text-red-700', light: 'bg-red-50', border: 'border-red-200' }
}

export function getExecutionLabel(pct) {
  if (pct >= 70) return 'Alto'
  if (pct >= 30) return 'Medio'
  return 'Bajo'
}

// Paleta para gráficas por programa
export const PROGRAM_COLORS = [
  '#1d4ed8', '#4f46e5', '#0891b2', '#059669',
  '#d97706', '#dc2626', '#7c3aed', '#0284c7',
  '#16a34a', '#ca8a04', '#9333ea', '#0369a1'
]
