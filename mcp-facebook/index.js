#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import * as dotenv from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '.env') })

const PAGE_ID = process.env.FB_PAGE_ID
const ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN
const GRAPH = 'https://graph.facebook.com/v19.0'

// ─── Helpers ────────────────────────────────────────────────────────────────

function fixEncoding(str) {
  if (!str || typeof str !== 'string') return str
  return str
    .replace(/\u00c3\u201c/g, 'Ó').replace(/\u00c3\u00b3/g, 'ó')
    .replace(/\u00c3\u0161/g, 'Ú').replace(/\u00c3\u00ba/g, 'ú')
    .replace(/\u00c3\u0081/g, 'Á').replace(/\u00c3\u00a1/g, 'á')
    .replace(/\u00c3\u0089/g, 'É').replace(/\u00c3\u00a9/g, 'é')
    .replace(/\u00c3\u008d/g, 'Í').replace(/\u00c3\u00ad/g, 'í')
    .replace(/\u00c3\u2019/g, 'Ñ').replace(/\u00c3\u00b1/g, 'ñ')
    .replace(/Ã"N/g, 'ÓN').replace(/Ã³/g, 'ó').replace(/Ã±/g, 'ñ')
}

function fmt(n) {
  if (n >= 1_000_000) return 'Q ' + (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000)     return 'Q ' + (n / 1_000).toFixed(1) + 'K'
  return 'Q ' + n.toFixed(2)
}

function pct(a, b) {
  if (!b) return '0.0%'
  return ((a / b) * 100).toFixed(1) + '%'
}

async function fbPost(endpoint, body) {
  const url = `${GRAPH}/${endpoint}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, access_token: ACCESS_TOKEN }),
  })
  const json = await res.json()
  if (json.error) throw new Error(json.error.message)
  return json
}

async function fbGet(endpoint, params = {}) {
  const qs = new URLSearchParams({ ...params, access_token: ACCESS_TOKEN })
  const res = await fetch(`${GRAPH}/${endpoint}?${qs}`)
  const json = await res.json()
  if (json.error) throw new Error(json.error.message)
  return json
}

// ─── Budget summary generator ───────────────────────────────────────────────

function buildBudgetSummary() {
  const dataPath = join(__dirname, '../src/data/chimaltenango_presupuesto_2026.json')
  const raw = JSON.parse(readFileSync(dataPath, 'utf8'))
  const records = raw.result.records

  let totalVigente = 0
  let totalDevengado = 0
  const porPrograma = {}

  for (const r of records) {
    totalVigente   += r.vigente   || 0
    totalDevengado += r.devengado || 0

    const prog = fixEncoding(r.programa) || 'Sin programa'
    if (!porPrograma[prog]) porPrograma[prog] = { vigente: 0, devengado: 0 }
    porPrograma[prog].vigente   += r.vigente   || 0
    porPrograma[prog].devengado += r.devengado || 0
  }

  // Top 3 programas por ejecución absoluta
  const top3 = Object.entries(porPrograma)
    .sort((a, b) => b[1].devengado - a[1].devengado)
    .slice(0, 3)

  const ejercicio = records[0]?.ejercicio || 2026
  const fecha = new Date().toLocaleDateString('es-GT', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  let post = `📊 EJECUCIÓN PRESUPUESTARIA ${ejercicio}\n`
  post += `Municipalidad de Chimaltenango\n`
  post += `📅 Datos al ${fecha}\n\n`
  post += `💰 Presupuesto vigente: ${fmt(totalVigente)}\n`
  post += `✅ Ejecutado: ${fmt(totalDevengado)} (${pct(totalDevengado, totalVigente)})\n`
  post += `🔄 Saldo disponible: ${fmt(totalVigente - totalDevengado)}\n\n`
  post += `🏆 Top programas por ejecución:\n`

  for (const [nombre, montos] of top3) {
    post += `  • ${nombre}: ${fmt(montos.devengado)} (${pct(montos.devengado, montos.vigente)})\n`
  }

  post += `\n🔍 Consulta el detalle completo en nuestro portal de transparencia.\n`
  post += `#Transparencia #Chimaltenango #PresupuestoMunicipal #DatosAbiertos`

  return post
}

// ─── MCP Server ─────────────────────────────────────────────────────────────

const server = new Server(
  { name: 'mcp-facebook-chimaltenango', version: '1.0.0' },
  { capabilities: { tools: {} } }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'post_text',
      description: 'Publica un mensaje de texto en la página de Facebook',
      inputSchema: {
        type: 'object',
        properties: {
          message: { type: 'string', description: 'Texto del post' },
        },
        required: ['message'],
      },
    },
    {
      name: 'post_with_image',
      description: 'Publica un mensaje con imagen (URL pública) en Facebook',
      inputSchema: {
        type: 'object',
        properties: {
          message: { type: 'string', description: 'Texto del post' },
          image_url: { type: 'string', description: 'URL pública de la imagen' },
        },
        required: ['message', 'image_url'],
      },
    },
    {
      name: 'post_budget_summary',
      description: 'Genera y publica automáticamente un resumen de ejecución presupuestaria 2026',
      inputSchema: {
        type: 'object',
        properties: {
          extra_message: {
            type: 'string',
            description: 'Texto adicional opcional para agregar al inicio del post',
          },
        },
        required: [],
      },
    },
    {
      name: 'schedule_post',
      description: 'Programa un post para publicarse en una fecha y hora específica',
      inputSchema: {
        type: 'object',
        properties: {
          message: { type: 'string', description: 'Texto del post' },
          publish_at: {
            type: 'string',
            description: 'Fecha y hora en formato ISO 8601, ej: 2026-03-28T10:00:00',
          },
        },
        required: ['message', 'publish_at'],
      },
    },
    {
      name: 'get_recent_posts',
      description: 'Obtiene los últimos posts publicados en la página',
      inputSchema: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Cantidad de posts a traer (máximo 10, por defecto 5)',
          },
        },
        required: [],
      },
    },
  ],
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  if (!PAGE_ID || !ACCESS_TOKEN) {
    return {
      content: [{
        type: 'text',
        text: 'Error: Faltan FB_PAGE_ID o FB_PAGE_ACCESS_TOKEN en el archivo .env',
      }],
      isError: true,
    }
  }

  try {
    switch (name) {
      case 'post_text': {
        const result = await fbPost(`${PAGE_ID}/feed`, { message: args.message })
        return {
          content: [{
            type: 'text',
            text: `✅ Post publicado correctamente. ID: ${result.id}`,
          }],
        }
      }

      case 'post_with_image': {
        const result = await fbPost(`${PAGE_ID}/photos`, {
          url: args.image_url,
          caption: args.message,
        })
        return {
          content: [{
            type: 'text',
            text: `✅ Post con imagen publicado. ID: ${result.id || result.post_id}`,
          }],
        }
      }

      case 'post_budget_summary': {
        let message = buildBudgetSummary()
        if (args.extra_message) {
          message = args.extra_message.trim() + '\n\n' + message
        }
        const result = await fbPost(`${PAGE_ID}/feed`, { message })
        return {
          content: [{
            type: 'text',
            text: `✅ Resumen presupuestario publicado. ID: ${result.id}\n\nContenido:\n${message}`,
          }],
        }
      }

      case 'schedule_post': {
        const publishTime = Math.floor(new Date(args.publish_at).getTime() / 1000)
        if (isNaN(publishTime)) {
          throw new Error('Fecha inválida. Usa formato ISO 8601, ej: 2026-03-28T10:00:00')
        }
        const result = await fbPost(`${PAGE_ID}/feed`, {
          message: args.message,
          scheduled_publish_time: publishTime,
          published: false,
        })
        return {
          content: [{
            type: 'text',
            text: `⏰ Post programado para ${args.publish_at}. ID: ${result.id}`,
          }],
        }
      }

      case 'get_recent_posts': {
        const limit = Math.min(args.limit || 5, 10)
        const data = await fbGet(`${PAGE_ID}/posts`, {
          fields: 'message,created_time,permalink_url',
          limit: String(limit),
        })
        const posts = data.data || []
        if (!posts.length) {
          return { content: [{ type: 'text', text: 'No se encontraron posts recientes.' }] }
        }
        const lines = posts.map((p, i) => {
          const fecha = new Date(p.created_time).toLocaleString('es-GT')
          const msg = (p.message || '(sin texto)').slice(0, 100)
          return `${i + 1}. [${fecha}]\n   ${msg}\n   ${p.permalink_url || ''}`
        })
        return {
          content: [{
            type: 'text',
            text: `Últimos ${posts.length} posts:\n\n${lines.join('\n\n')}`,
          }],
        }
      }

      default:
        throw new Error(`Herramienta desconocida: ${name}`)
    }
  } catch (err) {
    return {
      content: [{ type: 'text', text: `❌ Error: ${err.message}` }],
      isError: true,
    }
  }
})

const transport = new StdioServerTransport()
await server.connect(transport)
