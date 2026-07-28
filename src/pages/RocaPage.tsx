import { LoteCard } from '@/components/roca/LoteCard'
import { NovoLoteForm } from '@/components/roca/NovoLoteForm'
import { useEstoque } from '@/hooks/useEstoque'
import { useLotes } from '@/hooks/useLotes'

export function RocaPage() {
  const { lotes, loading, error, refetch: refetchLotes } = useLotes()
  const { itens: itensEstoque, refetch: refetchEstoque } = useEstoque()

  return (
    <section className="stack">
      <header className="page-header">
        <h1>🚜 Minha Roça</h1>
        <p>Gerenciamento de safras e lotes.</p>
      </header>

      <NovoLoteForm onCreated={refetchLotes} />

      {loading ? <p>Carregando lotes…</p> : null}
      {error ? <p className="alert alert--error" role="alert">{error}</p> : null}

      {!loading && !error ? (
        lotes.length === 0 ? (
          <p>Nenhum lote cadastrado. Use o formulário acima para começar!</p>
        ) : (
          <div className="stack-sm">
            {lotes.map((lote) => (
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
    </section>
  )
}
