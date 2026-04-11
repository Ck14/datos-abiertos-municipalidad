import { useState } from 'react'
import { Search } from 'lucide-react'
import { useLang } from '../contexts/LanguageContext'

function TermCard({ term, icon, color, definition, example }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: color + '18' }}
        >
          {icon}
        </div>
        <h3
          className="font-display font-bold text-sm leading-tight"
          style={{ color }}
        >
          {term}
        </h3>
      </div>

      <p className="text-sm font-body text-slate-600 dark:text-slate-300 leading-relaxed">
        {definition}
      </p>

      {example && (
        <div
          className="rounded-lg px-3 py-2 text-xs font-body leading-relaxed"
          style={{ backgroundColor: color + '0d', borderLeft: `3px solid ${color}` }}
        >
          <span className="font-semibold" style={{ color }}>Ej. </span>
          <span className="text-slate-600 dark:text-slate-400">{example}</span>
        </div>
      )}
    </div>
  )
}

export default function Glossary() {
  const { t } = useLang()
  const [search, setSearch] = useState('')

  const terms = t('glossary.terms') ?? []

  const filtered = search.trim()
    ? terms.filter(item =>
        item.term.toLowerCase().includes(search.toLowerCase()) ||
        item.definition.toLowerCase().includes(search.toLowerCase())
      )
    : terms

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Encabezado */}
      <div>
        <h2 className="text-lg font-display font-bold text-slate-900 dark:text-slate-100 mb-1">
          {t('glossary.title')}
        </h2>
        <p className="text-xs font-body text-slate-500 dark:text-slate-400">
          {t('glossary.subtitle')}
        </p>
      </div>

      {/* Buscador */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder={t('glossary.search')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm font-body bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-300 dark:focus:ring-brand-700 transition-all shadow-sm"
        />
      </div>

      {/* Grid de términos */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
          <span className="text-4xl mb-3">🔍</span>
          <p className="text-sm font-body">{t('glossary.noResults')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((item, i) => (
            <TermCard key={i} {...item} />
          ))}
        </div>
      )}
    </div>
  )
}
