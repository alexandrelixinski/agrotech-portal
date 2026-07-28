import { formatCurrency } from '@/lib/format'
import type { Lote, Venda } from '@/types'

type ResultadoPorLoteProps = {
  lotes: Lote[]
  vendas: Venda[]
}

export function ResultadoPorLote({ lotes, vendas }: ResultadoPorLoteProps) {
  if (lotes.length === 0) {
    return <p>Aguardando lotes para análise.</p>
  }

  return (
    <div className="stack-sm">
      {lotes.map((lote) => {
        const vendasLote = vendas
          .filter((v) => v.loteId === lote.id)
          .reduce((soma, v) => soma + v.valorTotal, 0)

        return (
          <details className="card" key={lote.id}>
            <summary>Lote: {lote.cultura.toUpperCase()}</summary>
            <p className="lote-card__meta">Vendas deste lote: {formatCurrency(vendasLote)}</p>
          </details>
        )
      })}
    </div>
  )
}
