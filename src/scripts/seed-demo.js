/**
 * seed-demo.js — Demo data seed for GH Cars concesionaria app
 * Usage:
 *   node src/scripts/seed-demo.js            → insert demo data (safe to run multiple times)
 *   node src/scripts/seed-demo.js --clear    → delete all demo data first, then re-seed
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://zjrabazzvckvxhufppoa.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqcmFiYXp6dmNrdnhodWZwcG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MTY3OTUsImV4cCI6MjA4ODk5Mjc5NX0.cju7XBZwAPNzgkUNWh_OshVXSVmS-oCTXRqsU8IzlXM'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const CLEAR = process.argv.includes('--clear')

// ── Helpers ──────────────────────────────────────────────────────────────────

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

function monthsAgo(n) {
  const d = new Date()
  d.setMonth(d.getMonth() - n)
  return d.toISOString().split('T')[0]
}

async function upsert(table, rows, conflictCol = 'id') {
  if (!rows.length) return []
  const { data, error } = await supabase
    .from(table)
    .upsert(rows, { onConflict: conflictCol, ignoreDuplicates: false })
    .select()
  if (error) {
    console.error(`  ✗ Error en ${table}:`, error.message)
    return []
  }
  console.log(`  ✓ ${table}: ${data.length} registros`)
  return data
}

async function insertFresh(table, rows) {
  if (!rows.length) return []
  const { data, error } = await supabase.from(table).insert(rows).select()
  if (error) {
    console.error(`  ✗ Error en ${table}:`, error.message)
    return []
  }
  console.log(`  ✓ ${table}: ${data.length} registros`)
  return data
}

// ── Clear ─────────────────────────────────────────────────────────────────────

async function clearAll() {
  console.log('\n🗑  Limpiando datos demo...')
  // Order matters due to FK constraints
  const tables = [
    'cuotas', 'financiamientos', 'gastos_vehiculo', 'reservas',
    'medias', 'con_ventas', 'prospectos', 'clientes',
    'vehiculos', 'vendedores',
  ]
  for (const t of tables) {
    // Use gt(id, 0) for integer-id tables, neq for uuid-id tables
    const uuidTables = ['vendedores']
    const filter = uuidTables.includes(t)
      ? supabase.from(t).delete().neq('id', '00000000-0000-0000-0000-000000000000')
      : supabase.from(t).delete().gt('id', 0)
    const { error } = await filter
    if (error) console.warn(`  ⚠ No se pudo limpiar ${t}:`, error.message)
    else console.log(`  ✓ ${t} limpiado`)
  }
  // Config — only remove demo-added keys
  await supabase.from('config').delete().in('clave', ['tipo_cambio', 'wa_number'])
}

// ── Main seed ─────────────────────────────────────────────────────────────────

async function seed() {
  if (CLEAR) await clearAll()

  console.log('\n🌱 Sembrando datos demo...\n')

  // ── 1. Vendedores ──────────────────────────────────────────────────────────
  console.log('── Vendedores')
  const vendedoresData = [
    {
      nombre: 'Martín Rodríguez',
      email: 'martin.rodriguez@ghcars.com',
      telefono: '+5491144332211',
      whatsapp: '+5491144332211',
      rol: 'vendedor',
      comision_pct: 3.0,
      activo: true,
    },
    {
      nombre: 'Sofía Gómez',
      email: 'sofia.gomez@ghcars.com',
      telefono: '+5491155443322',
      whatsapp: '+5491155443322',
      rol: 'vendedor',
      comision_pct: 3.5,
      activo: true,
    },
    {
      nombre: 'Lucas Pereyra',
      email: 'lucas.pereyra@ghcars.com',
      telefono: '+5491166554433',
      whatsapp: '+5491166554433',
      rol: 'vendedor',
      comision_pct: 2.5,
      activo: true,
    },
    {
      nombre: 'Ana Torres',
      email: 'ana.torres@ghcars.com',
      telefono: '+5491177665544',
      whatsapp: '+5491177665544',
      rol: 'gerente',
      comision_pct: 0,
      activo: true,
    },
  ]
  const vendedores = await insertFresh('vendedores', vendedoresData)
  if (!vendedores.length) { console.error('Sin vendedores — abortando'); process.exit(1) }
  const [martin, sofia, lucas, ana] = vendedores

  // ── 2. Clientes ────────────────────────────────────────────────────────────
  console.log('\n── Clientes')
  const clientesData = [
    { nombre: 'Roberto Sánchez', dni: '28745123', telefono: '+5491122334455', email: 'roberto.sanchez@gmail.com', whatsapp: '+5491122334455', localidad: 'Buenos Aires', activo: true },
    { nombre: 'Claudia Fernández', dni: '31456789', telefono: '+5491133445566', email: 'cfernandez@hotmail.com', whatsapp: '+5491133445566', localidad: 'La Plata', activo: true },
    { nombre: 'Diego Martínez', dni: '25987654', telefono: '+5491144556677', email: 'diego.martinez@gmail.com', whatsapp: null, localidad: 'Rosario', activo: true },
    { nombre: 'Laura Villalba', dni: '33210456', telefono: '+5491155667788', email: 'lvillalba@yahoo.com', whatsapp: '+5491155667788', localidad: 'Córdoba', activo: true },
    { nombre: 'Marcelo Ríos', dni: '27654321', telefono: '+5491166778899', email: 'marcelorios@gmail.com', whatsapp: '+5491166778899', localidad: 'Buenos Aires', activo: true },
    { nombre: 'Patricia Aguirre', dni: '30123456', telefono: '+5491177889900', email: 'paguirre@outlook.com', whatsapp: null, localidad: 'Mendoza', activo: true },
    { nombre: 'Hernán Castro', dni: '26789012', telefono: '+5491188990011', email: 'hernan.castro@gmail.com', whatsapp: '+5491188990011', localidad: 'Tucumán', activo: true },
    { nombre: 'Verónica López', dni: '34567890', telefono: '+5491199001122', email: 'vlopez@gmail.com', whatsapp: '+5491199001122', localidad: 'Buenos Aires', activo: true },
    { nombre: 'Carlos Romero', dni: '29345678', telefono: '+5491100112233', email: 'carlos.romero@gmail.com', whatsapp: '+5491100112233', localidad: 'Salta', activo: true },
  ]
  const clientes = await insertFresh('clientes', clientesData)

  // ── 3. Vehículos ───────────────────────────────────────────────────────────
  console.log('\n── Vehículos')
  const vehiculosData = [
    {
      tipo: 'auto',
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2022,
      version: 'XEI CVT',
      km_hs: 28000,
      precio_base: 22500,
      costo_compra: 18000,
      estado: 'disponible',
      patente: 'AB123CD',
      color: 'Blanco',
      combustible: 'nafta',
      transmision: 'automatica',
      fecha_ingreso: daysAgo(45),
      en_negociacion: false,
    },
    {
      tipo: 'auto',
      marca: 'Volkswagen',
      modelo: 'Polo',
      anio: 2021,
      version: 'GTS TSI',
      km_hs: 41000,
      precio_base: 15800,
      costo_compra: 12500,
      estado: 'disponible',
      patente: 'CD456EF',
      color: 'Rojo',
      combustible: 'nafta',
      transmision: 'manual',
      fecha_ingreso: daysAgo(30),
      en_negociacion: false,
    },
    {
      tipo: 'suv',
      marca: 'Ford',
      modelo: 'EcoSport',
      anio: 2020,
      version: 'Titanium 4WD',
      km_hs: 58000,
      precio_base: 14200,
      costo_compra: 11000,
      estado: 'señado',
      patente: 'EF789GH',
      color: 'Gris',
      combustible: 'nafta',
      transmision: 'manual',
      fecha_ingreso: daysAgo(60),
      en_negociacion: false,
    },
    {
      tipo: 'suv',
      marca: 'Chevrolet',
      modelo: 'Tracker',
      anio: 2023,
      version: 'Premier Turbo',
      km_hs: 12000,
      precio_base: 28000,
      costo_compra: 22500,
      estado: 'disponible',
      patente: 'GH012IJ',
      color: 'Negro',
      combustible: 'nafta',
      transmision: 'automatica',
      fecha_ingreso: daysAgo(15),
      en_negociacion: false,
    },
    {
      tipo: 'auto',
      marca: 'Renault',
      modelo: 'Logan',
      anio: 2019,
      version: 'Intens 1.6',
      km_hs: 72000,
      precio_base: 9800,
      costo_compra: 7500,
      estado: 'en_revision',
      patente: 'IJ345KL',
      color: 'Plata',
      combustible: 'nafta',
      transmision: 'manual',
      fecha_ingreso: daysAgo(10),
      en_negociacion: false,
    },
    {
      tipo: 'auto',
      marca: 'Peugeot',
      modelo: '208',
      anio: 2021,
      version: 'Allure Pack 1.2T',
      km_hs: 35000,
      precio_base: 13500,
      costo_compra: 10500,
      estado: 'vendido',
      patente: 'KL678MN',
      color: 'Azul',
      combustible: 'nafta',
      transmision: 'manual',
      fecha_ingreso: daysAgo(90),
      en_negociacion: false,
    },
    {
      tipo: 'pickup',
      marca: 'Toyota',
      modelo: 'Hilux',
      anio: 2022,
      version: 'SRV 4x4 AT',
      km_hs: 19000,
      precio_base: 35000,
      costo_compra: 28000,
      estado: 'disponible',
      patente: 'MN901OP',
      color: 'Blanco',
      combustible: 'diesel',
      transmision: 'automatica',
      fecha_ingreso: daysAgo(20),
      en_negociacion: false,
    },
    {
      tipo: 'auto',
      marca: 'Volkswagen',
      modelo: 'Vento',
      anio: 2018,
      version: 'Highline TSI',
      km_hs: 89000,
      precio_base: 10500,
      costo_compra: 8200,
      estado: 'vendido',
      patente: 'OP234QR',
      color: 'Blanco',
      combustible: 'nafta',
      transmision: 'automatica',
      fecha_ingreso: daysAgo(120),
      en_negociacion: false,
    },
  ]
  const vehiculos = await insertFresh('vehiculos', vehiculosData)
  if (!vehiculos.length) { console.error('Sin vehículos — abortando'); process.exit(1) }

  // Sort by index for easy reference
  const [corolla, polo, ecosport, tracker, logan, peugeot208, hilux, vento] = vehiculos

  // ── 5. Prospectos / Leads ──────────────────────────────────────────────────
  console.log('\n── Prospectos')
  const prospectosSrc = [
    { nombre: 'Facundo Benitez',  telefono: '+5491123456789', email: 'facundo@gmail.com',  estado: 'nuevo',             canal: 'instagram',     vendedor_id: martin.id,  vehiculo_id: polo.id,       presupuesto_usd: 16000, notas: 'Interesado en Polo rojo, preguntó por financiamiento' },
    { nombre: 'Natalia Herrera',  telefono: '+5491134567890', email: 'nherrera@gmail.com', estado: 'contactado',        canal: 'whatsapp',      vendedor_id: sofia.id,   vehiculo_id: tracker.id,    presupuesto_usd: 28000, notas: 'Quiere probar el Tracker el sábado' },
    { nombre: 'Gustavo Suárez',   telefono: '+5491145678901', email: null,                 estado: 'en_negociacion',    canal: 'mercadolibre',  vendedor_id: lucas.id,   vehiculo_id: corolla.id,    presupuesto_usd: 20000, notas: 'Ofreció USD 21.000, estamos negociando' },
    { nombre: 'Daniela Medina',   telefono: '+5491156789012', email: 'dmedina@outlook.com',estado: 'reservado',         canal: 'referido',      vendedor_id: martin.id,  vehiculo_id: ecosport.id,   presupuesto_usd: 14000, notas: 'Señó el EcoSport, firma la semana próxima' },
    { nombre: 'Ezequiel Torres',  telefono: '+5491167890123', email: null,                 estado: 'cerrado_ganado',    canal: 'whatsapp',      vendedor_id: sofia.id,   vehiculo_id: peugeot208.id, presupuesto_usd: 13500, notas: 'Cerrado. Compró el 208.' },
    { nombre: 'Romina Flores',    telefono: '+5491178901234', email: 'rflores@gmail.com',  estado: 'cerrado_perdido',   canal: 'instagram',     vendedor_id: lucas.id,   vehiculo_id: null,          presupuesto_usd: 12000, notas: 'Compró en otra concesionaria. Presupuesto ajustado.' },
    { nombre: 'Pablo Acosta',     telefono: '+5491189012345', email: null,                 estado: 'nuevo',             canal: 'mercadolibre',  vendedor_id: null,       vehiculo_id: hilux.id,      presupuesto_usd: 34000, notas: 'Preguntó por Hilux diesel' },
    { nombre: 'Silvana Quiroga',  telefono: '+5491190123456', email: 'squiroga@yahoo.com', estado: 'contactado',        canal: 'referido',      vendedor_id: martin.id,  vehiculo_id: corolla.id,    presupuesto_usd: 22000, notas: 'La recomendó un cliente anterior' },
    { nombre: 'Tomás Villanueva', telefono: '+5491101234567', email: null,                 estado: 'en_negociacion',    canal: 'whatsapp',      vendedor_id: sofia.id,   vehiculo_id: vento.id,      presupuesto_usd: 10000, notas: 'Contrapropuesta en proceso' },
    { nombre: 'Karina Ramos',     telefono: '+5491112345678', email: 'kramos@gmail.com',   estado: 'cerrado_ganado',    canal: 'instagram',     vendedor_id: lucas.id,   vehiculo_id: vento.id,      presupuesto_usd: 10500, notas: 'Cerrado. Compró el Vento.' },
  ]
  const prospectos = await insertFresh('prospectos', prospectosSrc)

  // ── 6. Con Ventas (spread over 6 months) ──────────────────────────────────
  console.log('\n── Ventas')
  const ventasData = [
    {
      vehiculo_id: vento.id,
      vendedor_id: lucas.id,
      cliente_id: clientes[0]?.id || null,
      comprador_nombre: clientes[0]?.nombre || 'Roberto Sánchez',
      comprador_dni: clientes[0]?.dni || '28745123',
      comprador_telefono: clientes[0]?.telefono || '+5491122334455',
      precio_final: 10500,
      moneda_precio: 'USD',
      fecha_venta: monthsAgo(5),
      forma_pago: 'efectivo',
      notas: 'Venta al contado. Cliente muy conforme.',
    },
    {
      vehiculo_id: peugeot208.id,
      vendedor_id: sofia.id,
      cliente_id: clientes[1]?.id || null,
      comprador_nombre: clientes[1]?.nombre || 'Claudia Fernández',
      comprador_dni: clientes[1]?.dni || '31456789',
      comprador_telefono: clientes[1]?.telefono || '+5491133445566',
      precio_final: 13500,
      moneda_precio: 'USD',
      fecha_venta: monthsAgo(4),
      forma_pago: 'transferencia',
      notas: 'Transferencia en USD. Sin financiamiento.',
    },
    {
      vehiculo_id: ecosport.id,
      vendedor_id: martin.id,
      cliente_id: clientes[2]?.id || null,
      comprador_nombre: clientes[2]?.nombre || 'Diego Martínez',
      comprador_dni: clientes[2]?.dni || '25987654',
      comprador_telefono: clientes[2]?.telefono || '+5491144556677',
      precio_final: 14200,
      moneda_precio: 'USD',
      fecha_venta: monthsAgo(3),
      forma_pago: 'financiado',
      tiene_cuotas: true,
      cantidad_cuotas: 12,
      monto_total_cuotas: 7000,
      notas: 'Parte de la operación financiada. 12 cuotas.',
    },
    {
      vehiculo_id: polo.id,
      vendedor_id: sofia.id,
      cliente_id: clientes[3]?.id || null,
      comprador_nombre: clientes[3]?.nombre || 'Laura Villalba',
      comprador_dni: clientes[3]?.dni || '33210456',
      comprador_telefono: clientes[3]?.telefono || '+5491155667788',
      precio_final: 15800,
      moneda_precio: 'USD',
      fecha_venta: monthsAgo(2),
      forma_pago: 'efectivo',
      notas: 'Contado USD.',
    },
    {
      vehiculo_id: logan.id,
      vendedor_id: lucas.id,
      cliente_id: clientes[4]?.id || null,
      comprador_nombre: clientes[4]?.nombre || 'Marcelo Ríos',
      comprador_dni: clientes[4]?.dni || '27654321',
      comprador_telefono: clientes[4]?.telefono || '+5491166778899',
      precio_final: 9800,
      moneda_precio: 'USD',
      fecha_venta: monthsAgo(1),
      forma_pago: 'transferencia',
      notas: 'Venta rápida, precio negociado.',
    },
  ]
  const ventas = await insertFresh('con_ventas', ventasData)

  // ── 7. Financiamientos + Cuotas ────────────────────────────────────────────
  console.log('\n── Financiamientos')
  // Find the EcoSport venta (has cuotas) for venta_id FK
  const ventaEcosport = ventas.find(v => v.vehiculo_id === ecosport.id)
  const ventaVento    = ventas.find(v => v.vehiculo_id === vento.id)

  // Financiamiento 1 — al_dia (EcoSport), mix de cuotas
  const fin1Data = [{
    vehiculo_id: ecosport.id,
    venta_id: ventaEcosport?.id || null,
    cliente_id: clientes[2]?.id || null,
    vendedor_id: martin.id,
    tipo: 'concesionaria',
    monto_financiado: 7000,
    moneda: 'USD',
    cuotas_total: 12,
    cuota_monto: Math.round(7000 / 12),
    fecha_primera_cuota: monthsAgo(6),
    estado: 'al_dia',
    notas_seguimiento: 'Financiamiento concesionaria 12 cuotas. Cuota ~$583 USD.',
  }]
  const fins1 = await insertFresh('financiamientos', fin1Data)

  // Financiamiento 2 — cancelado (Vento) — fully paid
  const fin2Data = [{
    vehiculo_id: vento.id,
    venta_id: ventaVento?.id || null,
    cliente_id: clientes[0]?.id || null,
    vendedor_id: lucas.id,
    tipo: 'concesionaria',
    monto_financiado: 3000,
    moneda: 'USD',
    cuotas_total: 6,
    cuota_monto: Math.round(3000 / 6),
    fecha_primera_cuota: monthsAgo(8),
    estado: 'cancelado',
    notas_seguimiento: 'Financiamiento cancelado. Pagó todas las cuotas.',
  }]
  const fins2 = await insertFresh('financiamientos', fin2Data)

  // Cuotas para fin1 (activo) — mix de estados
  if (fins1.length && ventaEcosport) {
    const fin1Id = fins1[0].id
    const ventaId = ventaEcosport.id
    const montoCuota = Math.round(7000 / 12)
    const cuotas = []
    for (let i = 1; i <= 12; i++) {
      const fecha = new Date()
      fecha.setMonth(fecha.getMonth() - 6 + i)
      const iso = `${fecha.getFullYear()}-${String(fecha.getMonth()+1).padStart(2,'0')}-01`
      let estado = 'pendiente'
      if (i <= 4) estado = 'pagada'
      else if (i === 5) estado = 'vencida'
      cuotas.push({
        financiamiento_id: fin1Id,
        venta_id: ventaId,
        nro_cuota: i,
        total_cuotas: 12,
        monto: montoCuota,
        fecha_vencimiento: iso,
        estado,
        fecha_pago: estado === 'pagada' ? iso : null,
      })
    }
    console.log('\n── Cuotas (financiamiento 1)')
    await insertFresh('cuotas', cuotas)
  }

  // Cuotas para fin2 (cancelado) — todas pagadas
  if (fins2.length && ventaVento) {
    const fin2Id = fins2[0].id
    const ventaId = ventaVento.id
    const montoCuota = Math.round(3000 / 6)
    const cuotas = []
    for (let i = 1; i <= 6; i++) {
      const fecha = new Date()
      fecha.setMonth(fecha.getMonth() - 8 + i)
      const iso = `${fecha.getFullYear()}-${String(fecha.getMonth()+1).padStart(2,'0')}-01`
      cuotas.push({
        financiamiento_id: fin2Id,
        venta_id: ventaId,
        nro_cuota: i,
        total_cuotas: 6,
        monto: montoCuota,
        fecha_vencimiento: iso,
        estado: 'pagada',
        fecha_pago: iso,
      })
    }
    console.log('\n── Cuotas (financiamiento 2)')
    await insertFresh('cuotas', cuotas)
  }

  // ── 8. Gastos por vehículo ─────────────────────────────────────────────────
  console.log('\n── Gastos de vehículo')
  const gastosSrc = [
    { vehiculo_id: corolla.id,  tipo: 'patentamiento', descripcion: 'Patentamiento anual',                  monto: 85000,  moneda: 'ARS', fecha_gasto: daysAgo(40) },
    { vehiculo_id: corolla.id,  tipo: 'seguro',        descripcion: 'Seguro contra todo riesgo 1 mes',       monto: 42000,  moneda: 'ARS', fecha_gasto: daysAgo(38) },
    { vehiculo_id: tracker.id,  tipo: 'detailing',     descripcion: 'Detailing completo exterior/interior',  monto: 25000,  moneda: 'ARS', fecha_gasto: daysAgo(12) },
    { vehiculo_id: polo.id,     tipo: 'mecanica',      descripcion: 'Service de 40.000 km',                  monto: 60000,  moneda: 'ARS', fecha_gasto: daysAgo(25) },
    { vehiculo_id: polo.id,     tipo: 'patentamiento', descripcion: 'Patentamiento anual',                   monto: 78000,  moneda: 'ARS', fecha_gasto: daysAgo(28) },
    { vehiculo_id: hilux.id,    tipo: 'seguro',        descripcion: 'Seguro contra todo riesgo 1 mes',       monto: 95000,  moneda: 'ARS', fecha_gasto: daysAgo(18) },
    { vehiculo_id: logan.id,    tipo: 'mecanica',      descripcion: 'Frenos delanteros + amortiguadores',    monto: 45000,  moneda: 'ARS', fecha_gasto: daysAgo(8)  },
    { vehiculo_id: ecosport.id, tipo: 'detailing',     descripcion: 'Limpieza integral',                     monto: 18000,  moneda: 'ARS', fecha_gasto: daysAgo(55) },
  ]
  await insertFresh('gastos_vehiculo', gastosSrc)

  // ── 9. Config ──────────────────────────────────────────────────────────────
  console.log('\n── Config')
  const configRows = [
    { clave: 'tipo_cambio', valor: JSON.stringify({ valor: 1420 }) },
    { clave: 'wa_number',   valor: '5491162692000' },
  ]
  await upsert('config', configRows, 'clave')

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n✅ Seed completo!')
  console.log(`   Vendedores:      ${vendedores.length}`)
  console.log(`   Clientes:        ${clientes.length}`)
  console.log(`   Vehículos:       ${vehiculos.length}`)
  console.log(`   Prospectos:      ${prospectos.length}`)
  console.log(`   Ventas:          ${ventas.length}`)
  console.log(`   Financiamientos: ${fins1.length + fins2.length}`)
  console.log(`   Config entries:  ${configRows.length}`)
}

seed().catch(err => {
  console.error('\n❌ Error fatal:', err)
  process.exit(1)
})
