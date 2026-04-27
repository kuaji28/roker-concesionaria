# QA Audit — GH Cars Web
> Historial de auditorías del sistema React + Supabase.
> Actualizar en cada sesión de QA. Leer antes de reportar un bug (puede estar ya resuelto).

---

## Auditoría 2026-04-24

### Contexto
- Stack: React + Vite + Supabase
- Sesión completa de QA + bugfix + seed de datos demo

---

### BUGS RESUELTOS

#### 1. Reportes.jsx — null crash en getReportes()
**Síntoma:** crash de pantalla blanca cuando la query retornaba null
**Causa:** ausencia de null-guards en la respuesta de `getReportes()`
**Fix:** null-guards agregados + `.catch()` en el llamado
**Estado:** RESUELTO

#### 2. supabase.js — precio_lista faltaba en getVehiculos()
**Síntoma:** campo `precio_lista` undefined en componentes que lo mostraban
**Causa:** `precio_lista` omitido del SELECT en `getVehiculos()`
**Fix:** campo agregado al SELECT
**Estado:** RESUELTO

#### 3. Gerente.jsx — pantalla en blanco sin datos
**Síntoma:** pantalla en blanco completa cuando ambas secciones no tenían datos
**Causa:** sin empty states definidos
**Fix:** empty states agregados para ambas secciones
**Estado:** RESUELTO

#### 4. Dashboard.jsx — TC hardcodeado
**Síntoma:** tipo de cambio siempre 1415 sin importar la configuración
**Causa:** valor hardcodeado en el componente
**Fix:** ahora usa el hook `useTc()` para obtener el TC dinámico
**Estado:** RESUELTO

#### 5. Dashboard.jsx — "Ventas del mes" siempre mostraba "—"
**Síntoma:** métrica de ventas del mes nunca cargaba un valor
**Causa:** query no filtraba por mes actual
**Fix:** query a `con_ventas` filtrada por mes en curso
**Estado:** RESUELTO

#### 6. Gastos.jsx — import muerto updateVehiculoGastos
**Síntoma:** warning de import no usado
**Causa:** función `updateVehiculoGastos` importada pero no existente o no usada
**Fix:** import removido
**Estado:** RESUELTO

#### 7. Gastos.jsx — margen inflado en vehículos no vendidos
**Síntoma:** vehículos en stock mostraban datos de margen que no correspondían
**Causa:** cálculo de margen aplicado también a vehículos no vendidos
**Fix:** muestra "A la venta" en lugar de margen cuando el vehículo no está vendido
**Estado:** RESUELTO

#### 8. Mejoras.jsx — CSS inválido
**Síntoma:** error de CSS en consola, estilos no aplicados
**Causa:** `var(--c-accent)10` — sintaxis inválida de CSS
**Fix:** reemplazado con `rgba(99,102,241,0.08)`
**Estado:** RESUELTO

---

### BACKLOG ACTIVO (issues sin resolver al cierre de sesión)

| # | Archivo | Issue | Impacto | Prioridad |
|---|---------|-------|---------|-----------|
| B1 | `src/` ruta `/doc` | Pantalla placeholder — vinculada desde Dashboard quick actions y sidebar | Medio | P1 |
| B2 | Ventas | Sin historial — solo wizard de creación | Medio | P1 |
| B3 | `Buscar.jsx` | `wspVeh.whatsapp` no existe en schema `vehiculos` — link WA en modal presupuesto nunca renderiza | Bajo | P2 |
| B4 | `Agenda.jsx` | `handleGuardar` hace query Supabase directo sin pasar por supabase.js — errores silenciosos | Medio | P2 |
| B5 | Config | Cambio de PIN no requiere PIN actual — brecha de seguridad | Alto | P3 |
| B6 | Ingreso | Sin validación de fotos antes del step 3 | Bajo | P3 |
| B7 | Catálogo | Sin cambio bulk de estado — edición individual por vehículo | Bajo | P4 |
| B8 | Leads | Sin activity log por lead, sin opción de archivar/eliminar | Bajo | P4 |
| B9 | Clientes | Sin historial de compras visible, sin botón WA directo | Bajo | P4 |

---

### MEJORAS IMPLEMENTADAS

#### Mobile
- `DetallePublico`: ratio de fotos 16:9, CTA flotante de WhatsApp, layout de columna única, scroll horizontal de thumbnails
- `Sidebar`: menu hamburguesa en mobile
- Todas las pantallas: media queries CSS para viewport <768px

#### Componente WhatsAppIcon
- Archivo: `src/components/WhatsAppIcon.jsx`
- Variantes disponibles:
  - `white` — para usar dentro de botones con color de fondo
  - `brand` — color #25D366, para usar sobre fondos oscuros
  - `muted` — hereda el color del texto circundante
- Integrado en: CatalogoPublico, DetallePublico, Leads kanban, Detalle interno, Vendedores list

---

### DATOS DE DEMO

**Seed aplicado:** 2026-04-24

| Entidad | Cantidad |
|---------|---------|
| Vendedores | 4 |
| Clientes | 9 |
| Vehículos | 8 |
| Prospectos/Leads | 10 |
| Ventas | 5 (últimos 5 meses) |
| Financiamientos | 2 |
| Cuotas | 18 |
| Gastos | 8 |

**Script de seed:** `src/scripts/seed-demo.js`
- Re-sembrar: `node src/scripts/seed-demo.js`
- Resetear y re-sembrar: `node src/scripts/seed-demo.js --clear`

**Nota RLS:** La tabla `cuotas` tiene Row Level Security bloqueando inserts anónimos. Si las cuotas no se crean via el script, insertarlas manualmente desde el dashboard de Supabase.

---

### REFERENCIAS — MEJORES PRACTICAS DE INDUSTRIA

#### KPIs que debe tener el Dashboard Gerente

| KPI | Descripcion |
|-----|-------------|
| Units Sold MTD | Unidades vendidas en el mes |
| Gross Profit MTD | Ganancia bruta del mes |
| Avg Days to Sell | Promedio de dias para vender un vehiculo |
| Inventory Turn Rate | Rotacion de inventario |
| Lead Conversion Rate | % de leads que se convierten en ventas |
| Aged Inventory | Alertas por vehiculos en stock hace 30 / 45 / 60 dias |
| Leaderboard vendedores | Ranking del mes |

#### Pipeline de ventas recomendado
```
nuevo
  → contactado
    → cita_agendada
      → cita_asistida
        → test_drive
          → oferta
            → negociacion
              → financiamiento
                → cerrado_ganado
                → cerrado_perdido
```

#### Tiers de mora para Cobranza

| Rango | Clasificacion |
|-------|--------------|
| 1-7 dias | Late |
| 8-14 dias | Delinquent |
| 15-29 dias | Seriously Delinquent |
| 30+ dias | Default Risk |

Obligatorio: Promise-to-pay tracking (registrar cuando el cliente prometio pagar).

#### Reportes de mayor valor
- P&L mensual
- Rotacion de inventario
- Performance por vendedor
- Gross margin por vehiculo

#### Regla UX
Las acciones primarias deben ser alcanzables en 1-2 clicks en mobile. Verificar en cada feature nueva.

---

*Proxima auditoria: verificar items B1-B9 del backlog activo.*
