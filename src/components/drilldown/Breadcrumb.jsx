import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumb({ path, onDrillUp }) {
  return (
    <nav className="flex items-center gap-1 flex-wrap text-xs font-body">
      <button
        onClick={() => onDrillUp(0)}
        className="flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 font-bold transition-colors"
      >
        <Home size={12} />
        <span>Inicio</span>
      </button>

      {path.map((step, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight size={12} className="text-slate-400 dark:text-slate-500" />
          {i < path.length - 1 ? (
            <button
              onClick={() => onDrillUp(i + 1)}
              className="text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 font-medium transition-colors truncate max-w-[140px]"
              title={step.value}
            >
              {step.value.length > 20 ? step.value.slice(0, 18) + '…' : step.value}
            </button>
          ) : (
            <span className="text-slate-700 dark:text-slate-300 font-semibold truncate max-w-[160px]" title={step.value}>
              {step.value.length > 24 ? step.value.slice(0, 22) + '…' : step.value}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
