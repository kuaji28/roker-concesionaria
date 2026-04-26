import { useState } from 'react'
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
import Mejoras from './screens/Mejoras'
import { useTc, TcContext } from './hooks/useTc'
import { UserContext } from './hooks/useUser'
import { ThemeProvider } from './context/ThemeContext'

function ProtectedRoute({ element, isAuth }) {
  return isAuth ? element : <Navigate to="/login" replace />
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
          <Route path="/ingreso"      element={<Ingreso     onLogout={onLogout} />} />
          <Route path="/ventas"       element={<Ventas      onLogout={onLogout} />} />
          <Route path="/leads"        element={<Leads       onLogout={onLogout} />} />
          <Route path="/clientes"     element={<Clientes    onLogout={onLogout} />} />
          <Route path="/gastos"       element={<Gastos      onLogout={onLogout} />} />
          <Route path="/rotacion"     element={<Rotacion    onLogout={onLogout} />} />
          <Route path="/buscar"       element={<Buscar      onLogout={onLogout} />} />
          <Route path="/agenda"       element={<Agenda      onLogout={onLogout} />} />
          <Route path="/doc"          element={<Documentacion />} />
          <Route path="/reportes"     element={<Reportes    onLogout={onLogout} />} />
          <Route path="/gerente"      element={<Gerente     onLogout={onLogout} />} />
          <Route path="/vendedores"   element={<Vendedores  onLogout={onLogout} />} />
          <Route path="/cobranza"     element={<Cobranza    onLogout={onLogout} />} />
          <Route path="/config"       element={<Config      onLogout={onLogout} />} />
          <Route path="/mejoras"      element={<Mejoras     onLogout={onLogout} />} />
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

  return (
    <ThemeProvider>
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas — sin auth */}
        <Route path="/p/home"            element={<HomePublica />} />
        <Route path="/p/catalogo"        element={<CatalogoPublico />} />
        <Route path="/p/vehiculo/:id"    element={<DetallePublico />} />

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
