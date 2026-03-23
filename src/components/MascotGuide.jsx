import { useContext, useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { ThemeContext } from '../contexts/ThemeContext'
import { useHelp } from '../contexts/HelpContext'
import avatarPng from '../assets/avatar1.png'

// ─── Para cambiar de avatar, reemplaza el archivo src/assets/avatar1.png ──────
const CUSTOM_AVATAR_SRC = avatarPng
// ─────────────────────────────────────────────────────────────────────────────

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

const SECTIONS = {
  dashboard: {
    label: 'Inicio',
    message: '¡Aquí ves en qué se gasta el dinero del municipio! Revisa los totales y gráficas.',
    armAngle: -148,
    accent: '#6366f1',
  },
  explorar: {
    label: '¿En qué se gasta?',
    message: 'Haz clic en cada tarjeta para ver el detalle de cada área de gasto.',
    armAngle: -118,
    accent: '#0ea5e9',
  },
  tabla: {
    label: 'Ver todo el gasto',
    message: 'Busca y filtra todas las partidas de gasto del año.',
    armAngle: -92,
    accent: '#10b981',
  },
}

export default function MascotGuide({ activeTab }) {
  const isDark = useContext(ThemeContext)
  const { helpMsg, clearHelp } = useHelp() || {}
  const [minimized, setMinimized] = useState(false)
  const [bubbleOpen, setBubbleOpen] = useState(true)
  const section = SECTIONS[activeTab] || SECTIONS.dashboard

  // Al cambiar sección, limpia el mensaje de ayuda y reabre el globo
  useEffect(() => {
    clearHelp?.()
    setBubbleOpen(true)
  }, [activeTab])

  // Cuando llega ayuda nueva, abre el globo y des-minimiza
  useEffect(() => {
    if (helpMsg) {
      setMinimized(false)
      setBubbleOpen(true)
    }
  }, [helpMsg])

  const displayLabel   = helpMsg ? helpMsg.label   : section.label
  const displayMessage = helpMsg ? helpMsg.message : section.message
  const displayAccent  = helpMsg ? '#f59e0b'        : section.accent

  return (
    <>
      <style>{`
        @keyframes mascot-bounce {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
        @keyframes bubble-pop {
          from { opacity: 0; transform: scale(0.88) translateY(6px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
        @keyframes mascot-in {
          from { opacity: 0; transform: scale(0.7) translateY(12px); }
          to   { opacity: 1; transform: scale(1)   translateY(0);    }
        }
        @keyframes fab-in {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1);   }
        }
        .mascot-bounce { animation: mascot-bounce 2.8s ease-in-out infinite; }
        .bubble-pop    { animation: bubble-pop 0.28s cubic-bezier(0.34,1.56,0.64,1) both; }
        .mascot-in     { animation: mascot-in 0.35s cubic-bezier(0.34,1.4,0.64,1) both; }
        .fab-in        { animation: fab-in 0.3s cubic-bezier(0.34,1.5,0.64,1) both; }
      `}</style>

      <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex flex-col items-end gap-2 select-none">

        {minimized ? (
          /* ── FAB cuando está minimizado ───────────────────────────────── */
          <button
            key="fab"
            onClick={() => { setMinimized(false); setBubbleOpen(true) }}
            title="Mostrar guía"
            aria-label="Mostrar guía"
            className="fab-in w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform duration-150 focus:outline-none"
            style={{
              background: `linear-gradient(135deg, ${section.accent}, ${section.accent}cc)`,
              boxShadow: `0 4px 16px ${section.accent}55`,
            }}
          >
            <MessageCircle size={22} className="text-white" />
          </button>
        ) : (
          /* ── Avatar visible ───────────────────────────────────────────── */
          <div key="expanded" className="mascot-in flex flex-col items-end gap-2">

            {/* Speech bubble — toggle con click en avatar */}
            {bubbleOpen && (
              <div key={activeTab} className="bubble-pop relative max-w-[210px]">
                <div
                  className="px-4 py-3 rounded-2xl rounded-br-none text-xs leading-snug"
                  style={{
                    background: isDark
                      ? `rgba(15,23,42,0.96)`
                      : `rgba(255,255,255,0.97)`,
                    border: `1.5px solid rgba(${hexToRgb(displayAccent)}, 0.5)`,
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    boxShadow: `0 8px 24px rgba(${hexToRgb(displayAccent)}, 0.22), 0 2px 8px rgba(0,0,0,0.18)`,
                    color: isDark ? '#f1f5f9' : '#1e293b',
                  }}
                >
                  <span
                    className="block text-[10px] font-bold uppercase tracking-widest mb-1"
                    style={{ color: displayAccent }}
                  >
                    {displayLabel}
                  </span>
                  <span className="font-body">{displayMessage}</span>

                  {/* Fila inferior: cerrar ayuda + minimizar al mismo nivel */}
                  <div className="mt-2 flex items-center justify-between gap-2">
                    {helpMsg ? (
                      <button onClick={clearHelp} className="text-[10px] font-body opacity-50 hover:opacity-90 transition-opacity">
                        ✕ cerrar ayuda
                      </button>
                    ) : <span />}
                    <button
                      onClick={() => setMinimized(true)}
                      className="flex items-center gap-0.5 text-[10px] font-body opacity-50 hover:opacity-90 transition-opacity"
                    >
                      <span>─</span> Minimizar
                    </button>
                  </div>
                </div>
                {/* Tail */}
                <div className="absolute -bottom-[9px] right-8" style={{ width:0, height:0, borderLeft:'9px solid transparent', borderRight:'9px solid transparent', borderTop:`9px solid ${isDark ? 'rgba(15,23,42,0.96)' : 'rgba(255,255,255,0.97)'}` }} />
              </div>
            )}

            {/* Avatar — click muestra/oculta solo el bubble */}
            <button
              onClick={() => setBubbleOpen(v => !v)}
              className="mascot-bounce focus:outline-none hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer"
              title={bubbleOpen ? 'Ocultar mensaje' : 'Mostrar mensaje'}
              aria-label="Guía del dashboard"
            >
              {CUSTOM_AVATAR_SRC ? (
                <img src={CUSTOM_AVATAR_SRC} alt="Guía" className="w-28 h-auto object-contain drop-shadow-lg" />
              ) : (
                <SVGAvatar isDark={isDark} armAngle={section.armAngle} />
              )}
            </button>

          </div>
        )}

      </div>
    </>
  )
}

/* ─── SVG Avatar improvisado ───────────────────────────────────────────────── */
function SVGAvatar({ isDark, armAngle }) {
  const skin    = '#F4C5A3'
  const hair    = isDark ? '#cbd5e1' : '#1e293b'
  const shirt   = '#4f46e5'
  const pants   = isDark ? '#1d4ed8' : '#1e3a8a'
  const shoes   = '#0f172a'
  const glasses = isDark ? '#94a3b8' : '#475569'

  return (
    <svg
      viewBox="0 0 100 118"
      width="70"
      height="82"
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
    >
      {/* Ground shadow */}
      <ellipse cx="50" cy="116" rx="19" ry="3.5" fill="rgba(0,0,0,0.13)" />

      {/* ── Legs ── */}
      <rect x="33" y="88" width="13" height="22" rx="5.5" fill={pants} />
      <rect x="54" y="88" width="13" height="22" rx="5.5" fill={pants} />

      {/* ── Shoes ── */}
      <ellipse cx="39"  cy="111" rx="9.5" ry="4.5" fill={shoes} />
      <ellipse cx="60"  cy="111" rx="9.5" ry="4.5" fill={shoes} />

      {/* ── Body / shirt ── */}
      <rect x="29" y="56" width="42" height="36" rx="13" fill={shirt} />
      <line x1="50" y1="62" x2="50" y2="89" stroke="white" strokeWidth="1.4" opacity="0.25" />
      {/* Collar */}
      <path d="M 41 56 L 50 65 L 59 56" fill="white" opacity="0.85" />
      {/* Pocket */}
      <rect x="34" y="67" width="10" height="8" rx="2" fill="white" opacity="0.12" />

      {/* ── Pointing arm (rotates) ── */}
      <g style={{
        transformOrigin: '50px 64px',
        transform: `rotate(${armAngle}deg)`,
        transition: 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Upper arm */}
        <rect x="50" y="59" width="35" height="10" rx="5" fill={shirt} />
        {/* Wrist */}
        <circle cx="86" cy="64" r="6.5" fill={skin} />
        {/* Pointing finger */}
        <rect x="87" y="59" width="15" height="6" rx="3" fill={skin} />
        <rect x="98" y="59.5" width="5" height="5" rx="2.5" fill="#e8b89a" />
      </g>

      {/* ── Left arm (idle) ── */}
      <rect x="16" y="59" width="15" height="10" rx="5" fill={shirt} />
      <circle cx="15" cy="65" r="6.5" fill={skin} />

      {/* ── Neck ── */}
      <rect x="43" y="46" width="14" height="13" rx="4" fill={skin} />

      {/* ── Head ── */}
      <circle cx="50" cy="30" r="25" fill={skin} />

      {/* ── Hair ── */}
      <path
        d="M 25 27 Q 28 4 50 5 Q 72 4 75 27 Q 71 12 50 13 Q 29 12 25 27 Z"
        fill={hair}
      />

      {/* ── Ears ── */}
      <ellipse cx="25" cy="32" rx="4"   ry="5.5" fill={skin} />
      <ellipse cx="75" cy="32" rx="4"   ry="5.5" fill={skin} />

      {/* ── Glasses frames ── */}
      <rect x="27" y="24" width="19" height="13" rx="5.5" fill="none" stroke={glasses} strokeWidth="2.3" />
      <rect x="54" y="24" width="19" height="13" rx="5.5" fill="none" stroke={glasses} strokeWidth="2.3" />
      <line x1="46" y1="30" x2="54" y2="30" stroke={glasses} strokeWidth="2"   />
      <line x1="22" y1="30" x2="27" y2="30" stroke={glasses} strokeWidth="2"   />
      <line x1="73" y1="30" x2="78" y2="30" stroke={glasses} strokeWidth="2"   />

      {/* ── Eyes (inside glasses) ── */}
      <ellipse cx="36.5" cy="30" rx="3.8" ry="3.8" fill="white" />
      <ellipse cx="63.5" cy="30" rx="3.8" ry="3.8" fill="white" />

      {/* Pupils with blink animation */}
      <ellipse cx="37.5" cy="30.5" rx="2.2" ry="2.2" fill="#0f172a">
        <animate attributeName="ry" values="2.2;0.15;2.2" keyTimes="0;0.5;1" dur="4.5s" repeatCount="indefinite" begin="2s" />
      </ellipse>
      <ellipse cx="64.5" cy="30.5" rx="2.2" ry="2.2" fill="#0f172a">
        <animate attributeName="ry" values="2.2;0.15;2.2" keyTimes="0;0.5;1" dur="4.5s" repeatCount="indefinite" begin="2s" />
      </ellipse>

      {/* ── Smile ── */}
      <path d="M 40 42 Q 50 49 60 42" stroke="#c07858" strokeWidth="2.3" fill="none" strokeLinecap="round" />

      {/* ── Blush ── */}
      <circle cx="33" cy="40" r="5.5" fill="#f8a58c" opacity="0.32" />
      <circle cx="67" cy="40" r="5.5" fill="#f8a58c" opacity="0.32" />
    </svg>
  )
}
