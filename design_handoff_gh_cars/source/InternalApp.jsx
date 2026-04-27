// ── Internal Catalogo (table + cards toggle) + Login ───────────

const ESTADO_META = {
  disponible:    { label: 'Disponible',    color: '#22c55e' },
  señado:        { label: 'Señado',        color: '#f59e0b' },
  en_revision:   { label: 'En revisión',   color: '#3b82f6' },
  en_preparacion:{ label: 'En preparación',color: '#8b5cf6' },
  vendido:       { label: 'Vendido',       color: '#ef4444' },
};

function StateBadge({ estado, theme, small }) {
  const m = ESTADO_META[estado] || ESTADO_META.disponible;
  const c = theme.colors;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: small ? '2px 8px' : '4px 10px',
      borderRadius: 999, fontSize: small ? 10 : 11, fontWeight: 600,
      background: m.color + '22', color: m.color, border: `1px solid ${m.color}33`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: m.color }} />
      {m.label}
    </span>
  );
}

function InternalCatalog({ theme }) {
  const c = theme.colors;
  const [view, setView] = React.useState('table');

  // attach dummy estados
  const rows = VEHICLES.map((v, i) => ({
    ...v,
    estado: ['disponible','disponible','disponible','señado','en_revision','disponible','en_preparacion','disponible'][i] || 'disponible',
    patente: ['AB123CD','AC456EF','AD789GH','AE012IJ','AF345KL','AG678MN','AH901OP','AI234QR'][i],
  }));

  return (
    <div style={{ padding: '24px 28px 48px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: c.accent, margin: 0, fontWeight: 600 }}>{rows.length} vehículos</p>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: '4px 0 0', letterSpacing: '-0.03em' }}>Catálogo</h1>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'inline-flex', padding: 3, background: c.card, borderRadius: 10, border: `1px solid ${c.border}` }}>
            {['table', 'cards'].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '6px 12px', borderRadius: 8,
                background: view === v ? c.bg : 'transparent',
                color: view === v ? c.fg : c.fg2,
                border: 0, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}>{v === 'table' ? 'Lista' : 'Tarjetas'}</button>
            ))}
          </div>
          <button style={{ padding: '10px 16px', background: c.accent, color: '#fff', border: 0, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>+ Ingresar vehículo</button>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['Todos', 'Disponible', 'Señado', 'En revisión', 'Vendido'].map((t, i) => (
          <button key={t} style={{
            padding: '8px 14px', borderRadius: 999,
            background: i === 0 ? c.fg : c.card,
            color: i === 0 ? c.bg : c.fg2,
            border: i === 0 ? 'none' : `1px solid ${c.border}`,
            fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>{t}</button>
        ))}
        <div style={{ flex: 1 }} />
        <select style={{ padding: '8px 12px', background: c.card, border: `1px solid ${c.border}`, borderRadius: 8, color: c.fg, fontSize: 12, fontFamily: 'inherit' }}>
          <option>Tipo: Todos</option>
        </select>
      </div>

      {view === 'table' ? (
        <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 60px', gap: 0, padding: '12px 16px', borderBottom: `1px solid ${c.border}`, background: c.bg, fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: c.fg2, fontWeight: 700 }}>
            <span>Vehículo</span><span>Patente</span><span>Estado</span><span>Km</span><span>Año</span><span>Precio USD</span><span></span>
          </div>
          {rows.map((v, i) => (
            <div key={v.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 60px', gap: 0, alignItems: 'center',
              padding: '12px 16px', borderBottom: i < rows.length - 1 ? `1px solid ${c.border}` : 'none',
              cursor: 'pointer', fontSize: 13,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 56, height: 40, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: c.bg }}>
                  <img src={v.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: c.fg, margin: 0 }}>{v.marca} {v.modelo}</p>
                  <p style={{ fontSize: 11, color: c.fg2, margin: 0 }}>{v.version}</p>
                </div>
              </div>
              <span style={{ fontSize: 12, color: c.fg2, fontFamily: 'ui-monospace, monospace' }}>{v.patente}</span>
              <div><StateBadge estado={v.estado} theme={theme} small /></div>
              <span style={{ fontSize: 12, color: c.fg }}>{fmt(v.km)}</span>
              <span style={{ fontSize: 12, color: c.fg }}>{v.anio}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: c.fg, letterSpacing: '-0.01em' }}>{fmt(v.precio)}</span>
              <button style={{ background: 'transparent', border: 0, color: c.fg2, cursor: 'pointer', display: 'grid', placeItems: 'center', padding: 4 }}>
                <ArrowIcon size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {rows.map(v => (
            <TiltCard key={v.id} intensity={0.4} style={{ borderRadius: 14, background: c.card, border: `1px solid ${c.border}`, overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ aspectRatio: '4/3' }}>
                <img src={v.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '12px 14px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <p style={{ fontSize: 10, color: c.fg2, margin: 0, textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600 }}>{v.marca} · {v.anio}</p>
                  <StateBadge estado={v.estado} theme={theme} small />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: c.fg }}>{v.modelo}</h3>
                <p style={{ fontSize: 11, color: c.fg2, margin: '2px 0 0' }}>{v.patente} · {fmt(v.km)} km</p>
                <p style={{ fontSize: 16, fontWeight: 800, margin: '8px 0 0', color: c.fg, letterSpacing: '-0.02em' }}>USD {fmt(v.precio)}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      )}
    </div>
  );
}

function InternalLogin({ theme }) {
  const c = theme.colors;
  return (
    <div style={{
      width: '100%', height: '100%', minHeight: 700,
      background: c.bg, color: c.fg,
      display: 'grid', gridTemplateColumns: '1fr 1fr',
    }}>
      {/* Left: brand panel */}
      <div style={{
        background: `linear-gradient(135deg, ${c.bg2} 0%, ${c.bg} 100%)`,
        position: 'relative', overflow: 'hidden',
        padding: 56, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: 999, background: c.accent + '22', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: 999, background: c.accent + '15', filter: 'blur(60px)' }} />

        <div style={{ position: 'relative' }}>
          <Logo height={56} theme={theme} />
        </div>

        <div style={{ position: 'relative' }}>
          <p style={{ fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', color: c.accent, margin: 0, fontWeight: 700 }}>Sistema interno</p>
          <h1 style={{ fontSize: 56, fontWeight: 800, margin: '12px 0 0', letterSpacing: '-0.03em', lineHeight: 1, color: c.fg }}>
            Gestión<br/>Automotriz
          </h1>
          <p style={{ fontSize: 15, color: c.fg2, margin: '20px 0 0', maxWidth: 400, lineHeight: 1.6 }}>
            Stock, ventas, leads y reportes — todo en un solo lugar.
          </p>
        </div>

        <p style={{ fontSize: 12, color: c.fg3, margin: 0, position: 'relative' }}>v3.2 · {ADDRESS}</p>
      </div>

      {/* Right: form */}
      <div style={{ display: 'grid', placeItems: 'center', padding: 56, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 24, right: 24 }}>
          <ThemeToggle theme={theme} />
        </div>

        <div style={{ width: 360 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Iniciar sesión</h2>
          <p style={{ fontSize: 14, color: c.fg2, margin: '6px 0 32px' }}>Ingresá con tu usuario y PIN.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: c.fg2, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Usuario</label>
              <input placeholder="Gustavo, Juan, María…" defaultValue="Gustavo" style={{
                width: '100%', padding: '12px 14px', background: c.card, border: `1px solid ${c.border}`,
                borderRadius: 10, color: c.fg, fontSize: 14, outline: 'none', fontFamily: 'inherit',
              }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: c.fg2, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>PIN</label>
              <input type="password" placeholder="••••" style={{
                width: '100%', padding: '12px 14px', background: c.card, border: `1px solid ${c.border}`,
                borderRadius: 10, color: c.fg, fontSize: 14, outline: 'none', fontFamily: 'inherit', letterSpacing: '.4em',
              }} />
            </div>

            <button style={{
              width: '100%', padding: '14px', marginTop: 8,
              background: c.accent, color: '#fff', border: 0,
              borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}>Acceder →</button>

            <p style={{ fontSize: 12, color: c.fg3, margin: '8px 0 0', textAlign: 'center' }}>
              ¿Olvidaste tu PIN? Hablá con el administrador.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InternalApp({ theme }) {
  const c = theme.colors;
  const [collapsed, setCollapsed] = React.useState(false);
  const [active, setActive] = React.useState('dashboard');
  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 900, background: c.bg, color: c.fg }}>
      <InternalSidebar theme={theme} active={active} onNav={setActive} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <InternalTopBar theme={theme} />
        {active === 'dashboard' && <InternalDashboard theme={theme} />}
        {active === 'catalog'   && <InternalCatalog theme={theme} />}
        {active === 'reports'   && <AnalyticsView theme={theme} />}
        {active !== 'dashboard' && active !== 'catalog' && active !== 'reports' && (
          <div style={{ padding: 56, textAlign: 'center', color: c.fg2 }}>
            <p style={{ fontSize: 14 }}>Sección "{active}" — placeholder. Hacé click en Dashboard o Catálogo.</p>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { InternalCatalog, InternalLogin, InternalApp, StateBadge });
