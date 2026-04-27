import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Icon from './components/Icon'
import { useIsMobile } from './hooks/useIsMobile'

function BottomNavItem({ to, icon, label, end }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => 'bn-item' + (isActive ? ' bn-on' : '')}>
      <span className="bn-icon"><Icon name={icon} size={22} /></span>
      <span className="bn-label">{label}</span>
    </NavLink>
  )
}

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <BottomNavItem to="/"        icon="home"    label="Inicio"    end />
      <BottomNavItem to="/catalogo" icon="car"    label="Catálogo" />
      <NavLink to="/ingreso" className="bn-fab" title="Ingresar vehículo">
        <Icon name="plus" size={26} />
      </NavLink>
      <BottomNavItem to="/leads"   icon="users"   label="Leads" />
      <BottomNavItem to="/reportes" icon="chart"  label="Reportes" />
    </nav>
  )
}
import Login from './screens/Login'
import Dashboard from './screens/Dashboard'
import Catalogo from './screens/Catalogo'
import Detalle from './screens/Detalle'
import Ingreso from './screens/Ingreso'
import Ventas from './screens/Ventas'
import Reportes from './screens/Reportes'
import Gerente from './screens/Gerente'
import Vendedores from './screens/Vendedores'
import Cobranza from './screens/Cobranza'
import Config from './screens/Config'
import Leads from './screens/Leads'
import Clientes from './screens/Clientes'
import Gastos from './screens/Gastos'
import Rotacion from './screens/Rotacion'
import Buscar from './screens/Buscar'
import Agenda from './screens/Agenda'
import Documentacion from './screens/Documentacion'
import CatalogoPublico from './screens/CatalogoPublico'
import DetallePublico from './screens/DetallePublico'
import HomePublica from './screens/HomePublica'
import ContactoPublico from './screens/ContactoPublico'
import Mejoras from './screens/Mejoras'
import Historial from './screens/Historial'
import Sistema from './screens/Sistema'
import VendedorCatalogo from './screens/VendedorCatalogo'
import VendedorDetalle from './screens/VendedorDetalle'
import VendedorLead from './screens/VendedorLead'
import { useTc, TcContext } from './hooks/useTc'
import { UserContext } from './hooks/useUser'
import { ThemeProvider } from './context/ThemeContext'
import { supabase } from './lib/supabase'

function ProtectedRoute({ element, isAuth }) {
  return isAuth ? element : <Navigate to="/login" replace />
}

function RoleRoute({ element, user, allowedRoles }) {
  if (!user) return <Navigate to="/login" replace />
  if (user.rol === 'developer') return element
  if (!allowedRoles.includes(user.rol)) {
    return (
      <div className="main" style={{ paddingTop: 80, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h2 style={{ color: 'var(--c-fg-2)', marginBottom: 8 }}>Acceso restringido</h2>
        <p style={{ color: 'var(--c-fg-3)', fontSize: 14 }}>No tenés permisos para ver esta sección.</p>
      </div>
    )
  }
  return element
}

function AppShell({ onLogout, user }) {
  const tc = useTc()
  const isMobile = useIsMobile()
  return (
    <UserContext.Provider value={user}>
    <TcContext.Provider value={tc}>
    <div className={isMobile ? undefined : 'app'} style={isMobile ? { minHeight: '100vh' } : undefined}>
      <Sidebar tc={tc} />
      <div style={{ minWidth: 0, flex: 1, paddingTop: isMobile ? 52 : 0, paddingBottom: isMobile ? 72 : 0 }}>
        {isMobile && <BottomNav />}
        <Routes>
          <Route path="/"             element={<Dashboard   onLogout={onLogout} />} />
          <Route path="/catalogo"     element={<Catalogo    onLogout={onLogout} />} />
          <Route path="/vehiculo/:id" element={<Detalle     onLogout={onLogout} />} />
          <Route path="/ingreso"      element={<RoleRoute element={<Ingreso     onLogout={onLogout} />} user={user} allowedRoles={['dueno', 'vendedor']} />} />
          <Route path="/ventas"       element={<RoleRoute element={<Ventas      onLogout={onLogout} />} user={user} allowedRoles={['dueno', 'vendedor']} />} />
          <Route path="/leads"        element={<RoleRoute element={<Leads       onLogout={onLogout} />} user={user} allowedRoles={['dueno', 'vendedor']} />} />
          <Route path="/clientes"     element={<RoleRoute element={<Clientes    onLogout={onLogout} />} user={user} allowedRoles={['dueno', 'vendedor']} />} />
          <Route path="/gastos"       element={<RoleRoute element={<Gastos      onLogout={onLogout} />} user={user} allowedRoles={['dueno']} />} />
          <Route path="/rotacion"     element={<RoleRoute element={<Rotacion    onLogout={onLogout} />} user={user} allowedRoles={['dueno']} />} />
          <Route path="/buscar"       element={<Buscar      onLogout={onLogout} />} />
          <Route path="/agenda"       element={<RoleRoute element={<Agenda      onLogout={onLogout} />} user={user} allowedRoles={['dueno', 'vendedor']} />} />
          <Route path="/doc"          element={<Documentacion />} />
          <Route path="/reportes"     element={<Reportes    onLogout={onLogout} />} />
          <Route path="/gerente"      element={<RoleRoute element={<Gerente     onLogout={onLogout} />} user={user} allowedRoles={['dueno']} />} />
          <Route path="/vendedores"   element={<RoleRoute element={<Vendedores  onLogout={onLogout} />} user={user} allowedRoles={['dueno']} />} />
          <Route path="/cobranza"     element={<RoleRoute element={<Cobranza    onLogout={onLogout} />} user={user} allowedRoles={['dueno']} />} />
          <Route path="/config"       element={<RoleRoute element={<Config      onLogout={onLogout} />} user={user} allowedRoles={['dueno']} />} />
          <Route path="/mejoras"      element={<RoleRoute element={<Mejoras     onLogout={onLogout} />} user={user} allowedRoles={['dueno']} />} />
          <Route path="/historial"    element={<RoleRoute element={<Historial   onLogout={onLogout} />} user={user} allowedRoles={['dueno']} />} />
          <Route path="/sistema"      element={<RoleRoute element={<Sistema     onLogout={onLogout} />} user={user} allowedRoles={['developer']} />} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
    </TcContext.Provider>
    </UserContext.Provider>
  )
}

export default function App() {
  const [auth, setAuth] = useState(() => !!sessionStorage.getItem('gh_auth_user'))
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('gh_auth_user') || 'null') } catch { return null }
  })

  function handleLogin(u) {
    sessionStorage.setItem('gh_auth_user', JSON.stringify(u))
    setAuth(true)
    setUser(u)
  }
  function handleLogout() {
    sessionStorage.removeItem('gh_auth_user')
    setAuth(false)
    setUser(null)
  }

  useEffect(() => {
    if (!user?.id) return
    supabase
      .from('perfiles')
      .select('id, nombre, email, rol, activo')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (!data) return
        if (!data.activo) { handleLogout(); return }
        if (data.rol !== user.rol || data.nombre !== user.nombre) {
          sessionStorage.setItem('gh_auth_user', JSON.stringify(data))
          setUser(data)
        }
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ThemeProvider>
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas — sin auth */}
        <Route path="/p/home"            element={<HomePublica />} />
        <Route path="/p/catalogo"        element={<CatalogoPublico />} />
        <Route path="/p/vehiculo/:id"    element={<DetallePublico />} />
        <Route path="/p/contacto"        element={<ContactoPublico />} />

        {/* App vendedor mobile — auth requerida */}
        <Route path="/vendedor"           element={auth ? <VendedorCatalogo /> : <Navigate to="/login" replace />} />
        <Route path="/vendedor/v/:id"     element={auth ? <VendedorDetalle /> : <Navigate to="/login" replace />} />
        <Route path="/vendedor/lead/nuevo" element={auth ? <VendedorLead /> : <Navigate to="/login" replace />} />

        {/* Redirect raíz: visitante no autenticado → home pública */}
        {!auth && <Route path="/" element={<Navigate to="/p/home" replace />} />}
        <Route path="/login" element={auth ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} />
        <Route
          path="*"
          element={<ProtectedRoute isAuth={auth} element={<AppShell onLogout={handleLogout} user={user} />} />}
        />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  )
}
