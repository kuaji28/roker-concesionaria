// ─────────────────────────────────────────────────────────────────
// Cálculo de alertas de vencimientos — GH Cars
// Aplica solo a vehículos en stock (no vendidos)
// ─────────────────────────────────────────────────────────────────

/**
 * Tabla VTV Buenos Aires 2026:
 * Último dígito de patente → mes de vencimiento
 */
const VTV_MES_POR_DIGITO = {
  '0': 10, // Octubre
  '1': 11, // Noviembre
  '2': 2,  // Febrero
  '3': 3,  // Marzo
  '4': 4,  // Abril
  '5': 5,  // Mayo
  '6': 6,  // Junio
  '7': 7,  // Julio
  '8': 8,  // Agosto
  '9': 9,  // Septiembre
}

/**
 * Cuotas patente PBA 2026
 */
const CUOTAS_PATENTE_2026 = [
  { cuota: 1,  vencimiento: new Date(2026, 2, 10)  }, // 10/03
  { cuota: 2,  vencimiento: new Date(2026, 3, 9)   }, // 09/04
  { cuota: 3,  vencimiento: new Date(2026, 4, 7)   }, // 07/05
  { cuota: 4,  vencimiento: new Date(2026, 5, 9)   }, // 09/06
  { cuota: 5,  vencimiento: new Date(2026, 6, 8)   }, // 08/07
  { cuota: 6,  vencimiento: new Date(2026, 7, 11)  }, // 11/08
  { cuota: 7,  vencimiento: new Date(2026, 8, 10)  }, // 10/09
  { cuota: 8,  vencimiento: new Date(2026, 9, 9)   }, // 09/10
  { cuota: 9,  vencimiento: new Date(2026, 10, 10) }, // 10/11
  { cuota: 10, vencimiento: new Date(2026, 11, 10) }, // 10/12
]

/**
 * Calcula la fecha de vencimiento de VTV a partir de la patente (PBA).
 * Retorna Date o null.
 */
export function calcularVencimientoVTV(patente) {
  if (!patente) return null
  const p = patente.replace(/[\s\-]/g, '').toUpperCase()
  const digitos = p.match(/\d/g)
  if (!digitos || !digitos.length) return null
  const ultimoDigito = digitos[digitos.length - 1]
  const mes = VTV_MES_POR_DIGITO[ultimoDigito]
  if (!mes) return null
  let anio = new Date().getFullYear()
  const vencimiento = new Date(anio, mes - 1, 1)
  if (vencimiento < new Date()) vencimiento.setFullYear(anio + 1)
  return vencimiento
}

/**
 * Devuelve la próxima cuota de patente PBA.
 * Retorna { cuota, vencimiento } o null.
 */
export function proximaCuotaPatente() {
  const hoy = new Date()
  return CUOTAS_PATENTE_2026.find(c => c.vencimiento >= hoy) || null
}

/**
 * Calcula los días hasta la fecha dada.
 * Negativo = ya venció.
 */
export function diasHasta(fecha) {
  if (!fecha) return null
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const diff = new Date(fecha).getTime() - hoy.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Nivel de urgencia basado en días restantes.
 */
export function nivelAlerta(dias) {
  if (dias === null) return 'sin_datos'
  if (dias < 0)   return 'vencido'     // rojo intenso
  if (dias < 15)  return 'critico'     // rojo
  if (dias < 30)  return 'urgente'     // naranja
  if (dias < 60)  return 'proximo'     // amarillo
  return 'ok'                          // verde
}

/**
 * Genera la lista de alertas para un array de vehículos.
 * Solo para vehículos no vendidos (estado !== 'vendido').
 */
export function generarAlertas(vehiculos, documentacionMap = {}) {
  const alertas = []

  for (const v of vehiculos) {
    if (v.estado === 'vendido') continue

    // Alerta VTV
    const vtvVenc = calcularVencimientoVTV(v.patente)
    if (vtvVenc) {
      const dias = diasHasta(vtvVenc)
      const nivel = nivelAlerta(dias)
      if (nivel !== 'ok' && nivel !== 'sin_datos') {
        alertas.push({
          tipo: 'vtv',
          nivel,
          vehiculo_id: v.id,
          vehiculo: `${v.marca} ${v.modelo} ${v.anio}`,
          patente: v.patente,
          mensaje: dias < 0
            ? `VTV VENCIDA hace ${Math.abs(dias)} días`
            : `VTV vence en ${dias} días`,
          fecha: vtvVenc,
          dias,
        })
      }
    }

    // Alerta patente
    const proxCuota = proximaCuotaPatente()
    if (proxCuota) {
      const dias = diasHasta(proxCuota.vencimiento)
      const nivel = nivelAlerta(dias)
      if (nivel === 'critico' || nivel === 'urgente') {
        alertas.push({
          tipo: 'patente',
          nivel,
          vehiculo_id: v.id,
          vehiculo: `${v.marca} ${v.modelo} ${v.anio}`,
          patente: v.patente,
          mensaje: `Cuota ${proxCuota.cuota}/10 patente vence en ${dias} días`,
          fecha: proxCuota.vencimiento,
          dias,
        })
      }
    }
  }

  // Ordenar por urgencia
  const orden = { vencido: 0, critico: 1, urgente: 2, proximo: 3, ok: 4 }
  return alertas.sort((a, b) => orden[a.nivel] - orden[b.nivel])
}
