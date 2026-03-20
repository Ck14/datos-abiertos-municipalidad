import appConfig from '../data/config.json'

// En dev: Vite proxea /api/minfin → datos.minfin.gob.gt/api/action
// En prod: Vercel rewrites /api/minfin → datos.minfin.gob.gt/api/action (vercel.json)
const CKAN_BASE = '/api/minfin'
const CACHE_KEY   = 'minfin_resource_id_cache'

/**
 * Devuelve el año fiscal actual.
 */
function getCurrentYear() {
  return new Date().getFullYear()
}

/**
 * Construye el nombre del paquete y del recurso según el año actual.
 */
function getNames(year) {
  return {
    packageId:    `${appConfig.packageNamePrefix}${year}`,
    resourceName: `${appConfig.resourceNamePrefix}${year}`,
  }
}

/**
 * Descubre el resource_id consultando el package_show de CKAN.
 * Busca el recurso cuyo nombre coincide con "Región V Central (Egresos) al {año}".
 * Cachea el resultado en sessionStorage para no repetir la llamada en la misma sesión.
 */
async function discoverResourceId() {
  const year = getCurrentYear()
  const cacheEntry = sessionStorage.getItem(CACHE_KEY)

  // Usar caché si es del año actual
  if (cacheEntry) {
    const parsed = JSON.parse(cacheEntry)
    if (parsed.year === year && parsed.resourceId) {
      console.info(`[minfin] resource_id desde caché: ${parsed.resourceId}`)
      return { resourceId: parsed.resourceId, year }
    }
  }

  const { packageId, resourceName } = getNames(year)

  const response = await fetch(
    `${CKAN_BASE}/package_show?id=${packageId}`
  )

  if (!response.ok) {
    throw new Error(`package_show HTTP ${response.status}`)
  }

  const json = await response.json()
  if (!json.success) {
    throw new Error(`package_show retornó success=false para "${packageId}"`)
  }

  const resources = json.result?.resources ?? []
  const match = resources.find(r =>
    r.name?.toLowerCase().includes(resourceName.toLowerCase())
  )

  if (!match) {
    throw new Error(
      `No se encontró el recurso "${resourceName}" en el paquete "${packageId}". ` +
      `Recursos disponibles: ${resources.map(r => r.name).join(', ')}`
    )
  }

  const resourceId = match.id
  console.info(`[minfin] resource_id descubierto: ${resourceId} (${match.name})`)

  // Guardar en caché
  sessionStorage.setItem(CACHE_KEY, JSON.stringify({ year, resourceId }))

  return { resourceId, year }
}

/**
 * Obtiene los registros desde la API de MINFIN.
 * Descubre el resource_id automáticamente según el año en curso.
 */
export async function fetchFromAPI() {
  try {
    const { resourceId } = await discoverResourceId()

    const response = await fetch(`${CKAN_BASE}/datastore_search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resource_id: resourceId,
        filters: { codigoEntidad: appConfig.codigoEntidad },
        limit: 5000,
      }),
    })

    if (!response.ok) {
      throw new Error(`datastore_search HTTP ${response.status}`)
    }

    const json = await response.json()
    if (!json.success) {
      throw new Error('datastore_search retornó success=false')
    }

    return { records: json.result.records, year: getCurrentYear() }
  } catch (err) {
    console.error('[minfin] Error al llamar a la API:', err.message)
    return null
  }
}

/**
 * Carga los datos locales de fallback.
 */
export async function fetchLocal() {
  const mod = await import('../data/chimaltenango_presupuesto_2026.json')
  return { records: mod.default.result.records, year: 2026 }
}

/**
 * Punto de entrada: intenta API primero, luego fallback local.
 * Retorna { records, source, year }
 */
export async function loadBudgetData() {
  const api = await fetchFromAPI()
  if (api && api.records.length > 0) {
    return { records: api.records, source: 'api', year: api.year }
  }
  const local = await fetchLocal()
  return { records: local.records, source: 'local', year: local.year }
}
