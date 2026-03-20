import { LayoutDashboard, FolderTree, Table2 } from 'lucide-react'

const NAV = [
  { id: 'dashboard',  label: 'Resumen',           icon: LayoutDashboard },
  { id: 'explorar',   label: 'Explorar Presupuesto', icon: FolderTree },
  { id: 'tabla',      label: 'Tabla Detallada',    icon: Table2 },
]

export default function Sidebar({ activeTab, onTabChange }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)]">
        <nav className="p-3 space-y-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-body font-medium transition-all duration-150 ${
                activeTab === id
                  ? 'bg-brand-50 text-brand-700 border border-brand-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex z-20">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-body font-medium transition-colors ${
              activeTab === id ? 'text-brand-700' : 'text-slate-500'
            }`}
          >
            <Icon size={18} />
            <span className="truncate px-1">{label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </>
  )
}
