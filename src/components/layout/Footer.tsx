import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { APP_NAME, APP_VERSION } from '@/lib/constants'

export function Footer() {
  const [menuOpen, setMenuOpen] = useState(false)

  const menuItems = [
    { label: 'Lavoura', path: '/roca', icon: '🌱' },
    { label: 'Armazém', path: '/galpao', icon: '🏭' },
    { label: 'Financeiro', path: '/financas', icon: '💰' },
    { label: 'Dashboard', path: '/', icon: '📊' },
  ]

  return (
    <footer className="app-footer">
      <div className="app-footer__toggle-row">
        <button
          type="button"
          className="app-footer__toggle"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span className="app-footer__toggle-label">Menu</span>
          <span className={`app-footer__toggle-icon ${menuOpen ? 'app-footer__toggle-icon--open' : ''}`}>
            ⌄
          </span>
        </button>
      </div>

      <nav
        className={`app-footer__menu ${menuOpen ? 'app-footer__menu--open' : 'app-footer__menu--closed'}`}
        aria-label="Navegação principal"
      >
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              isActive ? 'app-footer__link app-footer__link--active' : 'app-footer__link'
            }
            onClick={() => setMenuOpen(false)}
          >
            <span className="app-footer__icon">{item.icon}</span>
            <span className="app-footer__label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="app-footer__meta">
        {APP_NAME} v{APP_VERSION}
      </div>
    </footer>
  )
}
