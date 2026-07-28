import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { hojeIso } from '@/lib/format'
import { createItemEstoque, updateQuantidadeItemEstoque } from '@/services/estoque'
import { updateLoteCustoTotal } from '@/services/lotes'
import { createMovimentacao } from '@/services/movimentacoes'
import type { ItemEstoque, Lote } from '@/types'

type Categoria = 'insumo' | 'mao_de_obra' | 'diesel' | 'nota'

const CATEGORIAS: { value: Categoria; label: string }[] = [
  { value: 'insumo', label: 'Insumo (Galpão)' },
  { value: 'mao_de_obra', label: 'Mão de Obra (Peão)' },
  { value: 'diesel', label: 'Diesel / Máquina' },
  { value: 'nota', label: 'Outros' },
]

const NOVO_PRODUTO = '__novo__'

type OperacaoFormProps = {
  lote: Lote
  itensEstoque: ItemEstoque[]
  onRegistrado: () => void
  onEstoqueAlterado: () => void
}

export function OperacaoForm({ lote, itensEstoque, onRegistrado, onEstoqueAlterado }: OperacaoFormProps) {
  const [categoria, setCategoria] = useState<Categoria>('insumo')
  const [produtoId, setProdutoId] = useState<string>(itensEstoque[0]?.id ?? NOVO_PRODUTO)
  const [data, setData] = useState(hojeIso())
  const [descricao, setDescricao] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [valor, setValor] = useState('')
  const [nomeNovoProduto, setNomeNovoProduto] = useState('')
  const [unidadeNovoProduto, setUnidadeNovoProduto] = useState('L')
  const [precoNovoProduto, setPrecoNovoProduto] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const itemSelecionado = itensEstoque.find((it) => it.id === produtoId) ?? null
  const qtdNumero = Number(quantidade) || 0
  const saldoInsuficiente = categoria === 'insumo' && itemSelecionado != null && qtdNumero > itemSelecionado.quantidade

  function limpar() {
    setDescricao('')
    setQuantidade('')
    setValor('')
    setNomeNovoProduto('')
    setPrecoNovoProduto('')
    setData(hojeIso())
  }

  async function registrarInsumoExistente() {
    if (!itemSelecionado) throw new Error('Selecione um produto do galpão')
    const valorGasto = qtdNumero * itemSelecionado.precoUnitario
    await createMovimentacao({
      loteId: lote.id,
      itemEstoqueId: itemSelecionado.id,
      tipo: 'insumo',
      descricao: `Aplicado ${qtdNumero} ${itemSelecionado.unidade} de ${itemSelecionado.nome}`,
      quantidade: qtdNumero,
      valor: valorGasto,
      data,
    })
    await updateQuantidadeItemEstoque(itemSelecionado.id, itemSelecionado.quantidade - qtdNumero)
    await updateLoteCustoTotal(lote.id, lote.custoTotal + valorGasto)
    onEstoqueAlterado()
  }

  async function registrarCompraDireta() {
    if (!nomeNovoProduto.trim()) throw new Error('Informe o nome do produto')
    const preco = Number(precoNovoProduto) || 0
    const valorGasto = qtdNumero * preco
    const existente = itensEstoque.find((it) => it.nome.toLowerCase() === nomeNovoProduto.trim().toLowerCase())

    let itemEstoqueId: string
    if (existente) {
      await updateQuantidadeItemEstoque(existente.id, existente.quantidade + qtdNumero)
      itemEstoqueId = existente.id
    } else {
      const criado = await createItemEstoque({
        nome: nomeNovoProduto.trim(),
        categoria: 'Outros',
        quantidade: qtdNumero,
        unidade: unidadeNovoProduto,
        precoUnitario: preco,
      })
      itemEstoqueId = criado.id
    }

    await createMovimentacao({
      loteId: lote.id,
      itemEstoqueId,
      tipo: 'compra_avulsa',
      descricao: `Compra: ${nomeNovoProduto.trim()} -> ${qtdNumero} ${unidadeNovoProduto}`,
      quantidade: qtdNumero,
      valor: valorGasto,
      data,
    })
    await updateLoteCustoTotal(lote.id, lote.custoTotal + valorGasto)
    onEstoqueAlterado()
  }

  async function registrarCustoSimples(tipo: 'mao_de_obra' | 'diesel' | 'nota') {
    const valorNum = Number(valor) || 0
    await createMovimentacao({
      loteId: lote.id,
      tipo,
      descricao: descricao.trim() || null,
      valor: valorNum,
      data,
    })
    if (valorNum !== 0) {
      await updateLoteCustoTotal(lote.id, lote.custoTotal + valorNum)
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      if (categoria === 'insumo') {
        if (produtoId === NOVO_PRODUTO) {
          await registrarCompraDireta()
        } else {
          await registrarInsumoExistente()
        }
      } else {
        await registrarCustoSimples(categoria)
      }
      limpar()
      onRegistrado()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar operação')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor={`tipo-op-${lote.id}`}>Tipo de Operação</label>
        <select
          id={`tipo-op-${lote.id}`}
          value={categoria}
          onChange={(e) => setCategoria(e.target.value as Categoria)}
        >
          {CATEGORIAS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {categoria === 'insumo' ? (
        <>
          <div className="field">
            <label htmlFor={`produto-${lote.id}`}>Produto</label>
            <select id={`produto-${lote.id}`} value={produtoId} onChange={(e) => setProdutoId(e.target.value)}>
              {itensEstoque.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.nome} ({it.categoria})
                </option>
              ))}
              <option value={NOVO_PRODUTO}>Compra Direta (Novo Produto)</option>
            </select>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor={`data-${lote.id}`}>Data</label>
              <input id={`data-${lote.id}`} type="date" value={data} onChange={(e) => setData(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor={`qtd-${lote.id}`}>Qtd {itemSelecionado ? `(${itemSelecionado.unidade})` : ''}</label>
              <input
                id={`qtd-${lote.id}`}
                type="number"
                min="0"
                step="0.001"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </div>
          </div>

          {produtoId === NOVO_PRODUTO ? (
            <div className="form-row">
              <div className="field">
                <label htmlFor={`nome-novo-${lote.id}`}>Nome do Produto</label>
                <input
                  id={`nome-novo-${lote.id}`}
                  value={nomeNovoProduto}
                  onChange={(e) => setNomeNovoProduto(e.target.value)}
                  placeholder="Ex: Inseticida X"
                />
              </div>
              <div className="field">
                <label htmlFor={`unid-novo-${lote.id}`}>Unidade</label>
                <select
                  id={`unid-novo-${lote.id}`}
                  value={unidadeNovoProduto}
                  onChange={(e) => setUnidadeNovoProduto(e.target.value)}
                >
                  <option value="L">L</option>
                  <option value="Kg">Kg</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor={`preco-novo-${lote.id}`}>Preço (R$)</label>
                <input
                  id={`preco-novo-${lote.id}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={precoNovoProduto}
                  onChange={(e) => setPrecoNovoProduto(e.target.value)}
                />
              </div>
            </div>
          ) : null}

          {saldoInsuficiente ? (
            <p className="alert alert--warning">
              ⚠️ Saldo insuficiente! Saldo: {itemSelecionado?.quantidade} {itemSelecionado?.unidade}
            </p>
          ) : null}
        </>
      ) : null}

      {categoria === 'mao_de_obra' || categoria === 'diesel' || categoria === 'nota' ? (
        <div className="form-row">
          <div className="field">
            <label htmlFor={`data-${lote.id}`}>Data</label>
            <input id={`data-${lote.id}`} type="date" value={data} onChange={(e) => setData(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor={`desc-${lote.id}`}>
              {categoria === 'mao_de_obra' ? 'Descrição (Ex: Capina manual)' : categoria === 'diesel' ? 'Operação (Ex: Gradagem)' : 'Descrição'}
            </label>
            <input id={`desc-${lote.id}`} value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor={`valor-${lote.id}`}>Valor (R$)</label>
            <input
              id={`valor-${lote.id}`}
              type="number"
              min="0"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </div>
        </div>
      ) : null}

      {error ? <p className="alert alert--error" role="alert">{error}</p> : null}

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Registrando…' : '🚀 Registrar'}
      </Button>
    </form>
  )
}
