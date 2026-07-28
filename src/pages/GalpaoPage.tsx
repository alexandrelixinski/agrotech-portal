import { useState } from 'react'

import { DistribuicaoEstoqueChart } from '@/components/galpao/DistribuicaoEstoqueChart'
import { EstoqueTable } from '@/components/galpao/EstoqueTable'
import { NovoInsumoForm } from '@/components/galpao/NovoInsumoForm'
import { TopItensList } from '@/components/galpao/TopItensList'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useEstoque } from '@/hooks/useEstoque'
import { formatCurrency } from '@/lib/format'
import { CATEGORIA_INSUMO_LABELS, CATEGORIA_ORDEM } from '@/lib/labels'
import type { CategoriaInsumo } from '@/types'

export function GalpaoPage() {
  const { itens, loading, error, refetch } = useEstoque()
  const [busca, setBusca] = useState('')
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaInsumo | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)

  const valorTotal = itens.reduce((soma, it) => soma + it.quantidade * it.precoUnitario, 0)
  const valorAdubos = itens
    .filter((it) => it.categoria === 'Adubos')
    .reduce((soma, it) => soma + it.quantidade * it.precoUnitario, 0)
  const valorDefensivos = itens
    .filter((it) => it.categoria === 'Defensivos')
    .reduce((soma, it) => soma + it.quantidade * it.precoUnitario, 0)

  const itensFiltrados = itens.filter((it) => it.nome.toLowerCase().includes(busca.toLowerCase()))
  const categoriasPresentes = CATEGORIA_ORDEM.filter((cat) => itensFiltrados.some((it) => it.categoria === cat))
  const categoriaSelecionada =
    categoriaAtiva && categoriasPresentes.includes(categoriaAtiva) ? categoriaAtiva : (categoriasPresentes[0] ?? null)
  const itensDaAba = categoriaSelecionada ? itensFiltrados.filter((it) => it.categoria === categoriaSelecionada) : []

  return (
    <section className="stack">
      <header className="page-header">
        <h1>🏠 Meu Galpão</h1>
        <p>Estoque de insumos.</p>
      </header>

      {loading ? <p>Carregando estoque…</p> : null}
      {error ? (
        <p className="alert alert--error" role="alert">
          {error}
        </p>
      ) : null}

      {!loading && !error ? (
        <>
          <div className="grid">
            <Card title="Total" description={formatCurrency(valorTotal)} />
            <Card title="Itens Totais" description={`${itens.length} tipos`} />
            <Card title="Adubos" description={formatCurrency(valorAdubos)} />
            <Card title="Defensivos" description={formatCurrency(valorDefensivos)} />
          </div>

          <div className="grid">
            <DistribuicaoEstoqueChart itens={itens} />
            <TopItensList itens={itens} />
          </div>

          <div className="stack-sm">
            <div className="form-row">
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Pesquisar produto…"
                aria-label="Pesquisar produto"
              />
              <Button variant="ghost" onClick={() => setMostrarForm((v) => !v)}>
                {mostrarForm ? 'Fechar' : '+ Novo Insumo'}
              </Button>
            </div>

            {mostrarForm ? (
              <NovoInsumoForm
                itens={itens}
                onSaved={() => {
                  refetch()
                  setMostrarForm(false)
                }}
              />
            ) : null}

            {itens.length === 0 ? (
              <p>O galpão está vazio.</p>
            ) : categoriasPresentes.length === 0 ? (
              <p>Nenhum item encontrado.</p>
            ) : (
              <>
                <div className="category-tabs">
                  {categoriasPresentes.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={
                        cat === categoriaSelecionada ? 'category-tabs__btn category-tabs__btn--active' : 'category-tabs__btn'
                      }
                      onClick={() => setCategoriaAtiva(cat)}
                    >
                      {CATEGORIA_INSUMO_LABELS[cat]}
                    </button>
                  ))}
                </div>
                <EstoqueTable itens={itensDaAba} onDeleted={refetch} />
              </>
            )}
          </div>
        </>
      ) : null}
    </section>
  )
}
