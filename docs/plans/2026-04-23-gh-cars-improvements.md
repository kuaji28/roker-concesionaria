# GH Cars — Plan de Mejoras Completo (con investigación de industria)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completar el sistema GH Cars con gestión profesional de archivos, flujo real de ingreso de vehículos, documentación legal argentina, alertas automáticas de vencimientos, visitas/agenda y todos los módulos que tienen los sistemas líderes del mercado.

**Architecture:** React 18 + Vite frontend en Vercel. FastAPI en Fly.io. Supabase PostgreSQL + **Supabase Storage** para fotos (reemplaza Google Drive para fotos). Google Drive solo para documentos PDF/contractuales. Sin librerías nuevas excepto donde se indique.

**Stack:** React 18, React Router v6, @supabase/supabase-js v2, FastAPI, google-generativeai, google-auth (Drive SA), httpx.

---

## INVESTIGACIÓN DE INDUSTRIA — Lo que aprendimos

### Cómo manejan los archivos los sistemas profesionales

Después de investigar AutoSite (AR), deConcesionarias (AR), Dealcar (ES), Docupile, DealerTrack y carpixai:

**La arquitectura correcta es HÍBRIDA — no todo en Drive:**

| Tipo de archivo | Dónde va | Por qué |
|----------------|----------|---------|
| **Fotos del vehículo** | **Supabase Storage** | Acceso directo desde la app, URLs públicas, transformaciones de imagen (resize/compress), sin fricción con OAuth. Google Drive requiere auth y no sirve imágenes directamente. |
| **Documentos del vehículo** (VTV, cédula, dominio, prendas, Formulario 08) | **Google Drive** (Service Account) | Los documentos son PDFs que el dueño ya tiene en Drive, necesitan compartirse fácilmente, se imprimen y se mandan por WhatsApp. |
| **Contratos de venta** | **Google Drive** + copia local | Documentos legales, requieren firma y archivado permanente. |
| **Fotos de clientes** (DNI, comprobantes) | **Supabase Storage** | Efímero, solo para OCR. No necesita persistencia larga. |

**Google Drive actual en el Streamlit tiene un problema crítico:** Drive no sirve imágenes directamente — hay que hacer un redirect con autenticación. En React esto rompe el `<img src="">`. Por eso las fotos deben estar en Supabase Storage.

### El flujo real de ingreso de un vehículo (industria estándar)

Los mejores sistemas (vAuto, Carketa, CarpixAI) definen este flujo:

```
ADQUISICIÓN → INSPECCIÓN → REACONDICIONAMIENTO → FOTOGRAFÍA → PUBLICACIÓN → VENTA
```

**Tiempo objetivo:** menos de 5 días desde que llega el auto hasta que está publicado online.

**Checklist estándar de fotos (shot list):**
1. Frente 3/4 izquierda (la más importante — foto de portada)
2. Frente 3/4 derecha
3. Lateral izquierdo
4. Lateral derecho
5. Trasero 3/4
6. Interior — tablero / cockpit
7. Asientos delanteros
8. Asientos traseros
9. Baúl / maletero
10. Odómetro (km)
11. Llantas / ruedas
12. Motor

**Mínimo aceptable:** 8 fotos. Óptimo: 12-20. Con 360°: mucho mejor.

### Documentación legal obligatoria en Argentina

Para transferir un auto en Argentina (DNRPA) se necesita:
- **Cédula verde** (del titular actual)
- **Título de propiedad** (con datos del auto)
- **Verificación policial** (Formulario 08 — certificado de no robo)
- **VTV al día** (obligatorio para la transferencia)
- **Libre deuda de patente** (aunque DNU 2025 lo flexibilizó, los registros aún lo piden)
- **Libre deuda de multas**

**VTV — tabla de vencimientos por último número de patente (Buenos Aires 2026):**
| Último número patente | Mes de vencimiento |
|----------------------|-------------------|
| 0 | Octubre |
| 1 | Noviembre |
| 2 | Febrero |
| 3 | Marzo |
| 4 | Abril |
| 5 | Mayo |
| 6 | Junio |
| 7 | Julio |
| 8 | Agosto |
| 9 | Septiembre |

**Patente (impuesto automotor) — vencimientos 2026 PBA:**
| Cuota | Vencimiento |
|-------|-------------|
| 1 (o anual) | 10/03 |
| 2 | 09/04 |
| 3 | 07/05 |
| 4 | 09/06 |
| 5 | 08/07 |
| 6 | 11/08 |
| 7 | 10/09 |
| 8 | 09/10 |
| 9 | 10/11 |
| 10 | 10/12 |

### Lo que tienen los sistemas top que GH Cars no tiene

| Módulo | AutoSite AR | deConcesionarias AR | Dealcar ES | GH Cars hoy |
|--------|-------------|---------------------|------------|-------------|
| Multipublicador (ML, FB, OLX) | ✅ | ✅ | ✅ | ❌ |
| Foto guiada con shot list | ✅ | - | ✅ | ❌ |
| Flujo de estados con recon | ✅ | - | ✅ | Parcial |
| Alertas VTV/patente | ✅ | ✅ | - | ❌ |
| Costo real por unidad (margen) | ✅ | ✅ | ✅ | Parcial |
| Historial completo de la unidad | ✅ | ✅ | ✅ | ❌ |
| Agenda / pruebas de manejo | ✅ | - | ✅ | ❌ |
| Catálogo web público | ✅ | ✅ | ✅ | ❌ |
| Contratos auto-generados PDF | ✅ | - | ✅ | ❌ |
| Fotos en cloud con CDN | ✅ | ✅ | ✅ | ❌ (Drive) |
| Documentos por vehículo | ✅ | ✅ | ✅ | Parcial |

---

## MAPA COMPLETO DE MÓDULOS — Estado actual vs. objetivo

```
MÓDULO                          STREAMLIT   REACT HOY   OBJETIVO
─────────────────────────────────────────────────────────────────
Inventario / Catálogo           ✅           ✅           ✅
Ingreso de vehículo             ✅           ✅           +fotos+flujo
Detalle de vehículo             ✅           ✅           +chips+desc+docs
Fotos (storage)                 Drive        Drive        Supabase Storage
Documentos por vehículo         ✅           Básico       +alertas vencim.
Ventas (contado/cuotas/parte)   ✅           ✅           OK
Cobranza / cuotas               ✅           ✅           +seguimiento
Reportes / métricas             ✅           ✅           +margen por unidad
CRM / Leads                     ✅           ✅           OK
Clientes                        ✅           ✅           +historial
Vendedores                      ✅           ✅           OK
Configuración / PIN             ✅           ✅           OK
Specs / equipamiento            30+ campos   ~5 campos    30+ campos ← CRÍTICO
Ubicación del vehículo          ✅           ❌           +badge+cambio
Branding GH Cars                ❌ (Roker)   Parcial      GH Cars everywhere
─────────────────────────────────────────────────────────────────
NUEVO — No existe en ninguna versión:
Flujo de recon (estados finos)  ❌           ❌           + T-NUEVO
Shot list guiado para fotos     ❌           ❌           + T-NUEVO
Alertas vencimientos (VTV/pat)  ❌           ❌           + T-NUEVO
Agenda / pruebas de manejo      Básico       ❌           + T-NUEVO
Timeline / historial unidad     Básico       ❌           + T-NUEVO
Multipublicador (ML publish)    Básico       ❌           + Futuro
Catálogo web público            ✅           ❌           + Futuro
Contratos PDF                   ❌           ❌           + Futuro
Supabase Storage (fotos)        ❌           ❌           + T-NUEVO ← ARQUITECTURA
Seguimiento clientes bancarios  ❌           ❌           + T7
─────────────────────────────────────────────────────────────────
```

---

## ORDEN DE EJECUCIÓN (por impacto + dependencias)

```
GRUPO 1 — Bugs críticos (sin dependencias, hacer primero):
  Task 8: Fix hook violation Detalle.jsx
  Task 9: TC dinámico en App.jsx
  Task 2: Branding GH Cars (grep + replace)

GRUPO 2 — Arquitectura de archivos (base para todo lo demás):
  Task 1: Migration SQL v7 (ubicacion, descripcion_publica, seguimientos,
           historial_estados, agenda, documentacion extendida)
  Task-STORAGE: Migrar fotos a Supabase Storage (CRÍTICO — reemplaza Drive para fotos)

GRUPO 3 — Features core (la parte visible y más usada):
  Task 3: Panel equipamiento completo en Ingreso (30+ campos)
  Task 4: Campo ubicacion en Catalogo y Detalle
  Task-FLUJO: Flujo de recon + estados finos del vehículo
  Task-FOTOS: Shot list guiado en Ingreso (12 fotos estándar)

GRUPO 4 — Inteligencia y alertas:
  Task 5: AI specs publication-ready (descripción ML + chips en Detalle)
  Task-ALERTAS: Dashboard de alertas VTV/patente/documentos
  Task-HISTORIAL: Timeline de la unidad en Detalle

GRUPO 5 — CRM avanzado:
  Task 7: Seguimiento trimestral clientes bancarios
  Task-AGENDA: Pruebas de manejo y agenda

GRUPO 6 — Infraestructura manual (requiere acción de Roker):
  Task 6: Drive para documentos PDF (Service Account)
  Task 10: Actualizar docs ORQUESTA.md
```

---

## Task 1: Migration SQL v7 — schema completo

**Files:**
- Create: `gh-cars-web/docs/migrations/migration_v7.sql`

- [ ] **Step 1: Crear el archivo SQL completo**

```sql
-- ============================================================
-- MIGRATION v7 — GH Cars — Mejoras completas
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. VEHICULOS — campos faltantes
ALTER TABLE vehiculos
  ADD COLUMN IF NOT EXISTS ubicacion TEXT DEFAULT 'showroom',
  -- valores: 'showroom' | 'taller' | 'cochera' | 'traslado' | 'cliente'
  ADD COLUMN IF NOT EXISTS descripcion_publica TEXT,
  ADD COLUMN IF NOT EXISTS drive_folder_id TEXT,
  ADD COLUMN IF NOT EXISTS estado_recon TEXT DEFAULT 'ingresado';
  -- 'ingresado' | 'inspeccion' | 'mecanica' | 'detailing' | 'fotos_pendientes' | 'listo' | 'publicado'

-- 2. MEDIA — migrar a Supabase Storage
-- La tabla media ya existe. Agregar campo para storage path.
ALTER TABLE media
  ADD COLUMN IF NOT EXISTS storage_path TEXT,
  -- path en Supabase Storage: "vehiculos/{id}/fotos/{filename}"
  ADD COLUMN IF NOT EXISTS storage_bucket TEXT DEFAULT 'vehiculos',
  ADD COLUMN IF NOT EXISTS tipo_shot TEXT;
  -- 'frente_3_4_izq' | 'frente_3_4_der' | 'lateral_izq' | 'lateral_der' |
  -- 'trasero_3_4' | 'tablero' | 'asientos_del' | 'asientos_tras' |
  -- 'baul' | 'odometro' | 'llantas' | 'motor' | 'extra'

-- 3. DOCUMENTACION — extender con alertas
ALTER TABLE documentacion
  ADD COLUMN IF NOT EXISTS vtv_vencimiento_calculado DATE,
  -- se calcula automáticamente desde patente usando la tabla de vencimientos
  ADD COLUMN IF NOT EXISTS patente_proxima_cuota DATE,
  ADD COLUMN IF NOT EXISTS patente_deuda_estimada NUMERIC,
  ADD COLUMN IF NOT EXISTS alerta_vtv_enviada BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS alerta_patente_enviada BOOLEAN DEFAULT FALSE;

-- 4. HISTORIAL DE ESTADOS (timeline de la unidad)
CREATE TABLE IF NOT EXISTS vehiculos_historial (
  id SERIAL PRIMARY KEY,
  vehiculo_id INTEGER REFERENCES vehiculos(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  -- 'estado_cambio' | 'ingreso' | 'foto_agregada' | 'doc_subido' |
  -- 'venta' | 'seña' | 'lead' | 'prueba_manejo' | 'publicado' |
  -- 'precio_cambio' | 'ubicacion_cambio' | 'gasto' | 'nota'
  descripcion TEXT NOT NULL,
  datos_extra JSONB DEFAULT '{}',
  -- ej: {"estado_anterior": "disponible", "estado_nuevo": "señado", "precio_anterior": 15000}
  vendedor_id UUID REFERENCES vendedores(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_historial_vehiculo ON vehiculos_historial(vehiculo_id, created_at DESC);
ALTER TABLE vehiculos_historial ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role full access historial"
  ON vehiculos_historial FOR ALL USING (true);

-- 5. AGENDA / TURNOS
CREATE TABLE IF NOT EXISTS agenda (
  id SERIAL PRIMARY KEY,
  tipo TEXT NOT NULL DEFAULT 'prueba_manejo',
  -- 'prueba_manejo' | 'entrega' | 'servicio' | 'visita' | 'llamada'
  vehiculo_id INTEGER REFERENCES vehiculos(id) ON DELETE SET NULL,
  prospecto_id INTEGER REFERENCES prospectos(id) ON DELETE SET NULL,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  vendedor_id UUID REFERENCES vendedores(id),
  titulo TEXT,
  fecha DATE NOT NULL,
  hora TIME,
  duracion_min INTEGER DEFAULT 60,
  estado TEXT DEFAULT 'programado',
  -- 'programado' | 'confirmado' | 'realizado' | 'cancelado' | 'no_asistio'
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agenda_fecha ON agenda(fecha, estado);
CREATE INDEX IF NOT EXISTS idx_agenda_vehiculo ON agenda(vehiculo_id);
ALTER TABLE agenda ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role full access agenda"
  ON agenda FOR ALL USING (true);

-- 6. SEGUIMIENTOS (follow-up clientes financiados)
CREATE TABLE IF NOT EXISTS seguimientos (
  id SERIAL PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  venta_id INTEGER REFERENCES con_ventas(id) ON DELETE SET NULL,
  tipo TEXT DEFAULT 'financiamiento',
  -- 'financiamiento' | 'prospecto' | 'posventa' | 'recupero'
  estado TEXT DEFAULT 'pendiente',
  -- 'pendiente' | 'contactado' | 'sin_respuesta' | 'resuelto' | 'recupero_iniciado'
  fecha_programada DATE NOT NULL,
  fecha_contacto DATE,
  canal TEXT DEFAULT 'whatsapp',
  notas TEXT,
  mensaje_enviado TEXT,
  vendedor_id UUID REFERENCES vendedores(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seguimientos_fecha ON seguimientos(fecha_programada, estado);
CREATE INDEX IF NOT EXISTS idx_seguimientos_cliente ON seguimientos(cliente_id);
ALTER TABLE seguimientos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role full access seguimientos"
  ON seguimientos FOR ALL USING (true);

-- 7. SPECS GIN index para búsqueda por equipamiento
CREATE INDEX IF NOT EXISTS idx_vehiculos_specs ON vehiculos USING GIN (specs);

-- 8. Verificación
SELECT
  (SELECT count(*) FROM information_schema.columns
    WHERE table_name='vehiculos' AND column_name='ubicacion') AS col_ubicacion,
  (SELECT count(*) FROM information_schema.columns
    WHERE table_name='vehiculos' AND column_name='estado_recon') AS col_recon,
  (SELECT count(*) FROM information_schema.columns
    WHERE table_name='media' AND column_name='storage_path') AS col_storage_path,
  (SELECT count(*) FROM information_schema.tables
    WHERE table_name='vehiculos_historial') AS tabla_historial,
  (SELECT count(*) FROM information_schema.tables
    WHERE table_name='agenda') AS tabla_agenda,
  (SELECT count(*) FROM information_schema.tables
    WHERE table_name='seguimientos') AS tabla_seguimientos;
```

- [ ] **Step 2: Commit**

```bash
cd sistemas/concesionaria/gh-cars-web
mkdir -p docs/migrations
git add docs/migrations/migration_v7.sql
git commit -m "feat: migration_v7 — ubicacion, recon, storage, historial, agenda, seguimientos"
```

> ⚠️ ACCIÓN MANUAL DE ROKER: Ejecutar en https://supabase.com/dashboard/project/zjrabazzvckvxhufppoa/sql

---

## Task 2: Branding — reemplazar "Roker" → "GH Cars"

**Files:** todos los `.jsx` con referencia a "Roker"

- [ ] **Step 1: Buscar todas las referencias**

```bash
cd sistemas/concesionaria/gh-cars-web
grep -ri "roker" src/ --include="*.jsx" --include="*.js" --include="*.html" -l
grep -ri "roker" index.html package.json
```

- [ ] **Step 2: Reemplazar en cada archivo**

Patrones:
- `"Concesionaria Roker"` → `"GH Cars"`
- `"Roker"` (standalone en UI) → `"GH Cars"`
- `<title>` en index.html → `<title>GH Cars — Sistema de Gestión</title>`
- `"name": "roker-..."` en package.json → `"name": "gh-cars-web"`

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "brand: reemplazar Roker → GH Cars en toda la app"
```

---

## Task-STORAGE: Migrar fotos a Supabase Storage

**Este es el cambio arquitectural más importante.**

### Por qué Google Drive NO sirve para fotos en React

Google Drive no genera URLs públicas directas para imágenes. Para mostrar una foto de Drive en un `<img src="">`, necesitás un redirect autenticado. Esto rompe en producción porque:
1. El navegador no puede acceder a Drive directamente
2. Cada foto necesita autenticación OAuth separada
3. Los thumbnails de Drive no tienen CDN

### La solución: Supabase Storage

Supabase Storage genera URLs públicas permanentes, soporta transformaciones de imagen (resize, compress), tiene CDN integrado y se integra directamente con el cliente Supabase que ya tenemos.

**Files:**
- Modify: `gh-cars-web/src/lib/supabase.js`
- Modify: `gh-cars-web/src/screens/Ingreso.jsx` — reemplazar upload de foto
- Modify: `gh-cars-web/src/screens/Detalle.jsx` — mostrar fotos desde Storage

> ⚠️ ACCIÓN MANUAL DE ROKER (antes del code): Crear bucket en Supabase Dashboard
> 1. Ir a https://supabase.com/dashboard/project/zjrabazzvckvxhufppoa/storage/buckets
> 2. Crear bucket llamado `vehiculos`
> 3. Marcarlo como **Public** (para que las URLs funcionen sin auth)
> 4. En Policies: permitir SELECT para `anon` y ALL para `service_role`

- [ ] **Step 1: Agregar helpers de Storage en supabase.js**

```js
// En src/lib/supabase.js, agregar:

const STORAGE_BUCKET = 'vehiculos'

/**
 * Sube una foto de vehículo a Supabase Storage.
 * path: "vehiculos/{vehiculoId}/fotos/{filename}"
 * Retorna la URL pública.
 */
export async function uploadFotoVehiculo(vehiculoId, file, tipoShot = 'extra') {
  const ext = file.name.split('.').pop()
  const filename = `${tipoShot}_${Date.now()}.${ext}`
  const path = `vehiculos/${vehiculoId}/fotos/${filename}`

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path)

  return { url: publicUrl, path, tipoShot }
}

/**
 * Sube un documento (PDF) de vehículo a Supabase Storage.
 * Retorna la URL pública.
 */
export async function uploadDocVehiculo(vehiculoId, file, tipoDoc = 'otro') {
  const ext = file.name.split('.').pop()
  const filename = `${tipoDoc}_${Date.now()}.${ext}`
  const path = `vehiculos/${vehiculoId}/docs/${filename}`

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path)

  return { url: publicUrl, path, tipoDoc }
}

/**
 * Guarda registro de media en la tabla 'media' vinculado al vehículo.
 */
export async function saveFotoRecord(vehiculoId, { url, path, tipoShot }, esPortada = false) {
  const { data, error } = await supabase.from('media').insert([{
    vehiculo_id: vehiculoId,
    tipo: 'foto',
    url,
    storage_path: path,
    storage_bucket: 'vehiculos',
    tipo_shot: tipoShot,
    es_portada: esPortada,
  }]).select().single()
  if (error) throw error
  return data
}

/**
 * Obtiene todas las fotos de un vehículo.
 */
export async function getFotosVehiculo(vehiculoId) {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('vehiculo_id', vehiculoId)
    .eq('tipo', 'foto')
    .order('es_portada', { ascending: false })
    .order('orden', { ascending: true })
  if (error) throw error
  return data || []
}

/**
 * Elimina una foto del Storage y de la tabla media.
 */
export async function deleteFotoVehiculo(mediaId, storagePath) {
  if (storagePath) {
    await supabase.storage.from(STORAGE_BUCKET).remove([storagePath])
  }
  await supabase.from('media').delete().eq('id', mediaId)
}
```

- [ ] **Step 2: Crear componente ShotListUploader en Ingreso.jsx**

El shot list guiado es la feature clave. Muestra las 12 posiciones estándar, indica cuáles faltan, y permite subir cada una.

```jsx
const SHOT_LIST = [
  { key: 'frente_3_4_izq',  label: 'Frente 3/4 Izq.',   desc: 'Desde adelante-izquierda',   required: true },
  { key: 'frente_3_4_der',  label: 'Frente 3/4 Der.',   desc: 'Desde adelante-derecha',     required: true },
  { key: 'lateral_izq',     label: 'Lateral Izq.',      desc: 'Costado izquierdo completo', required: true },
  { key: 'lateral_der',     label: 'Lateral Der.',      desc: 'Costado derecho completo',   required: true },
  { key: 'trasero_3_4',     label: 'Trasero 3/4',       desc: 'Desde atrás en ángulo',      required: true },
  { key: 'tablero',         label: 'Tablero',           desc: 'Cockpit y volante',           required: true },
  { key: 'asientos_del',    label: 'Asientos Del.',     desc: 'Asientos delanteros',        required: false },
  { key: 'asientos_tras',   label: 'Asientos Tras.',    desc: 'Asientos traseros',          required: false },
  { key: 'baul',            label: 'Baúl / Maletero',  desc: 'Interior del baúl abierto',  required: false },
  { key: 'odometro',        label: 'Odómetro',          desc: 'Instrumento de km',          required: false },
  { key: 'llantas',         label: 'Llantas',           desc: 'Rueda delantera o trasera',  required: false },
  { key: 'motor',           label: 'Motor',             desc: 'Capot abierto, motor',       required: false },
]

function ShotListUploader({ vehiculoId, fotos = [], onFotoAgregada }) {
  const [uploading, setUploading] = useState({})
  const fotosPorShot = fotos.reduce((acc, f) => { acc[f.tipo_shot] = f; return acc }, {})
  const totalSubidas = fotos.length
  const requeridosOk = SHOT_LIST.filter(s => s.required).every(s => fotosPorShot[s.key])

  async function handleFile(shot, file) {
    if (!file) return
    setUploading(prev => ({ ...prev, [shot.key]: true }))
    try {
      const result = await uploadFotoVehiculo(vehiculoId, file, shot.key)
      const esPortada = shot.key === 'frente_3_4_izq'
      await saveFotoRecord(vehiculoId, result, esPortada)
      onFotoAgregada?.()
    } catch (e) {
      alert('Error subiendo foto: ' + e.message)
    } finally {
      setUploading(prev => ({ ...prev, [shot.key]: false }))
    }
  }

  return (
    <div>
      {/* Barra de progreso */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 6, background: 'var(--c-surface-2)', borderRadius: 3 }}>
          <div style={{
            height: '100%', borderRadius: 3,
            width: `${Math.min(100, (totalSubidas / SHOT_LIST.length) * 100)}%`,
            background: requeridosOk ? 'var(--c-success, #22c55e)' : 'var(--c-accent)',
            transition: 'width .3s',
          }} />
        </div>
        <span style={{ fontSize: 12, color: 'var(--c-fg-3)', whiteSpace: 'nowrap' }}>
          {totalSubidas}/{SHOT_LIST.length} fotos
        </span>
        {requeridosOk && (
          <span style={{ fontSize: 11, color: 'var(--c-success, #22c55e)', fontWeight: 600 }}>
            ✓ Mínimas OK
          </span>
        )}
      </div>

      {/* Grid de shots */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {SHOT_LIST.map(shot => {
          const foto = fotosPorShot[shot.key]
          const loading = uploading[shot.key]
          return (
            <label key={shot.key} style={{
              border: `2px dashed ${foto ? 'var(--c-accent)' : 'var(--c-border)'}`,
              borderRadius: 8, overflow: 'hidden', cursor: 'pointer',
              aspectRatio: '4/3', position: 'relative',
              background: foto ? 'transparent' : 'var(--c-surface-2)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <input
                type="file" accept="image/*" capture="environment"
                style={{ display: 'none' }}
                onChange={e => handleFile(shot, e.target.files?.[0])}
              />
              {foto ? (
                <>
                  <img src={foto.url} alt={shot.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'rgba(0,0,0,.6)', fontSize: 10, padding: '3px 6px',
                    color: '#fff',
                  }}>
                    ✓ {shot.label}
                  </div>
                </>
              ) : loading ? (
                <div style={{ fontSize: 11, color: 'var(--c-fg-3)' }}>Subiendo…</div>
              ) : (
                <>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>📷</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--c-fg-2)', textAlign: 'center', padding: '0 6px' }}>
                    {shot.label}
                    {shot.required && <span style={{ color: 'var(--c-accent)' }}> *</span>}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--c-fg-3)', textAlign: 'center', padding: '0 6px' }}>
                    {shot.desc}
                  </div>
                </>
              )}
            </label>
          )
        })}
      </div>
      <div style={{ fontSize: 11, color: 'var(--c-fg-3)', marginTop: 8 }}>
        * Obligatorias para publicar. Toca cada casilla para subir o reemplazar.
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Integrar ShotListUploader en Ingreso y en Detalle**

En Ingreso.jsx: mostrar el ShotListUploader en el paso de fotos (después de guardar el vehículo).
En Detalle.jsx: tab "Fotos" muestra el ShotListUploader con las fotos ya cargadas + botón para agregar más.

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase.js src/screens/Ingreso.jsx src/screens/Detalle.jsx
git commit -m "feat: Supabase Storage para fotos — shot list guiado 12 posiciones estándar"
```

---

## Task 3: Panel completo de equipamiento en Ingreso.jsx

**Files:**
- Modify: `gh-cars-web/src/screens/Ingreso.jsx`

La estructura de equipamiento va al campo `specs JSONB`. 30+ campos en 4 categorías: Técnico, Climatización, Multimedia, Confort, Seguridad.

- [ ] **Step 1: Leer Ingreso.jsx completo para entender los steps existentes**

- [ ] **Step 2: Agregar componente StepEquipamiento**

```jsx
const SPECS_DEFAULTS = {
  // Técnico
  potencia_hp: null, torque_nm: null, cilindros: null,
  vel_max_kmh: null, aceleracion_0_100: null,
  tanque_litros: null, consumo_mixto: null, peso_kg: null,
  // Climatización
  climatizacion: 'sin_ac',
  // Multimedia
  pantalla_pulg: null, apple_carplay: false, android_auto: false,
  carga_inalambrica: false, bluetooth: true, gps_integrado: false,
  // Confort
  faros: 'halógenos', tapizado: 'tela',
  asientos_calefaccionados: false, asientos_electricos: false,
  vidrios_electricos: 4, cierre_centralizado: true,
  techo_solar: false, techo_panoramico: false,
  llantas_aleacion: false, alarma: false,
  arranque_sin_llave: false, freno_mano_electrico: false,
  // Seguridad
  airbags: 2, camara_retroceso: 'no',
  sensores_estacionamiento: 'ninguno',
  abs: true, esp: false, control_crucero: false,
  crucero_adaptativo: false, hud: false, frenado_autonomo: false,
}

function StepEquipamiento({ specs, setSpecs }) {
  const s = { ...SPECS_DEFAULTS, ...specs }
  const upd = (k, v) => setSpecs(prev => ({ ...SPECS_DEFAULTS, ...prev, [k]: v }))
  const f = (k) => (e) => {
    const v = e.target.type === 'number' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value
    upd(k, v)
  }
  const bool = (k) => (e) => upd(k, e.target.value === 'si')

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-accent)', marginBottom: 10,
        textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid var(--c-border)', paddingBottom: 6 }}>
        {title}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
        {children}
      </div>
    </div>
  )

  const Sel = ({ label, k, opts }) => (
    <FormField label={label}>
      <select className="input" value={s[k] ?? ''} onChange={f(k)}>
        {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </FormField>
  )

  const Num = ({ label, k, placeholder }) => (
    <FormField label={label}>
      <input className="input" type="number" placeholder={placeholder} value={s[k] ?? ''} onChange={f(k)} />
    </FormField>
  )

  const Bool = ({ label, k }) => (
    <FormField label={label}>
      <select className="input" value={s[k] ? 'si' : 'no'} onChange={bool(k)}>
        <option value="no">No</option>
        <option value="si">Sí</option>
      </select>
    </FormField>
  )

  return (
    <div>
      <Section title="Métricas técnicas">
        <Num label="Potencia (HP)" k="potencia_hp" placeholder="150" />
        <Num label="Torque (Nm)" k="torque_nm" placeholder="300" />
        <Num label="Cilindros" k="cilindros" placeholder="4" />
        <Num label="Vel. máx (km/h)" k="vel_max_kmh" placeholder="200" />
        <Num label="0-100 km/h (seg)" k="aceleracion_0_100" placeholder="8.5" />
        <Num label="Tanque (litros)" k="tanque_litros" placeholder="60" />
        <Num label="Consumo mixto (L/100km)" k="consumo_mixto" placeholder="7.5" />
        <Num label="Peso (kg)" k="peso_kg" placeholder="1350" />
      </Section>

      <Section title="Climatización">
        <Sel label="Aire acondicionado" k="climatizacion" opts={[
          ['sin_ac','Sin A/C'],['manual','Manual'],['automatico','Automático'],['bizona','Bizona']
        ]} />
      </Section>

      <Section title="Multimedia y conectividad">
        <Num label="Pantalla (pulgadas)" k="pantalla_pulg" placeholder="8" />
        <Bool label="Apple CarPlay" k="apple_carplay" />
        <Bool label="Android Auto" k="android_auto" />
        <Bool label="Carga inalámbrica" k="carga_inalambrica" />
        <Bool label="Bluetooth" k="bluetooth" />
        <Bool label="GPS integrado" k="gps_integrado" />
      </Section>

      <Section title="Confort">
        <Sel label="Faros" k="faros" opts={[
          ['halógenos','Halógenos'],['led','LED'],['full_led','Full LED'],['xenon','Xenón'],['laser','Láser']
        ]} />
        <Sel label="Tapizado" k="tapizado" opts={[
          ['tela','Tela'],['semicuero','Semicuero'],['cuero','Cuero'],['alcantara','Alcántara']
        ]} />
        <Bool label="Asientos calefaccionados" k="asientos_calefaccionados" />
        <Bool label="Asientos eléctricos" k="asientos_electricos" />
        <Sel label="Vidrios eléctricos" k="vidrios_electricos" opts={[['0','No'],['2','2 delanteros'],['4','4 — todos']]} />
        <Bool label="Cierre centralizado" k="cierre_centralizado" />
        <Bool label="Techo solar" k="techo_solar" />
        <Bool label="Techo panorámico" k="techo_panoramico" />
        <Bool label="Llantas de aleación" k="llantas_aleacion" />
        <Bool label="Alarma" k="alarma" />
        <Bool label="Arranque sin llave (Keyless)" k="arranque_sin_llave" />
        <Bool label="Freno de mano eléctrico" k="freno_mano_electrico" />
      </Section>

      <Section title="Seguridad activa">
        <Num label="Airbags (cantidad)" k="airbags" placeholder="6" />
        <Sel label="Cámara de retroceso" k="camara_retroceso" opts={[
          ['no','No'],['trasera','Trasera'],['360','360°']
        ]} />
        <Sel label="Sensores estacionamiento" k="sensores_estacionamiento" opts={[
          ['ninguno','Ninguno'],['traseros','Traseros'],['delanteros_traseros','Del. + Tras.']
        ]} />
        <Bool label="ABS" k="abs" />
        <Bool label="ESP / Control estabilidad" k="esp" />
        <Bool label="Control de crucero" k="control_crucero" />
        <Bool label="Crucero adaptativo (ACC)" k="crucero_adaptativo" />
        <Bool label="HUD (display parabrisas)" k="hud" />
        <Bool label="Frenado autónomo de emergencia" k="frenado_autonomo" />
      </Section>

      {/* Resumen chips */}
      <div style={{ background: 'var(--c-surface-2)', borderRadius: 8, padding: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--c-fg-3)', marginBottom: 8 }}>
          EQUIPAMIENTO DESTACADO
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {s.apple_carplay && <span className="chip chip--accent">Apple CarPlay</span>}
          {s.android_auto && <span className="chip chip--accent">Android Auto</span>}
          {s.climatizacion === 'automatico' && <span className="chip chip--accent">A/C Automático</span>}
          {s.climatizacion === 'bizona' && <span className="chip chip--accent">A/C Bizona</span>}
          {s.techo_solar && <span className="chip chip--accent">Techo Solar</span>}
          {s.techo_panoramico && <span className="chip chip--accent">Techo Panorámico</span>}
          {s.tapizado === 'cuero' && <span className="chip chip--accent">Tapizado Cuero</span>}
          {s.tapizado === 'semicuero' && <span className="chip chip--accent">Tapizado Semicuero</span>}
          {s.camara_retroceso !== 'no' && <span className="chip chip--accent">Cámara Retroceso</span>}
          {s.sensores_estacionamiento !== 'ninguno' && <span className="chip chip--accent">Sensores Parking</span>}
          {s.arranque_sin_llave && <span className="chip chip--accent">Keyless Entry</span>}
          {s.faros === 'full_led' && <span className="chip chip--accent">Full LED</span>}
          {s.crucero_adaptativo && <span className="chip chip--accent">Crucero Adaptativo</span>}
          {s.carga_inalambrica && <span className="chip chip--accent">Carga Inalámbrica</span>}
          {s.abs && <span className="chip chip--accent">ABS</span>}
          {s.esp && <span className="chip chip--accent">ESP</span>}
          {s.airbags > 0 && <span className="chip chip--accent">{s.airbags} Airbags</span>}
          {s.llantas_aleacion && <span className="chip chip--accent">Llantas Aleación</span>}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Agregar `ubicacion` en Step1 y `specs` en state inicial**

En el state inicial del formulario:
```js
const [form, setForm] = useState({
  tipo: 'auto', marca: '', modelo: '', anio: new Date().getFullYear(),
  version: '', color: '', km_hs: '', patente: '', nro_motor: '', nro_chasis: '',
  precio_base: '', estado: 'disponible',
  ubicacion: 'showroom',   // NUEVO
  notas_internas: '',
  specs: { ...SPECS_DEFAULTS },  // NUEVO
})
```

En Step1, agregar field ubicación:
```jsx
<FormField label="Ubicación inicial">
  <select className="input" value={form.ubicacion} onChange={f('ubicacion')}>
    <option value="showroom">Showroom</option>
    <option value="taller">Taller</option>
    <option value="cochera">Cochera</option>
    <option value="traslado">En traslado</option>
    <option value="cliente">En cliente</option>
  </select>
</FormField>
```

Agregar step de equipamiento en el wizard:
```jsx
// En el array de steps, agregar:
{ id: 'equip', titulo: 'Equipamiento', component: StepEquipamiento }
// Pasarle: specs={form.specs} setSpecs={(fn) => setForm(prev => ({ ...prev, specs: fn(prev.specs || {}) }))}
```

- [ ] **Step 4: Agregar CSS de chips si no existe**

En `src/index.css`:
```css
.chip {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 500;
  background: var(--c-surface-2); color: var(--c-fg-2); border: 1px solid var(--c-border);
}
.chip--accent {
  background: color-mix(in srgb, var(--c-accent) 15%, transparent);
  color: var(--c-accent);
  border-color: color-mix(in srgb, var(--c-accent) 30%, transparent);
}
```

- [ ] **Step 5: Commit**

```bash
git add src/screens/Ingreso.jsx src/index.css
git commit -m "feat: panel equipamiento completo — 30+ campos en 5 secciones + chips resumen"
```

---

## Task 4: Campo `ubicacion` visible en Catálogo y Detalle

**Files:**
- Modify: `gh-cars-web/src/components/VehicleCard.jsx`
- Modify: `gh-cars-web/src/screens/Detalle.jsx`

- [ ] **Step 1: Badge de ubicación en VehicleCard**

```jsx
const UBICACION_CONFIG = {
  taller:   { label: 'En taller',   color: '#f59e0b' },
  cochera:  { label: 'Cochera',     color: '#6b7280' },
  traslado: { label: 'En traslado', color: '#3b82f6' },
  cliente:  { label: 'En cliente',  color: '#6b7280' },
}

// En el render, junto al badge de estado:
{veh.ubicacion && veh.ubicacion !== 'showroom' && UBICACION_CONFIG[veh.ubicacion] && (
  <span style={{
    fontSize: 10, padding: '2px 7px', borderRadius: 10, fontWeight: 500,
    border: `1px solid ${UBICACION_CONFIG[veh.ubicacion].color}`,
    color: UBICACION_CONFIG[veh.ubicacion].color,
  }}>
    {UBICACION_CONFIG[veh.ubicacion].label}
  </span>
)}
```

- [ ] **Step 2: Ubicación + cambio rápido en Detalle**

En el header de Detalle, debajo del título:
```jsx
// Mostrar ubicación actual con ícono
// Botón para cambiar ubicación rápidamente (dropdown inline)
const [editUbicacion, setEditUbicacion] = useState(false)

const handleCambiarUbicacion = async (nuevaUbicacion) => {
  await supabase.from('vehiculos')
    .update({ ubicacion: nuevaUbicacion, updated_at: new Date().toISOString() })
    .eq('id', vehiculo.id)
  // Registrar en historial
  await supabase.from('vehiculos_historial').insert([{
    vehiculo_id: vehiculo.id,
    tipo: 'ubicacion_cambio',
    descripcion: `Ubicación cambiada a ${nuevaUbicacion}`,
    datos_extra: { anterior: vehiculo.ubicacion, nuevo: nuevaUbicacion },
  }])
  setVehiculo(prev => ({ ...prev, ubicacion: nuevaUbicacion }))
  setEditUbicacion(false)
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/VehicleCard.jsx src/screens/Detalle.jsx
git commit -m "feat: ubicacion visible en Catálogo + cambio rápido en Detalle"
```

---

## Task 5: AI publication-ready

**Files:**
- Modify: `gh-cars-api/main.py` — mejorar `/ai/completar-specs`
- Modify: `gh-cars-web/src/screens/Detalle.jsx` — chips equipamiento + descripción editable

### 5A — Backend

- [ ] **Step 1: Actualizar endpoint `/ai/completar-specs` en main.py**

```python
@app.post("/ai/completar-specs")
async def completar_specs(req: CompletarSpecsReq):
    prompt = f"""Eres experto en automóviles para una concesionaria argentina.
Vehículo: {req.marca} {req.modelo} {req.anio} {req.version or ''}
Tipo: {req.tipo}
{'KM: ' + str(req.km) if req.km else ''}
{'Color: ' + req.color if req.color else ''}

Devuelve JSON con estos campos exactos (null si no sabés, true/false si sabés):
{{
  "specs": {{
    "cilindrada": null, "combustible": null, "transmision": null, "traccion": null,
    "carroceria": null, "puertas": null, "potencia_hp": null, "torque_nm": null,
    "cilindros": null, "vel_max_kmh": null, "aceleracion_0_100": null,
    "tanque_litros": null, "consumo_mixto": null, "peso_kg": null,
    "climatizacion": null, "pantalla_pulg": null, "apple_carplay": null,
    "android_auto": null, "carga_inalambrica": null, "bluetooth": null,
    "gps_integrado": null, "faros": null, "tapizado": null,
    "asientos_calefaccionados": null, "asientos_electricos": null,
    "vidrios_electricos": null, "cierre_centralizado": null,
    "techo_solar": null, "techo_panoramico": null, "llantas_aleacion": null,
    "alarma": null, "arranque_sin_llave": null, "freno_mano_electrico": null,
    "airbags": null, "camara_retroceso": null, "sensores_estacionamiento": null,
    "abs": null, "esp": null, "control_crucero": null,
    "crucero_adaptativo": null, "hud": null, "frenado_autonomo": null
  }},
  "descripcion_marketing": "3-4 oraciones para MercadoLibre Argentina. Destacar equipamiento, estado, beneficios. Profesional y atractivo. Terminar con invitación a consultar.",
  "equipamiento_destacado": ["max 5 items más importantes"],
  "titulo_ml": "Título para MercadoLibre máximo 60 caracteres",
  "confianza": 0.8
}}
Solo incluye equipamiento de fábrica para esta versión/año.
null = no sé. false = no tiene. true = sí tiene.
Solo JSON, sin markdown."""

    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(prompt)
    text = response.text.strip().strip("```json").strip("```").strip()
    import json
    return json.loads(text)
```

- [ ] **Step 2: Commit y deploy backend**

```bash
cd sistemas/concesionaria/gh-cars-api
git add main.py
git commit -m "feat: completar-specs devuelve descripcion_marketing + titulo_ml + equipamiento_destacado"
flyctl deploy --ha=false --strategy=immediate -a gh-cars-api
```

### 5B — Frontend: Detalle con chips + descripción

- [ ] **Step 3: Agregar EquipamientoChips component en Detalle.jsx**

```jsx
function EquipamientoChips({ specs = {} }) {
  const chips = []
  if (specs.apple_carplay) chips.push('Apple CarPlay')
  if (specs.android_auto) chips.push('Android Auto')
  if (specs.climatizacion === 'automatico') chips.push('A/C Automático')
  if (specs.climatizacion === 'bizona') chips.push('A/C Bizona')
  if (specs.techo_solar) chips.push('Techo Solar')
  if (specs.techo_panoramico) chips.push('Techo Panorámico')
  if (specs.tapizado === 'cuero') chips.push('Tapizado Cuero')
  if (specs.tapizado === 'semicuero') chips.push('Tapizado Semicuero')
  if (specs.camara_retroceso && specs.camara_retroceso !== 'no') chips.push('Cámara Retroceso')
  if (specs.sensores_estacionamiento && specs.sensores_estacionamiento !== 'ninguno') chips.push('Sensores Parking')
  if (specs.arranque_sin_llave) chips.push('Keyless Entry')
  if (specs.faros === 'full_led') chips.push('Full LED')
  if (specs.crucero_adaptativo) chips.push('Crucero Adaptativo')
  if (specs.carga_inalambrica) chips.push('Carga Inalámbrica')
  if (specs.airbags > 0) chips.push(`${specs.airbags} Airbags`)
  if (specs.llantas_aleacion) chips.push('Llantas Aleación')
  if (specs.abs) chips.push('ABS')
  if (specs.esp) chips.push('ESP')

  if (!chips.length) return (
    <div style={{ fontSize: 12, color: 'var(--c-fg-3)', fontStyle: 'italic' }}>
      Sin equipamiento registrado — usá "Completar con IA" en el tab Editar
    </div>
  )
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {chips.map(c => <span key={c} className="chip chip--accent">{c}</span>)}
    </div>
  )
}
```

- [ ] **Step 4: Agregar sección descripción editable en tab info de Detalle**

```jsx
// En el tab Info/Detalles de Detalle.jsx:
// Mostrar chips de equipamiento
// Descripción editable con botón "✨ Generar con IA"
// Botón "Copiar para ML" que copia descripcion_publica al clipboard
```

- [ ] **Step 5: Commit frontend**

```bash
cd sistemas/concesionaria/gh-cars-web
git add src/screens/Detalle.jsx
git commit -m "feat: chips equipamiento + descripcion editable + generar con IA en Detalle"
```

---

## Task-ALERTAS: Dashboard de alertas de vencimientos

Esta es la feature que los dueños más van a agradecer. El sistema calcula automáticamente cuándo vence la VTV de cada auto basándose en el último número de la patente.

**Files:**
- Create: `gh-cars-web/src/screens/Alertas.jsx`
- Modify: `gh-cars-web/src/screens/Dashboard.jsx` — panel de alertas en el inicio
- Modify: `gh-cars-web/src/App.jsx` — agregar ruta /alertas

- [ ] **Step 1: Implementar lógica de vencimiento de VTV**

```js
// En src/lib/alertas.js (nuevo archivo)

// Tabla VTV por último número de patente (Buenos Aires)
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
 * Calcula la fecha de vencimiento de VTV para una patente.
 * Para patente nueva (AB123CD): último carácter
 * Para patente vieja (ABC123): último dígito
 */
export function calcularVencimientoVTV(patente) {
  if (!patente) return null
  const p = patente.replace(/[\s\-]/g, '').toUpperCase()
  // Buscar el último número en la patente
  const digitos = p.match(/\d/g)
  if (!digitos || !digitos.length) return null
  const ultimoDigito = digitos[digitos.length - 1]
  const mes = VTV_MES_POR_DIGITO[ultimoDigito]
  if (!mes) return null

  // Calcular próximo vencimiento (año actual o siguiente)
  const hoy = new Date()
  let anio = hoy.getFullYear()
  const vencimiento = new Date(anio, mes - 1, 1) // día 1 del mes (aproximado)
  // Si ya pasó este año, es el próximo año
  if (vencimiento < hoy) vencimiento.setFullYear(anio + 1)
  return vencimiento
}

/**
 * Clasifica la urgencia de un vencimiento.
 * Retorna: 'vencido' | 'urgente' (< 15 días) | 'proximo' (< 30 días) | 'ok'
 */
export function clasificarUrgencia(fecha) {
  if (!fecha) return 'ok'
  const hoy = new Date()
  const diasRestantes = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24))
  if (diasRestantes < 0) return 'vencido'
  if (diasRestantes <= 15) return 'urgente'
  if (diasRestantes <= 30) return 'proximo'
  return 'ok'
}

/**
 * Para un array de vehículos, calcula las alertas de VTV de todos.
 */
export function calcularAlertasVTV(vehiculos) {
  return vehiculos
    .filter(v => v.patente && v.estado !== 'vendido')
    .map(v => {
      const vencimiento = calcularVencimientoVTV(v.patente)
      const urgencia = clasificarUrgencia(vencimiento)
      return { ...v, vtv_vencimiento_calc: vencimiento, vtv_urgencia: urgencia }
    })
    .filter(v => v.vtv_urgencia !== 'ok')
    .sort((a, b) => new Date(a.vtv_vencimiento_calc) - new Date(b.vtv_vencimiento_calc))
}
```

- [ ] **Step 2: Crear pantalla Alertas.jsx**

```jsx
// Secciones:
// 1. Alertas VTV — autos con VTV por vencer (30 días) o vencida
// 2. Documentos vencidos — VTV vencida según tabla documentacion
// 3. Cuotas vencidas — de tabla cuotas
// 4. Leads sin contactar — prospectos > 7 días sin respuesta
// 5. Seguimientos programados — seguimientos.fecha_programada <= hoy

// Cada alerta muestra: semáforo de urgencia (rojo/naranja/amarillo) + vehículo/cliente + acción recomendada
```

Colores de urgencia:
- 🔴 `vencido` — fondo rojo tenue, borde rojo
- 🟠 `urgente` — fondo naranja tenue, borde naranja (< 15 días)
- 🟡 `proximo` — fondo amarillo tenue, borde amarillo (< 30 días)

- [ ] **Step 3: Agregar contador de alertas en Sidebar**

En `Sidebar.jsx`, el ítem "Alertas" debe mostrar un número rojo con la cantidad de alertas activas:
```jsx
// En Sidebar, al cargar: fetchAlertas() y guardar count en state
// Mostrar junto al ítem: <span className="badge-alert">{alertCount}</span>
```

- [ ] **Step 4: Panel de alertas en Dashboard.jsx**

En el Dashboard, agregar una sección al inicio: "3 alertas requieren atención" con los ítems más urgentes y link a la pantalla completa.

- [ ] **Step 5: Commit**

```bash
git add src/lib/alertas.js src/screens/Alertas.jsx src/screens/Dashboard.jsx src/components/Sidebar.jsx src/App.jsx
git commit -m "feat: sistema de alertas automáticas — VTV, cuotas, leads, seguimientos"
```

---

## Task-HISTORIAL: Timeline de la unidad en Detalle

**Files:**
- Modify: `gh-cars-web/src/screens/Detalle.jsx` — agregar tab "Historial" con timeline
- Modify: `gh-cars-web/src/lib/supabase.js` — agregar helper para historial

- [ ] **Step 1: Helper para historial en supabase.js**

```js
export async function getHistorialVehiculo(vehiculoId) {
  const { data, error } = await supabase
    .from('vehiculos_historial')
    .select('*, vendedores(nombre)')
    .eq('vehiculo_id', vehiculoId)
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return data || []
}

export async function addHistorialVehiculo(vehiculoId, tipo, descripcion, datosExtra = {}, vendedorId = null) {
  await supabase.from('vehiculos_historial').insert([{
    vehiculo_id: vehiculoId,
    tipo,
    descripcion,
    datos_extra: datosExtra,
    vendedor_id: vendedorId,
  }])
}
```

- [ ] **Step 2: Tab "Historial" en Detalle.jsx**

Timeline visual con iconos por tipo de evento:
- `ingreso` → 🚗
- `foto_agregada` → 📷
- `doc_subido` → 📄
- `estado_cambio` → 🔄
- `ubicacion_cambio` → 📍
- `seña` → 💰
- `venta` → ✅
- `gasto` → 💸
- `lead` → 👤
- `prueba_manejo` → 🔑
- `precio_cambio` → 💲
- `nota` → 📝

```jsx
function Timeline({ eventos }) {
  return (
    <div style={{ position: 'relative', paddingLeft: 24 }}>
      {/* Línea vertical */}
      <div style={{
        position: 'absolute', left: 8, top: 0, bottom: 0,
        width: 2, background: 'var(--c-border)',
      }} />
      {eventos.map((ev, i) => (
        <div key={ev.id} style={{ display: 'flex', gap: 12, marginBottom: 16, position: 'relative' }}>
          {/* Dot */}
          <div style={{
            position: 'absolute', left: -24 + 4, top: 2,
            width: 10, height: 10, borderRadius: '50%',
            background: 'var(--c-accent)', border: '2px solid var(--c-bg)',
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: 'var(--c-fg-1)' }}>{ev.descripcion}</div>
            <div style={{ fontSize: 11, color: 'var(--c-fg-3)', marginTop: 2 }}>
              {new Date(ev.created_at).toLocaleString('es-AR', {
                day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit'
              })}
              {ev.vendedores?.nombre && ` · ${ev.vendedores.nombre}`}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Auto-insertar en historial al guardar cambios importantes**

En todas las acciones de Detalle (cambio de estado, precio, ubicación, seña, venta), llamar `addHistorialVehiculo()` automáticamente.

- [ ] **Step 4: Commit**

```bash
git add src/screens/Detalle.jsx src/lib/supabase.js
git commit -m "feat: timeline de historial completo de la unidad en Detalle"
```

---

## Task-AGENDA: Pruebas de manejo y turnos

**Files:**
- Create: `gh-cars-web/src/screens/Agenda.jsx`
- Modify: `gh-cars-web/src/screens/Detalle.jsx` — botón "Agendar prueba de manejo"
- Modify: `gh-cars-web/src/App.jsx` — agregar ruta /agenda

- [ ] **Step 1: Pantalla Agenda.jsx con vista semana/día**

Vista por semana con los turnos del día listados en orden cronológico.
Sin librerías de calendario — usar CSS grid con horas como filas.

- [ ] **Step 2: Agendar desde Detalle**

En el header de Detalle, botón "Agendar prueba de manejo" → modal simple con:
- Nombre del interesado / vincular prospecto existente
- Fecha + hora
- Teléfono
- Notas

Al guardar: inserta en `agenda` + inserta en `vehiculos_historial`.

- [ ] **Step 3: Commit**

```bash
git add src/screens/Agenda.jsx src/screens/Detalle.jsx src/App.jsx
git commit -m "feat: agenda de pruebas de manejo y turnos"
```

---

## Task 7: Seguimiento trimestral de clientes financiados

**Files:**
- Modify: `gh-cars-web/src/screens/Cobranza.jsx`
- Modify: `gh-cars-web/src/lib/supabase.js`
- Modify: `gh-cars-web/src/screens/Ventas.jsx`

- [ ] **Step 1: Agregar helpers en supabase.js**

```js
export async function getSeguimientos(filtros = {}) {
  let q = supabase
    .from('seguimientos')
    .select(`*, clientes(id, nombre, apellido, telefono, whatsapp),
      con_ventas(id, precio_final, fecha_venta, vehiculo_id,
        vehiculos(id, marca, modelo, anio, patente))`)
    .order('fecha_programada', { ascending: true })
  if (filtros.estado) q = q.eq('estado', filtros.estado)
  const { data, error } = await q
  if (error) throw error
  return data
}

export async function crearSeguimientosBancarios(venta_id, cliente_id, vendedor_id) {
  const hoy = new Date()
  const items = [3, 6, 9, 12].map(meses => {
    const f = new Date(hoy)
    f.setMonth(f.getMonth() + meses)
    return {
      cliente_id, venta_id, vendedor_id,
      tipo: 'financiamiento', estado: 'pendiente',
      fecha_programada: f.toISOString().split('T')[0],
      canal: 'whatsapp',
      notas: `Seguimiento ${meses} meses — verificar estado del crédito`,
    }
  })
  const { data, error } = await supabase.from('seguimientos').insert(items).select()
  if (error) throw error
  return data
}

export async function updateSeguimiento(id, cambios) {
  const { data, error } = await supabase.from('seguimientos').update({
    ...cambios, updated_at: new Date().toISOString()
  }).eq('id', id).select().single()
  if (error) throw error
  return data
}
```

- [ ] **Step 2: Tab "Seguimiento" en Cobranza.jsx con alertas de clientes a contactar**

- [ ] **Step 3: Auto-crear seguimientos en Ventas.jsx cuando hay financiamiento bancario**

- [ ] **Step 4: Commit**

```bash
git add src/screens/Cobranza.jsx src/screens/Ventas.jsx src/lib/supabase.js
git commit -m "feat: seguimiento trimestral automático para clientes con financiamiento bancario"
```

---

## Task 8: Fix hook violation en Detalle.jsx (BUG CRÍTICO)

- [ ] **Step 1: Leer Detalle.jsx completo**
- [ ] **Step 2: Mover TODOS los hooks (useState, useEffect, useCallback) antes del primer conditional return**
- [ ] **Step 3: Verificar que no hay hooks después de ningún `if (...) return`**
- [ ] **Step 4: Commit**

```bash
git add src/screens/Detalle.jsx
git commit -m "fix: hook violation — todos los useState/useEffect al inicio del componente"
```

---

## Task 9: TC dinámico en App.jsx

- [ ] **Step 1: Leer App.jsx**
- [ ] **Step 2: Reemplazar TC hardcodeado 1415 con fetch desde Supabase config o dolarapi.com**

```js
useEffect(() => {
  supabase.from('config').select('valor').eq('clave', 'tipo_cambio').maybeSingle()
    .then(({ data }) => { if (data?.valor) setTc(Number(data.valor)) })
    .catch(() => {
      fetch('https://dolarapi.com/v1/dolares/blue')
        .then(r => r.json()).then(d => { if (d?.venta) setTc(d.venta) })
        .catch(() => {})
    })
}, [])
```

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "fix: TC dinámico desde Supabase config o dolarapi — era hardcoded 1415"
```

---

## Task 6: Drive para documentos PDF

**Files:**
- Modify: `gh-cars-api/main.py` — endpoints Drive para PDFs
- Modify: `gh-cars-api/requirements.txt`

Estructura en Drive:
```
GH Cars/
├── Autos/
│   └── {Marca}/
│       └── {patente} - {modelo} {anio}/
│           └── documentos/ (solo PDFs: cédula, dominio, VTV, F08, contrato)
└── Clientes/
    └── {DNI} - {nombre}/
        └── (contratos, comprobantes de pago)
```

> ⚠️ REQUIERE ACCIÓN MANUAL: Service Account + DRIVE_ROOT_FOLDER_ID en Fly.io secrets

- [ ] **Step 1: Implementar Drive service en main.py (ver código detallado en plan anterior)**
- [ ] **Step 2: Commit y deploy**

```bash
cd sistemas/concesionaria/gh-cars-api
git add main.py requirements.txt
git commit -m "feat: Drive SA — crear carpeta documentos por vehículo"
flyctl deploy --ha=false --strategy=immediate -a gh-cars-api
```

---

## Resumen final — orden de ejecución

```
Paralelo (sin dependencias):
  Task 8  — Fix hook violation         ← bug crítico
  Task 9  — TC dinámico                ← bug simple
  Task 2  — Branding GH Cars           ← grep+replace

Secuencial (en este orden):
  Task 1  — Migration SQL v7            ← DB prereq para todo
  Task-STORAGE — Supabase Storage       ← prereq para fotos
  Task 3  — Panel equipamiento (Ingreso)
  Task 4  — Ubicación (Catálogo+Detalle)
  Task-FOTOS — Shot list guiado
  Task 5  — AI publication-ready
  Task-ALERTAS — VTV/patente/cuotas
  Task-HISTORIAL — Timeline
  Task-AGENDA — Pruebas de manejo
  Task 7  — Seguimiento bancarios

Manual (Roker):
  Ejecutar migration_v7.sql en Supabase
  Crear bucket "vehiculos" en Supabase Storage (público)
  Configurar Drive SA + DRIVE_ROOT_FOLDER_ID en Fly.io
```
