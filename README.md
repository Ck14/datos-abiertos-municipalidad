# Dashboard Presupuesto Municipal — Chimaltenango

Sitio web interactivo para visualizar y explorar el presupuesto de la **Municipalidad de Chimaltenango**, con datos publicados por el Ministerio de Finanzas de Guatemala (MINFIN) a través de su portal de datos abiertos.

## Funcionalidades

- **Resumen general** con KPIs de presupuesto asignado, vigente, devengado y pagado
- **Explorador drill-down** por tres jerarquías: Programática, Funcional y por Tipo de Gasto
- **Gráficas interactivas**: treemap por programa, barras de ejecución y donut de fuentes de financiamiento
- **Tabla detallada** con filtros por programa, fuente, tipo de presupuesto y búsqueda de texto
- **Semáforo de ejecución**: verde ≥70%, amarillo 30–70%, rojo <30%
- **Actualización automática**: detecta el recurso correcto de MINFIN según el año en curso, sin necesidad de tocar código

## Stack tecnológico

| Herramienta | Uso |
|---|---|
| [Vite](https://vitejs.dev/) | Bundler y servidor de desarrollo |
| [React 18](https://react.dev/) | UI |
| [Tailwind CSS](https://tailwindcss.com/) | Estilos |
| [Recharts](https://recharts.org/) | Gráficas |
| [Lucide React](https://lucide.dev/) | Íconos |

## Estructura del proyecto

```
src/
├── api/
│   └── minfin.js              # Cliente de la API de MINFIN con auto-descubrimiento
├── data/
│   ├── config.json            # Configuración: prefijos de paquete y recurso
│   └── chimaltenango_presupuesto_2026.json  # Datos locales de fallback
├── hooks/
│   ├── useBudgetData.js       # Carga de datos, estado de fuente y refetch
│   └── useDrilldown.js        # Estado de navegación por niveles
├── utils/
│   ├── budgetAggregator.js    # Agrupaciones y cálculos por jerarquía
│   ├── formatters.js          # Formato GTQ, millones, porcentajes y fix de encoding
│   └── colorScale.js          # Semáforo de ejecución
└── components/
    ├── layout/                # Header y Sidebar
    ├── dashboard/             # KPICards
    ├── charts/                # TreemapChart, ExecutionBarChart, FuenteDonut
    ├── drilldown/             # DrilldownNavigator, Breadcrumb, LevelCard, ViewToggle
    └── table/                 # BudgetTable y TableFilters
```

## Cómo correr el proyecto

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar el token de MINFIN (opcional)

Si tenés acceso al API de MINFIN, creá un archivo `.env.local` en la raíz:

```env
VITE_MINFIN_TOKEN=tu_token_aqui
```

> Sin el token, el sistema carga automáticamente los datos locales de fallback (`src/data/chimaltenango_presupuesto_2026.json`).

### 3. Iniciar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 4. Compilar para producción

```bash
npm run build
```

Los archivos quedan en `dist/`.

## Cómo funciona la actualización de datos

### Actualización automática del recurso (sin tocar código)

El sistema descubre automáticamente el `resource_id` correcto consultando la API de CKAN de MINFIN, usando los patrones definidos en `src/data/config.json`:

```json
{
  "packageNamePrefix": "informacion-presupuestaria-municipal-",
  "resourceNamePrefix": "Región V Central (Egresos) al "
}
```

**Flujo al cargar el sitio:**

```
1. Obtiene el año actual (ej: 2027)
2. Consulta package_show para "informacion-presupuestaria-municipal-2027"
3. Encuentra el recurso "Región V Central (Egresos) al 2027"
4. Usa ese resource_id para llamar a datastore_search
5. Filtra por codigoEntidad = 12100401 (Municipalidad de Chimaltenango)
6. Si cualquier paso falla → carga los datos locales de fallback
```

El `resource_id` descubierto se guarda en `sessionStorage` para no repetir la consulta durante la misma sesión.

### Actualizar los datos locales de fallback

Cuando MINFIN publique el recurso del nuevo año, podés actualizar el JSON local ejecutando:

```bash
curl -X POST https://datos.minfin.gob.gt/api/action/datastore_search \
  -H "Authorization: $MINFIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resource_id": "NUEVO_RESOURCE_ID",
    "filters": { "codigoEntidad": 12100401 },
    "limit": 5000
  }' > src/data/chimaltenango_presupuesto_XXXX.json
```

Luego actualizar la importación en `src/api/minfin.js`:

```js
const mod = await import('../data/chimaltenango_presupuesto_XXXX.json')
```

## Fuente de datos

Los datos provienen del portal de datos abiertos del **Ministerio de Finanzas Públicas de Guatemala**:

- Portal: [datos.minfin.gob.gt](https://datos.minfin.gob.gt)
- Dataset: `informacion-presupuestaria-municipal-{año}`
- Entidad: Municipalidad de Chimaltenango (`codigoEntidad: 12100401`)
- Los datos se actualizan mensualmente por MINFIN

## Licencia

Datos públicos publicados por el Ministerio de Finanzas de Guatemala.
