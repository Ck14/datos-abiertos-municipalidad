/**
 * Corrige el encoding roto que viene del API de MINFIN.
 * Los textos vienen con doble encoding UTF-8 interpretado como latin-1.
 * Usamos un mapa de patrones comunes.
 */
export function fixEncoding(str) {
  if (!str || typeof str !== 'string') return str

  return str
    // O con acento
    .replace(/\u00c3\u201c/g, '\u00d3')   // O mayuscula acentuada
    .replace(/\u00c3\u00b3/g, '\u00f3')   // o minuscula acentuada
    // U con acento
    .replace(/\u00c3\u0161/g, '\u00da')   // U mayuscula
    .replace(/\u00c3\u00ba/g, '\u00fa')   // u minuscula
    // A con acento
    .replace(/\u00c3\udc81/g, '\u00c1')   // A mayuscula (surrogate)
    .replace(/\u00c3\u0081/g, '\u00c1')   // A mayuscula
    .replace(/\u00c3\u00a1/g, '\u00e1')   // a minuscula
    // E con acento
    .replace(/\u00c3\u0089/g, '\u00c9')   // E mayuscula
    .replace(/\u00c3\u00a9/g, '\u00e9')   // e minuscula
    // I con acento
    .replace(/\u00c3\udc8d/g, '\u00cd')   // I mayuscula (surrogate)
    .replace(/\u00c3\u008d/g, '\u00cd')   // I mayuscula
    .replace(/\u00c3\u00ad/g, '\u00ed')   // i minuscula
    // N con tilde
    .replace(/\u00c3\u2019/g, '\u00d1')   // N mayuscula
    .replace(/\u00c3\u00b1/g, '\u00f1')   // n minuscula
    // U con dieresis
    .replace(/\u00c3\u009c/g, '\u00dc')   // U mayuscula
    .replace(/\u00c3\u00bc/g, '\u00fc')   // u minuscula
    // Patterns alternativos que se ven en el JSON
    .replace(/Ã"N/g, '\u00d3N')
    .replace(/Ã³/g, '\u00f3')
    .replace(/Ã\u0161/g, '\u00da')
    .replace(/Ã\u00ba/g, '\u00fa')
    .replace(/Ã±/g, '\u00f1')
}

export function formatGTQ(amount) {
  if (amount === null || amount === undefined) return 'Q 0.00'
  return 'Q ' + amount.toLocaleString('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatMillions(amount) {
  if (amount === null || amount === undefined) return 'Q 0'
  if (Math.abs(amount) >= 1_000_000) {
    return 'Q ' + (amount / 1_000_000).toLocaleString('es-GT', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + 'M'
  }
  if (Math.abs(amount) >= 1_000) {
    return 'Q ' + (amount / 1_000).toLocaleString('es-GT', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + 'K'
  }
  return formatGTQ(amount)
}

export function formatPct(value) {
  if (value === null || value === undefined || isNaN(value)) return '0.0%'
  return value.toLocaleString('es-GT', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }) + '%'
}
