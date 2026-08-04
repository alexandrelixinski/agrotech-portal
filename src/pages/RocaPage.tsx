import { useMemo, useState } from 'react'
import { LoteCard } from '@/components/roca/LoteCard'
import { NovoLoteForm } from '@/components/roca/NovoLoteForm'
import { useEstoque } from '@/hooks/useEstoque'
import { useLotes } from '@/hooks/useLotes'

export function RocaPage() {
  const { lotes, loading, error, refetch: refetchLotes } = useLotes()
  const { itens: itensEstoque, refetch: refetchEstoque } = useEstoque()

  const [showNovoLoteModal, setShowNovoLoteModal] = useState(false)

  const listaLotes = lotes ?? []
  const totalLotes = listaLotes.length
  const areaTotalHa = useMemo(
    () => listaLotes.reduce((total, lote) => total + Number(lote.areaHectares || 0), 0),
    [listaLotes]
  )

  return (
    <section className="roca-page">
      <div className="roca-page__inner">
        <header className="roca-page__header">
          <div>
            <p className="roca-page__eyebrow">Minha Roça</p>
            <h1 className="roca-page__title">Lavoura</h1>
            <p className="roca-page__subtitle">Controle seus lotes, acompanhe áreas e organize operações com clareza.</p>
          </div>
          <span className="roca-page__tag">Safra 25/26</span>
        </header>

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
                culturaPadrao={activeFilter !== 'Todos' ? activeFilter : undefined}
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
