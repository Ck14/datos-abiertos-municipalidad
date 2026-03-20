import { Database, Github, ExternalLink } from 'lucide-react'
import appConfig from '../../data/config.json'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 mt-auto transition-colors duration-200">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          {/* Marca */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-brand-700 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-display font-bold text-xs">CT</span>
              </div>
              <span className="font-display font-bold text-slate-900 dark:text-slate-100 text-sm">
                Chimaltenango Transparente
              </span>
            </div>
            <p className="text-xs font-body text-slate-500 dark:text-slate-400 leading-relaxed">
              Plataforma de visualización del presupuesto municipal de {appConfig.entidad}. Promoviendo la transparencia y rendición de cuentas ciudadana.
            </p>
          </div>

          {/* Fuente de datos */}
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-body font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Fuente de datos
            </p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-xs font-body text-slate-600 dark:text-slate-400">
                <Database size={11} className="text-brand-600 dark:text-brand-400 flex-shrink-0" />
                <span>MINFIN — Datos Abiertos Guatemala</span>
              </div>
              <a
                href="https://datos.minfin.gob.gt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-body text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 transition-colors w-fit"
              >
                datos.minfin.gob.gt <ExternalLink size={10} />
              </a>
              <p className="text-[10px] font-body text-slate-400 dark:text-slate-500">
                Información presupuestaria municipal {new Date().getFullYear()} — Región V Central
              </p>
            </div>
          </div>

          {/* Créditos */}
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-body font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Créditos
            </p>
            <div className="flex flex-col gap-1.5 text-xs font-body text-slate-600 dark:text-slate-400">
              <p>Desarrollado por <span className="font-semibold text-slate-700 dark:text-slate-300">Chimaltenango Transparente</span></p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Construido con React, Vite, Tailwind CSS y Recharts.
              </p>
            </div>
            <a
              href="https://github.com/Ck14/datos-abiertos-municipalidad"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-body text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors w-fit mt-1"
            >
              <Github size={13} />
              <span>Código fuente en GitHub</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] font-body text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} Chimaltenango Transparente. Datos públicos bajo licencia abierta.
          </p>
          <p className="text-[10px] font-body text-slate-400 dark:text-slate-500">
            Los datos provienen oficialmente del{' '}
            <span className="font-medium">Ministerio de Finanzas Públicas de Guatemala</span>.
          </p>
        </div>
      </div>
    </footer>
  )
}
