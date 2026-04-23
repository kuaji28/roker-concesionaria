import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
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
import Placeholder from './screens/Placeholder'
import { useTc, TcContext } from './hooks/useTc'

function ProtectedRoute({ element, isAuth }) {
  return isAuth ? element : <Navigate to="/login" replace />
}

function AppShell({ onLogout }) {
  const tc = useTc()
  return (
    <TcContext.Provider value={tc}>
    <div className="app">
      <Sidebar tc={tc} />
      <div style={{ minWidth: 0, flex: 1 }}>
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
          <Route path="/doc"          element={<Placeholder title="Documentación" onLogout={onLogout} />} />
          <Route path="/reportes"     element={<Reportes    onLogout={onLogout} />} />
          <Route path="/gerente"      element={<Gerente     onLogout={onLogout} />} />
          <Route path="/vendedores"   element={<Vendedores  onLogout={onLogout} />} />
          <Route path="/cobranza"     element={<Cobranza    onLogout={onLogout} />} />
          <Route path="/config"       element={<Config      onLogout={onLogout} />} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
    </TcContext.Provider>
  )
}

export default function App() {
  const [auth, setAuth] = useState(() => !!sessionStorage.getItem('gh_auth_user'))
  function handleLogin(user) {
    sessionStorage.setItem('gh_auth_user', JSON.stringify(user))
    setAuth(true)
  }
  function handleLogout() { sessionStorage.removeItem('gh_auth_user'); setAuth(false) }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={auth ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} />
        <Route
          path="*"
          element={<ProtectedRoute isAuth={auth} element={<AppShell onLogout={handleLogout} />} />}
        />
      </Routes>
    </BrowserRouter>
  )
}
