import { useMemo, useState } from 'react'
import { generarAlertas } from '../utils/alertas'

const NIVEL_CONFIG = {
  vencido: { color: '#dc2626', bg: '#fef2f2', borde: '#fecaca', icono: '🚨', label: 'VENCIDO' },
  critico: { color: '#ef4444', bg: '#fff1f1', borde: '#fca5a5', icono: '🔴', label: 'CRÍTICO' },
  urgente: { color: '#f97316', bg: '#fff7ed', borde: '#fdba74', icono: '🟠', label: 'URGENTE' },
  proximo: { color: '#eab308', bg: '#fefce8', borde: '#fde047', icono: '🟡', label: 'PRÓXIMO' },
}

const TIPO_LABEL = {
  vtv: 'VTV',
  patente: 'PATENTE',
}

function AlertaRow({ alerta }) {
  const cfg = NIVEL_CONFIG[alerta.nivel] || NIVEL_CONFIG.urgente
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '10px 12px',
      borderRadius: '8px',
      background: cfg.bg,
      border: `1px solid ${cfg.borde}`,
    }}>
      <span style={{ fontSize: '16px', lineHeight: 1.4 }}>{cfg.icono}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
          <span style={{
            fontSize: '10px',
            fontWeight: 700,
            color: cfg.color,
            background: cfg.borde,
            padding: '1px 6px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {TIPO_LABEL[alerta.tipo]}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--c-fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {alerta.vehiculo}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--c-muted)' }}>
            {alerta.patente}
          </span>
          <span style={{ fontSize: '12px', color: cfg.color, fontWeight: 500 }}>
            {alerta.mensaje}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function AlertasWidget({ vehiculos = [] }) {
  const [verTodas, setVerTodas] = useState(false)

  const alertas = useMemo(() => generarAlertas(vehiculos), [vehiculos])
  const visibles = verTodas ? alertas : alertas.slice(0, 5)
  const resto = alertas.length - 5

  if (!vehiculos.length) return null

  return (
    <div style={{
      background: 'var(--c-card)',
      border: '1px solid var(--c-border)',
      borderRadius: '12px',
      padding: '16px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--c-fg)' }}>
          Alertas de vencimientos
        </h2>
        {alertas.length > 0 && (
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            color: alertas.some(a => a.nivel === 'vencido' || a.nivel === 'critico') ? '#ef4444' : '#f97316',
            background: alertas.some(a => a.nivel === 'vencido' || a.nivel === 'critico') ? '#fef2f2' : '#fff7ed',
            padding: '2px 8px',
            borderRadius: '999px',
          }}>
            {alertas.length} {alertas.length === 1 ? 'alerta' : 'alertas'}
          </span>
        )}
      </div>

      {alertas.length === 0 ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px',
          background: '#f0fdf4',
          borderRadius: '8px',
          border: '1px solid #bbf7d0',
        }}>
          <span style={{ fontSize: '18px' }}>✅</span>
          <span style={{ fontSize: '14px', color: '#166534', fontWeight: 500 }}>Todo al día</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {visibles.map((alerta, i) => (
            <AlertaRow key={`${alerta.vehiculo_id}-${alerta.tipo}-${i}`} alerta={alerta} />
          ))}
          {!verTodas && resto > 0 && (
            <button
              onClick={() => setVerTodas(true)}
              style={{
                background: 'none',
                border: '1px solid var(--c-border)',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '13px',
                color: 'var(--c-muted)',
                cursor: 'pointer',
                textAlign: 'center',
                fontWeight: 500,
              }}
            >
              Ver {resto} {resto === 1 ? 'alerta más' : 'alertas más'}
            </button>
          )}
          {verTodas && alertas.length > 5 && (
            <button
              onClick={() => setVerTodas(false)}
              style={{
                background: 'none',
                border: '1px solid var(--c-border)',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '13px',
                color: 'var(--c-muted)',
                cursor: 'pointer',
                textAlign: 'center',
                fontWeight: 500,
              }}
            >
              Ver menos
            </button>
          )}
        </div>
      )}
    </div>
  )
}
