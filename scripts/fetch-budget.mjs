/**
 * Descarga los datos presupuestarios de MINFIN y actualiza el JSON local.
 * Uso: node scripts/fetch-budget.mjs
 */

import { writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const config = JSON.parse(readFileSync(join(ROOT, 'src/data/config.json'), 'utf8'))
const CKAN_BASE = 'https://datos.minfin.gob.gt/api/action'
const YEAR = new Date().getFullYear()

async function discoverResourceId() {
  const packageId = `${config.packageNamePrefix}${YEAR}`
  const resourceName = `${config.resourceNamePrefix}${YEAR}`

  console.log(`Buscando paquete: ${packageId}`)
  const res = await fetch(`${CKAN_BASE}/package_show?id=${packageId}`)
  if (!res.ok) throw new Error(`package_show HTTP ${res.status}`)

  const json = await res.json()
  if (!json.success) throw new Error(`package_show retornó success=false para "${packageId}"`)

  const match = json.result.resources.find(r =>
    r.name?.toLowerCase().includes(resourceName.toLowerCase())
  )
  if (!match) {
    const names = json.result.resources.map(r => r.name).join(', ')
    throw new Error(`No se encontró "${resourceName}". Disponibles: ${names}`)
  }

  console.log(`resource_id encontrado: ${match.id} (${match.name})`)
  return match.id
}

async function fetchRecords(resourceId) {
  const res = await fetch(`${CKAN_BASE}/datastore_search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      resource_id: resourceId,
      filters: { codigoEntidad: config.codigoEntidad },
      limit: 5000,
    }),
  })
  if (!res.ok) throw new Error(`datastore_search HTTP ${res.status}`)
  const json = await res.json()
  if (!json.success) throw new Error('datastore_search retornó success=false')
  return json
}

async function main() {
  const resourceId = await discoverResourceId()
  const data = await fetchRecords(resourceId)

  const records = data.result.records
  console.log(`Registros obtenidos: ${records.length}`)

  const outFile = join(ROOT, `src/data/chimaltenango_presupuesto_${YEAR}.json`)
  writeFileSync(outFile, JSON.stringify(data, null, 2), 'utf8')
  console.log(`Guardado: ${outFile}`)

  const today = new Date().toISOString().split('T')[0]
  config.localDataDate = today
  writeFileSync(join(ROOT, 'src/data/config.json'), JSON.stringify(config, null, 2) + '\n', 'utf8')
  console.log(`config.json actualizado: localDataDate = ${today}`)
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
