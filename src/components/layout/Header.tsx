import { NavLink } from 'react-router-dom'

import { ROUTES } from '@/routes/paths'

const NAV_ITEMS = [
  { to: ROUTES.home, label: 'Início', end: true },
  { to: ROUTES.roca, label: 'Minha Roça', end: false },
  { to: ROUTES.galpao, label: 'Meu Galpão', end: false },
  { to: ROUTES.financas, label: 'Finanças', end: false },
  { to: ROUTES.about, label: 'Sobre', end: false },
]

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

        <nav className="app-nav" aria-label="Navegação principal">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
