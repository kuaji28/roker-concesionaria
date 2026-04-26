import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Icon from './Icon'
import GHLogo from './GHLogo'
import ThemeToggle from './ThemeToggle'
import { useIsMobile } from '../hooks/useIsMobile'
import { useUser } from '../hooks/useUser'

const NAV = [
  { to: '/',          icon: 'home',      label: 'Dashboard',           tip: 'Resumen general: vehículos disponibles, ventas recientes y métricas clave' },
  { to: '/catalogo',  icon: 'car',       label: 'Catálogo',            tip: 'Ver todos los vehículos disponibles para la venta' },
  { to: '/buscar',    icon: 'search',    label: 'Buscar para cliente', tip: 'Buscar un vehículo según lo que pide un cliente (marca, precio, año...)' },
  { to: '/ingreso',   icon: 'plus',      label: 'Ingresar vehículo',   tip: 'Registrar un nuevo vehículo que entra al stock de la concesionaria' },
  { to: '/ventas',    icon: 'cash',      label: 'Ventas',              tip: 'Registrar una venta y marcar un vehículo como vendido' },
  { to: '/leads',     icon: 'users',     label: 'Prospectos',          tip: 'Personas interesadas en comprar un vehículo — seguimiento y pipeline de ventas' },
  { to: '/clientes',  icon: 'briefcase', label: 'Clientes',            tip: 'Historial de clientes que ya compraron — para recontactar con nuevas ofertas' },
  { to: '/agenda',    icon: 'cal',       label: 'Agenda',              tip: 'Turnos y visitas agendadas al showroom' },
  { to: '/reportes',  icon: 'chart',     label: 'Reportes',            tip: 'Métricas del mes: ventas, ingresos, rotación de stock y más' },
]
const NAV_ADMIN = [
  { to: '/gerente',    icon: 'home',    label: 'Dashboard Gerente',   tip: 'Vista avanzada para dueños: márgenes, performance de vendedores y KPIs' },
  { to: '/gastos',     icon: 'cash',    label: 'Gastos y Margen',     tip: 'Control de gastos por vehículo y margen de ganancia real' },
  { to: '/rotacion',   icon: 'gauge',   label: 'Rotación de Stock',   tip: 'Cuántos días tarda cada vehículo en venderse' },
  { to: '/vendedores', icon: 'users',   label: 'Vendedores',          tip: 'Gestión del equipo de ventas: altas, bajas y rendimiento' },
  { to: '/cobranza',   icon: 'card',    label: 'Cobranza',            tip: 'Seguimiento de cuotas y financiamientos pendientes de cobro' },
  { to: '/config',     icon: 'cog',     label: 'Configuración',       tip: 'Ajustes del sistema: PIN de acceso y preferencias generales' },
  { to: '/historial',  icon: 'clock',   label: 'Historial',           tip: 'Registro completo de todos los movimientos del sistema (auditoría)' },
  { to: '/mejoras',    icon: 'star',    label: 'Mejoras del sistema', tip: 'Lista de funciones y mejoras disponibles para incorporar al sistema' },
]

const TOGGLE_ICO = (collapsed) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {collapsed
      ? <><polyline points="9 18 15 12 9 6" /></>
      : <><polyline points="15 18 9 12 15 6" /></>
    }
  </svg>
)

export default function Sidebar({ tc }) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const user = useUser()

  function handleNavClick() {
    if (isMobile) setOpen(false)
  }

  /* ── MOBILE ─────────────────────────────────────────────────────── */
  if (isMobile) {
    return (
      <>
        {/* Mobile top bar */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          background: 'var(--c-card)', borderBottom: '1px solid var(--c-border)',
          padding: '0 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 52,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <GHLogo size={30} />
            <div style={{ fontWeight: 700, fontSize: 14 }}>GH Cars</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ThemeToggle />
            <button
              onClick={() => setOpen(o => !o)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-fg)', padding: 6 }}
              aria-label="Menú"
            >
              {open
                ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              }
            </button>
          </div>
        </div>

        {/* Overlay */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 199, background: 'rgba(0,0,0,0.5)' }}
          />
        )}

        {/* Drawer */}
        <aside style={{
          position: 'fixed', top: 0, left: open ? 0 : '-260px', bottom: 0, zIndex: 210,
          width: 240,
          background: 'var(--c-card)', borderRight: '1px solid var(--c-border)',
          padding: '16px 12px',
          display: 'flex', flexDirection: 'column', gap: 4,
          overflowY: 'auto',
          transition: 'left 0.25s ease',
        }}>
          <div className="brand" style={{ marginBottom: 10 }}>
            <GHLogo size={36} />
            <div className="brand-txt">GH Cars<small>Gestión Automotriz</small></div>
          </div>
          <nav className="nav" onClick={handleNavClick}>
            {NAV.map(n => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => isActive ? 'on' : ''} title={n.tip}>
                <Icon name={n.icon} size={18} />{n.label}
              </NavLink>
            ))}
            {user?.rol === 'dueno' && (
              <>
                <div className="sep">Admin</div>
                {NAV_ADMIN.map(n => (
                  <NavLink key={n.to} to={n.to} className={({ isActive }) => isActive ? 'on' : ''} title={n.tip}>
                    <Icon name={n.icon} size={18} />{n.label}
                  </NavLink>
                ))}
              </>
            )}
          </nav>
          <div className="side-block" style={{ marginTop: 'auto' }}>
            <h6>Cotización USD</h6>
            <div className="tc-row">
              <strong>$ {(tc || 0).toLocaleString('es-AR')}</strong>
              <small>ARS</small>
            </div>
          </div>
        </aside>
      </>
    )
  }

  /* ── DESKTOP (collapsible) ────────────────────────────────────── */
  const w = collapsed ? 72 : 232

  return (
    <aside className="side" style={{
      width: w, minWidth: w, maxWidth: w,
      transition: 'width .2s ease, min-width .2s ease, max-width .2s ease',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Brand */}
      <div className="brand" style={{ overflow: 'hidden', flexShrink: 0 }}>
        <GHLogo size={34} style={{ flexShrink: 0 }} />
        {!collapsed && (
          <div className="brand-txt" style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
            GH Cars
            <small>Gestión Automotriz</small>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="nav" style={{ flex: 1, overflow: 'hidden' }}>
        {NAV.map(n => (
          <NavLink
            key={n.to} to={n.to} end={n.to === '/'}
            className={({ isActive }) => isActive ? 'on' : ''}
            title={collapsed ? n.label : n.tip}
            style={collapsed ? { justifyContent: 'center', padding: '0 10px' } : undefined}
          >
            <Icon name={n.icon} size={18} style={{ flexShrink: 0 }} />
            {!collapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.label}</span>}
          </NavLink>
        ))}
        {user?.rol === 'dueno' && (
          <>
            {!collapsed && <div className="sep">Admin</div>}
            {collapsed && <div style={{ height: 1, background: 'var(--c-border)', margin: '6px 12px' }} />}
            {NAV_ADMIN.map(n => (
              <NavLink
                key={n.to} to={n.to}
                className={({ isActive }) => isActive ? 'on' : ''}
                title={collapsed ? n.label : n.tip}
                style={collapsed ? { justifyContent: 'center', padding: '0 10px' } : undefined}
              >
                <Icon name={n.icon} size={18} style={{ flexShrink: 0 }} />
                {!collapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.label}</span>}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Bottom: TC + ThemeToggle + collapse toggle */}
      <div style={{ flexShrink: 0, padding: collapsed ? '8px 0' : '8px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {!collapsed && (
          <div className="side-block">
            <h6>Cotización USD</h6>
            <div className="tc-row">
              <strong>$ {(tc || 0).toLocaleString('es-AR')}</strong>
              <small>ARS</small>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', gap: 8 }}>
          {!collapsed && <ThemeToggle />}
          <button
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            style={{
              width: 30, height: 30, borderRadius: 8, border: '1px solid var(--c-border)',
              background: 'transparent', color: 'var(--c-fg-2)',
              display: 'grid', placeItems: 'center', cursor: 'pointer',
              flexShrink: 0, transition: 'background .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--c-card-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {TOGGLE_ICO(collapsed)}
          </button>
        </div>
      </div>
    </aside>
  )
}
