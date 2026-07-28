import { Link } from 'react-router-dom'

import { ROUTES } from '@/routes/paths'

export function NotFoundPage() {
  return (
    <section className="stack page-header">
      <h1>404</h1>
      <p>A página que você procura não existe.</p>
      <Link to={ROUTES.home} className="btn btn--ghost">
        Voltar ao início
      </Link>
    </section>
  )
}
