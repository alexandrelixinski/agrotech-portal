import { APP_NAME, APP_VERSION } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="app-footer">
      <div className="container app-footer__inner">
        <span>
          © {new Date().getFullYear()} {APP_NAME}
        </span>
        <span className="app-footer__version">v{APP_VERSION}</span>
      </div>
    </footer>
  )
}
