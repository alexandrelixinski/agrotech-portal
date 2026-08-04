import { useMemo, useState } from 'react'
import { LoteCard } from '@/components/roca/LoteCard'
import { NovoLoteForm } from '@/components/roca/NovoLoteForm'
import { useEstoque } from '@/hooks/useEstoque'
import { useLotes } from '@/hooks/useLotes'

export function RocaPage() {
  const { lotes, loading, error, refetch: refetchLotes } = useLotes()
  const { itens: itensEstoque, refetch: refetchEstoque } = useEstoque()

  const [activeFilter, setActiveFilter] = useState<string>('Todos')

  const listaLotes = lotes ?? []
  const totalLotes = listaLotes.length
  const areaTotalHa = useMemo(
    () => listaLotes.reduce((total, lote) => total + Number(lote.areaHectares || 0), 0),
    [listaLotes]
  )

  const culturasDisponiveis = useMemo(() => {
    const culturasSet = new Set<string>()
    listaLotes.forEach((lote) => {
      if (lote.cultura && lote.cultura.trim() !== '') {
        culturasSet.add(lote.cultura.trim())
      }
    })
    return ['Todos', ...Array.from(culturasSet)]
  }, [listaLotes])

  const lotesFiltrados = useMemo(() => {
    if (activeFilter === 'Todos') return listaLotes
    return listaLotes.filter((lote) => lote.cultura?.toLowerCase() === activeFilter.toLowerCase())
  }, [listaLotes, activeFilter])

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

        <div className="roca-main-grid">
          <div className="roca-panel roca-panel--form">
            <div className="roca-panel__header">
              <h2>Criar novo lote</h2>
              <p>Preencha os dados principais e mantenha o controle do seu plantio.</p>
            </div>
            <NovoLoteForm
              onCreated={refetchLotes}
              culturaPadrao={activeFilter !== 'Todos' ? activeFilter : undefined}
            />
          </div>

          <div className="roca-panel roca-panel--list">
            <div className="roca-panel__header roca-panel__header--compact">
              <div>
                <h2>Lotes cadastrados</h2>
                <p>Lista de lotes atualizada para acesso rápido.</p>
              </div>
              <div className="roca-filter-group">
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
            </div>

            {loading ? <p className="roca-page__status">Carregando lotes...</p> : null}
            {error ? (
              <p className="alert alert--error" role="alert">
                {error}
              </p>
            ) : null}

            {!loading && !error ? (
              lotesFiltrados.length === 0 ? (
                <p className="roca-page__empty">
                  {activeFilter === 'Todos'
                    ? 'Nenhum lote cadastrado. Cadastre o primeiro lote para começar.'
                    : `Nenhum lote encontrado para a cultura "${activeFilter}".`}
                </p>
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
        </div>
      </div>
    </section>
  )
}
