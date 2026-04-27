# Handoff: GH Cars — Sitio público + App interna + App vendedor mobile

## Overview

GH Cars es una concesionaria de autos usados ubicada en **Av. Juan Domingo Perón 2440, Benavidez, Buenos Aires**. Este handoff cubre **el rediseño completo del producto digital**, organizado en 3 superficies:

1. **Sitio público (web + mobile)** — donde los clientes finales descubren el catálogo y se contactan.
2. **App interna (desktop)** — donde el dueño y vendedores gestionan stock, ventas, leads y métricas.
3. **App del vendedor (mobile)** — un set reducido de pantallas para vendedores en la calle / fuera del local.

---

## About the Design Files

Los archivos en este bundle son **referencias de diseño creadas en HTML** — prototipos que muestran el look & feel y comportamiento esperado, **no código de producción para copiar directamente**.

La tarea es **recrear estos diseños en un codebase real** usando un stack moderno (recomendación abajo), respetando los design tokens, patrones de componentes y comportamientos descriptos en este README.

Los HTML están construidos con React 18 + Babel inline (sin bundler) para poder previsualizarse en navegador sin build. El stack final será distinto.

---

## Fidelity

**High-fidelity.** Las pantallas tienen colores finales, tipografía definida, espaciados específicos, micro-interacciones (tilt 3D en cards), dark/light mode completo, y todos los componentes están diseñados con detalle pixel-perfect. El developer debe recrearlas pixel-perfect en el stack final.

---

## Stack recomendado

El usuario confirmó que **no tiene backend** todavía y quiere arrancar con datos simulados. Recomendación:

```
Framework:   Next.js 14 (App Router) + React 18 + TypeScript
Estilos:     Tailwind CSS + CSS variables (para tokens dark/light)
UI base:     Radix UI primitives (Dialog, Popover, Select, Toggle)
Iconos:      Lucide React
Charts:      Recharts (para Analytics)
Mapas:       @vis.gl/react-google-maps  (Google Maps embed)
Estado:      Zustand (global) + React Query (server)
Forms:       React Hook Form + Zod
Persistencia: localStorage para favoritos/tema; mock JSON para vehículos
i18n:        Solo español rioplatense (ARS, formato local)
```

**Datos:** Para arrancar, todos los vehículos, leads, métricas y usuarios viven en archivos JSON locales (`/mocks/*.json`). El developer puede mockear con MSW (Mock Service Worker) para que el día de mañana sea trivial conectar a una API real.

---

## Diseño general — Visual identity

### Estética: "Sport-dark"
- Mood: deportivo, agresivo, premium-accesible. Inspiración: dashboards de Tesla, sitios de Porsche/AMG.
- Por defecto **dark mode** (90% del uso); light mode disponible como toggle.
- Acento principal: **rojo carmín** (`#dc2626`) — usado en CTAs, hovers, alertas, gradientes hero.
- Tipografía display sans-serif con tracking ajustado y pesos pesados (700–800).
- Layouts asimétricos, mucho aire negativo, números grandes (precios, KPIs).
- Cards con tilt 3D sutil (perspective-based) en hover.

### Mapa real
La home tiene Google Maps embed apuntando a la dirección real:
`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284...&center=Av.+Juan+Domingo+Perón+2440,+Benavidez`

Coordenadas: `-34.4118, -58.6951` (aprox).

---

## Design Tokens

Implementar como CSS variables en `:root` y `[data-theme="light"]`. Ver `source/theme.jsx` para la fuente de verdad.

### Colores — Dark theme (default)

```css
--bg:        #0a0a0c;   /* fondo principal */
--bg2:       #131317;   /* paneles, sidebars */
--card:      #1a1a20;   /* cards, inputs */
--border:    #2a2a32;
--fg:        #fafafa;   /* texto principal */
--fg2:       #a1a1aa;   /* texto secundario */
--fg3:       #71717a;   /* texto deshabilitado / labels */
--accent:    #dc2626;   /* rojo carmín — CTAs, alertas críticas */
--success:   #22c55e;
--warning:   #f59e0b;
--info:      #3b82f6;
```

### Colores — Light theme

```css
--bg:        #fafaf7;   /* warm off-white */
--bg2:       #f0efe9;
--card:      #ffffff;
--border:    #e5e4dd;
--fg:        #0a0a0c;
--fg2:       #52525b;
--fg3:       #a1a1aa;
--accent:    #dc2626;   /* mismo rojo */
--success:   #16a34a;
--warning:   #d97706;
--info:      #2563eb;
```

### Tipografía

```
Family: 'Inter', system-ui, sans-serif
Pesos: 400 (body), 500 (UI labels), 600 (subtítulos), 700 (titulares), 800 (display / KPIs)

Escala:
  10px / .65rem   — micro labels uppercase con letter-spacing 0.08–0.18em
  11px / .7rem    — caption / metadata
  12px / .75rem   — UI default secundario
  13px / .8rem    — UI default
  14px / .875rem  — body
  16px / 1rem     — body destacado
  18px / 1.125rem — subtítulo
  24–32px         — títulos sección
  36–56px         — display (precios, KPIs grandes)

Letter-spacing: -0.03em en displays, -0.02em en subtítulos, .08–.18em en labels uppercase.
```

### Espaciado

Escala de 4px: `4, 8, 12, 14, 16, 18, 20, 22, 24, 28, 32, 40, 48, 56, 64`.
- Padding interno cards: 18–22px.
- Gap entre cards en grids: 16px.
- Padding contenedores principales: 24–28px (desktop), 16px (mobile).

### Border radius

```
6px  — chips, badges, inputs pequeños
8px  — botones secundarios, badges medianos
10px — botones primarios, inputs
12px — cards mobile, modales
14px — cards desktop
16px — cards grandes (KPIs)
20px — hero cards, panels destacados
44px — bordes de phone frame
999px — pills, avatares, dots
```

### Shadows

Casi no se usan en dark mode. En light:
- Cards: `0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)`
- Hover/elevación: `0 8px 24px rgba(0,0,0,.08)`
- Tilt cards: shadow dinámica que sigue al cursor (ver `primitives.jsx → TiltCard`).

---

## Estructura del producto

### A. Sitio público

```
/                          → Home (hero + featured + categorías + mapa + CTA WhatsApp)
/catalogo                  → Catálogo público con filtros
/catalogo/[slug]           → Detalle de vehículo
/contacto                  → Form + mapa + datos
```

### B. App interna (admin)

```
/admin/login               → Login (split panel)
/admin                     → Dashboard
/admin/catalogo            → Lista vehículos (tabla + tarjetas toggle)
/admin/catalogo/nuevo      → Form ingresar vehículo
/admin/catalogo/[id]       → Detalle + edición
/admin/ventas              → Pipeline de ventas
/admin/leads               → Pipeline de leads
/admin/clientes            → CRM
/admin/agenda              → Calendario
/admin/reportes            → Analytics (visitas, clicks, conversión)
/admin/admin/*             → Sección admin avanzada (gerente, gastos, rotación, vendedores, settings)
```

### C. App vendedor (mobile-first, también accesible desde desktop pero pensada para celular)

```
/vendedor                  → Catálogo rápido (búsqueda + lista)
/vendedor/v/[id]           → Detalle + compartir + crear lead
/vendedor/lead/nuevo       → Form rápido nuevo lead
/vendedor/mensajes         → Inbox de mensajes
```

---

## Pantallas — detalle

### 1. Home pública (`/`)

**Archivo de referencia:** `prototypes/Sitio Publico.html` → sección "Home"

**Estructura (top → bottom):**

1. **Top bar** — Logo a la izquierda, nav (Catálogo, Vender mi auto, Contacto) centro, theme toggle + WhatsApp button derecha. Sticky con backdrop-blur.
2. **Hero** — Full-bleed, asimétrico:
   - Lado izquierdo (60%): título display 64px "Encontrá tu próxima 4×4." (editable copy), CTA primario rojo + secundario outline.
   - Lado derecho (40%): foto hero del último vehículo destacado (Ford Ranger), con tilt 3D en hover.
   - Background: gradiente sutil `radial-gradient(circle at 70% 30%, rgba(220,38,38,.08), transparent 50%)`.
3. **Stats strip** — 4 números grandes (vehículos en stock, ventas/mes, años en el mercado, clientes felices). Tipografía 800/56px.
4. **Categorías** — 4 chips iconográficos (Pickups, SUVs, Sedanes, Hatchbacks) que linkean a `/catalogo?tipo=X`.
5. **Featured grid** — 6 vehículos destacados en grid 3×2. Cards con tilt 3D, badge de estado, precio USD destacado, mini-info (km, año). Hover → CTA "Ver detalle" aparece.
6. **Mapa + CTA** — Google Maps embed de la dirección real + card overlay con: dirección, horarios, teléfono, botón "Cómo llegar" (linkea a Google Maps app), botón WhatsApp.
7. **Footer** — Logo, links rápidos, redes sociales (Instagram, Facebook), dirección, copyright.

**Interacciones:**
- Cards de vehículo: tilt 3D en mousemove (ver `primitives.jsx → TiltCard`), `transform: perspective(1000px) rotateX(...) rotateY(...)`, max 8° de rotación.
- Theme toggle: 3 estados (light / auto / dark), persistido en localStorage.
- WhatsApp button: abre `https://wa.me/<phone>?text=Hola%20vi%20su%20catálogo`.

### 2. Catálogo público (`/catalogo`)

**Archivo:** `prototypes/Catalogo Publico.html`

- Sidebar de filtros (sticky a la izquierda, 280px): Marca (multi), Tipo (chips), Año (slider), Precio USD (slider doble), Km (slider), Combustible, Caja.
- Grid de resultados (3 columnas desktop, 2 tablet, 1 mobile): cards con tilt 3D, badge de estado, foto, marca/modelo/año, km, precio.
- Top bar: contador de resultados, ordenar por (Relevancia / Precio asc / Precio desc / Año desc / Km asc), toggle vista grid/lista.
- Pagination o infinite scroll (preferido).

### 3. Detalle público (`/catalogo/[slug]`)

**Archivo:** `prototypes/Sitio Publico.html` → sección "Detalle"

- **Header sticky** con back, título, share, favorito.
- **Galería** — Foto principal grande + thumbnails. Click en thumbnail cambia principal. Soporta swipe en mobile.
- **Info principal** — Marca + año en uppercase rojo, modelo en display 32px, versión, **precio USD enorme + equivalente ARS al TC del día**.
- **Specs grid** — 6 stats (Año, Km, Combustible, Caja, Color, Patente parcial).
- **Descripción** — texto markdown del vendedor.
- **Equipamiento** — chips (ABS, Airbags, GPS, etc.).
- **CTA fijo bottom** — Botón "Contactar" rojo full-width + iconos de WhatsApp / llamada.
- **Sección "Similares"** — 4 vehículos relacionados con tilt cards.

### 4. Dashboard interno (`/admin`)

**Archivo:** `prototypes/App Interna.html` → sección "Dashboard"

**Layout:** Sidebar (232px expandida / 72px colapsada) + topbar + grid de cards.

**Topbar:** Search global con `/` keybind, theme toggle, notificaciones con badge, avatar usuario con rol coloreado.

**Sidebar:**
- Logo + brand
- Nav principal: Dashboard, Catálogo, Buscar, Ingresar, Ventas, Prospectos, Clientes, Agenda, Reportes
- Separador "ADMIN"
- Nav admin: Dashboard Gerente, Gastos & Margen, Rotación stock, Vendedores, Configuración
- Card cotización USD del día
- Botón colapsar / expandir

**Dashboard layout (4-col grid, 16px gap):**

Row 1:
- **Hero card** (col-span-2) — Gradiente rojo→carmín, "Ventas del mes: 14 vehículos", delta +23%, sparkline blanca.
- **Mini stat: Stock total** (1 col) — 20 unidades, sparkline.
- **Mini stat: Ingresos USD** (1 col) — $412k, sparkline verde.

Row 2 (2-col):
- **Stock por estado** — Barra apilada horizontal + leyenda (Disponibles 11 / Señados 3 / En revisión 2 / Vendidos 4).
- **Necesitan atención** — Lista de alertas con border-left de color (VTV vencida, seña por vencer, leads sin contactar).

Row 3 (1.4fr / 1fr):
- **Actividad reciente** — Timeline de eventos (venta cerrada, ingreso nuevo, lead, seña recibida, service completado) con ícono coloreado, descripción, tiempo, usuario.
- **Top vendedores** — Ranking con avatar, ventas, ingresos, barra de progreso.

### 5. Catálogo interno (`/admin/catalogo`)

**Archivo:** `prototypes/App Interna.html` → sección "Catálogo interno"

- **Toggle Lista / Tarjetas** (segmented control).
- **Filter chips** (Todos / Disponible / Señado / En revisión / Vendido) + dropdown "Tipo".
- **Vista Lista:** tabla densa con cols `Vehículo (thumb + nombre) · Patente · Estado (badge) · Km · Año · Precio USD · ›`.
- **Vista Tarjetas:** grid 4-col con tilt cards.
- CTA "+ Ingresar vehículo" en topbar de la sección.

### 6. Métricas (`/admin/reportes`)

**Archivo:** `prototypes/App Interna.html` → sección "Métricas del catálogo público"

**Esta es la pantalla más compleja. Componentes:**

1. **Hero KPIs** (4 cols) — Visitas catálogo (12.480 +18%), Click contactar (312 +24%), WhatsApp (248 +32%), Tiempo medio (3:42).
2. **Tráfico al catálogo** — AreaChart de visitas + contactos (overlay 2 series) en 30 días, con leyenda y totales.
3. **Embudo de conversión** — Visitas → Vieron vehículo → Click contacto → Lead calificado → Cerró venta. Cada paso muestra conteo, %, y % de drop-off al siguiente.
4. **Tabla "Vehículos más vistos"** — Top 8 con cols `# · Vehículo · Visitas (con barra) · Contacto · WhatsApp · Instagram · Favorito · CTR%`. Tab selector 7d/30d/90d.
5. **Clicks por botón** — Lista de botones tracked: Contactar, WhatsApp directo, Llamar, Compartir, Favoritos, Ver financiación, Parte de pago, Instagram footer. Cada uno muestra clicks + delta% vs mes anterior + barra. Botón "Exportar CSV".
6. **Canal de contacto** — De dónde llegan los leads: WhatsApp 48%, Llamada 22%, Instagram 18%, Email 8%, Form 4%. Con barras + ícono de cada canal.
7. **Dispositivos** — Donut chart (Mobile 68% / Desktop 26% / Tablet 6%) con conteo total al centro.

**Eventos a trackear (cuando se conecte analytics real):**

```
ts                          ISO timestamp
event_name                  'view_catalog' | 'view_vehicle' | 'click_contact' | 'click_whatsapp' | 'click_call' | 'click_share' | 'click_favorite' | 'click_finance' | 'click_trade_in' | 'click_instagram' | 'lead_created' | 'sale_closed'
vehicle_id                  string | null
session_id                  string
device_type                 'mobile' | 'desktop' | 'tablet'
referrer                    string | null
button_position             string (e.g. 'detail-cta-bottom', 'card-grid', 'footer')
```

### 7. Login (`/admin/login`)

**Archivo:** `prototypes/App Interna.html` → sección "Login"

- Split 50/50.
- Izquierda: panel de marca con blur orbs (gradiente rojo difuso), logo grande, título "Sistema interno · Gestión Automotriz", versión + dirección.
- Derecha: form simple (Usuario + PIN) + theme toggle arriba derecha. Botón "Acceder →" rojo full-width.

### 8. App vendedor mobile (`/vendedor/*`)

**Archivo:** `prototypes/App Interna.html` → sección "Mobile · App del vendedor"

3 pantallas en phone frames de 390×844 (iPhone 14 Pro):

#### 8a. Catálogo rápido
- Top bar con logo + botón filtros.
- Search box prominente.
- Chips horizontales scrolleables (Todos / Disponible / < USD 30k / SUV / Pickup).
- Lista vertical compacta — cada item: thumbnail 88×66, marca/año uppercase, modelo, km + combustible, precio USD, **botón verde redondo de WhatsApp directo** (envía mensaje pre-armado con info del vehículo).
- Bottom tabs: Catálogo (active) / Nuevo lead / Mensajes (badge 3).

#### 8b. Detalle + compartir
- Header con back, share-out icon.
- Foto + galería counter "1/12".
- Marca/año uppercase rojo, modelo display.
- Precio USD + equivalente ARS.
- Specs grid 2×2 (Km / Combustible / Caja / Patente).
- **Sección Compartir** — Grid de 4 botones: WhatsApp (verde), Link (azul), Instagram (rosa), Email (amarillo). Cada uno copia/abre el deep link correspondiente con info pre-armada del vehículo.
- CTA fijo bottom: "Crear lead" rojo full-width.

#### 8c. Nuevo lead
- Card de contexto del vehículo (foto + nombre + precio + "Cambiar").
- Form: Nombre, Teléfono, Email (opcional).
- Chips "Cómo se enteró": WhatsApp / Instagram / Web / Referido / Pasó por local.
- Textarea "Nota".
- Toggles iOS-style: parte de pago / financiación / recordatorio en 2 días.
- Botón "Guardar lead" fijo bottom (no rojo, sólido).

---

## Componentes compartidos

Ver `source/primitives.jsx`, `source/Chrome.jsx`, `source/InternalChrome.jsx`.

| Componente | Archivo | Descripción |
|---|---|---|
| `<TiltCard>` | primitives.jsx | Card con tilt 3D en mousemove (perspective + rotateX/Y) |
| `<Logo>` | primitives.jsx | Logo SVG GH Cars adaptado a dark/light |
| `<ThemeToggle>` | primitives.jsx | Toggle light/auto/dark (3 estados) |
| `<ArrowIcon>` | primitives.jsx | Flecha para CTAs y nav |
| `<TopBar>` | Chrome.jsx | Top bar del sitio público |
| `<Footer>` | Chrome.jsx | Footer público |
| `<InternalSidebar>` | InternalChrome.jsx | Sidebar admin colapsable |
| `<InternalTopBar>` | InternalChrome.jsx | Top bar admin con search global |
| `<StateBadge>` | InternalApp.jsx | Badge de estado de vehículo (5 variantes) |
| `<MobileFrame>` | MobileVendor.jsx | iPhone frame para mockear (no implementar — solo es marco visual) |
| `<MobileTabs>` | MobileVendor.jsx | Bottom tabs de la app vendedor |
| `<Sparkline>` | InternalDashboard.jsx | Mini línea + área para KPI cards |
| `<AreaChart>` | Analytics.jsx | Chart de área full-width |

---

## Datos mock

Ver `source/data.jsx` para la lista de vehículos. Estructura:

```ts
type Vehicle = {
  id: string;
  marca: string;          // "Ford"
  modelo: string;         // "Ranger"
  version: string;        // "Limited 3.2 4x4 AT"
  anio: number;           // 2024
  km: number;
  precio: number;         // USD
  combustible: 'Nafta' | 'Diesel' | 'GNC' | 'Híbrido' | 'Eléctrico';
  caja: 'Manual' | 'Automática';
  color: string;
  patente: string;        // "AB123CD"
  estado: 'disponible' | 'señado' | 'en_revision' | 'en_preparacion' | 'vendido';
  img: string;            // url Unsplash placeholder, reemplazar por fotos reales
  galeria?: string[];
  descripcion?: string;
  equipamiento?: string[];
  destacado?: boolean;
};
```

**Tipo de cambio:** constante `TC = 1180` (ARS por USD). En producción levantar de API (`https://dolarapi.com/v1/dolares/blue` o similar).

**Dirección, teléfono, redes:**
```
ADDRESS = 'Av. Juan Domingo Perón 2440, Benavidez, Buenos Aires'
PHONE = '+54 11 5234-8902'  // ← reemplazar por número real
INSTAGRAM = 'gh_cars_oficial' // ← confirmar handle real
GMAPS_URL = 'https://maps.google.com/?q=Av.+Juan+Domingo+Perón+2440,+Benavidez'
```

---

## Comportamiento — claves

### Theme switcher
3 estados (light / auto / dark). `auto` lee `prefers-color-scheme`. Persistir en localStorage `gh-theme`. Aplicar via `data-theme="dark"` en `<html>` y CSS variables.

### TiltCard (3D hover)
```js
onMouseMove(e) → calcular dx, dy desde el centro → rotateY = dx * intensity, rotateX = -dy * intensity → max 8° → transition .15s ease-out → reset on mouseleave
```

### Favoritos
Persistir array de vehicle IDs en localStorage `gh-favs`. Sync entre tabs con `storage` event.

### WhatsApp deep links
Cada botón de WhatsApp arma URL: `https://wa.me/${PHONE_DIGITS}?text=${encodeURIComponent(message)}`.
Mensaje pre-armado en detalle: `"Hola, vi el ${marca} ${modelo} ${anio} en USD ${precio}. Quería más info."`.

### Analytics (mock por ahora)
Crear hook `useTrackEvent()` que pushea a un array en memoria + console.log. El día de mañana, swap por gtag/posthog/server endpoint.

### Búsqueda global (admin)
Atajo `/` enfoca el input. Busca en vehículos (marca, modelo, patente), clientes (nombre, teléfono), leads.

---

## Responsive

| Breakpoint | Comportamiento |
|---|---|
| `< 640px` (mobile) | Sitio público: 1 columna, hero apilado, sidebar de filtros como drawer modal |
| `640–1024px` (tablet) | Grid 2 cols, sidebar admin colapsada por default |
| `> 1024px` (desktop) | Diseño completo como en mocks |

**App interna**: pensada para desktop. En mobile, redirigir a `/vendedor` automáticamente si el usuario tiene rol "vendedor".

---

## Assets a producir

Items que el developer/diseñador debe procurar antes de salir a producción:

- [ ] **Fotos reales** del catálogo (las actuales son Unsplash placeholders)
- [ ] **Logo SVG final** (el actual es una versión inferida — confirmar con el dueño)
- [ ] **Favicon + app icons** (PWA-ready)
- [ ] **OG images** (compartir en WhatsApp/redes)
- [ ] **Foto del local** (para Home + página Contacto)
- [ ] **Video hero opcional** (loopable, drone shot del local o reel de inventario)

---

## Files en este bundle

```
design_handoff_gh_cars/
├── README.md                          ← este archivo
├── prototypes/
│   ├── Sitio Publico.html             ← Home + Catálogo + Detalle (web + mobile)
│   ├── Catalogo Publico.html          ← Iteración previa del catálogo
│   └── App Interna.html               ← Dashboard + Catálogo + Métricas + Login + App vendedor
└── source/
    ├── theme.jsx                      ← Design tokens dark/light
    ├── data.jsx                       ← Datos mock (vehículos, dirección, TC)
    ├── primitives.jsx                 ← TiltCard, Logo, ThemeToggle, ArrowIcon
    ├── design-canvas.jsx              ← Canvas de presentación (NO implementar)
    ├── Chrome.jsx                     ← TopBar + Footer público
    ├── Home.jsx                       ← Landing pública
    ├── Catalog.jsx                    ← Catálogo público
    ├── Detail.jsx                     ← Detalle de vehículo
    ├── VariantC.jsx                   ← Wrapper de variantes públicas
    ├── InternalChrome.jsx             ← Sidebar + TopBar admin
    ├── InternalDashboard.jsx          ← Dashboard admin
    ├── InternalApp.jsx                ← Wrapper admin + Catálogo interno + Login
    ├── Analytics.jsx                  ← Pantalla de métricas
    └── MobileVendor.jsx               ← App del vendedor (3 pantallas)
```

---

## Orden de implementación recomendado

**Sprint 1 — Fundación + sitio público**
1. Setup Next.js 14 + TypeScript + Tailwind + tokens CSS variables (dark/light).
2. Layouts base, theme switcher, fuentes Inter.
3. Componentes shared: TiltCard, Logo, ArrowIcon, Sparkline.
4. Datos mock + tipos + utils (formatters, TC).
5. Home + Catálogo + Detalle público (desktop + mobile responsive).
6. Footer + WhatsApp deep links + Google Maps embed.

**Sprint 2 — Admin core**
7. Login + auth mockeada (NextAuth con credentials, JSON de usuarios).
8. Layout admin (Sidebar colapsable + TopBar).
9. Dashboard admin (KPIs + actividad).
10. Catálogo interno (lista + tarjetas + filtros + form ingresar/editar).

**Sprint 3 — Métricas + vendedor**
11. Pantalla de Reportes/Analytics completa con datos mock.
12. App vendedor mobile (3 pantallas) con bottom-tabs.
13. Sistema de eventos `useTrackEvent()` + persistencia mock.

**Sprint 4 — Pulido**
14. Animaciones (tilt, transitions, loading states).
15. Skeletons + empty states + error boundaries.
16. Accessibility audit (focus states, aria, keyboard nav).
17. Mobile drawer de filtros, swipe en galería, sheet patterns.
18. PWA + offline básico para vendedor.

---

## Cosas que el dueño todavía debe definir

- Número de teléfono real para WhatsApp.
- Handle real de Instagram / Facebook.
- Si quiere financiación propia o solo derivar a banco — afecta el flujo "Ver financiación".
- Estructura de comisiones de vendedores — afecta el dashboard del gerente.
- Si quiere multi-sucursal a futuro — afecta el data model.
