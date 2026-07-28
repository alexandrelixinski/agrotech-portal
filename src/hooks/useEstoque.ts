import { useCallback, useEffect, useState } from 'react'

import { listItensEstoque } from '@/services/estoque'
import type { ItemEstoque } from '@/types'

type UseEstoqueResult = {
  itens: ItemEstoque[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useEstoque(): UseEstoqueResult {
  const [itens, setItens] = useState<ItemEstoque[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)

    listItensEstoque()
      .then((data) => {
        if (active) setItens(data)
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : 'Erro inesperado')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [version])

  const refetch = useCallback(() => setVersion((v) => v + 1), [])

  return { itens, loading, error, refetch }
}
