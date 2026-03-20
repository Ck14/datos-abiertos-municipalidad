import { Treemap, ResponsiveContainer, Tooltip } from 'recharts'
import { aggregateByPrograma } from '../../utils/budgetAggregator'
import { formatMillions, formatPct } from '../../utils/formatters'
import { getExecutionColor } from '../../utils/colorScale'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg text-xs font-body max-w-xs">
      <p className="font-medium text-slate-800 mb-1">{d.name}</p>
      <p className="text-slate-600">Vigente: <strong>{formatMillions(d.vigente)}</strong></p>
      <p className="text-slate-600">Devengado: <strong>{formatMillions(d.devengado)}</strong></p>
      <p className="text-slate-500">Ejecución: <strong>{formatPct(d.pctEjecucion)}</strong></p>
    </div>
  )
}

function CustomContent({ x, y, width, height, name, pctEjecucion }) {
  if (width < 40 || height < 30) return null
  const color = getExecutionColor(pctEjecucion || 0)
  const shortName = name?.length > 18 ? name.slice(0, 16) + '…' : name
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={4} fill={color} fillOpacity={0.85} stroke="white" strokeWidth={2} />
      <text x={x + 8} y={y + 18} fill="white" fontSize={10} fontFamily="Sora" fontWeight={600}>
        {shortName}
      </text>
      {height > 45 && (
        <text x={x + 8} y={y + 32} fill="white" fontSize={9} fontFamily="DM Sans" opacity={0.9}>
          {formatPct(pctEjecucion)}
        </text>
      )}
    </g>
  )
}

export default function TreemapChart({ records }) {
  const data = aggregateByPrograma(records).map(p => ({
    name: p.name,
    size: p.vigente,
    vigente: p.vigente,
    devengado: p.devengado,
    pctEjecucion: p.pctEjecucion,
  }))

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-display font-semibold text-slate-800">Distribución por Programa</h3>
        <div className="flex items-center gap-3 text-xs font-body text-slate-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500 inline-block" /> &lt;30%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-yellow-400 inline-block" /> 30–70%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-500 inline-block" /> &gt;70%</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <Treemap
          data={data}
          dataKey="size"
          content={<CustomContent />}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  )
}
