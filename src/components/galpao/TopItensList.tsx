import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/format'
import type { ItemEstoque } from '@/types'

type TopItensListProps = {
  itens: ItemEstoque[]
}

export function TopItensList({ itens }: TopItensListProps) {
  const top = [...itens]
    .map((it) => ({ ...it, valorTotal: it.quantidade * it.precoUnitario }))
    .sort((a, b) => b.valorTotal - a.valorTotal)
    .slice(0, 3)
  const maiorValor = top[0]?.valorTotal ?? 0

  return (
    <Card title="🏆 Top Itens (Valor)">
      {top.length === 0 ? (
        <p className="lote-card__meta">Sem dados</p>
      ) : (
        <div className="stack-sm">
          {top.map((it) => (
            <div key={it.id}>
              <div className="meter-row__header">
                <span className="legend__label">{it.nome}</span>
                <span className="legend__value">{formatCurrency(it.valorTotal)}</span>
              </div>
              <div className="meter">
                <div
                  className="meter__fill"
                  style={{ width: `${maiorValor > 0 ? (it.valorTotal / maiorValor) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
