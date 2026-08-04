import { useMemo, useState } from 'react'
import { LoteCard } from '@/components/roca/LoteCard'
import { NovoLoteForm } from '@/components/roca/NovoLoteForm'
import { useEstoque } from '@/hooks/useEstoque'
import { useLotes } from '@/hooks/useLotes'

export function RocaPage() {
  const { lotes, loading, error, refetch: refetchLotes } = useLotes()
  const { itens: itensEstoque, refetch: refetchEstoque } = useEstoque()

  const [activeFilter, setActiveFilter] = useState<string>('Todos')
  const [showNovoLoteModal, setShowNovoLoteModal] = useState(false)

  const listaLotes = lotes ?? []
  const culturasDisponiveis = useMemo(() => {
    const culturasSet = new Set<string>()
    listaLotes.forEach((lote) => {
      if (lote.cultura?.trim()) {
        culturasSet.add(lote.cultura.trim())
      }
    })
    return ['Todos', ...Array.from(culturasSet)]
  }, [listaLotes])

  const lotesFiltrados = useMemo(() => {
    if (activeFilter === 'Todos') return listaLotes
    return listaLotes.filter((lote) => lote.cultura?.trim().toLowerCase() === activeFilter.toLowerCase())
  }, [listaLotes, activeFilter])

  const totalLotes = lotesFiltrados.length
  const areaTotalHa = useMemo(
    () => lotesFiltrados.reduce((total, lote) => total + Number(lote.areaHectares || 0), 0),
    [lotesFiltrados]
  )

  return (
    <section className="roca-page">
      <div className="roca-page__inner">
        <div className="roca-filters">
          {culturasDisponiveis.map((filter) => {
            const isActive = filter === activeFilter
            return (
              <button
                key={filter}
                type="button"
                className={`roca-filter-chip ${isActive ? 'roca-filter-chip--active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            )
          })}
        </div>

        <div className="roca-summary-grid">
          <div className="roca-summary-card">
            <span className="roca-summary-card__title">Total de lotes</span>
            <strong>{totalLotes}</strong>
          </div>
          <div className="roca-summary-card">
            <span className="roca-summary-card__title">Área plantada</span>
            <strong>{areaTotalHa.toFixed(1)} ha</strong>
          </div>
        </div>

        <div className="roca-filters">
          {culturasDisponiveis.map((filter) => {
            const isActive = filter === activeFilter
            return (
              <button
                key={filter}
                type="button"
                className={`roca-filter-chip ${isActive ? 'roca-filter-chip--active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            )
          })}
        </div>

        <div className="roca-main-grid">
          <div className="roca-panel roca-panel--list">
            <div className="roca-panel__header roca-panel__header--compact">
              <div>
                <h2>Lotes cadastrados</h2>
              </div>
            </div>

            {loading ? <p className="roca-page__status">Carregando lotes...</p> : null}
            {error ? (
              <p className="alert alert--error" role="alert">
                {error}
              </p>
            ) : null}

            {!loading && !error ? (
              listaLotes.length === 0 ? (
                <p className="roca-page__empty">
                  Nenhum lote cadastrado. Cadastre o primeiro lote para começar.
                </p>
              ) : (
                <div className="roca-lote-list">
                  {listaLotes.map((lote) => (
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
        </div>

        <button
          type="button"
          className="roca-add-button"
          onClick={() => setShowNovoLoteModal(true)}
          aria-label="Adicionar novo lote"
        >
          +
        </button>

        {showNovoLoteModal ? (
          <div className="roca-modal-backdrop" onClick={() => setShowNovoLoteModal(false)}>
            <div className="roca-modal" onClick={(event) => event.stopPropagation()}>
              <div className="roca-modal__header">
                <div>
                  <h2>Adicionar novo lote</h2>
                  <p>Digite a cultura e os dados do lote no mesmo lugar.</p>
                </div>
                <button
                  type="button"
                  className="roca-modal__close"
                  onClick={() => setShowNovoLoteModal(false)}
                  aria-label="Fechar modal"
                >
                  ×
                </button>
              </div>

              <NovoLoteForm
                onCreated={() => {
                  refetchLotes()
                  setShowNovoLoteModal(false)
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
