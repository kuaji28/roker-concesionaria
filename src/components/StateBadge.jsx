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

export { META as ESTADO_META }

export default function StateBadge({ estado }) {
  const m = META[estado] || META.disponible
  return (
    <span className={`badge ${m.cls}`}>
      {m.icon
        ? <Icon name={m.icon} size={11} />
        : <span className="cdot" />
      }
      {m.label}
    </span>
  )
}
