import { NavLink } from 'react-router-dom'
import Icon from './Icon'

const NAV = [
  { to: '/',          icon: 'home',      label: 'Dashboard' },
  { to: '/catalogo',  icon: 'car',       label: 'Catálogo' },
  { to: '/buscar',    icon: 'search',    label: 'Buscar para cliente' },
  { to: '/ingreso',   icon: 'plus',      label: 'Ingresar vehículo' },
  { to: '/ventas',    icon: 'cash',      label: 'Ventas' },
  { to: '/leads',     icon: 'users',     label: 'Leads' },
  { to: '/clientes',  icon: 'briefcase', label: 'Clientes' },
  { to: '/reportes',  icon: 'chart',     label: 'Reportes' },
]
const NAV_ADMIN = [
  { to: '/gerente',   icon: 'home',      label: 'Dashboard Gerente' },
  { to: '/gastos',    icon: 'cash',      label: 'Gastos y Margen' },
  { to: '/rotacion',  icon: 'chart',     label: 'Rotación de Stock' },
  { to: '/vendedores',icon: 'users',     label: 'Vendedores' },
  { to: '/cobranza',  icon: 'card',      label: 'Cobranza' },
  { to: '/config',    icon: 'cog',       label: 'Configuración' },
]

export default function Sidebar({ tc }) {
  return (
    <aside className="side">
      <div className="brand">
        <div className="brand-mark">GH</div>
        <div className="brand-txt">
          GH Cars
          <small>Gestión Automotriz</small>
        </div>
      </div>
      <nav className="nav">
        {NAV.map(n => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => isActive ? 'on' : ''}>
            <Icon name={n.icon} size={18} />
            {n.label}
          </NavLink>
        ))}
        <div className="sep">Admin</div>
        {NAV_ADMIN.map(n => (
          <NavLink key={n.to} to={n.to} className={({ isActive }) => isActive ? 'on' : ''}>
            <Icon name={n.icon} size={18} />
            {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="side-block">
        <h6>Cotización USD</h6>
        <div className="tc-row">
          <strong>$ {(tc || 0).toLocaleString('es-AR')}</strong>
          <small>ARS</small>
        </div>
      </div>
    </aside>
  )
}
