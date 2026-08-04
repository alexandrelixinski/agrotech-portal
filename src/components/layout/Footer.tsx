import { NavLink } from 'react-router-dom'

export function Footer() {
  const menuItems = [
    { label: 'Lavoura', path: '/roca', icon: '🌱' },
    { label: 'Armazém', path: '/galpao', icon: '🏭' },
    { label: 'Financeiro', path: '/financas', icon: '💰' },
    { label: 'Dashboard', path: '/', icon: '📊' },
  ]

  return (
    <footer className="app-footer">
      <nav className="app-footer__menu" aria-label="Navegação principal">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              isActive ? 'app-footer__link app-footer__link--active' : 'app-footer__link'
            }
          >
            <span className="app-footer__icon">{item.icon}</span>
            <span className="app-footer__label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </footer>
  )
}
