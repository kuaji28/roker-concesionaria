import { useState } from 'react'
import TopBar from '../components/TopBar'
import Icon from '../components/Icon'
import { supabase } from '../lib/supabase'

// Clave admin — solo Roker la sabe. Cambiar si es necesario.
const ADMIN_CLAVE = 'GH2026RESET'

const TABLAS = [
  { key: 'vehiculos',        label: 'Vehículos',        icon: 'car',      riesgo: 'alto',  reseteable: true  },
  { key: 'medias',           label: 'Fotos (refs)',      icon: 'image',    riesgo: 'alto',  reseteable: true  },
  { key: 'con_ventas',       label: 'Ventas',            icon: 'cash',     riesgo: 'alto',  reseteable: true  },
  { key: 'financiamientos',  label: 'Financiamientos',   icon: 'card',     riesgo: 'medio', reseteable: true  },
  { key: 'cuotas',           label: 'Cuotas',            icon: 'cal',      riesgo: 'medio', reseteable: true  },
  { key: 'prospectos',       label: 'Prospectos/Leads',  icon: 'users',    riesgo: 'medio', reseteable: true  },
  { key: 'clientes',         label: 'Clientes',          icon: 'briefcase',riesgo: 'medio', reseteable: true  },
  { key: 'gastos_vehiculo',  label: 'Gastos',            icon: 'cash',     riesgo: 'bajo',  reseteable: true  },
  { key: 'reservas',         label: 'Reservas',          icon: 'clock',    riesgo: 'bajo',  reseteable: true  },
  { key: 'agenda',           label: 'Agenda',            icon: 'cal',      riesgo: 'bajo',  reseteable: true  },
  { key: 'documentacion',    label: 'Documentación',     icon: 'doc',      riesgo: 'bajo',  reseteable: true  },
  { key: 'vehiculo_views',   label: 'Analytics Visitas', icon: 'chart',    riesgo: 'bajo',  reseteable: true  },
  { key: 'vehiculo_actions', label: 'Analytics Clicks',  icon: 'chart',    riesgo: 'bajo',  reseteable: true  },
  // NO reseteable (datos del sistema)
  { key: 'perfiles',         label: 'Usuarios/Perfiles', icon: 'users',    riesgo: null,    reseteable: false },
  { key: 'config',           label: 'Configuración',     icon: 'cog',      riesgo: null,    reseteable: false },
  { key: 'vendedores',       label: 'Vendedores',        icon: 'users',    riesgo: null,    reseteable: false },
]

const COLOR_RIESGO = { alto: 'var(--c-danger, #ef4444)', medio: 'var(--c-warning)', bajo: 'var(--c-success)' }

function Badge({ r }) {
  if (!r) return null
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: COLOR_RIESGO[r] + '22', color: COLOR_RIESGO[r], textTransform: 'uppercase', letterSpacing: '.06em' }}>
      {r}
    </span>
  )
}

/* ── Exportar backup ─────────────────────────────────────────── */
async function fetchAllTables(onProgress) {
  const result = {}
  for (let i = 0; i < TABLAS.length; i++) {
    const t = TABLAS[i]
    onProgress(Math.round((i / TABLAS.length) * 100), t.label)
    try {
      const { data } = await supabase.from(t.key).select('*')
      result[t.key] = data ?? []
    } catch {
      result[t.key] = []
    }
  }
  return result
}

function downloadJSON(obj, filename) {
  const json = JSON.stringify(obj, null, 2)
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/* ── Tabs ──────────────────────────────────────────────────────── */
function TabBackup() {
  const [loading, setLoading]   = useState(false)
  const [progress, setProgress] = useState(0)
  const [progLabel, setProgLabel] = useState('')
  const [done, setDone]         = useState(false)

  async function handleBackup() {
    setLoading(true)
    setDone(false)
    setProgress(0)
    const data = await fetchAllTables((pct, label) => {
      setProgress(pct)
      setProgLabel(label)
    })
    const fecha = new Date().toISOString().split('T')[0]
    const hora  = new Date().toTimeString().slice(0, 5).replace(':', '-')
    downloadJSON({ _meta: { fecha, hora, version: 1 }, ...data }, `ghcars_backup_${fecha}_${hora}.json`)
    setLoading(false)
    setProgress(100)
    setDone(true)
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700 }}>Descargar backup completo</h3>
      <p style={{ fontSize: 13, color: 'var(--c-fg-2)', margin: '0 0 24px' }}>
        Exporta todas las tablas como un archivo <code>.json</code> a tu PC. No depende de Supabase para restaurar — el archivo es autocontenido.
      </p>

      <div className="card" style={{ padding: '20px 22px', marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--c-fg-3)', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>Tablas incluidas</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {TABLAS.map(t => (
            <div key={t.key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--c-fg-2)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: t.reseteable ? 'var(--c-accent)' : 'var(--c-fg-3)', flexShrink: 0 }} />
              {t.label}
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--c-fg-2)', marginBottom: 6 }}>
            <span>Exportando {progLabel}…</span>
            <span>{progress}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: 'var(--c-card-2)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--c-accent)', borderRadius: 999, transition: 'width .3s ease' }} />
          </div>
        </div>
      )}

      {done && (
        <div className="banner" style={{ background: 'var(--c-success)', color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8 }}>
          <Icon name="check" size={16} /> Backup descargado correctamente
        </div>
      )}

      <button
        className="btn primary"
        style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
        onClick={handleBackup}
        disabled={loading}
      >
        {loading ? `Exportando… ${progress}%` : '⬇  Descargar backup completo'}
      </button>
    </div>
  )
}

function TabReset({ onBackupFirst }) {
  const [selected, setSelected]     = useState({})
  const [confirm, setConfirm]       = useState('')
  const [loading, setLoading]       = useState(false)
  const [log, setLog]               = useState([])
  const [done, setDone]             = useState(false)

  const resetables = TABLAS.filter(t => t.reseteable)
  const allSelected = resetables.every(t => selected[t.key])

  function toggle(key) {
    setSelected(s => ({ ...s, [key]: !s[key] }))
  }
  function toggleAll() {
    if (allSelected) setSelected({})
    else {
      const all = {}
      resetables.forEach(t => { all[t.key] = true })
      setSelected(all)
    }
  }

  const selectedKeys = Object.keys(selected).filter(k => selected[k])
  const canExecute = selectedKeys.length > 0 && confirm === 'RESETEAR'

  async function handleReset() {
    if (!canExecute) return
    setLoading(true)
    setDone(false)
    setLog([])

    // 1. Backup automático antes de resetear
    const newLog = []
    newLog.push('📦 Generando backup automático...')
    setLog([...newLog])
    const data = await fetchAllTables(() => {})
    const fecha = new Date().toISOString().split('T')[0]
    const hora  = new Date().toTimeString().slice(0, 5).replace(':', '-')
    downloadJSON({ _meta: { fecha, hora, version: 1, tipo: 'pre-reset' }, ...data }, `ghcars_PRE_RESET_${fecha}_${hora}.json`)
    newLog.push('✅ Backup descargado — guardalo en un lugar seguro')
    setLog([...newLog])

    // 2. Resetear tablas seleccionadas
    for (const key of selectedKeys) {
      try {
        // Usar delete con condición que siempre es true (no hay truncate por RLS)
        const { error } = await supabase.from(key).delete().neq('id', '00000000-0000-0000-0000-000000000000')
        if (error) {
          // Intento alternativo con gt
          const { error: e2 } = await supabase.from(key).delete().gt('id', 0)
          if (e2) throw e2
        }
        newLog.push(`✅ ${TABLAS.find(t => t.key === key)?.label ?? key} — borrada`)
      } catch (e) {
        newLog.push(`❌ ${key} — error: ${e.message}`)
      }
      setLog([...newLog])
    }

    newLog.push('🏁 Reset completado')
    setLog([...newLog])
    setLoading(false)
    setDone(true)
    setConfirm('')
    setSelected({})
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700 }}>Resetear secciones</h3>
      <p style={{ fontSize: 13, color: 'var(--c-fg-2)', margin: '0 0 20px' }}>
        Se genera un backup automático ANTES de borrar. Solo tablas de datos — nunca usuarios ni configuración.
      </p>

      <div className="card" style={{ padding: '16px 18px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-fg-3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Seleccionar tablas</span>
          <button onClick={toggleAll} style={{ fontSize: 12, color: 'var(--c-accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
            {allSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {resetables.map(t => (
            <label key={t.key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 10px', borderRadius: 8, background: selected[t.key] ? 'rgba(220,38,38,.08)' : 'transparent', border: `1px solid ${selected[t.key] ? 'var(--c-accent)' : 'var(--c-border)'}`, transition: 'all .15s' }}>
              <input type="checkbox" checked={!!selected[t.key]} onChange={() => toggle(t.key)} style={{ accentColor: 'var(--c-accent)', width: 14, height: 14 }} />
              <span style={{ fontSize: 13, flex: 1 }}>{t.label}</span>
              <Badge r={t.riesgo} />
            </label>
          ))}
        </div>
      </div>

      {selectedKeys.length > 0 && (
        <div className="card" style={{ padding: '16px 18px', marginBottom: 16, borderColor: 'rgba(220,38,38,.3)' }}>
          <div style={{ fontSize: 13, color: 'var(--c-fg-2)', marginBottom: 10 }}>
            Vas a borrar <strong style={{ color: 'var(--c-accent)' }}>{selectedKeys.length} tabla{selectedKeys.length > 1 ? 's' : ''}</strong>.
            Esto es irreversible (aunque se genera backup antes).
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--c-fg-3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>
              Escribí <strong style={{ color: 'var(--c-accent)' }}>RESETEAR</strong> para confirmar
            </label>
            <input
              className="input"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="RESETEAR"
              style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}
            />
          </div>
        </div>
      )}

      {log.length > 0 && (
        <div style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 8, padding: '12px 14px', marginBottom: 16, maxHeight: 200, overflowY: 'auto', lineHeight: 1.8 }}>
          {log.map((l, i) => <div key={i} style={{ color: l.startsWith('❌') ? 'var(--c-danger, #ef4444)' : l.startsWith('✅') ? 'var(--c-success)' : 'var(--c-fg-2)' }}>{l}</div>)}
        </div>
      )}

      <button
        className="btn"
        style={{ width: '100%', justifyContent: 'center', padding: '13px', background: canExecute ? 'var(--c-accent)' : 'var(--c-card-2)', color: canExecute ? '#fff' : 'var(--c-fg-3)', border: 'none', cursor: canExecute ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: 14, borderRadius: 10 }}
        onClick={handleReset}
        disabled={!canExecute || loading}
      >
        {loading ? 'Ejecutando…' : `⚠  Borrar ${selectedKeys.length > 0 ? selectedKeys.length + ' tabla' + (selectedKeys.length > 1 ? 's' : '') : ''}`}
      </button>
    </div>
  )
}

function TabRestaurar() {
  const [file, setFile]         = useState(null)
  const [preview, setPreview]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [log, setLog]           = useState([])
  const [done, setDone]         = useState(false)
  const [selected, setSelected] = useState({})

  async function handleFile(e) {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(null)
    setLog([])
    setDone(false)
    try {
      const text = await f.text()
      const data = JSON.parse(text)
      const { _meta, ...tables } = data
      const summary = Object.entries(tables).map(([key, rows]) => ({
        key, rows: Array.isArray(rows) ? rows.length : 0,
        label: TABLAS.find(t => t.key === key)?.label ?? key,
      }))
      setPreview({ meta: _meta, tables: summary })
      const sel = {}
      summary.forEach(t => { if (t.rows > 0) sel[t.key] = true })
      setSelected(sel)
    } catch {
      setPreview({ error: 'Archivo inválido — no es un backup de GH Cars' })
    }
  }

  async function handleRestore() {
    if (!preview || preview.error) return
    setLoading(true)
    setDone(false)
    setLog([])
    const newLog = []

    const text = await file.text()
    const { _meta, ...tables } = JSON.parse(text)
    const keys = Object.keys(selected).filter(k => selected[k])

    for (const key of keys) {
      const rows = tables[key]
      if (!rows || rows.length === 0) { newLog.push(`⏭  ${key} — vacío, saltando`); setLog([...newLog]); continue }
      try {
        const { error } = await supabase.from(key).upsert(rows, { onConflict: 'id', ignoreDuplicates: false })
        if (error) throw error
        newLog.push(`✅ ${TABLAS.find(t => t.key === key)?.label ?? key} — ${rows.length} registros restaurados`)
      } catch (e) {
        newLog.push(`❌ ${key} — ${e.message}`)
      }
      setLog([...newLog])
    }
    newLog.push('🏁 Restauración completada')
    setLog([...newLog])
    setLoading(false)
    setDone(true)
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700 }}>Restaurar desde backup</h3>
      <p style={{ fontSize: 13, color: 'var(--c-fg-2)', margin: '0 0 20px' }}>
        Subí un archivo <code>.json</code> generado por esta pantalla. Podés elegir qué tablas restaurar antes de ejecutar.
      </p>

      <label style={{ display: 'block', border: '2px dashed var(--c-border)', borderRadius: 10, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', marginBottom: 16, transition: 'border-color .15s' }}>
        <input type="file" accept=".json" onChange={handleFile} style={{ display: 'none' }} />
        <div style={{ fontSize: 28, marginBottom: 8 }}>📁</div>
        <div style={{ fontSize: 14, color: 'var(--c-fg-2)', fontWeight: 600 }}>{file ? file.name : 'Hacé click o arrastrá el archivo .json'}</div>
        {file && <div style={{ fontSize: 12, color: 'var(--c-fg-3)', marginTop: 4 }}>{(file.size / 1024).toFixed(1)} KB</div>}
      </label>

      {preview && !preview.error && (
        <div className="card" style={{ padding: '16px 18px', marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--c-fg-3)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Backup del {preview.meta?.fecha ?? '?'} — v{preview.meta?.version ?? '?'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {preview.tables.map(t => (
              <label key={t.key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '7px 9px', borderRadius: 8, background: selected[t.key] ? 'rgba(34,197,94,.06)' : 'transparent', border: `1px solid ${selected[t.key] ? 'var(--c-success)' : 'var(--c-border)'}` }}>
                <input type="checkbox" checked={!!selected[t.key]} onChange={() => setSelected(s => ({ ...s, [t.key]: !s[t.key] }))} style={{ accentColor: 'var(--c-success)', width: 14, height: 14 }} />
                <span style={{ fontSize: 13, flex: 1 }}>{t.label}</span>
                <span style={{ fontSize: 11, color: 'var(--c-fg-3)' }}>{t.rows} reg.</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {preview?.error && (
        <div className="banner warning" style={{ marginBottom: 16 }}>⚠ {preview.error}</div>
      )}

      {log.length > 0 && (
        <div style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 8, padding: '12px 14px', marginBottom: 16, maxHeight: 200, overflowY: 'auto', lineHeight: 1.8 }}>
          {log.map((l, i) => <div key={i} style={{ color: l.startsWith('❌') ? 'var(--c-danger, #ef4444)' : l.startsWith('✅') ? 'var(--c-success)' : 'var(--c-fg-2)' }}>{l}</div>)}
        </div>
      )}

      {preview && !preview.error && (
        <button
          className="btn primary"
          style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
          onClick={handleRestore}
          disabled={loading || Object.values(selected).every(v => !v)}
        >
          {loading ? 'Restaurando…' : '↩  Restaurar tablas seleccionadas'}
        </button>
      )}
    </div>
  )
}

/* ── Pantalla principal ──────────────────────────────────────── */
export default function Sistema({ onLogout }) {
  const [claveInput, setClaveInput] = useState('')
  const [autenticado, setAutenticado] = useState(false)
  const [claveError, setClaveError]   = useState(false)
  const [tab, setTab] = useState('backup')

  function handleAuth(e) {
    e.preventDefault()
    if (claveInput === ADMIN_CLAVE) {
      setAutenticado(true)
      setClaveError(false)
    } else {
      setClaveError(true)
      setClaveInput('')
    }
  }

  return (
    <div>
      <TopBar onLogout={onLogout} />
      <div className="main">
        <div className="page-head">
          <div>
            <h1 className="page-title">Sistema</h1>
            <p className="page-caption">Backup, reset y restauración de datos</p>
          </div>
        </div>

        {!autenticado ? (
          /* ── Auth gate ─────────────────────────────────────── */
          <div style={{ maxWidth: 360, margin: '48px auto 0' }}>
            <div className="card" style={{ padding: '28px 24px' }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🔐</div>
                <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700 }}>Acceso restringido</h2>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--c-fg-2)' }}>Esta sección requiere la clave de administrador</p>
              </div>
              <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  className="input"
                  type="password"
                  placeholder="Clave de administrador"
                  value={claveInput}
                  onChange={e => { setClaveInput(e.target.value); setClaveError(false) }}
                  autoFocus
                  style={{ letterSpacing: '0.2em', textAlign: 'center' }}
                />
                {claveError && (
                  <div style={{ fontSize: 12, color: 'var(--c-accent)', textAlign: 'center' }}>Clave incorrecta</div>
                )}
                <button className="btn primary" type="submit" style={{ justifyContent: 'center' }}>
                  Ingresar
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* ── Contenido principal ───────────────────────────── */
          <>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--c-border)', paddingBottom: 0 }}>
              {[
                { key: 'backup',     label: '⬇  Backup',     desc: 'Exportar datos' },
                { key: 'reset',      label: '⚠  Reset',      desc: 'Borrar tablas' },
                { key: 'restaurar',  label: '↩  Restaurar',  desc: 'Importar backup' },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    padding: '10px 18px', background: 'none', cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: 14, fontWeight: tab === t.key ? 700 : 400,
                    color: tab === t.key ? 'var(--c-fg)' : 'var(--c-fg-3)',
                    border: 'none', borderBottom: `2px solid ${tab === t.key ? 'var(--c-accent)' : 'transparent'}`,
                    marginBottom: -1, transition: 'all .15s',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'backup'    && <TabBackup />}
            {tab === 'reset'     && <TabReset />}
            {tab === 'restaurar' && <TabRestaurar />}
          </>
        )}
      </div>
    </div>
  )
}
