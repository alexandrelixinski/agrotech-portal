import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { useMovimentacoes } from '@/hooks/useMovimentacoes'
import { formatCurrency, formatDateBR, hojeIso } from '@/lib/format'
import { updateQuantidadeItemEstoque } from '@/services/estoque'
import { updateLoteCustoTotal } from '@/services/lotes'
import { createMovimentacao, deleteMovimentacao } from '@/services/movimentacoes'
import type { ItemEstoque, Lote } from '@/types'

type DiarioProps = {
  lote: Lote
  itensEstoque: ItemEstoque[]
  onLoteAlterado: () => void
  onEstoqueAlterado: () => void
}

export function Diario({ lote, itensEstoque, onLoteAlterado, onEstoqueAlterado }: DiarioProps) {
  const { movimentacoes, loading, error, refetch } = useMovimentacoes(lote.id)
  const [novaNota, setNovaNota] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleAddNota(event: React.FormEvent) {
    event.preventDefault()
    if (!novaNota.trim()) return
    setSubmitting(true)
    try {
      await createMovimentacao({
        loteId: lote.id,
        tipo: 'nota',
        descricao: novaNota.trim(),
        valor: 0,
        data: hojeIso(),
      })
      setNovaNota('')
      refetch()
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(movimentacaoId: string) {
    const mov = movimentacoes.find((m) => m.id === movimentacaoId)
    if (!mov) return

    setDeletingId(mov.id)
    try {
      if (mov.itemEstoqueId && mov.quantidade) {
        const item = itensEstoque.find((it) => it.id === mov.itemEstoqueId)
        if (item) {
          await updateQuantidadeItemEstoque(item.id, item.quantidade + mov.quantidade)
          onEstoqueAlterado()
        }
      }
      if (mov.valor) {
        await updateLoteCustoTotal(lote.id, Math.max(0, lote.custoTotal - mov.valor))
        onLoteAlterado()
      }
      await deleteMovimentacao(mov.id)
      refetch()
    } finally {
      setDeletingId(null)
    }
  }

  const ordenado = [...movimentacoes].sort((a, b) => b.data.localeCompare(a.data))

  return (
    <div className="stack-sm">
      <form className="form-row" onSubmit={handleAddNota}>
        <input
          value={novaNota}
          onChange={(e) => setNovaNota(e.target.value)}
          placeholder="Anotação…"
          aria-label="Nova anotação"
        />
        <Button type="submit" variant="ghost" disabled={submitting || !novaNota.trim()}>
          Salvar Nota
        </Button>
      </form>

      {loading ? <p className="lote-card__meta">Carregando histórico…</p> : null}
      {error ? <p className="alert alert--error" role="alert">{error}</p> : null}
      {!loading && ordenado.length === 0 ? <p className="lote-card__meta">Nenhum registro.</p> : null}

      {ordenado.map((mov) => (
        <div className="diario-item" key={mov.id}>
          <span className="diario-item__desc">
            {mov.agendado ? '⏳ ' : mov.tipo === 'nota' ? '📝 ' : '✅ '}
            {mov.descricao}
            {mov.valor ? ` — ${formatCurrency(mov.valor)}` : ''}
          </span>
          <span className="diario-item__meta">
            {formatDateBR(mov.data)}
            <button
              type="button"
              className="icon-btn"
              aria-label="Remover registro"
              disabled={deletingId === mov.id}
              onClick={() => handleDelete(mov.id)}
            >
              ❌
            </button>
          </span>
        </div>
      ))}
    </div>
  )
}
