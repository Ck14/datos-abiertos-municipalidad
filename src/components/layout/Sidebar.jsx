import { useState } from 'react'
import { LayoutDashboard, FolderTree, Table2, ChevronLeft, ChevronRight } from 'lucide-react'

const NAV = [
  { id: 'dashboard', label: 'Resumen',              icon: LayoutDashboard },
  { id: 'explorar',  label: 'Explorar Presupuesto', icon: FolderTree },
  { id: 'tabla',     label: 'Tabla Detallada',       icon: Table2 },
]

export default function Sidebar({ activeTab, onTabChange }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] transition-all duration-200 flex-shrink-0 ${
          collapsed ? 'w-14' : 'w-56'
        }`}
      >
        {/* Toggle button */}
        <div className="flex justify-end p-2 border-b border-slate-100">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <nav className="p-2 space-y-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm font-body font-medium transition-all duration-150 ${
                collapsed ? 'justify-center' : ''
              } ${
                activeTab === id
                  ? 'bg-brand-50 text-brand-700 border border-brand-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={16} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex safe-area-pb">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-body font-medium transition-colors ${
              activeTab === id ? 'text-brand-700' : 'text-slate-500'
            }`}
          >
            <Icon size={20} />
            <span className="truncate px-1">{label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </>
  )
}
