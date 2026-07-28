import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CATEGORIA_INSUMO_LABELS, CATEGORIA_ORDEM } from '@/lib/labels'
import { createItemEstoque, restockItemEstoque } from '@/services/estoque'
import type { CategoriaInsumo, ItemEstoque } from '@/types'

type NovoInsumoFormProps = {
  itens: ItemEstoque[]
  onSaved: () => void
}

export function NovoInsumoForm({ itens, onSaved }: NovoInsumoFormProps) {
  const [nome, setNome] = useState('')
  const [categoria, setCategoria] = useState<CategoriaInsumo>('Sementes')
  const [quantidade, setQuantidade] = useState('')
  const [preco, setPreco] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mensagem, setMensagem] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!nome.trim()) return

    setSubmitting(true)
    setError(null)
    setMensagem(null)
    try {
      const qtd = Number(quantidade) || 0
      const precoNum = Number(preco) || 0
      const existente = itens.find(
        (it) => it.nome.toLowerCase() === nome.trim().toLowerCase() && it.categoria === categoria,
      )

      if (existente) {
        await restockItemEstoque(existente.id, {
          quantidade: existente.quantidade + qtd,
          precoUnitario: precoNum,
        })
        setMensagem(`Quantidade de "${nome}" atualizada!`)
      } else {
        await createItemEstoque({ nome: nome.trim(), categoria, quantidade: qtd, unidade: 'un', precoUnitario: precoNum })
        setMensagem(`"${nome}" cadastrado com sucesso!`)
      }

      setNome('')
      setQuantidade('')
      setPreco('')
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar insumo')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card title="Novo Insumo">
      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="field">
            <label htmlFor="nome-insumo">Nome</label>
            <input id="nome-insumo" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="categoria-insumo">Categoria</label>
            <select
              id="categoria-insumo"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as CategoriaInsumo)}
            >
              {CATEGORIA_ORDEM.map((c) => (
                <option key={c} value={c}>
                  {CATEGORIA_INSUMO_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="qtd-insumo">Qtd</label>
            <input
              id="qtd-insumo"
              type="number"
              min="0"
              step="0.001"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="preco-insumo">Preço Unitário</label>
            <input
              id="preco-insumo"
              type="number"
              min="0"
              step="0.01"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
            />
          </div>
        </div>

        {mensagem ? <p className="lote-card__meta">{mensagem}</p> : null}
        {error ? <p className="alert alert--error" role="alert">{error}</p> : null}

        <Button type="submit" disabled={submitting || !nome.trim()}>
          {submitting ? 'Salvando…' : 'Salvar Insumo'}
        </Button>
      </form>
    </Card>
  )
}
