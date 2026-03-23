import { useHelp } from '../contexts/HelpContext'

/**
 * Botón ? que al hacer clic envía un mensaje de ayuda al avatar (MascotGuide).
 * Props:
 *   label   — título que aparece en el globo del avatar
 *   message — texto de ayuda
 *   className — clases extra opcionales
 */
export default function HelpButton({ label, message, className = '' }) {
  const help = useHelp()
  if (!help) return null

  return (
    <button
      onClick={e => { e.stopPropagation(); help.showHelp(label, message) }}
      title="¿Qué es esto?"
      aria-label={`Ayuda: ${label}`}
      className={`
        inline-flex items-center justify-center
        w-4 h-4 rounded-full text-[10px] font-bold
        bg-slate-200 dark:bg-slate-600
        text-slate-500 dark:text-slate-300
        hover:bg-indigo-100 dark:hover:bg-indigo-900/50
        hover:text-indigo-600 dark:hover:text-indigo-400
        transition-colors duration-150 flex-shrink-0
        ${className}
      `}
    >
      ?
    </button>
  )
}
