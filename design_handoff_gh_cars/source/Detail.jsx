// ── Detalle de vehículo (mobile + web) ─────────────────────────

function DetailMobile({ theme, vehicleId, onOpen }) {
  const c = theme.colors;
  const v = VEHICLES.find(x => x.id === vehicleId) || VEHICLES[2];
  const [photoIdx, setPhotoIdx] = React.useState(0);
  const fotos = v.fotos || [v.img];

  return (
    <PhoneFrame theme={theme} statusBarStyle="light">
      {/* Photo header full-bleed */}
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
        <TiltCard intensity={0.5} style={{ height: '100%', borderRadius: 0 }}>
          <img src={fotos[photoIdx]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </TiltCard>
        {/* gradient overlay top + bottom */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(180deg, rgba(0,0,0,.7), transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: `linear-gradient(180deg, transparent, ${c.bg})`, pointerEvents: 'none' }} />

        {/* Top controls */}
        <div style={{ position: 'absolute', top: 52, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <button onClick={() => onOpen?.('catalog')} style={{ width: 38, height: 38, borderRadius: 999, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(10px)', border: 0, color: '#fff', display: 'grid', placeItems: 'center' }}>
            <ArrowIcon dir="left" size={14} />
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ width: 38, height: 38, borderRadius: 999, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(10px)', border: 0, color: '#fff', display: 'grid', placeItems: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
            </button>
            <button style={{ width: 38, height: 38, borderRadius: 999, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(10px)', border: 0, color: '#fff', display: 'grid', placeItems: 'center' }}>
              <HeartIcon size={14} />
            </button>
          </div>
        </div>

        {/* Photo dots */}
        <div style={{ position: 'absolute', top: 100, left: 16, right: 16, display: 'flex', gap: 4 }}>
          {fotos.map((_, i) => (
            <div key={i} onClick={() => setPhotoIdx(i)} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i === photoIdx ? '#fff' : 'rgba(255,255,255,.3)',
              cursor: 'pointer',
            }} />
          ))}
        </div>
      </div>

      {/* Sliding info card over the photo */}
      <div style={{ marginTop: -80, padding: '0 20px', position: 'relative' }}>
        <div style={{
          background: c.card, border: `1px solid ${c.border}`, borderRadius: 24,
          padding: 22, boxShadow: c.shadow,
        }}>
          <p style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: c.accent, margin: 0, fontWeight: 700 }}>{v.marca} · {v.anio}</p>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '6px 0 2px', letterSpacing: '-0.02em', lineHeight: 1.05, color: c.fg }}>{v.modelo}</h1>
          <p style={{ fontSize: 13, color: c.fg2, margin: 0 }}>{v.version}</p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${c.border}` }}>
            <span style={{ fontSize: 12, color: c.fg2 }}>USD</span>
            <span style={{ fontSize: 32, fontWeight: 800, color: c.fg, letterSpacing: '-0.02em' }}>${fmt(v.precio)}</span>
          </div>
          <p style={{ fontSize: 11, color: c.fg2, margin: '2px 0 0' }}>≈ ARS {fmt(v.precio * TC)}</p>
        </div>
      </div>

      {/* Specs grid */}
      <div style={{ padding: '24px 20px 0' }}>
        <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: c.fg2, margin: 0, fontWeight: 700 }}>Ficha técnica</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginTop: 12, background: c.border, borderRadius: 14, overflow: 'hidden', border: `1px solid ${c.border}` }}>
          {[
            ['Año', v.anio],
            ['Kilómetros', `${fmt(v.km)} km`],
            ['Transmisión', v.transmision],
            ['Combustible', v.combustible],
            ['Color', v.color],
            ['Tipo', v.tipo],
          ].map(([k, val]) => (
            <div key={k} style={{ padding: '14px 14px', background: c.card }}>
              <p style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: c.fg2, margin: 0 }}>{k}</p>
              <p style={{ fontSize: 14, fontWeight: 700, margin: '3px 0 0', color: c.fg }}>{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div style={{ padding: '24px 20px 0' }}>
        <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: c.fg2, margin: 0, fontWeight: 700 }}>Descripción</p>
        <p style={{ fontSize: 14, color: c.fg, margin: '10px 0 0', lineHeight: 1.6 }}>
          {v.marca} {v.modelo} {v.anio} en excelente estado. Único dueño, service oficial al día.
          Llave de repuesto, manuales y verificación policial impecable. Recibimos tu usado en parte de pago.
        </p>
      </div>

      {/* Map mini */}
      <div style={{ padding: '24px 20px 0' }}>
        <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: c.fg2, margin: 0, fontWeight: 700 }}>Disponible en</p>
        <div style={{ marginTop: 10, borderRadius: 14, overflow: 'hidden', border: `1px solid ${c.border}` }}>
          <GhMap theme={theme} height={120} />
          <div style={{ padding: '12px 14px', background: c.card }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: c.fg, margin: 0 }}>{ADDRESS}</p>
            <p style={{ fontSize: 11, color: c.fg2, margin: '2px 0 0' }}>Lun a Sáb · 9 a 18hs</p>
          </div>
        </div>
      </div>

      {/* spacer for sticky CTA */}
      <div style={{ height: 110 }} />

      {/* Sticky CTA bar */}
      <div style={{
        position: 'absolute', bottom: 88, left: 0, right: 0,
        padding: '12px 20px',
        background: theme.resolved === 'dark' ? 'rgba(10,10,12,.95)' : 'rgba(255,255,255,.95)',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${c.border}`,
        display: 'flex', gap: 10,
      }}>
        <button style={{ flex: 1, padding: '14px', background: 'transparent', color: c.fg, border: `1px solid ${c.borderStrong}`, borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          Llamar
        </button>
        <a target="_blank" rel="noreferrer" href={`https://wa.me/541162692000?text=Hola!%20Me%20interesa%20el%20${v.marca}%20${v.modelo}%20${v.anio}`} style={{
          flex: 2, padding: '14px', background: c.accent, color: '#fff',
          borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer',
          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <WhatsAppIcon size={14} /> Consultar por WhatsApp
        </a>
      </div>

      <MobileBottomNav theme={theme} active="catalog" onNav={onOpen} />
    </PhoneFrame>
  );
}

function DetailWeb({ theme, vehicleId, onOpen }) {
  const c = theme.colors;
  const v = VEHICLES.find(x => x.id === vehicleId) || VEHICLES[2];
  const [photoIdx, setPhotoIdx] = React.useState(0);
  const fotos = v.fotos || [v.img];

  return (
    <div style={{ background: c.bg, color: c.fg, minHeight: '100%' }}>
      <PublicTopBar theme={theme} active="catalog" onNav={onOpen} />

      {/* Breadcrumb */}
      <div style={{ padding: '24px 56px 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: c.fg2 }}>
        <button onClick={() => onOpen?.('home')} style={{ background: 'transparent', border: 0, color: c.fg2, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, padding: 0 }}>Inicio</button>
        <span>/</span>
        <button onClick={() => onOpen?.('catalog')} style={{ background: 'transparent', border: 0, color: c.fg2, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, padding: 0 }}>Stock</button>
        <span>/</span>
        <span style={{ color: c.fg }}>{v.marca} {v.modelo}</span>
      </div>

      <div style={{ padding: '24px 56px 64px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 48, alignItems: 'flex-start' }}>
        {/* Photo gallery with TILT */}
        <div>
          <TiltCard intensity={0.7} style={{ borderRadius: 28, overflow: 'hidden', background: c.card, border: `1px solid ${c.border}`, boxShadow: c.shadow }}>
            <div style={{ position: 'relative', aspectRatio: '4/3' }}>
              <img src={fotos[photoIdx]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: 16, left: 16, padding: '4px 12px', background: c.accent, borderRadius: 8, fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', color: '#fff' }}>{v.anio}</div>
            </div>
          </TiltCard>

          {/* thumbnails */}
          {fotos.length > 1 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {fotos.map((src, i) => (
                <button key={i} onClick={() => setPhotoIdx(i)} style={{
                  width: 80, height: 60, borderRadius: 10, overflow: 'hidden', padding: 0,
                  border: i === photoIdx ? `2px solid ${c.accent}` : `1px solid ${c.border}`,
                  cursor: 'pointer', background: 'transparent',
                }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}

          {/* Description */}
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Descripción</h2>
            <p style={{ fontSize: 15, color: c.fg2, margin: '12px 0 0', lineHeight: 1.7 }}>
              {v.marca} {v.modelo} {v.anio} en excelente estado de conservación. Único dueño, service oficial al día con todos los comprobantes.
              Llave de repuesto original, manuales completos y verificación policial impecable.
              Recibimos tu usado en parte de pago. Financiación propia disponible.
            </p>
          </div>

          {/* Specs grid */}
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Ficha técnica</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, marginTop: 16, background: c.border, borderRadius: 16, overflow: 'hidden', border: `1px solid ${c.border}` }}>
              {[
                ['Año', v.anio],
                ['Kilómetros', `${fmt(v.km)} km`],
                ['Transmisión', v.transmision],
                ['Combustible', v.combustible],
                ['Color', v.color],
                ['Tipo', v.tipo],
              ].map(([k, val]) => (
                <div key={k} style={{ padding: '18px 20px', background: c.card }}>
                  <p style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: c.fg2, margin: 0 }}>{k}</p>
                  <p style={{ fontSize: 16, fontWeight: 700, margin: '4px 0 0' }}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: price + CTA */}
        <aside style={{ position: 'sticky', top: 88, alignSelf: 'flex-start' }}>
          <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 20, padding: 28, boxShadow: c.shadowSm }}>
            <p style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: c.accent, margin: 0, fontWeight: 700 }}>{v.marca} · {v.anio}</p>
            <h1 style={{ fontSize: 32, fontWeight: 800, margin: '8px 0 4px', letterSpacing: '-0.02em', lineHeight: 1.05 }}>{v.modelo}</h1>
            <p style={{ fontSize: 14, color: c.fg2, margin: 0 }}>{v.version}</p>

            <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${c.border}` }}>
              <p style={{ fontSize: 11, color: c.fg2, margin: 0, textTransform: 'uppercase', letterSpacing: '.1em' }}>Precio</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: 14, color: c.fg2 }}>USD</span>
                <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em' }}>${fmt(v.precio)}</span>
              </div>
              <p style={{ fontSize: 12, color: c.fg2, margin: '2px 0 0' }}>≈ ARS {fmt(v.precio * TC)}</p>
            </div>

            <a target="_blank" rel="noreferrer" href={`https://wa.me/541162692000?text=Hola!%20Me%20interesa%20el%20${encodeURIComponent(v.marca + ' ' + v.modelo + ' ' + v.anio)}`} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginTop: 20, padding: '16px', background: c.accent, color: '#fff',
              borderRadius: 14, fontSize: 14, fontWeight: 700, textDecoration: 'none',
            }}>
              <WhatsAppIcon size={16} /> Consultar por WhatsApp
            </a>
            <button style={{
              width: '100%', marginTop: 8, padding: '14px',
              background: 'transparent', color: c.fg, border: `1px solid ${c.borderStrong}`,
              borderRadius: 14, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Llamar al {PHONE}
            </button>

            <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${c.border}` }}>
              <p style={{ fontSize: 12, color: c.fg2, margin: 0, lineHeight: 1.6 }}>
                <span style={{ color: c.fg, fontWeight: 600 }}>📍 {ADDRESS}</span><br/>
                Lun a Sáb · 9 a 18hs
              </p>
            </div>
          </div>

          {/* Map under */}
          <div style={{ marginTop: 16, borderRadius: 16, overflow: 'hidden', border: `1px solid ${c.border}` }}>
            <GhMap theme={theme} height={200} />
          </div>
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { DetailMobile, DetailWeb });
