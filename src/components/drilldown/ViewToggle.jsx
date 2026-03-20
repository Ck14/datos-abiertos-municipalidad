import { HIERARCHY_CONFIG } from '../../utils/budgetAggregator'

export default function ViewToggle({ view, onViewChange }) {
  return (
    <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
      {Object.entries(HIERARCHY_CONFIG).map(([key, cfg]) => (
        <button
          key={key}
          onClick={() => onViewChange(key)}
          className={`px-3 py-1.5 rounded-md text-xs font-body font-medium transition-all duration-150 ${
            view === key
              ? 'bg-white text-brand-700 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {cfg.label}
        </button>
      ))}
    </div>
  )
}
