# MARKETING_PUBLICO.md — Estrategia Digital GH Cars
> Generado: 27/04/2026 · Fase 1 (Estrategia) · Pendiente aprobación para Fase 2

---

## 1. RECOMENDACIÓN DE HERRAMIENTAS (/asesor)

De las herramientas disponibles, orden de prioridad para este proyecto:

| Herramienta | Disponible | Uso recomendado |
|-------------|-----------|-----------------|
| **ui-ux-pro-max** | ✅ Instalada | Auditoría visual y propuesta de rediseño (usada en este doc) |
| **firecrawl-search** | ✅ Instalada | Scraping de competidores (usada en este doc) |
| **buscar-referencia** | ✅ Instalada | Research de tendencias (usada en este doc) |
| **qa-web-testing** | ✅ Instalada | QA post-implementación en browser real |
| **calendario-contenido** | ❌ No disponible | Futuro: planificar posts Instagram/TikTok |
| **emails-venta** | ❌ No disponible | Futuro: secuencia de nurturing para prospectos |
| **scraping-competencia** | ❌ No disponible como skill | Hecho vía agente de investigación web |
| **espia-tendencias** | ❌ No disponible como skill | Hecho vía agente de investigación web |

---

## 2. ESTADO DEL MERCADO (espia-tendencias)

### Datos 2025 (verificados)
- **Boom histórico:** 1.602.941 transferencias ene–oct 2025 (+11.8% YoY). Proyección: ~1.800.000 anuales, récord desde 2013.
- **Financiación:** Solo 8% de usados se financian (vs. 40-48% en 0km). TNA Banco Nación: 38% (bajó 12 puntos en nov 2025, plazo máx 72 meses).
- **Método de pago dominante:** 90% canje + diferencia en efectivo.
- **Modelos líderes:** VW Gol/Gol Trend (10.228 uds/julio), Chevrolet Corsa, Toyota Hilux.
- **Señal reciente:** el mercado empieza a sentir presión de los 0km en abr 2025 → ventana de oportunidad para posicionarse ahora.

### Preocupaciones del COMPRADOR
- Mecánica desconocida, accidentes ocultos, odómetro adulterado
- Documentación irregular (titularidad, deudas)
- Quiere VTV vigente + documentación limpia
- Busca financiación pero pocos concesionarios la ofrecen para usados

### Preocupaciones del VENDEDOR
- Tiempo de venta (necesita liquidez rápida)
- Comisiones de consignación (promedio 7% en el mercado)
- Necesita múltiples canales de exposición
- Quiere saber que el comprador es serio

### Keywords SEO prioritarias (Argentina)
- `autos usados Benavídez` / `autos usados Tigre` / `autos usados San Isidro`
- `consignación de autos Buenos Aires` / `vender mi auto urgente`
- `comprar auto usado sin financiación` / `autos usados con VTV`
- `[Marca] [Modelo] usado precio` (búsquedas transaccionales de alto volumen)
- `concesionaria usados zona norte GBA`

---

## 3. ANÁLISIS DE COMPETIDORES (scraping-competencia)

**Investigados:** Kavak.com · Barein Autos · Auta.com.ar · Queflash · + búsquedas de comportamiento usuario

### Headlines y propuestas de valor (lo que usa la competencia)
- **Velocidad como eje central**: "en 1 día", "en un Flash", "en 48 horas", "cotización en 2 minutos"
- **Simplicidad del proceso**: "3 simples pasos", "sin burocracia", "sin complicaciones"
- Frases textuales reales:
  - Kavak: *"Compra y venta de autos. Fácil y seguro"*
  - Barein: *"Operá de manera ágil, transparente, segura y llevate tu próximo auto con garantía"*
  - Queflash: *"Vendé tu auto en un Flash. RÁPIDO, SEGURO Y CONVENIENTE"*
  - Auta: *"En tres simples pasos, carga los datos de tu auto, recibí tu oferta inicial y agenda tu turno"*

### Estructura de homepage — secciones que aparecen en TODOS
1. Hero con propuesta + **2 CTAs duales** (Vender / Comprar)
2. "Cómo funciona" con **3–4 pasos visuales** ilustrados
3. Trust indicators: garantía, transparencia, velocidad
4. CTA secundario (catálogo, cotización)
5. WhatsApp flotante o chat widget
6. FAQ o "Por qué elegir..."

### CTAs más efectivos detectados (textuales)
- `"Cotizá tu auto en un Flash"` — Queflash (urgencia + velocidad)
- `"Recibí ofertas en efectivo"` — Kavak (beneficio financiero claro)
- `"Olvídate de la burocracia"` — Barein (pain point Argentina)
- `"Entregá tu auto y llevate el nuevo"` — Barein (simplificación emocional)
- `"Empezar"` como CTA único — Auta (bajo fricción)

### Lo que NADIE hace bien (oportunidades de GH Cars)
1. **Consignación invisible**: Kavak, Auta no la ofrecen. Barein la menciona pero sin marketing real. Buscar "consignación autos Argentina" y no aparece nadie con landing dedicada → **oportunidad SEO enorme**.
2. **Proceso de consignación sin explicar**: todos dicen "consignamos" pero nadie cuenta los 3 pasos concretos.
3. **Trámites y documentación**: las búsquedas revelan que los papeles son la barrera #1 del vendedor. Nadie ofrece "nosotros hacemos los trámites" de forma explícita.
4. **SEO hiperlocal**: ninguna concesionaria de GBA Norte aparece bien posicionada para "autos usados Benavídez / Tigre / San Isidro".
5. **WhatsApp como canal primario**: la mayoría usa formularios lentos → GH Cars ya está un paso adelante con WA directo.

---

## 4. AUDITORÍA SEO ACTUAL (/p/*)

### ✅ Lo que ya está bien
- Title tag con keyword + marca + localidad
- Meta description con servicios
- JSON-LD AutoDealer schema completo
- Open Graph tags (og:title, og:description, og:type)
- Twitter Card
- Canonical URL configurado
- robots.txt con reglas correctas (bloquea rutas privadas)
- sitemap.xml estático (home, catálogo, contacto)
- favicon.svg + apple-touch-icon

### ❌ Gaps críticos de SEO

| Gap | Impacto | Solución |
|-----|---------|---------|
| Todas las páginas comparten el mismo `<title>` y `<meta description>` | ALTO | Implementar `react-helmet` + dinámico por ruta |
| Páginas de vehículo sin meta tags individuales | ALTO | `<title>VW Golf 2020 — GH Cars</title>` + og:image con foto real |
| og:image usa `/icons/icon-512.png` en lugar de foto de auto | MEDIO | Usar foto destacada del catálogo como og:image |
| Sin Google Business Profile (fuera del código) | ALTO | Crear/reclamar perfil en Google Maps |
| Palabras clave locales no están en body text | MEDIO | Agregar "Benavídez", "Tigre", "zona norte" en sección Visitanos |
| No hay breadcrumbs (`BreadcrumbList` schema) | BAJO | Agregar en Detalle: Home > Catálogo > Marca Modelo |
| sitemap.xml no incluye URLs de vehículos | BAJO | Generar sitemap dinámico desde Supabase |

### Prioridad SEO inmediata:
1. `react-helmet` en los 4 screens → biggest bang for buck
2. Google Business Profile → tráfico de Maps inmediato
3. Keywords locales en body text
4. og:image dinámica en vehículos

---

## 5. PROPUESTA UI/UX (ui-ux-pro-max)

### Sistema de diseño actual — inventario
- **Paleta:** `--c-accent` (rojo-rosado ~#ff2d55) · oscuro `#0E1117` · tarjetas semitransparentes
- **Tipografía:** Inter (system-ui fallback) · pesos 500/600/700/800
- **Layout:** CSS inline objects (no Tailwind) · `clamp()` para responsivo
- **Componentes:** TiltCard, ThemeToggle, AnimatedCounter, WaIcon

> ⚠️ El accent real es `#ff2d55` (meta theme-color) aunque el brief menciona `#6C5CFF`.
> Recomendación: confirmar con el dueño antes de Fase 2. Este doc usa el color actual.

### Análisis por pantalla

#### /p/home (HomePublica)
**Estado:** Hero + categorías + stock grid + mapa + footer
**Gaps:**
- No hay sección de servicios (compra/venta/consignación) con descripción/CTA
- No hay CTA "Vendé tu auto" en el fold superior
- Value props son texto pequeño, no escaneables en mobile
- La sección mapa en desktop usa 2 columnas pero en mobile no hay override visible → puede romper

#### /p/catalogo (CatalogoPublico)
**Estado:** Filtros + grid de tarjetas
**Gaps:**
- Los filtros en mobile ocupan demasiado espacio vertical
- No hay paginación (con 20+ autos se hace lento)
- No hay estado vacío con sugerencias cuando los filtros no dan resultados
- No hay "¿Querés vender el tuyo?" en el catálogo (capturar vendedores potenciales)

#### /p/vehiculo/:id (DetallePublico)
**Estado:** Galería swipe + specs + similares + WA sticky bottom
**Gaps:**
- Solo 1 foto visible por vez (no thumbnails grid en desktop)
- No hay sección de "¿Qué incluye?" (VTV, documentación, revisión)
- No hay CTA de consignación / "¿Tenés uno similar para vender?"
- Desktop layout no aprovecha el ancho

#### /p/contacto (ContactoPublico)
**Estado:** Formulario genérico + info + mapa
**Gaps:**
- Formulario no tiene selector de intención (comprar/vender/consignar)
- No hay campo "marca y modelo de tu auto" para los que venden
- No hay tasación express (3 campos → WA con info pre-llenada)

---

## 6. WIREFRAMES EN TEXTO

### /p/home — Estructura propuesta

```
┌──────────────────────────────────────────────────────────┐
│ [TOPBAR] Logo | Stock | Contacto | [Ingresar] [WhatsApp] │
├──────────────────────────────────────────────────────────┤
│                         HERO                             │
│  Concesionaria · Benavídez                               │
│  ┌─────────────────────────┐  ┌────────────────────┐     │
│  │ "Encontrá tu            │  │   [FOTO DESTACADA]  │     │
│  │  próximo auto."         │  │   Marca Modelo Año  │     │
│  │                         │  │   USD 18.500 →      │     │
│  │ [Ver stock →]           │  │                    │     │
│  │ [WhatsApp]              │  └────────────────────┘     │
│  │                         │                             │
│  │ ⚡ Resp <2hs  💳 Financ  │                             │
│  │ 🤝 Compramos y consig   │                             │
│  └─────────────────────────┘                             │
├──────────────────────────────────────────────────────────┤
│                    CATEGORÍAS                            │
│  [🚛 Pickups] [🚙 SUVs] [🚗 Sedanes] [🚗 Hatchbacks]    │
├──────────────────────────────────────────────────────────┤
│                  NUESTROS SERVICIOS (NUEVO)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ 🚗 COMPRÁ   │  │ 🏷️ VENDÉ    │  │ 🤝 CONSIGNÁ  │  │
│  │ Amplio stock │  │ Tomamos tu  │  │ Gestionamos  │  │
│  │ seleccionado │  │ usado al    │  │ la venta por │  │
│  │             │  │ mejor precio │  │ vos          │  │
│  │ [Ver stock]  │  │ [Cotizar]   │  │ [Saber más]  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
├──────────────────────────────────────────────────────────┤
│                   CTA VENDER (NUEVO)                     │
│  "¿Querés vender tu auto al mejor precio?"               │
│  Sin esperar semanas · Pago inmediato · Sin complicaciones│
│  [Cotizá tu auto ahora →] [WhatsApp]                    │
├──────────────────────────────────────────────────────────┤
│                  STOCK DISPONIBLE                        │
│  [tarjeta] [tarjeta] [tarjeta]                           │
│  [tarjeta] [tarjeta] [tarjeta]                           │
│  [Ver catálogo completo →]                               │
├──────────────────────────────────────────────────────────┤
│            SHOWROOM EN BENAVÍDEZ + MAPA                  │
├──────────────────────────────────────────────────────────┤
│                       FOOTER                             │
└──────────────────────────────────────────────────────────┘
```

### /p/home — Mobile (375px)

```
┌───────────────────────────┐
│ [Logo] Stock  Contacto 🌙 │ ← header compacto
├───────────────────────────┤
│    HERO (stack vertical)  │
│ Concesionaria · Benavidez │
│ "Encontrá tu              │
│  próximo auto."           │
│                           │
│ [Ver stock →]  [WhatsApp] │
│ ─────────────────────     │
│ ⚡ <2hs  💳 Financ  🤝    │
├───────────────────────────┤
│  [Foto destacada 4:3]     │
│  Marca Modelo Año         │
│  USD 18.500 →             │
├───────────────────────────┤
│ CATEGORÍAS (scroll horiz) │
│ [Pickups][SUVs][Sedanes]→ │
├───────────────────────────┤
│ SERVICIOS (stack 1 col)   │
│ ┌─────────────────────┐   │
│ │ 🚗 COMPRÁ           │   │
│ │ [Ver stock →]       │   │
│ └─────────────────────┘   │
│ ┌─────────────────────┐   │
│ │ 🏷️ VENDÉ TU AUTO   │   │
│ │ [Cotizar gratis]    │   │
│ └─────────────────────┘   │
│ ┌─────────────────────┐   │
│ │ 🤝 CONSIGNACIÓN     │   │
│ │ [Cómo funciona]     │   │
│ └─────────────────────┘   │
├───────────────────────────┤
│ STOCK (1 col)             │
│ [tarjeta]                 │
│ [tarjeta]                 │
│ [Ver todo →]              │
├───────────────────────────┤
│ MAPA + DATOS              │
│ [iframe]                  │
└───────────────────────────┘
```

### /p/catalogo — Estructura propuesta

```
Mobile:
┌─────────────────────────────┐
│ [Header]                    │
├─────────────────────────────┤
│ [🔍 Buscar marca o modelo ] │
│ [Filtros ▼] [Ordenar ▼]    │ ← toca → drawer desde abajo
│ 8 resultados                │
├─────────────────────────────┤
│ [tarjeta full-width]        │
│ [tarjeta full-width]        │
│ [tarjeta full-width]        │
│ ... infinite scroll         │
├─────────────────────────────┤
│ "¿Tenés un auto para vender?│
│  [Cotizar →]"               │ ← banner entre resultados cada 6
└─────────────────────────────┘
```

### /p/vehiculo/:id — Estructura propuesta

```
Mobile (actual — mejorado):
┌─────────────────────────────┐
│ [Header ← Logo Share Fav]   │
├─────────────────────────────┤
│ [Foto principal 16:9]       │
│ ← ● ● ○ ○ →               │ ← dots + swipe (ya existe)
│ [thumb][thumb][thumb]→      │ ← row horizontal (ya existe)
├─────────────────────────────┤
│ MARCA                       │
│ Modelo Año                  │
│ Version                     │
│ USD 18.500 / ARS 26.2M     │
│ [ARS estimado]              │
├─────────────────────────────┤
│ SPECS: Año Km Transm Comb   │
├─────────────────────────────┤
│ ─── QUÉ INCLUYE ─── (NUEVO)│
│ ✅ VTV vigente              │
│ ✅ Documentación en orden   │
│ ✅ Revisión antes de entrega│
├─────────────────────────────┤
│ DESCRIPCIÓN (si hay)        │
├─────────────────────────────┤
│ SIMILARES (ya existe)       │
├─────────────────────────────┤
│ ¿TENÉS UNO PARA VENDER?     │
│ (NUEVO — captura vendedores)│
│ [Cotizá el tuyo →]         │
├─────────────────────────────┤
│ [FIXED BOTTOM BAR]          │
│ USD 18.500  [WA Consultar] │
└─────────────────────────────┘
```

### /p/contacto — Estructura propuesta

```
┌────────────────────────────────────────┐
│ Hablemos.                              │
│ GH Cars · Benavidez                    │
│                                        │
│ ¿Qué querés hacer?                     │
│ [Comprar un auto]                      │
│ [Vender/cotizar mi auto] ← NUEVO       │
│ [Consignación]           ← NUEVO       │
│ [Otra consulta]                        │
│                                        │
│ ─── SI VENDE: ───────────────────────  │
│ Marca: _________ Modelo: _______       │
│ Año:   ____ Km:  _________             │
│ → [Cotizar por WhatsApp →]            │
│                                        │
│ ─── GENÉRICO: ─────────────────────── │
│ Nombre: _________ Tel: ___________    │
│ Email (opcional): __________________  │
│ Mensaje: ________________________     │
│ [Enviar por WhatsApp →]               │
└────────────────────────────────────────┘
```

---

## 7. LISTA PRIORIZADA — IMPACTO vs ESFUERZO

### TIER 1 — Quick wins (implementar primero, alto impacto, bajo esfuerzo)

| # | Cambio | Impacto | Esfuerzo | Archivo |
|---|--------|---------|---------|---------|
| 1 | **Sección de 3 servicios** en Home (comprar/vender/consignar) | ★★★★★ | 1-2hs | HomePublica.jsx |
| 2 | **CTA "Cotizá tu auto"** — sección destacada en Home | ★★★★★ | 1hs | HomePublica.jsx |
| 3 | **Selector de intención** en Contacto (comprar/vender/consignar) | ★★★★☆ | 1-2hs | ContactoPublico.jsx |
| 4 | **Formulario de tasación rápida** (marca/modelo/año → WA) | ★★★★☆ | 2hs | ContactoPublico.jsx |
| 5 | **react-helmet** para meta tags por página | ★★★★☆ | 2hs | 4 screens |
| 6 | **"¿Qué incluye?"** en Detalle (VTV, doc, revisión) | ★★★★☆ | 1hs | DetallePublico.jsx |

### TIER 2 — Mejoras medias (implementar después de TIER 1)

| # | Cambio | Impacto | Esfuerzo | Archivo |
|---|--------|---------|---------|---------|
| 7 | **Banner "Vendé tu auto"** entre cards en catálogo | ★★★☆☆ | 1hs | CatalogoPublico.jsx |
| 8 | **Drawer de filtros en mobile** (slide-in desde abajo) | ★★★☆☆ | 3hs | CatalogoPublico.jsx |
| 9 | **"¿Tenés uno para vender?"** al final de Detalle | ★★★☆☆ | 1hs | DetallePublico.jsx |
| 10 | **Fix mapa mobile** en Home (stack vertical) | ★★★★☆ | 30min | HomePublica.jsx |
| 11 | **Keywords locales** en sección Visitanos (Benavídez, Tigre, zona norte) | ★★★☆☆ | 15min | HomePublica.jsx |

### TIER 3 — Inversión (para más adelante)

| # | Cambio | Impacto | Esfuerzo |
|---|--------|---------|---------|
| 12 | Testimoniales/reseñas en Home | ★★★☆☆ | 4hs + contenido real |
| 13 | Infinite scroll / paginación en catálogo | ★★★☆☆ | 4hs |
| 14 | og:image dinámica por vehículo | ★★★☆☆ | 2hs |
| 15 | Galería desktop con thumbs grid | ★★★☆☆ | 3hs |
| 16 | Google Business Profile | ★★★★★ | 30min (fuera del código) |
| 17 | Campañas Meta Ads | ★★★★★ | Requiere presupuesto |

---

## 8. COPY Y MENSAJES CLAVE

### Propuesta de valor principal
> "Tu próximo auto está en GH Cars. Comprá con confianza, vendé sin esperar."

### Para la sección COMPRAR
> "Amplio stock seleccionado · Cada auto revisado antes de la venta · Financiamiento disponible"

### Para la sección VENDER
> "Tomamos tu usado al mejor precio del mercado · Tasación en 2 minutos · Pago inmediato"

### Para la sección CONSIGNACIÓN
> "Vendemos tu auto por vos · Sin que tengas que lidiar con compradores · Gestionamos todo"

### CTA de tasación
> "¿Cuánto vale tu auto? Cotizá gratis en 2 minutos"

### Trust indicators
> "✅ Documentación en orden · ✅ VTV vigente · ✅ Revisión mecánica incluida"

### Hero subtitle con keyword local
> "Concesionaria en Benavídez, partido de Tigre, zona norte del GBA"

---

## 9. PRÓXIMOS PASOS (post-aprobación)

### Inmediato (código — Fase 2):
1. Sección servicios + CTA vendé en HomePublica
2. Selector intención + tasación en ContactoPublico
3. "Qué incluye" + CTA vender en DetallePublico
4. Fix mapa mobile + keywords locales
5. react-helmet para SEO

### Fuera del código (acciones manuales):
6. Crear/reclamar **Google Business Profile** en maps.google.com → mayor impacto en búsquedas locales
7. Publicar en **MercadoLibre Autos** → enlazar desde la web
8. **Instagram/TikTok**: contenido de "antes/después de cada auto", proceso de entrega, testimoniales
9. Considerar **Meta Ads** con segmentación zona norte GBA + "interés en autos"

---

## APROBACIÓN REQUERIDA

⏸️ **PARADO aquí — esperando aprobación para Fase 2 (implementación)**

Para aprobar y empezar a codear, confirmar:
- [ ] Sección de 3 servicios en Home → ¿aprobado?
- [ ] CTA "Cotizá tu auto" en Home → ¿aprobado?
- [ ] Rediseño formulario Contacto (selector intención + tasación) → ¿aprobado?
- [ ] "¿Qué incluye?" en Detalle → ¿aprobado?
- [ ] react-helmet para SEO → ¿aprobado?
- [ ] Fix mapa mobile → ¿aprobado?

O simplemente decime "dale con todo el Tier 1" y arranco.
