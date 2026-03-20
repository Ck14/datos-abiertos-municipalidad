# CLAUDE.md — DatosAbiertos

## Proyecto
Dashboard de transparencia presupuestaria municipal para la Municipalidad de Chimaltenango, Guatemala.
Empresa: **Chimaltenango Transparente**.

## Stack
- Vite + React 18 + Tailwind CSS 3 + Recharts + Lucide React
- Puerto dev: **3000**
- Comando dev: `node node_modules/.bin/vite --port 3000`

## Reglas importantes
- **No usar token** en llamadas a la API MINFIN — es open data público
- **Dark mode por defecto** — `useTheme` inicializa en oscuro, toggle en Header
- **No cambiar lógica de drill-down** sin revisar `useDrilldown.js` y `budgetAggregator.js`
- **fixEncoding()** debe aplicarse a todos los campos de texto que vienen de la API (UTF-8 roto)
- Los anillos SVG usan `var(--ring-track)` para el track en dark mode — no hardcodear `#f1f5f9`
- Recharts necesita colores JS condicionales — usar `useIsDark()` del ThemeContext

## Jerarquía programática
`programa → subPrograma → proyecto → actividad → obra`

## Archivos clave
| Archivo | Propósito |
|---------|-----------|
| `src/api/minfin.js` | Auto-descubrimiento de resource_id + fetch con proxy |
| `src/hooks/useBudgetData.js` | Carga de datos con fallback local |
| `src/hooks/useDrilldown.js` | Estado de navegación jerárquica |
| `src/hooks/useTheme.js` | Dark/light mode persistido en localStorage |
| `src/contexts/ThemeContext.jsx` | Proveedor de isDark para Recharts y SVGs |
| `src/utils/budgetAggregator.js` | Agregación por jerarquía y totales |
| `src/utils/formatters.js` | fixEncoding, formatGTQ, formatMillions, formatPct |
| `src/data/config.json` | packageNamePrefix, codigoEntidad, localDataDate |
