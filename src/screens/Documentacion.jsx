import { useState } from 'react'

const SECCIONES = [
  {
    id: 'ingreso',
    titulo: 'Ingreso de vehículo',
    emoji: '🚗',
    pasos: [
      'Ir a "Ingresar vehículo" en el menú lateral.',
      'Completar el formulario: marca, modelo, año, patente, precio, combustible y transmisión.',
      'Guardar el vehículo — queda en estado "Disponible".',
      'Abrir el vehículo desde el Catálogo y cargar fotos en la pestaña "Fotos".',
      'El vehículo aparecerá automáticamente en el catálogo público.',
    ],
    tip: 'Cargá siempre al menos una foto. Los vehículos con fotos reciben mucho más consultas.',
  },
  {
    id: 'ventas',
    titulo: 'Registrar una venta',
    emoji: '💰',
    pasos: [
      'Ir a "Ventas" en el menú lateral.',
      'Seleccionar el vehículo vendido de la lista.',
      'Completar los datos del comprador: nombre, DNI y teléfono.',
      'Indicar precio final, moneda y forma de pago.',
      'Si es financiación, completar el plan de cuotas.',
      'Confirmar — el vehículo pasa a estado "Vendido" automáticamente.',
    ],
    tip: 'Si el cliente dejó una seña antes, asegurate de que el vehículo figure como "Señado" primero.',
  },
  {
    id: 'leads',
    titulo: 'Pipeline de prospectos',
    emoji: '📋',
    pasos: [
      'Los prospectos representan personas interesadas pero que aún no compraron.',
      'Cada prospecto tiene un estado: Nuevo → Contactado → En negociación → Ganado / Perdido.',
      'Para mover un prospecto entre etapas, abrilo y cambiá el estado desde la ficha.',
      '"Ganado" significa que se concretó la venta. "Perdido" que el cliente se fue.',
      'Usá las notas para registrar conversaciones importantes con el cliente.',
    ],
    tip: 'Revisá los prospectos "En negociación" todos los días — son los que más cerca están de comprar.',
  },
  {
    id: 'cobranza',
    titulo: 'Cobranza de cuotas',
    emoji: '📅',
    pasos: [
      'Ir a "Cobranza" en el menú lateral.',
      'Ver las cuotas vencidas y las próximas a vencer.',
      'Al cobrar una cuota, marcala como pagada con el botón correspondiente.',
      'Los financiamientos se crean automáticamente al registrar una venta en cuotas.',
      'Si hay un atraso, podés registrar notas en la ficha del financiamiento.',
    ],
    tip: 'Las cuotas vencidas aparecen marcadas en rojo. Contactá al cliente antes de que acumule atrasos.',
  },
  {
    id: 'catalogo',
    titulo: 'Catálogo público',
    emoji: '🌐',
    pasos: [
      'El catálogo público no requiere login — cualquier persona puede verlo.',
      'El link está en Configuración → sección "Link del catálogo público".',
      'Compartí ese link por WhatsApp, Instagram o donde quieras.',
      'Los clientes pueden consultar directamente por WhatsApp desde el catálogo.',
      'Solo aparecen vehículos en estado "Disponible".',
    ],
    tip: 'Usá el botón "Copiar link" en Configuración para obtener la URL exacta del catálogo.',
  },
]

function Seccion({ s }) {
  const [abierto, setAbierto] = useState(false)

  return (
    <div
      style={{
        border: '1px solid var(--c-border)',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 10,
      }}
    >
      <button
        onClick={() => setAbierto(a => !a)}
        style={{
          width: '100%',
          background: abierto ? 'var(--c-bg-2)' : 'var(--c-surface)',
          border: 'none',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 22 }}>{s.emoji}</span>
        <span style={{ flex: 1, fontWeight: 600, fontSize: 15, color: 'var(--c-fg)' }}>{s.titulo}</span>
        <span style={{
          fontSize: 18, color: 'var(--c-fg-3)',
          transform: abierto ? 'rotate(90deg)' : 'none',
          transition: 'transform 0.2s ease',
          display: 'inline-block',
        }}>›</span>
      </button>

      {abierto && (
        <div style={{ padding: '0 18px 18px', background: 'var(--c-surface)' }}>
          <ol style={{ margin: '12px 0 0', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {s.pasos.map((p, i) => (
              <li key={i} style={{ fontSize: 14, color: 'var(--c-fg)', lineHeight: 1.5 }}>{p}</li>
            ))}
          </ol>
          {s.tip && (
            <div style={{
              marginTop: 12,
              padding: '10px 14px',
              background: 'rgba(var(--c-accent-rgb, 59,130,246), 0.08)',
              borderLeft: '3px solid var(--c-accent)',
              borderRadius: 6,
              fontSize: 13,
              color: 'var(--c-fg-2)',
            }}>
              <strong style={{ color: 'var(--c-accent)' }}>Tip:</strong> {s.tip}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Documentacion() {
  return (
    <div>
      <div className="main" style={{ maxWidth: 720 }}>
        <div className="page-head">
          <div>
            <h1 className="page-title">📋 Guía Rápida GH Cars</h1>
            <p className="page-caption">Instrucciones paso a paso para las tareas más frecuentes</p>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20, padding: '14px 18px' }}>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--c-fg-2)', lineHeight: 1.6 }}>
            Esta guía cubre las operaciones del día a día en GH Cars.
            Hacé clic en cada sección para ver los pasos detallados.
          </p>
        </div>

        {SECCIONES.map(s => <Seccion key={s.id} s={s} />)}

        <div className="card" style={{ marginTop: 20, padding: '14px 18px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--c-fg-3)' }}>
            ¿Tenés alguna duda? Consultá al administrador del sistema.
          </p>
        </div>
      </div>
    </div>
  )
}
