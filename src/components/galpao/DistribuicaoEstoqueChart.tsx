import { Card } from '@/components/ui/Card'
import { CATEGORIA_COLOR_VAR, CATEGORIA_INSUMO_LABELS, CATEGORIA_ORDEM } from '@/lib/labels'
import { formatCurrency } from '@/lib/format'
import type { ItemEstoque } from '@/types'

type DistribuicaoEstoqueChartProps = {
  itens: ItemEstoque[]
}

export function DistribuicaoEstoqueChart({ itens }: DistribuicaoEstoqueChartProps) {
  const valorPorCategoria = CATEGORIA_ORDEM.map((categoria) => ({
    categoria,
    valor: itens
      .filter((it) => it.categoria === categoria)
      .reduce((soma, it) => soma + it.quantidade * it.precoUnitario, 0),
  })).filter((entry) => entry.valor > 0)

  const total = valorPorCategoria.reduce((soma, entry) => soma + entry.valor, 0)

  return (
    <Card title="📊 Distribuição de Valor">
      {total === 0 ? (
        <p className="lote-card__meta">Cadastre itens para gerar o gráfico.</p>
      ) : (
        <>
          <div className="stacked-bar" role="img" aria-label="Distribuição de valor do estoque por categoria">
            {valorPorCategoria.map((entry) => (
              <div
                key={entry.categoria}
                className="stacked-bar__segment"
                style={{
                  width: `${(entry.valor / total) * 100}%`,
                  backgroundColor: CATEGORIA_COLOR_VAR[entry.categoria],
                }}
              />
            ))}
          </div>

          <div className="legend">
            {valorPorCategoria.map((entry) => (
              <span className="legend__item" key={entry.categoria}>
                <span
                  className="legend__swatch"
                  style={{ backgroundColor: CATEGORIA_COLOR_VAR[entry.categoria] }}
                />
                <span className="legend__label">{CATEGORIA_INSUMO_LABELS[entry.categoria]}</span>
                <span className="legend__value">
                  {formatCurrency(entry.valor)} ({((entry.valor / total) * 100).toFixed(0)}%)
                </span>
              </span>
            ))}
          </div>
        </>
      )}
    </Card>
  )
}
