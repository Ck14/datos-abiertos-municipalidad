import { ExternalLink } from 'lucide-react'
import appConfig from '../../data/config.json'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-teal-950 border-t-2 border-brand-100 dark:border-teal-800 mt-auto transition-colors duration-200">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          {/* Marca */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <span className="font-display font-bold text-teal-900 dark:text-teal-100 text-base">
                Chimaltenango Transparente
              </span>
            </div>
            <p className="text-sm font-body text-teal-600 dark:text-teal-400 leading-relaxed">
              Plataforma ciudadana para entender cómo la Municipalidad de {appConfig.entidad} usa el dinero de todos.
            </p>
          </div>

          {/* Fuente de datos */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-display font-bold text-teal-400 dark:text-teal-500 uppercase tracking-widest">
              De dónde vienen los datos
            </p>
            <div className="flex flex-col gap-2 text-sm font-body text-teal-700 dark:text-teal-300">
              <p className="font-semibold">Ministerio de Finanzas Públicas de Guatemala</p>
              <a
                href="https://datos.minfin.gob.gt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-bold text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 transition-colors w-fit"
              >
                datos.minfin.gob.gt <ExternalLink size={12} />
              </a>
              <p className="text-xs text-teal-500 dark:text-teal-500">
                Información pública · Región V Central · Año {new Date().getFullYear()}
              </p>
            </div>
          </div>

          {/* Mensaje ciudadano */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-display font-bold text-teal-400 dark:text-teal-500 uppercase tracking-widest">
              Para la comunidad
            </p>
            <p className="text-sm font-body text-teal-700 dark:text-teal-300 leading-relaxed">
              Esta información es pública y gratuita. No necesitas una cuenta ni contraseña para verla. Es tu derecho conocerla.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t-2 border-teal-100 dark:border-teal-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs font-body font-medium text-teal-400 dark:text-teal-500">
            © {new Date().getFullYear()} Chimaltenango Transparente · Datos públicos bajo licencia abierta
          </p>
          <p className="text-xs font-body text-teal-400 dark:text-teal-500">
            Construido con React · Vite · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
