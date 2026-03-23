import { useState, useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'
import avatarPng from '../assets/avatar1.png'

const STORAGE_KEY = 'chimaltenango_welcome_seen'

export default function WelcomeModal({ year }) {
  const isDark = useContext(ThemeContext)
  const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY))
  const [leaving, setLeaving] = useState(false)

  if (!visible) return null

  const handleContinue = () => {
    setLeaving(true)
    localStorage.setItem(STORAGE_KEY, 'true')
    setTimeout(() => setVisible(false), 500)
  }

  return (
    <>
      <style>{`
        @keyframes wm-in  { from { opacity:0 } to { opacity:1 } }
        @keyframes wm-out { from { opacity:1 } to { opacity:0 } }

        @keyframes wm-card-in {
          from { opacity:0; transform: translateY(32px) scale(0.95); }
          to   { opacity:1; transform: translateY(0)    scale(1);    }
        }
        @keyframes wm-card-out {
          from { opacity:1; transform: scale(1); }
          to   { opacity:0; transform: scale(0.96); }
        }

        @keyframes wm-avatar-in {
          from { opacity:0; transform: translateY(20px) scale(0.85); }
          to   { opacity:1; transform: translateY(0)    scale(1);    }
        }
        @keyframes wm-float {
          0%,100% { transform: translateY(0px) rotate(-1deg); }
          50%     { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes wm-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .wm-overlay { animation: ${leaving ? 'wm-out' : 'wm-in'} 0.5s ease both; }
        .wm-card    { animation: ${leaving ? 'wm-card-out 0.4s ease both' : 'wm-card-in 0.55s cubic-bezier(0.34,1.15,0.64,1) 0.05s both'}; }
        .wm-avatar  { animation: wm-avatar-in 0.6s cubic-bezier(0.34,1.3,0.64,1) 0.2s both, wm-float 4s ease-in-out 1s infinite; }

        .wm-shimmer-btn {
          background: linear-gradient(90deg, #4338ca, #6366f1, #818cf8, #6366f1, #4338ca);
          background-size: 200% auto;
          animation: wm-shimmer 2.5s linear infinite;
        }
        .wm-shimmer-btn:hover { filter: brightness(1.12); }

        @keyframes wm-title-in {
          from { opacity:0; transform: translateY(10px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .wm-title { animation: wm-title-in 0.5s ease 0.35s both; }
        .wm-body  { animation: wm-title-in 0.5s ease 0.5s  both; }
        .wm-btn   { animation: wm-title-in 0.5s ease 0.65s both; }
      `}</style>

      {/* Overlay — casi transparente en desktop, opaco en móvil */}
      <div
        className="wm-overlay fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4"
        style={{
          backgroundColor: isDark ? 'rgba(2,6,23,0.55)' : 'rgba(15,23,42,0.35)',
          backdropFilter: 'blur(3px)',
        }}
        onClick={handleContinue}
      >
        {/* Card:
            · Móvil  → splash fullscreen, sin borde, sin rounded, ocupa toda la pantalla
            · Desktop → modal flotante glassmorphism con borde */}
        <div
          className="wm-card relative w-full sm:max-w-sm sm:rounded-3xl p-8 text-center
                     h-full sm:h-auto flex flex-col items-center justify-center sm:block"
          style={{
            background: isDark
              ? 'rgba(15,23,42,0.72)'
              : 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(20px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
            // Borde solo en desktop (via inline, Tailwind no puede condicionarlo fácil en inline styles)
            boxShadow: isDark
              ? '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)'
              : '0 25px 60px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Borde visible solo en sm+ */}
          <div className="hidden sm:block absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              border: isDark
                ? '1px solid rgba(99,102,241,0.25)'
                : '1px solid rgba(99,102,241,0.2)',
            }}
          />
          {/* Glow de fondo */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 65%)',
            }}
          />

          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <img
              src={avatarPng}
              alt="Guía"
              className="wm-avatar w-28 sm:w-32 h-auto object-contain drop-shadow-2xl"
            />
          </div>

          {/* Título */}
          <div className="wm-title mb-3">
            <h2
              className="font-display font-bold text-2xl leading-tight mb-1"
              style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
            >
              ¡Bienvenido!
            </h2>
            <p
              className="font-display font-semibold text-sm"
              style={{ color: '#6366f1' }}
            >
              Chimaltenango Transparente
            </p>
          </div>

          {/* Descripción */}
          <div className="wm-body mb-6">
            <p
              className="text-sm font-body leading-relaxed mb-2"
              style={{ color: isDark ? 'rgba(203,213,225,0.85)' : 'rgba(51,65,85,0.85)' }}
            >
              Aquí puedes ver{' '}
              <strong style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
                en qué se gasta el dinero
              </strong>{' '}
              de tu municipio en {year ?? new Date().getFullYear()}.
            </p>
            <p
              className="text-xs font-body leading-relaxed"
              style={{ color: isDark ? 'rgba(148,163,184,0.75)' : 'rgba(100,116,139,0.75)' }}
            >
              Información pública del Ministerio de Finanzas.
            </p>
          </div>

          {/* Botón */}
          <button
            onClick={handleContinue}
            className="wm-btn wm-shimmer-btn w-full py-3 px-6 rounded-2xl text-white font-display font-semibold text-sm transition-all duration-150 active:scale-95"
            style={{ boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}
          >
            Ver el presupuesto →
          </button>

          <p
            className="wm-btn mt-3 text-[10px] font-body"
            style={{ color: isDark ? 'rgba(100,116,139,0.7)' : 'rgba(148,163,184,0.8)' }}
          >
            Este mensaje no volverá a aparecer
          </p>
        </div>
      </div>
    </>
  )
}
