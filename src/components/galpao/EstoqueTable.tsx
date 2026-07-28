import { useState } from 'react'

import { formatCurrency } from '@/lib/format'
import { deleteItemEstoque } from '@/services/estoque'
import type { ItemEstoque } from '@/types'

type EstoqueTableProps = {
  itens: ItemEstoque[]
  onDeleted: () => void
}

export function EstoqueTable({ itens, onDeleted }: EstoqueTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(item: ItemEstoque) {
    if (!window.confirm(`Excluir "${item.nome}"?`)) return
    setDeletingId(item.id)
    try {
      await deleteItemEstoque(item.id)
      onDeleted()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Estoque</th>
            <th>Unitário</th>
            <th>Total</th>
            <th>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((it) => (
            <tr key={it.id}>
              <td>
                {it.quantidade <= 5 ? '🔴' : '🟢'} {it.nome}
              </td>
              <td>
                {it.quantidade} {it.unidade}
              </td>
              <td>{formatCurrency(it.precoUnitario)}</td>
              <td>{formatCurrency(it.quantidade * it.precoUnitario)}</td>
              <td>
                <button
                  type="button"
                  className="icon-btn"
                  disabled={deletingId === it.id}
                  onClick={() => handleDelete(it)}
                  aria-label={`Excluir ${it.nome}`}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
