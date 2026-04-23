import TopBar from '../components/TopBar'
import Icon from '../components/Icon'

export default function Placeholder({ title, onLogout }) {
  return (
    <div>
      <TopBar onLogout={onLogout} />
      <div className="main">
        <div className="page-head">
          <div>
            <h1 className="page-title">{title}</h1>
            <p className="page-caption">Pantalla en construcción</p>
          </div>
        </div>
        <div className="banner info">
          <Icon name="info" size={16} />
          Esta pantalla estará disponible próximamente.
        </div>
      </div>
    </div>
  )
}
