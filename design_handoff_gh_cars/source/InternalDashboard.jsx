// ── Internal Dashboard (re-imagined, modern) ───────────────────

function Sparkline({ data, color, w = 100, h = 32 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * w},${h - ((d - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={color} opacity="0.12" />
    </svg>
  );
}

function HeroCard({ theme }) {
  const c = theme.colors;
  return (
    <div style={{
      gridColumn: 'span 2',
      padding: 24, borderRadius: 20,
      background: `linear-gradient(135deg, ${c.accent} 0%, #c2185b 100%)`,
      color: '#fff', position: 'relative', overflow: 'hidden',
      minHeight: 160,
    }}>
      <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: 999, background: 'rgba(255,255,255,.08)' }} />
      <div style={{ position: 'absolute', right: -80, bottom: -60, width: 240, height: 240, borderRadius: 999, background: 'rgba(255,255,255,.05)' }} />
      <p style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', margin: 0, opacity: .9, fontWeight: 600 }}>Ventas del mes</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 12 }}>
        <span style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>14</span>
        <span style={{ fontSize: 14, fontWeight: 600, opacity: .9 }}>vehículos</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,.18)', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>▲ 23%</span>
        <span style={{ fontSize: 12, opacity: .9 }}>vs el mes pasado</span>
      </div>
      <div style={{ position: 'absolute', right: 24, bottom: 20 }}>
        <Sparkline data={[3,5,4,7,6,9,8,11,10,12,11,14]} color="rgba(255,255,255,.9)" w={180} h={50} />
      </div>
    </div>
  );
}

function MiniStat({ theme, label, value, sub, tone = 'fg', sparkData, sparkColor }) {
  const c = theme.colors;
  const valColor = tone === 'success' ? c.success : tone === 'warning' ? c.warning : tone === 'info' ? c.info : c.fg;
  return (
    <div style={{ padding: 18, borderRadius: 16, background: c.card, border: `1px solid ${c.border}` }}>
      <p style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: c.fg2, margin: 0, fontWeight: 600 }}>{label}</p>
      <p style={{ fontSize: 32, fontWeight: 800, color: valColor, margin: '6px 0 0', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: c.fg2, margin: '4px 0 0' }}>{sub}</p>}
      {sparkData && <div style={{ marginTop: 10 }}><Sparkline data={sparkData} color={sparkColor || c.accent} w={160} h={28} /></div>}
    </div>
  );
}

function StockBreakdown({ theme }) {
  const c = theme.colors;
  const data = [
    { label: 'Disponibles', count: 11, color: c.success },
    { label: 'Señados', count: 3, color: c.warning },
    { label: 'En revisión', count: 2, color: c.info },
    { label: 'Vendidos', count: 4, color: c.fg2 },
  ];
  const total = data.reduce((s, d) => s + d.count, 0);
  return (
    <div style={{ padding: 22, borderRadius: 16, background: c.card, border: `1px solid ${c.border}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <p style={{ fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: c.fg2, margin: 0, fontWeight: 600 }}>Stock por estado</p>
        <p style={{ fontSize: 13, color: c.fg, margin: 0, fontWeight: 600 }}>{total} unidades</p>
      </div>

      {/* horizontal stacked bar */}
      <div style={{ display: 'flex', height: 10, borderRadius: 6, overflow: 'hidden', marginTop: 16, background: c.bg }}>
        {data.map(d => (
          <div key={d.label} style={{ flex: d.count, background: d.color }} title={`${d.label}: ${d.count}`} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 18 }}>
        {data.map(d => (
          <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: d.color, flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 13, color: c.fg }}>{d.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: c.fg }}>{d.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentActivity({ theme }) {
  const c = theme.colors;
  const items = [
    { ico: 'cash',    color: c.success,  title: 'Venta cerrada',   desc: 'Ford Ranger 2024 · USD 56.900', time: 'Hace 2h', user: 'Juan' },
    { ico: 'plus',    color: c.info,     title: 'Nuevo ingreso',   desc: 'Toyota Corolla Cross 2023', time: 'Hace 4h', user: 'Gustavo' },
    { ico: 'users',   color: c.warning,  title: 'Lead nuevo',      desc: 'Martín Pérez · interés VW Amarok', time: 'Hace 5h', user: 'María' },
    { ico: 'check',   color: c.success,  title: 'Seña recibida',   desc: 'Honda HR-V 2023 · USD 3.000', time: 'Ayer', user: 'Juan' },
    { ico: 'wrench',  color: c.info,     title: 'Service completado', desc: 'Peugeot 208 2021 listo para venta', time: 'Ayer', user: 'Sistema' },
  ];
  const ICONS = {
    cash:   'M2 7h20M5 7l1 11h12l1-11M9 11v4M15 11v4',
    plus:   'M12 5v14M5 12h14',
    users:  'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    check:  'M5 12l5 5L20 7',
    wrench: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  };
  return (
    <div style={{ padding: 22, borderRadius: 16, background: c.card, border: `1px solid ${c.border}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
        <p style={{ fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: c.fg2, margin: 0, fontWeight: 600 }}>Actividad reciente</p>
        <button style={{ background: 'transparent', border: 0, color: c.accent, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Ver todo →</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {items.map((it, i) => (
          <div key={i} style={{
            display: 'flex', gap: 12, alignItems: 'flex-start',
            padding: '12px 0',
            borderBottom: i < items.length - 1 ? `1px solid ${c.border}` : 'none',
          }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: it.color + '22', color: it.color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={ICONS[it.ico]} /></svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: c.fg, margin: 0 }}>{it.title}</p>
              <p style={{ fontSize: 12, color: c.fg2, margin: '2px 0 0' }}>{it.desc}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 11, color: c.fg3, margin: 0 }}>{it.time}</p>
              <p style={{ fontSize: 10, color: c.fg2, margin: '2px 0 0' }}>{it.user}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertasInline({ theme }) {
  const c = theme.colors;
  const items = [
    { type: 'danger', text: '2 vehículos con VTV vencida', cta: 'Ver' },
    { type: 'warning', text: 'Honda HR-V: seña vence en 3 días', cta: 'Confirmar' },
    { type: 'info', text: '3 leads sin contactar hace 48hs', cta: 'Asignar' },
  ];
  const colorOf = t => t === 'danger' ? c.accent : t === 'warning' ? c.warning : c.info;
  return (
    <div style={{ padding: 22, borderRadius: 16, background: c.card, border: `1px solid ${c.border}` }}>
      <p style={{ fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: c.fg2, margin: '0 0 14px', fontWeight: 600 }}>Necesitan atención</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((it, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
            background: c.bg, borderRadius: 10,
            borderLeft: `3px solid ${colorOf(it.type)}`,
          }}>
            <div style={{ flex: 1, fontSize: 13, color: c.fg }}>{it.text}</div>
            <button style={{ padding: '4px 12px', background: 'transparent', color: colorOf(it.type), border: `1px solid ${colorOf(it.type)}55`, borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{it.cta}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function InternalDashboard({ theme }) {
  const c = theme.colors;
  return (
    <div style={{ padding: '24px 28px 64px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: c.accent, margin: 0, fontWeight: 600 }}>Lunes 26 de abril</p>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: '4px 0 0', letterSpacing: '-0.03em' }}>Buen día, Gustavo.</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ padding: '10px 16px', background: c.card, color: c.fg, border: `1px solid ${c.border}`, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Reportes</button>
          <button style={{ padding: '10px 16px', background: c.accent, color: '#fff', border: 0, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
            Ingresar vehículo
          </button>
        </div>
      </div>

      {/* Top hero + 2 mini */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <HeroCard theme={theme} />
        <MiniStat theme={theme} label="Stock total" value="20" sub="↑ 2 esta semana" sparkData={[18,18,19,18,19,20,20]} sparkColor={c.fg} />
        <MiniStat theme={theme} label="Ingresos USD" value="$ 412k" sub="del mes" tone="success" sparkData={[280,310,340,360,390,400,412]} sparkColor={c.success} />
      </div>

      {/* Stock breakdown + recent activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        <StockBreakdown theme={theme} />
        <AlertasInline theme={theme} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginTop: 16 }}>
        <RecentActivity theme={theme} />

        {/* Top sellers */}
        <div style={{ padding: 22, borderRadius: 16, background: c.card, border: `1px solid ${c.border}` }}>
          <p style={{ fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: c.fg2, margin: '0 0 14px', fontWeight: 600 }}>Top vendedores · este mes</p>
          {[
            { name: 'Juan Méndez', ventas: 6, ingresos: '$ 184k', color: '#6366f1' },
            { name: 'María López', ventas: 5, ingresos: '$ 142k', color: '#ec4899' },
            { name: 'Gustavo H.', ventas: 3, ingresos: '$ 86k', color: '#f59e0b' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 2 ? `1px solid ${c.border}` : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: s.color, color: '#fff', fontWeight: 700, fontSize: 13, display: 'grid', placeItems: 'center' }}>{s.name[0]}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: c.fg, margin: 0 }}>{s.name}</p>
                <p style={{ fontSize: 11, color: c.fg2, margin: '2px 0 0' }}>{s.ventas} ventas · {s.ingresos}</p>
              </div>
              <div style={{ width: 80 }}>
                <div style={{ height: 6, background: c.bg, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${(s.ventas / 6) * 100}%`, height: '100%', background: s.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { InternalDashboard });
