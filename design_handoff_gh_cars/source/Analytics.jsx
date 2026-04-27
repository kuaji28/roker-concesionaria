// ── Analytics dashboard ────────────────────────────────────────

function AreaChart({ data, color, h = 140, w = 600 }) {
  const max = Math.max(...data) * 1.15, min = 0;
  const range = max - min || 1;
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * w},${h - ((d - min) / range) * h}`).join(' ');
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`g-${color.replace('#','')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={`url(#g-${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BarChart({ data, color, h = 140 }) {
  const max = Math.max(...data) || 1;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: h }}>
      {data.map((d, i) => (
        <div key={i} style={{
          flex: 1, height: `${(d / max) * 100}%`,
          background: color, borderRadius: '3px 3px 0 0',
          minHeight: 2, opacity: i === data.length - 1 ? 1 : 0.7,
        }} />
      ))}
    </div>
  );
}

function MetricBig({ theme, label, value, delta, deltaTone = 'success', sub }) {
  const c = theme.colors;
  const dColor = deltaTone === 'success' ? c.success : deltaTone === 'danger' ? c.accent : c.fg2;
  return (
    <div>
      <p style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: c.fg2, margin: 0, fontWeight: 600 }}>{label}</p>
      <p style={{ fontSize: 36, fontWeight: 800, color: c.fg, margin: '6px 0 0', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
        {delta && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 8px', background: dColor + '22', color: dColor, borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
            {deltaTone === 'success' ? '▲' : '▼'} {delta}
          </span>
        )}
        {sub && <span style={{ fontSize: 11, color: c.fg2 }}>{sub}</span>}
      </div>
    </div>
  );
}

function TopVehiclesTable({ theme }) {
  const c = theme.colors;
  // top vehicles by views, with breakdown of social/contact clicks
  const rows = [
    { v: VEHICLES[0], views: 842, contact: 47, wapp: 31, ig: 12, fav: 23, ctr: 5.6 },
    { v: VEHICLES[1], views: 712, contact: 38, wapp: 26, ig: 9, fav: 19, ctr: 5.3 },
    { v: VEHICLES[2], views: 634, contact: 29, wapp: 22, ig: 7, fav: 18, ctr: 4.6 },
    { v: VEHICLES[3], views: 521, contact: 24, wapp: 17, ig: 6, fav: 14, ctr: 4.6 },
    { v: VEHICLES[4], views: 487, contact: 19, wapp: 14, ig: 5, fav: 11, ctr: 3.9 },
    { v: VEHICLES[5], views: 412, contact: 16, wapp: 12, ig: 3, fav: 9, ctr: 3.9 },
    { v: VEHICLES[6], views: 356, contact: 12, wapp: 9, ig: 2, fav: 7, ctr: 3.4 },
    { v: VEHICLES[7], views: 298, contact: 8, wapp: 6, ig: 1, fav: 5, ctr: 2.7 },
  ];
  const maxViews = rows[0].views;

  return (
    <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: c.fg, margin: 0 }}>Vehículos más vistos</p>
          <p style={{ fontSize: 11, color: c.fg2, margin: '2px 0 0' }}>Últimos 30 días · ordenados por visitas</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['7d', '30d', '90d'].map((p, i) => (
            <button key={p} style={{
              padding: '6px 12px', borderRadius: 8,
              background: i === 1 ? c.fg : 'transparent',
              color: i === 1 ? c.bg : c.fg2,
              border: i === 1 ? 'none' : `1px solid ${c.border}`,
              fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>{p}</button>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '2.2fr 1.4fr 80px 80px 80px 80px 70px',
        gap: 0, padding: '10px 20px', borderBottom: `1px solid ${c.border}`,
        background: c.bg, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: c.fg2, fontWeight: 700,
      }}>
        <span>Vehículo</span>
        <span>Visitas</span>
        <span style={{ textAlign: 'center' }}>Contacto</span>
        <span style={{ textAlign: 'center' }}>WhatsApp</span>
        <span style={{ textAlign: 'center' }}>Instagram</span>
        <span style={{ textAlign: 'center' }}>Favorito</span>
        <span style={{ textAlign: 'right' }}>CTR</span>
      </div>

      {rows.map((r, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '2.2fr 1.4fr 80px 80px 80px 80px 70px',
          gap: 0, alignItems: 'center', padding: '12px 20px',
          borderBottom: i < rows.length - 1 ? `1px solid ${c.border}` : 'none',
          fontSize: 13,
        }}>
          {/* vehicle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 11, color: c.fg3, fontFamily: 'ui-monospace, monospace', width: 18 }}>#{i+1}</span>
            <div style={{ width: 48, height: 36, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: c.bg }}>
              <img src={r.v.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: c.fg, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.v.marca} {r.v.modelo}</p>
              <p style={{ fontSize: 11, color: c.fg2, margin: 0 }}>{r.v.anio} · USD {fmt(r.v.precio)}</p>
            </div>
          </div>
          {/* views with bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: c.fg, width: 44 }}>{fmt(r.views)}</span>
            <div style={{ flex: 1, height: 4, background: c.bg, borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${(r.views / maxViews) * 100}%`, height: '100%', background: c.accent }} />
            </div>
          </div>
          <span style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, color: c.fg }}>{r.contact}</span>
          <span style={{ textAlign: 'center', fontSize: 13, color: '#25D366', fontWeight: 600 }}>{r.wapp}</span>
          <span style={{ textAlign: 'center', fontSize: 13, color: '#E4405F', fontWeight: 600 }}>{r.ig}</span>
          <span style={{ textAlign: 'center', fontSize: 13, color: c.warning, fontWeight: 600 }}>{r.fav}</span>
          <span style={{ textAlign: 'right', fontSize: 12, color: c.fg2, fontWeight: 600 }}>{r.ctr}%</span>
        </div>
      ))}
    </div>
  );
}

function ChannelBreakdown({ theme }) {
  const c = theme.colors;
  const channels = [
    { name: 'WhatsApp',   pct: 48, value: 142, color: '#25D366', icon: 'M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21M9 10a.5.5 0 1 0 1 0v-1a.5.5 0 1 0-1 0v1zM14 10a.5.5 0 1 0 1 0v-1a.5.5 0 1 0-1 0v1zM9.5 13a3.5 3.5 0 0 0 5 0' },
    { name: 'Llamada',    pct: 22, value: 65,  color: c.info,   icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' },
    { name: 'Instagram',  pct: 18, value: 53,  color: '#E4405F', icon: 'M16 4H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM17.5 6.5h.01' },
    { name: 'Email',      pct: 8,  value: 24,  color: c.warning, icon: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6' },
    { name: 'Form web',   pct: 4,  value: 12,  color: c.fg2,    icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M9 13h6M9 17h6' },
  ];
  const total = channels.reduce((s, ch) => s + ch.value, 0);

  return (
    <div style={{ padding: 22, borderRadius: 14, background: c.card, border: `1px solid ${c.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: c.fg, margin: 0 }}>Canal de contacto</p>
        <p style={{ fontSize: 11, color: c.fg2, margin: 0 }}>{total} interacciones</p>
      </div>
      <p style={{ fontSize: 11, color: c.fg2, margin: '2px 0 18px' }}>De dónde llegan los leads</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {channels.map(ch => (
          <div key={ch.name}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: ch.color + '22', color: ch.color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={ch.icon}/></svg>
              </div>
              <span style={{ fontSize: 13, color: c.fg, fontWeight: 500, flex: 1 }}>{ch.name}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: c.fg }}>{ch.value}</span>
              <span style={{ fontSize: 11, color: c.fg2, width: 36, textAlign: 'right' }}>{ch.pct}%</span>
            </div>
            <div style={{ height: 5, background: c.bg, borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${ch.pct}%`, height: '100%', background: ch.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FunnelCard({ theme }) {
  const c = theme.colors;
  const steps = [
    { label: 'Visitas al sitio',   value: 12480, pct: 100 },
    { label: 'Vieron un vehículo', value: 6240,  pct: 50  },
    { label: 'Click en contacto',  value: 312,   pct: 2.5 },
    { label: 'Lead calificado',    value: 184,   pct: 1.47 },
    { label: 'Cerró venta',        value: 14,    pct: 0.11 },
  ];
  const max = steps[0].value;
  return (
    <div style={{ padding: 22, borderRadius: 14, background: c.card, border: `1px solid ${c.border}` }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: c.fg, margin: 0 }}>Embudo de conversión</p>
      <p style={{ fontSize: 11, color: c.fg2, margin: '2px 0 18px' }}>30 días · de visita a venta</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {steps.map((s, i) => {
          const w = (s.value / max) * 100;
          return (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: c.fg, fontWeight: 500 }}>{s.label}</span>
                <span style={{ fontSize: 12, color: c.fg2 }}><b style={{ color: c.fg, fontWeight: 700 }}>{fmt(s.value)}</b> · {s.pct}%</span>
              </div>
              <div style={{ position: 'relative', height: 26, background: c.bg, borderRadius: 6, overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.max(w, 8)}%`, height: '100%',
                  background: `linear-gradient(90deg, ${c.accent}, ${c.accent}dd)`,
                  borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                  paddingRight: 10,
                  transition: 'width .3s',
                }} />
              </div>
              {i < steps.length - 1 && (
                <p style={{ fontSize: 10, color: c.fg3, margin: '4px 0 4px 12px', fontFamily: 'ui-monospace, monospace' }}>
                  ↓ {((steps[i+1].value / s.value) * 100).toFixed(1)}% conversión
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ButtonClicksCard({ theme }) {
  const c = theme.colors;
  const buttons = [
    { name: 'Contactar (botón principal)',     clicks: 312, change: '+18%', tone: 'success' },
    { name: 'WhatsApp directo',                 clicks: 248, change: '+24%', tone: 'success' },
    { name: 'Llamar',                           clicks: 142, change: '+9%',  tone: 'success' },
    { name: 'Compartir',                        clicks: 87,  change: '-4%',  tone: 'danger'  },
    { name: 'Agregar a favoritos',              clicks: 154, change: '+12%', tone: 'success' },
    { name: 'Ver financiación',                 clicks: 96,  change: '+31%', tone: 'success' },
    { name: 'Tomar mi auto en parte de pago',  clicks: 64,  change: '+7%',  tone: 'success' },
    { name: 'Instagram (footer)',               clicks: 53,  change: '+15%', tone: 'success' },
  ];
  const max = Math.max(...buttons.map(b => b.clicks));
  return (
    <div style={{ padding: 22, borderRadius: 14, background: c.card, border: `1px solid ${c.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: c.fg, margin: 0 }}>Clicks por botón</p>
        <button style={{ background: 'transparent', border: 0, color: c.accent, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Exportar CSV ↓</button>
      </div>
      <p style={{ fontSize: 11, color: c.fg2, margin: '2px 0 18px' }}>Acciones que toman los visitantes en cada vehículo</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {buttons.map((b, i) => (
          <div key={i}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: c.fg, fontWeight: 500, flex: 1 }}>{b.name}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: c.fg }}>{b.clicks}</span>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999,
                background: b.tone === 'success' ? c.success + '22' : c.accent + '22',
                color: b.tone === 'success' ? c.success : c.accent,
                width: 50, textAlign: 'center',
              }}>{b.change}</span>
            </div>
            <div style={{ height: 4, background: c.bg, borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${(b.clicks / max) * 100}%`, height: '100%', background: c.fg }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VisitsOverTime({ theme }) {
  const c = theme.colors;
  const visits = [180, 210, 195, 240, 268, 312, 290, 305, 340, 380, 360, 410, 445, 420, 460, 490, 510, 480, 520, 545, 528, 560, 590, 615, 600, 640, 680, 705, 690, 720];
  const contacts = visits.map(v => Math.round(v * 0.025 + Math.random() * 6));
  return (
    <div style={{ padding: 22, borderRadius: 14, background: c.card, border: `1px solid ${c.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: c.fg, margin: 0 }}>Tráfico al catálogo</p>
          <p style={{ fontSize: 11, color: c.fg2, margin: '2px 0 0' }}>Visitas vs contactos · 30 días</p>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: c.accent }} />
              <span style={{ fontSize: 11, color: c.fg2 }}>Visitas</span>
            </div>
            <p style={{ fontSize: 18, fontWeight: 800, color: c.fg, margin: 0, letterSpacing: '-0.02em' }}>{fmt(visits.reduce((a,b)=>a+b,0))}</p>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: c.success }} />
              <span style={{ fontSize: 11, color: c.fg2 }}>Contactos</span>
            </div>
            <p style={{ fontSize: 18, fontWeight: 800, color: c.fg, margin: 0, letterSpacing: '-0.02em' }}>{contacts.reduce((a,b)=>a+b,0)}</p>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 14, position: 'relative' }}>
        <AreaChart data={visits} color={c.accent} h={160} />
        <div style={{ position: 'absolute', inset: 0 }}>
          <AreaChart data={contacts.map(x => x * 12)} color={c.success} h={160} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, color: c.fg3 }}>
        <span>26 mar</span><span>10 abr</span><span>26 abr</span>
      </div>
    </div>
  );
}

function DeviceBreakdown({ theme }) {
  const c = theme.colors;
  const devices = [
    { name: 'Mobile',  pct: 68, color: c.accent },
    { name: 'Desktop', pct: 26, color: c.info },
    { name: 'Tablet',  pct: 6,  color: c.warning },
  ];
  // simple donut
  let cumulative = 0;
  const radius = 60, cx = 80, cy = 80, stroke = 18;
  return (
    <div style={{ padding: 22, borderRadius: 14, background: c.card, border: `1px solid ${c.border}` }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: c.fg, margin: 0 }}>Dispositivos</p>
      <p style={{ fontSize: 11, color: c.fg2, margin: '2px 0 18px' }}>De qué entran los visitantes</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <svg width={160} height={160} viewBox="0 0 160 160">
          {devices.map((d, i) => {
            const dash = 2 * Math.PI * radius;
            const offset = dash * (1 - d.pct / 100);
            const rotate = (cumulative / 100) * 360 - 90;
            cumulative += d.pct;
            return (
              <circle key={i} cx={cx} cy={cy} r={radius} fill="none"
                stroke={d.color} strokeWidth={stroke}
                strokeDasharray={dash} strokeDashoffset={offset}
                transform={`rotate(${rotate} ${cx} ${cy})`} />
            );
          })}
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize="22" fontWeight="800" fill={c.fg} style={{ letterSpacing: '-0.02em' }}>12.4k</text>
          <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill={c.fg2}>visitantes</text>
        </svg>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {devices.map(d => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: d.color }} />
              <span style={{ flex: 1, fontSize: 12, color: c.fg }}>{d.name}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: c.fg }}>{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricsHero({ theme }) {
  const c = theme.colors;
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
      padding: 24, borderRadius: 16,
      background: c.card, border: `1px solid ${c.border}`,
    }}>
      <MetricBig theme={theme} label="Visitas al catálogo" value="12.480" delta="18%" sub="vs mes anterior" />
      <MetricBig theme={theme} label="Click contactar" value="312" delta="24%" sub="2.5% conversión" />
      <MetricBig theme={theme} label="WhatsApp" value="248" delta="32%" />
      <MetricBig theme={theme} label="Tiempo medio" value="3:42" delta="6%" deltaTone="success" sub="por sesión" />
    </div>
  );
}

function AnalyticsView({ theme }) {
  const c = theme.colors;
  return (
    <div style={{ padding: '24px 28px 64px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: c.accent, margin: 0, fontWeight: 600 }}>Reportes · catálogo público</p>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: '4px 0 0', letterSpacing: '-0.03em' }}>Métricas</h1>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select style={{ padding: '10px 14px', background: c.card, border: `1px solid ${c.border}`, borderRadius: 10, color: c.fg, fontSize: 13, fontFamily: 'inherit', fontWeight: 600 }}>
            <option>Últimos 30 días</option>
            <option>Últimos 7 días</option>
            <option>Este mes</option>
            <option>Personalizado…</option>
          </select>
          <button style={{ padding: '10px 16px', background: c.fg, color: c.bg, border: 0, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Exportar reporte</button>
        </div>
      </div>

      {/* Hero metrics row */}
      <MetricsHero theme={theme} />

      {/* Visits + funnel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginTop: 16 }}>
        <VisitsOverTime theme={theme} />
        <FunnelCard theme={theme} />
      </div>

      {/* Top vehicles */}
      <div style={{ marginTop: 16 }}>
        <TopVehiclesTable theme={theme} />
      </div>

      {/* Buttons + channel + device */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 16, marginTop: 16 }}>
        <ButtonClicksCard theme={theme} />
        <ChannelBreakdown theme={theme} />
        <DeviceBreakdown theme={theme} />
      </div>
    </div>
  );
}

Object.assign(window, { AnalyticsView, AreaChart, BarChart });
