import { HIERARCHY_CONFIG } from '../../utils/budgetAggregator'

export default function ViewToggle({ view, onViewChange }) {
  return (
    <div className="flex gap-1 p-1 bg-teal-50 dark:bg-teal-900 rounded-xl w-fit border-2 border-brand-100 dark:border-teal-700">
      {Object.entries(HIERARCHY_CONFIG).map(([key, cfg]) => (
        <button
          key={key}
          onClick={() => onViewChange(key)}
          className={`px-3 py-2 rounded-lg text-xs font-body font-bold transition-all duration-150 ${
            view === key
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-teal-700 dark:text-teal-300 hover:text-brand-700 dark:hover:text-brand-300 hover:bg-white dark:hover:bg-teal-800'
          }`}
        >
          {cfg.label}
        </button>
      ))}
    </div>
  )
}
