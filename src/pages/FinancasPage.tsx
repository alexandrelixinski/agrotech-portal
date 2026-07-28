import { LancamentoForm } from '@/components/financas/LancamentoForm'
import { ResultadoPorLote } from '@/components/financas/ResultadoPorLote'
import { Card } from '@/components/ui/Card'
import { useEstoque } from '@/hooks/useEstoque'
import { useLancamentosFinanceiros } from '@/hooks/useLancamentosFinanceiros'
import { useLotes } from '@/hooks/useLotes'
import { useVendas } from '@/hooks/useVendas'
import { formatCurrency } from '@/lib/format'

export function FinancasPage() {
  const { itens, loading: loadingEstoque } = useEstoque()
  const { lotes, loading: loadingLotes, refetch: refetchLotes } = useLotes()
  const { vendas, loading: loadingVendas, refetch: refetchVendas } = useVendas()
  const { lancamentos, loading: loadingLancamentos, refetch: refetchLancamentos } = useLancamentosFinanceiros()

  const loading = loadingEstoque || loadingLotes || loadingVendas || loadingLancamentos

  const valArmazem = itens.reduce((soma, it) => soma + it.quantidade * it.precoUnitario, 0)
  const custosRoca = lotes.reduce((soma, l) => soma + l.custoTotal, 0)
  const valExtras = lancamentos.reduce((soma, f) => soma + f.valor, 0)
  const custosTotais = custosRoca + valExtras
  const valVendas = vendas.reduce((soma, v) => soma + v.valorTotal, 0)
  const lucroTotal = valVendas - custosTotais
  const margemTotal = valVendas > 0 ? (lucroTotal / valVendas) * 100 : 0

  function handleSaved() {
    refetchLotes()
    refetchVendas()
    refetchLancamentos()
  }

  return (
    <section className="stack">
      <header className="page-header">
        <h1>💰 Gestão Financeira e Lucratividade</h1>
      </header>

      {loading ? <p>Carregando…</p> : null}

      {!loading ? (
        <>
          <div className="grid">
            <Card title="🏠 Valor no Armazém" description={formatCurrency(valArmazem)} />
            <Card title="💸 Custos Totais" description={formatCurrency(custosTotais)} />
            <Card title="💰 Total Vendas" description={formatCurrency(valVendas)} />
            <Card
              title="📈 Lucro Geral"
              description={`${formatCurrency(lucroTotal)} (${margemTotal.toFixed(1)}%)`}
            />
          </div>

          <div className="two-col">
            <LancamentoForm lotes={lotes} onSaved={handleSaved} />

            <div className="stack-sm">
              <h3 className="card__title">📊 Resultados por Lote</h3>
              <ResultadoPorLote lotes={lotes} vendas={vendas} />
            </div>
          </div>
        </>
      ) : null}
    </section>
  )
}
