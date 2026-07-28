import { Link } from 'react-router-dom'

import { Card } from '@/components/ui/Card'
import { ROUTES } from '@/routes/paths'

const FEATURES = [
  {
    title: '🚜 Minha Roça',
    description: 'Cadastre lotes, registre operações e acompanhe o diário de cada safra.',
  },
  {
    title: '🏠 Meu Galpão',
    description: 'Controle o estoque de insumos, valor por categoria e itens em baixa.',
  },
  {
    title: '💰 Finanças',
    description: 'Custos, vendas e lucratividade consolidados por lote.',
  },
]

export function HomePage() {
  return (
    <section className="stack">
      <div className="hero">
        <h1 className="hero__title">AgroTech Portal</h1>
        <p className="hero__subtitle">Gestão de safras, estoque e finanças em um só lugar.</p>
        <Link to={ROUTES.roca} className="btn btn--primary">
          Abrir Minha Roça
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
