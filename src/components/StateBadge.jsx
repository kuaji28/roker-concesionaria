import Icon from './Icon'

const META = {
  disponible:     { cls: 'success', label: 'Disponible',     icon: 'check' },
  señado:         { cls: 'warning', label: 'Señado',         icon: null },
  en_preparacion: { cls: 'info',    label: 'En preparación', icon: 'wrench' },
  en_service:     { cls: 'info',    label: 'En service',     icon: 'wrench' },
  en_chaperia:    { cls: 'info',    label: 'En chapería',    icon: 'paint' },
  en_revision:    { cls: 'info',    label: 'En revisión',    icon: 'eye' },
  vendido:        { cls: 'danger',  label: 'Vendido',        icon: null },
}

const UBICACION_META = {
  showroom:  { cls: 'success', label: 'Showroom'    },
  taller:    { cls: 'warning', label: 'Taller'      },
  cochera:   { cls: 'info',    label: 'Cochera'     },
  traslado:  { cls: 'caution', label: 'En traslado' },
  cliente:   { cls: 'purple',  label: 'En cliente'  },
}

const RECON_META = {
  ingresado:        { cls: 'neutral',  label: 'Ingresado'       },
  inspeccion:       { cls: 'info',     label: 'En inspección'   },
  mecanica:         { cls: 'warning',  label: 'En mecánica'     },
  detailing:        { cls: 'purple',   label: 'En detailing'    },
  fotos_pendientes: { cls: 'danger',   label: 'Fotos pendientes'},
  listo:            { cls: 'success',  label: 'Listo para venta'},
  publicado:        { cls: 'teal',     label: 'Publicado'       },
}

export { META as ESTADO_META, UBICACION_META, RECON_META }

export default function StateBadge({ estado, ubicacion, recon, small }) {
  if (ubicacion) {
    const m = UBICACION_META[ubicacion] || { cls: 'neutral', label: ubicacion }
    return (
      <span className={`badge ${m.cls}${small ? ' badge-sm' : ''}`}>
        <span className="cdot" />{m.label}
      </span>
    )
  }
  if (recon) {
    const m = RECON_META[recon] || { cls: 'neutral', label: recon }
    return (
      <span className={`badge ${m.cls}${small ? ' badge-sm' : ''}`}>
        <span className="cdot" />{m.label}
      </span>
    )
  }
  const m = META[estado] || META.disponible
  return (
    <span className={`badge ${m.cls}${small ? ' badge-sm' : ''}`}>
      {m.icon
        ? <Icon name={m.icon} size={11} />
        : <span className="cdot" />
      }
      {m.label}
    </span>
  )
}
