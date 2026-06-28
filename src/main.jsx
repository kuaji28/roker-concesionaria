import React from 'react'
import ReactDOM from 'react-dom/client'
import './shell.css'
import App from './App'
import { loginUsuario } from './lib/supabase'

// Demo aislado (carhub-demo): auto-login como DUEÑO demo (acceso total, SIN el rol developer)
// para que la vendedora del showroom muestre TODO el sistema sin pedir PIN. Apunta a un Supabase
// demo con datos ficticios (no el del cliente real). Solo si VITE_DEMO_MODE=true (build del demo).
// Patrón: logear ANTES de montar App, así el estado inicial (gh_auth_user en sessionStorage) ya
// arranca autenticado. Si falla, cae al login normal (no rompe nada).
async function bootDemo() {
  if (import.meta.env.VITE_DEMO_MODE !== 'true') return
  try {
    if (!sessionStorage.getItem('gh_auth_user')) {
      const u = await loginUsuario('Demo', '1234')
      sessionStorage.setItem('gh_auth_user', JSON.stringify(u))
    }
  } catch (e) { /* sin sesión demo → muestra el login normal */ }
}

bootDemo().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})
