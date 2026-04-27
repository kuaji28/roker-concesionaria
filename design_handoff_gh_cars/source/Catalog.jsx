// ── Catálogo público (mobile + web) ────────────────────────────

function CatalogMobile({ theme, onOpen }) {
  const c = theme.colors;
  const [tipo, setTipo] = React.useState('Todos');
  const [sort, setSort] = React.useState('precio_asc');

  const filtered = VEHICLES
    .filter(v => tipo === 'Todos' || v.tipo === tipo)
    .sort((a, b) => sort === 'precio_asc' ? a.precio - b.precio : b.precio - a.precio);

  return (
    <PhoneFrame theme={theme}>
      <div style={{ padding: '52px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => onOpen?.('home')} style={{ width: 36, height: 36, borderRadius: 999, background: c.card, border: `1px solid ${c.border}`, color: c.fg, display: 'grid', placeItems: 'center' }}>
          <ArrowIcon dir="left" size={14} />
        </button>
        <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: c.fg }}>Catálogo</p>
        <ThemeToggle theme={theme} />
      </div>

      {/* Search */}
      <div style={{ padding: '8px 20px 12px' }}>
        <div style={{
          padding: '12px 16px', background: c.card, border: `1px solid ${c.border}`,
          borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.fg2} strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
          <input placeholder="Marca, modelo, año…" style={{
            flex: 1, background: 'transparent', border: 0, outline: 'none',
            color: c.fg, fontSize: 14, fontFamily: 'inherit',
          }} />
        </div>
      </div>

      {/* Type chips */}
      <div style={{ padding: '0 20px 12px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {['Todos', 'Auto', 'SUV', 'Pickup'].map(t => (
          <button key={t} onClick={() => setTipo(t)} style={{
            padding: '8px 16px', borderRadius: 999, whiteSpace: 'nowrap',
            background: tipo === t ? c.fg : c.card,
            color: tipo === t ? c.bg : c.fg,
            border: tipo === t ? 'none' : `1px solid ${c.border}`,
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit',
          }}>{t}</button>
        ))}
      </div>

      {/* Result count + sort */}
      <div style={{ padding: '0 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 12, color: c.fg2, margin: 0 }}>{filtered.length} unidades</p>
        <button onClick={() => setSort(s => s === 'precio_asc' ? 'precio_desc' : 'precio_asc')} style={{
          background: 'transparent', border: 0, color: c.fg, fontSize: 12, fontWeight: 600,
          display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer',
        }}>
          Precio {sort === 'precio_asc' ? '↑' : '↓'}
        </button>
      </div>

      {/* Grid 2 columns */}
      <div style={{ padding: '0 20px 100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {filtered.map(v => (
          <TiltCard key={v.id} intensity={0.4} style={{ borderRadius: 14, overflow: 'hidden', background: c.card, border: `1px solid ${c.border}` }}>
            <div onClick={() => onOpen?.('detail', v.id)} style={{ cursor: 'pointer' }}>
              <div style={{ position: 'relative', aspectRatio: '4/3' }}>
                <img src={v.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 8, left: 8, padding: '2px 8px', background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(8px)', borderRadius: 4, fontSize: 9, fontWeight: 700, letterSpacing: '.06em', color: '#fff' }}>{v.anio}</div>
                <button style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 999, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(8px)', border: 0, color: '#fff', display: 'grid', placeItems: 'center' }}>
                  <HeartIcon size={12} />
                </button>
              </div>
              <div style={{ padding: '10px 12px 12px' }}>
                <p style={{ fontSize: 9, color: c.fg2, margin: 0, textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600 }}>{v.marca}</p>
                <h4 style={{ fontSize: 13, fontWeight: 700, margin: '2px 0 1px', color: c.fg, letterSpacing: '-0.01em', lineHeight: 1.2 }}>{v.modelo}</h4>
                <p style={{ fontSize: 10, color: c.fg2, margin: 0 }}>{fmt(v.km)} km</p>
                <p style={{ fontSize: 14, fontWeight: 800, margin: '6px 0 0', color: c.fg, letterSpacing: '-0.02em' }}>USD {fmt(v.precio)}</p>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>

      <MobileBottomNav theme={theme} active="catalog" onNav={onOpen} />
    </PhoneFrame>
  );
}

function CatalogWeb({ theme, onOpen }) {
  const c = theme.colors;
  const [tipo, setTipo] = React.useState('Todos');
  const [precioMax, setPrecioMax] = React.useState(60000);
  const [sort, setSort] = React.useState('precio_asc');

  const filtered = VEHICLES
    .filter(v => tipo === 'Todos' || v.tipo === tipo)
    .filter(v => v.precio <= precioMax)
    .sort((a, b) => sort === 'precio_asc' ? a.precio - b.precio : b.precio - a.precio);

  return (
    <div style={{ background: c.bg, color: c.fg, minHeight: '100%' }}>
      <PublicTopBar theme={theme} active="catalog" onNav={onOpen} />

      {/* Header */}
      <div style={{ padding: '48px 56px 24px' }}>
        <p style={{ fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: c.accent, margin: 0, fontWeight: 600 }}>{filtered.length} unidades en stock</p>
        <h1 style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.03em', margin: '12px 0 0', lineHeight: 1 }}>Catálogo completo</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32, padding: '0 56px 64px' }}>
        {/* Sidebar filters */}
        <aside style={{ position: 'sticky', top: 88, alignSelf: 'flex-start', maxHeight: 'calc(100vh - 100px)' }}>
          <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 16, padding: 20 }}>
            <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: c.fg2, margin: 0, fontWeight: 700 }}>Tipo</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 10 }}>
              {['Todos', 'Auto', 'SUV', 'Pickup'].map(t => (
                <button key={t} onClick={() => setTipo(t)} style={{
                  padding: '8px 12px', borderRadius: 8, textAlign: 'left',
                  background: tipo === t ? c.bg : 'transparent',
                  color: tipo === t ? c.fg : c.fg2,
                  border: 0, fontSize: 13, fontWeight: tipo === t ? 600 : 500,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>{t}</button>
              ))}
            </div>

            <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${c.border}` }}>
              <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: c.fg2, margin: 0, fontWeight: 700 }}>Precio máx</p>
              <p style={{ fontSize: 18, fontWeight: 800, margin: '8px 0 0', letterSpacing: '-0.02em' }}>USD {fmt(precioMax)}</p>
              <input type="range" min="10000" max="80000" step="1000" value={precioMax}
                onChange={e => setPrecioMax(Number(e.target.value))}
                style={{ width: '100%', marginTop: 8, accentColor: c.accent }}
              />
            </div>

            <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${c.border}` }}>
              <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: c.fg2, margin: 0, fontWeight: 700 }}>Año</p>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <input placeholder="Desde" style={{ flex: 1, padding: '8px 10px', background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, fontSize: 13, color: c.fg, outline: 'none', fontFamily: 'inherit' }} />
                <input placeholder="Hasta" style={{ flex: 1, padding: '8px 10px', background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, fontSize: 13, color: c.fg, outline: 'none', fontFamily: 'inherit' }} />
              </div>
            </div>

            <button style={{ width: '100%', marginTop: 20, padding: '10px 14px', background: 'transparent', color: c.fg2, border: `1px solid ${c.border}`, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Limpiar filtros</button>
          </div>
        </aside>

        {/* Results */}
        <div>
          {/* Sort bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: c.fg2, margin: 0 }}>Mostrando {filtered.length} de {VEHICLES.length} unidades</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <select value={sort} onChange={e => setSort(e.target.value)} style={{
                padding: '8px 12px', background: c.card, color: c.fg,
                border: `1px solid ${c.border}`, borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none',
              }}>
                <option value="precio_asc">Precio: menor a mayor</option>
                <option value="precio_desc">Precio: mayor a menor</option>
              </select>
            </div>
          </div>

          {/* Grid 3 cols with TILT */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {filtered.map(v => (
              <TiltCard key={v.id} intensity={0.6} style={{
                borderRadius: 18, overflow: 'hidden',
                background: c.card, border: `1px solid ${c.border}`, cursor: 'pointer',
              }}>
                <div onClick={() => onOpen?.('detail', v.id)}>
                  <div style={{ position: 'relative', aspectRatio: '4/3' }}>
                    <img src={v.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: 12, left: 12, padding: '3px 10px', background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(8px)', borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#fff' }}>{v.anio}</div>
                    <button style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 999, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(8px)', border: 0, color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
                      onClick={e => e.stopPropagation()}>
                      <HeartIcon size={14} />
                    </button>
                  </div>
                  <div style={{ padding: '14px 16px 16px' }}>
                    <p style={{ fontSize: 10, color: c.fg2, margin: 0, textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600 }}>{v.marca}</p>
                    <h3 style={{ fontSize: 17, fontWeight: 700, margin: '3px 0 1px', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{v.modelo}</h3>
                    <p style={{ fontSize: 11, color: c.fg2, margin: 0 }}>{v.version}</p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 10, padding: '2px 8px', background: c.bg, borderRadius: 4, color: c.fg2 }}>{fmt(v.km)} km</span>
                      <span style={{ fontSize: 10, padding: '2px 8px', background: c.bg, borderRadius: 4, color: c.fg2 }}>{v.transmision}</span>
                    </div>
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${c.border}`, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ fontSize: 10, color: c.fg2 }}>USD</span>
                      <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.02em' }}>{fmt(v.precio)}</span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CatalogMobile, CatalogWeb });
