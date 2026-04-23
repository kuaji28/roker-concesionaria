import { useNavigate } from 'react-router-dom'
import Icon from './Icon'
import StateBadge from './StateBadge'
import { useTcContext } from '../hooks/useTc'

export default function VehicleCard({ v }) {
  const navigate = useNavigate()
  const TC = useTcContext()
  const isNew = !v.km_hs || v.km_hs === 0

  return (
    <div className="veh" onClick={() => navigate(`/vehiculo/${v.id}`)}>
      <div className="media">
        {v.foto_url
          ? <img src={v.foto_url} alt={`${v.marca} ${v.modelo}`} />
          : <div className="ph"><Icon name="car" size={48} /></div>
        }
        <span className={`cond-tag ${isNew ? 'new' : ''}`}>
          {isNew ? '0 KM' : 'Usado'}
        </span>
      </div>
      <div className="body">
        <div className="t">
          {v.marca} {v.modelo} {v.anio}
          {v.version && <em> · {v.version}</em>}
        </div>
        <div className="row">
          <StateBadge estado={v.estado} />
          {!isNew && (
            <span className="km">
              <Icon name="gauge" size={12} />
              {v.km_hs?.toLocaleString('es-AR')} km
            </span>
          )}
        </div>
        <div className="price">
          <span className="cur">USD</span>
          {v.precio_base?.toLocaleString('es-AR')}
        </div>
        <div className="ars">
          $ {((v.precio_base || 0) * TC).toLocaleString('es-AR')} ARS
        </div>
      </div>
    </div>
  )
}
