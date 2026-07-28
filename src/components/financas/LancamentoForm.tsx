import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { hojeIso } from '@/lib/format'
import { createLancamentoFinanceiro } from '@/services/financas'
import { createVenda } from '@/services/vendas'
import type { Lote } from '@/types'

const GERAL = '__geral__'

type Tipo = 'gasto' | 'venda'

type LancamentoFormProps = {
  lotes: Lote[]
  onSaved: () => void
}

export function LancamentoForm({ lotes, onSaved }: LancamentoFormProps) {
  const [tipo, setTipo] = useState<Tipo>('gasto')
  const [loteId, setLoteId] = useState<string>(lotes[0]?.id ?? GERAL)
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function limpar() {
    setDescricao('')
    setValor('')
    setQuantidade('')
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      if (tipo === 'gasto') {
        await createLancamentoFinanceiro({
          descricao: descricao.trim() || '(sem descrição)',
          valor: Number(valor) || 0,
          loteId: loteId === GERAL ? null : loteId,
          data: hojeIso(),
        })
      } else {
        if (!lotes.length) return
        await createVenda({
          loteId,
          quantidade: Number(quantidade) || 0,
          valorTotal: Number(valor) || 0,
          data: hojeIso(),
        })
      }
      limpar()
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar lançamento')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="stack-sm">
      <h3 className="card__title">📝 Lançar Movimentação</h3>

      <div className="category-tabs">
        <button
          type="button"
          className={tipo === 'gasto' ? 'category-tabs__btn category-tabs__btn--active' : 'category-tabs__btn'}
          onClick={() => setTipo('gasto')}
        >
          Gasto Operacional
        </button>
        <button
          type="button"
          className={tipo === 'venda' ? 'category-tabs__btn category-tabs__btn--active' : 'category-tabs__btn'}
          onClick={() => setTipo('venda')}
        >
          Venda de Safra
        </button>
      </div>

      {tipo === 'venda' && lotes.length === 0 ? (
        <p className="alert alert--warning">Cadastre um lote na Roça primeiro.</p>
      ) : (
        <form className="form-grid" onSubmit={handleSubmit}>
          {tipo === 'gasto' ? (
            <>
              <div className="field">
                <label htmlFor="desc-gasto">Descrição (Ex: Diesel, Peão)</label>
                <input id="desc-gasto" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
              </div>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="valor-gasto">Valor R$</label>
                  <input
                    id="valor-gasto"
                    type="number"
                    min="0"
                    step="0.01"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="lote-gasto">Vincular a</label>
                  <select id="lote-gasto" value={loteId} onChange={(e) => setLoteId(e.target.value)}>
                    <option value={GERAL}>Geral</option>
                    {lotes.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.cultura}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="field">
                <label htmlFor="lote-venda">Lote Vendido</label>
                <select id="lote-venda" value={loteId} onChange={(e) => setLoteId(e.target.value)}>
                  {lotes.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.cultura}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="qtd-venda">Qtd Vendida</label>
                  <input
                    id="qtd-venda"
                    type="number"
                    min="0"
                    step="0.01"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="valor-venda">Valor Total R$</label>
                  <input
                    id="valor-venda"
                    type="number"
                    min="0"
                    step="0.01"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {error ? (
            <p className="alert alert--error" role="alert">
              {error}
            </p>
          ) : null}

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Registrando…' : tipo === 'gasto' ? 'Registrar Gasto' : 'Registrar Venda'}
          </Button>
        </form>
      )}
    </div>
  )
}
