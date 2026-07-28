import { Link } from 'react-router-dom'

import { Card } from '@/components/ui/Card'
import { ROUTES } from '@/routes/paths'

const FEATURES = [
  {
    title: 'Gestão de talhões',
    description: 'Cadastre áreas, culturas e acompanhe o ciclo produtivo.',
  },
  {
    title: 'Indicadores',
    description: 'Painéis com área plantada, produtividade e status das safras.',
  },
  {
    title: 'Integrações',
    description: 'Estrutura pronta para consumir APIs internas e de terceiros.',
  },
]

export function HomePage() {
  return (
    <section className="stack">
      <div className="hero">
        <h1 className="hero__title">AgroTech Portal</h1>
        <p className="hero__subtitle">
          Estrutura inicial em React + TypeScript + Vite, pronta para deploy na Vercel.
        </p>
        <Link to={ROUTES.dashboard} className="btn btn--primary">
          Abrir dashboard
        </Link>
      </div>

      <div className="grid">
        {FEATURES.map((feature) => (
          <Card key={feature.title} title={feature.title} description={feature.description} />
        ))}
      </div>
    </section>
  )
}
