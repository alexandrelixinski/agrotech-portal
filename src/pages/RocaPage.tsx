import { useMemo, useState } from 'react'
import { LoteCard } from '@/components/roca/LoteCard'
import { NovoLoteForm } from '@/components/roca/NovoLoteForm'
import { useEstoque } from '@/hooks/useEstoque'
import { useLotes } from '@/hooks/useLotes'

const NEON_GREEN = '#00FF66'
const FILTERS = ['Todos', 'Soja', 'Milho', 'Algodão'] as const
type Filtro = typeof FILTERS[number]

export function RocaPage() {
  const { lotes, loading, error, refetch: refetchLotes } = useLotes()
  const { itens: itensEstoque, refetch: refetchEstoque } = useEstoque()

  const [activeFilter, setActiveFilter] = useState<Filtro>('Todos')

  const listaLotes = lotes ?? []
  const totalLotes = listaLotes.length
  const plantiosAtivos = listaLotes.length // TODO: ajustar quando houver campo de status

  const areaTotalHa = useMemo(
    () => listaLotes.reduce((soma, lote) => soma + Number(lote.areaHectares || 0), 0),
    [listaLotes],
  )

  const lotesFiltrados = useMemo(() => {
    if (activeFilter === 'Todos') return listaLotes
    return listaLotes.filter((lote) => lote.cultura?.toLowerCase() === activeFilter.toLowerCase())
  }, [listaLotes, activeFilter])

  return (
    <section className="roca-page">
      <div className="roca-page__inner">
        <header className="roca-page__header">
          <div>
            <h1 className="roca-page__title">Lavoura</h1>
            <p className="roca-page__subtitle">Gestão de plantio, lotes e aplicações</p>
          </div>
          <span className="roca-page__tag">Safra 25/26</span>
        </header>

        <div className="roca-summary-grid">
          <div className="roca-summary-card">
            <span className="roca-summary-card__value" style={{ color: NEON_GREEN }}>
              {totalLotes}
            </span>
            <span className="roca-summary-card__label">Total de Lotes</span>
          </div>

          <div className="roca-summary-card">
            <span className="roca-summary-card__value" style={{ color: NEON_GREEN }}>
              {areaTotalHa.toFixed(1)} ha
            </span>
            <span className="roca-summary-card__label">Área Plantada</span>
          </div>

          <div className="roca-summary-card">
            <span className="roca-summary-card__value" style={{ color: NEON_GREEN }}>
              {plantiosAtivos}
            </span>
            <span className="roca-summary-card__label">Plantios Ativos</span>
          </div>

          <div className="roca-summary-card">
            <span className="roca-summary-card__value" style={{ color: NEON_GREEN }}>
              5
            </span>
            <span className="roca-summary-card__label">Aplicações Agendadas</span>
          </div>
        </div>

        <div className="roca-filters">
          {FILTERS.map((filter) => {
            const isActive = filter === activeFilter
            return (
              <button
                key={filter}
                type="button"
                className={`roca-filter-button ${isActive ? 'roca-filter-button--active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            )
          })}
        </div>

        <div className="roca-form-wrapper">
          <NovoLoteForm onCreated={refetchLotes} />
        </div>

        {loading ? <p className="roca-page__status">Carregando lotes...</p> : null}
        {error ? (
          <p className="alert alert--error" role="alert">
            {error}
          </p>
        ) : null}

        {!loading && !error ? (
          lotesFiltrados.length === 0 ? (
            <p className="roca-page__empty">Nenhum lote encontrado para esta cultura.</p>
          ) : (
            <div className="roca-lote-list">
              {lotesFiltrados.map((lote) => (
                <LoteCard
                  key={lote.id}
                  lote={lote}
                  itensEstoque={itensEstoque}
                  onLoteRemovido={refetchLotes}
                  onLoteAlterado={refetchLotes}
                  onEstoqueAlterado={refetchEstoque}
                />
              ))}
            </div>
          )
        ) : null}
      </div>
    </section>
  )
}
