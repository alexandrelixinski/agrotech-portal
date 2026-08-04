import { NavLink } from 'react-router-dom'

import { ROUTES } from '@/routes/paths'

export function Header() {
  return (
    <header className="app-header">
      <div className="container app-header__inner">
        <NavLink to={ROUTES.home} className="app-header__brand">
          <span className="app-header__logo" aria-hidden="true">
            🌱
          </span>
          AgroTech Portal
        </NavLink>
        <button type="button" className="app-header__profile" aria-label="Acessar perfil">
          👤
        </button>
      </div>
    </header>
  )
}
